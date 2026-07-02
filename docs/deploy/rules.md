# RTDB 보안규칙 안내 (v3 · 워크스페이스/그룹 모델)

[`database.rules.json`](../../database.rules.json) 을 Firebase 콘솔 → **Realtime Database → 규칙(Rules)** 에 붙여넣고 **게시(Publish)**.

## 데이터 구조
```
users/{uid}            : { name, email, createdAt, activeWs, ws:{ {wsId}:true } }   // 내 워크스페이스 목록
workspaces/{wsId}      : { name, type:'personal'|'group', code(그룹), ownerUid, createdAt,
                           members:{ {uid}:{ name, role:'owner'|'member', joinedAt } } }
codes/{CODE}           : wsId           // 그룹 코드 → 워크스페이스 조회 인덱스
friendCodes/{CODE}     : uid            // 친구 코드 → 사용자 uid 조회 인덱스
migrationV3            : { by, at }     // 구버전 데이터 1회 이전 잠금 플래그
ws/{wsId}/...          : 가계부 데이터(accounts/categories/budgets/transactions/{uid}/...)
users/{uid}/todos      : 개인 할일(user-global)   // 친구가 읽기 가능(users 전역 read), 쓰기는 본인만
users/{uid}/{friends,friendReqs} : 친구 관계·요청   // 당사자 두 명만 쓰기
```
- **개인 가계부** = `type:'personal'` 워크스페이스(멤버 1명).
- **그룹 가계부** = `type:'group'`, 6자리 `code` 를 아는 사람이 즉시 멤버로 합류.
- **친구** = 별도(그룹과 무관). `friendCode`로 요청→수락하면 상호 친구. 개인 할일(`users/{uid}/todos`)은 user-global이라 그룹을 바꿔도 동일하며, `todoPublic`을 켠 친구의 할일을 읽기전용으로 열람.

## 접근 규칙 요약
| 경로 | read | write |
|---|---|---|
| `users/{uid}` (하위 `todos`·`todoPublic` 포함) | 로그인(전역) | 본인 uid 만 |
| `users/{uid}/friends/{fid}`·`friendReqs/{fid}` | 로그인 | **당사자 두 명만**(`$uid` 또는 `$fid`) |
| `codes/*`·`friendCodes/*` | 로그인 | 로그인(코드 등록/조회) |
| `workspaces/{wsId}` | 로그인(코드로 그룹 조회) | 멤버 또는 **본인을 멤버로 추가**할 때 |
| `ws/{wsId}/**` | 그 워크스페이스 **멤버만** | 그 워크스페이스 **멤버만** |
| 레거시 루트(`accounts` 등) | 로그인 | 로그인 — 이전용 백업, 이전 후 삭제 가능 |

## 설계상 신뢰 모델
- **격리 단위는 워크스페이스**. 멤버가 아니면 `ws/{wsId}` 를 읽거나 쓸 수 없다 → 다른 그룹/개인 가계부는 완전 분리.
- **그룹 내부는 공동 권한**: 같은 그룹 멤버끼리는 서로의 거래까지 읽고 쓸 수 있다(가계부 공유 목적). 멤버 간 세분화된 쓰기 격리는 하지 않는다.
- `private` 등 `visibility` 표시 제한은 **앱 UI**가 담당(리스트 read 시 자식별 필터 불가).
- **`users/*` 는 로그인 사용자 전역 read**(기존 모델) — 그래서 개인 할일(`users/{uid}/todos`)·`todoPublic`을 친구가 읽을 수 있다. 쓰기는 본인만. '공개(todoPublic)' 여부에 따른 노출은 앱 UI가 필터한다(규칙 강제 아님).

## 구버전 데이터 이전(자동, 1회)
- 기존 전역 트리(`accounts` 등 루트)가 있으면, 로그인 시 `migrateLegacyIfNeeded()` 가 **"공유 가계부"** 그룹 워크스페이스를 만들고 기존 모든 사용자(`users/*`)를 멤버로 넣은 뒤 데이터를 `ws/{wsId}` 아래로 복사한다.
- `migrationV3` 플래그로 중복 실행을 막는다. 원본 루트 데이터는 **백업으로 남겨두며**, 정상 동작 확인 후 콘솔에서 수동 삭제해도 된다.

## 게시 전 주의
- 이 파일은 **순수 JSON**(주석/추가 키 없음).
- `ws/{wsId}` 의 멤버 판정은 `root.child('workspaces').child($wsId).child('members').child(auth.uid)` 를 본다 → 멤버십 등록(`workspaces` 쓰기)이 **먼저 커밋**된 뒤에야 `ws` 쓰기가 통과한다(앱은 2단계로 분리해 처리).

## 권한 테스트 (콘솔 Rules Playground)
| 동작 | 기대 |
|---|---|
| 멤버 uid → `ws/{wsId}/accounts` 읽기/쓰기 | 허용 |
| 비멤버 uid → `ws/{wsId}/**` 읽기/쓰기 | 거부 |
| 누구나 → `codes/{CODE}` 읽기(그룹 합류용) | 허용 |
| uidA → `workspaces/{wsId}/members/uidA` 추가 | 허용(셀프 합류) |
| uidA → `users/uidB` 쓰기(친구 하위 제외) | 거부 |
| uidA → `users/uidB/todos` 읽기(친구 공개 할일) | 허용(전역 read) |
| uidA → `users/uidB/friendReqs/uidA` 쓰기(친구 요청) | 허용(당사자) |
| uidA → `users/uidB/friends/uidA` 쓰기(수락) | 허용(당사자) |
| 비로그인 read | 거부 |
