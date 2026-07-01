# 클로드코드 지시 — 고양이 4방향(쉬기/방향보기) 적용 + zip 자동처리 규칙화

이번 작업은 세 가지다.
1. **동작 확장**: 고양이가 계속 걷지 않고, 멈춰서 **앞(정면)·뒤(후면)·옆**을 보며 쉬는 상태를 추가.
2. **소급 재작업**: 이미 들어간 **고등어(mackerel)** 도 이 방식으로 다시 구성(현재는 걷기만).
3. **규칙화**: 앞으로 사용자가 PixelLab **zip만 넣으면** 클로드코드가 자동으로 처리하도록
   `docs/cat-asset-pipeline.md`(파이프라인 규칙)를 만들고 `CLAUDE.md`에 등록.

아트 방식은 확정대로 **PNG 스프라이트 시트 + CSS `steps()`** (SVG 매트릭스 방식은 폐기).
고양이는 색을 넣는 요소라 다크모드에서 색 고정은 정상. dock은 `#content` 바깥 유지. `CLAUDE.md` 준수.

---

## A. 입력 위치 & 대상 zip

사용자가 아래에 zip을 넣어둔다(폴더 없으면 생성):

```
public/assets/cats/_zips/
  ├─ simple_pixel_art_cat_grey_mackerel_tabby_with_dark.zip   → id: mackerel
  └─ simple_pixel_art_cat_orange_tabby_chubby_with_crea.zip   → id: cheese
```

- `_zips/`는 원본 보관용이며 **APP_SHELL 캐시에 넣지 않는다.**
- 이번엔 위 **두 개 모두** 처리한다(고등어 소급 포함).

## B. zip 구조 (PixelLab Character export 규격)

각 zip 내부는 다음 구조다(폴더명은 프롬프트에서 파생):

```
<folder>/rotations/{south,west,east,north}.png        # 48x48 정지 4방향
<folder>/animations/Walk/east/frame_000.png ... 005    # 48x48 걷기 6프레임 (east)
metadata.json                                          # size/frames/directions 정보
```
- 일부 zip은 `<folder>_2`(“(copy)”) 같은 **중복 상태**가 있다 → **첫 상태(primary)만** 사용, 중복 무시.
- 규격은 `metadata.json`의 `size`(48×48)·`Walk.east`(6프레임)를 신뢰. 없으면 48px·6프레임으로 가정.

## C. 처리 결과물 (각 고양이별)

zip을 풀어 아래로 산출한다(`<id>`는 D의 매핑):

```
public/assets/cats/<id>/
  ├─ walk.png          # 걷기 6프레임을 가로로 이은 288x48 시트 (east 기준)
  ├─ south.png         # 정면(앞) 정지
  ├─ north.png         # 후면(뒤) 정지
  ├─ east.png          # 오른쪽 정지
  └─ west.png          # 왼쪽 정지
```

**walk.png 합치기**: `rotations`가 아니라 `animations/Walk/east`의 6프레임을 순서대로 가로 이어붙임.
- 우선순위: ImageMagick `convert frame_000.png frame_001.png ... frame_005.png +append walk.png`
- 없으면 임의의 스크립트(python PIL / node)로 288×48 생성. 프레임 크기·순서 유지, 투명 보존.
- 정지 4방향(south/north/east/west)은 `rotations/`에서 그대로 복사.

## D. id 매핑 규칙 (규칙화의 핵심)

zip 파일명은 길고 자동생성이므로, **짧은 slug id**를 부여하고 매핑을 문서에 유지한다.

| zip 파일명 | id |
|---|---|
| simple_pixel_art_cat_grey_mackerel_tabby_with_dark.zip | `mackerel` |
| simple_pixel_art_cat_orange_tabby_chubby_with_crea.zip | `cheese` |

- 앞으로 새 zip이 오면: 사용자가 id를 지정하면 그걸 쓰고, 없으면 품종/색에서 합리적 slug를 만들어
  이 표(= `docs/cat-asset-pipeline.md`의 매핑 표)에 **한 줄 추가**한다.

## E. cats.js — 걷기/쉬기 상태머신으로 일반화

기존 “계속 걷기” 로직을 **상태머신**으로 바꾼다. 각 고양이는 두 상태를 오간다.

