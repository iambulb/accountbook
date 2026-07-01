# 🌐 Netlify 배포 (CLI)

`public/` 폴더가 사이트 루트입니다([netlify.toml](../../netlify.toml) 의 `publish = "public"`).
firebase와 동일하게 `npx` 로 쓰며, **로그인(브라우저)만 본인이** 하면 이후 배포는 한 줄입니다.

```bash
cd <프로젝트 루트>     # 이 저장소를 받은 폴더 (예: C:/eggarden)

# 최초 1회: 로그인 (브라우저 열림 — 본인이 직접)
npx netlify-cli login

# 최초 1회: 기존 Netlify 사이트와 이 폴더 연결
npx netlify-cli link            # 목록에서 기존 사이트 선택
#  또는 사이트 이름을 알면:  npx netlify-cli link --name 사이트이름

# 배포 (운영 반영)
npx netlify-cli deploy --prod
```

- `link` 하면 `.netlify/state.json` 에 사이트 ID가 저장되어, 이후엔 `deploy --prod` 만 반복하면 됩니다.
- `netlify.toml` 에 publish 가 지정돼 있어 `--dir` 는 생략 가능합니다.

> **login + link 까지 본인이 해주면**, 그 다음 `deploy --prod` 는 제가 대신 실행해 드릴 수 있어요
> (같은 PC라 저장된 자격증명을 그대로 사용).

## 자동화(토큰) 방식 — 선택
브라우저 로그인 대신 토큰으로도 됩니다(비번 아님, 폐기 가능):
1. Netlify → User settings → Applications → **Personal access token** 발급
2. `setx NETLIFY_AUTH_TOKEN "토큰"` 후 새 터미널 → `npx netlify-cli deploy --prod`

## 참고
- 새 코드(분리 파일·매니페스트·아이콘)를 반영하려면 이 배포를 한 번 돌리면 됩니다.
- git 저장소로 만들어 GitHub에 연결하면 push 시 자동 배포도 가능하지만, 지금은 CLI 수동 배포가 가장 간단합니다.
