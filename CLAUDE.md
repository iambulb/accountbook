# CLAUDE.md

이 파일은 Claude(및 협업자)가 이 저장소에서 작업할 때 따라야 할 지침입니다. 작업 전후로 이 문서를 기준으로 삼고, **코드를 바꾸면 관련 문서도 같이 갱신**합니다.

## 프로젝트 한눈 요약

- **무엇**: **알뜰**(영문·코드명 **Eggarden**) — 개인·그룹이 함께 쓰는 공유 가계부 **PWA**(웹앱). 그룹 초대코드로 가족·커플·모임이 같은 가계부를 실시간 공유. *일반 명사 "가계부"는 그대로 쓰되, 앱 제목·브랜드는 `알뜰`, 영문/코드는 `Eggarden`.*
- **스택**: Vanilla JS(프레임워크·빌드 없음) + Firebase **Realtime Database** + **Auth(Email/Password)** + Chart.js. 서비스워커 PWA. Netlify 호스팅, PWABuilder TWA로 안드로이드 APK.
- **📁 폴더 구조**: 웹 앱은 **`public/`** 아래(`public/index.html`, `public/js/`, `public/sw.js`, `public/css/styles.css`, `public/icons/`, `public/.well-known/`). 배포 설정(`firebase.json`·`netlify.toml`·`.firebaserc`·`database.rules.json`)은 **저장소 루트**. 문서는 루트 `README.md`·`CLAUDE.md` + `docs/`(배포 가이드는 `docs/deploy/`). Netlify는 `publish="public"`.

전체 그림은 [docs/](docs/README.md) 의 문서들을 참고하세요.

## 디자인 컨셉 — 도트/픽셀 아트 (중요)

이 앱의 비주얼 아이덴티티는 **도트(픽셀) 아트**다. 앞으로 **아이콘·일러스트·엠블럼·연출·브랜드 요소를 추가하거나 바꿀 때 기본 스타일은 픽셀 아트**로 만든다(그냥 예쁜 벡터/이모지로 대체하지 말 것).

