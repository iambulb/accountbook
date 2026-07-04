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
- **🚨 반복 타일 배경(바닥·벽지 등 집꾸미기 표면)은 반드시 canvas→PNG data URI (사용자 지침·버그 재발 방지)**: `.cr-floor`/`.cr-wall` 같은 방 표면에 픽셀 패턴을 **반복 배경**으로 깔 땐 **반드시 `tileBg()`** 를 쓴다 — canvas에 매트릭스를 1칸=1px로 그린 뒤 `toDataURL()` → `url('data:image/png;base64,…') 0 0 / Npx Npx repeat`. **SVG data URI 를 `background-image` 로 쓰지 말 것** — SVG는 인트린식 크기가 없어 브라우저가 배경으로 **래스터화하지 않아 '회색 화면'만 보이는 버그**가 실제로 났다(width/height 주입으로도 불안정). 크게 반복해도 도트가 안 뭉개지게 대상 요소에 **`image-rendering:pixelated`** + `background-size`(Npx) 를 준다. 새 **바닥(`FLOOR_CATALOG`)·벽지(`WALLPAPER_CATALOG` 의 `tile`)** 도 이 방식(`floorCss`/`wallCss` 가 `tileBg` 호출, id별 캐시 `_tileBgCache`)을 그대로 따르고 `.cr-floor`/`.cr-wall`(dock·홈·친구방·미리보기 4곳)에 `background` 인라인으로 적용한다. **⚠️ dock(메인 캠)은 애니메이션 유지를 위해 방/표면 변경 시 셸을 재생성하지 않고 `onGameChange`가 인라인 배경만 패치한다 — 여기서 `.cr-wall`·`.cr-floor` 를 반드시 "둘 다" 갱신할 것**(하나만 패치하면 그 표면만 메인 캠에서 안 바뀌는 버그: 예전에 벽지만 패치하고 바닥은 빠져 "홈 캠엔 바닥이 뜨는데 메인 dock엔 안 뜸"). 새 반복타일 표면을 추가하면 `onGameChange` 의 dock 패치 목록에도 그 요소를 더한다. (아이콘·스프라이트 같은 **단일 픽셀 그림은 여전히 `pxSvg` SVG** — 이 규칙은 '반복 배경 타일'에만 해당.)
- **픽셀로 그리는 대상(브랜드·게임·장식)**: 앱 아이콘(`icons/icon.svg`·`icon-192/512`)·로그인 로고(`icons/egg-garden.svg`)·한글 워드마크(`icons/wordmark-altteul.svg`)·펫 스프라이트·가구·은화/금화·펫알/랜덤박스 등. 새 요소도 **같은 격자·톤·팔레트**를 따른다.
- **예외 — 기능 UI 아이콘은 라인(stroke) SVG**: 상단바·탭바 등 **네비게이션/기능 아이콘은 라인 아이콘**(`viewBox="0 0 24 24"`, `fill:none`, `stroke:currentColor`, `stroke-width≈1.8~2`, `stroke-linecap/join:round`)으로 이미 통일돼 있다. 이 부류는 라인 스타일을 유지한다(픽셀로 바꾸지 말 것). 정리하면 **기능 아이콘 = 라인, 브랜드·게임·장식 = 픽셀**.
- **재사용·제작**: 매트릭스 도트는 `cats.js` 의 `M_*` 매트릭스 + `pxSvg()`/`FURN_PALS` 패턴을 재사용한다. 로고·워드마크처럼 큰 씬은 스크립트로 rect 를 생성하되(파이썬 PIL 로 미리보기 렌더해 눈으로 확인 후 확정), 결과는 `crispEdges` SVG 로 저장. 색은 항상 **CSS 변수**(다크모드 대응)를 쓴다.
- **게임(펫) 요소·연출·아이콘은 무조건 픽셀 아트 (사용자 지침, 중요)**: 펫·가구·소비템·펫알/랜덤박스 등 **게임 요소와 그 아이콘, 그리고 오픈(뽑기) 연출까지 전부 픽셀(도트) 아트**로 만든다. 연출의 **빛/섬광/광선/틈새빛도 둥근 글로우·오오라·`border-radius:50%`·`radial/conic-gradient`·`blur` 금지 → 도트 선버스트(`M_RAYS`/`raysSvg()`)·디더 오오라(`M_AURA`/`auraSvg()`)·트윙클(`M_SPARK4`/`sparkSvg()`) 같은 픽셀 요소**(`image-rendering:pixelated`·`steps()` 애니)로 표현하고, **빛 색은 등급색 톤**(`tierInfo(tier).color`, `currentColor` 상속)을 따른다. 오픈 순간의 빛은 **은은한 오오라+바깥으로 퍼지는(발산·파문) 광선**(`lightLayers()`, 회전 금지)으로, 방사 버스트는 **카디널 광선을 빼고 12갈래를 어긋나게** 그려 "십자"로 안 보이게 한다. 등장 후엔 큰 광선을 빼고 **펫 주변에 작은 오오라+트윙클 반짝임만**, **화면 정중앙이 아니라 펫(아트) 중심에 정렬**(`.fx-art` 안 `.fx-aurawrap`/`.fx-twinkles`)한다. 펫알은 탭할수록 균열이 커지고 **3번째 탭에서 크게 갈라져(`M_EGG_C3`) 틈새로 등급색 픽셀 빛이 새어나온다**(`eggCrackSvg()`). 뽑기 FX 구현은 `cats.js` 의 `runGachaFx`/`fxTap`/`fxClimax`/`fxBurst`/`fxReveal`+`lightLayers`/`fxAuraTwinkles` + `styles.css` 의 `.fx-*`·`.ll-*`(도트 기반). 앞으로 이 부류에 벡터 글로우·이모지를 쓰지 말 것.
- **🚨 새로 추가하는 모든 아이콘은 픽셀아트로 (사용자 지침·필수)**: 앞으로 UI에 **새로 넣는 아이콘·엠블럼·삽화**(온보딩·빈 상태·안내 카드·배지·시트 항목·리스트 아이콘 등)는 **이모지(👛🐱…)나 즉석 라인/벡터 아이콘을 그대로 쓰지 말고 반드시 픽셀 아트로 디자인해서 적용**한다. ① 먼저 기존 픽셀 헬퍼를 재사용: `coinSvg`(은화)·`goldSvg`(금화)·`peopleSvg`(사람들)·`heartSvg`(하트)·`giftSvg`(선물)·`eggSvg`/`boxSvg`(펫알·박스)·`gearSvg`(설정)·`catFace`/펫 스프라이트 등. ② 마땅한 자산이 없으면 `cats.js`에 새 **`M_<이름>` 매트릭스 + 팔레트 + `pxSvg()`** 로 픽셀 아이콘을 만들어 쓴다(색은 CSS 변수·다크모드 대응). **예외는 이미 라인으로 통일된 상단바·탭바 네비게이션 아이콘뿐** — 그 외 새로 추가되는 모든 그래픽은 픽셀이 기본이자 필수다. (이모지를 폴백으로만 남기는 건 허용하되, 픽셀 헬퍼가 있으면 반드시 그걸 쓴다.)
- 새 픽셀 자산을 추가하면 `sw.js` `APP_SHELL`+`CACHE_VERSION` 과 관련 문서도 함께 갱신한다(아래 "문서 최신화 규칙").

