# 🐾 Pet Asset Pipeline (PixelLab zip → dock 적용)

사용자가 `public/assets/pets/_zips/`에 PixelLab **Character export** zip을 넣으면, 아래 절차로 **네발 동물**(고양이·강아지·토끼 등) 걷기/쉬기 에셋을 자동 처리한다. 종에 무관하게 **구조·로직은 동일**하다(고양이 전용이던 규칙을 일반화). 아트 방식은 **PNG 스프라이트 시트 + CSS `steps()`** 로 확정.

## 트리거
- `public/assets/pets/_zips/` 에 새 `*.zip`이 추가되거나, 사용자가 "이 동물(zip) 추가해줘"라고 하면 실행.
- `_zips/`는 원본 보관용이며 **APP_SHELL 캐시에 넣지 않는다.**

## 🚀 자동 파이프라인 (권장) — `tools/build_pets.py`
**단일 소스 = `tools/pets.json`**(레지스트리). 이 스크립트가 zip→에셋 생성 + `cats.js`(PET_CATALOG·PET_SPRITES·CAT_TIER) + `sw.js`(APP_SHELL·CACHE_VERSION) + 문서(이 표·`pet-list.md`·`features.md` 마릿수)를 **@gen 마커 사이만** 자동 재생성한다(그 밖은 손대지 않음). 아래 흐름이면 손편집이 **이름·등급 한 줄**뿐이다.

```
1) public/assets/pets/_zips/ 에 zip 넣기
2) python tools/build_pets.py     # 에셋 생성 + pets.json 에 stub 추가, "확정 필요" 출력
3) tools/pets.json 에서 그 항목의 name·tier·scale(·desc) 확정
4) python tools/build_pets.py     # cats.js·sw.js·문서 자동 갱신 + CACHE_VERSION 상향
5) 커밋
```
- `--force` 에셋 강제 재생성 / `--check` 생성 결과가 현재와 다르면 종료코드 1(수정 안 함, 사전점검용).
- `price`는 넣지 않는다(= `tier`+`TIER_PRICE`로 파생). `frontWalk`는 zip에 `Walk/east`가 없으면 스크립트가 자동 `true` 설정.
- **`scale`(크기 배율, 기본 1.0 = 고양이 기준)**: 종별 몸집을 반영한다(예: 호랑이 `5`, 곰 `4`, 강아지 `1.5`, 토끼 `0.8`, 거북이 `0.9`, 새 `0.6`). `PET_SPRITES[id].scale`로 생성되고 `petScale()`이 읽는다. **걷는 무대(웹캠 dock 방·알뜰샵 홈 방)에서 렌더 높이 = 기준높이 × scale**로 반영(무대 밖으로 안 나가게 상한 클램프 — dock 96px·홈 200px). 상점/보유칩/뽑기 썸네일은 초상 프레임이라 균일 유지. 새 stub은 `scale:1`로 생기니 큰 동물이면 값만 올린다.
- 폐기된 원본 zip(펫으로 만들지 않을 것)은 `pets.json`의 `ignoreZips`에 넣어 인제스트에서 제외한다.
- `id`는 RTDB 저장 키다. stub의 제안 id를 바꾸려면 **에셋 생성 전에**(2단계 출력 후) `pets.json`의 `id`를 고치고 폴더명도 맞춘 뒤 재실행(하위호환은 `PET_ID_MIGRATE`).
- `CAT_PALS`(SVG 폴백 팔레트)·`PET_ID_MIGRATE`는 스프라이트 없는 펫/‑id 변경 시에만 쓰는 **수동 유지** 항목(마커 밖).

> 아래 "zip 규격 / 산출물 / 체크리스트"는 스크립트가 내부적으로 수행하는 내용의 설명이자, 스크립트 없이 수동으로 할 때의 폴백이다.

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
`public/assets/pets/<species>/<id>/` (종별 하위폴더 — 고양이는 `cat/`, 호랑이는 `tiger/`, 강아지는 `dog/` …) 에:
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

## id·이름 매핑 (종·색 구분)
zip 파일명은 길고 자동생성이므로 짧은 **slug id**를 부여한다. id는 **`<species>_<색·품종>`** 형태로 종이 구분되게 짓는다(예: `cat_calico`, `dog_corgi`, `rabbit_lop`). 이 표를 유지한다.

