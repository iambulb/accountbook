# 변경 이력 (Changelog)

이 프로젝트의 주요 변경 사항을 기록합니다. 형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) 를 따르며, 사용자 체감 변경은 모두 여기에 한 줄씩 남깁니다.

분류: `추가`(Added) · `변경`(Changed) · `수정`(Fixed) · `제거`(Removed) · `보안`(Security).

## [Unreleased]

> 새 변경 사항은 여기에 추가하세요. 릴리스할 때 버전 번호와 날짜를 붙여 아래로 내립니다.

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
