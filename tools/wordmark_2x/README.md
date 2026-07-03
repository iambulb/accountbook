# 알뜰 워드마크 2x (명암 세분화) — 백업 · 재현

로그인 화면 히어로에 쓰는 **'알뜰' 워드마크의 2배 해상도(50×32)·명암 세분화 버전** 백업.
2배로 키워도 블록지지 않고 입체적으로 보이도록, 소스를 2x 업스케일한 뒤 **실루엣 베벨**
(위=하이라이트·아래=그림자·좌우 약음영)로 명암을 세분화했다.

## 파일
- `wordmark_src_small.svg` — **소스**(기존 27×16(=실효 25×16) 워드마크, `ㄹ`=정원(풀·흙·꽃) 글리프).
  운영 아이콘 `public/icons/wordmark-altteul_small.svg` 와 동일(백업본).
- `build_wordmark_2x.py` — **생성기**. 소스를 2x+베벨 처리해 `public/icons/wordmark-altteul.svg` 로 출력(+이 폴더에 사본·미리보기).
- `wordmark-altteul.svg` — 생성 결과(50×32) 사본.
- `preview_2x_cmp.png` — 단순 2x vs 베벨 비교 미리보기.

## 재생성
```bash
python tools/wordmark_2x/build_wordmark_2x.py
```

## ⚠️ 주의
`tools/build_wordmark.py`(구 27×16 정원 글리프 생성기)를 다시 실행하면 **옛 저해상도로 덮어써진다.**
2x 버전을 유지하려면 그 스크립트 실행 후 **반드시 이 스크립트를 마지막에** 돌리거나, build_wordmark.py 자체를 2x 출력으로 통합할 것.
