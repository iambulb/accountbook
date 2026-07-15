# 03 — 비디오 PiP(Picture-in-Picture) 파이프라인

> eggarden의 "캠을 시스템 PiP 창으로 띄워 다른 앱을 쓰면서도 펫을 보는" 기능. 원본: `public/js/cats.engine.js` 288~761행.
> 두 방식이 공존한다: **비디오 PiP**(기본, canvas→stream→video→requestPictureInPicture)와 **Document PiP**(DOM 미러 창, 폴백). 이 문서는 이식 가치가 높은 비디오 PiP 중심.

---

## 1. 전체 아키텍처

```
[메인 스레드]                              [Web Worker]
씬·펫을 origin-clean ImageBitmap으로 준비
  → worker로 transfer ─────────────────→  OffscreenCanvas에 setInterval(33ms)로 매 프레임 합성
                                            → new VideoFrame(canvas) 생성
                                            → MediaStreamTrackGenerator.writable에 push
[메인 스레드]
MediaStream → 숨겨진 <video> → video.play() → video.requestPictureInPicture()
```

- 가상 무대: 논리 360×200을 2배 래스터(720×400) — 메인 캠(200px 카드)과 같은 비율·원근.
- 지원 판정: `OffscreenCanvas + pictureInPictureEnabled + captureStream + requestPictureInPicture + Worker` 전부 있어야 비디오 PiP.
- 진입: 에셋 로드(`Promise.all([씬키트, 펫에셋])`) → 워커 생성 → `init` 메시지(transfer) → `v.play().then(()=> v.requestPictureInPicture())`.

### 1-1. 프레임 공급 경로 2종 — push가 핵심

| 경로 | 방식 | 비고 |
|---|---|---|
| **Push (기본)** | `MediaStreamTrackGenerator({kind:'video'})`의 `writable`을 워커로 transfer. 워커가 자체 OffscreenCanvas에 그리고 `new VideoFrame(cvs, {timestamp})`를 `writer.write()` | **컴포지터 비의존** — 모바일에서 앱을 백그라운드로 보내도 PiP가 계속 움직임 |
| captureStream 폴백 | 실제 canvas를 `transferControlToOffscreen()`으로 워커에 넘기고 `canvas.captureStream(30)` | 컴포지터가 캔버스를 합성할 때만 프레임을 뽑는 pull 구조 → **백그라운드에서 PiP가 얼어붙음**(실기기 확인) |

**교훈**: `canvas.captureStream`만으로 만들면 데스크톱에선 잘 되다가 모바일 백그라운드에서 동결된다. `MediaStreamTrackGenerator + VideoFrame` push 경로를 기본으로, captureStream을 폴백으로.

- 프레임 루프는 워커의 `setInterval(33ms)` — **워커 타이머는 탭 숨김 스로틀을 안 받는다**(rAF는 받음). `dt = min(90, elapsed)` 클램프.
- 백프레셔: `writer.desiredSize > 0`일 때만 write.

### 1-2. 워커 draw 순서

```
clearRect
→ back 비트맵(벽·바닥·정적 씬 — 미리 베이크)
→ back층 파티클(구름·별·풀꽃)
→ furn 비트맵(가구·오브젝트 정적층)
→ 가구 fx + 펫을 z값으로 통합 소트해 그리기   ← 펫·가구 상호 가림
→ over층 파티클(배경효과 오버레이)
```

---

## 2. origin-clean 제약 (가장 중요한 함정)

**`foreignObject`가 든 SVG를 이미지화하면 Chrome이 canvas를 오염(origin-unclean)으로 취급** → `ImageBitmap` transfer·captureStream이 전부 막힌다(`"Non-origin-clean ImageBitmap cannot be transferred"`).

대응:
- DOM/HTML을 SVG로 감싸 찍는 방식 금지. **순수 픽셀 SVG(rect만) data URI + 좌표 수학**으로만 캔버스에 그린다.
- 배치 좌표는 DOM을 읽지 않고 **메인 캠과 동일한 수식**(camDepth/camFurnBottom/camLeftCss의 JS판)으로 계산.

기타 에셋 준비 기법:
- **CSS 변수 사전 해석**: 워커는 `var(--x)`를 모른다 → SVG 문자열의 CSS 변수를 `getComputedStyle` 계산값으로 치환한 뒤 data URI화. 테마(다크모드) 변경 시 재래스터.
- **`createImageBitmap` 실패 폴백**: 인트린식 크기가 불완전한 SVG는 직접 변환이 실패 → 2배 래스터 canvas 경유 + `imageSmoothingEnabled=false`(도트 보존).
- **벽지/바닥 CSS 배경 문자열 파싱**: `url(data:…)`→`createPattern('repeat')`, `gradient`→`createLinearGradient`, 단색→`fillStyle`. painter 순서 보장을 위해 로드 후 실행하는 지연 드로어 패턴.
- **염색 필터는 메인 스레드에서 비트맵에 베이크**: 워커의 `ctx.filter`는 GPU 가속/모바일에서 무시되는 사례가 있다 → 메인 스레드 canvas에서 `ctx.filter = dyeFilterCss(...); drawImage()` 후 `createImageBitmap`.
- 코스메틱(모자·버디) 로드 실패가 펫 본체를 드랍시키지 않게 각각 `.catch(()=>null)`.
- 발밑 여백·머리 위치는 스프라이트별 **실측**(고정 추정값이면 특정 펫에서 발이 뜸).

---

## 3. 워커 펫 시뮬레이션 — 미러가 아니라 "동일 상수의 자체 심"

메인 액터 상태를 실시간 미러링하지 않고, **워커가 자체 미니 배회 심을 돌린다. 대신 상수를 메인 엔진과 완전히 공유**해서 움직임의 질이 같다:

