# 02 — 캠(방) 렌더링·원근·펫 액터 엔진

> eggarden의 "방을 유사 3D 원근으로 그리고, 펫이 실시간으로 돌아다니는" 캠 시스템 전체. 원본: `public/js/cats.engine.js`(엔진), `public/js/util.js`(원근 상수), `public/js/cats.js`(렌더 헬퍼·상수 테이블), `public/css/styles.css`.
> 스택: 프레임워크 없는 vanilla JS + CSS 애니메이션 + SVG 도트. **모든 움직임은 transform/opacity만 사용**(레이아웃·페인트 0) — 이것이 저사양 모바일에서 수십 개 애니메이션을 돌리는 비결이다.

---

## 1. 원근 단일 소스 — `CAM`

```js
var CAM = { FLOOR:54, WALL:46, STAGE:58, RISE:0.53, FURN_BASE:3, FURN_SPAN:46, ROWS:8, DIV:7 };

function camDepth(frontRow){ return clamp((CAM.ROWS - frontRow) / CAM.DIV, 0, 1); } // 0=맨앞, 1=맨뒤
function camFurnBottom(depth){ return CAM.FURN_BASE + depth * CAM.FURN_SPAN; }      // 가구 bottom% = 3 + d*46
function camZ(depth){ return Math.max(1, Math.round(CAM.ROWS - depth * CAM.DIV)); } // 가림 z
```

**이 값들은 "한 묶음"이다** — 화면 세로에서 바닥이 54%, 벽이 46%, 펫 무대가 58%, 펫 발 올림 최대치가 방높이×0.53, 가구 발밑이 3~49%. 이렇게 잡으면 **depth 1(맨 뒤)에서 펫 발·가구 발밑·벽/바닥 경계선이 한 지점(~54%)으로 수렴**해서, 펫이 맨 뒤 벽까지 걸어가 "닿는다". 하나만 바꾸면 뒤쪽에서 펫이 벽에 못 닿거나 가구가 벽에 박힌다.

핵심 규칙:
- **모든 무대(메인 캠·홈·친구 방·PiP)가 같은 CAM을 공유** — 무대마다 값을 갈라놓는 순간 원근이 어긋난다(eggarden에서 dock만 66%를 쓰다가 펫이 벽에 못 닿는 버그).
- CSS 변수(`--cam-floor:54%` 등)와 JS 상수의 정합을 **단위 테스트로 잠근다**.
- 원근에 무대별 분기(`isDock` 등)를 두지 말 것 — 무대 크기 차이는 컨테이너 높이(px)로만 내고, 내부는 전부 %라 자동으로 같은 원근이 된다.

### 펫 원근

```js
const PET_NEAR_SCALE = 1.5, PET_FAR_SCALE = 0.86;
depthScale(d) = 0.86 + (1.5 - 0.86) * (1 - d);   // 앞 1.5배 ↔ 뒤 0.86배
rise = d * riseMax;                                // riseMax = 무대 실측 clientHeight * 0.53
z    = camZ(d);                                    // 가구 frontRow와 같은 척도 → 펫·가구 상호 가림이 맞물림
```

**펫과 가구의 z가 같은 척도(격자 행)라는 점이 중요** — 펫이 가구 앞을 지나면 가리고, 뒤를 지나면 가려진다. 별도 소팅 코드 없이 z-index만으로 해결.

---

## 2. 무대 DOM 구조 (레이어 5+1)

```html
<div class="catroom">                       <!-- height 고정(px), overflow:hidden, isolation:isolate -->
  <div class="cr-wall">…</div>              <!-- 벽지. inset:0, z:0. 움직이는 하늘 씬 포함 -->
  <div class="cr-floor">…</div>             <!-- 바닥. bottom:0, height:54%+1px (경계 1px 흰 선 방지) -->
  <div class="cr-base"></div>               <!-- 벽/바닥 경계선 마커. bottom:54%, height:1px -->
  <div class="cr-props" id="…Props">…</div> <!-- 가구·드랍. inset:0, z-index:auto(!) -->
  <div class="cr-stage" id="…Stage">…</div> <!-- 펫 액터. bottom:0, height:58%, pointer-events:none -->
  <div class="cr-overlay">…</div>           <!-- 배경효과(방 전체 앰비언트). inset:0, z:40, pointer-events:none -->
</div>
```

