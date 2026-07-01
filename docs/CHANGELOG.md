# 변경 이력 (Changelog)

이 프로젝트의 주요 변경 사항을 기록합니다. 형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) 를 따르며, 사용자 체감 변경은 모두 여기에 한 줄씩 남깁니다.

분류: `추가`(Added) · `변경`(Changed) · `수정`(Fixed) · `제거`(Removed) · `보안`(Security).

## [Unreleased]

> 새 변경 사항은 여기에 추가하세요. 릴리스할 때 버전 번호와 날짜를 붙여 아래로 내립니다.

### 변경
- **소비 대상과 출금 수단 분리 + 리포트 개인별/공동 지출 분리**: 지출·선불결제·포인트사용 거래 입력 시트에 **"소비 대상"** 선택(워크스페이스 멤버 또는 **`공동`**)을 추가해 **출금 수단(어느 계좌)** 과 **소비 대상(누구의 소비)** 을 분리. 집세처럼 공동 비용은 `공동`으로, 각자 쓴 용돈은 본인으로 귀속(`consumerField`/`recConsumerField` 추가, `openTxSheet`·`renderTxDyn`·`saveTx`·정기거래 `renderRecAccts`·`saveRecurring`에서 `tx.user`를 선택값으로 저장 — 기본값 본인). 리포트 "멤버별 지출"을 **개인별 지출(용돈)** 과 **공동 지출(집세 등)** 두 섹션으로 분리 표시(`renderStats`). 데이터 구조 변경 없음(`user` 필드 의미 확장). `sw.js` `v3.18.0`.

