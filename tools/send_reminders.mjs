#!/usr/bin/env node
// 알뜰(Eggarden) 리마인더 발송 — GitHub Actions 스케줄 크론에서 실행(서버리스, Blaze 불필요).
// firebase-admin으로 RTDB를 읽어 대상(오늘 미기록 + 알림 토큰 보유)을 고르고 FCM 데이터 메시지로 발송.
// 인증: env FIREBASE_SERVICE_ACCOUNT = 서비스계정 JSON(문자열). 없으면 안전하게 no-op 종료.
//
// 실행: node tools/send_reminders.mjs [--type=daily|gift|todo] [--dry]
//   --type=daily : 오늘 활동 미기록자에게 "오늘 기록하면 +은화" 넛지(기본, 20:00 KST 1회)
//   --type=gift  : mailbox에 미수령 친구 선물이 있는 사용자에게 "선물 도착" 알림(매시, 중복은 pushMeta.lastGiftNotify로 방지)
//   --type=todo  : 개인+담당 그룹 할일 중 '오늘 마감 또는 마감 지남 & 미완료'가 있는 사용자에게 알림(아침 1회 권장, 중복은 pushMeta.lastTodoNotify로 방지)
//   --dry        : 실제 발송 안 하고 대상만 출력

import admin from 'firebase-admin';

const DB_URL = 'https://money-bb658-default-rtdb.asia-southeast1.firebasedatabase.app';
const DRY = process.argv.includes('--dry');
const TYPE = (process.argv.find(a => a.startsWith('--type=')) || '--type=daily').split('=')[1];

function kstDayKey(ms) { return new Date((ms || Date.now()) + 9 * 3600 * 1000).toISOString().slice(0, 10); }

const MESSAGES = {
  daily: { title: '알뜰 🐾', body: '오늘 거래·할일을 기록하면 +5 은화! 출석 스트릭도 이어가요.', url: './' },
  pet:   { title: '알뜰 🐱', body: '펫이 배고파해요. 밥·물 그릇을 채워주세요!', url: './' },
  gift:  { title: '알뜰 🎁', body: '친구가 선물을 보냈어요! 선물함에서 받아보세요.', url: './' },
  todo:  { title: '알뜰 ✅', body: '오늘 마감인 할일이 있어요. 확인해 보세요!', url: './' },
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
// 대상 선정(todo): 개인 할일 + 담당 그룹 할일 중 '오늘 마감 또는 마감 지남 & 미완료'가 있고 push 토큰 보유.
// 하루 1회만(pushMeta.lastTodoNotify===today면 스킵). dueDate는 날짜문자열, today는 KST라 비교가 KST 기준으로 일관.
function pickTodos(users, wsAll, today) {
  const gidx = buildGroupTodoIndex(wsAll);
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
    if (dueToday + overdue > 0) out.push({ uid, token, dueToday, overdue });
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
  else targets = pickDaily(users, today);
  const msg = MESSAGES[TYPE] || MESSAGES.daily;
  console.log(`· type=${TYPE} today(KST)=${today} 대상=${targets.length}명${DRY ? ' (dry)' : ''}`);
  if (DRY) { targets.slice(0, 20).forEach(t => console.log('   → ' + t.uid + (t.count ? ' (선물 ' + t.count + ')' : '') + (t.dueToday != null ? ' (오늘 ' + t.dueToday + '·지남 ' + t.overdue + ')' : ''))); return; }

  let sent = 0, removed = 0;
  for (const t of targets) {
    let data;
    if (TYPE === 'gift') data = { title: '알뜰 🎁', body: `친구가 선물을 보냈어요! 선물함에 ${t.count}개가 있어요.`, url: './' };
    else if (TYPE === 'todo') { const body = t.overdue > 0 ? `마감 지난 할일 ${t.overdue}개${t.dueToday ? ', 오늘 마감 ' + t.dueToday + '개' : ''}가 있어요.` : `오늘 마감 할일 ${t.dueToday}개가 있어요.`; data = { title: '알뜰 ✅', body, url: './' }; }
    else data = { title: msg.title, body: msg.body, url: msg.url };
    try {
      await admin.messaging().send({ token: t.token, data,
        webpush: { headers: { Urgency: 'normal', TTL: '43200' } } });   // 데이터 전용 → 클라 SW onBackgroundMessage가 표시(중복 방지)
      sent++;
      if (TYPE === 'gift' && t.newest) { try { await admin.database().ref('/users/' + t.uid + '/pushMeta/lastGiftNotify').set(t.newest); } catch (_) {} }   // 워터마크 갱신(반복 알림 방지)
      if (TYPE === 'todo') { try { await admin.database().ref('/users/' + t.uid + '/pushMeta/lastTodoNotify').set(today); } catch (_) {} }   // 하루 1회(중복 방지)
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
