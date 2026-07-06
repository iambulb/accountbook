# 🧱 코드 구조

웹 앱 코드는 모두 **`public/`** 폴더에 있습니다. 빌드 도구·번들러 없이 브라우저가 정적 파일을 그대로 로드합니다. 배포 설정(`firebase.json`·`netlify.toml`·`.firebaserc`·`database.rules.json`)은 저장소 루트, 문서는 `docs/` 입니다.

## 파일별 책임

모두 `public/` 기준 경로입니다.

| 파일 | 줄 수* | 책임 |
|---|---|---|
| `index.html` | ~95 | 앱 셸 — 로그인 화면, 상단바(**모드 토글**·워크스페이스 칩·펫캠·테마), 탭바, 시트/오버레이 컨테이너, SDK·모듈 로드 |
| `js/firebase.js` | ~17 | `firebaseConfig` + Firebase 초기화(`auth`, `db`). SDK 미로드 시 폴백 화면 |
| `js/constants.js` | ~54 | 라벨/아이콘 맵, 거래효과 테이블(`TX_EFFECT`), 계좌·제공사·구독·목적별 타입, 기본 카테고리(`buildDefaultCategories`) |
| `js/util.js` | ~60 | **순수 계산 유틸**(돈/통화/정산): `won`·`fmtComma`·`parseAmount`·`curInfo`·`fmtForeign`·`krwFromForeign`·`sumByCurrency`·`computeSettleAmounts`·`personKey`·`addDays`·`nextDue`·`dueDiffDays`·`todoScope`·`friendTodoOrder`·`missionStreak`·`weekDotsData`·`todayMissionState`·`customMissionMilestone`·`todayPending`·`loginStreakReward`·`dexProgress`·`affectionLevel`·`frequentTxTemplates`·`txMatches`·`homeBadgeShow`·`homeCardKind`·`CURRENCIES` + 배지 DOM 반영(doc 주입식) `applyHomeBadge`/`applyTodoTabDot`. 브라우저 전역 + Node `module.exports` 듀얼 → `test/`에서 단위 테스트(순수 22 + jsdom DOM 3 = 25케이스; jsdom은 devDependency). |
| `js/core.js` | ~1019 | 전역 `state`, 헬퍼, 테마, 인증, 워크스페이스 부트스트랩, 마이그레이션, RTDB 리스너, 시딩, **모드/탭바**(`setMode`·`renderTabBar`·`fabAdd`) |
| `js/views.js` | ~2326 | 모든 화면·시트 렌더링 — **가계부**(달력·리포트·자산·더보기 + 각종 시트) + **할일**(목록·캘린더·완료·공유·리포트), CSV 내보내기 |
| `js/cats.js` | ~360 | 🐱 알뜰홈(구 고양이집) — 은화 경제(`users/{uid}/game`: coins/owned/home/missions/progress/codes), 도트 아트(`pxSvg`+매트릭스, 고양이 15종 걷기2+정면+포즈 `catPose`(sit/loaf/sleep), 가구 8종+펫하우스 `M_PETHOUSE`+캣휠 `M_CATWHEEL`(한정, 2×2 러닝휠)), **PNG 스프라이트 걷기+정면 쉬기**(`PET_SPRITES`/`catActorHTML`: 고양이 15종 전부(…·카오스·샴)=PixelLab 288×48 6프레임 시트 `.cspr` CSS steps, **이동=옆 걷기 시트만·정지/가구쉼=south 정면**, 주기 `walkDur`(`--wdur`)로 이동속도 매칭, `frontWalk`(하양)은 이동 중 east 정지스틸, 시트 없는 동물은 SVG 매트릭스 폴백 — 에셋 `assets/pets/<species>/<id>/`(종별 하위폴더, `sprStills`가 walk 경로에서 파생), 카탈로그 `PET_CATALOG`(species), id 하위호환 `PET_ID_MIGRATE`, 처리 규칙 `docs/pet-asset-pipeline.md`, **런타임 펫**(dev 업로드): 메타 `catalogPets`+이미지 `catalogPetArt` 분리 저장, 지연 로딩 `ensurePetArt`(보이는 펫만 `.once`·세션 캐시 `_petArt`, 로딩 전 도트 알 플레이스홀더), `applyCatalog`/`watchCatalogPets` 병합), 단일 rAF 걷기 엔진(`buildActors`/`stepActors` 가구별 상호작용 `poseForItem`), 전역 dock(`#catdock` 웹캠 방: 벽지+가구 배경), 알뜰홈 시트(**홈·배치** 2탭, 배치=**꾹 눌러 롱프레스 드래그** `beginLongPress`/`giDown`/`palDown`+`furnSpot` 가구별 상호작용) + **알뜰샵**(더보기 별도 진입 `openShop`, 은화/금화 잔액바 `coinbar`+서브탭 고양이/가구/소비/벽지/이벤트, 상점 아이콘 `shopSvg`/`M_SHOP`=은화기반 스토어프론트, `_catTab==='shop'`으로 `renderCatHouse` 재사용); **소식**(`openNews`: 알림/이벤트/공지+쿠폰 `catNewsHtml`, 픽셀 아이콘 `bellSvg`/`megaSvg`/`missionSvg`, dock/더보기 뱃지 `newsUnread`/`giftUnread`, 알뜰 아이콘=`coinTap`→소식)·**미션**(`openMissions`/`catMissionHtml`, 더보기 진입, 오늘홈은 요약만)은 **별도 화면으로 분리**, 벽지(`WALLPAPER_CATALOG`, 벽돌은 픽셀타일 `tile`+`wallCss`), **바닥 스킨**(`FLOOR_CATALOG` 8종·`floorCss`/`currentFloor`/`ownsFloor`/`buyFloor`, 타일→SVG data URI `tileBg`, `home/rooms/{i}/floor`·`owned.floors`, 알뜰샵 '바닥' 탭), 연못 구조물(`M_POND`/`floor:true`), **뽑기**(`TIERS`/`rollFromPool`/`openGacha`, 펫알·랜덤박스, 오픈 연출 `runGachaFx`+`#catFx`: 도트 선버스트/오오라/트윙클 `M_RAYS`·`M_AURA`·`M_SPARK4`+`lightLayers`/`fxAuraTwinkles`, 등장 오오라는 펫 중심 정렬), 금화(`GOLD_PAL`/`goldSvg`, 소비처=슬롯 확장), **활성 슬롯**(`home.slots` 기본3·`slotCount`/`buySlot` 금화100로 확장, 방당 상한), **여러 방(프리셋)**(`home.rooms[]`·`current`·`roomSlots`, 방별 가구·벽지·펫 독립, 접근자 `room()`/`roomChild()`/`gRoom(g)`, `buyRoom`(금화500·최대5)/`switchRoom`/`openRoomMenu`(이름·`copyRoomWall`·`clearRoom`·복제 `duplicateRoom`(인벤토리 초과분 제외)·삭제 `deleteRoom`(환불없음·index remap)·대표방 `setShowRoom`·순서 `moveRoom`), 썸네일 즐겨찾기 별 `favRoom`+`starBurst`/`starSvg`(`M_STAR`), 대표 방 `home.showRoom`+공개 스냅샷 `homeCam/{uid}`(`writeHomeCam`/`repRoomSnapshot`; 친구 캠·스토리는 이것만 읽음, `users/game`은 규칙상 소유자 전용 → 다른 방 DB 비공개), 방 이모지 `setRoomEmoji`, 순서 드래그 `rmDown`/`moveRoomTo`, 한 펫 한 방(`toggleActiveCat` 트랜잭션·`petRoomIndex`·펫카드 3상태), 미니썸네일 `roomThumb`/`roomStripHtml`, 인벤토리 전역합산 `itemPlacedAll`(순수 `util.sumPlacedItem`, 복제방지), 정산 전 방 `reconcilePets`, 레거시 flat→rooms 이관 트랜잭션 `migrateHomeRoomsIfNeeded`+순수 `util.normalizeHome`), **등급 가격**(`TIER_PRICE`가 `CAT_TIER` 기준 `PET_CATALOG.price` 산정), 품종 라벨(`PET_CATALOG.breed`, 기본 코숏)·이름 등급색(`catTierColor`), **🎁 선물함/🎒 가방·코드**(`PROMO_CODES`/`redeemCode`(일반1회·개발자무한, 보상→`game.gifts`)·`openGiftbox`/`claimGift`/`claimAllGifts`·`openBag`/`useBagItem`/`useHeldGacha`·`CONSUM_META`·선물함 아이콘 `giftSvg`(M_BOX 재채색)), **✨ 무지개알/박스**(`rainbowEggSvg`/`rainbowBoxSvg`·`buyRainbow`/`useRainbow`·`RAINBOW_TIERS` 특별↑ 확정·금화 `RAINBOW_PRICE_GOLD`), **개발자 모드**(`isDev`/`devOn`/`openDevGacha`: canel94@gmail.com 전용 확률·구성 오버라이드, localStorage), 카탈로그 상수 |
| `js/main.js` | ~86 | PWA 부트(`beforeinstallprompt`·SW 등록·테마) + **접근성 레이어**(`a11yDecorate` + MutationObserver·키보드 델리게이션·Esc·포커스 트랩) |
| `sw.js` | ~166 | 서비스워커 — 앱 셸 캐시(펫 에셋 포함, `@gen` 마커), 출처별 캐시 전략 |
| `css/styles.css` | ~894 | 전체 스타일(라이트/다크 테마 CSS 변수) |
| `icons/` | — | 앱 아이콘(`icon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`) |
| `manifest.webmanifest` | — | PWA 매니페스트(이름·아이콘·display) |
| `.well-known/assetlinks.json` | — | TWA(APK) 도메인 검증 |

