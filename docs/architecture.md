# 🏗️ 시스템 구성도

공유 가계부는 **빌드 단계가 없는 순수 정적 PWA** 입니다. 프런트엔드(Vanilla JS)가 Firebase(Auth + Realtime Database)에 직접 연결되며, 별도 백엔드 서버가 없습니다(서버리스).

## 컴포넌트 다이어그램

```mermaid
graph TB
    subgraph Client["📱 브라우저 / TWA 앱"]
        SW["Service Worker<br/>(sw.js · 앱셸 캐시)"]
        subgraph Shell["앱 셸 (index.html) — 무빌드 전역 스크립트 · App 네임스페이스로 계층화(MVC)"]
            FB["firebase.js · constants.js<br/>초기화 · 라벨/기본값/TX_EFFECT"]
            CALC["util.js · ledger-calc.js<br/>순수 계산(통화·정산·buildTx) · 단위테스트"]
            CORE["core.js<br/>state · 인증 · 워크스페이스 · RTDB 리스너"]
            MVC["app.js · model.js · delegate.js<br/>App.store · App.model(repo) · 이벤트 위임 브리지"]
            VIEWS["views.js<br/>가계부/할일 화면·시트(App.view 컴포넌트·data-action 위임)"]
            CATS["cats.assets·cats·cats.engine<br/>cats.house·cats.gacha·cats.fx (6분할)<br/>알뜰홈 펫게임: 도트아트·걷기엔진·가챠·FX"]
            MAIN["push.js · main.js<br/>FCM · PWA 부트 · SW 갱신감지 · 접근성"]
        end
    end

    subgraph CDN["🌐 CDN (cache-first)"]
        FBSDK["Firebase SDK 10.7 compat<br/>(gstatic.com)"]
    end

    subgraph Firebase["🔥 Firebase (money-bb658)"]
        AUTH["Authentication<br/>Email/Password"]
        RTDB["Realtime Database<br/>asia-southeast1"]
    end

    Shell -->|로그인/세션| AUTH
    CORE -->|".on('value') 실시간 구독<br/>ws/{wsId}/..."| RTDB
    Shell -.->|로드| FBSDK
    SW -.->|오프라인 셸| Shell

    classDef fb fill:#ffca28,stroke:#333,color:#000
    class AUTH,RTDB fb
```

- **모듈 로드 순서**(`index.html` script 태그): `firebase → constants → util → ledger-calc → core → app → model → delegate → views → cats.assets → cats → cats.engine → cats.house → cats.gacha → cats.fx → push → main`. 모든 함수는 전역(window) 스코프를 공유하며, HTML `onclick`/`data-action` 에서 호출합니다. 자세한 내용은 [code-structure.md](code-structure.md).
- **두 모드**: 상단 모드 토글(`setMode`)로 **가계부**([features-ledger.md](features-ledger.md))와 **할일**([features-todo.md](features-todo.md)) 화면을 오갑니다 — 하단 탭바(`renderTabBar`)와 본문(`rerender`)이 모드별로 전환되고, 데이터는 같은 `ws/{wsId}` 아래에 공존합니다.
- **compat SDK 필수**: `firebase-*-compat.js` 빌드를 사용합니다(모듈형 아님).

## 🧩 MVC 무빌드 계층 (App 네임스페이스)

번들러·ES 모듈 없이 **단일 전역 `window.App` 네임스페이스**로 MVC 계층을 만든다(각 파일이 `App` 슬라이스를 붙임). 전환기에는 **가산적 브리지**로 인라인 `onclick` 과 위임(`data-action`)이 공존한다.

```mermaid
graph LR
    subgraph V["View (views.js · cats.*.js)"]
      T["템플릿 문자열<br/>App.view.act(name,…args)<br/>→ data-action / data-change"]
    end
    subgraph C["Controller (delegate.js)"]
      D["document click/change 위임<br/>closest([data-action]) → 액션 or 전역 폴백<br/>인자강제(n·b·j·e=event)"]
    end
    subgraph M["Model (model.js · ledger-calc.js)"]
      R["App.model.ledgerRepo/wsRepo/authService<br/>순수: settlementSplit·greedySettle·buildTx"]
    end
    subgraph S["Store (app.js)"]
      ST["App.store: 전역 state 래핑<br/>subscribe / emit / patch"]
    end
    T -->|클릭·변경| D
    D -->|액션 호출| R
    R -->|RTDB 쓰기·state 갱신| ST
    ST -->|emit → rerender| V
```