### UI 리디자인 (진행 중)
- **레이아웃 좌우 여백 대칭 수정**: `.content`(및 `.auth-wrap`)의 세로 스크롤바가 우측 여백을 잠식해 좌우가 달라 보이던 문제 수정 — 스크롤바 숨김(`scrollbar-width:none`+`::-webkit-scrollbar`)·`overflow-x:hidden` 추가로 좌우 20px 대칭 확보. `sw.js` `v3.20.1`.
- **가계부 프로필(이름·사진) 편집 + 달력 버튼 정리 + 리포트/여백 다듬기**: ① **가계부(워크스페이스) 프로필** — 사용자 프로필과 별개로 **가계부 이름+사진**을 변경(`openWsProfileSheet`/`saveWsProfile`, `workspaces/{wsId}/photo`에 256px JPEG 저장, 규칙 변경 없음—멤버 쓰기 허용). 더보기 프로필 행(`.prow`) 아바타=가계부 사진/이니셜로 표시하고 탭하면 편집(개인=항상, 그룹=소유자만 `편집` 배지). 상단 `wsChip`·가계부 전환 시트 행에도 사진 반영. ② **달력 "이 날짜에 추가" 버튼 제거**(FAB로 충분, `selectedDayHtml`). ③ **리포트** 선불·포인트 잔액 카드 위 여백 확대(`margin-top`). ④ **전체 좌우 여백 살짝 증가**(`.content`/`.topbar` 18→20px). `sw.js` `v3.20.0`.
- **카테고리 관리 개선(실시간 반영·아이콘/색 선택·터치 피드백) + Safari 키패드 줌 방지**: ① **시트 실시간 갱신** — 카테고리 순서변경(▲▼)·온오프 토글이 즉시 반영되도록 일반화된 훅(`state._sheetRefresh`) 도입: `openSheet`/`closeSheet`에서 해제, `rerender()`가 열린 시트의 본문만(스크롤 보존) 다시 그림. `renderCatManage`가 훅 등록. ② **아이콘 라인 그리드 선택** — 카테고리에 `iconKey` 필드 추가, `catSvgIcon`이 저장된 키 우선 사용(이름 매핑→tag 폴백). 편집 시트의 이모지 입력을 **라인 아이콘 그리드**(`.icon-grid`)로 교체(`pickCatIcon`), 전체 카테고리 아이콘 변경 가능. `CAT_SVG`에 가계부용 라인 아이콘 **19종 추가**(paw·car·fuel·scissors·dumbbell·cart·shirt·baby·gamepad·music·ball·bolt·droplet·piggy·trend·doc·donate·ticket·monitor, 총 46종). ③ **색상 팔레트** — `CAT_PALETTE`를 중복 없는 차분한 톤(`CAT_FALLBACK`)으로 교체, 스와치 그리드(`.swatch-grid`) UI. ④ **터치 피드백** — `.acct`·`.menu-item`·`.lrow`·`.chip`·`.gcell`에 `:active` 추가. ⑤ **Safari 더블탭 줌 방지** — `button`/`.kp button`에 `touch-action:manipulation`(+키패드 `user-select:none`), 핀치 줌은 유지. ⑥ 예산·구독·정기 카테고리 select 드롭다운의 이모지 접두 제거(이름만). `sw.js` `v3.19.0`.
- **리포트 도넛 버그 수정 + 카테고리 색 중복 제거 + 기능시트 라인아이콘화 + 상단바/전환시트 디테일**: ① **리포트 카테고리 도넛 미표시 버그 수정** — `catColor`가 색 없는/미등록 카테고리(예: `엔터`)에서 무효값을 반환해 `conic-gradient` 전체가 깨지던 문제. `catColor`에 hex 검증 + 이름 해시 폴백(`CAT_FALLBACK`)을 추가해 **항상 유효한 색 보장**. ② **카테고리 색 중복 제거** — `CAT_META`를 서로 겹치지 않는 25색(구버전 `엔터·식사·생활·교육` 포함, `경조사≠경조사비수령` 등) 차분한 팔레트로 재구성, `엔터` 색 부여. `constants.js` 기본 색도 동기화. ③ **기능 시트 라인아이콘화** — 경조사비·예정·인맥·대출 상환·공개범위 항목의 솔리드 타일+이모지 → **중립/라인 SVG**(`giftSvgIcon`/`GIFT_SVG_KEY`, `user`/`coin`/`heart`/`flower` 아이콘), 예산·정기결제 행에 **작은 tint 라인아이콘 타일**(`catTileMini`/`.mtile`, `budgetTile`). ④ **상단바·전환시트** — `wsChip` 이모지 → `.dotk` 점+이름, 가계부 전환 시트 행을 라인아이콘 타일(개인=home·그룹=people)+**체크 표시**로. `sw.js` `v3.17.0`.
- **로그인 화면 시안화 + 로고/다크토글 아이콘 교체**: ① **로그인 화면**을 핸드오프 톤으로(로고 64px·타이틀 26/700·`--bd` 인풋·검정 CTA + **초대코드 안내 푸터** `.authfoot`). ② **앱 로고 교체** — 파랑 `₩` → **흑백 고양이 은화(silver coin) 단순 아이콘**(`public/icons/icon.svg` 새로 작성: 실버 라디얼 코인 + 검정 고양이 얼굴, 흰자/은색 수염). `manifest.webmanifest`에 확장형 SVG 아이콘 추가·테마색 `#ffffff`. ③ **상단 다크모드 아이콘** 이모지(🌙/☀️) → **시안 선형 SVG 해/달**(`core.js` `ICON_SUN`/`ICON_MOON`, `currentColor` 흑백). `.icon-btn`(36px)에 svg 규격 추가. `theme-color` 흰색으로. *PWA 설치용 PNG(192/512)는 변환 도구 부재로 미갱신 — 동봉 `regen-icons.html`로 재생성 후 교체 필요.* `sw.js` `v3.16.0`.
- **디자인 핸드오프 v2 전면 개편 — 토큰 팔레트 + 카테고리 옅은 색/라인 아이콘 시스템**: 새 핸드오프(`design_handoff_household_ledger/`)에 맞춰 ① **토큰 팔레트 교체**(`styles.css` 라이트/다크 — `--text #191F28`·`--sub #8B95A1`·`--expense #F04452`·`--income #3182F6` 등 + **카드/인풋 테두리 토큰 `--bd #E5E8EB` 신규**), ② **카드 스타일 변경**(`.card` soft 채움 → **흰 배경 + 1px `--bd` 테두리**, radius 20), ③ **카테고리 색/아이콘 시스템**(`core.js`): 기본 카테고리 22종을 핸드오프 팔레트로 오버라이드(`CAT_META`)하고 **얇은 라인 SVG 아이콘 라이브러리**(`CAT_SVG`) 도입 — 거래행·카테고리 타일이 **13% 알파 tint 배경 + 솔리드 색 라인 아이콘**으로(헬퍼 `catColor`/`catSvgIcon`/`catTileStyle`/`hexA`/`svgWrap`, **이모지→라인 아이콘**). 거래행 타일 38px 솔리드+이모지 → **46px tint+라인 SVG**(`txRowHtml`/`TX_SVG_KEY`), 카테고리 관리행도 동일. ④ **자산 순자산 카드 검정 hero → 흰 카드+테두리**(`.assethero`, 카드대금 빨강), 계좌/은행 아이콘은 **중립 회색 타일**(`acctRowHtml`). ⑤ 리포트 도넛 기타색·인풋/섹션헤더 여백 정리. 기본 카테고리 색(`constants.js`)도 핸드오프 톤으로. 기능 상세 시트는 토큰·카드 테두리 자동 상속. 헤드리스 문법 검증(에러 0). `sw.js` `v3.15.0`.
- **자산 화면 시안 1:1 재현**(`renderAssets`): 상단 **순자산 다크 hero**(`.assethero` — 순자산 큰 숫자 + 하단 분리행 `총자산`/`카드대금`/`계좌 N개` pill, `순자산=총자산−카드대금` 실데이터 계산) → 섹션을 **`.sech` + 원형 `.addbtn`**(＋ SVG)로 통일(`sechHtml` 헬퍼·`PLUS_SVG`) → **입출금·현금 / 선불·포인트 / 기타** 계좌 행을 시안 `.acct`로(유형별 **라인 SVG 아이콘** `acctIcon`: 은행·현금·카드·포인트·간편결제 등, 색은 `a.color` 유지, sub=`유형 · 소유자`) → **카드 실적**을 `.perfrow`(`.perftop`/`.pct`/`.prog`/`.perfsub`, 헤더 우측 현재 월, 달성=인컴색) → **적금 목표**를 예산행 톤 `.bgrow`(`.bgtop`/`.bgtrack`/`.bgfill`, 색 팔레트+이니셜 칩). 카드 실적·적금 추가/수정 동작(`openAcctSheet`/`openSavingsSheet`) 유지. 헤드리스 문법 검증(에러 0). `sw.js` `v3.14.0`.
- **리포트 화면 시안 1:1 재현**(`renderStats`): **월 네비**(`.monthlbl` ‹ › — `state.month` 연동, 달력과 동기화) → **총지출 카드**(`.bigexp` 큰 숫자 + 수입/잔액/전월 대비 %, 증가=레드·감소=블루) → **카테고리별 CSS 도넛**(`conic-gradient` + `.legend`, 상위 5 + 기타, 카테고리 색) → **최근 6개월 추이 막대**(`.bars6`, 표시 월 잉크 강조) → **멤버별 지출 바**(`.mbar` 색+금액+비율, `wsMemberNames` 연동). 우리 고유 카드(예산·목적별 진행률·선불/포인트 잔액)는 시안 섹션 **아래에 유지**. **Chart.js 의존 제거**(`drawCharts`·canvas·CDN script 삭제) → 순수 CSS 차트. `shortAmt`/`signComma` 헬퍼 추가. 헤드리스 검증(에러 0). `sw.js` `v3.13.0`.
- **탭바 SVG 아이콘 + 더보기 화면 시안 1:1 재현**: 하단 탭바(달력·리포트·＋·자산·더보기)·FAB의 이모지를 **시안 SVG 라인 아이콘**으로 교체(`index.html`). 더보기 화면(`renderMore`)을 통째로 재구성 — **프로필 행**(`.prow` 52px 그라데이션 아바타+가계부명+`그룹·멤버 N명·초대코드`/`개인 가계부`+잉크 [전환] 칩), **4열 기능 그리드**(`.grid4` soft 스퀘어클 SVG: 예산·구독[활성 구독 수 뱃지]·정기결제·목적별·정산·경조사비·대출/이자·카테고리), **설정 리스트**(`.lst`/`.lrow` SVG아이콘+값+chevron: 멤버·권한 관리[그룹 전용·N명]·권한·공동 설정·거래내역·CSV 내보내기·다크 모드[현재 상태]·프로필[아바타]·로그아웃). 실데이터 연동(`state.wsMeta` 이름·멤버·초대코드, `state.subscriptions` 활성 수, 테마). 개인 가계부는 멤버 행 숨김. 헤드리스 검증(에러 0). `sw.js` `v3.12.0`.
- **거래 입력 시트 시안 1:1 재현**(`openTxSheet`): 의미색 **유형 세그**(지출=레드/수입=블루/이체) → **큰 금액 표시**(`.amtbig` ₩+읽기전용) → **카테고리 칩 가로 한 줄**(`#sCatChips`, 실제 RTDB 카테고리·이름+카테고리 색 점, 선택 시 잉크) → **필드 행**(`.txfield` 출금/결제 수단=실제 계좌, 날짜=date, 설명) → **숫자 키패드**(`.kp` 1~9·00·0·⌫, `kpPress`/`kpDel`로 `#sAmount` 포맷 입력). 시안에 없는 우리 고유 기능은 키패드 아래 **상세 설정 접기**(`#sAdv`)로 보존 — 목적별 가계부 연결·정산 블록·카드 실적·메모, 선불/포인트·이체 유형(이체는 출금/입금 2행), 실소비 포함. 카드 결제수단 선택 시 상세 자동 펼침. 저장 경로(`saveTx`) 무변경. `sw.js` `v3.11.0`.
- **달력 화면 시안 1:1 재현**: 멤버 칩 가로 스크롤(그룹, 컬러 그라데이션 아바타 `avatarGrad`)+멤버 필터(`state.memberFilter`), 상단 요약을 **연회색 msum 박스**(수입/실제소비/합계)+보조행(충전·선불·미사용)·예산 미니바 유지, **월요일 시작** 달력(`calendarGridHtml`)·콤팩트 셀·잉크 오늘 원형·주말 색, 셀 **카테고리 색 점**(텍스트 금액 제거), **선택일 인라인 거래**(`selectedDayHtml` `.sech`+squircle 거래행, 탭=`selectDay`), 거래행 sub를 `카테고리·기록자`로 간결화. `sw.js` `v3.10.0`.
- **0단계 — 디자인 토큰·공용 컴포넌트**: 새 시안(잉크 모노톤)에 맞춰 `styles.css` 팔레트(라이트/다크)·타이포·radius·그림자와 공용 컴포넌트(`.card`·`.btn`·`.input`·`.chip`·`.seg`·`.tab/.tabbar`·`.fab`·`#sheet`·`.tx`·`.menu-item`·요약·progress·`.toast` 등)를 리스타일. 주색=잉크(블랙↔다크 반전), 수입=블루·지출=레드, 카드=soft 회색 박스, FAB=squircle. JS·구조 변경 없이 전 화면 리스킨. `sw.js` `CACHE_VERSION` `v3.8.0`. (다음: 크롬 SVG 아이콘 → 화면별 디테일)