- **표시 이름(`PET_CATALOG.name`)은 zip 파일명·`metadata.json`의 캐릭터 설명을 근거로 개발자가 센스껏 짓는다**(한국어, 2~4자 권장, 기존 이름과 겹치지 않게). 사용자가 이름을 따로 지정하지 않으면 이 방식으로 자동 작명한다. 예: `white cat, fluffy fur` → `복슬이`.
- **품종(샴·벵갈·코숏 등)은 더 이상 데이터·UI에 넣지 않는다.** 상점 카드의 분류 태그는 품종이 아니라 **종(species) 라벨**(`SPECIES_LABEL`: cat→`고양이`, dog→`강아지`, rabbit→`토끼`)만 표시한다. (구 `PET_CATALOG.breed` 필드는 제거됨.)

| zip 파일명 | id | name | 비고 |
|---|---|---|---|
<!-- @gen:pet-idtable — 자동생성(tools/build_pets.py). 상세 설명은 pet-list.md 참고 -->
| simple_pixel_art_cat_grey_mackerel_tabby_with_dark.zip | `cat_mackerel` | 고등어 | Walk/east 옆걷기 정상 |
| simple_pixel_art_cat_orange_tabby_chubby_with_crea.zip | `cat_cheese` | 치즈 | Walk/east 옆걷기 정상 |
| chibi_pixel_art_tortoiseshell_cat_mixed_black_and.zip | `cat_calico` | 삼색 | Walk/east 옆걷기 정상 |
| simple_pixel_art_cat_black_yellow_eyes_extra_round.zip | `cat_black` | 까망 | Walk/east 옆걷기 정상 |
| chibi_pixel_art_white_cat_pale_blue_eyes_sleepy_fa.zip | `cat_white` | 하양 | Walk/east 옆걷기 정상 |
| simple_pixel_art_white_cat_fluffy_fur_pale_blue_ey.zip | `cat_fluffy` | 복슬이 | Walk/east 옆걷기 정상 |
| simple_pixel_art_tuxedo_cat_black_body_with_white.zip | `cat_tuxedo` | 턱시도 | Walk/east 옆걷기 정상 |
| simple_pixel_art_chaos_cat_dark_grey_and_brown_swir.zip | `cat_chaos` | 카오스 | Walk/east 옆걷기 정상 |
| chibi_pixel_art_siamese_cat_cream_body_with_dark_fa.zip | `cat_siamese` | 샴 | Walk/east 옆걷기 정상 |
| chibi_pixel_art_golden_cat_a_few_simple_round_spot.zip | `cat_bengal` | 황토 | Walk/east 옆걷기 정상 |
| chibi_pixel_art_grey_cat_small_folded-down_ears_ro.zip | `cat_fold` | 폴드 | Walk/east 옆걷기 정상 |
| chibi_pixel_art_white_cat_one_blue_eye_one_amber_e.zip | `cat_bora` | 보라 | Walk/east 옆걷기 정상 |
| simple_pixel_art_chocolate_brown_cat_cream_muzzle.zip | `cat_choco` | 초코 | Walk/east 옆걷기 정상 |
| simple_pixel_art_orange_tabby_kitten_a_few_cheese.zip | `cat_kitten` | 아깽이 | Walk/east 옆걷기 정상 |
| simple_pixel_art_pink_sphynx_cat_hairless_wrinkled.zip | `cat_pink` | 스핑크스 | Walk/east 옆걷기 정상 |
| simple_pixel_art_orange_tiger_bold_black_stripes_c.zip | `tiger_orange` | 고랑이 | Walk/east 옆걷기 정상 |
| (정적 승격) | `lion_mane` | 갈기냥 | Walk/east 옆걷기 정상 |
| (정적 승격) | `cat_persian` | 펠시안 | Walk/east 옆걷기 정상 |
| (정적 승격) | `tiger_white` | 백호 | Walk/east 옆걷기 정상 |
| (정적 승격) | `cat_russianblue` | 러시안블루 | Walk/east 옆걷기 정상 |
| (정적 승격) | `cat_bengal2` | 벵갈 | Walk/east 옆걷기 정상 |
<!-- @gen:end -->

새 zip이 오면: 사용자가 id를 지정하면 그걸 쓰고, 없으면 종·색에서 합리적 slug(`<species>_<색>`)를 만들어 **이 표에 한 줄 추가**하고, 이름은 위 규칙대로 센스껏 짓는다.

### ⚠️ 옆걷기(east) 없는 펫 — 이미지 재취득 대상
`animations/Walk/east`(옆보기 걷기)가 **없는** zip은 `walk.png`가 정면이 되어 `frontWalk:true`로 처리(이동 중 옆 정지스틸만 보이고 걷기 애니 없음). 그런 펫은 옆걷기 포함 zip으로 다시 받아 재생성하고 `frontWalk`를 해제한다.

