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
      { id:'food',       name:'사료',   price:1,  M:'M_FOOD',      effect:{fill:'food',  ms:3*60*60*1000}, desc:'밥그릇을 탭해 채울 때 1개 소모(3시간 유지).' },
      { id:'water',      name:'물',     price:1,  M:'M_WATER',     effect:{fill:'water', ms:3*60*60*1000}, desc:'물그릇을 탭해 채울 때 1개 소모(3시간 유지).' },
      { id:'food_plus',  name:'고급사료', price:3,  M:'M_FOODPLUS',  effect:{fill:'food',  ms:6*60*60*1000}, desc:'밥그릇을 6시간 유지하는 고급 사료. 자주 안 채워도 행복도가 오래 유지돼요.' },
      { id:'water_plus', name:'정수물', price:3,  M:'M_WATERPLUS', effect:{fill:'water', ms:6*60*60*1000}, desc:'물그릇을 6시간 유지하는 정수된 물.' },
      { id:'treat',      name:'츄르',   price:20, M:'M_TREAT',     effect:{affection:1}, dailyBuy:3, desc:'펫에게 주면 애정 +1 (쓰다듬기 쿨다운 무시). 하루 3개까지 구매.' },
      { id:'tonic',      name:'영양제', price:0,  M:'M_TONIC',     effect:{boost:1.5, ms:6*60*60*1000}, dailyBuy:1, desc:'무료로 하루 1개 받아요. 사용하면 6시간 동안 수확 수익이 ×1.5.' }
    ];
    const FILL_MS = 3*60*60*1000;   // 그릇이 채워진 뒤 비워지기까지(3시간)
    const MOOD_CARE_MS = 24*60*60*1000;   // ❤️ 수확(caredAt) 후 행복도 보너스가 0으로 빠지는 시간(24h)
    const POOP_REWARD = 4;          // 똥 하나 치우면 얻는 은화
    const CARE_ITEMS = ['bowl','waterbowl','litterbox'];   // 케어 아이템(밥·물·화장실)
    function careCap(){ return Math.max(1, Math.min(3, activeCats().length)); }   // 방당 상한 = 이 방 활성 펫 수(최대 3, 다묘 대응). enrichTypeCount가 케어를 제외하므로 개수는 행복도·enrichment에 영향 없음(순수 배치 편의).
    // (구 "빈 슬롯 자동 채우기(autoFillSlots)"는 제거 — 2026-07 사용자 지침: 펫 배치는 배치모드에서 직접 선택)
    // 🪙 수확 드롭 확률(경제 정책 §3-C): 시간당 금화 10% + 랜덤박스 15%·펫알 8%·뜰알 2%. 활성 펫 있을 때만.
    //   ⚠️ 획득 경로는 '수확 순간 일괄 롤'에서 실시간 스폰(reconcileDrops, 10분 단위 p/6 롤)으로 대체 — 기대값 동일, 방 바닥에 드랍이 놓여 클릭/수확으로 수령.
    //   랜덤박스 드랍은 수령 순간 실제 박스 확률(rollBoxReward)로 열어 아이템으로 지급(알 종류는 봉인 상태 그대로 인벤토리).
    const HARVEST_ROLL = { gold:0.10, egg:0.08, box:0.15, ddeul:0.02 };
    // 🎁 실시간 드랍 스폰 상수 — PiP·캠 힐끔 요소. 시계(g.dropRollAt)는 소비한 롤만큼만 전진(만석이면 시간 보존), 24h 캡이 무한 누적 방지.
    //   스폰 대상은 "한 방"뿐(dropTargetRoom — 현재 방 우선) — 방이 5개라고 ×5로 쏟아지지 않고, 대기 상한도 그 방 3개가 전부.
    const DROP_ROLL_MS = 10*60000;   // 롤 단위(10분)
    const DROP_ROLL_DIV = 6;         // 롤당 확률 = HARVEST_ROLL/6 (10분×6회 = 시간당 기대값 보존)
    const DROP_MAX_ROOM = 3;         // 대기 드랍 상한(util.js normRoom의 3개 절단과 짝) — 단일 대상 방이라 사실상 전체 상한
    const DROP_ROLL_CAP = 144;       // 소급 롤 상한 = 24h × 6 (기존 rollH 24h 캡과 동일 회계)
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
    function bgfxOverlayHtml(id){ if(!id) return ''; const lite=liteMode(); const N=k=>Math.max(3,Math.round(k*(lite?0.6:1))); let s='';
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
      const none='<button class="skinsw'+(!cur?' on':'')+'" onclick="applyBgfx(\'\')" aria-label="배경효과 없음"><span class="sw sw-none">✕</span><span class="nm">없음</span>'+(!cur?CK:'')+'</button>';
      const sw=owned.map(x=>{ const on=cur===x.id; return '<button class="skinsw'+(on?' on':'')+'" onclick="applyBgfx(\''+x.id+'\')" aria-label="'+escapeHtml(x.name)+(on?' 적용됨':' 적용')+'"><span class="sw sw-bgfx">'+bgfxThumb(x.id,26)+'</span><span class="nm">'+escapeHtml(x.name)+'</span>'+(on?CK:'')+'</button>'; }).join('');
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
      tiger_orange:{ walk:'assets/pets/tiger/tiger_orange/walk.png', frames:6, stills:true, scale:5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      lion_mane:{ walk:'assets/pets/lion/lion_mane/walk.png', frames:6, stills:true, scale:5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_persian:{ walk:'assets/pets/cat/cat_persian/walk.png', frames:6, stills:true },
      tiger_white:{ walk:'assets/pets/tiger/tiger_white/walk.png', frames:6, stills:true, scale:5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_russianblue:{ walk:'assets/pets/cat/cat_russianblue/walk.png', frames:6, stills:true },
      cat_bengal2:{ walk:'assets/pets/cat/cat_bengal2/walk.png', frames:6, stills:true },
      dog_mutt:{ walk:'assets/pets/dog/dog_mutt/walk.png', frames:6, stills:true, scale:1.5 },
      cat_panther:{ walk:'assets/pets/cat/cat_panther/walk.png', frames:6, stills:true, scale:3, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
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
      dog_jindo:{ walk:'assets/pets/dog/dog_jindo/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
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
      cat_leopardcat:{ walk:'assets/pets/cat/cat_leopardcat/walk.png', frames:6, stills:true, scale:1.5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_lynx:{ walk:'assets/pets/cat/cat_lynx/walk.png', frames:6, stills:true, scale:2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_cheetah:{ walk:'assets/pets/cat/cat_cheetah/walk.png', frames:6, stills:true, scale:3, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_jaguar:{ walk:'assets/pets/cat/cat_jaguar/walk.png', frames:8, stills:true, scale:5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_puma:{ walk:'assets/pets/cat/cat_puma/walk.png', frames:8, stills:true, scale:5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_snowleopard:{ walk:'assets/pets/cat/cat_snowleopard/walk.png', frames:8, stills:true, scale:5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_caracal:{ walk:'assets/pets/cat/cat_caracal/walk.png', frames:8, stills:true, scale:5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_leopard:{ walk:'assets/pets/cat/cat_leopard/walk.png', frames:8, stills:true, scale:5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_blackpanther:{ walk:'assets/pets/cat/cat_blackpanther/walk.png', frames:8, stills:true, scale:5, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_ocelot:{ walk:'assets/pets/cat/cat_ocelot/walk.png', frames:8, stills:true, scale:4, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
      cat_sandcat:{ walk:'assets/pets/cat/cat_sandcat/walk.png', frames:6, stills:true },
      cat_mainecoonsmoke:{ walk:'assets/pets/cat/cat_mainecoonsmoke/walk.png', frames:6, stills:true },
      cat_mainecoonred:{ walk:'assets/pets/cat/cat_mainecoonred/walk.png', frames:6, stills:true },
      cat_bengalsilver:{ walk:'assets/pets/cat/cat_bengalsilver/walk.png', frames:6, stills:true },
      cat_peterbald:{ walk:'assets/pets/cat/cat_peterbald/walk.png', frames:6, stills:true },
      cat_toyger:{ walk:'assets/pets/cat/cat_toyger/walk.png', frames:6, stills:true, scale:1.2, clips:{ idle:4, sit:4, belly:4, eat:6, drink:4, yawn:6, angry:4 } },
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
      sleep: { dir:'east',  fps:4 }   // 💤 옆으로 엎드려 눈 감고 잠(느린 호흡 loop) — 미보유 펫은 폴백 null=기존 north 스틸
    };
    // 펫이 이 클립 시트를 실제로 갖고 있나 — 정적=clips 메타(파일 존재는 파이프라인이 보장), 런타임=아트(clipUrls)까지 도착해야 true.
    // 💗 신화(limited)·한정(exclusive) 모션 애정 해금(프레스티지, 2026-07 레벨 재배치):
    //    Lv1=기본 모션(idle·sit·eat·drink — 첫 애정에 생동감이 켜짐) · Lv2=belly·yawn(식빵·하품) · Lv4=angry(하악질).
    //    Lv0(애정 없음)은 클립 없이 기존 스틸/걷기만. 신화 미만 등급은 게이트 없음(전부 개방).
    //    친구 방 등 "내가 소유하지 않은" 펫은 애정 정보가 없어 잠금으로 취급(비소유자가 더 많이 보는 역전 방지).
    const CLIP_AFF_REQ={ idle:1, sit:1, eat:1, drink:1, belly:2, yawn:2, angry:4 };
    function clipAffLocked(id, clip){ const req=CLIP_AFF_REQ[clip]; if(!req) return false;
      const t=CAT_TIER[id]||'normal'; if(t!=='limited'&&t!=='exclusive') return false;
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
      if(cosm.hat&&HAT_M[cosm.hat]) h+='<span class="cd-hat">'+hatSvg(cosm.hat,{h:Math.max(8,Math.round(s*0.30))})+'</span>';
      if(BUDDY_CATALOG[cosm.buddy]) h+='<span class="cd-buddy cb-'+cosm.buddy+'"><i class="cb-path"><i class="cb-bob">'+buddySvgOf(cosm.buddy,{h:Math.max(7,Math.round(s*(cosm.buddy==='firefly'?0.15:0.20)))})+'</i></i></span>';
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
    function furnMatrix(id){ return {pond:M_POND,cushion:M_CUSHION,bowl:M_BOWL,waterbowl:M_WATERBOWL_WATER,tower:M_TOWER,scratcher:M_SCRATCHER,litterbox:M_LITTER,pethouse:M_PETHOUSE,plant:M_PLANT,catwheel:M_CATWHEEL,rug:M_RUG,window:M_WINDOW,fishtank:M_FISHTANK,fireplace:M_FIREPLACE,fan:M_FAN,hammock:M_HAMMOCK,teaser:M_TEASER,wallclock:M_WALLCLOCK,hangplant:M_HANGPLANT,mobile:M_MOBILE,chandelier:M_CHANDELIER,jingleball:M_JINGLEBALL,frame:M_FRAME,shelf:M_SHELF,mirror:M_MIRROR,neon:M_NEON,sconce:M_SCONCE,garland:M_GARLAND,poster:M_POSTER,tapestry:M_TAPESTRY,cactus:M_CACTUS,yarnbasket:M_YARNBASKET,floorlamp:M_FLOORLAMP,beanbag:M_BEANBAG,groomstation:M_GROOMSTATION,springtoy:M_SPRINGTOY,tunnel:M_TUNNEL,teepee:M_TEEPEE,bookshelf:M_BOOKSHELF,birdcage:M_BIRDCAGE,lavalamp:M_LAVALAMP,laserpost:M_LASERPOST,waterfountain:M_WATERFOUNTAIN,sofa:M_SOFA,recordplayer:M_RECORDPLAYER,terrarium:M_TERRARIUM,ballpit:M_BALLPIT,grandfaclock:M_GRANDFACLOCK,bunkbed:M_BUNKBED,crystalfountain:M_CRYSTALFOUNTAIN,dartboard:M_DARTBOARD,cuckooclock:M_CUCKOOCLOCK,roundbed:M_ROUNDBED,donutbed:M_DONUTBED,cavebed:M_CAVEBED,canopybed:M_CANOPYBED,throne:M_THRONE,mousetoy:M_MOUSETOY,catnippillow:M_CATNIPPILLOW,puzzlefeeder:M_PUZZLEFEEDER,balltrack:M_BALLTRACK,teetertoy:M_TEETERTOY,bubblemachine:M_BUBBLEMACHINE,bonsai:M_BONSAI,globe:M_GLOBE,snowglobe:M_SNOWGLOBE,campfire:M_CAMPFIRE,gramophone:M_GRAMOPHONE,arcademachine:M_ARCADEMACHINE,jukebox:M_JUKEBOX,crystalcluster:M_CRYSTALCLUSTER,easel:M_EASEL,floorvase:M_FLOORVASE,suitofarmor:M_SUITOFARMOR,hourglass:M_HOURGLASS,telescope:M_TELESCOPE,gumballmachine:M_GUMBALLMACHINE,wallvines:M_WALLVINES,pennant:M_PENNANT,wallmask:M_WALLMASK,barometer:M_BAROMETER,stringlights:M_STRINGLIGHTS,wallbutterfly:M_WALLBUTTERFLY,cornershelf:M_CORNERSHELF,wallsun:M_WALLSUN,treatjar:M_TREATJAR,catgrass:M_CATGRASS,groomarch:M_GROOMARCH,heatpad:M_HEATPAD,peekbox:M_PEEKBOX,tetherpole:M_TETHERPOLE,windmilltoy:M_WINDMILLTOY,crinklebag:M_CRINKLEBAG,roundrug:M_ROUNDRUG,runner:M_RUNNER,koipond:M_KOIPOND,displaycase:M_DISPLAYCASE,woodstove:M_WOODSTOVE,mushroomlamp:M_MUSHROOMLAMP,statuecat:M_STATUECAT,teacart:M_TEACART,crystaltree:M_CRYSTALTREE}[id]; }
    function furnSvg(id, opt){ return pxSvg(furnMatrix(id), FURN_PALS[id], opt); }
    // 캠 전용 연출(움직이는 부분만 오버레이로 분리해 CSS 애니메이션): 같은 매트릭스를 팔레트만 나눠 두 겹으로 그림.
    //  base=움직이는 글자 제외, fx=그 글자만 → 완벽히 겹쳐 정지 배경 + 움직이는 부품(캣휠 트레드 회전·펫알 방울 흔들림·화분 잎 살랑).
    const FURN_ANIM = {
      // move=오버레이(움직이는)로 뺄 글자, type=애니메이션 종류(spin/swing/sway/drift/flicker). 배열=여러 모션 레이어(각기 다른 속도/움직임).
      pond:    [ { type:'drift', move:['O','o','X','t'], cls:'pondfish' },   // 물고기 2마리 활발히 헤엄(fffish)
                 { type:'drift', move:['P','p'], cls:'pondleaf' },          // 수련잎 잔잔히 흔들(ffleaf)
                 { type:'drift', move:['r','S'], cls:'pondwater' } ],       // 물 하이라이트/반짝임 잔잔히 일렁(ffripple)
      catwheel:{ type:'spin',  move:['T','t','H'] },   // 링(림·밴드·하이라이트·발판) 전체가 축 중심으로 제자리 회전 — 롤러 R·스탠드 D만 정지
      tower:   { type:'swing', move:['T','O','K'] },   // 매달린 장난감 공(빨강 T·하이라이트 O)+끈(K)
      scratcher:{type:'swing', move:['T','O','H','K'] },   // 매달린 공(O)+하이라이트(H)+끈(T)
      plant:   { type:'sway',  move:['G','L','l','I'] },   // 잎만 살랑(줄기 S·화분 P/p/X는 정지)
      window:  { type:'drift', move:['C','c'] },           // 구름만 좌우로 천천히 흘러감(하늘 S·해 U/u·틀은 정지)
      fishtank:{ type:'drift', move:['F','f','b'] },   // 금붕어+기포만 헤엄치듯 좌우로(물 A·수초 P·자갈 R은 정지)
      fireplace:{type:'flicker',move:['f','F','r'] },  // 불꽃만 일렁임(벽돌·맨틀·장작은 정지)
      fan:     { type:'spin',  move:['G','L','D','h'] },   // 케이지 안 날개(G 중간·L 하이라이트·D 그림자 명암)+허브(h)가 함께 회전(림 X·목·받침은 정지). 진한 하늘색 날개(B)는 팔레트에서 빼 투명 처리(뒷배경 비침)
      hammock: { type:'swing', move:['K','C','c','L','l','P','p'] },// 끈+천 요람+베개가 매단 지점에서 살랑(기둥 X/W/w 정지)
      teaser:  { type:'swing', move:['K','F','f','H','T'] },// 줄+깃털 장난감이 대 끝에서 흔들(대 R·받침 정지)
      wallclock:{type:'swing', move:['K','O','o','D'] },       // 추(봉+놋쇠)만 좌우로(몸통·시계판 정지)
      hangplant:{type:'swing', move:['L','l','I','G','g'] }, // 걸이 아래 전체가 살랑(천장 걸이 X 정지)
      mobile:  { type:'swing', move:['A','a','B','b','C','c','W','K'] }, // 막대+매달린 별·달·하트 전체가 살랑(걸이 X 정지)
      chandelier:{type:'sway', move:['Y','y','W','H','C','c','o','v'] }, // 천장에서 전체가 흔들(매다는형, 상단 피벗) — 더 활발하게(각↑·빠르게)
      jingleball:{type:'swing', move:['X','B','b','L','H','S'] },  // 공 전체가 바닥에서 통통(바닥 접점 중심)
      neon:    {type:'blink',  move:['N','n','H','C','S'] },   // 네온 하트+글로우+반짝임이 네온처럼 파르르 깜빡(더 활발)
      sconce:  {type:'flicker',move:['F','Y','y'] },   // 벽등 촛불이 활발히 일렁(빠르게·크게)
      mirror:  {type:'sheen',  move:['h'] },   // 거울 사선 광택이 반짝 스윕(정적→연출 추가)
      garland: {type:'blink',  move:['A','B','C','a','b','c','H'] },  // 가랜드 전구만 깜빡(줄 K 정지)
      cactus: {type:'sway', move:['f', 'F', 'Y'] },
      yarnbasket: {type:'sway', move:['R', 'r', 'G', 'g'] },
      floorlamp: {type:'flicker', move:['F', 'Y', 'H', 'o'] },
      groomstation: {type:'sway', move:['s', 't', 'S'] },
      springtoy: {type:'swing', move:['B', 'b', 'L', 'R', 'W', 'S', 'x'] },
      birdcage: {type:'swing', move:['Y', 'y', 'o', 'B', 'R', 'T', 't'] },
      lavalamp: {type:'drift', move:['R', 'o', 'O', 'Y', 'r'] },
      laserpost: {type:'blink', move:['R', 'r', 'L', 'P', 'Y'] },
      waterfountain: {type:'drift', move:['A', 'a', 'H', 'h'] },
      recordplayer: {type:'spin', move:['R', 'r'] },
      terrarium: {type:'sway', move:['L', 'l', 'D', 'f', 'F'] },
      ballpit: {type:'drift', move:['R', 'r', 'Y', 'y', 'G', 'g', 'P', 'p', 'B', 'b'] },
      grandfaclock: {type:'swing', move:['O', 'o', 'K'] },
      crystalfountain: {type:'drift', move:['A', 'a', 'H', 'h', 's', 'K', 'C', 'c', 'B'] },
      cuckooclock: {type:'swing', move:['O', 'o', 'Y', 'k', 'K'] },
      balltrack: {type:'spin', move:['R', 'r', 'Y', 'G'] },
      teetertoy: {type:'swing', move:['R', 'r', 'B', 'b', 'H'] },
      bubblemachine: {type:'drift', move:['B', 'b', 'L'] },
      bonsai: {type:'sway', move:['G', 'L', 'l', 'I', 'f'] },
      globe: {type:'spin', move:['A', 'a', 'G', 'g', 'L'] },
      snowglobe: {type:'drift', move:['S', 's', 'H'] },
      campfire: {type:'flicker', move:['f', 'F', 'r', 'o'] },
      gramophone: {type:'spin', move:['R'] },
      arcademachine: {type:'blink', move:['S', 'R', 'Y', 'B', 'L'] },
      jukebox: {type:'blink', move:['R', 'B', 'Y', 'G'] },
      crystalcluster: {type:'sway', move:['h', 'H', 'P', 'C', 'W'] },
      hourglass: {type:'drift', move:['S', 'y'] },
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
      koipond: {type:'drift', move:['L', 'W', 'P', 'p', 'o', 'r'] },
      woodstove: {type:'flicker', move:['f', 'F', 'r', 'o'] },
      mushroomlamp: {type:'flicker', move:['L', 'o', 'H'] },
      crystaltree: {type:'sway', move:['b', 'H', 'p', 'P', 'C', 'c'] },
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
    // 🎨 랜덤 염색약 — 코르크+유리병+무지개 3단 액체(PIL 라이트/다크 검수 통과, scratchpad dye.py).
    //    사용하면 펫 전체 톤을 랜덤 변경(owned.cats[id].dye = hue-rotate 각도). 상점 비매 — 이벤트·쿠폰·선물 지급 전용(경제 보수 정책).
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
    const ROOM_H = { pond:2.2, tower:2.5, scratcher:1.4, pethouse:2.8, catwheel:3.0, plant:1.5, litterbox:0.75, cushion:1, bowl:0.5, waterbowl:0.5, rug:2.6, window:1.4, fishtank:1.4, fireplace:1.4, fan:2.7, hammock:1.8, teaser:2.4, wallclock:1.4, hangplant:1.4, mobile:1.4, chandelier:2.2, jingleball:0.7, frame:1.4, shelf:1.4, mirror:1.4, neon:1.4, sconce:1.4, garland:1.4, poster:1.4, tapestry:1.4, cactus:1.5, yarnbasket:1.0, floorlamp:2.6, beanbag:1.15, groomstation:1.5, springtoy:1.3, tunnel:1.2, teepee:2.4, bookshelf:2.6, birdcage:2.2, lavalamp:2.0, laserpost:1.6, waterfountain:1.2, sofa:1.4, recordplayer:1.2, terrarium:1.6, ballpit:1.6, grandfaclock:2.8, bunkbed:2.8, crystalfountain:2.4, dartboard:1.4, cuckooclock:1.4, roundbed:1.0, donutbed:1.0, cavebed:2.2, canopybed:2.8, throne:2.4, mousetoy:0.7, catnippillow:0.9, puzzlefeeder:1.0, balltrack:1.2, teetertoy:1.2, bubblemachine:1.6, bonsai:1.6, globe:1.4, snowglobe:1.5, campfire:1.4, gramophone:1.6, arcademachine:2.8, jukebox:2.0, crystalcluster:1.8, easel:2.2, floorvase:2.0, suitofarmor:2.6, hourglass:1.6, telescope:2.2, gumballmachine:1.8, wallvines:1.4, pennant:1.4, wallmask:1.4, barometer:1.4, stringlights:1.4, wallbutterfly:1.4, cornershelf:1.4, wallsun:1.4, treatjar:1.5, catgrass:1.9, groomarch:1.9, heatpad:1.2, peekbox:1.6, tetherpole:2.2, windmilltoy:2.0, crinklebag:1.6, roundrug:1.4, runner:1.2, koipond:1.4, displaycase:2.5, woodstove:2.1, mushroomlamp:1.9, statuecat:2.1, teacart:2.0, crystaltree:2.2 };   // 1×1 벽 가구=1.4: 벽 1칸에 맞춰 겹침 방지. 샹들리에=2.2(매다는 대형 센터피스, footW2). 가랜드=footW3.
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
    const FURN_ASPECT = { pond:1.722, tower:0.64, scratcher:0.842, pethouse:0.895, catwheel:1.0, plant:0.727, litterbox:1.286, cushion:1.2, bowl:1.333, waterbowl:1.333, rug:2.154, window:0.875, fishtank:1.067, fireplace:1.067, fan:0.8, hammock:0.941, teaser:0.842, wallclock:0.889, hangplant:1.0, mobile:1.333, chandelier:1.333, jingleball:1.067, frame:1.077, shelf:1.6, mirror:1.0, neon:1.143, sconce:1.143, garland:3.286, poster:1.0, tapestry:0.923, cactus:0.615, yarnbasket:0.9, floorlamp:0.64, beanbag:1.059, groomstation:0.762, springtoy:0.762, tunnel:1.421, teepee:0.8, bookshelf:0.615, birdcage:0.667, lavalamp:0.696, laserpost:0.762, waterfountain:0.762, sofa:1.688, recordplayer:0.941, terrarium:0.941, ballpit:1.867, grandfaclock:0.571, bunkbed:0.727, crystalfountain:1.368, dartboard:1.0, cuckooclock:0.762, roundbed:1.385, donutbed:1.385, cavebed:1.067, canopybed:1.067, throne:1.067, mousetoy:1.333, catnippillow:1.417, puzzlefeeder:1.333, balltrack:2.083, teetertoy:1.143, bubblemachine:1.067, bonsai:0.889, globe:1.0, snowglobe:1.067, campfire:1.067, gramophone:1.0, arcademachine:1.0, jukebox:1.067, crystalcluster:1.143, easel:1.067, floorvase:1.067, suitofarmor:1.0, hourglass:1.067, telescope:1.0, gumballmachine:1.067, wallvines:1.308, pennant:1.75, wallmask:0.923, barometer:0.857, stringlights:3.143, wallbutterfly:1.091, cornershelf:1.333, wallsun:1.0, treatjar:0.786, catgrass:1.143, groomarch:1.143, heatpad:1.231, peekbox:1.333, tetherpole:1.067, windmilltoy:1.067, crinklebag:1.231, roundrug:1.556, runner:2.286, koipond:1.778, displaycase:1.143, woodstove:1.067, mushroomlamp:1.143, statuecat:1.067, teacart:1.231, crystaltree:1.067 };
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
    const MAX_RBCOIN=999999;   // 🌈 무지개동전 상한(단일 소스 — normalizeGame/grantRbcoin/선물함 공용)
    function clampRbcoin(v){ return Math.min(MAX_RBCOIN, Math.max(0, Math.floor(Number(v)||0))); }
    function clampGold(v){ return Math.min(MAX_GOLD, Math.max(0, Math.floor(Number(v)||0))); }
    function clampConsum(v){ return Math.min(MAX_CONSUM, Math.max(0, Math.floor(Number(v)||0))); }
    function atMaxCoins(){ return coins()>=MAX_COINS; }
    function atMaxGold(){ return gold()>=MAX_GOLD; }
    function maxChip(){ return ' <span class="maxchip">최대</span>'; }
    function normalizeGame(g){ g=g||{}; return migratePetIds({
      coins: clampCoins(g.coins), gold: clampGold(g.gold),
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
      buyDay: (g.buyDay && typeof g.buyDay==='object') ? g.buyDay : {},      // 🛒 하루 구매 카운트(품목별) {day, n:{id:count}} — 츄르(3)·영양제(무료 1) 등 dailyBuy 소비템
      boost: (g.boost && typeof g.boost==='object') ? { until:Math.max(0,Math.floor(Number(g.boost.until)||0)), mult:Math.max(1,Number(g.boost.mult)||1) } : { until:0, mult:1 },   // 💊 수확 수익 부스트 버프 {until(ms), mult}
      dropRollAt: Math.max(0, Math.floor(Number(g.dropRollAt)||0)),   // 🎁 드랍 스폰 롤 시계(ms, 전역 1개) — reconcileDrops가 10분 단위로 소비
      affV: Math.max(0, Math.floor(Number(g.affV)||0)),   // 💗 애정 계단 개편 마이그레이션 마커(2=완료, migrateAffRwIfNeeded) — normalizeGame이 객체를 재생성하므로 반드시 여기 유지
      rbcoin: clampRbcoin(g.rbcoin),   // 🌈 무지개동전 — 한정 등급 중복 획득 시 +1, 무지개알/박스(5개) 소비
      rbcoinTotal: Math.max(0, Math.floor(Number(g.rbcoinTotal)||0)),   // 🌈 누적 획득(CS·어뷰즈 추적용 — 소비해도 안 줄어듦)
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
      state._gameRef.on('value', s=>{ const raw=s.val(); state.game=normalizeGame(raw); migrateHomeRoomsIfNeeded(raw); migrateAffRwIfNeeded(raw); migrateRbEconomyIfNeeded(raw); ensureRoomIds(); ensureHarvestClocks(); onGameChange(); reconcilePets(); reconcileDrops(); checkDexMilestones(); });
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
      // 앱을 켜둔 동안에도 그릇 3시간 만료→똥 정산 + 드랍 스폰 롤이 돌도록 주기 점검(다마고치)
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
        const dw=$('catdock'); const wall=dw&&dw.querySelector('.cr-wall'); if(wall){ wall.style.background=wallCss(currentWall()); wall.innerHTML=wallSceneHtml(currentWall()); }   // 움직이는 하늘 벽지 씬도 라이브 반영
        const fl=dw&&dw.querySelector('.cr-floor'); if(fl){ fl.style.background=floorCss(currentFloor()); fl.innerHTML=floorSceneHtml(currentFloor()); }   // 바닥 적용도 dock 캠에 라이브 반영(벽지처럼) + 움직이는 들판 씬
        const ov=dw&&dw.querySelector('.cr-overlay'); if(ov) ov.innerHTML=bgfxOverlayHtml(currentBgfx());   // 배경효과 오버레이도 방 변경 시 dock 라이브 반영
        const rn=$('cdCamTxt'); if(rn){ rn.textContent=(room().emoji?room().emoji+' ':'')+(room().name||'우리집'); }   // dock LIVE 배지의 현재 방 이름(항상 표시)
        const tr=dw&&dw.querySelector('.cr-topright'); if(tr) tr.outerHTML=batchBtnHtml();   // dock 하트(행복도)·수확칩도 라이브 반영 — renderDock에서만 만들어져 0%로 굳던 버그(지갑은 _walletDisp/syncWalletText라 재렌더 안전)
        renderDockProps();
        renderDockCats();
      }
      if(typeof pipOpen==='function' && pipOpen()){   // 🖥️ PiP 미니 캠도 dock와 동일하게 라이브 패치(벽·바닥·오버레이·방이름·가구·펫)
        try{
          const pw=_pip.room.querySelector('.cr-wall'); if(pw){ pw.style.background=wallCss(currentWall()); pw.innerHTML=wallSceneHtml(currentWall()); }
          const pf=_pip.room.querySelector('.cr-floor'); if(pf){ pf.style.background=floorCss(currentFloor()); pf.innerHTML=floorSceneHtml(currentFloor()); }
          const po=_pip.room.querySelector('.cr-overlay'); if(po) po.innerHTML=bgfxOverlayHtml(currentBgfx());
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
      dye:       { name:'염색약',     icon:o=>consumSvg('dye',o), use:'dye'  },   // 🎨 랜덤 염색약 — 가방에서 펫 선택, 톤 랜덤 변경(이벤트·쿠폰·선물 지급 전용, 상점 비매)
      dye_remover:{ name:'염색 리무버', icon:o=>consumSvg('dye_remover',o), use:'dye_remover' }   // 🧴 염색 제거 — 염색된 펫 선택해 원래 톤 복원(이벤트·쿠폰·선물 지급 전용, 상점 비매)
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
      const consumKeys=['egg','box','ddeul'];
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
      const opts=[['coins','은화'],['gold','금화'],['rbcoin','무지개동전'],['egg','펫알'],['box','랜덤박스'],['ddeul','뜰알']];   // 🌈 무지개알/박스 소비템은 폐지(수령분은 동전 환산) — 동전으로 직접 지급
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
        const order=['egg','box','ddeul','treat','tonic','dye','dye_remover','food','water','food_plus','water_plus'];   // (무지개알·박스는 소비 인벤토리 폐지 — 무지개 탭 직접 뽑기)
        const rows=order.filter(k=>consumQty(k)>0);
        const g=state.game, boostOn=activeBoostMult(g)>1;
        let h='<div class="bag">';
        if(!rows.length){ h+='<div class="empty" style="padding:30px 12px;">가방이 비었어요. 알뜰샵·선물함에서 아이템을 얻어보세요 🎒</div>'; }
        else h+=rows.map(k=>{ const m=CONSUM_META[k], q=consumQty(k);
          // 가방 사용 3갈래: 간식·영양제·염색약=바로 사용 / 알·박스류=가챠샵 이동 / 사료·물류=홈 그릇 탭 안내.
          const bagUse=(m.use==='treat'||m.use==='tonic'||m.use==='dye'||m.use==='dye_remover');
          const useBtn = bagUse ? '<button class="buy sm" onclick="useBagItem(\''+k+'\')" aria-label="'+m.name+' 사용">사용</button>'
                       : (m.use ? '<button class="buy ghost sm" onclick="goGachaShop()" aria-label="'+m.name+' 가챠샵에서 열기">가챠샵에서 열기</button>'
                                : '<span class="qty" style="font-size:11px;color:var(--sub)">홈에서 그릇 탭</span>');
          const sub=(k==='tonic'&&boostOn)?' <span class="tagmini">사용중 '+fmtDur(boostRemain(g))+'</span>':'';
          return '<div class="bagrow"><span class="bgic">'+m.icon({h:34})+'</span><b class="bgnm'+((k==='rainbow_egg'||k==='rainbow_box'||k==='ddeul')?' tier-rainbow':'')+'">'+m.name+sub+'</b><span class="qty">보유 '+q.toLocaleString()+(q>=MAX_CONSUM?maxChip():'')+'</span>'+useBtn+'</div>'; }).join('');
        h+='<div class="note" style="margin-top:12px;">사료·물·고급사료·정수물은 홈에서 <b>밥·물 그릇을 탭</b>(또는 수확)해 써요. <b>츄르</b>는 펫을 골라 애정을, <b>영양제</b>는 3시간 수익 부스트에 써요. 펫알·랜덤박스·무지개는 <b>가챠샵</b>에서 열어요.</div></div>';
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
      return out; })();
    const DYE_MAP={}; DYE_CATALOG.forEach(function(d){ DYE_MAP[d.id]=d; });
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
    // 🎨 염색약: 펫 그리드에서 탭 → DYE_CATALOG 45색 중 랜덤(현재 색 제외) 배정, 시트 유지로 결과 확인.
    function useDye(){ openPetUseSheet('dye'); }
    function applyDye(id){
      if(!id||!ownsCat(id)){ toast('펫을 찾을 수 없어요', true); return; }
      if(consumQty('dye')<=0){ toast('염색약이 없어요', true); return; }
      const cur=petDyeOf(id), pool=DYE_CATALOG.filter(d=>d.id!==cur);
      const pick=pool[Math.floor(Math.random()*pool.length)];   // 랜덤 색(현재 색 제외 — 같은 결과 방지)
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.consum.dye)||0)<1) return;
        const c=g.owned.cats[id]; if(!c) return;
        g.consum.dye-=1; c.dye=pick.id; return g;
      }).then(r=>{ if(r&&r.committed){ toast('🎨 '+catName(id)+' → '+pick.name+' 염색!'); if(state._sheetRefresh) state._sheetRefresh(); if($('petInfo')) openPetInfo(id); } });
    }
    // 🧴 염색 리무버: 염색된 펫만 그리드에 표시 → 1개 소모해 원래 톤 복원(무료 지우기 없음 — 이벤트·쿠폰·선물 지급 전용, 사용자 지침).
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
          if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(res.id)<0) R.active.push(res.id); } }
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
        if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(res.id)<0) R.active.push(res.id); } }
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
        const req=(typeof CLIP_AFF_REQ!=='undefined')&&CLIP_AFF_REQ[k], gated=has&&req&&((CAT_TIER[id]||'normal')==='limited'||(CAT_TIER[id]||'normal')==='exclusive');   // 💗 신화+ 애정 해금 표기(재생은 우회)
        h+='<button class="chip'+(k===clip?' on':'')+'"'+(has?'':' disabled')+' style="'+(has?'':'opacity:.4;')+'"'+(has?(' onclick="devPickMotion(\''+k+'\')"'):'')+'>'+k+(has?' ·'+clips[k]:'')+(gated?' <span style="opacity:.7">(Lv'+req+' 해금)</span>':'')+'</button>'; });
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
                "    if(a.hat){ var hw2=w*0.30*(a.hat.width/a.hat.height), hh3=w*0.30; ctx.drawImage(a.hat, w/2-hw2/2, y+h*(a.headF||0.2)-hh3*0.82, hw2, hh3); }",   // 💗 모자 — dock .cd-hat(top:--hp, -82%) 전사(펫 transform 안이라 flip·깊이 동행)
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
    function _csprStill(s, a, face){ _csprUnfreeze(s.querySelector('.csprf')); s.style.setProperty('--idle','url('+sprStill(a.id,face)+')'); s.classList.remove('once'); s.classList.add('idle'); a._clip=null; }
    function actorShowMoving(a){ if(!a.spr) return; const s=a.el.querySelector('.cspr'); if(!s) return;
      a._clip=null; s.classList.remove('once');
      _csprUnfreeze(s.querySelector('.csprf'));   // once 홀드 프리즈 해제 — 안 하면 인라인 animation:none이 걷기 필름을 막아 정지 이미지로 미끄러진다
      if(a.frontWalk){ s.style.setProperty('--idle','url('+sprStill(a.id,'east')+')'); s.classList.add('idle'); return; }   // east 걷기 없음 → 옆 정지스틸(정면 금지)
      // 클립 재생이 --sheet/--fw/steps를 바꿨을 수 있어 걷기 시트로 '무조건' 복원(재빌드 DOM 재사용 잔재 포함 — 안 하면 먹기 시트로 걷는 버그)
      const sp=PET_SPRITES[a.id]||{}, cell=parseFloat(s.style.width)||Math.round(a.hh)||48, nf=sp.frames||6;
      s.style.setProperty('--sheet','url('+sprWalkUrl(sp)+')'); s.style.setProperty('--fw',(cell*nf)+'px');
      const f=s.querySelector('.csprf'); if(f) f.style.animationTimingFunction='steps('+nf+')';
      s.classList.remove('idle'); }   // .idle 제거 → CSS 걷기 필름(csprFilm) 재생
    function actorShowStill(a, face, clip){ if(!a.spr) return; const s=a.el.querySelector('.cspr'); if(!s) return;
      // 🎞️ 클립 승급 — 지정 클립(가구 eat/drink/sit/belly 등) 또는 정면 휴식이면 idle 클립.
      // 클립 시트는 south 전용 정책이라 정면이 아닌 경우(잠=north·인사/스크래처=east/west)는 기존 방향 스틸 유지.
      // 모션축소·가벼운 모드(body.lite)는 항상 스틸 — 쉬는 펫이 늘 필름을 돌리면 lite의 절전 취지가 깨짐(걷기 필름은 기능 모션이라 유지).
      if(!reducedMotion() && !liteMode()){ const want = clip || (face==='south' ? 'idle' : null);
        const r = want ? resolveClip(a.id, want) : null;
        if(r && r.key!=='walk'){ _csprClip(s, a, r); return; } }
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
        if(spr && el.querySelector('.cd-hat, .cd-buddy')) measureHeadPad(id, function(f){ el.style.setProperty('--hp',(f*100).toFixed(1)+'%'); });   // 💗 코스메틱 머리 앵커(실측 상단 여백 %)
        el._eggActor=a;   // 원샷 클립(actorOnce)의 지연 복귀가 재빌드된 새 액터를 덮어쓰지 않도록 현재 소유 액터를 표시
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
      return '<div class="pickbanner pk-rbn" role="button" tabindex="0" onclick="goRainbowShop()" aria-label="무지개알 뽑으러 가기">'+
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
        if(!isShop){ h+='<div class="catseg">'+[['home','홈'],['pet','펫'],['place','배치']].map(function(t){ return '<button class="'+(_catTab===t[0]?'on':'')+'" onclick="setCatTab(\''+t[0]+'\')">'+t[1]+'</button>'; }).join('')+'</div>'; }
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
    let _petSort=lsGet('petSort','recent'), _homeSpecies=lsGet('homeSpecies','all'), _petTier=lsGet('petTier','all'), _petSearch='';   // 홈/펫 탭: 정렬 + 종류 탭 + 등급 필터 + 이름 검색(세션)
    const PET_SORTS=[['recent','최신순'],['aff','애정도순'],['tier','등급순'],['name','이름순']];
    function setPetSort(v){ _petSort=v||'recent'; lsSet('petSort',_petSort); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    function setHomeSpecies(s){ _homeSpecies=s||'all'; lsSet('homeSpecies',_homeSpecies); if(state._sheetRefresh) state._sheetRefresh(); else renderCatHouse(); }
    function setPetSearch(v){ _petSearch=(v||'').trim(); renderPetGrid(); }   // 그리드만 갱신 → 검색 입력 포커스 유지(시트 통째 재렌더 안 함)
    function setPetTier(v){ _petTier=v||'all'; lsSet('petTier',_petTier); renderPetGrid(); }
    function toggleCatFav(id){ if(!ownsCat(id)) return; gameRef().transaction(function(g){ g=normalizeGame(g); const c=g.owned.cats[id]; if(!c) return; c.fav=!c.fav; return g; }).then(function(r){ if(r&&r.committed){ if(state._sheetRefresh) state._sheetRefresh(); } }); }   // 즐겨찾기 → 상단 고정(정렬 fav-first). owned.cats[id].fav (normalizeGame이 값 보존)
    // 보유 펫 정렬 — recent(최신 획득=boughtAt)·aff(애정도)·tier(등급, 상위 먼저).
    function sortOwnedPets(ids){ const l=ids.slice();
      const fav=id=>((ownedCatsMap()[id]||{}).fav?1:0), rank=id=>tierRank(CAT_TIER[id]||'normal'), aff=id=>Number((ownedCatsMap()[id]||{}).affection)||0, bat=id=>((ownedCatsMap()[id]||{}).boughtAt)||'', nm=id=>catName(id)||'';
      if(_petSort==='tier') l.sort((a,b)=> fav(b)-fav(a) || rank(b)-rank(a) || bat(b).localeCompare(bat(a)));
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
      let h=(tabs.length>2)?('<div class="subseg pettabs">'+tabs.map(t=>'<button class="'+(_homeSpecies===t[0]?'on':'')+'" onclick="setHomeSpecies(\''+t[0]+'\')">'+escapeHtml(t[1])+' <b>'+t[2]+'</b></button>').join('')+'</div>'):'';
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
      return '<div class="catchip'+(here?' on':(roomOf>=0?' elsewhere':''))+'" data-id="'+id+'" data-tsig="'+escapeHtml(petTileSig(id))+'" data-name="'+escapeHtml(catName(id))+'" role="button" tabindex="0" aria-pressed="'+here+'" onclick="petTileTap(\''+id+'\')" title="'+escapeHtml(catName(id))+' · '+escapeHtml(tierInfo(tier).name)+' · '+escapeHtml(stt)+' · Lv.'+lv+'">'+
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
        const flt=(_petSearch||_petTier!=='all'); el.innerHTML='<div class="empty pgempty">'+(flt?'검색·필터 결과가 없어요 🔍':'이 종류의 펫이 없어요 🐾 <button class="btn ghost" onclick="setCatTab(\'shop\')">알뜰샵</button>')+'</div>'; return; }
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
      const props=spH.floor+wallPlacedList().map(p=>wallPropMarkup(p,false,true)).join('')+spH.other+dropsHtml(room(), curRoomId());   // 바닥 아이템 → 벽 가구(뒤) + 일반 가구 + 🎁드랍. live=true → 홈 LIVE 캠 연출
      const roomName=(room().name)||'우리집';
      let h='<div class="catroom" id="catRoom">'+roomShellBase(currentWall(), currentFloor())+'<span class="cr-cam"><i></i>LIVE · '+escapeHtml(roomName)+'</span>'+batchBtnHtml()+'<div class="cr-props">'+props+'</div><div class="cr-stage" id="crStage"></div>'+roomOverlay(currentBgfx())+'</div>';
      // 빈 방(가구·펫 없음) 안내 — 방 확장 직후 '사라진 것처럼' 보이는 혼동 방지
      if(!list.length && !cats.length) h+='<div class="hintline" style="margin:8px 0 0;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>새 방이에요! <b>펫</b> 탭에서 <b>펫을 이 방으로 데려오고</b>, <b>배치</b> 탭에서 가구를 놓아보세요. (다른 방과 따로 저장돼요)</div>';
      // 안내: 그릇 채우기 / 똥 수거 — 완전 빈 새 방(가구·펫 없음)에선 위 '새 방' 안내만 두고 생략(힌트 3장 적층 방지, 채울 그릇도 없음)
      const poops=room().poops||0;
      if(list.length || cats.length) h+='<div class="hintline" style="margin:8px 0 0;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>밥·물 그릇을 탭해 채우고(3시간 뒤 비워짐), 쌓인 <b>똥을 탭해 치우면 +'+POOP_REWARD+' 은화</b>'+(poops&&!litters.length?' · 화장실을 놓아야 똥을 치울 수 있어요':'')+'.</div>';
      const owned=ownedCatList();
      const sc=slotCount();
      h+='<div class="sech"><span class="l">이 방 펫</span><span class="s">'+cats.length+' / '+sc+' 활성</span></div>';
      // 활성 슬롯 표시: 채워진 슬롯 + (미확장 시) 오른쪽에 잠금 슬롯 — 탭하면 금화 SLOT_PRICE로 확장
      let slotRow='<div class="slotrow">';
      for(let i=0;i<sc;i++){ const cid=cats[i]; slotRow+='<div class="slot'+(cid?' filled':'')+'">'+(cid?catFace(cid,{h:38}):'')+'</div>'; }
      if(sc<MAX_SLOTS) slotRow+='<button class="slot locked" onclick="buySlot()" aria-label="고양이 슬롯 확장(금화 '+SLOT_PRICE+')"><svg class="lockic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg><span class="slotgold">'+goldSvg({h:13})+SLOT_PRICE+'</span></button>';
      slotRow+='</div>';
      h+=slotRow;
      // 펫 컬렉션 관리(수백 마리 그리드)는 '펫' 탭으로 분리 — 홈은 이 방의 활성 펫·돌봄만(홈 과부하 해소).
      if(!owned.length) h+='<div class="empty" style="padding:16px 20px;">아직 펫이 없어요. 알뜰샵에서 입양해 보세요 🐾 <button class="btn ghost" onclick="setCatTab(\'shop\')">알뜰샵</button></div>';
      else h+='<div class="hintline" style="margin-top:8px;align-items:center;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg><span style="flex:1"><b>펫</b> 탭에서 <b>배치모드</b>를 켜고 탭하면 이 방으로 데려와요.'+(sc<MAX_SLOTS?' 잠금 슬롯은 금화 '+SLOT_PRICE+'로 확장.':'')+'</span><button class="btn ghost" style="flex:none" onclick="setCatTab(\'pet\')">펫 관리 →</button></div>';
      return h;
    }
    // 🐾 '펫' 탭 — 우리집 펫 컬렉션 관리(홈에서 분리). 종류 탭+정렬+수백 마리 그리드. 탭=이 방으로 데려오기/대기.
    function catPetHtml(){
      const owned=ownedCatList(), sc=slotCount();
      if(!owned.length) return '<div class="empty" style="padding:20px;">아직 펫이 없어요. 알뜰샵에서 입양해 보세요 🐾 <button class="btn ghost" onclick="setCatTab(\'shop\')">알뜰샵</button></div>';
      let h='<div class="sech"><span class="l">우리집 펫</span><span class="s">'+owned.length+'마리</span>'+
        '<span class="pmode" role="switch" aria-checked="'+(_petPlaceMode?'true':'false')+'" onclick="togglePetPlaceMode()" title="배치모드 — ON이면 탭해서 방에 배치, OFF면 탭해서 펫 정보">'+
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
      const act=(coins()>=GACHA_PRICE)?'<button class="buy" aria-label="'+nm+' 구매('+GACHA_PRICE+' 은화)" onclick="openGacha(\''+k+'\')">구매</button>':'<button class="buy dis" disabled>'+(GACHA_PRICE-coins())+' 부족</button>';
      return '<div class="shopcard"><div class="thumb">'+art+'</div>'+
        '<div class="meta"><b>'+nm+'</b><div class="desc">'+desc+'</div>'+
        '<span class="price"><span class="ci">'+coinSvg({h:16})+'</span>'+GACHA_PRICE+'</span></div>'+
        '<div class="act">'+act+pityChip(k)+'</div></div>';
    }
    // 가챠 서브탭별 콘텐츠. (배너 고도화는 탭별로 이 함수 안에서 확장)
    function gachaTabHtml(tab){
      let h='';   // (⚡ 빠른 연출 칩은 사용자 지침으로 배너 위에서 제거 — fxFastOn 로직은 잔존, 추후 설정에서 재노출 가능)
      if(tab==='ddeul'){
        h+=ddeulBannerHtml(true);   // 🌱 실제 뜰알 배너(재화 소모·펫 지급 실전 연결) — 쇼케이스+씬+아이템+1뽑/10뽑+확률
      } else if(tab==='normal'){   // 🥚📦 일반 = 펫알/랜덤박스 서브탭(각 실제 배너)
        if(_normalSub!=='egg'&&_normalSub!=='box') _normalSub='egg';
        h+='<div class="subseg normalsub">'+[['egg','펫알'],['box','랜덤박스']].map(function(t){ return '<button class="'+(_normalSub===t[0]?'on':'')+'" onclick="setNormalSub(\''+t[0]+'\')">'+t[1]+'</button>'; }).join('')+'</div>';
        h+=(_normalSub==='egg'?eggBannerHtml(true):boxBannerHtml(true));   // 펫알=노을 배너(펫 지급)·랜덤박스=랜덤박스 배너(가구/바닥/벽지 지급)
      } else if(tab==='rainbow'){   // 🌈 무지개 = 알/박스 서브탭(각 라이브 밤 배너 — 개발자 밤 배너 기반, 펫 2마리 제외) + 무지개동전 잔액
        if(_rbSub!=='egg'&&_rbSub!=='box') _rbSub='egg';
        h+='<div class="subseg normalsub">'+[['egg','무지개알'],['box','무지개박스']].map(function(t){ return '<button class="'+(_rbSub===t[0]?'on':'')+'" onclick="setRbSub(\''+t[0]+'\')">'+t[1]+'</button>'; }).join('')+'</div>';
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
    function gbActionsHtml(kind){ return '<div class="gb-actions"><button class="gb-btn" onclick="devBannerPull(\''+kind+'\',false)">1회 뽑기</button><button class="gb-btn gb-btn10" onclick="devBannerPull(\''+kind+'\',true)">10회 연속</button></div>'; }
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
      const pets=LIMITED_PICKUP.filter(pickupExists);
      const spot=(id)=> id ? '<div class="gb-spot" role="button" tabindex="0" aria-label="'+escapeHtml(catName(id))+' 미리보기" onclick="openPickupPeek(\''+id+'\')">'+
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
        '<button class="gib ghost" onclick="closePickupPeek()">닫기</button></div>';
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
          '<div class="gb-item-desc">한정 펫은 <b class="tier-rainbow">오직 뜰알에서만</b> · 한정 '+ddeulExPct()+'% 픽업!</div>'+
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
      if(isRb){ if(rbcoins()<RAINBOW_PRICE_RBC*N){ toast('무지개동전 '+(RAINBOW_PRICE_RBC*N-rbcoins())+'개 부족 — 한정 중복 획득으로 모아요', true); return; } }
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
          const rbcIt=(dupIt&&res.tier==='exclusive')?1:0;   // 🌈 한정 중복=무지개동전 표기(실지급은 grantBoxReward)
          list.push({ id:res.id, tier:res.tier, type:res.type, kind:'box', rainbow:(Math.random()<rbUpgradeChance(res.tier)), dup:dupIt, refund:(dupIt&&!rbcIt)?dupRefundOf(res.tier):0, rbc:rbcIt, isNew:!owned });
          pity=pityNext(pity, isRb?(res.tier==='exclusive'):isTopTier(res.tier));   // 무지개=한정만 리셋
        } else {
          let res = forced ? pickTierMember(map, forced) : (ddeulTiers?rollFromPool(map, ddeulTiers):rollFromPool(map));
          if(!res) res={ id:(Object.keys(map)[0]||'cat_mackerel'), tier:'normal' };
          const owned=ownsCat(res.id)||!!seenCat[res.id]; seenCat[res.id]=true;
          // 💗 중복 펫=애정 경험치(만렙만 은화 폴백·한정=🌈코인) — 표기 미러. 배치 내 같은 펫 반복은 affAcc로 누적해 트랜잭션 지급 순서와 판정 일치.
          let rfd=0, dupAff=0, rbcP=0, lvUp=false;
          if(owned){ const tr=CAT_TIER[res.id]||'normal', base=(Number((ownedCatsMap()[res.id]||{}).affection)||0)+(affAcc[res.id]||0);
            if(tr==='exclusive') rbcP=1;   // 🌈 한정 중복 = 무지개동전 1(은화 폴백 없음)
            if(affectionLevel(base, tr).level>=5){ if(tr!=='exclusive') rfd=petDupRefund(res.id); }
            else { dupAff=dupAffOf(tr); lvUp=affectionLevel(base+dupAff, tr).level>affectionLevel(base, tr).level; affAcc[res.id]=(affAcc[res.id]||0)+dupAff; } }   // 이번 중복으로 레벨 상승 여부(카드 표기)
          list.push({ id:res.id, tier:res.tier, kind:rollKind, rainbow:(rollKind==='egg' && Math.random()<rbUpgradeChance(res.tier)), dup:owned, refund:rfd, dupAff:dupAff, lvUp:lvUp, rbc:rbcP, isNew:!owned });
          pity=pityNext(pity, isRb?(res.tier==='exclusive'):isTopTier(res.tier));   // 무지개=한정만 리셋
        }
      }
      _pullBusy=true;   // 🔒 트랜잭션 동안 중복탭 방지(10연차 FX가 뜨면 화면을 덮음 → 커밋 후 해제)
      gameRef().transaction(function(g){ g=normalizeGame(g);
        if(isRb){ if((Number(g.rbcoin)||0)<RAINBOW_PRICE_RBC*N) return; g.rbcoin-=RAINBOW_PRICE_RBC*N; }   // 🌈 무지개 10연=코인 50
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
          else if(!g.owned.cats[it.id]){ g.owned.cats[it.id]={boughtAt:new Date().toISOString()}; const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(it.id)<0) R.active.push(it.id); }
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
        h+='<div class="subseg">'+BANNER_TABS.map(t=>'<button class="'+(_bannerTab===t[0]?'on':'')+'" onclick="setBannerTab(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div>';
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
      return '<div class="subseg">'+SHOP_SUBS.map(function(t){ return '<button class="'+(_shopSub===t[0]?'on':'')+'" onclick="setShopSub(\''+t[0]+'\')">'+t[1]+'</button>'; }).join('')+'</div>';
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
          +'<div class="hpref-row"><span class="hpref-l">사료</span><div class="subseg hpref-seg"><button class="'+(pf==='food'?'on':'')+'" onclick="setHarvestPref(\'food\',\'food\')">기본 사료</button><button class="'+(pf==='food_plus'?'on':'')+'" onclick="setHarvestPref(\'food\',\'food_plus\')">고급사료</button></div></div>'
          +'<div class="hpref-row"><span class="hpref-l">물</span><div class="subseg hpref-seg"><button class="'+(pw==='water'?'on':'')+'" onclick="setHarvestPref(\'water\',\'water\')">기본 물</button><button class="'+(pw==='water_plus'?'on':'')+'" onclick="setHarvestPref(\'water\',\'water_plus\')">정수물</button></div></div>'
          +'<div class="note" style="margin:6px 0 0;">선택한 사료·물이 떨어지면 자동으로 기본 사료·물로 채워요.</div></div>';
        h+=CONSUM_CATALOG.map(c=>{
          const gcur=(c.cur==='gold'), have=gcur?gold():coins();
          const bd=(state.game&&state.game.buyDay)||{}, boughtToday=(c.dailyBuy&&bd.day===kstDayKey()&&bd.n)?(Number(bd.n[c.id])||0):0, capHit=(c.dailyBuy&&boughtToday>=c.dailyBuy);
          const free=(c.price<=0), enough=(free||have>=c.price) && !capHit;
          const curIcon=gcur?goldSvg({h:16}):coinSvg({h:16});
          const act=enough?'<button class="buy" aria-label="'+c.name+(free?' 받기':' 구매('+c.price+(gcur?' 금화':' 은화')+')')+'" onclick="buyConsum(\''+c.id+'\')">'+(free?'받기':'구매')+'</button>'
                          :(capHit?'<button class="buy dis" disabled>오늘 완료</button>':'<button class="buy dis" disabled>부족</button>');
          const tag=(c.effect&&c.effect.affection)?'애정':((c.effect&&c.effect.boost)?'부스트':((c.effect&&c.effect.fill)?'채움':'소비'));
          const priceHtml=free?'<span class="price"><b>무료</b></span>':'<span class="price"><span class="ci">'+curIcon+'</span>'+c.price+'</span>';
          return '<div class="shopcard"><div class="thumb"><span class="furnfit">'+consumSvg(c.id,{fit:true})+'</span></div>'+
            '<div class="meta"><b>'+c.name+' <span class="tagmini">'+tag+'</span></b><div class="desc">'+c.desc+'</div>'+
            priceHtml+'</div>'+
            '<div class="act">'+act+'<span class="qty">보유 '+consumQty(c.id).toLocaleString()+(consumQty(c.id)>=MAX_CONSUM?maxChip():'')+(c.dailyBuy?' · 오늘 '+boughtToday+'/'+c.dailyBuy:'')+'</span></div></div>';
        }).join('');
        h+='<div class="note"><b>소비 아이템</b>은 배치할 수 없어요. <b>사료·물·고급사료·정수물</b>은 홈에서 밥·물 그릇을 탭(또는 수확)해 채우고, <b>츄르</b>는 가방에서 펫을 골라 애정을, <b>영양제</b>는 가방에서 3시간 수익 부스트에 써요.</div>';
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
          (PSHOP_TABS.length>2?'<div class="subseg shopfurncat">'+PSHOP_TABS.map(t=>'<button class="'+(_shopPetSpecies===t[0]?'on':'')+'" onclick="setShopPetSpecies(\''+t[0]+'\')">'+escapeHtml(t[1])+'</button>').join('')+'</div>':'<span style="flex:1"></span>')+
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
      }   // /SHOP_LEGACY_BUYTABS
      return h;
    }
    // ---- 가구 인벤토리/배치 ----
    function itemQty(id){ const it=state.game&&state.game.owned.items[id]; return it?(Number(it.qty)||0):0; }
    function placedList(){ const p=room().placed||{}; return Object.keys(p).map(k=>({key:k, r:+k.split('_')[0], c:+k.split('_')[1], itemId:p[k].itemId, filledAt:p[k].filledAt||null, fillMs:p[k].fillMs||null, flip:!!p[k].flip})); }   // filledAt=먹기/마시기 클립 판정(furnClip), fillMs=그릇 채움 지속(고급사료·정수물 6h) 보존용
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
    // 소비템의 채움 지속시간(ms) — 고급사료·정수물=6h, 기본=3h(FILL_MS)
    function consumFillMs(id){ const c=CONSUM_CATALOG.find(x=>x.id===id); return (c&&c.effect&&c.effect.ms)||FILL_MS; }
    // 배치된 그릇의 채움 지속(그 그릇을 채운 소비템 기준으로 저장된 fillMs, 없으면 3h)
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
    // 채워진 지 3시간 지난 그릇을 비우고, 비운 개수만큼 똥을 쌓는다(멱등: filledAt 지우면 재발동 안 함)
    let _lastRecon=0;
    function reconcilePets(){
      const g=state.game; if(!g||!g.home) return;
      const now=Date.now();   // 모든 방의 그릇을 점검(안 보는 방도 3h 뒤 비워지며 그 방 똥 누적)
      if(now-_lastRecon<3000) return; _lastRecon=now;   // 렌더 경로에서 매 렌더 호출돼도 3초 스로틀(3시간 만료 기준이라 지장 없음, 중복 트랜잭션 방지)
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
    // 🎁 드랍 스폰 롤 — 10분(DROP_ROLL_MS)마다 HARVEST_ROLL/6 확률로 대상 방(1곳) 바닥에 드랍(펫알·랜덤박스·뜰알·금화)을 놓는다.
    //   시계 g.dropRollAt은 소비한 롤만큼만 전진: 대상 방이 만석이면 롤을 멈추고 시간을 보존(당첨 기회 유실 없음, 24h 캡이 소급 제한).
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
        for(let i=0;i<n;i++){
          const R=dropTargetRoom(gg);
          if(!R||(R.drops||[]).length>=DROP_MAX_ROOM) break;   // 대상 방 만석/펫 없음 → 시간 보존(자리 나면 다음 reconcile이 이어서 롤)
          used++;
          Object.keys(HARVEST_ROLL).forEach(k=>{ if(Math.random()>=HARVEST_ROLL[k]/DROP_ROLL_DIV) return;
            if((R.drops||[]).length>=DROP_MAX_ROOM) return;   // 같은 롤 안에서 찼을 수 있음
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
    // 🎁 드랍 적립(트랜잭션 내부 전용) — 실제 적립량 반환(금화/소비템 상한 캡 절단 감지). 클릭 수집·수확 일괄이 공용.
    function creditDropKind(g, kind){
      if(kind==='gold'){ const b=g.gold||0; g.gold=clampGold(b+1); return g.gold-b; }
      const b=Number(g.consum[kind])||0, q=clampConsum(b+1); g.consum[kind]=q; return q-b;
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
    //   랜덤박스 드랍은 수령 순간 실제 박스 확률(rollBoxReward)로 즉석 개봉해 아이템으로 지급(사용자 확정 — 알 종류는 봉인 그대로).
    //   박스 결과는 트랜잭션 밖에서 미리 롤(재시도에도 동일 결과 유지) — pity·부산물 금화는 뽑기가 아니라 미적용.
    function collectDrop(ev, rid, dropId){
      if(ev){ ev.stopPropagation(); }
      const fromPip=!!(ev&&ev.view&&ev.view!==window);   // PiP 창 클릭 — 메인 문서 좌표계가 아니라 위치 연출 생략(토스트만)
      const x=ev?ev.clientX:innerWidth/2, y=ev?ev.clientY:innerHeight/2;
      const lr=state.game?gRoomById(state.game, rid):null, ld=lr?(lr.drops||[]).find(d=>d&&d.id===dropId):null;
      const boxRes=(ld&&ld.kind==='box')?rollBoxReward():null;   // 로컬 상태로 kind 판별(드랍 id의 kind는 불변)
      const before=coins(), beforeGold=gold(); let got=null;
      gameRef().transaction(g=>{ g=normalizeGame(g); got=null;   // 재시도마다 리셋 → 커밋된 실행값만 남음
        const R=gRoomById(g, rid); if(!R) return;
        const i=(R.drops||[]).findIndex(d=>d&&d.id===dropId); if(i<0) return;   // 이미 수집됨(다른 기기/중복 탭) → abort
        const d=R.drops[i]; R.drops.splice(i,1);
        if(d.kind==='box' && boxRes){ const gr=grantBoxReward(g, boxRes); if(gr.rf) g.coins=clampCoins((g.coins||0)+gr.rf);
          got={ kind:'box', res:boxRes, rf:gr.rf, rbc:gr.rbc, n:1 }; return g; }
        got={ kind:d.kind, n:creditDropKind(g, d.kind) }; return g;
      }).then(r=>{ if(!(r&&r.committed&&got)) return;
        if(got.kind==='box' && got.res){
          const msg='📦 랜덤박스 → '+rewardName(got.res)+(got.rbc?' (중복 · 🌈무지개동전 +'+got.rbc+')':(got.rf?' (중복 · 은화 +'+got.rf+' 환급)':''));
          toast(msg); if(!fromPip) boxRewardFx(x, y, [got.res]);
          if(state._sheetRefresh && $('sheet') && $('sheet').classList.contains('on')) state._sheetRefresh();   // 배치 인벤토리 등 즉시 반영
          return; }
        const label={egg:'🥚 펫알 +1', ddeul:'🌱 뜰알 +1', gold:'🥇 금화 +1'}[got.kind]||'';
        if(got.n<=0){ toast('보관 한도가 가득해요', true); return; }   // MAX_CONSUM/MAX_GOLD 캡 절단
        if(fromPip){ toast(label); return; }
        if(got.kind==='gold'){ rewardFly(x,y,0,1,before,beforeGold); }
        else { const d={}; d[got.kind]=1; harvestDropFx(x,y,d); toast(label); }
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
    // 🎁 수확 드롭 원샷 연출 — 주운 펫알/랜덤박스/뜰알 픽셀 아이콘이 살짝 떠오르며 트윙클(도트·원샷). 뜰알은 별 버스트 추가(가장 화려). 모션축소면 생략.
    function harvestDropFx(x, y, d){ if(!d) return;
      try{ if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; }catch(e){}
      const items=[]; for(let i=0;i<(Number(d.egg)||0);i++) items.push('egg'); for(let i=0;i<(Number(d.box)||0);i++) items.push('box'); for(let i=0;i<(Number(d.ddeul)||0);i++) items.push('ddeul');
      if(!items.length) return;
      const cx=(x||innerWidth/2), cy=(y||innerHeight/2), show=items.slice(0,6);   // 최대 6개만 표시(도배 방지)
      show.forEach((k,i)=>{
        const el=document.createElement('div'); el.className='dropfx'+(k==='ddeul'?' dropfx-ddeul':'');
        const art = k==='egg'?eggSvg(0,{h:26}) : (k==='box'?boxSvg({h:26}) : ddeulEggSvg({h:28}));
        const spark = (typeof sparkSvg==='function')?('<span class="dropfx-tw">'+sparkSvg({h:14})+'</span>'):'';
        el.innerHTML=art+spark;
        const off=(i-(show.length-1)/2)*28;
        el.style.left=(cx+off)+'px'; el.style.top=cy+'px'; el.style.animationDelay=(i*70)+'ms';
        document.body.appendChild(el); setTimeout(()=>el.remove(), 1350+i*70);
        if(k==='ddeul' && typeof starBurst==='function') starBurst(cx+off, cy);   // 뜰알(한정 픽업)은 별 버스트 추가
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
    // 🌾 수확: 모든 방을 한 번에 — 유휴 가구수익 + 빈 밥/물그릇 채움 + 똥 치움(현재 방 먼저 채워 소모품 부족 시 보이는 방 우선).
    function batchCare(btnEl){
      if(!state.game){ return; }
      const before=coins(), beforeGold=gold(); let filledN=0, shortFood=false, shortWater=false, goldBonus=0, dropEgg=0, dropBox=0, dropDdeul=0, boxRewards=[], boxRefund=0, boxRbc=0;
      gameRef().transaction(g=>{ g=normalizeGame(g); const now=Date.now(); const rooms=g.home.rooms||[], cur=g.home.current|0;
        filledN=0; shortFood=false; shortWater=false; goldBonus=0; dropEgg=0; dropBox=0; dropDdeul=0; boxRewards=[]; boxRefund=0; boxRbc=0;   // 재실행(Firebase 재시도)마다 리셋 → 커밋된 마지막 실행값이 남음
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
        //   랜덤박스 드랍은 여기서 실제 박스 확률(rollBoxReward)로 즉석 개봉해 아이템 지급(사용자 확정 — 어떤 템인지 결과에 표시).
        //   Math.random이 재시도마다 달라도 boxRewards가 함께 리셋되므로 커밋된 실행 결과만 남음(pity·부산물 금화는 뽑기가 아니라 미적용).
        { const g0=g.gold||0;
          rooms.forEach(R=>{ if(!R||!(R.drops||[]).length) return;
            R.drops.forEach(d=>{ if(!d) return;
              if(d.kind==='box'){ const res=rollBoxReward();
                if(res){ const gr=grantBoxReward(g, res); if(gr.rf){ g.coins=clampCoins((g.coins||0)+gr.rf); boxRefund+=gr.rf; } boxRbc+=gr.rbc; boxRewards.push(res); return; }
                dropBox+=creditDropKind(g,'box'); return; }   // 풀이 비는 예외 → 봉인 박스로 폴백
              const dn=creditDropKind(g, d.kind);
              if(d.kind==='egg') dropEgg+=dn; else if(d.kind==='ddeul') dropDdeul+=dn; });
            R.drops=[]; });
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
        const dropped=(dropEgg>0||dropBox>0||dropDdeul>0||boxRewards.length>0);
        if(gained>0 || filledN>0 || goldBonus>0 || dropped){ if(gained>0||goldBonus>0){ rewardFly(x,y, gained, goldBonus, before, beforeGold);
            if(typeof yieldFloatFx==='function') yieldFloatFx(x, y-22, gained, goldBonus); }   // 🌾 획득량 "+N" 플로팅 — 캠 상단부 안(지갑은 트랜지언트라 즉시 표기)
          if((dropEgg>0||dropBox>0||dropDdeul>0) && typeof harvestDropFx==='function') harvestDropFx(x, y+16, { egg:dropEgg, box:dropBox, ddeul:dropDdeul });   // 🎁 드롭 원샷 픽셀 연출(플로팅 바로 아래 층)
          if(boxRewards.length && typeof boxRewardFx==='function') boxRewardFx(x, y+52, boxRewards);   // 📦 박스 개봉 결과 — 드롭 아래 층(겹침 방지, rise 애니로 상단부로 떠오름)
          if(goldBonus>0 || dropped || filledN>0 || short){   // 은화만 얻은 평범한 수확은 토스트 생략(플로팅+지갑 카운트업이 대신) — 부가 정보 있을 때만
            const boxMsg=boxRewards.length?(' · 📦 '+boxRewards.slice(0,3).map(rewardName).join(', ')+(boxRewards.length>3?' 외 '+(boxRewards.length-3)+'개':'')+(boxRefund>0?' (중복 환급 +'+boxRefund+' 은화)':'')+(boxRbc>0?' (중복 · 🌈무지개동전 +'+boxRbc+')':'')):'';
            const dropMsg=(dropEgg>0?' · 🥚펫알 +'+dropEgg:'')+(dropBox>0?' · 📦랜덤박스 +'+dropBox:'')+(dropDdeul>0?' · 🌱뜰알 +'+dropDdeul:'')+boxMsg;
            let msg='🌾 전체 수확 완료'+(gained>0?' · +'+gained+' 은화 🪙':'')+(goldBonus>0?' · +'+goldBonus+' 금화 🥇':'')+dropMsg+(filledN>0?' · 밥/물 '+filledN+'칸':'')+(short?' · '+short+' 부족(일부 미충전)':'');
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
    // 🌱 뜰알(한정 픽업 뽑기) 전용 확률표 — 기본과 같지만 신화 1→0.5, 한정 0.5 추가(활성 한정 펫=삵·표범만 풀에). 합 100.
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
    const LIMITED_PICKUP = ['cat_leopardcat','cat_leopard'];   // 첫 한정 픽업: 펫1=삵 · 펫2=표범
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
    function cosmRowHtml(id, slot, list, lv){
      const un=lv>=cosmNeedLv(slot), cosm=petCosm(id);
      const art=k=> slot==='hat'?hatSvg(k,{h:14}):buddySvgOf(k,{h:12});
      const anyOwned=Object.keys(list).some(k=>cosmOwns(slot,k));
      return '<div class="pi-cosm'+(un?'':' lock')+'"><span class="s">'+(slot==='hat'?'모자':'펫효과')+' · Lv'+cosmNeedLv(slot)+(un?'':' 슬롯 잠김')+'</span>'+
        '<button class="chip'+(!cosm[slot]?' on':'')+'"'+(un?' onclick="setPetCosm(\''+id+'\',\''+slot+'\',null)"':' disabled')+'>없음</button>'+
        Object.keys(list).map(k=>{ const has=cosmOwns(slot,k);
          return '<button class="chip'+(cosm[slot]===k?' on':'')+(has?'':' none')+'"'+((un&&has)?' onclick="setPetCosm(\''+id+'\',\''+slot+'\',\''+k+'\')"':' disabled')+(has?'':' style="opacity:.45"')+'>'+art(k)+' '+list[k]+(has?'':' (미보유)')+'</button>'; }).join('')+
        ((un&&!anyOwned)?'<span class="s" style="min-width:0">무지개박스·이벤트로 획득(한정)</span>':'')+
      '</div>';
    }
    function petInfoBody(id){
      const c=ownedCatsMap()[id]||{}, tier=CAT_TIER[id]||'normal';
      const aff=Number(c.affection)||0, al=affectionLevel(aff, tier);   // 💗 등급별 애정 계단(높은 등급=임계 큼)
      const roomOf=petRoomIndex(id), here=roomOf===roomIdx(), rooms=homeH().rooms||[];
      const roomNm=roomOf>=0?((rooms[roomOf]&&rooms[roomOf].name)||('방 '+(roomOf+1))):'';
      const roomTxt=here?'이 방':(roomOf>=0?roomNm:'대기 중');
      const now=Date.now(), last=Number(c.pettedAt)||0, rem=PET_COOLDOWN_MS-(now-last), canPet=rem<=0, hh=Math.ceil(Math.max(0,rem)/3600000);
      const got=c.boughtAt?fmtDate(c.boughtAt):'';
      return '<div class="gih pi-h">'+catFace(id,{h:40})+'<b>'+catNameSpan(id,catName(id))+'</b>'+
          '<button class="cn-edit pi-rename" aria-label="이름 짓기" onclick="openRenameCat(\''+id+'\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button></div>'+
        '<div class="pi-meta"><span class="pi-tier">'+tierLabelHtml(tier)+'</span><span class="s">'+escapeHtml(speciesLabel(id))+(got?' · 획득 '+got:'')+' · '+escapeHtml(roomTxt)+'</span></div>'+
        '<div class="pi-aff"><div class="pi-afftop"><span class="clv-h">'+heartSvg({h:11})+'</span>애정 Lv.'+al.level+'<span class="s">'+(al.next!=null?aff+' / '+al.next:'만렙 ★')+'</span></div><div class="bar"><i style="width:'+al.pct+'%"></i></div></div>'+
        (((tier==='limited'||tier==='exclusive')&&PET_SPRITES[id]&&PET_SPRITES[id].clips)?'<div class="pi-cd">모션 해금 — Lv1 기본(유휴·먹기·마시기)'+(al.level>=1?'(해금)':'(잠김)')+' · Lv2 식빵·하품'+(al.level>=2?'(해금)':'(잠김)')+' · Lv4 하악질'+(al.level>=4?'(해금)':'(잠김)')+'</div>':'')+   // 💗 신화+ 애정 모션 해금 안내(Lv1/2/4)
        (hasSprite(id)?cosmRowHtml(id,'buddy',BUDDY_CATALOG,al.level)+cosmRowHtml(id,'hat',HAT_CATALOG,al.level):'')+   // 💗 코스메틱(동행 Lv3·모자 Lv5) — 스프라이트 펫만
        (petDyeOf(id)?'<div class="pi-cosm"><span class="s">염색</span><span class="chip on">'+consumSvg('dye',{h:12})+' '+escapeHtml(dyeNameOf(petDyeOf(id)))+'</span>'+(consumQty('dye_remover')>0?'<button class="chip" onclick="applyDyeRemover(\''+id+'\')">'+consumSvg('dye_remover',{h:12})+' 리무버로 지우기</button>':'<span class="s" style="min-width:0">리무버(이벤트·쿠폰)로 제거 가능</span>')+'</div>':'')+   // 🎨 염색 상태 — 제거는 리무버 소모(무료 지우기 없음)
        // 🧺 소비템 바로 사용(2026-07 사용자 지시) — 가방을 거치지 않고 펫 정보에서 이 펫에게 바로 사용. 보유한 펫 대상 소비템만 노출(적용 후 openPetInfo 재렌더로 결과 즉시 반영).
        ((consumQty('treat')>0||consumQty('dye')>0)?('<div class="pi-cosm"><span class="s">소비템</span>'+
          (consumQty('treat')>0?'<button class="chip" onclick="applyTreat(\''+id+'\')">'+consumSvg('treat',{h:12})+' 츄르 주기 · '+consumQty('treat').toLocaleString()+'</button>':'')+
          (consumQty('dye')>0?'<button class="chip" onclick="applyDye(\''+id+'\')">'+consumSvg('dye',{h:12})+' 염색약(랜덤 '+DYE_CATALOG.length+'색) · '+consumQty('dye').toLocaleString()+'</button>':'')+
        '</div>'):'')+
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
    const ITEM_TIER = { pond:'limited', cushion:'normal', waterbowl:'normal', litterbox:'normal', plant:'normal', bowl:'uncommon', scratcher:'rare', pethouse:'epic', tower:'legend', catwheel:'limited',
      rug:'rare', fishtank:'epic', window:'legend', fireplace:'legend', fan:'legend', hammock:'legend', teaser:'legend', wallclock:'legend', hangplant:'legend', mobile:'legend', chandelier:'limited', jingleball:'legend',
      frame:'legend', shelf:'legend', mirror:'legend', neon:'legend', sconce:'legend', garland:'legend', poster:'legend', tapestry:'legend', cactus:'rare', yarnbasket:'uncommon', floorlamp:'epic', beanbag:'rare', groomstation:'uncommon', springtoy:'epic', tunnel:'rare', teepee:'rare', bookshelf:'rare', birdcage:'epic', lavalamp:'epic', laserpost:'epic', waterfountain:'epic', sofa:'rare', recordplayer:'epic', terrarium:'epic', ballpit:'legend', grandfaclock:'legend', bunkbed:'rare', crystalfountain:'limited', dartboard:'rare', cuckooclock:'epic', roundbed:'rare', donutbed:'rare', cavebed:'epic', canopybed:'legend', throne:'legend', mousetoy:'uncommon', catnippillow:'rare', puzzlefeeder:'rare', balltrack:'epic', teetertoy:'rare', bubblemachine:'epic', bonsai:'rare', globe:'epic', snowglobe:'epic', campfire:'epic', gramophone:'epic', arcademachine:'legend', jukebox:'epic', crystalcluster:'legend', easel:'rare', floorvase:'rare', suitofarmor:'legend', hourglass:'rare', telescope:'epic', gumballmachine:'rare', wallvines:'rare', pennant:'uncommon', wallmask:'rare', barometer:'epic', stringlights:'epic', wallbutterfly:'rare', cornershelf:'rare', wallsun:'epic', treatjar:'uncommon', catgrass:'rare', groomarch:'rare', heatpad:'epic', peekbox:'epic', tetherpole:'epic', windmilltoy:'rare', crinklebag:'rare', roundrug:'rare', runner:'uncommon', koipond:'legend', displaycase:'epic', woodstove:'epic', mushroomlamp:'epic', statuecat:'rare', teacart:'epic', crystaltree:'legend' };   // 러그=희귀·어항=특별·창문 등 장식/벽 가구=전설. 특별↑은 아래 isGachaOnlyItem로 자동 랜덤박스 전용
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
    // 🌈 한정 등급 중복 = 은화 대신 무지개동전 +1(무지개알/박스 5개=1뽑 재화). 트랜잭션 안에서 호출.
    function grantRbcoin(g, n){ n=Math.max(1, Math.floor(Number(n)||1)); g.rbcoin=clampRbcoin((Number(g.rbcoin)||0)+n);
      g.rbcoinTotal=Math.max(0, Math.floor(Number(g.rbcoinTotal)||0))+n; }   // 누적 획득 카운터(획득 이력 최소 추적)
    function grantBoxReward(g, res){ const rb0=Number(g.rbcoin)||0; const rf=_grantBoxRewardRf(g, res); return { rf:(rf||0), rbc:Math.max(0,(Number(g.rbcoin)||0)-rb0) }; }   // {rf:환급 은화(가산은 호출자), rbc:한정 중복 무지개동전} — 표기용 rbc를 함께 반환(2026-07)
    function _grantBoxRewardRf(g, res){   // 지급 + 중복/초과 보상: 한정=무지개동전 +1(은화 반환 0) · 그 외=환급 은화 반환
      const dupPay=()=>{ if(res.tier==='exclusive'){ grantRbcoin(g,1); return 0; } return dupRefundOf(res.tier); };
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
      h+='<div class="row" style="justify-content:space-between;align-items:center;margin:6px 2px 10px;"><span>현재: <b>'+catNameSpan(cur,catName(cur))+'</b> <span class="pill">'+(manual?'수동 선정':'자동(해시)')+'</span></span>'+(manual?'<button class="chip" onclick="clearFeaturedPet()">자동으로 되돌리기</button>':'')+'</div>';
      h+='<div class="dexgrid">'+ids.map(function(id){ const on=id===cur; return '<div class="dexcell" role="button" tabindex="0" onclick="setFeaturedPet(\''+id+'\')" style="cursor:pointer;'+(on?'outline:2px solid var(--primary);outline-offset:1px;border-radius:12px;':'')+'"><div class="dexpic">'+catFace(id,{h:48})+'</div><div class="dexnm">'+catNameSpan(id,catName(id))+(on?' ✓':'')+'</div></div>'; }).join('')+'</div>';
      openSheet('이달의 펫 선정', h); }
    function isFeaturedCat(id){ return !!id && id===featuredCatId(); }
    function catBuyPrice(id){ const c=PET_CATALOG.find(x=>x.id===id); if(!c) return 0; return isFeaturedCat(id)?Math.max(1,Math.round((c.price||0)*(1-FEATURED_DISCOUNT))):(c.price||0); }
    function monthLabelKo(){ const n=parseInt(kstMonthKey().slice(6),10)||0; return n+'월'; }
    // 가챠 구분별 짧은 설명(뜰알/펫알/랜덤박스/무지개) — 해당 탭에 맞는 한 줄.
    function gachaNoteFor(tab){
      if(tab==='ddeul')   return '🌱 <b class="tier-rainbow">한정 펫</b>은 오직 뜰알에서만! 살 때 <b>금화 1개를 소모</b>해요(펫알과 달리 금화 보상 없음 · 중복 펫은 10% 은화 환급, <b>한정 중복은 무지개동전 +1</b>).';
      if(tab==='rainbow') return '✨ <b class="tier-rainbow">무지개</b>는 <b>무지개동전 '+RAINBOW_PRICE_RBC+'개</b>로 1뽑 — <b class="tier-limited">신화 80%</b>·<b class="tier-rainbow">한정 20%</b>, <b>'+RB_PITY_N+'뽑 안에 한정 확정</b>! 무지개동전은 <b>한정 등급 중복</b>을 얻을 때마다 1개씩 쌓여요.';
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
      } else if(tab==='rainbow'){   // 🌈 무지개 — RAINBOW_TIERS(신화80·한정20·5뽑 한정 천장), 무지개동전 5개/뽑(한정 중복 획득마다 +1)
        const rows=RAINBOW_TIERS.map(rt=>{ const ti=tierInfo(rt.id);
          return '<div class="gi-row"><b class="tier-'+rt.id+'">'+ti.name+'</b><span class="gi-p">'+rt.p+'%</span></div>'; }).join('');
        body=sec('🌈 무지개알·무지개박스 · 신화/한정 확정 (무지개동전 '+RAINBOW_PRICE_RBC+'개 — 한정 중복 획득마다 +1)', rows);
      } else {   // egg
        body=eggSec();
      }
      return body;
    }
    // 📊 확률 안내(설정 → 확률 안내) — 모든 뽑기(펫알·랜덤박스·뜰알·무지개)의 등급별 확률을 한 화면에 고지.
    function openProbInfoSheet(){
      const h='<div class="note">모든 뽑기의 등급별 확률입니다. 등급·구성이 바뀌면 자동으로 갱신돼요.</div>'+
        '<div class="card" style="padding:4px 0;"><div class="gi-body">'+gachaInfoHtml('normal')+gachaInfoHtml('ddeul')+gachaInfoHtml('rainbow')+'</div></div>'+
        '<button class="btn" onclick="closeSheet()" style="margin-top:14px;">확인</button>';
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
    //    스킨(벽지·바닥·배경효과) 중복·가구 캡 초과는 애정이 없으므로 기존 dupRefundOf(은화 10%) 그대로(grantBoxReward).
    function grantPetDup(g, id){
      const tier=CAT_TIER[id]||'normal';
      const c=g.owned.cats[id]; if(!c) return { refund:0 };
      if(tier==='exclusive'){   // 🌈 한정 펫 중복 = 무지개동전 +1(은화 폴백 없음). 애정 경험치도 함께(프레스티지 축 유지, 만렙이면 코인만).
        grantRbcoin(g,1);
        if(affectionLevel(c.affection, tier).level>=5) return { rbc:1 };
        return { rbc:1, aff: dupAffOf(tier), gain: applyAffectionGain(g, id, dupAffOf(tier)) };
      }
      if(affectionLevel(c.affection, tier).level>=5){ const rf=petDupRefund(id); g.coins=clampCoins((g.coins||0)+rf); return { refund:rf }; }
      return { aff: dupAffOf(tier), gain: applyAffectionGain(g, id, dupAffOf(tier)) };
    }
    // 💗 중복 펫 리빌 표기용 미러(트랜잭션 밖·현재 로컬 상태 기준 예상치) — 실지급은 grantPetDup이 단일 소스.
    function petDupPreview(id){
      const tier=CAT_TIER[id]||'normal', c=ownedCatsMap()[id]||{};
      const aff=Number(c.affection)||0, al=affectionLevel(aff, tier);
      const rbc=(tier==='exclusive')?1:0;   // 🌈 한정 중복 = 무지개동전 +1
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
        refund=(dup&&res.tier!=='exclusive')?dupRefundOf(res.tier):0;   // 한정 중복=무지개동전(dupRbc 표기)
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
          if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(res.id)<0) R.active.push(res.id); } }
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
        if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(res.id)<0) R.active.push(res.id); } }
        else { grantPetDup(g, res.id); }   // 💗 중복 펫=애정 경험치(만렙만 은화 10% 폴백)
        return g;
      }).then(r=>{ if(r&&r.committed) runGachaFx('ddeul', res, dup, refund, false, isNew, dp); else { closeFx(); toast('처리 중이에요 — 잠시 후 다시 시도해 주세요', true); } })   // C4
        .catch(function(){ closeFx(); });
    }
    // ===== ✨ 무지개알/무지개박스(2026-07 개편): 🌈 무지개동전 5개로 바로 뽑기 — 신화80%·한정20%, 5뽑 안에 한정 확정 =====
    //    무지개동전(game.rbcoin)은 "한정 등급 중복 획득" 시 1개씩 적립(가챠 전 경로). 미공개 한정 펫·아이템 전부 여기서 나온다.
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
      if(rbcoins()<RAINBOW_PRICE_RBC){ toast('무지개동전 '+(RAINBOW_PRICE_RBC-rbcoins())+'개 부족 — 한정 중복 획득으로 모아요', true); return; }
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
        refund=(dup&&res.tier!=='exclusive')?dupRefundOf(res.tier):0; }   // 한정 중복=무지개동전(dupRbc 표기)
      const isNew=gachaNew(kind,res);   // 지급 전 판정(NEW 배지)
      const hit=(res.tier==='exclusive');   // 🌈 무지개 천장 리셋 = 한정 획득(신화는 카운트 지속 — 5뽑 안에 한정 확정)
      pullBegin(kind, true);   // 🔒 잠금 + 즉시 '준비' 오버레이(무지개)
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if((Number(g.rbcoin)||0)<RAINBOW_PRICE_RBC) return;
        g.rbcoin-=RAINBOW_PRICE_RBC; g.pity[rk]=pityNext(g.pity[rk]||0, hit);
        if(kind==='egg'){
          if(!g.owned.cats[res.id]){ g.owned.cats[res.id]={boughtAt:new Date().toISOString()}; { const R=gRoom(g); if(R.active.length<(g.home.slots||BASE_SLOTS) && R.active.indexOf(res.id)<0) R.active.push(res.id); } }
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
    // 벽 가구 캠 렌더 — 가로 앵커는 바닥과 동일(camAnchorMode), 세로는 앵커 종류에 따라(floor/mount/hang), z=0(맨 뒤 벽 평면).
    function wallPropMarkup(p, isDock, live){
      const foot=wallFoot(p.itemId), mode=camAnchorMode(p.c, foot.w), anchor=wallAnchorOf(p.itemId);
      const leftPct = mode==='left'?0 : mode==='right'?100 : (gridLeftFrac(p.c)+gridSpanFrac(foot.w)/2)*100;
      const txPct = mode==='left'?0 : mode==='right'?-100 : -50, x=leftPct.toFixed(2);
      let vpos, fh;
      if(anchor==='floor'){        // 바닥형: 맨 뒤 바닥 가구와 동일한 '바닥선'(3+1*46=49% bottom)에 서므로 크기도 depth1(뒤) 원근으로 — 같은 바닥선의 바닥 가구와 크기 일치(벽난로가 홀로 크게 보이던 문제 해결).
        fh=furnRoomH(p.itemId, isDock, 1); vpos='bottom:'+camFurnBottom(1).toFixed(1)+'%';
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
        (!wall?'<button class="gib" onclick="toggleFlip(\''+key+'\')"><b>좌우 반전</b><span>가구를 좌우로 뒤집어요</span></button>':'')+
        '<button class="gib" onclick="retrievePlaced(\''+key+'\','+wf+')"><b>회수</b><span>인벤토리로 되돌려요(보유 유지)</span></button>'+
        '<button class="gib sell" onclick="sellPlaced(\''+key+'\','+wf+')"><b>판매</b><span>+'+ITEM_SELL+' 은화 · 보유에서 제거</span></button>'+
        '<button class="gib ghost" onclick="closeItemMenu()">닫기</button></div>';
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
        (hasAny?'<button class="pa-btn" onclick="autoArrangeRoom()" aria-label="가구 자동 정리(뒤→앞·크기순)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>자동 정리</button>':'')+
        (canUndo?'<button class="pa-btn" onclick="undoPlace()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>되돌리기'+(undoCount()>1?' <b>'+undoCount()+'</b>':'')+'</button>':'')+
        (hasAny?'<button class="pa-btn danger" onclick="captureUndo();clearRoom(curRoomId(),roomIdx())"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>이 방 비우기</button>':'')+
      '</div>'; }
    function catPlaceHtml(){
      const wallMode=_placeMode==='wall';
      const _fc=Object.keys(room().placed||{}).length, _wc=Object.keys(room().wallPlaced||{}).length;   // 📦 이 방 배치 요약
      const toggle='<div class="subseg placemode">'+
        '<button class="'+(!wallMode?'on':'')+'" onclick="setPlaceMode(\'floor\')">방꾸미기</button>'+
        '<button class="'+(wallMode?'on':'')+'" onclick="setPlaceMode(\'wall\')">벽꾸미기</button></div>'+
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
        const wgrid='<div class="gridwall" id="wallGrid" onclick="wallPlaceClick(event)">'+witems+(witems?'':emptyGridHint())+'<div class="gdrop" id="wgdrop" hidden></div><div class="wsnap" id="wsnap" hidden></div><div class="wsnaph" id="wsnaph" hidden></div></div>';
        if(!WALL_PAL_CATS.some(c=>c[0]===_wallCat)) _wallCat='all';
        const wpal=ITEM_CATALOG.filter(it=>isWallItem(it.id) && itemQty(it.id)>0 && (_wallCat==='all'||wallAnchorOf(it.id)===_wallCat)).map(it=>{ const rem=itemRemaining(it.id), qty=itemQty(it.id), sold=rem<=0, ft=itemTierOf(it.id);
          return '<button class="pitem'+(_selWall===it.id?' on':'')+(sold?' soldout':'')+'"'+(sold?' aria-disabled="true"':'')+' onpointerdown="wallPalDown(event,\''+it.id+'\')" onclick="if(event.detail===0)selWallItem(\''+it.id+'\')"><span class="pic tbring tb-'+ft+'">'+furnSvg(it.id,{h:palPicH(it.id)})+tierBadgeHtml(ft)+'</span><span>'+it.name+'</span><span class="pq">'+(sold?('보유'+qty+' · 전부 배치됨'):('보유'+qty+' · 남은'+rem))+'</span></button>'; }).join('');
        const wallHint='<div class="hintline" style="margin:8px 0 4px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16"/></svg>벽 가구를 <b>탭해 선택</b>하거나 <b>꾹 눌러 격자로 끌어</b> 걸어요(위=천장·아래=바닥선). 걸린 항목은 <b>꾹 눌러 드래그로 이동</b>, 짧게 탭하면 회수/판매. <b>특별↑ 벽 가구는 랜덤박스로만</b> 얻어요.</div>';
        const selBannerW=_selWall?('<div class="selbanner">'+furnSvg(_selWall,{h:22})+'<span><b>'+escapeHtml(catFurnName(_selWall))+'</b> 걸기 — 격자를 <b>탭</b>하세요</span><button class="selx" onclick="selWallItem(\''+_selWall+'\')">취소</button></div>'):'';
        const wcatTabs='<div class="subseg placecat">'+WALL_PAL_CATS.map(c=>{ const n=ITEM_CATALOG.filter(it=>isWallItem(it.id)&&itemQty(it.id)>0&&(c[0]==='all'||wallAnchorOf(it.id)===c[0])).length;
          return '<button class="'+(_wallCat===c[0]?'on':'')+(n?'':' dim')+'"'+(n?'':' aria-disabled="true"')+' onclick="setWallCat(\''+c[0]+'\')">'+c[1]+(n?' <b>'+n+'</b>':'')+'</button>'; }).join('')+'</div>';
        const wpalRow='<div class="palcatrow">'+wcatTabs+'</div>';   // 알뜰샵 바로가기 버튼 제거(사용자 지시 — 배치화면엔 미노출)
        body=selBannerW+wgrid+wallHint+wpalRow+'<div class="palette catinv">'+(wpal||'<div class="palempty">보유한 벽 가구가 없어요<br><span>랜덤박스에서 벽 가구를 모아보세요</span><button class="palcta" onclick="openShop()">알뜰샵 가기</button></div>')+'</div>'+skinPickerHtml('wall');
      } else {
        // 바닥 격자(12×8, 가로×깊이) — 기존 방꾸미기(드래그 이동·롱프레스). 벽 가구는 팔레트에서 제외.
        const placed=room().placed||{};
        const items=Object.keys(placed).map(key=>{ const pr=key.split('_'), r=+pr[0], c=+pr[1], id=placed[key].itemId, foot=itemFoot(id);
          const left=(gridLeftFrac(c)*100).toFixed(3), top=(gridTopFrac(r)*100).toFixed(3), w=(gridSpanFrac(foot.w)*100).toFixed(3), h=(gridRowSpanFrac(foot.h)*100).toFixed(3);
          return '<div class="gitem" style="left:'+left+'%;top:'+top+'%;width:'+w+'%;height:'+h+'%" onpointerdown="giDown(event,\''+key+'\')" onclick="event.stopPropagation()">'+
            '<span class="gsc">'+furnSvg(id,{fit:true})+'</span></div>'; }).join('');
        const grid='<div class="grid12" id="placeGrid" onclick="placeClick(event)">'+items+(items?'':emptyGridHint())+'<div class="gdrop" id="gdrop" hidden></div><div class="wsnap" id="fsnap" hidden></div><div class="wsnaph" id="fsnaph" hidden></div><span class="gaxis gaxis-b">뒤</span><span class="gaxis gaxis-f">앞</span></div>';
        const owned=ITEM_CATALOG.filter(it=>!isWallItem(it.id) && itemQty(it.id)>0);
        if(!_placeCat || !PLACE_CATS.some(c=>c[0]===_placeCat)) _placeCat=(PLACE_CATS.find(c=>owned.some(it=>placeCatOf(it.id)===c[0]))||PLACE_CATS[0])[0];
        const catTabs='<div class="subseg placecat">'+PLACE_CATS.map(c=>{ const inCat=owned.filter(it=>placeCatOf(it.id)===c[0]), nOwn=inCat.length, nAvail=inCat.filter(it=>itemRemaining(it.id)>0).length;
          return '<button class="'+(_placeCat===c[0]?'on':'')+(nOwn?'':' dim')+'"'+(nOwn?'':' aria-disabled="true"')+' onclick="setPlaceCat(\''+c[0]+'\')">'+c[1]+(nAvail?' <b>'+nAvail+'</b>':'')+'</button>'; }).join('')+'</div>';
        const pal=owned.filter(it=>placeCatOf(it.id)===_placeCat).map(it=>{ const foot=itemFoot(it.id), rem=itemRemaining(it.id), qty=itemQty(it.id), sold=rem<=0, ft=itemTierOf(it.id);
          return '<button class="pitem'+(_selItem===it.id?' on':'')+(sold?' soldout':'')+'"'+(sold?' aria-disabled="true"':'')+' onpointerdown="palDown(event,\''+it.id+'\')" onclick="if(event.detail===0)selItem(\''+it.id+'\')"><span class="pic tbring tb-'+ft+'">'+furnSvg(it.id,{h:palPicH(it.id)})+tierBadgeHtml(ft)+'</span><span>'+it.name+'</span><span class="pq">'+(sold?('보유'+qty+' · 전부 배치됨'):(foot.w+'×'+foot.h+' · 보유'+qty+' · 남은'+rem))+'</span></button>'; }).join('');
        const dragHint='<div class="hintline" style="margin:8px 0 4px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11.5V5.5a1.5 1.5 0 0 1 3 0v5"/><path d="M12 10V4.5a1.5 1.5 0 0 1 3 0V10"/><path d="M15 9.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3l-2-3.5a1.5 1.5 0 0 1 2.6-1.5L9 14"/></svg><b>꾹 눌러서</b> 끌면 배치·이동돼요(짧게 탭하면 선택·메뉴). 화면 스크롤과 겹치지 않아요.</div>';
        const palBody=pal||'<div class="palempty">이 분류에 보유한 가구가 없어요<br><span>알뜰샵·랜덤박스에서 가구를 모아보세요</span><button class="palcta" onclick="openShop()">알뜰샵 가기</button></div>';
        const selBanner=_selItem?('<div class="selbanner">'+furnSvg(_selItem,{h:22})+'<span><b>'+escapeHtml(catFurnName(_selItem))+'</b> 배치 중 — 격자를 <b>탭</b>하세요</span><button class="selx" onclick="selItem(\''+_selItem+'\')">취소</button></div>'):'';   // 탭-투-플레이스 선택 상태 가시화
        const palRow='<div class="palcatrow">'+catTabs+'</div>';   // 알뜰샵 바로가기 버튼 제거(사용자 지시 — 배치화면엔 미노출)
        body=selBanner+grid+dragHint+palRow+'<div class="palette catinv">'+palBody+'</div>'+skinPickerHtml('floor')+bgfxPickerHtml();
      }
      return '<div class="editwrap">'+preview+toggle+placeActionsBar()+body+'</div>';
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
        return '<button class="'+(_dexItemCat===id?'on':'')+'" onclick="setDexItemCat(\''+id+'\')">'+t[1]+' <b>'+n+'</b></button>'; }).join('')+'</div>';
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
        const kindTabs='<div class="subseg dexkind"><button class="'+(_dexKind==='pet'?'on':'')+'" onclick="setDexKind(\'pet\')">펫</button><button class="'+(_dexKind==='item'?'on':'')+'" onclick="setDexKind(\'item\')">아이템</button></div>';
        if(_dexKind==='item') return kindTabs+buildItemDex();   // 🗂️ 아이템 도감
        const owned=ownedCatsMap(), species=dexSpeciesList();
        if(_dexTab!=='all' && species.indexOf(_dexTab)<0) _dexTab='all';   // 사라진 종 방어
        const pool=dexCatalog().filter(c=> _dexTab==='all' || (c.species||'cat')===_dexTab);   // 획득 가능한 펫만(휴면 한정펫은 도감에서 숨김 = 미출시)
        const prog=dexProgress(owned, pool.map(c=>c.id));   // 현재 탭 기준 진행도
        let h=kindTabs+'<div class="dexhead"><div class="row" style="justify-content:space-between;"><b>수집'+(_dexTab!=='all'?' · '+escapeHtml(SPECIES_LABEL[_dexTab]||_dexTab):'')+'</b><span class="s">'+prog.owned+' / '+prog.total+' ('+prog.pct+'%)</span></div><div class="bar"><i style="width:'+prog.pct+'%"></i></div></div>';
        // 종별 탭(전체 + 종). 옆으로 스크롤(.subseg).
        const tabs=[['all','전체']].concat(species.map(s=>[s,(SPECIES_LABEL[s]||s)]));
        h+='<div class="subseg dextabs">'+tabs.map(function(t){ const id=t[0], nm=t[1], n=dexCatalog().filter(c=>id==='all'||(c.species||'cat')===id).length;
          return '<button class="'+(_dexTab===id?'on':'')+'" onclick="setDexTab(\''+id+'\')">'+escapeHtml(nm)+' <b>'+n+'</b></button>'; }).join('')+'</div>';
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
      if(gc>0){ h+='<div class="newsalert" role="button" tabindex="0" onclick="openGiftbox()"><span class="nai">'+giftSvg({h:30})+'</span><div class="nat"><b>선물 '+gc+'개가 도착했어요</b><span>탭해서 선물함에서 받으세요</span></div><span class="buy">받기</span></div>'; }
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

