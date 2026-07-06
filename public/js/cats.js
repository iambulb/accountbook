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
    // 🧀 치즈(오렌지 태비) 고양이 얼굴 — 은화 속 고양이 얼굴처럼 간결한 도트, 치즈색. 거래 카테고리 아이콘 선택지(CAT_PIX_ICONS). 16×15.
    //  X=외곽 O=오렌지 o=진한 줄무늬(태비) L=밝은 하이라이트 P=분홍(코·귀속) E=눈 W=흰 입주변
    const M_CHEESECAT = [
      "..XX........XX..",
      ".XOOX......XOOX.",
      ".XOPOX....XOPOX.",
      ".XOPPOXXXXOPPOX.",
      ".XOOoOOOOOOoOOX.",
      "XOOoOoOOOOoOoOOX",
      "XOOoOOOOOOOOoOOX",
      "XOLOOOOOOOOOOLOX",
      "XOOEEOOOOOOEEOOX",
      "XOOEEOOooOOEEOOX",
      "XOOOOOoPPoOOOOOX",
      "XOOWWWWPPWWWWOOX",
      ".XOWWWoWWoWWOOX.",
      ".XOOWWWWWWWWOOX.",
      "..XXOOOOOOOOXX.."
    ];
    const CHEESECAT_PAL = {X:'#8a4e1e',O:'#f2a03c',o:'#d9772a',L:'#ffca77',P:'#ec9090',E:'#4a3a24',W:'#fff2dc'};
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
    // 배변패드(1×1): 파란 플라스틱 테두리(B 밝음·b 그림자·e 상단 하이라이트)+흰 흡수면(W)에 퀼팅 다이아몬드 무늬(w 옅은 파랑). 바닥에 깔린 얇은 패드. 비운 그릇 수만큼 똥이 위에 쌓임. 16×11 → 가로세로비 ≈1.455.
    const M_LITTER = [
      "................",
      ".BBBBBBBBBBBBBB.",
      ".Beeeeeeeeeeeeb.",
      ".BWwWwWwWwWwWwb.",
      ".BWWwWWWwWWWwWb.",
      ".BWwWwWwWwWwWwb.",
      ".BwWWWwWWWwWWWb.",
      ".BWwWwWwWwWwWwb.",
      ".BWWWWWWWWWWWWb.",
      ".bbbbbbbbbbbbbb.",
      "................"
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
    // 러그(바닥 아이템, 28×11 가로세로비 2.545): 술(F 좌우 프린지)+이중 테두리(X 진한 외곽·o 안쪽)+바탕(B)+금 마름모 메달리온(G/N 중심)+모서리 장식(L). 높이 없이 바닥에 깔리고 위에 다른 가구를 올릴 수 있음. footW3×footH2.
    const M_RUG = [
      "..XXXXXXXXXXXXXXXXXXXXXXXX..",
      "F.XooooooooooooooooooooooX.F",
      "..XoLBBBBBBBBBBBBBBBBBBLoX..",
      "F.XoBBBBBBBBBGGBBBBBBBBBoX.F",
      "..XoBBBBBBBBGLLGBBBBBBBBoX..",
      "F.XoBBBBBBBGLNNLGBBBBBBBoX.F",
      "..XoBBBBBBBBGLLGBBBBBBBBoX..",
      "F.XoBBBBBBBBBGGBBBBBBBBBoX.F",
      "..XoLBBBBBBBBBBBBBBBBBBLoX..",
      "F.XooooooooooooooooooooooX.F",
      "..XXXXXXXXXXXXXXXXXXXXXXXX.."
    ];
    // 창문(18×20 가로세로비 0.9): 원목틀(X 외곽·W 나무·w 창턱)+하늘(S)+해(U/u)+구름(C, 캠에서만 좌우로 천천히 흘러감).
    const M_WINDOW = [
      "XXXXXXXXXXXXXXXXXX",
      "XWWWWWWWWWWWWWWWWX",
      "XWXXXXXXXXXXXXXXWX",
      "XWXSSSSSSSSSUUSXWX",
      "XWXSSSSSSSSUUUUXWX",
      "XWXSSSSSSSSSuUSXWX",
      "XWXSCCSSSSSSSSSXWX",
      "XWXCCCCSSSSSSSSXWX",
      "XWXSCCSSSSSSSSSXWX",
      "XWXSSSSSSSSSSSSXWX",
      "XWXSSSSSSSSSSSSXWX",
      "XWXSSSSSSSCCSSSXWX",
      "XWXSSSSSSCCCCSSXWX",
      "XWXSSSSSSSCCSSSXWX",
      "XWXSSSSSSSSSSSSXWX",
      "XWXSSSSSSSSSSSSXWX",
      "XWXXXXXXXXXXXXXXWX",
      "XWWWWWWWWWWWWWWWWX",
      "XwwwwwwwwwwwwwwwwX",
      "XXXXXXXXXXXXXXXXXX"
    ];
    // 어항(18×16 가로세로비 1.125): 유리틀(X)+유리(G)+물(A/a)+수초(P/p)+금붕어(F/f)+기포(b)+자갈(R)+받침(D). 캠에서만 금붕어·기포가 헤엄치듯 살랑.
    const M_FISHTANK = [
      "..XXXXXXXXXXXXXX..",
      ".XGGGGGGGGGGGGGGX.",
      "XGAAAAAAAAAAAAAAGX",
      "XGAAAAAbAAAAAAAAGX",
      "XGAAAAAAAAAApAAAGX",
      "XGAAAAAAAAAPPPAAGX",
      "XGAAFFFAAAAPpPAAGX",
      "XGAFffFAAAAPPPAAGX",
      "XGAFFFAbAAAaPaAAGX",
      "XGAAAAAAAAAPPPAaGX",
      "XGAAAAAAAAaPpPaAGX",
      "XGRRRRRRRRRRRRRRGX",
      "XGRRRRRRRRRRRRRRGX",
      ".XGGGGGGGGGGGGGGX.",
      "..XDDDDDDDDDDDDX..",
      "...DDDDDDDDDDDD..."
    ];
    // 벽난로(18×16 가로세로비 1.125): 벽돌(K/k)+맨틀(W/w)+아궁이(D)+장작(W/w)+불꽃(f 노랑·F 주황·r 빨강, 캠에서만 일렁임 flicker).
    const M_FIREPLACE = [
      "XXXXXXXXXXXXXXXXXX","XwwwwwwwwwwwwwwwwX","XWWWWWWWWWWWWWWWWX","XKkKKkKKkKKkKKkKKX",
      "XKkKDDDDDDDDDDKkKX","XkKkDDDDffDDDDkKkX","XKkKDDDfFFfDDDKkKX","XkKkDDffFrFfDDkKkX",
      "XKkKDDfFrrrFfDKkKX","XkKkDDfFrrrFFDkKkX","XKkKDDWwWWwWWDKkKX","XkKkDDWWwWWwWDkKkX",
      "XKkKDDDDDDDDDDKkKX","XKkKKkKKkKKkKKkKKX","XSSSSSSSSSSSSSSSSX","ssssssssssssssssss"
    ];
    // 선풍기(16×22 가로세로비 0.727): 케이지 림(X)+날개(G 중간·L 하이라이트·D 그림자 명암, 회전)+허브(h)+목(N)+받침(S/s). ※ B(진한 하늘색 날개)는 팔레트 미등록=투명(뒷배경 비침). 명암 글자 L·D도 FURN_ANIM.fan.move에 넣어야 함께 회전.
    const M_FAN = [
      "......XXXX......","....XXBBBBXX....","...X.BBBBBB.X...","..X..LBBBBL..X..",
      ".XX.LGBBBBGL.XX.",".X.DLGGBBGGLD.X.",".X.GGGDhhDGGG.X.",".X.GDDhhhhBBBBX.",
      ".XBBBBBhhBBBBBX.",".XBBBBBGGBBBBBX.",".XXBBBLGGDBBBXX.","..XBBDLGGDLBBX..",
      "...XB.LGGD.BX...","....XX....XX....","......XXXX......",".......NN.......",
      ".......NN.......",".......NN.......",".....SSSSSS.....","....SSSSSSSS....",
      "...SSSSSSSSSS...","...ssssssssss..."
    ];
    // 해먹(16×13 가로세로비 1.231): 나무 기둥(X/W/w)+끈(K)+천 요람(C/c 음영·L 밝음)+베개(P/p, 캠에서만 살랑 swing). 펫이 안에 올라가 쉼. footW1×footH1.
    const M_HAMMOCK = [
      "................",".X............X.",".W............W.",".W.K........K.W.",
      ".W..K......K..W.",".W..CPPLLLLLC.W.",".w.CLPPLLLLLLCw.",".w.CLLLLLLLLLCw.",
      "...CcLLLLLLcC...","....CccccccC....",".....CccccC.....","......cCCc......",
      "................"
    ];
    // 낚싯대 장난감(16×20 가로세로비 0.8): 받침(S/s)+대(R)+줄(K)+깃털 장난감(F/f·T 술, 캠에서만 흔들 swing). 펫이 옆에서 톡톡.
    const M_TEASER = [
      ".......RRRRRRR..",".......R.....K..",".......R.....K..",".......R.....K..",
      ".......R.....K..",".......R....FfF.",".......R...FfffF",".......R...FfffF",
      ".......R....FfF.",".......R.....T..",".......R........",".......R........",
      ".......R........",".......R........",".......R........",".......R........",
      ".....SSSSS......","....SSSSSSS.....","...SSSSSSSSS....","....sssssss....."
    ];
    // 벽시계(14×22 가로세로비 0.636): 나무 몸통(W/w)+시계판(L·D 바늘)+추(K 봉·O 놋쇠, 캠에서만 좌우로 흔들 swing).
    const M_WALLCLOCK = [
      "....XXXXXX....","...XWWWWWWX...","..XWwwwwwwWX..",".XWLLLLLLLLWX.",".XLLLLLLLLLLX.",
      ".XLLLDDLLLLLX.",".XLLLLDLLLLLX.",".XLLLLDDDLLLX.",".XLLLLLLLLLLX.",".XWLLLLLLLLWX.",
      "..XWWWWWWWWX..","...XWWWWWWX...","...XWDDDDWX...","...XWDKDDWX...","...XWDKDDWX...",
      "...XWDKDDWX...","...XWDKDDWX...","...XWDOODWX...","...XWDOODWX...","...XWWWWWWX...",
      "....XWWWWX....","....XXXXXX...."
    ];
    // 행잉플랜트(14×20 가로세로비 0.7): 천장 걸이(X)+끈(K)+화분(P/p)+늘어진 덩굴 잎(G/L/l/g, 캠에서만 전체가 살랑 swing).
    const M_HANGPLANT = [
      "......XX......",".....K..K.....","....K....K....","...K......K...","...PPPPPPPP...",
      "...PppppppP...","...PppppppP...","...PppppppP...","....PPPPPP....","...GLgLGgLG...",
      "..GLlGLgLGlG..","..gLGLlLGLgL..","...GlLGgLlG...","....GLgLG.....","....gLLGl.....",
      ".....GLG......",".....gLl......","......G.......","..............",".............."
    ];
    // 모빌(18×15 가로세로비 1.2): 걸이(X)+막대(M)+끈(K)+별(A)·달(B)·하트(C) 매달림(캠에서만 전체가 살랑 swing).
    const M_MOBILE = [
      "........XX........","........KK........","...MMMMMMMMMMMM...","....K....K....K...",
      "....K....K....K...","....A...BB...C.C..","...AaA..Bb...CcC..","....A...BB....C...",
      "..................","..................","..................","..................",
      "..................","..................",".................."
    ];
    // 샹들리에(20×20 가로세로비 1.0): 체인(K)+금속 프레임(f 그림자·F 중간·H 하이라이트)+촛불 팔(W 초·Y 노랑·y 주황)+크리스털(C 밝음·c 그림자·o 반짝임) — 매다는형(hang) 벽 가구, 한정 등급.
    const M_CHANDELIER = [
      ".........KK.........",".........KK.........","........fFFf........",".......fFHHFf.......",
      "........fFFf........","...y..yFHHFy..y.....","..yYy.WFHHFW.yYy....","..WHW.FHHHHF.WHW....",
      ".fFFFFFHHHHFFFFFf...","fF..FfFHHHHFfF..Ff..",".c...FFHHHHFF...c...",".Cc..fFHooHFf..cC...",
      "..Cc..FCooCF..cC....","...c..fCooCf..c.....","...Cc..CooC..cC.....","....c...oo...c......",
      ".....c..CC..c.......","......c.oo.c........",".......CooC.........","........oo.........."
    ];
    // 방울공(12×12 가로세로비 1.0): 공(B/b 음영·L 하이라이트·X 외곽)+방울선(D)+방울(S). 캠에서만 통통 흔들(swing).
    const M_JINGLEBALL = [
      "............","...XXXXXX...","..XXLBBBXX..",".XXLLLBBBXX.",".XLLLLBBBBX.",".XDDDDDDDDX.",
      ".XDDDDDDDDX.",".XBBBBBBbbX.",".XXBBSSbbXX.","..XXBBbbXX..","...XXXXXX...","............"
    ];
    // ===== 🖼️ 벽 가구 콘텐츠(전부 wall:true, mount 앵커) =====
    // 액자(16×15): 금테(X/W/w)+풍경(하늘 S·해 U·구름 c·언덕 G/g·나무 t/T).
    const M_FRAME = [
      "XXXXXXXXXXXXXXXX","XWWWWWWWWWWWWWWX","XWwwwwwwwwwwwwWX","XWwSSSSSSSUUSwWX","XWwSSSSSSSUUSwWX",
      "XWwSSSSSSSSSSwWX","XWwSScSSSSSSSwWX","XWwScccSSSSSSwWX","XWwGGGGGGGGGGwWX","XWwGtGGGGtGGGwWX",
      "XWwGTGGGGTGGGwWX","XWwgGGGGGGGggwWX","XWwwwwwwwwwwwwWX","XWWWWWWWWWWWWWWX","XXXXXXXXXXXXXXXX"
    ];
    // 벽 선반(20×12): 원목 널(W/w)+금속 브래킷(K)+위 소품(화분 G/L/P·책 B/r/o·컵 C/c).
    const M_SHELF = [
      "....GG.....BB.......","...GLLG...BBBB..CC..","..GLLLLG..BrrB.CccC.","...PppP...BBBB.CccC.",
      "...PppP...BooB..CC..","WWWWWWWWWWWWWWWWWWWW","wwwwwwwwwwwwwwwwwwww","..K..............K..",
      "..K..............K..","..KK............KK..","....................","...................."
    ];
    // 거울(12×19): 금테 타원(X 외곽·W 밝음·w 그림자·o 상하 장식)+반사면(A 중간·a 그림자·b 밝음 그라데이션)+사선 광택(h, 캠에서 반짝 스윕). ※ 맨 아래 빈 줄 없음 — mount 앵커라 아래가 배치칸 바닥선에 딱 붙어야(창문처럼) 함.
    const M_MIRROR = [
      "....oXXo....","..oXWWWWXo..",".XWwHHHHwWX.","XWwaaaaaaWwX","XWwaaaahAbWX","XWwaaahAAbWX",
      "XWwaahAAAbWX","XWwahAAAAbWX","XWwhAAAAAbWX","XWwAAAAAAbWX","XWwAAAAAAbWX","XWwAAAAAbbWX",
      "XWwAAAAbbbWX","XWwAAAbbbbWX",".XWwbbbbwWX.","..XWwwwwWX..","...XWHHWX...","..oXWWWWXo..","....oXXo...."
    ];
    // 네온 하트(18×14, blink): 네온관 채운 하트(N 분홍 코어·H 밝은 분홍·C 화이트 핫스팟·g 뒤 글로우)+양옆 반짝임(S). 캠에서 네온처럼 파르르 깜빡.
    const M_NEON = [
      "..................","....ggg...ggg.....","...gNNNg.gNNNg....","..gNHHHNgNHHHNg...","..gNHCHHNHHCHNg...",
      "..gNHHHHHHHHHNg...","...gNHHHHHHHNg....","....gNHHHHHNg.....",".....gNHHHNg......","......gNHNg.......",
      ".......gNg........","........g.........","...S..........S...",".................."
    ];
    // 벽등(14×18, flicker): 촛불(y 심지빛·Y 불꽃·F 불빛 글로우)+금속 그릇(K 어둠·k 밝음·H 하이라이트)+벽 부착판. 캠에서 불꽃이 활발히 일렁.
    const M_SCONCE = [
      "......yy......","......yy......",".....yYYy.....",".....YYYY.....","....yYYYYy....","....FYYYYF....",
      "...FkFFFFkF...","..kKKKKKKKKk..","..kHKKKKKKHk..","...kKKKKKKk...","....kKKKKk....",".....kKKk.....",
      "......KK......",".....KKKK.....",".....KHHK.....",".....KKKK.....","......KK......",".............."
    ];
    // 가랜드(24×9, hang, blink): 줄(K)+매달린 전구(A/B/C 색 순환·a/b/c 음영·h 하이라이트) — 캠에서 전구 깜빡.
    const M_GARLAND = [
      "KKKKKKKKKKKKKKKKKKKKKKKK","..K...K...K...K...K...K.",".hA..hB..hC..hA..hB..hC.",
      ".AA..BB..CC..AA..BB..CC.",".aa..bb..cc..aa..bb..cc.","........................",
      "........................","........................","........................"
    ];
    // 포스터(14×18, mount): 여행 포스터(하늘 S·해 U·산 M·글자바 P/d).
    const M_POSTER = [
      "XXXXXXXXXXXXXX","XSSSSSSSSSSSSX","XSSSSUUUUSSSSX","XSSSUUUUUUSSSX","XSSSUUUUUUSSSX",
      "XSSSSUUUUSSSSX","XSSSSSSSSSSSSX","XSSSSSSSSSSSSX","XSSMMSSSSMMMSX","XSMMMMSSMMMMMX",
      "XMMMMMMMMMMMMX","XMMMMMMMMMMMMX","XPPPPPPPPPPPPX","XPddPPddPPddPX","XPPPPPPPPPPPPX",
      "XPddddPPddddPX","XPPPPPPPPPPPPX","XXXXXXXXXXXXXX"
    ];
    // 태피스트리(16×22, hang): 봉(K/w)+무늬 천(C/D·메달 o/O)+술(f).
    const M_TAPESTRY = [
      "KKKKKKKKKKKKKKKK","KwwwwwwwwwwwwwwK",".CCCCCCCCCCCCCC.",".CCDDCCDDCCDDCC.",".CDDDDCCDDCCDDC.",
      ".CCDDCCDDCCDDCC.",".CCCCCCCCCCCCCC.",".CCoooCCCCoooCC.",".CoOOOoCCoOOOoC.",".CCoooCCCCoooCC.",
      ".CCCCCCCCCCCCCC.",".CCDDCCDDCCDDCC.",".CDDDDCCDDCCDDC.",".CCDDCCDDCCDDCC.",".CCCCCCCCCCCCCC.",
      ".CCCCCCCCCCCCCC.",".ffffffffffffff.",".f.f.f.f.f.f.f.f",".f...f...f...f..","................",
      "................","................"
    ];
    // ===== 🧵 바닥/벽지/구조물 픽셀 타일 (build_assets.py 생성) =====
    const M_FLOOR_WOOD = [
      'LLLLLLLLLLLLLLLL',
      'LLLGLLLLGLLLLGLL',
      'LLLLLLLLLLLLLLLL',
      'SSSSSSSSSSSSSSSS',
      'MMMMMMMMMMMMMMMM',
      'MMMMMMMMGMMMMMMG',
      'MMMMMMGMMMMMGGMM',
      'SSSSSSSSSSSSSSSS',
      'LLLLLLLLLLLLLLLL',
      'LGLLLLLGLGGLLLLG',
      'LGLLLLLLLLLLLLLL',
      'SSSSSSSSSSSSSSSS',
      'MMMMMMMMMMMMMMMM',
      'MMMMMMGGMMMGMMMM',
      'MGMMMMMMMMMMMMMM',
      'SSSSSSSSSSSSSSSS',
    ];
    const M_FLOOR_CHECKER = [
      'GGGGGGGGGGGGGGGG',
      'GAAAAAAAGBBBBBBB',
      'GAAAAAAAGBBBBBBB',
      'GAAAAAAAGBBBBBBB',
      'GAAAAAAAGBBBBBBB',
      'GAAAAAAAGBBBBBBB',
      'GAAAAAAAGBBBBBBB',
      'GAAAAAAAGBBBBBBB',
      'GGGGGGGGGGGGGGGG',
      'GBBBBBBBGAAAAAAA',
      'GBBBBBBBGAAAAAAA',
      'GBBBBBBBGAAAAAAA',
      'GBBBBBBBGAAAAAAA',
      'GBBBBBBBGAAAAAAA',
      'GBBBBBBBGAAAAAAA',
      'GBBBBBBBGAAAAAAA',
    ];
    const M_FLOOR_GRASS = [
      'GgpgGGgGgGggGGgG',
      'GGGGGgGGggGGGGGG',
      'GggGgGGGGGGGGGfG',
      'GgGggfgGgGGGGGGG',
      'GgGGGGgGGGGGGGgG',
      'gggGgGgGgGGGGGGG',
      'GgGggGGGGGgGGGGG',
      'GGGggGGGGGgGggGg',
      'GggggGgGGgGGGgGG',
      'GGggGGGggGGgGgGG',
      'GGGGgGGGGGGGGGGG',
      'GGGggGGGGGGGGGGG',
      'ggGGGGGGgGGGGGgg',
      'ggGGGGGgggGGgGGg',
      'GGggGGGGGGGpGGGG',
      'GGggGGGGGGGGGgGG',
    ];
    const M_FLOOR_ONDOL = [
      'AAAAAAAAAAAAAAAA',
      'AAAAAAAAAAAAAAAA',
      'sAaAaAaAaAaAaAaA',
      'AAAAAAAAAAAAAAAA',
      'AAAAAAAAAAAAAAAA',
      'AaAaAaAaAaAaAaAa',
      'AAAAAAAAAAAAAAAA',
      'AAAAsAsAAAAAAAAA',
      'aAaAaAaAaAaAaAaA',
      'AAAAAAAAAAAAAAAA',
      'AAAAAAAAAAAAAAAA',
      'AaAaAaAaAaAaAaAs',
      'AAAAsAAAAAAAAAAA',
      'AAAAAAAAAAAAAAAA',
      'aAaAaAaAaAaAaAaA',
      'AAAAAAAAsAAAAAAs',
    ];
    const M_FLOOR_STARRY = [
      'NNnNNNNNNnNNNnNs',
      'nnNNNyNNNNNNNnNN',
      'NNNNnnsnNNNNnNnN',
      'nnNNnNnNNNnsNNsn',
      'NsNNnNNNNnNNNNNN',
      'nnNnNNnNNnNNnNNN',
      'NNNNNNnNNnNNnnNs',
      'nnNnnNNNynNnNnNN',
      'NnNNNsNNnNNNNNNN',
      'NNNnnNNNNNNnnnNN',
      'NnNnNNnnnnnnNNnn',
      'NnnNNyNNNNnnnNnN',
      'NnNnNNNNNNNnNNNN',
      'NNnNNnNNNNnnnNNN',
      'NNnnnnNNNNNNNNNn',
      'nNNNnNnNNnNNNNnN',
    ];
    const M_FLOOR_SAND = [
      'dShddShdShddShdS',
      'SSShdddSSShdddSS',
      'SSShhddSSShhddSS',
      'SddSSSSSddcSSSSd',
      'dhSdSSSdhSccSSdh',
      'SShSdShSShSdShSS',
      'SSSSSddSSSSSddSS',
      'SddhhhSSddhhhSSd',
      'dSSdSSSdSSdSSSdS',
      'hhSSdSShhSSdSShh',
      'SShSSddSShSSddSS',
      'SddcSSSSddSSSSSd',
      'dSSdhhSdSSdhhSdS',
      'SSSSdSSSSSSdSSSS',
      'hhSSSddhhSSSddhh',
      'SddSSShSddSSShSd',
    ];
    const M_FLOOR_TATAMI = [
      'bbbbbbbbbbbbbbbb',
      'btttttttbtTtTtTt',
      'bTTTTTTTbtTtTtTt',
      'btttttttbtTtTtTt',
      'bTTTTTTTbtTtTtTt',
      'btttttttbtTtTtTt',
      'bTTTTTTTbtTtTtTt',
      'btttttttbtTtTtTt',
      'bTTTTTTTbtTtTtTt',
      'btttttttbtTtTtTt',
      'bTTTTTTTbtTtTtTt',
      'btttttttbtTtTtTt',
      'bTTTTTTTbtTtTtTt',
      'btttttttbtTtTtTt',
      'bTTTTTTTbtTtTtTt',
      'bbbbbbbbbbbbbbbb',
    ];
    const M_FLOOR_BRICKPATH = [
      'MMMMMMMMMMMMMMMM',
      'MHHHHHHHMHHHHHHH',
      'MHBBBBBSMHBBBBBS',
      'MSSSSSSSMSSSSSSS',
      'MMMMMMMMMMMMMMMM',
      'HHHHMHHHHHHHMHHH',
      'BBBSMHBBBBBSMHBB',
      'SSSSMSSSSSSSMSSS',
      'MMMMMMMMMMMMMMMM',
      'MHHHHHHHMHHHHHHH',
      'MHBBBBBSMHBBBBBS',
      'MSSSSSSSMSSSSSSS',
      'MMMMMMMMMMMMMMMM',
      'HHHHMHHHHHHHMHHH',
      'BBBSMHBBBBBSMHBB',
      'SSSSMSSSSSSSMSSS',
    ];
    const M_WALL_BRICK = [
      'MMMMMMMMMMMMMMMM',
      'MHHHHHHHMHHHHHHH',
      'MHBBBBBSMHBBBBBS',
      'MSSSSSSSMSSSSSSS',
      'MMMMMMMMMMMMMMMM',
      'HHHHMHHHHHHHMHHH',
      'BBBSMHBBBBBSMHBB',
      'SSSSMSSSSSSSMSSS',
      'MMMMMMMMMMMMMMMM',
      'MHHHHHHHMHHHHHHH',
      'MHBBBBBSMHBBBBBS',
      'MSSSSSSSMSSSSSSS',
      'MMMMMMMMMMMMMMMM',
      'HHHHMHHHHHHHMHHH',
      'BBBSMHBBBBBSMHBB',
      'SSSSMSSSSSSSMSSS',
    ];
    const M_POND = [
      '..............................',
      '........kkkkkHHHHkkkkk........',
      '.....kkkwwwmmmmmmmmwwwkkk.....',
      '...kkHwmmmmSmmmmmmmmmmmwHkk...',
      '..kkwmPPPPPmmmmmmmmrrmmmmwkk..',
      '.kHwmPPPFPPPWWWWWWWmmmrmmmwHk.',
      'kKwmPPPFYFmmPWWWWWWWWmmrmmmwKk',
      'kHwmmpppFpppWWWoOXOWtWmmmmmwHk',
      'KHwmmrpppppWWWWOOOOotWmmrmmwHK',
      'KKwmmSmmWWWWWWWWWOoWPPPPrmmwKK',
      'KKwmmmmmWWWWWWWWWWPPPPPPPPmwKK',
      'kKwmmmrmmWWWWWWWWPPPPPPmmmPwKk',
      '.KKwmtOXommWSWWWWppppppmmmpKK.',
      '..KKwmOomrrmmmmmmmppppppppKK..',
      '...KKKwmmmmmmmmmmmmmppppKKK...',
      '.....KKKwwwmmmmmmmmwwwKKK.....',
      '........KKKKKKKKKKKKKK........',
      '..............................',
    ];
    const FLOOR_PALS = {
      wood: {L:'#e2b578', M:'#d3a260', G:'#c08f4c', S:'#9a6a34'},
      checker: {A:'#efe7d6', B:'#dbe0e7', G:'#cdd2d8'},
      grass: {G:'#93c56d', g:'#79b154', f:'#ffd24a', p:'#ff9ec2'},
      ondol: {A:'#e9cb8d', a:'#ddbd77', s:'#d0aa62'},
      starry: {N:'#2b2f58', n:'#343a68', s:'#eaeeff', y:'#fff0b8'},
      sand: {S:'#efdcae', d:'#d8bd88', h:'#f7ecd2', c:'#ef9aa8'},
      tatami: {T:'#d2d8a0', t:'#c1c887', b:'#8a945a'},
      brickpath: {B:'#c07a56', H:'#d59a75', S:'#8a4f37', M:'#ddd0bd'},
      brickwall: {B:'#cf8a63', H:'#e7ab84', S:'#95533a', M:'#efe4d3'}
    };
    const POND_PAL = {K:'#9aa1ab', k:'#7c828d', H:'#c3c9d1', W:'#c9ebf7', m:'#93d3ee', w:'#5cabd6', r:'#e0f4fc', S:'#ffffff', P:'#63b25f', p:'#4a9247', F:'#ff9ec2', Y:'#ffe14a', O:'#ff8a3d', o:'#e0662a', X:'#ffffff', t:'#ff8a3d'};
    const FURN_PALS={ pond:POND_PAL, cushion:{X:'#4a5361',C:'#9aa4b2',D:'#79838f',L:'#c2cad4',B:'#5b6470'}, bowl:{X:'#4a5361',W:'#d0d6dd',L:'#eef1f5',D:'#aab2bc',F:'#d68b4a',f:'#b06a2e',g:'#efb37a'}, waterbowl:{X:'#4a5361',W:'#d0d6dd',L:'#eef1f5',D:'#aab2bc',A:'#5aa9e6',a:'#3f86c4',h:'#bfe2fb'}, tower:{X:'#5e3f22',P:'#8a6a3f',H:'#a5824f',W:'#c99a5f',C:'#a87c46',L:'#e6c085',R:'#e0bd82',S:'#c39a5c',T:'#d9694e',O:'#f2a98f',K:'#4a3218'}, scratcher:{X:'#5e3f22',W:'#c99a5f',C:'#a87c46',L:'#e6c085',S:'#d8b98a',R:'#b8935f',T:'#6b4a2a',O:'#d9694e',H:'#f2a98f'}, litterbox:{B:'#5b9bd8',b:'#3f79b5',e:'#8fc2ec',W:'#f5f8fc',w:'#d3e3f4'}, pethouse:{X:'#5a4632',R:'#d9694e',r:'#b8503a',H:'#f0967a',W:'#e8c98f',w:'#d4b06a',D:'#2c2420',d:'#46382c'}, plant:{X:'#7c5028',L:'#7cc652',G:'#4e9636',P:'#c8763e',p:'#a85e2c',l:'#9ad86a',S:'#6f9440'}, catwheel:{X:'#2f6f68',W:'#4fb3a6',H:'#8fe0d4',T:'#245c55',R:'#c9a06a',D:'#6b5842'}, rug:{F:'#efe3cf',X:'#5e2028',o:'#8a3a44',B:'#c0505e',C:'#a5424e',L:'#e6b3a0',G:'#e6b24a',g:'#b9862f',N:'#3a2436'}, window:{X:'#6b4a2a',W:'#9a734a',w:'#b58d5e',S:'#bfe3f5',C:'#ffffff',U:'#ffd968',u:'#f2b93c'}, fishtank:{X:'#5b7b86',G:'#bfe6ef',A:'#5aa9e6',a:'#3f86c4',P:'#4e9636',p:'#7cc652',F:'#f2933c',f:'#ffd27a',b:'#dff3ff',R:'#cdb98c',D:'#3a5a63'}, fireplace:{X:'#4a3626',W:'#7a5230',w:'#9c6f3f',K:'#b0563f',k:'#c8785a',D:'#241a13',f:'#ffd54a',F:'#f2913c',r:'#e05230',S:'#9298a2',s:'#767c86'}, fan:{X:'#3f5a63',G:'#cfe6ee',L:'#eef7fb',D:'#a7cdda',h:'#e0b84a',N:'#7a828c',S:'#9298a2',s:'#6f747c'}, hammock:{X:'#5a4632',W:'#7a5a3a',w:'#9c6f3f',K:'#b7a78f',C:'#3c7d6d',c:'#2f6357',L:'#5bb39d',P:'#e8c98f',p:'#cba765'}, teaser:{R:'#6b7280',K:'#b0b6bd',F:'#e2607a',f:'#f2a7b8',T:'#c94a66',S:'#7a5230',s:'#9c6f3f'}, wallclock:{X:'#3a2e22',W:'#8a5a34',w:'#a8763f',L:'#f2e6c8',D:'#2a221a',K:'#6b5a3a',O:'#e0b84a'}, hangplant:{X:'#5a4632',K:'#b7a78f',P:'#c8763e',p:'#a85e2c',G:'#4e9636',L:'#7cc652',l:'#9ad86a',g:'#3f7a2c'}, mobile:{X:'#5a4632',K:'#b7a78f',M:'#7a5a3a',A:'#f2c84b',a:'#d6a832',B:'#8fb8e6',b:'#6f97c4',C:'#f2a7b8',c:'#d98098'}, jingleball:{X:'#8a3a2c',B:'#e0552f',b:'#b8452a',L:'#f2a06a',D:'#7a2f22',S:'#ffd24a'}, frame:{X:'#4a3626',W:'#caa23a',w:'#e6c96b',S:'#bfe3f5',U:'#ffd968',c:'#ffffff',G:'#5aa860',g:'#3f7a48',t:'#7a5230',T:'#4e9636'}, shelf:{W:'#9a734a',w:'#6b4a2a',K:'#5a5f68',G:'#4e9636',L:'#7cc652',P:'#c8763e',p:'#a85e2c',B:'#d9694e',r:'#f0967a',o:'#b8503a',C:'#8fb8e6',c:'#bfe3f5'}, mirror:{X:'#8a6a1e',W:'#e6c96b',w:'#b98f2f',H:'#fff0b8',A:'#9fbccb',a:'#7fa2b4',b:'#cfe4ee',h:'#ffffff',o:'#f2d878'}, neon:{g:'#c0387f',N:'#ff2f8f',H:'#ff9ecf',C:'#ffffff',S:'#ffe6f4'}, sconce:{K:'#5a5f68',k:'#8a909a',H:'#b6bcc6',F:'#ff8a2e',Y:'#ffd23e',y:'#fff2a8'}, chandelier:{K:'#6b5220',f:'#7c5f28',F:'#c49b45',H:'#f6dd94',Y:'#ffd35e',y:'#ff9e3d',W:'#fff6df',C:'#e3f2fb',c:'#a9cfe4',o:'#ffffff'}, garland:{K:'#6b5a3a',A:'#e0552f',B:'#ffd54a',C:'#4e9636',a:'#b8452a',b:'#caa23a',c:'#3f7a2c',h:'#ffffff'}, poster:{X:'#3a2e22',S:'#bfe3f5',U:'#ffd968',M:'#5a7d8a',P:'#efe3cf',d:'#c94a66'}, tapestry:{K:'#7a5230',w:'#9c6f3f',C:'#7a4a8a',D:'#a86fc0',o:'#e0a43c',O:'#ffd968',f:'#c9a06a'} };
    const POOP_PAL={X:'#4a3218',K:'#7a5230'};
    const FOOD_PAL={F:'#d68b4a',D:'#8a5427',L:'#f2e4c6',K:'#7a4a20'};
    const WATER_PAL={A:'#5aa9e6',D:'#3f86c4',H:'#c7e6ff',L:'#eaf6ff'};
    // ---- 펫알/랜덤박스 도트 ----
    // 알: 위는 둥근 돔(꼭대기 좁게), 아래가 넓고 둥글게. 테두리는 바깥이 진한 X(#968c76), 그 안쪽에 연한 S 링 → 외곽선이 또렷·진하게(전체 통일). 중앙에 크고 두꺼운 무지개(R→P) 물음표. S=안쪽 연한 링·우측 그림자.
    // 🥚 펫알(24×28) — 뜰알과 같은 해상도·톤의 크림색 계란: 4톤 구면 명암(I 하이라이트·W 기본·S 음영·D 깊은음영)+X외곽,
    //   가운데 무지개 물음표(Q=RAINBOW/무지개알은 흰색), 잔점(k) 몇 개. 균열1~3(C1·C2·C3)은 같은 실루엣에 금이 번지고 마지막에 쩍 갈라진다.
    const M_EGG = [
      "........XXXXXXXX........",
      ".......XIIIIIIIIX.......",
      "......XIIIIIIIIIIX......",
      ".....XIIIIIIIIIIWWX.....",
      "....XIIIIIIIIIIIWWWX....",
      "...XIIIIIIIIIIIWWWWWX...",
      "...XIIIIIIIIIIWWWWWWX...",
      "..XIIIIIIIQQQQQWWWWSSX..",
      "..XIIIIIIQQQQQQQWWSSSX..",
      "..XIIIIIQQQWWQQQWSSSSX..",
      "..XIIIIIQQWWWQQQSSSSSX..",
      ".XIIIIIIIWWWWQQQSSSSSSX.",
      ".XIIIIIIWWWWQQQSSSSSSDX.",
      ".XIIIIIIWWWQQQSSkSSSDDX.",
      ".XIIIIIWWWWQQSSSSSSDDDX.",
      ".XIIIIWWWWWQQSSSSSDDDDX.",
      ".XIIIWkWWWWSSSSSSDDDDDX.",
      "..XIWWWWWWSQQSSSDDDDDX..",
      "..XWWWWWWSSQQSSSDDDDDX..",
      "...XWWWWSSSSSSSDDDDDX...",
      "....XWWSkSSSSSDDDDDX....",
      ".....XXSSSSSSDDDDXX.....",
      ".......XXXXXXXXXX.......",
      "........................"
    ];
    // 균열1: 위쪽부터 지그재그 잔금(X)이 생기고 옆에 그림자(S)가 져 쩌저적 갈라짐 시작
    const M_EGG_C1 = [
      "........XXXXXXXX........",
      ".......XIIIIIIIIX.......",
      "......XIIIIXSIIIIX......",
      ".....XIIIIIXSIIIWWX.....",
      "....XIIIIIIIIXSXWWWX....",
      "...XIIIIIIIIIXSWWWWWX...",
      "...XIIIIIIIIXSWWWWWWX...",
      "..XIIIIIIIQQQQXSWWWSSX..",
      "..XIIIIIIQQXQXQQWWSSSX..",
      "..XIIIIIQQQXSQQQWSSSSX..",
      "..XIIIIIQQWWXQQQSSSSSX..",
      ".XIIIIIIIWWWWXQQSSSSSSX.",
      ".XIIIIIIWWWWQQXSXSSSSDX.",
      ".XIIIIIIWWWQQQSSkSSSDDX.",
      ".XIIIIIWWWWQQSSSSSSDDDX.",
      ".XIIIIWWWWWQQSSSSSDDDDX.",
      ".XIIIWkWWWWSSSSSSDDDDDX.",
      "..XIWWWWWWSQQSSSDDDDDX..",
      "..XWWWWWWSSQQSSSDDDDDX..",
      "...XWWWWSSSSSSSDDDDDX...",
      "....XWWSkSSSSSDDDDDX....",
      ".....XXSSSSSSDDDDXX.....",
      ".......XXXXXXXXXX.......",
      "........................"
    ];
    // 균열2: 금이 전체로 번지고 위쪽이 살짝 벌어져(틈'.'+따뜻한 빛 L) 틈이 보인다. 물음표도 갈라지기 시작.
    const M_EGG_C2 = [
      "........XXXXXXXX........",
      ".......XIIIIIIIIX.......",
      "......XIIIL.SIIIIX......",
      ".....XIIIIL.SIIIWWX.....",
      "....XIIIIIIIL.SIWWWX....",
      "...XIIIIIIIIL.SWWWWWX...",
      "...XIIIIIIIL.SWWWWWWX...",
      "..XIIIIIIIQQQL.SWWWSSX..",
      "..XIIIIIIQQQL.QQWWSSSX..",
      "..XIIIIIQQL.SQQQWSSSSX..",
      "..XIIIIIQQWWXQQQSSSSSX..",
      ".XIIIIIIIWWWWXQQSSSSSSX.",
      ".XIIIIIIWWWWQQXSSSSSSDX.",
      ".XIIIIIIWWWQQXSSkSSSDDX.",
      ".XIIIIIWWWWQXSSSSSSDDDX.",
      ".XIIIIWWWWWXQSSSSSDDDDX.",
      ".XIIIWkWWWWXSSSSSDDDDDX.",
      "..XIWWWWWWSQXSSSDDDDDX..",
      "..XWWWWWWSSQQXSSDDDDDX..",
      "...XWWWWSSSSSXSDDDDDX...",
      "....XWWSkSSSXSDDDDDX....",
      ".....XXSSSSSSDDDDXX.....",
      ".......XXXXXXXXXX.......",
      "........................"
    ];
    // 균열3(3번째 탭): 알이 정중앙에서 쩍! 크게 갈라져 좌우 껍질로 나뉘고, 벌어진 틈(L)으로 등급색 빛이 쏟아진다. L=빛(렌더 시 등급색).
    const M_EGG_C3 = [
      "........XXXLLXXX........",
      ".......XIIXLLXIIX.......",
      "......XIIXLLLXIIIX......",
      ".....XIIXLLLLLXIWWX.....",
      "....XIIIIXLLLLLXWWWX....",
      "...XIIIIIXLLLLLXWWWWX...",
      "...XIIIIXLLLLLLXWWWWX...",
      "..XIIIIIIXLLLLLLXWWSSX..",
      "..XIIIIIXLLLLLLLXWSSSX..",
      "..XIIIIXLLLLLLLXWSSSSX..",
      "..XIIIIXLLLLLLLLXSSSSX..",
      ".XIIIIIXLLLLLLLLLXSSSSX.",
      ".XIIIIIIXLLLLLLLLXSSSDX.",
      ".XIIIIIXLLLLLLLLLXSSDDX.",
      ".XIIIIIXLLLLLLLLXSSDDDX.",
      ".XIIIIXLLLLLLLLLXSDDDDX.",
      ".XIIIWXLLLLLLLLLXDDDDDX.",
      "..XIWWWXLLLLLLLLXDDDDX..",
      "..XWWWWWXLLLLLLLLXDDDX..",
      "...XWWWWXLLLLLLLXDDDX...",
      "....XWWXLLLLLLLLXDDX....",
      ".....XXSXLLLLLLXDXX.....",
      ".......XXLLLLLLXX.......",
      "........................"
    ];
    // 🥚 깨진 껍질 조각(픽셀아트) — 크림 껍질(I 하이라이트·W 기본·S 음영)+X 테두리. 오픈 순간 사방으로 튕겨나감(알과 같은 톤).
    const M_SHELL_A = [ ".IIXX.","IIWWXX","XIWWSX","XWWSSX",".XWSX.","..XX.." ];
    const M_SHELL_B = [ "IIXX.","IWWXX","XWWSX","XWSSX",".XXX." ];
    const M_SHELL_C = [ "IXX.","IWSX","XWSX",".XX." ];
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
    // 📦 랜덤박스(24×22) — 뜰알·펫알과 같은 해상도의 파스텔 보물상자: 돔형 뚜껑(C 하이라이트·c 음영)+금색 띠·장식(m/M 밝은금·n 어두운금),
    //   4톤 몸체 명암(W 기본·S 음영·D 깊은음영)+X외곽, 앞면 중앙 무지개 물음표(Q=RAINBOW/무지개박스는 흰색), 자물쇠.
    const M_BOX = [
      "........................",
      "........................",
      "........................",
      "......XCCCCCCccccX......",
      "....XCCCCCCCCCcccccX....",
      "...CCCCCCCCCCCCcccccc...",
      "..XCCCCCCCCCCCCCcccccX..",
      "..CCCCCCCCCCnCCCCccccc..",
      ".XmmmmmmmmmmmmmmmmmmmmX.",
      "..XmmmmmmmMMMmmmmmmmmX..",
      "..XMWWWWWWWnWWWWSSSSMX..",
      "..XmWWWWWWWWWWWSSSSSnX..",
      "..XMWWWWWWQQQQSSSSSSnX..",
      "..XmWWWWWQQSSQQSSSSSnX..",
      "..XMWWWWWWWSQQSSSSSSnX..",
      "..XmWWWWWWSQQSSSSSSSnX..",
      "..XMWWWWWSSQQSSSSSSSnX..",
      "..XmWWWWSSSSSSSSSSSDnX..",
      "..XMWWWSSSSQQSSSSDDDnX..",
      "..XMWWSSSSSSSSSSDDDDMX..",
      "..XXXXXXXXXXXXXXXXXXXX..",
      "........................"
    ];
    // 열린 랜덤박스(오픈 연출): 뚜껑이 위로 튕겨오르고 열린 틈으로 등급색 픽셀 빛(Z)이 쏟아진다. Z=빛(렌더 시 등급색).
    const M_BOX_OPEN = [
      "........................",
      ".....CCCCCCCccccccccc...",
      "....CCCCCCCCcccccccccc..",
      "......ZZZZZZZZZZZZ......",
      ".....ZZZZZZZZZZZZZZ.....",
      ".....ZZZZZZZZZZZZZZ.....",
      "....ZZZZZZZZZZZZZZZZ....",
      "....ZZZZZZZZZZZZZZZZ....",
      "...ZZZZZZZZZZZZZZZZZZ...",
      "..XZZZZZZZZZZZZZZZZZZX..",
      "..XMWWWWWWWnWWWWSSSSMX..",
      "..XmWWWWWWWWWWWSSSSSnX..",
      "..XMWWWWWWQQQQSSSSSSnX..",
      "..XmWWWWWQQSSQQSSSSSnX..",
      "..XMWWWWWWWSQQSSSSSSnX..",
      "..XmWWWWWWSQQSSSSSSSnX..",
      "..XMWWWWWSSQQSSSSSSSnX..",
      "..XmWWWWSSSSSSSSSSSDnX..",
      "..XMWWWSSSSQQSSSSDDDnX..",
      "..XMWWSSSSSSSSSSDDDDMX..",
      "..XXXXXXXXXXXXXXXXXXXX..",
      "........................"
    ];
    // 펫알(크림): 4톤 명암 I·W·S·D + k 잔점, X 외곽. Q=무지개 물음표. L=균열 틈새 빛(C2=따뜻한 흰빛 기본, 오픈 때 eggCrackSvg가 등급색으로 덮음).
    const EGG_PAL={X:'#8d8368',I:'#fffef8',W:'#f7f3ea',S:'#e6dfce',D:'#d3cbb6',k:'#ddd6c4',Q:'RAINBOW',L:'#fff3c8'};
    // 랜덤박스(파스텔+금장): 돔뚜껑 C/c, 몸체 W·S·D, 금장 m/M/n, X 외곽. Q=무지개 물음표. Z=오픈 빛(등급색으로 덮임).
    const BOX_PAL={X:'#6f7688',C:'#eef1f7',c:'#d0d7e4',W:'#dbe1ec',S:'#bcc4d4',D:'#9aa5b9',m:'#f4dd8f',M:'#f8ecc0',n:'#b48a2f',Q:'RAINBOW',Z:'#fff3c8'};
    // 무지개알/무지개박스: 껍질·몸체·뚜껑을 통째로 RAINBOW(움직이는 세로 무지개), 물음표(Q)는 흰색 대비, 금장(m/M/n)은 유지, 외곽(X)은 중립.
    const EGG_PAL_RB={X:'#8d8368',I:'RAINBOW',W:'RAINBOW',S:'RAINBOW',D:'RAINBOW',k:'RAINBOW',Q:'#FBFBFD',L:'#FBFBFD'};
    const BOX_PAL_RB={X:'#6f7688',C:'RAINBOW',c:'RAINBOW',W:'RAINBOW',S:'RAINBOW',D:'RAINBOW',m:'#f4dd8f',M:'#f8ecc0',n:'#b48a2f',Q:'#FBFBFD',Z:'#FBFBFD'};

    // 카탈로그(코드 상수) — 저장은 보유 id만. id는 종·색 구분(예: cat_calico, dog_corgi), species는 분류/필터용.
    // 새 동물(네발 짐승) 처리 규칙은 docs/pet-asset-pipeline.md 참고.
    // 가격(은화)은 등급·확률에 맞춰 재산정 — 등급이 오를수록 대략 2배씩(TIER_PRICE 참고).
    // 알(펫알) 100은화로 열면 금화+1·중복은 그 펫 가격의 20% 환급이라, 흔한 등급은 알보다 싸게·희귀는 알보다 비싸게 잡아
    // "직접 구매 vs 뽑기" 선택지가 성립하도록 함. 가격은 CAT_TIER→TIER_PRICE로 산정(normalizePrices).
    // @gen:pet-catalog — 자동생성(tools/build_pets.py). 직접 수정 말고 tools/pets.json 편집 후 재실행.
    const PET_CATALOG = [
      { id:'cat_mackerel', species:'cat', name:'고등어', price:50, desc:'쿨그레이 줄무늬. 차분하게 방을 돌아다녀요.' },
      { id:'cat_cheese', species:'cat', name:'뒤뚱', price:50, desc:'웜오렌지. 활발하게 뛰어다니는 개냥이.' },
      { id:'cat_calico', species:'cat', name:'길냥', price:50, desc:'검정·주황 어우러진 삼색(토터셸). 도도하게 창가에 앉아요.' },
      { id:'cat_black', species:'cat', name:'네로', price:50, desc:'노란 눈의 까만 고양이. 조용히 방을 지켜요.' },
      { id:'cat_white', species:'cat', name:'하양', price:50, desc:'파란 눈의 새하얀 고양이. 볕에서 낮잠을 즐겨요.' },
      { id:'cat_fluffy', species:'cat', name:'복슬이', price:50, desc:'복슬복슬한 털에 파란 눈. 나른하게 졸며 방을 거닐어요.' },
      { id:'cat_tuxedo', species:'cat', name:'검정얼룩이', price:50, desc:'검은 정장에 하얀 셔츠·발. 단정하게 걸어다녀요.' },
      { id:'cat_chaos', species:'cat', name:'골목대장', price:50, desc:'다크그레이+브라운 소용돌이 무늬. 종잡을 수 없이 쏘다녀요.' },
      { id:'cat_siamese', species:'cat', name:'삼삼이', price:100, desc:'크림빛 몸에 짙은 포인트. 우아하게 방을 누벼요.' },
      { id:'cat_bengal', species:'cat', name:'황토', price:50, desc:'골든빛 몸에 동글동글 반점. 야무지게 돌아다녀요.' },
      { id:'cat_fold', species:'cat', name:'폴드', price:50, desc:'접힌 귀가 매력. 얌전히 자리를 지켜요.' },
      { id:'cat_bora', species:'cat', name:'보라', price:400, desc:'한쪽은 파랑·한쪽은 호박색 오드아이. 신비롭게 거닐어요.' },
      { id:'cat_choco', species:'cat', name:'초코', price:50, desc:'초콜릿빛 갈색 털에 크림색 입가·가슴. 느긋하게 방을 거닐어요.' },
      { id:'cat_kitten', species:'cat', name:'아깽이', price:50, desc:'치즈빛 오렌지 태비 아기고양이. 뒤뚱뒤뚱 방을 쏘다녀요.' },
      { id:'cat_pink', species:'cat', name:'핑크', price:400, desc:'털 없는 분홍빛 주름 피부. 도도하게 방을 누벼요.' },
      { id:'tiger_orange', species:'tiger', name:'고랑이', price:1500, desc:'볼드한 검은 줄무늬의 오렌지 호랑이. 위풍당당하게 방을 누벼요.' },
      { id:'lion_mane', species:'lion', name:'갈기냥', price:1500, desc:'풍성한 갈기의 황금빛 사자. 위풍당당하게 방을 거닐어요.' },
      { id:'cat_persian', species:'cat', name:'페르시안(흰색)', price:800, desc:'납작한 얼굴에 복슬복슬 긴 털. 우아하게 방을 누벼요.' },
      { id:'tiger_white', species:'tiger', name:'백호', price:1500, desc:'푸른 눈의 새하얀 호랑이. 늠름하게 방을 누벼요.' },
      { id:'cat_russianblue', species:'cat', name:'블루', price:50, desc:'은청빛 짧은 털에 초록 눈. 조용히 방을 거닐어요.' },
      { id:'cat_bengal2', species:'cat', name:'얼룩이', price:100, desc:'야생미 물씬 로제트 무늬. 날렵하게 방을 쏘다녀요.' },
      { id:'dog_mutt', species:'dog', name:'시고르자브', price:200, desc:'어느 동네에나 있는 씩씩한 잡종견. 꼬리 흔들며 졸졸 따라다녀요.' },
      { id:'cat_panther', species:'cat', name:'블랙팬서', price:1500, desc:'칠흑빛 근육질의 흑표범. 소리 없이 방을 누비는 한정판 위엄.' },
      { id:'dog_baekgu', species:'dog', name:'백구', price:50, desc:'온 동네가 아는 새하얀 토종개. 사람만 보면 꼬리가 헬리콥터.' },
      { id:'dog_shiba', species:'dog', name:'시바', price:400, desc:'새침한 표정 뒤에 장난기 가득. 마음을 열면 껌딱지가 돼요.' },
      { id:'dog_corgi', species:'dog', name:'코기', price:800, desc:'짧은 다리로 통통, 복슬 엉덩이가 트레이드마크.' },
      { id:'dog_dalmatian', species:'dog', name:'달마시안', price:100, desc:'까만 점박이 무늬가 하나하나 다 달라요. 달리기라면 자신 있음.' },
      { id:'dog_dachshund', species:'dog', name:'닥스훈트', price:400, desc:'기다란 소시지 몸에 씩씩한 성격. 굴 파기 챔피언.' },
      { id:'dog_bulldog', species:'dog', name:'불독', price:50, desc:'주름진 얼굴로 뚱한 척, 사실은 애교쟁이 순둥이.' },
      { id:'dog_injeolmi', species:'dog', name:'인절미', price:800, desc:'말랑말랑 콩고물 빛 털뭉치. 안으면 떡처럼 쫀득.' },
      { id:'dog_poodle', species:'dog', name:'스탠다드푸들', price:200, desc:'우아한 곱슬머리 신사. 똑똑하기로 소문났어요.' },
      { id:'dog_beagle', species:'dog', name:'비글', price:200, desc:'코가 이끄는 대로 온 집안 탐험. 호기심 대장.' },
      { id:'dog_sukhee', species:'dog', name:'숙희', price:800, desc:'동네 골목대장 누렁이. 정 많고 의리 넘쳐요.' },
      { id:'dog_doberman', species:'dog', name:'도베르만', price:800, desc:'날렵한 근육질 경비대장. 겉은 시크, 속은 다정.' },
      { id:'dog_pug', species:'dog', name:'퍼그', price:800, desc:'찌글 주름과 똥그란 눈망울. 코고는 소리마저 사랑스러워.' },
      { id:'dog_shepherd', species:'dog', name:'저먼셰퍼드', price:800, desc:'믿음직한 명견. 한번 주인은 영원한 주인.' },
      { id:'dog_bordercollie', species:'dog', name:'보더콜리', price:400, desc:'천재 견공. 눈빛만으로 양떼도 척척.' },
      { id:'dog_spitz', species:'dog', name:'스피츠', price:50, desc:'새하얀 솜뭉치. 방긋 웃는 여우상 미소.' },
      { id:'dog_jackrussell', species:'dog', name:'잭러셀테리어', price:800, desc:'작은 몸에 에너지 폭발. 잠시도 가만 못 있어요.' },
      { id:'dog_labrador', species:'dog', name:'레브라도', price:400, desc:'물놀이라면 사족을 못 써요. 세상 다정한 리트리버.' },
      { id:'dog_chowchow', species:'dog', name:'차우차우', price:400, desc:'복슬복슬 사자 갈기에 보라색 혀. 도도한 곰인형.' },
      { id:'dog_cardigancorgi', species:'dog', name:'카디건코기', price:400, desc:'긴 꼬리 달린 코기. 짧은 다리로 총총총.' },
      { id:'dog_greyhound', species:'dog', name:'그레이하운드', price:800, desc:'바람보다 빠른 질주 본능. 쉴 땐 세상 게을러요.' },
      { id:'dog_shihtzu', species:'dog', name:'시츄', price:100, desc:'우아한 긴 털의 궁중견. 방석 위가 내 왕좌.' },
      { id:'dog_stbernard', species:'dog', name:'세인트버나드', price:400, desc:'산악 구조견의 후예. 커다란 덩치에 순한 마음.' },
      { id:'dog_bostonterrier', species:'dog', name:'보스턴테리어', price:200, desc:'턱시도 입은 신사견. 동글 눈망울이 매력.' },
      { id:'dog_bassethound', species:'dog', name:'바셋하운드', price:800, desc:'축 처진 귀와 슬픈 눈. 느긋한 산책 파트너.' },
      { id:'dog_happy', species:'dog', name:'해피', price:50, desc:'이름처럼 늘 행복 가득. 웃는 얼굴이 트레이드마크.' },
      { id:'dog_welshterrier', species:'dog', name:'웰시테리어', price:800, desc:'곱슬 갈색 털의 꼬마 신사. 용감함은 대형견급.' },
      { id:'dog_papillon', species:'dog', name:'파피용', price:100, desc:'나비 날개 같은 귀가 팔랑팔랑. 작지만 똑똑해요.' },
      { id:'dog_newfoundland', species:'dog', name:'뉴펀들랜드', price:800, desc:'물속 구조 전문 거인. 곰만 한 덩치에 천사 마음.' },
      { id:'dog_beardedcollie', species:'dog', name:'비어디드콜리', price:800, desc:'수염 난 장발 목양견. 바람에 휘날리는 털결.' },
      { id:'dog_afghanhound', species:'dog', name:'보더콜리', price:800, desc:'실크 같은 긴 털을 휘날리는 귀족. 우아함 그 자체.' },
      { id:'dog_rottweiler', species:'dog', name:'로트와일러', price:400, desc:'든든한 경비견. 무뚝뚝해 보여도 가족 바보.' },
      { id:'dog_pointer', species:'dog', name:'포인터', price:400, desc:'사냥감을 코로 가리키는 명사수. 늘씬한 근육질.' },
      { id:'dog_pharaohhound', species:'dog', name:'파라오하운드', price:800, desc:'고대 벽화에서 걸어 나온 듯한 우아한 사냥개.' },
      { id:'dog_westie', species:'dog', name:'웨스트하이랜더테리어', price:50, desc:'새하얀 털뭉치 꼬마. 당당한 걸음걸이가 매력.' },
      { id:'dog_weimaraner', species:'dog', name:'바이마라너', price:400, desc:'은빛 회색 털에 호수빛 눈동자. 우아한 사냥개.' },
      { id:'dog_collie', species:'dog', name:'콜리', price:400, desc:'영리한 목양견. 부드러운 갈기가 바람에 살랑.' },
      { id:'dog_englishbulldog', species:'dog', name:'잉글리시불독', price:400, desc:'묵직한 주름 신사. 느긋함이 몸에 뱄어요.' },
      { id:'dog_keeshond', species:'dog', name:'키스혼드', price:800, desc:'복슬복슬 회색 솜사자. 웃는 여우상 표정.' },
      { id:'dog_frenchbulldog', species:'dog', name:'프렌치불독', price:400, desc:'박쥐 귀에 납작 얼굴. 코믹한 표정의 애교쟁이.' },
      { id:'dog_yorkshire', species:'dog', name:'요크셔테리어', price:100, desc:'비단결 털의 작은 요정. 도도함은 대형견 못지않아요.' },
      { id:'dog_toypoodle', species:'dog', name:'토이푸들', price:100, desc:'동글동글 곱슬 인형. 어딜 가나 시선 강탈.' },
      { id:'dog_sheltie', species:'dog', name:'셰틀랜드십독', price:200, desc:'미니 콜리. 영리하고 재빠른 꼬마 목동.' },
      { id:'dog_minpin', species:'dog', name:'미니어처핀셔', price:400, desc:'작지만 당당한 꼬마 대장. 총총 걷는 발걸음이 야무져요.' },
      { id:'dog_schnauzer', species:'dog', name:'슈나우저', price:400, desc:'멋진 콧수염 신사. 눈썹까지 완벽한 스타일.' },
      { id:'dog_goldendoodle', species:'dog', name:'골든두들', price:100, desc:'곱슬 황금빛 인형. 안으면 구름처럼 폭신.' },
      { id:'dog_bernese', species:'dog', name:'버니즈마운틴독', price:800, desc:'삼색 털의 산악 거인. 든든하고 다정한 대형견.' },
      { id:'dog_cavalier', species:'dog', name:'캐벌리어스파니엘', price:200, desc:'물결치는 귀와 그렁한 눈. 무릎 위가 명당.' },
      { id:'dog_akita', species:'dog', name:'아키타', price:800, desc:'충직함의 상징. 곰 같은 얼굴에 의리 가득.' },
      { id:'dog_whippet', species:'dog', name:'휘핏', price:800, desc:'날씬한 스프린터. 달릴 땐 총알, 쉴 땐 이불속.' },
      { id:'dog_oldenglishsheepdog', species:'dog', name:'올드잉글리시쉽독', price:400, desc:'눈을 덮은 장발 목양견. 걸어다니는 복슬 대걸레.' },
      { id:'dog_vizsla', species:'dog', name:'비즐라', price:400, desc:'황금빛 구릿빛 사냥개. 늘 주인 곁에 껌딱지.' },
      { id:'dog_englishsetter', species:'dog', name:'잉글리시셰터', price:800, desc:'우아한 물결무늬 털. 들판을 누비는 사냥 명견.' },
      { id:'dog_jindo', species:'dog', name:'진돗개', price:1500, desc:'충직한 토종 명견. 한번 정한 주인은 끝까지.' },
      { id:'dog_chinesecrested', species:'dog', name:'차이니즈크레스티드', price:400, desc:'머리와 발끝에만 깃털 장식. 독특한 멋쟁이.' },
      { id:'dog_scottie', species:'dog', name:'스코티시테리어', price:400, desc:'까만 수염 신사. 짧은 다리로 당당하게 총총.' },
      { id:'dog_pomeranian', species:'dog', name:'포메라니안', price:50, desc:'폭신 솜뭉치 여우. 방긋 미소가 심쿵 포인트.' },
      { id:'dog_sharpei', species:'dog', name:'샤페이', price:400, desc:'주름 가득 접힌 얼굴. 진지한 표정의 순둥이.' },
      { id:'dog_greatdane', species:'dog', name:'그레이트데인', price:800, desc:'우아한 거인. 세상 점잖은 대형견 신사.' },
      { id:'dog_bullterrier', species:'dog', name:'불테리어', price:800, desc:'달걀형 얼굴에 개구쟁이 성격. 근육질 장난꾸러기.' },
      { id:'dog_boxer', species:'dog', name:'복서', price:400, desc:'탄탄한 근육에 장난기 만점. 영원한 대형 강아지.' },
      { id:'dog_ridgeback', species:'dog', name:'로디지안리지백', price:400, desc:'등줄기 갈기가 트레이드마크. 늠름한 사냥꾼.' },
      { id:'dog_irishsetter', species:'dog', name:'아이리시세터', price:400, desc:'붉은 비단 털을 휘날리는 미남. 활발한 사냥개.' },
      { id:'dog_airedale', species:'dog', name:'에어데일테일러', price:800, desc:'테리어의 왕. 곱슬 갈색 털에 당당한 기품.' },
      { id:'dog_samoyed', species:'dog', name:'사모예드', price:800, desc:'새하얀 솜사탕 미소. 웃는 얼굴이 트레이드마크인 눈썰매개.' },
      { id:'dog_husky', species:'dog', name:'시베리안허스키', price:800, desc:'푸른 눈의 설원 질주자. 늑대 같은 외모에 장난꾸러기 마음.' },
      { id:'cat_mackerel2', species:'cat', name:'고등어', price:400, desc:'은빛 줄무늬가 촘촘한 국민 고양이. 날렵하고 똑똑해요.' },
      { id:'cat_calico2', species:'cat', name:'칼리코', price:400, desc:'흰·검·주황 삼색의 조화. 복스러운 얼굴의 복덩이.' },
      { id:'cat_white2', species:'cat', name:'하양', price:400, desc:'티 없이 새하얀 털. 우아하게 걷는 설공주.' },
      { id:'cat_cheese2', species:'cat', name:'치즈', price:400, desc:'노란 치즈빛 태비. 느긋하고 장난기 많은 개냥이.' },
      { id:'cat_tuxedo2', species:'cat', name:'턱시도', price:400, desc:'말끔한 흑백 턱시도 차림. 타고난 신사.' },
      { id:'cat_siamese2', species:'cat', name:'샴', price:800, desc:'크림빛 몸에 짙은 포인트. 도도한 목소리의 수다쟁이.' },
      { id:'cat_bengal3', species:'cat', name:'벵갈', price:800, desc:'야생 표범 무늬의 근육질. 물놀이를 좋아하는 활동파.' },
      { id:'cat_russianblue2', species:'cat', name:'러시안블루', price:400, desc:'은빛 도는 청회색 털에 에메랄드 눈동자. 조용한 귀족.' },
      { id:'cat_scottishfold', species:'cat', name:'스코티시폴드', price:400, desc:'접힌 귀와 동그란 얼굴. 부엉이 닮은 애교쟁이.' },
      { id:'cat_black2', species:'cat', name:'까망', price:400, desc:'칠흑빛 윤기나는 털. 밤을 닮은 신비로운 매력.' },
      { id:'cat_seolleong', species:'cat', name:'설렁', price:100, desc:'느긋하고 순한 우리집 순둥이. 늘 곁에 붙어 있어요.' },
      { id:'cat_persiangray', species:'cat', name:'페르시안(회색)', price:400, desc:'복슬복슬 회색 장모. 납작한 얼굴의 우아한 공주.' },
      { id:'cat_mainecoon', species:'cat', name:'메인쿤(갈색태비)', price:800, desc:'거대한 몸집의 온순한 거인. 고양이계의 대형견.' },
      { id:'cat_americanshorthair', species:'cat', name:'아메리칸숏헤어(실버태비)', price:400, desc:'은빛 태비의 건강미. 튼튼하고 붙임성 좋아요.' },
      { id:'cat_ragdoll', species:'cat', name:'랙돌(포인트)', price:800, desc:'안으면 인형처럼 축 늘어지는 순둥이. 파란 눈이 매력.' },
      { id:'cat_turkishangora', species:'cat', name:'터키시앙고라(흰색)', price:400, desc:'비단결 흰 장모. 우아하게 흐르는 실크 털.' },
      { id:'cat_munchkin', species:'cat', name:'먼치킨(삼색)', price:400, desc:'짧은 다리로 종종종. 삼색 털의 귀염둥이.' },
      { id:'cat_norwegian', species:'cat', name:'노르웨이숲(갈색)', price:400, desc:'북유럽 숲의 야성미. 풍성한 갈색 털의 산고양이.' },
      { id:'cat_bombay', species:'cat', name:'봄베이(검정)', price:400, desc:'미니 흑표범. 구릿빛 눈동자가 빛나는 검은 매력.' },
      { id:'cat_abyssinian', species:'cat', name:'아비시니안(갈색)', price:400, desc:'고대 벽화 속 우아함. 티키태비 갈색 털의 활동가.' },
      { id:'cat_sphynx', species:'cat', name:'스핑크스(핑크)', price:800, desc:'털 없는 분홍 피부. 따뜻하고 애교 넘치는 외계 미묘.' },
      { id:'cat_british', species:'cat', name:'브리티시숏헤어(그레이)', price:400, desc:'포동포동 회색 곰인형. 진중한 표정의 순둥이.' },
      { id:'cat_bengalsnow', species:'cat', name:'벵갈(스노우)', price:800, desc:'설원빛 로제트 무늬. 얼음처럼 시린 파란 눈.' },
      { id:'cat_longhaircalico', species:'cat', name:'장모 삼색', price:100, desc:'풍성한 삼색 장모. 복스럽고 우아한 자태.' },
      { id:'cat_tortie', species:'cat', name:'토터셸(카오스)', price:400, desc:'검·주황이 뒤섞인 거북등무늬. 개성 만점 카오스.' },
      { id:'cat_siamesechoco', species:'cat', name:'샴(초콜릿포인트)', price:400, desc:'초콜릿빛 포인트의 샴. 달콤한 색감의 수다쟁이.' },
      { id:'cat_cornishrex', species:'cat', name:'코니시렉스', price:400, desc:'물결치는 곱슬 단모. 날렵한 몸매의 장난꾸러기.' },
      { id:'cat_ocicat', species:'cat', name:'오시캣', price:800, desc:'야생 오실롯 닮은 점박이. 집냥이 속 작은 야생.' },
      { id:'cat_selkirkrex', species:'cat', name:'셀커크렉스', price:400, desc:'복슬복슬 곱슬털 양. 포근한 곰인형 감촉.' },
      { id:'cat_korat', species:'cat', name:'코랫', price:400, desc:'은빛 청회색의 행운 고양이. 하트형 얼굴이 매력.' },
      { id:'cat_manx', species:'cat', name:'맹크스', price:400, desc:'꼬리 없는 동글 엉덩이. 토끼처럼 통통 뛰어요.' },
      { id:'cat_americancurl', species:'cat', name:'아메리칸컬', price:200, desc:'뒤로 말린 귀가 트레이드마크. 호기심 많은 개구쟁이.' },
      { id:'cat_devonrex', species:'cat', name:'데본렉스', price:400, desc:'요정 귀에 곱슬털. 장난기 가득한 꼬마 도깨비.' },
      { id:'cat_turkishvan', species:'cat', name:'터키시반(반무늬)', price:400, desc:'머리·꼬리에만 색이 든 반무늬. 물을 좋아하는 수영선수.' },
      { id:'cat_bobtail', species:'cat', name:'밥테일', price:400, desc:'짧은 방울 꼬리. 씩씩하고 영리한 복고양이.' },
      { id:'cat_burmese', species:'cat', name:'버미즈', price:400, desc:'반질반질 갈색 털에 금빛 눈. 다정한 껌딱지.' },
      { id:'cat_himalayan', species:'cat', name:'히말라얀', price:400, desc:'페르시안 몸에 샴 포인트. 복슬복슬 파란 눈의 공주.' },
      { id:'cat_creamtabby', species:'cat', name:'크림태비', price:200, desc:'은은한 크림빛 줄무늬. 부드럽고 온순한 매력.' },
      { id:'cat_lilac', species:'cat', name:'라일락', price:400, desc:'연보라빛 도는 회색 털. 몽환적인 파스텔 미묘.' },
      { id:'cat_somali', species:'cat', name:'소말리', price:800, desc:'풍성한 여우꼬리 장모. 붉은 노을빛의 아비시니안.' },
      { id:'cat_leopardcat', species:'cat', name:'삵', price:50, desc:'한반도 산야를 누비는 토종 들고양이. 야생의 기품.' },
      { id:'cat_lynx', species:'cat', name:'시라소니', price:50, desc:'귀 끝 붓털의 산속 사냥꾼. 눈밭을 소리 없이 누벼요.' },
      { id:'cat_cheetah', species:'cat', name:'치타', price:50, desc:'지상 최속의 스프린터. 눈물자국 선명한 초원의 질주자.' },
      { id:'cat_jaguar', species:'cat', name:'재규어', price:50, desc:'정글의 제왕. 강력한 턱과 황금빛 로제트 무늬.' },
      { id:'cat_puma', species:'cat', name:'퓨마', price:50, desc:'아메리카 산악의 은둔 사냥꾼. 유연한 근육의 대형 고양이.' },
      { id:'cat_snowleopard', species:'cat', name:'눈표범', price:50, desc:'히말라야 설산의 유령. 두꺼운 털과 긴 꼬리의 은빛 표범.' },
      { id:'cat_caracal', species:'cat', name:'카라칼', price:50, desc:'긴 붓귀의 사막 점프왕. 새도 뛰어올라 낚아채요.' },
      { id:'cat_leopard', species:'cat', name:'표범', price:50, desc:'나무 위의 은밀한 사냥꾼. 우아한 로제트 무늬.' },
      { id:'cat_blackpanther', species:'cat', name:'흑표범', price:50, desc:'칠흑빛 멜라닌 표범. 어둠 속을 소리 없이 활보.' },
      { id:'cat_ocelot', species:'cat', name:'오셀롯', price:50, desc:'보석 같은 반점의 밤의 사냥꾼. 작지만 강인한 야생.' },
      { id:'cat_sandcat', species:'cat', name:'모래고양이', price:400, desc:'사막의 작은 요정. 큰 귀로 모래 밑 소리도 들어요.' },
      { id:'cat_mainecoonsmoke', species:'cat', name:'메인쿤(블랙스모크)', price:800, desc:'은빛 스모크가 감도는 거대 장모. 온순한 숲의 거인.' },
      { id:'cat_mainecoonred', species:'cat', name:'메인쿤(레드태비)', price:400, desc:'붉은 태비의 풍성한 장모. 다정한 대형 고양이.' },
      { id:'cat_bengalsilver', species:'cat', name:'벵갈(실버)', price:400, desc:'은빛 바탕에 검은 로제트. 차가운 야생미의 표범 무늬.' },
      { id:'cat_peterbald', species:'cat', name:'피더볼드', price:800, desc:'털 없는 매끈한 피부의 우아한 묘. 따뜻한 온기의 애교쟁이.' },
      { id:'cat_toyger', species:'cat', name:'토이거', price:1500, desc:'미니 호랑이를 닮은 줄무늬. 집 안의 작은 맹수.' },
      { id:'cat_singapura', species:'cat', name:'싱가푸라', price:400, desc:'세상에서 가장 작은 품종. 큰 눈망울의 요정 고양이.' },
      { id:'cat_havanabrown', species:'cat', name:'하바나브라운', price:400, desc:'초콜릿빛 윤기나는 갈색 털에 초록 눈. 다정한 껌딱지.' },
      { id:'cat_ragamuffin', species:'cat', name:'라가머핀', price:800, desc:'안으면 축 늘어지는 복슬 장모. 순둥순둥 인형 고양이.' }
    ];
    // @gen:end
    // 종(species) → 알뜰샵 분류 라벨. 품종(샴·벵갈 등)은 표시하지 않고 종만 노출.
    const SPECIES_LABEL = { cat:'고양이', dog:'강아지', rabbit:'토끼', tiger:'호랑이', lion:'사자' };
    function speciesLabel(id){ const c=PET_CATALOG.find(x=>x.id===id); return (c&&SPECIES_LABEL[c.species])||'펫'; }
    // 구 id(고양이 전용 시절) → 신 id. RTDB 보유/활성 데이터 하위호환(normalizeGame에서 적용).
    // 구 id→신 id 매핑(수동 유지, @gen 마커 밖). 런타임 펫 정적 승격 시 tools/pet_maint.mjs(apply) 가 아래 앵커 앞에 rt_xxx:'static_id' 를 자동 삽입한다.
    const PET_ID_MIGRATE = { mackerel:'cat_mackerel', cheese:'cat_cheese', calico:'cat_calico', black:'cat_black', white:'cat_white',
      rt_mr3n1k85:'lion_mane', rt_mr3n6laq:'cat_persian', rt_mr3nx5r4:'tiger_white', rt_mr3nyl3p:'cat_russianblue', rt_mr3ocsnm:'cat_bengal2', rt_mr5qur7u:'dog_mutt', rt_mr5sv8x4:'cat_panther', rt_mr6fb7oe:'dog_shiba', rt_mr6ghss6:'dog_corgi', rt_mr6ij84x:'dog_dalmatian', rt_mr6vozwl:'dog_dachshund', rt_mr6vpzna:'dog_bulldog', rt_mr6w3rjq:'dog_injeolmi', rt_mr6w4ovu:'dog_poodle', rt_mr6w5cl3:'dog_beagle', rt_mr6wuyag:'dog_doberman', rt_mr6wxyrh:'dog_pug', rt_mr6wyfrw:'dog_shepherd', rt_mr6xcd01:'dog_spitz', rt_mr6xgk7i:'dog_jackrussell', rt_mr6xs8ht:'dog_labrador', rt_mr6xw297:'dog_chowchow', rt_mr6xx5v2:'dog_cardigancorgi', rt_mr6y1pec:'dog_greyhound', rt_mr6y86lf:'dog_shihtzu', rt_mr6y9bl4:'dog_stbernard', rt_mr6yciq6:'dog_bostonterrier', rt_mr6yf6sy:'dog_bassethound', rt_mr6yju2g:'dog_happy', rt_mr6ym6ic:'dog_welshterrier', rt_mr6ynrtb:'dog_papillon', rt_mr6yvytf:'dog_newfoundland', rt_mr6zdf4e:'dog_afghanhound', rt_mr6zee7k:'dog_rottweiler', rt_mr6zhnai:'dog_pointer', rt_mr6zp2sc:'dog_pharaohhound', rt_mr7002ni:'dog_westie', rt_mr701o1a:'dog_weimaraner', rt_mr7034ct:'dog_collie', rt_mr704oaj:'dog_englishbulldog', rt_mr708yql:'dog_keeshond', rt_mr70icee:'dog_frenchbulldog', rt_mr70kz8k:'dog_yorkshire', rt_mr70nete:'dog_toypoodle', rt_mr70olr0:'dog_sheltie', rt_mr70tagm:'dog_minpin', rt_mr70zr4e:'dog_schnauzer', rt_mr711ipv:'dog_goldendoodle', rt_mr712r5w:'dog_bernese', rt_mr714u27:'dog_cavalier', rt_mr71f4s6:'dog_akita', rt_mr71g2qv:'dog_whippet', rt_mr71j3o8:'dog_oldenglishsheepdog', rt_mr71p8a9:'dog_vizsla', rt_mr71pvl2:'dog_englishsetter', rt_mr71sjl4:'dog_jindo', rt_mr720kdq:'dog_chinesecrested', rt_mr721yww:'dog_scottie', rt_mr7250fd:'dog_pomeranian', rt_mr72622k:'dog_sharpei', rt_mr72coei:'dog_greatdane', rt_mr72gm4s:'dog_bullterrier', rt_mr72hfg6:'dog_boxer', rt_mr72jmjd:'dog_ridgeback', rt_mr72kqss:'dog_irishsetter', rt_mr72nlf9:'dog_airedale', rt_mr744fgr:'dog_samoyed', rt_mr7451cx:'dog_husky', rt_mr759kdh:'cat_mackerel2', rt_mr75aarl:'cat_calico2', rt_mr75bbsr:'cat_white2', rt_mr75c0az:'cat_cheese2', rt_mr75cvkc:'cat_tuxedo2', rt_mr75dddx:'cat_siamese2', rt_mr75e2wv:'cat_bengal3', rt_mr75etmv:'cat_russianblue2', rt_mr75fpbk:'cat_scottishfold', rt_mr769xiu:'cat_black2', rt_mr76mii6:'cat_seolleong', rt_mr76n69t:'cat_persiangray', rt_mr76p8n1:'cat_mainecoon', rt_mr76q905:'cat_americanshorthair', rt_mr773m1p:'cat_ragdoll', rt_mr774au6:'cat_turkishangora', rt_mr774voq:'cat_munchkin', rt_mr775sox:'cat_norwegian', rt_mr776hjf:'cat_bombay', rt_mr77ape1:'cat_abyssinian', rt_mr77kfq3:'cat_sphynx', rt_mr77l7c4:'cat_british', rt_mr77mfhh:'cat_bengalsnow', rt_mr77ntfp:'cat_longhaircalico', rt_mr783yq0:'cat_tortie', rt_mr784rb3:'cat_siamesechoco', rt_mr78691n:'cat_cornishrex', rt_mr786rv1:'cat_ocicat', rt_mr787wjx:'cat_selkirkrex', rt_mr788jjr:'cat_korat', rt_mr78kzq2:'cat_manx', rt_mr78lz4e:'cat_americancurl', rt_mr78mfck:'cat_devonrex', rt_mr78ndhg:'cat_turkishvan', rt_mr78o4x7:'cat_bobtail', rt_mr78vl28:'cat_burmese', rt_mr78wcvv:'cat_himalayan', rt_mr78wv0g:'cat_creamtabby', rt_mr78xe56:'cat_lilac', rt_mr78xvqn:'cat_somali', rt_mr799mgy:'cat_leopardcat', rt_mr79e4vx:'cat_lynx', rt_mr7bc36n:'cat_cheetah', rt_mr7bfc2b:'cat_jaguar', rt_mr7bg2hm:'cat_puma', rt_mr7bgvow:'cat_snowleopard', rt_mr7bhljw:'cat_caracal', rt_mr7bic2r:'cat_leopard', rt_mr7bj2lj:'cat_blackpanther', rt_mr7bk30p:'cat_ocelot', rt_mr7bku9j:'cat_sandcat', rt_mr7c5ffn:'cat_mainecoonsmoke', rt_mr7c7a80:'cat_mainecoonred', rt_mr7c7z2v:'cat_bengalsilver', rt_mr7cssyk:'cat_peterbald', rt_mr7ctpc2:'cat_toyger', rt_mr7cufse:'cat_singapura', rt_mr7cv65x:'cat_havanabrown', rt_mr7cvz9n:'cat_ragamuffin', /* @rtmigrate */ };
    // size = 표시 배율(1=기본, 팔레트 아이콘 크기에 반영). footW×footH = 배치 격자 점유(가로×세로 칸). 캣타워=1×2, 스크래처=1×1, 화장실=1×1(정사각), 방석·밥그릇=1×1(작게, 밥그릇<방석). itemFoot()/furnScale()로 배치·팔레트에 반영.
    const ITEM_CATALOG = [
      { id:'pond', cat:'rest',     name:'연못',   price:70, size:2.6, footW:3, footH:2, floor:true, desc:'수련·잉어가 사는 작은 연못. 물 위에 다른 가구를 올릴 수 있어요.' },
      { id:'cushion', cat:'rest', name:'방석',   price:15, size:0.6,  footW:1, footH:1, desc:'고양이가 위에 잠시 올라가 쉬어요.' },
      { id:'bowl', cat:'care',    name:'밥그릇', price:20, size:0.45, footW:1, footH:1, desc:'홈에서 탭해 사료를 채워요(3시간 뒤 비워짐).' },
      { id:'waterbowl', cat:'care', name:'물그릇', price:20, size:0.45, footW:1, footH:1, desc:'홈에서 탭해 물을 채워요(3시간 뒤 비워짐).' },
      { id:'tower', cat:'rest',   name:'캣타워', price:35, size:2,    footW:1, footH:2, desc:'3층 발판 — 한 층에 올라가 쉬어요.' },
      { id:'scratcher', cat:'play', name:'스크래처', price:18, size:2, footW:1, footH:1, desc:'옆에서 잠시 머물며 발톱을 갈아요.' },
      { id:'litterbox', cat:'care', name:'배변패드', price:25, size:1, footW:1, footH:1, desc:'비운 그릇 수만큼 똥이 쌓여요. 탭해 치우면 은화!' },
      { id:'pethouse', cat:'rest', name:'펫하우스', price:45, size:2, footW:1, footH:1, desc:'펫이 안에 들어가 정면을 보며 아늑하게 쉬어요.' },   // 점유칸 1×1(캠 렌더 크기 ROOM_H는 그대로 유지 — 좁은 칸에 큰 집)
      { id:'catwheel', cat:'play', name:'캣휠', price:60, size:2, footW:2, footH:2, desc:'고양이가 안에서 달리며 운동하는 러닝휠.' },
      { id:'plant', cat:'decor',    name:'화분',   price:22, size:1, footW:1, footH:1, desc:'초록 화분. 고양이가 곁에서 잠시 쉬어요.' },
      { id:'rug', cat:'decor',      name:'러그',   price:200, size:2, footW:3, footH:2, floor:true, desc:'바닥에 까는 페르시안 러그. 높이가 없어 위에 다른 가구를 올릴 수 있어요.' },   // 희귀 등급가. floor:true = 바닥 아이템(겹침 허용·맨 뒤 렌더). 3×2로 넓게.
      { id:'window', cat:'decor',   name:'창문',   price:800, size:2, footW:1, footH:1, wall:true, desc:'벽에 거는 창문. 해와 구름이 흘러가요.' },   // 전설 등급가 · 벽 가구
      { id:'fishtank', cat:'decor', name:'어항',   price:400, size:1.6, footW:1, footH:1, desc:'금붕어가 헤엄치는 어항. 고양이가 앞에서 구경해요.' },   // 특별 등급가
      { id:'fireplace', cat:'decor', name:'벽난로', price:800, size:2, footW:1, footH:1, wall:true, desc:'벽에 두는 벽난로. 불꽃이 일렁여요.' },   // 벽 가구 1×1(창문처럼 벽 1칸 — 주변 침범 방지)
      { id:'fan', cat:'decor',      name:'선풍기', price:800, size:1.6, footW:1, footH:1, desc:'날개가 도는 선풍기. 곁에서 바람을 쐬며 쉬어요.' },
      { id:'hammock', cat:'rest',  name:'해먹',   price:800, size:2, footW:1, footH:1, desc:'살랑이는 그물 침대. 펫이 안에 올라가 눕습니다.' },
      { id:'teaser', cat:'play',   name:'낚싯대장난감', price:800, size:1.4, footW:1, footH:1, desc:'깃털이 흔들리는 낚싯대. 옆에서 톡톡 건드려요.' },
      { id:'wallclock', cat:'decor', name:'벽시계', price:800, size:1.4, footW:1, footH:1, wall:true, desc:'벽에 거는 벽시계. 추가 좌우로 흔들려요.' },
      { id:'hangplant', cat:'decor', name:'행잉플랜트', price:800, size:1.4, footW:1, footH:1, wall:true, desc:'벽·천장에 매다는 화분. 덩굴이 살랑여요.' },
      { id:'mobile', cat:'decor',   name:'모빌',   price:800, size:1.4, footW:1, footH:1, wall:true, desc:'천장에 매다는 모빌. 별·달·하트가 살랑여요.' },
      { id:'chandelier', cat:'decor', name:'샹들리에', price:1500, size:2, footW:2, footH:1, wall:true, desc:'천장에 매다는 화려한 크리스털 샹들리에. 따뜻한 촛불과 크리스털이 반짝여요.' },   // 신화 등급(id 'limited') · 매다는형(hang) 벽 가구
      { id:'jingleball', cat:'play', name:'방울공', price:800, size:1, footW:1, footH:1, desc:'통통 흔들리는 방울 공. 펫이 굴리며 놀아요.' },
      { id:'frame',  cat:'decor', name:'액자',   price:800, size:1.4, footW:1, footH:1, wall:true, desc:'벽에 거는 풍경 액자.' },
      { id:'shelf',  cat:'decor', name:'벽 선반', price:800, size:1.4, footW:2, footH:1, wall:true, desc:'벽에 다는 선반. 소품이 올려져 있어요.' },
      { id:'mirror', cat:'decor', name:'거울',   price:800, size:1.4, footW:1, footH:1, wall:true, desc:'벽에 거는 금테 거울.' },
      { id:'neon',   cat:'decor', name:'네온사인', price:800, size:1.4, footW:1, footH:1, wall:true, desc:'벽에 다는 네온 하트. 은은하게 깜빡여요.' },
      { id:'sconce', cat:'decor', name:'벽등',   price:800, size:1.4, footW:1, footH:1, wall:true, desc:'벽에 다는 등불. 불빛이 일렁여요.' },
      { id:'garland', cat:'decor', name:'가랜드', price:800, size:1.4, footW:3, footH:1, wall:true, desc:'천장 근처에 다는 전구 줄. 은은하게 깜빡여요.' },   // 가로로 넓어 3칸 점유
      { id:'poster', cat:'decor', name:'포스터', price:800, size:1.4, footW:1, footH:1, wall:true, desc:'벽에 붙이는 여행 포스터.' },
      { id:'tapestry', cat:'decor', name:'태피스트리', price:800, size:1.4, footW:1, footH:1, wall:true, desc:'봉에 매다는 무늬 벽걸이 천.' }
    ];
    // 소비 아이템(배치 불가) — 홈에서 밥그릇/물그릇을 탭해 채울 때 소모. 알뜰샵 "소비" 탭에서 구매.
    const CONSUM_CATALOG = [
      { id:'food',  name:'사료', price:1, M:'M_FOOD',  desc:'밥그릇을 탭해 채울 때 1개 소모.' },
      { id:'water', name:'물',   price:1, M:'M_WATER', desc:'물그릇을 탭해 채울 때 1개 소모.' }
    ];
    const FILL_MS = 3*60*60*1000;   // 그릇이 채워진 뒤 비워지기까지(3시간)
    const MOOD_CARE_MS = 24*60*60*1000;   // ❤️ 수확(caredAt) 후 행복도 보너스가 0으로 빠지는 시간(24h)
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
      { id:'lavender',name:'라벤더',price:30, css:'linear-gradient(180deg,#e0d0f5 0%,#f3ecfb 100%)' },
      { id:'brick',   name:'벽돌',  price:35, tile:{ m:M_WALL_BRICK, pal:FLOOR_PALS.brickwall, tw:22, th:22 } }
    ];
    function wallCss(id){ const w=WALLPAPER_CATALOG.find(x=>x.id===id)||WALLPAPER_CATALOG[0]; if(!w.tile) return w.css; if(_tileBgCache['w:'+id]) return _tileBgCache['w:'+id]; return (_tileBgCache['w:'+id]=tileBg(w.tile.m, w.tile.pal, w.tile.tw, w.tile.th)); }
    function ownsWall(id){ return id==='default' || !!(state.game&&state.game.owned.wallpapers[id]); }
    // ---- 여러 방(프리셋) 접근자 — 모든 방별 읽기/쓰기는 반드시 이 헬퍼를 거친다(현재 방 기준). ----
    function homeH(){ return (state.game&&state.game.home)||{ rooms:[{active:[],placed:{},wallpaper:'default',poops:0,name:'방 1'}], current:0, roomSlots:BASE_ROOMS, slots:BASE_SLOTS }; }
    function roomCount(){ return Math.min(MAX_ROOMS, Math.max(BASE_ROOMS, (homeH().roomSlots)||BASE_ROOMS)); }   // 열린 방 수
    function roomIdx(){ const h=homeH(); const n=(h.rooms&&h.rooms.length)||1; return Math.min(n-1, Math.max(0, h.current|0)); }   // 현재 방 인덱스(클램프)
    function room(){ const h=homeH(); return (h.rooms&&h.rooms[roomIdx()])||{ active:[], placed:{}, wallPlaced:{}, wallpaper:'default', poops:0, name:'방 1' }; }   // 현재 방 객체
    function roomChild(sub){ return 'home/rooms/'+roomIdx()+'/'+sub; }   // 현재 방 하위 쓰기 경로(레거시 인덱스 기반 — 방별 쓰기는 roomTx(id) 권장)
    function gRoom(g){ return g.home.rooms[g.home.current|0]||g.home.rooms[0]; }   // 트랜잭션 내부(normalizeGame 후)에서 현재 방 객체
    // ---- 방 안정 id: 방별 쓰기를 인덱스가 아닌 id로 → 재정렬/삭제 경합에도 항상 그 방을 정확히 수정(엉뚱한 방 수정·삭제 방지) ----
    function genRoomId(){ return 'r_'+Date.now().toString(36)+Math.random().toString(36).slice(2,7); }   // 비정수 id(RTDB 배열 강제변환과 무관)
    function roomIndexById(rooms, id){ if(!id||!Array.isArray(rooms)) return -1; for(let i=0;i<rooms.length;i++){ if(rooms[i]&&rooms[i].id===id) return i; } return -1; }
    function curRoomId(){ const h=homeH(); const r=(h.rooms&&h.rooms[roomIdx()])||{}; return r.id||''; }
    // id로 방을 찾아 트랜잭션으로 안전하게 수정. id 미발견(레거시 미부여)이면 idxFallback→현재 방으로 폴백.
    function roomTx(id, idxFallback, mut, done){
      gameRef().transaction(g=>{ if(g==null) return; g=normalizeGame(g); const rs=g.home.rooms||[];
        let i=roomIndexById(rs, id); if(i<0) i=(idxFallback!=null? idxFallback|0 : (g.home.current|0));
        const R=rs[i]; if(!R) return g; mut(R, g, i); g.home.changedAt=new Date().toISOString(); return g;
      }).then(r=>{ if(done) done(r); });
    }
    // 모든 방에 안정 id 부여(없는 방만) + 객체형/구멍 배열을 dense 배열로 자가치유. 리스너에서 1회성 발동(멱등).
    function ensureRoomIds(){
      const h=state.game&&state.game.home; if(!h||!Array.isArray(h.rooms)) return;
      if(!h.rooms.some(r=>r&&!r.id)) return;   // 모두 id 있으면 skip
      if(state._roomIdFixing) return; state._roomIdFixing=true;
      gameRef().child('home').transaction(cur=>{
        if(cur==null) return;   // null 첫 패스 abort(재접속 clobber 방지)
        const rs=toRoomsArray(cur.rooms); if(!rs) return;   // 방 데이터 없음(레거시 flat은 migrate가 처리)
        let changed=false, seen={};
        rs.forEach(r=>{ if(!r.id || seen[r.id]){ r.id=genRoomId(); changed=true; } seen[r.id]=1; });
        if(!changed) return;   // 변경 없음 → abort
        cur.rooms=rs; return cur;   // dense 배열(+id)로 정규화해 되씀(객체형 자가치유)
      }).catch(()=>{}).then(()=>{ state._roomIdFixing=false; });
    }
    // 레거시 flat home(단일 방) → rooms 구조로 1회 영구 이관. 안 하면 첫 방별 쓰기에서 flat 가구/벽지가 유실됨.
    function migrateHomeRoomsIfNeeded(raw){
      if(!state.uid) return;
      const h=raw&&raw.home;
      if(!h || toRoomsArray(h.rooms)) return;   // 이미 rooms 구조(배열/객체형 모두)거나 home 없음 → 이관 불필요. ⚠️ Array.isArray만 보면 RTDB 객체형 멀티룸을 flat으로 오인해 붕괴본으로 덮어씀(과거 소실 버그)
      if(!(h.placed || (h.active&&h.active.length) || h.wallpaper || h.poops)) return;   // 옮길 flat 데이터 없음
      if(state._homeMigrating) return; state._homeMigrating=true;   // 로컬 중복 방지
      // 트랜잭션으로 race-safe: 그새 다른 기기가 이미 rooms화했으면 건너뜀. flat 키는 제거하고 rooms로 이관.
      gameRef().child('home').transaction(cur=>{
        if(!cur) return;   // null 첫 패스(재접속 콜드캐시)에 기본 홈을 제안하지 않음 → 서버 재실행에서 진짜 값으로 판정
        if(toRoomsArray(cur.rooms)) return;   // 이미 이관됨(배열/객체형) → 변경 없음(abort)
        const nh=normalizeHome(cur, HOME_OPTS);
        return { rooms:nh.rooms, current:nh.current, showRoom:nh.showRoom, roomSlots:nh.roomSlots, slots:nh.slots, changedAt:nh.changedAt||new Date().toISOString() };
      }).catch(()=>{}).then(()=>{ state._homeMigrating=false; });
    }
    function currentWall(){ return room().wallpaper||'default'; }
    // 바닥 스킨(픽셀 타일) - 벽지처럼 방마다 적용. .cr-floor 배경에 반복 타일(SVG data URI). default=단색.
    const _tileBgCache={};
    // 🧵 집꾸미기 타일 배경 = canvas → PNG data URI (반드시! SVG data URI는 인트린식 크기 문제로 배경 이미지가 브라우저에서 래스터화 안 돼 회색만 보임). image-rendering:pixelated + background-size로 크게 반복.
    function tileBg(M, pal, tw, th){ try{ const cols=M[0].length, rows=M.length, cv=document.createElement('canvas'); cv.width=cols; cv.height=rows; const cx=cv.getContext('2d');
        for(let y=0;y<rows;y++){ const rw=M[y]; for(let x=0;x<cols;x++){ const ch=rw[x]; if(ch==='.'||ch===' ')continue; const c=pal[ch]; if(!c)continue; cx.fillStyle=c; cx.fillRect(x,y,1,1); } }
        return "url('"+cv.toDataURL()+"') 0 0 / "+tw+"px "+th+"px repeat"; }catch(e){ return 'var(--soft2)'; } }
    const FLOOR_CATALOG = [
      { id:'default',   name:'기본',     price:0 },
      { id:'wood',      name:'원목마루', price:30, m:M_FLOOR_WOOD,      pal:FLOOR_PALS.wood,      tw:26, th:26 },
      { id:'checker',   name:'체크타일', price:28, m:M_FLOOR_CHECKER,   pal:FLOOR_PALS.checker,   tw:26, th:26 },
      { id:'grass',     name:'잔디정원', price:32, m:M_FLOOR_GRASS,     pal:FLOOR_PALS.grass,     tw:24, th:24 },
      { id:'ondol',     name:'한옥장판', price:28, m:M_FLOOR_ONDOL,     pal:FLOOR_PALS.ondol,     tw:24, th:24 },
      { id:'starry',    name:'별밤바닥', price:35, m:M_FLOOR_STARRY,    pal:FLOOR_PALS.starry,    tw:26, th:26 },
      { id:'sand',      name:'모래사장', price:28, m:M_FLOOR_SAND,      pal:FLOOR_PALS.sand,      tw:26, th:26 },
      { id:'tatami',    name:'다다미',   price:30, m:M_FLOOR_TATAMI,    pal:FLOOR_PALS.tatami,    tw:26, th:26 },
      { id:'brickpath', name:'벽돌길',   price:30, m:M_FLOOR_BRICKPATH, pal:FLOOR_PALS.brickpath, tw:26, th:26 }
    ];
    function floorCss(id){ if(_tileBgCache['f:'+id]) return _tileBgCache['f:'+id]; const f=FLOOR_CATALOG.find(x=>x.id===id)||FLOOR_CATALOG[0]; const v=f.m? tileBg(f.m, f.pal, f.tw, f.th) : 'var(--soft2)'; return (_tileBgCache['f:'+id]=v); }
    function currentFloor(){ return room().floor||'default'; }
    function ownsFloor(id){ return id==='default' || !!(state.game&&state.game.owned&&state.game.owned.floors&&state.game.owned.floors[id]); }
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
      opt=opt||{}; pal=pal||{}; if(!map||!map.length||map[0]==null) return '';   // 방어: 팔레트/매트릭스가 없어도 절대 throw 안 함(삭제된 펫 등 미정의 팔레트로 렌더가 캠·알뜰홈 전체를 깨뜨리던 크래시 방지)
      const cols=map[0].length, rows=map.length; let r=''; let rbw=false; const rid='pxrbw'+(pxSvg._n=(pxSvg._n||0)+1);
      for(let y=0;y<rows;y++){ const row=map[y];
        for(let x=0;x<cols;x++){ const ch=row[x]; if(ch===' '||ch==='.')continue; const c=pal[ch]; if(!c)continue;
          const f=c==='RAINBOW'?(rbw=true,'url(#'+rid+')'):c; r+='<rect x="'+x+'" y="'+y+'" width="1.05" height="1.05" fill="'+f+'"/>'; } }
      const sz = opt.h ? ('height="'+opt.h+'"') : (opt.w? ('width="'+opt.w+'"') : '');
      const wh = opt.fit ? 'width="100%" height="100%"' : sz;
      return '<svg class="px '+(opt.cls||'')+'" viewBox="0 0 '+cols+' '+rows+'" '+wh+' shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet">'+(rbw?'<defs><linearGradient id="'+rid+'" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="9" spreadMethod="repeat"><stop offset="0" stop-color="#F04452"/><stop offset=".17" stop-color="#F0883C"/><stop offset=".34" stop-color="#F2C84B"/><stop offset=".5" stop-color="#2FAE7A"/><stop offset=".67" stop-color="#3182F6"/><stop offset=".84" stop-color="#9B6FC8"/><stop offset="1" stop-color="#F04452"/><animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="0 9" dur="1.6s" repeatCount="indefinite"/></linearGradient></defs>':'')+r+'</svg>';
    }
    function catPal(id){ return CAT_PALS[id]||CAT_PALS.cat_mackerel; }   // 미정의(삭제/미지원) 펫은 기본 고등어 팔레트로 폴백(블랭크·크래시 방지)
    function catFront(id, opt){ return pxSvg(id==='cat_calico'?M_CALICO_FRONT:M_CAT_FRONT, catPal(id), opt); }
    function catSide(id, frame, opt){ return pxSvg(frame? M_CAT_SIDE_B:M_CAT_SIDE_A, catPal(id), opt); }
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
      cat_kitten:{ walk:'assets/pets/cat/cat_kitten/walk.png', frames:6, stills:true },
      cat_pink:{ walk:'assets/pets/cat/cat_pink/walk.png', frames:6, stills:true },
      tiger_orange:{ walk:'assets/pets/tiger/tiger_orange/walk.png', frames:6, stills:true, scale:5 },
      lion_mane:{ walk:'assets/pets/lion/lion_mane/walk.png', frames:6, stills:true, scale:5 },
      cat_persian:{ walk:'assets/pets/cat/cat_persian/walk.png', frames:6, stills:true },
      tiger_white:{ walk:'assets/pets/tiger/tiger_white/walk.png', frames:6, stills:true, scale:5 },
      cat_russianblue:{ walk:'assets/pets/cat/cat_russianblue/walk.png', frames:6, stills:true },
      cat_bengal2:{ walk:'assets/pets/cat/cat_bengal2/walk.png', frames:6, stills:true },
      dog_mutt:{ walk:'assets/pets/dog/dog_mutt/walk.png', frames:6, stills:true, scale:1.5 },
      cat_panther:{ walk:'assets/pets/cat/cat_panther/walk.png', frames:6, stills:true, scale:3 },
      dog_baekgu:{ walk:'assets/pets/dog/dog_baekgu/walk.png', frames:8, stills:true, scale:1.5 },
      dog_shiba:{ walk:'assets/pets/dog/dog_shiba/walk.png', frames:8, stills:true, scale:1.5 },
      dog_corgi:{ walk:'assets/pets/dog/dog_corgi/walk.png', frames:6, stills:true, scale:1.5 },
      dog_dalmatian:{ walk:'assets/pets/dog/dog_dalmatian/walk.png', frames:6, stills:true, scale:1.5 },
      dog_dachshund:{ walk:'assets/pets/dog/dog_dachshund/walk.png', frames:6, stills:true, scale:1.5 },
      dog_bulldog:{ walk:'assets/pets/dog/dog_bulldog/walk.png', frames:6, stills:true, scale:1.5 },
      dog_injeolmi:{ walk:'assets/pets/dog/dog_injeolmi/walk.png', frames:6, stills:true, scale:1.5 },
      dog_poodle:{ walk:'assets/pets/dog/dog_poodle/walk.png', frames:6, stills:true, scale:1.5 },
      dog_beagle:{ walk:'assets/pets/dog/dog_beagle/walk.png', frames:6, stills:true, scale:1.5 },
      dog_sukhee:{ walk:'assets/pets/dog/dog_sukhee/walk.png', frames:6, stills:true, scale:1.5 },
      dog_doberman:{ walk:'assets/pets/dog/dog_doberman/walk.png', frames:8, stills:true, scale:1.5 },
      dog_pug:{ walk:'assets/pets/dog/dog_pug/walk.png', frames:8, stills:true, scale:1.5 },
      dog_shepherd:{ walk:'assets/pets/dog/dog_shepherd/walk.png', frames:8, stills:true, scale:1.5 },
      dog_bordercollie:{ walk:'assets/pets/dog/dog_bordercollie/walk.png', frames:8, stills:true, scale:1.5 },
      dog_spitz:{ walk:'assets/pets/dog/dog_spitz/walk.png', frames:6, stills:true, scale:1.5 },
      dog_jackrussell:{ walk:'assets/pets/dog/dog_jackrussell/walk.png', frames:6, stills:true, scale:1.5 },
      dog_labrador:{ walk:'assets/pets/dog/dog_labrador/walk.png', frames:6, stills:true, scale:1.5 },
      dog_chowchow:{ walk:'assets/pets/dog/dog_chowchow/walk.png', frames:6, stills:true, scale:1.5 },
      dog_cardigancorgi:{ walk:'assets/pets/dog/dog_cardigancorgi/walk.png', frames:6, stills:true, scale:1.5 },
      dog_greyhound:{ walk:'assets/pets/dog/dog_greyhound/walk.png', frames:6, stills:true, scale:1.5 },
      dog_shihtzu:{ walk:'assets/pets/dog/dog_shihtzu/walk.png', frames:6, stills:true, scale:1.5 },
      dog_stbernard:{ walk:'assets/pets/dog/dog_stbernard/walk.png', frames:6, stills:true, scale:1.5 },
      dog_bostonterrier:{ walk:'assets/pets/dog/dog_bostonterrier/walk.png', frames:6, stills:true, scale:1.5 },
      dog_bassethound:{ walk:'assets/pets/dog/dog_bassethound/walk.png', frames:6, stills:true, scale:1.5 },
      dog_happy:{ walk:'assets/pets/dog/dog_happy/walk.png', frames:6, stills:true, scale:1.5 },
      dog_welshterrier:{ walk:'assets/pets/dog/dog_welshterrier/walk.png', frames:6, stills:true, scale:1.5 },
      dog_papillon:{ walk:'assets/pets/dog/dog_papillon/walk.png', frames:6, stills:true, scale:1.5 },
      dog_newfoundland:{ walk:'assets/pets/dog/dog_newfoundland/walk.png', frames:6, stills:true, scale:1.5 },
      dog_beardedcollie:{ walk:'assets/pets/dog/dog_beardedcollie/walk.png', frames:6, stills:true, scale:1.5 },
      dog_afghanhound:{ walk:'assets/pets/dog/dog_afghanhound/walk.png', frames:6, stills:true, scale:1.5 },
      dog_rottweiler:{ walk:'assets/pets/dog/dog_rottweiler/walk.png', frames:6, stills:true, scale:1.5 },
      dog_pointer:{ walk:'assets/pets/dog/dog_pointer/walk.png', frames:6, stills:true, scale:1.5 },
      dog_pharaohhound:{ walk:'assets/pets/dog/dog_pharaohhound/walk.png', frames:6, stills:true, scale:1.5 },
      dog_westie:{ walk:'assets/pets/dog/dog_westie/walk.png', frames:6, stills:true, scale:1.5 },
      dog_weimaraner:{ walk:'assets/pets/dog/dog_weimaraner/walk.png', frames:6, stills:true, scale:1.5 },
      dog_collie:{ walk:'assets/pets/dog/dog_collie/walk.png', frames:6, stills:true, scale:1.5 },
      dog_englishbulldog:{ walk:'assets/pets/dog/dog_englishbulldog/walk.png', frames:6, stills:true, scale:1.5 },
      dog_keeshond:{ walk:'assets/pets/dog/dog_keeshond/walk.png', frames:6, stills:true, scale:1.5 },
      dog_frenchbulldog:{ walk:'assets/pets/dog/dog_frenchbulldog/walk.png', frames:6, stills:true, scale:1.5 },
      dog_yorkshire:{ walk:'assets/pets/dog/dog_yorkshire/walk.png', frames:6, stills:true, scale:1.5 },
      dog_toypoodle:{ walk:'assets/pets/dog/dog_toypoodle/walk.png', frames:6, stills:true, scale:1.5 },
      dog_sheltie:{ walk:'assets/pets/dog/dog_sheltie/walk.png', frames:6, stills:true, scale:1.5 },
      dog_minpin:{ walk:'assets/pets/dog/dog_minpin/walk.png', frames:6, stills:true, scale:1.5 },
      dog_schnauzer:{ walk:'assets/pets/dog/dog_schnauzer/walk.png', frames:6, stills:true, scale:1.5 },
      dog_goldendoodle:{ walk:'assets/pets/dog/dog_goldendoodle/walk.png', frames:6, stills:true, scale:1.5 },
      dog_bernese:{ walk:'assets/pets/dog/dog_bernese/walk.png', frames:6, stills:true, scale:1.5 },
      dog_cavalier:{ walk:'assets/pets/dog/dog_cavalier/walk.png', frames:6, stills:true, scale:1.5 },
      dog_akita:{ walk:'assets/pets/dog/dog_akita/walk.png', frames:6, stills:true, scale:1.5 },
      dog_whippet:{ walk:'assets/pets/dog/dog_whippet/walk.png', frames:6, stills:true, scale:1.5 },
      dog_oldenglishsheepdog:{ walk:'assets/pets/dog/dog_oldenglishsheepdog/walk.png', frames:6, stills:true, scale:1.5 },
      dog_vizsla:{ walk:'assets/pets/dog/dog_vizsla/walk.png', frames:6, stills:true, scale:1.5 },
      dog_englishsetter:{ walk:'assets/pets/dog/dog_englishsetter/walk.png', frames:6, stills:true, scale:1.5 },
      dog_jindo:{ walk:'assets/pets/dog/dog_jindo/walk.png', frames:6, stills:true, scale:1.5 },
      dog_chinesecrested:{ walk:'assets/pets/dog/dog_chinesecrested/walk.png', frames:6, stills:true, scale:1.5 },
      dog_scottie:{ walk:'assets/pets/dog/dog_scottie/walk.png', frames:6, stills:true, scale:1.5 },
      dog_pomeranian:{ walk:'assets/pets/dog/dog_pomeranian/walk.png', frames:6, stills:true, scale:1.5 },
      dog_sharpei:{ walk:'assets/pets/dog/dog_sharpei/walk.png', frames:6, stills:true, scale:1.5 },
      dog_greatdane:{ walk:'assets/pets/dog/dog_greatdane/walk.png', frames:6, stills:true, scale:1.5 },
      dog_bullterrier:{ walk:'assets/pets/dog/dog_bullterrier/walk.png', frames:6, stills:true, scale:1.5 },
      dog_boxer:{ walk:'assets/pets/dog/dog_boxer/walk.png', frames:6, stills:true, scale:1.5 },
      dog_ridgeback:{ walk:'assets/pets/dog/dog_ridgeback/walk.png', frames:6, stills:true, scale:1.5 },
      dog_irishsetter:{ walk:'assets/pets/dog/dog_irishsetter/walk.png', frames:6, stills:true, scale:1.5 },
      dog_airedale:{ walk:'assets/pets/dog/dog_airedale/walk.png', frames:6, stills:true, scale:1.5 },
      dog_samoyed:{ walk:'assets/pets/dog/dog_samoyed/walk.png', frames:6, stills:true, scale:1.5 },
      dog_husky:{ walk:'assets/pets/dog/dog_husky/walk.png', frames:6, stills:true, scale:1.5 },
      cat_mackerel2:{ walk:'assets/pets/cat/cat_mackerel2/walk.png', frames:6, stills:true },
      cat_calico2:{ walk:'assets/pets/cat/cat_calico2/walk.png', frames:6, stills:true },
      cat_white2:{ walk:'assets/pets/cat/cat_white2/walk.png', frames:6, stills:true },
      cat_cheese2:{ walk:'assets/pets/cat/cat_cheese2/walk.png', frames:6, stills:true },
      cat_tuxedo2:{ walk:'assets/pets/cat/cat_tuxedo2/walk.png', frames:6, stills:true },
      cat_siamese2:{ walk:'assets/pets/cat/cat_siamese2/walk.png', frames:6, stills:true },
      cat_bengal3:{ walk:'assets/pets/cat/cat_bengal3/walk.png', frames:6, stills:true },
      cat_russianblue2:{ walk:'assets/pets/cat/cat_russianblue2/walk.png', frames:6, stills:true },
      cat_scottishfold:{ walk:'assets/pets/cat/cat_scottishfold/walk.png', frames:6, stills:true },
      cat_black2:{ walk:'assets/pets/cat/cat_black2/walk.png', frames:6, stills:true },
      cat_seolleong:{ walk:'assets/pets/cat/cat_seolleong/walk.png', frames:6, stills:true },
      cat_persiangray:{ walk:'assets/pets/cat/cat_persiangray/walk.png', frames:6, stills:true },
      cat_mainecoon:{ walk:'assets/pets/cat/cat_mainecoon/walk.png', frames:6, stills:true },
      cat_americanshorthair:{ walk:'assets/pets/cat/cat_americanshorthair/walk.png', frames:6, stills:true },
      cat_ragdoll:{ walk:'assets/pets/cat/cat_ragdoll/walk.png', frames:6, stills:true },
      cat_turkishangora:{ walk:'assets/pets/cat/cat_turkishangora/walk.png', frames:6, stills:true },
      cat_munchkin:{ walk:'assets/pets/cat/cat_munchkin/walk.png', frames:6, stills:true },
      cat_norwegian:{ walk:'assets/pets/cat/cat_norwegian/walk.png', frames:6, stills:true },
      cat_bombay:{ walk:'assets/pets/cat/cat_bombay/walk.png', frames:6, stills:true },
      cat_abyssinian:{ walk:'assets/pets/cat/cat_abyssinian/walk.png', frames:6, stills:true },
      cat_sphynx:{ walk:'assets/pets/cat/cat_sphynx/walk.png', frames:6, stills:true },
      cat_british:{ walk:'assets/pets/cat/cat_british/walk.png', frames:6, stills:true },
      cat_bengalsnow:{ walk:'assets/pets/cat/cat_bengalsnow/walk.png', frames:6, stills:true },
      cat_longhaircalico:{ walk:'assets/pets/cat/cat_longhaircalico/walk.png', frames:6, stills:true },
      cat_tortie:{ walk:'assets/pets/cat/cat_tortie/walk.png', frames:6, stills:true },
      cat_siamesechoco:{ walk:'assets/pets/cat/cat_siamesechoco/walk.png', frames:6, stills:true },
      cat_cornishrex:{ walk:'assets/pets/cat/cat_cornishrex/walk.png', frames:6, stills:true },
      cat_ocicat:{ walk:'assets/pets/cat/cat_ocicat/walk.png', frames:6, stills:true },
      cat_selkirkrex:{ walk:'assets/pets/cat/cat_selkirkrex/walk.png', frames:6, stills:true },
      cat_korat:{ walk:'assets/pets/cat/cat_korat/walk.png', frames:6, stills:true },
      cat_manx:{ walk:'assets/pets/cat/cat_manx/walk.png', frames:6, stills:true },
      cat_americancurl:{ walk:'assets/pets/cat/cat_americancurl/walk.png', frames:6, stills:true },
      cat_devonrex:{ walk:'assets/pets/cat/cat_devonrex/walk.png', frames:6, stills:true },
      cat_turkishvan:{ walk:'assets/pets/cat/cat_turkishvan/walk.png', frames:6, stills:true },
      cat_bobtail:{ walk:'assets/pets/cat/cat_bobtail/walk.png', frames:6, stills:true },
      cat_burmese:{ walk:'assets/pets/cat/cat_burmese/walk.png', frames:6, stills:true },
      cat_himalayan:{ walk:'assets/pets/cat/cat_himalayan/walk.png', frames:6, stills:true },
      cat_creamtabby:{ walk:'assets/pets/cat/cat_creamtabby/walk.png', frames:6, stills:true },
      cat_lilac:{ walk:'assets/pets/cat/cat_lilac/walk.png', frames:6, stills:true },
      cat_somali:{ walk:'assets/pets/cat/cat_somali/walk.png', frames:6, stills:true },
      cat_leopardcat:{ walk:'assets/pets/cat/cat_leopardcat/walk.png', frames:6, stills:true, scale:1.5 },
      cat_lynx:{ walk:'assets/pets/cat/cat_lynx/walk.png', frames:6, stills:true, scale:2 },
      cat_cheetah:{ walk:'assets/pets/cat/cat_cheetah/walk.png', frames:6, stills:true, scale:3 },
      cat_jaguar:{ walk:'assets/pets/cat/cat_jaguar/walk.png', frames:8, stills:true, scale:5 },
      cat_puma:{ walk:'assets/pets/cat/cat_puma/walk.png', frames:8, stills:true, scale:5 },
      cat_snowleopard:{ walk:'assets/pets/cat/cat_snowleopard/walk.png', frames:8, stills:true, scale:5 },
      cat_caracal:{ walk:'assets/pets/cat/cat_caracal/walk.png', frames:8, stills:true, scale:5 },
      cat_leopard:{ walk:'assets/pets/cat/cat_leopard/walk.png', frames:8, stills:true, scale:5 },
      cat_blackpanther:{ walk:'assets/pets/cat/cat_blackpanther/walk.png', frames:8, stills:true, scale:5 },
      cat_ocelot:{ walk:'assets/pets/cat/cat_ocelot/walk.png', frames:8, stills:true, scale:4 },
      cat_sandcat:{ walk:'assets/pets/cat/cat_sandcat/walk.png', frames:6, stills:true },
      cat_mainecoonsmoke:{ walk:'assets/pets/cat/cat_mainecoonsmoke/walk.png', frames:6, stills:true },
      cat_mainecoonred:{ walk:'assets/pets/cat/cat_mainecoonred/walk.png', frames:6, stills:true },
      cat_bengalsilver:{ walk:'assets/pets/cat/cat_bengalsilver/walk.png', frames:6, stills:true },
      cat_peterbald:{ walk:'assets/pets/cat/cat_peterbald/walk.png', frames:6, stills:true },
      cat_toyger:{ walk:'assets/pets/cat/cat_toyger/walk.png', frames:6, stills:true, scale:1.2 },
      cat_singapura:{ walk:'assets/pets/cat/cat_singapura/walk.png', frames:6, stills:true },
      cat_havanabrown:{ walk:'assets/pets/cat/cat_havanabrown/walk.png', frames:6, stills:true },
      cat_ragamuffin:{ walk:'assets/pets/cat/cat_ragamuffin/walk.png', frames:6, stills:true }
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
        return '<div class="cspr'+(idleOn?' idle':'')+'" style="width:'+s+'px;height:'+s+'px;--sheet:url('+sprWalkUrl(sp)+');--idle:url('+sprStill(id,face)+');--fw:'+(s*sp.frames)+'px;"><i class="csprf" style="animation-timing-function:steps('+(sp.frames||6)+')"></i></div>'; }
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
    function catPose(id, pose, opt){ return pxSvg(POSE_M[pose]||M_CAT_SIDE_A, catPal(id), opt); }
    function coinSvg(opt){ return pxSvg(M_COIN, COIN_PAL, opt); }
    function cheeseCatSvg(opt){ return pxSvg(M_CHEESECAT, CHEESECAT_PAL, opt); }   // 🧀 치즈냥이 얼굴(거래 카테고리 아이콘 선택지)
    function goldSvg(opt){ return pxSvg(M_COIN, GOLD_PAL, opt); }
    // 🏪 알뜰샵 아이콘 — 은화(코인) 팔레트 기반 상점(스토어프론트): 줄무늬 차양(R/W) + 은색 몸체(S/A/D) + 은화 속 동물얼굴(E 눈·P 코)을 간판으로 유지. 더보기 '알뜰샵' 타일용.
    const M_SHOP = [
      '..KKKKKKKKKK..',
      '.KRWRWRWRWRWK.',
      '.KRWRWRWRWRWK.',
      '.KKKKKKKKKKKK.',
      'KSSSSSSSSSSSSK',
      'KSAAAAAAAAAASK',
      'KSAAEAAAAEAASK',
      'KSAAAAPPAAAASK',
      'KSAAAAAAAAAASK',
      'KSSSSSSSSSSSSK',
      'KSDDDDDDDDDDSK',
      'KSDDDAAAADDDSK',
      'KSDDDAAAADDDSK',
      'KKKKKKKKKKKKKK'
    ];
    const SHOP_PAL={K:'#6f7681',S:'#d6dbe1',A:'#4a4f57',D:'#a8afb8',E:'#d6dbe1',P:'#cf8f6c',R:'#e07a5f',W:'#f6ede2'};   // 은화 톤(COIN_PAL)+차양 두 색
    function shopSvg(opt){ return pxSvg(M_SHOP, SHOP_PAL, opt); }
    function eggSvg(stage, opt){ return pxSvg(stage>=2?M_EGG_C2:(stage>=1?M_EGG_C1:M_EGG), EGG_PAL, opt); }
    function boxSvg(opt){ return pxSvg(M_BOX, BOX_PAL, opt); }
    // 무지개알/무지개박스 — 기존 알/상자 도트에 움직이는 무지개 채색(반짝임은 CSS .fx-rainbow/.rb-thumb).
    function rainbowEggSvg(opt){ return pxSvg(M_EGG, EGG_PAL_RB, opt); }
    function rainbowBoxSvg(opt){ return pxSvg(M_BOX, BOX_PAL_RB, opt); }
    function rainbowEggStage(stage, opt){ return pxSvg([M_EGG,M_EGG_C1,M_EGG_C2][stage]||M_EGG, EGG_PAL_RB, opt); }
    // 3번째 탭: 크게 갈라진 알 + 틈새로 새어나오는 등급색 빛(L=등급색). rainbow면 껍질은 무지갯빛 유지.
    function eggCrackSvg(tierColor, rainbow, opt){ const pal=Object.assign({}, rainbow?EGG_PAL_RB:EGG_PAL, {L:tierColor||'#FBFBFD'}); if(rainbow) pal.X='RAINBOW'; return pxSvg(M_EGG_C3, pal, opt); }   // 무지개알 열 때: 테두리(X)까지 무지개색
    // 등급색을 흰빛 쪽으로 섞어 '연하게'(파스텔) — 오픈 순간 틈새 빛을 은은하게. hex(#rrggbb) 아니면 따뜻한 기본 빛.
    function softTier(hex){ if(typeof hex!=='string'||hex[0]!=='#'||hex.length<7) return '#fff3c8'; const p=i=>parseInt(hex.substr(i,2),16), m=v=>Math.round(v+(255-v)*0.55), h=v=>('0'+m(v).toString(16)).slice(-2); return '#'+h(p(1))+h(p(3))+h(p(5)); }
    // 🪺 10연차 둥지 v2 — 실제 밀짚 새둥지(낱가닥 짚이 겹겹이 쌓인 사발, 120×104). 둥글고 가로로 넓은 볼 + 삐죽 나온 지푸라기(불규칙 실루엣) + 안으로 파인 그늘(공간감). 알 10개는 TEN_POS 흩뿌림(비겹침). 앞테(M_NEST_FRONT)=아래쪽 바깥 짚 몇 가닥만 알 앞으로(살짝). 절차생성 scratchpad/nest_gen2.py, PIL 라이트/다크 검수.
    const M_NEST = [
      "................................................S...B..SB...................B...B.......................................",
      "..............................................SSB...H..SBDDDDDDDDDDDBSSS...BB..B........................................",
      ".........................................SS.SSBBD..BHDBSH.SSSDDSSSDSSDDDSDDSDSH.....B...................................",
      "......................................B.SBB.BBDDBBBHHDBSHSBBBBBSSSSHLSSSBSSSBSHD....B...................................",
      ".....................................BBSBBDDBSSHHHHHHSBSBBDDDDSSSBBBSLLBBSDDHSS.DD..SB..................................",
      "...............................B....BBBDSSSHHHSBSBHSHSSSSDBBSBSDDBSSBBBLSLLHBBDSSDDDB..B................................",
      "...............................B.BBBSSBSH.HHBLLLLLLSBBBBBLLLLB.SSSDDSSDHSHLHHHHHHBBSHDDB................................",
      "...............................HBBSHHBLLHLLLHSSSSSSBSSSSHBBHHHBBBSS..SSSSSHHHHHLLLBH...HDDD.............................",
      "...........................B..BBHSHSSSHHSSSSSBLLHHBBBSDDSDDSSSSSSHBSSBSDSSSSHSSHHHHHBLLH..DDD......B....................",
      ".........................BB.BBSBSHHHSSSSBLLSSLHHLHHSLDLDBHHHHHBDDSSDDDDHBHHHHHHLLSHSHHLH...DDDD....B....................",
      ".......................BB.DDBBSBBSSSSSLL.HHSHHSSBBBBBBSDDDDDDDDBBBBDSSSSSSSS...HHBBSS.HHHSHHHDDBBHH.....................",
      ".....................BB..DBBSSBSSSHSS.HHBSSBBBBBDDBBDDDDDDBDDDBDDDDBBBSSSBBHBBB.HHHBBS.BHHSSSSSBDH....BB................",
      "....................BB..DBSSBBS..LHHHHSSSSSSSSBHHSDDBBBBBBDBBBBDDDDDSSBBBBBBBBLBHHHB.BHD.BSSSSHHHDS.HH..................",
      "..................BB..DBBSBBL..HHLSHSSHHHHBBLSLBBBDDDDDDDDBHHBBBBBSSBBBBSDDBB.HHHLLHHBBHHSHSSSHSBSDHS......BB...........",
      ".................B...DBDDBSSHHHHSSBSLHSSSBLLSBBDDDDDDDDDSSSSSSBSSBBSSSSHBHSSBBBBBHHHHHBSBBSHBBSHSDHDBSS..SBSB...........",
      ".................B.DDBDDLSSHSSSSHSHHHBBBBBBSBDDDDDDBBSSSSSSSBBBBBBDDDDSSBBBSHHBHBBBBDHHBBHLSSHSSBS.DDBBBBSS.............",
      "................B.DBDDLLSSLSHHLHSHSSLSSSSSSSDDDBBBDSSBBBBBBBDDDBBSSDSSDiiSBBSSSHBBDBDB.HH.HBBSBSHBSSDDSSS...............",
      "...............B..BDLLSSSHSHHHHHSLSLSBBSLHDBDBDSSSBBBBBBBBBBBBBDDBBBBDDDDiiSBDBSSHHHBBBDDHH.HSSBLSHSBDSDDS..............",
      "...............BDBBL.LLLHSHLHSLSHHLSHLHHHSDDDSSiBBBBBBBBBBBBBBBBBBBBBBBBDiiiSSDDiSSSHBHDDBHB.HBBBLSHSBDD.BB.............",
      "..............BBBDSSSSSHHHHHLLHHSSSHHHSBSBDDDiBBBBBBBBBBBBBBBBBBBBBBBBBBBBiiiiSSDDSBBBHHDDB.H.HSBHSSHBBDD.DB............",
      ".............BBSDHLLSBLHHSHLSHHSH.BBBBBHBiiiBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBiiiSSSiSDBB.HDBB.HHHSBBSHLBSD.DDDHBB........",
      ".............BSDLLLSBLHSSHLSHHHSHBSBBHHBiiiBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBiiiiSSSiDBDSHDDDBHHHSBSSHLBBDDHHS..........",
      "............BSSSHLSBHHSH.SHHHSHHSBBiiiiiiiBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBiiiiiiiiDBDSHSDDBSHHSBBSHBLHHD.SS.........",
      "...........DBBSLHLBHLLSHSHHHHBDBBiiiiiiiiBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBiiiiiiiiDSSSDHSDDDHHSBBBHHLBBBB.BB.......",
      "...........BLSBSSLHSHHSSHHHSBBBHSiiiiiiiBBBBBBBBBBBBBBBBBiiiiiiBBBBBBBBBBBBBBBBBiiiiiiiiiDSSSSSSBDDBBBSBBHHBBHH.SS......",
      "..........BDLBHBSLHSHHH.BHLHBBHSiSSiiiiBBBBBBBBBBBBiiiiiiiiiiiiiiiiiiBBBBBBBBBBBBiiiiiiiiiDSSHSSSS.DDHBSSHHLLBDB..S.....",
      ".........SSLSHBSDSLSHSBBHLHSBSSiSSBiiiBBBBBBBBBBiiiiiiiiiiiiiiiiiiiiiiiiBBBBBBBBBBiiiiiiiiiDSSSHDBS..BSBSS.HBDDDB.BB....",
      ".........SHLBSSHSSHSHSBHHLSBSSiSSBiiiiBBBBBBBiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiBBBBBBBiiiiiiiiiiDSSSSDSD.DBBBSDHBLDDHH......",
      ".......DSHSBBLLHSHHSHBHHHSSSiiSSBiiiiBBBBBBiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiBBBBBBiiiiiiiiiiDDSSSHH..BBBBSDBBHHDB....BB",
      ".......SSLSHSLLHSHS.HSHSHSBiiSSBiiiiiBBBBiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiBBBBiiiiiiiiiiBDDBSSHD.DBSBBS.HHBBDBHHH..",
      ".......SHSBLLHHHHSSLHBSHBHSDSBBiiiiiBBBBiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiBBBBiiiiiiiiiiiSD.SHBB.DHBBSD.HLBSBH....",
      "......DSHBL.HHHSSSHHSHHBHSSSBiiiiiiiBBiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiBBiiiiiiiiiiiiS.BSDBB.BB.BBDBHS.D.....",
      "......HSHH..HHLHHHHSBHHSSBSBiiiiiiiBBiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiBBiiiiiiiiiiiSDDS.DDB.HSHSSBHDDDD....",
      "...B..HHSH.DHHHHLHSBHHSSBBBiiiiiiiiBiiiiiiiiiiiiiiiiikkkkkkkkkkkkkkiiiiiiiiiiiiiiiiiBiiiiiiiiiiiSDBDS..BBBBHBBSHSDD.....",
      "...BBHHSLH..HSSHHSLLHSSSBiiiiiiiiiiiiiiiiiiiiiiiiikkkkkkkkkkkkkkkkkkikiiiiiiiiiiiiiiiiiiiiiiiiiiSSBDDS.DBBDBHBSDSHDD....",
      "B.B.DSHHHLHLLHSHHLLHSSSBiiiiiiiiiiiiiiiiiiiiiiiikkkkkkikkkkkkkkkkkikkkkkiiiiiiiiiiiiiiiiiiiiiiiiiSDD...DD.BHBHBBDBDDD...",
      "B..BHHHS.H.LHHHHLLHHDSBiiiiiiiiiiiiiiiiiiiiiiikikkkkikkkkkkkkkkkkkkkikkkkkiiiiiiiiiiiiiiiiiiiiiiiiwDD..DD.BHBBDDBDHDD.BB",
      "B..D.SHHH.DLSHSLDHBDSBiiiiiiiiiiiiiiiiiiiiiiiikkkkkkkkkkkkkkkkkkkkikkkkkkkkiiiiiiiiiiiiiiiiiiiiiiiwSS.SSDD.HSDDDBHHSSSB.",
      "B..DSLSH..LLSSHSSSLDBwiiiiiiiiiiwwwwwwwkkkkikkkkkkkkikkkkkkkkkkkikkkkkkkkikkkkkkkwwwwiwwiiiiiiiiiiwwDSSSD..BSDSDDBHSD.B.",
      "H.DHSHHH.HHSHHHSSBHSwwiiiiiiiiiwwwwwwwkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkwwwwwwwiiiiiiiiiwwDwS.DD..DSDSBSHBHBB.",
      "HBDSHHHHHHLH.HLSBHHSwwiiiiiiiiiwwwwwwwkkkkkkkkkkikkkkkkkkkkkkkkkikkkkikkkkkkkkkkkkwwwiwwwiiiiiiiiiwwDDSBSS...DDBDBBHBBB.",
      "HBDSHHHHHDHH.LLBLSHSwwiiiiiiiiwwwwwwwkkkkikkkkkkkkikkkkkkkkkkkikkkkkkkkikkkkkkkkkkkiwwwwwwiiiiiiiiwwwDSBSSD..DDDSBHBDDBB",
      "HBD.HHSS.DHSHLHSHwHBwwwiiiiiiiwwwwwwwkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkwwwwwwwiiiiiiiwwwwDS.BDD..DDDBBSDBBBD",
      "SBHH.HSH.HHSHHSL.HHwwwwiiiiiiiwwwwwwkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkwwwwiwiiiiiiiwwwwwSS.SDD..DDBBSHHHB.",
      "SBH.HHSH.HHSHLLH.HDwwwwiiiiiiwwwwwwwkkkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkwwwwwwiiiiiiiwwwwwDD.BDD.BDBDDHHBHHH",
      "HBH.HHSHDHSSDLHSHHDwwwwiiiiiiwwwwwwkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkwwwiwwiiiiiiwwwwwwDDSBDDDBBDBHBBDDD",
      "BBHDHH.HDSSL.LHHHSwwwwwwiiiiiwwwwwwkkkkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkwiwwwwiiiiiwwwwwwwDDSBBSDDDDBBBBDDD",
      "SDH.SH.H.HSSLHHSBDwwwwwwiiiiiwwwwwwkkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkiwwwwwwiiiiiwwwwwwwD.SBBSD.DBBDBDDDD",
      "S..HSHHH.HSSHHHSSwDwwwwwwiiiiwwwwwwkkkkkikkkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkwiwwwwwiiiwwwwwwwwD.SBB.D.DSSHBDDBD",
      "BBBSSSH..HSSLLHDDwDBwwwwwiiiwwwwwwwkkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkiwwwwwwwiiiwwwwwwwwD.BSB.DSDSSDBDDDD",
      "BSBLSH..HHSLSLSBDwDBwwwwwwiiwwwwwwkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkikkkkkkkkkkkikkkwwwwwiiiwwwwwwwwww.BBB..SDBBD.DSDD",
      ".BBLSH..HSSL.SHDSwDwwwwwwwiiwwwwwwkkkkikkkkkkkkikkkkkkkkkkkikkkkkkkkikkkkkkkkkkkkkkkkkwwwiwwiiwwwwwwwwww..BB..BDBBD.BSDD",
      ".SBLHHH.HSSLLSBDSBDwwwwwwwwiwwwwwwwkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkikkwwiwwwwiwwwwwwwwwww..SB..BBDHD.BSDB",
      "SSSHSHH.HSHLLBBSBSDwwwwwwwwiwwwwwwwkkkikkkkikkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkwwwwwwwiwwwwwwwwwww.BS.BDBBBBD.BSDB",
      ".SHSSHH.HHLLHDSDBSDwwwwwwwwwiwwwwwwkikkkkkkkkikkkkkkkkkkkikkkkkkkkikkkkkkkkkkkikkkkkkwwiwwwiwwwwwwwwwwwwDBBSBDBBDBDDBBDB",
      ".SHB.HH.HHHSB.BSBSDwwwwwwwwwwwwwwwwkkkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkiwwwwwwwwwwwwwwwwwwDBBSSSBBDBDDBSDD",
      "DSHSDHSHH.SB..BSSBDwwwwwwwwwwwwwwwwkkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkikwwwwwwwwwwwwwwwwwwwDDBSSSDSBHD.BBDD",
      "HSHB.HHSHD.BSSBLSwDwwwwwwwwwwwwwwwwwkkkikkkkkkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkwiwwwwwwwwwwwwwwwww.D.BSSDBDBSDDBDBD",
      "SHSD.HH.HB.BSSBBDBDwwwwwwwwwwwwwwwwwkkkkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkiwwwwwwwwwwwwwwwwwwDDD.BSSDBDHBD.DDDD",
      "BSS..HH.SSDSSSBHBDDwwwwwwwwwwwwwwwwwwkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkikwwwwwwwwwwwwwwwwwwwDD.BSSDSDDHBD.DDBD",
      ".BHS.SHDSS.SSBBHBDwwwDwwwwwwwwwwwwwwwikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkikkkwwwwwwwwwwwwwwwwwwwDD.BBBDDBBSDB.DBBD",
      ".BSSS.H.SSBHSSBBHDDwwDwwwwwwwwwwwwwwwwkkkkkkikkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkiwwwwwwwwwwwwwwwwwwwwDDBSDSSBB.SBBDDDBD",
      ".SBSSDSSSSBLBSBBH.wDDDwwwwwwwwwwwwwwwikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkikkwwwwwwwwwwwwwwwwwwwDDBS..SDBD.HBSSSSSB",
      "BBSSS.SS.SSBHSSSLH.wDDwwwwwwwwwwwwwiwwwkkkkkikkkkkkkkkkkikkkkkkkkikkkkkkkkkkkikkkwwwwwiwwwwwwwwwwwwwDDDSD.DBSB.SHBDDDDDH",
      "..SHHDSSD.SLBBSSBHSwDwwwwwwwwwwwwiwwwwwwkkikkkkkkkkkkkkkkkkkkkkikkkkkkkkkkkkkkkkwwwwiwwwwwwwwwwwwwwDDDDBBD.SBBBSDD.DDDD.",
      "BHBHH.SS...SHHBSBBS.DwwwwwwwwwwwwwwwwwwwikkkkkkkkkkkkkkkikkkkikkkkkkkkkkkkkkkikwwwwwwwwwwwwwwwwwwwwDDDD.D.BSBBBBDDDDBDD.",
      "..BBB.SS.D.SHBHSSLBBDwwwwwwwwwwwwwwwwwwwwwkkkkkkkkkkkkikkkkkkkkkkkkkkkkkkkkikkwwwwwwiwwwwwwwwwwwwwDD.DDBDBDSBBSHBDDBDDD.",
      "..BDBBSSS..SSDBBSLSDBDwwwwwwwwwwwwwwwwwwiwwwkkkkkkkkikkkkkkkkikkkkkkkkkkkikkwwwwwwiwwwwwwwwwwwwwwwDDDBBDDBDDBSBHBDBDD...",
      "...BDBBSS..BH.BBHLBS.DDwwwwwwwwwwwwwwwiwwwwwwkkkkkkkkkkkkkkikkkkkkkkkkkkkkkwwwwwiwwwwwwwwwwwwwwwwDDD.BBSBDDDSSHBBDBBB...",
      "...BBBBSS..BHSSBBSLHS.DwwwwwwwwwwwwwwwwwwwwwwwwkkkkkkkkkkikkkkkkkkkkkkkkkiwwwwwwwwwwwwwwwwwwwwwwwDDDB.BBDDSBBBBHDDBDD...",
      "....BBBBS.D.BHSSSSHLBHSDwDwwwwwwwwwwwwiwwwwwwwwwwkkkkkkkkkkikkkkkkkkkkkwwwwwwwwwiwwwwwwwwwwwwwwwDDSBBBBBBDSBBBBBDDSBB...",
      ".....BBBBS.DBB.SSBSLLHSBDDDwwwwwwwwwwwwwwwwwwwwwwwwwkkkkkikkkkkkkkkkwwwwwwwwwwiwwwwwwwwwwwwwwwwDDSBBBSBBBSSSSBHDDBDDD...",
      ".....B.BBSS.DBHDSSSHBLHSSwDDwwwwwwwwwwwwwwwwwwwwwwwwwwwiwwwwwwwwwwwwwwwwwwwwiwwwwwwwwwwwwwwwwDDDBSDDSBBB.SDBBBHD.BDD....",
      "......BBBBBSDBBBSSSBSLLBSSwDDwwwwwwwwwwwwwwwwwwwwwwwwiwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwDDDDDDDDSSBSDBSBBBBH.DDDD....",
      "..BBSSSSSSSSSDBHBSSBHBHLBSSwDDwwwwwwwwwwwwwwwwwwwwwwwwwiwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwDDDwDDDHBDSDSBSDSBSBDH.BDDD....",
      ".......DBBBBSDB.HBBSHBBSLSSSwwDwwwwwwwwwwwwwwwwwwwwwwiwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwDwBDBDBBDSSDBSBSBBBDD.SDD......",
      ".........BBDBSBD.HSBSHBHBSSSSDwDwwwwwwwwwwwwwwwwwwwiwwwwwwwwiwwwwwwwwwwwwwwwwwwwwwwwwwwwwBDDDDDHDDDBDSSDBBBBD.SBB.......",
      "........DDBBBB.B.DSHSSHBHBSSBSDwDwwwwwwwwwwwwwwwwwwwwwwwwwiwwwwwwwwwwwwwwwwwwwwwwwwwwwwwDDDDDHHSSDHDSSSBBBSBDSB.........",
      "..........DBBBSS.DSSHBSSHBLLDDSDBDwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwBBDDDBBDSDSBSSBBBBBBBDS..D.......",
      "..........DBBBSSB.BSHBBHSHLHSSDSSwDwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwBBDDHHBSSSHDBDBBBBBBBDS.D.........",
      "..........SSBBBBSBBBSHSHSHBLHBSSSBSDwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwDDBBHDSDHBDSDDBBBSBBDD.D..........",
      "........BB..DDBSSSSBSSHBSHHHBHBSBDBDDSwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwDBDBHBDSHBSBBDDBDBSDDSB............",
      ".............DDBBSSBSBSHSSHHHBHHSBSBDwSSwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwBDBDHBBDSDSDDSDSSBDSBDD.B............",
      "..............DDBBBSSSBHSHSDSHBLBBBDBDDBSSSwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwBBBBBSSSSDBBBSSHDBBDDBDDBSBBD...............",
      "..............DBDBBBSSBSSHHS.DDBBBDBBBDDBwwSSSwwwwwwwwwwwwwwwwwwwwwwwwwwDDDDDDSDDDDDHHHDDBSSBDDDBD.SSB.D................",
      "...............BDDBBBSBBBHSHSDDSHHLSDBBBBBB.wwSBBBBwwwwwwwwwwwwwwwwwDDDDSDDDDDDDDBDDHBDBDDHSDDBSDBSSBB.D................",
      ".................DDDBSBBBBSSSH.DSSBHLSDDDBLHDBBBBBBBBwwwwwwwwwwwwwBBBSDDDDDDDBBBBH.HBDBDSDDDDBDBBSSHBDD.................",
      "..................DDDBBBSBBHSSSHDDSBHHSSLLLLLLSSSSSS.BBBBBBHBBBBBBBHHDDDSDDBDDDDHBBBDSBSHSBBSBBBBDDSHH..................",
      "....................DDDBBBBBBSSSH.DBBBS.LSSSDLLLLDSSSDSBSSSBBBHDDDBDDDDBBBBBBDHHDBBBSSSHSBBBBBDBB.DBBH..................",
      "......................DDDSBBBHBSSSDDBBBBBBBLLDLDDDBBBSBBBBSSBSSSSSSDBBBBBBBBBSSBBBSSHBDSBBBBDDBDDDSD..BB................",
      ".......................DDSSBBHHSBBSDDSSSSSSSSSLLLLSSSDDHSHHHHSSSSSSSSSSSSSSSBSSBDDDBBBSSBSDDDBDSDDDS....................",
      "........................DSBBBBBBSSSSSBBBSSBDDSDSSSSSSSSSSSSSHSSSSBBBBBBBSBDDBDDDBBSSSSDBSDDDBSDD.D.S....................",
      ".......................SS.DBBBBDBBHDDSBBSSSSSBBDDSSSSSSSSSSDDSSSSBSBDDDDDSSSSDSSSSSHBDBDDBHSSD.S.D..B...................",
      "......................B...DDDBDDBBBSHDDBBDBBSSSSSSSSBSSSLLLSSBHDDBBSDDSSSSBDDDSDDDDDDBBHHDB.DDD.B...B...................",
      "...........................DBDDDDDBBBSSSDBD.BSBSSHHBBBBBHHHHHHBSSSSSSSSSBDDDSDDDSHHBBBBDDDDD....B.......................",
      "...........................BD.DBSDDDDBBSSSSSBBBBSBSSSSHHSSBBBSSSSSSSDDDDDSSSDBHHBBBDDD.DDD..............................",
      "..............................BSDSB.DDDBBSBSSLSSSSSSSSSSSSSSHDDSDDDDDSSBBDHSBSBBBDDDDDDDD...............................",
      "..............................BB.DSSSDDDBDDBBBBBBBBLLHSBBLLSSSSDDDDDBBBHBBSBBBBDDSD.DDDDD...............................",
      ".............................B.......SSSSDDDDDBBBBBBBBDHHBBDBBDDSDBSSSHSSSDDDDDDDDDDDD..................................",
      ".............................B..........SSSSSSSSDDDSDSBBBBDDDSSBSSSBSDDBBDDBBDDD.DDDD...................................",
      "........................................B..DDDDDDDBBBDSSSBDDBBBDDDDDBBDDDDDDDDDDDD......................................",
      ".......................................B...DDDDDDDDDDDBSSSDDDDDDDDBDDDDDDD.DDD..........................................",
      "............................................DDDDDDDDDDDDDDDDDDBBBBDDDD..D..S............................................",
      "........................................................DDDDDDDDDD.........B............................................"
    ];
    // 앞테(near rim) — 아래쪽 바깥 짚 일부만: 앞줄 알을 살짝 스쳐 사발에 담긴 느낌(z가 알보다 위). 좌표는 M_NEST와 동일.
    const M_NEST_FRONT = [
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      "........................................................................................................................",
      ".....BBBBS..BB.SSBSLLHSB.........................................................................SBBBSBBBSSSSBH..B......",
      ".....B.BBSS..BH.SSSHBLHSS.......................................................................BS..SBBB.S.BBBH..B......",
      "......BBBBBS.BBBSSSBSLLBSS.........................................................................SSBS.BSBBBBH.........",
      "..BBSSSSSSSSS.BHBSSBHBHLBSS.....................................................................HB.S.SBS.SBSB.H.B.......",
      "........BBBBS.B.HBBSHBBSLSSS...............................................................B.B.BB.SS.BSBSBBB...S........",
      ".........BB.BSB..HSBSHBHBSSSS............................................................B.....H...B.SS.BBBB..SBB.......",
      "..........BBBB.B..SHSSHBHBSSBS...............................................................HHSS.H.SSSBBBSB.SB.........",
      "...........BBBSS..SSHBSSHBLL..S.B......................................................BB...BB.S.SBSSBBBBBBB.S..........",
      "...........BBBSSB.BSHBBHSHLHSS.SS.....................................................BB..HHBSSSH.B.BBBBBBB.S...........",
      "..........SSBBBBSBBBSHSHSHBLHBSSSBS.....................................................BBH.S.HB.S..BBBSBB..............",
      "........BB....BSSSSBSSHBSHHHBHBSB.B..S................................................B.BHB.SHBSBB..B.BS..SB............",
      "...............BBSSBSBSHSSHHHBHHSBSB..SS...........................................B.B.HBB.S.S..S.SSB.SB...B............",
      "................BBBSSSBHSHS.SHBLBBB.B..BSSS.................................BBBBBSSSS.BBBSSH.BB..B..BSBB................",
      "...............B.BBBSSBSSHHS...BBB.BBB..B..SSS................................S.....HHH..BSSB...B..SSB..................",
      "...............B..BBBSBBBHSHS..SHHLS.BBBBBB...SBBBB.....................S........B..HB.B..HS..BS.BSSBB..................",
      "....................BSBBBBSSSH..SSBHLS...BLH.BBBBBBBB.............BBBS.......BBBBH.HB.B.S....B.BBSSHB...................",
      ".....................BBBSBBHSSSH..SBHHSSLLLLLLSSSSSS.BBBBBBHBBBBBBBHH...S..B....HBBB.SBSHSBBSBBBB..SHH..................",
      ".......................BBBBBBSSSH..BBBS.LSSS.LLLL.SSS.SBSSSBBBH...B....BBBBBB.HH.BBBSSSHSBBBBB.BB..BBH..................",
      ".........................SBBBHBSSS..BBBBBBBLL.L...BBBSBBBBSSBSSSSSS.BBBBBBBBBSSBBBSSHB.SBBBB..B...S...BB................",
      ".........................SSBBHHSBBS..SSSSSSSSSLLLLSSS..HSHHHHSSSSSSSSSSSSSSSBSSB...BBBSSBS...B.S...S....................",
      ".........................SBBBBBBSSSSSBBBSSB..S.SSSSSSSSSSSSSHSSSSBBBBBBBSB..B...BBSSSS.BS...BS.....S....................",
      ".......................SS..BBBB.BBH..SBBSSSSSBB..SSSSSSSSSS..SSSSBSB.....SSSS.SSSSSHB.B..BHSS..S....B...................",
      "......................B......B..BBBSH..BB.BBSSSSSSSSBSSSLLLSSBH..BBS..SSSSB...S......BBHH.B.....B...B...................",
      "............................B.....BBBSSS.B..BSBSSHHBBBBBHHHHHHBSSSSSSSSSB...S...SHHBBBB.........B.......................",
      "...........................B...BS....BBSSSSSBBBBSBSSSSHHSSBBBSSSSSSS.....SSS.BHHBBB.....................................",
      "..............................BS.SB....BBSBSSLSSSSSSSSSSSSSSH..S.....SSBB.HSBSBBB.......................................",
      "..............................BB..SSS...B..BBBBBBBBLLHSBBLLSSSS.....BBBHBBSBBBB..S......................................",
      ".............................B.......SSSS.....BBBBBBBB.HHBB.BB..S.BSSSHSSS..............................................",
      ".............................B..........SSSSSSSS...S.SBBBB...SSBSSSBS..BB..BB...........................................",
      "........................................B.........BBB.SSSB..BBB.....BB..................................................",
      ".......................................B..............BSSS........B.....................................................",
      "..............................................................BBBB.........S............................................",
      "...........................................................................B............................................"
    ];
    const NEST_PAL={ X:'#4a361e', D:'#785830', B:'#aa8248', S:'#cba262', H:'#e0be84', L:'#f0d8a6', w:'#584024', i:'#785c34', k:'#604828' };   // 외곽·그림자갈·기본짚·밝은짚·하이라이트·최고광 / 내벽그림자·내부바닥(중간/어둠)
    function nestSvg(opt){ return pxSvg(M_NEST, NEST_PAL, opt); }
    function nestFrontSvg(opt){ return pxSvg(M_NEST_FRONT, NEST_PAL, opt); }
    // 🥚 10연차 알 흩뿌림 위치(둥지 구멍 안, 비겹침·시드 고정). [left%, top%] — 배열 순서=위→아래(뒤→앞 z). 표시 폭은 CSS `.ten-egg{width:13%}`와 맞춤.
    const TEN_POS=[[66.3,27.7], [38.5,28.4], [55.2,34.9], [28.1,41.8], [40.5,47.0], [78.9,53.5], [53.1,54.9], [65.5,60.9], [31.3,69.1], [51.6,72.5]];
    // 픽셀 껍질 조각 렌더(A=큰 곡면, B=삼각, C=작은 조각). rainbow면 무지갯빛 껍질.
    // 🌱 뜰알(한정 픽업) — 로그인 메인 아이콘(egg-garden.svg)의 '고양이 얼굴 알' + 뜰(풀밭·흙) 픽셀. 무지개는 rainbowArcSvg 재사용.
    const M_DDEUL=[   // 🥚 뜰알(24×31) — 둥근 계란형(4톤 명암 I·W·S·D + X외곽). 검은 고양이: 귀는 '위로' 향한 둥근 돔형+안쪽귀 음영 H, 눈은 회색 1px(E, 안쪽으로 붙임), 입은 멍때리며 벌린 4px(윗입술 P·안쪽 어둠 Q·양옆 음영 q). 하단+우측하단은 '실루엣까지' 흙(o/R/r/n 4톤)·이끼(m/G/g 3톤)가 섞여 덮이고, 이끼는 우측을 타고 오름. 알 위 꽃 한 송이(F/f/C·Y·t/T).
      "...........fCf..........","...........CYC..........","...........fCf..........","............t...........","...........tT..........",
      "..........XXXX..........","........XXXXXXXX........",".......XXIIIIWWXX.......","......XIIIIIWWWWWX......",".....XIIIIIWWWWWWSX.....",
      "....XXIIIIWWWWWWSSXX....","....XIIIIWWWWWWSSSSX....","...XIIIIWWWWWWWSSSSSX...","...XIIIIWWWWWWSSSSSSX...","..XIIIBBBWWWWSSBBBSSSX..",
      "..XIIIBBHBWWSSBHBBSSDX..","..XIIBBBBBBBBBBBBBBDDX..","..XIWBBBBBBBBBBBBBBDDX..",".XIIWHBBBBBBBBBBBBHDDDX.",".XIWWBBBBEBBBBEBBBBDDDX.",
      "..XWWBBBBBBBBBBBBBBggg..","..XWWBBBBBBBBBBBBBBggg..","..XWWWBBBBqPPqBBBBgggg..","..XWWWBBBBqQQqBBBBgggg..","...XWSSBBBBBBBBBBgggg...",
      "...XSSSSBBBBBBBBggggg...","....XSSSSSBBBBRRgggg....","....XnRRRRRRRRggRggg....",".....nnRRrrrrrggrgg.....","......nnrrrrrgrrgg......",
      "........ngnnngnn........"];
    const DDEUL_PAL={X:'#8d8368',D:'#d8d0bd',S:'#eae3d2',W:'#f7f3ea',I:'#fffef8',B:'#2b2b31',H:'#45454f',E:'#9a9aa4',P:'#f2a0b4',Q:'#7a3a48',q:'#b56576',R:'#9c6a3c',r:'#6f4a25',o:'#b3844e',n:'#523118',G:'#5aa63c',g:'#3f7a2c',m:'#8ed46f',F:'#f9b9d0',f:'#ef8fb4',C:'#ff9ec2',Y:'#ffe06a',t:'#4e9636',T:'#3f7a2c'};
    function ddeulEggSvg(opt){ return pxSvg(M_DDEUL, DDEUL_PAL, opt); }
    // 🌸 뜰알 FX 분리 렌더 — 오픈 연출에서 '꽃'과 '알 몸통'을 따로 그려, 알이 흔들릴 때 꽃이 줄기에서 더 크게 흔들리게(CSS .fx-ddflower). 몸통=꽃 뺀 알(M_DDEUL 5행부터).
    const M_DDEUL_FLW=[".fCf.",".CYC.",".fCf.","..t..","..T.."];
    const M_DDEUL_BODY=M_DDEUL.slice(5);
    function ddeulFxHtml(){ return '<span class="fx-ddflower">'+pxSvg(M_DDEUL_FLW, DDEUL_PAL)+'</span><span class="fx-ddbody">'+pxSvg(M_DDEUL_BODY, DDEUL_PAL)+'</span>'; }
    const SHELL_PAL={X:'#8d8368',I:'#fffef8',W:'#f7f3ea',S:'#e6dfce'};   // 껍질 조각도 알과 같은 크림 4톤(I 하이라이트·W·S + X 테두리)
    const SHELL_PAL_RB={X:'#8d8368',I:'RAINBOW',W:'RAINBOW',S:'RAINBOW'};
    function shellSvg(which, rainbow, opt){ const M=[M_SHELL_A,M_SHELL_B,M_SHELL_C][which]||M_SHELL_A; return pxSvg(M, rainbow?SHELL_PAL_RB:SHELL_PAL, opt); }
    // ✦ 픽셀 빛 폭발(별) — 등급색으로. color 미지정 시 currentColor(무대 등급색 상속).
    function raysSvg(color, opt){ return pxSvg(M_RAYS, {X:color||'currentColor',H:'#ffffff'}, opt); }
    function auraSvg(color, opt){ return pxSvg(M_AURA, {X:color||'currentColor',H:'#ffffff'}, opt); }
    function spark4Svg(color, opt){ return pxSvg(M_SPARK4, {X:color||'currentColor',H:'#ffffff'}, opt); }   // 뽑기 트윙클용(색 지정 4점 별). 아이콘용 sparkSvg(opt)와 구분.
    // 층층 픽셀 빛: 은은한 오오라 + 서로 반대로 도는 광선 2겹(그냥 회전만 하지 않고 맥동·역회전으로 살아있게). 색은 currentColor(등급색) 상속.
    function lightLayers(o){ o=o||{}; const a=o.aura||200, r=o.rays||240, c=o.rainbow?'RAINBOW':'currentColor';   // rainbow=true면 빛 자체가 움직이는 무지개(한정 전용)
      return '<span class="ll-aura">'+auraSvg(c,{h:a})+'</span>'+
             '<span class="ll-rays a">'+raysSvg(c,{h:r})+'</span>'+
             '<span class="ll-rays b">'+raysSvg(c,{h:Math.round(r*0.72)})+'</span>'; }
    // 펫 주변을 도는 트윙클 도트 — 등장 후 펫 둘레에 은은히 깜빡이며 흩뿌려짐(등급색).
    function fxAuraTwinkles(n, rainbow){ n=n||6; let s=''; const cc=rainbow?'RAINBOW':'currentColor';
      for(let i=0;i<n;i++){ const a=(i/n)*360+Math.random()*24, d=52+Math.random()*30;
        const x=Math.round(Math.cos(a*Math.PI/180)*d), y=Math.round(Math.sin(a*Math.PI/180)*d);
        const h=12+Math.round(Math.random()*8), del=(Math.random()*1.1).toFixed(2), du=(1.1+Math.random()*0.7).toFixed(2);
        s+='<span class="fx-tw" style="--tx:'+x+'px;--ty:'+y+'px;animation-delay:'+del+'s;animation-duration:'+du+'s">'+spark4Svg(cc,{h:h})+'</span>'; }
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
    // 애정 레벨업 "UP!" 픽셀 텍스트 — 코너를 깎은 둥글둥글 버블 글리프(연한 분홍). W=본체·L=광택 하이라이트. 캠에서 하트 옆에 두둥 팝.
    const M_UP = [
      ".W..W....WWWW...WW",
      "LW..LW..LW..WW..LW",
      "WW..WW..WW..WW..WW",
      "WW..WW..WWWWW...WW",
      "WW..WW..WW......WW",
      "WW..WW..WW........",
      "WWWWWW..WW......WW",
      ".WWWW...WW......WW"
    ];
    const UP_PAL={W:'#ff9ec9',L:'#ffd6ec'};   // 연한 분홍 + 밝은 광택
    function upSvg(opt){ return pxSvg(M_UP, UP_PAL, opt); }
    // ⭐ 별(대표 방 즐겨찾기) 픽셀 아트 — S=몸체(골드)·H=하이라이트. opt.off=회색(미지정 방). 좋아요 하트와 같은 톤·연출 패턴.
    const M_STAR = [
      '.....S.....',
      '....SSS....',
      '...SSHSS...',
      '.SSSSSSSSS.',
      '..SSSSSSS..',
      '...SSSSS...',
      '...SSSSS...',
      '..SSS.SSS..',
      '..SS...SS..',
      '.SS.....SS.',
      '.S.......S.'
    ];
    const STAR_PAL={S:'#f7c045',H:'#ffe9ad'}, STAR_PAL_OFF={S:'#c4cad3',H:'#dde1e7'};
    function starSvg(opt){ opt=opt||{}; return pxSvg(M_STAR, opt.off?STAR_PAL_OFF:STAR_PAL, opt); }
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
    // 🔔 알림 종(픽셀) — 디테일 종: 링 손잡이(구멍) + 둥근 어깨 + 세로 몸체 + 플레어 림(D) + 클래퍼. 좌상단 하이라이트(H)·우측 그림자(S)로 입체감, 외곽선(K). 세로가 길어 '찌부' 안 됨(15×18). 소식 타일·설정 '알림'·소식 헤딩·푸시 토스트 공용.
    const M_BELL = [
      '......KKK......',
      '......K.K......',
      '......KBK......',
      '.....KHBSK.....',
      '....KHHBSSK....',
      '...KHHBBBSSK...',
      '..KHHBBBBSSSK..',
      '.KHHBBBBBSSSSK.',
      '.KHBBBBBBSSSSK.',
      '.KHBBBBBBSSSSK.',
      '.KBBBBBBBSSSSK.',
      '.KBBBBBBBSSSSK.',
      '.KBBBBBBBSSSSK.',
      'KDDDDDDDDDDDDDK',
      'KDDDDDDDDDDDDDK',
      '.KKKKKKKKKKKKK.',
      '......HBD......',
      '......DDD......'
    ];
    const BELL_PAL={K:'#8a5a12',D:'#c9881f',B:'#f7c045',H:'#ffe9ad',S:'#df9f2b'};
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
    // 🌈 "NEW" 배지 — 처음 획득한 펫/아이템 뽑기 등장 시 위에 띄우는 디테일 픽셀 글자.
    //   굵은 베벨 글자: 본체 X=움직이는 무지개(pxSvg 'RAINBOW' 수직 스크롤 애니), 상/좌=하이라이트 H, 하/우=그림자 D, 외곽선 O로 명암(입체감)을 살림.
    //   세 글자 모두 16행이라 h로 크기를 맞추면 칸 크기·정렬이 동일. 글자별로 물결처럼 위아래로 흔들린다(.fx-new-ch, CSS fxnewbob).
    const M_LN=[   // N (13×16)
      ".OOOO....OOO.","OHHHHO..OHHHO","OHXXXHO.OHXDO","OHXXXDO.OHXDO","OHXXXXHOOHXDO","OHXXDXDOOHXDO",
      "OHXDOHXHOHXDO","OHXDOOHDOHXDO","OHXDOOHXHXXDO","OHXDO.OHXXXDO","OHXDO.OHXXXDO","OHXDO..OHXXDO",
      "OHXDO..OHXXDO","OHXDO...OHXDO","OHDDO...OHXDO",".OOO.....OHDO"];
    const M_LE=[   // E (12×16)
      ".OOOOOOOOOO.","OHHHHHHHHHHO","OHXXXXXXXXDO","OHXXDDDDDDDO","OHXDOOOOOOO.","OHXDOOOOOO..",
      "OHXXHHHHHHO.","OHXXXXXXXDO.","OHXXDDDDDDO.","OHXDOOOOOO..","OHXDO.......","OHXDOOOOOOO.",
      "OHXXHHHHHHHO","OHXXXXXXXXDO","OHDDDDDDDDDO",".OOOOOOOOOO."];
    const M_LW=[   // W (17×16)
      ".OOO...........OO","OHHHO.........OHH","OHXXHO.......OHXD","OHXXDO.......OHXD","OHXXDO.......OHXD",".OHXXHO.OOO.OHXXD",
      ".OHXXDOOHHHOOHXXD",".OHXXDOOHXDOOHXXD","..OHXXHHXXXHHXXDO","..OHXXXXXXXXXXXDO","...OHXXXXXXXXXDO.","...OHXXXXXXXXXDO.",
      "...OHXXXXXXXXXDO.","....OHXXO.OXXDO..","....OHXXO.OXXDO..","....OHDDO.OHDDO.."];
    const NEW_PAL={O:'#241d38',X:'RAINBOW',H:'#ffffff',D:'#553a86'};
    function newBadgeSvg(opt){ opt=opt||{}; const h=opt.h||30;
      const chs=[M_LN,M_LE,M_LW].map((m,i)=>'<span class="fx-new-ch" style="--i:'+i+'">'+pxSvg(m,NEW_PAL,{h:h})+'</span>').join('');
      return '<div class="fx-new" aria-hidden="true">'+chs+'</div>'; }
    // 🌈 픽셀 무지개 아치(한정 픽업 배너용) — 바닥 중앙 기준 7밴드 동심원 아치(빨~보 6색 + 안쪽 연한 흰띠로 결 살림). 넓고 길게. 연하게는 CSS opacity로.
    function rainbowArcSvg(opt){ opt=opt||{}; const cols=opt.cols||41, rows=opt.rows||15;
      const RB=['#F04452','#F0883C','#F2C84B','#2FAE7A','#3182F6','#9B6FC8','#eef4ff'], cx=(cols-1)/2, R=rows, t=R/7; let r='';
      for(let y=0;y<rows;y++) for(let x=0;x<cols;x++){ const dx=x-cx, dy=(rows-0.4-y); if(dy<0) continue;
        const d=Math.sqrt(dx*dx+dy*dy), band=Math.floor((R-d)/t); if(band>=0&&band<7) r+='<rect x="'+x+'" y="'+y+'" width="1.05" height="1.05" fill="'+RB[band]+'"/>'; }
      const wh=opt.h?('height="'+opt.h+'"'):(opt.w?('width="'+opt.w+'"'):'');
      return '<svg class="px '+(opt.cls||'')+'" viewBox="0 0 '+cols+' '+rows+'" '+wh+' shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet">'+r+'</svg>'; }
    // 🌈 로그인 화면(auth-sky.svg)의 무지개 — 가로로 길고 라운드한 파스텔 아치를 그대로 추출(구름에 가린 오른쪽은 왼쪽 대칭으로 채움). 픽업 배너·뜰알 FX 공용.
    const M_AUTHRB=[
      "...................RRRRRRRRRRR...................","................RRROOOOOOOOOOORRR................",".............RRROOOOYYYYYYYYYOOOORRR.............","...........RROOOYYYGGGGGGGGGGGYYYOOORR...........",
      "..........RROOYYGGGGBBBBBBBBBGGGGYYOORR..........",".........ROOYYGGBBBBPPPPPPPPPBBBBGGYYOOR.........",".......RROYYGGBBBPPPP.......PPPPBBBGGYYORR.......","......RROYYGGBBPP...............PPBBGGYYORR......",
      ".....RROYYGBBPP...................PPBBGYYORR.....",".....ROYGGBPPP.....................PPPBGGYOR.....","....ROYYGBPP.........................PPBGYYOR....","...ROYYGBPP...........................PPBGYYOR...",
      "..RROYGBPP.............................PPBGYORR..","..ROYGGBP...............................PBGGYOR..",".ROOYGBPP...............................PPBGYOOR.",".ROYGBBP.................................PBBGYOR.",
      ".ROYGBP...................................PBGYOR.","ROYGBBP...................................PBBGYOR",".OYGBP.....................................PBGYO.","....BP.....................................PB...."];
    const AUTHRB_PAL={R:'#eaa6ad',O:'#f3c79c',Y:'#f2e3a2',G:'#aeddb9',B:'#a9c8ef',P:'#c4aede'};
    function authRainbowSvg(opt){ return pxSvg(M_AUTHRB, AUTHRB_PAL, opt); }
    // 🌳🌸☁️ 한정 픽업 배너 씬 픽셀 에셋(구름·나무·꽃·풀) — 전부 pxSvg(crispEdges) 도트. 팔레트에 없는 글자는 투명.
    const M_CLOUD1=[".....HHHHHH.....","...HHWWWWWWHH...","..HWWWWWWWWWWH..",".HWWWWWWWWWWWWH.","HWWWWWWWWWWWWWWH","WWWWWWWWWWWWWWWW",".SSSSSSSSSSSSSS."];
    const M_CLOUD2=["...HHHH...",".HHWWWWHH.","HWWWWWWWWH","WWWWWWWWWW",".SSSSSSSS."];
    const M_CLOUD3=["..HHH..",".HWWWH.","WWWWWWW",".SSSSS."];
    const CLOUD_PALS={w:{W:'#ffffff',H:'#eef6ff',S:'#d3e4f3'},p:{W:'#fff2f8',H:'#ffe9f2',S:'#f2cfe0'},b:{W:'#f0f8ff',H:'#e4f1ff',S:'#cfe2f5'}};
    function cloudSvg(which,tint,opt){ const M=[M_CLOUD1,M_CLOUD2,M_CLOUD3][which]||M_CLOUD1; return pxSvg(M, CLOUD_PALS[tint||'w'], opt); }
    // 활엽수: 둥근 캐노피(H하이라이트/L기본/l중간/D그림자/X외곽, 클럼프 음영) + 트렁크(T/w/t 나뭇결) 분리(캐노피만 바람에 살랑)
    const M_TREETOP=["....HHH......","..HHLLLHH....",".HLLLLLLLH...","HLLLLLLlLLH..","HLLHLLLllLDH.","HLLLLLllllLDH",".HLLLlllllDDH",".HLLLllllDDD.","..HLLllDDDD..","...XLllDDX...","....XXDX....."];
    const M_TRUNK=[".TTt.",".Twt.",".Twt.","TTwtt"];
    const TREE_PAL={T:'#6e4426',w:'#875733',t:'#543216',L:'#5bb85b',l:'#4a9f4a',H:'#86d67f',D:'#2f7a38',X:'#245c2c'};
    // 침엽수(3단 삼각) — 눈빛 하이라이트(H)+음영(l/D)+나뭇결 기둥. 원근 뒤쪽용
    const M_PINE=["....H....","...HLD...","...LLl...","..HLLLD..","..LLLll..",".HLLLLlD.",".LLLLlll.","HLLLLLllD","LLLLLllll","..LLll...","...TT....","...Tt...."];
    const PINE_PAL={H:'#8fe08a',L:'#4aa85a',l:'#347a44',D:'#245c34',T:'#6e4426',t:'#543216'};
    function treeTopSvg(opt){ return pxSvg(M_TREETOP, TREE_PAL, opt); }
    function trunkSvg(opt){ return pxSvg(M_TRUNK, TREE_PAL, opt); }
    function pineSvg(opt){ return pxSvg(M_PINE, PINE_PAL, opt); }
    const M_FLOWER=[".P.P.","PCPCP",".PCP.","..S..",".S.S."];
    const FLOWER_PALS={r:{S:'#3f9a45',P:'#ff5d6c',C:'#ffd84a'},y:{S:'#3f9a45',P:'#ffd84a',C:'#ff8a3c'},p:{S:'#3f9a45',P:'#c77dff',C:'#ffe98f'}};
    function flowerSvg(tint,opt){ return pxSvg(M_FLOWER, FLOWER_PALS[tint||'r'], opt); }
    const M_TUFT=["G.g.G","GgGgG","GGGGG",".ggg."];
    const TUFT_PAL={G:'#5bb85b',g:'#3f9a45',H:'#8fd47f'};
    function tuftSvg(opt){ return pxSvg(M_TUFT, TUFT_PAL, opt); }
    // 🦋 나비(9×7) — 큰 윗날개+좁아지는 아랫날개+어두운 몸통. 색은 tint별(주황/파랑/분홍/노랑). 배너에서 살랑살랑 날아다님(.pk-bfly).
    const M_BFLY=[".WWW.WWW.","WWWWBWWWW","WWWHBHWWW",".WWHBHWW.","..WHBHW..","..WWBWW..","...W.W..."];
    const BFLY_PALS={o:{W:'#ff9d3c',H:'#ffd27a',B:'#3a2a18'},b:{W:'#5aa9ff',H:'#a9d4ff',B:'#22314a'},p:{W:'#ff7fbf',H:'#ffc3e0',B:'#4a2238'},y:{W:'#ffd84a',H:'#fff0a8',B:'#4a3a12'}};
    function butterflySvg(tint,opt){ return pxSvg(M_BFLY, BFLY_PALS[tint||'o'], opt); }
    // 🦋 나비별 '제각각' 이동 경로 CSS 변수(fxflit 키프레임이 읽음) — 나비마다 다른 방향/거리로 흩날리게. rnd()=0~1 난수 함수(FX=Math.random 랜덤, 배너=pkRand 결정적).
    function bflyDriftVars(rnd){ const p=function(){ return Math.round((rnd()*2-1)*22); }; return '--x1:'+p()+'px;--y1:'+p()+'px;--x2:'+p()+'px;--y2:'+p()+'px;--x3:'+p()+'px;--y3:'+p()+'px'; }
    // 🪨 원근 큐 에셋(한정 픽업 배너) — 깊이에 따라 크기·바닥선을 펫과 같은 척도로 배치해 펫이 앞뒤로 움직일 때 원근을 읽히게 함. 전부 도트(crispEdges).
    // 징검다리(디딤돌): 앞→뒤 한 줄, 뒤로 갈수록 작게 → 선 원근. 펫 발밑에 깔려 거의 안 가림.
    const M_STONE=["..XXXXX..",".XLLLLLX.","XLILLMMDX","XMMMMMDDX",".XDDDDDX."];
    const STONE_PAL={X:'#6f757e',L:'#cfd4da',I:'#eef0f3',M:'#a6acb4',D:'#858b94'};
    function stoneSvg(opt){ return pxSvg(M_STONE, STONE_PAL, opt); }
    // 중간 바위(boulder): 이끼(G/g) 얹힌 3면 음영 바위. 펫이 뒤에선 그 뒤로(가려짐), 앞에선 앞으로 지나가는 겹침(occlusion) 큐 — z를 펫과 같은 12-depth*11 척도로.
    const M_ROCK=["...gGGg....","..XXXXXX...",".XLLLLMMX..","XLLLLLMMMX.","XLLLMMMMMDX","XLMMMMMMDDX","XMMMMMDDDDX",".XMMDDDDDX.","..XXXXXXX.."];
    const ROCK_PAL={X:'#565c66',L:'#9aa2ac',M:'#7c838d',D:'#626973',G:'#6fbf46',g:'#4e9636'};
    function rockSvg(opt){ return pxSvg(M_ROCK, ROCK_PAL, opt); }
    // 낮은 말뚝 울타리(뾰족 말뚝 3+나뭇결+2레일): 옆쪽에 앞→뒤로 작아지게 놓아 선 원근. 낮아서 펫을 덜 가림(필드=펫 뒤).
    const M_FENCE=[".T....T....T.","TWwT.TWwT.TWw","TWwT.TWwT.TWw","RRRRRRRRRRRRR","TWwT.TWwT.TWw","TWwT.TWwT.TWw","RRRRRRRRRRRRR","TWwT.TWwT.TWw","TWwT.TWwT.TWw"];
    const FENCE_PAL={T:'#5f3e22',W:'#c39a63',w:'#96703f',R:'#8a6038'};
    function fenceSvg(opt){ return pxSvg(M_FENCE, FENCE_PAL, opt); }
    // 깊이 그림자(납작 타원): 펫 발밑에 깔려 depth(액터 scale 그대로)에 따라 커지고 작아짐 → 접지감+깊이. 색은 CSS opacity로 은은하게. 가림 0.
    const M_SHADOW=[".SSSSSSS.","SSSSSSSSS",".SSSSSSS."];
    const SHADOW_PAL={S:'#12240c'};
    function shadowSvg(opt){ return pxSvg(M_SHADOW, SHADOW_PAL, opt); }
    // 알뜰샵·팔레트·격자용 대표 아트(물그릇은 물 채운 파란 그릇으로 구분 표시)
    function furnMatrix(id){ return {pond:M_POND,cushion:M_CUSHION,bowl:M_BOWL,waterbowl:M_WATERBOWL_WATER,tower:M_TOWER,scratcher:M_SCRATCHER,litterbox:M_LITTER,pethouse:M_PETHOUSE,plant:M_PLANT,catwheel:M_CATWHEEL,rug:M_RUG,window:M_WINDOW,fishtank:M_FISHTANK,fireplace:M_FIREPLACE,fan:M_FAN,hammock:M_HAMMOCK,teaser:M_TEASER,wallclock:M_WALLCLOCK,hangplant:M_HANGPLANT,mobile:M_MOBILE,chandelier:M_CHANDELIER,jingleball:M_JINGLEBALL,frame:M_FRAME,shelf:M_SHELF,mirror:M_MIRROR,neon:M_NEON,sconce:M_SCONCE,garland:M_GARLAND,poster:M_POSTER,tapestry:M_TAPESTRY}[id]; }
    function furnSvg(id, opt){ return pxSvg(furnMatrix(id), FURN_PALS[id], opt); }
    // 캠 전용 연출(움직이는 부분만 오버레이로 분리해 CSS 애니메이션): 같은 매트릭스를 팔레트만 나눠 두 겹으로 그림.
    //  base=움직이는 글자 제외, fx=그 글자만 → 완벽히 겹쳐 정지 배경 + 움직이는 부품(캣휠 트레드 회전·펫알 방울 흔들림·화분 잎 살랑).
    const FURN_ANIM = {
      // move=오버레이(움직이는)로 뺄 글자, type=애니메이션 종류(spin/swing/sway/drift/flicker). 배열=여러 모션 레이어(각기 다른 속도/움직임).
      pond:    [ { type:'drift', move:['O','o','X','t'], cls:'pondfish' },   // 물고기 2마리 활발히 헤엄(fffish)
                 { type:'drift', move:['P','p'], cls:'pondleaf' },          // 수련잎 잔잔히 흔들(ffleaf)
                 { type:'drift', move:['r','S'], cls:'pondwater' } ],       // 물 하이라이트/반짝임 잔잔히 일렁(ffripple)
      catwheel:{ type:'spin',  move:['X','W','H','T'] },   // 링(림·밴드·하이라이트·발판) 전체가 축 중심으로 제자리 회전 — 롤러 R·스탠드 D만 정지
      tower:   { type:'swing', move:['T','O','K'] },   // 매달린 장난감 공(빨강 T·하이라이트 O)+끈(K)
      scratcher:{type:'swing', move:['T','O','H'] },   // 매달린 공(O)+하이라이트(H)+끈(T)
      plant:   { type:'sway',  move:['G','L','l'] },   // 잎만 살랑(줄기 S·화분 P/p/X는 정지)
      window:  { type:'drift', move:['C'] },           // 구름만 좌우로 천천히 흘러감(하늘 S·해 U/u·틀은 정지)
      fishtank:{ type:'drift', move:['F','f','b'] },   // 금붕어+기포만 헤엄치듯 좌우로(물 A·수초 P·자갈 R은 정지)
      fireplace:{type:'flicker',move:['f','F','r'] },  // 불꽃만 일렁임(벽돌·맨틀·장작은 정지)
      fan:     { type:'spin',  move:['G','L','D','h'] },   // 케이지 안 날개(G 중간·L 하이라이트·D 그림자 명암)+허브(h)가 함께 회전(림 X·목·받침은 정지). 진한 하늘색 날개(B)는 팔레트에서 빼 투명 처리(뒷배경 비침)
      hammock: { type:'swing', move:['K','C','c','L','P','p'] },// 끈+천 요람+베개가 매단 지점에서 살랑(기둥 X/W/w 정지)
      teaser:  { type:'swing', move:['K','F','f','T'] },// 줄+깃털 장난감이 대 끝에서 흔들(대 R·받침 정지)
      wallclock:{type:'swing', move:['K','O'] },       // 추(봉+놋쇠)만 좌우로(몸통·시계판 정지)
      hangplant:{type:'swing', move:['K','P','p','G','L','l','g'] }, // 걸이 아래 전체가 살랑(천장 걸이 X 정지)
      mobile:  { type:'swing', move:['K','M','A','a','B','b','C','c'] }, // 막대+매달린 별·달·하트 전체가 살랑(걸이 X 정지)
      chandelier:{type:'sway', move:['K','f','F','H','Y','y','W','C','c','o'] }, // 천장에서 전체가 흔들(매다는형, 상단 피벗) — 더 활발하게(각↑·빠르게)
      jingleball:{type:'swing', move:['X','B','b','L','D','S'] },  // 공 전체가 바닥에서 통통(바닥 접점 중심)
      neon:    {type:'blink',  move:['g','N','H','C','S'] },   // 네온 하트+글로우+반짝임이 네온처럼 파르르 깜빡(더 활발)
      sconce:  {type:'flicker',move:['F','Y','y'] },   // 벽등 촛불이 활발히 일렁(빠르게·크게)
      mirror:  {type:'sheen',  move:['h'] },   // 거울 사선 광택이 반짝 스윕(정적→연출 추가)
      garland: {type:'blink',  move:['A','B','C','a','b','c','h'] }  // 가랜드 전구만 깜빡(줄 K 정지)
    };
    function palPick(pal, keys, keep){ const o={}; Object.keys(pal).forEach(function(k){ const on=keys.indexOf(k)>=0; if(on===keep) o[k]=pal[k]; }); return o; }
    // 연출 있는 가구를 base+fx 겹 SVG로. (연출 없으면 일반 furnSvg 반환)
    // FURN_ANIM[id]는 단일 {type,move} 또는 여러 모션 레이어 배열 [{type,move,cls?}, …](연못=물고기·잎·물 각기 다르게). base=어느 레이어에도 안 든 글자(정지).
    function furnLiveSvg(id, opt){ const a=FURN_ANIM[id]; if(!a) return furnSvg(id, opt);
      const M=furnMatrix(id), pal=FURN_PALS[id];
      const layers = Array.isArray(a) ? a : [a];
      let allMove=[]; layers.forEach(function(l){ allMove=allMove.concat(l.move); });
      const base=pxSvg(M, palPick(pal, allMove, false), opt);          // 움직이는 글자 전부 제외(정지 배경)
      let fx=''; layers.forEach(function(l){ fx += '<span class="ffx ffx-'+l.type+' ffx-'+(l.cls||id)+'">'+pxSvg(M, palPick(pal, l.move, true), {fit:true})+'</span>'; });
      return '<span class="fwrap">'+base+fx+'</span>'; }
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
    const ROOM_H = { pond:2.2, tower:2.5, scratcher:1.4, pethouse:2.8, catwheel:3.0, plant:1.5, litterbox:0.75, cushion:1, bowl:0.5, waterbowl:0.5, rug:2.6, window:1.4, fishtank:1.4, fireplace:1.4, fan:2.7, hammock:1.8, teaser:2.4, wallclock:1.4, hangplant:1.4, mobile:1.4, chandelier:2.2, jingleball:0.7, frame:1.4, shelf:1.4, mirror:1.4, neon:1.4, sconce:1.4, garland:1.4, poster:1.4, tapestry:1.4 };   // 1×1 벽 가구=1.4: 벽 1칸에 맞춰 겹침 방지. 샹들리에=2.2(매다는 대형 센터피스, footW2). 가랜드=footW3.
    // ---- 배치 격자(12칸) 가로 좌표 공유 헬퍼 ----
    // 에디터(평면 그리드)·드롭프리뷰·썸네일은 gridLeftFrac/gridSpanFrac(칸 좌측 edge·폭)을 그대로 쓴다.
    // 캠(원근)은 camAnchorMode로 발자국을 "가운데 정렬 + 양끝 벽 스냅" 배치해 좌우 벽까지 고르게 채운다.
    const GRID_N = 12;
    function gridLeftFrac(c){ return (c-1)/GRID_N; }       // 칸 좌측 edge 비율(0~1)
    function gridSpanFrac(n){ return n/GRID_N; }           // n칸 폭/높이 비율
    // 캠 가로 앵커 모드: 왼쪽 벽에 닿는 열=left(좌측 밀착), 오른쪽 벽=right(우측 밀착), 그 외=center(발자국 중앙).
    // (footW 최대 2라 left·right 동시 스냅은 없음 — center 폴백.)
    function camAnchorMode(c, footW){ const right=c+footW-1;
      if(c===1 && right!==GRID_N) return 'left';
      if(right===GRID_N && c!==1) return 'right';
      return 'center'; }
    // 가구 그래픽 가로세로비(cols/rows) — 그래픽 폭 = fh*aspect. 캠 중심 x 계산(buildActors)에 사용.
    const FURN_ASPECT = { pond:1.667, tower:0.533, scratcher:0.636, pethouse:1.05, catwheel:1.0, plant:0.6, litterbox:1.455, cushion:1.778, bowl:1.778, waterbowl:1.778, rug:2.545, window:0.9, fishtank:1.125, fireplace:1.125, fan:0.727, hammock:1.231, teaser:0.8, wallclock:0.636, hangplant:0.7, mobile:1.2, chandelier:1.0, jingleball:1.0, frame:1.067, shelf:1.667, mirror:0.632, neon:1.286, sconce:0.778, garland:2.667, poster:0.778, tapestry:0.727 };
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
      owned:{ cats:(g.owned&&g.owned.cats)||{}, items:(g.owned&&g.owned.items)||{}, wallpapers:(g.owned&&g.owned.wallpapers)||{}, floors:(g.owned&&g.owned.floors)||{} },
      consum:{ food:clampConsum(g.consum&&g.consum.food), water:clampConsum(g.consum&&g.consum.water), egg:clampConsum(g.consum&&g.consum.egg), box:clampConsum(g.consum&&g.consum.box), rainbow_egg:clampConsum(g.consum&&g.consum.rainbow_egg), rainbow_box:clampConsum(g.consum&&g.consum.rainbow_box), ddeul:clampConsum(g.consum&&g.consum.ddeul) },
      home: normalizeHome(g.home, HOME_OPTS),   // 여러 방(프리셋): rooms[]·current·roomSlots·slots·changedAt (레거시 flat 자동 이관)
      missions: g.missions||{}, progress: g.progress||{}, codes: g.codes||{},
      customMissions: g.customMissions||{},   // 내 미션(커스텀 습관): {id:{title,coinReward,active,createdAt,order}}
      missionLogs: g.missionLogs||{},          // 체크인 로그: {missionId:{'YYYY-MM-DD':{done,paid,at}}}
      streak: (g.streak && typeof g.streak==='object') ? g.streak : { last:'', count:0, best:0 },   // 로그인(출석) 연속: {last,count,best,lastReward?}
      gifts: normalizeGifts(g.gifts),   // 선물함(코드 보상 대기 목록)
      mail: (g.mail && typeof g.mail==='object') ? g.mail : {},   // 친구 선물 발신 하루 카운트 {free:{day:n},egg:{day:n}}
      bcSeen: (g.bcSeen && typeof g.bcSeen==='object') ? g.bcSeen : {},   // 전체 선물(config/broadcast) 이미 받은 id 마커(멱등)
      pity: normPity(g.pity),   // 🔮 가챠 천장: 종류별 {egg,box,ddeul,rainbow_egg,rainbow_box} 누적 뽑기 수(그 종류 신화↑ 나오면 0). 종류마다 100뽑째 확정.
      likeGiven: (g.likeGiven && typeof g.likeGiven==='object') ? g.likeGiven : {},   // 🫶 방문 좋아요 하루 보상 카운트 {day,n}
      likeMilestone: Math.max(0, Math.floor(Number(g.likeMilestone)||0)),   // ❤ 받은 좋아요 마일스톤 최고 수령치
      dexClaims: (g.dexClaims && typeof g.dexClaims==='object') ? g.dexClaims : {}   // 📖 도감 마일스톤 수령 마커(멱등)
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
        grantVisitReward(function(rew){   // 방문자(나) 소보상(하루 상한)
          db.ref('users/'+ownerUid+'/homeLikes').once('value').then(s=>{ if(cb) cb(true, homeLikeCount(s.val()), rew); }).catch(()=>{ if(cb) cb(true, null, rew); });
        });
      }).catch(()=>{ if(cb) cb(false); });
    }
    // 🫶 친구 집 방문(좋아요) 보상: 방문자 +3 은화(하루 3회까지). cb(지급은화).
    const VISIT_REWARD=10, VISIT_DAILY=3;
    function grantVisitReward(cb){ if(!state.uid){ if(cb) cb(0); return; } const today=ymd(new Date()); let rew=0;
      gameRef().transaction(g=>{ if(g==null) return; g=normalizeGame(g);
        const lg=g.likeGiven||{}, n=(lg.day===today?(Number(lg.n)||0):0);
        if(n>=VISIT_DAILY){ rew=0; g.likeGiven={day:today,n:n}; return g; }
        rew=VISIT_REWARD; g.coins=clampCoins((g.coins||0)+VISIT_REWARD); g.likeGiven={day:today,n:n+1}; return g;
      }).then(r=>{ if(cb) cb(r&&r.committed?rew:0); }).catch(()=>{ if(cb) cb(0); }); }
    // ❤ 받은 좋아요 마일스톤 보상(집주인) — 누적 좋아요가 임계 넘으면 금화. game.likeMilestone에 최고 수령치(멱등).
    const LIKE_MILESTONES=[{n:10,g:10},{n:25,g:25},{n:50,g:50},{n:100,g:100},{n:200,g:200},{n:500,g:500}];   // 마일스톤 단위만큼 금화
    function maybeClaimLikeMilestone(total){ if(!state.uid || !(total>0)) return; let add=0, hit=0;
      gameRef().transaction(g=>{ if(g==null) return; g=normalizeGame(g); const claimed=Number(g.likeMilestone)||0; add=0; hit=claimed;
        LIKE_MILESTONES.forEach(m=>{ if(total>=m.n && m.n>claimed){ add+=m.g; hit=Math.max(hit,m.n); } });
        if(add>0){ g.gold=clampGold((g.gold||0)+add); g.likeMilestone=hit; } return g;
      }).then(r=>{ if(r&&r.committed&&add>0) toast('❤ 받은 좋아요 '+hit+'개 달성! 금화 +'+add); }).catch(()=>{}); }
    // 📖 도감 마일스톤 — 전체 25/50/75%(은화+금화) + 종별 완성(금화, 종 규모 비례). 100%는 업적(ach_dexall)이 담당. game.dexClaims에 멱등 마커.
    const DEX_MILESTONES=[{pct:25,c:50,g:2},{pct:50,c:120,g:5},{pct:75,c:250,g:10}];
    function _dexSpecies(owned){ const bs={}; PET_CATALOG.forEach(c=>{ const b=bs[c.species]=bs[c.species]||{t:0,o:0}; b.t++; if(owned[c.id]) b.o++; }); return bs; }
    function _dexUnclaimed(g){ const own=(g.owned&&g.owned.cats)||{}, cl=g.dexClaims||{}, ids=PET_CATALOG.map(c=>c.id);
      const pr=dexProgress(own, ids); let c=0, gg=0, marks=[];
      DEX_MILESTONES.forEach(m=>{ if(pr.pct>=m.pct && !cl['pct'+m.pct]){ c+=m.c; gg+=m.g; marks.push('pct'+m.pct); } });
      const bs=_dexSpecies(own); Object.keys(bs).forEach(sp=>{ const s=bs[sp]; if(s.t>0 && s.o>=s.t && !cl['sp:'+sp]){ gg+=Math.min(15,Math.max(2,Math.round(s.t/6))); marks.push('sp:'+sp); } });
      return { c:c, g:gg, marks:marks }; }
    let _dexReward=null;
    function checkDexMilestones(){ if(!state.uid||!state.game) return; if(!_dexUnclaimed(state.game).marks.length) return;   // 값싼 사전체크(미달이면 트랜잭션 없음)
      gameRef().transaction(g=>{ if(g==null) return; g=normalizeGame(g); const u=_dexUnclaimed(g); if(!u.marks.length){ _dexReward=null; return g; }
        const cl=g.dexClaims||{}; u.marks.forEach(k=>{ cl[k]=1; }); g.dexClaims=cl;
        g.coins=clampCoins((g.coins||0)+u.c); g.gold=clampGold((g.gold||0)+u.g); _dexReward={c:u.c,g:u.g}; return g;
      }).then(r=>{ if(r&&r.committed&&_dexReward){ const rw=_dexReward; _dexReward=null; if(rw.c||rw.g) toast('📖 도감 달성 보상 · '+[rw.c?'은화 +'+rw.c:'',rw.g?'금화 +'+rw.g:''].filter(Boolean).join(' · ')); } }).catch(()=>{}); }
    // 내가 받은 좋아요 총합 실시간
    function watchMyLikes(){ if(!state.uid) return; if(state._myLikesRef){ try{ state._myLikesRef.off(); }catch(e){} }
      state._myLikesRef=db.ref('users/'+state.uid+'/homeLikes');
      state._myLikesRef.on('value', s=>{ state.myLikeCount=homeLikeCount(s.val()); maybeClaimLikeMilestone(state.myLikeCount); writeMyRanking(); if(typeof rerender==='function') rerender(); }, ()=>{}); }
    // 공개 랭킹용 경량 엔트리(소유자 유지) — 이름·좋아요수·공개여부. 좋아요 변동·프로필 저장·진입 시 갱신.
    function writeMyRanking(){ if(!state.uid) return;
      try{ db.ref('rankings/'+state.uid).set({ name:(state.userName||''), likes:(state.myLikeCount||0), private:(state.profilePublic===false), at:new Date().toISOString() }); }catch(e){}
    }
    let _cfgListenersInit=false;   // 전역 config/* 리스너 1회 부착 가드 — 계정 전환(로그아웃→로그인) 반복 시 리스너 N중 누적 방지
    function initCatGame(){
      if(!state.uid) return;
      if(state._gameRef){ try{ state._gameRef.off(); }catch(e){} }
      state._gameRef=gameRef();
      state._gameRef.on('value', s=>{ const raw=s.val(); state.game=normalizeGame(raw); migrateHomeRoomsIfNeeded(raw); ensureRoomIds(); ensureHarvestClocks(); onGameChange(); reconcilePets(); checkDexMilestones(); });
      watchCatalogPets();   // 런타임 펫(전역 catalogPets) 병합 리스너
      watchMyLikes();       // 내가 받은 집 좋아요 총합
      // 전역 config/* 구독(모든 사용자 공통·per-user 부작용 없음)은 세션당 1회만 — 반복 로그인 시 리스너 누적 방지.
      if(!_cfgListenersInit){ _cfgListenersInit=true;
        loadNotices();        // 📢 업데이트 내역(config/notices) 구독 — 배포 없이 갱신
        loadAnnounce();       // 📢 운영자 공지(config/announce, 제목+내용) 구독 — 공지사항에 표시
        loadFeaturedPet();    // 🌟 이달의 펫 수동 선정(config/featuredPet) 구독 — 개발자가 고르면 전역 반영
        loadGachaFx();        // 🎬 가챠 오픈 연출 펫(config/gachaFx: a=1번/왼쪽·b=2번/오른쪽) 구독 — 미지정이면 기본 검은고양이
        loadFurnCfg();        // 🪑 기구물 전역 등급/가격(config/furniture) 구독 — 개발자 '기구물 관리'에서 설정, 모든 사용자 반영
        loadWallCfg(); loadFloorCfg();   // 🧱 벽지(config/wallpaper)·바닥 스킨(config/floor) 전역 등급/가격 구독
      }
      loadBroadcasts();     // 📣 전체 선물(config/broadcast) 구독 — 유저별 수령이라 로그인마다 재구독(off 후 on)
      loadMyAdminGifts();   // 🎁 내게 온 특정-유저 선물(users/{uid}/adminGifts) — uid별이라 이전 ref off 후 재구독
      applyLiteMode();  // 🔋 저장된 가벼운 모드(body.lite) 반영
      startCatLoop();   // 통합 걷기 엔진(단일 rAF, 보이는 무대만 애니메이션)
      // 앱을 켜둔 동안에도 그릇 3시간 만료→똥 정산이 돌도록 주기 점검(다마고치)
      if(state._petTimer) clearInterval(state._petTimer);
      state._petTimer=setInterval(reconcilePets, 60000);
    }
    function onGameChange(){
      updateNewsBadge();
      const dw=$('catdock'); const wall=dw&&dw.querySelector('.cr-wall'); if(wall) wall.style.background=wallCss(currentWall());
      const fl=dw&&dw.querySelector('.cr-floor'); if(fl) fl.style.background=floorCss(currentFloor());   // 바닥 적용도 dock 캠에 라이브 반영(벽지처럼) — 없으면 메인 캠에서 바닥이 안 바뀌던 버그
      const rn=$('cdCamTxt'); if(rn){ rn.textContent=(room().emoji?room().emoji+' ':'')+(room().name||'우리집'); }   // dock LIVE 배지의 현재 방 이름(항상 표시)
      const tr=dw&&dw.querySelector('.cr-topright'); if(tr) tr.outerHTML=batchBtnHtml();   // dock 하트(행복도)·수확칩도 라이브 반영 — renderDock에서만 만들어져 0%로 굳던 버그(지갑은 _walletDisp/syncWalletText라 재렌더 안전)
      renderDockProps();
      renderDockCats();
      if(state.view==='home' && typeof renderHome==='function') renderHome();   // 홈의 미션·은화 즉시 반영
      refreshMoreBadges();   // 더보기 그리드 알림 뱃지(선물함·소식…)가 game 변화(선물 받기·쿠폰 사용·공지 확인)에 즉시 반영되도록
      if(state._sheetRefresh && $('sheet') && $('sheet').classList.contains('on')) state._sheetRefresh();
      writeHomeCam();   // 대표 방 공개 스냅샷 갱신(친구·랭킹이 이것만 읽음 — 다른 방은 비공개)
    }
    // 친구·랭킹에 공개할 '대표 방' 스냅샷. 사적인 다른 방은 담지 않는다.
    function repRoomSnapshot(){ const h=homeH(); const rooms=h.rooms||[]; const i=Math.min(rooms.length-1, Math.max(0, (h.showRoom!=null?h.showRoom:0)|0)); const r=rooms[i]||rooms[0]||{};
      return { name:r.name||'', emoji:r.emoji||'', wallpaper:r.wallpaper||'default', floor:r.floor||'default', placed:r.placed||{}, wallPlaced:r.wallPlaced||{}, active:(r.active||[]).filter(ownsCat), slots:slotCount(), poops:Number(r.poops)||0, changedAt:h.changedAt||'' }; }
    // homeCam/{uid} 에 기록(내용 바뀔 때만). users/{uid}/game 은 규칙상 소유자만 읽으므로 친구는 이 노드로만 내 집을 본다.
    function writeHomeCam(){ if(!state.uid||!state.game) return; const snap=repRoomSnapshot(); const sig=JSON.stringify(snap);
      if(sig===state._lastCamSig) return; state._lastCamSig=sig;
      try{ db.ref('homeCam/'+state.uid).set(snap); }catch(e){} }
    function coins(){ return clampCoins((state.game&&state.game.coins)||0); }
    function ownsCat(id){ return !!(state.game&&state.game.owned.cats[id]); }
    function activeCats(){ const a=room().active||[]; return a.filter(id=>ownsCat(id) && PET_CATALOG.some(c=>c.id===id)); }   // 현재 방의 활성 펫 — 카탈로그에 있는(렌더 가능한) 것만. 삭제된 펫이 보유·활성에 남아도 캠에 유령으로 안 뜨게(도감 그리드도 이미 카탈로그 기준)
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
        while(g.home.rooms.length<g.home.roomSlots) g.home.rooms.push({ id:genRoomId(), name:'방 '+(g.home.rooms.length+1), wallpaper:'default', placed:{}, active:[], poops:0 });
        g.home.current=g.home.roomSlots-1;   // 새 방으로 이동
        g.home.changedAt=new Date().toISOString();
        return g;
      }).then(res=>{ if(res.committed) toast('방 +1 확장! 🏠'); });
    }
    // 방 관리(오버레이 모달): 이름 변경 · 다른 방 벽지 가져오기 · 방 비우기.
    //  ⚠️ openSheet(알뜰홈 시트)를 교체하지 않도록 .gimenu-scrim 모달로 알뜰홈 위에 띄운다(고양이 이름짓기와 동일 패턴).
    function openRoomMenu(idx){ closeRoomMenu();
      const h=homeH(); const r=(h.rooms&&h.rooms[idx])||{}; const cur=r.name||('방 '+(idx+1)); const rc=roomCount(); const rid=r.id||'';   // 방 안정 id(재정렬 경합에도 정확히 이 방을 수정)
      let body='<div class="gih"><b>방 관리 · '+escapeHtml(cur)+'</b></div>'+
        '<div class="field"><label for="roomNameIn">방 이름</label><input class="input" id="roomNameIn" maxlength="8" value="'+escapeHtml(cur)+'" placeholder="예: 고양이방" style="width:100%;box-sizing:border-box;"></div>'+
        '<button class="btn" onclick="saveRoomName(\''+rid+'\','+idx+')">이름 저장</button>';
      // 방 이모지(선택) — 썸네일·dock 이름 앞에 표시
      const EMO=['','🐱','🐯','🦁','🐶','🌙','☀️','🌸','🎋','🛋️','🌊','⭐'];
      body+='<div class="sech" style="margin-top:14px;"><span class="l">이모지</span></div>'+
        '<div class="emopick">'+EMO.map(e=>'<button class="emob'+((r.emoji||'')===e?' on':'')+'" onclick="setRoomEmoji(\''+rid+'\','+idx+',\''+e+'\')">'+(e||'없음')+'</button>').join('')+'</div>';
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
        '<div class="row" style="flex-wrap:wrap;gap:8px;">'+others.map(i=>{ const nm=(h.rooms[i].name)||('방 '+(i+1)), sid=h.rooms[i].id||''; return '<button class="btn ghost" onclick="copyRoomWall(\''+sid+'\',\''+rid+'\','+i+','+idx+')"><span class="wsw" style="background:'+wallCss(h.rooms[i].wallpaper||'default')+'"></span>'+escapeHtml(nm)+'</button>'; }).join('')+'</div>'; }
      // 방 복제(가구·벽지 통째 복사) — 방이 남았을 때만
      if(rc<MAX_ROOMS){ body+='<div class="sech" style="margin-top:14px;"><span class="l">방 복제</span><span class="s">가구·벽지 복사</span></div>'+
        '<p class="muted" style="font-size:12px;margin:0 0 8px;line-height:1.5;">벽지·이모지와 배치 가구를 새 방으로 복사해요(보유가 부족한 가구는 제외, 펫은 복사 안 함).</p>'+
        '<button class="btn ghost" onclick="duplicateRoom(\''+rid+'\','+idx+')">이 방 복제 📑</button>'; }
      body+='<div class="sech" style="margin-top:14px;"><span class="l">방 비우기 · 삭제</span></div>'+
        '<p class="muted" style="font-size:12px;margin:0 0 8px;line-height:1.5;">비우기=가구·펫만 초기화(방은 유지). 삭제=방 자체를 제거(환불 없음). 둘 다 가구는 인벤토리로 돌아가요.</p>'+
        '<button class="btn danger ghost" onclick="clearRoom(\''+rid+'\','+idx+')">이 방 비우기</button>'+
        (rc>BASE_ROOMS?'<button class="btn danger ghost" style="margin-top:6px;" onclick="deleteRoom(\''+rid+'\','+idx+')">이 방 삭제 (환불 없음)</button>':'')+
        '<button class="btn ghost" style="margin-top:6px;" onclick="closeRoomMenu()">닫기</button>';
      const wrap=document.createElement('div'); wrap.id='roomMenu'; wrap.className='gimenu-scrim';
      wrap.onclick=function(e){ if(e.target===wrap) closeRoomMenu(); };
      wrap.innerHTML='<div class="gimenu" style="max-height:82vh;overflow-y:auto;">'+body+'</div>';
      document.body.appendChild(wrap);
      setTimeout(()=>{ const el=$('roomNameIn'); if(el){ el.focus(); el.select(); } }, 40); }
    function closeRoomMenu(){ const m=$('roomMenu'); if(m) m.remove(); }
    // 알뜰홈 시트가 열려 있으면 즉시 다시 그려 방 이름/벽지 변경을 반영(모달만 닫고 시트는 유지).
    function refreshCatSheet(){ if(state._sheetRefresh && $('sheet') && $('sheet').classList.contains('on')) state._sheetRefresh(); }
    function saveRoomName(id, idx){ const v=(val('roomNameIn')||'').trim()||('방 '+((idx|0)+1));
      roomTx(id, idx, R=>{ R.name=v; }, ()=>{ touchHome(); refreshCatSheet(); toast('방 이름을 바꿨어요'); }); closeRoomMenu(); }
    function setRoomEmoji(id, idx, e){ roomTx(id, idx, R=>{ R.emoji=e||''; }, ()=>{ touchHome(); refreshCatSheet(); }); closeRoomMenu(); }
    function copyRoomWall(srcId, destId, srcIdx, destIdx){ gameRef().transaction(g=>{ if(g==null) return; g=normalizeGame(g); const rs=g.home.rooms;
        let si=roomIndexById(rs, srcId); if(si<0) si=srcIdx|0; let di=roomIndexById(rs, destId); if(di<0) di=destIdx|0;
        const s=rs[si], d=rs[di]; if(!s||!d) return g;
        d.wallpaper=s.wallpaper||'default'; d.floor=s.floor||'default'; g.home.changedAt=new Date().toISOString(); return g;
      }).then(r=>{ if(r&&r.committed){ refreshCatSheet(); toast('벽지·바닥을 가져왔어요 🎨'); } }); closeRoomMenu(); }
    function clearRoom(id, idx){ closeRoomMenu();   // 모달을 먼저 닫아야 확인 시트가 보인다(모달 z-index가 더 위)
      confirmSheet('이 방의 가구·펫을 모두 비울까요? (가구는 인벤토리로 돌아가요)', ()=>{
        roomTx(id, idx, R=>{ R.placed={}; R.wallPlaced={}; R.active=[]; R.poops=0; },   // 바닥+벽 가구 모두 인벤토리로 회수(id로 정확한 방만)
          r=>{ if(r&&r.committed) toast('방을 비웠어요'); renderCatHouse(); }); }); }   // 비운 뒤 알뜰홈으로 복귀
    // 🗑️ 방 삭제(환불 없음) — 방을 rooms에서 제거하고 roomSlots 감소. 가구는 전역 인벤토리로 자동 복귀(placed-count 모델), 펫은 대기. current·showRoom 인덱스 remap. 최소 1개는 남긴다.
    function deleteRoom(id, idxFallback){ if(roomCount()<=BASE_ROOMS){ toast('방은 최소 1개는 있어야 해요'); return; } closeRoomMenu();
      confirmSheet('이 방을 삭제할까요?\n방 안의 가구는 인벤토리로 돌아가고(다시 배치 가능), 활성 펫은 대기 상태가 됩니다. 환불은 없어요.', ()=>{
        gameRef().transaction(g=>{ if(g==null) return; g=normalizeGame(g); const rs=g.home.rooms; if(!rs||rs.length<=1) return;
          let idx=roomIndexById(rs, id); if(idx<0) idx=idxFallback|0; if(idx<0||idx>=rs.length) return;   // id로 정확한 방(경합에도 엉뚱한 방 삭제 방지)
          rs.splice(idx,1);
          g.home.roomSlots=Math.max(BASE_ROOMS, Math.min(MAX_ROOMS, rs.length));
          const remap=v=>{ v=v|0; if(v===idx) return Math.min(rs.length-1, idx); return v>idx? v-1 : v; };
          g.home.current=Math.max(0, Math.min(rs.length-1, remap(g.home.current)));
          g.home.showRoom=Math.max(0, Math.min(rs.length-1, remap(g.home.showRoom)));
          g.home.changedAt=new Date().toISOString(); return g;
        }).then(r=>{ if(r&&r.committed){ toast('방을 삭제했어요'); renderCatHouse(); } });
      }, {title:'방 삭제', okLabel:'삭제', danger:true}); }
    // 📑 방 복제 — 벽지·이모지·이름(+' 복사')과 배치 가구를 새 방으로 복사. 단 전역 인벤토리(보유 qty − 전 방 배치)를 넘지 않게 '남는 가구만' 복사(초과분은 제외). 펫·똥은 복사 안 함(한 펫 한 방).
    function duplicateRoom(id, idxFallback){ if(roomCount()>=MAX_ROOMS){ toast('방을 모두 열어서 더 복제할 수 없어요(최대 '+MAX_ROOMS+')'); return; } closeRoomMenu();
      gameRef().transaction(g=>{ if(g==null) return; g=normalizeGame(g); const rs=g.home.rooms; let idx=roomIndexById(rs, id); if(idx<0) idx=idxFallback|0; const src=rs&&rs[idx]; if(!src||rs.length>=MAX_ROOMS) return;
        const items=(g.owned&&g.owned.items)||{};
        const placedAll={}; rs.forEach(R=>{ const p=(R&&R.placed)||{}; Object.keys(p).forEach(k=>{ const id=p[k]&&p[k].itemId; if(id) placedAll[id]=(placedAll[id]||0)+1; });
          const wp=(R&&R.wallPlaced)||{}; Object.keys(wp).forEach(k=>{ const id=wp[k]&&wp[k].itemId; if(id) placedAll[id]=(placedAll[id]||0)+1; }); });   // 바닥+벽 합산(전역 인벤토리)
        const copyMap=srcMap=>{ const out={}; Object.keys(srcMap||{}).forEach(k=>{ const id=srcMap[k]&&srcMap[k].itemId; if(!id) return;
          const own=Number(items[id]&&items[id].qty)||0, used=placedAll[id]||0; if(used<own){ out[k]={ itemId:id }; placedAll[id]=used+1; } }); return out; };   // 남으면 복사·부족하면 건너뜀
        const newPlaced=copyMap(src.placed), newWallPlaced=copyMap(src.wallPlaced);
        const nm=((src.name||('방 '+(idx+1)))+' 복사').slice(0,8);
        rs.push({ id:genRoomId(), name:nm, wallpaper:src.wallpaper||'default', emoji:src.emoji||'', placed:newPlaced, floor:src.floor||'default', wallPlaced:newWallPlaced, active:[], poops:0 });
        g.home.roomSlots=Math.min(MAX_ROOMS, Math.max(rs.length, (g.home.roomSlots|0)));
        g.home.current=rs.length-1; g.home.changedAt=new Date().toISOString(); return g;
      }).then(r=>{ if(r&&r.committed){ const h=r.snapshot.val()&&r.snapshot.val().home; const arr=toRoomsArray(h&&h.rooms)||[]; const nr=arr[arr.length-1]; let si=roomIndexById(arr, id); if(si<0) si=idxFallback|0; const srcR=arr[si];
          const cnt=o=>((o&&o.placed)?Object.keys(o.placed).length:0)+((o&&o.wallPlaced)?Object.keys(o.wallPlaced).length:0);
          const srcN=cnt(srcR), newN=cnt(nr), sk=Math.max(0,srcN-newN);
          renderCatHouse(); toast(sk?('방을 복제했어요 (가구 '+sk+'개는 보유 부족으로 제외)'):'방을 복제했어요 🏠'); } }); }
    function setShowRoom(idx){ gameRef().child('home/showRoom').set(idx).then(()=>{ touchHome(); refreshCatSheet(); toast('대표 방으로 지정했어요 ★'); }); closeRoomMenu(); }
    // 방 썸네일의 ⭐(즐겨찾기) 탭 = 이 방을 대표 방(친구·랭킹에 보임)으로 지정 + 별 팝 연출(좋아요와 동일). 이미 대표면 안내만.
    function favRoom(idx, ev){ if(ev){ if(ev.stopPropagation) ev.stopPropagation(); const t=ev.currentTarget, r=t&&t.getBoundingClientRect&&t.getBoundingClientRect(); if(typeof starBurst==='function'&&r) starBurst(r.left+r.width/2, r.top+r.height/2); }
      if(idx===(homeH().showRoom|0)){ toast('이미 대표 방이에요 ★'); return; }
      gameRef().child('home/showRoom').set(idx).then(()=>{ touchHome(); refreshCatSheet(); toast('대표 방으로 지정했어요 ★'); }); }
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
        if(m.gold) g.gold=clampGold((g.gold||0)+m.gold);   // 조직적 금화 획득(가챠 외 공급원)
        return g;
      });
    }
    // 프로모/치트 코드 — 보상은 곧바로 주지 않고 "선물함"으로 들어감(더보기 → 선물함에서 받기).
    // 규칙: 일반 사용자는 코드당 1회만, 개발자 계정(isDev)은 무제한. type=coins(은화) / consum(소비 아이템).
    const PROMO_CODES = {
      eggardeneggarden: { type:'consum', key:'ddeul', qty:10, label:'뜰알 10개' },   // 🌱 상단 배치(첫 키 = 쿠폰 목록·소식 최상단)
      showmethemoney: { type:'coins',  qty:999,  label:'999 은화' },
      helloeggarden:  { type:'consum', key:'rainbow_egg', qty:1,  label:'무지개알 1개' },
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
      rainbow_box:{ name:'무지개박스',icon:o=>rainbowBoxSvg(o),   use:'rb_box' },
      ddeul:     { name:'뜰알',       icon:o=>ddeulEggSvg(o),     use:'ddeul' }   // 🌱 한정 픽업(뜰알) — 보유 1개 소모해 열면 DDEUL_TIERS 확률(개발자 선물/지급 전용, 상점 비매)
    };
    // 선물 1건의 출처/사유 텍스트(어떤 행위·보상으로 받았는지). 메시지(운영·축하)가 있으면 우선, 없으면 코드/유형에서 파생.
    function giftSource(gf){ if(gf.msg) return gf.msg; if(gf.bc) return '운영자 선물'; if(gf.code) return '코드 '+String(gf.code).toUpperCase(); if(gf.welcome) return '회원가입 축하'; return ''; }
    // 선물 1건의 아이콘/이름(+출처 텍스트 sub)
    function giftView(gf){ let icon, name;
      if(gf.type==='coins'){ icon=coinSvg({h:30}); name=(gf.qty||0).toLocaleString()+' 은화'; }
      else if(gf.type==='gold'){ icon=goldSvg({h:30}); name=(gf.qty||1).toLocaleString()+' 금화'; }
      else { const m=CONSUM_META[gf.key]||{name:gf.key,icon:()=>''}; icon=m.icon({h:34}); name=m.name+' '+(gf.qty||1)+'개'; }
      return { icon:icon, name:name, msg:gf.msg||'', sub:giftSource(gf) }; }
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
            h+=gifts.map((gf,i)=>{ const v=giftView(gf); return '<div class="giftrow"><span class="gfic">'+v.icon+'</span><span class="gftx"><b class="gfnm">'+escapeHtml(v.name)+'</b>'+(v.sub?'<span class="gfmsg">'+escapeHtml(v.sub)+'</span>':'')+'</span><button class="buy" onclick="claimGift('+i+')">받기</button></div>'; }).join('');
            h+='<button class="btn" style="margin-top:12px;" onclick="claimAllGifts()">모두 받기</button>';
          }
        }
        h+='</div>'; return h;
      };
      openSheet('선물함', build());
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(b) b.innerHTML=build(); };
    }
    function applyGiftToGame(g, gf){ if(gf.type==='coins') g.coins=(g.coins||0)+(Number(gf.qty)||0);
      else if(gf.type==='gold') g.gold=clampGold((g.gold||0)+(Number(gf.qty)||1));
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
    // ===== 📣 전체 선물(broadcast) — 개발자가 config/broadcast에 넣으면 모든 사용자가 자기 선물함으로 1회 수령 =====
    // 규칙: config 쓰기=관리자만, 읽기=로그인 전체. 각 사용자는 자기 game.gifts에만 쓰므로 서버 없이 안전하게 전파. bcSeen 마커로 멱등.
    let _broadcasts={};
    function loadBroadcasts(){ try{ const r=db.ref('config/broadcast'); r.off(); r.on('value', function(s){ _broadcasts=s.val()||{}; claimBroadcasts(); }); }catch(e){} }   // 로그인마다 재구독 → off 후 on(누적 방지, 재부착 시 현재 유저로 claim 재발화)
    function claimBroadcasts(){ if(!state.uid || !gameRef) return; const bc=_broadcasts||{}; const ids=Object.keys(bc); if(!ids.length) return;
      let added=0;
      gameRef().transaction(g=>{ g=normalizeGame(g); added=0;
        ids.forEach(function(id){ if(g.bcSeen[id]) return; const b=bc[id]; g.bcSeen[id]=true;   // 형식 이상해도 마커는 찍어 재시도 방지
          if(!b || !b.type || !(b.type==='coins'||b.type==='gold'||b.type==='consum')) return;
          const gift={ type:b.type, qty:Math.max(1, Number(b.qty)||1), at:b.at||new Date().toISOString(), bc:true };
          if(b.type==='consum'){ if(!b.key) return; gift.key=b.key; }
          if(b.msg) gift.msg=String(b.msg).slice(0,200);
          g.gifts.push(gift); added++; });
        return g;
      }).then(function(r){ if(r&&r.committed&&added){ if(typeof toast==='function') toast('🎁 운영자 선물 '+added+'개가 선물함에 도착했어요!'); if(typeof updateNewsBadge==='function') updateNewsBadge(); if(state._sheetRefresh) state._sheetRefresh(); } }).catch(function(){});
    }
    // ===== 🎁 특정 유저 선물(users/{uid}/adminGifts) — 개발자가 넣으면 그 유저만 자기 선물함으로 수령(비공개, 규칙: 관리자·본인 쓰기) =====
    let _admClaim={};
    let _admGiftRef=null;
    function loadMyAdminGifts(){ if(_admGiftRef){ try{ _admGiftRef.off(); }catch(e){} _admGiftRef=null; }   // 이전 uid의 adminGifts 리스너 해제(계정 전환 시 옛 uid 노드에 permission-denied·중복 콜백 방지)
      if(!state.uid) return;
      try{ _admGiftRef=db.ref('users/'+state.uid+'/adminGifts'); _admGiftRef.on('value', function(s){ const v=s.val(); if(v) claimAdminGifts(v); }); }catch(e){} }
    function claimAdminGifts(map){ if(!state.uid) return; const ids=Object.keys(map||{}).filter(function(id){ return !_admClaim[id] && map[id] && map[id].type; }); if(!ids.length) return;
      ids.forEach(function(id){ _admClaim[id]=1; });
      const gifts=ids.map(function(id){ const b=map[id]; if(!(b.type==='coins'||b.type==='gold'||b.type==='consum')) return null; const gift={ type:b.type, qty:Math.max(1, Number(b.qty)||1), at:b.at||new Date().toISOString(), bc:true }; if(b.type==='consum'){ if(!b.key) return null; gift.key=b.key; } if(b.msg) gift.msg=String(b.msg).slice(0,200); return gift; }).filter(Boolean);
      gameRef().transaction(function(g){ g=normalizeGame(g); gifts.forEach(function(gf){ g.gifts.push(gf); }); return g; })
        .then(function(r){ const upd={}; ids.forEach(function(id){ upd['users/'+state.uid+'/adminGifts/'+id]=null; }); db.ref().update(upd); ids.forEach(function(id){ delete _admClaim[id]; });
          if(r&&r.committed&&gifts.length){ if(typeof toast==='function') toast('🎁 운영자 선물 '+gifts.length+'개가 선물함에 도착했어요!'); if(typeof updateNewsBadge==='function') updateNewsBadge(); if(state._sheetRefresh) state._sheetRefresh(); } })
        .catch(function(){ ids.forEach(function(id){ delete _admClaim[id]; }); });
    }
    // 개발자: 선물 보내기 — 받는 사람(친구코드) 비우면 전체(config/broadcast, 공개), 채우면 그 유저에게만(users/{uid}/adminGifts, 비공개).
    function sendBroadcast(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용', true); return; }
      const type=val('bc_type'), qty=Math.floor(Number(val('bc_qty'))||0), msg=(val('bc_msg')||'').trim(), to=(val('bc_to')||'').trim().toUpperCase();
      if(!type){ toast('종류를 선택하세요', true); return; }
      if(qty<=0){ toast('수량을 1 이상 입력하세요', true); return; }
      const consumKeys=['egg','box','rainbow_egg','rainbow_box','ddeul'];
      const gift = (consumKeys.indexOf(type)>=0) ? { type:'consum', key:type, qty:qty } : { type:type, qty:qty };   // coins/gold는 그대로
      if(msg) gift.msg=msg.slice(0,200);
      gift.at=new Date().toISOString();
      if(to){   // 특정 유저(친구코드) → users/{uid}/adminGifts (비공개)
        if(!confirm('이 코드('+to+') 사용자에게 보낼까요?\n'+giftView(gift).name+(msg?('\n"'+msg+'"'):''))) return;
        db.ref('friendCodes/'+to).once('value').then(function(s){ const uid=s.val(); if(!uid){ toast('그 코드의 사용자를 못 찾았어요', true); return; }
          db.ref('users/'+uid+'/adminGifts').push(gift).then(function(){ toast('🎁 그 사용자 선물함에 보냈어요 — 접속 시 받습니다'); if(typeof openDevBroadcast==='function') openDevBroadcast(); }).catch(function(e){ console.error('adminGift', e); toast('전송 실패 — 관리자 계정/규칙 배포 확인', true); }); })
          .catch(function(){ toast('코드 조회 실패', true); });
        return;
      }
      // 전체(broadcast, 공개)
      if(!confirm('전체 사용자에게 이 선물을 보낼까요?\n'+(giftView(gift).name)+(msg?('\n"'+msg+'"'):'')+'\n(되돌리기 어려움 — config/broadcast에서 삭제하면 이후 신규 전파만 멈춤)')) return;
      db.ref('config/broadcast').push(gift).then(function(){ toast('📣 전체 선물을 보냈어요 — 각 사용자가 접속 시 받습니다'); if(typeof openDevBroadcast==='function') openDevBroadcast(); }).catch(_cfgWriteErr);
    }
    function openDevBroadcast(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용', true); return; }
      const opts=[['coins','은화'],['gold','금화'],['egg','펫알'],['box','랜덤박스'],['rainbow_egg','무지개알'],['rainbow_box','무지개박스'],['ddeul','뜰알']];
      let h='<div class="note">선물함에 아이템+<b>메시지</b>를 넣어 보내요(예: 오류로 인한 사과의 선물). <b>받는 사람</b>을 <b>비우면 전체</b>(공개 config/broadcast), <b>친구코드</b>를 넣으면 <b>그 사용자에게만 비공개</b>로 갑니다. 각 사용자는 접속 시 1회 수령.</div>';
      h+='<div class="field"><label for="bc_to">받는 사람(친구코드)</label><input class="input" id="bc_to" maxlength="6" autocapitalize="characters" spellcheck="false" placeholder="비우면 전체 · 예: ABC123" style="text-transform:uppercase;"></div>';
      h+='<div class="field"><label for="bc_type">종류</label><select class="input" id="bc_type">'+opts.map(function(o){ return '<option value="'+o[0]+'">'+o[1]+'</option>'; }).join('')+'</select></div>';
      h+='<div class="field"><label for="bc_qty">수량</label><input class="input" id="bc_qty" inputmode="numeric" placeholder="예: 100" value="1"></div>';
      h+='<div class="field"><label for="bc_msg">메시지(선택)</label><input class="input" id="bc_msg" maxlength="200" placeholder="예: 오류로 인한 사과의 선물입니다"></div>';
      h+='<button class="btn" style="margin-top:6px;" onclick="sendBroadcast()">보내기</button>';
      const cnt=Object.keys(_broadcasts||{}).length; h+='<div class="note" style="margin-top:12px;">전체 선물(공개)로 전파 중: <b>'+cnt+'</b>개. 오래된 전체 선물은 콘솔 <code>config/broadcast</code>에서 삭제하면 신규 전파가 멈춰요(특정 유저 선물은 그 유저가 받으면 자동 삭제).</div>';
      openSheet('선물 보내기', h);
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
        const order=['egg','box','ddeul','rainbow_egg','rainbow_box','food','water'];
        const rows=order.filter(k=>consumQty(k)>0);
        let h='<div class="bag">';
        if(!rows.length){ h+='<div class="empty" style="padding:30px 12px;">가방이 비었어요. 알뜰샵·선물함에서 아이템을 얻어보세요 🎒</div>'; }
        else h+=rows.map(k=>{ const m=CONSUM_META[k], q=consumQty(k);
          // 알·박스류는 가방에서 바로 안 열고, 가챠샵으로 이동해서 연다(사료·물만 홈 그릇 탭).
          const useBtn = m.use ? '<button class="buy ghost sm" onclick="goGachaShop()" aria-label="'+m.name+' 가챠샵에서 열기">가챠샵에서 열기</button>'
                               : '<span class="qty" style="font-size:11px;color:var(--sub)">홈에서 그릇 탭</span>';
          return '<div class="bagrow"><span class="bgic">'+m.icon({h:34})+'</span><b class="bgnm'+((k==='rainbow_egg'||k==='rainbow_box'||k==='ddeul')?' tier-rainbow':'')+'">'+m.name+'</b><span class="qty">보유 '+q.toLocaleString()+(q>=MAX_CONSUM?maxChip():'')+'</span>'+useBtn+'</div>'; }).join('');
        h+='<div class="note" style="margin-top:12px;">사료·물은 홈 화면에서 <b>밥·물 그릇을 탭</b>해 사용해요. 펫알·랜덤박스·무지개 아이템은 <b>가챠샵</b>에서 열어요.</div></div>';
        return h;
      };
      openSheet('가방', build());
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(b) b.innerHTML=build(); };
    }
    function useBagItem(k){ const use=(CONSUM_META[k]||{}).use;
      if(use==='egg'||use==='box') useHeldGacha(use);
      else if(use==='rb_egg') useRainbow('egg');
      else if(use==='rb_box') useRainbow('box');
      else if(use==='ddeul') useHeldDdeul(); }
    // 보유한 펫알/랜덤박스(소비 인벤토리)를 일반 확률로 오픈 — 은화 대신 인벤토리 1개 소모, 금화+1 지급.
    function useHeldGacha(kind){
      const key=kind;   // consum.egg / consum.box
      if(consumQty(key)<1){ toast('보유한 '+(kind==='egg'?'펫알':'랜덤박스')+'이 없어요', true); return; }
      const map = kind==='egg'?gachaCatTierMap():effItemTier();
      const forced=pityForcedTierFor(kind);   // 🔮 종류별 천장(보유 펫알/랜덤박스도 같은 종류 카운터 공유)
      const res = forced ? pickTierMember(map, forced) : rollFromPool(map); if(!res) return;   // 일반 확률표(effTiers). 펫알=활성 한정만 포함(gachaCatTierMap)
      const dup=kind==='egg' && ownsCat(res.id);
      const refund=dup?petDupRefund(res.id):0;
      const isNew=gachaNew(kind,res);   // 지급 전 판정(NEW 배지)
      const hit=isTopTier(res.tier);
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.consum[key])||0)<1) return;
        g.consum[key]-=1; g.gold=clampGold((g.gold||0)+1); g.pity[kind]=pityNext(g.pity[kind]||0, hit);
        if(kind==='egg'){
          if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(res.id)<0) R.active.push(res.id); } }
          else { g.coins+=refund; }
        } else {
          g.owned.items[res.id]=g.owned.items[res.id]||{qty:0,boughtAt:new Date().toISOString()};
          g.owned.items[res.id].qty=(Number(g.owned.items[res.id].qty)||0)+1;
        }
        return g;
      }).then(r=>{ if(r&&r.committed){ runGachaFx(kind, res, dup, refund, false, isNew); if(state._sheetRefresh) setTimeout(()=>{ if(state._sheetRefresh) state._sheetRefresh(); }, 50); } });
    }
    // 🌱 보유한 뜰알(소비 인벤토리) 열기 — 개발자 선물/지급으로 받은 뜰알 1개 소모(은화·금화 안 듦), DDEUL_TIERS(한정 픽업) 확률로 오픈. 뜰알 오픈 연출(무지개+나비) 공용.
    function useHeldDdeul(){
      if(consumQty('ddeul')<1){ toast('보유한 뜰알이 없어요', true); return; }
      const forced=pityForcedTierFor('ddeul');   // 🔮 천장: 뜰알 확정 = 신화 50% · 한정 50%
      const res = forced ? pickTierMember(gachaCatTierMap(), forced) : rollFromPool(gachaCatTierMap(), DDEUL_TIERS); if(!res) return;
      const dup=ownsCat(res.id), refund=dup?petDupRefund(res.id):0;
      const isNew=gachaNew('ddeul',res);
      const hit=isTopTier(res.tier);
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.consum.ddeul)||0)<1) return;
        g.consum.ddeul-=1; g.pity.ddeul=pityNext(g.pity.ddeul||0, hit);
        if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(res.id)<0) R.active.push(res.id); } }
        else { g.coins+=refund; }
        return g;
      }).then(r=>{ if(r&&r.committed){ runGachaFx('ddeul', res, dup, refund, false, isNew); if(state._sheetRefresh) setTimeout(()=>{ if(state._sheetRefresh) state._sheetRefresh(); }, 50); } else toast('처리 중이에요 — 잠시 후 다시 시도해 주세요', true); });
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
        if(rw.coins||rw.gold){ g.coins+=rw.coins; if(rw.gold) g.gold=clampGold((g.gold||0)+rw.gold); milestone={ day:g.streak.count, coins:rw.coins, gold:rw.gold }; g.streak.lastReward=Object.assign({at:new Date().toISOString()}, milestone); }
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
      const willWait=(room().active||[]).length>=(homeH().slots||BASE_SLOTS);   // 현재 방 슬롯이 꽉 찼으면 대기 목록으로 감(안내용)
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(g.coins<price || g.owned.cats[id]) return;      // 재검증 → abort(가짜 입양 토스트 방지)
        g.coins-=price; g.owned.cats[id]={boughtAt:new Date().toISOString()};
        { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(id)<0) R.active.push(id); }
        return g;
      }).then(res=>{ if(res.committed) toast(c.name+' 입양 완료! 🐾'+(feat?' · 이달의 펫 할인':'')+(willWait?' · 슬롯이 꽉 차 대기 목록에 넣었어요(확장 시 나와요)':'')); });
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
    let _petGachaOnly={};   // 펫 가챠전용 전역 오버라이드 {id:true|false} — catalogPets/{id}.gachaOnly 에서 채움. 미설정=등급 기반 기본값
    let _petExActive={};    // 한정(exclusive) 펫 '가챠 등장' 전역 오버라이드 {id:true|false} — catalogPets/{id}.exActive. 미설정=EX_ACTIVE_DEFAULT
    const EX_ACTIVE_DEFAULT={ cat_leopardcat:true, cat_leopard:true };   // 지금은 삵·표범만 한정 가챠에 등장(나머지 한정 펫은 비활성). 개발자 토글로 변경 가능
    function isExGachaActive(id){ return _petExActive[id]!=null ? _petExActive[id] : !!EX_ACTIVE_DEFAULT[id]; }   // 한정 펫이 가챠 한정 리스트에 들어가는지
    // 펫알 가챠용 등급맵 = effCatTier()에서 '비활성 한정 펫'을 뺀 것(활성 한정만 풀·확률에 포함). 그 외 등급은 그대로.
    function gachaCatTierMap(){ const src=effCatTier(), r={}; Object.keys(src).forEach(function(k){ if(src[k]==='exclusive' && !isExGachaActive(k)) return; r[k]=src[k]; }); return r; }
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
      _deletedPets={}; _petGachaOnly={}; _petExActive={};
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
        if(r.frames!=null) sp.frames=Math.max(2, Number(r.frames)||6);   // 걷기 프레임 수(6·8 등) — 없으면 기본 6(구 레코드 하위호환)
        if(isNew){ sp.runtime=true; sp.walk=sp.walk||''; }
        PET_SPRITES[id]=sp;
        const tier = r.tier || CAT_TIER[id] || 'normal'; CAT_TIER[id]=tier;
        if(r.gachaOnly!=null) _petGachaOnly[id]=!!r.gachaOnly;   // 가챠전용 전역 오버라이드(true=판매목록 숨김, false=등급 무관 판매 허용)
        if(r.exActive!=null) _petExActive[id]=!!r.exActive;      // 한정 가챠 등장 전역 오버라이드
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
        // frame_0..frame_N 를 프레임 번호로 자연 정렬(문자열 정렬이면 frame_10<frame_2 로 어긋남 — 8장↑ 대비)
        const byFrame=(a,b)=>((+((a.match(/frame_(\d+)/i)||[])[1]||0))-(+((b.match(/frame_(\d+)/i)||[])[1]||0)));
        let frameNames=names.filter(n=>/\/Walk\/east\/frame_\d+\.png$/i.test(n)).sort(byFrame); let frontWalk=false;
        if(frameNames.length<2){ const s=names.filter(n=>/\/Walk\/south\/frame_\d+\.png$/i.test(n)).sort(byFrame); if(s.length>=2){ frameNames=s; frontWalk=true; } }
        if(frameNames.length<2) throw new Error('걷기 프레임(Walk/east frame_*.png)을 못 찾음');
        const nf=Math.min(frameNames.length, 12);   // 걷기 장수를 zip 그대로(6·8 등, 최대 12) — 고등급 8프레임 등 부드러운 모션 지원
        return Promise.all(frameNames.slice(0,nf).map(n=>zip.files[n].async('blob').then(_blobToImg))).then(frames=>{
          const w=frames[0].naturalWidth||48, hgt=frames[0].naturalHeight||48;
          const cv=document.createElement('canvas'); cv.width=w*nf; cv.height=hgt; const ctx=cv.getContext('2d');
          ctx.imageSmoothingEnabled=false; frames.forEach((im,i)=>ctx.drawImage(im,i*w,0,w,hgt));
          const walk=cv.toDataURL('image/png');
          return Promise.all(['south','north','east','west'].map(f=>{ const k=names.find(n=>new RegExp('/rotations/'+f+'\\.png$','i').test(n));
            return k ? zip.files[k].async('base64').then(b=>'data:image/png;base64,'+b) : Promise.resolve(walk); }))
            .then(rots=>({ walk, south:rots[0], north:rots[1], east:rots[2], west:rots[3], frontWalk, frames:nf }));
        });
      });
    }
    // 기존 분류 목록(species→label) — SPECIES_LABEL(런타임 펫 포함) + PET_CATALOG 종 합집합.
    function _speciesOptions(){ const map={};
      Object.keys(SPECIES_LABEL||{}).forEach(s=>{ map[s]=SPECIES_LABEL[s]; });
      (PET_CATALOG||[]).forEach(c=>{ if(c.species && !map[c.species]) map[c.species]=c.species; });
      return Object.keys(map).map(s=>({species:s, label:map[s]})); }
    // 분류 드롭다운 변경 — '직접 입력'이면 코드·라벨 텍스트 입력을 펼치고, 기존 분류면 접는다(값은 submitDevPet이 select에서 읽음).
    function onDevSpeciesChange(){ const sel=$('dpSpeciesSel'), wrap=$('dpCustomWrap'); if(!sel||!wrap) return;
      const custom=sel.value==='__custom__'; wrap.style.display=custom?'block':'none';
      if(custom){ const sp=$('dpSpecies'); if(sp&&typeof sp.focus==='function') setTimeout(()=>sp.focus(),0); } }
    function _petFormHtml(pre){ pre=pre||{};
      const tierOpts=(typeof TIERS!=='undefined'?TIERS:[{id:'normal',name:'일반'}]).map(t=>'<option value="'+t.id+'"'+(pre.tier===t.id?' selected':'')+'>'+t.name+'</option>').join('');
      let h='<div class="field"><label>zip 파일'+(pre.id?' <span class="pill">재업로드 시에만 디자인 교체</span>':'')+'</label><input type="file" id="dpZip" accept=".zip,application/zip" class="input"></div>';
      h+='<div class="field"><label>이름</label><input class="input" id="dpName" value="'+escapeHtml(pre.name||'')+'" placeholder="예: 고랑이" maxlength="16"></div>';
      // 분류: 기존 분류는 드롭다운으로 선택, 목록에 없으면 '직접 입력'으로 코드·라벨 텍스트 입력.
      const _curSp=(pre.species!=null&&pre.species!=='')?pre.species:(pre.id?'':'cat');
      const _spOpts=_speciesOptions(), _known=_spOpts.some(o=>o.species===_curSp), _custom=!!_curSp&&!_known;
      h+='<div class="field"><label>분류</label><select class="input" id="dpSpeciesSel" onchange="onDevSpeciesChange()">'+
        _spOpts.map(o=>'<option value="'+escapeHtml(o.species)+'"'+((_curSp===o.species)?' selected':'')+'>'+escapeHtml(o.label)+' · '+escapeHtml(o.species)+'</option>').join('')+
        '<option value="__custom__"'+(_custom?' selected':'')+'>➕ 직접 입력(새 분류)</option></select></div>';
      h+='<div id="dpCustomWrap" style="display:'+(_custom?'block':'none')+'">'+
        '<div class="field"><label>분류 코드(species)</label><input class="input" id="dpSpecies" value="'+escapeHtml(_custom?pre.species:'')+'" placeholder="cat/dog/tiger…" maxlength="12"></div>'+
        '<div class="field"><label>분류 라벨(알뜰샵 태그)</label><input class="input" id="dpSpeciesLabel" value="'+escapeHtml(_custom?(pre.speciesLabel||''):'')+'" placeholder="예: 호랑이" maxlength="8"></div>'+
        '</div>';
      h+='<div class="row" style="gap:8px;"><div class="field" style="flex:1;"><label>등급</label><select class="input" id="dpTier" onchange="syncPetGacha()">'+tierOpts+'</select></div>'+
         '<div class="field" style="flex:1;"><label>크기(배율)</label><input class="input" id="dpScale" type="number" step="0.1" min="0.3" value="'+(pre.scale||1)+'"></div></div>';
      // 가챠전용 토글 — 켜면 알뜰샵 판매목록에서 숨김(펫알 가챠 풀엔 항상 포함). 등급 바꾸면 기본값(특별↑) 자동 반영.
      h+='<div class="field"><div class="menu-item" style="padding:6px 2px;"><span>가챠전용(알뜰샵 판매 숨김)</span>'+
         '<div class="switch'+(pre.gachaOnly?' on':'')+'" id="dpGacha" role="switch" aria-checked="'+(pre.gachaOnly?'true':'false')+'" onclick="this.classList.toggle(\'on\')"><i></i></div></div>'+
         '<div class="tx-sub" style="margin-top:2px;line-height:1.5;">켜면 <b>알뜰샵 판매목록에서 숨김</b>(펫알 가챠에는 항상 포함). 끄면 등급에 맞춰 <b>은화로 판매</b>돼요.</div></div>';
      return h; }
    // 등급 바꾸면 가챠전용 토글을 등급 기본값으로 스냅 — 단 '추가'일 때만(수정 중엔 사용자가 이미 정한 값을 존중해 스냅하지 않음: 해제가 저장 직전 다시 켜지던 문제 방지).
    function syncPetGacha(){ if(_devPetTarget) return; const t=val('dpTier')||'normal'; const sw=$('dpGacha'); if(sw) sw.classList.toggle('on', tierRank(t)>=tierRank('epic')); }
    function devPetInfo(id){ const c=PET_CATALOG.find(x=>x.id===id)||_deletedPets[id]; if(!c) return null; const sp=PET_SPRITES[id]||{};
      return { id, name:c.name, species:c.species, speciesLabel:(SPECIES_LABEL[c.species]||''), tier:CAT_TIER[id]||'normal', scale:sp.scale||1, gachaOnly:isGachaOnlyCat(id) }; }
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
      // 분류: 드롭다운이 기존 분류면 그 값(라벨은 SPECIES_LABEL에서), '직접 입력'이면 코드·라벨 텍스트에서.
      const _spSel=val('dpSpeciesSel'), _useCustom=(!_spSel||_spSel==='__custom__');
      const _species=_useCustom?((val('dpSpecies')||'cat').trim()||'cat'):_spSel;
      const _label=_useCustom?((val('dpSpeciesLabel')||'').trim()):((SPECIES_LABEL&&SPECIES_LABEL[_spSel])||_spSel);
      const fields={ name, species:_species, speciesLabel:_label,
        tier:val('dpTier')||'normal', scale:Number(val('dpScale'))||1,
        gachaOnly:($('dpGacha')?$('dpGacha').classList.contains('on'):false),   // 가챠전용 전역 오버라이드
        by:state.userEmail||'', at:new Date().toISOString() };
      let savedId=editing?_devPetTarget:null;
      const p = file ? _processPetZip(file) : Promise.resolve(null);
      p.then(art=>{
        const id=editing?_devPetTarget:('rt_'+Date.now().toString(36)); savedId=id;
        if(art){
          // 메타는 catalogPets/{id}, 이미지는 분리 노드 catalogPetArt/{id} — 원자 다중경로 업데이트(메타 필드는 개별 경로로 병합).
          fields.frontWalk=art.frontWalk; fields.hasArt=true; fields.frames=art.frames||6;
          const upd={};
          ['name','species','speciesLabel','tier','scale','gachaOnly','by','at','frontWalk','hasArt','frames'].forEach(k=>{ if(fields[k]!==undefined) upd['catalogPets/'+id+'/'+k]=fields[k]; });
          upd['catalogPetArt/'+id]={ walk:art.walk, south:art.south, north:art.north, east:art.east, west:art.west };
          delete _petArt[id];   // 세션 캐시 무효화(새 아트)
          return db.ref().update(upd);
        }
        // 이미지 없는 수정(메타만) — 기존처럼 병합 update
        return catalogRef().child(id).update(fields);
      }).then(()=>{ toast((editing?'저장':'추가')+' 완료! 🐾');
          // 메인으로 나가지 않고 펫 관리 목록으로 복귀(방금 편집/추가한 펫을 선택 상태로)
          state._devPetSel=savedId; _devPetTarget=null;
          if(typeof openDevPetManager==='function') openDevPetManager(); else closeSheet(); })
        .catch(e=>{ toast((editing?'저장':'추가')+' 실패: '+((e&&e.message)||e), true); const b=$('dpBtn'); if(b){ b.disabled=false; b.textContent=editing?'저장':'추가'; } });
    }
    function devSelectPet(id){ const stage=document.getElementById('pmStage');
      const prevSel=state._devPetSel; state._devPetSel=(prevSel===id?null:id); const newSel=state._devPetSel;
      if(!stage){ openDevPetManager(); return; }   // 시트가 없으면 전체 렌더
      // 이전·현재 선택 셀만 .on 토글(그리드 재빌드·스크롤 튐 없음) + 상단 스테이지만 다시 그림
      [prevSel, newSel].forEach(function(pid){ if(!pid) return; const cell=document.querySelector('.pmcell[data-pid="'+pid+'"]'); if(!cell) return;
        const on=pid===newSel; cell.classList.toggle('on', on); cell.setAttribute('aria-pressed', on?'true':'false'); });
      stage.innerHTML=devPetStageHtml();
      // sticky 스테이지가 화면 밖(위로 스크롤됨)이면 살짝 끌어올려 선택 펫이 보이게(아래로는 안 내림)
      if(newSel){ try{ const r=stage.getBoundingClientRect(); if(r.top<0) stage.scrollIntoView({block:'start'}); }catch(e){} } }
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
    // 개발자 펫 관리(알뜰홈 인벤토리 방식): 상단 스테이지(선택 펫 미리보기+관리 기능) + 아래 종류 탭·펫 그리드(.palette.catinv).
    // 그리드 셀을 탭하면 상단 스테이지(#pmStage)만 다시 그리고 셀 .on 만 토글(devSelectPet) → 그리드 스크롤 유지·재빌드 비용 절감. 스테이지는 sticky라 스크롤해도 선택 펫이 계속 보임.
    function devPetCellHtml(p, sel){ const on=p.id===sel; const tag=(SPECIES_LABEL[p.species]||p.species);
      const gacha=isGachaOnlyCat(p.id), ft=p.tier||'normal';
      return '<button class="pitem pmcell'+(on?' on':'')+(p.deleted?' del':'')+(gacha?' gacha':'')+'" data-pid="'+p.id+'" onclick="devSelectPet(\''+p.id+'\')" aria-label="'+escapeHtml(p.name||p.id)+' 선택" aria-pressed="'+(on?'true':'false')+'">'+
        '<span class="pic tbring tb-'+ft+'">'+catFace(p.id,{h:38})+tierBadgeHtml(ft)+(gacha?'<span class="pm-gc">'+boxSvg({h:12})+'</span>':'')+'</span>'+
        '<span class="pmnm">'+catNameSpan(p.id, p.name||p.id)+'</span>'+
        '<span class="pq">'+escapeHtml(tag)+(p.runtime?' · 런타임':'')+(p.deleted?' · 삭제됨':'')+'</span>'+
      '</button>'; }
    // 상단 스테이지(선택 상태에 따라 바뀌는 부분) — 부분 갱신 대상(#pmStage). 미선택이면 안내 플레이스홀더 + [새 펫 추가].
    function devPetStageHtml(){ const list=allPetsForDev(), sel=state._devPetSel, p=sel?list.find(x=>x.id===sel):null;
      if(!p){ return '<div class="pm-stage empty">'+
          '<div class="pm-pv-art ph">'+catFace('cat_mackerel',{h:60})+'</div>'+
          '<div class="pm-ph-tx">아래에서 펫을 선택하면 여기에서<br><b>등급·가챠전용·수정·삭제·연출</b>을 관리해요.</div>'+
          '<div class="petmg-btns"><button class="btn ghost" onclick="openDevPetAdd()">+ 새 펫 추가</button></div>'+
        '</div>'; }
      const ft=p.tier||'normal', tag=(SPECIES_LABEL[p.species]||p.species), gacha=isGachaOnlyCat(p.id);
      // 🐾 기구물 관리처럼 스테이지에서 바로 등급·가챠전용 변경(전역 catalogPets/{id} 오버라이드 — 모든 사용자 반영)
      const tierSel='<select class="input fm-tier" onchange="setPetTier(\''+p.id+'\',this.value)" aria-label="'+escapeHtml(p.name||p.id)+' 등급">'+
        TIERS.map(function(t){ return '<option value="'+t.id+'"'+(t.id===ft?' selected':'')+'>'+t.name+'</option>'; }).join('')+'</select>';
      const gachaTog='<label class="fm-gacha"><span>가챠전용</span><span class="switch'+(gacha?' on':'')+'" role="switch" aria-checked="'+gacha+'" tabindex="0" onclick="setPetGacha(\''+p.id+'\')" aria-label="'+escapeHtml(p.name||p.id)+' 가챠전용"><i></i></span></label>';
      // 한정(exclusive) 등급 펫만: '가챠 등장' 토글(ON=가챠 한정 리스트·확률에 포함). 다른 등급엔 표시 안 함.
      const exOn=isExGachaActive(p.id);
      const exTog=(ft==='exclusive')?'<label class="fm-gacha"><span>가챠 등장</span><span class="switch'+(exOn?' on':'')+'" role="switch" aria-checked="'+exOn+'" tabindex="0" onclick="setPetExActive(\''+p.id+'\')" aria-label="'+escapeHtml(p.name||p.id)+' 가챠 등장"><i></i></span></label>':'';
      const badge=gacha?'<div class="pm-pv-badge"><span class="fm-badge tier-rainbow">'+boxSvg({h:13})+' 랜덤박스 전용</span></div>':'';
      const dr = p.deleted ? '<button class="btn" onclick="restorePet(\''+p.id+'\')">복구</button>'
        : '<button class="btn danger" onclick="deletePetSoft(\''+p.id+'\')">삭제</button>';
      let h='<div class="pm-stage sel">'+
        '<div class="pm-preview">'+
          '<div class="pm-pv-art tbring tb-'+ft+(p.deleted?' del':'')+'">'+catActorHTML(p.id,84)+'</div>'+
          '<div class="pm-pv-info">'+
            '<div class="pm-pv-nm">'+catNameSpan(p.id, p.name||p.id)+'</div>'+
            '<div class="pm-pv-meta">'+escapeHtml(tag)+(p.runtime?' · 런타임':'')+(p.deleted?' · 삭제됨':'')+'</div>'+
            badge+
            '<div class="pm-cfgctl">'+tierSel+gachaTog+exTog+'</div>'+
          '</div>'+
        '</div>'+
        '<div class="petmg-btns"><button class="btn ghost" onclick="openDevPetAdd()">추가</button>'+
          '<button class="btn" onclick="openDevPetEdit(\''+p.id+'\')">수정</button>'+dr+'</div>';
      // 🎬 가챠 오픈 연출 펫 지정(전역 config/gachaFx — 모든 사용자에게 즉시 적용). 선택 펫을 연출 1번(왼쪽)/2번(오른쪽)에 배정(다시 누르면 해제).
      h+='<div class="sec-title" style="margin-top:14px;">가챠 오픈 연출 펫 <span class="pill">한정 뽑기 전용</span></div>';
      if(!p.deleted){
        const sa=gachaFxSlotOf(p.id);   // 'a'|'b'|null (현재 이 펫이 배정된 슬롯)
        h+='<div class="petmg-btns">'+
           '<button class="btn'+(sa==='a'?'':' ghost')+'" aria-pressed="'+(sa==='a'?'true':'false')+'" onclick="setGachaFxSlot(\'a\',\''+p.id+'\')">연출 1번(왼쪽)'+(sa==='a'?' ✓':'')+'</button>'+
           '<button class="btn'+(sa==='b'?'':' ghost')+'" aria-pressed="'+(sa==='b'?'true':'false')+'" onclick="setGachaFxSlot(\'b\',\''+p.id+'\')">연출 2번(오른쪽)'+(sa==='b'?' ✓':'')+'</button></div>';
      } else {
        h+='<p class="muted" style="font-size:11.5px;line-height:1.5;margin:6px 2px 0;">삭제(숨김)된 펫은 연출에 지정할 수 없어요. <b>복구</b> 후 지정하세요.</p>';
      }
      h+='<p class="muted" style="font-size:11.5px;line-height:1.5;margin:8px 2px 0;">여기 지정한 펫은 <b>한정(무지개) 등급을 뽑을 때만</b> 연출에 등장해요. <b>그 외 등급</b>(특별·전설·신화)은 <b>전설·신화 펫 중 랜덤 2마리</b>가 걸어나와 톡 칩니다. <b>1번</b>=왼쪽, <b>2번</b>=오른쪽(둘 다면 <b>1번 끝난 뒤 2번</b> 순차, 크기는 펫 배율만큼). 현재 1번=<b>'+escapeHtml(gachaFxSlotDesc('a'))+'</b> · 2번=<b>'+escapeHtml(gachaFxSlotDesc('b'))+'</b>.</p>';
      h+='<div class="petmg-btns" style="margin-top:8px;"><button class="btn ghost" onclick="devPreviewGachaFx()">▶︎ 연출 미리보기</button></div>';
      h+='</div>';
      return h; }
    let _devPetSpecies=lsGet('devPetSpecies','all');   // 개발자 펫 관리 종류 탭
    function setDevPetSpecies(s){ _devPetSpecies=s||'all'; lsSet('devPetSpecies',_devPetSpecies); if(state._sheetRefresh) state._sheetRefresh(); }
    function openDevPetManager(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용'); return; }
      const build=()=>{ const all=allPetsForDev(), sel=state._devPetSel;
        // 종류 탭(삭제·런타임 포함 존재하는 종, SPECIES_LABEL 순 + 개수 배지)
        const cnt={}; all.forEach(p=>{ const s=p.species||'cat'; cnt[s]=(cnt[s]||0)+1; });
        const order=Object.keys(SPECIES_LABEL), present=Object.keys(cnt).sort((a,b)=>{ const ia=order.indexOf(a),ib=order.indexOf(b); return (ia<0?99:ia)-(ib<0?99:ib); });
        const tabs=[['all','전체',all.length]].concat(present.map(s=>[s,(SPECIES_LABEL[s]||s),cnt[s]]));
        if(!tabs.some(t=>t[0]===_devPetSpecies)) _devPetSpecies='all';
        const list=all.filter(p=> _devPetSpecies==='all' || (p.species||'cat')===_devPetSpecies);
        // 상단 스테이지(선택 펫 미리보기+관리) — sticky. 아래는 종류 탭 + 등급별 펫 그리드(알뜰홈 인벤토리 방식).
        let h='<div id="pmStage" class="pm-stage-wrap">'+devPetStageHtml()+'</div>';
        h+='<p class="muted" style="font-size:12.5px;margin:2px 2px 10px;line-height:1.5;">아래에서 펫을 골라 위 스테이지에서 <b>등급·가챠전용·수정/삭제·연출</b>을 관리해요. 삭제=앱에서 숨김(이미지 보존)이라 <b>복구</b> 가능. 변경은 <span class="pill">전역 · 모든 사용자</span> 반영(기구물 관리와 동일).</p>';
        h+='<div class="subseg pettabs">'+tabs.map(t=>'<button class="'+(_devPetSpecies===t[0]?'on':'')+'" onclick="setDevPetSpecies(\''+t[0]+'\')">'+escapeHtml(t[1])+' <b>'+t[2]+'</b></button>').join('')+'</div>';
        // 등급별 섹션(도감식) — 활성 펫은 등급 그룹 그리드, 삭제됨은 맨 끝 섹션
        const active=list.filter(p=>!p.deleted), del=list.filter(p=>p.deleted); let body='';
        TIER_ORDER.forEach(function(tid){ const grp=active.filter(p=>p.tier===tid); if(!grp.length) return;
          body+='<div class="dexgh pmgh"><span class="dexgt">'+tierLabelHtml(tid)+'</span><span class="dexgn">'+grp.length+'</span></div>';
          body+='<div class="palette catinv pmgrid">'+grp.map(p=>devPetCellHtml(p, sel)).join('')+'</div>'; });
        if(del.length){ body+='<div class="dexgh pmgh"><span class="dexgt" style="color:var(--sub)">삭제됨</span><span class="dexgn">'+del.length+'</span></div>';
          body+='<div class="palette catinv pmgrid">'+del.map(p=>devPetCellHtml(p, sel)).join('')+'</div>'; }
        h+=body || '<div class="empty" style="padding:16px;">이 종류의 펫이 없어요</div>';
        return h; };
      openSheet('펫 관리', build());
      // 등급·가챠전용 변경(catalogPets 리스너) 시 목록 갱신 — 스크롤·선택 유지
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(!b) return; const st=b.scrollTop; b.innerHTML=build(); b.scrollTop=st; }; }

    // ===== 🪑 기구물 관리(개발자·전역) — 타입 탭(가구·벽지·바닥)으로 펫이 아닌 모든 아이템의 이미지·등급·은화가 편집. 특별↑ 등급은 자동 랜덤박스 전용 =====
    const FURN_TYPES = [['item','가구'],['wall','벽지'],['floor','바닥']];
    let _furnSub=null;
    function openDevFurnManager(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용'); return; }
      if(_furnSub==null) _furnSub='item';
      const build=()=>furnMgrHtml();
      openSheet('기구물 관리', build());
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(!b) return; const st=b.scrollTop; b.innerHTML=build(); b.scrollTop=st; }; }
    function setFurnSub(s){ _furnSub=s; if(state._sheetRefresh) state._sheetRefresh(); }
    function furnMgrHtml(){
      let h='<div class="note"><span class="pill">전역 · 모든 사용자</span> 변경은 <b>즉시 저장·전 사용자 반영</b>돼요(관리자 계정만 쓰기 가능). <b>특별 등급 이상</b>은 기본적으로 <b>랜덤박스 전용</b>이며, <b>가챠전용</b> 토글로 개별 지정할 수 있어요(켜면 알뜰샵 판매목록에서 숨김 · 어느 쪽이든 랜덤박스 풀엔 포함).</div>';
      h+='<div class="subseg">'+FURN_TYPES.map(function(c){ return '<button class="'+(_furnSub===c[0]?'on':'')+'" onclick="setFurnSub(\''+c[0]+'\')">'+c[1]+'</button>'; }).join('')+'</div>';
      let entries, rowFn, tierOf;
      if(_furnSub==='wall'){ entries=WALLPAPER_CATALOG.filter(w=>w.id!=='default'); rowFn=wallRowHtml; tierOf=wallTierOf; }
      else if(_furnSub==='floor'){ entries=FLOOR_CATALOG.filter(f=>f.id!=='default'); rowFn=floorRowHtml; tierOf=floorTierOf; }
      else { entries=ITEM_CATALOG.slice(); rowFn=itemRowHtml; tierOf=itemTierOf; }
      // 등급별 섹션(펫 관리와 동일 pmgh 패턴)
      let body='';
      TIER_ORDER.forEach(function(tid){ const grp=entries.filter(function(e){ return tierOf(e.id)===tid; }); if(!grp.length) return;
        body+='<div class="dexgh pmgh"><span class="dexgt">'+tierLabelHtml(tid)+'</span><span class="dexgn">'+grp.length+'</span></div>'+
          '<div class="fmlist">'+grp.map(rowFn).join('')+'</div>'; });
      h+=body||'<div class="empty" style="padding:16px;">항목이 없어요</div>';
      return h;
    }
    function fmOver(cfg, id){ return !!(cfg && cfg[id] && (cfg[id].tier!=null || cfg[id].price!=null || cfg[id].gacha!=null)); }
    // 공용 행: kind=item|wall|floor 에 따라 저장 함수(setFurnTier/setWallTier/setFloorTier…)만 다르다.
    function fmRowHtml(kind, id, name, thumb, tier, price, gacha, overridden){
      const P=({item:['setFurnTier','setFurnPrice','resetFurn','setFurnGacha'],wall:['setWallTier','setWallPrice','resetWall','setWallGacha'],floor:['setFloorTier','setFloorPrice','resetFloor','setFloorGacha']})[kind];
      const tierSel='<select class="input fm-tier" onchange="'+P[0]+'(\''+id+'\',this.value)" aria-label="'+escapeHtml(name)+' 등급">'+
        TIERS.map(function(t){ return '<option value="'+t.id+'"'+(t.id===tier?' selected':'')+'>'+t.name+'</option>'; }).join('')+'</select>';
      const priceInp='<span class="fm-price"><span class="ci">'+coinSvg({h:14})+'</span><input class="input" type="number" inputmode="numeric" min="0" value="'+price+'"'+(gacha?' disabled':'')+' onchange="'+P[1]+'(\''+id+'\',this.value)" aria-label="'+escapeHtml(name)+' 은화 가격"></span>';
      const gachaTog='<label class="fm-gacha"><span>가챠전용</span><span class="switch'+(gacha?' on':'')+'" role="switch" aria-checked="'+gacha+'" tabindex="0" onclick="'+P[3]+'(\''+id+'\')" aria-label="'+escapeHtml(name)+' 가챠전용"><i></i></span></label>';
      const badge=gacha?'<span class="fm-badge tier-rainbow">'+boxSvg({h:13})+' 랜덤박스 전용</span>':'';
      const reset=overridden?'<button class="fm-reset" onclick="'+P[2]+'(\''+id+'\')" aria-label="기본값으로">기본값</button>':'';
      return '<div class="fmrow'+(gacha?' gacha':'')+'">'+
        '<span class="fm-thumb">'+thumb+'</span>'+
        '<div class="fm-body"><div class="fm-top"><b class="tier-'+tier+'">'+escapeHtml(name)+'</b>'+badge+reset+'</div>'+
          '<div class="fm-ctl">'+tierSel+priceInp+gachaTog+'</div></div></div>';
    }
    function itemRowHtml(it){ return fmRowHtml('item', it.id, it.name, '<span class="furnfit">'+furnSvg(it.id,{fit:true})+'</span>', itemTierOf(it.id), itemBuyPrice(it.id), isGachaOnlyItem(it.id), fmOver(_furnCfg,it.id)); }
    function wallRowHtml(w){ return fmRowHtml('wall', w.id, w.name, '<span class="fm-swatch" style="background:'+wallCss(w.id)+'"></span>', wallTierOf(w.id), wallBuyPrice(w.id), isGachaOnlyWall(w.id), fmOver(_wallCfg,w.id)); }
    function floorRowHtml(f){ return fmRowHtml('floor', f.id, f.name, '<span class="fm-swatch" style="background:'+floorCss(f.id)+'"></span>', floorTierOf(f.id), floorBuyPrice(f.id), isGachaOnlyFloor(f.id), fmOver(_floorCfg,f.id)); }
    // 전역 저장(관리자만) — onchange 즉시 반영. price 빈값/음수면 오버라이드 제거(기본값 복귀).
    // 등급 선택 시 가격 오버라이드를 지워 가격이 등급가(TIER_PRICE)를 따르게 한다(관리 화면이 즉시 재렌더돼 금액 반영).
    // 🏭 개발자 기구물/벽지/바닥 전역 오버라이드 저장 — ASSET_TYPES 테이블 기반 제네릭(경로·카탈로그·라벨만 다름). 기존 함수명(setFurnTier 등)은 얇은 별칭(HTML onchange 호출부 변경 0).
    function _assetName(type,id){ const c=ASSET_TYPES[type].catalog.find(function(x){ return x.id===id; }); return c?c.name:id; }
    function setAssetTier(type,id,tier){ if(!(typeof isDev==='function'&&isDev())) return; const A=ASSET_TYPES[type];
      db.ref(A.path+'/'+id).update({tier:tier, price:null}).then(function(){ toast(_assetName(type,id)+A.label+' 등급 = '+tierInfo(tier).name+' · 가격 '+(TIER_PRICE[tier]||0)+' 은화'); }).catch(_cfgWriteErr); }
    function setAssetPrice(type,id,val){ if(!(typeof isDev==='function'&&isDev())) return; const A=ASSET_TYPES[type];
      const n=parseInt(val,10); const ref=db.ref(A.path+'/'+id+'/price'); const nm=_assetName(type,id);
      if(isNaN(n)||n<0){ ref.set(null).then(function(){ toast(nm+A.label+' 가격 기본값'); }).catch(_cfgWriteErr); }
      else { ref.set(n).then(function(){ toast(nm+A.label+' 가격 = '+n+' 은화'); }).catch(_cfgWriteErr); } }
    function resetAsset(type,id){ if(!(typeof isDev==='function'&&isDev())) return; const A=ASSET_TYPES[type];
      db.ref(A.path+'/'+id).remove().then(function(){ toast(_assetName(type,id)+A.label+' 기본값으로 되돌렸어요'); }).catch(_cfgWriteErr); }
    // 가챠전용 토글(현재 유효값을 뒤집어 저장) — 켜면 알뜰샵 판매목록 숨김, 꺼면 은화 판매. 어느 쪽이든 랜덤박스 풀엔 그대로.
    function setAssetGacha(type,id){ if(!(typeof isDev==='function'&&isDev())) return; const A=ASSET_TYPES[type]; const on=!isGachaOnlyAsset(type,id);
      db.ref(A.path+'/'+id+'/gacha').set(on).then(function(){ toast(_assetName(type,id)+A.label+(on?' 가챠전용 ON(판매 숨김)':' 가챠전용 OFF(은화 판매)')); }).catch(_cfgWriteErr); }
    // 별칭(HTML onchange 호출부 유지) — 가구/벽지/바닥
    function setFurnTier(id, tier){ return setAssetTier('furniture',id,tier); }
    function setFurnPrice(id, val){ return setAssetPrice('furniture',id,val); }
    function resetFurn(id){ return resetAsset('furniture',id); }
    function setFurnGacha(id){ return setAssetGacha('furniture',id); }
    function setWallTier(id, tier){ return setAssetTier('wallpaper',id,tier); }
    function setWallPrice(id, val){ return setAssetPrice('wallpaper',id,val); }
    function resetWall(id){ return resetAsset('wallpaper',id); }
    function setWallGacha(id){ return setAssetGacha('wallpaper',id); }
    function setFloorTier(id, tier){ return setAssetTier('floor',id,tier); }
    function setFloorPrice(id, val){ return setAssetPrice('floor',id,val); }
    function resetFloor(id){ return resetAsset('floor',id); }
    function setFloorGacha(id){ return setAssetGacha('floor',id); }
    // 🐾 펫 등급/가챠전용 전역 오버라이드(config/furniture 와 달리 펫은 catalogPets/{id} 레코드에 저장 — applyCatalog가 CAT_TIER·_petGachaOnly에 반영). 정적 펫이면 부분 오버라이드 레코드가 생기고, 런타임 펫이면 기존 레코드의 해당 필드만 갱신(다른 필드·이미지 보존).
    function setPetTier(id, tier){ if(!(typeof isDev==='function'&&isDev())) return;
      db.ref('catalogPets/'+id+'/tier').set(tier).then(function(){ toast((catName(id)||id)+' 등급 = '+tierInfo(tier).name); }).catch(_cfgWriteErr); }
    function setPetGacha(id){ if(!(typeof isDev==='function'&&isDev())) return; const on=!isGachaOnlyCat(id);
      db.ref('catalogPets/'+id+'/gachaOnly').set(on).then(function(){ toast((catName(id)||id)+(on?' 가챠전용 ON(펫알 전용·판매 숨김)':' 가챠전용 OFF(은화 판매 허용)')); }).catch(_cfgWriteErr); }
    // 한정 펫 '가챠 등장' 토글 — ON=가챠 한정 리스트·확률에 포함, OFF=제외. catalogPets/{id}.exActive 전역 저장.
    function setPetExActive(id){ if(!(typeof isDev==='function'&&isDev())) return; const on=!isExGachaActive(id);
      db.ref('catalogPets/'+id+'/exActive').set(on).then(function(){ toast((catName(id)||id)+(on?' 가챠 등장 ON(한정 리스트 포함)':' 가챠 등장 OFF(가챠 제외)')); }).catch(_cfgWriteErr); }

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
            '<span class="pm-txt"><span class="pm-nm">'+catNameSpan(p.id, p.name||p.id)+'</span>'+
            '<span class="pm-meta">'+escapeHtml(tag)+' · '+tierLabelHtml(p.tier)+' · 런타임</span></span></button>'; }).join('')+'</div>';
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
        '<div class="cr-wall" style="background:'+wallCss(currentWall())+'"></div><div class="cr-floor" style="background:'+floorCss(currentFloor())+'"></div><div class="cr-base"></div>'+
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
      const depth=(12-frontRow)/11; const bottom=(3+depth*46).toFixed(1); const fh=furnRoomH(p.itemId,isDock,depth);   // dock·홈 동일 깊이 매핑(바닥 54%) → 뒤 가구가 펫과 같은 바닥선에 정렬
      // 원근 가림: 앞(frontRow 큰 값)일수록 z-index를 높여 앞 가구가 뒤 가구를 덮게 한다.
      // (밥·물그릇/화장실의 고정 z-index:2가 이 깊이 순서를 깨뜨리던 문제 → 인라인 z-index로 덮어씀)
      const z=isFloorItem(p.itemId) ? 0 : Math.max(1, Math.round(frontRow));   // 바닥 아이템(러그)=맨 뒤(z:0) → 그 위 가구가 앞에 그려짐
      const tap=!plain && (p.itemId==='bowl'||p.itemId==='waterbowl');   // 친구 방(plain)은 밥그릇 채움·똥·탭 없이 정적 렌더
      // 캠(dock·홈 LIVE)에서만 연출(live) — 미리보기/친구 방/샵/팔레트는 정적. 연출 가구는 base+fx 두 겹으로.
      let inner=tap? furnRoomSvg(p.itemId,p.key,{h:fh}) : (live&&FURN_ANIM[p.itemId] ? furnLiveSvg(p.itemId,{h:fh}) : furnSvg(p.itemId,{h:fh}));
      if(!plain && p.itemId==='litterbox'){ const slots=p._poops||[]; const ph=Math.max(6,Math.round(fh*0.32));
        inner+=slots.map(s=>'<span class="poop" role="button" tabindex="0" onclick="collectPoop(event)" style="left:'+(20+(s%3)*26)+'%;top:'+(30+((s/3|0)*20))+'%;height:'+ph+'px" title="치우기 +'+POOP_REWARD+' 은화">'+poopSvg({h:ph})+'</span>').join(''); }
      return '<div class="cr-prop'+(tap?' cr-tap':'')+(p.itemId==='litterbox'?' cr-litter':'')+'" style="left:'+x+'%;bottom:'+bottom+'%;z-index:'+z+';--crtx:'+txPct+'%;transform:translateX(var(--crtx));"'+(tap?' role="button" tabindex="0" onclick="event.stopPropagation();feedBowl(\''+p.key+'\')"':'')+'>'+inner+'</div>';
    }
    // 배치 가구 마크업을 "바닥 아이템(러그·연못) 먼저 → 그 외"로 나눠 반환. 바닥 아이템은 z:0이라 그 외(z≥1)엔 이미 밀리지만,
    // 벽 가구도 z:0(같은 값)이라 DOM 순서가 앞서면 바닥 아이템 위로 그려진다 → 바닥 아이템을 항상 맨 앞(=맨 아래 레이어)에 두어
    // 러그가 벽 가구·일반 가구·펫 무엇보다도 아래로 보이게 한다(사용자 지침).
    function splitProps(list, mapFn){ let floor='', other=''; list.forEach(function(p){ if(isFloorItem(p.itemId)) floor+=mapFn(p); else other+=mapFn(p); }); return { floor:floor, other:other }; }
    // 우측 상단 "일괄 돌보기" 버튼(밥·물 채우고 똥 치우기) — dock·홈 공용
    // 캠 우상단: [돌보기] + [지갑(은화·금화 갯수)]. 돌보기는 왼쪽으로, 오른쪽에 실시간 재화 카운터(쓰다듬기·돌보기 보상이 여기로 날아와 카운트업).
    // 표시값은 _walletDisp(카운트업 진행값) 우선 → 재렌더가 끼어들어도 롤업이 끊기지 않음.
    let _walletDisp={coins:null,gold:null}, _walletGen={coins:0,gold:0};
    function walletCoinDisp(){ return _walletDisp.coins!=null?_walletDisp.coins:coins(); }
    function walletGoldDisp(){ return _walletDisp.gold!=null?_walletDisp.gold:gold(); }
    function walletHtml(){ return '<div class="cd-wallet" aria-label="보유 은화·금화">'+
      '<span class="cw-coin"><span class="cw-ic">'+coinSvg({h:14})+'</span><span class="cw-n">'+walletCoinDisp().toLocaleString()+'</span></span>'+
      '<span class="cw-gold"><span class="cw-ic">'+goldSvg({h:14})+'</span><span class="cw-n">'+walletGoldDisp().toLocaleString()+'</span></span></div>'; }
    // ❤️ 행복도 입력 산출(순수 roomMood에 넘길 값): 밥·물 신선도·평균 애정·수확 신선도 등
    function roomMoodInputs(g, R){ const now=Date.now();
      let bowls=0, fr=0; const pl=(R&&R.placed)||{};
      Object.keys(pl).forEach(k=>{ const e=pl[k]; if(e&&(e.itemId==='bowl'||e.itemId==='waterbowl')){ bowls++; fr+=e.filledAt?Math.max(0,Math.min(1,(FILL_MS-(now-e.filledAt))/FILL_MS)):0; } });
      const affs=(R&&R.active||[]).map(id=>affectionLevel(((g&&g.owned&&g.owned.cats[id])||{}).affection||0).level);
      const ca=Number(R&&R.caredAt)||0;
      return { pets:(R&&R.active||[]).length, furn:interactiveFurnCount(R), poops:Number(R&&R.poops)||0,
        feedFrac: bowls?fr/bowls:0, avgAff: affs.length?affs.reduce((a,b)=>a+b,0)/affs.length:0,
        caredFresh: ca?Math.max(0,1-(now-ca)/MOOD_CARE_MS):0 }; }
    function batchBtnHtml(){ const g=state.game, R=g?room():null;
      const pend=g?allRoomsIdleYield(g):0, mood=g?roomMood(roomMoodInputs(g,R)):0;   // 대기 수익 = 모든 방 합
      return '<div class="cr-topright">'+
        '<span class="cr-mood" title="행복도 '+mood+'% — 밥·물 챙기고 🌾수확하면 올라가요(똥은 감점)">'+heartSvg({h:13,off:mood<45})+'<b>'+mood+'%</b></span>'+
        '<button class="cr-batch'+(pend>0?' has-yield':'')+'" onclick="event.stopPropagation();batchCare(this)" aria-label="전체 수확: 모든 방의 유휴 가구수익 받고 밥·물 채우고 똥 정리">수확'+(pend>0?'<span class="yield-chip">+'+pend+'</span>':'')+'</button>'+walletHtml()+'</div>'; }
    // 배치 가구를 무대 바닥에 배경으로(가로=열, 앞뒤 깊이=행)
    function renderDockProps(){
      const box=$('cdProps'); if(!box) return;
      reconcilePets();   // 캠 화면에서도 3시간 만료→똥 정산
      // 원근: 뒤(행 큰 값)일수록 위로·작게, 앞(행 작은 값)일수록 아래로·크게. 앞 가구가 뒤 가구를 덮도록 뒤부터.
      const list=placedList().sort((a,b)=>a.r-b.r); distributePoops(list);
      const wallProps=wallPlacedList().map(p=>wallPropMarkup(p,true,true)).join('');   // 벽 가구(뒤 벽면, z:0)
      const sp=splitProps(list, p=>propMarkup(p,true,false,true));   // 바닥 아이템(러그·연못) 먼저 → 맨 아래
      box.innerHTML=sp.floor+wallProps+sp.other;   // 바닥 아이템 → 벽 가구 → 일반 가구. live=true → dock 캠 연출
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
      stage.innerHTML=list.map((id,i)=>{ const s=petActorPx(id,24,120); return '<div class="cd-actor" data-cat="'+id+'" data-hh="'+s+'" style="left:'+(12+i*54)+'px;">'+catActorHTML(id,s)+'</div>'; }).join('');
      markCatDirty();
    }
    // ---- 통합 걷기 엔진: 단일 rAF가 "지금 보이는 무대"(시트 방 또는 dock)만 애니메이션 ----
    // 고양이는 방/시트에 배치된 가구로 가끔 다가가 잠시 머문다(상호작용). 스트립엔 가구가 없어 자유 배회.
    // 🔋 가벼운 모드(저사양) — 사용자가 켜면 '장식/무거운 애니만' 끈다: 가구 연출·구름·나비·씬 정지, 걷기 엔진은 낮은 fps로 '계속 걷고', 가챠도 알/박스 탭·균열·결과 과정을 그대로 보여주되 흔들림·파티클·오오라만 제거(body.lite CSS). 저사양 폰 배터리/발열/버벅임 완화.
    //   ⚠️ OS 'prefers-reduced-motion'(접근성=전면 정적)과는 분리 — 라이트는 걷기·탭 같은 '기능성' 모션은 유지한다.
    function liteMode(){ try{ return localStorage.getItem('liteMode')==='1'; }catch(e){ return false; } }
    function reducedMotion(){ try{ return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }
    function applyLiteMode(){ try{ if(document&&document.body) document.body.classList.toggle('lite', liteMode()); }catch(e){} }
    function setLiteMode(on){ try{ localStorage.setItem('liteMode', on?'1':'0'); }catch(e){} applyLiteMode();
      if(typeof markCatDirty==='function') markCatDirty(); if(typeof startCatLoop==='function') startCatLoop();   // 엔진 fps 예산 재평가·정지스틸 재빌드
      if(typeof rerender==='function') rerender();
      toast(on?'🔋 가벼운 모드 ON — 애니메이션을 줄여 배터리·발열을 아껴요':'가벼운 모드 OFF'); }
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
        const pk=$('pkStage'); if(pk && out.indexOf(pk)<0) out.push(pk);                         // 🌈 알뜰샵 가챠 탭 한정 픽업 배너 씬(있을 때만 = 그 탭일 때만 DOM 존재)
      }
      if(dockMode()!=='hidden'){ const s=$('cdStage'); if(s && out.indexOf(s)<0) out.push(s); }  // 하단 dock 캠(시트가 떠 있어도 계속 로밍)
      const pr=$('pkRevStage'); if(pr && out.indexOf(pr)<0) out.push(pr);                          // 🌲 전설/신화/한정 등장 연출 배경 씬의 픽업 펫 배회(연출 떠 있을 때만 DOM 존재)
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
      const roomEl = stage.closest('.catroom') || stage.closest('.cd-room');
      const roomH = (roomEl && roomEl.clientHeight) || (isDock?160:244);   // dock 캠 높이 110→160(.cd-room)과 동기화(벽 가구 안 잘리게)
      // 위에서 내려다보는(탑다운) 느낌: 맨 앞(depth0)=바닥 앞끝, 맨 뒤(depth1)=바닥 뒤끝(벽지 경계)에 닿게.
      // dock·홈(.catroom) 둘 다 바닥 54%로 통일 → 같은 riseMax 비율(0.53)로 뒤 펫이 벽지 경계에 닿는다(예전 dock 0.61은 바닥 66% 기준이라 벽에 못 닿았음).
      // (발밑 여백 상쇄 pad는 깊이와 무관하게 적용되어 맨 앞은 여전히 바닥에 붙음 — 뜨는 문제 재발 없음.)
      const riseMax = roomH*0.53;
      // 가구 위치(발자국 중앙 x)·렌더 높이(fh)·깊이(depth) — 상호작용 시 올라갈 높이·앞뒤 정렬(가림)에 사용
      const noProps = !!stage.dataset.noprops;   // 🌈 픽업 배너(#pkStage): 방 원근은 쓰되 사용자 가구 상호작용은 끔(장식만 있는 씬 → 자유 배회)
      const plist = (isFriend && state._friendCam) ? state._friendCam.placedList : placedList();   // 친구 방이면 친구 가구로 상호작용
      const props = (hasRoom && !noProps) ? plist.map(p=>{ const foot=itemFoot(p.itemId), depth=(12-(p.r+foot.h-1))/11;   // propMarkup과 동일(앞줄 기준)
        const fh=furnRoomH(p.itemId, isDock, depth);   // 렌더 높이와 동일 → 캣타워 층 lift가 실제 높이에 맞음
        // 그래픽 중앙 x — propMarkup의 camAnchorMode(가운데/양끝 스냅)와 동일하게 계산해 펫이 가구 중앙에 정렬(캣타워 중앙 앉기).
        // 그래픽 폭 w=fh*aspect. left=w/2, right=W-w/2, center=발자국 중앙*W.
        const mode=camAnchorMode(p.c, foot.w), w=fh*furnAspect(p.itemId);
        const cx = mode==='left'? w/2 : mode==='right'? W-w/2 : (gridLeftFrac(p.c)+gridSpanFrac(foot.w)/2)*W;
        return { x: cx, itemId:p.itemId, fh, key:p.key, depth }; }) : [];
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
      // 어항: 앞에서 정면(south)을 보며 앉아 금붕어를 구경(약 16~40초).
      if(it==='fishtank') return { lift:0, face:'south', dx:Math.round(a.sw*0.25), pose:'sit', dur:16000+Math.random()*24000 };
      // 창문: 곁에 앉아 볕을 쬐며 쉼(정면, 약 18~44초).
      if(it==='window') return { lift:0, face:'south', dx:Math.round(a.sw*0.35)*(Math.random()<0.5?1:-1), pose:'loaf', dur:18000+Math.random()*26000 };
      // 벽난로: 앞에서 정면으로 몸 말고 아늑하게 오래 쉼(약 24~54초).
      if(it==='fireplace') return { lift:0, face:'south', dx:Math.round(a.sw*0.3)*(Math.random()<0.5?1:-1), pose:'loaf', dur:24000+Math.random()*30000 };
      // 선풍기: 곁에서 바람 쐬며 쉼.
      if(it==='fan') return { lift:0, face:'south', dx:0, pose:'loaf', dur:16000+Math.random()*20000 };
      // 해먹: 그물 안으로 올라가(lift) 정면 보며 오래 누움(약 30~70초).
      if(it==='hammock') return { lift:Math.round(fh*0.42), face:'south', dx:0, pose:'loaf', dur:30000+Math.random()*40000 };
      // 낚싯대 장난감: 옆에서 앉아 깃털을 톡톡(약 12~28초).
      if(it==='teaser') return { lift:0, face:(Math.random()<0.5?'east':'west'), dx:Math.round(a.sw*0.4)*(Math.random()<0.5?1:-1), pose:'sit', dur:12000+Math.random()*16000 };
      // 방울공: 옆에서 앉아 공을 굴리며 놈(약 10~24초).
      if(it==='jingleball') return { lift:0, face:'south', dx:Math.round(a.sw*0.3), pose:'sit', dur:10000+Math.random()*14000 };
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
          const avail=a.props.filter(p=>!isFloorItem(p.itemId) && occupantsOf(p.key,a,actors).n < (p.itemId==='tower'?3:1));   // 빈 가구만(캣타워는 남은 층 있으면). 바닥 아이템(러그)은 상호작용 대상 아님(위로 걸어다님)
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
      _eng.raf=requestAnimationFrame(catLoop);      // 다음 프레임 먼저 예약(아래 작업이 예외로 죽어도 루프 유지 — 예전엔 예외 시 재예약이 건너뛰어져 펫이 앱 재시작까지 완전 정지)
      // 🔋 프레임레이트 캡 — 걷기는 30fps면 충분히 부드럽다(저사양 폰 CPU/GPU·배터리 절반↓). 가벼운 모드는 22fps로 더 낮추되 '계속 걷는다'. OS 모션 최소화(접근성)만 5fps로 사실상 정지.
      const budget = reducedMotion() ? 200 : (liteMode() ? 45 : 33);
      const since = _eng.last ? ts-_eng.last : 999;
      if(since < budget) return;                    // 아직 프레임 예산이 안 참 → 이 rAF는 그냥 넘김(무거운 activeStages/stepActors 스킵)
      const dt=Math.min(50, since); _eng.last=ts;
      try{
        const want=activeStages();
        // 무대 집합이 바뀌었거나 dirty면 그룹 재구성 — 유지되는 무대의 액터는 재사용해 애니메이션 상태 보존, 새 무대만 buildActors.
        const changed=_eng.dirty || _eng.groups.length!==want.length || _eng.groups.some(g=>want.indexOf(g.stage)<0);
        if(changed){ _eng.groups=want.map(st=>{ const ex=_eng.dirty?null:_eng.groups.find(g=>g.stage===st); return ex||{ stage:st, actors:buildActors(st) }; }); _eng.dirty=false; }
        if(!reducedMotion()) _eng.groups.forEach(g=>{ if(g.actors.length) stepActors(dt, g.actors); });   // 모든 무대(dock + 열린 방)를 함께 굴림
      }catch(e){ /* 이 프레임만 건너뛰고 다음 프레임 계속 */ }
    }
    function startCatLoop(){ if(!_eng.raf && !(typeof document!=='undefined'&&document.hidden)) _eng.raf=requestAnimationFrame(catLoop); }
    if(typeof document!=='undefined') document.addEventListener('visibilitychange', function(){ if(!document.hidden){ _eng.last=0; startCatLoop(); } });   // 탭 복귀 시 루프 재개

    // ===== 캠/방에서 펫을 바로 끌어(드래그) 좌우로 이동 =====
    let _petDrag=null, _petJustDragged=false;
    function camTap(){ if(_petJustDragged) return; openCatHouse(); }   // 드래그 직후의 탭은 알뜰샵 열기 무시
    // 🐾 펫 애정도: 방/캠에서 펫을 탭해 쓰다듬기(펫별 3시간 쿨다운) → +1, 임계에서 레벨업. 실제 쓰다듬을 때만 하트 연출.
    let _affLevelUp=null, _petCdToast=0;
    const PET_COOLDOWN_MS=24*60*60*1000;   // 쓰다듬기 쿨다운 하루(펫별, RTDB pettedAt로 지속)
    const PET_PET_REWARD=5;               // 쓰다듬기 보상 은화(하루 1회/펫)
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
    // 쓰다듬기: 펫별 하루 1번만(RTDB owned.cats[id].pettedAt로 지속). 성공 시 하트 연출 + 은화 5 보상(지갑으로 날아가는 연출·카운트업). 쿨다운 중엔 하트 없음.
    function bumpAffection(id, x, y){
      if(!id || !ownsCat(id)) return;
      const now=Date.now(), last=Number((ownedCatsMap()[id]||{}).pettedAt)||0;
      if(now-last < PET_COOLDOWN_MS){   // 쿨다운: 하트 없음. 남은 시간만 가끔 토스트로 안내(스팸 방지).
        if(now-_petCdToast>2500){ _petCdToast=now; const rem=PET_COOLDOWN_MS-(now-last), hh=Math.ceil(rem/3600000);
          toast(catName(id)+' 쓰다듬기는 하루 한 번 · 약 '+hh+'시간 후 가능'); }
        return; }
      _affLevelUp=null; let did=false; const beforeCoins=coins(), beforeGold=gold();
      gameRef().transaction(g=>{ g=normalizeGame(g); const c=g.owned.cats[id]; if(!c){ did=false; return g; }
        if(now-(Number(c.pettedAt)||0) < PET_COOLDOWN_MS){ did=false; return g; }   // 트랜잭션 내 재확인(다기기 동시성)
        did=true; c.pettedAt=now;
        g.coins=clampCoins((g.coins||0)+PET_PET_REWARD);   // 쓰다듬기 보상 은화 5
        const before=affectionLevel(c.affection).level; c.affection=(Number(c.affection)||0)+1;
        const after=affectionLevel(c.affection).level;
        if(after>before){ _affLevelUp={ id, level:after, gold:0, silver:0 };
          const lvR=affLevelReward(after); if(lvR>0){ g.coins=clampCoins((g.coins||0)+lvR); _affLevelUp.silver=lvR; }   // 레벨업 소보상 은화(레벨1~5=2·3·5·8·10)
          if(after>=5){ g.gold=clampGold((g.gold||0)+5); _affLevelUp.gold=5; }   // 애정 만렙(레벨5) 1회 도달 보상 — 레벨은 한 번만 오르므로 자동 멱등
        }
        return g;
      }).then(res=>{ if(res&&res.committed&&did){ heartFx(x,y);   // 실제 쓰다듬었을 때만 하트 액션
        const lvUp=_affLevelUp, dSilver=PET_PET_REWARD+((lvUp&&lvUp.silver)||0), dGold=(lvUp&&lvUp.gold)||0;
        rewardFly(x, y, dSilver, dGold, beforeCoins, beforeGold);   // 은화(+레벨업 보너스·만렙 금화)가 지갑으로 스르르 날아가며 카운트업
        if(lvUp){ affLevelFx(x,y); toast('❤ '+catName(lvUp.id)+' 애정 레벨 '+lvUp.level+(lvUp.gold?' · 만렙! 금화 +'+lvUp.gold:'')+' · 은화 +'+dSilver); _affLevelUp=null; }
        else toast('❤ '+catName(id)+' 쓰다듬기 · 애정 +1 · 은화 +'+PET_PET_REWARD); } });
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
    function openShop(){ _catTab='shop'; renderCatHouse(); }
    function goGachaShop(){ _shopSub='event'; openShop(); }   // 가방 등에서 가챠 탭으로 이동(보유 알/박스는 거기서 열기)
    // 알뜰 아이콘 = 소식 전용 화면(탭 없음). 미션은 더보기 '미션'으로 분리.
    function openNews(){ markNewsSeen(); openSheet('소식', catNewsHtml()); }
    function openMissions(){ openSheet('오늘의 미션', catMissionHtml()); }
    // A4: 화면 밖 픽업 씬의 CSS 애니(구름·나무·꽃·나비 ~90개)를 정지 — 안 보일 때 GPU/배터리 부담을 덜어준다. IntersectionObserver로 .pk-idle 토글. observe는 멱등이라 여러 번 호출해도 안전.
    let _pkIO=null;
    function pkObserveScenes(){ try{
      if(typeof reducedMotion==='function' && reducedMotion()) return;   // 모션 최소화면 이미 정지(관찰 불필요)
      if(typeof IntersectionObserver==='undefined') return;
      if(!_pkIO) _pkIO=new IntersectionObserver(function(ents){ ents.forEach(function(e){ e.target.classList.toggle('pk-idle', !e.isIntersecting); }); });
      document.querySelectorAll('.pkscene:not(.pk-reveal)').forEach(function(el){ _pkIO.observe(el); });   // 리빌(전체화면)은 항상 보이니 제외
    }catch(e){} }
    function renderCatHouse(){
      if(!state.game) state.game=normalizeGame(null);   // 스냅샷 도착 전 안전 가드
      const build=()=>{
        // 상단 고정(sticky): 알뜰샵=은화/금화 잔액+서브탭 / 알뜰홈=홈·배치 탭. 알뜰샵·잔액은 더보기의 별도 '알뜰샵' 화면(openShop)으로 분리.
        const isShop=_catTab==='shop';
        let h='<div class="cathead">';
        if(isShop){ h+='<div class="coinbar"><span class="coin"><span class="ci">'+goldSvg({h:20})+'</span>'+gold().toLocaleString()+(atMaxGold()?maxChip():'')+'<small>금화</small></span><span class="coin"><span class="ci">'+coinSvg({h:20})+'</span>'+coins().toLocaleString()+(atMaxCoins()?maxChip():'')+'<small>은화</small></span></div>'; }
        else { h+='<div class="catseg">'+[['home','홈'],['place','배치']].map(function(t){ return '<button class="'+(_catTab===t[0]?'on':'')+'" onclick="setCatTab(\''+t[0]+'\')">'+t[1]+'</button>'; }).join('')+'</div>'; }
        if(isShop) h+=shopSubsegHtml();   // 알뜰샵 서브탭(sticky 헤더 안)
        h+='</div>';   // .cathead 닫기(여기까지 sticky)
        if(isShop) h+='<div class="shopwrap">'+catShopHtml()+'</div>';   // min-height로 탭마다 시트 높이 동일(소비처럼 항목 적어도 안 줄어듦)
        else if(_catTab==='place') h+=catPlaceHtml();
        else h+=catHomeHtml();   // home(및 미상 탭) → 홈
        return h;
      };
      openSheet(_catTab==='shop'?'알뜰샵':'알뜰홈', build());
      state._sheetRefresh=()=>{ if(_drag||_pal||_rmDrag||_wdrag||_wpal) return;   // 드래그(배치) 중엔 재렌더 스킵 — 드래그 요소가 뜯겨 스크롤 잠금이 남는 것 방지(드래그 끝나면 배치 커밋이 다시 리프레시)
        const b=$('sheetBody'); if(!b) return; const st=b.scrollTop;
        const pal=b.querySelector('.palette'); const palL=pal?pal.scrollLeft:0;   // 배치 팔레트(가로 스크롤) 위치 보존 — 스크롤해 아이템 선택 시 처음으로 안 튀게(우리집 펫은 세로 그리드라 세로 scrollTop만 보존)
        const keepGrid=(_catTab==='home')?b.querySelector('#petGrid'):null;   // 기존 펫 그리드 노드 보존(빈 placeholder로 되붙여 수백 타일 재파싱·이미지 리로드 회피)
        b.innerHTML=build();
        if(_catTab==='home'){ const ph=b.querySelector('#petGrid'); if(keepGrid && ph) ph.replaceWith(keepGrid); renderPetGrid(); }   // 되살린 그리드에 바뀐 타일만 갱신(없으면 채움)
        b.scrollTop=st;
        const npal=b.querySelector('.palette'); if(npal) npal.scrollLeft=palL;
        if(_catTab==='home') mountRoomWalk(); pkObserveScenes(); };   // A4: 재빌드된 씬 재관찰
      if(_catTab==='home'){ setTimeout(mountRoomWalk, 30); renderPetGrid(); }
    }
    // 방 미니 미리보기 썸네일(프리셋): 벽지 bg + 가구 위치 축소 + 이름 + 펫수. 탭=전환, ✎=이름변경.
    function roomThumb(r, idx){
      const on=idx===roomIdx(); r=r||{};
      const placed=r.placed||{};
      const dots=Object.keys(placed).map(k=>{ const pr=k.split('_'), rr=+pr[0], cc=+pr[1], foot=itemFoot(placed[k].itemId);
        return '<i class="rmf" style="left:'+(gridLeftFrac(cc)*100).toFixed(1)+'%;top:'+(gridLeftFrac(rr)*100).toFixed(1)+'%;width:'+(gridSpanFrac(foot.w)*100).toFixed(1)+'%;height:'+(gridSpanFrac(foot.h)*100).toFixed(1)+'%"></i>'; }).join('');
      // 벽 가구 점(평면 썸네일에선 '뒤 벽'=맨 위 얇은 띠에 열 위치로 표시, 색으로 구분)
      const wp=r.wallPlaced||{};
      const wdots=Object.keys(wp).map(k=>{ const pr=k.split('_'), cc=+pr[1], w=(itemFoot(wp[k].itemId).w);
        return '<i class="rmf rmfw" style="left:'+(gridLeftFrac(cc)*100).toFixed(1)+'%;top:1.5%;width:'+(gridSpanFrac(w)*100).toFixed(1)+'%;height:9%"></i>'; }).join('');
      const pets=(r.active||[]).filter(ownsCat).length;
      const rep=idx===(homeH().showRoom|0);   // 대표 방(친구·랭킹 노출)
      return '<div class="rmthumb'+(on?' on':'')+'" role="button" tabindex="0" aria-pressed="'+on+'" onpointerdown="rmDown(event,'+idx+')" onclick="rmTap('+idx+')" title="'+escapeHtml(r.name||('방 '+(idx+1)))+(rep?' · 대표 방':'')+'">'+
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
      if(rc<MAX_ROOMS) h+='<button class="rmthumb locked" onclick="buyRoom()" aria-label="방 확장(금화 '+ROOM_PRICE+')"><span class="rmlock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span><span class="rmgold">'+goldSvg({h:12})+ROOM_PRICE+'</span></button>';
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
    let _petSort=lsGet('petSort','recent'), _homeSpecies=lsGet('homeSpecies','all');   // 홈 펫: 정렬 + 종류(species) 탭 (검색 제거, 도감식 종류 구분)
    const PET_SORTS=[['recent','최신순'],['aff','애정도순'],['tier','등급순']];
    function setPetSort(v){ _petSort=v||'recent'; lsSet('petSort',_petSort); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    function setHomeSpecies(s){ _homeSpecies=s||'all'; lsSet('homeSpecies',_homeSpecies); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    // 보유 펫 정렬 — recent(최신 획득=boughtAt)·aff(애정도)·tier(등급, 상위 먼저).
    function sortOwnedPets(ids){ const l=ids.slice();
      const rank=id=>tierRank(CAT_TIER[id]||'normal'), aff=id=>Number((ownedCatsMap()[id]||{}).affection)||0, bat=id=>((ownedCatsMap()[id]||{}).boughtAt)||'', nm=id=>catName(id)||'';
      if(_petSort==='tier') l.sort((a,b)=> rank(b)-rank(a) || bat(b).localeCompare(bat(a)));
      else if(_petSort==='aff') l.sort((a,b)=> aff(b)-aff(a) || nm(a).localeCompare(nm(b)));
      else l.sort((a,b)=> bat(b).localeCompare(bat(a)));   // recent
      return l; }
    function petSpeciesOf(id){ const c=PET_CATALOG.find(x=>x.id===id); return (c&&c.species)||'cat'; }
    function homeFilteredPets(){ const o=ownedCatList(); return _homeSpecies==='all'?o:o.filter(id=>petSpeciesOf(id)===_homeSpecies); }
    // 종류 탭(보유 종만 + 개수 배지) — 도감/알뜰샵 종 탭과 같은 방식(SPECIES_LABEL 순).
    function homeSpeciesTabs(){ const owned=ownedCatList(); const cnt={}; owned.forEach(id=>{ const s=petSpeciesOf(id); cnt[s]=(cnt[s]||0)+1; });
      const order=Object.keys(SPECIES_LABEL); const present=Object.keys(cnt).sort((a,b)=>{ const ia=order.indexOf(a),ib=order.indexOf(b); return (ia<0?99:ia)-(ib<0?99:ib); });
      return [['all','전체',owned.length]].concat(present.map(s=>[s,(SPECIES_LABEL[s]||s),cnt[s]])); }
    function petCtlBar(){ const tabs=homeSpeciesTabs(); if(!tabs.some(t=>t[0]===_homeSpecies)) _homeSpecies='all';
      let h=(tabs.length>2)?('<div class="subseg pettabs">'+tabs.map(t=>'<button class="'+(_homeSpecies===t[0]?'on':'')+'" onclick="setHomeSpecies(\''+t[0]+'\')">'+escapeHtml(t[1])+' <b>'+t[2]+'</b></button>').join('')+'</div>'):'';
      h+='<div class="petctl"><select class="petsort" aria-label="펫 정렬" onchange="setPetSort(this.value)">'+PET_SORTS.map(o=>'<option value="'+o[0]+'"'+(_petSort===o[0]?' selected':'')+'>'+o[1]+'</option>').join('')+'</select></div>';
      return h; }
    // ===== 우리집 펫 그리드: 타일 단위 메모이즈(수백 마리 재파싱·이미지 리로드 회피) =====
    // 타일 콘텐츠 시그니처 — 상태(방)·현재방·애정레벨·이름이 바뀐 타일만 다시 그린다.
    function petTileSig(id){ const ro=petRoomIndex(id); const here=ro===roomIdx(); const rooms=homeH().rooms||[];
      const rnm=(ro>=0&&!here)?((rooms[ro]&&rooms[ro].name)||('방 '+(ro+1))):'';   // elsewhere일 때만 방이름 뱃지 표시 → 시그니처에 포함(방 전환/이름변경 시 필요한 타일만 갱신)
      const lv=affectionLevel((ownedCatsMap()[id]||{}).affection).level; return (here?'H':ro)+'|'+rnm+'|'+lv+'|'+catName(id)+'|'+(CAT_TIER[id]||'normal'); }   // tier 포함(이름색·등급 연출은 등급에 의존 → applyCatalog로 등급만 바뀌어도 갱신)
    // 등급 배지(색약 접근성): 색이 아니라 '글자'로 등급 식별. 한정=무지개, 일반은 생략(기본), 그 외 등급색.
    function tierBadgeHtml(tier){ if(!tier || tier==='normal') return '';
      const ti=tierInfo(tier); const nm=escapeHtml(ti.name);
      if(tier==='exclusive') return '<span class="ptier tier-rainbow">'+nm+'</span>';
      return '<span class="ptier" style="color:'+ti.color+'">'+nm+'</span>'; }
    function petTileHtml(id){
      const rooms=homeH().rooms||[]; const roomOf=petRoomIndex(id), here=roomOf===roomIdx();
      const roomNm=roomOf>=0?((rooms[roomOf]&&rooms[roomOf].name)||('방 '+(roomOf+1))):'';
      const lv=affectionLevel((ownedCatsMap()[id]||{}).affection).level; const tier=CAT_TIER[id]||'normal';
      const stt=here?'이 방':(roomOf>=0?roomNm:'대기');
      return '<div class="catchip'+(here?' on':(roomOf>=0?' elsewhere':''))+'" data-id="'+id+'" data-tsig="'+escapeHtml(petTileSig(id))+'" data-name="'+escapeHtml(catName(id))+'" role="button" tabindex="0" aria-pressed="'+here+'" onclick="toggleActiveCat(\''+id+'\')" title="'+escapeHtml(catName(id))+' · '+escapeHtml(tierInfo(tier).name)+' · '+escapeHtml(stt)+' · Lv.'+lv+'">'+
        '<div class="cpic tbring tb-'+tier+'">'+catFace(id,{h:44})+tierBadgeHtml(tier)+
          '<button class="cn-info" aria-label="펫 정보" onclick="event.stopPropagation();openPetInfo(\''+id+'\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg></button></div>'+   // 등급 테두리 + 등급명 배지(좌하단) + ⓘ(우하단)
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
      const ids=sortOwnedPets(homeFilteredPets());   // 종류 탭으로 걸러 정렬
      if(!ids.length){ el.removeAttribute('data-order'); el.style.maxHeight=''; el.classList.remove('scroll4');
        el.innerHTML='<div class="empty pgempty">이 종류의 펫이 없어요 🐾 <button class="btn ghost" onclick="setCatTab(\'shop\')">알뜰샵</button></div>'; return; }
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
      reconcilePets();   // 3시간 지난 그릇 비우고 똥 정산(멱등)
      const cats=activeCats();
      // 배치된 가구를 방 바닥에 매핑. 그릇=탭 급여·채움 반영, 화장실=똥 수거(공용 헬퍼).
      const list=placedList().sort((a,b)=>a.r-b.r); distributePoops(list);
      const litters=list.filter(p=>p.itemId==='litterbox');
      const spH=splitProps(list, p=>propMarkup(p,false,false,true));   // 바닥 아이템(러그·연못) 먼저 → 맨 아래
      const props=spH.floor+wallPlacedList().map(p=>wallPropMarkup(p,false,true)).join('')+spH.other;   // 바닥 아이템 → 벽 가구(뒤) + 일반 가구. live=true → 홈 LIVE 캠 연출
      const roomName=(room().name)||'우리집';
      let h=roomStripHtml()+'<div class="catroom" id="catRoom"><div class="cr-wall" style="background:'+wallCss(currentWall())+'"></div><div class="cr-floor" style="background:'+floorCss(currentFloor())+'"></div><div class="cr-base"></div><span class="cr-cam"><i></i>LIVE · '+escapeHtml(roomName)+'</span>'+batchBtnHtml()+'<div class="cr-props">'+props+'</div><div class="cr-stage" id="crStage"></div></div>';
      // 빈 방(가구·펫 없음) 안내 — 방 확장 직후 '사라진 것처럼' 보이는 혼동 방지
      if(!list.length && !cats.length) h+='<div class="hintline" style="margin:8px 0 0;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>새 방이에요! 아래에서 <b>펫을 이 방으로 데려오고</b>, <b>배치</b> 탭에서 가구를 놓아보세요. (다른 방과 따로 저장돼요)</div>';
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
      else { if(owned.length>=2) h+=petCtlBar();   // 종류 탭 + 정렬(2마리↑부터)
        // 수집형 인벤토리 그리드(5열·세로, 4행까지 보이고 초과 시 내부 스크롤). 타일은 renderPetGrid가 채우고 타일 단위로 메모이즈(수백 마리 재파싱 회피).
        h+='<div class="catchips" id="petGrid"></div>';
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
      stage.innerHTML=list.map((id,i)=>{ const s=petActorPx(id,32,200); return '<div class="cd-actor" data-cat="'+id+'" data-hh="'+s+'" style="left:'+(20+i*64)+'px;">'+catActorHTML(id,s)+'</div>'; }).join('');
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
      const spF=splitProps(friendPlacedList(fg).sort((a,b)=>a.r-b.r), p=>propMarkup(p,false,true,true));   // 바닥 아이템(러그·연못) 먼저 → 맨 아래
      const props=spF.floor+friendWallPlacedList(fg).map(p=>wallPropMarkup(p,false,true)).join('')+spF.other;   // 바닥 아이템 → 벽 가구(뒤) + 일반 가구. plain=true(읽기전용) + live=true(연출)
      return '<div class="catroom" id="friendRoom"><div class="cr-wall" style="background:'+wallCss(wall)+'"></div><div class="cr-floor" style="background:'+floorCss(friendRoom(fg).floor||'default')+'"></div><div class="cr-base"></div>'+
        '<span class="cr-cam"><i></i>LIVE · '+escapeHtml(name||'친구')+'의 집</span>'+
        '<div class="cr-props">'+props+'</div><div class="cr-stage" id="frStage"></div></div>';
    }
    // 친구 방 무대에 친구 펫을 배치 → 통합 엔진(activeStage가 frStage 우선)이 로밍시킴.
    function mountFriendRoom(fg){
      const stage=$('frStage'); if(!stage) return;
      const list=friendActiveCats(fg).slice(0, Math.min(MAX_SLOTS, Math.max(BASE_SLOTS, (fg.home&&fg.home.slots)||BASE_SLOTS)));
      ensurePetArtMany(list);
      stage.dataset.hh=64;
      stage.innerHTML=list.map((id,i)=>{ const s=petActorPx(id,32,200); return '<div class="cd-actor" data-cat="'+id+'" data-hh="'+s+'" style="left:'+(20+i*64)+'px;">'+catActorHTML(id,s)+'</div>'; }).join('');
      markCatDirty();
    }
    let _shopSub='event';   // 알뜰샵 진입 시 기본=가챠 탭(맨 왼쪽)
    function setShopSub(s){ _shopSub=s; _shopSelCat=null; renderCatHouse(); }
    // 가챠 탭 내부 서브탭(뜰알/펫알/랜덤박스/무지개) — 종류별로 나눠 뽑기. 추후 탭별 전용 배너를 여기서 확장.
    let _gachaTab=lsGet('gachaTab','ddeul');
    const GACHA_TABS=[['ddeul','뜰알'],['egg','펫알'],['box','랜덤박스'],['rainbow','무지개']];
    function setGachaTab(t){ _gachaTab=t||'ddeul'; lsSet('gachaTab',_gachaTab); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
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
    // 가챠 서브탭별 콘텐츠. (배너 고도화는 탭별로 이 함수 안에서 확장)
    function gachaTabHtml(tab){
      let h='';
      if(tab==='ddeul'){
        h+=limitedPickupBanner();   // 🌈 한정 픽업 배너(무지개+뜰의 알+양옆 걷는 픽업 펫)
        const pk=LIMITED_PICKUP.filter(pickupExists).map(id=>catNameSpan(id,catName(id))).join('·');
        const dEnough=coins()>=DDEUL_PRICE && gold()>=DDEUL_GOLD;
        const dact=dEnough?'<button class="buy" aria-label="뜰알 구매('+DDEUL_PRICE+' 은화·금화 '+DDEUL_GOLD+')" onclick="openDdeul()">구매</button>':'<button class="buy dis" disabled>'+(coins()<DDEUL_PRICE?(DDEUL_PRICE-coins())+' 은화 부족':'금화 '+(DDEUL_GOLD-gold())+' 부족')+'</button>';
        h+='<div class="shopcard ddeul-card"><div class="thumb">'+ddeulEggSvg({h:64})+'</div>'+
          '<div class="meta"><b class="tier-rainbow ddeul-title">뜰알 <span class="tagmini tier-rainbow">한정 픽업</span></b><div class="desc ddeul-desc">'+(pk?'<b class="ddeul-pk tier-rainbow">'+pk+'</b> · ':'')+'한정 펫은 오직 뜰알에서만!</div>'+
          '<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+DDEUL_PRICE+' <span class="ci">'+goldSvg({h:16})+'</span>'+DDEUL_GOLD+'</span></div>'+
          '<div class="act">'+dact+pityChip('ddeul')+'</div></div>';
        h+=heldOpenCard('ddeul');
      } else if(tab==='egg' || tab==='box'){
        const k=tab, nm=k==='egg'?'펫알':'랜덤박스', desc=k==='egg'?'알을 열면 고양이가 랜덤으로! 등급이 높을수록 귀해요.':'상자를 열면 가구·구조물이 랜덤으로 나와요.', art=k==='egg'?eggSvg(0,{h:66}):boxSvg({h:56});
        const act=(coins()>=GACHA_PRICE)?'<button class="buy" aria-label="'+nm+' 구매('+GACHA_PRICE+' 은화)" onclick="openGacha(\''+k+'\')">구매</button>':'<button class="buy dis" disabled>'+(GACHA_PRICE-coins())+' 부족</button>';
        h+='<div class="shopcard"><div class="thumb">'+art+'</div>'+
          '<div class="meta"><b>'+nm+'</b><div class="desc">'+desc+'</div>'+
          '<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+GACHA_PRICE+'</span></div>'+
          '<div class="act">'+act+pityChip(k)+'</div></div>';
        h+=heldOpenCard(k);
      } else if(tab==='rainbow'){
        const rb=[['egg','무지개알','열면 특별90 · 전설8 · 신화2%. 특별↑ 고양이만!', rainbowEggSvg({h:66,cls:'rb-thumb'})],
                  ['box','무지개박스','열면 특별90 · 전설8 · 신화2%. 특별↑ 가구만!', rainbowBoxSvg({h:56,cls:'rb-thumb'})]];
        h+='<div class="rb-hh"><span class="tier-rainbow">✨ 무지개</span> · 금화 전용 · 특별↑ 확정</div>';
        h+=rb.map(([k,nm,desc,art])=>{ const key=rainbowKey(k), qty=consumQty(key), price=rbPriceGold(k), canBuy=gold()>=price;
          const buy=canBuy?'<button class="buy" aria-label="'+nm+' 구매(금화 '+price+')" onclick="buyRainbow(\''+k+'\')">구매</button>':'<button class="buy dis" disabled>금화 '+(price-gold())+' 부족</button>';
          const use=qty>0?'<button class="buy rb-use" aria-label="'+nm+' 사용" onclick="useRainbow(\''+k+'\')">사용</button>':'';
          return '<div class="shopcard rb-card"><div class="thumb rb-thumb-wrap">'+art+'</div>'+
            '<div class="meta"><b class="tier-rainbow">'+nm+'</b><div class="desc">'+desc+'</div>'+
            '<span class="price"><span class="ci">'+goldSvg({h:16})+'</span>'+price+'</span></div>'+
            '<div class="act">'+buy+use+'<span class="qty">보유 '+qty.toLocaleString()+(qty>=MAX_CONSUM?maxChip():'')+'</span>'+pityChip(key)+'</div></div>'; }).join('');
      }
      return h;
    }
    // ===== 🎰 가챠 배너(세로 확장·둥지형) — 개발자 '배너 관리'에서 탭별 미리보기. 지금은 개발자 전용, 추후 실전 탭에 얹고 탭별 전용 배너로 분화. =====
    // 공통 조각(둥지+알·1/10 버튼·천장 안내). 각 배너 함수는 독립 인스턴스라 나중에 개별 수정 가능.
    function gbNestHtml(eggHtml){ return '<div class="gb-nest"><div class="gb-nestback">'+nestSvg({})+'</div><div class="gb-egg">'+eggHtml+'</div><div class="gb-nestfront">'+nestFrontSvg({})+'</div></div>'; }
    function gbActionsHtml(kind){ return '<div class="gb-actions"><button class="gb-btn" onclick="devBannerPull(\''+kind+'\',false)">1회 뽑기</button><button class="gb-btn gb-btn10" onclick="devBannerPull(\''+kind+'\',true)">10회 연속</button></div>'; }
    function gbPityHtml(kind){ const left=pityRemain(pityGet(kind), (typeof PITY_N!=='undefined'?PITY_N:100)); return '<div class="gb-pity"><span class="pity-chip">'+sparkSvg({h:11})+(typeof PITY_N!=='undefined'?PITY_N:100)+'번 안에 <b>신화 이상 확정</b> · 남은 <b>'+left+'뽑</b></span></div>'; }
    // 🌱 뜰알 전용 배너(세로 크게·둥지에 뜰알)
    function ddeulBannerHtml(){
      return '<div class="gbanner gb-ddeul"><div class="gb-head"><span class="pk-title tier-rainbow">✨ 뜰알 · 한정 픽업</span></div>'+
        '<div class="gb-scene">'+pickupSceneHtml('banner')+gbNestHtml(ddeulEggSvg({h:60}))+'</div>'+
        gbActionsHtml('ddeul')+gbPityHtml('ddeul')+'</div>';
    }
    // 🥚 펫알 전용 배너(추후 독립 수정 — 지금은 동일 배경, 별개 인스턴스)
    function eggBannerHtml(){
      return '<div class="gbanner gb-egg"><div class="gb-head"><b class="gb-t">🥚 펫알</b></div>'+
        '<div class="gb-scene">'+pickupSceneHtml('banner')+gbNestHtml(eggSvg(0,{h:62}))+'</div>'+
        gbActionsHtml('egg')+gbPityHtml('egg')+'</div>';
    }
    // 🎁 랜덤박스 전용 배너(추후 독립 수정 — 지금은 동일 배경, 별개 인스턴스)
    function boxBannerHtml(){
      return '<div class="gbanner gb-box"><div class="gb-head"><b class="gb-t">🎁 랜덤박스</b></div>'+
        '<div class="gb-scene">'+pickupSceneHtml('banner')+gbNestHtml(boxSvg({h:52}))+'</div>'+
        gbActionsHtml('box')+gbPityHtml('box')+'</div>';
    }
    // 배너 버튼 → 미리보기(소모 없음). 1회=강제 전설 단발 연출, 10회=10연차 연출(박스 10연차는 준비 전). 실전 연결은 추후.
    function devBannerPull(kind, ten){
      if(!(typeof isDev==='function'&&isDev())) return;
      if(ten){ if(kind==='box'){ toast('랜덤박스 10연차 연출은 준비 중이에요'); return; } devPreview10('random', kind); }
      else devPreview(kind, 'legend');
    }
    // 개발자 배너 관리 — 탭별(뜰알/펫알/랜덤박스) 배너 미리보기(시트).
    let _bannerTab='ddeul';
    const BANNER_TABS=[['ddeul','뜰알'],['egg','펫알'],['box','랜덤박스']];
    function setBannerTab(t){ _bannerTab=t||'ddeul'; if(state._sheetRefresh) state._sheetRefresh(); }
    function openDevBannerManager(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용'); return; }
      const build=()=>{
        if(!BANNER_TABS.some(t=>t[0]===_bannerTab)) _bannerTab='ddeul';
        let h='<div class="note">가챠 배너 미리보기 — 탭별로 확인. <b>펫알·랜덤박스</b>는 지금 동일 배경(추후 전용 배너로 분화). 버튼은 <b>미리보기</b>(1회=강제 전설·10회=연출)로 실전 연결·소모 없음.</div>';
        h+='<div class="subseg">'+BANNER_TABS.map(t=>'<button class="'+(_bannerTab===t[0]?'on':'')+'" onclick="setBannerTab(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div>';
        h+=(_bannerTab==='ddeul'?ddeulBannerHtml():_bannerTab==='egg'?eggBannerHtml():boxBannerHtml());
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
    // 알뜰샵에서 미리보기로 "선택"한 펫 — 선택하면 카드가 강조되고 썸네일이 옆으로 걷는 스프라이트(우리집 펫 카드와 동일)로 바뀐다.
    let _shopSelCat=null;
    function selectShopCat(id){ _shopSelCat=(_shopSelCat===id?null:id); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    // 알뜰샵 서브탭(펫/가구/소비/벽지/가챠) — cathead(sticky) 안에 넣어 스크롤해도 상단 고정. '펫'=구 '고양이'(호랑이·사자 등 포함이라 펫으로 통일). ('가챠' 탭 키는 내부적으로 'event' 유지)
    function shopSubsegHtml(){
      const tabs=[['event','가챠'],['cats','펫'],['furn','가구'],['consum','소비'],['wall','벽지'],['floor','바닥']];
      return '<div class="subseg">'+tabs.map(function(t){ return '<button class="'+(_shopSub===t[0]?'on':'')+'" onclick="setShopSub(\''+t[0]+'\')">'+t[1]+'</button>'; }).join('')+'</div>';
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
        if(!GACHA_TABS.some(t=>t[0]===_gachaTab)) _gachaTab='ddeul';
        h+='<div class="subseg gachatabs">'+GACHA_TABS.map(t=>'<button class="'+(_gachaTab===t[0]?'on':'')+'" onclick="setGachaTab(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div>';
        h+=gachaTabHtml(_gachaTab);   // 뜰알/펫알/랜덤박스/무지개 — 선택 탭만
        h+='<div class="note">'+gachaNoteFor(_gachaTab)+'</div>';   // 구분별 짧은 설명
        h+=gachaInfoHtml(_gachaTab);   // 구분별 확률만
        return h;
      }
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
        // 종(species) 필터 탭 — 카탈로그에 있는 종이 2개↑일 때만 노출(가구 탭의 shopfurncat 미러)
        const PSHOP_TABS=shopPetSpeciesTabs();
        if(!PSHOP_TABS.some(t=>t[0]===_shopPetSpecies)) _shopPetSpecies='all';
        if(PSHOP_TABS.length>2) h+='<div class="subseg shopfurncat">'+PSHOP_TABS.map(t=>'<button class="'+(_shopPetSpecies===t[0]?'on':'')+'" onclick="setShopPetSpecies(\''+t[0]+'\')">'+escapeHtml(t[1])+'</button>').join('')+'</div>';
        // 등급 낮은 것부터 높은 순으로 정렬. 특별(epic) 이상은 알뜰샵 직접 구매 불가 → 펫알(가챠) 전용 표기. 선택 종만 필터.
        const cats=PET_CATALOG.slice().filter(c=>!isGachaOnlyCat(c.id) && (_shopPetSpecies==='all'||c.species===_shopPetSpecies)).sort((a,b)=>tierRank(petTierOf(a.id))-tierRank(petTierOf(b.id)));   // 가챠전용 펫은 판매목록에서 숨김(가챠 풀엔 그대로 있음)
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
          return '<div class="shopcard petpick'+(sel?' sel':'')+(feat?' feat':'')+'" role="button" tabindex="0" aria-pressed="'+sel+'" onclick="selectShopCat(\''+c.id+'\')"><div class="thumb tbring tb-'+petTierOf(c.id)+'"><div class="fl"></div>'+art+
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
        h+='<div class="shoptabrow"><div class="subseg shopfurncat">'+FSHOP_CATS.map(c=>'<button class="'+(_shopFurnCat===c[0]?'on':'')+'" onclick="setShopFurnCat(\''+c[0]+'\')">'+c[1]+'</button>').join('')+'</div>'+
          '<select class="petsort furnsort" aria-label="가구 정렬" onchange="setFurnSort(this.value)">'+FURN_SORTS.map(o=>'<option value="'+o[0]+'"'+(_furnSort===o[0]?' selected':'')+'>'+o[1]+'</option>').join('')+'</select></div>';
        const items=sortFurnItems(ITEM_CATALOG.filter(it=>!isGachaOnlyItem(it.id) && (_shopFurnCat==='all'||placeCatOf(it.id)===_shopFurnCat)));   // 가챠전용 가구는 판매목록에서 숨김(랜덤박스 풀엔 그대로)
        h+=items.map(it=>{
          const price=itemBuyPrice(it.id), enough=coins()>=price, gachaOnly=isGachaOnlyItem(it.id);
          let act, priceHtml;
          if(gachaOnly){
            priceHtml='<span class="price gachaonly">'+boxSvg({h:16})+'<b class="tier-rainbow">랜덤박스 전용</b></span>';
            act='<button class="buy ghost" aria-label="'+it.name+'은 랜덤박스에서 뽑기" onclick="setShopSub(\'event\')">랜덤박스 뽑기</button>';
          } else {
            priceHtml='<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+price+'</span>';
            act=enough?'<button class="buy" aria-label="'+it.name+' 구매('+price+' 은화)" onclick="buyItem(\''+it.id+'\')">구매</button>':'<button class="buy dis" disabled>'+(price-coins())+' 부족</button>';
          }
          const ft=itemTierOf(it.id);
          return '<div class="shopcard"><div class="thumb tbring tb-'+ft+'"><span class="furnfit">'+furnSvg(it.id,{fit:true})+'</span>'+tierBadgeHtml(ft)+'</div>'+
            '<div class="meta"><b>'+it.name+(isWallItem(it.id)?' <span class="tagmini wall">벽</span>':(it.floor?' <span class="tagmini">바닥</span>':''))+'</b><div class="desc">'+it.desc+'</div>'+
            priceHtml+'</div>'+
            '<div class="act">'+act+'<span class="qty">보유 '+itemQty(it.id)+'</span></div></div>';
        }).join('');
        h+='<div class="note"><b>수량 허용</b> 가구는 여러 개 살 수 있어요. <b>특별 등급 이상</b> 가구는 <b>랜덤박스</b>로만 얻어요(알뜰샵 구매 불가). 구매 후 <b>배치</b> 탭에서 격자에 놓습니다.</div>';
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
      const price=itemBuyPrice(id);
      if(coins()<price){ toast((price-coins())+' 은화 부족', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); if(g.coins<price) return;
        g.coins-=price; g.owned.items[id]=g.owned.items[id]||{qty:0,boughtAt:new Date().toISOString()};
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
    let _lastRecon=0;
    function reconcilePets(){
      const g=state.game; if(!g||!g.home) return;
      const now=Date.now();   // 모든 방의 그릇을 점검(안 보는 방도 3h 뒤 비워지며 그 방 똥 누적)
      if(now-_lastRecon<3000) return; _lastRecon=now;   // 렌더 경로에서 매 렌더 호출돼도 3초 스로틀(3시간 만료 기준이라 지장 없음, 중복 트랜잭션 방지)
      let expired=0; (g.home.rooms||[]).forEach(r=>{ const pl=(r&&r.placed)||{}; Object.keys(pl).forEach(k=>{ const e=pl[k]; if(e&&e.filledAt&&(now-e.filledAt)>=FILL_MS) expired++; }); });
      if(!expired) return;
      gameRef().transaction(gg=>{ if(gg==null) return;   // 자동 발동(사용자 조작 없음) → null 첫 패스에 기본 홈을 제안하지 않음(재접속 clobber 방지)
        gg=normalizeGame(gg); const n=Date.now();
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
      if(dCoins>0){ walletHold('coins',prevCoins); flyCurrency(x,y,dCoins,'coin',w); }   // 도착 전엔 옛값 고정(새값 깜빡임 방지)
      if(dGold>0){  walletHold('gold', prevGold);  flyCurrency(x,y,dGold,'gold',w); }
      setTimeout(function(){   // 코인이 도착할 즈음 카운트업 시작
        if(dCoins>0) walletRoll('coins', prevCoins, coins());
        if(dGold>0)  walletRoll('gold',  prevGold,  gold());
        const w2=walletEl(); if(w2){ w2.classList.add('bump'); setTimeout(()=>w2.classList.remove('bump'),320); }
      }, 430);
    }
    // 은화 전용 날아오기(prev 미상 호출자용) — 카운트업 없이 날아가기+톡
    function coinFlyFx(x,y,n){ const w=walletEl(); if(!w) return; flyCurrency(x,y,n,'coin',w);
      setTimeout(()=>{ const w2=walletEl(); if(w2){ w2.classList.add('bump'); setTimeout(()=>w2.classList.remove('bump'),320); } }, 430); }
    // 🌾 유휴 가구수익 — 펫이 자동으로 상호작용하는 가구(아래 목록)가 방에 있으면 시간에 따라 은화가 쌓인다.
    const INTERACTIVE_FURN = { tower:1, pethouse:1, cushion:1, bowl:1, scratcher:1, catwheel:1, fishtank:1, window:1, fireplace:1, fan:1, hammock:1, teaser:1, jingleball:1 };
    function interactiveFurnCount(R){ let n=0; const scan=o=>{ o=o||{}; Object.keys(o).forEach(k=>{ const id=o[k]&&o[k].itemId; if(id&&INTERACTIVE_FURN[id]) n++; }); }; scan(R&&R.placed); scan(R&&R.wallPlaced); return n; }
    // 방의 현재까지 쌓인 유휴 은화(harvestAt 이후 경과). g=game, R=room. util.roomYield(순수)로 계산.
    function roomIdleYield(g, R){ if(!g||!R) return 0; const ha=Number(R.harvestAt)||0; if(!ha) return 0;
      const affLevels=(R.active||[]).map(id=>affectionLevel(((g.owned&&g.owned.cats[id])||{}).affection||0).level);
      return roomYield(affLevels, interactiveFurnCount(R), Date.now()-ha); }
    // 접속 시 방별 harvestAt(수확시계)을 1회 초기화(0인 방만 now로) — 첫 로드 때 거대한 미수확분이 잡히는 것 방지. 멱등.
    let _harvestInit=false;
    function ensureHarvestClocks(){ if(_harvestInit) return; const g=state.game; if(!g||!g.home||!g.home.rooms) return;
      if(!g.home.rooms.some(r=>!(Number(r&&r.harvestAt)||0))) { _harvestInit=true; return; }   // 이미 다 세팅
      _harvestInit=true;
      gameRef().transaction(gg=>{ if(gg==null) return; gg=normalizeGame(gg); const now=Date.now();
        (gg.home.rooms||[]).forEach(R=>{ if(!(Number(R.harvestAt)||0)) R.harvestAt=now; }); return gg; }); }
    // 🌾 수확(구 돌보기): 유휴 가구수익을 받고 + 편의로 빈 그릇 채우기·똥 치우기까지 한 번에. harvestAt=now로 리셋.
    function allRoomsIdleYield(g){ if(!g||!g.home||!Array.isArray(g.home.rooms)) return 0; let s=0; g.home.rooms.forEach(R=>{ s+=roomIdleYield(g,R); }); return s; }
    // 🌾 수확: 모든 방을 한 번에 — 유휴 가구수익 + 빈 밥/물그릇 채움 + 똥 치움(현재 방 먼저 채워 소모품 부족 시 보이는 방 우선).
    function batchCare(btnEl){
      if(!state.game){ return; }
      const before=coins(); let filledN=0, shortFood=false, shortWater=false;
      gameRef().transaction(g=>{ g=normalizeGame(g); const now=Date.now(); const rooms=g.home.rooms||[], cur=g.home.current|0;
        filledN=0; shortFood=false; shortWater=false;   // 재실행(Firebase 재시도)마다 리셋 → 커밋된 마지막 실행값이 남음
        const order=[]; if(rooms[cur]) order.push(cur); rooms.forEach((_,i)=>{ if(i!==cur) order.push(i); });   // 현재 방 우선(소모품 부족 시)
        order.forEach(i=>{ const R=rooms[i]; if(!R) return; const pl=R.placed||{};
          const y=roomIdleYield(g, R); if(y>0) g.coins=clampCoins(g.coins+y); R.harvestAt=now; R.caredAt=now;   // 유휴 가구수익 + 시계 리셋 + 행복도 수확신선도 갱신(눌러야 오름)
          Object.keys(pl).forEach(k=>{ const e=pl[k]; if(!e) return; const filled=e.filledAt&&(now-e.filledAt)<FILL_MS;
            if(!filled){ if(e.itemId==='bowl'){ if(g.consum.food>0){ g.consum.food-=1; e.filledAt=now; filledN++; } else shortFood=true; }
              else if(e.itemId==='waterbowl'){ if(g.consum.water>0){ g.consum.water-=1; e.filledAt=now; filledN++; } else shortWater=true; } } });
          const poops=Number(R.poops)||0; if(poops>0){ g.coins=clampCoins(g.coins+poops*POOP_REWARD); R.poops=0; }
        });
        return g;
      }).then(r=>{ if(!r||!r.committed) return;
        const nowCoins=(r.snapshot&&r.snapshot.val()&&r.snapshot.val().coins)||before, gained=nowCoins-before;
        let x=innerWidth/2, y=200; if(btnEl&&btnEl.getBoundingClientRect){ const b=btnEl.getBoundingClientRect(); x=b.left; y=b.bottom+100; }   // 캠 안쪽(버튼 아래)에서 지갑으로 올라오게
        const short=(shortFood&&shortWater)?'사료·물':(shortFood?'사료':(shortWater?'물':''));
        if(gained>0 || filledN>0){ if(gained>0) rewardFly(x,y, gained, 0, before, gold());
          let msg='🌾 전체 수확 완료'+(gained>0?' · +'+gained+' 은화 🪙':'')+(filledN>0?' · 밥/물 '+filledN+'칸':'')+(short?' · '+short+' 부족(일부 미충전)':'');
          toast(msg); }
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
      gameRef().transaction(g=>{ g=normalizeGame(g); if(g.coins<wp||g.owned.wallpapers[id]) return;
        g.coins-=wp; g.owned.wallpapers[id]={boughtAt:new Date().toISOString()}; gRoom(g).wallpaper=id; return g;
      }).then(res=>{ if(res.committed) toast(w.name+' 벽지 적용! 🎨'); });
    }
    function applyWall(id){ if(!ownsWall(id)){ toast('먼저 구매하세요', true); return; } roomTx(curRoomId(), roomIdx(), R=>{ R.wallpaper=id; }); toast('벽지를 적용했어요'); }
    function buyFloor(id){ const f=FLOOR_CATALOG.find(x=>x.id===id); if(!f) return; if(ownsFloor(id)){ applyFloor(id); return; }
      if(isGachaOnlyFloor(id)){ toast('특별↑ 바닥은 랜덤박스로만 나와요'); if(typeof setShopSub==='function') setShopSub('event'); return; }
      const fp=floorBuyPrice(id);
      if(coins()<fp){ toast((fp-coins())+' 은화 부족', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g); g.owned.floors=g.owned.floors||{}; if(g.coins<fp||g.owned.floors[id]) return;
        g.coins-=fp; g.owned.floors[id]={boughtAt:new Date().toISOString()}; gRoom(g).floor=id; return g;
      }).then(res=>{ if(res.committed) toast(f.name+' 바닥 적용!'); });
    }
    function applyFloor(id){ if(!ownsFloor(id)){ toast('먼저 구매하세요', true); return; } roomTx(curRoomId(), roomIdx(), R=>{ R.floor=id; }); toast('바닥을 적용했어요'); }
    // 배치 에디터용 스킨 선택기 — 방꾸미기=바닥·벽꾸미기=벽지. 보유한 것만 스와치로 보여주고 탭하면 현재 방에 바로 적용.
    function skinPickerHtml(kind){
      const isFloor=kind==='floor';
      const cat=isFloor?FLOOR_CATALOG:WALLPAPER_CATALOG, owns=isFloor?ownsFloor:ownsWall, cur=isFloor?currentFloor():currentWall(), cssOf=isFloor?floorCss:wallCss, fn=isFloor?'applyFloor':'applyWall', lab=isFloor?'바닥':'벽지';
      const owned=cat.filter(x=>owns(x.id));
      const sw=owned.map(x=>{ const on=cur===x.id;
        return '<button class="skinsw'+(on?' on':'')+'" onclick="'+fn+'(\''+x.id+'\')" aria-label="'+escapeHtml(x.name)+(on?' 적용됨':' 적용')+'"><span class="sw" style="background:'+cssOf(x.id)+'"></span><span class="nm">'+escapeHtml(x.name)+'</span>'+(on?'<i class="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></i>':'')+'</button>'; }).join('');
      return '<div class="skinsel"><div class="skinlab">'+lab+' 선택 <span class="sc">보유 '+owned.length+'</span></div><div class="skinrow">'+sw+'</div><div class="skinhint">탭하면 이 방에 바로 적용돼요. 더 많은 '+lab+'은 알뜰샵·랜덤박스에서 얻어요.</div></div>';
    }

    // ================= 가챠 탭: 뽑기(펫알·랜덤박스) =================
    // 등급/확률(합 100). color=이름 텍스트/후광 색, limited는 CSS 레인보우.
    const TIERS = [
      { id:'normal',   name:'일반', p:45,  color:'#FFFFFF' },
      { id:'uncommon', name:'고급', p:30,  color:'#2FAE7A' },
      { id:'rare',     name:'희귀', p:15,  color:'#3182F6' },
      { id:'epic',     name:'특별', p:6,   color:'#9B6FC8' },
      { id:'legend',   name:'전설', p:3,   color:'#E0A43C' },
      { id:'limited',  name:'신화', p:1,   color:'#ff5fa2' },   // 신화(구 '한정') — 핑크 텍스트·연출. id는 하위호환 위해 'limited' 유지
      { id:'exclusive',name:'한정', p:0,   color:'#F2C84B' }    // 한정(최상위·무지개) — 기본 펫알/무지개알엔 0(안 나옴). 오직 '뜰알'(한정 픽업)에서만 DDEUL_TIERS로 0.5% 등장
    ];
    // 🌱 뜰알(한정 픽업 뽑기) 전용 확률표 — 기본과 같지만 신화 1→0.5, 한정 0.5 추가(활성 한정 펫=삵·표범만 풀에). 합 100.
    const DDEUL_TIERS=[{id:'normal',p:45},{id:'uncommon',p:30},{id:'rare',p:15},{id:'epic',p:6},{id:'legend',p:3},{id:'limited',p:0.5},{id:'exclusive',p:0.5}];
    // (구) NO_GACHA_TIERS 제거 — 한정은 '전부 제외'가 아니라 펫별 exActive로 선별 포함. 박스(가구)엔 한정 아이템이 없으므로 boxPool에서 한정을 걸러 안전 유지.
    const TIER_ORDER = TIERS.map(t=>t.id);   // 높은 등급이 비면 한 단계씩 낮춰 대체할 때 사용
    function tierInfo(id){ return TIERS.find(t=>t.id===id)||TIERS[0]; }
    // 동물 이름을 등급 색으로 표기. 일반(흰색)은 밝은 배경에서 안 보이므로 기본 잉크색, 한정(exclusive)은 무지개(.tier-rainbow), 신화(limited)는 핑크(등급색 인라인).
    function catTierColor(id){ const t=CAT_TIER[id]||'normal'; return t==='normal' ? 'var(--text)' : tierInfo(t).color; }
    function catNameSpan(id, name){ const t=CAT_TIER[id]||'normal'; const n=escapeHtml(name);
      if(t==='exclusive') return '<span class="tier-rainbow">'+n+'</span>';   // 한정 = 무지개
      return '<span style="color:'+catTierColor(id)+'">'+n+'</span>'; }   // 신화=핑크(#ff5fa2) 등 등급색
    // 🌈 한정 픽업(가챠 배너): [펫1(왼쪽), 펫2(오른쪽)]. 픽업 대상을 바꾸려면 이 배열만 수정. 존재하는 펫만 배너에 뜬다.
    const LIMITED_PICKUP = ['cat_leopardcat','cat_leopard'];   // 첫 한정 픽업: 펫1=삵 · 펫2=표범
    function pickupExists(id){ return !!id && PET_CATALOG.some(c=>c.id===id); }
    // 결정적 의사난수(0~1) — 인덱스·시드로 매 렌더 동일한 "랜덤 배치"(Math.random은 재렌더마다 튀어 금지).
    function pkRand(i,s){ const x=Math.sin((i+1)*12.9898+s*4.1414)*43758.5453; return x-Math.floor(x); }
    // 가챠 탭 상단 한정 픽업 배너 — 하늘(흐르는 구름 다수)+넓고 연한 무지개(1초 뒤 사르르)+뜰(흙·풀·꽃·원근 나무를 필드 전체에 원근 분포, 바람에 살랑) 가운데 로그인 알, 픽업 펫 둘은 캠 엔진(#pkStage)으로 걸어와 자유 배회.
    //  · 깊이 d(0=앞·크게·아래 ~ 1=뒤·작게·위): bottom%=d*범위, 크기=1-d*0.5. 나무는 뒤쪽(d 큼)만 → 펫 안 가림+하늘 안 침범.
    let _pkSceneCache={};   // 픽업 씬 메모 — 씬은 pkRand(결정적 시드)+상수 LIMITED_PICKUP에만 의존해 완전 결정적. (mode,픽업펫)로 1회만 생성하고, RTDB 틱마다 _sheetRefresh가 255KB/~4천 rect를 재생성하던 것을 제거. 픽업펫이 바뀌면 키가 달라져 자동 무효화.
    function pickupSceneHtml(mode){
      const _pkKey = mode + '|' + LIMITED_PICKUP.map(function(id){ return pickupExists(id)?id:'-'; }).join(',');
      if(_pkSceneCache[_pkKey]) return _pkSceneCache[_pkKey];
      const reveal = mode==='reveal', sz = reveal?1.85:1, S = h=>Math.max(1,Math.round(h*sz));   // 리빌은 전체화면 배경 → 데코 크게
      const p1=LIMITED_PICKUP[0], p2=LIMITED_PICKUP[1], H=92;   // 펫 렌더 기준 높이(원근 앞배율 1.5=~138 → 기본(≈48)의 약 3배)
      // ☁️ 하늘: 흐르는 구름 15개(제각각 높이·모양·색·속도·위상)
      let clouds=''; for(let i=0;i<15;i++){ const y=(2+pkRand(i,1)*30).toFixed(1), h=Math.round(11+pkRand(i,2)*17),
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
      // 🌳 가까운 나무 5그루 — 가로 '레인'으로 고르게(겹침 방지) · 크기 1.5배 · 뒤쪽만 · z<펫. 가운데(i=2)는 오른쪽으로 살짝(+9%). 오른쪽서 두번째(i=3)는 거의 맨앞(d=0.18=크게·낮게·앞, 아주 앞에서 살짝만 뒤) + 오른쪽으로(+5%)
      let trees=''; for(let i=0;i<5;i++){ const d=(i===3?0.18:0.5+pkRand(i,11)*0.28), l=((i+0.5)/5*88+6+(pkRand(i,12)-0.5)*6+(i===2?9:0)+(i===3?5:0)).toFixed(1),
        sc=1-d*0.5, bot=(d*70).toFixed(1), z=Math.round(2+(1-d)*2), pine=pkRand(i,13)<0.45;
        const inner = pine ? '<span class="pk-canopy">'+pineSvg({h:S(Math.max(16,Math.round(69*sc)))})+'</span>'
          : '<span class="pk-canopy">'+treeTopSvg({h:S(Math.max(16,Math.round(51*sc)))})+'</span><span class="pk-trunk">'+trunkSvg({h:S(Math.max(8,Math.round(24*sc)))})+'</span>';
        trees+='<span class="pk-tree'+(pine?' pk-pine':'')+'" style="left:'+l+'%;bottom:'+bot+'%;z-index:'+z+';--i:'+i+'">'+inner+'</span>'; }
      // 🌸 꽃 16 · 🌱 풀 18: 필드 전체(앞~뒤)에 원근 분포
      // 꽃 16 — 가로로 고르게 벌려(간격 ≈5.6%, 서로/큰 요소와 안 겹치게) + 앞쪽 필드 위주(d 0~0.6)로 낮게 깔아 나무·바위에 안 가리게
      let flowers=''; for(let i=0;i<16;i++){ const d=pkRand(i,21)*0.6, l=(5+(i+0.5)/16*90+(pkRand(i,22)-0.5)*3.5).toFixed(1),
        sc=1-d*0.5, bot=(d*76).toFixed(1), tn=['r','y','p'][Math.floor(pkRand(i,23)*3)];
        flowers+='<span class="pk-flower" style="left:'+l+'%;bottom:'+bot+'%;--i:'+i+'">'+flowerSvg(tn,{h:S(Math.max(9,Math.round(16*sc)))})+'</span>'; }
      let tufts=''; for(let i=0;i<18;i++){ const d=pkRand(i,31)*0.85, l=(2+pkRand(i,32)*96).toFixed(1),
        sc=1-d*0.5, bot=(d*80).toFixed(1);
        tufts+='<span class="pk-tuft" style="left:'+l+'%;bottom:'+bot+'%;--i:'+i+'">'+tuftSvg({h:S(Math.max(7,Math.round(12*sc)))})+'</span>'; }
      // 🟫 흙: 9군데 군데군데(원근)
      let soil=''; for(let i=0;i<9;i++){ const d=pkRand(i,41)*0.7, l=(3+pkRand(i,42)*90).toFixed(1),
        sc=1-d*0.45, bot=(d*72).toFixed(1), w=S(Math.round((10+pkRand(i,43)*16)*sc));
        soil+='<span class="pk-soil" style="left:'+l+'%;bottom:'+bot+'%;width:'+w+'px"></span>'; }
      // 🪨 원근 큐 — 징검다리 길 + 낮은 울타리(둘 다 필드=펫 뒤라 안 가림). 발밑 깊이선(bottom%=depth*53)에 맞춰 크기=펫과 같은 depthScale → 펫이 뒤로 가면 작은 돌·울타리 옆에 서서 깊이가 읽힘.
      let stones=''; const SN=6;
      for(let i=0;i<SN;i++){ const d=0.05+(i/(SN-1))*0.82, l=(50+(i%2?6:-6)+(pkRand(i,71)-0.5)*5).toFixed(1);
        stones+='<span class="pk-stone" style="left:'+l+'%;bottom:'+(d*53).toFixed(1)+'%;z-index:1;">'+stoneSvg({h:S(Math.max(6,Math.round(14*depthScale(d))))})+'</span>'; }
      let fence=''; [0.1,0.42,0.74].forEach(function(d){ const l=(10+d*9).toFixed(1);
        fence+='<span class="pk-fence" style="left:'+l+'%;bottom:'+(d*53).toFixed(1)+'%;z-index:1;">'+fenceSvg({h:S(Math.max(8,Math.round(20*depthScale(d))))})+'</span>'; });
      // 🦋 나비 5마리 — 섹터로 고르게(쏠림 없이 간격)·각자 제각각 팔랑(방향·경로 다름). 결정적 pkRand(재렌더 안정, 캐시)
      let bflies=''; const BFT=['o','b','p','y','o'];
      for(let i=0;i<5;i++){ const l=(9+((i+0.5)/5)*82 + (pkRand(i,61)-0.5)*7).toFixed(1), b=(24+pkRand(i,62)*50).toFixed(1),
        hh=S(Math.round(9+pkRand(i,63)*4)), dur=(6.5+pkRand(i,64)*5).toFixed(1), del=(-pkRand(i,65)*8).toFixed(2), fdur=(0.32+pkRand(i,66)*0.24).toFixed(2);
        let _s=80; const rnd=function(){ return pkRand(i,_s++); };
        bflies+='<span class="pk-bfly" style="left:'+l+'%;bottom:'+b+'%;--d:'+dur+'s;--fd:'+fdur+'s;animation-delay:'+del+'s;'+bflyDriftVars(rnd)+'"><span class="bf-wing">'+butterflySvg(BFT[i],{h:hh})+'</span></span>'; }
      // 🌑 깊이 그림자(펫 발밑, 액터 scale 그대로라 앞=크게·뒤=작게) — .cd-shadow는 배너(pkstage)에서만 보임(CSS). --pad(발밑 여백)로 발끝에 정렬.
      const actor=(id,lx)=> pickupExists(id) ? '<div class="cd-actor" data-cat="'+id+'" data-hh="'+H+'" style="left:'+lx+'px;"><span class="cd-shadow">'+shadowSvg({h:9})+'</span>'+catActorHTML(id,H)+'</div>' : '';
      // 🪨 중간 바위(겹침 큐, z=펫과 같은 12-depth*11 → 그보다 뒤 펫은 바위 뒤로 가려짐) + 🌿 전경 프레이밍(맨 앞 큰 풀·꽃, z 최상). 무대(pkstage) 안에 둠.
      const rock  = mode==='reveal' ? '' : '<span class="pk-rock" style="left:25%;bottom:'+(0.4*53).toFixed(1)+'%;z-index:'+Math.round(12-0.4*11)+';">'+rockSvg({h:Math.round(26*depthScale(0.4))})+'</span>';
      const frame = mode==='reveal' ? '' : '<span class="pk-frame" style="left:3%;z-index:20;">'+tuftSvg({h:34})+'</span><span class="pk-frame" style="left:97%;z-index:20;">'+flowerSvg('p',{h:30})+'</span>';
      const egg   = mode==='reveal' ? '' : '<div class="pk-egg"><img src="'+assetUrl('icons/egg-garden.svg')+'" alt=""></div>';   // 리빌은 알 대신 등장 펫이 주인공
      // 픽업 펫 2마리는 '배너'에서만 배회. 알 오픈 리빌(전설↑ 배경)에선 등장 펫이 주인공이라 배회 픽업 펫을 숨긴다(무대 자체를 안 그림). rock/frame도 배너 전용.
      const stage = mode==='reveal' ? '' : '<div class="cd-room pkstage" id="pkStage" data-noprops="1" data-hh="'+H+'" aria-hidden="true">'+rock+actor(p1,14)+actor(p2,99999)+frame+'</div>';
      const _pkHtml = '<div class="pkscene'+(mode==='reveal'?' pk-reveal':'')+'" aria-hidden="true">'+
          '<div class="pk-sky">'+clouds+'</div>'+
          '<div class="pk-rainbow">'+authRainbowSvg({h:S(64)})+'</div>'+
          '<div class="pk-horizon">'+farline+'</div>'+
          '<div class="pk-field"><div class="pk-grass"></div>'+soil+stones+fence+tufts+flowers+trees+egg+'</div>'+
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
        '<button class="gib sell" onclick="saveRenameCat(\''+id+'\')"><b>저장</b></button>'+
        '<button class="gib ghost" onclick="closeRename()">취소</button></div>';
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
    function openPetInfo(id){ if(!ownsCat(id)) return;
      let wrap=$('petInfo');
      if(!wrap){ wrap=document.createElement('div'); wrap.id='petInfo'; wrap.className='gimenu-scrim';
        wrap.onclick=function(e){ if(e.target===wrap) closePetInfo(); }; document.body.appendChild(wrap); }
      wrap.innerHTML='<div class="gimenu petinfo">'+petInfoBody(id)+'</div>'; }
    function closePetInfo(){ const m=$('petInfo'); if(m) m.remove(); }
    function petInfoBody(id){
      const c=ownedCatsMap()[id]||{}, tier=CAT_TIER[id]||'normal';
      const aff=Number(c.affection)||0, al=affectionLevel(aff);
      const roomOf=petRoomIndex(id), here=roomOf===roomIdx(), rooms=homeH().rooms||[];
      const roomNm=roomOf>=0?((rooms[roomOf]&&rooms[roomOf].name)||('방 '+(roomOf+1))):'';
      const roomTxt=here?'이 방':(roomOf>=0?roomNm:'대기 중');
      const now=Date.now(), last=Number(c.pettedAt)||0, rem=PET_COOLDOWN_MS-(now-last), canPet=rem<=0, hh=Math.ceil(Math.max(0,rem)/3600000);
      const got=c.boughtAt?fmtDate(c.boughtAt):'';
      return '<div class="gih pi-h">'+catFace(id,{h:40})+'<b>'+catNameSpan(id,catName(id))+'</b>'+
          '<button class="cn-edit pi-rename" aria-label="이름 짓기" onclick="openRenameCat(\''+id+'\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button></div>'+
        '<div class="pi-meta"><span class="pi-tier">'+tierLabelHtml(tier)+'</span><span class="s">'+escapeHtml(speciesLabel(id))+(got?' · 획득 '+got:'')+' · '+escapeHtml(roomTxt)+'</span></div>'+
        '<div class="pi-aff"><div class="pi-afftop"><span class="clv-h">'+heartSvg({h:11})+'</span>애정 Lv.'+al.level+'<span class="s">'+(al.next!=null?aff+' / '+al.next:'만렙 ★')+'</span></div><div class="bar"><i style="width:'+al.pct+'%"></i></div></div>'+
        (canPet?'<button class="gib sell" onclick="petFromInfo(\''+id+'\',event)">'+heartSvg({h:13})+' 쓰다듬기 · 애정+1 · 은화+'+PET_PET_REWARD+'</button>'
               :'<div class="pi-cd">오늘 쓰다듬기 완료 · 약 '+hh+'시간 후 가능</div>')+
        '<button class="gib" onclick="roomFromInfo(\''+id+'\')">'+(here?'이 방에서 대기시키기':'이 방으로 데려오기')+'</button>'+
        '<button class="gib ghost" onclick="closePetInfo()">닫기</button>';
    }
    function petFromInfo(id, ev){ const t=ev&&ev.currentTarget, b=t&&t.getBoundingClientRect?t.getBoundingClientRect():null;
      const x=b?b.left+b.width/2:innerWidth/2, y=b?b.top:innerHeight/2;
      bumpAffection(id, x, y);   // 하트·"UP!"·은화 지갑 연출 그대로
      setTimeout(function(){ if($('petInfo')) openPetInfo(id); }, 650); }   // 커밋·리스너 반영 후 상세 갱신(애정·쿨다운)
    function roomFromInfo(id){ toggleActiveCat(id); setTimeout(function(){ if($('petInfo')) openPetInfo(id); }, 400); }
    // 테스트 배정(등급당 1) — 펫알=고양이 / 랜덤박스=가구
    // @gen:pet-tier — 자동생성(tools/build_pets.py). tools/pets.json 의 tier 편집 후 재실행.
    const CAT_TIER = { cat_mackerel:'normal', cat_cheese:'normal', cat_calico:'normal', cat_black:'normal', cat_white:'normal', cat_fluffy:'normal', cat_tuxedo:'normal', cat_chaos:'normal', cat_siamese:'uncommon', cat_bengal:'normal', cat_fold:'normal', cat_bora:'epic', cat_choco:'normal', cat_kitten:'normal', cat_pink:'epic', tiger_orange:'limited', lion_mane:'limited', cat_persian:'legend', tiger_white:'limited', cat_russianblue:'normal', cat_bengal2:'uncommon', dog_mutt:'rare', cat_panther:'limited', dog_baekgu:'normal', dog_shiba:'epic', dog_corgi:'legend', dog_dalmatian:'uncommon', dog_dachshund:'epic', dog_bulldog:'normal', dog_injeolmi:'legend', dog_poodle:'rare', dog_beagle:'rare', dog_sukhee:'legend', dog_doberman:'legend', dog_pug:'legend', dog_shepherd:'legend', dog_bordercollie:'epic', dog_spitz:'normal', dog_jackrussell:'legend', dog_labrador:'epic', dog_chowchow:'epic', dog_cardigancorgi:'epic', dog_greyhound:'legend', dog_shihtzu:'uncommon', dog_stbernard:'epic', dog_bostonterrier:'rare', dog_bassethound:'legend', dog_happy:'normal', dog_welshterrier:'legend', dog_papillon:'uncommon', dog_newfoundland:'legend', dog_beardedcollie:'legend', dog_afghanhound:'legend', dog_rottweiler:'epic', dog_pointer:'epic', dog_pharaohhound:'legend', dog_westie:'normal', dog_weimaraner:'epic', dog_collie:'epic', dog_englishbulldog:'epic', dog_keeshond:'legend', dog_frenchbulldog:'epic', dog_yorkshire:'uncommon', dog_toypoodle:'uncommon', dog_sheltie:'rare', dog_minpin:'epic', dog_schnauzer:'epic', dog_goldendoodle:'uncommon', dog_bernese:'legend', dog_cavalier:'rare', dog_akita:'legend', dog_whippet:'legend', dog_oldenglishsheepdog:'epic', dog_vizsla:'epic', dog_englishsetter:'legend', dog_jindo:'limited', dog_chinesecrested:'epic', dog_scottie:'epic', dog_pomeranian:'normal', dog_sharpei:'epic', dog_greatdane:'legend', dog_bullterrier:'legend', dog_boxer:'epic', dog_ridgeback:'epic', dog_irishsetter:'epic', dog_airedale:'legend', dog_samoyed:'legend', dog_husky:'legend', cat_mackerel2:'epic', cat_calico2:'epic', cat_white2:'epic', cat_cheese2:'epic', cat_tuxedo2:'epic', cat_siamese2:'legend', cat_bengal3:'legend', cat_russianblue2:'epic', cat_scottishfold:'epic', cat_black2:'epic', cat_seolleong:'uncommon', cat_persiangray:'epic', cat_mainecoon:'legend', cat_americanshorthair:'epic', cat_ragdoll:'legend', cat_turkishangora:'epic', cat_munchkin:'epic', cat_norwegian:'epic', cat_bombay:'epic', cat_abyssinian:'epic', cat_sphynx:'legend', cat_british:'epic', cat_bengalsnow:'legend', cat_longhaircalico:'uncommon', cat_tortie:'epic', cat_siamesechoco:'epic', cat_cornishrex:'epic', cat_ocicat:'legend', cat_selkirkrex:'epic', cat_korat:'epic', cat_manx:'epic', cat_americancurl:'rare', cat_devonrex:'epic', cat_turkishvan:'epic', cat_bobtail:'epic', cat_burmese:'epic', cat_himalayan:'epic', cat_creamtabby:'rare', cat_lilac:'epic', cat_somali:'legend', cat_leopardcat:'exclusive', cat_lynx:'exclusive', cat_cheetah:'exclusive', cat_jaguar:'exclusive', cat_puma:'exclusive', cat_snowleopard:'exclusive', cat_caracal:'exclusive', cat_leopard:'exclusive', cat_blackpanther:'exclusive', cat_ocelot:'exclusive', cat_sandcat:'epic', cat_mainecoonsmoke:'legend', cat_mainecoonred:'epic', cat_bengalsilver:'epic', cat_peterbald:'legend', cat_toyger:'limited', cat_singapura:'epic', cat_havanabrown:'epic', cat_ragamuffin:'legend' };
    // @gen:end
    const ITEM_TIER = { pond:'limited', cushion:'normal', bowl:'uncommon', scratcher:'rare', pethouse:'epic', tower:'legend', catwheel:'limited',
      rug:'rare', fishtank:'epic', window:'legend', fireplace:'legend', fan:'legend', hammock:'legend', teaser:'legend', wallclock:'legend', hangplant:'legend', mobile:'legend', chandelier:'limited', jingleball:'legend',
      frame:'legend', shelf:'legend', mirror:'legend', neon:'legend', sconce:'legend', garland:'legend', poster:'legend', tapestry:'legend' };   // 러그=희귀·어항=특별·창문 등 장식/벽 가구=전설. 특별↑은 아래 isGachaOnlyItem로 자동 랜덤박스 전용
    // 🪑 비(非)펫 아이템 전역 등급/가격 오버라이드 — 관리자 쓰기·전체 읽기. 미설정은 기본값(_TIER 상수/카탈로그 price).
    //   config/furniture/{id}:{tier,price} = 가구, config/wallpaper/{id} = 벽지, config/floor/{id} = 바닥 스킨.
    let _furnCfg={}, _wallCfg={}, _floorCfg={};
    const FLOOR_TIER = { wood:'epic', checker:'epic', grass:'legend', ondol:'epic', starry:'epic', sand:'legend', tatami:'epic', brickpath:'epic' };   // 바닥 스킨 등급(랜덤박스 전용). 모래사장·잔디정원=전설, 나머지=특별.
    const WALL_TIER = { brick:'epic' };   // 벽지 등급 — 특별↑만 지정(랜덤박스 전용). 미지정 벽지는 normal(알뜰샵 구매). 새 특별↑ 벽지는 여기에 등급만 추가하면 자동 가챠 전용+박스풀 편입.
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
    // 벽지 등급/가격/가챠전용 — 팩토리 별칭(WALLPAPER_CATALOG.price 기본, config/wallpaper 오버라이드)
    function effWallTier(){ return effAssetTier('wallpaper'); }
    function wallTierOf(id){ return assetTierOf('wallpaper',id); }
    function wallBuyPrice(id){ return assetBuyPrice('wallpaper',id); }
    // 🎁 랜덤박스 통합 풀: 가구(it:)는 전 등급이 풀에 들어가 낮은 등급 롤도 채운다. 바닥(fl:)·벽지(wl:)는 목록 자체가 특별↑(가챠 전용). 타입 프리픽스로 지급 대상 구분.
    //  · 판매 제외(가챠 전용) 판정은 등급 기반(isGachaOnlyItem/Floor/Wall = tier≥epic) — 등급만 지정하면 "특별↑=박스에서만"이 자동 적용된다.
    function boxPool(){ const m={}; const it=effItemTier(), fl=effFloorTier(), wl=effWallTier();
      Object.keys(it).forEach(k=>{ if(it[k]!=='exclusive') m['it:'+k]=it[k]; });   // 한정 아이템은 랜덤박스에서 제외(현재 한정 가구·바닥·벽지 없음, 안전 가드)
      Object.keys(fl).forEach(k=>{ if(fl[k]!=='exclusive') m['fl:'+k]=fl[k]; });
      Object.keys(wl).forEach(k=>{ if(wl[k]!=='exclusive') m['wl:'+k]=wl[k]; }); return m; }
    function rollBoxReward(tiers, forced){ const raw = forced ? pickTierMember(boxPool(), forced) : rollFromPool(boxPool(), tiers); if(!raw) return null; const p=raw.id.split(':');
      return { id:p.slice(1).join(':'), tier:raw.tier, type:(p[0]==='fl'?'floor':(p[0]==='wl'?'wall':'item')) }; }
    function grantBoxReward(g, res){   // 지급 + (바닥/벽지 중복이면) 환급 은화 반환
      if(res.type==='floor'){ g.owned.floors=g.owned.floors||{}; if(g.owned.floors[res.id]) return Math.round((TIER_PRICE[res.tier]||0)*0.2); g.owned.floors[res.id]={boughtAt:new Date().toISOString()}; return 0; }
      if(res.type==='wall'){ if(g.owned.wallpapers[res.id]) return Math.round((TIER_PRICE[res.tier]||0)*0.2); g.owned.wallpapers[res.id]={boughtAt:new Date().toISOString()}; return 0; }
      if(g.owned.items[res.id]&&(Number(g.owned.items[res.id].qty)||0)>0) return Math.round((TIER_PRICE[res.tier]||0)*0.2);   // 이미 보유(qty>0) → 펫처럼 환급
      g.owned.items[res.id]={qty:1,boughtAt:new Date().toISOString()}; return 0; }
    // 가챠전용 판정: 전역 오버라이드(config/*.gacha, 개발자 토글)가 있으면 그 값, 없으면 등급 기반 기본값(특별↑=가챠전용).
    //   가챠전용=true → 알뜰샵 판매목록에서 숨김. false → 등급 무관 은화 판매. 어느 쪽이든 가챠(펫알/랜덤박스) 풀에는 항상 포함.
    function gachaOverride(cfg, id){ const o=cfg&&cfg[id]; return (o&&o.gacha!=null)?!!o.gacha:null; }
    function isGachaOnlyFloor(id){ return isGachaOnlyAsset('floor',id); }
    function isGachaOnlyWall(id){ return isGachaOnlyAsset('wallpaper',id); }
    // 바닥 스킨 등급: FLOOR_TIER 기본값에 전역 config/floor 병합. 가격: config 오버라이드 ← FLOOR_CATALOG.price.
    function effFloorTier(){ return effAssetTier('floor'); }
    function floorTierOf(id){ return assetTierOf('floor',id); }
    function floorBuyPrice(id){ return assetBuyPrice('floor',id); }
    // 랜덤박스 보상(바닥/벽지/가구) 등장 아트·이름
    function rewardBoxArt(res){ if(res.type==='floor') return '<div class="fx-tile" style="width:104px;height:104px;border-radius:16px;box-shadow:0 6px 16px rgba(0,0,0,.25);background:'+floorCss(res.id)+'"></div>';
      if(res.type==='wall') return '<div class="fx-tile" style="width:104px;height:104px;border-radius:16px;box-shadow:0 6px 16px rgba(0,0,0,.25);background:'+wallCss(res.id)+'"></div>';
      return furnSvg(res.id,{h:104}); }
    function rewardName(res){ if(res.type==='floor') return ((FLOOR_CATALOG.find(x=>x.id===res.id)||{}).name||res.id)+' 바닥';
      if(res.type==='wall') return ((WALLPAPER_CATALOG.find(x=>x.id===res.id)||{}).name||res.id)+' 벽지';
      return itemName('box', res.id); }
    // 등급별 알뜰샵 가격(은화) — 확률(60/20/15/3.8/1/0.2%)에 맞춰 등급이 오를수록 약 2배씩.
    // 알 100은화(+금화1·중복은 그 펫 가격의 20% 환급) 대비, 흔한 등급은 알보다 싸게·희귀 등급은 비싸게 → 직접구매 vs 뽑기 선택 성립.
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
    // 기구물 은화 구매가: 전역 config/furniture.price 오버라이드 ← ITEM_CATALOG.price 기본값
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
      if(typeof rerender==='function') rerender(); if(state && state._sheetRefresh) state._sheetRefresh(); }); }catch(e){} }
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
    // 가챠 구분별 짧은 설명(뜰알/펫알/랜덤박스/무지개) — 해당 탭에 맞는 한 줄.
    function gachaNoteFor(tab){
      if(tab==='ddeul')   return '🌱 <b class="tier-rainbow">한정 펫</b>은 오직 뜰알에서만! 살 때 <b>금화 1개를 소모</b>해요(펫알과 달리 금화 보상 없음, 중복 펫은 20% 은화 환급).';
      if(tab==='box')     return '🎁 열면 <b>가구·바닥·벽지</b>가 랜덤으로 — <b>특별↑ 장식</b>도 여기서. 열 때마다 <b>금화 1개</b>.';
      if(tab==='rainbow') return '✨ <b class="tier-rainbow">무지개</b>는 <b>금화</b>로 사서 <b>특별↑을 확정</b>으로 뽑아요(금화 보상 없음).';
      return '🥚 열면 <b>고양이</b>가 랜덤으로 — <b>특별↑</b>도 여기서. 열 때마다 <b>금화 1개</b>(중복 펫은 20% 은화 환급).';   // egg
    }
    // 가챠 탭 하단: 선택한 구분의 등급별 확률만 접이식으로 표시.
    function gachaInfoHtml(tab){
      const tiers=effTiers().filter(function(t){ return t.id!=='exclusive'; }), catBy=effCatTier(), itemBy=effItemTier();   // 한정은 기본 펫알/박스엔 없음(뜰알에서만)
      const row=(t)=> '<div class="gi-row"><b class="tier-'+t.id+'">'+t.name+'</b><span class="gi-p">'+t.p+'%</span></div>';
      let head='', rows='';
      if(tab==='box'){
        const boxHas=tid=> ITEM_CATALOG.some(x=>itemBy[x.id]===tid) || FLOOR_CATALOG.some(f=>FLOOR_TIER[f.id]===tid) || WALLPAPER_CATALOG.some(w=>WALL_TIER[w.id]===tid);
        head='🎁 랜덤박스 · 가구·바닥·벽지'; rows=tiers.filter(t=>boxHas(t.id)).map(row).join('');
      } else if(tab==='ddeul'){   // 🌱 뜰알(한정 픽업) — DDEUL_TIERS. 한정(exclusive)은 활성 픽업 펫이 있을 때만.
        head='🌱 뜰알 · 한정 픽업';
        rows=DDEUL_TIERS.map(dt=>{ if(dt.id==='exclusive' && !LIMITED_PICKUP.some(pickupExists)) return ''; const ti=tierInfo(dt.id);
          return '<div class="gi-row"><b class="tier-'+dt.id+'">'+ti.name+'</b><span class="gi-p">'+dt.p+'%</span></div>'; }).join('');
      } else if(tab==='rainbow'){   // ✨ 무지개 — RAINBOW_TIERS(특별90·전설8·신화2)
        head='✨ 무지개 · 특별↑ 확정';
        rows=RAINBOW_TIERS.map(rt=>{ const ti=tierInfo(rt.id);
          return '<div class="gi-row"><b class="tier-'+rt.id+'">'+ti.name+'</b><span class="gi-p">'+rt.p+'%</span></div>'; }).join('');
      } else {   // egg
        head='🥚 펫알 · 고양이'; rows=tiers.filter(t=>PET_CATALOG.some(x=>catBy[x.id]===t.id)).map(row).join('');
      }
      return '<details class="gacha-info"><summary>📋 이 뽑기 등급별 확률</summary><div class="gi-body">'+
        '<div class="gi-sec"><div class="gi-h">'+head+'</div>'+rows+'</div></div></details>';
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
    function pityForcedTierFor(key){ if(!pityForced(pityGet(key))) return null; return key==='ddeul' ? (Math.random()<0.5?'limited':'exclusive') : 'limited'; }
    // 가챠 카드에 붙는 종류별 천장 칩(신화↑ 확정까지 남은 뽑기).
    function pityChip(key){ const N=(typeof PITY_N!=='undefined'?PITY_N:100); return '<span class="pity-chip" title="이 종류를 '+N+'번 안에 신화 이상 확정">'+sparkSvg({h:10})+'신화확정 '+pityRemain(pityGet(key),N)+'뽑</span>'; }
    const GACHA_PRICE=100;
    // 중복 펫 환급 = 해당 펫 가격의 20%(등급가 기준). 가구(박스)는 중복 개념 없이 수량 누적(환급 없음).
    function petDupRefund(id){ const c=PET_CATALOG.find(x=>x.id===id); return c?Math.round((c.price||0)*0.2):0; }
    // 🌈 처음 획득 판정 — 뽑기 결과를 지급하기 "전" 보유 여부로 판단(등장 시 NEW 배지). 반드시 트랜잭션 커밋 전에 호출한다(커밋 후엔 리스너로 보유가 반영돼 오판).
    function isEggKind(k){ return k==='egg'||k==='ddeul'; }   // 뜰알(ddeul)은 펫알과 동일 취급(펫 지급·연출)
    function gachaNew(kind, res){ if(!res) return false;
      if(isEggKind(kind)) return !ownsCat(res.id);
      if(res.type==='floor') return !ownsFloor(res.id);   // default는 항상 보유 → NEW 아님
      if(res.type==='wall') return !ownsWall(res.id);
      return ((typeof itemQty==='function'?itemQty(res.id):0)===0); }   // 가구: 처음 보유(수량 0)면 NEW
    // 구매+롤(원자적): 은화-100, 금화+1, 지급(신규 고양이/가구 or 중복 펫 환급). 성공 시 연출.
    function openGacha(kind){
      if(coins()<GACHA_PRICE){ toast((GACHA_PRICE-coins())+' 은화 부족', true); return; }
      const forced=pityForcedTierFor(kind);   // 🔮 종류별 천장: 100뽑째면 신화(뜰알 외) 강제
      let res, dup=false, refund=0;
      if(kind==='egg'){ res = forced ? pickTierMember(gachaCatTierMap(), forced) : rollFromPool(gachaCatTierMap()); if(!res) return; dup=ownsCat(res.id); refund=dup?petDupRefund(res.id):0; }
      else { res=rollBoxReward(null, forced); if(!res) return;
        if(res.type==='floor') dup=ownsFloor(res.id)&&res.id!=='default';
        else if(res.type==='wall') dup=ownsWall(res.id)&&res.id!=='default';
        else dup=(typeof itemQty==='function'?itemQty(res.id):0)>0;   // 가구 중복(qty>0)도 grantBoxReward가 환급하므로 리빌에 '+N 은화(중복)'이 뜨게 dup/refund 세팅(C5)
        refund=dup?Math.round((TIER_PRICE[res.tier]||0)*0.2):0; }
      const isNew=gachaNew(kind,res);   // 지급 전 판정(NEW 배지)
      const hit=isTopTier(res.tier);    // 🔮 신화↑면 천장 리셋
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        if(g.coins<GACHA_PRICE) return;
        g.coins-=GACHA_PRICE; g.gold=(g.gold||0)+1; g.pity[kind]=pityNext(g.pity[kind]||0, hit);
        if(kind==='egg'){
          if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(res.id)<0) R.active.push(res.id); } }
          else { g.coins+=refund; }
        } else { const rf=grantBoxReward(g,res); if(rf) g.coins+=rf; }
        return g;
      }).then(r=>{ if(r&&r.committed) runGachaFx(kind, res, dup, refund, false, isNew); else toast('처리 중이에요 — 잠시 후 다시 시도해 주세요', true); });   // C4: 트랜잭션 중단(동시 소비 등) 시 무반응 대신 안내
    }
    // 🌱 뜰알(한정 픽업) — 은화로 여는 펫알. DDEUL_TIERS(한정 0.5% 포함, 활성 한정 펫만)로 롤, 오픈 연출은 뜰+무지개.
    const DDEUL_PRICE=100, DDEUL_GOLD=1;   // 프리미엄 픽업: 은화 100 + 금화 1(실제 소모, 금화 보상 없음).
    function openDdeul(){
      if(coins()<DDEUL_PRICE){ toast((DDEUL_PRICE-coins())+' 은화 부족', true); return; }
      if(gold()<DDEUL_GOLD){ toast('금화 '+(DDEUL_GOLD-gold())+' 부족', true); return; }
      const forced=pityForcedTierFor('ddeul');   // 🔮 천장: 뜰알 확정 = 신화 50% · 한정 50%
      const res = forced ? pickTierMember(gachaCatTierMap(), forced) : rollFromPool(gachaCatTierMap(), DDEUL_TIERS); if(!res) return;
      const dup=ownsCat(res.id), refund=dup?petDupRefund(res.id):0;
      const isNew=gachaNew('ddeul',res);
      const hit=isTopTier(res.tier);
      gameRef().transaction(g=>{ g=normalizeGame(g); if(g.coins<DDEUL_PRICE || (g.gold||0)<DDEUL_GOLD) return;
        g.coins-=DDEUL_PRICE; g.gold=(g.gold||0)-DDEUL_GOLD; g.pity.ddeul=pityNext(g.pity.ddeul||0, hit);   // 은화 100 + 금화 1 소모(금화 보상 없음)
        if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(res.id)<0) R.active.push(res.id); } }
        else { g.coins+=refund; }
        return g;
      }).then(r=>{ if(r&&r.committed) runGachaFx('ddeul', res, dup, refund, false, isNew); else toast('처리 중이에요 — 잠시 후 다시 시도해 주세요', true); });   // C4
    }
    // ===== ✨ 무지개알/무지개박스: 금화로 구매하는 소비템 → 사용 시 특별90·전설8·한정2% 가챠 =====
    const RAINBOW_TIERS=[{id:'epic',p:90},{id:'legend',p:8},{id:'limited',p:2}];   // limited=신화. 한정(exclusive)은 무지개알엔 없음 — 오직 뜰알에서만. 콘텐츠 없으면 rollFromPool이 한 단계 아래로 폴백
    const RAINBOW_PRICE_GOLD={ egg:10, box:10 };   // 무지개알·무지개박스 모두 금화10
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
      const rk=kind==='egg'?'rainbow_egg':'rainbow_box'; const forced=pityForcedTierFor(rk);   // 🔮 무지개 종류별 천장
      let res, dup=false, refund=0;
      if(kind==='egg'){ res = forced ? pickTierMember(gachaCatTierMap(), forced) : rollFromPool(gachaCatTierMap(), RAINBOW_TIERS); if(!res) return; dup=ownsCat(res.id); refund=dup?petDupRefund(res.id):0; }
      else { res=rollBoxReward(RAINBOW_TIERS, forced); if(!res) return;
        if(res.type==='floor') dup=ownsFloor(res.id)&&res.id!=='default';
        else if(res.type==='wall') dup=ownsWall(res.id)&&res.id!=='default';
        else dup=(typeof itemQty==='function'?itemQty(res.id):0)>0;   // 가구 중복(qty>0)도 환급 표시(C5)
        refund=dup?Math.round((TIER_PRICE[res.tier]||0)*0.2):0; }
      const isNew=gachaNew(kind,res);   // 지급 전 판정(NEW 배지)
      const hit=isTopTier(res.tier);
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.consum[key])||0)<1) return;
        g.consum[key]-=1; g.pity[rk]=pityNext(g.pity[rk]||0, hit);
        if(kind==='egg'){
          if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(res.id)<0) R.active.push(res.id); } }
          else { g.coins+=refund; }
        } else { const rf=grantBoxReward(g,res); if(rf) g.coins+=rf; }
        return g;
      }).then(r=>{ if(r&&r.committed) runGachaFx(kind, res, dup, refund, true, isNew); else toast('처리 중이에요 — 잠시 후 다시 시도해 주세요', true); });   // C4
    }
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
    const WALL_ANCHOR = { fireplace:'floor', window:'mount', wallclock:'mount', hangplant:'hang', mobile:'hang', chandelier:'hang', garland:'hang', tapestry:'hang' };
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
    // 벽 가구 캠 렌더 — 가로 앵커는 바닥과 동일(camAnchorMode), 세로는 앵커 종류에 따라(floor/mount/hang), z=0(맨 뒤 벽 평면).
    function wallPropMarkup(p, isDock, live){
      const foot=wallFoot(p.itemId), mode=camAnchorMode(p.c, foot.w), anchor=wallAnchorOf(p.itemId);
      const leftPct = mode==='left'?0 : mode==='right'?100 : (gridLeftFrac(p.c)+gridSpanFrac(foot.w)/2)*100;
      const txPct = mode==='left'?0 : mode==='right'?-100 : -50, x=leftPct.toFixed(2);
      let vpos, fh;
      if(anchor==='floor'){        // 바닥형: 맨 뒤 바닥 가구와 동일한 '바닥선'(3+1*46=49% bottom)에 서서 바닥에 붙음(붕 뜸 해결). 크기는 다른 벽 가구와 동일(furnWallH).
        fh=furnWallH(p.itemId, isDock); vpos='bottom:'+(3+1*46).toFixed(1)+'%';
      } else if(anchor==='hang'){  // 매다는형: 천장쪽 top 앵커로 아래로 늘어짐(행이 낮을수록 위)
        fh=furnWallH(p.itemId, isDock); vpos='top:'+(((p.r-1)/WALL_ROWS)*46).toFixed(1)+'%';
      } else {                     // 거는형(mount): 벽 밴드 안 bottom%(행=높이)
        fh=furnWallH(p.itemId, isDock); vpos='bottom:'+(WALL_MOUNT_BASE + (WALL_ROWS - p.r)*WALL_MOUNT_STEP).toFixed(1)+'%';
      }
      const inner = live&&FURN_ANIM[p.itemId] ? furnLiveSvg(p.itemId,{h:fh}) : furnSvg(p.itemId,{h:fh});
      return '<div class="cr-prop cr-wallprop cr-wall-'+anchor+'" style="left:'+x+'%;'+vpos+';z-index:0;--crtx:'+txPct+'%;transform:translateX(var(--crtx));">'+inner+'</div>';
    }
    let _selWall=null;
    function selWallItem(id){ if(itemRemaining(id)<=0){ toast(catFurnName(id)+' 전부 배치됨 — 회수하거나 더 얻어야 걸 수 있어요', true); return; } _selWall=(_selWall===id?null:id); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    // 벽 배치 트랜잭션(전역 인벤토리 재검증·겹침 재검증). placed와 별개 wallPlaced에 기록.
    function wallPlaceItemTx(sel, r, c){ const w=wallFoot(sel).w;
      captureUndo();
      gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoom(g); R.wallPlaced=R.wallPlaced||{};
        const qty=Number((g.owned.items[sel]||{}).qty)||0, placedAll=(typeof sumPlacedItem==='function')?sumPlacedItem(g.home.rooms, sel):0;
        if(qty-placedAll<=0) return;                                   // 남은 수량 없음(복제 차단, 바닥+벽 합산)
        if(!wallAreaFree(r,c,w,R.wallPlaced,null)) return;             // 겹침
        R.wallPlaced[r+'_'+c]={itemId:sel}; g.home.changedAt=new Date().toISOString(); return g;
      }).then(()=>{ touchHome(); });
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
      if(r<1||c<1||r+h-1>GRID_N||c+w-1>GRID_N) return false;   // 방 넓이 확장 시 GRID_N 한 곳만 바꾸면 정합
      if(floorItem) return true;
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
      if(isWallItem(sel)) return;                                       // 벽 가구는 바닥격자 배치 불가(벽꾸미기 전용)
      captureUndo();
      gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoom(g); R.placed=R.placed||{};
        const qty=Number((g.owned.items[sel]||{}).qty)||0, placedAll=(typeof sumPlacedItem==='function')?sumPlacedItem(g.home.rooms, sel):0;
        if(qty-placedAll<=0) return;                                   // 남은 수량 없음(복제 차단)
        if(!areaFree(r,c,foot.w,foot.h,R.placed,null,isFloorItem(sel))) return;         // 겹침(바닥 아이템은 겹침 허용)
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
      // 이동도 트랜잭션(자기 제외 겹침 재검증) — 리스너가 재렌더
      captureUndo();
      gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoom(g); const pl=R.placed||{};
        const it=pl[d.key]; if(!it) return;                               // 원본 없음(레이스)
        if(!areaFree(r,c,d.foot.w,d.foot.h,pl,d.key,isFloorItem(it.itemId))) return;             // 겹침(자기 제외, 바닥 아이템은 허용)
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
      if(CARE_ITEMS.indexOf(d.id)>=0 && itemPlaced(d.id)>=slotCount()){ toast('그 종류는 최대 '+slotCount()+'개까지 놓을 수 있어요', true); return; }
      const cell=dropCell(grid,e.clientX,e.clientY,d.foot), rr=cell.r, cc=cell.c;
      const placed=room().placed||{};
      if(!areaFree(rr,cc,d.foot.w,d.foot.h,placed,null,isFloorItem(d.id))){ toast('그 자리엔 놓을 수 없어요(겹침)', true); return; }
      placeItemTx(d.id, rr, cc, d.foot);
    }
    function catFurnName(id){ const it=ITEM_CATALOG.find(x=>x.id===id); return it?it.name:id; }
    function showDropPreview(r,c,foot,key,floorItem){
      const g=$('gdrop'); if(!g) return; const placed=room().placed||{};
      const rr=Math.min(13-foot.h,Math.max(1,r)), cc=Math.min(13-foot.w,Math.max(1,c));
      const ok=areaFree(rr,cc,foot.w,foot.h,placed,key,floorItem);
      g.hidden=false; g.className='gdrop'+(ok?'':' bad');
      g.style.left=(gridLeftFrac(cc)*100)+'%'; g.style.top=(gridLeftFrac(rr)*100)+'%';
      g.style.width=(gridSpanFrac(foot.w)*100)+'%'; g.style.height=(gridSpanFrac(foot.h)*100)+'%';
    }
    function hideDropPreview(){ const g=$('gdrop'); if(g) g.hidden=true; }
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
      captureUndo();
      gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoom(g); const pl=R.wallPlaced||{};
        const it=pl[d.key]; if(!it) return;                               // 원본 없음(레이스)
        if(!wallAreaFree(r,c,d.w,pl,d.key)) return;                        // 겹침(자기 제외)
        delete pl[d.key]; pl[newKey]={itemId:it.itemId}; g.home.changedAt=new Date().toISOString(); return g;
      }).then(()=>{ touchHome(); });
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
        '<button class="gib" onclick="retrievePlaced(\''+key+'\','+wf+')"><b>회수</b><span>인벤토리로 되돌려요(보유 유지)</span></button>'+
        '<button class="gib sell" onclick="sellPlaced(\''+key+'\','+wf+')"><b>판매</b><span>+'+ITEM_SELL+' 은화 · 보유에서 제거</span></button>'+
        '<button class="gib ghost" onclick="closeItemMenu()">닫기</button></div>';
      document.body.appendChild(wrap);
    }
    function closeItemMenu(){ const m=$('giMenu'); if(m) m.remove(); }
    function retrievePlaced(key, wall){ captureUndo(); roomTx(curRoomId(), roomIdx(), R=>{ const M=wall?(R.wallPlaced=R.wallPlaced||{}):(R.placed=R.placed||{}); delete M[key]; }); closeItemMenu(); toast('회수했어요(인벤토리로)'); }   // roomTx가 changedAt까지 갱신
    function sellPlaced(key, wall){
      captureUndo();
      const map=wall?(room().wallPlaced||{}):(room().placed||{}), p=map[key]; if(!p){ closeItemMenu(); return; }
      const id=p.itemId;
      gameRef().transaction(g=>{
        g=normalizeGame(g);
        const R=gRoom(g); const M=wall?(R.wallPlaced||{}):(R.placed||{}); if(!M[key]) return g;   // 이미 없음(중복 방지)
        delete M[key];
        const inv=g.owned.items[id];
        if(inv){ inv.qty=Math.max(0,(Number(inv.qty)||0)-1); if(inv.qty<=0) delete g.owned.items[id]; }
        g.coins += ITEM_SELL;
        g.home.changedAt=new Date().toISOString();
        return g;
      }).then(r=>{ if(r&&r.committed) toast('+'+ITEM_SELL+' 은화에 판매했어요'); });
      closeItemMenu();
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
    // 되돌리기(1스텝) — 배치 변경 직전 현재 방 스냅샷 저장, 버튼으로 복원. 방이 바뀌면 무효.
    let _undoSnap=null;
    function captureUndo(){ try{ const r=room(); _undoSnap={ roomId:curRoomId(), placed:Object.assign({},r.placed||{}), wallPlaced:Object.assign({},r.wallPlaced||{}) }; }catch(e){ _undoSnap=null; } }
    function undoPlace(){ if(!_undoSnap || _undoSnap.roomId!==curRoomId()){ _undoSnap=null; return; } const s=_undoSnap; _undoSnap=null;
      roomTx(s.roomId, roomIdx(), R=>{ R.placed=s.placed; R.wallPlaced=s.wallPlaced; }, ()=>{ if(state._sheetRefresh) state._sheetRefresh(); toast('되돌렸어요'); }); }
    function placeActionsBar(){ const r=room(); const hasAny=Object.keys(r.placed||{}).length||Object.keys(r.wallPlaced||{}).length;
      const canUndo=!!(_undoSnap && _undoSnap.roomId===curRoomId());
      if(!hasAny && !canUndo) return '';
      return '<div class="placeacts">'+
        (canUndo?'<button class="pa-btn" onclick="undoPlace()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>되돌리기</button>':'')+
        (hasAny?'<button class="pa-btn danger" onclick="captureUndo();clearRoom(curRoomId(),roomIdx())"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>이 방 비우기</button>':'')+
      '</div>'; }
    function catPlaceHtml(){
      const wallMode=_placeMode==='wall';
      const toggle='<div class="subseg placemode">'+
        '<button class="'+(!wallMode?'on':'')+'" onclick="setPlaceMode(\'floor\')">방꾸미기</button>'+
        '<button class="'+(wallMode?'on':'')+'" onclick="setPlaceMode(\'wall\')">벽꾸미기</button></div>';
      // ---- 미니 웹캠 프리뷰: 바닥+벽 배치를 함께 보여줌(표시 전용) ----
      const plist=placedList().sort((a,b)=>a.r-b.r); distributePoops(plist);
      const previewProps=wallPlacedList().map(p=>wallPropMarkup(p,true,false)).join('')+plist.map(p=>propMarkup(p,true)).join('');
      const preview='<div class="miniroom"><div class="cr-wall" style="background:'+wallCss(currentWall())+'"></div><div class="cr-floor" style="background:'+floorCss(currentFloor())+'"></div><div class="cr-base"></div><span class="cr-cam"><i></i>미리보기</span><div class="cr-props">'+previewProps+'</div></div>';
      let body;
      if(wallMode){
        // 벽 격자(12×4): 위=천장, 아래=바닥선. 탭으로 배치, 배치된 항목 탭=회수/판매.
        const wp=room().wallPlaced||{};
        const witems=Object.keys(wp).map(key=>{ const pr=key.split('_'), r=+pr[0], c=+pr[1], id=wp[key].itemId, w=wallFoot(id).w;
          const left=(gridLeftFrac(c)*100).toFixed(3), top=(((r-1)/WALL_ROWS)*100).toFixed(3), ww=(gridSpanFrac(w)*100).toFixed(3), hh=(100/WALL_ROWS).toFixed(3);
          return '<div class="gitem" style="left:'+left+'%;top:'+top+'%;width:'+ww+'%;height:'+hh+'%" onpointerdown="wallGiDown(event,\''+key+'\')" onclick="event.stopPropagation()"><span class="gsc">'+furnSvg(id,{fit:true})+'</span></div>'; }).join('');
        const wgrid='<div class="gridwall" id="wallGrid" onclick="wallPlaceClick(event)">'+witems+(witems?'':emptyGridHint())+'<div class="gdrop" id="wgdrop" hidden></div><div class="wsnap" id="wsnap" hidden></div><div class="wsnaph" id="wsnaph" hidden></div></div>';
        const wpal=ITEM_CATALOG.filter(it=>isWallItem(it.id) && itemQty(it.id)>0).map(it=>{ const rem=itemRemaining(it.id), sold=rem<=0, ft=itemTierOf(it.id);
          return '<button class="pitem'+(_selWall===it.id?' on':'')+(sold?' soldout':'')+'"'+(sold?' aria-disabled="true"':'')+' onpointerdown="wallPalDown(event,\''+it.id+'\')" onclick="if(event.detail===0)selWallItem(\''+it.id+'\')"><span class="pic tbring tb-'+ft+'">'+furnSvg(it.id,{h:palPicH(it.id)})+tierBadgeHtml(ft)+'</span><span>'+it.name+'</span><span class="pq">'+(sold?'전부 배치됨':'남은 '+rem)+'</span></button>'; }).join('');
        const wallHint='<div class="hintline" style="margin:8px 0 4px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16"/></svg>벽 가구를 <b>탭해 선택</b>하거나 <b>꾹 눌러 격자로 끌어</b> 걸어요(위=천장·아래=바닥선). 걸린 항목은 <b>꾹 눌러 드래그로 이동</b>, 짧게 탭하면 회수/판매. <b>특별↑ 벽 가구는 랜덤박스로만</b> 얻어요.</div>';
        body=wgrid+wallHint+'<div class="palette catinv">'+(wpal||'<div class="palempty">보유한 벽 가구가 없어요<br><span>랜덤박스에서 벽 가구를 모아보세요</span><button class="palcta" onclick="openShop()">알뜰샵 가기</button></div>')+'</div>'+skinPickerHtml('wall');
      } else {
        // 바닥 격자(12×12) — 기존 방꾸미기(드래그 이동·롱프레스). 벽 가구는 팔레트에서 제외.
        const placed=room().placed||{};
        const items=Object.keys(placed).map(key=>{ const pr=key.split('_'), r=+pr[0], c=+pr[1], id=placed[key].itemId, foot=itemFoot(id);
          const left=(gridLeftFrac(c)*100).toFixed(3), top=(gridLeftFrac(r)*100).toFixed(3), w=(gridSpanFrac(foot.w)*100).toFixed(3), h=(gridSpanFrac(foot.h)*100).toFixed(3);
          return '<div class="gitem" style="left:'+left+'%;top:'+top+'%;width:'+w+'%;height:'+h+'%" onpointerdown="giDown(event,\''+key+'\')" onclick="event.stopPropagation()">'+
            '<span class="gsc">'+furnSvg(id,{fit:true})+'</span></div>'; }).join('');
        const grid='<div class="grid12" id="placeGrid" onclick="placeClick(event)">'+items+(items?'':emptyGridHint())+'<div class="gdrop" id="gdrop" hidden></div></div>';
        const owned=ITEM_CATALOG.filter(it=>!isWallItem(it.id) && itemQty(it.id)>0);
        if(!_placeCat || !PLACE_CATS.some(c=>c[0]===_placeCat)) _placeCat=(PLACE_CATS.find(c=>owned.some(it=>placeCatOf(it.id)===c[0]))||PLACE_CATS[0])[0];
        const catTabs='<div class="subseg placecat">'+PLACE_CATS.map(c=>{ const inCat=owned.filter(it=>placeCatOf(it.id)===c[0]), nOwn=inCat.length, nAvail=inCat.filter(it=>itemRemaining(it.id)>0).length;
          return '<button class="'+(_placeCat===c[0]?'on':'')+(nOwn?'':' dim')+'"'+(nOwn?'':' aria-disabled="true"')+' onclick="setPlaceCat(\''+c[0]+'\')">'+c[1]+(nAvail?' <b>'+nAvail+'</b>':'')+'</button>'; }).join('')+'</div>';
        const pal=owned.filter(it=>placeCatOf(it.id)===_placeCat).map(it=>{ const foot=itemFoot(it.id), rem=itemRemaining(it.id), sold=rem<=0, ft=itemTierOf(it.id);
          return '<button class="pitem'+(_selItem===it.id?' on':'')+(sold?' soldout':'')+'"'+(sold?' aria-disabled="true"':'')+' onpointerdown="palDown(event,\''+it.id+'\')" onclick="if(event.detail===0)selItem(\''+it.id+'\')"><span class="pic tbring tb-'+ft+'">'+furnSvg(it.id,{h:palPicH(it.id)})+tierBadgeHtml(ft)+'</span><span>'+it.name+'</span><span class="pq">'+(sold?'전부 배치됨':foot.w+'×'+foot.h+' · 남은 '+rem)+'</span></button>'; }).join('');
        const dragHint='<div class="hintline" style="margin:8px 0 4px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11.5V5.5a1.5 1.5 0 0 1 3 0v5"/><path d="M12 10V4.5a1.5 1.5 0 0 1 3 0V10"/><path d="M15 9.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3l-2-3.5a1.5 1.5 0 0 1 2.6-1.5L9 14"/></svg><b>꾹 눌러서</b> 끌면 배치·이동돼요(짧게 탭하면 선택·메뉴). 화면 스크롤과 겹치지 않아요.</div>';
        const palBody=pal||'<div class="palempty">이 분류에 보유한 가구가 없어요<br><span>알뜰샵·랜덤박스에서 가구를 모아보세요</span><button class="palcta" onclick="openShop()">알뜰샵 가기</button></div>';
        body=grid+dragHint+catTabs+'<div class="palette catinv">'+palBody+'</div>'+skinPickerHtml('floor');
      }
      return roomStripHtml()+'<div class="editwrap">'+preview+toggle+placeActionsBar()+body+'</div>';
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
    let _dexTab=lsGet('dexTab','all');   // 도감 종별 탭('all'=전체 / species 코드)
    function setDexTab(t){ _dexTab=t||'all'; lsSet('dexTab',_dexTab); if(state._sheetRefresh) state._sheetRefresh(); }
    function dexSpeciesList(){ const seen={}, list=[]; PET_CATALOG.forEach(c=>{ const s=c.species||'cat'; if(!seen[s]){ seen[s]=1; list.push(s); } }); return list; }   // 도감 등장 종(순서 유지·중복 제거)
    function openPetDex(){
      const build=()=>{
        const owned=ownedCatsMap(), species=dexSpeciesList();
        if(_dexTab!=='all' && species.indexOf(_dexTab)<0) _dexTab='all';   // 사라진 종 방어
        const pool=PET_CATALOG.filter(c=> _dexTab==='all' || (c.species||'cat')===_dexTab);
        const prog=dexProgress(owned, pool.map(c=>c.id));   // 현재 탭 기준 진행도
        let h='<div class="dexhead"><div class="row" style="justify-content:space-between;"><b>수집'+(_dexTab!=='all'?' · '+escapeHtml(SPECIES_LABEL[_dexTab]||_dexTab):'')+'</b><span class="s">'+prog.owned+' / '+prog.total+' ('+prog.pct+'%)</span></div><div class="bar"><i style="width:'+prog.pct+'%"></i></div></div>';
        // 종별 탭(전체 + 종). 옆으로 스크롤(.subseg).
        const tabs=[['all','전체']].concat(species.map(s=>[s,(SPECIES_LABEL[s]||s)]));
        h+='<div class="subseg dextabs">'+tabs.map(function(t){ const id=t[0], nm=t[1], n=PET_CATALOG.filter(c=>id==='all'||(c.species||'cat')===id).length;
          return '<button class="'+(_dexTab===id?'on':'')+'" onclick="setDexTab(\''+id+'\')">'+escapeHtml(nm)+' <b>'+n+'</b></button>'; }).join('')+'</div>';
        const cell=function(c){ const has=!!owned[c.id], lv=has?affectionLevel(owned[c.id].affection).level:0;
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
      openSheet('펫 도감', build());
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(!b) return; const st=b.scrollTop; b.innerHTML=build(); b.scrollTop=st; };
    }
    // ===== 📢 소식(알림·이벤트·공지) — 알뜰 아이콘 '소식' 화면 =====
    // 업데이트 공지 — 기본값(폴백). 운영은 RTDB config/notices(관리자만 쓰기)에서 덮어씀(loadNotices). 최신순.
    // 업데이트 내역(요약) — 최신순. RTDB config/notices가 있으면 그걸로 덮어씀(아래는 기본값).
    // 업데이트 내역 기본값(요약) — 최신순. RTDB config/notices가 있으면 그걸로 덮어씀. 시즌·친구선물 홍보는 이벤트·알림 섹션에 이미 나오므로 여기(업데이트 내역)엔 넣지 않는다.
    // 🔒 여기(및 config/notices)는 일반 사용자에게 그대로 노출된다. 개발자 모드·치트·내부 도구 등 비공개 변경은 절대 넣지 말 것(운영 유출 크리티컬). 방어로 isDevNotice가 한 번 더 거른다.
    let NOTICES = [
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
      h+='<div class="row" style="gap:8px;margin-top:4px;"><button class="btn" style="flex:1;" onclick="sendAnnounce()">'+(editing?'수정 저장':'공지 등록')+'</button>'+(editing?'<button class="btn ghost" style="flex:none;" onclick="cancelAnnounceEdit()">취소</button>':'')+'</div>';
      const list=announceList();
      h+='<div class="sech" style="margin-top:18px;"><span class="l">등록된 공지</span><span class="s">'+list.length+'개</span></div>';
      h+= list.length ? list.map(function(a){ return '<div class="giftrow'+(_annEditId===a.id?' on':'')+'"><span class="gftx"><b class="gfnm">'+escapeHtml(a.title||'')+'</b>'+(a.body?'<span class="gfmsg">'+escapeHtml(a.body)+'</span>':'')+'</span><span style="display:flex;gap:6px;flex:none;"><button class="chip" onclick="editAnnounce(\''+a.id+'\')">수정</button><button class="chip" onclick="deleteAnnounce(\''+a.id+'\')">삭제</button></span></div>'; }).join('') : '<div class="note" style="margin:6px 2px;">등록된 공지가 없어요.</div>';

      // ── 업데이트 내역(config/notices) 관리 ──────────────────────────
      const nEditing=_noticeEditId?NOTICES.filter(function(n){ return n.id===_noticeEditId; })[0]:null; if(_noticeEditId && !nEditing) _noticeEditId=null;
      const nd=nEditing?(nEditing.date||''):kstDayKey(), nt=nEditing?(nEditing.t||''):'', ns=nEditing?(nEditing.s||''):'';
      h+='<div class="sech" style="margin-top:22px;"><span class="l">업데이트 내역</span><span class="s">소식 화면</span></div>';
      h+='<div class="note">소식 화면 <b>업데이트 내역</b>에 표시할 항목(날짜·제목·요약)을 등록·수정해요. 전역 <b>config/notices</b>(관리자만 쓰기·전체 읽기)에 저장돼 <b>배포 없이</b> 최신 1건이 사용자에게 반영됩니다. ⚠️ 개발자 모드·치트·내부 도구 등 비공개 변경은 넣지 마세요(개발용 CHANGELOG.md와 별개).</div>';
      if(nEditing) h+='<div class="note" style="border-left:3px solid var(--primary);">✏️ <b>업데이트 내역 수정 중</b> — 저장하면 이 항목이 바뀝니다.</div>';
      h+='<div class="field"><label for="nt_date">날짜</label><input class="input" id="nt_date" maxlength="10" placeholder="2026-07-05" value="'+escapeHtml(nd)+'"></div>';
      h+='<div class="field"><label for="nt_title">제목</label><input class="input" id="nt_title" maxlength="80" placeholder="예: 알뜰샵 개편" value="'+escapeHtml(nt)+'"></div>';
      h+='<div class="field"><label for="nt_body">요약</label><textarea class="input" id="nt_body" rows="2" maxlength="300" placeholder="예: 가챠 탭을 앞으로 옮기고 한정 픽업 배너를 추가했어요">'+escapeHtml(ns)+'</textarea></div>';
      h+='<div class="row" style="gap:8px;margin-top:4px;"><button class="btn" style="flex:1;" onclick="saveNotice()">'+(nEditing?'수정 저장':'내역 등록')+'</button>'+(nEditing?'<button class="btn ghost" style="flex:none;" onclick="cancelNoticeEdit()">취소</button>':'')+'</div>';
      const nlist=NOTICES.slice().sort(function(a,b){ return (b.date||'').localeCompare(a.date||''); });
      h+='<div class="sech" style="margin-top:14px;"><span class="l">등록된 내역</span><span class="s">'+nlist.length+'개</span></div>';
      h+= nlist.length ? nlist.map(function(n){ const dev=isDevNotice(n)||isPromoNotice(n); return '<div class="giftrow'+(_noticeEditId===n.id?' on':'')+'"><span class="gftx"><b class="gfnm">'+escapeHtml(n.date||'')+' · '+escapeHtml(noticeTitle(n))+(dev?' <span style="color:var(--expense);font-size:11px;">(비노출)</span>':'')+'</b>'+(n.s?'<span class="gfmsg">'+escapeHtml(n.s)+'</span>':'')+'</span>'+(n.id!=null?'<span style="display:flex;gap:6px;flex:none;"><button class="chip" onclick="editNotice(\''+n.id+'\')">수정</button><button class="chip" onclick="deleteNotice(\''+n.id+'\')">삭제</button></span>':'<span class="chip" style="flex:none;opacity:.6;">기본값</span>')+'</div>'; }).join('') : '<div class="note" style="margin:6px 2px;">등록된 내역이 없어요.</div>';
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
    function couponIcon(d){ if(d.type==='coins') return coinSvg({h:15}); if(d.key==='ddeul') return ddeulEggSvg({h:16}); if(d.key==='rainbow_egg') return rainbowEggSvg({h:16}); if(d.key==='rainbow_box') return rainbowBoxSvg({h:16}); if(d.key==='egg') return eggSvg(0,{h:16}); if(d.key==='box') return boxSvg({h:16}); return coinSvg({h:15}); }
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
      h+=limitedPickupBanner();   // 🌈 한정 픽업 배너(있을 때만) — 이달의 할인펫 배너 위에
      const fid=featuredCatId();
      if(fid){ const fc=PET_CATALOG.find(function(x){ return x.id===fid; }); if(fc){
        h+='<div class="featbanner" role="button" tabindex="0" onclick="openShop()"><span class="fstar">'+sparkSvg({h:20})+'</span><div class="fb-txt"><b>'+monthLabelKo()+' 이달의 펫 · '+catNameSpan(fid,fc.name)+'</b><span class="s">이번 달만 '+Math.round(FEATURED_DISCOUNT*100)+'% 할인 — '+catBuyPrice(fid)+' 은화'+(ownsCat(fid)?' (보유 완료)':' · 사러가기')+'</span></div><span class="fb-face">'+catFace(fid,{h:40})+'</span></div>'; } }
      else { h+='<div class="note" style="margin:2px 0 6px;">진행 중인 이벤트가 곧 열려요.</div>'; }
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
    function runGachaFx(kind, res, dup, refund, rainbow, isNew){
      const fx=$('catFx'); if(!fx){ toast((kind==='egg'?'펫알':'랜덤박스')+' 획득!'); return; }
      _fxClear();   // 이전 FX 잔여 타이머 취소(빠른 재오픈 교차 방지)
      _fx={ kind, res, dup, refund:refund||0, stage:0, rainbow:!!rainbow, gold: (rainbow||kind==='ddeul')?0:1, isNew:!!isNew };   // 무지개·뜰알은 금화 보상 없음(뜰알은 금화 소모). isNew=처음 획득(NEW 배지)
      if(isEggKind(kind) && typeof hasSprite==='function' && hasSprite(res.id)){ try{ const _pi=new Image(); _pi.src=sprStill(res.id,'south'); if(_pi.decode) _pi.decode().catch(function(){}); }catch(e){} }   // 등장 스프라이트 미리 로드·디코드(펫알·뜰알 공통) → 마지막에 바로 표시
      if(typeof prewarmGachaFxPads==='function') prewarmGachaFxPads();   // 연출 고양이 발끝 여백 미리 측정(탭하는 동안 캐시 완료 → 첫 등장 세로 점프 방지)
      if(reducedMotion()){ fxReveal(); return; }   // 모션 최소화: 바로 결과
      const isDdeul = kind==='ddeul';
      const art = rainbow ? (isEggKind(kind)? rainbowEggSvg({h:150}) : rainbowBoxSvg({h:150}))
                          : (isDdeul? ddeulFxHtml() : (isEggKind(kind)? eggSvg(0,{h:150}) : boxSvg({h:150})));
      const hint = isDdeul? '뜰알을 탭해서 깨보세요! (3번)' : (isEggKind(kind)? '알을 탭해서 깨보세요! (3번)' : '상자를 탭해서 흔들어 열어요! (3번)');
      fx.innerHTML='<div class="fx-scrim"></div><div class="fx-stage'+(rainbow?' fx-rb':'')+(isDdeul?' fx-ddeul':'')+'">'+
        (rainbow?fxSparkles(16):'')+
        '<div class="fx-item pop '+(isEggKind(kind)?'fx-egg':'fx-box')+(isDdeul?' fx-ddeulegg':'')+(rainbow?' fx-rainbow':'')+'" id="fxItem" role="button" aria-label="'+hint+'" onclick="fxTap()">'+art+'</div>'+
        '<div class="fx-hint" id="fxHint">'+hint+'</div></div>';
      fx.className='fx on';
    }
    // 🌈🦋 뜰알 전용 연출 — 알 위쪽에 픽업 배너의 무지개가 '스르르'(천천히) 크게 뜨고, 배너의 나비 5마리가 알 주변을 팔랑팔랑 날아다닌다.
    //   펫알의 무지개알 승급(maybeRainbowUpgrade)과 '같은 타이밍'(2번째 탭)에 등장 — 처음부터 보이지 않게. 중복 생성 방지.
    function ddeulPickupFx(st){ if(!st || st.querySelector('.fx-ddrainbow')) return;
      // ☁️ 흐르는 구름 몇 개(위쪽 하늘)
      const CL=[{t:8,w:2,tn:'w',h:32,d:34,dl:-6},{t:18,w:1,tn:'b',h:22,d:47,dl:-27},{t:4,w:0,tn:'w',h:40,d:28,dl:-15},{t:25,w:1,tn:'w',h:18,d:56,dl:-41}];
      let c=''; CL.forEach(function(o){ c+='<span class="fx-ddcloud" style="top:'+o.t+'%;--d:'+o.d+'s;animation-delay:'+o.dl+'s">'+cloudSvg(o.w,o.tn,{h:o.h})+'</span>'; });
      st.insertAdjacentHTML('afterbegin','<div class="fx-ddclouds" aria-hidden="true">'+c+'</div>');
      // 🌈 무지개 — 화면 안에서 양옆까지 감싸는 둥근(반원) 아치가 왼→오로 펼쳐진다
      st.insertAdjacentHTML('afterbegin','<div class="fx-ddrainbow" aria-hidden="true">'+authRainbowSvg()+'</div>');
      // 🦋 나비 7마리 — 알 주변에 '섹터'로 고르게(쏠림 없이 간격) + 전체 살짝 왼쪽으로 + 매 연출 랜덤 위치, 각자 제각각 팔랑(방향·속도·경로 다름)
      const T=['o','b','p','y','o','p','b']; let b=''; const N=7, SH=-28;   // SH=전체 왼쪽 시프트
      for(let i=0;i<N;i++){
        const ang=((i+Math.random()*0.7)/N)*Math.PI*2, rx=118+Math.random()*72, ry=142+Math.random()*72;
        const mx=Math.round(Math.cos(ang)*rx)+SH, my=Math.round(Math.sin(ang)*ry);
        const hh=Math.round((13+Math.round(Math.random()*4))*1.5), dur=(6+Math.random()*5).toFixed(1), fd=(0.32+Math.random()*0.28).toFixed(2), del=(-Math.random()*8).toFixed(2);
        b+='<span class="fx-ddbfly" style="margin:'+my+'px 0 0 '+mx+'px;--d:'+dur+'s;--fd:'+fd+'s;animation-delay:'+del+'s;'+bflyDriftVars(Math.random)+'"><span class="bf-wing">'+butterflySvg(T[i%T.length],{h:hh})+'</span></span>'; }
      st.insertAdjacentHTML('beforeend','<div class="fx-ddbflies" aria-hidden="true">'+b+'</div>');
      const hint=$('fxHint'); if(hint) hint.textContent='🌈 무지개가 펼쳐져요! 한 번 더 탭!'; }
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
      _fx.stage++;
      if(_fx.stage>=3){ _fx.busy=true; fxClimax(); return; }   // 알·박스 모두 3번 탭에 오픈
      if(isEggKind(_fx.kind)){
        if(_fx.stage===2 && !_fx.rainbow && _fx.kind!=='ddeul') maybeRainbowUpgrade();   // 2번째 탭 직후: 특별↑이면 확률로 무지개알 승급(뜰알은 제외 — 뜰알은 무지개+나비 전용 연출)
        if(_fx.stage===2 && _fx.kind==='ddeul' && (_fx.res.tier==='exclusive' || Math.random()<rbUpgradeChance(_fx.res.tier))) ddeulPickupFx(it.closest('.fx-stage'));   // 뜰알 무지개+나비 = 펫알 무지개알 승급과 '같은 조건'(특별50%·전설/신화100%) + 한정(exclusive)이면 항상. 무조건 아님.
        if(_fx.stage===2 && _fx.kind!=='ddeul' && _fx.rainbow) ddeulPickupFx(it.closest('.fx-stage'));   // 펫알(무지개알로 승급) · 무지개알(원래부터)도 뜰알과 동일한 무지개+나비 연출 — 승급 조건과 같은 타이밍/조건
        it.innerHTML = _fx.kind==='ddeul' ? ddeulFxHtml() : (_fx.rainbow?rainbowEggStage(_fx.stage,{h:150}):eggSvg(_fx.stage,{h:150}));
        it.classList.remove('shake'); void it.offsetWidth; it.classList.add('shake');   // 탭마다 알이 좌우로 크게 흔들림
        if(_fx.kind==='ddeul'){ const fl=it.querySelector('.fx-ddflower'); if(fl) fl.classList.add('flswing'); }   // 뜰알: 탭 흔들림에 맞춰 꽃도 줄기에서 팔랑(갓 렌더된 요소라 클래스 추가만으로 재생)
        fxCrackChips(_fx.stage);   // 탭마다 껍질 조각이 튀어 깨짐을 강조
      } else {
        it.classList.remove('boxshake'); void it.offsetWidth; it.classList.add('boxshake');   // 박스: 양옆으로 들고 흔드는 느낌
      }
    }
    // 🌈 무지개 발동 확률(단일 소스) — 특별50%·전설/신화100%·그 외 0%. 펫알 무지개알 승급과 뜰알 무지개+나비 연출이 '같은 조건'을 공유한다.
    function rbUpgradeChance(tier){ return (tier==='epic')?0.5:((tier==='legend'||tier==='limited')?1:0); }
    // ✨ 무지개 승급: 결과 등급이 특별↑이면 확률로 알을 무지개알로 변신(특별 50% · 전설/한정 100%).
    //    시각·연출만 무지개로 바뀌고 결과 펫·보상(_fx.gold)은 그대로. 3번째 탭에서 무지개 오픈 연출로 열린다.
    function maybeRainbowUpgrade(){
      const tier=_fx.res.tier; const chance=rbUpgradeChance(tier);   // 신화 텍스트색은 핑크지만 알 열 때 무지개알 승급 유지
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
      el.style.setProperty('--cat', size+'px');
      // 발끝 기준선(--floor) = 알의 실제 바닥. 알(#fxItem)의 레이아웃 위치(offsetTop+offsetHeight, transform 영향 없음)로 측정 → 고양이가 알 옆 같은 바닥에 서게. 실전엔 힌트가 제거돼 알이 무대 중앙, 미리보기엔 힌트가 있어 알이 위쪽 — 둘 다 실측이라 자동 정합.
      const eggEl=(typeof $==='function'&&$('fxItem'))|| (st.querySelector&&st.querySelector('.fx-item'));
      const floor = eggEl ? (eggEl.offsetTop + eggEl.offsetHeight) : Math.round((st.offsetHeight||st.clientHeight||480)*0.62);
      el.style.setProperty('--floor', floor+'px');
      // --foot=스프라이트 하단 투명여백 비율(발끝을 --floor=알 바닥에 정확히 맞추는 보정). 펫·기본 고양이 모두 걷는 walk 시트를 실측(measureFxFoot)해 크기·종류 무관하게 동일 정합. 하드코딩 금지.
      const fpKey=isPet?(id+':fxwalk'):'_gc', fpDef=isPet?PET_FOOT_PAD:GACHACAT_FOOT_DEFAULT;
      el.style.setProperty('--foot', (typeof _footPad!=='undefined'&&_footPad[fpKey]!=null?_footPad[fpKey]:fpDef).toFixed(3));   // 측정 전 즉시 기본값(prewarm됐으면 캐시 적중 → 점프 없음)
      if(isPet){ ensurePetArt(id); el.innerHTML='<div class="fxc-in">'+catActorHTML(id, size)+'</div>'; }
      else { el.innerHTML='<div class="fxc-in"></div>'; }
      if(typeof measureFxFoot==='function') measureFxFoot(isPet?id:null, function(fp){ el.style.setProperty('--foot', fp.toFixed(3)); });
      st.appendChild(el);
    }
    // 가챠 연출 고양이 시퀀스를 _fxT 타이머로 예약(1번 왼쪽 → 끝나면 2번 오른쪽, 순차). 알 무대(st)·아이템(it)에 동작하고 '마지막 고양이가 톡 치는 시각(=알 오픈 타이밍)'을 ms로 반환. fxClimax(실전)·devPreviewGachaFx(미리보기) 공용.
    // 가챠 연출에 걸어나올 펫 2마리 선정. 한정(exclusive) 뽑기 → 개발자 지정(config/gachaFx a/b). 그 외 → 전설·신화 등급 펫 중 랜덤 2마리(스프라이트 보유).
    function fxCatPickIds(){
      if(_fx && _fx.res && _fx.res.tier==='exclusive') return { a:(_gachaFx&&_gachaFx.a)||null, b:(_gachaFx&&_gachaFx.b)||null };
      const pool=PET_CATALOG.filter(function(c){ const t=CAT_TIER[c.id]; return (t==='legend'||t==='limited') && typeof hasSprite==='function' && hasSprite(c.id); }).map(function(c){ return c.id; });
      if(!pool.length) return { a:null, b:null };
      const a=pool[Math.floor(Math.random()*pool.length)];
      let b=pool[Math.floor(Math.random()*pool.length)];
      if(pool.length>1){ let g=0; while(b===a && g<6){ b=pool[Math.floor(Math.random()*pool.length)]; g++; } }
      return { a:a, b:b };
    }
    function fxCatSeqSchedule(st, it){
      const pick=fxCatPickIds(); const a=pick.a, b=pick.b, any=a||b;
      const seq=[]; if(a || !any) seq.push({side:'l', id:any?a:null}); if(b) seq.push({side:'r', id:b});
      const WALK=1800, TAP=160, HIT=180, STEP=2760;   // 한 마리 구간: 등장(WALK)→톡(TAP 뒤 HIT 충격)→퇴장(STEP에서 제거)
      const catAt=side=>st.querySelector('.fx-cat.fxc-'+side);
      seq.forEach((c, i)=>{ const base=i*STEP, isLast=i===seq.length-1;
        _fxT(()=>{ fxSpawnCat(st, c.side, c.id); }, base);   // 등장(walkin)
        _fxT(()=>{ const el=catAt(c.side); if(el){ el.classList.remove('walkin'); el.classList.add('arr','tap'); } }, base+WALK);   // 도착 → 앞발 톡(펫 .cspr은 계속 걷고, 기본 고양이는 CSS로 정지 스틸)
        _fxT(()=>{ it.classList.remove('fx-preshake'); void it.offsetWidth; it.classList.add('fx-hit');   // 앞발이 닿는 순간 알/상자가 톡 튕김
          const fl=it.querySelector('.fx-ddflower'); if(fl){ fl.classList.remove('flswing'); void fl.offsetWidth; fl.classList.add('flswing'); } }, base+WALK+TAP);   // 뜰알: 펫이 톡 칠 때도 탭처럼 꽃이 팔랑
        _fxT(()=>{ const el=catAt(c.side); if(el){ el.classList.remove('tap'); el.classList.add('leave'); } it.classList.remove('fx-hit'); if(!isLast){ void it.offsetWidth; it.classList.add('fx-preshake'); } }, base+WALK+TAP+HIT);   // 톡 후 물러나며 흐려짐, 다음 고양이 있으면 알은 다시 들썩이며 대기
        _fxT(()=>{ const el=catAt(c.side); if(el) el.remove(); }, base+STEP);
      });
      return (seq.length-1)*STEP+2120;   // 마지막 고양이가 톡 친 직후(=알 오픈 타이밍)
    }
    function fxClimax(){
      const fx=$('catFx'), st=fx&&fx.querySelector('.fx-stage'), it=$('fxItem'); if(!st||!it) return;
      const t=tierInfo(_fx.res.tier), epic=['epic','legend','limited'].indexOf(_fx.res.tier)>=0, lim=_fx.res.tier==='limited', exL=_fx.res.tier==='exclusive';   // exL=한정 → 빛을 무지개로
      // 검은 고양이 앞발 연출 = 고등급 티저. 등급별 확률: 특별(epic) 10%·전설 90%·한정 100% (그 미만 0%). 등장 자체가 '뭔가 좋은 게 나온다'는 힌트.
      const catShow = Math.random() < (({ epic:0.10, legend:0.90, limited:1.0, exclusive:1.0 })[_fx.res.tier] || 0);   // 한정도 100% 연출 펫 등장(개발자 지정 펫)
      const rank=Math.max(0, TIER_ORDER.indexOf(_fx.res.tier));   // 0(일반)~5(신화)~6(한정)
      const lk=(1+rank*0.15).toFixed(2);                          // 등급 높을수록 빛이 크고 밝게
      const isEgg=isEggKind(_fx.kind);
      st.style.color='#ffffff';   // 오픈 전(흔들림·고양이)엔 흰빛 — 등급색을 미리 깔면 열기 전에 등급이 새므로, 실제 열리는 순간(t0)부터 등급색으로 바꾼다
      const hint=$('fxHint'); if(hint) hint.remove();
      it.classList.add('fx-preshake');
      let t0=680;
      // 개발자가 지정한 펫(config/gachaFx)이 도도하게 걸어나와 앞발로 알을 톡 → 그 자리서 알 오픈. 1번(왼쪽) 끝난 뒤 2번(오른쪽) 순차. 미지정이면 기본 검은고양이(왼쪽 1마리).
      if(catShow) t0=fxCatSeqSchedule(st, it);   // 마지막 고양이가 톡 친 직후 알 오픈
      _fxT(()=>{
        st.style.color=t.color;   // 열리는 순간부터 등급색 — 빛·픽셀 파티클·버스트·등장이 currentColor로 등급색을 따른다(그 전엔 흰빛이라 등급 스포일러 방지)
        it.classList.remove('fx-preshake','fx-hit','shake','boxshake'); void it.offsetWidth; it.classList.add('fx-tremble');
        const softC = isEgg && _fx.kind!=='ddeul';   // 🥚 펫알·무지개알: '조금만 덜 열리고' 등급색 빛을 은은·연하게
        if(_fx.kind==='ddeul'){ it.innerHTML=ddeulFxHtml(); fxCrackChips(4); }   // 뜰알: 고양이 얼굴 알이 크게 들썩(꽃도 크게 흔들림)+껍질 조각 튐 후 버스트
        else if(isEgg){ it.innerHTML=pxSvg(M_EGG_C2, Object.assign({}, _fx.rainbow?EGG_PAL_RB:EGG_PAL, {L:softTier(t.color)}), {h:150}); fxCrackChips(2); }   // 덜 열린(C2) + 연한 등급색 빛(살짝만 새어나옴)
        else { it.innerHTML=boxOpenSvg(t.color, _fx.rainbow, {h:150}); it.classList.add('fx-ajar'); }   // 박스: 뚜껑 열리고 틈새로 등급색 빛
        // 갈라진 틈으로 새어나오는 등급색 픽셀 빛 — 도트 오오라(+광선). softC면 작고·연하게(광선 파문 제거).
        st.insertAdjacentHTML('afterbegin','<div class="fx-cracklight'+(softC?' soft':'')+'" style="color:'+(exL?t.color:(softC?softTier(t.color):t.color))+';--lk:'+(1+rank*(softC?0.07:0.15)).toFixed(2)+'">'+lightLayers({aura:(softC?110:170), rays:(softC?120:220), rainbow:exL})+'</div>');   // 한정=틈새로 새는 빛도 무지개
      }, t0);
      _fxT(()=>{ fxBurst(epic, isEgg, rank); }, t0+700);
      _fxT(fxReveal, t0+700+(isEgg?560:320));   // 알은 껍질 조각이 옆으로 흩어져 앉을 시간을 조금 더 준다
    }
    function fxBurst(big, isEgg, rank){
      const st=$('catFx').querySelector('.fx-stage'); if(!st) return;
      const it=$('fxItem'); if(it) it.style.visibility='hidden';
      rank=rank||0;
      const bc=(_fx&&_fx.res&&_fx.res.tier==='exclusive')?'RAINBOW':'currentColor';   // 한정 버스트 광선=무지개
      const parts=12+rank*7;                          // 등급 높을수록 픽셀 파티클 더 많이(화려하게)
      const rays=(rank>=3)?'<div class="fx-pixrays">'+raysSvg(bc,{h:360})+'</div>':'';       // 특별↑ 등급색(한정=무지개) 픽셀 광선(선버스트)
      const sparks=(rank>=3)?fxSparkles(6+rank*3):'';             // 특별↑ 추가 반짝임(등급색)
      st.insertAdjacentHTML('beforeend','<div class="fx-pixflash">'+raysSvg(bc,{h:150})+'</div>'+rays+sparks+(isEgg?fxShells():'')+fxParticles(parts));
      const h=$('fxHint'); if(h) h.remove();
    }
    // 🔤 픽셀(도트) 텍스트 — 저해상도 캔버스에 굵게 그린 뒤 알파를 1비트로 하드엣지 처리하고, 표시 시 확대(image-rendering:pixelated)해 '도트 폰트'처럼 블록지게. fill=색 문자열 또는 'RAINBOW'(가로 무지개). 한글 임의 텍스트(펫 이름 포함)도 커버. 캔버스 미지원/에러 시 일반 텍스트로 안전 폴백.
    // 🔤 결과 텍스트(등급·아이템 이름) 렌더 — 예전엔 저해상도+1비트 알파로 '도트 폰트'를 흉내냈지만 한글이 뭉개져(획 손실) 가독성이 나빴다.
    //  → 이제 표시 크기의 레티나(devicePixelRatio) 해상도로 안티에일리어싱해 그려 '선명하게'(fill=색/RAINBOW 유지, 무대 그림자·굵기는 CSS). 캔버스 미지원 시 일반 텍스트 폴백.
    function pixelTextHtml(text, fill, opt){
      opt=opt||{}; text=String(text==null?'':text);
      try{
        if(typeof document==='undefined' || !document.createElement) throw 0;
        const dh=opt.h||Math.round((opt.base||14)*2);   // 표시 높이(px)
        const dpr=Math.max(2, Math.min(3, (typeof window!=='undefined' && window.devicePixelRatio) || 2));   // 최소 2배 슈퍼샘플 → 확대해도 선명
        const H=Math.max(8, Math.round(dh*dpr));         // 캔버스(고해상) 높이
        const fpx=Math.max(6, Math.round(H*0.70));       // 폰트 크기(높이의 ~70%, 한글 여백 확보)
        const font='900 '+fpx+'px system-ui,-apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif';
        let cv=document.createElement('canvas'), g=cv.getContext('2d'); if(!g) throw 0;
        g.font=font; const tw=Math.max(1, Math.ceil(g.measureText(text).width));
        const pad=Math.round(H*0.09)+2, W=tw+pad*2;
        cv.width=W; cv.height=H; g=cv.getContext('2d'); g.font=font; g.textBaseline='middle';
        if(fill==='RAINBOW'){ const grd=g.createLinearGradient(0,0,W,0); const RB=['#F04452','#F0883C','#F2C84B','#2FAE7A','#3182F6','#9B6FC8']; RB.forEach(function(c,i){ grd.addColorStop(i/(RB.length-1), c); }); g.fillStyle=grd; }
        else g.fillStyle=fill||'#ffffff';
        g.fillText(text, pad, H/2+Math.round(H*0.02));
        const url=cv.toDataURL('image/png');
        return '<img class="pxtext'+(opt.cls?' '+opt.cls:'')+'" src="'+url+'" alt="'+escapeHtml(text)+'" style="height:'+dh+'px;width:auto;image-rendering:auto;">';
      }catch(e){ const rb=(fill==='RAINBOW'), cls=[opt.cls, rb?'tier-rainbow':''].filter(Boolean).join(' '); return '<span'+(cls?' class="'+cls+'"':'')+((!rb&&fill)?' style="color:'+fill+'"':'')+'>'+escapeHtml(text)+'</span>'; }   // 폴백: 무지개는 tier-rainbow로(부모 .fx-tier가 color:transparent라 안 보이는 것 방지)
    }
    // 등장 연출 — 등급마다 화려함이 다르게 (CSS .fx-reveal.rank-N/.rev-rb로 계단식 확대):
    //  낮은 등급=작은 오오라+약간의 반짝임, 특별↑=발산 광선 등장, 전설↑=픽셀 링 충격파+컨페티 폭발, 무지개=무지개 프레임·컨페티.
    function fxReveal(){
      if(!_fx) return; const fx=$('catFx'); const t=tierInfo(_fx.res.tier);
      const rank=Math.max(0, TIER_ORDER.indexOf(_fx.res.tier));
      const rb=!!_fx.rainbow;                                             // 무지개(승급 또는 무지개알 구매)
      const ex=_fx.res.tier==='exclusive';                               // 🌈 한정 펫 → 빛·프레임(박스)을 무지개로
      const conf=rb?32:(rank<=0?0:rank<=1?10:rank<=2?16:20+(rank-2)*8);   // 등급↑ 컨페티 더 많이(일반=없음)
      const tw=5+rank*3;                                                  // 트윙클 수(등급↑ 많이)
      const art=isEggKind(_fx.kind)?catFace(_fx.res.id,{h:118,eager:true}):rewardBoxArt(_fx.res);   // eager: 등장 즉시 표시(lazy면 ~1초 늦게 뜸)
      // 🌲 전설·신화·한정 펫 등장 = 픽업 배너 씬 전체를 배경으로(픽업 펫 2마리도 씬에서 배회). 그 외 등급은 기본 연출.
      const sceneBg = isEggKind(_fx.kind) && (_fx.res.tier==='limited' || _fx.res.tier==='exclusive');   // 픽업 씬 배경 = 신화(limited)·한정(exclusive)만(전설 제외)
      const skyLayer = sceneBg ? pickupSceneHtml('reveal') : '';   // 배너 씬(pickupSceneHtml) 재사용 — 배경 + 배회 픽업 펫(알·헤더 없음)
      fx.innerHTML='<div class="fx-scrim"></div>'+skyLayer+'<div class="fx-reveal tier-'+t.id+' rank-'+rank+((rb||ex)?' rev-rb':'')+(sceneBg?' rev-scene':'')+'">'+   // 한정도 rev-rb(무지개 프레임=박스)
        '<div class="fx-art pop">'+
          '<span class="fx-aurawrap">'+lightLayers({aura:210, rays:250, rainbow:ex})+'</span>'+   // 펫 뒤 픽셀 오오라(한정=무지개 빛). 특별↑은 발산 광선까지 CSS로 표시
          '<span class="fx-ring"></span>'+                                            // 전설↑/무지개: 픽셀 링 충격파(CSS)
          '<span class="fx-twinkles">'+fxAuraTwinkles(tw, ex)+'</span>'+                // 펫 둘레 트윙클 도트(한정=무지개)
          '<span class="fx-frame"></span>'+
          '<span class="fx-artimg">'+art+'</span>'+
          (_fx.isNew?newBadgeSvg({h:30}):'')+                                          // 🌈 처음 획득: 무지개 픽셀 "NEW" 배지(펫/아이템 위에서 물결)
        '</div>'+
        '<div class="fx-tier">'+pixelTextHtml(t.name, (t.id==='exclusive'?'RAINBOW':(t.color||'#ffffff')), {h:40, base:13, cls:'fx-pxtier'})+'</div>'+
        '<div class="fx-name">'+pixelTextHtml((isEggKind(_fx.kind)?catName(_fx.res.id):rewardName(_fx.res)), (_fx.res.tier==='exclusive'?'RAINBOW':(t.color||'#ffffff')), {h:30, base:14, cls:'fx-pxname'})+'</div>'+
        '<div class="fx-reward">'+(_fx.gold?'<span class="rw"><span class="ci">'+goldSvg({h:18})+'</span>+1 금화</span>':'')+
          (_fx.dup?'<span class="rw"><span class="ci">'+coinSvg({h:18})+'</span>+'+_fx.refund+' 은화 (중복)</span>':'')+'</div>'+
        '<button class="btn" onclick="closeFx()">확인</button>'+
        '<div class="fx-confetti">'+(conf?fxConfetti(conf):'')+'</div></div>';
      fx.className='fx on reveal';
    }
    function closeFx(){ _fxClear(); const fx=$('catFx'); if(fx){ fx.className='fx'; fx.innerHTML=''; } _fx=null; }

    // ================= 🥚×10 10연차 뽑기 연출 (개발자 미리보기 전용 · 인벤토리 무소모) =================
    // 단일 뽑기(_fx)와 완전 분리된 _fx10 상태로 구동. 타이머는 전부 _fxT/_fxClear 경유. 배경은 pickupSceneHtml('reveal')(캐시) 재사용.
    // 흐름: 둥지 하강 → 탭1 흔들 → 탭2 무지개알/나비+하늘무지개 → 탭3 카메오 툭치기·오픈 → 결과 10장(무작위) → 둥지에 펫 10마리 정면.
    let _fx10=null;
    const TEN_N=10, TEN_COLS=2;
    const TEN_DROP=900, TEN_WALK=1800, TEN_TAP=160, TEN_HIT=180, TEN_STEP=1600;   // 길이감 튜닝 손잡이
    function tenShuffle(n){ const a=Array.from({length:n},(_,i)=>i); for(let i=n-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
    function tenScaleFor(id){ return petActorPx(id, 44, 110); }   // 실제 설정 크기(petScale 비례, 룸/dock·배회와 동일 표기) — 반감 없음
    function tenEggSvg(it, stage){
      if(it.kind==='ddeul') return '<span class="ten-ddeulegg">'+ddeulFxHtml()+'</span>';   // 뜰알: 알뽑기와 동일하게 꽃+몸통 분리(탭 시 꽃 팔랑)
      if(it.rainbow && it._rbShown) return rainbowEggStage(Math.min(stage,2),{h:52});   // h 속성으로 크기 확정(오픈 알과 동일) — width:100%/height:auto 는 WebView서 작게 뭉개짐
      return eggSvg(stage,{h:52}); }
    // 둥지(뒤판+앞테두리) + 알 10개 흩뿌림(TEN_POS, 비겹침) / 피날레 펫. 알·펫 위치 동일(같은 좌표·z).
    function tenNestHtml(items, mode){
      const cells=items.map(function(it){ let inner;
        if(mode==='finale'){ const t=tierInfo(it.tier), ex=it.tier==='exclusive', ph=tenScaleFor(it.id);
          inner='<span class="ten-petaura">'+auraSvg(ex?'RAINBOW':(t.color||'#ffffff'),{h:Math.round(ph*0.95)})+'</span>'+   // 뒤에 등급색 은은한 오오라(펫 크기 비례, 한정=무지개)
            '<span class="ten-bob" style="animation-delay:'+(it.i*0.07).toFixed(2)+'s">'+catFace(it.id,{h:ph,eager:true})+'</span>'; }
        else { inner=tenEggSvg(it, 0); }
        const p=TEN_POS[it.i]||[50,50];   // [left%, top%] — 위→아래(뒤→앞), z=it.i로 앞줄 알이 위로
        return '<div class="ten-egg" id="tenEgg'+it.i+'" data-i="'+it.i+'" style="left:'+p[0]+'%;top:'+p[1]+'%;z-index:'+(it.i+1)+';">'+inner+'</div>'; }).join('');
      if(mode==='finale')   // 피날레: 둥지 없이 펫만(등급색 실루엣 뒤배경). 알 위치와 동일한 흩뿌림 좌표 유지.
        return '<div class="ten-nest finale"><div class="ten-scatter">'+cells+'</div></div>';
      return '<div class="ten-nest">'+
        '<div class="ten-nestback">'+nestSvg({})+'</div>'+
        '<div class="ten-scatter">'+cells+'</div>'+
        '<div class="ten-nestfront">'+nestFrontSvg({})+'</div></div>';
    }
    // 하늘 무지개(탭2 조건 충족 시 스르르) — 픽업 배너 기본 무지개(.pk-rainbow)는 숨기고 전용 요소로 낸다
    function tenSkyRainbow(wrap){ if(!wrap || wrap.querySelector('.ten-skyrb')) return;
      const el=document.createElement('span'); el.className='ten-skyrb'; el.innerHTML=authRainbowSvg({h:74}); wrap.appendChild(el); }
    // 🌿 하단 초원 채우기 — 세로 긴 화면의 빈 초록을 꽃·풀·나무·나비로. pkRand로 결정적 배치.
    function tenMeadowHtml(){
      const lite=liteMode(); const FT=['r','y','p'], BT=['o','b','p','y']; let h='';   // 초록 공백 채우기 — 필드(bottom 0~56%, sky seam 60% 밑) 전반에 촘촘히(꽃·풀·돌·흙)
      // 🌸 꽃 — 필드 전반 + 전경(0~24%, 배회 바닥 아래) 포함
      for(let i=0;i<(lite?12:30);i++){ const l=(3+pkRand(i,11)*94).toFixed(1), b=(1+pkRand(i,12)*55).toFixed(1), s=Math.round(10+pkRand(i,13)*9);
        h+='<span class="ten-md" style="left:'+l+'%;bottom:'+b+'%">'+flowerSvg(FT[i%3],{h:s})+'</span>'; }
      // 🌱 풀(포기) — 더 촘촘히
      for(let i=0;i<(lite?12:28);i++){ const l=(2+pkRand(i,21)*95).toFixed(1), b=(0+pkRand(i,22)*56).toFixed(1), s=Math.round(12+pkRand(i,23)*11);
        h+='<span class="ten-md" style="left:'+l+'%;bottom:'+b+'%">'+tuftSvg({h:s})+'</span>'; }
      // 🌿 전경 프레이밍 — 화면 하단 좌우 큰 풀·꽃(빈 하단 채움)
      if(!lite){ h+='<span class="ten-md" style="left:4%;bottom:1%">'+tuftSvg({h:30})+'</span><span class="ten-md" style="left:96%;bottom:1%">'+flowerSvg('p',{h:26})+'</span>'+
        '<span class="ten-md" style="left:14%;bottom:0%">'+tuftSvg({h:24})+'</span><span class="ten-md" style="left:87%;bottom:0%">'+tuftSvg({h:26})+'</span>'; }
      // 🪨 돌 — 낮게(전경~중경) 흩뿌려 빈땅 채움
      for(let i=0;i<(lite?4:9);i++){ const l=(5+pkRand(i,51)*90).toFixed(1), b=(1+pkRand(i,52)*30).toFixed(1), s=Math.round(9+pkRand(i,53)*7);
        h+='<span class="ten-md" style="left:'+l+'%;bottom:'+b+'%;z-index:0;">'+(pkRand(i,54)<0.35?rockSvg({h:s+4}):stoneSvg({h:s}))+'</span>'; }
      // 🟫 흙 — 군데군데 맨땅 패치(pk-soil 재사용)
      for(let i=0;i<(lite?4:10);i++){ const l=(4+pkRand(i,61)*90).toFixed(1), b=(1+pkRand(i,62)*40).toFixed(1), w=Math.round(12+pkRand(i,63)*18);
        h+='<span class="pk-soil" style="left:'+l+'%;bottom:'+b+'%;width:'+w+'px;transform:translateX(-50%);"></span>'; }
      // 🌳 나무(키 큼) — 윗머리가 하늘(60%) 안 넘게
      for(let i=0;i<4;i++){ const l=(8+i*28+pkRand(i,31)*8).toFixed(1), b=(36+pkRand(i,32)*14).toFixed(1), s=Math.round(30+pkRand(i,33)*14);
        h+='<span class="ten-md ten-md-tr" style="left:'+l+'%;bottom:'+b+'%">'+treeTopSvg({h:s})+'</span>'; }
      // 🦋 나비
      if(!lite) for(let i=0;i<6;i++){ const l=(10+pkRand(i,41)*80).toFixed(1), b=(24+pkRand(i,42)*31).toFixed(1), s=Math.round(11+pkRand(i,43)*4);
        h+='<span class="ten-md ten-md-bf" style="left:'+l+'%;bottom:'+b+'%"><span class="bf-wing">'+butterflySvg(BT[i%4],{h:s})+'</span></span>'; }
      return '<div class="ten-meadow" aria-hidden="true">'+h+'</div>';
    }
    // 피날레 1초 후 — 정지 펫을 로밍 액터로 전환(#pkRevStage → 엔진 activeStages가 자동 배회)
    function tenStartRoam(){ const wrap=$('tenWrap'); if(!wrap || !_fx10 || _fx10.phase!=='finale') return;
      const nest=wrap.querySelector('.ten-nest'); if(nest) nest.classList.add('hatched');   // 둥지 속 정지 펫 페이드아웃(둥지만 남김)
      if(wrap.querySelector('#pkRevStage')) return;
      const st=document.createElement('div'); st.className='cd-room pkstage ten-roam'; st.id='pkRevStage'; st.setAttribute('data-noprops','1'); st.setAttribute('aria-hidden','true');
      Object.keys(_petX).forEach(function(k){ if(k.indexOf('pkRevStage:')===0){ delete _petX[k]; delete _petDepth[k]; delete _petVz[k]; } });   // 이전 배회 잔여 위치 제거 → 매 10연차 새 랜덤 흩뿌림
      const N=_fx10.items.length, order=tenShuffle(N);   // 슬롯 무작위 배정(간격 보장) + 지터 → 서로 간격 둔 랜덤 시작 위치
      st.innerHTML=_fx10.items.map(function(it,i){ const hh=petActorPx(it.id,44,110);
        let f=(order[i]+0.5)/N + (Math.random()-0.5)*(0.7/N); f=Math.max(0.02, Math.min(0.98, f));   // data-spawnf: 폭 대비 시작 프래션(buildActors가 사용)
        return '<div class="cd-actor" data-cat="'+it.id+'" data-hh="'+hh+'" data-spawnf="'+f.toFixed(3)+'"><span class="cd-shadow"></span>'+catActorHTML(it.id,hh)+'</div>'; }).join('');
      wrap.appendChild(st);
      if(typeof markCatDirty==='function') markCatDirty();
    }
    // 알 주변 나비(뜰알 승급) — ddeulPickupFx 나비 루프를 알 셀 기준 소반경으로 스코프
    function tenEggButterflies(eggEl, it){
      const N=liteMode()?3:6, T=['o','b','p','y','o','b']; let b='';
      for(let i=0;i<N;i++){ const ang=((i+Math.random()*0.7)/N)*Math.PI*2, rx=20+Math.random()*16, ry=16+Math.random()*16;
        const mx=Math.round(Math.cos(ang)*rx), my=Math.round(Math.sin(ang)*ry);
        const hh=9+Math.round(Math.random()*3), dur=(5+Math.random()*4).toFixed(1), del=(-Math.random()*6).toFixed(2);
        b+='<span class="fx-ddbfly ten-bfly" style="margin:'+my+'px 0 0 '+mx+'px;--d:'+dur+'s;animation-delay:'+del+'s;'+bflyDriftVars(Math.random)+'"><span class="bf-wing">'+butterflySvg(T[i%T.length],{h:hh})+'</span></span>'; }
      const wrap=document.createElement('span'); wrap.className='ten-bflies'; wrap.innerHTML=b; eggEl.appendChild(wrap);
    }
    // 카메오 펫 선정: 한정=픽업 펫(삵·표범), 그 외 전설↑=전설/신화 스프라이트 랜덤
    function tenCameoPet(it){ if(it.tier==='exclusive'){ const pk=LIMITED_PICKUP.find(pickupExists); if(pk) return pk; }
      const pool=PET_CATALOG.filter(function(c){ const t=CAT_TIER[c.id]; return (t==='legend'||t==='limited') && hasSprite(c.id); }).map(function(c){ return c.id; });
      return pool.length?pool[Math.floor(Math.random()*pool.length)]:it.id; }
    // 카메오 1마리 생성 — fxSpawnCat 클론이되 '그 알'의 가로중심(left%)·바닥(--floor)에 정합
    function tenSpawnCameo(wrap, it, side, id){
      const eggEl=$('tenEgg'+it.i); if(!eggEl||!wrap) return;
      const isPet=!!(id && hasSprite(id));
      const size=isPet?Math.max(90, Math.min(230, Math.round(120*petScale(id)))):150;
      const el=document.createElement('div');
      el.className='fx-cat ten-cat walkin fxc-'+side+(isPet?' fxc-pet':' fxc-gc');
      el.setAttribute('data-i', it.i); el.style.setProperty('--cat', size+'px');
      const wr=wrap.getBoundingClientRect(), er=eggEl.getBoundingClientRect();
      const cx=wr.width?((er.left+er.width/2 - wr.left)/wr.width*100):50;
      el.style.left=Math.max(4,Math.min(96,cx)).toFixed(2)+'%';
      el.style.setProperty('--floor', Math.round(er.bottom - wr.top)+'px');   // 알 바닥의 wrap 기준 절대 Y(offsetParent 불일치 방지)
      const fpKey=isPet?(id+':fxwalk'):'_gc', fpDef=(isPet&&typeof PET_FOOT_PAD!=='undefined')?PET_FOOT_PAD:(typeof GACHACAT_FOOT_DEFAULT!=='undefined'?GACHACAT_FOOT_DEFAULT:0.1);
      el.style.setProperty('--foot', (typeof _footPad!=='undefined'&&_footPad[fpKey]!=null?_footPad[fpKey]:fpDef).toFixed(3));
      if(isPet){ ensurePetArt(id); el.innerHTML='<div class="fxc-in">'+catActorHTML(id, size)+'</div>'; }
      else { el.innerHTML='<div class="fxc-in"></div>'; }
      if(typeof measureFxFoot==='function') measureFxFoot(isPet?id:null, function(fp){ el.style.setProperty('--foot', fp.toFixed(3)); });
      wrap.appendChild(el);
    }
    // 알 오픈(크랙+틈새빛)
    function tenOpenEgg(it){ const el=$('tenEgg'+it.i); if(!el||it._open) return; it._open=true;
      const t=tierInfo(it.tier), ex=it.tier==='exclusive';
      el.classList.add('open'); el.style.color=ex?'':(t.color||'#fff');
      el.innerHTML=(it.kind==='ddeul'?ddeulEggSvg({h:52}):eggCrackSvg(t.color, !!(it.rainbow&&it._rbShown), {h:52}))+
        '<span class="ten-crlight">'+lightLayers({aura:64, rays:82, rainbow:ex})+'</span>';
      el.classList.remove('shake','tremble'); void el.offsetWidth; el.classList.add('hit');
      if(!liteMode()){ const s=document.createElement('span'); s.className='ten-eggfx'; s.innerHTML=fxSparkles(5); el.appendChild(s); }
    }
    // 진입점 — items=[{id,tier,kind,rainbow,dup,refund,isNew}]×10
    function runTenGachaFx(list, opts){ opts=opts||{}; _fxClear(); _fx=null;
      // side = 알의 '실제 화면 위치'(TEN_POS 흩뿌림 x) 기준 좌/우 → 카메오가 가까운 쪽에서 걸어와 알을 지나치지 않게(격자 i%2는 흩뿌림과 안 맞아 반대편서 걸어와 다른 알을 지나쳐 치던 버그).
      const items=(list||[]).slice(0,TEN_N).map(function(it,i){ return Object.assign({ kind:'egg' }, it, { i:i, col:i%TEN_COLS, row:(i/TEN_COLS|0), side:((TEN_POS[i]&&TEN_POS[i][0]<50)?'l':'r') }); });
      _fx10={ items:items, order:tenShuffle(items.length), stage:0, busy:true, phase:'nest', ridx:0, preview:!!opts.preview,
        skyRainbow: items.some(function(x){ return x.tier==='limited'||x.tier==='exclusive'; }) };
      items.forEach(function(x){ if(hasSprite(x.id)) ensurePetArt(x.id); });
      if(typeof prewarmGachaFxPads==='function') prewarmGachaFxPads();
      const fx=$('catFx'); if(!fx) return;
      const rm=reducedMotion();
      fx.innerHTML='<div class="fx-scrim"></div><div class="ten-wrap" id="tenWrap" role="button" tabindex="0" onclick="tenTap()">'+
        pickupSceneHtml('reveal')+tenMeadowHtml()+tenNestHtml(items, 'eggs')+
        '<div class="ten-hint" id="tenHint">'+pixelTextHtml(rm?'탭하여 결과 보기':'둥지를 탭하세요', '#ffffff', {h:16})+'</div></div>';
      fx.className='fx on ten';
      if(rm){ _fx10.busy=false; return; }
      const nest=fx.querySelector('.ten-nest'); if(nest) nest.classList.add('drop');
      _fxT(function(){ _fx10.busy=false; }, TEN_DROP+120);
    }
    function tenTap(){ if(!_fx10||_fx10.busy) return;
      if(_fx10.phase==='reveal'){ tenRevealNext(); return; }
      if(_fx10.phase==='opened'){ tenBeginReveal(); return; }   // 3탭 후 알 빛나는 상태 → 1초 뒤 활성화된 탭으로 결과 진입
      if(_fx10.phase!=='nest') return;
      if(reducedMotion()){ _fx10.busy=true; tenBeginReveal(); return; }
      _fx10.stage++;
      if(_fx10.stage>=3){ _fx10.busy=true; tenClimax(); return; }
      if(_fx10.stage===1) tenTapShake(1);
      else if(_fx10.stage===2) tenTap2();
    }
    function tenTapShake(stage){ const nest=document.querySelector('.ten-nest'); if(nest){ nest.classList.remove('drop','shake'); void nest.offsetWidth; nest.classList.add('shake'); }
      _fx10.items.forEach(function(it){ const el=$('tenEgg'+it.i); if(!el) return;
        if(it.kind==='ddeul'){ const fl=el.querySelector('.fx-ddflower'); if(fl){ fl.classList.remove('flswing'); void fl.offsetWidth; fl.classList.add('flswing'); } }   // 뜰알: 알뽑기처럼 꽃이 팔랑(재렌더 대신 스윙만)
        else { el.innerHTML=tenEggSvg(it, stage); }
        el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); });
      if(stage<2) setTenHint('한 번 더!'); }
    function tenTap2(){ _fx10.items.forEach(function(it){ if(it.kind==='egg' && it.rainbow) it._rbShown=true; });
      tenTapShake(2);
      if(_fx10.skyRainbow) tenSkyRainbow($('tenWrap'));
      _fx10.items.forEach(function(it){ const el=$('tenEgg'+it.i); if(!el) return;
        if(it.kind==='egg' && it.rainbow && !liteMode()){ const s=document.createElement('span'); s.className='ten-eggfx'; s.innerHTML=fxSparkles(6); el.appendChild(s); }
        if(it.kind==='ddeul' && (it.tier==='exclusive' || Math.random()<rbUpgradeChance(it.tier))) tenEggButterflies(el, it); });
      setTenHint('마지막 탭!'); }
    function tenClimax(){ const wrap=$('tenWrap'); if(!wrap) return; setTenHint('');
      // 🌸 뜰알: 알이 빛나기 전에 꽃이 엄청 흔들리는 연출(단일 뜰알 climax와 동일 — 알 톡톡 떨림 + 꽃 큰 스윙). 각 알이 열릴 때 tenOpenEgg가 해제.
      _fx10.items.forEach(function(it){ if(it.kind==='ddeul'){ const el=$('tenEgg'+it.i); if(el){ el.classList.remove('shake'); void el.offsetWidth; el.classList.add('tremble'); } } });
      const legend=tierRank('legend'), lanes={ l:[], r:[] };
      _fx10.items.forEach(function(it){ if(tierRank(it.tier)>=legend) lanes[it.side].push(it); });
      let maxEnd=0;
      ['l','r'].forEach(function(side){ lanes[side].forEach(function(it, k){ const base=k*TEN_STEP, id=tenCameoPet(it);
        _fxT(function(){ tenSpawnCameo(wrap, it, side, id); }, base);
        _fxT(function(){ const el=wrap.querySelector('.ten-cat[data-i="'+it.i+'"]'); if(el){ el.classList.remove('walkin'); el.classList.add('arr','tap'); } }, base+TEN_WALK);
        _fxT(function(){ tenOpenEgg(it); }, base+TEN_WALK+TEN_TAP);
        _fxT(function(){ const el=wrap.querySelector('.ten-cat[data-i="'+it.i+'"]'); if(el){ el.classList.remove('tap'); el.classList.add('leave'); } }, base+TEN_WALK+TEN_TAP+TEN_HIT);
        _fxT(function(){ const el=wrap.querySelector('.ten-cat[data-i="'+it.i+'"]'); if(el) el.remove(); }, base+TEN_WALK+TEN_TAP+TEN_HIT+900);
        maxEnd=Math.max(maxEnd, base+TEN_WALK+TEN_TAP+TEN_HIT+900); }); });
      const openAt=Math.max(600, maxEnd?maxEnd-700:600);
      _fxT(function(){ _fx10.items.forEach(function(it){ if(tierRank(it.tier)<legend) tenOpenEgg(it); }); }, openAt);
      const doneAt=Math.max(maxEnd, openAt)+300;
      _fxT(function(){ _fx10.phase='opened'; }, doneAt);   // 알 빛나는 상태 유지
      _fxT(function(){ _fx10.busy=false; setTenHint('탭하여 결과 보기'); }, doneAt+1000);   // 1초 후 탭 활성 → 한 번 더 탭해야 결과로
    }
    function tenBeginReveal(){ _fx10.phase='reveal'; _fx10.ridx=0; _fx10.busy=false; tenShowCard(0); }
    function tenRevealNext(){ if(_fx10.busy) return; _fx10.ridx++;
      if(_fx10.ridx>=_fx10.items.length){ tenFinale(); return; } tenShowCard(_fx10.ridx); }
    // ⏭️ SKIP — 신화(limited)·한정(exclusive) 이외 등급 카드는 한 번에 건너뛰고 다음 신화/한정에서 멈춤(없으면 피날레로).
    function tenSkip(){ if(!_fx10 || _fx10.phase!=='reveal') return; const order=_fx10.order, items=_fx10.items;
      let next=_fx10.ridx+1;
      while(next<items.length){ const it=items[order[next]]; if(it && (it.tier==='limited'||it.tier==='exclusive'||it.isNew)) break; next++; }   // 신화·한정 + 🆕 처음 얻는 펫/아이템은 스킵 안 함(멈춰서 보여줌)
      if(next>=items.length){ tenFinale(); return; }
      _fx10.ridx=next; _fx10.busy=false; tenShowCard(next); }
    // 10연차 힌트(둥지 위) — 결과 텍스트와 동일한 픽셀(선명) 렌더로 표시. 빈 문자열이면 지움.
    function setTenHint(txt){ const h=$('tenHint'); if(!h) return; h.innerHTML = txt ? pixelTextHtml(txt, '#ffffff', {h:16}) : ''; }
    function tenShowCard(n){ const it=_fx10.items[_fx10.order[n]]; const fx=$('catFx'); if(!fx) return;
      // 배경(픽업 씬)은 '최초 진입에서 한 번만' 만들고, 이후 카드 전환은 카드 홀더만 교체한다.
      // (매 카드마다 fx.innerHTML을 통째로 다시 만들면 씬이 안 칠해진 한 프레임 동안 반투명 스크림 뒤로 메인화면이 비쳐 '깜빡임'이 생겼다.)
      let holder=fx.querySelector('.ten-cardholder');
      if(!holder){
        fx.innerHTML='<div class="fx-scrim"></div>'+pickupSceneHtml('reveal')+'<div class="ten-cardholder"></div>';
        fx.className='fx on reveal ten-reveal';
        holder=fx.querySelector('.ten-cardholder');
      }
      holder.innerHTML=tenRevealCardHtml(it, n+1, _fx10.items.length); }
    function tenRevealCardHtml(it, n, total){ const t=tierInfo(it.tier), rank=tierRank(it.tier), ex=it.tier==='exclusive', rb=!!it.rainbow;
      const conf=rb?28:(rank<=0?0:rank<=2?12:20+(rank-2)*8), tw=5+rank*3;
      return '<div class="fx-reveal ten-card rev-scene tier-'+t.id+' rank-'+rank+((rb||ex)?' rev-rb':'')+'" onclick="tenRevealNext()">'+
        '<button class="ten-skip" onclick="event.stopPropagation();tenSkip()" aria-label="건너뛰기(신화·한정·처음 얻는 펫 제외 한 번에)">'+pixelTextHtml('SKIP', '#ffffff', {h:16})+'</button>'+
        '<div class="ten-count">'+pixelTextHtml(n+' / '+total, '#ffffff', {h:15})+'</div>'+
        '<div class="fx-art pop"><span class="fx-aurawrap">'+lightLayers({aura:210, rays:250, rainbow:ex})+'</span>'+
          '<span class="fx-ring"></span><span class="fx-twinkles">'+fxAuraTwinkles(tw, ex)+'</span><span class="fx-frame"></span>'+
          '<span class="fx-artimg">'+catFace(it.id,{h:118,eager:true})+'</span>'+(it.isNew?newBadgeSvg({h:28}):'')+'</div>'+
        '<div class="fx-tier">'+pixelTextHtml(t.name, (ex?'RAINBOW':(t.color||'#ffffff')), {h:38, base:11})+'</div>'+
        '<div class="fx-name">'+pixelTextHtml(catName(it.id), (ex?'RAINBOW':(t.color||'#ffffff')), {h:28, base:12})+'</div>'+
        '<div class="fx-reward">'+(it.dup?'<span class="rw"><span class="ci">'+coinSvg({h:18})+'</span>'+pixelTextHtml('+'+it.refund+' 은화 (중복)', '#ffffff', {h:16})+'</span>':'')+'</div>'+
        '<div class="ten-nexthint">'+pixelTextHtml(n<total?'탭하여 다음 ('+n+'/'+total+')':'탭하여 마무리', '#ffffff', {h:15})+'</div>'+
        '<div class="fx-confetti">'+(conf?fxConfetti(conf):'')+'</div></div>'; }
    function tenFinale(){ _fx10.phase='finale'; _fx10.busy=false; _fx10._roaming=false; const fx=$('catFx'); if(!fx) return;
      const rm=reducedMotion();
      fx.innerHTML='<div class="fx-scrim"></div><div class="ten-wrap ten-final" id="tenWrap" onclick="tenFinaleTap()">'+
        pickupSceneHtml('reveal')+tenMeadowHtml()+tenNestHtml(_fx10.items, 'finale')+
        '<div class="ten-fintitle">'+pixelTextHtml('10연차 완료!', '#ffffff', {h:28, base:12})+'</div>'+
        '<div class="ten-hint" id="tenHint">'+(rm?'':pixelTextHtml('탭해주세요', '#ffffff', {h:16}))+'</div>'+   // 탭 전까지 펫 정지 유지, 탭하면 배회 시작(자동 1초 배회 제거)
        '<button class="btn ten-takebtn'+(rm?'':' pending')+'" onclick="event.stopPropagation();closeTenFx()" aria-label="입양하기">'+pixelTextHtml('입양하기', '#ffffff', {h:22})+'</button></div>';   // 버튼은 탭해 펫이 배회 시작할 때 나타남(pending→해제)
      fx.className='fx on reveal ten-finale';
      if(_fx10.skyRainbow) tenSkyRainbow($('tenWrap'));
    }
    // 피날레에서 화면을 탭하면 그때 펫들이 배회 시작(그 전까지는 정지 유지). 1회만.
    function tenFinaleTap(){ if(!_fx10 || _fx10.phase!=='finale' || _fx10._roaming) return; _fx10._roaming=true; setTenHint(''); const rm=reducedMotion(); if(!rm) tenStartRoam();
      const b=document.querySelector('.ten-takebtn'); if(b) _fxT(function(){ b.classList.remove('pending'); }, rm?0:520); }   // 펫이 배회 시작한 뒤(≈0.5s) 입양하기 버튼 페이드인
    function closeTenFx(){ _fxClear(); const fx=$('catFx'); if(fx){ fx.className='fx'; fx.innerHTML=''; } _fx10=null; if(typeof markCatDirty==='function') markCatDirty(); }   // 로밍 무대(#pkRevStage) 제거 → 엔진 그룹 정리
    // 개발자 미리보기: 시나리오별 강제 결과 10개 → 연출만 재생(인벤토리 무소모)
    function devPreview10(scenario, kind){ if(!isDev()) return; kind=kind||'egg';
      const map=gachaCatTierMap(), fullMap=effCatTier();
      function rollOne(){ const r=(kind==='ddeul')?rollFromPool(fullMap, DDEUL_TIERS):rollFromPool(map); return r||{ id:(Object.keys(fullMap)[0]||'cat_mackerel'), tier:'normal' }; }
      function memberOf(tier){ if(tier==='exclusive'){ const pk=LIMITED_PICKUP.find(pickupExists); if(pk) return pk; } const r=pickTierMember(fullMap, tier); return r?r.id:(Object.keys(fullMap)[0]||'cat_mackerel'); }
      let raw=[];
      if(scenario==='legendUp'){ const tiers=(kind==='ddeul')?['legend','limited','exclusive']:['legend','limited']; for(let i=0;i<10;i++){ const t=tiers[Math.floor(Math.random()*tiers.length)]; raw.push({ id:memberOf(t), tier:t }); } }
      else { for(let i=0;i<10;i++) raw.push(rollOne());
        if(scenario==='oneLimited') raw[Math.floor(Math.random()*10)]={ id:memberOf('limited'), tier:'limited' };
        else if(scenario==='oneExclusive') raw[Math.floor(Math.random()*10)]={ id:memberOf('exclusive'), tier:'exclusive' }; }
      const list=raw.map(function(r){ const dup=ownsCat(r.id);
        return { id:r.id, tier:r.tier, kind:kind, rainbow:(kind==='egg' && Math.random()<rbUpgradeChance(r.tier)), dup:dup, refund:dup?petDupRefund(r.id):0, isNew:!dup }; });
      closeSheet(); _fx=null; runTenGachaFx(list, { preview:true });
    }

    // ================= 개발자 패널: 재화관리(연출/다마고치 테스트 · 재화 지급) =================
    function openDevGacha(){
      if(!isDev()) return;
      let h='<div class="note"><span class="pill">이 기기만</span> 개발자 전용 · 이 설정(연출/다마고치 테스트)은 <b>이 기기(브라우저)에만</b> 적용됩니다(재화 지급은 내 계정에 반영).</div>';
      h+='<div class="sec-title">연출 테스트(무료)</div>';
      // 한정(exclusive)은 기본 펫알/박스엔 없고 '뜰알'에서만 나옴 → 펫알·박스 행에선 제외하고, 아래 뜰알 행에서 한정 연출을 미리본다.
      const previewTiers=TIERS.filter(t=>t.id!=='exclusive');
      h+='<div class="tx-sub" style="margin:0 2px 6px;">펫알</div><div class="chip-row">'+previewTiers.map(t=>'<button class="chip" onclick="devPreview(\'egg\',\''+t.id+'\')"><b class="tier-'+t.id+'">'+t.name+'</b></button>').join('')+'</div>';
      h+='<div class="tx-sub" style="margin:8px 2px 6px;">랜덤박스</div><div class="chip-row">'+previewTiers.map(t=>'<button class="chip" onclick="devPreview(\'box\',\''+t.id+'\')"><b class="tier-'+t.id+'">'+t.name+'</b></button>').join('')+'</div>';
      // 🌱 뜰알(한정 픽업) — 뜰알 기준 연출 미리보기. 한정은 뜰알에서만 나오므로 '한정' 연출은 여기서 확인(뜰+하늘+무지개, 픽업 펫=삵·표범).
      h+='<div class="tx-sub" style="margin:8px 2px 6px;">🌱 뜰알(한정 픽업)</div><div class="chip-row">'+TIERS.map(t=>'<button class="chip" onclick="devPreview(\'ddeul\',\''+t.id+'\')"><b class="tier-'+t.id+'">'+t.name+'</b></button>').join('')+'</div>';
      // 🥚×10 10연차 연출 확인(개발자 미리보기 전용) — 시나리오별 강제 결과로 연출만 재생. 한정(exclusive)은 뜰알에서만.
      h+='<div class="tx-sub" style="margin:12px 2px 6px;">🥚×10 10연차(펫알)</div><div class="chip-row">'+
        '<button class="chip" onclick="devPreview10(\'random\',\'egg\')">랜덤</button>'+
        '<button class="chip" onclick="devPreview10(\'legendUp\',\'egg\')">전부 전설↑</button>'+
        '<button class="chip" onclick="devPreview10(\'oneLimited\',\'egg\')">신화 1개</button></div>';
      h+='<div class="tx-sub" style="margin:8px 2px 6px;">🌱×10 10연차(뜰알)</div><div class="chip-row">'+
        '<button class="chip" onclick="devPreview10(\'random\',\'ddeul\')">랜덤</button>'+
        '<button class="chip" onclick="devPreview10(\'legendUp\',\'ddeul\')">전부 전설↑</button>'+
        '<button class="chip" onclick="devPreview10(\'oneLimited\',\'ddeul\')">신화 1개</button>'+
        '<button class="chip" onclick="devPreview10(\'oneExclusive\',\'ddeul\')">한정 포함</button></div>';
      h+='<div class="sec-title" style="margin-top:18px;">다마고치 테스트(즉시)</div>';
      h+='<div class="note" style="margin-bottom:8px;">3시간을 기다리지 않고 급여·배변·수거를 바로 확인. 순서: <b>사료·물 +10</b> → 홈에서 그릇 채우기(또는 <b>그릇 다 채우기</b>) → <b>그릇 만료→똥</b> → 똥 탭/일괄 돌보기.</div>';
      h+='<div class="chip-row"><button class="chip" onclick="devGiveConsum()">사료·물 +10</button><button class="chip" onclick="devFillAll()">그릇 다 채우기</button><button class="chip" onclick="devExpireBowls()">그릇 만료→똥</button><button class="chip" onclick="devAddPoop()">똥 +3</button></div>';
      // 재화 추가(지급) — 은화·금화·펫알·랜덤박스·무지개알·무지개박스를 입력 수량만큼 내 계정에 지급
      h+='<div class="sec-title" style="margin-top:18px;">재화 추가(지급)</div>';
      h+='<div class="note" style="margin-bottom:8px;">입력한 수량만큼 <b>내 계정</b>에 지급해요(비우면 건너뜀, 음수면 차감·0 미만은 안 됨).</div>';
      { const cur6=[['coins','은화',coinSvg({h:18})],['gold','금화',goldSvg({h:18})],['egg','펫알',eggSvg(0,{h:18})],['box','랜덤박스',boxSvg({h:18})],['rainbow_egg','무지개알',rainbowEggSvg({h:18})],['rainbow_box','무지개박스',rainbowBoxSvg({h:18})],['ddeul','뜰알',ddeulEggSvg({h:18})]];
        h+=cur6.map(function(c){ return '<div class="row" style="padding:5px 2px;align-items:center;"><span style="display:flex;align-items:center;gap:8px;min-width:0;"><span style="display:inline-flex;flex:none;">'+c[2]+'</span>'+c[1]+'</span><input class="input" style="width:120px;text-align:right;" inputmode="numeric" id="dv_'+c[0]+'" placeholder="0"></div>'; }).join(''); }
      h+='<button class="btn" style="margin-top:12px;" onclick="devGrantCurrency()">지급</button>';
      openSheet('개발자 · 재화관리', h);
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
      const map = isEggKind(kind)? effCatTier() : effItemTier();   // 뜰알(ddeul)도 펫알과 동일하게 펫 등급 맵 사용
      let id = Object.keys(map).find(k=>map[k]===tierId);
      if(kind==='ddeul' && tierId==='exclusive'){ const pk=(typeof LIMITED_PICKUP!=='undefined') && LIMITED_PICKUP.find(pickupExists); if(pk) id=pk; }   // 한정 = 픽업 펫(삵·표범)으로 연출
      if(!id) id = isEggKind(kind) ? (Object.keys(map)[0]||'cat_mackerel') : (Object.keys(map)[0]||'cushion');
      closeSheet(); _fx=null; runGachaFx(kind, { id, tier:tierId }, false, 0, false, true);   // 미리보기는 NEW 배지도 함께 표시
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
      const c=rd('coins'), gd=rd('gold'), eg=rd('egg'), bx=rd('box'), re=rd('rainbow_egg'), rb=rd('rainbow_box'), dd=rd('ddeul');
      if(!(c||gd||eg||bx||re||rb||dd)){ toast('수량을 입력하세요', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if(c)  g.coins=clampCoins((g.coins||0)+c);
        if(gd) g.gold=clampGold((g.gold||0)+gd);
        if(eg) g.consum.egg=clampConsum((g.consum.egg||0)+eg);
        if(bx) g.consum.box=clampConsum((g.consum.box||0)+bx);
        if(re) g.consum.rainbow_egg=clampConsum((g.consum.rainbow_egg||0)+re);
        if(rb) g.consum.rainbow_box=clampConsum((g.consum.rainbow_box||0)+rb);
        if(dd) g.consum.ddeul=clampConsum((g.consum.ddeul||0)+dd);
        return g; }).then(r=>{ if(r&&r.committed){ toast('재화 지급 완료 🎁'); if(state._sheetRefresh) state._sheetRefresh(); } });
    }