- **`.cr-props`와 `.cr-stage`에 z-index를 주지 않는다(auto)** — 그래야 가구와 펫이 **같은 스택 컨텍스트**에서 각자의 깊이 z로 상호 가림된다. 컨테이너에 z를 주는 순간 "펫이 항상 가구 위" 같은 버그가 된다.
- `.catroom`에 `isolation:isolate` — 방 내부 z-index가 페이지의 다른 요소와 안 섞이게.
- 셸(벽+바닥+경계선)은 **공유 헬퍼 함수 하나**(`roomShellBase(wallId, floorId)`)로 생성 — 무대가 늘어날 때 복붙으로 구조가 갈라지는 것을 막는다.
- 렌더 순서(중요): **바닥 깔개(z0) → 벽 가구(z0) → 일반 가구(z≥1) → 드랍**. 깔개와 벽 가구가 같은 z0이라 **DOM 순서**로 깔개가 항상 맨 아래가 되게 `splitProps()`로 분리해 이어 붙인다.

---

## 3. 가구 렌더

### 3-1. propMarkup 흐름

```js
frontRow = p.r + footH - 1
depth    = camDepth(frontRow)
bottom%  = camFurnBottom(depth)
fh       = furnRoomH(itemId, depth)        // 렌더 높이 px
z        = isFloorItem ? 0 : round(frontRow)
left     = camLeftCss(c, footW, fh*aspect/2)  // 가로 앵커
inner    = live && FURN_ANIM[id] ? furnLiveSvg(...) : furnSvg(...)  // 캠에서만 연출
```

### 3-2. 가로 앵커 v2 (clamp) — 검증된 최종안

```js
camCenterFrac(c, footW) = gridLeftFrac(c) + gridSpanFrac(footW)/2   // 발자국 중앙 비율
// CSS: left: clamp(반폭px, 중앙%, calc(100% - 반폭px));  transform: translateX(-50%)
// JS(펫 정렬·PiP): camCenterX = clamp(halfW, 중앙비율*W, W-halfW)
```

- 전 칸 **발자국 중앙 정렬**이 기본, 그래픽이 벽 밖으로 나갈 때만 안쪽으로 클램프.
- 시행착오 기록: "양끝 칸은 벽에 스냅" 방식은 12열 아이템만 이웃보다 벽 쪽으로 쏠려 간격이 홀로 벌어져 보였다 → 폐기. 중앙 정렬+클램프가 최종.
- **CSS 렌더·JS 펫 정렬·PiP 세 곳이 같은 수식을 써야** 펫이 가구 위에 정확히 올라앉는다.

### 3-3. 렌더 높이 — 원근 감쇠

```js
furnRoomH(id, depth){
  const mult   = ROOM_H[id] || 1;              // 아이템별 실물감 배율(캣타워 2.5, 그릇 0.5 …)
  const base   = 16;
  const shrink = 3 + Math.max(0, mult - 1);    // 큰 가구일수록 원근 감쇠 강하게
  return Math.max(4, Math.round((base - depth*shrink) * mult));
}
```

작은 가구는 멀어도 덜 작아지고 큰 가구는 확 작아진다 — 실물 원근감. 그래픽 폭은 `fh × aspect`(aspect = 도트 매트릭스 cols/rows 그대로).

**함정**: 점유칸(footW/footH)만 바꾸고 ROOM_H를 안 바꾸면 캠에서 크기가 안 변한다. 두 값은 항상 짝으로 조정.

### 3-4. 도트 SVG — pxSvg

```js
// 문자 매트릭스(대문자 1글자=색, '.'=투명) + 팔레트 {글자:색} → <svg shape-rendering="crispEdges">
// rect는 1.05×1.05 (서브픽셀 이음새 메움)
// 방어적: 팔레트/매트릭스 누락 시 throw 대신 '' 반환 — 가구 하나 때문에 캠 전체가 죽지 않게
```

- 색 투명화 = 팔레트에서 그 글자를 뺀다(렌더러가 팔레트에 없는 글자를 건너뜀).
- 비트맵 이미지에는 `image-rendering:pixelated`.
- **반복 타일 배경(벽지·바닥)은 SVG data URI 금지** — SVG는 인트린식 크기가 없어 배경으로 래스터화가 안 돼 회색 화면이 되는 실제 버그. **canvas에 1칸=1px로 그려 `toDataURL()` PNG data URI**로 깔고 `background-size: Npx Npx` + `image-rendering:pixelated`.

### 3-5. 가구 연출 — base+fx 2겹 (FURN_ANIM)

움직이는 가구는 같은 매트릭스를 **팔레트만 나눠 두 겹**으로 그린다:

