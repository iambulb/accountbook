# 알뜰(Eggarden) 코드 고도화 로드맵 (분석·검토 결과)

## Context (왜)
사용자 요청: 전체 코드 분석 → 불필요 코드 정리·팩토리/레지스트리 등 **앞으로 꾸준히 고도화하기 쉬운 설계**, 그리고 연출·디자인·캠·사용자 기능에서 **렉/속도저하/버그** 점검. 3개 병렬 감사(아키텍처, 성능, 버그) + 직접 검증(RTDB 규칙·서비스워커·픽업 씬 재생성)으로 교차 확인함.

**이번 세션 결정: 코드 변경 없음 — 아래는 순차 진행용 로드맵.** 각 항목은 항목별 지시가 오면 착수.

## ✅ 진행 현황 (2026-07-30 전수 점검)

권장 실행 순서의 **실행 항목은 모두 구현 완료**로 확인됨(각 항목 본문은 사료로 유지):

| 항목 | 상태 | 확인 근거 |
|---|---|---|
| E1 문서 드리프트 · E2 gitignore · D4 죽은코드 | ✅ 완료 | CLAUDE.md에 "구 NO_GACHA_TIERS 제거" 반영, .gitignore에 프리뷰/캐시(+`_zips/`) 등록, M_DDEUL_FLOOR류 미존재 |
| A1·A2 픽업/리빌 씬 메모이즈 | ✅ 완료 | `_pkSceneCache`/`_sunsetCache`/`_nightCache`(cats.gacha.js) + `invalidateSceneCaches` |
| A4 오프스크린 씬 정지 | ✅ 완료 | `pkObserveScenes`(cats.house.js) — 시트 오픈·리프레시마다 재관찰 |
| B1 앱 셸 버전 내 cache-first · B2 install 견고화 | ✅ 완료 | sw.js — 동일출처 셸 cache-first(버전 원자 갱신), CORE_SHELL `addAll`+EXTRA_SHELL `Promise.allSettled` |
| C1 config 리스너 누수 | ✅ 완료 | `initCatGame`의 `_cfgListenersInit` 세션 1회 가드 + `loadBroadcasts`/`loadMyAdminGifts` off-후-재구독 |
| C2 레거시 루트 금융 노드 · C3 codes squat | ✅ 완료 | database.rules.json에서 레거시 노드 제거, codes/friendCodes `!data.exists()` 가드. + 신규 DB 부팅 보호(`migrateLegacyIfNeeded` 루트 accounts 프로브 try/catch) |
| C4 트랜잭션 중단 무반응 | ✅ 완료 | openGacha 3경로 abort 시 `closeFx()`+토스트, 배치 레이스는 재렌더 원위치 |
| C5 랜덤박스 가구 중복 표시 | ✅ 완료 | 가구 캡 초과 dup 판정 + `dupPay`(무지개동전/은화 환급 표기) |
| D1 ASSET_TYPES 팩토리 · D2 관리핸들러 통합 · D3 catShopHtml 축소 | ✅ 완료 | `ASSET_TYPES`+`effAssetTier`/`assetBuyPrice`(별칭 유지), `setAssetTier` 통합, `surfaceShopGrid` 분리(144→~119줄) |

**의도적 보류(로드맵 자체 판정 유지)**: A3 `_sheetRefresh` 도메인 스코핑(A1 씬 캐시가 비용 대부분 흡수 — 잔여 이득 대비 매핑 위험 중간), A5 pxSvg 소형 memo(A1로 흡수), C6 구매 경로 재검증(발생확률 극히 낮음·완결성 메모), D5 아이콘 레지스트리·D6 거대 함수 분해(후순위·기회성 — 해당 구역을 실제로 고칠 때 함께).

**핵심 결론 3줄**
- 엔진·타이머·리스너·트랜잭션(경제)·XSS 방어는 대체로 **양호**(감사가 정상 확인). 큰 리라이트 불필요.
- **최대 렉 원인은 하나**: 픽업 배너 씬(`pickupSceneHtml`)이 RTDB 업데이트마다 ~255KB/~4,000노드로 통째 재생성됨 → 메모이즈 한 방으로 해소.
- **"알뜰샵 안 열림"의 유력 원인**은 서비스워커 stale-while-revalidate의 **버전 스큐**(앱 셸 파일이 제각각 갱신) — 캐시 전략만 바꾸면 재발 방지.