## Git · 커밋 · 머지 · 배포 규칙 (중요)

- **커밋·머지·푸시는 사용자가 명시적으로 지시할 때만** 수행합니다. 작업(코드 수정)이 끝났다고 **자동으로 커밋하지 않습니다** — 기본값은 변경을 **워킹트리에만** 남기고, 사용자가 "커밋해줘"라고 할 때만 커밋합니다.
- **`main`(운영 브랜치)에 직접 커밋·머지 금지.** 개발은 **별도 개발 브랜치**(기본 `develop`)에서 진행하고, `main`으로의 머지는 사용자가 **"머지해줘"라고 명시할 때만** 진행합니다.
- **운영 배포**(`npx netlify-cli deploy --prod`, `firebase-tools deploy` 등)도 **사용자 지시가 있을 때만** 실행합니다. 임의로 배포하지 않습니다.
- 요약: 파일 편집은 자유롭게 하되, **커밋/머지/푸시/배포는 전부 사용자 승인제**입니다.

### 🔒 운영 유출 금지 — 개발자/내부 내용은 사용자 대면 '소식·업데이트 내역'에 절대 넣지 말 것 (사용자 지침·크리티컬)

- 앱 내 **소식 화면 → 업데이트 내역**은 **일반 사용자에게 그대로 노출**된다. 소스는 `cats.js` 의 **`NOTICES`**(기본값) + **RTDB `config/notices`**(관리자 쓰기·전체 읽기, `loadNotices`로 실시간 반영). **개발용 `docs/CHANGELOG.md` 와는 완전히 별개다.**
- **개발자 모드·치트·내부 도구·재화 지급·디버그 등 비공개 변경은 `NOTICES`/`config/notices` 에 넣지 않는다.** 운영 배포 때 이런 프라이빗 정보가 사용자에게 새면 크리티컬하다. 사용자 대면 문구만(기능·수정·이벤트 중 공개해도 되는 것) 넣는다.
- **방어 코드**: `updateNotices()` 가 `isPromoNotice`(홍보)와 **`isDevNotice`(개발자/내부 키워드: 개발자·디버그·치트·재화 지급·콘솔 등)** 를 필터링해, 실수로 `config/notices` 에 들어가도 사용자 화면·뱃지에 뜨지 않게 한 번 더 막는다. 그래도 **1차 방어는 "애초에 넣지 않기"** 다.
- 즉, `CHANGELOG.md`(개발 문서)에는 개발자 기능을 자유롭게 적되, **사용자 업데이트 내역(NOTICES/config/notices)에는 옮기지 말 것.**