**현재 재취득 대상: 없음** — <!--@gen:cats-count-->21<!--@gen:end-->종 전부 `Walk/east` 옆걷기 보유. (과거 `cat_white`가 south만 있었으나 east 시트로 재취득 완료.) 새 펫 추가 시 east 유무를 확인해 이 목록을 갱신한다.

## ✅ 펫 추가 체크리스트 (에셋만 넣고 끝내지 말 것 — 코드+문서 함께 반영)
> **규칙**: 펫을 추가/변경/제거하면 아래 코드 **3곳**과 문서 **3곳**을 같은 커밋에서 모두 갱신한다. 하나라도 빠지면 미완성으로 본다. (이 규칙은 `CLAUDE.md`의 "문서 최신화 규칙" 표 — *기능 추가·변경·제거 → features.md*, *모든 사용자 체감 변경 → CHANGELOG* — 의 펫 전용 상세판이다.)

**코드**
1. `js/cats.js` `PET_SPRITES`에 `<id>:{ walk:'assets/pets/<species>/<id>/walk.png', frames:6, stills:true }` 추가(옆걷기 없으면 `frontWalk:true`, 고양이보다 크면 `scale:<배율>`). 정지 4방향 경로는 `sprStills()`가 이 `walk` 경로에서 파생하므로 walk만 맞으면 됨.
   - `PET_CATALOG`에 `{ id, species, name, price, desc }` 한 줄 추가(이름은 zip 내용 기반 센스껏, 품종은 안 넣음).
   - `CAT_TIER`에 `<id>:'<등급>'` 추가(가격은 `TIER_PRICE`로 자동 산정). SVG 폴백이 필요하면 `CAT_PALS[<id>]`.
2. `sw.js` `APP_SHELL`에 `assets/pets/<species>/<id>/`의 `walk.png` + `south/north/east/west.png`(4방향) 추가 → `CACHE_VERSION` 상향. (`_zips/`·원본 zip은 캐시에 넣지 않음)

**문서 (필수 — 빠뜨리지 말 것)**
3. **이 문서(`pet-asset-pipeline.md`)**: 위 **id·이름 매핑 표에 한 줄 추가**, 종 수(`N종`) 갱신, 옆걷기 없는 펫이면 "재취득 대상" 목록에도 반영.
4. `docs/features.md`: **동물 목록·마릿수** 갱신(`알뜰샵` 절의 "고양이 N종(…)").
5. `docs/CHANGELOG.md` `[Unreleased]`에 **추가/변경 한 줄** 기록(+ `sw.js` 버전 표기).

## ★ 모든 표시 위치에 일관 적용 (필수)
동물 아트는 **정해진 두 진입 함수만** 거치게 해서, 새 동물을 추가하거나 아트를 바꿔도 **dock·방·상점·보유목록·뽑기 결과 어디서나 자동으로 같은 그림**이 나오게 한다. 개별 화면에서 `catFront`/`catSide`를 직접 부르지 말 것.

| 표시 위치 | 진입 함수 | 스프라이트 동물 | SVG 동물 |
|---|---|---|---|
| dock 스트립·알뜰샵 홈 방(걸어다님) | `catActorHTML(id,h)` | `walk.png` steps() 걷기 + 쉴 때 4방향 정지 | SVG 옆/포즈 |
| 상점 카드 썸네일 | `catFace(id,{h})` | `south.png`(정면) | `catFront` SVG |
| 보유 동물 칩(집에 내보내기) | `catFace(id,{h})` | `south.png`(정면) | `catFront` SVG |
| 뽑기(펫알) 오픈 결과 | `catFace(id,{h})` | `south.png`(정면) | `catFront` SVG |

- **걷는 표시**는 `catActorHTML`, **정지 정면 썸네일**은 `catFace`가 `hasSprite(id)`로 PNG/SVG를 자동 분기한다.
- ⚠️ **CSS `--sheet`/`--idle`에 넣는 스프라이트 경로는 반드시 절대 URL**(`assetUrl()` = `new URL(p, document.baseURI).href`)로 만든다. 상대경로(`assets/pets/…`)를 그대로 넣으면 `styles.css`의 `background-image:var(--sheet)`가 **스타일시트 위치(`/css/`) 기준**으로 해석해 `/css/assets/…` 404 → 고양이가 안 보인다.
- 새 표시 위치를 만들 때도 이 둘 중 하나를 쓴다. `catFace` PNG는 `.catpx`(pixelated) `<img>`로 렌더된다.
- (함수 이름에 `cat`이 남아 있는 건 역사적 이유. 대상은 모든 네발 동물이다.)