## 우선순위 표기
- 🔴 P0 = 체감 큰 효과 + 낮은 위험(먼저). 🟡 P1 = 구조/보안, 중간 위험. 🟢 P2 = 폴리시/기회성.

---

## A. 성능 (연출·캠·렌더)

### 🔴 A1. 픽업 씬 메모이즈 — 최우선
- **무엇**: `pickupSceneHtml(mode)` (`cats.js:4064`)가 구름15+무지개아치(95×11)+지평선22+나무5+꽃16+풀18+흙9+돌6+울타리3+나비5+액터2를 매 호출마다 픽셀당 `<rect>`로 재생성(≈4,000노드/255KB).
- **어디서 뜨거운가**: `state._sheetRefresh = ()=>b.innerHTML=build()` (`cats.js:3572, 4880`)가 **모든** `rerender()`(RTDB 리스너 ~30곳, `core.js:1234/1246`)에서 실행 → 알뜰샵 가챠탭(기본탭, `cats.js:3738`)/소식(`cats.js:4999`)이 열려 있으면 파트너의 거래 1건에도 씬 전체 재파싱.
- **결정성**: `pkRand`는 순수 sine-hash(`cats.js:4061`), `LIMITED_PICKUP` 상수 → 출력은 `(mode, 픽업 id)`에만 의존. **캐시 안전.**
- **고치기**: `_pkSceneCache[mode]`로 문자열 1회 생성(픽업/카탈로그 변경 시 무효화). 추가로 `_sheetRefresh` 안에서 배너 DOM 노드를 **보존**(이미 쓰는 `#petGrid` `replaceWith` 기법 `cats.js:3576-3578`처럼)해 재파싱 자체를 회피.
- **효과/위험**: 렉의 80%↑ 제거 / 매우 낮음. **A2·A3·A5도 부분 해소.**

### 🔴 A2. 리빌 연출 씬도 같은 캐시 적용
- `fxReveal`(`cats.js:5205`)이 전설·신화·한정 등장에서 `pickupSceneHtml('reveal')` 재생성 → 뽑기 절정 순간 255KB 파싱으로 히칭. A1의 `_pkSceneCache['reveal']`로 동시 해결.

### 🟡 A3. `_sheetRefresh` 도메인 스코핑
- 현재 어떤 RTDB 쓰기(거래·할일·저금 등)든 열린 시트 전체를 `innerHTML=build()`로 재빌드(`cats.js:2442,2598,2973,2982,4880`; `views.js:697,1865`).
- **고치기**: 변경 도메인이 그 시트에 영향 줄 때만 리프레시(더티 도메인 플래그). 최소한 알뜰샵·소식·도감은 원장 리스너에 반응하지 않게.
- 효과/위험: 중간 / 중간(리프레시 대상 매핑 필요).

### 🟢 A4. 오프스크린 씬 애니 일시정지
- 씬당 상시 애니 ~90개(구름15·나무캐노피~27·꽃/풀34·나비10, `styles.css:1484-1519`). `prefers-reduced-motion`은 이미 광범위 대응(`styles.css:655,960,1115,1204,1535`; `cats.js:3450`)이나, 일반 사용자는 배너가 화면 밖/가려져도 풀가동.
- **고치기**: IntersectionObserver로 `animation-play-state` 토글(안 보이면 정지) + 구름 15개의 `will-change:transform` 제거/축소(영구 컴포지터 레이어 15개 상주 방지).

### 🟢 A5. `pxSvg` 정적 씬 자산 메모
- `pxSvg`(`cats.js:1265`)·`rainbowArcSvg`(`cats.js:1874`)는 셀당 rect를 매번 새 문자열로 생성. 타일 배경만 캐시됨(`_tileBgCache`). 씬의 큰 매트릭스(무지개·나무·구름)가 아웃라이어 → A1로 대부분 흡수. 남으면 `(매트릭스 id, 팔레트, opt.h)` 키 소형 memo.

> **성능 양호(유지)**: 걷기 루프 `catLoop`(`cats.js:3441`)는 transform-only·레이아웃 읽기 1회 캐시(`_footPad`), `document.hidden`에 정지/재개, `_fxClear`로 FX 타이머 일괄 정리, 리사이즈 디바운스 — 잘 되어 있음. `rerender`는 rAF 1회로 coalesce(`core.js:1225`).

