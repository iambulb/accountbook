# 01 — 방 배치(집꾸미기) 시스템

> eggarden의 바닥 12×8 / 벽 12×4 격자 배치 시스템 전체. 원본 코드 위치: 배치 상호작용은 `public/js/cats.gacha.js`(≈930~1480행), 순수 계산은 `public/js/util.js`, 카탈로그·상수는 `public/js/cats.js`, 렌더/썸네일은 `public/js/cats.house.js`.
> ⚠️ eggarden은 파일명과 책임이 어긋나 있다(배치 엔진이 gacha 파일에 있음). **새 프로젝트에선 "배치 엔진"을 별도 모듈로 명확히 분리할 것.**

---

## 1. 좌표계 — 핵심 설계

### 1-1. 좌표계는 두 겹이다 (가장 중요한 개념)

같은 셀 데이터가 **두 가지 화면**으로 그려진다:

1. **평면 에디터 격자** (배치 UI·썸네일·드롭 프리뷰): 위에서 내려다본 12×8 직사각 격자. 좌표는 단순 비율.
2. **원근 캠** (실제 방 화면): 같은 셀을 유사 3D 원근으로 투영. 행(r)=깊이가 되고, 뒤로 갈수록 위로·작게.

```
평면 좌표 (에디터):                          원근 좌표 (캠 렌더):
gridLeftFrac(c)    = (c-1)/12                depth  = clamp((8 - frontRow)/7, 0, 1)   // 0=맨앞, 1=맨뒤
gridSpanFrac(n)    = n/12                    bottom% = 3 + depth*46                    // 가구 발밑 위치
gridTopFrac(r)     = (r-1)/8                 z      = max(1, round(8 - depth*7))       // 가림 순서(≈frontRow)
gridRowSpanFrac(n) = n/8
```

- **셀 키는 `"r_c"` 문자열** (r=행/깊이 1..8, c=열 1..12). **큰 r = 앞(카메라 쪽)**.
- `frontRow = p.r + footH - 1` — 세로로 큰 가구는 **발자국의 가장 앞 줄** 기준으로 원근을 잡는다(발밑 기준).
- `camDepth`가 [0,1]로 클램프되는 이유: 레거시 데이터(격자 행수 변경 전 데이터)도 안전하게 매핑.

### 1-2. 격자 크기 선택의 교훈

eggarden은 원래 깊이도 12행이었다가 **8행으로 축소**했다: 짧은 바닥 밴드(화면 세로의 54%)에서 12행이면 행당 ~11px라 뒤쪽 배치가 시각적으로 구분이 안 됐다. **가로 해상도(배치 자유도 12칸)와 세로 깊이 구분성(8행 ≈ 행당 19px)을 다르게 잡은 것.** 새 게임도 "캠에서 한 행 차이가 눈에 보이는가"를 기준으로 행수를 정할 것.

격자 행수를 나중에 바꾸면 기존 데이터의 r이 재해석된다 → 읽기 시 클램프 정규화(idempotent)로 마이그레이션:

```js
// clampPlacedRows(placed, rows): r을 [1,rows]로 클램프, c는 불변, 충돌 시 먼저 온 것 유지
// r<=rows 데이터는 그대로 통과 → 재적용해도 안전
```

---

## 2. 데이터 모델

### 2-1. room 객체 (eggarden `normRoom` 기준)

```js
{
  id: 'r_abc123',        // 안정 식별자 — 인덱스가 아니라 id로 방을 겨냥(재정렬·경합 안전)
  name: '방 1', emoji: '🏠',
  wallpaper: 'default',  // 벽지 id
  floor: 'default',      // 바닥 id
  bgfx: '',              // 배경효과(방 전체 오버레이) id
  placed:     { 'r_c': { itemId, filledAt?, fillMs?, flip? } },  // 바닥 배치
  wallPlaced: { 'r_c': { itemId } },                             // 벽 배치(별도 12×4 격자)
  active: ['pet_id', ...],  // 이 방의 활성 펫
  harvestAt: 0, caredAt: 0, // 방치형 유휴 수익 타임스탬프
}
```

