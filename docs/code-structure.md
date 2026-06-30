# 🧱 코드 구조

웹 앱 코드는 모두 **`public/`** 폴더에 있습니다. 빌드 도구·번들러 없이 브라우저가 정적 파일을 그대로 로드합니다. 배포 설정(`firebase.json`·`netlify.toml`·`.firebaserc`·`database.rules.json`)은 저장소 루트, 문서는 `docs/` 입니다.

## 파일별 책임

모두 `public/` 기준 경로입니다.

| 파일 | 줄 수* | 책임 |
|---|---|---|
| `index.html` | ~86 | 앱 셸 — 로그인 화면, 상단바, 탭바, 시트/오버레이 컨테이너, SDK·모듈 로드 |
| `js/firebase.js` | ~17 | `firebaseConfig` + Firebase 초기화(`auth`, `db`). SDK 미로드 시 폴백 화면 |
| `js/constants.js` | ~54 | 라벨/아이콘 맵, 거래효과 테이블(`TX_EFFECT`), 계좌·제공사·구독·목적별 타입, 기본 카테고리(`buildDefaultCategories`) |
| `js/core.js` | ~649 | 전역 `state`, 헬퍼, 테마, 인증, 워크스페이스 부트스트랩, 마이그레이션, RTDB 리스너, 시딩 |
| `js/views.js` | ~1146 | 모든 화면·시트 렌더링(달력·리포트·자산·더보기 + 각종 시트), CSV 내보내기 |
| `js/main.js` | ~70 | PWA 부트(`beforeinstallprompt`·SW 등록·테마) + **접근성 레이어**(`a11yDecorate` + MutationObserver·키보드 델리게이션·Esc·포커스 트랩) |
| `sw.js` | ~84 | 서비스워커 — 앱 셸 캐시, 출처별 캐시 전략 |
| `css/styles.css` | ~245 | 전체 스타일(라이트/다크 테마 CSS 변수) |
| `icons/` | — | 앱 아이콘(`icon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`) |
| `manifest.webmanifest` | — | PWA 매니페스트(이름·아이콘·display) |
| `.well-known/assetlinks.json` | — | TWA(APK) 도메인 검증 |

<sub>*대략치 — 변경 시 갱신.</sub>

## 로드 순서와 전역 의존

`index.html` 하단 script 태그 순서:

```
firebase.js → constants.js → core.js → views.js → main.js
```

- **모듈 시스템 없음**: 모든 함수·상수가 전역(window) 스코프를 공유합니다. `views.js` 가 `core.js` 의 `state`·헬퍼를 직접 참조하고, HTML `onclick="openTxSheet()"` 처럼 전역 함수를 직접 호출합니다.
- 따라서 **새 함수는 호출되기 전(위쪽 파일)에 정의**되어야 하며, 같은 이름의 전역을 중복 정의하지 않도록 주의합니다.
- Firebase는 **compat 빌드** 전역 객체(`firebase`)에 의존합니다.

## `core.js` — 주요 영역

| 영역 | 핵심 함수/객체 |
|---|---|
| 상태 | `state`(uid·wsId·각 데이터 배열·UI 상태), `sheetTx`/`sheetType`/`sheetCat`(시트 임시 상태) |
| 헬퍼 | `won`·`fmtComma`·`parseAmount`·`escapeHtml`·`ymd`·`monthStr`·`$`, 워크스페이스 경로 `wsRoot()`·`wp(path)` |
| 테마 | `applyTheme`, `toggleTheme` |
| 인증 | `setAuthMode`·`signup`·`login`·`logout`, `auth.onAuthStateChanged` |
| 워크스페이스 | `enterApp`·`loadMyWorkspaces`·`createPersonalWorkspace`·`createGroupWorkspace`·`joinByCode`·`leaveWorkspace`·`switchWorkspace`·`resetWorkspaceState`·`updateWorkspaceChip`·`ownerOptions` |
| 권한/공동 설정 | `isWsOwner`·`defaultVisibility`·`defaultOwnerName`·`saveWsSettings`, 소유자 동작 `renameWorkspace`·`transferOwnership`·`removeMember` (core); 화면 `openSharedSettings`·`collectPrivateItems`·`makeItemPublic`·`makeAllPublic` (views) |
| 프로필 | `state.userPhotos`·`loadMemberPhotos`·`saveProfile`·`avatarColor` (core); `avatarHtml`·`resizeImageFile`·`openProfileSheet`·`pickProfilePhoto`·`removeProfilePhoto`·`onSaveProfile` (views) |
| 마이그레이션 | `migrateLegacyIfNeeded`(v2→v3), `migrateFixed`(고정지출→반복), `migrateAccounts/Categories/Budgets/Recurring` |
| 리스너/시딩 | `setupListeners`·`attach`·`detachListeners`, `buildDefaultAccounts`, `maybeBoot`/`rerender` |
| 실제소비/정산 | `isActual`·`actualSpend`, **정산(Step 9)** `settlementSplit`·`greedySettle`·`pbSettleSummary`(순수 계산) |
| 대출 계산 | `loanCalc`(잔액·이자·월예상이자)·`loanSummary`·`loanPaymentsOf`·`visibleLoans` |

> **경로 헬퍼 `wp(path)`** 가 핵심입니다 — `wp('transactions')` → `ws/{현재wsId}/transactions`. RTDB에 접근할 때는 항상 `wp()` 로 현재 워크스페이스에 네임스페이스를 거는 것이 규칙입니다.

