# 💰 알뜰 (Eggarden)

**알뜰**(영문·코드명 **Eggarden**)은 개인·그룹이 **함께 쓰는** 공유 가계부 웹앱(PWA)입니다. 그룹 초대코드 하나로 가족·커플·모임이 같은 가계부를 실시간으로 공유합니다.

![stack](https://img.shields.io/badge/JS-Vanilla-f7df1e) ![firebase](https://img.shields.io/badge/Firebase-RTDB%20%2B%20Auth-ffca28) ![pwa](https://img.shields.io/badge/PWA-installable-5a0fc8) ![deploy](https://img.shields.io/badge/Deploy-Netlify-00c7b7)

<!-- 스크린샷 자리 — 추후 추가
![달력](docs/img/calendar.png) ![리포트](docs/img/report.png)
-->

## ✨ 주요 기능

- 📅 **달력 / 리포트** — 일별 수입·지출, 카테고리 도넛차트, 6개월 추이, 멤버별 지출 비교
- 👥 **개인 / 그룹 워크스페이스** — 6자리 초대코드로 합류, 그룹은 공동 가계부 공유
- 💳 **거래 9종 타입** — 수입·지출·이체·충전·선불결제·환불·포인트적립/사용·잔액조정
- 🏦 **자산 / 카드 실적** — 다양한 결제수단, 신용카드 월 실적 추적, 선불·포인트 잔액
- 💵 **예산 · 정기결제 · 구독 · 목적별 가계부 · 적금 목표**
- 🌙 **다크모드**, 📤 **CSV 내보내기**, 📲 **PWA 설치 / 안드로이드 APK(TWA)**

전체 기능은 → **[docs/features.md](docs/features.md)**

## 🧱 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프런트엔드 | Vanilla JavaScript (프레임워크·빌드 없음), 순수 CSS 차트(외부 차트 라이브러리 없음) |
| 백엔드 | Firebase **Realtime Database** + **Authentication**(Email/Password) — 서버리스 |
| PWA | Web App Manifest + Service Worker(오프라인 앱 셸 캐시) |
| 호스팅 / 패키징 | Netlify(웹) · PWABuilder TWA(안드로이드 APK) |

## 🚀 빠른 시작

```bash
# 1) 로컬 실행 — 웹 앱은 public/ 폴더에 있습니다
npx serve public       # http://localhost:3000 (아무 정적 서버나 가능)
```

- `file://` 로 직접 열면 안 되고 **정적 서버**로 띄워야 합니다(서비스워커·fetch).
- 로컬에서도 실제 Firebase(`money-bb658`)에 붙습니다. 로그인이 되려면 콘솔에서 **이메일/비밀번호 로그인 활성화**가 필요합니다.

자세한 개발·배포 절차 → **[docs/development.md](docs/development.md)**

## 📁 폴더 구조

```
eggarden/
├── public/                   # 👉 정적 사이트 루트 (Netlify publish 대상)
│   ├── index.html            # 앱 셸
│   ├── manifest.webmanifest
│   ├── sw.js                 # 서비스워커
│   ├── .well-known/assetlinks.json   # TWA(APK) 도메인 검증
│   ├── css/styles.css
│   ├── icons/                # icon.svg · icon-192/512 · maskable
│   └── js/                   # firebase·constants·core·views·main
├── docs/                     # 기술 문서 (아래 문서 목차)
│   └── deploy/               # firebase·netlify·apk·rules 가이드
├── database.rules.json · firebase.json · .firebaserc · netlify.toml   # 배포 설정
├── README.md                 # 이 파일
└── CLAUDE.md                 # Claude 작업 지침 + 문서 최신화 규칙
```

코드 구조 상세 → **[docs/code-structure.md](docs/code-structure.md)**

## 📚 문서 목차

| 문서 | 내용 |
|---|---|
| [docs/features.md](docs/features.md) | 기능 카탈로그 |
| [docs/architecture.md](docs/architecture.md) | 시스템 구성도·다이어그램(Mermaid) |
| [docs/data-model.md](docs/data-model.md) | 데이터 모델·ERD·보안규칙 |
| [docs/code-structure.md](docs/code-structure.md) | 코드 구조·함수 맵 |
| [docs/development.md](docs/development.md) | 개발환경·배포 |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | 변경 이력 |

## 🤝 협업 메모

- 현재 **2인 + GitHub 공유**로 개발 중. 외부 사용자도 같이 쓰는 공유 가계부입니다.
- 코드를 바꿀 때는 관련 문서도 함께 갱신합니다 — 규칙은 [CLAUDE.md](CLAUDE.md#문서-최신화-규칙).
- 모든 사용자 체감 변경은 [docs/CHANGELOG.md](docs/CHANGELOG.md) `[Unreleased]` 에 기록.

## 📄 라이선스

_(미정 — 추후 추가)_
