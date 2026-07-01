# 🔥 Firebase 연동 / 배포

이 앱은 이미 Firebase 프로젝트 **`money-bb658`** 에 연결되어 있습니다([public/js/firebase.js](../../public/js/firebase.js)).
남은 설정은 아래 3가지이며, **① DB 규칙은 CLI로 자동 배포**할 수 있고, ②③은 콘솔에서만 가능합니다.

---

## ① DB 보안 규칙 배포 (CLI 자동화) ✅
설정 파일은 만들어 두었습니다: [firebase.json](../../firebase.json), [.firebaserc](../../.firebaserc)

```bash
cd <프로젝트 루트>     # 이 저장소를 받은 폴더 (예: C:/eggarden)

# 최초 1회: 구글 계정 로그인 (브라우저가 열립니다 — 본인이 직접 해야 함)
npx firebase-tools login

# 규칙 배포 (database.rules.json → money-bb658)
npx firebase-tools deploy --only database
```

- `npx` 라서 전역 설치 없이 동작합니다(처음 실행 시 firebase-tools를 잠깐 내려받음).
- `login` 한 번 해두면 자격증명이 저장되어, 이후 규칙을 바꿔도 `deploy` 한 줄이면 끝입니다.
- 콘솔에 복붙할 필요가 없어집니다(복붙 방식도 여전히 가능: 콘솔 → Realtime Database → 규칙).

> **로그인만 본인이 해주면**, 그 다음 `deploy` 는 제가 대신 실행해 드릴 수 있어요.

## ② 이메일/비밀번호 로그인 켜기 (콘솔 전용) ⚠️
Firebase 콘솔 → **Authentication → Sign-in method → 이메일/비밀번호 → 사용 설정**.
(공개 회원가입을 쓰므로 켜져 있어야 함. CLI/API로는 토글 불가.)

## ③ 승인된 도메인 추가 (콘솔 전용) ⚠️
Firebase 콘솔 → **Authentication → Settings → Authorized domains** 에 배포 도메인 추가
(예: `내사이트.netlify.app`). 로컬 테스트는 `localhost` 가 기본 포함.

---

### 왜 ②③은 자동화가 안 되나?
`firebase-tools` 는 Hosting/DB/Functions 등 **리소스 배포**용입니다.
Auth 공급자 활성화·승인 도메인은 Identity Platform(콘솔) 설정이라 CLI 명령이 없습니다.
(gcloud + Identity Toolkit API로 가능은 하나 과한 작업이라 콘솔 클릭이 가장 빠릅니다.)
