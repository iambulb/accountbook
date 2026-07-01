# CLAUDE.md

이 파일은 Claude(및 협업자)가 이 저장소에서 작업할 때 따라야 할 지침입니다. 작업 전후로 이 문서를 기준으로 삼고, **코드를 바꾸면 관련 문서도 같이 갱신**합니다.

## 프로젝트 한눈 요약

- **무엇**: **알뜰집**(영문·코드명 **Eggarden**) — 개인·그룹이 함께 쓰는 공유 가계부 **PWA**(웹앱). 그룹 초대코드로 가족·커플·모임이 같은 가계부를 실시간 공유. *일반 명사 "가계부"는 그대로 쓰되, 앱 제목·브랜드는 `알뜰집`, 영문/코드는 `Eggarden`.*
- **스택**: Vanilla JS(프레임워크·빌드 없음) + Firebase **Realtime Database** + **Auth(Email/Password)** + Chart.js. 서비스워커 PWA. Netlify 호스팅, PWABuilder TWA로 안드로이드 APK.
- **📁 폴더 구조**: 웹 앱은 **`public/`** 아래(`public/index.html`, `public/js/`, `public/sw.js`, `public/css/styles.css`, `public/icons/`, `public/.well-known/`). 배포 설정(`firebase.json`·`netlify.toml`·`.firebaserc`·`database.rules.json`)은 **저장소 루트**. 문서는 루트 `README.md`·`CLAUDE.md` + `docs/`(배포 가이드는 `docs/deploy/`). Netlify는 `publish="public"`.

전체 그림은 [docs/](docs/README.md) 의 문서들을 참고하세요.

## Git · 커밋 · 머지 · 배포 규칙 (중요)

- **커밋·머지·푸시는 사용자가 명시적으로 지시할 때만** 수행합니다. 작업(코드 수정)이 끝났다고 **자동으로 커밋하지 않습니다** — 기본값은 변경을 **워킹트리에만** 남기고, 사용자가 "커밋해줘"라고 할 때만 커밋합니다.
- **`main`(운영 브랜치)에 직접 커밋·머지 금지.** 개발은 **별도 개발 브랜치**(기본 `develop`)에서 진행하고, `main`으로의 머지는 사용자가 **"머지해줘"라고 명시할 때만** 진행합니다.
- **운영 배포**(`npx netlify-cli deploy --prod`, `firebase-tools deploy` 등)도 **사용자 지시가 있을 때만** 실행합니다. 임의로 배포하지 않습니다.
- 요약: 파일 편집은 자유롭게 하되, **커밋/머지/푸시/배포는 전부 사용자 승인제**입니다.

## 아키텍처 / 코딩 규칙

- **워크스페이스 격리가 핵심**: 모든 가계부 데이터는 `ws/{wsId}/` 아래에 저장됩니다. RTDB에 접근할 땐 **항상 경로 헬퍼 `wp('...')`** 를 써서 현재 워크스페이스에 네임스페이스를 거세요(예: `wp('transactions')` → `ws/{wsId}/transactions`). 비멤버는 `ws/{wsId}` 를 read/write할 수 없습니다.
- **모듈 시스템 없음 — 전역 함수 패턴**: 번들러가 없고, 모든 함수·상수가 전역(window) 스코프를 공유합니다. HTML `onclick` 에서 전역 함수를 직접 호출하므로, **새 함수는 호출되는 곳보다 먼저(위 파일에) 정의**하고 이름 충돌을 피하세요. 로드 순서: `firebase.js → constants.js → core.js → views.js → main.js`.
- **Firebase compat SDK 필수**: `firebase-*-compat.js` 빌드를 사용합니다(모듈형 SDK 아님).
- **RTDB 규칙은 순수 JSON**: `database.rules.json` 에는 주석·추가 키를 넣지 마세요. 멤버십(`workspaces` 쓰기)이 먼저 커밋된 뒤에야 `ws` 쓰기가 통과하므로, 합류·생성은 2단계로 처리합니다.
- **단방향 렌더**: RTDB 리스너가 데이터를 받을 때마다 `rerender()` 로 현재 화면을 다시 그립니다. 상태는 전역 `state` 객체에 모읍니다.
- **XSS 방지**: 사용자 입력은 `escapeHtml()` 후 `innerHTML` 에 넣습니다.
- **접근성(A11y)**: `public/js/main.js` 의 `a11yDecorate`(+MutationObserver)가 재렌더 시 자동으로 `.switch`→`role=switch`, `onclick` 달린 `div`→`role=button`+`tabindex`, `.field` 라벨↔입력을 연결하고, 전역 키보드 핸들러가 Enter/Space 활성화·Esc 닫기·포커스 트랩을 처리합니다. 새 UI를 만들 때: 가능하면 `<button>` 사용, 아이콘만 있는 버튼엔 `aria-label` 추가, 폼 입력엔 `id` 부여(라벨 자동 연결). 시트는 `openSheet/closeSheet`(포커스 이동/복원 내장)로 엽니다.
- **언어/스타일**: 주석·UI 라벨·토스트·커밋 메시지는 **한국어**. 들여쓰기·압축 헬퍼 스타일은 기존 파일 관례를 따릅니다.

## 문서 최신화 규칙

작업으로 아래 변화가 생기면 **같은 PR/커밋에서 해당 문서를 갱신**하세요. 이게 이 저장소의 핵심 약속입니다.