---

## B. 신뢰성 (서비스워커/배포) — "알뜰샵 안 열림" 재발 방지

### 🔴 B1. 앱 셸 캐시 전략: 버전 내 cache-first로
- **무엇**: 동일출처 앱 셸이 stale-while-revalidate(`sw.js:812-820`) — 파일마다 **독립·지연** 갱신. `CACHE_VERSION`을 안 올리고 JS/CSS만 배포하면(올릴 곳 6군데라 누락 쉬움) 새 `index.html`과 옛 `cats.js`가 섞인 **프랑켄슈타인 셸** 발생 → 함수/DOM id 불일치로 알뜰샵 등이 조용히 실패. 재시작(=새 내비게이션)하면 정합 세트를 받아 정상 — 실제 증상과 일치.
- **고치기**: 앱 셸(HTML/JS/CSS)은 **버전 내 cache-first**(캐시 반환, 현재 버전 캐시에 네트워크 덮어쓰기 금지) → `CACHE_VERSION` 단위로 원자적 갱신. 또는 내비게이션(HTML)만 network-first로 최신 index를 받고 나머지는 버전 캐시.
- 효과/위험: 스큐 재발 제거 / 낮음(단, 배포 시 `CACHE_VERSION`은 반드시 올려야 갱신됨 — 지금도 규칙).

### 🟡 B2. install 견고화 — 자산 1개 404가 전체 갱신을 막지 않게
- `sw.js:769` `cache.addAll(APP_SHELL)`(~700 URL, `@gen` 펫 목록)은 **하나라도 404면 전체 거부** → 새 SW 미활성 → 모든 사용자가 옛 버전에 **무기한 고정**(에러 무표시).
- **고치기**: `Promise.allSettled` + 개별 `cache.put`(필수 셸만 실패 시 install 실패, 펫 자산은 실패해도 진행) 또는 핵심/부가 셸 분리.

---

## C. 정합성·보안 (사용자 기능)

### 🟡 C1. config 글로벌 리스너 누수(계정 전환)
- `initCatGame`(`cats.js:2136-2143`)의 `loadNotices/loadAnnounce/loadFeaturedPet/loadGachaFx/loadFurnCfg/loadWallCfg/loadFloorCfg/loadBroadcasts/loadMyAdminGifts`가 **선행 `.off()` 없이** `.on()` 부착(형제 `_gameRef` 2131·`watchMyLikes` 2122·`watchCatalogPets` 2739는 off 먼저). `detachListeners`(`core.js:747`)는 `ws/`만 정리 → 로그아웃→로그인 반복 시 리스너 **N중 누적**(공유기기). 트랜잭션 멱등가드(`bcSeen`,`_admClaim`)로 데이터 손상은 없음 → 성능/메모리 누수.
- **고치기**: 각 `load*` 앞에 `.off()` 또는 `initCatGame` 재진입 가드.

### 🟡 C2. RTDB 규칙: 레거시 최상위 금융 컬렉션 전역 노출
- `database.rules.json:86-102`: `accounts/creditCards/categories/budgets/subscriptions/purposeBooks/people/giftEvents/plannedGiftEvents/loans/loanPayments`가 `auth!=null` **read+write**(워크스페이스/uid 스코프 없음). `transactions/savings/recurring/…`는 write는 uid, **read는 전역**. 앱은 `ws/{wsId}/`로 이전됨 → 이들은 레거시 추정.
- **고치기(검증 후)**: 코드에서 이 최상위 경로를 아직 읽/쓰는지 확인 → 미사용이면 규칙 제거 또는 uid/ws 스코프로 잠금. **CLAUDE.md "규칙 약화 금지"** 준수 = 강화 방향이라 OK. (실데이터 있으면 크로스테넌트 유출.)

### 🟡 C3. RTDB 규칙: `codes`/`friendCodes` 임의 덮어쓰기
- `database.rules.json:37-45`: `$code` write가 `auth!=null`뿐 → 아무나 초대/친구 코드 squat·hijack 가능.
- **고치기(검증 후)**: 최소 `!data.exists()`(생성 1회) 조건 추가. **주의**: 워크스페이스 2단계 합류 플로우(CLAUDE.md)와 충돌 안 하는지 확인 후 적용.

