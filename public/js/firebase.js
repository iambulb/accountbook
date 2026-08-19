    const firebaseConfig = {
      apiKey: "AIzaSyAn2emAQiftfzSxmc0vmB72ekcAAGVOPuk",
      authDomain: "money-bb658.firebaseapp.com",
      databaseURL: "https://money-bb658-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "money-bb658",
      storageBucket: "money-bb658.firebasestorage.app",
      messagingSenderId: "21675556596",
      appId: "1:21675556596:web:63c21cd0a9777bd06aa8a1",
      measurementId: "G-N4L6D3ZVJ9"
    };
    if (typeof firebase === 'undefined') {
      document.body.innerHTML = '<div style="max-width:420px;margin:80px auto;padding:24px;text-align:center;font-family:sans-serif;"><h2>로딩 실패</h2><p style="color:#888;margin-top:10px;">Firebase SDK를 불러오지 못했습니다. 네트워크/광고차단을 확인하고 새로고침하세요.</p></div>';
      throw new Error('Firebase not loaded');
    }
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.database();
    // 🔔 웹 푸시(FCM) 공개 키(VAPID) — Firebase Console → 프로젝트 설정 → 클라우드 메시징 → 웹 푸시 인증서(키페어)의 "키페어" 값.
    // 공개키라 노출 정상. 비어 있으면 알림 기능은 자동 비활성(요청/토큰 생성 안 함). 채우면 활성화.
    const VAPID_KEY = "BDWECcvIGK7NU6qU06lWC6UFJL5jxmxHAKhnms92xovbWISTXg051FLIIThAynf8rxoW4UCAg1h_V6gNpXkbBIA";
    // 📅 구글캘린더 연동(할일 단방향 동기화) OAuth 웹 클라이언트 ID — console.cloud.google.com(프로젝트 money-bb658) →
    // OAuth 동의 화면(테스트 모드+테스트 사용자) + Calendar API 활성화 + 클라이언트 ID(웹, 승인된 JS 원본=배포 도메인·localhost) 발급.
    // 공개 가능한 값. 비어 있으면 연동 기능(더보기 셀·동기화)이 통째로 비활성 — 절차는 docs/development.md 체크리스트.
    const GCAL_CLIENT_ID = "";
