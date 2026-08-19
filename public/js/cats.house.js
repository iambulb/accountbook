    // ================= 고양이집 시트 (홈 · 알뜰샵 · 미션) =================
    let _catTab='home';
    function openCatHouse(tab){ _catTab=tab||'home'; renderCatHouse(); }
    function setCatTab(t){ _catTab=t; renderCatHouse(); }
    function openShop(){ _catTab='shop'; renderCatHouse(); }
    function goGachaShop(){ _shopSub='event'; openShop(); }   // 가방 등에서 가챠 탭으로 이동(보유 알/박스는 거기서 열기)
    function goRainbowShop(){ _gachaTab='rainbow'; lsSet('gachaTab','rainbow'); goGachaShop(); }   // 🌈 소식 배너 → 알뜰샵 가챠 무지개 탭
    // 🌈 소식(공지) 이벤트 섹션의 무지개알 배너 — 라이브 무지개 배너의 밤 씬+센터피스를 재사용(뽑기 버튼 없음, 탭하면 무지개 탭으로 이동). 확률·천장 문구는 상수 참조(단일 소스).
    function rainbowNewsBanner(){ try{
      const fx='<span class="gb-rbaura">'+lightLayers({aura:98,rays:118,rainbow:true})+'</span>'+fxAuraTwinkles(9,true);
      const center=(typeof rbEgg2Html==='function')?rbEgg2Html(52):rainbowEggSvg({h:52});
      return '<div class="pickbanner pk-rbn" role="button" tabindex="0" '+App.view.act('goRainbowShop')+' aria-label="무지개알 뽑으러 가기">'+
        '<div class="pk-head"><span class="pk-title tier-rainbow">🌈 무지개알 · 밤</span><span class="pk-tag"><b class="tier-rainbow">✦ 별빛 너머에서 찾아온 친구</b></span></div>'+
        '<div class="gb-scene">'+nightSceneHtml()+gbCenterHtml(center, fx, 'gb-rb gb-glow')+'</div>'+
        '<div class="pk-go"><span class="ci">'+rainbowCoinSvg({h:13})+'</span>무지개동전 '+RAINBOW_PRICE_RBC+'개로 1뽑 · <b>미공개 한정</b>도 전부 — 탭해서 뽑으러 가기 →</div></div>';
    }catch(e){ return ''; } }
    // 알뜰 아이콘 = 소식 전용 화면(탭 없음). 미션은 더보기 '미션'으로 분리.
    function openNews(){ markNewsSeen(); openSheet('소식', catNewsHtml()); if(typeof pkObserveScenes==='function') pkObserveScenes(); }   // 🌈 무지개알 배너 밤 씬 오프스크린 정지 관찰
    function openMissions(){ openSheet('오늘의 미션', catMissionHtml()); }
    // A4: 화면 밖 픽업 씬의 CSS 애니(구름·나무·꽃·나비 ~90개)를 정지 — 안 보일 때 GPU/배터리 부담을 덜어준다. IntersectionObserver로 .pk-idle 토글. observe는 멱등이라 여러 번 호출해도 안전.
    let _pkIO=null;
    function pkObserveScenes(){ try{
      if(typeof reducedMotion==='function' && reducedMotion()) return;   // 모션 최소화면 이미 정지(관찰 불필요)
      if(typeof IntersectionObserver==='undefined') return;
      if(!_pkIO) _pkIO=new IntersectionObserver(function(ents){ ents.forEach(function(e){ const idle=!e.isIntersecting; e.target.classList.toggle('pk-idle', idle);
        try{ e.target.querySelectorAll('svg').forEach(function(s){ if(idle){ if(s.pauseAnimations) s.pauseAnimations(); } else if(s.unpauseAnimations) s.unpauseAnimations(); }); }catch(_e){}   // 🌈 CSS play-state로 안 멈추는 무지개 SMIL을 화면 밖에서 정지/재개
      }); });
      _pkIO.disconnect();   // 교체·제거된 옛 씬의 관찰 누적 방지 — 현재 문서의 씬만 다시 등록(호출부 소수라 안전)
      document.querySelectorAll('.pkscene:not(.pk-reveal)').forEach(function(el){ if(el.closest && el.closest('#catFx')) return; _pkIO.observe(el); });   // 리빌·FX 내부(전체화면)는 항상 보이니 제외
    }catch(e){} }
    // 💰 알뜰샵 잔액 위젯 — 시트 제목(.sheet-head) 오른쪽에 금화·은화 표기(기존 상단 coinbar 대체).
    function shopHeadWalletHtml(){ return '<span class="shophw-c" title="은화">'+coinSvg({h:15})+'<b>'+coins().toLocaleString()+'</b>'+(atMaxCoins()?maxChip():'')+'</span>'+
      '<span class="shophw-c" title="금화">'+goldSvg({h:15})+'<b>'+gold().toLocaleString()+'</b>'+(atMaxGold()?maxChip():'')+'</span>'+
      '<span class="shophw-c" title="무지개동전">'+rainbowCoinSvg({h:15})+'<b>'+((typeof rbcoins==='function')?rbcoins():0).toLocaleString()+'</b></span>'; }   // 은화·금화·무지개동전 순(사용자 지침)
    function updateShopHeadWallet(){ if(typeof document==='undefined') return; const head=document.querySelector('#sheet .sheet-head'); if(!head) return;
      let el=head.querySelector('.shophw');
      if(_catTab!=='shop'){ if(el) el.remove(); return; }   // 알뜰샵 탭에서만 표기
      if(!el){ el=document.createElement('div'); el.className='shophw'; head.insertBefore(el, head.querySelector('.x')); }
      el.innerHTML=shopHeadWalletHtml(); }
    function renderCatHouse(){
      if(!state.game) state.game=normalizeGame(null);   // 스냅샷 도착 전 안전 가드
      const build=()=>{
        // 상단 고정(sticky): 알뜰샵=은화/금화 잔액+서브탭 / 알뜰홈=홈·배치 탭. 알뜰샵·잔액은 더보기의 별도 '알뜰샵' 화면(openShop)으로 분리.
        const isShop=_catTab==='shop';
        let h='<div class="cathead">';
        // 💰 알뜰샵 잔액(금화·은화)은 시트 제목 오른쪽(updateShopHeadWallet)으로 이동 — 여기선 홈/배치 탭 세그만.
        if(!isShop){ h+='<div class="catseg">'+[['home','홈'],['pet','펫'],['place','배치']].map(function(t){ return '<button class="'+(_catTab===t[0]?'on':'')+'" '+App.view.act('setCatTab',t[0])+'>'+t[1]+'</button>'; }).join('')+'</div>'; }
        if(isShop) h+=shopSubsegHtml();   // 알뜰샵 서브탭(sticky 헤더 안)
        h+='</div>';   // .cathead 닫기(여기까지 sticky)
        if(!isShop) h+=roomStripHtml();   // 🏠 룸 스위처 1회 렌더(홈·펫·배치 공용) — 이전엔 홈/배치가 각자 그려 중복(펫 탭엔 없었음). 헤더 바로 아래·본문 위.
        if(isShop) h+='<div class="shopwrap">'+catShopHtml()+'</div>';   // min-height로 탭마다 시트 높이 동일(소비처럼 항목 적어도 안 줄어듦)
        else if(_catTab==='place') h+=catPlaceHtml();
        else if(_catTab==='pet') h+=catPetHtml();
        else h+=catHomeHtml();   // home(및 미상 탭) → 홈
        return h;
      };
      openSheet(_catTab==='shop'?'알뜰샵':'알뜰홈', build());
      updateShopHeadWallet();   // 알뜰샵: 잔액을 시트 제목 오른쪽에 표기
      state._sheetRefresh=()=>{ if(_drag||_pal||_rmDrag||_wdrag||_wpal) return;   // 드래그(배치) 중엔 재렌더 스킵 — 드래그 요소가 뜯겨 스크롤 잠금이 남는 것 방지(드래그 끝나면 배치 커밋이 다시 리프레시)
        const b=$('sheetBody'); if(!b) return; const st=b.scrollTop;
        const pal=b.querySelector('.palette'); const palL=pal?pal.scrollLeft:0;   // 배치 팔레트(가로 스크롤) 위치 보존 — 스크롤해 아이템 선택 시 처음으로 안 튀게(우리집 펫은 세로 그리드라 세로 scrollTop만 보존)
        const rms=b.querySelector('.rmstrip'); const rmsL=rms?rms.scrollLeft:0;   // 룸 스위처 가로 스크롤 위치 보존(뒤쪽 방 탭 시 맨 앞으로 안 튀게)
        const keepGrid=(_catTab==='pet')?b.querySelector('#petGrid'):null;   // 펫 탭: 기존 펫 그리드 노드 보존(빈 placeholder로 되붙여 수백 타일 재파싱·이미지 리로드 회피)
        b.innerHTML=build();
        if(_catTab==='pet'){ const ph=b.querySelector('#petGrid'); if(keepGrid && ph) ph.replaceWith(keepGrid); renderPetGrid(); }   // 되살린 그리드에 바뀐 타일만 갱신(없으면 채움)
        b.scrollTop=st;
        const npal=b.querySelector('.palette'); if(npal) npal.scrollLeft=palL;
        const nrms=b.querySelector('.rmstrip'); if(nrms) nrms.scrollLeft=rmsL;
        if(_catTab==='home') mountRoomWalk(); pkObserveScenes(); updateShopHeadWallet(); };   // A4: 재빌드된 씬 재관찰 + 알뜰샵 잔액(구매 후) 갱신
      if(_catTab==='home') setTimeout(mountRoomWalk, 30);
      if(_catTab==='pet') renderPetGrid();
    }
    // 방 미니 미리보기 썸네일(프리셋): 벽지 bg + 가구 위치 축소 + 이름 + 펫수. 탭=전환, ✎=이름변경.
    function roomThumb(r, idx){
      const on=idx===roomIdx(); r=r||{};
      const placed=r.placed||{};
      const dots=Object.keys(placed).map(k=>{ const pr=k.split('_'), rr=+pr[0], cc=+pr[1], foot=itemFoot(placed[k].itemId);
        return '<i class="rmf" style="left:'+(gridLeftFrac(cc)*100).toFixed(1)+'%;top:'+(gridTopFrac(rr)*100).toFixed(1)+'%;width:'+(gridSpanFrac(foot.w)*100).toFixed(1)+'%;height:'+(gridRowSpanFrac(foot.h)*100).toFixed(1)+'%"></i>'; }).join('');
      // 벽 가구 점(평면 썸네일에선 '뒤 벽'=맨 위 얇은 띠에 열 위치로 표시, 색으로 구분)
      const wp=r.wallPlaced||{};
      const wdots=Object.keys(wp).map(k=>{ const pr=k.split('_'), cc=+pr[1], w=(itemFoot(wp[k].itemId).w);
        return '<i class="rmf rmfw" style="left:'+(gridLeftFrac(cc)*100).toFixed(1)+'%;top:1.5%;width:'+(gridSpanFrac(w)*100).toFixed(1)+'%;height:9%"></i>'; }).join('');
      const pets=(r.active||[]).filter(ownsCat).length;
      const rep=idx===(homeH().showRoom|0);   // 대표 방(친구·랭킹 노출)
      return '<div class="rmthumb'+(on?' on':'')+'" role="button" tabindex="0" aria-pressed="'+on+'" onpointerdown="rmDown(event,'+idx+')" '+App.view.act('rmTap',idx)+' title="'+escapeHtml(r.name||('방 '+(idx+1)))+(rep?' · 대표 방':'')+'">'+
        '<span class="rmscene" style="background:'+wallCss(r.wallpaper||'default')+'"><i class="rmfloorb" style="background:'+floorCss(r.floor||'default')+'"></i>'+wdots+dots+'</span>'+
        '<button class="rmfav'+(rep?' on':'')+'" aria-pressed="'+rep+'" aria-label="'+(rep?'대표 방(친구에게 보임)':'이 방을 대표 방으로 지정')+'" title="'+(rep?'대표 방 · 친구에게 보임':'대표 방으로 지정 ★')+'" onclick="event.stopPropagation();favRoom('+idx+',event)">'+starSvg({h:14,off:!rep})+'</button>'+
        '<span class="rmbar"><span class="rmname">'+(r.emoji?r.emoji+' ':'')+escapeHtml(r.name||('방 '+(idx+1)))+'</span><span class="rmpets">🐾'+pets+'</span></span>'+
        '<button class="rm-edit" aria-label="방 관리" onclick="event.stopPropagation();openRoomMenu('+idx+')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>'+
      '</div>';
    }
    function roomStripHtml(){
      const rooms=homeH().rooms||[], rc=roomCount();
      let h='<div class="sech"><span class="l">내 방</span><span class="s">'+rc+' / '+MAX_ROOMS+'</span></div><div class="rmstrip">';
      for(let i=0;i<rc;i++) h+=roomThumb(rooms[i]||{},i);
      if(rc<MAX_ROOMS) h+='<button class="rmthumb locked" '+App.view.act('buyRoom')+' aria-label="방 확장(금화 '+ROOM_PRICE+')"><span class="rmlock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span><span class="rmgold">'+goldSvg({h:12})+ROOM_PRICE+'</span></button>';
      h+='</div>';
      // 범례: '지금 보는 방(파란 테두리)'과 '친구에게 보이는 대표 방(★)'을 구분해 혼동 방지(#4). 별을 눌러 대표 방 지정.
      h+='<p class="rmhint muted">지금 보는 방 <span class="rmhint-cur"></span> · 친구·랭킹이 보는 <b>대표 방</b> <span class="rmhint-star">'+starSvg({h:11})+'</span> <span class="rmhint-x">— 별을 눌러 지정</span></p>';
      // 빈 대표 방 경고(#3): 대표 방에 가구·펫이 하나도 없으면 친구·랭킹에 빈 방으로 보이므로 안내.
      const repI=Math.min(rc-1, Math.max(0, (homeH().showRoom|0))), repR=rooms[repI]||{};
      const repEmpty=!(repR.placed && Object.keys(repR.placed).length) && !(repR.wallPlaced && Object.keys(repR.wallPlaced).length) && !((repR.active||[]).filter(ownsCat).length);
      if(repEmpty) h+='<p class="rmwarn"><span class="rmwarn-star">'+starSvg({h:11})+'</span> 대표 방이 비어 있어요 — 친구·랭킹에 <b>빈 방</b>으로 보여요. 가구·펫을 배치하거나 꾸민 방을 대표(★)로 지정하세요.</p>';
      return h;
    }
    // ===== 우리집 펫 리스트 정렬·검색(수백 마리 관리) =====
    // 브라우징 선택(탭·정렬) 유지 — 프라이빗 모드/차단 시 안전(try). 도감/상점/개발자 탭도 공유.
    function lsGet(k, def){ try{ const v=localStorage.getItem(k); return v==null?def:v; }catch(e){ return def; } }
    function lsSet(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
    let _petSort=lsGet('petSort','placed'), _homeSpecies=lsGet('homeSpecies','all'), _petTier=lsGet('petTier','all'), _petSearch='';   // 홈/펫 탭: 정렬(기본=이 방 배치 우선) + 종류 탭 + 등급 필터 + 이름 검색(세션)
    try{ if(localStorage.getItem('petSortV')!=='1'){ if(_petSort==='recent') _petSort='placed'; localStorage.setItem('petSort',_petSort); localStorage.setItem('petSortV','1'); } }catch(e){}   // 🔀 '이 방 배치 우선' 기본값 도입(2026-07) — 구 기본값 recent 쓰던 기기 1회 전환
    const PET_SORTS=[['placed','이 방 우선'],['recent','최신순'],['aff','애정도순'],['tier','등급순'],['name','이름순']];   // 🏠 기본=이 방 배치 우선(정렬 고르면 순수 정렬로 풀림)
    function setPetSort(v){ _petSort=v||'recent'; lsSet('petSort',_petSort); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    function setHomeSpecies(s){ _homeSpecies=s||'all'; lsSet('homeSpecies',_homeSpecies); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    function setPetSearch(v){ _petSearch=(v||'').trim(); renderPetGrid(); }   // 그리드만 갱신 → 검색 입력 포커스 유지(시트 통째 재렌더 안 함)
    function setPetTier(v){ _petTier=v||'all'; lsSet('petTier',_petTier); renderPetGrid(); }
    function toggleCatFav(id){ if(!ownsCat(id)) return; gameRef().transaction(function(g){ g=normalizeGame(g); const c=g.owned.cats[id]; if(!c) return; c.fav=!c.fav; return g; }).then(function(r){ if(r&&r.committed){ if(state._sheetRefresh) state._sheetRefresh(); } }); }   // 즐겨찾기 → 상단 고정(정렬 fav-first). owned.cats[id].fav (normalizeGame이 값 보존)
    // 보유 펫 정렬 — recent(최신 획득=boughtAt)·aff(애정도)·tier(등급, 상위 먼저).
    function sortOwnedPets(ids){ const l=ids.slice();
      const curAct=(((homeH().rooms||[])[roomIdx()]||{}).active)||[]; const inRoom={}; curAct.forEach(id=>{ inRoom[id]=1; });   // 🏠 현재 보고 있는 방에 배치된 펫(O(1) 조회)
      const fav=id=>((ownedCatsMap()[id]||{}).fav?1:0), rank=id=>tierRank(CAT_TIER[id]||'normal'), aff=id=>Number((ownedCatsMap()[id]||{}).affection)||0, bat=id=>((ownedCatsMap()[id]||{}).boughtAt)||'', nm=id=>catName(id)||'', here=id=>(inRoom[id]?1:0);
      if(_petSort==='placed') l.sort((a,b)=> here(b)-here(a) || fav(b)-fav(a) || bat(b).localeCompare(bat(a)));   // 🏠 이 방 배치 우선(최상단) → 즐겨찾기 → 최신. 정렬을 고르면 이 모드가 풀리고 아래 순수 조건 정렬.
      else if(_petSort==='tier') l.sort((a,b)=> fav(b)-fav(a) || rank(b)-rank(a) || bat(b).localeCompare(bat(a)));
      else if(_petSort==='aff') l.sort((a,b)=> fav(b)-fav(a) || aff(b)-aff(a) || nm(a).localeCompare(nm(b)));
      else if(_petSort==='name') l.sort((a,b)=> fav(b)-fav(a) || nm(a).localeCompare(nm(b),'ko'));
      else l.sort((a,b)=> fav(b)-fav(a) || bat(b).localeCompare(bat(a)));   // recent (즐겨찾기 항상 먼저)
      return l; }
    function petSpeciesOf(id){ const c=PET_CATALOG.find(x=>x.id===id); return (c&&c.species)||'cat'; }
    function homeFilteredPets(){ let o=ownedCatList();
      if(_homeSpecies!=='all') o=o.filter(id=>petSpeciesOf(id)===_homeSpecies);
      if(_petTier!=='all') o=o.filter(id=>(CAT_TIER[id]||'normal')===_petTier);
      if(_petSearch){ const q=_petSearch.toLowerCase(); o=o.filter(id=>(catName(id)||'').toLowerCase().indexOf(q)>=0); }
      return o; }
    // 종류 탭(보유 종만 + 개수 배지) — 도감/알뜰샵 종 탭과 같은 방식(SPECIES_LABEL 순).
    function homeSpeciesTabs(){ const owned=ownedCatList(); const cnt={}; owned.forEach(id=>{ const s=petSpeciesOf(id); cnt[s]=(cnt[s]||0)+1; });
      const order=Object.keys(SPECIES_LABEL); const present=Object.keys(cnt).sort((a,b)=>{ const ia=order.indexOf(a),ib=order.indexOf(b); return (ia<0?99:ia)-(ib<0?99:ib); });
      return [['all','전체',owned.length]].concat(present.map(s=>[s,(SPECIES_LABEL[s]||s),cnt[s]])); }
    function petCtlBar(){ const tabs=homeSpeciesTabs(); if(!tabs.some(t=>t[0]===_homeSpecies)) _homeSpecies='all';
      let h=(tabs.length>2)?('<div class="subseg pettabs">'+tabs.map(t=>'<button class="'+(_homeSpecies===t[0]?'on':'')+'" '+App.view.act('setHomeSpecies',t[0])+'>'+escapeHtml(t[1])+' <b>'+t[2]+'</b></button>').join('')+'</div>'):'';
      h+='<div class="petctl">'
        +'<input class="petsearch" type="search" inputmode="search" placeholder="이름 검색" value="'+escapeHtml(_petSearch)+'" oninput="setPetSearch(this.value)" aria-label="펫 이름 검색">'
        +'<select class="petsort" aria-label="등급 필터" onchange="setPetTier(this.value)">'+[['all','전체 등급']].concat(TIERS.map(t=>[t.id,t.name])).map(o=>'<option value="'+o[0]+'"'+(_petTier===o[0]?' selected':'')+'>'+escapeHtml(o[1])+'</option>').join('')+'</select>'
        +'<select class="petsort" aria-label="펫 정렬" onchange="setPetSort(this.value)">'+PET_SORTS.map(o=>'<option value="'+o[0]+'"'+(_petSort===o[0]?' selected':'')+'>'+o[1]+'</option>').join('')+'</select>'
      +'</div>';
      return h; }
    // ===== 우리집 펫 그리드: 타일 단위 메모이즈(수백 마리 재파싱·이미지 리로드 회피) =====
    // 타일 콘텐츠 시그니처 — 상태(방)·현재방·애정레벨·이름이 바뀐 타일만 다시 그린다.
    function petTileSig(id){ const ro=petRoomIndex(id); const here=ro===roomIdx(); const rooms=homeH().rooms||[];
      const rnm=(ro>=0&&!here)?((rooms[ro]&&rooms[ro].name)||('방 '+(ro+1))):'';   // elsewhere일 때만 방이름 뱃지 표시 → 시그니처에 포함(방 전환/이름변경 시 필요한 타일만 갱신)
      const lv=affectionLevel((ownedCatsMap()[id]||{}).affection, CAT_TIER[id]||'normal').level; return (here?'H':ro)+'|'+rnm+'|'+lv+'|'+catName(id)+'|'+(CAT_TIER[id]||'normal')+'|'+((ownedCatsMap()[id]||{}).fav?'F':'')+'|'+petDyeOf(id); }   // tier·염색 포함(이름색·등급 연출·초상 톤이 의존 → 바뀌면 그 타일만 갱신)
    // 등급 배지(색약 접근성): 색이 아니라 '글자'로 등급 식별. 한정=무지개, 일반은 생략(기본), 그 외 등급색.
    function tierBadgeHtml(tier){ if(!tier || tier==='normal') return '';
      const ti=tierInfo(tier); const nm=escapeHtml(ti.name);
      if(tier==='exclusive') return '<span class="ptier tier-rainbow">'+nm+'</span>';
      return '<span class="ptier" style="color:'+ti.color+'">'+nm+'</span>'; }
    // 🖐 펫 인벤토리 배치모드(기본 OFF, 사용자 지침) — OFF: 탭=펫 정보(오탭으로 펫이 방에 들어가는 것 방지) / ON: 탭=이 방으로/대기 토글(기존 동작)
    let _petPlaceMode=false;
    function petTileTap(id){ if(_petPlaceMode) toggleActiveCat(id); else openPetInfo(id); }
    function togglePetPlaceMode(){ _petPlaceMode=!_petPlaceMode;
      toast(_petPlaceMode?'배치모드 ON — 펫을 탭하면 이 방으로 데려오거나 대기시켜요':'배치모드 OFF — 펫을 탭하면 정보를 볼 수 있어요');
      if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    function petTileHtml(id){
      const rooms=homeH().rooms||[]; const roomOf=petRoomIndex(id), here=roomOf===roomIdx();
      const roomNm=roomOf>=0?((rooms[roomOf]&&rooms[roomOf].name)||('방 '+(roomOf+1))):'';
      const tier=CAT_TIER[id]||'normal'; const lv=affectionLevel((ownedCatsMap()[id]||{}).affection, tier).level; const fav=!!(ownedCatsMap()[id]||{}).fav;
      const stt=here?'이 방':(roomOf>=0?roomNm:'대기');
      // 🖐 탭 동작은 배치모드에 따라 분기(petTileTap): OFF(기본)=펫 정보 열람, ON=이 방으로/대기 토글. ✎이름변경·ⓘ정보 아이콘 제거(사용자 지침 — 이름변경은 펫 정보 시트 안 pi-rename)
      return '<div class="catchip'+(here?' on':(roomOf>=0?' elsewhere':''))+'" data-id="'+id+'" data-tsig="'+escapeHtml(petTileSig(id))+'" data-name="'+escapeHtml(catName(id))+'" role="button" tabindex="0" aria-pressed="'+here+'" '+App.view.act('petTileTap',id)+' title="'+escapeHtml(catName(id))+' · '+escapeHtml(tierInfo(tier).name)+' · '+escapeHtml(stt)+' · Lv.'+lv+'">'+
        '<button class="cn-fav'+(fav?' on':'')+'" aria-label="'+(fav?'즐겨찾기 해제':'즐겨찾기')+'" onclick="event.stopPropagation();toggleCatFav(\''+id+'\')">'+starSvg({h:12,off:!fav})+'</button>'+
        '<div class="cpic tbring tb-'+tier+'">'+catFace(id,{h:44})+tierBadgeHtml(tier)+'</div>'+   // 등급 테두리 + 등급명 배지(좌하단)
        (roomOf>=0&&!here?'<span class="croom">'+escapeHtml(roomNm)+'</span>':'')+
        (here?'<span class="csel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></span>':'')+
        '<div class="cn">'+catNameSpan(id,catName(id))+'</div>'+
        '<div class="clv'+(lv>=5?' lv5':'')+'" aria-label="애정 레벨 '+lv+(lv>=5?' 만렙':'')+'"><span class="clv-h">'+heartSvg({h:9})+'</span>Lv.'+lv+(lv>=5?'<span class="clv-max">★</span>':'')+'</div>'+
      '</div>';
    }
    // #petGrid 갱신: 정렬 순서가 같으면 시그니처 바뀐 타일만 교체(in-place, 펫 탭=1개만), 순서 바뀌면(정렬 변경) 통째로.
    function renderPetGrid(){
      const el=$('petGrid'); if(!el) return;
      const ids=sortOwnedPets(homeFilteredPets());   // 종류 탭으로 걸러 정렬
      if(!ids.length){ el.removeAttribute('data-order'); el.style.maxHeight=''; el.classList.remove('scroll4');
        const flt=(_petSearch||_petTier!=='all'); el.innerHTML='<div class="empty pgempty">'+(flt?'검색·필터 결과가 없어요 🔍':'이 종류의 펫이 없어요 🐾 <button class="btn ghost" '+App.view.act('setCatTab','shop')+'>알뜰샵</button>')+'</div>'; return; }
      const orderSig=_petSort+'|'+_homeSpecies+'|'+ids.join(',');
      if(el.getAttribute('data-order')===orderSig && el.childElementCount===ids.length){
        const kids=el.children;
        for(let i=0;i<ids.length;i++){ const id=ids[i], c=kids[i]; if(c.getAttribute('data-tsig')!==petTileSig(id)){
          const tmp=document.createElement('div'); tmp.innerHTML=petTileHtml(id); const nn=tmp.firstElementChild; if(nn) el.replaceChild(nn,c); } }
      } else {
        el.setAttribute('data-order', orderSig);
        el.innerHTML=ids.map(petTileHtml).join('');
      }
      fitPetGridRows(el);   // 4행까지 보이고 그 아래는 내부 스크롤
    }
    // 펫 그리드를 정확히 4행 높이로 제한(초과 시 내부 스크롤). 카드 높이는 aspect-ratio라 이미지 로딩과 무관하게 즉시 확정.
    function fitPetGridRows(el){
      const first=el.querySelector('.catchip'); const rows4=4; if(!first){ el.style.maxHeight=''; el.classList.remove('scroll4'); return; }
      const cols=(getComputedStyle(el).gridTemplateColumns||'').split(' ').filter(Boolean).length||5;
      if(Math.ceil(el.childElementCount/cols)<=rows4){ el.style.maxHeight=''; el.classList.remove('scroll4'); return; }
      el.classList.add('scroll4');   // 트레이 패딩·테두리가 적용된 뒤 높이 계산(패딩만큼 4행이 잘리지 않게)
      const cs=getComputedStyle(el), gap=parseFloat(cs.rowGap||cs.gap)||7;
      const padY=(parseFloat(cs.paddingTop)||0)+(parseFloat(cs.paddingBottom)||0)+(parseFloat(cs.borderTopWidth)||0)+(parseFloat(cs.borderBottomWidth)||0);
      const ch=first.offsetHeight; if(ch>0) el.style.maxHeight=(ch*rows4+gap*(rows4-1)+padY+2)+'px';
    }
    function catHomeHtml(){
      reconcilePets();   // 지속시간 지난 그릇 비우고 똥 정산(멱등)
      const cats=activeCats();
      // 배치된 가구를 방 바닥에 매핑. 그릇=탭 급여·채움 반영, 화장실=똥 수거(공용 헬퍼).
      const list=placedList().sort((a,b)=>a.r-b.r); distributePoops(list);
      const litters=list.filter(p=>p.itemId==='litterbox');
      const spH=splitProps(list, p=>propMarkup(p,false,false,true));   // 바닥 아이템(러그·연못) 먼저 → 맨 아래
      const props=spH.floor+wallPlacedList().map(p=>wallPropMarkup(p,false,true)).join('')+spH.other+dropsHtml(room(), curRoomId());   // 바닥 아이템 → 벽 가구(뒤) + 일반 가구 + 🎁드랍. live=true → 홈 LIVE 캠 연출
      const roomName=(room().name)||'우리집';
      let h='<div class="catroom" id="catRoom">'+roomShellBase(currentWall(), currentFloor())+'<span class="cr-cam"><i></i>LIVE · '+escapeHtml(roomName)+'</span>'+batchBtnHtml()+'<div class="cr-props">'+props+'</div><div class="cr-stage" id="crStage"></div>'+roomOverlay(currentBgfx())+'</div>';
      // 빈 방(가구·펫 없음) 안내 — 방 확장 직후 '사라진 것처럼' 보이는 혼동 방지
      if(!list.length && !cats.length) h+='<div class="hintline" style="margin:8px 0 0;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>새 방이에요! <b>펫</b> 탭에서 <b>펫을 이 방으로 데려오고</b>, <b>배치</b> 탭에서 가구를 놓아보세요. (다른 방과 따로 저장돼요)</div>';
      // 안내: 그릇 채우기 / 똥 수거 — 완전 빈 새 방(가구·펫 없음)에선 위 '새 방' 안내만 두고 생략(힌트 3장 적층 방지, 채울 그릇도 없음)
      const poops=room().poops||0;
      if(list.length || cats.length) h+='<div class="hintline" style="margin:8px 0 0;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>밥·물 그릇을 탭해 채우고(6시간 뒤 비워짐), 쌓인 <b>똥을 탭해 치우면 +'+POOP_REWARD+' 은화</b>'+(poops&&!litters.length?' · 화장실을 놓아야 똥을 치울 수 있어요':'')+'.</div>';
      const owned=ownedCatList();
      const sc=slotCount();
      h+='<div class="sech"><span class="l">이 방 펫</span><span class="s">'+cats.length+' / '+sc+' 활성</span></div>';
      // 활성 슬롯 표시: 채워진 슬롯 + (미확장 시) 오른쪽에 잠금 슬롯 — 탭하면 금화 SLOT_PRICE로 확장
      let slotRow='<div class="slotrow">';
      for(let i=0;i<sc;i++){ const cid=cats[i]; slotRow+='<div class="slot'+(cid?' filled':'')+'">'+(cid?catFace(cid,{h:38}):'')+'</div>'; }
      if(sc<MAX_SLOTS) slotRow+='<button class="slot locked" '+App.view.act('buySlot')+' aria-label="고양이 슬롯 확장(금화 '+SLOT_PRICE+')"><svg class="lockic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg><span class="slotgold">'+goldSvg({h:13})+SLOT_PRICE+'</span></button>';
      slotRow+='</div>';
      h+=slotRow;
      // 펫 컬렉션 관리(수백 마리 그리드)는 '펫' 탭으로 분리 — 홈은 이 방의 활성 펫·돌봄만(홈 과부하 해소).
      if(!owned.length) h+='<div class="empty" style="padding:16px 20px;">아직 펫이 없어요. 알뜰샵에서 입양해 보세요 🐾 <button class="btn ghost" '+App.view.act('setCatTab','shop')+'>알뜰샵</button></div>';
      else h+='<div class="hintline" style="margin-top:8px;align-items:center;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg><span style="flex:1"><b>펫</b> 탭에서 <b>배치모드</b>를 켜고 탭하면 이 방으로 데려와요.'+(sc<MAX_SLOTS?' 잠금 슬롯은 금화 '+SLOT_PRICE+'로 확장.':'')+'</span><button class="btn ghost" style="flex:none" '+App.view.act('setCatTab','pet')+'>펫 관리 →</button></div>';
      return h;
    }
    // 🐾 '펫' 탭 — 우리집 펫 컬렉션 관리(홈에서 분리). 종류 탭+정렬+수백 마리 그리드. 탭=이 방으로 데려오기/대기.
    function catPetHtml(){
      const owned=ownedCatList(), sc=slotCount();
      if(!owned.length) return '<div class="empty" style="padding:20px;">아직 펫이 없어요. 알뜰샵에서 입양해 보세요 🐾 <button class="btn ghost" '+App.view.act('setCatTab','shop')+'>알뜰샵</button></div>';
      let h='<div class="sech"><span class="l">우리집 펫</span><span class="s">'+owned.length+'마리</span>'+
        '<span class="pmode" role="switch" aria-checked="'+(_petPlaceMode?'true':'false')+'" '+App.view.act('togglePetPlaceMode')+' title="배치모드 — ON이면 탭해서 방에 배치, OFF면 탭해서 펫 정보">'+
        '<b>배치모드</b><span class="switch'+(_petPlaceMode?' on':'')+'" role="presentation" aria-hidden="true"><i></i></span></span></div>';   // 바깥 .pmode가 스위치 역할 — 안쪽은 장식(a11yDecorate 이중 포커스 방지)
      if(owned.length>=2) h+=petCtlBar();   // 종류 탭 + 정렬(2마리↑부터)
      // 수집형 인벤토리 그리드(5열·세로, 4행까지 보이고 초과 시 내부 스크롤). renderPetGrid가 채우고 타일 단위 메모이즈(수백 마리 재파싱 회피).
      h+='<div class="catchips" id="petGrid"></div>';
      h+='<div class="hintline" style="margin-top:10px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>'+
        (_petPlaceMode
          ?'배치모드 ON — 펫을 탭하면 <b>이 방</b>으로 옮겨져요(한 펫은 한 방에만, 방당 최대 '+sc+'마리). 다시 탭하면 대기.'+(sc<MAX_SLOTS?' 잠금 슬롯은 금화 '+SLOT_PRICE+'로 확장.':'')
          :'펫을 탭하면 <b>정보</b>(애정도·코스메틱·이름변경)를 볼 수 있어요. 방에 배치하려면 위 <b>배치모드</b>를 켜세요.')+'</div>';
      return h;
    }
    function mountRoomWalk(){
      const stage=$('crStage'); if(!stage) return;
      const list=activeCats().slice(0,slotCount());
      ensurePetArtMany(list);   // 방에 보이는 소유 펫 아트 선로드(지연)
      stage.dataset.hh=64;
      const sig='c:'+list.map(id=>id+'~'+cosmSig(id)).join(',');   // 같은 고양이·코스메틱이면 재생성 안 함(애니메이션 유지)
      if(stage.dataset.sig===sig && stage.querySelector('.cd-actor')) return;
      stage.dataset.sig=sig;
      stage.innerHTML=list.map((id,i)=>{ const s=petActorPx(id,32,200); return '<div class="cd-actor" data-cat="'+id+'" data-hh="'+s+'" style="left:'+(20+i*64)+'px;">'+(hasSprite(id)?'<span class="cd-shadow">'+shadowSvg({h:Math.max(6,Math.round(s*0.16))})+'</span>'+actorCosmHtml(id,s):'')+catActorHTML(id,s)+'</div>'; }).join('');
      markCatDirty();   // 통합 엔진이 시트 방 무대를 자동으로 잡아 애니메이션
    }
    // ===== 친구 집(펫캠) — 남의 game으로 읽기전용 방 렌더 + 로밍(엔진 재사용) =====
    // 친구 game에서 활성 펫/가구 목록 도출(내 state.game 비참조). 친구의 '현재 방'을 본다(레거시 flat 폴백).
    // 친구/랭킹 캠은 '대표 방(showRoom)'을 보여준다(사적인 방 노출 방지). showRoom 없으면 current, 레거시는 flat.
    function friendRoom(fg){ const h=(fg&&fg.home)||{}; if(Array.isArray(h.rooms)&&h.rooms.length){ const i=Math.min(h.rooms.length-1, Math.max(0, (h.showRoom!=null?h.showRoom:h.current)|0)); return h.rooms[i]||h.rooms[0]; } return h; }
    function friendActiveCats(fg){ const a=friendRoom(fg).active||[]; const owned=(fg.owned&&fg.owned.cats); return a.filter(id=>(!owned||owned[id]) && PET_CATALOG.some(c=>c.id===id)); }   // homeCam 스냅샷은 owned가 없어 active를 신뢰하되 카탈로그에 있는(렌더 가능한) 펫만 — 삭제된 펫이 친구 캠에 폴백 팔레트 유령으로 뜨지 않게(내 방 activeCats와 동일 기준)
    function friendPlacedList(fg){ const p=friendRoom(fg).placed||{}; return Object.keys(p).map(k=>({ key:k, r:+k.split('_')[0], c:+k.split('_')[1], itemId:p[k].itemId, filledAt:p[k].filledAt||null, flip:!!p[k].flip })); }   // filledAt=먹기/마시기 클립 판정(furnClip)
    // 친구 방 HTML(.catroom + #frStage). name=친구 닉네임.
    function friendRoomHtml(fg, name){
      const wall=friendRoom(fg).wallpaper||'default';
      const spF=splitProps(friendPlacedList(fg).sort((a,b)=>a.r-b.r), p=>propMarkup(p,false,true,true));   // 바닥 아이템(러그·연못) 먼저 → 맨 아래
      const props=spF.floor+friendWallPlacedList(fg).map(p=>wallPropMarkup(p,false,true)).join('')+spF.other;   // 바닥 아이템 → 벽 가구(뒤) + 일반 가구. plain=true(읽기전용) + live=true(연출)
      return '<div class="catroom" id="friendRoom">'+roomShellBase(wall, friendRoom(fg).floor||'default')+
        '<span class="cr-cam"><i></i>LIVE · '+escapeHtml(name||'친구')+'의 집</span>'+
        '<div class="cr-props">'+props+'</div><div class="cr-stage" id="frStage"></div>'+roomOverlay((friendRoom(fg).bgfx)||'')+'</div>';
    }
    // 친구 방 무대에 친구 펫을 배치 → 통합 엔진(activeStage가 frStage 우선)이 로밍시킴.
    function mountFriendRoom(fg){
      const stage=$('frStage'); if(!stage) return;
      const list=friendActiveCats(fg).slice(0, Math.min(MAX_SLOTS, Math.max(BASE_SLOTS, (fg.home&&fg.home.slots)||BASE_SLOTS)));
      ensurePetArtMany(list);
      stage.dataset.hh=64;
      const pm=(fg&&fg.petsMeta&&typeof fg.petsMeta==='object')?fg.petsMeta:{};   // 💗 homeCam 스냅샷의 펫 메타(애정 레벨·코스메틱·염색) — 친구 캠 과시 요소
      state._frPetLv={}; list.forEach(function(id){ const m=pm[id]; state._frPetLv[id]=(m&&m.lv!=null)?(Number(m.lv)||0):null; });   // 💗 친구 펫 애정 레벨 → 모션 게이트가 친구 기준으로 판정(clipAffLocked)
      stage.innerHTML=list.map((id,i)=>{ const s=petActorPx(id,32,200); const meta=pm[id]||{lv:0}; return '<div class="cd-actor" data-cat="'+id+'" data-hh="'+s+'" style="left:'+(20+i*64)+'px;">'+(hasSprite(id)?'<span class="cd-shadow">'+shadowSvg({h:Math.max(6,Math.round(s*0.16))})+'</span>'+actorCosmHtml(id,s,meta):'')+catActorHTML(id,s,(meta.dye!=null?meta.dye:0))+'</div>'; }).join('');
      markCatDirty();
    }
    let _shopSub='event';   // 알뜰샵 진입 시 기본=가챠 탭(맨 왼쪽)
    function setShopSub(s){ if(['event','egg','box','rainbow','consum'].indexOf(s)<0) s='event'; _shopSub=s; _shopSelCat=null; renderCatHouse(); }   // 🚧 은화 구매 탭 제거 중 — 이벤트/펫알/랜덤박스/무지개/소비만 허용
    // 가챠 탭 내부 서브탭(뜰알/펫알/랜덤박스/무지개) — 종류별로 나눠 뽑기. 탭별 전용 배너: 이벤트(뜰알)=픽업 낮 씬·펫알=노을(연못)·랜덤박스=노을(선물상자)·무지개=밤.
    let _gachaTab=lsGet('gachaTab','ddeul');
    const GACHA_TABS=[['ddeul','픽업'],['normal','일반'],['rainbow','무지개']];   // 뜰알=픽업(구 '이벤트'), 펫알+랜덤박스=일반(합침), 무지개=그대로
    function setGachaTab(t){ _gachaTab=t||'ddeul'; lsSet('gachaTab',_gachaTab); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    let _normalSub=lsGet('normalSub','egg');   // '일반' 탭 안 서브구분: 펫알(egg)/랜덤박스(box)
    function setNormalSub(s){ _normalSub=(s==='box'?'box':'egg'); lsSet('normalSub',_normalSub); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    let _rbSub=lsGet('rbSub','egg');   // 🌈 무지개 탭 안 서브구분: 무지개알(egg)/무지개박스(box)
    function setRbSub(s){ _rbSub=(s==='box'?'box':'egg'); lsSet('rbSub',_rbSub); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    // 보유한 알/박스/뜰알 1종 열기 카드(선물·쿠폰·개발자 지급분, qty>0일 때만) — 각 가챠 서브탭 하단.
    function heldOpenCard(kind){
      const q=consumQty(kind); if(q<=0) return '';
      const M={ egg:['펫알','일반 확률로 열어요.',"useHeldGacha('egg')",eggSvg(0,{h:52})],
                box:['랜덤박스','일반 확률로 열어요.',"useHeldGacha('box')",boxSvg({h:46})],
                ddeul:['뜰알','한정 픽업 확률로 열어요.','useHeldDdeul()',ddeulEggSvg({h:52})] }, a=M[kind]; if(!a) return '';
      return '<div class="rb-hh">🎒 보유한 '+a[0]+' 열기</div><div class="shopcard"><div class="thumb">'+a[3]+'</div>'+
        '<div class="meta"><b'+(kind==='ddeul'?' class="tier-rainbow"':'')+'>'+a[0]+'</b><div class="desc">'+a[1]+'</div></div>'+
        '<div class="act"><button class="buy" aria-label="'+a[0]+' 열기" onclick="'+a[2]+'">열기</button><span class="qty">보유 '+q.toLocaleString()+'</span></div></div>';
    }
    // 🥚/📦 펫알·랜덤박스 구매 카드 1장(은화 100) — '일반' 탭에서 둘 다 씀.
    function gachaBuyCard(k){
      const nm=k==='egg'?'펫알':'랜덤박스', desc=k==='egg'?'알을 열면 펫이 랜덤으로!<br>등급이 높을수록 귀해요.':'상자를 열면 가구·구조물이 랜덤으로 나와요.', art=k==='egg'?eggSvg(0,{h:66}):boxSvg({h:56});
      const act=(coins()>=GACHA_PRICE)?'<button class="buy" aria-label="'+nm+' 구매('+GACHA_PRICE+' 은화)" '+App.view.act('openGacha',k)+'>구매</button>':'<button class="buy dis" disabled>'+(GACHA_PRICE-coins())+' 부족</button>';
      return '<div class="shopcard"><div class="thumb">'+art+'</div>'+
        '<div class="meta"><b>'+nm+'</b><div class="desc">'+desc+'</div>'+
        '<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+GACHA_PRICE+'</span></div>'+
        '<div class="act">'+act+pityChip(k)+'</div></div>';
    }
    // 가챠 서브탭별 콘텐츠. (배너 고도화는 탭별로 이 함수 안에서 확장)
    function gachaTabHtml(tab){
      let h='';   // (⚡ '빠른 연출' 기능은 완전 폐기 — 칩 제거 후 남은 fxFast 잔재가 1뽑 연출을 스킵시켜 fxFastOn까지 제거)
      if(tab==='ddeul'){
        h+=ddeulBannerHtml(true);   // 🌱 실제 뜰알 배너(재화 소모·펫 지급 실전 연결) — 쇼케이스+씬+아이템+1뽑/10뽑+확률
      } else if(tab==='normal'){   // 🥚📦 일반 = 펫알/랜덤박스 서브탭(각 실제 배너)
        if(_normalSub!=='egg'&&_normalSub!=='box') _normalSub='egg';
        h+='<div class="subseg normalsub">'+[['egg','펫알'],['box','랜덤박스']].map(function(t){ return '<button class="'+(_normalSub===t[0]?'on':'')+'" '+App.view.act('setNormalSub',t[0])+'>'+t[1]+'</button>'; }).join('')+'</div>';
        h+=(_normalSub==='egg'?eggBannerHtml(true):boxBannerHtml(true));   // 펫알=노을 배너(펫 지급)·랜덤박스=랜덤박스 배너(가구/바닥/벽지 지급)
      } else if(tab==='rainbow'){   // 🌈 무지개 = 알/박스 서브탭(각 라이브 밤 배너 — 개발자 밤 배너 기반, 펫 2마리 제외) + 무지개동전 잔액
        if(_rbSub!=='egg'&&_rbSub!=='box') _rbSub='egg';
        h+='<div class="subseg normalsub">'+[['egg','무지개알'],['box','무지개박스']].map(function(t){ return '<button class="'+(_rbSub===t[0]?'on':'')+'" '+App.view.act('setRbSub',t[0])+'>'+t[1]+'</button>'; }).join('')+'</div>';
        h+=rainbowLiveBannerHtml(_rbSub);
      }
      return h;
    }
    // 🌈 무지개알/무지개박스 라이브 배너(밤 씬) — 개발자 '밤 배너'(rainbowBannerHtml) 기반, 픽업 펫 2마리(devPickupStageHtml)만 제외하고 동일(사용자 지침).
    //    1뽑=무지개동전 5 · 10뽑=50, 미공개 한정 펫·아이템 전부 출현(rainbowCatTierMap / boxPool 한정 포함).
    function rainbowLiveBannerHtml(sub){
      const isEgg=(sub!=='box'), kind=isEgg?'rainbow_egg':'rainbow_box';
      const fx='<span class="gb-rbaura">'+lightLayers({aura:98,rays:118,rainbow:true})+'</span>'+fxAuraTwinkles(9,true);
      const center=isEgg?(_pkV2?rbEgg2Html(52):rainbowEggSvg({h:52})):rainbowBoxSvg({h:52});
      const nm=isEgg?'무지개알':'무지개박스';
      const desc=isEgg?'<b class="tier-limited">신화 80%</b> · <b class="tier-rainbow">한정 20%</b><br><b>미공개 한정 펫</b>도 전부 여기서 나와요 · '+RB_PITY_N+'뽑 안에 한정 확정!'
                      :'<b class="tier-limited">신화 80%</b> · <b class="tier-rainbow">한정 20%</b><br><b>미공개 한정 아이템</b>(가구·스킨·펫효과·모자)도 전부 · '+RB_PITY_N+'뽑 안에 한정 확정!';
      return '<div class="gbanner gb-rainbow"><div class="gb-head"><b class="gb-t tier-rainbow">🌈 '+nm+' · 밤</b><span class="pk-tag"><b class="tier-rainbow">✦ 별빛 너머에서 찾아온 친구</b></span></div>'+
        '<div class="gb-scene">'+nightSceneHtml()+gbCenterHtml(center, fx, 'gb-rb gb-glow')+'</div>'+
        '<div class="gb-item"><div class="gb-item-ic">'+(isEgg?(_pkV2?rbEgg2Html(52):rainbowEggSvg({h:52})):rainbowBoxSvg({h:52}))+'</div>'+
          '<div class="gb-item-meta"><b class="tier-rainbow">'+nm+' <span class="tagmini tier-rainbow">밤</span></b>'+
          '<div class="gb-item-desc">'+desc+'</div>'+
          '<div class="gb-item-cost">1뽑당 소모 <span class="ci">'+rainbowCoinSvg({h:14})+'</span>'+RAINBOW_PRICE_RBC+' · 보유 '+rainbowCoinSvg({h:12})+' <b>'+rbcoins().toLocaleString()+'</b></div></div></div>'+
        gbPullActions(kind, 0, 0, 'night', null, true, RAINBOW_PRICE_RBC)+rbPityChipHtml(kind)+'</div>';   // 🌈 5뽑 한정 확정 천장 칩
    }
    // ===== 🎰 가챠 배너(세로 확장·둥지형) — 실전은 가챠 탭(gachaTabHtml live=true → bannerPull/openGachaTen), 개발자 '배너 관리'는 무소모 미리보기. 탭별 전용 배너 분화 완료(뜰알=픽업·펫알=노을연못·랜덤박스=노을상자·무지개=밤). =====
    // 공통 조각(둥지+알·1/10 버튼·천장 안내). 각 배너 함수는 독립 인스턴스라 나중에 개별 수정 가능.
    function gbNestHtml(eggHtml){ return '<div class="gb-nest"><div class="gb-nestback">'+nestSvg({})+'</div><div class="gb-egg">'+eggHtml+'</div><div class="gb-nestfront">'+nestFrontSvg({})+'</div></div>'; }
    function gbActionsHtml(kind){ return '<div class="gb-actions"><button class="gb-btn" '+App.view.act('devBannerPull',kind,false)+'>1회 뽑기</button><button class="gb-btn gb-btn10" '+App.view.act('devBannerPull',kind,true)+'>10회 연속</button></div>'; }
    // 🌈 무지개 전용 천장 칩 — 5뽑 안에 한정 확정, 남은 뽑수 실시간
    function rbPityChipHtml(kind){ const left=pityRemain(pityGet(kind), RB_PITY_N);
      return '<div class="gb-pity"><span class="pity-chip">'+sparkSvg({h:11})+RB_PITY_N+'뽑 안에 <b>한정 확정</b> · 남은 <b>'+left+'뽑</b></span></div>'; }
    function gbPityHtml(kind){ const left=pityRemain(pityGet(kind), (typeof PITY_N!=='undefined'?PITY_N:100)); return '<div class="gb-pity"><span class="pity-chip">'+sparkSvg({h:11})+(typeof PITY_N!=='undefined'?PITY_N:100)+'번 안에 <b>신화 이상 확정</b> · 남은 <b>'+left+'뽑</b></span></div>'; }
    // 배너 공용 중앙 센터피스 — 뜰알 .pk-egg 위치(중앙 하단)에 아이콘/상자 + 반짝임 FX(도트). 둥지 대체.
    function gbCenterHtml(inner, fx, cls){ return '<div class="gb-center '+(cls||'')+'">'+(fx?'<span class="gb-cfx">'+fx+'</span>':'')+'<span class="gb-cicon">'+inner+'</span></div>'; }
    // 🏛️ 한정 픽업 초상 받침대(2단 포디움 + 금 트림) — 뜰알 스포트라이트 초상 발밑. 3톤(H/M/D)+외곽선(X)+금(G), 맨 윗줄 비움. PIL 검수.
    const M_PEDESTAL=["..............................","..XXXXXXXXXXXXXXXXXXXXXXXXXX..","..XHHHHHHHHHHHHHHHHHHHHHHHHX..","..XMGGGGGGGGGGGGGGGGGGGGGGMX..","..XDDDDDDDDDDDDDDDDDDDDDDDDX..","...........XMMMMDDX...........","...........XMMMMDDX...........","XHHHHHHHHHHHHHHHHHHHHHHHHHHHHX","XMGGGGGGGGGGGGGGGGGGGGGGGGGGMX","XDDDDDDDDDDDDDDDDDDDDDDDDDDDDX","XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"];   // v2: 넓고 낮은 전시 받침(30×11) — 초상 폭에 맞게 상판 확장(금트림)+목+전폭 베이스. PIL 검수.
    const PEDESTAL_PAL={H:'#f0e6c8',M:'#d6c496',D:'#a89264',X:'#6e5c36',G:'#f4d06b'};
    function pedestalSvg(opt){ return pxSvg(M_PEDESTAL, PEDESTAL_PAL, opt); }
    // 🌈 배너 알 공용 무지개 연출 — 무지개 오오라+광선(lightLayers rainbow) + 무지개 트윙클. 뜰알·펫알·랜덤박스 센터 공용.
    function gbRainbowFx(){ return '<span class="gb-rbaura">'+lightLayers({aura:98,rays:118,rainbow:true})+'</span>'+fxAuraTwinkles(9,true); }
    // 🏆 상단 한정 픽업 쇼케이스 — 큰 픽업 펫 초상(무지개 카드+받침대+조명빔+후광+별+이름) 양쪽 + 가운데 "이 펫만! 한정 픽업"(한 줄)·0.5% 태그.
    // 한정 픽업 확률(%) — DDEUL_TIERS의 exclusive p를 읽어 표기(하드코딩 불일치 방지, 확률 조정 시 자동 반영).
    function ddeulExPct(){ const t=(typeof DDEUL_TIERS!=='undefined')?DDEUL_TIERS.find(function(x){ return x.id==='exclusive'; }):null; return t?t.p:0.5; }
    function ddeulPickupShowcase(){
      const pets=activePickup().filter(pickupExists);   // 🔄 이번 주 픽업 2마리(매주 월요일 KST 자동 교체)
      const spot=(id)=> id ? '<div class="gb-spot" role="button" tabindex="0" aria-label="'+escapeHtml(catName(id))+' 미리보기" '+App.view.act('openPickupPeek',id)+'>'+
          '<span class="gb-spot-beam"></span>'+                                                       // 🔦 무대 조명 빔(위→아래)
          '<span class="gb-spot-badge">'+starSvg({h:14})+'</span>'+
          // 🌈 후광 FX는 카드 "안"(배경 위·펫 뒤 z0)에 둔다 — 카드가 불투명이라 밖(뒤)에 두면 스프라이트 폭에 따라 통째로 가려짐(우측 표범 오오라 안 보이던 버그)
          '<div class="gb-spot-card"><span class="gb-spot-fx">'+lightLayers({aura:96, rays:80, rainbow:true})+fxAuraTwinkles(4,true)+'</span><span class="gb-spot-face">'+catFace(id,{h:60,eager:true})+'</span><span class="gb-spot-ped">'+pedestalSvg({h:24})+'</span></div>'+   // 무지개 카드 안 초상+받침대(h24→폭≈65px)
          '<span class="gb-spot-name">'+catNameSpan(id,catName(id))+'</span>'+
        '</div>' : '<div class="gb-spot gb-spot-empty"></div>';
      const title='<div class="gb-ddeul-title">'+
          '<span class="pk-title tier-rainbow">✨ 이 펫만 한정 픽업!</span>'+
          '<span class="gb-ddeul-sub tagmini tier-rainbow">한정 '+ddeulExPct()+'% 픽업</span>'+
        '</div>';
      if(pets.length===1) return '<div class="gb-ddeul-top gb-ddeul-one">'+title+spot(pets[0])+'</div>';   // 픽업 1마리: [타이틀|초상] 2열(빈자리 없이)
      return '<div class="gb-ddeul-top">'+spot(pets[0])+title+spot(pets[1])+'</div>';
    }
    // 🔍 픽업 펫 미리보기(초상 탭) — 큰 초상+이름+등급을 배너 시트 위 모달로(gimenu-scrim 패턴, 시트 안 덮음).
    function openPickupPeek(id){ closePickupPeek();
      const wrap=document.createElement('div'); wrap.id='pkPeek'; wrap.className='gimenu-scrim';
      wrap.onclick=function(e){ if(e.target===wrap) closePickupPeek(); };
      const t=CAT_TIER[id]||'exclusive';
      wrap.innerHTML='<div class="gimenu pkpeek">'+
        '<span class="pkpeek-fx">'+lightLayers({aura:150, rays:180, rainbow:t==='exclusive'})+'</span>'+
        '<div class="pkpeek-face">'+catFace(id,{h:110,eager:true})+'</div>'+
        '<div class="pkpeek-name">'+catNameSpan(id,catName(id))+'</div>'+
        '<div class="pkpeek-tier">'+tierLabelHtml(t)+'</div>'+
        '<div class="pkpeek-desc">오직 뜰알에서만 만날 수 있어요!</div>'+
        '<button class="gib ghost" '+App.view.act('closePickupPeek')+'>닫기</button></div>';
      document.body.appendChild(wrap);
    }
    function closePickupPeek(){ const m=$('pkPeek'); if(m) m.remove(); }
    // 🌱 뜰알 배너 = 상단 한정 픽업 쇼케이스(양쪽 큰 초상 + 가운데 텍스트) + 배회 픽업 펫이 도는 씬 + 센터(라이브=알뜰 아이콘 · v2 개발자 배너관리=뜰알 — 펫알 배너의 알 센터와 통일).
    function ddeulBannerHtml(live){
      return '<div class="gbanner gb-ddeul">'+
        ddeulPickupShowcase()+
        '<div class="gb-scene">'+pickupSceneHtml('banner')+gbCenterHtml(_pkV2?ddeulEggSvg({h:52}):eggGardenSvg(EGG_DEFAULT,{h:52}), gbRainbowFx(), 'gb-rb gb-eglow')+'</div>'+
        // 🌱 배너 이미지 아래 — 뜰알 이미지·설명·소모재화(한정 강조)
        '<div class="gb-item gb-ddeul-item"><div class="gb-item-ic">'+ddeulEggSvg({h:52})+'</div>'+
          '<div class="gb-item-meta"><b class="tier-rainbow">뜰알 <span class="tagmini tier-rainbow">한정 픽업</span></b>'+
          '<div class="gb-item-desc">한정 펫은 <b class="tier-rainbow">오직 뜰알에서만</b> · 한정 '+ddeulExPct()+'% 픽업! · 픽업 펫은 <b>매주 월요일</b> 교체</div>'+
          '<div class="gb-item-cost">1뽑당 소모 '+gachaCostHtml(DDEUL_PRICE,DDEUL_GOLD,1)+'</div></div></div>'+
        gbPullActions('ddeul', DDEUL_PRICE, DDEUL_GOLD, null, 'ddeul', live)+gbPityHtml('ddeul')+'</div>';
    }
    // 소모재화 표시(은화·금화). 0/falsy인 재화는 생략(둘 다 없으면 '무료'). h=아이콘 높이, m=뽑기 수.
    function gachaCostHtml(silver, gold, m, h){ h=h||14; let s='';
      if(silver) s+='<span class="ci">'+coinSvg({h:h})+'</span>'+(silver*m);
      if(gold) s+=(s?' ':'')+'<span class="ci">'+goldSvg({h:h})+'</span>'+(gold*m);
      return s||'무료'; }
    // 보유 알/박스류 픽셀 아이콘(소비 인벤토리 키별).
    function heldItemIcon(key, h){ h=h||13; if(key==='ddeul') return ddeulEggSvg({h:h}); if(key==='rainbow_egg') return rainbowEggImg(h); if(key==='rainbow_box') return rainbowBoxSvg({h:h}); if(key==='box') return boxSvg({h:h}); return eggSvg(0,{h:h}); }
    // 🧾 뽑기 소모 표기 — 보유 알/박스를 먼저 쓰고(개수), 부족분만 재화로 구매. "🥚×3 + 🪙700" 식(수집형 게임 관례).
    function gbPullCostHtml(heldKey, silver, gold, n, rbc){
      if(rbc) return '<span class="gb-buy"><span class="ci">'+rainbowCoinSvg({h:13})+'</span>'+(rbc*n)+'</span>';   // 🌈 무지개동전 소모(무지개알/박스)
      const held=heldKey?consumQty(heldKey):0, useHeld=Math.min(n, held), buyN=n-useHeld; const parts=[];
      if(useHeld>0) parts.push('<span class="gb-held"><span class="ci">'+heldItemIcon(heldKey,13)+'</span>×'+useHeld+'</span>');   // 보유 소모
      if(buyN>0)   parts.push('<span class="gb-buy">'+gachaCostHtml(silver,gold,buyN,13)+'</span>');                                // 부족분 구매
      if(!parts.length) parts.push('무료');
      return parts.join('<span class="gb-plus">+</span>');
    }
    // 소모 표기가 있는 1뽑/10뽑 버튼(개발자 미리보기 = devBannerPull). silver/gold=1뽑당 소모, theme=10뽑 연출 테마, heldKey=보유 소비 인벤토리 키.
    function gbPullActions(kind, silver, gold, theme, heldKey, live, rbc){ const t=theme?",'"+theme+"'":'';
      const held=heldKey?consumQty(heldKey):0, htxt=heldKey?'<div class="gb-heldnote">보유 <b>'+held+'</b>개 — 뽑기 시 먼저 소모(부족분만 재화 구매)</div>':'';
      // 🎁 일일 무료 1뽑(실전 배너만) — 남았으면 1뽑 버튼이 '오늘 무료!'로, 안내줄에 사용 여부·밤 12시 초기화 표기
      const free1 = !!live && (typeof freePullAvail==='function') && freePullAvail(kind);
      const fnote = (!!live && typeof FREE_PULL_KINDS!=='undefined' && FREE_PULL_KINDS.indexOf(kind)>=0)
        ? '<div class="gb-freenote">'+(free1?'🎁 오늘의 <b>무료 1뽑</b>이 남아 있어요':'오늘의 무료 1뽑은 사용했어요')+' · 밤 12시 초기화</div>' : '';
      const on1 = live ? 'bannerPull(\''+kind+'\',false)' : 'devBannerPull(\''+kind+'\',false'+t+')';    // live=실전(재화 소모·지급) · 그 외=개발자 미리보기(무소모)
      const on10 = live ? 'bannerPull(\''+kind+'\',true)' : 'devBannerPull(\''+kind+'\',true'+t+')';
      return htxt+fnote+'<div class="gb-actions">'+
        '<button class="gb-btn'+(free1?' gb-freebtn':'')+'" onclick="'+on1+'"><span>1뽑</span><span class="gb-cost">'+(free1?'<b class="gb-free">오늘 무료!</b>':gbPullCostHtml(heldKey,silver,gold,1,rbc))+'</span></button>'+
        '<button class="gb-btn gb-btn10" onclick="'+on10+'"><span>10뽑</span><span class="gb-cost">'+gbPullCostHtml(heldKey,silver,gold,10,rbc)+'</span></button></div>';
    }
    // 🌇 노을색 센터 연출 — 무지개 대신 노을 주황 오오라·광선·트윙클(currentColor 상속)로 펫알 테마 정합.
    function gbSunsetFx(){ return '<span class="gb-sunfx" style="color:#ee7a4a"><span class="gb-rbaura">'+lightLayers({aura:98,rays:118})+'</span>'+fxAuraTwinkles(9)+'</span>'; }
    // 🥚 펫알 배너 = 노을 씬 + 노을 테두리/FX(테마 정합) + 배너 이미지 아래 펫알 이미지·설명·소모재화 + 1뽑/10뽑(소모재화) + 확률 보기.
    function eggBannerHtml(live){
      // 🎨 v2(개발자 미리보기): 오오라를 뜰알·무지개와 동일한 무지개로 통일 + 알 크기=뜰알 배너 메인 아이콘과 동일(52) (사용자 지침). 라이브(v1)는 노을 오오라·기존 크기 유지.
      //    + v2 신규 펫알 아트(뜰알 복사 — 새싹·치즈태비·황토 흙·연두 이끼, egg2Svg) — 라이브는 기존 크림알 유지.
      const fx=_pkV2?gbRainbowFx():gbSunsetFx(), cls=_pkV2?'gb-rb gb-eglow':'gb-rb gb-sun', eh=_pkV2?52:56;
      const eggArt=(h)=>_pkV2?egg2Svg({h:h}):eggSvg(0,{h:h});
      return '<div class="gbanner gb-eggbn"><div class="gb-head"><b class="gb-t gb-sunset-t">🌇 펫알 · 노을</b><span class="pk-tag">매일 만나는 새 친구</span></div>'+
        '<div class="gb-scene">'+sunsetSceneHtml()+gbCenterHtml(eggArt(eh), fx, cls)+'</div>'+
        // 🥚 배너 이미지 아래 — 펫알 이미지·설명·소모재화
        '<div class="gb-item"><div class="gb-item-ic">'+eggArt(52)+'</div>'+
          '<div class="gb-item-meta"><b>펫알</b>'+
          '<div class="gb-item-desc">열면 펫이 랜덤으로! 등급이 높을수록 귀해요.<br>열 때마다 금화 1개 지급.</div>'+
          '<div class="gb-item-cost">1뽑당 소모 '+gachaCostHtml(GACHA_PRICE,0,1)+'</div></div></div>'+
        gbPullActions('egg', GACHA_PRICE, 0, 'sunset', 'egg', live)+gbPityHtml('egg')+'</div>';
    }
    // 🎁 랜덤박스 배너 = 노을 씬 box 변형(연못 대신 선물상자 무더기+트윙클) + 상자 중앙 + 반짝임 — 펫알과 전용 배경 분화.
    function boxBannerHtml(live){
      // 🎨 v2(개발자 미리보기): 무지개 오오라 + 박스 크기=뜰알 배너 메인 아이콘과 동일(52) (사용자 지침). 라이브(v1)는 노을 오오라·기존 크기 유지.
      const fx=_pkV2?gbRainbowFx():gbSunsetFx(), cls=_pkV2?'gb-rb gb-eglow':'gb-rb gb-sun', bh=_pkV2?52:54;
      return '<div class="gbanner gb-box gb-eggbn"><div class="gb-head"><b class="gb-t gb-sunset-t">🎁 랜덤박스 · 금은보화</b><span class="pk-tag">방을 꾸미는 가구·바닥·벽지</span></div>'+
        '<div class="gb-scene">'+(_pkV2?treasureSceneHtml('banner'):sunsetSceneHtml('banner','box'))+gbCenterHtml(boxSvg({h:bh}), fx, cls)+'</div>'+
        // 🎁 배너 이미지 아래 — 랜덤박스 이미지·설명·소모재화
        '<div class="gb-item"><div class="gb-item-ic">'+boxSvg({h:52})+'</div>'+
          '<div class="gb-item-meta"><b>랜덤박스</b>'+
          '<div class="gb-item-desc">열면 <b>가구·바닥·벽지</b>가 랜덤으로!<br><b>특별↑</b> 장식도 여기서 · 열 때마다 금화 1개.</div>'+
          '<div class="gb-item-cost">1뽑당 소모 '+gachaCostHtml(GACHA_PRICE,0,1)+'</div></div></div>'+
        gbPullActions('box', GACHA_PRICE, 0, (_pkV2?'treasure':'sunset'), 'box', live)+gbPityHtml('box')+'</div>';
    }
    // 🌈 무지개 배너 = 밤 씬 + 알뜰 아이콘(야광색) 중앙(둥지 없음) + 찬란한 무지개 오오라·트윙클. 배너 이미지 아래 무지개알·설명·소모재화(금화) + 1뽑/10뽑(밤 연출).
    function rainbowBannerHtml(){
      const fx='<span class="gb-rbaura">'+lightLayers({aura:98,rays:118,rainbow:true})+'</span>'+fxAuraTwinkles(9,true);
      const gp=(typeof rbPriceGold==='function')?rbPriceGold('egg'):5;
      return '<div class="gbanner gb-rainbow"><div class="gb-head"><b class="gb-t tier-rainbow">🌈 무지개 · 밤</b></div>'+
        '<div class="gb-scene">'+nightSceneHtml()+devPickupStageHtml(DEV_NIGHT_PICKUP)+gbCenterHtml(eggGardenSvg(EGG_NIGHT,{h:54}), fx, 'gb-rb gb-glow')+'</div>'+
        // 🌈 배너 이미지 아래 — 무지개알 이미지·설명·소모재화(금화 전용). v2=신규 무지개알(뜰알 복사·무지개 고양이·큰 무지개꽃 + 무지개 오오라·트윙클 상시)
        '<div class="gb-item"><div class="gb-item-ic">'+(_pkV2?rbEgg2Html(52):rainbowEggSvg({h:52}))+'</div>'+
          '<div class="gb-item-meta"><b class="tier-rainbow">무지개알 <span class="tagmini tier-rainbow">밤</span></b>'+
          '<div class="gb-item-desc"><b class="tier-limited">신화 80%</b> · <b class="tier-rainbow">한정 20%</b> — 무지개동전으로 뽑아요('+RB_PITY_N+'뽑 안에 한정 확정).<br>달빛 밤하늘 아래 반딧불이 반짝여요.</div>'+
          '<div class="gb-item-cost">1뽑당 소모 <span class="ci">'+rainbowCoinSvg({h:14})+'</span>'+RAINBOW_PRICE_RBC+'</div></div></div>'+
        gbPullActions('egg', 0, gp, 'night', 'rainbow_egg')+rbPityChipHtml('rainbow_egg')+'</div>';
    }
    // 배너 버튼 → 미리보기(소모 없음). 1회=강제 전설 단발 연출, 10회=10연차 연출(펫알·랜덤박스·뜰알 모두 지원 — 박스는 devPreview10Box). 실전은 bannerPull/openGachaTen.
    function devBannerPull(kind, ten, theme){
      if(!(typeof isDev==='function'&&isDev())) return;
      _pkV2=true;   // 🎨 개발자 미리보기 연출(단발 리빌·10연차)도 v2 고해상도 씬 배경으로 — closeFx/closeTenFx에서 해제(라이브 뽑기 경로는 안 거침)
      if(theme==='night'){ _devPickupOverride=DEV_NIGHT_PICKUP;   // 🌙 밤 = 흑표범·카라칼 미리보기(라이브 픽업 안 건드림, FX 닫힐 때 해제)
        if(ten) devPreview10('oneExclusive', kind, theme); else devPreview(kind, 'exclusive', pickupMember(), true); return; }   // 밤 1뽑 = 무지개알 오픈으로(rainbow) — v2 신규 무지개알 아트·연출 미리보기
      if(ten){ devPreview10('random', kind, theme); }
      else devPreview(kind, 'legend');
    }
    // ===== 🎰 실전 배너 뽑기(재화 소모·보상 지급) — 미리보기(devBannerPull)와 달리 실제로 재화를 쓰고 지급한다. =====
    // 🎁 일일 무료 1뽑 — 뜰알·펫알·랜덤박스 3배너에서 종류별 하루 1회 무료 단발. 사용 마커 game.freePull[kind]='YYYY-MM-DD'(kstDayKey)
    //    → 밤 12시(자정)에 날짜 키가 바뀌며 자연 초기화(별도 스케줄러 없음, 미션 리셋과 동일 관례). 무료 뽑기도 pity(천장)는 누적,
    //    금화 부산물(+1)·금화 소모(뜰알)는 없음 — 재화 완전 무소모(경제 정책: 금화 희소성 방어).
    const FREE_PULL_KINDS=['ddeul','egg','box'];
    function freePullAvail(kind){ if(FREE_PULL_KINDS.indexOf(kind)<0) return false; const f=(state.game&&state.game.freePull)||{}; return f[kind]!==kstDayKey(); }
    // 1뽑: 오늘 무료 1뽑이 남았으면 최우선(무소모) → 보유 소비분(펫알/랜덤박스/뜰알) → 재화로 구매(기존 단발 함수 재사용). 10뽑=openGachaTen.
    function bannerPull(kind, ten){
      if(_pullBusy) return;
      if(kind==='rainbow_egg'||kind==='rainbow_box'){ if(ten){ openGachaTen(kind); } else openRainbow(kind==='rainbow_egg'?'egg':'box'); return; }   // 🌈 무지개=코인 직접 뽑기(무료·보유분 없음)
      if(ten){ openGachaTen(kind); return; }
      const free=freePullAvail(kind);   // 🎁 오늘 무료 1뽑 남음 — 보유분·재화 안 쓰고 무료로
      if(kind==='ddeul'){ if(free) openDdeul(true); else if(consumQty('ddeul')>0) useHeldDdeul(); else openDdeul(); }
      else { if(free) openGacha(kind, true); else if(consumQty(kind)>0) useHeldGacha(kind); else openGacha(kind); }
    }
    // 🎰 실전 10연차 — 보유분 우선 소모 + 부족분 재화 구매, 10개 롤·지급(원자적 트랜잭션) 후 10연차 연출.
    //   펫알/랜덤박스=뽑을 때마다 금화+1 · 뜰알=금화 소모(보상 없음). 중복은 은화 환급(배치 내 중복도 반영). pity(신화확정)는 10회 누적.
    function openGachaTen(kind){
      if(_pullBusy) return;
      // 🌈 무지개 10연차(rainbow_egg/rainbow_box) — 무지개동전 50개(5×10), 보유 소비분·은화·금화·부산물 없음. 확률=RAINBOW_TIERS(신화80·한정20).
      const isRb=(kind==='rainbow_egg'||kind==='rainbow_box');
      const rbKindEgg=(kind==='rainbow_egg');
      const N=10, heldKey=isRb?null:kind;                             // 소비 인벤토리 키 = 종류키(egg/box/ddeul) · 무지개=없음
      const held=heldKey?Math.min(N, consumQty(heldKey)):0, buyN=N-held;
      const silverEach=isRb?0:100, goldEach=(kind==='ddeul')?DDEUL_GOLD:0;    // 은화 100 공통 · 뜰알만 금화 소모 · 무지개=코인만
      if(isRb){ if(rbcoins()<RAINBOW_PRICE_RBC*N){ toast('무지개동전 '+(RAINBOW_PRICE_RBC*N-rbcoins())+'개 부족 — 신화·한정 중복으로 모아요', true); return; } }
      else if(buyN>0){
        if(coins()<buyN*silverEach){ toast((buyN*silverEach-coins())+' 은화 부족', true); return; }
        if(goldEach && gold()<buyN*goldEach){ toast('금화 '+(buyN*goldEach-gold())+' 부족', true); return; }
      }
      // ── 10개 결과 롤(배치 내 중복·pity 반영) → 리빌용 list(지급 정보 포함)
      const map=isRb?rainbowCatTierMap():gachaCatTierMap(), ddeulTiers=(kind==='ddeul')?DDEUL_TIERS:(isRb?RAINBOW_TIERS:null);
      const rollKind=isRb?(rbKindEgg?'egg':'box'):kind;   // 롤·지급 분기용(egg 계열/box 계열)
      let pity=pityGet(kind);
      const seenCat={}, seenItem={}, seenFloor={}, seenWall={}, seenBgfx={}, cntItem={}, affAcc={}, list=[];   // cntItem=배치 내 가구 지급 누적(12개 캡 판정이 트랜잭션 지급 순서와 일치하게) · affAcc=배치 내 같은 펫 중복 애정 누적(만렙 폴백 판정 순서 일치)
      for(let i=0;i<N;i++){
        const forced = isRb ? (pityForced(pity, RB_PITY_N)?'exclusive':null)   // 🌈 무지개 천장: 5뽑 안에 한정 확정
                     : (pityForced(pity) ? (kind==='ddeul'?(Math.random()<0.5?'limited':'exclusive'):'limited') : null);
        if(rollKind==='box'){
          let res = forced ? rollBoxReward(isRb?RAINBOW_TIERS:null, forced) : rollBoxReward(isRb?RAINBOW_TIERS:null);
          if(!res) res={ id:'cushion', tier:'normal', type:'item' };
          let owned;
          if(res.type==='floor') owned=(ownsFloor(res.id)&&res.id!=='default')||!!seenFloor[res.id];
          else if(res.type==='wall') owned=(ownsWall(res.id)&&res.id!=='default')||!!seenWall[res.id];
          else if(res.type==='bgfx') owned=ownsBgfx(res.id)||!!seenBgfx[res.id];
          else if(res.type==='petfx') owned=ownsPetfx(res.id)||!!seenBgfx['fx:'+res.id];   // ✨ 펫효과=own-once(배치 내 중복도 판정 — seenBgfx 맵 재사용, 키 충돌 방지 접두사)
          else if(res.type==='hat') owned=ownsHat(res.id)||!!seenBgfx['ht:'+res.id];   // 🧢 모자=own-once
          else owned=((typeof itemQty==='function'?itemQty(res.id):0)>0)||!!seenItem[res.id];
          if(res.type==='floor') seenFloor[res.id]=true; else if(res.type==='wall') seenWall[res.id]=true; else if(res.type==='bgfx') seenBgfx[res.id]=true; else if(res.type==='petfx') seenBgfx['fx:'+res.id]=true; else if(res.type==='hat') seenBgfx['ht:'+res.id]=true; else seenItem[res.id]=true;
          const isSkin=(res.type==='floor'||res.type==='wall'||res.type==='bgfx'||res.type==='petfx'||res.type==='hat');   // own-once 중복 · 가구=상한(케어5·기타1) 초과
          const isFurn=(res.type==='item');
          const capped=isFurn && ((typeof itemQty==='function'?itemQty(res.id):0)+(cntItem[res.id]||0))>=itemCapOf(res.id);   // 배치 내 앞서 지급된 수량 포함(트랜잭션 지급 순서와 동일 판정, 케어5·기타1)
          if(isFurn && !capped) cntItem[res.id]=(cntItem[res.id]||0)+1;
          const dupIt=(isSkin&&owned)||capped;
          const rbcIt=dupIt?dupRbcOf(res.tier):0;   // 🌈 신화↑ 중복=무지개동전 표기(한정+2·신화+1, 실지급은 grantBoxReward)
          list.push({ id:res.id, tier:res.tier, type:res.type, kind:'box', rainbow:(Math.random()<rbUpgradeChance(res.tier)), dup:dupIt, refund:(dupIt&&!rbcIt)?dupRefundOf(res.tier):0, rbc:rbcIt, isNew:!owned });
          pity=pityNext(pity, isRb?(res.tier==='exclusive'):isTopTier(res.tier));   // 무지개=한정만 리셋
        } else {
          let res = forced ? pickTierMember(map, forced) : (ddeulTiers?rollFromPool(map, ddeulTiers):rollFromPool(map));
          if(!res) res={ id:(Object.keys(map)[0]||'cat_mackerel'), tier:'normal' };
          const owned=ownsCat(res.id)||!!seenCat[res.id]; seenCat[res.id]=true;
          // 💗 중복 펫=애정 경험치(만렙만 은화 폴백·한정=🌈코인) — 표기 미러. 배치 내 같은 펫 반복은 affAcc로 누적해 트랜잭션 지급 순서와 판정 일치.
          let rfd=0, dupAff=0, rbcP=0, lvUp=false;
          if(owned){ const tr=CAT_TIER[res.id]||'normal', base=(Number((ownedCatsMap()[res.id]||{}).affection)||0)+(affAcc[res.id]||0);
            rbcP=dupRbcOf(tr);   // 🌈 신화↑ 중복 = 무지개동전(한정+2·신화+1, 은화 폴백 없음)
            if(affectionLevel(base, tr).level>=5){ if(!isTopTier(tr)) rfd=petDupRefund(res.id); }
            else { dupAff=dupAffOf(tr); lvUp=affectionLevel(base+dupAff, tr).level>affectionLevel(base, tr).level; affAcc[res.id]=(affAcc[res.id]||0)+dupAff; } }   // 이번 중복으로 레벨 상승 여부(카드 표기)
          list.push({ id:res.id, tier:res.tier, kind:rollKind, rainbow:(rollKind==='egg' && Math.random()<rbUpgradeChance(res.tier)), dup:owned, refund:rfd, dupAff:dupAff, lvUp:lvUp, rbc:rbcP, isNew:!owned });
          pity=pityNext(pity, isRb?(res.tier==='exclusive'):isTopTier(res.tier));   // 무지개=한정만 리셋
        }
      }
      _pullBusy=true;   // 🔒 트랜잭션 동안 중복탭 방지(10연차 FX가 뜨면 화면을 덮음 → 커밋 후 해제)
      gameRef().transaction(function(g){ g=normalizeGame(g);
        if(isRb){ if((Number(g.rbcoin)||0)<RAINBOW_PRICE_RBC*N) return; spendRbcoin(g, RAINBOW_PRICE_RBC*N); }   // 🌈 무지개 10연=코인 50(소비는 반드시 spendRbcoin — 자가복구 정합)
        else {
          if((Number(g.consum[heldKey])||0)<held) return;                       // 보유 재검증
          if(buyN>0){ if((g.coins||0)<buyN*silverEach) return; if(goldEach && (g.gold||0)<buyN*goldEach) return; }
          g.consum[heldKey]=(Number(g.consum[heldKey])||0)-held;                 // 보유분 소모
          if(buyN>0){ g.coins-=buyN*silverEach; if(goldEach) g.gold=clampGold((g.gold||0)-buyN*goldEach); }   // 구매분 재화 소모
          if(kind!=='ddeul') grantGachaGold(g,N);                                // 펫알/박스=10뽑 부산물 금화(뜰알 제외) · 하루 2뽑 캡 적용
        }
        { let p=Number(g.pity[kind])||0; list.forEach(function(it){ p=pityNext(p, isRb?(it.tier==='exclusive'):isTopTier(it.tier)); }); g.pity[kind]=p; }   // pity 10회 누적 — 서버값 기점 재계산(다기기 동시 10연 시 소실 방지, 강제등급 판정은 롤 시점 값 수용)
        list.forEach(function(it){
          if(it.kind==='box'){ const gr=grantBoxReward(g, { id:it.id, tier:it.tier, type:it.type }); if(gr.rf) g.coins=clampCoins((g.coins||0)+gr.rf); }
          else if(!g.owned.cats[it.id]){ g.owned.cats[it.id]={boughtAt:new Date().toISOString()}; }   // 🚫 가챠(10연) 획득 펫도 방에 자동 배치하지 않음(가방에만)
          else { grantPetDup(g, it.id); }   // 💗 중복 펫=애정(+한정 🌈코인) — 순차 지급이라 배치 내 반복도 정확
        });
        return g;
      }).then(function(r){ _pullBusy=false;
        if(r&&r.committed){ const theme=isRb?'night':(kind==='ddeul'?'rainbow':(kind==='box'?'treasure':'sunset')); runTenGachaFx(list, { kind:rollKind, theme:theme, rb:isRb }); if(state._sheetRefresh) setTimeout(function(){ if(state._sheetRefresh) state._sheetRefresh(); }, 50); }   // 🎉 v2 정식: 무지개 10뽑=밤(무지개) 씬
        else toast('처리 중이에요 — 잠시 후 다시 시도해 주세요', true);
      }).catch(function(){ _pullBusy=false; });
    }
    // 개발자 배너 관리 — 탭별(뜰알/펫알/랜덤박스) 배너 미리보기(시트).
    let _bannerTab='ddeul';
    const BANNER_TABS=[['ddeul','뜰알'],['egg','펫알'],['box','랜덤박스'],['rainbow','무지개']];
    function setBannerTab(t){ _bannerTab=t||'ddeul'; if(state._sheetRefresh) state._sheetRefresh(); }
    function openDevBannerManager(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용'); return; }
      const build=()=>{   // 🎉 v2 정식 반영 이후 _pkV2 상시 true — 뜰알/펫알/랜덤박스는 라이브와 동일, 무지개 밤 배너만 여기 전용(추후 다른 픽업용 대기)
        if(!BANNER_TABS.some(t=>t[0]===_bannerTab)) _bannerTab='ddeul';
        let h='<div class="note">가챠 배너 미리보기 — 뜰알·펫알·랜덤박스는 <b>라이브와 동일(v2 정식 반영)</b>, <b>무지개(밤 배너)</b>는 추후 픽업용으로 여기서만 확인. 버튼은 <b>미리보기</b>(1회=강제 전설·10회=연출)로 소모 없음.</div>';
        h+='<div class="subseg">'+BANNER_TABS.map(t=>'<button class="'+(_bannerTab===t[0]?'on':'')+'" '+App.view.act('setBannerTab',t[0])+'>'+t[1]+'</button>').join('')+'</div>';
        h+=(_bannerTab==='ddeul'?ddeulBannerHtml():_bannerTab==='egg'?eggBannerHtml():_bannerTab==='box'?boxBannerHtml():rainbowBannerHtml());
        return h;
      };
      openSheet('배너 관리', build());
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(!b) return; const st=b.scrollTop; b.innerHTML=build(); b.scrollTop=st; if(typeof pkObserveScenes==='function') pkObserveScenes(); };
      if(typeof pkObserveScenes==='function') pkObserveScenes();
    }
    let _shopFurnCat=lsGet('shopFurnCat','all');   // 알뜰샵 가구 탭의 기능분류 필터(전체/케어/휴식/놀이/장식) — 배치 인벤토리와 같은 ITEM_CATALOG.cat 기준
    function setShopFurnCat(c){ _shopFurnCat=c||'all'; lsSet('shopFurnCat',_shopFurnCat); renderCatHouse(); }
    let _furnSort=lsGet('furnSort','tierdesc');   // 알뜰샵 가구 정렬
    const FURN_SORTS=[['tierdesc','등급↓'],['tierasc','등급↑'],['name','이름']];
    function setFurnSort(v){ _furnSort=v||'tierdesc'; lsSet('furnSort',_furnSort); renderCatHouse(); }
    function sortFurnItems(list){ const l=list.slice(), rank=id=>tierRank(itemTierOf(id)), nm=id=>{ const it=ITEM_CATALOG.find(x=>x.id===id); return (it&&it.name)||id; };
      if(_furnSort==='tierasc') l.sort((a,b)=>rank(a.id)-rank(b.id) || nm(a.id).localeCompare(nm(b.id)));
      else if(_furnSort==='name') l.sort((a,b)=>nm(a.id).localeCompare(nm(b.id)));
      else l.sort((a,b)=>rank(b.id)-rank(a.id) || nm(a.id).localeCompare(nm(b.id)));   // 등급↓(기본)
      return l; }
    let _shopPetSpecies=lsGet('shopPetSpecies','all');   // 알뜰샵 펫 탭의 종(species) 필터(전체/고양이/강아지/…) — 카탈로그에 존재하는 종만 노출
    function setShopPetSpecies(s){ _shopPetSpecies=s||'all'; lsSet('shopPetSpecies',_shopPetSpecies); _shopSelCat=null; renderCatHouse(); }
    // 펫 탭 종 필터 탭 목록 — SPECIES_LABEL 순서로, 카탈로그에 실제 있는 종만(전체 먼저)
    function shopPetSpeciesTabs(){ const order=Object.keys(SPECIES_LABEL); const present=[];
      PET_CATALOG.forEach(function(c){ if(present.indexOf(c.species)<0) present.push(c.species); });
      present.sort(function(a,b){ const ia=order.indexOf(a), ib=order.indexOf(b); return (ia<0?99:ia)-(ib<0?99:ib); });
      return [['all','전체']].concat(present.map(function(sp){ return [sp, SPECIES_LABEL[sp]||sp]; })); }
    let _petShopSort=lsGet('petShopSort','tierasc');   // 알뜰샵 펫 탭 정렬 — 가구 탭(FURN_SORTS)과 동일 패턴. 기본=등급↑(기존 고정 정렬 유지)
    const PETSHOP_SORTS=[['tierasc','등급↑'],['tierdesc','등급↓'],['name','이름'],['unowned','미보유 먼저']];
    function setPetShopSort(v){ _petShopSort=v||'tierasc'; lsSet('petShopSort',_petShopSort); renderCatHouse(); }
    function sortShopCats(list){ const l=list.slice(), rank=c=>tierRank(petTierOf(c.id)), nm=c=>c.name||c.id;
      if(_petShopSort==='tierdesc') l.sort((a,b)=>rank(b)-rank(a) || nm(a).localeCompare(nm(b)));
      else if(_petShopSort==='name') l.sort((a,b)=>nm(a).localeCompare(nm(b)));
      else if(_petShopSort==='unowned') l.sort((a,b)=>(ownsCat(a.id)?1:0)-(ownsCat(b.id)?1:0) || rank(a)-rank(b) || nm(a).localeCompare(nm(b)));   // 미보유 먼저, 그 안에선 등급↑
      else l.sort((a,b)=>rank(a)-rank(b) || nm(a).localeCompare(nm(b)));   // 등급↑(기본)
      return l; }
    // 알뜰샵에서 미리보기로 "선택"한 펫 — 선택하면 카드가 강조되고 썸네일이 옆으로 걷는 스프라이트(우리집 펫 카드와 동일)로 바뀐다.
    let _shopSelCat=null;
    function selectShopCat(id){ _shopSelCat=(_shopSelCat===id?null:id); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    // 알뜰샵 서브탭(펫/가구/소비/벽지/가챠) — cathead(sticky) 안에 넣어 스크롤해도 상단 고정. '펫'=구 '고양이'(호랑이·사자 등 포함이라 펫으로 통일). ('가챠' 탭 키는 내부적으로 'event' 유지)
    const SHOP_SUBS=[['event','픽업'],['egg','펫알'],['box','랜덤박스'],['rainbow','무지개'],['consum','소비']];   // 🚧 은화 구매 탭(펫·가구·벽지·바닥)은 잠시 제거 — 가챠(이벤트·펫알·랜덤박스·무지개) + 소비만. (추후 금화 로테이션 판매로 재도입 예정)
    const SHOP_LEGACY_BUYTABS=false;   // 🚧 휴면(레거시) 은화 매수탭 게이트 — catShopHtml의 floor/wall/cats/가구 분기를 하드 펜스(SHOP_SUBS에서도 빠져 도달 불가). buyCat/buyItem/buyFloor/buyWall·surfaceShopGrid·필터/정렬 헬퍼가 이 블록 전용이라 삭제하지 않고 보존 — 재도입(금화 로테이션 판매) 시 true + SHOP_SUBS 복원.
    function shopSubsegHtml(){
      if(!SHOP_SUBS.some(function(t){ return t[0]===_shopSub; })) _shopSub='event';   // 제거된 탭 상태면 이벤트로 폴백
      return '<div class="subseg">'+SHOP_SUBS.map(function(t){ return '<button class="'+(_shopSub===t[0]?'on':'')+'" '+App.view.act('setShopSub',t[0])+'>'+t[1]+'</button>'; }).join('')+'</div>';
    }
    // 🧱 벽지·바닥 알뜰샵 스킨 그리드(공통) — ASSET_TYPES 기반, 카탈로그·현재적용·css·구매fn·라벨만 다름. wall/floor 분기의 거의 동일하던 마크업을 1곳으로.
    function surfaceShopGrid(type){
      const A=ASSET_TYPES[type], isFloor=(type==='floor');
      const cur=isFloor?currentFloor():currentWall(), cssOf=isFloor?floorCss:wallCss, buyFn=isFloor?'buyFloor':'buyWall', owns=isFloor?ownsFloor:ownsWall, lbl=A.label.trim();
      return '<div class="wallgrid">'+A.catalog.filter(function(x){ return !isGachaOnlyAsset(type,x.id); }).map(function(x){
        const owned=owns(x.id), applied=cur===x.id, gacha=isGachaOnlyAsset(type,x.id), p=assetBuyPrice(type,x.id), t=assetTierOf(type,x.id);
        let act;
        if(owned) act='<span class="owntag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>보유중</span>';
        else if(gacha) act='<span class="owntag" style="color:var(--sub);"><span class="ci" style="vertical-align:-2px">'+boxSvg({h:14})+'</span>랜덤박스</span>';
        else if(coins()>=p) act='<button class="buy" aria-label="'+x.name+' '+lbl+' 구매('+p+' 은화)" onclick="'+buyFn+'(\''+x.id+'\')">구매</button>';
        else act='<button class="buy dis" disabled>'+(p-coins())+' 부족</button>';
        const price=gacha?('<span class="tagmini tier-'+t+'">'+((TIERS.find(function(tt){ return tt.id===t; })||{}).name||t)+'</span>'):(p?('<span class="price"><span class="ci">'+coinSvg({h:15})+'</span>'+p+'</span>'):'<span class="price" style="color:var(--sub)">무료</span>');
        return '<div class="wallcard'+(applied?' on':'')+'"><div class="wallsw" style="background:'+cssOf(x.id)+'"></div>'+
          '<div class="wallmeta"><b>'+x.name+'</b>'+price+'</div>'+act+'</div>';
      }).join('')+'</div>';
    }
    function catShopHtml(){
      let h='';
      if(_shopSub==='consum'){
        const pf=harvestPref('food'), pw=harvestPref('water');
        // 🌾 수확·그릇 급여 자동채움 선호(기본 ↔ 고급) — pickFill이 읽음
        h+='<div class="hpref"><div class="hpref-t">🌾 수확·그릇 급여에 쓸 사료·물</div>'
          +'<div class="hpref-row"><span class="hpref-l">사료</span><div class="subseg hpref-seg"><button class="'+(pf==='food'?'on':'')+'" '+App.view.act('setHarvestPref','food','food')+'>기본 사료</button><button class="'+(pf==='food_plus'?'on':'')+'" '+App.view.act('setHarvestPref','food','food_plus')+'>고급사료</button></div></div>'
          +'<div class="hpref-row"><span class="hpref-l">물</span><div class="subseg hpref-seg"><button class="'+(pw==='water'?'on':'')+'" '+App.view.act('setHarvestPref','water','water')+'>기본 물</button><button class="'+(pw==='water_plus'?'on':'')+'" '+App.view.act('setHarvestPref','water','water_plus')+'>정수물</button></div></div>'
          +'<div class="note" style="margin:6px 0 0;">선택한 사료·물이 떨어지면 자동으로 기본 사료·물로 채워요.</div></div>';
        h+=CONSUM_CATALOG.map(c=>{
          const gcur=(c.cur==='gold'), have=gcur?gold():coins();
          const bd=(state.game&&state.game.buyDay)||{}, boughtToday=(c.dailyBuy&&bd.day===kstDayKey()&&bd.n)?(Number(bd.n[c.id])||0):0, capHit=(c.dailyBuy&&boughtToday>=c.dailyBuy);
          const free=(c.price<=0), enough=(free||have>=c.price) && !capHit;
          const curIcon=gcur?goldSvg({h:16}):coinSvg({h:16});
          const act=enough?'<button class="buy" aria-label="'+c.name+(free?' 받기':' 구매('+c.price+(gcur?' 금화':' 은화')+')')+'" '+App.view.act('buyConsum',c.id)+'>'+(free?'받기':'구매')+'</button>'
                          :(capHit?'<button class="buy dis" disabled>오늘 완료</button>':'<button class="buy dis" disabled>부족</button>');
          const tag=(c.effect&&c.effect.affection)?'애정':((c.effect&&c.effect.boost)?'부스트':((c.effect&&c.effect.fill)?'채움':'소비'));
          const priceHtml=free?'<span class="price"><b>무료</b></span>':'<span class="price"><span class="ci">'+curIcon+'</span>'+c.price+'</span>';
          return '<div class="shopcard"><div class="thumb"><span class="furnfit">'+consumSvg(c.id,{fit:true})+'</span></div>'+
            '<div class="meta"><b>'+c.name+' <span class="tagmini">'+tag+'</span></b><div class="desc">'+c.desc+'</div>'+
            priceHtml+'</div>'+
            '<div class="act">'+act+'<span class="qty">보유 '+consumQty(c.id).toLocaleString()+(consumQty(c.id)>=MAX_CONSUM?maxChip():'')+(c.dailyBuy?' · 오늘 '+boughtToday+'/'+c.dailyBuy:'')+'</span></div></div>';
        }).join('');
        h+='<div class="note"><b>소비 아이템</b>은 배치할 수 없어요. <b>사료·물·고급사료·정수물</b>은 홈에서 밥·물 그릇을 탭(또는 수확)해 채우고, <b>츄르</b>는 가방에서 펫을 골라 애정을, <b>영양제</b>는 가방에서 6시간 수익 부스트에, <b>염색약·리무버</b>는 가방·펫 정보에서 펫을 골라 톤 변경·복원에 써요.</div>';
        return h;
      }
      if(_shopSub==='event'){   // 🌱 이벤트(한정 픽업 뜰알)
        h+=gachaTabHtml('ddeul');
        return h;
      }
      if(_shopSub==='egg'){   // 🥚 펫알
        h+=eggBannerHtml(true);
        return h;
      }
      if(_shopSub==='box'){   // 📦 랜덤박스
        h+=boxBannerHtml(true);
        return h;
      }
      if(_shopSub==='rainbow'){   // 🌈 무지개(금화 전용·특별↑ 확정)
        h+=gachaTabHtml('rainbow');
        h+='<div class="note">'+gachaNoteFor('rainbow')+'</div>';
        return h;
      }
      if(SHOP_LEGACY_BUYTABS){   // 🚧 아래 은화 매수탭(바닥·벽지·펫·가구)은 휴면 — 위 SHOP_SUBS에 없어 현재 도달 불가(재도입까지 보존, 삭제 안 함).
      if(_shopSub==='floor'){
        h+=surfaceShopGrid('floor');
        h+='<div class="note"><b>바닥 스킨</b>은 <b>알뜰홈 방꾸미기</b>에서 방마다 골라 깔아요. <b>특별↑ 등급</b> 바닥은 <b>랜덤박스</b>로만 나와요.</div>';
        return h;
      }

      if(_shopSub==='wall'){
        h+=surfaceShopGrid('wallpaper');
        h+='<div class="note"><b>벽지</b>는 <b>알뜰홈 벽꾸미기</b>에서 방마다 골라 적용해요(<b>벽돌</b>은 랜덤박스 전용).</div>';
        return h;
      }
      if(_shopSub==='cats'){
        const owntag='<span class="owntag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>보유</span>';
        // 종(species) 필터 탭(2개↑일 때만) + 정렬 셀렉트 — 가구 탭의 shoptabrow 미러
        const PSHOP_TABS=shopPetSpeciesTabs();
        if(!PSHOP_TABS.some(t=>t[0]===_shopPetSpecies)) _shopPetSpecies='all';
        h+='<div class="shoptabrow">'+
          (PSHOP_TABS.length>2?'<div class="subseg shopfurncat">'+PSHOP_TABS.map(t=>'<button class="'+(_shopPetSpecies===t[0]?'on':'')+'" '+App.view.act('setShopPetSpecies',t[0])+'>'+escapeHtml(t[1])+'</button>').join('')+'</div>':'<span style="flex:1"></span>')+
          '<select class="petsort furnsort" aria-label="펫 정렬" onchange="setPetShopSort(this.value)">'+PETSHOP_SORTS.map(o=>'<option value="'+o[0]+'"'+(_petShopSort===o[0]?' selected':'')+'>'+o[1]+'</option>').join('')+'</select></div>';
        // 정렬은 사용자 선택(sortShopCats, 기본 등급↑). 특별(epic) 이상은 알뜰샵 직접 구매 불가 → 펫알(가챠) 전용 표기. 선택 종만 필터.
        const cats=sortShopCats(PET_CATALOG.filter(c=>!isGachaOnlyCat(c.id) && (_shopPetSpecies==='all'||c.species===_shopPetSpecies)));   // 가챠전용 펫은 판매목록에서 숨김(가챠 풀엔 그대로 있음)
        // 🌟 이달의 펫 배너(미보유·구매 가능한 등급일 때만 강조) — 선택한 종과 맞을 때만(전체 포함)
        { const fid=featuredCatId();
          if(fid){ const fc=PET_CATALOG.find(x=>x.id===fid); if(fc && (_shopPetSpecies==='all'||fc.species===_shopPetSpecies)){
            h+='<div class="featbanner"><span class="fstar">'+sparkSvg({h:20})+'</span><div class="fb-txt"><b>'+monthLabelKo()+' 이달의 펫 · '+catNameSpan(fid,fc.name)+'</b><span class="s">이번 달만 '+Math.round(FEATURED_DISCOUNT*100)+'% 할인 — '+catBuyPrice(fid)+' 은화'+(ownsCat(fid)?' (보유 완료)':'')+'</span></div><span class="fb-face">'+catFace(fid,{h:40})+'</span></div>'; } } }
        h+=cats.map(c=>{
          const owned=ownsCat(c.id), sel=_shopSelCat===c.id, gachaOnly=isGachaOnlyCat(c.id);
          const feat=isFeaturedCat(c.id), bp=catBuyPrice(c.id), enough=coins()>=bp;
          let act, priceHtml;
          if(gachaOnly){
            priceHtml='<span class="price gachaonly">'+eggSvg(0,{h:16})+'<b class="tier-rainbow">펫알 전용</b></span>';
            act= owned ? owntag : '<button class="buy ghost" aria-label="'+c.name+'은 펫알에서 뽑기" onclick="event.stopPropagation();setShopSub(\'event\')">펫알 뽑기</button>';
          } else {
            priceHtml= feat
              ? '<span class="price feat"><span class="ci">'+coinSvg({h:16})+'</span><s class="oldp">'+c.price+'</s> '+bp+'</span>'
              : '<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+c.price+'</span>';
            act= owned ? owntag : (enough ? '<button class="buy" aria-label="'+c.name+' 구매('+bp+' 은화)" onclick="event.stopPropagation();buyCat(\''+c.id+'\')">구매</button>' : '<button class="buy dis" disabled>'+(bp-coins())+' 부족</button>');
          }
          // 선택하면 우리집 펫 카드처럼 옆으로 걷는 스프라이트로, 아니면 정면 정지 썸네일. 선택 시 체크 배지.
          const art=sel?catActorHTML(c.id,72):catFace(c.id,{h:72});
          return '<div class="shopcard petpick'+(sel?' sel':'')+(feat?' feat':'')+'" role="button" tabindex="0" aria-pressed="'+sel+'" '+App.view.act('selectShopCat',c.id)+'><div class="thumb tbring tb-'+petTierOf(c.id)+'"><div class="fl"></div>'+art+
            (feat?'<span class="featrib">'+sparkSvg({h:12})+' 이달의 펫</span>':'')+
            (sel?'<span class="psel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></span>':'')+'</div>'+
            '<div class="meta"><b>'+catNameSpan(c.id,c.name)+' <span class="tagmini">'+speciesLabel(c.id)+'</span></b><div class="desc">'+c.desc+'</div>'+
            priceHtml+'</div>'+
            '<div class="act">'+act+'</div></div>';
        }).join('');
        h+='<div class="note">펫을 <b>탭하면 선택</b>돼요 — 카드가 강조되고 미리보기 펫이 <b>옆으로 걸어다녀요</b>. <b>중복 소유</b> 펫은 종당 1마리, 구매하면 자동으로 집에 들어와 걸어다녀요.</div>';
      } else {
        // 등급 낮은 것부터. 특별(epic) 이상 가구는 알뜰샵 직접 구매 불가 → 랜덤박스(가챠) 전용 표기.
        const FSHOP_CATS=[['all','전체']].concat(PLACE_CATS);
        if(!FSHOP_CATS.some(c=>c[0]===_shopFurnCat)) _shopFurnCat='all';
        h+='<div class="shoptabrow"><div class="subseg shopfurncat">'+FSHOP_CATS.map(c=>'<button class="'+(_shopFurnCat===c[0]?'on':'')+'" '+App.view.act('setShopFurnCat',c[0])+'>'+c[1]+'</button>').join('')+'</div>'+
          '<select class="petsort furnsort" aria-label="가구 정렬" onchange="setFurnSort(this.value)">'+FURN_SORTS.map(o=>'<option value="'+o[0]+'"'+(_furnSort===o[0]?' selected':'')+'>'+o[1]+'</option>').join('')+'</select></div>';
        const items=sortFurnItems(ITEM_CATALOG.filter(it=>!isGachaOnlyItem(it.id) && (_shopFurnCat==='all'||placeCatOf(it.id)===_shopFurnCat)));   // 가챠전용 가구는 판매목록에서 숨김(랜덤박스 풀엔 그대로)
        h+=items.map(it=>{
          const price=itemBuyPrice(it.id), enough=coins()>=price, gachaOnly=isGachaOnlyItem(it.id);
          let act, priceHtml;
          if(gachaOnly){
            priceHtml='<span class="price gachaonly">'+boxSvg({h:16})+'<b class="tier-rainbow">랜덤박스 전용</b></span>';
            act='<button class="buy ghost" aria-label="'+it.name+'은 랜덤박스에서 뽑기" '+App.view.act('setShopSub','event')+'>랜덤박스 뽑기</button>';
          } else {
            priceHtml='<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+price+'</span>';
            act=enough?'<button class="buy" aria-label="'+it.name+' 구매('+price+' 은화)" '+App.view.act('buyItem',it.id)+'>구매</button>':'<button class="buy dis" disabled>'+(price-coins())+' 부족</button>';
          }
          const ft=itemTierOf(it.id);
          return '<div class="shopcard"><div class="thumb tbring tb-'+ft+'"><span class="furnfit">'+furnSvg(it.id,{fit:true})+'</span>'+tierBadgeHtml(ft)+'</div>'+
            '<div class="meta"><b>'+it.name+(isWallItem(it.id)?' <span class="tagmini wall">벽</span>':(it.floor?' <span class="tagmini">바닥</span>':''))+'</b><div class="desc">'+it.desc+'</div>'+
            priceHtml+'</div>'+
            '<div class="act">'+act+'<span class="qty">보유 '+itemQty(it.id)+'</span></div></div>';
        }).join('');
        h+='<div class="note"><b>수량 허용</b> 가구는 여러 개 살 수 있어요. <b>특별 등급 이상</b> 가구는 <b>랜덤박스</b>로만 얻어요(알뜰샵 구매 불가). 구매 후 <b>배치</b> 탭에서 격자에 놓습니다.</div>';
      }
      }   // /SHOP_LEGACY_BUYTABS
      return h;
    }
    // ---- 가구 인벤토리/배치 ----
    function itemQty(id){ const it=state.game&&state.game.owned.items[id]; return it?(Number(it.qty)||0):0; }
    function placedList(){ const p=room().placed||{}; return Object.keys(p).map(k=>({key:k, r:+k.split('_')[0], c:+k.split('_')[1], itemId:p[k].itemId, filledAt:p[k].filledAt||null, fillMs:p[k].fillMs||null, flip:!!p[k].flip})); }   // filledAt=먹기/마시기 클립 판정(furnClip), fillMs=그릇 채움 지속(고급사료·정수물 12h) 보존용
    function itemPlaced(id){ return placedList().filter(x=>x.itemId===id).length; }          // 현재 방 배치 수(케어 아이템 방당 상한용)
    function itemPlacedAll(id){ return sumPlacedItem(homeH().rooms, id); }                    // 전 방 배치 합(전역 인벤토리 소진 — 복제 방지)
    function itemRemaining(id){ return itemQty(id)-itemPlacedAll(id); }                       // 남은 수량 = 보유 - 모든 방 배치
    function buyItem(id){
      const it=ITEM_CATALOG.find(x=>x.id===id); if(!it) return;
      if(isGachaOnlyItem(id)){ toast('이 등급은 랜덤박스(가챠)로만 얻을 수 있어요'); setShopSub('event'); return; }
      if(itemQty(id)>=itemCapOf(id)){ toast(it.name+' 최대 보유량이에요(종당 '+itemCapOf(id)+'개)', true); return; }   // 🧰 가구 캡(케어5·기타1) — 구매는 차단(은화 낭비 방지)
      const price=itemBuyPrice(id);
      if(coins()<price){ toast((price-coins())+' 은화 부족', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); if(g.coins<price) return;
        if((Number((g.owned.items[id]||{}).qty)||0)>=itemCapOf(id)) return;   // 캡 재검증(다기기 경합 → abort)
        g.coins-=price; g.owned.items[id]=g.owned.items[id]||{qty:0,boughtAt:new Date().toISOString()};
        g.owned.items[id].qty=(Number(g.owned.items[id].qty)||0)+1; return g;
      }).then(res=>{ if(res.committed) toast(it.name+' 구매! 배치 탭에서 놓아보세요'); else if(itemQty(id)>=itemCapOf(id)) toast(it.name+' 최대 보유량이에요(종당 '+itemCapOf(id)+'개)', true); });
    }
    // ===== 🍚💧 다마고치: 사료·물 소비 / 급여 / 배변 / 똥 수거 =====
    function consumQty(id){ return clampConsum((state.game&&state.game.consum&&state.game.consum[id]))||0; }
    // 소비 아이템 구매(배치 불가) — cur='gold'면 금화, dailyBuy면 하루 구매 상한(간식).
    function buyConsum(id){
      const c=CONSUM_CATALOG.find(x=>x.id===id); if(!c) return;
      const gcur=(c.cur==='gold');
      if(consumQty(id)>=MAX_CONSUM){ toast(c.name+' 최대 보유량이에요('+MAX_CONSUM.toLocaleString()+'개)', true); return; }   // 캡 도달 시 구매 차단
      const free=(c.price<=0);
      if(c.dailyBuy){ const bd=(state.game&&state.game.buyDay)||{}, n=(bd.day===kstDayKey()&&bd.n)?(Number(bd.n[id])||0):0;
        if(n>=c.dailyBuy){ toast(c.name+'은 하루 '+c.dailyBuy+'개까지'+(free?' 받을':' 살')+' 수 있어요', true); return; } }
      if(!free){ if(gcur){ if(gold()<c.price){ toast((c.price-gold())+' 금화 부족', true); return; } }
        else { if(coins()<c.price){ toast((c.price-coins())+' 은화 부족', true); return; } } }
      gameRef().transaction(g=>{ g=normalizeGame(g); if((Number(g.consum[id])||0)>=MAX_CONSUM) return;
        if(c.dailyBuy){ const dk=kstDayKey(); if((g.buyDay&&g.buyDay.day)!==dk) g.buyDay={day:dk,n:{}}; if(!g.buyDay.n) g.buyDay.n={};
          if((Number(g.buyDay.n[id])||0)>=c.dailyBuy) return; g.buyDay.n[id]=(Number(g.buyDay.n[id])||0)+1; }   // 품목별 하루 상한. 실패 시 트랜잭션 abort로 함께 롤백
        if(!free){ if(gcur){ if(g.gold<c.price) return; g.gold=clampGold(g.gold-c.price); }
          else { if(g.coins<c.price) return; g.coins=clampCoins(g.coins-c.price); } }
        g.consum[id]=(Number(g.consum[id])||0)+1; return g;
      }).then(res=>{ if(res.committed) toast(c.name+' +1'); });
    }
    // 소비템의 채움 지속시간(ms) — 고급사료·정수물=12h, 기본=6h(FILL_MS)
    function consumFillMs(id){ const c=CONSUM_CATALOG.find(x=>x.id===id); return (c&&c.effect&&c.effect.ms)||FILL_MS; }
    // 배치된 그릇의 채움 지속(그 그릇을 채운 소비템 기준으로 저장된 fillMs, 없으면 FILL_MS)
    function fillDurOf(p){ return (p&&Number(p.fillMs)>0)?Number(p.fillMs):FILL_MS; }
    // 🌾 수확·급여 자동채움 선호(localStorage) — 기본 사료 ↔ 고급사료 / 물 ↔ 정수물. 보유 없으면 자동 폴백.
    function harvestPref(kind){ const def=(kind==='water')?'water':'food', v=lsGet(kind==='water'?'harvestWater':'harvestFood', def);
      return (v==='food'||v==='water'||v==='food_plus'||v==='water_plus')?v:def; }
    function setHarvestPref(kind, val){ lsSet(kind==='water'?'harvestWater':'harvestFood', val); if(typeof renderCatHouse==='function') renderCatHouse(); }
    // 채움에 쓸 소비템 결정 — 선호(있고 보유>0)면 그 키, 아니면 기본 사료/물>0면 기본, 둘 다 0이면 null. {key, ms} 반환.
    function pickFill(g, kind){ const cs=(g&&g.consum)||{}, base=(kind==='water')?'water':'food', pref=harvestPref(kind);
      const order=(pref&&pref!==base)?[pref,base]:[base];
      for(let i=0;i<order.length;i++){ const k=order[i]; if((Number(cs[k])||0)>0) return { key:k, ms:consumFillMs(k) }; }
      return null; }
    // 채워진 상태인지(채운 뒤 지속시간 이내 — 그릇별 fillMs)
    function isFilled(key){ const p=room().placed[key]; return !!(p&&p.filledAt&&(Date.now()-p.filledAt)<fillDurOf(p)); }
    // 홈에서 밥/물 그릇 탭 → 선호 소비템 1 소모하고 채움(이미 차 있으면 무시)
    function feedBowl(key){
      const p=room().placed[key]; if(!p) return;
      const id=p.itemId; if(id!=='bowl'&&id!=='waterbowl') return;
      if(isFilled(key)){ toast('아직 남아 있어요'); return; }
      const kind=id==='bowl'?'food':'water', nm=id==='bowl'?'사료':'물';
      if(!pickFill(state.game, kind)){ toast(nm+'가 없어요 · 알뜰샵 소비 탭에서 구매', true); return; }
      const rid=curRoomId();   // 보고 있는 방을 id로 겨냥(방 삭제/전환 경합에도 정확)
      gameRef().transaction(g=>{ g=normalizeGame(g);
        const R=gRoomById(g, rid); if(!R.placed[key]) return;
        const pick=pickFill(g, kind); if(!pick) return;
        g.consum[pick.key]-=1; R.placed[key].filledAt=Date.now(); R.placed[key].fillMs=pick.ms; return g;
      }).then(r=>{ if(r&&r.committed) toast(id==='bowl'?'밥을 채웠어요 🍚':'물을 채웠어요 💧'); });
    }
    // 채워진 지 지속시간(fillDurOf) 지난 그릇을 비우고, 비운 개수만큼 똥을 쌓는다(멱등: filledAt 지우면 재발동 안 함)
    let _lastRecon=0;
    function reconcilePets(){
      const g=state.game; if(!g||!g.home) return;
      const now=Date.now();   // 모든 방의 그릇을 점검(안 보는 방도 지속시간 뒤 비워지며 그 방 똥 누적)
      if(now-_lastRecon<3000) return; _lastRecon=now;   // 렌더 경로에서 매 렌더 호출돼도 3초 스로틀(시간 단위 만료 기준이라 지장 없음, 중복 트랜잭션 방지)
      let expired=0; (g.home.rooms||[]).forEach(r=>{ const pl=(r&&r.placed)||{}; Object.keys(pl).forEach(k=>{ const e=pl[k]; if(e&&e.filledAt&&(now-e.filledAt)>=fillDurOf(e)) expired++; }); });
      if(!expired) return;
      gameRef().transaction(gg=>{ if(gg==null) return;   // 자동 발동(사용자 조작 없음) → null 첫 패스에 기본 홈을 제안하지 않음(재접속 clobber 방지)
        gg=normalizeGame(gg); const n=Date.now();
        (gg.home.rooms||[]).forEach(R=>{ const pl=R.placed||{}; let poop=0;
          const hasLitter=Object.keys(pl).some(k=>pl[k]&&pl[k].itemId==='litterbox');   // 화장실 있는 방에서만 똥 누적(없으면 그릇만 비움) — '안 보이는 똥'을 batchCare가 보상하던 문제 차단
          Object.keys(pl).forEach(k=>{ const e=pl[k]; if(e&&e.filledAt&&(n-e.filledAt)>=fillDurOf(e)){ e.filledAt=null; poop++; } });
          if(poop && hasLitter) R.poops=(Number(R.poops)||0)+poop; });
        return gg;
      });
    }
    // 🎁 드랍 스폰 위치 — 가구 점유칸·기존 드랍 칸을 피한 빈 칸(앞쪽 행 우선, 눈에 잘 띄게). 위치를 저장해 모든 기기가 같은 자리를 본다.
    function spawnDropCell(R){
      const occ=occupiedCells(R.placed||{}); (R.drops||[]).forEach(d=>{ if(d) occ[d.r+'_'+d.c]=1; });
      const free=[]; for(let r=1;r<=GRID_ROWS;r++)for(let c=1;c<=GRID_N;c++){ if(!occ[r+'_'+c]) free.push({r:r,c:c}); }
      const front=free.filter(p=>p.r>=3), pool=front.length?front:free;
      return pool.length?pool[Math.floor(Math.random()*pool.length)]:{ r:GRID_ROWS, c:1+Math.floor(Math.random()*GRID_N) };
    }
    // 🎁 드랍 스폰 대상 방 — "한 방"에만 스폰(방 수 배수 인플레 방지, 사용자 확정): 현재 보고 있는 방(home.current, dock·PiP에 보이는 방) 우선,
    //   그 방에 활성 펫이 없으면 활성 펫이 있는 첫 방으로 폴백. 없으면 null(롤 안 함).
    function dropTargetRoom(g){ const rooms=(g.home&&g.home.rooms)||[];
      const cur=rooms[(g.home&&g.home.current)|0];
      if(cur&&(cur.active||[]).length>0) return cur;
      return rooms.find(R=>R&&(R.active||[]).length>0)||null; }
    // 🎁 드랍 스폰 롤 — 1분(DROP_ROLL_MS)마다 HARVEST_ROLL/60 × 행복도 계수(dropMoodFactor) × 💊 영양제 부스트(activeBoostMult) 확률로 대상 방(1곳) 바닥에 드랍(펫알·랜덤박스·뜰알·무지개)을 놓는다. 💰 금화는 바닥 드랍이 아니라 즉시 지갑 적립(캠 표시·5개 상한 없음).
    //   시계 g.dropRollAt은 소비한 롤만큼 전진. 활성 펫이 있으면 방 만석이어도 롤은 계속 돈다(금화는 매 롤 적립) — 그 외 드랍만 만석 시 그 롤 유실. 활성 펫 없으면 시간 보존(24h 캡이 소급 제한).
    //   다기기 동시 실행은 RTDB 트랜잭션 CAS로 안전 — 후발은 갱신된 시계 기준 n≤0 → abort(중복 스폰 없음).
    function reconcileDrops(){
      const g=state.game; if(!g||!g.home) return;
      const now=Date.now();
      if(g.dropRollAt && now-g.dropRollAt<DROP_ROLL_MS) return;   // 로컬 사전점검(불필요 트랜잭션 억제)
      if(!dropTargetRoom(g) && g.dropRollAt) return;   // 활성 펫 없으면 롤 없음(시계는 그대로 — 24h 캡이 소급 제한)
      gameRef().transaction(gg=>{ if(gg==null) return;   // 자동 발동 → null 첫 패스에 기본값 제안 금지(재접속 clobber 방지)
        gg=normalizeGame(gg); const n2=Date.now();
        if(!gg.dropRollAt){ gg.dropRollAt=n2; return gg; }   // 최초 1회 초기화 — 배포 직후 거대 소급 윈드폴 방지(ensureHarvestClocks 패턴)
        const t=Math.max(gg.dropRollAt, n2-24*3600000);   // 24h 캡
        const n=Math.min(DROP_ROLL_CAP, Math.floor((n2-t)/DROP_ROLL_MS)); if(n<=0) return;
        let used=0;
        const boost=activeBoostMult(gg);   // 💊 영양제 부스트(1.5× 등)를 드랍 확률에도 적용 — 은화 수확(effYieldMult)과 동일하게 드랍템에도 부스트 반영(사용자 지침).
        for(let i=0;i<n;i++){
          const R=dropTargetRoom(gg);
          if(!R) break;   // 활성 펫/방 없음 → 롤 중단(시간 보존). ⚠️ 만석이어도 계속 돈다 — 금화는 바닥 슬롯과 무관하게 매 롤 즉시 적립(아래).
          used++;
          // 💗 행복도→드랍률 보너스 배수(기본 확률에 행복도만큼 더해줌, 100=×2.0·66=×1.6·10미만=×1.0) × 💊 영양제 부스트 — reconcileDrops 롤에 곱한다.
          const mf=dropMoodFactor(roomMood(roomMoodInputs(gg, R)));
          Object.keys(HARVEST_ROLL).forEach(k=>{ if(Math.random()>=HARVEST_ROLL[k]/DROP_ROLL_DIV*mf*boost) return;
            if(k==='gold'){ gg.pendingGold=Math.min(999999,(Number(gg.pendingGold)||0)+1); return; }   // 💰 금화 = 수확 대기 버킷에 누적(수확 눌러야 지갑에 들어오고 팝업에 표기 — 은화 유휴수확과 동일). 바닥 드랍·캠·5개 상한 없음.
            if((R.drops||[]).length>=DROP_MAX_ROOM) return;   // 그 외 드랍(펫알·랜덤박스·뜰알·무지개)만 방 5개 상한 — 만석이면 그 드랍만 이번 롤 유실(금화는 위에서 이미 적립)
            const at=t+used*DROP_ROLL_MS, p=spawnDropCell(R);
            R.drops=R.drops||[]; R.drops.push({ id:'d'+at.toString(36)+Math.floor(Math.random()*1679616).toString(36), kind:k, at:at, r:p.r, c:p.c }); });
        }
        if(!used) return;   // 소비한 롤 없음 → abort(시계 그대로)
        gg.dropRollAt=(used===n)?n2:(t+used*DROP_ROLL_MS);
        return gg;
      });
    }
    // 💎 드랍 스폰 순간 연출 — 보이는 캠(dock·홈 방·Document PiP)에 랜덤박스 배너의 거대 무지개 다이아(tDiaLayersHtml)를
    //   스르르 페이드 인 → 잠깐 유지 → 아웃(원샷, CSS dropgemvisit). 방 컨셉을 해치는 과한 연출 대신 이것만(사용자 확정).
    let _dropGemAt=0;
    function dropSpawnGemFx(){
      const now=Date.now(); if(now-_dropGemAt<10000) return; _dropGemAt=now;   // 쿨다운 10s — 소급 스폰 여러 개가 한 번에 와도 도배 방지
      try{ if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; }catch(e){}
      if(document.body.classList.contains('lite')) return;
      const hosts=[];
      if(dockMode()!=='hidden' && !document.body.classList.contains('sheet-open')){ const d=document.querySelector('#catdock .cd-room'); if(d) hosts.push(d); }
      const hr=document.getElementById('catRoom'); if(hr) hosts.push(hr);
      if(typeof pipOpen==='function' && pipOpen() && _pip.room) hosts.push(_pip.room);
      hosts.forEach(function(h){ if(h.querySelector('.cr-dropgem')) return;
        const el=(h.ownerDocument||document).createElement('div'); el.className='cr-dropgem'; el.innerHTML=tDiaLayersHtml(0.55);
        h.appendChild(el); setTimeout(function(){ try{ el.remove(); }catch(e){} }, 3400); });
    }
    // 🎁 드랍 적립(트랜잭션 내부 전용) — 실제 적립량 반환(금화/소비템/무지개동전 상한 캡 절단 감지). 클릭 수집·수확 일괄이 공용.
    //   🌈 무지개동전=g.rbcoin +1 · 무지개알/무지개박스=g.rbcoin +RB_EGG_BOX_RBC(5, 1뽑 분량) · 랜덤박스=봉인 그대로 consum.box(2026-07: 즉석 개봉 폐지).
    function creditDropKind(g, kind){
      if(kind==='gold'){ const b=g.gold||0; g.gold=clampGold(b+1); return g.gold-b; }
      if(kind==='rbcoin'){ const b=Number(g.rbcoin)||0; grantRbcoin(g,1); return (Number(g.rbcoin)||0)-b; }
      if(kind==='rainbow_egg'||kind==='rainbow_box'){ const b=Number(g.rbcoin)||0; grantRbcoin(g,RB_EGG_BOX_RBC); return (Number(g.rbcoin)||0)-b; }
      const b=Number(g.consum[kind])||0, q=clampConsum(b+1); g.consum[kind]=q; return q-b;   // egg/box/ddeul 봉인 소비템
    }
    // 🎁 드랍 종류 → 표시 정보(아이콘·이름). 수확 결과 팝업·토스트 공용. rbc=무지개동전 지급량(무지개알/박스=5·동전=1).
    function dropDisplay(kind){
      switch(kind){
        case 'gold':        return { ic:goldSvg({h:16}),          nm:'금화',       rb:false };
        case 'egg':         return { ic:eggSvg(0,{h:16}),         nm:'펫알',       rb:false };
        case 'box':         return { ic:boxSvg({h:16}),           nm:'랜덤박스',   rb:false };
        case 'ddeul':       return { ic:(typeof ddeulEggSvg==='function'?ddeulEggSvg({h:16}):eggSvg(0,{h:16})), nm:'뜰알', rb:false };
        case 'rbcoin':      return { ic:rainbowCoinSvg({h:16}),   nm:'무지개동전', rb:true };
        case 'rainbow_egg': return { ic:rainbowEggSvg({h:16}),    nm:'무지개알',   rb:true };
        case 'rainbow_box': return { ic:rainbowBoxSvg({h:16}),    nm:'무지개박스', rb:true };
      }
      return { ic:'', nm:kind, rb:false };
    }
    // 🎁 박스 개봉 결과 원샷 연출 — 획득 아이템 아트(가구=도트 SVG·벽지/바닥=스와치)가 떠오르며 트윙클(.dropfx 재사용, 최대 3개)
    function boxRewardFx(x, y, list){ if(!list||!list.length) return;
      try{ if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; }catch(e){}
      const show=list.slice(0,3);
      show.forEach((res,i)=>{ const el=document.createElement('div'); el.className='dropfx';
        const spark=(typeof sparkSvg==='function')?('<span class="dropfx-tw">'+sparkSvg({h:14})+'</span>'):'';
        el.innerHTML=rewardBoxArtH(res, 30)+spark;
        const off=(i-(show.length-1)/2)*36;
        el.style.left=((x||innerWidth/2)+off)+'px'; el.style.top=(y||innerHeight/2)+'px'; el.style.animationDelay=(i*90)+'ms';
        document.body.appendChild(el); setTimeout(()=>el.remove(), 1350+i*90);
      });
    }
    // 🎁 드랍 클릭 수집 — 캠(dock·홈)·Document PiP 공용. id로 찾아 제거하므로 다기기 중복 수집 안전(없으면 abort).
    //   📦 랜덤박스 드랍은 즉석 개봉하지 않고 봉인 그대로 가방(consum.box)에 넣는다(2026-07 변경 — 이후 가챠 배너에서 열기). 🌈 무지개동전·무지개알/박스는 g.rbcoin 적립.
    function collectDrop(ev, rid, dropId){
      if(ev){ ev.stopPropagation(); }
      const fromPip=!!(ev&&ev.view&&ev.view!==window);   // PiP 창 클릭 — 메인 문서 좌표계가 아니라 위치 연출 생략(토스트만)
      const x=ev?ev.clientX:innerWidth/2, y=ev?ev.clientY:innerHeight/2;
      const before=coins(), beforeGold=gold(); let got=null;
      gameRef().transaction(g=>{ g=normalizeGame(g); got=null;   // 재시도마다 리셋 → 커밋된 실행값만 남음
        const R=gRoomById(g, rid); if(!R) return;
        const i=(R.drops||[]).findIndex(d=>d&&d.id===dropId); if(i<0) return;   // 이미 수집됨(다른 기기/중복 탭) → abort
        const d=R.drops[i]; const n=creditDropKind(g, d.kind);
        if(n>0) R.drops.splice(i,1);   // 🛟 보관 한도 도달(n=0)이면 드랍을 남겨 다음에 다시 시도 가능(예전엔 splice 먼저 해서 캡에 걸린 드랍이 지급 없이 소멸)
        got={ kind:d.kind, n }; return g;
      }).then(r=>{ if(!(r&&r.committed&&got)) return;
        if(got.n<=0){ toast('보관 한도가 가득해요', true); return; }   // MAX_CONSUM/MAX_GOLD/MAX_RBCOIN 캡 절단
        const disp=dropDisplay(got.kind), rbBoxEgg=(got.kind==='rainbow_egg'||got.kind==='rainbow_box');
        const label=(disp.rb?'🌈 ':'')+disp.nm+' +'+(rbBoxEgg?1:got.n)+(rbBoxEgg?' · 무지개동전 +'+got.n:'');
        if(fromPip){ toast(label); return; }
        if(got.kind==='gold'){ rewardFly(x,y,0,1,before,beforeGold); toast(label); }
        else { const d={}; d[got.kind]=1; harvestDropFx(x,y,d); toast(label);
          if(got.kind==='box' && state._sheetRefresh && $('sheet') && $('sheet').classList.contains('on')) state._sheetRefresh(); }   // 가방 인벤토리 즉시 반영
      });
    }
    // 똥 수거 → 은화 +2, 작은 획득 연출
    function collectPoop(e){
      if(e){ e.stopPropagation(); }
      const x=e?e.clientX:innerWidth/2, y=e?e.clientY:innerHeight/2, rid=curRoomId();
      gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoomById(g, rid); if((Number(R.poops)||0)<=0) return;
        R.poops=(Number(R.poops)||0)-1; g.coins=clampCoins((g.coins||0)+POOP_REWARD); return g;
      }).then(r=>{ if(r&&r.committed){ poopFx(x,y); walletShow(); } });   // 👛 은화 획득이므로 트랜지언트 지갑도 잠깐 표시
    }
    function poopFx(x,y){ const el=document.createElement('div'); el.className='poopfx';
      el.innerHTML='<span class="pi">'+coinSvg({h:14})+'</span>+'+POOP_REWARD;
      el.style.left=x+'px'; el.style.top=y+'px'; document.body.appendChild(el);
      setTimeout(()=>{ el.remove(); }, 950); }
    // 연출 도착점 지갑: 시트(알뜰홈 방)가 열려 있으면 방 캠 지갑, 아니면 dock 캠 지갑
    function walletEl(){
      const open=$('sheet')&&$('sheet').classList.contains('on');
      if(open){ const w=document.querySelector('#catRoom .cd-wallet'); if(w) return w; }
      return document.querySelector('#catdock .cd-wallet');
    }
    function coinTarget(){ const w=walletEl(); return (w&&w.querySelector('.cw-coin')) || document.querySelector('#catdock .cd-cam'); }
    // 재화 픽셀이 (x,y)에서 지갑 카운터로 날아 들어가는 연출(kind: coin=은화·gold=금화)
    function flyCurrency(x,y,n,kind,w){
      const target=w&&w.querySelector(kind==='gold'?'.cw-gold':'.cw-coin'); if(!target) return;
      const tr=target.getBoundingClientRect(), tx=tr.left+tr.width/2, ty=tr.top+tr.height/2;
      const k=Math.max(1,Math.min(8,n)), svg=(kind==='gold'?goldSvg:coinSvg)({h:15});
      for(let i=0;i<k;i++){ const el=document.createElement('div'); el.className='coinfly'; el.innerHTML=svg;
        const ox=x+(Math.random()*26-13), oy=y+(Math.random()*14-7);
        el.style.left=ox+'px'; el.style.top=oy+'px';
        el.style.setProperty('--tx',(tx-ox).toFixed(0)+'px'); el.style.setProperty('--ty',(ty-oy).toFixed(0)+'px');
        el.style.animationDelay=(i*0.05).toFixed(2)+'s'; document.body.appendChild(el);
        setTimeout(()=>{ el.remove(); }, 760+i*50); }
    }
    // 화면의 모든 지갑 카운터 숫자를 현재 표시값(_walletDisp 우선)으로 동기화
    function syncWalletText(){ document.querySelectorAll('.cd-wallet').forEach(function(w){
      const cN=w.querySelector('.cw-coin .cw-n'), gN=w.querySelector('.cw-gold .cw-n');
      if(cN) cN.textContent=walletCoinDisp().toLocaleString(); if(gN) gN.textContent=walletGoldDisp().toLocaleString(); }); }
    function walletHold(key,val){ _walletGen[key]++; _walletDisp[key]=(val==null?null:Math.round(val)); syncWalletText(); }   // 표시값 고정(진행중 애니 취소)
    // 표시값을 from→to로 스르르 올림. _walletDisp에 진행값을 담아 재렌더/rehtml이 끼어들어도 롤업이 끊기지 않음.
    function walletRoll(key, from, to){
      from=Number(from)||0; to=Number(to)||0; const g=++_walletGen[key];
      if(from===to){ _walletDisp[key]=null; syncWalletText(); return; }
      _walletDisp[key]=from; const t0=Date.now(), dur=620;
      (function step(){ if(g!==_walletGen[key]) return; const p=Math.min(1,(Date.now()-t0)/dur), v=Math.round(from+(to-from)*p);
        _walletDisp[key]=(p<1?v:null); syncWalletText(); if(p<1) requestAnimationFrame(step); })();
    }
    // 쓰다듬기·돌보기 보상: 은화(dCoins)·금화(dGold)가 지갑으로 날아가고, 날아오는 동안 옛값을 유지하다 도착 즈음 현재값으로 실시간 카운트업
    function rewardFly(x,y,dCoins,dGold,prevCoins,prevGold){
      const w=walletEl(); if(!w) return;
      walletShow();   // 👛 숨겨둔 지갑을 먼저 표시(트랜지언트) — display:none 상태에선 coinTarget 좌표가 0이라, 다음 프레임에 좌표를 재서 발사
      if(dCoins>0) walletHold('coins',prevCoins);   // 도착 전엔 옛값 고정(새값 깜빡임 방지)
      if(dGold>0)  walletHold('gold', prevGold);
      requestAnimationFrame(function(){   // 표시 후 reflow 끝난 다음 프레임에 지갑 좌표 측정
        const wNow=walletEl()||w;   // 프레임 사이 재렌더로 노드가 교체됐을 수 있어 재조회(detached rect 0 방지)
        if(dCoins>0) flyCurrency(x,y,dCoins,'coin',wNow);
        if(dGold>0)  flyCurrency(x,y,dGold,'gold',wNow);
      });
      setTimeout(function(){   // 코인이 도착할 즈음 카운트업 시작
        if(dCoins>0) walletRoll('coins', prevCoins, coins());
        if(dGold>0)  walletRoll('gold',  prevGold,  gold());
        const w2=walletEl(); if(w2){ w2.classList.add('bump'); setTimeout(()=>w2.classList.remove('bump'),320); }
      }, 430);
    }
    // 은화 전용 날아오기(prev 미상 호출자용) — 카운트업 없이 날아가기+톡
    function coinFlyFx(x,y,n){ const w=walletEl(); if(!w) return; walletShow();
      requestAnimationFrame(function(){ flyCurrency(x,y,n,'coin',walletEl()||w); });   // 표시 후 다음 프레임에 좌표 측정 + 노드 재조회(트랜지언트 지갑)
      setTimeout(()=>{ const w2=walletEl(); if(w2){ w2.classList.add('bump'); setTimeout(()=>w2.classList.remove('bump'),320); } }, 430); }
    // 🌾 유휴 은화 — 행복도 기반 자동수익. 펫이 자동 상호작용하는 가구(INTERACTIVE_FURN — furnSpot 옆 단일 소스)는 행복도의 enrichment(종류)로만 반영(도배 무의미).
    // 🪴 enrichment '종류' 수 — 상호작용 가구 중 케어템(밥·물·화장실) 제외한 고유 itemId 개수. 행복도 enrichment(2종 포화)용. 같은 종류 여러 개 놔도 1.
    function enrichTypeCount(R){ const set={}; const scan=o=>{ o=o||{}; Object.keys(o).forEach(k=>{ const id=o[k]&&o[k].itemId; if(id&&INTERACTIVE_FURN[id]&&CARE_ITEMS.indexOf(id)<0) set[id]=1; }); }; scan(R&&R.placed); scan(R&&R.wallPlaced); return Object.keys(set).length; }
    // 🔺 전역 자동수익 배율(1.0~2.0) — 애정 총량 + 도감 수집률 + 앱 사용(가계부·할일 기록). 수확마다 1회 계산해 모든 방에 공유.
    function _yieldMult(g){ if(!g) return 1; const own=(g.owned&&g.owned.cats)||{};
      const dexPct=(dexProgress(own, dexCatIds())||{}).pct||0;
      const affLv=totalAffectionLv(own, id=>CAT_TIER[id]||'normal');
      return yieldMultiplier(dexPct, affLv, recordDaysThisWeek(), recordedToday()); }
    // 💊 영양제 부스트 배율 — 활성(until>now)이면 g.boost.mult, 아니면 1. 남은시간(ms)도 boostRemain로 조회.
    function activeBoostMult(g){ const b=g&&g.boost; return (b&&Number(b.until)>Date.now())?(Number(b.mult)||1):1; }
    function boostRemain(g){ const b=g&&g.boost; return (b&&Number(b.until)>Date.now())?(Number(b.until)-Date.now()):0; }
    // 유효 수익배율 = 전역배율(애정·도감·앱사용) × 부스트배율. 유휴 은화 산출 3경로가 공유.
    function effYieldMult(g){ return _yieldMult(g)*activeBoostMult(g); }
    // 방의 현재까지 쌓인 유휴 은화(harvestAt 이후 경과). g=game, R=room, mult=유효 배율(미전달 시 계산). util.roomYield(순수·행복도 기반).
    function roomIdleYield(g, R, mult){ if(!g||!R) return 0; const ha=Number(R.harvestAt)||0; if(!ha) return 0;
      const affLevels=(R.active||[]).map(id=>affectionLevel(((g.owned&&g.owned.cats[id])||{}).affection||0, CAT_TIER[id]||'normal').level);
      const mood=roomMood(roomMoodInputs(g, R));
      return roomYield(affLevels, mood, Date.now()-ha, (mult==null?effYieldMult(g):mult)); }
    // 접속 시 방별 harvestAt(수확시계)을 1회 초기화(0인 방만 now로) — 첫 로드 때 거대한 미수확분이 잡히는 것 방지. 멱등.
    let _harvestInit=false;
    function ensureHarvestClocks(){ if(_harvestInit) return; const g=state.game; if(!g||!g.home||!g.home.rooms) return;
      if(!g.home.rooms.some(r=>!(Number(r&&r.harvestAt)||0))) { _harvestInit=true; return; }   // 이미 다 세팅
      _harvestInit=true;
      gameRef().transaction(gg=>{ if(gg==null) return; gg=normalizeGame(gg); const now=Date.now();
        (gg.home.rooms||[]).forEach(R=>{ if(!(Number(R.harvestAt)||0)) R.harvestAt=now; }); return gg; }); }
    // 🌾 수확(구 돌보기): 유휴 가구수익을 받고 + 편의로 빈 그릇 채우기·똥 치우기까지 한 번에. harvestAt=now로 리셋.
    // 🎁 수확 드롭 원샷 연출 — 주운 펫알/랜덤박스/뜰알/🌈무지개 아이콘이 살짝 떠오르며 트윙클(도트·원샷). 뜰알·무지개는 별 버스트 추가(가장 화려). 모션축소면 생략.
    function dropFxArt(k){
      if(k==='box') return boxSvg({h:26});
      if(k==='ddeul') return ddeulEggSvg({h:28});
      if(k==='rbcoin') return rainbowCoinSvg({h:26});
      if(k==='rainbow_egg') return rainbowEggSvg({h:26});
      if(k==='rainbow_box') return rainbowBoxSvg({h:26});
      return eggSvg(0,{h:26});   // egg
    }
    function harvestDropFx(x, y, d){ if(!d) return;
      try{ if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; }catch(e){}
      const items=[]; ['egg','box','ddeul','rbcoin','rainbow_egg','rainbow_box'].forEach(k=>{ for(let i=0;i<(Number(d[k])||0);i++) items.push(k); });
      if(!items.length) return;
      const cx=(x||innerWidth/2), cy=(y||innerHeight/2), show=items.slice(0,6);   // 최대 6개만 표시(도배 방지)
      show.forEach((k,i)=>{
        const rb=(k==='rbcoin'||k==='rainbow_egg'||k==='rainbow_box');
        const el=document.createElement('div'); el.className='dropfx'+((k==='ddeul'||rb)?' dropfx-ddeul':'');
        const spark = (typeof sparkSvg==='function')?('<span class="dropfx-tw">'+sparkSvg({h:14})+'</span>'):'';
        el.innerHTML=dropFxArt(k)+spark;
        const off=(i-(show.length-1)/2)*28;
        el.style.left=(cx+off)+'px'; el.style.top=cy+'px'; el.style.animationDelay=(i*70)+'ms';
        document.body.appendChild(el); setTimeout(()=>el.remove(), 1350+i*70);
        if((k==='ddeul'||rb) && typeof starBurst==='function') starBurst(cx+off, cy);   // 뜰알·무지개는 별 버스트 추가(가장 화려)
      });
    }
    // 🌾 수확 획득량 플로팅 — 수확 버튼 근처에서 은화(+금화) 픽셀 아이콘과 "+N"이 떠오르며 페이드(도트·원샷).
    //   지갑이 평소 숨김(트랜지언트)이라 획득량이 즉시 눈에 들어오도록 버튼 쪽에 한 번 더 표기. 모션축소면 CSS가 정지 표시.
    function yieldFloatFx(x, y, n, gd){ if(!(n>0) && !(gd>0)) return;
      const el=document.createElement('div'); el.className='yieldfloat';
      let h='';
      if(n>0)  h+='<span class="yf-row">'+coinSvg({h:14})+'<b>+'+Number(n).toLocaleString()+'</b></span>';
      if(gd>0) h+='<span class="yf-row">'+goldSvg({h:14})+'<b>+'+Number(gd).toLocaleString()+'</b></span>';
      el.innerHTML=h;
      el.style.left=(x||innerWidth/2)+'px'; el.style.top=(y||innerHeight/2)+'px';
      document.body.appendChild(el); setTimeout(()=>el.remove(), 1250);
    }
    function allRoomsIdleYield(g){ if(!g||!g.home||!Array.isArray(g.home.rooms)) return 0; const mult=effYieldMult(g); let s=0; g.home.rooms.forEach(R=>{ s+=roomIdleYield(g,R,mult); }); return s; }   // 배율 1회 계산 후 공유(부스트 포함)
    // 🎁 수확 결과 팝업 호스트 = 수확한 캠 방(.cd-room/.catroom). btnEl 없으면(예: PiP 소형 버튼) dock/홈 방으로 폴백.
    function harvestPopHost(btnEl){
      if(btnEl&&btnEl.closest){ const r=btnEl.closest('.cd-room')||btnEl.closest('.catroom'); if(r) return r; }
      return document.querySelector('#catRoom .catroom') || document.querySelector('#catdock .cd-room');
    }
    // 🎁 수확 결과 "작은 창" — 캠 안에 이번에 주운 아이템·재화를 요약해 띄우고 [줍기] 버튼으로 닫는다(사용자 지침). 아이템 드랍이 있을 때만.
    //   무지개(동전·무지개알·무지개박스)가 섞이면 rb 클래스로 무지개 테두리(무지개빛 수확).
    function showHarvestPopup(host, rows, hasRb, foot){
      if(!host||!rows||!rows.length) return;
      host.querySelectorAll('.cr-harvest-pop').forEach(e=>{ try{ e.remove(); }catch(_){} });   // 연속 수확 중복 제거
      const doc=host.ownerDocument||document;
      const el=doc.createElement('div'); el.className='cr-harvest-pop'+(hasRb?' rb':'');
      const list=rows.map(r=>'<div class="chp-row"><span class="chp-ic">'+r.ic+'</span><span class="chp-nm">'+r.nm+'</span><b class="chp-n">+'+r.n+'</b>'+(r.note?'<span class="chp-note">'+r.note+'</span>':'')+'</div>').join('');
      el.innerHTML='<div class="chp-title">'+(hasRb?'🌈 ':'🌾 ')+'수확했어요</div><div class="chp-list">'+list+'</div>'+(foot?'<div class="chp-foot">'+foot+'</div>':'')+'<button class="chp-btn" type="button">줍기</button>';
      const close=()=>{ try{ el.remove(); }catch(_){} };
      const btn=el.querySelector('.chp-btn'); if(btn) btn.addEventListener('click', function(ev){ ev.stopPropagation(); close(); });
      host.appendChild(el);
      setTimeout(close, 12000);   // 안전 자동 닫힘
    }
    // 🌾 수확: 모든 방을 한 번에 — 유휴 가구수익 + 빈 밥/물그릇 채움 + 똥 치움(현재 방 먼저 채워 소모품 부족 시 보이는 방 우선).
    function batchCare(btnEl){
      if(!state.game){ return; }
      const before=coins(), beforeGold=gold(); let filledN=0, shortFood=false, shortWater=false, goldBonus=0, dropCounts={};
      gameRef().transaction(g=>{ g=normalizeGame(g); const now=Date.now(); const rooms=g.home.rooms||[], cur=g.home.current|0;
        filledN=0; shortFood=false; shortWater=false; goldBonus=0; dropCounts={};   // 재실행(Firebase 재시도)마다 리셋 → 커밋된 마지막 실행값이 남음
        const order=[]; if(rooms[cur]) order.push(cur); rooms.forEach((_,i)=>{ if(i!==cur) order.push(i); });   // 현재 방 우선(소모품 부족 시)
        const mult=effYieldMult(g);   // 유효 수익배율(애정·도감·앱사용 × 부스트) 1회 스냅샷 — 방마다 재계산 방지·재시도 시 동일 g에서 동일값
        order.forEach(i=>{ const R=rooms[i]; if(!R) return; const pl=R.placed||{};
          const y=roomIdleYield(g, R, mult); if(y>0) g.coins=clampCoins(g.coins+y); R.harvestAt=now; R.caredAt=now;   // 유휴 은화(행복도 기반) + 시계 리셋 + 행복도 수확신선도 갱신(눌러야 오름)
          Object.keys(pl).forEach(k=>{ const e=pl[k]; if(!e) return; const filled=e.filledAt&&(now-e.filledAt)<fillDurOf(e);
            if(!filled){ const kind=e.itemId==='bowl'?'food':(e.itemId==='waterbowl'?'water':null); if(!kind) return;
              const pick=pickFill(g, kind);   // 선호(고급사료/정수물) 우선, 소진 시 기본으로 폴백
              if(pick){ g.consum[pick.key]-=1; e.filledAt=now; e.fillMs=pick.ms; filledN++; }
              else if(kind==='food') shortFood=true; else shortWater=true; } });
          const poops=Number(R.poops)||0; if(poops>0){ g.coins=clampCoins(g.coins+poops*POOP_REWARD); R.poops=0; }
        });
        // 🎁 대기 드랍 일괄 수령 — 실시간 스폰(reconcileDrops)으로 방 바닥에 놓인 드랍을 수확이 싹쓸이. (구 '수확 순간 시간당 롤'은 실시간 스폰으로 대체 — 이중 회계 금지)
        //   📦 랜덤박스는 봉인 그대로 가방(consum.box) · 🌈 무지개동전/무지개알/무지개박스는 g.rbcoin 적립(2026-07: 박스 즉석 개봉 폐지). creditDropKind가 종류별 적립.
        { const g0=g.gold||0;
          rooms.forEach(R=>{ if(!R||!(R.drops||[]).length) return;
            const keep=[];
            R.drops.forEach(d=>{ if(!d) return; const n=creditDropKind(g, d.kind);
              if(n>0) dropCounts[d.kind]=(dropCounts[d.kind]||0)+1;   // 실제 적립된 드랍만 집계(개수 기준 — 팝업 표기 그대로)
              else keep.push(d); });   // 🛟 보관 한도 도달로 못 받은 드랍은 남겨 다음 수확에 재시도(예전엔 전부 비워 소멸 + 팝업엔 받은 것처럼 표기)
            R.drops=keep; });
          const pg=Math.max(0, Math.floor(Number(g.pendingGold)||0));   // 💰 그동안 모인 금화(reconcileDrops 누적)를 수확 시 지갑으로 → goldBonus에 포함돼 팝업·토스트에 '금화 +N' 표기
          if(pg>0){ g.gold=clampGold((g.gold||0)+pg); g.pendingGold=0; }
          goldBonus=(g.gold||0)-g0;
        }
        return g;
      }).then(r=>{ if(!r||!r.committed) return;
        const nowCoins=(r.snapshot&&r.snapshot.val()&&r.snapshot.val().coins)||before, gained=nowCoins-before;
        // 🎯 연출 앵커 = 수확한 캠 방(.cd-room/.catroom) 내부의 상단부(높이 32%) — 캠 중앙보다 살짝 위에서 보이게(사용자 지침, 버튼 기준은 화면 위로 벗어나 보였음)
        let x=innerWidth/2, y=200;
        if(btnEl&&btnEl.getBoundingClientRect){
          const room=(btnEl.closest&&(btnEl.closest('.cd-room')||btnEl.closest('.catroom')))||null;
          if(room){ const rr=room.getBoundingClientRect(); x=rr.left+rr.width/2; y=rr.top+rr.height*0.32; }
          else { const b=btnEl.getBoundingClientRect(); x=b.left; y=b.bottom+100; }
        }
        const short=(shortFood&&shortWater)?'사료·물':(shortFood?'사료':(shortWater?'물':''));
        const DROP_ORDER=['egg','box','ddeul','rbcoin','rainbow_egg','rainbow_box'];
        const anyItemDrop=DROP_ORDER.some(k=>dropCounts[k]>0);
        const hasRb=!!(dropCounts.rbcoin||dropCounts.rainbow_egg||dropCounts.rainbow_box);
        // 재화 플로팅(은화·금화가 지갑으로 날아가 카운트업) — 아이템 유무와 무관하게 juice 유지
        if(gained>0||goldBonus>0){ rewardFly(x,y, gained, goldBonus, before, beforeGold);
          if(typeof yieldFloatFx==='function') yieldFloatFx(x, y-22, gained, goldBonus); }
        if(anyItemDrop || goldBonus>0){   // 💰 금화 수확이 있으면(아이템 없어도) 요약 팝업으로 은화·금화·아이템을 함께 보여준다(사용자 지침)
          // 🎁 작은 창 요약(줍기 버튼) — 어떤 템을 수확했고 재화를 얼마나 받았는지
          const rows=[];
          if(gained>0)    rows.push({ ic:coinSvg({h:16}), nm:'은화', n:gained });
          if(goldBonus>0) rows.push({ ic:goldSvg({h:16}), nm:'금화', n:goldBonus });
          DROP_ORDER.forEach(k=>{ const c=dropCounts[k]||0; if(c<=0) return; const disp=dropDisplay(k);
            rows.push({ ic:disp.ic, nm:disp.nm, n:c, note:(k==='rainbow_egg'||k==='rainbow_box')?('🌈동전 +'+(c*RB_EGG_BOX_RBC)):'' }); });
          const foot=(filledN>0?'밥·물 '+filledN+'칸 채움':'')+((filledN>0&&short)?' · ':'')+(short?short+' 부족(일부 미충전)':'');
          showHarvestPopup(harvestPopHost(btnEl), rows, hasRb, foot);
        }
        else if(gained>0 || filledN>0){
          if(goldBonus>0 || filledN>0 || short){   // 은화만 얻은 평범한 수확은 토스트 생략(플로팅+지갑 카운트업이 대신) — 부가 정보 있을 때만
            let msg='🌾 전체 수확 완료'+(gained>0?' · +'+gained+' 은화 🪙':'')+(goldBonus>0?' · +'+goldBonus+' 금화 🥇':'')+(filledN>0?' · 밥/물 '+filledN+'칸':'')+(short?' · '+short+' 부족(일부 미충전)':'');
            toast(msg); } }
        else if(short) toast('🌾 '+short+'이 없어요 · 알뜰샵 소비 탭에서 구매', true);
        else toast('🌾 아직 모인 게 없어요 (상호작용 가구를 놓아보세요)');
      });
    }
    // 벽지 구매(구매 시 자동 적용) / 적용
    function buyWall(id){
      const w=WALLPAPER_CATALOG.find(x=>x.id===id); if(!w) return;
      if(isGachaOnlyWall(id)){ toast('특별↑ 벽지는 랜덤박스로만 나와요'); if(typeof setShopSub==='function') setShopSub('event'); return; }
      if(ownsWall(id)){ applyWall(id); return; }
      const wp=wallBuyPrice(id);
      if(coins()<wp){ toast((wp-coins())+' 은화 부족', true); return; }
      const rid=curRoomId();   // 자동 적용도 보고 있는 방을 id로 겨냥
      gameRef().transaction(g=>{ g=normalizeGame(g); if(g.coins<wp||g.owned.wallpapers[id]) return;
        g.coins-=wp; g.owned.wallpapers[id]={boughtAt:new Date().toISOString()}; gRoomById(g, rid).wallpaper=id; return g;
      }).then(res=>{ if(res.committed) toast(w.name+' 벽지 적용! 🎨'); });
    }
    function applyWall(id){ if(!ownsWall(id)){ toast('먼저 구매하세요', true); return; } if(typeof captureUndo==='function') captureUndo(); roomTx(curRoomId(), roomIdx(), R=>{ R.wallpaper=id; }); toast('벽지를 적용했어요'); }   // 되돌리기 지원(가구 5경로와 동일)
    function buyFloor(id){ const f=FLOOR_CATALOG.find(x=>x.id===id); if(!f) return; if(ownsFloor(id)){ applyFloor(id); return; }
      if(isGachaOnlyFloor(id)){ toast('특별↑ 바닥은 랜덤박스로만 나와요'); if(typeof setShopSub==='function') setShopSub('event'); return; }
      const fp=floorBuyPrice(id);
      if(coins()<fp){ toast((fp-coins())+' 은화 부족', true); return; }
      const rid=curRoomId();   // 자동 적용도 보고 있는 방을 id로 겨냥
      gameRef().transaction(g=>{ g=normalizeGame(g); g.owned.floors=g.owned.floors||{}; if(g.coins<fp||g.owned.floors[id]) return;
        g.coins-=fp; g.owned.floors[id]={boughtAt:new Date().toISOString()}; gRoomById(g, rid).floor=id; return g;
      }).then(res=>{ if(res.committed) toast(f.name+' 바닥 적용!'); });
    }
    function applyFloor(id){ if(!ownsFloor(id)){ toast('먼저 구매하세요', true); return; } if(typeof captureUndo==='function') captureUndo(); roomTx(curRoomId(), roomIdx(), R=>{ R.floor=id; }); toast('바닥을 적용했어요'); }   // 되돌리기 지원
    // 배치 에디터용 스킨 선택기 — 방꾸미기=바닥·벽꾸미기=벽지. 보유한 것만 스와치로 보여주고 탭하면 현재 방에 바로 적용.
    function skinPickerHtml(kind){
      const isFloor=kind==='floor';
      const cat=isFloor?FLOOR_CATALOG:WALLPAPER_CATALOG, owns=isFloor?ownsFloor:ownsWall, cur=isFloor?currentFloor():currentWall(), cssOf=isFloor?floorCss:wallCss, fn=isFloor?'applyFloor':'applyWall', lab=isFloor?'바닥':'벽지';
      const owned=cat.filter(x=>owns(x.id));
      const sw=owned.map(x=>{ const on=cur===x.id;
        return '<button class="skinsw'+(on?' on':'')+'" onclick="'+fn+'(\''+x.id+'\')" aria-label="'+escapeHtml(x.name)+(on?' 적용됨':' 적용')+'"><span class="sw" style="background:'+cssOf(x.id)+'"></span><span class="nm">'+escapeHtml(x.name)+'</span>'+(on?'<i class="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></i>':'')+'</button>'; }).join('');
      return '<div class="skinsel"><div class="skinlab">'+lab+' 선택 <span class="sc">보유 '+owned.length+'</span></div><div class="skinrow">'+sw+'</div><div class="skinhint">탭하면 이 방에 바로 적용돼요. 더 많은 '+lab+'은 알뜰샵·랜덤박스에서 얻어요.</div></div>';
    }