### 🟢 C4. 트랜잭션 중단 시 무반응 → 토스트
- 경제 `.then(r=>{ if(r&&r.committed)… })`가 **중단(abort) 시 무토스트·무연출**(`openGacha:4354`,`buyItem:3914` 등). 동시 소비/빠른 더블탭으로 중단되면 "탭했는데 아무 일도 안 남". `else` 분기 안내 추가.

### 🟢 C5. 랜덤박스 중복 가구 — 은화 환급됐는데 표시 안 됨
- `openGacha` 박스분기(`cats.js:4340-4343`)가 `dup`을 floor/wall만 세팅, **item(가구)은 미세팅** → `runGachaFx`에 `refund:0`인데 `grantBoxReward`(`cats.js:4182`)는 20% 환급을 실제 지급. 결과: 은화는 늘었는데 리빌에 "+N 은화(중복)" 미표시 → 혼동. 가구도 `dup/refund` 계산 추가.

### 🟢 C6. 구매 경로의 가챠전용 재검증(경미)
- `buyItem/buyWall/buyFloor`가 트랜잭션 **밖**에서만 `isGachaOnly*` 검사 → 렌더~커밋 사이 관리자가 `config/*/{id}.gacha` 토글 시 은화 구매 가능(발생확률 매우 낮음). 완결성용 메모.

---

## D. 아키텍처·정리 (꾸준한 고도화 효율)

### 🟡 D1. `ASSET_TYPES` 팩토리 — 가구/벽지/바닥 3중복 통합(최대 구조 이득)
- 등급/가격/가챠전용 오버라이드 로직이 3자산×5함수군으로 복제:
  - `loadFurnCfg/loadWallCfg/loadFloorCfg`(`cats.js:4240-4242`), `effItemTier/effWallTier/effFloorTier`(`4216/4168/4190`), `itemBuyPrice/wallBuyPrice/floorBuyPrice`(`4221/4170/4192`), `isGachaOnlyItem/Wall/Floor`(`4227/4188/4187`), `itemTierOf/wallTierOf/floorTierOf`.
- **고치기**: `ASSET_TYPES={furniture:{cfg,path,tierMap:ITEM_TIER,catalog:ITEM_CATALOG}, wallpaper:{…}, floor:{…}}` 테이블 + 제네릭 `effTier(type)/buyPrice(type,id)/isGachaOnly(type,id)`. **기존 이름은 1줄 별칭 유지 → 호출부 변경 0**(글로벌-함수 제약 보존). 모범 선례: `skinPickerHtml(kind)`(`cats.js:4027`).
- 효과/위험: 큼(새 자산 추가가 테이블 1행) / 중간(별칭으로 완화).

### 🟡 D2. 개발자 관리 쓰기 핸들러 9→4 통합
- `setFurnTier/Price/reset/Gacha` × Furn/Wall/Floor(`cats.js:3014-3047`)가 경로·카탈로그·라벨만 다름. D1 테이블 기반 `setAssetTier/Price/resetAsset/setAssetGacha(type,id,…)`로. 펫 아날로그 `setPetTier/setPetGacha`(`3049`)도 동류.

### 🟡 D3. `catShopHtml` 절반 축소
- 144줄(`cats.js:3757-3899`), 최대 함수. `wall`(`3823`)·`floor`(`3806`) 분기가 거의 동일(`skinPickerHtml` 파라미터축과 일치), `cats`·`furn`도 병렬.
- **고치기**: 벽/바닥쌍 `surfaceShopGrid(type)`(D1 재사용) + 공용 `shopCard({thumb,title,desc,price,act})` 템플릿 헬퍼(모든 분기의 `.shopcard` 반복 제거).

### 🔴 D4. 죽은 코드 삭제(안전, ~9줄)
- `M_DDEUL_FLOOR/DDEUL_FLOOR_PAL/ddeulFloorSvg` + `M_DDEUL_CLOUD/DDEUL_CLOUD_PAL/ddeulCloudSvg`(`cats.js:1516-1524`) — 래퍼가 **정의 지점 외 어디서도 미참조**(전 `.js/.html` 확인). `pickupSceneHtml`로 대체된 옛 정원 씬 잔재. (`ddeulEggSvg`는 라이브 — 유지.)

