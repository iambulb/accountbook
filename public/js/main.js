// ===== PWA =====
    window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredPrompt=e; if(state.tab==='more') renderMore(); });
    function installApp(){ if(!deferredPrompt) return; deferredPrompt.prompt(); deferredPrompt.userChoice.finally(()=>{ deferredPrompt=null; renderMore(); }); }
    if('serviceWorker' in navigator){ window.addEventListener('load', ()=>navigator.serviceWorker.register('sw.js').catch(()=>{})); }

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

    // ===== 초기 =====
    applyTheme();
