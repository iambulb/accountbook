// ===== 🐱 고양이집 — 은화 경제 + 도트(픽셀) 아트 =====
// 소속: 개인 전역 users/{uid}/game (워크스페이스 무관). RTDB 규칙 변경 불필요.
// 픽셀 아트: 문자 매트릭스 → SVG rect(crispEdges) 렌더(px). PNG 미사용(다크모드·캐시·성능 유리).

    // ---- 픽셀 매트릭스 (도트 아트) ----
    // 고양이 정면(코숏) — 귀·눈·코·줄무늬·가슴털·꼬리. X=외곽 B=몸 L=밝은털 S=줄무늬 E=눈 P=코 I=귀안
    // 정면 앉은 고양이(코숏, 알뜰샵/칩) — design_sample 스타일: 둥근 몸+뾰족 귀(핑크 안쪽)+큰 눈+가슴털+타비
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
    // 방석(1×1): 푹신한 쿠션 — L=하이라이트/C=천/D=음영/B=가운데 단추(터프팅). 16×9 → 가로세로비 ≈1.78.
    const M_CUSHION = [
      "................",
      "...XXXXXXXXXX...",
      "..XLLLLLLLLCCX..",
      ".XLLLLLLLLLCCCX.",
      ".XLLLLBBLLLCCCX.",
      ".XLLDDBBDDLCCCX.",
      ".XDDCCCCCCCCDDX.",
      "..XXDCCCCCCDXX..",
      "...XXXXXXXXXX..."
    ];
    // 밥그릇/물그릇(1×1): 도자기 그릇 — L=림 하이라이트/W=몸체/D=음영/베이스. 빈 그릇은 이 매트릭스. 16×9 → 가로세로비 ≈1.78.
    // 홈에서 탭해 채우면 밥=M_BOWL_FOOD(사료 F/f/g), 물=M_WATERBOWL_WATER(물 A/a/h 리플)로 표시.
    const M_BOWL = [
      "................",
      "................",
      "..XXXXXXXXXXXX..",
      ".XLLLLLLLLLLLLX.",
      ".XWWWWWWWWWWWWX.",
      ".XDWWWWWWWWWWDX.",
      "..XDWWWWWWWWDX..",
      "...XXDDDDDDXX...",
      ".....XXXXXX....."
    ];
    const M_BOWL_FOOD = [
      "................",
      ".....gFFg.......",
      "...XXFFFFXX.....",
      "..XLFFfFFfFLX...",
      ".XLFFFFFFFFFFLX.",
      ".XWWWWWWWWWWWWX.",
      "..XDWWWWWWWWDX..",
      "...XXDDDDDDXX...",
      ".....XXXXXX....."
    ];
    const M_WATERBOWL_WATER = [
      "................",
      "................",
      "..XXXXXXXXXXXX..",
      ".XLLLLLLLLLLLLX.",
      ".XWAAAAhAAAAAWX.",
      ".XDAAAaAAAAAADX.",
      "..XDAAAAAAAADX..",
      "...XXDDDDDDXX...",
      ".....XXXXXX....."
    ];
    // 펫 화장실(1×1): 오픈 모래 트레이 — 알갱이 텍스처(S/s/k 디더)로 모래를 표현, 앞벽(W)+베이스. 비운 그릇 수만큼 똥이 모래 위에 쌓임. 14×12 → 가로세로비 ≈1.17.
    const M_LITTER = [
      "..............",
      ".XXXXXXXXXXXX.",
      ".XsSSsSkSsSSX.",
      ".XSskSSsSSksX.",
      ".XsSSkSsSSsSX.",
      ".XSkSsSSskSsX.",
      ".XssSkSsSkSsX.",
      ".XWWWWWWWWWWX.",
      "XWWWWWWWWWWWWX",
      "XWDDDDDDDDDDWX",
      ".XXXXXXXXXXXX.",
      ".............."
    ];
    const M_POOP = [
      "........","...XX...","..XKKX..",".XKKKKX.",".XKKKKX.","..XKKX..","...XX...","........"
    ];
    // 소비 아이템 아이콘(알뜰샵 소비 탭)
    // 사료포대(F=몸체,D=외곽/그림자,L=라벨,K=라벨 사료무늬) — 위가 접힌 사료 봉투
    const M_FOOD = [
      ".....DD.....",
      "....DFFD....",
      "...DFFFFD...",
      "..DFFFFFFD..",
      ".DFFFFFFFFD.",
      ".DFFFFFFFFD.",
      ".DFLLLLLLFD.",
      ".DFLKKKKLFD.",
      ".DFLLLLLLFD.",
      ".DFFFFFFFFD.",
      ".DFFFFFFFFD.",
      ".DFFFFFFFFD.",
      ".DDFFFFFFDD.",
      "..DDDDDDDD.."
    ];
    // 물병(A=물,D=뚜껑/외곽,H=하이라이트,L=라벨) — 뚜껑+라벨 있는 생수병
    const M_WATER = [
      ".....DD.....",
      ".....DD.....",
      "....DDDD....",
      ".....DD.....",
      "....DAAD....",
      "...DAAAAD...",
      "..DAAAAAAD..",
      "..DAHAAAAD..",
      "..DAAAAAAD..",
      "..DLLLLLLD..",
      "..DLLLLLLD..",
      "..DAAAAAAD..",
      "..DAAAAAAD..",
      "..DAAAAAAD..",
      "..DDDDDDDD.."
    ];
    // 캣타워: 3층(발판 3개) 세로형 — 상단 둥지컵 + 중·하단 카펫 발판 + 시살(밧줄) 기둥 + 매달린 장난감 + 발 달린 목재 베이스.
    // 16×30, 가로세로비 ≈ 0.533. 발판 중심이 상호작용 층 높이(furnSpot frac 0.30/0.62/0.92)에 정렬(하단30%·중단62%·상단컵92%).
    // 팔레트: X=진한 목재·P/H=기둥 목재·W/C/L=카펫(기본/음영/하이라이트)·R/S=시살 밧줄·T/O=장난감 공·K=끈.
    const M_TOWER = [
      "................",
      ".....LCCCCL.....",
      "....CWWWWWWC....",
      "....CWWWWWWC....",
      "....XCCCCCCX....",
      "...LLLLLLLLLL...",
      "..WWWWWWWWWWWK..",
      "..CCCCCCCCCCCK..",
      "...XXXXXXXXXXK..",
      "......SSSS...K..",
      "......SRRS..OOT.",
      "....LLLLLLLLTTT.",
      "...WWWWWWWWWW...",
      "...WWWWWWWWWW...",
      "...CCCCCCCCCC...",
      "....XXXXXXXX....",
      "......SSSS......",
      "......SRRS......",
      "......SSSS......",
      "......SRRS......",
      "..LLLLLLLLLLLL..",
      ".WWWWWWWWWWWWWW.",
      ".WWWWWWWWWWWWWW.",
      ".CCCCCCCCCCCCCC.",
      "..XXXXXXXXXXXX..",
      "......XPHX......",
      "......XPHX......",
      ".HHHHHHHHHHHHHH.",
      ".XXXXXXXXXXXXXX.",
      "..XXX......XXX.."
    ];
    // 스크래처(1×1) — 캣타워처럼 디테일하게: 카펫 캡 + 시살(밧줄) 감은 기둥(S 밝은 밧줄/R 홈 교대) + 매달린 장난감 공(O) + 발 달린 카펫 베이스. 14×22 → 가로세로비 ≈0.636.
    const M_SCRATCHER = [
      "....LWWWWL....",
      "...XWWWWWWX...",
      "...XCCCCCCX...",
      "....XSSSSXT...",
      "....XRRRRX.T..",
      "....XSSSSXHOO.",
      "....XRRRRXOOO.",
      "....XSSSSX.OO.",
      "....XRRRRX....",
      "....XSSSSX....",
      "....XRRRRX....",
      "....XSSSSX....",
      "....XRRRRX....",
      "....XSSSSX....",
      "....XRRRRX....",
      "....XSSSSX....",
      "..LLLLLLLLLL..",
      ".XWWWWWWWWWWX.",
      ".XWWWWWWWWWWX.",
      ".XCCCCCCCCCCX.",
      ".XXXXXXXXXXXX.",
      "..XX......XX.."
    ];
    // 펫하우스(2×2): 박공 지붕(R 지붕·r 기와줄)+ 통나무 벽(W/w 널결)+ 정면 출입구(D=어두운 실내). 출입구 안 앞에 펫이 앉아 정면(south)을 봄. 22×20 → 가로세로비 1.1.
    // 펫하우스(개집) — 사다리꼴(윗변 짧고 밑변 넓은) 지붕 + 처마 돌출 + 아치형 문. 22×21, 가로세로비 ≈1.05.
    const M_PETHOUSE = [
      "......XRrRRRrRRX......",
      ".....XHrRHRrHRRrX.....",
      ".....XrRRRrRRRrRX.....",
      "....XrRRRrRRRrRRRX....",
      "...XrRRRrRRRrRRRrRX...",
      "..XrRRRrRRRrRRRrRRRX..",
      "..XRRRrRRRrRRRrRRRrX..",
      ".XRRRrRRRrRRRrRRRrRRX.",
      "XXXXXXXXXXXXXXXXXXXXXX",
      "...XWWWWWWWWWWWWWWX...",
      "...XWWWWWWWWWWWWWWX...",
      "...XWWWWWDDDDWWWWWX...",
      "...XwwwwDDDDDDwwwwX...",
      "...XWWWWDDDDDDWWWWX...",
      "...XWWWWDDDDDDWWWWX...",
      "...XWWWWDDDDDDWWWWX...",
      "...XwwwwDDDDDDwwwwX...",
      "...XWWWWDDDDDDWWWWX...",
      "...XWWWWDDDDDDWWWWX...",
      "...XWWWWddddddWWWWX...",
      "...XXXXXXXXXXXXXXXX..."
    ];
    // 캣휠(러닝휠): 러닝 트랙 링(X=림·W=밴드·H=하이라이트·T=러닝 발판(rung)) + 가운데 축(허브) + 롤러(R)·나무 스탠드(D). 캠에선 링 전체가 제자리 회전.
    // 맨 위 1줄 여백(윗부분 잘려 보이지 않게). 24×24, 가로세로비 1.0. 회전 중심 ≈ (47.9%, 43.75%).
    const M_CATWHEEL = [
      "........................",
      "...........XX...........",
      "........XXXHHXXX........",
      "......XXTTHHHHTTXX......",
      ".....XHHHXXXXXXHHWX.....",
      "....XWHXX......XXWWX....",
      "....XWXX........XXWX....",
      "...XTWX..........XWTX...",
      "...XTX............XTX...",
      "...XWX.....XX.....XWX...",
      "..XWWX....XWWX....XWWX..",
      "..XWWX....XWWX....XWWX..",
      "...XWX.....XX.....XWX...",
      "...XTX............XTX...",
      "...XTWX..........XWTX...",
      "....XWXX........XXWX....",
      "....XWWXX......XXWWX....",
      ".....XWWWXXXXXXWWWX.....",
      "......XXTTWWWWTTXX......",
      "........RRXWWRRX........",
      "........RR...RR.........",
      "......DDDDDDDDDDD.......",
      "...DDDDDDDDDDDDDDDDD....",
      "DDDDDDDDDDDDDDDDDDDDDDD."
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
    // 화분(장식): 초록 잎(L=밝은 초록, G=진한 초록 테두리) + 테라코타 화분(P) + 화분 테두리(X). 세로형(8×14).
    // 화분(1×1, 세로형): 무성한 잎(G 진초록·L 잎·l 하이라이트) + 줄기(S, 잎만 살랑이도록 잎과 글자 분리) + 테라코타 화분(P/p 음영·X 외곽). 12×20 → 가로세로비 0.6.
    const M_PLANT = [
      "....GG......",
      "...GllG.GG..",
      "..GlLLGGllG.",
      ".GLLLLlLLLG.",
      ".GLlGLLLGLG.",
      "GLLLGLlGLLLG",
      ".GLLLLLLLLG.",
      ".lGLLLLLLGl.",
      "..GLLGGLLG..",
      "...GLLLLG...",
      "....GllG....",
      ".....GG.....",
      ".....SS.....",
      "....XPPX....",
      "...XPppPX...",
      "...PppppP...",
      "...PppppP...",
      "...pPPPPp...",
      "....XppX....",
      ".....XX....."
    ];
    const FURN_PALS={ cushion:{X:'#4a5361',C:'#9aa4b2',D:'#79838f',L:'#c2cad4',B:'#5b6470'}, bowl:{X:'#4a5361',W:'#d0d6dd',L:'#eef1f5',D:'#aab2bc',F:'#d68b4a',f:'#b06a2e',g:'#efb37a'}, waterbowl:{X:'#4a5361',W:'#d0d6dd',L:'#eef1f5',D:'#aab2bc',A:'#5aa9e6',a:'#3f86c4',h:'#bfe2fb'}, tower:{X:'#5e3f22',P:'#8a6a3f',H:'#a5824f',W:'#c99a5f',C:'#a87c46',L:'#e6c085',R:'#e0bd82',S:'#c39a5c',T:'#d9694e',O:'#f2a98f',K:'#4a3218'}, scratcher:{X:'#5e3f22',W:'#c99a5f',C:'#a87c46',L:'#e6c085',S:'#d8b98a',R:'#b8935f',T:'#6b4a2a',O:'#d9694e',H:'#f2a98f'}, litterbox:{X:'#7a808a',W:'#c9ced6',D:'#9aa0aa',S:'#f4efe4',s:'#e7e0d0',k:'#d6ccb8'}, pethouse:{X:'#5a4632',R:'#d9694e',r:'#b8503a',H:'#f0967a',W:'#e8c98f',w:'#d4b06a',D:'#2c2420',d:'#46382c'}, plant:{X:'#7c5028',L:'#7cc652',G:'#4e9636',P:'#c8763e',p:'#a85e2c',l:'#9ad86a',S:'#6f9440'}, catwheel:{X:'#2f6f68',W:'#4fb3a6',H:'#8fe0d4',T:'#245c55',R:'#c9a06a',D:'#6b5842'} };
    const POOP_PAL={X:'#4a3218',K:'#7a5230'};
    const FOOD_PAL={F:'#d68b4a',D:'#8a5427',L:'#f2e4c6',K:'#7a4a20'};
    const WATER_PAL={A:'#5aa9e6',D:'#3f86c4',H:'#c7e6ff',L:'#eaf6ff'};
    // ---- 펫알/랜덤박스 도트 ----
    // 알: 위는 둥근 돔(꼭대기 좁게), 아래가 넓고 둥글게. 테두리는 바깥이 진한 X(#968c76), 그 안쪽에 연한 S 링 → 외곽선이 또렷·진하게(전체 통일). 중앙에 크고 두꺼운 무지개(R→P) 물음표. S=안쪽 연한 링·우측 그림자.
    const M_EGG = [
      ".....XSSX.....",
      "....XSWWSX....",
      "...XSWWWWSX...",
      "...XWWWWWWX...",
      "..XWWRRRRWWX..",
      ".XWWRRRRRRWWX.",
      ".XWWRRWWOOWWX.",
      "XWWWWWWOOOWWSX",
      "XWWWWWYYYWWWSX",
      "XWWWWGGGWWWWSX",
      "XWWWWWGGWWWWSX",
      ".XWWWWBBWWWSX.",
      ".XWWWWWWWWWSX.",
      "..XWWWPPWWWX..",
      "...XWWWWWWX...",
      "....XXXXXX...."
    ];
    // 균열1: 위쪽부터 지그재그(번개) 잔금이 생김(쩌저적 갈라짐 시작)
    const M_EGG_C1 = [
      ".....XSSX.....",
      "....XSWWSX....",
      "...XSWSWWSX...",
      "...XWXXWWWX...",
      "..XWXRRRRWWX..",
      ".XWXWRRRRRWWX.",
      ".XWXRWWWOOWWX.",
      "XWWWWXWWOOWWSX",
      "XWWWWWXWWWWWSX",
      "XWWWWGGGWWWWSX",
      "XWWWWWGGWWWWSX",
      ".XWWWWBBWWWSX.",
      ".XWWWWWWWWWSX.",
      "..XWWWPPWWWX..",
      "...XWWWWWWX...",
      "....XXXXXX...."
    ];
    // 균열2: 지그재그 금이 전체로 번지고 살짝 벌어짐(틈+빛 조금)
    const M_EGG_C2 = [
      ".....XSSX.....",
      "....XS.SSX....",
      "...XSW.WWSX...",
      "...XWWX.XWX...",
      "..XWWL.RRWWX..",
      ".XWWX.RRRRWWX.",
      ".XWWR.WWOOWWX.",
      "XWWWWX.XOOWWSX",
      "XWWWWWL.WWWWSX",
      "XWWWWWXGXWWWSX",
      "XWWWWL.GWWWWSX",
      ".XWWX.XBWWWSX.",
      ".XWWWW.WWWWSX.",
      "..XWWXPPWWWX..",
      "...XWWWWWWX...",
      "....XXXXXX...."
    ];
    // 균열3(3번째 탭): 알이 지그재그로 쩍! 크게 갈라지고, 벌어진 틈(L)으로 등급색 빛이 쏟아진다. L=빛(렌더 시 등급색).
    const M_EGG_C3 = [
      ".....XSSX.....",
      "....XS.LSX....",
      "...XSL.LWSX...",
      "...XWWL.LWX...",
      "..XWL..RRWWX..",
      ".XWL..LRRRWWX.",
      ".XWL..LWOOWWX.",
      "XWWWL..LWOWWSX",
      "XWWWWL..LWWWSX",
      "XWWWWL..LWWWSX",
      "XWWWL..GWWWWSX",
      ".XWL..LWWWWSX.",
      ".XWWL..LWWWSX.",
      "..XWWL.LWWWX..",
      "...XWL.LWWX...",
      "....XXXXXX...."
    ];
    // 🥚 깨진 껍질 조각(픽셀아트) — 흰 껍질(W)+회색 테두리(X)+안쪽 그림자(S). 오픈 순간 사방으로 튕겨나감.
    const M_SHELL_A = [ ".XXXX.","XWWWWX","XWWWWS","XWWWSS",".XWSX.","..XX.." ];
    const M_SHELL_B = [ "XXX..","WWWX.","WWWWX","SWWSX",".XXX." ];
    const M_SHELL_C = [ ".XX.","XWWX","XWSX",".XX." ];
    // ✦ 픽셀 방사 버스트(빛) — 카디널(수직·수평) 광선을 빼고 12갈래를 15°씩 어긋나게 배치(→ 십자 느낌 제거),
    //    길고 짧은 광선을 교대로 변주 + 바깥 크리스탈 스파클 도트로 화려하게. X=광선색(currentColor), H=작은 흰 코어.
    //    회전이 아니라 CSS로 살짝씩 바깥으로 퍼져나가는(발산) 연출을 준다.
    const M_RAYS = [
      ".....................",
      ".............X.......",
      ".....................",
      "...X........X........",
      "...........XX........",
      ".....XX..X.XX........",
      ".....XXX.X.X..X......",
      "......XXXX.X.X.....X.",
      ".......XXXXXX..XXX...",
      ".....XXXXXHXXXXXX....",
      "........XHHHX........",
      "....XXXXXXHXXXXX.....",
      "...XXX..XXXXXX.......",
      ".X.....X.X.XXXX......",
      "......X..X.X.XXX.....",
      "........XX.X..XX.....",
      "........XX...........",
      "........X........X...",
      ".....................",
      ".......X.............",
      "....................."
    ];
    // ✦ 픽셀 오오라(은은한 후광) — Bayer 정렬 디더링으로 중심이 밝고 밖으로 감쇠하는 대칭 도트 글로우. 펫 뒤에 은은히 깔림.
    const M_AURA = [
      ".....................",
      ".....................",
      "......X...X...X......",
      ".....................",
      "....X.X.X.X.X.X.X....",
      ".....X.X.X.X.X.......",
      "..X.X.X.X.X.X.X.X.X..",
      ".......X.X.X.X.X.....",
      "..X.X.X.XXXXXXX.X.X..",
      ".....X.X.HHH.X.X.X...",
      "..X.X.XXXHHHX.X.X.X..",
      ".....X.X.HHH.X.X.....",
      "..X.X.X.XXXXXXX.X.X..",
      ".....X.X.X.X.X.X.....",
      "..X.X.X.X.X.X.X.X.X..",
      ".......X.X.X.........",
      "....X.X.X.X.X.X.X....",
      ".........X...........",
      "......X...X...X......",
      ".....................",
      "....................."
    ];
    // ✦ 작은 4점 반짝임(트윙클) — 펫 주변에 깜빡이는 도트 별.
    const M_SPARK4 = [
      "...X...",
      "...X...",
      ".X.H.X.",
      "XXHHHXX",
      ".X.H.X.",
      "...X...",
      "...X..."
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
    // 열린 랜덤박스(오픈 연출): 뚜껑이 튀어오르고 열린 틈으로 등급색 픽셀 빛(Z)이 쏟아진다. Z=빛(렌더 시 등급색).
    const M_BOX_OPEN = [
      "...X........X...",
      "....XXCCCCXX....",
      ".....XCCCCX.....",
      "....ZZZZZZZZ....",
      "...ZZZZZZZZZZ...",
      "..XZZZZZZZZZZX..",
      ".XXZZZZZZZZZZXX.",
      ".XWWWWWWWWWWWWX.",
      ".XWWWWRRRRWWWWX.",
      ".XWWWRRWWOOWWWX.",
      ".XWWWWWWWOOWWWX.",
      ".XWWWWWGGWWWWWX.",
      ".XWWWWWBBWWWWWX.",
      ".XWWWWWWWWWWWWX.",
      ".XWWWWWPPWWWWWX.",
      ".XXXXXXXXXXXXXX."
    ];
    const EGG_PAL={X:'#968c76',W:'#FBFBFD',S:'#d2ccbe',R:'RAINBOW',O:'RAINBOW',Y:'RAINBOW',G:'RAINBOW',B:'RAINBOW',P:'RAINBOW'};   // X=바깥 진한 테두리, S=안쪽 연한 링(스왑)
    const BOX_PAL={X:'#b9c0cb',W:'#FBFBFD',C:'#cdd5e4',L:'#b7c0d4',R:'RAINBOW',O:'RAINBOW',Y:'RAINBOW',G:'RAINBOW',B:'RAINBOW',P:'RAINBOW'};
    // 무지개알/무지개박스: 껍질(W)·윗면(C·L)·완화픽셀(S)을 통째로 RAINBOW(pxSvg의 움직이는 세로 무지개 그라디언트),
    // 물음표(R/O/Y/G/B/P)는 흰색으로 대비, 외곽(X)은 은은한 중립색 → "온몸이 움직이는 무지개빛"인 알/상자.
    const EGG_PAL_RB={X:'#968c76',W:'RAINBOW',S:'RAINBOW',R:'#FBFBFD',O:'#FBFBFD',Y:'#FBFBFD',G:'#FBFBFD',B:'#FBFBFD',P:'#FBFBFD'};   // 무지개알도 바깥 진한 테두리
    const BOX_PAL_RB={X:'#9aa2b0',W:'RAINBOW',C:'RAINBOW',L:'RAINBOW',R:'#FBFBFD',O:'#FBFBFD',Y:'#FBFBFD',G:'#FBFBFD',B:'#FBFBFD',P:'#FBFBFD'};

    // 카탈로그(코드 상수) — 저장은 보유 id만. id는 종·색 구분(예: cat_calico, dog_corgi), species는 분류/필터용.
    // 새 동물(네발 짐승) 처리 규칙은 docs/pet-asset-pipeline.md 참고.
    // 가격(은화)은 등급·확률에 맞춰 재산정 — 등급이 오를수록 대략 2배씩(TIER_PRICE 참고).
    // 알(펫알) 100은화로 열면 금화+1·중복은 그 펫 가격의 20% 환급이라, 흔한 등급은 알보다 싸게·희귀는 알보다 비싸게 잡아
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
      { id:'cat_chaos', species:'cat', name:'카오스', price:200, desc:'다크그레이+브라운 소용돌이 무늬. 종잡을 수 없이 쏘다녀요.' },
      { id:'cat_siamese', species:'cat', name:'샴', price:800, desc:'크림빛 몸에 짙은 포인트. 우아하게 방을 누벼요.' },
      { id:'cat_bengal', species:'cat', name:'황토', price:100, desc:'골든빛 몸에 동글동글 반점. 야무지게 돌아다녀요.' },
      { id:'cat_fold', species:'cat', name:'폴드', price:200, desc:'접힌 귀가 매력. 얌전히 자리를 지켜요.' },
      { id:'cat_bora', species:'cat', name:'보라', price:400, desc:'한쪽은 파랑·한쪽은 호박색 오드아이. 신비롭게 거닐어요.' },
      { id:'cat_choco', species:'cat', name:'초코', price:100, desc:'초콜릿빛 갈색 털에 크림색 입가·가슴. 느긋하게 방을 거닐어요.' },
      { id:'cat_kitten', species:'cat', name:'아깽이', price:50, desc:'치즈빛 오렌지 태비 아기고양이. 뒤뚱뒤뚱 방을 쏘다녀요.' },
      { id:'cat_pink', species:'cat', name:'스핑크스', price:800, desc:'털 없는 분홍빛 주름 피부. 도도하게 방을 누벼요.' },
      { id:'tiger_orange', species:'tiger', name:'고랑이', price:1500, desc:'볼드한 검은 줄무늬의 오렌지 호랑이. 위풍당당하게 방을 누벼요.' },
      { id:'lion_mane', species:'lion', name:'갈기냥', price:1500, desc:'풍성한 갈기의 황금빛 사자. 위풍당당하게 방을 거닐어요.' },
      { id:'cat_persian', species:'cat', name:'펠시안', price:400, desc:'납작한 얼굴에 복슬복슬 긴 털. 우아하게 방을 누벼요.' },
      { id:'tiger_white', species:'tiger', name:'백호', price:1500, desc:'푸른 눈의 새하얀 호랑이. 늠름하게 방을 누벼요.' },
      { id:'cat_russianblue', species:'cat', name:'러시안블루', price:400, desc:'은청빛 짧은 털에 초록 눈. 조용히 방을 거닐어요.' },
      { id:'cat_bengal2', species:'cat', name:'벵갈', price:800, desc:'야생미 물씬 로제트 무늬. 날렵하게 방을 쏘다녀요.' }
    ];
    // @gen:end
    // 종(species) → 알뜰샵 분류 라벨. 품종(샴·벵갈 등)은 표시하지 않고 종만 노출.
    const SPECIES_LABEL = { cat:'고양이', dog:'강아지', rabbit:'토끼', tiger:'호랑이', lion:'사자' };
    function speciesLabel(id){ const c=PET_CATALOG.find(x=>x.id===id); return (c&&SPECIES_LABEL[c.species])||'펫'; }
    // 구 id(고양이 전용 시절) → 신 id. RTDB 보유/활성 데이터 하위호환(normalizeGame에서 적용).
    // 구 id→신 id 매핑(수동 유지, @gen 마커 밖). 런타임 펫 정적 승격 시 tools/pet_maint.mjs(apply) 가 아래 앵커 앞에 rt_xxx:'static_id' 를 자동 삽입한다.
    const PET_ID_MIGRATE = { mackerel:'cat_mackerel', cheese:'cat_cheese', calico:'cat_calico', black:'cat_black', white:'cat_white',
      rt_mr3n1k85:'lion_mane', rt_mr3n6laq:'cat_persian', rt_mr3nx5r4:'tiger_white', rt_mr3nyl3p:'cat_russianblue', rt_mr3ocsnm:'cat_bengal2', /* @rtmigrate */ };
    // size = 표시 배율(1=기본, 팔레트 아이콘 크기에 반영). footW×footH = 배치 격자 점유(가로×세로 칸). 캣타워=1×2, 스크래처=1×1, 화장실=1×1(정사각), 방석·밥그릇=1×1(작게, 밥그릇<방석). itemFoot()/furnScale()로 배치·팔레트에 반영.
    const ITEM_CATALOG = [
      { id:'cushion', name:'방석',   price:15, size:0.6,  footW:1, footH:1, desc:'고양이가 위에 잠시 올라가 쉬어요.' },
      { id:'bowl',    name:'밥그릇', price:20, size:0.45, footW:1, footH:1, desc:'홈에서 탭해 사료를 채워요(3시간 뒤 비워짐).' },
      { id:'waterbowl', name:'물그릇', price:20, size:0.45, footW:1, footH:1, desc:'홈에서 탭해 물을 채워요(3시간 뒤 비워짐).' },
      { id:'tower',   name:'캣타워', price:35, size:2,    footW:1, footH:2, desc:'3층 발판 — 한 층에 올라가 쉬어요.' },
      { id:'scratcher', name:'스크래처', price:18, size:2, footW:1, footH:1, desc:'옆에서 잠시 머물며 발톱을 갈아요.' },
      { id:'litterbox', name:'화장실', price:25, size:1, footW:1, footH:1, desc:'비운 그릇 수만큼 똥이 쌓여요. 탭해 치우면 은화!' },
      { id:'pethouse', name:'펫하우스', price:45, size:2, footW:2, footH:2, desc:'펫이 안에 들어가 정면을 보며 아늑하게 쉬어요.' },
      { id:'catwheel', name:'캣휠', price:60, size:2, footW:2, footH:2, desc:'고양이가 안에서 달리며 운동하는 러닝휠.' },
      { id:'plant',    name:'화분',   price:22, size:1, footW:1, footH:2, desc:'초록 화분. 고양이가 곁에서 잠시 쉬어요.' }
    ];
    // 소비 아이템(배치 불가) — 홈에서 밥그릇/물그릇을 탭해 채울 때 소모. 알뜰샵 "소비" 탭에서 구매.
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
      { id:'peach',   name:'살구',  price:20, css:'linear-gradient(180deg,#ffe4cf 0%,#fff4ea 100%)' },
      { id:'sunset',  name:'노을',  price:30, css:'linear-gradient(180deg,#ffd0a6 0%,#ffb3c9 100%)' },
      { id:'forest',  name:'숲',    price:25, css:'linear-gradient(180deg,#bfe6c0 0%,#eaf6e2 100%)' },
      { id:'ocean',   name:'바다',  price:25, css:'linear-gradient(180deg,#a6d8ef 0%,#d9f0f5 100%)' },
      { id:'lavender',name:'라벤더',price:30, css:'linear-gradient(180deg,#e0d0f5 0%,#f3ecfb 100%)' }
    ];
    function wallCss(id){ const w=WALLPAPER_CATALOG.find(x=>x.id===id); return (w||WALLPAPER_CATALOG[0]).css; }
    function ownsWall(id){ return id==='default' || !!(state.game&&state.game.owned.wallpapers[id]); }
    // ---- 여러 방(프리셋) 접근자 — 모든 방별 읽기/쓰기는 반드시 이 헬퍼를 거친다(현재 방 기준). ----
    function homeH(){ return (state.game&&state.game.home)||{ rooms:[{active:[],placed:{},wallpaper:'default',poops:0,name:'방 1'}], current:0, roomSlots:BASE_ROOMS, slots:BASE_SLOTS }; }
    function roomCount(){ return Math.min(MAX_ROOMS, Math.max(BASE_ROOMS, (homeH().roomSlots)||BASE_ROOMS)); }   // 열린 방 수
    function roomIdx(){ const h=homeH(); const n=(h.rooms&&h.rooms.length)||1; return Math.min(n-1, Math.max(0, h.current|0)); }   // 현재 방 인덱스(클램프)
    function room(){ const h=homeH(); return (h.rooms&&h.rooms[roomIdx()])||{ active:[], placed:{}, wallpaper:'default', poops:0, name:'방 1' }; }   // 현재 방 객체
    function roomChild(sub){ return 'home/rooms/'+roomIdx()+'/'+sub; }   // 현재 방 하위 쓰기 경로
    function gRoom(g){ return g.home.rooms[g.home.current|0]||g.home.rooms[0]; }   // 트랜잭션 내부(normalizeGame 후)에서 현재 방 객체
    // 레거시 flat home(단일 방) → rooms 구조로 1회 영구 이관. 안 하면 첫 방별 쓰기에서 flat 가구/벽지가 유실됨.
    function migrateHomeRoomsIfNeeded(raw){
      if(!state.uid) return;
      const h=raw&&raw.home;
      if(!h || Array.isArray(h.rooms)) return;   // 신규 구조거나 home 없음(신규 유저는 이관 불필요)
      if(!(h.placed || (h.active&&h.active.length) || h.wallpaper || h.poops)) return;   // 옮길 flat 데이터 없음
      if(state._homeMigrating) return; state._homeMigrating=true;   // 로컬 중복 방지
      // 트랜잭션으로 race-safe: 그새 다른 기기가 이미 rooms화했으면 건너뜀. flat 키는 제거하고 rooms로 이관.
      gameRef().child('home').transaction(cur=>{
        if(cur && Array.isArray(cur.rooms)) return;   // 이미 이관됨 → 변경 없음(abort)
        const nh=normalizeHome(cur, HOME_OPTS);
        return { rooms:nh.rooms, current:nh.current, showRoom:nh.showRoom, roomSlots:nh.roomSlots, slots:nh.slots, changedAt:nh.changedAt||new Date().toISOString() };
      }).catch(()=>{}).then(()=>{ state._homeMigrating=false; });
    }
    function currentWall(){ return room().wallpaper||'default'; }
    // 미션 정의(일일). reward=은화. check(ctx)=완료 여부(현재 워크스페이스 활동 읽어 판정)
    const DAILY_MISSIONS = [
      { id:'record', period:'day', name:'오늘 1건 추가', reward:5, icon:'<path d="M12 4v16M8 8l4-4 4 4"/><rect x="4" y="18" width="16" height="3" rx="1"/>',
        // 가계부(거래) 또는 할일 중 아무거나 오늘 1건 등록하면 완료
        check:()=> (state.transactions||[]).some(t=>(t.date||'').slice(0,10)===kstDayKey())
          || ((state.todos||[]).concat(state.myTodos||[])).some(t=>(t.createdAt||'').slice(0,10)===kstDayKey()) },
      { id:'attend', period:'day', name:'출석 체크', reward:2, icon:'<path d="M5 12l4 4L19 6"/>',
        check:()=> true }   // 앱 진입 = 완료(멱등 수령)
    ];
    const WEEKLY_MISSIONS = [
      { id:'week5', gold:2, period:'week', name:'이번 주 5일 이상 기록', reward:20, icon:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
        prog:()=> recordDaysThisWeek()+' / 5일', check:()=> recordDaysThisWeek()>=5 },
      { id:'report', gold:1, period:'week', name:'리포트 확인', reward:10, icon:'<path d="M5 20V11M12 20V5M19 20v-6"/>',
        check:()=> reportSeenThisWeek() }
    ];
    // 월간 챌린지(period:'month'). 매월 1일(KST) 초기화. 큰 금화 공급원 — 꾸준함 보상.
    const MONTHLY_MISSIONS = [
      { id:'mon_days', gold:8, period:'month', name:'이번 달 15일 기록', reward:80, icon:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4M8 14h2M14 14h2"/>',
        prog:()=> recordDaysThisMonth()+' / 15일', check:()=> recordDaysThisMonth()>=15 },
      { id:'mon_tx', gold:5, period:'month', name:'이번 달 거래 25건', reward:50, icon:'<path d="M4 7h16M4 12h16M4 17h10"/>',
        prog:()=> Math.min(txThisMonth().length,25)+' / 25건', check:()=> txThisMonth().length>=25 }
    ];
    // 업적(1회성). period:'once' → 영구 저장(초기화 없음). 앱 기능을 써보게 유도하고 은화 보상.
    const ACHIEVEMENTS = [
      { id:'ach_first',  period:'once', name:'첫 거래 기록',        reward:10, icon:'<path d="M12 4v16M8 8l4-4 4 4"/>', check:()=> (state.transactions||[]).length>0 },
      { id:'ach_cats3', gold:3,  period:'once', name:'고양이 3마리 모으기', reward:30, icon:'<circle cx="9" cy="11" r="2.5"/><circle cx="15" cy="11" r="2.5"/><path d="M4 20c0-3 2.5-5 8-5s8 2 8 5"/>', check:()=> Object.keys((state.game&&state.game.owned&&state.game.owned.cats)||{}).length>=3 },
      { id:'ach_cats10', gold:5, period:'once', name:'고양이 10마리 모으기', reward:50, icon:'<circle cx="9" cy="11" r="2.5"/><circle cx="15" cy="11" r="2.5"/><path d="M4 20c0-3 2.5-5 8-5s8 2 8 5"/>', check:()=> Object.keys(ownedCatsMap()).length>=10 },
      { id:'ach_dexall', gold:30, period:'once', name:'도감 완성(전종 수집)', reward:200, icon:'<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><path d="M13 16l2 2 4-4"/>', check:()=> dexProgress(ownedCatsMap(), PET_CATALOG.map(c=>c.id)).pct>=100 },
      { id:'ach_travel', period:'once', name:'여행 가계부 만들기',  reward:20, icon:'<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/>', check:()=> (state.purposeBooks||[]).some(p=>p.type==='travel'||p.type==='gathering') },
      { id:'ach_fx',     period:'once', name:'해외통화로 첫 지출',  reward:20, icon:'<circle cx="12" cy="12" r="9"/><path d="M9 9h6M9 15h6M12 6v12"/>', check:()=> (state.transactions||[]).some(t=>t.currency&&t.currency!=='KRW') },
      { id:'ach_budget', period:'once', name:'첫 예산 설정',        reward:15, icon:'<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 12h8"/>', check:()=> (state.budgets||[]).length>0 },
      { id:'ach_settle', gold:2, period:'once', name:'첫 정산 거래',        reward:25, icon:'<path d="M7 8h10M7 12h10M7 16h6"/>', check:()=> (state.transactions||[]).some(t=>t.settlementIncluded===true) },
      { id:'ach_todo1',  period:'once', name:'첫 할일 완료',        reward:10, icon:'<circle cx="12" cy="12" r="9"/><path d="M8 12.4l2.7 2.7L16.5 9"/>', check:()=> ((state.todos||[]).concat(state.myTodos||[])).some(t=>t.rewardClaimed||t.done) },
      { id:'ach_todo10', gold:3, period:'once', name:'할일 10개 완료',      reward:30, icon:'<path d="M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17M12 6h8M12 12h8M12 18h8"/>', check:()=> ((state.todos||[]).concat(state.myTodos||[])).filter(t=>t.rewardClaimed).length>=10 },
      { id:'ach_custom1', period:'once', name:'첫 내 미션 만들기',   reward:10, icon:'<path d="M12 5v14M5 12h14"/>', check:()=> Object.keys((state.game&&state.game.customMissions)||{}).length>0 },
      { id:'ach_custom7', gold:3, period:'once', name:'내 미션 7일 연속',    reward:30, icon:'<path d="M12 3s5 4 5 9a5 5 0 1 1-10 0c0-2 1-3.5 2-4 0 2 1 3 2 3 0-3 -1-6 -1-8z"/>', check:()=> (typeof customMissionList==='function') && customMissionList().some(m=> missionStreak(missionLogDoneDates(m.id), kstDayKey()).best>=7 ) }
    ];
    const ALL_MISSIONS = DAILY_MISSIONS.concat(WEEKLY_MISSIONS).concat(MONTHLY_MISSIONS).concat(ACHIEVEMENTS);

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
    // 정지 4방향 PNG의 폴더 = walk.png 경로에서 파생(단일 소스). 종별 하위폴더(assets/pets/<species>/<id>/)가 walk 경로에 이미 들어있어 함께 반영된다.
    function sprStills(id){ const sp=PET_SPRITES[id]; return (sp&&sp.walk) ? sp.walk.replace(/\/walk\.png$/,'') : 'assets/pets/'+id; }
    const _BLANK_PX='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';   // 1×1 투명 — 아트 로딩 전 깨진 img 방지
    // 런타임(앱에서 업로드) 펫은 이미지가 data URL(PET_SPRITES[id].urls)에 들어있어 파일 경로 대신 그걸 쓴다.
    // 아트 분리 저장(catalogPetArt) → 지연 로딩 전(sp.needArt)에는 파일 경로가 없으므로 투명 픽셀을 준다(로드되면 재렌더로 교체).
    function sprStill(id, face){ const sp=PET_SPRITES[id]; if(sp&&sp.urls&&sp.urls[face]) return sp.urls[face]; if(sp&&sp.runtime&&sp.needArt) return _BLANK_PX; return assetUrl(sprStills(id)+'/'+face+'.png'); }
    function sprWalkUrl(sp){ if(sp&&sp.urls&&sp.urls.walk) return sp.urls.walk; if(sp&&sp.runtime&&sp.needArt) return _BLANK_PX; return assetUrl(sp.walk); }
    // 런타임 펫 아트가 아직 안 온 동안 보여줄 플레이스홀더(도트 알). 준비되면 catFace/catActorHTML가 실제 스프라이트로 교체.
    function _petPlaceholder(s){ return '<span class="petph" style="width:'+s+'px;height:'+s+'px;display:inline-flex;align-items:flex-end;justify-content:center;overflow:hidden;">'+eggSvg(0,{h:Math.round(s*0.72)})+'</span>'; }
    // @gen:pet-sprites — 자동생성(tools/build_pets.py). tools/pets.json 편집 후 재실행.
    const PET_SPRITES = {
      cat_mackerel:{ walk:'assets/pets/cat/cat_mackerel/walk.png', frames:6, stills:true },
      cat_cheese:{ walk:'assets/pets/cat/cat_cheese/walk.png', frames:6, stills:true },
      cat_calico:{ walk:'assets/pets/cat/cat_calico/walk.png', frames:6, stills:true },
      cat_black:{ walk:'assets/pets/cat/cat_black/walk.png', frames:6, stills:true },
      cat_white:{ walk:'assets/pets/cat/cat_white/walk.png', frames:6, stills:true },
      cat_fluffy:{ walk:'assets/pets/cat/cat_fluffy/walk.png', frames:6, stills:true },
      cat_tuxedo:{ walk:'assets/pets/cat/cat_tuxedo/walk.png', frames:6, stills:true },
      cat_chaos:{ walk:'assets/pets/cat/cat_chaos/walk.png', frames:6, stills:true },
      cat_siamese:{ walk:'assets/pets/cat/cat_siamese/walk.png', frames:6, stills:true },
      cat_bengal:{ walk:'assets/pets/cat/cat_bengal/walk.png', frames:6, stills:true },
      cat_fold:{ walk:'assets/pets/cat/cat_fold/walk.png', frames:6, stills:true },
      cat_bora:{ walk:'assets/pets/cat/cat_bora/walk.png', frames:6, stills:true },
      cat_choco:{ walk:'assets/pets/cat/cat_choco/walk.png', frames:6, stills:true },
      cat_kitten:{ walk:'assets/pets/cat/cat_kitten/walk.png', frames:6, stills:true, scale:0.5 },
      cat_pink:{ walk:'assets/pets/cat/cat_pink/walk.png', frames:6, stills:true },
      tiger_orange:{ walk:'assets/pets/tiger/tiger_orange/walk.png', frames:6, stills:true, scale:5 },
      lion_mane:{ walk:'assets/pets/lion/lion_mane/walk.png', frames:6, stills:true, scale:5 },
      cat_persian:{ walk:'assets/pets/cat/cat_persian/walk.png', frames:6, stills:true },
      tiger_white:{ walk:'assets/pets/tiger/tiger_white/walk.png', frames:6, stills:true, scale:5 },
      cat_russianblue:{ walk:'assets/pets/cat/cat_russianblue/walk.png', frames:6, stills:true },
      cat_bengal2:{ walk:'assets/pets/cat/cat_bengal2/walk.png', frames:6, stills:true }
    };
    // @gen:end
    function hasSprite(id){ return !!PET_SPRITES[id]; }
    // 펫별 크기 배율(고양이=1.0 기준). PET_SPRITES[id].scale 로 생성(tools/pets.json 의 scale). 예: 호랑이 5, 곰 4, 강아지 1.5, 토끼 0.8.
    function petScale(id){ const sp=PET_SPRITES[id]; const s=sp&&Number(sp.scale); return (s&&s>0)?s:1; }
    // 걷는 무대(dock 방·홈 방)에서 실제 렌더 높이(px). base=고양이 기준, cap=무대에 맞춘 상한(큰 동물도 방 밖으로 안 나가게), floor=최소.
    function petActorPx(id, base, cap){ const raw=base*petScale(id); const lo=Math.round(base*0.55); return Math.max(lo, Math.min(Math.round(raw), cap)); }
    // 걷기 무대 액터 1개의 내부 마크업 — 시트 있으면 스프라이트 div, 없으면 SVG 프레임0.
    // reduced-motion이면 처음부터 정지 이미지(south=앞)로 고정.
    function catActorHTML(id, h){
      const sp=PET_SPRITES[id];
      if(sp){ ensurePetArt(id); if(sp.runtime && !sp.urls) return _petPlaceholder(Math.round(h));   // 아트 지연 로딩 중이면 도트 알
        const s=Math.round(h); const rm=reducedMotion(); const fw=sp.frontWalk;
        // frontWalk 고양이는 walk.png가 정면이라 걷기 시트를 애니메이션하지 않고 항상 정지 스틸(.idle)로 둔다.
        //  - 이동 중엔 east(옆) 스틸을 보여주고 scaleX로 방향을 뒤집음, 정지/reduced-motion이면 south(정면).
        const idleOn = rm || fw;
        const face = (fw && !rm) ? 'east' : 'south';
        return '<div class="cspr'+(idleOn?' idle':'')+'" style="width:'+s+'px;height:'+s+'px;--sheet:url('+sprWalkUrl(sp)+');--idle:url('+sprStill(id,face)+');--fw:'+(s*sp.frames)+'px;"><i class="csprf"></i></div>'; }
      return catSide(id, 0, {h:h});
    }
    // 정면 썸네일(걷지 않는 표시용: 알뜰샵 카드·보유 칩·뽑기 결과 등).
    // 스프라이트 고양이는 south(정면) PNG, 없으면 SVG 매트릭스로 자동 분기.
    // ★ 고양이를 추가/수정할 땐 정면 표시는 반드시 catFace를 거쳐야 dock·방·알뜰샵·보유목록·뽑기 어디서나 같은 아트가 나온다.
    function catFace(id, opt){ opt=opt||{}; const h=opt.h||48;
      if(hasSprite(id)){ const sp=PET_SPRITES[id]; ensurePetArt(id); const s=Math.round(h);
        if(sp.runtime && !sp.urls) return _petPlaceholder(s);   // 아트 지연 로딩 중이면 도트 알
        // opt.eager=즉시 로딩(뽑기 등장처럼 '바로 보여야' 하는 곳). 기본은 lazy(카드·그리드 성능). lazy면 갓 삽입된 이미지를 브라우저가 늦게 불러 등장이 ~1초 지연됨.
        return '<img class="catpx" src="'+sprStill(id,'south')+'" alt="" width="'+s+'" height="'+s+'"'+(opt.eager?' decoding="sync"':' loading="lazy"')+'>'; }
      return catFront(id, opt); }
    const POSE_M = { sit:M_CAT_SIT, loaf:M_CAT_LOAF, sleep:M_CAT_SLEEP };
    function catPose(id, pose, opt){ return pxSvg(POSE_M[pose]||M_CAT_SIDE_A, CAT_PALS[id], opt); }
    function coinSvg(opt){ return pxSvg(M_COIN, COIN_PAL, opt); }
    function goldSvg(opt){ return pxSvg(M_COIN, GOLD_PAL, opt); }
    function eggSvg(stage, opt){ return pxSvg(stage>=2?M_EGG_C2:(stage>=1?M_EGG_C1:M_EGG), EGG_PAL, opt); }
    function boxSvg(opt){ return pxSvg(M_BOX, BOX_PAL, opt); }
    // 무지개알/무지개박스 — 기존 알/상자 도트에 움직이는 무지개 채색(반짝임은 CSS .fx-rainbow/.rb-thumb).
    function rainbowEggSvg(opt){ return pxSvg(M_EGG, EGG_PAL_RB, opt); }
    function rainbowBoxSvg(opt){ return pxSvg(M_BOX, BOX_PAL_RB, opt); }
    function rainbowEggStage(stage, opt){ return pxSvg([M_EGG,M_EGG_C1,M_EGG_C2][stage]||M_EGG, EGG_PAL_RB, opt); }
    // 3번째 탭: 크게 갈라진 알 + 틈새로 새어나오는 등급색 빛(L=등급색). rainbow면 껍질은 무지갯빛 유지.
    function eggCrackSvg(tierColor, rainbow, opt){ const pal=Object.assign({}, rainbow?EGG_PAL_RB:EGG_PAL, {L:tierColor||'#FBFBFD'}); if(rainbow) pal.X='RAINBOW'; return pxSvg(M_EGG_C3, pal, opt); }   // 무지개알 열 때: 테두리(X)까지 무지개색
    // 픽셀 껍질 조각 렌더(A=큰 곡면, B=삼각, C=작은 조각). rainbow면 무지갯빛 껍질.
    const SHELL_PAL={X:'#968c76',W:'#FBFBFD',S:'#d2ccbe'};   // 껍질 조각도 진한 테두리(알과 통일)
    const SHELL_PAL_RB={X:'#968c76',W:'RAINBOW',S:'RAINBOW'};
    function shellSvg(which, rainbow, opt){ const M=[M_SHELL_A,M_SHELL_B,M_SHELL_C][which]||M_SHELL_A; return pxSvg(M, rainbow?SHELL_PAL_RB:SHELL_PAL, opt); }
    // ✦ 픽셀 빛 폭발(별) — 등급색으로. color 미지정 시 currentColor(무대 등급색 상속).
    function raysSvg(color, opt){ return pxSvg(M_RAYS, {X:color||'currentColor',H:'#ffffff'}, opt); }
    function auraSvg(color, opt){ return pxSvg(M_AURA, {X:color||'currentColor',H:'#ffffff'}, opt); }
    function spark4Svg(color, opt){ return pxSvg(M_SPARK4, {X:color||'currentColor',H:'#ffffff'}, opt); }   // 뽑기 트윙클용(색 지정 4점 별). 아이콘용 sparkSvg(opt)와 구분.
    // 층층 픽셀 빛: 은은한 오오라 + 서로 반대로 도는 광선 2겹(그냥 회전만 하지 않고 맥동·역회전으로 살아있게). 색은 currentColor(등급색) 상속.
    function lightLayers(o){ o=o||{}; const a=o.aura||200, r=o.rays||240;
      return '<span class="ll-aura">'+auraSvg('currentColor',{h:a})+'</span>'+
             '<span class="ll-rays a">'+raysSvg('currentColor',{h:r})+'</span>'+
             '<span class="ll-rays b">'+raysSvg('currentColor',{h:Math.round(r*0.72)})+'</span>'; }
    // 펫 주변을 도는 트윙클 도트 — 등장 후 펫 둘레에 은은히 깜빡이며 흩뿌려짐(등급색).
    function fxAuraTwinkles(n){ n=n||6; let s='';
      for(let i=0;i<n;i++){ const a=(i/n)*360+Math.random()*24, d=52+Math.random()*30;
        const x=Math.round(Math.cos(a*Math.PI/180)*d), y=Math.round(Math.sin(a*Math.PI/180)*d);
        const h=12+Math.round(Math.random()*8), del=(Math.random()*1.1).toFixed(2), du=(1.1+Math.random()*0.7).toFixed(2);
        s+='<span class="fx-tw" style="--tx:'+x+'px;--ty:'+y+'px;animation-delay:'+del+'s;animation-duration:'+du+'s">'+spark4Svg('currentColor',{h:h})+'</span>'; }
      return s; }
    // 랜덤박스 오픈: 뚜껑 열리고 틈새로 등급색 빛(Z). rainbow면 몸체는 무지갯빛 유지.
    function boxOpenSvg(tierColor, rainbow, opt){ const pal=Object.assign({}, rainbow?BOX_PAL_RB:BOX_PAL, {Z:tierColor||'#FBFBFD'}); return pxSvg(M_BOX_OPEN, pal, opt); }
    // 🎁 선물함 아이콘 — 리본을 정갈하게 묶은 선물상자(도트). X=진빨강 테두리, B=빨강 몸체, L=뚜껑(밝은), R=금 리본, Y=리본 하이라이트/뚜껑선.
    const M_GIFT = [
      "................",
      "....RR....RR....",
      "...RYYR..RYYR...",
      "...RRRR..RRRR...",
      "....RRRRRRRR....",
      "..XXXXXXXXXXXX..",
      "..XLLLLYRLLLLX..",
      "..XXXXXYRXXXXX..",
      "..XBBBBYRBBBBX..",
      "..XBBBBYRBBBBX..",
      "..XYYYYYYYYYYX..",
      "..XRRRRRRRRRRX..",
      "..XBBBBYRBBBBX..",
      "..XBBBBYRBBBBX..",
      "..XXXXXXXXXXXX..",
      "................"
    ];
    const GIFT_PAL={X:'#a83f52',B:'#e35d76',L:'#f0869a',R:'#f2c84b',Y:'#ffe08a'};
    function giftSvg(opt){ return pxSvg(M_GIFT, GIFT_PAL, opt); }
    // 🎒 가방(더보기) 아이콘 — 갈색 가죽 가방(플랩+버클)을 도트/픽셀 아트로. D=진갈 외곽, B=몸체, L=플랩, M=금 버클.
    const M_BAG = [
      "...DDDDD...",
      "..DD...DD..",
      ".DDDDDDDDD.",
      ".DBBBBBBBD.",
      ".DBBBBBBBD.",
      ".DLLLLLLLD.",
      ".DLLLLLLLD.",
      ".DLLMMMLLD.",
      ".DLLLLLLLD.",
      ".DDDDDDDDD.",
      "..........."
    ];
    const BAG_PAL={D:'#6e4a2a',B:'#a06a38',L:'#c88a4e',M:'#e8c85a'};
    function bagSvg(opt){ return pxSvg(M_BAG, BAG_PAL, opt); }
    // ❤️ 하트(좋아요) 픽셀 아트 — H=몸체, L=하이라이트. opt.off=회색(미좋아요).
    const M_HEART = [
      ".HH...HH.",
      "HHHHHHHHH",
      "HHLHHHHHH",
      "HHHHHHHHH",
      ".HHHHHHH.",
      "..HHHHH..",
      "...HHH...",
      "....H...."
    ];
    const HEART_PAL={H:'#F0546A',L:'#FF9DAF'}, HEART_PAL_OFF={H:'#c4cad3',L:'#dde1e7'};
    function heartSvg(opt){ opt=opt||{}; return pxSvg(M_HEART, opt.off?HEART_PAL_OFF:HEART_PAL, opt); }
    // 👥 친구(사람 둘) 픽셀 아트 — 더보기 친구 타일용. A=앞사람(하이라이트 L), B=뒷사람. 은화/좋아요와 같은 톤(몸체+하이라이트).
    const M_PEOPLE = [
      ".AAA...BBB..",
      "AAAAA.BBBBB.",
      "ALAAA.BBBBB.",
      "AAAAA.BBBBB.",
      ".AAA...BBB..",
      "............",
      "AAAAAABBBBBB",
      "AAAAAABBBBBB",
      "AAAAAABBBBBB",
      "AAAAAABBBBBB"
    ];
    const PEOPLE_PAL={A:'#4a90d9',B:'#f2a154',L:'#a9cdf0'};
    function peopleSvg(opt){ return pxSvg(M_PEOPLE, PEOPLE_PAL, opt); }
    // ⚙️ 설정(톱니) 픽셀 아트 — 청크형 8이빨 코그 + 위→아래 명암(H=하이라이트/G=몸체/S=그림자) + 둥근 구멍. 뾰족한 1px 이빨 대신 두툼한 이빨로 정돈.
    const M_GEAR = [
      ".............",
      "..HH.HHH.HH..",
      "..HH.HHH.HH..",
      "..HHHHHHHHH..",
      "..GGGGGGGGG..",
      "GGGGG...GGGGG",
      "GGGG.....GGGG",
      "GGGGG...GGGGG",
      "..GGGGGGGGG..",
      "..SSSSSSSSS..",
      "..SS.SSS.SS..",
      "..SS.SSS.SS..",
      "............."
    ];
    const GEAR_PAL={G:'#7c8698',H:'#aeb6c4',S:'#5f6875'};
    function gearSvg(opt){ return pxSvg(M_GEAR, GEAR_PAL, opt); }
    // 🔔 알림 종(픽셀) — 대칭 종 + 링 손잡이(O=구멍) + 플레어 림 + 클래퍼. B=몸체(앰버)·D=림/클래퍼·L=좌상단 하이라이트. 설정 '알림' 행 등에 사용.
    const M_BELL = [
      '.....B.....',
      '....BOB....',
      '....BBB....',
      '...LBBBB...',
      '..LBBBBBB..',
      '.LBBBBBBBB.',
      '.BBBBBBBBB.',
      'BBBBBBBBBBB',
      'BBBBBBBBBBB',
      'DDDDDDDDDDD',
      '....DDD....'
    ];
    const BELL_PAL={B:'#f7c045',D:'#d79a2a',L:'#ffe9ad',O:'#9c6a15'};
    function bellSvg(opt){ return pxSvg(M_BELL, BELL_PAL, opt); }
    // 📢 확성기(공지사항) 픽셀 — 오른쪽으로 벌어진 삼각 나팔 + 입구 테두리(M) + 금색 음파(S). R=몸체·H=하이라이트.
    // 확성기(공지·업데이트 내역) — 상세 도트: 마우스피스(하이라이트)→원뿔→벨 림→금색 사운드웨이브 2겹 + 손잡이.
    const M_MEGA = [
      "..................",
      "..........KKK.....",
      "........KKMMMK....",
      "......KKMMMMMK...S",
      "....KKMMMMMMMK.S.S",
      "..KKMHMMMMMMMK.S.S",
      ".KKMHHMMMMMMMK.S.S",
      "..KKMHMMMMMMMK.S.S",
      "....KKMMMMMMMK.S.S",
      "......KKMMMMMK...S",
      "........KKmMMK....",
      ".....GGG..KKK.....",
      "....GGG...........",
      "...GG............."
    ];
    const MEGA_PAL={K:'#7a2b1e',M:'#f06e5a',m:'#d24632',H:'#ffcdbe',S:'#e0a43c',G:'#6b5138'};
    function megaSvg(opt){ return pxSvg(M_MEGA, MEGA_PAL, opt); }
    // 📋 미션(체크리스트 클립보드) 픽셀 — 금색 집게 + 흰 종이 + 초록 체크 항목. 더보기 '미션' 진입 아이콘.
    const M_MISSION = [
      "....SSSS....",
      "....SDDS....",
      ".DDDSSSSDDD.",
      ".DWWWWWWWWD.",
      ".DWGHWLLLWD.",
      ".DWHGWLLLWD.",
      ".DWWWWWWWWD.",
      ".DWGHWLLLWD.",
      ".DWHGWLLLWD.",
      ".DWWWWWWWWD.",
      ".DWDDWLLLWD.",
      ".DWDDWLLLWD.",
      ".DWWWWWWWWD.",
      ".DDDDDDDDDD."
    ];
    const MISSION_PAL={D:'#6b6151',W:'#fbfbfd',S:'#e0a43c',G:'#4bb36b',H:'#f0fff6',L:'#cbc5b7'};
    function missionSvg(opt){ return pxSvg(M_MISSION, MISSION_PAL, opt); }
    // 🔥 불꽃(로그인 스트릭) 픽셀 — O=진주황 외곽·F=주황·Y=노랑·C=밝은 코어. 물방울 형태.
    const M_FLAME = [
      "....O....",
      "...OO....",
      "...OFO...",
      "..OFFO...",
      "..OFYFO..",
      ".OFYYFO..",
      ".OFYCYFO.",
      ".OFYCCYO.",
      ".OFYCCYFO",
      ".OFFYYFFO",
      "..OFFFFO.",
      "..OOOOO.."
    ];
    const FLAME_PAL={O:'#e0552b',F:'#f2933c',Y:'#ffc94a',C:'#fff2c0'};
    function flameSvg(opt){ return pxSvg(M_FLAME, FLAME_PAL, opt); }
    // 🎟️ 쿠폰(티켓) 픽셀 — X=진금 외곽·T=금 몸체·H=밝은 스텁창·D=가운데 점선 천공. 가로 티켓.
    const M_TICKET = [
      ".XXXXXXXXXXXXX.",
      "XTTTTTDTTTTTTTX",
      "XTHHTTTTTHHHTTX",
      "XTHHTTDTTHHHTTX",
      "XTHHTTTTTHHHTTX",
      "XTHHTTDTTHHHTTX",
      "XTHHTTTTTHHHTTX",
      "XTTTTTDTTTTTTTX",
      ".XXXXXXXXXXXXX."
    ];
    const TICKET_PAL={X:'#b9832a',T:'#f2c84b',H:'#ffe9ad',D:'#c99a34'};
    function ticketSvg(opt){ return pxSvg(M_TICKET, TICKET_PAL, opt); }
    // 🏷️ 시즌 할인(이달의 펫) 픽셀 — 금색 세일 태그(끈 구멍 O) + 큰 퍼센트(W). X=외곽·S=음영·T=몸체·H=하이라이트.
    const M_SEASON = [
      "................",
      ".......XX.......",
      "......XSSX......",
      ".....XSHHSX.....",
      "....XSHOOHSX....",
      "...XSHTOOTHSX...",
      "..XSHTTTTTTHSX..",
      ".XSHTTTTTTTTHSX.",
      "XSHTWWTTTTTWTHSX",
      "XSTTWWTTTTWTTTSX",
      "XSTTTTTTTWTTTTSX",
      "XSTTTTTTWTTTTTSX",
      "XSTTTTTWTTWWTTSX",
      "XSTTTTWTTTWWTTSX",
      ".XSTTTTTTTTTTSX.",
      "..XSSSSSSSSSSXX."
    ];
    const SEASON_PAL={X:'#8a4a12',S:'#c77f26',T:'#f2a838',H:'#ffcf72',O:'#783e0e',W:'#fffaeb'};
    function seasonSvg(opt){ return pxSvg(M_SEASON, SEASON_PAL, opt); }
    // 👑 왕관(그룹 소유자) 픽셀 아트 — 가운데 봉우리 높은 정석 왕관 + 세 끝에 컷팅 루비(L=하이라이트→R=진루비 facet) + 밴드 중앙 보석. C=금, H=금 하이라이트, D=진금 밴드.
    const M_CROWN = [
      "....LLR....",
      "....LRR....",
      "LLR.RRR.LLR",
      "LRR..R..LRR",
      "RRR.CCC.RRR",
      ".C.CCCCC.C.",
      "CCCCCCCCCCC",
      "CHHHHRHHHHC",
      "CCCCCCCCCCC",
      "DDDDDDDDDDD"
    ];
    const CROWN_PAL={C:'#F4D06B',H:'#ffe6a0',D:'#caa23a',R:'#c22f47',L:'#ff8a9c'};
    function crownSvg(opt){ return pxSvg(M_CROWN, CROWN_PAL, opt); }
    // 🏆 트로피(랭킹) 픽셀 아트 — C=컵(금), H=하이라이트, D=진금(그림자·기둥·받침).
    const M_TROPHY = [
      "D.......D",
      "DCCCCCCCD",
      ".CCHCCCC.",
      ".CCCCCCC.",
      ".CCCCCCC.",
      "..CCCCC..",
      "...CCC...",
      "....D....",
      "..DDDDD..",
      "..DDDDD.."
    ];
    const TROPHY_PAL={C:'#F4D06B',H:'#fff0b8',D:'#caa23a'};
    function trophySvg(opt){ return pxSvg(M_TROPHY, TROPHY_PAL, opt); }
    // ℹ️ 정보 픽셀 아트 — 원(I=currentColor) 안에 'i'(W=배경색으로 파냄). 안내문구 색을 그대로 상속.
    const M_INFO = [
      "...IIIII...",
      "..IIIIIII..",
      ".IIIIIIIII.",
      ".IIIWWIIII.",
      ".IIIWWIIII.",
      ".IIIIIIIII.",
      ".IIIWWIIII.",
      ".IIIWWIIII.",
      ".IIIWWIIII.",
      "..IIIIIII..",
      "...IIIII..."
    ];
    function infoSvg(opt){ return pxSvg(M_INFO, {I:'currentColor',W:'var(--primary-weak)'}, opt); }
    // 🛒 쇼핑카트 픽셀 아트 — 손잡이+바구니(사다리꼴)+다리로 연결된 바퀴. C=currentColor(안내문구 색 상속), K=바퀴(짙게).
    const M_CART = [
      "CC...........",
      ".C...........",
      ".CCCCCCCCCCC.",
      ".C.........C.",
      ".C.........C.",
      ".CC.......CC.",
      "..CCCCCCCCC..",
      "...C.....C...",
      "..KK.....KK..",
      "..KK.....KK.."
    ];
    function cartSvg(opt){ return pxSvg(M_CART, {C:'currentColor',K:'currentColor'}, opt); }
    // 📖 펫도감(책 + 고양이 발자국) 픽셀 아트 — S=책등, C=표지, P=책배(페이지), D=테두리, W=발자국(4발가락 아치 + 둥근 패드).
    const M_DEX = [
      "DDDDDDDDDDDDDD",
      "DSSCCCCCCCCCPD",
      "DSSCCCWCWCCCPD",
      "DSSCWCCCCCWCPD",
      "DSSCCCCCCCCCPD",
      "DSSCCWWWWWCCPD",
      "DSSCWWWWWWWCPD",
      "DSSCWWWWWWWCPD",
      "DSSCCWWWWWCCPD",
      "DSSCCCCCCCCCPD",
      "DSSCCCCCCCCCPD",
      "DDDDDDDDDDDDDD"
    ];
    const DEX_PAL={C:'#3a9d92',S:'#237068',P:'#f3e7c6',D:'#1c4f49',W:'#ffffff'};
    function dexSvg(opt){ return pxSvg(M_DEX, DEX_PAL, opt); }
    // 🥇 랭킹 등수 픽셀 숫자(3×5) — 메달 배지 안에 넣는 도트 숫자. color 미지정 시 currentColor.
    const M_NUM = {
      '1': [".X.","XX.",".X.",".X.","XXX"],
      '2': ["XXX","..X","XXX","X..","XXX"],
      '3': ["XXX","..X","XXX","..X","XXX"]
    };
    function numSvg(n, color, opt){ const M=M_NUM[String(n)]; if(!M) return String(n); return pxSvg(M, {X:color||'currentColor'}, opt); }
    // ✦ 반짝임(4점 스파클) 픽셀 아트 — X=색(currentColor로 등수색 상속), H=흰 하이라이트.
    const M_SPARK = [
      "...X...",
      "...X...",
      "..XXX..",
      "XXXHXXX",
      "..XXX..",
      "...X...",
      "...X..."
    ];
    const SPARK_PAL={X:'currentColor',H:'#ffffff'};
    function sparkSvg(opt){ return pxSvg(M_SPARK, SPARK_PAL, opt); }
    // 알뜰샵·팔레트·격자용 대표 아트(물그릇은 물 채운 파란 그릇으로 구분 표시)
    function furnMatrix(id){ return {cushion:M_CUSHION,bowl:M_BOWL,waterbowl:M_WATERBOWL_WATER,tower:M_TOWER,scratcher:M_SCRATCHER,litterbox:M_LITTER,pethouse:M_PETHOUSE,plant:M_PLANT,catwheel:M_CATWHEEL}[id]; }
    function furnSvg(id, opt){ return pxSvg(furnMatrix(id), FURN_PALS[id], opt); }
    // 캠 전용 연출(움직이는 부분만 오버레이로 분리해 CSS 애니메이션): 같은 매트릭스를 팔레트만 나눠 두 겹으로 그림.
    //  base=움직이는 글자 제외, fx=그 글자만 → 완벽히 겹쳐 정지 배경 + 움직이는 부품(캣휠 트레드 회전·펫알 방울 흔들림·화분 잎 살랑).
    const FURN_ANIM = {   // move=오버레이(움직이는)로 뺄 글자, type=애니메이션 종류(spin/swing/sway)
      catwheel:{ type:'spin',  move:['X','W','H','T'] },   // 링(림·밴드·하이라이트·발판) 전체가 축 중심으로 제자리 회전 — 롤러 R·스탠드 D만 정지
      tower:   { type:'swing', move:['T','O','K'] },   // 매달린 장난감 공(빨강 T·하이라이트 O)+끈(K)
      scratcher:{type:'swing', move:['T','O','H'] },   // 매달린 공(O)+하이라이트(H)+끈(T)
      plant:   { type:'sway',  move:['G','L','l'] }    // 잎만 살랑(줄기 S·화분 P/p/X는 정지)
    };
    function palPick(pal, keys, keep){ const o={}; Object.keys(pal).forEach(function(k){ const on=keys.indexOf(k)>=0; if(on===keep) o[k]=pal[k]; }); return o; }
    // 연출 있는 가구를 base+fx 두 겹 SVG로. (연출 없으면 일반 furnSvg 반환)
    function furnLiveSvg(id, opt){ const a=FURN_ANIM[id]; if(!a) return furnSvg(id, opt);
      const M=furnMatrix(id), pal=FURN_PALS[id];
      const base=pxSvg(M, palPick(pal, a.move, false), opt);           // 움직이는 글자 제외(정지 배경)
      const fx=pxSvg(M, palPick(pal, a.move, true), {fit:true});       // 그 글자만(오버레이, 부모 크기 채움)
      return '<span class="fwrap">'+base+'<span class="ffx ffx-'+a.type+' ffx-'+id+'">'+fx+'</span></span>'; }
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
    // 방(dock·홈)에서의 가구 렌더 높이(px) — 발자국 세로 칸수(footH)에 비례해 키움(캣타워 6칸=제일 큼, 스크래처 1칸=고양이 키만큼, 방석·밥그릇 1칸).
    // 고양이 상호작용(캣타워 3층 올라가기 등)이 맞아떨어지도록 렌더·엔진(fh)이 같은 값을 쓴다. depth(뒤로 갈수록) 작게.
    // 방 렌더 높이 배율(실물감) — 캣타워 제일 큼, 스크래처는 고양이 키만큼, 화장실=낮은 상자, 방석·그릇 작게.
    const ROOM_H = { tower:6.2, scratcher:1.9, pethouse:2.8, catwheel:3.0, plant:2, litterbox:1.5, cushion:1, bowl:0.6, waterbowl:0.6 };
    // 가구 그래픽 가로세로비(cols/rows) — 좌측하단 앵커라 그래픽 중앙 x = 좌측 edge + fh*aspect/2 (고양이가 가구 중앙에 서게).
    const FURN_ASPECT = { tower:0.533, scratcher:0.636, pethouse:1.05, catwheel:1.0, plant:0.6, litterbox:1.167, cushion:1.778, bowl:1.778, waterbowl:1.778 };
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
    function kstMonthKey(){ const d=new Date(Date.now()+9*3600000); return 'M'+d.toISOString().slice(0,7); }   // 이번 달(KST) 예: M2026-07
    // 이번 주(월~) 현재 워크스페이스에서 기록한 서로 다른 날 수
    function recordDaysThisWeek(){ const wk=kstWeekKey().slice(1); const days={}; (state.transactions||[]).forEach(t=>{ const d=(t.date||'').slice(0,10); if(!d) return; const kd=weekKeyOf(d); if(kd===kstWeekKey()) days[d]=1; }); return Object.keys(days).length; }
    function weekKeyOf(dateStr){ const d=new Date(dateStr+'T00:00:00Z'); const mon=(d.getUTCDay()+6)%7; d.setUTCDate(d.getUTCDate()-mon); return 'W'+d.toISOString().slice(0,10); }
    // 이번 달(KST) 거래 건수 / 기록한 서로 다른 날 수 — 월간 챌린지 판정용. kstMonthKey()='M'+YYYY-MM.
    function txThisMonth(){ const mk=kstMonthKey().slice(1); return (state.transactions||[]).filter(t=>(t.date||'').slice(0,7)===mk); }
    function recordDaysThisMonth(){ const mk=kstMonthKey().slice(1); const days={}; txThisMonth().forEach(t=>{ const d=(t.date||'').slice(0,10); if(d) days[d]=1; }); return Object.keys(days).length; }
    function reportSeenThisWeek(){ const p=(state.game&&state.game.progress[kstWeekKey()])||{}; return !!p.reportSeen; }
    function markReportSeen(){ if(!state.uid||!state.game) return; if(reportSeenThisWeek()) return; gameRef().child('progress/'+kstWeekKey()+'/reportSeen').set(true); }
    // 활성 슬롯(집에 내보내기): 기본 3, 금화 SLOT_PRICE로 1칸 확장(최대 MAX_SLOTS).
    const BASE_SLOTS=3, MAX_SLOTS=20, SLOT_PRICE=100;   // 100금화로 1칸씩 확장, 최대 20. 슬롯 행 가로 스크롤.
    const BASE_ROOMS=1, MAX_ROOMS=5, ROOM_PRICE=500;    // 방(프리셋): 500금화로 1칸씩 확장, 최대 5. 방마다 가구·벽지·펫 독립.
    const HOME_OPTS={ baseRooms:BASE_ROOMS, maxRooms:MAX_ROOMS, baseSlots:BASE_SLOTS, maxSlots:MAX_SLOTS };

    // ---- 게임 상태/경제 ----
    function gameRef(){ return db.ref('users/'+state.uid+'/game'); }
    const TODO_REWARD=2;   // 할일 완료 시 은화(할일당 1회, todos.rewardClaimed로 멱등)
    function grantTodoCoins(){ if(!state.uid) return; gameRef().transaction(function(g){ g=normalizeGame(g); g.coins=(g.coins||0)+TODO_REWARD; return g; }); }

    // ===== 내 미션(커스텀 습관) — 개인 전역 game 트리. 일일 미션 경제(멱등 체크인)에 흡수 =====
    const CUSTOM_MISSION_REWARD=2;   // (레거시) 예전 일일 보상 — 현재 미사용
    const CUSTOM_STREAK_N=7, CUSTOM_STREAK_BONUS=15;   // 내 미션: 매일 체크는 무보상, N일 연속 마일스톤마다 +BONUS 은화
    function customMissionList(){ const cm=(state.game&&state.game.customMissions)||{};
      return Object.keys(cm).map(id=>Object.assign({id},cm[id])).filter(m=>m.active!==false)
        .sort((a,b)=>(a.order||0)-(b.order||0)||String(a.createdAt||'').localeCompare(String(b.createdAt||''))); }
    function missionLogDoneDates(id){ const lg=(state.game&&state.game.missionLogs&&state.game.missionLogs[id])||{};
      return Object.keys(lg).filter(d=>lg[d]&&lg[d].done); }
    function customCheckedToday(id){ const lg=(state.game&&state.game.missionLogs&&state.game.missionLogs[id])||{}; const e=lg[kstDayKey()]; return !!(e&&e.done); }
    // 오늘 체크인 토글: 최초 done 전환 때만 은화 지급(paid 플래그로 멱등 — 해제→재체크 재지급 없음).
    function toggleCustomMissionToday(id){
      if(!state.uid) return; const day=kstDayKey(); let _cmBonus=0;
      gameRef().transaction(g=>{ g=normalizeGame(g);
        const cm=g.customMissions[id]; if(!cm||cm.active===false) return g;
        g.missionLogs[id]=g.missionLogs[id]||{};
        const cur=g.missionLogs[id][day]||null, isDone=!!(cur&&cur.done);
        if(isDone){ g.missionLogs[id][day]={ done:false, at:(cur&&cur.at)||new Date().toISOString(), bonus:(cur&&cur.bonus)||0 }; }
        else { const prevBonus=(cur&&cur.bonus)||0; g.missionLogs[id][day]={ done:true, at:new Date().toISOString(), bonus:prevBonus };
          // 매일 체크는 무보상. 오늘 done 반영 후 연속 계산 → 7일 마일스톤이고 오늘 미지급이면 보너스 1회(멱등).
          const dd=Object.keys(g.missionLogs[id]).filter(function(d){ return g.missionLogs[id][d]&&g.missionLogs[id][d].done; });
          const streak=(typeof missionStreak==='function')?missionStreak(dd, day).current:0;
          const hit=(typeof customMissionMilestone==='function')?customMissionMilestone(streak, CUSTOM_STREAK_N).hit:(streak>0&&streak%CUSTOM_STREAK_N===0);
          if(hit && !prevBonus){ g.coins=(g.coins||0)+CUSTOM_STREAK_BONUS; g.missionLogs[id][day].bonus=CUSTOM_STREAK_BONUS; _cmBonus=CUSTOM_STREAK_BONUS; } }
        return g;
      }).then(res=>{ if(res&&res.committed){ const on=customCheckedToday(id); if(on){ if(_cmBonus) toast('🔥 '+CUSTOM_STREAK_N+'일 연속! +'+_cmBonus+' 은화'); else toast('오늘 완료! 🐾'); } } });
    }
    // 내 미션 추가/수정 시트(제목만 받는 가벼운 시트)
    function openCustomMissionEdit(id){
      const cm=id?((state.game.customMissions||{})[id]):null;
      let h='<div class="field"><label>미션 이름</label><input class="input" id="cmTitle" value="'+escapeHtml((cm&&cm.title)||'')+'" placeholder="예: 물 2L 마시기" maxlength="24"></div>';
      h+='<p class="muted" style="font-size:12px;margin:2px 2px 12px;">매일 체크로 습관을 이어가고, <b>'+CUSTOM_STREAK_N+'일 연속마다 +'+CUSTOM_STREAK_BONUS+' 은화</b>. 오늘 홈·미션 탭에서 체크(최대 5개).</p>';
      h+='<p class="muted" style="font-size:11.5px;margin:-6px 2px 12px;">정해진 날짜에 반복되는 일은 <b>할일 → 반복(매주·매월)</b>으로 관리해요.</p>';
      h+='<button class="btn" onclick="saveCustomMission('+(id?("'"+id+"'"):'')+')">'+(id?'저장':'추가')+'</button>';
      if(id) h+='<button class="btn ghost" style="margin-top:8px;" onclick="deleteCustomMission(\''+id+'\')">삭제</button>';
      openSheet(id?'내 미션 수정':'내 미션 추가', h);
    }
    function saveCustomMission(id){
      const title=(val('cmTitle')||'').trim(); if(!title){ toast('이름을 입력하세요', true); return; }
      if(!id && customMissionList().length>=5){ toast('내 미션은 최대 5개까지예요', true); return; }
      if(id){ gameRef().child('customMissions/'+id+'/title').set(title); }
      else { const ref=gameRef().child('customMissions').push();
        ref.set({ title, coinReward:CUSTOM_MISSION_REWARD, active:true, createdAt:new Date().toISOString(), order:Date.now() }); }
      toast(id?'저장했어요':'내 미션을 추가했어요'); closeSheet();
    }
    function deleteCustomMission(id){ confirmSheet('이 내 미션을 삭제할까요? (기록도 함께 사라져요)', ()=>{
      gameRef().child('customMissions/'+id).remove(); gameRef().child('missionLogs/'+id).remove(); toast('삭제했어요'); closeSheet(); }); }
    // 보유(owned.cats)·활성(home.active)에 남아있는 구 id를 신 id로 이관(하위호환). 다음 쓰기 때 영구 반영.
    function migratePetIds(o){
      const m=PET_ID_MIGRATE, cats={};
      Object.keys(o.owned.cats).forEach(k=>{ cats[m[k]||k]=o.owned.cats[k]; }); o.owned.cats=cats;
      // 각 방의 active에 남은 구 id → 신 id 이관 + 방 내 중복 제거(방마다 독립).
      (o.home.rooms||[]).forEach(r=>{ const seen={}; r.active=(r.active||[]).map(k=>m[k]||k).filter(k=>{ if(seen[k]) return false; seen[k]=1; return true; }); });
      return o;
    }
    // 재화·아이템 보유 상한(넉넉). 모든 트랜잭션이 normalizeGame을 거치므로 여기서 클램프하면 전 경로에 일관 적용.
    const MAX_COINS=9999999, MAX_GOLD=999999, MAX_CONSUM=9999;
    function clampCoins(v){ return Math.min(MAX_COINS, Math.max(0, Math.floor(Number(v)||0))); }
    function clampGold(v){ return Math.min(MAX_GOLD, Math.max(0, Math.floor(Number(v)||0))); }
    function clampConsum(v){ return Math.min(MAX_CONSUM, Math.max(0, Math.floor(Number(v)||0))); }
    function atMaxCoins(){ return coins()>=MAX_COINS; }
    function atMaxGold(){ return gold()>=MAX_GOLD; }
    function maxChip(){ return ' <span class="maxchip">최대</span>'; }
    function normalizeGame(g){ g=g||{}; return migratePetIds({
      coins: clampCoins(g.coins), gold: clampGold(g.gold),
      owned:{ cats:(g.owned&&g.owned.cats)||{}, items:(g.owned&&g.owned.items)||{}, wallpapers:(g.owned&&g.owned.wallpapers)||{} },
      consum:{ food:clampConsum(g.consum&&g.consum.food), water:clampConsum(g.consum&&g.consum.water), egg:clampConsum(g.consum&&g.consum.egg), box:clampConsum(g.consum&&g.consum.box), rainbow_egg:clampConsum(g.consum&&g.consum.rainbow_egg), rainbow_box:clampConsum(g.consum&&g.consum.rainbow_box) },
      home: normalizeHome(g.home, HOME_OPTS),   // 여러 방(프리셋): rooms[]·current·roomSlots·slots·changedAt (레거시 flat 자동 이관)
      missions: g.missions||{}, progress: g.progress||{}, codes: g.codes||{},
      customMissions: g.customMissions||{},   // 내 미션(커스텀 습관): {id:{title,coinReward,active,createdAt,order}}
      missionLogs: g.missionLogs||{},          // 체크인 로그: {missionId:{'YYYY-MM-DD':{done,paid,at}}}
      streak: (g.streak && typeof g.streak==='object') ? g.streak : { last:'', count:0, best:0 },   // 로그인(출석) 연속: {last,count,best,lastReward?}
      gifts: normalizeGifts(g.gifts),   // 선물함(코드 보상 대기 목록)
      mail: (g.mail && typeof g.mail==='object') ? g.mail : {}   // 친구 선물 발신 하루 카운트 {free:{day:n},egg:{day:n}}
    }); }
    // 선물함 목록을 항상 배열로 정규화(RTDB가 객체로 돌려줄 수 있어 방어)
    function normalizeGifts(x){ if(Array.isArray(x)) return x.filter(Boolean); if(x&&typeof x==='object') return Object.keys(x).map(k=>x[k]).filter(Boolean); return []; }
    function gold(){ return clampGold((state.game&&state.game.gold)||0); }
    // 집(펫 노출·가구) 변경 시각 갱신 — 친구 스토리 무지개 링의 근거(오늘 바뀌면 링).
    function touchHome(){ try{ gameRef().child('home/changedAt').set(new Date().toISOString()); }catch(e){} }
    // ===== ❤️ 집 좋아요(하루 1회/방문자) — users/{owner}/homeLikes/{visitor}={n,last} =====
    function homeLikeCount(likes){ let n=0; const o=likes||{}; Object.keys(o).forEach(k=>{ n+=Number(o[k]&&o[k].n)||0; }); return n; }
    function likedTodayBy(likes, uid){ const e=likes&&likes[uid]; return !!(e && e.last===ymd(new Date())); }
    // 방문자가 owner 집에 좋아요(오늘 한 번). cb(ok, newCount) 콜백.
    function likeHome(ownerUid, cb){
      if(!state.uid || ownerUid===state.uid){ if(cb) cb(false); return; }
      const today=ymd(new Date());
      db.ref('users/'+ownerUid+'/homeLikes/'+state.uid).transaction(cur=>{
        if(cur && cur.last===today) return;   // 오늘 이미 → 중단
        return { n:((cur&&Number(cur.n))||0)+1, last:today };
      }).then(r=>{ if(!r) { if(cb) cb(false); return; }
        if(!r.committed){ if(cb) cb(false); return; }
        // 최신 총합을 다시 읽어 카운트 반영
        db.ref('users/'+ownerUid+'/homeLikes').once('value').then(s=>{ if(cb) cb(true, homeLikeCount(s.val())); }).catch(()=>{ if(cb) cb(true); });
      }).catch(()=>{ if(cb) cb(false); });
    }
    // 내가 받은 좋아요 총합 실시간
    function watchMyLikes(){ if(!state.uid) return; if(state._myLikesRef){ try{ state._myLikesRef.off(); }catch(e){} }
      state._myLikesRef=db.ref('users/'+state.uid+'/homeLikes');
      state._myLikesRef.on('value', s=>{ state.myLikeCount=homeLikeCount(s.val()); writeMyRanking(); if(typeof rerender==='function') rerender(); }, ()=>{}); }
    // 공개 랭킹용 경량 엔트리(소유자 유지) — 이름·좋아요수·공개여부. 좋아요 변동·프로필 저장·진입 시 갱신.
    function writeMyRanking(){ if(!state.uid) return;
      try{ db.ref('rankings/'+state.uid).set({ name:(state.userName||''), likes:(state.myLikeCount||0), private:(state.profilePublic===false), at:new Date().toISOString() }); }catch(e){}
    }
    function initCatGame(){
      if(!state.uid) return;
      if(state._gameRef){ try{ state._gameRef.off(); }catch(e){} }
      state._gameRef=gameRef();
      state._gameRef.on('value', s=>{ const raw=s.val(); state.game=normalizeGame(raw); migrateHomeRoomsIfNeeded(raw); onGameChange(); reconcilePets(); });
      watchCatalogPets();   // 런타임 펫(전역 catalogPets) 병합 리스너
      watchMyLikes();       // 내가 받은 집 좋아요 총합
      loadNotices();        // 📢 공지(config/notices) 구독 — 배포 없이 공지 갱신
      loadFeaturedPet();    // 🌟 이달의 펫 수동 선정(config/featuredPet) 구독 — 개발자가 고르면 전역 반영
      loadGachaFx();        // 🎬 가챠 오픈 연출 펫(config/gachaFx: a=1번/왼쪽·b=2번/오른쪽) 구독 — 미지정이면 기본 검은고양이
      startCatLoop();   // 통합 걷기 엔진(단일 rAF, 보이는 무대만 애니메이션)
      // 앱을 켜둔 동안에도 그릇 3시간 만료→똥 정산이 돌도록 주기 점검(다마고치)
      if(state._petTimer) clearInterval(state._petTimer);
      state._petTimer=setInterval(reconcilePets, 60000);
    }
    function onGameChange(){
      updateNewsBadge();
      const dw=$('catdock'); const wall=dw&&dw.querySelector('.cr-wall'); if(wall) wall.style.background=wallCss(currentWall());
      const rn=$('cdCamTxt'); if(rn){ rn.textContent=(room().emoji?room().emoji+' ':'')+(room().name||'우리집'); }   // dock LIVE 배지의 현재 방 이름(항상 표시)
      renderDockProps();
      renderDockCats();
      if(state.view==='home' && typeof renderHome==='function') renderHome();   // 홈의 미션·은화 즉시 반영
      refreshMoreBadges();   // 더보기 그리드 알림 뱃지(선물함·소식…)가 game 변화(선물 받기·쿠폰 사용·공지 확인)에 즉시 반영되도록
      if(state._sheetRefresh && $('sheet') && $('sheet').classList.contains('on')) state._sheetRefresh();
      writeHomeCam();   // 대표 방 공개 스냅샷 갱신(친구·랭킹이 이것만 읽음 — 다른 방은 비공개)
    }
    // 친구·랭킹에 공개할 '대표 방' 스냅샷. 사적인 다른 방은 담지 않는다.
    function repRoomSnapshot(){ const h=homeH(); const rooms=h.rooms||[]; const i=Math.min(rooms.length-1, Math.max(0, (h.showRoom!=null?h.showRoom:0)|0)); const r=rooms[i]||rooms[0]||{};
      return { name:r.name||'', emoji:r.emoji||'', wallpaper:r.wallpaper||'default', placed:r.placed||{}, active:(r.active||[]).filter(ownsCat), slots:slotCount(), poops:Number(r.poops)||0, changedAt:h.changedAt||'' }; }
    // homeCam/{uid} 에 기록(내용 바뀔 때만). users/{uid}/game 은 규칙상 소유자만 읽으므로 친구는 이 노드로만 내 집을 본다.
    function writeHomeCam(){ if(!state.uid||!state.game) return; const snap=repRoomSnapshot(); const sig=JSON.stringify(snap);
      if(sig===state._lastCamSig) return; state._lastCamSig=sig;
      try{ db.ref('homeCam/'+state.uid).set(snap); }catch(e){} }
    function coins(){ return clampCoins((state.game&&state.game.coins)||0); }
    function ownsCat(id){ return !!(state.game&&state.game.owned.cats[id]); }
    function activeCats(){ const a=room().active||[]; return a.filter(ownsCat); }   // 현재 방의 활성 펫
    function ownedCatList(){ return PET_CATALOG.filter(c=>ownsCat(c.id)).map(c=>c.id); }
    function isActiveCat(id){ return activeCats().indexOf(id)>=0; }   // 현재 방에 있는가
    // 이 펫이 있는 방 인덱스(없으면 -1). 한 펫당 한 방이라 첫 매치가 유일.
    function petRoomIndex(id){ const rooms=homeH().rooms||[]; for(let i=0;i<rooms.length;i++){ if((rooms[i].active||[]).indexOf(id)>=0) return i; } return -1; }
    // 집에 내보낼 수 있는 활성 슬롯: 기본 3, 금화 100으로 1칸 확장(최대 20). 방당 상한.
    function slotCount(){ return Math.min(MAX_SLOTS, Math.max(BASE_SLOTS, (state.game&&state.game.home.slots)||BASE_SLOTS)); }
    // 활성 토글: 현재 방에 있으면 대기로, 없으면 현재 방으로 이동(한 펫당 한 방 — 다른 방에서 자동 제거). 방당 최대 slotCount().
    function toggleActiveCat(id){
      if(!ownsCat(id)) return;
      const here=isActiveCat(id), max=slotCount(), moved=(!here && petRoomIndex(id)>=0);   // moved=다른 방에서 이동
      if(!here && activeCats().length>=max){ toast('이 방은 최대 '+max+'마리예요(슬롯 확장 가능)', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); const idx=g.home.current|0, R=g.home.rooms[idx]||g.home.rooms[0];
        const has=(R.active||[]).indexOf(id)>=0;
        if(has){ R.active=R.active.filter(x=>x!==id); }                       // 대기로
        else { if((R.active||[]).length>=max) return;                         // 재검증(가득) → abort(무변경 커밋=가짜 성공 방지)
          g.home.rooms.forEach(r=>{ r.active=(r.active||[]).filter(x=>x!==id); });   // 다른 방에서 제거(한 펫당 한 방)
          R.active.push(id); }
        g.home.changedAt=new Date().toISOString(); return g;
      }).then(r=>{ if(r&&r.committed) toast(here?catName(id)+' 대기시켰어요':(moved?catName(id)+'(을)를 이 방으로 옮겼어요':catName(id)+' 이 방에 있어요')); });
    }
    // 활성 슬롯 확장 구매(금화 SLOT_PRICE, 원자적·멱등). 첫 금화 소비처.
    function buySlot(){
      if(slotCount()>=MAX_SLOTS){ toast('이미 슬롯을 모두 열었어요'); return; }
      if(gold()<SLOT_PRICE){ toast('금화 '+(SLOT_PRICE-gold())+' 부족', true); return; }
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(g.gold<SLOT_PRICE || g.home.slots>=MAX_SLOTS) return;   // 재검증 → abort(가짜 성공 방지)
        const c=Math.min(MAX_SLOTS, Math.max(BASE_SLOTS, Number(g.home.slots)||BASE_SLOTS));
        g.gold-=SLOT_PRICE; g.home.slots=c+1;   // +1칸씩
        return g;
      }).then(res=>{ if(res.committed) toast('슬롯 +1 확장! 🐾'); });
    }
    // ---- 여러 방(프리셋): 확장(500금화)·전환·이름변경 ----
    function switchRoom(idx){ const n=roomCount(); idx=Math.min(n-1, Math.max(0, idx|0)); if(idx===roomIdx()) return;
      gameRef().child('home/current').set(idx); touchHome(); }
    // 방 확장 구매(금화 ROOM_PRICE, buySlot 미러). 새 빈 방을 rooms에 추가하고 그 방으로 전환.
    function buyRoom(){
      if(roomCount()>=MAX_ROOMS){ toast('이미 방을 모두 열었어요'); return; }
      if(gold()<ROOM_PRICE){ toast('금화 '+(ROOM_PRICE-gold())+' 부족', true); return; }
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(g.gold<ROOM_PRICE || g.home.roomSlots>=MAX_ROOMS) return;   // 재검증 → abort
        const c=Math.min(MAX_ROOMS, Math.max(BASE_ROOMS, Number(g.home.roomSlots)||BASE_ROOMS));
        g.gold-=ROOM_PRICE; g.home.roomSlots=c+1;
        g.home.rooms=g.home.rooms||[];
        while(g.home.rooms.length<g.home.roomSlots) g.home.rooms.push({ name:'방 '+(g.home.rooms.length+1), wallpaper:'default', placed:{}, active:[], poops:0 });
        g.home.current=g.home.roomSlots-1;   // 새 방으로 이동
        g.home.changedAt=new Date().toISOString();
        return g;
      }).then(res=>{ if(res.committed) toast('방 +1 확장! 🏠'); });
    }
    // 방 관리(오버레이 모달): 이름 변경 · 다른 방 벽지 가져오기 · 방 비우기.
    //  ⚠️ openSheet(알뜰홈 시트)를 교체하지 않도록 .gimenu-scrim 모달로 알뜰홈 위에 띄운다(고양이 이름짓기와 동일 패턴).
    function openRoomMenu(idx){ closeRoomMenu();
      const h=homeH(); const r=(h.rooms&&h.rooms[idx])||{}; const cur=r.name||('방 '+(idx+1)); const rc=roomCount();
      let body='<div class="gih"><b>방 관리 · '+escapeHtml(cur)+'</b></div>'+
        '<div class="field"><label for="roomNameIn">방 이름</label><input class="input" id="roomNameIn" maxlength="8" value="'+escapeHtml(cur)+'" placeholder="예: 고양이방" style="width:100%;box-sizing:border-box;"></div>'+
        '<button class="btn" onclick="saveRoomName('+idx+')">이름 저장</button>';
      // 방 이모지(선택) — 썸네일·dock 이름 앞에 표시
      const EMO=['','🐱','🐯','🦁','🐶','🌙','☀️','🌸','🎋','🛋️','🌊','⭐'];
      body+='<div class="sech" style="margin-top:14px;"><span class="l">이모지</span></div>'+
        '<div class="emopick">'+EMO.map(e=>'<button class="emob'+((r.emoji||'')===e?' on':'')+'" onclick="setRoomEmoji('+idx+',\''+e+'\')">'+(e||'없음')+'</button>').join('')+'</div>';
      // 대표 방(친구·랭킹에 보이는 방)
      const isRep=idx===(h.showRoom|0);
      body+='<div class="sech" style="margin-top:14px;"><span class="l">대표 방</span><span class="s">친구·랭킹에 보임</span></div>'+
        (isRep?'<p class="muted" style="font-size:12px;margin:0;">★ 이 방이 대표 방이에요. 친구가 내 집을 볼 때 이 방을 봅니다.</p>'
             :'<button class="btn ghost" onclick="setShowRoom('+idx+')">이 방을 대표 방으로 지정 ★</button>');
      // 순서 변경
      if(rc>1){ body+='<div class="sech" style="margin-top:14px;"><span class="l">순서 변경</span></div>'+
        '<div class="row" style="gap:8px;"><button class="btn ghost" style="flex:1;"'+(idx<=0?' disabled':'')+' onclick="moveRoom('+idx+',-1)">← 앞으로</button>'+
        '<button class="btn ghost" style="flex:1;"'+(idx>=rc-1?' disabled':'')+' onclick="moveRoom('+idx+',1)">뒤로 →</button></div>'; }
      const others=[]; for(let i=0;i<rc;i++){ if(i!==idx) others.push(i); }
      if(others.length){ body+='<div class="sech" style="margin-top:14px;"><span class="l">벽지 가져오기</span></div>'+
        '<div class="row" style="flex-wrap:wrap;gap:8px;">'+others.map(i=>{ const nm=(h.rooms[i].name)||('방 '+(i+1)); return '<button class="btn ghost" onclick="copyRoomWall('+i+','+idx+')"><span class="wsw" style="background:'+wallCss(h.rooms[i].wallpaper||'default')+'"></span>'+escapeHtml(nm)+'</button>'; }).join('')+'</div>'; }
      body+='<div class="sech" style="margin-top:14px;"><span class="l">방 비우기</span></div>'+
        '<p class="muted" style="font-size:12px;margin:0 0 8px;line-height:1.5;">이 방의 가구는 인벤토리로 돌아가고(다른 방에 다시 놓을 수 있어요), 활성 펫은 대기 상태가 됩니다.</p>'+
        '<button class="btn danger ghost" onclick="clearRoom('+idx+')">이 방 비우기</button>'+
        '<button class="btn ghost" style="margin-top:6px;" onclick="closeRoomMenu()">닫기</button>';
      const wrap=document.createElement('div'); wrap.id='roomMenu'; wrap.className='gimenu-scrim';
      wrap.onclick=function(e){ if(e.target===wrap) closeRoomMenu(); };
      wrap.innerHTML='<div class="gimenu" style="max-height:82vh;overflow-y:auto;">'+body+'</div>';
      document.body.appendChild(wrap);
      setTimeout(()=>{ const el=$('roomNameIn'); if(el){ el.focus(); el.select(); } }, 40); }
    function closeRoomMenu(){ const m=$('roomMenu'); if(m) m.remove(); }
    function openRenameRoom(idx){ openRoomMenu(idx); }   // 하위호환 별칭
    // 알뜰홈 시트가 열려 있으면 즉시 다시 그려 방 이름/벽지 변경을 반영(모달만 닫고 시트는 유지).
    function refreshCatSheet(){ if(state._sheetRefresh && $('sheet') && $('sheet').classList.contains('on')) state._sheetRefresh(); }
    function saveRoomName(idx){ const v=(val('roomNameIn')||'').trim()||('방 '+(idx+1));
      gameRef().child('home/rooms/'+idx+'/name').set(v).then(()=>{ touchHome(); refreshCatSheet(); toast('방 이름을 바꿨어요'); }); closeRoomMenu(); }
    function setRoomEmoji(idx, e){ gameRef().child('home/rooms/'+idx+'/emoji').set(e||'').then(()=>{ touchHome(); refreshCatSheet(); }); closeRoomMenu(); }
    function copyRoomWall(src, dest){ gameRef().transaction(g=>{ g=normalizeGame(g); const rs=g.home.rooms; if(!rs[src]||!rs[dest]) return g;
        rs[dest].wallpaper=rs[src].wallpaper||'default'; g.home.changedAt=new Date().toISOString(); return g;
      }).then(r=>{ if(r&&r.committed){ refreshCatSheet(); toast('벽지를 가져왔어요 🎨'); } }); closeRoomMenu(); }
    function clearRoom(idx){ closeRoomMenu();   // 모달을 먼저 닫아야 확인 시트가 보인다(모달 z-index가 더 위)
      confirmSheet('이 방의 가구·펫을 모두 비울까요? (가구는 인벤토리로 돌아가요)', ()=>{
        gameRef().transaction(g=>{ g=normalizeGame(g); const R=g.home.rooms[idx]; if(!R) return g;
          R.placed={}; R.active=[]; R.poops=0; g.home.changedAt=new Date().toISOString(); return g;
        }).then(r=>{ if(r&&r.committed) toast('방을 비웠어요'); renderCatHouse(); }); }); }   // 비운 뒤 알뜰홈으로 복귀
    function setShowRoom(idx){ gameRef().child('home/showRoom').set(idx).then(()=>{ touchHome(); refreshCatSheet(); toast('대표 방으로 지정했어요 ★'); }); closeRoomMenu(); }
    // 방 순서 이동(dir=-1 앞/+1 뒤). current·showRoom가 옮겨진 방을 따라가도록 인덱스 보정.
    function moveRoom(idx, dir){ const j=idx+dir; if(j<0||j>=roomCount()) return;
      gameRef().transaction(g=>{ g=normalizeGame(g); const rs=g.home.rooms; if(!rs[idx]||!rs[j]) return g;
        const t=rs[idx]; rs[idx]=rs[j]; rs[j]=t;
        const fix=v=>{ v=v|0; return v===idx?j:(v===j?idx:v); };
        g.home.current=fix(g.home.current); g.home.showRoom=fix(g.home.showRoom);
        g.home.changedAt=new Date().toISOString(); return g;
      }).then(r=>{ if(r&&r.committed){ refreshCatSheet(); toast('방 순서를 바꿨어요'); } }); closeRoomMenu(); }
    // 드래그 재정렬: from 방을 to 위치로 삽입 이동. current·showRoom가 원래 방을 따라가도록 remap.
    function moveRoomTo(from, to){ if(from===to) return; const rc=roomCount(); to=Math.max(0,Math.min(rc-1,to|0));
      gameRef().transaction(g=>{ g=normalizeGame(g); const rs=g.home.rooms; if(from<0||from>=rs.length||to<0||to>=rs.length) return g;
        const moved=rs.splice(from,1)[0]; rs.splice(to,0,moved);
        const remap=v=>{ v=v|0; if(v===from) return to; if(from<to){ if(v>from&&v<=to) return v-1; } else { if(v>=to&&v<from) return v+1; } return v; };
        g.home.current=remap(g.home.current); g.home.showRoom=remap(g.home.showRoom);
        g.home.changedAt=new Date().toISOString(); return g;
      }).then(r=>{ if(r&&r.committed) refreshCatSheet(); }); }
    // 방 썸네일 롱프레스 드래그로 순서 변경(짧게 탭=전환). 가구 드래그와 같은 게이트 재사용.
    let _rmDrag=null, _justRmDragged=false;
    function rmTap(idx){ if(_justRmDragged){ _justRmDragged=false; return; } switchRoom(idx); }
    function rmOthers(d){ return d.strip?Array.prototype.slice.call(d.strip.querySelectorAll('.rmthumb:not(.locked)')).filter(t=>t!==d.el):[]; }
    function rmDropTo(others, px){ let to=0; others.forEach(t=>{ const r=t.getBoundingClientRect(); if(px>r.left+r.width/2) to++; }); return to; }   // 삽입 위치(드래그 대상 제외)
    function rmShowDrop(d, px){ const others=rmOthers(d), ind=d.ind; if(!ind||!others.length) return; const to=rmDropTo(others, px);
      const ref=to<others.length?others[to]:others[others.length-1], rr=ref.getBoundingClientRect();
      ind.style.left=((to<others.length?rr.left:rr.right)-1.5)+'px'; ind.style.top=rr.top+'px'; ind.style.height=rr.height+'px'; ind.hidden=false; }
    function rmDown(e, idx){ if(roomCount()<2) return; const pid=e.pointerId;
      beginLongPress(e, (el)=>{ const ind=document.createElement('div'); ind.className='rmdropline'; ind.hidden=true; document.body.appendChild(ind);
        _rmDrag={ idx, el, strip:el.closest('.rmstrip'), sx:e.clientX, sy:e.clientY, ind };
        lockDragScroll(); try{ el.setPointerCapture(pid); }catch(_){}
        el.classList.add('rmdragging'); el.onpointermove=rmMove; el.onpointerup=rmUp; el.onpointercancel=rmUp;
      }, ()=>{}); }
    function rmMove(e){ if(!_rmDrag) return; _rmDrag.el.style.transform='translate('+(e.clientX-_rmDrag.sx)+'px,'+(e.clientY-_rmDrag.sy)+'px)'; rmShowDrop(_rmDrag, e.clientX); }
    function rmUp(e){ if(!_rmDrag) return; const d=_rmDrag; _rmDrag=null; unlockDragScroll();
      d.el.onpointermove=null; d.el.onpointerup=null; d.el.onpointercancel=null;
      d.el.classList.remove('rmdragging'); d.el.style.transform=''; if(d.ind) d.ind.remove();
      _justRmDragged=true; setTimeout(()=>{ _justRmDragged=false; }, 150);
      moveRoomTo(d.idx, rmDropTo(rmOthers(d), e.clientX)); }

    // 미션 지급(원자적·멱등): 게임 노드 트랜잭션 1회로 "수령 기록 + 은화 지급"을 동시에.
    // 같은 날 같은 미션은 이미 claimed면 변화 없음 → 중복 지급 불가.
    function missionKey(m){ return m.period==='once'?'once':(m.period==='month'?kstMonthKey():(m.period==='week'?kstWeekKey():kstDayKey())); }
    function missionClaimed(m){ const key=missionKey(m); const pd=(state.game&&state.game.missions[key])||{}; return !!(pd[m.id]&&pd[m.id].claimed); }
    function grantMission(m){
      const key=missionKey(m);
      return gameRef().transaction(g=>{
        g=normalizeGame(g);
        g.missions[key]=g.missions[key]||{};
        if(g.missions[key][m.id] && g.missions[key][m.id].claimed) return g;   // 이미 수령 → 무변화
        g.missions[key][m.id]={ claimed:true, reward:m.reward, at:new Date().toISOString() };
        g.coins += m.reward;
        if(m.gold) g.gold=(g.gold||0)+m.gold;   // 조직적 금화 획득(가챠 외 공급원)
        return g;
      });
    }
    // 프로모/치트 코드 — 보상은 곧바로 주지 않고 "선물함"으로 들어감(더보기 → 선물함에서 받기).
    // 규칙: 일반 사용자는 코드당 1회만, 개발자 계정(isDev)은 무제한. type=coins(은화) / consum(소비 아이템).
    const PROMO_CODES = {
      showmethemoney: { type:'coins',  qty:999,  label:'999 은화' },
      helloeggarden:  { type:'consum', key:'rainbow_egg', qty:1,  label:'무지개알 1개' },
      eggardentodo:   { type:'consum', key:'rainbow_box', qty:1,  label:'무지개박스 1개' },
      eggmoneyna:     { type:'consum', key:'egg',  qty:10, label:'펫알 10개' }
    };
    function redeemCode(code){
      let key=(code||'').trim().toLowerCase();
      let atUnlimited=false;
      if(key.charAt(0)==='@'){ key=key.slice(1); atUnlimited=true; }   // 코드 앞 @ = 무제한 사용(각 코드의 @버전)
      const def=PROMO_CODES[key];
      if(!def){ toast('올바르지 않은 코드예요', true); return; }
      const dev=(typeof isDev==='function' && isDev()) || atUnlimited;   // 개발자 또는 @코드 = 무제한, 일반은 1회
      let already=false;
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(!dev && g.codes[key]){ already=true; return g; }   // 일반 사용자: 이미 쓴 코드면 차단
        g.codes[key]={ at:new Date().toISOString(), n:((g.codes[key]&&Number(g.codes[key].n))||0)+1 };
        g.gifts.push({ type:def.type, key:def.key||null, qty:def.qty, code:key, at:new Date().toISOString() });   // 선물함에 적립
        return g;
      }).then(res=>{
        if(!res.committed) return;
        if(already) toast('이미 사용한 코드예요', true);
        else toast('🎁 '+def.label+' 선물 도착! 더보기 → 선물함에서 받으세요');
      });
    }
    // ===== 🎁 선물함(코드 보상 대기함) + 🎒 가방(보유 소비 아이템) =====
    function giftCount(){ return ((state.game&&state.game.gifts)||[]).length; }
    // 소비 아이템 표시 정보(아이콘·이름·사용가능 여부·사용함수)
    const CONSUM_META = {
      food:      { name:'사료',       icon:o=>consumSvg('food',o) },
      water:     { name:'물',         icon:o=>consumSvg('water',o) },
      egg:       { name:'펫알',       icon:o=>eggSvg(0,o),        use:'egg'  },   // 일반 확률 오픈
      box:       { name:'랜덤박스',   icon:o=>boxSvg(o),          use:'box'  },
      rainbow_egg:{ name:'무지개알',  icon:o=>rainbowEggSvg(o),   use:'rb_egg' },  // 특별↑ 확률 오픈
      rainbow_box:{ name:'무지개박스',icon:o=>rainbowBoxSvg(o),   use:'rb_box' }
    };
    // 선물 1건의 아이콘/이름(+선택적 메시지)
    function giftView(gf){ if(gf.type==='coins') return { icon:coinSvg({h:30}), name:(gf.qty||0).toLocaleString()+' 은화', msg:gf.msg||'' };
      if(gf.type==='gold') return { icon:goldSvg({h:30}), name:(gf.qty||1).toLocaleString()+' 금화', msg:gf.msg||'' };
      const m=CONSUM_META[gf.key]||{name:gf.key,icon:()=>''}; return { icon:m.icon({h:34}), name:m.name+' '+(gf.qty||1)+'개', msg:gf.msg||'' }; }
    // 🎉 회원가입 축하 선물 — 신규 계정 첫 진입 시 1회(멱등: users/{uid}/welcomeGift 플래그). 은화100 + 펫알1 + 축하 메시지.
    function grantWelcomeGift(){
      if(!state.uid || typeof db==='undefined' || !db) return;
      db.ref('users/'+state.uid+'/welcomeGift').transaction(cur=> cur ? undefined : true).then(r=>{
        if(!(r && r.committed && r.snapshot && r.snapshot.val()===true)) return;   // 이미 지급됐으면 중단
        const now=new Date().toISOString();
        gameRef().transaction(g=>{ g=normalizeGame(g);
          g.gifts.push({ type:'coins',  qty:100, msg:'알뜰 회원가입을 축하 선물이에요! 🎉', at:now });
          g.gifts.push({ type:'consum', key:'egg', qty:1, at:now });
          return g;
        }).then(()=>{ if(typeof toast==='function') toast('🎁 회원가입 축하 선물이 선물함에 도착했어요!'); });
      }).catch(()=>{});
    }
    function openGiftbox(){
      const build=()=>{
        const gifts=(state.game&&state.game.gifts)||[];
        const mail=mailListFlat();
        let h='<div class="giftbox">';
        if(!gifts.length && !mail.length){ h+='<div class="empty" style="padding:26px 12px;text-align:center;line-height:1.55;"><div style="display:flex;justify-content:center;margin-bottom:10px;">'+giftSvg({h:56})+'</div>받을 선물이 없어요.<br>친구 집에서 <b>응원 선물</b>을 주고받거나 설정 → 코드 입력으로 보상을 받아보세요.</div>'; }
        else {
          h+='<div class="hintline" style="margin:2px 0 10px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>받으면 은화·금화는 잔액으로, 아이템은 <b>가방</b>으로 들어가요.</div>';
          if(mail.length){
            h+='<div class="sech"><span class="l">친구가 보낸 선물</span><span class="s">'+mail.length+'개</span></div>';
            h+=mail.map(x=>{ const v=giftView(x.gf); return '<div class="giftrow"><span class="gfic">'+v.icon+'</span><span class="gftx"><b class="gfnm">'+escapeHtml(v.name)+'</b><span class="gfmsg">'+escapeHtml((x.gf.fromName||'친구')+'님이 보냄')+'</span></span><button class="buy" onclick="claimMailGift(\''+x.sender+'\',\''+x.gid+'\')">받기</button></div>'; }).join('');
            h+='<button class="btn ghost" style="margin:8px 0 4px;" onclick="claimAllMail()">친구 선물 모두 받기</button>';
          }
          if(gifts.length){
            if(mail.length) h+='<div class="sech"><span class="l">코드 보상</span><span class="s">'+gifts.length+'개</span></div>';
            h+=gifts.map((gf,i)=>{ const v=giftView(gf); return '<div class="giftrow"><span class="gfic">'+v.icon+'</span><span class="gftx"><b class="gfnm">'+escapeHtml(v.name)+'</b>'+(v.msg?'<span class="gfmsg">'+escapeHtml(v.msg)+'</span>':'')+'</span><button class="buy" onclick="claimGift('+i+')">받기</button></div>'; }).join('');
            h+='<button class="btn" style="margin-top:12px;" onclick="claimAllGifts()">코드 보상 모두 받기</button>';
          }
        }
        h+='</div>'; return h;
      };
      openSheet('선물함', build());
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(b) b.innerHTML=build(); };
    }
    function applyGiftToGame(g, gf){ if(gf.type==='coins') g.coins=(g.coins||0)+(Number(gf.qty)||0);
      else if(gf.type==='gold') g.gold=(g.gold||0)+(Number(gf.qty)||1);
      else if(gf.type==='consum' && gf.key) g.consum[gf.key]=(Number(g.consum[gf.key])||0)+(Number(gf.qty)||1); }
    function claimGift(i){
      let claimed=null;
      gameRef().transaction(g=>{ g=normalizeGame(g); if(i<0||i>=g.gifts.length) return g; claimed=g.gifts[i]; applyGiftToGame(g, claimed); g.gifts.splice(i,1); return g; })
        .then(r=>{ if(r&&r.committed&&claimed){ const v=giftView(claimed); toast('🎁 '+v.name+' 받음'+(claimed.type==='consum'?' · 가방에서 사용하세요':'')); if(state._sheetRefresh) state._sheetRefresh(); } });
    }
    function claimAllGifts(){
      let n=0;
      gameRef().transaction(g=>{ g=normalizeGame(g); n=g.gifts.length; g.gifts.forEach(gf=>applyGiftToGame(g,gf)); g.gifts=[]; return g; })
        .then(r=>{ if(r&&r.committed){ toast(n?('🎁 선물 '+n+'개 모두 받음'):'받을 선물이 없어요'); if(state._sheetRefresh) state._sheetRefresh(); } });
    }
    // ===== 🎁 친구 선물(mailbox) — 크로스유저 선물함 =====
    // 발신: 펫알 선물(은화 100 지불) · 무료 응원 선물(하루 제한, 물/사료/은화/금화 랜덤). 둘 다 친구에게만(규칙 강제).
    // 수신: users/{내uid}/mailbox/{보낸uid}/{gid} 로 도착 → 받기(claimMailGift)=내 game에 반영 후 삭제.
    const MAIL_EGG_COST=100, MAIL_FREE_DAILY=5, MAIL_EGG_DAILY=5;
    function mailRef(uid){ return db.ref('users/'+uid+'/mailbox/'+state.uid).push(); }   // 내가 uid에게 보내는 새 엔트리
    function isMyFriend(uid){ return !!(state.friends && state.friends[uid]); }
    function mailCountLeft(kind){ const day=kstDayKey(); const m=(state.game&&state.game.mail)||{}; const used=Number((m[kind]||{})[day])||0; return Math.max(0,(kind==='egg'?MAIL_EGG_DAILY:MAIL_FREE_DAILY)-used); }
    // 하루 카운트 tx 게이트(멱등·경쟁안전): 여유 있으면 +1하고 allowed=true. cb(allowed). (펫알 선물용)
    function mailDailyGate(kind, cb){ const day=kstDayKey(), cap=(kind==='egg'?MAIL_EGG_DAILY:MAIL_FREE_DAILY); let ok=false;
      gameRef().transaction(g=>{ g=normalizeGame(g); g.mail=g.mail||{}; g.mail[kind]=g.mail[kind]||{}; const c=Number(g.mail[kind][day])||0; if(c>=cap) return g; g.mail[kind][day]=c+1; ok=true; return g; })
        .then(r=>{ cb(!!(r&&r.committed&&ok)); }).catch(()=>cb(false)); }
    // 무료 응원 선물: 오늘 이 친구에게 이미 보냈는지(친구당 하루 1번)
    function freeSentToday(uid){ const day=kstDayKey(); const m=(state.game&&state.game.mail)||{}; const to=(m.freeTo&&m.freeTo[day])||{}; return !!to[uid]; }
    // 무료 선물 게이트: 친구당 하루 1번 + 전체 하루 MAIL_FREE_DAILY번. 통과 시 total+1·freeTo[uid]=1. cb(ok, reason).
    function mailFreeGate(uid, cb){ const day=kstDayKey(); let ok=false, reason='';
      gameRef().transaction(g=>{ g=normalizeGame(g); g.mail=g.mail||{}; g.mail.free=g.mail.free||{}; g.mail.freeTo=g.mail.freeTo||{};
        const to=g.mail.freeTo[day]||(g.mail.freeTo[day]={}); const total=Number(g.mail.free[day])||0;
        if(to[uid]){ reason='dup'; return g; }                       // 이 친구에겐 오늘 이미 보냄
        if(total>=MAIL_FREE_DAILY){ reason='cap'; return g; }          // 오늘 전체 소진
        g.mail.free[day]=total+1; to[uid]=1; ok=true; return g;
      }).then(r=>{ cb(!!(r&&r.committed&&ok), reason); }).catch(()=>cb(false,'err')); }
    // 무료 선물 게이트 롤백(전송 실패 시 소비한 횟수·친구표시 되돌림)
    function mailFreeRollback(uid){ const day=kstDayKey();
      gameRef().transaction(g=>{ g=normalizeGame(g); if(g.mail&&g.mail.free&&g.mail.free[day]) g.mail.free[day]=Math.max(0,Number(g.mail.free[day])-1);
        if(g.mail&&g.mail.freeTo&&g.mail.freeTo[day]) delete g.mail.freeTo[day][uid]; return g; }); }
    // mailbox 엔트리 쓰기(발신자→수령자). from/fromName 포함(규칙 validate가 from=auth.uid 요구).
    function writeMailGift(uid, gf){ const e=Object.assign({}, gf, { from:state.uid, fromName:(state.userName||'알뜰'), at:new Date().toISOString() });
      return mailRef(uid).set(e); }
    // 🥚 펫알 선물 — 은화 100 차감(멱등 tx) 후 mailbox에 펫알 1개. 실패 시 환불.
    function sendPetEggGift(uid){
      if(!uid || uid===state.uid) return; if(!isMyFriend(uid)){ toast('친구에게만 보낼 수 있어요', true); return; }
      if(coins()<MAIL_EGG_COST){ toast((MAIL_EGG_COST-coins())+' 은화 부족', true); return; }
      if(mailCountLeft('egg')<=0){ toast('오늘 펫알 선물을 다 보냈어요(하루 '+MAIL_EGG_DAILY+'회)', true); return; }
      mailDailyGate('egg', okDay=>{ if(!okDay){ toast('오늘 펫알 선물을 다 보냈어요(하루 '+MAIL_EGG_DAILY+'회)', true); return; }
        let paid=false;
        gameRef().transaction(g=>{ g=normalizeGame(g); if((g.coins||0)<MAIL_EGG_COST) return g; g.coins-=MAIL_EGG_COST; paid=true; return g; })
          .then(r=>{ if(!(r&&r.committed&&paid)){ toast('은화가 부족해요', true); return; }
            writeMailGift(uid, { type:'consum', key:'egg', qty:1 })
              .then(()=>{ toast('🥚 '+friendDisplayName(uid)+'님에게 펫알을 보냈어요'); if(state._sheetRefresh) state._sheetRefresh(); })
              .catch(()=>{ gameRef().transaction(g=>{ g=normalizeGame(g); g.coins=(g.coins||0)+MAIL_EGG_COST; return g; }); toast('선물 전송 실패(친구 관계·네트워크 확인)', true); }); });
      });
    }
    // 🎁 무료 응원 선물 — 무료. 친구당 하루 1번 + 전체 하루 5번. 물/사료/은화 랜덤 1개.
    function sendFreeGift(uid){
      if(!uid || uid===state.uid) return; if(!isMyFriend(uid)){ toast('친구에게만 보낼 수 있어요', true); return; }
      if(freeSentToday(uid)){ toast('이 친구에겐 오늘 이미 보냈어요(친구당 하루 1번)', true); return; }
      if(mailCountLeft('free')<=0){ toast('오늘 무료 선물을 다 보냈어요(하루 '+MAIL_FREE_DAILY+'회)', true); return; }
      mailFreeGate(uid, (okDay, reason)=>{ if(!okDay){ toast(reason==='dup'?'이 친구에겐 오늘 이미 보냈어요(친구당 하루 1번)':'오늘 무료 선물을 다 보냈어요(하루 '+MAIL_FREE_DAILY+'회)', true); return; }
        const gift=rollFreeGift(Math.random());
        writeMailGift(uid, gift).then(()=>{ const v=giftView(gift); toast('🎁 '+friendDisplayName(uid)+'님에게 '+v.name+' 응원 선물!'); if(state._sheetRefresh) state._sheetRefresh(); })
          .catch(()=>{ mailFreeRollback(uid); toast('선물 전송 실패(친구 관계·네트워크 확인)', true); if(state._sheetRefresh) state._sheetRefresh(); }); });
    }
    // ---- 수신(내 mailbox) ----
    function mailListFlat(){ const mb=(state.mailbox)||{}; const out=[];
      Object.keys(mb).forEach(sender=>{ const byGid=mb[sender]||{}; Object.keys(byGid).forEach(gid=>{ const gf=byGid[gid]; if(gf&&gf.type) out.push({ sender, gid, gf }); }); });
      out.sort((a,b)=> (a.gf.at||'')<(b.gf.at||'')?1:-1); return out; }
    function mailCount(){ return mailListFlat().length; }
    let _claimingMail={};
    function claimMailGift(sender, gid){ const k=sender+'/'+gid; if(_claimingMail[k]) return; _claimingMail[k]=1;
      const gf=(((state.mailbox||{})[sender])||{})[gid]; if(!gf){ delete _claimingMail[k]; return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); applyGiftToGame(g, gf); return g; })
        .then(r=>{ if(r&&r.committed){ db.ref('users/'+state.uid+'/mailbox/'+sender+'/'+gid).remove();
            const v=giftView(gf); toast('🎁 '+(gf.fromName?escapeHtml(gf.fromName)+'님의 ':'')+v.name+' 받음'+(gf.type==='consum'?' · 가방에서 사용':'')); if(state._sheetRefresh) state._sheetRefresh(); }
          delete _claimingMail[k]; }).catch(()=>{ delete _claimingMail[k]; }); }
    function claimAllMail(){ const list=mailListFlat(); if(!list.length){ toast('받을 친구 선물이 없어요'); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); list.forEach(x=>applyGiftToGame(g, x.gf)); return g; })
        .then(r=>{ if(r&&r.committed){ const upd={}; list.forEach(x=>{ upd['users/'+state.uid+'/mailbox/'+x.sender+'/'+x.gid]=null; }); db.ref().update(upd);
            toast('🎁 친구 선물 '+list.length+'개 모두 받음'); if(state._sheetRefresh) state._sheetRefresh(); } }); }
    // 🎒 가방 — 보유한 소비 아이템(사료·물·펫알·랜덤박스·무지개알·무지개박스)을 보고 사용.
    function openBag(){
      const build=()=>{
        const order=['egg','box','rainbow_egg','rainbow_box','food','water'];
        const rows=order.filter(k=>consumQty(k)>0);
        let h='<div class="bag">';
        if(!rows.length){ h+='<div class="empty" style="padding:30px 12px;">가방이 비었어요. 알뜰샵·선물함에서 아이템을 얻어보세요 🎒</div>'; }
        else h+=rows.map(k=>{ const m=CONSUM_META[k], q=consumQty(k);
          const useBtn = m.use ? '<button class="buy'+((k==='rainbow_egg'||k==='rainbow_box')?' rb-use':'')+'" onclick="useBagItem(\''+k+'\')">사용</button>'
                               : '<span class="qty" style="font-size:11px;color:var(--sub)">홈에서 그릇 탭</span>';
          return '<div class="bagrow"><span class="bgic">'+m.icon({h:34})+'</span><b class="bgnm'+((k==='rainbow_egg'||k==='rainbow_box')?' tier-limited':'')+'">'+m.name+'</b><span class="qty">보유 '+q.toLocaleString()+(q>=MAX_CONSUM?maxChip():'')+'</span>'+useBtn+'</div>'; }).join('');
        h+='<div class="note" style="margin-top:12px;">사료·물은 홈 화면에서 <b>밥·물 그릇을 탭</b>해 사용해요. 펫알·랜덤박스·무지개 아이템은 여기서 <b>사용</b>하면 열려요.</div></div>';
        return h;
      };
      openSheet('가방', build());
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(b) b.innerHTML=build(); };
    }
    function useBagItem(k){ const use=(CONSUM_META[k]||{}).use;
      if(use==='egg'||use==='box') useHeldGacha(use);
      else if(use==='rb_egg') useRainbow('egg');
      else if(use==='rb_box') useRainbow('box'); }
    // 보유한 펫알/랜덤박스(소비 인벤토리)를 일반 확률로 오픈 — 은화 대신 인벤토리 1개 소모, 금화+1 지급.
    function useHeldGacha(kind){
      const key=kind;   // consum.egg / consum.box
      if(consumQty(key)<1){ toast('보유한 '+(kind==='egg'?'펫알':'랜덤박스')+'이 없어요', true); return; }
      const res=rollFromPool(kind==='egg'?effCatTier():effItemTier()); if(!res) return;   // 일반 확률표(effTiers)
      const dup=kind==='egg' && ownsCat(res.id);
      const refund=dup?petDupRefund(res.id):0;
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.consum[key])||0)<1) return;
        g.consum[key]-=1; g.gold=(g.gold||0)+1;
        if(kind==='egg'){
          if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(res.id)<0) R.active.push(res.id); } }
          else { g.coins+=refund; }
        } else {
          g.owned.items[res.id]=g.owned.items[res.id]||{qty:0,boughtAt:new Date().toISOString()};
          g.owned.items[res.id].qty=(Number(g.owned.items[res.id].qty)||0)+1;
        }
        return g;
      }).then(r=>{ if(r&&r.committed){ runGachaFx(kind, res, dup, refund); if(state._sheetRefresh) setTimeout(()=>{ if(state._sheetRefresh) state._sheetRefresh(); }, 50); } });
    }
    // 미션 수동 수령(완료 판정 후)
    function claimMission(id){
      const m=ALL_MISSIONS.find(x=>x.id===id); if(!m) return;
      if(missionClaimed(m)){ toast('이미 수령했어요'); return; }
      if(!m.check()){ toast('아직 완료되지 않았어요', true); return; }
      grantMission(m).then(res=>{ if(res.committed) toast('+'+m.reward+' 은화'+(m.gold?' · +'+m.gold+' 금화':'')+' 획득! 🐾'); });
    }
    // 오늘 홈에서 일일 미션 행 탭: 이미 수령=무시 / 완료됨=수령 / 미완료=해당 행동으로 딥링크.
    function homeMissionTap(id){
      const m=DAILY_MISSIONS.find(x=>x.id===id); if(!m) return;
      if(missionClaimed(m)) return;
      if(m.check()){ claimMission(id); return; }
      if(id==='record'){   // 미완료 → 현재 모드에 맞는 추가 화면으로(할일 모드=할일 추가, 그 외=거래 추가)
        if(state.mode==='todo'){ if(typeof openTodoEdit==='function') openTodoEdit(); }
        else { if(typeof goto==='function') goto('ledger'); if(typeof openTxSheet==='function') openTxSheet(); }
      }
    }
    // 출석 자동 수령 + 로그인 스트릭(진입 시 1회, 멱등). 오늘 처음 출석일 때만 연속일 갱신·마일스톤 보상.
    function autoClaimAttend(){
      const m=DAILY_MISSIONS.find(x=>x.id==='attend');
      if(!state.game || missionClaimed(m)) return;
      const today=kstDayKey(); let milestone=null;
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        const key=missionKey(m); g.missions[key]=g.missions[key]||{};
        if(g.missions[key][m.id] && g.missions[key][m.id].claimed) return g;   // 이미 오늘 처리 → 스트릭 재갱신 안 함
        g.missions[key][m.id]={ claimed:true, reward:m.reward, at:new Date().toISOString() };
        g.coins += m.reward;
        // 연속 출석: 어제 출석했으면 +1, 아니면 1로 리셋
        g.streak = g.streak || { last:'', count:0, best:0 };
        g.streak.count = (g.streak.last===addDays(today,-1)) ? (Number(g.streak.count)||0)+1 : 1;
        g.streak.last = today;
        if(g.streak.count > (g.streak.best||0)) g.streak.best = g.streak.count;
        const rw=loginStreakReward(g.streak.count);
        if(rw.coins||rw.gold){ g.coins+=rw.coins; if(rw.gold) g.gold=(g.gold||0)+rw.gold; milestone={ day:g.streak.count, coins:rw.coins, gold:rw.gold }; g.streak.lastReward=Object.assign({at:new Date().toISOString()}, milestone); }
        return g;
      }).then(res=>{ if(res&&res.committed&&milestone){ toast('🔥 '+milestone.day+'일 연속! +'+milestone.coins+' 은화'+(milestone.gold?' · +'+milestone.gold+' 금화':'')); } });
    }

    // 고양이 구매(원자적, 잔액 음수 방지)
    function buyCat(id){
      const c=PET_CATALOG.find(x=>x.id===id); if(!c) return;
      if(ownsCat(id)){ toast('이미 보유한 고양이예요'); return; }
      if(isGachaOnlyCat(id)){ toast('이 등급은 펫알(가챠)로만 얻을 수 있어요'); setShopSub('event'); return; }
      const price=catBuyPrice(id), feat=isFeaturedCat(id);   // 이달의 펫이면 할인가로 결제(월 기준 결정적이라 클라·트랜잭션 값 일치)
      if(coins()<price){ toast((price-coins())+' 은화 부족', true); return; }
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(g.coins<price || g.owned.cats[id]) return;      // 재검증 → abort(가짜 입양 토스트 방지)
        g.coins-=price; g.owned.cats[id]={boughtAt:new Date().toISOString()};
        { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(id)<0) R.active.push(id); }
        return g;
      }).then(res=>{ if(res.committed) toast(c.name+' 입양 완료! 🐾'+(feat?' · 이달의 펫 할인':'')); });
    }

    // ================= 런타임 펫(앱에서 dev가 zip 업로드 → RTDB catalogPets 전역 저장 → 모든 사용자 반영) =================
    // 정적 파이프라인(tools/build_pets.py)과 별개 트랙. 이미지=data URL로 저장하므로 재배포·SW캐시 불필요.
    // 저장: catalogPets/{id}={ name, species, speciesLabel?, tier, scale, frontWalk, walk, south, north, east, west, by, at }.
    // 병합: PET_CATALOG(배열)·PET_SPRITES·CAT_TIER·SPECIES_LABEL에 밀어넣어 알뜰샵·가챠·방 어디서나 정적 펫과 동일 취급.
    // catalogPets/{id} 레코드는 (a) 신규 런타임 펫(이미지 포함) 또는 (b) 정적 펫 오버라이드(이름·등급·디자인·삭제)로 둘 다 겸함.
    //  · 정적 원본(STATIC_*)을 1회 스냅샷 → 스냅샷마다 "정적 base + catalog 오버라이드"로 재구성(멱등).
    //  · deleted:true = 소프트 삭제(이미지·정의 유지, 알뜰샵/가챠/목록에서 숨김). 개발자 펫 관리 화면에서 복구 가능.
    const STATIC_CATALOG=[], STATIC_SPRITES={}, STATIC_TIER={}, STATIC_SPECIES={}; let _staticCaptured=false;
    let _deletedPets={};   // 소프트 삭제된 펫 {id:{id,name,species,tier,...}} — dev 관리 화면 표시용
    function catalogRef(){ return db.ref('catalogPets'); }
    function captureStatic(){ if(_staticCaptured) return; _staticCaptured=true;
      PET_CATALOG.forEach(c=>STATIC_CATALOG.push(Object.assign({},c)));
      Object.keys(PET_SPRITES).forEach(k=>STATIC_SPRITES[k]=Object.assign({},PET_SPRITES[k]));
      Object.keys(CAT_TIER).forEach(k=>STATIC_TIER[k]=CAT_TIER[k]);
      Object.keys(SPECIES_LABEL).forEach(k=>STATIC_SPECIES[k]=SPECIES_LABEL[k]); }
    function isRuntimePet(id){ return !STATIC_TIER[id]; }   // 정적에 없으면 런타임 신규
    function applyCatalog(recs){ recs=recs||{};
      // 1) 정적 base로 리셋
      PET_CATALOG.length=0; STATIC_CATALOG.forEach(c=>PET_CATALOG.push(Object.assign({},c)));
      Object.keys(PET_SPRITES).forEach(k=>delete PET_SPRITES[k]); Object.keys(STATIC_SPRITES).forEach(k=>PET_SPRITES[k]=Object.assign({},STATIC_SPRITES[k]));
      Object.keys(CAT_TIER).forEach(k=>delete CAT_TIER[k]); Object.keys(STATIC_TIER).forEach(k=>CAT_TIER[k]=STATIC_TIER[k]);
      Object.keys(SPECIES_LABEL).forEach(k=>delete SPECIES_LABEL[k]); Object.keys(STATIC_SPECIES).forEach(k=>SPECIES_LABEL[k]=STATIC_SPECIES[k]);
      _deletedPets={};
      // 2) catalog 레코드 적용(신규/오버라이드/삭제)
      Object.keys(recs).forEach(id=>{ const r=recs[id]||{}; const isNew=isRuntimePet(id);
        const hasArt=!!(r.walk || r.hasArt);   // 인라인 이미지(구 레코드) 또는 분리 노드 catalogPetArt(신)
        if(isNew && !hasArt && !r.deleted) return;   // 이미지 없는 신규는 무시
        // 스프라이트
        let sp = isNew ? { frames:6, stills:true } : Object.assign({}, STATIC_SPRITES[id]);
        if(r.walk) sp.urls={ walk:r.walk, south:r.south, north:r.north, east:r.east, west:r.west };   // 구: 인라인 data URL(하위호환)
        else if(hasArt){ sp.needArt=true; sp.artAt=r.at||''; }   // 신: catalogPetArt/{id}에서 지연 로드(ensurePetArt)
        if(r.scale!=null) sp.scale=Number(r.scale)||1;
        if(r.frontWalk!=null) sp.frontWalk=!!r.frontWalk;
        if(isNew){ sp.runtime=true; sp.walk=sp.walk||''; }
        PET_SPRITES[id]=sp;
        const tier = r.tier || CAT_TIER[id] || 'normal'; CAT_TIER[id]=tier;
        const ci=PET_CATALOG.findIndex(x=>x.id===id);
        const base = ci>=0 ? PET_CATALOG[ci] : { id, species:'cat', name:id, desc:'' };
        if(r.speciesLabel && (r.species||base.species)) SPECIES_LABEL[r.species||base.species]=r.speciesLabel;
        const entry={ id, species:r.species||base.species||'cat', name:r.name||base.name||id,
          price:(TIER_PRICE[tier]||50), desc:(r.desc!=null?r.desc:(base.desc||'')), runtime:isNew };
        if(ci>=0) PET_CATALOG[ci]=entry; else PET_CATALOG.push(entry);
        if(r.deleted){ _deletedPets[id]=Object.assign({tier}, entry, {deleted:true});   // 목록에서 숨김(스프라이트·등급은 유지 → 보유 펫 렌더 가능)
          const di=PET_CATALOG.findIndex(x=>x.id===id); if(di>=0) PET_CATALOG.splice(di,1); }
      });
      PET_CATALOG.forEach(c=>{ const t=CAT_TIER[c.id]; if(t&&TIER_PRICE[t]!=null) c.price=TIER_PRICE[t]; });   // 가격 재산정
    }
    function watchCatalogPets(){ if(typeof db==='undefined'||!db) return;
      captureStatic();
      if(state._catalogRef){ try{ state._catalogRef.off(); }catch(e){} }
      state._catalogRef=catalogRef();
      state._catalogRef.on('value', s=>{ applyCatalog(s.val()||{});
        markCatDirty();
        if(typeof renderDockCats==='function') renderDockCats();
        if(state._sheetRefresh && $('sheet') && $('sheet').classList.contains('on')) state._sheetRefresh();
      }, ()=>{});   // 읽기 실패(규칙 미배포 등)는 조용히 무시
    }
    // ---- 런타임 펫 이미지 지연 로딩 ----
    // 스프라이트 base64는 catalogPets(메타)와 분리된 catalogPetArt/{id}에 저장 → 앱 시작 땐 메타만 받고,
    // 실제로 보이는 펫만 그때 .once로 아트를 받아 캐시(세션). .on이 아니라 편집 시 전체 재푸시 없음, 펫별 1회.
    const _petArt={};        // id -> { at, urls:{walk,south,north,east,west} } 세션 캐시
    const _petArtPending={};  // 진행 중 요청 가드
    function _applyArt(id, urls){ const sp=PET_SPRITES[id]; if(sp&&urls){ sp.urls={ walk:urls.walk, south:urls.south, north:urls.north, east:urls.east, west:urls.west }; sp.needArt=false; } }
    // 아트가 준비됐으면 스프라이트에 반영하고 true, 아직이면 로드 시작 후 false. (정적/이미 로드된 펫은 즉시 true)
    function ensurePetArt(id){ const sp=PET_SPRITES[id];
      if(!sp || !sp.needArt) return true;
      const c=_petArt[id]; if(c && c.at===(sp.artAt||'')){ _applyArt(id, c.urls); return true; }   // 캐시 히트(같은 at)
      if(_petArtPending[id]) return false;
      if(typeof db==='undefined'||!db) return false;
      _petArtPending[id]=true;
      db.ref('catalogPetArt/'+id).once('value').then(s=>{ delete _petArtPending[id]; const urls=s.val();
        if(urls && urls.walk){ _petArt[id]={ at:(sp.artAt||''), urls }; _applyArt(id, urls); _petArtRerender(); }
      }).catch(()=>{ delete _petArtPending[id]; });
      return false;
    }
    function ensurePetArtMany(ids){ (ids||[]).forEach(ensurePetArt); }   // 방/독 진입 시 소유 펫만 선로드
    // 아트 도착 → 무대 sig 무효화(스프라이트 src 갱신)하고 방/독·열린 시트 재렌더.
    let _artRerenderT=0;
    function _petArtRerender(){ clearTimeout(_artRerenderT); _artRerenderT=setTimeout(_petArtRerenderNow, 80); }   // 여러 런타임 펫 아트가 잇달아 도착해도 무대 재빌드를 1회로 합침(재빌드 폭주 방지)
    function _petArtRerenderNow(){ const cd=$('cdStage'); if(cd) cd.dataset.sig=''; const cr=$('crStage'); if(cr) cr.dataset.sig='';
      if(typeof renderDockCats==='function') renderDockCats();
      if(typeof mountRoomWalk==='function') mountRoomWalk();
      if(state._sheetRefresh && $('sheet') && $('sheet').classList.contains('on')) state._sheetRefresh(); }
    // 모든 펫(활성+삭제) — dev 관리 화면용. {id,name,species,tier,deleted}
    function allPetsForDev(){ const out=PET_CATALOG.map(c=>({ id:c.id, name:c.name, species:c.species, tier:CAT_TIER[c.id]||'normal', runtime:!!c.runtime, deleted:false }));
      Object.keys(_deletedPets).forEach(id=>{ const d=_deletedPets[id]; out.push({ id, name:d.name, species:d.species, tier:d.tier||'normal', runtime:!!d.runtime, deleted:true }); });
      return out.sort((a,b)=> (a.deleted-b.deleted) || tierRank(a.tier)-tierRank(b.tier) || String(a.name).localeCompare(String(b.name))); }
    function setPetDeleted(id, del){ catalogRef().child(id+'/deleted').set(!!del); }
    function deletePetSoft(id){ confirmSheet('이 펫을 삭제할까요? 앱에서 숨겨지고(이미지는 보존) 개발자 화면에서 복구할 수 있어요.', ()=>{ setPetDeleted(id,true); toast('삭제(숨김) 처리했어요'); if(state._devPetSel===id) state._devPetSel=null; if(typeof openDevPetManager==='function') openDevPetManager(); }); }
    function restorePet(id){ setPetDeleted(id,false); toast('복구했어요'); if(typeof openDevPetManager==='function') openDevPetManager(); }

    // ---- dev: 펫 관리(목록·추가·수정·삭제/복구) + zip 처리 ----
    let _devPetTarget=null;   // 수정 대상 id(null=신규 추가)
    function loadJSZip(){ if(window.JSZip) return Promise.resolve(window.JSZip);
      return new Promise((res,rej)=>{ const s=document.createElement('script');
        s.src='https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'; s.onload=()=>res(window.JSZip); s.onerror=()=>rej(new Error('JSZip 로드 실패')); document.head.appendChild(s); }); }
    function _blobToImg(blob){ return new Promise((res,rej)=>{ const u=URL.createObjectURL(blob); const im=new Image();
      im.onload=()=>{ URL.revokeObjectURL(u); res(im); }; im.onerror=()=>{ URL.revokeObjectURL(u); rej(new Error('이미지 로드 실패')); }; im.src=u; }); }
    // zip → {walk,south,north,east,west,frontWalk} data URL(브라우저 canvas 합성)
    function _processPetZip(file){
      return loadJSZip().then(JSZip=>JSZip.loadAsync(file)).then(zip=>{
        const names=Object.keys(zip.files);
        let frameNames=names.filter(n=>/\/Walk\/east\/frame_\d+\.png$/i.test(n)).sort(); let frontWalk=false;
        if(frameNames.length<6){ const s=names.filter(n=>/\/Walk\/south\/frame_\d+\.png$/i.test(n)).sort(); if(s.length>=6){ frameNames=s; frontWalk=true; } }
        if(frameNames.length<6) throw new Error('걷기 프레임(Walk/east 6장)을 못 찾음');
        return Promise.all(frameNames.slice(0,6).map(n=>zip.files[n].async('blob').then(_blobToImg))).then(frames=>{
          const w=frames[0].naturalWidth||48, hgt=frames[0].naturalHeight||48;
          const cv=document.createElement('canvas'); cv.width=w*6; cv.height=hgt; const ctx=cv.getContext('2d');
          ctx.imageSmoothingEnabled=false; frames.forEach((im,i)=>ctx.drawImage(im,i*w,0,w,hgt));
          const walk=cv.toDataURL('image/png');
          return Promise.all(['south','north','east','west'].map(f=>{ const k=names.find(n=>new RegExp('/rotations/'+f+'\\.png$','i').test(n));
            return k ? zip.files[k].async('base64').then(b=>'data:image/png;base64,'+b) : Promise.resolve(walk); }))
            .then(rots=>({ walk, south:rots[0], north:rots[1], east:rots[2], west:rots[3], frontWalk }));
        });
      });
    }
    function _petFormHtml(pre){ pre=pre||{};
      const tierOpts=(typeof TIERS!=='undefined'?TIERS:[{id:'normal',name:'일반'}]).map(t=>'<option value="'+t.id+'"'+(pre.tier===t.id?' selected':'')+'>'+t.name+'</option>').join('');
      let h='<div class="field"><label>zip 파일'+(pre.id?' <span class="pill">재업로드 시에만 디자인 교체</span>':'')+'</label><input type="file" id="dpZip" accept=".zip,application/zip" class="input"></div>';
      h+='<div class="field"><label>이름</label><input class="input" id="dpName" value="'+escapeHtml(pre.name||'')+'" placeholder="예: 고랑이" maxlength="16"></div>';
      h+='<div class="field"><label>분류 라벨(알뜰샵 태그)</label><input class="input" id="dpSpeciesLabel" value="'+escapeHtml(pre.speciesLabel||'')+'" placeholder="예: 호랑이" maxlength="8"></div>';
      h+='<div class="field"><label>분류 코드(species)</label><input class="input" id="dpSpecies" value="'+escapeHtml(pre.species||'cat')+'" placeholder="cat/dog/tiger…" maxlength="12"></div>';
      h+='<div class="row" style="gap:8px;"><div class="field" style="flex:1;"><label>등급</label><select class="input" id="dpTier">'+tierOpts+'</select></div>'+
         '<div class="field" style="flex:1;"><label>크기(배율)</label><input class="input" id="dpScale" type="number" step="0.1" min="0.3" value="'+(pre.scale||1)+'"></div></div>';
      return h; }
    function devPetInfo(id){ const c=PET_CATALOG.find(x=>x.id===id)||_deletedPets[id]; if(!c) return null; const sp=PET_SPRITES[id]||{};
      return { id, name:c.name, species:c.species, speciesLabel:(SPECIES_LABEL[c.species]||''), tier:CAT_TIER[id]||'normal', scale:sp.scale||1 }; }
    function openDevPetAdd(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용'); return; } _devPetTarget=null;
      let h='<p class="muted" style="font-size:12.5px;margin:2px 2px 12px;line-height:1.5;">PixelLab export <b>zip</b>을 올리고 이름·분류·등급·크기만 정하면 추가됩니다. 앱에서 바로 처리(옆걷기 시트+4방향 생성)해 <b>모든 사용자</b>에게 반영돼요.</p>';
      h+=_petFormHtml({})+'<button class="btn" id="dpBtn" onclick="submitDevPet()">추가</button>';
      openSheet('펫 추가', h); }
    function openDevPetEdit(id){ if(!(typeof isDev==='function'&&isDev())) return; const p=devPetInfo(id); if(!p){ toast('펫을 찾을 수 없어요',true); return; } _devPetTarget=id;
      let h='<p class="muted" style="font-size:12.5px;margin:2px 2px 12px;line-height:1.5;">이름·분류·등급·크기를 바꾸고, <b>zip을 다시 올리면 디자인</b>도 교체돼요. (정적 펫도 앱에서 오버라이드됩니다)</p>';
      h+=_petFormHtml(p)+'<button class="btn" id="dpBtn" onclick="submitDevPet()">저장</button>';
      openSheet('펫 수정 · '+escapeHtml(p.name||id), h); }
    function submitDevPet(){
      const name=(val('dpName')||'').trim(); if(!name){ toast('이름을 입력하세요', true); return; }
      const fi=$('dpZip'), file=fi&&fi.files&&fi.files[0], editing=!!_devPetTarget;
      if(!editing && !file){ toast('zip 파일을 선택하세요', true); return; }
      const btn=$('dpBtn'); if(btn){ btn.disabled=true; btn.textContent='처리 중…'; }
      const fields={ name, species:(val('dpSpecies')||'cat').trim()||'cat', speciesLabel:(val('dpSpeciesLabel')||'').trim(),
        tier:val('dpTier')||'normal', scale:Number(val('dpScale'))||1, by:state.userEmail||'', at:new Date().toISOString() };
      const p = file ? _processPetZip(file) : Promise.resolve(null);
      p.then(art=>{
        const id=editing?_devPetTarget:('rt_'+Date.now().toString(36));
        if(art){
          // 메타는 catalogPets/{id}, 이미지는 분리 노드 catalogPetArt/{id} — 원자 다중경로 업데이트(메타 필드는 개별 경로로 병합).
          fields.frontWalk=art.frontWalk; fields.hasArt=true;
          const upd={};
          ['name','species','speciesLabel','tier','scale','by','at','frontWalk','hasArt'].forEach(k=>{ if(fields[k]!==undefined) upd['catalogPets/'+id+'/'+k]=fields[k]; });
          upd['catalogPetArt/'+id]={ walk:art.walk, south:art.south, north:art.north, east:art.east, west:art.west };
          delete _petArt[id];   // 세션 캐시 무효화(새 아트)
          return db.ref().update(upd);
        }
        // 이미지 없는 수정(메타만) — 기존처럼 병합 update
        return catalogRef().child(id).update(fields);
      }).then(()=>{ toast((editing?'저장':'추가')+' 완료! 🐾'); closeSheet(); })
        .catch(e=>{ toast((editing?'저장':'추가')+' 실패: '+((e&&e.message)||e), true); const b=$('dpBtn'); if(b){ b.disabled=false; b.textContent=editing?'저장':'추가'; } });
    }
    function devSelectPet(id){ const wrap=document.querySelector('.petmg-list');
      const prevSel=state._devPetSel; state._devPetSel=(prevSel===id?null:id); const newSel=state._devPetSel;
      if(!wrap){ openDevPetManager(); return; }   // 시트가 없으면 전체 렌더
      // 이전·현재 선택 행만 갱신(.sel 토글 + 썸네일 걷기/정면 스왑) → 목록 재빌드·스크롤 튐 없음
      [prevSel, newSel].forEach(function(pid){ if(!pid) return; const row=wrap.querySelector('.petmg-row[data-pid="'+pid+'"]'); if(!row) return;
        const on=pid===newSel; row.classList.toggle('sel', on);
        const th=row.querySelector('.pm-thumb'); if(th) th.innerHTML = on?catActorHTML(pid,52):catFace(pid,{h:52}); });
      const act=document.getElementById('pmActions'); if(act) act.innerHTML=devPetActionsHtml(); }
    // 기존 인라인 아트(catalogPets/{id}.walk…) → 분리 노드 catalogPetArt/{id}로 1회 이전(멱등). canel94로 1회 실행. RTDB 일괄 쓰기라 확인 후 실행.
    function migrateCatalogArtOnce(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용'); return; }
      confirmSheet('예전 인라인 펫 아트를 catalogPetArt로 분리 이전할까요?\nRTDB에 일괄 쓰기가 발생합니다(이미 이전된 항목은 건너뜀).', _migrateCatalogArtOnce, {title:'이미지 분리 이전(1회)', okLabel:'이전 실행', danger:false}); }
    function _migrateCatalogArtOnce(){ if(!(typeof isDev==='function'&&isDev())) return;
      catalogRef().once('value').then(s=>{ const recs=s.val()||{}; const upd={}; let n=0;
        Object.keys(recs).forEach(id=>{ const r=recs[id]||{}; if(!r.walk) return;   // 이미 이전됨/이미지 없음
          upd['catalogPetArt/'+id]={ walk:r.walk, south:r.south, north:r.north, east:r.east, west:r.west };
          ['walk','south','north','east','west'].forEach(k=>upd['catalogPets/'+id+'/'+k]=null);
          upd['catalogPets/'+id+'/hasArt']=true; n++; });
        if(!n){ toast('이전할 항목이 없어요'); return; }
        return db.ref().update(upd).then(()=>toast(n+'개 펫 이미지를 분리 저장했어요 ✅'));
      }).catch(e=>toast('이전 실패: '+((e&&e.message)||e), true)); }
    // 런타임 펫을 정적 파이프라인으로 승격 — 아트 5장을 파일로 내려받고, pets.json·PET_ID_MIGRATE 스니펫을 안내.
    function exportPetStatic(id){ if(!(typeof isDev==='function'&&isDev())) return;
      const info=devPetInfo(id); if(!info){ toast('펫을 찾을 수 없어요', true); return; } const sp=PET_SPRITES[id]||{};
      const doExport=(urls)=>{ if(!urls || !urls.walk){ toast('이미지를 불러오는 중이에요. 잠시 후 다시 시도하세요.'); ensurePetArt(id); return; }
        ['walk','south','north','east','west'].forEach(f=>{ if(!urls[f]) return; const a=document.createElement('a'); a.href=urls[f]; a.download=f+'.png'; document.body.appendChild(a); a.click(); a.remove(); });
        const slug=String(id).replace(/^rt_/,'')||'new'; const sid=(info.species||'cat')+'_'+slug;
        const petLine=JSON.stringify({ id:sid, species:info.species||'cat', name:info.name||'', tier:info.tier||'normal', scale:sp.scale||1, desc:'', zip:'', frontWalk:!!sp.frontWalk });
        let h='<p class="muted" style="font-size:12.5px;line-height:1.6;margin:2px 2px 10px;">PNG 5장을 내려받았어요. 아래로 정적 편입하세요(<code>id</code>는 원하는 이름으로 바꿔도 됩니다).</p>';
        h+='<ol style="font-size:13px;line-height:1.8;padding-left:20px;margin:0 0 10px;">'+
           '<li><code>public/assets/pets/'+escapeHtml(info.species||'cat')+'/'+escapeHtml(sid)+'/</code> 폴더에 5장 넣기</li>'+
           '<li><code>tools/pets.json</code> 의 <code>pets</code> 배열에 아래 한 줄 추가</li>'+
           '<li><code>cats.js</code> 의 <code>PET_ID_MIGRATE</code> 에 아래 한 줄 추가(소유자 이관)</li>'+
           '<li><code>python tools/build_pets.py</code> 실행 → 커밋 → 배포</li>'+
           '<li>배포 확인 후 이 런타임 펫을 <b>삭제</b>(catalogPets·catalogPetArt 제거)</li></ol>';
        h+='<div class="field"><label>pets.json 항목</label><pre style="white-space:pre-wrap;word-break:break-all;background:var(--card,#0002);padding:8px;border-radius:8px;font-size:12px;">'+escapeHtml(petLine)+'</pre></div>';
        h+='<div class="field"><label>PET_ID_MIGRATE 한 줄</label><pre style="background:var(--card,#0002);padding:8px;border-radius:8px;font-size:12px;">'+escapeHtml(id+": '"+sid+"',")+'</pre></div>';
        openSheet('정적 승격 · '+escapeHtml(info.name||id), h); };
      if(sp.urls) doExport(sp.urls);
      else if(_petArt[id] && _petArt[id].urls) doExport(_petArt[id].urls);
      else db.ref('catalogPetArt/'+id).once('value').then(s=>doExport(s.val())).catch(e=>toast('불러오기 실패: '+((e&&e.message)||e), true)); }
    // 개발자 펫 관리: 전체 목록(삭제된 펫=회색·"삭제됨") + 선택 후 [추가][수정][삭제/복구] + 가챠 연출 펫 지정.
    // 선택 토글은 시트 전체가 아니라 목록 행(2개)+액션영역(#pmActions)만 부분 갱신(devSelectPet) → 스크롤 유지·재빌드 비용 절감.
    function devPetRowHtml(p, sel){ const on=p.id===sel; const tag=(SPECIES_LABEL[p.species]||p.species); const tn=((typeof TIERS!=='undefined'&&TIERS.find(t=>t.id===p.tier))||{}).name||p.tier;
      const art=on?catActorHTML(p.id,52):catFace(p.id,{h:52});   // 선택 시 옆으로 걷는 스프라이트, 아니면 정면 썸네일
      return '<button class="petmg-row'+(on?' sel':'')+(p.deleted?' del':'')+'" data-pid="'+p.id+'" onclick="devSelectPet(\''+p.id+'\')">'+
        '<span class="pm-thumb">'+art+'</span>'+
        '<span class="pm-txt"><span class="pm-nm">'+escapeHtml(p.name||p.id)+'</span>'+
        '<span class="pm-meta">'+escapeHtml(tag)+' · '+escapeHtml(tn)+(p.runtime?' · 런타임':'')+(p.deleted?' · 삭제됨':'')+'</span></span></button>'; }
    // 목록 아래 액션영역(선택 상태에 따라 바뀌는 부분) — 부분 갱신 대상.
    function devPetActionsHtml(){ const list=allPetsForDev(), sel=state._devPetSel, selPet=sel?list.find(p=>p.id===sel):null;
      const dr = (selPet&&selPet.deleted) ? '<button class="btn" onclick="restorePet(\''+sel+'\')">복구</button>'
        : '<button class="btn danger"'+(sel?'':' disabled')+(sel?' onclick="deletePetSoft(\''+sel+'\')"':'')+'>삭제</button>';
      let h='<div class="petmg-btns"><button class="btn ghost" onclick="openDevPetAdd()">추가</button>'+
         '<button class="btn"'+(sel?'':' disabled')+(sel?' onclick="openDevPetEdit(\''+sel+'\')"':'')+'>수정</button>'+dr+'</div>';
      // 🎬 가챠 오픈 연출 펫 지정(전역 config/gachaFx — 모든 사용자에게 즉시 적용). 선택 펫을 연출 1번(왼쪽)/2번(오른쪽)에 배정(다시 누르면 해제).
      h+='<div class="sec-title" style="margin-top:14px;">가챠 오픈 연출 펫 <span class="pill">전역 · 모든 사용자</span></div>';
      if(sel && selPet && !selPet.deleted){
        const sa=gachaFxSlotOf(sel);   // 'a'|'b'|null (현재 이 펫이 배정된 슬롯)
        h+='<div class="petmg-btns">'+
           '<button class="btn'+(sa==='a'?'':' ghost')+'" onclick="setGachaFxSlot(\'a\',\''+sel+'\')">연출 1번(왼쪽)'+(sa==='a'?' ✓':'')+'</button>'+
           '<button class="btn'+(sa==='b'?'':' ghost')+'" onclick="setGachaFxSlot(\'b\',\''+sel+'\')">연출 2번(오른쪽)'+(sa==='b'?' ✓':'')+'</button></div>';
      } else {
        h+='<p class="muted" style="font-size:11.5px;line-height:1.5;margin:6px 2px 0;">펫을 선택하면 연출 <b>1번(왼쪽)</b>·<b>2번(오른쪽)</b>으로 지정할 수 있어요.</p>';
      }
      h+='<p class="muted" style="font-size:11.5px;line-height:1.5;margin:8px 2px 0;">펫알·박스 열 때 걸어와 톡 치는 연출 펫이에요. <b>1번</b>=왼쪽, <b>2번</b>=오른쪽에서 등장(둘 다면 <b>1번 끝난 뒤 2번</b> 순차, 크기는 펫 배율만큼). 현재 1번=<b>'+escapeHtml(gachaFxSlotDesc('a'))+'</b> · 2번=<b>'+escapeHtml(gachaFxSlotDesc('b'))+'</b>.</p>';
      h+='<div class="petmg-btns" style="margin-top:8px;"><button class="btn ghost" onclick="devPreviewGachaFx()">▶︎ 연출 미리보기</button></div>';
      return h; }
    function openDevPetManager(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용'); return; }
      const list=allPetsForDev(), sel=state._devPetSel;
      let h='<p class="muted" style="font-size:12.5px;margin:2px 2px 10px;line-height:1.5;">펫을 선택해 <b>수정/삭제</b>하거나 <b>추가</b>로 새 펫(zip)을 올려요. 삭제=앱에서 숨김(이미지 보존)이라 <b>복구</b> 가능.</p>';
      h+='<div class="petmg-list">'+list.map(p=>devPetRowHtml(p, sel)).join('')+'</div>';
      h+='<div id="pmActions">'+devPetActionsHtml()+'</div>';
      openSheet('펫 관리', h); }

    // 개발자 데이터 정리: 런타임 펫 정적 승격(내보내기) + 구 인라인 아트 1회 분리 이전.
    function openDevDataTools(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용'); return; }
      const runtimes=allPetsForDev().filter(p=>p.runtime && !p.deleted);
      let h='<div class="note"><span class="pill">전역 데이터</span> RTDB에 저장된 데이터를 파일 에셋으로 옮겨 부담을 줄이는 <b>정리 도구</b>예요. 실행 전 백업/배포 순서를 지켜요.</div>';
      h+='<div class="field"><label>런타임 펫 정적 승격</label>';
      if(runtimes.length){
        h+='<div class="petmg-list">'+runtimes.map(p=>{
          const tag=(SPECIES_LABEL[p.species]||p.species), tn=((typeof TIERS!=='undefined'&&TIERS.find(t=>t.id===p.tier))||{}).name||p.tier;
          return '<button class="petmg-row" onclick="exportPetStatic(\''+p.id+'\')">'+
            '<span class="pm-thumb">'+catFace(p.id,{h:52})+'</span>'+
            '<span class="pm-txt"><span class="pm-nm">'+escapeHtml(p.name||p.id)+'</span>'+
            '<span class="pm-meta">'+escapeHtml(tag)+' · '+escapeHtml(tn)+' · 런타임</span></span></button>'; }).join('')+'</div>';
      } else { h+='<p class="muted" style="font-size:12px;margin:2px;">승격할 런타임 펫이 없어요.</p>'; }
      h+='</div>';
      h+='<div class="petmg-btns" style="margin-top:10px;"><button class="btn ghost" onclick="migrateCatalogArtOnce()">이미지 분리 이전(1회)</button></div>';
      h+='<p class="muted" style="font-size:11.5px;line-height:1.5;margin:8px 2px 0;">승격=런타임 펫을 파일 에셋으로 옮겨 RTDB 부담을 줄임(<code>tools/pets.json</code>+<code>build_pets.py</code>). 분리 이전=예전 인라인 아트를 <code>catalogPetArt</code>로 옮기는 1회 작업.</p>';
      openSheet('데이터 정리', h); }

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
      d.innerHTML='<div class="cd-room">'+
        '<div class="cr-wall" style="background:'+wallCss(currentWall())+'"></div><div class="cr-floor"></div><div class="cr-base"></div>'+
        '<span class="cr-cam cd-cam" role="button" tabindex="0" aria-label="알뜰홈 열기" onclick="event.stopPropagation();coinTap(this)"><i></i>LIVE · <span class="cd-camtxt" id="cdCamTxt">'+(room().emoji?room().emoji+' ':'')+escapeHtml(room().name||'우리집')+'</span></span>'+
        batchBtnHtml()+
        '<div class="cr-props" id="cdProps"></div><div class="cr-stage" id="cdStage"></div></div>';
      renderDockProps(); renderDockCats();
    }
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
      const foot=itemFoot(p.itemId);
      // 앵커=배치칸 "좌측하단". x는 발자국 좌측 edge(가운데 정렬 X, CSS translateX(0)), 바닥은 발자국 앞줄(front row) 기준.
      const x=((p.c-1)/12*100).toFixed(2);
      const frontRow=p.r + foot.h - 1;   // 발자국에서 가장 앞(가까운) 줄에 바닥을 둠 → 가구가 위로 뜨지 않음
      // 반전: 격자 윗줄(작은 r)=방 뒤(멀리, 위·작게), 아랫줄(큰 r)=방 앞(가까이, 아래·크게)
      const depth=(12-frontRow)/11; const bottom=(isDock?(3+depth*38):(3+depth*46)).toFixed(1); const fh=furnRoomH(p.itemId,isDock,depth);
      // 원근 가림: 앞(frontRow 큰 값)일수록 z-index를 높여 앞 가구가 뒤 가구를 덮게 한다.
      // (밥·물그릇/화장실의 고정 z-index:2가 이 깊이 순서를 깨뜨리던 문제 → 인라인 z-index로 덮어씀)
      const z=Math.max(1, Math.round(frontRow));
      const tap=!plain && (p.itemId==='bowl'||p.itemId==='waterbowl');   // 친구 방(plain)은 밥그릇 채움·똥·탭 없이 정적 렌더
      // 캠(dock·홈 LIVE)에서만 연출(live) — 미리보기/친구 방/샵/팔레트는 정적. 연출 가구는 base+fx 두 겹으로.
      let inner=tap? furnRoomSvg(p.itemId,p.key,{h:fh}) : (live&&FURN_ANIM[p.itemId] ? furnLiveSvg(p.itemId,{h:fh}) : furnSvg(p.itemId,{h:fh}));
      if(!plain && p.itemId==='litterbox'){ const slots=p._poops||[]; const ph=Math.max(6,Math.round(fh*0.32));
        inner+=slots.map(s=>'<span class="poop" onclick="collectPoop(event)" style="left:'+(20+(s%3)*26)+'%;top:'+(30+((s/3|0)*20))+'%;height:'+ph+'px" title="치우기 +'+POOP_REWARD+' 은화">'+poopSvg({h:ph})+'</span>').join(''); }
      return '<div class="cr-prop'+(tap?' cr-tap':'')+(p.itemId==='litterbox'?' cr-litter':'')+'" style="left:'+x+'%;bottom:'+bottom+'%;z-index:'+z+';"'+(tap?' onclick="event.stopPropagation();feedBowl(\''+p.key+'\')"':'')+'>'+inner+'</div>';
    }
    // 우측 상단 "일괄 돌보기" 버튼(밥·물 채우고 똥 치우기) — dock·홈 공용
    function batchBtnHtml(){ return '<button class="cr-batch" onclick="event.stopPropagation();batchCare(this)" aria-label="일괄 돌보기: 밥·물 채우고 똥 치우기">돌보기</button>'; }
    // 배치 가구를 무대 바닥에 배경으로(가로=열, 앞뒤 깊이=행)
    function renderDockProps(){
      const box=$('cdProps'); if(!box) return;
      reconcilePets();   // 캠 화면에서도 3시간 만료→똥 정산
      // 원근: 뒤(행 큰 값)일수록 위로·작게, 앞(행 작은 값)일수록 아래로·크게. 앞 가구가 뒤 가구를 덮도록 뒤부터.
      const list=placedList().sort((a,b)=>a.r-b.r); distributePoops(list);
      box.innerHTML=list.map(p=>propMarkup(p,true,false,true)).join('');   // live=true → dock 캠 연출
    }
    // 활성 고양이를 dock 무대에 액터로 배치(없으면 안내)
    function renderDockCats(){
      const stage=$('cdStage'); if(!stage) return;
      const cats=activeCats(); const list=cats.slice(0,slotCount());
      ensurePetArtMany(list);   // 독에 보이는 소유 펫 아트 선로드(지연)
      stage.dataset.hh=48;
      const sig='c:'+list.join(',');   // 고양이 구성이 그대로면 DOM 재생성 금지(스프라이트 리로드·애니메이션 리셋 깜빡임 방지)
      if(stage.dataset.sig===sig && stage.querySelector('.cd-actor')) return;
      stage.dataset.sig=sig;
      if(!list.length){ stage.innerHTML='<span class="cd-empty">고양이를 입양해 보세요</span>'; markCatDirty(); return; }
      stage.innerHTML=list.map((id,i)=>{ const s=petActorPx(id,48,96); return '<div class="cd-actor" data-cat="'+id+'" data-hh="'+s+'" style="left:'+(12+i*54)+'px;">'+catActorHTML(id,s)+'</div>'; }).join('');
      markCatDirty();
    }
    // ---- 통합 걷기 엔진: 단일 rAF가 "지금 보이는 무대"(시트 방 또는 dock)만 애니메이션 ----
    // 고양이는 방/시트에 배치된 가구로 가끔 다가가 잠시 머문다(상호작용). 스트립엔 가구가 없어 자유 배회.
    function reducedMotion(){ try{ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }
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
    // depth로부터 배율·바닥올림(rise)·z-index를 액터에 반영. z는 가구 frontRow(=12-depth*11)와 같은 척도라 상호 가림이 맞물린다.
    function applyDepth(a){ const d=a.depth=Math.max(0,Math.min(1,a.depth||0));
      a.scale=depthScale(d); a.rise=d*(a.riseMax||0);
      const z=Math.max(1, Math.round(12 - d*11)); if(a._z!==z){ a._z=z; a.el.style.zIndex=z; }
      if(a.pkey){ _petDepth[a.pkey]=d; _petVz[a.pkey]=a.vz||0; } }   // 재빌드 때 이어받도록 지속(무대별 키 — dock/내 방/친구 방의 같은 id가 안 섞이게)
    // 액터의 위치(x)·올림(lift)·깊이(scale/rise)·방향(scaleX)을 transform 하나로 — 전부 합성(페인트 0).
    // transform-origin:center bottom 이라 배율은 발밑 기준(발이 바닥선에 유지)·좌우반전은 중심축. 시각 중심 x=a.x+sw/2는 배율과 무관하게 유지.
    // ⚠️ left/top은 절대 매 프레임 건드리지 않는다(레이아웃·페인트 유발). x는 정수 px 스냅.
    function setXform(a, dir, lift){ const d=(dir!=null?dir:a.dir), s=(a.scale||1),
        fp=(a.footPad!=null?a.footPad:PET_FOOT_PAD),          // 펫별 발밑 여백 비율(측정값, 없으면 기본) — 호랑이 등 큰 동물은 여백↑
        pad=(a.spr?Math.round((a.hh||0)*fp*s):0),             // 발밑 여백 상쇄(렌더높이×비율×스케일) → 발이 바닥선에 닿게
        up=Math.round((a.rise||0)+(lift!=null?lift:(a.lift||0)))-pad;
      a.el.style.transform='translate3d('+Math.round(a.x)+'px,'+(-up)+'px,0) scale('+(s*d)+','+s+')'; if(a.pkey) _petX[a.pkey]=a.x; }
    // 스프라이트 프레임 아래 투명 여백 비율을 실제 이미지 알파로 1회 측정(펫별로 다름)→캐시.
    const _footPad={};
    // face=측정할 방향 스틸(기본 south=정면). 가챠 연출은 옆으로 걸어오니 'east'로 측정해야 발끝-알 바닥 정합이 정확. 방향별 여백이 달라 캐시 키를 id:face 로 분리.
    function measureFootPad(id, cb, face){ face=face||'south'; const key=id+':'+face;
      if(_footPad[key]!=null){ cb&&cb(_footPad[key]); return; }
      const sp=PET_SPRITES[id]; if(!sp){ _footPad[key]=PET_FOOT_PAD; cb&&cb(_footPad[key]); return; }
      if(sp.runtime && sp.needArt && !sp.urls){ cb&&cb(PET_FOOT_PAD); return; }   // 아트 로딩 전(투명 픽셀)엔 측정·캐시 금지 — 로드 후 재측정
      const img=new Image(); img.crossOrigin='anonymous';
      img.onload=function(){ try{
          const w=img.naturalWidth||img.width, h=img.naturalHeight||img.height;
          const cv=document.createElement('canvas'); cv.width=w; cv.height=h; const ctx=cv.getContext('2d');
          ctx.drawImage(img,0,0); const px=ctx.getImageData(0,0,w,h).data; let bottom=-1;
          for(let y=h-1;y>=0&&bottom<0;y--){ for(let x=0;x<w;x++){ if(px[(y*w+x)*4+3]>16){ bottom=y; break; } } }
          _footPad[key]=(bottom<0)?PET_FOOT_PAD:Math.max(0,(h-1-bottom)/h);
        }catch(e){ _footPad[key]=PET_FOOT_PAD; } cb&&cb(_footPad[key]); };
      img.onerror=function(){ _footPad[key]=PET_FOOT_PAD; cb&&cb(_footPad[key]); };
      img.src=sprStill(id,face);
    }
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
      const sheetOpen=$('sheet')&&$('sheet').classList.contains('on');
      if(sheetOpen){
        const fr=$('frStage'); if(fr) out.push(fr);                                             // 친구 집 방문 중인 방
        const cr=$('crStage'); if(cr && _catTab==='home' && out.indexOf(cr)<0) out.push(cr);    // 내 알뜰홈 시트의 방
      }
      if(dockMode()!=='hidden'){ const s=$('cdStage'); if(s && out.indexOf(s)<0) out.push(s); }  // 하단 dock 캠(시트가 떠 있어도 계속 로밍)
      return out;
    }
    function buildActors(stage){
      const acts=Array.from(stage.querySelectorAll('.cd-actor')); if(!acts.length) return [];
      const W=stage.clientWidth||160, hh=+stage.dataset.hh||30;
      const isFriend = stage.id==='frStage';
      const hasRoom = stage.id==='crStage' || isFriend || !!stage.closest('.cd-room');
      const isDock = stage.id==='cdStage';   // dock(얇은 스트립)만 dock 취급 — 친구 무대(frStage)는 방 크기
      // 방 높이 → depth 1(맨 뒤)에서 발이 올라가는 최대 px(rise). 가구 바닥 매핑(bottom%=3+depth*46/38)과 같은 척도라 같은 행에 서면 발높이가 맞는다.
      const roomEl = stage.closest('.catroom') || stage.closest('.cd-room');
      const roomH = (roomEl && roomEl.clientHeight) || (isDock?110:244);
      // 위에서 내려다보는(탑다운) 느낌: 맨 앞(depth0)=바닥 앞끝, 맨 뒤(depth1)=바닥 뒤끝(벽지 경계)에 닿게.
      // depth1 발높이 ≈ base + riseMax 이므로, 바닥 세로비(홈 cr-floor 54%·dock 66%)에 맞춰 뒤 펫이 벽에 닿도록 폭을 키움.
      // (발밑 여백 상쇄 pad는 깊이와 무관하게 적용되어 맨 앞은 여전히 바닥에 붙음 — 뜨는 문제 재발 없음.)
      const riseMax = roomH*(isDock?0.61:0.53);
      // 가구 위치(발자국 중앙 x)·렌더 높이(fh)·깊이(depth) — 상호작용 시 올라갈 높이·앞뒤 정렬(가림)에 사용
      const plist = (isFriend && state._friendCam) ? state._friendCam.placedList : placedList();   // 친구 방이면 친구 가구로 상호작용
      const props = hasRoom ? plist.map(p=>{ const foot=itemFoot(p.itemId), depth=(12-(p.r+foot.h-1))/11;   // propMarkup과 동일(앞줄 기준)
        const fh=furnRoomH(p.itemId, isDock, depth);   // 렌더 높이와 동일 → 캣타워 층 lift가 실제 높이에 맞음
        // 가구는 좌측하단 앵커 → 그래픽 중앙 x = 좌측 edge + fh*aspect/2. 고양이가 이 중앙에 서서 상호작용(캣타워 중앙에 앉기).
        const leftEdge=(p.c-1)/12*W; return { x: leftEdge + fh*furnAspect(p.itemId)/2, itemId:p.itemId, fh, key:p.key, depth }; }) : [];
      // 고양이마다 성격(속도·유휴빈도·방향전환·가구선호)을 랜덤 부여 → 개별적으로 움직임
      // 스프라이트 고양이는 정사각(폭=높이), SVG 고양이는 가로세로비 ~26/14.
      const sid=stage.id||'s';   // 무대별 지속키 prefix — 같은 펫 id가 dock·내 방·친구 방에 동시에 있어도 x/depth가 안 섞이게
      return acts.map(el=>{ const id=el.getAttribute('data-cat'), spr=hasSprite(id), fw=!!(spr&&PET_SPRITES[id]&&PET_SPRITES[id].frontWalk);
        const pkey=(id!=null?sid+':'+id:null);
        const v=0.14+Math.random()*0.18;   // 속도 폭을 조금 좁혀 걸음이 차분하게(주기는 walkDur로 이동속도에 맞춤)
        const ah=+el.dataset.hh||hh;   // 펫별 렌더 높이(크기 배율 반영). 없으면 무대 기본값.
        const a={ el, id, pkey, spr, frontWalk:fw, x:(pkey&&_petX[pkey]!=null?_petX[pkey]:(parseFloat(el.style.left)||0)), dir:Math.random()<0.5?-1:1, _pdir:0,
        v:v, t:Math.random()*6, frame:0, fc:Math.random()*170, W, hh:ah,
        sw:(spr?ah:Math.round(ah*26/14)), props, lift:0,
        depth:(pkey&&_petDepth[pkey]!=null?_petDepth[pkey]:Math.random()), vz:(pkey&&_petVz[pkey]!=null?_petVz[pkey]:0), riseMax:riseMax, _z:0,   // 앞뒤(깊이) 원근 — 재빌드 시 이전 depth/vz 이어받아 순간이동 방지(신규 펫만 랜덤 시작)
        mode:'roam', pause:0, goal:null, pose:null, resKey:null, resFloor:null,
        // 유휴(그 자리에 멈춰 정면 보기) — 자주·오래 서서 정면을 보도록(poseDur에서 시간 늘림)
        idle:0.0032+Math.random()*0.005, turn:0.004+Math.random()*0.010, seek:0.005+Math.random()*0.009, cool:0 };
        a.footPad=(typeof _footPad!=='undefined'&&_footPad[id+':south']!=null?_footPad[id+':south']:null); if(spr) measureFootPad(id,function(fp){ a.footPad=fp; setXform(a); });
        a.x=Math.max(2, Math.min(a.x, Math.max(2, W-a.sw)));   // 지속된 x를 현재 무대 폭에 클램프(리사이즈/회전·무대전환 시 화면 밖 방지)
        setWalkDur(a); el.style.left='0px'; applyDepth(a); setXform(a); a._pdir=a.dir;   // 위치·올림·깊이·방향 전부 transform(합성). left는 0 고정 → 걷는 동안 메인스레드 페인트 0
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
      // 캣휠: 링 안쪽 바닥(정중앙)에 들어가 옆(east/west)을 보며 달리는 자세로 오래 머무름.
      if(it==='catwheel') return { lift:Math.round(fh*0.12), face:(Math.random()<0.5?'east':'west'), dx:0, pose:'sit', dur:30000+Math.random()*45000 };
      return { lift:0, face:'south', dx:0, pose:'loaf', dur:22000+Math.random()*26000 };
    }
    // 가구에 도착 → 자리 잡고 머무름(랜덤 시간). 스프라이트는 해당 방향 정지, SVG는 포즈. lift로 발판/방석 위로 올림.
    function enterInteract(a, id, goal){
      const s=furnSpot(a, goal);
      a.mode='pause'; a.pose=s.pose; a.pause=s.dur; a.cool=1700; a.lift=s.lift||0;
      // 고양이 중심을 가구 그래픽 중앙(goal.x)에 맞춤(+옆 오프셋 dx). 캣타워/방석은 dx=0이라 정중앙에 앉음.
      a.x=Math.max(2, Math.min(a.W-a.sw, goal.x - a.sw/2 + (s.dx||0)));
      if(goal.depth!=null) a.depth=goal.depth; applyDepth(a);   // 가구와 같은 깊이에 서서 크기·앞뒤 가림이 맞물리게
      const dir=a.spr?1:a.dir;
      if(a.spr) actorShowStill(a, s.face);
      else a.el.innerHTML=catPose(id, s.pose, {h:a.hh});
      setXform(a, dir); a._pdir=dir;   // 위치+lift(위에서 설정)+flip을 정적 transform 하나로
    }
    function enterPose(a, id, pose){ a.mode='pause'; a.pose=pose; a.pause=poseDur(pose); a.cool=1400;
      a.lift=0; applyDepth(a);   // 현재 깊이의 배율/올림/z 반영(그 자리에서 쉼 — 깊이는 유지)
      if(a.spr){ // 멈춰서 쉴 땐 항상 정면(south)을 본다. 이미지가 정방향이라 플립 없음(scaleX(1)).
        actorShowStill(a, 'south'); setXform(a, 1); a._pdir=1; }
      else { a.el.innerHTML=catPose(id, pose, {h:a.hh});
        setXform(a, a.dir); a._pdir=a.dir; } }
    // 가구 점유: 한 가구엔 1마리(캣타워만 3층=최대 3마리, 층당 1마리). resKey=예약한 가구, resFloor=캣타워 층(0~2). acts=같은 무대의 액터들(무대별로 따로 점유 판정).
    function occupantsOf(key, self, acts){ let n=0; const floors={}; (acts||[]).forEach(o=>{ if(o!==self && o.resKey===key){ n++; if(o.resFloor!=null) floors[o.resFloor]=true; } }); return {n, floors}; }
    function releaseRes(a){ a.resKey=null; a.resFloor=null; }
    function stepActors(dt, actors){
      actors.forEach(a=>{
        if(a.mode==='drag') return;   // 손으로 집어 든 펫은 엔진이 건드리지 않음(드래그가 위치 제어)
        a.t+=dt*0.004; if(a.cool>0)a.cool-=dt; if(a.dcool>0)a.dcool-=dt; const id=a.id;
        if(a.mode==='pause'){ a.pause-=dt; if(a.pause<=0){ a.mode='roam'; a.fc=999; a.dir=Math.random()<0.5?-1:1; a.lift=0; releaseRes(a);   // 내려와 재출발(자리 반납)
          // 이동 재개: 정면 이미지로 이동 금지 — actorShowMoving으로 일원화(일반=CSS 필름, frontWalk=east 정지스틸)
          actorShowMoving(a); setXform(a); a._pdir=a.dir; } return; }   // 재출발: lift 해제·방향 반영, 걷기는 필름(csprFilm)
        // 유휴 제스처(그 자리 앉기/식빵/낮잠) — 쿨다운 후에만
        if(a.mode==='roam' && a.cool<=0 && Math.random()<a.idle){ enterPose(a, id, ['loaf','sit','sleep'][Math.floor(Math.random()*3)]); return; }
        // 가끔 방향 전환(개별) — 쿨다운 지나야(연속 뒤집힘=춤 방지)
        if(a.mode==='roam' && (a.dcool||0)<=0 && Math.random()<a.turn){ a.dir*=-1; a.dcool=FLIP_COOL; }
        // 가끔 속도 변화(개별) — 바뀐 속도에 맞춰 걷기 주기도 갱신(미끄러짐 방지)
        if(a.mode==='roam' && Math.random()<0.003){ a.v=0.14+Math.random()*0.18; setWalkDur(a); }
        // ───── 캠 펫 움직임 속도 튜닝 가이드(아래 수치를 바꾸면 이렇게 바뀜) ─────
        //  · 좌우 걷기 속도 = a.v(0.14~0.32 px/ms 랜덤, 위 2090행) × dt×0.06(아래 이동식). a.v↑ = 좌우로 더 빨리 걸음.
        //  · 앞뒤(원근) '자유 배회' 속도 = 아래 vz 크기 0.000008 depth/ms. ↑ = 앞뒤로 더 자주/빨리 오감(현재 전체 0→1 이동 ≈120초). 0으로 두면 배회 시 앞뒤 정지.
        //  · 앞뒤 '가구로 이동'(goal) 속도 = x 접근 진척에 비례(대각선) + 근접 시 상한 0.00008 / 최소크롤 0.00003(2108행). ↑ = 가구로 더 빨리 다가감. (예전 0.004*dt = 순간이동 버그였음)
        //  · 겹침 분리 시 깊이 밀기 = 프레임당 상한 0.008(separatePets). ↑ = 겹쳤을 때 더 빨리 떨어지되 너무 크면 '훅' 튐.
        //  · 이동 리듬: 방향전환 확률 a.turn·재전환 쿨다운 FLIP_COOL(450ms)·자리앉기 a.idle·가구찾기 a.seek·속도변화 확률(2090행 0.003).
        // 앞뒤(깊이) 배회 — 가끔 앞/뒤 속도를 새로 정하고 천천히 이동해 가까워졌다 멀어졌다(원근·가림 변화).
        if(a.mode==='roam'){
          if(a.cool<=0 && Math.random()<0.006) a.vz=(Math.random()*2-1)*0.000008;   // depth/ms — 정면캠이라 앞뒤(원근) 이동은 좌우보다 훨씬 더 느리게(전체 범위 이동에 약 120초+, 살짝만 움직여도 크게 보이는 원근 왜곡 완화)
          if(a.vz){ a.depth+=a.vz*dt; if(a.depth<=0){a.depth=0;a.vz=Math.abs(a.vz);} else if(a.depth>=1){a.depth=1;a.vz=-Math.abs(a.vz);} }
        }
        // 가구로 이동 결정(가구 있을 때, 쿨다운 후)
        if(a.mode==='roam' && a.props.length && a.cool<=0 && Math.random()<a.seek){
          const avail=a.props.filter(p=>occupantsOf(p.key,a,actors).n < (p.itemId==='tower'?3:1));   // 빈 가구만(캣타워는 남은 층 있으면)
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
    // 열=x(W/12 폭), 행=depth(1/11 단위). 열이 같아도 행(깊이)이 다르면 앞뒤로 겹쳐 보이는 것이라 허용(원근·가림 유지).
    function separatePets(acts){
      if(!acts || acts.length<2) return;
      const colW=(acts[0].W||160)/12, rowD=1/11, moved=[];
      const mov=a=>(a.mode==='roam');   // 자유 로밍 펫만 분리 대상 — goal(가구로 가는)·pause(앉은)·drag는 겹침분리에 관여 안 함(가구로 가는 펫이 다른 펫에 안 막히고 겹쳐 지나감)
      for(let i=0;i<acts.length;i++) for(let j=i+1;j<acts.length;j++){
        const a=acts[i], b=acts[j];
        if(a.mode==='drag'||b.mode==='drag') continue;
        const dcx=(a.x+a.sw/2)-(b.x+b.sw/2), ddp=(a.depth||0)-(b.depth||0);
        if(Math.abs(dcx)>=colW || Math.abs(ddp)>=rowD) continue;   // 다른 칸 → 통과(다른 행이면 앞뒤 겹침 허용)
        const aMov=mov(a), bMov=mov(b); if(!aMov || !bMov) continue;   // 둘 다 로밍일 때만 분리(한쪽이 가구로 가거나 앉았으면 통과)
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
    function catLoop(ts){
      if(document.hidden){ _eng.raf=0; return; }   // 탭 숨김 → 루프 정지(복귀 시 visibilitychange로 재개, 유휴 배터리 절약)
      const dt=_eng.last?Math.min(50,ts-_eng.last):16; _eng.last=ts;
      // ⚠️ 한 프레임에서 예외가 나도 루프를 '영구' 종료시키지 않게 try/catch — 아래 requestAnimationFrame은 무조건 다시 예약(예전엔 예외 시 재예약이 건너뛰어져 앱 재시작 전까지 펫이 완전 정지했다).
      try{
        const want=activeStages();
        // 무대 집합이 바뀌었거나 dirty면 그룹 재구성 — 유지되는 무대의 액터는 재사용해 애니메이션 상태 보존, 새 무대만 buildActors.
        const changed=_eng.dirty || _eng.groups.length!==want.length || _eng.groups.some(g=>want.indexOf(g.stage)<0);
        if(changed){ _eng.groups=want.map(st=>{ const ex=_eng.dirty?null:_eng.groups.find(g=>g.stage===st); return ex||{ stage:st, actors:buildActors(st) }; }); _eng.dirty=false; }
        if(!reducedMotion()) _eng.groups.forEach(g=>{ if(g.actors.length) stepActors(dt, g.actors); });   // 모든 무대(dock + 열린 방)를 함께 굴림
      }catch(e){ /* 이 프레임만 건너뛰고 다음 프레임 계속 */ }
      _eng.raf=requestAnimationFrame(catLoop);
    }
    function startCatLoop(){ if(!_eng.raf && !(typeof document!=='undefined'&&document.hidden)) _eng.raf=requestAnimationFrame(catLoop); }
    if(typeof document!=='undefined') document.addEventListener('visibilitychange', function(){ if(!document.hidden){ _eng.last=0; startCatLoop(); } });   // 탭 복귀 시 루프 재개

    // ===== 캠/방에서 펫을 바로 끌어(드래그) 좌우로 이동 =====
    let _petDrag=null, _petJustDragged=false;
    function camTap(){ if(_petJustDragged) return; openCatHouse(); }   // 드래그 직후의 탭은 알뜰샵 열기 무시
    // 🐾 펫 애정도: 방/캠에서 펫을 탭해 쓰다듬기(펫별 3시간 쿨다운) → +1, 임계에서 레벨업. 실제 쓰다듬을 때만 하트 연출.
    let _affLevelUp=null, _petCdToast=0;
    const PET_COOLDOWN_MS=3*60*60*1000;   // 쓰다듬기 쿨다운 3시간(펫별, RTDB pettedAt로 지속)
    // 펫 쓰다듬기 연출: 좋아요와 동일한 픽셀 하트(heartSvg)가 위로 떠오르고 + 작은 하트들이 뿅 팝(likeBurst).
    function heartFx(x,y){ const cx=(x||innerWidth/2), cy=(y||innerHeight/2);
      const el=document.createElement('div'); el.className='heartfx'; el.innerHTML=(typeof heartSvg==='function')?heartSvg({h:22}):'❤';
      el.style.left=cx+'px'; el.style.top=cy+'px'; document.body.appendChild(el); setTimeout(()=>{ el.remove(); }, 820);
      if(typeof likeBurst==='function') likeBurst(cx,cy); }
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
    // 쓰다듬기: 펫별 3시간에 1번만(RTDB owned.cats[id].pettedAt로 지속). 쿨다운 중엔 하트 연출 없음 — 실제 쓰다듬었을 때만 액션.
    function bumpAffection(id, x, y){
      if(!id || !ownsCat(id)) return;
      const now=Date.now(), last=Number((ownedCatsMap()[id]||{}).pettedAt)||0;
      if(now-last < PET_COOLDOWN_MS){   // 쿨다운: 하트 없음. 남은 시간만 가끔 토스트로 안내(스팸 방지).
        if(now-_petCdToast>2500){ _petCdToast=now; const rem=PET_COOLDOWN_MS-(now-last), hh=Math.floor(rem/3600000), mm=Math.ceil((rem%3600000)/60000);
          toast(catName(id)+' 쓰다듬기는 3시간에 한 번 · '+(hh>0?hh+'시간 ':'')+mm+'분 후 가능'); }
        return; }
      _affLevelUp=null; let did=false;
      gameRef().transaction(g=>{ g=normalizeGame(g); const c=g.owned.cats[id]; if(!c){ did=false; return g; }
        if(now-(Number(c.pettedAt)||0) < PET_COOLDOWN_MS){ did=false; return g; }   // 트랜잭션 내 재확인(다기기 동시성)
        did=true; c.pettedAt=now;
        const before=affectionLevel(c.affection).level; c.affection=(Number(c.affection)||0)+1;
        const after=affectionLevel(c.affection).level;
        if(after>before){ _affLevelUp={ id, level:after, gold:0 };
          if(after>=5){ g.gold=(g.gold||0)+5; _affLevelUp.gold=5; }   // 애정 만렙(레벨5) 1회 도달 보상 — 레벨은 한 번만 오르므로 자동 멱등
        }
        return g;
      }).then(res=>{ if(res&&res.committed&&did){ heartFx(x,y);   // 실제 쓰다듬었을 때만 하트 액션
        if(_affLevelUp){ const g=_affLevelUp.gold; toast('❤ '+catName(_affLevelUp.id)+' 애정 레벨 '+_affLevelUp.level+(g?' · 만렙! 금화 +'+g:'')+'!'); _affLevelUp=null; }
        else toast('❤ '+catName(id)+' 쓰다듬기 · 애정 +1'); } });
    }
    function petGrabDown(e){
      const el=(e.target&&e.target.closest)?e.target.closest('.cd-actor'):null; if(!el) return;
      let a=null; for(let gi=0;gi<_eng.groups.length;gi++){ const f=_eng.groups[gi].actors.find(x=>x.el===el); if(f){ a=f; break; } }   // 여러 무대 중 이 액터가 속한 무대에서 찾음
      if(!a) return;
      e.preventDefault();   // 캠 이미지가 선택/네이티브 드래그되는 것 방지
      const stage=el.parentElement, sx=e.clientX, pid=e.pointerId; let started=false, lastX=e.clientX;   // pid: 멀티터치 시 이 포인터 이벤트만 처리(다른 손가락이 다른 펫을 같이 끌던 버그 방지)
      const begin=()=>{ started=true; _petDrag=a; a.mode='drag'; a.goal=null; if(typeof releaseRes==='function') releaseRes(a);
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

    // ================= 고양이집 시트 (홈 · 알뜰샵 · 미션) =================
    let _catTab='home';
    function openCatHouse(tab){ _catTab=tab||'home'; renderCatHouse(); }
    function setCatTab(t){ _catTab=t; renderCatHouse(); }
    // 알뜰 아이콘 = 소식 전용 화면(탭 없음). 미션은 더보기 '미션'으로 분리.
    function openNews(){ markNewsSeen(); openSheet('소식', catNewsHtml()); }
    function openMissions(){ openSheet('오늘의 미션', catMissionHtml()); }
    function renderCatHouse(){
      if(!state.game) state.game=normalizeGame(null);   // 스냅샷 도착 전 안전 가드
      const build=()=>{
        // 상단(금화·은화 + 홈/알뜰샵/배치/미션 탭)은 스크롤해도 고정(sticky), 그 아래 콘텐츠만 스크롤
        let h='<div class="cathead"><div class="coinbar"><span class="coin"><span class="ci">'+goldSvg({h:20})+'</span>'+gold().toLocaleString()+(atMaxGold()?maxChip():'')+'<small>금화</small></span><span class="coin"><span class="ci">'+coinSvg({h:20})+'</span>'+coins().toLocaleString()+(atMaxCoins()?maxChip():'')+'<small>은화</small></span></div>';
        h+='<div class="catseg">'+[['home','홈'],['shop','알뜰샵'],['place','배치']].map(function(t){ return '<button class="'+(_catTab===t[0]?'on':'')+'" onclick="setCatTab(\''+t[0]+'\')">'+t[1]+'</button>'; }).join('')+'</div>';
        if(_catTab==='shop') h+=shopSubsegHtml();   // 알뜰샵 서브탭도 sticky 헤더 안에서 고정
        h+='</div>';   // .cathead 닫기(여기까지 sticky)
        if(_catTab==='shop') h+=catShopHtml();
        else if(_catTab==='place') h+=catPlaceHtml();
        else h+=catHomeHtml();   // home(및 미상 탭) → 홈
        return h;
      };
      openSheet('알뜰홈', build());
      state._sheetRefresh=()=>{ if(_drag||_pal||_rmDrag) return;   // 드래그(배치) 중엔 재렌더 스킵 — 드래그 요소가 뜯겨 스크롤 잠금이 남는 것 방지(드래그 끝나면 배치 커밋이 다시 리프레시)
        const b=$('sheetBody'); if(!b) return; const st=b.scrollTop;
        const _ae=document.activeElement, _sf=!!(_ae&&_ae.classList&&_ae.classList.contains('petsearch')), _ss=_sf?_ae.selectionStart:0, _se=_sf?_ae.selectionEnd:0;   // 검색 입력 포커스/커서 보존(백그라운드 갱신이 입력 중 포커스를 뺏지 않게)
        const pal=b.querySelector('.palette'); const palL=pal?pal.scrollLeft:0;   // 배치 팔레트(가로 스크롤) 위치 보존 — 스크롤해 아이템 선택 시 처음으로 안 튀게(우리집 펫은 세로 그리드라 세로 scrollTop만 보존)
        const keepGrid=(_catTab==='home')?b.querySelector('#petGrid'):null;   // 기존 펫 그리드 노드 보존(빈 placeholder로 되붙여 수백 타일 재파싱·이미지 리로드 회피)
        b.innerHTML=build();
        if(_catTab==='home'){ const ph=b.querySelector('#petGrid'); if(keepGrid && ph) ph.replaceWith(keepGrid); renderPetGrid(); }   // 되살린 그리드에 바뀐 타일만 갱신(없으면 채움)
        b.scrollTop=st;
        if(_sf){ const _ns=b.querySelector('.petsearch'); if(_ns){ try{ _ns.focus(); _ns.setSelectionRange(_ss,_se); }catch(_){} } }   // 검색 포커스·커서 복원
        const npal=b.querySelector('.palette'); if(npal) npal.scrollLeft=palL;
        if(_catTab==='home') mountRoomWalk(); };
      if(_catTab==='home'){ setTimeout(mountRoomWalk, 30); renderPetGrid(); }
    }
    // 방 미니 미리보기 썸네일(프리셋): 벽지 bg + 가구 위치 축소 + 이름 + 펫수. 탭=전환, ✎=이름변경.
    function roomThumb(r, idx){
      const on=idx===roomIdx(); r=r||{};
      const placed=r.placed||{};
      const dots=Object.keys(placed).map(k=>{ const pr=k.split('_'), rr=+pr[0], cc=+pr[1], foot=itemFoot(placed[k].itemId);
        return '<i class="rmf" style="left:'+((cc-1)/12*100).toFixed(1)+'%;top:'+((rr-1)/12*100).toFixed(1)+'%;width:'+(foot.w/12*100).toFixed(1)+'%;height:'+(foot.h/12*100).toFixed(1)+'%"></i>'; }).join('');
      const pets=(r.active||[]).filter(ownsCat).length;
      const rep=idx===(homeH().showRoom|0);   // 대표 방(친구·랭킹 노출)
      return '<div class="rmthumb'+(on?' on':'')+'" role="button" tabindex="0" aria-pressed="'+on+'" onpointerdown="rmDown(event,'+idx+')" onclick="rmTap('+idx+')" title="'+escapeHtml(r.name||('방 '+(idx+1)))+(rep?' · 대표 방':'')+'">'+
        '<span class="rmscene" style="background:'+wallCss(r.wallpaper||'default')+'">'+dots+'</span>'+
        (rep?'<span class="rmrep" role="img" aria-label="대표 방(친구에게 보이는 방)" title="대표 방(친구에게 보이는 방)">★</span>':'')+
        '<span class="rmbar"><span class="rmname">'+(r.emoji?r.emoji+' ':'')+escapeHtml(r.name||('방 '+(idx+1)))+'</span><span class="rmpets">🐾'+pets+'</span></span>'+
        '<button class="rm-edit" aria-label="방 관리" onclick="event.stopPropagation();openRoomMenu('+idx+')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>'+
      '</div>';
    }
    function roomStripHtml(){
      const rooms=homeH().rooms||[], rc=roomCount();
      let h='<div class="sech"><span class="l">내 방</span><span class="s">'+rc+' / '+MAX_ROOMS+'</span></div><div class="rmstrip">';
      for(let i=0;i<rc;i++) h+=roomThumb(rooms[i]||{},i);
      if(rc<MAX_ROOMS) h+='<button class="rmthumb locked" onclick="buyRoom()" aria-label="방 확장(금화 '+ROOM_PRICE+')"><span class="rmlock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span><span class="rmgold">'+goldSvg({h:12})+ROOM_PRICE+'</span></button>';
      return h+'</div>';
    }
    // ===== 우리집 펫 리스트 정렬·검색(수백 마리 관리) =====
    let _petSort='recent', _petQuery='';
    const PET_SORTS=[['recent','최근 획득'],['tier','등급↑'],['aff','애정↑'],['species','종류'],['name','이름']];
    function setPetSort(v){ _petSort=v||'recent'; if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    function setPetQuery(v){ _petQuery=v||''; applyPetFilter(); }   // 재렌더 없이 DOM만 숨김/표시(입력 포커스·커서 유지)
    function applyPetFilter(){ const q=(_petQuery||'').trim().toLowerCase(); const box=$('petGrid'); if(!box) return; let shown=0;
      box.querySelectorAll('.catchip').forEach(el=>{ const nm=(el.getAttribute('data-name')||'').toLowerCase(); const ok=!q||nm.indexOf(q)>=0; el.style.display=ok?'':'none'; if(ok) shown++; });
      const em=document.getElementById('petSearchEmpty'); if(em) em.style.display=(q&&!shown)?'':'none'; }
    // 소유 펫 정렬 — recent(최근 획득)·tier(등급↑, 한정 먼저)·aff(애정↑)·species(종류)·name(이름). 필터(검색)는 표시 단계에서.
    function sortOwnedPets(ids){ const l=ids.slice();
      const rank=id=>tierRank(CAT_TIER[id]||'normal'), aff=id=>Number((ownedCatsMap()[id]||{}).affection)||0, bat=id=>((ownedCatsMap()[id]||{}).boughtAt)||'', nm=id=>catName(id)||'', spc=id=>{ const c=PET_CATALOG.find(x=>x.id===id); return (c&&c.species)||''; };
      if(_petSort==='tier') l.sort((a,b)=> rank(b)-rank(a) || bat(b).localeCompare(bat(a)));
      else if(_petSort==='aff') l.sort((a,b)=> aff(b)-aff(a) || nm(a).localeCompare(nm(b)));
      else if(_petSort==='species') l.sort((a,b)=> spc(a).localeCompare(spc(b)) || nm(a).localeCompare(nm(b)));
      else if(_petSort==='name') l.sort((a,b)=> nm(a).localeCompare(nm(b)));
      else l.sort((a,b)=> bat(b).localeCompare(bat(a)));   // recent
      return l; }
    function petCtlBar(){ return '<div class="petctl"><select class="petsort" aria-label="펫 정렬" onchange="setPetSort(this.value)">'+PET_SORTS.map(o=>'<option value="'+o[0]+'"'+(_petSort===o[0]?' selected':'')+'>'+o[1]+'</option>').join('')+'</select>'+
      '<input class="petsearch" type="search" inputmode="search" placeholder="이름 검색" value="'+escapeHtml(_petQuery)+'" oninput="setPetQuery(this.value)" aria-label="펫 이름 검색"></div>'; }
    // ===== 우리집 펫 그리드: 타일 단위 메모이즈(수백 마리 재파싱·이미지 리로드 회피) =====
    // 타일 콘텐츠 시그니처 — 상태(방)·현재방·애정레벨·이름이 바뀐 타일만 다시 그린다.
    function petTileSig(id){ const ro=petRoomIndex(id); const here=ro===roomIdx(); const rooms=homeH().rooms||[];
      const rnm=(ro>=0&&!here)?((rooms[ro]&&rooms[ro].name)||('방 '+(ro+1))):'';   // elsewhere일 때만 방이름 뱃지 표시 → 시그니처에 포함(방 전환/이름변경 시 필요한 타일만 갱신)
      const lv=affectionLevel((ownedCatsMap()[id]||{}).affection).level; return (here?'H':ro)+'|'+rnm+'|'+lv+'|'+catName(id)+'|'+(CAT_TIER[id]||'normal'); }   // tier 포함(이름색·한정 연출은 등급에 의존 → applyCatalog로 등급만 바뀌어도 갱신)
    function petTileHtml(id){
      const rooms=homeH().rooms||[]; const roomOf=petRoomIndex(id), here=roomOf===roomIdx();
      const roomNm=roomOf>=0?((rooms[roomOf]&&rooms[roomOf].name)||('방 '+(roomOf+1))):'';
      const lv=affectionLevel((ownedCatsMap()[id]||{}).affection).level;
      const stt=here?'이 방':(roomOf>=0?roomNm:'대기');
      return '<div class="catchip'+(here?' on':(roomOf>=0?' elsewhere':''))+'" data-id="'+id+'" data-tsig="'+escapeHtml(petTileSig(id))+'" data-name="'+escapeHtml(catName(id))+'" role="button" tabindex="0" aria-pressed="'+here+'" onclick="toggleActiveCat(\''+id+'\')" title="'+escapeHtml(catName(id))+' · '+escapeHtml(stt)+' · Lv.'+lv+'">'+
        '<div class="cpic">'+catFace(id,{h:44})+'</div>'+
        (roomOf>=0&&!here?'<span class="croom">'+escapeHtml(roomNm)+'</span>':'')+
        (here?'<span class="csel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></span>':'')+
        '<button class="cn-edit" aria-label="이름 짓기" onclick="event.stopPropagation();openRenameCat(\''+id+'\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>'+
        '<div class="cn">'+catNameSpan(id,catName(id))+'</div>'+
        '<div class="clv" aria-label="애정 레벨 '+lv+'"><span class="clv-h">'+heartSvg({h:9})+'</span>Lv.'+lv+'</div>'+
      '</div>';
    }
    // #petGrid 갱신: 정렬 순서가 같으면 시그니처 바뀐 타일만 교체(in-place, 펫 탭=1개만), 순서 바뀌면(정렬 변경) 통째로.
    function renderPetGrid(){
      const el=$('petGrid'); if(!el) return;
      const ids=sortOwnedPets(ownedCatList());
      const orderSig=_petSort+'|'+ids.join(',');
      if(el.getAttribute('data-order')===orderSig && el.childElementCount===ids.length){
        const kids=el.children;
        for(let i=0;i<ids.length;i++){ const id=ids[i], c=kids[i]; if(c.getAttribute('data-tsig')!==petTileSig(id)){
          const tmp=document.createElement('div'); tmp.innerHTML=petTileHtml(id); const nn=tmp.firstElementChild; if(nn) el.replaceChild(nn,c); } }
      } else {
        el.setAttribute('data-order', orderSig);
        el.innerHTML=ids.map(petTileHtml).join('');
      }
      if((_petQuery||'').trim()) applyPetFilter();   // 검색 중이면 새 타일 표시 반영(검색어 없으면 전부 표시라 생략)
    }
    function catHomeHtml(){
      reconcilePets();   // 3시간 지난 그릇 비우고 똥 정산(멱등)
      const cats=activeCats();
      // 배치된 가구를 방 바닥에 매핑. 그릇=탭 급여·채움 반영, 화장실=똥 수거(공용 헬퍼).
      const list=placedList().sort((a,b)=>a.r-b.r); distributePoops(list);
      const litters=list.filter(p=>p.itemId==='litterbox');
      const props=list.map(p=>propMarkup(p,false,false,true)).join('');   // live=true → 홈 LIVE 캠 연출
      const roomName=(room().name)||'우리집';
      let h=roomStripHtml()+'<div class="catroom" id="catRoom"><div class="cr-wall" style="background:'+wallCss(currentWall())+'"></div><div class="cr-floor"></div><div class="cr-base"></div><span class="cr-cam"><i></i>LIVE · '+escapeHtml(roomName)+'</span>'+batchBtnHtml()+'<div class="cr-props">'+props+'</div><div class="cr-stage" id="crStage"></div></div>';
      // 빈 방(가구·펫 없음) 안내 — 방 확장 직후 '사라진 것처럼' 보이는 혼동 방지
      if(!list.length && !cats.length) h+='<div class="hintline" style="margin:8px 0 0;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>새 방이에요! 아래에서 <b>펫을 내보내고</b>, <b>배치</b> 탭에서 가구를 놓아보세요. (다른 방과 따로 저장돼요)</div>';
      // 안내: 그릇 채우기 / 똥 수거
      const poops=room().poops||0;
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
      if(!owned.length) h+='<div class="empty" style="padding:20px;">아직 펫이 없어요. 알뜰샵에서 입양해 보세요 🐾</div>';
      else { if(owned.length>=5) h+=petCtlBar();
        // 수집형 인벤토리 그리드(5열·세로). 타일은 renderPetGrid가 채우고 타일 단위로 메모이즈(수백 마리 재파싱 회피). 걷는 모습은 위 방 무대에.
        h+='<div class="catchips" id="petGrid"></div>';
        h+='<div id="petSearchEmpty" class="empty" style="display:none;padding:14px;">검색 결과가 없어요</div>';
        h+='<div class="hintline" style="margin-top:10px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>펫을 탭하면 <b>이 방</b>으로 옮겨져요(한 펫은 한 방에만, 방당 최대 '+sc+'마리). 다시 탭하면 대기.'+(sc<MAX_SLOTS?' 잠금 슬롯은 금화 '+SLOT_PRICE+'로 확장.':'')+'</div>'; }
      return h;
    }
    function mountRoomWalk(){
      const stage=$('crStage'); if(!stage) return;
      const list=activeCats().slice(0,slotCount());
      ensurePetArtMany(list);   // 방에 보이는 소유 펫 아트 선로드(지연)
      stage.dataset.hh=64;
      const sig='c:'+list.join(',');   // 같은 고양이면 재생성 안 함(애니메이션 유지)
      if(stage.dataset.sig===sig && stage.querySelector('.cd-actor')) return;
      stage.dataset.sig=sig;
      stage.innerHTML=list.map((id,i)=>{ const s=petActorPx(id,64,200); return '<div class="cd-actor" data-cat="'+id+'" data-hh="'+s+'" style="left:'+(20+i*64)+'px;">'+catActorHTML(id,s)+'</div>'; }).join('');
      markCatDirty();   // 통합 엔진이 시트 방 무대를 자동으로 잡아 애니메이션
    }
    // ===== 친구 집(펫캠) — 남의 game으로 읽기전용 방 렌더 + 로밍(엔진 재사용) =====
    // 친구 game에서 활성 펫/가구 목록 도출(내 state.game 비참조). 친구의 '현재 방'을 본다(레거시 flat 폴백).
    // 친구/랭킹 캠은 '대표 방(showRoom)'을 보여준다(사적인 방 노출 방지). showRoom 없으면 current, 레거시는 flat.
    function friendRoom(fg){ const h=(fg&&fg.home)||{}; if(Array.isArray(h.rooms)&&h.rooms.length){ const i=Math.min(h.rooms.length-1, Math.max(0, (h.showRoom!=null?h.showRoom:h.current)|0)); return h.rooms[i]||h.rooms[0]; } return h; }
    function friendActiveCats(fg){ const a=friendRoom(fg).active||[]; const owned=(fg.owned&&fg.owned.cats); return owned?a.filter(id=>owned[id]):a.slice(); }   // homeCam 스냅샷은 owned 없이 active를 그대로 신뢰
    function friendPlacedList(fg){ const p=friendRoom(fg).placed||{}; return Object.keys(p).map(k=>({ key:k, r:+k.split('_')[0], c:+k.split('_')[1], itemId:p[k].itemId })); }
    // 친구 방 HTML(.catroom + #frStage). name=친구 닉네임.
    function friendRoomHtml(fg, name){
      const wall=friendRoom(fg).wallpaper||'default';
      const props=friendPlacedList(fg).sort((a,b)=>a.r-b.r).map(p=>propMarkup(p,false,true,true)).join('');   // plain=true(읽기전용·똥/탭 없음) + live=true(캣휠·화분·캣타워·스크래처 연출은 친구 방에서도 움직이게)
      return '<div class="catroom" id="friendRoom"><div class="cr-wall" style="background:'+wallCss(wall)+'"></div><div class="cr-floor"></div><div class="cr-base"></div>'+
        '<span class="cr-cam"><i></i>LIVE · '+escapeHtml(name||'친구')+'의 집</span>'+
        '<div class="cr-props">'+props+'</div><div class="cr-stage" id="frStage"></div></div>';
    }
    // 친구 방 무대에 친구 펫을 배치 → 통합 엔진(activeStage가 frStage 우선)이 로밍시킴.
    function mountFriendRoom(fg){
      const stage=$('frStage'); if(!stage) return;
      const list=friendActiveCats(fg).slice(0, Math.min(MAX_SLOTS, Math.max(BASE_SLOTS, (fg.home&&fg.home.slots)||BASE_SLOTS)));
      ensurePetArtMany(list);
      stage.dataset.hh=64;
      stage.innerHTML=list.map((id,i)=>{ const s=petActorPx(id,64,200); return '<div class="cd-actor" data-cat="'+id+'" data-hh="'+s+'" style="left:'+(20+i*64)+'px;">'+catActorHTML(id,s)+'</div>'; }).join('');
      markCatDirty();
    }
    let _shopSub='cats';
    function setShopSub(s){ _shopSub=s; renderCatHouse(); }
    // 알뜰샵에서 미리보기로 "선택"한 펫 — 선택하면 카드가 강조되고 썸네일이 옆으로 걷는 스프라이트(우리집 펫 카드와 동일)로 바뀐다.
    let _shopSelCat=null;
    function selectShopCat(id){ _shopSelCat=(_shopSelCat===id?null:id); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    // 알뜰샵 서브탭(펫/가구/소비/벽지/이벤트) — cathead(sticky) 안에 넣어 스크롤해도 상단 고정. '펫'=구 '고양이'(호랑이·사자 등 포함이라 펫으로 통일).
    function shopSubsegHtml(){
      const tabs=[['cats','펫'],['furn','가구'],['consum','소비'],['wall','벽지'],['event','이벤트']];
      return '<div class="subseg">'+tabs.map(function(t){ return '<button class="'+(_shopSub===t[0]?'on':'')+'" onclick="setShopSub(\''+t[0]+'\')">'+t[1]+'</button>'; }).join('')+'</div>';
    }
    function catShopHtml(){
      let h='';
      if(_shopSub==='consum'){
        h+=CONSUM_CATALOG.map(c=>{
          const enough=coins()>=c.price;
          const act=enough?'<button class="buy" aria-label="'+c.name+' 구매('+c.price+' 은화)" onclick="buyConsum(\''+c.id+'\')">구매</button>':'<button class="buy dis" disabled>부족</button>';
          return '<div class="shopcard"><div class="thumb"><span class="furnfit">'+consumSvg(c.id,{fit:true})+'</span></div>'+
            '<div class="meta"><b>'+c.name+' <span class="tagmini">소비</span></b><div class="desc">'+c.desc+'</div>'+
            '<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+c.price+'</span></div>'+
            '<div class="act">'+act+'<span class="qty">보유 '+consumQty(c.id).toLocaleString()+(consumQty(c.id)>=MAX_CONSUM?maxChip():'')+'</span></div></div>';
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
        // ✨ 무지개알/무지개박스 — 금화로 구매하는 소비템(특별↑ 확정). 보유하면 "사용"으로 오픈.
        const rb=[['egg','무지개알','열면 특별90 · 전설8 · 한정2%. 특별↑ 고양이만!', rainbowEggSvg({h:66,cls:'rb-thumb'})],
                  ['box','무지개박스','열면 특별90 · 전설8 · 한정2%. 특별↑ 가구만!', rainbowBoxSvg({h:56,cls:'rb-thumb'})]];
        h+='<div class="rb-hh"><span class="tier-limited">✨ 무지개</span> · 금화 전용 · 특별↑ 확정</div>';
        h+=rb.map(([k,nm,desc,art])=>{ const key=rainbowKey(k), qty=consumQty(key), price=rbPriceGold(k), canBuy=gold()>=price;
          const buy=canBuy?'<button class="buy" aria-label="'+nm+' 구매(금화 '+price+')" onclick="buyRainbow(\''+k+'\')">구매</button>':'<button class="buy dis" disabled>금화 '+(price-gold())+' 부족</button>';
          const use=qty>0?'<button class="buy rb-use" aria-label="'+nm+' 사용" onclick="useRainbow(\''+k+'\')">사용</button>':'';
          return '<div class="shopcard rb-card"><div class="thumb rb-thumb-wrap">'+art+'</div>'+
            '<div class="meta"><b class="tier-limited">'+nm+'</b><div class="desc">'+desc+'</div>'+
            '<span class="price"><span class="ci">'+goldSvg({h:16})+'</span>'+price+'</span></div>'+
            '<div class="act">'+buy+use+'<span class="qty">보유 '+qty.toLocaleString()+(qty>=MAX_CONSUM?maxChip():'')+'</span></div></div>'; }).join('');
        h+='<div class="note">열 때마다 <b>금화 1개</b> 지급(무지개 제외·중복 펫은 <b>그 펫 가격의 20% 은화</b> 환급). <b>특별 등급 이상</b>은 펫알/랜덤박스로만 나오며, <b class="tier-limited">무지개</b>는 <b>금화로 구매·사용</b>해 특별↑을 확정으로 뽑아요.</div>';
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
        // 등급 낮은 것부터 높은 순으로 정렬. 특별(epic) 이상은 알뜰샵 직접 구매 불가 → 펫알(가챠) 전용 표기.
        const cats=PET_CATALOG.slice().sort((a,b)=>tierRank(petTierOf(a.id))-tierRank(petTierOf(b.id)));
        // 🌟 이달의 펫 배너(미보유·구매 가능한 등급일 때만 강조)
        { const fid=featuredCatId();
          if(fid){ const fc=PET_CATALOG.find(x=>x.id===fid); if(fc){
            h+='<div class="featbanner"><span class="fstar">'+sparkSvg({h:20})+'</span><div class="fb-txt"><b>'+monthLabelKo()+' 이달의 펫 · '+catNameSpan(fid,fc.name)+'</b><span class="s">이번 달만 '+Math.round(FEATURED_DISCOUNT*100)+'% 할인 — '+catBuyPrice(fid)+' 은화'+(ownsCat(fid)?' (보유 완료)':'')+'</span></div><span class="fb-face">'+catFace(fid,{h:40})+'</span></div>'; } } }
        h+=cats.map(c=>{
          const owned=ownsCat(c.id), sel=_shopSelCat===c.id, gachaOnly=isGachaOnlyCat(c.id);
          const feat=isFeaturedCat(c.id), bp=catBuyPrice(c.id), enough=coins()>=bp;
          let act, priceHtml;
          if(gachaOnly){
            priceHtml='<span class="price gachaonly">'+eggSvg(0,{h:16})+'<b class="tier-limited">펫알 전용</b></span>';
            act= owned ? owntag : '<button class="buy ghost" aria-label="'+c.name+'은 펫알에서 뽑기" onclick="event.stopPropagation();setShopSub(\'event\')">펫알 뽑기</button>';
          } else {
            priceHtml= feat
              ? '<span class="price feat"><span class="ci">'+coinSvg({h:16})+'</span><s class="oldp">'+c.price+'</s> '+bp+'</span>'
              : '<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+c.price+'</span>';
            act= owned ? owntag : (enough ? '<button class="buy" aria-label="'+c.name+' 구매('+bp+' 은화)" onclick="event.stopPropagation();buyCat(\''+c.id+'\')">구매</button>' : '<button class="buy dis" disabled>'+(bp-coins())+' 부족</button>');
          }
          // 선택하면 우리집 펫 카드처럼 옆으로 걷는 스프라이트로, 아니면 정면 정지 썸네일. 선택 시 체크 배지.
          const art=sel?catActorHTML(c.id,72):catFace(c.id,{h:72});
          return '<div class="shopcard petpick'+(sel?' sel':'')+(feat?' feat':'')+'" role="button" tabindex="0" aria-pressed="'+sel+'" onclick="selectShopCat(\''+c.id+'\')"><div class="thumb"><div class="fl"></div>'+art+
            (feat?'<span class="featrib">'+sparkSvg({h:12})+' 이달의 펫</span>':'')+
            (sel?'<span class="psel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></span>':'')+'</div>'+
            '<div class="meta"><b>'+catNameSpan(c.id,c.name)+' <span class="tagmini">'+speciesLabel(c.id)+'</span></b><div class="desc">'+c.desc+'</div>'+
            priceHtml+'</div>'+
            '<div class="act">'+act+'</div></div>';
        }).join('');
        h+='<div class="note">펫을 <b>탭하면 선택</b>돼요 — 카드가 강조되고 미리보기 펫이 <b>옆으로 걸어다녀요</b>. <b>중복 소유</b> 펫은 종당 1마리, 구매하면 자동으로 집에 들어와 걸어다녀요.</div>';
      } else {
        // 등급 낮은 것부터. 특별(epic) 이상 가구는 알뜰샵 직접 구매 불가 → 랜덤박스(가챠) 전용 표기.
        const items=ITEM_CATALOG.slice().sort((a,b)=>tierRank(itemTierOf(a.id))-tierRank(itemTierOf(b.id)));
        h+=items.map(it=>{
          const enough=coins()>=it.price, gachaOnly=isGachaOnlyItem(it.id);
          let act, priceHtml;
          if(gachaOnly){
            priceHtml='<span class="price gachaonly">'+boxSvg({h:16})+'<b class="tier-limited">랜덤박스 전용</b></span>';
            act='<button class="buy ghost" aria-label="'+it.name+'은 랜덤박스에서 뽑기" onclick="setShopSub(\'event\')">랜덤박스 뽑기</button>';
          } else {
            priceHtml='<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+it.price+'</span>';
            act=enough?'<button class="buy" aria-label="'+it.name+' 구매('+it.price+' 은화)" onclick="buyItem(\''+it.id+'\')">구매</button>':'<button class="buy dis" disabled>'+(it.price-coins())+' 부족</button>';
          }
          return '<div class="shopcard"><div class="thumb"><span class="furnfit">'+furnSvg(it.id,{fit:true})+'</span></div>'+
            '<div class="meta"><b>'+it.name+'</b><div class="desc">'+it.desc+'</div>'+
            priceHtml+'</div>'+
            '<div class="act">'+act+'<span class="qty">보유 '+itemQty(it.id)+'</span></div></div>';
        }).join('');
        h+='<div class="note"><b>수량 허용</b> 가구는 여러 개 살 수 있어요. <b>특별 등급 이상</b>(펫하우스·캣타워)은 <b>랜덤박스</b>로만 얻어요. 구매 후 <b>배치</b> 탭에서 격자에 놓습니다.</div>';
      }
      return h;
    }
    // ---- 가구 인벤토리/배치 ----
    function itemQty(id){ const it=state.game&&state.game.owned.items[id]; return it?(Number(it.qty)||0):0; }
    function placedList(){ const p=room().placed||{}; return Object.keys(p).map(k=>({key:k, r:+k.split('_')[0], c:+k.split('_')[1], itemId:p[k].itemId})); }
    function itemPlaced(id){ return placedList().filter(x=>x.itemId===id).length; }          // 현재 방 배치 수(케어 아이템 방당 상한용)
    function itemPlacedAll(id){ return sumPlacedItem(homeH().rooms, id); }                    // 전 방 배치 합(전역 인벤토리 소진 — 복제 방지)
    function itemRemaining(id){ return itemQty(id)-itemPlacedAll(id); }                       // 남은 수량 = 보유 - 모든 방 배치
    function buyItem(id){
      const it=ITEM_CATALOG.find(x=>x.id===id); if(!it) return;
      if(isGachaOnlyItem(id)){ toast('이 등급은 랜덤박스(가챠)로만 얻을 수 있어요'); setShopSub('event'); return; }
      if(coins()<it.price){ toast((it.price-coins())+' 은화 부족', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); if(g.coins<it.price) return;
        g.coins-=it.price; g.owned.items[id]=g.owned.items[id]||{qty:0,boughtAt:new Date().toISOString()};
        g.owned.items[id].qty=(Number(g.owned.items[id].qty)||0)+1; return g;
      }).then(res=>{ if(res.committed) toast(it.name+' 구매! 배치 탭에서 놓아보세요'); });
    }
    // ===== 🍚💧 다마고치: 사료·물 소비 / 급여 / 배변 / 똥 수거 =====
    function consumQty(id){ return clampConsum((state.game&&state.game.consum&&state.game.consum[id]))||0; }
    // 소비 아이템 구매(1은화, 배치 불가)
    function buyConsum(id){
      const c=CONSUM_CATALOG.find(x=>x.id===id); if(!c) return;
      if(consumQty(id)>=MAX_CONSUM){ toast(c.name+' 최대 보유량이에요('+MAX_CONSUM.toLocaleString()+'개)', true); return; }   // 캡 도달 시 구매 차단(은화 낭비 방지)
      if(coins()<c.price){ toast((c.price-coins())+' 은화 부족', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); if(g.coins<c.price || (Number(g.consum[id])||0)>=MAX_CONSUM) return;
        g.coins-=c.price; g.consum[id]=(Number(g.consum[id])||0)+1; return g;
      }).then(res=>{ if(res.committed) toast(c.name+' +1'); });
    }
    // 채워진 상태인지(채운 뒤 3시간 이내)
    function isFilled(key){ const p=room().placed[key]; return !!(p&&p.filledAt&&(Date.now()-p.filledAt)<FILL_MS); }
    // 홈에서 밥/물 그릇 탭 → 사료/물 1 소모하고 채움(이미 차 있으면 무시)
    function feedBowl(key){
      const p=room().placed[key]; if(!p) return;
      const id=p.itemId; if(id!=='bowl'&&id!=='waterbowl') return;
      if(isFilled(key)){ toast('아직 남아 있어요'); return; }
      const need=id==='bowl'?'food':'water', nm=id==='bowl'?'사료':'물';
      if(consumQty(need)<=0){ toast(nm+'가 없어요 · 알뜰샵 소비 탭에서 구매', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g);
        const R=gRoom(g); if((Number(g.consum[need])||0)<=0 || !R.placed[key]) return;
        g.consum[need]-=1; R.placed[key].filledAt=Date.now(); return g;
      }).then(r=>{ if(r&&r.committed) toast(id==='bowl'?'밥을 채웠어요 🍚':'물을 채웠어요 💧'); });
    }
    // 채워진 지 3시간 지난 그릇을 비우고, 비운 개수만큼 똥을 쌓는다(멱등: filledAt 지우면 재발동 안 함)
    function reconcilePets(){
      const g=state.game; if(!g||!g.home) return;
      const now=Date.now();   // 모든 방의 그릇을 점검(안 보는 방도 3h 뒤 비워지며 그 방 똥 누적)
      let expired=0; (g.home.rooms||[]).forEach(r=>{ const pl=(r&&r.placed)||{}; Object.keys(pl).forEach(k=>{ const e=pl[k]; if(e&&e.filledAt&&(now-e.filledAt)>=FILL_MS) expired++; }); });
      if(!expired) return;
      gameRef().transaction(gg=>{ gg=normalizeGame(gg); const n=Date.now();
        (gg.home.rooms||[]).forEach(R=>{ const pl=R.placed||{}; let poop=0;
          const hasLitter=Object.keys(pl).some(k=>pl[k]&&pl[k].itemId==='litterbox');   // 화장실 있는 방에서만 똥 누적(없으면 그릇만 비움) — '안 보이는 똥'을 batchCare가 보상하던 문제 차단
          Object.keys(pl).forEach(k=>{ const e=pl[k]; if(e&&e.filledAt&&(n-e.filledAt)>=FILL_MS){ e.filledAt=null; poop++; } });
          if(poop && hasLitter) R.poops=(Number(R.poops)||0)+poop; });
        return gg;
      });
    }
    // 똥 수거 → 은화 +2, 작은 획득 연출
    function collectPoop(e){
      if(e){ e.stopPropagation(); }
      const x=e?e.clientX:innerWidth/2, y=e?e.clientY:innerHeight/2;
      gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoom(g); if((Number(R.poops)||0)<=0) return;
        R.poops=(Number(R.poops)||0)-1; g.coins+=POOP_REWARD; return g;
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
      return document.querySelector('#catdock .cd-coin') || document.querySelector('#catdock .cd-cam');   // 은화 배지 대신 LIVE 배지로(은화 배지 제거됨)
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
      const before=coins(), poopsNow=room().poops||0;
      gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoom(g); const pl=R.placed||{}, now=Date.now();
        Object.keys(pl).forEach(k=>{ const e=pl[k]; if(!e) return; const filled=e.filledAt&&(now-e.filledAt)<FILL_MS;
          if(!filled){ if(e.itemId==='bowl'&&g.consum.food>0){ g.consum.food-=1; e.filledAt=now; }
            else if(e.itemId==='waterbowl'&&g.consum.water>0){ g.consum.water-=1; e.filledAt=now; } } });
        const poops=Number(R.poops)||0; if(poops>0){ g.coins+=poops*POOP_REWARD; R.poops=0; }
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
      gameRef().transaction(g=>{ g=normalizeGame(g); if(g.coins<w.price||g.owned.wallpapers[id]) return;
        g.coins-=w.price; g.owned.wallpapers[id]={boughtAt:new Date().toISOString()}; gRoom(g).wallpaper=id; return g;
      }).then(res=>{ if(res.committed) toast(w.name+' 벽지 적용! 🎨'); });
    }
    function applyWall(id){ if(!ownsWall(id)){ toast('먼저 구매하세요', true); return; } gameRef().child(roomChild('wallpaper')).set(id); toast('벽지를 적용했어요'); }

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
    const CAT_TIER = { cat_mackerel:'normal', cat_cheese:'uncommon', cat_calico:'rare', cat_black:'epic', cat_white:'epic', cat_fluffy:'rare', cat_tuxedo:'legend', cat_chaos:'rare', cat_siamese:'legend', cat_bengal:'uncommon', cat_fold:'rare', cat_bora:'epic', cat_choco:'uncommon', cat_kitten:'normal', cat_pink:'legend', tiger_orange:'limited', lion_mane:'limited', cat_persian:'epic', tiger_white:'limited', cat_russianblue:'epic', cat_bengal2:'legend' };
    // @gen:end
    const ITEM_TIER = { cushion:'normal', bowl:'uncommon', scratcher:'rare', pethouse:'epic', tower:'legend', catwheel:'limited' };
    // 등급별 알뜰샵 가격(은화) — 확률(60/20/15/3.8/1/0.2%)에 맞춰 등급이 오를수록 약 2배씩.
    // 알 100은화(+금화1·중복은 그 펫 가격의 20% 환급) 대비, 흔한 등급은 알보다 싸게·희귀 등급은 비싸게 → 직접구매 vs 뽑기 선택 성립.
    // CAT_TIER를 단일 소스로 삼아 PET_CATALOG.price를 산정(새 고양이도 등급만 지정하면 자동 가격).
    const TIER_PRICE = { normal:50, uncommon:100, rare:200, epic:400, legend:800, limited:1500 };
    PET_CATALOG.forEach(c=>{ const t=CAT_TIER[c.id]; if(t&&TIER_PRICE[t]!=null) c.price=TIER_PRICE[t]; });
    // ---- 개발자 모드(등록된 개발자 이메일 전용): 확률·구성 로컬 오버라이드 ----
    const DEV_EMAILS=['canel94@gmail.com'];   // 소문자로 등록(비교 시 소문자화). ⚠️ database.rules.json 의 config 쓰기 규칙(현재 canel94@gmail.com 하드코딩)과 반드시 동기화 — 여기만 추가하면 개발자 UI는 뜨지만 전역(config/*) 쓰기는 규칙에서 막혀 조용히 실패한다.
    function isDev(){ return DEV_EMAILS.indexOf((state.userEmail||'').toLowerCase())>=0; }
    function devOn(){ return isDev() && localStorage.getItem('catDev')==='1'; }
    function toggleDevMode(){ if(!isDev()) return; localStorage.setItem('catDev', devOn()?'0':'1'); }
    function devCfg(){ try{ return JSON.parse(localStorage.getItem('catDevCfg')||'null')||{}; }catch(e){ return {}; } }
    function saveDevCfg(c){ localStorage.setItem('catDevCfg', JSON.stringify(c)); }
    function effTiers(){ const c=devOn()&&devCfg().tiers; if(!c) return TIERS; return TIERS.map(t=>({ id:t.id, name:t.name, color:t.color, p:(c[t.id]!=null?Number(c[t.id]):t.p) })); }
    function effCatTier(){ if(!devOn()) return CAT_TIER; const ov=devCfg().catTier||{}, r={}; Object.keys(CAT_TIER).forEach(k=>{ r[k]=(ov[k]!=null?ov[k]:CAT_TIER[k]); }); return r; }   // 알려진 id만(구 dev 설정의 잔여 키 무시)
    function effItemTier(){ return devOn()? Object.assign({},ITEM_TIER,devCfg().itemTier||{}) : ITEM_TIER; }
    // 등급 랭크(낮을수록 흔함). 특별(epic) 이상은 알뜰샵 직접 구매 불가 — 펫알(가챠) 전용.
    function tierRank(tier){ return Math.max(0, TIER_ORDER.indexOf(tier||'normal')); }
    function petTierOf(id){ return effCatTier()[id]||'normal'; }
    function isGachaOnlyCat(id){ return tierRank(petTierOf(id)) >= tierRank('epic'); }
    function itemTierOf(id){ return effItemTier()[id]||'normal'; }
    function isGachaOnlyItem(id){ return tierRank(itemTierOf(id)) >= tierRank('epic'); }   // 특별↑ 가구는 랜덤박스 전용
    // 🌟 시즌: 이달의 펫 — 매월(KST) 은화로 살 수 있는 등급(특별 미만) 중 하나. 모든 사용자 동일, 20% 할인.
    //  · 우선순위: ① 개발자 수동 선정(전역 config/featuredPet/{monthKey}=id, 관리자만 쓰기) ② 없으면 월키 해시 자동 선정.
    //  · 해시 자동은 후보 목록 길이에 의존해 펫을 추가/삭제하면 그 달 자동 선정이 바뀜 → 수동 선정을 두면 그런 변동 없이 고정된다.
    const FEATURED_DISCOUNT = 0.2;
    let _featuredMap = {};   // { 'M2026-07': 'cat_xxx', ... } — RTDB config/featuredPet 구독값(loadFeaturedPet)
    function loadFeaturedPet(){ try{ db.ref('config/featuredPet').on('value', function(s){ _featuredMap = s.val() || {};
      if(typeof rerender==='function') rerender(); if(state && state._sheetRefresh) state._sheetRefresh(); }); }catch(e){} }
    // 🎬 가챠 오픈 연출에 등장하는 펫(개발자 지정, 전역). a=1번(왼쪽에서 등장·오른쪽 봄)·b=2번(오른쪽에서 등장·왼쪽 봄). 미지정이면 기본 검은고양이 스프라이트.
    let _gachaFx={};
    let _fxForceCat=false;   // 개발자 '연출 미리보기'용 1회성 강제 플래그(등급 확률과 무관하게 고양이 연출을 무조건 표시). fxClimax가 읽고 즉시 끔.
    function loadGachaFx(){ try{ db.ref('config/gachaFx').on('value', function(s){ _gachaFx=s.val()||{}; }); }catch(e){} }
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
    // 연출 미리보기(개발자): 현재 지정된 연출 펫으로 고양이 연출을 강제 재생(전설 등급 더미 알). 지정 없으면 기본 검은 고양이.
    function devPreviewGachaFx(){ if(!(typeof isDev==='function'&&isDev())) return;
      const pid=(_gachaFx&&(_gachaFx.a||_gachaFx.b)) || (PET_CATALOG[0]&&PET_CATALOG[0].id);
      closeSheet(); _fx=null; _fxForceCat=true; runGachaFx('egg', { id:pid, tier:'legend' }, false); }
    function featuredEligibleIds(){ return PET_CATALOG.filter(c=>!isGachaOnlyCat(c.id)).map(c=>c.id); }
    function featuredCatId(){ const mk=kstMonthKey();
      const ov=_featuredMap && _featuredMap[mk];   // 개발자 수동 선정 우선(존재·미삭제 펫이면)
      if(ov && PET_CATALOG.some(c=>c.id===ov && !c.deleted)) return ov;
      return featuredPetOfMonth(mk, featuredEligibleIds()); }
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
      h+='<div class="row" style="justify-content:space-between;align-items:center;margin:6px 2px 10px;"><span>현재: <b>'+catNameSpan(cur,catName(cur))+'</b> <span class="pill">'+(manual?'수동 선정':'자동(해시)')+'</span></span>'+(manual?'<button class="chip" onclick="clearFeaturedPet()">자동으로 되돌리기</button>':'')+'</div>';
      h+='<div class="dexgrid">'+ids.map(function(id){ const on=id===cur; return '<div class="dexcell" role="button" tabindex="0" onclick="setFeaturedPet(\''+id+'\')" style="cursor:pointer;'+(on?'outline:2px solid var(--primary);outline-offset:1px;border-radius:12px;':'')+'"><div class="dexpic">'+catFace(id,{h:48})+'</div><div class="dexnm">'+catNameSpan(id,catName(id))+(on?' ✓':'')+'</div></div>'; }).join('')+'</div>';
      openSheet('이달의 펫 선정', h); }
    function isFeaturedCat(id){ return !!id && id===featuredCatId(); }
    function catBuyPrice(id){ const c=PET_CATALOG.find(x=>x.id===id); if(!c) return 0; return isFeaturedCat(id)?Math.max(1,Math.round((c.price||0)*(1-FEATURED_DISCOUNT))):(c.price||0); }
    function monthLabelKo(){ const n=parseInt(kstMonthKey().slice(6),10)||0; return n+'월'; }
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
    const GACHA_PRICE=100;
    // 중복 펫 환급 = 해당 펫 가격의 20%(등급가 기준). 가구(박스)는 중복 개념 없이 수량 누적(환급 없음).
    function petDupRefund(id){ const c=PET_CATALOG.find(x=>x.id===id); return c?Math.round((c.price||0)*0.2):0; }
    // 구매+롤(원자적): 은화-100, 금화+1, 지급(신규 고양이/가구 or 중복 펫 환급). 성공 시 연출.
    function openGacha(kind){
      if(coins()<GACHA_PRICE){ toast((GACHA_PRICE-coins())+' 은화 부족', true); return; }
      const res = rollFromPool(kind==='egg'?effCatTier():effItemTier()); if(!res) return;
      const dup = kind==='egg' && ownsCat(res.id);
      const refund = dup ? petDupRefund(res.id) : 0;
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(g.coins<GACHA_PRICE) return;
        g.coins-=GACHA_PRICE; g.gold=(g.gold||0)+1;
        if(kind==='egg'){
          if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(res.id)<0) R.active.push(res.id); } }
          else { g.coins+=refund; }
        } else {
          g.owned.items[res.id]=g.owned.items[res.id]||{qty:0,boughtAt:new Date().toISOString()};
          g.owned.items[res.id].qty=(Number(g.owned.items[res.id].qty)||0)+1;
        }
        return g;
      }).then(r=>{ if(r&&r.committed) runGachaFx(kind, res, dup, refund); });
    }
    // ===== ✨ 무지개알/무지개박스: 금화로 구매하는 소비템 → 사용 시 특별90·전설8·한정2% 가챠 =====
    const RAINBOW_TIERS=[{id:'epic',p:90},{id:'legend',p:8},{id:'limited',p:2}];   // 한정 콘텐츠 없으면 rollFromPool이 전설로 폴백
    const RAINBOW_PRICE_GOLD={ egg:100, box:100 };   // 무지개알·무지개박스 모두 금화100
    function rbPriceGold(kind){ return RAINBOW_PRICE_GOLD[kind==='egg'?'egg':'box']; }
    function rainbowKey(kind){ return kind==='egg'?'rainbow_egg':'rainbow_box'; }
    function rainbowName(kind){ return kind==='egg'?'무지개알':'무지개박스'; }
    // 구매(금화): 금화 -5, 소비 인벤토리 +1
    function buyRainbow(kind){
      const key=rainbowKey(kind);
      const price=rbPriceGold(kind);
      if(consumQty(key)>=MAX_CONSUM){ toast(rainbowName(kind)+' 최대 보유량이에요('+MAX_CONSUM.toLocaleString()+'개)', true); return; }
      if(gold()<price){ toast('금화 '+(price-gold())+' 부족', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); if((g.gold||0)<price || (Number(g.consum[key])||0)>=MAX_CONSUM) return;
        g.gold-=price; g.consum[key]=(Number(g.consum[key])||0)+1; return g;
      }).then(r=>{ if(r&&r.committed) toast(rainbowName(kind)+' +1 ✨'); });
    }
    // 사용(소비): 인벤토리 -1, 특별↑ 확률표로 롤 → 지급. 금화 보상 없음(금화로 산 프리미엄), 중복 펫은 은화 환급.
    function useRainbow(kind){
      const key=rainbowKey(kind);
      if(consumQty(key)<1){ toast(rainbowName(kind)+'이 없어요', true); return; }
      const res=rollFromPool(kind==='egg'?effCatTier():effItemTier(), RAINBOW_TIERS); if(!res) return;
      const dup=kind==='egg' && ownsCat(res.id);
      const refund=dup?petDupRefund(res.id):0;
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.consum[key])||0)<1) return;
        g.consum[key]-=1;
        if(kind==='egg'){
          if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(res.id)<0) R.active.push(res.id); } }
          else { g.coins+=refund; }
        } else {
          g.owned.items[res.id]=g.owned.items[res.id]||{qty:0,boughtAt:new Date().toISOString()};
          g.owned.items[res.id].qty=(Number(g.owned.items[res.id].qty)||0)+1;
        }
        return g;
      }).then(r=>{ if(r&&r.committed) runGachaFx(kind, res, dup, refund, true); });
    }
    let _selItem=null;
    function selItem(id){ _selItem=(_selItem===id?null:id); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }   // _sheetRefresh=팔레트·펫칩 가로 스크롤 위치 보존(선택 시 처음으로 안 튐)
    const ITEM_SELL = 10;   // 기구물 판매가(은화)
    function itemFoot(id){ const it=ITEM_CATALOG.find(x=>x.id===id); return { w:(it&&it.footW)||1, h:(it&&it.footH)||1 }; }
    function placedItemId(key){ const p=room().placed||{}; return p[key]&&p[key].itemId; }
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
      let c=p.c-Math.round((foot.w-1)/2), r=p.r-Math.round((foot.h-1)/2);   // 짝수 폭(2×2)도 손가락 기준 가운데에 가깝게(floor는 한쪽으로 치우침)
      c=Math.max(1, Math.min(13-foot.w, c)); r=Math.max(1, Math.min(13-foot.h, r));
      return { r, c };
    }
    // 빈 칸(그리드 배경) 탭 → 선택한 가구 배치(2×2는 그만큼 점유·겹침 방지)
    let _justDragged=false;
    // 배치 트랜잭션: 남은 수량·겹침·케어 상한을 트랜잭션 안에서 재검증(비트랜잭션 .set의 복제/겹침 레이스 차단).
    function placeItemTx(sel, r, c, foot){
      gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoom(g); R.placed=R.placed||{};
        const qty=Number((g.owned.items[sel]||{}).qty)||0, placedAll=(typeof sumPlacedItem==='function')?sumPlacedItem(g.home.rooms, sel):0;
        if(qty-placedAll<=0) return;                                   // 남은 수량 없음(복제 차단)
        if(!areaFree(r,c,foot.w,foot.h,R.placed,null)) return;         // 겹침
        if(CARE_ITEMS.indexOf(sel)>=0){ const slots=Math.min(MAX_SLOTS,Math.max(BASE_SLOTS,Number(g.home.slots)||BASE_SLOTS));
          const cnt=Object.keys(R.placed).filter(k=>R.placed[k]&&R.placed[k].itemId===sel).length; if(cnt>=slots) return; }   // 케어 아이템 방당 상한
        R.placed[r+'_'+c]={itemId:sel}; g.home.changedAt=new Date().toISOString(); return g;
      }).then(()=>{ touchHome(); });
    }
    function placeClick(e){
      if(_justDragged) return;                          // 드래그 직후 발생하는 click 무시
      const grid=$('placeGrid'); if(!grid) return;
      if(!_selItem){ toast('놓을 가구를 먼저 선택하세요'); return; }
      if(itemRemaining(_selItem)<=0){ toast('배치할 수량이 없어요(알뜰샵에서 구매)', true); return; }
      // 밥·물그릇·화장실은 고양이 최대 마릿수(슬롯 수)만큼만 배치 가능
      if(CARE_ITEMS.indexOf(_selItem)>=0 && itemPlaced(_selItem)>=slotCount()){ toast('그 종류는 최대 '+slotCount()+'개까지 놓을 수 있어요(고양이 수 기준)', true); return; }
      const foot=itemFoot(_selItem), cell=dropCell(grid, e.clientX, e.clientY, foot), r=cell.r, c=cell.c;   // 포인터=발자국 가운데
      const placed=room().placed||{};
      if(!areaFree(r,c,foot.w,foot.h,placed,null)){ toast('그 자리엔 놓을 수 없어요(겹침)', true); return; }
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
      if(typeof hideDropPreview==='function') hideDropPreview();
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
      showDropPreview(cell.r, cell.c, _drag.foot, _drag.key);
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
      if(!areaFree(r,c,d.foot.w,d.foot.h,placed,d.key)){ toast('그 자리엔 놓을 수 없어요(겹침)', true); resetEl(); return; }
      const id=placed[d.key]&&placed[d.key].itemId; if(!id){ resetEl(); return; }
      // 이동도 트랜잭션(자기 제외 겹침 재검증) — 리스너가 재렌더
      gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoom(g); const pl=R.placed||{};
        const it=pl[d.key]; if(!it) return;                               // 원본 없음(레이스)
        if(!areaFree(r,c,d.foot.w,d.foot.h,pl,d.key)) return;             // 겹침(자기 제외)
        delete pl[d.key]; pl[newKey]={itemId:it.itemId}; g.home.changedAt=new Date().toISOString(); return g;
      }).then(()=>{ touchHome(); });
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
      const placed=room().placed||{};
      if(!areaFree(rr,cc,d.foot.w,d.foot.h,placed,null)){ toast('그 자리엔 놓을 수 없어요(겹침)', true); return; }
      placeItemTx(d.id, rr, cc, d.foot);
    }
    function catFurnName(id){ const it=ITEM_CATALOG.find(x=>x.id===id); return it?it.name:id; }
    function showDropPreview(r,c,foot,key){
      const g=$('gdrop'); if(!g) return; const placed=room().placed||{};
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
      const placed=room().placed||{}, p=placed[key]; if(!p) return;
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
    function retrievePlaced(key){ gameRef().child(roomChild('placed/'+key)).remove(); touchHome(); closeItemMenu(); toast('회수했어요(인벤토리로)'); }
    function sellPlaced(key){
      const placed=room().placed||{}, p=placed[key]; if(!p){ closeItemMenu(); return; }
      const id=p.itemId;
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        const R=gRoom(g); if(!R.placed[key]) return g;                 // 이미 없음(중복 방지)
        delete R.placed[key];
        const inv=g.owned.items[id];
        if(inv){ inv.qty=Math.max(0,(Number(inv.qty)||0)-1); if(inv.qty<=0) delete g.owned.items[id]; }
        g.coins += ITEM_SELL;
        g.home.changedAt=new Date().toISOString();
        return g;
      }).then(r=>{ if(r&&r.committed) toast('+'+ITEM_SELL+' 은화에 판매했어요'); });
      closeItemMenu();
    }
    function catPlaceHtml(){
      const placed=room().placed||{};
      // 배치된 가구를 격자 위 절대좌표로(발자국 크기만큼 영역 차지). 드래그=이동, 탭=회수/판매.
      const items=Object.keys(placed).map(key=>{ const pr=key.split('_'), r=+pr[0], c=+pr[1], id=placed[key].itemId, foot=itemFoot(id);
        const left=((c-1)/12*100).toFixed(3), top=((r-1)/12*100).toFixed(3), w=(foot.w/12*100).toFixed(3), h=(foot.h/12*100).toFixed(3);
        // 배치칸(발자국)에 꽉 차게 그림
        return '<div class="gitem" style="left:'+left+'%;top:'+top+'%;width:'+w+'%;height:'+h+'%" onpointerdown="giDown(event,\''+key+'\')" onclick="event.stopPropagation()">'+
          '<span class="gsc">'+furnSvg(id,{fit:true})+'</span></div>'; }).join('');
      const grid='<div class="grid12" id="placeGrid" onclick="placeClick(event)">'+items+'<div class="gdrop" id="gdrop" hidden></div></div>';
      // 팔레트 항목을 그리드로 바로 드래그해 배치(탭하면 선택). 아이콘은 크게.
      const pal=ITEM_CATALOG.map(it=>{ const foot=itemFoot(it.id);
        // 팔레트 아이콘 높이 = 방 렌더 크기(ROOM_H)에 sqrt로 완만 비례 → 실제로 작은 그릇은 작게, 큰 캣타워는 크게 보이되 극단 비율(0.6~6.2배)은 압축(√). 최소 16px(너무 작지 않게)·최대 30px(작은 걸 셀에 꽉 채우지 않음). 셀 밖 넘침은 .pic max-width가 한 번 더 클램프.
        const rh=(ROOM_H[it.id]||1); const picH=Math.max(16,Math.min(30,Math.round(11+Math.sqrt(rh)*7.5)));
        return '<button class="pitem'+(_selItem===it.id?' on':'')+'" onpointerdown="palDown(event,\''+it.id+'\')" onclick="if(event.detail===0)selItem(\''+it.id+'\')"><span class="pic">'+furnSvg(it.id,{h:picH})+'</span><span>'+it.name+'</span><span class="pq">'+foot.w+'×'+foot.h+' · 남은 '+itemRemaining(it.id)+'</span></button>'; }).join('');
      // 미니 웹캠 프리뷰: 현재 배치를 실제 방 뷰로 보여줘 방향 헷갈림 방지(표시 전용)
      const plist=placedList().sort((a,b)=>a.r-b.r); distributePoops(plist);
      const preview='<div class="miniroom"><div class="cr-wall" style="background:'+wallCss(currentWall())+'"></div><div class="cr-floor"></div><div class="cr-base"></div><span class="cr-cam"><i></i>미리보기</span><div class="cr-props">'+plist.map(p=>propMarkup(p,true)).join('')+'</div></div>';
      const dragHint='<div class="hintline" style="margin:8px 0 4px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11.5V5.5a1.5 1.5 0 0 1 3 0v5"/><path d="M12 10V4.5a1.5 1.5 0 0 1 3 0V10"/><path d="M15 9.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3l-2-3.5a1.5 1.5 0 0 1 2.6-1.5L9 14"/></svg><b>꾹 눌러서</b> 끌면 배치·이동돼요(짧게 탭하면 선택·메뉴). 화면 스크롤과 겹치지 않아요.</div>';
      return roomStripHtml()+'<div class="editwrap">'+preview+grid+dragHint+'<div class="palette">'+pal+'</div></div>';   // 어느 방을 꾸미는지 선택·표시
    }
    function missionRow(m){
      const claimed=missionClaimed(m), ok=m.check();
      let right;
      if(claimed) right='<span class="mdone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>수령완료</span>';
      else if(ok) right='<button class="claim" onclick="claimMission(\''+m.id+'\')">수령</button>';
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
        '<div class="cmm" onclick="openCustomMissionEdit(\''+cm.id+'\')"><b>'+escapeHtml(cm.title||'')+'</b>'+
          '<span class="rw">'+(st.current>0?'<span style="display:inline-flex;vertical-align:-2px">'+flameSvg({h:12})+'</span> '+st.current+'일 · ':'')+'다음 보상 '+((typeof customMissionMilestone==='function')?customMissionMilestone(st.current, CUSTOM_STREAK_N).toNext:CUSTOM_STREAK_N)+'일 <span class="ci">'+coinSvg({h:14})+'</span>+'+CUSTOM_STREAK_BONUS+'</span></div>'+
        '<span class="cmdots" aria-hidden="true">'+dots+'</span></div>';
    }
    // 🐾 컬렉션 도감: 전체 펫 그리드(보유=컬러/미보유=실루엣), 진행도 N/총. 애정 레벨 하트 표시.
    function ownedCatsMap(){ return (state.game&&state.game.owned&&state.game.owned.cats)||{}; }
    function openPetDex(){
      const owned=ownedCatsMap(), all=PET_CATALOG.slice().sort((a,b)=> (TIER_ORDER.indexOf(CAT_TIER[a.id])-TIER_ORDER.indexOf(CAT_TIER[b.id])) || 0);
      const prog=dexProgress(owned, PET_CATALOG.map(c=>c.id));
      let h='<div class="dexhead"><div class="row" style="justify-content:space-between;"><b>수집</b><span class="s">'+prog.owned+' / '+prog.total+' ('+prog.pct+'%)</span></div><div class="bar"><i style="width:'+prog.pct+'%"></i></div></div>';
      h+='<div class="dexgrid">'+all.map(c=>{ const has=!!owned[c.id]; const lv=has?affectionLevel(owned[c.id].affection).level:0;
        return '<div class="dexcell'+(has?'':' locked')+'" title="'+escapeHtml(has?catName(c.id):'미보유')+'">'+
          '<div class="dexpic">'+catFace(c.id,{h:54})+'</div>'+
          '<div class="dexnm">'+(has?catNameSpan(c.id,catName(c.id)):'<span class="q">???</span>')+'</div>'+
          (lv>0?'<div class="dexlv" style="display:inline-flex;gap:1px" aria-label="애정 레벨 '+lv+'">'+heartSvg({h:9}).repeat(lv)+'</div>':'')+
        '</div>'; }).join('')+'</div>';
      openSheet('펫 도감', h);
    }
    // ===== 📢 소식(알림·이벤트·공지) — 알뜰 아이콘 '소식' 화면 =====
    // 업데이트 공지 — 기본값(폴백). 운영은 RTDB config/notices(관리자만 쓰기)에서 덮어씀(loadNotices). 최신순.
    // 업데이트 내역(요약) — 최신순. RTDB config/notices가 있으면 그걸로 덮어씀(아래는 기본값).
    // 업데이트 내역 기본값(요약) — 최신순. RTDB config/notices가 있으면 그걸로 덮어씀. 시즌·친구선물 홍보는 이벤트·알림 섹션에 이미 나오므로 여기(업데이트 내역)엔 넣지 않는다.
    // 🔒 여기(및 config/notices)는 일반 사용자에게 그대로 노출된다. 개발자 모드·치트·내부 도구 등 비공개 변경은 절대 넣지 말 것(운영 유출 크리티컬). 방어로 isDevNotice가 한 번 더 거른다.
    let NOTICES = [
      { date:'2026-07-04', t:'소식 화면 개편 · 업데이트 내역', s:'공지를 업데이트 내역으로 정리하고, 확성기 아이콘·레이아웃을 다듬었어요' }
    ];
    // RTDB config/notices(공개 읽기·관리자 쓰기)에서 공지를 읽어 NOTICES를 갱신. 없으면 위 기본값 유지.
    function loadNotices(){ try{ db.ref('config/notices').on('value', function(s){ const v=s.val(); let arr=[];
      if(Array.isArray(v)) arr=v; else if(v&&typeof v==='object') arr=Object.keys(v).map(function(k){ return v[k]; });
      arr=(arr||[]).filter(function(n){ return n && n.date && n.t; }).sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
      if(arr.length){ NOTICES=arr; if(typeof updateNewsBadge==='function') updateNewsBadge(); }
    }); }catch(e){} }
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
    function latestNoticeDate(){ const u=latestUpdate(); return u?(u.date||''):''; }
    function markNewsSeen(){ const d=latestNoticeDate(); try{ localStorage.setItem('newsSeenAt', d); }catch(e){}
      try{ if(typeof gameRef==='function' && state.uid && d) gameRef().child('newsSeenAt').set(d); }catch(e){}   // 계정 동기화
      updateNewsBadge(); refreshMoreBadges(); }   // 로컬 저장으로 안 본 공지=0 됐으니 더보기 '소식' 뱃지도 즉시 갱신(RTDB set이 값 동일이면 리스너가 안 뜨므로 여기서 직접)
    function unseenNoticeCount(){ const u=latestUpdate(); return (u && (u.date||'')>newsSeenAt())?1:0; }   // 노출은 최신 1건뿐 → 뱃지도 0/1
    function giftUnread(){ return giftCount() + (typeof mailCount==='function'?mailCount():0); }   // 안 받은 선물 = 코드보상(gifts) + 친구선물(mailbox)
    function newsUnread(){ return giftUnread() + unseenNoticeCount(); }   // (브랜드 아이콘) 뱃지 = 안 받은 선물(코드+친구) + 안 본 공지
    // 아직 안 쓴 프로모 쿠폰 개수(state.game.codes에 없는 PROMO_CODES 키 수).
    function unusedCouponCount(){ const codes=(state.game&&state.game.codes)||{}; return Object.keys(PROMO_CODES).filter(function(c){ return !codes[c]; }).length; }
    // 더보기 '소식' 셀 뱃지 = 안 쓴 쿠폰 + 안 본 공지 (선물은 제외 — 선물 알림은 '선물함' 셀과 브랜드 아이콘에만 표시해 중복/혼동 방지).
    // 소식 탭 진입(markNewsSeen) 후엔 안 본 공지=0 → 안 쓴 쿠폰 수만 남는다.
    function newsMoreCount(){ return unusedCouponCount() + unseenNoticeCount(); }
    // 좌상단 브랜드(알뜰 메인) 아이콘 = 소식 진입. 그 위에 안 받은 선물(코드+친구)+안 본 공지 수를 뱃지로.
    function updateNewsBadge(){ const el=$('newsBadge'); if(!el) return; const n=newsUnread(); if(n>0){ el.textContent=n>9?'9+':String(n); el.hidden=false; } else { el.hidden=true; el.textContent=''; } }
    // 더보기 그리드의 알림 뱃지(선물함=giftUnread·소식=newsMoreCount 등)는 renderMore 시점에만 계산된다.
    // game/localStorage가 바뀌어도(선물 받기·쿠폰 사용·공지 확인) 더보기 화면이 다시 안 그려지면 뱃지가 남으므로, 더보기 탭이 떠 있으면 즉시 재렌더해 알림을 지운다.
    function refreshMoreBadges(){ if(state.view==='mode' && state.tab==='more' && typeof renderMore==='function') renderMore(); }
    // 쿠폰 보상 픽셀 아이콘(PROMO_CODES 타입별) — 이모지 대신 도트 아이콘 재사용.
    function couponIcon(d){ if(d.type==='coins') return coinSvg({h:15}); if(d.key==='rainbow_egg') return rainbowEggSvg({h:16}); if(d.key==='rainbow_box') return rainbowBoxSvg({h:16}); if(d.key==='egg') return eggSvg(0,{h:16}); if(d.key==='box') return boxSvg({h:16}); return coinSvg({h:15}); }
    // 공지 왼쪽 픽셀 아이콘 — 제목 키워드로 선택(선물=giftSvg·시즌 할인=seasonSvg·그 외=확성기). 제목 앞 이모지는 표시에서 제거.
    function noticeIcon(n){ const t=(n&&n.t)||''; if(/선물/.test(t)) return giftSvg({h:17}); if(/할인|시즌|이달의\s*펫/.test(t)) return seasonSvg({h:17}); return megaSvg({h:16}); }   // 항목 아이콘 작게(24/20→17/16)
    function noticeTitle(n){ return ((n&&n.t)||'').replace(/^\s*(?:\p{Extended_Pictographic}[️‍]*)+\s*/u, ''); }
    function catNewsHtml(){
      let h='';
      const gc=giftUnread();
      h+='<div class="sech"><span class="l"><span class="sech-ic">'+bellSvg({h:15})+'</span> 알림</span></div>';
      if(gc>0){ h+='<div class="newsalert" role="button" tabindex="0" onclick="openGiftbox()"><span class="nai">'+giftSvg({h:30})+'</span><div class="nat"><b>선물 '+gc+'개가 도착했어요</b><span>탭해서 선물함에서 받으세요</span></div><span class="buy">받기</span></div>'; }
      else { h+='<div class="note" style="margin:2px 0 6px;">받을 선물이 없어요. 친구 집에서 응원 선물을 주고받거나 코드를 입력해 보세요.</div>'; }
      h+='<div class="sech" style="margin-top:16px;"><span class="l"><span class="sech-ic" style="color:var(--gold,#e0a43c);">'+sparkSvg({h:15})+'</span> 이벤트</span></div>';
      const fid=featuredCatId();
      if(fid){ const fc=PET_CATALOG.find(function(x){ return x.id===fid; }); if(fc){
        h+='<div class="featbanner" role="button" tabindex="0" onclick="openCatHouse(\'shop\')"><span class="fstar">'+sparkSvg({h:20})+'</span><div class="fb-txt"><b>'+monthLabelKo()+' 이달의 펫 · '+catNameSpan(fid,fc.name)+'</b><span class="s">이번 달만 '+Math.round(FEATURED_DISCOUNT*100)+'% 할인 — '+catBuyPrice(fid)+' 은화'+(ownsCat(fid)?' (보유 완료)':' · 사러가기')+'</span></div><span class="fb-face">'+catFace(fid,{h:40})+'</span></div>'; } }
      else { h+='<div class="note" style="margin:2px 0 6px;">진행 중인 이벤트가 곧 열려요.</div>'; }
      h+='<div class="sech" style="margin-top:16px;"><span class="l"><span class="sech-ic">'+megaSvg({h:16})+'</span> 업데이트 내역</span></div>';
      // 시즌·친구선물 홍보 제외, 개발자가 실시간(RTDB)으로 올리는 최신 업데이트 '1건'만 카드로 노출(이전 내역은 사라짐).
      const _u=latestUpdate();
      h+='<div class="newscard">'+(_u
        ? '<div class="newsupd"><span class="nu-ic">'+noticeIcon(_u)+'</span><div class="nu-tx"><b>'+escapeHtml(noticeTitle(_u))+'</b><span>'+escapeHtml(_u.s||'')+'</span></div></div>'
        : '<div class="note" style="margin:8px 2px;">최근 업데이트 소식이 없어요.</div>')+'</div>';
      h+='<div class="cnote"><b><span style="display:inline-flex;vertical-align:-2px">'+ticketSvg({h:14})+'</span> 쿠폰</b> — 더보기 → 코드 입력에서 사용하세요</div>';
      const _codes=(state.game&&state.game.codes)||{};
      // 코드는 대문자로 안내(입력은 redeemCode가 소문자로 정규화해 대소문자 무관). used 판정은 저장 키(소문자 code) 그대로.
      h+=Object.keys(PROMO_CODES).map(function(code){ const d=PROMO_CODES[code]; const used=!!_codes[code]; return '<div class="cpn'+(used?' used':'')+'"><code>'+escapeHtml(code.toUpperCase())+'</code><span class="rw"><span class="ci">'+couponIcon(d)+'</span>'+d.label+(used?'<span class="cused">사용완료</span>':'')+'</span></div>'; }).join('');
      return h;
    }
    function catMissionHtml(){
      let h='<div class="coinhero"><span class="ch-big">'+coinSvg({h:44})+'</span><div><div class="k">보유 은화</div><div class="v">'+coins().toLocaleString()+(atMaxCoins()?maxChip():'')+'</div></div></div>';
      // 로그인 스트릭 배지: 연속 출석일 + 다음 마일스톤까지(3·7·14·30, 이후 매30). 마일스톤에 은화·금화 보상.
      { const c=(state.game&&state.game.streak&&Number(state.game.streak.count))||0;
        const nx=[3,7,14,30].find(n=>n>c)||(Math.floor(c/30+1)*30);
        h+='<div class="streakbar"><span class="fire" style="display:inline-flex;align-items:center">'+flameSvg({h:18})+'</span><b>'+c+'일 연속 출석</b><span class="s">다음 보상까지 '+(nx-c)+'일 (+금화)</span></div>'; }
      h+='<div class="sech"><span class="l">일일 미션</span><span class="s">자정 초기화</span></div>';
      h+=DAILY_MISSIONS.map(missionRow).join('');
      const _cmN=customMissionList().length; h+='<div class="sech"><span class="l">내 미션</span>'+(_cmN>=5?'<span class="s">최대 5개</span>':'<button class="link" onclick="openCustomMissionEdit()">+ 추가</button>')+'</div>';
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

    // ================= 뽑기 오픈 연출(#catFx 풀스크린) =================
    let _fx=null, _fxTimers=[];
    function _fxT(fn,ms){ const id=setTimeout(fn,ms); _fxTimers.push(id); return id; }   // 가챠 FX 타이머 추적 → 닫기/재시작 시 일괄 취소(빠른 닫기→재오픈 교차 방지)
    function _fxClear(){ _fxTimers.forEach(clearTimeout); _fxTimers=[]; }
    function itemName(kind,id){ return kind==='egg'?catName(id):((ITEM_CATALOG.find(x=>x.id===id)||{}).name||id); }
    function fxParticles(n,cls){ let s=''; for(let i=0;i<(n||14);i++){ const a=(i/(n||14))*360+Math.random()*30, d=60+Math.random()*90; const dx=Math.round(Math.cos(a*Math.PI/180)*d), dy=Math.round(Math.sin(a*Math.PI/180)*d); const del=(Math.random()*0.12).toFixed(2); s+='<span class="'+(cls||'fx-particle')+'" style="--dx:'+dx+'px;--dy:'+dy+'px;animation-delay:'+del+'s"></span>'; } return s; }
    // 픽셀 컨페티(도트) — 둥근 조각 대신 각진 픽셀 블록이 흔들리며 떨어짐. n=개수(등급↑ 많이), 3가지 픽셀 모양(s0~s2).
    function fxConfetti(n){ const cols=['#F04452','#F0883C','#F2C84B','#2FAE7A','#3182F6','#9B6FC8']; n=n||24; let s='';
      for(let i=0;i<n;i++){ const x=Math.round(Math.random()*100), r=(Math.round(Math.random()*4)*90), del=(Math.random()*0.7).toFixed(2), dur=(1.1+Math.random()*0.9).toFixed(2), sw=(Math.random()*50-25).toFixed(0), sh=i%3;
        s+='<span class="fx-conf s'+sh+'" style="left:'+x+'%;color:'+cols[i%6]+';--r:'+r+'deg;--sw:'+sw+'px;animation-delay:'+del+'s;animation-duration:'+dur+'s"></span>'; }
      return s; }
    function runGachaFx(kind, res, dup, refund, rainbow){
      const fx=$('catFx'); if(!fx){ toast((kind==='egg'?'펫알':'랜덤박스')+' 획득!'); return; }
      _fxClear();   // 이전 FX 잔여 타이머 취소(빠른 재오픈 교차 방지)
      _fx={ kind, res, dup, refund:refund||0, stage:0, rainbow:!!rainbow, gold: rainbow?0:1 };   // 무지개는 금화로 샀으니 금화 보상 없음
      if(kind==='egg' && typeof hasSprite==='function' && hasSprite(res.id)){ try{ const _pi=new Image(); _pi.src=sprStill(res.id,'south'); if(_pi.decode) _pi.decode().catch(function(){}); }catch(e){} }   // 등장 스프라이트 미리 로드·디코드(연출 도는 동안) → 마지막에 바로 표시
      if(reducedMotion()){ fxReveal(); return; }   // 모션 최소화: 바로 결과
      const art = rainbow ? (kind==='egg'? rainbowEggSvg({h:150}) : rainbowBoxSvg({h:150}))
                          : (kind==='egg'? eggSvg(0,{h:150}) : boxSvg({h:150}));
      const hint = kind==='egg'? '알을 탭해서 깨보세요! (3번)' : '상자를 탭해서 열어보세요!';
      fx.innerHTML='<div class="fx-scrim"></div><div class="fx-stage'+(rainbow?' fx-rb':'')+'">'+
        (rainbow?fxSparkles(16):'')+
        '<div class="fx-item pop '+(kind==='egg'?'fx-egg':'fx-box')+(rainbow?' fx-rainbow':'')+'" id="fxItem" role="button" aria-label="'+hint+'" onclick="fxTap()">'+art+'</div>'+
        '<div class="fx-hint" id="fxHint">'+hint+'</div></div>';
      fx.className='fx on';
    }
    // ✨ 반짝이는 도트 스파클(무지개알/박스 대기 연출) — 흰 픽셀 점이 제각기 깜빡이며 흩뿌려짐
    function fxSparkles(n){ let s=''; for(let i=0;i<(n||12);i++){ const x=Math.round(Math.random()*100), y=Math.round(Math.random()*100), del=(Math.random()*1.4).toFixed(2), sc=(0.7+Math.random()*1.2).toFixed(2), du=(0.9+Math.random()*0.9).toFixed(2); s+='<span class="fx-spark" style="left:'+x+'%;top:'+y+'%;--sc:'+sc+';animation-delay:'+del+'s;animation-duration:'+du+'s"></span>'; } return s; }
    // 탭할 때마다 껍질 조각이 사방으로 튀는 연출(단계가 오를수록 더 많이) — 알이 점점 더 깨지는 느낌.
    function fxCrackChips(stage){ const fx=$('catFx'), st=fx&&fx.querySelector('.fx-stage'); if(!st) return;
      const n=5+stage*5; const rb=_fx&&_fx.rainbow; let s='';   // 단계↑ 더 많은 조각이 튐
      for(let i=0;i<n;i++){ const a=-90+(i/n)*300+(Math.random()*24-12), d=48+Math.random()*84;
        const dx=Math.round(Math.cos(a*Math.PI/180)*d), dy=Math.round(Math.sin(a*Math.PI/180)*d)+8;
        const rot=Math.round(Math.random()*360-180), sc=(0.5+Math.random()*0.7).toFixed(2), del=(Math.random()*0.05).toFixed(2), h=7+Math.round(Math.random()*4);
        s+='<span class="fx-chip" style="--dx:'+dx+'px;--dy:'+dy+'px;--r:'+rot+'deg;--s:'+sc+';animation-delay:'+del+'s">'+shellSvg(2,rb,{h:h})+'</span>'; }
      const w=document.createElement('div'); w.innerHTML=s; const nodes=[].slice.call(w.children);
      nodes.forEach(function(nd){ st.appendChild(nd); }); setTimeout(function(){ nodes.forEach(function(nd){ nd.remove(); }); }, 720);
    }
    function fxTap(){
      if(!_fx||_fx.busy) return; const it=$('fxItem'); if(!it) return;
      if(_fx.kind==='egg'){
        _fx.stage++;
        if(_fx.stage>=3){ _fx.busy=true; fxClimax(); return; }
        if(_fx.stage===2 && !_fx.rainbow) maybeRainbowUpgrade();   // 2번째 탭 직후: 특별↑이면 확률로 무지개알 승급
        it.innerHTML=_fx.rainbow?rainbowEggStage(_fx.stage,{h:150}):eggSvg(_fx.stage,{h:150}); it.classList.remove('shake'); void it.offsetWidth; it.classList.add('shake');
        fxCrackChips(_fx.stage);   // 탭마다 껍질 조각이 튀어 깨짐을 강조
      } else { _fx.busy=true; fxClimax(); }
    }
    // ✨ 무지개 승급: 결과 등급이 특별↑이면 확률로 알을 무지개알로 변신(특별 50% · 전설/한정 100%).
    //    시각·연출만 무지개로 바뀌고 결과 펫·보상(_fx.gold)은 그대로. 3번째 탭에서 무지개 오픈 연출로 열린다.
    function maybeRainbowUpgrade(){
      const tier=_fx.res.tier; const chance=(tier==='epic')?0.5:((tier==='legend'||tier==='limited')?1:0);
      if(chance<=0 || Math.random()>=chance) return;
      _fx.rainbow=true; _fx.rbUpgrade=true;
      const it=$('fxItem'), st=$('catFx')&&$('catFx').querySelector('.fx-stage');
      if(it) it.classList.add('fx-rainbow');
      if(st){ st.classList.add('fx-rb'); st.insertAdjacentHTML('beforeend', fxSparkles(14));
        st.insertAdjacentHTML('beforeend','<div class="fx-upgrade">'+raysSvg('#ffffff',{h:220})+'</div>');
        const u=st.querySelector('.fx-upgrade'); if(u) setTimeout(function(){ u.remove(); }, 720); }
      const hint=$('fxHint'); if(hint) hint.textContent='✨ 무지개알로 변했어요! 한 번 더 탭!';
      toast('✨ 무지개알로 변신!');
    }
    // 깨진 껍질 조각(알 전용): 좌우로 튀어나가 아래·옆에 흩어져 놓인다. 큰 조각 2개 + 잔조각.
    function fxShells(){
      let s=''; const n=11; const rb=_fx&&_fx.rainbow;   // 조각을 더 많이 + 더 멀리 튕겨나가게(껍질이 확 깨져 날아가는 게 보이게)
      for(let i=0;i<n;i++){
        const side=(i%2)?1:-1;
        const sx=(side*(62+Math.random()*132)).toFixed(0);   // 좌우로 더 멀리 흩어짐
        const sy=(18+Math.random()*108).toFixed(0);          // 위로 튀었다 아래로 떨어져 옆에 놓임
        const sr=(side*(140+Math.random()*400)).toFixed(0);  // 빙글빙글 더 많이 회전
        const big=i<3;                                        // 큰 곡면 조각 3개 + 잔조각
        const which=big?(i%2):2;                              // A/B(큰), C(작은)
        const h=big?(15+Math.round(Math.random()*7)):(8+Math.round(Math.random()*4));
        const del=(Math.random()*0.12).toFixed(2);
        s+='<span class="fx-shell'+(big?' big':'')+'" style="--sx:'+sx+'px;--sy:'+sy+'px;--sr:'+sr+'deg;--ss:1;animation-delay:'+del+'s">'+shellSvg(which,rb,{h:h})+'</span>';
      }
      return s;
    }
    // 오픈 직전 연출: (흔들림·흰빛) → [확률로: 검은 고양이 앞발로 톡] → (열리는 순간부터 등급색) 빛 새어나옴 → 버스트(알=껍질 조각 튐) → 등장
    // 가챠 오픈 연출 고양이 1마리 생성. side='l'(왼쪽 등장·오른쪽 봄)/'r'(오른쪽 등장·왼쪽 봄). id=지정 펫(스프라이트 자립 걷기·크기=배율) 또는 null(기본 검은고양이 배경 스프라이트 480).
    function fxSpawnCat(st, side, id){
      const isPet=!!(id && typeof hasSprite==='function' && hasSprite(id));
      const size=isPet ? Math.max(140, Math.min(560, Math.round(200*petScale(id)))) : 480;
      const el=document.createElement('div');
      el.className='fx-cat walkin fxc-'+side+(isPet?' fxc-pet':' fxc-gc');
      el.style.setProperty('--cat', size+'px'); el.style.setProperty('--foot','0.06');
      if(isPet){ ensurePetArt(id); el.innerHTML='<div class="fxc-in">'+catActorHTML(id, size)+'</div>';
        if(typeof measureFootPad==='function') measureFootPad(id, function(fp){ el.style.setProperty('--foot', (fp!=null?fp:0.06).toFixed(3)); }, 'east'); }   // 연출은 옆(east)으로 걸으니 east 스틸 여백으로 발끝 정합
      else { el.innerHTML='<div class="fxc-in"></div>'; }
      st.appendChild(el);
    }
    function fxClimax(){
      const fx=$('catFx'), st=fx&&fx.querySelector('.fx-stage'), it=$('fxItem'); if(!st||!it) return;
      const t=tierInfo(_fx.res.tier), epic=['epic','legend','limited'].indexOf(_fx.res.tier)>=0, lim=_fx.res.tier==='limited';
      // 검은 고양이 앞발 연출 = 고등급 티저. 등급별 확률: 특별(epic) 10%·전설 90%·한정 100% (그 미만 0%). 등장 자체가 '뭔가 좋은 게 나온다'는 힌트.
      const catShow = _fxForceCat || (Math.random() < (({ epic:0.10, legend:0.90, limited:1.0 })[_fx.res.tier] || 0));
      _fxForceCat=false;   // 미리보기 강제 플래그는 1회성
      const rank=Math.max(0, TIER_ORDER.indexOf(_fx.res.tier));   // 0(일반)~5(한정)
      const lk=(1+rank*0.15).toFixed(2);                          // 등급 높을수록 빛이 크고 밝게
      const isEgg=_fx.kind==='egg';
      st.style.color='#ffffff';   // 오픈 전(흔들림·고양이)엔 흰빛 — 등급색을 미리 깔면 열기 전에 등급이 새므로, 실제 열리는 순간(t0)부터 등급색으로 바꾼다
      const hint=$('fxHint'); if(hint) hint.remove();
      it.classList.add('fx-preshake');
      let t0=680;
      if(catShow){
        // 개발자가 지정한 펫(config/gachaFx)이 도도하게 걸어나와 앞발로 알을 톡 → 그 자리서 알 오픈. 미지정이면 기본 검은고양이(왼쪽 1마리).
        // 순서(사용자 지침): 1번(왼쪽)이 등장~톡~퇴장을 마친 뒤에 2번(오른쪽)이 시작(동시 등장 아님). 알은 마지막 고양이가 톡 친 직후 열림.
        const a=_gachaFx&&_gachaFx.a, b=_gachaFx&&_gachaFx.b, any=a||b;
        const seq=[]; if(a || !any) seq.push({side:'l', id:any?a:null}); if(b) seq.push({side:'r', id:b});
        const WALK=1800, TAP=160, HIT=180, STEP=2760;   // 한 마리 구간: 등장(WALK)→톡(TAP 뒤 HIT 충격)→퇴장(STEP에서 제거)
        const catAt=side=>st.querySelector('.fx-cat.fxc-'+side);
        seq.forEach((c, i)=>{ const base=i*STEP, isLast=i===seq.length-1;
          _fxT(()=>{ fxSpawnCat(st, c.side, c.id); }, base);   // 등장(walkin)
          _fxT(()=>{ const el=catAt(c.side); if(el){ el.classList.remove('walkin'); el.classList.add('arr','tap'); } }, base+WALK);   // 도착 → 앞발 톡(펫 .cspr은 계속 걷고, 기본 고양이는 CSS로 정지 스틸)
          _fxT(()=>{ it.classList.remove('fx-preshake'); void it.offsetWidth; it.classList.add('fx-hit'); }, base+WALK+TAP);   // 앞발이 닿는 순간 알/상자가 톡 튕김
          _fxT(()=>{ const el=catAt(c.side); if(el){ el.classList.remove('tap'); el.classList.add('leave'); } it.classList.remove('fx-hit'); if(!isLast){ void it.offsetWidth; it.classList.add('fx-preshake'); } }, base+WALK+TAP+HIT);   // 톡 후 물러나며 흐려짐, 다음 고양이 있으면 알은 다시 들썩이며 대기
          _fxT(()=>{ const el=catAt(c.side); if(el) el.remove(); }, base+STEP);
        });
        t0=(seq.length-1)*STEP+2120;   // 마지막 고양이가 톡 친 직후 그 자리에서 알 오픈
      }
      _fxT(()=>{
        st.style.color=t.color;   // 열리는 순간부터 등급색 — 빛·픽셀 파티클·버스트·등장이 currentColor로 등급색을 따른다(그 전엔 흰빛이라 등급 스포일러 방지)
        it.classList.remove('fx-preshake','fx-hit'); void it.offsetWidth; it.classList.add('fx-tremble');
        if(isEgg){ it.innerHTML=eggCrackSvg(t.color, _fx.rainbow, {h:150}); fxCrackChips(4); }   // 알이 크게 갈라지고 틈새로 등급색 빛
        else { it.innerHTML=boxOpenSvg(t.color, _fx.rainbow, {h:150}); it.classList.add('fx-ajar'); }   // 박스: 뚜껑 열리고 틈새로 등급색 빛
        // 갈라진 틈으로 새어나오는 등급색 픽셀 빛 — 은은한 오오라 + 역회전 광선 2겹(둥근 글로우 금지, 도트). 등급↑ 크고 밝게(--lk)
        st.insertAdjacentHTML('afterbegin','<div class="fx-cracklight" style="color:'+t.color+';--lk:'+lk+'">'+lightLayers({aura:170, rays:220})+'</div>');
      }, t0);
      _fxT(()=>{ fxBurst(epic, isEgg, rank); }, t0+700);
      _fxT(fxReveal, t0+700+(isEgg?560:320));   // 알은 껍질 조각이 옆으로 흩어져 앉을 시간을 조금 더 준다
    }
    function fxBurst(big, isEgg, rank){
      const st=$('catFx').querySelector('.fx-stage'); if(!st) return;
      const it=$('fxItem'); if(it) it.style.visibility='hidden';
      rank=rank||0;
      const parts=12+rank*7;                          // 등급 높을수록 픽셀 파티클 더 많이(화려하게)
      const rays=(rank>=3)?'<div class="fx-pixrays">'+raysSvg('currentColor',{h:360})+'</div>':'';       // 특별↑ 등급색 픽셀 광선(선버스트)
      const sparks=(rank>=3)?fxSparkles(6+rank*3):'';             // 특별↑ 추가 반짝임(등급색)
      st.insertAdjacentHTML('beforeend','<div class="fx-pixflash">'+raysSvg('currentColor',{h:150})+'</div>'+rays+sparks+(isEgg?fxShells():'')+fxParticles(parts));
      const h=$('fxHint'); if(h) h.remove();
    }
    // 등장 연출 — 등급마다 화려함이 다르게 (CSS .fx-reveal.rank-N/.rev-rb로 계단식 확대):
    //  낮은 등급=작은 오오라+약간의 반짝임, 특별↑=발산 광선 등장, 전설↑=픽셀 링 충격파+컨페티 폭발, 무지개=무지개 프레임·컨페티.
    function fxReveal(){
      if(!_fx) return; const fx=$('catFx'); const t=tierInfo(_fx.res.tier);
      const rank=Math.max(0, TIER_ORDER.indexOf(_fx.res.tier));
      const rb=!!_fx.rainbow;                                             // 무지개(승급 또는 무지개알 구매)
      const conf=rb?32:(rank<=0?0:rank<=1?10:rank<=2?16:20+(rank-2)*8);   // 등급↑ 컨페티 더 많이(일반=없음)
      const tw=5+rank*3;                                                  // 트윙클 수(등급↑ 많이)
      const art=_fx.kind==='egg'?catFace(_fx.res.id,{h:118,eager:true}):furnSvg(_fx.res.id,{h:104});   // eager: 등장 즉시 표시(lazy면 ~1초 늦게 뜸)
      fx.innerHTML='<div class="fx-scrim"></div><div class="fx-reveal tier-'+t.id+' rank-'+rank+(rb?' rev-rb':'')+'">'+
        '<div class="fx-art pop">'+
          '<span class="fx-aurawrap">'+lightLayers({aura:210, rays:250})+'</span>'+   // 펫 뒤 픽셀 오오라(+특별↑은 발산 광선까지 CSS로 표시)
          '<span class="fx-ring"></span>'+                                            // 전설↑/무지개: 픽셀 링 충격파(CSS)
          '<span class="fx-twinkles">'+fxAuraTwinkles(tw)+'</span>'+                   // 펫 둘레 트윙클 도트
          '<span class="fx-frame"></span>'+
          '<span class="fx-artimg">'+art+'</span>'+
        '</div>'+
        '<div class="fx-tier">'+t.name+'</div>'+
        '<div class="fx-name">'+(_fx.kind==='egg'?catNameSpan(_fx.res.id,catName(_fx.res.id)):escapeHtml(itemName(_fx.kind,_fx.res.id)))+'</div>'+
        '<div class="fx-reward">'+(_fx.gold?'<span class="rw"><span class="ci">'+goldSvg({h:18})+'</span>+1 금화</span>':'')+
          (_fx.dup?'<span class="rw"><span class="ci">'+coinSvg({h:18})+'</span>+'+_fx.refund+' 은화 (중복)</span>':'')+'</div>'+
        '<button class="btn" onclick="closeFx()">확인</button>'+
        '<div class="fx-confetti">'+(conf?fxConfetti(conf):'')+'</div></div>';
      fx.className='fx on reveal';
    }
    function closeFx(){ _fxClear(); _fxForceCat=false; const fx=$('catFx'); if(fx){ fx.className='fx'; fx.innerHTML=''; } _fx=null; }   // 미리보기를 climax 전에 닫아도 강제 플래그가 다음 실전 뽑기로 새지 않게 리셋

    // ================= 개발자 패널: 펫알/박스 확률·구성 =================
    function openDevGacha(){
      if(!isDev()) return;
      const cfg=devCfg(), tp=cfg.tiers||{}, ct=effCatTier(), it=effItemTier();
      const tierOpt=(cur)=>TIERS.map(t=>'<option value="'+t.id+'"'+(cur===t.id?' selected':'')+'>'+t.name+'</option>').join('');
      let h='<div class="note"><span class="pill">이 기기만</span> 개발자 전용 · 이 설정(확률·등급·연출/다마고치 테스트)은 <b>이 기기(브라우저)에만</b> 적용됩니다(재화 지급은 내 계정에 반영). 확률 합이 100이 아니어도 비율로 반영돼요.</div>';
      h+='<div class="sec-title">연출 테스트(무료)</div>';
      h+='<div class="tx-sub" style="margin:0 2px 6px;">펫알</div><div class="chip-row">'+TIERS.map(t=>'<button class="chip" onclick="devPreview(\'egg\',\''+t.id+'\')"><b class="tier-'+t.id+'">'+t.name+'</b></button>').join('')+'</div>';
      h+='<div class="tx-sub" style="margin:8px 2px 6px;">랜덤박스</div><div class="chip-row">'+TIERS.map(t=>'<button class="chip" onclick="devPreview(\'box\',\''+t.id+'\')"><b class="tier-'+t.id+'">'+t.name+'</b></button>').join('')+'</div>';
      h+='<div class="sec-title" style="margin-top:18px;">다마고치 테스트(즉시)</div>';
      h+='<div class="note" style="margin-bottom:8px;">3시간을 기다리지 않고 급여·배변·수거를 바로 확인. 순서: <b>사료·물 +10</b> → 홈에서 그릇 채우기(또는 <b>그릇 다 채우기</b>) → <b>그릇 만료→똥</b> → 똥 탭/일괄 돌보기.</div>';
      h+='<div class="chip-row"><button class="chip" onclick="devGiveConsum()">사료·물 +10</button><button class="chip" onclick="devFillAll()">그릇 다 채우기</button><button class="chip" onclick="devExpireBowls()">그릇 만료→똥</button><button class="chip" onclick="devAddPoop()">똥 +3</button></div>';
      // 재화 추가(지급) — 은화·금화·펫알·랜덤박스·무지개알·무지개박스를 입력 수량만큼 내 계정에 지급
      h+='<div class="sec-title" style="margin-top:18px;">재화 추가(지급)</div>';
      h+='<div class="note" style="margin-bottom:8px;">입력한 수량만큼 <b>내 계정</b>에 지급해요(비우면 건너뜀, 음수면 차감·0 미만은 안 됨).</div>';
      { const cur6=[['coins','은화',coinSvg({h:18})],['gold','금화',goldSvg({h:18})],['egg','펫알',eggSvg(0,{h:18})],['box','랜덤박스',boxSvg({h:18})],['rainbow_egg','무지개알',rainbowEggSvg({h:18})],['rainbow_box','무지개박스',rainbowBoxSvg({h:18})]];
        h+=cur6.map(function(c){ return '<div class="row" style="padding:5px 2px;align-items:center;"><span style="display:flex;align-items:center;gap:8px;min-width:0;"><span style="display:inline-flex;flex:none;">'+c[2]+'</span>'+c[1]+'</span><input class="input" style="width:120px;text-align:right;" inputmode="numeric" id="dv_'+c[0]+'" placeholder="0"></div>'; }).join(''); }
      h+='<button class="btn" style="margin-top:12px;" onclick="devGrantCurrency()">지급</button>';
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
    function devFillAll(){ if(!isDev())return; gameRef().transaction(g=>{ g=normalizeGame(g); const now=Date.now(); const R=gRoom(g); Object.keys(R.placed||{}).forEach(k=>{ const e=R.placed[k]; if(e&&(e.itemId==='bowl'||e.itemId==='waterbowl')) e.filledAt=now; }); return g; }).then(r=>{ if(r&&r.committed) toast('모든 그릇 채움 🍚💧'); }); }
    function devExpireBowls(){ if(!isDev())return; gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoom(g); const pl=R.placed||{}; let poop=0; Object.keys(pl).forEach(k=>{ const e=pl[k]; if(e&&e.filledAt&&(e.itemId==='bowl'||e.itemId==='waterbowl')){ e.filledAt=null; poop++; } }); if(poop) R.poops=(Number(R.poops)||0)+poop; return g; }).then(r=>{ if(r&&r.committed) toast('채워진 그릇 만료 → 똥 생성'); }); }
    function devAddPoop(){ if(!isDev())return; gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoom(g); R.poops=(Number(R.poops)||0)+3; return g; }).then(r=>{ if(r&&r.committed) toast('똥 +3'); }); }
    function devAddCoins(){ if(!isDev())return; gameRef().transaction(g=>{ g=normalizeGame(g); g.coins+=100; return g; }).then(r=>{ if(r&&r.committed) toast('은화 +100'); }); }
    // 재화 지급(개발자): dv_* 입력값을 읽어 은화·금화·소비템(펫알/박스/무지개알/무지개박스)을 한 트랜잭션에 지급.
    function devGrantCurrency(){ if(!isDev())return;
      const rd=id=>{ const v=parseInt(val('dv_'+id),10); return isNaN(v)?0:v; };
      const c=rd('coins'), gd=rd('gold'), eg=rd('egg'), bx=rd('box'), re=rd('rainbow_egg'), rb=rd('rainbow_box');
      if(!(c||gd||eg||bx||re||rb)){ toast('수량을 입력하세요', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if(c)  g.coins=clampCoins((g.coins||0)+c);
        if(gd) g.gold=clampGold((g.gold||0)+gd);
        if(eg) g.consum.egg=clampConsum((g.consum.egg||0)+eg);
        if(bx) g.consum.box=clampConsum((g.consum.box||0)+bx);
        if(re) g.consum.rainbow_egg=clampConsum((g.consum.rainbow_egg||0)+re);
        if(rb) g.consum.rainbow_box=clampConsum((g.consum.rainbow_box||0)+rb);
        return g; }).then(r=>{ if(r&&r.committed){ toast('재화 지급 완료 🎁'); if(state._sheetRefresh) state._sheetRefresh(); } });
    }
