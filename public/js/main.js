// ===== PWA 설치 =====
    // 이미 홈화면 앱으로 실행 중인가(설치됨)
    function isStandalone(){ try{ return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true; }catch(e){ return false; } }
    // iOS(사파리는 beforeinstallprompt 미지원 → 수동 '홈 화면에 추가' 안내 필요). iPadOS도 감지.
    function isIOS(){ const ua=navigator.userAgent||''; return /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && (navigator.maxTouchPoints||0)>1); }
    // 설치 안내를 노출할지: 아직 설치 안 됐으면(스탠드얼론 아님) 노출 — Chrome=네이티브 프롬프트, iOS/그외=수동 안내
    function canInstallApp(){ return !isStandalone(); }
    // 크롬 계열: 설치 프롬프트를 잡아둔다(사용자 탭 시 실행)
    window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredPrompt=e; if(state.tab==='more') renderMore(); });
    // 설치 완료 → 프롬프트 정리 + 안내 숨김 + 알림
    window.addEventListener('appinstalled', ()=>{ deferredPrompt=null; try{ toast('앱이 설치됐어요 🎉'); }catch(e){} if(state.tab==='more') renderMore(); });
    // 설치 실행: 네이티브 프롬프트가 있으면 바로, 없으면(iOS/사파리 등) 수동 안내 시트
    function installApp(){
      if(deferredPrompt){ const p=deferredPrompt; deferredPrompt=null; p.prompt(); p.userChoice.finally(()=>{ if(state.tab==='more') renderMore(); }); return; }
      openInstallGuide();
    }
    if('serviceWorker' in navigator){
      // 새 서비스워커가 제어를 넘겨받으면(sw.js의 skipWaiting+clients.claim) 한 번 자동 새로고침 →
      // 최신 코드/에셋을 즉시 반영(구 cats.js가 옮겨진 assets 경로를 404로 물어 고양이가 안 보이던 문제 방지).
      // 최초 설치(이전 controller 없음)에선 새로고침하지 않음(불필요한 리로드 방지).
      const _hadController = !!navigator.serviceWorker.controller;
      let _swRefreshing=false, _swReloadPending=false;
      function _swApplyReload(){ if(_swRefreshing) return; _swRefreshing=true; location.reload(); }
      navigator.serviceWorker.addEventListener('controllerchange', ()=>{
        if(_swRefreshing || !_hadController) return;
        // ✍️ 시트(작성 중일 수 있음)가 열려 있으면 즉시 리로드하지 않고 보류 — 입력 유실 방지. 시트 닫힘/탭 복귀 때 적용.
        if(document.body && document.body.classList.contains('sheet-open')){
          _swReloadPending=true;
          try{ if(typeof toast==='function') toast('새 버전이 준비됐어요 — 창을 닫으면 적용돼요'); }catch(e){}
          return;
        }
        _swApplyReload();
      });
      // 보류된 리로드: 시트가 닫히는 순간(body.sheet-open 제거) 적용
      if(window.MutationObserver){ new MutationObserver(()=>{ if(_swReloadPending && !document.body.classList.contains('sheet-open')) _swApplyReload(); }).observe(document.body, {attributes:true, attributeFilter:['class']}); }
      // 🔄 갱신 감지 강화 — register 1회만으론 설치형 PWA/오래 켜둔 탭이 브라우저 자동 체크(스로틀)만 기다리다 옛 버전에 갇힘.
      //   ① 등록 직후(register 자체가 1회 체크) ② 탭 복귀(visible, 5분 스로틀) ③ 60분 주기로 registration.update() 명시 호출.
      let _swReg=null, _swLastCheck=0;
      function _swCheck(force){ const now=Date.now(); if(!_swReg || (!force && now-_swLastCheck<5*60000)) return Promise.resolve();
        _swLastCheck=now; return _swReg.update().catch(()=>{}); }
      window.addEventListener('load', ()=>navigator.serviceWorker.register('sw.js').then(reg=>{ _swReg=reg; _swLastCheck=Date.now(); }).catch(()=>{}));
      document.addEventListener('visibilitychange', ()=>{ if(document.hidden) return;
        if(_swReloadPending && !(document.body && document.body.classList.contains('sheet-open'))){ _swApplyReload(); return; }
        _swCheck(); });
      setInterval(_swCheck, 60*60000);
      // 🧯 수동 탈출구(설정 → 앱 업데이트 확인) — 자동 경로가 어긋났을 때 브라우저 캐시 삭제 대신 이 버튼으로 갱신.
      window.checkAppUpdate=function(){
        if(!_swReg){ try{ if(typeof toast==='function') toast('이 환경에선 업데이트 확인을 지원하지 않아요', true); }catch(e){} return; }
        try{ if(typeof toast==='function') toast('업데이트 확인 중…'); }catch(e){}
        _swCheck(true).then(()=>{ setTimeout(()=>{ try{ if(typeof toast!=='function') return;
          if(_swReg.installing || _swReg.waiting) toast('새 버전 설치 중 — 곧 자동으로 적용돼요');
          else toast('지금이 최신 버전이에요 ✅');
        }catch(e){} }, 1200); });
      };
    }

    // ===== 접근성(A11y) 레이어 =====
    // innerHTML 으로 매번 새로 그려지므로, 템플릿을 일일이 고치지 않고 한 곳에서 ARIA/키보드 접근성을 입힌다.
    function a11yDecorate(root){
      if(!root || !root.querySelectorAll) return;
      // 1) 커스텀 토글 스위치: role=switch + 키보드 포커스 + 상태
      root.querySelectorAll('.switch').forEach(el=>{
        if(!el.hasAttribute('role')){ el.setAttribute('role','switch'); el.setAttribute('tabindex','0'); }
        el.setAttribute('aria-checked', el.classList.contains('on')?'true':'false');
      });
      // 1b) 선택형 칩·세그(단일선택 토글): aria-pressed로 선택상태 노출 — 'on' 클래스만으론 스크린리더가 선택을 못 읽는다. 재렌더마다 갱신(1회성 아님).
      root.querySelectorAll('.chip, .mchip, .subseg > button, .type-seg > button, .modeseg > button, .seg > button, .placemode > button, .placecat > button, .dextabs > button').forEach(function(el){
        if(el.getAttribute('role')==='tab') return;   // role=tab은 aria-selected 사용(중복 방지)
        el.setAttribute('aria-pressed', el.classList.contains('on')?'true':'false');
      });
      // 2) onclick·data-action 이 달린 비(非)버튼 요소(div/span 등): role=button + 포커스 가능. 🔋 이미 처리한 노드는 data-ab로 스킵 — 작은 DOM 삽입(FX·뱃지)마다 옵저버가 컨테이너 전체를 재스캔하던 비용 제거(1회성 데코라 재처리 불필요). (data-action=이벤트 위임(delegate.js)으로 옮긴 요소도 동일 처리)
      root.querySelectorAll('[onclick]:not([data-ab]),[data-action]:not([data-ab])').forEach(el=>{
        el.setAttribute('data-ab','');
        if(el.id==='overlay' || el.classList.contains('switch')) return;
        const tag=el.tagName;
        if(tag==='BUTTON'||tag==='A'||tag==='INPUT'||tag==='SELECT'||tag==='TEXTAREA'||tag==='LABEL') return;
        if(!el.hasAttribute('role')) el.setAttribute('role','button');
        if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0');
      });
      // 3) 라벨↔입력 연결(.field 안의 label 과 첫 입력) — data-af로 1회만
      root.querySelectorAll('.field:not([data-af])').forEach(f=>{
        f.setAttribute('data-af','');
        const lab=f.querySelector('label'), inp=f.querySelector('input,select,textarea');
        if(lab && inp && !lab.htmlFor && inp.id) lab.htmlFor=inp.id;
      });
      // 3b) .txfield(거래/정기 입력)은 <label> 대신 span.k 유사라벨 → 입력에 aria-label 복사(스크린리더 대응) — data-at로 1회만
      root.querySelectorAll('.txfield:not([data-at])').forEach(f=>{
        f.setAttribute('data-at','');
        const k=f.querySelector('.k'), inp=f.querySelector('input,select,textarea');
        if(k && inp && !inp.getAttribute('aria-label')){ const t=(k.textContent||'').trim(); if(t) inp.setAttribute('aria-label', t); }
      });
    }
    // 탭바 현재 위치 표시
    function syncTabCurrent(){ document.querySelectorAll('.tabbar .tab').forEach(t=>{ if(t.classList.contains('on')) t.setAttribute('aria-current','page'); else t.removeAttribute('aria-current'); }); }
    // 인라인 onclick 이후(버블 단계) 토글/탭 상태를 ARIA에 반영
    document.addEventListener('click', e=>{
      const sw=e.target.closest && e.target.closest('.switch');
      if(sw) sw.setAttribute('aria-checked', sw.classList.contains('on')?'true':'false');
      if(e.target.closest && e.target.closest('.tabbar .tab')) setTimeout(syncTabCurrent, 0);
    });
    // 키보드: Esc 로 시트 닫기 / Enter·Space 로 role=button·switch 활성화 / Tab 포커스 트랩
    document.addEventListener('keydown', e=>{
      const sh=document.getElementById('sheet'), sheetOpen=sh && sh.classList.contains('on');
      if(e.key==='Escape' && sheetOpen){ closeSheet(); return; }
      if(e.key==='Tab' && sheetOpen){ trapFocus(e, sh); return; }
      if(e.key==='Enter' || e.key===' ' || e.key==='Spacebar'){
        const t=document.activeElement; if(!t || !t.getAttribute) return;
        const role=t.getAttribute('role');
        if((role==='button'||role==='switch') && t.tagName!=='BUTTON'){ e.preventDefault(); t.click(); }
      }
    });
    // ===== 🖱️ 데스크톱(웹) 가로 스크롤 보조 — 카테고리 칩 줄이 '슬라이드'가 안 되던 문제 =====
    //  모바일은 네이티브 스와이프로 잘 밀리지만, 마우스 환경엔 가로 스크롤 수단이 없어 칩 줄이 잘린 채 고정돼 보였다.
    //   ① 세로 휠 → 가로 스크롤 매핑(트랙패드 가로 제스처는 네이티브로 통과, 끝에 닿으면 페이지 스크롤로 넘김)
    //   ② 마우스 드래그로 밀기(1:1) — 5px 이상 끌면 직후 click 1회를 캡처 단계에서 삼켜 칩이 잘못 눌리지 않게
    //  터치(pointerType==='touch')는 손대지 않는다.
    const HSCROLL_SEL='.chips, .chip-row, .subseg, .mrow, .rmstrip, .tdfr-scroll';
    function hscrollBox(t){ const el=(t&&t.closest)?t.closest(HSCROLL_SEL):null; return (el && el.scrollWidth>el.clientWidth+1)?el:null; }
    document.addEventListener('wheel', e=>{
      const el=hscrollBox(e.target); if(!el) return;
      if(!e.deltaY || Math.abs(e.deltaX)>Math.abs(e.deltaY)) return;   // 가로 제스처는 그대로
      const before=el.scrollLeft; el.scrollLeft=before+e.deltaY;
      if(el.scrollLeft!==before) e.preventDefault();                   // 실제로 밀렸을 때만 세로 스크롤 차단
    }, { passive:false });
    let _hdrag=null, _hdSwallow=false;
    document.addEventListener('pointerdown', e=>{
      _hdSwallow=false;
      if(e.pointerType==='touch' || (e.button!=null && e.button!==0)) return;
      const el=hscrollBox(e.target); if(!el) return;
      _hdrag={ el:el, x:e.clientX, y:e.clientY, sl:el.scrollLeft, moved:false };
    });
    document.addEventListener('pointermove', e=>{
      if(!_hdrag) return; const dx=e.clientX-_hdrag.x;
      if(!_hdrag.moved){ if(Math.abs(dx)<5 || Math.abs(dx)<=Math.abs(e.clientY-_hdrag.y)) return; _hdrag.moved=true; _hdrag.el.classList.add('hdragging'); }
      _hdrag.el.scrollLeft=_hdrag.sl-dx; e.preventDefault();
    });
    function _hdragEnd(){ if(!_hdrag) return; const d=_hdrag; _hdrag=null; d.el.classList.remove('hdragging'); if(d.moved) _hdSwallow=true; }
    document.addEventListener('pointerup', _hdragEnd);
    document.addEventListener('pointercancel', _hdragEnd);
    document.addEventListener('click', e=>{ if(_hdSwallow){ _hdSwallow=false; e.stopPropagation(); e.preventDefault(); } }, true);

    function trapFocus(e, container){
      const f=container.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role=button],[role=switch]');
      const list=[...f].filter(el=>el.offsetParent!==null || el===container);
      if(!list.length){ e.preventDefault(); container.focus(); return; }
      const first=list[0], last=list[list.length-1], a=document.activeElement;
      if(e.shiftKey && (a===first||a===container)){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && a===last){ e.preventDefault(); first.focus(); }
    }
    // 동적 컨테이너 관찰 → 새로 그릴 때마다 자동 데코레이트(rAF 코얼레싱: 한 프레임의 여러 변경을 1회로 합쳐 재데코 폭주 방지)
    let _a11yRAF=0; const _a11yTargets=new Set();
    function _a11ySchedule(el){ _a11yTargets.add(el); if(_a11yRAF) return;
      _a11yRAF=requestAnimationFrame(()=>{ _a11yRAF=0; const t=[..._a11yTargets]; _a11yTargets.clear(); t.forEach(a11yDecorate); }); }
    ['content','sheetBody'].forEach(id=>{
      const el=document.getElementById(id);
      if(el && window.MutationObserver){ new MutationObserver(()=>_a11ySchedule(el)).observe(el, {childList:true, subtree:true}); }
    });
    a11yDecorate(document.body);
    syncTabCurrent();

    // ===== 📱 Android 하드웨어/제스처 뒤로가기 = 진짜 뒤로가기 (설치형 PWA/TWA) =====
    // PWA/TWA에서 뒤로가기는 브라우저 히스토리를 소비한다. SPA라 히스토리 항목이 없어 뒤로가기 한 번에
    // 앱이 그냥 종료되던 치명적 문제 수정. 히스토리에 가드 항목 1개를 얹고 popstate를 가로채,
    // 열린 모달(#catFx·.gimenu-scrim) → 시트(#sheet) → 모드화면(→홈) 순으로 하나씩 닫는다.
    // 홈 루트에서 아무것도 없으면 "한 번 더 누르면 종료"(안드로이드 관례). 브라우저 탭(비설치)에선 개입 안 함.
    (function backNav(){
      if(!window.history || !window.history.pushState) return;
      if(typeof isStandalone==='function' && !isStandalone()) return;   // 설치형 앱에서만 커스텀 뒤로가기(브라우저 탭 기본 동작 유지)
      function closeTop(){
        var fx=document.getElementById('catFx');
        if(fx && fx.classList.contains('on')){ try{ closeFx(); }catch(e){ fx.className='fx'; fx.innerHTML=''; } return true; }   // 뽑기 연출
        var scrims=document.querySelectorAll('.gimenu-scrim');           // 방메뉴·이름짓기·가구메뉴·확인 등
        if(scrims.length){ scrims[scrims.length-1].remove(); return true; }
        var sh=document.getElementById('sheet');                         // 알뜰홈·거래입력·더보기 하위 시트 등
        if(sh && sh.classList.contains('on')){ try{ closeSheet(); }catch(e){} return true; }
        try{ if(state && state.uid && typeof go==='function'){                  // 오늘홈·다른 탭 → 기본 탭(캘린더/할일)으로. 캘린더를 홈처럼 사용(오늘홈 랜딩으로 안 보냄)
          var defTab=(state.mode==='todo')?'todo':'calendar';
          if(state.view!=='mode' || state.tab!==defTab){ go(defTab); return true; }
        } }catch(e){}
        return false;
      }
      function rearm(){ try{ history.pushState({ eggardenBack:1 }, ''); }catch(e){} }
      var _lastRootBack=0;
      window.addEventListener('popstate', function(){
        if(closeTop()){ rearm(); return; }                               // 위 계층 하나 닫고 가드 재장전
        if(Date.now()-_lastRootBack < 1800){ try{ history.back(); }catch(e){} return; }   // 홈 루트에서 두 번째 뒤로가기 → 앱 종료
        _lastRootBack=Date.now();
        try{ toast('한 번 더 누르면 종료돼요'); }catch(e){}
        rearm();
      });
      function seed(){ try{ if(!(history.state && history.state.eggardenBack)) rearm(); }catch(e){} }   // 가드 항목 1개 확보
      seed();
      window.addEventListener('pageshow', seed);
    })();

    // ===== 초기 =====
    applyTheme();
