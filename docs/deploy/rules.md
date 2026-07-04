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
| `users/{uid}` (전체 노드, **`game` 포함**) | **본인만**(`auth.uid === $uid`) **+ 개발자 이메일**(`users`레벨 read — 개발자 '사용자 현황' 전체 열람) | 본인 uid 만 |
| `users/{uid}/{profilePublic,photo,todos,todoPublic}` | 로그인(전역) — 공개/친구용 | 본인 uid 만 |
| `users/{uid}/friends/{fid}`·`friendReqs/{fid}` | 로그인 | **당사자 두 명만**(`$uid` 또는 `$fid`) |
| `users/{uid}/homeLikes/{visitor}` | 로그인 | **방문자 자신만**(`auth.uid === $visitor`) — 남의 집에 좋아요를 남기되 자기 항목만 |
| `users/{uid}/mailbox/{sender}/{gid}` | **수령자(본인)만**(부모 owner-read) | **수령자 본인 또는 친구인 발신자만** — 친구 검증(`friends/{auth.uid}` 존재) + 엔트리 `.validate`로 상한(coins≤10·consum≤3·key∈{egg,water,food}·from=auth.uid). **금화(gold) 선물은 규칙상 차단**(크로스유저 통화 민팅 방지) |
| `users/{uid}/adminGifts/{pushId}` | **본인만**(부모 owner-read) | **관리자 이메일 또는 본인** — 🎁 운영자가 특정 유저에게 보내는 비공개 선물(관리자 write) + 본인이 수령 후 삭제(write). 상한 없음(관리자 신뢰). 앱 `claimAdminGifts`가 받아 game.gifts로 옮기고 삭제 |
| `homeCam/{uid}` | 로그인(전역) — 친구·랭킹이 보는 **대표 방** 스냅샷 | **본인만** |
| `presence/{uid}` | **개발자 이메일만** — 🟢 접속 상태(개발자 '사용자 현황' 접속중 표시) | **본인만**(`auth.uid === $uid`) |
| `rankings/{uid}` | 로그인 | **본인만**(`auth.uid === $uid`) — 공개 랭킹 경량 인덱스(name/likes/private) |
| `config/notices` | 로그인(전역) | **개발자 이메일만**(`auth.token.email`) — 📢 소식 공지. 배포 없이 Firebase 콘솔/개발자 계정에서 편집(`loadNotices`가 구독) |
| `codes/*`·`friendCodes/*` | 로그인 | 로그인(코드 등록/조회) |
| `workspaces/{wsId}` | 로그인(코드로 그룹 조회) | 멤버 또는 **본인을 멤버로 추가**할 때 |
| `ws/{wsId}/**` | 그 워크스페이스 **멤버만** | 그 워크스페이스 **멤버만** |
| 레거시 루트(`accounts` 등) | 로그인 | 로그인 — 이전용 백업, 이전 후 삭제 가능 |

## 설계상 신뢰 모델
- **격리 단위는 워크스페이스**. 멤버가 아니면 `ws/{wsId}` 를 읽거나 쓸 수 없다 → 다른 그룹/개인 가계부는 완전 분리.
- **그룹 내부는 공동 권한**: 같은 그룹 멤버끼리는 서로의 거래까지 읽고 쓸 수 있다(가계부 공유 목적). 멤버 간 세분화된 쓰기 격리는 하지 않는다.
- `private` 등 `visibility` 표시 제한은 **앱 UI**가 담당(리스트 read 시 자식별 필터 불가).
- **`users/{uid}` 전체 노드 read는 소유자만**(예외: **개발자 이메일**은 `users` 레벨 read로 전체 열람 — '사용자 현황' 대시보드용). 친구가 크로스유저로 읽는 건 **명시적 공개 서브패스**(`profilePublic`·`photo`·`todos`·`todoPublic`·`friends`·`friendReqs`·`homeLikes`)에 한정한다. 그래서 개인 할일(`todos`)·`todoPublic`은 친구가 읽지만, **`users/{uid}/game`(알뜰홈 모든 방)은 소유자만** 읽는다 → 대표 방 외 다른 방은 규칙 레벨로 비공개.
- **알뜰홈 프라이버시**: 친구·랭킹 캠은 별도 공개 노드 **`homeCam/{uid}`(대표 방만)** 를 읽는다(`writeHomeCam`이 소유자 game 변경 시 갱신). 즉 사적인 방은 앱·DB 어디서도 노출되지 않는다.

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
| uidA → `users/uidB/homeLikes/uidA` 쓰기(좋아요) | 허용(방문자 자신) |
| uidA → `users/uidB/homeLikes/uidC` 쓰기(남의 좋아요 위조) | 거부 |
| uidA → `users/uidB/mailbox/uidA/{gid}` 쓰기(친구 선물) | 허용(uidA가 uidB의 친구일 때만) |
| uidA → `users/uidB/mailbox/uidA/{gid}={type:coins,qty:99}` (변조) | 거부(validate 상한 coins≤10) |
| uidA → `users/uidB/mailbox/uidA/{gid}={type:gold,...}` (금화 선물) | 거부(금화 타입 자체 차단) |
| 비친구/타인 → `users/uidB/mailbox/...` 쓰기 | 거부 |
| uidA → `rankings/uidA` 쓰기(내 랭킹 엔트리) | 허용 |
| uidA → `rankings/uidB` 쓰기(남의 랭킹 위조) | 거부 |
| uidA → `users/uidB/friends/uidA` 쓰기(수락) | 허용(당사자) |
| 비로그인 read | 거부 |

- **`catalogPets`**: 런타임 펫 **메타데이터**(앱 dev zip 업로드). 읽기=로그인 전체, 쓰기=개발자 이메일(`auth.token.email` 화이트리스트)만. 규칙 변경 후 `npx firebase-tools deploy --only database` 로 배포해야 업로드가 동작한다.
- **`catalogPetArt`**: 런타임 펫 **스프라이트 이미지**(base64, 메타와 분리). 읽기·쓰기 규칙은 `catalogPets`와 동일(개발자 이메일만 쓰기). 이미지 분리 저장(지연 로딩)을 위해 추가됐으므로, **이 노드도 배포돼야** dev 업로드가 동작한다.
- **`config/notices`**: 📢 소식 화면 **공지 목록**(`[{date,t,s}]`). 읽기=로그인 전체, 쓰기=개발자 이메일만. 앱이 `loadNotices`로 구독하므로 **배포 없이** Firebase 콘솔(또는 개발자 계정)에서 공지를 추가/수정하면 즉시 반영된다(비어있으면 `cats.js`의 기본 `NOTICES` 폴백). **규칙 배포 필요**: `npx firebase-tools deploy --only database`.
- **`config/furniture/{itemId}`**: 🪑 기구물 **전역 등급/가격**(`{tier,price}`). `config` 규칙(읽기=로그인 전체·쓰기=개발자 이메일만)이 **하위까지 그대로 커버**하므로 **규칙 파일 변경·재배포 불필요**. 개발자 모드 '기구물 관리'에서 편집(`loadFurnCfg` 구독). 특별↑ 등급은 자동 랜덤박스 전용.
