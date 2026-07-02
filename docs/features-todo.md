# ✅ 할일(To-Do) 모드 — 기능 상세

> 알뜰의 **두 모드 중 하나**입니다. 상단 **모드 토글(가계부 ↔ 할일)** 로 전환합니다. 전체 개요는 [features.md](features.md), 가계부 모드는 [features-ledger.md](features-ledger.md), 데이터 구조는 [data-model.md](data-model.md), 함수 위치는 [code-structure.md](code-structure.md) 참고.

개인이 **프로필별로 자기 할일**을 관리하고, 원하면 **같은 그룹의 친구에게 공유**할 수 있으며, 여행·모임처럼 **그룹이 함께 맡는 일**을 나눌 수 있는 공유 할일. 기존 워크스페이스·멤버·실시간 RTDB·펫/게임화를 그대로 재사용합니다.

## 진입 / 화면 구성

- **모드 토글**(상단바): `[가계부 | 할일]` 세그먼트(`setMode`). 선택은 `localStorage('mode')` 로 유지되고, 전환 시 하단 탭바(`renderTabBar`)와 본문(`rerender`)이 모드에 맞게 바뀝니다.
- **할일 모드 하단 탭**(`_TABSETS.todo`): **할일 · 캘린더 · ＋(추가) · 완료 · 더보기**. FAB(＋)는 `fabAdd()`가 모드 분기 → 할일 모드면 `openTodoEdit()`.
- 모든 할일 화면 상단에는 **[개인 | 그룹] 세그먼트**(`todoScopeSeg`/`setTodoScope`)가 있어 두 축을 오갑니다. 선택은 `localStorage('todoScope')` 로 유지.

| 탭 | 화면 | 함수 |
|---|---|---|
| 할일 | [개인\|그룹] 목록 + (개인) 공유 친구 스트립 + 필터 칩 | `renderTodoList` |
| 캘린더 | 스코프별 마감일 월 그리드(점/개수) + 그날 할일 | `renderTodoCalendar` |
| ＋ | 할일 추가/수정 시트 | `openTodoEdit` |
| 완료 | 스코프별 완료 이력(최신순) | `renderTodoDone` |
| 더보기 | 할일 전용 메뉴(공유·리포트·반복·목적별) + 공용 알뜰샵·설정 | `renderMore`(모드 분기) |

## 개인 할일 (scope=personal)

- 프로필별 **내 할일**. `ws/{wsId}/todos/{id}` 에 `scope:'personal'`·`ownerUid:내 uid` 로 저장.
- 추가/수정 시트(`openTodoEdit`)는 개인 스코프에선 **담당자 선택 없이** 제목·마감일·반복·목적별 연결·메모만. 저장 `saveTodo`(개인이면 `ownerUid=나`).
- 목록은 `scopedTodos()`가 **`scope==='personal' && ownerUid===(보는 대상)`** 으로 필터. 미완료는 마감 임박순, 완료는 하단으로 접힘.
- 필터 칩: **전체 / 오늘 / 이번주**(개인엔 '내 담당' 없음). 마감일은 **D-day/지남 배지**(`todoDueBadge`, `dueDiffDays`).

## 그룹 할일 (scope=group)

- 각자 맡은 일을 **그룹 안에서 나눔**(여행: 렌터카·항공권·짐 담당, 집안일 분담 등). 워크스페이스 멤버 **공동 편집**.
- 추가/수정 시트에 **담당자(멤버) 선택**(`ownerOptions`, uid 저장) 노출. `scope:'group'`, 담당은 `assignedUid`·`assignedName`.
- 목록 행(`todoRow`)에 **담당자 아바타**(`avatarHtml`) 표시. 필터 칩: **전체 / 내 담당(담당=나) / 오늘 / 이번주**.
- 기존 플랫 `todos`(담당 배정형)를 그대로 그룹 할일로 사용 — `scope` 누락 시 **group 취급**(`todoScope()` 하위호환).

## 공유 친구 스트립 (개인 탭 · 그룹 워크스페이스)

