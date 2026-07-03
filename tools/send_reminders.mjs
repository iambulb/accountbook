#!/usr/bin/env node
// 알뜰(Eggarden) 리마인더 발송 — GitHub Actions 스케줄 크론에서 실행(서버리스, Blaze 불필요).
// firebase-admin으로 RTDB를 읽어 대상(오늘 미기록 + 알림 토큰 보유)을 고르고 FCM 데이터 메시지로 발송.
// 인증: env FIREBASE_SERVICE_ACCOUNT = 서비스계정 JSON(문자열). 없으면 안전하게 no-op 종료.
//
// 실행: node tools/send_reminders.mjs [--type=daily] [--dry]
//   --type=daily : 오늘 활동 미기록자에게 "오늘 기록하면 +은화" 넛지(기본)
//   --dry        : 실제 발송 안 하고 대상만 출력

import admin from 'firebase-admin';

const DB_URL = 'https://money-bb658-default-rtdb.asia-southeast1.firebasedatabase.app';
const DRY = process.argv.includes('--dry');
const TYPE = (process.argv.find(a => a.startsWith('--type=')) || '--type=daily').split('=')[1];

function kstDayKey(ms) { return new Date((ms || Date.now()) + 9 * 3600 * 1000).toISOString().slice(0, 10); }

const MESSAGES = {
  daily: { title: '알뜰 🐾', body: '오늘 거래·할일을 기록하면 +5 은화! 출석 스트릭도 이어가요.', url: './' },
  pet:   { title: '알뜰 🐱', body: '펫이 배고파해요. 밥·물 그릇을 채워주세요!', url: './' },
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

async function main() {
  const app = initAdmin(); if (!app) return;
  const today = kstDayKey();
  const snap = await admin.database().ref('/users').once('value');
  const users = snap.val() || {};
  const targets = TYPE === 'daily' ? pickDaily(users, today) : [];
  const msg = MESSAGES[TYPE] || MESSAGES.daily;
  console.log(`· type=${TYPE} today(KST)=${today} 대상=${targets.length}명${DRY ? ' (dry)' : ''}`);
  if (DRY) { targets.slice(0, 20).forEach(t => console.log('   → ' + t.uid)); return; }

  let sent = 0, removed = 0;
  for (const t of targets) {
    try {
      await admin.messaging().send({ token: t.token, data: { title: msg.title, body: msg.body, url: msg.url },
        webpush: { headers: { Urgency: 'normal', TTL: '43200' } } });   // 데이터 전용 → 클라 SW onBackgroundMessage가 표시(중복 방지)
      sent++;
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