## id 변경 시 하위호환
`PET_CATALOG`의 `id`는 RTDB 저장 키(`users/{uid}/game/owned/cats/<id>`, `home/active[]`)다. id를 바꾸면 기존 사용자 데이터가 끊기므로, `js/cats.js`의 `PET_ID_MIGRATE`(구 id→신 id)에 매핑을 추가하고 `normalizeGame`이 읽을 때 자동 이관한다(다음 쓰기에서 영구 반영). 예: `mackerel → cat_mackerel`.

## 런타임 펫 vs 정적 펫 — 지연 로딩 & 정적 승격
런타임 펫(앱 dev 업로드)과 정적 펫(이 파이프라인)은 **별개 트랙**이다.
- **정적 펫**: `public/assets/pets/<species>/<id>/` 파일 + SW 캐시 → **RTDB 비용 0**. 공식/영구 펫은 정적으로 둔다. (폴더는 종별로 나뉜다 — `cat/`·`tiger/`·`dog/` …)
- **런타임 펫**: 이미지가 RTDB에 들어간다. **메타는 `catalogPets/{id}`, 스프라이트는 `catalogPetArt/{id}`(base64)로 분리** 저장되고, 앱 시작 땐 메타만 받는다. 실제로 보이는 펫만 `ensurePetArt(id)`가 `catalogPetArt/{id}`를 **`.once`로 1회** 받아 세션 캐시(`_petArt`)에 담고 스프라이트에 반영한다(초기 로딩·편집 시 전체 재푸시 부담을 없앰). 로딩 전에는 도트 알 플레이스홀더를 보여준다.
- 구 레코드(인라인 `walk/south/…`)는 개발자 화면의 **"이미지 분리 이전(1회)"**(`migrateCatalogArtOnce`)로 `catalogPetArt`로 옮긴다(멱등).

### 런타임 → 정적 승격(확정 펫)
수십 마리로 늘면 RTDB가 커지므로, 디자인이 확정된 런타임 펫은 정적으로 옮긴다.
1. 개발자 펫 관리에서 런타임 펫 선택 → **"정적 승격 내보내기"**(`exportPetStatic`): `walk/south/north/east/west.png` 5장을 내려받고, `pets.json` 항목·`PET_ID_MIGRATE` 한 줄 스니펫을 보여준다.
2. `public/assets/pets/<species>/<static_id>/`에 5장 배치 → `tools/pets.json` `pets`에 스니펫 추가(`"zip":""`) → `PET_ID_MIGRATE`에 `rt_xxx: '<static_id>'` 추가(소유자 이관).
3. `python tools/build_pets.py` 실행 → 에셋이 이미 있어 `gen_assets`는 건너뛰고 카탈로그·스프라이트·등급·`sw.js`·문서·`CACHE_VERSION`을 자동 갱신 → 커밋 → 배포.
4. 배포 확인 후 앱에서 그 **런타임 레코드 삭제**(`catalogPets/{id}`+`catalogPetArt/{id}`). `migratePetIds`가 소유자의 `rt_xxx`를 `<static_id>`로 리맵해 방/보유가 유지된다.
5. 승격 펫은 자동 CHANGELOG 줄이 안 붙으므로 `docs/CHANGELOG.md`에 수동으로 한 줄 추가한다.

### 주간 자동 정리 — 트리거 문구 **"펫 정리해줘"** (오케스트레이터 `tools/pet_maint.mjs`)
개발자는 **앱에서 런타임 펫을 추가/수정/삭제만** 하고, 위 수동 5단계를 직접 하지 않는다. 주기적으로(약 주 1회) 담당자에게 **"펫 정리해줘"** 라고 하면, 위 5단계를 묶은 **오케스트레이터 `tools/pet_maint.mjs`** 의 4개 서브커맨드로 처리한다. RTDB 접근을 위해 **`firebase login`이 한 번** 돼 있어야 한다(프로젝트 소유 계정 → 규칙 무시 read/remove). 대상은 코드 상수(`PROJECT`=`money-bb658`, `PROD_URL`=dev 배포 URL, `EGG_FB_PROJECT`/`EGG_PROD_URL` 로 오버라이드)로 박아 두어 매번 정할 필요가 없다. Windows 게토(Git Bash MSYS 경로변환·python cp949)는 도구가 **Node 자식프로세스+`PYTHONIOENCODING`으로 내부 처리**하므로 그냥 `node`로 실행하면 된다.

