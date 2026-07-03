# 🔔 푸시 알림(FCM) 설정 — 서버리스

알뜰의 리마인더 푸시는 **Firebase Cloud Messaging(FCM) 웹 푸시** + **GitHub Actions 스케줄 크론**으로 동작한다. 별도 서버·Blaze 플랜이 필요 없다(무료 티어).

## 구성 요소(이미 코드에 포함)
- **클라이언트**: `public/js/push.js`(권한 요청·토큰 저장·포그라운드 수신) + `public/firebase-messaging-sw.js`(백그라운드 알림 표시·클릭 시 앱 열기). 설정 시트에 **알림 토글**(FCM 설정·지원 기기에서만 노출).
- **토큰 저장**: `users/{uid}/push = { token, at, ua }`(본인만 쓰기·admin만 읽음).
- **발송기**: `tools/send_reminders.mjs`(firebase-admin으로 RTDB 읽어 대상 선정 → FCM 데이터 메시지). `--type=daily`(오늘 미기록 넛지)·`--type=gift`(친구 선물 도착).
- **스케줄**:
  - `.github/workflows/reminders.yml` — **일일 넛지**(`--type=daily`, 매일 20:00 KST = 11:00 UTC).
  - `.github/workflows/gift-notify.yml` — **친구 선물 도착**(`--type=gift`, 매시 정각). mailbox에 미수령 선물이 있으면 푸시. 실시간이 아니라 **최대 ~1시간 지연**(스케줄 best-effort). 중복은 `users/{uid}/pushMeta/lastGiftNotify` 워터마크로 방지(발송기 admin이 갱신). 둘 다 수동 실행(dry-run) 가능.

## 활성화 — 두 가지 수동 준비(1회)
> 아래 두 값을 넣기 전까지 알림은 **자동 비활성**(앱은 정상, 토글이 안 뜸 / 크론은 no-op).

### 1) VAPID 웹 푸시 키 → `public/js/firebase.js`
1. Firebase Console → 프로젝트(money-bb658) → **프로젝트 설정 → 클라우드 메시징** 탭.
2. **웹 푸시 인증서(Web configuration)** 에서 키페어 생성/복사(공개키라 노출 정상).
3. `public/js/firebase.js` 의 `const VAPID_KEY = "";` 에 그 값을 붙여넣고 배포(dev push).
   → 설정 시트에 **알림** 토글이 나타나고, 켜면 권한 요청 후 토큰이 저장된다.

### 2) 서비스계정 키 → GitHub Secret `FIREBASE_SERVICE_ACCOUNT`
1. Firebase Console → 프로젝트 설정 → **서비스 계정 → 새 비공개 키 생성**(JSON 다운로드).
2. GitHub 리포지토리 → Settings → Secrets and variables → Actions → **New repository secret**.
   - Name: `FIREBASE_SERVICE_ACCOUNT`, Value: 다운로드한 **JSON 파일 내용 전체**.
3. Actions 탭에서 `push-reminders` 워크플로를 **Run workflow(dry-run 체크)** 로 대상 수 확인 → 정상이면 스케줄이 매일 자동 발송.

> ⚠️ **스케줄 크론은 리포지토리 기본 브랜치에서만 동작한다.** 현재 개발은 `dev`로만 하므로, 스케줄(`push-reminders`·`gift-notify` 둘 다)이 돌게 하려면 **① GitHub 리포지토리 기본 브랜치를 `dev`로 바꾸거나**(Settings → General → Default branch), ② 이 워크플로 파일들을 `main`에 올려야 한다. (수동 `workflow_dispatch`는 해당 브랜치를 골라 실행 가능.)

## 동작·한계
- **iOS**: 웹 푸시는 **홈화면에 설치한 PWA(iOS 16.4+)** 에서만 동작한다(사파리 탭에선 미지원). 안드로이드/데스크톱 크롬은 설치 없이도 동작.
- 알림 권한은 **사용자 제스처**(설정에서 토글)로만 요청.
- 발송은 **데이터 전용 메시지** → 클라이언트 SW `onBackgroundMessage`가 표시(중복 방지).
- 만료 토큰은 발송 실패 시 발송기가 `users/{uid}/push` 를 자동 삭제.
- 리마인더 종류 추가: `tools/send_reminders.mjs` 의 `MESSAGES`/`pick*` 확장 + 워크플로 스케줄/`--type` 추가.

## 보안
- VAPID 키는 공개키라 클라이언트 노출 정상. **서비스계정 키는 비밀** — 반드시 GitHub Secret으로만(코드/커밋에 넣지 말 것).
- `users/{uid}/push` 쓰기는 본인만(기존 `$uid` 규칙), 읽기는 admin(발송기)만 → 규칙 변경 불필요.
