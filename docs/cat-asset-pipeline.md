# 🐈 Cat Asset Pipeline (PixelLab zip → dock 적용)

사용자가 `public/assets/cats/_zips/`에 PixelLab **Character export** zip을 넣으면, 아래 절차로 고양이 걷기/쉬기 에셋을 자동 처리한다. 아트 방식은 **PNG 스프라이트 시트 + CSS `steps()`** 로 확정(SVG 매트릭스 방식 폐기).

## 트리거
- `public/assets/cats/_zips/` 에 새 `*.zip`이 추가되거나, 사용자가 "이 고양이(zip) 추가해줘"라고 하면 실행.
- `_zips/`는 원본 보관용이며 **APP_SHELL 캐시에 넣지 않는다.**

## zip 규격 (PixelLab export v3)
```
<folder>/rotations/{south,north,east,west}.png     # 48×48 정지 4방향
<folder>/animations/Walk/east/frame_000..005.png   # 48×48 걷기 6프레임(east 기준, 있을 때만)
metadata.json                                       # size/frames/directions 정보
```
- 규격은 `metadata.json`의 `size`(48×48)를 신뢰. 없으면 48px로 가정.
- `animations.Walk.east`가 있으면 그 6프레임으로 `walk.png`를 만든다. **없으면**(rotations만 있는 zip) 기존 `walk.png`가 있으면 유지, 없으면 사용자에게 걷기 시트를 요청.
- 중복 상태(`<folder>_2`, "(copy)")는 무시하고 **primary(첫 상태)만** 사용.

## 산출물
`public/assets/cats/<id>/` 에:
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

## id 매핑
zip 파일명은 길고 자동생성이므로 짧은 **slug id**를 부여하고 이 표를 유지한다.

| zip 파일명 | id |
|---|---|
| simple_pixel_art_cat_grey_mackerel_tabby_with_dark.zip | `mackerel` |
| simple_pixel_art_cat_orange_tabby_chubby_with_crea.zip | `cheese` |

새 zip이 오면: 사용자가 id를 지정하면 그걸 쓰고, 없으면 품종/색에서 합리적 slug를 만들어 **이 표에 한 줄 추가**한다.

## 코드 반영 (에셋만 넣고 끝내지 말 것)
1. `js/cats.js`의 `CAT_SPRITES`에 `<id>:{ walk:'assets/cats/<id>/walk.png', frames:6, stills:true }` 추가.
   - 카탈로그(구매용 이름/가격)는 별도 `CAT_CATALOG`에 있음. 신규 고양이면 거기도 추가.
2. `sw.js` `APP_SHELL`에 `assets/cats/<id>/` 의 `walk.png` + `south/north/east/west.png`(4방향)를 추가 → `CACHE_VERSION` 상향.
   (단, `_zips/`와 원본 zip은 캐시에 넣지 않음)
3. `docs/features.md` 고양이 목록 갱신, `docs/CHANGELOG.md` `[Unreleased]`에 기록.

## 걷기/쉬기 상태 (cats.js 통합 엔진)
스프라이트 고양이는 단일 rAF 엔진(`catLoop`/`stepActors`)의 액터로 배치되어 두 상태를 오간다.
- **걷기(roam/goal)**: `walk.png`를 CSS `steps(6)`로 재생하며 좌우 이동. 서쪽 이동이면 `scaleX(-1)`로 뒤집음(시트는 east 기준).
- **쉬기(pause)**: `enterPose`에서 `stills` 4방향(south=앞/north=뒤/east=우/west=좌) 중 하나를 무작위로 `--idle`에 지정하고 `.cspr.idle`로 애니메이션을 끔. 정지 이미지는 이미 올바른 방향이라 **플립하지 않음**(`scaleX(1)`).
- **reduced-motion**: `catActorHTML`이 처음부터 `.idle`(south=앞)로 고정, 이동·걷기 정지.

## 규격 상수
- 프레임 48px, 6프레임, 시트폭 288px. 걷기 duration 0.72s (`styles.css`의 `.cspr` `csprWalk`와 일치).
