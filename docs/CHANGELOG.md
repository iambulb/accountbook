# 변경 이력 (Changelog)

이 프로젝트의 주요 변경 사항을 기록합니다. 형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) 를 따르며, 사용자 체감 변경은 모두 여기에 한 줄씩 남깁니다.

분류: `추가`(Added) · `변경`(Changed) · `수정`(Fixed) · `제거`(Removed) · `보안`(Security).

## [Unreleased]

> 새 변경 사항은 여기에 추가하세요. 릴리스할 때 버전 번호와 날짜를 붙여 아래로 내립니다.

### 변경
- **프로젝트 구조 정리**: 웹 앱을 `public/` 폴더로 이동(`css/`·`icons/`·`js/` 분류), 배포 가이드를 `docs/deploy/` 로 이동(소문자 파일명). `netlify.toml` `publish="public"`, `sw.js` `CACHE_VERSION` `v3.0.1`. 설정 파일(`firebase.json` 등)은 저장소 루트 유지. 기능 변경 없음 — 경로/문서 링크만 정리.

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
