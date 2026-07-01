// ===== 🐱 고양이집 — 은화 경제 + 도트(픽셀) 아트 =====
// 소속: 개인 전역 users/{uid}/game (워크스페이스 무관). RTDB 규칙 변경 불필요.
// 픽셀 아트: 문자 매트릭스 → SVG rect(crispEdges) 렌더(px). PNG 미사용(다크모드·캐시·성능 유리).

    // ---- 픽셀 매트릭스 (도트 아트) ----
    // 고양이 정면(코숏) — 귀·눈·코·줄무늬·가슴털·꼬리. X=외곽 B=몸 L=밝은털 S=줄무늬 E=눈 P=코 I=귀안
    const M_CAT_FRONT = [
      "..XX....XX......",
      ".XIIX..XIIX.....",
      ".XBBBBBBBBX.....",
      ".XBSBBBBSBX.....",
      ".XBBBBBBBBX.....",
      ".XBEBBBBEBX.....",
      ".XBBBPPBBBX.....",
      ".XBBBBBBBBX.....",
      ".XBBSBBSBBX.....",
      ".XBBBBBBBBXX....",
      ".XBLLLLLLBBBX...",
      ".XBLLLLLLBBBBX..",
      ".XBLLLLLLBBBX...",
      ".XBBLLLLBBBXX...",
      ".XXBBBBBBXX.....",
      "..XXXXXXXX......"
    ];
    // 삼색(칼리코) — 흰 바탕 + 주황(O)/먹(K) 패치
    const M_CALICO_FRONT = [
      "..OO....KK......",
      ".OIIO..KIIK.....",
      ".XOOBBBBKKX.....",
      ".XBSBBBBSKX.....",
      ".XBBBBBBBBX.....",
      ".XBEBBBBEBX.....",
      ".XBBBPPBBBX.....",
      ".XBBBBBBBBX.....",
      ".XBBOBBKBBX.....",
      ".XBBBBBBKBXX....",
      ".XBLLLLLKBBBX...",
      ".XBLLLLLLBBBBX..",
      ".XBLLLLLLBBBX...",
      ".XBBLLLLBBBXX...",
      ".XXBBBBBBXX.....",
      "..XXXXXXXX......"
    ];
    // 고양이 측면(걷기) 프레임 2종 — 앞을 보고 좌우로 걷는 실루엣. 다리만 교차로 달라짐.
    const M_CAT_SIDE_A = [
      "............XX..",
      "...XX......XIIX.",
      "..XIIX....XBBBBX",
      "..XBBBXXXXXBEBBX",
      ".XBBBBBBBBBBBBBX",
      ".XBBBBBBBBBBBBBX",
      ".XBLLLLLLLLLBBX.",
      ".XBLLLLLLLLLBX..",
      ".XXBBXXBBXXBXX..",
      "..XX...XX..XX..."
    ];
    const M_CAT_SIDE_B = [
      "............XX..",
      "...XX......XIIX.",
      "..XIIX....XBBBBX",
      "..XBBBXXXXXBEBBX",
      ".XBBBBBBBBBBBBBX",
      ".XBBBBBBBBBBBBBX",
      ".XBLLLLLLLLLBBX.",
      ".XBLLLLLLLLLBX..",
      ".XBXXBBXXBBXXBX.",
      "...XX..XX..XX..."
    ];
    const M_COIN = [
      "...XXXXXX...",
      ".XXSSSSSSXX.",
      ".XSSSSSSSSX.",
      "XSSAA.AASSX.",
      "XSSAAAAAASX.",
      "XSSAEAAEASX.",
      "XSSAAPPAASX.",
      "XSSAAAAAASX.",
      ".XSDDDDDDSX.",
      ".XXSSSSSSXX.",
      "...XXXXXX..."
    ];
    const M_CUSHION = [
      "................","...XXXXXXXX.....","..XCCCCCCCCX....",".XCCCCCCCCCCX...",
      ".XCDDDDDDDDCX...","..XXCCCCCCXX....","....XXXXXX......"
    ];
    const M_BOWL = [
      "................",".....FF.FF......","...XXFFFFFXX....","..XWWWWWWWWWX...",
      "..XWWWWWWWWWX...","...XWWWWWWWX....","....XXXXXXX.....","................"
    ];
    const M_TOWER = [
      "................",".....XXXXX......","....XWWWWWX.....","....XWWWWWX.....",".....XPPX.......",
      ".....XPPX.......","...XXXPPXXX.....","..XWWWWWWWWX....","..XWWWWWWWWX....","...XXPPXXX......",
      ".....XPPX.......",".....XPPX.......","....XXPPXX......","...XWWWWWWX.....","...XWWWWWWX.....","...XXXXXXXX....."
    ];
    const CAT_PALS = {
      mackerel:{X:'#3b4048',B:'#9AA6B4',L:'#D8DDE3',S:'#6E7A8A',E:'#22242b',P:'#E08b9d',I:'#E6A9B4'},
      cheese:  {X:'#6b3f1c',B:'#E8974C',L:'#F6D6A6',S:'#CC7A33',E:'#3a2415',P:'#E08b9d',I:'#F0C8A0'},
      calico:  {X:'#544e45',B:'#F3EFE8',L:'#FCFAF5',O:'#E8974C',K:'#3d3a40',S:'#c9c3ba',E:'#22242b',P:'#E08b9d',I:'#E6A9B4'}
    };
    const COIN_PAL={X:'#6f7681',S:'#d6dbe1',D:'#a8afb8',A:'#4a4f57',E:'#d6dbe1',P:'#cf8f6c'};
    const FURN_PALS={ cushion:{X:'#5b6470',C:'#a9b2be',D:'#868f9c'}, bowl:{X:'#5b6470',W:'#d0d6dd',F:'#d68b4a'}, tower:{X:'#6f4c28',W:'#c99a5f',P:'#8a6a3f'} };

    // 카탈로그(코드 상수) — 저장은 보유 id만
    const CAT_CATALOG = [
      { id:'mackerel', name:'고등어', price:45, desc:'쿨그레이 줄무늬. 차분하게 방을 돌아다녀요.' },
      { id:'cheese',   name:'치즈',   price:60, desc:'웜오렌지. 활발하게 뛰어다니는 개냥이.' },
      { id:'calico',   name:'삼색',   price:90, desc:'흰+주황+먹. 도도하게 창가에 앉아요.' }
    ];
    const ITEM_CATALOG = [
      { id:'cushion', name:'방석',   price:15, size:1, desc:'고양이가 앉아 쉬는 자리.' },
      { id:'bowl',    name:'밥그릇', price:20, size:1, desc:'배치하면 고양이가 다가와요.' },
      { id:'tower',   name:'캣타워', price:35, size:1, desc:'위층에 올라가 낮잠.' }
    ];
    // 미션 정의(일일). reward=은화. check(ctx)=완료 여부(현재 워크스페이스 활동 읽어 판정)
    const DAILY_MISSIONS = [
      { id:'record', name:'오늘 거래 1건 기록', reward:5, icon:'<path d="M12 4v16M8 8l4-4 4 4"/><rect x="4" y="18" width="16" height="3" rx="1"/>',
        check:()=> (state.transactions||[]).some(t=>(t.date||'').slice(0,10)===kstDayKey()) },
      { id:'attend', name:'출석 체크', reward:2, icon:'<path d="M5 12l4 4L19 6"/>',
        check:()=> true }   // 앱 진입 = 완료(멱등 수령)
    ];

    // ---- 픽셀 렌더 ----
    function pxSvg(map, pal, opt){
      opt=opt||{}; const cols=map[0].length, rows=map.length; let r='';
      for(let y=0;y<rows;y++){ const row=map[y];
        for(let x=0;x<cols;x++){ const ch=row[x]; if(ch===' '||ch==='.')continue; const c=pal[ch]; if(!c)continue;
          r+='<rect x="'+x+'" y="'+y+'" width="1.05" height="1.05" fill="'+c+'"/>'; } }
      const sz = opt.h ? ('height="'+opt.h+'"') : (opt.w? ('width="'+opt.w+'"') : '');
      const wh = opt.fit ? 'width="100%" height="100%"' : sz;
      return '<svg class="px '+(opt.cls||'')+'" viewBox="0 0 '+cols+' '+rows+'" '+wh+' shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet">'+r+'</svg>';
    }
    function catFront(id, opt){ return pxSvg(id==='calico'?M_CALICO_FRONT:M_CAT_FRONT, CAT_PALS[id], opt); }
    function catSide(id, frame, opt){ return pxSvg(frame? M_CAT_SIDE_B:M_CAT_SIDE_A, CAT_PALS[id], opt); }
    function coinSvg(opt){ return pxSvg(M_COIN, COIN_PAL, opt); }
    function furnSvg(id, opt){ const M={cushion:M_CUSHION,bowl:M_BOWL,tower:M_TOWER}[id]; return pxSvg(M, FURN_PALS[id], opt); }
    function catName(id){ const c=CAT_CATALOG.find(x=>x.id===id); return c?c.name:id; }

    // ---- 날짜 키(KST 자정 롤오버) ----
    function kstDayKey(){ const d=new Date(Date.now()+9*3600000); return d.toISOString().slice(0,10); }   // 2026-07-01

    // ---- 게임 상태/경제 ----
    function gameRef(){ return db.ref('users/'+state.uid+'/game'); }
    function normalizeGame(g){ g=g||{}; return {
      coins: Number(g.coins)||0,
      owned:{ cats:(g.owned&&g.owned.cats)||{}, items:(g.owned&&g.owned.items)||{} },
      home:{ active:(g.home&&g.home.active)||[], placed:(g.home&&g.home.placed)||{} },
      missions: g.missions||{}
    }; }
    function initCatGame(){
      if(!state.uid) return;
      if(state._gameRef){ try{ state._gameRef.off(); }catch(e){} }
      state._gameRef=gameRef();
      state._gameRef.on('value', s=>{ state.game=normalizeGame(s.val()); onGameChange(); });
      document.addEventListener('visibilitychange', ()=>{ if(document.hidden) stopWalk(); else startWalkIfNeeded(); });
    }
    function onGameChange(){
      updateDockCoins();
      renderDockCats();
      if(state._sheetRefresh && $('sheet') && $('sheet').classList.contains('on')) state._sheetRefresh();
    }
    function coins(){ return (state.game&&state.game.coins)||0; }
    function ownsCat(id){ return !!(state.game&&state.game.owned.cats[id]); }
    function activeCats(){ const a=(state.game&&state.game.home.active)||[]; return a.filter(ownsCat); }

    // 미션 지급(원자적·멱등): 게임 노드 트랜잭션 1회로 "수령 기록 + 은화 지급"을 동시에.
    // 같은 날 같은 미션은 이미 claimed면 변화 없음 → 중복 지급 불가.
    function missionClaimed(id){ const key=kstDayKey(); const day=(state.game&&state.game.missions[key])||{}; return !!(day[id]&&day[id].claimed); }
    function grantMission(id, reward){
      const key=kstDayKey();
      return gameRef().transaction(g=>{
        g=normalizeGame(g);
        g.missions[key]=g.missions[key]||{};
        if(g.missions[key][id] && g.missions[key][id].claimed) return g;   // 이미 수령 → 무변화
        g.missions[key][id]={ claimed:true, reward:reward, at:new Date().toISOString() };
        g.coins += reward;
        return g;
      });
    }
    // 미션 수동 수령(완료 판정 후)
    function claimMission(id){
      const m=DAILY_MISSIONS.find(x=>x.id===id); if(!m) return;
      if(missionClaimed(id)){ toast('이미 수령했어요'); return; }
      if(!m.check()){ toast('아직 완료되지 않았어요', true); return; }
      grantMission(id, m.reward).then(res=>{ if(res.committed) toast('+'+m.reward+' 은화 획득! 🐾'); });
    }
    // 출석 자동 수령(진입 시 1회, 멱등)
    function autoClaimAttend(){
      if(!state.game || missionClaimed('attend')) return;
      grantMission('attend', 2);
    }

    // 고양이 구매(원자적, 잔액 음수 방지)
    function buyCat(id){
      const c=CAT_CATALOG.find(x=>x.id===id); if(!c) return;
      if(ownsCat(id)){ toast('이미 보유한 고양이예요'); return; }
      if(coins()<c.price){ toast((c.price-coins())+' 은화 부족', true); return; }
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(g.coins<c.price || g.owned.cats[id]) return g;      // 재검증
        g.coins-=c.price; g.owned.cats[id]={boughtAt:new Date().toISOString()};
        if(g.home.active.length<3 && g.home.active.indexOf(id)<0) g.home.active.push(id);
        return g;
      }).then(res=>{ if(res.committed) toast(c.name+' 입양 완료! 🐾'); });
    }

    // ================= 전역 dock (접힌 스트립) =================
    // #catdock 은 index.html 셸의 #content 형제 → 리렌더 영향 없음(애니메이션 유지)
    function initDock(){
      const d=$('catdock'); if(!d) return;
      d.className='catdock';
      d.innerHTML='<div class="cd-strip" onclick="openCatHouse()"><div class="cd-floor"></div>'+
        '<span class="cd-coin"><span class="cd-ci">'+coinSvg({h:16})+'</span><b id="cdCoins">0</b></span>'+
        '<div class="cd-stage" id="cdStage"></div>'+
        '<span class="cd-lbl">고양이집</span>'+
        '<button class="cd-exp" aria-label="고양이집 열기">'+
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button></div>';
      updateDockCoins(); renderDockCats();
    }
    function updateDockCoins(){ const el=$('cdCoins'); if(el) el.textContent=coins().toLocaleString(); }
    // 활성 고양이를 스트립에 액터로 배치(없으면 안내)
    function renderDockCats(){
      const stage=$('cdStage'); if(!stage) return;
      const cats=activeCats();
      if(!cats.length){ stage.innerHTML='<span class="cd-empty">고양이를 입양해 보세요</span>'; stopWalk(); return; }
      stage.innerHTML=cats.slice(0,3).map((id,i)=>'<div class="cd-actor" data-cat="'+id+'" data-dir="1" style="left:'+(10+i*26)+'px;">'+catSide(id,0,{h:30})+'</div>').join('');
      startWalkIfNeeded();
    }
    // ---- 걷기 루프(보일 때만, reduced-motion 존중) ----
    const _walk={ raf:0, actors:[], last:0 };
    function reducedMotion(){ try{ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }
    function startWalkIfNeeded(){
      const stage=$('cdStage'); if(!stage) return;
      stopWalk();
      if(document.hidden || reducedMotion()) return;
      const acts=Array.from(stage.querySelectorAll('.cd-actor'));
      if(!acts.length) return;
      const W=stage.clientWidth||160;
      _walk.actors=acts.map(el=>({ el, x:parseFloat(el.style.left)||0, dir:1, v:0.25+Math.random()*0.25, t:Math.random()*6, frame:0, fc:0, W }));
      _walk.last=0; _walk.raf=requestAnimationFrame(walkTick);
    }
    function stopWalk(){ if(_walk.raf){ cancelAnimationFrame(_walk.raf); _walk.raf=0; } _walk.actors=[]; }
    function walkTick(ts){
      if(!_walk.last) _walk.last=ts; const dt=Math.min(50, ts-_walk.last); _walk.last=ts;
      _walk.actors.forEach(a=>{
        a.x += a.dir*a.v*dt*0.06;
        const max=(a.W||160)-30;
        if(a.x<2){ a.x=2; a.dir=1; } else if(a.x>max){ a.x=max; a.dir=-1; }
        a.t+=dt*0.004; const bob=Math.sin(a.t*3)*1.2;
        a.fc+=dt; if(a.fc>170){ a.fc=0; a.frame^=1; const id=a.el.getAttribute('data-cat'); a.el.innerHTML=catSide(id,a.frame,{h:30}); }
        a.el.style.transform='translate(0,'+bob.toFixed(1)+'px) scaleX('+a.dir+')';
        a.el.style.left=a.x.toFixed(1)+'px';
      });
      _walk.raf=requestAnimationFrame(walkTick);
    }

    // ================= 고양이집 시트 (홈 · 상점 · 미션) =================
    let _catTab='home';
    function openCatHouse(tab){ _catTab=tab||'home'; renderCatHouse(); }
    function setCatTab(t){ _catTab=t; renderCatHouse(); }
    function renderCatHouse(){
      if(!state.game) state.game=normalizeGame(null);   // 스냅샷 도착 전 안전 가드
      const build=()=>{
        let h='<div class="coinbar"><span class="coin"><span class="ci">'+coinSvg({h:20})+'</span>'+coins().toLocaleString()+'<small>은화</small></span></div>';
        h+='<div class="catseg">'+[['home','홈'],['shop','상점'],['mission','미션']].map(t=>'<button class="'+(_catTab===t[0]?'on':'')+'" onclick="setCatTab(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div>';
        if(_catTab==='home') h+=catHomeHtml();
        else if(_catTab==='shop') h+=catShopHtml();
        else h+=catMissionHtml();
        return h;
      };
      openSheet('고양이집', build());
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(!b) return; const st=b.scrollTop; b.innerHTML=build(); b.scrollTop=st; if(_catTab==='home') mountRoomWalk(); };
      if(_catTab==='home') setTimeout(mountRoomWalk, 30);
    }
    function catHomeHtml(){
      const cats=activeCats();
      let h='<div class="catroom" id="catRoom"><div class="cr-wall"></div><div class="cr-base"></div><span class="cr-cam"><i></i>LIVE · 우리집</span><div class="cr-stage" id="crStage"></div></div>';
      h+='<div class="sech"><span class="l">우리집 고양이</span><span class="s">'+cats.length+' / 3 활성</span></div>';
      if(!cats.length) h+='<div class="empty" style="padding:20px;">아직 고양이가 없어요. 상점에서 입양해 보세요 🐾</div>';
      else h+='<div class="catchips">'+cats.map(id=>'<div class="catchip">'+catFront(id,{h:44})+'<div class="cn">'+catName(id)+'</div></div>').join('')+'</div>';
      return h;
    }
    function mountRoomWalk(){
      const stage=$('crStage'); if(!stage) return;
      const cats=activeCats();
      stage.innerHTML=cats.slice(0,3).map((id,i)=>'<div class="cd-actor" data-cat="'+id+'" data-dir="1" style="left:'+(20+i*46)+'px;">'+catSide(id,0,{h:46})+'</div>').join('');
      // 시트 열려있는 동안만 방 걷기(스트립 루프는 잠시 이 stage로 대체)
      _roomStage=stage; startRoomWalk();
    }
    let _roomStage=null; const _rw={raf:0,actors:[],last:0};
    function startRoomWalk(){
      if(_rw.raf){ cancelAnimationFrame(_rw.raf); _rw.raf=0; }
      if(!_roomStage||document.hidden||reducedMotion()) return;
      const acts=Array.from(_roomStage.querySelectorAll('.cd-actor')); if(!acts.length) return;
      const W=_roomStage.clientWidth||300;
      _rw.actors=acts.map(el=>({el,x:parseFloat(el.style.left)||0,dir:1,v:0.2+Math.random()*0.3,t:Math.random()*6,frame:0,fc:0,W,sz:46}));
      _rw.last=0; _rw.raf=requestAnimationFrame(roomTick);
    }
    function roomTick(ts){
      if(!$('sheet')||!$('sheet').classList.contains('on')||_catTab!=='home'){ _rw.raf=0; return; }  // 시트 닫히면 정지
      if(!_rw.last)_rw.last=ts; const dt=Math.min(50,ts-_rw.last); _rw.last=ts;
      _rw.actors.forEach(a=>{ a.x+=a.dir*a.v*dt*0.06; const max=(a.W||300)-46;
        if(a.x<4){a.x=4;a.dir=1;} else if(a.x>max){a.x=max;a.dir=-1;}
        a.t+=dt*0.004; const bob=Math.sin(a.t*3)*1.6;
        a.fc+=dt; if(a.fc>170){a.fc=0;a.frame^=1;const id=a.el.getAttribute('data-cat');a.el.innerHTML=catSide(id,a.frame,{h:46});}
        a.el.style.transform='translate(0,'+bob.toFixed(1)+'px) scaleX('+a.dir+')'; a.el.style.left=a.x.toFixed(1)+'px';
      });
      _rw.raf=requestAnimationFrame(roomTick);
    }
    function catShopHtml(){
      let h='<div class="subseg"><button class="on">고양이</button></div>';
      h+=CAT_CATALOG.map(c=>{
        const owned=ownsCat(c.id), enough=coins()>=c.price;
        let act;
        if(owned) act='<span class="owntag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>보유</span>';
        else if(enough) act='<button class="buy" onclick="buyCat(\''+c.id+'\')">구매</button>';
        else act='<button class="buy dis" disabled>'+(c.price-coins())+' 부족</button>';
        return '<div class="shopcard"><div class="thumb"><div class="fl"></div>'+catFront(c.id,{h:56})+'</div>'+
          '<div class="meta"><b>'+c.name+' <span class="tagmini">코숏</span></b><div class="desc">'+c.desc+'</div>'+
          '<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+c.price+'</span></div>'+
          '<div class="act">'+act+'</div></div>';
      }).join('');
      h+='<div class="note"><b>중복 소유</b> 고양이는 종당 1마리. 구매하면 자동으로 집에 들어와 걸어다녀요.</div>';
      return h;
    }
    function catMissionHtml(){
      const key=kstDayKey(), done=state.game.missions[key]||{};
      let h='<div class="coinhero"><span class="ch-big">'+coinSvg({h:44})+'</span><div><div class="k">보유 은화</div><div class="v">'+coins().toLocaleString()+'</div></div></div>';
      h+='<div class="sech"><span class="l">일일 미션</span><span class="s">자정 초기화</span></div>';
      h+=DAILY_MISSIONS.map(m=>{
        const claimed=!!(done[m.id]&&done[m.id].claimed), ok=m.check();
        let right;
        if(claimed) right='<span class="mdone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>수령완료</span>';
        else if(ok) right='<button class="claim" onclick="claimMission(\''+m.id+'\')">수령</button>';
        else right='<span class="prog-pill">진행 중</span>';
        return '<div class="cmrow"><span class="cmi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+m.icon+'</svg></span>'+
          '<div class="cmm"><b>'+m.name+'</b><span class="rw"><span class="ci">'+coinSvg({h:14})+'</span>+'+m.reward+(claimed?' · 수령완료':(ok?' · 완료':''))+'</span></div>'+right+'</div>';
      }).join('');
      h+='<div class="note" style="margin-top:12px;"><b>은화</b>로 상점에서 고양이를 입양하세요. 미션은 매일 자정(KST) 초기화됩니다.</div>';
      return h;
    }
