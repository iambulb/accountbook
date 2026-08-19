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

빌드·의존성 없이 **Node 내장 러너**(`node --test`)로 단위/DOM 테스트를 돌립니다. 핵심 순수 로직은 `dual-export` 패턴(브라우저 전역 + Node `module.exports`)이라 그대로 `require` 해서 검증합니다. DOM 테스트는 `jsdom`(devDependency) 하나만 씁니다.

```bash
npm test        # node --test (test/*.test.js)
```

| 테스트 파일 | 대상 |
|---|---|
| `util.test.js` | 통화·날짜·경제 순수 헬퍼(`public/js/util.js`) |
| `ledger-calc.test.js` | 정산(`settlementSplit`·`greedySettle`)·`buildTx`(거래 폼→객체 순수 변환) |
| `delegate.test.js` | 이벤트 위임 인자 강제/속성 빌드(`coerceArg`·`buildActionAttrs`) |
| `delegate.dom.test.js` | jsdom — `data-action` 클릭·`data-change` 변경 디스패치·`toggleSwitch` |
| `badge.dom.test.js` | jsdom — 탭바 미확인 배지 DOM |

> 화면을 컴포넌트로 이관할 때는 그 화면이 쓰는 **순수 로직을 먼저 `dual-export`로 추출해 테스트**한 뒤 이관합니다(검증된 상태로 리팩토링).

- VS Code를 쓴다면 **Live Server** 확장으로 `public/index.html` 을 열어도 됩니다.
- 로컬에서도 **실제 Firebase**(`money-bb658`)에 붙습니다. `localhost` 는 Firebase 승인 도메인에 기본 포함됩니다.
- 로그인이 되려면 Firebase 콘솔에서 **이메일/비밀번호 로그인이 활성화**되어 있어야 합니다(아래 체크리스트).

## 코드 수정 시 주의

- 모듈 시스템이 없으므로 함수는 전역으로 공유됩니다. 추가 위치·로드 순서는 [code-structure.md](code-structure.md) 참고. 계층은 **단일 전역 `App` 네임스페이스**(`App.store`/`App.model`/`App.view`/`App.controller`)로 정리되어 있습니다([architecture.md](architecture.md#-mvc-무빌드-계층-app-네임스페이스)).
- **새 UI 핸들러는 이벤트 위임**을 권장합니다: 템플릿에서 `App.view.act('함수명', ...인자)`(클릭) / `App.view.chg(...)`(변경)로 `data-action`/`data-change` 속성을 만들면 `delegate.js` 디스패처가 `closest()`로 잡아 호출합니다(미등록 액션은 동명 전역 함수 폴백). 기존 인라인 `onclick` 과 공존합니다.
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
- [ ] **Authentication → Templates → 비밀번호 재설정** 이메일 템플릿 활성화(발신자·언어 확인) — 로그인 화면 '아이디·비밀번호 찾기'의 재설정 메일(`sendPasswordResetEmail`)이 실제 발송되려면 필요. 승인 도메인에 배포 도메인이 있어야 링크가 열림.
- [ ] **Realtime Database → 규칙** 에 `database.rules.json` 게시(또는 `firebase-tools deploy --only database`)

## 구글캘린더 연동 셋업 체크리스트 (선택 — 할일 단방향 동기화)

코드만으론 동작하지 않습니다. console.cloud.google.com(프로젝트 **money-bb658**)에서:

> OAuth 동의 화면 관련 메뉴는 콘솔 개편으로 전부 **"Google 인증 플랫폼"(Google Auth Platform)** 아래에 있다(구 "API 및 서비스 → OAuth 동의 화면"). **확인 센터(Verification Center)는 프로덕션 게시 심사용이라 건드릴 필요 없음**(테스트 모드로 운영).

- [ ] **API 및 서비스 → 라이브러리 → Google Calendar API 사용 설정**
- [ ] **Google 인증 플랫폼 → 시작하기**(최초 구성): 앱 이름 "알뜰"·지원 이메일 입력, **대상(Audience)=외부(External)**
- [ ] **Google 인증 플랫폼 → 대상(Audience)**: **게시 상태=테스트 유지** + **테스트 사용자**에 실제 사용자(가족) 구글 계정 등록(최대 100명 — 여기 등록된 계정만 연결 가능. 게시하려면 민감 스코프 검증 심사가 필요하므로 소수 사용자면 테스트 모드로 충분. 앱은 액세스 토큰만 쓰므로 테스트 모드의 리프레시 토큰 7일 제한과 무관)
- [ ] **Google 인증 플랫폼 → 데이터 액세스(Data Access)**: "범위 추가 또는 삭제"에서 `https://www.googleapis.com/auth/calendar.app.created` 추가 → 업데이트 → 저장
- [ ] **Google 인증 플랫폼 → 클라이언트(Clients) → + 클라이언트 만들기 → 웹 애플리케이션** — 승인된 자바스크립트 원본: Netlify 배포 도메인 + `http://localhost:3000`(로컬 `npx serve public`). 리디렉션 URI는 불필요(GIS 토큰 클라이언트는 팝업 방식)
- [ ] 발급된 클라이언트 ID를 `public/js/firebase.js`의 **`GCAL_CLIENT_ID`** 에 기입(비어 있으면 연동 UI·동기화 전체 자동 비활성)

## 배포 후 갱신 흐름

- **앱 코드/기능 변경**: Netlify에 다시 배포만 하면 됨. TWA(APK)는 배포된 최신 사이트를 띄우므로 APK 재빌드 불필요.
- **서비스워커 캐시 갱신**: `sw.js` 의 `CACHE_VERSION` 을 올리면 다음 방문 시 새 캐시로 교체.
- **DB 구조/규칙 변경**: `database.rules.json` 수정 → 규칙 재배포 + [data-model.md](data-model.md)·[RULES.md](deploy/rules.md) 동기화.

## 문서 갱신 규칙

코드를 바꾸면 어떤 문서를 같이 손봐야 하는지는 [CLAUDE.md](../CLAUDE.md#문서-최신화-규칙) 의 "문서 최신화 규칙" 을 따르고, 모든 사용자 체감 변경은 [CHANGELOG.md](CHANGELOG.md) `[Unreleased]` 에 한 줄 추가합니다.
