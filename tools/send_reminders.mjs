#!/usr/bin/env node
// 알뜰(Eggarden) 리마인더 발송 — GitHub Actions 스케줄 크론에서 실행(서버리스, Blaze 불필요).
// firebase-admin으로 RTDB를 읽어 대상(오늘 미기록 + 알림 토큰 보유)을 고르고 FCM 데이터 메시지로 발송.
// 인증: env FIREBASE_SERVICE_ACCOUNT = 서비스계정 JSON(문자열). 없으면 안전하게 no-op 종료.
//
// 실행: node tools/send_reminders.mjs [--type=daily|gift|todo|todotime|harvest] [--dry]
//   --type=daily    : 오늘 활동 미기록자에게 "오늘 기록하면 +은화" 넛지(기본, 20:00 KST 1회)
//   --type=gift     : mailbox에 미수령 친구 선물이 있는 사용자에게 "선물 도착" 알림(매시, 중복은 pushMeta.lastGiftNotify로 방지)
//   --type=todo     : 🌅 아침 브리핑 — 오늘/지난 미완료 할일 + 오늘·내일 구독 결제 + 오늘 적금 납입을 한 알림으로(아침 1회, pushMeta.lastTodoNotify)
//   --type=todotime : ⏰ 마감 시간 리마인더 — dueTime이 있는 오늘 할일이 35분 안에 마감이면 알림(30분 크론, pushMeta.lastTodoTimeNotify 워터마크)
//   --type=harvest  : 🌾 수확 리마인더 — 유휴 수확이 20시간 이상 쌓인(24h 캡 임박) 사용자에게 하루 1회(pushMeta.lastHarvestNotify)
//   --dry           : 실제 발송 안 하고 대상만 출력

import admin from 'firebase-admin';

const DB_URL = 'https://money-bb658-default-rtdb.asia-southeast1.firebasedatabase.app';
const DRY = process.argv.includes('--dry');
const TYPE = (process.argv.find(a => a.startsWith('--type=')) || '--type=daily').split('=')[1];

function kstDayKey(ms) { return new Date((ms || Date.now()) + 9 * 3600 * 1000).toISOString().slice(0, 10); }

const MESSAGES = {
  daily:    { title: '알뜰 🐾', body: '오늘 거래·할일을 기록하면 +5 은화! 출석 스트릭도 이어가요.', url: './' },
  pet:      { title: '알뜰 🐱', body: '펫이 배고파해요. 밥·물 그릇을 채워주세요!', url: './' },
  gift:     { title: '알뜰 🎁', body: '친구가 선물을 보냈어요! 선물함에서 받아보세요.', url: './' },
  todo:     { title: '알뜰 🌅', body: '오늘 마감인 할일이 있어요. 확인해 보세요!', url: './' },
  todotime: { title: '알뜰 ⏰', body: '곧 마감인 할일이 있어요!', url: './' },
  harvest:  { title: '알뜰 🌾', body: '수확이 가득 찼어요! 은화가 기다리고 있어요.', url: './' },
};

function initAdmin() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) { console.log('· FIREBASE_SERVICE_ACCOUNT 없음 → no-op 종료(설정 전이면 정상).'); return null; }
  let cred; try { cred = JSON.parse(raw); } catch (e) { console.error('✗ 서비스계정 JSON 파싱 실패'); process.exit(1); }
  admin.initializeApp({ credential: admin.credential.cert(cred), databaseURL: DB_URL });
  return admin;
}

// 대상 선정: 오늘(KST) 'record' 일일미션 미수령 + push 토큰 보유
function pickDaily(users, today) {
  const out = [];
  for (const uid of Object.keys(users || {})) {
    const u = users[uid] || {};
    const token = u.push && u.push.token; if (!token) continue;
    const claimedToday = !!(u.game && u.game.missions && u.game.missions[today] && u.game.missions[today].record && u.game.missions[today].record.claimed);
    if (!claimedToday) out.push({ uid, token });
  }
  return out;
}

