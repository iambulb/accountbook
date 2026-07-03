#!/usr/bin/env python3
# 알뜰 워드마크 재생성 — ㄹ을 "풀·뜰(위) + 흙(아래 ㄷ)" 정원 글리프로 통일.
# 기존 SVG를 파싱해 격자를 얻고, '알'의 깨끗한 ㄹ 모양을 정원색으로 재채색한 뒤
# 같은 글리프를 '알'·'뜰' 두 곳에 동일하게 stamp. 흙: 최하단=고동색, 그 위=갈색.
# 결과: icons/wordmark-altteul.svg (crispEdges) + 미리보기 PNG(눈으로 확인용).
import re, os
_here = os.path.dirname(__file__)
SRC = os.path.join(_here, '_wordmark_src.svg')   # 원본(무수정) — 재실행 멱등
OUT = os.path.join(_here, '..', 'public', 'icons', 'wordmark-altteul.svg')
PREVIEW = os.path.join(_here, '_wordmark_preview.png')

TAN='#c9c2b0'; WHITE='#FBFBFD'
GEDGE='#4e9636'; GFILL='#7cc652'          # 풀(진초록 테두리 / 연초록 채움)
SOIL='#966130'; DARK='#553012'            # 흙: 갈색 / 고동색(최하단)

# 1) 기존 SVG 파싱 → grid[(x,y)] = color
svg = open(SRC, encoding='utf-8').read()
grid = {}
W = H = 0
for m in re.finditer(r'<rect x="(\d+)" y="(\d+)"[^>]*fill="(#[0-9a-fA-F]+)"', svg):
    x, y, c = int(m.group(1)), int(m.group(2)), m.group(3)
    grid[(x, y)] = c
    W = max(W, x+1); H = max(H, y+1)

# 2) 정원 ㄹ 글리프: '알'의 ㄹ 영역(x 1..10, y 7..15)에서 마스크를 얻어 정원색으로.
#    윗부분(ㄱ: 상단바+오른세로+중간바)=풀, 아랫부분(ㄷ: 왼세로+하단바)=흙, 최하단 줄=고동색.
RX0, RX1, RY0, RY1 = 1, 10, 7, 15          # 알 ㄹ 박스
def recolor(kind, lr):                      # kind: 'fill'|'edge', lr: 0..8(글리프 내부 행)
    if lr == 8: return DARK                 # 최하단 = 고동색
    if lr >= 5: return SOIL                 # 아래 ㄷ = 갈색 흙
    return GFILL if kind == 'fill' else GEDGE   # 위쪽 = 풀

glyph = {}                                  # (lx,ly) -> color, lx 0..9, ly 0..8
for y in range(RY0, RY1+1):
    for x in range(RX0, RX1+1):
        c = grid.get((x, y))
        if not c: continue
        kind = 'fill' if c.upper() == WHITE.upper() else 'edge'
        glyph[(x-RX0, y-RY0)] = recolor(kind, y-RY0)

# 3) 알 ㄹ 제자리 재채색
for (lx, ly), col in glyph.items():
    grid[(RX0+lx, RY0+ly)] = col

# 4) 뜰 아래(ㅡ+ㄹ) 영역 비우고, 풀 ㅡ 막대 + 동일 ㄹ 글리프 stamp
for y in range(5, H):
    for x in range(14, W):
        grid.pop((x, y), None)
BX = 15                                      # 뜰 ㄹ/ㅡ 좌측 기준(ㄸ 좌측과 정렬)
for lx in range(0, 10):                      # ㅡ(모음): 풀 2줄 막대
    grid[(BX+lx, 5)] = GEDGE
    grid[(BX+lx, 6)] = GFILL
for (lx, ly), col in glyph.items():          # ㄹ: 알과 동일 글리프
    grid[(BX+lx, 7+ly)] = col

# 5) SVG 출력(기존 포맷 유지: width/height 1.02, crispEdges)
rects = []
for y in range(H):
    for x in range(W):
        c = grid.get((x, y))
        if c:
            rects.append(f'<rect x="{x}" y="{y}" width="1.02" height="1.02" fill="{c}"/>')
out = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
       f'shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet">' + ''.join(rects) + '</svg>')
open(OUT, 'w', encoding='utf-8', newline='').write(out)
print('wrote', OUT, f'({W}x{H}, {len(rects)} rects)')

# 6) 미리보기 PNG(PIL 있으면)
try:
    from PIL import Image
    S = 26
    img = Image.new('RGB', (W*S, H*S), (255, 255, 255))
    px = img.load()
    def hx(c): c=c.lstrip('#'); return tuple(int(c[i:i+2],16) for i in (0,2,4))
    for (x, y), c in grid.items():
        r, g, b = hx(c)
        for dy in range(S):
            for dx in range(S):
                px[x*S+dx, y*S+dy] = (r, g, b)
    img.save(PREVIEW)
    print('preview', PREVIEW)
except Exception as e:
    print('preview skipped:', e)
