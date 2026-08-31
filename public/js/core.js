// ===== 상태 =====
    const state = {
      uid:null, userName:'', userEmail:'',
      wsId:null, wsMeta:null, memberships:[],   // 현재 워크스페이스, 메타, 내 워크스페이스 목록
      transactions:[], accounts:[], categories:[], savings:[], stocks:[], recurring:[], creditCards:[], subscriptions:[], purposeBooks:[],
      people:[], giftEvents:[], plannedGiftEvents:[],
      settlementPayments:[],   // 정산 송금 완료/취소 기록(Step 9) — per-uid
      loans:[], loanPayments:[],   // 대출/이자 관리 — flat
      wsSettings:{},   // 워크스페이스 공동 설정(기본 공개범위/소유자) — ws/{wsId}/settings
      userPhotos:{},   // uid → 프로필 사진 data URL 캐시(users/{uid}/photo)
      budgets:[],
      month: monthStr(new Date()),
      selectedDate: ymd(new Date()),
      homeView:'calendar',
      memberFilter:'',   // 달력 멤버 칩 필터(기록자 uid) — 그룹 전용
      filter:{ type:'', category:'', account:'', keyword:'' },
      theme: localStorage.getItem('theme') || 'light',
      tab:'calendar',
      mode: (localStorage.getItem('mode')==='todo' ? 'todo' : 'ledger'),   // 가계부(ledger) / 할일(todo) 모드
      view: 'mode',     // 캘린더(탭)를 홈처럼 사용 — '오늘 홈' 랜딩 폐지(브랜드 아이콘=소식). 구 'home' 뷰 로직은 미사용
      todos:[],   // 그룹 할일 목록(ws/{wsId}/todos). (구 레거시 ws todoShare 키는 제거 — 아래 25행 친구별 todoShare와 이름이 겹쳐 공유 OFF가 되돌아가던 버그)
      todoCats:[],   // 할일 카테고리(ws/{wsId}/todoCats) — 워크스페이스별 사용자 정의 세트(가계부 categories 와 같은 패턴)
      myTodos:[],   // 내 개인 할일(user-global: users/{uid}/todos) — 워크스페이스 무관
      friends:{}, friendReqs:{}, todoPublic:false, friendCode:'', friendPub:{},   // 친구 관계·받은 요청·내 공개 플래그·내 코드·친구별 공개여부(users/{uid}/…)
      todoShare:{},   // 🔐 친구별 할일 공유 토글(users/{uid}/todoShare/{fuid}=true|false) — 미설정 친구는 todoPublic(기본값) 폴백. OFF면 그 친구와 서로의 할일이 안 보임
      friendLikes:{}, friendHomeChangedByUid:{}, myLikeCount:0, _friendCam:null,   // 친구별 집 좋아요수·집 변경시각 / 내 받은 좋아요 / 방문 중 친구 캠 컨텍스트
      profilePublic:true,   // 내 프로필 공개 여부(비공개면 랭킹·비친구에게 은화+'알뜰' 익명)
      friendTodosByUid:{},   // 공개 친구별 개인 할일(피드)
      friendTodos:[], _friendTodosUid:null,   // 현재 열람 중인 친구의 개인 할일(임시 리스너)
      _todoFeed: false,   // 개인 프로필 할일에서 '친구들' 피드 보기(그룹 컨텍스트에선 미사용). 스코프(개인/그룹)는 현재 컨텍스트로 결정.
      recentWs: (function(){ let l=null,t=null; try{ l=localStorage.getItem('recentWs_ledger')||null; t=localStorage.getItem('recentWs_todo')||null; }catch(e){} return { ledger:l, todo:t }; })(),   // 모드별(가계부/할일) 최근 컨텍스트 wsId — 토글해도 각자 마지막 그룹/개인프로필 유지
      _todoFriend: null   // 개인 프로필에서 보고 있는 친구 uid(null/내 uid=나)
    };
    let listenersAttached = false;
    let seededAcc = false, seededCat = false, seededTodoCat = false, booted = false, migratedAcc = false, migratedCat = false, migratedBudget = false, migratedRec = false;
    let recurringLogKeys = new Set();
    const recv = { tx:false, acc:false, cat:false, rec:false, log:false };
    let deferredPrompt=null;
    // 시트 임시 상태
    let sheetTx = null;     // 편집중 {ownerUid,id} or null
    let sheetType = 'expense';
    let sheetCat = '';

    // ===== 헬퍼 =====
    // won·fmtComma·parseAmount·curInfo·fmtForeign은 js/util.js로 이동(전역 노출 + 단위 테스트).
    // ===== 실시간 환율(frankfurter.dev/v1, 무키·CORS) — 일자별 캐시(메모리+localStorage). 실패 시 null → 수동 입력 폴백. =====
    //  ⚠️ 구 api.frankfurter.app 은 301→api.frankfurter.dev/v1 로 이전됨. 브라우저 fetch는 교차출처 301 리다이렉트에서 CORS로 막혀 실패하므로 반드시 .dev/v1 을 직접 호출한다.
    const _fxMem={};
    function _fxToday(){ return new Date(Date.now()+9*3600000).toISOString().slice(0,10); }
    function fxCacheGet(date,cur){ const k=date+'|'+cur; if(_fxMem[k]!=null) return _fxMem[k]; try{ const v=localStorage.getItem('eg_fx_'+k); if(v!=null){ const r=parseFloat(v); if(r>0){ _fxMem[k]=r; return r; } } }catch(e){} return null; }
    function fxCacheSet(date,cur,rate){ const k=date+'|'+cur; _fxMem[k]=rate; try{ localStorage.setItem('eg_fx_'+k,String(rate)); }catch(e){} }
    function fetchFxRate(cur,date){ if(cur==='KRW') return Promise.resolve(1);
      const today=_fxToday(); const d=(date&&date<today)?date:today;
      const c=fxCacheGet(d,cur); if(c) return Promise.resolve(c);
      const url='https://api.frankfurter.dev/v1/'+(d===today?'latest':d)+'?from='+cur+'&to=KRW';
      return fetch(url).then(r=>r.ok?r.json():null).then(j=>{ const rate=j&&j.rates&&j.rates.KRW; if(rate>0){ const rr=Math.round(rate*100)/100; fxCacheSet(d,cur,rr); return rr; } return null; }).catch(()=>null); }
    // sumByCurrency는 js/util.js로 이동(순수함수·단위 테스트).
    function escapeHtml(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
    // 🛡️ 아바타 사진 src 안전화(저장형 XSS 차단) — 사진 값은 users/{uid}/photo·workspaces/{ws}/photo(전역 읽기·소유자 임의 쓰기)에서 오므로
    //   data:image base64만 허용하고, 그 외(속성 탈출 페이로드 등)는 빈 문자열로 떨궈 <img>가 생성되지 않게 한다. 정상 경로(resizeImageFile)는 항상 data:image URL.
    function safeImgSrc(v){ v=String(v==null?'':v); return /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=\s]+$/.test(v) ? v : ''; }
    function pad2(n){ return String(n).padStart(2,'0'); }
    function monthStr(d){ return d.getFullYear()+'-'+pad2(d.getMonth()+1); }
    function ymd(d){ return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }
    function todayStr(){ return ymd(new Date()); }
    function shiftMonth(m,delta){ const [y,mo]=m.split('-').map(Number); return monthStr(new Date(y,mo-1+delta,1)); }
    function parseDate(s){ const [y,m,d]=String(s).split('T')[0].split('-').map(Number); return new Date(y,(m||1)-1,d||1); }
    function val(id){ const el=document.getElementById(id); return el?el.value:''; }
    function $(id){ return document.getElementById(id); }
    // ===== 워크스페이스 경로 =====
    // 모든 가계부 데이터는 ws/{wsId}/ 아래에 네임스페이스로 분리된다.
    function wsRoot(){ return 'ws/'+state.wsId; }
    function wp(path){ return 'ws/'+state.wsId+'/'+path; }
    // 🔗 다른 워크스페이스 경로 — 그룹 간 이체(연동 이체)처럼 내가 멤버인 "다른" ws에 쓸 때만 사용(규칙이 멤버십 기준이라 통과).
    function wpOf(wsId,path){ return 'ws/'+wsId+'/'+path; }
    function randCode(n){ const ch='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s=''; for(let i=0;i<(n||6);i++) s+=ch[Math.floor(Math.random()*ch.length)]; return s; }
    function budgetColor(p){ return p>=100?'var(--expense)':(p>=90?'#f76707':(p>=80?'#f5a623':'var(--primary)')); }
    function getCat(name){ return state.categories.find(c=>c.name===name); }
    function getAcct(id){ return state.accounts.find(a=>a.id===id); }
    function getCard(id){ return state.creditCards.find(c=>c.id===id); }
    function acctName(id){ const a=getAcct(id); return a?a.name:(id?'(삭제된 계좌)':''); }   // 없는 계좌면 id 원문 대신 안내(삭제된 계좌가 거래에 걸릴 때 id 노출 방지)
    function catIcon(name){ const c=getCat(name); return c?c.icon:'🏷️'; }
    // ===== 카테고리 색/아이콘 (핸드오프 v2: 차분한 솔리드 + 13% 알파 tint + 라인 SVG) =====
    // 기본 카테고리는 핸드오프 팔레트로 색을 오버라이드(저장값과 무관). 커스텀은 저장된 색 사용.
    // 모든 색은 서로 중복되지 않는 차분한 톤(13% 알파 tint로 옅게 표시). 구버전 기본명(식사/생활/엔터/교육)도 포함.
    const CAT_META = {
      '식비':{c:'#E08A3C',i:'food'}, '배달':{c:'#E26B4E',i:'food'}, '식사':{c:'#C9952F',i:'food'},
      '카페':{c:'#9C7558',i:'cafe'}, '용돈':{c:'#D8A93A',i:'coin'}, '교육':{c:'#7A8B2E',i:'book'},
      '생활용품':{c:'#8AA13C',i:'box'}, '생활':{c:'#5FA85C',i:'box'}, '의료':{c:'#2FAE7A',i:'medical'},
      '부수입':{c:'#2BA98C',i:'coin'}, '여행':{c:'#43AEB3',i:'travel'}, '통신':{c:'#3FA0BA',i:'telecom'},
      '환급':{c:'#4AA3D8',i:'refund'}, '교통':{c:'#4C7FE0',i:'transit'}, '월급':{c:'#3182F6',i:'wallet'},
      '이자':{c:'#5C6BE0',i:'bank'}, '주거':{c:'#8773DC',i:'home'}, '문화생활':{c:'#9B6FC8',i:'culture'},
      '엔터':{c:'#B065C0',i:'culture'}, '구독':{c:'#CC68A4',i:'sub'}, '쇼핑':{c:'#DB5F88',i:'shop'},
      '경조사':{c:'#DC7790',i:'gift'}, '경조사비 수령':{c:'#E06A6A',i:'gift'}, '보험':{c:'#6B7686',i:'shield'},
      '기타':{c:'#8B95A1',i:'tag'}
    };
    // CAT_META에 없고 저장 색도 무효한 카테고리에 안정적으로 부여할 폴백 색(서로 구분되는 톤)
    const CAT_FALLBACK = ['#E08A3C','#E26B4E','#C9952F','#9C7558','#8AA13C','#5FA85C','#2FAE7A','#2BA98C','#43AEB3','#3FA0BA','#4AA3D8','#4C7FE0','#5C6BE0','#8773DC','#9B6FC8','#B065C0','#CC68A4','#DB5F88','#DC7790','#E06A6A','#6B7686'];
    const CAT_SVG = {
      food:'<path d="M4 11h16"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M8 4c0 1.3-1 1.8-1 3M12 3.5c0 1.3-1 1.8-1 3"/>',
      cafe:'<path d="M5 8h12v4a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5z"/><path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 3.5V5M12 3.5V5"/>',
      transit:'<rect x="6" y="3.5" width="12" height="12" rx="3"/><path d="M6 11h12"/><path d="M8 19l-1.5 2M16 19l1.5 2"/>',
      shop:'<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
      home:'<path d="M4 11l8-6 8 6"/><path d="M6 10v9h12v-9"/>',
      telecom:'<rect x="7" y="3" width="10" height="18" rx="3"/><path d="M10.5 18h3"/>',
      medical:'<circle cx="12" cy="12" r="8.5"/><path d="M12 8.3v7.4M8.3 12h7.4"/>',
      culture:'<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M3.5 9.5h17M3.5 14.5h17M8.5 5v14M15.5 5v14"/>',
      sub:'<path d="M4 9a6 6 0 0 1 10-3.5L17 8"/><path d="M20 15a6 6 0 0 1-10 3.5L7 16"/><path d="M17 4v4h-4M7 20v-4h4"/>',
      gift:'<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M4 13h16M12 9v11"/><path d="M12 9C9.5 9 8.5 4.5 12 4.5S14.5 9 12 9z"/>',
      travel:'<path d="M21 4L3 11l6 2.5L11 20l3-5 5-2z"/><path d="M9 13.5L14 9"/>',
      box:'<path d="M4 8l8-4 8 4-8 4z"/><path d="M4 8v8l8 4 8-4V8M12 12v8"/>',
      shield:'<path d="M12 3.5l6.5 2.5V11c0 4.5-2.8 7.3-6.5 9-3.7-1.7-6.5-4.5-6.5-9V6z"/>',
      book:'<path d="M5 5a2 2 0 0 1 2-2h11v15H7a2 2 0 0 0-2 2z"/><path d="M18 18H7a2 2 0 0 0-2 2"/>',
      wallet:'<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="16.5" cy="14" r="1.2"/>',
      coin:'<circle cx="12" cy="12" r="8.5"/><path d="M8.5 9l1.8 4 1.7-4 1.7 4 1.8-4M8 13.2h8"/>',
      refund:'<path d="M9 14l-4-4 4-4"/><path d="M5 10h9a5 5 0 0 1 0 10h-3"/>',
      bank:'<path d="M4 9.5l8-5 8 5"/><path d="M5 9.5v9M19 9.5v9M9.5 10v8M14.5 10v8M3.5 19h17"/>',
      tag:'<path d="M4 13l7 7 8-8V5h-7z"/><circle cx="15" cy="9" r="1.3"/>',
      card:'<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M3 10h18"/>',
      cash:'<rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.3"/>',
      swap:'<path d="M7 7h11l-3-3M17 17H6l3 3"/>',
      heart:'<path d="M12 20s-7-4.5-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.5 12 20 12 20z"/>',
      user:'<circle cx="12" cy="8" r="3.6"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/>',
      flower:'<circle cx="12" cy="12" r="2.4"/><path d="M12 9.6V5M12 14.4V19M9.6 12H5M14.4 12H19M9.9 9.9 7 7M14.1 14.1 17 17M14.1 9.9 17 7M9.9 14.1 7 17"/>',
      people:'<circle cx="9" cy="9" r="3"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5"/><circle cx="17" cy="10" r="2.4"/><path d="M15 19c0-2 1-3.5 2.5-4"/>',
      check:'<path d="M5 12l5 5L20 7"/>',
      // 가계부용 추가 라인 아이콘
      paw:'<circle cx="6" cy="11" r="1.6"/><circle cx="10" cy="7.5" r="1.6"/><circle cx="14" cy="7.5" r="1.6"/><circle cx="18" cy="11" r="1.6"/><path d="M8.5 15.5c0-2 1.6-3.5 3.5-3.5s3.5 1.5 3.5 3.5c0 1.8-1.6 2.5-3.5 2.5s-3.5-.7-3.5-2.5z"/>',
      car:'<path d="M4 13l1.5-4.5A2 2 0 0 1 7.4 7h9.2a2 2 0 0 1 1.9 1.5L20 13"/><path d="M3 13h18v4H3z"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/>',
      fuel:'<rect x="4" y="4" width="9" height="16" rx="2"/><path d="M4 11h9"/><path d="M13 8h3l2 2v6a2 2 0 0 1-4 0v-3h-1"/>',
      scissors:'<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><path d="M8 7.5L20 18M8 16.5L20 6"/>',
      dumbbell:'<path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12"/>',
      cart:'<path d="M3 4h2l2.2 11h10l2-7H6"/><circle cx="9" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
      shirt:'<path d="M8 4l4 2 4-2 4 3-2.5 3L16 9v11H8V9l-1.5.9L4 7z"/>',
      baby:'<rect x="8" y="8" width="8" height="12" rx="3"/><path d="M9 12h6"/><path d="M10 8V6h4v2"/><path d="M11 4h2"/>',
      gamepad:'<rect x="3" y="8" width="18" height="9" rx="4.5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="15.5" cy="12" r="1"/><circle cx="18" cy="14" r="1"/>',
      music:'<path d="M9 17V5l10-2v12"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="15" r="2"/>',
      ball:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5C9 7 9 17 12 20.5M12 3.5C15 7 15 17 12 20.5M3.7 9.5h16.6M3.7 14.5h16.6"/>',
      bolt:'<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
      droplet:'<path d="M12 3.5c3.5 4 6 6.8 6 10a6 6 0 0 1-12 0c0-3.2 2.5-6 6-10z"/>',
      piggy:'<path d="M4 12.5a6 6 0 0 1 6-5.5h3l3-2v3a6 6 0 0 1 1.8 3H21v3h-1.2l-1 1v2.5h-3V18H9v2.5H6V18a6 6 0 0 1-2-4.5z"/><circle cx="9" cy="11.5" r="1"/>',
      trend:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
      doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 15h6M9 18h4"/>',
      donate:'<path d="M12 7.5c2-2.5 5.5-.5 0 3.5-5.5-4-2-6 0-3.5z"/><path d="M3 14h3l3 2.5h4a1.4 1.4 0 0 0 0-2.8H9.5"/><path d="M3 14v6h3v-6"/>',
      ticket:'<path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4z"/><path d="M14 6v3M14 11v2M14 15v3"/>',
      monitor:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/>'
    };
    // 경조사 유형 → 라인 아이콘 키
    const GIFT_SVG_KEY = { wedding:'heart', funeral:'flower', first_birthday:'gift', birthday:'gift', holiday:'gift', graduation:'book', birth:'gift', hospital_visit:'medical', housewarming:'home', exam:'book', other:'gift' };
    function svgWrap(inner){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(inner||CAT_SVG.tag)+'</svg>'; }
    // hex(#rgb/#rrggbb) → rgba 문자열(알파 적용). var(--x)/rgb은 그대로 반환.
    function hexA(hex, a){ if(!hex||hex[0]!=='#') return hex; let h=hex.slice(1); if(h.length===3) h=h.split('').map(x=>x+x).join(''); const n=parseInt(h,16); return 'rgba('+((n>>16)&255)+','+((n>>8)&255)+','+(n&255)+','+a+')'; }
    // 카테고리 솔리드 색: 기본 카테고리는 팔레트 오버라이드, 그 외엔 저장된 유효 색,
    // 색이 없거나 무효하면 이름 해시로 폴백 색을 안정 부여(무효값이 conic-gradient/배경을 깨뜨리지 않게).
    function isValidHex(c){ return typeof c==='string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c); }
    function catColor(name){
      if(CAT_META[name]) return CAT_META[name].c;
      const c=getCat(name); if(c && isValidHex(c.color)) return c.color;
      let h=0, s=String(name||''); for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0;
      return CAT_FALLBACK[h % CAT_FALLBACK.length];
    }
    // 카테고리 아이콘 픽커에 추가로 노출하는 '픽셀아트' 아이콘 키(라인 CAT_SVG 외). 예: 치즈냥이(cheesecat).
    const CAT_PIX_ICONS = ['cheesecat'];
    // 카테고리 아이콘 키 → 마크업. 기본은 라인 SVG(CAT_SVG)지만, 픽셀 특수 아이콘은 전용 픽셀 렌더러(cats.js)를 쓴다.
    function catIconMarkup(key){
      if(key==='cheesecat') return (typeof cheeseCatSvg==='function') ? cheeseCatSvg() : svgWrap(CAT_SVG.tag);
      return svgWrap(CAT_SVG[key]||CAT_SVG.tag);
    }
    // 카테고리 아이콘: 저장된 iconKey 우선(픽셀 특수키 포함) → 이름 기본 매핑(CAT_META) → tag. 라인 아이콘 색은 currentColor.
    function catSvgIcon(name){
      const c=getCat(name);
      if(c && c.iconKey && (c.iconKey==='cheesecat' || CAT_SVG[c.iconKey])) return catIconMarkup(c.iconKey);
      const m=CAT_META[name];
      return catIconMarkup((m && CAT_SVG[m.i])?m.i:'tag');
    }
    // 카테고리 tint 타일 인라인 스타일(배경=13% 알파, 글자=솔리드 색)
    function catTileStyle(name){ const c=catColor(name); return 'background:'+hexA(c,.13)+';color:'+c+';'; }
    // 작은 카테고리 tint 타일(예산 등 컴팩트 행용)
    function catTileMini(name){ return '<span class="mtile" style="'+catTileStyle(name)+'">'+catSvgIcon(name)+'</span>'; }
    // 거래유형 → 카테고리 그룹(expense/income/null). 'other'(기타)는 양쪽 모두 노출
    function catTypeFor(txType){ if(['expense','prepaid_spend','point_spend'].includes(txType)) return 'expense'; if(['income','refund'].includes(txType)) return 'income'; if(txType==='transfer') return 'transfer'; return null; }
    function pickableCats(wantType){ return state.categories.filter(c=>canSee(c) && c.isActive!==false && (c.type===wantType||c.type==='other')).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0)); }

    // icon(선택): 신뢰된 SVG 마크업(우리 코드에서만 전달) → 아이콘만 innerHTML, msg는 항상 textContent(XSS 안전).
    function toast(msg, err, icon){
      const t=$('toast'); t.className='toast on'+(err?' err':'')+(icon?' hasic':'');
      t.setAttribute('aria-live', err?'assertive':'polite');   // 에러는 즉시(assertive)로 스크린리더에 알림
      if(icon){ t.innerHTML='<span class="toast-ic"></span><span class="toast-msg"></span>'; t.firstChild.innerHTML=icon; t.lastChild.textContent=msg; }
      else { t.textContent=msg; }
      clearTimeout(t._t); t._t=setTimeout(()=>{ t.className='toast'; }, err?3600:2200);   // 에러는 좀 더 오래 표시
    }

    // ===== 시트 =====
    function openSheet(title, html){
      const sh=$('sheet');
      state._sheetRefresh=null;   // 새 시트 열 때 이전 시트의 실시간 갱신 훅 해제(stale 방지)
      state._sheetReopen=null;    // ↩️ '나를 다시 여는 법' 등록 해제 — 리스트 시트만 openSheet 직후 스스로 재등록(아래 closeSheet 복귀 참조)
      // 드래그로 닫혔을 때 남은 인라인 스타일 초기화(다시 정상 위치에서 올라오도록)
      sh.style.transition=''; sh.style.transform=''; { const ov=$('overlay'); if(ov) ov.style.opacity=''; }
      setupSheetDrag();
      if(!sh.classList.contains('on')) sh._returnFocus=document.activeElement;  // 닫을 때 돌아갈 포커스
      $('sheetTitle').textContent=title;
      { const _shw=sh.querySelector('.sheet-head .shophw'); if(_shw) _shw.remove(); }   // 알뜰샵 제목 우측 잔액 위젯은 알뜰샵 시트 전용 — 다른 시트로 넘어가면 제거(알뜰샵은 renderCatHouse가 다시 붙임)
      $('sheetBody').innerHTML=html;
      $('overlay').classList.add('on');
      sh.classList.add('on');
      document.body.classList.add('sheet-open');   // 🔋 시트가 하단 dock 펫캠을 가림 → dock 애니 정지(styles.css body.sheet-open)
      if(typeof pkObserveScenes==='function') pkObserveScenes();   // A4: 시트에 픽업 씬(알뜰샵 가챠탭·소식)이 있으면 오프스크린 애니 정지 옵저버 부착
      // 다이얼로그로 포커스 이동(모바일 키보드 안 뜨도록 입력칸이 아닌 시트 컨테이너로)
      setTimeout(()=>{ try{ sh.focus(); }catch(e){} }, 30);
    }
    // 시트 상단(핸들·헤더)을 아래로 드래그하면 따라 내려오고, 충분히 내리면 닫힘(살짝이면 제자리 복귀). 1회만 바인딩.
    function setupSheetDrag(){
      if(state._sheetDragInit) return; const sh=$('sheet'); if(!sh) return; state._sheetDragInit=true;
      const grips=[sh.querySelector('.sheet-handle'), sh.querySelector('.sheet-head')].filter(Boolean);
      let sy=0, dy=0, on=false;
      function move(e){ if(!on) return; dy=e.clientY-sy; if(dy<0) dy=0;
        sh.style.transform='translateX(-50%) translateY('+dy+'px)';
        const ov=$('overlay'); if(ov) ov.style.opacity=String(Math.max(0,1-dy/420)); }
      function up(){ if(!on) return; on=false;
        window.removeEventListener('pointermove',move); window.removeEventListener('pointerup',up); window.removeEventListener('pointercancel',up);
        sh.style.transition=''; const ov=$('overlay'); if(ov) ov.style.opacity='';
        const h=sh.getBoundingClientRect().height||600;
        if(dy>Math.min(150,h*0.3)){ sh.style.transform='translateX(-50%) translateY(100%)'; closeSheet(); }   // 충분히 내리면 닫힘(다음 openSheet에서 인라인 초기화)
        else { sh.style.transform=''; }   // 살짝이면 제자리 복귀(.on 유지 → 트랜지션으로 되올라감)
      }
      grips.forEach(g=>g.addEventListener('pointerdown',function(e){
        if(e.target.closest('.x')) return;   // 닫기(X) 버튼은 클릭으로 처리
        on=true; dy=0; sy=e.clientY; sh.style.transition='none';
        window.addEventListener('pointermove',move); window.addEventListener('pointerup',up); window.addEventListener('pointercancel',up);
      }));
    }
    function closeSheet(){
      // ↩️ 시트 복귀: 거래 수정 시트가 리스트 시트(일자·카드내역·카테고리/개인별 드릴다운 등) 위에서 열렸으면(openTxSheet가 arm),
      //    닫을 때 전체를 닫는 대신 이전 리스트 시트를 다시 연다(재호출이라 수정·삭제가 반영된 최신 목록). 실패 시 일반 닫기로 폴백.
      const bk=state._sheetBackFn; state._sheetBackFn=null;
      if(bk){ try{ bk(); return; }catch(e){} }
      const sh=$('sheet');
      state._sheetRefresh=null;
      state._sheetReopen=null;
      if(typeof cancelCatDrags==='function') cancelCatDrags();   // 드래그 도중 시트가 닫혀도 드래그 상태·스크롤 잠금(_tmBlock) 완전 해제
      document.body.classList.remove('dragging');
      $('overlay').classList.remove('on');
      sh.classList.remove('on');
      document.body.classList.remove('sheet-open');   // 🔋 dock 다시 보임 → 애니 재개
      const rf=sh._returnFocus; sh._returnFocus=null;
      if(rf && rf.focus){ try{ rf.focus(); }catch(e){} }
    }
    // 확인 시트. opts:{ okLabel, danger, title } — 기본은 삭제(빨강). 로그아웃 등 비삭제 동작은 okLabel/danger 지정.
    function confirmSheet(msg, onYes, opts){
      opts=opts||{};
      const label=opts.okLabel||'삭제';
      const danger=(opts.danger!==undefined)?opts.danger:(label==='삭제');
      openSheet(opts.title||'확인',
        '<p style="padding:4px 2px 20px;font-size:15px;line-height:1.55;">'+escapeHtml(msg)+'</p>'+
        '<div class="form-2"><button class="btn ghost" onclick="closeSheet()">취소</button>'+
        '<button class="'+(danger?'btn danger':'btn')+'" id="confirmYes">'+escapeHtml(label)+'</button></div>');
      $('confirmYes').onclick=()=>{ closeSheet(); onYes(); };
    }

    // ===== 테마 =====
    // 시안 스타일 선형 해/달 아이콘(흑백 기반, currentColor)
    const ICON_SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v1.5M12 19.5V21M4.2 4.2l1.1 1.1M18.7 18.7l1.1 1.1M3 12h1.5M19.5 12H21M4.2 19.8l1.1-1.1M18.7 5.3l1.1-1.1"/><circle cx="12" cy="12" r="4"/></svg>';
    const ICON_MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
    function applyTheme(){
      document.documentElement.setAttribute('data-theme', state.theme);
      const b=$('themeBtn'); if(b) b.innerHTML = state.theme==='dark'?ICON_SUN:ICON_MOON;
      const meta=document.querySelector('meta[name=theme-color]'); if(meta) meta.content = state.theme==='dark'?'#16181d':'#ffffff';
      if(typeof syncPipTheme==='function') syncPipTheme();   // 🖥️ 펫캠 PiP 미니 창에도 다크/라이트 테마 반영(cats.js)
    }
    function toggleTheme(){ state.theme = state.theme==='dark'?'light':'dark'; localStorage.setItem('theme', state.theme); applyTheme(); if(state.tab==='stats') renderStats(); }

    // ===== 인증 =====
    let authMode='login';
    let pendingSignupName='';
    let justSignedUp=false;   // 이번 진입이 방금 가입한 신규 계정인지(축하 선물 지급 판단)
    // ===== 아이디 저장 · 자동 로그인 (localStorage, 로그아웃 후에도 유지) =====
    // 기본값 on: 기존 로그인 세션(Firebase LOCAL 지속성)과 동작을 일치시킴.
    function authOptGet(k){ try{ const v=localStorage.getItem('auth_'+k); return v===null ? true : v==='1'; }catch(e){ return true; } }
    function authOptSet(k,on){ try{ localStorage.setItem('auth_'+k, on?'1':'0'); }catch(e){} }
    function authOptPaint(){ ['saveId','autoLogin'].forEach(k=>{ const on=authOptGet(k);
      const el=$(k==='saveId'?'optSaveId':'optAutoLogin'); if(!el) return;
      const sw=el.querySelector('.switch'); if(sw) sw.classList.toggle('on', on); el.setAttribute('aria-checked', on?'true':'false'); }); }
    function toggleAuthOpt(k){ const on=!authOptGet(k); authOptSet(k,on);
      if(k==='saveId' && !on){ try{ localStorage.removeItem('auth_savedEmail'); }catch(e){} }   // 끄면 저장된 아이디 삭제
      if(k==='autoLogin'){ try{ const p=authPersistence(); if(p) auth.setPersistence(p).catch(()=>{}); }catch(e){} }   // 자동로그인 토글 → 지속성 즉시 반영
      authOptPaint(); }
    // 로그인 화면 진입 시 토글 상태·저장된 아이디 반영.
    function initAuthOpts(){ authOptPaint();
      if(authOptGet('saveId')){ try{ const e=localStorage.getItem('auth_savedEmail'); if(e && $('authEmail') && !$('authEmail').value) $('authEmail').value=e; }catch(err){} } }
    // 자동 로그인 on → LOCAL(앱 재실행에도 유지), off → SESSION(앱 완전 종료 시 재로그인).
    function authPersistence(){ try{ const P=firebase.auth.Auth.Persistence; return authOptGet('autoLogin')?P.LOCAL:P.SESSION; }catch(e){ return null; } }
    // 로그인·가입 직전: 아이디 저장 처리 + 지속성 설정(promise 반환).
    function beforeAuth(email){
      if(authOptGet('saveId')){ try{ localStorage.setItem('auth_savedEmail', email); }catch(e){} }
      else { try{ localStorage.removeItem('auth_savedEmail'); }catch(e){} }
      return Promise.resolve();   // 지속성(setPersistence)은 부팅 시 1회만 설정 → 로그인마다 재설정하지 않음(iOS 인증상태 깜빡임 방지)
    }
    function setAuthMode(m){
      authMode=m;
      $('modeLogin').classList.toggle('on', m==='login');
      $('modeSignup').classList.toggle('on', m==='signup');
      $('nameField').style.display = m==='signup'?'block':'none';
      $('authSubmit').textContent = m==='signup'?'회원가입':'로그인';
      $('authDesc').textContent = m==='signup'?'가입하고 오늘도 알뜰하게~':'로그인하고 오늘도 알뜰하게~';
    }
    function submitAuth(){ authMode==='signup'?signup():login(); }
    // Firebase 인증 에러 → 친절한 한국어. 최신 SDK는 비번틀림·미가입을 모두 auth/invalid-credential로 반환(원문 영어 "The supplied auth credential..." 노출 방지).
    function authErrMsg(e){ const c=(e&&e.code)||'';
      if(c==='auth/invalid-credential'||c==='auth/wrong-password'||c==='auth/user-not-found'||c==='auth/invalid-login-credentials') return '이메일 또는 비밀번호가 올바르지 않아요. 다시 확인해 주세요.';
      if(c==='auth/invalid-email') return '이메일 형식이 올바르지 않아요';
      if(c==='auth/email-already-in-use') return '이미 가입된 이메일이에요. 로그인해 주세요.';
      if(c==='auth/weak-password') return '비밀번호는 6자 이상이어야 합니다';
      if(c==='auth/too-many-requests') return '시도가 많아 잠시 제한됐어요. 잠시 후 다시 시도하거나 비밀번호를 재설정해 주세요.';
      if(c==='auth/network-request-failed') return '네트워크 연결을 확인해 주세요';
      if(c==='auth/user-disabled') return '정지된 계정이에요';
      if(c==='auth/operation-not-allowed') return '이메일 로그인이 비활성화돼 있어요 (관리자에게 문의)';
      return (e&&e.message)||'로그인에 실패했어요';
    }
    function signup(){
      const name=val('authName').trim(), email=val('authEmail').trim(), pw=val('authPassword');
      if(!name||!email||!pw){ toast('이름·이메일·비밀번호를 모두 입력하세요', true); return; }
      if(pw.length<6){ toast('비밀번호는 6자 이상이어야 합니다', true); return; }
      pendingSignupName=name; justSignedUp=true;
      beforeAuth(email)
        .then(()=>auth.createUserWithEmailAndPassword(email,pw))
        .then(()=>db.ref('users/'+auth.currentUser.uid).update({ name, email, createdAt:new Date().toISOString() }))
        .catch(e=>{ justSignedUp=false; toast(authErrMsg(e), true); });
    }
    function login(){
      const email=val('authEmail').trim(), pw=val('authPassword');
      if(!email||!pw){ toast('이메일과 비밀번호를 입력하세요', true); return; }
      justSignedUp=false;
      beforeAuth(email).then(()=>auth.signInWithEmailAndPassword(email,pw)).catch(e=>toast(authErrMsg(e), true));
    }
    function logout(){ confirmSheet('로그아웃할까요? (아이디 저장·자동 로그인 설정은 유지돼요)', ()=>auth.signOut(), {title:'로그아웃', okLabel:'로그아웃'}); }
    // 비밀번호 변경(내 프로필) — 현재 비번으로 재인증 후 변경(requires-recent-login 방지)
    function changePassword(){
      const cur=val('pwCur'), np=val('pwNew'), np2=val('pwNew2');
      if(!cur||!np){ toast('현재·새 비밀번호를 입력하세요', true); return; }
      if(np.length<6){ toast('새 비밀번호는 6자 이상이어야 합니다', true); return; }
      if(np!==np2){ toast('새 비밀번호가 서로 달라요', true); return; }
      const u=auth.currentUser; if(!u||!u.email){ toast('로그인이 필요해요', true); return; }
      const cred=firebase.auth.EmailAuthProvider.credential(u.email, cur);
      u.reauthenticateWithCredential(cred)
        .then(()=>u.updatePassword(np))
        .then(()=>{ toast('비밀번호를 변경했어요'); closeSheet(); })
        .catch(e=>{ const c=e&&e.code;
          toast(c==='auth/wrong-password'?'현재 비밀번호가 틀려요':(c==='auth/weak-password'?'비밀번호는 6자 이상이어야 합니다':(e.message||'변경 실패')), true); });
    }
    // 로그인 도움(아이디=이메일 안내 + 비밀번호 재설정 메일) — 로그인 화면에서 진입
    function openLoginHelpSheet(){
      let pre=''; try{ pre=(val('authEmail')||localStorage.getItem('auth_savedEmail')||''); }catch(e){}
      let h='<p class="muted" style="font-size:13px;line-height:1.6;margin:2px 2px 14px;">아이디는 <b>가입할 때 쓴 이메일</b>이에요. 비밀번호가 기억나지 않으면 아래에 이메일을 넣고 <b>재설정 메일</b>을 받으세요.</p>';
      h+='<div class="field"><label>이메일</label><input class="input" id="resetEmail" type="email" autocomplete="username" placeholder="your@email.com" value="'+escapeHtml(pre)+'"></div>';
      h+='<button class="btn" onclick="sendPasswordReset()">비밀번호 재설정 메일 보내기</button>';
      openSheet('로그인 도움', h);
    }
    function sendPasswordReset(){
      const email=(val('resetEmail')||'').trim(); if(!email){ toast('이메일을 입력하세요', true); return; }
      auth.sendPasswordResetEmail(email)
        .then(()=>{ toast('재설정 메일을 보냈어요. 메일함을 확인하세요'); closeSheet(); })
        .catch(e=>{ const c=e&&e.code;
          toast(c==='auth/user-not-found'?'가입되지 않은 이메일이에요':(c==='auth/invalid-email'?'이메일 형식이 올바르지 않아요':(e.message||'전송 실패')), true); });
    }

    // Firebase가 세션(자동 로그인)을 복원할 때까지 로그인창을 띄우지 않는다(스플래시) → iOS 홈화면 PWA에서 로그인창 깜빡임 방지.
    try{ document.body.classList.add('auth-pending'); }catch(e){}
    try{ const _p=authPersistence(); if(_p) auth.setPersistence(_p).catch(()=>{}); }catch(e){}   // 지속성은 부팅 시 1회만
    let _hadUser=false, _loginTimer=0;
    auth.onAuthStateChanged(user=>{
      try{ document.body.classList.remove('auth-pending'); }catch(e){}   // 첫 인증 결정 시 스플래시 해제
      if(_loginTimer){ clearTimeout(_loginTimer); _loginTimer=0; }   // 대기 중이던 '로그인화면 표시' 취소(전환 null→user 흡수)
      if(user){
        _hadUser=true;
        if(state.uid===user.uid) return;   // 같은 유저로 이미 진입 → 중복 onAuthStateChanged 무시(이중 부팅 방지)
        enterApp(user);
      } else {
        const showLogin=function(){ if(auth.currentUser) return;   // 그새 세션이 복원됐으면 무시
          detachListeners(); state.uid=null; state.userName=''; state.userEmail='';
          state.wsId=null; state.wsMeta=null; state.memberships=[];
          $('authScreen').style.display='flex'; $('app').style.display='none'; initAuthOpts(); };
        if(_hadUser){ _loginTimer=setTimeout(showLogin, 600); }   // 로그인 상태였다 null → iOS 순간 null을 지연 흡수
        else showLogin();   // 처음부터 미로그인 → 즉시 로그인화면
      }
    });
    initAuthOpts();   // 첫 로드 시 토글 상태·저장된 아이디 반영(스플래시 뒤에서 준비)

    // ===== 워크스페이스 부트스트랩 =====
    async function enterApp(user){
      state.uid=user.uid; state.userEmail=user.email||'';
      const _slowBoot=setTimeout(()=>{ try{ toast('연결이 지연되고 있어요 — 네트워크를 확인해 주세요', true); }catch(_){} }, 6000);   // 오프라인/느린 네트워크: 부팅 데이터(once)가 안 풀릴 때 안내
      try{
        const s=await db.ref('users/'+user.uid).once('value');
        clearTimeout(_slowBoot);
        let u=s.val()||{};
        if(!u.name){
          u.name = pendingSignupName || (user.email||'사용자').split('@')[0];
          await db.ref('users/'+user.uid).update({ name:u.name, email:user.email||'', createdAt:u.createdAt||new Date().toISOString() });
        }
        state.userName=u.name;
        state.userPhotos[state.uid]=u.photo||'';
        state.profilePublic=(u.profilePublic!==false);   // 기본 공개(미설정=공개)
        $('authScreen').style.display='none';
        $('app').style.display='flex';   // 사용자 확인 즉시 앱 노출(흰 스플래시가 오래 남지 않게) — 내용은 곧이어 채워짐
        initUserGraph();   // 개인 할일·친구(user-global) 상시 리스너 — 워크스페이스 무관
        ensureFriendCode().catch(e=>console.warn('friendCode', e));   // 내 친구 코드 보장
        setupPresence();   // 🟢 접속 상태(presence/{uid}) 기록 — 개발자 '사용자 현황' 접속중 표시
        await migrateLegacyIfNeeded();
        await loadMyWorkspaces();
        // 개인 프로필(=예약 워크스페이스 ws_{uid})은 항상 존재하도록 보장 — 그룹전환에서 '개인 프로필'로 선택 가능
        if(!(state.memberships||[]).some(w=>w.id==='ws_'+state.uid)){ await createPersonalWorkspace(true); await loadMyWorkspaces(); }
        try{ await migratePersonalTodos(); }catch(e){ console.warn('personal todo migrate', e); }   // 개인 할일 ws→user 1회 이전
        // 모드별(가계부/할일) 최근 컨텍스트 로드(크로스 디바이스) + 기본값 시드
        try{ const rw=(await db.ref('users/'+state.uid+'/recentWs').once('value')).val()||{};
          if(rw.ledger) state.recentWs.ledger=rw.ledger; if(rw.todo) state.recentWs.todo=rw.todo; }catch(e){}
        const personalId='ws_'+state.uid;
        const validWs=id=>!!id && state.memberships.some(w=>w.id===id);
        if(!validWs(state.recentWs.todo)) state.recentWs.todo=personalId;   // 할일 기본=개인 프로필
        if(!validWs(state.recentWs.ledger)) state.recentWs.ledger=(validWs(u.activeWs)?u.activeWs:null) || ((state.memberships.find(w=>w.type==='group')||state.memberships[0]||{id:personalId}).id);   // 가계부 기본=최근 활성/첫 그룹
        const target=validWs(state.recentWs[state.mode])?state.recentWs[state.mode]:personalId;
        await switchWorkspace(target, true);
        try{ initDock(); initCatGame(); setTimeout(autoClaimAttend, 800); }catch(e){ console.warn('cat game init', e); }   // 🐱 은화·고양이 dock
        if(justSignedUp){ justSignedUp=false; try{ if(typeof grantWelcomeGift==='function') setTimeout(grantWelcomeGift, 900); }catch(e){ console.warn('welcome gift', e); } }   // 🎉 신규 가입 축하 선물(멱등)
        try{ if(typeof maybeOnboard==='function') setTimeout(maybeOnboard, 1300); }catch(e){}   // 🧭 첫 사용자 온보딩(users/{uid}/onboarded 1회)
        try{ if(typeof initPush==='function') setTimeout(initPush, 1600); }catch(e){}   // 🔔 알림 토큰 조용히 갱신(권한 이미 허용 시)
        try{ if(typeof initGcal==='function') setTimeout(initGcal, 2200); }catch(e){}   // 📅 구글캘린더 연동돼 있으면 부팅 1회 동기화 킥(gcal.js)
      }catch(e){ clearTimeout(_slowBoot); toast(e.message||'로그인 처리 중 오류', true); }
    }

    // 개인 할일·친구 그래프(user-global) 상시 리스너 — 워크스페이스 전환과 무관하게 유지.
    let _userRefs=[];
    function initUserGraph(){
      if(!state.uid) return;
      _userRefs.forEach(r=>{ try{ r.off(); }catch(e){} }); _userRefs=[];
      Object.keys(_friendTodoRefs).forEach(u=>{ try{ _friendTodoRefs[u].off(); }catch(e){} }); _friendTodoRefs={}; state.friendTodosByUid={};   // 친구 할일 리스너 초기화
      const add=(path,cb)=>{ const r=db.ref('users/'+state.uid+'/'+path); r.on('value',cb); _userRefs.push(r); };
      add('todos', s=>{ const o=s.val()||{}; state.myTodos=Object.keys(o).map(k=>Object.assign({id:k,scope:'personal',ownerUid:state.uid},o[k])); rerender('todo'); if(typeof gcalKick==='function') gcalKick(); });   // 📅 내 할일 변경 → 구글캘린더 동기화 킥(연동 시)
      add('gcal', s=>{ state.gcal=s.val()||null; if(typeof onGcalData==='function') onGcalData(); });   // 📅 구글캘린더 연동 상태·매핑(users/{uid}/gcal — 본인 전용)
      add('friends', s=>{ state.friends=s.val()||{}; loadFriendPublics(); rerender('social'); });
      add('friendReqs', s=>{ state.friendReqs=s.val()||{}; rerender('social'); });
      add('todoPublic', s=>{ state.todoPublic=!!s.val(); syncFriendTodoWatch(); rerender('todo'); });   // 기본값 변경도 워치 게이트(myShareTo 폴백)에 반영
      add('todoShare', s=>{ state.todoShare=s.val()||{}; syncFriendTodoWatch(); rerender('social'); rerender('todo'); });   // 🔐 친구별 공유 토글 실시간 반영
      add('mailbox', s=>{ state.mailbox=s.val()||{}; if(typeof updateNewsBadge==='function') updateNewsBadge(); rerender('social'); });   // 🎁 친구가 보낸 선물함 — 소식(브랜드) 알림 뱃지도 갱신
    }
    // 🔐 내가 이 친구와 할일을 공유 중인가 — 친구별 토글(todoShare) 우선, 미설정이면 전체 기본값(todoPublic) 폴백.
    function myShareTo(uid){ const v=state.todoShare&&state.todoShare[uid]; return (v!=null)?!!v:!!state.todoPublic; }
    // 서로 보이는가 — 상대가 나와 공유 중(friendPub, 상대 토글 해석값) AND 내가 상대와 공유 중(내 토글). 한쪽이라도 OFF면 양방향 모두 숨김(사용자 지침).
    function todoMutual(uid){ return !!(state.friendPub&&state.friendPub[uid]===true) && myShareTo(uid); }
    // 친구별 '할일 공유' 여부를 읽어 캐시(친구 목록 변경 시 갱신) — 상대의 todoShare/{나} 우선, 미설정·규칙 미배포면 todoPublic 폴백.
    function loadFriendPublics(){
      const fr=Object.keys(state.friends||{}); state.friendPub=state.friendPub||{};
      Object.keys(state.friendPub).forEach(uid=>{ if(fr.indexOf(uid)<0){ delete state.friendPub[uid]; delete state.friendLikes[uid]; delete state.friendHomeChangedByUid[uid]; } });   // 삭제된 친구 정리
      const setPub=(uid,v)=>{ state.friendPub[uid]=!!v; syncFriendTodoWatch(); rerender('social'); };
      const fallbackPub=uid=>{ db.ref('users/'+uid+'/todoPublic').once('value').then(s=>setPub(uid,!!s.val())).catch(()=>{}); };
      fr.forEach(uid=>{ db.ref('users/'+uid+'/todoShare/'+state.uid).once('value')
          .then(s=>{ const v=s.val(); if(v!=null) setPub(uid,!!v); else fallbackPub(uid); })
          .catch(()=>fallbackPub(uid));   // todoShare 읽기 권한 없음(규칙 미배포 구환경) → 종전 todoPublic 동작 유지
        // 친구 목록/스토리용: 집 좋아요수 + 집 변경시각(무지개 링)
        db.ref('users/'+uid+'/homeLikes').once('value').then(s=>{ state.friendLikes[uid]=(typeof homeLikeCount==='function'?homeLikeCount(s.val()):0); rerender('social'); }).catch(()=>{});
        db.ref('homeCam/'+uid+'/changedAt').once('value').then(s=>{ state.friendHomeChangedByUid[uid]=s.val()||''; rerender('social'); }).catch(()=>{});   // 대표 방 공개 스냅샷의 변경시각(users/game은 비공개)
      });
      syncFriendTodoWatch();
    }
    // 공개 친구별 개인 할일(users/{uid}/todos) 실시간 리스너 동기화 → state.friendTodosByUid. 비공개/삭제 친구는 해제.
    let _friendTodoRefs={};
    function syncFriendTodoWatch(){
      const want=Object.keys(state.friends||{}).filter(uid=>todoMutual(uid));   // 🔐 양방향 공유(상대 토글 AND 내 토글)일 때만 구독
      // 더 이상 대상 아닌 친구 리스너 해제
      Object.keys(_friendTodoRefs).forEach(uid=>{ if(want.indexOf(uid)<0){ try{ _friendTodoRefs[uid].off(); }catch(e){} delete _friendTodoRefs[uid]; delete state.friendTodosByUid[uid]; } });
      // 새 공개 친구 리스너 부착
      want.forEach(uid=>{ if(_friendTodoRefs[uid]) return;
        const r=db.ref('users/'+uid+'/todos'); _friendTodoRefs[uid]=r;
        r.on('value', s=>{ const o=s.val()||{}; state.friendTodosByUid[uid]=Object.keys(o).map(k=>Object.assign({id:k,scope:'personal',ownerUid:uid},o[k])); rerender('todo'); }, ()=>{});
      });
    }
    // 내 친구 코드 보장(없으면 생성) + 인덱스 friendCodes/{code}=uid.
    async function ensureFriendCode(){
      if(!state.uid) return;
      const ref=db.ref('users/'+state.uid+'/friendCode');
      let code=(await ref.once('value')).val();
      if(!code){ code=randCode(6); await db.ref().update({ ['users/'+state.uid+'/friendCode']:code, ['friendCodes/'+code]:state.uid }); }
      state.friendCode=code;
    }
    // 🟢 접속 상태 기록: presence/{uid}=서버시각. 연결되면 쓰고, 끊기면 onDisconnect로 자동 삭제(정상 종료 시). 개발자 '사용자 현황'에서 접속중 판별에 사용.
    function setupPresence(){
      if(!state.uid || _presenceReady) return; _presenceReady=true;
      try{
        const ref=db.ref('presence/'+state.uid);
        db.ref('.info/connected').on('value', function(s){
          if(s.val()!==true) return;
          ref.onDisconnect().remove();
          ref.set(firebase.database.ServerValue.TIMESTAMP).catch(function(){});   // 규칙 미배포면 조용히 무시
          // 🗓️ 마지막 접속 시각을 users/{uid}/lastSeen에 영구 기록(끊겨도 유지) → 개발자 '사용자 현황'의 '오늘 접속자 수' 집계용
          try{ db.ref('users/'+state.uid+'/lastSeen').set(firebase.database.ServerValue.TIMESTAMP).catch(function(){}); }catch(e){}
        });
      }catch(e){}
    }
    let _presenceReady=false;
    // 개인 할일 ws→users/{uid}/todos 1회 이전(멱등: users/{uid}/todosMigrated).
    async function migratePersonalTodos(){
      const flagRef=db.ref('users/'+state.uid+'/todosMigrated');
      if((await flagRef.once('value')).val()) return;
      const upd={};
      for(const w of (state.memberships||[])){
        const o=(await db.ref('ws/'+w.id+'/todos').once('value')).val()||{};
        Object.keys(o).forEach(k=>{ const t=o[k]; if(t && t.scope==='personal' && ((t.ownerUid||t.createdByUid)===state.uid)){
          upd['users/'+state.uid+'/todos/'+k]=Object.assign({},t);
          upd['ws/'+w.id+'/todos/'+k]=null;   // 원본 삭제(그룹 할일은 유지)
        }});
      }
      upd['users/'+state.uid+'/todosMigrated']=true;
      await db.ref().update(upd);
    }

    // 구버전(전역 단일 트리) 데이터를 1회 그룹 워크스페이스로 이전. 멱등(migrationV3 플래그).
    async function migrateLegacyIfNeeded(){
      const flag=await db.ref('migrationV3').once('value');
      if(flag.exists()) return;
      let accSnap=null;
      try{ accSnap=await db.ref('accounts').once('value'); }     // 루트 전역 계좌 = 레거시 데이터 신호
      catch(e){ return; }                                        // 규칙에서 레거시 루트 노드가 제거돼 read가 거부되면 = 레거시 없음(신규 DB 부팅 보호)
      if(!accSnap.exists()) return;                              // 신규 환경 → 이전 불필요
      const claim=await db.ref('migrationV3').transaction(cur=> cur? undefined : { by:state.uid, at:new Date().toISOString() });
      if(!claim.committed) return;                               // 다른 클라이언트가 이미 처리 중/완료

      const users=(await db.ref('users').once('value')).val()||{};
      const memberUids=Object.keys(users);
      if(!memberUids.includes(state.uid)) memberUids.push(state.uid);
      const wsId='legacy_'+(memberUids[0]||state.uid).slice(0,10);
      const code=randCode(6);
      const now=new Date().toISOString();
      const members={};
      memberUids.forEach(uid=>{ members[uid]={ name:(users[uid]&&users[uid].name)||'멤버', role: uid===state.uid?'owner':'member', joinedAt:now }; });
      members[state.uid].role='owner';

      // 1단계: 멤버십/코드/인덱스 먼저 커밋(이후 ws 쓰기 권한 통과)
      const upd1={};
      upd1['workspaces/'+wsId]={ name:'공유 가계부', type:'group', code, ownerUid:state.uid, createdAt:now, members };
      upd1['codes/'+code]=wsId;
      memberUids.forEach(uid=>{ upd1['users/'+uid+'/ws/'+wsId]=true; });
      await db.ref().update(upd1);

      // 2단계: 기존 노드들을 ws/{wsId} 아래로 복사
      const NODES=['accounts','creditCards','categories','budgets','subscriptions','purposeBooks',
        'people','giftEvents','plannedGiftEvents','transactions','savings','recurring','recurringLogs','fixedExpenses'];
      const upd2={};
      for(const node of NODES){
        const s=await db.ref(node).once('value');
        if(s.exists()) upd2['ws/'+wsId+'/'+node]=s.val();
      }
      if(Object.keys(upd2).length) await db.ref().update(upd2);
      toast('기존 데이터를 "공유 가계부" 그룹으로 옮겼어요');
    }

    async function loadMyWorkspaces(){
      const s=await db.ref('users/'+state.uid+'/ws').once('value');
      const ids=Object.keys(s.val()||{});
      const metas=await Promise.all(ids.map(id=>
        db.ref('workspaces/'+id).once('value').then(ms=>{ const m=ms.val(); return m?Object.assign({id},m):null; })));
      state.memberships=metas.filter(Boolean).sort((a,b)=>
        (a.type===b.type? (a.createdAt||'').localeCompare(b.createdAt||'') : (a.type==='personal'?-1:1)));
    }

    async function createPersonalWorkspace(silent){
      const wsId='ws_'+state.uid;
      const now=new Date().toISOString();
      const upd={};
      upd['workspaces/'+wsId]={ name:'개인 프로필', type:'personal', ownerUid:state.uid, createdAt:now,
        members:{ [state.uid]:{ name:state.userName, role:'owner', joinedAt:now } } };
      upd['users/'+state.uid+'/ws/'+wsId]=true;
      await db.ref().update(upd);
      if(!silent) toast('개인 프로필을 준비했어요');
      return wsId;
    }

    async function createGroupWorkspace(name){
      const wsId='grp_'+state.uid.slice(0,6)+'_'+randCode(5).toLowerCase();
      const code=randCode(6);
      const now=new Date().toISOString();
      const upd={};
      upd['workspaces/'+wsId]={ name:name||'우리 가계부', type:'group', code, ownerUid:state.uid, createdAt:now,
        members:{ [state.uid]:{ name:state.userName, role:'owner', joinedAt:now } } };
      upd['codes/'+code]=wsId;
      upd['users/'+state.uid+'/ws/'+wsId]=true;
      await db.ref().update(upd);
      return { wsId, code };
    }

    async function joinByCode(code){
      code=(code||'').trim().toUpperCase();
      if(!code){ toast('그룹 코드를 입력하세요', true); return; }
      const cs=await db.ref('codes/'+code).once('value');
      const wsId=cs.val();
      if(!wsId){ toast('존재하지 않는 코드예요', true); return; }
      const ws=(await db.ref('workspaces/'+wsId).once('value')).val();
      if(!ws){ toast('그룹을 찾을 수 없어요', true); return; }
      if(ws.members && ws.members[state.uid]){ toast('이미 참여 중인 그룹이에요'); await loadMyWorkspaces(); await switchWorkspace(wsId); return true; }
      const now=new Date().toISOString();
      const upd={};
      // viaCode=합류에 쓴 초대코드 — RTDB 규칙이 이 값을 ws.code·codes 인덱스와 대조해 '코드를 아는 사람만 자기를 멤버로 추가'하도록 강제(임의 그룹 자가삽입 차단).
      upd['workspaces/'+wsId+'/members/'+state.uid]={ name:state.userName, role:'member', joinedAt:now, viaCode:code };
      upd['users/'+state.uid+'/ws/'+wsId]=true;
      await db.ref().update(upd);
      toast('"'+(ws.name||'그룹')+'"에 참여했어요');
      await loadMyWorkspaces();
      await switchWorkspace(wsId);
      return true;
    }

    async function leaveWorkspace(wsId){
      const ws=state.memberships.find(w=>w.id===wsId); if(!ws) return;
      const isOwner = ws.ownerUid===state.uid;
      const memberIds = Object.keys(ws.members||{});
      const memberCount = memberIds.length;
      const upd={};
      upd['users/'+state.uid+'/ws/'+wsId]=null;
      // 마지막 멤버면 워크스페이스/코드까지 정리, 아니면 멤버에서만 제거
      if(memberCount<=1){ upd['workspaces/'+wsId]=null; if(ws.code) upd['codes/'+ws.code]=null; }
      else {
        upd['workspaces/'+wsId+'/members/'+state.uid]=null;
        // 소유자가 나가면 남은 멤버에게 소유권 자동 이양 — 그룹이 주인 없는 상태로 남지 않게(안 하면 남은 멤버가 관리 불가)
        if(isOwner){ const next=memberIds.find(u=>u!==state.uid); if(next){ upd['workspaces/'+wsId+'/ownerUid']=next; upd['workspaces/'+wsId+'/members/'+next+'/role']='owner'; } }
      }
      try{ await db.ref().update(upd); }
      catch(e){ toast('그룹 나가기에 실패했어요. 잠시 후 다시 시도해 주세요', true); return; }
      if(typeof closeSheet==='function') closeSheet();   // 열려 있던 '그룹 관리' 시트를 닫아 결과가 바로 보이게
      await loadMyWorkspaces();
      const personalId='ws_'+state.uid;
      if(!(state.memberships||[]).some(w=>w.id===personalId)){ await createPersonalWorkspace(true); await loadMyWorkspaces(); }   // 개인 프로필 항상 보장
      // 모드별 최근 컨텍스트에 남은 '떠난 그룹' 잔재 정리(현재 모드 외 다른 모드 포함) — 무효면 개인 프로필로
      ['ledger','todo'].forEach(m=>{ if(!(state.memberships||[]).some(w=>w.id===state.recentWs[m])){ state.recentWs[m]=personalId;
        try{ localStorage.setItem('recentWs_'+m, personalId); }catch(e){}
        db.ref('users/'+state.uid+'/recentWs/'+m).set(personalId).catch(()=>{}); } });
      // 지금 보고 있던 컨텍스트를 나간 경우에만 전환(배경 그룹을 나가면 현재 화면 유지)
      if(state.wsId===wsId){ const fb=state.memberships.find(w=>w.id===personalId)||state.memberships[0]; if(fb) await switchWorkspace(fb.id); }
      toast('그룹에서 나갔어요');
    }

    async function switchWorkspace(wsId, initial){
      if(!wsId) return;
      let meta=state.memberships.find(w=>w.id===wsId);
      if(!meta){ const m=(await db.ref('workspaces/'+wsId).once('value')).val(); meta=m?Object.assign({id:wsId},m):{id:wsId,name:'가계부',type:'personal'}; }
      detachListeners();
      resetWorkspaceState();
      state.wsId=wsId; state.wsMeta=meta;
      state._todoFeed=false; if(typeof clearFriendView==='function') clearFriendView();   // 컨텍스트 바뀌면 할일 '친구들' 피드/친구 열람 초기화
      // 현재 모드(가계부/할일)의 '최근 컨텍스트'로 기억 → 모드 토글 시 각자 마지막 그룹/개인프로필 복원
      if(state.mode){ state.recentWs[state.mode]=wsId; try{ localStorage.setItem('recentWs_'+state.mode, wsId); }catch(e){} db.ref('users/'+state.uid+'/recentWs/'+state.mode).set(wsId).catch(()=>{}); }
      await db.ref('users/'+state.uid+'/activeWs').set(wsId);
      setupListeners();
      updateWorkspaceChip();
      applyMode();   // 저장된 모드(가계부/할일)에 맞춰 탭바+토글+화면 세팅
      loadMemberPhotos();   // 멤버 프로필 사진 캐시 채우기(비동기, 끝나면 rerender)
      if(!initial) toast((meta.type==='personal'?'개인 프로필':(meta.name||'가계부'))+'(으)로 전환했어요');
    }
    // 현재 워크스페이스 멤버들의 프로필 사진을 users/{uid}/photo 에서 읽어 캐시
    async function loadMemberPhotos(){
      const m=(state.wsMeta&&state.wsMeta.members)||{};
      const uids=Object.keys(m); if(!uids.length) return;
      try{
        await Promise.all(uids.map(uid=>db.ref('users/'+uid+'/photo').once('value').then(s=>{ state.userPhotos[uid]=s.val()||''; }).catch(()=>{})));
        rerender();
      }catch(e){}
    }
    // 프로필 저장: 사진(photoChange: undefined=유지 / ''=삭제 / dataURL=교체) + 이름(별명) + 공개여부(isPublic: undefined=유지)
    async function saveProfile(name, photoChange, isPublic){
      name=(name||'').trim()||state.userName;
      const oldName=state.userName;   // 🧹 개명 전파용 — 데이터에 이름 문자열로 저장된 소비대상/소유자를 새 이름으로 옮긴다
      const upd={ name };
      if(photoChange!==undefined) upd.photo=photoChange||null;   // ''/null → 삭제
      if(isPublic!==undefined) upd.profilePublic=!!isPublic;
      await db.ref('users/'+state.uid).update(upd);
      // 이름 비정규화: 내가 속한 모든 워크스페이스의 멤버 이름 갱신
      (state.memberships||[]).forEach(w=>{
        db.ref('workspaces/'+w.id+'/members/'+state.uid+'/name').set(name).catch(()=>{});
        if(w.members&&w.members[state.uid]) w.members[state.uid].name=name;
      });
      if(state.wsMeta&&state.wsMeta.members&&state.wsMeta.members[state.uid]) state.wsMeta.members[state.uid].name=name;
      state.userName=name;
      // 🧹 개명 전파: 옛 이름으로 저장된 거래 user·계좌 owner·정기 user 등을 새 이름으로(현재 ws 즉시 스윕).
      //   다른 워크스페이스는 prevNames 이력에 기록해 두면 그 ws 접속 시 sweepMyPrevNames가 자동 정리(멤버 명단만 바꾸고
      //   데이터 속 이름은 안 바뀌어 리포트에 옛 이름이 별도 인물로 남던 문제 — 사용자 보고 2026-08 '구공→구근').
      if(oldName && name && oldName!==name){
        try{ db.ref('users/'+state.uid+'/prevNames').push({ name:oldName, at:new Date().toISOString() }); }catch(e){}
        const mm=(state.wsMeta&&state.wsMeta.members)||{};
        const others=Object.keys(mm).filter(u=>u!==state.uid).map(u=>(mm[u]||{}).name||'');
        if(others.indexOf(oldName)<0)   // 동명이인 보호 — 옛 이름이 다른 멤버의 현재 이름이면 데이터는 건드리지 않음
          sweepRenamedNames({ [oldName]:{ uid:state.uid, name } }).catch(()=>{});
      }
      if(photoChange!==undefined) state.userPhotos[state.uid]=photoChange||'';
      if(isPublic!==undefined) state.profilePublic=!!isPublic;
      if(typeof writeMyRanking==='function') writeMyRanking();   // 랭킹 엔트리(이름·공개여부) 갱신
      rerender();
    }
    // 이름/uid 해시 → 폴백 아바타 배경색
    function avatarColor(s){ s=String(s||'?'); let h=0; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0;
      const p=['#3182f6','#1b9e5f','#f04452','#f59f00','#9b59b6','#00b8d4','#e84393','#7b68ee']; return p[h%p.length]; }
    // 이름/uid 해시 → 컬러 그라데이션(시안풍 아바타 배경)
    function avatarGrad(s){ s=String(s||'?'); let h=0; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0;
      const g=[['#6a8dff','#3f5bd6'],['#f3b14e','#e8862f'],['#7fd1a6','#3aa876'],['#c8a6f0','#9b6fe0'],['#ff9aa2','#f0606b'],['#5ad1e0','#26a7bd'],['#ffb86b','#f0883a'],['#a0c4ff','#5a8de0']];
      const c=g[h%g.length]; return 'linear-gradient(135deg,'+c[0]+','+c[1]+')'; }

    function resetWorkspaceState(){
      Object.assign(state, { transactions:[], accounts:[], categories:[], savings:[], stocks:[], recurring:[],
        creditCards:[], subscriptions:[], purposeBooks:[], people:[], giftEvents:[], plannedGiftEvents:[], settlementPayments:[], loans:[], loanPayments:[], wsSettings:{}, budgets:[], todos:[], todoCats:[] });   // todos 포함 — 그룹 전환 직후 이전 그룹 할일이 남아 새 ws에 유령 할일이 생기던 격리 위반 방지
      state._balCache=null;   // 계좌 잔액 캐시 무효화(워크스페이스 전환)
      state.memberFilter='';
      seededAcc=seededCat=seededTodoCat=booted=migratedAcc=migratedCat=migratedBudget=migratedRec=false;
      sweptPrevNames=false;   // 🧹 ws 전환 시 옛 이름 자동 정리도 다시 1회 허용
      recurringLogKeys=new Set();
      recv.tx=recv.acc=recv.cat=recv.rec=recv.log=recv.card=false;
    }

    function updateWorkspaceChip(){
      const el=$('wsChip'); if(!el||!state.wsMeta) return;
      const personal = state.wsMeta.type==='personal';
      // 개인 프로필=내 아바타+'개인 프로필'. 그룹=그룹 사진/이니셜+그룹명.
      const badge = personal
        ? (typeof avatarHtml==='function' ? avatarHtml(state.uid, state.userName||'', 20) : '<span class="dotk"></span>')
        : ((typeof wsAvatarHtml==='function')
            ? wsAvatarHtml(state.wsMeta.name, state.wsMeta.photo, 20)
            : (safeImgSrc(state.wsMeta.photo) ? '<img src="'+safeImgSrc(state.wsMeta.photo)+'" alt="" style="width:20px;height:20px;border-radius:50%;object-fit:cover;flex:none;">' : '<span class="dotk"></span>'));
      el.innerHTML = badge+escapeHtml(personal ? '개인 프로필' : (state.wsMeta.name||'가계부'));
    }

    function isGroupWs(){ return state.wsMeta && state.wsMeta.type==='group'; }
    function wsMemberNames(){ const m=(state.wsMeta&&state.wsMeta.members)||{}; return Object.keys(m).map(k=>m[k].name).filter(Boolean); }
    // ⚠️ owner/소비대상(user) 규칙: `ownerOptions`가 값=**멤버 uid**로 저장한다(+'공동'·레거시 이름 섞임).
    //    따라서 화면에 owner/t.user를 표시하거나 비교할 땐 **반드시 ownerName()으로 이름 해석**한다(uid 원문 노출 방지 — 예: 자산 계좌 옆 uid가 뜨던 버그).
    // 소유자 → 표시 이름: 멤버면 이름, 아니면(공동·레거시 이름·미상 uid) 값 그대로.
    function ownerName(uid){ const m=(state.wsMeta&&state.wsMeta.members)||{}; return (m[uid]&&m[uid].name)||uid; }
    // 이름 → 멤버 uid(현재 워크스페이스, 일치 없으면 '') — 이름만 저장된 레코드에 uid를 백필할 때 사용(개명 견고)
    function memberUidByName(name){ if(!name||name==='공동') return ''; const m=(state.wsMeta&&state.wsMeta.members)||{}; for(const u in m){ if((m[u].name||'')===name) return u; } return ''; }
    // ⭐ ownerOptions 선택값(uid|'공동'|레거시 이름)을 **저장용 이름**으로 정규화 — owner/소비대상은 이름으로 저장한다(거래 tx.user와 동일 패턴).
    //    새 저장 경로(계좌·정기 등)는 반드시 이걸 거쳐, uid가 데이터에 그대로 박히지 않게 한다. (표시 방어는 ownerName, 저장 방어는 이 함수.)
    function resolveOwnerName(sel){ const m=(state.wsMeta&&state.wsMeta.members)||{};
      if(!sel || sel==='공동') return sel||'공동';
      if(m[sel]) return m[sel].name||state.userName||sel;   // 멤버 uid → 이름
      if(sel===state.uid) return state.userName||'공동';     // 내 uid → 내 이름
      return sel; }                                          // 레거시 이름/미상은 그대로
    function defaultOwnerUid(){ const s=state.wsSettings&&state.wsSettings.defaultOwner; if(s==='me') return state.uid; if(s==='common') return '공동'; return isGroupWs()?'공동':state.uid; }
    // 소비 대상 옵션: 값=멤버 uid(표시=이름) + 공동. selected는 uid|'공동'|레거시 이름(옵션으로 보존).
    function ownerOptions(selected, fallbackLabel){
      const m=(state.wsMeta&&state.wsMeta.members)||{}, uids=Object.keys(m);
      let h=uids.map(u=>'<option value="'+u+'"'+(u===selected?' selected':'')+'>'+escapeHtml(m[u].name||'멤버')+'</option>').join('');
      h+='<option value="공동"'+(selected==='공동'?' selected':'')+'>공동</option>';
      // 미상 선택값(탈퇴 멤버 uid·레거시 이름): 이름 라벨(fallbackLabel)이 있으면 값·표시를 이름으로 — uid 노출·재저장 방지
      if(selected && selected!=='공동' && !uids.includes(selected)){ const fl=fallbackLabel||selected; h+='<option value="'+escapeHtml(fl)+'" selected>'+escapeHtml(fl)+'</option>'; }
      return h;
    }
    // ===== 공동 설정(권한/기본값) =====
    function isWsOwner(){ return state.wsMeta && state.wsMeta.ownerUid===state.uid; }
    function defaultVisibility(){ return state.wsSettings && state.wsSettings.defaultVisibility==='private' ? 'private' : 'full'; }
    function defaultOwnerName(){ const s=state.wsSettings&&state.wsSettings.defaultOwner; if(s==='me') return state.userName||'공동'; if(s==='common') return '공동'; return isGroupWs()?'공동':(state.userName||'공동'); }
    function saveWsSettings(patch){ db.ref(wp('settings')).update(Object.assign({ updatedAt:new Date().toISOString() }, patch)); }
    // 소유자 전용 워크스페이스 관리 (UI에서 권한 게이팅). workspaces/{wsId} 노드 직접 갱신.
    async function renameWorkspace(wsId, name){
      name=(name||'').trim(); if(!name) return;
      await db.ref('workspaces/'+wsId+'/name').set(name);
      const m=state.memberships.find(w=>w.id===wsId); if(m) m.name=name;
      if(state.wsId===wsId && state.wsMeta){ state.wsMeta.name=name; updateWorkspaceChip(); }
      toast('그룹 이름을 바꿨어요');
    }
    // 가계부 프로필 저장: 이름 + 사진(photoChange: undefined=유지 / ''=삭제 / dataURL=교체)
    // workspaces/{wsId} 는 멤버면 쓰기 가능(규칙) — 별도 규칙 변경 불필요
    async function saveWsProfile(name, photoChange){
      const wsId=state.wsId; if(!wsId) return;
      name=(name||'').trim(); if(!name) return;
      const upd={}; upd['workspaces/'+wsId+'/name']=name;
      if(photoChange!==undefined) upd['workspaces/'+wsId+'/photo']=photoChange||null;
      await db.ref().update(upd);
      const apply=o=>{ if(!o) return; o.name=name; if(photoChange!==undefined) o.photo=photoChange||''; };
      apply(state.wsMeta); apply(state.memberships.find(x=>x.id===wsId));
      updateWorkspaceChip(); rerender();
    }
    async function transferOwnership(wsId, uid){
      const w=state.memberships.find(x=>x.id===wsId); if(!w) return;
      const old=w.ownerUid;
      const upd={};
      upd['workspaces/'+wsId+'/ownerUid']=uid;
      if(old) upd['workspaces/'+wsId+'/members/'+old+'/role']='member';
      upd['workspaces/'+wsId+'/members/'+uid+'/role']='owner';
      await db.ref().update(upd);
      await loadMyWorkspaces();
      if(state.wsId===wsId){ const m=state.memberships.find(x=>x.id===wsId); if(m) state.wsMeta=m; }
      toast('소유자를 넘겼어요'); rerender();
    }
    async function removeMember(wsId, uid){
      // 멤버에서 제거 → 해당 사용자는 ws/{wsId} 접근 차단. (상대 users/{uid}/ws 인덱스는 본인만 삭제 가능해 잔존하나 접근은 불가)
      await db.ref('workspaces/'+wsId+'/members/'+uid).remove();
      await loadMyWorkspaces();
      if(state.wsId===wsId){ const m=state.memberships.find(x=>x.id===wsId); if(m) state.wsMeta=m; }
      toast('멤버를 내보냈어요'); rerender();
    }

    // 새 워크스페이스 기본 계좌 (개인=내 계좌 1개 / 그룹=공동 자산)
    function buildDefaultAccounts(){
      const now=Date.now();
      if(isGroupWs()){
        return { ['acc_'+now]:{ name:'공동 자산', type:'bank', provider:'manual', owner:'공동', initialBalance:0, color:'#1b9e5f', order:1, visibility:'full', memo:'' } };
      }
      return { ['acc_'+now]:{ name:(state.userName||'내')+' 자산', type:'bank', provider:'manual', owner:state.userName||'공동', initialBalance:0, color:'#3182f6', order:1, visibility:'full', memo:'' } };
    }

    // ===== 데이터 리스너 (현재 워크스페이스 ws/{wsId} 기준) =====
    let attachedRefs=[];
    function attach(path, cb){ const r=db.ref(wp(path)); r.on('value', cb); attachedRefs.push(r); }
    function detachListeners(){ attachedRefs.forEach(r=>r.off()); attachedRefs=[]; listenersAttached=false; }
    // 🔌 데이터 리스너 → 렌더 트리거는 App.store.emit(reason) 경유(Model→View 분리 시작). emit(r)은 현재 rerender(r) 그대로 호출(동작 동일) + 구독자 통지 훅. reason 태그는 기존과 동일하게 유지(하위호환).
    function setupListeners(){
      if(listenersAttached) return;
      listenersAttached=true;

      attach('accounts', s=>{
        if(!s.exists() && !seededAcc){ seededAcc=true; db.ref(wp('accounts')).set(buildDefaultAccounts()); return; }
        const o=s.val()||{}; state.accounts=Object.keys(o).map(k=>Object.assign({id:k},o[k])).sort((a,b)=>(a.order||0)-(b.order||0));
        migrateAccounts(); normalizeAccountOwners();   // 레거시 uid owner → 이름(멱등)
        recv.acc=true; App.store.emit(); maybeBoot();
      });
      attach('creditCards', s=>{
        const o=s.val()||{}; state.creditCards=Object.keys(o).map(k=>Object.assign({id:k},o[k]));
        recv.card=true; App.store.emit(); maybeBoot();   // 카드 대금 자동 기록(runCardBills)이 카드 설정을 기다리게 부팅 게이트에 포함(value는 빈 노드도 1회 발화)
      });
      attach('categories', s=>{
        if(!s.exists() && !seededCat){ seededCat=true; db.ref(wp('categories')).set(buildDefaultCategories()); return; }
        const o=s.val()||{};
        migrateCategories(o);
        state.categories=Object.keys(o).map(k=>Object.assign({name:k},o[k])).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
        recv.cat=true; App.store.emit();
      });
      attach('budgets', s=>{
        const v=s.val();
        if(v && (v.monthlyTotal!==undefined || v.byCategory!==undefined)){ migrateBudgets(v); return; } // 구버전 단일 객체
        const o=v||{}; state.budgets=Object.keys(o).filter(k=>o[k] && typeof o[k]==='object').map(k=>Object.assign({id:k},o[k]));
        App.store.emit();
      });
      attach('transactions', s=>{
        const arr=[]; s.forEach(us=>{ us.forEach(ts=>{ arr.push(Object.assign({ownerUid:us.key,id:ts.key},ts.val())); }); });
        state.transactions=arr; state._balCache=null; recv.tx=true; App.store.emit(); maybeBoot();   // 거래 변경 시 잔액 캐시 무효화(다음 accountBalance 호출에서 1회 재계산)
        // 🔗 연동 이체 "보낸 그룹으로 이동" — ws 전환 직후 심어둔 원본 반쪽을 거래 수신 시점에 1회 열어준다(best-effort, views.js xwsGoOrigin)
        if(state._pendingOpenTx){ const p=state._pendingOpenTx;
          if(Date.now()-(p.at||0)>30000) state._pendingOpenTx=null;   // 30초 지나면 폐기(전환 실패·원본 삭제 등 — 나중에 엉뚱하게 열리지 않게)
          else if(arr.some(x=>x.ownerUid===p.ownerUid && x.id===p.id)){ state._pendingOpenTx=null;
            if(typeof openTxSheet==='function') setTimeout(()=>{ try{ openTxSheet(p.ownerUid, p.id); }catch(e){} }, 0); }
        }
      });
      attach('savings', s=>{
        const arr=[]; s.forEach(us=>{ us.forEach(vs=>{ arr.push(Object.assign({ownerUid:us.key,id:vs.key},vs.val())); }); });
        state.savings=arr; App.store.emit();
      });
      attach('stocks', s=>{   // 📈 주식 보유 종목(ws/{wsId}/stocks/{uid}/{id}) — savings와 같은 per-uid 평탄화
        const arr=[]; s.forEach(us=>{ us.forEach(vs=>{ arr.push(Object.assign({ownerUid:us.key,id:vs.key},vs.val())); }); });
        state.stocks=arr; App.store.emit();
      });
      attach('recurring', s=>{
        const arr=[]; s.forEach(us=>{ us.forEach(rs=>{ arr.push(Object.assign({ownerUid:us.key,id:rs.key},rs.val())); }); });
        state.recurring=arr; migrateRecurring(); recv.rec=true; App.store.emit(); maybeBoot();
      });
      attach('recurringLogs', s=>{
        const set=new Set(); s.forEach(us=>{ us.forEach(ls=>{ set.add(ls.key); }); });
        recurringLogKeys=set; recv.log=true; maybeBoot();
      });
      attach('subscriptions', s=>{
        const o=s.val()||{}; state.subscriptions=Object.keys(o).map(k=>Object.assign({id:k},o[k])); App.store.emit();
      });
      attach('purposeBooks', s=>{
        const o=s.val()||{}; state.purposeBooks=Object.keys(o).map(k=>Object.assign({id:k},o[k])); App.store.emit();
      });
      attach('todos', s=>{
        const o=s.val()||{}; state.todos=Object.keys(o).map(k=>Object.assign({id:k},o[k])); App.store.emit('todo');
        if(typeof gcalKick==='function') gcalKick();   // 📅 그룹 할일 변경(다른 멤버 수정·담당자 변경 포함) → 구글캘린더 동기화 킥(연동 시)
      });
      // (구 attach('todoShare') 레거시 리스너 제거 — ws/{wsId}/todoShare가 users/{uid}/todoShare(친구별 토글, add() 리스너)와 같은 state 키를 {}로 덮어써
      //  워크스페이스 전환·재로그인 시 친구별 공유 OFF가 조용히 되돌아가던 버그. 친구별 토글은 core.js:441 add('todoShare')가 단일 소스.)
      // 🎨 할일 카테고리 — 없으면 기본 세트 1회 시드(가계부 categories 와 동일 패턴). 워크스페이스 멤버가 공유한다.
      attach('todoCats', s=>{
        if(!s.exists() && !seededTodoCat){ seededTodoCat=true; db.ref(wp('todoCats')).set(buildDefaultTodoCats()); return; }
        const o=s.val()||{};
        state.todoCats=Object.keys(o).filter(k=>o[k]&&typeof o[k]==='object').map(k=>Object.assign({id:k},o[k])).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
        App.store.emit('todo');
      });
      attach('people', s=>{
        const o=s.val()||{}; state.people=Object.keys(o).map(k=>Object.assign({id:k},o[k])); App.store.emit();
      });
      attach('giftEvents', s=>{
        const o=s.val()||{}; state.giftEvents=Object.keys(o).map(k=>Object.assign({id:k},o[k])); App.store.emit();
      });
      attach('plannedGiftEvents', s=>{
        const o=s.val()||{}; state.plannedGiftEvents=Object.keys(o).map(k=>Object.assign({id:k},o[k])); App.store.emit();
      });
      attach('settlementPayments', s=>{   // 정산 송금 기록(per-uid: {uid}/{id})
        const arr=[]; s.forEach(us=>{ us.forEach(ps=>{ arr.push(Object.assign({ownerUid:us.key,id:ps.key},ps.val())); }); });
        state.settlementPayments=arr; App.store.emit();
      });
      attach('loans', s=>{
        const o=s.val()||{}; state.loans=Object.keys(o).map(k=>Object.assign({id:k},o[k])); App.store.emit();
      });
      attach('loanPayments', s=>{
        const o=s.val()||{}; state.loanPayments=Object.keys(o).map(k=>Object.assign({id:k},o[k])); App.store.emit();
      });
      attach('settings', s=>{ state.wsSettings=s.val()||{}; App.store.emit(); });

      migrateFixed();
    }

    function migrateFixed(){
      db.ref(wp('fixedExpenses/'+state.uid)).once('value', snap=>{
        if(!snap.exists()) return;
        const first=state.accounts[0];
        snap.forEach(ch=>{
          const f=ch.val();
          db.ref(wp('recurring/'+state.uid+'/'+ch.key)).set({
            type:'expense', amount:f.amount||0, desc:f.name||'고정지출', from:f.account||(first&&first.id)||'',
            category:'기타', freq:(f.period==='weekly'?'weekly':'monthly'), day:1, weekday:1,
            startDate: todayStr(), lastPosted:'', active:true, user:f.user||state.userName
          });
        });
        db.ref(wp('fixedExpenses/'+state.uid)).remove();
        toast('고정지출을 반복거래로 옮겼어요');
      });
    }

    // 기존 계좌 한글 type → 영문 enum + provider/visibility 보강 (1회)
    function migrateAccounts(){
      if(migratedAcc) return; migratedAcc=true;
      const map={'계좌':'bank','현금':'cash','카드':'credit_card'};
      const upd={};
      state.accounts.forEach(a=>{
        if(map[a.type]) upd['accounts/'+a.id+'/type']=map[a.type];
        if(a.provider===undefined) upd['accounts/'+a.id+'/provider']='manual';
        if(a.visibility===undefined) upd['accounts/'+a.id+'/visibility']='full';
      });
      if(Object.keys(upd).length) db.ref(wsRoot()).update(upd);
    }
    // 레거시 정리(멱등): owner가 멤버 uid로 저장된 계좌 → 이름으로 정규화하고 uid는 ownerUid로 보존. wsMeta(멤버) 로드 후에만 동작하며, 고칠 게 없으면 쓰지 않아 자동 종료.
    function normalizeAccountOwners(){
      const mm=(state.wsMeta&&state.wsMeta.members)||{}; if(!Object.keys(mm).length) return;
      const upd={};
      (state.accounts||[]).forEach(a=>{ if(a.owner && mm[a.owner]){ upd['accounts/'+a.id+'/owner']=mm[a.owner].name||a.owner; if(a.ownerUid===undefined) upd['accounts/'+a.id+'/ownerUid']=a.owner; } });
      if(Object.keys(upd).length) db.ref(wsRoot()).update(upd);
    }

    // 🧹 이름 스윕 실행 — 현재 ws에 로드된 데이터로 치환 계획(buildRenameSweep, util.js 순수)을 만들어 다중경로 update 1회.
    //  nameMap = { 옛이름: { uid, name } }. 손댄 레코드 수를 resolve하는 Promise 반환(0=할 일 없음, 쓰기 생략).
    function sweepRenamedNames(nameMap){
      const plan=buildRenameSweep({ transactions:state.transactions, recurring:state.recurring, accounts:state.accounts,
        budgets:state.budgets, loans:state.loans, subscriptions:state.subscriptions, todos:state.todos,
        purposeBooks:state.purposeBooks, settlementPayments:state.settlementPayments }, nameMap);
      if(!plan.count) return Promise.resolve(0);
      return db.ref(wsRoot()).update(plan.upd).then(()=>plan.count);
    }
    // 🧹 접속 시 내 옛 이름 자동 정리 — 개명 이력(users/{uid}/prevNames)의 이름이 이 ws 데이터에 남아 있으면 현재 이름으로 스윕.
    //  ws당 세션 1회(sweptPrevNames, 전환 시 리셋). 다른 멤버의 '현재' 이름과 같은 옛 이름은 건드리지 않음(동명이인 보호).
    //  멱등 — 치환이 끝난 뒤엔 매칭이 없어 쓰기가 발생하지 않는다. saveProfile(현재 ws 즉시 전파)의 "다른 워크스페이스" 짝.
    let sweptPrevNames=false;
    function sweepMyPrevNames(){
      if(sweptPrevNames || !state.uid) return; sweptPrevNames=true;
      db.ref('users/'+state.uid+'/prevNames').once('value').then(s=>{
        const o=s.val()||{}; const cur=state.userName||''; if(!cur) return;
        const mm=(state.wsMeta&&state.wsMeta.members)||{};
        const others=Object.keys(mm).filter(u=>u!==state.uid).map(u=>(mm[u]||{}).name||'');
        const nameMap={};
        Object.keys(o).forEach(k=>{ const n=(o[k]&&o[k].name)||''; if(n && n!==cur && others.indexOf(n)<0) nameMap[n]={ uid:state.uid, name:cur }; });
        if(Object.keys(nameMap).length) return sweepRenamedNames(nameMap);
      }).catch(()=>{});
    }

    // 카테고리 확장 마이그레이션: 기존(이름만/일부필드) → 풀 필드, 누락 기본 카테고리 시드 (1회, 멱등)
    function migrateCategories(o){
      if(migratedCat) return; migratedCat=true;
      const upd={}; const names=Object.keys(o);
      let maxOrder=0; names.forEach(n=>{ maxOrder=Math.max(maxOrder, Number(o[n].sortOrder)||0); });
      // 1) 기존 카테고리 필드 보강 (type 없는 것 = 미마이그레이션)
      names.forEach((n,i)=>{ const c=o[n]||{};
        if(c.type===undefined){
          upd['categories/'+n+'/type']= (n==='기타'?'other':'expense');
          upd['categories/'+n+'/isDefault']= OLD_DEFAULT_CAT_NAMES.includes(n);
          upd['categories/'+n+'/isActive']= (c.isActive!==false);
          upd['categories/'+n+'/sortOrder']= (c.sortOrder!=null?c.sortOrder:i);
          upd['categories/'+n+'/visibility']= c.visibility||'full';
          upd['categories/'+n+'/owner']= c.owner||'공동';
        }
      });
      // 2) 신규 기본 카테고리 시드 (없는 이름만) — 사용자가 삭제한 기본(catDeleted 툼스톤)은 다시 만들지 않음.
      const applyUpd=()=>{ if(Object.keys(upd).length) db.ref(wsRoot()).update(upd); };
      db.ref(wp('catDeleted')).once('value').then(ds=>{
        const del=ds.val()||{}; const defs=buildDefaultCategories(); let order=maxOrder;
        Object.keys(defs).forEach(n=>{ if(!(n in o) && !del[n]){ const d=Object.assign({},defs[n]); d.sortOrder=++order; upd['categories/'+n]=d; } });
        applyUpd();
      }).catch(applyUpd);
    }

    // 구버전 단일 budgets({monthlyTotal,byCategory}) → budgets/{id} 레코드 컬렉션 (1회, 멱등)
    function migrateBudgets(old){
      if(migratedBudget) return; migratedBudget=true;
      const now=new Date().toISOString(); const upd={}; let i=0;
      const mk=(categoryName,amount)=>({ categoryName:categoryName||null, amount, periodType:'monthly', scope:'group', owner:'공동', alertEnabled:true, alertThreshold:80, visibility:'full', purposeBookId:null, createdAt:now, updatedAt:now });
      if(Number(old.monthlyTotal)>0) upd['budgets/bg_total']=mk(null, Number(old.monthlyTotal));
      const bc=old.byCategory||{};
      Object.keys(bc).forEach(name=>{ if(Number(bc[name])>0) upd['budgets/bg_'+(++i)]=mk(name, Number(bc[name])); });
      upd['budgets/monthlyTotal']=null; upd['budgets/byCategory']=null; // 구 키 제거
      db.ref(wsRoot()).update(upd);
    }

    function maybeBoot(){
      if(booted) return;
      if(recv.tx && recv.acc && recv.rec && recv.log && recv.card){ booted=true; setTimeout(()=>{ runRecurring(); runCardBills(); }, 300);
        setTimeout(sweepMyPrevNames, 2500); }   // 🧹 개명 이력 자동 정리 — 부팅 게이트 밖 노드(목적별·할일 등)도 도착한 뒤 1회
    }

    // 기존 recurring 규칙에 신규 필드 보강(status/interval/autoCreate/visibility) — 1회, 본인 uid만
    function migrateRecurring(){
      if(migratedRec) return; migratedRec=true;
      const upd={};
      state.recurring.filter(r=>r.ownerUid===state.uid).forEach(r=>{
        const b='recurring/'+state.uid+'/'+r.id+'/';
        if(r.status===undefined) upd[b+'status']=(r.active===false?'paused':'active');
        if(r.interval===undefined) upd[b+'interval']=1;
        if(r.autoCreate===undefined) upd[b+'autoCreate']=true;
        if(r.visibility===undefined) upd[b+'visibility']='full';
      });
      if(Object.keys(upd).length) db.ref(wsRoot()).update(upd);
    }

    // ===== 정기거래 자동기록 (멱등) =====
    // [누락 회차 정책] 여러 달 미접속 시 누락분을 모두 생성하되, 앱 1회 실행당 규칙별 최대 12회차까지만 생성.
    // 남은 회차는 다음 실행 때 이어서 생성(한 번에 폭주 방지).
    const MAX_RECUR_PER_RUN = 12;
    function clampDay(y, m0, day){ const last=new Date(y,m0+1,0).getDate(); return Math.min(day, last); }
    function firstOccurrence(rule){
      const start=parseDate(rule.startDate||todayStr()); const f=rule.freq||'monthly';
      if(f==='daily'||f==='custom') return start;
      if(f==='weekly'){ const wd=(rule.weekday!=null?Number(rule.weekday):start.getDay()); const d=new Date(start); d.setDate(d.getDate()+((wd-d.getDay()+7)%7)); return d; }
      if(f==='yearly'){ const mo=start.getMonth(), dom=Number(rule.day)||start.getDate(); let y=start.getFullYear(); let occ=new Date(y,mo,clampDay(y,mo,dom)); if(occ<start) occ=new Date(++y,mo,clampDay(y,mo,dom)); return occ; }
      const dom=Number(rule.day)||start.getDate(); let y=start.getFullYear(), m=start.getMonth(); let occ=new Date(y,m,clampDay(y,m,dom)); if(occ<start){ m++; if(m>11){m=0;y++;} occ=new Date(y,m,clampDay(y,m,dom)); } return occ;
    }
    function nextAfter(occ, rule){
      const iv=Math.max(1,Number(rule.interval)||1), f=rule.freq||'monthly', d=new Date(occ);
      if(f==='daily'||f==='custom'){ d.setDate(d.getDate()+iv); return d; }
      if(f==='weekly'){ d.setDate(d.getDate()+7*iv); return d; }
      if(f==='yearly'){ const dom=Number(rule.day)||d.getDate(); const y=d.getFullYear()+iv, m=d.getMonth(); return new Date(y,m,clampDay(y,m,dom)); }
      const dom=Number(rule.day)||d.getDate(); let y=d.getFullYear(), m=d.getMonth()+iv; y+=Math.floor(m/12); m=((m%12)+12)%12; return new Date(y,m,clampDay(y,m,dom));
    }
    function occurrencesV2(rule, fromD, toD){
      const out=[]; let occ=firstOccurrence(rule), g=0;
      while(occ<fromD && g++<6000) occ=nextAfter(occ,rule);
      g=0; while(occ<=toD && g++<600){ out.push(new Date(occ)); occ=nextAfter(occ,rule); }
      return out;
    }
    function ruleStatus(rule){ return rule.status || (rule.active===false?'paused':'active'); }
    function nextRunOf(rule){
      let nr=firstOccurrence(rule), g=0; const anchor=rule.lastPosted?parseDate(rule.lastPosted):null;
      while(anchor && nr<=anchor && g++<6000) nr=nextAfter(nr,rule);
      const endD=rule.endDate?parseDate(rule.endDate):null;
      return (endD && nr>endD)?null:nr;
    }
    function nextOccurrence(rule){ return nextRunOf(rule); } // 호환: 홈 '다가오는 반복결제'

    // 정기거래 → Transaction (기존 TX_EFFECT/실제소비/카드실적 규칙 그대로 재사용)
    function buildRecurringTx(rule, occ){
      const type=rule.type;
      const tx={ type, date:new Date(occ.getFullYear(),occ.getMonth(),occ.getDate(),12,0,0).toISOString(),
        user:rule.user||state.userName, amount:Number(rule.amount)||0,
        desc: rule.desc||TYPE_LABEL[type]||'정기',
        isActualExpense: type==='income' ? true : !!ACTUAL_DEFAULT[type],   // 수입은 실수입(false면 리포트 수입 집계에서 빠짐 — buildTx와 동일 수정)
        recurringId:rule.id, recurringTitle:rule.desc||'', scheduledDate:ymd(occ), generatedBy:'recurring' };
      // 👤 소비대상 uid 병행 저장(개명 견고) — 규칙의 userUid 우선, 없으면 이름→멤버 uid 역해석. 예전엔 이름만 저장돼
      //   개명 후 리포트에서 옛 이름이 별도 인물로 갈라졌다(사용자 보고 2026-08).
      { const _muid=rule.userUid||memberUidByName(tx.user); if(_muid) tx.userUid=_muid; }
      if(rule.memo) tx.memo=rule.memo;
      const e=TX_EFFECT[type]||{};
      if(type==='balance_adjustment'){ tx.to=rule.to||rule.from; }
      else { if(e.debit) tx.from=rule.from; if(e.credit) tx.to=rule.to; }
      if(catTypeFor(type)) tx.category=rule.category||'기타';
      const card=getCard(tx.from);
      if(card && (type==='expense'||type==='prepaid_charge')){
        const inc = rule.cardPerformanceIncluded!==undefined ? !!rule.cardPerformanceIncluded : defaultCardIncluded(card,type,tx.category);
        tx.cardPerformanceIncluded=inc;
        tx.cardPerformanceAmount= inc ? (rule.cardPerformanceAmount!=null?Number(rule.cardPerformanceAmount):tx.amount) : 0;
        tx.cardPerformanceExcludedReason= inc ? '' : (rule.cardPerformanceExcludedReason||'');
      }
      return tx;
    }
    // 멱등: 같은 recurringId+scheduledDate 로그가 있으면 스킵. 생성 시 거래+로그 동시 기록.
    function postOccurrence(rule, occ){
      const sd=ymd(occ), logKey=rule.id+'_'+sd;
      if(recurringLogKeys.has(logKey)) return false;
      const txKey='rec_'+rule.id+'_'+sd;
      db.ref(wp('transactions/'+rule.ownerUid+'/'+txKey)).set(buildRecurringTx(rule, occ));
      db.ref(wp('recurringLogs/'+rule.ownerUid+'/'+logKey)).set({ recurringId:rule.id, scheduledDate:sd, generatedTransactionId:txKey, status:'created', createdAt:new Date().toISOString() });
      recurringLogKeys.add(logKey);
      return true;
    }
    // 정기 생성분(rec_{id}_{sd}) 삭제 시 대응 멱등 로그도 지운다 — 안 지우면 로그만 남아 다음 실행에서 영영 재생성 안 됨(조용한 영구삭제 방지). 지우면 다음 launch의 runRecurring에서 자연 재생성.
    function removeRecurringLog(ownerUid, txId){
      if(!txId || String(txId).indexOf('rec_')!==0) return;
      const logKey=String(txId).slice(4);   // rec_{ruleId}_{sd} → {ruleId}_{sd}
      recurringLogKeys.delete(logKey);
      db.ref(wp('recurringLogs/'+ownerUid+'/'+logKey)).remove().catch(function(){});
    }
    function runRecurring(){
      const today=parseDate(todayStr());
      state.recurring.filter(r=>r.ownerUid===state.uid).forEach(rule=>{
        if(ruleStatus(rule)!=='active' || rule.autoCreate===false) return;
        const endD=rule.endDate?parseDate(rule.endDate):null;
        const fromD = rule.lastPosted ? new Date(parseDate(rule.lastPosted).getTime()+86400000) : parseDate(rule.startDate||todayStr());
        let occs = occurrencesV2(rule, fromD, today);
        if(endD) occs=occs.filter(o=>o<=endD);
        if(occs.length>MAX_RECUR_PER_RUN) occs=occs.slice(0,MAX_RECUR_PER_RUN);
        let last=rule.lastPosted;
        occs.forEach(occ=>{ postOccurrence(rule, occ); last=ymd(occ); });
        const upd={};
        if(last && last!==rule.lastPosted) upd.lastPosted=last;
        const nr=nextRunOf(Object.assign({}, rule, { lastPosted: last||rule.lastPosted }));
        if(nr) upd.nextRunDate=ymd(nr); else { upd.nextRunDate=null; if(endD) upd.status='ended'; }
        if(Object.keys(upd).length) db.ref(wp('recurring/'+state.uid+'/'+rule.id)).update(upd);
      });
    }

    // ===== 💳 카드 대금 자동 기록 =====
    // 카드 설정에 결제일(billingDay)+대금 출금 계좌(billingAccountId)가 모두 있으면, 결제일에 "직전에 마감된 청구(이용) 기간" 사용액을
    // [출금 계좌 → 카드] 이체(transfer)로 자동 기록한다 — 출금 계좌 잔액이 줄고 카드 부채(음수 잔액)가 청산돼 실제 카드값 납부와 정합.
    // · transfer라 실소비 통계엔 원래 안 잡힌다(카드 사용 시 이미 지출로 집계 — isActualExpense:false도 명시).
    // · 회차 판정: 오늘 이하 가장 최근 결제일 1건만 — 여러 달 미접속 소급 생성 금지(지난 카드값은 수동 기록과 충돌 위험).
    // · 멱등 마커: creditCards/{id}.lastBilled(마지막 기록 회차 날짜) — 사용자가 생성분을 지워도 재생성하지 않는다
    //   (정기거래의 "삭제=재생성"과 다른 정책: 카드값은 수동 이체 기록으로 대체하는 경우가 흔해 되살리면 이중 기록).
    // · 시작 가드: billingAutoSince(설정 켠 날) 이전 회차는 건너뜀 — 설정 직후 지난 결제일이 소급 기록되는 것 방지.
    // 멤버별 중복 생성 방지 — 이 카드의 청구를 기록할 담당 1명 판정(계좌 ownerUid 본인 → 소유자 이름 일치 → 공동이면 멤버 uid 사전순 첫 번째)
    function cardBillOwner(a){
      if(a.ownerUid) return a.ownerUid===state.uid;
      if(a.owner && a.owner!=='공동') return a.owner===(state.userName||'');
      const ms=Object.keys((state.wsMeta&&state.wsMeta.members)||{}).sort();
      return ms.length? ms[0]===state.uid : true;
    }
    function runCardBills(){
      const today=parseDate(todayStr());
      state.creditCards.forEach(card=>{
        const day=Number(card.billingDay)||0, from=card.billingAccountId;
        const a=getAcct(card.id);
        if(!day || !from || !a || !getAcct(from) || !cardBillOwner(a)) return;
        const bill=(y,mo)=>new Date(y,mo,Math.min(day,new Date(y,mo+1,0).getDate()));   // 말일(28~31일)보다 큰 결제일은 그 달 말일로
        let b=bill(today.getFullYear(),today.getMonth());
        if(b>today) b=bill(today.getFullYear(),today.getMonth()-1);   // 이번 달 결제일이 아직 안 왔으면 지난 달 회차
        const bs=ymd(b);
        if(card.billingAutoSince && bs<card.billingAutoSince) return;
        if(card.lastBilled && bs<=card.lastBilled) return;
        const cur=cardUsagePeriod(card, b);   // 결제일이 속한(진행 중) 청구 기간
        const per=cardUsagePeriod(card, new Date(cur.start.getFullYear(),cur.start.getMonth(),cur.start.getDate()-1));   // 직전 마감 기간 = 이번 청구분
        const sum=state.transactions.reduce((s,t)=>{
          if(t.from!==card.id || !(t.type==='expense'||t.type==='prepaid_charge')) return s;
          const d=parseDate(t.date); return (d>=per.start&&d<=per.end)? s+(Number(t.amount)||0) : s;
        },0);
        const upd={}; upd['creditCards/'+card.id+'/lastBilled']=bs;   // 0원 회차도 소진해 다음 결제일로 넘어간다
        if(sum>0){
          const txKey='cardbill_'+card.id+'_'+bs;   // 고정 키 — 같은 회차 이중 생성 방지(멱등)
          upd['transactions/'+state.uid+'/'+txKey]={ type:'transfer', date:isoAtNoon(bs), amount:sum,
            user:state.userName||'', userUid:state.uid, from:from, to:card.id, desc:(card.cardName||acctName(card.id))+' 카드대금',
            isActualExpense:false, cardBillKey:txKey, billPeriodEnd:ymd(per.end),
            memo:'청구 기간 '+ymd(per.start)+' ~ '+ymd(per.end)+' 자동 기록' };
        }
        db.ref(wsRoot()).update(upd).then(()=>{ if(sum>0) toast('💳 '+(card.cardName||acctName(card.id))+' 카드대금 '+won(sum)+' 자동 기록'); })
          .catch(e=>console.warn('카드대금 자동 기록 실패', e));
      });
    }

    // ===== 파생 계산 =====
    // 🚀 계좌별 잔액 델타 맵을 전체 거래 1회 순회로 계산해 캐시(state._balCache) — accountBalance가 계좌마다 전체 거래를 재순회하던 O(계좌수×거래수)를 O(거래수)로.
    //   무효화: 거래 리스너(attach transactions)·워크스페이스 전환에서 _balCache=null. 날짜(오늘)가 바뀌면 예정거래 경계가 달라지므로 _balCacheDay로 자동 재빌드.
    //   결과는 기존 accountBalance와 완전 동일(같은 TX_EFFECT·미래 제외 규칙을 맵으로 옮긴 것).
    function rebuildBalCache(){
      const m={}, today=todayStr();
      state.transactions.forEach(t=>{
        if((t.date||'').slice(0,10) > today) return;   // 예정(미래) 거래 제외 — 기존 규칙 그대로
        const e=TX_EFFECT[t.type]; if(!e) return;
        const amt=Number(t.amount)||0;
        if(e.debit && t[e.debit]) m[t[e.debit]]=(m[t[e.debit]]||0)-amt;
        if(e.credit && t[e.credit]) m[t[e.credit]]=(m[t[e.credit]]||0)+amt;
      });
      state._balCache=m; state._balCacheDay=today;
    }
    function accountBalance(id){
      if(!state._balCache || state._balCacheDay!==todayStr()) rebuildBalCache();
      const a=getAcct(id);
      return (a?Number(a.initialBalance||0):0) + (state._balCache[id]||0);
    }
    // 📅 예정(미래 날짜) 거래 목록 — 오늘 이후 날짜, 최근(가까운) 순.
    function scheduledTxs(){ const today=todayStr(); return state.transactions.filter(function(t){ return (t.date||'').slice(0,10) > today; }).sort(function(a,b){ return (a.date||'')<(b.date||'')?-1:1; }); }
    function totalAssets(){ return visibleAccounts().reduce((s,a)=>s+accountBalance(a.id),0); }
    function monthTx(m){ return state.transactions.filter(t=>(t.date||'').startsWith(m)); }
    function sumBy(list,type){ return list.filter(t=>t.type===type).reduce((s,t)=>s+(Number(t.amount)||0),0); }

    // 실제 소비 / 선불·포인트 / 권한
    // 📊 isActual·actualSpend 는 ledger-calc.js 로 이전(순수·테스트 대상) — 소비성 유형(expense·prepaid_spend·point_spend)만 실소비.
    //    (예전 이곳 구현이 타입을 안 보고 isActualExpense 플래그만 봐서, buildTx 가 true 로 저장하는 '수입'까지 총지출·예산에 섞이던 버그 — 재정의 금지.)

    // ===== 정산 계산 (Step 9) — 순수 함수 settlementSplit·greedySettle 은 public/js/ledger-calc.js 로 추출됨(테스트 대상, 전역으로 노출돼 아래에서 그대로 호출). =====
    // 목적별 가계부 정산 요약. settlementIncluded 거래 + 기록된 송금(paid)을 반영.
    // 상태 기준: neededAmount=정산에 필요한 총 송금액(=greedy 제안 합), settledAmount=완료(paid)된 송금 합.
    //   needed==0 → none / settled>=needed → settled / 0<settled<needed → partially_settled / settled==0 → unsettled
    function pbSettleSummary(p){
      const txs=state.transactions.filter(t=>t.purposeBookId===p.id && t.settlementIncluded===true);
      const paid={}, owed={}, names=new Set((p.participants||[]));
      txs.forEach(t=>{
        const s=settlementSplit(t);
        if(s.payer){ paid[s.payer]=(paid[s.payer]||0)+Math.abs(Number(t.amount)||0); names.add(s.payer); }
        s.participants.forEach(nm=>{ owed[nm]=(owed[nm]||0)+(Number(s.amounts[nm])||0); names.add(nm); });
      });
      // 순수 잔액(송금 반영 전): paid - owed
      const baseBalance={}; names.forEach(n=>{ baseBalance[n]=(paid[n]||0)-(owed[n]||0); });
      const neededTransfers=greedySettle(baseBalance);
      const neededAmount=neededTransfers.reduce((s,x)=>s+x.amount,0);
      // 완료된 송금 반영 → 남은 잔액
      const payments=state.settlementPayments.filter(x=>x.purposeBookId===p.id && x.status==='paid');
      const settledAmount=payments.reduce((s,x)=>s+(Number(x.amount)||0),0);
      const balance=Object.assign({}, baseBalance);
      payments.forEach(x=>{ balance[x.fromPerson]=(balance[x.fromPerson]||0)+(Number(x.amount)||0); balance[x.toPerson]=(balance[x.toPerson]||0)-(Number(x.amount)||0); });
      const suggestions=greedySettle(balance);
      const perPerson=Array.from(names).map(n=>({ name:n, paid:Math.round(paid[n]||0), owed:Math.round(owed[n]||0), balance:Math.round(baseBalance[n]||0) }))
        .sort((a,b)=>b.balance-a.balance);
      const totalSpend=txs.reduce((s,t)=>s+Math.abs(Number(t.amount)||0),0);
      const unsettledAmount=Math.max(0, neededAmount-settledAmount);
      const status = neededAmount<=0 ? 'none' : (settledAmount>=neededAmount ? 'settled' : (settledAmount>0 ? 'partially_settled' : 'unsettled'));
      const settledPct = neededAmount>0 ? Math.min(100, Math.round(settledAmount/neededAmount*100)) : 0;
      return { perPerson, suggestions, payments, totalSpend, txCount:txs.length, neededAmount, settledAmount, unsettledAmount, settledPct, status, txs };
    }
    // ===== 대출/이자 계산 — 순수 함수 =====
    function loanPaymentsOf(loan){ return state.loanPayments.filter(p=>p.loanId===loan.id); }
    // 잔액 = 원금 - 상환한 원금 합 / 이자합 / 상환원금합
    function loanCalc(loan){
      const ps=loanPaymentsOf(loan);
      const paidPrincipal=ps.reduce((s,p)=>s+(Number(p.principalAmount)||0),0);
      const paidInterest=ps.reduce((s,p)=>s+(Number(p.interestAmount)||0),0);
      const principal=Number(loan.principal)||0;
      const balance=Math.max(0, principal-paidPrincipal);
      // 월 예상 이자(단리, 참고용): 잔액 * 연이율% / 12
      const monthlyInterest=Math.round(balance*((Number(loan.interestRate)||0)/100)/12);
      const status = loan.status==='overdue' ? 'overdue' : (balance<=0 ? 'paid' : 'active');
      return { principal, paidPrincipal, paidInterest, balance, monthlyInterest, status, payments:ps, totalPaid:paidPrincipal+paidInterest };
    }
    function visibleLoans(){ return state.loans.filter(canSee); }
    function loanSummary(){
      let borrowedBal=0, lentBal=0, interest=0;
      visibleLoans().forEach(l=>{ const c=loanCalc(l); interest+=c.paidInterest; if(l.direction==='lent') lentBal+=c.balance; else borrowedBal+=c.balance; });
      return { borrowedBal, lentBal, interest, count:visibleLoans().length };
    }

    function prepaidAccounts(){ return state.accounts.filter(a=>PREPAID_TYPES.includes(a.type)); }
    function prepaidTotal(){ return prepaidAccounts().filter(canSee).reduce((s,a)=>s+accountBalance(a.id),0); }
    // owner는 멤버 uid·'공동'·(레거시)이름이 섞일 수 있어 셋 다 처리 — uid면 ownerName으로 내 이름과 비교(내 비공개 항목이 안 숨겨지게)
    function canSee(item){ if((item.visibility||'full')!=='private') return true; const o=item.owner;
      return o==='공동' || o===state.uid || item.ownerUid===state.uid || (!item.ownerUid && ownerName(o)===state.userName); }   // uid 우선(동명이인 오노출 방지) — ownerUid 있으면 이름 폴백 안 함
    function visibleAccounts(){ return state.accounts.filter(canSee); }
    function acctGroup(a){ if(CARD_TYPES.includes(a.type)) return 'card'; if(PREPAID_TYPES.includes(a.type)) return 'prepaid'; if(a.type==='other') return 'other'; return 'cash'; }

    // 카드 실적
    function defaultCardIncluded(card, type, category){
      if(!card) return false;
      if(type==='prepaid_charge') return !!card.includePrepaidCharge;
      if(category && (card.excludedCategories||[]).includes(category)) return false;
      return card.defaultIncluded!==false;
    }
    // 기간 계산은 순수 함수 periodFromRule/monthPhaseRef(ledger-calc.js, Node 테스트 대상)를 래핑한다.
    // 카드의 기간 규칙(kind='perf' 실적 | 'usage' 이용) — usage인데 '실적 기간과 동일'이면 실적 규칙으로 폴백
    function cardPeriodRule(card, kind){
      if(kind==='usage' && card && card.usageSameAsPerf===false) return { type:card.usagePeriodType, S:card.usageStartDay };
      return { type:card&&card.performancePeriodType, S:card&&card.performanceStartDay };
    }
    // 실적 기간(카드 혜택 실적 산정 범위)
    function cardPeriod(card, ref){ return periodFromRule(card.performancePeriodType, card.performanceStartDay, ref); }
    // 💳 이용(청구) 기간 — 결제일에 청구되는 거래(거래일) 범위. usageSameAsPerf(기본 true·미설정 포함)면 실적 기간과 동일.
    function cardUsagePeriod(card, ref){
      const r=cardPeriodRule(card, 'usage'); return periodFromRule(r.type, r.S, ref);
    }
    // 📅 m('YYYY-MM')월의 카드 기간 기준일 — ‹ › 월 이동=정확히 한 기간 이동(건너뜀/중복 없음, monthPhaseRef 참고)
    function cardMonthRef(card, m, kind){
      const r=cardPeriodRule(card, kind); return monthPhaseRef(r.type, r.S, m);
    }
    // ref = 실적 기간 기준일(없으면 오늘). 리포트에서 지난달 실적을 보려고 그 달의 기준일을 넘긴다.
    function cardPerformance(card, ref){
      const acctId=card.id; const p=cardPeriod(card, ref);
      let sum=0; const excluded=[];
      state.transactions.forEach(t=>{
        if(t.from!==acctId) return;
        if(!(t.type==='expense'||t.type==='prepaid_charge')) return;
        const d=parseDate(t.date); if(d<p.start||d>p.end) return;
        const inc = t.cardPerformanceIncluded!==undefined ? !!t.cardPerformanceIncluded : defaultCardIncluded(card,t.type,t.category);
        if(inc) sum += (t.cardPerformanceAmount!=null ? Number(t.cardPerformanceAmount) : (Number(t.amount)||0));
        else excluded.push(t);
      });
      const target=Number(card.monthlyPerformanceTarget)||0;
      return { sum, target, pct: target?Math.round(sum/target*100):0, remain:Math.max(0,target-sum), start:p.start, end:p.end, excluded };
    }

    // ===== 예산 =====
    function visibleBudgets(){ return state.budgets.filter(canSee); }
    function budgetPeriod(b, ref){
      ref = ref || new Date();
      if(b.periodType==='custom'){ return { start:parseDate(b.startDate||todayStr()), end:parseDate(b.endDate||b.startDate||todayStr()) }; }
      if(b.periodType==='weekly'){ const d=new Date(ref); d.setHours(0,0,0,0); d.setDate(d.getDate()-d.getDay()); const e=new Date(d); e.setDate(d.getDate()+6); return {start:d,end:e}; }
      if(b.periodType==='yearly'){ return { start:new Date(ref.getFullYear(),0,1), end:new Date(ref.getFullYear(),11,31) }; }
      return { start:new Date(ref.getFullYear(),ref.getMonth(),1), end:new Date(ref.getFullYear(),ref.getMonth()+1,0) };
    }
    // 직전 기간 기준일(이월 계산용). custom은 이월 없음.
    function budgetPrevRef(b, ref){ ref=ref||new Date(); const d=new Date(ref);
      if(b.periodType==='custom') return null;
      if(b.periodType==='weekly'){ d.setDate(d.getDate()-7); return d; }
      if(b.periodType==='yearly'){ return new Date(d.getFullYear()-1, 6, 1); }
      return new Date(d.getFullYear(), d.getMonth()-1, 15);   // 월간: 전 달 중순
    }
    // 예산 이월(rollover): 직전 기간의 남은 양(base-used, 양수만)을 이번 기간 예산에 가산(1기간 캐리 — 무한 누적 아님).
    function budgetCarry(b, ref){ if(!b || !b.rollover) return 0; const pr=budgetPrevRef(b, ref); if(!pr) return 0;
      // 이월을 켠 시점(rolloverSince) 이전 기간은 이월하지 않음 — 갓 만든/갓 켠 예산이 지난 기간을 공짜로 최대 2×이월하던 버그 방지.
      if(b.rolloverSince){ const pp=budgetPeriod(b, pr); if(pp.end < parseDate(b.rolloverSince)) return 0; }
      const base=Number(b.amount)||0; const prevUsed=budgetTxs(b, pr).reduce(function(s,t){ return s+(Number(t.amount)||0); },0);
      return Math.max(0, base-prevUsed);
    }
    // 개인예산 소유자 ↔ 거래 소비대상 매칭(단일 소스) — 집계(budgetTxs)·사전경고(budgetPreWarn)가 같은 기준을 쓰게.
    //  uid 우선(개명·동명이인 견고), 없으면 이름. 공동 지출(userUid 없음)은 개인예산에 안 잡혀 허위 경보/집계 혼선 방지. 공동/카테고리 예산·소유자 미지정은 항상 매칭.
    function budgetOwnerMatch(b, tx){
      if(!b || b.scope!=='personal' || !b.owner || b.owner==='공동') return true;
      if(b.ownerUid && tx && tx.userUid) return b.ownerUid===tx.userUid;
      return ownerName(tx&&tx.user)===ownerName(b.owner);
    }
    function budgetTxs(b, ref){
      const p=budgetPeriod(b, ref);   // ref=기준일(리포트에서 보는 달) — 없으면 오늘
      return state.transactions.filter(t=>{
        if(!isActual(t)) return false;                              // 실제소비만 (충전·이체·조정·환불·대출상환 제외)
        if((t.date||'').slice(0,10) > todayStr()) return false;     // 예정(미래일) 거래는 아직 안 쓴 돈 — 잔액과 동일하게 예산 사용/경고에서 제외
        if(b.categoryName && t.category!==b.categoryName) return false;
        if(!budgetOwnerMatch(b, t)) return false;   // 개인예산=소유자 소비만(uid 우선·공동 제외) — 사전경고와 동일 기준
        const d=parseDate(t.date); return !(d<p.start||d>p.end);
      });
    }
    function budgetUsage(b, ref){
      const p=budgetPeriod(b, ref);
      const used=budgetTxs(b, ref).reduce((s,t)=>s+(Number(t.amount)||0),0);
      const base=Number(b.amount)||0, carry=budgetCarry(b, ref), amt=base+carry;   // 이월(rollover) 반영: 유효예산=기본+전기간 남은분
      return { used, amount:amt, base:base, carry:carry, pct: amt?Math.round(used/amt*100):0, remain:amt-used, start:p.start, end:p.end };
    }
    function totalMonthlyBudget(){ return visibleBudgets().find(b=>!b.categoryName && b.periodType==='monthly') || null; }

    // ===== 구독 =====
    function visibleSubs(){ return state.subscriptions.filter(canSee); }
    function subActive(s){ return (s.status||'active')==='active'; }
    function daysUntil(ds){ if(!ds) return null; return Math.round((parseDate(ds)-parseDate(todayStr()))/86400000); }
    function monthlyEquiv(s){ const a=Number(s.amount)||0, iv=Math.max(1,Number(s.billingInterval)||1);
      if(s.billingCycle==='monthly') return a/iv;
      if(s.billingCycle==='yearly') return a/(12*iv);
      if(s.billingCycle==='weekly') return a*4.345/iv;
      return null; // custom: 환산 불가
    }
    function yearlyEquiv(s){ const m=monthlyEquiv(s); return m==null?null:m*12; }
    function subBadges(s){
      const out=[]; const st=s.status||'active';
      if(st==='cancelled'){ out.push(['취소','#8b95a1']); return out; }
      if(st==='expired'){ out.push(['만료','#8b95a1']); return out; }
      if(st==='paused'){ out.push(['일시정지','#f5a623']); return out; }
      const nb=daysUntil(effNextBilling(s.nextBillingDate, s.billingCycle, s.billingInterval)); if(nb!=null&&nb>=0&&nb<=7) out.push(['결제 D-'+nb,'#3182f6']);   // 저장값이 과거면 주기만큼 굴려 다음 결제일 기준(첫 주기 뒤 알림 정지 버그 수정)
      const ex=daysUntil(s.expirationDate); if(ex!=null&&ex>=0&&ex<=7) out.push(['만료 D-'+ex,'#f04452']);
      if(s.isTrial){ const tr=daysUntil(s.trialEndDate); if(tr!=null&&tr>=0&&tr<=7) out.push(['체험종료 D-'+tr,'#f76707']); }
      if(s.expirationDate && s.autoRenew===false && daysUntil(s.expirationDate)<0) out.push(['만료 추정','#8b95a1']);
      return out;
    }

    // ===== 렌더 라우팅 =====
    function go(tab){
      state.view='mode'; try{ localStorage.setItem('view','mode'); }catch(e){}   // 탭 이동 = 모드 화면
      state.tab=tab;
      document.querySelectorAll('.tabbar .tab').forEach(b=>b.classList.toggle('on', b.dataset.tab===tab));
      rerender();
      const c=$('content'); if(c) c.scrollTop=0;   // 탭 전환 시 내용 스크롤 맨 위로
    }
    // 랜딩 '오늘 홈'으로 (상단 로고=홈 버튼). 바텀 탭 아님.
    // 토글: 이미 홈이면 한 번 더 누르면 직전 모드 화면으로 닫힘.
    function goHome(){
      if(state.view==='home'){ go(state.tab || (state.mode==='todo'?'todo':'calendar')); return; }
      state.view='home'; try{ localStorage.setItem('view','home'); }catch(e){}
      rerender(); const c=$('content'); if(c) c.scrollTop=0; }
    // 홈 카드 딥링크: 모드 세팅 + 해당 탭으로 진입.
    function goto(mode, tab){
      if(mode){ state.mode=(mode==='todo'?'todo':'ledger'); try{ localStorage.setItem('mode',state.mode); }catch(e){} renderTabBar(); updateModeToggle(); }
      go(tab || (state.mode==='todo'?'todo':'calendar'));
    }
    // 오늘 미처리 배지 — 순회 부담을 줄임. rerender/renderTabBar에서 호출(자동 갱신).
    //  · 할일 탭 점: 오늘/지난 미완료 할일(todos>0)이 있을 때(할일 모드에서만 그 탭이 존재).
    //  · (변경) 상단 로고의 미처리 초록 점은 제거 — 브랜드 아이콘 알림은 소식 빨간 점 하나(updateNewsBadge)로 통합(사용자 지침). applyHomeBadge(util)는 미연결 레거시로 남김(jsdom 테스트 유지).
    function updateHomeBadge(){
      var pend = (typeof todayPendingNow==='function') ? todayPendingNow() : { total:0, todos:0 };
      if(typeof applyTodoTabDot==='function') applyTodoTabDot(document, pend.todos);              // 할일 탭 점(util, jsdom 테스트됨)
    }
    let _rerenderRAF=0, _rrReasons=null;
    // 코얼레싱 + ⚡스코핑: reason 태그('ledger'|'todo'|'social'|'game')로 '현재 탭과 무관한 원격 변경'이면 무거운 콘텐츠 재빌드를 건너뛴다(뱃지·열린 시트는 항상 갱신).
    //  reason 없이 부르면(기존 39개 호출 대부분·일회성 액션) '*'로 취급해 항상 렌더 → 하위호환(태그 단 리스너만 스킵 대상). 한 프레임에 여러 이유가 모이면 OR 판정(관련 이유 하나라도 있으면 렌더).
    function rerender(reason){
      if(!_rrReasons) _rrReasons={}; _rrReasons[reason||'*']=true;
      if(_rerenderRAF) return; _rerenderRAF=requestAnimationFrame(()=>{ _rerenderRAF=0; const rs=_rrReasons; _rrReasons=null; _rerenderNow(rs); });
    }
    function _rrNeedsContent(rs){
      if(!rs || rs['*']) return true;                       // 태그 없는 호출 → 항상 렌더(하위호환)
      if(state.view==='home') return true;                  // 홈은 게임·소셜·집계 다 반영(콘텐츠 가벼움)
      const t=state.tab;
      if(t==='more') return true;                           // 더보기=선물함·소식 등 뱃지/집계 → 항상
      if(t==='calendar'||t==='stats'||t==='assets') return !!rs['ledger'];             // 가계부 콘텐츠는 ledger 변경만 영향
      if(t==='todo'||t==='todocal'||t==='tododone') return !!(rs['todo']||rs['social']); // 할일=내 할일(todo)+공유 친구 할일(social)
      return true;                                          // 미분류 탭 → 안전하게 렌더
    }
    function _rerenderNow(rs){
      document.body.classList.toggle('home-view', state.view==='home');   // 홈에선 바텀 탭바 숨김(CSS)
      updateHomeBadge();
      if(!_rrNeedsContent(rs)){   // 🔋 현재 탭과 무관한 변경 → 콘텐츠 재빌드 스킵(뱃지는 위에서, 시트는 아래에서 갱신)
        const shx=$('sheet'); if(shx && shx.classList.contains('on') && typeof state._sheetRefresh==='function') state._sheetRefresh();
        return;
      }
      if(state.view==='home'){
        if(typeof renderHome==='function') renderHome();
        const sh0=$('sheet'); if(sh0 && sh0.classList.contains('on') && typeof state._sheetRefresh==='function') state._sheetRefresh();
        return;
      }
      if(state.tab==='calendar') renderCalendar();
      else if(state.tab==='stats') renderStats();
      else if(state.tab==='assets') renderAssets();
      else if(state.tab==='more') renderMore();
      else if(state.tab==='todo') renderTodoList();
      else if(state.tab==='todocal') renderTodoCalendar();
      else if(state.tab==='tododone') renderTodoDone();
      // 열린 시트가 실시간 갱신 훅을 등록했으면 본문만 다시 그림
      const sh=$('sheet');
      if(sh && sh.classList.contains('on') && typeof state._sheetRefresh==='function') state._sheetRefresh();
    }
    // ===== 모드(가계부/할일) 토글 + 모드별 하단 탭바 =====
    const _TABICON={
      calendar:'<rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>',
      stats:'<path d="M5 20V11M12 20V5M19 20v-6"/>',
      assets:'<rect x="3" y="5.5" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="16.5" cy="14" r="1.3" fill="currentColor" stroke="none"/>',
      more:'<path d="M4 7h16M4 12h16M4 17h16"/>',
      todo:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 5.4l1.3 1.3 2-2.3M4 11.4l1.3 1.3 2-2.3M4 17.4l1.3 1.3 2-2.3"/>',
      todocal:'<rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/>',
      tododone:'<circle cx="12" cy="12" r="9"/><path d="M8 12.4l2.7 2.7L16.5 9"/>'
    };
    const _TABSETS={ ledger:[['assets','자산'],['calendar','캘린더'],'fab',['stats','리포트'],['more','더보기']],
                     todo:[['todo','할일'],['todocal','캘린더'],'fab',['tododone','완료'],['more','더보기']] };
    function fabAdd(){ if(state.mode==='todo'){ if(typeof openTodoEdit==='function') openTodoEdit(); else toast('할일 추가는 곧 제공됩니다'); } else openTxSheet(); }
    function renderTabBar(){ const nav=document.querySelector('.tabbar'); if(!nav) return;
      const set=_TABSETS[state.mode==='todo'?'todo':'ledger'];
      nav.innerHTML=set.map(function(it){ return it==='fab'
        ? '<div class="fab-slot"><button class="fab" onclick="fabAdd()" aria-label="추가"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button></div>'
        : '<button class="tab'+(state.tab===it[0]?' on':'')+'" data-tab="'+it[0]+'" onclick="go(\''+it[0]+'\')"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+(_TABICON[it[0]]||'')+'</svg>'+it[1]+'</button>'; }).join('');
      updateHomeBadge();   // 탭바 재생성 시 할일 탭 점 다시 반영
    }
    function updateModeToggle(){ const seg=$('modeSeg'); if(seg) Array.prototype.forEach.call(seg.children,function(b){ const on=b.dataset.mode===state.mode; b.classList.toggle('on', on); b.setAttribute('aria-selected', on?'true':'false'); }); }   // role=tab 선택상태 ARIA 반영(스크린리더)
    function applyMode(){ renderTabBar(); updateModeToggle();
      if(state.view==='home') goHome();                          // 부팅/전환 시 홈 유지
      else { const set=_TABSETS[state.mode==='todo'?'todo':'ledger']; const ok=set.some(function(it){ return it!=='fab' && it[0]===state.tab; });
        go(ok?state.tab:(state.mode==='todo'?'todo':'calendar')); } }   // 현재 탭이 이 모드에 있으면 유지(컨텍스트 전환 시 자리 보존), 없으면 모드 기본
    function setMode(m){ m=(m==='todo')?'todo':'ledger';
      // 토글 시 같은 메뉴 위치 유지: 현재 탭의 인덱스를 반대 모드 탭바의 같은 자리로 매핑(더보기↔더보기 등)
      const prevSet=_TABSETS[state.mode==='todo'?'todo':'ledger'];
      const idx=prevSet.findIndex(function(it){ return it!=='fab' && it[0]===state.tab; });
      const nextSet=_TABSETS[m], cell=(idx>=0 && nextSet[idx] && nextSet[idx]!=='fab') ? nextSet[idx] : null;
      const target=cell?cell[0]:(m==='todo'?'todo':'calendar');   // 같은 위치 탭(없으면 모드 기본)
      state.mode=m; try{ localStorage.setItem('mode',m); }catch(e){}
      state.view='mode'; try{ localStorage.setItem('view','mode'); }catch(e){}   // 모드 토글 = 모드 화면 진입
      state.tab=target;
      // 이 모드의 '최근 컨텍스트'가 현재와 다르면 그 그룹/개인프로필로 전환(가계부·할일 각자 마지막 사용처 유지 — 매번 그룹전환 안 해도 됨)
      const want=state.recentWs && state.recentWs[m];
      if(want && want!==state.wsId && (state.memberships||[]).some(function(w){ return w.id===want; })){
        renderTabBar(); updateModeToggle();   // 토글 피드백 즉시(컨텍스트 로딩은 뒤이어)
        switchWorkspace(want);                // 내부 applyMode()가 state.tab(=target) 유지하며 렌더
      } else {
        renderTabBar(); updateModeToggle(); go(target);
      }
    }
