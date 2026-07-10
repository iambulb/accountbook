# -*- coding: utf-8 -*-
"""신화 미만(저해상도) 펫에 쉬운 5클립 일괄 생성 — bbox 비율 자동 앵커.
파일럿(cat_mackerel/cat_cheese) 손실측 앵커를 bbox 비율이 거의 그대로 재현함을 이용.
사용: python tools/pilot_batch.py [--write] [--validate=id1,id2] [--limit=N]
"""
import os, sys, io, json
from PIL import Image
import pet_motion_build_all as T

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EASY = ['idle','sit','belly','eat','drink']

# ── 🐾 머리(head) 성분 기준 눈 자동 검출(yawn/angry 용) ──────────────────────
#   bbox 중심은 옆꼬리·비대칭 몸에 밀리므로, 눈 밴드 각 행의 "중심에 가장 가까운 실루엣 런"(=머리)의
#   중앙을 head_cx로 쓴다(꼬리 제외). 눈 x = head_cx ± 머리폭×0.26, y = y0+0.30h, 그 근방 가장 어둡/채도 높은
#   픽셀로 스냅(동공/홍채). 저해상도(눈 2~3px)라 1px 오차는 눈 감김/브로우가 여전히 눈 영역을 덮어 자연스럽다.
def _head_cx(px, x0, x1, y, gap=2):
    xs = [x for x in range(x0,x1) if px[x,y][3] >= 128]
    if not xs: return None
    runs=[]; s=xs[0]; p=xs[0]
    for x in xs[1:]:
        if x-p>gap: runs.append((s,p)); s=x
        p=x
    runs.append((s,p))
    c0=(x0+x1-1)/2.0
    r=min(runs, key=lambda rr:abs((rr[0]+rr[1])/2.0-c0))
    return (r[0]+r[1])/2.0, r[0], r[1]

def detect_eyes(src):
    bb=src.getbbox(); x0,y0,x1,y1=bb; h=y1-y0; px=src.load()
    eyrow=int(y0+0.30*h)
    hc=[_head_cx(px,x0,x1,y) for y in range(int(y0+0.22*h), int(y0+0.40*h))]
    hc=[c for c in hc if c]
    if not hc: return None,None,None,None
    cx=sorted(c[0] for c in hc)[len(hc)//2]
    hw=sorted((c[2]-c[1]) for c in hc)[len(hc)//2]
    off=max(2,int(round(hw*0.26)))
    def snap(xg):
        best=None
        for ey in range(eyrow-1,eyrow+2):
            for ex in range(xg-1,xg+2):
                if not(x0<=ex<x1 and y0<=ey<y1) or px[ex,ey][3]<128: continue
                r,g,b,a=px[ex,ey]; sc=(230-(r+g+b))+(max(r,g,b)-min(r,g,b))*2*(max(r,g,b)>90)
                if best is None or sc>best[0]: best=(sc,ex,ey)
        return (best[1],best[2]) if best else (xg,eyrow)
    xl,yl=snap(int(round(cx-off))); xr,yr=snap(int(round(cx+off)))
    return (xl,yl-1,xl,yl),(xr,yr-1,xr,yr), cx, hw   # +머리중심축 cx·머리폭 hw(입 앵커·크기 산출용)

def auto_cfg(pid, species, src):
    bb = src.getbbox(); x0,y0,x1,y1 = bb
    h = y1 - y0; w = x1 - x0
    bcx = round((x0 + x1 - 1) / 2)           # bbox 가로중앙 — 꼬리·비대칭에 밀려 얼굴 중앙과 어긋남(폴백용만)
    R = lambda f: int(round(y0 + f*h))
    eL,eR,hcx,hw = detect_eyes(src)
    if not eL:                                # 눈 검출 실패 — 머리 중심축(hcx)이라도 있으면 그걸(bbox 중앙 아님)
        fcx = int(round(hcx)) if hcx is not None else bcx
        eL,eR = (fcx-3,R(0.27),fcx-2,R(0.30)),(fcx+2,R(0.27),fcx+3,R(0.30))
    # 🎯 입 X = 눈 박스 실측 중점(얼굴 중앙, 몸통/프레임 중앙 아님). //2=floor → 짝수폭 스탬프(mcx-w//2+1)의 +1 우측 바이어스 상쇄(㉧)
    mcx = (eL[0] + eR[2]) // 2
    # 🎯 입 Y = 눈 아래(코 자리)~턱선 위 실루엣 기반(고정 비율 금지). 눈 박스 아래 + 머리높이 비례 오프셋, 목 상단 위로 클램프
    eye_b = max(eL[3], eR[3])
    small_y = min(R(0.45) - 1, eye_b + max(2, int(round(h*0.07))))
    small_y = max(small_y, eye_b + 1)
    wide_y = small_y - 1                       # 개구 시 살짝 위(코 유지)
    # 🎯 입 크기 = XS 고정. 이 131펫은 저해상도(48~68px)라 머즐 폭 ~6px → XS(4px)가 정확히 ≤2/3(MOUTHS['XS'] 설계 근거).
    #    ⚠️ hw(머리폭·15px)는 머즐 폭이 아니므로 크기 기준으로 쓰면 안 됨(S/M=6~8px 입이 6px 머즐을 초과=과대). 얼굴 특히 큰 개별 펫만 손보정 override.
    cls = 'XS'
    return dict(species=species, cls=cls,
        style=('dog' if species=='dog' else 'cat'),
        foot=y1-1, mcx=mcx, small_y=small_y, wide_y=wide_y,
        eyeL=eL, eyeR=eR,
        neck=(R(0.45),R(0.64)), chest=(R(0.59),R(0.82)), chest_hi=(R(0.55),R(0.77)),
        tail=None)

def load_pets():
    d = json.load(io.open(os.path.join(ROOT,'tools','pets.json'),encoding='utf-8'))
    pets = d['pets'] if isinstance(d,dict) and 'pets' in d else d
    if isinstance(pets,dict): pets=list(pets.values())
    return pets

def main():
    write = '--write' in sys.argv
    validate = None
    limit = None
    for a in sys.argv:
        if a.startswith('--validate='): validate = a.split('=',1)[1].split(',')
        if a.startswith('--limit='): limit = int(a.split('=',1)[1])
    OUT = os.environ.get('MOTION_OUT') or os.path.join(ROOT,'_zips')
    os.makedirs(OUT, exist_ok=True)
    pets = load_pets()
    below = [p for p in pets if p.get('tier') not in ('limited','exclusive')]
    if validate:
        below = [p for p in pets if p.get('id') in validate]
    if limit: below = below[:limit]
    ok_n = warn_n = 0; warns=[]
    for p in below:
        pid, sp = p['id'], p.get('species','cat')
        d = T.pet_dir(pid, sp)
        f = os.path.join(d,'south.png')
        if not os.path.exists(f):
            warns.append(pid+':no-south'); continue
        src = Image.open(f).convert('RGBA')
        T.CFG[pid] = auto_cfg(pid, sp, src)
        made, ok = T.build(pid, write=write, only=EASY, outdir=OUT, sheets=not write or bool(validate))
        if ok: ok_n+=1
        else: warn_n+=1; warns.append(pid)
    print(f'done: ok={ok_n} warn={warn_n}')
    if warns: print('warns:', warns[:30])

if __name__=='__main__':
    main()
