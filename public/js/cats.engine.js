    // ================= 전역 dock (얇은 스트립 / 숨김) =================
    // #catdock 은 index.html 셸의 #content 형제 → 리렌더 영향 없음(애니메이션 유지)
    // 스트립 전체가 탭 시 고양이집 시트를 여므로 별도 확장 뷰/라벨/버튼 없이 간소화.
    function dockMode(){ return localStorage.getItem('catDock')==='hidden'?'hidden':'strip'; }
    function setDockMode(m){ localStorage.setItem('catDock', m); renderDock(); updatePetcamBtn(); }
    function toggleDockHidden(){ setDockMode(dockMode()==='hidden'?'strip':'hidden'); if(state.tab==='more') renderMore(); }
    function dockHiddenLabel(){ return dockMode()==='hidden'?'숨김':'켬'; }
    // 상단바 펫캠 토글 버튼 상태(켜짐/꺼짐) 반영
    function updatePetcamBtn(){ const b=$('petcamBtn'); if(!b) return; const on=dockMode()!=='hidden';
      b.classList.toggle('off', !on); b.setAttribute('aria-pressed', on?'true':'false'); b.title = on?'펫캠 끄기':'펫캠 켜기'; }
    function initDock(){ renderDock(); updatePetcamBtn(); }
    function renderDock(){
      const d=$('catdock'); if(!d) return;
      // 🏢 근무 모드: 펫캠을 끄면 좌상단 브랜드를 텍스트 '알뜰'로 바꾸고 알림 뱃지도 숨김(CSS body.camoff)
      document.body.classList.toggle('camoff', dockMode()==='hidden');
      if(dockMode()==='hidden'){ d.className='catdock hidden'; d.innerHTML=''; stopWalk(); return; }
      d.className='catdock';
      // 웹캠 정면 방: 벽지(배경) + 바닥 + 배치 가구(배경) + 걷는 고양이. 방 전체가 카드 안에 비율대로 담김(크롭 아님) — 셸·배지·무대 모두 .cd-room 직속.
      d.innerHTML='<div class="cd-room">'+
        roomShellBase(currentWall(), currentFloor())+
        '<span class="cr-cam cd-cam" role="button" tabindex="0" aria-label="알뜰홈 열기" onclick="event.stopPropagation();coinTap(this)"><i></i>LIVE · <span class="cd-camtxt" id="cdCamTxt">'+(room().emoji?room().emoji+' ':'')+escapeHtml(room().name||'우리집')+'</span></span>'+
        batchBtnHtml()+
        pipBtnHtml()+
        '<div class="cr-props" id="cdProps"></div><div class="cr-stage" id="cdStage"></div>'+
        roomOverlay(currentBgfx())+
        '</div>';
      renderDockProps(); renderDockCats();
    }
    // 🧱 방 셸 공통 앞부분(벽·바닥·경계선) — dock·알뜰홈·친구방·미리보기 4무대가 공유(수기 복붙으로 구조가 갈라지던 것 방지). 벽/바닥은 인라인 배경(onGameChange가 라이브 패치).
    function roomShellBase(wallId, floorId){ return '<div class="cr-wall" style="background:'+wallCss(wallId)+'">'+wallSceneHtml(wallId)+'</div><div class="cr-floor" style="background:'+floorCss(floorId)+'">'+floorSceneHtml(floorId)+'</div><div class="cr-base"></div>'; }
    // 은화 배지 탭 → 눌리는 액션(press) 후 알뜰홈 열기. 캠 빈 곳 탭은 아무 동작 안 함(펫만 조작). (소식은 좌상단 브랜드 아이콘)
    function coinTap(el){ const c=el||($('cdCoins')&&$('cdCoins').closest('.cd-coin')); if(c){ c.classList.remove('tap'); void c.offsetWidth; c.classList.add('tap'); } setTimeout(openCatHouse, 170); }
    // 방/dock 공용: 똥을 화장실들에 라운드로빈 분배(각 화장실 객체에 _poops 슬롯 배열 부여, 최대 5개)
    function distributePoops(list){
      const litters=list.filter(p=>p.itemId==='litterbox'); litters.forEach(l=>{ l._poops=[]; });
      const n=litters.length?Math.min(room().poops||0, litters.length*5):0;
      for(let i=0;i<n;i++) litters[i%litters.length]._poops.push(i/litters.length|0);
    }
    // 배치물 하나의 마크업(그릇=탭 급여·채움 반영, 화장실=똥 수거). isDock이면 dock 크기.
    function propMarkup(p, isDock, plain, live){
      const foot=itemFoot(p.itemId); const flip=!!p.flip;   // 좌우 반전(placed[key].flip)
      // 가로 앵커=발자국 "가운데 정렬 + 양끝 벽 스냅"(camAnchorMode). CSS left% + translateX(--crtx)로 픽셀 폭을 몰라도 자동 정렬.
      //  left  : left 0%   / --crtx 0     → 그래픽 좌변이 왼쪽 벽에 밀착
      //  right : left 100% / --crtx -100% → 그래픽 우변이 오른쪽 벽에 밀착
      //  center: 발자국 중앙% / --crtx -50% → 칸 안에서 가운데(중간 가구가 좌우로 고르게 참)
      const mode=camAnchorMode(p.c, foot.w);
      const leftPct = mode==='left'?0 : mode==='right'?100 : (gridLeftFrac(p.c)+gridSpanFrac(foot.w)/2)*100;
      const txPct   = mode==='left'?0 : mode==='right'?-100 : -50;
      const x=leftPct.toFixed(2);
      const frontRow=p.r + foot.h - 1;   // 발자국에서 가장 앞(가까운) 줄에 바닥을 둠 → 가구가 위로 뜨지 않음
      // 반전: 격자 윗줄(작은 r)=방 뒤(멀리, 위·작게), 아랫줄(큰 r)=방 앞(가까이, 아래·크게)
      const depth=camDepth(frontRow); const bottom=camFurnBottom(depth).toFixed(1); const fh=furnRoomH(p.itemId,isDock,depth);   // dock·홈 동일 깊이 매핑(CAM 단일 소스, util.js) → 뒤 가구가 펫과 같은 바닥선에 정렬
      // 원근 가림: 앞(frontRow 큰 값)일수록 z-index를 높여 앞 가구가 뒤 가구를 덮게 한다.
      // (밥·물그릇/화장실의 고정 z-index:2가 이 깊이 순서를 깨뜨리던 문제 → 인라인 z-index로 덮어씀)
      const z=isFloorItem(p.itemId) ? 0 : Math.max(1, Math.round(frontRow));   // 바닥 아이템(러그)=맨 뒤(z:0) → 그 위 가구가 앞에 그려짐
      const tap=!plain && (p.itemId==='bowl'||p.itemId==='waterbowl');   // 친구 방(plain)은 밥그릇 채움·똥·탭 없이 정적 렌더
      // 캠(dock·홈 LIVE)에서만 연출(live) — 미리보기/친구 방/샵/팔레트는 정적. 연출 가구는 base+fx 두 겹으로.
      let inner=tap? furnRoomSvg(p.itemId,p.key,{h:fh}) : (live&&FURN_ANIM[p.itemId] ? furnLiveSvg(p.itemId,{h:fh}) : furnSvg(p.itemId,{h:fh}));
      if(!plain && p.itemId==='litterbox'){ const slots=p._poops||[]; const ph=Math.max(6,Math.round(fh*0.32));
        inner+=slots.map(s=>'<span class="poop" role="button" tabindex="0" onclick="collectPoop(event)" style="left:'+(20+(s%3)*26)+'%;top:'+(30+((s/3|0)*20))+'%;height:'+ph+'px" title="치우기 +'+POOP_REWARD+' 은화">'+poopSvg({h:ph})+'</span>').join(''); }
      return '<div class="cr-prop'+(tap?' cr-tap':'')+(p.itemId==='litterbox'?' cr-litter':'')+'" style="left:'+x+'%;bottom:'+bottom+'%;z-index:'+z+';--crtx:'+txPct+'%;transform:translateX(var(--crtx))'+(flip?' scaleX(-1)':'')+';"'+(tap?' role="button" tabindex="0" onclick="event.stopPropagation();feedBowl(\''+p.key+'\')"':'')+'>'+inner+'</div>';
    }
    // 배치 가구 마크업을 "바닥 아이템(러그·연못) 먼저 → 그 외"로 나눠 반환. 바닥 아이템은 z:0이라 그 외(z≥1)엔 이미 밀리지만,
    // 벽 가구도 z:0(같은 값)이라 DOM 순서가 앞서면 바닥 아이템 위로 그려진다 → 바닥 아이템을 항상 맨 앞(=맨 아래 레이어)에 두어
    // 러그가 벽 가구·일반 가구·펫 무엇보다도 아래로 보이게 한다(사용자 지침).
    function splitProps(list, mapFn){ let floor='', other=''; list.forEach(function(p){ if(isFloorItem(p.itemId)) floor+=mapFn(p); else other+=mapFn(p); }); return { floor:floor, other:other }; }
    // 🎁 방 바닥 대기 드랍 마크업 — 캠 표현 3종(사용자 확정): 박스=무지개박스·알류(펫알·뜰알)=무지개알·금화=반짝이는 금화(은화는 표현 없음).
    //   좌표·깊이·가림은 propMarkup과 동일 수식(camAnchorMode·camDepth·camFurnBottom·z=행) → 캠 3무대 원근 자동 정합. 인라인 z 고정 아님(행 척도).
    //   data-rid/data-drop은 Document PiP 위임 클릭용(_pipStatic이 onclick은 벗기지만 data 속성은 남김).
    function dropMarkup(d, rid){
      const mode=camAnchorMode(d.c, 1);
      const leftPct=mode==='left'?0 : mode==='right'?100 : (gridLeftFrac(d.c)+gridSpanFrac(1)/2)*100;
      const txPct=mode==='left'?0 : mode==='right'?-100 : -50;
      const depth=camDepth(d.r), bottom=camFurnBottom(depth).toFixed(1);
      const fh=Math.max(10, Math.round((16-depth*3)*1.15));   // 그릇급 소품 크기(원근 축소 완만)
      const z=Math.max(1, Math.round(d.r));
      const art=d.kind==='box'?rainbowBoxSvg({h:fh}) : d.kind==='gold'?goldSvg({h:Math.max(9,Math.round(fh*0.85))}) : rainbowEggSvg({h:fh});
      const tw=(typeof sparkSvg==='function')?('<span class="drop-tw">'+sparkSvg({h:Math.max(8,Math.round(fh*0.55))})+'</span>'):'';
      return '<div class="cr-drop cr-drop-'+d.kind+'" role="button" tabindex="0" data-rid="'+rid+'" data-drop="'+d.id+'"'+
        ' onclick="collectDrop(event,\''+rid+'\',\''+d.id+'\')" aria-label="떨어진 아이템 줍기"'+
        ' style="left:'+leftPct.toFixed(2)+'%;bottom:'+bottom+'%;z-index:'+z+';--crtx:'+txPct+'%;">'+
        '<span class="drop-ic">'+art+'</span>'+tw+'</div>';
    }
    function dropsHtml(R, rid){ return ((R&&R.drops)||[]).map(d=>dropMarkup(d, rid)).join(''); }
    // 드랍 서명(렌더 서명 가드용) — id 목록만(위치·종류는 id에 종속). dock·홈·Doc PiP·비디오 PiP 4곳이 공유.
    function dropsSig(R){ return ((R&&R.drops)||[]).map(d=>d&&d.id).join(','); }
    // 우측 상단 "일괄 돌보기" 버튼(밥·물 채우고 똥 치우기) — dock·홈 공용
    // 캠 우상단: [돌보기] + [지갑(은화·금화 갯수)]. 돌보기는 왼쪽으로, 오른쪽에 실시간 재화 카운터(쓰다듬기·돌보기 보상이 여기로 날아와 카운트업).
    // 표시값은 _walletDisp(카운트업 진행값) 우선 → 재렌더가 끼어들어도 롤업이 끊기지 않음.
    let _walletDisp={coins:null,gold:null}, _walletGen={coins:0,gold:0};
    function walletCoinDisp(){ return _walletDisp.coins!=null?_walletDisp.coins:coins(); }
    function walletGoldDisp(){ return _walletDisp.gold!=null?_walletDisp.gold:gold(); }
    // 👛 지갑 트랜지언트 표시 — 평소엔 숨겨 캠 상단(LIVE 배지)을 안 가리고, 재화 획득 연출 순간에만 잠깐 표시.
    //   만료시각(_walletShowUntil) 기반이라 표시 중 재렌더(batchBtnHtml 재생성)가 끼어들어도 walletHtml이 .show를 복원한다.
    let _walletShowUntil=0, _walletHideT=0;
    function walletVisible(){ return Date.now()<_walletShowUntil; }
    function walletShow(ms){ ms=ms||2600; _walletShowUntil=Date.now()+ms;
      document.querySelectorAll('.cd-wallet').forEach(w=>{
        if(!w.classList.contains('show')){ w.classList.add('show','in'); setTimeout(()=>w.classList.remove('in'),260); }   // 팝인은 숨김→표시 전환 때만(연속 획득 시 재팝 방지)
      });
      clearTimeout(_walletHideT);
      _walletHideT=setTimeout(function(){ _walletShowUntil=0; document.querySelectorAll('.cd-wallet').forEach(w=>w.classList.remove('show','in')); }, ms); }
    function walletHtml(){ return '<div class="cd-wallet'+(walletVisible()?' show':'')+'" aria-label="보유 은화·금화">'+
      '<span class="cw-coin"><span class="cw-ic">'+coinSvg({h:14})+'</span><span class="cw-n">'+walletCoinDisp().toLocaleString()+'</span></span>'+
      '<span class="cw-gold"><span class="cw-ic">'+goldSvg({h:14})+'</span><span class="cw-n">'+walletGoldDisp().toLocaleString()+'</span></span></div>'; }
    // ❤️ 행복도 입력 산출(순수 roomMood에 넘길 값): 밥·물 신선도·평균 애정·수확 신선도 등
    function roomMoodInputs(g, R){ const now=Date.now();
      let bowls=0, fr=0; const pl=(R&&R.placed)||{};
      Object.keys(pl).forEach(k=>{ const e=pl[k]; if(e&&(e.itemId==='bowl'||e.itemId==='waterbowl')){ bowls++; const fm=fillDurOf(e); fr+=e.filledAt?Math.max(0,Math.min(1,(fm-(now-e.filledAt))/fm)):0; } });
      const affs=(R&&R.active||[]).map(id=>affectionLevel(((g&&g.owned&&g.owned.cats[id])||{}).affection||0, CAT_TIER[id]||'normal').level);
      const ca=Number(R&&R.caredAt)||0;
      return { pets:(R&&R.active||[]).length, furn:enrichTypeCount(R), poops:Number(R&&R.poops)||0,
        feedFrac: bowls?fr/bowls:0, avgAff: affs.length?affs.reduce((a,b)=>a+b,0)/affs.length:0,
        caredFresh: ca?Math.max(0,1-(now-ca)/MOOD_CARE_MS):0 }; }
    function batchBtnHtml(){ const g=state.game, R=g?room():null;
      const pend=g?allRoomsIdleYield(g):0, mood=g?roomMood(roomMoodInputs(g,R)):0;   // 대기 수익 = 모든 방 합
      const mult=g?_yieldMult(g):1, boost=g&&recordedToday();   // 🔺 수익배율(애정·도감·앱사용)·🍀 오늘 기록 부스트
      const bmult=g?activeBoostMult(g):1, brem=g?boostRemain(g):0;   // 💊 영양제 부스트(활성 시 ×mult)
      const mtxt='수익 x'+mult.toFixed(2)+' (애정·도감·기록)'+(boost?' · 🍀오늘 기록 부스트':' · 오늘 기록하면 +부스트')+(bmult>1?' · 💊영양제 ×'+bmult+' '+fmtDur(brem):'');
      const hasItemDrop=!!(g && (g.home.rooms||[]).some(R=>((R&&R.drops)||[]).some(d=>d&&d.kind!=='gold')));   // 🌈 알·박스류 드랍 대기 → 수확 버튼 은은한 무지개(금화만은 제외, 사용자 확정)
      return '<div class="cr-topright">'+
        (bmult>1?'<span class="cr-boost" title="영양제 부스트 · 수확 수익 ×'+bmult+' · '+fmtDur(brem)+' 남음">'+consumSvg('tonic',{h:12})+'×'+bmult+'</span>':'')+   // 💊 부스트 배지 아이콘 = 픽셀 약병(M_TONIC — 이모지 금지 규칙)
        '<span class="cr-mood" title="행복도 '+mood+'% — 밥·물 챙기고 🌾수확하면 올라가요(똥은 감점) · 행복할수록 자동 은화↑">'+heartSvg({h:13,off:mood<45})+'<b>'+mood+'%</b></span>'+
        '<button class="cr-batch'+(pend>0?' has-yield':'')+(boost||bmult>1?' boosted':'')+(hasItemDrop?' rb-wait':'')+'" onclick="event.stopPropagation();batchCare(this)" title="'+mtxt+'" aria-label="전체 수확: 행복도 기반 자동 은화 받고 밥·물 채우고 똥 정리 ('+mtxt+')">수확'+(pend>0?'<span class="yield-chip">+'+pend+'</span>':'')+'</button>'+walletHtml()+'</div>'; }
    // 배치 가구를 무대 바닥에 배경으로(가로=열, 앞뒤 깊이=행)
    function renderDockProps(){
      const box=$('cdProps'); if(!box) return;
      reconcilePets();   // 캠 화면에서도 3시간 만료→똥 정산
      // ⚡ 배치 서명 가드(renderDockCats 패턴) — game 틱(코인·애정 등)마다 가구 SVG DOM 전체 재생성으로 가구 CSS 연출(창문 구름·어항 금붕어 등)이 리셋되던 것 방지. 배치·그릇 채움·똥 수가 그대로면 스킵.
      const r=room(); const sig='p:'+curRoomId()+'|'+JSON.stringify(r.placed||{})+'|'+JSON.stringify(r.wallPlaced||{})+'|'+(Number(r.poops)||0)+'|d:'+dropsSig(r);   // 드랍 서명 포함 — 스폰/수집이 dock에 라이브 반영(빼먹으면 "홈엔 뜨는데 dock엔 안 뜸" 재발 유형)
      if(box.dataset.sig===sig) return;
      box.dataset.sig=sig;
      // 원근: 뒤(행 큰 값)일수록 위로·작게, 앞(행 작은 값)일수록 아래로·크게. 앞 가구가 뒤 가구를 덮도록 뒤부터.
      const list=placedList().sort((a,b)=>a.r-b.r); distributePoops(list);
      const wallProps=wallPlacedList().map(p=>wallPropMarkup(p,true,true)).join('');   // 벽 가구(뒤 벽면, z:0)
      const sp=splitProps(list, p=>propMarkup(p,true,false,true));   // 바닥 아이템(러그·연못) 먼저 → 맨 아래
      box.innerHTML=sp.floor+wallProps+sp.other+dropsHtml(r, curRoomId());   // 바닥 아이템 → 벽 가구 → 일반 가구 → 드랍. live=true → dock 캠 연출
    }
    // 활성 고양이를 dock 무대에 액터로 배치(없으면 안내)
    function renderDockCats(){
      const stage=$('cdStage'); if(!stage) return;
      const cats=activeCats(); const list=cats.slice(0,slotCount());
      ensurePetArtMany(list);   // 독에 보이는 소유 펫 아트 선로드(지연)
      stage.dataset.hh=64;   // 알뜰홈(mountRoomWalk)과 동일 — dock가 이제 같은 244 방을 크롭한 창이라 같은 펫 크기로 통일
      const sig='c:'+list.map(id=>id+'~'+cosmSig(id)).join(',');   // 고양이 구성·코스메틱이 그대로면 DOM 재생성 금지(스프라이트 리로드·애니메이션 리셋 깜빡임 방지)
      if(stage.dataset.sig===sig && stage.querySelector('.cd-actor')) return;
      stage.dataset.sig=sig;
      if(!list.length){ stage.innerHTML='<span class="cd-empty">고양이를 입양해 보세요</span>'; markCatDirty(); return; }
      stage.innerHTML=list.map((id,i)=>{ const s=petActorPx(id,32,200); return '<div class="cd-actor" data-cat="'+id+'" data-hh="'+s+'" style="left:'+(20+i*64)+'px;">'+(hasSprite(id)?'<span class="cd-shadow">'+shadowSvg({h:Math.max(6,Math.round(s*0.16))})+'</span>'+actorCosmHtml(id,s):'')+catActorHTML(id,s)+'</div>'; }).join('');
      markCatDirty();
    }
    // ================= 🖥️ 펫캠 PiP — Document Picture-in-Picture (데스크톱 크롬·엣지 116+ 전용) =================
    // 캠 방을 '항상 위(always-on-top)' 미니 창으로 미러링(스팀 오버레이처럼 다른 작업 중에도 떠 있음). 시청 전용 —
    // PiP 문서엔 앱 스크립트가 없어 inline onclick이 ReferenceError라, pointer-events:none(+핸들러 제거)으로 조작을 원천 차단.
    // · 미지원(모바일/TWA/파이어폭스/사파리)이면 pipSupported()=false → 버튼조차 안 그려지고 아래 코드 전부 휴면(비용 0) — 모바일 최적화 영향 없음.
    // · 무대는 가상 높이 PIP_VH(=dock .cd-room 200px)로 렌더하고 창 크기엔 transform:scale로 맞춤 → 펫·가구 px 크기·원근이
    //   dock와 완전히 동일(캠 비율 불변식 유지). 리사이즈는 transform만 갱신하고 가상 폭이 바뀔 때만 재빌드(비용 최소).
    // · 엔진 편입: activeStages()가 _pip.stage를 5번째 무대로 포함, 메인 탭이 숨겨지면 PiP 창의 rAF(_engWin)로 루프를 이어가
    //   "웹서핑/작업 중에도 미니 캠이 계속 움직이는" 시나리오가 실제로 동작한다(메인 rAF는 숨김 탭에서 정지하므로).
    // · 정리: 창 pagehide에서 무대 지속 캐시(_stageW/_petX/_petDepth/_petVz/_petPose)와 rAF 체인을 정리·복구(메모리 누수·유령 무대 방지).
    const PIP_VH=200;   // 가상 방 높이 = dock .cd-room(200px)과 동일 → 같은 원근·크기
    let _pip=null;      // { win, doc, room, props, stage, _vw } — 창이 떠 있는 동안만 존재
    let _pipGone=true;  // 정리(idempotent) 플래그 — pagehide와 자가치유가 겹쳐 불려도 _pipClosed가 1회만 정리(중복 정리→rAF 이중 체인 방지)
    function docPipSupported(){ return typeof window!=='undefined' && 'documentPictureInPicture' in window; }
    // 비디오 PiP(canvas→captureStream→video PiP): 유튜브식 창 크롬(호버 시에만 컨트롤). OffscreenCanvas 워커로 백그라운드에서도 계속 그림.
    function vpipSupported(){ try{ return typeof window!=='undefined' && typeof OffscreenCanvas!=='undefined' && !!document.pictureInPictureEnabled
      && !!HTMLCanvasElement.prototype.captureStream && !!HTMLVideoElement.prototype.requestPictureInPicture && typeof Worker!=='undefined'; }catch(e){ return false; } }
    // 📵 iOS 계열 감지 — 아이폰/아이패드는 canvas.captureStream 자체가 미지원이라 비디오 PiP가 원천 불가(유튜브 PiP는 '진짜 비디오'라 가능),
    // Document PiP도 없음 → 버튼을 애초에 안 그린다. 안드로이드 Chrome/TWA는 API가 전부 있어 개방(2026-07 사용자 결정 — 기기 검증은 사용자 직접).
    function _pipIOSLike(){ try{
      if(/iPhone|iPad|iPod/i.test(navigator.userAgent||'')) return true;
      if(/Mac/i.test(navigator.platform||'') && (navigator.maxTouchPoints||0)>1) return true;  // iPadOS 데스크톱 위장 UA
      return false;
    }catch(e){ return false; } }
    function pipSupported(){ return !_pipIOSLike() && (docPipSupported() || vpipSupported()); }   // 버튼 노출 기준 — iOS 제외 + 둘 중 하나라도 지원(안드로이드=비디오 PiP·데스크톱=둘 다, 불가 환경은 애초에 안 그림)
    // 열려 있나 + 자가치유: 창이 pagehide 없이 죽는 엣지(브라우저가 이벤트를 못 준 경우)에도 다음 호출(매 프레임 activeStages·onGameChange 등)에서
    // 즉시 정리한다 — 안 하면 닫힌 창의 rAF에 예약된 엔진 체인이 증발한 채 _eng.raf만 남아 "펫 전체 정지"류 버그가 된다.
    function pipOpen(){ if(_pip && (!_pip.win || _pip.win.closed)) _pipClosed(); return !!_pip; }
    // 걷기 엔진 rAF 스케줄 창 — 평소엔 메인 창(PiP 무대도 메인 루프가 함께 구동), "메인 탭이 숨겨져 메인 rAF가 멈출 때만" PiP 창으로 옮긴다(항상 보이는 창).
    function _engWin(){ return (typeof document!=='undefined'&&document.hidden&&pipOpen())?_pip.win:window; }
    // PiP 문서에선 전역 함수가 없어 inline 핸들러가 동작할 수 없으므로 상호작용 속성을 전부 벗긴다(시청 전용·키보드 포커스도 차단).
    function _pipStatic(html){ return String(html).replace(/ (?:onclick|onkeydown)="[^"]*"/g,'').replace(/ role="button"/g,'').replace(/ tabindex="0"/g,''); }
    function _pipSetCamTxt(){ if(!pipOpen()) return; try{ _pip.doc.title='알뜰 펫캠 · '+(room().emoji?room().emoji+' ':'')+(room().name||'우리집'); }catch(e){} }   // 창 안 LIVE 배지·방 이름은 안 그림(사용자 지침) — 방 이름은 창 제목으로만
    // 🌈 PiP 수확 버튼의 무지개 대기 상태 동기화 — 알·박스류 드랍이 어느 방에든 대기 중이면 rb-wait(batchBtnHtml과 동일 판정)
    function _pipBatchSync(){ if(!pipOpen()) return; try{ const b=_pip.doc.getElementById('ppBatch'); if(!b) return;
      const g=state.game, has=!!(g && (g.home.rooms||[]).some(R=>((R&&R.drops)||[]).some(d=>d&&d.kind!=='gold')));
      b.classList.toggle('rb-wait', has); }catch(e){} }
    function syncPipTheme(){
      if(pipOpen()){ try{ _pip.doc.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme')||'light'); }catch(e){} }
      if(typeof vpipOpen==='function' && vpipOpen()){ try{ _vpip.sigProps=''; _vpipSync(); }catch(e){} }   // 🎬 비디오 PiP: CSS 변수 계산값이 바뀌므로 정적 씬 재래스터
    }
    // 창 크기 → 가상 방(폭 가변 × 높이 PIP_VH)을 scale로 꽉 채움. 가상 폭이 바뀔 때만 액터 재클램프(markCatDirty).
    function _pipLayout(){ if(!pipOpen()||!_pip.room) return;
      const w=_pip.win.innerWidth||320, h=_pip.win.innerHeight||PIP_VH, sc=Math.max(0.2, h/PIP_VH);
      const vw=Math.max(120, Math.round(w/sc));
      const st=_pip.room.style; st.width=vw+'px'; st.height=PIP_VH+'px'; st.transform='scale('+sc.toFixed(4)+')';
      if(_pip._vw!==vw){ _pip._vw=vw; markCatDirty(); } }
    // 가구·똥(라이브 연출 포함)을 PiP 방에 렌더 — renderDockProps와 동일한 서명 가드(game 틱마다 DOM 재생성·연출 리셋 방지)
    function renderPipProps(){ if(!pipOpen()||!_pip.props) return;
      const r=room(); const sig='p:'+curRoomId()+'|'+JSON.stringify(r.placed||{})+'|'+JSON.stringify(r.wallPlaced||{})+'|'+(Number(r.poops)||0)+'|d:'+dropsSig(r);   // 드랍 서명 포함(스폰/수집 라이브 반영)
      if(_pip.props.dataset.sig===sig) return; _pip.props.dataset.sig=sig;
      const list=placedList().sort((a,b)=>a.r-b.r); distributePoops(list);
      const wallProps=wallPlacedList().map(p=>wallPropMarkup(p,true,true)).join('');
      const sp=splitProps(list, p=>propMarkup(p,true,false,true));   // dock와 동일: 그릇 채움 상태·live 연출 포함(핸들러는 아래서 제거)
      _pip.props.innerHTML=_pipStatic(sp.floor+wallProps+sp.other+dropsHtml(r, curRoomId())); }   // 🎁 드랍 포함 — 클릭은 openDocPip의 위임 리스너(data-rid/data-drop)가 처리(inline onclick은 _pipStatic이 제거)
    // 활성 펫을 PiP 무대에 — renderDockCats와 동일한 서명 가드(스프라이트 리로드·애니 리셋 깜빡임 방지)
    function renderPipCats(){ if(!pipOpen()||!_pip.stage) return;
      const stage=_pip.stage; const list=activeCats().slice(0,slotCount());
      ensurePetArtMany(list);
      const sig='c:'+list.map(id=>id+'~'+cosmSig(id)).join(',');
      if(stage.dataset.sig===sig && stage.querySelector('.cd-actor')) return;
      stage.dataset.sig=sig;
      if(!list.length){ stage.innerHTML='<span class="cd-empty">펫이 없어요</span>'; markCatDirty(); return; }
      stage.innerHTML=list.map((id,i)=>{ const s=petActorPx(id,32,200); return '<div class="cd-actor" data-cat="'+id+'" data-hh="'+s+'" style="left:'+(20+i*64)+'px;">'+(hasSprite(id)?'<span class="cd-shadow">'+shadowSvg({h:Math.max(6,Math.round(s*0.16))})+'</span>'+actorCosmHtml(id,s):'')+catActorHTML(id,s)+'</div>'; }).join('');
      markCatDirty(); }
    // dock 캠 우하단 PiP 버튼(지원 브라우저에서만 렌더 — 모바일에선 마크업 자체가 없음)
    function _pipBtnTitle(on){ return on?'PiP 미니 창 닫기':'펫캠을 항상 위 미니 창(PiP)으로'; }
    function pipBtnHtml(){ if(!pipSupported()) return '';
      const on=pipOpen()||vpipOpen();
      return '<button class="cd-pip'+(on?' on':'')+'" onclick="event.stopPropagation();openPipCam()" aria-pressed="'+(on?'true':'false')+'" title="'+_pipBtnTitle(on)+'" aria-label="펫캠 PiP 미니 창 열기/닫기">'+pipSvg({h:13})+'</button>'; }
    function _pipBtnSync(){ const b=document.querySelector('.catdock .cd-pip'); if(!b) return; const on=pipOpen()||vpipOpen();
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on?'true':'false'); b.title=_pipBtnTitle(on); }
    // ── PiP 방식 설정(설정 시트에서 선택 — 2026-07 사용자 지침: 버튼 롱프레스 토글 대신 설정 항목으로) ──
    // 기본=🎬 비디오 PiP(주소창 없는 유튜브식·연출 전부 재현). 🪟 창(Document PiP)=DOM 완전 미러(펫 상호작용까지 100%, 상단바 표시).
    // 설정 행은 pipSupported()일 때만 노출(iOS 등 미지원 환경엔 안 보임 — views.js openSettingsSheet/openPipModeSheet).
    function pipMode(){ try{ return localStorage.getItem('pipMode')==='doc'?'doc':'video'; }catch(e){ return 'video'; } }   // 디폴트=비디오
    function pipModeLabel(){ return pipMode()==='doc'?'🪟 창':'🎬 비디오'; }
    function setPipModeChoice(m){
      if(m==='doc' && !docPipSupported()){ toast('이 브라우저는 창 방식을 지원하지 않아요(데스크톱 크롬·엣지)', true); return; }
      if(m==='video' && !vpipSupported()){ toast('이 브라우저는 비디오 방식을 지원하지 않아요', true); return; }
      if(pipMode()===m) return;
      try{ localStorage.setItem('pipMode', m); }catch(e){}
      if(vpipOpen()) closeVideoPip(); if(pipOpen()){ try{ _pip.win.close(); }catch(e){} }   // 방식이 바뀌면 열린 미니 창은 닫음(다시 열면 새 방식)
      toast(m==='doc'?'PiP 방식: 🪟 창 — 방 화면 그대로(상단바 표시)':'PiP 방식: 🎬 비디오 — 유튜브식(호버 시에만 컨트롤)');
    }
    function openPipCam(){
      if(_pipIOSLike()){ toast('아이폰/아이패드 브라우저는 PiP 미니 캠을 지원하지 않아요', true); return; }   // 📵 버튼이 없어 정상 경로론 못 오지만 콘솔·구버전 캐시 방어
      if(vpipOpen()){ closeVideoPip(); return; }                       // 토글: 재탭=닫기
      if(pipOpen()){ try{ _pip.win.close(); }catch(e){} return; }
      if(pipMode()==='doc' && docPipSupported()) return openDocPip(); // 설정에서 창 방식을 고른 경우
      if(vpipSupported()) return openVideoPip();
      if(docPipSupported()) return openDocPip();                       // Firefox 등 비디오 PiP 불가 브라우저 폴백
      toast('이 브라우저는 PiP 미니 캠을 지원하지 않아요(데스크톱 크롬·엣지)', true);
    }
    function openDocPip(){
      // disallowReturnToOpener: '탭으로 돌아가기' 버튼 숨김(Chrome 124+, 이전 버전은 무시) — 상단바를 최대한 깔끔하게
      documentPictureInPicture.requestWindow({ width:380, height:224, disallowReturnToOpener:true }).then(function(win){
        const doc=win.document;
        try{
          const base=doc.createElement('base'); base.href=document.baseURI; doc.head.appendChild(base);   // 스프라이트 PNG 등 상대 URL 해석 보장
          document.querySelectorAll('link[rel="stylesheet"]').forEach(function(l){ const n=doc.createElement('link'); n.rel='stylesheet'; n.href=l.href; doc.head.appendChild(n); });   // styles.css 재사용(HTTP 캐시 히트 — 중복 다운로드 없음)
          doc.title='알뜰 펫캠';
        }catch(e){}
        doc.body.className='piproom'+(document.body.classList.contains('lite')?' lite':'');
        doc.body.innerHTML='<div class="cd-room" id="ppRoom">'+roomShellBase(currentWall(), currentFloor())+
          '<div class="cr-props" id="ppProps"></div><div class="cr-stage" id="ppStage" data-hh="64"></div>'+
          roomOverlay(currentBgfx())+'</div>';   // LIVE 배지·방 이름 없음(사용자 지침 — 미니 창은 방 화면만 깔끔하게, 방 이름은 창 제목으로만)
        _pip={ win:win, doc:doc, room:doc.getElementById('ppRoom'), props:doc.getElementById('ppProps'), stage:doc.getElementById('ppStage'), _vw:0 }; _pipGone=false;
        // 🎁 드랍 클릭 수집(위임) — PiP 문서엔 앱 전역이 없어 inline onclick은 _pipStatic이 벗기지만, 메인 창 컨텍스트에서 붙인
        // 리스너는 정상 동작(same-origin·같은 JS 힙). data-rid/data-drop으로 위임. 창 pagehide와 함께 자동 소멸(별도 해제 불필요).
        _pip.room.addEventListener('click', function(ev){ try{ const t=ev.target&&ev.target.closest&&ev.target.closest('.cr-drop');
          if(t&&t.dataset.drop) collectDrop(ev, t.dataset.rid, t.dataset.drop); }catch(e){} });
        // 🌾 우상단 소형 수확 버튼 — PiP에서 일하다 바로 일괄 수령(알·박스 드랍 대기 시 rb-wait 무지개 공유)
        try{ const pb=doc.createElement('button'); pb.className='pp-batch'; pb.id='ppBatch'; pb.textContent='수확'; pb.setAttribute('aria-label','전체 수확');
          pb.addEventListener('click', function(){ batchCare(null); }); doc.body.appendChild(pb); }catch(e){}
        syncPipTheme(); _pipSetCamTxt(); _pipLayout(); renderPipProps(); renderPipCats(); _pipBatchSync();
        let rz=0; win.addEventListener('resize', function(){ clearTimeout(rz); rz=setTimeout(_pipLayout, 120); });   // scale만 갱신(가상 폭 변화 시에만 재빌드)
        win.addEventListener('pagehide', function(){ if(_pip && _pip.win===win) _pipClosed(); }, { once:true });   // 창 닫힘(수동·브라우저/앱 종료) → 정리. ⚠️ "자기 창일 때만" — 닫기→곧바로 재열기 시 이전 창의 늦은 pagehide가 새 세션을 파괴하는 레이스 방지
        _pipBtnSync(); markCatDirty(); _eng.last=0; startCatLoop();
      }).catch(function(){ toast('PiP 창을 열지 못했어요', true); });
    }
    // 창 닫힘 정리(idempotent) — 무대별 지속 캐시 제거(누수·유령 무대 방지) + rAF 체인·game 코얼레싱을 메인 창으로 복구
    function _pipClosed(){
      if(_pipGone) return; _pipGone=true;   // pagehide + pipOpen 자가치유가 겹쳐도 1회만(중복 정리 시 rAF 이중 체인 위험)
      _pip=null;
      delete _stageW.ppStage; delete _stageRemeasure.ppStage;
      [_petX,_petDepth,_petVz,_petPose].forEach(function(m){ Object.keys(m).forEach(function(k){ if(k.indexOf('ppStage:')===0) delete m[k]; }); });
      // 엔진 체인이 PiP 창의 rAF에 있었다면(메인 탭 숨김 중) 창과 함께 증발 → 리셋 후 재가동. 메인 창 체인이면 건드리지 않는다(이중 체인 방지).
      if(_eng.raf && _eng.win && _eng.win!==window){ try{ if(!_eng.win.closed) _eng.win.cancelAnimationFrame(_eng.raf); }catch(e){} _eng.raf=0; _eng.win=null; }
      _eng.last=0; markCatDirty(); startCatLoop();
      if(_ogcRAF){ _ogcRAF=0; onGameChange(); }   // PiP rAF에 걸려 있던 game 델타 코얼레싱도 메인으로 재예약(라이브 패치 유실 방지)
      _pipBtnSync();
    }
    // ================= 🎬 비디오 PiP(기본) — canvas→captureStream→video.requestPictureInPicture =================
    // 유튜브 PiP와 동일한 창: 평소엔 화면만 보이고 마우스를 올려야 컨트롤(탭 복귀·X)이 나타남(사용자 요청 — Document PiP 상단바는 숨길 수 없어 방식 자체를 전환).
    // 구성: ① 방 정적 레이어 2장 = back(벽지·바닥·씬 정적조각) + furn(가구·벽가구·똥·그릇 채움, 투명) — 캔버스 직접 페인트
    //      ② 펫 = 걷기 시트/정지 스틸 ImageBitmap을 워커로 넘겨 워커가 자체 미니 배회 심(걷기 필름·정면 멈춤·깊이 원근)으로 매 프레임 드로잉
    //      ③ 🎡 가구 연출(FURN_ANIM) = furnLiveSvg처럼 base/fx 팔레트 분리 — base는 furn 비트맵에, fx 레이어는 별도 비트맵으로 워커가
    //         styles.css `.ffx-*` 전사 테이블(_VPIP_FX_*)의 keyframe·속도·중심으로 매 프레임 트랜스폼(회전·이동·일렁·깜빡) 드로잉
    //      ④ 🌌 배경효과(bgfx)·움직이는 벽지/바닥 씬 = bgfxOverlayHtml/wallSceneHtml/floorSceneHtml 배치 수식을 미러한 파티클
    //         (나비 flit+flap·낙엽 fall+sway·잠자리 tilt·반딧불 blink·구름 흐름·별 깜빡·풀꽃 bend)을 워커가 드로잉
    //      ⑤ OffscreenCanvas + 워커 setInterval(33ms) — 워커 타이머는 탭 숨김 스로틀을 안 받아 "다른 창에서 작업 중"에도 계속 움직임(메인 rAF 불필요)
    // 워커 draw 순서: back → 씬 파티클(back층: 구름·별·풀꽃 — 가구 뒤) → furn → 가구 fx+펫(깊이 z-소트 통합) → bgfx 파티클(over층 — 오버레이).
    // reduced-motion·가벼운 모드: frozen 플래그로 전부 정지 표시(DOM 정책과 동일 — lite는 연출 정지·걷기 유지).
    // 정리: leavepictureinpicture(X·토글)에서 워커 종료·스트림 정지·DOM 제거(누수 방지). 방/가구/펫 변경은 서명 가드로 비트맵만 재전송.
    let _vpip=null;   // { video, canvas, worker, stream, sigProps, sigCats } — 떠 있는 동안만
    function vpipOpen(){ return !!_vpip; }
    const _VPIP_W=360, _VPIP_H=200, _VPIP_SC=2;   // 가상 방 360×200(dock 비율) × 2배 래스터(720×400)
    // 방 정적 레이어 — 캔버스에 직접 페인트(벽지·바닥 타일/그라디언트 + 가구·벽가구·똥·그릇 채움).
    // ⚠️ foreignObject SVG 래스터는 쓸 수 없다(실측 버그): Chrome이 foreignObject 포함 SVG 이미지를 origin-unclean(오염)으로
    //    취급해 "Non-origin-clean ImageBitmap cannot be transferred" — 워커 전송·captureStream이 전부 막힌다.
    //    → 배치 좌표 수학을 propMarkup/wallPropMarkup과 동일식으로 계산해 pxSvg 데이터URI(클린)를 drawImage 한다.
    function _vpipResolveCss(s){ try{ const cs=getComputedStyle(document.documentElement);
      return String(s||'').replace(/var\((--[a-z0-9-]+)(?:\s*,[^)]*)?\)/gi, function(m,n){ const v=cs.getPropertyValue(n).trim(); return v||m; });
    }catch(e){ return s; } }
    function _vpipImgLoad(u){ return new Promise(function(res,rej){ const im=new Image(); im.onload=function(){ res(im); }; im.onerror=rej; im.src=u; }); }
    // Image → ImageBitmap. ⚠️ pxSvg 산출 SVG는 height만 있어 createImageBitmap(img)이 "intrinsic dimensions" 오류로 실패(실측 —
    // fx/파티클이 조용히 전부 걸러지던 버그) → 캔버스 경유 2배 래스터 폴백(도트 유지, 워커에서 smoothing off로 1:1 환산).
    // filt(선택)=CSS filter 문자열(염색) — 🎨 메인스레드 캔버스에서 비트맵에 '미리 베이크'해 전송한다.
    //  워커 ctx.filter는 환경(GPU 가속 캔버스·모바일)에 따라 무시되거나 출력이 비는 사례가 있어(염색 펫이 비디오 PiP에서 안 보이던 버그)
    //  dock과 같은 문서 컨텍스트에서 입힌다. 필터 미지원/실패 시 미염색 원본 폴백(펫은 항상 보임).
    function _vpipBmp(url, filt){ return _vpipImgLoad(url).then(function(im){
      if(filt){ try{
        const w=Math.max(1,Math.round((im.naturalWidth||im.width||1)*_VPIP_SC)), h=Math.max(1,Math.round((im.naturalHeight||im.height||1)*_VPIP_SC));
        const c=document.createElement('canvas'); c.width=w; c.height=h;
        const x=c.getContext('2d'); x.imageSmoothingEnabled=false; x.filter=filt;
        if(x.filter && x.filter!=='none'){ x.drawImage(im,0,0,w,h); return createImageBitmap(c); }
      }catch(e){} }
      return createImageBitmap(im).catch(function(){
        const w=Math.max(1,Math.round((im.naturalWidth||im.width||1)*_VPIP_SC)), h=Math.max(1,Math.round((im.naturalHeight||im.height||1)*_VPIP_SC));
        const c=document.createElement('canvas'); c.width=w; c.height=h;
        const x=c.getContext('2d'); x.imageSmoothingEnabled=false; x.drawImage(im,0,0,w,h);
        return createImageBitmap(c);
      });
    }); }
    function _svgUri(s){ return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(_vpipResolveCss(String(s||'').replace(/<svg /g,'<svg xmlns="http://www.w3.org/2000/svg" '))); }
    // 벽지/바닥 CSS 배경 → 캔버스 드로어(타일 url=패턴, 그라디언트=세로 근사, 단색=fill). 로드 후 fn(ctx)를 돌려 painter 순서 보장.
    function _vpipBgFill(css, x, y, w, h){
      css=String(css||'');
      const m=css.match(/url\(\s*'?(data:image\/[^')\s]+)'?\s*\)/);
      if(m){ const sz=css.match(/\/\s*([\d.]+)px\s+([\d.]+)px/);
        return _vpipImgLoad(m[1]).then(function(im){ return function(ctx){
          const tw=Math.max(1, Math.round(sz?parseFloat(sz[1]):im.width)), th=Math.max(1, Math.round(sz?parseFloat(sz[2]):im.height));
          const tc=document.createElement('canvas'); tc.width=tw; tc.height=th;
          const tx=tc.getContext('2d'); tx.imageSmoothingEnabled=false; tx.drawImage(im,0,0,tw,th);
          ctx.save(); ctx.fillStyle=ctx.createPattern(tc,'repeat'); ctx.translate(x,y); ctx.fillRect(0,0,w,h); ctx.restore(); };
        }, function(){ return function(){}; }); }
      return Promise.resolve(function(ctx){
        const cols=css.match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/g);
        if(css.indexOf('gradient')>=0 && cols && cols.length>1){ const g=ctx.createLinearGradient(0,y,0,y+h);
          for(let i=0;i<cols.length;i++){ try{ g.addColorStop(i/(cols.length-1), cols[i]); }catch(e){} } ctx.fillStyle=g; }
        else ctx.fillStyle=(cols&&cols[0])||'#ece7dc';
        ctx.fillRect(x,y,w,h); });
    }
    // 🎡 가구 연출 파라미터 — styles.css `.ffx-*` 규칙의 JS 전사(워커는 CSS를 못 읽음). kf=keyframe 종류, dur=초, org=회전/변형 중심(비율).
    // ⚠️ styles.css에 새 아이템별 오버라이드(duration·transform-origin·전용 keyframe)를 추가하면 여기에도 짝 맞춰 넣을 것(CLAUDE.md 체크리스트).
    const _VPIP_FX_TYPE={ spin:{kf:'spin',dur:7}, swing:{kf:'swing',dur:3.4}, sway:{kf:'sway',dur:4.6}, drift:{kf:'drift',dur:10},
      flicker:{kf:'flicker',dur:0.85,org:[0.5,0.62]}, blink:{kf:'decoblink',dur:2.4}, sheen:{kf:'sheen',dur:3.8} };
    const _VPIP_FX_ID={
      // 속도 오버라이드(styles.css .ffx-<id> .px { animation-duration })
      catgrass:{dur:1.7}, groomarch:{dur:1.6}, heatpad:{dur:1.0}, tetherpole:{dur:1.2}, windmilltoy:{dur:1.8}, crinklebag:{dur:1.8},
      koipond:{dur:1.6}, woodstove:{dur:0.5}, mushroomlamp:{dur:0.9}, crystaltree:{dur:1.6},
      gramophone:{dur:1.6}, arcademachine:{dur:0.7}, jukebox:{dur:0.8}, crystalcluster:{dur:1.6}, hourglass:{dur:1.4},
      wallvines:{dur:1.8}, pennant:{dur:1.6}, stringlights:{dur:0.9}, wallsun:{dur:3.0},
      balltrack:{dur:1.2}, teetertoy:{dur:1.1}, bubblemachine:{dur:1.4}, bonsai:{dur:2.2}, globe:{dur:2.0}, snowglobe:{dur:1.6},
      yarnbasket:{dur:2.6}, groomstation:{dur:2.2}, springtoy:{dur:1.1}, birdcage:{dur:1.3}, lavalamp:{dur:2.4}, laserpost:{dur:0.8},
      waterfountain:{dur:1.6}, recordplayer:{dur:1.4}, terrarium:{dur:2.0}, ballpit:{dur:1.5}, grandfaclock:{dur:1.0},
      crystalfountain:{dur:1.4}, cuckooclock:{dur:0.9},
      // 중심·전용 keyframe 오버라이드(styles.css .ffx-<id>)
      catwheel:{org:[0.479,0.4375]}, tower:{org:[0.84,0.20]}, scratcher:{org:[0.75,0.13]}, plant:{org:[0.5,0.57]},
      window:{dur:16}, fishtank:{kf:'fish',dur:3.4}, pondfish:{kf:'pondfish',dur:2.8}, pondleaf:{kf:'leaf',dur:5.6}, pondwater:{kf:'ripple',dur:4.6},
      fan:{org:[0.406,0.35],dur:2.6}, hammock:{org:[0.5,0.06],dur:4.6}, teaser:{org:[0.81,0.03],dur:2.6},
      wallclock:{org:[0.5,0.52],dur:2}, hangplant:{org:[0.5,0.04],dur:5}, mobile:{org:[0.5,0.06],dur:6}, chandelier:{org:[0.5,0.03],dur:4.2},
      jingleball:{org:[0.5,0.94],dur:1.6}, neon:{kf:'neon',dur:1.9}, sconce:{kf:'flame',dur:0.62,org:[0.5,0.34]}, mirror:{kf:'sheen',dur:3.8}
    };
    function _vpipFxMeta(type, key){ const t=_VPIP_FX_TYPE[type]||{kf:type,dur:4}; const o=_VPIP_FX_ID[key]||{};
      return { kf:o.kf||t.kf, dur:o.dur||t.dur, org:o.org||t.org||[0.5,0.5] }; }
    // fxflit 경로 6값(±22px) — bflyDriftVars와 동일한 난수 스트림 소비(픽셀 경로 동일)
    function _vpipFlitPts(rnd){ const p=function(){ return Math.round((rnd()*2-1)*22); }; return { x1:p(), y1:p(), x2:p(), y2:p(), x3:p(), y3:p() }; }
    // 배치물 페인트 목록 — dock 캠과 동일한 painter 순서(바닥아이템 → 벽가구 → 일반 뒤→앞)·앵커·원근.
    // 반환 {paint, fx}: 연출 가구(FURN_ANIM)는 base(정지 픽셀만)를 paint에, 움직이는 레이어(fx)를 별도 목록에(furnLiveSvg의 palPick 분리와 동일).
    function _vpipPaintList(frozen){
      const W=_VPIP_W, H=_VPIP_H;
      function anchorX(c, footW, gw){ const md=camAnchorMode(c, footW);
        const ax = md==='left'?0 : md==='right'?W : (gridLeftFrac(c)+gridSpanFrac(footW)/2)*W;
        return ax + gw*(md==='left'?0 : md==='right'?-1 : -0.5); }
      const list=placedList().sort((a,b)=>a.r-b.r); distributePoops(list);
      const flo=[], oth=[], wall=[], fx=[], spots=[];
      // 연출 가구면 base(정지)만 정지 비트맵에 남기고 움직이는 레이어를 fx로 분리 — furnLiveSvg의 palPick 분리와 동일 규칙. frozen(모션축소·lite)이면 통짜 정적.
      function baseSvg(id, fh, xx, yy, gw, flip, fr){
        const a=(!frozen)&&FURN_ANIM[id];
        if(!a) return furnSvg(id,{h:fh});
        const M=furnMatrix(id), pal=FURN_PALS[id], layers=Array.isArray(a)?a:[a];
        let all=[]; layers.forEach(function(l){ all=all.concat(l.move); });
        layers.forEach(function(l){ const meta=_vpipFxMeta(l.type, l.cls||id);
          fx.push({ url:_svgUri(pxSvg(M, palPick(pal, l.move, true), {h:fh})), x:xx, y:yy, w:gw, h:fh, flip:!!flip, fr:fr,
            kf:meta.kf, dur:meta.dur, ox:meta.org[0], oy:meta.org[1], ph:Math.random() }); });
        return pxSvg(M, palPick(pal, all, false), {h:fh});
      }
      list.forEach(function(p){ const foot=itemFoot(p.itemId), fr=p.r+foot.h-1, depth=camDepth(fr);
        const fh=furnRoomH(p.itemId,true,depth), gw=fh*furnAspect(p.itemId);
        const x=anchorX(p.c, foot.w, gw), yB=H*(1-camFurnBottom(depth)/100);
        const tap=(p.itemId==='bowl'||p.itemId==='waterbowl');
        const it={ url:_svgUri(tap? furnRoomSvg(p.itemId,p.key,{h:fh}) : baseSvg(p.itemId, fh, x, yB-fh, gw, p.flip, fr)), x:x, y:yB-fh, w:gw, h:fh, flip:!!p.flip, fr:fr };
        (isFloorItem(p.itemId)?flo:oth).push(it);
        if(INTERACTIVE_FURN[p.itemId] && !isFloorItem(p.itemId)){ const sp=furnSpot({hh:40,sw:40},{itemId:p.itemId, fh:fh});   // 🪑 워커 미니 배회용 상호작용 스팟(중앙x·깊이·올림px·머무는 시간) — dock furnSpot 재사용(캠 좌표계)
          spots.push({ x:Math.round((x+gw/2)*10)/10, depth:Math.round(depth*1000)/1000, lift:Math.round(sp.lift||0), dur:Math.round(sp.dur||20000) }); }
        if(p.itemId==='litterbox'){ const ph=Math.max(6,Math.round(fh*0.32));   // propMarkup의 똥 슬롯 %와 동일
          (p._poops||[]).forEach(function(s){ oth.push({ url:_svgUri(poopSvg({h:ph})), x:x+gw*(20+(s%3)*26)/100, y:(yB-fh)+fh*(30+((s/3|0)*20))/100, w:ph, h:ph, flip:false, fr:fr+0.01 }); }); }
      });
      wallPlacedList().forEach(function(p){ const foot=wallFoot(p.itemId), anchor=wallAnchorOf(p.itemId);
        let fh, y;
        if(anchor==='floor'){ fh=furnRoomH(p.itemId,true,1); y=H*(1-camFurnBottom(1)/100)-fh; }                                 // 바닥형: 맨 뒤 바닥선
        else if(anchor==='hang'){ fh=furnWallH(p.itemId,true); y=H*(((p.r-1)/WALL_ROWS)*46)/100; }                              // 매다는형: 천장 top 앵커
        else { fh=furnWallH(p.itemId,true); y=H*(1-(WALL_MOUNT_BASE+(WALL_ROWS-p.r)*WALL_MOUNT_STEP)/100)-fh; }                 // 거는형: 벽 밴드 bottom
        const gw=fh*furnAspect(p.itemId), xx=anchorX(p.c, foot.w, gw);
        wall.push({ url:_svgUri(baseSvg(p.itemId, fh, xx, y, gw, false, 0)), x:xx, y:y, w:gw, h:fh, flip:false, fr:0 });
      });
      // 🎁 방 바닥 대기 드랍 — dropMarkup(DOM)과 동일 좌표·아트(무지개박스/무지개알/반짝 금화 + 트윙클).
      //   움직임은 워커 keyframe dropbob(부양)·dropflip(금화 글린트)·droptw(트윙클) — styles.css crdropbob/crdropflip/dropfxtw의 전사(짝 맞춤).
      //   frozen(모션축소·lite)이면 본체를 정지 비트맵(oth)에 베이크하고 트윙클 생략(DOM 정책 미러).
      function svgAspect(s){ const m=/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/.exec(String(s)); return m?(+m[1]/+m[2]):1; }
      ((room().drops)||[]).forEach(function(d){ const depth=camDepth(d.r), fr=Math.max(1,Math.round(d.r));
        const fh=Math.max(10, Math.round((16-depth*3)*1.15));
        const isG=d.kind==='gold', h2=isG?Math.max(9,Math.round(fh*0.85)):fh;
        const art=d.kind==='box'?rainbowBoxSvg({h:h2}) : (isG?goldSvg({h:h2}) : rainbowEggSvg({h:h2}));
        const gw=h2*svgAspect(art), x=anchorX(d.c, 1, gw), y=H*(1-camFurnBottom(depth)/100)-h2;
        if(frozen){ oth.push({ url:_svgUri(art), x:x, y:y, w:gw, h:h2, flip:false, fr:fr }); return; }
        fx.push({ url:_svgUri(art), x:x, y:y, w:gw, h:h2, flip:false, fr:fr,
          kf:isG?'dropflip':'dropbob', dur:isG?1.1:1.6, ox:0.5, oy:isG?0.5:1, ph:Math.random() });
        if(typeof sparkSvg==='function'){ const th=Math.max(8,Math.round(fh*0.55)); const twArt=sparkSvg({h:th}); const twW=th*svgAspect(twArt);
          fx.push({ url:_svgUri(twArt), x:x+gw-twW*0.45, y:y-th*0.4, w:twW, h:th, flip:false, fr:fr+0.02,
            kf:'droptw', dur:0.9, ox:0.5, oy:0.5, ph:Math.random() }); }
      });
      oth.sort(function(a,b){ return a.fr-b.fr; });
      return { paint: flo.concat(wall).concat(oth), fx: fx, spots: spots };
    }
    // 🌅 씬(움직이는 벽지/바닥)·🌌 배경효과 조각 — wallSceneHtml/floorSceneHtml/bgfxOverlayHtml의 배치 수식을 미러.
    // statics=정지 조각(back 비트맵에 베이크: 언덕·해·무지개·달), parts=워커가 매 프레임 그리는 파티클(구름·별·풀꽃·나비·낙엽·잠자리·반딧불).
    function _vpipScenePieces(statics, parts, frozen){
      const W=_VPIP_W, H=_VPIP_H;
      const wp=WALLPAPER_CATALOG.find(x=>x.id===currentWall());
      if(wp&&wp.scene){ const t=wp.scene;
        const cn=pkCount(t==='night'?7:11);   // 구름 — pkcloud: translateX(-64px→600px) linear, delay -i*9s
        for(let i=0;i<cn;i++){ const y=H*((3+pkRand(i,1)*32)/100), hh=Math.round(9+pkRand(i,2)*13), wc=Math.floor(pkRand(i,3)*3), dur=28+pkRand(i,5)*44;
          const tn=(t==='sunset')?['so','sp','sv'][Math.floor(pkRand(i,4)*3)]:['w','b'][Math.floor(pkRand(i,4)*2)];
          parts.push({ k:'cloud', url:_svgUri(cloudSvg(wc,tn,{h:hh})), y:y, h:hh, d:dur, del:-i*9, layer:'back', frozen:frozen }); }
        if(t==='sunset') statics.push({ url:_svgUri(sunSvg({h:52})), cx:W*0.5, y:H*0.32-26, h:52 });                       // pkrisesun 종료 상태(top 32% 중앙)
        else if(t==='rainbow') statics.push({ url:_svgUri(authRainbowSvg({h:60})), cx:W*0.5, yb:H*0.46, h:60, alpha:0.8 }); // bottom 54%(=바닥선)
        else if(t==='night'){ statics.push({ url:_svgUri(moonSvg({h:30})), x:W*0.70, y:H*0.05, h:30 });
          for(let i=0;i<pkCount(14);i++){ const l=W*((4+pkRand(i,11)*92)/100), tp=H*((4+pkRand(i,12)*38)/100), hh=Math.round(3+pkRand(i,13)*4);
            parts.push({ k:'star', url:_svgUri(nightStarSvg({h:hh})), x:l, y:tp, h:hh, layer:'back', frozen:frozen }); } }
        const HX=[18,50,82], HHT=[18,16,20], hp=(t==='sunset')?HILL_SUNSET:(t==='night'?HILL_NIGHT:HILL_DAY);
        for(let i=0;i<3;i++) statics.push({ url:_svgUri(hillSvg(hp,{h:HHT[i]})), cx:W*HX[i]/100, yb:H*0.46+3, h:HHT[i] });   // 바닥선 3px 아래(바닥 fill이 덮음)
      }
      const fp=FLOOR_CATALOG.find(x=>x.id===currentFloor());
      if(fp&&fp.scene){ const t=fp.scene, bY=H*0.54;   // 바닥 밴드(바닥 컨테이너 bottom=방 bottom, 높이 54%)
        const nt=pkCount(16);   // 풀포기 — pkbend ±5°(2s), delay -i*0.35s, 중심=center bottom
        for(let i=0;i<nt;i++){ const d=pkRand(i,31)*0.85, l=2+(i+0.5)/nt*94+(pkRand(i,32)-0.5)*3.5, sc=1-d*0.4, bot=4+d*72, hh=Math.max(6,Math.round(13*sc));
          parts.push({ k:'bend', url:_svgUri(tuftSvg({h:hh})), x:W*l/100, yb:H-bY*bot/100, h:hh, deg:5, d:2.0, del:-i*0.35, layer:'back', frozen:frozen }); }
        const fc=(t==='sunset')?['su','sg','sw']:['r','y','p'];   // 꽃 — pkbend 2.6s
        for(let i=0;i<14;i++){ const d=pkRand(i,21)*0.62, l=5+(i+0.5)/14*90+(pkRand(i,22)-0.5)*3.5, sc=1-d*0.4, bot=4+d*68, hh=Math.max(8,Math.round(15*sc));
          parts.push({ k:'bend', url:_svgUri(flowerSvg(fc[Math.floor(pkRand(i,23)*3)],{h:hh})), x:W*l/100, yb:H-bY*bot/100, h:hh, deg:5, d:2.6, del:-i*0.35, layer:'back', frozen:frozen }); }
        if(t==='night'){ for(let i=0;i<pkCount(6);i++){ const l=6+pkRand(i,61)*88, b=10+pkRand(i,62)*50, hh=Math.round(8+pkRand(i,63)*3), dur=5+pkRand(i,64)*4, bd=1+pkRand(i,65)*1.2, del=-pkRand(i,66)*6; let _s=70; const rnd=function(){ return pkRand(i,_s++); };
          parts.push(Object.assign({ k:'flit', url:_svgUri(fireflySvg({h:hh})), x:W*l/100, y:(H-bY*b/100)-hh, h:hh, d:dur, del:del, bd:bd, layer:'back', frozen:frozen }, _vpipFlitPts(rnd))); } }
        else { const BFT=['o','b','p','y']; for(let i=0;i<pkCount(4);i++){ const l=10+pkRand(i,71)*80, b=20+pkRand(i,72)*40, hh=Math.round(9+pkRand(i,73)*4), dur=6.5+pkRand(i,74)*5, del=-pkRand(i,75)*8, fd=0.32+pkRand(i,76)*0.24; let _s=90; const rnd=function(){ return pkRand(i,_s++); };
          parts.push(Object.assign({ k:'flit', url:_svgUri(butterflySvg(BFT[i%4],{h:hh})), x:W*l/100, y:(H-bY*b/100)-hh, h:hh, d:dur, del:del, fd:fd, layer:'back', frozen:frozen }, _vpipFlitPts(rnd))); } }
      }
      // 🌌 배경효과(방 전체 오버레이, over층 — 펫 위) — bgfxOverlayHtml과 동일 슬롯·원근·난수 스트림(위치·경로 픽셀 동일)
      const gid=currentBgfx();
      if(gid){ const lite=liteMode(); const Nc=function(k){ return Math.max(3,Math.round(k*(lite?0.6:1))); };
        const persB=function(yy){ return 13+(1-yy)*72; }, persS=function(yy){ return 0.66+yy*0.62; };
        const bfly=function(n,tints){ const P=pkSlots(n,110); for(let i=0;i<n;i++){ const o=P[i], hh=Math.round((12+pkRand(i,13)*5)*persS(o.yy)), dur=6+pkRand(i,14)*5, fd=0.30+pkRand(i,15)*0.26, del=-pkRand(i,16)*8; let _s=20; const rnd=function(){ return pkRand(i,_s++); };
          parts.push(Object.assign({ k:'flit', url:_svgUri(butterflySvg(tints[i%tints.length],{h:hh})), x:W*o.x/100, y:H-(H*persB(o.yy)/100)-hh, h:hh, d:dur, del:del, fd:fd, layer:'over', frozen:frozen }, _vpipFlitPts(rnd))); } };
        const leaf=function(n,colf){ for(let i=0;i<n;i++){ const x=(i+0.5)/n*94+3+(pkRand(i,31)-0.5)*(84/n), d=pkRand(i,37), hh=Math.round((10+pkRand(i,35)*5)*(0.72+(1-d)*0.5)), dur=6.5+d*6, del=-pkRand(i,33)*10, sw=2.2+pkRand(i,34)*1.6, dir=(pkRand(i,36)<0.5?-1:1);
          parts.push({ k:'fall', url:_svgUri(colf(i,hh)), x:W*x/100, y0:-0.09*H, y1:1.06*H, h:hh, d:dur, del:del, sw:sw, dir:dir, layer:'over', frozen:frozen }); } };
        const dfly=function(n){ const P=pkSlots(n,140); for(let i=0;i<n;i++){ const o=P[i], hh=Math.round((11+pkRand(i,43)*5)*persS(o.yy)), dur=6+pkRand(i,44)*5, del=-pkRand(i,45)*8; let _s=50; const rnd=function(){ return pkRand(i,_s++); };
          parts.push(Object.assign({ k:'flit', url:_svgUri(dragonflySvg({h:hh})), x:W*o.x/100, y:H-(H*persB(o.yy)/100)-hh, h:hh, d:dur, del:del, tilt:1, layer:'over', frozen:frozen }, _vpipFlitPts(rnd))); } };
        const fire=function(n){ const P=pkSlots(n,170); for(let i=0;i<n;i++){ const o=P[i], hh=Math.round((9+pkRand(i,63)*4)*persS(o.yy)), dur=5+pkRand(i,64)*5, bd=1+pkRand(i,65)*1.4, del=-pkRand(i,66)*6; let _s=70; const rnd=function(){ return pkRand(i,_s++); };
          parts.push(Object.assign({ k:'flit', url:_svgUri(fireflySvg({h:hh})), x:W*o.x/100, y:H-(H*persB(o.yy)/100)-hh, h:hh, d:dur, del:del, bd:bd, layer:'over', frozen:frozen }, _vpipFlitPts(rnd))); } };
        if(gid==='butterflies') bfly(Nc(7),['o','b','p','y']);
        else if(gid==='rainbowflutter') bfly(Nc(10),['o','b','p','y','o','p']);
        else if(gid==='mapleleaves') leaf(Nc(10),function(i,hh){ return mapleLeafSvg({h:hh}, LEAF_COLS[Math.floor(pkRand(i,207)*LEAF_COLS.length)]); });
        else if(gid==='sakura') leaf(Nc(10),function(i,hh){ return petalSvg({h:hh}); });
        else if(gid==='dragonflies') dfly(Nc(5));
        else if(gid==='fireflies') fire(Nc(8));
      }
    }
    // 씬 키트 = { back(벽·바닥·씬 정적), furn(가구·똥, 투명), fx(가구 연출 레이어+bmp), parts(파티클+bmp) } — 전부 origin-clean 비트맵.
    function _vpipSceneKit(){
      const W=_VPIP_W, H=_VPIP_H;
      try{
        const frozen=(reducedMotion()||liteMode());   // DOM 정책 미러: 모션축소·가벼운 모드 = 연출·파티클 정지 표시
        const pl=_vpipPaintList(frozen);
        const statics=[], parts=[];
        _vpipScenePieces(statics, parts, frozen);
        const backCv=document.createElement('canvas'); backCv.width=W*_VPIP_SC; backCv.height=H*_VPIP_SC;
        const furnCv=document.createElement('canvas'); furnCv.width=W*_VPIP_SC; furnCv.height=H*_VPIP_SC;
        const loads=[
          _vpipBgFill(_vpipResolveCss(wallCss(currentWall())), 0, 0, W, H*0.462),
          _vpipBgFill(_vpipResolveCss(floorCss(currentFloor())), 0, H*0.455, W, H*0.545)
        ]
        .concat(statics.map(function(s){ return _vpipImgLoad(s.url).catch(function(){ return null; }); }))
        .concat(pl.paint.map(function(it){ return _vpipImgLoad(it.url).catch(function(){ return null; }); }))
        .concat(pl.fx.map(function(f){ return _vpipBmp(f.url).catch(function(){ return null; }); }))
        .concat(parts.map(function(p){ return _vpipBmp(p.url).catch(function(){ return null; }); }));
        return Promise.all(loads).then(function(res){
          let k=0; const wallFill=res[k++], floorFill=res[k++];
          const sImgs=statics.map(function(){ return res[k++]; });
          const pImgs=pl.paint.map(function(){ return res[k++]; });
          const fBmps=pl.fx.map(function(){ return res[k++]; });
          const ptBmps=parts.map(function(){ return res[k++]; });
          // back: 벽 → 씬 정적 조각(언덕·해·무지개·달 — 바닥 fill이 언덕 밑단 3px을 덮게 바닥보다 먼저) → 바닥
          const bctx=backCv.getContext('2d'); bctx.setTransform(_VPIP_SC,0,0,_VPIP_SC,0,0); bctx.imageSmoothingEnabled=false;
          wallFill(bctx);
          statics.forEach(function(s,i){ const im=sImgs[i]; if(!im) return; const w=im.width/im.height*s.h;
            const x=(s.cx!=null)?(s.cx-w/2):s.x, y=(s.yb!=null)?(s.yb-s.h):s.y;
            bctx.save(); if(s.alpha!=null) bctx.globalAlpha=s.alpha; try{ bctx.drawImage(im, x, y, w, s.h); }catch(e){} bctx.restore(); });
          floorFill(bctx);
          // furn: 가구·벽가구·똥(투명 배경 — 워커가 back → 씬 파티클 → furn 순서로 겹침)
          const fctx=furnCv.getContext('2d'); fctx.setTransform(_VPIP_SC,0,0,_VPIP_SC,0,0); fctx.imageSmoothingEnabled=false;
          pl.paint.forEach(function(it,i){ const im=pImgs[i]; if(!im) return;
            fctx.save();
            if(it.flip){ fctx.translate(it.x+it.w/2,0); fctx.scale(-1,1); fctx.translate(-(it.x+it.w/2),0); }   // transform-origin center와 동일한 좌우 반전
            try{ fctx.drawImage(im, it.x, it.y, it.w, it.h); }catch(e){}
            fctx.restore(); });
          const fx=[]; pl.fx.forEach(function(f,i){ if(fBmps[i]){ f.bmp=fBmps[i]; delete f.url; f.frozen=frozen; fx.push(f); } });
          const pts=[]; parts.forEach(function(p,i){ if(ptBmps[i]){ p.bmp=ptBmps[i]; delete p.url; pts.push(p); } });
          return Promise.all([createImageBitmap(backCv), createImageBitmap(furnCv)]).then(function(bs){
            return { back:bs[0], furn:bs[1], fx:fx, parts:pts, spots:pl.spots||[] };
          });
        }).catch(function(){ return { back:null, furn:null, fx:[], parts:[], spots:[] }; });
      }catch(e){ return Promise.resolve({ back:null, furn:null, fx:[], parts:[], spots:[] }); }   // 씬 실패해도 펫만으로 진행
    }
    // 활성 펫 에셋(ImageBitmap): 스프라이트=걷기 시트+south(+frontWalk면 east 스틸) / SVG 매트릭스 펫=정면 스틸(제자리 — 정면 이동 금지 불변식)
    function _vpipPetAssets(){ const list=activeCats().slice(0,slotCount()); ensurePetArtMany(list);
      return Promise.all(list.map(function(id){ const hh=petActorPx(id,32,200);
        if(hasSprite(id)){ const spr=PET_SPRITES[id]; if(spr.runtime&&!spr.urls) return Promise.resolve(null);   // 아트 로딩 전 — 도착 시 _petArtRerenderNow가 재동기화
          const fw=!!spr.frontWalk;
          const cosm=petCosm(id);   // 💗 코스메틱(모자·버디)도 워커에 전사 — dock와 동일하게 보이게(가구 연출 _VPIP_FX_* 선례)
          const dyeF=dyeFilterCss(petDyeOf(id));   // 🎨 염색은 시트/스틸 비트맵에 베이크(_vpipBmp filt — 워커 ctx.filter 미의존). 모자·버디는 미염색(dock 동일).
          const hatP=(cosm.hat&&HAT_M[cosm.hat])?_vpipBmp('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(hatSvg(cosm.hat,{h:60}))).catch(function(){ return null; }):Promise.resolve(null);
          const budP=BUDDY_CATALOG[cosm.buddy]?_vpipBmp('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(buddySvgOf(cosm.buddy,{h:30}))).catch(function(){ return null; }):Promise.resolve(null);   // 코스메틱 로드 실패가 펫 본체를 드랍시키지 않게 개별 폴백
          const headP=new Promise(function(res){ try{ measureHeadPad(id,res); }catch(e){ res(0.2); } });
          const footP=new Promise(function(res){ try{ measureFootPad(id,res); }catch(e){ res(null); } });   // 🐾 발밑 여백 실측 — 워커 고정 0.16 가정은 신화·한정(실측 ~0.30)에서 발이 떠 벽지를 걷는 버그
          return Promise.all([_vpipBmp(sprWalkUrl(spr), dyeF), _vpipBmp(sprStill(id,'south'), dyeF), fw?_vpipBmp(sprStill(id,'east'), dyeF):Promise.resolve(null), hatP, budP, headP, footP])
            .then(function(bs){ return { hh:hh, frames:spr.frames||6, frontWalk:fw, sheet:bs[0], south:bs[1], east:bs[2]||null, hat:bs[3]||null, buddy:bs[4]||null, btype:cosm.buddy||'', headF:(bs[5]==null?0.2:bs[5]), fp:(bs[6]==null?0.16:bs[6]) }; })
            .catch(function(){ return null; });
        }
        return _vpipBmp('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(catFace(id,{h:hh})))
          .then(function(b){ return { hh:hh, frames:1, frontWalk:true, stationary:true, sheet:null, south:b, east:null }; })
          .catch(function(){ return null; });
      })).then(function(arr){ return arr.filter(Boolean); }); }
    // 워커 소스(Blob) — 미니 배회 심 + 드로잉. dock 엔진 상수(RISE 0.53·근1.5/원0.86·발밑 0.16) 공유해 원근 일치.
    let _vpipWURL=null;
    function _vpipWorkerUrl(){ if(_vpipWURL) return _vpipWURL;
      const src=[
        "var W=360,H=200,SC=2,ctx=null,cvs=null,writer=null,back=null,furn=null,fx=[],parts=[],pets=[],spots=[],occ={},rm=false,last=0,timer=0;",
        "function eio(u){ return u<0.5?2*u*u:1-Math.pow(-2*u+2,2)/2; }",
        "function tri(u){ return u<0.5?eio(u*2):eio((1-u)*2); }",
        "function ph(t,d,del){ var u=((t-(del||0))/d)%1; return u<0?u+1:u; }",
        "function seg(st,va,u){ for(var i=1;i<st.length;i++){ if(u<=st[i]){ var p=(u-st[i-1])/((st[i]-st[i-1])||1); p=eio(p); return va[i-1]+(va[i]-va[i-1])*p; } } return va[va.length-1]; }",
        "function fxT(f,t){ var u=ph(t, f.dur, -f.ph*f.dur); var r={rot:0,tx:0,ty:0,sx:1,sy:1,a:1};",
        "  switch(f.kf){",
        "   case 'spin': r.rot=u*360; break;",
        "   case 'swing': r.rot=-6+12*tri(u); break;",
        "   case 'sway': r.rot=-4.5+9*tri(u); break;",
        "   case 'drift': r.tx=(-4+8*tri(u))/100; break;",
        "   case 'fish': r.tx=seg([0,.22,.46,.6,.8,1],[-6,4,13,20,7,-6],u)/100; r.ty=seg([0,.22,.46,.6,.8,1],[2,-3,1,-2,3,2],u)/100; break;",
        "   case 'pondfish': r.tx=seg([0,.25,.5,.72,1],[-5,-1,5,1.5,-5],u)/100; r.ty=seg([0,.25,.5,.72,1],[1,-2.5,1,-1.5,1],u)/100; break;",
        "   case 'leaf': r.tx=(-1.2+2.4*tri(u))/100; r.ty=(0.6-1.2*tri(u))/100; break;",
        "   case 'ripple': r.tx=(-1+2.2*tri(u))/100; break;",
        "   case 'flicker': r.sy=seg([0,.3,.55,.8,1],[1,1.08,.94,1.05,1],u); r.tx=seg([0,.3,.55,.8,1],[0,-4,3,-2,0],u)/100; break;",
        "   case 'flame': r.sy=seg([0,.2,.45,.7,.88,1],[1,1.2,.86,1.13,.95,1],u); r.tx=seg([0,.2,.45,.7,.88,1],[0,-7,6,-4,3,0],u)/100; break;",
        "   case 'decoblink': r.a=(u<.76?1:u<.84?.32:u<.88?.9:u<.96?.4:1); break;",
        "   case 'neon': r.a=(u<.59?1:u<.65?.3:u<.78?1:u<.84?.5:u<.92?1:u<.95?.28:1); break;",
        "   case 'dropbob': r.ty=(-3*tri(u))/f.h; break;",
        "   case 'dropflip': var q5=Math.floor(u*4); if(q5===1||q5===3){ r.sx=.45; } break;",
        "   case 'droptw': r.a=(u<1/3?.35:(u<2/3?1:.6)); var s5=(u<1/3?.8:(u<2/3?1.15:1)); r.sx=s5; r.sy=s5; break;",
        "   case 'sheen': if(u<.45){ var p2=eio(u/.45); r.tx=(-5+10*p2)/100; r.ty=r.tx; r.a=.2+.8*p2; } else if(u<.58){ r.tx=.05; r.ty=.05; r.a=1-((u-.45)/.13)*.8; } else { var q=(u-.58)/.42; r.tx=(5-10*q)/100; r.ty=r.tx; r.a=.2; }",
        "  } return r; }",
        "function drawFx(f,t){ var r=f.frozen?{rot:0,tx:0,ty:0,sx:1,sy:1,a:1}:fxT(f,t);",
        "  ctx.save(); ctx.globalAlpha=r.a;",
        "  if(f.flip){ ctx.translate(f.x+f.w/2,0); ctx.scale(-1,1); ctx.translate(-(f.x+f.w/2),0); }",
        "  ctx.translate(f.x+f.ox*f.w+r.tx*f.w, f.y+f.oy*f.h+r.ty*f.h);",
        "  if(r.rot) ctx.rotate(r.rot*Math.PI/180);",
        "  if(r.sx!==1||r.sy!==1) ctx.scale(r.sx,r.sy);",
        "  try{ ctx.drawImage(f.bmp, -f.ox*f.w, -f.oy*f.h, f.w, f.h); }catch(e){}",
        "  ctx.restore(); }",
        "function drawPart(p,t){ ctx.save(); try{ var w=p.bmp.width/p.bmp.height*p.h;",
        "  if(p.k==='cloud'){ var u=p.frozen?0.3:ph(t,p.d,p.del); ctx.drawImage(p.bmp, -64+664*u, p.y, w, p.h); }",
        "  else if(p.k==='star'){ ctx.globalAlpha=p.frozen?1:(.45+.55*tri(ph(t,3,0))); ctx.drawImage(p.bmp, p.x, p.y, w, p.h); }",
        "  else if(p.k==='bend'){ var rot=p.frozen?0:(-p.deg+2*p.deg*tri(ph(t,p.d,p.del)));",
        "    ctx.translate(p.x, p.yb); ctx.rotate(rot*Math.PI/180); ctx.drawImage(p.bmp, -w/2, -p.h, w, p.h); }",
        "  else if(p.k==='fall'){ var u3=p.frozen?0.35:ph(t,p.d,p.del); var y=p.y0+(p.y1-p.y0)*u3;",
        "    var v=p.frozen?0.5:tri(ph(t,p.sw,0)); var sx=p.dir*(-8+16*v), rot2=p.dir*(-42+84*v);",
        "    ctx.translate(p.x+sx, y+p.h/2); ctx.rotate(rot2*Math.PI/180); ctx.drawImage(p.bmp, -w/2, -p.h/2, w, p.h); }",
        "  else if(p.k==='flit'){ var u2=p.frozen?0:ph(t,p.d,p.del);",
        "    var dx=seg([0,.25,.5,.75,1],[0,p.x1,p.x2,p.x3,0],u2), dy=seg([0,.25,.5,.75,1],[0,p.y1,p.y2,p.y3,0],u2);",
        "    ctx.translate(p.x+dx+w/2, p.y+dy+p.h/2);",
        "    if(p.fd&&!p.frozen){ ctx.scale(1-0.5*tri(ph(t,p.fd,0)),1); }",
        "    if(p.tilt&&!p.frozen){ ctx.rotate((-8+16*tri(ph(t,1.1,0)))*Math.PI/180); }",
        "    if(p.bd){ ctx.globalAlpha=p.frozen?1:(.3+.7*tri(ph(t,p.bd,0))); }",
        "    ctx.drawImage(p.bmp, -w/2, -p.h/2, w, p.h); }",
        "  }catch(e){} ctx.restore(); }",
        "function setPets(list){ occ={}; pets=(list||[]).map(function(p,i){ var e={}; for(var k in p) e[k]=p[k]; e.lift=0; e.spot=null; e.tz=null;",
        "  e.x=16+Math.random()*(W-e.hh-32); e.dir=Math.random()<0.5?-1:1; e.v=0.0084+Math.random()*0.0108;",   // 🐾 dock 엔진 미러: 0.14~0.32 × 0.06 = 0.0084~0.0192 px/ms(예전 0.018~0.038은 ~2배 빨라 PiP에서 펫이 급해 보임)
        "  e.wd=Math.max(450,Math.min(1500,(0.42*e.hh)/(e.v*0.966)));",   // 걷기 필름 한 사이클(ms) — 메인 walkDur(stride/속도, 0.45~1.5s) 미러(발 미끄러짐 방지)
        "  e.depth=Math.random(); e.vz=(Math.random()*2-1)*0.000008;",   // 앞뒤(깊이) 배회도 dock와 동일(±0.000008/ms — 예전 0.00004는 5배)
        "  e.seed=Math.random()*6.28;",   // 💗 버디(동행) 경로 위상 — 펫마다 어긋나게
        "  e.mode=(rm||e.stationary)?'pause':'roam'; e.pt=1e9; if(!rm&&!e.stationary) e.pt=0; return e; }); }",
        "function relSpot(a){ if(a.spot!=null){ delete occ[a.spot]; a.spot=null; } a.lift=0; }",
        "function step(dt){ if(rm) return; for(var i=0;i<pets.length;i++){ var a=pets[i]; if(a.stationary) continue;",
        "  if(a.mode==='pause'){ a.pt-=dt; if(a.pt<=0){ a.mode='roam'; relSpot(a); a.dir=Math.random()<0.5?-1:1; } continue; }",
        "  var ds=1.5-(1.5-0.86)*a.depth, w=a.hh*ds;",
        // 🪑 가구로 대각선 걷기 — dock stepActors goal 수식 미러(x 진척 비례 깊이 수렴·도착 스냅·자리 올라앉기 lift)
        "  if(a.mode==='goal'){ var g=spots[a.spot];",
        "    if(!g){ a.mode='roam'; relSpot(a); continue; }",
        "    var cx=a.x+w/2, dxr=g.x-cx, adx=Math.abs(dxr), nearX=adx<6;",
        "    if(!nearX){ a.dir=(dxr>0)?1:-1; a.x+=a.dir*a.v*dt; }",
        "    var dd=g.depth-a.depth, add=Math.abs(dd);",
        "    var stp=nearX?Math.min(add,0.00008*dt):Math.min(add, add*((a.v*dt)/Math.max(adx,1))+0.00003*dt);",
        "    a.depth+=(dd>0?1:-1)*stp;",
        "    if(nearX){ a.x=Math.max(2,Math.min(W-w,g.x-w/2)); if(add<0.03){ a.mode='pause'; a.pt=g.dur*(0.45+Math.random()*0.55); a.lift=g.lift||0; } }",
        "    continue; }",
        "  a.x+=a.dir*a.v*dt; if(a.x<2){ a.x=2; a.dir=1; } if(a.x>W-w){ a.x=Math.max(2,W-w); a.dir=-1; }",
        // 🚶 앞뒤 산책(tz=목표 깊이) — '처음 배치된 가로선에서만 왔다갔다' 버그 수정: 목표 깊이로 걸으며 대각선 이동(전체 범위 ~20초)
        "  if(a.tz!=null){ var dz=a.tz-a.depth, sz=Math.min(Math.abs(dz),0.00005*dt); a.depth+=(dz>0?1:-1)*sz; if(Math.abs(dz)<0.012) a.tz=null; }",
        "  else { a.depth=Math.max(0,Math.min(1,a.depth+a.vz*dt)); if(Math.random()<0.004) a.vz=(Math.random()*2-1)*0.000008; if(Math.random()<0.0016) a.tz=Math.random(); }",
        "  if(spots.length && Math.random()<0.004){ var free=[]; for(var s2=0;s2<spots.length;s2++){ if(occ[s2]==null) free.push(s2); }",
        "    if(free.length){ var si=free[Math.floor(Math.random()*free.length)]; occ[si]=i; a.spot=si; a.mode='goal'; continue; } }",
        "  if(Math.random()<0.0022){ a.mode='pause'; a.pt=2200+Math.random()*3800; }",
        "} }",
        "function drawPet(a,now){ var ds=1.5-(1.5-0.86)*a.depth, h=a.hh*ds, w=h;",
        "  var y=H-(a.depth*0.53*H)-h+h*(a.fp!=null?a.fp:0.16)-(a.lift||0);",   // 발밑 여백 = 펫별 실측(fp) — dock의 measureFootPad와 동일(고정 0.16은 신화·한정에서 발이 ~14% 떠 벽지 걷기)
        "  var moving=(a.mode==='roam'&&!a.stationary), flip=(moving&&a.dir<0);",
        "  ctx.save(); if(flip){ ctx.translate(a.x+w,0); ctx.scale(-1,1); } else { ctx.translate(a.x,0); }",
        "  try{",
                "    if(moving&&a.sheet&&!a.frontWalk){ var sw=a.sheet.width/a.frames, fr=Math.floor(now/((a.wd||660)/a.frames))%a.frames; ctx.drawImage(a.sheet, fr*sw,0,sw,a.sheet.height, 0,y,w,h); }",   // 프레임 간격 = 사이클(wd)/프레임수 — 속도 연동(예전 고정 110ms는 발놀림이 빨랐음)
        "    else if(moving&&a.frontWalk&&a.east){ ctx.drawImage(a.east,0,y,w,h); }",
        "    else if(a.south){ ctx.drawImage(a.south,0,y,w,h); }",
                "    if(a.hat){ var hh3=w*0.20, hw2=hh3*(a.hat.width/a.hat.height), hdx=(moving?0.13*w:0); ctx.drawImage(a.hat, w/2-hw2/2+hdx, y+h*(a.headF||0.2)-hh3*0.55, hw2, hh3); }",   // 💗 모자 — dock .cd-hat(0.20·-55%·옆모습 hatdx) 전사. moving=옆모습(east 로컬 머리 오른쪽 → +hdx), flip이 west 반전. 정지=south 정면(hdx0)
        "  }catch(e){}",
        "  ctx.restore();",
        "  if(a.buddy){ try{ var t2=now/1000, bw=w*(a.btype==='firefly'?0.15:0.20), bh2=bw*(a.buddy.height/a.buddy.width);",   // 💗 동행 버디 — 경로(느린 궤도)+날갯짓/발광 다층(dock cbpath+cbbob/cbglow 전사)
        "    var bx=a.x+w/2+Math.sin(t2*0.84+a.seed)*w*0.40+Math.sin(t2*0.31+a.seed*2)*w*0.10;",
        "    var by=y+h*(a.headF||0.2)+Math.cos(t2*1.17+a.seed)*7-6;",
        "    ctx.save(); ctx.translate(bx,by);",
        "    if(a.btype==='firefly'){ ctx.globalAlpha=0.4+0.6*(0.5+0.5*Math.sin(t2*2.7+a.seed)); }",
        "    else if(a.btype==='butterfly'){ ctx.scale(0.62+0.38*Math.abs(Math.sin(t2*5.5+a.seed)),1); }",
        "    else { ctx.rotate((Math.sin(t2*1.9+a.seed)*11)*Math.PI/180); }",   // 🌈 무지개꽃 등: 빙글 트월(dock cbtwirl 미러)
        "    ctx.drawImage(a.buddy,-bw/2,-bh2/2,bw,bh2); ctx.restore(); }catch(e){} } }",
        "function draw(now){ if(!ctx) return; var t=now/1000; ctx.setTransform(SC,0,0,SC,0,0); ctx.imageSmoothingEnabled=false;",
        "  ctx.clearRect(0,0,W,H); if(back) ctx.drawImage(back,0,0,W,H);",
        "  for(var i=0;i<parts.length;i++){ if(parts[i].layer!=='over') drawPart(parts[i],t); }",
        "  if(furn) ctx.drawImage(furn,0,0,W,H);",
        "  var ds2=[]; for(var j=0;j<fx.length;j++) ds2.push({z:fx[j].fr, f:fx[j]});",
        "  for(var j2=0;j2<pets.length;j2++) ds2.push({z:8-pets[j2].depth*7, p:pets[j2]});",
        "  ds2.sort(function(a,b){ return a.z-b.z; });",
        "  for(var m=0;m<ds2.length;m++){ if(ds2[m].f) drawFx(ds2[m].f,t); else drawPet(ds2[m].p,now); }",
        "  for(var n2=0;n2<parts.length;n2++){ if(parts[n2].layer==='over') drawPart(parts[n2],t); }",
        "}",
        "var ticks=0;",
        "function tick(){ ticks++; var now=Date.now(), dt=Math.min(90, last?now-last:33); last=now; step(dt); draw(now);",
        "  if(writer){ try{ if(writer.desiredSize>0){ var vf=new VideoFrame(cvs, {timestamp: now*1000}); writer.write(vf); } }catch(e){} }",
        "}",
        "function setScene(d){ back=d.back||null; furn=d.furn||null; fx=d.fx||[]; parts=d.parts||[]; spots=d.spots||[]; occ={};",
        "  for(var i3=0;i3<pets.length;i3++){ var p3=pets[i3]; p3.spot=null; p3.lift=0; if(p3.mode==='goal') p3.mode='roam'; } }",
        "onmessage=function(ev){ var d=ev.data||{};",
        "  if(d.t==='init'){ SC=d.sc||2; W=d.W||360; H=d.H||200;",
        "    if(d.sink){ cvs=new OffscreenCanvas(W*SC, H*SC); writer=d.sink.getWriter(); }",
        "    else { cvs=d.canvas; }",
        "    ctx=cvs.getContext('2d'); rm=!!d.rm; setScene(d); setPets(d.pets); last=0; clearInterval(timer); timer=setInterval(tick,33); }",
        "  else if(d.t==='scene'){ setScene(d); }",
        "  else if(d.t==='pets'){ setPets(d.pets); }",
        "  else if(d.t==='ping'){ postMessage({t:'pong', ticks:ticks, fx:fx.length, parts:parts.length, pets:pets.length, spots:spots.length, back:!!back, furn:!!furn}); }",
        "};"
      ].join('\n');
      _vpipWURL=URL.createObjectURL(new Blob([src],{type:'text/javascript'})); return _vpipWURL; }
    // 씬 키트(전송용) — 비트맵 Transferable 수집 헬퍼
    function _vpipKitXfer(kit){ const xf=[]; if(kit.back) xf.push(kit.back); if(kit.furn) xf.push(kit.furn);
      (kit.fx||[]).forEach(function(f){ if(f.bmp) xf.push(f.bmp); }); (kit.parts||[]).forEach(function(p){ if(p.bmp) xf.push(p.bmp); }); return xf; }
    function _vpipPropsSig(){ const r=room();
      return 'p:'+curRoomId()+'|'+JSON.stringify(r.placed||{})+'|'+JSON.stringify(r.wallPlaced||{})+'|'+(Number(r.poops)||0)+'|d:'+dropsSig(r)
        +'|'+currentWall()+'|'+currentFloor()+'|'+currentBgfx()+(liteMode()?'|L':'')+(reducedMotion()?'|R':'');   // 드랍(스폰/수집)·배경효과·lite·모션축소도 씬 재빌드 트리거
    }
    // 🔌 프레임 공급 경로 2종 — ① push(기본, Chromium): MediaStreamTrackGenerator의 writable을 워커로 넘겨 워커가 VideoFrame을 직접 밀어 넣음.
    //    canvas.captureStream은 컴포지터가 캔버스를 합성할 때 프레임을 뽑는 pull 구조라 **모바일에서 앱을 백그라운드로 보내면 캡처가 멈춰 PiP가 얼어붙는다**(사용자 실기기 확인).
    //    push는 컴포지터 비의존 — PiP 재생 중 페이지는 Chrome 백그라운드 동결 예외라 워커가 계속 돌며 프레임이 흐른다. ② captureStream 폴백(생성기 미지원 브라우저).
    function _vpipPushSupported(){ try{ return typeof MediaStreamTrackGenerator!=='undefined' && typeof VideoFrame!=='undefined'; }catch(e){ return false; } }
    function openVideoPip(){
      Promise.all([_vpipSceneKit(), _vpipPetAssets()]).then(function(res){
        if(vpipOpen()||pipOpen()) return;   // 로딩 사이 중복 열림 방지
        const kit=res[0], pets=res[1];
        let stream, cv=null, off=null, sink=null;
        if(_vpipPushSupported()){
          const gen=new MediaStreamTrackGenerator({ kind:'video' });
          stream=new MediaStream([gen]); sink=gen.writable;   // 워커가 이 writable에 VideoFrame을 push(워커 안 OffscreenCanvas 자체 생성 — 플레이스홀더 캔버스 불필요)
        } else {
          cv=document.createElement('canvas'); cv.width=_VPIP_W*_VPIP_SC; cv.height=_VPIP_H*_VPIP_SC;
          cv.style.cssText='position:fixed;left:-99999px;top:0;'; document.body.appendChild(cv);
          stream=cv.captureStream(30);
          off=cv.transferControlToOffscreen();
        }
        const worker=new Worker(_vpipWorkerUrl());
        worker.onerror=function(e){ try{ console.warn('비디오 PiP 워커 오류', (e&&e.message)||e); }catch(_e){} };   // 워커 스크립트 오류 가시화(조용한 정지 방지)
        const xf=(off?[off]:[]).concat(sink?[sink]:[]).concat(_vpipKitXfer(kit)); pets.forEach(function(p){ ['sheet','south','east','hat','buddy'].forEach(function(k){ if(p[k]) xf.push(p[k]); }); });
        worker.postMessage({t:'init', canvas:off, sink:sink, sc:_VPIP_SC, W:_VPIP_W, H:_VPIP_H, back:kit.back, furn:kit.furn, fx:kit.fx, parts:kit.parts, spots:kit.spots||[], rm:reducedMotion(), pets:pets}, xf);
        const v=document.createElement('video'); v.muted=true; v.playsInline=true; v.autoplay=true;
        v.style.cssText='position:fixed;left:-99999px;top:0;width:'+_VPIP_W+'px;'; v.srcObject=stream; document.body.appendChild(v);
        _vpip={ video:v, canvas:cv, worker:worker, stream:stream,
          sigProps:_vpipPropsSig(),
          sigCats:'c:'+activeCats().slice(0,slotCount()).join(',') };
        v.addEventListener('leavepictureinpicture', _vpipClosed, {once:true});   // X·토글·다른 PiP로 대체 등 모든 닫힘 경로
        return v.play().then(function(){ return v.requestPictureInPicture(); }).then(function(){ _pipBtnSync(); });
      }).catch(function(e){
        try{ console.warn('비디오 PiP 실패 — 폴백', e); }catch(_e){}
        _vpipClosed();   // 부분 생성물 정리
        if(docPipSupported()){ openDocPip(); }   // 활성화가 남아 있으면 창 PiP로 폴백
        else toast('PiP를 열지 못했어요', true);
      });
    }
    function closeVideoPip(){ if(!_vpip) return;
      if(document.pictureInPictureElement===_vpip.video){ document.exitPictureInPicture().catch(function(){ _vpipClosed(); }); }   // exit → leave 이벤트 → _vpipClosed
      else _vpipClosed(); }
    function _vpipClosed(){ const s=_vpip; _vpip=null; if(!s) return;   // idempotent(leave 이벤트+수동 정리 중복 안전)
      try{ if(s.worker) s.worker.terminate(); }catch(e){}
      try{ if(s.stream) s.stream.getTracks().forEach(function(t){ t.stop(); }); }catch(e){}
      try{ if(s.video){ s.video.srcObject=null; s.video.remove(); } }catch(e){}
      try{ if(s.canvas) s.canvas.remove(); }catch(e){}
      _pipBtnSync(); }
    // 방·가구·펫 변경 라이브 반영 — 서명 가드로 바뀐 쪽 비트맵만 재생성·전송(onGameChange에서 호출)
    function _vpipSync(){ if(!vpipOpen()) return;
      const ps=_vpipPropsSig();
      if(_vpip.sigProps!==ps){ _vpip.sigProps=ps;
        _vpipSceneKit().then(function(kit){ if(!vpipOpen()) return;
          _vpip.worker.postMessage({t:'scene', back:kit.back, furn:kit.furn, fx:kit.fx, parts:kit.parts, spots:kit.spots||[]}, _vpipKitXfer(kit)); }); }
      const cs='c:'+activeCats().slice(0,slotCount()).map(id=>id+'~'+cosmSig(id)).join(',');   // 💗 코스메틱 변경도 재동기화
      if(_vpip.sigCats!==cs){ _vpip.sigCats=cs;
        _vpipPetAssets().then(function(pets){ if(!vpipOpen()) return;
          const xf=[]; pets.forEach(function(p){ ['sheet','south','east','hat','buddy'].forEach(function(k){ if(p[k]) xf.push(p[k]); }); });
          _vpip.worker.postMessage({t:'pets', pets:pets}, xf); }); } }
    // ---- 통합 걷기 엔진: 단일 rAF가 "지금 보이는 무대"(시트 방 또는 dock)만 애니메이션 ----
    // 고양이는 방/시트에 배치된 가구로 가끔 다가가 잠시 머문다(상호작용). 스트립엔 가구가 없어 자유 배회.
    // 🔋 가벼운 모드(저사양) — 사용자가 켜면 '장식/무거운 애니만' 끈다: 가구 연출·구름·나비·씬 정지, 걷기 엔진은 낮은 fps로 '계속 걷고', 가챠도 알/박스 탭·균열·결과 과정을 그대로 보여주되 흔들림·파티클·오오라만 제거(body.lite CSS). 저사양 폰 배터리/발열/버벅임 완화.
    //   ⚠️ OS 'prefers-reduced-motion'(접근성=전면 정적)과는 분리 — 라이트는 걷기·탭 같은 '기능성' 모션은 유지한다.
    function liteMode(){ try{ return localStorage.getItem('liteMode')==='1'; }catch(e){ return false; } }
    function reducedMotion(){ try{ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }
    // ⚡ 빠른 연출(이 기기) — 켜면 뽑기 탭 단계를 건너뛰고 바로 결과(reducedMotion과 같은 경로). 가챠 탭 우상단 칩으로 토글.
    function fxFastOn(){ try{ return localStorage.getItem('fxFast')==='1'; }catch(e){ return false; } }
    function toggleFxFast(){ try{ localStorage.setItem('fxFast', fxFastOn()?'0':'1'); }catch(e){}
      toast(fxFastOn()?'⚡ 빠른 연출 ON — 탭 없이 바로 결과를 보여줘요':'🎬 풀 연출 ON — 탭해서 여는 연출로 보여줘요');
      if(state._sheetRefresh) state._sheetRefresh(); }
    function applyLiteMode(){ try{ if(document&&document.body) document.body.classList.toggle('lite', liteMode()); }catch(e){} }
    function refreshRbStatic(){ _rbStatic = liteMode() || reducedMotion(); }   // 무지개 SMIL 정적화 여부 재평가
    function pkCount(n){ return liteMode()?Math.max(1,Math.round(n*0.55)):n; }   // 🔋 저사양 씬 데코 개수 감축(약 55%) — 씬 캐시는 setLiteMode에서 무효화
    function fxCount(n){ return liteMode()?Math.max(1,Math.round(n*0.55)):n; }   // 🔋 저사양 가챠 원샷 파티클 개수 감축(연출은 유지, 노드만 ~55%)
    function invalidateSceneCaches(){ _pkSceneCache={}; _sunsetCache={}; _nightCache={}; }   // 씬 HTML에 무지개 애니 여부가 구워지므로 토글 시 무효화
    function setLiteMode(on){ try{ localStorage.setItem('liteMode', on?'1':'0'); }catch(e){} applyLiteMode();
      if(typeof pipOpen==='function' && pipOpen()){ try{ _pip.doc.body.classList.toggle('lite', !!on); }catch(e){} }   // 🖥️ PiP 창 body.lite 동기화
      if(typeof vpipOpen==='function' && vpipOpen()){ try{ _vpipSync(); }catch(e){} }   // 🎬 비디오 PiP: lite 토글 → 연출 frozen 재빌드(서명에 |L 포함)
      refreshRbStatic(); invalidateSceneCaches();   // 🔋 무지개 정적화·씬 개수 변화 즉시 반영
      if(typeof markCatDirty==='function') markCatDirty(); if(typeof startCatLoop==='function') startCatLoop();   // 엔진 fps 예산 재평가·정지스틸 재빌드
      if(typeof rerender==='function') rerender();
      toast(on?'🔋 가벼운 모드 ON — 상시 애니는 줄이고 뽑기 연출은 가볍게 유지해요':'가벼운 모드 OFF'); }
    // 🔋 저사양 기기 1회 안내 — 코어4↓ 또는 메모리4GB↓면 최초 1회만 가벼운 모드 권유(기본 동작은 안 바꿈, 사용자가 선택). liteSuggested로 다시 안 뜸.
    function maybeSuggestLite(){ try{
      if(liteMode()) return;                                       // 이미 켜짐
      if(localStorage.getItem('liteSuggested')==='1') return;      // 이미 안내함(선택 무관 1회)
      if($('sheet') && $('sheet').classList.contains('on')) return;   // 다른 시트 열려 있으면 다음 기회에
      const hc=navigator.hardwareConcurrency, dm=navigator.deviceMemory;
      const lowEnd = (typeof hc==='number' && hc>0 && hc<=4) || (typeof dm==='number' && dm>0 && dm<=4);
      if(!lowEnd) return;
      localStorage.setItem('liteSuggested','1');
      if(typeof confirmSheet!=='function') return;
      confirmSheet('이 기기에서 배터리·발열을 아끼려면 가벼운 모드를 켤 수 있어요. 애니메이션을 줄이지만 걷기·뽑기 같은 기능은 그대로예요. 지금 켤까요?',
        function(){ setLiteMode(true); }, { title:'🔋 가벼운 모드', okLabel:'켜기', danger:false });
    }catch(e){} }
    // 걷기 스프라이트 애니메이션 주기(초): 발 놀림이 실제 이동속도에 맞도록 속도에 반비례 → 미끄러짐(무빙워크) 방지, 자연스러운 걸음.
    function walkDur(v, hh){ const stride=0.42*(hh||40), px=Math.max(0.001, v*58); return Math.max(0.45, Math.min(1.5, stride/px)).toFixed(2); }
    function setWalkDur(a){ if(a.spr){ const sc=a.el.querySelector('.cspr'); if(sc) sc.style.setProperty('--wdur', walkDur(a.v, a.hh)+'s'); } }
    // 펫 원근(캠/방): 배치칸 행처럼 펫도 앞뒤(깊이 depth 0=앞·가까움 ~ 1=뒤·멂)로 움직인다.
    //  · 가까우면 크게(PET_NEAR_SCALE)·앞으로(z↑), 멀면 작게(PET_FAR_SCALE)·뒤로(z↓) → 가구와 z-index로 상호 가림.
    //  · 요청대로 근거리 확대는 넉넉히, 원거리 축소는 적당히만(FAR를 너무 낮추지 않음).
    const PET_NEAR_SCALE=1.5, PET_FAR_SCALE=0.86;   // 근거리(맨 앞)에서 확실히 크게 → 화면 제일 앞으로 나온 느낌
    const PET_FOOT_PAD=0.16;   // 스프라이트 프레임 아래 투명 여백 비율(발밑) — 맨 앞(depth0)에서 발이 캠 rect 바닥에 붙도록 이만큼 내려 앉힌다
    // ⚠️ 방향 전환 쿨다운(ms): 벽 튕김·겹침분리·랜덤전환이 매 프레임 서로 반대로 dir를 뒤집어 "제자리 좌우 춤"추던 것 방지.
    // 이 시간 안에는 dir를 다시 뒤집지 않음 → 최대 ~2회/초. (도망·가구 접근은 의도된 전환이라 별도 처리.)
    const FLIP_COOL=450;
    // ⚠️ 함수명 주의: petScale(id)=펫별 크기배율(위쪽에 이미 정의, petActorPx가 사용)와 충돌 금지 → 원근 배율은 depthScale로.
    function depthScale(depth){ return PET_FAR_SCALE + (PET_NEAR_SCALE-PET_FAR_SCALE)*(1-depth); }
    // ⚠️ 깊이(depth)·드리프트속도(vz)는 펫 id별로 지속시킨다 — buildActors가 markCatDirty(코인·급여·멤버 등 RTDB 갱신)마다
    // 재실행되는데, 그때 depth를 Math.random()으로 다시 굴리면 **보고 있는 도중 앞뒤로 순간이동**하는 것처럼 보인다.
    // 마지막 depth/vz를 여기 저장해 두고 재빌드 때 그대로 이어받아, 맨앞↔맨뒤로 한 번에 튀는 일을 원천 차단한다.
    let _petDepth={}, _petVz={}, _petX={};   // depth·vz에 더해 가로위치 x도 지속 → 무대 재빌드(시트 닫힘·아트 로드) 때 좌측(0)으로 몰리는 것 방지
    let _petPose={};   // 🛋️ 상호작용/포즈 상태 지속(pkey → {until,pose,lift,face,resKey,resFloor}) — 재빌드(markCatDirty: 아트 로드·리사이즈·방 재렌더) 때 캣타워에 앉은 펫이 튀어나오던 것 방지. 만료·드래그 시 해제.
    // depth로부터 배율·바닥올림(rise)·z-index를 액터에 반영. z는 가구 frontRow(=12-depth*11)와 같은 척도라 상호 가림이 맞물린다.
    function applyDepth(a){ const d=a.depth=Math.max(0,Math.min(1,a.depth||0));
      a.scale=depthScale(d); a.rise=d*(a.riseMax||0);
      const z=camZ(d); if(a._z!==z){ a._z=z; a.el.style.zIndex=z; }   // CAM 단일 소스(util.js) — 가구 frontRow와 같은 척도
      if(a.pkey){ _petDepth[a.pkey]=d; _petVz[a.pkey]=a.vz||0; } }   // 재빌드 때 이어받도록 지속(무대별 키 — dock/내 방/친구 방의 같은 id가 안 섞이게)
    // 액터의 위치(x)·올림(lift)·깊이(scale/rise)·방향(scaleX)을 transform 하나로 — 전부 합성(페인트 0).
    // transform-origin:center bottom 이라 배율은 발밑 기준(발이 바닥선에 유지)·좌우반전은 중심축. 시각 중심 x=a.x+sw/2는 배율과 무관하게 유지.
    // ⚠️ left/top은 절대 매 프레임 건드리지 않는다(레이아웃·페인트 유발). x는 정수 px 스냅.
    function setXform(a, dir, lift){ const d=(dir!=null?dir:a.dir), s=(a.scale||1),
        fp=(a.footPad!=null?a.footPad:PET_FOOT_PAD),          // 펫별 발밑 여백 비율(측정값, 없으면 기본) — 호랑이 등 큰 동물은 여백↑
        pad=(a.spr?Math.round((a.hh||0)*fp*s):0),             // 발밑 여백 상쇄(렌더높이×비율×스케일) → 발이 바닥선에 닿게
        up=Math.round((a.rise||0)+(lift!=null?lift:(a.lift||0)))-pad;
      a.el.style.transform='translate3d('+Math.round(a.x)+'px,'+(-up)+'px,0) scale('+(s*d)+','+s+')'; if(a.pkey) _petX[a.pkey]=a.x;
      // 깊이 그림자(.cd-shadow, 배너에서만) 정렬용 발밑 여백을 언스케일 px로 노출 — 액터 scale 안에서 렌더돼 발끝선에 붙는다. 값이 바뀔 때만 기록(핫패스 부담 0).
      const pu=(a.spr?Math.round((a.hh||0)*fp):0); if(a._padUn!==pu){ a._padUn=pu; a.el.style.setProperty('--pad', pu+'px'); } }
    // 스프라이트 프레임 아래 투명 여백 비율을 실제 이미지 알파로 1회 측정(펫별로 다름)→캐시.
    const _footPad={};
    // 임의 이미지 URL의 하단 투명여백 비율(0~1)을 알파로 측정 → cb(비율|null). 캐시는 호출측 책임.
    function _measurePadUrl(url, cb){
      const img=new Image(); img.crossOrigin='anonymous';
      img.onload=function(){ try{
          const w=img.naturalWidth||img.width, h=img.naturalHeight||img.height;
          const cv=document.createElement('canvas'); cv.width=w; cv.height=h; const ctx=cv.getContext('2d');
          ctx.drawImage(img,0,0); const px=ctx.getImageData(0,0,w,h).data; let bottom=-1;
          for(let y=h-1;y>=0&&bottom<0;y--){ for(let x=0;x<w;x++){ if(px[(y*w+x)*4+3]>16){ bottom=y; break; } } }
          cb(bottom<0?null:Math.max(0,(h-1-bottom)/h));
        }catch(e){ cb(null); } };
      img.onerror=function(){ cb(null); };
      img.src=url;
    }
    // 💗 머리 위 투명 여백(상단 fraction) 실측 — 모자·버디 앵커(.cd-hat/.cd-buddy의 --hp %). footPad와 동일 캐시 패턴(south 스틸).
    const _headPad={};
    function _measureTopUrl(url, cb){
      const img=new Image(); img.crossOrigin='anonymous';
      img.onload=function(){ try{
          const w=img.naturalWidth||img.width, h=img.naturalHeight||img.height;
          const cv=document.createElement('canvas'); cv.width=w; cv.height=h; const ctx=cv.getContext('2d');
          ctx.drawImage(img,0,0); const px=ctx.getImageData(0,0,w,h).data; let top=-1;
          for(let y=0;y<h&&top<0;y++){ for(let x=0;x<w;x++){ if(px[(y*w+x)*4+3]>16){ top=y; break; } } }
          cb(top<0?null:top/h);
        }catch(e){ cb(null); } };
      img.onerror=function(){ cb(null); };
      img.src=url;
    }
    const HEAD_PAD_DEFAULT=0.20;
    function measureHeadPad(id, cb){ const key=id+':top';
      if(_headPad[key]!=null){ cb&&cb(_headPad[key]); return; }
      const sp=PET_SPRITES[id]; if(!sp){ cb&&cb(HEAD_PAD_DEFAULT); return; }
      if(sp.runtime && sp.needArt && !sp.urls){ cb&&cb(HEAD_PAD_DEFAULT); return; }   // 아트 로딩 전엔 측정·캐시 금지
      _measureTopUrl(sprStill(id,'south'), function(f){ _headPad[key]=(f==null?HEAD_PAD_DEFAULT:f); cb&&cb(_headPad[key]); });
    }
    // face=측정할 방향 스틸(기본 south=정면). 가챠 연출은 옆으로 걸어오니 'east'로 측정해야 발끝-알 바닥 정합이 정확. 방향별 여백이 달라 캐시 키를 id:face 로 분리.
    function measureFootPad(id, cb, face){ face=face||'south'; const key=id+':'+face;
      if(_footPad[key]!=null){ cb&&cb(_footPad[key]); return; }
      const sp=PET_SPRITES[id]; if(!sp){ _footPad[key]=PET_FOOT_PAD; cb&&cb(_footPad[key]); return; }
      if(sp.runtime && sp.needArt && !sp.urls){ cb&&cb(PET_FOOT_PAD); return; }   // 아트 로딩 전(투명 픽셀)엔 측정·캐시 금지 — 로드 후 재측정
      _measurePadUrl(sprStill(id,face), function(fp){ _footPad[key]=(fp==null?PET_FOOT_PAD:fp); cb&&cb(_footPad[key]); });
    }
    // 연출(가챠)용 발끝 여백: 걷는 스프라이트의 east walk 시트 하단 투명여백을 실측(캐시). id=펫(sprWalkUrl)·id 없으면 기본 검은고양이(gachacat walk.png).
    // ★ 걷는 프레임(연출 중 실제로 보이는 프레임) 기준이라 이동 중 발끝-알 바닥 정합이 자연스럽고, 펫 종류·크기가 달라도 전부 같은 방식으로 맞춰진다(크기는 컨테이너 수식에서 상쇄).
    const GACHACAT_FOOT_DEFAULT=0.30;
    function measureFxFoot(id, cb){
      if(!id){ if(_footPad['_gc']!=null){ cb(_footPad['_gc']); return; }
        _measurePadUrl(assetUrl('assets/fx/gachacat/walk.png'), function(fp){ _footPad['_gc']=(fp==null?GACHACAT_FOOT_DEFAULT:fp); cb(_footPad['_gc']); }); return; }
      const key=id+':fxwalk'; if(_footPad[key]!=null){ cb(_footPad[key]); return; }
      const sp=PET_SPRITES[id]; if(!sp){ cb(PET_FOOT_PAD); return; }
      if(sp.runtime && sp.needArt && !sp.urls){ cb(PET_FOOT_PAD); return; }   // 아트 로딩 전(투명)엔 캐시 금지 — 로드 후 재측정
      _measurePadUrl(sprWalkUrl(sp), function(fp){ _footPad[key]=(fp==null?PET_FOOT_PAD:fp); cb(_footPad[key]); }); }
    // 지정된 연출 펫·기본 고양이의 발끝 여백을 미리 측정·캐시 → 연출 시작 전에 값이 준비돼 첫 등장에서 세로 점프가 없다(펫/크기 달라도 동일 정합).
    function prewarmGachaFxPads(){ try{ measureFxFoot(null, function(){});
      ['a','b'].forEach(function(k){ const id=_gachaFx&&_gachaFx[k]; if(id && typeof hasSprite==='function' && hasSprite(id)) measureFxFoot(id, function(){}); }); }catch(e){} }
    // 🖼️ 펫 시트 프리워밍 + 로드 상태 추적 — 스폰 시엔 walk/south만 로드되므로, 방향 스틸(east/west/north)·모션 클립을
    //   처음 재생하는 순간 미로드 PNG로 --sheet/--idle을 갈아끼우면 디코드까지 .cspr가 투명해진다(캠에서 펫이 '움직이다 간헐적으로 잠깐 사라지던' 버그).
    //   ① 스폰(buildActors) 직후 유휴 시간에 펫별 1회 전 시트를 백그라운드 로드
    //   ② 로드 완료 집합(_sheetWarm)을 _csprClip/_csprStill의 디코드 가드가 공유 — 아직 안 된 시트는 이전 비주얼을 유지한 채 로드 후 스왑.
    //   data URL(런타임 아트)은 즉시 디코드라 항상 ready 취급.
    const _sheetWarm={};    // url → 1(로드 완료 — 즉시 스왑 가능)
    const _sheetPend={};    // url → [cb…](로드 중 — 중복 Image 생성 방지, 완료 시 콜백 일괄 실행)
    const _sheetWarmed={};  // 펫 id → 1(프리워밍 예약/완료 — 중복 방지)
    function _sheetReady(u){ return !u || u.slice(0,5)==='data:' || !!_sheetWarm[u]; }
    function _warmUrl(u, cb){
      if(_sheetReady(u)){ if(cb) cb(); return; }
      if(_sheetPend[u]){ if(cb) _sheetPend[u].push(cb); return; }
      _sheetPend[u]=cb?[cb]:[];
      const im=new Image();
      im.onload=function(){ _sheetWarm[u]=1; const cbs=_sheetPend[u]||[]; delete _sheetPend[u]; cbs.forEach(function(f){ try{ f(); }catch(e){} }); };
      im.onerror=function(){ delete _sheetPend[u]; };   // 실패 시 콜백을 버려 깨진 URL로 스왑하지 않음(이전 비주얼 유지 — 빈칸보다 낫다)
      im.src=u;
    }
    function prewarmPetSheets(id){ if(_sheetWarmed[id]) return; _sheetWarmed[id]=1;
      const run=function(){ try{
        const sp=PET_SPRITES[id]; if(!sp) return;
        if(sp.runtime && !sp.urls){ _sheetWarmed[id]=0; return; }   // 아트 도착 전 — 도착 후 재빌드(_petArtRerender→buildActors)에서 다시 예약
        ['south','east','west','north'].forEach(function(f){ _warmUrl(sprStill(id,f)); });
        Object.keys(PET_CLIPS).forEach(function(k){ const r=resolveClip(id,k,true); if(r && r.key!=='walk') _warmUrl(r.url); });   // 애정 게이트 무시(해금 순간 대비) — 폴백 해석 결과만 로드해 중복 없음
      }catch(e){} };
      if(typeof requestIdleCallback==='function') requestIdleCallback(run,{timeout:2500}); else setTimeout(run,350); }
    // ⚠️ 핵심 불변식(INVARIANT): "정면(south) 이미지로 이동 금지".
    // 스프라이트 액터의 이동/정지 비주얼(.cspr)은 반드시 아래 두 함수로만 바꾼다 — 모든 상태 전환(roam·pause)과
    // 재빌드(buildActors)가 이 두 함수를 거치게 해, DOM 재사용으로 남은 정지스틸(.idle)이 이동 중에 보이는 버그를 원천 차단.
    //  · actorShowMoving: 이동 표현. 일반=.idle 제거→CSS 걷기 필름(csprFilm) 재생, frontWalk(=east 걷기 없음)=east 정지스틸(정면 걷기 금지).
    //  · actorShowStill : 그 자리에 멈춰 face(south/east/west/north) 정지스틸(쉼·포즈·가구 상호작용). 이동 아님.
    //    🎞️ 클립 승급: 펫이 클립(PET_CLIPS)을 보유하면 정지 스틸 대신 그 클립을 재생(먹기·앉기·유휴 등) — 없으면 기존 스틸(폴백).
    // 물리 레이어(내부 전용 — 밖에선 부르지 말 것): _csprClip=클립 필름 장착, _csprStill=정지 스틸.
    // once 클립 홀드 프리즈 해제 — 원샷 종료 시 건 인라인(animation:none + transform)을 걷어내 다음 필름이 정상 재생되게. 모든 상태 전환이 거친다.
    function _csprUnfreeze(f){ if(!f) return; f.onanimationend=null; if(f.style.animation) f.style.animation=''; if(f.style.transform) f.style.transform=''; }
    function _csprClip(s, a, r){
      // 🖼️ 디코드 가드: 미로드 클립 시트를 즉시 장착하면 디코드까지 펫이 투명(once 클립은 재생 전체가 빈칸 — '간헐적 사라짐').
      //   이전 비주얼(걷기 필름/스틸)을 유지한 채 로드 후 장착. 그 사이 다른 전환(_swapTok 증가·소유 액터 교체)이 오면 낡은 장착을 버린다.
      const tok=a._swapTok=(a._swapTok||0)+1;
      if(!_sheetReady(r.url)){
        a._clip=r.key;   // 상태 마킹은 즉시 — actorOnce의 복귀 검사(a._clip)·중복 장착 방지와 일치
        _warmUrl(r.url, function(){ if(a._swapTok!==tok || a._clip!==r.key || !s.isConnected) return;
          if(a.el && a.el._eggActor && a.el._eggActor!==a) return;   // 재빌드로 액터 교체 → 낡은 장착 금지
          _csprClipMount(s, a, r); });
        return; }
      _csprClipMount(s, a, r);
    }
    function _csprClipMount(s, a, r){
      const cell=parseFloat(s.style.width)||Math.round(a.hh)||48;   // .cspr 창=1칸 정사각(catActorHTML이 width=렌더높이로 생성)
      s.style.setProperty('--sheet','url('+r.url+')');
      s.style.setProperty('--fw',(cell*r.frames)+'px');
      s.style.setProperty('--wdur', r.dur.toFixed(2)+'s');
      const f=s.querySelector('.csprf');
      if(f){ _csprUnfreeze(f); f.style.animation='none'; void f.offsetWidth; f.style.animation='';   // 필름 재시작(원샷·프레임0부터) — 쇼트핸드가 타이밍펑션도 지우므로 아래서 재지정
        f.style.animationTimingFunction='steps('+r.frames+')';
        // 🐛 once 홀드 = "마지막 프레임"에 고정. CSS fill-mode:forwards만으론 종료 상태가 to(-fw) —
        //   필름이 창 밖으로 완전히 밀려나 펫이 투명해졌다(sit 클립 1회 재생 후 휴식 내내 '갑자기 사라지던' 신화·한정 버그).
        //   animationend에서 마지막 프레임 오프셋으로 프리즈하고, 다음 상태 전환(_csprUnfreeze)이 해제한다.
        if(r.once){ const hx=-(cell*(Math.max(1,r.frames)-1));
          f.onanimationend=function(){ f.style.animation='none'; f.style.transform='translateX('+hx+'px)'; }; }
      }
      s.classList.toggle('once', !!r.once); s.classList.remove('idle');
      a._clip=r.key;
    }
    function _csprStill(s, a, face){ _csprUnfreeze(s.querySelector('.csprf'));
      const tok=a._swapTok=(a._swapTok||0)+1, u=sprStill(a.id,face);
      s.classList.remove('once'); s.classList.add('idle'); a._clip=null;
      if(_sheetReady(u)){ s.style.setProperty('--idle','url('+u+')'); return; }
      // 🖼️ 디코드 가드: 미로드 방향 스틸(첫 east/west/north)은 이전 --idle(스폰 south 등 로드된 것)을 유지한 채 로드 후 교체 — 투명 빈칸 방지
      _warmUrl(u, function(){ if(a._swapTok!==tok || !s.isConnected) return;
        if(a.el && a.el._eggActor && a.el._eggActor!==a) return;
        s.style.setProperty('--idle','url('+u+')'); }); }
    // 🎩 모자 가로 앵커(--hatdx) — 옆모습일 때 머리가 앞쪽(로컬 east=+)이라 모자를 앞으로 민다(정면=0). 액터 scaleX(-1)가 west를 자동 반전.
    //   east 스틸/걷기는 로컬 +(머리 오른쪽)라 부호 +, west 스틸(west.png, 액터 미flip)은 로컬 -(머리 왼쪽). measureHeadPad와 짝(세로=--hp, 가로=--hatdx).
    const HAT_SIDE_DX=0.13;   // 옆모습 앞쪽 이동량(펫 렌더높이 대비 — 실측 정수리 오프셋 +0.07~+0.14의 중앙값)
    function setHatDx(a, off){ if(a._hasHat) a.el.style.setProperty('--hatdx', (a.hh*off).toFixed(1)+'px'); }
    function actorShowMoving(a){ if(!a.spr) return; const s=a.el.querySelector('.cspr'); if(!s) return;
      a._clip=null; s.classList.remove('once');
      setHatDx(a, HAT_SIDE_DX);   // 이동=옆모습(east 시트/east 정지스틸, 로컬 머리 오른쪽) → 앞으로. west는 액터 flip이 반전
      const tok=a._swapTok=(a._swapTok||0)+1;   // 🖼️ 진행 중이던 지연 시트 스왑 무효화 — 걷기로 전환된 뒤 늦게 도착한 클립/스틸이 덮어쓰는 것 방지
      _csprUnfreeze(s.querySelector('.csprf'));   // once 홀드 프리즈 해제 — 안 하면 인라인 animation:none이 걷기 필름을 막아 정지 이미지로 미끄러진다
      if(a.frontWalk){ const u=sprStill(a.id,'east');   // east 걷기 없음 → 옆 정지스틸(정면 금지)
        s.classList.add('idle');
        if(_sheetReady(u)) s.style.setProperty('--idle','url('+u+')');
        else _warmUrl(u, function(){ if(a._swapTok!==tok || !s.isConnected) return;
          if(a.el && a.el._eggActor && a.el._eggActor!==a) return;
          s.style.setProperty('--idle','url('+u+')'); });   // 🖼️ 미로드 east 스틸 — 이전 --idle 유지 후 로드 시 교체(투명 이동 방지)
        return; }
      // 클립 재생이 --sheet/--fw/steps를 바꿨을 수 있어 걷기 시트로 '무조건' 복원(재빌드 DOM 재사용 잔재 포함 — 안 하면 먹기 시트로 걷는 버그)
      const sp=PET_SPRITES[a.id]||{}, cell=parseFloat(s.style.width)||Math.round(a.hh)||48, nf=sp.frames||6;
      s.style.setProperty('--sheet','url('+sprWalkUrl(sp)+')'); s.style.setProperty('--fw',(cell*nf)+'px');
      const f=s.querySelector('.csprf'); if(f) f.style.animationTimingFunction='steps('+nf+')';
      s.classList.remove('idle'); }   // .idle 제거 → CSS 걷기 필름(csprFilm) 재생
    function actorShowStill(a, face, clip){ if(!a.spr) return; const s=a.el.querySelector('.cspr'); if(!s) return;
      setHatDx(a, face==='east'?HAT_SIDE_DX:(face==='west'?-HAT_SIDE_DX:0));   // 정면/뒤=중앙, 옆모습 스틸=머리쪽(east.png 오른쪽 +, west.png 왼쪽 -, 둘 다 액터 미flip)
      // 🎞️ 클립 승급 — 지정 클립(가구 eat/drink/sit/belly 등) 또는 정면 휴식이면 idle 클립.
      // 클립 시트는 south 전용 정책이라 정면이 아닌 경우(잠=north·인사/스크래처=east/west)는 기존 방향 스틸 유지.
      // 모션축소·가벼운 모드(body.lite)는 항상 스틸 — 쉬는 펫이 늘 필름을 돌리면 lite의 절전 취지가 깨짐(걷기 필름은 기능 모션이라 유지).
      if(!reducedMotion() && !liteMode()){ const want = clip || (face==='south' ? 'idle' : null);
        const r = want ? resolveClip(a.id, want) : null;
        if(r && r.key!=='walk'){
          if(_sheetReady(r.url)){ _csprClip(s, a, r); return; }
          // 🖼️ 클립 시트 미로드 — 우선 방향 스틸(로드된 것)로 멈춰 보이게 하고, 로드 완료 시 클립으로 승급(투명 빈칸 방지)
          _csprStill(s, a, face);
          const tok=a._swapTok;   // _csprStill이 방금 올린 토큰 — 그 사이 다른 전환이 오면 낡은 승급을 버림
          _warmUrl(r.url, function(){ if(a._swapTok!==tok || !s.isConnected) return;
            if(a.el && a.el._eggActor && a.el._eggActor!==a) return;
            _csprClip(s, a, r); });
          return; } }
      _csprStill(s, a, face); }
    // 🏃 캣휠 달리기: run 클립이 있으면 진짜 달리기 시트(제자리), 없으면 기존대로 걷기 필름을 빠르게 재생.
    //  이동 아님이지만 필름을 쓰므로 반드시 actorShowMoving/_csprClip 경유(정면 이미지 금지 불변식 준수). face=east/west는 setXform flip으로 처리(호출부).
    const WHEEL_RUN_WDUR = 0.30;   // 달리기 발놀림 주기(초) — 일반 걷기(walkDur)보다 빠르게
    function showWheelRun(a){ if(!a.spr) return;
      const r=reducedMotion()?null:resolveClip(a.id,'run');
      if(r && r.key!=='walk'){ const s=a.el.querySelector('.cspr'); if(s){ _csprClip(s, a, r); return; } }
      actorShowMoving(a); const s=a.el.querySelector('.cspr'); if(s) s.style.setProperty('--wdur', WHEEL_RUN_WDUR+'s'); }
    // ✨ 원샷 클립(하품·그루밍·점프): 1회 재생 후 then()으로 이전 비주얼 복귀. 클립이 없거나 저사양/모션축소면 null(호출측은 기본 연출 유지).
    function actorOnce(a, clip, dirMul, then){
      if(!a.spr || reducedMotion() || liteMode()) return null;
      const r=resolveClip(a.id, clip); if(!r || r.key==='walk' || !r.once) return null;
      const s=a.el.querySelector('.cspr'); if(!s) return null;
      _csprClip(s, a, r); if(dirMul!=null){ setXform(a, dirMul); a._pdir=dirMul; }
      const tok=a._onceTok=(a._onceTok||0)+1, el=a.el;
      if(then) setTimeout(function(){ if(a._onceTok!==tok || a._clip!==r.key) return;   // 그 사이 다른 상태로 전환됐으면 복귀 금지
        if(!el.isConnected || el._eggActor!==a) return;   // 재빌드로 액터 객체가 교체됐으면 낡은 복귀 금지(새 상태 덮어쓰기 방지)
        try{ then(); }catch(e){} }, Math.round(r.dur*1000)+80);
      return r;
    }
    // 🥱 유휴 원샷 액센트(하품·그루밍) — 로밍 중 잠깐 멈춰 1회 재생 후 다시 걷기(재개는 pause 만료의 actorShowMoving이 처리, .once가 마지막 프레임 유지).
    function actorAccent(a, clip){
      const r=actorOnce(a, clip, 1, null); if(!r) return false;
      a.mode='pause'; a.pose=null; a.goal=null; releaseRes(a);
      a.pause=Math.round(r.dur*1000)+260; a.cool=1400; a.lift=0; applyDepth(a);
      if(a.pkey) _petPose[a.pkey]={ until:Date.now()+a.pause, pose:'sit', lift:0, face:'south', resKey:null, resFloor:null };
      return true;
    }
    // 여러 무대를 '동시에' 애니메이션한다: groups=[{stage, actors}]. 예) 친구 집 방문 중에도 하단 dock 캠은 계속 로밍.
    const _eng={ raf:0, groups:[], last:0, dirty:false };
    function markCatDirty(){ _eng.dirty=true; if(typeof startCatLoop==='function') startCatLoop(); }
    // 리사이즈·기기 회전 시 무대 폭이 바뀌므로 재빌드(디바운스) — 안 하면 펫이 옛 폭으로 클램프돼 화면 밖/좌측 몰림
    if(typeof window!=='undefined'){ let _rzT=0; const _catResize=()=>{ clearTimeout(_rzT); _rzT=setTimeout(function(){ if(typeof markCatDirty==='function') markCatDirty(); }, 200); };
      window.addEventListener('resize', _catResize); window.addEventListener('orientationchange', _catResize); }
    function stopWalk(){ _eng.groups=[]; }
    // 지금 애니메이션해야 할 무대들(중복 없이). 시트로 열린 방(친구=frStage·내 알뜰홈=crStage)과 하단 dock 캠(cdStage)을 함께 굴린다.
    // ⚠️ 시트 무대는 반드시 '시트가 열려 있을 때만' 포함한다 — closeSheet는 #sheetBody를 비우지 않아 닫힌 뒤에도 #frStage/#crStage가 DOM에 남는다.
    //    (예전 단일 무대 엔진은 남은 frStage를 계속 활성 무대로 잡아, 친구 집을 닫아도 dock 캠이 영영 멈춰 앱 재시작 전까지 안 움직였다.)
    function activeStages(){
      const out=[];
      const pip=(pipOpen()&&_pip.stage&&_pip.stage.isConnected)?_pip.stage:null;   // 🖥️ PiP 미니 캠 — 항상 위에 떠 있어 언제나 보임
      if(typeof document!=='undefined'&&document.hidden) return pip?[pip]:[];      // 탭 숨김: 메인 무대는 어차피 안 보이니 PiP만 스텝(절전)
      const sheetOpen=$('sheet')&&$('sheet').classList.contains('on');
      if(sheetOpen){
        const fr=$('frStage'); if(fr) out.push(fr);                                             // 친구 집 방문 중인 방
        const cr=$('crStage'); if(cr && _catTab==='home' && out.indexOf(cr)<0) out.push(cr);    // 내 알뜰홈 시트의 방
        const pk=$('pkStage'); if(pk && out.indexOf(pk)<0) out.push(pk);                         // 🌈 알뜰샵 가챠 탭 한정 픽업 배너 씬(있을 때만 = 그 탭일 때만 DOM 존재)
      }
      if(!sheetOpen && dockMode()!=='hidden'){ const s=$('cdStage'); if(s && out.indexOf(s)<0) out.push(s); }  // 🔋 하단 dock 캠 — 시트/오버레이에 가려지면(sheetOpen) 로밍 정지(안 보이니 배터리 절약), 닫으면 재개
      const pr=$('pkRevStage'); if(pr && out.indexOf(pr)<0) out.push(pr);                          // 🌲 전설/신화/한정 등장 연출 배경 씬의 픽업 펫 배회(연출 떠 있을 때만 DOM 존재)
      if(pip) out.push(pip);                                                                       // 🖥️ PiP 미니 캠(별도 창이라 시트·dock 숨김과 무관하게 항상 활성)
      return out;
    }
    let _stageW={};   // 무대별 마지막으로 '측정된' 폭 캐시 — 레이아웃 전(clientWidth=0) 재빌드에서 잘못된 좁은 폭을 쓰지 않게(우측 몰림 방지)
    let _stageRemeasure={};   // 무대별 재측정 예약 중 플래그(중복 rAF 방지)
    // 무대가 아직 레이아웃되지 않아(clientWidth=0) 폴백폭으로 임시 배치한 경우: 실측폭이 잡히면 그 무대의 지속 x(_petX)를 비우고 재빌드 → 실제 폭에 다시 균등 분산(폴백폭에 몰려 굳는 것 방지).
    function scheduleStageRemeasure(stage){
      if(_stageRemeasure[stage.id]) return; _stageRemeasure[stage.id]=1;
      let tries=0;
      const tick=()=>{
        if(!stage.isConnected){ _stageRemeasure[stage.id]=0; return; }
        if(stage.clientWidth){ _stageRemeasure[stage.id]=0;
          Object.keys(_petX).forEach(k=>{ if(k.indexOf(stage.id+':')===0) delete _petX[k]; });   // 이 무대 펫만 초기화(다른 무대 위치 보존)
          markCatDirty(); return; }
        if(++tries<40){ requestAnimationFrame(tick); } else { _stageRemeasure[stage.id]=0; }   // ~0.6s 내 미레이아웃이면 포기(숨은 무대 — 어차피 안 보임)
      };
      requestAnimationFrame(tick);
    }
    function buildActors(stage){
      const acts=Array.from(stage.querySelectorAll('.cd-actor')); if(!acts.length) return [];
      const measuredW=stage.clientWidth;   // 실측폭(0=아직 레이아웃 안 됨)
      if(measuredW) _stageW[stage.id]=measuredW;   // 실제 폭이 잡히면 캐시 갱신
      const W=measuredW||_stageW[stage.id]||(stage.id==='cdStage'?160:244), hh=+stage.dataset.hh||30;   // clientWidth=0이면 마지막 측정폭→기본값 순으로 폴백(우측 클램프 방지)
      if(!measuredW && !_stageW[stage.id]) scheduleStageRemeasure(stage);   // 신뢰폭이 전혀 없으면(무대 미레이아웃) 실측 시 재분산 예약
      const isFriend = stage.id==='frStage';
      const hasRoom = stage.id==='crStage' || isFriend || !!stage.closest('.cd-room');
      const isDock = stage.id==='cdStage';   // dock(얇은 스트립)만 dock 취급 — 친구 무대(frStage)는 방 크기
      // 방 높이 → depth 1(맨 뒤)에서 발이 올라가는 최대 px(rise). 가구 바닥 매핑(bottom%=3+depth*46/38)과 같은 척도라 같은 행에 서면 발높이가 맞는다.
      const roomEl = stage.closest('.catroom') || stage.closest('.cd-room');   // dock=.cd-room(224 카드)·홈/친구=.catroom(244) — 각자 실제 높이 기준(방 전체가 담김)
      const roomH = (roomEl && roomEl.clientHeight) || 244;   // 실측 높이 → riseMax=height*0.53. dock≈224·홈244(비율 동일이라 원근 일치)
      // 위에서 내려다보는(탑다운) 느낌: 맨 앞(depth0)=바닥 앞끝, 맨 뒤(depth1)=바닥 뒤끝(벽지 경계)에 닿게.
      // dock·홈(.catroom) 둘 다 바닥 54%로 통일 → 같은 riseMax 비율(0.53)로 뒤 펫이 벽지 경계에 닿는다(예전 dock 0.61은 바닥 66% 기준이라 벽에 못 닿았음).
      // (발밑 여백 상쇄 pad는 깊이와 무관하게 적용되어 맨 앞은 여전히 바닥에 붙음 — 뜨는 문제 재발 없음.)
      const riseMax = roomH*CAM.RISE;   // CAM 단일 소스(util.js)
      // 가구 위치(발자국 중앙 x)·렌더 높이(fh)·깊이(depth) — 상호작용 시 올라갈 높이·앞뒤 정렬(가림)에 사용
      const noProps = !!stage.dataset.noprops;   // 🌈 픽업 배너(#pkStage): 방 원근은 쓰되 사용자 가구 상호작용은 끔(장식만 있는 씬 → 자유 배회)
      const plist = (isFriend && state._friendCam) ? state._friendCam.placedList : placedList();   // 친구 방이면 친구 가구로 상호작용
      const props = (hasRoom && !noProps) ? plist.map(p=>{ const foot=itemFoot(p.itemId), depth=camDepth(p.r+foot.h-1);   // propMarkup과 동일(앞줄 기준, CAM 단일 소스)
        const fh=furnRoomH(p.itemId, isDock, depth);   // 렌더 높이와 동일 → 캣타워 층 lift가 실제 높이에 맞음
        // 그래픽 중앙 x — propMarkup의 camAnchorMode(가운데/양끝 스냅)와 동일하게 계산해 펫이 가구 중앙에 정렬(캣타워 중앙 앉기).
        // 그래픽 폭 w=fh*aspect. left=w/2, right=W-w/2, center=발자국 중앙*W.
        const mode=camAnchorMode(p.c, foot.w), w=fh*furnAspect(p.itemId);
        const cx = mode==='left'? w/2 : mode==='right'? W-w/2 : (gridLeftFrac(p.c)+gridSpanFrac(foot.w)/2)*W;
        return { x: cx, itemId:p.itemId, fh, key:p.key, depth, fill:(p.filledAt||null) }; }) : [];   // fill=그릇 채운 시각(밥/물그릇) — 도착 시 먹기/마시기 클립 판정(furnClip)
      // 고양이마다 성격(속도·유휴빈도·방향전환·가구선호)을 랜덤 부여 → 개별적으로 움직임
      // 스프라이트 고양이는 정사각(폭=높이), SVG 고양이는 가로세로비 ~26/14.
      const sid=stage.id||'s';   // 무대별 지속키 prefix — 같은 펫 id가 dock·내 방·친구 방에 동시에 있어도 x/depth가 안 섞이게
      const N=acts.length;
      return acts.map((el,ai)=>{ const id=el.getAttribute('data-cat'), spr=hasSprite(id), fw=!!(spr&&PET_SPRITES[id]&&PET_SPRITES[id].frontWalk);
        const pkey=(id!=null?sid+':'+id:null);
        const v=0.14+Math.random()*0.18;   // 속도 폭을 조금 좁혀 걸음이 차분하게(주기는 walkDur로 이동속도에 맞춤)
        const ah=+el.dataset.hh||hh;   // 펫별 렌더 높이(크기 배율 반영). 없으면 무대 기본값.
        const sw0=(spr?ah:Math.round(ah*26/14));   // 액터 폭(스프라이트=정사각, SVG≈26/14)
        // 🐾 신규 펫 초기 x = 무대 폭에 '균등 분산'. 예전엔 렌더의 고정 간격(dock left=12+i*54 등)을 그대로 초기 x로 썼는데,
        //   좁은 화면·다수 펫이면 그 간격이 폭을 넘어 아래 클램프(W-sw)에 전부 걸려 우측 끝에 우르르 몰렸다(사용자 신고 버그).
        //   → 폭 기준 (ai/(N-1))로 좌→우 고르게 펼친다. 이미 배회 중이던 펫(_petX 존재)은 위치 유지(순간이동 방지).
        const inset = Math.max(4, Math.min(W*0.07, 22));   // 양끝 여백 — 펫이 화면 끝에 딱 붙어 시작하지 않게(가운데 쪽으로 살짝)
        const _sf=el.dataset.spawnf;   // 흩뿌림 시작(10연차 배회): 지정 프래션이면 그 위치(랜덤·간격), 없으면 좌→우 균등
        const spreadX = _sf!=null ? (inset + parseFloat(_sf)*Math.max(0, W-sw0-inset*2))
                       : (N>1 ? (inset + (ai/(N-1))*Math.max(0, W-sw0-inset*2)) : Math.max(2,(W-sw0)/2));
        const a={ el, id, pkey, spr, frontWalk:fw, x:(pkey&&_petX[pkey]!=null?_petX[pkey]:spreadX), dir:Math.random()<0.5?-1:1, _pdir:0,
        v:v, t:Math.random()*6, frame:0, fc:Math.random()*170, W, hh:ah,
        sw:sw0, props, lift:0,
        depth:(pkey&&_petDepth[pkey]!=null?_petDepth[pkey]:Math.random()), vz:(pkey&&_petVz[pkey]!=null?_petVz[pkey]:0), riseMax:riseMax, _z:0,   // 앞뒤(깊이) 원근 — 재빌드 시 이전 depth/vz 이어받아 순간이동 방지(신규 펫만 랜덤 시작)
        mode:'roam', pause:0, goal:null, pose:null, resKey:null, resFloor:null,
        // 유휴(그 자리에 멈춰 정면 보기) — 자주·오래 서서 정면을 보도록(poseDur에서 시간 늘림)
        idle:0.0032+Math.random()*0.005, turn:0.004+Math.random()*0.010, seek:0.008+Math.random()*0.012, cool:0 };   // seek↑(0.005→0.008 기준) — 캣휠·해먹 등 가구 상호작용을 더 자주(PiP 볼거리)
        // 발밑 여백: 세션 캐시 → 없으면 대형(scale≥2) 스프라이트는 0.29 추정(실측 평균 — 기본 0.16을 쓰면 측정 콜백 전까지 발이 ~14% 떠 '벽지를 걷는' 과도기), 그 외 null(기본 PET_FOOT_PAD). 실측 도착 시 정밀값으로 교체.
        a.footPad=(typeof _footPad!=='undefined'&&_footPad[id+':south']!=null)?_footPad[id+':south']:((spr&&(PET_SPRITES[id].scale||1)>=2)?0.29:null); if(spr) measureFootPad(id,function(fp){ a.footPad=fp; setXform(a); });
        a._hasHat = spr && !!el.querySelector('.cd-hat');   // 🎩 모자 장착 여부(가로 앵커 --hatdx 갱신 게이트 — 매 전환마다 querySelector 안 하려 캐시)
        if(spr && (a._hasHat || el.querySelector('.cd-buddy'))) measureHeadPad(id, function(f){ el.style.setProperty('--hp',(f*100).toFixed(1)+'%'); });   // 💗 코스메틱 머리 앵커(실측 상단 여백 %)
        el._eggActor=a;   // 원샷 클립(actorOnce)의 지연 복귀가 재빌드된 새 액터를 덮어쓰지 않도록 현재 소유 액터를 표시
        if(spr) prewarmPetSheets(id);   // 🖼️ 방향 스틸·클립 시트 프리워밍(유휴 시간) — 첫 모션/방향 전환 때 투명 빈칸(간헐적 사라짐) 방지
        a.x=Math.max(2, Math.min(a.x, Math.max(2, W-a.sw)));   // 지속된 x를 현재 무대 폭에 클램프(리사이즈/회전·무대전환 시 화면 밖 방지)
        setWalkDur(a); el.style.left='0px'; applyDepth(a); setXform(a); a._pdir=a.dir;   // 위치·올림·깊이·방향 전부 transform(합성). left는 0 고정 → 걷는 동안 메인스레드 페인트 0
        // 액터는 항상 'roam'(이동)으로 시작. DOM 재사용(markCatDirty·무대 재부착)으로 남아있던 정지스틸(.idle)을
        // 반드시 이동 표시로 초기화 → "정면 이미지로 이동" 버그 원천 차단.
        // ♿ reduced-motion에선 걷기 필름이 프레임0(옆)에 얼어붙으므로(catLoop가 stepActors 스킵) 정면(south) 정지스틸로 고정한다.
        if(reducedMotion()) actorShowStill(a, 'south'); else actorShowMoving(a);
        // 🛋️ 상호작용/포즈 지속 복원 — 재빌드 직전 앉아 있던 자리·포즈·잔여시간을 이어받아 튀어나오지 않게(불변식 준수: actorShowStill 경유).
        const pp=pkey&&_petPose[pkey];
        if(pp){ const left=pp.until-Date.now();
          if(left>400){ a.mode='pause'; a.pose=pp.pose; a.pause=left; a.cool=1400; a.lift=pp.lift||0; a.resKey=pp.resKey||null; a.resFloor=(pp.resFloor!=null?pp.resFloor:null);
            applyDepth(a);
            if(a.spr){ if(pp.run){ const rd=pp.face==='west'?-1:1; showWheelRun(a); setXform(a, rd); a._pdir=rd; }   // 캣휠 달리기 상태 복원
              else { actorShowStill(a, pp.face||'south', pp.clip); setXform(a, 1); a._pdir=1; } }   // 클립(먹기·앉기 등)도 복원 — 없으면 기존 스틸
            else { a.el.innerHTML=catPose(id, pp.pose, {h:a.hh}); setXform(a, a.dir); a._pdir=a.dir; } }
          else delete _petPose[pkey]; }
        return a; });
    }
    function poseDur(pose){ return pose==='sleep'?(4000+Math.random()*3500):(2800+Math.random()*3200); }   // 정면으로 가만히 있는 시간을 더 길게
    // 🐾 펫 상호작용 가구 화이트리스트(단일 소스) — furnSpot에 자리 케이스가 있는 바닥 가구만 등록.
    //    seek 대상 선정(stepActors)과 행복도 enrichment(enrichTypeCount)가 모두 이 목록을 읽는다.
    //    (구 NO_INTERACT 블랙리스트는 새 배경 가구를 누락하면 default 자리로 '위에 앉는' 버그가 재발해 화이트리스트로 전환.
    //     벽 가구(window·fireplace 등)는 seek 대상(placed)에 안 와 도달 불가 — 여기 넣지 말 것. 러그·연못 같은 바닥 아이템, 배경 가구(화장실·화분)도 제외.)
    //    ⚠️ 새 가구에 furnSpot 케이스를 추가하면 반드시 여기에도 id를 함께 등록한다.
    const INTERACTIVE_FURN = { tower:1, pethouse:1, cushion:1, bowl:1, waterbowl:1, scratcher:1, catwheel:1, fishtank:1, fan:1, hammock:1, teaser:1, jingleball:1, yarnbasket:1, beanbag:1, groomstation:1, springtoy:1, tunnel:1, teepee:1, laserpost:1, waterfountain:1, sofa:1, ballpit:1, bunkbed:1, roundbed:1, donutbed:1, cavebed:1, canopybed:1, throne:1, mousetoy:1, catnippillow:1, puzzlefeeder:1, balltrack:1, teetertoy:1, groomarch:1, heatpad:1, peekbox:1, crinklebag:1 };
    // 가구별 상호작용 자리: 올라갈 높이(lift px)·바라보는 방향(face)·옆 오프셋(dx)·포즈·머무는 시간(ms)
    // 캣타워=3층 중 한 층에 올라가 정면 보며 쉼 / 방석=위에 잠시 / 밥그릇=뒤에서 앉기 / 스크래처=옆에서 잠시
    function furnSpot(a, goal){
      const it=goal.itemId, fh=goal.fh||a.hh;
      // 가구 상호작용 머무는 시간을 10배로(캣타워 26~62초 등) — 오래 자리 잡고 쉼
      if(it==='tower'){ const floor=(a.resFloor!=null?a.resFloor:Math.floor(Math.random()*3)); const frac=[0.30,0.62,0.92][floor];   // 예약된 층(각 층 1마리)
        // 캣타워는 일반 상호작용(기본 22~48초)의 5배 오래 머무름(약 1.8~4분)
        return { lift:Math.round(fh*frac), face:'south', dx:0, pose:'sit', dur:110000+Math.random()*130000 }; }
      // 펫하우스: 출입구 안(정중앙)에 들어가 정면(south)을 보며 앉아 아늑하게 오래 쉼(약 50초~2분).
      if(it==='pethouse') return { lift:Math.round(fh*0.06), face:'south', dx:0, pose:'sit', dur:50000+Math.random()*70000 };
      if(it==='cushion') return { lift:Math.round(fh*0.4), face:'south', dx:0, pose:'loaf', dur:20000+Math.random()*30000 };
      if(it==='bowl')    return { lift:Math.round(fh*0.15), face:'south', dx:0, pose:'sit', dur:20000+Math.random()*26000 };
      // 물그릇: 밥그릇과 동일하게 뒤에서 앉아 물 마시기(비대칭이던 default 식빵 → 전용 케이스).
      if(it==='waterbowl') return { lift:Math.round(fh*0.15), face:'south', dx:0, pose:'sit', dur:14000+Math.random()*18000 };
      if(it==='scratcher') return { lift:0, face:(Math.random()<0.5?'east':'west'), dx:Math.round(a.sw*0.6)*(Math.random()<0.5?1:-1), pose:'sit', dur:18000+Math.random()*28000 };
      // 캣휠: 링 안쪽 바닥(정중앙)에 들어가 옆(east/west)을 보며 '달리기'(걷기 필름 빠르게·제자리)로 오래 머무름. run=true → enterInteract가 달리기 비주얼.
      if(it==='catwheel') return { lift:Math.round(fh*0.12), face:(Math.random()<0.5?'east':'west'), dx:0, pose:'sit', run:true, dur:30000+Math.random()*45000 };
      // 어항: 앞에서 정면(south)을 보며 앉아 금붕어를 구경(약 16~40초).
      if(it==='fishtank') return { lift:0, face:'south', dx:Math.round(a.sw*0.25), pose:'sit', dur:16000+Math.random()*24000 };
      // (구 window·fireplace 케이스 제거 — 둘은 wall:true 벽 가구라 seek 대상(placed 바닥 목록)에 절대 안 옴 → 도달 불가 죽은 코드였음. 벽 가구 상호작용을 지원하려면 seek에 wallPlaced를 포함하는 별도 작업 필요.)
      // 선풍기: 곁에서 바람 쐬며 쉼.
      if(it==='fan') return { lift:0, face:'south', dx:0, pose:'loaf', dur:16000+Math.random()*20000 };
      // 해먹: 그물 안으로 올라가(lift) 정면 보며 오래 누움(약 30~70초).
      if(it==='hammock') return { lift:Math.round(fh*0.42), face:'south', dx:0, pose:'loaf', dur:30000+Math.random()*40000 };
      // 낚싯대 장난감: 옆에서 앉아 깃털을 톡톡(약 12~28초).
      if(it==='teaser') return { lift:0, face:(Math.random()<0.5?'east':'west'), dx:Math.round(a.sw*0.4)*(Math.random()<0.5?1:-1), pose:'sit', dur:12000+Math.random()*16000 };
      // 방울공: 옆에서 앉아 공을 굴리며 놈(약 10~24초).
      if(it==='jingleball') return { lift:0, face:'south', dx:Math.round(a.sw*0.3), pose:'sit', dur:10000+Math.random()*14000 };
      if(it==='yarnbasket') return { lift:0, face:'south', dx:Math.round(a.sw*0.35)*(Math.random()<0.5?1:-1), pose:'sit', dur:12000+Math.random()*14000 };
      if(it==='beanbag') return { lift:Math.round(fh*0.30), face:'south', dx:0, pose:'loaf', dur:30000+Math.random()*40000 };
      if(it==='groomstation') return { lift:0, face:(Math.random()<0.5?'east':'west'), dx:Math.round(a.sw*0.5)*(Math.random()<0.5?1:-1), pose:'sit', dur:16000+Math.random()*20000 };
      if(it==='springtoy') return { lift:0, face:'south', dx:Math.round(a.sw*0.35)*(Math.random()<0.5?1:-1), pose:'sit', dur:10000+Math.random()*14000 };
      if(it==='tunnel') return { lift:0, face:(Math.random()<0.5?'east':'west'), dx:0, pose:'loaf', dur:24000+Math.random()*30000 };
      if(it==='teepee') return { lift:Math.round(fh*0.08), face:'south', dx:0, pose:'sit', dur:40000+Math.random()*50000 };
      if(it==='laserpost') return { lift:0, face:'south', dx:Math.round(a.sw*0.4)*(Math.random()<0.5?1:-1), pose:'sit', dur:10000+Math.random()*14000 };
      if(it==='waterfountain') return { lift:Math.round(fh*0.12), face:'south', dx:0, pose:'sit', dur:12000+Math.random()*16000 };
      if(it==='sofa') return { lift:Math.round(fh*0.34), face:'south', dx:Math.round(a.sw*0.5)*(Math.random()<0.5?1:-1), pose:'loaf', dur:30000+Math.random()*40000 };
      if(it==='ballpit') return { lift:Math.round(fh*0.16), face:'south', dx:0, pose:'sit', dur:24000+Math.random()*30000 };
      if(it==='bunkbed') return { lift:Math.round(fh*0.5), face:(Math.random()<0.5?'east':'west'), dx:0, pose:'loaf', dur:40000+Math.random()*50000 };
      if(it==='roundbed') return { lift:Math.round(fh*0.24), face:'south', dx:0, pose:'loaf', dur:28000+Math.random()*36000 };
      if(it==='donutbed') return { lift:Math.round(fh*0.26), face:'south', dx:0, pose:'loaf', dur:28000+Math.random()*36000 };
      if(it==='cavebed') return { lift:Math.round(fh*0.1), face:'south', dx:0, pose:'sit', dur:45000+Math.random()*55000 };
      if(it==='canopybed') return { lift:Math.round(fh*0.42), face:'south', dx:0, pose:'loaf', dur:40000+Math.random()*50000 };
      if(it==='throne') return { lift:Math.round(fh*0.3), face:'south', dx:0, pose:'sit', dur:35000+Math.random()*45000 };
      if(it==='mousetoy') return { lift:0, face:(Math.random()<0.5?'east':'west'), dx:Math.round(a.sw*0.4)*(Math.random()<0.5?1:-1), pose:'sit', dur:10000+Math.random()*12000 };
      if(it==='catnippillow') return { lift:Math.round(fh*0.2), face:'south', dx:0, pose:'loaf', dur:14000+Math.random()*16000 };
      if(it==='puzzlefeeder') return { lift:0, face:'south', dx:Math.round(a.sw*0.3)*(Math.random()<0.5?1:-1), pose:'sit', dur:12000+Math.random()*14000 };
      if(it==='balltrack') return { lift:0, face:'south', dx:Math.round(a.sw*0.4)*(Math.random()<0.5?1:-1), pose:'sit', dur:12000+Math.random()*16000 };
      if(it==='teetertoy') return { lift:0, face:'south', dx:Math.round(a.sw*0.35)*(Math.random()<0.5?1:-1), pose:'sit', dur:10000+Math.random()*12000 };
      if(it==='groomarch') return { lift:0, face:'east', dx:0, pose:'sit', dur:12000+Math.random()*14000 };
      if(it==='heatpad') return { lift:0, face:'south', dx:0, pose:'loaf', dur:20000+Math.random()*20000 };
      if(it==='peekbox') return { lift:0, face:'south', dx:Math.round(a.sw*0.3)*(Math.random()<0.5?1:-1), pose:'sit', dur:13000+Math.random()*15000 };
      if(it==='crinklebag') return { lift:0, face:'south', dx:0, pose:'loaf', dur:14000+Math.random()*16000 };
      return { lift:0, face:'south', dx:0, pose:'loaf', dur:22000+Math.random()*26000 };
    }
    // 🎞️ 가구 → 재생 클립(선택): 밥/물그릇은 '채워진 그릇'일 때만 먹기/마시기(빈 그릇=앉기), 자동급수기는 항상 물.
    // 그 외엔 포즈 기본(sit→sit 클립, loaf→belly 클립). 클립 시트는 south 전용이라 옆을 보는 자리(face≠south)는 클립 없이 기존 스틸.
    // 클립이 없는 펫은 resolveClip 폴백으로 기존 스틸 그대로 — 여기서 걸러줄 필요 없음.
    function furnClip(goal, s){
      if(s.face!=='south') return null;
      const it=goal.itemId, filled=!!(goal.fill && (Date.now()-goal.fill)<FILL_MS);
      if(it==='bowl') return filled?'eat':'sit';
      if(it==='waterbowl') return filled?'drink':'sit';
      if(it==='waterfountain') return 'drink';
      return s.pose==='loaf'?'belly':(s.pose==='sit'?'sit':null);
    }
    // 가구에 도착 → 자리 잡고 머무름(랜덤 시간). 스프라이트는 해당 방향 정지(클립 보유 시 먹기/앉기 등 클립), SVG는 포즈. lift로 발판/방석 위로 올림.
    function enterInteract(a, id, goal){
      const s=furnSpot(a, goal);
      a.mode='pause'; a.pose=s.pose; a.pause=s.dur; a.cool=1700; a.lift=s.lift||0;
      // 고양이 중심을 가구 그래픽 중앙(goal.x)에 맞춤(+옆 오프셋 dx). 캣타워/방석은 dx=0이라 정중앙에 앉음.
      a.x=Math.max(2, Math.min(a.W-a.sw, goal.x - a.sw/2 + (s.dx||0)));
      if(goal.depth!=null) a.depth=goal.depth; applyDepth(a);   // 가구와 같은 깊이에 서서 크기·앞뒤 가림이 맞물리게
      const runW = !!(s.run && a.spr);   // 🏃 캣휠 달리기(스프라이트만) — run 클립 또는 걷기 필름 제자리 재생
      const clip = runW ? null : furnClip(goal, s);   // 🎞️ 가구별 클립(먹기·마시기·앉기·배깔기) — 미보유 펫은 폴백으로 기존 스틸
      const dir = runW ? (s.face==='west'?-1:1) : (a.spr?1:a.dir);
      if(runW) showWheelRun(a);            // 달리기(actorShowMoving/_csprClip 경유) — face는 아래 setXform flip
      else if(a.spr) actorShowStill(a, s.face, clip);
      else a.el.innerHTML=catPose(id, s.pose, {h:a.hh});
      setXform(a, dir); a._pdir=dir;   // 위치+lift(위에서 설정)+flip을 정적 transform 하나로
      if(a.pkey) _petPose[a.pkey]={ until:Date.now()+s.dur, pose:s.pose, lift:a.lift, face:s.face, run:runW, clip:clip, resKey:a.resKey, resFloor:a.resFloor };   // 재빌드에도 자리·달리기·클립 유지
    }
    function enterPose(a, id, pose){ a.mode='pause'; a.pose=pose; a.pause=poseDur(pose); a.cool=1400;
      a.lift=0; applyDepth(a);   // 현재 깊이의 배율/올림/z 반영(그 자리에서 쉼 — 깊이는 유지)
      // 💤 잠: sleep 클립(옆으로 엎드려 눈 감고 잠) 보유 펫은 east 자세로 클립 재생, 미보유는 기존 north 스틸(뒤돌아 잠).
      const hasSleep = pose==='sleep' && a.spr && hasClip(id,'sleep');
      const face = pose==='sleep' ? (hasSleep?'east':'north') : 'south';   // 앉기/식빵은 정면
      const clip = pose==='sleep' ? (hasSleep?'sleep':null) : (pose==='loaf' ? 'belly' : 'sit');   // 🎞️ 유휴 클립 승급 — 미보유 펫은 폴백으로 기존 스틸
      if(a.spr){ // 멈춰서 쉴 땐 정지 스틸/클립(잠=엎드림/뒤돈 모습, 그 외=정면). 이미지가 정방향이라 플립 없음(scaleX(1)).
        actorShowStill(a, face, clip); setXform(a, 1); a._pdir=1;
        if(pose==='sleep') actorOnce(a, 'yawn', 1, function(){ actorShowStill(a, face, clip); setXform(a, 1); a._pdir=1; }); }   // 🥱 잠들기 전 하품(클립 보유 펫만) → 끝나면 수면 클립/스틸
      else { a.el.innerHTML=catPose(id, pose, {h:a.hh});
        setXform(a, a.dir); a._pdir=a.dir; }
      if(a.pkey) _petPose[a.pkey]={ until:Date.now()+a.pause, pose:pose, lift:0, face:face, clip:clip, resKey:null, resFloor:null };   // 유휴 포즈도 재빌드에 유지(방향·클립 포함)
    }
    // 💬 유휴 감정 이모트(픽셀) — 펫 머리 위에 1회성(2.2s) 표시 후 제거. zz=수면 'zZ' 도트 텍스트, greet=하트 확정, idle=하트/트윙클 랜덤(30% 확률만). 저사양·모션축소 생략.
    function actorEmote(a, kind){
      try{
        if(liteMode()||reducedMotion()||!a.el) return;
        if(kind==='idle' && Math.random()>0.3) return;   // 유휴 하트는 가끔만(과다 방지)
        const inner = kind==='zz' ? pixelTextHtml('zZ', '#9fb4d8', {h:12})
                    : kind==='greet' ? heartSvg({h:11})
                    : (Math.random()<0.5 ? heartSvg({h:11}) : spark4Svg('#f2c84b',{h:11}));
        const s=document.createElement('span'); s.className='cd-emote'; s.innerHTML=inner;
        a.el.appendChild(s); setTimeout(function(){ try{ s.remove(); }catch(_e){} }, 2200);
      }catch(e){}
    }
    // 🐾 인사(마주보기) — 근접한 두 로밍 펫이 서로를 바라보며 잠깐 앉음. 불변식 준수: actorShowStill 경유(정지 비주얼), 지속(_petPose)에도 등록.
    function enterGreet(a, face){
      a.mode='pause'; a.pose='sit'; a.pause=2200+Math.random()*1600; a.cool=1400; a.lift=0; a.goal=null; releaseRes(a); applyDepth(a);
      if(a.spr){ actorShowStill(a, face); setXform(a, 1); a._pdir=1;
        if(Math.random()<0.35) actorOnce(a, 'jump', (face==='west'?-1:1), function(){ actorShowStill(a, face); setXform(a, 1); a._pdir=1; }); }   // 🦘 반가움 점프(클립 보유 펫만 가끔) → 끝나면 마주보기 스틸 복귀
      else { a.el.innerHTML=catPose(a.id, 'sit', {h:a.hh}); const d=(face==='east'?1:-1); setXform(a, d); a._pdir=d; }
      if(a.pkey) _petPose[a.pkey]={ until:Date.now()+a.pause, pose:'sit', lift:0, face:face, resKey:null, resFloor:null };
    }
    // 가구 점유: 한 가구엔 1마리(캣타워만 3층=최대 3마리, 층당 1마리). resKey=예약한 가구, resFloor=캣타워 층(0~2). acts=같은 무대의 액터들(무대별로 따로 점유 판정).
    function occupantsOf(key, self, acts){ let n=0; const floors={}; (acts||[]).forEach(o=>{ if(o!==self && o.resKey===key){ n++; if(o.resFloor!=null) floors[o.resFloor]=true; } }); return {n, floors}; }
    function releaseRes(a){ a.resKey=null; a.resFloor=null; }
    function stepActors(dt, actors){
      actors.forEach(a=>{
        if(a.mode==='drag') return;   // 손으로 집어 든 펫은 엔진이 건드리지 않음(드래그가 위치 제어)
        a.t+=dt*0.004; if(a.cool>0)a.cool-=dt; if(a.dcool>0)a.dcool-=dt; if(a._greetCool>0)a._greetCool-=dt; const id=a.id;
        if(a.mode==='pause'){ a.pause-=dt; if(a.pause<=0){ a.mode='roam'; a.fc=999; a.dir=Math.random()<0.5?-1:1; a.lift=0; releaseRes(a); if(a.pkey) delete _petPose[a.pkey];   // 내려와 재출발(자리 반납·지속 해제)
          // 이동 재개: 정면 이미지로 이동 금지 — actorShowMoving으로 일원화(일반=CSS 필름, frontWalk=east 정지스틸)
          actorShowMoving(a); setWalkDur(a); setXform(a); a._pdir=a.dir; } return; }   // 재출발: lift 해제·방향 반영·걷기속도 복원(캣휠 달리기 빠른 --wdur 리셋), 걷기는 필름(csprFilm)
        const pr=dt/33;   // ⏱️ 확률 dt 정규화(33ms=30fps 기준) — dock 12fps에서 유휴/전환/가구찾기 빈도가 방 캠의 ~2.5배 낮던 것 보정(무대 무관 동일 리듬)
        // 유휴 제스처(그 자리 앉기/식빵/낮잠) — 쿨다운 후에만. 🌙 밤(KST 21~06시)엔 낮잠 가중(수면 연출)
        if(a.mode==='roam' && a.cool<=0 && Math.random()<a.idle*pr){
          // 🎞️ 원샷 액센트(하품, 가끔 하악질) — 클립 보유 펫만 가끔(32%·볼거리 강화) 잠깐 멈춰 1회 재생 후 다시 걷기. 미보유면 false → 아래 기존 포즈로
          if(a.spr && Math.random()<0.32 && actorAccent(a, Math.random()<0.75?'yawn':'angry')) return;
          const kh=(new Date(Date.now()+9*3600000)).getUTCHours(), night=(kh>=21||kh<6);
          const pose=(night&&Math.random()<0.6)?'sleep':['loaf','sit','sit','loaf','sleep'][Math.floor(Math.random()*5)];   // 낮엔 sleep 가중 하향(1/5) — 앉기/식빵 위주로 생동감
          enterPose(a, id, pose); actorEmote(a, pose==='sleep'?'zz':'idle'); return; }
        // 가끔 방향 전환(개별) — 쿨다운 지나야(연속 뒤집힘=춤 방지)
        if(a.mode==='roam' && (a.dcool||0)<=0 && Math.random()<a.turn*pr){ a.dir*=-1; a.dcool=FLIP_COOL; }
        // 가끔 속도 변화(개별) — 바뀐 속도에 맞춰 걷기 주기도 갱신(미끄러짐 방지)
        if(a.mode==='roam' && Math.random()<0.003*pr){ a.v=0.14+Math.random()*0.18; setWalkDur(a); }
        // ───── 캠 펫 움직임 속도 튜닝 가이드(아래 수치를 바꾸면 이렇게 바뀜) ─────
        //  · 좌우 걷기 속도 = a.v(0.14~0.32 px/ms 랜덤, 위 2090행) × dt×0.06(아래 이동식). a.v↑ = 좌우로 더 빨리 걸음.
        //  · 앞뒤(원근) '자유 배회' 속도 = 아래 vz 크기 0.000008 depth/ms. ↑ = 앞뒤로 더 자주/빨리 오감(현재 전체 0→1 이동 ≈120초). 0으로 두면 배회 시 앞뒤 정지.
        //  · 앞뒤 '가구로 이동'(goal) 속도 = x 접근 진척에 비례(대각선) + 근접 시 상한 0.00008 / 최소크롤 0.00003(2108행). ↑ = 가구로 더 빨리 다가감. (예전 0.004*dt = 순간이동 버그였음)
        //  · 겹침 분리 시 깊이 밀기 = 프레임당 상한 0.008(separatePets). ↑ = 겹쳤을 때 더 빨리 떨어지되 너무 크면 '훅' 튐.
        //  · 이동 리듬: 방향전환 확률 a.turn·재전환 쿨다운 FLIP_COOL(450ms)·자리앉기 a.idle·가구찾기 a.seek·속도변화 확률(2090행 0.003).
        // 앞뒤(깊이) 배회 — 가끔 앞/뒤 속도를 새로 정하고 천천히 이동해 가까워졌다 멀어졌다(원근·가림 변화).
        if(a.mode==='roam'){
          if(a.cool<=0 && Math.random()<0.006*pr) a.vz=(Math.random()*2-1)*0.000008;   // depth/ms — 정면캠이라 앞뒤(원근) 이동은 좌우보다 훨씬 더 느리게(전체 범위 이동에 약 120초+, 살짝만 움직여도 크게 보이는 원근 왜곡 완화)
          if(a.vz){ a.depth+=a.vz*dt; if(a.depth<=0){a.depth=0;a.vz=Math.abs(a.vz);} else if(a.depth>=1){a.depth=1;a.vz=-Math.abs(a.vz);} }
        }
        // 가구로 이동 결정(가구 있을 때, 쿨다운 후)
        if(a.mode==='roam' && a.props.length && a.cool<=0 && Math.random()<a.seek*pr){
          const avail=a.props.filter(p=>INTERACTIVE_FURN[p.itemId] && occupantsOf(p.key,a,actors).n < (p.itemId==='tower'?3:1));   // 상호작용 가구(화이트리스트) 중 빈 것만(캣타워는 남은 층 있으면). 바닥 아이템(러그·연못)·배경 가구(화장실·화분)는 목록에 없어 자동 제외
          if(avail.length){ const g=avail[Math.floor(Math.random()*avail.length)]; a.resKey=g.key;
            if(g.itemId==='tower'){ const used=occupantsOf(g.key,a,actors).floors; a.resFloor=[0,1,2].find(f=>!used[f]); if(a.resFloor==null) a.resFloor=0; } else a.resFloor=null;
            a.goal=g; a.mode='goal'; } }
        // 가구 도착: "고양이 중심"(a.x+sw/2) 기준으로 가구 중앙(goal.x)에 섬. 깊이도 가구 쪽으로 맞춰 걸어감.
        // ⚠️ x에 다 왔는데 깊이 수렴을 기다리며 방향이 매 프레임 뒤집혀 "제자리 좌우 춤"추던 버그 → x 도착 시 위치를 스냅하고 방향을 고정한 채 대기.
        if(a.mode==='goal' && a.goal){ const cx=a.x+a.sw/2, dxr=a.goal.x-cx, adx=Math.abs(dxr), nearX=adx<6;
          if(!nearX) a.dir=(dxr>0)?1:-1;   // 멀 때만 방향 갱신(가까우면 고정 → 좌우 버벅/춤 방지). goal 펫은 separatePets 대상 아님(가구로 가는 중 안 막힘)
          if(a.goal.depth!=null){ const dd=a.goal.depth-a.depth, add=Math.abs(dd), xStep=a.v*dt*0.06;
            // 앞뒤(깊이) 수렴을 x 접근 '진척에 비례'해 함께 이동 → 대각선으로 자연스럽게 걸어감(예전 0.004*dt는 순간이동처럼 훅 튐). x에 다 왔으면 느린 상한으로만 마무리.
            const step=nearX ? Math.min(add, 0.00008*dt) : Math.min(add, add*(xStep/Math.max(adx,1)) + 0.00003*dt);
            a.depth+=Math.sign(dd)*step; }
          const nearD=Math.abs((a.goal.depth==null?a.depth:a.goal.depth)-a.depth)<0.03;
          if(nearX){ a.x=a.goal.x-a.sw/2;   // x 도착 → 위치 스냅(오버슈트로 인한 좌우 떨림 제거)
            if(nearD){ enterInteract(a, id, a.goal); a.goal=null; return; }
            applyDepth(a); setXform(a, a.dir); a._pdir=a.dir; return;   // 깊이 수렴까지 그 자리에서 정지(이동·방향전환 없음)
          }
        }
        a.x += a.dir*a.v*dt*0.06;
        const max=a.W-a.sw;
        if(a.x<2){ a.x=2; if(a.dir<0 && (a.dcool||0)<=0){ a.dir=1; a.dcool=FLIP_COOL; } if(a.mode==='goal'){a.mode='roam';a.goal=null;releaseRes(a);} }
        else if(a.x>max){ a.x=max; if(a.dir>0 && (a.dcool||0)<=0){ a.dir=-1; a.dcool=FLIP_COOL; } if(a.mode==='goal'){a.mode='roam';a.goal=null;releaseRes(a);} }
        if(!a.spr){ a.fc+=dt; if(a.fc>170){ a.fc=0; a.frame^=1; a.el.innerHTML=catSide(id,a.frame,{h:a.hh}); } }   // SVG 폴백: 2프레임 교대(스프라이트는 필름 csprFilm이 처리)
        // 이동·방향·깊이를 transform 하나로(translate3d+scale) — 전부 합성, 매 프레임 페인트 0 → 깜빡임 근본 제거
        applyDepth(a); setXform(a); a._pdir=a.dir;
      });
      separatePets(actors);   // 같은 배치칸(열·행) 겹침 방지(무대 안에서만)
    }
    // 배치칸 기반 겹침 방지: 두 펫이 같은 칸(같은 열 && 같은 행/깊이)이면 이동 중인 펫을 밀어내고 멀어지는 방향으로 전환.
    // 열=x(W/12 폭), 행=depth(1/CAM.DIV=1/7 단위). 열이 같아도 행(깊이)이 다르면 앞뒤로 겹쳐 보이는 것이라 허용(원근·가림 유지).
    function separatePets(acts){
      if(!acts || acts.length<2) return;
      const colW=(acts[0].W||160)/GRID_N, rowD=1/CAM.DIV, moved=[];
      const mov=a=>(a.mode==='roam');   // 자유 로밍 펫만 분리 대상 — goal(가구로 가는)·pause(앉은)·drag는 겹침분리에 관여 안 함(가구로 가는 펫이 다른 펫에 안 막히고 겹쳐 지나감)
      for(let i=0;i<acts.length;i++) for(let j=i+1;j<acts.length;j++){
        const a=acts[i], b=acts[j];
        if(a.mode==='drag'||b.mode==='drag') continue;
        const dcx=(a.x+a.sw/2)-(b.x+b.sw/2), ddp=(a.depth||0)-(b.depth||0);
        if(Math.abs(dcx)>=colW || Math.abs(ddp)>=rowD) continue;   // 다른 칸 → 통과(다른 행이면 앞뒤 겹침 허용)
        const aMov=mov(a), bMov=mov(b); if(!aMov || !bMov) continue;   // 둘 다 로밍일 때만 분리(한쪽이 가구로 가거나 앉았으면 통과)
        // 🐾 가끔 인사 — 둘 다 로밍으로 마주친 순간, 낮은 확률로 서로 마주보고 잠깐 앉음(+하트). 쿨다운으로 반복 방지, 아니면 평소처럼 분리.
        if((a._greetCool||0)<=0 && (b._greetCool||0)<=0 && Math.random()<0.04){
          const aRight=dcx>=0;   // a가 b의 오른쪽에 있으면 a는 왼쪽(west)을, b는 오른쪽(east)을 본다
          enterGreet(a, aRight?'west':'east'); enterGreet(b, aRight?'east':'west');
          actorEmote(a,'greet'); actorEmote(b,'greet');
          a._greetCool=25000; b._greetCool=25000; continue; }
        // 더 적게 움직여 칸을 벗어나는 축(열/행)으로 분리
        const needX=colW-Math.abs(dcx), needD=rowD-Math.abs(ddp);
        if(needX/colW <= needD/rowD){   // 열(x)로 분리
          const sx=(dcx>=0?1:-1), share=(aMov&&bMov)?0.5:1, push=(needX+0.6)*share;
          if(aMov){ a.x=Math.max(2,Math.min(a.W-a.sw, a.x+sx*push)); if(a.dir!==sx && (a.dcool||0)<=0){ a.dir=sx; a.dcool=FLIP_COOL; } moved.push(a); }   // 위치는 항상 밀되, 방향은 b쪽으로 향할 때만·쿨다운 지나야 뒤집음(춤 방지)
          if(bMov){ b.x=Math.max(2,Math.min(b.W-b.sw, b.x-sx*push)); if(b.dir!==-sx && (b.dcool||0)<=0){ b.dir=-sx; b.dcool=FLIP_COOL; } moved.push(b); }
        } else {   // 행(depth)으로 분리
          const sd=(ddp>=0?1:-1), share=(aMov&&bMov)?0.5:1, push=Math.min((needD+0.004)*share, 0.008);   // 깊이 분리는 프레임당 상한(0.008)으로 완만하게 밀어 순간이동처럼 튀지 않게(여러 프레임에 걸쳐 분리)
          if(aMov){ a.depth=Math.max(0,Math.min(1, a.depth+sd*push)); a.vz=Math.abs(a.vz||0.000008)*sd; moved.push(a); }
          if(bMov){ b.depth=Math.max(0,Math.min(1, b.depth-sd*push)); b.vz=-Math.abs(b.vz||0.000008)*sd; moved.push(b); }
        }
      }
      moved.forEach(a=>{ applyDepth(a); setXform(a); a._pdir=a.dir; });   // 밀린 펫만 트랜스폼 갱신
    }
    function catLoop(){
      if(document.hidden && !pipOpen()){ _eng.raf=0; _eng.win=null; return; }   // 탭 숨김 → 루프 정지(복귀 시 visibilitychange로 재개, 유휴 배터리 절약). 🖥️ PiP 창이 떠 있으면 계속(그 창은 항상 보임)
      const _w=_engWin(); _eng.win=_w; _eng.raf=_w.requestAnimationFrame(catLoop);   // 다음 프레임 먼저 예약(아래 작업이 예외로 죽어도 루프 유지). 🖥️ PiP가 열려 있으면 PiP 창의 rAF — 메인 탭이 숨겨져도(rAF 정지) 미니 캠은 계속 움직인다.
      const ts=Date.now();   // ⏱ rAF 타임스탬프는 창(메인/PiP)마다 원점이 달라 섞어 쓸 수 없음 → 벽시계(ms)로 통일(dt 상한 90ms가 전환 순간을 흡수)
      const want=activeStages();                    // 값싼 조회(몇 개 getElementById) — 예산 결정에 필요해 게이트 앞에서 1회 계산 후 아래서 재사용
      // 🔋 프레임레이트 캡 — 걷기는 30fps면 충분(저사양 CPU/GPU·배터리 절반↓). 가벼운 모드 22fps. OS 모션최소화 5fps(사실상 정지). dock 스트립만 활성(홈캠·방·친구방·리빌 없음)이면 사용자가 포커스 안 하므로 12fps로.
      const dockOnly = want.length===1 && want[0] && want[0].id==='cdStage';
      const budget = reducedMotion() ? 200 : (liteMode() ? (dockOnly?90:45) : (dockOnly ? 83 : 33));
      const since = _eng.last ? ts-_eng.last : 999;
      if(since < budget) return;                    // 아직 프레임 예산이 안 참 → 이 rAF는 그냥 넘김(무거운 stepActors 스킵)
      const dt=Math.min(90, since); _eng.last=ts; if(_perfHudEl) _perfHudTick(dt);    // dt 상한 90ms(12fps ~83ms 간격 반영해 이동거리 튐 방지)
      try{
        // 무대 집합이 바뀌었거나 dirty면 그룹 재구성 — 유지되는 무대의 액터는 재사용해 애니메이션 상태 보존, 새 무대만 buildActors.
        const changed=_eng.dirty || _eng.groups.length!==want.length || _eng.groups.some(g=>want.indexOf(g.stage)<0);
        if(changed){ _eng.groups=want.map(st=>{ const ex=_eng.dirty?null:_eng.groups.find(g=>g.stage===st); return ex||{ stage:st, actors:buildActors(st) }; }); _eng.dirty=false; }
        if(!reducedMotion()) _eng.groups.forEach(g=>{ if(g.actors.length) stepActors(dt, g.actors); });   // 모든 무대(dock + 열린 방)를 함께 굴림
      }catch(e){ /* 이 프레임만 건너뛰고 다음 프레임 계속 */ }
    }
    // 🔬 개발자 성능 HUD — 일반모드 최적화 측정용(엔진 fps·활성 무대·액터·재생 중 애니 수·상태). 개발자 모드에서 토글, OFF면 비용 0.
    let _perfHudEl=null, _perfFrames=0, _perfAcc=0, _perfFps=0;
    function perfHudOn(){ try{ return localStorage.getItem('perfHud')==='1'; }catch(e){ return false; } }
    function _perfHudSync(){
      if(perfHudOn() && typeof document!=='undefined' && document.body){ if(!_perfHudEl){ _perfHudEl=document.createElement('div'); _perfHudEl.id='perfHud'; _perfHudEl.setAttribute('aria-hidden','true'); document.body.appendChild(_perfHudEl); } }
      else if(_perfHudEl){ _perfHudEl.remove(); _perfHudEl=null; }
    }
    function togglePerfHud(){ try{ localStorage.setItem('perfHud', perfHudOn()?'0':'1'); }catch(e){} _perfHudSync(); startCatLoop(); }
    function _perfHudTick(dt){
      _perfFrames++; _perfAcc+=dt; if(_perfAcc<500) return;
      _perfFps=Math.round(_perfFrames*1000/_perfAcc); _perfFrames=0; _perfAcc=0;
      let actors=0; try{ _eng.groups.forEach(function(g){ actors+=g.actors.length; }); }catch(e){}
      const anims=(document.getAnimations?document.getAnimations().filter(function(a){ return a.playState==='running'; }).length:'-');
      _perfHudEl.textContent='fps '+_perfFps+' · 무대 '+activeStages().length+' · 액터 '+actors+' · 애니 '+anims
        +(document.body.classList.contains('sheet-open')?' · SHEET':'')+(document.body.classList.contains('apphidden')?' · HIDDEN':'')+(liteMode()?' · LITE':'');
    }
    if(typeof document!=='undefined') _perfHudSync();   // 새로고침해도 켠 상태 복원
    function startCatLoop(){ if(!_eng.raf && !(typeof document!=='undefined'&&document.hidden&&!pipOpen())){ const _w=_engWin(); _eng.win=_w; _eng.raf=_w.requestAnimationFrame(catLoop); } }   // 🖥️ PiP가 떠 있으면 탭 숨김 중에도 PiP 창 rAF로 가동
    // 🔋 백그라운드/화면잠금 시 전면 정지 — catLoop뿐 아니라 배너 CSS/SMIL·60s 타이머까지 멈춰 배터리·발열 절감(브라우저 hidden 스로틀에 비의존).
    function _applyAppHidden(hidden){
      try{ document.body.classList.toggle('apphidden', hidden); }catch(_e){}
      try{ document.querySelectorAll('.pkscene svg').forEach(function(s){ if(hidden){ if(s.pauseAnimations) s.pauseAnimations(); } else if(s.unpauseAnimations) s.unpauseAnimations(); }); }catch(_e){}   // 🌈 CSS로 안 멈추는 무지개 SMIL 정지/재개
      if(hidden){ if(state._petTimer && !pipOpen()){ clearInterval(state._petTimer); state._petTimer=0; } }   // 60s 그릇정산 웨이크 제거 — 🖥️ PiP 시청 중이면 유지(숨김 탭 스로틀로 어차피 ≥1분 간격)
      else if(state.game && !state._petTimer && typeof reconcilePets==='function'){ state._petTimer=setInterval(function(){ reconcilePets(); if(typeof reconcileDrops==='function') reconcileDrops(); }, 60000); }   // 복귀 시 재무장
    }
    if(typeof document!=='undefined'){
      document.addEventListener('visibilitychange', function(){ const h=document.hidden; _applyAppHidden(h);
        if(!h){ _eng.last=0; startCatLoop(); }   // 탭 복귀 시 루프 재개(PiP rAF에 있던 체인은 다음 프레임에 _engWin이 메인으로 자동 복귀)
        else if(pipOpen() && _eng.raf){   // 🖥️ 탭 숨김 + PiP 열림: 메인 rAF에 걸린 체인은 숨김 동안 얼어붙으므로 PiP 창 rAF로 옮겨 미니 캠을 계속 굴린다
          try{ (_eng.win||window).cancelAnimationFrame(_eng.raf); }catch(e){}
          _eng.raf=0; _eng.win=null; _eng.last=0; startCatLoop();
        } });
      window.addEventListener('pagehide', function(){ _applyAppHidden(true); });     // iOS PWA/TWA 백그라운드 전환
      window.addEventListener('pageshow', function(){ _applyAppHidden(false); _eng.last=0; startCatLoop(); });
    }

    // ===== 캠/방에서 펫을 바로 끌어(드래그) 좌우로 이동 =====
    let _petDrag=null, _petJustDragged=false;
    function camTap(){ if(_petJustDragged) return; openCatHouse(); }   // 드래그 직후의 탭은 알뜰샵 열기 무시
    // 🐾 펫 애정도: 방/캠에서 펫을 탭해 쓰다듬기(펫별 3시간 쿨다운) → +1, 임계에서 레벨업. 실제 쓰다듬을 때만 하트 연출.
    let _affLevelUp=null, _petCdToast=0;
    const PET_COOLDOWN_MS=24*60*60*1000;   // 쓰다듬기 쿨다운 하루(펫별, RTDB pettedAt로 지속)
    const PET_PET_REWARD=10, PET_DAILY_CAP=3;   // 쓰다듬기 보상 은화(펫별 하루 1회) · 은화는 하루 PET_DAILY_CAP마리까지만(애정은 무제한, 경제 정책 §3-C)
    // 펫 쓰다듬기 연출: 좋아요와 동일한 픽셀 하트(heartSvg)가 위로 떠오르고 + 작은 하트들이 뿅 팝(likeBurst).
    function heartFx(x,y){ const cx=(x||innerWidth/2), cy=(y||innerHeight/2);
      const el=document.createElement('div'); el.className='heartfx'; el.innerHTML=(typeof heartSvg==='function')?heartSvg({h:22}):'❤';
      el.style.left=cx+'px'; el.style.top=cy+'px'; document.body.appendChild(el); setTimeout(()=>{ el.remove(); }, 820);
      if(typeof likeBurst==='function') likeBurst(cx,cy); }
    // 💗 애정 레벨업 연출: 하트 오른쪽 옆에 분홍 픽셀 "UP!" 이 두둥(팝 오버슈트+상승) 하고 사라짐.
    function affLevelFx(x,y){
      const el=document.createElement('div'); el.className='lvlup'; el.innerHTML=(typeof upSvg==='function')?upSvg({h:18}):'UP!';
      el.style.left=((x||innerWidth/2)+22)+'px'; el.style.top=((y||innerHeight/2)-4)+'px';
      document.body.appendChild(el); setTimeout(()=>{ el.remove(); }, 1200);
    }
    // ❤ 좋아요 팝: (cx,cy) 근처에서 작은 픽셀 하트들이 위쪽 부채꼴로 '뿅' 튀어올랐다 사라짐. prefers-reduced-motion이면 생략.
    function likeBurst(cx,cy){
      if(typeof heartSvg!=='function') return;
      try{ if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; }catch(e){}
      const N=6;
      for(let i=0;i<N;i++){
        const el=document.createElement('div'); el.className='likepop';
        const ang=(-90+(i-(N-1)/2)*24)*Math.PI/180, dist=22+Math.random()*20;
        el.style.setProperty('--tx',(Math.cos(ang)*dist).toFixed(1)+'px');
        el.style.setProperty('--ty',(Math.sin(ang)*dist).toFixed(1)+'px');
        el.style.left=cx+'px'; el.style.top=cy+'px'; el.style.animationDelay=(i*16)+'ms';
        el.innerHTML=heartSvg({h:11+Math.floor(Math.random()*7)});
        document.body.appendChild(el); setTimeout(()=>el.remove(), 820+i*16);
      }
    }
    // ⭐ 대표 방 지정 팝: 큰 별이 살짝 떠오르고 + 작은 별들이 위 부채꼴로 '뿅'(좋아요 연출과 동일 클래스 재사용, 별은 골드색을 자체 팔레트로 가짐). reduced-motion이면 작은 별 생략.
    function starBurst(cx,cy){
      if(typeof starSvg!=='function') return; cx=cx||innerWidth/2; cy=cy||innerHeight/2;
      const big=document.createElement('div'); big.className='heartfx'; big.innerHTML=starSvg({h:24});
      big.style.left=cx+'px'; big.style.top=cy+'px'; document.body.appendChild(big); setTimeout(()=>big.remove(), 820);
      try{ if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; }catch(e){}
      const N=6;
      for(let i=0;i<N;i++){ const el=document.createElement('div'); el.className='likepop';
        const ang=(-90+(i-(N-1)/2)*26)*Math.PI/180, dist=20+Math.random()*20;
        el.style.setProperty('--tx',(Math.cos(ang)*dist).toFixed(1)+'px'); el.style.setProperty('--ty',(Math.sin(ang)*dist).toFixed(1)+'px');
        el.style.left=cx+'px'; el.style.top=cy+'px'; el.style.animationDelay=(i*16)+'ms';
        el.innerHTML=starSvg({h:10+Math.floor(Math.random()*6)});
        document.body.appendChild(el); setTimeout(()=>el.remove(), 820+i*16);
      }
    }
    // 쓰다듬기: 펫별 하루 1번만(RTDB owned.cats[id].pettedAt로 지속). 성공 시 하트 연출 + 은화 PET_PET_REWARD(10) 보상(지갑으로 날아가는 연출·카운트업). 쿨다운 중엔 하트 없음.
    // 애정 상승 + 레벨업 보상(레벨 소보상 은화·만렙 금화)을 트랜잭션 g에 적용. 쿨다운/쓰다듬기 은화는 호출측 담당(쓰다듬기=bumpAffection, 간식=applyTreat).
    // 반환 {before,after,silver,gold}. after>before면 레벨업.
    function applyAffectionGain(g, id, amount){
      const c=g.owned.cats[id]; if(!c) return null;
      const tier=CAT_TIER[id]||'normal';   // 💗 등급별 애정 계단(affectionLevel(aff,tier) — 명품백 프레스티지, 경제 정책 §3-C)
      const before=affectionLevel(c.affection, tier).level;
      c.affection=(Number(c.affection)||0)+Math.max(1, Math.floor(Number(amount)||1));
      const after=affectionLevel(c.affection, tier).level; let silver=0, gd=0;
      if(after>before){
        // 다중 레벨 점프(중복 획득 등)도 걸친 레벨 보상 전부 합산. affRw=보상 수령 최고 레벨 마커 —
        // 임계 개편으로 레벨이 재해석(하락)된 펫이 재도달해도 이중 지급되지 않게 차단(마이그레이션이 구 레벨로 초기화).
        const rw=Math.max(0, Math.floor(Number(c.affRw)||0));
        for(let L=before+1; L<=after; L++){ if(L>rw){ silver+=affLevelReward(L); if(L>=5) gd+=5; } }
        if(after>rw) c.affRw=after;
        if(silver>0) g.coins=clampCoins((g.coins||0)+silver);
        if(gd>0) g.gold=clampGold((g.gold||0)+gd);
      }
      return { before, after, silver, gold:gd };
    }
    function bumpAffection(id, x, y){
      if(!id || !ownsCat(id)) return;
      const now=Date.now(), last=Number((ownedCatsMap()[id]||{}).pettedAt)||0;
      if(now-last < PET_COOLDOWN_MS){   // 쿨다운: 하트 없음. 남은 시간만 가끔 토스트로 안내(스팸 방지).
        if(now-_petCdToast>2500){ _petCdToast=now; const rem=PET_COOLDOWN_MS-(now-last), hh=Math.ceil(rem/3600000);
          toast(catName(id)+' 쓰다듬기는 하루 한 번 · 약 '+hh+'시간 후 가능'); }
        return; }
      _affLevelUp=null; let did=false, paid=false; const beforeCoins=coins(), beforeGold=gold();
      gameRef().transaction(g=>{ g=normalizeGame(g); const c=g.owned.cats[id]; paid=false; if(!c){ did=false; return g; }
        if(now-(Number(c.pettedAt)||0) < PET_COOLDOWN_MS){ did=false; return g; }   // 트랜잭션 내 재확인(다기기 동시성)
        did=true; c.pettedAt=now;
        // 🐾 쓰다듬기 은화는 하루 PET_DAILY_CAP마리까지만(애정은 항상 +1). 상한 넘으면 은화 없이 애정만.
        const dkey=kstDayKey(); if((g.petDay&&g.petDay.day)!==dkey) g.petDay={day:dkey,n:0};
        if((Number(g.petDay.n)||0)<PET_DAILY_CAP){ g.petDay.n=(Number(g.petDay.n)||0)+1; g.coins=clampCoins((g.coins||0)+PET_PET_REWARD); paid=true; }
        const gain=applyAffectionGain(g, id, 1);   // 애정+1 + 레벨업 보상(공유 헬퍼)
        _affLevelUp=(gain&&gain.after>gain.before)?{ id, level:gain.after, gold:gain.gold, silver:gain.silver }:null;
        return g;
      }).then(res=>{ if(res&&res.committed&&did){ heartFx(x,y);   // 실제 쓰다듬었을 때만 하트 액션
        const lvUp=_affLevelUp, base=paid?PET_PET_REWARD:0, dSilver=base+((lvUp&&lvUp.silver)||0), dGold=(lvUp&&lvUp.gold)||0;
        if(dSilver>0||dGold>0) rewardFly(x, y, dSilver, dGold, beforeCoins, beforeGold);   // 은화(+레벨업 보너스·만렙 금화)가 지갑으로 스르르 날아가며 카운트업
        if(lvUp){ affLevelFx(x,y); toast('❤ '+catName(lvUp.id)+' 애정 레벨 '+lvUp.level+(lvUp.gold?' · 만렙! 금화 +'+lvUp.gold:'')+(dSilver>0?' · 은화 +'+dSilver:'')); _affLevelUp=null; }
        else toast('❤ '+catName(id)+' 쓰다듬기 · 애정 +1'+(paid?' · 은화 +'+PET_PET_REWARD:' · 오늘 은화 보상 상한')); } });
    }
    function petGrabDown(e){
      const el=(e.target&&e.target.closest)?e.target.closest('.cd-actor'):null; if(!el) return;
      let a=null; for(let gi=0;gi<_eng.groups.length;gi++){ const f=_eng.groups[gi].actors.find(x=>x.el===el); if(f){ a=f; break; } }   // 여러 무대 중 이 액터가 속한 무대에서 찾음
      if(!a) return;
      e.preventDefault();   // 캠 이미지가 선택/네이티브 드래그되는 것 방지
      const stage=el.parentElement, sx=e.clientX, pid=e.pointerId; let started=false, lastX=e.clientX;   // pid: 멀티터치 시 이 포인터 이벤트만 처리(다른 손가락이 다른 펫을 같이 끌던 버그 방지)
      const begin=()=>{ started=true; _petDrag=a; a.mode='drag'; a.goal=null; if(typeof releaseRes==='function') releaseRes(a); if(a.pkey) delete _petPose[a.pkey];   // 집어 들면 앉기 지속 해제
        a.lift=0; a.el.classList.add('cdgrab');   // 드래그 중에도 발이 바닥/커서에 붙게 — 들어올림 제거(집기 피드백은 그림자 cdgrab). setXform이 발밑 여백도 상쇄
        if(a.spr) actorShowStill(a,'south'); setXform(a, a.spr?1:a.dir);
      };
      const mv=(ev)=>{ if(ev.pointerId!==pid) return;   // 이 드래그의 포인터만
        if(!started){ if(Math.abs(ev.clientX-sx)>3||Math.abs(ev.clientY-e.clientY)>3) begin(); else return; }   // 살짝만 끌어도 바로 집힘(꾹 누를 필요 없음)
        ev.preventDefault(); const r=stage.getBoundingClientRect(), W=a.W||r.width;
        let x=ev.clientX-r.left-a.sw/2; x=Math.max(2, Math.min(W-a.sw, x));
        if(ev.clientX<lastX-1) a.dir=-1; else if(ev.clientX>lastX+1) a.dir=1; lastX=ev.clientX;
        // 세로로 끌면 앞뒤(깊이) 이동: 위로 = 멀리(작게·뒤), 아래로 = 가까이(크게·앞).
        const ry=r.bottom-ev.clientY; a.depth=Math.max(0,Math.min(1, ry/(a.riseMax||1))); applyDepth(a);
        a.x=x; setXform(a, a.spr?1:a.dir);
      };
      const cleanup=()=>{ window.removeEventListener('pointermove',mv); window.removeEventListener('pointerup',end); window.removeEventListener('pointercancel',end);
        if(started){ a.el.classList.remove('cdgrab'); a.mode='roam'; a.lift=0; a.fc=999; a.cool=700; actorShowMoving(a); setXform(a); a._pdir=a.dir;
          _petDrag=null; _petJustDragged=true; setTimeout(()=>{ _petJustDragged=false; }, 260); }   // 놓은 자리에서 다시 배회
      };
      const end=(ev)=>{ if(ev && ev.pointerId!==pid) return; if(!started && ev && ev.type==='pointerup') bumpAffection(el.getAttribute('data-cat'), ev.clientX, ev.clientY); cleanup(); };   // 안 끌고 뗌=쓰다듬기(애정+1)
      window.addEventListener('pointermove',mv); window.addEventListener('pointerup',end); window.addEventListener('pointercancel',end);
    }
    if(typeof document!=='undefined') document.addEventListener('pointerdown', petGrabDown, true);

