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
