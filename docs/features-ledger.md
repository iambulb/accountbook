# 💰 가계부(Ledger) 모드 — 기능 상세

> 알뜰의 **두 모드 중 하나**입니다. 상단 **모드 토글(가계부 ↔ 할일)** 로 전환합니다. 전체 개요는 [features.md](features.md), 할일 모드는 [features-todo.md](features-todo.md), 데이터 구조는 [data-model.md](data-model.md), 함수 위치는 [code-structure.md](code-structure.md) 참고.

개인·그룹이 함께 쓰는 공유 가계부. 거래 기록부터 카드 실적·예산·구독·목적별 가계부·정산·경조사비·대출까지 지출 관리를 한 곳에서 합니다. 모든 데이터는 워크스페이스(`ws/{wsId}`) 단위로 격리됩니다(→ 워크스페이스는 [features.md](features.md#공통-기반) 공통 기반 참고).

## 화면 구성 — 하단 4탭 + 거래추가 FAB

가계부 모드 하단 탭바(`_TABSETS.ledger`).

| 탭 | 아이콘 | 화면 | 주요 함수 |
|---|---|---|---|
| 자산 | 🏦 | 결제수단 목록·잔액·카드 실적·선불/포인트 요약·적금 목표 | `renderAssets` |
| 캘린더 | 📅 | 월 네비게이션 + 요약 + 달력 그리드(일별 수입/지출) / 거래내역 리스트 | `renderCalendar` |
| (가운데) **＋** | ➕ | 거래 추가/편집 시트 | `openTxSheet` |
| 리포트 | 📊 | 월 요약·카테고리 도넛차트·6개월 추이·**개인별/공동 지출 분리**·**통화별 지출**(해외통화 있을 때)·**전월비 급증 인사이트**·예산 임계 경고 | `renderStats` |
| 더보기 | ☰ | 설정·관리 메뉴 허브(예산·구독·정기결제·목적별·정산·경조사비·대출·카테고리 + 알뜰홈·설정) | `renderMore` |

## 거래 (Transactions)

추가/수정/삭제 가능하며 9종 타입을 지원합니다. 각 타입은 잔액에 미치는 효과(`from`에서 차감 / `to`에 가산)가 다릅니다 — 정의는 `public/js/constants.js` 의 `TX_EFFECT`.

| 타입 | 라벨 | 아이콘 | 잔액효과 | 통계(실소비) |
|---|---|---|---|---|
| `income` | 수입 | 💰 | to에 가산 | |
| `expense` | 지출 | 💳 | from에서 차감 | ✅ 기본 포함 |
| `transfer` | 이체 | 🔄 | from 차감 + to 가산 | |
| `prepaid_charge` | 충전 | ⤴️ | from 차감 + to 가산 | |
| `prepaid_spend` | 선불결제 | 🛒 | from에서 차감 | ✅ 기본 포함 |
| `refund` | 환불 | ↩️ | to에 가산 | |
| `point_earn` | 포인트적립 | ⭐ | to에 가산 | |
| `point_spend` | 포인트사용 | ✨ | from에서 차감 | ✅ 기본 포함 |
| `balance_adjustment` | 잔액조정 | 🛠️ | to에 가산(음수 허용) | |

- **실소비 여부**(`isActualExpense`)는 거래별로 override 가능 — 리포트 통계 포함을 제어. 기본값은 `ACTUAL_DEFAULT`.
- 거래에는 카테고리·계좌(from/to)·날짜·설명·메모·**소비 대상(user)**·목적별 가계부 연결·카드실적 포함 여부 등이 붙습니다.
- **소비 대상 분리**: 지출/선불결제/포인트사용 거래는 **출금 수단(어느 계좌에서 나갔나)** 과 **소비 대상(누구의 소비인가)** 을 따로 고릅니다. 소비 대상은 워크스페이스 멤버 또는 **`공동`**(집세 등 공동 비용)으로 지정 — 정기거래에도 동일. 리포트의 "개인별 지출/공동 지출"이 이 값으로 집계됩니다. 멤버일 땐 `userUid` 를 병행 저장해 **동명이인·개명에 견고**(`personKey`).
- **필터**: 타입(지출/수입/이체)·키워드 검색 칩으로 거래내역을 거릅니다.
- **이체 분류(곗돈 등)**: 이체 거래도 카테고리를 붙일 수 있음(기본 **곗돈**(🤝) 제공) — 계모임 납입·수령을 이체로 기록해 분류. 이체는 실소비/예산 통계에 미포함이라 지출·수입을 왜곡하지 않음.
- **해외통화(여행용)**: 금액 입력 시 **통화 선택**(USD·JPY·EUR·CNY 등). 외화 선택 시 소수점 입력 가능하고 **환율(원화/1단위)을 입력**하면 원화로 환산돼 저장(`amount`=원화 환산액). 거래에 `currency`·`foreignAmount`·`fxRate`·`fxSource`·`fxDate` 저장, 목록엔 원화+외화 원금 병기. **실시간 환율 자동조회**(frankfurter, 거래일자 반영·일자별 캐시)와 **직접 입력** 모두 지원(🔄 재조회, 실패 시 수동 폴백). 순수 계산 헬퍼 `krwFromForeign`·`fmtForeign`·`sumByCurrency`(`util.js`).
- **CSV 내보내기**: 더보기 → 📤 (`exportCSV`). 해외통화 거래는 `원통화·외화금액·환율·환율원본·환율일자` 컬럼까지 내보내 원본 보존(왕복 가능).

## 달력 / 리포트

- **달력**(`renderCalendar`): 월 네비게이션 + 일별 수입/지출 색점 그리드(`calendarGridHtml`, 월요일 시작) + 선택일 거래(`selectDay`/`selectedDayHtml`). 그룹은 **멤버 칩 필터**(`memberChipRow`/`setMemberFilterByUid`)로 기록자별로 거름. "다가오는 반복결제" 표시.
- **리포트**(`renderStats`): 월 요약·총지출·**CSS 도넛(카테고리)**·6개월 막대·**개인별/공동 지출 분리 바**(`t.user` 집계, `공동` 별도)·**통화별 지출**(해외통화 있을 때)·**전월비 급증 인사이트**·예산 임계 경고·목적별 사용 상위. *Chart.js 미사용 — 순수 CSS 차트.*

## 워크스페이스 (개인 / 그룹 공유)

핵심 — 모든 가계부 데이터는 워크스페이스 단위로 격리됩니다. (공통 기반이라 [features.md](features.md#공통-기반)에도 요약)

- **개인 가계부**: `type:'personal'`, 멤버 1명. 가입 시 자동 생성(`createPersonalWorkspace`).
- **그룹**: `type:'group'` + **6자리 초대코드**. 코드를 아는 사람은 즉시 멤버로 합류(`joinByCode`). 그룹 안에서는 서로의 거래까지 공동으로 읽고 씁니다.
- **멤버 역할**: owner(👑) / member(👤). 관리는 그룹 관리 시트(`openGroupManageSheet`).
- **전환**: 상단 워크스페이스 칩 또는 더보기 → 가계부 전환(`switchWorkspace`).
- **나가기/정리**: 마지막 멤버가 나가면 워크스페이스·코드까지 삭제(`leaveWorkspace`).
- **v2→v3 자동 이전**: 구버전 전역 데이터가 있으면 로그인 시 "공유 가계부" 그룹으로 1회 이전(`migrateLegacyIfNeeded`).

## 결제수단 / 자산

- **계좌 타입**: 현금·은행계좌·신용카드·체크카드·선불충전금·포인트·간편결제·상품권·기타 (`ACCT_TYPES`).
- **제공사**: 직접·네이버페이·쿠팡·카카오페이·토스·기타 (`PROVIDERS`).
- **공개 범위**(`visibility`): 전체 공개 / 잔액만 공개 / 개인만 보기 (`VISIBILITY`). UI 단에서 필터링.
- **소유자**: 멤버 이름 또는 "공동". 초기 잔액·색상·메모, 잔액 자동 계산(거래 흐름 반영).
- **선불·포인트** 계좌는 자산 탭에서 별도 잔액 요약. 화면: `renderAssets`·`openAcctSheet`.

## 카드 실적 (신용/체크카드)

- 카드별 **월 실적 기준 금액**(`monthlyPerformanceTarget`).
- 실적 기간: 달력 월 / 사용자지정 시작일(`performancePeriodType`, `performanceStartDay`).
- 거래별 실적 포함 토글·금액·제외 사유, **실적 제외 카테고리**, **선불충전 실적 포함** 옵션.
- 자산 탭과 카드 실적 시트(`openCardList`)에서 진행률 시각화.

## 예산 (Budget)

- **총예산** 또는 **카테고리별 예산**. 기간: 주간/월간/연간/사용자지정(`periodType`). 범위: 공동(group)/개인(personal).
- 80% 등 임계치 경고(`alertEnabled`, `alertThreshold`). 진행률 막대 색: 초록(0–80%)→노랑→주황→빨강(100%+) — `budgetColor`.
- 상세 보기에서 포함 거래 확인(`openBudgetDetail`). 화면: `openBudgetSheet`/`openBudgetEdit`.

## 정기결제 / 반복거래 (Recurring)

- 주기: 매일/매주/매월/매년/사용자지정 + 간격(`interval`). 상태: active/paused/ended.
- **자동 생성**(`autoCreate`) — 로그인 시 도래한 반복거래를 자동 기록하며, `recurringLogs` 멱등 키로 중복 방지.
- 달력에 "다가오는 반복결제" 표시. 편집 `openRecurringEdit`. 구버전 고정지출(`fixedExpenses`)은 자동 이전(`migrateFixed`).

## 구독 (Subscription)

- 유형: 영상·음악·쇼핑·클라우드·생산성·앱·멤버십·도메인/호스팅·금융·보험·기타 (`SUB_TYPES`).
- 청구주기: 매주/매월/매년/사용자지정. 상태: 구독중/일시정지/취소/만료. 체험기간(`isTrial`), 다음 청구일·만료일·자동갱신.
- 월/연 환산 금액 계산, 7일 내 청구 예정 알림. 화면: `openSubscriptions`.

## 목적별 가계부 (Purpose Books)

- 유형: 여행·모임/계·데이트/부부·가족·프로젝트·동아리·이벤트·공동지출·기타 (`PB_TYPES`). 아이콘·이름·상태(진행중/완료/보관)·예산·기간·참여자·**정산 사용**(`settlementEnabled`).
- 거래를 목적별 가계부에 연결. 리포트에서 사용 상위 3개 표시. 화면: `openPurposeBooks`/`openPbDetail`.
- **여행 PB 상세엔 통화별 지출 요약**(외화 원금+원화 환산 병기, `sumByCurrency`)과 **연결된 할일 요약**([features-todo.md](features-todo.md#목적별-가계부여행-연결))이 함께 표시.
- **기준 통화(여행)**: PB에 기준 통화를 지정하면 그 PB에 연결하는 거래의 **통화 기본값이 자동으로 그 통화**로 설정되고 실시간 환율까지 자동 채워짐(사용자가 직접 고른 통화는 존중).

## 공동 지출 정산 (Settlement)

목적별 가계부에서 **정산 사용**을 켠 경우, 그 안의 공동 지출을 정산할 수 있습니다.

- **거래 입력 시 정산**(선택 PB가 `settlementEnabled`일 때만 노출): 정산 포함 토글 → 결제자·분담 방식(균등 분할/직접 입력/결제자 부담)·참여자·참여자별 부담 금액·메모. 함수 `renderSettleBlock`/`collectSettle`. 순수 계산 `computeSettleAmounts`(`util.js`).
- **정산 계산**(`pbSettleSummary`/`settlementSplit`/`greedySettle`): 참여자별 결제(paid)·부담(owed)·잔액(balance), 단순 최소 송금 제안.
- **목적별 상세 [정산] 탭**(`renderPbSettleTab`): 요약·참여자별 잔액·송금 제안+완료 처리·완료 내역+취소·정산 대상 거래.
- **송금 완료**(`saveSettlementPayment`): `settlementPayments` 노드에 기록(기본은 상태만). 옵션으로 실제 `transfer` 거래 동시 생성(실제소비 미포함).
- 더보기 `정산` 메뉴(`openSettlementOverview`)에서 상태 요약. **중복 집계 방지**: 원본 결제 거래만 실제소비 1회 반영, 정산 송금은 통계·예산·리포트에 미포함.

## 경조사비 관리 (Gift / 경조사)

결혼·장례·돌·생일 등 경조사비 내역과 인맥을 관리합니다. 더보기 → 💐 경조사비(`openGiftBook`).

- **요약**: 보냄 합계·받음 합계·순(받음−보냄). 3탭 — 기록/예정/인맥.
- **기록**(`giftEvents`): 상대·관계(`REL_TYPES`)·유형(`GIFT_EVENT_TYPES`)·방향(줌/받음)·금액·날짜·메모. 상대 이름은 **인맥 자동 등록·매칭**.
- **가계부 거래 연결**(기본 ON): 줌 → `경조사` 지출, 받음 → `경조사비 수령` 수입 거래를 생성하고 `giftEventId`로 연결(🎁 배지). OFF면 장부 기록만. → 줌(지출)은 실제소비 1회 반영, 중복 없음.
- **예정**(`plannedGiftEvents`): 다가올 경조사 등록, `완료` 시 기록 폼 프리필. **인맥**(`people`): 관계·메모, 인맥별 보냄/받음 합계.

## 대출 / 이자 관리 (Loan)

빌린 돈·빌려준 돈, 이자·상환을 관리합니다. 더보기 → 🏧 대출/이자(`openLoanBook`).

- **대출**(`loans`): 이름·방향(빌림/빌려줌)·상대/기관·원금·연이율(%)·시작/만기일·기본 상환계좌. 잔액·이자는 `loanCalc`로 계산(저장 안 함).
- **상세**(`openLoanDetail`): 잔액·원금·누적 이자·상환률 바, **월 예상 이자(잔액×연이율/12, 단리)**, 상태(상환중/완료/연체).
- **상환 기록**(`loanPayments`): 원금 상환 + 이자 입력 → 잔액 자동 차감.
- **거래 연결**(기본 ON): **원금·이자 모두** 실제 거래로 연결해 선택 계좌 잔액에 반영. 빌림 → `대출이자` 지출(실제소비)+`대출상환` 지출(원금, `isActualExpense:false`), 빌려줌 → `이자`·`원금회수` 수입. `loanId`로 연결(🏦 배지). **원금은 부채 상환이라 실소비/예산 통계엔 제외**(잔액만 반영) → 이중집계 없음.

## 적금 목표 (Savings)

- 이름·목표액·현재액, 진행률(%) 시각화. 사용자별 관리. 화면: `openSavingsSheet`.

## 권한 / 공동 (Permissions / Shared)

- **멤버/권한 관리**(소유자 전용, 그룹): 설정 → **멤버 · 권한 관리**(`openGroupManageSheet`)에서 그룹 이름 변경(`renameWorkspace`)·소유자 이전(`transferOwnership`)·멤버 내보내기(`removeMember`). **권한은 앱 UI에서만 게이팅**(보안규칙은 그룹 멤버 공동권한 유지).
- **항목별 공개범위/소유자**: 계좌·카테고리·예산·구독·목적별·경조사비·대출·거래 등 **생성 폼마다 공개범위(전체/개인)·소유자 선택**이 있고, 기본값은 `defaultVisibility`/`defaultOwnerName`/`defaultOwnerUid`가 정한다(`ws/{wsId}/settings`의 `wsSettings`가 있으면 그 값, 없으면 폴백: 공개범위=전체, 소유자=그룹은 공동·개인은 본인).
- *(제거됨)* 별도 **'권한 · 공동 설정' 화면**(`openSharedSettings`, 기본값 변경 UI·개인전용 항목 일괄 공개)은 멤버·권한 관리와 중복·저가치라 삭제. 워크스페이스 기본값(`wsSettings`) 저장 구조와 항목별 선택은 그대로 유지.

## 카테고리

- 기본 카테고리는 `buildDefaultCategories` 시딩(신규 기본은 `migrateCategories`가 기존 사용자에도 추가). **기본 카테고리도 수정·삭제 가능**, 삭제한 기본은 `catDeleted/{name}` 툼스톤으로 재시딩 방지.
- 아이콘 그리드+색 스와치로 편집(`openCatEdit`/`saveCat`, `iconKey` 저장). 색/아이콘 렌더는 `catColor`/`catSvgIcon`/`CAT_META`/`CAT_SVG`. 화면: `openCategorySheet`/`renderCatManage`.
