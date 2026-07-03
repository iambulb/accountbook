# 📱 안드로이드 안정화 계획 (Android stabilization)

그동안 검토는 주로 **iPhone Safari** 기준이었다. 이 문서는 **안드로이드(설치형 PWA + PWABuilder TWA/APK)** 관점에서 코드를 점검하고, 우선순위별 안정화 항목과 테스트 체크리스트를 정리한다.

작성 기준 커밋: 뒤로가기 수정(`c7d9e39`) 반영 이후.

---

## 0. 요약 — 이미 잘 되어 있는 것 ✅

아래는 점검 결과 **이미 안드로이드에 맞게 처리**돼 있어 손댈 필요 없음:

| 항목 | 위치 | 상태 |
|---|---|---|
| 하드웨어 뒤로가기 = 진짜 뒤로가기 | `main.js` backNav(히스토리 가드+popstate) | ✅ 방금 수정 |
| 동적 뷰포트 높이 `100vh; 100dvh`(주소창 대응) | `styles.css` `.auth-wrap`/#app | ✅ |
| 당겨서 새로고침·고무줄 잠금 | `body{overflow:hidden;overscroll-behavior:none}` + 스크롤 컨테이너 `contain` | ✅ |
| 다크모드 상태바 색 | `core.js` applyTheme → `<meta theme-color>` 동적(`#16181d`/`#fff`) | ✅ |
| 탭 하이라이트 제거 / 300ms 지연 제거 | `* {-webkit-tap-highlight-color:transparent}`, `button{touch-action:manipulation}` | ✅ |
| 드래그 제스처(펫·가구) | 포인터 이벤트 + `touchmove {passive:false}` preventDefault, `touch-action` 세분화 | ✅ |
| 모바일 키보드 종류 | `inputmode="numeric/decimal/none"`, `type="email/password/date"` | ✅ |
| 세이프에어리어(하단 탭바·시트·홈·상태뷰) | `env(safe-area-inset-*)` 5곳 | ✅(상단바 제외, 아래 참고) |
| 백그라운드 웹푸시 | `firebase-messaging-sw.js` 존재(FCM 자체 스코프 등록) | ✅ |
| 모션 최소화 / 백그라운드 애니 정지 | `reducedMotion()`·가시성 정지 | ✅ |
| PWA 매니페스트 | `display:standalone`·`orientation:portrait`·maskable 아이콘 | ✅ |

> 결론: **기본기는 탄탄**하다. 아래는 남은 리스크 3개(높음/중간/낮음)와 검증 항목.

---

## 1. 🔴 HIGH — TWA(APK) 검증: `assetlinks.json` 플레이스홀더

- **현상**: `public/.well-known/assetlinks.json` 이 `REPLACE_WITH_YOUR_PACKAGE_ID`, `REPLACE_WITH_SHA256_FINGERPRINT_FROM_PWABUILDER` 그대로다.
- **영향**: TWA(APK)에서 이 값이 실제 값과 다르면 **Digital Asset Links 검증 실패** → 앱이 **주소창(Custom Tab)** 으로 뜨거나 브라우저처럼 동작한다. (뒤로가기가 브라우저식으로 앱을 벗어나던 문제의 근본 배경이 될 수 있음 — 미검증 TWA는 사실상 브라우저 탭.)
- **조치(빌드 단계, 사용자 진행 필요)**:
  1. PWABuilder로 APK를 만들 때 나오는 **package id**(예: `app.netlify.yourname.twa`)와 **서명 SHA‑256 지문**을 확인.
  2. `assetlinks.json` 의 두 플레이스홀더를 실제 값으로 교체 → 배포(`/.well-known/assetlinks.json` 이 200으로 열려야 함).
  3. 설치 후 앱에 **주소창이 안 보이면** 검증 성공.
- **비고**: 코드로 자동 수정 불가(빌드 산출 값 필요). 값 주시면 대신 채워 드림.

---

## 2. 🟠 MEDIUM — `color-mix()` 27곳: 구형 안드로이드 WebView 호환

- **현상**: `styles.css` 에 `color-mix(in srgb, …)` 27곳(featbanner·틴트 타일·틈새빛 등).
- **영향**: `color-mix()` 는 **Chrome 111+(2023.3)**. 안드로이드 **시스템 WebView/Chrome이 오래된 소수 기기**에선 해당 색이 **투명/미적용**으로 깨질 수 있음(대부분 자동 업데이트라 영향은 소수).
- **조치(선택)**: 각 `color-mix` 앞에 **폴백 색**을 한 줄 둔다(브라우저가 마지막 유효값 사용):
  ```css
  background: #eef1f4;                                  /* 폴백(구형) */
  background: color-mix(in srgb, var(--gold) 14%, var(--card));
  ```
  27곳이라 기계적 작업. **원하시면 일괄 반영**하겠음(디자인 변화 없음, 구형 안전망만 추가).