### 추가
- **프로필 사진 / 이름 + 그룹 멤버 프로필**: 더보기 프로필 줄(아바타·이름) 탭 → 내 프로필 시트(`openProfileSheet`)에서 **기기 사진으로 프로필 설정**(브라우저 캔버스로 256px JPEG 리사이즈 → base64로 `users/{uid}/photo` 저장)·삭제 + **별명(이름) 수정**(모든 워크스페이스 멤버 이름 비정규화 갱신). **그룹 관리 멤버 목록에 멤버 아바타** 표시(`avatarHtml`, 사진 없으면 이니셜 폴백). 멤버 사진은 `loadMemberPhotos`로 캐시. Firebase Storage·보안규칙 변경 없음. `sw.js` `CACHE_VERSION` `v3.7.0`.

### 수정
- **모바일 화면 드래그/바운스 수정**: 문서(body) 스크롤 구조 → **앱셸 고정 레이아웃**으로 전환. 바깥 페이지를 뷰포트에 딱 맞게 잠그고(`body { overflow:hidden; overscroll-behavior:none }`, `#app` 세로 flex `100dvh`), **내용 영역(`.content`)만 내부 스크롤**(`overflow-y:auto; overscroll-behavior:contain`). 상단바·하단탭바는 flex 고정 행, 시트/로그인도 `100dvh` 기준. iOS 고무줄 오버스크롤·`100vh` 점프 해소. `sw.js` `CACHE_VERSION` `v3.6.0`.