- **"할일 공유"를 켠 친구**(같은 그룹 멤버)의 프로필이 개인 탭 상단에 가로 스트립으로 뜸(`todoFriendStrip`). **"나" 항상 맨 앞**, 이어서 친구들은 **각자 개인 할일 최신 등록순**(`friendTodoOrder` — `createdAt` 내림차순, 동률/없음은 이름순).
- 친구 아바타 탭(`setTodoFriend`) → 그 친구의 개인 할일을 **같은 화면에서 읽기전용**으로 열람(`todoReadOnly`): 완료 토글·편집·＋ 비활성, "👀 …님의 할일 · 읽기전용 / 내 할일로" 안내 바. 캘린더·완료 탭에도 읽기전용이 이어집니다.
- 스트립 우측 **내 공유 토글**(공유중/비공개) → `openTodoShareSheet`/`toggleTodoShare`가 `ws/{wsId}/todoShare/{uid}` 를 기록. 더보기 → **할일 공유**에서도 진입.
- 공유는 **UI 레벨 필터**입니다(RTDB 규칙상 멤버는 `ws/{wsId}` 전체를 읽을 수 있음 — 기존 `visibility` 관례와 동일, 규칙 강제 아님). 개인 워크스페이스(멤버 1명)에선 스트립이 뜨지 않습니다.

## 마감일 · 캘린더 · 완료

- **마감일 배지**: 오늘/내일/D-N/N일 지남을 색으로(`todoDueBadge`). 미완료는 마감 임박순 정렬.
- **캘린더 탭**(`renderTodoCalendar`): 가계부 달력 그리드를 재사용해 **현재 스코프의 마감일**을 점/개수로 표시, 날짜 탭 시 그날 할일. 월 이동 `todoMoveMonth`.
- **완료 탭**(`renderTodoDone`): 현재 스코프의 완료 할일을 완료 시각 최신순으로. 각 행 체크를 눌러 되돌리기.

## 반복 할일

- **매일 / 매주** 반복(`repeat`). 완료(`toggleTodo`)하면 `done` 을 세우지 않고 **마감일을 다음 회차로 넘김**(`nextDue` — 매일 +1, 매주 +7일)·`done` 리셋 → 계속 순환.
- 더보기 → **반복 할일**(`openRepeatTodos`)에서 반복 중인 할일만 모아 봄. 행 제목 옆 🔁 표시.

## 목적별 가계부(여행) 연결

- 할일을 목적별 가계부(PB)에 연결(`purposeBookId`) → PB 상세에 **할일 요약**(완료율 + 목록 + "이 여행에 할일 추가", `pbTodoSummaryHtml`)이 붙어 **여행 준비물 체크리스트**로 활용. 행 제목 옆 📍 표시.

## 할일 모드 더보기

- `renderMore`가 `state.mode`로 분기해 **할일 전용 그리드**를 그립니다: **할일 공유 설정 · 완료 리포트 · 반복 할일 · 목적별(여행)** + 공용 **알뜰샵 · 설정**. 가계부 기능 아이콘(예산/구독/정산 등)은 숨깁니다.
- **완료 리포트**(`openTodoReport`): 전체 완료율 게이지, 개인/그룹 구성, **멤버별 완료 기여**(`doneByUid` 집계).
- 프로필 행·워크스페이스 행·하단 푸터는 두 모드 공용.

## 게임화 연동 (은화)

- 할일 **완료 시 은화 +2**(할일당 1회·멱등, `rewardClaimed` 플래그 · `grantTodoCoins`). 완료 취소해도 재지급 없음. 반복 할일도 첫 완료 1회만 지급.
- **업적**: 첫 할일 완료(+10) / 할일 10개 완료(+30) — `ACHIEVEMENTS`(period `once`, `state.todos` 기준). 펫·도크·가챠 로직은 무변경(은화만 증가). 알뜰샵 상세는 [features.md](features.md#-알뜰샵-은화-경제--게임화)·[cat-feature-plan.md](cat-feature-plan.md).

## 데이터 · 순수 헬퍼

- 컬렉션: `ws/{wsId}/todos/{id}`(스코프/소유자/담당/마감/반복/PB/보상 필드), `ws/{wsId}/todoShare/{uid}`. 필드 상세는 [data-model.md](data-model.md#todosid--할일--flat-wswsidtodosid). **RTDB 규칙 변경 없음**(`ws` 멤버 규칙이 하위 경로 전부 커버).
- 순수 헬퍼는 `public/js/util.js` 에 두고 단위 테스트: `todoScope`(스코프 하위호환)·`friendTodoOrder`(친구 정렬)·`addDays`/`nextDue`/`dueDiffDays`(마감·반복 날짜). `npm test` 로 검증.
