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