- **WALK**: `walk.png`를 `steps(6)`로 재생하며 좌우 이동. 방향 `dir`(+1 동/-1 서), 서쪽이면 `scaleX(-1)`.
- **REST**: 이동 정지. `rotations` 정지 이미지 중 하나로 배경 교체(앞/뒤/좌/우 랜덤), 걷기 애니메이션 끔.
  → “멈춰서 앞을 보거나 뒤로 돌아 쉬는” 표현.

상태 전환:
- WALK는 랜덤 시간(예 3~6초) 또는 벽 도달 시 종료 → REST 진입 확률 or 방향 반전.
- REST는 랜덤 시간(예 2~5초) 유지 후 WALK 재개(새 방향 랜덤).
- 방향 정지 매핑: `south`=앞, `north`=뒤, `east`=우측(플립 없음), `west`=좌측(정지 이미지 그대로, 플립 없음).

### 카탈로그 & 규격

```js
var CAT_SPRITE = { frame: 48, frames: 6, sheetW: 288, walkDur: 0.75 }; // 전 고양이 공통
var CAT_CATALOG = [
  { id:'mackerel', dir:'assets/cats/mackerel' },
  { id:'cheese',   dir:'assets/cats/cheese'   },
]; // 새 고양이는 여기 한 줄 추가
// 각 고양이 자산: `${dir}/walk.png`, `${dir}/south.png`, north/east/west.png
```

### 구조 요구사항

- `spawnCat(cfg)`가 `.cat` 요소를 만들고 초기 상태(WALK)로 시작. 시작 위치·속도를 인덱스별로 조금씩 다르게.
- **단일 rAF 루프**가 모든 고양이의 이동·상태 타이머를 갱신(고양이마다 rAF 따로 X — 배터리).
  타이머는 setInterval이 아니라 루프 내 타임스탬프로 처리(일시정지와 일관).
- `visibilitychange`로 탭 숨김 시 루프 중지, 복귀 시 재개.
- `prefers-reduced-motion: reduce`면 이동·걷기 애니메이션 정지, **정지 이미지(예: south)** 로 고정.

### 상태머신 스켈레톤(참고)

```js
function makeCat(cfg, i){
  var el=document.createElement('div'); el.className='cat';
  var A=cfg.dir; // asset base
  var stills={south:A+'/south.png',north:A+'/north.png',east:A+'/east.png',west:A+'/west.png'};
  var walk='url('+A+'/walk.png)';
  var st={el:el, state:'walk', dir: (i%2?1:-1), x:16+i*40, speed:0.35+Math.random()*0.1, until:0, stills:stills, walk:walk};
  enterWalk(st, performance.now());
  return st;
}
function enterWalk(st,t){ st.state='walk'; st.el.classList.add('walking');
  st.el.style.backgroundImage=st.walk; st.until=t+3000+Math.random()*3000; }
function enterRest(st,t){ st.state='rest'; st.el.classList.remove('walking');
  var f=['south','north','east','west'][Math.floor(Math.random()*4)];
  st.el.style.backgroundImage='url('+st.stills[f]+')';
  st.el.style.transform=scaleStr(1); // stills already face correctly
  st.until=t+2000+Math.random()*3000; }
function tick(t){
  if(hidden) return;
  var w=floor.clientWidth;
  cats.forEach(function(st){
    if(st.state==='walk'){
      var max=w - CAT_SPRITE.frame - 6;   // scale 적용 시 폭 2배 반영
      st.x+=st.dir*st.speed;
      if(st.x<=6){st.x=6;st.dir=1;} else if(st.x>=max){st.x=max;st.dir=-1;}
      st.el.style.left=st.x+'px';
      st.el.style.transform=scaleStr(st.dir); // 서쪽이면 scaleX(-1)
      if(t>=st.until) enterRest(st,t);
    } else {
      if(t>=st.until) enterWalk(st,t);
    }
  });
  raf=requestAnimationFrame(tick);
}
// scaleStr(dir): 표시배율 적용 시 'scale(2) scaleX('+dir+')', 아니면 'scaleX('+dir+')'
```

## F. CSS (styles.css) — 걷기 클래스만 애니메이션, 배경은 JS 지정