- **렌더 방식**: 픽셀 그림은 **문자 매트릭스 → SVG**(`pxSvg()`, `shape-rendering="crispEdges"`) 또는 정수 격자에 1칸=1 rect 로 그린다. 비트맵(PNG)은 `image-rendering:pixelated`. 안티에일리어싱으로 도트가 뭉개지지 않게 한다.
- **픽셀로 그리는 대상(브랜드·게임·장식)**: 앱 아이콘(`icons/icon.svg`·`icon-192/512`)·로그인 로고(`icons/egg-garden.svg`)·한글 워드마크(`icons/wordmark-altteul.svg`)·펫 스프라이트·가구·은화/금화·펫알/랜덤박스 등. 새 요소도 **같은 격자·톤·팔레트**를 따른다.
- **예외 — 기능 UI 아이콘은 라인(stroke) SVG**: 상단바·탭바 등 **네비게이션/기능 아이콘은 라인 아이콘**(`viewBox="0 0 24 24"`, `fill:none`, `stroke:currentColor`, `stroke-width≈1.8~2`, `stroke-linecap/join:round`)으로 이미 통일돼 있다. 이 부류는 라인 스타일을 유지한다(픽셀로 바꾸지 말 것). 정리하면 **기능 아이콘 = 라인, 브랜드·게임·장식 = 픽셀**.
- **재사용·제작**: 매트릭스 도트는 `cats.js` 의 `M_*` 매트릭스 + `pxSvg()`/`FURN_PALS` 패턴을 재사용한다. 로고·워드마크처럼 큰 씬은 스크립트로 rect 를 생성하되(파이썬 PIL 로 미리보기 렌더해 눈으로 확인 후 확정), 결과는 `crispEdges` SVG 로 저장. 색은 항상 **CSS 변수**(다크모드 대응)를 쓴다.
- **게임(펫) 요소·연출·아이콘은 무조건 픽셀 아트 (사용자 지침, 중요)**: 펫·가구·소비템·펫알/랜덤박스 등 **게임 요소와 그 아이콘, 그리고 오픈(뽑기) 연출까지 전부 픽셀(도트) 아트**로 만든다. 연출의 **빛/섬광/광선/틈새빛도 둥근 글로우·오오라·`border-radius:50%`·`radial/conic-gradient`·`blur` 금지 → 도트 별(`M_STAR`/`starSvg()`) 같은 픽셀 요소**(`image-rendering:pixelated`·`steps()` 애니)로 표현하고, **빛 색은 등급색 톤**(`tierInfo(tier).color`, `currentColor` 상속)을 따른다. 펫알은 탭할수록 균열이 커지고 **3번째 탭에서 크게 갈라져(`M_EGG_C3`) 틈새로 등급색 픽셀 빛이 새어나온다**(`eggCrackSvg()`). 뽑기 FX 구현은 `cats.js` 의 `runGachaFx`/`fxTap`/`fxClimax`/`fxBurst`/`fxReveal` + `styles.css` 의 `.fx-*`(도트 기반). 앞으로 이 부류에 벡터 글로우·이모지를 쓰지 말 것.
- 새 픽셀 자산을 추가하면 `sw.js` `APP_SHELL`+`CACHE_VERSION` 과 관련 문서도 함께 갱신한다(아래 "문서 최신화 규칙").

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
| 기능 추가·변경·제거 | [docs/features.md](docs/features.md)(개요) **+** 가계부=[docs/features-ledger.md](docs/features-ledger.md) / 할일=[docs/features-todo.md](docs/features-todo.md) 중 해당 모드 문서 |
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
- 동물 에셋: PixelLab zip(고양이·강아지 등 네발 동물)은 **`python tools/build_pets.py` 자동 파이프라인**으로 추가한다 — 단일 소스 `tools/pets.json`(레지스트리)에서 에셋·`cats.js`(PET_CATALOG/PET_SPRITES/CAT_TIER)·`sw.js`(APP_SHELL+버전)·문서를 `@gen` 마커 사이만 자동 재생성. 흐름: zip을 `_zips/`에 넣고 실행 → `pets.json`에서 이름·등급 확정 → 재실행 → 커밋. 상세·수동 폴백·규칙은 [docs/pet-asset-pipeline.md](docs/pet-asset-pipeline.md). (id는 `<species>_<색>` RTDB 키라 변경 시 `PET_ID_MIGRATE` 하위호환. `@gen` 마커 안은 손으로 고치지 말 것.)
- **⚠️ 걷기 시트는 반드시 옆(east) 프레임으로**: `walk.png`는 **옆으로 걷는(east) 6프레임**으로만 만든다(엔진이 좌우 이동·`scaleX(-1)` 플립을 east 기준으로 함). 동물은 **정면(south) 이미지로 옆으로 이동해서는 절대 안 된다.** zip에 `Walk/east`(또는 `Walk-<hash>/east`)가 있으면 반드시 그걸로 시트를 만들고(정면 `Walk/south`가 함께 있어도 east 우선), **east 걷기가 아예 없고 south만 있으면** `walk.png`는 정면이 되므로 `PET_SPRITES`에 **`frontWalk:true`를 반드시 지정**한다 — 그러면 엔진이 이동 중엔 걷기 시트를 재생하지 않고 **east 정지스틸**을 보여줘 옆을 보게 한다(정면 슬라이딩 금지). 새 동물 추가 후에는 각 `walk.png`가 east인지(정면 아님) 반드시 확인한다.
- **⚠️ 엔진 불변식 — "정면(south) 이미지로 이동 금지"**: 걷기 엔진(`cats.js`)에서 액터의 이동/정지 비주얼(`.cspr`)은 **반드시 `actorShowMoving(a)` / `actorShowStill(a, face)` 두 함수로만** 바꾼다. `.cspr`의 `.idle` 클래스나 `--idle`을 **다른 곳에서 직접 조작하지 말 것**(예전 버그: `buildActors`가 DOM을 재사용하면서 쉬던 액터의 정지스틸(`.idle` south)을 지우지 않아, `markCatDirty`로 재빌드된 뒤 **정면 이미지인 채로 이동**했다). 액터는 항상 `roam`으로 시작하므로 `buildActors`는 재빌드 때마다 `actorShowMoving`으로 초기화해 잔여 정지스틸을 없앤다. 이동 표현은 일반=옆(east) 걷기 시트, `frontWalk`=east 정지스틸이며 **어떤 경우에도 south로 이동하지 않는다.** 상태 전환(roam↔pause)·가구 상호작용·포즈를 새로 추가할 때도 이 두 함수를 거치게 한다. (걷기 프레임은 dev의 **CSS 필름 `csprFilm`**(합성)으로 재생하고 이동은 `setXform`(transform)로 처리해 깜빡임을 없앴다 — `.idle` 제거 시 필름이 돌아가고, 붙이면 정지스틸을 보여준다. 즉 이동 액터도 CSS 필름을 쓴다.)