- **판단**: 타깃 최소 안드로이드가 최신 Chrome이면 **낮음**, 저가·구형 포함이면 **중간**.

---

## 3. 🟡 LOW–MEDIUM — 상단바 `.topbar` 상단 세이프에어리어

- **현상**: `.topbar { padding:12px 20px 8px }` — `env(safe-area-inset-top)` 없음.
- **영향**: 상태바 비오버레이(현재 `apple-…status-bar-style:default`)면 문제 없으나, **노치/펀치홀 안드로이드 + `viewport-fit=cover`** 조합에서 상단바가 상태바에 붙어 보일 수 있음.
- **조치(검증 후)**: 노치 안드로이드에서 겹치면
  ```css
  .topbar { padding-top: calc(12px + env(safe-area-inset-top, 0px)); }
  ```
  단, iPhone에서 이미 정상이라 **먼저 실제 기기 확인** 후 반영(불필요한 여백 회귀 방지). 낮은 우선순위.

---

## 4. 🟢 LOW — 기타 다듬기

- **`type="number"` 1곳**: 안드로이드에서 스피너/로케일 소수점 이슈 가능 → `inputmode="numeric"`(+`type="text"`)로 통일 권장. (대부분 이미 inputmode 사용)
- **다크모드 실행 스플래시**: 매니페스트 `background_color:#ffffff` → 다크모드 실행 시 흰 플래시. TWA는 APK 스플래시라 별개지만, 첫 페인트용 `<meta name="theme-color" media="(prefers-color-scheme: dark)">` 추가로 완화 가능(현재는 JS로 갱신).
- **키보드 겹침**: 안드로이드 `adjustResize` + flex+dvh 레이아웃이라 대체로 OK. 시트 안 입력에서 하단 버튼 가림 여부만 실기 확인.
- **저사양 안드로이드 성능**: 방/캠에 걷는 펫 다수 + CSS 애니. `prefers-reduced-motion`·백그라운드 정지 있음. 저가 기기에서 프레임 확인.

---

## 5. ✅ 안드로이드 실기 테스트 체크리스트

- [ ] **뒤로가기**: 알뜰홈·더보기·거래입력·가구메뉴에서 눌러 **한 단계씩 닫히는지**, 홈 루트에서 **두 번 눌러 종료**되는지.
- [ ] **TWA 주소창**: 설치 앱에 주소창이 **안 보이는지**(=assetlinks 검증 OK).
- [ ] **세이프에어리어**: 제스처 내비게이션 바에 하단 탭바/시트 버튼이 안 가리는지, 노치에 상단바 안 겹치는지.
- [ ] **주소창 스크롤**: 스크롤 시 하단이 잘리거나 튀지 않는지(dvh).
- [ ] **당겨서 새로고침**: 목록 맨 위에서 아래로 당겨도 **새로고침 안 되는지**.
- [ ] **키보드**: 로그인/거래입력에서 키보드가 필드를 가리지 않고, 하단 버튼 접근 가능한지.
- [ ] **다크모드**: 상태바 색이 어둡게 바뀌는지, color-mix 색들이 정상인지(구형 기기).
- [ ] **웹푸시**: 알림 켜기 → 앱 닫은 상태에서 리마인더 수신·탭 시 앱 열림.
- [ ] **홈 화면 아이콘**: maskable 아이콘이 원형/스퀘어클 마스크에서 잘리지 않는지.

---

## 6. 📎 진행 중 발견한 iOS 관련 메모(같이 반영 대상)

- iOS 설치형 PWA에서만 웹푸시 동작(16.4+) — `push.js`에 이미 안내·분기 있음. 미설치 사파리에선 알림 UI를 **숨기거나 '홈 화면에 추가' 안내**로 유도 확인.
- iOS `type="date"` 네이티브 피커/`inputmode` 동작은 정상. 스타일만 OS별 상이(기능 영향 없음).
- 위 `.topbar`/스플래시 다듬기는 **iOS·안드로이드 공통**으로 반영하면 양쪽 개선.

---

### 우선순위 정리
1. **(HIGH)** assetlinks 실제 값 채우기 — TWA면 필수.
2. **(MED)** color-mix 폴백 일괄(구형 안드로이드 타깃이면).
3. **(LOW)** 실기 확인 후 상단바 세이프에어리어·number input·스플래시 메타.

> 코드로 지금 바로 안전하게 반영 가능한 것: **color-mix 폴백 일괄**, **다크모드 first‑paint theme-color 메타**. 원하시면 진행하겠음. assetlinks는 빌드 값이 필요.