## 아키텍처 / 코딩 규칙

- **워크스페이스 격리가 핵심**: 모든 가계부 데이터는 `ws/{wsId}/` 아래에 저장됩니다. RTDB에 접근할 땐 **항상 경로 헬퍼 `wp('...')`** 를 써서 현재 워크스페이스에 네임스페이스를 거세요(예: `wp('transactions')` → `ws/{wsId}/transactions`). 비멤버는 `ws/{wsId}` 를 read/write할 수 없습니다.
- **모듈 시스템 없음 — 전역 함수 패턴**: 번들러가 없고, 모든 함수·상수가 전역(window) 스코프를 공유합니다. HTML `onclick` 에서 전역 함수를 직접 호출하므로, **새 함수는 호출되는 곳보다 먼저(위 파일에) 정의**하고 이름 충돌을 피하세요. 로드 순서: `firebase.js → constants.js → core.js → views.js → main.js`.
- **Firebase compat SDK 필수**: `firebase-*-compat.js` 빌드를 사용합니다(모듈형 SDK 아님).
- **RTDB 규칙은 순수 JSON**: `database.rules.json` 에는 주석·추가 키를 넣지 마세요. 멤버십(`workspaces` 쓰기)이 먼저 커밋된 뒤에야 `ws` 쓰기가 통과하므로, 합류·생성은 2단계로 처리합니다.
- **단방향 렌더**: RTDB 리스너가 데이터를 받을 때마다 `rerender()` 로 현재 화면을 다시 그립니다. 상태는 전역 `state` 객체에 모읍니다.
- **XSS 방지**: 사용자 입력은 `escapeHtml()` 후 `innerHTML` 에 넣습니다.
- **⭐ 소유자·소비대상(person 필드)은 이름으로 저장·표시**: `ownerOptions`(계좌 소유자 `aOwner`·거래/정기 소비대상 `sConsumer`/`rConsumer`·할일 담당자 `tdAssign` 등)의 **선택값은 멤버 uid**다. **저장할 땐 `resolveOwnerName()`로 이름으로 정규화**(uid 원문 저장 금지 — 필요하면 `userUid`/`ownerUid`로 uid를 *병행* 저장), **화면 표시·필터 비교할 땐 `ownerName()`로 해석**한다. 이 규칙을 어기면 자산·거래에 `455ab…` 같은 **uid가 그대로 노출**된다(실제 발생했던 버그). 거래는 이미 이 패턴(`user`=이름+`userUid`=uid)을 따르니 새 person 필드도 동일하게.
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

방(펫캠·홈)에 배치하는 가구는 **외부 이미지 없이 인라인 도트(SVG 픽셀 매트릭스)** 로만 그린다(`cats.js`). 새 가구를 추가·수정할 땐 아래를 **모두** 맞춰야 그림·크기·상호작용·배치가 일관된다. 가구별 값의 단일 소스는 **① `ITEM_CATALOG`(정의) ② `M_<이름>`(도트) ③ `FURN_PALS`(팔레트) ④ `ROOM_H`(렌더 높이) ⑤ `FURN_ASPECT`(가로세로비) ⑥ `FURN_ANIM`(캠 연출, 선택) ⑦ `furnSpot`(펫 상호작용, 선택)** — 새 가구는 이 곳들을 함께 채운다.

