# -*- coding: utf-8 -*-
"""가구 품질 전수 감사 — CLAUDE.md 체크리스트 9(연출 구멍)·10(탑승 lift)·해상도 기준의 자동 검사기.

    python tools/furn_audit.py            # 전체 리포트
    python tools/furn_audit.py --holes    # 구멍 위반만(종료코드 1=위반 존재 — CI/훅용)

판정 규칙(CLAUDE.md "🕳️ 연출 구멍 금지"):
  · sway 레이어         = base 언더레이 유지 → 구멍 없음(통과)
  · bg:'X' 지정 레이어  = furnBaseMatrix가 base 구멍을 배경 글자로 채움 → 통과
  · 그 외(drift/spin/swing/blink/flicker/sheen)에서 move 글자가 "채워진 면 내부"(8이웃 중 6+가
    비-move 채움 칸)에 있으면 위반 — 공기(투명) 영역으로 옮기거나 bg를 지정할 것.
  · 의도적 예외는 ALLOW에 등록(사유 필수).
"""
import re, sys, os
try: sys.stdout.reconfigure(encoding='utf-8')   # Windows cp949 콘솔 대비
except Exception: pass

ROOT = os.path.join(os.path.dirname(__file__), '..')
A = open(os.path.join(ROOT, 'public/js/cats.assets.js'), encoding='utf-8').read()
C = open(os.path.join(ROOT, 'public/js/cats.js'), encoding='utf-8').read()

# 의도적 예외(레이어 cls 기준) — 사유를 함께 남긴다
ALLOW = {
    'lbled': 'blink 5px 혼합글자(바디/범퍼) — 최소 불투명 .32라 티 안 남',
    'mushroomlamp': 'flicker 제자리(scale+미세 tx) — 갓 내부 글로우',
    'waterfountain': '물기둥 내부 1칸 — drift 미세',
    'rcdart': '쥐가 매트 상단 공기층 — 인접 아티팩트(실제 구멍 없음)',
}

fm = re.search(r'function furnMatrix\(id\)\{ return \{([^}]*)\}\[id\]', C).group(1)
id2m = dict((kv.split(':')[0].strip(), kv.split(':')[1].strip()) for kv in fm.split(','))

def get_mat(mname):
    m = re.search(r'const ' + mname + r'\s*=\s*\[([\s\S]*?)\];', A)
    if not m: return None
    rows = re.findall(r'"([^"]*)"', m.group(1)) or re.findall(r"'([^']*)'", m.group(1))
    w = max(len(r) for r in rows)
    return [r.ljust(w, '.') for r in rows]

ab = C[C.index('const FURN_ANIM'):]
ab = ab[:ab.index('\n    };') + 7]
anims = {}
for m in re.finditer(r'^\s{6}([a-zA-Z0-9_]+):\s*(\[[\s\S]*?\](?=\s*,?\s*(?://|\n))|\{[^}]*\})', ab, re.M):
    iid = m.group(1); body = m.group(2)
    layers = []
    for lm in re.finditer(r"\{\s*type:'(\w+)'\s*,\s*move:\[([^\]]*)\]\s*(?:,\s*cls:'(\w+)')?(?:\s*,\s*bg:'(.)')?", body):
        mv = [x.strip().strip("'") for x in lm.group(2).split(',') if x.strip()]
        layers.append((lm.group(1), mv, lm.group(3), lm.group(4)))
    if layers: anims[iid] = layers

def hole_layers(iid):
    M = get_mat(id2m.get(iid, '')) if iid in id2m else None
    if not M: return []
    rows, cols = len(M), len(M[0])
    out = []
    for t, mv, cls, bg in anims.get(iid, []):
        if t == 'sway' or bg: continue
        key = cls or iid
        if key in ALLOW: continue
        mvset = set(mv); internal = 0; total = 0
        for y, r in enumerate(M):
            for x, ch in enumerate(r):
                if ch not in mvset: continue
                total += 1; fill = 0
                for dy in (-1, 0, 1):
                    for dx in (-1, 0, 1):
                        if dx == 0 and dy == 0: continue
                        yy, xx = y + dy, x + dx
                        if 0 <= yy < rows and 0 <= xx < cols:
                            c2 = M[yy][xx]
                            if c2 not in '. ' and c2 not in mvset: fill += 1
                if fill >= 6: internal += 1
        if internal > 0: out.append((t, key, total, internal))
    return out

def main():
    holes_only = '--holes' in sys.argv
    viol = 0
    print('=== 연출 구멍 감사(sway/bg/ALLOW 제외) ===')
    for iid in sorted(id2m):
        for t, key, total, internal in hole_layers(iid):
            viol += 1
            print(f'  위반 {iid:16s} {t:8s} cls={key:14s} move={total} 내부={internal} → 공기영역 이동 또는 bg 지정')
    print(f'위반 {viol}건' + (' — CLAUDE.md 🕳️ 규칙 참조' if viol else ' ✓'))
    if holes_only: sys.exit(1 if viol else 0)
    print()
    print('=== 해상도 백로그(rows<16 AND cols<19 — 가로형은 긴 축으로 판정) ===')
    low = []
    for iid, mname in id2m.items():
        M = get_mat(mname)
        if M and len(M) < 16 and len(M[0]) < 19: low.append((len(M), len(M[0]), iid))   # 가로형(러그·가랜드 등)은 긴 축이 디테일을 실으므로 cols>=19면 통과
    for r, c, iid in sorted(low): print(f'  {iid:16s} {r}x{c}')
    print(f'백로그 {len(low)}종 / 전체 {len(id2m)}종')
    print()
    static = [iid for iid in id2m if iid not in anims]
    print('=== 정적(FURN_ANIM 없음) — 연출 추가 후보 ===')
    print(' ', ', '.join(sorted(static)))
    sys.exit(1 if viol else 0)

if __name__ == '__main__':
    main()
