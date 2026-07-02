# 🛠️ 개발 환경 / 배포

## 요구 사항

- 빌드 도구·패키지 설치 **불필요**(번들러·트랜스파일 없음). 순수 정적 파일입니다.
- 배포 CLI를 쓸 때만 **Node.js**(npx)가 필요합니다.
- 최신 브라우저(Chrome 권장 — PWA·서비스워커).

## 로컬 실행

서비스워커·`fetch`·상대경로 때문에 `file://` 로 직접 열면 안 되고 **로컬 정적 서버**로 띄워야 합니다. 웹 앱은 **`public/`** 폴더에 있습니다.

```bash
# 저장소 루트에서 — 택일, 아무 정적 서버나 가능
npx serve public                 # http://localhost:3000
# 또는
python -m http.server 8000 -d public   # http://localhost:8000
```

## 테스트

순수 계산 로직(`public/js/util.js` — 돈/통화/정산)은 Node 내장 러너로 단위 테스트합니다(의존성·빌드 없음).

```bash
npm test        # node --test (test/*.test.js)
```

- VS Code를 쓴다면 **Live Server** 확장으로 `public/index.html` 을 열어도 됩니다.
- 로컬에서도 **실제 Firebase**(`money-bb658`)에 붙습니다. `localhost` 는 Firebase 승인 도메인에 기본 포함됩니다.
- 로그인이 되려면 Firebase 콘솔에서 **이메일/비밀번호 로그인이 활성화**되어 있어야 합니다(아래 체크리스트).

## 코드 수정 시 주의

- 모듈 시스템이 없으므로 함수는 전역으로 공유됩니다. 추가 위치·로드 순서는 [code-structure.md](code-structure.md) 참고.
- RTDB 접근은 항상 `wp('...')` 경로 헬퍼로 현재 워크스페이스(`ws/{wsId}`)에 네임스페이스를 겁니다.
- **앱 셸에 새 정적 파일(JS/CSS/아이콘)을 추가하면** `sw.js` 의 `APP_SHELL` 배열에 넣고 `CACHE_VERSION` 을 올려야 사용자에게 즉시 반영됩니다.

## 배포

상세 절차는 `docs/deploy/` 의 가이드 문서에 있습니다.

| 작업 | 명령 / 문서 |
|---|---|
| **웹 배포(Netlify)** | `npx netlify-cli deploy --prod` · [NETLIFY.md](deploy/netlify.md) |
| **DB 보안규칙 배포** | `npx firebase-tools deploy --only database` · [FIREBASE.md](deploy/firebase.md) |
| **안드로이드 APK(TWA)** | PWABuilder로 패키징 · [APK.md](deploy/apk.md) |
| **보안규칙 모델 이해** | [RULES.md](deploy/rules.md) |

> 최초 1회는 `npx netlify-cli login` / `npx firebase-tools login`(브라우저) 이 필요합니다. 이후엔 위 한 줄로 반복 배포됩니다.

## Firebase 콘솔 수동 설정 체크리스트

CLI로 자동화되지 않는 항목입니다(Identity Platform 설정).

- [ ] **Authentication → Sign-in method → 이메일/비밀번호 → 사용 설정**
- [ ] **Authentication → Settings → Authorized domains** 에 배포 도메인 추가(예: `내사이트.netlify.app`)
- [ ] **Realtime Database → 규칙** 에 `database.rules.json` 게시(또는 `firebase-tools deploy --only database`)

## 배포 후 갱신 흐름

- **앱 코드/기능 변경**: Netlify에 다시 배포만 하면 됨. TWA(APK)는 배포된 최신 사이트를 띄우므로 APK 재빌드 불필요.
- **서비스워커 캐시 갱신**: `sw.js` 의 `CACHE_VERSION` 을 올리면 다음 방문 시 새 캐시로 교체.
- **DB 구조/규칙 변경**: `database.rules.json` 수정 → 규칙 재배포 + [data-model.md](data-model.md)·[RULES.md](deploy/rules.md) 동기화.

## 문서 갱신 규칙

코드를 바꾸면 어떤 문서를 같이 손봐야 하는지는 [CLAUDE.md](../CLAUDE.md#문서-최신화-규칙) 의 "문서 최신화 규칙" 을 따르고, 모든 사용자 체감 변경은 [CHANGELOG.md](CHANGELOG.md) `[Unreleased]` 에 한 줄 추가합니다.
