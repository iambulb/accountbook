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
    // 포즈(측면, 오른쪽) — 앉기/식빵/낮잠. 가구 근처·유휴 시 사용.
    const M_CAT_SIT = [
      "............XX..XX..",
      "...........XBBXXBBX.",
      "...........XIBXXBIX.",
      "...........XBBBBBBBX",
      "...........XBBSSBBBX",
      "...........XBBBBEEBX",
      "...........XBBBBBBPX",
      "...XX..XXXXLLLBBBBBX",
      "..XBBXXBBBBBBBBBBBBX",
      "..XBBBXBBSBBSBBBXXX.",
      "..XBBBBBBBBBBBBBBX..",
      "...XSBBBBBBBBBBBBX..",
      "...XBBBBBBLLBLLBBX..",
      "...XBBBBBBLLBLLBBX..",
      "...XBBBBBBLLBLLBBX..",
      "....XXXXXXLLXLLXX..."
    ];
    const M_CAT_LOAF = [
      ".............XBBXXBBX.",
      ".............XIBXXBIX.",
      ".....XXXXXXXXXBBBBBBBX",
      "....XBBBBBBBBBBBBBBBBX",
      "...XBBBBBBBBBBBBBBEEBX",
      "..XXBBBBSBBSBBBBBBBBPX",
      ".XBSBBSBBBBBBBBBBBBBBX",
      ".XBBBBBBBBBBBBBBBBBBBX",
      "..XXBLLLLLLLLLLLLLBBX.",
      "...XBLLLLLLLLLLLLLBBX.",
      "....XXXXXXXXXXXXXXXX.."
    ];
    const M_CAT_SLEEP = [
      "......................",
      "...............XX.....",
      "......XXXXXXXXXBBXXX..",
      ".....XBBBBBBBBBBBXBBX.",
      "....XBBBBBBBBBBBBBBBBX",
      "....XBBBBSBBSBBBBBBBBX",
      "...XBBBBBBBBBBBBBSSBBX",
      "...XBBBBBBBBBBBBBBBBBX",
      "..XBSBBBBBBBBBLLLBBBBX",
      "..XBBBBBBBBBBBLLLBBBX.",
      "...XXBBLLLLLLLLLLBBX..",
      ".....XXXXXXXXXXXXXX..."
    ];
    // 은화(코인) — 좌우 대칭 원형(양쪽 모두 둥글게), 중앙에 고양이 얼굴. X=외곽 S=밝은림 A=면 D=바닥그림자 E=눈 P=코
    const M_COIN = [
      "....XXXX....",
      "..XXSSSSXX..",
      ".XSSSSSSSSX.",
      "XSSAA..AASSX",
      "XSAAAAAAAASX",
      "XSAAEAAEAASX",
      "XSAAAPPAAASX",
      "XSSAAAAAASSX",
      ".XSDDDDDDSX.",
      "..XXSSSSXX..",
      "....XXXX...."
    ];
    const M_CUSHION = [
      "................","...XXXXXXXX.....","..XCCCCCCCCX....",".XCCCCCCCCCCX...",
      ".XCDDDDDDDDCX...","..XXCCCCCCXX....","....XXXXXX......"
    ];
    // 밥그릇: 기본은 빈 그릇(밥 이미지 제거). 홈에서 탭해 사료를 채우면 M_BOWL_FOOD로 표시.
    const M_BOWL = [
      "................","................","...XXXXXXXXX....","..XWWWWWWWWWWX..",
      "..XWWWWWWWWWWX..","...XWWWWWWWWX...","....XXXXXXXX....","................"
    ];
    const M_BOWL_FOOD = [
      "................",".....FFFFF......","...XFFFFFFFX....","..XWFFFFFFFWX...",
      "..XWWWWWWWWWWX..","...XWWWWWWWWX...","....XXXXXXXX....","................"
    ];
    // 물그릇 채움(물=A). 빈 물그릇은 M_BOWL(회색)로 표시.
    const M_WATERBOWL_WATER = [
      "................","................","...XXXXXXXXX....","..XAAAAAAAAAAX..",
      "..XAAAAAAAAAAX..","...XAAAAAAAAX...","....XXXXXXXX....","................"
    ];
    // 펫 화장실(2×1): 가로로 넓고 낮은 모래 트레이(캠·방에서 방석 폭의 약 2배). 비운 그릇 수만큼 똥이 쌓임. 가로세로비 ≈ 32/9.
    const M_LITTER = [
      "................................",
      "..XXXXXXXXXXXXXXXXXXXXXXXXXXXX..",
      "..XWSSSSSSSSSSSSSSSSSSSSSSSSWX..",
      "..XWSSSSSSSSSSSSSSSSSSSSSSSSWX..",
      "..XWSSSSSSSSSSSSSSSSSSSSSSSSWX..",
      "..XWSSSSSSSSSSSSSSSSSSSSSSSSWX..",
      "..XWWWWWWWWWWWWWWWWWWWWWWWWWWX..",
      ".XWWWWWWWWWWWWWWWWWWWWWWWWWWWWX.",
      "..XXXXXXXXXXXXXXXXXXXXXXXXXXXX.."
    ];
    const M_POOP = [
      "........","...XX...","..XKKX..",".XKKKKX.",".XKKKKX.","..XKKX..","...XX...","........"
    ];
    // 소비 아이템 아이콘(상점 소비 탭)
    const M_FOOD = [
      "............","............",".....FF.....","....FFFF....","...FFFFFF...",
      "..FFFFFFFF..","..FDFFFFDF..","..FFFFFFFF..","...FFFFFF...","............"
    ];
    const M_WATER = [
      "............",".....A......",".....A......","....AAA.....","...AAAAA....",
      "..AAAAAAA...","..AAAAAAA...","...AAAAA....","....AAA.....","............"
    ];
    // 캣타워: 3층(발판 3개) 세로형. 비율 11×22 ≈ 3:6칸. 고양이가 각 층 발판에 올라가 쉼.
    const M_TOWER = [
      ".XXXXXXXXX.",
      ".XWWWWWWWX.",
      ".XWWWWWWWX.",
      ".XXXXXXXXX.",
      "...XPPPX...",
      "...XPPPX...",
      "...XPPPX...",
      ".XXXXXXXXX.",
      ".XWWWWWWWX.",
      ".XWWWWWWWX.",
      ".XXXXXXXXX.",
      "...XPPPX...",
      "...XPPPX...",
      "...XPPPX...",
      ".XXXXXXXXX.",
      ".XWWWWWWWX.",
      ".XWWWWWWWX.",
      ".XXXXXXXXX.",
      "...XPPPX...",
      "...XPPPX...",
      "..XXXXXXX..",
      "..XXXXXXX.."
    ];
    const M_SCRATCHER = [
      "................",".....XXXXXX.....","....XWWWWWWX....","....XWWWWWWX....",".....XXPPXX.....",
      "......XPPX......","......XPPX......","......XPPX......","......XPPX......","......XPPX......",
      "......XPPX......","......XPPX......",".....XXPPXX.....","...XXWWWWWWXX...","..XWWWWWWWWWWX..","..XXXXXXXXXXXX.."
    ];
    // 펫하우스(3×3): 박공 지붕 + 정면 아치 출입구. 출입구 안(D=어두운 실내) 앞에 펫이 앉아 정면(south)을 봄. 24×20 → 가로세로비 1.2.
    const M_PETHOUSE = [
      "...........XX...........",
      "..........XRRX..........",
      ".........XRRRRX.........",
      "........XRRRRRRX........",
      ".......XRRRRRRRRX.......",
      "......XRRRRRRRRRRX......",
      ".....XRRRRRRRRRRRRX.....",
      "....XRRRRRRRRRRRRRRX....",
      "...XRRRRRRRRRRRRRRRRX...",
      "...XXXXXXXXXXXXXXXXXX...",
      "....XWWWWWWWWWWWWWWX....",
      "....XWWWWWWDDWWWWWWX....",
      "....XWWWWWDDDDWWWWWX....",
      "....XWWWWDDDDDDWWWWX....",
      "....XWWWDDDDDDDDWWWX....",
      "....XWWWDDDDDDDDWWWX....",
      "....XWWWDDDDDDDDWWWX....",
      "....XWWWDDDDDDDDWWWX....",
      "....XWWWDDDDDDDDWWWX....",
      "....XXXXDDDDDDDDXXXX...."
    ];
    const CAT_PALS = {
      cat_mackerel:{X:'#3b4048',B:'#9AA6B4',L:'#D8DDE3',S:'#6E7A8A',E:'#22242b',P:'#E08b9d',I:'#E6A9B4'},
      cat_cheese:  {X:'#6b3f1c',B:'#E8974C',L:'#F6D6A6',S:'#CC7A33',E:'#3a2415',P:'#E08b9d',I:'#F0C8A0'},
      cat_calico:  {X:'#544e45',B:'#F3EFE8',L:'#FCFAF5',O:'#E8974C',K:'#3d3a40',S:'#c9c3ba',E:'#22242b',P:'#E08b9d',I:'#E6A9B4'},
      cat_black:   {X:'#181a1e',B:'#3a3d44',L:'#C9CCD2',S:'#2b2e34',E:'#F2C84B',P:'#E08b9d',I:'#7a5560'},  // 까망(턱시도, 노란 눈)
      cat_white:   {X:'#B9B4AA',B:'#F3EFE8',L:'#FCFAF5',S:'#DDD8CF',E:'#4C7FE0',P:'#E08b9d',I:'#E6A9B4'}   // 하양(파란 눈)
    };
    const COIN_PAL={X:'#6f7681',S:'#d6dbe1',D:'#a8afb8',A:'#4a4f57',E:'#d6dbe1',P:'#cf8f6c'};
    const GOLD_PAL={X:'#8a6a1e',S:'#F4D06B',D:'#caa23a',A:'#7a5a12',E:'#fff0b8',P:'#cf8f6c'};   // 금화(은화와 동형, 금색)
    const FURN_PALS={ cushion:{X:'#5b6470',C:'#a9b2be',D:'#868f9c'}, bowl:{X:'#5b6470',W:'#d0d6dd',F:'#d68b4a'}, waterbowl:{X:'#5b6470',W:'#d0d6dd',A:'#5aa9e6'}, tower:{X:'#6f4c28',W:'#c99a5f',P:'#8a6a3f'}, scratcher:{X:'#6f4c28',W:'#c99a5f',P:'#d8b98a'}, litterbox:{X:'#8a8f98',W:'#c9ced6',S:'#e6dcc3'}, pethouse:{X:'#5a4632',R:'#d9694e',W:'#e8c98f',D:'#2c2420'} };
    const POOP_PAL={X:'#4a3218',K:'#7a5230'};
    const FOOD_PAL={F:'#d68b4a',D:'#a5642a'};
    const WATER_PAL={A:'#5aa9e6',D:'#3f86c4'};
    // ---- 펫알/랜덤박스 도트 ----
    // 알: 위는 둥근 돔(꼭대기 좁게), 아래가 넓고 둥글게. 상단 외곽은 S(밝은 회색)로 계단 모서리를 부드럽게(안티에일리어싱)해 실루엣이 투박하지 않게. 중앙에 크고 두꺼운 무지개(R→P) 물음표(위 방향 유지). S=우측 그림자·상단 외곽 완화.
    const M_EGG = [
      ".....SXXS.....",
      "....SXWWXS....",
      "...SXWWWWXS...",
      "...XWWWWWWX...",
      "..XWWWWWWWWX..",
      ".XWWWRRRRWWWX.",
      ".XWWRRRRRRWWX.",
      "XWWWRRWWOOWWSX",
      "XWWWWWWOOOWWSX",
      "XWWWWWYYYWWWSX",
      "XWWWWGGGWWWWSX",
      ".XWWWWGGWWWSX.",
      ".XWWWWBBWWWSX.",
      "..XWWWWWWWWX..",
      "...XWWPPWWX...",
      "....XXXXXX...."
    ];
    // 균열1: 위쪽(뾰족한 끝)에 잔금이 생김
    const M_EGG_C1 = [
      ".....SXXS.....",
      "....SXWWXS....",
      "...SXWXWWXS...",
      "...XWXWWWWX...",
      "..XWXWWWWWWX..",
      ".XWWWRRRRWWWX.",
      ".XWWRRRRRRWWX.",
      "XWWWRRWWOOWWSX",
      "XWWWWWWOOOWWSX",
      "XWWWWWYYYWWWSX",
      "XWWWWGGGWWWWSX",
      ".XWWWWGGWXWSX.",
      ".XWWWWBBWXWSX.",
      "..XWWWWWXWWX..",
      "...XWWPPWWX...",
      "....XXXXXX...."
    ];
    // 균열2: 금이 번지고 조각이 떨어질 듯
    const M_EGG_C2 = [
      ".....S..S.....",
      "....SXWWXS....",
      "...SXWXWWXS...",
      "...XWXWWWWX...",
      "..XWXWWWWWWX..",
      ".XWXWRRRRWWWX.",
      ".XWWRRRRRRWWX.",
      "XWXWRRWWOOWWSX",
      "XWWWWWWOOOWWSX",
      "XWWWWWYYYWWWSX",
      "XWWWXGGGWWWWSX",
      ".XWWWWGGWXWSX.",
      ".XWXWWBBWWWSX.",
      "..XWWWWWXWWX..",
      "...XWWPPWWX...",
      "....XX.XXX...."
    ];
    // 박스: 위에 뚜껑(C=윗면, L=앞면), 아래에 몸체(W). 앞면 중앙에 알과 같은 무지개 물음표.
    const M_BOX = [
      "................",
      "....XXXXXXXX....",
      "..XXCCCCCCCCXX..",
      ".XCCCCCCCCCCCCX.",
      "XXXXXXXXXXXXXXXX",
      "XLLLLLLLLLLLLLLX",
      "XXXXXXXXXXXXXXXX",
      ".XWWWWRRRRWWWWX.",
      ".XWWWRRWWOOWWWX.",
      ".XWWWWWWWOOWWWX.",
      ".XWWWWWWYYWWWWX.",
      ".XWWWWWGGWWWWWX.",
      ".XWWWWWBBWWWWWX.",
      ".XWWWWWWWWWWWWX.",
      ".XWWWWWPPWWWWWX.",
      ".XXXXXXXXXXXXXX."
    ];
    const EGG_PAL={X:'#c9c2b0',W:'#FBFBFD',S:'#E7E3DA',R:'RAINBOW',O:'RAINBOW',Y:'RAINBOW',G:'RAINBOW',B:'RAINBOW',P:'RAINBOW'};
    const BOX_PAL={X:'#b9c0cb',W:'#FBFBFD',C:'#cdd5e4',L:'#b7c0d4',R:'RAINBOW',O:'RAINBOW',Y:'RAINBOW',G:'RAINBOW',B:'RAINBOW',P:'RAINBOW'};
    // 은화 속 검은 고양이의 앞발(특별↑ 연출에서 톡 건드림)
    const M_PAW = [
      "...XXXXX..","..XBBBBBX.",".XBBBBBBBX",".XBPBPBPBX",".XBBBBBBBX",".XBBPPBBBX",".XBBPPBBBX","..XBBBBBX.","...XXXXX.."
    ];
    const PAW_PAL={X:'#181a1e',B:'#2b2e34',P:'#E08b9d'};

    // 카탈로그(코드 상수) — 저장은 보유 id만. id는 종·색 구분(예: cat_calico, dog_corgi), species는 분류/필터용.
    // 새 동물(네발 짐승) 처리 규칙은 docs/pet-asset-pipeline.md 참고.
    // 가격(은화)은 등급·확률에 맞춰 재산정 — 등급이 오를수록 대략 2배씩(TIER_PRICE 참고).
    // 알(펫알) 100은화로 열면 금화+1·중복 30은화 환급이라, 흔한 등급은 알보다 싸게·희귀는 알보다 비싸게 잡아
    // "직접 구매 vs 뽑기" 선택지가 성립하도록 함. 가격은 CAT_TIER→TIER_PRICE로 산정(normalizePrices).
    // @gen:pet-catalog — 자동생성(tools/build_pets.py). 직접 수정 말고 tools/pets.json 편집 후 재실행.
    const PET_CATALOG = [
      { id:'cat_mackerel', species:'cat', name:'고등어', price:50, desc:'쿨그레이 줄무늬. 차분하게 방을 돌아다녀요.' },
      { id:'cat_cheese', species:'cat', name:'치즈', price:100, desc:'웜오렌지. 활발하게 뛰어다니는 개냥이.' },
      { id:'cat_calico', species:'cat', name:'삼색', price:200, desc:'검정·주황 어우러진 삼색(토터셸). 도도하게 창가에 앉아요.' },
      { id:'cat_black', species:'cat', name:'까망', price:400, desc:'노란 눈의 까만 고양이. 조용히 방을 지켜요.' },
      { id:'cat_white', species:'cat', name:'하양', price:400, desc:'파란 눈의 새하얀 고양이. 볕에서 낮잠을 즐겨요.' },
      { id:'cat_fluffy', species:'cat', name:'복슬이', price:200, desc:'복슬복슬한 털에 파란 눈. 나른하게 졸며 방을 거닐어요.' },
      { id:'cat_tuxedo', species:'cat', name:'턱시도', price:800, desc:'검은 정장에 하얀 셔츠·발. 단정하게 걸어다녀요.' },
      { id:'cat_chaos', species:'cat', name:'카오스', price:800, desc:'다크그레이+브라운 소용돌이 무늬. 종잡을 수 없이 쏘다녀요.' },
      { id:'cat_siamese', species:'cat', name:'샴', price:1500, desc:'크림빛 몸에 짙은 포인트. 우아하게 방을 누벼요.' },
      { id:'cat_bengal', species:'cat', name:'벵갈', price:100, desc:'골든빛 몸에 동글동글 반점. 야무지게 돌아다녀요.' },
      { id:'cat_fold', species:'cat', name:'폴드', price:200, desc:'접힌 귀가 매력. 얌전히 자리를 지켜요.' },
      { id:'cat_bora', species:'cat', name:'보라', price:400, desc:'한쪽은 파랑·한쪽은 호박색 오드아이. 신비롭게 거닐어요.' },
      { id:'cat_choco', species:'cat', name:'초코', price:100, desc:'초콜릿빛 갈색 털에 크림색 입가·가슴. 느긋하게 방을 거닐어요.' },
      { id:'cat_kitten', species:'cat', name:'아깽이', price:50, desc:'치즈빛 오렌지 태비 아기고양이. 뒤뚱뒤뚱 방을 쏘다녀요.' }
    ];
    // @gen:end
    // 종(species) → 상점 분류 라벨. 품종(샴·벵갈 등)은 표시하지 않고 종만 노출.
    const SPECIES_LABEL = { cat:'고양이', dog:'강아지', rabbit:'토끼' };
    function speciesLabel(id){ const c=PET_CATALOG.find(x=>x.id===id); return (c&&SPECIES_LABEL[c.species])||'펫'; }
    // 구 id(고양이 전용 시절) → 신 id. RTDB 보유/활성 데이터 하위호환(normalizeGame에서 적용).
    const PET_ID_MIGRATE = { mackerel:'cat_mackerel', cheese:'cat_cheese', calico:'cat_calico', black:'cat_black', white:'cat_white' };
    // size = 표시 배율(1=기본). footW×footH = 배치 격자 점유(가로×세로 칸). 캣타워=3×6(세로 큼), 스크래처=2×2, 화장실=2×1(가로로 넓음), 방석·밥그릇=1×1(작게, 밥그릇<방석). itemFoot()/furnScale()로 배치·방·상점에 반영.
    const ITEM_CATALOG = [
      { id:'cushion', name:'방석',   price:15, size:0.6,  footW:1, footH:1, desc:'고양이가 위에 잠시 올라가 쉬어요.' },
      { id:'bowl',    name:'밥그릇', price:20, size:0.45, footW:1, footH:1, desc:'홈에서 탭해 사료를 채워요(3시간 뒤 비워짐).' },
      { id:'waterbowl', name:'물그릇', price:20, size:0.45, footW:1, footH:1, desc:'홈에서 탭해 물을 채워요(3시간 뒤 비워짐).' },
      { id:'tower',   name:'캣타워', price:35, size:2,    footW:3, footH:6, desc:'3층 발판 — 한 층에 올라가 쉬어요.' },
      { id:'scratcher', name:'스크래처', price:18, size:2, footW:2, footH:2, desc:'옆에서 잠시 머물며 발톱을 갈아요.' },
      { id:'litterbox', name:'화장실', price:25, size:1, footW:2, footH:1, desc:'비운 그릇 수만큼 똥이 쌓여요. 탭해 치우면 은화!' },
      { id:'pethouse', name:'펫하우스', price:45, size:2, footW:3, footH:3, desc:'펫이 안에 들어가 정면을 보며 아늑하게 쉬어요.' }
    ];
    // 소비 아이템(배치 불가) — 홈에서 밥그릇/물그릇을 탭해 채울 때 소모. 상점 "소비" 탭에서 구매.
    const CONSUM_CATALOG = [
      { id:'food',  name:'사료', price:1, M:'M_FOOD',  desc:'밥그릇을 탭해 채울 때 1개 소모.' },
      { id:'water', name:'물',   price:1, M:'M_WATER', desc:'물그릇을 탭해 채울 때 1개 소모.' }
    ];
    const FILL_MS = 3*60*60*1000;   // 그릇이 채워진 뒤 비워지기까지(3시간)
    const POOP_REWARD = 2;          // 똥 하나 치우면 얻는 은화
    const CARE_ITEMS = ['bowl','waterbowl','litterbox'];   // 고양이 수(slotCount)만큼만 배치 허용
    // 벽지(방 배경) — 구매 후 적용. default는 기본 제공.
    const WALLPAPER_CATALOG = [
      { id:'default', name:'기본',  price:0,  css:'linear-gradient(180deg,color-mix(in srgb,var(--soft) 55%,var(--card)) 0%,var(--soft) 100%)' },
      { id:'sky',     name:'하늘',  price:25, css:'linear-gradient(180deg,#bfe3ff 0%,#e9f5ff 100%)' },
      { id:'sakura',  name:'벚꽃',  price:30, css:'linear-gradient(180deg,#ffdcea 0%,#fff1f6 100%)' },
      { id:'mint',    name:'민트',  price:25, css:'linear-gradient(180deg,#c9ede0 0%,#eefaf4 100%)' },
      { id:'night',   name:'별밤',  price:40, css:'linear-gradient(180deg,#2a2e57 0%,#525891 100%)' },
      { id:'peach',   name:'살구',  price:20, css:'linear-gradient(180deg,#ffe4cf 0%,#fff4ea 100%)' }
    ];
    function wallCss(id){ const w=WALLPAPER_CATALOG.find(x=>x.id===id); return (w||WALLPAPER_CATALOG[0]).css; }
    function ownsWall(id){ return id==='default' || !!(state.game&&state.game.owned.wallpapers[id]); }
    function currentWall(){ return (state.game&&state.game.home.wallpaper)||'default'; }
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
      opt=opt||{}; const cols=map[0].length, rows=map.length; let r=''; let rbw=false; const rid='pxrbw'+(pxSvg._n=(pxSvg._n||0)+1);
      for(let y=0;y<rows;y++){ const row=map[y];
        for(let x=0;x<cols;x++){ const ch=row[x]; if(ch===' '||ch==='.')continue; const c=pal[ch]; if(!c)continue;
          const f=c==='RAINBOW'?(rbw=true,'url(#'+rid+')'):c; r+='<rect x="'+x+'" y="'+y+'" width="1.05" height="1.05" fill="'+f+'"/>'; } }
      const sz = opt.h ? ('height="'+opt.h+'"') : (opt.w? ('width="'+opt.w+'"') : '');
      const wh = opt.fit ? 'width="100%" height="100%"' : sz;
      return '<svg class="px '+(opt.cls||'')+'" viewBox="0 0 '+cols+' '+rows+'" '+wh+' shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet">'+(rbw?'<defs><linearGradient id="'+rid+'" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="9" spreadMethod="repeat"><stop offset="0" stop-color="#F04452"/><stop offset=".17" stop-color="#F0883C"/><stop offset=".34" stop-color="#F2C84B"/><stop offset=".5" stop-color="#2FAE7A"/><stop offset=".67" stop-color="#3182F6"/><stop offset=".84" stop-color="#9B6FC8"/><stop offset="1" stop-color="#F04452"/><animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="0 9" dur="1.6s" repeatCount="indefinite"/></linearGradient></defs>':'')+r+'</svg>';
    }
    function catFront(id, opt){ return pxSvg(id==='cat_calico'?M_CALICO_FRONT:M_CAT_FRONT, CAT_PALS[id], opt); }
    function catSide(id, frame, opt){ return pxSvg(frame? M_CAT_SIDE_B:M_CAT_SIDE_A, CAT_PALS[id], opt); }
    // ---- PNG 스프라이트 시트(PixelLab) — 걷기 6프레임(288×48, east) + 정지 4방향(48×48) ----
    // 처리 규칙은 docs/pet-asset-pipeline.md("Pet Asset Pipeline") 참고. 시트 있는 동물은 CSS steps()로 걷기.
    // 쉴 때는 stills(south=앞/north=뒤/east=우/west=좌) 중 하나를 무작위로 보여준다(정면·후면·옆 보기).
    const CAT_FACES = ['south','north','east','west'];
    // ⚠️ 스프라이트 경로는 반드시 절대 URL로 만든다. `--sheet:url(assets/…)`를 상대경로로 두면
    // styles.css 안의 `background-image:var(--sheet)`가 스타일시트 위치(/css/) 기준으로 해석해
    // `/css/assets/…` 404 → 고양이가 안 보인다. document.baseURI 기준 절대 URL로 고정.
    function assetUrl(p){ try{ return new URL(p, document.baseURI).href; }catch(e){ return p; } }
    function sprStills(id){ return 'assets/pets/'+id; }
    function sprStill(id, face){ return assetUrl(sprStills(id)+'/'+face+'.png'); }
    // @gen:pet-sprites — 자동생성(tools/build_pets.py). tools/pets.json 편집 후 재실행.
    const PET_SPRITES = {
      cat_mackerel:{ walk:'assets/pets/cat_mackerel/walk.png', frames:6, stills:true },
      cat_cheese:{ walk:'assets/pets/cat_cheese/walk.png', frames:6, stills:true },
      cat_calico:{ walk:'assets/pets/cat_calico/walk.png', frames:6, stills:true },
      cat_black:{ walk:'assets/pets/cat_black/walk.png', frames:6, stills:true },
      cat_white:{ walk:'assets/pets/cat_white/walk.png', frames:6, stills:true },
      cat_fluffy:{ walk:'assets/pets/cat_fluffy/walk.png', frames:6, stills:true },
      cat_tuxedo:{ walk:'assets/pets/cat_tuxedo/walk.png', frames:6, stills:true },
      cat_chaos:{ walk:'assets/pets/cat_chaos/walk.png', frames:6, stills:true },
      cat_siamese:{ walk:'assets/pets/cat_siamese/walk.png', frames:6, stills:true },
      cat_bengal:{ walk:'assets/pets/cat_bengal/walk.png', frames:6, stills:true },
      cat_fold:{ walk:'assets/pets/cat_fold/walk.png', frames:6, stills:true },
      cat_bora:{ walk:'assets/pets/cat_bora/walk.png', frames:6, stills:true },
      cat_choco:{ walk:'assets/pets/cat_choco/walk.png', frames:6, stills:true },
      cat_kitten:{ walk:'assets/pets/cat_kitten/walk.png', frames:6, stills:true }
    };
    // @gen:end
    function hasSprite(id){ return !!PET_SPRITES[id]; }
    // 걷기 무대 액터 1개의 내부 마크업 — 시트 있으면 스프라이트 div, 없으면 SVG 프레임0.
    // reduced-motion이면 처음부터 정지 이미지(south=앞)로 고정.
    function catActorHTML(id, h){
      const sp=PET_SPRITES[id];
      if(sp){ const s=Math.round(h); const rm=reducedMotion(); const fw=sp.frontWalk;
        // frontWalk 고양이는 walk.png가 정면이라 걷기 시트를 애니메이션하지 않고 항상 정지 스틸(.idle)로 둔다.
        //  - 이동 중엔 east(옆) 스틸을 보여주고 scaleX로 방향을 뒤집음, 정지/reduced-motion이면 south(정면).
        const idleOn = rm || fw;
        const face = (fw && !rm) ? 'east' : 'south';
        return '<div class="cspr'+(idleOn?' idle':'')+'" style="width:'+s+'px;height:'+s+'px;--sheet:url('+assetUrl(sp.walk)+');--idle:url('+sprStill(id,face)+');--fw:'+(s*sp.frames)+'px;"><i class="csprf"></i></div>'; }
      return catSide(id, 0, {h:h});
    }
    // 정면 썸네일(걷지 않는 표시용: 상점 카드·보유 칩·뽑기 결과 등).
    // 스프라이트 고양이는 south(정면) PNG, 없으면 SVG 매트릭스로 자동 분기.
    // ★ 고양이를 추가/수정할 땐 정면 표시는 반드시 catFace를 거쳐야 dock·방·상점·보유목록·뽑기 어디서나 같은 아트가 나온다.
    function catFace(id, opt){ opt=opt||{}; const h=opt.h||48;
      if(hasSprite(id)){ const s=Math.round(h);
        return '<img class="catpx" src="'+sprStill(id,'south')+'" alt="" width="'+s+'" height="'+s+'" loading="lazy">'; }
      return catFront(id, opt); }
    const POSE_M = { sit:M_CAT_SIT, loaf:M_CAT_LOAF, sleep:M_CAT_SLEEP };
    function catPose(id, pose, opt){ return pxSvg(POSE_M[pose]||M_CAT_SIDE_A, CAT_PALS[id], opt); }
    function coinSvg(opt){ return pxSvg(M_COIN, COIN_PAL, opt); }
    function goldSvg(opt){ return pxSvg(M_COIN, GOLD_PAL, opt); }
    function eggSvg(stage, opt){ return pxSvg(stage>=2?M_EGG_C2:(stage>=1?M_EGG_C1:M_EGG), EGG_PAL, opt); }
    function boxSvg(opt){ return pxSvg(M_BOX, BOX_PAL, opt); }
    function pawSvg(opt){ return pxSvg(M_PAW, PAW_PAL, opt); }
    // 상점·팔레트·격자용 대표 아트(물그릇은 물 채운 파란 그릇으로 구분 표시)
    function furnSvg(id, opt){ const M={cushion:M_CUSHION,bowl:M_BOWL,waterbowl:M_WATERBOWL_WATER,tower:M_TOWER,scratcher:M_SCRATCHER,litterbox:M_LITTER,pethouse:M_PETHOUSE}[id]; return pxSvg(M, FURN_PALS[id], opt); }
    // 방(홈·dock)용 — 채움 상태 반영: 밥그릇=빈/사료, 물그릇=빈(회색)/물.
    function furnRoomSvg(itemId, key, opt){
      if(itemId==='bowl')      return pxSvg(isFilled(key)?M_BOWL_FOOD:M_BOWL, FURN_PALS.bowl, opt);
      if(itemId==='waterbowl') return pxSvg(isFilled(key)?M_WATERBOWL_WATER:M_BOWL, FURN_PALS.waterbowl, opt);
      return furnSvg(itemId, opt);
    }
    function poopSvg(opt){ return pxSvg(M_POOP, POOP_PAL, opt); }
    function consumSvg(id, opt){ return id==='food'?pxSvg(M_FOOD,FOOD_PAL,opt):pxSvg(M_WATER,WATER_PAL,opt); }
    // 가구 표시 배율(ITEM_CATALOG.size) — 캣타워·스크래처=2(크게), 방석=0.7·밥그릇=0.5(작게)
    function furnScale(id){ const it=ITEM_CATALOG.find(x=>x.id===id); return (it&&it.size)||1; }
    // 방(dock·홈)에서의 가구 렌더 높이(px) — 발자국 세로 칸수(footH)에 비례해 키움(캣타워 6칸=제일 큼, 스크래처 2칸, 방석·밥그릇 1칸).
    // 고양이 상호작용(캣타워 3층 올라가기 등)이 맞아떨어지도록 렌더·엔진(fh)이 같은 값을 쓴다. depth(뒤로 갈수록) 작게.
    // 방 렌더 높이 배율(실물감) — 캣타워 제일 큼, 스크래처는 고양이 키만큼, 화장실=낮은 상자, 방석·그릇 작게.
    const ROOM_H = { tower:6.2, scratcher:2.9, pethouse:3.2, litterbox:1.3, cushion:1, bowl:0.8, waterbowl:0.8 };
    // 가구 그래픽 가로세로비(cols/rows) — 좌측하단 앵커라 그래픽 중앙 x = 좌측 edge + fh*aspect/2 (고양이가 가구 중앙에 서게).
    const FURN_ASPECT = { tower:0.5, scratcher:1.0, pethouse:1.2, litterbox:3.56, cushion:2.29, bowl:2.0, waterbowl:2.0 };
    function furnAspect(id){ return FURN_ASPECT[id]||1; }
    function furnRoomH(id, isDock, depth){
      const mult = ROOM_H[id] || 1;
      // 근거리(depth 0)는 크게. 원거리 축소폭은 크기에 비례 — 작은 가구(방석·그릇)는 멀어도 덜 작게(완만),
      // 캣타워처럼 큰 가구는 멀수록 더 작게(원근 강하게).
      const base = isDock ? 11 : 16;
      const shrink = (isDock ? 2 : 3) + Math.max(0, mult-1) * (isDock ? 0.6 : 1.0);
      const unit = base - depth*shrink;
      return Math.max(4, Math.round(unit*mult));
    }
    function catName(id){ const o=state.game&&state.game.owned&&state.game.owned.cats&&state.game.owned.cats[id]; if(o&&o.name) return o.name; const c=PET_CATALOG.find(x=>x.id===id); return c?c.name:id; }

    // ---- 날짜 키(KST 롤오버) ----
    function kstDayKey(){ const d=new Date(Date.now()+9*3600000); return d.toISOString().slice(0,10); }   // 2026-07-01
    function kstWeekKey(){ const d=new Date(Date.now()+9*3600000); const mon=(d.getUTCDay()+6)%7; d.setUTCDate(d.getUTCDate()-mon); return 'W'+d.toISOString().slice(0,10); } // 그 주 월요일(KST)
    // 이번 주(월~) 현재 워크스페이스에서 기록한 서로 다른 날 수
    function recordDaysThisWeek(){ const wk=kstWeekKey().slice(1); const days={}; (state.transactions||[]).forEach(t=>{ const d=(t.date||'').slice(0,10); if(!d) return; const kd=weekKeyOf(d); if(kd===kstWeekKey()) days[d]=1; }); return Object.keys(days).length; }
    function weekKeyOf(dateStr){ const d=new Date(dateStr+'T00:00:00Z'); const mon=(d.getUTCDay()+6)%7; d.setUTCDate(d.getUTCDate()-mon); return 'W'+d.toISOString().slice(0,10); }
    function reportSeenThisWeek(){ const p=(state.game&&state.game.progress[kstWeekKey()])||{}; return !!p.reportSeen; }
    function markReportSeen(){ if(!state.uid||!state.game) return; if(reportSeenThisWeek()) return; gameRef().child('progress/'+kstWeekKey()+'/reportSeen').set(true); }
    // 활성 슬롯(집에 내보내기): 기본 3, 금화 SLOT_PRICE로 1칸 확장(최대 MAX_SLOTS).
    const BASE_SLOTS=3, MAX_SLOTS=20, SLOT_PRICE=100;   // 100금화로 1칸씩 확장, 최대 20. 슬롯 행 가로 스크롤.

    // ---- 게임 상태/경제 ----
    function gameRef(){ return db.ref('users/'+state.uid+'/game'); }
    // 보유(owned.cats)·활성(home.active)에 남아있는 구 id를 신 id로 이관(하위호환). 다음 쓰기 때 영구 반영.
    function migratePetIds(o){
      const m=PET_ID_MIGRATE, cats={};
      Object.keys(o.owned.cats).forEach(k=>{ cats[m[k]||k]=o.owned.cats[k]; }); o.owned.cats=cats;
      const seen={}; o.home.active=(o.home.active||[]).map(k=>m[k]||k).filter(k=>{ if(seen[k]) return false; seen[k]=1; return true; });
      return o;
    }
    function normalizeGame(g){ g=g||{}; return migratePetIds({
      coins: Number(g.coins)||0, gold: Number(g.gold)||0,
      owned:{ cats:(g.owned&&g.owned.cats)||{}, items:(g.owned&&g.owned.items)||{}, wallpapers:(g.owned&&g.owned.wallpapers)||{} },
      consum:{ food:Number(g.consum&&g.consum.food)||0, water:Number(g.consum&&g.consum.water)||0 },
      home:{ active:(g.home&&g.home.active)||[], placed:(g.home&&g.home.placed)||{}, wallpaper:(g.home&&g.home.wallpaper)||'default', poops:Number(g.home&&g.home.poops)||0, slots:Math.min(MAX_SLOTS, Math.max(BASE_SLOTS, Number(g.home&&g.home.slots)||BASE_SLOTS)) },
      missions: g.missions||{}, progress: g.progress||{}, codes: g.codes||{}
    }); }
    function gold(){ return (state.game&&state.game.gold)||0; }
    function initCatGame(){
      if(!state.uid) return;
      if(state._gameRef){ try{ state._gameRef.off(); }catch(e){} }
      state._gameRef=gameRef();
      state._gameRef.on('value', s=>{ state.game=normalizeGame(s.val()); onGameChange(); reconcilePets(); });
      startCatLoop();   // 통합 걷기 엔진(단일 rAF, 보이는 무대만 애니메이션)
      // 앱을 켜둔 동안에도 그릇 3시간 만료→똥 정산이 돌도록 주기 점검(다마고치)
      if(state._petTimer) clearInterval(state._petTimer);
      state._petTimer=setInterval(reconcilePets, 60000);
    }
    function onGameChange(){
      updateDockCoins();
      const dw=$('catdock'); const wall=dw&&dw.querySelector('.cr-wall'); if(wall) wall.style.background=wallCss(currentWall());
      renderDockProps();
      renderDockCats();
      if(state._sheetRefresh && $('sheet') && $('sheet').classList.contains('on')) state._sheetRefresh();
    }
    function coins(){ return (state.game&&state.game.coins)||0; }
    function ownsCat(id){ return !!(state.game&&state.game.owned.cats[id]); }
    function activeCats(){ const a=(state.game&&state.game.home.active)||[]; return a.filter(ownsCat); }
    function ownedCatList(){ return PET_CATALOG.filter(c=>ownsCat(c.id)).map(c=>c.id); }
    function isActiveCat(id){ return activeCats().indexOf(id)>=0; }
    // 집에 내보낼 수 있는 활성 슬롯: 기본 3, 금화 100으로 1칸 확장(최대 4).
    function slotCount(){ return Math.min(MAX_SLOTS, Math.max(BASE_SLOTS, (state.game&&state.game.home.slots)||BASE_SLOTS)); }
    // 활성 슬롯 토글(집에 내보내기 / 대기) — 최대 slotCount()마리
    function toggleActiveCat(id){
      if(!ownsCat(id)) return;
      const a=activeCats().slice(), i=a.indexOf(id), max=slotCount();
      if(i>=0) a.splice(i,1);
      else { if(a.length>=max){ toast('최대 '+max+'마리까지 내보낼 수 있어요', true); return; } a.push(id); }
      gameRef().child('home/active').set(a);
    }
    // 활성 슬롯 확장 구매(금화 SLOT_PRICE, 원자적·멱등). 첫 금화 소비처.
    function buySlot(){
      if(slotCount()>=MAX_SLOTS){ toast('이미 슬롯을 모두 열었어요'); return; }
      if(gold()<SLOT_PRICE){ toast('금화 '+(SLOT_PRICE-gold())+' 부족', true); return; }
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(g.gold<SLOT_PRICE || g.home.slots>=MAX_SLOTS) return g;   // 재검증
        const c=Math.min(MAX_SLOTS, Math.max(BASE_SLOTS, Number(g.home.slots)||BASE_SLOTS));
        g.gold-=SLOT_PRICE; g.home.slots=c+1;   // +1칸씩
        return g;
      }).then(res=>{ if(res.committed) toast('슬롯 +1 확장! 🐾'); });
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
    // 프로모/치트 코드 — 코드 입력 시 은화 지급(사용자별 1회, 게임 노드에 사용 기록)
    const PROMO_CODES = { showmethemoney: 999 };
    const REUSABLE_CODES = { showmethemoney: true };   // 중복 사용 허용 코드(그 외 일반 코드는 사용자당 1회)
    function redeemCode(code){
      const key=(code||'').trim().toLowerCase();
      const reward=PROMO_CODES[key];
      if(!reward){ toast('올바르지 않은 코드예요', true); return; }
      const reusable=!!REUSABLE_CODES[key];
      let already=false;
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(!reusable && g.codes[key]){ already=true; return g; }   // 재사용 불가 코드만 1회 제한
        g.codes[key]={ reward:reward, at:new Date().toISOString(), n:((g.codes[key]&&Number(g.codes[key].n))||0)+1 };
        g.coins += reward;
        return g;
      }).then(res=>{
        if(!res.committed) return;
        if(already) toast('이미 사용한 코드예요', true);
        else toast('+'+reward.toLocaleString()+' 은화 획득! 🐾');
      });
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
      const c=PET_CATALOG.find(x=>x.id===id); if(!c) return;
      if(ownsCat(id)){ toast('이미 보유한 고양이예요'); return; }
      if(isGachaOnlyCat(id)){ toast('이 등급은 펫알(가챠)로만 얻을 수 있어요'); setShopSub('event'); return; }
      if(coins()<c.price){ toast((c.price-coins())+' 은화 부족', true); return; }
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(g.coins<c.price || g.owned.cats[id]) return g;      // 재검증
        g.coins-=c.price; g.owned.cats[id]={boughtAt:new Date().toISOString()};
        if(g.home.active.length<(g.home.slots||BASE_SLOTS) && g.home.active.indexOf(id)<0) g.home.active.push(id);
        return g;
      }).then(res=>{ if(res.committed) toast(c.name+' 입양 완료! 🐾'); });
    }

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
      if(dockMode()==='hidden'){ d.className='catdock hidden'; d.innerHTML=''; stopWalk(); return; }
      d.className='catdock';
      // 웹캠 정면 방: 벽지(배경) + 바닥 + 배치 가구(배경) + 걷는 고양이
      d.innerHTML='<div class="cd-room" onclick="openCatHouse()">'+
        '<div class="cr-wall" style="background:'+wallCss(currentWall())+'"></div><div class="cr-floor"></div><div class="cr-base"></div>'+
        '<span class="cd-coin"><span class="cd-ci">'+coinSvg({h:16})+'</span><b id="cdCoins">0</b></span>'+
        batchBtnHtml()+
        '<div class="cr-props" id="cdProps"></div><div class="cr-stage" id="cdStage"></div></div>';
      updateDockCoins(); renderDockProps(); renderDockCats();
    }
    function updateDockCoins(){ const el=$('cdCoins'); if(el) el.textContent=coins().toLocaleString(); }
    // 방/dock 공용: 똥을 화장실들에 라운드로빈 분배(각 화장실 객체에 _poops 슬롯 배열 부여, 최대 5개)
    function distributePoops(list){
      const litters=list.filter(p=>p.itemId==='litterbox'); litters.forEach(l=>{ l._poops=[]; });
      const n=litters.length?Math.min((state.game.home.poops)||0, litters.length*5):0;
      for(let i=0;i<n;i++) litters[i%litters.length]._poops.push(i/litters.length|0);
    }
    // 배치물 하나의 마크업(그릇=탭 급여·채움 반영, 화장실=똥 수거). isDock이면 dock 크기.
    function propMarkup(p, isDock){
      const foot=itemFoot(p.itemId);
      // 앵커=배치칸 "좌측하단". x는 발자국 좌측 edge(가운데 정렬 X, CSS translateX(0)), 바닥은 발자국 앞줄(front row) 기준.
      const x=((p.c-1)/12*100).toFixed(2);
      const frontRow=p.r + foot.h - 1;   // 발자국에서 가장 앞(가까운) 줄에 바닥을 둠 → 가구가 위로 뜨지 않음
      // 반전: 격자 윗줄(작은 r)=방 뒤(멀리, 위·작게), 아랫줄(큰 r)=방 앞(가까이, 아래·크게)
      const depth=(12-frontRow)/11; const bottom=(isDock?(3+depth*38):(3+depth*46)).toFixed(1); const fh=furnRoomH(p.itemId,isDock,depth);
      // 원근 가림: 앞(frontRow 큰 값)일수록 z-index를 높여 앞 가구가 뒤 가구를 덮게 한다.
      // (밥·물그릇/화장실의 고정 z-index:2가 이 깊이 순서를 깨뜨리던 문제 → 인라인 z-index로 덮어씀)
      const z=Math.max(1, Math.round(frontRow));
      const tap=(p.itemId==='bowl'||p.itemId==='waterbowl');
      let inner=tap? furnRoomSvg(p.itemId,p.key,{h:fh}) : furnSvg(p.itemId,{h:fh});
      if(p.itemId==='litterbox'){ const slots=p._poops||[]; const ph=Math.max(6,Math.round(fh*0.32));
        inner+=slots.map(s=>'<span class="poop" onclick="collectPoop(event)" style="left:'+(20+(s%3)*26)+'%;top:'+(30+((s/3|0)*20))+'%;height:'+ph+'px" title="치우기 +'+POOP_REWARD+' 은화">'+poopSvg({h:ph})+'</span>').join(''); }
      return '<div class="cr-prop'+(tap?' cr-tap':'')+(p.itemId==='litterbox'?' cr-litter':'')+'" style="left:'+x+'%;bottom:'+bottom+'%;z-index:'+z+';"'+(tap?' onclick="event.stopPropagation();feedBowl(\''+p.key+'\')"':'')+'>'+inner+'</div>';
    }
    // 우측 상단 "일괄 돌보기" 버튼(밥·물 채우고 똥 치우기) — dock·홈 공용
    function batchBtnHtml(){ return '<button class="cr-batch" onclick="event.stopPropagation();batchCare(this)" aria-label="일괄 돌보기: 밥·물 채우고 똥 치우기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 20c0-3.6 3.4-5.5 7.5-5.5s7.5 1.9 7.5 5.5"/><circle cx="8" cy="8.5" r="1.5"/><circle cx="16" cy="8.5" r="1.5"/><circle cx="12" cy="6.5" r="1.6"/></svg>돌보기</button>'; }
    // 배치 가구를 무대 바닥에 배경으로(가로=열, 앞뒤 깊이=행)
    function renderDockProps(){
      const box=$('cdProps'); if(!box) return;
      reconcilePets();   // 캠 화면에서도 3시간 만료→똥 정산
      // 원근: 뒤(행 큰 값)일수록 위로·작게, 앞(행 작은 값)일수록 아래로·크게. 앞 가구가 뒤 가구를 덮도록 뒤부터.
      const list=placedList().sort((a,b)=>a.r-b.r); distributePoops(list);
      box.innerHTML=list.map(p=>propMarkup(p,true)).join('');
    }
    // 활성 고양이를 dock 무대에 액터로 배치(없으면 안내)
    function renderDockCats(){
      const stage=$('cdStage'); if(!stage) return;
      const cats=activeCats(); const list=cats.slice(0,slotCount());
      stage.dataset.hh=48;
      const sig='c:'+list.join(',');   // 고양이 구성이 그대로면 DOM 재생성 금지(스프라이트 리로드·애니메이션 리셋 깜빡임 방지)
      if(stage.dataset.sig===sig && stage.querySelector('.cd-actor')) return;
      stage.dataset.sig=sig;
      if(!list.length){ stage.innerHTML='<span class="cd-empty">고양이를 입양해 보세요</span>'; markCatDirty(); return; }
      stage.innerHTML=list.map((id,i)=>'<div class="cd-actor" data-cat="'+id+'" style="left:'+(12+i*54)+'px;">'+catActorHTML(id,48)+'</div>').join('');
      markCatDirty();
    }
    // ---- 통합 걷기 엔진: 단일 rAF가 "지금 보이는 무대"(시트 방 또는 dock)만 애니메이션 ----
    // 고양이는 방/시트에 배치된 가구로 가끔 다가가 잠시 머문다(상호작용). 스트립엔 가구가 없어 자유 배회.
    function reducedMotion(){ try{ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }
    // 걷기 스프라이트 애니메이션 주기(초): 발 놀림이 실제 이동속도에 맞도록 속도에 반비례 → 미끄러짐(무빙워크) 방지, 자연스러운 걸음.
    function walkDur(v, hh){ const stride=0.42*(hh||40), px=Math.max(0.001, v*58); return Math.max(0.45, Math.min(1.5, stride/px)).toFixed(2); }
    function setWalkDur(a){ if(a.spr){ const sc=a.el.querySelector('.cspr'); if(sc) sc.style.setProperty('--wdur', walkDur(a.v, a.hh)+'s'); } }
    // 액터의 위치(x)·올림(lift)·방향(scaleX)을 transform 하나로 — 전부 합성(메인스레드 페인트 0)이라 걸을 때 깜빡이지 않음.
    // ⚠️ left/top은 절대 매 프레임 건드리지 않는다(레이아웃·페인트 유발). x는 정수 px 스냅.
    function setXform(a, dir, lift){ const d=(dir!=null?dir:a.dir), t=Math.round(-(lift!=null?lift:(a.lift||0)));
      a.el.style.transform='translate3d('+Math.round(a.x)+'px,'+t+'px,0) scaleX('+d+')'; }
    // ⚠️ 핵심 불변식(INVARIANT): "정면(south) 이미지로 이동 금지".
    // 스프라이트 액터의 이동/정지 비주얼(.cspr)은 반드시 아래 두 함수로만 바꾼다 — 모든 상태 전환(roam·pause)과
    // 재빌드(buildActors)가 이 두 함수를 거치게 해, DOM 재사용으로 남은 정지스틸(.idle)이 이동 중에 보이는 버그를 원천 차단.
    //  · actorShowMoving: 이동 표현. 일반=.idle 제거→CSS 걷기 필름(csprFilm) 재생, frontWalk(=east 걷기 없음)=east 정지스틸(정면 걷기 금지).
    //  · actorShowStill : 그 자리에 멈춰 face(south/east/west/north) 정지스틸(쉼·포즈·가구 상호작용). 이동 아님.
    function actorShowMoving(a){ if(!a.spr) return; const s=a.el.querySelector('.cspr'); if(!s) return;
      if(a.frontWalk){ s.style.setProperty('--idle','url('+sprStill(a.id,'east')+')'); s.classList.add('idle'); }   // east 걷기 없음 → 옆 정지스틸(정면 금지)
      else s.classList.remove('idle'); }   // 일반: .idle 제거 → CSS 걷기 필름(csprFilm) 재생
    function actorShowStill(a, face){ if(!a.spr) return; const s=a.el.querySelector('.cspr'); if(!s) return;
      s.style.setProperty('--idle','url('+sprStill(a.id,face)+')'); s.classList.add('idle'); }
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
      const W=stage.clientWidth||160, hh=+stage.dataset.hh||30;
      const hasRoom = stage.id==='crStage' || !!stage.closest('.cd-room');
      const isDock = stage.id!=='crStage';
      // 가구 위치(발자국 중앙 x) + 렌더 높이(fh) — 상호작용 시 올라갈 높이 계산에 사용
      const props = hasRoom ? placedList().map(p=>{ const foot=itemFoot(p.itemId), depth=(12-(p.r+foot.h-1))/11;   // propMarkup과 동일(앞줄 기준)
        const fh=furnRoomH(p.itemId, isDock, depth);   // 렌더 높이와 동일 → 캣타워 층 lift가 실제 높이에 맞음
        // 가구는 좌측하단 앵커 → 그래픽 중앙 x = 좌측 edge + fh*aspect/2. 고양이가 이 중앙에 서서 상호작용(캣타워 중앙에 앉기).
        const leftEdge=(p.c-1)/12*W; return { x: leftEdge + fh*furnAspect(p.itemId)/2, itemId:p.itemId, fh, key:p.key }; }) : [];
      // 고양이마다 성격(속도·유휴빈도·방향전환·가구선호)을 랜덤 부여 → 개별적으로 움직임
      // 스프라이트 고양이는 정사각(폭=높이), SVG 고양이는 가로세로비 ~26/14.
      return acts.map(el=>{ const id=el.getAttribute('data-cat'), spr=hasSprite(id), fw=!!(spr&&PET_SPRITES[id]&&PET_SPRITES[id].frontWalk);
        const v=0.14+Math.random()*0.18;   // 속도 폭을 조금 좁혀 걸음이 차분하게(주기는 walkDur로 이동속도에 맞춤)
        const a={ el, id, spr, frontWalk:fw, x:(parseFloat(el.style.left)||0), dir:Math.random()<0.5?-1:1, _pdir:0,
        v:v, t:Math.random()*6, frame:0, fc:Math.random()*170, W, hh,
        sw:(spr?hh:Math.round(hh*26/14)), props, lift:0,
        mode:'roam', pause:0, goal:null, pose:null, resKey:null, resFloor:null,
        // 유휴(그 자리에 멈춰 정면 보기) — 자주·오래 서서 정면을 보도록(poseDur에서 시간 늘림)
        idle:0.0032+Math.random()*0.005, turn:0.004+Math.random()*0.010, seek:0.005+Math.random()*0.009, cool:0 };
        setWalkDur(a); el.style.left='0px'; setXform(a); a._pdir=a.dir;   // 위치·올림·방향 전부 transform(합성). left는 0 고정 → 걷는 동안 메인스레드 페인트 0
        // 액터는 항상 'roam'(이동)으로 시작. DOM 재사용(markCatDirty·무대 재부착)으로 남아있던 정지스틸(.idle)을
        // 반드시 이동 표시로 초기화 → "정면 이미지로 이동" 버그 원천 차단.
        actorShowMoving(a);
        return a; });
    }
    // 가구 종류별 포즈: 밥그릇=앉아 먹기, 방석=식빵, 캣타워=낮잠, 스크래처=앉기, 그 외=식빵
    function poseForItem(itemId){ return itemId==='bowl'?'sit':itemId==='cushion'?'loaf':itemId==='tower'?'sleep':itemId==='scratcher'?'sit':'loaf'; }
    function poseDur(pose){ return pose==='sleep'?(4000+Math.random()*3500):(2800+Math.random()*3200); }   // 정면으로 가만히 있는 시간을 더 길게
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
      if(it==='scratcher') return { lift:0, face:(Math.random()<0.5?'east':'west'), dx:Math.round(a.sw*0.6)*(Math.random()<0.5?1:-1), pose:'sit', dur:18000+Math.random()*28000 };
      return { lift:0, face:'south', dx:0, pose:'loaf', dur:22000+Math.random()*26000 };
    }
    // 가구에 도착 → 자리 잡고 머무름(랜덤 시간). 스프라이트는 해당 방향 정지, SVG는 포즈. lift로 발판/방석 위로 올림.
    function enterInteract(a, id, goal){
      const s=furnSpot(a, goal);
      a.mode='pause'; a.pose=s.pose; a.pause=s.dur; a.cool=1700; a.lift=s.lift||0;
      // 고양이 중심을 가구 그래픽 중앙(goal.x)에 맞춤(+옆 오프셋 dx). 캣타워/방석은 dx=0이라 정중앙에 앉음.
      a.x=Math.max(2, Math.min(a.W-a.sw, goal.x - a.sw/2 + (s.dx||0)));
      const dir=a.spr?1:a.dir;
      if(a.spr) actorShowStill(a, s.face);
      else a.el.innerHTML=catPose(id, s.pose, {h:a.hh});
      setXform(a, dir); a._pdir=dir;   // 위치+lift(위에서 설정)+flip을 정적 transform 하나로
    }
    function enterPose(a, id, pose){ a.mode='pause'; a.pose=pose; a.pause=poseDur(pose); a.cool=1400;
      a.lift=0;
      if(a.spr){ // 멈춰서 쉴 땐 항상 정면(south)을 본다. 이미지가 정방향이라 플립 없음(scaleX(1)).
        actorShowStill(a, 'south'); setXform(a, 1); a._pdir=1; }
      else { a.el.innerHTML=catPose(id, pose, {h:a.hh});
        setXform(a, a.dir); a._pdir=a.dir; } }
    // 가구 점유: 한 가구엔 1마리(캣타워만 3층=최대 3마리, 층당 1마리). resKey=예약한 가구, resFloor=캣타워 층(0~2).
    function occupantsOf(key, self){ let n=0; const floors={}; _eng.actors.forEach(o=>{ if(o!==self && o.resKey===key){ n++; if(o.resFloor!=null) floors[o.resFloor]=true; } }); return {n, floors}; }
    function releaseRes(a){ a.resKey=null; a.resFloor=null; }
    function stepActors(dt){
      _eng.actors.forEach(a=>{
        a.t+=dt*0.004; if(a.cool>0)a.cool-=dt; const id=a.el.getAttribute('data-cat');
        if(a.mode==='pause'){ a.pause-=dt; if(a.pause<=0){ a.mode='roam'; a.fc=999; a.dir=Math.random()<0.5?-1:1; a.lift=0; releaseRes(a);   // 내려와 재출발(자리 반납)
          // 이동 재개: 정면 이미지로 이동 금지 — actorShowMoving으로 일원화(일반=CSS 필름, frontWalk=east 정지스틸)
          actorShowMoving(a); setXform(a); a._pdir=a.dir; } return; }   // 재출발: lift 해제·방향 반영, 걷기는 필름(csprFilm)
        // 유휴 제스처(그 자리 앉기/식빵/낮잠) — 쿨다운 후에만
        if(a.mode==='roam' && a.cool<=0 && Math.random()<a.idle){ enterPose(a, id, ['loaf','sit','sleep'][Math.floor(Math.random()*3)]); return; }
        // 가끔 방향 전환(개별)
        if(a.mode==='roam' && Math.random()<a.turn){ a.dir*=-1; }
        // 가끔 속도 변화(개별) — 바뀐 속도에 맞춰 걷기 주기도 갱신(미끄러짐 방지)
        if(a.mode==='roam' && Math.random()<0.003){ a.v=0.14+Math.random()*0.18; setWalkDur(a); }
        // 가구로 이동 결정(가구 있을 때, 쿨다운 후)
        if(a.mode==='roam' && a.props.length && a.cool<=0 && Math.random()<a.seek){
          const avail=a.props.filter(p=>occupantsOf(p.key,a).n < (p.itemId==='tower'?3:1));   // 빈 가구만(캣타워는 남은 층 있으면)
          if(avail.length){ const g=avail[Math.floor(Math.random()*avail.length)]; a.resKey=g.key;
            if(g.itemId==='tower'){ const used=occupantsOf(g.key,a).floors; a.resFloor=[0,1,2].find(f=>!used[f]); if(a.resFloor==null) a.resFloor=0; } else a.resFloor=null;
            a.goal=g; a.mode='goal'; } }
        // 가구 도착 판정은 "고양이 중심"(a.x+sw/2) 기준 → 가구 그래픽 중앙(goal.x)에 정확히 서게
        if(a.mode==='goal' && a.goal){ const cx=a.x+a.sw/2; a.dir=(a.goal.x>cx)?1:-1; if(Math.abs(a.goal.x-cx)<6){ enterInteract(a, id, a.goal); a.goal=null; return; } }
        a.x += a.dir*a.v*dt*0.06;
        const max=a.W-a.sw;
        if(a.x<2){ a.x=2; a.dir=1; if(a.mode==='goal'){a.mode='roam';a.goal=null;releaseRes(a);} } else if(a.x>max){ a.x=max; a.dir=-1; if(a.mode==='goal'){a.mode='roam';a.goal=null;releaseRes(a);} }
        if(!a.spr){ a.fc+=dt; if(a.fc>170){ a.fc=0; a.frame^=1; a.el.innerHTML=catSide(id,a.frame,{h:a.hh}); } }   // SVG 폴백: 2프레임 교대(스프라이트는 필름 csprFilm이 처리)
        // 이동·방향을 transform 하나로(translate3d+scaleX) — 전부 합성, 매 프레임 페인트 0 → 깜빡임 근본 제거
        setXform(a); a._pdir=a.dir;
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
        // 상단(금화·은화 + 홈/상점/배치/미션 탭)은 스크롤해도 고정(sticky), 그 아래 콘텐츠만 스크롤
        let h='<div class="cathead"><div class="coinbar"><span class="coin"><span class="ci">'+goldSvg({h:20})+'</span>'+gold().toLocaleString()+'<small>금화</small></span><span class="coin"><span class="ci">'+coinSvg({h:20})+'</span>'+coins().toLocaleString()+'<small>은화</small></span></div>';
        h+='<div class="catseg">'+[['home','홈'],['shop','상점'],['place','배치'],['mission','미션']].map(t=>'<button class="'+(_catTab===t[0]?'on':'')+'" onclick="setCatTab(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div></div>';
        if(_catTab==='home') h+=catHomeHtml();
        else if(_catTab==='shop') h+=catShopHtml();
        else if(_catTab==='place') h+=catPlaceHtml();
        else h+=catMissionHtml();
        return h;
      };
      openSheet('알뜰샵', build());
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(!b) return; const st=b.scrollTop; b.innerHTML=build(); b.scrollTop=st; if(_catTab==='home') mountRoomWalk(); };
      if(_catTab==='home') setTimeout(mountRoomWalk, 30);
    }
    function catHomeHtml(){
      reconcilePets();   // 3시간 지난 그릇 비우고 똥 정산(멱등)
      const cats=activeCats();
      // 배치된 가구를 방 바닥에 매핑. 그릇=탭 급여·채움 반영, 화장실=똥 수거(공용 헬퍼).
      const list=placedList().sort((a,b)=>a.r-b.r); distributePoops(list);
      const litters=list.filter(p=>p.itemId==='litterbox');
      const props=list.map(p=>propMarkup(p,false)).join('');
      let h='<div class="catroom" id="catRoom"><div class="cr-wall" style="background:'+wallCss(currentWall())+'"></div><div class="cr-floor"></div><div class="cr-base"></div><span class="cr-cam"><i></i>LIVE · 우리집</span>'+batchBtnHtml()+'<div class="cr-props">'+props+'</div><div class="cr-stage" id="crStage"></div></div>';
      // 안내: 그릇 채우기 / 똥 수거
      const poops=(state.game.home.poops)||0;
      h+='<div class="hintline" style="margin:8px 0 0;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>밥·물 그릇을 탭해 채우고(3시간 뒤 비워짐), 쌓인 <b>똥을 탭해 치우면 +'+POOP_REWARD+' 은화</b>'+(poops&&!litters.length?' · 화장실을 놓아야 똥을 치울 수 있어요':'')+'.</div>';
      const owned=ownedCatList();
      const sc=slotCount();
      h+='<div class="sech"><span class="l">우리집 펫</span><span class="s">'+cats.length+' / '+sc+' 활성</span></div>';
      // 활성 슬롯 표시: 채워진 슬롯 + (미확장 시) 오른쪽에 잠금 슬롯 — 탭하면 금화 SLOT_PRICE로 확장
      let slotRow='<div class="slotrow">';
      for(let i=0;i<sc;i++){ const cid=cats[i]; slotRow+='<div class="slot'+(cid?' filled':'')+'">'+(cid?catFace(cid,{h:38}):'')+'</div>'; }
      if(sc<MAX_SLOTS) slotRow+='<button class="slot locked" onclick="buySlot()" aria-label="고양이 슬롯 확장(금화 '+SLOT_PRICE+')"><svg class="lockic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg><span class="slotgold">'+goldSvg({h:13})+SLOT_PRICE+'</span></button>';
      slotRow+='</div>';
      h+=slotRow;
      if(!owned.length) h+='<div class="empty" style="padding:20px;">아직 펫이 없어요. 상점에서 입양해 보세요 🐾</div>';
      else { h+='<div class="catchips">'+owned.map(id=>{ const on=isActiveCat(id);
        // 이미지 영역엔 고양이를 꽉 차게(선택 시 옆으로 걷는 스프라이트, 아니면 정면 정지). 아래엔 이름 + 상태. 선택되면 체크 배지.
        const art=on?catActorHTML(id,96):catFace(id,{h:96});
        return '<div class="catchip'+(on?' on':'')+'" role="button" tabindex="0" aria-pressed="'+on+'" onclick="toggleActiveCat(\''+id+'\')">'+
          '<div class="cpic">'+art+'</div>'+
          '<div class="cn">'+catNameSpan(id,catName(id))+'</div>'+
          '<div class="cstate">'+(on?'집에 있음':'대기')+'</div>'+
          '<button class="cn-edit" aria-label="이름 짓기" onclick="event.stopPropagation();openRenameCat(\''+id+'\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>'+
          (on?'<span class="csel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></span>':'')+
        '</div>'; }).join('')+'</div>';
        h+='<div class="hintline" style="margin-top:10px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>펫을 탭해 집에 내보내거나 대기시켜요(최대 '+sc+'마리)'+(sc<MAX_SLOTS?' · 오른쪽 잠금 슬롯은 금화 '+SLOT_PRICE+'로 확장':'')+'.</div>'; }
      return h;
    }
    function mountRoomWalk(){
      const stage=$('crStage'); if(!stage) return;
      const list=activeCats().slice(0,slotCount());
      stage.dataset.hh=64;
      const sig='c:'+list.join(',');   // 같은 고양이면 재생성 안 함(애니메이션 유지)
      if(stage.dataset.sig===sig && stage.querySelector('.cd-actor')) return;
      stage.dataset.sig=sig;
      stage.innerHTML=list.map((id,i)=>'<div class="cd-actor" data-cat="'+id+'" style="left:'+(20+i*64)+'px;">'+catActorHTML(id,64)+'</div>').join('');
      markCatDirty();   // 통합 엔진이 시트 방 무대를 자동으로 잡아 애니메이션
    }
    let _shopSub='cats';
    function setShopSub(s){ _shopSub=s; renderCatHouse(); }
    // 상점에서 미리보기로 "선택"한 펫 — 선택하면 카드가 강조되고 썸네일이 옆으로 걷는 스프라이트(우리집 펫 카드와 동일)로 바뀐다.
    let _shopSelCat=null;
    function selectShopCat(id){ _shopSelCat=(_shopSelCat===id?null:id); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    function catShopHtml(){
      let h='<div class="subseg"><button class="'+(_shopSub==='cats'?'on':'')+'" onclick="setShopSub(\'cats\')">고양이</button><button class="'+(_shopSub==='furn'?'on':'')+'" onclick="setShopSub(\'furn\')">가구</button><button class="'+(_shopSub==='consum'?'on':'')+'" onclick="setShopSub(\'consum\')">소비</button><button class="'+(_shopSub==='wall'?'on':'')+'" onclick="setShopSub(\'wall\')">벽지</button><button class="'+(_shopSub==='event'?'on':'')+'" onclick="setShopSub(\'event\')">이벤트</button></div>';
      if(_shopSub==='consum'){
        h+=CONSUM_CATALOG.map(c=>{
          const enough=coins()>=c.price;
          const act=enough?'<button class="buy" aria-label="'+c.name+' 구매('+c.price+' 은화)" onclick="buyConsum(\''+c.id+'\')">구매</button>':'<button class="buy dis" disabled>부족</button>';
          return '<div class="shopcard"><div class="thumb"><span class="furnfit">'+consumSvg(c.id,{fit:true})+'</span></div>'+
            '<div class="meta"><b>'+c.name+' <span class="tagmini">소비</span></b><div class="desc">'+c.desc+'</div>'+
            '<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+c.price+'</span></div>'+
            '<div class="act">'+act+'<span class="qty">보유 '+consumQty(c.id)+'</span></div></div>';
        }).join('');
        h+='<div class="note"><b>소비 아이템</b>은 배치할 수 없어요. 홈 화면에서 <b>밥그릇·물그릇을 탭</b>하면 사료·물을 1개 써서 채워집니다(3시간 뒤 비워짐).</div>';
        return h;
      }
      if(_shopSub==='event'){
        const enough=coins()>=GACHA_PRICE;
        const gacha=[['egg','펫알','알을 열면 고양이가 랜덤으로! 등급이 높을수록 귀해요.', eggSvg(0,{h:66})],
                     ['box','랜덤박스','상자를 열면 가구·구조물이 랜덤으로 나와요.', boxSvg({h:56})]];
        h+=gacha.map(([k,nm,desc,art])=>{
          const act=enough?'<button class="buy" aria-label="'+nm+' 구매('+GACHA_PRICE+' 은화)" onclick="openGacha(\''+k+'\')">구매</button>':'<button class="buy dis" disabled>'+(GACHA_PRICE-coins())+' 부족</button>';
          return '<div class="shopcard"><div class="thumb">'+art+'</div>'+
            '<div class="meta"><b>'+nm+'</b><div class="desc">'+desc+'</div>'+
            '<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+GACHA_PRICE+'</span></div>'+
            '<div class="act">'+act+'</div></div>';
        }).join('');
        h+='<div class="note">열 때마다 <b>금화 1개</b> 지급. 이미 보유한 고양이는 <b>'+DUP_REFUND+' 은화</b>로 환급돼요. <b>특별 등급 이상</b>은 펫알로만 나와요.</div>';
        h+=gachaInfoHtml();
        return h;
      }
      if(_shopSub==='wall'){
        const cur=currentWall();
        h+='<div class="wallgrid">'+WALLPAPER_CATALOG.map(w=>{
          const owned=ownsWall(w.id), applied=cur===w.id;
          let act;
          if(applied) act='<span class="owntag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>적용됨</span>';
          else if(owned) act='<button class="buy ghost" onclick="applyWall(\''+w.id+'\')">적용</button>';
          else if(coins()>=w.price) act='<button class="buy" aria-label="'+w.name+' 벽지 구매('+w.price+' 은화)" onclick="buyWall(\''+w.id+'\')">구매</button>';
          else act='<button class="buy dis" disabled>'+(w.price-coins())+' 부족</button>';
          const price=w.price?('<span class="price"><span class="ci">'+coinSvg({h:15})+'</span>'+w.price+'</span>'):'<span class="price" style="color:var(--sub)">무료</span>';
          return '<div class="wallcard'+(applied?' on':'')+'"><div class="wallsw" style="background:'+w.css+'"></div>'+
            '<div class="wallmeta"><b>'+w.name+'</b>'+price+'</div>'+act+'</div>';
        }).join('')+'</div>';
        h+='<div class="note"><b>벽지</b> 구매하면 바로 적용돼요. 보유한 벽지는 <b>적용</b>으로 언제든 바꿀 수 있어요.</div>';
        return h;
      }
      if(_shopSub==='cats'){
        const owntag='<span class="owntag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>보유</span>';
        // 등급 낮은 것부터 높은 순으로 정렬. 특별(epic) 이상은 상점 직접 구매 불가 → 펫알(가챠) 전용 표기.
        const cats=PET_CATALOG.slice().sort((a,b)=>tierRank(petTierOf(a.id))-tierRank(petTierOf(b.id)));
        h+=cats.map(c=>{
          const owned=ownsCat(c.id), sel=_shopSelCat===c.id, gachaOnly=isGachaOnlyCat(c.id), enough=coins()>=c.price;
          let act, priceHtml;
          if(gachaOnly){
            priceHtml='<span class="price gachaonly">'+eggSvg(0,{h:16})+'<b class="tier-limited">펫알 전용</b></span>';
            act= owned ? owntag : '<button class="buy ghost" aria-label="'+c.name+'은 펫알에서 뽑기" onclick="event.stopPropagation();setShopSub(\'event\')">펫알 뽑기</button>';
          } else {
            priceHtml='<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+c.price+'</span>';
            act= owned ? owntag : (enough ? '<button class="buy" aria-label="'+c.name+' 구매('+c.price+' 은화)" onclick="event.stopPropagation();buyCat(\''+c.id+'\')">구매</button>' : '<button class="buy dis" disabled>'+(c.price-coins())+' 부족</button>');
          }
          // 선택하면 우리집 펫 카드처럼 옆으로 걷는 스프라이트로, 아니면 정면 정지 썸네일. 선택 시 체크 배지.
          const art=sel?catActorHTML(c.id,72):catFace(c.id,{h:72});
          return '<div class="shopcard petpick'+(sel?' sel':'')+'" role="button" tabindex="0" aria-pressed="'+sel+'" onclick="selectShopCat(\''+c.id+'\')"><div class="thumb"><div class="fl"></div>'+art+
            (sel?'<span class="psel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></span>':'')+'</div>'+
            '<div class="meta"><b>'+catNameSpan(c.id,c.name)+' <span class="tagmini">'+speciesLabel(c.id)+'</span></b><div class="desc">'+c.desc+'</div>'+
            priceHtml+'</div>'+
            '<div class="act">'+act+'</div></div>';
        }).join('');
        h+='<div class="note">펫을 <b>탭하면 선택</b>돼요 — 카드가 강조되고 미리보기 펫이 <b>옆으로 걸어다녀요</b>. <b>중복 소유</b> 펫은 종당 1마리, 구매하면 자동으로 집에 들어와 걸어다녀요.</div>';
      } else {
        h+=ITEM_CATALOG.map(it=>{
          const enough=coins()>=it.price;
          const act=enough?'<button class="buy" aria-label="'+it.name+' 구매('+it.price+' 은화)" onclick="buyItem(\''+it.id+'\')">구매</button>':'<button class="buy dis" disabled>'+(it.price-coins())+' 부족</button>';
          return '<div class="shopcard"><div class="thumb"><span class="furnfit">'+furnSvg(it.id,{fit:true})+'</span></div>'+
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
    // ===== 🍚💧 다마고치: 사료·물 소비 / 급여 / 배변 / 똥 수거 =====
    function consumQty(id){ return (state.game&&state.game.consum&&Number(state.game.consum[id]))||0; }
    // 소비 아이템 구매(1은화, 배치 불가)
    function buyConsum(id){
      const c=CONSUM_CATALOG.find(x=>x.id===id); if(!c) return;
      if(coins()<c.price){ toast((c.price-coins())+' 은화 부족', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); if(g.coins<c.price) return g;
        g.coins-=c.price; g.consum[id]=(Number(g.consum[id])||0)+1; return g;
      }).then(res=>{ if(res.committed) toast(c.name+' +1'); });
    }
    // 채워진 상태인지(채운 뒤 3시간 이내)
    function isFilled(key){ const p=(state.game&&state.game.home.placed&&state.game.home.placed[key]); return !!(p&&p.filledAt&&(Date.now()-p.filledAt)<FILL_MS); }
    // 홈에서 밥/물 그릇 탭 → 사료/물 1 소모하고 채움(이미 차 있으면 무시)
    function feedBowl(key){
      const p=(state.game&&state.game.home.placed&&state.game.home.placed[key]); if(!p) return;
      const id=p.itemId; if(id!=='bowl'&&id!=='waterbowl') return;
      if(isFilled(key)){ toast('아직 남아 있어요'); return; }
      const need=id==='bowl'?'food':'water', nm=id==='bowl'?'사료':'물';
      if(consumQty(need)<=0){ toast(nm+'가 없어요 · 상점 소비 탭에서 구매', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.consum[need])||0)<=0 || !g.home.placed[key]) return g;
        g.consum[need]-=1; g.home.placed[key].filledAt=Date.now(); return g;
      }).then(r=>{ if(r&&r.committed) toast(id==='bowl'?'밥을 채웠어요 🍚':'물을 채웠어요 💧'); });
    }
    // 채워진 지 3시간 지난 그릇을 비우고, 비운 개수만큼 똥을 쌓는다(멱등: filledAt 지우면 재발동 안 함)
    function reconcilePets(){
      const g=state.game; if(!g||!g.home) return;
      const placed=g.home.placed||{}, now=Date.now();
      let expired=0; Object.keys(placed).forEach(k=>{ const e=placed[k]; if(e&&e.filledAt&&(now-e.filledAt)>=FILL_MS) expired++; });
      if(!expired) return;
      gameRef().transaction(gg=>{ gg=normalizeGame(gg); const pl=gg.home.placed||{}, n=Date.now(); let poop=0;
        Object.keys(pl).forEach(k=>{ const e=pl[k]; if(e&&e.filledAt&&(n-e.filledAt)>=FILL_MS){ e.filledAt=null; poop++; } });
        if(poop) gg.home.poops=(Number(gg.home.poops)||0)+poop;
        return gg;
      });
    }
    // 똥 수거 → 은화 +2, 작은 획득 연출
    function collectPoop(e){
      if(e){ e.stopPropagation(); }
      const x=e?e.clientX:innerWidth/2, y=e?e.clientY:innerHeight/2;
      gameRef().transaction(g=>{ g=normalizeGame(g); if((Number(g.home.poops)||0)<=0) return g;
        g.home.poops=(Number(g.home.poops)||0)-1; g.coins+=POOP_REWARD; return g;
      }).then(r=>{ if(r&&r.committed) poopFx(x,y); });
    }
    function poopFx(x,y){ const el=document.createElement('div'); el.className='poopfx';
      el.innerHTML='<span class="pi">'+coinSvg({h:14})+'</span>+'+POOP_REWARD;
      el.style.left=x+'px'; el.style.top=y+'px'; document.body.appendChild(el);
      setTimeout(()=>{ el.remove(); }, 950); }
    // 은화 카운터(연출 도착점): 시트 열려 있으면 시트 은화칩, 아니면 dock 은화칩
    function coinTarget(){
      const open=$('sheet')&&$('sheet').classList.contains('on');
      if(open){ const c=document.querySelector('#sheetBody .coinbar .coin:last-child'); if(c) return c; }
      return document.querySelector('#catdock .cd-coin');
    }
    // 은화가 (x,y)에서 카운터로 날아 들어가는 연출 + 카운터 톡 튀기
    function coinFlyFx(x,y,n){
      const target=coinTarget(); if(!target) return;
      const tr=target.getBoundingClientRect(), tx=tr.left+tr.width/2, ty=tr.top+tr.height/2;
      const k=Math.max(1,Math.min(8,n));
      for(let i=0;i<k;i++){ const el=document.createElement('div'); el.className='coinfly'; el.innerHTML=coinSvg({h:15});
        const ox=x+(Math.random()*26-13), oy=y+(Math.random()*14-7);
        el.style.left=ox+'px'; el.style.top=oy+'px';
        el.style.setProperty('--tx',(tx-ox).toFixed(0)+'px'); el.style.setProperty('--ty',(ty-oy).toFixed(0)+'px');
        el.style.animationDelay=(i*0.05).toFixed(2)+'s'; document.body.appendChild(el);
        setTimeout(()=>{ el.remove(); }, 760+i*50); }
      setTimeout(()=>{ target.classList.add('bump'); setTimeout(()=>target.classList.remove('bump'),320); }, 400);
    }
    // 일괄 돌보기: 빈 그릇을 사료/물로 채우고, 쌓인 똥을 모두 치워 은화 획득(카운터로 날아가는 연출)
    function batchCare(btnEl){
      if(!state.game){ return; }
      const before=coins(), poopsNow=(state.game.home.poops)||0;
      gameRef().transaction(g=>{ g=normalizeGame(g); const pl=g.home.placed||{}, now=Date.now();
        Object.keys(pl).forEach(k=>{ const e=pl[k]; if(!e) return; const filled=e.filledAt&&(now-e.filledAt)<FILL_MS;
          if(!filled){ if(e.itemId==='bowl'&&g.consum.food>0){ g.consum.food-=1; e.filledAt=now; }
            else if(e.itemId==='waterbowl'&&g.consum.water>0){ g.consum.water-=1; e.filledAt=now; } } });
        const poops=Number(g.home.poops)||0; if(poops>0){ g.coins+=poops*POOP_REWARD; g.home.poops=0; }
        return g;
      }).then(r=>{ if(!r||!r.committed) return;
        const nowCoins=(r.snapshot&&r.snapshot.val()&&r.snapshot.val().coins)||before, gained=nowCoins-before;
        let x=innerWidth/2, y=160; if(btnEl&&btnEl.getBoundingClientRect){ const b=btnEl.getBoundingClientRect(); x=b.left+b.width/2; y=b.top+b.height/2; }
        if(gained>0){ coinFlyFx(x,y, Math.min(8, poopsNow||1)); toast('돌봄 완료 · +'+gained+' 은화 🪙'); }
        else toast('돌봄 완료 🐾 (채울 밥/물이 없거나 이미 가득)');
      });
    }
    // 벽지 구매(구매 시 자동 적용) / 적용
    function buyWall(id){
      const w=WALLPAPER_CATALOG.find(x=>x.id===id); if(!w) return;
      if(ownsWall(id)){ applyWall(id); return; }
      if(coins()<w.price){ toast((w.price-coins())+' 은화 부족', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); if(g.coins<w.price||g.owned.wallpapers[id]) return g;
        g.coins-=w.price; g.owned.wallpapers[id]={boughtAt:new Date().toISOString()}; g.home.wallpaper=id; return g;
      }).then(res=>{ if(res.committed) toast(w.name+' 벽지 적용! 🎨'); });
    }
    function applyWall(id){ if(!ownsWall(id)){ toast('먼저 구매하세요', true); return; } gameRef().child('home/wallpaper').set(id); toast('벽지를 적용했어요'); }

    // ================= 이벤트: 뽑기(가챠) =================
    // 등급/확률(합 100). color=이름 텍스트/후광 색, limited는 CSS 레인보우.
    const TIERS = [
      { id:'normal',   name:'일반', p:60,  color:'#FFFFFF' },
      { id:'uncommon', name:'고급', p:20,  color:'#2FAE7A' },
      { id:'rare',     name:'희귀', p:15,  color:'#3182F6' },
      { id:'epic',     name:'특별', p:3.8, color:'#9B6FC8' },
      { id:'legend',   name:'전설', p:1,   color:'#E0A43C' },
      { id:'limited',  name:'한정', p:0.2, color:'#ff5fa2' }
    ];
    const TIER_ORDER = TIERS.map(t=>t.id);   // 높은 등급이 비면 한 단계씩 낮춰 대체할 때 사용
    function tierInfo(id){ return TIERS.find(t=>t.id===id)||TIERS[0]; }
    // 동물 이름을 등급 색으로 표기. 일반(흰색)은 밝은 배경에서 안 보이므로 기본 잉크색, 한정은 무지개(.tier-limited).
    function catTierColor(id){ const t=CAT_TIER[id]||'normal'; return t==='normal' ? 'var(--text)' : tierInfo(t).color; }
    function catNameSpan(id, name){ const t=CAT_TIER[id]||'normal'; const n=escapeHtml(name);
      if(t==='limited') return '<span class="tier-limited">'+n+'</span>';
      return '<span style="color:'+catTierColor(id)+'">'+n+'</span>'; }
    // 고양이 이름 변경(개별) — owned.cats[id].name에 저장. 등급색은 catNameSpan로 유지.
    function openRenameCat(id){
      closeRename();
      const wrap=document.createElement('div'); wrap.id='renameCat'; wrap.className='gimenu-scrim';
      wrap.onclick=function(e){ if(e.target===wrap) closeRename(); };
      wrap.innerHTML='<div class="gimenu"><div class="gih">'+catFace(id,{h:34})+'<b>이름 짓기</b></div>'+
        '<input class="input" id="renameInput" maxlength="12" value="'+escapeHtml(catName(id))+'" placeholder="고양이 이름(최대 12자)" style="width:100%;box-sizing:border-box;margin-bottom:4px;">'+
        '<button class="gib sell" onclick="saveRenameCat(\''+id+'\')"><b>저장</b></button>'+
        '<button class="gib ghost" onclick="closeRename()">취소</button></div>';
      document.body.appendChild(wrap);
      setTimeout(function(){ const i=$('renameInput'); if(i){ i.focus(); i.select(); } }, 40);
    }
    function closeRename(){ const m=$('renameCat'); if(m) m.remove(); }
    function saveRenameCat(id){
      const v=((val('renameInput')||'').trim()).slice(0,12);
      gameRef().transaction(g=>{ g=normalizeGame(g); if(!g.owned.cats[id]) return g; if(v) g.owned.cats[id].name=v; else delete g.owned.cats[id].name; return g; })
        .then(r=>{ if(r&&r.committed) toast(v?('이름: '+v):'기본 이름으로'); });
      closeRename();
    }
    // 테스트 배정(등급당 1) — 펫알=고양이 / 랜덤박스=가구
    // @gen:pet-tier — 자동생성(tools/build_pets.py). tools/pets.json 의 tier 편집 후 재실행.
    const CAT_TIER = { cat_mackerel:'normal', cat_cheese:'uncommon', cat_calico:'rare', cat_black:'epic', cat_white:'epic', cat_fluffy:'rare', cat_tuxedo:'legend', cat_chaos:'legend', cat_siamese:'limited', cat_bengal:'uncommon', cat_fold:'rare', cat_bora:'epic', cat_choco:'uncommon', cat_kitten:'normal' };
    // @gen:end
    const ITEM_TIER = { cushion:'normal', bowl:'uncommon', scratcher:'rare', tower:'epic' };
    // 등급별 상점 가격(은화) — 확률(60/20/15/3.8/1/0.2%)에 맞춰 등급이 오를수록 약 2배씩.
    // 알 100은화(+금화1·중복 30은화 환급) 대비, 흔한 등급은 알보다 싸게·희귀 등급은 비싸게 → 직접구매 vs 뽑기 선택 성립.
    // CAT_TIER를 단일 소스로 삼아 PET_CATALOG.price를 산정(새 고양이도 등급만 지정하면 자동 가격).
    const TIER_PRICE = { normal:50, uncommon:100, rare:200, epic:400, legend:800, limited:1500 };
    PET_CATALOG.forEach(c=>{ const t=CAT_TIER[c.id]; if(t&&TIER_PRICE[t]!=null) c.price=TIER_PRICE[t]; });
    // ---- 개발자 모드(canel94@gmail.com 전용): 확률·구성 로컬 오버라이드 ----
    const DEV_EMAIL='canel94@gmail.com';
    function isDev(){ return (state.userEmail||'').toLowerCase()===DEV_EMAIL; }
    function devOn(){ return isDev() && localStorage.getItem('catDev')==='1'; }
    function toggleDevMode(){ if(!isDev()) return; localStorage.setItem('catDev', devOn()?'0':'1'); }
    function devCfg(){ try{ return JSON.parse(localStorage.getItem('catDevCfg')||'null')||{}; }catch(e){ return {}; } }
    function saveDevCfg(c){ localStorage.setItem('catDevCfg', JSON.stringify(c)); }
    function effTiers(){ const c=devOn()&&devCfg().tiers; if(!c) return TIERS; return TIERS.map(t=>({ id:t.id, name:t.name, color:t.color, p:(c[t.id]!=null?Number(c[t.id]):t.p) })); }
    function effCatTier(){ if(!devOn()) return CAT_TIER; const ov=devCfg().catTier||{}, r={}; Object.keys(CAT_TIER).forEach(k=>{ r[k]=(ov[k]!=null?ov[k]:CAT_TIER[k]); }); return r; }   // 알려진 id만(구 dev 설정의 잔여 키 무시)
    function effItemTier(){ return devOn()? Object.assign({},ITEM_TIER,devCfg().itemTier||{}) : ITEM_TIER; }
    // 등급 랭크(낮을수록 흔함). 특별(epic) 이상은 상점 직접 구매 불가 — 펫알(가챠) 전용.
    function tierRank(tier){ return Math.max(0, TIER_ORDER.indexOf(tier||'normal')); }
    function petTierOf(id){ return effCatTier()[id]||'normal'; }
    function isGachaOnlyCat(id){ return tierRank(petTierOf(id)) >= tierRank('epic'); }
    // 이벤트 하단: 펫알·랜덤박스 구성(등급별 목록)과 확률을 접이식으로 표시.
    function gachaInfoHtml(){
      const tiers=effTiers(), catBy=effCatTier(), itemBy=effItemTier();
      const secRows=(items,byMap,key)=> tiers.map(t=>{ const ns=items.filter(x=>byMap[x.id]===t.id).map(x=>x[key]); if(!ns.length) return '';
        return '<div class="gi-row"><b class="tier-'+t.id+'">'+t.name+'</b><span class="gi-p">'+t.p+'%</span><span class="gi-list">'+escapeHtml(ns.join(', '))+'</span></div>'; }).join('');
      return '<details class="gacha-info"><summary>📋 펫알·랜덤박스 구성·확률 보기</summary><div class="gi-body">'+
        '<div class="gi-sec"><div class="gi-h">🥚 펫알 · 고양이</div>'+secRows(PET_CATALOG,catBy,'name')+'</div>'+
        '<div class="gi-sec"><div class="gi-h">🎁 랜덤박스 · 가구</div>'+secRows(ITEM_CATALOG,itemBy,'name')+'</div>'+
        '</div></details>';
    }
    // 확률은 합이 100이 아니어도 총합 기준 비율로 적용(개발 편의)
    function rollTier(){ const arr=effTiers(); const total=arr.reduce((s,t)=>s+(Number(t.p)||0),0)||1; const r=Math.random()*total; let acc=0; for(const t of arr){ acc+=(Number(t.p)||0); if(r<acc) return t.id; } return arr[0].id; }
    // 등급 롤 → 해당 등급 풀에서 랜덤. 비면 한 단계 아래로 내려가며 탐색.
    function rollFromPool(tierMap){
      let ti=TIER_ORDER.indexOf(rollTier());
      for(; ti>=0; ti--){ const tier=TIER_ORDER[ti]; const pool=Object.keys(tierMap).filter(k=>tierMap[k]===tier);
        if(pool.length) return { id:pool[Math.floor(Math.random()*pool.length)], tier }; }
      // 아래로도 없으면 위로
      for(ti=0; ti<TIER_ORDER.length; ti++){ const tier=TIER_ORDER[ti]; const pool=Object.keys(tierMap).filter(k=>tierMap[k]===tier); if(pool.length) return { id:pool[Math.floor(Math.random()*pool.length)], tier }; }
      return null;
    }
    const GACHA_PRICE=100, DUP_REFUND=30;
    // 구매+롤(원자적): 은화-100, 금화+1, 지급(신규 고양이/가구 or 중복 환급). 성공 시 연출.
    function openGacha(kind){
      if(coins()<GACHA_PRICE){ toast((GACHA_PRICE-coins())+' 은화 부족', true); return; }
      const res = rollFromPool(kind==='egg'?effCatTier():effItemTier()); if(!res) return;
      const dup = kind==='egg' && ownsCat(res.id);
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(g.coins<GACHA_PRICE) return g;
        g.coins-=GACHA_PRICE; g.gold=(g.gold||0)+1;
        if(kind==='egg'){
          if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; if(g.home.active.length<(g.home.slots||BASE_SLOTS) && g.home.active.indexOf(res.id)<0) g.home.active.push(res.id); }
          else { g.coins+=DUP_REFUND; }
        } else {
          g.owned.items[res.id]=g.owned.items[res.id]||{qty:0,boughtAt:new Date().toISOString()};
          g.owned.items[res.id].qty=(Number(g.owned.items[res.id].qty)||0)+1;
        }
        return g;
      }).then(r=>{ if(r&&r.committed) runGachaFx(kind, res, dup); });
    }
    let _selItem=null;
    function selItem(id){ _selItem=(_selItem===id?null:id); renderCatHouse(); }
    const ITEM_SELL = 10;   // 기구물 판매가(은화)
    function itemFoot(id){ const it=ITEM_CATALOG.find(x=>x.id===id); return { w:(it&&it.footW)||1, h:(it&&it.footH)||1 }; }
    function placedItemId(key){ const p=(state.game&&state.game.home.placed)||{}; return p[key]&&p[key].itemId; }
    // 배치된 가구가 점유하는 칸 집합("r_c") — ignoreKey는 이동 중 자기 자신 제외
    function occupiedCells(placed, ignoreKey){
      const occ={}; Object.keys(placed||{}).forEach(k=>{ if(k===ignoreKey) return;
        const pr=k.split('_'), r=+pr[0], c=+pr[1], f=itemFoot(placed[k].itemId);
        for(let dr=0;dr<f.h;dr++)for(let dc=0;dc<f.w;dc++) occ[(r+dr)+'_'+(c+dc)]=1; });
      return occ;
    }
    // (r,c)에서 w×h 발자국이 격자 안에 들어가고 다른 가구와 안 겹치는지
    function areaFree(r,c,w,h,placed,ignoreKey){
      if(r<1||c<1||r+h-1>12||c+w-1>12) return false;
      const occ=occupiedCells(placed, ignoreKey);
      for(let dr=0;dr<h;dr++)for(let dc=0;dc<w;dc++) if(occ[(r+dr)+'_'+(c+dc)]) return false;
      return true;
    }
    // 화면 좌표 → 격자 칸(1~12)
    function cellFromPoint(grid, clientX, clientY){
      const rc=grid.getBoundingClientRect(), cw=rc.width/12, ch=rc.height/12;
      const c=Math.floor((clientX-rc.left)/cw)+1, r=Math.floor((clientY-rc.top)/ch)+1;
      return { r:Math.min(12,Math.max(1,r)), c:Math.min(12,Math.max(1,c)) };
    }
    // 드롭 좌상단 칸 = 포인터가 발자국 "가운데"에 오도록 보정(3칸 가로면 2번째 칸 기준). 격자 안으로 클램프.
    function dropCell(grid, x, y, foot){
      const p=cellFromPoint(grid, x, y);
      let c=p.c-Math.floor((foot.w-1)/2), r=p.r-Math.floor((foot.h-1)/2);
      c=Math.max(1, Math.min(13-foot.w, c)); r=Math.max(1, Math.min(13-foot.h, r));
      return { r, c };
    }
    // 빈 칸(그리드 배경) 탭 → 선택한 가구 배치(2×2는 그만큼 점유·겹침 방지)
    let _justDragged=false;
    function placeClick(e){
      if(_justDragged) return;                          // 드래그 직후 발생하는 click 무시
      const grid=$('placeGrid'); if(!grid) return;
      if(!_selItem){ toast('놓을 가구를 먼저 선택하세요'); return; }
      if(itemRemaining(_selItem)<=0){ toast('배치할 수량이 없어요(상점에서 구매)', true); return; }
      // 밥·물그릇·화장실은 고양이 최대 마릿수(슬롯 수)만큼만 배치 가능
      if(CARE_ITEMS.indexOf(_selItem)>=0 && itemPlaced(_selItem)>=slotCount()){ toast('그 종류는 최대 '+slotCount()+'개까지 놓을 수 있어요(고양이 수 기준)', true); return; }
      const foot=itemFoot(_selItem), cell=dropCell(grid, e.clientX, e.clientY, foot), r=cell.r, c=cell.c;   // 포인터=발자국 가운데
      const placed=(state.game.home.placed)||{};
      if(!areaFree(r,c,foot.w,foot.h,placed,null)){ toast('그 자리엔 놓을 수 없어요(겹침)', true); return; }
      gameRef().child('home/placed/'+r+'_'+c).set({itemId:_selItem});
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
      showDropPreview(cell.r, cell.c, _drag.foot, _drag.key);
    }
    function giUp(e){
      if(!_drag) return; const d=_drag; _drag=null;
      unlockDragScroll();
      d.el.onpointermove=null; d.el.onpointerup=null; d.el.onpointercancel=null;
      hideDropPreview(); d.el.classList.remove('drag');
      _justDragged=true; setTimeout(()=>{ _justDragged=false; }, 80);
      const cell=dropCell(d.grid, e.clientX, e.clientY, d.foot), r=cell.r, c=cell.c, newKey=r+'_'+c;
      const placed=(state.game.home.placed)||{};
      const resetEl=()=>{ d.el.style.transform=''; };
      if(newKey===d.key){ resetEl(); return; }
      if(!areaFree(r,c,d.foot.w,d.foot.h,placed,d.key)){ toast('그 자리엔 놓을 수 없어요(겹침)', true); resetEl(); return; }
      const id=placed[d.key]&&placed[d.key].itemId; if(!id){ resetEl(); return; }
      const up={}; up[d.key]=null; up[newKey]={itemId:id};
      gameRef().child('home/placed').update(up);          // 이동 커밋 → 리스너가 재렌더
    }
    // ---- 팔레트 항목을 그리드로 드래그해 새로 배치(꾹 눌러 드래그, 짧게 탭하면 선택 토글) ----
    let _pal=null;
    function palDown(e, id){
      beginLongPress(e,
        (el, sx, sy)=>{                              // arm: 꾹 눌러 집어듦 → 고스트 생성·배치 시작
          if(itemRemaining(id)<=0){ toast(catFurnName(id)+' 남은 수량이 없어요(상점에서 구매)', true); return; }
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
      if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){ const cell=dropCell(grid,e.clientX,e.clientY,_pal.foot); showDropPreview(cell.r,cell.c,_pal.foot,null); }
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
      if(CARE_ITEMS.indexOf(d.id)>=0 && itemPlaced(d.id)>=slotCount()){ toast('그 종류는 최대 '+slotCount()+'개까지 놓을 수 있어요', true); return; }
      const cell=dropCell(grid,e.clientX,e.clientY,d.foot), rr=cell.r, cc=cell.c;
      const placed=(state.game.home.placed)||{};
      if(!areaFree(rr,cc,d.foot.w,d.foot.h,placed,null)){ toast('그 자리엔 놓을 수 없어요(겹침)', true); return; }
      gameRef().child('home/placed/'+rr+'_'+cc).set({itemId:d.id});
    }
    function catFurnName(id){ const it=ITEM_CATALOG.find(x=>x.id===id); return it?it.name:id; }
    function showDropPreview(r,c,foot,key){
      const g=$('gdrop'); if(!g) return; const placed=(state.game.home.placed)||{};
      const rr=Math.min(13-foot.h,Math.max(1,r)), cc=Math.min(13-foot.w,Math.max(1,c));
      const ok=areaFree(rr,cc,foot.w,foot.h,placed,key);
      g.hidden=false; g.className='gdrop'+(ok?'':' bad');
      g.style.left=((cc-1)/12*100)+'%'; g.style.top=((rr-1)/12*100)+'%';
      g.style.width=(foot.w/12*100)+'%'; g.style.height=(foot.h/12*100)+'%';
    }
    function hideDropPreview(){ const g=$('gdrop'); if(g) g.hidden=true; }
    // ---- 배치된 가구 탭 → 회수/판매 메뉴 ----
    function openItemMenu(key){
      closeItemMenu();
      const placed=(state.game.home.placed)||{}, p=placed[key]; if(!p) return;
      const it=ITEM_CATALOG.find(x=>x.id===p.itemId)||{};
      const wrap=document.createElement('div'); wrap.id='giMenu'; wrap.className='gimenu-scrim';
      wrap.onclick=function(e){ if(e.target===wrap) closeItemMenu(); };
      wrap.innerHTML='<div class="gimenu"><div class="gih">'+furnSvg(p.itemId,{h:34})+'<b>'+escapeHtml(it.name||p.itemId)+'</b></div>'+
        '<button class="gib" onclick="retrievePlaced(\''+key+'\')"><b>회수</b><span>인벤토리로 되돌려요(보유 유지)</span></button>'+
        '<button class="gib sell" onclick="sellPlaced(\''+key+'\')"><b>판매</b><span>+'+ITEM_SELL+' 은화 · 보유에서 제거</span></button>'+
        '<button class="gib ghost" onclick="closeItemMenu()">닫기</button></div>';
      document.body.appendChild(wrap);
    }
    function closeItemMenu(){ const m=$('giMenu'); if(m) m.remove(); }
    function retrievePlaced(key){ gameRef().child('home/placed/'+key).remove(); closeItemMenu(); toast('회수했어요(인벤토리로)'); }
    function sellPlaced(key){
      const placed=(state.game.home.placed)||{}, p=placed[key]; if(!p){ closeItemMenu(); return; }
      const id=p.itemId;
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(!g.home.placed[key]) return g;                 // 이미 없음(중복 방지)
        delete g.home.placed[key];
        const inv=g.owned.items[id];
        if(inv){ inv.qty=Math.max(0,(Number(inv.qty)||0)-1); if(inv.qty<=0) delete g.owned.items[id]; }
        g.coins += ITEM_SELL;
        return g;
      }).then(r=>{ if(r&&r.committed) toast('+'+ITEM_SELL+' 은화에 판매했어요'); });
      closeItemMenu();
    }
    function catPlaceHtml(){
      const placed=(state.game.home.placed)||{};
      // 배치된 가구를 격자 위 절대좌표로(발자국 크기만큼 영역 차지). 드래그=이동, 탭=회수/판매.
      const items=Object.keys(placed).map(key=>{ const pr=key.split('_'), r=+pr[0], c=+pr[1], id=placed[key].itemId, foot=itemFoot(id);
        const left=((c-1)/12*100).toFixed(3), top=((r-1)/12*100).toFixed(3), w=(foot.w/12*100).toFixed(3), h=(foot.h/12*100).toFixed(3);
        // 배치칸(발자국)에 꽉 차게 그림
        return '<div class="gitem" style="left:'+left+'%;top:'+top+'%;width:'+w+'%;height:'+h+'%" onpointerdown="giDown(event,\''+key+'\')" onclick="event.stopPropagation()">'+
          '<span class="gsc">'+furnSvg(id,{fit:true})+'</span></div>'; }).join('');
      const grid='<div class="grid12" id="placeGrid" onclick="placeClick(event)">'+items+'<div class="gdrop" id="gdrop" hidden></div></div>';
      // 팔레트 항목을 그리드로 바로 드래그해 배치(탭하면 선택). 아이콘은 크게.
      const pal=ITEM_CATALOG.map(it=>{ const foot=itemFoot(it.id);
        return '<button class="pitem'+(_selItem===it.id?' on':'')+'" onpointerdown="palDown(event,\''+it.id+'\')" onclick="if(event.detail===0)selItem(\''+it.id+'\')"><span class="pic">'+furnSvg(it.id,{h:30})+'</span><span>'+it.name+'</span><span class="pq">'+foot.w+'×'+foot.h+' · 남은 '+itemRemaining(it.id)+'</span></button>'; }).join('');
      // 미니 웹캠 프리뷰: 현재 배치를 실제 방 뷰로 보여줘 방향 헷갈림 방지(표시 전용)
      const plist=placedList().sort((a,b)=>a.r-b.r); distributePoops(plist);
      const preview='<div class="miniroom"><div class="cr-wall" style="background:'+wallCss(currentWall())+'"></div><div class="cr-floor"></div><div class="cr-base"></div><span class="cr-cam"><i></i>미리보기</span><div class="cr-props">'+plist.map(p=>propMarkup(p,true)).join('')+'</div></div>';
      const dragHint='<div class="hintline" style="margin:8px 0 4px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11.5V5.5a1.5 1.5 0 0 1 3 0v5"/><path d="M12 10V4.5a1.5 1.5 0 0 1 3 0V10"/><path d="M15 9.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3l-2-3.5a1.5 1.5 0 0 1 2.6-1.5L9 14"/></svg><b>꾹 눌러서</b> 끌면 배치·이동돼요(짧게 탭하면 선택·메뉴). 화면 스크롤과 겹치지 않아요.</div>';
      return '<div class="editwrap">'+preview+grid+dragHint+'<div class="palette">'+pal+'</div></div>';
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

    // ================= 뽑기 오픈 연출(#catFx 풀스크린) =================
    let _fx=null;
    function itemName(kind,id){ return kind==='egg'?catName(id):((ITEM_CATALOG.find(x=>x.id===id)||{}).name||id); }
    function fxParticles(n,cls){ let s=''; for(let i=0;i<(n||14);i++){ const a=(i/(n||14))*360+Math.random()*30, d=60+Math.random()*90; const dx=Math.round(Math.cos(a*Math.PI/180)*d), dy=Math.round(Math.sin(a*Math.PI/180)*d); const del=(Math.random()*0.12).toFixed(2); s+='<span class="'+(cls||'fx-particle')+'" style="--dx:'+dx+'px;--dy:'+dy+'px;animation-delay:'+del+'s"></span>'; } return s; }
    function fxConfetti(){ const cols=['#F04452','#F0883C','#F2C84B','#2FAE7A','#3182F6','#9B6FC8']; let s=''; for(let i=0;i<24;i++){ const x=Math.round(Math.random()*100), r=Math.round(Math.random()*360), del=(Math.random()*0.5).toFixed(2), dur=(1+Math.random()*0.8).toFixed(2); s+='<span class="fx-conf" style="left:'+x+'%;background:'+cols[i%6]+';--r:'+r+'deg;animation-delay:'+del+'s;animation-duration:'+dur+'s"></span>'; } return s; }
    function runGachaFx(kind, res, dup){
      const fx=$('catFx'); if(!fx){ toast((kind==='egg'?'펫알':'랜덤박스')+' 획득!'); return; }
      _fx={ kind, res, dup, stage:0 };
      if(reducedMotion()){ fxReveal(); return; }   // 모션 최소화: 바로 결과
      const art = kind==='egg'? eggSvg(0,{h:150}) : boxSvg({h:150});
      const hint = kind==='egg'? '알을 탭해서 깨보세요! (3번)' : '상자를 탭해서 열어보세요!';
      fx.innerHTML='<div class="fx-scrim"></div><div class="fx-stage">'+
        '<div class="fx-item pop '+(kind==='egg'?'fx-egg':'fx-box')+'" id="fxItem" role="button" aria-label="'+hint+'" onclick="fxTap()">'+art+'</div>'+
        '<div class="fx-hint" id="fxHint">'+hint+'</div></div>';
      fx.className='fx on';
    }
    // 탭할 때마다 껍질 조각이 사방으로 튀는 연출(단계가 오를수록 더 많이) — 알이 점점 더 깨지는 느낌.
    function fxCrackChips(stage){ const fx=$('catFx'), st=fx&&fx.querySelector('.fx-stage'); if(!st) return;
      const n=4+stage*4; let s='';
      for(let i=0;i<n;i++){ const a=-90+(i/n)*300+(Math.random()*24-12), d=44+Math.random()*72;
        const dx=Math.round(Math.cos(a*Math.PI/180)*d), dy=Math.round(Math.sin(a*Math.PI/180)*d)+8;
        const rot=Math.round(Math.random()*320-160), sc=(0.5+Math.random()*0.7).toFixed(2), del=(Math.random()*0.05).toFixed(2);
        s+='<span class="fx-chip" style="--dx:'+dx+'px;--dy:'+dy+'px;--r:'+rot+'deg;--s:'+sc+';animation-delay:'+del+'s"></span>'; }
      const w=document.createElement('div'); w.innerHTML=s; const nodes=[].slice.call(w.children);
      nodes.forEach(function(nd){ st.appendChild(nd); }); setTimeout(function(){ nodes.forEach(function(nd){ nd.remove(); }); }, 720);
    }
    function fxTap(){
      if(!_fx||_fx.busy) return; const it=$('fxItem'); if(!it) return;
      if(_fx.kind==='egg'){
        _fx.stage++;
        if(_fx.stage>=3){ _fx.busy=true; fxClimax(); return; }
        it.innerHTML=eggSvg(_fx.stage,{h:150}); it.classList.remove('shake'); void it.offsetWidth; it.classList.add('shake');
        fxCrackChips(_fx.stage);   // 탭마다 껍질 조각이 튀어 깨짐을 강조
      } else { _fx.busy=true; fxClimax(); }
    }
    // 깨진 껍질 조각(알 전용): 좌우로 튀어나가 아래·옆에 흩어져 놓인다. 큰 조각 2개 + 잔조각.
    function fxShells(){
      let s=''; const n=7;
      for(let i=0;i<n;i++){
        const side=(i%2)?1:-1;
        const sx=(side*(48+Math.random()*94)).toFixed(0);   // 좌우로 흩어짐
        const sy=(24+Math.random()*74).toFixed(0);          // 아래로 떨어져 옆에 놓임
        const sr=(side*(30+Math.random()*170)).toFixed(0);
        const big=i<2;
        const sc=(big?1:0.5+Math.random()*0.35).toFixed(2);
        const del=(Math.random()*0.09).toFixed(2);
        s+='<span class="fx-shell'+(big?' big':'')+'" style="--sx:'+sx+'px;--sy:'+sy+'px;--sr:'+sr+'deg;--ss:'+sc+';animation-delay:'+del+'s"></span>';
      }
      return s;
    }
    // 오픈 직전 연출: (흔들림) → [특별↑: 검은 고양이 앞발로 톡 → 추가 흔들림] → 등급색 빛 새어나옴(등급↑ 강함) → 버스트(알=껍질 조각 튐) → 등장
    function fxClimax(){
      const fx=$('catFx'), st=fx&&fx.querySelector('.fx-stage'), it=$('fxItem'); if(!st||!it) return;
      const t=tierInfo(_fx.res.tier), epic=['epic','legend','limited'].indexOf(_fx.res.tier)>=0, lim=_fx.res.tier==='limited';
      const rank=Math.max(0, TIER_ORDER.indexOf(_fx.res.tier));   // 0(일반)~5(한정)
      const lk=(1+rank*0.15).toFixed(2);                          // 등급 높을수록 빛이 크고 밝게
      const isEgg=_fx.kind==='egg';
      const hint=$('fxHint'); if(hint) hint.remove();
      it.classList.add('fx-preshake');
      let t0=680;
      if(epic){
        setTimeout(()=>{ st.insertAdjacentHTML('beforeend','<div class="fx-paw" id="fxPaw">'+pawSvg({h:66})+'</div>'); const p=$('fxPaw'); if(p){ void p.offsetWidth; p.classList.add('tap'); } }, 460);
        setTimeout(()=>{ it.classList.remove('fx-preshake'); void it.offsetWidth; it.classList.add('fx-hit'); }, 660);
        setTimeout(()=>{ const p=$('fxPaw'); if(p) p.remove(); it.classList.remove('fx-hit'); }, 980);
        t0=1120;
      }
      setTimeout(()=>{
        it.classList.remove('fx-preshake','fx-hit'); void it.offsetWidth; it.classList.add('fx-tremble');
        if(_fx.kind==='box') it.classList.add('fx-ajar');
        // 껍질 사이로 새어나오는 빛 — 등급색(한정은 무지개), 등급 높을수록 크고 밝게
        st.insertAdjacentHTML('beforeend','<div class="fx-leak'+(lim?' rainbow':'')+'" style="color:'+t.color+';--lk:'+lk+'"></div>');
      }, t0);
      setTimeout(()=>{ fxBurst(epic, isEgg); }, t0+700);
      setTimeout(fxReveal, t0+700+(isEgg?560:320));   // 알은 껍질 조각이 옆으로 흩어져 앉을 시간을 조금 더 준다
    }
    function fxBurst(big, isEgg){
      const st=$('catFx').querySelector('.fx-stage'); if(!st) return;
      const it=$('fxItem'); if(it) it.style.visibility='hidden';
      st.insertAdjacentHTML('beforeend','<div class="fx-flash"></div>'+(big?'<div class="fx-rays"></div>':'')+(isEgg?fxShells():'')+fxParticles(big?20:14));
      const h=$('fxHint'); if(h) h.remove();
    }
    function fxReveal(){
      if(!_fx) return; const fx=$('catFx'); const t=tierInfo(_fx.res.tier);
      const art=_fx.kind==='egg'?catFace(_fx.res.id,{h:118}):furnSvg(_fx.res.id,{h:104});
      fx.innerHTML='<div class="fx-scrim"></div><div class="fx-reveal tier-'+t.id+'">'+
        '<div class="fx-halo"></div><div class="fx-rays slow"></div>'+
        '<div class="fx-art pop">'+art+'</div>'+
        '<div class="fx-tier">'+t.name+'</div>'+
        '<div class="fx-name">'+(_fx.kind==='egg'?catNameSpan(_fx.res.id,catName(_fx.res.id)):escapeHtml(itemName(_fx.kind,_fx.res.id)))+'</div>'+
        '<div class="fx-reward"><span class="rw"><span class="ci">'+goldSvg({h:18})+'</span>+1 금화</span>'+
          (_fx.dup?'<span class="rw"><span class="ci">'+coinSvg({h:18})+'</span>+'+DUP_REFUND+' 은화 (중복)</span>':'')+'</div>'+
        '<button class="btn" onclick="closeFx()">확인</button>'+
        '<div class="fx-confetti">'+fxConfetti()+'</div></div>';
      fx.className='fx on reveal';
    }
    function closeFx(){ const fx=$('catFx'); if(fx){ fx.className='fx'; fx.innerHTML=''; } _fx=null; }

    // ================= 개발자 패널: 펫알/박스 확률·구성 =================
    function openDevGacha(){
      if(!isDev()) return;
      const cfg=devCfg(), tp=cfg.tiers||{}, ct=effCatTier(), it=effItemTier();
      const tierOpt=(cur)=>TIERS.map(t=>'<option value="'+t.id+'"'+(cur===t.id?' selected':'')+'>'+t.name+'</option>').join('');
      let h='<div class="note">개발자 전용 · 이 기기(브라우저)에만 적용됩니다. 확률 합이 100이 아니어도 비율로 반영돼요.</div>';
      h+='<div class="sec-title">연출 테스트(무료)</div>';
      h+='<div class="tx-sub" style="margin:0 2px 6px;">펫알</div><div class="chip-row">'+TIERS.map(t=>'<button class="chip" onclick="devPreview(\'egg\',\''+t.id+'\')"><b class="tier-'+t.id+'">'+t.name+'</b></button>').join('')+'</div>';
      h+='<div class="tx-sub" style="margin:8px 2px 6px;">랜덤박스</div><div class="chip-row">'+TIERS.map(t=>'<button class="chip" onclick="devPreview(\'box\',\''+t.id+'\')"><b class="tier-'+t.id+'">'+t.name+'</b></button>').join('')+'</div>';
      h+='<div class="sec-title" style="margin-top:18px;">다마고치 테스트(즉시)</div>';
      h+='<div class="note" style="margin-bottom:8px;">3시간을 기다리지 않고 급여·배변·수거를 바로 확인. 순서: <b>사료·물 +10</b> → 홈에서 그릇 채우기(또는 <b>그릇 다 채우기</b>) → <b>그릇 만료→똥</b> → 똥 탭/일괄 돌보기.</div>';
      h+='<div class="chip-row"><button class="chip" onclick="devGiveConsum()">사료·물 +10</button><button class="chip" onclick="devFillAll()">그릇 다 채우기</button><button class="chip" onclick="devExpireBowls()">그릇 만료→똥</button><button class="chip" onclick="devAddPoop()">똥 +3</button><button class="chip" onclick="devAddCoins()">은화 +100</button></div>';
      h+='<div class="sec-title" style="margin-top:18px;">등급 확률(%)</div>';
      h+=TIERS.map(t=>'<div class="row" style="padding:5px 2px;"><span><b class="tier-'+t.id+'">'+t.name+'</b></span><input class="input" style="width:96px;text-align:right;" inputmode="decimal" id="dp_'+t.id+'" value="'+(tp[t.id]!=null?tp[t.id]:t.p)+'"></div>').join('');
      h+='<div class="sec-title" style="margin-top:18px;">펫알 — 고양이 등급</div>';
      h+=PET_CATALOG.map(c=>'<div class="row" style="padding:5px 2px;"><span>'+c.name+'</span><select class="input" style="width:120px;" id="dc_'+c.id+'">'+tierOpt(ct[c.id])+'</select></div>').join('');
      h+='<div class="sec-title" style="margin-top:18px;">랜덤박스 — 가구 등급</div>';
      h+=ITEM_CATALOG.map(i=>'<div class="row" style="padding:5px 2px;"><span>'+i.name+'</span><select class="input" style="width:120px;" id="di_'+i.id+'">'+tierOpt(it[i.id])+'</select></div>').join('');
      h+='<button class="btn" style="margin-top:14px;" onclick="saveDevGacha()">저장</button>';
      h+='<button class="btn ghost" style="margin-top:8px;" onclick="resetDevGacha()">기본값으로 초기화</button>';
      openSheet('개발자 · 펫알/박스', h);
    }
    function saveDevGacha(){
      const c={ tiers:{}, catTier:{}, itemTier:{} };
      TIERS.forEach(t=>{ const v=parseFloat(val('dp_'+t.id)); if(!isNaN(v)) c.tiers[t.id]=v; });
      PET_CATALOG.forEach(x=>{ c.catTier[x.id]=val('dc_'+x.id); });
      ITEM_CATALOG.forEach(x=>{ c.itemTier[x.id]=val('di_'+x.id); });
      saveDevCfg(c); toast('개발자 설정을 저장했어요'); closeSheet();
    }
    function resetDevGacha(){ localStorage.removeItem('catDevCfg'); toast('기본값으로 초기화'); openDevGacha(); }
    // 연출만 미리보기(은화 소모·지급 없음)
    function devPreview(kind, tierId){
      const map = kind==='egg'? effCatTier() : effItemTier();
      let id = Object.keys(map).find(k=>map[k]===tierId);
      if(!id) id = kind==='egg' ? (Object.keys(map)[0]||'cat_mackerel') : (Object.keys(map)[0]||'cushion');
      closeSheet(); _fx=null; runGachaFx(kind, { id, tier:tierId }, false);
    }
    // ---- 다마고치 테스트(개발자 전용, 즉시) ----
    function devGiveConsum(){ if(!isDev())return; gameRef().transaction(g=>{ g=normalizeGame(g); g.consum.food+=10; g.consum.water+=10; return g; }).then(r=>{ if(r&&r.committed) toast('사료·물 +10'); }); }
    function devFillAll(){ if(!isDev())return; gameRef().transaction(g=>{ g=normalizeGame(g); const now=Date.now(); Object.keys(g.home.placed||{}).forEach(k=>{ const e=g.home.placed[k]; if(e&&(e.itemId==='bowl'||e.itemId==='waterbowl')) e.filledAt=now; }); return g; }).then(r=>{ if(r&&r.committed) toast('모든 그릇 채움 🍚💧'); }); }
    function devExpireBowls(){ if(!isDev())return; gameRef().transaction(g=>{ g=normalizeGame(g); const pl=g.home.placed||{}; let poop=0; Object.keys(pl).forEach(k=>{ const e=pl[k]; if(e&&e.filledAt&&(e.itemId==='bowl'||e.itemId==='waterbowl')){ e.filledAt=null; poop++; } }); if(poop) g.home.poops=(Number(g.home.poops)||0)+poop; return g; }).then(r=>{ if(r&&r.committed) toast('채워진 그릇 만료 → 똥 생성'); }); }
    function devAddPoop(){ if(!isDev())return; gameRef().transaction(g=>{ g=normalizeGame(g); g.home.poops=(Number(g.home.poops)||0)+3; return g; }).then(r=>{ if(r&&r.committed) toast('똥 +3'); }); }
    function devAddCoins(){ if(!isDev())return; gameRef().transaction(g=>{ g=normalizeGame(g); g.coins+=100; return g; }).then(r=>{ if(r&&r.committed) toast('은화 +100'); }); }
