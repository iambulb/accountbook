# 📚 문서 목차

`공유 가계부` 프로젝트의 모든 기술 문서를 모아 둔 곳입니다. 처음이라면 [루트 README](../README.md) 부터 보세요.

## 이 폴더의 문서

| 문서 | 내용 |
|---|---|
| [features.md](features.md) | **기능 카탈로그(개요)** — 두 모드·모드 토글·탭바, 알뜰샵(게임화), 공통 기반. 모드별 상세는 아래 두 문서 |
| [features-ledger.md](features-ledger.md) | 💰 **가계부 모드** — 거래 9종·달력·리포트·자산·카드실적·예산·정기결제·구독·목적별·정산·경조사비·대출·적금·권한 |
| [features-todo.md](features-todo.md) | ✅ **할일 모드** — 개인/그룹 세그먼트·공유 친구 스트립·읽기전용·마감 캘린더·반복·목적별 연동·게임화 |
| [pet-list.md](pet-list.md) | **펫 목록** — 구현된 펫 표(id·종·등급·가격·이미지 폴더 경로·설명) + 폴더 구조 |
| [pet-asset-pipeline.md](pet-asset-pipeline.md) | **펫 에셋 파이프라인** — PixelLab zip→걷기/정지 에셋 변환·코드 반영 절차 |
| [cat-feature-plan.md](cat-feature-plan.md) | **알뜰샵(고양이) 기획** — 은화 경제·미션·가챠·가구 게임화 설계 |
| [animal-pixel-style-guide.md](animal-pixel-style-guide.md) | **동물 픽셀 스타일 가이드** — 도트/스프라이트 아트 규칙 |
| [architecture.md](architecture.md) | **시스템 구성도** — 컴포넌트/배포 다이어그램, 로그인·부트 시퀀스, 서비스워커 캐시 전략 (Mermaid) |
| [data-model.md](data-model.md) | **데이터 모델** — Firebase RTDB 트리, ERD, 엔티티 필드표, 보안규칙, 거래 잔액효과표 (Mermaid) |
| [code-structure.md](code-structure.md) | **코드 구조** — 파일별 책임, 주요 함수 맵, 로드 순서·전역 의존 |
| [development.md](development.md) | **개발환경 / 배포** — 로컬 실행, Firebase·Netlify·APK 배포 절차 링크, 체크리스트 |
| [CHANGELOG.md](CHANGELOG.md) | **변경 이력** — 버전별 변경 사항 |
| [redesign-todo.md](redesign-todo.md) | **UI 리디자인 작업 리스트** — 시안 적용 완료/잔여 화면, 보류된 결정 |

## 배포·설정 안내 (`docs/deploy/`)

배포·보안규칙 관련 문서입니다(설정 파일 `firebase.json`·`netlify.toml`·`database.rules.json` 은 저장소 루트, 앱은 `public/`).

| 문서 | 내용 |
|---|---|
| [deploy/firebase.md](deploy/firebase.md) | Firebase 연동·DB 규칙 배포(CLI), 콘솔 설정 |
| [deploy/netlify.md](deploy/netlify.md) | Netlify CLI 배포 |
| [deploy/apk.md](deploy/apk.md) | PWABuilder TWA로 안드로이드 APK 만들기 |
| [deploy/rules.md](deploy/rules.md) | RTDB 보안규칙 모델·마이그레이션 상세 |

## 문서 유지 규칙

코드를 바꾸면 관련 문서도 같이 갱신합니다. 어떤 변경에 어떤 문서를 손봐야 하는지는 [CLAUDE.md](../CLAUDE.md#문서-최신화-규칙) 의 "문서 최신화 규칙" 을 따르세요.