<sub>*대략치 — 변경 시 갱신.</sub>

## 로드 순서와 전역 의존

`index.html` 하단 script 태그 순서:

```
firebase.js → constants.js → util.js → core.js → views.js → cats.js → main.js
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
| 권한/공동 | `isWsOwner`·`defaultVisibility`·`defaultOwnerName`·`defaultOwnerUid`·`saveWsSettings`, 소유자 동작 `renameWorkspace`·`transferOwnership`·`removeMember` (core). 항목별 공개범위/소유자는 각 생성 폼의 셀렉트가 위 기본값을 사용. *(제거됨: 별도 '권한·공동 설정' 화면 `openSharedSettings`·`collectPrivateItems`·`makeItemPublic`·`makeAllPublic` — 중복·저가치)* |
| 인증(계정) | `signup`·`login`·`logout`·`beforeAuth`·`authOptGet`/`authOptSet`/`toggleAuthOpt`·`changePassword`(현재 비번 재인증→`updatePassword`)·`openLoginHelpSheet`/`sendPasswordReset`(`sendPasswordResetEmail`) (core); `openPasswordChangeSheet` (views) |
| 개발자 모드 | `isDev`·`devOn`·`toggleDevMode`·`devCfg`/`saveDevCfg`·`openDevGacha`·`openDevPetManager`(알뜰홈 인벤토리식 레이아웃: 상단 sticky 스테이지 `devPetStageHtml`(선택 펫 미리보기+등급/가챠전용/수정/삭제/연출 관리)+아래 등급별 펫 그리드 셀 `devPetCellHtml`(`.palette.catinv` 재사용), `devSelectPet`=그리드 셀 `.on`·`#pmStage`만 부분 갱신; 펫 추가/수정/삭제 `submitDevPet`·`deletePetSoft`; 가챠 연출 펫 지정 `setGachaFxSlot`/`gachaFxSlotOf`/`gachaFxSlotDesc`, 미리보기 `devPreviewGachaFx`=3탭·리빌 없이 시퀀스만 재생·자동종료; 실전/미리보기 공용 시퀀스 예약 `fxCatSeqSchedule`; **🥚×10 10연차 미리보기(개발 전용)** `devPreview10`(시나리오 랜덤/전부전설↑/신화1개/한정포함)→`runTenGachaFx`: 둥지 `M_NEST`/`nestSvg`·`tenNestHtml`(2×5)·탭 `tenTap`/`tenTapShake`/`tenTap2`·`tenClimax` 알별 카메오 `tenSpawnCameo`·오픈 `tenOpenEgg`·알별 나비 `tenEggButterflies`·결과 카드 `tenRevealCardHtml`(무작위 `tenShuffle`)·피날레 `tenFinale`(펫 정면·`tenScaleFor` 큰펫 반감)·`closeTenFx`, 배경은 `pickupSceneHtml('reveal')` 재사용, `.ten-*` CSS; 발끝 정합=알 바닥 실측 `--floor`+걷는시트 여백 실측 `measureFxFoot`(`_measurePadUrl`)+사전측정 `prewarmGachaFxPads`)·`openDevDataTools`(데이터 정리: `migrateCatalogArtOnce`→확인 후 `_migrateCatalogArtOnce` + `exportPetStatic` 런타임→정적 승격)·**기구물 관리** `openDevFurnManager`/`furnMgrHtml`(타입 탭 `FURN_TYPES`=가구·벽지·바닥·`setFurnSub`; 공용 행 `fmRowHtml`+`itemRowHtml`/`wallRowHtml`/`floorRowHtml`; 즉시 전역 저장 가구 `setFurnTier`/`setFurnPrice`/`resetFurn`→`config/furniture`·벽지 `setWallTier`/`setWallPrice`/`resetWall`→`config/wallpaper`·바닥 `setFloorTier`/`setFloorPrice`/`resetFloor`→`config/floor`, 구독 `loadFurnCfg`/`loadWallCfg`/`loadFloorCfg`; 등급 리더 `effItemTier`/`effWallTier`/`effFloorTier`(각 `_TIER` 상수←전역 config)·가격 리더 `itemBuyPrice`/`wallBuyPrice`/`floorBuyPrice`(shop·`buyItem`/`buyWall`/`buyFloor` 사용); 특별↑=자동 랜덤박스 전용 `isGachaOnlyItem`/`isGachaOnlyWall`/`isGachaOnlyFloor`, 박스풀 `boxPool`이 eff*Tier 사용)·`loadGachaFx`(config/gachaFx 구독) (cats); **사용자 현황** `openDevUsers`/`renderDevUsers`/`devUsersPage`(views — 전체 users+presence 읽어 가입순 10명 페이지, 프로필+친구코드·접속중 무지개테두리·하단 카운트), 접속상태 `setupPresence`(core, presence/{uid}); 진입 `openDevModeSheet`(views, 더보기 그리드 무지개알 타일) |
| 프로필 | **사용자**: `state.userPhotos`·`loadMemberPhotos`·`saveProfile`·`avatarColor` (core); `avatarHtml`·`resizeImageFile`·`openProfileSheet`(이메일 표시+비밀번호 변경 진입)·`pickProfilePhoto`·`removeProfilePhoto`·`onSaveProfile` (views). **가계부(워크스페이스)**: `saveWsProfile`(core, `workspaces/{wsId}/name`·`/photo`)·`wsAvatarHtml`·`openWsProfileSheet`·`pickWsPhoto`·`removeWsPhoto`·`onSaveWsProfile` (views). `updateWorkspaceChip`은 사진 있으면 아바타 표시 |
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
| **카테고리 색/아이콘** (core.js) | `CAT_META`(기본 카테고리→솔리드 색+아이콘 키)·`CAT_SVG`(라인 SVG 라이브러리 46종)·`CAT_FALLBACK`(중복 없는 팔레트)·`catColor`(팔레트 오버라이드+hex검증+해시폴백)·`catSvgIcon`(**카테고리 `iconKey` 우선** → 이름 매핑 → tag)·`catTileStyle`/`catTileMini`(13% tint 타일)·`hexA`/`svgWrap`. 거래행은 `txRowHtml`+`TX_SVG_KEY`로 카테고리=tint 타일/그 외=중립 타일 |
| **시트 실시간 갱신** (core.js) | `state._sheetRefresh` 훅: `openSheet`/`closeSheet`에서 해제, `rerender()`가 열린 시트 본문만 다시 그림(스크롤 보존). 등록 예: `renderCatManage` |
| 워크스페이스 | `openWorkspaceSheet`(개인 프로필 + 그룹 목록)·`openCreateGroupSheet`·`openJoinGroupSheet`·`openGroupManageSheet`·`memberAvatarStack`(탭→`openWsMembersSheet` 멤버목록→멤버 탭 시 `openFriendHome` 방문). 소유자=픽셀 왕관 `crownSvg`(`M_CROWN`). 설정 타일 `gearSvg`(`M_GEAR` 8이빨), 가방 `bagSvg`(`M_BAG` 아치 손잡이) |
| 더보기 | `renderMore`(시안: `.prow`+`.grid4`+`.lst`)·`gcell`/`lrow`(그리드·리스트 행 헬퍼)·`MORE_ICON`(SVG 아이콘 맵)·`goHome` |
| 예산 | `openBudgetSheet`·`openBudgetDetail`·`openBudgetEdit` |
| 카테고리 | `openCategorySheet`·`renderCatManage`(실시간 갱신 훅 등록)·`catManageRow`·`moveCat`/`toggleCatActive`·`openCatEdit`(아이콘 그리드+색 스와치)·`pickCatIcon`/`pickCatColor`·`saveCat`(iconKey 저장)·`CAT_PALETTE` |
| 정기결제 | `openRecurringList`·`viewRecurringTxs`·`openRecurringEdit`·`renderRecAccts`·`recConsumerField`(소비 대상)·`renderRecCardPerf` |
| 구독 | `openSubscriptions`·`renderSubs`·`openSubDetail`·`openSubEdit` |
| 목적별 | `openPurposeBooks`·`renderPBs`·`pbCard`·`openPbDetail`(탭)·`renderPbTxTab`·`openPbEdit` |
| 정산(Step 9) | 거래시트 `renderSettleBlock`·`setSplitType`·`collectSettle`, 상세 `renderPbSettleTab`·`pbSettleBadge`, 송금 `openSettlePay`·`saveSettlementPayment`·`cancelSettlementPayment`, `openSettlementOverview` |
| 경조사비 | `openGiftBook`·`setGiftTab`·`renderGiftLog/Planned/People`, 기록 `openGiftEdit`·`saveGiftEvent`(거래연결)·`deleteGiftEvent`, 예정 `openPlannedEdit`·`savePlanned`·`completePlanned`, 인맥 `openPersonEdit`·`savePerson`, 합계 `giftSummary`·`personGiftTotals` |
| 대출/이자 | `openLoanBook`·`loanCard`·`openLoanDetail`·`openLoanEdit`·`saveLoan`·`deleteLoan`·`setLoanStatus`, 상환 `openLoanPayment`·`saveLoanPayment`(이자 거래연결)·`deleteLoanPayment` |
| 내보내기 | `exportCSV` |
| **할일(투두)** | `renderTodoList`/`renderTodoCalendar`/`renderTodoDone`·`todoRow`/`todoDueBadge`·`scopedTodos`(컨텍스트로 스코프 결정: 개인프로필=`myTodos`·친구열람=`friendTodos`·그룹=`ws`)/`allTodos`/`todoDbRef`·`setTodoFeed`/`todoScopeSeg`(개인프로필만 [내 할일\|친구들])·CRUD `openTodoEdit`/`saveTodo`/`deleteTodo`/`toggleTodo`·더보기 시트 `openTodoReport`/`openRepeatTodos`·PB연동 `pbTodoSummaryHtml`. 상세 [features-todo.md](features-todo.md) |
| **친구(별도 추가)·스토리** | 피드 `renderFriendsFeed`(스토리 줄·내 스토리·`storyItem`·`storySeenMap`, 링=할일+`home.changedAt` 최신)·관리 시트 `openFriendsSheet`(더보기 공용·이름옆 하트수·오늘변경 무지개 링)·관계 `addFriendByCode`/`acceptFriend`/`declineFriend`/`removeFriend`. util `friendFeedOrder`/`storyRing`/`relTime`. core `syncFriendTodoWatch`·`loadFriendPublics`(친구 `homeLikes`Σn→`friendLikes`·`home/changedAt`→`friendHomeChangedByUid`)·`ensureFriendCode`. *(레거시 풀스크린 뷰어 `openMyStoryTodos`/`renderStory`/`storyNext`… 잔존)* |
| **친구 집(펫캠)·좋아요** | `openFriendHome`(views, 캠+좋아요+할일**(친구+공개시만)**·비공개&비친구면 '알뜰' 익명)·`likeFriendHome`·`friendChangedToday`. cats: `friendRoomHtml`/`mountFriendRoom`/`friendActiveCats`/`friendPlacedList`, `likeHome`/`homeLikeCount`/`likedTodayBy`/`watchMyLikes`(❤️ 하루1회·총합), `touchHome`(펫/가구 변경→`home.changedAt`). 엔진: **다중 무대**(`activeStages`→`_eng.groups`)라 친구 방과 dock 캠이 **동시에 로밍**(무대별 액터·`occupantsOf`/`separatePets`·지속키 `pkey=무대id:펫id`)·`buildActors` 가구 소스 분기·`propMarkup(...,plain,live)` 친구 방도 가구 연출(읽기전용 유지). 아이콘 `heartSvg`/`peopleSvg`(`M_HEART`/`M_PEOPLE`) |
| **랭킹·프로필 공개·기본 아바타** | `openRanking`/`renderRankingBody`/`rankAvatar`(views, TOP10 단상+리스트, 사진 지연 로드)·`trophySvg`(`M_TROPHY`)·`writeMyRanking`(cats, `rankings/{uid}` 소유자 유지). 프로필 공개 `state.profilePublic`·`saveProfile(name,photo,isPublic)`(core)·`openProfileSheet` 토글. 기본 아바타 `avatarHtml`→은화(`coinSvg`)·`wsAvatarHtml`→금화(`goldSvg`) |

