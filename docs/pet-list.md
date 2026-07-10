# 🐾 펫 목록 (구현된 펫 전체)

현재 앱에 구현된 펫 목록입니다. 데이터 소스는 `public/js/cats.js` 의 `PET_CATALOG`(이름·종·가격·설명)·`CAT_TIER`(등급)·`PET_SPRITES`(아트)이며, **이 문서는 그 코드를 근거로 손으로 정리한 요약**입니다. 펫을 추가·수정하면 이 표도 함께 갱신하세요(추가 절차는 [pet-asset-pipeline.md](pet-asset-pipeline.md)).

- **총 <!--@gen:count-->148<!--@gen:end-->종** (고양이 `cat`·호랑이 `tiger`·사자 `lion`).
- **가격은 등급으로 자동 산정**됩니다: `TIER_PRICE = { 일반 50 · 고급 100 · 희귀 200 · 특별 400 · 전설 800 · 한정 1500 }` 을 `CAT_TIER` 기준으로 `PET_CATALOG.price` 에 적용.
- **아트**: <!--@gen:count2-->148<!--@gen:end-->종 전부 PixelLab **PNG 스프라이트 시트**(288×48, 옆보기 east 6프레임) + 정지 4방향(south/north/east/west). 시트가 없는 동물만 SVG 폴백을 씁니다(현재 해당 없음).

## 목록