| 코드 변경 | 갱신할 문서 |
|---|---|
| 기능 추가·변경·제거 | [docs/features.md](docs/features.md) |
| 데이터 구조·RTDB 경로·보안규칙 변경 | [docs/data-model.md](docs/data-model.md) **+** `database.rules.json` **+** [rules.md](docs/deploy/rules.md) |
| 파일 추가/삭제·주요 함수 구조 변경 | [docs/code-structure.md](docs/code-structure.md) |
| 아키텍처·배포·데이터 흐름 변경 | [docs/architecture.md](docs/architecture.md) |
| 배포 절차·개발환경 변경 | [docs/development.md](docs/development.md) |
| **모든 사용자 체감 변경** | [docs/CHANGELOG.md](docs/CHANGELOG.md) 의 `[Unreleased]` 에 한 줄 추가 |
| 앱 셸에 캐시될 정적 파일 추가 | `public/sw.js` 의 `APP_SHELL` 배열 **+** `CACHE_VERSION` 올리기 |

> 새 기능을 만들거나 변경할 때, 코드만 고치고 문서를 빠뜨리지 마세요. 문서가 코드와 어긋나면 그 자체가 버그입니다.

## 자주 하는 작업

- **로컬 실행**: `npx serve public` (정적 서버 필수, `file://` 금지).
- **웹 배포**: `npx netlify-cli deploy --prod` — [NETLIFY.md](docs/deploy/netlify.md).
- **DB 규칙 배포**: `npx firebase-tools deploy --only database` — [FIREBASE.md](docs/deploy/firebase.md).
- **APK 만들기**: PWABuilder — [APK.md](docs/deploy/apk.md).
- 콘솔 수동 설정(이메일 로그인 활성화·승인 도메인)은 CLI 불가 — [docs/development.md](docs/development.md) 체크리스트 참고.

## 주의

- `public/js/firebase.js` 에는 Firebase 웹 설정값(apiKey 등)이 들어 있습니다. 웹 클라이언트 키라 공개 자체는 정상이지만, **보안은 RTDB 규칙으로** 지켜집니다 — 규칙을 약화시키지 마세요.
- 거래 타입을 추가하면 `constants.js` 의 `TYPE_LABEL`·`TYPE_ICON`·`TX_EFFECT`(잔액효과)·필요 시 `ACTUAL_DEFAULT`(통계 포함)를 함께 정의해야 합니다.
- 동물 에셋: PixelLab zip(고양이·강아지 등 네발 동물)을 처리할 땐 [docs/pet-asset-pipeline.md](docs/pet-asset-pipeline.md) 의 "Pet Asset Pipeline"을 따른다(zip은 `public/assets/pets/_zips/`, id는 `<species>_<색>` 예 `cat_calico`·`dog_corgi`, 산출은 `assets/pets/<id>/`의 `walk.png`+정지 4방향, `PET_CATALOG`(species)·`PET_SPRITES`·`sw.js` APP_SHELL 갱신, id 변경 시 `PET_ID_MIGRATE`로 하위호환).
- **⚠️ 걷기 시트는 반드시 옆(east) 프레임으로**: `walk.png`는 **옆으로 걷는(east) 6프레임**으로만 만든다(엔진이 좌우 이동·`scaleX(-1)` 플립을 east 기준으로 함). 동물은 **정면(south) 이미지로 옆으로 이동해서는 절대 안 된다.** zip에 `Walk/east`(또는 `Walk-<hash>/east`)가 있으면 반드시 그걸로 시트를 만들고(정면 `Walk/south`가 함께 있어도 east 우선), **east 걷기가 아예 없고 south만 있으면** `walk.png`는 정면이 되므로 `PET_SPRITES`에 **`frontWalk:true`를 반드시 지정**한다 — 그러면 엔진이 이동 중엔 걷기 시트를 재생하지 않고 **east 정지스틸**을 보여줘 옆을 보게 한다(정면 슬라이딩 금지). 새 동물 추가 후에는 각 `walk.png`가 east인지(정면 아님) 반드시 확인한다.
- **⚠️ 엔진 불변식 — "정면(south) 이미지로 이동 금지"**: 걷기 엔진(`cats.js`)에서 액터의 이동/정지 비주얼(`.cspr`)은 **반드시 `actorShowMoving(a)` / `actorShowStill(a, face)` 두 함수로만** 바꾼다. `.cspr`의 `.idle`/`.jsw` 클래스나 `--idle`·`background-position`을 **다른 곳에서 직접 조작하지 말 것**(예전 버그: `buildActors`가 DOM을 재사용하면서 쉬던 액터의 정지스틸(`.idle` south)을 지우지 않아, `markCatDirty`로 재빌드된 뒤 **정면 이미지인 채로 이동**했다). 액터는 항상 `roam`으로 시작하므로 `buildActors`는 재빌드 때마다 `actorShowMoving`으로 초기화해 잔여 정지스틸을 없앤다. 이동 표현은 일반=옆(east) 걷기 시트, `frontWalk`=east 정지스틸이며 **어떤 경우에도 south로 이동하지 않는다.** 상태 전환(roam↔pause)·가구 상호작용·포즈를 새로 추가할 때도 이 두 함수를 거치게 한다. 프레임 드랍처럼 보이던 깜빡임은 **이동 액터의 걷기 프레임을 rAF에서 JS가 직접 넘겨(`jsw`)** 해결됨 — CSS `steps()` 걷기(`.cspr` 기본)는 **카드/제자리 표시 전용**이고, 무대에서 이동하는 액터엔 쓰지 않는다.