```js
FURN_ANIM[id] = { type:'spin|swing|sway|drift|flicker|blink|sheen', move:['글자들'], cls?, bg? }
             | [ {…}, {…} ]   // 다층 — 부품마다 속도·위상·경로를 어긋나게
// base = 매트릭스에서 move 글자를 뺀 정지 그림 (bg 지정 시 그 자리를 배경 글자로 치환)
// fx   = move 글자만 있는 그림을 CSS 애니메이션 클래스로 감쌈 (정확히 겹침)
```

핵심 규칙(전부 실제 버그에서 나온 것):
1. **🕳️ 구멍 금지**: 움직이는 글자는 base에서 빠져 그 자리가 투명해진다. 이동형(drift)은 실루엣 바깥 "공기" 영역의 부품만, 회전(spin)은 자기 자신을 덮는 원형 대칭 부품만, 채워진 면 위에는 blink/flicker(제자리)만. 면 위 이동이 불가피하면 `bg:'글자'`로 구멍을 부품 뒤 배경색으로 치환(물고기→물, 시계추→유리).
2. **sway만 base 언더레이 유지**: ±4.5° 소각 흔들림은 밑동 이음새를 자기 색으로 메워야 해서 base에도 남긴다. spin/drift는 잔상이 남아 base에서 제외.
3. **단조로운 1축 왕복 금지**: 다층 배열로 여러 모션을 겹치고(헤엄+잎 흔들+물 반짝), 부품마다 `animation-duration`·위상을 어긋나게.
4. 속도·중심은 CSS로: `.ffx-<id> .px { animation-duration }`, `.ffx-<id> { transform-origin }`(회전 중심=부품 위치, 예: 캣휠은 휠 정중심).
5. **연출은 캠(live)에서만** — 미리보기·상점·팔레트는 정적 렌더.
6. 자동 감사 도구를 둘 것: eggarden은 `tools/furn_audit.py --holes`가 구멍 위반을 exit 1로 잡는다.

---

## 4. 펫 액터 엔진

### 4-1. 구조 요약

- **단일 rAF 루프** `catLoop()`가 "지금 보이는 무대들"의 액터만 스텝. 탭 숨김 시 정지.
- 액터 = `{ el, x, dir, v, depth, vz, mode, goal, pose, riseMax, … }`. 모드: `roam`(배회) → `goal`(가구로 접근) → `pause`(가구에서 쉼) → roam. +`drag`(유저가 집음).
- **프레임 예산(fps 캡)**: 무대별 예산(메인 캠 ~12fps, 방 ~30fps)으로 스텝을 게이트하고, 프레임 시간 EMA가 나쁘면 자동 강등. `dt = min(90, elapsed)`로 탭 전환 스파이크 흡수. 확률은 `pr = dt/33`으로 정규화해 fps와 무관하게 같은 리듬.
- 시계는 `Date.now()` — 메인 창과 PiP 창의 rAF 타임스탬프 원점이 달라서 섞으면 안 된다.

### 4-2. setXform — 이동은 transform 하나로

```js
// left:0 고정. 매 스텝:
el.style.transform = `translate3d(${x}px, ${-(rise + lift - footPad)}px, 0) scale(${s*dir}, ${s})`;
// transform-origin: center bottom (발 기준 배율) · 좌우반전 = scaleX(-1)
```

걷는 동안 레이아웃·페인트 0(합성만). z-index는 값이 바뀔 때만 기록. 발밑 여백(footPad)은 스프라이트별 **실측**(투명 여백 측정) — 고정 추정값이면 큰 스프라이트에서 발이 뜬다.

### 4-3. 비주얼 전환 불변식 — 함수 2개만

**액터의 이동/정지 비주얼은 반드시 `actorShowMoving(a)` / `actorShowStill(a, face, clip?)` 두 함수로만 바꾼다.** DOM 재사용 시 이전 상태(정면 스틸 클래스)가 남아 "정면 이미지인 채로 옆으로 슬라이딩"하는 버그가 이 규칙으로 근절됐다.

- 이동 = 옆(east) 걷기 시트 재생. east 걷기가 없는 펫(`frontWalk`)은 east 정지 스틸로 이동(**정면(south) 이미지로 이동은 어떤 경우에도 금지**).
- 정지 = 방향별 스틸 또는 모션 클립.
- 새 상태(전투 포즈 등)를 추가해도 반드시 이 두 함수를 거치게 할 것.

### 4-4. 걷기 필름 (스프라이트 시트 재생)

```css
/* 가로 스트립 시트를 translateX + steps()로 재생 — bg-position(페인트) 대신 합성 */
.csprf { animation: csprFilm var(--wdur) steps(var(--frames)) infinite; }
@keyframes csprFilm { to { transform: translateX(calc(-1 * var(--fw))); } }
/* --fw = 칸크기 × 프레임수. steps()는 프레임수에 맞춰 인라인으로 덮음(가변 프레임 6·8·12) */
```

