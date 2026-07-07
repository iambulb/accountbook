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

## 1. ⏸️ 추후(스토어 출시) 대비 — TWA `assetlinks.json` 채우기

> **지금은 안 해도 됨.** 현재는 스토어 출시 계획 없음 → `assetlinks.json`은 **PWA 설치(홈 화면에 추가)에선 전혀 안 쓰인다.** 아래는 **나중에 Play스토어에 APK(TWA)로 낼 때**를 위한 대비 메모.

- **현상**: `public/.well-known/assetlinks.json` 이 `REPLACE_WITH_YOUR_PACKAGE_ID`, `REPLACE_WITH_SHA256_FINGERPRINT_FROM_PWABUILDER` 플레이스홀더 상태.
- **언제 필요?** **오직 TWA(PWABuilder로 만든 APK)** 로 배포할 때만. PWA 설치로만 쓰면 무관.
- **안 채우고 TWA를 내면 잃는 것**(기능은 정상, "앱스러움/검증"만 못 얻음):

  | 배포 방식 | assetlinks 안 채움 |
  |---|---|
  | PWA 설치(홈 화면 추가) | 영향 없음 |
  | **TWA/APK** | ① 상단 **주소창(URL 바)** 노출 ② **미검증** 상태(시스템 통합 약화) ③ **딥링크(`handle_all_urls`)** 자동 열기 불가. 로그인·기능은 정상 |

- **뒤로가기와 무관**: 뒤로가기 수정은 **웹 히스토리 기반**이라 assetlinks 검증과 상관없이 동작함(안 채워도 안 잃음).
- **나중에 채우는 법**:
  1. **가장 쉬움 — PWABuilder가 만들어 줌**: pwabuilder.com에서 Android 패키지 빌드 → 다운로드 zip 안 **`assetlinks.json`이 이미 올바른 값**으로 들어있음 → `public/.well-known/assetlinks.json`에 그대로 덮어쓰고 배포.
  2. **package_name**: PWABuilder에서 정한 Package ID(예: `app.netlify.<이름>.twa`).
  3. **SHA‑256 지문**:
     - Google Play + Play 앱 서명(권장): Play Console → 앱 → **설정 → 앱 무결성 → 앱 서명 키 인증서 → SHA‑256**. ⚠️ **업로드 키가 아니라 '앱 서명 키'** 여야 함.
     - 키스토어 직접: `keytool -list -v -keystore your.keystore -alias your-alias` → `SHA256:` 값.
     - 형식: 대문자 콜론 구분 헥사(`AB:CD:…:EF`).
  4. **검증**: 배포 후 `https://도메인/.well-known/assetlinks.json` 200 JSON, 설치 앱에 **주소창 안 보이면** OK.
- **비고**: 코드로 자동 채움 불가(빌드 산출 값 필요). 출시 준비 시 package_name·SHA‑256 주면 대신 채워 커밋 가능.

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

### 진행 현황 / 우선순위
- ✅ **완료** — 하드웨어 뒤로가기 = 진짜 뒤로가기(`main.js`).
- ✅ **완료** — `color-mix` 폴백 일괄(`styles.css` 끝 `@supports not(color-mix)` 블록, 구형 안드로이드 WebView 대응·모던 무변화).
- ⏸️ **보류(추후 스토어 출시 시)** — `assetlinks.json` 실제 값 채우기(§1). **지금 PWA 설치에는 불필요.**
- 🔬 **실기 확인 후 반영** — 노치 안드로이드에서 `.topbar` 상단 세이프에어리어(§3), `type="number"` 1곳, 스플래시(§4). *iPhone에서 정상이라 회귀 방지 위해 실기 확인 먼저.*
- ⛔ **반영 안 함(의도)** — 다크 first‑paint `theme-color` 미디어 메타: 앱이 **수동 테마 토글**이라 `prefers-color-scheme` 메타와 충돌 → 현재 JS 갱신 방식 유지가 정답.

> 정리: **코드로 지금 바로 안전한 것은 이미 반영 완료**. 남은 건 (a) 추후 출시 대비 assetlinks, (b) 실기 확인이 필요한 몇 가지뿐. 실기 테스트 후 발견되는 것만 추가로 다듬으면 됨.

---

### 🔋 일반모드 배터리·발열 최적화 (저사양모드 아님 — 안 보이는 애니만 정지, 시각 변화 0)
기존 일반모드 최적화(단일 rAF 엔진·`document.hidden` 정지·30/12fps 캡·오프스크린 씬 IntersectionObserver 정지·씬 HTML 캐시)에 더해, **사용자가 지각할 수 없는 상시 애니만** 추가로 정지한다(보이는 연출은 그대로).

- **시트에 가려진 dock 정지** (`body.sheet-open`): `openSheet`/`closeSheet`(`core.js`)가 body 클래스 토글 → ① `activeStages()`(`cats.js`)가 시트 열리면 `cdStage`(하단 dock)를 엔진 스텝에서 제외(위치계산·O(n²) `separatePets` 정지), ② CSS가 `.catdock .csprf`/`.ffx .px` 애니 정지 + `will-change` 회수. 시트 속 방(`crStage`/`frStage`)은 보이므로 계속 애니. 닫으면 즉시 재개.
- **백그라운드/화면잠금 전면 정지** (`body.apphidden`): `visibilitychange`·`pagehide`(`cats.js` `_applyAppHidden`)가 배너 CSS 애니(`.pkscene *`)와 무지개 **SMIL**(`svg.pauseAnimations()`), 60초 `reconcilePets` 타이머까지 정지. `pageshow`/복귀 시 재개·`startCatLoop`. 브라우저 hidden 스로틀에 비의존(iOS PWA/TWA 유효).
- **측정 도구**: 개발자 모드 → **성능 HUD**(`togglePerfHud`) — 엔진 fps·활성 무대 수·액터 수·재생 애니 수·상태(SHEET/HIDDEN/LITE)를 상단에 표시. OFF 시 DOM·계산 비용 0. Chrome DevTools(FPS/Paint flashing/Layers)와 함께 실기(아이폰) 전후 비교에 사용.
- 관련 상수/함수: `catLoop` 프레임버짓(`cats.js`), `.catdock`/`.csprf`/`.ffx` CSS 게이트(`styles.css`의 `body.sheet-open`·`body.apphidden` 블록).