```css
.catdock{background:var(--card);border:1px solid var(--bd);border-radius:var(--radius);overflow:hidden;margin:0 0 8px}
.catdock .floor{position:relative;height:96px;background:linear-gradient(180deg,var(--soft),transparent);overflow:hidden}
.catdock .cat{position:absolute;bottom:12px;width:48px;height:48px;
  background-repeat:no-repeat;background-position:0 0;image-rendering:pixelated;transform-origin:bottom center}
.catdock .cat.walking{animation:catwalk .75s steps(6) infinite}
@keyframes catwalk{from{background-position:0 0}to{background-position:-288px 0}}
@media (prefers-reduced-motion:reduce){.catdock .cat.walking{animation:none;background-position:0 0}}
```
- REST 상태에서는 `.walking` 클래스를 빼서 애니메이션을 멈추고 정지 이미지(48×48, position 0 0)를 그대로 표시.
- 표시 크기 scale(2) 유지 시 이동 폭 계산도 2배.

## G. 새로 만들 규칙 문서 — docs/cat-asset-pipeline.md

아래 내용으로 파일을 생성하고, **`CLAUDE.md`에 한 줄 등록**한다:
> `- 고양이 에셋: PixelLab zip을 처리할 땐 docs/cat-asset-pipeline.md의 "Cat Asset Pipeline"을 따른다.`

`docs/cat-asset-pipeline.md` 본문:

```md
# 🐈 Cat Asset Pipeline (PixelLab zip → dock 적용)

사용자가 `public/assets/cats/_zips/`에 PixelLab Character export zip을 넣으면, 아래 절차로 자동 처리한다.

## 트리거
- `public/assets/cats/_zips/` 에 새 `*.zip`이 추가되거나, 사용자가 "이 고양이(zip) 추가해줘"라고 하면 실행.

## zip 규격
- `<folder>/rotations/{south,north,east,west}.png` (48×48 정지)
- `<folder>/animations/Walk/east/frame_000..005.png` (48×48, 걷기 6프레임)
- `metadata.json` (size/frames/directions). 중복 상태(`_2`,"(copy)")는 무시하고 primary만 사용.

## 산출
`public/assets/cats/<id>/` 에:
- `walk.png` = Walk/east 6프레임을 가로로 이은 288×48 시트 (convert +append 또는 스크립트)
- `south.png / north.png / east.png / west.png` = rotations 복사

## id 매핑
| zip | id |
|---|---|
| simple_pixel_art_cat_grey_mackerel_tabby_with_dark.zip | mackerel |
| simple_pixel_art_cat_orange_tabby_chubby_with_crea.zip | cheese |
(새 zip은 사용자가 지정한 id, 없으면 품종 slug로 이 표에 추가)

## 코드 반영
1. `js/cats.js`의 `CAT_CATALOG`에 `{ id:'<id>', dir:'assets/cats/<id>' }` 한 줄 추가.
2. `sw.js` `APP_SHELL`에 `assets/cats/<id>/walk.png` + 4방향 정지 추가 → `CACHE_VERSION` 상향.
   (단, `_zips/`와 원본 zip은 캐시에 넣지 않음)
3. `docs/features.md` 고양이 목록 갱신, `docs/CHANGELOG.md` 기록.

## 규격 상수
- 프레임 48px, 6프레임, 시트폭 288, 걷기 duration 0.75s (`CAT_SPRITE`와 일치).
```

## H. 이번 실행 범위

- `_zips/`의 **mackerel·cheese 두 zip 모두** 위 파이프라인으로 처리(고등어 소급 포함).
- 1차에서 고등어가 걷기만 하던 단일 로직을 **E의 상태머신**으로 교체(두 마리 모두 걷기↔쉬기).
- `docs/cat-asset-pipeline.md` 생성 + `CLAUDE.md` 등록.

## I. 하지 말 것

- dock을 `#content` 안으로 이동 금지(리렌더 리셋).
- 고양이마다 rAF 개별 루프 금지(단일 루프).
- `_zips/` 원본 zip을 APP_SHELL에 캐시 금지.
- base64 인라인 금지. 은화/상점/가구/Firebase 연동은 범위 밖.

## J. 검증

- dock에 **고등어·치즈 두 마리**가 걷다가 **랜덤하게 멈춰 앞/뒤/옆을 보며 쉬고** 다시 걷는지.
- 다른 탭 전환 후에도 상태·위치 리셋 없이 이어지는지.
- 탭 백그라운드 시 멈추고 복귀 시 재개, `prefers-reduced-motion`에서 정지 이미지로 고정되는지.
- `docs/cat-asset-pipeline.md`가 생성되고 `CLAUDE.md`에서 참조되는지.

완료 시 커밋(예: `feat: 4-dir idle cats + cat-asset zip pipeline`).
다음 고양이(삼색·하양·턱시도·카오스)는 zip을 `_zips/`에 넣기만 하면 이 규칙으로 처리된다.
