# ✅ 할일(To-Do) 모드 — 기능 상세

> 알뜰의 **두 모드 중 하나**입니다. 상단 **모드 토글(가계부 ↔ 할일)** 로 전환합니다. 전체 개요는 [features.md](features.md), 가계부 모드는 [features-ledger.md](features-ledger.md), 데이터 구조는 [data-model.md](data-model.md), 함수 위치는 [code-structure.md](code-structure.md) 참고.

개인이 **프로필별로 자기 할일**을 관리하고, 원하면 **같은 그룹의 친구에게 공유**할 수 있으며, 여행·모임처럼 **그룹이 함께 맡는 일**을 나눌 수 있는 공유 할일. 기존 워크스페이스·멤버·실시간 RTDB·펫/게임화를 그대로 재사용합니다.

## 진입 / 화면 구성

- **모드 토글**(상단바): `[가계부 | 할일]` 세그먼트(`setMode`). 선택은 `localStorage('mode')` 로 유지되고, 전환 시 하단 탭바(`renderTabBar`)와 본문(`rerender`)이 모드에 맞게 바뀝니다. **모드별 최근 컨텍스트**(`recentWs.ledger`/`recentWs.todo`)를 따로 기억해, 토글하면 그 모드가 마지막에 쓰던 그룹/개인 프로필로 **자동 전환**(`switchWorkspace`) — 할일은 개인 프로필, 가계부는 그룹으로 두고 오갈 때 매번 그룹전환하지 않아도 됩니다.
- **할일 모드 하단 탭**(`_TABSETS.todo`): **할일 · 캘린더 · ＋(추가) · 완료 · 더보기**. FAB(＋)는 `fabAdd()`가 모드 분기 → 할일 모드면 `openTodoEdit()`.
- **할일 스코프는 현재 컨텍스트(그룹전환)가 결정**합니다(`isPersonalWs`): **개인 프로필=내 할일**(`users/{uid}/todos`, user-global), **그룹=그룹 할일**(`ws/{wsId}/todos`). 개인용으로 쓰려면 그룹전환에서 '개인 프로필'을 고르면 됩니다(별도 개인/그룹 세그먼트 없음). 개인 프로필의 **할일 리스트 탭에서만** 상단에 **[내 할일 | 친구들] 소셜 토글**(`todoScopeSeg`/`setTodoFeed`, `state._todoFeed`)이 떠 친구 피드를 봅니다(캘린더·완료 탭엔 세그먼트 없음).

| 탭 | 화면 | 함수 |
|---|---|---|
| 할일 | 개인 프로필=[내 할일\|친구들](친구들=`renderFriendsFeed`), 그룹=그룹 할일 | `renderTodoList` |
| 캘린더 | 스코프별 월 그리드(카테고리 색 점 — 미완료=마감일·완료=완료한 날) + 그날 할일 | `renderTodoCalendar` |
| ＋ | 할일 추가/수정 시트 | `openTodoEdit` |
| 완료 | 스코프별 완료 이력(최신순) | `renderTodoDone` |
| 더보기 | 할일 전용 메뉴(공유·리포트·반복·목적별) + 공용 알뜰홈·설정 | `renderMore`(모드 분기) |

## 개인 할일 (user-global)

- 프로필별 **내 할일**. **`users/{uid}/todos/{id}`** 에 저장돼 **워크스페이스와 무관하게 항상 동일**(개인↔그룹 가계부를 오가도 그대로). 상시 리스너 `initUserGraph`→`state.myTodos`(워크스페이스 전환에도 유지).
- 추가/수정 시트(`openTodoEdit`)는 개인 스코프에선 **담당자 없이** 제목·마감일·반복·목적별·우선순위·태그·카테고리·메모·하위작업. 저장 경로는 `saveTodo`가 개인=`users/{uid}/todos`, 그룹=`ws/{wsId}/todos`로 분기(`todoDbRef`).
- 목록은 `scopedTodos()`가 개인=`state.myTodos`(내 것) 또는 `state.friendTodos`(친구 열람)로. 미완료 마감 임박순·완료 하단.
- 필터 칩: **전체 / 오늘 / 이번주**. 마감일은 **D-day/지남 배지**(`todoDueBadge`, `dueDiffDays`). '오늘/이번주' 필터는 **마감일 없는(언제든) 할일도 포함**(빈 상태 오인 방지). 오늘/마감 판정 기준일은 **은화 일일상한과 같은 KST**(`todayKst`).
- 기존 `ws`의 개인(scope=personal) 할일은 최초 진입 시 `migratePersonalTodos()`로 user로 1회 이전.