```
1) node tools/pet_maint.mjs pull      # RTDB(catalogPets/catalogPetArt) 덤프 → 분류 리포트 + _sync/plan.json 템플릿 생성
2) (검토) _sync/plan.json: promote 의 id 를 의미있는 <species>_<slug> 로, 새 종이면 speciesLabels 라벨·desc 채움
3) node tools/pet_maint.mjs apply      # PNG 종별폴더 편입 + pets.json 병합 + 오버라이드 반영 + 새 종 라벨(pets.json·cats.js) + PET_ID_MIGRATE + build_pets.py + _sync/cleanup.json
4) npm test → git 커밋·푸시(dev 자동배포) + CHANGELOG 한 줄
5) node tools/pet_maint.mjs verify     # 프로덕션 sw 버전·새 PNG(200) 확인 (빌드 1~2분)
6) node tools/pet_maint.mjs cleanup     # 배포 확인 후 _sync/cleanup.json 의 RTDB 레코드 삭제(비가역)
```

- **분류(자동, `pull`)**: `rt_*`(활성·이미지 있음)=**승격 대상**, `rt_*`+`deleted`=**soft-delete**(자동 삭제 안 함 — 소유자 보호), 정적 id(비-rt_)=**오버라이드**(앱에서 정적 펫을 편집한 것 → `pets.json` 대비 바뀐 필드만 자동 산출). 새 종(speciesLabel 없음)은 리포트로 경고하고 `plan.json`에 라벨칸을 비워 둔다.
- **plan.json 스키마**: `{ promote:{ rt_id:{id,species,name,tier,scale,desc} }, overrides:{ static_id:{name?,tier?,scale?} }, speciesLabels:{ 새종:"" }, softDeleted:[...] }`. 검토 단계는 보통 **promote 의 id 를 의미있는 slug 로 바꾸고(예 `cat_xxxxx`→`cat_persian`), 새 종 라벨 채우는 정도**뿐.
- `apply` 는 멱등(재실행 안전), `PET_ID_MIGRATE`/`SPECIES_LABEL` 중복 방지. 이미지가 `catalogPetArt` 없이 `catalogPets` 인라인이어도 처리한다. 승격 펫은 자동 CHANGELOG가 안 붙으니 4단계에서 한 줄 추가.
- `cleanup` 은 `_sync/cleanup.json`(승격된 `rt_*`의 catalogPets/catalogPetArt + 반영한 오버라이드 정적 id)만 지운다. `migratePetIds`가 소유자 `rt_*`→`<static_id>`를 리맵해 방/보유 유지. **soft-delete 펫은 여기 안 들어간다**(소유자 있으면 깨질 수 있어 별도 확인 후 수동 purge).

## 걷기/쉬기 상태 (cats.js 통합 엔진)
스프라이트 동물은 단일 rAF 엔진(`catLoop`/`stepActors`)의 액터로 배치되어 두 상태를 오간다.
- **걷기(roam/goal)**: `.cspr`(한 프레임 창, `overflow:hidden`) 안쪽 필름 `.csprf`(288×48 스트립)를 CSS `steps(6)` + `transform:translateX`(`@keyframes csprFilm`)로 밀어 재생하며 좌우 이동. 서쪽 이동이면 `scaleX(-1)`로 뒤집음(시트는 east 기준).
  - ⚠️ **깜빡임 방지 핵심**: 걷는 액터는 이동·프레임전환을 **전부 `transform`(합성)** 으로 한다. `background-position` 프레임 애니는 **금지**(합성 안 되고 매 프레임 메인스레드 리페인트 → 이동 페인트와 경쟁해 iOS/크롬에서 프레임 드롭·"순간 사라짐" 발생). 액터 위치는 `setXform`이 `translate3d`로만 옮기고 `left`/`top`은 건드리지 않는다.
- **쉬기(pause)**: `enterPose`/`enterInteract`에서 `stills` 4방향(south=앞/north=뒤/east=우/west=좌) 중 하나를 `--idle`에 지정하고 `.cspr.idle`로 필름을 숨긴 뒤 그 스틸을 창 배경으로 보여줌. 정지 이미지는 이미 올바른 방향이라 **플립하지 않음**(`scaleX(1)`).
- **reduced-motion**: `catActorHTML`이 처음부터 `.idle`(south=앞)로 고정, 이동·걷기 정지.

## 규격 상수
- 프레임 48px, 6프레임, 시트폭 288px. 걷기 duration 0.72s (`styles.css`의 `.csprf` `csprFilm`과 일치).