- **정의(카탈로그)**: `ITEM_CATALOG` 에 `{ id, name, price, size, footW, footH, desc }` 추가. `footW×footH`=배치 격자 점유 칸(가로×세로), `size`=팔레트/썸네일 표시 배율, `price`=은화. 상점 "가구" 탭·팔레트·격자·회수/판매가 이 목록을 공유한다.
- **등급·가격은 "기본값" — 전역 오버라이드 가능(가구·벽지·바닥 공통)**: 기본값은 등급=`ITEM_TIER`/`WALL_TIER`/`FLOOR_TIER`(미지정=`normal`), 은화 구매가=`ITEM_CATALOG`/`WALLPAPER_CATALOG`/`FLOOR_CATALOG`의 `price`. 개발자 모드 **'기구물 관리'(`openDevFurnManager`)의 타입 탭(가구·벽지·바닥)** 에서 **RTDB `config/furniture`·`config/wallpaper`·`config/floor` `/{id}:{tier,price}`** 로 **전역(모든 사용자) 오버라이드**한다(`loadFurnCfg`/`loadWallCfg`/`loadFloorCfg` 구독 → 등급은 `effItemTier`/`effWallTier`/`effFloorTier`, 가격은 `itemBuyPrice`/`wallBuyPrice`/`floorBuyPrice`가 병합; 쓰기=관리자 이메일만). **특별(epic)↑ 등급은 `isGachaOnlyItem`/`isGachaOnlyWall`/`isGachaOnlyFloor`로 자동 랜덤박스 전용**(알뜰샵 직접구매 차단·`boxPool` 편입) — 새 항목도 등급만 특별↑로 두면 자동 적용. **코드에서 구매가를 읽을 땐 카탈로그 `price`가 아니라 `itemBuyPrice`/`wallBuyPrice`/`floorBuyPrice`** 를 쓴다.
- **바닥 아이템(선택, `floor:true`)**: 러그처럼 **높이 없이 바닥에 깔리고 위에 다른 가구를 올릴 수 있는** 장식은 카탈로그에 `floor:true` 를 준다. `isFloorItem(id)` 가 이를 읽어 ① `occupiedCells()` 에서 **점유칸을 빼(다른 가구를 안 막음)**, ② `areaFree(...,floorItem=true)` 로 **겹쳐 놓기를 허용**(격자 안이면 어디든), ③ `propMarkup()` 에서 **`z-index:0`(맨 뒤)** 로 깔아 그 위 가구가 앞에 그려지게 한다. 펫 상호작용 대상에서도 제외(`avail` 필터). 배치 5경로(placeItemTx·placeClick·드래그 이동 2곳·팔레트 드롭)와 드롭 프리뷰(`showDropPreview`)에 `isFloorItem(...)` 플래그를 함께 넘긴다.
- **도트 아트**: 대문자 1글자=색, `.`/공백=투명인 문자열 배열로 **`M_<이름>` 매트릭스**를 만들고(각 행 글자수 동일), `FURN_PALS` 에 `{글자:색}` 팔레트를 추가한 뒤 **`furnMatrix()`/`furnSvg()` 의 `M` 매핑에 등록**한다. 렌더는 `pxSvg()`(crispEdges). 디자인은 **3톤 이상 음영(하이라이트/기본/그림자)+외곽선**의 디테일 픽셀아트로(캣타워·스크래처·화분 톤 참고), **맨 윗줄은 한 줄 비워** 잘려 보이지 않게 한다. 확정 전 **파이썬 PIL로 매트릭스를 PNG로 렌더해 라이트/다크 배경에서 눈으로 검수**한다(가구 6종·스크래처·캣휠 모두 이렇게 확정).
- **채움 상태(fill)**: 상태가 바뀌는 가구(밥그릇=빈/사료, 물그릇=빈/물)는 **상태별 매트릭스를 따로** 두고 `furnRoomSvg(itemId,key)` 에서 분기한다(빈 그릇=`M_BOWL` 공용, 채우면 `M_BOWL_FOOD`/`M_WATERBOWL_WATER`). **채움이 정확히 겹치도록 바깥 실루엣은 상태마다 동일**하게 그린다. 화장실 위 똥은 별도 오버레이(`M_POOP`)라 매트릭스에 안 그린다.
- **크기·원근**: `ROOM_H[id]`(방 렌더 높이 배율 — 클수록 큼, 캣타워 6.2 최대)와 `FURN_ASPECT[id]`(그래픽 가로세로비 = **매트릭스 `cols/rows` 그대로**)를 반드시 지정. 미지정 시 기본 1이라 작게·정사각으로 나온다. `furnRoomH()` 가 depth(뒤로 갈수록 작게)·`ROOM_H` 로 실제 픽셀 높이를 낸다. **⚠️ 점유칸(`footW`/`footH`)을 바꾸면 `ROOM_H` 도 그에 맞춰 조정**한다 — 배치 칸만 줄이고 렌더 높이를 그대로 두면 캠에서 안 작아진다(예: 스크래처 `footH 2→1`일 때 `ROOM_H 2.9→1.9`, 화분 `footH 2→1`일 때 `ROOM_H 2→1.5`). **디자인은 그대로 두고 크기만 바꿀 땐** `ITEM_CATALOG` 의 `footW/footH` + `ROOM_H` 만 손대고 매트릭스·팔레트·상호작용·`FURN_ASPECT`(매트릭스 안 바꿨으면)는 유지한다.
- **앵커·가림(occlusion)**: `propMarkup()` 이 **가로=발자국 "가운데 정렬 + 양끝 벽 스냅"**(`camAnchorMode`: 왼쪽 열=좌측 밀착, 오른쪽 열=우측 밀착, 그 외=칸 중앙 — CSS `left%`+`--tx`/`translateX`로 픽셀 폭 몰라도 자동 정렬)로 배치하고, 앞줄(`frontRow=r+footH-1`)일수록 **`z-index`를 높여** 앞 가구가 뒤 가구를 덮는다. 펫 상호작용 중심(`buildActors`)은 같은 `camAnchorMode`+그래픽 폭(`fh*furnAspect`)으로 계산해 정렬을 맞춘다. 새 가구도 이 규칙을 그대로 타므로 별도 z-index를 인라인으로 고정하지 말 것(고정하면 깊이 순서가 깨진다).
- **펫 상호작용(선택)**: 펫이 다가가 쉬는 가구만 `furnSpot(a, goal)` 에 `if(it==='<id>') return { lift, face, dx, pose, dur }` 케이스를 추가. `lift`=올라갈 높이(px, `fh` 비례), `face`=바라볼 방향(**정지 시 south=정면**), `dx`=중앙에서 옆 오프셋, `pose`=SVG 폴백 포즈, `dur`=머무는 시간(ms). 스프라이트 펫은 `actorShowStill(a, face)` 로만 정지 비주얼을 바꾼다(위 엔진 불변식). 예) **펫하우스**=출입구 안(정중앙 `dx:0`)에서 `face:'south'`·`pose:'sit'`·작은 `lift`로 정면을 보며 오래 쉼. **상호작용이 없는 배경 가구(화분·화장실 등)는 `furnSpot`에 케이스를 두지 않는다.**
- **캠 전용 연출(애니메이션, 선택)**: 움직이는 가구는 **캠(dock·홈 LIVE)에서만** 돈다. `FURN_ANIM[id] = { type:'spin'|'swing'|'sway'|'drift'|'flicker', move:[움직이는 글자들] }` 를 추가하면 `propMarkup(...,live=true)` 에서 `furnLiveSvg()` 가 **같은 매트릭스를 팔레트만 나눠 base(정지)+fx(움직이는 부품) 두 겹**으로 그린다(도트 유지·정확히 겹침). fx만 `styles.css` 의 `.ffx-<type>`(spin/swing/sway=회전 키프레임, `drift`=좌우 이동 `ffdrift`, `flicker`=불꽃 일렁임 `ffflicker`)로 돌고, **회전·흔들림 중심은 `.ffx-<id>` 의 `transform-origin`**(부품 위치)로 잡는다(캣휠=휠 정중심, 캣타워·스크래처 공=끈 매단 지점, 화분=줄기 밑동). 속도는 `.ffx-<id> .px { animation-duration }` 로 가구별 조정(창문 구름 16s·어항 금붕어 6s). `prefers-reduced-motion` 이면 정지. **미리보기·친구 방·알뜰샵·팔레트는 정적**(`live` 미전달). 회전 픽셀은 각도에서 뭉개지므로 **원형 가구는 정지된 림 안에서 표식(트레드)만 돌리는 식**으로 다듬는다.
- **배치 UI = 꾹 눌러서(롱프레스) 드래그**: 그리드/팔레트 항목은 **`beginLongPress()` 게이트를 거쳐 약 250ms 꾹 누른 뒤에만** 드래그가 시작된다(짧게 탭=그리드는 메뉴/팔레트는 선택 토글). 대기 중엔 스크롤을 막지 않고(임계치 이상 움직이면 취소→화면 스크롤), arm 시 `lockDragScroll()`(body.dragging + `touchmove` preventDefault)로 네이티브 스크롤을 잠근다. `.gitem`은 `touch-action:pan-y` 라 세로 스와이프가 시트 스크롤로 통과한다 — **화면 드래그와 겹치지 않게** 하려는 규칙이니 즉시 드래그로 되돌리지 말 것.
- **문서·캐시**: 가구는 코드로만 그려서 `sw.js` `APP_SHELL` 에 새 파일이 생기진 않지만, `cats.js`/`styles.css` 를 고쳤으면 **`CACHE_VERSION` 을 올린다**. [docs/features.md](docs/features.md)·[docs/CHANGELOG.md](docs/CHANGELOG.md) 갱신, 함수/구조가 늘면 [docs/code-structure.md](docs/code-structure.md) 도 갱신.