// 대상 선정(gift): mailbox에 미수령 친구 선물이 있고, 가장 최근 선물(at)이 pushMeta.lastGiftNotify 이후 + push 토큰 보유.
// 워터마크(lastGiftNotify)를 발송 후 최신 선물 시각으로 올려 매시 크론이 같은 선물을 반복 알림하지 않게 함.
function pickGifts(users) {
  const out = [];
  for (const uid of Object.keys(users || {})) {
    const u = users[uid] || {};
    const token = u.push && u.push.token; if (!token) continue;
    const mb = u.mailbox; if (!mb || typeof mb !== 'object') continue;
    let count = 0, newest = '';
    for (const sender of Object.keys(mb)) {
      const bySender = mb[sender] || {};
      for (const gid of Object.keys(bySender)) {
        const g = bySender[gid]; if (!g) continue;
        count++;
        const at = (g.at || '') + '';
        if (at > newest) newest = at;
      }
    }
    if (!count) continue;
    const last = (u.pushMeta && u.pushMeta.lastGiftNotify) || '';
    if (newest && newest > last) out.push({ uid, token, count, newest });
  }
  return out;
}

// 그룹(ws) 할일을 담당자 uid별로 인덱싱 — /ws 스냅샷에서 assignedUid가 있는 할일만.
function buildGroupTodoIndex(wsAll) {
  const idx = {};
  for (const wsId of Object.keys(wsAll || {})) {
    const todos = (wsAll[wsId] || {}).todos || {};
    for (const id of Object.keys(todos)) {
      const t = todos[id]; if (!t || !t.assignedUid) continue;
      (idx[t.assignedUid] = idx[t.assignedUid] || []).push(t);
    }
  }
  return idx;
}
// 월 말일 클램프 날짜 문자열
function clampYmdStr(y, m, dd) { const last = new Date(Date.UTC(y, m, 0)).getUTCDate(); const v = Math.min(dd, last); return y + '-' + String(m).padStart(2, '0') + '-' + String(v).padStart(2, '0'); }
// 구독 다음 결제일을 오늘 이후로 굴림(앱 effNextBilling의 축약판 — 알림용 근사, 말일 앵커 드리프트 허용)
function subNextBill(s, today) {
  let d = String(s.nextBillingDate || '').slice(0, 10); if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return '';
  const iv = Math.max(1, Number(s.billingInterval) || 1);
  let guard = 0;
  while (d < today && guard++ < 600) {
    const [y, m, dd] = d.split('-').map(Number);
    if (s.billingCycle === 'weekly') { const t = new Date(Date.UTC(y, m - 1, dd + 7 * iv)); d = t.toISOString().slice(0, 10); }
    else if (s.billingCycle === 'yearly') { d = clampYmdStr(y + iv, m, dd); }
    else { let nm = m + iv, ny = y; while (nm > 12) { nm -= 12; ny++; } d = clampYmdStr(ny, nm, dd); }
  }
  return d;
}
// 🌅 브리핑 부가정보 — 이 사용자가 속한 ws들의 '오늘·내일 결제 구독' + '오늘 적금 납입(정기 savingsId 규칙 day 매칭)' 건수
function briefingExtras(u, wsAll, today, tomorrow) {
  let subs = 0, sav = 0;
  for (const wid of Object.keys(u.ws || {})) {
    const w = wsAll[wid] || {};
    const ss = w.subscriptions || {};
    for (const k of Object.keys(ss)) { const s = ss[k]; if (!s || (s.status || 'active') !== 'active') continue;
      const nb = subNextBill(s, today); if (nb === today || nb === tomorrow) subs++; }
    const rec = w.recurring || {};
    for (const owner of Object.keys(rec)) { const rules = rec[owner] || {};
      for (const rid of Object.keys(rules)) { const r = rules[rid]; if (!r || !r.savingsId) continue;
        if ((r.status || (r.active === false ? 'paused' : 'active')) !== 'active') continue;
        if (r.endDate && String(r.endDate) < today) continue;
        if (Number(r.day) === Number(today.slice(8, 10))) sav++; } }
  }
  return { subs, sav };
}
// 대상 선정(todo=🌅 아침 브리핑): 개인 할일 + 담당 그룹 할일 중 '오늘 마감 또는 마감 지남 & 미완료' + 오늘·내일 구독 결제 + 오늘 적금 납입.
// 하루 1회만(pushMeta.lastTodoNotify===today면 스킵). dueDate는 날짜문자열, today는 KST라 비교가 KST 기준으로 일관.
function pickTodos(users, wsAll, today) {
  const gidx = buildGroupTodoIndex(wsAll);
  const tomorrow = kstDayKey(Date.now() + 24 * 3600 * 1000);
  const out = [];
  for (const uid of Object.keys(users || {})) {
    const u = users[uid] || {};
    const token = u.push && u.push.token; if (!token) continue;
    if (u.pushMeta && u.pushMeta.lastTodoNotify === today) continue;   // 오늘 이미 알림
    const personal = u.todos ? Object.keys(u.todos).map(k => u.todos[k]) : [];
    const group = gidx[uid] || [];
    let dueToday = 0, overdue = 0;
    for (const t of personal.concat(group)) {
      if (!t || t.done || !t.dueDate) continue;   // 반복 할일은 done=false라 자연히 포함(마감일 기준)
      const d = String(t.dueDate).slice(0, 10);
      if (d === today) dueToday++; else if (d < today) overdue++;
    }
    const ex = briefingExtras(u, wsAll, today, tomorrow);
    if (dueToday + overdue + ex.subs + ex.sav > 0) out.push({ uid, token, dueToday, overdue, subs: ex.subs, sav: ex.sav });
  }
  return out;
}
// ⏰ 마감 시간 리마인더: 오늘 마감 + dueTime이 지금~35분 안이면 알림. 워터마크(lastTodoTimeNotify=알린 마지막 마감시각 ISO)로 반복 방지.
function addMinHM(hm, min) { const [h, m] = hm.split(':').map(Number); const tot = h * 60 + m + min; if (tot >= 1440) return '23:59'; return String(Math.floor(tot / 60)).padStart(2, '0') + ':' + String(tot % 60).padStart(2, '0'); }
function pickTodoTimes(users, wsAll, today, nowHM) {
  const gidx = buildGroupTodoIndex(wsAll);
  const endHM = addMinHM(nowHM, 35);
  const out = [];
  for (const uid of Object.keys(users || {})) {
    const u = users[uid] || {};
    const token = u.push && u.push.token; if (!token) continue;
    const wm = (u.pushMeta && u.pushMeta.lastTodoTimeNotify) || '';
    const personal = u.todos ? Object.keys(u.todos).map(k => u.todos[k]) : [];
    const items = [];
    for (const t of personal.concat(gidx[uid] || [])) {
      if (!t || t.done || !t.dueTime) continue;
      if (String(t.dueDate || '').slice(0, 10) !== today) continue;
      const tm = String(t.dueTime).slice(0, 5), dt = today + 'T' + tm;
      if (tm > nowHM && tm <= endHM && dt > wm) items.push({ title: t.title || '할일', time: tm, dt });
    }
    if (items.length) { items.sort((a, b) => (a.dt < b.dt ? -1 : 1)); out.push({ uid, token, items, newest: items[items.length - 1].dt }); }
  }
  return out;
}
// 🌾 수확 리마인더: 어느 방이든 harvestAt이 20시간 이상 지났으면(24h 캡 임박) 하루 1회.
function pickHarvest(users, today) {
  const out = [], now = Date.now(), H20 = 20 * 3600 * 1000;
  for (const uid of Object.keys(users || {})) {
    const u = users[uid] || {};
    const token = u.push && u.push.token; if (!token) continue;
    if (u.pushMeta && u.pushMeta.lastHarvestNotify === today) continue;
    const home = u.game && u.game.home; if (!home) continue;
    let rooms = home.rooms; if (!rooms) continue;
    if (!Array.isArray(rooms)) rooms = Object.keys(rooms).map(k => rooms[k]);   // RTDB 객체형 배열 방어
    let oldest = 0;
    for (const r of rooms) { if (!r) continue; const at = Number(r.harvestAt) || 0; if (at && (!oldest || at < oldest)) oldest = at; }
    if (oldest && now - oldest >= H20) out.push({ uid, token });
  }
  return out;
}