### 🟢 D5. 아이콘 레지스트리(순수 래퍼만, 후순위)
- `M_<name>`+팔레트+`xxxSvg()` 삼종세트 112매트릭스/54래퍼. **순수 passthrough**(`return pxSvg(M_X,X_PAL,opt)`)만 `ICONS` 레지스트리+`icon(name,opt)`로. 분기 있는 것(`eggSvg`·`heartSvg`·`eggCrackSvg`)은 유지. 호출부 많아 churn 큼 → 마지막에.

### 🟢 D6. 거대 함수 기회성 분해
- `views.js`: `renderStats`81(`1072`)·`renderMore`66(`1615`)·`openTxSheet`64(`215`)·`saveTx`64(`505`). `cats.js`: `stepActors`56(`3361`)·`buildActors`46(`3261`). 리라이트 말고 해당 구역 편집 시에만 분할.

---

## E. 문서·위생 (즉시 가능, 사소)

### 🔴 E1. 문서↔코드 드리프트: `NO_GACHA_TIERS`
- 코드는 제거됨(`cats.js:4049` `(구) NO_GACHA_TIERS 제거` 주석)인데 `CLAUDE.md:23`·`docs/CHANGELOG.md:124`·`docs/features.md:56`이 아직 현행 메커니즘으로 서술 → 저장소 자체 규칙상 버그. 현행 `exActive`/`boxPool` 제외 방식으로 갱신.

### 🔴 E2. 루트 개발 스크래치 gitignore
- 미추적: `cat-preview.html`·`cat-preview-gacha.html`·`icon-gallery.html`·`regen-icons.html`·`design_sample/`·`tools/__pycache__/`. `.gitignore`는 현재 `.netlify/node_modules/_sync/`만. `__pycache__/`·`design_sample/`·프리뷰 HTML들을 추가(또는 `dev/`로 이동).

---

## 권장 실행 순서 (착수 시)
1. **E1·E2·D4**(문서/gitignore/죽은코드) — 분·저위험.
2. **A1(+A2)** — 렉 최대 해소(메모이즈+배너 DOM 보존).
3. **B1·B2** — 서비스워커 스큐/견고화(알뜰샵 안 열림 방지).
4. **C1** — 리스너 누수.
5. **D1→D2→D3** — 팩토리(별칭으로 무중단) → 관리핸들러 → 샵카드.
6. **C2·C3** — RTDB 규칙(코드 사용여부 검증 후, 플로우 안 깨게).
7. **A3·A4·C4·C5** — 스코핑/애니정지/트랜잭션 UX.
8. **D5·D6·A5** — 후순위 정리.

## 검증 방법 (각 항목 착수 시)
- **로컬**: `npx serve public` 구동 → 알뜰샵·소식·캠(dock/홈/친구)·가챠(펫알·뜰알·박스·무지개) 연출을 실제로 열어 렉/오류 확인. `node --check public/js/cats.js`(문법).
- **A1/A2**: DevTools Performance로 RTDB 업데이트 시 `innerHTML` 재생성 비용 before/after; 씬 노드 수 확인. 캐시가 픽업펫 변경 시 무효화되는지.
- **B1/B2**: `CACHE_VERSION` 올린 배포 → 하드리로드 없이 새 SW 활성·정합 셸 로드 확인. `APP_SHELL`에 존재하지 않는 URL 하나 넣어 install이 죽지 않는지(allSettled).
- **C1**: 로그아웃→로그인 반복 후 `config/*` 리스너 수(콜백 로그)로 누적 없음 확인.
- **C2/C3**: 규칙 배포 전 `npx firebase-tools database:get`으로 레거시 노드 실데이터 유무 확인; 합류·친구추가·초대코드 플로우 회귀 테스트.
- **D1~D3**: 리팩터 전후 알뜰샵 전 탭(펫/가구/소비/벽지/바닥/가챠)·개발자 기구물관리 동작 동일 확인(별칭으로 호출부 무변경).

## 위험/주의 (전 항목 공통)
- 커밋/머지/푸시/배포는 **사용자 지시 시에만**(dev 브랜치). RTDB 규칙은 **강화만**(약화 금지).
- `cats.js`/`styles.css` 수정 시 `CACHE_VERSION`↑ + 관련 `docs/*`·`CHANGELOG` 갱신(저장소 약속).
- 사용자 대면 `NOTICES/config/notices`에 개발자/내부 내용 절대 금지.
- 동시 편집 상시 발생 → 착수 전 `git fetch` + HEAD==origin 확인, 스테일 되돌림 주의.