- **인벤토리는 전역, 배치는 방별**: `owned.items[id].qty`(전역 보유) − `sumPlacedItem(전 방 합산)` = 남은 수량. 이 구조 때문에 복제 레이스가 생길 수 있고, 그래서 배치가 트랜잭션이다(§3).
- **정규화는 순수 함수 + idempotent + 비파괴**: `normRoom(r, i)`가 읽기 시마다 기본값 채움·클램프·마이그레이션을 수행. 저장은 다음 쓰기 트랜잭션에서 자연히 영속화. 스키마를 바꿀 때 이 패턴이 가장 안전하다.
- 새 게임 최상위 상태 객체를 `normalizeGame(raw)` 같은 단일 정규화 함수가 통째로 재생성하는 구조라면 — **반환 객체에 명시 안 된 필드는 다음 쓰기에서 영구 삭제된다.** 새 필드(재화·카운터)를 추가할 때마다 정규화 함수에 방어값과 함께 반드시 등록하는 규칙을 세울 것(eggarden에서 재화가 통째로 사라진 실제 사고가 있었다).

### 2-2. 아이템 카탈로그 스키마

```js
{ id:'pond', cat:'rest', name:'연못', price:70, size:2.6, footW:3, footH:2, floor:true, desc:'...' }
{ id:'tower', cat:'rest', name:'캣타워', price:35, size:2, footW:1, footH:2, desc:'...' }
{ id:'window', cat:'decor', name:'창문', price:800, size:2, footW:1, footH:1, wall:true, desc:'...' }
```

| 필드 | 의미 |
|---|---|
| `footW`/`footH` | 격자 점유 칸(가로×세로). 좌상단 앵커에서 우/앞으로 펼침. 미지정=1 |
| `cat` | 배치 팔레트 분류 탭(케어/휴식/놀이/장식). 미지정 폴백 필수 |
| `wall:true` | 벽 전용(바닥 격자 배치 불가) |
| `floor:true` | 바닥 깔개(러그·연못) — 점유 안 하고 겹침 허용, z=0 렌더 |
| `size` | 팔레트·썸네일 표시 배율(점유와 무관) |

- `wall`과 `floor`는 상호 배타. eggarden에선 "벽 가구인가"(카탈로그)와 "어떻게 걸리나"(별도 `WALL_ANCHOR` 맵)가 이중 소스인데, **새 프로젝트에선 카탈로그에 `anchor:'floor'|'mount'|'hang'` 필드로 합치는 걸 권장**.
- 렌더 관련 값(렌더 높이 `ROOM_H`, 종횡비 `FURN_ASPECT`, 연출 `FURN_ANIM`, 상호작용 `furnSpot`)이 카탈로그와 별도 테이블로 흩어져 있는 것도 eggarden의 부채 — 새 프로젝트에선 **아이템 정의를 한 객체에 모으고, "필수 필드 전부 채워졌는지" 정합 테스트를 처음부터 둘 것**(eggarden은 `node --test`로 매트릭스↔카탈로그 정합을 게이트).
- **게임화 확장 필드(06 문서 확정안)**: 새 게임 카탈로그에는 위 기본 필드에 더해 ▸ `useAnchor`(펫이 사용하는 지점 좌표·방향 — eggarden `furnSpot`의 `{lift,face,dx,pose,dur}`에 해당) ▸ `action`(사용 시 재생 동작, 예: 캣휠→run) ▸ `buffs:[{stat,val}]`(패시브 버프) ▸ `theme`(세트 효과 태그) ▸ `summon:[guestId]`(이 가구가 부르는 손님/보스) 를 모은다. **행동 스케줄러·버프 계산·소환 판정이 전부 이 데이터를 읽게** 해서 가구별 하드코딩을 없앤다.

---

## 3. 배치 로직

### 3-1. 점유·충돌 판정 (순수 함수로 유지할 것)

```js
// 점유 집합: 모든 배치물의 footW×footH 칸을 "r_c" 키 집합으로 펼침
function occupiedCells(placed, ignoreKey){   // ignoreKey = 이동 중인 자기 자신 제외
  // floor:true 아이템은 점유 집합에서 제외 (러그 위에 가구 올림)
  // 각 배치물: for dr<footH, dc<footW → occ[(r+dr)+'_'+(c+dc)] = 1
}

function areaFree(r, c, w, h, placed, ignoreKey, floorItem){
  if (r<1 || c<1 || r+h-1>ROWS || c+w-1>COLS) return false;  // 격자 경계
  if (floorItem) return true;                                 // 깔개는 격자 안이면 어디든
  if (overlapsSpawnZone(r, c, w, h)) return false;            // [새 게임 추가] 스폰존 예약(아래)
  // occ 집합과 w×h 교차 검사
}
```

