# 🐾 펫 목록 (구현된 펫 전체)

현재 앱에 구현된 펫 목록입니다. 데이터 소스는 `public/js/cats.js` 의 `PET_CATALOG`(이름·종·가격·설명)·`CAT_TIER`(등급)·`PET_SPRITES`(아트)이며, **이 문서는 그 코드를 근거로 손으로 정리한 요약**입니다. 펫을 추가·수정하면 이 표도 함께 갱신하세요(추가 절차는 [pet-asset-pipeline.md](pet-asset-pipeline.md)).

- **총 <!--@gen:count-->16<!--@gen:end-->종** (전부 고양이 `cat`).
- **가격은 등급으로 자동 산정**됩니다: `TIER_PRICE = { 일반 50 · 고급 100 · 희귀 200 · 특별 400 · 전설 800 · 한정 1500 }` 을 `CAT_TIER` 기준으로 `PET_CATALOG.price` 에 적용.
- **아트**: <!--@gen:count2-->16<!--@gen:end-->종 전부 PixelLab **PNG 스프라이트 시트**(288×48, 옆보기 east 6프레임) + 정지 4방향(south/north/east/west). 시트가 없는 동물만 SVG 폴백을 씁니다(현재 해당 없음).

## 목록

| # | 이름 | id | 종 | 크기 | 등급 | 가격(은화) | 이미지 폴더 | 아트 | 설명 |
|---|---|---|---|---|---|---|---|---|---|
<!-- @gen:pet-list-table — 자동생성(tools/build_pets.py) -->
| 1 | 고등어 | `cat_mackerel` | 고양이 | 1× | 일반 | 50 | `public/assets/pets/cat_mackerel/` | PNG 스프라이트 6프레임 | 쿨그레이 줄무늬. 차분하게 방을 돌아다녀요. |
| 2 | 치즈 | `cat_cheese` | 고양이 | 1× | 고급 | 100 | `public/assets/pets/cat_cheese/` | PNG 스프라이트 6프레임 | 웜오렌지. 활발하게 뛰어다니는 개냥이. |
| 3 | 삼색 | `cat_calico` | 고양이 | 1× | 희귀 | 200 | `public/assets/pets/cat_calico/` | PNG 스프라이트 6프레임 | 검정·주황 어우러진 삼색(토터셸). 도도하게 창가에 앉아요. |
| 4 | 까망 | `cat_black` | 고양이 | 1× | 특별 | 400 | `public/assets/pets/cat_black/` | PNG 스프라이트 6프레임 | 노란 눈의 까만 고양이. 조용히 방을 지켜요. |
| 5 | 하양 | `cat_white` | 고양이 | 1× | 특별 | 400 | `public/assets/pets/cat_white/` | PNG 스프라이트 6프레임 | 파란 눈의 새하얀 고양이. 볕에서 낮잠을 즐겨요. |
| 6 | 복슬이 | `cat_fluffy` | 고양이 | 1× | 희귀 | 200 | `public/assets/pets/cat_fluffy/` | PNG 스프라이트 6프레임 | 복슬복슬한 털에 파란 눈. 나른하게 졸며 방을 거닐어요. |
| 7 | 턱시도 | `cat_tuxedo` | 고양이 | 1× | 전설 | 800 | `public/assets/pets/cat_tuxedo/` | PNG 스프라이트 6프레임 | 검은 정장에 하얀 셔츠·발. 단정하게 걸어다녀요. |
| 8 | 카오스 | `cat_chaos` | 고양이 | 1× | 전설 | 800 | `public/assets/pets/cat_chaos/` | PNG 스프라이트 6프레임 | 다크그레이+브라운 소용돌이 무늬. 종잡을 수 없이 쏘다녀요. |
| 9 | 샴 | `cat_siamese` | 고양이 | 1× | 전설 | 800 | `public/assets/pets/cat_siamese/` | PNG 스프라이트 6프레임 | 크림빛 몸에 짙은 포인트. 우아하게 방을 누벼요. |
| 10 | 벵갈 | `cat_bengal` | 고양이 | 1× | 고급 | 100 | `public/assets/pets/cat_bengal/` | PNG 스프라이트 6프레임 | 골든빛 몸에 동글동글 반점. 야무지게 돌아다녀요. |
| 11 | 폴드 | `cat_fold` | 고양이 | 1× | 희귀 | 200 | `public/assets/pets/cat_fold/` | PNG 스프라이트 6프레임 | 접힌 귀가 매력. 얌전히 자리를 지켜요. |
| 12 | 보라 | `cat_bora` | 고양이 | 1× | 특별 | 400 | `public/assets/pets/cat_bora/` | PNG 스프라이트 6프레임 | 한쪽은 파랑·한쪽은 호박색 오드아이. 신비롭게 거닐어요. |
| 13 | 초코 | `cat_choco` | 고양이 | 1× | 고급 | 100 | `public/assets/pets/cat_choco/` | PNG 스프라이트 6프레임 | 초콜릿빛 갈색 털에 크림색 입가·가슴. 느긋하게 방을 거닐어요. |
| 14 | 아깽이 | `cat_kitten` | 고양이 | 0.5× | 일반 | 50 | `public/assets/pets/cat_kitten/` | PNG 스프라이트 6프레임 | 치즈빛 오렌지 태비 아기고양이. 뒤뚱뒤뚱 방을 쏘다녀요. |
| 15 | 스핑크스 | `cat_pink` | 고양이 | 1× | 전설 | 800 | `public/assets/pets/cat_pink/` | PNG 스프라이트 6프레임 | 털 없는 분홍빛 주름 피부. 도도하게 방을 누벼요. |
| 16 | 고랑이 | `tiger_orange` | 호랑이 | 5× | 한정 | 1500 | `public/assets/pets/tiger_orange/` | PNG 스프라이트 6프레임 | 볼드한 검은 줄무늬의 오렌지 호랑이. 위풍당당하게 방을 누벼요. |
<!-- @gen:end -->

## 이미지 폴더 구조

각 펫의 이미지 폴더(`public/assets/pets/<id>/`)에는 **5개 PNG** 가 들어 있습니다.

```
public/assets/pets/<id>/
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