## 기구물(가구) 규칙

방(펫캠·홈)에 배치하는 가구는 **외부 이미지 없이 인라인 도트(SVG 픽셀 매트릭스)** 로만 그린다(`cats.js`). 새 가구를 추가·수정할 땐 아래를 **모두** 맞춰야 그림·크기·상호작용·배치가 일관된다.

- **정의(카탈로그)**: `ITEM_CATALOG` 에 `{ id, name, price, size, footW, footH, desc }` 추가. `footW×footH`=배치 격자 점유 칸(가로×세로), `price`=은화. 상점 "가구" 탭·팔레트·격자·회수/판매가 이 목록을 공유한다.
- **도트 아트**: 대문자 1글자=색, `.`/공백=투명인 문자열 배열로 **`M_<이름>` 매트릭스**를 만들고(각 행 글자수 동일), `FURN_PALS` 에 `{글자:색}` 팔레트를 추가한 뒤 **`furnSvg()` 의 `M` 매핑에 등록**한다(채움상태가 있으면 `furnRoomSvg()` 도). 렌더는 `pxSvg()`(crispEdges).
- **크기·원근**: `ROOM_H[id]`(방 렌더 높이 배율 — 클수록 큼, 캣타워 6.2가 최대)와 `FURN_ASPECT[id]`(그래픽 가로세로비 = 매트릭스 `cols/rows`)를 반드시 지정. 미지정 시 기본 1이라 작게·정사각으로 나온다. `furnRoomH()` 가 depth(뒤로 갈수록 작게)·`ROOM_H` 로 실제 픽셀 높이를 낸다.
- **앵커·가림(occlusion)**: `propMarkup()` 이 **좌측하단 앵커**로 배치하고, 앞줄(`frontRow=r+footH-1`)일수록 **`z-index`를 높여** 앞 가구가 뒤 가구를 덮는다. 새 가구도 이 규칙을 그대로 타므로 별도 z-index를 인라인으로 고정하지 말 것(고정하면 깊이 순서가 깨진다).
- **펫 상호작용**: `furnSpot(a, goal)` 에 `if(it==='<id>') return { lift, face, dx, pose, dur }` 케이스를 추가. `lift`=올라갈 높이(px, `fh` 비례), `face`=바라볼 방향(**정지 시 south=정면**), `dx`=중앙에서 옆 오프셋, `pose`=SVG 폴백 포즈, `dur`=머무는 시간(ms). 스프라이트 펫은 `actorShowStill(a, face)` 로만 정지 비주얼을 바꾼다(위 엔진 불변식). 예) **펫하우스**=출입구 안(정중앙 `dx:0`)에서 `face:'south'`·`pose:'sit'`·작은 `lift`로 정면을 보며 오래 쉼.
- **배치 UI = 꾹 눌러서(롱프레스) 드래그**: 그리드/팔레트 항목은 **`beginLongPress()` 게이트를 거쳐 약 250ms 꾹 누른 뒤에만** 드래그가 시작된다(짧게 탭=그리드는 메뉴/팔레트는 선택 토글). 대기 중엔 스크롤을 막지 않고(임계치 이상 움직이면 취소→화면 스크롤), arm 시 `lockDragScroll()`(body.dragging + `touchmove` preventDefault)로 네이티브 스크롤을 잠근다. `.gitem`은 `touch-action:pan-y` 라 세로 스와이프가 시트 스크롤로 통과한다 — **화면 드래그와 겹치지 않게** 하려는 규칙이니 즉시 드래그로 되돌리지 말 것.
- **문서·캐시**: 가구는 코드로만 그려서 `sw.js` `APP_SHELL` 에 새 파일이 생기진 않지만, `cats.js`/`styles.css` 를 고쳤으면 **`CACHE_VERSION` 을 올린다**. [docs/features.md](docs/features.md)·[docs/CHANGELOG.md](docs/CHANGELOG.md) 갱신, 함수/구조가 늘면 [docs/code-structure.md](docs/code-structure.md) 도 갱신.