## 그룹 할일 (scope=group)

- 각자 맡은 일을 **그룹 안에서 나눔**(여행: 렌터카·항공권·짐 담당, 집안일 분담 등). `ws/{wsId}/todos`, 워크스페이스 멤버 **공동 편집**.
- 추가/수정 시트에 **담당자(멤버) 선택**(`ownerOptions`, uid 저장). `scope:'group'`, 담당은 `assignedUid`·`assignedName`. 목록 행에 **담당자 아바타**. 필터 칩: **전체 / 내 담당 / 오늘 / 이번주**. '내 담당'은 uid 배정 외 **이름으로만 배정된 내 할일**(`assignedName`=내 이름)도 포함.
- **그룹 컨텍스트에선 상단 세그먼트가 없고 그룹 할일 전용**. 친구 피드(친구들)는 **개인 프로필 컨텍스트**에서만 [내 할일 | 친구들] 토글로 봅니다(`isPersonalWs`).

## 친구 (별도 추가) — 관리(더보기 공용) + '친구들' 피드

친구는 **그룹과 무관한 별도 관계**다. 각 사용자는 **친구 코드**(`friendCode` 6자, `friendCodes/{code}=uid` 인덱스, `ensureFriendCode` 백필)를 가진다.

- **친구 관리 = 더보기 공용**(`openFriendsSheet`, 가계부·할일 두 모드 모두 **더보기 → 친구**): 내 **할일 공개** 토글(`toggleTodoPublic`→`users/{uid}/todoPublic`), 내 코드 복사, **코드로 추가**(`addFriendByCode`→상대 `friendReqs`), **받은 요청** 수락/거절(`acceptFriend`/`declineFriend`), **친구 목록**(공개여부·삭제 `removeFriend`). 더보기 셀에 받은 요청 수 배지.
- **추가/수락**: 코드로 요청 → 상대가 **더보기 → 친구**에서 수락하면 **양쪽** `users/{uid}/friends`에 상호 등록(규칙상 당사자 두 명만 쓰기). **랭킹·친구들 스토리 등에서 비친구 프로필(캠+정보)을 열면 ＋친구 추가 버튼**으로도 요청 가능(상대가 이미 나에게 요청했으면 그 자리에서 수락/거절). 즉시 친구가 아니라 요청 → 상대가 더보기 → 친구에서 수락/거절.
- **'친구들' 탭 = 인스타그램 스토리**(개인 워크스페이스 둘째 탭, `renderFriendsFeed`): 상단 **스토리 줄** — 맨 왼쪽 **내 스토리**(＋로 할일 추가) + 공개 친구를 **가장 최근 할일 등록순**(`friendFeedOrder`)으로 가로 스크롤. 링 상태 `storyRing`: **오늘 등록·미열람=무지개**, 미열람=컬러 그라디언트, 열람함=회색, 없음=얇은 테두리(열람기록 `localStorage(storySeen)`). 링은 **오늘 할일 등록 + 집(펫/가구) 변경(`home.changedAt`) 중 최신** 기준이라 친구가 펫·집만 바꿔도 무지개로 뜬다. 아바타 탭 → **친구 집(펫캠) 방문**(`openFriendHome`): 친구의 LIVE 펫캠(펫 로밍+가구+벽지, `LIVE · {이름}의 집`) + ❤️ 좋아요(하루 1회) + 오늘의 할일(그 친구 `todoPublic` 켰을 때). 내 스토리 탭=내 알뜰홈 홈(`openCatHouse('home')`). 스토리 줄 **아래엔 친구들 할일 합본 목록**(마감 임박순, 읽기전용). *(레거시 풀스크린 todo 페이저 `openMyStoryTodos`/`renderStory`는 잔존·미연결.)*
- **친구 집 방문·좋아요**(더보기 → 친구 목록에서도 진입): 친구를 탭하면 `openFriendHome`으로 그 친구의 펫캠을 본다(모든 친구 공개, 걷기 엔진 재사용 로밍). **하트(좋아요)는 방문자당 하루 1회**(`users/{owner}/homeLikes/{visitor}={n,last}`, `likeHome`), 총 좋아요는 **내 프로필·친구 목록에 하트+숫자**로 표시(`state.myLikeCount`·`state.friendLikes`). 오늘 집을 바꾼 친구는 친구 목록 아바타에도 무지개 링.
- **데이터**: 공개 친구별 `users/{uid}/todos`를 상시 리스너로 로드(`syncFriendTodoWatch`→`state.friendTodosByUid`, `state.friendPub` 기준). 개인 탭엔 친구 스트립을 두지 않는다(개인 = 내 할일만). 공개는 **UI 레벨 필터**(읽기 규칙은 로그인 전역).

