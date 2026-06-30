# 📱 APK 만들기 (PWABuilder / TWA)

이 앱은 **PWA**(매니페스트 + 서비스워커 + HTTPS)로 준비되어 있어, 안드로이드 빌드 도구(Android Studio) 없이
**PWABuilder** 클라우드로 서명된 APK를 받을 수 있습니다. (앱은 배포된 사이트를 그대로 띄우는 **TWA** 방식)

> 전제: 이 폴더가 Netlify 등 **공개 HTTPS 주소**에 배포되어 있어야 합니다. (예: `https://내사이트.netlify.app`)

---

## 0. 배포 먼저 (이미 했으면 건너뛰기)
1. Netlify에 배포(`netlify.toml` 의 `publish = "public"` 으로 `public/` 폴더가 사이트 루트로 올라감).
2. **Firebase 콘솔 → Realtime Database → 규칙**에 `database.rules.json` 붙여넣고 **게시**.
3. **Firebase 콘솔 → Authentication → Settings → Authorized domains** 에 배포 도메인 추가.
4. 브라우저(크롬)로 배포 URL 접속 → 정상 로그인/동작 확인.

## 1. PWABuilder 로 패키징
1. <https://www.pwabuilder.com> 접속 → 배포 URL 입력 → **Start**.
2. 점수 화면에서 Manifest / Service Worker / Security 가 모두 통과(초록)인지 확인.
   - 아이콘·매니페스트는 이미 PWABuilder 기준(PNG 192·512 + maskable)으로 맞춰 두었습니다.
3. **Package For Stores → Android** 선택.
4. 옵션 입력:
   - **Package ID**: 고유 식별자. 예) `com.gglee.budget` (한번 정하면 바꾸지 마세요)
   - **App name**: `가계부`
   - **Signing key**: `Create new` (PWABuilder가 새 키스토어 생성)
5. **Download** → ZIP 안에 다음이 들어 있습니다:
   - `app-release-signed.apk` (폰에 바로 설치할 파일) / `.aab` (Play 스토어용)
   - `signing.keystore` + 비밀번호 정보 → **반드시 안전하게 보관**(분실 시 동일 앱 업데이트 불가)
   - `assetlinks.json` (아래 2단계에서 사용)

## 2. URL 주소창 숨기기 (Digital Asset Links)
TWA는 도메인 소유 검증이 되어야 상단 주소창이 사라집니다.
1. ZIP 안의 `assetlinks.json` 을 이 프로젝트의 [`public/.well-known/assetlinks.json`](../../public/.well-known/assetlinks.json) 위치에 **덮어쓰기**.
   - 또는 그 파일을 열어 `REPLACE_WITH_YOUR_PACKAGE_ID` 와 `REPLACE_WITH_SHA256_FINGERPRINT_FROM_PWABUILDER`
     두 값을 PWABuilder가 알려준 값으로 바꾸세요.
2. Netlify에 **재배포**.
3. 확인: `https://내도메인/.well-known/assetlinks.json` 이 JSON으로 열리면 OK.

## 3. 폰에 설치 (사이드로드)
1. `app-release-signed.apk` 를 폰으로 전송(USB/메일/드라이브).
2. 폰: **설정 → 앱 → 출처를 알 수 없는 앱 설치 허용**(해당 파일앱/브라우저에).
3. APK 탭해서 설치 → 홈 화면 아이콘으로 실행.

## 4. 업데이트는 어떻게?
- **앱 내용/기능 변경**: 사이트만 다시 배포하면 됩니다. TWA는 배포된 최신 사이트를 띄우므로 APK 재빌드 불필요.
  (서비스워커 캐시는 `sw.js` 의 `CACHE_VERSION` 을 올리면 즉시 갱신됩니다.)
- **앱 아이콘/이름/패키지 변경 등 네이티브 변경**: PWABuilder로 재빌드하되 **처음 만든 동일 키스토어**로 서명.

## 참고
- 로그인(이메일/비밀번호)은 TWA(전체 크롬 엔진)에서 정상 동작합니다.
- Play 스토어 정식 등록을 원하면 `.aab` 와 동일 키스토어로 콘솔에 업로드하세요(사이드로드만 할 거면 APK로 충분).
- 아이콘 PNG는 `icon.svg` 에서 생성했습니다. 디자인을 바꾸면 `icon.svg` 수정 후 192/512/maskable PNG를 다시 만들어 주세요.