- **걷기 주기를 이동 속도에 연동**: `walkDur = clamp(보폭/속도px, …)` — 안 하면 발이 미끄러진다(모든 무대·PiP가 같은 공식).
- 유휴 숨쉬기: 정지 액터에만 `scaleY` 미세 squash 애니(자산 추가 없이 생동감).

### 4-5. 가구 상호작용 (goal 시스템)

```js
furnSpot(a, goal) → { lift, face, dx, pose, run?, dur }   // 가구별 상호작용 정의
```

- roam 중 확률적으로 빈 상호작용 가구 선택 → `mode='goal'` → **x 진척에 비례해 깊이도 대각선 수렴**(자연스러운 접근) → 도착 스냅 → `enterInteract`(lift 올라앉기 + face 방향 + 클립/포즈).
- 점유 관리(`occupantsOf`)로 한 가구에 정원 초과 금지(캣타워는 2자리).
- **lift는 짐작 금지, 매트릭스에서 발판 상면 행을 실측**: `계수 = (전체행수 − 상면행) / 전체행수`. 짐작값이면 펫이 기구를 타도 바닥에 서 있는 것처럼 보인다.
- 모션 클립 스키마: `PET_CLIPS[key] = { dir, fps, once?, hold?, fb:[폴백체인] }`. once 클립은 `animationend`에서 마지막 프레임에 프리즈(fill-mode만으론 필름이 창 밖으로 밀려 투명해짐).
- **전투(투닥거림)는 이 goal 시스템의 확장이다(06 문서 확정)** — "가구로 접근"을 "상대에게 접근"으로 바꾼 `APPROACH`, `enterInteract` 대신 `enterScuffle`(두 액터 밀착 + 좌우 흔들림 + 먼지구름 FX 오버레이). 새 전투 엔진을 만들지 말고 mode에 `APPROACH/SCUFFLE/RESULT`를 추가한다. FX(먼지구름·별·땀·"!")는 액터와 같은 좌표계의 오버레이 액터로 — 같은 depth·z를 태우면 가림이 자동으로 맞는다.

### 4-6. 펫 표시 크기 압축 (effPetScale)

원본 배율(현실 크기 비례)은 그대로 두고 **표시만** 압축:

```js
// raw ≤ 1 은 그대로. raw > 1 은:
e = raw - 1
disp = 1 + (e / (1 + e*BEND)) * tf     // BEND=0.24 (클수록 더 압축, 전 구간 연속)
tf = TFMIN + (1-TFMIN) * rank/(maxRank) // TFMIN=0.85 — 같은 크기면 높은 등급이 더 큼
// 예: 호랑이 4.0 → 2.70, 시바 1.5 → 1.41, 고양이 1.0 → 그대로
```

- **튜닝 상수는 2개뿐**(BEND·TFMIN) — 개별 펫에 크기 예외를 하드코딩하지 않는다.
- 모든 표시 경로(캠 3무대·뽑기 연출·PiP)가 이 단일 함수를 탄다.

---

## 5. 라이브 갱신 — 재생성 없이 인라인 패치

**애니메이션 중인 DOM을 innerHTML로 재생성하면 애니가 리셋되어 깜빡인다.** eggarden의 해법:

1. **서명(signature) 가드**: 가구 목록·펫 구성·벽지/바닥/배경효과를 문자열 서명으로 만들어 `dataset.sig`에 저장, **같으면 스킵, 다르면 그 부분만 교체**. 데이터 틱마다 무대를 통째로 다시 그리지 않는다.
2. **rAF 코얼레싱**: 데이터 변경 콜백이 연속으로 와도 rAF 한 번으로 합침.
3. **부분 패치 목록을 문서화**: 메인 캠은 셸을 재생성하지 않으므로, 벽·바닥·오버레이·가구·펫 등 "패치해야 할 요소 목록"에 새 표면을 추가할 때마다 패치 함수에도 추가(하나 빠지면 그 표면만 안 바뀌는 버그 — 실제로 벽지만 패치하고 바닥이 빠졌던 사례).
4. **재빌드 시 상태 이어받기**: 액터 재빌드 때 이전 x·depth·포즈를 저장소(`_petDepth` 등)에서 복원 — 순간이동 방지.

---

## 6. 배경효과(앰비언트 오버레이)

방 전체에 떠다니는 효과(나비·낙엽·반딧불)는 격자 배치가 아니라 **방당 1개 오버레이 레이어**:

