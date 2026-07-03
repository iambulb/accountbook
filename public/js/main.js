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
      let _swRefreshing=false;
      navigator.serviceWorker.addEventListener('controllerchange', ()=>{ if(_swRefreshing || !_hadController) return; _swRefreshing=true; location.reload(); });
      window.addEventListener('load', ()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
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
      // 2) onclick 이 달린 비(非)버튼 요소(div/span 등): role=button + 포커스 가능
      root.querySelectorAll('[onclick]').forEach(el=>{
        if(el.id==='overlay' || el.classList.contains('switch')) return;
        const tag=el.tagName;
        if(tag==='BUTTON'||tag==='A'||tag==='INPUT'||tag==='SELECT'||tag==='TEXTAREA'||tag==='LABEL') return;
        if(!el.hasAttribute('role')) el.setAttribute('role','button');
        if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0');
      });
      // 3) 라벨↔입력 연결(.field 안의 label 과 첫 입력)
      root.querySelectorAll('.field').forEach(f=>{
        const lab=f.querySelector('label'), inp=f.querySelector('input,select,textarea');
        if(lab && inp && !lab.htmlFor && inp.id) lab.htmlFor=inp.id;
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
    function trapFocus(e, container){
      const f=container.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),[role=button],[role=switch]');
      const list=[...f].filter(el=>el.offsetParent!==null || el===container);
      if(!list.length){ e.preventDefault(); container.focus(); return; }
      const first=list[0], last=list[list.length-1], a=document.activeElement;
      if(e.shiftKey && (a===first||a===container)){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && a===last){ e.preventDefault(); first.focus(); }
    }
    // 동적 컨테이너 관찰 → 새로 그릴 때마다 자동 데코레이트
    ['content','sheetBody'].forEach(id=>{
      const el=document.getElementById(id);
      if(el && window.MutationObserver){ new MutationObserver(()=>a11yDecorate(el)).observe(el, {childList:true, subtree:true}); }
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