## 캠(방·dock) 원근·비율 규칙 (중요·사용자 지침)

펫캠 장면은 **하단 dock 캠(`#cdStage`/`.cd-room`)·내 알뜰홈 방(`#crStage`/`.catroom`)·친구 방(`#frStage`/`.catroom`)** 세 무대가 **완전히 같은 원근·비율**로 보여야 한다(사용자 확정). 앞으로 **펫·모션·가구를 추가하거나 방 넓이를 늘려도 이 비율이 자동으로 유지**되게 만든다 — 무대마다 값을 갈라놓지 말 것.

- **🔒 핵심 불변식 — dock와 방 캠은 같은 원근 세트**: 바닥 **54%** · 벽지 **46%** · 무대(`cr-stage`) **58%**, 벽 경계선(`cr-base`) **bottom:54%**. 이 세트로 **펫 발·가구 바닥·벽지 경계가 뒤(depth 1)에서 한 지점(~54%)으로 수렴** → 펫이 맨 뒤 벽지까지 걸어가 닿는다. dock CSS(`.cd-room .cr-floor/.cr-base/.cr-stage`)는 `.catroom` 과 **같은 %**를 유지한다(예전 dock 66%는 펫이 벽에 못 닿던 버그).
- **깊이→위치 매핑은 양쪽 동일(한 세트)**: ① 펫 발 올림 `riseMax = roomEl.clientHeight * 0.53`(`buildActors`, `applyDepth`가 `rise=depth*riseMax`) ② 가구 바닥 `bottom% = 3 + depth*46`(`propMarkup`, `depth=(12-frontRow)/11`). **이 두 상수(0.53·46)와 위 CSS 3값(54/46/58%)은 한 묶음** — 바꾸려면 세 요소가 뒤에서 계속 수렴하도록 dock·방 **동시에** 조정한다.
- **⚠️ `isDock`는 '크기' 전용, '원근' 아님**: `isDock`(`stage.id==='cdStage'`)은 오직 **크기**에만 쓴다(`furnRoomH` base 11 vs 16, `roomH` 폴백 110 vs 244). **원근 비율(바닥%·`riseMax`·가구 뒤매핑)에는 `isDock` 분기를 절대 넣지 말 것** — 넣는 순간 dock/방이 다시 어긋나 펫이 벽에 못 닿는다(과거 버그: dock `0.61` vs 방 `0.53`).
- **앞(depth 0)은 고정**: 맨 앞 펫 발은 `.cd-actor{bottom:0}`(무대 바닥에 붙음)·가구 `bottom:3%`. 앞부분은 이미 만족 상태이니 건드리지 않는다. 뒤(depth 1)만 위 세트로 벽지에 닿게 한다.
- **새 펫·모션 추가 → 자동 정합**: 펫은 `buildActors` 액터가 되어 이 원근을 그대로 탄다(크기 배율 `petScale`만 개별). **새 펫·새 걷기/포즈 모션도 depth·`riseMax`를 공유하므로 자동으로 같은 캠에 맞는다.** 정지/상호작용 비주얼은 **반드시 `actorShowMoving`/`actorShowStill`·`enterInteract`/`enterPose`만** 거치고("정면 이미지로 이동 금지" 엔진 불변식) depth·rise를 직접 만지지 말 것. 원근 배율(`depthScale` NEAR 1.5·FAR 0.86)·가림 z(`12-depth*11`)도 공유한다.
- **새 가구 추가 → 자동 정합**: `propMarkup`의 `bottom=3+depth*46`·좌측하단 앵커·`z=frontRow` 가림을 그대로 타므로 별도 원근 코드가 필요 없다. 크기만 `ROOM_H`/`FURN_ASPECT`(+dock는 `isDock`로 작게)로 조절하고 z-index를 인라인 고정하지 않는다(기구물 규칙 참조).
- **방 넓이(폭·행) 확장 시**: 가로 폭 `W`는 `stage.clientWidth`로 자동 반영된다. 배치 격자는 **가로 `GRID_N`(12)칸·행→depth(`depth=(12-frontRow)/11`)** 를 기준으로 하므로, **격자 칸수를 바꾸면 공유 헬퍼 `GRID_N`(+`gridLeftFrac`/`gridSpanFrac`/`camAnchorMode`)·`frontRow`·`depth` 분모(11)를 함께** 고쳐 원근을 유지한다. 가로 좌표(에디터 gitem·드롭프리뷰·썸네일=평면, 캠=`camAnchorMode`)는 모두 이 헬퍼로 통일돼 있다. 세로(방 픽셀 높이)만 키울 땐 비율(54/46/58%)은 그대로 두면 픽셀만 커져 자동 정합된다(dock 높이 `.cd-room{height}`·방 `.catroom{height}`).
- **새 캠류 화면을 만들면**: `.catroom`(또는 `.cd-room`)의 **구조(`cr-wall`/`cr-floor`/`cr-base`/`cr-props`/`cr-stage`)와 위 상수 세트를 그대로 재사용**한다. 미리보기(`.miniroom`, 52%·정적)만 예외(펫 없음). 무대 id는 엔진(`activeStages`/`buildActors`)이 알도록 `.catroom`/`.cd-room` 안에 두거나 `crStage`/`cdStage`/`frStage` 관례를 따른다.
- **🧱 벽꾸미기(벽 배치)는 바닥과 별개 레이어**: 벽 가구(`ITEM_CATALOG` `wall:true` — 벽난로·창문·벽시계·행잉플랜트·모빌)는 바닥 `placed`가 아니라 방마다의 **`wallPlaced`**(벽 12×4 격자, `r1`=천장…`r4`=바닥선)에 저장한다. 캠에선 `wallPropMarkup`이 벽면(위 46%)에 그린다 — **가로 앵커는 바닥과 동일**(`camAnchorMode`+`--crtx`), 세로는 벽 밴드 안 `bottom% = WALL_BASE(54) + (WALL_ROWS - r)*WALL_STEP(9.3)`, **깊이 없음**(z:0=뒤 벽면), 크기=`furnWallH`(=`furnRoomH(id,isDock,0)`). 상수(`WALL_COLS 12·WALL_ROWS 4·WALL_BASE 54·WALL_STEP 9.3`)는 **바닥선 54%와 한 묶음**이라 dock·방 공통(원근에 `isDock` 분기 금지). 배치 UI는 **[방꾸미기 | 벽꾸미기] 토글**(`_placeMode`)로 나뉘고 벽은 **탭 배치**(`wallPlaceClick`·드래그 없음), 팔레트는 서로 필터(`isWallItem`). 인벤토리 소진(`sumPlacedItem`)·친구 스냅샷(`repRoomSnapshot`)·정규화(`util.js normRoom`)에 `wallPlaced`를 함께 반영한다.
- **검증·문서**: 캠 비율/원근을 바꾼 뒤엔 **dock·내 방·친구 방 셋 다에서** 앞(발이 바닥에 붙음)·뒤(벽지 경계에 닿음)·가구와 같은 바닥선 정렬을 눈으로 확인한다. `styles.css`/`cats.js` 를 고쳤으면 `CACHE_VERSION`↑ + [docs/CHANGELOG.md](docs/CHANGELOG.md)·[docs/features.md](docs/features.md) 갱신.
