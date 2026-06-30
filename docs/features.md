# 🧩 기능 카탈로그

공유 가계부 앱이 제공하는 기능을 화면·시트 단위로 정리합니다. 데이터 구조는 [data-model.md](data-model.md), 함수 위치는 [code-structure.md](code-structure.md) 참고.

## 화면 구성 — 하단 4탭 + 거래추가 FAB

`index.html` 하단 탭바 기준.

| 탭 | 아이콘 | 화면 | 주요 함수 |
|---|---|---|---|
| 달력 | 📅 | 월 네비게이션 + 요약 + 달력 그리드(일별 수입/지출) / 거래내역 리스트 | `renderCalendar` |
| 리포트 | 📊 | 월 요약·카테고리 도넛차트·6개월 추이 막대차트·멤버별 지출 비교 | `renderStats` |
| (가운데) **＋** | ➕ | 거래 추가/편집 시트 | `openTxSheet` |
| 자산 | 🏦 | 결제수단 목록·잔액·카드 실적·선불/포인트 요약·적금 목표 | `renderAssets` |
| 더보기 | ☰ | 설정·관리 메뉴 허브 | `renderMore` |

상단바에는 **워크스페이스 칩**(현재 가계부 전환), **테마 토글**(🌙/☀️)이 있습니다.

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
- 거래에는 카테고리·계좌(from/to)·날짜·설명·메모·기록자(user)·목적별 가계부 연결·카드실적 포함 여부 등이 붙습니다.
- **필터**: 타입(지출/수입/이체)·키워드 검색 칩으로 거래내역을 거릅니다.
- **CSV 내보내기**: 더보기 → 📤 (`exportCSV`).

## 워크스페이스 (개인 / 그룹 공유)

이 앱의 핵심 — 모든 가계부 데이터는 워크스페이스(`ws/{wsId}`) 단위로 격리됩니다.

- **개인 가계부**: `type:'personal'`, 멤버 1명. 가입 시 자동 생성(`createPersonalWorkspace`).
- **그룹 가계부**: `type:'group'` + **6자리 초대코드**. 코드를 아는 사람은 즉시 멤버로 합류(`joinByCode`). 그룹 안에서는 서로의 거래까지 공동으로 읽고 씁니다.
- **멤버 역할**: owner(👑) / member(👤). 멤버 목록·코드 공유는 그룹 관리 시트(`openGroupManageSheet`).
- **전환**: 상단 워크스페이스 칩 또는 더보기 → 가계부 전환(`switchWorkspace`).
- **나가기/정리**: 마지막 멤버가 나가면 워크스페이스·코드까지 삭제(`leaveWorkspace`).
- **v2→v3 자동 이전**: 구버전 전역 데이터가 있으면 로그인 시 "공유 가계부" 그룹으로 1회 이전(`migrateLegacyIfNeeded`).

## 결제수단 / 자산

- **계좌 타입**: 현금·은행계좌·신용카드·체크카드·선불충전금·포인트·간편결제·상품권·기타 (`ACCT_TYPES`).
- **제공사**: 직접·네이버페이·쿠팡·카카오페이·토스·기타 (`PROVIDERS`).
- **공개 범위**(`visibility`): 전체 공개 / 잔액만 공개 / 개인만 보기 (`VISIBILITY`). UI 단에서 필터링.
- **소유자**: 멤버 이름 또는 "공동".
- 초기 잔액·색상·메모, 잔액 자동 계산(거래 흐름 반영).
- **선불·포인트** 계좌는 자산 탭에서 별도 잔액 요약.

## 카드 실적 (신용/체크카드)

- 카드별 **월 실적 기준 금액**(`monthlyPerformanceTarget`).
- 실적 기간: 달력 월 / 사용자지정 시작일(`performancePeriodType`, `performanceStartDay`).
- 거래별 실적 포함 토글·금액·제외 사유, **실적 제외 카테고리**, **선불충전 실적 포함** 옵션.
- 자산 탭과 카드 실적 시트(`openCardList`)에서 진행률 시각화.

## 예산 (Budget)

- **총예산** 또는 **카테고리별 예산**.
- 기간: 주간/월간/연간/사용자지정 (`periodType`).
- 범위: 공동(group) / 개인(personal).
- 80% 등 임계치 경고(`alertEnabled`, `alertThreshold`).
- 진행률 막대 색상: 초록(0–80%)→노랑(80–90%)→주황(90–100%)→빨강(100%+) — `budgetColor`.
- 상세 보기에서 포함된 거래 확인(`openBudgetDetail`).

## 정기결제 / 반복거래 (Recurring)

- 주기: 매일/매주/매월/매년/사용자지정 + 간격(`interval`).
- 상태: active / paused / ended.
- **자동 생성**(`autoCreate`) — 로그인 시 도래한 반복거래를 자동 기록하며, `recurringLogs` 멱등 키로 중복 방지.
- 달력에 "다가오는 반복결제" 표시. 편집은 `openRecurringEdit`.
- 구버전 고정지출(`fixedExpenses`)은 반복거래로 자동 이전(`migrateFixed`).

## 구독 (Subscription)

- 유형: 영상·음악·쇼핑·클라우드·생산성·앱·멤버십·도메인/호스팅·금융·보험·기타 (`SUB_TYPES`).
- 청구주기: 매주/매월/매년/사용자지정. 상태: 구독중/일시정지/취소/만료.
- 체험기간(`isTrial`, `trialEndDate`), 다음 청구일, 만료일, 자동갱신.
- 월/연 환산 금액 계산, 7일 내 청구 예정 알림. 화면: `openSubscriptions`.

## 목적별 가계부 (Purpose Books)

- 유형: 여행·모임/계·데이트/부부·가족·프로젝트·동아리·이벤트·공동지출·기타 (`PB_TYPES`).
- 아이콘·이름·상태(진행중/완료/보관)·예산·기간(시작/종료).
- **정산**(settlement) 활성화 플래그 — 그룹 비용 분담용.
- 거래를 목적별 가계부에 연결. 리포트에서 사용 상위 3개 표시. 화면: `openPurposeBooks`.

## 적금 목표 (Savings)

- 이름·목표액·현재액, 진행률(%) 시각화. 사용자별 관리. 화면: `openSavingsSheet`.

## 기타

- **다크모드** 토글(localStorage 저장, `applyTheme`/`toggleTheme`).
- **PWA 설치**: 홈 화면 추가 배너(`beforeinstallprompt` → `installApp`), 오프라인 앱 셸 캐시.
- **토스트 알림**: 모든 사용자 동작 피드백(`toast`).

> ℹ️ 더보기 메뉴에는 일부 "예정" 항목(대출, 경조사비, 정산, 권한/공동 설정)이 비활성으로 표시됩니다 — 데이터 모델·상수(`REL_TYPES`, `GIFT_EVENT_TYPES`, `people`/`giftEvents`)는 일부 준비되어 있으나 화면은 아직 미구현입니다.
