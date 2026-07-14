    // ================= 가챠 탭: 뽑기(펫알·랜덤박스) =================
    // 등급/확률(합 100). color=이름 텍스트/후광 색, limited는 CSS 레인보우.
    const TIERS = [
      { id:'normal',   name:'일반', p:45,  color:'#FFFFFF' },
      { id:'uncommon', name:'고급', p:30,  color:'#2FAE7A' },
      { id:'rare',     name:'희귀', p:15,  color:'#3182F6' },
      { id:'epic',     name:'특별', p:6,   color:'#9B6FC8' },
      { id:'legend',   name:'전설', p:3,   color:'#E0A43C' },
      { id:'limited',  name:'신화', p:0.8, color:'#ff5fa2' },   // 신화(구 '한정') — 핑크 텍스트·연출. id는 하위호환 위해 'limited' 유지. 2026-07: 1→0.8
      { id:'exclusive',name:'한정', p:0.2, color:'#F2C84B' }    // 한정(최상위·무지개) — 2026-07: 펫알·랜덤박스에도 0.2%(펫=활성 한정만·아이템=한정 포함 boxPool). 미공개 한정 전체는 무지개알/박스(신화80·한정20)에서
    ];
    // 🌱 뜰알(한정 픽업 뽑기) 전용 확률표 — 기본과 같지만 신화 1→0.5, 한정 0.5 추가(활성 한정 펫=흑표범·퓨마만 풀에). 합 100.
    const DDEUL_TIERS=[{id:'normal',p:45},{id:'uncommon',p:30},{id:'rare',p:15},{id:'epic',p:6},{id:'legend',p:3},{id:'limited',p:0.5},{id:'exclusive',p:0.5}];
    // (구) NO_GACHA_TIERS 제거 — 한정 펫은 펫알에선 exActive(활성)만 선별 포함, 무지개알은 전체(rainbowCatTierMap). 한정 아이템은 boxPool에 포함(기본 박스 0.2%·무지개박스 50% — 2026-07 개편).
    const TIER_ORDER = TIERS.map(t=>t.id);   // 높은 등급이 비면 한 단계씩 낮춰 대체할 때 사용
    function tierInfo(id){ return TIERS.find(t=>t.id===id)||TIERS[0]; }
    // 동물 이름을 등급 색으로 표기. 일반(흰색)은 밝은 배경에서 안 보이므로 기본 잉크색, 한정(exclusive)은 무지개(.tier-rainbow), 신화(limited)는 핑크(등급색 인라인).
    function catTierColor(id){ const t=CAT_TIER[id]||'normal'; return t==='normal' ? 'var(--text)' : tierInfo(t).color; }
    function catNameSpan(id, name){ const t=CAT_TIER[id]||'normal'; const n=escapeHtml(name);
      if(t==='exclusive') return '<span class="tier-rainbow">'+n+'</span>';   // 한정 = 무지개
      return '<span style="color:'+catTierColor(id)+'">'+n+'</span>'; }   // 신화=핑크(#ff5fa2) 등 등급색
    // 🌈 한정 픽업(가챠 배너): [펫1(왼쪽), 펫2(오른쪽)]. 픽업 대상을 바꾸려면 이 배열만 수정. 존재하는 펫만 배너에 뜬다.
    const LIMITED_PICKUP = ['cat_blackpanther','cat_puma'];   // 한정 픽업: 펫1=흑표범 · 펫2=퓨마
    // 🌙 개발자 배너 미리보기 전용 픽업 오버라이드(밤=흑표범·카라칼). 라이브 LIMITED_PICKUP/exActive는 안 건드림 — FX 닫힐 때 해제.
    const DEV_NIGHT_PICKUP=['cat_blackpanther','cat_caracal'];
    let _devPickupOverride=null;
    function activePickup(){ return _devPickupOverride||LIMITED_PICKUP; }
    function pickupMember(){ const pp=activePickup().filter(pickupExists); return pp.length?pp[Math.floor(Math.random()*pp.length)]:null; }
    // 배너 배회 무대(#pkStage)에 픽업 펫 2마리 — 개발자 밤 배너에서 흑표범·카라칼 배회 미리보기.
    function devPickupStageHtml(ids){ const H=92, actor=function(id,lx){ return (pickupExists(id)&&hasSprite(id)) ? '<div class="cd-actor" data-cat="'+id+'" data-hh="'+H+'" style="left:'+lx+'px;"><span class="cd-shadow">'+shadowSvg({h:9})+'</span>'+catActorHTML(id,H)+'</div>' : ''; };
      return '<div class="cd-room pkstage" id="pkStage" data-noprops="1" data-hh="'+H+'" aria-hidden="true">'+actor(ids[0],14)+actor(ids[1],99999)+'</div>'; }
    function pickupExists(id){ return !!id && PET_CATALOG.some(c=>c.id===id); }
    // 결정적 의사난수(0~1) — 인덱스·시드로 매 렌더 동일한 "랜덤 배치"(Math.random은 재렌더마다 튀어 금지).
    function pkRand(i,s){ const x=Math.sin((i+1)*12.9898+s*4.1414)*43758.5453; return x-Math.floor(x); }
    // 🧭 균일 분포용 지터드 그리드(배경효과·픽업배너 공용): 칸마다 하나씩(가로·세로 균일 + 간격)으로 뭉침 방지. 원근은 호출부가 yy(0=뒤/위 … 1=앞/아래)로 bottom%·크기 매핑. 결정적(pkRand)이라 캐시 안전.
    function pkSlots(n, seed){ const cols=Math.max(2,Math.round(Math.sqrt(n*1.7))), rows=Math.max(1,Math.ceil(n/cols)), a=[];
      for(let i=0;i<n;i++){ const cx=i%cols, cy=(i/cols)|0, jx=pkRand(i,seed), jy=pkRand(i,seed+1);
        a.push({ x:+(((cx+0.18+jx*0.64)/cols)*100).toFixed(1), yy:(rows<=1?0.5:(cy+0.16+jy*0.68)/rows) }); } return a; }
    // 가챠 탭 상단 한정 픽업 배너 — 하늘(흐르는 구름 다수)+넓고 연한 무지개(1초 뒤 사르르)+뜰(흙·풀·꽃·원근 나무를 필드 전체에 원근 분포, 바람에 살랑) 가운데 로그인 알, 픽업 펫 둘은 캠 엔진(#pkStage)으로 걸어와 자유 배회.
    //  · 깊이 d(0=앞·크게·아래 ~ 1=뒤·작게·위): bottom%=d*범위, 크기=1-d*0.5. 나무는 뒤쪽(d 큼)만 → 펫 안 가림+하늘 안 침범.
    let _pkSceneCache={};   // 픽업 씬 메모 — 씬은 pkRand(결정적 시드)+상수 LIMITED_PICKUP에만 의존해 완전 결정적. (mode,픽업펫)로 1회만 생성하고, RTDB 틱마다 _sheetRefresh가 255KB/~4천 rect를 재생성하던 것을 제거. 픽업펫이 바뀌면 키가 달라져 자동 무효화.
    function pickupSceneHtml(mode){
      const _pkKey = (_pkV2?'v2|':'') + mode + '|' + LIMITED_PICKUP.map(function(id){ return pickupExists(id)?id:'-'; }).join(',');   // v2(개발자 미리보기)는 캐시 키 분리 — 라이브 v1 캐시와 안 섞임
      if(_pkSceneCache[_pkKey]) return _pkSceneCache[_pkKey];
      const reveal = mode==='reveal', sz = reveal?1.85:1, S = h=>Math.max(1,Math.round(h*sz));   // 리빌은 전체화면 배경 → 데코 크게
      const p1=LIMITED_PICKUP[0], p2=LIMITED_PICKUP[1], H=92;   // 펫 렌더 기준 높이(원근 앞배율 1.5=~138 → 기본(≈48)의 약 3배)
      // ☁️ 하늘: 흐르는 구름 15개(제각각 높이·모양·색·속도·위상)
      let clouds=''; for(let i=0;i<pkCount(15);i++){ const y=(2+pkRand(i,1)*30).toFixed(1), h=Math.round(11+pkRand(i,2)*17),
        w=Math.floor(pkRand(i,3)*3), tn=['w','p','b'][Math.floor(pkRand(i,4)*3)], dur=(26+pkRand(i,5)*44).toFixed(1);
        clouds+='<span class="pk-cloud" style="top:'+y+'%;--d:'+dur+'s;--i:'+i+'">'+cloudSvg(w,tn,{h:S(h)})+'</span>'; }
      // 🏔️ 지평선 원근 레이어 — 먼 나무/풀/꽃을 아주 작게. 밑동을 초록 필드(seam)에 -1~-4px 살짝 묻어(음수 bottom) 붕 떠 보이지 않게 — pk-field(초록)가 위에 그려져 밑동을 덮어 '심어진' 느낌. 꽃 비중↑.
      let farline=''; for(let i=0;i<22;i++){ const l=((i+0.4)/22*100).toFixed(1), bot=(-1-pkRand(i,53)*3).toFixed(1), k=pkRand(i,54), r=pkRand(i,55);
        let el;
        if(k<0.34) el='<span class="pk-tree pk-far pk-pine" style="left:'+l+'%;bottom:'+bot+'px;z-index:1;--i:'+i+'"><span class="pk-canopy">'+pineSvg({h:S(13+r*9)})+'</span></span>';
        else if(k<0.52) el='<span class="pk-tree pk-far" style="left:'+l+'%;bottom:'+bot+'px;z-index:1;--i:'+i+'"><span class="pk-canopy">'+treeTopSvg({h:S(11+r*7)})+'</span></span>';
        else if(k<0.68) el='<span class="pk-tuft pk-far" style="left:'+l+'%;bottom:'+bot+'px;--i:'+i+'">'+tuftSvg({h:S(6+r*3)})+'</span>';
        else el='<span class="pk-flower pk-far" style="left:'+l+'%;bottom:'+bot+'px;--i:'+i+'">'+flowerSvg(['r','y','p'][Math.floor(pkRand(i,56)*3)],{h:S(7+r*3)})+'</span>';
        farline+=el; }
      // 🌳 가까운 나무 5그루 — 중앙(아이콘 40~60%) 회피: 좌 2·우 2 + 우측 앞 1(프레이밍). 크기 1.5배·뒤쪽만·z<펫.
      const TL=[10,30,50,70,90], TD=[0.46,0.7,0.8,0.7,0.46];
      let trees=''; for(let i=0;i<5;i++){ const d=TD[i], l=(TL[i]+(pkRand(i,12)-0.5)*5).toFixed(1),
        sc=1-d*0.5, bot=(d*70).toFixed(1), z=Math.round(2+(1-d)*2), pine=pkRand(i,13)<0.45;
        const inner = pine ? '<span class="pk-canopy">'+pineSvg({h:S(Math.max(16,Math.round(69*sc)))})+'</span>'
          : '<span class="pk-canopy">'+treeTopSvg({h:S(Math.max(16,Math.round(51*sc)))})+'</span><span class="pk-trunk">'+trunkSvg({h:S(Math.max(8,Math.round(24*sc)))})+'</span>';
        trees+='<span class="pk-tree'+(pine?' pk-pine':'')+'" style="left:'+l+'%;bottom:'+bot+'%;z-index:'+z+';--i:'+i+'">'+inner+'</span>'; }
      // 🌸 꽃 16 · 🌱 풀 18: 필드 전체(앞~뒤)에 원근 분포
      // 꽃 16 — 가로로 고르게 벌려(간격 ≈5.6%, 서로/큰 요소와 안 겹치게) + 앞쪽 필드 위주(d 0~0.6)로 낮게 깔아 나무·바위에 안 가리게
      let flowers=''; for(let i=0;i<16;i++){ const d=pkRand(i,21)*0.6, l=(5+(i+0.5)/16*90+(pkRand(i,22)-0.5)*3.5).toFixed(1),
        sc=1-d*0.5, bot=(d*76).toFixed(1), tn=['r','y','p'][Math.floor(pkRand(i,23)*3)];
        flowers+='<span class="pk-flower" style="left:'+l+'%;bottom:'+bot+'%;--i:'+i+'">'+flowerSvg(tn,{h:S(Math.max(9,Math.round(16*sc)))})+'</span>'; }
      const NTf=pkCount(18); let tufts=''; for(let i=0;i<NTf;i++){ const d=pkRand(i,31)*0.85, l=(2+(i+0.5)/NTf*94+(pkRand(i,32)-0.5)*3.5).toFixed(1),
        sc=1-d*0.5, bot=(d*80).toFixed(1);
        tufts+='<span class="pk-tuft" style="left:'+l+'%;bottom:'+bot+'%;--i:'+i+'">'+tuftSvg({h:S(Math.max(7,Math.round(12*sc)))})+'</span>'; }
      // 🟫 흙: 9군데 군데군데(원근)
      let soil=''; for(let i=0;i<9;i++){ const d=pkRand(i,41)*0.7, l=(3+(i+0.5)/9*90+(pkRand(i,42)-0.5)*4).toFixed(1),
        sc=1-d*0.45, bot=(d*72).toFixed(1), w=S(Math.round((10+pkRand(i,43)*16)*sc));
        soil+='<span class="pk-soil" style="left:'+l+'%;bottom:'+bot+'%;width:'+w+'px"></span>'; }
      // 🪨 원근 큐 — 징검다리 길 + 낮은 울타리(둘 다 필드=펫 뒤라 안 가림). 발밑 깊이선(bottom%=depth*53)에 맞춰 크기=펫과 같은 depthScale → 펫이 뒤로 가면 작은 돌·울타리 옆에 서서 깊이가 읽힘.
      let stones=''; const SN=6;
      for(let i=0;i<SN;i++){ const d=0.05+(i/(SN-1))*0.82, l=(50+(i%2?6:-6)+(pkRand(i,71)-0.5)*5).toFixed(1);
        stones+='<span class="pk-stone" style="left:'+l+'%;bottom:'+(d*53).toFixed(1)+'%;z-index:1;">'+stoneSvg({h:S(Math.max(6,Math.round(14*depthScale(d))))})+'</span>'; }
      let fence=''; [0.1,0.42,0.74].forEach(function(d){ const l=(10+d*9).toFixed(1);
        fence+='<span class="pk-fence" style="left:'+l+'%;bottom:'+(d*53).toFixed(1)+'%;z-index:1;">'+fenceSvg({h:S(Math.max(8,Math.round(20*depthScale(d))))})+'</span>'; });
      // 🦋 나비 5마리 — 섹터로 고르게(쏠림 없이 간격)·각자 제각각 팔랑(방향·경로 다름). 결정적 pkRand(재렌더 안정, 캐시)
      let bflies=''; const BFT=['o','b','p','y','o']; { const P=pkSlots(5,610);   // 🦋 나비 5 — 그리드로 캠 전체 고루·간격 + 세로밴드 원근(뒤=위·작게, 앞=아래·크게)
      for(let i=0;i<5;i++){ const o=P[i], b=(22+(1-o.yy)*50).toFixed(1),
        hh=S(Math.round((9+pkRand(i,63)*3)*(0.70+o.yy*0.58))), dur=(6.5+pkRand(i,64)*5).toFixed(1), del=(-pkRand(i,65)*8).toFixed(2), fdur=(0.32+pkRand(i,66)*0.24).toFixed(2);
        let _s=80; const rnd=function(){ return pkRand(i,_s++); };
        bflies+='<span class="pk-bfly" style="left:'+o.x+'%;bottom:'+b+'%;--d:'+dur+'s;--fd:'+fdur+'s;animation-delay:'+del+'s;'+bflyDriftVars(rnd)+'"><span class="bf-wing">'+butterflySvg(BFT[i],{h:hh})+'</span></span>'; } }
      // 🌑 깊이 그림자(펫 발밑, 액터 scale 그대로라 앞=크게·뒤=작게) — .cd-shadow는 배너(pkstage)에서만 보임(CSS). --pad(발밑 여백)로 발끝에 정렬.
      const actor=(id,lx)=> pickupExists(id) ? '<div class="cd-actor" data-cat="'+id+'" data-hh="'+H+'" style="left:'+lx+'px;"><span class="cd-shadow">'+shadowSvg({h:9})+'</span>'+catActorHTML(id,H)+'</div>' : '';
      // 🪨 중간 바위(겹침 큐, z=펫과 같은 12-depth*11 → 그보다 뒤 펫은 바위 뒤로 가려짐) + 🌿 전경 프레이밍(맨 앞 큰 풀·꽃, z 최상). 무대(pkstage) 안에 둠.
      const rock  = mode==='reveal' ? '' : '<span class="pk-rock" style="left:25%;bottom:'+(0.4*53).toFixed(1)+'%;z-index:'+camZ(0.4)+';">'+rockSvg({h:Math.round(26*depthScale(0.4))})+'</span>';   // bottom 53=액터 rise(CAM.RISE 0.53)를 pk-field% 로 환산한 파생값(다른 컨테이너 좌표계)
      const frame = mode==='reveal' ? '' : '<span class="pk-frame" style="left:3%;z-index:20;">'+tuftSvg({h:34})+'</span><span class="pk-frame" style="left:97%;z-index:20;">'+flowerSvg('p',{h:30})+'</span>';
      const egg   = mode==='reveal' ? '' : '<div class="pk-egg"><img src="'+assetUrl('icons/egg-garden.svg')+'" alt=""></div>';   // 리빌은 알 대신 등장 펫이 주인공
      // 픽업 펫 2마리는 '배너'에서만 배회. 알 오픈 리빌(전설↑ 배경)에선 등장 펫이 주인공이라 배회 픽업 펫을 숨긴다(무대 자체를 안 그림). rock/frame도 배너 전용.
      const stage = mode==='reveal' ? '' : '<div class="cd-room pkstage" id="pkStage" data-noprops="1" data-hh="'+H+'" aria-hidden="true">'+rock+actor(p1,14)+actor(p2,99999)+frame+'</div>';
      // ⛰️ 아이콘 뒤 빈 하늘 채우기 — 지평선 먼 언덕(낮 초록)
      let hills=''; const HX=[18,50,82], HH=[26,24,28]; for(let i=0;i<3;i++){
        hills+='<span class="pk-hill" style="left:'+HX[i]+'%;bottom:-2px;z-index:0;">'+hillSvg(HILL_DAY,{h:S(HH[i])})+'</span>'; }
      const _pkHtml = '<div class="pkscene'+(mode==='reveal'?' pk-reveal':'')+(_pkV2?' pk-v2':'')+'" aria-hidden="true">'+
          '<div class="pk-sky">'+clouds+'</div>'+
          '<div class="pk-rainbow">'+authRainbowSvg({h:S(64)})+'</div>'+
          '<div class="pk-horizon">'+hills+farline+'</div>'+
          '<div class="pk-field">'+pkGrassDiv('day')+soil+stones+fence+tufts+flowers+trees+egg+'</div>'+
          '<div class="pk-air">'+bflies+'</div>'+stage+
        '</div>';
      _pkSceneCache[_pkKey]=_pkHtml; return _pkHtml; }
    // 가챠 탭 상단 한정 픽업 배너 = 헤더 + 픽업 씬(배너 모드).
    function limitedPickupBanner(){
      const p1=LIMITED_PICKUP[0], p2=LIMITED_PICKUP[1];
      if(!pickupExists(p1) && !pickupExists(p2)) return '';
      const tag=(id)=> pickupExists(id) ? '<span class="pk-tag">'+catNameSpan(id,catName(id))+'</span>' : '';
      const sep=(pickupExists(p1)&&pickupExists(p2))?'<span class="pk-tag" style="opacity:.5;">·</span>':'';
      return '<div class="pickbanner"><div class="pk-head"><span class="pk-title tier-rainbow">✨ 지금 이 펫만! 한정 픽업</span>'+tag(p1)+sep+tag(p2)+'</div>'+pickupSceneHtml('banner')+'</div>'; }
    // 🌇 노을 씬(펫알 배너 전용) — 픽업 씬 틀을 복사하되 무지개→노을: 노을 하늘·구름, 단풍나무, 노을 꽃,
    //    울타리·큰돌 대신 옆에 흐르는 계곡(물고기 헤엄)+줄지은 작은 돌들, 노을빛 뜰, 나비→고추잠자리. 결정적(pkRand)·캐시.
    let _sunsetCache={};   // 키별 캐시(mode|variant) — variant 'box'=랜덤박스 배너(연못 대신 선물상자 무더기)
    let _treasureCache={};
    // 💎 거대 무지개 다이아 2겹(광선+본체) 공용 마크업 — 배너 씬(.pk-tdia)과 리빌 등장 요소(.ten-skydia)가 공유.
    function tDiaLayersHtml(sz){ const k=sz||1; return '<span class="td-rays">'+raysSvg('RAINBOW',{h:Math.round(150*k)})+'</span><span class="td-body">'+tDiaSvg({h:Math.round(78*k)})+'</span>'; }
    // 🏆 보물 배너 씬 — 금은보화·보석·무지개빛 금고. 중앙(히어로 박스 자리)은 비워 양옆·상하로 트레저 배치. 다층 모션(광선·보석 부유·금괴 반짝·동전 글린트·트윙클).
    function treasureSceneHtml(mode){
      mode=mode||'banner'; const ck=(_pkV2?'v2|':'')+mode; if(_treasureCache[ck]) return _treasureCache[ck];
      const reveal=mode==='reveal', sz=reveal?1.8:1, S=function(h){ return Math.max(1,Math.round(h*sz)); };
      // ─── 뒷벽/천장 — 💎 거대 무지개 다이아몬드(도트 선버스트 광선+숨쉬는 광휘, 구 무지개 오오라 대체) + 매달린 등불(불꽃) + 부유 보석 + 반짝임 ───
      // 💎 배너에서만 다이아가 기본 표시. reveal(1뽑·10뽑)은 '기본 미표시'(노을 해와 동일 규칙) — 무지개 승급 조건일 때만 tenSkyRiseDia로 제자리 스르르 등장.
      const dia=reveal?'':'<span class="pk-tdia">'+tDiaLayersHtml()+'</span>';   // 씬 루트 직속(하늘 40% 클립 밖) — 하늘/바닥에 걸치는 뒷배경 센터피스
      let sky='';
      [[15,'0'],[85,'-1.3'],[31,'-.6'],[69,'-1.9']].forEach(function(t){ sky+='<span class="pk-tlantern" style="left:'+t[0]+'%;animation-delay:'+t[1]+'s;">'+tLanternSvg({h:S(27)})+'</span>'; });   // 매달린 등불
      const TWC=['#ffe89a','#ffffff','#ffd0e6','#d6ecff','#fff0b8'];
      const TW=pkSlots(pkCount(20),710); for(let i=0;i<TW.length;i++){ const o=TW[i], hh=S(Math.round(5+pkRand(i,72)*4)), del=(pkRand(i,73)*2.6).toFixed(2), b=(20+(1-o.yy)*70).toFixed(1);
        sky+='<span class="pk-star" style="left:'+o.x+'%;bottom:'+b+'%;animation-delay:'+del+'s;color:'+TWC[i%TWC.length]+'">'+sparkSvg({h:hh})+'</span>'; }
      const GC=['blue','purple','pink','gold','green']; const FG=pkSlots(pkCount(9),720); for(let i=0;i<FG.length;i++){ const o=FG[i], hh=S(Math.round(9+pkRand(i,74)*4)), dur=(4.5+pkRand(i,75)*3).toFixed(1), del=(-pkRand(i,76)*4).toFixed(2), b=(30+(1-o.yy)*56).toFixed(1);
        sky+='<span class="pk-tgem" style="left:'+o.x+'%;bottom:'+b+'%;--d:'+dur+'s;animation-delay:'+del+'s;">'+gemSvg(GC[i%GC.length],{h:hh})+'</span>'; }
      // ─── 💰 금화 비 — 빛나며 떨어지는 금화(낙하+플립 글린트 2겹, 크기·속도·위상 제각각 — 단순 왕복 금지 규칙) ───
      let rain=''; const RC=pkSlots(pkCount(9),740); for(let i=0;i<RC.length;i++){ const o=RC[i], hh=S(Math.round(8+pkRand(i,79)*5)), dur=(3.0+pkRand(i,80)*2.0).toFixed(2), del=(-pkRand(i,81)*6).toFixed(2), fd=(0.9+pkRand(i,82)*0.5).toFixed(2);
        rain+='<span class="pk-tcoinfall" style="left:'+o.x+'%;--d:'+dur+'s;animation-delay:'+del+'s;"><span class="tc-flip" style="--f:'+fd+'s;animation-delay:'+(-pkRand(i,83)*1.2).toFixed(2)+'s;">'+goldSvg({h:hh})+'</span></span>'; }
      // ─── 바닥 — 전폭 보물바닥(L/C/R 3덩이) + 금기둥 + 넘치는 보물상자·왕관·트로피·금잔·진주 + 흩뿌린 보물 + 흔들리는 뜰알·무지개알·무지개박스(중앙 히어로박스 자리만 비움) ───
      let f='<span class="pk-thoard" style="left:26%;bottom:-2px;">'+tHoardSvg({h:S(46)})+'</span>'+
            '<span class="pk-thoard flip" style="left:74%;bottom:-2px;">'+tHoardSvg({h:S(46)})+'</span>'+
            '<span class="pk-thoard" style="left:50%;bottom:-2px;z-index:0;">'+tHoardSvg({h:S(38)})+'</span>';
      f+='<span class="pk-tpillar" style="left:8%;bottom:0;z-index:2;">'+tPillarSvg({h:S(88)})+'</span>'+
         '<span class="pk-tpillar" style="left:92%;bottom:0;z-index:2;">'+tPillarSvg({h:S(88)})+'</span>';
      // 넘치는 보물상자(열림·금빛) + 왕관·트로피(보물산 꼭대기) + 금잔·진주 접시
      f+='<span class="pk-tprop pk-tsheen" style="left:14%;bottom:5%;z-index:3;">'+boxOpenSvg('#F4D06B',false,{h:S(20)})+'</span>'+
         '<span class="pk-tprop pk-tsheen" style="left:86%;bottom:5%;z-index:3;animation-delay:-1.2s;">'+boxOpenSvg('#F4D06B',false,{h:S(20)})+'</span>'+
         '<span class="pk-tprop pk-tglint" style="left:26%;bottom:17%;z-index:4;">'+crownSvg({h:S(13)})+'</span>'+
         '<span class="pk-tprop pk-tsheen" style="left:74%;bottom:17%;z-index:4;animation-delay:-.7s;">'+trophySvg({h:S(14)})+'</span>'+
         '<span class="pk-tprop" style="left:40%;bottom:3%;z-index:4;">'+tGobletSvg({h:S(15)})+'</span>'+
         '<span class="pk-tprop" style="left:60%;bottom:3%;z-index:4;">'+tGobletSvg({h:S(15)})+'</span>'+
         '<span class="pk-tprop pk-tglint" style="left:18%;bottom:4%;z-index:4;animation-delay:-.9s;">'+tPearlsSvg({h:S(10)})+'</span>'+
         '<span class="pk-tprop pk-tglint" style="left:82%;bottom:4%;z-index:4;animation-delay:-.3s;">'+tPearlsSvg({h:S(10)})+'</span>';
      const PR=[[13,10,'coinpile',16,''],[88,9,'coinpile',16,''],[46,9,'coinpile',13,''],[54,9,'coinpile',13,''],[20,7,'goldbar',10,'pk-tsheen'],[80,6,'goldbar',10,'pk-tsheen'],[31,4,'goldbar',9,'pk-tsheen'],[69,4,'goldbar',9,'pk-tsheen'],[5,7,'gem:purple',10,'pk-tglint'],[95,7,'gem:blue',10,'pk-tglint'],[10,13,'gem:pink',8,'pk-tglint'],[90,13,'gem:green',8,'pk-tglint'],[44,5,'gold',9,'pk-tglint'],[56,5,'gold',9,'pk-tglint'],[36,8,'gem:gold',8,'pk-tglint'],[64,8,'gem:red',8,'pk-tglint']];
      PR.forEach(function(a){ const l=a[0],b=a[1],kind=a[2],h=a[3],cls=a[4]; let ic;
        if(kind==='coinpile') ic=coinPileSvg({h:S(h)});
        else if(kind==='goldbar') ic=goldBarSvg({h:S(h)});
        else if(kind==='gold') ic=goldSvg({h:S(h)});
        else ic=gemSvg(kind.slice(4),{h:S(h)});
        f+='<span class="pk-tprop '+cls+'" style="left:'+l+'%;bottom:'+b+'%;z-index:3;">'+ic+'</span>'; });
      const EG=[[20,8,'ddeul',30,'s0'],[33,7,'rbox',30,'s1'],[67,7,'regg',28,'s2'],[80,8,'rbox',30,'s3']];
      EG.forEach(function(a){ const l=a[0],b=a[1],kind=a[2],h=a[3],cls=a[4]; let ic;
        if(kind==='ddeul') ic=ddeulEggSvg({h:S(h)});
        else if(kind==='regg') ic=rbEgg2Html(S(h), true);   // 무지개 고양이알 + 무지개꽃(오오라·트윙클 없이 — 배너 데코)
        else ic=rainbowBoxSvg({h:S(h)});
        f+='<span class="pk-tsway '+cls+'" style="left:'+l+'%;bottom:'+b+'%;z-index:5;">'+ic+'</span>'; });
      [[16,16],[84,16],[38,10],[62,10],[50,3],[8,20],[92,20],[50,14]].forEach(function(t,i){ f+='<span class="pk-star" style="left:'+t[0]+'%;bottom:'+t[1]+'%;animation-delay:'+(pkRand(i,77)*2).toFixed(2)+'s;color:#fff6d0">'+sparkSvg({h:S(6)})+'</span>'; });
      // ─── 공중 트윙클(4점 별) ───
      let air=''; const AR=pkSlots(pkCount(12),730); for(let i=0;i<AR.length;i++){ const o=AR[i], del=(pkRand(i,78)*2.4).toFixed(2), b=(16+(1-o.yy)*66).toFixed(1);
        air+='<span class="pk-star" style="left:'+o.x+'%;bottom:'+b+'%;animation-delay:'+del+'s;color:#fff6d0">'+spark4Svg('#fff6d0',{h:S(7)})+'</span>'; }
      _treasureCache[ck]='<div class="pkscene pk-treasure'+(reveal?' pk-reveal':'')+(_pkV2?' pk-v2':'')+'" aria-hidden="true">'+
        dia+'<div class="pk-sky">'+sky+'</div><div class="pk-field">'+f+'</div><div class="pk-air">'+air+rain+'</div></div>';
      return _treasureCache[ck];
    }
    function sunsetSceneHtml(mode, variant){
      mode=mode||'banner'; const ck=(_pkV2?'v2|':'')+mode+'|'+(variant||''); if(_sunsetCache[ck]) return _sunsetCache[ck];   // v2 캐시 키 분리
      const reveal=mode==='reveal', sz=reveal?1.8:1, S=function(h){ return Math.max(1,Math.round(h*sz)); };   // reveal(10뽑 전체화면)은 스프라이트를 크게
      // ☁️ 노을에 물든 구름
      let clouds=''; const SC=['so','sp','sv'];
      for(let i=0;i<pkCount(12);i++){ const y=(2+pkRand(i,1)*30).toFixed(1), hh=Math.round(11+pkRand(i,2)*16), w=Math.floor(pkRand(i,3)*3), tn=SC[Math.floor(pkRand(i,4)*3)], dur=(30+pkRand(i,5)*42).toFixed(1);
        clouds+='<span class="pk-cloud" style="top:'+y+'%;--d:'+dur+'s;--i:'+i+'">'+cloudSvg(w,tn,{h:S(hh)})+'</span>'; }
      // 🍁 지평선 단풍/풀/꽃(먼 원경, 밑동 seam에 살짝 묻힘)
      const FF=['su','sg','sw']; let farline='';
      for(let i=0;i<20;i++){ const l=((i+0.4)/20*100).toFixed(1), bot=(-1-pkRand(i,53)*3).toFixed(1), k=pkRand(i,54), r=pkRand(i,55);
        if(k<0.44) farline+='<span class="pk-tree pk-far" style="left:'+l+'%;bottom:'+bot+'px;z-index:1;--i:'+i+'"><span class="pk-canopy">'+mapleSvg({h:S(Math.round(11+r*8))})+'</span></span>';
        else if(k<0.68) farline+='<span class="pk-tuft pk-far" style="left:'+l+'%;bottom:'+bot+'px;--i:'+i+'">'+tuftSvg({h:S(Math.round(6+r*3))})+'</span>';
        else farline+='<span class="pk-flower pk-far" style="left:'+l+'%;bottom:'+bot+'px;--i:'+i+'">'+flowerSvg(FF[Math.floor(pkRand(i,56)*3)],{h:S(Math.round(7+r*3))})+'</span>'; }
      // 🍁 가까운 단풍나무 5그루 — 중앙(아이콘)·우측(연못) 회피: 좌측 4 + 우측 먼 1(작게)
      const TL=[10,30,50,72,90], TD=[0.46,0.7,0.8,0.74,0.62];
      let trees=''; for(let i=0;i<5;i++){ const d=TD[i], l=(TL[i]+(pkRand(i,12)-0.5)*5).toFixed(1),
        sc=1-d*0.5, bot=(d*70).toFixed(1), z=Math.round(2+(1-d)*2);
        trees+='<span class="pk-tree" style="left:'+l+'%;bottom:'+bot+'%;z-index:'+z+';--i:'+i+'"><span class="pk-canopy">'+mapleSvg({h:S(Math.max(18,Math.round(52*sc)))})+'</span><span class="pk-trunk">'+trunkSvg({h:S(Math.max(8,Math.round(24*sc)))})+'</span></span>'; }
      // 🌸 노을 꽃 14 — 연못(우측) 위엔 꽃 없게 왼쪽 절반(≈5~57%)에만 · 🌱 풀 16
      let flowers=''; for(let i=0;i<16;i++){ const lf=5+(i+0.5)/16*90+(pkRand(i,22)-0.5)*3.5, d=(lf>60?0.44+pkRand(i,21)*0.26:pkRand(i,21)*0.55), l=lf.toFixed(1), sc=1-d*0.5, bot=(d*76).toFixed(1);
        flowers+='<span class="pk-flower" style="left:'+l+'%;bottom:'+bot+'%;--i:'+i+'">'+flowerSvg(FF[Math.floor(pkRand(i,23)*3)],{h:S(Math.max(9,Math.round(16*sc)))})+'</span>'; }
      const NTf=pkCount(16); let tufts=''; for(let i=0;i<NTf;i++){ const lt=2+(i+0.5)/NTf*94+(pkRand(i,32)-0.5)*3.5, d=(lt>60?0.42+pkRand(i,31)*0.38:pkRand(i,31)*0.8), l=lt.toFixed(1), sc=1-d*0.5, bot=(d*80).toFixed(1);
        tufts+='<span class="pk-tuft" style="left:'+l+'%;bottom:'+bot+'%;--i:'+i+'">'+tuftSvg({h:S(Math.max(7,Math.round(12*sc)))})+'</span>'; }
      // 🟫 흙 패치
      let soil=''; for(let i=0;i<7;i++){ const d=pkRand(i,41)*0.7, l=(6+(i+0.5)/7*50+(pkRand(i,42)-0.5)*4).toFixed(1), sc=1-d*0.45, bot=(d*72).toFixed(1), w=Math.round((10+pkRand(i,43)*14)*sc*sz);
        soil+='<span class="pk-soil" style="left:'+l+'%;bottom:'+bot+'%;width:'+w+'px"></span>'; }
      // 우측 포인트 — 펫알(기본)=🪷 연못 / 랜덤박스(variant 'box')=🎁 선물상자 무더기(연못 자리에 원근 배치+트윙클). 배너 분화 지점.
      let pond='';
      if(variant==='box'){
        if(_pkV2){
        // 🎨 v2: 상자 무더기·무색(검정으로 보이던) 트윙클 제거(사용자 지침) → 우측을 노을 뜰 코너로 채움: 이끼바위 + 노을꽃·풀 + 금빛 반짝임(색 명시).
        pond+='<span class="pk-rock" style="left:81%;bottom:'+(0.34*70).toFixed(1)+'%;z-index:2;">'+rockSvg({h:S(24)})+'</span>';
        const BF=[[70,0.12,'su'],[88,0.22,'sg'],[77,0.02,'sw'],[94,0.06,'su']];   // [left%, depth, 노을꽃 틴트]
        for(let i=0;i<BF.length;i++){ const d=BF[i][1], hh=S(Math.max(10,Math.round(16*(1-d*0.5))));
          pond+='<span class="pk-flower" style="left:'+BF[i][0]+'%;bottom:'+(d*70).toFixed(1)+'%;--i:'+(i+3)+'">'+flowerSvg(BF[i][2],{h:hh})+'</span>'; }
        [[73,0.30],[85,0.10],[91,0.26]].forEach(function(t,i){ pond+='<span class="pk-tuft" style="left:'+t[0]+'%;bottom:'+(t[1]*70).toFixed(1)+'%;--i:'+(i+5)+'">'+tuftSvg({h:S(11)})+'</span>'; });
        for(let i=0;i<3;i++){ const l=(70+pkRand(i,221)*22).toFixed(1), b=(16+pkRand(i,222)*26).toFixed(1), del=(pkRand(i,223)*3).toFixed(2);
          pond+='<span class="pk-star" style="left:'+l+'%;bottom:'+b+'%;z-index:4;color:#ffd84a;animation-delay:'+del+'s">'+sparkSvg({h:S(7)})+'</span>'; }
        // 🍁 v2 추가 — 단풍 묘목 + 노을꽃 3 + 풀 1로 우측을 더 풍성하게(박스 자리 다른 요소 채움)
        pond+='<span class="pk-tree" style="left:96%;bottom:'+(0.52*70).toFixed(1)+'%;z-index:2;--i:9"><span class="pk-canopy">'+mapleSvg({h:S(22)})+'</span><span class="pk-trunk">'+trunkSvg({h:S(10)})+'</span></span>';
        [[67,0.20,'sw'],[97,0.30,'su'],[83,0.37,'sg']].forEach(function(t,i){ pond+='<span class="pk-flower" style="left:'+t[0]+'%;bottom:'+(t[1]*70).toFixed(1)+'%;--i:'+(i+8)+'">'+flowerSvg(t[2],{h:S(Math.max(9,Math.round(15*(1-t[1]*0.5))))})+'</span>'; });
        pond+='<span class="pk-tuft" style="left:66%;bottom:'+(0.14*70).toFixed(1)+'%;--i:12">'+tuftSvg({h:S(10)})+'</span>';
        } else {
        // 🎁 (v1) 상자 4개(랜덤박스 2·리본선물 2)를 우측 뜰에 원근 배치(뒤=작게·위쪽) + 반짝이 3점(pk-star 트윙클, 결정적 pkRand).
        const GB=[[71,0.30,1,17],[81,0.14,0,22],[89,0.30,0,14],[76,0.04,1,19]];   // [left%, depth, 1=리본선물, 기준 h]
        for(let i=0;i<GB.length;i++){ const d=GB[i][1], l=(GB[i][0]+(pkRand(i,211)-0.5)*3).toFixed(1), z=Math.round(2+(1-d)*2), hh=S(Math.max(10,Math.round(GB[i][3]*(1-d*0.45))));
          pond+='<span class="pk-gift" style="left:'+l+'%;bottom:'+(d*70).toFixed(1)+'%;z-index:'+z+';">'+(GB[i][2]?giftSvg({h:hh}):boxSvg({h:hh}))+'</span>'; }
        for(let i=0;i<3;i++){ const l=(70+pkRand(i,221)*20).toFixed(1), b=(10+pkRand(i,222)*26).toFixed(1), del=(pkRand(i,223)*3).toFixed(2);
          pond+='<span class="pk-star" style="left:'+l+'%;bottom:'+b+'%;z-index:4;animation-delay:'+del+'s">'+sparkSvg({h:S(7)})+'</span>'; }
        }
      } else {
      // 🪷 연못(메인 아이콘 오른쪽에 떨어뜨림) — 타원 물 + 둘레 돌 링 + 잉어 배회 + 연꽃/연잎 부유. 계곡 대체.
      // 🎏 잉어 3마리(가로): 좌·우 2마리는 오른쪽, 중앙 1마리는 왼쪽을 보며 → 오른쪽 갔다 돌아서 왼쪽(가로 핑퐁, 방향전환 시 몸 뒤집힘). ph=시작 위상(0.5≈왼쪽 바라봄)
      const KC=['o','w','g'], KSPOT=[{l:34,t:42,ph:0.05},{l:50,t:56,ph:0.5},{l:64,t:44,ph:0.20}];
      let pkoi=''; for(let i=0;i<3;i++){ const sp=KSPOT[i], dur=(8+pkRand(i,74)*3), del=(-sp.ph*dur).toFixed(2),
        sw=(0.9+pkRand(i,76)*0.4).toFixed(2), r=((11+pkRand(i,72)*3)*sz).toFixed(1);
        pkoi+='<span class="pk-pkoi" style="left:'+sp.l+'%;top:'+sp.t+'%;"><span class="koi-sw" style="--r:'+r+'px;--d:'+dur.toFixed(1)+'s;animation-delay:'+del+'s;"><span class="koi-b" style="--sw:'+sw+'s;">'+koiSvg(KC[i],{h:S(11)})+'</span></span></span>'; }
      let pstones='';
      if(_pkV2){
        // 🎨 v2: 돌 16개를 물가 실루엣을 따라 촘촘한 링으로(지터 최소·크기 살짝 키움) + 왼쪽에 큰돌 하나(개구리 자리)
        const PSN=16; for(let i=0;i<PSN;i++){ const a=((i+0.5)/PSN)*Math.PI*2, rr=52+pkRand(i,81)*2.5,
          cl=(50+Math.cos(a)*rr).toFixed(1), ct=(50+Math.sin(a)*(rr-2)).toFixed(1), s=Math.round(7+pkRand(i,82)*12),
          br=(0.80+pkRand(i,83)*0.40).toFixed(2), sep=(pkRand(i,84)*0.38).toFixed(2), hue=Math.round((pkRand(i,85)-0.5)*72);   // 돌마다 크기(7~19)·톤(밝기·따뜻/차가움) 살짝 다르게
          pstones+='<span class="pk-pstone" style="left:'+cl+'%;top:'+ct+'%;filter:brightness('+br+') sepia('+sep+') hue-rotate('+hue+'deg);">'+stoneSvg({h:S(s)})+'</span>'; }
        pstones+='<span class="pk-pstone pk-frogrock" style="left:-4%;top:48%;z-index:4;">'+stoneSvg({h:S(19)})+'</span>';
        // 🐸 청개구리 — 큰돌 위 대기 → 다이빙 → 반대편까지 헤엄 → 턴 → 되돌아와 돌 위 복귀·대기 반복(경로 pkfrog + 자세 pkfrogb 2겹)
        pstones+='<span class="pk-frog"><span class="frog-b">'+frogSvg({h:S(10)})+'</span></span>';
      } else {
      const PSN=11; for(let i=0;i<PSN;i++){ const a=(i/PSN)*Math.PI*2, rr=53+pkRand(i,81)*3,
        cl=(50+Math.cos(a)*rr).toFixed(1), ct=(50+Math.sin(a)*(rr-3)).toFixed(1), s=Math.round(8+pkRand(i,82)*5);
        pstones+='<span class="pk-pstone" style="left:'+cl+'%;top:'+ct+'%;">'+stoneSvg({h:S(s)})+'</span>'; }
      }
      const LPOS=[[32,58],[66,42]]; let lilies=''; for(let i=0;i<2;i++){ const dur=(4+pkRand(i,91)*2).toFixed(1), del=(-pkRand(i,92)*4).toFixed(2);
        lilies+='<span class="pk-lily" style="left:'+LPOS[i][0]+'%;top:'+LPOS[i][1]+'%;--d:'+dur+'s;animation-delay:'+del+'s;">'+lilyPadSvg({h:S(14)})+'</span>'; }
      const LOPOS=[[58,64],[38,34]]; let lotuses=''; for(let i=0;i<2;i++){ const dur=(4.6+pkRand(i,93)*2).toFixed(1), del=(-pkRand(i,94)*4).toFixed(2);
        lotuses+='<span class="pk-lotus" style="left:'+LOPOS[i][0]+'%;top:'+LOPOS[i][1]+'%;--d:'+dur+'s;animation-delay:'+del+'s;">'+lotusSvg({h:S(13)})+'</span>'; }
      // 💧 v2 물반짝(픽셀 트윙클, currentColor) — 잉어·연꽃 부유에 반짝임 한 겹 더(다층 모션 원칙)
      let wsparks=''; if(_pkV2){ const WS=[[30,34],[62,50],[44,70]]; for(let i=0;i<3;i++){ const del=(pkRand(i,231)*2.4).toFixed(2);
        wsparks+='<span class="pk-star pk-wspark" style="left:'+WS[i][0]+'%;top:'+WS[i][1]+'%;animation-delay:'+del+'s;color:#eaf8ff">'+sparkSvg({h:S(7)})+'</span>'; } }
      pond='<div class="pk-pond"><div class="pk-pwater"></div>'+pkoi+lilies+lotuses+pstones+wsparks+'</div>';
      }
      // ⛰️ 아이콘 뒤 빈 하늘 채우기 — 지평선 먼 언덕(노을 보랏빛). 중앙은 낮게 두어 지는 해가 위로 보이게.
      let hills=''; const HX=[16,50,84], HH=[26,20,24]; for(let i=0;i<3;i++){
        hills+='<span class="pk-hill" style="left:'+HX[i]+'%;bottom:-2px;z-index:0;">'+hillSvg(HILL_SUNSET,{h:S(HH[i])})+'</span>'; }
      // 🍁 고추잠자리(나비 대신) — 갯수 줄임(6→3)
      let dflies=''; { const P=pkSlots(3,640); for(let i=0;i<3;i++){ const o=P[i], b=(26+(1-o.yy)*44).toFixed(1),   // 🍁 고추잠자리 3 — 그리드 균일+원근
        hh=Math.round((10+pkRand(i,63)*4)*(0.72+o.yy*0.55)), dur=(6.5+pkRand(i,64)*5).toFixed(1), del=(-pkRand(i,65)*8).toFixed(2);
        let _s=90; const rnd=function(){ return pkRand(i,_s++); };
        dflies+='<span class="pk-dfly" style="left:'+o.x+'%;bottom:'+b+'%;--d:'+dur+'s;animation-delay:'+del+'s;'+bflyDriftVars(rnd)+'"><span class="df-body">'+dragonflySvg({h:S(hh)})+'</span></span>'; } }
      // 🍁 살랑살랑 내려오는 단풍잎 — 위에서 떨어지며 좌우로 흔들림(제각각 위치·속도·회전)
      let leaves=''; const LN=8; for(let i=0;i<LN;i++){ const l=((i+0.5)/LN*90+5+(pkRand(i,201)-0.5)*(80/LN)).toFixed(1), d=pkRand(i,208), dur=(7+d*6).toFixed(1),   // 🍁 낙엽 — 가로 n열 균일 + 깊이별 크기·낙하속도(뒤=작고 느림)
        del=(-pkRand(i,203)*10).toFixed(2), sw=(2.4+pkRand(i,204)*1.6).toFixed(1), hh=Math.round((9+pkRand(i,205)*5)*(0.72+(1-d)*0.5)), dir=(pkRand(i,206)<0.5?-1:1);
        leaves+='<span class="pk-fallleaf" style="left:'+l+'%;--d:'+dur+'s;--sw:'+sw+'s;--dir:'+dir+';animation-delay:'+del+'s;"><span class="fl-in">'+mapleLeafSvg({h:S(hh)}, LEAF_COLS[Math.floor(pkRand(i,207)*LEAF_COLS.length)])+'</span></span>'; }
      // ☀️ 배너에서만 지는 해가 기본으로 떠오름. reveal(10연차)은 '기본 미표시'(사용자 지침) — 무지개 조건일 때만 tenSkyRiseSun으로 띄운다.
      const risesun = reveal ? '' : ('<span class="pk-risesun">'+sunSvg({h:S(64)})+'</span>');
      _sunsetCache[ck]='<div class="pkscene pk-sunset'+(reveal?' pk-reveal':'')+(_pkV2?' pk-v2':'')+'" aria-hidden="true">'+
        '<div class="pk-sky">'+risesun+clouds+'</div>'+
        '<div class="pk-horizon">'+hills+farline+'</div>'+
        '<div class="pk-field">'+pkGrassDiv('sunset')+soil+tufts+flowers+trees+pond+'</div>'+
        '<div class="pk-air">'+dflies+leaves+'</div>'+
      '</div>';
      return _sunsetCache[ck];
    }
    // 🌙 무지개 밤 씬 — 픽업 씬 틀 그대로, 밤·달빛으로 재색·재배치(보름달·달빛구름·잔별·밤 뜰·반딧불 가득). 무지개알 센터피스는 배너 빌더에서.
    let _nightCache={};   // mode별 캐시(banner/reveal)
    function nightSceneHtml(mode){
      mode=mode||'banner'; const nk=(_pkV2?'v2|':'')+mode; if(_nightCache[nk]) return _nightCache[nk];   // v2 캐시 키 분리
      const reveal=mode==='reveal', sz=reveal?1.8:1, S=function(h){ return Math.max(1,Math.round(h*sz)); };   // reveal(10뽑 전체화면)은 스프라이트 크게
      const moon='<span class="pk-moon">'+moonSvg({h:S(62)})+'</span>';   // 🌕 상단 보름달
      let stars=''; for(let i=0;i<pkCount(12);i++){ const l=(4+pkRand(i,101)*92).toFixed(1), t=(3+pkRand(i,102)*30).toFixed(1), s=Math.round(4+pkRand(i,103)*5), del=(pkRand(i,104)*3).toFixed(2);
        stars+='<span class="pk-star" style="left:'+l+'%;top:'+t+'%;animation-delay:'+del+'s">'+nightStarSvg({h:S(s)})+'</span>'; }
      let clouds=''; const NC=['mw','mb','md']; for(let i=0;i<pkCount(11);i++){ const y=(3+pkRand(i,111)*30).toFixed(1), hh=Math.round(11+pkRand(i,112)*15), w=Math.floor(pkRand(i,113)*3), tn=NC[Math.floor(pkRand(i,114)*3)], dur=(34+pkRand(i,115)*44).toFixed(1);
        clouds+='<span class="pk-cloud" style="top:'+y+'%;--d:'+dur+'s;--i:'+i+'">'+moonCloudSvg(w,tn,{h:S(hh)})+'</span>'; }
      const NF=['a','b','c']; let farline='';
      for(let i=0;i<20;i++){ const l=((i+0.5)/20*100).toFixed(1), bot=(-1-pkRand(i,121)*3).toFixed(1), k=pkRand(i,122), r=pkRand(i,123);
        if(k<0.40) farline+='<span class="pk-tree pk-far" style="left:'+l+'%;bottom:'+bot+'px;z-index:1;--i:'+i+'"><span class="pk-canopy">'+nightPineSvg({h:S(Math.round(11+r*8))})+'</span></span>';
        else if(k<0.66) farline+='<span class="pk-tuft pk-far" style="left:'+l+'%;bottom:'+bot+'px;--i:'+i+'">'+nightTuftSvg({h:S(Math.round(6+r*3))})+'</span>';
        else farline+='<span class="pk-flower pk-far" style="left:'+l+'%;bottom:'+bot+'px;--i:'+i+'">'+nightFlowerSvg(NF[Math.floor(pkRand(i,124)*3)],{h:S(Math.round(7+r*3))})+'</span>'; }
      // 🌲 가까운 나무 5그루 — 중앙(아이콘) 회피: 좌 2·우 2 + 우측 앞 1
      const TL=[10,30,50,70,90], TD=[0.46,0.7,0.8,0.7,0.46];
      let trees=''; for(let i=0;i<5;i++){ const d=TD[i], l=(TL[i]+(pkRand(i,132)-0.5)*5).toFixed(1),
        sc=1-d*0.5, bot=(d*70).toFixed(1), z=Math.round(2+(1-d)*2);
        const canopy=(i%2?nightPineSvg({h:S(Math.max(18,Math.round(50*sc)))}):nightTreeSvg({h:S(Math.max(18,Math.round(50*sc)))}));
        trees+='<span class="pk-tree" style="left:'+l+'%;bottom:'+bot+'%;z-index:'+z+';--i:'+i+'"><span class="pk-canopy">'+canopy+'</span><span class="pk-trunk">'+pxSvg(_pkV2?M2_TRUNK:M_TRUNK, TREE_NIGHT, {h:S(Math.max(8,Math.round(22*sc)))})+'</span></span>'; }
      let flowers=''; for(let i=0;i<16;i++){ const d=pkRand(i,141)*0.6, l=(5+(i+0.5)/16*88+(pkRand(i,142)-0.5)*3.5).toFixed(1), sc=1-d*0.5, bot=(d*76).toFixed(1);
        flowers+='<span class="pk-flower pk-nflower" style="left:'+l+'%;bottom:'+bot+'%;--i:'+i+'">'+nightFlowerSvg(NF[Math.floor(pkRand(i,143)*3)],{h:S(Math.max(9,Math.round(16*sc)))})+'</span>'; }
      const NTf=pkCount(16); let tufts=''; for(let i=0;i<NTf;i++){ const d=pkRand(i,151)*0.8, l=(2+(i+0.5)/NTf*94+(pkRand(i,152)-0.5)*3.5).toFixed(1), sc=1-d*0.5, bot=(d*80).toFixed(1);
        tufts+='<span class="pk-tuft" style="left:'+l+'%;bottom:'+bot+'%;--i:'+i+'">'+nightTuftSvg({h:S(Math.max(7,Math.round(12*sc)))})+'</span>'; }
      let soil=''; for(let i=0;i<7;i++){ const d=pkRand(i,161)*0.7, l=(6+(i+0.5)/7*80+(pkRand(i,162)-0.5)*4).toFixed(1), sc=1-d*0.45, bot=(d*72).toFixed(1), w=Math.round((10+pkRand(i,163)*14)*sc*sz);
        soil+='<span class="pk-soil" style="left:'+l+'%;bottom:'+bot+'%;width:'+w+'px"></span>'; }
      let stones=''; for(let i=0;i<6;i++){ const d=pkRand(i,171)*0.6, l=(10+pkRand(i,172)*80).toFixed(1), sc=1-d*0.4, bot=(d*66).toFixed(1);
        stones+='<span class="pk-stone" style="left:'+l+'%;bottom:'+bot+'%;--i:'+i+'">'+nightStoneSvg({h:S(Math.max(6,Math.round(11*sc)))})+'</span>'; }
      let fires=''; { const NFI=pkCount(18), P=pkSlots(NFI,170); for(let i=0;i<NFI;i++){ const o=P[i], b=(13+(1-o.yy)*63).toFixed(1),   // ✨ 반딧불 — 그리드 균일+원근(캠 전체)
        hh=Math.round((8+pkRand(i,183)*4)*(0.70+o.yy*0.56)), dur=(6+pkRand(i,184)*6).toFixed(1), del=(-pkRand(i,185)*8).toFixed(2), bd=(0.9+pkRand(i,186)*1.6).toFixed(2);
        let _s=190; const rnd=function(){ return pkRand(i,_s++); };
        fires+='<span class="pk-fire" style="left:'+o.x+'%;bottom:'+b+'%;--d:'+dur+'s;--bd:'+bd+'s;animation-delay:'+del+'s;'+bflyDriftVars(rnd)+'"><span class="ff-core">'+fireflySvg({h:S(hh)})+'</span></span>'; } }
      // ⛰️ 아이콘 뒤 빈 하늘 채우기 — 지평선 먼 언덕(짙은 청록)
      let hills=''; const HX=[18,50,82], HH=[26,24,28]; for(let i=0;i<3;i++){
        hills+='<span class="pk-hill" style="left:'+HX[i]+'%;bottom:-2px;z-index:0;">'+hillSvg(HILL_NIGHT,{h:S(HH[i])})+'</span>'; }
      // 🌠 별똥별(무지개 코멧) — 배너에서만 계속. 랜덤으로 절반은 앞(전체화면 좌상단끝→우하단끝), 절반은 뒤(멀리 산 뒤쪽 좌상단만 짧게, 하늘밴드 안·산에 가림). reveal은 tenSkyShoot(단발) 담당.
      // 배너·10연차 reveal 공용. reveal은 전체화면이라 sz배율로 크게·멀리(전체 대각선 커버).
      let shootFront='', shootBehind=''; for(let i=0;i<6;i++){
        const behind=pkRand(i,197)<0.5, top=(0+pkRand(i,190)*(behind?10:12)).toFixed(1), left=(-8+pkRand(i,191)*(behind?12:8)).toFixed(1),
          dur=(6.5+pkRand(i,192)*3.5).toFixed(1), del=(i*1.3+pkRand(i,193)*1.1).toFixed(2);
        if(behind){ const hh=S(Math.round(15+pkRand(i,194)*8)), tx=Math.round((300+pkRand(i,195)*90)*sz), ty=Math.round((38+pkRand(i,196)*38)*sz);   // 좌상단→오른쪽 끝 산 위쪽까지(멀리·작게·높게 유지, 산 뒤로 사라짐) — tx/ty는 씬 배율 sz로 확대
          const rot=Math.round(Math.atan2(ty,tx)*180/Math.PI-45);   // 🌠 코멧 디자인은 45° ↘ 고정 → 실제 이동각(거의 수평)에 맞게 스프라이트를 회전(머리·꼬리 방향 정합)
          shootBehind+='<span class="pk-shoot pk-shoot-far" style="top:'+top+'%;left:'+left+'%;--d:'+dur+'s;--tx:'+tx+'px;--ty:'+ty+'px;--rot:'+rot+'deg;animation-delay:'+del+'s;">'+shootStarSvg({h:hh})+'</span>';
        } else { const hh=S(Math.round(26+pkRand(i,194)*16)), tx=Math.round((340+pkRand(i,195)*150)*sz), ty=Math.round((220+pkRand(i,196)*110)*sz);   // 전체화면 대각선 코너까지
          shootFront+='<span class="pk-shoot" style="top:'+top+'%;left:'+left+'%;--d:'+dur+'s;--tx:'+tx+'px;--ty:'+ty+'px;animation-delay:'+del+'s;">'+shootStarSvg({h:hh})+'</span>'; } }
      _nightCache[nk]='<div class="pkscene pk-night'+(reveal?' pk-reveal':'')+(_pkV2?' pk-v2':'')+'" aria-hidden="true">'+
        '<div class="pk-sky">'+moon+stars+clouds+shootBehind+'</div>'+
        '<div class="pk-horizon">'+hills+farline+'</div>'+
        '<div class="pk-field">'+pkGrassDiv('night')+soil+stones+tufts+flowers+trees+'</div>'+
        '<div class="pk-air">'+fires+'</div>'+shootFront+
      '</div>';
      return _nightCache[nk];
    }
    // (구 roomBackdropHtml 제거 — 신화·한정 등장만 픽업 배너 씬 배경(전설 제외). 배경은 pickupSceneHtml('reveal').)
    // 등급 '이름' 라벨을 등급 색으로(펫 이름이 아니라 등급명). 한정(exclusive)=무지개(.tier-rainbow), 그 외=인라인 색(신화=#ff5fa2 등). 도감 등급 헤더 등 공용.
    function tierLabelHtml(tierId){ const ti=tierInfo(tierId); const nm=escapeHtml(ti.name);
      if(tierId==='exclusive') return '<span class="tier-rainbow">'+nm+'</span>';
      return '<span style="color:'+(tierId==='normal'?'var(--text)':ti.color)+'">'+nm+'</span>'; }
    // 고양이 이름 변경(개별) — owned.cats[id].name에 저장. 등급색은 catNameSpan로 유지.
    function openRenameCat(id){
      closeRename();
      const wrap=document.createElement('div'); wrap.id='renameCat'; wrap.className='gimenu-scrim';
      wrap.onclick=function(e){ if(e.target===wrap) closeRename(); };
      wrap.innerHTML='<div class="gimenu"><div class="gih">'+catFace(id,{h:34})+'<b>이름 짓기</b></div>'+
        '<input class="input" id="renameInput" maxlength="12" value="'+escapeHtml(catName(id))+'" placeholder="고양이 이름(최대 12자)" style="width:100%;box-sizing:border-box;margin-bottom:4px;">'+
        '<button class="gib sell" '+App.view.act('saveRenameCat',id)+'><b>저장</b></button>'+
        '<button class="gib ghost" '+App.view.act('closeRename')+'>취소</button></div>';
      document.body.appendChild(wrap);
      setTimeout(function(){ const i=$('renameInput'); if(i){ i.focus(); i.select(); } }, 40);
    }
    function closeRename(){ const m=$('renameCat'); if(m) m.remove(); }
    function saveRenameCat(id){
      const v=((val('renameInput')||'').trim()).slice(0,12);
      gameRef().transaction(g=>{ g=normalizeGame(g); if(!g.owned.cats[id]) return g; if(v) g.owned.cats[id].name=v; else delete g.owned.cats[id].name; return g; })
        .then(r=>{ if(r&&r.committed){ toast(v?('이름: '+v):'기본 이름으로'); if($('petInfo')) setTimeout(function(){ if($('petInfo')) openPetInfo(id); }, 250); } });   // 상세 열려 있으면 이름 갱신
      closeRename();
    }
    // 🐾 펫 상세 시트 — 등급·애정 진행·획득일·종·방 상태를 한곳에. 탭=배치는 유지하고 카드 ⓘ로 진입. 여기서 쓰다듬기도 가능.
    function fmtDate(iso){ try{ const d=new Date(iso); if(isNaN(d)) return ''; return d.getFullYear()+'.'+(d.getMonth()+1)+'.'+d.getDate(); }catch(e){ return ''; } }
    // 🖼️ 펫 south 스프라이트 콘텐츠 bbox(투명 여백 제외) 프래션 측정·캐시 — 펫 정보 히어로에서 여백을 크롭해 크게 보이게.
    const _petBBox={};
    function measureBBox(id, cb){
      if(_petBBox[id]){ cb&&cb(_petBBox[id]); return; }
      const sp=PET_SPRITES[id]; if(!sp){ cb&&cb(null); return; }
      if(sp.runtime && sp.needArt && !sp.urls){ cb&&cb(null); return; }   // 아트 로딩 전엔 측정 안 함
      const img=new Image(); img.crossOrigin='anonymous';
      img.onload=function(){ try{
        const w=img.naturalWidth||img.width, h=img.naturalHeight||img.height;
        const cv=document.createElement('canvas'); cv.width=w; cv.height=h; const cx=cv.getContext('2d');
        cx.drawImage(img,0,0); const d=cx.getImageData(0,0,w,h).data;
        let l=w,r=-1,t=h,b=-1;
        for(let y=0;y<h;y++){ for(let x=0;x<w;x++){ if(d[(y*w+x)*4+3]>16){ if(x<l)l=x; if(x>r)r=x; if(y<t)t=y; if(y>b)b=y; } } }
        if(r<0){ cb&&cb(null); return; }
        const bb={ cw:(r-l+1)/w, ch:(b-t+1)/h, cx:((l+r+1)/2)/w, cy:((t+b+1)/2)/h };
        _petBBox[id]=bb; cb&&cb(bb);
      }catch(e){ cb&&cb(null); } };
      img.onerror=function(){ cb&&cb(null); };
      img.src=sprStill(id,'south');
    }
    const PI_PET_BOX=76;   // 펫 정보 히어로 박스 px(CSS .pi-pet과 동기)
    // 히어로 펫 마크업 — 스프라이트=원본 img(로드 후 _piFitPet이 bbox 크롭 배치), 런타임 로딩 전·SVG 폴백은 크롭 없이 크게.
    function piPetHtml(id){
      const pr=(typeof petDyePair==='function')?petDyePair(id):{d1:0,d2:0,tint:0};   // 🎨 염색+틴트 베이크 반영
      if(hasSprite(id)){ const sp=PET_SPRITES[id];
        if(sp.runtime && !sp.urls) return '<div class="pi-pet pi-pet-svg">'+catFace(id,{h:PI_PET_BOX-10})+'</div>';   // 아트 로딩 전 폴백
        return '<div class="pi-pet"><img class="pi-petimg" id="piPetImg" src="'+dyedUrl(id,sprStill(id,'south'),pr.d1,pr.d2,pr.tint)+'" alt=""></div>';
      }
      return '<div class="pi-pet pi-pet-svg">'+catFace(id,{h:PI_PET_BOX-12})+'</div>';   // SVG 폴백 펫
    }
    // 렌더 후: bbox를 박스 94%로 채우고 콘텐츠 중심을 박스 중심에 정렬(여백 크롭). 측정 실패 시 CSS 기본(76px 무크롭) 유지.
    function _piFitPet(id){
      if(!hasSprite(id)) return;
      measureBBox(id, function(bb){ if(!bb) return; const img=document.getElementById('piPetImg'); if(!img) return;
        const B=PI_PET_BOX, bigger=Math.max(bb.cw, bb.ch)||0.5, N=B*0.94/bigger;
        img.style.width=N+'px'; img.style.height=N+'px';
        img.style.left=(B/2 - bb.cx*N)+'px'; img.style.top=(B/2 - bb.cy*N)+'px';
      });
    }
    // 💗 펫별 동적 모션 해금 사다리(가변 모션, 2026-07-10) — 이 펫이 실제 보유한 클립을 petClipAff(펫별 레벨, Lv1 보장 시프트)로
    //   그룹핑해 "Lv1 유휴·먹기(해금) · Lv2 질주(잠김)…" 식으로 표기. 펫마다 모션 구성이 제각각(개과=idle·bark, 구미호=run·jump·belly…)이라 하드코딩 금지.
    const CLIP_KO={ idle:'유휴', sit:'앉기', belly:'식빵', eat:'먹기', drink:'마시기', yawn:'하품', angry:'하악질',
      run:'질주', jump:'점프', bark:'멍멍', sleep:'낮잠', knead:'꾹꾹이', paw:'톡톡', eyetrack:'물끄러미', stretch:'기지개', scratch:'스크래칭', wiggle:'실룩' };
    function petAffLadderHtml(id, myLv){
      const sp=PET_SPRITES[id]; if(!(sp&&sp.clips)) return '';
      const m=(typeof petClipAff==='function')?petClipAff(id):{};
      const byLv={};
      Object.keys(m).forEach(k=>{ (byLv[m[k]]=byLv[m[k]]||[]).push(k); });
      const lvs=Object.keys(byLv).map(Number).sort((a,b)=>a-b);
      if(!lvs.length) return '';
      const parts=lvs.map(lv=>'Lv'+lv+' '+byLv[lv].map(k=>CLIP_KO[k]||k).join('·')+(myLv>=lv?'(해금)':'(잠김)'));
      return '<div class="pi-cd">모션 해금 — '+parts.join(' · ')+'</div>';
    }
    function openPetInfo(id){ if(!ownsCat(id)) return;
      let wrap=$('petInfo');
      if(!wrap){ wrap=document.createElement('div'); wrap.id='petInfo'; wrap.className='gimenu-scrim';
        wrap.onclick=function(e){ if(e.target===wrap) closePetInfo(); }; document.body.appendChild(wrap); }
      wrap.dataset.pet=id;   // 🎨 염색 베이크 완료 시 히어로 이미지 힐(_petArtRerenderNow)에서 현재 펫 식별
      wrap.innerHTML='<div class="gimenu petinfo">'+petInfoBody(id)+'</div>';
      _piFitPet(id); }   // 🖼️ 히어로 펫 여백 크롭 배치(bbox 측정 후)
    function closePetInfo(){ const m=$('petInfo'); if(m) m.remove(); }
    // 💗 코스메틱 장착/해제 — 펫별 슬롯이 애정 레벨로 열리고(effects=Lv3·hat=Lv5, 레벨 파생 — 별도 저장 없음),
    //    장착하려면 그 아이템을 "보유"해야 한다(owned.hats/petfx — 이벤트·쿠폰·선물함·뽑기 획득). 레벨만으론 아무것도 못 씀(사용자 지침).
    function cosmNeedLv(slot){ return slot==='hat'?5:3; }
    function cosmOwns(slot, val){ return slot==='hat'?ownsHat(val):ownsPetfx(val); }
    function setPetCosm(id, slot, val){
      if(!ownsCat(id) || (slot!=='hat'&&slot!=='buddy')) return;
      if(val && slot==='hat' && !HAT_CATALOG[val]) return;
      if(val && slot==='buddy' && !BUDDY_CATALOG[val]) return;
      const tier=CAT_TIER[id]||'normal';
      if(val && affectionLevel((ownedCatsMap()[id]||{}).affection, tier).level<cosmNeedLv(slot)){ toast('애정 Lv'+cosmNeedLv(slot)+'에 슬롯이 열려요', true); return; }
      if(val && !(slot==='hat'?ownsHat(val):ownsPetfx(val))){ toast((slot==='hat'?'모자':'펫효과')+' 미보유 — 무지개박스·이벤트에서 획득하세요', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); const c=g.owned.cats[id]; if(!c) return;
        if(val && affectionLevel(c.affection, tier).level<cosmNeedLv(slot)) return;   // 서버 기준 재검증
        if(val && !(slot==='hat'?(g.owned.hats&&g.owned.hats[val]):(g.owned.petfx&&g.owned.petfx[val]))) return;   // 보유 재검증
        const m=(c.cosm&&typeof c.cosm==='object')?c.cosm:{};
        if(val) m[slot]=val; else delete m[slot];
        c.cosm=m; return g;
      }).then(r=>{ if(r&&r.committed){ if($('petInfo')) openPetInfo(id); if(state._sheetRefresh) state._sheetRefresh(); } });   // 캠 반영은 game 리스너(cosmSig 서명)가 리빌드
    }
    // 🔒 라인 자물쇠·해제 아이콘(기능 아이콘=라인 규칙)
    function piLockSvg(){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'; }
    function piNoneSvg(){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M7 17L17 7"/></svg>'; }
    function piCaretSvg(){ return '<svg class="pi-car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>'; }
    // 💗 펫장비(모자)·펫효과(버디) 슬롯 버튼 — 애정 레벨로 잠금/해제. 해제 시 탭하면 보유 인벤토리 피커(openPetPicker)를 열어 장착.
    function piCosmBtn(id, slot, lv){
      const need=cosmNeedLv(slot), un=lv>=need, cosm=petCosm(id), cur=cosm[slot];
      const label=slot==='hat'?'펫장비':'펫효과';
      const CAT=slot==='hat'?HAT_CATALOG:BUDDY_CATALOG;
      const artIc = cur ? (slot==='hat'?hatSvg(cur,{h:16}):buddySvgOf(cur,{h:15})) : '';
      if(!un) return '<button class="pi-slot lock" disabled><span class="pi-sl-ic">'+piLockSvg()+'</span>'+
        '<span class="pi-sl-tx"><b>'+label+'</b><span class="s">애정 Lv'+need+'에 열려요</span></span></button>';
      return '<button class="pi-slot" onclick="openPetPicker(\''+id+'\',\''+slot+'\')"><span class="pi-sl-ic'+(cur?' has':'')+'">'+(cur?artIc:piNoneSvg())+'</span>'+
        '<span class="pi-sl-tx"><b>'+label+'</b><span class="s">'+(cur?escapeHtml(CAT[cur]||cur):'없음 · 탭해서 장착')+'</span></span>'+piCaretSvg()+'</button>';
    }
    // 🧺 소비템 슬롯 버튼 — 탭하면 이 펫에게 쓸 수 있는 보유 소비템 인벤토리(츄르·염색약·리무버)를 열어 사용.
    function piConsumBtn(id){
      const t=consumQty('treat'), dy=consumQty('dye'), rm=(petDyeOf(id)?consumQty('dye_remover'):0);
      const parts=[]; if(t>0) parts.push('츄르 '+t); if(dy>0) parts.push('염색약 '+dy); if(rm>0) parts.push('리무버 '+rm);
      const sub = parts.length ? parts.join(' · ') : '보유 소비템 없음';
      return '<button class="pi-slot" onclick="openPetPicker(\''+id+'\',\'consum\')"><span class="pi-sl-ic">'+consumSvg('treat',{h:16})+'</span>'+
        '<span class="pi-sl-tx"><b>소비템</b><span class="s">'+sub+'</span></span>'+piCaretSvg()+'</button>';
    }
    // 🎒 보유 아이템 인벤토리 피커(펫 정보 위에 스택) — 보유한 것만 노출, 탭해서 장착/사용. kind='hat'|'buddy'|'consum'.
    function openPetPicker(id, kind){ if(!ownsCat(id)) return;
      let w=$('petPicker'); if(!w){ w=document.createElement('div'); w.id='petPicker'; w.className='gimenu-scrim pp-scrim';
        w.onclick=function(e){ if(e.target===w) closePetPicker(); }; document.body.appendChild(w); }
      w.innerHTML='<div class="gimenu petpick">'+petPickerBody(id,kind)+'</div>'; }
    function closePetPicker(){ const m=$('petPicker'); if(m) m.remove(); }
    function petPickerBody(id, kind){
      const closeBtn='<button class="cn-edit pi-close" aria-label="닫기" onclick="closePetPicker()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
      if(kind==='consum'){
        const items=[];
        if(consumQty('treat')>0) items.push({k:'treat',n:'츄르',d:'애정 +1',q:consumQty('treat')});
        if(consumQty('dye')>0)   items.push({k:'dye',n:'염색약',d:'몸·얼룩 랜덤',q:consumQty('dye')});
        if(consumQty('tint')>0)  items.push({k:'tint',n:'틴트',d:'눈코입 살짝',q:consumQty('tint')});
        if(petHasDye(id)&&consumQty('dye_remover')>0) items.push({k:'dye_remover',n:'염색 리무버',d:'골라서 복원',q:consumQty('dye_remover')});
        const cells=items.map(function(it){ return '<button class="pp-cell" onclick="pickConsum(\''+id+'\',\''+it.k+'\')"><span class="pp-art">'+consumSvg(it.k,{h:26})+'</span><span class="pp-nm">'+it.n+'</span><span class="pp-sub">'+it.d+'</span><span class="pp-qty">보유 '+it.q.toLocaleString()+'</span></button>'; }).join('');
        const empty = items.length?'':'<div class="pp-empty">이 펫에게 쓸 소비템이 없어요<br><span>츄르·염색약·틴트를 알뜰샵·이벤트로 얻어요</span></div>';
        return '<div class="gih pp-h"><b>소비템 사용</b>'+closeBtn+'</div><div class="pp-grid">'+cells+'</div>'+empty;
      }
      if(kind==='dyezone'){   // 🎨 2색 염색 영역 선택 — 펫 정보 위 피커 안에서 바탕색(몸)/얼룩을 고른다(각각 현재 색 스와치 표시).
        const d1=petDyeOf(id), d2=petDye2Of(id), q=consumQty('dye');
        const sw=function(cur){ return '<span class="pp-art pp-dye" style="background:'+dyeSwatchCss(cur)+';"></span>'; };
        const zc=function(zone,label,cur){ return '<button class="pp-cell'+(q<=0?' dis':'')+'"'+(q>0?' onclick="pickDyeZone(\''+id+'\',\''+zone+'\')"':' disabled')+'>'+sw(cur)+'<span class="pp-nm">'+label+'</span><span class="pp-sub">'+(cur?escapeHtml(dyeNameOf(cur)):'기본 톤')+'</span></button>'; };
        const back='<button class="pp-cell pp-back" onclick="openPetPicker(\''+id+'\',\'consum\')"><span class="pp-art pp-none">'+piNoneSvg()+'</span><span class="pp-nm">← 뒤로</span></button>';
        return '<div class="gih pp-h"><b>어디를 염색할까요?</b>'+closeBtn+'</div>'+
          '<div class="pp-note">염색약 1개로 고른 영역만 <b>랜덤 색</b>이 돼요 · 보유 '+q.toLocaleString()+'</div>'+
          '<div class="pp-grid">'+zc('body','바탕색 (몸)',d1)+zc('accent','얼룩',d2)+back+'</div>';
      }
      if(kind==='dyezone_rm'){   // 🧴 지우기 영역 선택 — 리무버 1개=한 영역(몸·얼룩·틴트). 적용된 영역만 활성.
        const q=consumQty('dye_remover'), Z=[['body','바탕색 (몸)','🎨',petDyeOf(id)],['accent','얼룩','🎨',petDye2Of(id)],['tint','틴트 (눈코입)','👁️',petTintOf(id)]];
        const sw=function(cur){ return '<span class="pp-art pp-dye" style="background:'+dyeSwatchCss(cur)+';"></span>'; };
        const zc=function(zone,label,ic,cur){ const on=!!cur, ok=on&&q>0; return '<button class="pp-cell'+(ok?'':' dis')+'"'+(ok?' onclick="pickDyeZoneRemove(\''+id+'\',\''+zone+'\')"':' disabled')+'>'+sw(cur)+'<span class="pp-nm">'+label+'</span><span class="pp-sub">'+(on?ic+' '+escapeHtml(dyeNameOf(cur)):'미적용')+'</span></button>'; };
        const back='<button class="pp-cell pp-back" onclick="openPetPicker(\''+id+'\',\'consum\')"><span class="pp-art pp-none">'+piNoneSvg()+'</span><span class="pp-nm">← 뒤로</span></button>';
        return '<div class="gih pp-h"><b>무엇을 지울까요?</b>'+closeBtn+'</div>'+
          '<div class="pp-note">리무버 1개로 고른 것만 <b>원래대로</b> 복원 · 보유 '+q.toLocaleString()+'</div>'+
          '<div class="pp-grid">'+Z.map(function(z){ return zc(z[0],z[1],z[2],z[3]); }).join('')+back+'</div>';
      }
      const slot=kind, CAT=slot==='hat'?HAT_CATALOG:BUDDY_CATALOG, cosm=petCosm(id), cur=cosm[slot];
      const owns=function(k){ return cosmOwns(slot,k); };
      const art=function(k){ return slot==='hat'?hatSvg(k,{h:26}):buddySvgOf(k,{h:24}); };
      const ownedKeys=Object.keys(CAT).filter(owns);
      const noneCell='<button class="pp-cell'+(!cur?' on':'')+'" onclick="pickCosm(\''+id+'\',\''+slot+'\',\'\')"><span class="pp-art pp-none">'+piNoneSvg()+'</span><span class="pp-nm">없음</span></button>';
      const cells=noneCell+ownedKeys.map(function(k){ return '<button class="pp-cell'+(cur===k?' on':'')+'" onclick="pickCosm(\''+id+'\',\''+slot+'\',\''+k+'\')"><span class="pp-art">'+art(k)+'</span><span class="pp-nm">'+escapeHtml(CAT[k])+'</span></button>'; }).join('');
      const empty=ownedKeys.length?'':'<div class="pp-empty">보유한 '+(slot==='hat'?'펫장비':'펫효과')+'가 없어요<br><span>무지개박스·이벤트·쿠폰으로 얻어요(한정)</span></div>';
      return '<div class="gih pp-h"><b>'+(slot==='hat'?'펫장비 선택':'펫효과 선택')+'</b>'+closeBtn+'</div><div class="pp-grid">'+cells+'</div>'+empty;
    }
    function pickCosm(id, slot, val){ closePetPicker(); setPetCosm(id, slot, val||null); }   // setPetCosm이 커밋 후 openPetInfo 재렌더
    function pickConsum(id, item){ if(item==='dye'){ openPetPicker(id,'dyezone'); return; }   // 🎨 염색약=피커 안에서 영역(바탕/얼룩) 선택 단계로 전환(닫지 않음)
      if(item==='dye_remover'){ openPetPicker(id,'dyezone_rm'); return; }   // 🧴 리무버=지울 영역 선택 단계로 전환
      closePetPicker(); if(item==='treat') applyTreat(id); else if(item==='tint') applyTint(id); }   // 👁️ 틴트=눈코입에 살짝 색감
    function pickDyeZone(id, zone){ closePetPicker(); applyDyeZone(id, zone); }   // 영역 확정 → 그 영역만 랜덤 염색(applyDyeZone), 커밋 후 펫 정보 재렌더
    function pickDyeZoneRemove(id, zone){ closePetPicker(); applyDyeZoneRemove(id, zone); }   // 영역 확정 → 그 영역만 복원(applyDyeZoneRemove)
    function petInfoBody(id){
      const c=ownedCatsMap()[id]||{}, tier=CAT_TIER[id]||'normal';
      const aff=Number(c.affection)||0, al=affectionLevel(aff, tier);   // 💗 등급별 애정 계단(높은 등급=임계 큼)
      const roomOf=petRoomIndex(id), here=roomOf===roomIdx(), rooms=homeH().rooms||[];
      const roomNm=roomOf>=0?((rooms[roomOf]&&rooms[roomOf].name)||('방 '+(roomOf+1))):'';
      const roomTxt=here?'이 방':(roomOf>=0?roomNm:'대기 중');
      const now=Date.now(), last=Number(c.pettedAt)||0, rem=PET_COOLDOWN_MS-(now-last), canPet=rem<=0, hh=Math.ceil(Math.max(0,rem)/3600000);
      const got=c.boughtAt?fmtDate(c.boughtAt):'';
      return '<div class="gih pi-h">'+piPetHtml(id)+'<b>'+catNameSpan(id,catName(id))+'</b>'+
          '<button class="cn-edit pi-rename" aria-label="이름 짓기" '+App.view.act('openRenameCat',id)+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>'+
          '<button class="cn-edit pi-close" aria-label="닫기" '+App.view.act('closePetInfo')+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>'+
        '<div class="pi-meta"><span class="pi-tier">'+tierLabelHtml(tier)+'</span><span class="s">'+escapeHtml(speciesLabel(id))+(got?' · 획득 '+got:'')+' · '+escapeHtml(roomTxt)+'</span></div>'+
        '<div class="pi-aff"><div class="pi-afftop"><span class="clv-h">'+heartSvg({h:11})+'</span>애정 Lv.'+al.level+'<span class="s">'+(al.next!=null?aff+' / '+al.next:'만렙 ★')+'</span></div><div class="bar"><i style="width:'+al.pct+'%"></i></div></div>'+
        petAffLadderHtml(id, al.level)+   // 💗 펫별 동적 모션 해금 안내(2026-07-10 가변 모션 — 이 펫이 실제 가진 클립만 petClipAff 레벨로 그룹 표기)
        (hasSprite(id)?piCosmBtn(id,'hat',al.level)+piCosmBtn(id,'buddy',al.level):'')+   // 💗 펫장비(모자 Lv5)·펫효과(버디 Lv3) — 스프라이트 펫만. 잠금/해제는 애정 레벨, 탭하면 보유 인벤토리 피커
        (petHasDye(id)?'<div class="pi-cosm"><span class="s">염색</span>'+(petDyeOf(id)?'<span class="chip on">'+consumSvg('dye',{h:12})+' 몸 '+escapeHtml(dyeNameOf(petDyeOf(id)))+'</span>':'')+(petDye2Of(id)?'<span class="chip on">🐾 얼룩 '+escapeHtml(dyeNameOf(petDye2Of(id)))+'</span>':'')+(petTintOf(id)?'<span class="chip on">👁️ 틴트 '+escapeHtml(dyeNameOf(petTintOf(id)))+'</span>':'')+(consumQty('dye_remover')>0?'<button class="chip" '+App.view.act('openPetPicker',id,'dyezone_rm')+'>'+consumSvg('dye_remover',{h:12})+' 리무버로 지우기</button>':'<span class="s" style="min-width:0">리무버(알뜰샵 소비 탭·이벤트)로 제거 가능</span>')+'</div>':'')+   // 🎨 2색 염색+틴트 상태(몸·얼룩·눈코입) — 제거는 리무버 소모(무료 지우기 없음)
        // 🧺 소비템 — 탭하면 보유 소비템 인벤토리 피커(츄르·염색약·리무버)를 열어 이 펫에게 사용(2026-07 사용자 지시로 인벤토리 방식 개편).
        piConsumBtn(id)+
        (canPet?'<button class="gib sell" onclick="petFromInfo(\''+id+'\',event)">'+heartSvg({h:13})+' 쓰다듬기 · 애정+1 · 은화+'+PET_PET_REWARD+'</button>'
               :'<div class="pi-cd">오늘 쓰다듬기 완료 · 약 '+hh+'시간 후 가능</div>')+
        '<button class="gib" '+App.view.act('roomFromInfo',id)+'>'+(here?'이 방에서 대기시키기':'이 방으로 데려오기')+'</button>'+
        '<button class="gib ghost" '+App.view.act('closePetInfo')+'>닫기</button>';
    }
    function petFromInfo(id, ev){ const t=ev&&ev.currentTarget, b=t&&t.getBoundingClientRect?t.getBoundingClientRect():null;
      const x=b?b.left+b.width/2:innerWidth/2, y=b?b.top:innerHeight/2;
      bumpAffection(id, x, y);   // 하트·"UP!"·은화 지갑 연출 그대로
      setTimeout(function(){ if($('petInfo')) openPetInfo(id); }, 650); }   // 커밋·리스너 반영 후 상세 갱신(애정·쿨다운)
    function roomFromInfo(id){ toggleActiveCat(id); setTimeout(function(){ if($('petInfo')) openPetInfo(id); }, 400); }
    // 테스트 배정(등급당 1) — 펫알=고양이 / 랜덤박스=가구
    // @gen:pet-tier — 자동생성(tools/build_pets.py). tools/pets.json 의 tier 편집 후 재실행.
    const CAT_TIER = { cat_mackerel:'normal', cat_cheese:'normal', cat_calico:'normal', cat_black:'normal', cat_white:'normal', cat_fluffy:'normal', cat_tuxedo:'normal', cat_chaos:'normal', cat_siamese:'uncommon', cat_bengal:'normal', cat_fold:'normal', cat_bora:'epic', cat_choco:'normal', cat_kitten:'normal', cat_pink:'epic', tiger_orange:'limited', lion_mane:'limited', cat_persian:'legend', tiger_white:'limited', cat_russianblue:'normal', cat_bengal2:'uncommon', dog_mutt:'rare', cat_panther:'limited', dog_baekgu:'normal', dog_shiba:'epic', dog_corgi:'legend', dog_dalmatian:'uncommon', dog_dachshund:'epic', dog_bulldog:'normal', dog_injeolmi:'legend', dog_poodle:'rare', dog_beagle:'rare', dog_sukhee:'legend', dog_doberman:'legend', dog_pug:'legend', dog_shepherd:'legend', dog_bordercollie:'epic', dog_spitz:'normal', dog_jackrussell:'legend', dog_labrador:'epic', dog_chowchow:'epic', dog_cardigancorgi:'epic', dog_greyhound:'legend', dog_shihtzu:'uncommon', dog_stbernard:'epic', dog_bostonterrier:'rare', dog_bassethound:'legend', dog_happy:'normal', dog_welshterrier:'legend', dog_papillon:'uncommon', dog_newfoundland:'legend', dog_beardedcollie:'legend', dog_afghanhound:'legend', dog_rottweiler:'epic', dog_pointer:'epic', dog_pharaohhound:'legend', dog_westie:'normal', dog_weimaraner:'epic', dog_collie:'epic', dog_englishbulldog:'epic', dog_keeshond:'legend', dog_frenchbulldog:'epic', dog_yorkshire:'uncommon', dog_toypoodle:'uncommon', dog_sheltie:'rare', dog_minpin:'epic', dog_schnauzer:'epic', dog_goldendoodle:'uncommon', dog_bernese:'legend', dog_cavalier:'rare', dog_akita:'legend', dog_whippet:'legend', dog_oldenglishsheepdog:'epic', dog_vizsla:'epic', dog_englishsetter:'legend', dog_jindo:'limited', dog_chinesecrested:'epic', dog_scottie:'epic', dog_pomeranian:'normal', dog_sharpei:'epic', dog_greatdane:'legend', dog_bullterrier:'legend', dog_boxer:'epic', dog_ridgeback:'epic', dog_irishsetter:'epic', dog_airedale:'legend', dog_samoyed:'legend', dog_husky:'legend', cat_mackerel2:'epic', cat_calico2:'epic', cat_white2:'epic', cat_cheese2:'epic', cat_tuxedo2:'epic', cat_siamese2:'legend', cat_bengal3:'legend', cat_russianblue2:'epic', cat_scottishfold:'epic', cat_black2:'epic', cat_seolleong:'uncommon', cat_persiangray:'epic', cat_mainecoon:'legend', cat_americanshorthair:'epic', cat_ragdoll:'legend', cat_turkishangora:'epic', cat_munchkin:'epic', cat_norwegian:'epic', cat_bombay:'epic', cat_abyssinian:'epic', cat_sphynx:'legend', cat_british:'epic', cat_bengalsnow:'legend', cat_longhaircalico:'uncommon', cat_tortie:'epic', cat_siamesechoco:'epic', cat_cornishrex:'epic', cat_ocicat:'legend', cat_selkirkrex:'epic', cat_korat:'epic', cat_manx:'epic', cat_americancurl:'rare', cat_devonrex:'epic', cat_turkishvan:'epic', cat_bobtail:'epic', cat_burmese:'epic', cat_himalayan:'epic', cat_creamtabby:'rare', cat_lilac:'epic', cat_somali:'legend', cat_leopardcat:'exclusive', cat_lynx:'exclusive', cat_cheetah:'exclusive', cat_jaguar:'exclusive', cat_puma:'exclusive', cat_snowleopard:'exclusive', cat_caracal:'exclusive', cat_leopard:'exclusive', cat_blackpanther:'exclusive', cat_ocelot:'exclusive', cat_sandcat:'epic', cat_mainecoonsmoke:'legend', cat_mainecoonred:'epic', cat_bengalsilver:'epic', cat_peterbald:'legend', cat_toyger:'limited', cat_singapura:'epic', cat_havanabrown:'epic', cat_ragamuffin:'legend', fox_nine:'exclusive' };
    // @gen:end
    const ITEM_TIER = { pond:'limited', cushion:'normal', waterbowl:'normal', litterbox:'normal', plant:'normal', bowl:'uncommon', scratcher:'rare', pethouse:'epic', tower:'legend', catwheel:'limited',
      rug:'rare', fishtank:'epic', window:'legend', fireplace:'legend', fan:'legend', hammock:'legend', teaser:'legend', wallclock:'legend', hangplant:'legend', mobile:'legend', chandelier:'limited', jingleball:'legend',
      frame:'legend', shelf:'legend', mirror:'legend', neon:'legend', sconce:'legend', garland:'legend', poster:'legend', tapestry:'legend', cactus:'rare', yarnbasket:'uncommon', floorlamp:'epic', beanbag:'rare', groomstation:'uncommon', springtoy:'epic', tunnel:'rare', teepee:'rare', bookshelf:'rare', birdcage:'epic', lavalamp:'epic', laserpost:'epic', waterfountain:'epic', sofa:'rare', recordplayer:'epic', terrarium:'epic', ballpit:'legend', grandfaclock:'legend', bunkbed:'rare', crystalfountain:'limited', dartboard:'rare', cuckooclock:'epic', roundbed:'rare', donutbed:'rare', cavebed:'epic', canopybed:'legend', throne:'legend', mousetoy:'uncommon', catnippillow:'rare', puzzlefeeder:'rare', balltrack:'epic', teetertoy:'rare', bubblemachine:'epic', bonsai:'rare', globe:'epic', snowglobe:'epic', campfire:'epic', gramophone:'epic', arcademachine:'legend', jukebox:'epic', crystalcluster:'legend', easel:'rare', floorvase:'rare', suitofarmor:'legend', hourglass:'rare', telescope:'epic', gumballmachine:'rare', wallvines:'rare', pennant:'uncommon', wallmask:'rare', barometer:'epic', stringlights:'epic', wallbutterfly:'rare', cornershelf:'rare', wallsun:'epic', treatjar:'uncommon', catgrass:'rare', groomarch:'rare', heatpad:'epic', peekbox:'epic', tetherpole:'epic', windmilltoy:'rare', crinklebag:'rare', roundrug:'rare', runner:'uncommon', koipond:'legend', displaycase:'epic', woodstove:'epic', mushroomlamp:'epic', statuecat:'rare', teacart:'epic', crystaltree:'legend', treadmill:'limited', laserbot:'legend', rcmouse:'legend', slalom:'legend', sprinttrack:'epic', cucumber:'epic', milkbar:'rare', dispenser:'legend', birdfeeder:'limited', hamstercage:'legend' };   // 러그=희귀·어항=특별·창문 등 장식/벽 가구=전설. 특별↑은 아래 isGachaOnlyItem로 자동 랜덤박스 전용
    // 🪑 비(非)펫 아이템 전역 등급/가격 오버라이드 — 관리자 쓰기·전체 읽기. 미설정은 기본값(_TIER 상수/카탈로그 price).
    //   config/furniture/{id}:{tier,price} = 가구, config/wallpaper/{id} = 벽지, config/floor/{id} = 바닥 스킨.
    let _furnCfg={}, _wallCfg={}, _floorCfg={};
    const FLOOR_TIER = { wood:'epic', checker:'epic', grass:'legend', ondol:'epic', starry:'epic', sand:'legend', tatami:'epic', brickpath:'epic', carpetgray:'normal', plankwhite:'normal', pinktile:'rare', herringbone:'rare', marble:'epic', galaxy:'legend', autumn:'epic', snow:'epic', lava:'legend', clouds:'epic', sunset_field:'exclusive', rainbow_field:'exclusive', night_field:'exclusive' };   // 움직이는 들판 바닥=한정(exclusive) → 기본 박스 0.2%·무지개박스 50%로 출현(2026-07 개편 — boxPool 한정 포함)   // 바닥 스킨 등급(랜덤박스 전용). 모래사장·잔디정원=전설, 나머지=특별.
    const WALL_TIER = { brick:'epic', stripes:'epic', polkadot:'epic', woodwall:'epic', damask:'legend', sunset_sky:'exclusive', rainbow_sky:'exclusive', night_sky:'exclusive' };   // 움직이는 하늘 벽지=한정(exclusive) → 기본 박스 0.2%·무지개박스 50%로 출현(2026-07 개편 — boxPool 한정 포함)   // 벽지 등급 — 특별↑만 지정(랜덤박스 전용). 미지정 벽지는 normal(알뜰샵 구매). 새 특별↑ 벽지는 여기에 등급만 추가하면 자동 가챠 전용+박스풀 편입.
    // 🏭 비(非)펫 자산(가구/벽지/바닥) 등급·가격·가챠전용 통합 팩토리 — 3자산이 거의 같은 로직이라 테이블 1개로 묶음. 기존 함수명(effItemTier/wallBuyPrice/isGachaOnlyFloor…)은 얇은 별칭으로 유지(호출부 변경 0).
    //   cfg=전역 오버라이드(런타임 재대입되므로 게터), tierMap=기본 등급, hasDefault=무료 'default' 스킨(벽지/바닥만), devKey=devOn 로컬 오버레이 키(가구만).
    const ASSET_TYPES = {
      furniture: { cfg:function(){ return _furnCfg; }, tierMap:ITEM_TIER, hasDefault:false, devKey:'itemTier', path:'config/furniture', catalog:ITEM_CATALOG, label:'' },
      wallpaper: { cfg:function(){ return _wallCfg; }, tierMap:WALL_TIER, hasDefault:true,  devKey:null, path:'config/wallpaper', catalog:WALLPAPER_CATALOG, label:' 벽지' },
      floor:     { cfg:function(){ return _floorCfg; }, tierMap:FLOOR_TIER, hasDefault:true, devKey:null, path:'config/floor', catalog:FLOOR_CATALOG, label:' 바닥' },
    };
    function effAssetTier(type){ const A=ASSET_TYPES[type], cfg=A.cfg(), base=Object.assign({}, A.tierMap);
      if(cfg){ Object.keys(cfg).forEach(function(id){ const t=cfg[id]&&cfg[id].tier; if(t) base[id]=t; }); }
      if(A.devKey && devOn() && devCfg()[A.devKey]) Object.assign(base, devCfg()[A.devKey]);   // 개발자 로컬 오버레이(가구만)
      return base; }
    function assetTierOf(type,id){ return effAssetTier(type)[id]||'normal'; }
    function assetBuyPrice(type,id){ const A=ASSET_TYPES[type], cfg=A.cfg(), o=cfg&&cfg[id];
      if(o&&o.price!=null&&o.price!==''&&!isNaN(o.price)) return Math.max(0,Number(o.price));   // config 가격 오버라이드가 default→0보다 우선(원 동작 유지)
      if(A.hasDefault && id==='default') return 0;
      return TIER_PRICE[assetTierOf(type,id)]||0; }
    function isGachaOnlyAsset(type,id){ const A=ASSET_TYPES[type];
      if(A.hasDefault && id==='default') return false;
      const ov=gachaOverride(A.cfg(),id); return ov!=null?ov:(tierRank(assetTierOf(type,id)) >= tierRank('epic')); }
    // 벽지 등급/가격/가챠전용 — 팩토리 별칭. 가격=등급가 TIER_PRICE[tier](config/wallpaper.price 오버라이드 우선, default=0). ⚠️ WALLPAPER_CATALOG.price는 읽지 않음(미사용).
    function effWallTier(){ return effAssetTier('wallpaper'); }
    function wallTierOf(id){ return assetTierOf('wallpaper',id); }
    function wallBuyPrice(id){ return assetBuyPrice('wallpaper',id); }
    // 🎁 랜덤박스 통합 풀: 가구(it:)는 전 등급이 풀에 들어가 낮은 등급 롤도 채운다. 바닥(fl:)·벽지(wl:)는 목록 자체가 특별↑(가챠 전용). 타입 프리픽스로 지급 대상 구분.
    //  · 판매 제외(가챠 전용) 판정은 등급 기반(isGachaOnlyItem/Floor/Wall = tier≥epic) — 등급만 지정하면 "특별↑=박스에서만"이 자동 적용된다.
    // 📦 박스 풀(2026-07 개편) — 한정 포함: 가구·바닥·벽지 + 배경효과·펫효과·모자(전부 한정). 랜덤박스는 TIERS(한정 0.2%)로,
    //    무지개박스는 RAINBOW_TIERS(신화80·한정20)로 이 같은 풀에서 뽑는다 → 미공개 한정 아이템도 전부 출현.
    function boxPool(){ const m={}; const it=effItemTier(), fl=effFloorTier(), wl=effWallTier(), bg=bgfxTierMap();
      Object.keys(it).forEach(k=>{ m['it:'+k]=it[k]; });
      Object.keys(fl).forEach(k=>{ m['fl:'+k]=fl[k]; });
      Object.keys(wl).forEach(k=>{ m['wl:'+k]=wl[k]; });
      Object.keys(bg).forEach(k=>{ m['bg:'+k]=bg[k]; });   // 배경효과(전부 한정)
      Object.keys(PETFX_TIER).forEach(k=>{ m['fx:'+k]=PETFX_TIER[k]; });   // ✨ 펫효과(전부 한정)
      Object.keys(HAT_TIER).forEach(k=>{ m['ht:'+k]=HAT_TIER[k]; });   // 🧢 모자(전부 한정)
      return m; }
    function rollBoxReward(tiers, forced){ const raw = forced ? pickTierMember(boxPool(), forced) : rollFromPool(boxPool(), tiers); if(!raw) return null; const p=raw.id.split(':');
      return { id:p.slice(1).join(':'), tier:raw.tier, type:(p[0]==='fl'?'floor':(p[0]==='wl'?'wall':(p[0]==='bg'?'bgfx':(p[0]==='fx'?'petfx':(p[0]==='ht'?'hat':'item'))))) }; }
    // ♻️ 중복/초과 환급 정책(2026-07 사용자 지침): 펫 중복·스킨(바닥/벽지/배경효과) 중복·가구 캡 초과 전부 등급가의 10% 은화 환급(구 20%).
    // 🧰 가구 보유 상한 = itemCapOf(케어 5·그 외 1, 2026-07 개편) — 초과 획득(가챠·10연차·드랍 박스)은 중복 보상, 알뜰샵 구매는 캡에서 차단(buyItem).
    // 🧰 기구물 보유 상한(2026-07 개편): 케어 아이템(밥·물그릇·화장실)=5개 · 그 외 전부 1개(구 종당 12개).
    const ITEM_MAX_QTY=12;   // (레거시 상수 — 판정은 전부 itemCapOf(id) 사용)
    function itemCapOf(id){ return (typeof CARE_ITEMS!=='undefined'&&CARE_ITEMS.indexOf(id)>=0)?5:1; }
    const DUP_REFUND_RATE=0.1;
    function dupRefundOf(tier){ return Math.max(1, Math.round((TIER_PRICE[tier]||0)*DUP_REFUND_RATE)); }
    // 🌈 신화↑ 등급 중복 = 은화 대신 무지개동전(무지개알/박스 5개=1뽑 재화). 트랜잭션 안에서 호출.
    function grantRbcoin(g, n){ n=Math.max(1, Math.floor(Number(n)||1)); g.rbcoin=clampRbcoin((Number(g.rbcoin)||0)+n);
      g.rbcoinTotal=Math.max(0, Math.floor(Number(g.rbcoinTotal)||0))+n; }   // 누적 획득 카운터(획득 이력 최소 추적)
    // 🌈 등급별 중복 무지개동전 지급량(단일 소스): 한정(exclusive)=2 · 신화(limited)=1 · 그 외=0. 전 지급/미러 접점이 이 헬퍼를 공유한다.
    function dupRbcOf(tier){ return tier==='exclusive' ? 2 : tier==='limited' ? 1 : 0; }
    // 🌈🛟 무지개동전 소비 — 반드시 이 함수로만 차감한다(잔액↓ + 누적소비 rbcoinSpent↑ 동시). normalizeGame 자가복구 바닥(잔액=누적획득−누적소비)의 정합을 유지하는 단일 소비 접점.
    //   ⚠️ 여기를 거치지 않고 g.rbcoin을 직접 빼면(누적소비 미반영) 자가복구가 그 소비를 "유실"로 오인해 되돌려 준다 → 무한 재화 버그. rbcoin 차감은 언제나 spendRbcoin.
    function spendRbcoin(g, n){ n=Math.max(0, Math.floor(Number(n)||0)); g.rbcoin=clampRbcoin((Number(g.rbcoin)||0)-n);
      g.rbcoinSpent=Math.max(0, Math.floor(Number(g.rbcoinSpent)||0))+n; }
    function grantBoxReward(g, res){ const rb0=Number(g.rbcoin)||0; const rf=_grantBoxRewardRf(g, res); return { rf:(rf||0), rbc:Math.max(0,(Number(g.rbcoin)||0)-rb0) }; }   // {rf:환급 은화(가산은 호출자), rbc:한정 중복 무지개동전} — 표기용 rbc를 함께 반환(2026-07)
    function _grantBoxRewardRf(g, res){   // 지급 + 중복/초과 보상: 신화↑=무지개동전(한정+2·신화+1, 은화 반환 0) · 그 외=환급 은화 반환
      const dupPay=()=>{ if(isTopTier(res.tier)){ grantRbcoin(g, dupRbcOf(res.tier)); return 0; } return dupRefundOf(res.tier); };
      if(res.type==='floor'){ g.owned.floors=g.owned.floors||{}; if(g.owned.floors[res.id]) return dupPay(); g.owned.floors[res.id]={boughtAt:new Date().toISOString()}; return 0; }
      if(res.type==='wall'){ if(g.owned.wallpapers[res.id]) return dupPay(); g.owned.wallpapers[res.id]={boughtAt:new Date().toISOString()}; return 0; }
      if(res.type==='bgfx'){ g.owned.bgfx=g.owned.bgfx||{}; if(g.owned.bgfx[res.id]) return dupPay(); g.owned.bgfx[res.id]={boughtAt:new Date().toISOString()}; return 0; }   // 배경효과=own-once
      if(res.type==='petfx'){ g.owned.petfx=g.owned.petfx||{}; if(g.owned.petfx[res.id]) return dupPay(); g.owned.petfx[res.id]={boughtAt:new Date().toISOString()}; return 0; }   // ✨ 펫효과=own-once — 장착은 애정 Lv3 슬롯
      if(res.type==='hat'){ g.owned.hats=g.owned.hats||{}; if(g.owned.hats[res.id]) return dupPay(); g.owned.hats[res.id]={boughtAt:new Date().toISOString()}; return 0; }   // 🧢 모자=own-once — 장착은 애정 Lv5 슬롯
      // 가구(item)는 수량 누적하되 종당 itemCapOf(케어5·기타1) 캡 — 초과분은 중복 보상. 모든 박스류 지급이 이 헬퍼를 거쳐 일괄 적용(단일 가챠·10연차·캠 드랍 개봉).
      const it=g.owned.items[res.id];
      if(it&&(Number(it.qty)||0)>=itemCapOf(res.id)) return dupPay();
      if(it&&(Number(it.qty)||0)>0){ it.qty=(Number(it.qty)||0)+1; return 0; }
      g.owned.items[res.id]={qty:1,boughtAt:new Date().toISOString()}; return 0; }
    // 가챠전용 판정: 전역 오버라이드(config/*.gacha, 개발자 토글)가 있으면 그 값, 없으면 등급 기반 기본값(특별↑=가챠전용).
    //   가챠전용=true → 알뜰샵 판매목록에서 숨김. false → 등급 무관 은화 판매. 어느 쪽이든 가챠(펫알/랜덤박스) 풀에는 항상 포함.
    function gachaOverride(cfg, id){ const o=cfg&&cfg[id]; return (o&&o.gacha!=null)?!!o.gacha:null; }
    function isGachaOnlyFloor(id){ return isGachaOnlyAsset('floor',id); }
    function isGachaOnlyWall(id){ return isGachaOnlyAsset('wallpaper',id); }
    // 바닥 스킨 등급: FLOOR_TIER 기본값에 전역 config/floor 병합. 가격=등급가 TIER_PRICE[tier](config/floor.price 오버라이드 우선, default=0). ⚠️ FLOOR_CATALOG.price는 읽지 않음(미사용).
    function effFloorTier(){ return effAssetTier('floor'); }
    function floorTierOf(id){ return assetTierOf('floor',id); }
    function floorBuyPrice(id){ return assetBuyPrice('floor',id); }
    // 랜덤박스 보상(바닥/벽지/가구) 등장 아트·이름
    function rewardBoxArtH(res, h){ h=h||104; const rd=Math.max(6,Math.round(h*0.15));   // 크기 지정(10연차 썸네일·리빌 공용)
      if(res.type==='floor') return '<div class="fx-tile" style="width:'+h+'px;height:'+h+'px;border-radius:'+rd+'px;box-shadow:0 6px 16px rgba(0,0,0,.25);background:'+floorCss(res.id)+'"></div>';
      if(res.type==='wall') return '<div class="fx-tile" style="width:'+h+'px;height:'+h+'px;border-radius:'+rd+'px;box-shadow:0 6px 16px rgba(0,0,0,.25);background:'+wallCss(res.id)+'"></div>';
      if(res.type==='bgfx') return '<div class="fx-bgfx" style="width:'+h+'px;height:'+h+'px;display:flex;align-items:center;justify-content:center;">'+bgfxThumb(res.id, Math.round(h*0.7))+'</div>';
      if(res.type==='petfx') return '<div class="fx-bgfx" style="width:'+h+'px;height:'+h+'px;display:flex;align-items:center;justify-content:center;">'+buddySvgOf(res.id,{h:Math.round(h*0.55)})+'</div>';   // ✨ 펫효과(나비·반딧불)
      if(res.type==='hat') return '<div class="fx-bgfx" style="width:'+h+'px;height:'+h+'px;display:flex;align-items:center;justify-content:center;">'+hatSvg(res.id,{h:Math.round(h*0.6)})+'</div>';   // 🧢 모자(2026-07 — 누락 시 빈 그림)
      return furnSvg(res.id,{h:h}); }
    function rewardBoxArt(res){ return rewardBoxArtH(res, 104); }
    function rewardName(res){ if(res.type==='floor') return ((FLOOR_CATALOG.find(x=>x.id===res.id)||{}).name||res.id)+' 바닥';
      if(res.type==='wall') return ((WALLPAPER_CATALOG.find(x=>x.id===res.id)||{}).name||res.id)+' 벽지';
      if(res.type==='bgfx') return ((bgfxCat(res.id)||{}).name||res.id)+' 배경효과';
      if(res.type==='petfx') return (BUDDY_CATALOG[res.id]||res.id)+' 펫효과';
      if(res.type==='hat') return (HAT_CATALOG[res.id]||res.id)+' 모자';   // 🧢 (2026-07 — 누락 시 영문 id 노출)
      return itemName('box', res.id); }
    // 등급별 알뜰샵 가격(은화) — 확률(60/20/15/3.8/1/0.2%)에 맞춰 등급이 오를수록 약 2배씩.
    // 알 100은화(+금화1·중복은 그 펫 가격의 10% 환급) 대비, 흔한 등급은 알보다 싸게·희귀 등급은 비싸게 → 직접구매 vs 뽑기 선택 성립.
    // CAT_TIER를 단일 소스로 삼아 PET_CATALOG.price를 산정(새 고양이도 등급만 지정하면 자동 가격).
    const TIER_PRICE = { normal:50, uncommon:100, rare:200, epic:400, legend:800, limited:1500, exclusive:3000 };   // 한정(exclusive)=비매지만 환급·표시용 값
    PET_CATALOG.forEach(c=>{ const t=CAT_TIER[c.id]; if(t&&TIER_PRICE[t]!=null) c.price=TIER_PRICE[t]; });
    ITEM_CATALOG.forEach(c=>{ const t=ITEM_TIER[c.id]||'normal'; if(TIER_PRICE[t]!=null) c.price=TIER_PRICE[t]; });   // 기구물도 펫과 동일 등급 가격(TIER_PRICE) — 새 기구물은 ITEM_TIER 등급만 지정하면 자동 가격
    // ---- 개발자 모드(등록된 개발자 이메일 전용): 확률·구성 로컬 오버라이드 ----
    const DEV_EMAILS=['canel94@gmail.com'];   // 소문자로 등록(비교 시 소문자화). ⚠️ database.rules.json 의 config 쓰기 규칙(현재 canel94@gmail.com 하드코딩)과 반드시 동기화 — 여기만 추가하면 개발자 UI는 뜨지만 전역(config/*) 쓰기는 규칙에서 막혀 조용히 실패한다.
    function isDev(){ return DEV_EMAILS.indexOf((state.userEmail||'').toLowerCase())>=0; }
    function devOn(){ return isDev() && localStorage.getItem('catDev')==='1'; }
    function toggleDevMode(){ if(!isDev()) return; localStorage.setItem('catDev', devOn()?'0':'1'); }
    function devCfg(){ try{ return JSON.parse(localStorage.getItem('catDevCfg')||'null')||{}; }catch(e){ return {}; } }
    function saveDevCfg(c){ localStorage.setItem('catDevCfg', JSON.stringify(c)); }
    function effTiers(){ const c=devOn()&&devCfg().tiers; if(!c) return TIERS; return TIERS.map(t=>({ id:t.id, name:t.name, color:t.color, p:(c[t.id]!=null?Number(c[t.id]):t.p) })); }
    function effCatTier(){ if(!devOn()) return CAT_TIER; const ov=devCfg().catTier||{}, r={}; Object.keys(CAT_TIER).forEach(k=>{ r[k]=(ov[k]!=null?ov[k]:CAT_TIER[k]); }); return r; }   // 알려진 id만(구 dev 설정의 잔여 키 무시)
    // 기구물 등급: ITEM_TIER 기본값 ← 전역 config/furniture(모든 사용자) ← devOn 로컬 오버레이(이 기기 테스트)
    function effItemTier(){ return effAssetTier('furniture'); }
    // 기구물 은화 구매가: config/furniture.price 오버라이드 우선, 없으면 등급가 TIER_PRICE[ITEM_TIER[id]]. (ITEM_CATALOG.price는 로드 시 TIER_PRICE로 덮어써지는 표시용 placeholder — 구매가 소스 아님.)
    function itemBuyPrice(id){ return assetBuyPrice('furniture',id); }
    // 등급 랭크(낮을수록 흔함). 특별(epic) 이상은 알뜰샵 직접 구매 불가 — 펫알(가챠) 전용.
    function tierRank(tier){ return Math.max(0, TIER_ORDER.indexOf(tier||'normal')); }
    function petTierOf(id){ return effCatTier()[id]||'normal'; }
    function isGachaOnlyCat(id){ if(_petGachaOnly[id]!=null) return _petGachaOnly[id]; return tierRank(petTierOf(id)) >= tierRank('epic'); }   // 오버라이드(catalogPets.gachaOnly) 우선, 없으면 특별↑
    function itemTierOf(id){ return assetTierOf('furniture',id); }
    function isGachaOnlyItem(id){ return isGachaOnlyAsset('furniture',id); }
    // 🌟 시즌: 이달의 펫 — 매월(KST) 은화로 살 수 있는 등급(특별 미만) 중 하나. 모든 사용자 동일, 20% 할인.
    //  · 우선순위: ① 개발자 수동 선정(전역 config/featuredPet/{monthKey}=id, 관리자만 쓰기) ② 없으면 월키 해시 자동 선정.
    //  · 해시 자동은 후보 목록 길이에 의존해 펫을 추가/삭제하면 그 달 자동 선정이 바뀜 → 수동 선정을 두면 그런 변동 없이 고정된다.
    const FEATURED_DISCOUNT = 0.2;
    let _featuredMap = {};   // { 'M2026-07': 'cat_xxx', ... } — RTDB config/featuredPet 구독값(loadFeaturedPet)
    function loadFeaturedPet(){ try{ db.ref('config/featuredPet').on('value', function(s){ _featuredMap = s.val() || {};
      if(typeof rerender==='function') rerender('game'); if(state && state._sheetRefresh) state._sheetRefresh(); }); }catch(e){} }
    // 🎬 가챠 오픈 연출에 등장하는 펫(개발자 지정, 전역). a=1번(왼쪽에서 등장·오른쪽 봄)·b=2번(오른쪽에서 등장·왼쪽 봄). 미지정이면 기본 검은고양이 스프라이트.
    let _gachaFx={};
    function loadGachaFx(){ try{ db.ref('config/gachaFx').on('value', function(s){ _gachaFx=s.val()||{}; if(typeof prewarmGachaFxPads==='function') prewarmGachaFxPads(); }); }catch(e){} }   // 지정 펫 바뀌면 발끝 여백 미리 측정(첫 등장 점프 방지)
    // 🪑 기구물 전역 등급/가격 구독 — 값이 바뀌면 열린 시트(기구물 관리·알뜰샵) 라이브 갱신
    function _cfgRefresh(){ if(state._sheetRefresh && $('sheet') && $('sheet').classList.contains('on')) state._sheetRefresh(); }
    function loadFurnCfg(){ try{ db.ref('config/furniture').on('value', function(s){ _furnCfg=s.val()||{}; _cfgRefresh(); }); }catch(e){} }
    function loadWallCfg(){ try{ db.ref('config/wallpaper').on('value', function(s){ _wallCfg=s.val()||{}; _cfgRefresh(); }); }catch(e){} }
    function loadFloorCfg(){ try{ db.ref('config/floor').on('value', function(s){ _floorCfg=s.val()||{}; _cfgRefresh(); }); }catch(e){} }
    function gachaFxSlotOf(id){ if(_gachaFx&&_gachaFx.a===id) return 'a'; if(_gachaFx&&_gachaFx.b===id) return 'b'; return null; }
    function gachaSlotLabel(slot){ return slot==='a'?'1(왼쪽)':'2(오른쪽)'; }
    // 슬롯 지정 펫 이름 + 경고(삭제되어 스프라이트 없음 ⚠ / frontWalk=걷기 모션 없음). 미지정이면 기본/없음.
    function gachaFxSlotDesc(slot){ const id=_gachaFx&&_gachaFx[slot]; if(!id) return slot==='a'?'기본 검은 고양이':'없음';
      let s=catName(id);
      if(typeof hasSprite==='function' && !hasSprite(id)) s+=' ⚠삭제됨';
      else if((PET_SPRITES[id]||{}).frontWalk) s+=' (걷기없음)';
      return s; }
    function setGachaFxSlot(slot, id){ if(!(typeof isDev==='function'&&isDev())) return;
      const cur=_gachaFx&&_gachaFx[slot]; const other=(slot==='a')?'b':'a'; const lbl=gachaSlotLabel(slot);
      const apply=function(){ const upd={};
        if(cur===id){ upd['config/gachaFx/'+slot]=null; }                          // 같은 슬롯 재탭=해제
        else { upd['config/gachaFx/'+slot]=id; if(_gachaFx&&_gachaFx[other]===id) upd['config/gachaFx/'+other]=null; }   // 다른 슬롯에 이미 있으면 옮김
        db.ref().update(upd).then(function(){ toast('연출 '+lbl+'번 '+((cur===id)?'해제':('= '+catName(id)))); if(typeof openDevPetManager==='function') openDevPetManager(); }).catch(function(){ toast('실패 — 관리자 계정만', true); }); };
      if(cur===id){ apply(); return; }   // 해제는 확인 없이
      const sp=PET_SPRITES[id]||{}; const fw=sp.frontWalk?'\n※ 이 펫은 걷기 모션이 없어 옆 정지 스틸로 등장해요.':'';
      confirmSheet('연출 '+lbl+'번을 “'+catName(id)+'”(으)로 지정할까요?\n모든 사용자에게 즉시 적용됩니다.'+fw, apply, {title:'가챠 연출 펫 지정', okLabel:'지정', danger:false}); }
    // 연출 미리보기(개발자): 3탭·리빌 없이 고양이 연출 시퀀스만 바로 재생하고 자동 종료. reduced-motion도 무시(연출 확인이 목적). 지정 없으면 기본 검은 고양이.
    function devPreviewGachaFx(){ if(!(typeof isDev==='function'&&isDev())) return;
      const fx=$('catFx'); if(!fx){ toast('미리보기를 열 수 없어요', true); return; }
      closeSheet(); _fxClear(); prewarmGachaFxPads();   // 발끝 여백 미리 측정(등장 전 값 준비)
      _fx={ kind:'ddeul', preview:true, busy:true, rainbow:false, gold:0, res:{ id:(_gachaFx&&(_gachaFx.a||_gachaFx.b))||(PET_CATALOG[0]&&PET_CATALOG[0].id), tier:'exclusive' } };   // 한정 시나리오 = 뜰알 기준(지정 펫이 연출에 반영되는 등급)
      fx.innerHTML='<div class="fx-scrim"></div><div class="fx-stage fx-ddeul">'+
        '<div class="fx-item pop fx-egg fx-ddeulegg" id="fxItem">'+ddeulFxHtml()+'</div>'+
        '<div class="fx-hint" id="fxHint">연출 미리보기</div></div>';
      fx.className='fx on';
      ddeulPickupFx(fx.querySelector('.fx-stage'));   // 미리보기에도 무지개+나비
      const st=fx.querySelector('.fx-stage'), it=$('fxItem'); if(!st||!it) return;
      st.style.color='#ffffff'; it.classList.add('fx-preshake');
      const tLast=fxCatSeqSchedule(st, it);
      _fxT(()=>{ it.classList.remove('fx-preshake'); void it.offsetWidth; it.classList.add('fx-hit'); const fl=it.querySelector('.fx-ddflower'); if(fl){ fl.classList.remove('flswing'); void fl.offsetWidth; fl.classList.add('flswing'); } const h=$('fxHint'); if(h) h.textContent='미리보기 완료'; }, tLast);   // 마지막 톡 순간 알 톡(+꽃 팔랑)
      _fxT(()=>{ closeFx(); }, tLast+1000); }   // 잠시 뒤 자동 종료
    function featuredEligibleIds(){ return PET_CATALOG.filter(c=>!isGachaOnlyCat(c.id)).map(c=>c.id); }
    function featuredCatId(){ const mk=kstMonthKey();
      const ov=_featuredMap && _featuredMap[mk];   // 개발자 수동 선정 우선(존재·미삭제 펫이면)
      if(ov && PET_CATALOG.some(c=>c.id===ov && !c.deleted)) return ov;
      // 🌟 자동 선정은 '미보유' 펫 우선 — 이미 보유한 펫이 걸리면 할인 훅이 죽어서, 사용자별로 미보유 풀에서 월키 해시로 뽑는다(다 보유했으면 전체 풀 폴백).
      //    보유 상태가 바뀌면(이달의 펫 구매 등) 다음 렌더에서 새 미보유 펫이 자동 선정된다. 수동 선정(config/featuredPet)은 운영자 의도라 보유 여부 무시.
      const elig=featuredEligibleIds(), un=elig.filter(id=>!ownsCat(id));
      return featuredPetOfMonth(mk, un.length?un:elig); }
    // ---- dev: 이달의 펫 직접 선정(전역) ----
    // 쓰기 실패 안내 — 성공 콜백의 예외를 권한 실패로 오인하지 않게 UI 갱신은 try로 감싸고, 실패 시 실제 오류코드를 보여준다.
    //  PERMISSION_DENIED면 대개 config 쓰기 '규칙 미배포'(웹 배포와 별개 — `firebase deploy --only database` 필요)거나 관리자 계정 아님.
    function _cfgWriteErr(e){ console.error('config write', e); const c=(e&&(e.code||e.message))||''; toast('저장 실패'+(c?'('+c+')':'')+' — DB 규칙(config 쓰기) 미배포이거나 관리자 계정이 아님', true); }
    function setFeaturedPet(id){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용', true); return; }
      db.ref('config/featuredPet/'+kstMonthKey()).set(id).then(function(){ toast('이달의 펫: '+catName(id)); try{ openDevFeatured(); }catch(e){} }).catch(_cfgWriteErr); }
    function clearFeaturedPet(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용', true); return; }
      db.ref('config/featuredPet/'+kstMonthKey()).remove().then(function(){ toast('자동 선정으로 되돌렸어요'); try{ openDevFeatured(); }catch(e){} }).catch(_cfgWriteErr); }
    function openDevFeatured(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용'); return; }
      const mk=kstMonthKey(), cur=featuredCatId(), manual=!!(_featuredMap&&_featuredMap[mk]), ids=featuredEligibleIds();
      let h='<div class="note">'+monthLabelKo()+' <b>이달의 펫</b>을 직접 선정해요. 선정하면 <b>모든 사용자에게 즉시 반영</b>(전역 config, 관리자 계정만 쓰기). 선정하지 않으면 월키 해시로 자동 선정되며, 펫을 추가/삭제하면 자동 선정 펫이 바뀔 수 있어요.</div>';
      h+='<div class="row" style="justify-content:space-between;align-items:center;margin:6px 2px 10px;"><span>현재: <b>'+catNameSpan(cur,catName(cur))+'</b> <span class="pill">'+(manual?'수동 선정':'자동(해시)')+'</span></span>'+(manual?'<button class="chip" '+App.view.act('clearFeaturedPet')+'>자동으로 되돌리기</button>':'')+'</div>';
      h+='<div class="dexgrid">'+ids.map(function(id){ const on=id===cur; return '<div class="dexcell" role="button" tabindex="0" '+App.view.act('setFeaturedPet',id)+' style="cursor:pointer;'+(on?'outline:2px solid var(--primary);outline-offset:1px;border-radius:12px;':'')+'"><div class="dexpic">'+catFace(id,{h:48})+'</div><div class="dexnm">'+catNameSpan(id,catName(id))+(on?' ✓':'')+'</div></div>'; }).join('')+'</div>';
      openSheet('이달의 펫 선정', h); }
    function isFeaturedCat(id){ return !!id && id===featuredCatId(); }
    function catBuyPrice(id){ const c=PET_CATALOG.find(x=>x.id===id); if(!c) return 0; return isFeaturedCat(id)?Math.max(1,Math.round((c.price||0)*(1-FEATURED_DISCOUNT))):(c.price||0); }
    function monthLabelKo(){ const n=parseInt(kstMonthKey().slice(6),10)||0; return n+'월'; }
    // 가챠 구분별 짧은 설명(뜰알/펫알/랜덤박스/무지개) — 해당 탭에 맞는 한 줄.
    function gachaNoteFor(tab){
      if(tab==='ddeul')   return '🌱 <b class="tier-rainbow">한정 펫</b>은 오직 뜰알에서만! 살 때 <b>금화 1개를 소모</b>해요(펫알과 달리 금화 보상 없음 · 중복 펫은 애정 경험치, <b>신화 중복 무지개동전 +1·한정 중복 +2</b>).';
      if(tab==='rainbow') return '✨ <b class="tier-rainbow">무지개</b>는 <b>무지개동전 '+RAINBOW_PRICE_RBC+'개</b>로 1뽑 — <b class="tier-limited">신화 80%</b>·<b class="tier-rainbow">한정 20%</b>, <b>'+RB_PITY_N+'뽑 안에 한정 확정</b>! 무지개동전은 <b>신화 중복 +1·한정 중복 +2</b>로 쌓여요.';
      return '🥚 <b>펫알</b>은 열면 <b>펫</b>이, 🎁 <b>랜덤박스</b>는 <b>가구·바닥·벽지</b>가 랜덤으로 — <b>특별↑</b>도 여기서. 열 때마다 <b>금화 1개</b>(중복 펫은 10% 은화 환급).';   // normal(egg+box)
    }
    // 가챠 탭 하단: 선택한 구분의 등급별 확률만 접이식으로 표시.
    function gachaInfoHtml(tab){
      const tiers=effTiers().filter(function(t){ return (Number(t.p)||0)>0; }), catBy=effCatTier(), itemBy=effItemTier();   // 확률 0 등급만 제외(2026-07: 한정도 0.2%로 노출)
      const row=(t)=> '<div class="gi-row"><b class="tier-'+t.id+'">'+t.name+'</b><span class="gi-p">'+t.p+'%</span></div>';
      const sec=(head,rows)=> '<div class="gi-sec"><div class="gi-h">'+head+'</div>'+rows+'</div>';
      const eggSec=()=> sec('🥚 펫알 · 고양이', tiers.filter(t=>PET_CATALOG.some(x=>catBy[x.id]===t.id)).map(row).join(''));
      const boxSec=()=>{ const boxHas=tid=> ITEM_CATALOG.some(x=>itemBy[x.id]===tid) || FLOOR_CATALOG.some(f=>FLOOR_TIER[f.id]===tid) || WALLPAPER_CATALOG.some(w=>WALL_TIER[w.id]===tid)
          || Object.keys(PETFX_TIER).some(k=>PETFX_TIER[k]===tid) || Object.keys(HAT_TIER).some(k=>HAT_TIER[k]===tid) || (typeof BGFX_CATALOG!=='undefined'&&tid==='exclusive'&&BGFX_CATALOG.length>0);   // 한정=배경효과·펫효과·모자 포함
        return sec('🎁 랜덤박스 · 가구·스킨·펫효과·모자', tiers.filter(t=>boxHas(t.id)).map(row).join('')); };
      let body='';
      if(tab==='normal'){   // 🥚📦 일반 = 펫알 + 랜덤박스 확률 둘 다
        body=eggSec()+boxSec();
      } else if(tab==='box'){
        body=boxSec();
      } else if(tab==='ddeul'){   // 🌱 이벤트(뜰알·한정 픽업) — DDEUL_TIERS. 한정(exclusive)은 활성 픽업 펫이 있을 때만.
        const rows=DDEUL_TIERS.map(dt=>{ if(dt.id==='exclusive' && !LIMITED_PICKUP.some(pickupExists)) return ''; const ti=tierInfo(dt.id);
          return '<div class="gi-row"><b class="tier-'+dt.id+'">'+ti.name+'</b><span class="gi-p">'+dt.p+'%</span></div>'; }).join('');
        body=sec('🌱 뜰알 · 한정 픽업', rows);
      } else if(tab==='rainbow'){   // 🌈 무지개 — RAINBOW_TIERS(신화80·한정20·5뽑 한정 천장), 무지개동전 5개/뽑(신화 중복 +1·한정 중복 +2)
        const rows=RAINBOW_TIERS.map(rt=>{ const ti=tierInfo(rt.id);
          return '<div class="gi-row"><b class="tier-'+rt.id+'">'+ti.name+'</b><span class="gi-p">'+rt.p+'%</span></div>'; }).join('');
        body=sec('🌈 무지개알·무지개박스 · 신화/한정 확정 (무지개동전 '+RAINBOW_PRICE_RBC+'개 — 신화 중복 +1·한정 중복 +2)', rows);
      } else {   // egg
        body=eggSec();
      }
      return body;
    }
    // 📊 확률 안내(설정 → 확률 안내) — 모든 뽑기(펫알·랜덤박스·뜰알·무지개)의 등급별 확률을 한 화면에 고지.
    function openProbInfoSheet(){
      const h='<div class="note">모든 뽑기의 등급별 확률입니다. 등급·구성이 바뀌면 자동으로 갱신돼요.</div>'+
        '<div class="card" style="padding:4px 0;"><div class="gi-body">'+gachaInfoHtml('normal')+gachaInfoHtml('ddeul')+gachaInfoHtml('rainbow')+'</div></div>'+
        '<button class="btn" '+App.view.act('closeSheet')+' style="margin-top:14px;">확인</button>';
      openSheet('확률 안내', h);
    }

    // 확률은 합이 100이 아니어도 총합 기준 비율로 적용(개발 편의)
    function rollTier(tiers){ const arr=tiers||effTiers(); const total=arr.reduce((s,t)=>s+(Number(t.p)||0),0)||1; const r=Math.random()*total; let acc=0; for(const t of arr){ acc+=(Number(t.p)||0); if(r<acc) return t.id; } return arr[0].id; }
    // 등급 롤 → 해당 등급 풀에서 랜덤. 비면 한 단계 아래로 내려가며 탐색. tiers를 주면 그 확률표로(무지개=특별↑ 전용).
    function rollFromPool(tierMap, tiers){
      let ti=TIER_ORDER.indexOf(rollTier(tiers));
      for(; ti>=0; ti--){ const tier=TIER_ORDER[ti]; const pool=Object.keys(tierMap).filter(k=>tierMap[k]===tier);
        if(pool.length) return { id:pool[Math.floor(Math.random()*pool.length)], tier }; }
      // 아래로도 없으면 위로
      for(ti=0; ti<TIER_ORDER.length; ti++){ const tier=TIER_ORDER[ti]; const pool=Object.keys(tierMap).filter(k=>tierMap[k]===tier); if(pool.length) return { id:pool[Math.floor(Math.random()*pool.length)], tier }; }
      return null;
    }
    // 🔮 천장 확정: 특정 등급 풀에서 랜덤 1개(비면 한 단계 아래로 폴백). rollFromPool과 같은 풀 선택 로직.
    function pickTierMember(tierMap, tier){
      let ti=TIER_ORDER.indexOf(tier);
      for(; ti>=0; ti--){ const t=TIER_ORDER[ti]; const pool=Object.keys(tierMap).filter(k=>tierMap[k]===t); if(pool.length) return { id:pool[Math.floor(Math.random()*pool.length)], tier:t }; }
      for(ti=0; ti<TIER_ORDER.length; ti++){ const t=TIER_ORDER[ti]; const pool=Object.keys(tierMap).filter(k=>tierMap[k]===t); if(pool.length) return { id:pool[Math.floor(Math.random()*pool.length)], tier:t }; }
      return null;
    }
    // 🔮 신화↑(신화·한정) 여부 = 천장 리셋 조건
    function isTopTier(t){ return t==='limited' || t==='exclusive'; }
    // 🔮 가챠 종류별 독립 천장. game.pity = {egg,box,ddeul,rainbow_egg,rainbow_box}. 각 100뽑째 확정, 신화↑ 뽑으면 그 종류만 리셋.
    const PITY_KEYS=['egg','box','ddeul','rainbow_egg','rainbow_box'];
    function normPity(p){ p=(p&&typeof p==='object')?p:{}; const o={}; PITY_KEYS.forEach(k=>{ o[k]=Math.max(0,Math.floor(Number(p[k])||0)); }); return o; }
    function pityGet(key){ return (state.game&&state.game.pity&&Number(state.game.pity[key]))||0; }
    // 강제 등급 결정: 확정이면 뜰알=신화50%·한정50%, 그 외=신화(limited). 아니면 null(정상 롤).
    function isRbKey(k){ return k==='rainbow_egg'||k==='rainbow_box'; }
    function pityForcedTierFor(key){
      if(isRbKey(key)) return pityForced(pityGet(key), RB_PITY_N) ? 'exclusive' : null;   // 🌈 무지개: 5뽑 안에 한정 확정(리셋=한정 획득)
      if(!pityForced(pityGet(key))) return null;
      return key==='ddeul' ? (Math.random()<0.5?'limited':'exclusive') : 'limited'; }
    // 가챠 카드에 붙는 종류별 천장 칩(신화↑ 확정까지 남은 뽑기).
    function pityChip(key){ const N=(typeof PITY_N!=='undefined'?PITY_N:100); return '<span class="pity-chip" title="이 종류를 '+N+'번 안에 신화 이상 확정">'+sparkSvg({h:10})+'신화확정 '+pityRemain(pityGet(key),N)+'뽑</span>'; }
    const GACHA_PRICE=100;
    // ♻️ 중복 펫 은화 환급(등급가의 10%) — 2026-07 개편 후엔 "애정 만렙 펫"의 폴백으로만 쓰인다(아래 grantPetDup).
    function petDupRefund(id){ const c=PET_CATALOG.find(x=>x.id===id); return c?Math.max(1,Math.round((c.price||0)*DUP_REFUND_RATE)):0; }
    // 💗 중복 펫 지급(트랜잭션용, 2026-07 개편): 은화 대신 그 펫의 "애정 경험치"(dupAffOf(tier), 등급 높을수록 큼).
    //    레벨업이 걸치면 applyAffectionGain이 은화·금화 소보상을 함께 지급. 애정 만렙(Lv5)이면 기존 은화 10% 폴백.
    //    스킨(벽지·바닥·배경효과) 중복·가구 캡 초과는 애정이 없어 dupRefundOf(은화 10%) — 단 신화↑ 아이템은 무지개동전(신화+1·한정+2, grantBoxReward의 dupPay).
    function grantPetDup(g, id){
      const tier=CAT_TIER[id]||'normal';
      const c=g.owned.cats[id]; if(!c) return { refund:0 };
      if(isTopTier(tier)){   // 🌈 신화↑ 펫 중복 = 무지개동전(한정+2·신화+1, 은화 폴백 없음). 애정 경험치도 함께(프레스티지 축 유지, 만렙이면 코인만).
        const n=dupRbcOf(tier); grantRbcoin(g,n);
        if(affectionLevel(c.affection, tier).level>=5) return { rbc:n };
        return { rbc:n, aff: dupAffOf(tier), gain: applyAffectionGain(g, id, dupAffOf(tier)) };
      }
      if(affectionLevel(c.affection, tier).level>=5){ const rf=petDupRefund(id); g.coins=clampCoins((g.coins||0)+rf); return { refund:rf }; }
      return { aff: dupAffOf(tier), gain: applyAffectionGain(g, id, dupAffOf(tier)) };
    }
    // 💗 중복 펫 리빌 표기용 미러(트랜잭션 밖·현재 로컬 상태 기준 예상치) — 실지급은 grantPetDup이 단일 소스.
    function petDupPreview(id){
      const tier=CAT_TIER[id]||'normal', c=ownedCatsMap()[id]||{};
      const aff=Number(c.affection)||0, al=affectionLevel(aff, tier);
      const rbc=dupRbcOf(tier);   // 🌈 신화↑ 중복 = 무지개동전(한정+2·신화+1)
      if(al.level>=5) return rbc?{ max:true, refund:0, rbc:rbc }:{ max:true, refund:petDupRefund(id) };
      const gain=dupAffOf(tier), after=affectionLevel(aff+gain, tier).level;
      const rw=Math.max(0, Math.floor(Number(c.affRw)||0)); let silver=0, gd=0;
      for(let L=al.level+1; L<=after; L++){ if(L>rw){ silver+=affLevelReward(L); if(L>=5) gd+=5; } }
      return { max:false, aff:gain, lvFrom:al.level, lvTo:after, silver, gold:gd, rbc:rbc };
    }
    // 🌈 처음 획득 판정 — 뽑기 결과를 지급하기 "전" 보유 여부로 판단(등장 시 NEW 배지). 반드시 트랜잭션 커밋 전에 호출한다(커밋 후엔 리스너로 보유가 반영돼 오판).
    function isEggKind(k){ return k==='egg'||k==='ddeul'; }   // 뜰알(ddeul)은 펫알과 동일 취급(펫 지급·연출)
    function gachaNew(kind, res){ if(!res) return false;
      if(isEggKind(kind)) return !ownsCat(res.id);
      if(res.type==='floor') return !ownsFloor(res.id);   // default는 항상 보유 → NEW 아님
      if(res.type==='wall') return !ownsWall(res.id);
      if(res.type==='bgfx') return !ownsBgfx(res.id);
      if(res.type==='petfx') return !ownsPetfx(res.id);   // ✨ 펫효과
      if(res.type==='hat') return !ownsHat(res.id);   // 🧢 모자
      return ((typeof itemQty==='function'?itemQty(res.id):0)===0); }   // 가구: 처음 보유(수량 0)면 NEW
    // 구매+롤(원자적): 은화-100, 금화+1, 지급(신규 고양이/가구 or 중복 펫 환급). 성공 시 연출.
    // free=true → 🎁 일일 무료 1뽑: 재화 무소모·금화 부산물 없음, game.freePull[kind]=오늘(kstDayKey) 마커로 멱등(다른 기기 이중 사용 방지). pity는 동일 누적.
    function openGacha(kind, free){
      if(_pullBusy) return;   // 🔒 진행 중 재탭 무시(중복 구매·연출 1개 버그 방지)
      free=!!free&&freePullAvail(kind);
      if(!free && coins()<GACHA_PRICE){ toast((GACHA_PRICE-coins())+' 은화 부족', true); return; }
      const forced=pityForcedTierFor(kind);   // 🔮 종류별 천장: 100뽑째면 신화(뜰알 외) 강제
      let res, dup=false, refund=0, dp=null;
      if(kind==='egg'){ res = forced ? pickTierMember(gachaCatTierMap(), forced) : rollFromPool(gachaCatTierMap()); if(!res) return; dup=ownsCat(res.id); dp=dup?petDupPreview(res.id):null; refund=(dp&&dp.max)?dp.refund:0; }   // 💗 중복 펫=애정(만렙만 은화)
      else { res=rollBoxReward(null, forced); if(!res) return;
        if(res.type==='floor'){ dup=ownsFloor(res.id)&&res.id!=='default'; }
        else if(res.type==='wall'){ dup=ownsWall(res.id)&&res.id!=='default'; }
        else if(res.type==='bgfx'){ dup=ownsBgfx(res.id); }   // 배경효과=own-once
        else if(res.type==='petfx'){ dup=ownsPetfx(res.id); }   // ✨ 펫효과=own-once
        else if(res.type==='hat'){ dup=ownsHat(res.id); }   // 🧢 모자=own-once(2026-07 정합 수정 — 누락 시 중복 표기가 안 떴음)
        else { dup=itemQty(res.id)>=itemCapOf(res.id); }   // 🧰 가구: 상한(케어5·기타1) 미만이면 수량 누적, 캡이면 중복 리빌
        refund=(dup&&!isTopTier(res.tier))?dupRefundOf(res.tier):0;   // 신화↑ 중복=무지개동전(dupRbc 표기), 그 외만 은화 환급
      }
      const isNew=gachaNew(kind,res);   // 지급 전 판정(NEW 배지)
      const hit=isTopTier(res.tier);    // 🔮 신화↑면 천장 리셋
      const day=kstDayKey();
      pullBegin(kind, false);   // 🔒 잠금 + 즉시 '준비' 오버레이
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(free){ if(g.freePull[kind]===day) return; g.freePull[kind]=day; g.pity[kind]=pityNext(g.pity[kind]||0, hit); }   // 🎁 무료: 재화 무소모, 오늘 마커만(재검증)
        else { if(g.coins<GACHA_PRICE) return;
        g.coins-=GACHA_PRICE; grantGachaGold(g,1); g.pity[kind]=pityNext(g.pity[kind]||0, hit); }   // 부산물 금화 하루 2뽑 캡
        if(kind==='egg'){
          if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; }   // 🚫 가챠 획득 펫은 방에 자동 배치하지 않음(가방에만 — 배치는 홈에서 직접, 사용자 지침)
          else { grantPetDup(g, res.id); }   // 💗 중복 펫=애정 경험치(만렙만 은화 10% 폴백)
        } else { const gr=grantBoxReward(g,res); if(gr.rf) g.coins=clampCoins((g.coins||0)+gr.rf); }
        return g;
      }).then(r=>{ if(r&&r.committed) runGachaFx(kind, res, dup, refund, false, isNew, dp); else { closeFx(); toast('처리 중이에요 — 잠시 후 다시 시도해 주세요', true); } })   // C4: 중단 시 오버레이 닫고 안내(잠금 해제)
        .catch(function(){ closeFx(); });
    }
    // 🌱 뜰알(한정 픽업) — 은화로 여는 펫알. DDEUL_TIERS(한정 0.5% 포함, 활성 한정 펫만)로 롤, 오픈 연출은 뜰+무지개.
    const DDEUL_PRICE=100, DDEUL_GOLD=1;   // 프리미엄 픽업: 은화 100 + 금화 1(실제 소모, 금화 보상 없음).
    // free=true → 🎁 일일 무료 1뽑: 은화·금화 무소모, game.freePull.ddeul=오늘(kstDayKey) 마커로 멱등. pity는 동일 누적.
    function openDdeul(free){
      if(_pullBusy) return;   // 🔒 진행 중 재탭 무시
      free=!!free&&freePullAvail('ddeul');
      if(!free){
        if(coins()<DDEUL_PRICE){ toast((DDEUL_PRICE-coins())+' 은화 부족', true); return; }
        if(gold()<DDEUL_GOLD){ toast('금화 '+(DDEUL_GOLD-gold())+' 부족', true); return; }
      }
      const forced=pityForcedTierFor('ddeul');   // 🔮 천장: 뜰알 확정 = 신화 50% · 한정 50%
      const res = forced ? pickTierMember(gachaCatTierMap(), forced) : rollFromPool(gachaCatTierMap(), DDEUL_TIERS); if(!res) return;
      const dup=ownsCat(res.id), dp=dup?petDupPreview(res.id):null, refund=(dp&&dp.max)?dp.refund:0;
      const isNew=gachaNew('ddeul',res);
      const hit=isTopTier(res.tier);
      const day=kstDayKey();
      pullBegin('ddeul', false);   // 🔒 잠금 + 즉시 '준비' 오버레이
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if(free){ if(g.freePull.ddeul===day) return; g.freePull.ddeul=day; g.pity.ddeul=pityNext(g.pity.ddeul||0, hit); }   // 🎁 무료: 재화 무소모, 오늘 마커만(재검증)
        else { if(g.coins<DDEUL_PRICE || (g.gold||0)<DDEUL_GOLD) return;
        g.coins-=DDEUL_PRICE; g.gold=(g.gold||0)-DDEUL_GOLD; g.pity.ddeul=pityNext(g.pity.ddeul||0, hit); }   // 은화 100 + 금화 1 소모(금화 보상 없음)
        if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; }   // 🚫 가챠 획득 펫은 방에 자동 배치하지 않음(가방에만 — 배치는 홈에서 직접, 사용자 지침)
        else { grantPetDup(g, res.id); }   // 💗 중복 펫=애정 경험치(만렙만 은화 10% 폴백)
        return g;
      }).then(r=>{ if(r&&r.committed) runGachaFx('ddeul', res, dup, refund, false, isNew, dp); else { closeFx(); toast('처리 중이에요 — 잠시 후 다시 시도해 주세요', true); } })   // C4
        .catch(function(){ closeFx(); });
    }
    // ===== ✨ 무지개알/무지개박스(2026-07 개편): 🌈 무지개동전 5개로 바로 뽑기 — 신화80%·한정20%, 5뽑 안에 한정 확정 =====
    //    무지개동전(game.rbcoin)은 "신화↑ 등급 중복 획득" 시 적립(신화+1·한정+2, 가챠 전 경로). 미공개 한정 펫·아이템 전부 여기서 나온다.
    const RAINBOW_TIERS=[{id:'limited',p:80},{id:'exclusive',p:20}];   // 신화80·한정20(2026-07-09 사용자 조정 — 구 50/50) · 천장: RB_PITY_N뽑 안에 한정 확정
    const RB_PITY_N=5;   // 🌈 무지개 전용 천장 — 5뽑 안에 한정(exclusive) 확정(한정 나오면 리셋). 일반 100뽑 신화 천장(PITY_N)과 별개.
    const RAINBOW_PRICE_RBC=5;   // 1뽑당 무지개동전 5개(10뽑=50)
    function rbPriceGold(kind){ return RAINBOW_PRICE_RBC; }   // (구 금화가 함수 시그니처 유지 — 이제 무지개동전 단가)
    function rainbowKey(kind){ return kind==='egg'?'rainbow_egg':'rainbow_box'; }
    function rainbowName(kind){ return kind==='egg'?'무지개알':'무지개박스'; }
    function rbcoins(){ return (state.game&&Number(state.game.rbcoin))||0; }   // 🌈 무지개동전 잔액
    // 🌈 무지개알 전용 펫 풀 — "미공개 한정 포함 전체"(exActive 무관). 일반 펫알(gachaCatTierMap)은 활성 한정만.
    function rainbowCatTierMap(){ return effCatTier(); }
    // ✨ 무지개알/무지개박스(2026-07 개편): 무지개동전 5개로 바로 뽑기 — 신화80%·한정20%(5뽑 안에 한정 확정), 미공개 한정 펫·아이템 전부 출현.
    //    (구) 금화 구매→소비 인벤토리 사용 흐름은 폐기 — 기존 보유분은 migrateRbEconomyIfNeeded가 회수.
    function openRainbow(kind){
      if(_pullBusy) return;   // 🔒 진행 중 재탭 무시
      if(rbcoins()<RAINBOW_PRICE_RBC){ toast('무지개동전 '+(RAINBOW_PRICE_RBC-rbcoins())+'개 부족 — 신화·한정 중복으로 모아요', true); return; }
      const rk=rainbowKey(kind); const forced=pityForcedTierFor(rk);   // 🔮 무지개 종류별 천장 — RB_PITY_N(5)뽑 안에 한정 확정
      let res, dup=false, refund=0, dp=null;
      if(kind==='egg'){ res = forced ? pickTierMember(rainbowCatTierMap(), forced) : rollFromPool(rainbowCatTierMap(), RAINBOW_TIERS); if(!res) return; dup=ownsCat(res.id); dp=dup?petDupPreview(res.id):null; refund=(dp&&dp.max)?dp.refund:0; }   // 💗 중복 펫=애정+🌈코인(한정)
      else { res=rollBoxReward(RAINBOW_TIERS, forced); if(!res) return;
        if(res.type==='floor') dup=ownsFloor(res.id)&&res.id!=='default';
        else if(res.type==='wall') dup=ownsWall(res.id)&&res.id!=='default';
        else if(res.type==='bgfx') dup=ownsBgfx(res.id);
        else if(res.type==='petfx') dup=ownsPetfx(res.id);
        else if(res.type==='hat') dup=ownsHat(res.id);   // 🧢 모자=own-once
        else dup=itemQty(res.id)>=itemCapOf(res.id);
        refund=(dup&&!isTopTier(res.tier))?dupRefundOf(res.tier):0; }   // 신화↑ 중복=무지개동전(dupRbc 표기), 그 외만 은화 환급
      const isNew=gachaNew(kind,res);   // 지급 전 판정(NEW 배지)
      const hit=(res.tier==='exclusive');   // 🌈 무지개 천장 리셋 = 한정 획득(신화는 카운트 지속 — 5뽑 안에 한정 확정)
      pullBegin(kind, true);   // 🔒 잠금 + 즉시 '준비' 오버레이(무지개)
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.rbcoin)||0)<RAINBOW_PRICE_RBC) return;
        spendRbcoin(g, RAINBOW_PRICE_RBC); g.pity[rk]=pityNext(g.pity[rk]||0, hit);
        if(kind==='egg'){
          if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; }   // 🚫 가챠 획득 펫은 방에 자동 배치하지 않음(가방에만 — 배치는 홈에서 직접, 사용자 지침)
          else { grantPetDup(g, res.id); }   // 💗 중복 펫=애정(+한정이면 🌈코인)
        } else { const gr=grantBoxReward(g,res); if(gr.rf) g.coins=clampCoins((g.coins||0)+gr.rf); }
        return g;
      }).then(r=>{ if(r&&r.committed) runGachaFx(kind, res, dup, refund, true, isNew, dp); else { closeFx(); toast('처리 중이에요 — 잠시 후 다시 시도해 주세요', true); } })   // C4
        .catch(function(){ closeFx(); });
    }
    function useRainbow(kind){ openRainbow(kind); }   // (하위호환 별칭 — 구 사용 흐름 호출부 안전)
    let _selItem=null;
    function selItem(id){ if(itemRemaining(id)<=0){ toast(catFurnName(id)+' 전부 배치됨 — 회수하거나 더 얻어야 놓을 수 있어요', true); return; } _selItem=(_selItem===id?null:id); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }   // 남은 0(전부 배치)은 선택 불가·안내. _sheetRefresh=팔레트·펫칩 위치 보존(선택 시 처음으로 안 튐)
    const ITEM_SELL = 10;   // 기구물 판매가(은화)
    function itemFoot(id){ const it=ITEM_CATALOG.find(x=>x.id===id); return { w:(it&&it.footW)||1, h:(it&&it.footH)||1 }; }
    function isFloorItem(id){ const it=ITEM_CATALOG.find(x=>x.id===id); return !!(it&&it.floor); }   // 러그 등 바닥 아이템 — 겹침 무시(밑에 깔림)
    function isWallItem(id){ const it=ITEM_CATALOG.find(x=>x.id===id); return !!(it&&it.wall); }     // 창문·벽시계·벽난로 등 벽 가구 — 바닥격자 배치 불가, 벽격자(벽꾸미기)에만 배치
    function placedItemId(key){ const p=room().placed||{}; return p[key]&&p[key].itemId; }
    // ===== 🧱 벽꾸미기(벽 격자) — 바닥(placed)과 별개의 wallPlaced 레이어 =====
    // 벽 영역은 무대 위 46%(바닥선 bottom:54% 위). 가로 12칸 × 세로 4칸(위=천장 r1 … 아래=바닥선 r4). 깊이 없음(뒤 벽 평면).
    const WALL_COLS = 12, WALL_ROWS = 4;
    // 세로 앵커 3종(고도화):
    //  · floor(바닥형=벽난로): 맨 뒤 '바닥선'(뒤 바닥 가구와 동일 bottom% = 3+1*46=49)에 서고 depth1 크기 → 캠에서 바닥에 붙음(붕 뜸 해결). 행 무시(항상 바닥).
    //  · mount(거는형=창문·벽시계): 벽 밴드 안에서 행이 높이(r4=바닥근처54%…r1=천장쪽). bottom 앵커.
    //  · hang(매다는형=모빌·행잉플랜트): 천장쪽 top 앵커로 아래로 늘어짐(행이 낮을수록 위).
    const WALL_MOUNT_BASE = 54, WALL_MOUNT_STEP = 11;   // mount r행 bottom%: r4=54 … r1=87
    const WALL_ANCHOR = { fireplace:'floor', window:'mount', wallclock:'mount', hangplant:'hang', mobile:'hang', chandelier:'hang', garland:'hang', tapestry:'hang', dartboard:'mount', cuckooclock:'mount', wallvines:'hang', pennant:'mount', wallmask:'mount', barometer:'mount', stringlights:'hang', wallbutterfly:'mount', cornershelf:'mount', wallsun:'mount' };
    function wallAnchorOf(id){ return WALL_ANCHOR[id] || 'mount'; }
    function wallFoot(id){ return { w:itemFoot(id).w, h:1 }; }   // 벽 가구는 가로 footW × 세로 1칸 점유
    const _wallFootW = id => wallFoot(id).w;   // 순수 헬퍼(util.js)에 주입할 발자국 너비 함수
    function furnWallH(id, isDock){ return furnRoomH(id, isDock, 0); }   // mount/hang 크기 = 원근 없는 앞크기(depth 0)
    function wallPlacedList(){ const p=room().wallPlaced||{}; return Object.keys(p).map(k=>({key:k, r:+k.split('_')[0], c:+k.split('_')[1], itemId:p[k].itemId})); }
    function wallPlacedItemId(key){ const p=room().wallPlaced||{}; return p[key]&&p[key].itemId; }
    // 격자 순수 로직은 util.js(wall*Pure)에 있고, 여기선 카탈로그 값(발자국·앵커·격자 크기)을 주입하는 얇은 래퍼만 둔다(단위 테스트 가능).
    function wallSnapRow(id, r){ return wallSnapRowPure(wallAnchorOf(id), r, WALL_ROWS); }   // 바닥형은 항상 맨 아래 행(바닥선)
    function wallOccupiedCells(wp, ignoreKey){ return wallOccupiedCellsPure(wp, ignoreKey, _wallFootW); }
    function wallAreaFree(r,c,w,wp,ignoreKey){ return wallAreaFreePure(r,c,w,wp,ignoreKey, _wallFootW, WALL_COLS, WALL_ROWS); }
    function wallCellFromPoint(grid, x, y){ const rc=grid.getBoundingClientRect(), cw=rc.width/WALL_COLS, ch=rc.height/WALL_ROWS;
      const c=Math.floor((x-rc.left)/cw)+1, r=Math.floor((y-rc.top)/ch)+1; return { r:Math.min(WALL_ROWS,Math.max(1,r)), c:Math.min(WALL_COLS,Math.max(1,c)) }; }
    // 벽 가구 캠 렌더 — 가로 앵커는 바닥과 동일(가로 앵커 v2: camLeftCss 중앙+벽 클램프), 세로는 앵커 종류에 따라(floor/mount/hang), z=0(맨 뒤 벽 평면).
    function wallPropMarkup(p, isDock, live){
      const foot=wallFoot(p.itemId), anchor=wallAnchorOf(p.itemId);
      let vpos, fh;
      if(anchor==='floor'){        // 바닥형: 맨 뒤 바닥 가구와 동일한 '바닥선'(3+1*46=49% bottom)에 서므로 크기도 depth1(뒤) 원근으로 — 같은 바닥선의 바닥 가구와 크기 일치(벽난로가 홀로 크게 보이던 문제 해결).
        fh=furnRoomH(p.itemId, isDock, 1); vpos='bottom:'+camFurnBottom(1).toFixed(1)+'%';
      } else if(anchor==='hang'){  // 매다는형: 천장쪽 top 앵커로 아래로 늘어짐(행이 낮을수록 위)
        fh=furnWallH(p.itemId, isDock); vpos='top:'+(((p.r-1)/WALL_ROWS)*46).toFixed(1)+'%';
      } else {                     // 거는형(mount): 벽 밴드 안 bottom%(행=높이)
        fh=furnWallH(p.itemId, isDock); vpos='bottom:'+(WALL_MOUNT_BASE + (WALL_ROWS - p.r)*WALL_MOUNT_STEP).toFixed(1)+'%';
      }
      const x=camLeftCss(p.c, foot.w, fh*furnAspect(p.itemId)/2), txPct=-50;   // 가로 앵커 v2 — 바닥 propMarkup과 동일 수식(12열 간격 균등)
      const inner = live&&FURN_ANIM[p.itemId] ? furnLiveSvg(p.itemId,{h:fh}) : furnSvg(p.itemId,{h:fh});
      return '<div class="cr-prop cr-wallprop cr-wall-'+anchor+'" style="left:'+x+';'+vpos+';z-index:0;--crtx:'+txPct+'%;transform:translateX(var(--crtx));">'+inner+'</div>';
    }
    let _selWall=null;
    function selWallItem(id){ if(itemRemaining(id)<=0){ toast(catFurnName(id)+' 전부 배치됨 — 회수하거나 더 얻어야 걸 수 있어요', true); return; } _selWall=(_selWall===id?null:id); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    let _wallCat=lsGet('wallCat','all');   // 벽 팔레트 분류 — 새 taxonomy 없이 기존 WALL_ANCHOR(세움/걸이/매닮) 재사용
    const WALL_PAL_CATS=[['all','전체'],['floor','세움'],['mount','걸이'],['hang','매닮']];
    function setWallCat(v){ _wallCat=v||'all'; lsSet('wallCat',_wallCat); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    // 벽 배치 트랜잭션(전역 인벤토리 재검증·겹침 재검증). placed와 별개 wallPlaced에 기록.
    function wallPlaceItemTx(sel, r, c){ const w=wallFoot(sel).w, rid=curRoomId();
      captureUndo();
      gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoomById(g, rid); R.wallPlaced=R.wallPlaced||{};
        const qty=Number((g.owned.items[sel]||{}).qty)||0, placedAll=(typeof sumPlacedItem==='function')?sumPlacedItem(g.home.rooms, sel):0;
        if(qty-placedAll<=0) return;                                   // 남은 수량 없음(복제 차단, 바닥+벽 합산)
        if(!wallAreaFree(r,c,w,R.wallPlaced,null)) return;             // 겹침
        R.wallPlaced[r+'_'+c]={itemId:sel}; g.home.changedAt=new Date().toISOString(); return g;
      }).then(function(res){ touchHome(); if(res&&res.committed) catHaptic(12); });
    }
    // 벽 격자 탭 → 선택한 벽 가구 배치(탭 방식, 롱프레스 드래그 없음).
    function wallPlaceClick(e){
      if(_justDragged) return;                          // 드래그 직후 발생하는 click 무시(이동/드래그배치와 겹침 방지)
      const grid=$('wallGrid'); if(!grid) return;
      if(!_selWall){ toast('걸 가구를 먼저 선택하세요'); return; }
      if(itemRemaining(_selWall)<=0){ toast('배치할 수량이 없어요(랜덤박스로 획득)', true); return; }
      const w=wallFoot(_selWall).w, p=wallCellFromPoint(grid, e.clientX, e.clientY);
      let c=Math.max(1, Math.min(WALL_COLS+1-w, p.c-Math.round((w-1)/2))), r=p.r;
      if(wallAnchorOf(_selWall)==='floor') r=WALL_ROWS;   // 바닥형은 항상 맨 아래 행(바닥선) — 캠에서 바닥에 서므로 에디터도 바닥 행에 고정
      if(!wallAreaFree(r,c,w,room().wallPlaced||{},null)){ toast('그 자리엔 걸 수 없어요(겹침)', true); return; }
      wallPlaceItemTx(_selWall, r, c);
    }
    function friendWallPlacedList(fg){ const p=(friendRoom(fg).wallPlaced)||{}; return Object.keys(p).map(k=>({key:k, r:+k.split('_')[0], c:+k.split('_')[1], itemId:p[k].itemId})); }
    // 배치된 가구가 점유하는 칸 집합("r_c") — ignoreKey는 이동 중 자기 자신 제외. 바닥 아이템(러그)은 다른 가구를 막지 않음(점유에서 제외).
    function occupiedCells(placed, ignoreKey){
      const occ={}; Object.keys(placed||{}).forEach(k=>{ if(k===ignoreKey) return; if(isFloorItem(placed[k].itemId)) return;
        const pr=k.split('_'), r=+pr[0], c=+pr[1], f=itemFoot(placed[k].itemId);
        for(let dr=0;dr<f.h;dr++)for(let dc=0;dc<f.w;dc++) occ[(r+dr)+'_'+(c+dc)]=1; });
      return occ;
    }
    // (r,c)에서 w×h 발자국이 격자 안에 들어가고 다른 가구와 안 겹치는지. floorItem=true(러그)면 겹침 무시(격자 안이면 어디든 OK — 다른 가구 밑에 깔림).
    function areaFree(r,c,w,h,placed,ignoreKey,floorItem){
      if(r<1||c<1||r+h-1>GRID_ROWS||c+w-1>GRID_N) return false;   // 행(깊이)=GRID_ROWS(8)·열(가로)=GRID_N(12) 경계
      if(floorItem) return true;
      const occ=occupiedCells(placed, ignoreKey);
      for(let dr=0;dr<h;dr++)for(let dc=0;dc<w;dc++) if(occ[(r+dr)+'_'+(c+dc)]) return false;
      return true;
    }
    // 화면 좌표 → 격자 칸(1~12)
    function cellFromPoint(grid, clientX, clientY){
      const rc=grid.getBoundingClientRect(), cw=rc.width/GRID_N, ch=rc.height/GRID_ROWS;   // 가로 12칸·세로 8칸
      const c=Math.floor((clientX-rc.left)/cw)+1, r=Math.floor((clientY-rc.top)/ch)+1;
      return { r:Math.min(GRID_ROWS,Math.max(1,r)), c:Math.min(GRID_N,Math.max(1,c)) };
    }
    // 드롭 좌상단 칸 = 포인터가 발자국 "가운데"에 오도록 보정(3칸 가로면 2번째 칸 기준). 격자 안으로 클램프.
    function dropCell(grid, x, y, foot){
      const p=cellFromPoint(grid, x, y);
      let c=p.c-Math.round((foot.w-1)/2), r=p.r-Math.round((foot.h-1)/2);   // 짝수 폭(2×2)도 손가락 기준 가운데에 가깝게(floor는 한쪽으로 치우침)
      c=Math.max(1, Math.min(GRID_N+1-foot.w, c)); r=Math.max(1, Math.min(GRID_ROWS+1-foot.h, r));
      return { r, c };
    }
    // 빈 칸(그리드 배경) 탭 → 선택한 가구 배치(2×2는 그만큼 점유·겹침 방지)
    let _justDragged=false;
    function catHaptic(ms){ try{ if(navigator.vibrate) navigator.vibrate(ms||12); }catch(_){} }
    // ✨ 배치 성공 시 놓인 칸에 '톡' 링 연출 — 격자 좌표로 절대배치·자동 제거(비동기 재렌더에 잠깐 지워져도 무해).
    function placePopFx(gridId, r, c, foot){ try{ const g=$(gridId); if(!g) return;
        const el=document.createElement('div'); el.className='place-pop';
        el.style.left=(gridLeftFrac(c)*100)+'%'; el.style.top=(gridTopFrac(r)*100)+'%';
        el.style.width=(gridSpanFrac(foot.w)*100)+'%'; el.style.height=(gridRowSpanFrac(foot.h)*100)+'%';
        g.appendChild(el); setTimeout(function(){ try{ el.remove(); }catch(_){} }, 480);
      }catch(_){} }
    // 배치 트랜잭션: 남은 수량·겹침·케어 상한을 트랜잭션 안에서 재검증(비트랜잭션 .set의 복제/겹침 레이스 차단).
    function placeItemTx(sel, r, c, foot){
      if(isWallItem(sel)) return;                                       // 벽 가구는 바닥격자 배치 불가(벽꾸미기 전용)
      const rid=curRoomId();   // 보고 있는 방을 id로 겨냥
      captureUndo();
      gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoomById(g, rid); R.placed=R.placed||{};
        const qty=Number((g.owned.items[sel]||{}).qty)||0, placedAll=(typeof sumPlacedItem==='function')?sumPlacedItem(g.home.rooms, sel):0;
        if(qty-placedAll<=0) return;                                   // 남은 수량 없음(복제 차단)
        if(!areaFree(r,c,foot.w,foot.h,R.placed,null,isFloorItem(sel))) return;         // 겹침(바닥 아이템은 겹침 허용)
        if(CARE_ITEMS.indexOf(sel)>=0){ const cnt=Object.keys(R.placed).filter(k=>R.placed[k]&&R.placed[k].itemId===sel).length, cap=Math.max(1,Math.min(3,(R.active||[]).filter(id=>g.owned.cats&&g.owned.cats[id]).length)); if(cnt>=cap) return; }   // 케어=이 방 펫 수만큼(최대 3, 다묘 대응)
        R.placed[r+'_'+c]={itemId:sel}; g.home.changedAt=new Date().toISOString(); return g;
      }).then(function(res){ touchHome(); if(res&&res.committed){ placePopFx('placeGrid', r, c, foot); catHaptic(12); } });
    }
    function placeClick(e){
      if(_justDragged) return;                          // 드래그 직후 발생하는 click 무시
      const grid=$('placeGrid'); if(!grid) return;
      if(!_selItem){ toast('놓을 가구를 먼저 선택하세요'); return; }
      if(itemRemaining(_selItem)<=0){ toast('배치할 수량이 없어요(알뜰샵에서 구매)', true); return; }
      // 밥·물그릇·화장실은 이 방 펫 수만큼(최대 3) 배치 가능(다묘 대응)
      if(CARE_ITEMS.indexOf(_selItem)>=0 && itemPlaced(_selItem)>=careCap()){ toast('그 종류는 이 방 펫 수만큼(최대 3개) 놓을 수 있어요', true); return; }
      const foot=itemFoot(_selItem), cell=dropCell(grid, e.clientX, e.clientY, foot), r=cell.r, c=cell.c;   // 포인터=발자국 가운데
      const placed=room().placed||{};
      if(!areaFree(r,c,foot.w,foot.h,placed,null,isFloorItem(_selItem))){ toast('그 자리엔 놓을 수 없어요(겹침)', true); return; }
      placeItemTx(_selItem, r, c, foot);
    }
    // ---- 드래그 이동(꾹 눌러서 시작 = 롱프레스) ----
    // 화면 스크롤과 겹치지 않도록, 그리드/팔레트 항목은 '꾹 누른 뒤'에만 드래그가 시작된다.
    // 대기 중엔 preventDefault·스크롤잠금을 하지 않아 페이지 스크롤이 자유롭고, 임계치(LP_CANCEL_PX) 이상 움직이면
    // 대기를 취소해 그대로 스크롤로 넘긴다. 짧게 탭하면(대기 중 손 뗌) 그리드=메뉴 / 팔레트=선택토글.
    const LONGPRESS_MS=250, LP_CANCEL_PX=12;
    let _lp=null;                                   // 롱프레스 대기 상태
    function _tmBlock(e){ if(e.cancelable) e.preventDefault(); }              // 드래그 armed 동안 네이티브 스크롤 차단
    function lockDragScroll(){ document.body.classList.add('dragging'); document.addEventListener('touchmove', _tmBlock, {passive:false}); }
    function unlockDragScroll(){ document.body.classList.remove('dragging'); document.removeEventListener('touchmove', _tmBlock, {passive:false}); }
    // 드래그(가구·팔레트·방썸네일) 강제 취소 + 스크롤 잠금 해제 — 시트가 닫히거나 드래그 도중 재렌더로 요소가 사라져 pointerup을 못 받을 때 _tmBlock(터치 스크롤 차단)이 영구히 남는 것 방지. core.closeSheet가 호출.
    function cancelCatDrags(){
      if(_drag){ try{ _drag.el.classList.remove('drag'); _drag.el.style.transform=''; }catch(_){} _drag=null; }
      if(_pal){ try{ if(_pal.ghost) _pal.ghost.remove(); }catch(_){} _pal=null; }
      if(_rmDrag){ _rmDrag=null; }
      if(_wdrag){ try{ _wdrag.el.classList.remove('drag'); _wdrag.el.style.transform=''; }catch(_){} _wdrag=null; }
      if(_wpal){ try{ if(_wpal.ghost) _wpal.ghost.remove(); }catch(_){} _wpal=null; }
      if(typeof hideDropPreview==='function') hideDropPreview();
      if(typeof hideWallDropPreview==='function') hideWallDropPreview();
      unlockDragScroll();
    }
    function clearLongPress(){ if(!_lp) return; const p=_lp; _lp=null; clearTimeout(p.timer);
      p.el.removeEventListener('pointermove', p.onMove); p.el.removeEventListener('pointerup', p.onUp); p.el.removeEventListener('pointercancel', p.onCancel);
      if(p.el.classList) p.el.classList.remove('lp-hold'); }
    // 공통 롱프레스 게이트: 꾹 누르면 arm() 실행, 짧게 떼면 tap() 실행, 임계치 이상 움직이면 취소(스크롤).
    function beginLongPress(e, arm, tap){
      const el=e.currentTarget, sx=e.clientX, sy=e.clientY; clearLongPress();
      const onMove=(ev)=>{ if(Math.abs(ev.clientX-sx)+Math.abs(ev.clientY-sy)>LP_CANCEL_PX) clearLongPress(); };
      const onUp=()=>{ clearLongPress(); tap(); };
      const onCancel=()=>{ clearLongPress(); };
      el.addEventListener('pointermove', onMove); el.addEventListener('pointerup', onUp); el.addEventListener('pointercancel', onCancel);
      el.classList.add('lp-hold');
      const timer=setTimeout(()=>{ _lp=null;
        el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerup', onUp); el.removeEventListener('pointercancel', onCancel);
        el.classList.remove('lp-hold');
        try{ if(navigator.vibrate) navigator.vibrate(12); }catch(_){}    // 집어든 순간 살짝 진동 피드백
        arm(el, sx, sy);
      }, LONGPRESS_MS);
      _lp={ el, timer, onMove, onUp, onCancel };
    }

    let _drag=null;
    function giDown(e, key){
      e.stopPropagation();
      const grid=$('placeGrid'); if(!grid) return; const pid=e.pointerId;
      beginLongPress(e,
        (el, sx, sy)=>{                              // arm: 꾹 눌러 집어듦 → 드래그 시작
          _drag={ key, el, grid, sx, sy, foot:itemFoot(placedItemId(key)) };
          lockDragScroll();
          try{ el.setPointerCapture(pid); }catch(_){}
          el.classList.add('drag');
          el.onpointermove=giMove; el.onpointerup=giUp; el.onpointercancel=giUp;
        },
        ()=>{ openItemMenu(key); });                 // tap: 메뉴
    }
    function giMove(e){
      if(!_drag) return;
      const dx=e.clientX-_drag.sx, dy=e.clientY-_drag.sy;
      _drag.el.style.transform='translate('+dx+'px,'+dy+'px)';
      const cell=dropCell(_drag.grid, e.clientX, e.clientY, _drag.foot);
      showDropPreview(cell.r, cell.c, _drag.foot, _drag.key, isFloorItem(placedItemId(_drag.key)));
    }
    function giUp(e){
      if(!_drag) return; const d=_drag; _drag=null;
      unlockDragScroll();
      d.el.onpointermove=null; d.el.onpointerup=null; d.el.onpointercancel=null;
      hideDropPreview(); d.el.classList.remove('drag');
      _justDragged=true; setTimeout(()=>{ _justDragged=false; }, 80);
      const cell=dropCell(d.grid, e.clientX, e.clientY, d.foot), r=cell.r, c=cell.c, newKey=r+'_'+c;
      const placed=room().placed||{};
      const resetEl=()=>{ d.el.style.transform=''; };
      if(newKey===d.key){ resetEl(); return; }
      if(!areaFree(r,c,d.foot.w,d.foot.h,placed,d.key,isFloorItem(placedItemId(d.key)))){ toast('그 자리엔 놓을 수 없어요(겹침)', true); resetEl(); return; }
      const id=placed[d.key]&&placed[d.key].itemId; if(!id){ resetEl(); return; }
      // ⚡ 낙관적 드롭 — 커밋을 기다리지 않고 즉시 새 칸에 스냅(느린 커밋 시 '원위치 튕김→점프' 깜빡임 제거). 실패하면 리스너/재렌더가 원위치 복원.
      d.el.style.transform=''; d.el.style.left=(gridLeftFrac(c)*100)+'%'; d.el.style.top=(gridTopFrac(r)*100)+'%';
      // 이동도 트랜잭션(자기 제외 겹침 재검증) — 리스너가 재렌더. 보고 있는 방을 id로 겨냥.
      captureUndo();
      const rid=curRoomId();
      gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoomById(g, rid); const pl=R.placed||{};
        const it=pl[d.key]; if(!it) return;                               // 원본 없음(레이스)
        if(!areaFree(r,c,d.foot.w,d.foot.h,pl,d.key,isFloorItem(it.itemId))) return;             // 겹침(자기 제외, 바닥 아이템은 허용)
        delete pl[d.key]; pl[newKey]=it; g.home.changedAt=new Date().toISOString(); return g;
      }).then(res=>{ if(res&&res.committed) touchHome(); else if(state._sheetRefresh) state._sheetRefresh(); });   // 실패(레이스) 시 재렌더로 원위치
    }
    // ---- 팔레트 항목을 그리드로 드래그해 새로 배치(꾹 눌러 드래그, 짧게 탭하면 선택 토글) ----
    let _pal=null;
    function palDown(e, id){
      beginLongPress(e,
        (el, sx, sy)=>{                              // arm: 꾹 눌러 집어듦 → 고스트 생성·배치 시작
          if(itemRemaining(id)<=0){ toast(catFurnName(id)+' 남은 수량이 없어요(알뜰샵에서 구매)', true); return; }
          _pal={ id, foot:itemFoot(id), sx, sy, ghost:null };
          lockDragScroll();
          const g=document.createElement('div'); g.className='palghost'; g.innerHTML=furnSvg(id,{h:44});
          g.style.left=sx+'px'; g.style.top=sy+'px'; document.body.appendChild(g); _pal.ghost=g;
          window.addEventListener('pointermove', palMove); window.addEventListener('pointerup', palUp); window.addEventListener('pointercancel', palUp);
        },
        ()=>{ selItem(id); });                       // tap: 선택 토글
    }
    function palMove(e){
      if(!_pal) return;
      if(_pal.ghost){ _pal.ghost.style.left=e.clientX+'px'; _pal.ghost.style.top=e.clientY+'px'; }
      const grid=$('placeGrid'); if(!grid) return; const r=grid.getBoundingClientRect();
      if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){ const cell=dropCell(grid,e.clientX,e.clientY,_pal.foot); showDropPreview(cell.r,cell.c,_pal.foot,null,isFloorItem(_pal.id)); }
      else hideDropPreview();
    }
    function palUp(e){
      if(!_pal) return; const d=_pal; _pal=null;
      unlockDragScroll();
      window.removeEventListener('pointermove',palMove); window.removeEventListener('pointerup',palUp); window.removeEventListener('pointercancel',palUp);
      if(d.ghost) d.ghost.remove(); hideDropPreview();
      if(e.type==='pointercancel') return;      // 취소 → 배치 안 함
      const grid=$('placeGrid'); if(!grid) return; const r=grid.getBoundingClientRect();
      if(!(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)) return;   // 그리드 밖에 놓으면 취소
      if(itemRemaining(d.id)<=0){ toast('남은 수량이 없어요', true); return; }
      if(CARE_ITEMS.indexOf(d.id)>=0 && itemPlaced(d.id)>=careCap()){ toast('그 종류는 이 방 펫 수만큼(최대 3개) 놓을 수 있어요', true); return; }
      const cell=dropCell(grid,e.clientX,e.clientY,d.foot), rr=cell.r, cc=cell.c;
      const placed=room().placed||{};
      if(!areaFree(rr,cc,d.foot.w,d.foot.h,placed,null,isFloorItem(d.id))){ toast('그 자리엔 놓을 수 없어요(겹침)', true); return; }
      placeItemTx(d.id, rr, cc, d.foot);
    }
    function catFurnName(id){ const it=ITEM_CATALOG.find(x=>x.id===id); return it?it.name:id; }
    function showDropPreview(r,c,foot,key,floorItem){
      const g=$('gdrop'); if(!g) return; const placed=room().placed||{};
      const rr=Math.min(GRID_ROWS+1-foot.h,Math.max(1,r)), cc=Math.min(GRID_N+1-foot.w,Math.max(1,c));
      const ok=areaFree(rr,cc,foot.w,foot.h,placed,key,floorItem);
      g.hidden=false; g.className='gdrop'+(ok?'':' bad');
      g.style.left=(gridLeftFrac(cc)*100)+'%'; g.style.top=(gridTopFrac(rr)*100)+'%';
      g.style.width=(gridSpanFrac(foot.w)*100)+'%'; g.style.height=(gridRowSpanFrac(foot.h)*100)+'%';
      // 🧲 정렬 스냅 가이드(벽꾸미기 wsnap 로직 이식) — 드래그 항목 중심이 격자 중앙/다른 가구 중심과 맞으면 점선 가이드.
      const gv=$('fsnap'); if(gv){ const cen=(cc-1)+foot.w/2; let align=null;
        if(Math.abs(cen-GRID_N/2)<0.001) align=GRID_N/2;   // 격자 가로 중앙
        else Object.keys(placed).forEach(k=>{ if(k===key||!placed[k]) return; const pr=k.split('_'), oc=+pr[1], of=itemFoot(placed[k].itemId), ocen=(oc-1)+of.w/2; if(Math.abs(cen-ocen)<0.001) align=ocen; });
        if(align!=null){ gv.hidden=false; gv.style.left=(align/GRID_N*100)+'%'; } else gv.hidden=true; }
      const gh=$('fsnaph'); if(gh){ const rcen=(rr-1)+foot.h/2; let ralign=null;   // 세로 중심 정렬(같은 앞뒤 깊이의 가구와)
        Object.keys(placed).forEach(k=>{ if(k===key||!placed[k]) return; const pr=k.split('_'), or_=+pr[0], of=itemFoot(placed[k].itemId), ocen=(or_-1)+of.h/2; if(Math.abs(rcen-ocen)<0.001) ralign=ocen; });
        if(ralign!=null){ gh.hidden=false; gh.style.top=(ralign/GRID_ROWS*100)+'%'; } else gh.hidden=true; }
    }
    function hideDropPreview(){ const g=$('gdrop'); if(g) g.hidden=true; const gv=$('fsnap'); if(gv) gv.hidden=true; const gh=$('fsnaph'); if(gh) gh.hidden=true; }
    // ---- 벽꾸미기 격자 드래그(방꾸미기 로직 이식) — 세로 4칸(WALL_ROWS)·깊이 없음, 겹침만 검증 ----
    function wallDropCell(grid, x, y, w){   // 포인터=발자국 가운데, 벽 격자로 클램프
      const p=wallCellFromPoint(grid, x, y);
      let c=p.c-Math.round((w-1)/2), r=p.r;
      c=Math.max(1, Math.min(WALL_COLS+1-w, c)); r=Math.max(1, Math.min(WALL_ROWS, r));
      return { r, c };
    }
    function showWallDropPreview(r,c,w,key){
      const g=$('wgdrop'); if(!g) return; const wp=room().wallPlaced||{};
      const rr=Math.min(WALL_ROWS,Math.max(1,r)), cc=Math.min(WALL_COLS+1-w,Math.max(1,c));
      const ok=wallAreaFree(rr,cc,w,wp,key);
      g.hidden=false; g.className='gdrop'+(ok?'':' bad');
      g.style.left=(gridLeftFrac(cc)*100)+'%'; g.style.top=(((rr-1)/WALL_ROWS)*100)+'%';
      g.style.width=(gridSpanFrac(w)*100)+'%'; g.style.height=(100/WALL_ROWS)+'%';
      // 🧲 정렬 스냅 가이드: 드래그 항목 중심 열이 다른 벽 가구 중심 또는 격자 중앙과 맞으면 세로 가이드선 표시.
      const gv=$('wsnap'); if(gv){ const cen=(cc-1)+w/2; let align=null;
        if(Math.abs(cen-WALL_COLS/2)<0.001) align=WALL_COLS/2;   // 격자 중앙
        else Object.keys(wp).forEach(k=>{ if(k===key) return; const pr=k.split('_'), oc=+pr[1], ow=wallFoot(wp[k].itemId).w, ocen=(oc-1)+ow/2; if(Math.abs(cen-ocen)<0.001) align=ocen; });
        if(align!=null){ gv.hidden=false; gv.style.left=(align/WALL_COLS*100)+'%'; } else gv.hidden=true; }
      const gh=$('wsnaph'); if(gh){ let ralign=null;   // 가로 가이드: 같은 행에 다른 벽 가구가 있으면 표시
        Object.keys(wp).forEach(k=>{ if(k===key) return; if(+k.split('_')[0]===rr) ralign=rr; });
        if(ralign!=null){ gh.hidden=false; gh.style.top=(((ralign-0.5)/WALL_ROWS)*100)+'%'; } else gh.hidden=true; }
    }
    function hideWallDropPreview(){ const g=$('wgdrop'); if(g) g.hidden=true; const gv=$('wsnap'); if(gv) gv.hidden=true; const gh=$('wsnaph'); if(gh) gh.hidden=true; }
    // 배치된 벽 가구 드래그로 이동(꾹 눌러 시작=롱프레스, 짧게 탭=회수/판매 메뉴)
    let _wdrag=null;
    function wallGiDown(e, key){
      e.stopPropagation();
      const grid=$('wallGrid'); if(!grid) return; const pid=e.pointerId;
      beginLongPress(e,
        (el, sx, sy)=>{ _wdrag={ key, el, grid, sx, sy, w:wallFoot(wallPlacedItemId(key)).w };
          lockDragScroll(); try{ el.setPointerCapture(pid); }catch(_){}
          el.classList.add('drag');
          el.onpointermove=wallGiMove; el.onpointerup=wallGiUp; el.onpointercancel=wallGiUp; },
        ()=>{ openItemMenu(key, true); });
    }
    function wallGiMove(e){
      if(!_wdrag) return;
      const dx=e.clientX-_wdrag.sx, dy=e.clientY-_wdrag.sy;
      _wdrag.el.style.transform='translate('+dx+'px,'+dy+'px)';
      const cell=wallDropCell(_wdrag.grid, e.clientX, e.clientY, _wdrag.w);
      showWallDropPreview(wallSnapRow(wallPlacedItemId(_wdrag.key), cell.r), cell.c, _wdrag.w, _wdrag.key);
    }
    function wallGiUp(e){
      if(!_wdrag) return; const d=_wdrag; _wdrag=null;
      unlockDragScroll();
      d.el.onpointermove=null; d.el.onpointerup=null; d.el.onpointercancel=null;
      hideWallDropPreview(); d.el.classList.remove('drag');
      _justDragged=true; setTimeout(()=>{ _justDragged=false; }, 80);
      const cell=wallDropCell(d.grid, e.clientX, e.clientY, d.w), c=cell.c, r=wallSnapRow(wallPlacedItemId(d.key), cell.r), newKey=r+'_'+c;
      const resetEl=()=>{ d.el.style.transform=''; };
      if(newKey===d.key){ resetEl(); return; }
      const wp=room().wallPlaced||{};
      if(!wallAreaFree(r,c,d.w,wp,d.key)){ toast('그 자리엔 걸 수 없어요(겹침)', true); resetEl(); return; }
      // ⚡ 낙관적 드롭(바닥 giUp과 동일) — 즉시 새 칸 스냅, 실패 시 재렌더 복원
      d.el.style.transform=''; d.el.style.left=(gridLeftFrac(c)*100)+'%'; d.el.style.top=(((r-1)/WALL_ROWS)*100)+'%';
      captureUndo();
      const rid=curRoomId();
      gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoomById(g, rid); const pl=R.wallPlaced||{};
        const it=pl[d.key]; if(!it) return;                               // 원본 없음(레이스)
        if(!wallAreaFree(r,c,d.w,pl,d.key)) return;                        // 겹침(자기 제외)
        delete pl[d.key]; pl[newKey]=it; g.home.changedAt=new Date().toISOString(); return g;
      }).then(res=>{ if(res&&res.committed) touchHome(); else if(state._sheetRefresh) state._sheetRefresh(); });
    }
    // 팔레트 벽 가구를 벽 격자로 드래그해 새로 배치(꾹 눌러 드래그, 짧게 탭=선택 토글)
    let _wpal=null;
    function wallPalDown(e, id){
      beginLongPress(e,
        (el, sx, sy)=>{ if(itemRemaining(id)<=0){ toast(catFurnName(id)+' 남은 수량이 없어요(랜덤박스로 획득)', true); return; }
          _wpal={ id, w:wallFoot(id).w, sx, sy, ghost:null };
          lockDragScroll();
          const g=document.createElement('div'); g.className='palghost'; g.innerHTML=furnSvg(id,{h:44});
          g.style.left=sx+'px'; g.style.top=sy+'px'; document.body.appendChild(g); _wpal.ghost=g;
          window.addEventListener('pointermove', wallPalMove); window.addEventListener('pointerup', wallPalUp); window.addEventListener('pointercancel', wallPalUp); },
        ()=>{ selWallItem(id); });
    }
    function wallPalMove(e){
      if(!_wpal) return;
      if(_wpal.ghost){ _wpal.ghost.style.left=e.clientX+'px'; _wpal.ghost.style.top=e.clientY+'px'; }
      const grid=$('wallGrid'); if(!grid) return; const r=grid.getBoundingClientRect();
      if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){ const cell=wallDropCell(grid,e.clientX,e.clientY,_wpal.w); showWallDropPreview(wallSnapRow(_wpal.id,cell.r),cell.c,_wpal.w,null); }
      else hideWallDropPreview();
    }
    function wallPalUp(e){
      if(!_wpal) return; const d=_wpal; _wpal=null;
      unlockDragScroll();
      window.removeEventListener('pointermove',wallPalMove); window.removeEventListener('pointerup',wallPalUp); window.removeEventListener('pointercancel',wallPalUp);
      if(d.ghost) d.ghost.remove(); hideWallDropPreview();
      if(e.type==='pointercancel') return;      // 취소 → 배치 안 함
      const grid=$('wallGrid'); if(!grid) return; const r=grid.getBoundingClientRect();
      if(!(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom)) return;   // 격자 밖 → 취소
      if(itemRemaining(d.id)<=0){ toast('남은 수량이 없어요', true); return; }
      const cell=wallDropCell(grid,e.clientX,e.clientY,d.w), cc=cell.c, rr=wallSnapRow(d.id, cell.r);
      if(!wallAreaFree(rr,cc,d.w,room().wallPlaced||{},null)){ toast('그 자리엔 걸 수 없어요(겹침)', true); return; }
      wallPlaceItemTx(d.id, rr, cc);
    }
    // ---- 배치된 가구 탭 → 회수/판매 메뉴 ----
    function openItemMenu(key, wall){
      closeItemMenu();
      const map=wall?(room().wallPlaced||{}):(room().placed||{}), p=map[key]; if(!p) return;
      const it=ITEM_CATALOG.find(x=>x.id===p.itemId)||{}, wf=wall?'true':'false';
      const ft=itemTierOf(p.itemId), foot=itemFoot(p.itemId);
      const wrap=document.createElement('div'); wrap.id='giMenu'; wrap.className='gimenu-scrim';
      wrap.onclick=function(e){ if(e.target===wrap) closeItemMenu(); };
      wrap.innerHTML='<div class="gimenu"><div class="gih">'+furnSvg(p.itemId,{h:34})+'<b>'+escapeHtml(it.name||p.itemId)+'</b></div>'+
        '<div class="pi-meta"><span class="pi-tier">'+tierLabelHtml(ft)+'</span><span class="s">'+(it.desc?escapeHtml(it.desc)+' · ':'')+'크기 '+foot.w+'×'+foot.h+'</span></div>'+   // 등급·설명·크기
        (!wall?'<button class="gib" '+App.view.act('toggleFlip',key)+'><b>좌우 반전</b><span>가구를 좌우로 뒤집어요</span></button>':'')+
        '<button class="gib" '+App.view.act('retrievePlaced',key,wf)+'><b>회수</b><span>인벤토리로 되돌려요(보유 유지)</span></button>'+
        '<button class="gib sell" '+App.view.act('sellPlaced',key,wf)+'><b>판매</b><span>+'+ITEM_SELL+' 은화 · 보유에서 제거</span></button>'+
        '<button class="gib ghost" '+App.view.act('closeItemMenu')+'>닫기</button></div>';
      document.body.appendChild(wrap);
    }
    function closeItemMenu(){ const m=$('giMenu'); if(m) m.remove(); }
    function toggleFlip(key){ const rid=curRoomId(); captureUndo();
      gameRef().transaction(function(g){ g=normalizeGame(g); const R=gRoomById(g,rid); const M=R.placed||{}; const it=M[key]; if(!it) return; it.flip=!it.flip; return g; }).then(function(){ touchHome(); if(typeof catHaptic==='function') catHaptic(8); }); closeItemMenu(); }
    function retrievePlaced(key, wall){ captureUndo(); roomTx(curRoomId(), roomIdx(), R=>{ const M=wall?(R.wallPlaced=R.wallPlaced||{}):(R.placed=R.placed||{}); delete M[key]; }); closeItemMenu(); toast('회수했어요(인벤토리로)'); }   // roomTx가 changedAt까지 갱신
    // 판매 진입 게이트 — 특별(epic)↑ 등급은 랜덤박스 전용이라 재획득이 어려운데 판매가는 정액(ITEM_SELL)이라, 실수 판매를 확인 시트로 한 번 막는다(회수/판매 버튼이 붙어 있어 오조작 위험).
    function sellPlaced(key, wall){
      const map0=wall?(room().wallPlaced||{}):(room().placed||{}), p0=map0[key]; if(!p0){ closeItemMenu(); return; }
      closeItemMenu();   // 모달을 먼저 닫아야 확인 시트가 보인다(clearRoom과 동일)
      if(tierRank(itemTierOf(p0.itemId)) >= tierRank('epic')){
        const it=ITEM_CATALOG.find(x=>x.id===p0.itemId)||{};
        confirmSheet('\''+(it.name||p0.itemId)+'\'은(는) '+tierInfo(itemTierOf(p0.itemId)).name+' 등급 가구예요.\n판매하면 +'+ITEM_SELL+' 은화만 받고 보유에서 사라져요(재획득은 랜덤박스에서만). 판매할까요?',
          ()=>_sellPlacedNow(key, wall), {title:'가구 판매', okLabel:'판매', danger:true});
        return;
      }
      _sellPlacedNow(key, wall);
    }
    function _sellPlacedNow(key, wall){
      captureUndo();
      const map=wall?(room().wallPlaced||{}):(room().placed||{}), p=map[key]; if(!p) return;
      const id=p.itemId, rid=curRoomId();
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        const R=gRoomById(g, rid); const M=wall?(R.wallPlaced||{}):(R.placed||{}); if(!M[key]) return g;   // 이미 없음(중복 방지)
        delete M[key];
        const inv=g.owned.items[id];
        if(inv){ inv.qty=Math.max(0,(Number(inv.qty)||0)-1); if(inv.qty<=0) delete g.owned.items[id]; }
        g.coins += ITEM_SELL;
        g.home.changedAt=new Date().toISOString();
        return g;
      }).then(r=>{ if(r&&r.committed) toast('+'+ITEM_SELL+' 은화에 판매했어요'); });
    }
    let _placeMode='floor';   // 'floor'=방꾸미기(바닥 12×12) / 'wall'=벽꾸미기(벽 12×4)
    function setPlaceMode(m){ _placeMode=m; if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    // 배치 인벤토리 분류 — 보유 가구를 케어/휴식/놀이/장식 탭으로 나눠 보여준다(펫 인벤토리와 동일한 방식·정렬/검색 없음).
    const PLACE_CATS = [['care','케어'],['rest','휴식'],['play','놀이'],['decor','장식']];
    function placeCatOf(id){ const it=ITEM_CATALOG.find(x=>x.id===id); return (it&&it.cat)||'decor'; }   // 분류 단일 소스 = ITEM_CATALOG 의 cat 필드(없으면 장식 폴백)
    let _placeCat=null;
    // 탭 전환은 시트 전체를 재빌드(_sheetRefresh)한다. 펫 그리드(수백 타일)와 달리 가구는 ~20종뿐이라 부분 메모이즈(petTileHtml류)는 불필요 — 의도적으로 단순 유지.
    function setPlaceCat(c){ _placeCat=c; if(_selItem && placeCatOf(_selItem)!==c) _selItem=null; if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }   // 탭을 벗어난 선택은 해제 — "보이는 것만 선택됨" 유지(안 보이는 가구가 그리드 탭에 놓이는 혼동 방지)
    // 팔레트 아이콘 높이 = 방 렌더 크기(ROOM_H)에 sqrt로 완만 비례(작은 그릇은 작게·큰 캣타워는 크게, 극단비 압축). 16~30px 클램프.
    function palPicH(id){ const rh=(ROOM_H[id]||1); return Math.max(16,Math.min(30,Math.round(11+Math.sqrt(rh)*7.5))); }
    // 빈 격자 첫 사용 안내(격자 안 오버레이)
    function emptyGridHint(){ return '<div class="pe-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg><span>아래 가구를 <b>꾹 눌러</b> 격자로 끌어다 놓아보세요</span></div>'; }
    // 되돌리기(다단계) — 배치 변경 직전 현재 방 스냅샷을 방별 스택에 push, 버튼으로 최근 것부터 복원(최대 UNDO_MAX). 방마다 독립 스택.
    const UNDO_MAX=8;
    let _undoStacks={};   // roomId → [snap,...]. 배치·이동·회수·자동정리·벽지/바닥 변경이 모두 captureUndo로 push.
    function captureUndo(){ try{ const r=room(), rid=curRoomId(); const st=_undoStacks[rid]||(_undoStacks[rid]=[]);
        st.push({ placed:Object.assign({},r.placed||{}), wallPlaced:Object.assign({},r.wallPlaced||{}), wallpaper:r.wallpaper||'default', floor:r.floor||'default', active:(r.active||[]).slice(), poops:r.poops||0 });   // active·poops도 스냅샷 — '이 방 비우기'(펫·똥 제거) 되돌리기 때 복원(다른 경로엔 안 바뀐 값이라 무해)
        if(st.length>UNDO_MAX) st.shift();
      }catch(e){} }
    function undoCount(){ const st=_undoStacks[curRoomId()]; return st?st.length:0; }
    function undoPlace(){ const rid=curRoomId(), st=_undoStacks[rid]; if(!st||!st.length) return; const s=st.pop();
      roomTx(rid, roomIdx(), R=>{ R.placed=s.placed; R.wallPlaced=s.wallPlaced; if(s.wallpaper!=null) R.wallpaper=s.wallpaper; if(s.floor!=null) R.floor=s.floor; if(s.active) R.active=s.active; if(s.poops!=null) R.poops=s.poops; }, ()=>{ if(state._sheetRefresh) state._sheetRefresh(); const n=undoCount(); toast('되돌렸어요'+(n?(' · '+n+'단계 더'):'')); }); }
    // ✨ 가구 자동 정리 — 현재 방 배치를 뒤→앞·발자국 큰 것부터·등급순으로 격자에 다시 채운다(펫은 자율이라 미변경, 벽지·바닥·똥·펫 그대로).
    //    기존 배치 헬퍼만 재사용(areaFree/occupiedCells/isFloorItem/CARE_ITEMS/wallAreaFree/captureUndo/roomTx). filledAt(그릇 채움) 보존. 지오메트리(camDepth/camZ/splitProps)는 렌더타임 그대로.
    function autoArrangeRoom(){
      const rid=curRoomId(), ridx=roomIdx();   // 확인시트 열기 전 방을 고정 — 멀티기기 원격 방전환 시 엉뚱한 방에 쓰는 것 방지
      const fl=placedList(), wl=wallPlacedList();
      if(!fl.length && !wl.length){ toast('정리할 가구가 없어요'); return; }
      confirmSheet('가구 배치를 뒤→앞·크기 순으로 자동 정리할까요?\n(가구만 옮겨요 · 펫·벽지·바닥은 그대로 · 되돌리기 가능)', function(){
        if(curRoomId()!==rid){ toast('방이 바뀌어 정리를 취소했어요', true); return; }   // 확인 대기 중 방이 바뀌었으면 취소(멀티기기 클로버 방지)
        const cell=function(p){ const o={itemId:p.itemId}; if(p.filledAt) o.filledAt=p.filledAt; if(p.fillMs) o.fillMs=p.fillMs; if(p.flip) o.flip=p.flip; return o; };   // filledAt·fillMs·flip 보존
        // ── 바닥 격자(12×8) ──
        const out={}, leftover=[];
        const floors=fl.filter(function(p){ return isFloorItem(p.itemId); });
        const regs=fl.filter(function(p){ return !isFloorItem(p.itemId); });
        // 바닥 아이템(러그·연못): 겹침 허용 → 서로 다른 키로 뒤쪽부터 깔기(z:0 베이스)
        floors.forEach(function(p){ const f=itemFoot(p.itemId); let done=false;
          for(let r=1;r+f.h-1<=GRID_ROWS && !done;r++) for(let c=1;c+f.w-1<=GRID_N && !done;c++){ const k=r+'_'+c; if(!out[k] && areaFree(r,c,f.w,f.h,out,null,true)){ out[k]=cell(p); done=true; } }
          if(!done) leftover.push(p); });
        // 큰 가구(발자국≥2)=뒷줄부터, 케어(밥·물·화장실)=앞줄에 나란히 묶어서, 작은 소품=그 뒤 앞줄부터 — 방 전체에 깊이감 있게 펼침(큰 쇼피스=뒤, 케어·작은 소품=앞이라 펫이 닿기 쉬움).
        const isCare=function(p){ return CARE_ITEMS.indexOf(p.itemId)>=0; };
        const care=regs.filter(isCare);
        const big=regs.filter(function(p){ const f=itemFoot(p.itemId); return !isCare(p) && f.w*f.h>=2; });
        const small=regs.filter(function(p){ const f=itemFoot(p.itemId); return !isCare(p) && f.w*f.h<2; });
        care.sort(function(a,b){ return (CARE_ITEMS.indexOf(a.itemId)-CARE_ITEMS.indexOf(b.itemId)) || (a.itemId<b.itemId?-1:1); });   // 밥→물→화장실 순으로 묶기
        big.sort(function(a,b){ const fa=itemFoot(a.itemId),fb=itemFoot(b.itemId); return (fb.w*fb.h)-(fa.w*fa.h) || (tierRank(itemTierOf(b.itemId))-tierRank(itemTierOf(a.itemId))) || (a.itemId<b.itemId?-1:1); });
        small.sort(function(a,b){ return (tierRank(itemTierOf(b.itemId))-tierRank(itemTierOf(a.itemId))) || (a.itemId<b.itemId?-1:1); });
        big.forEach(function(p){ const f=itemFoot(p.itemId); let done=false;
          for(let r=1;r+f.h-1<=GRID_ROWS && !done;r++) for(let c=1;c+f.w-1<=GRID_N && !done;c++){ const k=r+'_'+c; if(!out[k] && areaFree(r,c,f.w,f.h,out,null,false)){ out[k]=cell(p); done=true; } }
          if(!done) leftover.push(p); });   // 뒤→앞 first-fit
        care.forEach(function(p){ const f=itemFoot(p.itemId); let done=false;
          for(let r=GRID_ROWS;r>=1 && !done;r--) for(let c=1;c+f.w-1<=GRID_N && !done;c++){ const k=r+'_'+c; if(!out[k] && areaFree(r,c,f.w,f.h,out,null,false)){ out[k]=cell(p); done=true; } }
          if(!done) leftover.push(p); });   // 케어=앞줄부터 나란히(먼저 놓아 연속 칸에 묶임)
        small.forEach(function(p){ let done=false;
          for(let r=GRID_ROWS;r>=1 && !done;r--) for(let c=1;c<=GRID_N && !done;c++){ const k=r+'_'+c; if(!out[k] && areaFree(r,c,1,1,out,null,false)){ out[k]=cell(p); done=true; } }
          if(!done) leftover.push(p); });   // 앞→뒤 first-fit(1×1)
        // ── 벽 격자(12×4) ── 앵커별 선호 행(바닥형=맨 아래·매다는형=천장쪽·거는형=중간)에 좌→우로 채움
        const wout={}, wleft=[];
        wl.slice().sort(function(a,b){ return wallFoot(b.itemId).w-wallFoot(a.itemId).w; }).forEach(function(p){
          const w=wallFoot(p.itemId).w, anchor=wallAnchorOf(p.itemId);
          const rows = anchor==='floor'?[WALL_ROWS] : (anchor==='hang'?[1,2] : [2,3,1,4]);
          let done=false;
          for(let ri=0;ri<rows.length && !done;ri++){ const r=rows[ri];
            for(let c=1;c+w-1<=WALL_COLS && !done;c++){ const k=r+'_'+c; if(!wout[k] && wallAreaFree(r,c,w,wout,null)){ wout[k]=cell(p); done=true; } } }
          if(!done) wleft.push(p); });
        // ── 중앙 정렬: 배치 전체 바운딩박스를 가로 중앙으로 이동(모든 칸 균일 시프트=충돌 안전, 왼쪽 쏠림 해소) ──
        const centerCols=function(dict, cols, footFn){ const keys=Object.keys(dict); if(!keys.length) return dict;
          let minC=Infinity,maxC=-Infinity; keys.forEach(function(k){ const c=+k.split('_')[1], w=footFn(dict[k].itemId).w; if(c<minC)minC=c; if(c+w-1>maxC)maxC=c+w-1; });
          const shift=Math.floor(((cols-maxC)-(minC-1))/2); if(!shift) return dict;
          const nd={}; keys.forEach(function(k){ const pr=k.split('_'); nd[pr[0]+'_'+(+pr[1]+shift)]=dict[k]; }); return nd; };   // 균일 이동이라 상대 위치·겹침 그대로 유지
        const outC=centerCols(out, GRID_N, itemFoot), woutC=centerCols(wout, WALL_COLS, wallFoot);
        // ── 커밋(단일 roomTx, captureUndo로 한 번에 되돌리기) ──
        captureUndo();
        roomTx(rid, ridx, function(R){ R.placed=outC; R.wallPlaced=woutC; }, function(){
          openCatHouse('place');   // 확인시트로 닫힌 알뜰홈을 배치 탭으로 다시 열어 정렬 결과·되돌리기 버튼 노출
          const nleft=leftover.length+wleft.length;
          toast(nleft?('가구를 정리했어요 ✨ · 자리가 부족한 '+nleft+'개는 대기(인벤토리로)'):'가구를 정리했어요 ✨'); });
      });
    }
    function placeActionsBar(){ const r=room(); const hasAny=Object.keys(r.placed||{}).length||Object.keys(r.wallPlaced||{}).length;
      const canUndo=undoCount()>0;
      if(!hasAny && !canUndo) return '';
      return '<div class="placeacts">'+
        (hasAny?'<button class="pa-btn" '+App.view.act('autoArrangeRoom')+' aria-label="가구 자동 정리(뒤→앞·크기순)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>자동 정리</button>':'')+
        (canUndo?'<button class="pa-btn" '+App.view.act('undoPlace')+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>되돌리기'+(undoCount()>1?' <b>'+undoCount()+'</b>':'')+'</button>':'')+
        (hasAny?'<button class="pa-btn danger" onclick="captureUndo();clearRoom(curRoomId(),roomIdx())"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>이 방 비우기</button>':'')+
      '</div>'; }
    function catPlaceHtml(){
      const wallMode=_placeMode==='wall';
      const _fc=Object.keys(room().placed||{}).length, _wc=Object.keys(room().wallPlaced||{}).length;   // 📦 이 방 배치 요약
      const toggle='<div class="subseg placemode">'+
        '<button class="'+(!wallMode?'on':'')+'" '+App.view.act('setPlaceMode','floor')+'>방꾸미기</button>'+
        '<button class="'+(wallMode?'on':'')+'" '+App.view.act('setPlaceMode','wall')+'>벽꾸미기</button></div>'+
        '<div class="place-meter">이 방 배치 <b>'+(_fc+_wc)+'</b>개 — 바닥 '+_fc+' · 벽 '+_wc+'</div>';
      // ---- 미니 웹캠 프리뷰: 바닥+벽 배치를 함께 보여줌(표시 전용) ----
      const plist=placedList().sort((a,b)=>a.r-b.r); distributePoops(plist);
      const previewProps=wallPlacedList().map(p=>wallPropMarkup(p,true,false)).join('')+plist.map(p=>propMarkup(p,true)).join('');
      const preview='<div class="miniroom">'+roomShellBase(currentWall(), currentFloor())+'<span class="cr-cam"><i></i>미리보기</span><div class="cr-props">'+previewProps+'</div></div>';
      let body;
      if(wallMode){
        // 벽 격자(12×4): 위=천장, 아래=바닥선. 탭으로 배치, 배치된 항목 탭=회수/판매.
        const wp=room().wallPlaced||{};
        const witems=Object.keys(wp).map(key=>{ const pr=key.split('_'), r=+pr[0], c=+pr[1], id=wp[key].itemId, w=wallFoot(id).w;
          const left=(gridLeftFrac(c)*100).toFixed(3), top=(((r-1)/WALL_ROWS)*100).toFixed(3), ww=(gridSpanFrac(w)*100).toFixed(3), hh=(100/WALL_ROWS).toFixed(3);
          return '<div class="gitem" style="left:'+left+'%;top:'+top+'%;width:'+ww+'%;height:'+hh+'%" onpointerdown="wallGiDown(event,\''+key+'\')" onclick="event.stopPropagation()"><span class="gsc">'+furnSvg(id,{fit:true})+'</span></div>'; }).join('');
        const wgrid='<div class="gridwall" id="wallGrid" '+App.view.act('wallPlaceClick',App.view.ev)+'>'+witems+(witems?'':emptyGridHint())+'<div class="gdrop" id="wgdrop" hidden></div><div class="wsnap" id="wsnap" hidden></div><div class="wsnaph" id="wsnaph" hidden></div></div>';
        if(!WALL_PAL_CATS.some(c=>c[0]===_wallCat)) _wallCat='all';
        const wpal=ITEM_CATALOG.filter(it=>isWallItem(it.id) && itemQty(it.id)>0 && (_wallCat==='all'||wallAnchorOf(it.id)===_wallCat)).map(it=>{ const rem=itemRemaining(it.id), qty=itemQty(it.id), sold=rem<=0, ft=itemTierOf(it.id);
          return '<button class="pitem'+(_selWall===it.id?' on':'')+(sold?' soldout':'')+'"'+(sold?' aria-disabled="true"':'')+' onpointerdown="wallPalDown(event,\''+it.id+'\')" onclick="if(event.detail===0)selWallItem(\''+it.id+'\')"><span class="pic tbring tb-'+ft+'">'+furnSvg(it.id,{h:palPicH(it.id)})+tierBadgeHtml(ft)+'</span><span>'+it.name+'</span><span class="pq">'+(sold?('보유'+qty+' · 전부 배치됨'):('보유'+qty+' · 남은'+rem))+'</span></button>'; }).join('');
        const wallHint='<div class="hintline" style="margin:8px 0 4px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16"/></svg>벽 가구를 <b>탭해 선택</b>하거나 <b>꾹 눌러 격자로 끌어</b> 걸어요(위=천장·아래=바닥선). 걸린 항목은 <b>꾹 눌러 드래그로 이동</b>, 짧게 탭하면 회수/판매. <b>특별↑ 벽 가구는 랜덤박스로만</b> 얻어요.</div>';
        const selBannerW=_selWall?('<div class="selbanner">'+furnSvg(_selWall,{h:22})+'<span><b>'+escapeHtml(catFurnName(_selWall))+'</b> 걸기 — 격자를 <b>탭</b>하세요</span><button class="selx" '+App.view.act('selWallItem',_selWall)+'>취소</button></div>'):'';
        const wcatTabs='<div class="subseg placecat">'+WALL_PAL_CATS.map(c=>{ const n=ITEM_CATALOG.filter(it=>isWallItem(it.id)&&itemQty(it.id)>0&&(c[0]==='all'||wallAnchorOf(it.id)===c[0])).length;
          return '<button class="'+(_wallCat===c[0]?'on':'')+(n?'':' dim')+'"'+(n?'':' aria-disabled="true"')+' '+App.view.act('setWallCat',c[0])+'>'+c[1]+(n?' <b>'+n+'</b>':'')+'</button>'; }).join('')+'</div>';
        const wpalRow='<div class="palcatrow">'+wcatTabs+'</div>';   // 알뜰샵 바로가기 버튼 제거(사용자 지시 — 배치화면엔 미노출)
        body=selBannerW+wgrid+wallHint+wpalRow+'<div class="palette catinv">'+(wpal||'<div class="palempty">보유한 벽 가구가 없어요<br><span>랜덤박스에서 벽 가구를 모아보세요</span><button class="palcta" '+App.view.act('openShop')+'>알뜰샵 가기</button></div>')+'</div>'+skinPickerHtml('wall');
      } else {
        // 바닥 격자(12×8, 가로×깊이) — 기존 방꾸미기(드래그 이동·롱프레스). 벽 가구는 팔레트에서 제외.
        const placed=room().placed||{};
        const items=Object.keys(placed).map(key=>{ const pr=key.split('_'), r=+pr[0], c=+pr[1], id=placed[key].itemId, foot=itemFoot(id);
          const left=(gridLeftFrac(c)*100).toFixed(3), top=(gridTopFrac(r)*100).toFixed(3), w=(gridSpanFrac(foot.w)*100).toFixed(3), h=(gridRowSpanFrac(foot.h)*100).toFixed(3);
          return '<div class="gitem" style="left:'+left+'%;top:'+top+'%;width:'+w+'%;height:'+h+'%" onpointerdown="giDown(event,\''+key+'\')" onclick="event.stopPropagation()">'+
            '<span class="gsc">'+furnSvg(id,{fit:true})+'</span></div>'; }).join('');
        const grid='<div class="grid12" id="placeGrid" '+App.view.act('placeClick',App.view.ev)+'>'+items+(items?'':emptyGridHint())+'<div class="gdrop" id="gdrop" hidden></div><div class="wsnap" id="fsnap" hidden></div><div class="wsnaph" id="fsnaph" hidden></div><span class="gaxis gaxis-b">뒤</span><span class="gaxis gaxis-f">앞</span></div>';
        const owned=ITEM_CATALOG.filter(it=>!isWallItem(it.id) && itemQty(it.id)>0);
        if(!_placeCat || !PLACE_CATS.some(c=>c[0]===_placeCat)) _placeCat=(PLACE_CATS.find(c=>owned.some(it=>placeCatOf(it.id)===c[0]))||PLACE_CATS[0])[0];
        const catTabs='<div class="subseg placecat">'+PLACE_CATS.map(c=>{ const inCat=owned.filter(it=>placeCatOf(it.id)===c[0]), nOwn=inCat.length, nAvail=inCat.filter(it=>itemRemaining(it.id)>0).length;
          return '<button class="'+(_placeCat===c[0]?'on':'')+(nOwn?'':' dim')+'"'+(nOwn?'':' aria-disabled="true"')+' '+App.view.act('setPlaceCat',c[0])+'>'+c[1]+(nAvail?' <b>'+nAvail+'</b>':'')+'</button>'; }).join('')+'</div>';
        const pal=owned.filter(it=>placeCatOf(it.id)===_placeCat).map(it=>{ const foot=itemFoot(it.id), rem=itemRemaining(it.id), qty=itemQty(it.id), sold=rem<=0, ft=itemTierOf(it.id);
          return '<button class="pitem'+(_selItem===it.id?' on':'')+(sold?' soldout':'')+'"'+(sold?' aria-disabled="true"':'')+' onpointerdown="palDown(event,\''+it.id+'\')" onclick="if(event.detail===0)selItem(\''+it.id+'\')"><span class="pic tbring tb-'+ft+'">'+furnSvg(it.id,{h:palPicH(it.id)})+tierBadgeHtml(ft)+'</span><span>'+it.name+'</span><span class="pq">'+(sold?('보유'+qty+' · 전부 배치됨'):(foot.w+'×'+foot.h+' · 보유'+qty+' · 남은'+rem))+'</span></button>'; }).join('');
        const dragHint='<div class="hintline" style="margin:8px 0 4px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11.5V5.5a1.5 1.5 0 0 1 3 0v5"/><path d="M12 10V4.5a1.5 1.5 0 0 1 3 0V10"/><path d="M15 9.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3l-2-3.5a1.5 1.5 0 0 1 2.6-1.5L9 14"/></svg><b>꾹 눌러서</b> 끌면 배치·이동돼요(짧게 탭하면 선택·메뉴). 화면 스크롤과 겹치지 않아요.</div>';
        const palBody=pal||'<div class="palempty">이 분류에 보유한 가구가 없어요<br><span>알뜰샵·랜덤박스에서 가구를 모아보세요</span><button class="palcta" '+App.view.act('openShop')+'>알뜰샵 가기</button></div>';
        const selBanner=_selItem?('<div class="selbanner">'+furnSvg(_selItem,{h:22})+'<span><b>'+escapeHtml(catFurnName(_selItem))+'</b> 배치 중 — 격자를 <b>탭</b>하세요</span><button class="selx" '+App.view.act('selItem',_selItem)+'>취소</button></div>'):'';   // 탭-투-플레이스 선택 상태 가시화
        const palRow='<div class="palcatrow">'+catTabs+'</div>';   // 알뜰샵 바로가기 버튼 제거(사용자 지시 — 배치화면엔 미노출)
        body=selBanner+grid+dragHint+palRow+'<div class="palette catinv">'+palBody+'</div>'+skinPickerHtml('floor')+bgfxPickerHtml();
      }
      return '<div class="editwrap">'+preview+toggle+placeActionsBar()+body+'</div>';
    }
    function missionRow(m){
      const claimed=missionClaimed(m), ok=m.check();
      let right;
      if(claimed) right='<span class="mdone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>수령완료</span>';
      else if(ok) right='<button class="claim" '+App.view.act('claimMission',m.id)+'>수령</button>';
      else right='<span class="prog-pill">'+(m.prog?m.prog():'진행 중')+'</span>';
      return '<div class="cmrow"><span class="cmi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+m.icon+'</svg></span>'+
        '<div class="cmm"><b>'+m.name+'</b><span class="rw"><span class="ci">'+coinSvg({h:14})+'</span>+'+m.reward+(m.gold?' <span class="ci">'+goldSvg({h:13})+'</span>+'+m.gold:'')+(claimed?' · 수령완료':(ok?' · 완료':(m.prog?' · '+m.prog():'')))+'</span></div>'+right+'</div>';
    }
    // 내 미션(커스텀) 행: 오늘 체크 원 + 이름 + 🔥연속 + 최근7일 점. 이름 탭=수정 시트.
    function customMissionRow(cm){
      const done=customCheckedToday(cm.id), dates=missionLogDoneDates(cm.id);
      const st=(typeof missionStreak==='function')?missionStreak(dates, kstDayKey()):{current:0};
      const dots=(typeof weekDotsData==='function'?weekDotsData(dates, kstDayKey()):[]).map(d=>'<i class="cmdot'+(d.filled?' on':'')+'"></i>').join('');
      return '<div class="cmrow custom">'+
        '<button class="tdchk'+(done?' on':'')+'" onclick="event.stopPropagation();toggleCustomMissionToday(\''+cm.id+'\')" aria-label="'+(done?'오늘 완료 취소':'오늘 완료')+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></button>'+
        '<div class="cmm" '+App.view.act('openCustomMissionEdit',cm.id)+'><b>'+escapeHtml(cm.title||'')+'</b>'+
          '<span class="rw">'+(st.current>0?'<span style="display:inline-flex;vertical-align:-2px">'+flameSvg({h:12})+'</span> '+st.current+'일 · ':'')+'다음 보상 '+((typeof customMissionMilestone==='function')?customMissionMilestone(st.current, CUSTOM_STREAK_N).toNext:CUSTOM_STREAK_N)+'일 <span class="ci">'+coinSvg({h:14})+'</span>+'+CUSTOM_STREAK_BONUS+'</span></div>'+
        '<span class="cmdots" aria-hidden="true">'+dots+'</span></div>';
    }
    // 🐾 컬렉션 도감: 전체 펫 그리드(보유=컬러/미보유=실루엣), 진행도 N/총. 애정 레벨 하트 표시.
    function ownedCatsMap(){ return (state.game&&state.game.owned&&state.game.owned.cats)||{}; }
    let _dexTab=lsGet('dexTab','all');   // 도감 종별 탭('all'=전체 / species 코드)
    function setDexTab(t){ _dexTab=t||'all'; lsSet('dexTab',_dexTab); if(state._sheetRefresh) state._sheetRefresh(); }
    function dexSpeciesList(){ const seen={}, list=[]; dexCatalog().forEach(c=>{ const s=c.species||'cat'; if(!seen[s]){ seen[s]=1; list.push(s); } }); return list; }   // 도감 등장 종(순서 유지·중복 제거) — 획득 가능한 펫만(휴면 한정 제외)
    // 🗂️ 도감 상위 축: 펫 | 아이템(기구물·벽지·바닥·배경효과 — 소비는 소모품이라 제외)
    let _dexKind=lsGet('dexKind','pet');
    function setDexKind(k){ _dexKind=(k==='item'?'item':'pet'); lsSet('dexKind',_dexKind); if(state._sheetRefresh) state._sheetRefresh(); }
    let _dexItemCat=lsGet('dexItemCat','all');   // 아이템 도감 분류('all'/'furn'/'wall'/'floor'/'bgfx')
    function setDexItemCat(c){ _dexItemCat=c||'all'; lsSet('dexItemCat',_dexItemCat); if(state._sheetRefresh) state._sheetRefresh(); }
    const DEX_ITEM_CATS=[['all','전체'],['furn','기구물'],['wall','벽지'],['floor','바닥'],['bgfx','배경효과']];
    // 아이템 도감 통합 목록 {id,kind,cat,name,tier,has} — 기구물(케어·휴식·놀이·장식)+벽지+바닥+배경효과(default 표면 제외, 소비 제외)
    function dexItemList(){ const out=[];
      ITEM_CATALOG.forEach(function(it){ out.push({ id:it.id, kind:'furn', cat:placeCatOf(it.id), name:it.name, tier:itemTierOf(it.id), has:itemQty(it.id)>0, qty:itemQty(it.id), placed:itemPlacedAll(it.id) }); });
      WALLPAPER_CATALOG.forEach(function(w){ if(w.id==='default') return; out.push({ id:w.id, kind:'wall', cat:'wall', name:w.name, tier:assetTierOf('wallpaper',w.id), has:ownsWall(w.id) }); });
      FLOOR_CATALOG.forEach(function(f){ if(f.id==='default') return; out.push({ id:f.id, kind:'floor', cat:'floor', name:f.name, tier:assetTierOf('floor',f.id), has:ownsFloor(f.id) }); });
      (typeof BGFX_CATALOG!=='undefined'?BGFX_CATALOG:[]).forEach(function(b){ out.push({ id:b.id, kind:'bgfx', cat:'bgfx', name:b.name, tier:'limited', has:ownsBgfx(b.id) }); });
      Object.keys(BUDDY_CATALOG).forEach(function(k){ out.push({ id:k, kind:'petfx', cat:'bgfx', name:BUDDY_CATALOG[k], tier:PETFX_TIER[k]||'exclusive', has:ownsPetfx(k) }); });   // ✨ 펫효과(전부 한정 — 이벤트·쿠폰 지급) — 도감 수집축
      Object.keys(HAT_CATALOG).forEach(function(k){ out.push({ id:k, kind:'hat', cat:'bgfx', name:HAT_CATALOG[k], tier:HAT_TIER[k]||'exclusive', has:ownsHat(k) }); });   // 🧢 모자(전부 한정 — 이벤트·쿠폰 지급) — 도감 수집축
      return out; }
    function dexItemThumb(it){
      if(it.kind==='furn') return '<span class="furnfit">'+furnSvg(it.id,{fit:true})+'</span>';
      if(it.kind==='wall') return '<span class="dexswatch" style="background:'+wallCss(it.id)+'"></span>';
      if(it.kind==='floor') return '<span class="dexswatch" style="background:'+floorCss(it.id)+'"></span>';
      if(it.kind==='bgfx') return bgfxThumb(it.id, 46);
      if(it.kind==='petfx') return buddySvgOf(it.id,{h:30});
      if(it.kind==='hat') return hatSvg(it.id,{h:26});
      return ''; }
    // 아이템 도감 본문(펫과 같은 dex CSS 재사용) — 분류탭 + 그룹 그리드(기구물은 케어/휴식/놀이/장식 하위그룹)
    function buildItemDex(){
      const all=dexItemList();
      if(_dexItemCat!=='all' && !DEX_ITEM_CATS.some(function(c){ return c[0]===_dexItemCat; })) _dexItemCat='all';
      const pool=all.filter(function(it){ return _dexItemCat==='all'||it.kind===_dexItemCat; });
      const owN=pool.filter(function(it){ return it.has; }).length, tot=pool.length, pct=tot?Math.round(owN/tot*100):0;
      let h='<div class="dexhead"><div class="row" style="justify-content:space-between;"><b>아이템 수집</b><span class="s">'+owN+' / '+tot+' ('+pct+'%)</span></div><div class="bar"><i style="width:'+pct+'%"></i></div></div>';
      h+='<div class="subseg dextabs">'+DEX_ITEM_CATS.map(function(t){ const id=t[0], n=all.filter(function(it){ return id==='all'||it.kind===id; }).length;
        return '<button class="'+(_dexItemCat===id?'on':'')+'" '+App.view.act('setDexItemCat',id)+'>'+t[1]+' <b>'+n+'</b></button>'; }).join('')+'</div>';
      const cell=function(it){ const cnt=(it.has&&it.kind==='furn')?('<div class="dexqty">보유 '+it.qty+(it.placed?' · 배치 '+it.placed:'')+'</div>'):''; return '<div class="dexcell'+(it.has?' tbring tb-'+(it.tier||'normal'):' locked')+'" title="'+escapeHtml(it.has?it.name:'미보유')+'">'+
        '<div class="dexpic">'+dexItemThumb(it)+'</div>'+
        '<div class="dexnm">'+(it.has?escapeHtml(it.name):'<span class="q">???</span>')+'</div>'+cnt+'</div>'; };
      const grp=function(title, arr){ if(!arr.length) return ''; const o=arr.filter(function(x){ return x.has; }).length;
        return '<div class="dexgroup"><div class="dexgh"><span class="dexgt">'+title+'</span><span class="dexgn">'+o+'/'+arr.length+'</span></div><div class="dexgrid">'+arr.map(cell).join('')+'</div></div>'; };
      if(_dexItemCat==='all'||_dexItemCat==='furn'){ PLACE_CATS.forEach(function(pc){ h+=grp('기구물 · '+pc[1], pool.filter(function(it){ return it.kind==='furn'&&it.cat===pc[0]; })); }); }
      if(_dexItemCat==='all'||_dexItemCat==='wall') h+=grp('벽지', pool.filter(function(it){ return it.kind==='wall'; }));
      if(_dexItemCat==='all'||_dexItemCat==='floor') h+=grp('바닥', pool.filter(function(it){ return it.kind==='floor'; }));
      if(_dexItemCat==='all'||_dexItemCat==='bgfx') h+=grp('배경효과', pool.filter(function(it){ return it.kind==='bgfx'; }));
      if(_dexItemCat==='all'||_dexItemCat==='bgfx') h+=grp('펫 코스메틱(펫효과·모자)', pool.filter(function(it){ return it.kind==='petfx'||it.kind==='hat'; }));   // 💗 착용 코스메틱 수집축
      return h;
    }
    // 🔋 도감 재빌드 서명 — 상위축+탭+보유 펫(애정)+보유 아이템 키. 코인·똥·수확 틱엔 불변이라 통째 재빌드를 스킵.
    let _dexLastSig='';
    function _dexRefreshSig(){ const o=ownedCatsMap(), ow=(state.game&&state.game.owned)||{};
      const ik=Object.keys(ow.items||{}).sort().join(',')+'#'+Object.keys(ow.wallpapers||{}).sort().join(',')+'#'+Object.keys(ow.floors||{}).sort().join(',')+'#'+Object.keys(ow.bgfx||{}).sort().join(',')+'#'+Object.keys(ow.petfx||{}).sort().join(',')+'#'+Object.keys(ow.hats||{}).sort().join(',');
      return _dexKind+'|'+_dexTab+'|'+_dexItemCat+'|'+Object.keys(o).sort().map(function(id){ return id+':'+((o[id]&&o[id].affection)||0); }).join(',')+'|'+ik; }
    function openPetDex(){
      const build=()=>{
        const kindTabs='<div class="subseg dexkind"><button class="'+(_dexKind==='pet'?'on':'')+'" '+App.view.act('setDexKind','pet')+'>펫</button><button class="'+(_dexKind==='item'?'on':'')+'" '+App.view.act('setDexKind','item')+'>아이템</button></div>';
        if(_dexKind==='item') return kindTabs+buildItemDex();   // 🗂️ 아이템 도감
        const owned=ownedCatsMap(), species=dexSpeciesList();
        if(_dexTab!=='all' && species.indexOf(_dexTab)<0) _dexTab='all';   // 사라진 종 방어
        const pool=dexCatalog().filter(c=> _dexTab==='all' || (c.species||'cat')===_dexTab);   // 획득 가능한 펫만(휴면 한정펫은 도감에서 숨김 = 미출시)
        const prog=dexProgress(owned, pool.map(c=>c.id));   // 현재 탭 기준 진행도
        let h=kindTabs+'<div class="dexhead"><div class="row" style="justify-content:space-between;"><b>수집'+(_dexTab!=='all'?' · '+escapeHtml(SPECIES_LABEL[_dexTab]||_dexTab):'')+'</b><span class="s">'+prog.owned+' / '+prog.total+' ('+prog.pct+'%)</span></div><div class="bar"><i style="width:'+prog.pct+'%"></i></div></div>';
        // 종별 탭(전체 + 종). 옆으로 스크롤(.subseg).
        const tabs=[['all','전체']].concat(species.map(s=>[s,(SPECIES_LABEL[s]||s)]));
        h+='<div class="subseg dextabs">'+tabs.map(function(t){ const id=t[0], nm=t[1], n=dexCatalog().filter(c=>id==='all'||(c.species||'cat')===id).length;
          return '<button class="'+(_dexTab===id?'on':'')+'" '+App.view.act('setDexTab',id)+'>'+escapeHtml(nm)+' <b>'+n+'</b></button>'; }).join('')+'</div>';
        const cell=function(c){ const has=!!owned[c.id], lv=has?affectionLevel(owned[c.id].affection, CAT_TIER[c.id]||'normal').level:0;
          return '<div class="dexcell'+(has?' tbring tb-'+(CAT_TIER[c.id]||'normal'):' locked')+'" title="'+escapeHtml(has?catName(c.id):'미보유')+'">'+   // 소유 셀은 등급색을 바깥 라운드 카드 테두리에(미소유는 스포일러 방지로 중립)
            '<div class="dexpic">'+catFace(c.id,{h:54})+'</div>'+
            '<div class="dexnm">'+(has?catNameSpan(c.id,catName(c.id)):'<span class="q">???</span>')+'</div>'+
            (lv>0?'<div class="dexlv" style="display:inline-flex;gap:1px" aria-label="애정 레벨 '+lv+'">'+heartSvg({h:9}).repeat(lv)+'</div>':'')+
          '</div>'; };
        // 등급별 그룹 — 연한 구분선(.dexgh) + 간격(.dexgroup)으로 살짝 구분. 전체 등급 리스트는 그대로 다 보임.
        TIER_ORDER.forEach(function(tid){ const grp=pool.filter(c=>CAT_TIER[c.id]===tid); if(!grp.length) return;
          const ti=tierInfo(tid), owN=grp.filter(c=>owned[c.id]).length;
          h+='<div class="dexgroup"><div class="dexgh"><span class="dexgt">'+tierLabelHtml(ti.id)+'</span><span class="dexgn">'+owN+'/'+grp.length+'</span></div>'+
             '<div class="dexgrid">'+grp.map(cell).join('')+'</div></div>';
        });
        return h;
      };
      openSheet('도감', build());
      _dexLastSig=_dexRefreshSig();
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(!b) return; const sig=_dexRefreshSig(); if(sig===_dexLastSig) return; _dexLastSig=sig; const st=b.scrollTop; b.innerHTML=build(); b.scrollTop=st; };   // 🔋 서명 불변 시(코인 틱 등) 재빌드 스킵
    }
    // ===== 📢 소식(알림·이벤트·공지) — 알뜰 아이콘 '소식' 화면 =====
    // 업데이트 공지 — 기본값(폴백). 운영은 RTDB config/notices(관리자만 쓰기)에서 덮어씀(loadNotices). 최신순.
    // 업데이트 내역(요약) — 최신순. RTDB config/notices가 있으면 그걸로 덮어씀(아래는 기본값).
    // 업데이트 내역 기본값(요약) — 최신순. RTDB config/notices가 있으면 그걸로 덮어씀. 시즌·친구선물 홍보는 이벤트·알림 섹션에 이미 나오므로 여기(업데이트 내역)엔 넣지 않는다.
    // 🔒 여기(및 config/notices)는 일반 사용자에게 그대로 노출된다. 개발자 모드·치트·내부 도구 등 비공개 변경은 절대 넣지 말 것(운영 유출 크리티컬). 방어로 isDevNotice가 한 번 더 거른다.
    let NOTICES = [
      // (2026-07-09 사용자 재지시: 새 쿠폰 4종 등록 + 안내 — 무지개알/박스 보상은 무지개동전 개편에 맞춰 동전 5개로 지급)
      { date:'2026-07-10', t:'새 쿠폰 4종 도착 🎟️', s:'RAINBOWEGG·RAINBOWBOX(각 무지개동전 5개) · EGGARDENBOX(랜덤박스 10개) · EGGARDEN0709(뜰알 10개) — 더보기 → 설정 → 코드 입력에서 사용하세요(계정당 1회)' },
      { date:'2026-07-10', t:'선물함·공지 개편', s:'선물 출처 표시, 운영자 선물, 공지사항에 운영자 공지와 업데이트 내역을 함께 정리했어요' }
    ];
    // RTDB config/notices(공개 읽기·관리자 쓰기)에서 공지를 읽어 NOTICES를 갱신. 없으면 위 기본값 유지.
    function loadNotices(){ try{ db.ref('config/notices').on('value', function(s){ const v=s.val(); let arr=[];
      if(Array.isArray(v)) arr=v.map(function(n,i){ return Object.assign({id:String(i)}, n); });
      else if(v&&typeof v==='object') arr=Object.keys(v).map(function(k){ return Object.assign({id:k}, v[k]); });
      arr=(arr||[]).filter(function(n){ return n && n.date && n.t; }).sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
      if(arr.length){ NOTICES=arr; if(typeof updateNewsBadge==='function') updateNewsBadge(); if(state._sheetRefresh) state._sheetRefresh(); }
    }); }catch(e){} }
    // 개발자: 업데이트 내역(날짜+제목+요약) 등록·수정·삭제 → config/notices(관리자 쓰기·전체 읽기). config/notices에 push 저장하면 실시간 반영.
    // ⚠️ 개발자/내부 문구는 넣지 말 것(사용자 대면). isDevNotice/isPromoNotice가 화면에서 한 번 더 걸러내지만 애초에 넣지 않기가 1차 방어.
    let _noticeEditId=null;
    function saveNotice(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용', true); return; }
      const date=(val('nt_date')||'').trim(), t=(val('nt_title')||'').trim(), s=(val('nt_body')||'').trim();
      if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){ toast('날짜를 YYYY-MM-DD로 입력하세요', true); return; }
      if(!t){ toast('제목을 입력하세요', true); return; }
      const rec={ date:date, t:t.slice(0,80), s:s.slice(0,300) };
      if(_noticeEditId){ const id=_noticeEditId; db.ref('config/notices/'+id).set(rec).then(function(){ _noticeEditId=null; toast('📝 업데이트 내역을 수정했어요'); if(typeof openDevAnnounce==='function') openDevAnnounce(); }).catch(_cfgWriteErr); return; }
      db.ref('config/notices').push(rec).then(function(){ toast('📝 업데이트 내역을 등록했어요'); if(typeof openDevAnnounce==='function') openDevAnnounce(); }).catch(_cfgWriteErr); }
    function editNotice(id){ if(!(typeof isDev==='function'&&isDev())) return; _noticeEditId=id; if(typeof openDevAnnounce==='function') openDevAnnounce(); }
    function cancelNoticeEdit(){ _noticeEditId=null; if(typeof openDevAnnounce==='function') openDevAnnounce(); }
    function deleteNotice(id){ if(!(typeof isDev==='function'&&isDev())) return;
      db.ref('config/notices/'+id).remove().then(function(){ if(_noticeEditId===id) _noticeEditId=null; toast('업데이트 내역을 삭제했어요'); if(typeof openDevAnnounce==='function') openDevAnnounce(); }).catch(_cfgWriteErr); }
    // 📢 운영자 공지(제목+내용) — config/announce(관리자 쓰기·전체 읽기). 소식 '공지사항'에 업데이트 내역과 함께 표시. 개발자 모드 '공지사항 관리'에서 등록/삭제.
    let ANNOUNCE=[];
    function loadAnnounce(){ try{ db.ref('config/announce').on('value', function(s){ const v=s.val(); let arr=[];
      if(Array.isArray(v)) arr=v.map(function(a,i){ return Object.assign({id:String(i)}, a); });
      else if(v&&typeof v==='object') arr=Object.keys(v).map(function(k){ return Object.assign({id:k}, v[k]); });
      ANNOUNCE=(arr||[]).filter(function(a){ return a && a.title; }).sort(function(a,b){ return (b.at||'').localeCompare(a.at||''); });
      if(typeof updateNewsBadge==='function') updateNewsBadge(); if(state._sheetRefresh) state._sheetRefresh();
    }); }catch(e){} }
    function announceList(){ return ANNOUNCE; }
    // 개발자: 공지사항(제목+내용) 등록·수정·삭제 → config/announce. _annEditId!=null이면 그 공지 수정 모드.
    let _annEditId=null;
    function sendAnnounce(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용', true); return; }
      const title=(val('an_title')||'').trim(), body=(val('an_body')||'').trim();
      if(!title){ toast('제목을 입력하세요', true); return; }
      const t=title.slice(0,80), b=body.slice(0,500);
      if(_annEditId){ const id=_annEditId; db.ref('config/announce/'+id).update({ title:t, body:b }).then(function(){ _annEditId=null; toast('📢 공지를 수정했어요'); if(typeof openDevAnnounce==='function') openDevAnnounce(); }).catch(_cfgWriteErr); return; }   // 수정: at 유지
      db.ref('config/announce').push({ title:t, body:b, at:new Date().toISOString() }).then(function(){ toast('📢 공지를 등록했어요'); if(typeof openDevAnnounce==='function') openDevAnnounce(); }).catch(_cfgWriteErr); }
    function editAnnounce(id){ if(!(typeof isDev==='function'&&isDev())) return; _annEditId=id; if(typeof openDevAnnounce==='function') openDevAnnounce(); }
    function cancelAnnounceEdit(){ _annEditId=null; if(typeof openDevAnnounce==='function') openDevAnnounce(); }
    function deleteAnnounce(id){ if(!(typeof isDev==='function'&&isDev())) return;
      db.ref('config/announce/'+id).remove().then(function(){ if(_annEditId===id) _annEditId=null; toast('공지를 삭제했어요'); if(typeof openDevAnnounce==='function') openDevAnnounce(); }).catch(_cfgWriteErr); }
    function openDevAnnounce(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용', true); return; }
      const editing=_annEditId?ANNOUNCE.filter(function(a){ return a.id===_annEditId; })[0]:null; if(_annEditId && !editing) _annEditId=null;   // 대상이 사라졌으면 등록 모드로
      const et=editing?(editing.title||''):'', eb=editing?(editing.body||''):'';
      let h='<div class="note">소식 화면 <b>공지사항</b>에 표시할 운영자 공지(제목+내용)를 등록·수정해요. 전역 <b>config/announce</b>(관리자만 쓰기·전체 읽기)에 저장돼 모든 사용자에게 즉시 반영. ⚠️ 일반 사용자에게 노출되니 개발자 모드·내부 내용은 넣지 마세요.</div>';
      if(editing) h+='<div class="note" style="border-left:3px solid var(--primary);">✏️ <b>공지 수정 중</b> — 저장하면 이 공지가 바뀝니다(등록 순서·날짜 유지).</div>';
      h+='<div class="field"><label for="an_title">제목</label><input class="input" id="an_title" maxlength="80" placeholder="예: 서버 점검 안내" value="'+escapeHtml(et)+'"></div>';
      h+='<div class="field"><label for="an_body">내용</label><textarea class="input" id="an_body" rows="3" maxlength="500" placeholder="예: 7/12 02:00~04:00 점검이 있어요">'+escapeHtml(eb)+'</textarea></div>';
      h+='<div class="row" style="gap:8px;margin-top:4px;"><button class="btn" style="flex:1;" '+App.view.act('sendAnnounce')+'>'+(editing?'수정 저장':'공지 등록')+'</button>'+(editing?'<button class="btn ghost" style="flex:none;" '+App.view.act('cancelAnnounceEdit')+'>취소</button>':'')+'</div>';
      const list=announceList();
      h+='<div class="sech" style="margin-top:18px;"><span class="l">등록된 공지</span><span class="s">'+list.length+'개</span></div>';
      h+= list.length ? list.map(function(a){ return '<div class="giftrow'+(_annEditId===a.id?' on':'')+'"><span class="gftx"><b class="gfnm">'+escapeHtml(a.title||'')+'</b>'+(a.body?'<span class="gfmsg">'+escapeHtml(a.body)+'</span>':'')+'</span><span style="display:flex;gap:6px;flex:none;"><button class="chip" '+App.view.act('editAnnounce',a.id)+'>수정</button><button class="chip" '+App.view.act('deleteAnnounce',a.id)+'>삭제</button></span></div>'; }).join('') : '<div class="note" style="margin:6px 2px;">등록된 공지가 없어요.</div>';

      // ── 업데이트 내역(config/notices) 관리 ──────────────────────────
      const nEditing=_noticeEditId?NOTICES.filter(function(n){ return n.id===_noticeEditId; })[0]:null; if(_noticeEditId && !nEditing) _noticeEditId=null;
      const nd=nEditing?(nEditing.date||''):kstDayKey(), nt=nEditing?(nEditing.t||''):'', ns=nEditing?(nEditing.s||''):'';
      h+='<div class="sech" style="margin-top:22px;"><span class="l">업데이트 내역</span><span class="s">소식 화면</span></div>';
      h+='<div class="note">소식 화면 <b>업데이트 내역</b>에 표시할 항목(날짜·제목·요약)을 등록·수정해요. 전역 <b>config/notices</b>(관리자만 쓰기·전체 읽기)에 저장돼 <b>배포 없이</b> 최신 1건이 사용자에게 반영됩니다. ⚠️ 개발자 모드·치트·내부 도구 등 비공개 변경은 넣지 마세요(개발용 CHANGELOG.md와 별개).</div>';
      if(nEditing) h+='<div class="note" style="border-left:3px solid var(--primary);">✏️ <b>업데이트 내역 수정 중</b> — 저장하면 이 항목이 바뀝니다.</div>';
      h+='<div class="field"><label for="nt_date">날짜</label><input class="input" id="nt_date" maxlength="10" placeholder="2026-07-05" value="'+escapeHtml(nd)+'"></div>';
      h+='<div class="field"><label for="nt_title">제목</label><input class="input" id="nt_title" maxlength="80" placeholder="예: 알뜰샵 개편" value="'+escapeHtml(nt)+'"></div>';
      h+='<div class="field"><label for="nt_body">요약</label><textarea class="input" id="nt_body" rows="2" maxlength="300" placeholder="예: 가챠 탭을 앞으로 옮기고 한정 픽업 배너를 추가했어요">'+escapeHtml(ns)+'</textarea></div>';
      h+='<div class="row" style="gap:8px;margin-top:4px;"><button class="btn" style="flex:1;" '+App.view.act('saveNotice')+'>'+(nEditing?'수정 저장':'내역 등록')+'</button>'+(nEditing?'<button class="btn ghost" style="flex:none;" '+App.view.act('cancelNoticeEdit')+'>취소</button>':'')+'</div>';
      const nlist=NOTICES.slice().sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
      h+='<div class="sech" style="margin-top:14px;"><span class="l">등록된 내역</span><span class="s">'+nlist.length+'개</span></div>';
      h+= nlist.length ? nlist.map(function(n){ const dev=isDevNotice(n)||isPromoNotice(n); return '<div class="giftrow'+(_noticeEditId===n.id?' on':'')+'"><span class="gftx"><b class="gfnm">'+escapeHtml(n.date||'')+' · '+escapeHtml(noticeTitle(n))+(dev?' <span style="color:var(--expense);font-size:11px;">(비노출)</span>':'')+'</b>'+(n.s?'<span class="gfmsg">'+escapeHtml(n.s)+'</span>':'')+'</span>'+(n.id!=null?'<span style="display:flex;gap:6px;flex:none;"><button class="chip" '+App.view.act('editNotice',n.id)+'>수정</button><button class="chip" '+App.view.act('deleteNotice',n.id)+'>삭제</button></span>':'<span class="chip" style="flex:none;opacity:.6;">기본값</span>')+'</div>'; }).join('') : '<div class="note" style="margin:6px 2px;">등록된 내역이 없어요.</div>';
      openSheet('공지사항 관리', h); }
    // 안 본 공지 기준일 — 계정(RTDB game.newsSeenAt)과 기기(localStorage) 중 더 최신 사용(기기 간 동기화).
    function newsSeenAt(){ let g=(state.game&&state.game.newsSeenAt)||''; let l=''; try{ l=localStorage.getItem('newsSeenAt')||''; }catch(e){} return g>l?g:l; }
    // 시즌·친구선물 홍보 공지 판별(이벤트/알림 섹션에 이미 노출) → 업데이트 내역에서 제외. 개발자 changelog가 실수로 걸리지 않게 문구를 좁게 매칭.
    function isPromoNotice(n){ const t=(n&&n.t)||''; return /이달의\s*펫|시즌\s*할인|응원\s*선물/.test(t); }
    // 🔒 개발자/내부 전용 문구는 사용자 대면 업데이트 내역에 절대 노출 금지(운영 배포 시 프라이빗 정보 유출 방지). config/notices에 실수로 들어와도 이 필터로 방어.
    //    ⚠️ 정책: 개발자 모드·치트·내부 도구 관련 변경은 NOTICES/config/notices에 넣지 말 것(개발용 CHANGELOG.md와 별개). 자세한 규칙은 CLAUDE.md·docs/deploy 참고.
    function isDevNotice(n){ const t=(((n&&n.t)||'')+' '+((n&&n.s)||'')); return /개발자|디버그|debug|dev\s*mode|내부용|internal|치트|cheat|재화\s*지급|콘솔|console/i.test(t); }
    // 사용자 대면 업데이트 내역(홍보·개발자/내부 문구 제외). 실시간(RTDB config/notices) 추가분도 이 필터를 거친다.
    function updateNotices(){ return NOTICES.filter(function(n){ return !isPromoNotice(n) && !isDevNotice(n); }); }
    // 그중 '최신 1건'만 노출(이전 내역은 사라짐). 날짜 최대값으로 선택(배열 정렬에 의존하지 않음).
    function latestUpdate(){ return updateNotices().reduce(function(m,n){ return (!m || (n.date||'')>(m.date||''))?n:m; }, null); }
    // 안 본 판정 기준일 = 업데이트 내역 최신 + 운영자 공지 최신(at의 날짜부분) 중 최대.
    function latestNoticeDate(){ let d=''; const u=latestUpdate(); if(u&&(u.date||'')>d) d=u.date||''; ANNOUNCE.forEach(function(a){ const ad=(a.at||'').slice(0,10); if(ad>d) d=ad; }); return d; }
    function markNewsSeen(){ const d=latestNoticeDate(); try{ localStorage.setItem('newsSeenAt', d); }catch(e){}
      try{ if(typeof gameRef==='function' && state.uid && d) gameRef().child('newsSeenAt').set(d); }catch(e){}   // 계정 동기화
      updateNewsBadge(); refreshMoreBadges(); }   // 로컬 저장으로 안 본 공지=0 됐으니 더보기 '소식' 뱃지도 즉시 갱신(RTDB set이 값 동일이면 리스너가 안 뜨므로 여기서 직접)
    function unseenNoticeCount(){ const seen=newsSeenAt(); let n=0; const u=latestUpdate(); if(u && (u.date||'')>seen) n++; ANNOUNCE.forEach(function(a){ if((a.at||'').slice(0,10)>seen) n++; }); return n; }   // 안 본 운영자 공지 + 최신 업데이트
    function giftUnread(){ return giftCount() + (typeof mailCount==='function'?mailCount():0); }   // 안 받은 선물 = 코드보상(gifts) + 친구선물(mailbox)
    function newsUnread(){ return giftUnread() + unusedCouponCount() + unseenNoticeCount(); }   // (브랜드 아이콘) 알림 = 안 받은 선물(코드+친구) + 안 쓴 쿠폰 + 안 본 공지(새 업데이트 포함)
    // 아직 안 쓴 프로모 쿠폰 개수(state.game.codes에 없는 PROMO_CODES 키 수).
    function unusedCouponCount(){ const codes=(state.game&&state.game.codes)||{}; return Object.keys(PROMO_CODES).filter(function(c){ return !codes[c]; }).length; }
    // 더보기 '소식' 셀 뱃지 = 안 쓴 쿠폰 + 안 본 공지 (선물은 제외 — 선물 알림은 '선물함' 셀과 브랜드 아이콘에만 표시해 중복/혼동 방지).
    // 소식 탭 진입(markNewsSeen) 후엔 안 본 공지=0 → 안 쓴 쿠폰 수만 남는다.
    function newsMoreCount(){ return unusedCouponCount() + unseenNoticeCount(); }
    // 좌상단 브랜드(알뜰 메인) 아이콘 = 소식 진입. 알림은 **빨간 점 하나(아이콘 우측 상단, 숫자 없음)** — 안 받은 선물·안 쓴 쿠폰·안 본 공지(새 업데이트) 중 하나라도 있으면 표시(사용자 지침: 아이콘 알림은 이 점 하나로 통합, 미처리 초록 점도 브랜드에서 제거).
    function updateNewsBadge(){ const el=$('newsBadge'); if(!el) return; el.textContent=''; el.hidden=!(newsUnread()>0); }
    // 더보기 그리드의 알림 뱃지(선물함=giftUnread·소식=newsMoreCount 등)는 renderMore 시점에만 계산된다.
    // game/localStorage가 바뀌어도(선물 받기·쿠폰 사용·공지 확인) 더보기 화면이 다시 안 그려지면 뱃지가 남으므로, 더보기 탭이 떠 있으면 즉시 재렌더해 알림을 지운다.
    function refreshMoreBadges(){ if(state.view==='mode' && state.tab==='more' && typeof renderMore==='function') renderMore(); }
    // 쿠폰 보상 픽셀 아이콘(PROMO_CODES 타입별) — 이모지 대신 도트 아이콘 재사용.
    function couponIcon(d){ if(d.type==='coins') return coinSvg({h:15}); if(d.type==='rbcoin') return rainbowCoinSvg({h:15}); if(d.key==='ddeul') return ddeulEggSvg({h:16}); if(d.key==='rainbow_egg') return rainbowEggImg(16); if(d.key==='rainbow_box') return rainbowBoxSvg({h:16}); if(d.key==='egg') return eggSvg(0,{h:16}); if(d.key==='box') return boxSvg({h:16}); return coinSvg({h:15}); }
    // 🎟️ 쿠폰번호 탭 → 클립보드 복사 + 눌림 연출 + 토스트. (인라인 onclick=copyCouponCode(this))
    function copyCouponCode(el){ if(!el) return; const code=(el.textContent||'').trim(); if(!code) return;
      const flash=function(){ el.classList.remove('copied'); void el.offsetWidth; el.classList.add('copied'); toast('쿠폰번호가 복사되었어요 📋'); };
      try{ if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(code).then(flash, function(){ copyTextFallback(code); flash(); }); return; } }catch(e){}
      copyTextFallback(code); flash();
    }
    function copyTextFallback(text){ try{ const ta=document.createElement('textarea'); ta.value=text; ta.setAttribute('readonly',''); ta.style.cssText='position:fixed;top:0;left:0;opacity:0;'; document.body.appendChild(ta); ta.focus(); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); }catch(e){} }
    // 공지 왼쪽 픽셀 아이콘 — 제목 키워드로 선택(선물=giftSvg·시즌 할인=seasonSvg·그 외=확성기). 제목 앞 이모지는 표시에서 제거.
    function noticeIcon(n){ const t=(n&&n.t)||''; if(/선물/.test(t)) return giftSvg({h:17}); if(/할인|시즌|이달의\s*펫/.test(t)) return seasonSvg({h:17}); return megaSvg({h:16}); }   // 항목 아이콘 작게(24/20→17/16)
    function noticeTitle(n){ return ((n&&n.t)||'').replace(/^\s*(?:\p{Extended_Pictographic}[️‍]*)+\s*/u, ''); }
    function catNewsHtml(){
      let h='';
      const gc=giftUnread();
      h+='<div class="sech"><span class="l"><span class="sech-ic">'+bellSvg({h:15})+'</span> 알림</span></div>';
      if(gc>0){ h+='<div class="newsalert" role="button" tabindex="0" '+App.view.act('openGiftbox')+'><span class="nai">'+giftSvg({h:30})+'</span><div class="nat"><b>선물 '+gc+'개가 도착했어요</b><span>탭해서 선물함에서 받으세요</span></div><span class="buy">받기</span></div>'; }
      else { h+='<div class="note" style="margin:2px 0 6px;">받을 선물이 없어요. 친구 집에서 응원 선물을 주고받거나 코드를 입력해 보세요.</div>'; }
      h+='<div class="sech" style="margin-top:16px;"><span class="l"><span class="sech-ic" style="color:var(--gold,#e0a43c);">'+sparkSvg({h:15})+'</span> 이벤트</span></div>';
      const _lp=limitedPickupBanner();   // 🌈 한정 픽업 배너(있을 때만)
      h+=_lp;
      h+=rainbowNewsBanner();   // 🌈 무지개알 배너 — 뜰알 배너 아래 간격 두고(사용자 지침), 탭=알뜰샵 무지개 탭
      // 🚧 이달의 할인펫 배너는 잠시 제거(추후 재도입 예정) — featuredCatId 로직은 보존
      h+='<div class="sech" style="margin-top:16px;"><span class="l"><span class="sech-ic">'+megaSvg({h:16})+'</span> 공지사항</span></div>';
      // 공지사항 = ① 운영자 공지(제목+내용, config/announce) + ② 업데이트 내역(최신 1건). 홍보·개발자 문구는 업데이트 내역에서 제외.
      const _ann=announceList();
      if(_ann.length){ h+=_ann.map(function(a){ return '<div class="newsupd"><span class="nu-ic">'+megaSvg({h:16})+'</span><div class="nu-tx"><b>'+escapeHtml(a.title||'')+'</b>'+(a.body?'<span>'+escapeHtml(a.body)+'</span>':'')+'</div></div>'; }).join(''); }
      const _u=latestUpdate();
      h+='<div class="tx-sub" style="margin:12px 2px 4px;font-weight:800;color:var(--sub);">업데이트 내역</div>';
      h+='<div class="newscard">'+(_u
        ? '<div class="newsupd"><span class="nu-ic">'+noticeIcon(_u)+'</span><div class="nu-tx"><b>'+escapeHtml(noticeTitle(_u))+'</b><span>'+escapeHtml(_u.s||'')+'</span></div></div>'
        : '<div class="note" style="margin:8px 2px;">최근 업데이트 소식이 없어요.</div>')+'</div>';
      h+='<div class="cnote"><b><span style="display:inline-flex;vertical-align:-2px">'+ticketSvg({h:14})+'</span> 쿠폰</b> — 더보기 → 코드 입력에서 사용하세요</div>';
      const _codes=(state.game&&state.game.codes)||{};
      // 코드는 대문자로 안내(입력은 redeemCode가 소문자로 정규화해 대소문자 무관). used 판정은 저장 키(소문자 code) 그대로.
      h+=Object.keys(PROMO_CODES).length
        ? Object.keys(PROMO_CODES).map(function(code){ const d=PROMO_CODES[code]; const used=!!_codes[code]; const cu=escapeHtml(code.toUpperCase());
            return '<div class="cpn'+(used?' used':'')+'"><code class="cpncode" role="button" tabindex="0" aria-label="쿠폰번호 '+cu+' 복사" title="탭하면 쿠폰번호 복사" onclick="copyCouponCode(this)">'+cu+'</code><span class="rw"><span class="ci">'+couponIcon(d)+'</span>'+d.label+(used?'<span class="cused">사용완료</span>':'')+'</span></div>'; }).join('')
        : '<div class="note" style="margin:8px 2px;">진행 중인 쿠폰이 없어요.</div>';
      return h;
    }
    function catMissionHtml(){
      let h='<div class="coinhero"><span class="ch-big">'+coinSvg({h:44})+'</span><div><div class="k">보유 은화</div><div class="v">'+coins().toLocaleString()+(atMaxCoins()?maxChip():'')+'</div></div></div>';
      // 로그인 스트릭 배지: 연속 출석일 + 다음 마일스톤까지(3·7·14·30, 이후 매30). 마일스톤에 은화·금화 보상.
      { const c=(state.game&&state.game.streak&&Number(state.game.streak.count))||0;
        const nx=[3,7,14,30,60,100].find(n=>n>c)||((Math.floor(c/100)+1)*100);
        h+='<div class="streakbar"><span class="fire" style="display:inline-flex;align-items:center">'+flameSvg({h:18})+'</span><b>'+c+'일 연속 출석</b><span class="s">다음 보상까지 '+(nx-c)+'일 (+금화)</span></div>'; }
      h+='<div class="sech"><span class="l">일일 미션</span><span class="s">자정 초기화</span></div>';
      h+=dailyMissionsToday().map(missionRow).join('');
      const _cmN=customMissionList().length; h+='<div class="sech"><span class="l">내 미션</span>'+(_cmN>=5?'<span class="s">최대 5개</span>':'<button class="link" '+App.view.act('openCustomMissionEdit')+'>+ 추가</button>')+'</div>';
      const mine=customMissionList();
      h+= mine.length ? mine.map(customMissionRow).join('') : '<div class="note" style="margin:2px 0 4px;">매일 체크할 나만의 습관을 추가해요(최대 5개). 7일 연속마다 은화 보상.</div>';
      h+='<div class="sech"><span class="l">주간 미션</span><span class="s">월요일 초기화</span></div>';
      h+=WEEKLY_MISSIONS.map(missionRow).join('');
      h+='<div class="sech"><span class="l">월간 챌린지</span><span class="s">매월 1일 초기화</span></div>';
      h+=MONTHLY_MISSIONS.map(missionRow).join('');
      h+='<div class="sech"><span class="l">업적</span><span class="s">한 번만</span></div>';
      h+=ACHIEVEMENTS.map(missionRow).join('');
      h+='<div class="note" style="margin-top:12px;"><b>은화</b>로 알뜰샵에서 고양이·가구를 사세요. 일일은 자정, 주간은 월요일, 월간 챌린지는 매월 1일(KST) 초기화됩니다. 펫을 오래 쓰다듬어 <b>애정 만렙</b>을 찍으면 금화도 받아요.</div>';
      return h;
    }