## 마감일 · 캘린더 · 완료

- **마감일 배지**: 오늘/내일/D-N/N일 지남을 색으로(`todoDueBadge`). 미완료는 마감 임박순 정렬. **완료된 항목은 마감 경과 대신 완료일을 중립색 "M/D 완료"로 표시**(`doneAt` 기준, 없으면 배지 생략) — 완료 섹션이 "N일 지남"으로 빨갛게 물들지 않게.
- **날짜 옮기기(리스케줄)**: **미완료 할일의 마감일 배지를 탭**하면 '날짜 옮기기' 미니 시트(`openTodoReschedule`) — 빠른 칩(오늘·내일·모레·다음 주, `addDays` 기반) + 날짜 직접 선택(`<input type=date>`). 이동은 `rescheduleTodo`가 **`dueDate`만 갱신**(`todoDbRef(t).update`, 노드 경로·키 불변, 반복 `repeat` 유지). 마감일 없는 미완료 할일은 배지 자리에 **`날짜`** 칩이 떠 같은 시트로 지정. 완료·친구 열람(읽기전용) 행은 배지 비활성.
- **지난 미완료 일괄 오늘로**: 리스트 상단 **'🕘 지난 미완료 N개 → 오늘로'** 배너(`carryOverdueToToday`) — 현재 스코프의 지난 미완료(`overdueTodoIds`, 순수헬퍼)를 확인 후 **다중경로 fan-out `update()`** 로 한 번에 오늘로. 친구 열람 뷰에선 숨김.
- **🎨 카테고리(색)**: 할일마다 카테고리(업무·공부·집안일·건강·약속·쇼핑·기타)를 붙여 **색으로 구분**한다 — 추가/수정 시트의 **색 점 칩 줄**(`pickTodoCat`, 같은 칩 다시 탭=해제)로 선택, 필드 `category`(''=없음). 카테고리는 **할일 전용 고정 세트 `TODO_CATS`**(views.js, id·이름·색) — 가계부 카테고리는 ws 종속이라 개인 할일(user-global)과 스코프가 안 맞아 별도 상수(어느 컨텍스트에서도 같은 색). 목록의 모든 행(`todoRow`)에 제목 앞 **카테고리 색 점**(`.tdcat`)이 붙고, 캘린더 점도 이 색을 따른다.
- **캘린더 탭**(`renderTodoCalendar`): 가계부 달력 그리드를 재사용해 **카테고리 색 점**(색당 1점·중복 제거, 미지정=`--primary`)으로 표시 — **미완료=마감일 기준(진한 점)**, **완료=완료한 날 기준 옅은 점**(`todoDoneDay` — `doneAt`, 반복은 `lastDoneAt`, `todayKst`와 같은 KST 경계 · `.dotrow i.dn`), 한 칸 최대 4점(미완료 우선). 날짜 탭 시 **그날 마감 + 그날 완료한** 할일 목록. 월 이동 `todoMoveMonth`.
- **완료 탭**(`renderTodoDone`): 현재 스코프의 완료 할일을 완료 시각 최신순으로. 각 행 체크를 눌러 되돌리기.