### 접근성/UI
- **접근성(A11y) 다듬기**: 화면 확대 허용(viewport `maximum-scale` 제거), 시트를 `role="dialog" aria-modal`로·Esc 닫기·포커스 이동/복원·포커스 트랩, 토스트 `aria-live`, 아이콘 버튼 `aria-label`(닫기·거래추가·테마·가계부전환), `<main>`/`<nav>`+탭 `aria-current`. `innerHTML` 재렌더에 대응하는 **중앙 A11y 레이어**(MutationObserver+델리게이션): 커스텀 토글에 `role="switch"`·`aria-checked`·키보드 활성화, `onclick` 달린 `div`에 `role="button"`·`tabindex`·Enter/Space 활성화, `.field` 라벨↔입력 연결. CSS: `:focus-visible` 링, 탭 타깃 ≥44px, `prefers-reduced-motion` 대응, `.sr-only`. `sw.js` `CACHE_VERSION` `v3.5.0`.

### 추가
- **권한 / 공동 설정**: 더보기 → 🔒 권한/공동 설정(`openSharedSettings`). ① **멤버/권한 관리**(소유자 전용) — 그룹 이름 변경·소유자 이전·멤버 내보내기를 `openGroupManageSheet`에 추가(휴면 상태였던 `role` 활성화, 앱 UI에서 권한 게이팅). ② **공동 기본값** — 새 항목 기본 공개범위·기본 소유자를 `ws/{wsId}/settings`에 저장하고 생성 폼 기본값에 반영(`defaultVisibility`/`defaultOwnerName`). ③ **공개범위 개요** — 전 엔티티의 `private` 항목을 모아 보고 개별/일괄 공개 전환. 보안규칙 변경 없음(UI 제한). `sw.js` `CACHE_VERSION` `v3.4.0`.
- **대출 / 이자 관리**: 더보기 → 🏧 대출/이자(`openLoanBook`). 빌림(내 빚)·빌려줌 구분, 원금·연이율·기간·기본 상환계좌. 대출별 상세(`openLoanDetail`)에서 **잔액·누적 이자·상환률**, 잔액 기준 **월 예상 이자(단리) 산출**, 상태(상환중/완료/연체). **상환 기록**(`openLoanPayment`)에 원금+이자 입력 → 잔액 자동 차감. 옵션 "이자를 가계부 거래로 기록"(기본 ON) → 빌림=`대출이자` 지출(실제소비)/빌려줌=`이자` 수입 생성·연결(`loanId`, 거래 행 🏦 배지). **원금 이동은 장부로만 관리**(가짜 계정·이중집계 방지). 신규 노드 `loans`·`loanPayments` + 보안규칙. `sw.js` `CACHE_VERSION` `v3.3.0`.
- **경조사비 관리**: 더보기 → 경조사비. 보냄/받음/순 요약과 **[기록][예정][인맥] 탭**. 경조사비 기록(상대·관계·경조사 유형·줌/받음·금액·날짜) 추가/수정/삭제, 상대는 **인맥 자동 등록·매칭**. 옵션 "가계부 거래로도 기록"(기본 ON) → 줌=`경조사` 지출/받음=`경조사비 수령` 수입 거래를 생성·연결(`giftEventId`, 거래 행에 🎁 배지). 경조사 **예정** 등록·완료(→기록 프리필), **인맥**별 보냄/받음 합계. 기존 예약 노드 `people`/`giftEvents`/`plannedGiftEvents` 활용(보안규칙 기존 그대로). `sw.js` `CACHE_VERSION` `v3.2.0`.
- **공동 지출 정산(Step 9)**: 목적별 가계부에서 공동 지출을 정산. 거래 입력 시 정산 포함·결제자·분담 방식(균등/직접/결제자부담)·참여자·부담 금액 지정(선택 PB의 `settlementEnabled`일 때만 노출). 목적별 상세에 **[거래][정산] 탭** 추가 — 참여자별 결제/부담/잔액, 단순 송금 제안, 완료·취소 처리, 요약(총 공동지출·대상 건수·미정산/완료 금액·완료율). 목적별 카드·더보기 메뉴(`정산`)에 상태 표시. 신규 RTDB 노드 `settlementPayments`(per-uid)와 보안규칙 추가. 정산 송금은 기본 기록만(실제소비/예산/리포트 중복 없음), 옵션으로 `transfer` 거래 동시 생성. `sw.js` `CACHE_VERSION` `v3.1.0`.

