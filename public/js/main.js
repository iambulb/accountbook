// ===== PWA =====
    window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredPrompt=e; if(state.tab==='more') renderMore(); });
    function installApp(){ if(!deferredPrompt) return; deferredPrompt.prompt(); deferredPrompt.userChoice.finally(()=>{ deferredPrompt=null; renderMore(); }); }
    if('serviceWorker' in navigator){ window.addEventListener('load', ()=>navigator.serviceWorker.register('sw.js').catch(()=>{})); }

    // ===== 초기 =====
    applyTheme();
