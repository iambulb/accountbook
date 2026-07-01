# 🐾 Pet Asset Pipeline (PixelLab zip → dock 적용)

사용자가 `public/assets/pets/_zips/`에 PixelLab **Character export** zip을 넣으면, 아래 절차로 **네발 동물**(고양이·강아지·토끼 등) 걷기/쉬기 에셋을 자동 처리한다. 종에 무관하게 **구조·로직은 동일**하다(고양이 전용이던 규칙을 일반화). 아트 방식은 **PNG 스프라이트 시트 + CSS `steps()`** 로 확정.

## 트리거
- `public/assets/pets/_zips/` 에 새 `*.zip`이 추가되거나, 사용자가 "이 동물(zip) 추가해줘"라고 하면 실행.
- `_zips/`는 원본 보관용이며 **APP_SHELL 캐시에 넣지 않는다.**

## zip 규격 (PixelLab export v3)
```
<folder>/rotations/{south,north,east,west}.png     # 48×48 정지 4방향
<folder>/animations/Walk/east/frame_000..005.png   # 48×48 걷기 6프레임(east 기준, 있을 때만)
metadata.json                                       # size/frames/directions 정보
```
- 규격은 `metadata.json`의 `size`(48×48)를 신뢰. 없으면 48px로 가정.
- `animations.Walk.east`가 있으면 그 6프레임으로 `walk.png`를 만든다. **없으면**(rotations만 있는 zip) 기존 `walk.png`가 있으면 유지, 없으면 사용자에게 걷기 시트를 요청.
- 걷기 폴더 이름이 `Walk`가 아니라 **`Walk-<hash>`** 로 나오기도 하고(예 턱시도), 한 zip에 `Walk/south`와 `Walk-<hash>/east`가 함께 있을 수 있다 → **east(옆보기)를 우선** 사용. rotations도 4방향 외 대각선(north-east 등)이 더 있을 수 있으나 **south/north/east/west 4장만** 쓴다.
- 중복 상태(`<folder>_2`, "(copy)")는 무시하고 **primary(첫 상태)만** 사용.
- ⚠️ 일부 템플릿(예 chibi)은 걷기 프레임이 `Walk/east`가 아니라 `Walk/south` 등 **다른 방향**으로 나온다. 스프라이트 엔진은 east(옆) 기준으로 좌우 이동·플립하므로, east가 없으면 방향을 확인해 별도 처리(옆 걷기 시트 필요)하거나 사용자에게 알린다.

## 산출물
`public/assets/pets/<id>/` 에:
- `walk.png` = Walk/east 6프레임을 가로로 이은 **288×48** 시트 (east 기준, 투명 보존)
- `south.png / north.png / east.png / west.png` = `rotations/` 그대로 복사(정지 4방향)

생성은 ImageMagick이 없을 수 있으므로 **Python PIL** 사용:
```python
from PIL import Image
sheet=Image.new("RGBA",(48*6,48),(0,0,0,0))
for i in range(6):
    sheet.paste(Image.open("Walk/east/frame_%03d.png"%i).convert("RGBA"),(i*48,0))
sheet.save("walk.png")   # rotations 4장은 그대로 복사
```

## id 매핑 (종·색 구분)
zip 파일명은 길고 자동생성이므로 짧은 **slug id**를 부여한다. id는 **`<species>_<색·품종>`** 형태로 종이 구분되게 짓는다(예: `cat_calico`, `dog_corgi`, `rabbit_lop`). 이 표를 유지한다.

| zip 파일명 | id | species |
|---|---|---|
| simple_pixel_art_cat_grey_mackerel_tabby_with_dark.zip | `cat_mackerel` | cat |
| simple_pixel_art_cat_orange_tabby_chubby_with_crea.zip | `cat_cheese` | cat |
| chibi_pixel_art_white_cat_pale_blue_eyes_sleepy_fa.zip | `cat_white` | cat (Walk이 east 없이 south만 있어 정면 걷기 시트로 구성) |
| simple_pixel_art_tuxedo_cat_black_body_with_white.zip | `cat_tuxedo` | cat (8방향 rotations + `Walk-<hash>/east` 옆걷기 → 정상 옆보기 시트) |
| simple_pixel_art_calico_cat_white_with_orange_three.zip | `cat_calico` | cat (8방향 rotations + `Walk/east` 옆걷기 → 기존 SVG 삼색을 스프라이트로 교체) |
| simple_pixel_art_cat_black_yellow_eyes_extra_round.zip | `cat_black` | cat (`Walk/east` 옆걷기 + 4방향 → 기존 SVG 까망을 스프라이트로 교체) |
| imple_pixel_art_chaos_cat_dark_grey_and_brown_swir.zip | `cat_chaos` | cat (신규 · `Walk/east` 옆걷기 + 8방향 rotations) |