- **지터드 그리드 배치**: 순수 랜덤은 뭉친다 → `pkSlots(n, seed)`가 √(n×1.7)열 그리드의 칸마다 하나 + 지터.
- **결정적 의사난수** `pkRand(i,seed) = frac(sin((i+1)*12.9898 + seed*4.1414)*43758.5453)` — Math.random이면 재렌더마다 위치가 튄다. 결정적이라 라이브 패치·PiP 미러에서 위치가 동일.
- **원근 밴드**: `bottom% = 13 + (1-yy)*72`(뒤=위·높음), `scale = 0.66 + yy*0.62`(앞=크게). DOM 순서 뒤→앞.
- 낙하형(낙엽)은 가로만 균일 배분, 깊이로 크기·속도 차등.

---

### 배경효과 인프라의 재사용처 (06 문서 확정안과 연결)

- **날씨/계절 FX**(비·눈): 이 오버레이 레이어(`.cr-overlay`)와 지터드 그리드·원근 밴드를 그대로 재사용. 날씨 한정 손님의 소환 판정만 데이터로 얹는다.
- **실시간 낮/밤**: 별도 오버레이 한 장(CSS 그라데이션 + filter)을 시간대에 따라 교체 — 에셋 추가 불필요. 밤엔 펫 수면(기존 pose)·야행성 손님만 스폰.
- **부재중 타임랩스 리플레이**: 결정론 시뮬의 이벤트 타임라인을 이 액터 레이어에 배속으로 스크립트 재생. 액터 엔진의 확률 로직을 끄고 타임라인이 mode 전환을 구동하는 "재생 모드"를 둔다(스킵 시 즉시 종료 — 보상은 이미 확정이라 안전).
- 위 오버레이·재생 모드도 §7 절전 계층에 전부 등록할 것.

## 7. 성능·절전 규칙 (그대로 채택 권장)

| 계층 | 동작 |
|---|---|
| `prefers-reduced-motion` | 모든 장식 애니 정지(접근성 — 전면) |
| `body.lite` (저사양/수동) | 장식 애니 정지, **걷기 필름 등 기능성 모션은 유지** |
| `body.perfmid` (중간) | 무거운 레이어 `will-change` 회수 + blur 필터 컷(움직임 유지) |
| `body.sheet-open` | 시트에 가려진 캠의 애니 정지 + will-change 회수 |
| `body.apphidden` (백그라운드) | will-change 전면 회수, SVG SMIL pause, rAF 정지 |
| 오프스크린 | IntersectionObserver로 화면 밖 씬 애니 정지 |
| 파티클 개수 | 성능 등급별 감축 계수(low 0.45 / mid 0.7 / high 1.0) |

기타:
- `will-change:transform`은 실제 움직이는 요소에만, 절전 시 회수(GPU 레이어 폭증 방지).
- 픽셀아트에 blur/glow 필터 남발 금지(도트 정체성 훼손 + 모바일 filter 비용).
- 새 애니메이션·오버레이를 추가하면 **위 절전 셀렉터 전부에 등록** — 하나라도 빠지면 백그라운드 발열 원인.

---

## 8. 함정 모음 (eggarden 실제 버그 재발 방지)

1. 무대마다 원근 상수를 갈라놓음 → 펫이 벽에 못 닿음. **단일 CAM + 테스트로 잠금.**
2. `.cr-props`/`.cr-stage`에 z-index 부여 → 펫·가구 상호 가림 깨짐.
3. 깔개(z0)를 DOM 뒤에 그림 → 벽 가구(z0) 위로 튀어나옴. **DOM 순서로 해결.**
4. 정면(south) 이미지로 이동 → `actorShowMoving/Still` 2함수 불변식으로 근절.
5. 데이터 틱마다 innerHTML 재생성 → 애니 리셋 깜빡임·발열. 서명 가드.
6. SVG data URI를 반복 배경으로 → 회색 화면. canvas→PNG data URI.
7. footW/footH만 바꾸고 ROOM_H 방치 → 캠에서 크기 안 변함.
8. 연출 move 글자 자리가 base에서 구멍 → bg 치환/공기 영역 배치 + 자동 감사.
9. 탑승 lift 짐작값 → 발판 상면 행 실측.
10. once 클립 fill-mode 의존 → 마지막 프레임 수동 프리즈.
11. 로드 순서 의존(전역 함수 패턴일 때): 먼저 로드되는 파일의 top-level에서 뒤 파일 함수 호출 → ReferenceError + 이후 let/const 전부 TDZ. **top-level 초기화는 자기 파일 함수만.**