## `views.js` — 화면·시트 함수 맵

| 그룹 | 함수 |
|---|---|
| 달력/거래 | `renderCalendar`(msum)·`calendarGridHtml`(월요일·색점)·`selectedDayHtml`/`selectDay`·`memberChipRow`·`setMemberFilterByUid`/`clearMemberFilter`·`openDaySheet` |
| 거래 입력 시트 | `openTxSheet`(시안 골격: `.amtbig`+키패드+칩+상세설정)·`renderTxDyn`·`catChipsHtml`/`pickCat`(칩)·`acctField`(계좌/이체 행)·`consumerField`(**소비 대상** — 출금 수단과 분리, 멤버+공동)·`kpPress`/`kpDel`(키패드)·`renderCardPerfBlock`·`saveTx` |
| 리포트 | `renderStats`(시안: 월네비+총지출+CSS도넛+6개월막대+**개인별/공동 지출 분리 바**(`t.user` 집계, `공동`은 별도 섹션), 예산·목적별·선불 카드 유지)·`statsMonth`(월 이동)·`shortAmt`/`signComma`(표시 헬퍼). *Chart.js 제거 — 순수 CSS 차트* |
| 자산 | `renderAssets`(핸드오프 v2: 순자산 **흰 카드**(`.assethero`, 카드대금 빨강)+`.sech`/`.addbtn` 섹션+**중립 회색** 유형 SVG 계좌행+`.perfrow` 카드실적+`.bgrow` 적금)·`acctIcon`(유형별 라인 SVG)·`acctRowHtml`·`sechHtml`/`PLUS_SVG`(섹션 헤더 헬퍼)·`openAcctSheet`·`openCardList`·`openSavingsSheet` |
| **카테고리 색/아이콘** (core.js) | `CAT_META`(기본 카테고리→핸드오프 솔리드 색+아이콘 키)·`CAT_SVG`(라인 SVG 라이브러리)·`catColor`(기본은 팔레트 오버라이드)·`catSvgIcon`/`catTileStyle`(13% tint 타일)·`hexA`/`svgWrap`. 거래행은 `txRowHtml`+`TX_SVG_KEY`로 카테고리=tint 타일/그 외=중립 타일 |
| 워크스페이스 | `openWorkspaceSheet`·`addPersonalWorkspace`·`openCreateGroupSheet`·`openJoinGroupSheet`·`openGroupManageSheet` |
| 더보기 | `renderMore`(시안: `.prow`+`.grid4`+`.lst`)·`gcell`/`lrow`(그리드·리스트 행 헬퍼)·`MORE_ICON`(SVG 아이콘 맵)·`goHome` |
| 예산 | `openBudgetSheet`·`openBudgetDetail`·`openBudgetEdit` |
| 카테고리 | `openCategorySheet`·`renderCatManage`·`openCatEdit` |
| 정기결제 | `openRecurringList`·`viewRecurringTxs`·`openRecurringEdit`·`renderRecAccts`·`recConsumerField`(소비 대상)·`renderRecCardPerf` |
| 구독 | `openSubscriptions`·`renderSubs`·`openSubDetail`·`openSubEdit` |
| 목적별 | `openPurposeBooks`·`renderPBs`·`pbCard`·`openPbDetail`(탭)·`renderPbTxTab`·`openPbEdit` |
| 정산(Step 9) | 거래시트 `renderSettleBlock`·`setSplitType`·`collectSettle`, 상세 `renderPbSettleTab`·`pbSettleBadge`, 송금 `openSettlePay`·`saveSettlementPayment`·`cancelSettlementPayment`, `openSettlementOverview` |
| 경조사비 | `openGiftBook`·`setGiftTab`·`renderGiftLog/Planned/People`, 기록 `openGiftEdit`·`saveGiftEvent`(거래연결)·`deleteGiftEvent`, 예정 `openPlannedEdit`·`savePlanned`·`completePlanned`, 인맥 `openPersonEdit`·`savePerson`, 합계 `giftSummary`·`personGiftTotals` |
| 대출/이자 | `openLoanBook`·`loanCard`·`openLoanDetail`·`openLoanEdit`·`saveLoan`·`deleteLoan`·`setLoanStatus`, 상환 `openLoanPayment`·`saveLoanPayment`(이자 거래연결)·`deleteLoanPayment` |
| 내보내기 | `exportCSV` |

## 네비게이션 / 렌더 흐름

- 탭 전환은 `go(tab)`(달력/리포트/자산/더보기) — 해당 `render*` 호출.
- 시트(모달)는 `openSheet(title, html)` / `closeSheet()`, 확인 다이얼로그는 `confirmSheet(msg, onYes)`.
- RTDB 리스너가 데이터를 받을 때마다 `rerender()` 로 현재 화면을 다시 그립니다(단방향: 데이터 변경 → 전체 재렌더).

## 코드 스타일

- 주석·UI 라벨·토스트 메시지는 **한국어**.
- 들여쓰기는 기존 파일 관례(JS 본문 4칸 들여쓰기, 한 줄에 압축된 헬퍼 다수)를 따릅니다.
- 사용자 입력은 `escapeHtml` 로 이스케이프 후 `innerHTML` 삽입(XSS 방지).