## 모드(가계부/할일) · 네비게이션 / 렌더 흐름

- **모드 토글**(core.js): `setMode('ledger'|'todo')`(localStorage) → `applyMode` → `renderTabBar`(모드별 `_TABSETS`)·`updateModeToggle`·기본 탭 이동. FAB는 `fabAdd()`가 모드 분기(`openTxSheet`/`openTodoEdit`).
- **오늘 홈(랜딩)**: `state.view`('home'|'mode', `localStorage('view')`). `renderHome`(views.js)가 오늘 미션·할일·가계부 한 줄을 조합 — `homeMissionRow`/`homeMissionTap`(일일 딥링크). 진입/복귀 `goHome`(core.js 랜딩판, 다시 누르면 토글로 닫힘)·`goto(mode,tab)`, `rerender()`가 `view==='home'`이면 `renderHome` 후 종료(바텀탭바는 `body.home-view`로 숨김). **오늘 남은 일**은 단일 소스 `todayPending`(util.js 순수) ← 브라우저 래퍼 `todayPendingNow`(views.js). 모드 화면에서 미처리 있으면 `updateHomeBadge`(core.js, rerender·`renderTabBar` 말미)가 **상단 로고 점 + 할일 탭 점**을 토글; 그릴 카드는 `homeCardKind`(sections|done|empty), 배지 표시는 `homeBadgeShow`(둘 다 util 순수). `allDone`이면 완료 카드(고양이 `catFace`+`shouldCelebrateOnce` 1회 축하), `any` false면 '예정 없음' 톤.
- **내 미션(커스텀 습관, cats.js)**: `customMissionList`/`customMissionRow`·`toggleCustomMissionToday`(멱등 지급)·`openCustomMissionEdit`/`saveCustomMission`/`deleteCustomMission`·`missionLogDoneDates`/`customCheckedToday`. 순수헬퍼 `missionStreak`/`weekDotsData`/`todayMissionState`/`todayPending`(util.js).
- 탭 전환은 `go(tab)` — 가계부(달력/리포트/자산/더보기)·할일(할일/캘린더/완료/더보기). `rerender()`가 `state.tab`으로 해당 `render*` 호출(더보기 `renderMore`는 `state.mode`로 그리드 분기).
- 시트(모달)는 `openSheet(title, html)` / `closeSheet()`, 확인 다이얼로그는 `confirmSheet(msg, onYes)`.
- RTDB 리스너가 데이터를 받을 때마다 `rerender()` 로 현재 화면을 다시 그립니다(단방향: 데이터 변경 → 전체 재렌더).

## 코드 스타일

- 주석·UI 라벨·토스트 메시지는 **한국어**.
- 들여쓰기는 기존 파일 관례(JS 본문 4칸 들여쓰기, 한 줄에 압축된 헬퍼 다수)를 따릅니다.
- 사용자 입력은 `escapeHtml` 로 이스케이프 후 `innerHTML` 삽입(XSS 방지).
