// ===== 🐱 고양이집 — 은화 경제 + 도트(픽셀) 아트 =====
// 소속: 개인 전역 users/{uid}/game (워크스페이스 무관). RTDB 규칙 변경 불필요.
// 픽셀 아트: 문자 매트릭스 → SVG rect(crispEdges) 렌더(px). PNG 미사용(다크모드·캐시·성능 유리).

    // ---- 픽셀 매트릭스 (도트 아트) ----
    // 고양이 정면(코숏) — 귀·눈·코·줄무늬·가슴털·꼬리. X=외곽 B=몸 L=밝은털 S=줄무늬 E=눈 P=코 I=귀안
    // 정면 앉은 고양이(코숏, 상점/칩) — design_sample 스타일: 둥근 몸+뾰족 귀(핑크 안쪽)+큰 눈+가슴털+타비
    const M_CAT_FRONT = [
      "....XX......XX....",
      "...XIIXXXXXXIIX...",
      "...XBBBBSSBBBBX...",
      "..XBBBSBBBBSBBBX..",
      "..XBBBBBBBBBBBBX..",
      "..XBBSEEBBEESBBX..",
      "..XBBBEEBBEEBBBX..",
      "...XBBBBPPBBBBXXX.",
      "..XBBBLLLLLLBBBBBX",
      "..XBBBLLLLLLBBBSBX",
      "..XBBBLLLLLLBBBBBX",
      "..XBBBLLLLLLBBBBBX",
      "..XBBBLLLLLLBBBXX.",
      "...XBBLLLLLLBBX...",
      "....XXLLXXLLXX....",
      "......XX..XX......"
    ];
    // 삼색(칼리코) 정면 — 흰 바탕 + 주황(O)/먹(K) 패치(타비 대신)
    const M_CALICO_FRONT = [
      "....XX......XX....",
      "...XKKX....XOOX...",
      "...XIIXXXXXXIIX...",
      "...XKKKBBBBBBBX...",
      "..XBKKKKBBBBBBBX..",
      "..XBKKKBBBBOOOBX..",
      "..XBBBEEBBEEOOBX..",
      "..XBBBEEBBEEOOBX..",
      "...XBBBBPPBBBBXXX.",
      "..XBBBLLLLLOOOBBBX",
      "..XBBBLLLLLOOOBKBX",
      "..XBBBLLLLLOOOBBBX",
      "..XBBBLLLLLOOOBBBX",
      "..XBBBLLLLLLBBBXX.",
      "...XBBLLLLLLBBX...",
      "....XXLLXXLLXX...."
    ];
    // 측면 걷기 2프레임(오른쪽 바라봄) — 4다리·올린 꼬리·타비 줄무늬. 다리만 교차.
    const M_CAT_SIDE_A = [
      "...XX............XX..XX...",
      "..XXX...........XIBXXBIX..",
      ".XXX............XBBXXBBX..",
      ".XSX............XBBSBBBBX.",
      ".XSX.XXXXXXXXXXXBBBBSBBBBX",
      ".XSXXBBSBSBSBSBSBBBBBEEBBX",
      ".XSXBBBBSBSBSBSBBBBBBBBBPX",
      ".XSXBBBBBBBBBBBBBBBBBBBBBX",
      ".XXXBBBBBBBBBBBBBBBBBBBBBX",
      "...XBBLLLLLLLLLLBBBBBBBBX.",
      "....XBLLLLLLLLLLBBXXXXXX..",
      ".....XXBBBBXXXXXXBBBBX....",
      "......XBBBBX....XBBBBX....",
      ".......XXXX......XXXX....."
    ];
    const M_CAT_SIDE_B = [
      "...XX............XX..XX...",
      "..XXX...........XIBXXBIX..",
      ".XXX............XBBXXBBX..",
      ".XSX............XBBSBBBBX.",
      ".XSX.XXXXXXXXXXXBBBBSBBBBX",
      ".XSXXBBSBSBSBSBSBBBBBEEBBX",
      ".XSXBBBBSBSBSBSBBBBBBBBBPX",
      ".XSXBBBBBBBBBBBBBBBBBBBBBX",
      ".XXXBBBBBBBBBBBBBBBBBBBBBX",
      "...XBBLLLLLLLLLLBBBBBBBBX.",
      "....XBLLLLLLLLLLBBXXXXXX..",
      ".....XBBXXBBXXXXBBXXBBX...",
      ".....XBBXXBBX..XBBXXBBX...",
      "......XX..XX....XX..XX...."
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
      { id:'record', period:'day', name:'오늘 거래 1건 기록', reward:5, icon:'<path d="M12 4v16M8 8l4-4 4 4"/><rect x="4" y="18" width="16" height="3" rx="1"/>',
        check:()=> (state.transactions||[]).some(t=>(t.date||'').slice(0,10)===kstDayKey()) },
      { id:'attend', period:'day', name:'출석 체크', reward:2, icon:'<path d="M5 12l4 4L19 6"/>',
        check:()=> true }   // 앱 진입 = 완료(멱등 수령)
    ];
    const WEEKLY_MISSIONS = [
      { id:'week5', period:'week', name:'이번 주 5일 이상 기록', reward:20, icon:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
        prog:()=> recordDaysThisWeek()+' / 5일', check:()=> recordDaysThisWeek()>=5 },
      { id:'report', period:'week', name:'리포트 확인', reward:10, icon:'<path d="M5 20V11M12 20V5M19 20v-6"/>',
        check:()=> reportSeenThisWeek() }
    ];
    const ALL_MISSIONS = DAILY_MISSIONS.concat(WEEKLY_MISSIONS);

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

    // ---- 날짜 키(KST 롤오버) ----
    function kstDayKey(){ const d=new Date(Date.now()+9*3600000); return d.toISOString().slice(0,10); }   // 2026-07-01
    function kstWeekKey(){ const d=new Date(Date.now()+9*3600000); const mon=(d.getUTCDay()+6)%7; d.setUTCDate(d.getUTCDate()-mon); return 'W'+d.toISOString().slice(0,10); } // 그 주 월요일(KST)
    // 이번 주(월~) 현재 워크스페이스에서 기록한 서로 다른 날 수
    function recordDaysThisWeek(){ const wk=kstWeekKey().slice(1); const days={}; (state.transactions||[]).forEach(t=>{ const d=(t.date||'').slice(0,10); if(!d) return; const kd=weekKeyOf(d); if(kd===kstWeekKey()) days[d]=1; }); return Object.keys(days).length; }
    function weekKeyOf(dateStr){ const d=new Date(dateStr+'T00:00:00Z'); const mon=(d.getUTCDay()+6)%7; d.setUTCDate(d.getUTCDate()-mon); return 'W'+d.toISOString().slice(0,10); }
    function reportSeenThisWeek(){ const p=(state.game&&state.game.progress[kstWeekKey()])||{}; return !!p.reportSeen; }
    function markReportSeen(){ if(!state.uid||!state.game) return; if(reportSeenThisWeek()) return; gameRef().child('progress/'+kstWeekKey()+'/reportSeen').set(true); }

    // ---- 게임 상태/경제 ----
    function gameRef(){ return db.ref('users/'+state.uid+'/game'); }
    function normalizeGame(g){ g=g||{}; return {
      coins: Number(g.coins)||0,
      owned:{ cats:(g.owned&&g.owned.cats)||{}, items:(g.owned&&g.owned.items)||{} },
      home:{ active:(g.home&&g.home.active)||[], placed:(g.home&&g.home.placed)||{} },
      missions: g.missions||{}, progress: g.progress||{}
    }; }
    function initCatGame(){
      if(!state.uid) return;
      if(state._gameRef){ try{ state._gameRef.off(); }catch(e){} }
      state._gameRef=gameRef();
      state._gameRef.on('value', s=>{ state.game=normalizeGame(s.val()); onGameChange(); });
      startCatLoop();   // 통합 걷기 엔진(단일 rAF, 보이는 무대만 애니메이션)
    }
    function onGameChange(){
      updateDockCoins();
      renderDockCats();
      if(state._sheetRefresh && $('sheet') && $('sheet').classList.contains('on')) state._sheetRefresh();
    }
    function coins(){ return (state.game&&state.game.coins)||0; }
    function ownsCat(id){ return !!(state.game&&state.game.owned.cats[id]); }
    function activeCats(){ const a=(state.game&&state.game.home.active)||[]; return a.filter(ownsCat); }
    function ownedCatList(){ return CAT_CATALOG.filter(c=>ownsCat(c.id)).map(c=>c.id); }
    function isActiveCat(id){ return activeCats().indexOf(id)>=0; }
    // 활성 슬롯 토글(집에 내보내기 / 대기) — 최대 3마리
    function toggleActiveCat(id){
      if(!ownsCat(id)) return;
      const a=activeCats().slice(), i=a.indexOf(id);
      if(i>=0) a.splice(i,1);
      else { if(a.length>=3){ toast('최대 3마리까지 내보낼 수 있어요', true); return; } a.push(id); }
      gameRef().child('home/active').set(a);
    }

    // 미션 지급(원자적·멱등): 게임 노드 트랜잭션 1회로 "수령 기록 + 은화 지급"을 동시에.
    // 같은 날 같은 미션은 이미 claimed면 변화 없음 → 중복 지급 불가.
    function missionKey(m){ return m.period==='week'?kstWeekKey():kstDayKey(); }
    function missionClaimed(m){ const key=missionKey(m); const pd=(state.game&&state.game.missions[key])||{}; return !!(pd[m.id]&&pd[m.id].claimed); }
    function grantMission(m){
      const key=missionKey(m);
      return gameRef().transaction(g=>{
        g=normalizeGame(g);
        g.missions[key]=g.missions[key]||{};
        if(g.missions[key][m.id] && g.missions[key][m.id].claimed) return g;   // 이미 수령 → 무변화
        g.missions[key][m.id]={ claimed:true, reward:m.reward, at:new Date().toISOString() };
        g.coins += m.reward;
        return g;
      });
    }
    // 프로모/치트 코드 — 코드 입력 시 은화 지급(반복 입력 가능)
    const PROMO_CODES = { showmethemoney: 999 };
    function redeemCode(code){
      const key=(code||'').trim().toLowerCase();
      const reward=PROMO_CODES[key];
      if(!reward){ toast('올바르지 않은 코드예요', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); g.coins += reward; return g; })
        .then(res=>{ if(res.committed) toast('+'+reward.toLocaleString()+' 은화 획득! 🐾'); });
    }
    // 미션 수동 수령(완료 판정 후)
    function claimMission(id){
      const m=ALL_MISSIONS.find(x=>x.id===id); if(!m) return;
      if(missionClaimed(m)){ toast('이미 수령했어요'); return; }
      if(!m.check()){ toast('아직 완료되지 않았어요', true); return; }
      grantMission(m).then(res=>{ if(res.committed) toast('+'+m.reward+' 은화 획득! 🐾'); });
    }
    // 출석 자동 수령(진입 시 1회, 멱등)
    function autoClaimAttend(){
      const m=DAILY_MISSIONS.find(x=>x.id==='attend');
      if(!state.game || missionClaimed(m)) return;
      grantMission(m);
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

    // ================= 전역 dock (얇은 스트립 / 숨김) =================
    // #catdock 은 index.html 셸의 #content 형제 → 리렌더 영향 없음(애니메이션 유지)
    // 스트립 전체가 탭 시 고양이집 시트를 여므로 별도 확장 뷰/라벨/버튼 없이 간소화.
    function dockMode(){ return localStorage.getItem('catDock')==='hidden'?'hidden':'strip'; }
    function setDockMode(m){ localStorage.setItem('catDock', m); renderDock(); }
    function toggleDockHidden(){ setDockMode(dockMode()==='hidden'?'strip':'hidden'); if(state.tab==='more') renderMore(); }
    function dockHiddenLabel(){ return dockMode()==='hidden'?'숨김':'켬'; }
    function initDock(){ renderDock(); }
    function renderDock(){
      const d=$('catdock'); if(!d) return;
      if(dockMode()==='hidden'){ d.className='catdock hidden'; d.innerHTML=''; stopWalk(); return; }
      d.className='catdock';
      d.innerHTML='<div class="cd-strip" onclick="openCatHouse()"><div class="cd-floor"></div>'+
        '<span class="cd-coin"><span class="cd-ci">'+coinSvg({h:16})+'</span><b id="cdCoins">0</b></span>'+
        '<div class="cd-stage" id="cdStage"></div></div>';
      updateDockCoins(); renderDockCats();
    }
    function updateDockCoins(){ const el=$('cdCoins'); if(el) el.textContent=coins().toLocaleString(); }
    // 활성 고양이를 dock 무대에 액터로 배치(없으면 안내)
    function renderDockCats(){
      const stage=$('cdStage'); if(!stage) return;
      const cats=activeCats();
      stage.dataset.hh=30;
      if(!cats.length){ stage.innerHTML='<span class="cd-empty">고양이를 입양해 보세요</span>'; markCatDirty(); return; }
      stage.innerHTML=cats.slice(0,3).map((id,i)=>'<div class="cd-actor" data-cat="'+id+'" style="left:'+(10+i*26)+'px;">'+catSide(id,0,{h:30})+'</div>').join('');
      markCatDirty();
    }
    // ---- 통합 걷기 엔진: 단일 rAF가 "지금 보이는 무대"(시트 방 또는 dock)만 애니메이션 ----
    // 고양이는 방/시트에 배치된 가구로 가끔 다가가 잠시 머문다(상호작용). 스트립엔 가구가 없어 자유 배회.
    function reducedMotion(){ try{ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }
    const _eng={ raf:0, stage:null, actors:[], last:0, dirty:false };
    function markCatDirty(){ _eng.dirty=true; }
    function stopWalk(){ _eng.actors=[]; _eng.stage=null; }
    function activeStage(){
      const sheetOpen=$('sheet')&&$('sheet').classList.contains('on');
      if(sheetOpen && _catTab==='home'){ const s=$('crStage'); if(s) return s; }
      if(dockMode()!=='hidden'){ const s=$('cdStage'); if(s) return s; }
      return null;
    }
    function buildActors(stage){
      const acts=Array.from(stage.querySelectorAll('.cd-actor')); if(!acts.length) return [];
      const W=stage.clientWidth||160, hh=+stage.dataset.hh||30, sw=Math.round(hh*26/14);
      const hasRoom = stage.id==='crStage' || !!stage.closest('.cd-room');
      const props = hasRoom ? placedList().map(p=>((p.c-0.5)/12*W)) : [];
      return acts.map(el=>({ el, x:parseFloat(el.style.left)||0, dir:1, v:0.22+Math.random()*0.28, t:Math.random()*6, frame:0, fc:0, W, hh, sw, props, mode:'roam', pause:0, goal:0 }));
    }
    function stepActors(dt){
      _eng.actors.forEach(a=>{
        a.t+=dt*0.004; const id=a.el.getAttribute('data-cat');
        if(a.mode==='pause'){ a.pause-=dt; a.el.style.transform='translate(0,0) scaleX('+a.dir+')'; if(a.pause<=0) a.mode='roam'; return; }
        if(a.mode==='roam' && a.props.length && Math.random()<0.004){ a.goal=a.props[Math.floor(Math.random()*a.props.length)]; a.mode='goal'; }
        if(a.mode==='goal'){ a.dir=(a.goal>a.x)?1:-1; if(Math.abs(a.goal-a.x)<4){ a.mode='pause'; a.pause=1100+Math.random()*1600; a.el.style.transform='translate(0,0) scaleX('+a.dir+')'; return; } }
        a.x += a.dir*a.v*dt*0.06;
        const max=a.W-a.sw;
        if(a.x<2){ a.x=2; a.dir=1; if(a.mode==='goal')a.mode='roam'; } else if(a.x>max){ a.x=max; a.dir=-1; if(a.mode==='goal')a.mode='roam'; }
        a.fc+=dt; if(a.fc>170){ a.fc=0; a.frame^=1; a.el.innerHTML=catSide(id,a.frame,{h:a.hh}); }
        const bob=Math.sin(a.t*3)*1.2;
        a.el.style.transform='translate(0,'+bob.toFixed(1)+'px) scaleX('+a.dir+')';
        a.el.style.left=a.x.toFixed(1)+'px';
      });
    }
    function catLoop(ts){
      const dt=_eng.last?Math.min(50,ts-_eng.last):16; _eng.last=ts;
      const stage=activeStage();
      if(stage!==_eng.stage || _eng.dirty){ _eng.stage=stage; _eng.dirty=false; _eng.actors= stage? buildActors(stage):[]; }
      if(stage && _eng.actors.length && !document.hidden && !reducedMotion()) stepActors(dt);
      _eng.raf=requestAnimationFrame(catLoop);
    }
    function startCatLoop(){ if(!_eng.raf) _eng.raf=requestAnimationFrame(catLoop); }

    // ================= 고양이집 시트 (홈 · 상점 · 미션) =================
    let _catTab='home';
    function openCatHouse(tab){ _catTab=tab||'home'; renderCatHouse(); }
    function setCatTab(t){ _catTab=t; renderCatHouse(); }
    function renderCatHouse(){
      if(!state.game) state.game=normalizeGame(null);   // 스냅샷 도착 전 안전 가드
      const build=()=>{
        let h='<div class="coinbar"><span class="coin"><span class="ci">'+coinSvg({h:20})+'</span>'+coins().toLocaleString()+'<small>은화</small></span></div>';
        h+='<div class="catseg">'+[['home','홈'],['shop','상점'],['place','배치'],['mission','미션']].map(t=>'<button class="'+(_catTab===t[0]?'on':'')+'" onclick="setCatTab(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div>';
        if(_catTab==='home') h+=catHomeHtml();
        else if(_catTab==='shop') h+=catShopHtml();
        else if(_catTab==='place') h+=catPlaceHtml();
        else h+=catMissionHtml();
        return h;
      };
      openSheet('고양이집', build());
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(!b) return; const st=b.scrollTop; b.innerHTML=build(); b.scrollTop=st; if(_catTab==='home') mountRoomWalk(); };
      if(_catTab==='home') setTimeout(mountRoomWalk, 30);
    }
    function catHomeHtml(){
      const cats=activeCats();
      // 배치된 가구를 방 바닥에 매핑(c→가로, r→앞뒤 깊이)
      const props=placedList().map(p=>{ const x=((p.c-0.5)/12*100).toFixed(1); const depth=(p.r-1)/11; const bottom=(3+depth*30).toFixed(0);
        return '<div class="cr-prop" style="left:'+x+'%;bottom:'+bottom+'px;">'+furnSvg(p.itemId,{h:(20+depth*10).toFixed(0)})+'</div>'; }).join('');
      let h='<div class="catroom" id="catRoom"><div class="cr-wall"></div><div class="cr-base"></div><span class="cr-cam"><i></i>LIVE · 우리집</span><div class="cr-props">'+props+'</div><div class="cr-stage" id="crStage"></div></div>';
      const owned=ownedCatList();
      h+='<div class="sech"><span class="l">우리집 고양이</span><span class="s">'+cats.length+' / 3 활성</span></div>';
      if(!owned.length) h+='<div class="empty" style="padding:20px;">아직 고양이가 없어요. 상점에서 입양해 보세요 🐾</div>';
      else { h+='<div class="catchips">'+owned.map(id=>{ const on=isActiveCat(id);
        return '<button class="catchip'+(on?' on':'')+'" onclick="toggleActiveCat(\''+id+'\')">'+catFront(id,{h:44})+'<div class="cn">'+catName(id)+'</div><div class="cstate">'+(on?'집에 있음':'대기')+'</div></button>'; }).join('')+'</div>';
        h+='<div class="hintline" style="margin-top:10px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>고양이를 탭해 집에 내보내거나 대기시켜요(최대 3마리).</div>'; }
      return h;
    }
    function mountRoomWalk(){
      const stage=$('crStage'); if(!stage) return;
      const cats=activeCats();
      stage.dataset.hh=46;
      stage.innerHTML=cats.slice(0,3).map((id,i)=>'<div class="cd-actor" data-cat="'+id+'" style="left:'+(20+i*46)+'px;">'+catSide(id,0,{h:46})+'</div>').join('');
      markCatDirty();   // 통합 엔진이 시트 방 무대를 자동으로 잡아 애니메이션
    }
    let _shopSub='cats';
    function setShopSub(s){ _shopSub=s; renderCatHouse(); }
    function catShopHtml(){
      let h='<div class="subseg"><button class="'+(_shopSub==='cats'?'on':'')+'" onclick="setShopSub(\'cats\')">고양이</button><button class="'+(_shopSub==='furn'?'on':'')+'" onclick="setShopSub(\'furn\')">가구</button></div>';
      if(_shopSub==='cats'){
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
      } else {
        h+=ITEM_CATALOG.map(it=>{
          const enough=coins()>=it.price;
          const act=enough?'<button class="buy" onclick="buyItem(\''+it.id+'\')">구매</button>':'<button class="buy dis" disabled>'+(it.price-coins())+' 부족</button>';
          return '<div class="shopcard"><div class="thumb">'+furnSvg(it.id,{h:52})+'</div>'+
            '<div class="meta"><b>'+it.name+'</b><div class="desc">'+it.desc+'</div>'+
            '<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+it.price+'</span></div>'+
            '<div class="act">'+act+'<span class="qty">보유 '+itemQty(it.id)+'</span></div></div>';
        }).join('');
        h+='<div class="note"><b>수량 허용</b> 가구는 여러 개 살 수 있어요. 구매 후 <b>배치</b> 탭에서 격자에 놓습니다.</div>';
      }
      return h;
    }
    // ---- 가구 인벤토리/배치 ----
    function itemQty(id){ const it=state.game&&state.game.owned.items[id]; return it?(Number(it.qty)||0):0; }
    function placedList(){ const p=(state.game&&state.game.home.placed)||{}; return Object.keys(p).map(k=>({key:k, r:+k.split('_')[0], c:+k.split('_')[1], itemId:p[k].itemId})); }
    function itemPlaced(id){ return placedList().filter(x=>x.itemId===id).length; }
    function itemRemaining(id){ return itemQty(id)-itemPlaced(id); }
    function buyItem(id){
      const it=ITEM_CATALOG.find(x=>x.id===id); if(!it) return;
      if(coins()<it.price){ toast((it.price-coins())+' 은화 부족', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); if(g.coins<it.price) return g;
        g.coins-=it.price; g.owned.items[id]=g.owned.items[id]||{qty:0,boughtAt:new Date().toISOString()};
        g.owned.items[id].qty=(Number(g.owned.items[id].qty)||0)+1; return g;
      }).then(res=>{ if(res.committed) toast(it.name+' 구매! 배치 탭에서 놓아보세요'); });
    }
    let _selItem=null;
    function selItem(id){ _selItem=(_selItem===id?null:id); renderCatHouse(); }
    function placeCell(r,c){
      const key=r+'_'+c; const placed=(state.game.home.placed)||{};
      if(placed[key]){ gameRef().child('home/placed/'+key).remove(); toast('회수했어요'); return; }
      if(!_selItem){ toast('놓을 가구를 먼저 선택하세요'); return; }
      if(itemRemaining(_selItem)<=0){ toast('배치할 수량이 없어요(상점에서 구매)', true); return; }
      gameRef().child('home/placed/'+key).set({itemId:_selItem});
    }
    function catPlaceHtml(){
      const placed=(state.game.home.placed)||{};
      let cells='';
      for(let r=1;r<=12;r++)for(let c=1;c<=12;c++){ const key=r+'_'+c, it=placed[key];
        cells+='<div class="gc'+(it?' fill':'')+'" onclick="placeCell('+r+','+c+')">'+(it?furnSvg(it.itemId,{fit:true}):'')+'</div>'; }
      const pal=ITEM_CATALOG.map(it=>'<button class="pitem'+(_selItem===it.id?' on':'')+'" onclick="selItem(\''+it.id+'\')">'+furnSvg(it.id,{h:26})+'<span>'+it.name+'</span><span class="pq">남은 '+itemRemaining(it.id)+'</span></button>').join('');
      return '<div class="editwrap"><div class="grid12">'+cells+'</div><div class="palette">'+pal+'</div>'+
        '<div class="hintline"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>가구를 골라 빈 칸을 탭해 놓고, 놓인 가구를 탭하면 회수돼요.</div></div>';
    }
    function missionRow(m){
      const claimed=missionClaimed(m), ok=m.check();
      let right;
      if(claimed) right='<span class="mdone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>수령완료</span>';
      else if(ok) right='<button class="claim" onclick="claimMission(\''+m.id+'\')">수령</button>';
      else right='<span class="prog-pill">'+(m.prog?m.prog():'진행 중')+'</span>';
      return '<div class="cmrow"><span class="cmi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+m.icon+'</svg></span>'+
        '<div class="cmm"><b>'+m.name+'</b><span class="rw"><span class="ci">'+coinSvg({h:14})+'</span>+'+m.reward+(claimed?' · 수령완료':(ok?' · 완료':(m.prog?' · '+m.prog():'')))+'</span></div>'+right+'</div>';
    }
    function catMissionHtml(){
      let h='<div class="coinhero"><span class="ch-big">'+coinSvg({h:44})+'</span><div><div class="k">보유 은화</div><div class="v">'+coins().toLocaleString()+'</div></div></div>';
      h+='<div class="sech"><span class="l">일일 미션</span><span class="s">자정 초기화</span></div>';
      h+=DAILY_MISSIONS.map(missionRow).join('');
      h+='<div class="sech"><span class="l">주간 미션</span><span class="s">월요일 초기화</span></div>';
      h+=WEEKLY_MISSIONS.map(missionRow).join('');
      h+='<div class="note" style="margin-top:12px;"><b>은화</b>로 상점에서 고양이·가구를 사세요. 일일은 자정, 주간은 월요일(KST) 초기화됩니다.</div>';
      return h;
    }