**[새 게임 확장 — 06 문서 확정안] 점유맵의 이중 역할과 스폰존**:
- **점유맵 = 이동 가능 맵**: 점유된 타일은 펫·손님이 통과하지 못하는(또는 상호작용하는) 타일로도 쓴다. 액터 레이어가 `occupiedCells` 결과를 읽어 이동 경로·전투 위치를 정한다(eggarden에는 통행 차단이 없었으므로 이식 시 추가).
- **스폰존 예약(필수)**: 입구 근처 2×2~3×2 타일은 가구 배치 금지 구역. `areaFree`에서 차단하고 에디터 격자에도 표시한다. 방을 꽉 채우면 손님 등장·전투 공간이 사라져 이벤트 시스템 전체가 깨지는 것을 원천 차단. 깔개(`floor:true`)는 점유가 아니므로 스폰존 위에도 허용 가능.

### 3-2. 배치는 반드시 트랜잭션 (복제 방지의 핵심)

인벤토리가 전역이고 배치가 방별이므로, 멀티기기·빠른 연타에서 같은 아이템을 두 방에 이중 배치하는 복제가 가능하다. eggarden의 방어:

```js
function placeItemTx(sel, r, c, foot){
  const rid = curRoomId();               // 방 id를 트랜잭션 "밖"에서 고정
  gameRef().transaction(g => {
    g = normalizeGame(g);                // 정규화 먼저
    const R = gRoomById(g, rid);         // 인덱스가 아니라 안정 id로 방을 겨냥
    // 트랜잭션 "안"에서 전부 재검증:
    const remain = qty - sumPlacedItem(g.home.rooms, sel);  // 전 방 배치 합산
    if (remain <= 0) return;             // abort — 복제 차단
    if (!areaFree(r, c, foot.w, foot.h, R.placed, null, isFloorItem(sel))) return;  // 겹침 재검증
    R.placed[r+'_'+c] = { itemId: sel };
    return g;
  });
}
```

규칙 3개를 그대로 가져갈 것:
1. **UI에서 1차 검증하더라도 트랜잭션 안에서 전부 재검증**(수량·겹침·상한).
2. **방은 인덱스가 아닌 안정 id로 겨냥** — 다른 기기의 방 전환·재정렬과 경합해도 엉뚱한 방을 오염시키지 않는다.
3. **커밋 성공 시에만 연출**(배치 팝 이펙트·햅틱) — `res.committed` 확인.

낙관적 UI: 드롭 순간 커밋을 기다리지 않고 즉시 새 칸에 스냅하고, 실패하면 리스너 재렌더가 원위치 복원(느린 네트워크에서 "원위치 튕김→점프" 깜빡임 제거).

### 3-3. 드롭 좌표 보정

```js
// 포인터 px → 칸: rect 나누기
// 드롭 시 발자국 "가운데"가 손가락에 오도록: c -= round((footW-1)/2), r -= round((footH-1)/2)
// 격자 안 클램프: c = clamp(c, 1, COLS+1-footW)
```

---

## 4. 벽 배치 (별도 격자 + 앵커 3종)

- 벽 격자는 **12×4**(위=천장, 아래=바닥선), 벽 가구는 **가로 footW × 세로 1칸 고정** 점유.
- 세로 위치는 데이터가 아니라 **앵커 타입**이 결정:

| 앵커 | 예 | 세로 배치 |
|---|---|---|
| `floor` (세움) | 벽난로 | 행 무시, 항상 맨 아래 행에 스냅. **맨 뒤 바닥 가구와 같은 바닥선**(bottom = 3+1×46 = 49%)에 세움 — 벽/바닥 경계(54%)에 두면 5% 떠 보이는 버그 |
| `mount` (걸이) | 창문·벽시계 | `bottom% = 54 + (4-r)×11` → r4=54, r3=65, r2=76, r1=87 |
| `hang` (매닮) | 모빌·샹들리에 | 천장 쪽 `top%` 앵커 + `transform-origin: center top` (아래로 늘어짐, 흔들림 중심이 위) |