새 zip이 오면: 사용자가 id를 지정하면 그걸 쓰고, 없으면 종·색에서 합리적 slug(`<species>_<색>`)를 만들어 **이 표에 한 줄 추가**한다.

## 코드 반영 (에셋만 넣고 끝내지 말 것)
1. `js/cats.js`의 `PET_SPRITES`에 `<id>:{ walk:'assets/pets/<id>/walk.png', frames:6, stills:true }` 추가.
   - 카탈로그(구매용 이름/가격/**species**)는 별도 `PET_CATALOG`에 있음. 신규 동물이면 `{ id:'<id>', species:'<cat|dog|rabbit…>', name, price, desc }` 한 줄 추가.
   - SVG 폴백 팔레트가 필요하면 `CAT_PALS[<id>]`도 추가(스프라이트만 쓸 경우 불필요).
2. `sw.js` `APP_SHELL`에 `assets/pets/<id>/` 의 `walk.png` + `south/north/east/west.png`(4방향)를 추가 → `CACHE_VERSION` 상향.
   (단, `_zips/`와 원본 zip은 캐시에 넣지 않음)
3. `docs/features.md` 동물 목록 갱신, `docs/CHANGELOG.md` `[Unreleased]`에 기록.

## ★ 모든 표시 위치에 일관 적용 (필수)
동물 아트는 **정해진 두 진입 함수만** 거치게 해서, 새 동물을 추가하거나 아트를 바꿔도 **dock·방·상점·보유목록·뽑기 결과 어디서나 자동으로 같은 그림**이 나오게 한다. 개별 화면에서 `catFront`/`catSide`를 직접 부르지 말 것.

| 표시 위치 | 진입 함수 | 스프라이트 동물 | SVG 동물 |
|---|---|---|---|
| dock 스트립·알뜰샵 홈 방(걸어다님) | `catActorHTML(id,h)` | `walk.png` steps() 걷기 + 쉴 때 4방향 정지 | SVG 옆/포즈 |
| 상점 카드 썸네일 | `catFace(id,{h})` | `south.png`(정면) | `catFront` SVG |
| 보유 동물 칩(집에 내보내기) | `catFace(id,{h})` | `south.png`(정면) | `catFront` SVG |
| 뽑기(펫알) 오픈 결과 | `catFace(id,{h})` | `south.png`(정면) | `catFront` SVG |

- **걷는 표시**는 `catActorHTML`, **정지 정면 썸네일**은 `catFace`가 `hasSprite(id)`로 PNG/SVG를 자동 분기한다.
- 새 표시 위치를 만들 때도 이 둘 중 하나를 쓴다. `catFace` PNG는 `.catpx`(pixelated) `<img>`로 렌더된다.
- (함수 이름에 `cat`이 남아 있는 건 역사적 이유. 대상은 모든 네발 동물이다.)

## id 변경 시 하위호환
`PET_CATALOG`의 `id`는 RTDB 저장 키(`users/{uid}/game/owned/cats/<id>`, `home/active[]`)다. id를 바꾸면 기존 사용자 데이터가 끊기므로, `js/cats.js`의 `PET_ID_MIGRATE`(구 id→신 id)에 매핑을 추가하고 `normalizeGame`이 읽을 때 자동 이관한다(다음 쓰기에서 영구 반영). 예: `mackerel → cat_mackerel`.

## 걷기/쉬기 상태 (cats.js 통합 엔진)
스프라이트 동물은 단일 rAF 엔진(`catLoop`/`stepActors`)의 액터로 배치되어 두 상태를 오간다.
- **걷기(roam/goal)**: `walk.png`를 CSS `steps(6)`로 재생하며 좌우 이동. 서쪽 이동이면 `scaleX(-1)`로 뒤집음(시트는 east 기준).
- **쉬기(pause)**: `enterPose`에서 `stills` 4방향(south=앞/north=뒤/east=우/west=좌) 중 하나를 무작위로 `--idle`에 지정하고 `.cspr.idle`로 애니메이션을 끔. 정지 이미지는 이미 올바른 방향이라 **플립하지 않음**(`scaleX(1)`).
- **reduced-motion**: `catActorHTML`이 처음부터 `.idle`(south=앞)로 고정, 이동·걷기 정지.

## 규격 상수
- 프레임 48px, 6프레임, 시트폭 288px. 걷기 duration 0.72s (`styles.css`의 `.cspr` `csprWalk`와 일치).
