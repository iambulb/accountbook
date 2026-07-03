#!/usr/bin/env python3
# 알뜰 워드마크 2x(50x32) — 명암 세분화 버전 재생성(백업/재현용).
#  소스: wordmark_src_small.svg (기존 27x16(=실효 25x16) 워드마크, ㄹ=정원 글리프).
#  처리: 2x 업스케일 후 실루엣 베벨(위=하이라이트·아래=그림자·좌=약하이·우=약그림자)로 명암을 세분화.
#  출력: ../../public/icons/wordmark-altteul.svg  (+ 이 폴더에 사본·미리보기)
#  ⚠️ tools/build_wordmark.py 를 다시 실행하면 옛 27x16 로 덮어쓰니, 2x 유지하려면 이 스크립트를 마지막에 실행.
import re, os
try:
    from PIL import Image
except Exception:
    Image = None

HERE = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(HERE, 'wordmark_src_small.svg')
OUT  = os.path.join(HERE, '..', '..', 'public', 'icons', 'wordmark-altteul.svg')
LOCAL= os.path.join(HERE, 'wordmark-altteul.svg')
PREV = os.path.join(HERE, 'preview_2x.png')

svg = open(SRC, encoding='utf-8').read()
grid = {}; W = H = 0
for m in re.finditer(r'<rect x="(\d+)" y="(\d+)"[^>]*fill="(#[0-9a-fA-F]+)"', svg):
    x, y, c = int(m.group(1)), int(m.group(2)), m.group(3).lower()
    grid[(x, y)] = c; W = max(W, x + 1); H = max(H, y + 1)

def hx(c): return tuple(int(c[i:i+2], 16) for i in (1, 3, 5))
def to(c): return '#%02x%02x%02x' % c
def lighten(c, f):
    r, g, b = hx(c); return to((min(255, int(r+(255-r)*f)), min(255, int(g+(255-g)*f)), min(255, int(b+(255-b)*f))))
def darken(c, f):
    r, g, b = hx(c); return to((int(r*(1-f)), int(g*(1-f)), int(b*(1-f))))

# 1) 2x 업스케일
up = {}
for (x, y), c in grid.items():
    for i in range(2):
        for j in range(2):
            up[(2*x+i, 2*y+j)] = c
W2, H2 = W*2, H*2

# 2) 실루엣 베벨 → 명암 세분화
out = {}
for (X, Y), c in up.items():
    top = (X, Y-1) not in up; bot = (X, Y+1) not in up
    lef = (X-1, Y) not in up; rig = (X+1, Y) not in up
    if top:   nc = lighten(c, 0.30)
    elif lef: nc = lighten(c, 0.15)
    elif bot: nc = darken(c, 0.34)
    elif rig: nc = darken(c, 0.16)
    else:     nc = c
    out[(X, Y)] = nc

# 3) SVG(가로 런 병합)
def svg_of(g, w, h):
    rects = []
    for y in range(h):
        x = 0
        while x < w:
            c = g.get((x, y))
            if not c: x += 1; continue
            x2 = x
            while x2 < w and g.get((x2, y)) == c: x2 += 1
            rects.append(f'<rect x="{x}" y="{y}" width="{x2-x+0.02:.2f}" height="1.02" fill="{c}"/>')
            x = x2
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
            f'shape-rendering="crispEdges" preserveAspectRatio="xMidYMid meet">' + ''.join(rects) + '</svg>')

result = svg_of(out, W2, H2)
open(OUT, 'w', encoding='utf-8').write(result)
open(LOCAL, 'w', encoding='utf-8').write(result)
print(f'wrote {W2}x{H2} -> {OUT}')

if Image:
    sc = 12; img = Image.new('RGB', (W2*sc, H2*sc), (30, 28, 36)); px = img.load()
    for (x, y), c in out.items():
        col = hx(c)
        for j in range(sc):
            for i in range(sc): px[x*sc+i, y*sc+j] = col
    img.save(PREV); print('preview ->', PREV)