- 벽 가구 렌더 높이는 **벽 1칸(≈9~11%)에 맞춰야** 위·아래 칸과 안 겹친다(eggarden에서 창문·벽시계·모빌이 서로 침범한 실제 버그).
- 벽 배치도 바닥과 동일하게: 순수 충돌 함수(`wallAreaFreePure`) + 트랜잭션 재검증 + 탭/드래그 양쪽 지원.

---

## 5. 배치 UI — 롱프레스 드래그

**설계 목표: 세로 스크롤과 드래그 배치의 공존.** 즉시 드래그로 만들면 시트 스크롤이 불가능해진다.

```js
const LONGPRESS_MS = 250, LP_CANCEL_PX = 12;
function beginLongPress(e, arm, tap){
  // pointerdown → 250ms 타이머
  // 대기 중 12px 이상 이동 → 취소(스크롤로 넘김). preventDefault 안 함 — 스크롤 자유
  // 타이머 완주 → vibrate(12) + arm() (이때부터 드래그, 스크롤 잠금)
  // 타이머 전에 뗌 → tap() (격자=메뉴, 팔레트=선택 토글)
}
```

- **arm 시에만 스크롤 잠금**: `body.dragging` 클래스 + `touchmove` `preventDefault`(passive:false). CSS로 `touch-action:none`.
- **실패 안전 해제 필수**: 시트 닫힘·재렌더로 `pointerup`을 놓치면 스크롤 잠금이 영구히 남는다 → 모든 드래그 상태를 강제 해제하는 `cancelCatDrags()`를 시트 닫힘·재렌더 훅에 연결. 드래그 중이면 재렌더 스킵.
- 격자 요소는 `touch-action:pan-y`로 세로 스와이프를 통과시킴.
- 드롭 프리뷰: 격자 위 고스트 사각형(`gridLeftFrac` 등 평면 좌표), 겹침이면 `.bad`(빨강). + 정렬 스냅 가이드(중심이 격자 중앙/다른 가구 중심과 맞으면 점선).
- 접근성: 팔레트 항목에 `onclick="if(event.detail===0) select(...)"` — 키보드 Enter로도 선택 가능하게.

### 격자 CSS

```css
.grid12 { aspect-ratio: 12/8; touch-action: pan-y;
  background-image: linear-gradient(var(--bd) 1px, transparent 1px),
                    linear-gradient(90deg, var(--bd) 1px, transparent 1px);
  background-size: calc(100%/12) calc(100%/8); }  /* 격자선 = 그라디언트 트릭 */
.gridwall { aspect-ratio: 3; background-size: calc(100%/12) calc(100%/4); }
```

---

## 6. 이식 체크리스트

- [ ] 셀 키 `"r_c"`, 좌상단 앵커 + footW×footH 펼침, frontRow 기준 원근 — 그대로 채택
- [ ] 평면 좌표 헬퍼(에디터)와 원근 좌표 헬퍼(캠)를 **별도 함수로 분리**하고 상수는 단일 소스(`CAM` 같은 객체)에
- [ ] `occupiedCells`/`areaFree`/`normRoom`을 **DOM 비의존 순수 함수**로 → 단위 테스트 대상
- [ ] 배치·회수·이동은 전부 트랜잭션(또는 서버 검증) + 트랜잭션 안 재검증 + 안정 방 id
- [ ] 정규화 함수에 새 필드 등록 규칙(필드 유실 방지) 문서화
- [ ] 롱프레스 게이트 + 스크롤 잠금 + 실패 안전 해제
- [ ] 카탈로그에 렌더·상호작용 메타 + 게임화 필드(useAnchor/action/buffs/theme/summon)까지 모으고 정합 테스트를 처음부터
- [ ] 벽/바닥 격자 분리, 벽 앵커 3종(floor/mount/hang) — 벽은 충돌 없음·장식 전용, 배경(벽지/바닥재)은 그리드 없이 스킨 키 2개
- [ ] 점유맵을 이동 가능 맵으로 겸용(액터 경로가 읽음)
- [ ] 스폰존 예약 — 배치 판정(`areaFree`)과 에디터 표시 양쪽에 반영