```js
// 메인 엔진 대응값을 그대로 전사
v      = 0.0084~0.0192 px/ms          // 메인: 0.14~0.32 stride × 0.06
wd     = clamp(0.42*hh/(v*0.966), 450, 1500)  // 걷기 필름 주기 — 발 미끄러짐 방지 공식 동일
y      = H - depth*0.53*H - h + h*fp - lift    // RISE 0.53, 발밑 실측 fp
scale  = 1.5 - (1.5-0.86)*depth                // 원근 배율 동일
flip   = moving && dir<0 → translate(x+w) + scale(-1,1)
// 걷기 필름: fr = floor(now / (주기/프레임수)) % frames → 시트 가로 슬라이스 drawImage
// frontWalk 펫: 걷기 애니 대신 east 스틸(정면 이동 금지 불변식 워커에서도 유지)
// reduced-motion: 전 펫 pause 고정
```

모드도 메인과 동일: roam(배회·깊이 표류) → goal(가구 스팟 접근·x 진척 비례 깊이 수렴·도착 lift) → pause.

**설계 판단**: 실시간 미러는 메시지 트래픽·동기화 버그가 크고, 시청자는 "같은 방·같은 펫이 자연스럽게 움직이는가"만 본다. 자체 심 + 상수 공유가 훨씬 단순하고 견고하다.

---

## 4. dock 정합 — "짝 맞춤" 테이블 (이식 시 반드시 재현할 구조)

워커는 CSS·DOM을 못 읽으므로, 메인 캠의 CSS 애니메이션을 JS 테이블로 전사한다. **CSS를 고치면 테이블도 같이 고쳐야 하는 짝**이 존재한다는 걸 프로젝트 규칙으로 문서화할 것:

| 메인 캠(CSS/DOM) | PiP 워커(JS) | 내용 |
|---|---|---|
| `.ffx-<type>` 기본 규칙 | `_VPIP_FX_TYPE` | 타입별 keyframe 종류·기본 duration·origin |
| `.ffx-<id> .px { animation-duration }`, `transform-origin`, 전용 keyframe | `_VPIP_FX_ID` | **아이템별 오버라이드 전사 테이블** — CSS에 아이템 오버라이드를 추가하면 여기도 추가 |
| `@keyframes ffspin/ffswing/…` | 워커 `fxT(f,t)` 함수 | keyframe 수치 전사 |
| `propMarkup`의 가로 앵커·원근 | `anchorX` + 동일 함수 재사용 | 배치 수식 |
| 씬·배경효과 HTML 생성 | `_vpipScenePieces` | **동일 결정적 난수 스트림**(pkRand/pkSlots)을 같은 순서로 소비 → 파티클 위치가 픽셀 단위로 일치 |
| 액터 속도·원근·walkDur | 워커 setPets/drawPet 상수 | §3 |
| 버디·모자 오프셋 애니 | 워커 drawPet 내 수식 | sin 궤도·날갯짓 등 전사 |

**변경 전파는 서명 가드로**: 방 구성(가구·벽지·바닥·배경효과·절전 상태) 서명이 바뀌면 씬 비트맵 재전송, 펫 코스메틱 서명(모자·버디·염색)이 바뀌면 펫 에셋 재전송. 전체 재시작 없이 라이브 반영.

---

## 5. 게이트·수명주기

- **iOS 계열은 원천 차단**: `canvas.captureStream` 자체가 미지원. UA `/iPhone|iPad|iPod/` + "Mac 플랫폼인데 maxTouchPoints>1"(iPadOS 데스크톱 위장) 판정으로 버튼 자체를 안 그림.
- 닫힘 처리는 **`leavepictureinpicture` 이벤트 하나로 통일**(X 버튼·토글·다른 PiP로 대체 전부 여기로 옴) + **idempotent 정리 함수**: `worker.terminate()` → `stream.getTracks().stop()` → `video.remove()` → `canvas.remove()`. 중복 호출 안전.
- 실패 폴백 체인: 비디오 PiP 실패 → Document PiP → 토스트.
- 탭 숨김: 워커 setInterval + push 경로 조합이라 백그라운드에서도 프레임이 흐른다(이 조합이 목적 그 자체).

---

## 6. 이식 체크리스트

- [ ] push 경로(`MediaStreamTrackGenerator`+`VideoFrame`) 기본 + captureStream 폴백
- [ ] 워커 `setInterval(33ms)` 프레임 루프, dt 클램프, 백프레셔
- [ ] origin-clean: foreignObject 금지, CSS 변수 사전 해석, createImageBitmap 폴백, 필터는 메인에서 베이크
- [ ] 씬은 back/furn 정적 비트맵으로 베이크, 움직이는 것만 워커가 매 프레임
- [ ] 펫은 자체 심 + 메인 엔진과 상수 공유(속도·원근·걷기 주기·발밑 실측)
- [ ] CSS↔워커 전사 테이블("짝 맞춤")을 프로젝트 규칙으로 문서화 + 가능하면 정합 테스트
- [ ] 결정적 난수(같은 시드·같은 소비 순서)로 파티클 위치를 메인과 일치
- [ ] iOS 게이트, leavepictureinpicture 단일 정리 경로, idempotent 종료
- [ ] 서명 가드로 변경분만 재전송(전체 재시작 금지)

**전투 게임 확장 팁**: 전투 연출을 PiP에 넣으려면 이펙트도 "정적 비트맵 + 워커 keyframe 전사" 구조를 타야 한다. 초기에는 PiP에서 전투를 생략(배회만)하고, 메인 캠 정합이 안정된 뒤 확장하는 걸 권장 — eggarden도 모자 연출을 PiP에선 정적으로 두는 "문서화된 예외"를 운영한다.