- **`App.store`**(app.js): 기존 전역 `state` 를 같은 참조로 감싼 관찰 스토어(`subscribe`/`emit`/`patch`). RTDB 리스너가 `App.store.emit(reason)` 으로 통지 → 단방향 렌더.
- **`App.model`**(model.js): `ledgerRepo`(wp/attach/CRUD)·`wsRepo`(워크스페이스 lifecycle)·`authService`. 순수 계산은 `ledger-calc.js`(`settlementSplit`·`greedySettle`·`buildTx`)로 분리·단위테스트.
- **`App.view`**(delegate.js·views.js): `define`(컴포넌트 레지스트리)·`act`/`chg`/`ev`(템플릿 헬퍼: 클릭·변경·이벤트 인자). `saveTx` 는 `readTxForm`(DOM) → `buildTx`(순수) → 쓰기·보상으로 분리.
- **`App.controller.delegate`**(delegate.js): document 레벨 **이벤트 위임** — `click`=`data-action`, `change`=`data-change`, 공용 `toggleSwitch` 액션, `data-t="e"` 로 실제 이벤트 주입. 미등록 액션은 동명 전역 함수로 폴백(점진 이관).
- **cats.js 6분할**: 11.7k줄 단일 파일을 **순서보존 위치분할**(연결 blob이 원본과 바이트 동일)로 `cats.assets`(도트 데이터)·`cats`(카탈로그·게임·`@gen` 마커)·`cats.engine`(dock·PiP·걷기엔진)·`cats.house`(홈시트·펫그리드)·`cats.gacha`(가챠·벽꾸미기·소식)·`cats.fx`(뽑기 연출)로 나눔.
- **테스트**: `npm test`(node --test) — 순수 계산(util·ledger-calc·buildTx)·위임 디스패치(delegate, jsdom)·배지 DOM = 100+ 케이스.

## 배포 다이어그램

```mermaid
graph LR
    SRC["소스: public/<br/>(정적 파일)"]

    SRC -->|"npx netlify-cli deploy --prod"| NET["Netlify<br/>정적 호스팅 (publish='public')"]
    SRC -->|"npx firebase-tools deploy --only database"| FBRULES["Firebase RTDB<br/>database.rules.json 게시"]
    NET -->|"공개 HTTPS URL"| PWAB["PWABuilder<br/>(TWA 패키징)"]
    PWAB -->|"서명 APK / AAB"| APK["📱 안드로이드 설치"]
    PWAB -.->|"assetlinks.json"| WK[".well-known/assetlinks.json<br/>(도메인 검증 → 주소창 숨김)"]
    WK --> NET

    classDef console fill:#f8d7da,stroke:#333
```

| 대상 | 도구 | 비고 |
|---|---|---|
| 웹 호스팅 | Netlify CLI | `netlify.toml` 의 `publish="public"`. 자세히는 [netlify.md](deploy/netlify.md) |
| DB 규칙 | firebase-tools CLI | `database.rules.json` → `money-bb658`. [FIREBASE.md](deploy/firebase.md) |
| 이메일 로그인 활성화 / 승인 도메인 | **Firebase 콘솔(수동)** | CLI 불가 — 콘솔에서만 |
| 안드로이드 APK | PWABuilder(TWA) | 배포된 HTTPS 필요. [APK.md](deploy/apk.md) |

## 로그인 → 부트 시퀀스

`auth.onAuthStateChanged` → `enterApp` 흐름. (`core.js`)

```mermaid
sequenceDiagram
    participant U as 사용자
    participant Auth as Firebase Auth
    participant App as enterApp()
    participant DB as RTDB

    U->>Auth: 이메일/비밀번호 로그인
    Auth-->>App: onAuthStateChanged(user)
    App->>DB: users/{uid} 조회 (이름 없으면 생성)
    App->>App: migrateLegacyIfNeeded() (v2→v3 1회)
    App->>DB: loadMyWorkspaces() — users/{uid}/ws
    alt 멤버십 없음
        App->>DB: createPersonalWorkspace() — 개인 가계부 생성
    end
    App->>App: switchWorkspace(activeWs)
    App->>DB: setupListeners() — ws/{wsId}/* .on('value') 구독
    DB-->>App: 실시간 데이터 → rerender()
    App->>U: 달력 화면 표시
```

- 데이터가 비어 있으면 기본 계좌(`buildDefaultAccounts`)·기본 카테고리(`buildDefaultCategories`)를 자동 시딩.
- 워크스페이스 전환 시 `detachListeners()` → 상태 초기화(`resetWorkspaceState`) → 새 `ws/{wsId}` 리스너 재구독.
- 모든 데이터는 Firebase `.on('value')` 실시간 구독이라, 그룹 멤버의 변경이 즉시 반영됩니다.

## 서비스워커 캐시 전략

`public/sw.js` (버전 문자열 예: `eggarden-v3.121.0`). 출처별로 전략이 다릅니다.

```mermaid
graph TD
    REQ["fetch 요청"] --> Q1{"Firebase/Auth<br/>호스트?"}
    Q1 -->|예| NET["네트워크 전용<br/>(캐시 안 함)"]
    Q1 -->|아니오| Q2{"CDN 호스트?<br/>gstatic / jsdelivr"}
    Q2 -->|예| CF["cache-first"]
    Q2 -->|아니오| Q3{"같은 출처<br/>(앱 셸)?"}
    Q3 -->|예| SWR["stale-while-revalidate<br/>(네비게이션은 index.html 폴백)"]
```

| 자원 | 전략 | 이유 |
|---|---|---|
| Firebase RTDB / Auth (`firebaseio.com`, `firebasedatabase.app`, `googleapis.com`, `identitytoolkit`, `firebaseapp.com`) | **네트워크 전용** | 실시간 데이터·인증은 항상 최신 |
| CDN 라이브러리 (Firebase SDK) | **cache-first** | 버전 고정, 거의 안 바뀜 |
| 앱 셸 (HTML/CSS/JS/아이콘) | **stale-while-revalidate** | 빠른 로딩 + 백그라운드 갱신, 오프라인 동작 |

> 앱 셸에 새 파일을 추가하면 `sw.js` 의 `APP_SHELL` 목록과 `CACHE_VERSION` 을 함께 올려야 즉시 갱신됩니다.
