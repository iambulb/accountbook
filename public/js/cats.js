    // 카탈로그(코드 상수) — 저장은 보유 id만. id는 종·색 구분(예: cat_calico, dog_corgi), species는 분류/필터용.
    // 새 동물(네발 짐승) 처리 규칙은 docs/pet-asset-pipeline.md 참고.
    // 가격(은화)은 등급·확률에 맞춰 재산정 — 등급이 오를수록 대략 2배씩(TIER_PRICE 참고).
    // 알(펫알) 100은화로 열면 금화+1·중복은 그 펫 가격의 10% 환급(DUP_REFUND_RATE)이라, 흔한 등급은 알보다 싸게·희귀는 알보다 비싸게 잡아
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
      { id:'bowl', cat:'care',    name:'밥그릇', price:20, size:0.45, footW:1, footH:1, desc:'홈에서 탭해 사료를 채워요(6시간 뒤 비워짐).' },
      { id:'waterbowl', cat:'care', name:'물그릇', price:20, size:0.45, footW:1, footH:1, desc:'홈에서 탭해 물을 채워요(6시간 뒤 비워짐).' },
      { id:'tower', cat:'rest',   name:'캣타워', price:35, size:2,    footW:1, footH:2, desc:'3층 발판 — 한 층에 올라가 쉬어요.' },
      { id:'scratcher', cat:'play', name:'스크래처', price:18, size:2, footW:1, footH:1, desc:'옆에서 잠시 머물며 발톱을 갈아요.' },
      { id:'litterbox', cat:'care', name:'배변패드', price:25, size:1, footW:1, footH:1, desc:'비운 그릇 수만큼 똥이 쌓여요. 탭해 치우면 은화!' },
      { id:'pethouse', cat:'rest', name:'펫하우스', price:45, size:2, footW:1, footH:1, desc:'펫이 안에 들어가 정면을 보며 아늑하게 쉬어요.' },   // 점유칸 1×1(캠 렌더 크기 ROOM_H는 그대로 유지 — 좁은 칸에 큰 집)
      { id:'catwheel', cat:'play', name:'캣휠', price:60, size:2, footW:2, footH:2, desc:'고양이가 안에서 달리며 운동하는 러닝휠.' },
      // 🏃 액티브 플레이 10종(2026-07) — 질주(run)·클립·관람 상호작용. 등급은 ITEM_TIER(특별↑=랜덤박스 전용 자동)
      { id:'treadmill', cat:'play', name:'러닝 트레드밀', size:2, footW:2, footH:2, desc:'벨트 위에서 신나게 달리는 운동 머신. 깃털이 앞에서 달랑거려요.' },
      { id:'laserbot', cat:'play', name:'레이저 룸바', size:1.3, footW:1, footH:1, desc:'레이저 점을 쏘며 돌아다니는 로봇. 펫이 신나게 쫓아 달려요.' },
      { id:'rcmouse', cat:'play', name:'RC 쥐', size:1.2, footW:2, footH:1, desc:'리모컨 쥐가 쌩쌩 달아나요. 펫이 전력 질주로 추격!' },
      { id:'slalom', cat:'play', name:'어질리티 슬라럼', size:1.8, footW:2, footH:1, desc:'깃발 사이를 질주하는 어질리티 코스.' },
      { id:'sprinttrack', cat:'play', name:'스프린트 트랙', size:2.4, footW:3, footH:1, floor:true, desc:'바닥에 깔린 질주 트랙. 위에 가구를 올릴 수 있고 펫이 전력 질주해요.' },
      { id:'cucumber', cat:'play', name:'오이 인형', size:0.9, footW:1, footH:1, desc:'슬며시 놓인 오이…?! 펫이 화들짝 하악질해요.' },
      { id:'milkbar', cat:'care', name:'우유 바', size:1.4, footW:1, footH:1, desc:'따뜻한 우유가 나오는 스탠드. 김이 모락모락, 홀짝홀짝.' },
      { id:'dispenser', cat:'care', name:'간식 디스펜서', size:1.6, footW:1, footH:2, desc:'간식이 또르르 떨어져요. 오독오독 받아먹는 재미.' },
      { id:'birdfeeder', cat:'play', name:'버드 피더', size:1.8, footW:1, footH:2, desc:'새들이 날아드는 모이대. 펫이 넋 놓고 구경해요.' },
      { id:'hamstercage', cat:'play', name:'햄스터 케이지', size:1.4, footW:1, footH:1, desc:'쳇바퀴 도는 햄스터 친구. 호기심 가득 구경해요.' },
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
      { id:'tapestry', cat:'decor', name:'태피스트리', price:800, size:1.4, footW:1, footH:1, wall:true, desc:'봉에 매다는 무늬 벽걸이 천.' },
      { id:'cactus', cat:'decor', name:'선인장', size:1.2, footW:1, footH:1, desc:'화분에 심은 꽃 핀 선인장.' },
      { id:'yarnbasket', cat:'play', name:'털실바구니', size:1.0, footW:1, footH:1, desc:'옆에서 앉아 털실을 톡톡 굴려요.' },
      { id:'floorlamp', cat:'decor', name:'플로어램프', size:1.6, footW:1, footH:1, desc:'은은한 불빛이 일렁이는 플로어 스탠드.' },
      { id:'beanbag', cat:'rest', name:'빈백소파', size:1.2, footW:1, footH:1, desc:'폭신한 빈백. 펫이 위에 올라가 파묻혀 쉬어요.' },
      { id:'groomstation', cat:'care', name:'그루밍대', size:1.3, footW:1, footH:1, desc:'옆에서 몸을 비벼 털을 빗어요.' },
      { id:'springtoy', cat:'play', name:'스프링장난감', size:1.1, footW:1, footH:1, desc:'통통 흔들리는 스프링 공을 톡톡 쳐요.' },
      { id:'tunnel', cat:'play', name:'놀이터널', size:1.6, footW:2, footH:1, desc:'안으로 들어가 숨어서 쉬어요.' },
      { id:'teepee', cat:'rest', name:'티피텐트', size:1.6, footW:1, footH:1, desc:'텐트 안에 들어가 정면을 보며 아늑하게 쉬어요.' },
      { id:'bookshelf', cat:'decor', name:'책장', size:1.8, footW:1, footH:2, desc:'알록달록 책이 꽂힌 책장.' },
      { id:'birdcage', cat:'decor', name:'새장', size:1.4, footW:1, footH:1, desc:'작은 새가 사는 스탠드형 새장.' },
      { id:'lavalamp', cat:'decor', name:'라바램프', size:1.4, footW:1, footH:1, desc:'몽글몽글 방울이 오르내리는 라바램프.' },
      { id:'laserpost', cat:'play', name:'레이저타워', size:1.2, footW:1, footH:1, desc:'깜빡이는 레이저 점을 쫓아다녀요.' },
      { id:'waterfountain', cat:'care', name:'자동급수기', size:1.0, footW:1, footH:1, desc:'졸졸 흐르는 물을 마셔요.' },
      { id:'sofa', cat:'rest', name:'소파', size:2.0, footW:2, footH:1, desc:'포근한 2인 소파. 펫이 위에 올라가 길게 누워요.' },
      { id:'recordplayer', cat:'decor', name:'턴테이블', size:1.0, footW:1, footH:1, desc:'레코드가 놓인 빈티지 턴테이블.' },
      { id:'terrarium', cat:'decor', name:'테라리움', size:1.2, footW:1, footH:1, desc:'유리 상자 속 미니 정원.' },
      { id:'ballpit', cat:'play', name:'볼풀', size:2.0, footW:2, footH:2, desc:'알록달록 공이 가득한 볼풀에서 놀아요.' },
      { id:'grandfaclock', cat:'decor', name:'괘종시계', size:1.8, footW:1, footH:2, desc:'추가 좌우로 흔들리는 큰 괘종시계.' },
      { id:'bunkbed', cat:'rest', name:'캣벙크베드', size:1.8, footW:1, footH:2, desc:'2층 캣 침대. 한 칸에 올라가 길게 누워요.' },
      { id:'crystalfountain', cat:'decor', name:'크리스탈분수', size:2.0, footW:2, footH:2, desc:'물이 솟는 크리스탈 분수 — 방의 중심.' },
      { id:'dartboard', cat:'decor', name:'다트판', size:1.2, footW:1, footH:1,wall:true, desc:'벽에 거는 다트판.' },
      { id:'cuckooclock', cat:'decor', name:'뻐꾸기시계', size:1.2, footW:1, footH:1,wall:true, desc:'벽에 거는 뻐꾸기시계. 추가 흔들려요.' },
      { id:'roundbed', cat:'rest', name:'원형베드', size:1.2, footW:1, footH:1, desc:'폭신한 원형 베드에 파묻혀 쉬어요.' },
      { id:'donutbed', cat:'rest', name:'도넛베드', size:1.2, footW:1, footH:1, desc:'도넛 모양 베드 안에 동그랗게 말고 자요.' },
      { id:'cavebed', cat:'rest', name:'동굴하우스', size:1.6, footW:1, footH:1, desc:'동굴 같은 아늑한 집에 들어가 정면을 보며 쉬어요.' },
      { id:'canopybed', cat:'rest', name:'캐노피침대', size:1.8, footW:1, footH:2, desc:'화려한 캐노피 침대에서 우아하게 누워요.' },
      { id:'throne', cat:'rest', name:'고양이왕좌', size:1.6, footW:1, footH:1, desc:'황금 왕좌에 앉아 위엄있게 쉬어요.' },
      { id:'mousetoy', cat:'play', name:'쥐돌이', size:0.9, footW:1, footH:1, desc:'옆에서 쥐 장난감을 톡톡 굴려요.' },
      { id:'catnippillow', cat:'play', name:'캣닢쿠션', size:1.0, footW:1, footH:1, desc:'캣닢 쿠션에 얼굴을 부비며 뒹굴어요.' },
      { id:'puzzlefeeder', cat:'play', name:'퍼즐급식기', size:1.0, footW:1, footH:1, desc:'구멍에서 간식을 꺼내려 앞발로 톡톡 건드려요.' },
      { id:'balltrack', cat:'play', name:'볼트랙', size:1.8, footW:2, footH:1, desc:'트랙 안 공을 앞발로 빙글빙글 굴려요.' },
      { id:'teetertoy', cat:'play', name:'시소장난감', size:1.1, footW:1, footH:1, desc:'시소 양끝 공을 번갈아 톡톡 눌러요.' },
      { id:'bubblemachine', cat:'play', name:'버블머신', size:1.2, footW:1, footH:1, desc:'비눗방울이 뽀글뽀글 올라와요.' },
      { id:'bonsai', cat:'decor', name:'분재', size:1.2, footW:1, footH:1, desc:'정갈한 분재. 잎이 살랑여요.' },
      { id:'globe', cat:'decor', name:'지구본', size:1.2, footW:1, footH:1, desc:'빙글 도는 앤티크 지구본.' },
      { id:'snowglobe', cat:'decor', name:'스노우볼', size:1.2, footW:1, footH:1, desc:'눈이 내리는 스노우볼.' },
      { id:'campfire', cat:'decor', name:'모닥불', size:1.2, footW:1, footH:1, desc:'장작이 타닥타닥 타오르는 모닥불.' },
      { id:'gramophone', cat:'decor', name:'축음기', size:1.2, footW:1, footH:1, desc:'빙글 도는 레코드의 빈티지 축음기.' },
      { id:'arcademachine', cat:'decor', name:'아케이드기', size:1.8, footW:1, footH:2, desc:'화면이 번쩍이는 레트로 오락기.' },
      { id:'jukebox', cat:'decor', name:'주크박스', size:1.3, footW:1, footH:1, desc:'알록달록 불빛이 깜빡이는 주크박스.' },
      { id:'crystalcluster', cat:'decor', name:'크리스탈군집', size:1.4, footW:1, footH:1, desc:'영롱하게 반짝이는 보석 크리스탈.' },
      { id:'easel', cat:'decor', name:'이젤그림', size:1.4, footW:1, footH:1, desc:'풍경화가 걸린 화가의 이젤.' },
      { id:'floorvase', cat:'decor', name:'바닥화병', size:1.3, footW:1, footH:1, desc:'꽃을 꽂은 커다란 바닥 화병.' },
      { id:'suitofarmor', cat:'decor', name:'미니갑옷', size:1.6, footW:1, footH:1, desc:'번쩍이는 미니 기사 갑옷 장식.' },
      { id:'hourglass', cat:'decor', name:'모래시계', size:1.2, footW:1, footH:1, desc:'모래가 스르르 떨어지는 모래시계.' },
      { id:'telescope', cat:'decor', name:'망원경', size:1.4, footW:1, footH:1, desc:'별을 보는 놋쇠 망원경.' },
      { id:'gumballmachine', cat:'decor', name:'검볼머신', size:1.3, footW:1, footH:1, desc:'알록달록 껌볼이 가득한 자판기.' },
      { id:'wallvines', cat:'decor', name:'벽넝쿨', size:1.3, footW:1, footH:1,wall:true, desc:'벽을 타고 내려오는 넝쿨.' },
      { id:'pennant', cat:'decor', name:'페넌트', size:1.3, footW:2, footH:1,wall:true, desc:'벽에 거는 삼각 깃발 줄.' },
      { id:'wallmask', cat:'decor', name:'가면장식', size:1.2, footW:1, footH:1,wall:true, desc:'벽에 거는 이국적인 가면.' },
      { id:'barometer', cat:'decor', name:'기압계', size:1.2, footW:1, footH:1,wall:true, desc:'벽에 거는 앤티크 기압계.' },
      { id:'stringlights', cat:'decor', name:'전구커튼', size:1.4, footW:3, footH:1,wall:true, desc:'천장에서 늘어뜨린 전구 커튼. 반짝여요.' },
      { id:'wallbutterfly', cat:'decor', name:'나비표본', size:1.2, footW:1, footH:1,wall:true, desc:'벽에 거는 나비 표본 액자.' },
      { id:'cornershelf', cat:'decor', name:'2단선반', size:1.4, footW:2, footH:1,wall:true, desc:'소품 올린 2단 벽 선반.' },
      { id:'wallsun', cat:'decor', name:'해장식', size:1.2, footW:1, footH:1,wall:true, desc:'벽에 거는 금빛 태양 장식.' },
      { id:'treatjar', cat:'care', name:'간식단지', size:1.1, footW:1, footH:1, desc:'생선 간식이 가득한 유리 단지.' },
      { id:'catgrass', cat:'care', name:'캣그라스', size:1.3, footW:1, footH:1, desc:'고양이가 뜯어먹는 싱그러운 캣그라스.' },
      { id:'groomarch', cat:'care', name:'그루밍아치', size:1.4, footW:1, footH:1, desc:'고양이가 지나며 몸을 비비는 셀프 그루밍 아치.' },
      { id:'heatpad', cat:'care', name:'온열패드', size:1.4, footW:2, footH:1, desc:'따뜻하게 데워지는 온열 방석.' },
      { id:'peekbox', cat:'play', name:'구멍상자', size:1.4, footW:2, footH:1, desc:'구멍으로 앞발을 쏙 넣는 놀이 상자.' },
      { id:'tetherpole', cat:'play', name:'테더볼기둥', size:1.4, footW:1, footH:1, desc:'줄에 매달린 공을 툭툭 치는 기둥.' },
      { id:'windmilltoy', cat:'play', name:'바람개비', size:1.3, footW:1, footH:1, desc:'빙글빙글 도는 알록달록 바람개비.' },
      { id:'crinklebag', cat:'play', name:'바스락봉투', size:1.3, footW:1, footH:1, desc:'들어가면 바스락거리는 종이봉투.' },
      { id:'roundrug', cat:'decor', name:'원형러그', size:1.4, footW:2, footH:2,floor:true, desc:'둥근 패턴의 포근한 러그.' },
      { id:'runner', cat:'decor', name:'러너카펫', size:1.4, footW:2, footH:1,floor:true, desc:'길게 깔린 패턴 러너 카펫.' },
      { id:'koipond', cat:'decor', name:'잉어연못', size:1.5, footW:2, footH:2,floor:true, desc:'잉어와 수련꽃이 노니는 연못.' },
      { id:'displaycase', cat:'decor', name:'유리진열장', size:1.6, footW:2, footH:1, desc:'소품을 모아둔 유리 진열장.' },
      { id:'woodstove', cat:'decor', name:'장작난로', size:1.4, footW:1, footH:1, desc:'장작이 타오르는 무쇠 난로.' },
      { id:'mushroomlamp', cat:'decor', name:'버섯램프', size:1.3, footW:1, footH:1, desc:'은은하게 빛나는 버섯 모양 램프.' },
      { id:'statuecat', cat:'decor', name:'고양이석상', size:1.3, footW:1, footH:1, desc:'기품 있는 고양이 석상.' },
      { id:'teacart', cat:'decor', name:'티카트', size:1.4, footW:1, footH:1, desc:'찻주전자와 잔을 실은 다과 카트.' },
      { id:'crystaltree', cat:'decor', name:'보석나무', size:1.5, footW:1, footH:1, desc:'보석 잎이 영롱하게 빛나는 나무.' },
    ];
    // 소비 아이템(배치 불가) — 알뜰샵 "소비" 탭에서 구매. effect로 효과를 데이터 주도로 분기.
    //   effect.fill=그릇 채움(target food/water, ms=지속). effect.affection=애정 상승(펫 선택 사용). effect.boost=수확 수익배율(ms=지속).
    //   cur='gold'면 금화 구매. dailyBuy=하루 구매 상한(간식). 채움계열 소비템은 pickFill 선호(수확 자동채움 선택)에 따라 소모.
    const CONSUM_CATALOG = [
      { id:'food',       name:'사료',   price:1,  M:'M_FOOD',      effect:{fill:'food',  ms:6*60*60*1000}, desc:'밥그릇을 탭해 채울 때 1개 소모(6시간 유지).' },
      { id:'water',      name:'물',     price:1,  M:'M_WATER',     effect:{fill:'water', ms:6*60*60*1000}, desc:'물그릇을 탭해 채울 때 1개 소모(6시간 유지).' },
      { id:'food_plus',  name:'고급사료', price:2,  M:'M_FOODPLUS',  effect:{fill:'food',  ms:12*60*60*1000}, desc:'밥그릇을 12시간 유지하는 고급 사료. 자주 안 채워도 행복도가 오래 유지돼요.' },
      { id:'water_plus', name:'정수물', price:2,  M:'M_WATERPLUS', effect:{fill:'water', ms:12*60*60*1000}, desc:'물그릇을 12시간 유지하는 정수된 물.' },
      { id:'treat',      name:'츄르',   price:10, cur:'gold', M:'M_TREAT', effect:{affection:1}, dailyBuy:5, desc:'펫에게 주면 애정 +1 (쓰다듬기 쿨다운 무시). 금화 10, 하루 5개까지 구매.' },
      { id:'tonic',      name:'영양제', price:0,  M:'M_TONIC',     effect:{boost:1.5, ms:6*60*60*1000}, dailyBuy:1, desc:'무료로 하루 1개 받아요. 사용하면 6시간 동안 수확 수익과 드랍 확률이 ×1.5.' },
      { id:'dye',        name:'염색약', price:100, cur:'gold', M:'M_DYE', desc:'가방에서 펫을 골라 톤을 랜덤 변경(45색 중 하나). 금화로 구매.' },   // 🎨 알뜰샵 판매(금화 100, 2026-07 사용자 지침 — 이벤트·쿠폰·선물 지급도 병행)
      { id:'dye_remover',name:'염색 리무버', price:200, cur:'gold', M:'M_DYE', desc:'염색된 펫을 골라 1개 소모해 원래 톤으로 복원. 금화로 구매.' }   // 🧴 알뜰샵 판매(금화 200)
    ];
    const FILL_MS = 6*60*60*1000;   // 그릇이 채워진 뒤 비워지기까지(6시간 — 기본 사료·물 기준)
    const MOOD_CARE_MS = 24*60*60*1000;   // ❤️ 수확(caredAt) 후 행복도 보너스가 0으로 빠지는 시간(24h)
    const POOP_REWARD = 4;          // 똥 하나 치우면 얻는 은화
    const CARE_ITEMS = ['bowl','waterbowl','litterbox'];   // 케어 아이템(밥·물·화장실)
    function careCap(){ return Math.max(1, Math.min(3, activeCats().length)); }   // 방당 상한 = 이 방 활성 펫 수(최대 3, 다묘 대응). enrichTypeCount가 케어를 제외하므로 개수는 행복도·enrichment에 영향 없음(순수 배치 편의).
    // (구 "빈 슬롯 자동 채우기(autoFillSlots)"는 제거 — 2026-07 사용자 지침: 펫 배치는 배치모드에서 직접 선택)
    // 🪙 수확 드롭 확률(경제 정책 §3-C): 시간당 금화 20% + 랜덤박스 30%·펫알 16%·뜰알 4% + 🌈무지개동전 1%·무지개알 0.2%·무지개박스 0.2%. 활성 펫 있을 때만.
    //   💗 여기에 방 행복도 보너스 배수(util.dropMoodFactor, 10% 단위 내림 1.0~2.0)가 곱해진다 — 기본 확률에 행복도만큼 더해줌: 100=+100%(×2.0), 66=+60%(×1.6), 10 미만=기본(×1.0).
    //   ⚠️ 획득 경로는 '수확 순간 일괄 롤'에서 실시간 스폰(reconcileDrops, 10분 단위 p/6 롤)으로 대체 — 기대값 동일, 방 바닥에 드랍이 놓여 클릭/수확으로 수령.
    //   📦 랜덤박스 드랍은 수령 시 즉석 개봉하지 않고 봉인 랜덤박스(consum.box) 그대로 가방에 넣는다(2026-07 변경 — 이후 가챠 배너에서 열기). 알 종류(펫알·뜰알)도 봉인 상태 인벤토리.
    //   🌈 무지개동전=g.rbcoin +1 · 무지개알/무지개박스=g.rbcoin +5(1뽑 분량, 캠엔 무지개 알/박스 아트로 화려하게 뜨고 보상은 동전).
    const HARVEST_ROLL = { gold:0.20, egg:0.16, box:0.30, ddeul:0.04, rbcoin:0.01, rainbow_egg:0.002, rainbow_box:0.002 };
    const RB_EGG_BOX_RBC = 5;        // 🌈 무지개알·무지개박스 드랍 1개 = 무지개동전 5개(=1뽑 분량)
    // 🎁 실시간 드랍 스폰 상수 — PiP·캠 힐끔 요소. 시계(g.dropRollAt)는 소비한 롤만큼만 전진(만석이면 시간 보존), 24h 캡이 무한 누적 방지.
    //   스폰 대상은 "한 방"뿐(dropTargetRoom — 현재 방 우선) — 방이 5개라고 ×5로 쏟아지지 않고, 대기 상한도 그 방 5개가 전부.
    const DROP_ROLL_MS = 1*60000;    // 롤 단위(1분) — 스폰이 1분마다 촘촘하게(2026-07 사용자 지침). 씬 서명 가드로 잦은 스폰의 렌더 부담을 줄임.
    const DROP_ROLL_DIV = 60;        // 롤당 확률 = HARVEST_ROLL/60 (1분×60회 = 시간당 기대값 보존 — 총량 인플레 없이 롤 주기만 촘촘)
    const DROP_MAX_ROOM = 5;         // 대기 드랍 상한(util.js normRoom의 5개 절단과 짝) — 단일 대상 방이라 사실상 전체 상한
    const DROP_ROLL_CAP = 1440;      // 소급 롤 상한 = 24h × 60 (기존 24h 캡과 동일 회계)
    // 벽지(방 배경) — 구매 후 적용. default는 기본 제공.
    const WALLPAPER_CATALOG = [
      // price는 두지 않는다 — 구매가는 wallBuyPrice(등급가 TIER_PRICE[tier], default=0)가 산정. brick만 WALL_TIER=epic(랜덤박스 전용), 나머지는 normal(알뜰샵).
      { id:'default', name:'기본',  css:'linear-gradient(180deg,color-mix(in srgb,var(--soft) 55%,var(--card)) 0%,var(--soft) 100%)' },
      { id:'sky',     name:'하늘',  css:'linear-gradient(180deg,#bfe3ff 0%,#e9f5ff 100%)' },
      { id:'sakura',  name:'벚꽃',  css:'linear-gradient(180deg,#ffdcea 0%,#fff1f6 100%)' },
      { id:'mint',    name:'민트',  css:'linear-gradient(180deg,#c9ede0 0%,#eefaf4 100%)' },
      { id:'night',   name:'별밤',  css:'linear-gradient(180deg,#2a2e57 0%,#525891 100%)' },
      { id:'peach',   name:'살구',  css:'linear-gradient(180deg,#ffe4cf 0%,#fff4ea 100%)' },
      { id:'sunset',  name:'노을',  css:'linear-gradient(180deg,#ffd0a6 0%,#ffb3c9 100%)' },
      { id:'forest',  name:'숲',    css:'linear-gradient(180deg,#bfe6c0 0%,#eaf6e2 100%)' },
      { id:'ocean',   name:'바다',  css:'linear-gradient(180deg,#a6d8ef 0%,#d9f0f5 100%)' },
      { id:'lavender',name:'라벤더',css:'linear-gradient(180deg,#e0d0f5 0%,#f3ecfb 100%)' },
      { id:'brick',   name:'벽돌',  tile:{ m:M_WALL_BRICK, pal:FLOOR_PALS.brickwall, tw:22, th:22 } },
      { id:'dawn', name:'여명', css:'linear-gradient(180deg,#ffe0c2 0%,#ffd0e0 55%,#e6d8ff 100%)' },
      { id:'grape', name:'포도', css:'linear-gradient(180deg,#c9b6e8 0%,#efe6fb 100%)' },
      { id:'lemon', name:'레몬', css:'linear-gradient(180deg,#fff2b0 0%,#fffbe0 100%)' },
      { id:'rose', name:'로즈', css:'linear-gradient(180deg,#f7c1cf 0%,#fde7ec 100%)' },
      { id:'teal', name:'청록', css:'linear-gradient(180deg,#a6ddd8 0%,#e2f5f2 100%)' },
      { id:'charcoal', name:'차콜', css:'linear-gradient(180deg,#3a3f47 0%,#5a616b 100%)' },
      { id:'stripes', name:'줄무늬', tile:{ m:M_WALL_STRIPES, pal:FLOOR_PALS.stripes, tw:24, th:24 } },
      { id:'polkadot', name:'물방울', tile:{ m:M_WALL_POLKA, pal:FLOOR_PALS.polkadot, tw:24, th:24 } },
      { id:'woodwall', name:'원목벽', tile:{ m:M_WALL_WOOD, pal:FLOOR_PALS.woodwall, tw:24, th:24 } },
      { id:'damask', name:'다마스크', tile:{ m:M_WALL_DAMASK, pal:FLOOR_PALS.damask, tw:24, th:24 } },
      // 🌅🌈 움직이는 하늘 벽지(배너씬 기반·신화) — 구름 흐르고 해 뜨고 무지개·별이 반짝. css=하늘 그라디언트(썸네일·배경), scene=씬 종류.
      { id:'sunset_sky', name:'노을 하늘', scene:'sunset', css:'linear-gradient(180deg,#3d2f66 0%,#7a4880 24%,#c65f6a 50%,#ef9457 74%,#ffc184 100%)' },
      { id:'rainbow_sky', name:'무지개 하늘', scene:'rainbow', css:'linear-gradient(180deg,#bfe3ff 0%,#e9f5ff 58%,#fff6e0 100%)' },
      { id:'night_sky', name:'별밤 하늘', scene:'night', css:'linear-gradient(180deg,#141838 0%,#2a2e57 45%,#525891 100%)' },
    ];
    function wallCss(id){ const w=WALLPAPER_CATALOG.find(x=>x.id===id)||WALLPAPER_CATALOG[0]; if(!w.tile) return w.css; if(_tileBgCache['w:'+id]) return _tileBgCache['w:'+id]; return (_tileBgCache['w:'+id]=tileBg(w.tile.m, w.tile.pal, w.tile.tw, w.tile.th)); }
    function ownsWall(id){ return id==='default' || !!(state.game&&state.game.owned.wallpapers[id]); }
    // ---- 여러 방(프리셋) 접근자 — 모든 방별 읽기/쓰기는 반드시 이 헬퍼를 거친다(현재 방 기준). ----
    function homeH(){ return (state.game&&state.game.home)||{ rooms:[{active:[],placed:{},wallpaper:'default',poops:0,name:'방 1'}], current:0, roomSlots:BASE_ROOMS, slots:BASE_SLOTS }; }
    function roomCount(){ return Math.min(MAX_ROOMS, Math.max(BASE_ROOMS, (homeH().roomSlots)||BASE_ROOMS)); }   // 열린 방 수
    function roomIdx(){ const h=homeH(); const n=(h.rooms&&h.rooms.length)||1; return Math.min(n-1, Math.max(0, h.current|0)); }   // 현재 방 인덱스(클램프)
    function room(){ const h=homeH(); return (h.rooms&&h.rooms[roomIdx()])||{ active:[], placed:{}, wallPlaced:{}, wallpaper:'default', poops:0, name:'방 1' }; }   // 현재 방 객체
    function gRoom(g){ return g.home.rooms[g.home.current|0]||g.home.rooms[0]; }   // 트랜잭션 내부(normalizeGame 후)에서 '서버 기준 현재' 방 — 새 펫 자동 배치 등 "현재 방이면 어디든" 용도만. 보고 있는 방을 겨냥한 쓰기는 gRoomById!
    // 트랜잭션 내부에서 '사용자가 보고 있는 방'을 id로 정확히 겨냥 — 방 삭제/순서변경/다른 기기 방 전환 경합에도 엉뚱한 방에 쓰지 않는다. id 미발견(레거시 미부여)이면 현재 방 폴백.
    //  사용법: 트랜잭션 밖에서 const rid=curRoomId(); → 안에서 const R=gRoomById(g, rid);
    function gRoomById(g, id){ const rs=(g.home&&g.home.rooms)||[]; const i=roomIndexById(rs, id); return (i>=0?rs[i]:null)||gRoom(g); }
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
    // 💗 애정 계단 개편(2026-07) 1회 마이그레이션 — 애정 수치는 유지·레벨만 새 등급별 임계로 재해석(하락 수용, 명품백 가치 재정립).
    //    대신 affRw(보상 수령 최고 레벨)를 "구 임계([1,3,7,14,21] 전 등급 공통) 기준 레벨"로 초기화해,
    //    레벨이 내려갔다 재도달해도 레벨업 은화·만렙 금화가 이중 지급되지 않게 한다. 마커 g.affV=2(멱등·race-safe 트랜잭션).
    function migrateAffRwIfNeeded(raw){
      if(!state.uid) return;
      if(!raw || Number(raw.affV)===2) return;   // 이미 이관 or 첫 로드 전
      if(state._affMigrating) return; state._affMigrating=true;   // 로컬 중복 방지
      const OLD_TH=[1,3,7,14,21];
      const oldLv=a=>{ a=Math.max(0,Math.floor(Number(a)||0)); let l=0; for(let i=0;i<OLD_TH.length;i++) if(a>=OLD_TH[i]) l=i+1; return l; };
      gameRef().transaction(g=>{
        if(!g) return;   // null 첫 패스(콜드캐시)에 기본값 제안 금지 — 서버 재실행에서 진짜 값으로 판정
        if(Number(g.affV)===2) return;   // 다른 기기가 이미 이관 → abort
        const cats=(g.owned&&g.owned.cats)||{};
        Object.keys(cats).forEach(id=>{ const c=cats[id]; if(!c||typeof c!=='object') return;
          const lv=oldLv(c.affection); if(lv>Math.max(0,Math.floor(Number(c.affRw)||0))) c.affRw=lv; });
        g.affV=2; return g;
      }).catch(()=>{}).then(()=>{ state._affMigrating=false; });
    }
    // 🌈 무지개 경제 개편(2026-07) 1회 마이그레이션 — ① 구 무지개알/무지개박스 소비 인벤토리 전량 회수(무지개동전 직접 뽑기로 대체)
    //    ② 기구물 보유 상한 개편(케어 5개·그 외 1개) 초과분 회수: qty를 상한으로 클램프하고, 배치 수가 새 상한을 넘으면 초과 배치도 제거(인벤토리 정합).
    //    마커 g.rbMigV=1(멱등·race-safe 트랜잭션).
    function migrateRbEconomyIfNeeded(raw){
      if(!state.uid) return;
      if(!raw || Number(raw.rbMigV)===1) return;
      if(state._rbMigrating) return; state._rbMigrating=true;
      gameRef().transaction(g=>{
        if(!g) return;   // 콜드캐시 null 첫 패스엔 제안 금지
        if(Number(g.rbMigV)===1) return;
        g.consum=g.consum||{}; g.consum.rainbow_egg=0; g.consum.rainbow_box=0;   // ① 구 무지개알·박스 회수
        const items=(g.owned&&g.owned.items)||{};
        Object.keys(items).forEach(id=>{ const cap=itemCapOf(id), it=items[id]; if(!it) return;
          const q=Math.max(0, Math.min(cap, Number(it.qty)||0)); it.qty=q;   // ② 상한 클램프(케어5·기타1)
          // 배치 초과 제거 — 모든 방(바닥+벽)에서 이 아이템 배치를 세고, q개를 넘는 뒤쪽 배치는 삭제
          let left=q;
          const rooms=(g.home&&g.home.rooms)||[];
          const scan=(Array.isArray(rooms)?rooms:Object.values(rooms)).slice();
          if(g.home && (g.home.placed||g.home.wallPlaced)) scan.push(g.home);   // 레거시 flat home(rooms 미이관) 배치도 스캔 — migrateHomeRoomsIfNeeded와 순서 경합해도 초과 배치가 남지 않게
          scan.forEach(R=>{ if(!R) return;
            ['placed','wallPlaced'].forEach(fld=>{ const P=R[fld]||{};
              Object.keys(P).forEach(k=>{ const e=P[k]; if(!e||e.itemId!==id) return;
                if(left>0) left--; else delete P[k]; }); }); });
        });
        g.rbMigV=1; return g;
      }).catch(()=>{}).then(()=>{ state._rbMigrating=false; });
    }
    // 🌈🛟 무지개동전 소비카운터 시드(1회) — 자가복구(normalizeGame 바닥)가 안전하게 켜지도록 rbcoinSpent를 "현재 잔액 보존값"으로 초기화한다.
    //   시드 후: 잔액 = 누적획득 − 누적소비 = 현재 잔액(변화 0, over-grant 없음). 이후 버그로 잔액이 유실되면 이 축으로 복원되고, 정상 소비는 spendRbcoin이 축을 유지.
    //   구데이터(시드 전)는 잔액을 손대지 않으므로 안전(마커 rbcoinSpentV=1로 멱등·race-safe).
    function migrateRbcoinSpentIfNeeded(raw){
      if(!state.uid) return;
      if(!raw || Number(raw.rbcoinSpentV)>=1) return;
      if(state._rbcSeedMig) return; state._rbcSeedMig=true;
      gameRef().transaction(g=>{
        if(!g) return;   // 콜드캐시 null 첫 패스엔 제안 금지
        if(Number(g.rbcoinSpentV)>=1) return;
        const total=Math.max(0, Math.floor(Number(g.rbcoinTotal)||0));
        const bal=Math.max(0, Math.floor(Number(g.rbcoin)||0));
        g.rbcoinSpent=Math.max(0, total-bal);   // 시드 시점 잔액을 (획득−소비)로 정확히 재현 → 잔액 불변
        g.rbcoinSpentV=1; return g;
      }).catch(()=>{}).then(()=>{ state._rbcSeedMig=false; });
    }
    function currentWall(){ return room().wallpaper||'default'; }
    // 바닥 스킨(픽셀 타일) - 벽지처럼 방마다 적용. .cr-floor 배경에 반복 타일(SVG data URI). default=단색.
    const _tileBgCache={};
    // 🧵 집꾸미기 타일 배경 = canvas → PNG data URI (반드시! SVG data URI는 인트린식 크기 문제로 배경 이미지가 브라우저에서 래스터화 안 돼 회색만 보임). image-rendering:pixelated + background-size로 크게 반복.
    function tileBg(M, pal, tw, th){ try{ const cols=M[0].length, rows=M.length, cv=document.createElement('canvas'); cv.width=cols; cv.height=rows; const cx=cv.getContext('2d');
        for(let y=0;y<rows;y++){ const rw=M[y]; for(let x=0;x<cols;x++){ const ch=rw[x]; if(ch==='.'||ch===' ')continue; const c=pal[ch]; if(!c)continue; cx.fillStyle=c; cx.fillRect(x,y,1,1); } }
        return "url('"+cv.toDataURL()+"') 0 0 / "+tw+"px "+th+"px repeat"; }catch(e){ return 'var(--soft2)'; } }
    const FLOOR_CATALOG = [
      // price는 두지 않는다 — 구매가는 floorBuyPrice(등급가 TIER_PRICE[tier], default=0)가 산정. default 외 8종은 FLOOR_TIER=epic/legend(랜덤박스 전용).
      { id:'default',   name:'기본' },
      { id:'wood',      name:'원목마루', m:M_FLOOR_WOOD,      pal:FLOOR_PALS.wood,      tw:26, th:26 },
      { id:'checker',   name:'체크타일', m:M_FLOOR_CHECKER,   pal:FLOOR_PALS.checker,   tw:26, th:26 },
      { id:'grass',     name:'잔디정원', m:M_FLOOR_GRASS,     pal:FLOOR_PALS.grass,     tw:24, th:24 },
      { id:'ondol',     name:'한옥장판', m:M_FLOOR_ONDOL,     pal:FLOOR_PALS.ondol,     tw:24, th:24 },
      { id:'starry',    name:'별밤바닥', m:M_FLOOR_STARRY,    pal:FLOOR_PALS.starry,    tw:26, th:26 },
      { id:'sand',      name:'모래사장', m:M_FLOOR_SAND,      pal:FLOOR_PALS.sand,      tw:26, th:26 },
      { id:'tatami',    name:'다다미',   m:M_FLOOR_TATAMI,    pal:FLOOR_PALS.tatami,    tw:26, th:26 },
      { id:'brickpath', name:'벽돌길',   m:M_FLOOR_BRICKPATH, pal:FLOOR_PALS.brickpath, tw:26, th:26 },
      { id:'carpetgray', name:'회색카펫', m:M_FLOOR_CARPET, pal:FLOOR_PALS.carpetgray, tw:24, th:24 },
      { id:'plankwhite', name:'화이트마루', m:M_FLOOR_PLANKW, pal:FLOOR_PALS.plankwhite, tw:24, th:24 },
      { id:'pinktile', name:'핑크타일', m:M_FLOOR_PINKTILE, pal:FLOOR_PALS.pinktile, tw:24, th:24 },
      { id:'herringbone', name:'헤링본마루', m:M_FLOOR_HERRING, pal:FLOOR_PALS.herringbone, tw:24, th:24 },
      { id:'marble', name:'대리석', m:M_FLOOR_MARBLE, pal:FLOOR_PALS.marble, tw:24, th:24 },
      { id:'galaxy', name:'은하바닥', m:M_FLOOR_GALAXY, pal:FLOOR_PALS.galaxy, tw:24, th:24 },
      { id:'autumn', name:'낙엽바닥', m:M_FLOOR_AUTUMN, pal:FLOOR_PALS.autumn, tw:24, th:24 },
      { id:'snow', name:'눈밭', m:M_FLOOR_SNOW, pal:FLOOR_PALS.snow, tw:24, th:24 },
      { id:'lava', name:'용암바닥', m:M_FLOOR_LAVA, pal:FLOOR_PALS.lava, tw:24, th:24 },
      { id:'clouds', name:'구름바닥', m:M_FLOOR_CLOUDS, pal:FLOOR_PALS.clouds, tw:24, th:24 },
      // 🌅🌈 움직이는 들판 바닥(배너씬 기반·신화) — 풀·꽃이 흔들리고 나비/반딧불이 떠다님. css=들판 그라디언트(썸네일·배경), scene=씬 종류.
      { id:'sunset_field', name:'노을 들판', scene:'sunset', css:'linear-gradient(180deg,#8a9a5a 0%,#6f9c50 100%)' },
      { id:'rainbow_field', name:'꽃밭 들판', scene:'rainbow', css:'linear-gradient(180deg,#93c56d 0%,#79b154 100%)' },
      { id:'night_field', name:'별밤 들판', scene:'night', css:'linear-gradient(180deg,#3a5040 0%,#2a3e34 100%)' },
    ];
    function floorCss(id){ if(_tileBgCache['f:'+id]) return _tileBgCache['f:'+id]; const f=FLOOR_CATALOG.find(x=>x.id===id)||FLOOR_CATALOG[0]; if(f.css) return (_tileBgCache['f:'+id]=f.css); const v=f.m? tileBg(f.m, f.pal, f.tw, f.th) : 'var(--soft2)'; return (_tileBgCache['f:'+id]=v); }
    function currentFloor(){ return room().floor||'default'; }
    function ownsFloor(id){ return id==='default' || !!(state.game&&state.game.owned&&state.game.owned.floors&&state.game.owned.floors[id]); }
    // 🌅🌈 움직이는 배경(배너씬 기반) 벽지=하늘·바닥=들판 — .cr-wall/.cr-floor 안에 씬 스프라이트를 얹는다(신화). 위치는 결정적(pkRand)이라 재렌더에 안 튐. pk-* 클래스 재사용(모션축소·lite 전역 정지).
    function wallSceneHtml(id){ const w=WALLPAPER_CATALOG.find(x=>x.id===id); if(!w||!w.scene) return ''; const t=w.scene; let s='';
      const cn=pkCount(t==='night'?7:11);
      for(let i=0;i<cn;i++){ const y=(3+pkRand(i,1)*32).toFixed(1), hh=Math.round(9+pkRand(i,2)*13), wc=Math.floor(pkRand(i,3)*3), dur=(28+pkRand(i,5)*44).toFixed(1);
        const tn=(t==='sunset')?['so','sp','sv'][Math.floor(pkRand(i,4)*3)]:['w','b'][Math.floor(pkRand(i,4)*2)];
        s+='<span class="pk-cloud" style="top:'+y+'%;--d:'+dur+'s;--i:'+i+'">'+cloudSvg(wc,tn,{h:hh})+'</span>'; }
      if(t==='sunset') s+='<span class="pk-risesun">'+sunSvg({h:52})+'</span>';
      else if(t==='rainbow') s+='<span class="pk-rainbow">'+authRainbowSvg({h:60})+'</span>';
      else if(t==='night'){ s+='<span class="pk-moon">'+moonSvg({h:30})+'</span>'; for(let i=0;i<pkCount(14);i++){ const l=(4+pkRand(i,11)*92).toFixed(1), tp=(4+pkRand(i,12)*38).toFixed(1), hh=Math.round(3+pkRand(i,13)*4); s+='<span class="pk-star" style="left:'+l+'%;top:'+tp+'%;--i:'+i+'">'+nightStarSvg({h:hh})+'</span>'; } }
      const HX=[18,50,82], HH=[18,16,20], hp=(t==='sunset')?HILL_SUNSET:(t==='night'?HILL_NIGHT:HILL_DAY);
      for(let i=0;i<3;i++) s+='<span class="pk-hill" style="left:'+HX[i]+'%;bottom:calc(var(--cam-floor) - 3px);z-index:0;">'+hillSvg(hp,{h:HH[i]})+'</span>';
      return s; }
    function floorSceneHtml(id){ const f=FLOOR_CATALOG.find(x=>x.id===id); if(!f||!f.scene) return ''; const t=f.scene; let s='';
      const nt=pkCount(16); for(let i=0;i<nt;i++){ const d=pkRand(i,31)*0.85, l=(2+(i+0.5)/nt*94+(pkRand(i,32)-0.5)*3.5).toFixed(1), sc=1-d*0.4, bot=(4+d*72).toFixed(1);
        s+='<span class="pk-tuft" style="left:'+l+'%;bottom:'+bot+'%;--i:'+i+'">'+tuftSvg({h:Math.max(6,Math.round(13*sc))})+'</span>'; }
      const fc=(t==='sunset')?['su','sg','sw']:['r','y','p'];
      for(let i=0;i<14;i++){ const d=pkRand(i,21)*0.62, l=(5+(i+0.5)/14*90+(pkRand(i,22)-0.5)*3.5).toFixed(1), sc=1-d*0.4, bot=(4+d*68).toFixed(1);
        s+='<span class="pk-flower" style="left:'+l+'%;bottom:'+bot+'%;--i:'+i+'">'+flowerSvg(fc[Math.floor(pkRand(i,23)*3)],{h:Math.max(8,Math.round(15*sc))})+'</span>'; }
      if(t==='night'){ for(let i=0;i<pkCount(6);i++){ const l=(6+pkRand(i,61)*88).toFixed(1), b=(10+pkRand(i,62)*50).toFixed(1), hh=Math.round(8+pkRand(i,63)*3), dur=(5+pkRand(i,64)*4).toFixed(1), bd=(1+pkRand(i,65)*1.2).toFixed(2), del=(-pkRand(i,66)*6).toFixed(2); let _s=70; const rnd=()=>pkRand(i,_s++);
        s+='<span class="pk-fire" style="left:'+l+'%;bottom:'+b+'%;--d:'+dur+'s;--bd:'+bd+'s;animation-delay:'+del+'s;'+bflyDriftVars(rnd)+'"><span class="ff-core">'+fireflySvg({h:hh})+'</span></span>'; } }
      else { const BFT=['o','b','p','y']; for(let i=0;i<pkCount(4);i++){ const l=(10+pkRand(i,71)*80).toFixed(1), b=(20+pkRand(i,72)*40).toFixed(1), hh=Math.round(9+pkRand(i,73)*4), dur=(6.5+pkRand(i,74)*5).toFixed(1), del=(-pkRand(i,75)*8).toFixed(2), fd=(0.32+pkRand(i,76)*0.24).toFixed(2); let _s=90; const rnd=()=>pkRand(i,_s++);
        s+='<span class="pk-bfly" style="left:'+l+'%;bottom:'+b+'%;--d:'+dur+'s;--fd:'+fd+'s;animation-delay:'+del+'s;'+bflyDriftVars(rnd)+'"><span class="bf-wing">'+butterflySvg(BFT[i%4],{h:hh})+'</span></span>'; } }
      return s; }
    // 🌸 벚꽃잎(배경효과 sakura용) — 낙엽처럼 떨어지는 분홍 꽃잎.
    const M_PETAL=[ "pH.Hp","PPHPP","PPPPP","PPPPP","pPPPp",".pPp.","..p.." ];
    const PETAL_PAL={ P:'#ffb3d1', p:'#ee88b0', H:'#ffe0ec' };
    function petalSvg(opt){ return pxSvg(M_PETAL, PETAL_PAL, opt); }
    // 🌌 배경효과(ambient) — 방 전체에 떠다니는 앰비언트 오버레이(격자 배치·벽지·바닥이 아닌 별도 구분). 전부 신화·랜덤박스 가챠. 방마다 하나 적용(room().bgfx).
    const BGFX_CATALOG=[
      { id:'butterflies',   name:'나비 정원',   desc:'알록달록 나비들이 방 안을 살랑살랑 날아다녀요.' },
      { id:'mapleleaves',   name:'단풍잎',      desc:'단풍잎이 좌우로 흔들리며 살랑살랑 떨어져요.' },
      { id:'dragonflies',   name:'고추잠자리',  desc:'고추잠자리 몇 마리가 방 위를 맴돌아요.' },
      { id:'fireflies',     name:'반딧불',      desc:'반딧불이 은은하게 반짝이며 떠다녀요.' },
      { id:'sakura',        name:'벚꽃잎',      desc:'분홍 벚꽃잎이 바람에 흩날려요.' },
      { id:'rainbowflutter',name:'무지개 나비', desc:'무지개빛 나비 떼가 화려하게 날아다녀요.' },
    ];
    function bgfxTierMap(){ const m={}; BGFX_CATALOG.forEach(x=>{ m[x.id]='exclusive'; }); return m; }   // 전부 한정(exclusive) — 기본 박스 0.2%·무지개박스 50%로 출현(2026-07 개편, boxPool 한정 포함)
    function currentBgfx(){ return (room()&&room().bgfx)||''; }
    function ownsBgfx(id){ return !!(state.game&&state.game.owned&&state.game.owned.bgfx&&state.game.owned.bgfx[id]); }
    function bgfxCat(id){ return BGFX_CATALOG.find(x=>x.id===id); }
    // 배경효과 대표 썸네일(랜덤박스 리빌·스킨피커용)
    function bgfxThumb(id, h){ h=h||60;
      if(id==='mapleleaves') return mapleLeafSvg({h:h}, LEAF_COLS[0]);
      if(id==='sakura') return petalSvg({h:h});
      if(id==='dragonflies') return dragonflySvg({h:h});
      if(id==='fireflies') return fireflySvg({h:h});
      return butterflySvg(id==='rainbowflutter'?'p':'o',{h:h}); }
    // 배경효과 오버레이 스프라이트(픽업씬 조각 재사용: pk-bfly/pk-fallleaf/pk-dfly/pk-fire). 위치는 결정적(pkRand)이라 재렌더에 안 튐.
    function bgfxOverlayHtml(id){ if(!id) return ''; const _m=(typeof perfCountMul==='function'?perfCountMul():1); const N=k=>Math.max(3,Math.round(k*_m)); let s='';   // 🔋 배경효과 개수 등급별 감축(perfCountMul) — cats.engine.js 로드 전/스큐 대비 typeof 가드(없으면 무감축)
      // 🧭 균일 분포 + 원근(사용자 지침): 캠 전체를 지터드 그리드로 나눠 한 칸에 하나씩(간격 확보) 배치하고,
      //    세로 밴드로 깊이를 준다 — 뒤(위)일수록 높은 bottom%·작게, 앞(아래)일수록 낮은 bottom%·크게. DOM 순서=뒤→앞이라 앞이 위로 그려짐.
      const slots=(n,seed)=>pkSlots(n,seed);   // 공용 지터드 그리드(pkSlots) 사용
      const persB=yy=>(13+(1-yy)*72).toFixed(1);   // 원근 세로: 뒤(위)=높은 bottom%, 앞(아래)=낮은 bottom%(컴 전체 13~85%)
      const persS=yy=>(0.66+yy*0.62);               // 원근 크기: 앞일수록 크게
      function bfly(n, tints){ const P=slots(n,110); for(let i=0;i<n;i++){ const o=P[i], hh=Math.round((12+pkRand(i,13)*5)*persS(o.yy)), dur=(6+pkRand(i,14)*5).toFixed(1), fd=(0.30+pkRand(i,15)*0.26).toFixed(2), del=(-pkRand(i,16)*8).toFixed(2); let _s=20; const rnd=()=>pkRand(i,_s++);
        s+='<span class="pk-bfly" style="left:'+o.x+'%;bottom:'+persB(o.yy)+'%;--d:'+dur+'s;--fd:'+fd+'s;animation-delay:'+del+'s;'+bflyDriftVars(rnd)+'"><span class="bf-wing">'+butterflySvg(tints[i%tints.length],{h:hh})+'</span></span>'; } }
      function leaf(n, colf){ for(let i=0;i<n;i++){ const x=((i+0.5)/n*94+3+(pkRand(i,31)-0.5)*(84/n)).toFixed(1), d=pkRand(i,37), hh=Math.round((10+pkRand(i,35)*5)*(0.72+(1-d)*0.5)), dur=(6.5+d*6).toFixed(1), del=(-pkRand(i,33)*10).toFixed(2), sw=(2.2+pkRand(i,34)*1.6).toFixed(1), dir=(pkRand(i,36)<0.5?-1:1);   // 세로 낙하라 가로만 균일 배분 + 깊이로 크기·속도 차등(뒤=작고 느림)
        s+='<span class="pk-fallleaf" style="left:'+x+'%;--d:'+dur+'s;--sw:'+sw+'s;--dir:'+dir+';animation-delay:'+del+'s;"><span class="fl-in">'+colf(i,hh)+'</span></span>'; } }
      function dfly(n){ const P=slots(n,140); for(let i=0;i<n;i++){ const o=P[i], hh=Math.round((11+pkRand(i,43)*5)*persS(o.yy)), dur=(6+pkRand(i,44)*5).toFixed(1), del=(-pkRand(i,45)*8).toFixed(2); let _s=50; const rnd=()=>pkRand(i,_s++);
        s+='<span class="pk-dfly" style="left:'+o.x+'%;bottom:'+persB(o.yy)+'%;--d:'+dur+'s;animation-delay:'+del+'s;'+bflyDriftVars(rnd)+'"><span class="df-body">'+dragonflySvg({h:hh})+'</span></span>'; } }
      function fire(n){ const P=slots(n,170); for(let i=0;i<n;i++){ const o=P[i], hh=Math.round((9+pkRand(i,63)*4)*persS(o.yy)), dur=(5+pkRand(i,64)*5).toFixed(1), bd=(1+pkRand(i,65)*1.4).toFixed(2), del=(-pkRand(i,66)*6).toFixed(2); let _s=70; const rnd=()=>pkRand(i,_s++);
        s+='<span class="pk-fire" style="left:'+o.x+'%;bottom:'+persB(o.yy)+'%;--d:'+dur+'s;--bd:'+bd+'s;animation-delay:'+del+'s;'+bflyDriftVars(rnd)+'"><span class="ff-core">'+fireflySvg({h:hh})+'</span></span>'; } }
      if(id==='butterflies') bfly(N(7),['o','b','p','y']);
      else if(id==='rainbowflutter') bfly(N(10),['o','b','p','y','o','p']);
      else if(id==='mapleleaves') leaf(N(10),(i,hh)=>mapleLeafSvg({h:hh}, LEAF_COLS[Math.floor(pkRand(i,207)*LEAF_COLS.length)]));
      else if(id==='sakura') leaf(N(10),(i,hh)=>petalSvg({h:hh}));
      else if(id==='dragonflies') dfly(N(5));
      else if(id==='fireflies') fire(N(8));
      return s; }
    function roomOverlay(bgfxId){ return '<div class="cr-overlay" aria-hidden="true">'+bgfxOverlayHtml(bgfxId)+'</div>'; }
    // 🦋 희귀 손님 조각 1마리 — bgfxOverlayHtml의 bfly/dfly/fire 마크업을 단일 개체로(다층 모션 규칙 자동 충족: flit 경로+날갯짓/기울기/깜빡임).
    function guestPieceHtml(kind){
      const rnd=Math.random, x=(8+rnd()*74).toFixed(1), yy=rnd(), b=(13+(1-yy)*60).toFixed(1), sc=0.7+yy*0.6;   // 원근: 뒤=높이·작게, 앞=낮게·크게(bgfx와 동일)
      if(kind==='dfly'){ const hh=Math.round(13*sc), dur=(6+rnd()*5).toFixed(1);
        return '<span class="pk-dfly" style="left:'+x+'%;bottom:'+b+'%;--d:'+dur+'s;'+bflyDriftVars(rnd)+'"><span class="df-body">'+dragonflySvg({h:hh})+'</span></span>'; }
      if(kind==='fire'){ const hh=Math.round(10*sc), dur=(5+rnd()*5).toFixed(1), bd=(1+rnd()*1.4).toFixed(2);
        return '<span class="pk-fire" style="left:'+x+'%;bottom:'+b+'%;--d:'+dur+'s;--bd:'+bd+'s;'+bflyDriftVars(rnd)+'"><span class="ff-core">'+fireflySvg({h:hh})+'</span></span>'; }
      const tints=['o','b','p','y'], hh=Math.round(14*sc), dur=(6+rnd()*5).toFixed(1), fd=(0.30+rnd()*0.26).toFixed(2);
      return '<span class="pk-bfly" style="left:'+x+'%;bottom:'+b+'%;--d:'+dur+'s;--fd:'+fd+'s;'+bflyDriftVars(rnd)+'"><span class="bf-wing">'+butterflySvg(tints[Math.floor(rnd()*4)],{h:hh})+'</span></span>';
    }
    // 🦋 희귀 손님 이벤트 — 90초 체크마다 낮은 확률(~5%)로 나비·잠자리·반딧불 1마리가 캠에 스르르 방문했다 사라짐(로컬 장식, 배경효과 미보유 방 포함).
    //   ⚠️ .cr-overlay '안'에 넣으면 _onGameChangeNow 라이브 패치(innerHTML 교체)가 지워버림 → 형제 레이어 .cr-guestlayer 로 부착.
    //   절전: lite·모션축소·탭 숨김이면 스폰 안 함 + CSS(sheet-open/lite) 정지. 친구방·PiP 미적용(1차 스코프).
    let _guestUntil=0;
    function maybeRareGuest(){
      try{
        if(Date.now()<_guestUntil) return;   // 방문 중이면 skip
        if(liteMode()||reducedMotion()||document.hidden) return;
        if(Math.random()>=0.05) return;      // 체크(90초)당 5% ≈ 평균 30분에 1회꼴
        const hosts=[];
        if(dockMode()!=='hidden' && !document.body.classList.contains('sheet-open')){ const d=document.querySelector('#catdock .cd-room'); if(d) hosts.push(d); }
        const hr=document.getElementById('catRoom'); if(hr) hosts.push(hr);
        if(!hosts.length) return;
        const kind=['bfly','bfly','dfly','fire'][Math.floor(Math.random()*4)];   // 나비 가중
        const gd=22000+Math.round(Math.random()*10000); _guestUntil=Date.now()+gd;
        hosts.forEach(function(h){ if(h.querySelector('.cr-guestlayer')) return;
          const el=document.createElement('div'); el.className='cr-guestlayer'; el.setAttribute('aria-hidden','true');
          el.style.setProperty('--gd',(gd/1000).toFixed(1)+'s'); el.innerHTML=guestPieceHtml(kind);
          h.appendChild(el); setTimeout(function(){ try{ el.remove(); }catch(e){} }, gd+300); });
      }catch(e){}
    }
    function applyBgfx(id){ if(id && !ownsBgfx(id)){ toast('먼저 얻으세요', true); return; } if(typeof captureUndo==='function') captureUndo(); roomTx(curRoomId(), roomIdx(), R=>{ R.bgfx=id||''; }); toast(id?'배경효과를 적용했어요':'배경효과를 껐어요'); }
    // 배경효과 선택기(방꾸미기 하단) — 보유한 것만 + '없음'. 미보유면 숨김(랜덤박스로만 획득).
    function bgfxPickerHtml(){ const owned=BGFX_CATALOG.filter(x=>ownsBgfx(x.id)); if(!owned.length) return ''; const cur=currentBgfx();
      const CK='<i class="ck"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></i>';
      const none='<button class="skinsw'+(!cur?' on':'')+'" '+App.view.act('applyBgfx','')+' aria-label="배경효과 없음"><span class="sw sw-none">✕</span><span class="nm">없음</span>'+(!cur?CK:'')+'</button>';
      const sw=owned.map(x=>{ const on=cur===x.id; return '<button class="skinsw'+(on?' on':'')+'" '+App.view.act('applyBgfx',x.id)+' aria-label="'+escapeHtml(x.name)+(on?' 적용됨':' 적용')+'"><span class="sw sw-bgfx">'+bgfxThumb(x.id,26)+'</span><span class="nm">'+escapeHtml(x.name)+'</span>'+(on?CK:'')+'</button>'; }).join('');
      return '<div class="skinsel"><div class="skinlab">배경효과 <span class="sc">보유 '+owned.length+'</span></div><div class="skinrow">'+none+sw+'</div><div class="skinhint">방 전체에 나비·낙엽 같은 효과를 적용해요. 랜덤박스(신화)에서 얻어요.</div></div>'; }
    // 미션 정의(일일). reward=은화. check(ctx)=완료 여부(현재 워크스페이스 활동 읽어 판정). 경제 정책(economy-policy) 반영: 접속 보장 번들(출석·첫 기록) 크게, 나머지는 상한.
    const DAILY_MISSIONS = [
      { id:'record', period:'day', name:'오늘 1건 기록', reward:50, icon:'<path d="M12 4v16M8 8l4-4 4 4"/><rect x="4" y="18" width="16" height="3" rx="1"/>',
        // 가계부(거래) 또는 할일 중 아무거나 오늘 1건 등록하면 완료
        check:()=> (state.transactions||[]).some(t=>(t.date||'').slice(0,10)===kstDayKey())
          || ((state.todos||[]).concat(state.myTodos||[])).some(t=>(t.createdAt||'').slice(0,10)===kstDayKey()) },
      { id:'attend', period:'day', name:'출석 체크', reward:50, icon:'<path d="M5 12l4 4L19 6"/>',
        check:()=> true }   // 앱 진입 = 완료(멱등 수령)
    ];
    // 🔁 데일리 로테이션 풀 — 날짜 시드로 매일 2종 노출(질림 방지). 각 은 40. 라이트 유저도 쉬운 것 위주로 달성.
    //   체크는 모두 신뢰 가능한 데이터(오늘 거래·petDay/todoDay 마커)만 사용.
    const DAILY_POOL = [
      { id:'q_memo', period:'day', name:'거래에 카테고리·메모 채우기', reward:40, icon:'<path d="M4 7h16M4 12h9M4 17h6"/><path d="M14 16l5-5 2 2-5 5-2 0z"/>',
        check:()=> (state.transactions||[]).some(t=>(t.date||'').slice(0,10)===kstDayKey() && t.category && String(t.memo||t.desc||'').trim()) },
      { id:'q_tx3', period:'day', name:'오늘 거래 3건 기록', reward:40, icon:'<path d="M4 7h16M4 12h16M4 17h10"/>',
        prog:()=> Math.min((state.transactions||[]).filter(t=>(t.date||'').slice(0,10)===kstDayKey()).length,3)+' / 3건',
        check:()=> (state.transactions||[]).filter(t=>(t.date||'').slice(0,10)===kstDayKey()).length>=3 },
      { id:'q_todo', period:'day', name:'할일 1개 완료', reward:40, icon:'<circle cx="12" cy="12" r="9"/><path d="M8 12.4l2.7 2.7L16.5 9"/>',
        check:()=> (state.game&&state.game.todoDay&&state.game.todoDay.day===kstDayKey() && Number(state.game.todoDay.n)>0) },
      { id:'q_pet', period:'day', name:'펫 쓰다듬기', reward:40, icon:'<path d="M12 20s-6-4.5-6-9a3.5 3.5 0 0 1 6-2.4A3.5 3.5 0 0 1 18 11c0 4.5-6 9-6 9z"/>',
        check:()=> (state.game&&state.game.petDay&&state.game.petDay.day===kstDayKey() && Number(state.game.petDay.n)>0) }
    ];
    function _kstDayNum(){ return Math.floor((Date.now()+9*3600000)/86400000); }   // KST 일 번호(로테이션 시드)
    function dailyRotation(){ const n=DAILY_POOL.length; if(n<=2) return DAILY_POOL.slice(); const d=_kstDayNum(); return [DAILY_POOL[d%n], DAILY_POOL[(d+1)%n]]; }   // 매일 슬라이딩 창 2종(결정적)
    function dailyMissionsToday(){ return DAILY_MISSIONS.concat(dailyRotation()); }   // 고정 2종 + 오늘의 로테이션 2종
    const WEEKLY_MISSIONS = [
      // 기록일 계단(3/5/7일) — 꾸준함 보상. 각각 독립 수령.
      { id:'week3', period:'week', name:'이번 주 3일 기록', reward:60, icon:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
        prog:()=> Math.min(recordDaysThisWeek(),3)+' / 3일', check:()=> recordDaysThisWeek()>=3 },
      { id:'week5', period:'week', name:'이번 주 5일 기록', reward:80, icon:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
        prog:()=> Math.min(recordDaysThisWeek(),5)+' / 5일', check:()=> recordDaysThisWeek()>=5 },
      { id:'week7', gold:1, period:'week', name:'이번 주 7일 기록', reward:120, icon:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4M8 14h2M14 14h2"/>',
        prog:()=> Math.min(recordDaysThisWeek(),7)+' / 7일', check:()=> recordDaysThisWeek()>=7 },
      { id:'report', gold:1, period:'week', name:'리포트 확인', reward:40, icon:'<path d="M5 20V11M12 20V5M19 20v-6"/>',
        check:()=> reportSeenThisWeek() }
    ];
    // 월간 챌린지(period:'month'). 매월 1일(KST) 초기화. 큰 금화 공급원 — 꾸준함 보상.
    const MONTHLY_MISSIONS = [
      { id:'mon_days', gold:5, period:'month', name:'이번 달 15일 기록', reward:300, icon:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4M8 14h2M14 14h2"/>',
        prog:()=> recordDaysThisMonth()+' / 15일', check:()=> recordDaysThisMonth()>=15 },
      { id:'mon_tx', gold:3, period:'month', name:'이번 달 거래 25건', reward:150, icon:'<path d="M4 7h16M4 12h16M4 17h10"/>',
        prog:()=> Math.min(txThisMonth().length,25)+' / 25건', check:()=> txThisMonth().length>=25 }
    ];
    // 업적(1회성). period:'once' → 영구 저장(초기화 없음). 앱 기능을 써보게 유도하고 은화 보상.
    const ACHIEVEMENTS = [
      { id:'ach_first',  period:'once', name:'첫 거래 기록',        reward:10, icon:'<path d="M12 4v16M8 8l4-4 4 4"/>', check:()=> (state.transactions||[]).length>0 },
      { id:'ach_cats3', gold:3,  period:'once', name:'고양이 3마리 모으기', reward:30, icon:'<circle cx="9" cy="11" r="2.5"/><circle cx="15" cy="11" r="2.5"/><path d="M4 20c0-3 2.5-5 8-5s8 2 8 5"/>', check:()=> Object.keys((state.game&&state.game.owned&&state.game.owned.cats)||{}).length>=3 },
      { id:'ach_cats10', gold:5, period:'once', name:'고양이 10마리 모으기', reward:50, icon:'<circle cx="9" cy="11" r="2.5"/><circle cx="15" cy="11" r="2.5"/><path d="M4 20c0-3 2.5-5 8-5s8 2 8 5"/>', check:()=> Object.keys(ownedCatsMap()).length>=10 },
      { id:'ach_dexall', gold:30, period:'once', name:'도감 완성(전종 수집)', reward:200, icon:'<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><path d="M13 16l2 2 4-4"/>', check:()=> dexProgress(ownedCatsMap(), dexCatIds()).pct>=100 },
      { id:'ach_travel', period:'once', name:'여행 가계부 만들기',  reward:20, icon:'<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/>', check:()=> (state.purposeBooks||[]).some(p=>p.type==='travel'||p.type==='gathering') },
      { id:'ach_fx',     period:'once', name:'해외통화로 첫 지출',  reward:20, icon:'<circle cx="12" cy="12" r="9"/><path d="M9 9h6M9 15h6M12 6v12"/>', check:()=> (state.transactions||[]).some(t=>t.currency&&t.currency!=='KRW') },
      { id:'ach_budget', period:'once', name:'첫 예산 설정',        reward:15, icon:'<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 12h8"/>', check:()=> (state.budgets||[]).length>0 },
      { id:'ach_settle', gold:2, period:'once', name:'첫 정산 거래',        reward:25, icon:'<path d="M7 8h10M7 12h10M7 16h6"/>', check:()=> (state.transactions||[]).some(t=>t.settlementIncluded===true) },
      { id:'ach_todo1',  period:'once', name:'첫 할일 완료',        reward:10, icon:'<circle cx="12" cy="12" r="9"/><path d="M8 12.4l2.7 2.7L16.5 9"/>', check:()=> ((state.todos||[]).concat(state.myTodos||[])).some(t=>t.rewardClaimed||t.done) },
      { id:'ach_todo10', gold:3, period:'once', name:'할일 10개 완료',      reward:30, icon:'<path d="M4 6l1.5 1.5L8 5M4 12l1.5 1.5L8 11M4 18l1.5 1.5L8 17M12 6h8M12 12h8M12 18h8"/>', check:()=> ((state.todos||[]).concat(state.myTodos||[])).filter(t=>t.rewardClaimed).length>=10 },
      { id:'ach_custom1', period:'once', name:'첫 내 미션 만들기',   reward:10, icon:'<path d="M12 5v14M5 12h14"/>', check:()=> Object.keys((state.game&&state.game.customMissions)||{}).length>0 },
      { id:'ach_custom7', gold:3, period:'once', name:'내 미션 7일 연속',    reward:30, icon:'<path d="M12 3s5 4 5 9a5 5 0 1 1-10 0c0-2 1-3.5 2-4 0 2 1 3 2 3 0-3 -1-6 -1-8z"/>', check:()=> (typeof customMissionList==='function') && customMissionList().some(m=> missionStreak(missionLogDoneDates(m.id), kstDayKey()).best>=7 ) }
    ];
    const ALL_MISSIONS = DAILY_MISSIONS.concat(DAILY_POOL).concat(WEEKLY_MISSIONS).concat(MONTHLY_MISSIONS).concat(ACHIEVEMENTS);   // 로테이션 풀 포함 → claimMission이 id로 항상 찾음

    // 🌈🔋 무지개 SMIL 그라디언트 애니 정적화 플래그(저사양·OS 모션축소) — pxSvg가 읽어 <animateTransform>(무한 재생) 생략 → 정적 무지개. refreshRbStatic()가 갱신, setLiteMode/부팅서 호출.
    let _rbStatic=false;
    // ---- 픽셀 렌더 ----
    function pxSvg(map, pal, opt){
      opt=opt||{}; pal=pal||{}; if(!map||!map.length||map[0]==null) return '';   // 방어: 팔레트/매트릭스가 없어도 절대 throw 안 함(삭제된 펫 등 미정의 팔레트로 렌더가 캠·알뜰홈 전체를 깨뜨리던 크래시 방지)
      const cols=map[0].length, rows=map.length; let r=''; let rbw=false, rbw2=false; const rid='pxrbw'+(pxSvg._n=(pxSvg._n||0)+1), rid2=rid+'s';
      for(let y=0;y<rows;y++){ const row=map[y];
        for(let x=0;x<cols;x++){ const ch=row[x]; if(ch===' '||ch==='.')continue; const c=pal[ch]; if(!c)continue;
          const f=c==='RAINBOW'?(rbw=true,'url(#'+rid+')'):c==='RAINBOW2'?(rbw2=true,'url(#'+rid2+')'):c; r+='<rect x="'+x+'" y="'+y+'" width="1.05" height="1.05" fill="'+f+'"/>'; } }   // RAINBOW=선명한 무지개, RAINBOW2=은은한 파스텔 무지개(둘 다 세로 이동 그라디언트)
      const sz = opt.h ? ('height="'+opt.h+'"') : (opt.w? ('width="'+opt.w+'"') : '');
      const wh = opt.fit ? 'width="100%" height="100%"' : sz;
      const rbAnim = _rbStatic ? '' : '<animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="0 9" dur="1.6s" repeatCount="indefinite"/>';   // 저사양·모션축소면 정적(SMIL 생략)
      const grad=function(id,st){ return '<linearGradient id="'+id+'" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="9" spreadMethod="repeat">'+st+rbAnim+'</linearGradient>'; };
      const RBST='<stop offset="0" stop-color="#F04452"/><stop offset=".17" stop-color="#F0883C"/><stop offset=".34" stop-color="#F2C84B"/><stop offset=".5" stop-color="#2FAE7A"/><stop offset=".67" stop-color="#3182F6"/><stop offset=".84" stop-color="#9B6FC8"/><stop offset="1" stop-color="#F04452"/>';
      const RB2ST='<stop offset="0" stop-color="#F5C1CB"/><stop offset=".17" stop-color="#F7D8BE"/><stop offset=".34" stop-color="#F6EBC2"/><stop offset=".5" stop-color="#CBE9D6"/><stop offset=".67" stop-color="#CBDDF4"/><stop offset=".84" stop-color="#DECDEE"/><stop offset="1" stop-color="#F5C1CB"/>';   // 은은한 파스텔 무지개
      const defs=(rbw||rbw2)?('<defs>'+(rbw?grad(rid,RBST):'')+(rbw2?grad(rid2,RB2ST):'')+'</defs>'):'';
      return '<svg class="px '+(opt.cls||'')+'" viewBox="0 0 '+cols+' '+rows+'" '+wh+' shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet">'+defs+r+'</svg>';
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
      cat_mackerel:{ walk:'assets/pets/cat/cat_mackerel/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_cheese:{ walk:'assets/pets/cat/cat_cheese/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_calico:{ walk:'assets/pets/cat/cat_calico/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_black:{ walk:'assets/pets/cat/cat_black/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_white:{ walk:'assets/pets/cat/cat_white/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_fluffy:{ walk:'assets/pets/cat/cat_fluffy/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_tuxedo:{ walk:'assets/pets/cat/cat_tuxedo/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_chaos:{ walk:'assets/pets/cat/cat_chaos/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_siamese:{ walk:'assets/pets/cat/cat_siamese/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_bengal:{ walk:'assets/pets/cat/cat_bengal/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_fold:{ walk:'assets/pets/cat/cat_fold/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_bora:{ walk:'assets/pets/cat/cat_bora/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_choco:{ walk:'assets/pets/cat/cat_choco/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_kitten:{ walk:'assets/pets/cat/cat_kitten/walk.png', frames:6, stills:true, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_pink:{ walk:'assets/pets/cat/cat_pink/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      tiger_orange:{ walk:'assets/pets/tiger/tiger_orange/walk.png', frames:6, stills:true, scale:4, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      lion_mane:{ walk:'assets/pets/lion/lion_mane/walk.png', frames:6, stills:true, scale:4, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      cat_persian:{ walk:'assets/pets/cat/cat_persian/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      tiger_white:{ walk:'assets/pets/tiger/tiger_white/walk.png', frames:6, stills:true, scale:4, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      cat_russianblue:{ walk:'assets/pets/cat/cat_russianblue/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_bengal2:{ walk:'assets/pets/cat/cat_bengal2/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_mutt:{ walk:'assets/pets/dog/dog_mutt/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_panther:{ walk:'assets/pets/cat/cat_panther/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      dog_baekgu:{ walk:'assets/pets/dog/dog_baekgu/walk.png', frames:8, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_shiba:{ walk:'assets/pets/dog/dog_shiba/walk.png', frames:8, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_corgi:{ walk:'assets/pets/dog/dog_corgi/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_dalmatian:{ walk:'assets/pets/dog/dog_dalmatian/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_dachshund:{ walk:'assets/pets/dog/dog_dachshund/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_bulldog:{ walk:'assets/pets/dog/dog_bulldog/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_injeolmi:{ walk:'assets/pets/dog/dog_injeolmi/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_poodle:{ walk:'assets/pets/dog/dog_poodle/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_beagle:{ walk:'assets/pets/dog/dog_beagle/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_sukhee:{ walk:'assets/pets/dog/dog_sukhee/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_doberman:{ walk:'assets/pets/dog/dog_doberman/walk.png', frames:8, stills:true, scale:2.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_pug:{ walk:'assets/pets/dog/dog_pug/walk.png', frames:8, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_shepherd:{ walk:'assets/pets/dog/dog_shepherd/walk.png', frames:8, stills:true, scale:2.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_bordercollie:{ walk:'assets/pets/dog/dog_bordercollie/walk.png', frames:8, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_spitz:{ walk:'assets/pets/dog/dog_spitz/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_jackrussell:{ walk:'assets/pets/dog/dog_jackrussell/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_labrador:{ walk:'assets/pets/dog/dog_labrador/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_chowchow:{ walk:'assets/pets/dog/dog_chowchow/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_cardigancorgi:{ walk:'assets/pets/dog/dog_cardigancorgi/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_greyhound:{ walk:'assets/pets/dog/dog_greyhound/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_shihtzu:{ walk:'assets/pets/dog/dog_shihtzu/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_stbernard:{ walk:'assets/pets/dog/dog_stbernard/walk.png', frames:6, stills:true, scale:3, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_bostonterrier:{ walk:'assets/pets/dog/dog_bostonterrier/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_bassethound:{ walk:'assets/pets/dog/dog_bassethound/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_happy:{ walk:'assets/pets/dog/dog_happy/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_welshterrier:{ walk:'assets/pets/dog/dog_welshterrier/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_papillon:{ walk:'assets/pets/dog/dog_papillon/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_newfoundland:{ walk:'assets/pets/dog/dog_newfoundland/walk.png', frames:6, stills:true, scale:3, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_beardedcollie:{ walk:'assets/pets/dog/dog_beardedcollie/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_afghanhound:{ walk:'assets/pets/dog/dog_afghanhound/walk.png', frames:6, stills:true, scale:2.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_rottweiler:{ walk:'assets/pets/dog/dog_rottweiler/walk.png', frames:6, stills:true, scale:2.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_pointer:{ walk:'assets/pets/dog/dog_pointer/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_pharaohhound:{ walk:'assets/pets/dog/dog_pharaohhound/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_westie:{ walk:'assets/pets/dog/dog_westie/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_weimaraner:{ walk:'assets/pets/dog/dog_weimaraner/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_collie:{ walk:'assets/pets/dog/dog_collie/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_englishbulldog:{ walk:'assets/pets/dog/dog_englishbulldog/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_keeshond:{ walk:'assets/pets/dog/dog_keeshond/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_frenchbulldog:{ walk:'assets/pets/dog/dog_frenchbulldog/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_yorkshire:{ walk:'assets/pets/dog/dog_yorkshire/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_toypoodle:{ walk:'assets/pets/dog/dog_toypoodle/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_sheltie:{ walk:'assets/pets/dog/dog_sheltie/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_minpin:{ walk:'assets/pets/dog/dog_minpin/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_schnauzer:{ walk:'assets/pets/dog/dog_schnauzer/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_goldendoodle:{ walk:'assets/pets/dog/dog_goldendoodle/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_bernese:{ walk:'assets/pets/dog/dog_bernese/walk.png', frames:6, stills:true, scale:2.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_cavalier:{ walk:'assets/pets/dog/dog_cavalier/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_akita:{ walk:'assets/pets/dog/dog_akita/walk.png', frames:6, stills:true, scale:2.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_whippet:{ walk:'assets/pets/dog/dog_whippet/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_oldenglishsheepdog:{ walk:'assets/pets/dog/dog_oldenglishsheepdog/walk.png', frames:6, stills:true, scale:2.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_vizsla:{ walk:'assets/pets/dog/dog_vizsla/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_englishsetter:{ walk:'assets/pets/dog/dog_englishsetter/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_jindo:{ walk:'assets/pets/dog/dog_jindo/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      dog_chinesecrested:{ walk:'assets/pets/dog/dog_chinesecrested/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_scottie:{ walk:'assets/pets/dog/dog_scottie/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_pomeranian:{ walk:'assets/pets/dog/dog_pomeranian/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_sharpei:{ walk:'assets/pets/dog/dog_sharpei/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_greatdane:{ walk:'assets/pets/dog/dog_greatdane/walk.png', frames:6, stills:true, scale:3, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_bullterrier:{ walk:'assets/pets/dog/dog_bullterrier/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_boxer:{ walk:'assets/pets/dog/dog_boxer/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_ridgeback:{ walk:'assets/pets/dog/dog_ridgeback/walk.png', frames:6, stills:true, scale:2.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_irishsetter:{ walk:'assets/pets/dog/dog_irishsetter/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_airedale:{ walk:'assets/pets/dog/dog_airedale/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_samoyed:{ walk:'assets/pets/dog/dog_samoyed/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      dog_husky:{ walk:'assets/pets/dog/dog_husky/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_mackerel2:{ walk:'assets/pets/cat/cat_mackerel2/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_calico2:{ walk:'assets/pets/cat/cat_calico2/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_white2:{ walk:'assets/pets/cat/cat_white2/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_cheese2:{ walk:'assets/pets/cat/cat_cheese2/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_tuxedo2:{ walk:'assets/pets/cat/cat_tuxedo2/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_siamese2:{ walk:'assets/pets/cat/cat_siamese2/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_bengal3:{ walk:'assets/pets/cat/cat_bengal3/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_russianblue2:{ walk:'assets/pets/cat/cat_russianblue2/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_scottishfold:{ walk:'assets/pets/cat/cat_scottishfold/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_black2:{ walk:'assets/pets/cat/cat_black2/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_seolleong:{ walk:'assets/pets/cat/cat_seolleong/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_persiangray:{ walk:'assets/pets/cat/cat_persiangray/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_mainecoon:{ walk:'assets/pets/cat/cat_mainecoon/walk.png', frames:6, stills:true, scale:1.4, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_americanshorthair:{ walk:'assets/pets/cat/cat_americanshorthair/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_ragdoll:{ walk:'assets/pets/cat/cat_ragdoll/walk.png', frames:6, stills:true, scale:1.3, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_turkishangora:{ walk:'assets/pets/cat/cat_turkishangora/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_munchkin:{ walk:'assets/pets/cat/cat_munchkin/walk.png', frames:6, stills:true, scale:1.1, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_norwegian:{ walk:'assets/pets/cat/cat_norwegian/walk.png', frames:6, stills:true, scale:1.3, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_bombay:{ walk:'assets/pets/cat/cat_bombay/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_abyssinian:{ walk:'assets/pets/cat/cat_abyssinian/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_sphynx:{ walk:'assets/pets/cat/cat_sphynx/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_british:{ walk:'assets/pets/cat/cat_british/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_bengalsnow:{ walk:'assets/pets/cat/cat_bengalsnow/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_longhaircalico:{ walk:'assets/pets/cat/cat_longhaircalico/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_tortie:{ walk:'assets/pets/cat/cat_tortie/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_siamesechoco:{ walk:'assets/pets/cat/cat_siamesechoco/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_cornishrex:{ walk:'assets/pets/cat/cat_cornishrex/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_ocicat:{ walk:'assets/pets/cat/cat_ocicat/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_selkirkrex:{ walk:'assets/pets/cat/cat_selkirkrex/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_korat:{ walk:'assets/pets/cat/cat_korat/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_manx:{ walk:'assets/pets/cat/cat_manx/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_americancurl:{ walk:'assets/pets/cat/cat_americancurl/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_devonrex:{ walk:'assets/pets/cat/cat_devonrex/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_turkishvan:{ walk:'assets/pets/cat/cat_turkishvan/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_bobtail:{ walk:'assets/pets/cat/cat_bobtail/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_burmese:{ walk:'assets/pets/cat/cat_burmese/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_himalayan:{ walk:'assets/pets/cat/cat_himalayan/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_creamtabby:{ walk:'assets/pets/cat/cat_creamtabby/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_lilac:{ walk:'assets/pets/cat/cat_lilac/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_somali:{ walk:'assets/pets/cat/cat_somali/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_leopardcat:{ walk:'assets/pets/cat/cat_leopardcat/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      cat_lynx:{ walk:'assets/pets/cat/cat_lynx/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      cat_cheetah:{ walk:'assets/pets/cat/cat_cheetah/walk.png', frames:6, stills:true, scale:3, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      cat_jaguar:{ walk:'assets/pets/cat/cat_jaguar/walk.png', frames:8, stills:true, scale:3.4, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      cat_puma:{ walk:'assets/pets/cat/cat_puma/walk.png', frames:8, stills:true, scale:3.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      cat_snowleopard:{ walk:'assets/pets/cat/cat_snowleopard/walk.png', frames:8, stills:true, scale:3, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      cat_caracal:{ walk:'assets/pets/cat/cat_caracal/walk.png', frames:8, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      cat_leopard:{ walk:'assets/pets/cat/cat_leopard/walk.png', frames:8, stills:true, scale:3, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      cat_blackpanther:{ walk:'assets/pets/cat/cat_blackpanther/walk.png', frames:8, stills:true, scale:3, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      cat_ocelot:{ walk:'assets/pets/cat/cat_ocelot/walk.png', frames:8, stills:true, scale:1.8, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      cat_sandcat:{ walk:'assets/pets/cat/cat_sandcat/walk.png', frames:6, stills:true, scale:1.1, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_mainecoonsmoke:{ walk:'assets/pets/cat/cat_mainecoonsmoke/walk.png', frames:6, stills:true, scale:1.4, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_mainecoonred:{ walk:'assets/pets/cat/cat_mainecoonred/walk.png', frames:6, stills:true, scale:1.4, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_bengalsilver:{ walk:'assets/pets/cat/cat_bengalsilver/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_peterbald:{ walk:'assets/pets/cat/cat_peterbald/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_toyger:{ walk:'assets/pets/cat/cat_toyger/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4, knead:4, paw:4, eyetrack:6, stretch:6, scratch:4, wiggle:4 } },
      cat_singapura:{ walk:'assets/pets/cat/cat_singapura/walk.png', frames:6, stills:true, scale:1.1, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_havanabrown:{ walk:'assets/pets/cat/cat_havanabrown/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_ragamuffin:{ walk:'assets/pets/cat/cat_ragamuffin/walk.png', frames:6, stills:true, scale:1.3, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } }
    };
    // @gen:end
    function hasSprite(id){ return !!PET_SPRITES[id]; }
    // 펫별 '원본' 크기 배율(고양이=1.0 기준). PET_SPRITES[id].scale 로 생성(tools/pets.json 의 scale). 예: 호랑이 4, 강아지 1.5.
    //  ⚠️ 원본(raw)은 스프라이트 자산 판정(발밑 여백 추정 등)용으로만 유지 — 화면 표시 크기는 반드시 effPetScale/petActorPx 경유.
    function petScale(id){ const sp=PET_SPRITES[id]; const s=sp&&Number(sp.scale); return (s&&s>0)?s:1; }
    // 🐘 표시 크기 압축 — 현실 배율이 클수록 캠에서 덩치가 과해 보여, "클수록 점진적으로 더" 줄인다(작을수록 적게, 임계 없이 전 구간 연속).
    //  + 같은 크기라도 등급이 낮을수록 더 작게 — 초과분(raw-1)에 등급계수 tf(일반 하한~한정 1.0)를 곱해 '큰 펫에 차이가 집중'되게 한다.
    //  공식: e=raw-1(1.0 최소가 기준점), 압축초과=e/(1+e·BEND)(e가 클수록 감소폭↑=작을수록 적게), disp=1+압축초과×tf. raw≤1은 그대로.
    //  단일 소스: 캠 3무대·10연·뽑기 등장·PiP 어디서나 petActorPx(및 fx 등장 크기)가 이 함수를 탄다. 수치만 바꾸면 전역 반영.
    const PET_SIZE_BEND = 0.24;    // 압축 강도(↑=큰 펫이 더 작아짐). 현재 '약하게'(호랑이 4.0→약2.7, -32%)
    const PET_SIZE_TFMIN = 0.85;   // 등급계수 하한(일반). 상한 1.0(한정). ↓=저등급이 더 작아짐(완만)
    function effPetScale(id){
      const raw = petScale(id);
      if(!(raw > 1)) return raw;   // 최소 크기(≤1.0)=기준점, 그대로
      const tm = (typeof effCatTier==='function') ? effCatTier() : ((typeof CAT_TIER!=='undefined') ? CAT_TIER : {});
      const tier = (tm && tm[id]) || 'normal';
      const N = (typeof TIER_ORDER!=='undefined' && TIER_ORDER.length) ? TIER_ORDER.length : 7;   // 7등급(일반~한정)
      const rank = (typeof tierRank==='function') ? tierRank(tier) : 0;
      const tf = PET_SIZE_TFMIN + (1 - PET_SIZE_TFMIN) * (rank / Math.max(1, N - 1));
      const e = raw - 1;
      return 1 + (e / (1 + e * PET_SIZE_BEND)) * tf;
    }
    // 걷는 무대(dock 방·홈 방)에서 실제 렌더 높이(px). base=고양이 기준, cap=무대에 맞춘 상한(큰 동물도 방 밖으로 안 나가게), floor=최소.
    //  표시 배율은 effPetScale(압축·등급차등) 사용 — 원본 petScale 아님.
    function petActorPx(id, base, cap){ const raw=base*effPetScale(id); const lo=Math.round(base*0.55); return Math.max(lo, Math.min(Math.round(raw), cap)); }
    // ── 🎞️ 다중 모션 클립(PixelLab 프리셋) — 클립 레지스트리(단일 소스) ─────────────────────
    // 걷기 시트 1장 → 클립 N장으로 확장하되 재생기는 기존 필름(.csprf, --sheet/--fw/steps)을 그대로 재사용한다.
    // 클립 시트 = 가로 스트립 1장(방향은 1개만 취득): 이동·눕기 계열(run·jump·sleep)=east(서쪽은 scaleX(-1) 플립),
    // 정지/활동 계열(idle·sit·belly·eat·drink·yawn·angry)=south(정면). (lick 그루밍은 폐기 — 2026-07.)
    //  · 정적 펫: 걷기와 같은 폴더의 `<클립키>.png`(예: assets/pets/cat/cat_black/idle.png), 프레임 수는 PET_SPRITES[id].clips[키].
    //  · 런타임 펫: catalogPets/{id}.clips(프레임 메타) + catalogPetArt/{id}.clips(data URL, ensurePetArt 지연 로드).
    // fb=폴백 체인 — 클립이 없으면 순서대로 강등: 'walk'=기존 걷기 필름, 체인 소진(null)=기존 정지 스틸.
    // 즉 클립이 하나도 없는 펫은 현행 동작과 100% 동일(하위호환). once=1회 재생(+hold=마지막 프레임 유지 —
    // '앉기'처럼 전환 후 그 자세로 머무는 클립), fps=재생 속도(프레임/초).
    const PET_CLIPS = {
      run:   { dir:'east',  fps:12, fb:['walk'] },
      jump:  { dir:'east',  fps:10, once:true },
      idle:  { dir:'south', fps:6 },
      sit:   { dir:'south', fps:8, once:true, hold:true, fb:['idle'] },
      belly: { dir:'south', fps:6, fb:['sit','idle'] },
      eat:   { dir:'south', fps:8, fb:['sit','idle'] },
      drink: { dir:'south', fps:8, fb:['eat','sit','idle'] },
      yawn:  { dir:'south', fps:7, once:true },
      angry: { dir:'south', fps:8, once:true },
      sleep: { dir:'east',  fps:4 },   // 💤 옆으로 엎드려 눈 감고 잠(느린 호흡 loop) — 미보유 펫은 폴백 null=기존 north 스틸
      // 🛋️ 가구 상호작용 6종(2026-07, 레퍼런스: Neko Atsume 상호작용 3계열·상용 팩 표준) — 애정 해금 Lv3=paw·eyetrack / Lv4=wiggle / Lv5=knead·scratch·stretch(CLIP_AFF_REQ).
      //   knead/paw/eyetrack=south(정면 자리), stretch/scratch/wiggle=east(옆모습 자리 — furnClip·actorShowStill의 east 재생 개방과 짝).
      knead:   { dir:'south', fps:6, fb:['belly','sit','idle'] },   // 🐾 꾹꾹이 — 쿠션·침대류(앞발 좌우 교대)
      paw:     { dir:'south', fps:8, fb:['sit','idle'] },           // 🐾 톡톡 — 장난감(앞발 하나 들어 톡)
      eyetrack:{ dir:'south', fps:4, fb:['sit','idle'] },           // 👀 물끄러미 — 어항·움직이는 것 응시(동공 좌우)
      stretch: { dir:'east',  fps:7, once:true },                   // 🙆 기지개(플레이보우) — 그루밍아치 도착 1회
      scratch: { dir:'east',  fps:8 },                              // 🪵 스크래칭 — 스크래처(앞다리 교대 스트로크)
      wiggle:  { dir:'east',  fps:8 }                               // 🍑 실룩 — 터널(도약 준비 웅크림+엉덩이)
    };
    // 펫이 이 클립 시트를 실제로 갖고 있나 — 정적=clips 메타(파일 존재는 파이프라인이 보장), 런타임=아트(clipUrls)까지 도착해야 true.
    // 💗 모션 애정 해금(프레스티지, 2026-07 레벨 재배치) — 🐾 전 등급 적용(2026-07 사용자 지침, 신화 미만도 동일):
    //    Lv1=기본 모션(idle·sit·eat·drink — 첫 애정에 생동감이 켜짐) · Lv2=belly·yawn(식빵·하품) · **Lv3=톡톡·물끄러미** · **Lv4=하악질·실룩** · **Lv5=꾹꾹이·스크래칭·기지개**(만렙 보상 — 2026-07 사용자 배분).
    //    Lv0(애정 없음)은 클립 없이 기존 스틸/걷기만. (등급별 임계는 affTiers라 낮은 등급이 더 빨리 Lv1에 도달 — 신화보다 관대.)
    //    친구 방 등 "내가 소유하지 않은" 펫은 애정 정보가 없어 잠금으로 취급(비소유자가 더 많이 보는 역전 방지).
    const CLIP_AFF_REQ={ idle:1, sit:1, eat:1, drink:1, belly:2, yawn:2, paw:3, eyetrack:3, angry:4, wiggle:4, knead:5, scratch:5, stretch:5 };
    function clipAffLocked(id, clip){ const req=CLIP_AFF_REQ[clip]; if(!req) return false;
      const t=CAT_TIER[id]||'normal';   // 💗 전 등급 게이트 — 예전엔 신화/한정만 잠갔으나 사용자 지침으로 전 등급 애정 해금
      // 💗 친구 방(#frStage 열림)에선 친구 스냅샷의 애정 레벨로 판정 — 친구의 Lv4 펫은 하악질까지, Lv0 펫은 내 보유와 무관하게 잠금.
      //    (한계: 친구 시트가 열린 동안엔 뒤 dock의 같은 id 펫도 친구 기준을 따름 — 시트가 화면을 덮어 실해 없음. 시트 닫히면 frStage 미노출로 자동 복귀.)
      try{ const fr=state._frPetLv; const sh=$('sheet');
        if(fr && Object.prototype.hasOwnProperty.call(fr, id) && sh && sh.classList.contains('on') && document.getElementById('frStage')){
          const lv=fr[id]; return (lv==null) ? true : (lv<req); } }catch(e){}
      const c=(state.game&&state.game.owned&&state.game.owned.cats&&state.game.owned.cats[id])||null;
      return affectionLevel(c?c.affection:0, t).level<req; }
    function hasClip(id, clip, ignoreAffGate){ const sp=PET_SPRITES[id]; if(!sp||!sp.clips) return false;
      const f=Number(sp.clips[clip]); if(!(f>=2)) return false;
      if(!ignoreAffGate && clipAffLocked(id, clip)) return false;   // 💗 애정 미달 → 미보유 취급(resolveClip 폴백 체인이 스틸/포즈로 강등). 개발자 모션 관리만 우회.
      return sp.runtime ? !!(sp.clipUrls&&sp.clipUrls[clip]) : true; }
    function sprClipUrl(id, clip){ const sp=PET_SPRITES[id];
      if(sp&&sp.clipUrls&&sp.clipUrls[clip]) return sp.clipUrls[clip];
      return assetUrl(sprStills(id)+'/'+clip+'.png'); }
    // 클립 해석(+폴백 강등): {key,url,frames,once,hold,dur(초)} | {key:'walk'}(기존 걷기 필름으로) | null(기존 정지 스틸로).
    function resolveClip(id, clip, ignoreAffGate){ const def=PET_CLIPS[clip]; if(!def) return null;
      const cand=[clip].concat(def.fb||[]);
      for(let i=0;i<cand.length;i++){ const k=cand[i];
        if(k==='walk') return { key:'walk' };
        const d=PET_CLIPS[k];
        if(d && hasClip(id,k,ignoreAffGate)){ const f=Number(PET_SPRITES[id].clips[k]);
          return { key:k, url:sprClipUrl(id,k), frames:f, once:!!d.once, hold:!!d.hold, dur:f/d.fps }; } }
      return null; }
    // 걷기 무대 액터 1개의 내부 마크업 — 시트 있으면 스프라이트 div, 없으면 SVG 프레임0.
    // reduced-motion이면 처음부터 정지 이미지(south=앞)로 고정.
    function catActorHTML(id, h, dye){
      const sp=PET_SPRITES[id];
      const df=dyeFilterCss((dye!=null)?dye:petDyeOf(id));   // 🎨 염색 필터(카탈로그 id·legacy 숫자 공용) — 친구 캠은 스냅샷 dye를 명시 전달(내 소유와 무관, 0=미염색 유지)
      if(sp){ ensurePetArt(id); if(sp.runtime && !sp.urls) return _petPlaceholder(Math.round(h));   // 아트 지연 로딩 중이면 도트 알
        const s=Math.round(h); const rm=reducedMotion(); const fw=sp.frontWalk;
        // frontWalk 고양이는 walk.png가 정면이라 걷기 시트를 애니메이션하지 않고 항상 정지 스틸(.idle)로 둔다.
        //  - 이동 중엔 east(옆) 스틸을 보여주고 scaleX로 방향을 뒤집음, 정지/reduced-motion이면 south(정면).
        const idleOn = rm || fw;
        const face = (fw && !rm) ? 'east' : 'south';
        return '<div class="cspr'+(idleOn?' idle':'')+'" style="width:'+s+'px;height:'+s+'px;--sheet:url('+sprWalkUrl(sp)+');--idle:url('+sprStill(id,face)+');--fw:'+(s*sp.frames)+'px;'+(df?'filter:'+df+';':'')+'"><i class="csprf" style="animation-timing-function:steps('+(sp.frames||6)+')"></i></div>'; }
      return catSide(id, 0, {h:h});
    }
    // 정면 썸네일(걷지 않는 표시용: 알뜰샵 카드·보유 칩·뽑기 결과 등).
    // 스프라이트 고양이는 south(정면) PNG, 없으면 SVG 매트릭스로 자동 분기.
    // ★ 고양이를 추가/수정할 땐 정면 표시는 반드시 catFace를 거쳐야 dock·방·알뜰샵·보유목록·뽑기 어디서나 같은 아트가 나온다.
    function catFace(id, opt){ opt=opt||{}; const h=opt.h||48;
      if(hasSprite(id)){ const sp=PET_SPRITES[id]; ensurePetArt(id); const s=Math.round(h);
        if(sp.runtime && !sp.urls) return _petPlaceholder(s);   // 아트 지연 로딩 중이면 도트 알
        // opt.eager=즉시 로딩(뽑기 등장처럼 '바로 보여야' 하는 곳). 기본은 lazy(카드·그리드 성능). lazy면 갓 삽입된 이미지를 브라우저가 늦게 불러 등장이 ~1초 지연됨.
        const df=dyeFilterCss(petDyeOf(id));   // 🎨 염색 필터 — 썸네일(펫 그리드·도감·리빌)에도 동일 반영
        return '<img class="catpx" src="'+sprStill(id,'south')+'" alt="" width="'+s+'" height="'+s+'"'+(df?' style="filter:'+df+'"':'')+(opt.eager?' decoding="sync"':' loading="lazy"')+'>'; }
      return catFront(id, opt); }
    const POSE_M = { sit:M_CAT_SIT, loaf:M_CAT_LOAF, sleep:M_CAT_SLEEP };
    function catPose(id, pose, opt){ return pxSvg(POSE_M[pose]||M_CAT_SIDE_A, catPal(id), opt); }
    function coinSvg(opt){ return pxSvg(M_COIN, COIN_PAL, opt); }
    function cheeseCatSvg(opt){ return pxSvg(M_CHEESECAT, CHEESECAT_PAL, opt); }   // 🧀 치즈냥이 얼굴(거래 카테고리 아이콘 선택지)
    function goldSvg(opt){ return pxSvg(M_COIN, GOLD_PAL, opt); }
    // 🌈 무지개 동전(금화와 동형, 색만 무지개) — 테두리 강한 무지개(S/D)+안쪽 은은한 무지개(A), 눈·코는 유지. 랜덤박스 뽑기 연출에서 알 주변에 둥둥.
    const RBCOIN_PAL={X:'#4a3a6a',S:'RAINBOW',D:'RAINBOW',A:'RAINBOW2',E:'#2a2036',P:'#ff9ec2'};
    function rainbowCoinSvg(opt){ return pxSvg(M_COIN, RBCOIN_PAL, opt); }
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
    function boxSvg(opt){ return _pkV2? pxSvg(M_BOX2, BOX2_PAL, opt) : pxSvg(M_BOX, BOX_PAL, opt); }   // _pkV2 배너=나무 보물상자+삼색이 얼굴(M_BOX2), 라이브=물음표 파스텔 박스
    // 무지개알/무지개박스 — 기존 알/상자 도트에 움직이는 무지개 채색(반짝임은 CSS .fx-rainbow/.rb-thumb).
    function rainbowEggSvg(opt){ return pxSvg(M_EGG, EGG_PAL_RB, opt); }
    function rainbowBoxSvg(opt){ return _pkV2? pxSvg(M_BOX2, BOX2_RB_PAL, opt) : pxSvg(M_BOX, BOX_PAL_RB, opt); }   // v2(상시)=파스텔 무지개 나무상자+무지개 얼굴(M_BOX2) — 아이템 이미지·랜덤박스 승급 연출 공용
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
    const M_DDEUL=[   // 🥚 뜰알(24×31) — 둥근 계란형(4톤 명암 I·W·S·D + X외곽). 검은 고양이: 귀는 '위로' 향한 둥근 돔형+안쪽귀 음영 H, 눈은 회색 1px(E, 안쪽으로 붙임), 입은 멍때리며 벌린 4px(윗입술 P·안쪽 어둠 Q·양옆 음영 q). 하단+우측하단은 '실루엣까지' 흙(o/R/r/n 4톤 디더·윗단 하이라이트 o)·이끼(m/G/g 3톤, 좌상단 빛 방향 m 하이라이트)가 섞여 덮이고, 이끼는 우측을 타고 오름. 알 위 꽃 한 송이(F/f/C·Y·t/T).
      // b=태비 줄무늬·c=머즐(크림) — 뜰알 팔레트에선 몸색과 동일(안 보임), v2 펫알(EGG2_PAL)에서만 치즈태비 무늬로 드러남. 실루엣은 종전과 동일(footprint 검증, scratchpad egg2_v2.py).
      "...........fCf..........","...........CYC..........","...........fCf..........","............t...........","...........tT..........",
      "..........XXXX..........","........XXXXXXXX........",".......XXIIIIWWXX.......","......XIIIIIWWWWWX......",".....XIIIIIWWWWWWSX.....",
      "....XXIIIIWWWWWWSSXX....","....XIIIIWWWWWWSSSSX....","...XIIIIWWWWWWWSSSSSX...","...XIIIIWWWWWWSSSSSSX...","..XIIIBBBWWWWSSBBBSSSX..",
      "..XIIIBBHBWWSSBHBBSSDX..","..XIIBBBBbBBbBBbBBBDDX..","..XIWBBBBbBBbBBbBBBDDX..",".XIIWHBBBBBBBBBBBBHDDDX.",".XIWWBBBBEBBBBEBBBBDDDX.",
      "..XWWBbbBBBBBBBBbbBmGg..","..XWWBBbBBBBBBBBbBBGgg..","..XWWWBBBccPPccBBBmGGg..","..XWWWBBBcqQQqcBBBGGgg..","...XWSSBBBccccBBBGmGg...",
      "...XSSSSBBBBBBBBmGGgg...","....XSSSSSBBBBooGGgg....","....XnRoRRRRoRGgrGgg....",".....nnRorrRrrGgrgg.....","......nnrrnrrGrrgg......",
      "........nrnnngnn........"];
    const DDEUL_PAL={X:'#8d8368',D:'#d8d0bd',S:'#eae3d2',W:'#f7f3ea',I:'#fffef8',B:'#2b2b31',H:'#45454f',E:'#9a9aa4',P:'#f2a0b4',Q:'#7a3a48',q:'#b56576',R:'#9c6a3c',r:'#6f4a25',o:'#b3844e',n:'#523118',G:'#5aa63c',g:'#3f7a2c',m:'#8ed46f',F:'#f9b9d0',f:'#ef8fb4',C:'#ff9ec2',Y:'#ffe06a',t:'#4e9636',T:'#3f7a2c',b:'#2b2b31',c:'#2b2b31'};   // b/c=몸색(검정)과 동일 — 뜰알에선 무늬 안 보임
    function ddeulEggSvg(opt, flw){ return pxSvg(M_DDEUL, flw?Object.assign({},DDEUL_PAL,flw):DDEUL_PAL, opt); }   // flw={C,F,f} 주면 꽃잎 색만 교체
    // 🌸 뜰알 FX 분리 렌더 — 오픈 연출에서 '꽃'과 '알 몸통'을 따로 그려, 알이 흔들릴 때 꽃이 줄기에서 더 크게 흔들리게(CSS .fx-ddflower). 몸통=꽃 뺀 알(M_DDEUL 5행부터).
    const M_DDEUL_FLW=[".fCf.",".CYC.",".fCf.","..t..","..T.."];
    const M_DDEUL_BODY=M_DDEUL.slice(5);
    // 🌸 뜰알 꽃 색 랜덤 팔레트 — 꽃잎만 바꿈([C 메인·F 밝은·f 어두운], 중심 Y=노랑·줄기 t/T=초록은 유지). 10연차에서 알마다 다양하게.
    const DDEUL_FLW_COLS=[
      {C:'#ff9ec2',F:'#f9b9d0',f:'#ef8fb4'},   // 핑크(기본)
      {C:'#c49ae8',F:'#dcc4f2',f:'#a878d8'},   // 보라
      {C:'#8fb8f0',F:'#b9d2f7',f:'#6f9be8'},   // 파랑
      {C:'#f27a7a',F:'#f7a9a9',f:'#e85f5f'},   // 빨강
      {C:'#f5b06a',F:'#f7c894',f:'#e89a4a'},   // 주황
      {C:'#7ed6b0',F:'#a8e6cf',f:'#5cc298'},   // 민트
      {C:'#f5f0f8',F:'#ffffff',f:'#dcd6e6'}    // 흰색
    ];
    function randDdeulFlower(){ return DDEUL_FLW_COLS[Math.floor(Math.random()*DDEUL_FLW_COLS.length)]; }
    // 🌈 나비(반딧불·단풍잎) 연출 시 꽃을 '무지개색'으로(랜덤색 대신). 이 객체는 'flw=무지개' 센티넬 겸, 열린 정적 알(ddeulEggSvg)의 꽃 그라디언트용으로 유지.
    const DDEUL_FLW_RB={C:'RAINBOW',f:'RAINBOW',Y:'RAINBOW'};
    // 🌈🌸 무지개 꽃 전용 매트릭스 — 8장 꽃잎을 빙 둘러 각각 다른 무지개색(색 바퀴)으로. 크기·줄기 위치는 M_DDEUL_FLW와 동일(5×5, 줄기 col2)이라 몸통 정렬 그대로.
    const M_DDEUL_FLW_RB=[".ABC.",".HYD.",".GFE.","..t..","..T.."];
    const DDEUL_FLW_RB_PAL={A:'#f0445a',B:'#f5883c',C:'#f2c84b',D:'#38c172',E:'#22c3b0',F:'#3182f6',G:'#6c5ce0',H:'#c56ad6',Y:'#ffe06a',t:'#4e9636',T:'#3f7a2c'};   // 좌상→시계방향 빨·주·노·초·청록·파·남·보 + 중심 노랑·줄기 초록
    function ddeulFlwRbSvg(opt){ return pxSvg(M_DDEUL_FLW_RB, DDEUL_FLW_RB_PAL, opt); }
    // 컨테이너 안의 .fx-ddflower를 무지개 꽃(색 바퀴)으로 재렌더 + 클래스 표식. 뜰알(꽃 있음)이 아니면 no-op. 바꿨으면 true.
    // 🌱 v2 펫알(fx-ddspr=새싹)이면 무지개 '새싹'(색바퀴)으로 + 커진 상태(ddflw-fix) — 뜰알 꽃과 같은 조건·타이밍 공유.
    function ddeulFlowerRb(container){ const fl=container&&container.querySelector&&container.querySelector('.fx-ddflower'); if(!fl) return false;
      fl.classList.add('ddflw-rb');
      if(fl.classList.contains('fx-ddspr')){ fl.innerHTML=egg2SprRbSvg(); fl.classList.add('ddflw-fix'); }
      else fl.innerHTML=ddeulFlwRbSvg();
      return true; }
    // flw={C,F,f} 주면 꽃잎 색만 교체(몸통·중심·줄기 유지). flw===DDEUL_FLW_RB면 무지개 색바퀴 꽃. 안 주면 기본 핑크.
    function ddeulFxHtml(flw){ const rb=(flw===DDEUL_FLW_RB); const pal=(flw&&!rb)?Object.assign({},DDEUL_PAL,flw):DDEUL_PAL;
      const flwSvg=rb?ddeulFlwRbSvg():pxSvg(M_DDEUL_FLW, pal);
      return '<span class="fx-ddflower'+(rb?' ddflw-rb':'')+'">'+flwSvg+'</span><span class="fx-ddbody">'+pxSvg(M_DDEUL_BODY, pal)+'</span>'; }
    // ===== 🥚 v2 기본 펫알(개발자 '배너 관리' 미리보기 전용, _pkV2 게이트) — 뜰알 복사: 꽃→새싹·검은고양이→치즈태비(색만)·흙 황토·이끼 연두 =====
    // PIL 라이트/다크 검수 완료(scratchpad egg2_check.py). 라이브 반영 시 eggSvg 계열 교체 예정.
    const M_EGG2_SPR=["LL.Vv","LLtVv",".LtV.","..t..","..T.."];   // 🌱 새싹(5×5, 줄기 col2 — M_DDEUL_FLW와 동일 규격이라 몸통 정렬 그대로)
    // 🐱 치즈태비 전용 몸통 — 뜰알 알부분(M_DDEUL) 그대로에 얼굴만: 코 제거 + 중앙 ω 입(q). 이마 태비 줄무늬·볼 명암(b)·크림 머즐(c, 컴팩트)·눈(E)은 뜰알 몸통 구조 유지. 하단=마른 황토(o/R/r/n)+황토 머금은 올리브 이끼(m/G/g)는 뜰알 패턴을 EGG2_PAL 색으로. (뜰알 자체는 M_DDEUL로 그대로, 여긴 코 없는 ω 입만 다름)
    const M_EGG2_BODY=[
      "..........XXXX..........","........XXXXXXXX........",".......XXIIIIWWXX.......","......XIIIIIWWWWWX......",".....XIIIIIWWWWWWSX.....",
      "....XXIIIIWWWWWWSSXX....","....XIIIIWWWWWWSSSSX....","...XIIIIWWWWWWWSSSSSX...","...XIIIIWWWWWWSSSSSSX...","..XIIIBBBWWWWSSBBBSSSX..",
      "..XIIIBBHBWWSSBHBBSSDX..","..XIIBBBBbBBbBBbBBBDDX..","..XIWBBBBbBBbBBbBBBDDX..",".XIIWHBBBBBBBBBBBBHDDDX.",".XIWWBBBBEBBBBEBBBBDDDX.",
      "..XWWBbbBBBBBBBBbbBmGg..","..XWWBBbBBBBBBBBbBBGgg..","..XWWWBBBcqccqcBBBmGGg..","..XWWWBBBccqqccBBBGGgg..","...XWSSBBBccccBBBGmGg...",
      "...XSSSSBBBBBBBBmGGgg...","....XSSSSSBBBBooGGgg....","....XnRoRRRRoRGgrGgg....",".....nnRorrRrrGgrgg.....","......nnrrnrrGrrgg......",
      "........nrnnngnn........"];
    const M_EGG2=[
      "..........LL.Vv.........",
      "..........LLtVv.........",
      "...........LtV..........",
      "............t...........",
      "...........tT..........."
    ].concat(M_EGG2_BODY);
    // 치즈태비(B 몸·H 안쪽귀·E 눈 + b 태비 줄무늬(이마·볼)·c 크림 머즐(넓게)·N 분홍 코·q/Q 입) + 황토 흙(R/r/o/n) + 연두 이끼(G/g/m) + 초록 새싹(L/V/v)
    const EGG2_PAL=Object.assign({},DDEUL_PAL,{B:'#ef9f42',H:'#d47f2b',E:'#43290f',b:'#c9701f',c:'#fbe9c8',o:'#dbb56b',R:'#c39a55',r:'#9c7539',n:'#6f5026',m:'#c2cd72',G:'#93a049',g:'#68732f',L:'#a5e26b',V:'#58b840',v:'#3f8a2f'});   // 흙=마른 황토 4톤(o·R·r·n), 이끼=황토 머금은 올리브 3톤(m·G·g)
    function egg2Svg(opt){ return pxSvg(M_EGG2, EGG2_PAL, opt); }
    // 🌈 무지개 새싹(색바퀴) — 왼잎 빨·주+노, 오른잎 초·파+보. 무지개 발동 조건(rbUpgradeChance) 시 새싹이 커지며 이 색으로.
    const M_EGG2_SPR_RB=["AB.DE","ABtDE",".CtF.","..t..","..T.."];
    const EGG2_SPR_RB_PAL={A:'#f0445a',B:'#f5883c',C:'#f2c84b',D:'#38c172',E:'#3182f6',F:'#9b6fc8',t:'#4e9636',T:'#3f7a2c'};
    function egg2SprRbSvg(opt){ return pxSvg(M_EGG2_SPR_RB, EGG2_SPR_RB_PAL, opt); }
    // v2 펫알 FX 분리 렌더(뜰알 ddeulFxHtml과 동일 구조 — 새싹+몸통, 탭 시 새싹이 줄기에서 팔랑). sprRb=true면 무지개 새싹(커진 상태 유지 ddflw-fix).
    function egg2FxHtml(sprRb){
      const spr=sprRb?egg2SprRbSvg():pxSvg(M_EGG2_SPR, EGG2_PAL);
      return '<span class="fx-ddflower fx-ddspr'+(sprRb?' ddflw-rb ddflw-fix':'')+'">'+spr+'</span><span class="fx-ddbody">'+pxSvg(M_EGG2_BODY, EGG2_PAL)+'</span>'; }
    // ===== 🌈 v2 무지개알(개발자 '배너 관리' 미리보기 전용) — 뜰알 복사: 고양이 검은색→무지개 채색(눈·입 유지)·꽃→커진 무지개 색바퀴 꽃 =====
    // 흙·이끼 = 🌟 금빛 찬란 명암(복구, 사용자 지침): 흙 4톤(o 하이라이트~n 깊은그림자)을 금가루 톤으로, 이끼 3톤(m/G/g)은 금빛 도는 올리브그린+금 글린트로 — 무지개 몸통과 어울리는 보물 느낌. PIL 라이트/다크 검수(scratchpad rbegg_gold.py).
    const EGG2_RB_PAL=Object.assign({},DDEUL_PAL,{B:'RAINBOW',H:'RAINBOW',b:'RAINBOW',c:'RAINBOW',
      o:'#ffe897',R:'#eec455',r:'#c0902c',n:'#8a5e16',m:'#f6e388',G:'#b6c23e',g:'#7d8f22'});   // 껍질·눈·입은 뜰알 그대로(줄무늬 b·머즐 c는 무지개에 녹임)
    const EGG2_RB2_PAL=Object.assign({},EGG2_RB_PAL,{I:'RAINBOW2',W:'RAINBOW2',S:'RAINBOW2',D:'RAINBOW2',E:'#3a2410'});   // 껍질=은은한 파스텔 무지개, 눈=진하게(금빛 흙·이끼는 EGG2_RB_PAL에서 상속)
    function rbEgg2FxHtml(){ return '<span class="fx-ddflower ddflw-rb ddflw-fix">'+ddeulFlwRbSvg()+'</span><span class="fx-ddbody">'+pxSvg(M_DDEUL_BODY, EGG2_RB_PAL)+'</span>'; }
    // 정적 무지개알 이미지(배너 아이템 등) — 무지개 고양이알 몸통 + 커진 무지개꽃. noFx=true면 오오라·트윙클 없이 꽃+몸통만(배너 데코용). h=몸통 높이(px).
    function rbEgg2Html(h, noFx){ h=h||52; const fh=Math.round(h*0.30);   // 꽃 5행(몸통 대비 19%)×1.55 ≈ 30%
      let fx='';
      if(!noFx){ let tw=''; for(let i=0;i<4;i++){ const a=(i/4)*360+28+Math.random()*20, d=h*(0.52+Math.random()*0.22);
          const x=Math.round(Math.cos(a*Math.PI/180)*d), y=Math.round(Math.sin(a*Math.PI/180)*d*0.9);
          tw+='<span class="fx-tw" style="--tx:'+x+'px;--ty:'+y+'px;animation-delay:'+(Math.random()*1.1).toFixed(2)+'s;animation-duration:'+(1.1+Math.random()*0.7).toFixed(2)+'s">'+spark4Svg('RAINBOW',{h:9+Math.round(Math.random()*4)})+'</span>'; }
        fx='<span class="rbegg2-fx"><span class="rbegg2-aura">'+auraSvg('RAINBOW',{h:Math.round(h*1.3)})+'</span>'+tw+'</span>'; }
      return '<span class="rbegg2">'+fx+
        '<span class="rbegg2-flw">'+ddeulFlwRbSvg({h:fh})+'</span>'+pxSvg(M_DDEUL_BODY, EGG2_RB2_PAL, {h:h})+'</span>'; }   // 흙·이끼 복구(금빛 명암) + 은은한 파스텔 무지개 껍질
    // 🌈 무지개알 '아이템 이미지'(라이브 공용 — 무지개 탭 카드·가방·쿠폰·지급 등) — 새 무지개알(꽃+몸통, 오오라 없음)을 전체 높이 h에 맞춰 렌더(꽃 포함 총높이≈h).
    function rainbowEggImg(h){ return rbEgg2Html(Math.round((h||52)*0.77), true); }
    // 🌸 v2 무지개알 오픈(전설↑ 결과): 꽃이 뚝 떨어지고(ddflw-drop) 알 주변으로 무지개 꽃 6개가 흩날림. it=알 요소·st=흩날림 부착 무대·small=10뽑 알 스케일.
    function rbFlowerDropFx(it, st, small){
      const fl=it&&it.querySelector&&it.querySelector('.fx-ddflower'); if(fl) fl.classList.add('ddflw-drop');
      if(!st) return; const n=6; let s='';
      for(let i=0;i<n;i++){ const ang=((i+0.25+Math.random()*0.5)/n)*Math.PI*2;   // 섹터 분산(뭉침 방지)
        const R=small?(24+Math.random()*18):(64+Math.random()*58);
        const fxx=Math.round(Math.cos(ang)*R), fyy=Math.round(Math.abs(Math.sin(ang))*R*0.6+(small?24:66)+Math.random()*(small?14:38));
        const hh=small?(8+Math.round(Math.random()*3)):(15+Math.round(Math.random()*6));
        const dur=(1.1+Math.random()*0.6).toFixed(2), del=(Math.random()*0.18).toFixed(2), rot=Math.round(120+Math.random()*160)*(i%2?1:-1);
        s+='<span class="fx-rbfl" style="--fx:'+fxx+'px;--fy:'+fyy+'px;--fr:'+rot+'deg;animation-delay:'+del+'s;animation-duration:'+dur+'s"><span class="rbfl-in" style="animation-delay:'+(-Math.random()*0.5).toFixed(2)+'s">'+ddeulFlwRbSvg({h:hh})+'</span></span>'; }
      st.insertAdjacentHTML('beforeend','<span class="fx-rbfls" aria-hidden="true">'+s+'</span>');
    }
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
    function fxAuraTwinkles(n, rainbow){ n=fxCount(n||6); let s=''; const cc=rainbow?'RAINBOW':'currentColor';
      for(let i=0;i<n;i++){ const a=(i/n)*360+Math.random()*24, d=52+Math.random()*30;
        const x=Math.round(Math.cos(a*Math.PI/180)*d), y=Math.round(Math.sin(a*Math.PI/180)*d);
        const h=12+Math.round(Math.random()*8), del=(Math.random()*1.1).toFixed(2), du=(1.1+Math.random()*0.7).toFixed(2);
        s+='<span class="fx-tw" style="--tx:'+x+'px;--ty:'+y+'px;animation-delay:'+del+'s;animation-duration:'+du+'s">'+spark4Svg(cc,{h:h})+'</span>'; }
      return s; }
    // 랜덤박스 오픈: 열린 나무 보물상자(닫힌 M_BOX2와 통일) — 뚜껑 젖힘+등급색 빛(Z)+보석·금화. rainbow면 무지개 나무상자(무지개박스도 v2 통일).
    function boxOpenSvg(tierColor, rainbow, opt){
      if(_pkV2){ const pal=Object.assign({}, rainbow?BOX2_RB_PAL:BOX2_PAL, BOX2_OPEN_EXTRA, {Z:tierColor||'#FBFBFD'}); return pxSvg(M_BOX2_OPEN, pal, opt); }
      const pal=Object.assign({}, rainbow?BOX_PAL_RB:BOX_PAL, {Z:tierColor||'#FBFBFD'}); return pxSvg(M_BOX_OPEN, pal, opt); }   // (_pkV2 상시 true — 구 파스텔 경로는 폴백용으로만 유지)
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
    // ===== 💗 펫 코스메틱(애정 해금 프레스티지) — 동행 버디=Lv3 · 모자=Lv5 (전 등급) =====
    // 장착 상태는 owned.cats[id].cosm={hat,buddy}(해금은 레벨 파생 — 별도 저장 없음). 렌더는 actorCosmHtml(캠 3무대+PiP).
    // 모자 도트 3종 — O외곽+3톤 음영, PIL 라이트/다크+펫 머리 합성 검수 통과(scratchpad hats.py, CLAUDE.md 검수 워크플로).
    const M_HAT_STRAW=[   // 밀짚모자: 넓은 챙+돔+빨간 리본
      '....OOOOOO....',
      '...OshhhhsO...',
      '..OshhhhhhsO..',
      '..OssssssssO..',
      '..ORRRRRRRRO..',
      'OOssssssssssOO',
      'OshsssssssshsO',
      'OOOOOOOOOOOOOO'];
    const M_HAT_BERET=[   // 베레모: 와인색 납작 베레(살짝 기울임)
      '....OO......',
      '..OObbOO....',
      '.ObhhbbbbO..',
      'ObhbbbbbbdO.',
      '.OObbbbddOO.',
      '...OOOOOO...'];
    const M_HAT_PARTY=[   // 파티모자: 민트·핑크 콘 + 노란 폼폼
      '...OppO...',
      '..OpPPpO..',
      '...OppO...',
      '....OO....',
      '...OhaO...',
      '...ObaO...',
      '..OabbaO..',
      '..ObaabO..',
      '.OaabbaaO.',
      'OOOOOOOOOO'];
    const HAT_PALS={
      straw:{ O:'#7a5a1e', s:'#e8c86a', h:'#f6e19a', R:'#c0392b' },
      beret:{ O:'#4a1830', b:'#8e2f55', h:'#b45577', d:'#6b2140' },
      party:{ O:'#3a2a55', a:'#79d6c8', b:'#ff8fb6', p:'#ffd23e', P:'#fff2a8', h:'#b9ede5' } };
    const HAT_M={ straw:M_HAT_STRAW, beret:M_HAT_BERET, party:M_HAT_PARTY };
    // 🌈 무지개꽃 펫효과 — 6장 무지개 꽃잎+노란 수술+줄기(PIL 라이트/다크 검수, scratchpad rbflower_preview). 펫 주위를 날아다님.
    const M_PETFX_RBFLOW=[
      '...rr.pp...',
      '..rrr.ppp..',
      '.orrr.pppb.',
      '.ooo.y.bbb.',
      '.oo.yYy.bb.',
      '....yyy....',
      '.gg.yYy.vv.',
      '.ggg.y.vvv.',
      '.tggg.vvvt.',
      '..gg..vv...',
      '....LL.....',
      '....L......'];
    const PETFX_RBF_PAL={ r:'#ff6b6b', o:'#ffa94d', y:'#ffd43b', Y:'#fff3bf', g:'#69db7c', b:'#4dabf7', p:'#da77f2', v:'#845ef7', t:'#3a5a40', L:'#5c8a4a' };
    function rbFlowerSvg(opt){ return pxSvg(M_PETFX_RBFLOW, PETFX_RBF_PAL, opt); }
    // 🧢 모자/✨ 펫효과 = "보유 인벤토리" 코스메틱(own-once, owned.hats/petfx) — 슬롯이 레벨로 열려도 아이템을 획득해야 장착.
    //    🌈 전부 한정(exclusive) 등급(사용자 지침) — 2026-07 무지개동전 개편으로 boxPool에 편입: 기본 랜덤박스 0.2%·무지개박스 50%로 출현(+이벤트·쿠폰·선물함·개발자 지급).
    //    카탈로그에 추가만 하면 지급·도감·장착 UI가 함께 인식(비한정 등급을 주면 그때부터 랜덤박스에 자동 편입).
    const HAT_CATALOG={ straw:'밀짚모자', beret:'베레모', party:'파티모자' };
    const HAT_TIER={ straw:'exclusive', beret:'exclusive', party:'exclusive' };
    const BUDDY_CATALOG={ butterfly:'나비', firefly:'반딧불', rainbowflower:'무지개꽃' };   // ✨ 펫효과(펫 주변을 낢) — 추후 종류 추가 예정
    const PETFX_TIER={ butterfly:'exclusive', firefly:'exclusive', rainbowflower:'exclusive' };
    function ownsHat(id){ return !!(state.game&&state.game.owned&&state.game.owned.hats&&state.game.owned.hats[id]); }
    function ownsPetfx(id){ return !!(state.game&&state.game.owned&&state.game.owned.petfx&&state.game.owned.petfx[id]); }
    function hatSvg(kind,opt){ return HAT_M[kind]?pxSvg(HAT_M[kind], HAT_PALS[kind], opt):''; }
    function petCosm(id){ const c=(state.game&&state.game.owned&&state.game.owned.cats&&state.game.owned.cats[id])||null; const m=c&&c.cosm; return (m&&typeof m==='object')?m:{}; }
    function cosmSig(id){ const m=petCosm(id); return (m.hat||'')+'.'+(m.buddy||'')+'.'+petDyeOf(id); }   // 액터 재생성 서명(dock·홈·PiP) — 장착·염색 변경 시 무대 리빌드
    function buddySvgOf(kind,opt){ return kind==='firefly'?fireflySvg(opt):(kind==='rainbowflower'?rbFlowerSvg(opt):butterflySvg(null,opt)); }
    // 액터 코스메틱 오버레이(+친구 캠 애정 하트 배지). meta={cosm,lv}=친구 homeCam 스냅샷(petsMeta), 미전달=내 소유(petCosm).
    // 모자·버디는 --hp(머리 위 여백 %, measureHeadPad가 buildActors에서 실측 주입)에 앵커. hasSprite 펫만(SVG 폴백 펫 제외).
    function actorCosmHtml(id, s, meta){
      const cosm=meta?((meta.cosm&&typeof meta.cosm==='object')?meta.cosm:{}):petCosm(id);
      let h='';
      if(cosm.hat&&HAT_M[cosm.hat]) h+='<span class="cd-hat"><i class="hatbob">'+hatSvg(cosm.hat,{h:Math.max(4,Math.round(s*0.11))})+'</i></span>';   // 🎩 모자 크기 = 펫 렌더높이×0.11(펫 크기 비례 유지·더 작게 — 0.30→0.20→0.13→0.11). .hatbob=숨쉬기 동조 래퍼(csprBreath에 맞춰 위아래 따라감)
      if(BUDDY_CATALOG[cosm.buddy]) h+='<span class="cd-buddy cb-'+cosm.buddy+'"><i class="cb-path"><i class="cb-bob">'+buddySvgOf(cosm.buddy,{h:(cosm.buddy==='firefly'?7:8)})+'</i></i></span>';   // ✨ 펫효과(버디) 크기 = 고정(firefly7·기타8, 펫 스케일 무관 — 사용자 지침: 큰 펫에서 같이 커지지 않게). 모자는 펫비례 유지, 깊이 원근은 .cd-actor 상속
      if(meta&&Number(meta.lv)>=3) h+='<span class="cd-afflv">'+heartSvg({h:8})+'Lv'+Number(meta.lv)+'</span>';   // 친구 캠: Lv3+ 애정 과시 배지
      return h;
    }
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
    // ⭐ 별 v2 — 둥글고 통통한(둥근 팁) 5각 입체 별: X외곽선·B몸체(무지개)·H하이라이트·D아랫녘 음영. 모든 별 사용처(대표 방·쓰다듬기 파티클·배너 배지·밤 씬) 공용. PIL 라이트/다크/OFF/밤 검수.
    const M_STAR = [
      '......XXX......',
      '.....XBBBX.....',
      '.....XBBBX.....',
      '.XXXXBBBBBXXXX.',
      'XBBBBHHBBBBBBBX',
      '.XBBBHBBBBBBBX.',
      '..XBBBBBBBBBX..',
      '..XBBBBBBBBBX..',
      '..XBBDDDDDBBX..',
      '..XBBBX.XBBBX..',
      '.XBBBX...XBBBX.',
      '.XDDX.....XDDX.',
      '..XX.......XX..'
    ];
    const STAR_PAL={X:'#4a3a5e',B:'RAINBOW',H:'#ffffff',D:'#9b6fc8'}, STAR_PAL_OFF={X:'#969ca6',B:'#c4cad3',H:'#e8ecf1',D:'#a8afba'};   // 기본=무지개 몸체(움직이는 그라디언트), off=회색(대표 방 미지정)
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
    // 🖥️ PiP(항상 위 미니 창) 아이콘 — 모니터 프레임 + 우하단으로 겹친 밝은 작은 창(16×14, 3~4톤 음영+외곽선). PIL 라이트/다크 검수 완료. dock 캠 PiP 버튼용.
    const M_PIP = [
      '................',
      '.KKKKKKKKKKKKKK.',
      '.KHHHHHHHHHHHBK.',
      '.KHBBBBBBBBBBBK.',
      '.KHBBBBBBBBBBBK.',
      '.KHBBBBBBBBBBBK.',
      '.KHBBBBBBBBBBBK.',
      '.KHBBBKKKKKKKBK.',
      '.KHBBBKAAAAAWKK.',
      '.KHBBBKAAAAAWK..',
      '.KHBBBKAAAAAWK..',
      '.KSBBBKWWWWWWK..',
      '.KKKKKKKKKKKKK..',
      '................'
    ];
    const PIP_PAL={K:'#4a5160',B:'#7c8698',H:'#aeb6c4',S:'#5f6875',A:'#e8ecf2',W:'#c3cad6'};
    function pipSvg(opt){ return pxSvg(M_PIP, PIP_PAL, opt); }
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
    const CLOUD_PALS={w:{W:'#ffffff',H:'#eef6ff',S:'#d3e4f3',D:'#bcd3e8'},p:{W:'#fff2f8',H:'#ffe9f2',S:'#f2cfe0',D:'#e2b6d0'},b:{W:'#f0f8ff',H:'#e4f1ff',S:'#cfe2f5',D:'#b9d0ea'},
      so:{W:'#ffd9a8',H:'#ffc286',S:'#f0a25e',D:'#dd8c4c'},sp:{W:'#ffc6cf',H:'#ff9fb0',S:'#e77e97',D:'#d66a86'},sv:{W:'#dcc2ea',H:'#c6a4dc',S:'#a888c6',D:'#9678b6'}};   // 🌇 노을에 비친 구름(주황·분홍·보라) — D=v2 밑그늘
    function cloudSvg(which,tint,opt){ const A=_pkV2?[M2_CLOUD1,M2_CLOUD2,M2_CLOUD3]:[M_CLOUD1,M_CLOUD2,M_CLOUD3]; return pxSvg(A[which]||A[0], CLOUD_PALS[tint||'w'], opt); }
    // 활엽수: 둥근 캐노피(H하이라이트/L기본/l중간/D그림자/X외곽, 클럼프 음영) + 트렁크(T/w/t 나뭇결) 분리(캐노피만 바람에 살랑)
    const M_TREETOP=["....HHH......","..HHLLLHH....",".HLLLLLLLH...","HLLLLLLlLLH..","HLLHLLLllLDH.","HLLLLLllllLDH",".HLLLlllllDDH",".HLLLllllDDD.","..HLLllDDDD..","...XLllDDX...","....XXDX....."];
    const M_TRUNK=[".TTt.",".Twt.",".Twt.","TTwtt"];
    const TREE_PAL={T:'#6e4426',w:'#875733',t:'#543216',L:'#5bb85b',l:'#4a9f4a',H:'#86d67f',D:'#2f7a38',X:'#245c2c'};
    // 침엽수(3단 삼각) — 눈빛 하이라이트(H)+음영(l/D)+나뭇결 기둥. 원근 뒤쪽용
    const M_PINE=["....H....","...HLD...","...LLl...","..HLLLD..","..LLLll..",".HLLLLlD.",".LLLLlll.","HLLLLLllD","LLLLLllll","..LLll...","...TT....","...Tt...."];
    const PINE_PAL={H:'#8fe08a',L:'#4aa85a',l:'#347a44',D:'#245c34',T:'#6e4426',t:'#543216'};
    function treeTopSvg(opt){ return pxSvg(_pkV2?M2_TREETOP:M_TREETOP, TREE_PAL, opt); }
    function trunkSvg(opt){ return pxSvg(_pkV2?M2_TRUNK:M_TRUNK, TREE_PAL, opt); }
    function pineSvg(opt){ return pxSvg(_pkV2?M2_PINE:M_PINE, PINE_PAL, opt); }
    const M_FLOWER=[".P.P.","PCPCP",".PCP.","..S..",".S.S."];
    const FLOWER_PALS={r:{S:'#3f9a45',P:'#ff5d6c',C:'#ffd84a',d:'#e04355'},y:{S:'#3f9a45',P:'#ffd84a',C:'#ff8a3c',d:'#e0b833'},p:{S:'#3f9a45',P:'#c77dff',C:'#ffe98f',d:'#a95fe0'},
      su:{S:'#4c8a4e',P:'#d15fa6',C:'#ffcf7a',d:'#b04788'},sg:{S:'#4c8a4e',P:'#ff9b3c',C:'#ffe6a0',d:'#e0801f'},sw:{S:'#4c8a4e',P:'#ffe3c4',C:'#ff7a5c',d:'#eec4a4'}};   // 🌇 노을 꽃(자홍·금빛·크림) — 줄기는 살짝 어두운 초록, d=v2 꽃잎 그늘
    // v2 꽃은 줄기·잎이 생겨 매트릭스가 세로로 길어짐 → h를 1.35배 보정해 꽃머리 체감 크기를 v1과 맞춤
    function flowerSvg(tint,opt){ if(_pkV2&&opt&&opt.h){ opt=Object.assign({},opt,{h:Math.round(opt.h*1.35)}); } return pxSvg(_pkV2?M2_FLOWER:M_FLOWER, FLOWER_PALS[tint||'r'], opt); }
    const M_TUFT=["G.g.G","GgGgG","GGGGG",".ggg."];
    const TUFT_PAL={G:'#5bb85b',g:'#3f9a45',H:'#8fd47f'};
    function tuftSvg(opt){ return pxSvg(_pkV2?M2_TUFT:M_TUFT, TUFT_PAL, opt); }
    // 🦋 나비(9×7) — 큰 윗날개+좁아지는 아랫날개+어두운 몸통. 색은 tint별(주황/파랑/분홍/노랑). 배너에서 살랑살랑 날아다님(.pk-bfly).
    const M_BFLY=[".WWW.WWW.","WWWWBWWWW","WWWHBHWWW",".WWHBHWW.","..WHBHW..","..WWBWW..","...W.W..."];
    const BFLY_PALS={o:{W:'#ff9d3c',H:'#ffd27a',B:'#8a5a2c',w:'#d97a24'},b:{W:'#5aa9ff',H:'#a9d4ff',B:'#3f5a84',w:'#3d84d6'},p:{W:'#ff7fbf',H:'#ffc3e0',B:'#8a4462',w:'#e05a9c'},y:{W:'#ffd84a',H:'#fff0a8',B:'#8a6a24',w:'#e0b422'}};   // w=v2 날개 테두리 그늘
    function butterflySvg(tint,opt){ return pxSvg(_pkV2?M2_BFLY:M_BFLY, BFLY_PALS[tint||'o'], opt); }
    // 🦋 나비별 '제각각' 이동 경로 CSS 변수(fxflit 키프레임이 읽음) — 나비마다 다른 방향/거리로 흩날리게. rnd()=0~1 난수 함수(FX=Math.random 랜덤, 배너=pkRand 결정적).
    function bflyDriftVars(rnd){ const p=function(){ return Math.round((rnd()*2-1)*22); }; return '--x1:'+p()+'px;--y1:'+p()+'px;--x2:'+p()+'px;--y2:'+p()+'px;--x3:'+p()+'px;--y3:'+p()+'px'; }
    // 🪨 원근 큐 에셋(한정 픽업 배너) — 깊이에 따라 크기·바닥선을 펫과 같은 척도로 배치해 펫이 앞뒤로 움직일 때 원근을 읽히게 함. 전부 도트(crispEdges).
    // 징검다리(디딤돌): 앞→뒤 한 줄, 뒤로 갈수록 작게 → 선 원근. 펫 발밑에 깔려 거의 안 가림.
    const M_STONE=["..XXXXX..",".XLLLLLX.","XLILLMMDX","XMMMMMDDX",".XDDDDDX."];
    const STONE_PAL={X:'#6f757e',L:'#cfd4da',I:'#eef0f3',M:'#a6acb4',D:'#858b94'};
    function stoneSvg(opt){ return pxSvg(_pkV2?M2_STONE:M_STONE, STONE_PAL, opt); }
    // 중간 바위(boulder): 이끼(G/g) 얹힌 3면 음영 바위. 펫이 뒤에선 그 뒤로(가려짐), 앞에선 앞으로 지나가는 겹침(occlusion) 큐 — z를 펫과 같은 12-depth*11 척도로.
    const M_ROCK=["...gGGg....","..XXXXXX...",".XLLLLMMX..","XLLLLLMMMX.","XLLLMMMMMDX","XLMMMMMMDDX","XMMMMMDDDDX",".XMMDDDDDX.","..XXXXXXX.."];
    const ROCK_PAL={X:'#565c66',L:'#9aa2ac',M:'#7c838d',D:'#626973',G:'#6fbf46',g:'#4e9636',I:'#c6ccd4'};   // I=v2 하이라이트
    function rockSvg(opt){ return pxSvg(_pkV2?M2_ROCK:M_ROCK, ROCK_PAL, opt); }
    // 낮은 말뚝 울타리(뾰족 말뚝 3+나뭇결+2레일): 옆쪽에 앞→뒤로 작아지게 놓아 선 원근. 낮아서 펫을 덜 가림(필드=펫 뒤).
    const M_FENCE=[".T....T....T.","TWwT.TWwT.TWw","TWwT.TWwT.TWw","RRRRRRRRRRRRR","TWwT.TWwT.TWw","TWwT.TWwT.TWw","RRRRRRRRRRRRR","TWwT.TWwT.TWw","TWwT.TWwT.TWw"];
    const FENCE_PAL={T:'#5f3e22',W:'#c39a63',w:'#96703f',R:'#8a6038'};
    function fenceSvg(opt){ return pxSvg(_pkV2?M2_FENCE:M_FENCE, FENCE_PAL, opt); }
    // ===== 🍁 노을 배너 전용 에셋(단풍·고추잠자리·물고기) — 픽셀 아트 =====
    // 단풍나무: M_TREETOP 모양 재사용 + 가을 팔레트(주황→빨강 명암).
    const MAPLE_PAL={H:'#f5aa46',L:'#e86e36',l:'#d2482c',D:'#962828',X:'#601c1c'};
    function mapleSvg(opt){ return pxSvg(_pkV2?M2_TREETOP:M_TREETOP, MAPLE_PAL, opt); }
    // 🍁 단풍잎(낙엽·알 주변 연출) — 가을 주황/빨강, 아래 줄기.
    const M_LEAF=["..X.X.X..",".XyOyOyX.","XOOyOyOOX",".XOOyOOX.","XOOOyOOOX",".XrOyOrX.","..XrOrX..","...XsX...","...Xs...."];
    const LEAF_PAL={O:'#e87832',r:'#c83a2c',y:'#f8ba50',X:'#782c1c',s:'#785028'};
    // 🍁 단풍잎 색 다양화 — 잎마다 제각각(주황·빨강·금·호박·진홍·녹슨·황록·심홍). {O 메인·r 그림자·y 하이라이트}만 교체, 외곽(X)·줄기(s) 유지.
    const LEAF_COLS=[
      {O:'#e87832',r:'#c83a2c',y:'#f8ba50'},   // 주황(기본)
      {O:'#d83a2c',r:'#a82420',y:'#f07a52'},   // 빨강
      {O:'#f0a828',r:'#c07818',y:'#ffd868'},   // 금색
      {O:'#c07028',r:'#8c4418',y:'#e8a048'},   // 호박/갈색
      {O:'#c23050',r:'#901f38',y:'#e26578'},   // 진홍
      {O:'#c85820',r:'#983418',y:'#f09050'},   // 녹슨 주황
      {O:'#b0a838',r:'#7c8828',y:'#e0d868'},   // 황록(초가을)
      {O:'#b42828',r:'#801818',y:'#e05848'}    // 심홍
    ];
    function randLeafCol(){ return LEAF_COLS[Math.floor(Math.random()*LEAF_COLS.length)]; }
    function mapleLeafSvg(opt, col){ return pxSvg(_pkV2?M2_LEAF:M_LEAF, col?Object.assign({},LEAF_PAL,col):LEAF_PAL, opt); }
    // 🔁 픽셀 매트릭스 90° 시계방향 회전(무손실 전치) — 세로 스프라이트를 가로로. 상단 행→우측 열(=머리가 오른쪽).
    function rot90cw(M){ const oR=M.length, oC=M[0].length, out=[]; for(let i=0;i<oC;i++){ let s=''; for(let j=0;j<oR;j++){ s+=M[oR-1-j][i]; } out.push(s); } return out; }
    // 🍁 고추잠자리(원본=세로) → 가로로 눕힘(M_DFLY_H). R=빨강 r=진빨강 X=외곽 E=눈 W/w/v=날개(밝·그림자·맥).
    const M_DFLY=["......X......",".....XEX.....",".....XRX.....","vWWWwXRXwWWWv",".vWWwXRXwWWv.","...wwXRXww...",".vWWwXRXwWWv.","vWWWwXRXwWWWv",".....XRX.....",".....XRX.....",".....XrX.....",".....XrX.....","......r......"];
    const M_DFLY_H=rot90cw(M_DFLY);
    const DFLY_PAL={R:'#e83636',r:'#b41e1e',X:'#601414',E:'#fce060',W:'#e0ecf8',w:'#b2c6de',v:'#92a8c6'};
    function dragonflySvg(opt){ return pxSvg(_pkV2?M2_DFLY_H:M_DFLY_H, DFLY_PAL, opt); }   // 가로 잠자리
    // 🐟 물고기(koi, 옆모습·헤엄): 머리=왼쪽(눈 E), 꼬리=오른쪽. O/o=주황 W=흰배.
    const M_FISH=["....ooo.....","..oOOOOOo..o",".oOWWOOOOooo","oEOWWOOOOooo",".oOOOOOOOoo.","..ooOOOo...o"];
    const FISH_PAL={O:'#f2923a',o:'#ce6822',W:'#fff2de',E:'#261a12'};
    function fishSvg(opt){ return pxSvg(M_FISH, FISH_PAL, opt); }
    // ===== 🌙 무지개 밤 배너 전용 에셋(보름달·반딧불·밤 달빛 팔레트) — 픽셀 아트, PIL 라이트/다크 검수 =====
    // 🌕 보름달: 크림 본체(M)+하이라이트(H)+크레이터(m)+구면 그림자(d)+바깥 달무리 디더(o).
    const M_MOON=[
      "..........................",
      ".........o.o..o...........",
      "......o.ooooHHoo..........",
      "........HHHHHHHHMM........",
      "....o.oHHHHHHHHMMMM.......",
      "..o..oHHHHHHHHMMMMMM..o...",
      "...ooHHHHmHHHMMMMmMMMo....",
      "...oHHHHmmmHMMMMmmmMMMo...",
      "...HHHHmmmmmMMMMMmMMMMMo..",
      "..oHHHHHmmmMMMMMMMMMMMM...",
      "..oHHHHHHmMMMMMMMMMMMMM.o.",
      "..oHHHHHMMMMMMmmmMMMMMd.o.",
      "..HHHHHMmMMMMMmmmMMMMdddoo",
      "o.HHHHMmmmMMMMmmmMMMddddo.",
      "...HHMMMmMmmmMMMMMMddddo..",
      ".o.HMMMMMMmmmMMMMMddddd.o.",
      "..oMMMMMMMmmmMMMMdddddd...",
      "..oMMMMMMMMMMMMMdddddddo..",
      "...oMMMMMMMMMMMddddddd....",
      "....oMMMMMMMMMdddddddo....",
      ".....oMMMMMMMdddddddoo....",
      "......oMMMMMdddddddo......",
      "......ooMMMdddddddo.......",
      ".........o.odd............",
      "..........................",
      ".........................."
    ];
    const MOON_PAL={M:'#fdf6d0',H:'#fffdf0',m:'#e4d69a',d:'#d2c48e',o:'#4a5578'};
    function moonSvg(opt){ return pxSvg(M_MOON, MOON_PAL, opt); }
    // ✨ 반딧불: 발광 코어(Y·H)+헤일로(h)+몸통(g/b). 깜빡임·글로우는 CSS(.pk-fire).
    const M_FIRE=["..hHh..",".hYYYh.","hYYHYYh",".hYYYh.","..hYh..","...g...","...b..."];
    const FIRE_PAL={Y:'#f2ff9e',H:'#ffffe0',h:'#c8e86a',g:'#78963c',b:'#2a3a1a'};
    function fireflySvg(opt){ return pxSvg(_pkV2?M2_FIRE:M_FIRE, FIRE_PAL, opt); }
    // 밤·달빛 팔레트(기존 매트릭스 재사용, MAPLE_PAL 선례): 어두운 청록 그림자 + 차가운 달빛 하이라이트.
    const TREE_NIGHT={H:'#6f9b86',L:'#375f52',l:'#294a42',D:'#1c3330',X:'#0f1c1a',T:'#241b2a',w:'#352842',t:'#160f1c'};
    function nightTreeSvg(opt){ return pxSvg(_pkV2?M2_TREETOP:M_TREETOP, TREE_NIGHT, opt); }
    const PINE_NIGHT={H:'#6f9b86',L:'#375f52',l:'#294a42',D:'#1c3330',T:'#241b2a',t:'#160f1c'};
    function nightPineSvg(opt){ return pxSvg(_pkV2?M2_PINE:M_PINE, PINE_NIGHT, opt); }
    const TUFT_NIGHT={G:'#375f52',g:'#294a42',H:'#6f9b86'};
    function nightTuftSvg(opt){ return pxSvg(_pkV2?M2_TUFT:M_TUFT, TUFT_NIGHT, opt); }
    const STONE_NIGHT={X:'#2a3040',L:'#6b7490',I:'#8b94b0',M:'#4a5470',D:'#353d54'};
    function nightStoneSvg(opt){ return pxSvg(_pkV2?M2_STONE:M_STONE, STONE_NIGHT, opt); }
    const FLOWER_NIGHT={a:{S:'#2c4a42',P:'#8a5a7a',C:'#efe0f6',d:'#6f4662'},b:{S:'#2c4a42',P:'#5a7ab0',C:'#dcecf8',d:'#48619c'},c:{S:'#2c4a42',P:'#7a6ab0',C:'#e6def8',d:'#62549c'}};   // d=v2 꽃잎 그늘
    function nightFlowerSvg(tn,opt){ if(_pkV2&&opt&&opt.h){ opt=Object.assign({},opt,{h:Math.round(opt.h*1.35)}); } return pxSvg(_pkV2?M2_FLOWER:M_FLOWER, FLOWER_NIGHT[tn]||FLOWER_NIGHT.a, opt); }
    const CLOUD_NIGHT={mw:{W:'#c9d4e8',H:'#aebbd8',S:'#8a9bc0',D:'#7488ae'},mb:{W:'#b6c4de',H:'#98a9cc',S:'#7486ae',D:'#5f74a0'},md:{W:'#9fadc8',H:'#8496ba',S:'#647698',D:'#54668c'}};   // D=v2 밑그늘
    function moonCloudSvg(which,tn,opt){ const A=_pkV2?[M2_CLOUD1,M2_CLOUD2,M2_CLOUD3]:[M_CLOUD1,M_CLOUD2,M_CLOUD3]; return pxSvg(A[which]||A[0], CLOUD_NIGHT[tn]||CLOUD_NIGHT.mw, opt); }
    const STAR_NIGHT={X:'#8b94b0',B:'#cdd6ee',H:'#ffffff',D:'#aab4d2'};   // 별 v2 글자(X/B/H/D)에 맞춘 밤하늘 페일블루
    function nightStarSvg(opt){ return pxSvg(M_STAR, STAR_NIGHT, opt); }
    // ===== 🥚🌿 알뜰 메인 아이콘(egg-garden) 매트릭스(icons/egg-garden.svg 파싱) — 배너별 재색용. 그룹: 알(X D W)·고양이(B E P)·꽃(F Y)·잔디(G g)·흙(R r) =====
    const M_EGGGARDEN=[
      "...........XDDX...........",
      "..........XDWWDX..........",
      ".........XDWWWWDX.........",
      ".........XWWWWWWX.........",
      "........XWBBWWBBWX........",
      ".......XWBBBBBBBBWX.......",
      ".......XWBBBBBBBBWX.......",
      "......XWWBBEBBEBBWDX......",
      "......XWWBBBBBBBBWDX......",
      "......XWWBBBPPBBBWDX......",
      "......XWWWBBBBBBWWDX......",
      ".......XWWWBBBBWWWX.......",
      ".......XWWWWWWWWWWX.......",
      "...F....GWWGWWGWWXG...F...",
      "..FYF..GGXWWWWWWXG...FYF..",
      "...G..GGGGXXXXXXGGGG..G...",
      "....GGGGGGGGGGGGGGGGGG....",
      "..GGGGGGGGGGGGGGGGGGGGGG..",
      ".gggggggggggggggggggggggg.",
      ".RRRRRRRRRRRRRRRRRRRRRRRR.",
      "..rrrrrrrrrrrrrrrrrrrrrr.."
    ];
    // 배너별 팔레트 — 알껍질(X/D/W)+뜰(G/g/R/r)만 테마색, 고양이(B/E/P)·꽃(F/Y) 유지. 뜰알=원본.
    const EGG_DEFAULT={X:'#968c76',D:'#d2ccbe',W:'#fbfbfd',B:'#4a4f57',E:'#d6dbe1',P:'#cf8f6c',F:'#f4a6c0',Y:'#f7d154',G:'#7cc652',g:'#5aa63c',R:'#a6703f',r:'#7c5028'};
    const EGG_SUNSET=Object.assign({},EGG_DEFAULT,{X:'#9a8468',D:'#e8cfa8',W:'#fff3dc',F:'#ffb0c2',Y:'#ffdf7a',G:'#9a9c4a',g:'#7a7838',R:'#c07a3a',r:'#8a5426'});   // 노을: 알 따뜻·뜰 올리브/황토
    const EGG_NIGHT=Object.assign({},EGG_DEFAULT,{X:'#6a7a70',D:'#cfeecb',W:'#eaffe0',B:'#3a3f47',E:'#cdd6ee',P:'#a0b0d0',F:'#b0a0e0',Y:'#e0f0a0',G:'#375f52',g:'#294a42',R:'#3a3048',r:'#241b2a'});   // 야광: 알 형광크림·뜰 밤청록
    function eggGardenSvg(pal, opt){ return pxSvg(M_EGGGARDEN, pal||EGG_DEFAULT, opt); }
    // 🎏 잉어 — 원본=세로(머리 위·꼬리 아래), 가로 버전 M_KOI_H(rot90cw → 머리 오른쪽·꼬리 왼쪽). X외곽 B몸통 S반점 f지느러미. 색 변주 KOI_PALS.
    const M_KOI=["....X....","...XBX...","..XBBBX..",".XBBBBBX.",".XBSSBBX.","XBBBBBBBX","fXBBBBBXf","fXBBSSBXf",".XBBBBBX.",".XSSBBBX.",".XBBBBBX.","..XBBBX..","..XBBBX..","...XBX...","..fXBXf..",".ffX.Xff."];
    const M_KOI_H=rot90cw(M_KOI);   // 가로 잉어(머리→오른쪽). 왼쪽 보게 하려면 CSS scaleX(-1).
    const KOI_PALS={o:{X:'#8c461a',B:'#f2923a',S:'#ce6822',f:'#ffce96',W:'#fff2de'},w:{X:'#963c3c',B:'#fafafa',S:'#e24040',f:'#ffd2d2',W:'#ffffff'},g:{X:'#96781e',B:'#f6ce50',S:'#463c28',f:'#ffeeaa',W:'#fff6d8'}};   // W=v2 배(밝은 띠)
    function koiSvg(tint, opt){ return pxSvg(_pkV2?M2_KOI_H:M_KOI_H, KOI_PALS[tint]||KOI_PALS.o, opt); }   // 가로 잉어(연못 헤엄)
    // ☀️ 지는 해 — 전용 도트 원반(크레이터 없이 방사형 따뜻한 명암, 달 느낌 제거). I밝은중심→M금빛→S주황→d가장자리→X외곽. PIL 라이트/다크 검수.
    const M_SUN=[
      ".......XXXXXXXX.......",".....XXddddddddXX.....","....XddddSSSSddddX....","...XdddSSSSSSSSdddX...",
      "..XddSSSSSSSSSSSSddX..",".XddSSSSMMMMMMSSSSddX.",".XddSSSMMMMMMMMSSSddX.","XddSSSMMMMMMMMMMSSSddX",
      "XddSSMMMMIIIIMMMMSSddX","XdSSSMMMIIIIIIMMMSSSdX","XdSSSMMMIIIIIIMMMSSSdX","XdSSSMMMIIIIIIMMMSSSdX",
      "XdSSSMMMIIIIIIMMMSSSdX","XddSSMMMMIIIIMMMMSSddX","XddSSSMMMMMMMMMMSSSddX",".XddSSSMMMMMMMMSSSddX.",
      ".XddSSSSMMMMMMSSSSddX.","..XddSSSSSSSSSSSSddX..","...XdddSSSSSSSSdddX...","....XddddSSSSddddX....",
      ".....XXddddddddXX.....",".......XXXXXXXX......."];
    const SUN_PAL={I:'#fff4cc',M:'#ffd678',S:'#ffa84a',d:'#f0803a',X:'#d6682c'};
    function sunSvg(opt){ return pxSvg(M_SUN, SUN_PAL, opt); }
    // 🪷 연꽃(top-down) — 바깥 분홍꽃잎(F)·안쪽 연분홍(C)·노란중심(Y). 연못 위에 떠서 흔들(pkfloat).
    const M_LOTUS=["...FFF...","..FFFFF..",".FFCCCFF.",".FCCYCCF.","FFCYYYCFF",".FCCYCCF.",".FFCCCFF.","..FFFFF..","...FFF..."];
    const LOTUS_PAL={F:'#ff8fb4',C:'#ffc8de',Y:'#ffde60',f:'#e06a94'};   // f=v2 꽃잎 그늘
    function lotusSvg(opt){ return pxSvg(_pkV2?M2_LOTUS:M_LOTUS, LOTUS_PAL, opt); }
    // 🌿 연잎 — 둥근 잎 + 오른쪽 쐐기 홈(V컷). G밝 d진.
    const M_LILYPAD=["..GGGGG..",".GGGGGGd.","GGGGGGdd.","GGGGGG..d","GGGGGGdd.",".GGGGGdd.","..Gdddd.."];
    const LILY_PAL={G:'#5ab24a',d:'#3a7e32',g:'#4a9a3e'};   // g=v2 중간톤
    function lilyPadSvg(opt){ return pxSvg(_pkV2?M2_LILYPAD:M_LILYPAD, LILY_PAL, opt); }
    // ⛰️ 먼 언덕(실루엣) — 아이콘 뒤 빈 하늘/지평선 채우기용. 배너별 팔레트로 재색(낮=초록·노을=보랏빛·밤=짙은청록). H본체 h윗선.
    const M_HILL=[".........hhhhhh.........","......hhHHHHHHHHhh......","...hhHHHHHHHHHHHHHHhh...",".hHHHHHHHHHHHHHHHHHHHHh.","HHHHHHHHHHHHHHHHHHHHHHHH","HHHHHHHHHHHHHHHHHHHHHHHH","HHHHHHHHHHHHHHHHHHHHHHHH"];
    const HILL_DAY={H:'#5ea650',h:'#7ac468',d:'#4c8a40'}, HILL_SUNSET={H:'#7a5678',h:'#a06e8c',d:'#644460'}, HILL_NIGHT={H:'#1e3430',h:'#304a42',d:'#152622'};   // d=v2 밑그늘
    function hillSvg(pal,opt){ return pxSvg(_pkV2?M2_HILL:M_HILL, pal||HILL_DAY, opt); }
    // 🏆 보물(랜덤박스) 배너 신규 스프라이트 — 금괴·보석(다색)·동전더미 + 금빛 언덕 팔레트. 골드/젬 팔레트 계열 재사용.
    const HILL_TREASURE={H:'#e0b84a',h:'#F4D06B',d:'#b08a2a'};
    const M_GOLDBAR=["..HHHHHHHHH..",".HLLLLLLLLLH.","HLMMMMMMMMMLH","DMMMMMMMMMMMD","DDMMMMMMMMMDD",".DDDDDDDDDDD."];
    const GOLDBAR_PAL={H:'#fff0b8',L:'#F4D06B',M:'#caa23a',D:'#8a6a1e'};
    function goldBarSvg(opt){ return pxSvg(M_GOLDBAR, GOLDBAR_PAL, opt); }
    const M_GEM=["...HHH...","..HLLLH..",".HLLLLLH.","MLLLTLLLM","MLLTTTLLM",".MLLTLLM.",".MMLLLMM.","..MMLMM..","...MDM...","....D...."];
    const GEM_PALS={ blue:{D:'#3f6fc4',M:'#5aa9e6',L:'#8fd0ff',T:'#dff0ff',H:'#eaf7ff'}, purple:{D:'#7d4e94',M:'#a06fd0',L:'#d0a8f0',T:'#f4eaff',H:'#efe0ff'}, pink:{D:'#c94a8a',M:'#ff5d9e',L:'#ff9ec2',T:'#ffe6f2',H:'#ffe0ef'}, green:{D:'#2f8a5e',M:'#3fae7a',L:'#7fe0b0',T:'#e6fff2',H:'#dfffee'}, red:{D:'#b23026',M:'#e0552f',L:'#ff8a6a',T:'#ffe0d4',H:'#ffdccc'}, gold:{D:'#caa23a',M:'#F4D06B',L:'#ffe89a',T:'#fffbe6',H:'#fff6df'} };
    function gemSvg(color, opt){ return pxSvg(M_GEM, GEM_PALS[color]||GEM_PALS.blue, opt); }
    const M_COINPILE=["....HH...HH....","..HLLLHHLLLH...",".HLLLLLLLLLLH..","HLLDLLDLLDLLLH.","HLLLLLLLLLLLLLH","DLLDLLDLLDLLDLL","DLLLLLLLLLLLLLD",".DDLLDLLDLLDDD.","..DDDDDDDDDDD.."];
    const COINPILE_PAL={H:'#fff0b8',L:'#F4D06B',D:'#caa23a'};
    function coinPileSvg(opt){ return pxSvg(M_COINPILE, COINPILE_PAL, opt); }
    // 🏛️ 황궁 보물창고 배너 스프라이트 — 금기둥(플루팅·보석 인레이)·매달린 등불(불꽃)·전폭 보물바닥(금·은화+보석 밀집). 밝은 금빛.
    const M_TPILLAR=["................","....KHHHHHHK....","..KHGGGGGGGGGK..",".KGGGGGeEGGGGGK.",".KGGGGGGGGGGGGK.",".KddddddddddddK.","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","...KHHdGGdddK...","..KGGGHHHHGGGK..",".KggggggggggggK.","KggggggggggggggK","KggggggggggggggK",".KddddddddddddK.","..KKKKKKKKKKKK..","................"];
    const TPILLAR_PAL={K:'#5c4410',d:'#8a6a1e',g:'#caa23a',G:'#F4D06B',H:'#fff0b8',W:'#ffffff',e:'#ff5d6c',E:'#ffc0c6'};
    function tPillarSvg(opt){ return pxSvg(M_TPILLAR, TPILLAR_PAL, opt); }
    const M_TLANTERN=["....CC....","....CC....","...KGGK...","..KGHHGK..",".KdGGGGdK.",".KGfrrfGK.","KGGfFFfGGK","KGGfFFfGGK","KGGfrrfGGK",".KGHffHGK.",".KGGffGGK.",".KdGGGGdK.","..KdggdK..","...KddK...","....KK....","....d....."];
    const TLANTERN_PAL={K:'#4a3a12',d:'#8a6a1e',g:'#caa23a',G:'#F4D06B',H:'#fff0b8',C:'#6b5518',F:'#ff7a2e',f:'#ffe07a',r:'#ff5a2a',W:'#fff6d0'};
    function tLanternSvg(opt){ return pxSvg(M_TLANTERN, TLANTERN_PAL, opt); }
    const M_THOARD=["........................................................","........................................................","..................................................d..d..",".OdddO..........dW.............................uUOddOd..","OHOdOHOd.d..dOddddddd........................OSuOHOOHOdd","ddSdddOOHOddOHOdddddd.d............dOH.d..LSOSLSddddOHOd","dSLSdOHddddSdddddOddddO.......dddOdEdddddsssdsssddOHdddd","dsssddddOddUssddOHOOdOHOdddOHOddOHWEeWdddddPddddddddEddd","dddEdddOHOuUuddddPOHOdddddddddddddeWeOddOdpPpddddddeEedd","ddeEeOdddduuudOdpPdddddOdOddOddSddOHOHOOHOpppdOdddSeeedd","ddeeOHOdddOKdOHOUppddSSHOHOOHOSSSddddddddddKdOUOddssKdOd","ddOKdOdddOHOddduUuddSSLSddOddOSLSdddddddddPdOuUudddSdOHO","dOHOOHOdOddddSduuuddssssdOHOddsssdddOddOdpPpduuuddSLWddd","dddddddOHOddSLSdKddddddddddddddddddOHOOHOpppddKdddsssddd","ddddddddWdddsssdddddddddddddddddddddddddddKddddddddddddd"];
    const THOARD_PAL={K:'#7a5e1c',d:'#8a6a1e',o:'#caa23a',O:'#F4D06B',H:'#fff0b8',s:'#8a94a8',S:'#c2cad8',L:'#eef2f8',e:'#ff5d6c',E:'#ffc0c6',u:'#5aa9e6',U:'#cfeaff',v:'#5bbf7a',V:'#c6f5d8',p:'#c77dff',P:'#eccfff',W:'#ffffff'};
    function tHoardSvg(opt){ return pxSvg(M_THOARD, THOARD_PAL, opt); }
    // 💎 거대 무지개 다이아몬드(보물 씬 뒷배경 센터피스) — 브릴리언트 컷: 테이블→크라운→거들(빛 띠)→퍼빌리언(뾰족).
    //    파셋(면)은 큰 쐐기 3분할: 중앙 R=RAINBOW(선명)·중간 Q=RAINBOW2(파스텔)·바깥 R, 경계 W 한 줄 + 내부 십자 스파클. PIL 라이트/다크/금빛 검수.
    const M_TDIA=["..........KKKKKKKKKKKKKKK..........",".........KWLLLLLLLLLLLLLWK.........",".........KWLLLQQQQQQQLLLWK.........",".......KKWRRWQQWRRRWQQWRRWKK.......","......KWRRRWQQQWRRRWQQQWRRRWK......",".....KWRRWWQQQWRRRRRWQQQWRRRWK.....","....KWRRWWWQQQWRRRRRWQQQWRRRRWK....","..KKWRRRRWQQQQWRRRRRWQQQQWRRRRWKK..",".KWRRRRRWQQQQWRRRRRRRWQQQQWRRRRRWK.","KHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHK","KWRRRRRWQQQQQWRRRRRRRWQQQQQWRRRRRWK",".KWRRRRRWQQQQWRRRRRRRWQQQQWRRRRRWK.","..KWRRRRWQQQQWRRRRRRRWQWQQWRRRRWK..","...KWRRRRWQQQQWRRRRRWQWWWWRRRRWK...","....KWRRRRWQQQWRRRRRWQQWWRRRRWK....",".....KWRRRWQQQWRRRRRWQQQWRRRWK.....","......KWRRRWQQQWRRRWQQQWRRRWK......",".......KWRRRWQWWRRRWQQWRRRWK.......","........KWRRWWWWRRRWQQWRRWK........",".........KWRRWWWRRRWQWRRWK.........","..........KWRRWQWRWQWRRWK..........","...........KWRWQWRWQWRWK...........","............KWRWRRWWRWK............",".............KWRWWWRWK.............","..............KWWWQWK..............","...............KWRWK...............","................KWK................",".................K................."];
    const TDIA_PAL={K:'#5f6fae',R:'RAINBOW',Q:'RAINBOW2',W:'#ffffff',L:'#eaf6ff',H:'#dff0ff'};
    function tDiaSvg(opt){ return pxSvg(M_TDIA, TDIA_PAL, opt); }
    // 🏆 금잔(goblet) — 림 하이라이트·루비 인레이·잘록한 목·받침, 4톤 금.
    const M_TGOBLET=["............",".KHHHHHHHHK.","KGgggggggggK","KGgeEegggddK","KGgeeegggddK",".KGggggggdK.","..KGggggdK..","...KHGgdK...","....KGdK....","....KGdK....","...KHGgdK...","..KGggggdK..",".KGggggggdK.",".KddddddddK.","............"];
    const TGOBLET_PAL={K:'#6b4f12',d:'#b8892a',g:'#e8bc4e',G:'#f7d878',H:'#fff0b8',e:'#ff5d6c',E:'#ffc0c6'};
    function tGobletSvg(opt){ return pxSvg(M_TGOBLET, TGOBLET_PAL, opt); }
    // 🦪 진주 더미 — 알갱이 사이 어두운 골(K)로 구분, 알마다 W 하이라이트, 금 접시 받침.
    const M_TPEARLS=["..............","....KKK.KKK...","...KPWPKPWPK..","...KPPPKPPPK..",".KKKpKKKKKpKK.",".KPWPKPWPKPWK.",".KPPPKPPPKPPK.",".KpppKpppKppK.",".KddddddddddK.","..KddddddddK..",".............."];
    const TPEARLS_PAL={K:'#8a7f9a',P:'#f6f1ff',W:'#ffffff',p:'#cfc4e6',d:'#e8bc4e'};
    function tPearlsSvg(opt){ return pxSvg(M_TPEARLS, TPEARLS_PAL, opt); }
    // 🌠 무지개 별똥별(comet) — 대각선 ↘(머리 우하단 4방 별·꼬리 좌상단). 무지개는 RAINBOW 팔레트(움직이는 그라디언트), 코어=흰빛. 10연차 밤(무지개) 하늘 연출.
    const M_SHOOT=["....................","....................","....................","...R................","....R...............",".....R..............","......R.............",".......RR...........",".......RRR..........","........RRR.........",".........RRRR.R.....","..........RRRRR.....","..........RRRRRR....","...........RRRWRR...","..........RRRWWWRRR.","............RRWRR...",".............RRR....","..............R.....","..............R.....","...................."];
    const SHOOT_PAL={R:'RAINBOW',W:'#ffffff'};
    function shootStarSvg(opt){ return pxSvg(M_SHOOT, SHOOT_PAL, opt); }
    // 깊이 그림자(납작 타원): 펫 발밑에 깔려 depth(액터 scale 그대로)에 따라 커지고 작아짐 → 접지감+깊이. 색은 CSS opacity로 은은하게. 가림 0.
    const M_SHADOW=[".SSSSSSS.","SSSSSSSSS",".SSSSSSS."];
    const SHADOW_PAL={S:'#12240c'};
    function shadowSvg(opt){ return pxSvg(M_SHADOW, SHADOW_PAL, opt); }
    // ===== 🎨 픽업배너 v2 고해상도 씬 에셋 (2026-07, 기구물 22종 리디자인 기준) =====
    //  · 기존 매트릭스의 글자(팔레트)를 그대로 쓰되 해상도 1.6~2배 + 3~4톤 음영 + 외곽선(디테일 픽셀아트 기준).
    //  · 신규 글자(구름 D·꽃 d·나비 w·바위 I·잉어 W·연꽃 f·연잎 g·언덕 d)는 기존 팔레트에 색만 추가 — 밤/노을 틴트 팔레트 전부 호환 유지.
    //  · _pkV2 플래그가 켜진 동안만 각 헬퍼가 v2 매트릭스로 전환.
    //  · 🎉 2026-07-08 v2 정식 반영 — 기본값 true(라이브·개발자 공통 v2: 뜰알/펫알/랜덤박스 배너·씬·연출 전부).
    //    무지개알·무지개박스 '아이템 사용(1뽑)' 연출도 v2 통일(2026-07-09) — 무지개알=뜰알식(큰 무지개꽃·전설↑ 꽃 뚝+흩날림), 무지개박스=무지개 나무상자 오픈.
    //    v2 무지개 밤 배너(rainbowBannerHtml)는 개발자 '배너 관리' 전용(추후 다른 픽업용으로 대기), 라이브 무지개 탭은 구매/사용 카드 유지.
    //  · 전부 스크래치패드 PIL 컨택트시트(라이트/다크/밤배경)로 검수 후 이식 (CLAUDE.md 워크플로).
    let _pkV2=true;
    const M2_CLOUD1=["..............................",".........HHHH...HHHHH.........","......HHHWWWWHHHHWWWWHH.......","....HHWWWWWWWWHWWWWWWWWHH.....","...HWWWWWWWWWWWWWWWWWWWWWH....",".HHWWWWWWWWWWWWWWWWWWWWWWWHH..",".HWWWWWWWWWWWWWWWWWWWWWWWWWWH.","HWWWWWWWWWWWWWWWWWWWWWWWWWWWWH","HWWWWWWWWWWWWWWWWWWWWWWWWWWWWH",".SWWWWWWWWWWWWWWWWWWWWWWWWWWS.",".SSSSSWWWWSSSSWWWWWSSSSWWSSSS.","..DDDDDDDDDDDDDDDDDDDDDDDDD..."];
    const M2_CLOUD2=["....................","......HHHHH.........","....HHWWWWWHH.......","..HHWWWWWWWWWHH.....",".HWWWWWWWWWWWWWH....","HWWWWWWWWWWWWWWWWH..","SWWWWWWWWWWWWWWWWS..",".SSSSWWWWSSSWWWSSS..","..DDDDDDDDDDDDDD...."];
    const M2_CLOUD3=[".............","....HHHH.....","..HHWWWWH....",".HWWWWWWWWH..","HWWWWWWWWWWH.","SWWWWWWWWWWS.",".SSDDDDDDSS.."];
    const M2_TREETOP=["......................",".......HHHHHH.........",".....HHLLLLLHHH.......","....HLLLLLLLLLHH......","...HLLLLHHLLLLLLH.....","..HLLLHHLLLLLlLLLH....","..HLLLLLLLLLllLLLDH...",".HLLLLLLLLLLllllLLDH..",".HLLHHLLLLllllllLDDH..",".HLLLLLLLllllllllDDH..",".XLLLLLllllllllDDDDX..",".XLLLLllllllDDDDDDDX..","..XLLllllllDDDDDDDX...","..XXlllllDDDDDDDDX....","....XXllDDDDDDXX......","......XXXDDDXX........","........XXXX..........","......................"];
    const M2_TRUNK=["..TwwTt..","..TwwTt..","..TwwTt..","..TwwTt..","..TwwTt..",".TTwwTtt.",".TwwTTtt.","TTwwTTttT"];
    const M2_PINE=["...............",".......H.......","......HLD......","......HLD......",".....HLLlD.....",".....HLLlD.....","....HLLLllD....","....HLLLllD....","...HLLLLlllD...","..HLLLLLllllD..","....HLLLllD....","...HLLLLlllD...","...HLLLLlllD...","..HLLLLLllllD..",".HLLLLLLlllllD.","....HLLLllD....","...HLLLLlllD...","..HLLLLLllllD..",".HLLLLLLlllllD.","HLLLLLLLllllllD","......TTt......","......TTt......","......TTt......",".....TTTtt.....","..............."];
    const M2_FLOWER=["...........","...P.P.P...","..PPdPdPP..","..PPPCPPP..",".PPdCCCdPP.","..PPPCPPP..","..PPdPdPP..","...P.P.P...","....dPd....",".....S.....","..SS.S.....",".SSS.S.SS..",".....S.SSS."];
    const M2_TUFT=[".............",".H...H...H...",".G.H.G.H.G...",".G.G.GG.G.H..",".gG.GgG.GG.G.",".gGGgGGgGGgG.","..gGgGgGgGg..","..ggggggggg..","............."];
    const M2_BFLY=[".wWWw.B.wWWw.","wWHWWwBwWWHWw","wWWWWwBwWWWWw",".wWWWwBwWWWw.","..wWWwBwWWw..","..wWHwBwHWw..","...wWw.wWw...","....w...w...."];
    const M2_STONE=[".............","...XXXXXXX...","..XLIILLLMX..",".XLILLLMMMDX.",".XLLLMMMDDDX.","..XMMDDDDDX..","...XXXXXXX..."];
    const M2_ROCK=[".......gGGg........",".....gGGGGGg.......","....XXXXXXXXX......","...XLLILLLMMMX.....","..XLLILLLLMMMMX....",".XLLLLLLLMMMMMDX...",".XLLLLLLMMMMMDDX...","XLLLLLMMMMMMDDDDX..","XLLLMMMMMMMDDDDDX..","XLMMMMMMMDDDDDDDX..","XMMMMMMDDDDDDDDDX..",".XMMMDDDDDDDDDDX...","..XMMDDDDDDDDDX....","...XXXXXXXXXXX....."];
    const M2_FENCE=["..T....T....T....T...",".TWw..TWw..TWw..TWw..",".TWwT.TWwT.TWwT.TWwT.",".TWwT.TWwT.TWwT.TWwT.","RRRRRRRRRRRRRRRRRRRRR","RwwwwwwwwwwwwwwwwwwwR",".TWwT.TWwT.TWwT.TWwT.",".TWwT.TWwT.TWwT.TWwT.","RRRRRRRRRRRRRRRRRRRRR","RwwwwwwwwwwwwwwwwwwwR",".TWwT.TWwT.TWwT.TWwT.",".TWwT.TWwT.TWwT.TWwT.","....................."];
    const M2_LEAF=[".............","..X...X...X..","..XX.XyX.XX..","...XOXyXOX...","..XOOOyOOOX..",".XyOOOyOOOyX.","XXOOOyyyOOOXX","..XOOyOyOOX..","...XrOyOrX...","..XrrOyOrrX..","...XXryrXX...",".....XyX.....",".....XsX.....","......ss....."];
    const M2_DFLY=[".......X.......","......XEX......",".....XEEEX.....","......XRX......","vvWWWwXRXwWWWvv","vWWWWwXRXwWWWWv",".vWWWwXrXwWWWv.","...wwwXRXwww...",".vWWWwXRXwWWWv.","vWWWWwXrXwWWWWv","vvWWWwXRXwWWWvv","......XRX......","......XrX......","......XRX......","......XrX......","......XrX......",".......r.......",".......r.......","..............."];
    const M2_DFLY_H=rot90cw(M2_DFLY);
    const M2_KOI=[".....XX.....","....XBBX....","...XBBBBX...","..XBBBBBBX..","..XBWWBBBX..",".XBBWWBSSBX.",".XBBWWBSSBX.","fXBBWWBBBBXf","fXBBWWBBBBXf",".XBBWWBSSBX.",".XBBWWBSSBX.",".XBBWWBBBBX.","..XBWWBBBX..","..XBWWBSBX..","..XBBWBBBX..","...XBBBBX...","...XBBBX....","....XBX.....","...fXBXf....","..ffXBXff...",".fff.X.fff..","............"];
    const M2_KOI_H=rot90cw(M2_KOI);
    const M2_LOTUS=[".............",".....FFF.....","..F.FFFFF.F..",".FFFFCCCFFFF.",".FFCCCCCCCFF.","FFCCCYYYCCCFF",".FfCCYYYCCfF.",".FffCCCCCffF.","..fffFFFfff..","....fffff....","............."];
    const M2_LILYPAD=["...............","....GGGGGG.....","..GGGGGGGGGG...",".GGGGGGGGGGGg..",".GGGGGGGGgg....",".GGGGGGGg......",".GGGGGGGGggg...",".GGGGGGGGGGgg..","..gGGGGGGGgg...","...gggdddd....."];
    const M2_FIRE=["....h....","..hhHhh..",".hHYYYHh.",".hYYHYYh.","hYYHHHYYh",".hYYHYYh.",".hHYYYHh.","..hhHhh..","....h....","...g.....","...gg....","....b...."];
    const M2_HILL=[".............hhhhhh...............",".........hhhHHHHHHHhhh............","......hhHHHHHHHHHHHHHHhh..........","....hhHHHHHHHHHHHHHHHHHHhh........","..hhHHHHHHHHHHHHHHHHHHHHHHhh......",".hHHHHHHHHHHHHHHHHHHHHHHHHHHh.....","hHHHHHHHHHHHHHHHHHHHHHHHHHHHHh....","HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH..","HHHHHHHHHdddHHHHHHHddHHHHHHHHHHHH.","HHHHHHHddddddHHHdddddHHHHHHHHHHHH.","dddddddddddddddddddddddddddddddd.."];
    // 🐸 청개구리(v2 노을 연못) — 옆모습(오른쪽 보기)·불룩 눈+흰 글린트·밝은 배. 왼쪽 큰돌↔연못 왕복 다이빙 연출(.pk-frog). PIL 라이트/다크/노을물 검수.
    const M2_FROG=["..............","........XXX...",".......XEHGX..","..XXX..XGGGGX.",".XGGGXXGGGGGX.","XGGGGGGGGGWWX.","XGgGGGGGGWWX..",".XggGGGGgWX...","..XgX..XgX....",".............."];
    const FROG_PAL={X:'#173a12',G:'#54c84a',g:'#379a34',W:'#eaffd0',E:'#101c0c',H:'#ffffff'};
    function frogSvg(opt){ return pxSvg(M2_FROG, FROG_PAL, opt); }
    // 🟩 v2 필드 잔디 — 반복 타일은 반드시 canvas→PNG data URI(tileBg) (CLAUDE.md 규칙: SVG data URI 배경 금지). 테마별 캐시.
    const M2_GRASSTILE=["GGGGLGGGGGGDGG","GGDGGGGGLGGGGG","GGGGGGDGGGGHLG","GLGGGGGGGGDGGG","GGGGDGGGLGGGGG","GGGGGGGGGGGGDG","GDGGGHLGGGGGGG","GGGGGGGGGDGGGG","GGLGGDGGGGGGLG","GGGGGGGGGGGGGG","GDGGGGGGLGGDGG","GGGGLGGGGGGGGG","GGGGGGDGGGHLGG","GLGGGGGGGGGDGG"];
    const GRASS2_PALS={ day:{G:'#5fbf6a',L:'#74cf78',D:'#4da75a',H:'#8fdd8a'}, sunset:{G:'#6f9c50',L:'#82b05e',D:'#5d8443',H:'#9cc46e'}, night:{G:'#24402e',L:'#2f5039',D:'#1c3325',H:'#3a614a'} };
    const _pkGrassCache={};
    function pkGrassBg(theme){ if(!_pkGrassCache[theme]) _pkGrassCache[theme]=tileBg(M2_GRASSTILE, GRASS2_PALS[theme]||GRASS2_PALS.day, 28, 28); return _pkGrassCache[theme]; }
    // v2일 때만 잔디 타일 인라인(픽셀 텍스처) — v1은 기존 CSS 단색+::before 줄무늬 유지
    function pkGrassDiv(theme){ return _pkV2 ? '<div class="pk-grass" style="background:'+pkGrassBg(theme)+';image-rendering:pixelated"></div>' : '<div class="pk-grass"></div>'; }
    // 알뜰샵·팔레트·격자용 대표 아트(물그릇은 물 채운 파란 그릇으로 구분 표시)
    function furnMatrix(id){ return {pond:M_POND,cushion:M_CUSHION,bowl:M_BOWL,waterbowl:M_WATERBOWL_WATER,tower:M_TOWER,scratcher:M_SCRATCHER,litterbox:M_LITTER,pethouse:M_PETHOUSE,plant:M_PLANT,catwheel:M_CATWHEEL,rug:M_RUG,window:M_WINDOW,fishtank:M_FISHTANK,fireplace:M_FIREPLACE,fan:M_FAN,hammock:M_HAMMOCK,teaser:M_TEASER,wallclock:M_WALLCLOCK,hangplant:M_HANGPLANT,mobile:M_MOBILE,chandelier:M_CHANDELIER,jingleball:M_JINGLEBALL,frame:M_FRAME,shelf:M_SHELF,mirror:M_MIRROR,neon:M_NEON,sconce:M_SCONCE,garland:M_GARLAND,poster:M_POSTER,tapestry:M_TAPESTRY,cactus:M_CACTUS,yarnbasket:M_YARNBASKET,floorlamp:M_FLOORLAMP,beanbag:M_BEANBAG,groomstation:M_GROOMSTATION,springtoy:M_SPRINGTOY,tunnel:M_TUNNEL,teepee:M_TEEPEE,bookshelf:M_BOOKSHELF,birdcage:M_BIRDCAGE,lavalamp:M_LAVALAMP,laserpost:M_LASERPOST,waterfountain:M_WATERFOUNTAIN,sofa:M_SOFA,recordplayer:M_RECORDPLAYER,terrarium:M_TERRARIUM,ballpit:M_BALLPIT,grandfaclock:M_GRANDFACLOCK,bunkbed:M_BUNKBED,crystalfountain:M_CRYSTALFOUNTAIN,dartboard:M_DARTBOARD,cuckooclock:M_CUCKOOCLOCK,roundbed:M_ROUNDBED,donutbed:M_DONUTBED,cavebed:M_CAVEBED,canopybed:M_CANOPYBED,throne:M_THRONE,mousetoy:M_MOUSETOY,catnippillow:M_CATNIPPILLOW,puzzlefeeder:M_PUZZLEFEEDER,balltrack:M_BALLTRACK,teetertoy:M_TEETERTOY,bubblemachine:M_BUBBLEMACHINE,bonsai:M_BONSAI,globe:M_GLOBE,snowglobe:M_SNOWGLOBE,campfire:M_CAMPFIRE,gramophone:M_GRAMOPHONE,arcademachine:M_ARCADEMACHINE,jukebox:M_JUKEBOX,crystalcluster:M_CRYSTALCLUSTER,easel:M_EASEL,floorvase:M_FLOORVASE,suitofarmor:M_SUITOFARMOR,hourglass:M_HOURGLASS,telescope:M_TELESCOPE,gumballmachine:M_GUMBALLMACHINE,wallvines:M_WALLVINES,pennant:M_PENNANT,wallmask:M_WALLMASK,barometer:M_BAROMETER,stringlights:M_STRINGLIGHTS,wallbutterfly:M_WALLBUTTERFLY,cornershelf:M_CORNERSHELF,wallsun:M_WALLSUN,treatjar:M_TREATJAR,catgrass:M_CATGRASS,groomarch:M_GROOMARCH,heatpad:M_HEATPAD,peekbox:M_PEEKBOX,tetherpole:M_TETHERPOLE,windmilltoy:M_WINDMILLTOY,crinklebag:M_CRINKLEBAG,roundrug:M_ROUNDRUG,runner:M_RUNNER,koipond:M_KOIPOND,displaycase:M_DISPLAYCASE,woodstove:M_WOODSTOVE,mushroomlamp:M_MUSHROOMLAMP,statuecat:M_STATUECAT,teacart:M_TEACART,crystaltree:M_CRYSTALTREE,treadmill:M_TREADMILL,laserbot:M_LASERBOT,rcmouse:M_RCMOUSE,slalom:M_SLALOM,sprinttrack:M_SPRINTTRACK,cucumber:M_CUCUMBER,milkbar:M_MILKBAR,dispenser:M_DISPENSER,birdfeeder:M_BIRDFEEDER,hamstercage:M_HAMSTERCAGE}[id]; }
    function furnSvg(id, opt){ return pxSvg(furnMatrix(id), FURN_PALS[id], opt); }
    // 캠 전용 연출(움직이는 부분만 오버레이로 분리해 CSS 애니메이션): 같은 매트릭스를 팔레트만 나눠 두 겹으로 그림.
    //  base=움직이는 글자 제외, fx=그 글자만 → 완벽히 겹쳐 정지 배경 + 움직이는 부품(캣휠 트레드 회전·펫알 방울 흔들림·화분 잎 살랑).
    const FURN_ANIM = {
      // move=오버레이(움직이는)로 뺄 글자, type=애니메이션 종류(spin/swing/sway/drift/flicker). 배열=여러 모션 레이어(각기 다른 속도/움직임).
      pond:    [ { type:'drift', move:['O','o','X','t'], cls:'pondfish', bg:'m' },   // 물고기 2마리 활발히 헤엄(fffish)
                 { type:'drift', move:['P','p'], cls:'pondleaf', bg:'m' },          // 수련잎 잔잔히 흔들(ffleaf)
                 { type:'drift', move:['r','S'], cls:'pondwater', bg:'m' } ],       // 물 하이라이트/반짝임 잔잔히 일렁(ffripple)
      catwheel:{ type:'spin',  move:['T','t','H'] },   // 링(림·밴드·하이라이트·발판) 전체가 축 중심으로 제자리 회전 — 롤러 R·스탠드 D만 정지
      tower:   { type:'swing', move:['T','O','K'] },   // 매달린 장난감 공(빨강 T·하이라이트 O)+끈(K)
      scratcher:{type:'swing', move:['T','O','H','K'] },   // 매달린 공(O)+하이라이트(H)+끈(T)
      plant:   { type:'sway',  move:['G','L','l','I'] },   // 잎만 살랑(줄기 S·화분 P/p/X는 정지)
      window:  { type:'drift', move:['C','c'], bg:'S' },           // 구름만 좌우로 천천히 흘러감(하늘 S·해 U/u·틀은 정지)
      fishtank:{ type:'drift', move:['F','f','b'], bg:'A' },   // 금붕어+기포만 헤엄치듯 좌우로(물 A·수초 P·자갈 R은 정지)
      fireplace:{type:'flicker',move:['f','F','r'], bg:'D' },  // 불꽃만 일렁임(벽돌·맨틀·장작은 정지)
      fan:     { type:'spin',  move:['G','L','D','h'] },   // 케이지 안 날개(G 중간·L 하이라이트·D 그림자 명암)+허브(h)가 함께 회전(림 X·목·받침은 정지). 진한 하늘색 날개(B)는 팔레트에서 빼 투명 처리(뒷배경 비침)
      hammock: { type:'swing', move:['K','C','c','L','l','P','p'] },// 끈+천 요람+베개가 매단 지점에서 살랑(기둥 X/W/w 정지)
      teaser:  { type:'swing', move:['K','F','f','H','T'] },// 줄+깃털 장난감이 대 끝에서 흔들(대 R·받침 정지)
      wallclock:{type:'swing', move:['K','O','o','E'] },       // 추(봉+놋쇠)만 좌우로(몸통·시계판 정지)
      hangplant:{type:'swing', move:['L','l','I','G','g'] }, // 걸이 아래 전체가 살랑(천장 걸이 X 정지)
      mobile:  { type:'swing', move:['A','a','B','b','C','c','W','K'] }, // 막대+매달린 별·달·하트 전체가 살랑(걸이 X 정지)
      chandelier:{type:'sway', move:['Y','y','W','H','C','c','o','v'] }, // 천장에서 전체가 흔들(매다는형, 상단 피벗) — 더 활발하게(각↑·빠르게)
      jingleball:{type:'swing', move:['X','B','b','L','H','S'] },  // 공 전체가 바닥에서 통통(바닥 접점 중심)
      neon:    {type:'blink',  move:['N','n','H','C','S'], bg:'k' },   // 네온 하트+글로우+반짝임이 네온처럼 파르르 깜빡(더 활발)
      sconce:  {type:'flicker',move:['F','Y','y'] },   // 벽등 촛불이 활발히 일렁(빠르게·크게)
      mirror:  {type:'sheen',  move:['h'], bg:'A' },   // 거울 사선 광택이 반짝 스윕(정적→연출 추가)
      garland: {type:'blink',  move:['A','B','C','a','b','c','H'] },  // 가랜드 전구만 깜빡(줄 K 정지)
      cactus: {type:'sway', move:['f', 'F', 'Y'] },
      yarnbasket: {type:'sway', move:['R', 'r', 'G', 'g'] },
      floorlamp: {type:'flicker', move:['F', 'Y', 'H', 'o'] },
      groomstation: {type:'sway', move:['s', 't', 'S'] },
      springtoy: {type:'swing', move:['B', 'b', 'L', 'R', 'W', 'S', 'x'] },
      birdcage: {type:'swing', move:['Y', 'y', 'o', 'B', 'R', 'T', 't'] },
      lavalamp: {type:'drift', move:['R', 'o', 'O', 'Y', 'r'], bg:'G' },
      laserpost: {type:'blink', move:['R', 'r', 'L', 'P', 'Y'] },
      waterfountain: {type:'drift', move:['A', 'a', 'H', 'h'] },
      recordplayer: {type:'spin', move:['R', 'r'] },
      terrarium: {type:'sway', move:['L', 'l', 'D', 'f', 'F'] },
      ballpit: {type:'drift', move:['R', 'r', 'Y', 'y', 'G', 'g', 'P', 'p', 'B', 'b'] },
      grandfaclock: {type:'swing', move:['O', 'o', 'K'], bg:'G' },
      crystalfountain: {type:'drift', move:['A', 'a', 'H', 'h', 's', 'K', 'C', 'c', 'B'] },
      cuckooclock: {type:'swing', move:['O', 'o', 'Y', 'k', 'K'] },
      balltrack: {type:'spin', move:['R', 'r', 'Y', 'G'], bg:'w' },
      teetertoy: {type:'swing', move:['R', 'r', 'B', 'b', 'H'] },
      bubblemachine: {type:'drift', move:['B', 'b', 'L'] },
      bonsai: {type:'sway', move:['G', 'L', 'l', 'I', 'f'] },
      globe: {type:'spin', move:['A', 'a', 'G', 'g', 'L'] },
      snowglobe: {type:'drift', move:['S', 's'], bg:'G' },
      campfire: {type:'flicker', move:['f', 'F', 'r', 'o'] },
      gramophone: {type:'spin', move:['R'], bg:'d' },
      arcademachine: {type:'blink', move:['S', 'R', 'Y', 'B', 'L'], bg:'D' },
      jukebox: {type:'blink', move:['R', 'B', 'Y', 'G'], bg:'K' },
      crystalcluster: {type:'sway', move:['h', 'H', 'P', 'C', 'W'] },
      hourglass: {type:'drift', move:['S', 'y'], bg:'G' },
      wallvines: {type:'sway', move:['L', 'l', 'I', 'f', 'F'] },
      pennant: {type:'sway', move:['R', 'B', 'Y', 'G', 'W'] },
      stringlights: {type:'blink', move:['R', 'Y', 'G', 'B', 'P', 'H'] },
      wallsun: {type:'spin', move:['o', 'O', 'H'] },
      catgrass: {type:'sway', move:['L', 'l', 'I'] },
      groomarch: {type:'sway', move:['i', 'I'] },
      heatpad: {type:'flicker', move:['L', 'H', 'o'] },
      tetherpole: {type:'swing', move:['R', 'r', 'o'] },
      windmilltoy: {type:'spin', move:['R', 'B', 'Y', 'G', 'o'] },
      crinklebag: {type:'sway', move:['H', 'W'] },
      koipond: {type:'drift', move:['L', 'W', 'P', 'p', 'o', 'r'], bg:'B' },
      woodstove: {type:'flicker', move:['f', 'F', 'r', 'o'] },
      mushroomlamp: {type:'flicker', move:['L', 'o', 'H'] },
      crystaltree: {type:'sway', move:['b', 'H', 'p', 'P', 'C', 'c'] },
      // 🧸 배치3 재디자인 연출(2026-07): 쿠션 태슬·왕좌 보석(bg=금장)·캐노피 커튼·동굴 이끼·간식단지 과자 반짝(bg=유리)
      cushion: {type:'sway', move:['t','s'] },
      throne: {type:'blink', move:['j'], bg:'W' },
      canopybed: {type:'sway', move:['P','p'] },
      cavebed: {type:'sway', move:['G','g'] },
      treatjar: {type:'blink', move:['f'], bg:'W' },
      // 🧸 배치2 재디자인 연출(2026-07): 선반 화분 잎 살랑, 벽나비 날개 가장자리 살랑(sway 언더레이)
      shelf: {type:'sway', move:['L','l'] },
      wallbutterfly: {type:'sway', move:['o','y'] },
      // 🧸 배치1 재디자인 연출(2026-07): 태엽쥐 키·꼬리, 간식 반짝(bg=웰 어둠), 캣닢 향기잎(공기), 픽어박스 눈 반짝(bg=구멍 어둠)
      mousetoy: [ {type:'swing', move:['w','k'], cls:'mtkey'}, {type:'sway', move:['T'], cls:'mttail'} ],
      puzzlefeeder: {type:'blink', move:['Y','o','K'], bg:'D' },
      catnippillow: {type:'drift', move:['i'], cls:'cnleaf' },
      peekbox: {type:'blink', move:['e'], bg:'D' },
      // 🏃 액티브 플레이 10종 — 다층·위상 어긋. 이동(drift·다트)은 공기 영역, 회전은 원형 대칭, 채운 면은 blink LED만(구멍 금지 규칙)
      treadmill: [ {type:'swing', move:['F','f'], cls:'tmfeather'}, {type:'blink', move:['L','G'], cls:'tmled', bg:'P'}, {type:'drift', move:['s'], cls:'tmwind'} ],
      laserbot: [ {type:'drift', move:['R','r'], cls:'lbdot'}, {type:'blink', move:['L','e'], cls:'lbled'}, {type:'swing', move:['A'], cls:'lbant'} ],
      rcmouse: [ {type:'drift', move:['G','g','H','P','t'], cls:'rcdart'}, {type:'blink', move:['L'], cls:'rcled', bg:'C'}, {type:'swing', move:['A'], cls:'rcant'} ],
      slalom: [ {type:'swing', move:['R'], cls:'slflagR'}, {type:'swing', move:['B'], cls:'slflagB'}, {type:'swing', move:['Y'], cls:'slflagY'}, {type:'swing', move:['G'], cls:'slflagG'} ],
      sprinttrack: {type:'sway', move:['O','o'] },
      cucumber: {type:'sway', move:['G','g','I','f'] },
      milkbar: {type:'drift', move:['S'] },
      dispenser: [ {type:'drift', move:['F'], cls:'dpfall'}, {type:'blink', move:['L','P'], cls:'dpled', bg:'K'} ],
      birdfeeder: [ {type:'drift', move:['A','a'], cls:'bfbird1'}, {type:'drift', move:['C','c'], cls:'bfbird2'} ],
      hamstercage: [ {type:'spin', move:['T','t'], cls:'hcwheel'}, {type:'flicker', move:['G','g','h','P'], cls:'hcham'}, {type:'swing', move:['B','b'], cls:'hcbottle'} ],
    };
    function palPick(pal, keys, keep){ const o={}; Object.keys(pal).forEach(function(k){ const on=keys.indexOf(k)>=0; if(on===keep) o[k]=pal[k]; }); return o; }
    // 연출 있는 가구를 base+fx 겹 SVG로. (연출 없으면 일반 furnSvg 반환)
    // FURN_ANIM[id]는 단일 {type,move} 또는 여러 모션 레이어 배열 [{type,move,cls?}, …](연못=물고기·잎·물 각기 다르게). base=어느 레이어에도 안 든 글자(정지).
    // 🩹 sway(잔잔한 회전) 레이어의 글자는 base에도 "정지 언더레이"로 남긴다 — fx가 살짝 기울 때 비워진 이음새를
    //    투명(공백)이 아니라 자기 색(정지 실루엣)으로 메워 '공중부양/구멍'을 막는다. 회전각이 작아(±4.5°) 잔상 대신
    //    '밑동이 도톰해 보이는' 자연스러운 채움이 된다. spin(제자리 전회전)·drift(옆이동)는 정지 언더레이가
    //    잔상(고스트)으로 보이므로 종전대로 base에서 제외한다.
    // 🕳️ 연출 base 매트릭스 — 움직이는(move) 글자 자리를 layer.bg(배경 글자)로 치환해, base에서 부품이 빠져 생기던 '빈 구멍'을
    //    그 부품 '뒤' 배경색(물고기→물 A, 추→유리 G, 구름→하늘 S, 전구→패널 K…)으로 채운다. sway는 언더레이 유지라 대상 아님.
    //    dock(furnLiveSvg)·비디오 PiP(baseSvg)가 공유하는 단일 소스 — 새 FURN_ANIM에서 채워진 면 위를 움직여야 하면 반드시 bg를 지정한다.
    function furnBaseMatrix(id){ const a=FURN_ANIM[id], M=furnMatrix(id); if(!a) return M;
      const layers=Array.isArray(a)?a:[a]; const map={};
      layers.forEach(function(l){ if(l.bg && l.type!=='sway') l.move.forEach(function(ch){ map[ch]=l.bg; }); });
      if(!Object.keys(map).length) return M;
      return M.map(function(r){ let o=''; for(let i=0;i<r.length;i++){ const ch=r[i]; o+=(map[ch]||ch); } return o; }); }
    function furnLiveSvg(id, opt){ const a=FURN_ANIM[id]; if(!a) return furnSvg(id, opt);
      const M=furnMatrix(id), pal=FURN_PALS[id];
      const layers = Array.isArray(a) ? a : [a];
      let excludeMove=[]; layers.forEach(function(l){ if(l.type!=='sway') excludeMove=excludeMove.concat(l.move); });   // sway 글자는 base에 유지(언더레이), 그 외만 제외
      const base=pxSvg(furnBaseMatrix(id), palPick(pal, excludeMove, false), opt);   // 🕳️ bg 치환 매트릭스로 구멍 채움
      let fx=''; layers.forEach(function(l){ fx += '<span class="ffx ffx-'+l.type+' ffx-'+(l.cls||id)+'">'+pxSvg(M, palPick(pal, l.move, true), {fit:true})+'</span>'; });
      return '<span class="fwrap">'+base+fx+'</span>'; }
    // 방(홈·dock)용 — 채움 상태 반영: 밥그릇=빈/사료, 물그릇=빈(회색)/물.
    function furnRoomSvg(itemId, key, opt){
      if(itemId==='bowl')      return pxSvg(isFilled(key)?M_BOWL_FOOD:M_BOWL, FURN_PALS.bowl, opt);
      if(itemId==='waterbowl') return pxSvg(isFilled(key)?M_WATERBOWL_WATER:M_BOWL, FURN_PALS.waterbowl, opt);
      return furnSvg(itemId, opt);
    }
    function poopSvg(opt){ return pxSvg(M_POOP, POOP_PAL, opt); }
    // 🎨 랜덤 염색약 — 코르크+유리병+무지개 3단 액체(PIL 라이트/다크 검수 통과, scratchpad dye.py).
    //    사용하면 펫 전체 톤을 랜덤 변경(owned.cats[id].dye). 알뜰샵 소비 탭 판매(염색약 금화100·리무버 금화200) + 이벤트·쿠폰·선물 지급 병행(2026-07 사용자 지침).
    const M_DYE=[
      '....kkk....',
      '....kkk....',
      '...OOOOO...',
      '....OhO....',
      '....OhO....',
      '..OOOhOOO..',
      '.Oh......O.',
      '.Oh..ppppO.',
      'Oh..pppppPO',
      'Oh.mmmmmmMO',
      'O.yyyyyyyYO',
      'O.yyyyyyyYO',
      '.OyyyyyyYO.',
      '..OOOOOOO..'];
    const DYE_PAL={ k:'#8a5a2e', O:'#3a3050', h:'#cfd8ea', p:'#ff8fb6', P:'#e06a94', m:'#79d6c8', M:'#4fb0a2', y:'#ffd23e', Y:'#e0ac1e' };
    // 🧴 염색 리무버 — 같은 병(M_DYE 검수 실루엣)에 은빛 투명 액체 팔레트(PIL 검수, dye_remover_preview). 사용하면 염색 제거(원래 톤 복원).
    const DYE_REMOVER_PAL={ k:'#6a7480', O:'#3a3050', h:'#e6ecf4', p:'#cfe3ee', P:'#a9c4d6', m:'#bcd6e4', M:'#93b4c6', y:'#dce9f1', Y:'#b3cddc' };
    // 소비 아이콘 렌더 — id→매트릭스/팔레트 룩업(사료·물·고급사료·정수물·츄르·영양제·염색약·리무버)
    const CONSUM_ART={ food:[M_FOOD,FOOD_PAL], water:[M_WATER,WATER_PAL], food_plus:[M_FOODPLUS,FOODPLUS_PAL], water_plus:[M_WATERPLUS,WATERPLUS_PAL], treat:[M_TREAT,TREAT_PAL], tonic:[M_TONIC,TONIC_PAL], dye:[M_DYE,DYE_PAL], dye_remover:[M_DYE,DYE_REMOVER_PAL] };
    function consumSvg(id, opt){ const a=CONSUM_ART[id]||CONSUM_ART.food; return pxSvg(a[0],a[1],opt); }
    // 가구 표시 배율(ITEM_CATALOG.size) — 캣타워·스크래처=2(크게), 방석=0.7·밥그릇=0.5(작게)
    function furnScale(id){ const it=ITEM_CATALOG.find(x=>x.id===id); return (it&&it.size)||1; }
    // 방(dock·홈)에서의 가구 렌더 높이(px) — 발자국 세로 칸수(footH)에 비례해 키움(캣타워 6칸=제일 큼, 스크래처 1칸=고양이 키만큼, 방석·밥그릇 1칸).
    // 고양이 상호작용(캣타워 3층 올라가기 등)이 맞아떨어지도록 렌더·엔진(fh)이 같은 값을 쓴다. depth(뒤로 갈수록) 작게.
    // 방 렌더 높이 배율(실물감) — 캣타워 제일 큼, 스크래처는 고양이 키만큼, 화장실=낮은 상자, 방석·그릇 작게.
    const ROOM_H = { pond:2.2, tower:2.5, scratcher:1.4, pethouse:2.8, catwheel:3.6, plant:1.5, treadmill:2.6, laserbot:1.1, rcmouse:1.0, slalom:2.0, sprinttrack:1.2, cucumber:0.95, milkbar:1.7, dispenser:2.6, birdfeeder:2.9, hamstercage:1.7, litterbox:0.75, cushion:1, bowl:0.5, waterbowl:0.5, rug:2.6, window:1.4, fishtank:1.4, fireplace:1.4, fan:2.7, hammock:1.8, teaser:2.4, wallclock:1.4, hangplant:1.4, mobile:1.4, chandelier:2.2, jingleball:0.7, frame:1.4, shelf:1.4, mirror:1.4, neon:1.4, sconce:1.4, garland:1.4, poster:1.4, tapestry:1.4, cactus:1.5, yarnbasket:1.0, floorlamp:2.6, beanbag:1.15, groomstation:1.5, springtoy:1.3, tunnel:1.2, teepee:2.4, bookshelf:2.6, birdcage:2.2, lavalamp:2.0, laserpost:1.6, waterfountain:1.2, sofa:1.4, recordplayer:1.2, terrarium:1.6, ballpit:1.6, grandfaclock:2.8, bunkbed:2.8, crystalfountain:2.4, dartboard:1.4, cuckooclock:1.4, roundbed:1.0, donutbed:1.0, cavebed:2.2, canopybed:2.8, throne:2.4, mousetoy:0.7, catnippillow:0.9, puzzlefeeder:1.0, balltrack:1.2, teetertoy:1.2, bubblemachine:1.6, bonsai:1.6, globe:1.4, snowglobe:1.5, campfire:1.4, gramophone:1.6, arcademachine:2.8, jukebox:2.0, crystalcluster:1.8, easel:2.2, floorvase:2.0, suitofarmor:2.6, hourglass:1.6, telescope:2.2, gumballmachine:1.8, wallvines:1.4, pennant:1.4, wallmask:1.4, barometer:1.4, stringlights:1.4, wallbutterfly:1.4, cornershelf:1.4, wallsun:1.4, treatjar:1.5, catgrass:1.9, groomarch:1.9, heatpad:1.2, peekbox:1.6, tetherpole:2.2, windmilltoy:2.0, crinklebag:1.6, roundrug:1.4, runner:1.2, koipond:1.4, displaycase:2.5, woodstove:2.1, mushroomlamp:1.9, statuecat:2.1, teacart:2.0, crystaltree:2.2 };   // 1×1 벽 가구=1.4: 벽 1칸에 맞춰 겹침 방지. 샹들리에=2.2(매다는 대형 센터피스, footW2). 가랜드=footW3.
    // ---- 배치 격자(12칸) 가로 좌표 공유 헬퍼 ----
    // 에디터(평면 그리드)·드롭프리뷰·썸네일은 gridLeftFrac/gridSpanFrac(칸 좌측 edge·폭)을 그대로 쓴다.
    // 캠(원근)은 camAnchorMode로 발자국을 "가운데 정렬 + 양끝 벽 스냅" 배치해 좌우 벽까지 고르게 채운다.
    const GRID_N = 12;              // 가로 칸수(열) — GRID_COLS 별칭. 가로 좌표·camAnchorMode·areaFree 열 경계에 쓴다.
    const GRID_ROWS = CAM.ROWS;     // 세로 칸수(깊이 행) = 8(단일 소스는 util.js CAM.ROWS). 깊이 12→8 축소로 뒤쪽 배치 구분↑.
    function gridLeftFrac(c){ return (c-1)/GRID_N; }       // 열 좌측 edge 비율(0~1)
    function gridSpanFrac(n){ return n/GRID_N; }           // n열 폭 비율
    function gridTopFrac(r){ return (r-1)/GRID_ROWS; }     // 행 상단 edge 비율(0~1) — 에디터/썸네일 평면 세로(깊이) 좌표
    function gridRowSpanFrac(n){ return n/GRID_ROWS; }     // n행 높이 비율(평면)
    // 캠 가로 앵커 모드: 왼쪽 벽에 닿는 열=left(좌측 밀착), 오른쪽 벽=right(우측 밀착), 그 외=center(발자국 중앙).
    // (footW 최대 2라 left·right 동시 스냅은 없음 — center 폴백.)
    function camAnchorMode(c, footW){ const right=c+footW-1;
      if(c===1 && right!==GRID_N) return 'left';
      if(right===GRID_N && c!==1) return 'right';
      return 'center'; }
    // 가구 그래픽 가로세로비(cols/rows) — 그래픽 폭 = fh*aspect. 캠 중심 x 계산(buildActors)에 사용.
    const FURN_ASPECT = { pond:1.722, tower:0.64, scratcher:0.842, pethouse:0.895, catwheel:1.0, plant:0.727, litterbox:1.222, cushion:1.222, bowl:1.375, waterbowl:1.375, rug:2.154, window:0.875, fishtank:1.111, fireplace:1.067, fan:0.8, hammock:0.941, teaser:0.842, wallclock:0.889, hangplant:1.0, mobile:1.333, chandelier:1.333, jingleball:1.0, frame:1.077, shelf:1.571, mirror:1.0, neon:1.143, sconce:1.143, garland:3.333, poster:1.0, tapestry:0.923, cactus:0.615, yarnbasket:0.9, floorlamp:0.64, beanbag:1.059, groomstation:0.762, springtoy:0.762, tunnel:1.421, teepee:0.8, bookshelf:0.615, birdcage:0.667, lavalamp:0.696, laserpost:0.762, waterfountain:0.762, sofa:1.688, recordplayer:0.941, terrarium:0.941, ballpit:1.867, grandfaclock:0.571, bunkbed:0.727, crystalfountain:1.368, dartboard:1.0, cuckooclock:0.762, roundbed:1.385, donutbed:1.385, cavebed:1.111, canopybed:0.947, throne:0.9, mousetoy:1.25, catnippillow:1.25, puzzlefeeder:1.25, balltrack:2.083, teetertoy:1.25, bubblemachine:1.067, bonsai:0.889, globe:1.0, snowglobe:1.067, campfire:1.067, gramophone:1.0, arcademachine:1.0, jukebox:1.067, crystalcluster:1.143, easel:1.067, floorvase:1.067, suitofarmor:1.0, hourglass:1.067, telescope:1.0, gumballmachine:1.067, wallvines:1.308, pennant:1.75, wallmask:0.923, barometer:0.857, stringlights:3.167, wallbutterfly:1.062, cornershelf:1.333, wallsun:1.0, treatjar:0.875, catgrass:1.143, groomarch:1.143, heatpad:1.25, peekbox:1.25, tetherpole:1.067, windmilltoy:1.067, crinklebag:1.125, roundrug:1.583, runner:2.3, koipond:1.75, displaycase:1.143, woodstove:1.067, mushroomlamp:1.143, statuecat:1.067, teacart:1.231, crystaltree:1.067, treadmill:1.286, laserbot:1.444, rcmouse:2.188, slalom:1.417, sprinttrack:3.5, cucumber:1.25, milkbar:0.818, dispenser:0.643, birdfeeder:0.688, hamstercage:0.833 };
    function furnAspect(id){ return FURN_ASPECT[id]||1; }
    function furnRoomH(id, isDock, depth){
      const mult = ROOM_H[id] || 1;
      // 근거리(depth 0)는 크게. 원거리 축소폭은 크기에 비례 — 작은 가구(방석·그릇)는 멀어도 덜 작게(완만),
      // 캣타워처럼 큰 가구는 멀수록 더 작게(원근 강하게).
      // dock·홈 동일 크기: dock가 이제 알뜰홈과 거의 같은 크기의 라운드 카드(224 vs 244)라 별도 축소가 불필요(예전 base 11/16 분기 제거).
      const base = 16;
      const shrink = 3 + Math.max(0, mult-1);
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
    // 🍀 오늘 가계부/할일을 기록했는지(수익배율 '오늘 기록 부스트'용) — daily 'record' 미션과 동일 판정.
    function recordedToday(){ return (state.transactions||[]).some(t=>(t.date||'').slice(0,10)===kstDayKey())
      || ((state.todos||[]).concat(state.myTodos||[])).some(t=>(t.createdAt||'').slice(0,10)===kstDayKey()); }
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
    const TODO_REWARD=10, TODO_DAILY_CAP=5;   // 할일 완료 시 은화(할일당 1회, todos.rewardClaimed로 멱등) · 은화는 하루 TODO_DAILY_CAP개까지만(도배 억제, 경제 정책 §3-B)
    // 할일 완료 은화(할일당 1회 멱등은 호출측 rewardClaimed). 여기선 '하루 TODO_DAILY_CAP개까지만' 은화 상한(todoDay 카운터). 상한 넘으면 완료는 되지만 은화 0(도배 억제).
    // cb(paid): 실제 지급된 은화(상한 초과·미커밋이면 0). 호출측이 지급됐을 때만 정확한 금액을 토스트하도록(grantQualityBonus와 동일 패턴).
    function grantTodoCoins(cb){ if(!state.uid){ if(cb) cb(0); return; } let paid=0; gameRef().transaction(function(g){ g=normalizeGame(g); paid=0; const d=kstDayKey();
      if((g.todoDay&&g.todoDay.day)!==d) g.todoDay={day:d,n:0};
      if((Number(g.todoDay.n)||0)>=TODO_DAILY_CAP) return g;
      g.todoDay.n=(Number(g.todoDay.n)||0)+1; g.coins=clampCoins((g.coins||0)+TODO_REWARD); paid=TODO_REWARD; return g;
    }).then(function(r){ if(cb) cb((r&&r.committed)?paid:0); }).catch(function(){ if(cb) cb(0); }); }
    // ✍️ 성실 기록 보너스 — 카테고리+메모를 채운 '새 거래' 저장 시 은화. 하루 QUALITY_DAILY_CAP건까지(도배 억제, 경제 정책 §3-A). 지급됐을 때만 토스트.
    const QUALITY_BONUS=15, QUALITY_DAILY_CAP=3;
    function grantQualityBonus(){ if(!state.uid) return; let paid=false; gameRef().transaction(function(g){ g=normalizeGame(g); paid=false; const d=kstDayKey();
      if((g.qualityDay&&g.qualityDay.day)!==d) g.qualityDay={day:d,n:0};
      if((Number(g.qualityDay.n)||0)>=QUALITY_DAILY_CAP) return g;
      g.qualityDay.n=(Number(g.qualityDay.n)||0)+1; g.coins=clampCoins((g.coins||0)+QUALITY_BONUS); paid=true; return g;
    }).then(function(r){ if(r&&r.committed&&paid) toast('✍️ 성실 기록 보너스 +'+QUALITY_BONUS+' 은화'); }); }

    // ===== 내 미션(커스텀 습관) — 개인 전역 game 트리. 일일 미션 경제(멱등 체크인)에 흡수 =====
    const CUSTOM_MISSION_REWARD=2;   // (레거시) 예전 일일 보상 — 현재 미사용
    const CUSTOM_STREAK_N=7, CUSTOM_STREAK_BONUS=40;   // 내 미션: 매일 체크는 무보상, N일 연속 마일스톤마다 +BONUS 은화(경제 정책 §3-F)
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
      if(id) h+='<button class="btn ghost" style="margin-top:8px;" '+App.view.act('deleteCustomMission',id)+'>삭제</button>';
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
    const MAX_RBCOIN=999999;   // 🌈 무지개동전 상한(단일 소스 — normalizeGame/grantRbcoin/선물함 공용)
    function clampRbcoin(v){ return Math.min(MAX_RBCOIN, Math.max(0, Math.floor(Number(v)||0))); }
    function clampGold(v){ return Math.min(MAX_GOLD, Math.max(0, Math.floor(Number(v)||0))); }
    function clampConsum(v){ return Math.min(MAX_CONSUM, Math.max(0, Math.floor(Number(v)||0))); }
    function atMaxCoins(){ return coins()>=MAX_COINS; }
    function atMaxGold(){ return gold()>=MAX_GOLD; }
    function maxChip(){ return ' <span class="maxchip">최대</span>'; }
    function normalizeGame(g){ g=g||{}; return migratePetIds({
      coins: clampCoins(g.coins), gold: clampGold(g.gold),
      pendingGold: Math.min(999999, Math.max(0, Math.floor(Number(g.pendingGold)||0))),   // 💰 수확 대기 금화(reconcileDrops가 누적·batchCare가 수확 시 지갑으로) — normalizeGame이 객체 재생성하므로 반드시 유지
      owned:{ cats:(g.owned&&g.owned.cats)||{}, items:(g.owned&&g.owned.items)||{}, wallpapers:(g.owned&&g.owned.wallpapers)||{}, floors:(g.owned&&g.owned.floors)||{}, bgfx:(g.owned&&g.owned.bgfx)||{}, hats:(g.owned&&g.owned.hats)||{}, petfx:(g.owned&&g.owned.petfx)||{} },   // 💗 hats/petfx=코스메틱 인벤토리(own-once) — 모자=이벤트·쿠폰·선물 지급, 펫효과=랜덤박스+지급
      consum:{ food:clampConsum(g.consum&&g.consum.food), water:clampConsum(g.consum&&g.consum.water), food_plus:clampConsum(g.consum&&g.consum.food_plus), water_plus:clampConsum(g.consum&&g.consum.water_plus), treat:clampConsum(g.consum&&g.consum.treat), tonic:clampConsum(g.consum&&g.consum.tonic), egg:clampConsum(g.consum&&g.consum.egg), box:clampConsum(g.consum&&g.consum.box), rainbow_egg:clampConsum(g.consum&&g.consum.rainbow_egg), rainbow_box:clampConsum(g.consum&&g.consum.rainbow_box), ddeul:clampConsum(g.consum&&g.consum.ddeul), dye:clampConsum(g.consum&&g.consum.dye), dye_remover:clampConsum(g.consum&&g.consum.dye_remover) },
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
      dexClaims: (g.dexClaims && typeof g.dexClaims==='object') ? g.dexClaims : {},   // 📖 도감 마일스톤 수령 마커(멱등)
      harvestGold: (g.harvestGold && typeof g.harvestGold==='object') ? g.harvestGold : {},   // (레거시) 구 수확 금화 하루 1회 마커 {day} — 현재 미사용(수확 드롭이 시간당 롤로 대체)
      freePull: (g.freePull && typeof g.freePull==='object') ? g.freePull : {},   // 🎁 일일 무료 1뽑 사용 마커 {ddeul|egg|box:'YYYY-MM-DD'} — kstDayKey 기준, 밤 12시(자정) 자연 초기화
      // ⏱️ 일일 상한 카운터(경제 정책, 도배 억제) — kstDayKey 기준 {day,n}. normalizeGame이 객체를 재생성하므로 반드시 여기 유지해야 안 지워짐.
      todoDay: (g.todoDay && typeof g.todoDay==='object') ? g.todoDay : {},        // 할일 완료 은화 하루 카운트(≤TODO_DAILY_CAP)
      petDay: (g.petDay && typeof g.petDay==='object') ? g.petDay : {},            // 쓰다듬기 은화 하루 카운트(≤PET_DAILY_CAP; 애정은 무제한)
      qualityDay: (g.qualityDay && typeof g.qualityDay==='object') ? g.qualityDay : {},   // 성실 기록 보너스 하루 카운트(≤QUALITY_DAILY_CAP)
      gachaGold: (g.gachaGold && typeof g.gachaGold==='object') ? g.gachaGold : {},  // 가챠 부산물 금화 하루 카운트(≤GACHA_GOLD_CAP 뽑)
      buyDay: (g.buyDay && typeof g.buyDay==='object') ? g.buyDay : {},      // 🛒 하루 구매 카운트(품목별) {day, n:{id:count}} — 츄르(5)·영양제(무료 1) 등 dailyBuy 소비템
      boost: (g.boost && typeof g.boost==='object') ? { until:Math.max(0,Math.floor(Number(g.boost.until)||0)), mult:Math.max(1,Number(g.boost.mult)||1) } : { until:0, mult:1 },   // 💊 수확 수익 부스트 버프 {until(ms), mult}
      dropRollAt: Math.max(0, Math.floor(Number(g.dropRollAt)||0)),   // 🎁 드랍 스폰 롤 시계(ms, 전역 1개) — reconcileDrops가 10분 단위로 소비
      affV: Math.max(0, Math.floor(Number(g.affV)||0)),   // 💗 애정 계단 개편 마이그레이션 마커(2=완료, migrateAffRwIfNeeded) — normalizeGame이 객체를 재생성하므로 반드시 여기 유지
      // 🌈 무지개동전 — 🛟 자가복구 바닥: 시드 완료(rbcoinSpentV≥1) 후엔 잔액이 (누적획득−누적소비) 아래로 "유실"되면 그 값으로 복원(치명 유실 방지).
      //   over-grant 방지: 정상 소비는 spendRbcoin이 rbcoinSpent를 함께 올려 바닥=실제잔액 유지 → max()가 아무 것도 안 올림. 시드 전(구데이터)엔 원값 그대로.
      rbcoin: (Math.floor(Number(g.rbcoinSpentV)||0)>=1)
        ? Math.max(clampRbcoin(g.rbcoin), clampRbcoin((Number(g.rbcoinTotal)||0)-(Number(g.rbcoinSpent)||0)))
        : clampRbcoin(g.rbcoin),   // 🌈 무지개동전 잔액 — 한정 중복 +1, 무지개알/박스 5개 소비
      rbcoinTotal: Math.max(0, Math.floor(Number(g.rbcoinTotal)||0)),   // 🌈 누적 획득(감소 없음 — grantRbcoin만 올림)
      rbcoinSpent: Math.max(0, Math.floor(Number(g.rbcoinSpent)||0)),   // 🌈 누적 소비(감소 없음 — spendRbcoin만 올림). 잔액=획득−소비 재구성 축
      rbcoinSpentV: Math.max(0, Math.floor(Number(g.rbcoinSpentV)||0)),   // 🌈 소비카운터 시드 마커(1=시드 완료 → 자가복구 활성)
      rbMigV: Math.max(0, Math.floor(Number(g.rbMigV)||0))   // 🌈 무지개 경제 개편 마이그레이션 마커(1=완료, migrateRbEconomyIfNeeded)
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
    // 🫶 친구 집 방문(좋아요) 보상: 방문자 +VISIT_REWARD(10) 은화(하루 VISIT_DAILY=3회까지). cb(지급은화).
    const VISIT_REWARD=10, VISIT_DAILY=3;
    function grantVisitReward(cb){ if(!state.uid){ if(cb) cb(0); return; } const today=todayKst(); let rew=0;   // 일일 캡 경계 KST 통일(다른 데일리 캡과 동일)
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
    // 📖 도감 대상 = 전체 펫(2026-07 무지개 개편·사용자 지침): 한정 전 펫이 무지개알(rainbowCatTierMap=effCatTier)에서 출현하므로
    //    구 '휴면 한정 제외' 필터 폐지 — 분모·종완성·그리드에 한정 포함(전부 획득 가능 콘텐츠). isExGachaActive는 펫알(gachaCatTierMap) 풀에만 계속 사용.
    function dexCatalog(){ return PET_CATALOG.slice(); }
    function dexCatIds(){ return dexCatalog().map(function(c){ return c.id; }); }
    function _dexSpecies(owned){ const bs={}; dexCatalog().forEach(c=>{ const b=bs[c.species]=bs[c.species]||{t:0,o:0}; b.t++; if(owned[c.id]) b.o++; }); return bs; }
    function _dexUnclaimed(g){ const own=(g.owned&&g.owned.cats)||{}, cl=g.dexClaims||{}, ids=dexCatIds();
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
      state._myLikesRef.on('value', s=>{ state.myLikeCount=homeLikeCount(s.val()); maybeClaimLikeMilestone(state.myLikeCount); writeMyRanking(); if(typeof rerender==='function') rerender('social'); }, ()=>{}); }
    // 공개 랭킹용 경량 엔트리(소유자 유지) — 이름·좋아요수·공개여부. 좋아요 변동·프로필 저장·진입 시 갱신.
    function writeMyRanking(){ if(!state.uid) return;
      if(!state._catPetsReady) return;   // 런타임 펫 카탈로그 도착 전엔 보류 — 그 펫들이 normal 임계로 계산돼 aff가 일시 과대 기록되는 것 방지(도착 시 watchCatalogPets가 재호출)
      const affT=(state.game&&state.game.owned)?totalAffectionLv(state.game.owned.cats||{}, id=>CAT_TIER[id]||'normal'):0;   // 💗 총 애정레벨 합(랭킹 과시)
      const sig=(state.userName||'')+'|'+(state.myLikeCount||0)+'|'+(state.profilePublic===false?'1':'0')+'|'+affT;
      if(sig===state._rankSig) return;   // 🔋 값(이름·좋아요수·공개여부·애정합)이 실제로 바뀔 때만 set — 좋아요 틱마다 무조건 쓰던 원격 쓰기 증폭 제거(writeHomeCam 선례)
      state._rankSig=sig;
      try{ db.ref('rankings/'+state.uid).set({ name:(state.userName||''), likes:(state.myLikeCount||0), aff:affT, private:(state.profilePublic===false), at:new Date().toISOString() }); }catch(e){ state._rankSig=null; }
    }
    let _cfgListenersInit=false;   // 전역 config/* 리스너 1회 부착 가드 — 계정 전환(로그아웃→로그인) 반복 시 리스너 N중 누적 방지
    function initCatGame(){
      if(!state.uid) return;
      if(state._gameRef){ try{ state._gameRef.off(); }catch(e){} }
      state._gameRef=gameRef();
      state._gameRef.on('value', s=>{ const raw=s.val(); state.game=normalizeGame(raw); migrateHomeRoomsIfNeeded(raw); migrateAffRwIfNeeded(raw); migrateRbEconomyIfNeeded(raw); migrateRbcoinSpentIfNeeded(raw); ensureRoomIds(); ensureHarvestClocks(); onGameChange(); reconcilePets(); reconcileDrops(); checkDexMilestones(); });
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
        try{ const _rm=window.matchMedia('(prefers-reduced-motion: reduce)'); (_rm.addEventListener?_rm.addEventListener.bind(_rm,'change'):_rm.addListener.bind(_rm))(function(){ refreshRbStatic(); invalidateSceneCaches(); if(typeof rerender==='function') rerender(); }); }catch(e){}   // OS 모션축소 토글 시 무지개 정적화 즉시 반영(1회 부착)
        try{ setTimeout(maybeSuggestLite, 4000); }catch(e){}   // 🔋 저사양 기기면 1회만 가벼운 모드 안내(사용자 선택)
      }
      loadBroadcasts();     // 📣 전체 선물(config/broadcast) 구독 — 유저별 수령이라 로그인마다 재구독(off 후 on)
      loadMyAdminGifts();   // 🎁 내게 온 특정-유저 선물(users/{uid}/adminGifts) — uid별이라 이전 ref off 후 재구독
      applyLiteMode();  // 🔋 저장된 가벼운 모드(body.lite) 반영
      refreshRbStatic();   // 🌈🔋 무지개 SMIL 정적화 여부 초기 평가(저사양·모션축소)
      startCatLoop();   // 통합 걷기 엔진(단일 rAF, 보이는 무대만 애니메이션)
      // 앱을 켜둔 동안에도 그릇 만료→똥 정산 + 드랍 스폰 롤이 돌도록 주기 점검(다마고치)
      if(state._petTimer) clearInterval(state._petTimer);
      state._petTimer=setInterval(function(){ reconcilePets(); reconcileDrops(); }, 60000);
      // 🦋 희귀 손님 체크(90초, 낮은 확률 방문) — 로컬 장식이라 game 트랜잭션 없음
      if(state._guestTimer) clearInterval(state._guestTimer);
      state._guestTimer=setInterval(maybeRareGuest, 90000);
    }
    // ⚡ game 델타마다 dock·홈을 통째로 갱신하던 것을 rAF 코얼레싱(연속 변경 1프레임 1회) + dock 숨김이면 dock DOM 갱신 스킵.
    let _ogcRAF=0;
    function onGameChange(){ if(_ogcRAF) return; _ogcRAF=1;
      // 🖥️ 메인 탭이 숨겨진 채 PiP만 떠 있으면 메인 rAF가 안 돌므로 PiP 창의 rAF로 코얼레싱(미니 캠 라이브 반영 유지). PiP가 닫히면 _pipClosed가 메인으로 재예약.
      const raf=(typeof document!=='undefined'&&document.hidden&&typeof pipOpen==='function'&&pipOpen())?_pip.win.requestAnimationFrame.bind(_pip.win):requestAnimationFrame;
      raf(function(){ _ogcRAF=0; _onGameChangeNow(); }); }
    function _onGameChangeNow(){
      updateNewsBadge();
      // 💎 새 드랍 스폰 감지 → 거대 보석 원샷(로컬·타 기기 스폰 모두 커버). 수집(감소)·첫 로드엔 안 뜸.
      try{ const ids=[]; ((state.game&&state.game.home.rooms)||[]).forEach(R=>{ ((R&&R.drops)||[]).forEach(d=>{ if(d) ids.push(d.id); }); });
        const prev=state._dropIds; state._dropIds=ids;
        if(prev && ids.some(id=>prev.indexOf(id)<0) && typeof dropSpawnGemFx==='function') dropSpawnGemFx();
      }catch(e){}
      if(dockMode()!=='hidden'){   // 🔋 dock 숨김이면 dock DOM 갱신 불필요(보일 때만)
        // ⚡ 씬 서명 가드 — 벽지/바닥/배경효과 id가 실제로 바뀔 때만 innerHTML 재생성한다(요소별 dataset.scenesig).
        //    안 그러면 드랍 스폰 같은 무관한 game 틱마다 움직이는 하늘/들판 SVG를 통째로 재파싱해 발열·마이크로 스터터를 유발(1분 드랍 대비 최적화).
        const dw=$('catdock');
        const wall=dw&&dw.querySelector('.cr-wall'), ws=currentWall(); if(wall && wall.dataset.scenesig!==ws){ wall.style.background=wallCss(ws); wall.innerHTML=wallSceneHtml(ws); wall.dataset.scenesig=ws; }   // 움직이는 하늘 벽지 씬 — id 변경 시에만
        const fl=dw&&dw.querySelector('.cr-floor'), fs=currentFloor(); if(fl && fl.dataset.scenesig!==fs){ fl.style.background=floorCss(fs); fl.innerHTML=floorSceneHtml(fs); fl.dataset.scenesig=fs; }   // 움직이는 들판 바닥 씬 — id 변경 시에만
        const ov=dw&&dw.querySelector('.cr-overlay'), os=currentBgfx(); if(ov && ov.dataset.scenesig!==os){ ov.innerHTML=bgfxOverlayHtml(os); ov.dataset.scenesig=os; }   // 배경효과 오버레이 — id 변경 시에만
        const rn=$('cdCamTxt'); if(rn){ rn.textContent=(room().emoji?room().emoji+' ':'')+(room().name||'우리집'); }   // dock LIVE 배지의 현재 방 이름(항상 표시)
        const tr=dw&&dw.querySelector('.cr-topright'); if(tr) tr.outerHTML=batchBtnHtml();   // dock 하트(행복도)·수확칩도 라이브 반영 — renderDock에서만 만들어져 0%로 굳던 버그(지갑은 _walletDisp/syncWalletText라 재렌더 안전)
        renderDockProps();
        renderDockCats();
      }
      if(typeof pipOpen==='function' && pipOpen()){   // 🖥️ PiP 미니 캠도 dock와 동일하게 라이브 패치(벽·바닥·오버레이·방이름·가구·펫)
        try{
          const pw=_pip.room.querySelector('.cr-wall'), pws=currentWall(); if(pw && pw.dataset.scenesig!==pws){ pw.style.background=wallCss(pws); pw.innerHTML=wallSceneHtml(pws); pw.dataset.scenesig=pws; }   // ⚡ 씬 서명 가드(dock와 동일)
          const pf=_pip.room.querySelector('.cr-floor'), pfs=currentFloor(); if(pf && pf.dataset.scenesig!==pfs){ pf.style.background=floorCss(pfs); pf.innerHTML=floorSceneHtml(pfs); pf.dataset.scenesig=pfs; }
          const po=_pip.room.querySelector('.cr-overlay'), pos=currentBgfx(); if(po && po.dataset.scenesig!==pos){ po.innerHTML=bgfxOverlayHtml(pos); po.dataset.scenesig=pos; }
          _pipSetCamTxt(); renderPipProps(); renderPipCats(); _pipBatchSync();
        }catch(e){}
      }
      if(typeof vpipOpen==='function' && vpipOpen()){ try{ _vpipSync(); }catch(e){} }   // 🎬 비디오 PiP도 방·가구·펫 변경 라이브 반영(서명 가드)
      if(state.view==='home' && typeof renderHome==='function') renderHome();   // 홈의 미션·은화 즉시 반영
      refreshMoreBadges();   // 더보기 그리드 알림 뱃지(선물함·소식…)가 game 변화(선물 받기·쿠폰 사용·공지 확인)에 즉시 반영되도록
      if(state._sheetRefresh && $('sheet') && $('sheet').classList.contains('on')) state._sheetRefresh();
      writeHomeCam();   // 대표 방 공개 스냅샷 갱신(친구·랭킹이 이것만 읽음 — 다른 방은 비공개)
      writeMyRanking();   // 💗 총 애정레벨 합도 랭킹 엔트리에 — 서명 가드라 값이 실제로 바뀔 때만 쓰기
    }
    // 친구·랭킹에 공개할 '대표 방' 스냅샷. 사적인 다른 방은 담지 않는다.
    function repRoomSnapshot(){ const h=homeH(); const rooms=h.rooms||[]; const i=Math.min(rooms.length-1, Math.max(0, (h.showRoom!=null?h.showRoom:0)|0)); const r=rooms[i]||rooms[0]||{};
      const act=(r.active||[]).filter(ownsCat);
      const pm={}; act.forEach(id=>{ const t=CAT_TIER[id]||'normal', oc=ownedCatsMap()[id]||{};   // 💗 애정 과시 메타(친구 캠 하트 배지·코스메틱·염색) — 레벨·장착·톤만(수치 비공개)
        pm[id]={ lv:affectionLevel(oc.affection, t).level, cosm:petCosm(id), dye:petDyeOf(id) }; });
      return { name:r.name||'', emoji:r.emoji||'', wallpaper:r.wallpaper||'default', floor:r.floor||'default', bgfx:r.bgfx||'', placed:r.placed||{}, wallPlaced:r.wallPlaced||{}, active:act, petsMeta:pm, slots:slotCount(), poops:Number(r.poops)||0, changedAt:h.changedAt||'' }; }
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
        '<button class="btn" '+App.view.act('saveRoomName',rid,idx)+'>이름 저장</button>';
      // 방 이모지(선택) — 썸네일·dock 이름 앞에 표시
      const EMO=['','🐱','🐯','🦁','🐶','🌙','☀️','🌸','🎋','🛋️','🌊','⭐'];
      body+='<div class="sech" style="margin-top:14px;"><span class="l">이모지</span></div>'+
        '<div class="emopick">'+EMO.map(e=>'<button class="emob'+((r.emoji||'')===e?' on':'')+'" onclick="setRoomEmoji(\''+rid+'\','+idx+',\''+e+'\')">'+(e||'없음')+'</button>').join('')+'</div>';
      // 대표 방(친구·랭킹에 보이는 방)
      const isRep=idx===(h.showRoom|0);
      body+='<div class="sech" style="margin-top:14px;"><span class="l">대표 방</span><span class="s">친구·랭킹에 보임</span></div>'+
        (isRep?'<p class="muted" style="font-size:12px;margin:0;">★ 이 방이 대표 방이에요. 친구가 내 집을 볼 때 이 방을 봅니다.</p>'
             :'<button class="btn ghost" '+App.view.act('setShowRoom',idx)+'>이 방을 대표 방으로 지정 ★</button>');
      // 순서 변경
      if(rc>1){ body+='<div class="sech" style="margin-top:14px;"><span class="l">순서 변경</span></div>'+
        '<div class="row" style="gap:8px;"><button class="btn ghost" style="flex:1;"'+(idx<=0?' disabled':'')+' '+App.view.act('moveRoom',idx,-1)+'>← 앞으로</button>'+
        '<button class="btn ghost" style="flex:1;"'+(idx>=rc-1?' disabled':'')+' '+App.view.act('moveRoom',idx,1)+'>뒤로 →</button></div>'; }
      const others=[]; for(let i=0;i<rc;i++){ if(i!==idx) others.push(i); }
      if(others.length){ body+='<div class="sech" style="margin-top:14px;"><span class="l">벽지 가져오기</span></div>'+
        '<div class="row" style="flex-wrap:wrap;gap:8px;">'+others.map(i=>{ const nm=(h.rooms[i].name)||('방 '+(i+1)), sid=h.rooms[i].id||''; return '<button class="btn ghost" onclick="copyRoomWall(\''+sid+'\',\''+rid+'\','+i+','+idx+')"><span class="wsw" style="background:'+wallCss(h.rooms[i].wallpaper||'default')+'"></span>'+escapeHtml(nm)+'</button>'; }).join('')+'</div>'; }
      // 방 복제(가구·벽지 통째 복사) — 방이 남았을 때만
      if(rc<MAX_ROOMS){ body+='<div class="sech" style="margin-top:14px;"><span class="l">방 복제</span><span class="s">가구·벽지 복사</span></div>'+
        '<p class="muted" style="font-size:12px;margin:0 0 8px;line-height:1.5;">벽지·이모지와 배치 가구를 새 방으로 복사해요(보유가 부족한 가구는 제외, 펫은 복사 안 함).</p>'+
        '<button class="btn ghost" '+App.view.act('duplicateRoom',rid,idx)+'>이 방 복제 📑</button>'; }
      body+='<div class="sech" style="margin-top:14px;"><span class="l">방 비우기 · 삭제</span></div>'+
        '<p class="muted" style="font-size:12px;margin:0 0 8px;line-height:1.5;">비우기=가구·펫만 초기화(방은 유지). 삭제=방 자체를 제거(환불 없음). 둘 다 가구는 인벤토리로 돌아가요.</p>'+
        '<button class="btn danger ghost" '+App.view.act('clearRoom',rid,idx)+'>이 방 비우기</button>'+
        (rc>BASE_ROOMS?'<button class="btn danger ghost" style="margin-top:6px;" '+App.view.act('deleteRoom',rid,idx)+'>이 방 삭제 (환불 없음)</button>':'')+
        '<button class="btn ghost" style="margin-top:6px;" '+App.view.act('closeRoomMenu')+'>닫기</button>';
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
        g.coins = clampCoins((g.coins||0) + m.reward);   // 상한 클램프 통일(다른 적립과 동일)
        if(m.gold) g.gold=clampGold((g.gold||0)+m.gold);   // 조직적 금화 획득(가챠 외 공급원)
        return g;
      });
    }
    // 프로모/치트 코드 — 보상은 곧바로 주지 않고 "선물함"으로 들어감(더보기 → 선물함에서 받기).
    // 규칙: 일반 사용자는 코드당 1회만, 개발자 계정(isDev)은 무제한. type=coins(은화) / consum(소비 아이템).
    // 🎟️ 2026-07 쿠폰 전량 삭제(사용자 지침) — @무제한 규칙도 폐지. 새 이벤트 코드는 운영 시점에 여기 추가(일반=코드당 1회 멱등, g.codes 마커).
    const PROMO_CODES = {
      // 2026-07-09 쿠폰 4종(사용자 지시 재등록). 중복 사용 차단 = redeemCode의 g.codes 마커 + 트랜잭션 재검증(코드당 1회, 다기기 동시 사용 안전).
      // 🌈 무지개알/박스는 2026-07 개편으로 소비 인벤토리가 폐지(무지개동전 5개=1뽑)라 동전 5개로 지급(type:'rbcoin').
      rainbowegg:   { type:'rbcoin', qty:5,  label:'무지개동전 5개' },   // 첫 키 = 쿠폰 목록·소식 최상단
      rainbowbox:   { type:'rbcoin', qty:5,  label:'무지개동전 5개' },
      eggardenbox:  { type:'consum', key:'box',   qty:10, label:'랜덤박스 10개' },
      eggarden0709: { type:'consum', key:'ddeul', qty:10, label:'뜰알 10개' }
    };
    function redeemCode(code){
      let key=(code||'').trim().toLowerCase();
      const def=PROMO_CODES[key];
      if(!def){ toast('올바르지 않은 코드예요', true); return; }
      const dev=(typeof isDev==='function' && isDev());   // 개발자=무제한, 일반은 코드당 1회(@무제한 폐지)
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
      food_plus: { name:'고급사료',   icon:o=>consumSvg('food_plus',o) },   // 그릇 탭/수확으로 소모(홈)
      water_plus:{ name:'정수물',     icon:o=>consumSvg('water_plus',o) },
      treat:     { name:'츄르',       icon:o=>consumSvg('treat',o),  use:'treat' },   // 🍡 가방에서 펫 선택해 사용(애정+1)
      tonic:     { name:'영양제',     icon:o=>consumSvg('tonic',o),  use:'tonic' },   // 💊 가방에서 사용(수확 부스트 3h)
      egg:       { name:'펫알',       icon:o=>eggSvg(0,o),        use:'egg'  },   // 일반 확률 오픈
      box:       { name:'랜덤박스',   icon:o=>boxSvg(o),          use:'box'  },
      rainbow_egg:{ name:'무지개알',  icon:o=>rainbowEggImg((o&&o.h)||52) },  // (레거시 표시용 — 2026-07 소비 인벤토리 폐지·회수, 무지개 탭에서 무지개동전으로 직접 뽑기)
      rainbow_box:{ name:'무지개박스',icon:o=>rainbowBoxSvg(o) },
      ddeul:     { name:'뜰알',       icon:o=>ddeulEggSvg(o),     use:'ddeul' },   // 🌱 한정 픽업(뜰알) — 보유 1개 소모해 열면 DDEUL_TIERS 확률(개발자 선물/지급 전용, 상점 비매)
      dye:       { name:'염색약',     icon:o=>consumSvg('dye',o), use:'dye'  },   // 🎨 랜덤 염색약 — 가방에서 펫 선택, 톤 랜덤 변경(알뜰샵 소비 탭 금화100 판매 + 이벤트·쿠폰·선물)
      dye_remover:{ name:'염색 리무버', icon:o=>consumSvg('dye_remover',o), use:'dye_remover' }   // 🧴 염색 제거 — 염색된 펫 선택해 원래 톤 복원(알뜰샵 소비 탭 금화200 판매 + 이벤트·쿠폰·선물)
    };
    // 선물 1건의 출처/사유 텍스트(어떤 행위·보상으로 받았는지). 메시지(운영·축하)가 있으면 우선, 없으면 코드/유형에서 파생.
    function giftSource(gf){ if(gf.msg) return gf.msg; if(gf.bc) return '운영자 선물'; if(gf.code) return '코드 '+String(gf.code).toUpperCase(); if(gf.welcome) return '회원가입 축하'; return ''; }
    // 선물 1건의 아이콘/이름(+출처 텍스트 sub)
    function giftView(gf){ let icon, name;
      if(gf.type==='coins'){ icon=coinSvg({h:30}); name=(gf.qty||0).toLocaleString()+' 은화'; }
      else if(gf.type==='gold'){ icon=goldSvg({h:30}); name=(gf.qty||1).toLocaleString()+' 금화'; }
      else if(gf.type==='rbcoin'){ icon=rainbowCoinSvg({h:28}); name='무지개동전 '+(gf.qty||1).toLocaleString()+'개'; }   // 🌈 무지개알/박스 1뽑=5개
      else if(gf.type==='hat'){ icon=hatSvg(gf.key,{h:26}); name=(HAT_CATALOG[gf.key]||gf.key); }   // 🧢 모자(own-once)
      else if(gf.type==='petfx'){ icon=buddySvgOf(gf.key,{h:24}); name=(BUDDY_CATALOG[gf.key]||gf.key)+' 펫효과'; }   // ✨ 펫효과(own-once)
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
            h+=mail.map(x=>{ const v=giftView(x.gf); return '<div class="giftrow"><span class="gfic">'+v.icon+'</span><span class="gftx"><b class="gfnm">'+escapeHtml(v.name)+'</b><span class="gfmsg">'+escapeHtml((x.gf.fromName||'친구')+'님이 보냄')+'</span></span><button class="buy" '+App.view.act('claimMailGift',x.sender,x.gid)+'>받기</button></div>'; }).join('');
            h+='<button class="btn ghost" style="margin:8px 0 4px;" '+App.view.act('claimAllMail')+'>친구 선물 모두 받기</button>';
          }
          if(gifts.length){
            if(mail.length) h+='<div class="sech"><span class="l">코드 보상</span><span class="s">'+gifts.length+'개</span></div>';
            h+=gifts.map((gf,i)=>{ const v=giftView(gf); return '<div class="giftrow"><span class="gfic">'+v.icon+'</span><span class="gftx"><b class="gfnm">'+escapeHtml(v.name)+'</b>'+(v.sub?'<span class="gfmsg">'+escapeHtml(v.sub)+'</span>':'')+'</span><button class="buy" '+App.view.act('claimGift',i)+'>받기</button></div>'; }).join('');
            h+='<button class="btn" style="margin-top:12px;" '+App.view.act('claimAllGifts')+'>모두 받기</button>';
          }
        }
        h+='</div>'; return h;
      };
      openSheet('선물함', build());
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(b) b.innerHTML=build(); };
    }
    function applyGiftToGame(g, gf){ if(gf.type==='coins') g.coins=(g.coins||0)+(Number(gf.qty)||0);
      else if(gf.type==='gold') g.gold=clampGold((g.gold||0)+(Number(gf.qty)||1));
      else if(gf.type==='rbcoin') grantRbcoin(g, Number(gf.qty)||1);   // 🌈 무지개동전(쿠폰·이벤트 지급 — 클램프·누적카운터는 grantRbcoin이 일괄)
      else if(gf.type==='consum' && (gf.key==='rainbow_egg'||gf.key==='rainbow_box')) grantRbcoin(g, (Number(gf.qty)||1)*5);   // 구 무지개알/박스 선물(마이그레이션 전 발송분)=동전 5개/개 환산 — 죽은 consum 부활 방지
      else if(gf.type==='consum' && gf.key) g.consum[gf.key]=(Number(g.consum[gf.key])||0)+(Number(gf.qty)||1);
      else if(gf.type==='hat' && gf.key && HAT_CATALOG[gf.key]){ g.owned.hats=g.owned.hats||{}; if(!g.owned.hats[gf.key]) g.owned.hats[gf.key]={boughtAt:new Date().toISOString()}; }   // 🧢 모자(own-once) — 이벤트·쿠폰·선물 지급
      else if(gf.type==='petfx' && gf.key && BUDDY_CATALOG[gf.key]){ g.owned.petfx=g.owned.petfx||{}; if(!g.owned.petfx[gf.key]) g.owned.petfx[gf.key]={boughtAt:new Date().toISOString()}; } }   // ✨ 펫효과(own-once)
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
          if(!b || !b.type || !(b.type==='coins'||b.type==='gold'||b.type==='rbcoin'||b.type==='consum'||b.type==='hat'||b.type==='petfx')) return;   // 🧢✨🌈 모자·펫효과·무지개동전 브로드캐스트 지급 허용
          const gift={ type:b.type, qty:Math.max(1, Number(b.qty)||1), at:b.at||new Date().toISOString(), bc:true };
          if(b.type==='consum'||b.type==='hat'||b.type==='petfx'){ if(!b.key) return; gift.key=b.key; }   // key 필요 타입은 key 보존(모자·펫효과는 key 없으면 수령 시 무음 소실이었음)
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
      const gifts=ids.map(function(id){ const b=map[id]; if(!(b.type==='coins'||b.type==='gold'||b.type==='rbcoin'||b.type==='consum'||b.type==='hat'||b.type==='petfx')) return null; const gift={ type:b.type, qty:Math.max(1, Number(b.qty)||1), at:b.at||new Date().toISOString(), bc:true }; if(b.type==='consum'||b.type==='hat'||b.type==='petfx'){ if(!b.key) return null; gift.key=b.key; } if(b.msg) gift.msg=String(b.msg).slice(0,200); return gift; }).filter(Boolean);   // 🌈🧢✨ broadcast와 대칭(rbcoin·모자·펫효과)
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
      const consumKeys=['egg','box','ddeul','dye','dye_remover'];   // 🎨 염색약·리무버 — 알뜰샵 판매(금화) + 선물 지급 병행
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
      const opts=[['coins','은화'],['gold','금화'],['rbcoin','무지개동전'],['egg','펫알'],['box','랜덤박스'],['ddeul','뜰알'],['dye','염색약'],['dye_remover','염색 리무버']];   // 🌈 무지개알/박스 소비템은 폐지(수령분은 동전 환산) — 동전으로 직접 지급. 🎨 염색약·리무버=지급 전용 소비템
      let h='<div class="note">선물함에 아이템+<b>메시지</b>를 넣어 보내요(예: 오류로 인한 사과의 선물). <b>받는 사람</b>을 <b>비우면 전체</b>(공개 config/broadcast), <b>친구코드</b>를 넣으면 <b>그 사용자에게만 비공개</b>로 갑니다. 각 사용자는 접속 시 1회 수령.</div>';
      h+='<div class="field"><label for="bc_to">받는 사람(친구코드)</label><input class="input" id="bc_to" maxlength="6" autocapitalize="characters" spellcheck="false" placeholder="비우면 전체 · 예: ABC123" style="text-transform:uppercase;"></div>';
      h+='<div class="field"><label for="bc_type">종류</label><select class="input" id="bc_type">'+opts.map(function(o){ return '<option value="'+o[0]+'">'+o[1]+'</option>'; }).join('')+'</select></div>';
      h+='<div class="field"><label for="bc_qty">수량</label><input class="input" id="bc_qty" inputmode="numeric" placeholder="예: 100" value="1"></div>';
      h+='<div class="field"><label for="bc_msg">메시지(선택)</label><input class="input" id="bc_msg" maxlength="200" placeholder="예: 오류로 인한 사과의 선물입니다"></div>';
      h+='<button class="btn" style="margin-top:6px;" '+App.view.act('sendBroadcast')+'>보내기</button>';
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
        const order=['egg','box','ddeul','treat','tonic','dye','dye_remover','food','water','food_plus','water_plus'];   // (무지개알·박스는 소비 인벤토리 폐지 — 무지개 탭 직접 뽑기)
        const rows=order.filter(k=>consumQty(k)>0);
        const g=state.game, boostOn=activeBoostMult(g)>1;
        let h='<div class="bag">';
        if(!rows.length){ h+='<div class="empty" style="padding:30px 12px;">가방이 비었어요. 알뜰샵·선물함에서 아이템을 얻어보세요 🎒</div>'; }
        else h+=rows.map(k=>{ const m=CONSUM_META[k], q=consumQty(k);
          // 가방 사용 3갈래: 간식·영양제·염색약=바로 사용 / 알·박스류=가챠샵 이동 / 사료·물류=홈 그릇 탭 안내.
          const bagUse=(m.use==='treat'||m.use==='tonic'||m.use==='dye'||m.use==='dye_remover');
          const useBtn = bagUse ? '<button class="buy sm" '+App.view.act('useBagItem',k)+' aria-label="'+m.name+' 사용">사용</button>'
                       : (m.use ? '<button class="buy ghost sm" '+App.view.act('goGachaShop')+' aria-label="'+m.name+' 가챠샵에서 열기">가챠샵에서 열기</button>'
                                : '<span class="qty" style="font-size:11px;color:var(--sub)">홈에서 그릇 탭</span>');
          const sub=(k==='tonic'&&boostOn)?' <span class="tagmini">사용중 '+fmtDur(boostRemain(g))+'</span>':'';
          return '<div class="bagrow"><span class="bgic">'+m.icon({h:34})+'</span><b class="bgnm'+((k==='rainbow_egg'||k==='rainbow_box'||k==='ddeul')?' tier-rainbow':'')+'">'+m.name+sub+'</b><span class="qty">보유 '+q.toLocaleString()+(q>=MAX_CONSUM?maxChip():'')+'</span>'+useBtn+'</div>'; }).join('');
        h+='<div class="note" style="margin-top:12px;">사료·물·고급사료·정수물은 홈에서 <b>밥·물 그릇을 탭</b>(또는 수확)해 써요. <b>츄르</b>는 펫을 골라 애정을, <b>영양제</b>는 6시간 수익 부스트에 써요. 펫알·랜덤박스·무지개는 <b>가챠샵</b>에서 열어요.</div></div>';
        return h;
      };
      openSheet('가방', build());
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(b) b.innerHTML=build(); };
    }
    function useBagItem(k){ const use=(CONSUM_META[k]||{}).use;
      if(use==='egg'||use==='box') useHeldGacha(use);
      else if(use==='ddeul') useHeldDdeul();
      else if(use==='treat') useTreat();
      else if(use==='tonic') useTonic();
      else if(use==='dye') useDye();
      else if(use==='dye_remover') useDyeRemover(); }
    // ⏱️ ms→"Nh Mm"/"Mm" 간단 표기(부스트 남은시간·소비템)
    function fmtDur(ms){ ms=Math.max(0,Number(ms)||0); const mm=Math.round(ms/60000), h=Math.floor(mm/60), m=mm%60; return h>0?(h+'시간'+(m?' '+m+'분':'')):(m+'분'); }
    // 🎨 염색 색상 카탈로그(2026-07 대확장) — 절대색(전신 틴트) 45색: 어떤 펫이든 지정 색으로 일관 염색(이름 표기 가능, 흑·백·회·브라운 포함).
    //    유채·브라운 = grayscale(1) sepia(1) saturate(S) hue-rotate(Hdeg) brightness(B) — sepia 기준색(≈골드브라운)에서 회전, 명암·외곽선(루미넌스) 보존.
    //    무채 = grayscale(1) brightness(B). 파라미터는 CSS 필터 행렬을 파이썬으로 재현한 스와치 시트로 검수 후 확정(2026-07-09).
    //    ⚠️ legacy 하위호환: 구 저장값(숫자 hue 40~320)은 dyeFilterCss가 hue-rotate로 계속 해석(LEGACY_DYE_HUES 화이트리스트).
    const LEGACY_DYE_HUES=[40,80,120,160,200,240,280,320];
    const DYE_CATALOG=(function(){ const out=[];
      const C=function(id,name,g,h,s,b){ out.push({ id:id, name:name, g:g, css:'grayscale(1) sepia(1) saturate('+s+') hue-rotate('+h+'deg) brightness('+b+')' }); };
      const A=function(id,name,b){ out.push({ id:id, name:name, g:'무채', css:'grayscale(1) brightness('+b+')' }); };
      C('cherry','체리','레드',-40,2.6,0.9);      C('scarlet','스칼렛','레드',-30,2.4,1.0);   C('crimson','크림슨','레드',-45,2.0,0.82);
      C('wine','와인','레드',-55,1.6,0.66);       C('rose','로즈','레드',-50,1.4,1.05);
      C('babypink','베이비핑크','핑크',-70,1.0,1.28); C('pink','핑크','핑크',-75,1.5,1.12);   C('hotpink','핫핑크','핑크',290,2.4,1.05);
      C('magenta','마젠타','핑크',275,2.4,0.95);  C('lilacpink','연보라핑크','핑크',-95,1.1,1.15);
      C('apricot','살구','오렌지',-12,1.1,1.2);   C('coral','코랄','오렌지',-25,1.6,1.1);     C('orange','오렌지','오렌지',-15,2.2,1.02);
      C('tangerine','탠저린','오렌지',-8,2.6,1.0);
      C('cream','크림','옐로우',8,0.8,1.28);      C('lemon','레몬','옐로우',15,1.8,1.22);     C('gold','골드','옐로우',5,2.2,1.05);
      C('mustard','머스터드','옐로우',10,1.6,0.88);
      C('lime','라임','그린',45,1.8,1.12);        C('green','그린','그린',80,1.8,0.95);       C('forest','포레스트','그린',90,1.6,0.72);
      C('olive','올리브','그린',35,1.3,0.82);
      C('mint','민트','민트',115,1.2,1.18);       C('emerald','에메랄드','민트',105,1.9,0.9); C('teal','틸','민트',135,1.6,0.85);
      C('sky','하늘','블루',155,1.3,1.18);        C('blue','파랑','블루',180,2.0,0.95);       C('cobalt','코발트','블루',185,2.4,0.8);
      C('navy','네이비','블루',190,2.2,0.55);
      C('lavender','라벤더','퍼플',225,1.0,1.2);  C('violet','바이올렛','퍼플',235,1.7,0.98); C('purple','퍼플','퍼플',245,1.9,0.8);
      C('plum','플럼','퍼플',262,1.5,0.72);
      C('beige','베이지','브라운',2,0.7,1.18);    C('sand','샌드','브라운',4,0.95,1.06);      C('caramel','카라멜','브라운',-4,1.5,0.98);
      C('brown','브라운','브라운',-8,1.4,0.8);    C('choco','초코','브라운',-12,1.3,0.62);    C('darkchoco','다크초코','브라운',-14,1.2,0.46);
      A('white','화이트',1.5);  C('ivory','아이보리','무채',6,0.35,1.38);  A('silver','실버',1.18);
      A('gray','그레이',0.95);  A('charcoal','차콜',0.68);                 A('black','블랙',0.4);
      // ── ✨ 무채·다크·뮤트 확장 55색 (2026-07 사용자 지침: 기존 밝은 색은 그대로 두고 형광 회피·무채/어두운 톤·인기 게임 염색 레퍼런스 대량 추가 → 총 100색) ──
      //   회색 램프에 CSS 필터 체인을 파이썬으로 재현해 실색 검수(무채=밝기만, 유채=저채도·저명도로 뮤트/다크). 채도(s)↓=무채감, 명도(b)↓=어둡게.
      // 무채·중성(16)
      A('jetblack','제트블랙',0.13);   A('ink','먹색',0.26);            A('soot','수트',0.52);
      C('gunmetal','건메탈','무채',200,0.18,0.5);  C('slate','슬레이트','무채',210,0.18,0.72);  C('ash','애쉬','무채',205,0.15,0.85);
      C('stone','스톤','무채',25,0.2,0.85);        A('pewter','퓨터',0.8);                     C('fog','포그','무채',195,0.2,1.05);
      A('pearl','펄',1.32);            A('snow','스노우',2.0);          C('bone','본화이트','무채',14,0.3,1.32);
      C('warmgray','웜그레이','무채',8,0.16,0.92); C('coolgray','쿨그레이','무채',195,0.16,0.92);
      C('greige','그레이지','무채',10,0.3,1.02);   C('taupe','토프','무채',6,0.42,0.74);
      // 다크(19)
      C('oxblood','옥스블러드','레드',-48,1.9,0.48); C('burgundy','버건디','레드',-52,1.7,0.46); C('maroon','마룬','레드',-46,1.7,0.55);
      C('brick','벽돌','오렌지',-28,1.7,0.66);     C('rust','러스트','오렌지',-18,1.9,0.68);     C('umber','엄버','브라운',-6,1.3,0.42);
      C('espresso','에스프레소','브라운',-12,1.1,0.32); C('deepbrown','딥브라운','브라운',-8,1.4,0.5); C('darkolive','다크올리브','그린',38,1.3,0.52);
      C('hunter','헌터그린','그린',96,1.6,0.48);   C('pine','파인그린','그린',105,1.4,0.42);     C('darkteal','딥틸','민트',140,1.5,0.52);
      C('petrol','페트롤','민트',152,1.4,0.5);     C('midnight','미드나잇','블루',196,2.0,0.38); C('indigo','인디고','블루',208,1.8,0.5);
      C('eggplant','가지','퍼플',258,1.5,0.48);    C('deepplum','딥플럼','퍼플',262,1.4,0.55);   C('darkmauve','다크모브','퍼플',272,0.9,0.58);
      C('blackcherry','블랙체리','레드',-50,1.4,0.4);
      // 뮤트·더스티(20)
      C('dustyrose','더스티로즈','핑크',-44,0.9,0.98); C('mauve','모브','핑크',282,0.7,0.9);      C('blush','블러쉬','핑크',-66,0.7,1.12);
      C('rosegold','로즈골드','오렌지',-24,0.8,1.12); C('terracotta','테라코타','오렌지',-20,1.3,0.9); C('clay','클레이','오렌지',-10,1.0,0.82);
      C('camel','카멜','브라운',-2,0.9,0.95);      C('ochre','오커','옐로우',12,1.4,0.82);       C('khaki','카키','옐로우',25,0.9,0.85);
      C('sage','세이지','그린',70,0.7,0.95);       C('moss','모스','그린',55,0.95,0.72);         C('seafoam','씨폼','민트',120,0.6,1.05);
      C('dustyteal','더스티틸','민트',138,0.8,0.85); C('dustyblue','더스티블루','블루',175,0.8,0.92); C('denim','데님','블루',186,1.0,0.74);
      C('steelblue','스틸블루','블루',182,0.7,0.82); C('slateblue','슬레이트블루','퍼플',206,0.7,0.78); C('dustylavender','더스티라벤더','퍼플',230,0.6,1.02);
      C('dustypurple','더스티퍼플','퍼플',250,0.8,0.76); C('champagne','샴페인','옐로우',10,0.5,1.2);
      // ── ✨ 중간톤(everyday) 100색 — 밝은 원색과 세련 무채/다크의 "사이" 평범색(파스텔·연·은은·차분·짙은 × 20색상환). 등급 가중치에서 흔함(common)으로 자주 나옴 → 세련/프리미엄이 특별해지는 대비 (2026-07 사용자 지침·귀한 소모품 뽑기감) ──
      C('m_rose_p','파스텔 로즈','레드',-45,0.62,1.16); C('m_rose_l','연 로즈','레드',-45,0.85,1.06); C('m_rose_m','은은한 로즈','레드',-45,1.15,0.96);
      C('m_rose_d','차분한 로즈','레드',-45,1.25,0.86); C('m_rose_k','짙은 로즈','레드',-45,1.35,0.77); C('m_coral_p','파스텔 코랄','오렌지',-22,0.62,1.16);
      C('m_coral_l','연 코랄','오렌지',-22,0.85,1.06); C('m_coral_m','은은한 코랄','오렌지',-22,1.15,0.96); C('m_coral_d','차분한 코랄','오렌지',-22,1.25,0.86);
      C('m_coral_k','짙은 코랄','오렌지',-22,1.35,0.77); C('m_orange_p','파스텔 주황','오렌지',-8,0.62,1.16); C('m_orange_l','연 주황','오렌지',-8,0.85,1.06);
      C('m_orange_m','은은한 주황','오렌지',-8,1.15,0.96); C('m_orange_d','차분한 주황','오렌지',-8,1.25,0.86); C('m_orange_k','짙은 주황','오렌지',-8,1.35,0.77);
      C('m_amber_p','파스텔 호박','브라운',2,0.62,1.16); C('m_amber_l','연 호박','브라운',2,0.85,1.06); C('m_amber_m','은은한 호박','브라운',2,1.15,0.96);
      C('m_amber_d','차분한 호박','브라운',2,1.25,0.86); C('m_amber_k','짙은 호박','브라운',2,1.35,0.77); C('m_lemon_p','파스텔 레몬','옐로우',13,0.62,1.16);
      C('m_lemon_l','연 레몬','옐로우',13,0.85,1.06); C('m_lemon_m','은은한 레몬','옐로우',13,1.15,0.96); C('m_lemon_d','차분한 레몬','옐로우',13,1.25,0.86);
      C('m_lemon_k','짙은 레몬','옐로우',13,1.35,0.77); C('m_yg_p','파스텔 연두','그린',34,0.62,1.16); C('m_yg_l','연 연두','그린',34,0.85,1.06);
      C('m_yg_m','은은한 연두','그린',34,1.15,0.96); C('m_yg_d','차분한 연두','그린',34,1.25,0.86); C('m_yg_k','짙은 연두','그린',34,1.35,0.77);
      C('m_grass_p','파스텔 풀빛','그린',58,0.62,1.16); C('m_grass_l','연 풀빛','그린',58,0.85,1.06); C('m_grass_m','은은한 풀빛','그린',58,1.15,0.96);
      C('m_grass_d','차분한 풀빛','그린',58,1.25,0.86); C('m_grass_k','짙은 풀빛','그린',58,1.35,0.77); C('m_green_p','파스텔 초록','그린',82,0.62,1.16);
      C('m_green_l','연 초록','그린',82,0.85,1.06); C('m_green_m','은은한 초록','그린',82,1.15,0.96); C('m_green_d','차분한 초록','그린',82,1.25,0.86);
      C('m_green_k','짙은 초록','그린',82,1.35,0.77); C('m_tealg_p','파스텔 청록','민트',108,0.62,1.16); C('m_tealg_l','연 청록','민트',108,0.85,1.06);
      C('m_tealg_m','은은한 청록','민트',108,1.15,0.96); C('m_tealg_d','차분한 청록','민트',108,1.25,0.86); C('m_tealg_k','짙은 청록','민트',108,1.35,0.77);
      C('m_jade_p','파스텔 비취','민트',126,0.62,1.16); C('m_jade_l','연 비취','민트',126,0.85,1.06); C('m_jade_m','은은한 비취','민트',126,1.15,0.96);
      C('m_jade_d','차분한 비취','민트',126,1.25,0.86); C('m_jade_k','짙은 비취','민트',126,1.35,0.77); C('m_aqua_p','파스텔 물빛','민트',148,0.62,1.16);
      C('m_aqua_l','연 물빛','민트',148,0.85,1.06); C('m_aqua_m','은은한 물빛','민트',148,1.15,0.96); C('m_aqua_d','차분한 물빛','민트',148,1.25,0.86);
      C('m_aqua_k','짙은 물빛','민트',148,1.35,0.77); C('m_skyb_p','파스텔 하늘빛','블루',168,0.62,1.16); C('m_skyb_l','연 하늘빛','블루',168,0.85,1.06);
      C('m_skyb_m','은은한 하늘빛','블루',168,1.15,0.96); C('m_skyb_d','차분한 하늘빛','블루',168,1.25,0.86); C('m_skyb_k','짙은 하늘빛','블루',168,1.35,0.77);
      C('m_blueb_p','파스텔 파랑','블루',186,0.62,1.16); C('m_blueb_l','연 파랑','블루',186,0.85,1.06); C('m_blueb_m','은은한 파랑','블루',186,1.15,0.96);
      C('m_blueb_d','차분한 파랑','블루',186,1.25,0.86); C('m_blueb_k','짙은 파랑','블루',186,1.35,0.77); C('m_indigoo_p','파스텔 쪽빛','블루',206,0.62,1.16);
      C('m_indigoo_l','연 쪽빛','블루',206,0.85,1.06); C('m_indigoo_m','은은한 쪽빛','블루',206,1.15,0.96); C('m_indigoo_d','차분한 쪽빛','블루',206,1.25,0.86);
      C('m_indigoo_k','짙은 쪽빛','블루',206,1.35,0.77); C('m_indblue_p','파스텔 남보라','퍼플',226,0.62,1.16); C('m_indblue_l','연 남보라','퍼플',226,0.85,1.06);
      C('m_indblue_m','은은한 남보라','퍼플',226,1.15,0.96); C('m_indblue_d','차분한 남보라','퍼플',226,1.25,0.86); C('m_indblue_k','짙은 남보라','퍼플',226,1.35,0.77);
      C('m_violetb_p','파스텔 보라','퍼플',246,0.62,1.16); C('m_violetb_l','연 보라','퍼플',246,0.85,1.06); C('m_violetb_m','은은한 보라','퍼플',246,1.15,0.96);
      C('m_violetb_d','차분한 보라','퍼플',246,1.25,0.86); C('m_violetb_k','짙은 보라','퍼플',246,1.35,0.77); C('m_pansy_p','파스텔 제비꽃','퍼플',262,0.62,1.16);
      C('m_pansy_l','연 제비꽃','퍼플',262,0.85,1.06); C('m_pansy_m','은은한 제비꽃','퍼플',262,1.15,0.96); C('m_pansy_d','차분한 제비꽃','퍼플',262,1.25,0.86);
      C('m_pansy_k','짙은 제비꽃','퍼플',262,1.35,0.77); C('m_fuchsia_p','파스텔 자주','핑크',280,0.62,1.16); C('m_fuchsia_l','연 자주','핑크',280,0.85,1.06);
      C('m_fuchsia_m','은은한 자주','핑크',280,1.15,0.96); C('m_fuchsia_d','차분한 자주','핑크',280,1.25,0.86); C('m_fuchsia_k','짙은 자주','핑크',280,1.35,0.77);
      C('m_pinkb_p','파스텔 분홍','핑크',-72,0.62,1.16); C('m_pinkb_l','연 분홍','핑크',-72,0.85,1.06); C('m_pinkb_m','은은한 분홍','핑크',-72,1.15,0.96);
      C('m_pinkb_d','차분한 분홍','핑크',-72,1.25,0.86); C('m_pinkb_k','짙은 분홍','핑크',-72,1.35,0.77); C('m_salmon_p','파스텔 산호','오렌지',-60,0.62,1.16);
      C('m_salmon_l','연 산호','오렌지',-60,0.85,1.06); C('m_salmon_m','은은한 산호','오렌지',-60,1.15,0.96); C('m_salmon_d','차분한 산호','오렌지',-60,1.25,0.86);
      C('m_salmon_k','짙은 산호','오렌지',-60,1.35,0.77);
      return out; })();
    const DYE_MAP={}; DYE_CATALOG.forEach(function(d){ DYE_MAP[d.id]=d; });
    // 🏷️ 염색 등급(뽑기 가중치) — 귀한 소모품답게 "미니 뽑기"감. common=밝은 원색+중간톤(자주=평범/꽝), uncommon=세련(무채·다크·뮤트), rare=프리미엄(올블랙·퓨어화이트·보석톤·메탈릭). applyDye가 그룹 확률로 선택.
    const DYE_REFINED=new Set(['jetblack', 'ink', 'soot', 'gunmetal', 'slate', 'ash', 'stone', 'pewter', 'fog', 'pearl', 'snow', 'bone', 'warmgray', 'coolgray', 'greige', 'taupe', 'oxblood', 'burgundy', 'maroon', 'brick', 'rust', 'umber', 'espresso', 'deepbrown', 'darkolive', 'hunter', 'pine', 'darkteal', 'petrol', 'midnight', 'indigo', 'eggplant', 'deepplum', 'darkmauve', 'blackcherry', 'dustyrose', 'mauve', 'blush', 'rosegold', 'terracotta', 'clay', 'camel', 'ochre', 'khaki', 'sage', 'moss', 'seafoam', 'dustyteal', 'dustyblue', 'denim', 'steelblue', 'slateblue', 'dustylavender', 'dustypurple', 'champagne']);
    const DYE_RARE=new Set(['jetblack', 'snow', 'pearl', 'gold', 'emerald', 'cobalt', 'indigo', 'oxblood', 'eggplant', 'midnight', 'burgundy', 'rosegold']);   // rare 우선(REFINED와 겹치면 rare)
    DYE_CATALOG.forEach(function(d){ d.t = DYE_RARE.has(d.id) ? 'rare' : (DYE_REFINED.has(d.id) ? 'uncommon' : 'common'); });
    const DYE_TIER_P={ rare:0.03, uncommon:0.29, common:0.68 };   // 그룹 확률(합1) — 대부분 평범, 가끔 세련, 드물게 프리미엄. 튜닝은 이 3값만.
    // 🎲 염색 뽑기 — 등급 그룹 확률로 tier 선택 후 그 tier 색 중 균등(현재 색 제외). 빈 tier면 전체 폴백. applyDye가 사용.
    function rollDye(cur){
      const avail=DYE_CATALOG.filter(function(d){ return d.id!==cur; });
      const byT={ common:[], uncommon:[], rare:[] };
      avail.forEach(function(d){ (byT[d.t]||byT.common).push(d); });
      const r=Math.random();
      const tier = r < DYE_TIER_P.rare ? 'rare' : (r < DYE_TIER_P.rare+DYE_TIER_P.uncommon ? 'uncommon' : 'common');
      const arr=(byT[tier]&&byT[tier].length)?byT[tier]:avail;
      return arr[Math.floor(Math.random()*arr.length)];
    }
    // 염색값 → CSS filter 문자열(단일 소스 — catActorHTML·catFace·비디오 PiP 워커·친구 캠이 공유). 무효값=''(미염색).
    function dyeFilterCss(v){ if(!v) return '';
      if(typeof v==='string' && DYE_MAP[v]) return DYE_MAP[v].css;
      const n=Number(v)||0; return LEGACY_DYE_HUES.indexOf(n)>=0?('hue-rotate('+n+'deg)'):''; }
    function dyeNameOf(v){ return (typeof v==='string' && DYE_MAP[v])?DYE_MAP[v].name:(v?'커스텀 톤':''); }
    // 펫의 유효 염색값(카탈로그 id 문자열 | legacy 숫자 | 0=미염색) — 진리값 판정은 !!petDyeOf(id) (문자열 id는 >0 비교 불가)
    function petDyeOf(id){ const d=(ownedCatsMap()[id]||{}).dye; if(d==null) return 0;
      if(typeof d==='string') return DYE_MAP[d]?d:0;
      const n=Number(d)||0; return LEGACY_DYE_HUES.indexOf(n)>=0?n:0; }
    // 🧺 펫 대상 소비템 공용 사용 시트(2026-07 개편, 사용자 확정 UX) — 가방 '사용' → 펫 인벤토리 그리드 → 펫 탭 즉시 적용.
    //    적용 후에도 시트를 유지한 채 그 펫 썸네일(catFace, dye 반영)이 결과로 갱신돼 바로 확인. 수량 0이 돼도 결과 확인용으로 시트 유지(셀만 비활성).
    const PET_USE_META={
      dye:{ title:'염색약 사용', item:'dye', apply:'applyDye',
        note:function(){ return '염색할 펫을 탭하세요 — <b>'+DYE_CATALOG.length+'가지 색</b> 중 랜덤!'; },
        chip:function(id){ const v=petDyeOf(id); return v?('🎨 '+dyeNameOf(v)):'기본 톤'; } },
      dye_remover:{ title:'염색 리무버', item:'dye_remover', apply:'applyDyeRemover',
        note:function(){ return '염색을 지울 펫을 탭하세요 — 원래 톤으로 복원돼요'; },
        only:function(id){ return !!petDyeOf(id); }, empty:'염색된 펫이 없어요',
        chip:function(id){ return '🎨 '+dyeNameOf(petDyeOf(id)); } },
      treat:{ title:'츄르 주기', item:'treat', apply:'applyTreat',
        note:function(){ return '츄르를 줄 펫을 탭하세요 — 애정 +1'; },
        chip:function(id){ return '애정 Lv.'+affectionLevel((ownedCatsMap()[id]||{}).affection||0, CAT_TIER[id]||'normal').level; } }
    };
    function openPetUseSheet(kind){
      const M=PET_USE_META[kind]; if(!M) return;
      if(consumQty(M.item)<=0){ toast(CONSUM_META[M.item].name+'이(가) 없어요', true); return; }
      const build=()=>{
        const own=ownedCatsMap();
        let ids=Object.keys(own).filter(id=>PET_CATALOG.some(c=>c.id===id));
        if(M.only) ids=ids.filter(M.only);
        const q=consumQty(M.item), dis=q<=0;
        let h='<div class="note" style="margin-bottom:10px;display:flex;align-items:center;gap:8px;"><span style="display:inline-flex;flex:none;">'+CONSUM_META[M.item].icon({h:22})+'</span><span style="flex:1;">'+M.note()+'</span><b style="flex:none;">보유 '+q.toLocaleString()+'</b></div>';
        if(!ids.length) h+='<div class="empty" style="padding:26px 10px;">'+(M.empty||'먼저 펫을 데려오세요')+'</div>';
        else h+='<div class="puGrid">'+ids.map(id=>
          '<button class="puCell'+(dis?' dis':'')+'" onclick="'+M.apply+'(\''+id+'\')" aria-label="'+escapeHtml(catName(id))+'에게 '+CONSUM_META[M.item].name+' 사용">'
          +catFace(id,{h:42})+'<b>'+escapeHtml(catName(id))+'</b><span class="pu-chip">'+M.chip(id)+'</span></button>').join('')+'</div>';
        return h;
      };
      openSheet(M.title, build());
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(b) b.innerHTML=build(); };
    }
    // 🎨 염색약: 펫 그리드에서 탭 → DYE_CATALOG 200색 중 등급 가중 랜덤(rollDye, 현재 색 제외) 배정, 시트 유지로 결과 확인.
    function useDye(){ openPetUseSheet('dye'); }
    function applyDye(id){
      if(!id||!ownsCat(id)){ toast('펫을 찾을 수 없어요', true); return; }
      if(consumQty('dye')<=0){ toast('염색약이 없어요', true); return; }
      const cur=petDyeOf(id);
      const pick=rollDye(cur);   // 🎲 등급 가중 랜덤(현재 색 제외) — 대부분 평범(common), 가끔 세련, 드물게 프리미엄
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.consum.dye)||0)<1) return;
        const c=g.owned.cats[id]; if(!c) return;
        g.consum.dye-=1; c.dye=pick.id; return g;
      }).then(r=>{ if(r&&r.committed){ toast('🎨 '+catName(id)+' → '+pick.name+' 염색!'); if(state._sheetRefresh) state._sheetRefresh(); if($('petInfo')) openPetInfo(id); } });
    }
    // 🧴 염색 리무버: 염색된 펫만 그리드에 표시 → 1개 소모해 원래 톤 복원(무료 지우기 없음 — 알뜰샵 소비 탭 금화200 판매 + 이벤트·쿠폰·선물).
    function useDyeRemover(){ openPetUseSheet('dye_remover'); }
    function applyDyeRemover(id){
      if(!id||!ownsCat(id)||!petDyeOf(id)){ toast('염색된 펫이 아니에요', true); return; }
      if(consumQty('dye_remover')<=0){ toast('염색 리무버가 없어요', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.consum.dye_remover)||0)<1) return;
        const c=g.owned.cats[id]; if(!c||!c.dye) return;
        g.consum.dye_remover-=1; delete c.dye; return g;
      }).then(r=>{ if(r&&r.committed){ toast(catName(id)+' 염색을 지웠어요 — 원래 톤으로'); if(state._sheetRefresh) state._sheetRefresh(); if($('petInfo')) openPetInfo(id); } });
    }
    // 🍡 츄르: 펫 그리드에서 탭 → applyTreat(id)로 애정 상승(쿨다운 무시)
    function useTreat(){ openPetUseSheet('treat'); }
    function applyTreat(id){
      if(!id||!ownsCat(id)){ toast('펫을 찾을 수 없어요', true); return; }
      if(consumQty('treat')<=0){ toast('츄르가 없어요', true); return; }
      const eff=((CONSUM_CATALOG.find(c=>c.id==='treat')||{}).effect)||{affection:1};
      const beforeCoins=coins(), beforeGold=gold(); _affLevelUp=null; let did=false;
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.consum.treat)||0)<=0 || !g.owned.cats[id]){ did=false; return g; }
        g.consum.treat-=1; did=true;
        const gain=applyAffectionGain(g, id, eff.affection||1);
        _affLevelUp=(gain&&gain.after>gain.before)?{ id, level:gain.after, gold:gain.gold, silver:gain.silver }:null;
        return g;
      }).then(r=>{ if(!(r&&r.committed&&did)) return;
        const x=innerWidth/2, y=innerHeight/2; heartFx(x,y);
        const lvUp=_affLevelUp, dSilver=(lvUp&&lvUp.silver)||0, dGold=(lvUp&&lvUp.gold)||0;
        if(dSilver>0||dGold>0) rewardFly(x,y,dSilver,dGold,beforeCoins,beforeGold);
        if(lvUp){ affLevelFx(x,y); toast('❤ '+catName(id)+' 애정 레벨 '+lvUp.level+(lvUp.gold?' · 만렙! 금화 +'+lvUp.gold:'')+(dSilver>0?' · 은화 +'+dSilver:'')); _affLevelUp=null; }
        else toast('🍡 '+catName(id)+'에게 츄르 · 애정 +'+(eff.affection||1));
        if($('petInfo')) openPetInfo(id);   // 펫 정보에서 바로 사용 시 애정 게이지·수량 즉시 반영
        if(state._sheetRefresh) state._sheetRefresh();   // 수량 0이어도 시트 유지(결과 확인, 셀은 비활성)
      });
    }
    // 💊 영양제: 사용하면 수확 수익 부스트 활성(활성 중이면 남은시간에 지속 가산)
    function useTonic(){
      if(consumQty('tonic')<=0){ toast('영양제가 없어요 · 알뜰샵 소비 탭에서 구매', true); return; }
      const eff=((CONSUM_CATALOG.find(c=>c.id==='tonic')||{}).effect)||{boost:1.5, ms:3*60*60*1000};
      gameRef().transaction(g=>{ g=normalizeGame(g); if((Number(g.consum.tonic)||0)<=0) return;
        g.consum.tonic-=1; const now=Date.now();
        const cur=(g.boost&&Number(g.boost.until)>now)?Number(g.boost.until):now;   // 활성 중이면 남은시간에 이어붙임(배율 동일)
        g.boost={ until:cur+(eff.ms||0), mult:eff.boost||1.5 };
        return g;
      }).then(r=>{ if(r&&r.committed){ toast('💊 영양제 사용 · 수확 수익 ×'+(eff.boost||1.5)+' '+fmtDur(boostRemain(state.game))); if(state._sheetRefresh) state._sheetRefresh(); if(typeof renderCatHouse==='function') renderCatHouse(); } });
    }
    // 보유한 펫알/랜덤박스(소비 인벤토리)를 일반 확률로 오픈 — 은화 대신 인벤토리 1개 소모, 금화+1 지급.
    // 🥇 가챠 부산물 금화 — 하루 GACHA_GOLD_CAP뽑까지만 지급(경제 정책 §5: 은화→금화 세탁 차단). want=이번에 주려는 금화(뽑 수).
    //   g 트랜잭션 안에서 호출. gachaGold={day,n} 카운터로 하루 상한. 실제 지급액 반환.
    const GACHA_GOLD_CAP=2;
    function grantGachaGold(g, want){ want=Math.max(0, Math.floor(Number(want)||0)); if(!want) return 0;
      const d=kstDayKey(); if((g.gachaGold&&g.gachaGold.day)!==d) g.gachaGold={day:d,n:0};
      const room=Math.max(0, GACHA_GOLD_CAP-(Number(g.gachaGold.n)||0)), give=Math.min(want, room);
      if(give>0){ g.gachaGold.n=(Number(g.gachaGold.n)||0)+give; g.gold=clampGold((g.gold||0)+give); }
      return give; }
    function useHeldGacha(kind){
      if(_pullBusy) return;   // 🔒 진행 중 재탭 무시
      const key=kind;   // consum.egg / consum.box
      if(consumQty(key)<1){ toast('보유한 '+(kind==='egg'?'펫알':'랜덤박스')+'이 없어요', true); return; }
      const forced=pityForcedTierFor(kind);   // 🔮 종류별 천장(보유 펫알/랜덤박스도 같은 종류 카운터 공유)
      let res, dup=false;
      if(kind==='egg'){ const map=gachaCatTierMap(); res = forced ? pickTierMember(map, forced) : rollFromPool(map); if(!res) return; dup=ownsCat(res.id); }   // 펫알=활성 한정만 포함(gachaCatTierMap)
      else { res=rollBoxReward(null, forced); if(!res) return;   // 📦 보유 박스도 은화 1뽑·10연과 같은 풀(boxPool — 가구+바닥+벽지+배경효과+펫효과+모자, 2026-07 정합 수정: 구 effItemTier는 가구만 나왔음)
        if(res.type==='floor') dup=ownsFloor(res.id)&&res.id!=='default';
        else if(res.type==='wall') dup=ownsWall(res.id)&&res.id!=='default';
        else if(res.type==='bgfx') dup=ownsBgfx(res.id);
        else if(res.type==='petfx') dup=ownsPetfx(res.id);
        else if(res.type==='hat') dup=ownsHat(res.id);
        else dup=itemQty(res.id)>=itemCapOf(res.id); }   // 🧰 가구=상한(케어5·기타1) 초과=중복 리빌
      const dp = (dup&&kind==='egg') ? petDupPreview(res.id) : null;   // 💗 중복 펫=애정 경험치(만렙만 은화 폴백) 표기 미러
      const refund = dup ? (kind==='egg'?(dp.max?dp.refund:0):((res.tier!=='exclusive')?dupRefundOf(res.tier):0)) : 0;
      const isNew=gachaNew(kind,res);   // 지급 전 판정(NEW 배지)
      const hit=isTopTier(res.tier);
      pullBegin(kind, false);   // 🔒 잠금 + 즉시 '준비' 오버레이
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.consum[key])||0)<1) return;
        g.consum[key]-=1; grantGachaGold(g,1); g.pity[kind]=pityNext(g.pity[kind]||0, hit);   // 부산물 금화 하루 2뽑 캡
        if(kind==='egg'){
          if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; }   // 🚫 가챠 획득 펫은 방에 자동 배치하지 않음(가방에만 — 배치는 홈에서 직접, 사용자 지침)
          else { grantPetDup(g, res.id); }   // 💗 중복 펫=애정 경험치(만렙만 은화 10% 폴백)
        } else {
          const gr=grantBoxReward(g, res);   // 캡 초과/중복 보상(중앙 헬퍼 — 한정=무지개동전, 타입 보존 지급)
          if(gr.rf) g.coins=clampCoins((g.coins||0)+gr.rf);
        }
        return g;
      }).then(r=>{ if(r&&r.committed){ runGachaFx(kind, res, dup, refund, false, isNew, dp); if(state._sheetRefresh) setTimeout(()=>{ if(state._sheetRefresh) state._sheetRefresh(); }, 50); } else { closeFx(); toast('처리 중이에요 — 잠시 후 다시 시도해 주세요', true); } })
        .catch(function(){ closeFx(); });
    }
    // 🌱 보유한 뜰알(소비 인벤토리) 열기 — 개발자 선물/지급으로 받은 뜰알 1개 소모(은화·금화 안 듦), DDEUL_TIERS(한정 픽업) 확률로 오픈. 뜰알 오픈 연출(무지개+나비) 공용.
    function useHeldDdeul(){
      if(_pullBusy) return;   // 🔒 진행 중 재탭 무시
      if(consumQty('ddeul')<1){ toast('보유한 뜰알이 없어요', true); return; }
      const forced=pityForcedTierFor('ddeul');   // 🔮 천장: 뜰알 확정 = 신화 50% · 한정 50%
      const res = forced ? pickTierMember(gachaCatTierMap(), forced) : rollFromPool(gachaCatTierMap(), DDEUL_TIERS); if(!res) return;
      const dup=ownsCat(res.id), dp=dup?petDupPreview(res.id):null, refund=(dp&&dp.max)?dp.refund:0;
      const isNew=gachaNew('ddeul',res);
      const hit=isTopTier(res.tier);
      pullBegin('ddeul', false);   // 🔒 잠금 + 즉시 '준비' 오버레이
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.consum.ddeul)||0)<1) return;
        g.consum.ddeul-=1; g.pity.ddeul=pityNext(g.pity.ddeul||0, hit);
        if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; }   // 🚫 가챠 획득 펫은 방에 자동 배치하지 않음(가방에만 — 배치는 홈에서 직접, 사용자 지침)
        else { grantPetDup(g, res.id); }   // 💗 중복 펫=애정 경험치(만렙만 은화 10% 폴백)
        return g;
      }).then(r=>{ if(r&&r.committed){ runGachaFx('ddeul', res, dup, refund, false, isNew, dp); if(state._sheetRefresh) setTimeout(()=>{ if(state._sheetRefresh) state._sheetRefresh(); }, 50); } else { closeFx(); toast('처리 중이에요 — 잠시 후 다시 시도해 주세요', true); } })
        .catch(function(){ closeFx(); });
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
      const m=dailyMissionsToday().find(x=>x.id===id); if(!m) return;
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
        g.coins = clampCoins((g.coins||0) + m.reward);   // 상한 클램프 통일
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
        if(r.clips) sp.clips=Object.assign({}, r.clips);   // 🎞️ 다중 모션 클립 메타(클립키→프레임 수) — 아트는 catalogPetArt/{id}.clips 지연 로드
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
        state._catPetsReady=true;   // 💗 런타임 펫 등급 도착 — 이후 랭킹 aff가 정확한 tier로 계산됨
        if(typeof writeMyRanking==='function') writeMyRanking();   // 카탈로그 도착 직후 재계산(초기 과대 기록 방지 가드 해제)
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
    function _applyArt(id, urls){ const sp=PET_SPRITES[id]; if(sp&&urls){ sp.urls={ walk:urls.walk, south:urls.south, north:urls.north, east:urls.east, west:urls.west };
      sp.clipUrls=urls.clips||null;   // 🎞️ 다중 모션 클립 시트(data URL) — 없는 구 레코드는 null(hasClip이 false → 기존 동작)
      sp.needArt=false; } }
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
      if(typeof pipOpen==='function' && pipOpen() && _pip.stage){ _pip.stage.dataset.sig=''; renderPipCats(); }   // 🖥️ PiP 무대도 아트 도착 반영(도트 알 → 스프라이트)
      if(typeof vpipOpen==='function' && vpipOpen()){ _vpip.sigCats=''; try{ _vpipSync(); }catch(e){} }   // 🎬 비디오 PiP도 런타임 펫 아트 도착 시 재동기화
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

    // ---- dev: 🎞️ 모션 관리(펫별 클립 미리보기) ----
    // 펫을 고르면 그 펫이 가진 다중 모션 클립(PET_CLIPS)을 목록으로 보여주고, 선택하면 ① 실제 재생(라이브 .cspr 필름)
    // ② 원본 시트 이미지 ③ 메타(프레임·fps·방향·종류)를 확인한다. 규칙은 docs/pet-motion-guide.md.
    let _devMotionPet=null, _devMotionClip='idle';
    function petsWithClips(){ return Object.keys(PET_SPRITES).filter(id=>{ const c=PET_SPRITES[id]&&PET_SPRITES[id].clips; return c&&Object.keys(c).length; }); }
    // 라이브 미리보기 — 실제 엔진과 동일한 CSS 필름(.csprf steps)으로 클립 재생(정면=south·옆=east 원본 방향 그대로).
    //  once 클립도 미리보기에선 반복 재생(검수 편의). 클립이 없으면 폴백(정지 스틸/걷기)로 안내.
    function motionLiveHtml(id, clip, cell){
      cell=cell||120; const r=(typeof resolveClip==='function')?resolveClip(id, clip, true):null;   // 개발자 검수용 — 💗 애정 게이트 우회
      if(!r) return '<div style="width:'+cell+'px;height:'+cell+'px;margin:0 auto;display:flex;align-items:flex-end;justify-content:center;">'+catFace(id,{h:Math.round(cell*0.8),eager:true})+'</div>';
      if(r.key==='walk'){ ensurePetArt(id); return '<div style="margin:0 auto;width:'+cell+'px;">'+catActorHTML(id, cell)+'</div>'; }
      return '<div class="cspr" style="width:'+cell+'px;height:'+cell+'px;image-rendering:pixelated;margin:0 auto;'
        +'--sheet:url('+r.url+');--fw:'+(cell*r.frames)+'px;--wdur:'+r.dur.toFixed(2)+'s;">'
        +'<i class="csprf" style="animation-timing-function:steps('+r.frames+')"></i></div>';
    }
    function devPickMotion(k){ _devMotionClip=k; if(typeof openDevMotions==='function') openDevMotions(); }
    function devMotionSelPet(id){ _devMotionPet=id; if(typeof openDevMotions==='function') openDevMotions(); }
    function openDevMotions(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용', true); return; }
      const pets=petsWithClips();
      if(!pets.length){ openSheet('모션 관리', '<div class="note">아직 모션 클립을 가진 펫이 없어요. 펫 zip에 프리셋 애니 폴더(Idle·Eating·Running…)를 넣어 업로드하거나 정적 시트(&lt;클립키&gt;.png)를 추가하세요. 규칙: docs/pet-motion-guide.md</div>'); return; }
      if(!_devMotionPet || pets.indexOf(_devMotionPet)<0) _devMotionPet=pets[0];
      const id=_devMotionPet, clips=PET_SPRITES[id].clips||{};
      const order=Object.keys(PET_CLIPS), clipKeys=order.filter(k=>clips[k]);
      if(clipKeys.indexOf(_devMotionClip)<0) _devMotionClip=clipKeys[0];
      const clip=_devMotionClip, def=PET_CLIPS[clip]||{}, frames=clips[clip]||0;
      const kind = def.once ? (def.hold?'원샷+유지(1회 재생 후 마지막 프레임)':'원샷(1회 재생)') : '반복';
      const nm=(PET_CATALOG.find(c=>c.id===id)||{}).name||id;
      // 펫 선택(클립 보유 펫만)
      let h='<div class="field"><label>펫</label><select class="input" onchange="devMotionSelPet(this.value)">'
        + pets.map(p=>{ const pn=(PET_CATALOG.find(c=>c.id===p)||{}).name||p; return '<option value="'+p+'"'+(p===id?' selected':'')+'>'+escapeHtml(pn)+' · '+p+'</option>'; }).join('')
        + '</select></div>';
      // 라이브 미리보기(카드)
      h+='<div style="text-align:center;background:var(--card,#0001);border-radius:12px;padding:14px 8px 8px;margin:8px 0;">'
        + motionLiveHtml(id, clip, 132)
        + '<div style="margin-top:8px;font-size:12px;color:var(--muted,#888);">'+escapeHtml(nm)+' · <b>'+clip+'</b> — '+frames+'프레임 · '+(def.fps||8)+'fps · '+(def.dir||'south')+' · '+kind+'</div></div>';
      // 클립 칩(보유한 것만 활성, 없는 것은 흐리게 표시)
      h+='<div class="note" style="margin:6px 0;">모션을 눌러 실제 재생을 확인하세요. 원샷 모션은 미리보기에선 반복 재생됩니다(실제 앱에선 1회).</div>';
      h+='<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">';
      order.forEach(k=>{ const has=!!clips[k];
        const req=(typeof CLIP_AFF_REQ!=='undefined')&&CLIP_AFF_REQ[k], gated=has&&req;   // 💗 전 등급 애정 해금 표기(재생은 devPickMotion이 ignoreAffGate로 우회)
        h+='<button class="chip'+(k===clip?' on':'')+'"'+(has?'':' disabled')+' style="'+(has?'':'opacity:.4;')+'"'+(has?(' '+App.view.act('devPickMotion',k)+''):'')+'>'+k+(has?' ·'+clips[k]:'')+(gated?' <span style="opacity:.7">(Lv'+req+' 해금)</span>':'')+'</button>'; });
      h+='</div>';
      // 원본 시트 이미지(가로 스트립)
      const sheetUrl=(typeof sprClipUrl==='function')?sprClipUrl(id, clip):'';
      if(sheetUrl){ h+='<div class="field"><label>시트('+frames+'프레임 · 왼→오)</label>'
        + '<div style="overflow-x:auto;background:var(--card,#0001);border-radius:8px;padding:6px;"><img src="'+sheetUrl+'" alt="" style="image-rendering:pixelated;height:96px;width:auto;max-width:none;"></div></div>'; }
      h+='<div class="note" style="margin-top:8px;">모션 규칙·프레임 사양은 <code>docs/pet-motion-guide.md</code>. 새 시트는 <code>tools/pet_motion_build.py</code>로 제작해 <code>&lt;클립키&gt;.png</code>로 저장 후 <code>pets.json</code>의 <code>clips</code>에 프레임 수를 기록하세요.</div>';
      openSheet('🎞️ 모션 관리', h);
    }

    // ---- dev: 펫 관리(목록·추가·수정·삭제/복구) + zip 처리 ----
    let _devPetTarget=null;   // 수정 대상 id(null=신규 추가)
    function loadJSZip(){ if(window.JSZip) return Promise.resolve(window.JSZip);
      return new Promise((res,rej)=>{ const s=document.createElement('script');
        s.src='https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'; s.onload=()=>res(window.JSZip); s.onerror=()=>rej(new Error('JSZip 로드 실패')); document.head.appendChild(s); }); }
    function _blobToImg(blob){ return new Promise((res,rej)=>{ const u=URL.createObjectURL(blob); const im=new Image();
      im.onload=()=>{ URL.revokeObjectURL(u); res(im); }; im.onerror=()=>{ URL.revokeObjectURL(u); rej(new Error('이미지 로드 실패')); }; im.src=u; }); }
    // 🎞️ PixelLab 프리셋 애니 폴더명 → 클립키(PET_CLIPS). 폴더 세그먼트를 정규화(소문자·영문만)해 비교 —
    // "Seated on Belly Idle"·"Seated-on-Belly-Idle" 등 표기 차이를 흡수. 앞선 항목 우선(belly는 Seated…Idle > Sitting on Belly).
    // Walking/Walk은 기존 걷기(walk 시트) 경로가 처리, Standing 계열(전이)은 v1 미사용이라 매핑에 없음.
    const ZIP_CLIP_FOLDERS = [
      ['running','run'], ['jump','jump'], ['idle','idle'],
      ['seatedonbellyidle','belly'], ['sittingonbelly','belly'], ['sitting','sit'],
      ['eating','eat'], ['drinking','drink'], ['yawning','yawn'], ['angry','angry'], ['sleeping','sleep'], ['lyingdown','sleep']
    ];
    // 프레임 이미지들 → 가로 스트립 1장(canvas 합성, 최대 12프레임). 걷기·클립 공용.
    function _stripFromFrames(zip, frameNames){
      const nf=Math.min(frameNames.length, 12);
      return Promise.all(frameNames.slice(0,nf).map(n=>zip.files[n].async('blob').then(_blobToImg))).then(frames=>{
        const w=frames[0].naturalWidth||48, hgt=frames[0].naturalHeight||48;
        const cv=document.createElement('canvas'); cv.width=w*nf; cv.height=hgt; const ctx=cv.getContext('2d');
        ctx.imageSmoothingEnabled=false; frames.forEach((im,i)=>ctx.drawImage(im,i*w,0,w,hgt));
        return { url:cv.toDataURL('image/png'), frames:nf };
      });
    }
    // zip → {walk,south,north,east,west,frontWalk,frames,clips} data URL(브라우저 canvas 합성).
    // clips = 선택(zip에 프리셋 애니 폴더가 있으면): { 클립키:{url,frames} } — 이동 계열(run·jump)=east, 그 외=south 프레임만 사용(PET_CLIPS 방향 정책).
    function _processPetZip(file){
      return loadJSZip().then(JSZip=>JSZip.loadAsync(file)).then(zip=>{
        const names=Object.keys(zip.files);
        // frame_0..frame_N 를 프레임 번호로 자연 정렬(문자열 정렬이면 frame_10<frame_2 로 어긋남 — 8장↑ 대비)
        const byFrame=(a,b)=>((+((a.match(/frame_(\d+)/i)||[])[1]||0))-(+((b.match(/frame_(\d+)/i)||[])[1]||0)));
        let frameNames=names.filter(n=>/\/Walk\/east\/frame_\d+\.png$/i.test(n)).sort(byFrame); let frontWalk=false;
        if(frameNames.length<2){ const s=names.filter(n=>/\/Walk\/south\/frame_\d+\.png$/i.test(n)).sort(byFrame); if(s.length>=2){ frameNames=s; frontWalk=true; } }
        if(frameNames.length<2) throw new Error('걷기 프레임(Walk/east frame_*.png)을 못 찾음');
        return _stripFromFrames(zip, frameNames).then(wk=>{
          const walk=wk.url, nf=wk.frames;   // 걷기 장수를 zip 그대로(6·8 등, 최대 12) — 고등급 8프레임 등 부드러운 모션 지원
          // 🎞️ 프리셋 애니 폴더 수집: 경로 `<애니>/<방향>/frame_N.png`에서 애니 폴더명을 정규화해 클립키로 매핑, 정책 방향 프레임만 시트로 합성.
          // ZIP_CLIP_FOLDERS 순서대로 훑어 같은 클립키는 앞선(우선) 폴더가 차지 — zip 내 파일 나열 순서와 무관하게 결정적.
          const clipFrames={};   // 클립키 → 프레임 파일명 배열
          const normSeg=s=>String(s).toLowerCase().replace(/[^a-z]/g,'');
          ZIP_CLIP_FOLDERS.forEach(fd=>{ const seg=fd[0], key=fd[1]; if(clipFrames[key]) return;
            const want=(PET_CLIPS[key]&&PET_CLIPS[key].dir)||'south';
            const fr=names.filter(n=>{ const m=n.match(/(?:^|\/)([^\/]+)\/(east|south)\/frame_\d+\.png$/i);
              return !!(m && normSeg(m[1])===seg && m[2].toLowerCase()===want); });
            if(fr.length>=2) clipFrames[key]=fr; });
          const clipKeys=Object.keys(clipFrames);
          return Promise.all(clipKeys.map(k=>_stripFromFrames(zip, clipFrames[k].sort(byFrame)).then(r=>[k,r])))
            .then(pairs=>{ const clips={}; pairs.forEach(p=>{ clips[p[0]]=p[1]; });
              return Promise.all(['south','north','east','west'].map(f=>{ const k=names.find(n=>new RegExp('/rotations/'+f+'\\.png$','i').test(n));
                return k ? zip.files[k].async('base64').then(b=>'data:image/png;base64,'+b) : Promise.resolve(walk); }))
                .then(rots=>({ walk, south:rots[0], north:rots[1], east:rots[2], west:rots[3], frontWalk, frames:nf, clips:(clipKeys.length?clips:null) }));
            });
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
      let h='<p class="muted" style="font-size:12.5px;margin:2px 2px 12px;line-height:1.5;">PixelLab export <b>zip</b>을 올리고 이름·분류·등급·크기만 정하면 추가됩니다. 앱에서 바로 처리(옆걷기 시트+4방향 생성)해 <b>모든 사용자</b>에게 반영돼요. zip에 프리셋 애니 폴더(Idle·Eating·Drinking·Running·Sitting 등)가 있으면 <b>모션 클립</b>으로 자동 인식돼 먹기·앉기·유휴 연출이 살아나요.</p>';
      h+=_petFormHtml({})+'<button class="btn" id="dpBtn" '+App.view.act('submitDevPet')+'>추가</button>';
      openSheet('펫 추가', h); }
    function openDevPetEdit(id){ if(!(typeof isDev==='function'&&isDev())) return; const p=devPetInfo(id); if(!p){ toast('펫을 찾을 수 없어요',true); return; } _devPetTarget=id;
      let h='<p class="muted" style="font-size:12.5px;margin:2px 2px 12px;line-height:1.5;">이름·분류·등급·크기를 바꾸고, <b>zip을 다시 올리면 디자인</b>도 교체돼요. (정적 펫도 앱에서 오버라이드됩니다)</p>';
      h+=_petFormHtml(p)+'<button class="btn" id="dpBtn" '+App.view.act('submitDevPet')+'>저장</button>';
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
          const artNode={ walk:art.walk, south:art.south, north:art.north, east:art.east, west:art.west };
          // 🎞️ 다중 모션 클립: 메타(clips=클립키→프레임 수)는 catalogPets, 시트(data URL)는 catalogPetArt.clips.
          //    zip에 클립이 없으면 null로 지워 이전 업로드의 낡은 메타가 남지 않게(아트 노드는 통째 교체라 자동 소거).
          let cm=null;
          if(art.clips){ cm={}; const cu={}; Object.keys(art.clips).forEach(k=>{ cm[k]=art.clips[k].frames; cu[k]=art.clips[k].url; }); artNode.clips=cu; }
          upd['catalogPets/'+id+'/clips']=cm;
          upd['catalogPetArt/'+id]=artNode;
          // 용량 가드(경고만): RTDB 노드가 너무 크면 로딩·요금에 부담 — 클립 수를 줄이거나 프레임을 6장으로.
          try{ let bytes=0; Object.keys(artNode).forEach(k=>{ const v=artNode[k]; bytes+=(typeof v==='string')?v.length:Object.keys(v).reduce((s,c)=>s+v[c].length,0); });
            if(bytes>2500000) toast('이미지 용량이 커요('+(bytes/1048576).toFixed(1)+'MB) — 클립·프레임 수를 줄이는 걸 권장', true); }catch(e){}
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
        // 🎞️ 다중 모션 클립 시트도 함께 다운로드(idle.png·eat.png 등) — 같은 펫 폴더에 넣으면 정적에서도 재생(프레임 수는 pets.json clips에 기록).
        if(urls.clips) Object.keys(urls.clips).forEach(k=>{ const a=document.createElement('a'); a.href=urls.clips[k]; a.download=k+'.png'; document.body.appendChild(a); a.click(); a.remove(); });
        const slug=String(id).replace(/^rt_/,'')||'new'; const sid=(info.species||'cat')+'_'+slug;
        const petLine=JSON.stringify(Object.assign({ id:sid, species:info.species||'cat', name:info.name||'', tier:info.tier||'normal', scale:sp.scale||1, desc:'', zip:'', frontWalk:!!sp.frontWalk }, sp.clips?{clips:sp.clips}:{}));   // clips=클립키→프레임 수(정적 승격 시 PET_SPRITES 코드젠에 반영)
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
    // 🛡️ 펫 그리기 방어 — 한 펫의 스프라이트/카탈로그 데이터가 깨져도(예: 최근 스케일·프레임 변경) 펫 관리 전체가 죽지 않게 개별 폴백.
    //   ⚠️ 근본 원인(그 펫의 아트가 catActorHTML/catFace에서 예외)은 별도로 고쳐야 하지만, 여기서 잡아 "안 들어가짐"을 막고 어떤 펫이 문제인지 드러낸다.
    function safePetArt(id, h){ try{ return catActorHTML(id, h); }catch(e){ try{ return catFace(id,{h:h}); }catch(_){ try{ return _petPlaceholder(Math.round(h)); }catch(__){ return ''; } } } }
    function safePetCell(p, sel){ try{ return devPetCellHtml(p, sel); }catch(e){ try{ console.error('펫 셀 렌더 오류', p&&p.id, e); }catch(_){}
      return '<button class="pitem pmcell" data-pid="'+escapeHtml((p&&p.id)||'?')+'" title="이 펫 렌더 오류: '+escapeHtml((e&&e.message)||String(e))+'"><span class="pic">⚠️</span><span class="pmnm">'+escapeHtml((p&&(p.name||p.id))||'?')+'</span><span class="pq" style="color:var(--danger,#e5484d)">렌더 오류</span></button>'; } }
    function devPetCellHtml(p, sel){ const on=p.id===sel; const tag=(SPECIES_LABEL[p.species]||p.species);
      const gacha=isGachaOnlyCat(p.id), ft=p.tier||'normal';
      return '<button class="pitem pmcell'+(on?' on':'')+(p.deleted?' del':'')+(gacha?' gacha':'')+'" data-pid="'+p.id+'" '+App.view.act('devSelectPet',p.id)+' aria-label="'+escapeHtml(p.name||p.id)+' 선택" aria-pressed="'+(on?'true':'false')+'">'+
        '<span class="pic tbring tb-'+ft+'">'+catFace(p.id,{h:38})+tierBadgeHtml(ft)+(gacha?'<span class="pm-gc">'+boxSvg({h:12})+'</span>':'')+'</span>'+
        '<span class="pmnm">'+catNameSpan(p.id, p.name||p.id)+'</span>'+
        '<span class="pq">'+escapeHtml(tag)+(p.runtime?' · 런타임':'')+(p.deleted?' · 삭제됨':'')+'</span>'+
      '</button>'; }
    // 상단 스테이지(선택 상태에 따라 바뀌는 부분) — 부분 갱신 대상(#pmStage). 미선택이면 안내 플레이스홀더 + [새 펫 추가].
    function devPetStageHtml(){ const list=allPetsForDev(), sel=state._devPetSel, p=sel?list.find(x=>x.id===sel):null;
      if(!p){ return '<div class="pm-stage empty">'+
          '<div class="pm-pv-art ph">'+safePetArt('cat_mackerel',60)+'</div>'+
          '<div class="pm-ph-tx">아래에서 펫을 선택하면 여기에서<br><b>등급·가챠전용·수정·삭제·연출</b>을 관리해요.</div>'+
          '<div class="petmg-btns"><button class="btn ghost" '+App.view.act('openDevPetAdd')+'>+ 새 펫 추가</button></div>'+
        '</div>'; }
      const ft=p.tier||'normal', tag=(SPECIES_LABEL[p.species]||p.species), gacha=isGachaOnlyCat(p.id);
      // 🐾 기구물 관리처럼 스테이지에서 바로 등급·가챠전용 변경(전역 catalogPets/{id} 오버라이드 — 모든 사용자 반영)
      const tierSel='<select class="input fm-tier" onchange="setPetTier(\''+p.id+'\',this.value)" aria-label="'+escapeHtml(p.name||p.id)+' 등급">'+
        TIERS.map(function(t){ return '<option value="'+t.id+'"'+(t.id===ft?' selected':'')+'>'+t.name+'</option>'; }).join('')+'</select>';
      const gachaTog='<label class="fm-gacha"><span>가챠전용</span><span class="switch'+(gacha?' on':'')+'" role="switch" aria-checked="'+gacha+'" tabindex="0" '+App.view.act('setPetGacha',p.id)+' aria-label="'+escapeHtml(p.name||p.id)+' 가챠전용"><i></i></span></label>';
      // 한정(exclusive) 등급 펫만: '가챠 등장' 토글(ON=가챠 한정 리스트·확률에 포함). 다른 등급엔 표시 안 함.
      const exOn=isExGachaActive(p.id);
      const exTog=(ft==='exclusive')?'<label class="fm-gacha"><span>가챠 등장</span><span class="switch'+(exOn?' on':'')+'" role="switch" aria-checked="'+exOn+'" tabindex="0" '+App.view.act('setPetExActive',p.id)+' aria-label="'+escapeHtml(p.name||p.id)+' 가챠 등장"><i></i></span></label>':'';
      const badge=gacha?'<div class="pm-pv-badge"><span class="fm-badge tier-rainbow">'+boxSvg({h:13})+' 랜덤박스 전용</span></div>':'';
      const dr = p.deleted ? '<button class="btn" '+App.view.act('restorePet',p.id)+'>복구</button>'
        : '<button class="btn danger" '+App.view.act('deletePetSoft',p.id)+'>삭제</button>';
      let h='<div class="pm-stage sel">'+
        '<div class="pm-preview">'+
          '<div class="pm-pv-art tbring tb-'+ft+(p.deleted?' del':'')+'">'+safePetArt(p.id,84)+'</div>'+
          '<div class="pm-pv-info">'+
            '<div class="pm-pv-nm">'+catNameSpan(p.id, p.name||p.id)+'</div>'+
            '<div class="pm-pv-meta">'+escapeHtml(tag)+(p.runtime?' · 런타임':'')+(p.deleted?' · 삭제됨':'')+'</div>'+
            badge+
            '<div class="pm-cfgctl">'+tierSel+gachaTog+exTog+'</div>'+
          '</div>'+
        '</div>'+
        '<div class="petmg-btns"><button class="btn ghost" '+App.view.act('openDevPetAdd')+'>추가</button>'+
          '<button class="btn" '+App.view.act('openDevPetEdit',p.id)+'>수정</button>'+dr+'</div>';
      // 🎬 가챠 오픈 연출 펫 지정(전역 config/gachaFx — 모든 사용자에게 즉시 적용). 선택 펫을 연출 1번(왼쪽)/2번(오른쪽)에 배정(다시 누르면 해제).
      h+='<div class="sec-title" style="margin-top:14px;">가챠 오픈 연출 펫 <span class="pill">한정 뽑기 전용</span></div>';
      if(!p.deleted){
        const sa=gachaFxSlotOf(p.id);   // 'a'|'b'|null (현재 이 펫이 배정된 슬롯)
        h+='<div class="petmg-btns">'+
           '<button class="btn'+(sa==='a'?'':' ghost')+'" aria-pressed="'+(sa==='a'?'true':'false')+'" '+App.view.act('setGachaFxSlot','a',p.id)+'>연출 1번(왼쪽)'+(sa==='a'?' ✓':'')+'</button>'+
           '<button class="btn'+(sa==='b'?'':' ghost')+'" aria-pressed="'+(sa==='b'?'true':'false')+'" '+App.view.act('setGachaFxSlot','b',p.id)+'>연출 2번(오른쪽)'+(sa==='b'?' ✓':'')+'</button></div>';
      } else {
        h+='<p class="muted" style="font-size:11.5px;line-height:1.5;margin:6px 2px 0;">삭제(숨김)된 펫은 연출에 지정할 수 없어요. <b>복구</b> 후 지정하세요.</p>';
      }
      h+='<p class="muted" style="font-size:11.5px;line-height:1.5;margin:8px 2px 0;">여기 지정한 펫은 <b>한정(무지개) 등급을 뽑을 때만</b> 연출에 등장해요. <b>그 외 등급</b>(특별·전설·신화)은 <b>전설·신화 펫 중 랜덤 2마리</b>가 걸어나와 톡 칩니다. <b>1번</b>=왼쪽, <b>2번</b>=오른쪽(둘 다면 <b>1번 끝난 뒤 2번</b> 순차, 크기는 펫 배율만큼). 현재 1번=<b>'+escapeHtml(gachaFxSlotDesc('a'))+'</b> · 2번=<b>'+escapeHtml(gachaFxSlotDesc('b'))+'</b>.</p>';
      h+='<div class="petmg-btns" style="margin-top:8px;"><button class="btn ghost" '+App.view.act('devPreviewGachaFx')+'>▶︎ 연출 미리보기</button></div>';
      h+='</div>';
      return h; }
    // 🚨 lsGet/lsSet 은 cats.house.js(cats.js 뒤에 로드)에 있어 모듈 로드시점엔 미정의 → 여기서 직접 호출하면 ReferenceError 로 cats.js 로드가 이 줄에서 중단되고,
    //    이후 선언되는 let/const 가 전부 TDZ가 되어(예: 펫관리 build()가 "_devPetSpecies before initialization" 오류) 화면이 안 열리던 치명 버그였다.
    //    → 모듈 로드시점엔 안전한 기본값('all')만 넣고, 저장값은 첫 사용(openDevPetManager 실행 시점, 그땐 lsGet 정의됨)에 지연 로드한다.
    let _devPetSpecies='all';   // 개발자 펫 관리 종류 탭(기본값 — 저장값은 dpSpeciesLoad()가 지연 로드)
    let _dpSpLoaded=false;
    function dpSpeciesLoad(){ if(_dpSpLoaded) return; _dpSpLoaded=true; try{ if(typeof lsGet==='function') _devPetSpecies=lsGet('devPetSpecies','all')||'all'; }catch(_){} }
    function setDevPetSpecies(s){ _dpSpLoaded=true; _devPetSpecies=s||'all'; try{ if(typeof lsSet==='function') lsSet('devPetSpecies',_devPetSpecies); }catch(_){} if(state._sheetRefresh) state._sheetRefresh(); }
    function openDevPetManager(){ if(!(typeof isDev==='function'&&isDev())){ toast('개발자 전용'); return; }
      dpSpeciesLoad();   // 저장된 탭 지연 로드(lsGet은 이 시점엔 정의됨)
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
        h+='<div class="subseg pettabs">'+tabs.map(t=>'<button class="'+(_devPetSpecies===t[0]?'on':'')+'" '+App.view.act('setDevPetSpecies',t[0])+'>'+escapeHtml(t[1])+' <b>'+t[2]+'</b></button>').join('')+'</div>';
        // 등급별 섹션(도감식) — 활성 펫은 등급 그룹 그리드, 삭제됨은 맨 끝 섹션
        const active=list.filter(p=>!p.deleted), del=list.filter(p=>p.deleted); let body='';
        TIER_ORDER.forEach(function(tid){ const grp=active.filter(p=>p.tier===tid); if(!grp.length) return;
          body+='<div class="dexgh pmgh"><span class="dexgt">'+tierLabelHtml(tid)+'</span><span class="dexgn">'+grp.length+'</span></div>';
          body+='<div class="palette catinv pmgrid">'+grp.map(p=>safePetCell(p, sel)).join('')+'</div>'; });
        if(del.length){ body+='<div class="dexgh pmgh"><span class="dexgt" style="color:var(--sub)">삭제됨</span><span class="dexgn">'+del.length+'</span></div>';
          body+='<div class="palette catinv pmgrid">'+del.map(p=>safePetCell(p, sel)).join('')+'</div>'; }
        h+=body || '<div class="empty" style="padding:16px;">이 종류의 펫이 없어요</div>';
        return h; };
      // 🛡️ 렌더가 어떤 이유로든 예외를 던져도 시트는 반드시 열리게(예외 시 '안 들어가짐'처럼 보이던 문제 방어) — 오류 내용을 화면에 표기.
      const safeBuild=()=>{ try{ return build(); }catch(e){ try{ console.error('펫 관리 렌더 오류', e); }catch(_){}
        return '<div class="note" style="color:var(--danger,#e5484d);">펫 관리 화면을 그리는 중 오류가 났어요.<br><b>'+escapeHtml((e&&e.message)||String(e))+'</b><br><span style="color:var(--sub)">앱을 최신으로 업데이트(설정 → 앱 업데이트 확인) 후 다시 시도해 주세요.</span></div>'; } };
      openSheet('펫 관리', safeBuild());
      // 등급·가챠전용 변경(catalogPets 리스너) 시 목록 갱신 — 스크롤·선택 유지
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(!b) return; const st=b.scrollTop; b.innerHTML=safeBuild(); b.scrollTop=st; }; }

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
      h+='<div class="subseg">'+FURN_TYPES.map(function(c){ return '<button class="'+(_furnSub===c[0]?'on':'')+'" '+App.view.act('setFurnSub',c[0])+'>'+c[1]+'</button>'; }).join('')+'</div>';
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
          return '<button class="petmg-row" '+App.view.act('exportPetStatic',p.id)+'>'+
            '<span class="pm-thumb">'+catFace(p.id,{h:52})+'</span>'+
            '<span class="pm-txt"><span class="pm-nm">'+catNameSpan(p.id, p.name||p.id)+'</span>'+
            '<span class="pm-meta">'+escapeHtml(tag)+' · '+tierLabelHtml(p.tier)+' · 런타임</span></span></button>'; }).join('')+'</div>';
      } else { h+='<p class="muted" style="font-size:12px;margin:2px;">승격할 런타임 펫이 없어요.</p>'; }
      h+='</div>';
      h+='<div class="petmg-btns" style="margin-top:10px;"><button class="btn ghost" '+App.view.act('migrateCatalogArtOnce')+'>이미지 분리 이전(1회)</button></div>';
      h+='<p class="muted" style="font-size:11.5px;line-height:1.5;margin:8px 2px 0;">승격=런타임 펫을 파일 에셋으로 옮겨 RTDB 부담을 줄임(<code>tools/pets.json</code>+<code>build_pets.py</code>). 분리 이전=예전 인라인 아트를 <code>catalogPetArt</code>로 옮기는 1회 작업.</p>';
      openSheet('데이터 정리', h); }