### 변경
- **프로젝트 구조 정리**: 웹 앱을 `public/` 폴더로 이동(`css/`·`icons/`·`js/` 분류), 배포 가이드를 `docs/deploy/` 로 이동(소문자 파일명). `netlify.toml` `publish="public"`. 설정 파일(`firebase.json` 등)은 저장소 루트 유지. 기능 변경 없음 — 경로/문서 링크만 정리.

## [3.0.0] - 2026-06-29

가계부 v3 — 워크스페이스(개인/그룹) 모델 + PWA/APK 배포 기반 구축.

### 추가
- **개인/그룹 워크스페이스 모델**: 모든 가계부 데이터를 `ws/{wsId}` 아래로 격리. 그룹은 6자리 초대코드로 합류, 멤버 간 공동 가계부 공유.
- **PWA 지원**: 웹 매니페스트, 서비스워커(앱 셸 캐시 v3.0.0), 홈 화면 설치.
- **iOS PWA 지원**: apple 홈화면 앱 메타 태그 추가(전체화면 앱처럼 실행).
- **APK/TWA 패키징 준비**: PWABuilder 기준 아이콘(192/512 + maskable), `.well-known/assetlinks.json` 템플릿, [APK.md](deploy/apk.md) 안내.
- **배포 설정**: Netlify(`netlify.toml`), Firebase RTDB 규칙(`database.rules.json`, `firebase.json`, `.firebaserc`), 관련 가이드 문서.
- 거래 9종 타입, 카드 실적, 예산, 정기결제, 구독, 목적별 가계부, 적금 목표, 다크모드, CSV 내보내기.

### 변경
- **PWABuilder 대응**: 매니페스트에서 SVG 아이콘 제거(PNG만 사용), `manifest.webmanifest` content-type 지정.

### 마이그레이션
- 구버전(v2) 전역 단일 트리 데이터를 로그인 시 "공유 가계부" 그룹 워크스페이스로 1회 자동 이전(`migrateLegacyIfNeeded`, `migrationV3` 플래그). 원본은 백업 보존.

---

<sub>이 시점 이전(v3.0.0으로 묶기 전)의 세부 git 이력: `62a3237`, `5e8157e`, `1263145`.</sub>