| # | 이름 | id | 종 | 크기 | 등급 | 가격(은화) | 이미지 폴더 | 아트 | 설명 |
|---|---|---|---|---|---|---|---|---|---|
<!-- @gen:pet-list-table — 자동생성(tools/build_pets.py) -->
| 1 | 고등어 | `cat_mackerel` | 고양이 | 1.2× | 일반 | 50 | `public/assets/pets/cat/cat_mackerel/` | PNG 스프라이트 6프레임 | 쿨그레이 줄무늬. 차분하게 방을 돌아다녀요. |
| 2 | 뒤뚱 | `cat_cheese` | 고양이 | 1.2× | 일반 | 50 | `public/assets/pets/cat/cat_cheese/` | PNG 스프라이트 6프레임 | 웜오렌지. 활발하게 뛰어다니는 개냥이. |
| 3 | 길냥 | `cat_calico` | 고양이 | 1.2× | 일반 | 50 | `public/assets/pets/cat/cat_calico/` | PNG 스프라이트 6프레임 | 검정·주황 어우러진 삼색(토터셸). 도도하게 창가에 앉아요. |
| 4 | 네로 | `cat_black` | 고양이 | 1.2× | 일반 | 50 | `public/assets/pets/cat/cat_black/` | PNG 스프라이트 6프레임 | 노란 눈의 까만 고양이. 조용히 방을 지켜요. |
| 5 | 하양 | `cat_white` | 고양이 | 1.2× | 일반 | 50 | `public/assets/pets/cat/cat_white/` | PNG 스프라이트 6프레임 | 파란 눈의 새하얀 고양이. 볕에서 낮잠을 즐겨요. |
| 6 | 복슬이 | `cat_fluffy` | 고양이 | 1.2× | 일반 | 50 | `public/assets/pets/cat/cat_fluffy/` | PNG 스프라이트 6프레임 | 복슬복슬한 털에 파란 눈. 나른하게 졸며 방을 거닐어요. |
| 7 | 검정얼룩이 | `cat_tuxedo` | 고양이 | 1.2× | 일반 | 50 | `public/assets/pets/cat/cat_tuxedo/` | PNG 스프라이트 6프레임 | 검은 정장에 하얀 셔츠·발. 단정하게 걸어다녀요. |
| 8 | 골목대장 | `cat_chaos` | 고양이 | 1.2× | 일반 | 50 | `public/assets/pets/cat/cat_chaos/` | PNG 스프라이트 6프레임 | 다크그레이+브라운 소용돌이 무늬. 종잡을 수 없이 쏘다녀요. |
| 9 | 삼삼이 | `cat_siamese` | 고양이 | 1.2× | 고급 | 100 | `public/assets/pets/cat/cat_siamese/` | PNG 스프라이트 6프레임 | 크림빛 몸에 짙은 포인트. 우아하게 방을 누벼요. |
| 10 | 황토 | `cat_bengal` | 고양이 | 1.2× | 일반 | 50 | `public/assets/pets/cat/cat_bengal/` | PNG 스프라이트 6프레임 | 골든빛 몸에 동글동글 반점. 야무지게 돌아다녀요. |
| 11 | 폴드 | `cat_fold` | 고양이 | 1.2× | 일반 | 50 | `public/assets/pets/cat/cat_fold/` | PNG 스프라이트 6프레임 | 접힌 귀가 매력. 얌전히 자리를 지켜요. |
| 12 | 보라 | `cat_bora` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_bora/` | PNG 스프라이트 6프레임 | 한쪽은 파랑·한쪽은 호박색 오드아이. 신비롭게 거닐어요. |
| 13 | 초코 | `cat_choco` | 고양이 | 1.2× | 일반 | 50 | `public/assets/pets/cat/cat_choco/` | PNG 스프라이트 6프레임 | 초콜릿빛 갈색 털에 크림색 입가·가슴. 느긋하게 방을 거닐어요. |
| 14 | 아깽이 | `cat_kitten` | 고양이 | 1× | 일반 | 50 | `public/assets/pets/cat/cat_kitten/` | PNG 스프라이트 6프레임 | 치즈빛 오렌지 태비 아기고양이. 뒤뚱뒤뚱 방을 쏘다녀요. |
| 15 | 핑크 | `cat_pink` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_pink/` | PNG 스프라이트 6프레임 | 털 없는 분홍빛 주름 피부. 도도하게 방을 누벼요. |
| 16 | 고랑이 | `tiger_orange` | 호랑이 | 4× | 한정 | 1500 | `public/assets/pets/tiger/tiger_orange/` | PNG 스프라이트 6프레임 | 볼드한 검은 줄무늬의 오렌지 호랑이. 위풍당당하게 방을 누벼요. |
| 17 | 갈기냥 | `lion_mane` | 사자 | 4× | 한정 | 1500 | `public/assets/pets/lion/lion_mane/` | PNG 스프라이트 6프레임 | 풍성한 갈기의 황금빛 사자. 위풍당당하게 방을 거닐어요. |
| 18 | 페르시안(흰색) | `cat_persian` | 고양이 | 1.2× | 전설 | 800 | `public/assets/pets/cat/cat_persian/` | PNG 스프라이트 6프레임 | 납작한 얼굴에 복슬복슬 긴 털. 우아하게 방을 누벼요. |
| 19 | 백호 | `tiger_white` | 호랑이 | 4× | 한정 | 1500 | `public/assets/pets/tiger/tiger_white/` | PNG 스프라이트 6프레임 | 푸른 눈의 새하얀 호랑이. 늠름하게 방을 누벼요. |
| 20 | 블루 | `cat_russianblue` | 고양이 | 1.2× | 일반 | 50 | `public/assets/pets/cat/cat_russianblue/` | PNG 스프라이트 6프레임 | 은청빛 짧은 털에 초록 눈. 조용히 방을 거닐어요. |
| 21 | 얼룩이 | `cat_bengal2` | 고양이 | 1.2× | 고급 | 100 | `public/assets/pets/cat/cat_bengal2/` | PNG 스프라이트 6프레임 | 야생미 물씬 로제트 무늬. 날렵하게 방을 쏘다녀요. |
| 22 | 시고르자브 | `dog_mutt` | 강아지 | 2× | 희귀 | 200 | `public/assets/pets/dog/dog_mutt/` | PNG 스프라이트 6프레임 | 어느 동네에나 있는 씩씩한 잡종견. 꼬리 흔들며 졸졸 따라다녀요. |
| 23 | 블랙팬서 | `cat_panther` | 고양이 | 1.2× | 한정 | 1500 | `public/assets/pets/cat/cat_panther/` | PNG 스프라이트 6프레임 | 칠흑빛 근육질의 흑표범. 소리 없이 방을 누비는 한정판 위엄. |
| 24 | 백구 | `dog_baekgu` | 강아지 | 2× | 일반 | 50 | `public/assets/pets/dog/dog_baekgu/` | PNG 스프라이트 8프레임 | 온 동네가 아는 새하얀 토종개. 사람만 보면 꼬리가 헬리콥터. |
| 25 | 시바 | `dog_shiba` | 강아지 | 1.5× | 특별 | 400 | `public/assets/pets/dog/dog_shiba/` | PNG 스프라이트 8프레임 | 새침한 표정 뒤에 장난기 가득. 마음을 열면 껌딱지가 돼요. |
| 26 | 코기 | `dog_corgi` | 강아지 | 1.5× | 전설 | 800 | `public/assets/pets/dog/dog_corgi/` | PNG 스프라이트 6프레임 | 짧은 다리로 통통, 복슬 엉덩이가 트레이드마크. |
| 27 | 달마시안 | `dog_dalmatian` | 강아지 | 2× | 고급 | 100 | `public/assets/pets/dog/dog_dalmatian/` | PNG 스프라이트 6프레임 | 까만 점박이 무늬가 하나하나 다 달라요. 달리기라면 자신 있음. |
| 28 | 닥스훈트 | `dog_dachshund` | 강아지 | 1.5× | 특별 | 400 | `public/assets/pets/dog/dog_dachshund/` | PNG 스프라이트 6프레임 | 기다란 소시지 몸에 씩씩한 성격. 굴 파기 챔피언. |
| 29 | 불독 | `dog_bulldog` | 강아지 | 1.5× | 일반 | 50 | `public/assets/pets/dog/dog_bulldog/` | PNG 스프라이트 6프레임 | 주름진 얼굴로 뚱한 척, 사실은 애교쟁이 순둥이. |
| 30 | 인절미 | `dog_injeolmi` | 강아지 | 1.5× | 전설 | 800 | `public/assets/pets/dog/dog_injeolmi/` | PNG 스프라이트 6프레임 | 말랑말랑 콩고물 빛 털뭉치. 안으면 떡처럼 쫀득. |
| 31 | 스탠다드푸들 | `dog_poodle` | 강아지 | 1.5× | 희귀 | 200 | `public/assets/pets/dog/dog_poodle/` | PNG 스프라이트 6프레임 | 우아한 곱슬머리 신사. 똑똑하기로 소문났어요. |
| 32 | 비글 | `dog_beagle` | 강아지 | 1.5× | 희귀 | 200 | `public/assets/pets/dog/dog_beagle/` | PNG 스프라이트 6프레임 | 코가 이끄는 대로 온 집안 탐험. 호기심 대장. |
| 33 | 숙희 | `dog_sukhee` | 강아지 | 1.5× | 전설 | 800 | `public/assets/pets/dog/dog_sukhee/` | PNG 스프라이트 6프레임 | 동네 골목대장 누렁이. 정 많고 의리 넘쳐요. |
| 34 | 도베르만 | `dog_doberman` | 강아지 | 2.5× | 전설 | 800 | `public/assets/pets/dog/dog_doberman/` | PNG 스프라이트 8프레임 | 날렵한 근육질 경비대장. 겉은 시크, 속은 다정. |
| 35 | 퍼그 | `dog_pug` | 강아지 | 1.5× | 전설 | 800 | `public/assets/pets/dog/dog_pug/` | PNG 스프라이트 8프레임 | 찌글 주름과 똥그란 눈망울. 코고는 소리마저 사랑스러워. |
| 36 | 저먼셰퍼드 | `dog_shepherd` | 강아지 | 2.5× | 전설 | 800 | `public/assets/pets/dog/dog_shepherd/` | PNG 스프라이트 8프레임 | 믿음직한 명견. 한번 주인은 영원한 주인. |
| 37 | 보더콜리 | `dog_bordercollie` | 강아지 | 2× | 특별 | 400 | `public/assets/pets/dog/dog_bordercollie/` | PNG 스프라이트 8프레임 | 천재 견공. 눈빛만으로 양떼도 척척. |
| 38 | 스피츠 | `dog_spitz` | 강아지 | 1.5× | 일반 | 50 | `public/assets/pets/dog/dog_spitz/` | PNG 스프라이트 6프레임 | 새하얀 솜뭉치. 방긋 웃는 여우상 미소. |
| 39 | 잭러셀테리어 | `dog_jackrussell` | 강아지 | 1.5× | 전설 | 800 | `public/assets/pets/dog/dog_jackrussell/` | PNG 스프라이트 6프레임 | 작은 몸에 에너지 폭발. 잠시도 가만 못 있어요. |
| 40 | 레브라도 | `dog_labrador` | 강아지 | 2× | 특별 | 400 | `public/assets/pets/dog/dog_labrador/` | PNG 스프라이트 6프레임 | 물놀이라면 사족을 못 써요. 세상 다정한 리트리버. |
| 41 | 차우차우 | `dog_chowchow` | 강아지 | 2× | 특별 | 400 | `public/assets/pets/dog/dog_chowchow/` | PNG 스프라이트 6프레임 | 복슬복슬 사자 갈기에 보라색 혀. 도도한 곰인형. |
| 42 | 카디건코기 | `dog_cardigancorgi` | 강아지 | 1.5× | 특별 | 400 | `public/assets/pets/dog/dog_cardigancorgi/` | PNG 스프라이트 6프레임 | 긴 꼬리 달린 코기. 짧은 다리로 총총총. |
| 43 | 그레이하운드 | `dog_greyhound` | 강아지 | 2× | 전설 | 800 | `public/assets/pets/dog/dog_greyhound/` | PNG 스프라이트 6프레임 | 바람보다 빠른 질주 본능. 쉴 땐 세상 게을러요. |
| 44 | 시츄 | `dog_shihtzu` | 강아지 | 1.5× | 고급 | 100 | `public/assets/pets/dog/dog_shihtzu/` | PNG 스프라이트 6프레임 | 우아한 긴 털의 궁중견. 방석 위가 내 왕좌. |
| 45 | 세인트버나드 | `dog_stbernard` | 강아지 | 3× | 특별 | 400 | `public/assets/pets/dog/dog_stbernard/` | PNG 스프라이트 6프레임 | 산악 구조견의 후예. 커다란 덩치에 순한 마음. |
| 46 | 보스턴테리어 | `dog_bostonterrier` | 강아지 | 1.5× | 희귀 | 200 | `public/assets/pets/dog/dog_bostonterrier/` | PNG 스프라이트 6프레임 | 턱시도 입은 신사견. 동글 눈망울이 매력. |
| 47 | 바셋하운드 | `dog_bassethound` | 강아지 | 1.5× | 전설 | 800 | `public/assets/pets/dog/dog_bassethound/` | PNG 스프라이트 6프레임 | 축 처진 귀와 슬픈 눈. 느긋한 산책 파트너. |
| 48 | 해피 | `dog_happy` | 강아지 | 1.5× | 일반 | 50 | `public/assets/pets/dog/dog_happy/` | PNG 스프라이트 6프레임 | 이름처럼 늘 행복 가득. 웃는 얼굴이 트레이드마크. |
| 49 | 웰시테리어 | `dog_welshterrier` | 강아지 | 1.5× | 전설 | 800 | `public/assets/pets/dog/dog_welshterrier/` | PNG 스프라이트 6프레임 | 곱슬 갈색 털의 꼬마 신사. 용감함은 대형견급. |
| 50 | 파피용 | `dog_papillon` | 강아지 | 1.5× | 고급 | 100 | `public/assets/pets/dog/dog_papillon/` | PNG 스프라이트 6프레임 | 나비 날개 같은 귀가 팔랑팔랑. 작지만 똑똑해요. |
| 51 | 뉴펀들랜드 | `dog_newfoundland` | 강아지 | 3× | 전설 | 800 | `public/assets/pets/dog/dog_newfoundland/` | PNG 스프라이트 6프레임 | 물속 구조 전문 거인. 곰만 한 덩치에 천사 마음. |
| 52 | 비어디드콜리 | `dog_beardedcollie` | 강아지 | 2× | 전설 | 800 | `public/assets/pets/dog/dog_beardedcollie/` | PNG 스프라이트 6프레임 | 수염 난 장발 목양견. 바람에 휘날리는 털결. |
| 53 | 보더콜리 | `dog_afghanhound` | 강아지 | 2.5× | 전설 | 800 | `public/assets/pets/dog/dog_afghanhound/` | PNG 스프라이트 6프레임 | 실크 같은 긴 털을 휘날리는 귀족. 우아함 그 자체. |
| 54 | 로트와일러 | `dog_rottweiler` | 강아지 | 2.5× | 특별 | 400 | `public/assets/pets/dog/dog_rottweiler/` | PNG 스프라이트 6프레임 | 든든한 경비견. 무뚝뚝해 보여도 가족 바보. |
| 55 | 포인터 | `dog_pointer` | 강아지 | 2× | 특별 | 400 | `public/assets/pets/dog/dog_pointer/` | PNG 스프라이트 6프레임 | 사냥감을 코로 가리키는 명사수. 늘씬한 근육질. |
| 56 | 파라오하운드 | `dog_pharaohhound` | 강아지 | 2× | 전설 | 800 | `public/assets/pets/dog/dog_pharaohhound/` | PNG 스프라이트 6프레임 | 고대 벽화에서 걸어 나온 듯한 우아한 사냥개. |
| 57 | 웨스트하이랜더테리어 | `dog_westie` | 강아지 | 1.5× | 일반 | 50 | `public/assets/pets/dog/dog_westie/` | PNG 스프라이트 6프레임 | 새하얀 털뭉치 꼬마. 당당한 걸음걸이가 매력. |
| 58 | 바이마라너 | `dog_weimaraner` | 강아지 | 2× | 특별 | 400 | `public/assets/pets/dog/dog_weimaraner/` | PNG 스프라이트 6프레임 | 은빛 회색 털에 호수빛 눈동자. 우아한 사냥개. |
| 59 | 콜리 | `dog_collie` | 강아지 | 2× | 특별 | 400 | `public/assets/pets/dog/dog_collie/` | PNG 스프라이트 6프레임 | 영리한 목양견. 부드러운 갈기가 바람에 살랑. |
| 60 | 잉글리시불독 | `dog_englishbulldog` | 강아지 | 2× | 특별 | 400 | `public/assets/pets/dog/dog_englishbulldog/` | PNG 스프라이트 6프레임 | 묵직한 주름 신사. 느긋함이 몸에 뱄어요. |
| 61 | 키스혼드 | `dog_keeshond` | 강아지 | 2× | 전설 | 800 | `public/assets/pets/dog/dog_keeshond/` | PNG 스프라이트 6프레임 | 복슬복슬 회색 솜사자. 웃는 여우상 표정. |
| 62 | 프렌치불독 | `dog_frenchbulldog` | 강아지 | 1.5× | 특별 | 400 | `public/assets/pets/dog/dog_frenchbulldog/` | PNG 스프라이트 6프레임 | 박쥐 귀에 납작 얼굴. 코믹한 표정의 애교쟁이. |
| 63 | 요크셔테리어 | `dog_yorkshire` | 강아지 | 1.5× | 고급 | 100 | `public/assets/pets/dog/dog_yorkshire/` | PNG 스프라이트 6프레임 | 비단결 털의 작은 요정. 도도함은 대형견 못지않아요. |
| 64 | 토이푸들 | `dog_toypoodle` | 강아지 | 1.5× | 고급 | 100 | `public/assets/pets/dog/dog_toypoodle/` | PNG 스프라이트 6프레임 | 동글동글 곱슬 인형. 어딜 가나 시선 강탈. |
| 65 | 셰틀랜드십독 | `dog_sheltie` | 강아지 | 1.5× | 희귀 | 200 | `public/assets/pets/dog/dog_sheltie/` | PNG 스프라이트 6프레임 | 미니 콜리. 영리하고 재빠른 꼬마 목동. |
| 66 | 미니어처핀셔 | `dog_minpin` | 강아지 | 1.5× | 특별 | 400 | `public/assets/pets/dog/dog_minpin/` | PNG 스프라이트 6프레임 | 작지만 당당한 꼬마 대장. 총총 걷는 발걸음이 야무져요. |
| 67 | 슈나우저 | `dog_schnauzer` | 강아지 | 1.5× | 특별 | 400 | `public/assets/pets/dog/dog_schnauzer/` | PNG 스프라이트 6프레임 | 멋진 콧수염 신사. 눈썹까지 완벽한 스타일. |
| 68 | 골든두들 | `dog_goldendoodle` | 강아지 | 2× | 고급 | 100 | `public/assets/pets/dog/dog_goldendoodle/` | PNG 스프라이트 6프레임 | 곱슬 황금빛 인형. 안으면 구름처럼 폭신. |
| 69 | 버니즈마운틴독 | `dog_bernese` | 강아지 | 2.5× | 전설 | 800 | `public/assets/pets/dog/dog_bernese/` | PNG 스프라이트 6프레임 | 삼색 털의 산악 거인. 든든하고 다정한 대형견. |
| 70 | 캐벌리어스파니엘 | `dog_cavalier` | 강아지 | 1.5× | 희귀 | 200 | `public/assets/pets/dog/dog_cavalier/` | PNG 스프라이트 6프레임 | 물결치는 귀와 그렁한 눈. 무릎 위가 명당. |
| 71 | 아키타 | `dog_akita` | 강아지 | 2.5× | 전설 | 800 | `public/assets/pets/dog/dog_akita/` | PNG 스프라이트 6프레임 | 충직함의 상징. 곰 같은 얼굴에 의리 가득. |
| 72 | 휘핏 | `dog_whippet` | 강아지 | 1.5× | 전설 | 800 | `public/assets/pets/dog/dog_whippet/` | PNG 스프라이트 6프레임 | 날씬한 스프린터. 달릴 땐 총알, 쉴 땐 이불속. |
| 73 | 올드잉글리시쉽독 | `dog_oldenglishsheepdog` | 강아지 | 2.5× | 특별 | 400 | `public/assets/pets/dog/dog_oldenglishsheepdog/` | PNG 스프라이트 6프레임 | 눈을 덮은 장발 목양견. 걸어다니는 복슬 대걸레. |
| 74 | 비즐라 | `dog_vizsla` | 강아지 | 2× | 특별 | 400 | `public/assets/pets/dog/dog_vizsla/` | PNG 스프라이트 6프레임 | 황금빛 구릿빛 사냥개. 늘 주인 곁에 껌딱지. |
| 75 | 잉글리시셰터 | `dog_englishsetter` | 강아지 | 2× | 전설 | 800 | `public/assets/pets/dog/dog_englishsetter/` | PNG 스프라이트 6프레임 | 우아한 물결무늬 털. 들판을 누비는 사냥 명견. |
| 76 | 진돗개 | `dog_jindo` | 강아지 | 2× | 한정 | 1500 | `public/assets/pets/dog/dog_jindo/` | PNG 스프라이트 6프레임 | 충직한 토종 명견. 한번 정한 주인은 끝까지. |
| 77 | 차이니즈크레스티드 | `dog_chinesecrested` | 강아지 | 1.5× | 특별 | 400 | `public/assets/pets/dog/dog_chinesecrested/` | PNG 스프라이트 6프레임 | 머리와 발끝에만 깃털 장식. 독특한 멋쟁이. |
| 78 | 스코티시테리어 | `dog_scottie` | 강아지 | 1.5× | 특별 | 400 | `public/assets/pets/dog/dog_scottie/` | PNG 스프라이트 6프레임 | 까만 수염 신사. 짧은 다리로 당당하게 총총. |
| 79 | 포메라니안 | `dog_pomeranian` | 강아지 | 1.5× | 일반 | 50 | `public/assets/pets/dog/dog_pomeranian/` | PNG 스프라이트 6프레임 | 폭신 솜뭉치 여우. 방긋 미소가 심쿵 포인트. |
| 80 | 샤페이 | `dog_sharpei` | 강아지 | 2× | 특별 | 400 | `public/assets/pets/dog/dog_sharpei/` | PNG 스프라이트 6프레임 | 주름 가득 접힌 얼굴. 진지한 표정의 순둥이. |
| 81 | 그레이트데인 | `dog_greatdane` | 강아지 | 3× | 전설 | 800 | `public/assets/pets/dog/dog_greatdane/` | PNG 스프라이트 6프레임 | 우아한 거인. 세상 점잖은 대형견 신사. |
| 82 | 불테리어 | `dog_bullterrier` | 강아지 | 2× | 전설 | 800 | `public/assets/pets/dog/dog_bullterrier/` | PNG 스프라이트 6프레임 | 달걀형 얼굴에 개구쟁이 성격. 근육질 장난꾸러기. |
| 83 | 복서 | `dog_boxer` | 강아지 | 2× | 특별 | 400 | `public/assets/pets/dog/dog_boxer/` | PNG 스프라이트 6프레임 | 탄탄한 근육에 장난기 만점. 영원한 대형 강아지. |
| 84 | 로디지안리지백 | `dog_ridgeback` | 강아지 | 2.5× | 특별 | 400 | `public/assets/pets/dog/dog_ridgeback/` | PNG 스프라이트 6프레임 | 등줄기 갈기가 트레이드마크. 늠름한 사냥꾼. |
| 85 | 아이리시세터 | `dog_irishsetter` | 강아지 | 2× | 특별 | 400 | `public/assets/pets/dog/dog_irishsetter/` | PNG 스프라이트 6프레임 | 붉은 비단 털을 휘날리는 미남. 활발한 사냥개. |
| 86 | 에어데일테일러 | `dog_airedale` | 강아지 | 2× | 전설 | 800 | `public/assets/pets/dog/dog_airedale/` | PNG 스프라이트 6프레임 | 테리어의 왕. 곱슬 갈색 털에 당당한 기품. |
| 87 | 사모예드 | `dog_samoyed` | 강아지 | 2× | 전설 | 800 | `public/assets/pets/dog/dog_samoyed/` | PNG 스프라이트 6프레임 | 새하얀 솜사탕 미소. 웃는 얼굴이 트레이드마크인 눈썰매개. |
| 88 | 시베리안허스키 | `dog_husky` | 강아지 | 2× | 전설 | 800 | `public/assets/pets/dog/dog_husky/` | PNG 스프라이트 6프레임 | 푸른 눈의 설원 질주자. 늑대 같은 외모에 장난꾸러기 마음. |
| 89 | 고등어 | `cat_mackerel2` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_mackerel2/` | PNG 스프라이트 6프레임 | 은빛 줄무늬가 촘촘한 국민 고양이. 날렵하고 똑똑해요. |
| 90 | 칼리코 | `cat_calico2` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_calico2/` | PNG 스프라이트 6프레임 | 흰·검·주황 삼색의 조화. 복스러운 얼굴의 복덩이. |
| 91 | 하양 | `cat_white2` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_white2/` | PNG 스프라이트 6프레임 | 티 없이 새하얀 털. 우아하게 걷는 설공주. |
| 92 | 치즈 | `cat_cheese2` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_cheese2/` | PNG 스프라이트 6프레임 | 노란 치즈빛 태비. 느긋하고 장난기 많은 개냥이. |
| 93 | 턱시도 | `cat_tuxedo2` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_tuxedo2/` | PNG 스프라이트 6프레임 | 말끔한 흑백 턱시도 차림. 타고난 신사. |
| 94 | 샴 | `cat_siamese2` | 고양이 | 1.2× | 전설 | 800 | `public/assets/pets/cat/cat_siamese2/` | PNG 스프라이트 6프레임 | 크림빛 몸에 짙은 포인트. 도도한 목소리의 수다쟁이. |
| 95 | 벵갈 | `cat_bengal3` | 고양이 | 1.2× | 전설 | 800 | `public/assets/pets/cat/cat_bengal3/` | PNG 스프라이트 6프레임 | 야생 표범 무늬의 근육질. 물놀이를 좋아하는 활동파. |
| 96 | 러시안블루 | `cat_russianblue2` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_russianblue2/` | PNG 스프라이트 6프레임 | 은빛 도는 청회색 털에 에메랄드 눈동자. 조용한 귀족. |
| 97 | 스코티시폴드 | `cat_scottishfold` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_scottishfold/` | PNG 스프라이트 6프레임 | 접힌 귀와 동그란 얼굴. 부엉이 닮은 애교쟁이. |
| 98 | 까망 | `cat_black2` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_black2/` | PNG 스프라이트 6프레임 | 칠흑빛 윤기나는 털. 밤을 닮은 신비로운 매력. |
| 99 | 설렁 | `cat_seolleong` | 고양이 | 1.2× | 고급 | 100 | `public/assets/pets/cat/cat_seolleong/` | PNG 스프라이트 6프레임 | 느긋하고 순한 우리집 순둥이. 늘 곁에 붙어 있어요. |
| 100 | 페르시안(회색) | `cat_persiangray` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_persiangray/` | PNG 스프라이트 6프레임 | 복슬복슬 회색 장모. 납작한 얼굴의 우아한 공주. |
| 101 | 메인쿤(갈색태비) | `cat_mainecoon` | 고양이 | 1.4× | 전설 | 800 | `public/assets/pets/cat/cat_mainecoon/` | PNG 스프라이트 6프레임 | 거대한 몸집의 온순한 거인. 고양이계의 대형견. |
| 102 | 아메리칸숏헤어(실버태비) | `cat_americanshorthair` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_americanshorthair/` | PNG 스프라이트 6프레임 | 은빛 태비의 건강미. 튼튼하고 붙임성 좋아요. |
| 103 | 랙돌(포인트) | `cat_ragdoll` | 고양이 | 1.3× | 전설 | 800 | `public/assets/pets/cat/cat_ragdoll/` | PNG 스프라이트 6프레임 | 안으면 인형처럼 축 늘어지는 순둥이. 파란 눈이 매력. |
| 104 | 터키시앙고라(흰색) | `cat_turkishangora` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_turkishangora/` | PNG 스프라이트 6프레임 | 비단결 흰 장모. 우아하게 흐르는 실크 털. |
| 105 | 먼치킨(삼색) | `cat_munchkin` | 고양이 | 1.1× | 특별 | 400 | `public/assets/pets/cat/cat_munchkin/` | PNG 스프라이트 6프레임 | 짧은 다리로 종종종. 삼색 털의 귀염둥이. |
| 106 | 노르웨이숲(갈색) | `cat_norwegian` | 고양이 | 1.3× | 특별 | 400 | `public/assets/pets/cat/cat_norwegian/` | PNG 스프라이트 6프레임 | 북유럽 숲의 야성미. 풍성한 갈색 털의 산고양이. |
| 107 | 봄베이(검정) | `cat_bombay` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_bombay/` | PNG 스프라이트 6프레임 | 미니 흑표범. 구릿빛 눈동자가 빛나는 검은 매력. |
| 108 | 아비시니안(갈색) | `cat_abyssinian` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_abyssinian/` | PNG 스프라이트 6프레임 | 고대 벽화 속 우아함. 티키태비 갈색 털의 활동가. |
| 109 | 스핑크스(핑크) | `cat_sphynx` | 고양이 | 1.2× | 전설 | 800 | `public/assets/pets/cat/cat_sphynx/` | PNG 스프라이트 6프레임 | 털 없는 분홍 피부. 따뜻하고 애교 넘치는 외계 미묘. |
| 110 | 브리티시숏헤어(그레이) | `cat_british` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_british/` | PNG 스프라이트 6프레임 | 포동포동 회색 곰인형. 진중한 표정의 순둥이. |
| 111 | 벵갈(스노우) | `cat_bengalsnow` | 고양이 | 1.2× | 전설 | 800 | `public/assets/pets/cat/cat_bengalsnow/` | PNG 스프라이트 6프레임 | 설원빛 로제트 무늬. 얼음처럼 시린 파란 눈. |
| 112 | 장모 삼색 | `cat_longhaircalico` | 고양이 | 1.2× | 고급 | 100 | `public/assets/pets/cat/cat_longhaircalico/` | PNG 스프라이트 6프레임 | 풍성한 삼색 장모. 복스럽고 우아한 자태. |
| 113 | 토터셸(카오스) | `cat_tortie` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_tortie/` | PNG 스프라이트 6프레임 | 검·주황이 뒤섞인 거북등무늬. 개성 만점 카오스. |
| 114 | 샴(초콜릿포인트) | `cat_siamesechoco` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_siamesechoco/` | PNG 스프라이트 6프레임 | 초콜릿빛 포인트의 샴. 달콤한 색감의 수다쟁이. |
| 115 | 코니시렉스 | `cat_cornishrex` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_cornishrex/` | PNG 스프라이트 6프레임 | 물결치는 곱슬 단모. 날렵한 몸매의 장난꾸러기. |
| 116 | 오시캣 | `cat_ocicat` | 고양이 | 1.2× | 전설 | 800 | `public/assets/pets/cat/cat_ocicat/` | PNG 스프라이트 6프레임 | 야생 오실롯 닮은 점박이. 집냥이 속 작은 야생. |
| 117 | 셀커크렉스 | `cat_selkirkrex` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_selkirkrex/` | PNG 스프라이트 6프레임 | 복슬복슬 곱슬털 양. 포근한 곰인형 감촉. |
| 118 | 코랫 | `cat_korat` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_korat/` | PNG 스프라이트 6프레임 | 은빛 청회색의 행운 고양이. 하트형 얼굴이 매력. |
| 119 | 맹크스 | `cat_manx` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_manx/` | PNG 스프라이트 6프레임 | 꼬리 없는 동글 엉덩이. 토끼처럼 통통 뛰어요. |
| 120 | 아메리칸컬 | `cat_americancurl` | 고양이 | 1.2× | 희귀 | 200 | `public/assets/pets/cat/cat_americancurl/` | PNG 스프라이트 6프레임 | 뒤로 말린 귀가 트레이드마크. 호기심 많은 개구쟁이. |
| 121 | 데본렉스 | `cat_devonrex` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_devonrex/` | PNG 스프라이트 6프레임 | 요정 귀에 곱슬털. 장난기 가득한 꼬마 도깨비. |
| 122 | 터키시반(반무늬) | `cat_turkishvan` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_turkishvan/` | PNG 스프라이트 6프레임 | 머리·꼬리에만 색이 든 반무늬. 물을 좋아하는 수영선수. |
| 123 | 밥테일 | `cat_bobtail` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_bobtail/` | PNG 스프라이트 6프레임 | 짧은 방울 꼬리. 씩씩하고 영리한 복고양이. |
| 124 | 버미즈 | `cat_burmese` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_burmese/` | PNG 스프라이트 6프레임 | 반질반질 갈색 털에 금빛 눈. 다정한 껌딱지. |
| 125 | 히말라얀 | `cat_himalayan` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_himalayan/` | PNG 스프라이트 6프레임 | 페르시안 몸에 샴 포인트. 복슬복슬 파란 눈의 공주. |
| 126 | 크림태비 | `cat_creamtabby` | 고양이 | 1.2× | 희귀 | 200 | `public/assets/pets/cat/cat_creamtabby/` | PNG 스프라이트 6프레임 | 은은한 크림빛 줄무늬. 부드럽고 온순한 매력. |
| 127 | 라일락 | `cat_lilac` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_lilac/` | PNG 스프라이트 6프레임 | 연보라빛 도는 회색 털. 몽환적인 파스텔 미묘. |
| 128 | 소말리 | `cat_somali` | 고양이 | 1.2× | 전설 | 800 | `public/assets/pets/cat/cat_somali/` | PNG 스프라이트 6프레임 | 풍성한 여우꼬리 장모. 붉은 노을빛의 아비시니안. |
| 129 | 삵 | `cat_leopardcat` | 고양이 | 1.5× | exclusive | 50 | `public/assets/pets/cat/cat_leopardcat/` | PNG 스프라이트 6프레임 | 한반도 산야를 누비는 토종 들고양이. 야생의 기품. |
| 130 | 시라소니 | `cat_lynx` | 고양이 | 2× | exclusive | 50 | `public/assets/pets/cat/cat_lynx/` | PNG 스프라이트 6프레임 | 귀 끝 붓털의 산속 사냥꾼. 눈밭을 소리 없이 누벼요. |
| 131 | 치타 | `cat_cheetah` | 고양이 | 3× | exclusive | 50 | `public/assets/pets/cat/cat_cheetah/` | PNG 스프라이트 6프레임 | 지상 최속의 스프린터. 눈물자국 선명한 초원의 질주자. |
| 132 | 재규어 | `cat_jaguar` | 고양이 | 3.4× | exclusive | 50 | `public/assets/pets/cat/cat_jaguar/` | PNG 스프라이트 8프레임 | 정글의 제왕. 강력한 턱과 황금빛 로제트 무늬. |
| 133 | 퓨마 | `cat_puma` | 고양이 | 3.2× | exclusive | 50 | `public/assets/pets/cat/cat_puma/` | PNG 스프라이트 8프레임 | 아메리카 산악의 은둔 사냥꾼. 유연한 근육의 대형 고양이. |
| 134 | 눈표범 | `cat_snowleopard` | 고양이 | 3× | exclusive | 50 | `public/assets/pets/cat/cat_snowleopard/` | PNG 스프라이트 8프레임 | 히말라야 설산의 유령. 두꺼운 털과 긴 꼬리의 은빛 표범. |
| 135 | 카라칼 | `cat_caracal` | 고양이 | 2× | exclusive | 50 | `public/assets/pets/cat/cat_caracal/` | PNG 스프라이트 8프레임 | 긴 붓귀의 사막 점프왕. 새도 뛰어올라 낚아채요. |
| 136 | 표범 | `cat_leopard` | 고양이 | 3× | exclusive | 50 | `public/assets/pets/cat/cat_leopard/` | PNG 스프라이트 8프레임 | 나무 위의 은밀한 사냥꾼. 우아한 로제트 무늬. |
| 137 | 흑표범 | `cat_blackpanther` | 고양이 | 3× | exclusive | 50 | `public/assets/pets/cat/cat_blackpanther/` | PNG 스프라이트 8프레임 | 칠흑빛 멜라닌 표범. 어둠 속을 소리 없이 활보. |
| 138 | 오셀롯 | `cat_ocelot` | 고양이 | 1.8× | exclusive | 50 | `public/assets/pets/cat/cat_ocelot/` | PNG 스프라이트 8프레임 | 보석 같은 반점의 밤의 사냥꾼. 작지만 강인한 야생. |
| 139 | 모래고양이 | `cat_sandcat` | 고양이 | 1.1× | 특별 | 400 | `public/assets/pets/cat/cat_sandcat/` | PNG 스프라이트 6프레임 | 사막의 작은 요정. 큰 귀로 모래 밑 소리도 들어요. |
| 140 | 메인쿤(블랙스모크) | `cat_mainecoonsmoke` | 고양이 | 1.4× | 전설 | 800 | `public/assets/pets/cat/cat_mainecoonsmoke/` | PNG 스프라이트 6프레임 | 은빛 스모크가 감도는 거대 장모. 온순한 숲의 거인. |
| 141 | 메인쿤(레드태비) | `cat_mainecoonred` | 고양이 | 1.4× | 특별 | 400 | `public/assets/pets/cat/cat_mainecoonred/` | PNG 스프라이트 6프레임 | 붉은 태비의 풍성한 장모. 다정한 대형 고양이. |
| 142 | 벵갈(실버) | `cat_bengalsilver` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_bengalsilver/` | PNG 스프라이트 6프레임 | 은빛 바탕에 검은 로제트. 차가운 야생미의 표범 무늬. |
| 143 | 피더볼드 | `cat_peterbald` | 고양이 | 1.2× | 전설 | 800 | `public/assets/pets/cat/cat_peterbald/` | PNG 스프라이트 6프레임 | 털 없는 매끈한 피부의 우아한 묘. 따뜻한 온기의 애교쟁이. |
| 144 | 토이거 | `cat_toyger` | 고양이 | 1.2× | 한정 | 1500 | `public/assets/pets/cat/cat_toyger/` | PNG 스프라이트 6프레임 | 미니 호랑이를 닮은 줄무늬. 집 안의 작은 맹수. |
| 145 | 싱가푸라 | `cat_singapura` | 고양이 | 1.1× | 특별 | 400 | `public/assets/pets/cat/cat_singapura/` | PNG 스프라이트 6프레임 | 세상에서 가장 작은 품종. 큰 눈망울의 요정 고양이. |
| 146 | 하바나브라운 | `cat_havanabrown` | 고양이 | 1.2× | 특별 | 400 | `public/assets/pets/cat/cat_havanabrown/` | PNG 스프라이트 6프레임 | 초콜릿빛 윤기나는 갈색 털에 초록 눈. 다정한 껌딱지. |
| 147 | 라가머핀 | `cat_ragamuffin` | 고양이 | 1.3× | 전설 | 800 | `public/assets/pets/cat/cat_ragamuffin/` | PNG 스프라이트 6프레임 | 안으면 축 늘어지는 복슬 장모. 순둥순둥 인형 고양이. |
| 148 | 구미호 | `fox_nine` | 여우 | 2.5× | exclusive | 50 | `public/assets/pets/fox/fox_nine/` | PNG 스프라이트 8프레임 | 아홉 개의 꼬리가 탐스러운 새하얀 구미호. 달빛 아래서 신비롭게 노닌다. |
<!-- @gen:end -->

## 이미지 폴더 구조

각 펫의 이미지 폴더(`public/assets/pets/<species>/<id>/` — 종별 하위폴더. 예: `cat/cat_mackerel/`, `tiger/tiger_orange/`)에는 **5개 PNG** 가 들어 있습니다.

```
public/assets/pets/<species>/<id>/
├─ walk.png    # 288×48 = 옆보기(east) 걷기 6프레임을 가로로 이은 스프라이트 시트
├─ south.png   # 48×48 정지 — 정면(앞)
├─ north.png   # 48×48 정지 — 뒷모습
├─ east.png    # 48×48 정지 — 오른쪽(옆)
└─ west.png    # 48×48 정지 — 왼쪽(옆)
```

- **걷기**는 `walk.png` 를 CSS `steps(6)` 으로 재생하며, 서쪽 이동은 `scaleX(-1)` 로 뒤집습니다(시트는 east 기준). **정지/가구에서 쉴 땐** 4방향 정지 PNG 중 하나(대개 `south`=정면)를 보여줍니다.
- 원본 PixelLab export zip 은 `public/assets/pets/_zips/` 에 보관하며(캐시·배포 대상 아님), 위 5개 PNG 만 앱이 사용합니다.
- 서비스워커 오프라인 캐시: `public/sw.js` 의 `APP_SHELL` 에 각 펫의 `walk.png` + 4방향 PNG 가 등록되어 있습니다.

## 코드 진입점 (어디서 이 이미지를 쓰나)

| 표시 위치 | 함수 | 무엇을 그리나 |
|---|---|---|
| 웹캠 dock·알뜰샵 홈 방(걸어다님) | `catActorHTML(id, h)` | `walk.png` 걷기 + 쉴 때 4방향 정지 |
| 상점 카드 썸네일 | `catFace(id, {h})` | `south.png`(정면) |
| 보유 펫 칩(집에 내보내기) | `catFace(id, {h})` | `south.png`(정면) |
| 뽑기(펫알) 오픈 결과 | `catFace(id, {h})` | `south.png`(정면) |

> 새 펫을 추가하는 방법과 규칙(zip→에셋 변환, id 작명, 코드 반영, east 옆걷기 확인)은 [pet-asset-pipeline.md](pet-asset-pipeline.md) 를 따르세요.