async function main() {
  const app = initAdmin(); if (!app) return;
  const today = kstDayKey();
  const snap = await admin.database().ref('/users').once('value');
  const users = snap.val() || {};
  let targets;
  if (TYPE === 'gift') targets = pickGifts(users);
  else if (TYPE === 'todo') { const wsSnap = await admin.database().ref('/ws').once('value'); targets = pickTodos(users, wsSnap.val() || {}, today); }
  else if (TYPE === 'todotime') {
    const nowHM = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(11, 16);   // KST HH:MM
    const wsSnap = await admin.database().ref('/ws').once('value');
    targets = pickTodoTimes(users, wsSnap.val() || {}, today, nowHM);
  }
  else if (TYPE === 'harvest') targets = pickHarvest(users, today);
  else targets = pickDaily(users, today);
  const msg = MESSAGES[TYPE] || MESSAGES.daily;
  console.log(`· type=${TYPE} today(KST)=${today} 대상=${targets.length}명${DRY ? ' (dry)' : ''}`);
  if (DRY) { targets.slice(0, 20).forEach(t => console.log('   → ' + t.uid + (t.count ? ' (선물 ' + t.count + ')' : '') + (t.dueToday != null ? ' (오늘 ' + t.dueToday + '·지남 ' + t.overdue + ')' : ''))); return; }

  let sent = 0, removed = 0;
  for (const t of targets) {
    let data;
    if (TYPE === 'gift') data = { title: '알뜰 🎁', body: `친구가 선물을 보냈어요! 선물함에 ${t.count}개가 있어요.`, url: './' };
    else if (TYPE === 'todo') {   // 🌅 아침 브리핑 — 할일·구독 결제·적금 납입을 한 줄로
      const parts = [];
      if (t.overdue) parts.push(`마감 지난 할일 ${t.overdue}개`);
      if (t.dueToday) parts.push(`오늘 마감 ${t.dueToday}개`);
      if (t.subs) parts.push(`오늘·내일 구독 결제 ${t.subs}건`);
      if (t.sav) parts.push(`오늘 적금 납입 ${t.sav}건`);
      data = { title: '알뜰 🌅', body: parts.join(' · ') + ' — 좋은 하루 보내세요!', url: './' };
    }
    else if (TYPE === 'todotime') { const f = t.items[0]; data = { title: '알뜰 ⏰', body: `${f.time} '${f.title}' 마감이 곧이에요` + (t.items.length > 1 ? ` 외 ${t.items.length - 1}개` : ''), url: './' }; }
    else data = { title: msg.title, body: msg.body, url: msg.url };
    try {
      await admin.messaging().send({ token: t.token, data,
        webpush: { headers: { Urgency: 'normal', TTL: '43200' } } });   // 데이터 전용 → 클라 SW onBackgroundMessage가 표시(중복 방지)
      sent++;
      if (TYPE === 'gift' && t.newest) { try { await admin.database().ref('/users/' + t.uid + '/pushMeta/lastGiftNotify').set(t.newest); } catch (_) {} }   // 워터마크 갱신(반복 알림 방지)
      if (TYPE === 'todo') { try { await admin.database().ref('/users/' + t.uid + '/pushMeta/lastTodoNotify').set(today); } catch (_) {} }   // 하루 1회(중복 방지)
      if (TYPE === 'todotime' && t.newest) { try { await admin.database().ref('/users/' + t.uid + '/pushMeta/lastTodoTimeNotify').set(t.newest); } catch (_) {} }   // 알린 마지막 마감시각(반복 방지)
      if (TYPE === 'harvest') { try { await admin.database().ref('/users/' + t.uid + '/pushMeta/lastHarvestNotify').set(today); } catch (_) {} }   // 하루 1회
    } catch (e) {
      const code = (e && e.errorInfo && e.errorInfo.code) || (e && e.code) || '';
      if (/registration-token-not-registered|invalid-argument|invalid-registration-token/.test(code)) {
        try { await admin.database().ref('/users/' + t.uid + '/push').remove(); removed++; } catch (_) {}   // 만료 토큰 정리
      } else { console.warn('  ! ' + t.uid + ': ' + code); }
    }
  }
  console.log(`✓ 발송 ${sent} · 만료토큰 정리 ${removed}`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