## 반복 할일

- **매주 / 매월** 반복(`repeat`, 주기 예정 할일). 완료(`toggleTodo`)하면 `done` 을 세우지 않고 **마감일을 다음 회차로 넘김**(`nextDue` — 매주 +7일, 매월 다음 달 같은 날·말일 클램프)·`done` 리셋 → 계속 순환. **매일 하는 습관은 여기가 아니라 내 미션**(알뜰홈 미션 탭·스트릭·리스트 밖)으로 역할 분리 — 반복 필드에서 매일 제외(기존 daily 할일은 하위호환).
- 더보기 → **반복 할일**(`openRepeatTodos`)에서 반복 중인 할일만 모아 봄. 행 제목 옆 🔁 표시.

## 목적별 가계부(여행) 연결

- 할일을 목적별 가계부(PB)에 연결(`purposeBookId`) → PB 상세에 **할일 요약**(완료율 + 목록 + "이 여행에 할일 추가", `pbTodoSummaryHtml`)이 붙어 **여행 준비물 체크리스트**로 활용. 행 제목 옆 📍 표시.

## 할일 모드 더보기

- `renderMore`가 `state.mode`로 분기해 **할일 전용 그리드**를 그립니다: **할일 공유 설정 · 완료 리포트 · 반복 할일 · 목적별(여행)** + 공용 **알뜰홈 · 설정**. 가계부 기능 아이콘(예산/구독/정산 등)은 숨깁니다.
- **완료 리포트**(`openTodoReport`): 전체 완료율 게이지, 개인/그룹 구성, **멤버별 완료 기여**(`doneByUid` 집계).
- 프로필 행·워크스페이스 행·하단 푸터는 두 모드 공용.

## 게임화 연동 (은화)

- 할일 **완료 시 은화 +10**(할일당 1회·멱등, `rewardClaimed` 플래그 · `grantTodoCoins`) — **은화는 하루 5개까지만**(`TODO_DAILY_CAP`·`game.todoDay`, 도배 억제). 완료 취소해도 재지급 없음. 반복 할일도 첫 완료 1회만 지급. **완료 토스트는 실제 지급액을 표시**하고(상한 초과로 0이면 "완료!"만 — `grantTodoCoins`가 지급액 콜백), 하드코딩 문구를 쓰지 않는다.
- **업적**: 첫 할일 완료(+10) / 할일 10개 완료(+30) — `ACHIEVEMENTS`(period `once`, `state.todos` 기준). 펫·도크·가챠 로직은 무변경(은화만 증가). 알뜰홈 상세는 [features.md](features.md#-알뜰홈-은화-경제--게임화)·[cat-feature-plan.md](cat-feature-plan.md).

## 데이터 · 순수 헬퍼

- 컬렉션: `ws/{wsId}/todos/{id}`(스코프/소유자/담당/마감/반복/PB/보상 필드), `ws/{wsId}/todoShare/{uid}`. 필드 상세는 [data-model.md](data-model.md#todosid--할일--flat-wswsidtodosid). **RTDB 규칙 변경 없음**(`ws` 멤버 규칙이 하위 경로 전부 커버).
- 순수 헬퍼는 `public/js/util.js` 에 두고 단위 테스트: `todoScope`(스코프 하위호환)·`overdueTodoIds`(지난 미완료 id, 일괄 이동 대상)·`friendFeedOrder`(친구 스토리 정렬 — 실사용, 구 `friendTodoOrder`는 레거시)·`addDays`/`nextDue`/`dueDiffDays`(마감·반복 날짜). `npm test` 로 검증.
