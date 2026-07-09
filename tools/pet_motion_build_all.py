# -*- coding: utf-8 -*-
"""
펫 모션 클립 시트 제작 v3(일반화) — 신화(limited)·한정(exclusive) 펫 15종에
표범(cat_leopard, pet_motion_build.py v2) 기준 7클립(idle·sit·belly·eat·drink·yawn·angry)을
일괄 생성한다. 규칙은 docs/pet-motion-guide.md §3(v2 4연산·흰 공백 금지·패치 먼저 변형 나중).

v2(표범 하드코딩)와 다른 점 — 펫별 실측 앵커(CFG)로 데이터화:
  · 팔레트: 스프라이트 실측 자동 + 공용 입 키트(d/D/P/C = 표범 입 톤과 동일)
  · 눈 감김/가늘게: 눈 박스 위 픽셀을 샘플링해 눈꺼풀 몸색 자동 결정(줄무늬 대응)
  · 귀 눕힘(angry): 돔 위 연결 성분(귀)을 통째 지우고 눌린 실루엣(귀 뒷면=몸색)을
    재드로잉 + outline_repair — 부분 패치 잔재·흰 구멍이 구조적으로 불가능.
    재규어처럼 머리 위 꼬리가 있는 펫은 성분 분류(중앙=꼬리)로 귀만 처리.
  · 꼬리/귀끝 스윙(idle): 이동은 "몸 안쪽·아래쪽"만(이음새가 벌어지지 않는 방향),
    바닥에 닿는 꼬리(삵)는 안쪽 플릭으로 대체해 발 baseline 불변.
  · 종 차별화(외부 레퍼런스, pet-motion-guide §1): 대형 고양잇과=하품 송곳니+머리 젖힘,
    사자=하악 대신 으르렁(귀 눕힘 없음·갈기 호흡), 카라칼·스라소니=귀 눕혀도 술 끝 유지,
    진돗개=귀 직립 유지+이빨 드러냄(growl)+먹기 머리 bob 크게.

사용:
  python tools/pet_motion_build_all.py                 # 전체(표범 제외) 검수 시트만
  python tools/pet_motion_build_all.py --pet=cat_puma  # 한 마리
  python tools/pet_motion_build_all.py --write         # public/assets/.../<clip>.png 저장
검수 시트 출력 폴더: MOTION_OUT 환경변수(기본 _zips/).
"""
import os, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def pet_dir(pid, species): return os.path.join(ROOT, 'public', 'assets', 'pets', species, pid)

# ── 공용 입 키트(표범 v2와 동일 톤 — 앱 전체 일관성) ─────────────────────
KIT = { 'd':(82,17,3), 'D':(90,40,8), 'P':(224,112,102), 'C':(243,220,196) }

# ── 펫별 실측 앵커(2026-07 스프라이트 ASCII 덤프 실측) ────────────────────
# eyeL/eyeR=(x0,y0,x1,y1) 눈 박스(포함), mcx=입 중심열, small_y/wide_y=입 패치 시작행,
# neck/chest/chest_hi=(y0,y1) 아코디언 밴드, tail=(x0,y0,x1,y1) 꼬리 마스크 박스(exclusive),
# cls=크기클래스(S=80·M=92·L=112·XL=136), style=cat|bigcat|lion|dog,
# tufts=귀 술(눕혀도 끝 유지), tailmode=v(상하 스윙)|in(안쪽 플릭)|top(머리 위 끄덕)
CFG = {
 'tiger_orange':   dict(species='tiger', cls='M', style='bigcat', foot=64, mcls='L',   # 머즐 폭 ~12px — M입(4px)이 과소해 L입으로 상향(㉧)
    eyeL=(39,33,42,34), eyeR=(49,33,52,34), mcx=45, small_y=38, wide_y=37,
    neck=(42,47), chest=(43,49), chest_hi=(44,50), tail=(59,49,66,62), tailmode='v'),
 'lion_mane':      dict(species='lion', cls='XL', style='lion', foot=94,
    eyeL=(61,51,64,52), eyeR=(71,51,74,52), mcx=67, small_y=59, wide_y=58,   # mcx=눈 실측 중점 (61+74)/2=67.5 — 68은 짝수폭 +1 바이어스와 겹쳐 우측 치우침(㉧)
    neck=(68,76), chest=(70,81), chest_hi=(71,82), tail=(90,73,101,85), tailmode='v'),
 'tiger_white':    dict(species='tiger', cls='L', style='bigcat', foot=78,
    eyeL=(49,40,52,42), eyeR=(59,40,62,42), mcx=55, small_y=48, wide_y=47,
    neck=(53,59), chest=(54,61), chest_hi=(55,62), tail=(70,66,75,73), tailmode='v',
    ear_inner=[(232,127,114)]),   # 귀 안쪽 분홍 → 몸색(귀 뒤로 돌림 — 실루엣에 귀가 묻혀 눕힘이 안 보이는 펫)
 'cat_panther':    dict(species='cat', cls='M', style='bigcat', foot=64,
    eyeL=(41,34,43,36), eyeR=(48,34,50,36), mcx=45, small_y=43, wide_y=43,
    neck=(47,52), chest=(48,54), chest_hi=(49,55), tail=(54,50,65,63), tailmode='v'),
 'dog_jindo':      dict(species='dog', cls='M', style='dog', foot=65,
    eyeL=(40,30,43,31), eyeR=(48,30,51,31), mcx=45, small_y=37, wide_y=37,
    neck=(43,48), chest=(44,50), chest_hi=(45,51), tail=None),
 'cat_toyger':     dict(species='cat', cls='S', style='cat', foot=56,
    eyeL=(35,30,37,31), eyeR=(42,30,44,31), mcx=39, small_y=34, wide_y=34,
    neck=(37,42), chest=(38,43), chest_hi=(39,44), tail=(25,45,30,53), tailmode='v'),
 'cat_leopardcat': dict(species='cat', cls='S', style='cat', foot=56,
    eyeL=(35,30,37,31), eyeR=(42,30,44,31), mcx=39, small_y=35, wide_y=35,
    neck=(38,42), chest=(38,43), chest_hi=(39,44), tail=(21,45,33,57), tailmode='in'),
 'cat_lynx':       dict(species='cat', cls='M', style='bigcat', foot=64, tufts=True,
    eyeL=(41,35,42,36), eyeR=(49,35,50,36), mcx=45, small_y=39, wide_y=39,
    neck=(42,47), chest=(43,49), chest_hi=(44,50), tail=None),
 'cat_cheetah':    dict(species='cat', cls='L', style='bigcat', foot=77,
    eyeL=(50,41,52,42), eyeR=(58,41,60,42), mcx=55, small_y=48, wide_y=48,
    neck=(51,57), chest=(52,59), chest_hi=(53,60), tail=(51,26,60,34), tailmode='top'),   # 머리 위로 말린 꼬리(재규어와 동형)
 'cat_jaguar':     dict(species='cat', cls='L', style='bigcat', foot=77,
    eyeL=(51,41,53,43), eyeR=(57,41,59,43), mcx=55, small_y=49, wide_y=49,
    neck=(52,58), chest=(53,60), chest_hi=(54,61), tail=(49,27,66,35), tailmode='top'),
 'cat_puma':       dict(species='cat', cls='L', style='bigcat', foot=77,
    eyeL=(51,42,52,42), eyeR=(59,42,60,42), mcx=55, small_y=46, wide_y=46,
    neck=(49,55), chest=(50,57), chest_hi=(51,58), tail=None),
 'cat_snowleopard':dict(species='cat', cls='L', style='bigcat', foot=77,
    eyeL=(52,43,53,44), eyeR=(57,43,58,44), mcx=55, small_y=48, wide_y=48,
    neck=(51,57), chest=(52,59), chest_hi=(53,60), tail=None),
 'cat_caracal':    dict(species='cat', cls='L', style='bigcat', foot=77, tufts=True,
    eyeL=(52,42,53,43), eyeR=(59,42,60,43), mcx=55, small_y=48, wide_y=48,
    neck=(51,57), chest=(52,59), chest_hi=(53,60), tail=None, earback=(40,34,34)),
 'cat_blackpanther':dict(species='cat', cls='L', style='bigcat', foot=77,
    eyeL=(52,42,53,42), eyeR=(58,42,59,42), mcx=55, small_y=45, wide_y=44,   # 머리가 짧아(턱선 y≈47) 47은 턱 위치 — 실루엣 재판정으로 코 아래(눈+3)로 상향(㉧)
    neck=(50,56), chest=(51,58), chest_hi=(52,59), tail=(66,67,72,75), tailmode='v'),
 'cat_ocelot':     dict(species='cat', cls='L', style='cat', foot=77,
    eyeL=(51,43,53,44), eyeR=(58,43,60,44), mcx=55, small_y=48, wide_y=47,
    neck=(51,57), chest=(52,59), chest_hi=(53,60), tail=None),
}

# ── 입 패치(크기클래스별, 표범 v2 형태를 스케일) — O외곽 d암부 D심부 P혀 C이빨 K턱선 ──
MOUTHS = {
 'S': dict(small=['ODDO','.KK.'],
           mid=['OddO','OPPO','.KK.'],
           wide=['.OddO.','OddddO','OdPPdO','..KK..'],
           wide_fang=['.OddO.','OCddCO','OdPPdO','..KK..'],
           hiss=['OddO','OCCO','.KK.'],
           t_down=['PP','.P'], t_curl=['P.','PP']),
 'M': dict(small=['ODDO','ODDO','.KK.'],
           mid=['.OddO.','OdDDdO','OdPPdO','..KK..'],
           wide=['.OddO.','OddddO','OdDDdO','OdPPdO','..KK..'],
           wide_fang=['.OddO.','OCddCO','OdDDdO','OdPPdO','..KK..'],
           hiss=['.OddO.','OCddCO','.KKKK.'],
           t_down=['PP','.P'], t_curl=['P.','PP']),
 'L': dict(small=['ODDDDO','ODDDDO','.KKKK.'],
           mid=['.OddO.','OdDDdO','OdPPdO','.OddO.','..KK..'],
           wide=['.OOddOO.','OddddddO','OdDDDDdO','OdPPPPdO','.OPPPPO.','..KKKK..'],
           wide_fang=['.OOddOO.','OdCddCdO','OdDDDDdO','OdPPPPdO','.OPPPPO.','..KKKK..'],
           hiss=['OddddO','OCddCO','.KKKK.'],
           t_down=['PPP','.PP'], t_curl=['PP.','PPP']),
 'XL': dict(small=['ODDDDDDO','ODDDDDDO','.KKKKKK.'],
           mid=['.OddddO.','OdDDDDdO','OdPPPPdO','.OddddO.','..KKKK..'],
           mid_fang=['.OddddO.','OCdDDdCO','OdPPPPdO','.OddddO.','..KKKK..'],
           wide=['.OOddddOO.','OddddddddO','OdDDDDDDdO','OdPPPPPPdO','.OPPPPPPO.','..KKKKKK..'],
           wide_fang=['.OOddddOO.','OdCddddCdO','OdDDDDDDdO','OdPPPPPPdO','.OPPPPPPO.','..KKKKKK..'],
           hiss=['OddddddO','OCddddCO','.KKKKKK.'],
           t_down=['PPPP','.PP.'], t_curl=['PPP.','PPPP']),
}
# 클래스별 변형량(아코디언): belly 기준압축, eat/drink 머리 숙임
AMT = {
 'S': dict(belly=(-3,-4,-3,-2), eat=(-1,-2,-2,-2,-2,-1), drink=(-1,-2,-2,-2), sit=(2,1,-1,0)),
 'M': dict(belly=(-3,-4,-3,-2), eat=(-1,-2,-2,-2,-2,-1), drink=(-2,-3,-3,-3), sit=(2,1,-1,0)),
 'L': dict(belly=(-4,-5,-4,-3), eat=(-1,-2,-2,-2,-2,-1), drink=(-2,-3,-3,-3), sit=(2,1,-1,0)),
 'XL':dict(belly=(-5,-6,-5,-4), eat=(-2,-3,-3,-3,-3,-2), drink=(-2,-3,-3,-3), sit=(3,2,-1,0)),
}
DOG_EAT = (-1,-3,-3,-3,-3,-1)   # 진돗개: 머리 bob 크게(개 차이, 가이드 §1)

# ═════════════════════════════════════════════════════════════════════════
# 픽셀 연산(표범 v2와 동일 의미 — 팔레트만 펫별)
# ═════════════════════════════════════════════════════════════════════════

class Pal:
    """펫별 팔레트: 스프라이트 실측 + 공용 키트. snap/outline 색 결정."""
    def __init__(self, south):
        px = south.load(); w,h = south.size
        hist = {}
        for y in range(h):
            for x in range(w):
                c = px[x,y]
                if c[3] >= 128: hist[c[:3]] = hist.get(c[:3],0)+1
        self.colors = set(hist.keys()) | set(KIT.values())
        self.hist = hist
        # 외곽선 = 가장 어두운 실측색(빈도 5+)
        darkish = [c for c in hist if max(c) < 110]
        self.outline = min((c for c in hist if hist[c]>=5), key=lambda c:sum(c))
        self.darks = set(darkish) | {KIT['d'],KIT['D']}
        self.pal = list(self.colors)

def snap(im, P):
    d = im.load(); w,h = im.size
    for y in range(h):
        for x in range(w):
            r,g,b,a = d[x,y]
            if a < 128: d[x,y] = (0,0,0,0)
            elif (r,g,b) not in P.colors:
                best = min(P.pal, key=lambda c:(c[0]-r)**2+(c[1]-g)**2+(c[2]-b)**2)
                d[x,y] = (best[0],best[1],best[2],255)
            elif a != 255:
                d[x,y] = (r,g,b,255)
    return im

def accordion(im, y0, y1, dd):
    """밴드 [y0,y1) 행 균등 복제(dd>0 위쪽 상승)/제거(dd<0 하강). 발 고정·실루엣 무결."""
    if dd == 0: return im.copy()
    w,h = im.size; out = Image.new('RGBA',(w,h),(0,0,0,0))
    src = im.load(); dst = out.load()
    n = abs(dd)
    marks = [y0 + (k+1)*(y1-y0)//(n+1) for k in range(n)]
    for x in range(w):
        col = [src[x,y] for y in range(h)]
        if dd < 0:
            mid = [col[y] for y in range(y0,y1) if y not in marks]
            new = [(0,0,0,0)]*n + col[:y0] + mid + col[y1:]
        else:
            mid = []
            for y in range(y0,y1):
                mid.append(col[y])
                if y in marks: mid.append(col[y])
            new = (col[:y0] + mid + col[y1:])[n:]
        for y in range(h): dst[x,y] = new[y]
    return out

def move_mask(im, box, dx, dy):
    """box 안 불투명 픽셀만 이동(빈 자리 투명) — 이동은 몸 안쪽/아래쪽만 써서
    이음새가 벌어지지 않게 한다(위쪽 이동은 부착부에 틈을 남김)."""
    d = im.load()
    pts = [(x,y,d[x,y]) for y in range(box[1],box[3]) for x in range(box[0],box[2]) if d[x,y][3]>0]
    for (x,y,_) in pts: d[x,y] = (0,0,0,0)
    for (x,y,c) in pts:
        nx,ny = x+dx, y+dy
        if 0<=nx<im.size[0] and 0<=ny<im.size[1]: d[nx,ny] = c
    return im

def outline_repair(im, box, P):
    """box(+1) 안 투명과 맞닿은 밝은 픽셀 → 외곽선 색(두께 1px 유지)."""
    d = im.load(); w,h = im.size
    fix = []
    for y in range(max(0,box[1]-1), min(h,box[3]+1)):
        for x in range(max(0,box[0]-1), min(w,box[2]+1)):
            c = d[x,y]
            if c[3]==0 or (c[0],c[1],c[2]) in P.darks: continue
            for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
                if not (0<=nx<w and 0<=ny<h) or d[nx,ny][3]==0:
                    fix.append((x,y)); break
    for (x,y) in fix: d[x,y] = P.outline+(255,)
    return im

def stamp(im, x0, y0, rows, cmap, dy=0):
    """문자 매트릭스 패치('.'=유지, 'X'=투명, 그 외=cmap 색)."""
    d = im.load()
    for j,row in enumerate(rows):
        for i,ch in enumerate(row):
            if ch=='.': continue
            x,y = x0+i, y0+j+dy
            if not (0<=x<im.size[0] and 0<=y<im.size[1]): continue
            d[x,y] = (0,0,0,0) if ch=='X' else cmap[ch]+(255,)
    return im

# ═════════════════════════════════════════════════════════════════════════
# 얼굴 부위 헬퍼(패치 먼저, 변형 나중 — 가이드 §3-2)
# ═════════════════════════════════════════════════════════════════════════

def MROWS(cfg):
    # 입 패치 클래스 — 기본 cls, 얼굴(머즐)이 시트 크기 대비 큰 펫은 mcls로 상향(예: tiger_orange M시트+L입).
    # ㉧ 재발 방지: 입 크기는 '시트 크기(cls)'가 아니라 '실제 머즐 폭'(가로 ≤ 2/3) 기준으로 고른다.
    return MOUTHS[cfg.get('mcls', cfg['cls'])]

def mouth_cmap(P):
    return { 'O':P.outline, 'K':P.outline, 'd':KIT['d'], 'D':KIT['D'], 'P':KIT['P'], 'C':KIT['C'] }

def mouth_x(cfg, w): return cfg['mcx'] - w//2 + 1

def stamp_mouth(f, cfg, P, kind, dy=0):
    rows = MROWS(cfg)[kind]
    y = cfg['wide_y'] if kind.startswith(('wide','mid')) else cfg['small_y']
    if kind=='hiss': y = cfg['small_y']
    stamp(f, mouth_x(cfg, len(rows[0])), y, rows, mouth_cmap(P), dy)
    return f

def stamp_tongue(f, cfg, P, kind, dy=0):
    rows = MROWS(cfg)[kind]
    y = cfg['small_y'] + (2 if cfg['cls'] in ('L','XL') else 1)
    stamp(f, cfg['mcx'] - len(rows[0])//2 + 1, y, rows, mouth_cmap(P), dy)
    return f

def eye_cols(box):
    x0,y0,x1,y1 = box
    return [(x,y) for y in range(y0,y1+1) for x in range(x0,x1+1)]

def body_above(src, x, y, P):
    """눈 위 몸색 샘플(줄무늬 대응): 위로 올라가며 첫 '밝은' 불투명 색 —
    어두운 무늬(브로우 줄무늬)를 건너뛰어 감은 눈이 검은 사각형이 되지 않게 한다."""
    px = src.load()
    fallback = None
    for yy in range(y-1, max(0,y-7), -1):
        c = px[x,yy]
        if c[3] >= 128:
            if c[:3] not in P.darks: return c[:3]
            if fallback is None: fallback = c[:3]
    return fallback

def eyes_closed(f, src, cfg, P, dy=0):
    """눈 감김: 눈 픽셀 → 눈꺼풀(바로 위 몸색), 아랫줄 → 속눈썹(외곽선색)."""
    d = f.load()
    for box in (cfg['eyeL'], cfg['eyeR']):
        x0,y0,x1,y1 = box
        for x in range(x0,x1+1):
            lid = body_above(src, x, y0, P) or P.outline
            if y1 == y0:
                d[x,y0+dy] = lid+(255,)   # 1줄 눈: 눈꺼풀로 완전 감김(속눈썹은 눈과 구분 안 됨)
            else:
                for y in range(y0,y1): d[x,y+dy] = lid+(255,)
                d[x,y1+dy] = P.outline+(255,)
    return f

def eyes_narrow(f, cfg, P, dy=0):
    """눈 가늘게 = 브로우 프레스: 눈 윗줄을 눈썹색(외곽선)으로. 1줄 눈은 위에 눈썹 추가."""
    d = f.load()
    for box in (cfg['eyeL'], cfg['eyeR']):
        x0,y0,x1,y1 = box
        yy = y0 if y1 > y0 else y0-1
        for x in range(x0,x1+1): d[x,yy+dy] = P.outline+(255,)
    return f

# ── 귀: 돔 위 연결 성분 검출 → 눕힘(angry)·끝 트윗치(idle) ─────────────────

def ear_components(src):
    """머리 돔 위 픽셀을 연결 성분으로 — 좌/우 귀(중앙 성분=재규어 꼬리 등은 제외)."""
    px = src.load(); bb = src.getbbox(); x0,y0,x1,y1 = bb
    bh = y1-y0
    # 돔: 위에서 스캔, 실루엣이 단일 런이 되는 첫 행
    dome = None; seen2 = False
    for y in range(y0, y0+int(bh*0.5)):
        xs = [x for x in range(x0,x1) if px[x,y][3]>=128]
        if not xs: continue
        runs = 1
        for i in range(1,len(xs)):
            if xs[i]-xs[i-1] > 2: runs += 1
        if runs >= 2: seen2 = True
        elif seen2: dome = y; break
    if dome is None: return None, []
    pts = set((x,y) for y in range(y0,dome) for x in range(x0,x1) if px[x,y][3]>=128)
    comps = []
    while pts:
        stack = [pts.pop()]; comp = set(stack)
        while stack:
            cx,cy = stack.pop()
            for nx,ny in ((cx-1,cy),(cx+1,cy),(cx,cy-1),(cx,cy+1),(cx-1,cy-1),(cx+1,cy-1),(cx-1,cy+1),(cx+1,cy+1)):
                if (nx,ny) in pts:
                    pts.remove((nx,ny)); comp.add((nx,ny)); stack.append((nx,ny))
        comps.append(comp)
    # 헤드 중심축
    cxs = []
    for y in range(y0+int(bh*0.12), y0+int(bh*0.34)):
        xs = [x for x in range(x0,x1) if px[x,y][3]>=128]
        if xs: cxs.append((min(xs)+max(xs))/2.0)
    cxs.sort(); cx = cxs[len(cxs)//2] if cxs else (x0+x1)/2
    ears = []
    for comp in comps:
        mx = sum(p[0] for p in comp)/len(comp)
        if mx < cx-3: ears.append(('L',comp))
        elif mx > cx+3: ears.append(('R',comp))
        # 중앙 성분(꼬리 등)은 건드리지 않음
    return dome, ears

def flatten_ears(f, src, cfg, P):
    """angry 귀 눕힘: 귀 성분 통째 삭제 → 세로 50% 눌러 바깥쪽 1px 이동해 재부착
    (귀 뒷면=몸색으로 재드로잉) → outline_repair. 술(tufts)은 끝 2px 재스탬프.
    ear_inner(선택): 귀가 머리 실루엣에 묻힌 펫 — 안쪽 색을 몸색으로 재칠(귀 뒤로 돌림)."""
    d = f.load(); spx = src.load()
    if cfg.get('ear_inner'):
        bb = src.getbbox(); bh = bb[3]-bb[1]
        cnt2 = {}
        for y in range(bb[1], bb[1]+int(bh*0.3)):
            for x in range(bb[0], bb[2]):
                c = spx[x,y]
                if c[3]>=128 and c[:3] not in P.darks and c[:3] not in cfg['ear_inner']:
                    cnt2[c[:3]] = cnt2.get(c[:3],0)+1
        back = max(cnt2, key=cnt2.get)
        inner = set(cfg['ear_inner'])
        for y in range(bb[1], bb[1]+int(bh*0.3)):
            for x in range(bb[0], bb[2]):
                if d[x,y][3]>=128 and d[x,y][:3] in inner:
                    d[x,y] = back+(255,)
    dome, ears = ear_components(src)
    if not ears: return f
    # 몸색(귀 뒷면): 돔 아래 4행에서 최빈 밝은 색
    bb = src.getbbox()
    cnt = {}
    for y in range(dome, min(dome+4, bb[3])):
        for x in range(bb[0], bb[2]):
            c = spx[x,y]
            if c[3]>=128 and c[:3] not in P.darks: cnt[c[:3]] = cnt.get(c[:3],0)+1
    body = cfg.get('earback') or (max(cnt, key=cnt.get) if cnt else P.outline)   # 귀 뒷면색(펫별 오버라이드 — 카라칼=검정)
    for side, comp in ears:
        ys = sorted(set(p[1] for p in comp))
        # 통째 삭제(성분 단위 — 잔재 불가능)
        for (x,y) in comp: d[x,y] = (0,0,0,0)
        # 아래 절반 행만 남긴 눌린 실루엣을 1px 바깥으로
        keep = set(ys[len(ys)//2:])
        dx = -1 if side=='L' else 1
        nub_top = ys[len(ys)//2]
        nub_xs = [p[0]+dx for p in comp if p[1] in keep]
        for (x,y) in comp:
            if y not in keep: continue
            d[x+dx, y] = body+(255,)   # 아래 절반은 제자리(돔에 부착 유지)
        xs = [p[0] for p in comp]
        box = (min(xs)-2, ys[0]-1, max(xs)+3, ys[-1]+2)
        outline_repair(f, box, P)
        # 카라칼·스라소니: 술 끝은 눕혀도 보이게(종 정체성) — 눌린 귀 바깥 위로 세로 2px
        if cfg.get('tufts') and nub_xs:
            tx = min(nub_xs) if side=='L' else max(nub_xs)
            d[tx, nub_top-1] = P.outline+(255,)
            d[tx + (-1 if side=='L' else 1), nub_top-2] = P.outline+(255,)
    return f

def ear_tips(src):
    """귀 성분별 상단 2행 박스(idle 트윗치용)."""
    dome, ears = ear_components(src)
    tips = []
    for side, comp in ears:
        ys = sorted(set(p[1] for p in comp))
        top = ys[:2]
        xs = [p[0] for p in comp if p[1] in top]
        if xs: tips.append((side, (min(xs), top[0], max(xs)+1, top[-1]+1)))
    return tips

# ═════════════════════════════════════════════════════════════════════════
# 클립 빌더(전부 south 기반 — 적용 7종)
# ═════════════════════════════════════════════════════════════════════════

def tail_sway(f, cfg, P, phase):
    """idle 꼬리/귀끝 세컨더리 모션. phase=+1/-1."""
    tb = cfg.get('tail')
    mode = cfg.get('tailmode')
    if tb and mode=='v':
        move_mask(f, tb, 0, 1 if phase>0 else -1)
        outline_repair(f, (tb[0]-2,tb[1]-2,tb[2]+1,tb[3]+2), P)
    elif tb and mode=='in':
        # 바닥에 닿는 꼬리: 안쪽 플릭(발 baseline 불변·이음새 안 벌어짐)
        if phase>0:
            dx = 1 if (tb[0]+tb[2])/2 < 46 else -1   # 안쪽 방향
            move_mask(f, tb, dx, 0)
            outline_repair(f, (tb[0]-2,tb[1]-2,tb[2]+2,tb[3]+1), P)
    elif tb and mode=='top':
        # 재규어: 머리 위로 말린 꼬리 끄덕(아래로만 — 틈 없음)
        if phase>0:
            move_mask(f, tb, 0, 1)
            outline_repair(f, (tb[0]-1,tb[1]-1,tb[2]+1,tb[3]+2), P)
    else:
        # 꼬리 없음: 귀끝 1px 트윗치(아래로만) — 좌/우 위상 어긋나게
        for side, box in (f._tips if hasattr(f,'_tips') else []):
            if (phase>0) == (side=='L'):
                move_mask(f, box, 0, 1)
                outline_repair(f, (box[0]-1,box[1]-1,box[2]+1,box[3]+2), P)
    return f

def m_idle(src, cfg, P, tips):
    out = []
    for dd,ph in ((0,0),(-1,1),(0,0),(1,-1)):
        f = src.copy(); f._tips = tips
        if ph: tail_sway(f, cfg, P, ph)               # 패치(스웨이) 먼저
        f = accordion(f, cfg['chest'][0], cfg['chest'][1], dd)   # 변형 나중(가이드 §3-2)
        out.append(snap(f,P))
    return out

def m_sit(src, cfg, P):
    return [snap(accordion(src, cfg['chest'][0], cfg['chest'][1], dd),P) for dd in AMT[cfg['cls']]['sit']]

def m_belly(src, cfg, P):
    y0,y1 = cfg['chest_hi']
    return [snap(accordion(src, y0, y1, dd),P) for dd in AMT[cfg['cls']]['belly']]

def m_eat(src, cfg, P):
    dds = DOG_EAT if cfg['style']=='dog' else AMT[cfg['cls']]['eat']
    out = []
    for i,dd in enumerate(dds):
        mouth = (i in (1,3))
        f = src.copy()
        if mouth: stamp_mouth(f, cfg, P, 'small')       # 패치 먼저
        f = accordion(f, cfg['neck'][0], cfg['neck'][1], dd)   # 변형 나중(패치가 함께 이동)
        out.append(snap(f,P))
    return out

def m_drink(src, cfg, P):
    plan = list(zip(AMT[cfg['cls']]['drink'], (None,'t_down','t_curl',None)))
    out = []
    for dd,tg in plan:
        f = src.copy()
        if tg:
            stamp_mouth(f, cfg, P, 'small')
            stamp_tongue(f, cfg, P, tg)
        f = accordion(f, cfg['neck'][0], cfg['neck'][1], dd)
        out.append(snap(f,P))
    return out

def m_yawn(src, cfg, P):
    """소→대(정점 2f: 눈 감김·머리 젖힘)→중→기준. 대형 고양잇과는 송곳니 노출."""
    big = cfg['style'] in ('bigcat','lion')
    wide = 'wide_fang' if big and ('wide_fang' in MROWS(cfg)) else 'wide'
    plan = [(0,None,False),(0,'small',False),(1,wide,False),(1,wide,True),(0,'mid',False),(0,None,False)]
    out = []
    for dd,mo,ec in plan:
        f = src.copy()
        if mo: stamp_mouth(f, cfg, P, mo)
        if ec: eyes_closed(f, src, cfg, P)
        f = accordion(f, cfg['neck'][0], cfg['neck'][1], dd)
        out.append(snap(f,P))
    return out

def m_angry(src, cfg, P):
    """cat/bigcat=하악(귀 눕힘+브로우+송곳니 개구), lion=으르렁(귀 유지·중개구+송곳니),
    dog=이빨 드러냄(귀 직립 유지). once — 마지막=중립."""
    style = cfg['style']
    def base():
        f = src.copy()
        if style in ('cat','bigcat'):
            flatten_ears(f, src, cfg, P)
        eyes_narrow(f, cfg, P)
        return f
    calm = base()
    hiss = base()
    if style=='lion':
        stamp_mouth(hiss, cfg, P, 'mid_fang')
    else:
        stamp_mouth(hiss, cfg, P, 'hiss')
    hiss = accordion(hiss, cfg['chest'][0], cfg['chest'][1], -1)   # 몸 낮춤(변형 나중)
    return [snap(calm,P), snap(hiss,P), snap(hiss.copy(),P), snap(src.copy(),P)]

CLIP_FRAMES = {'idle':4,'sit':4,'belly':4,'eat':6,'drink':4,'yawn':6,'angry':4}

# ═════════════════════════════════════════════════════════════════════════
# 검증·시트·CLI
# ═════════════════════════════════════════════════════════════════════════

def interior_holes(im):
    """3면 이상 불투명에 둘러싸인 투명 픽셀 수 — 구멍 탐지.
    (행 기준 계산은 몸-꼬리 사이 세로 통로·술 픽셀 간격을 오탐해 4방향 이웃 기준으로 바꿈.)"""
    px = im.load(); w,h = im.size; n = 0
    for y in range(1,h-1):
        for x in range(1,w-1):
            if px[x,y][3] >= 128: continue
            nb = sum(1 for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)) if px[x+dx,y+dy][3]>=128)
            if nb >= 3: n += 1
    return n

def verify(pid, cfg, made, src):
    ok = True
    base_holes = interior_holes(src)
    for clip, frames in made.items():
        for i,f in enumerate(frames):
            bb = f.getbbox()
            if bb and bb[3]-1 != cfg['foot']:
                print(f'  ⚠ {pid}.{clip}[{i}] baseline {bb[3]-1} != foot {cfg["foot"]}'); ok = False
            holes = interior_holes(f)
            if holes > base_holes + 8:
                print(f'  ⚠ {pid}.{clip}[{i}] 내부 투명 급증 {base_holes}→{holes}(구멍?)'); ok = False
    return ok

def strip(frames):
    fw = frames[0].size[0]
    cv = Image.new('RGBA', (fw*len(frames), fw), (0,0,0,0))
    for i,f in enumerate(frames): cv.alpha_composite(f, (i*fw,0))
    return cv

def contact_sheet(pid, made, src, path, bg, Z=3):
    fw = src.size[0]
    pad = 6
    rows = [('south',[src])] + [(k, made[k]) for k in CLIP_FRAMES if k in made]
    maxn = max(len(r[1]) for r in rows)
    W = 70+(fw*Z+pad)*maxn; H = pad+(fw*Z+pad)*len(rows)
    cv = Image.new('RGBA',(W,H),bg); dr = ImageDraw.Draw(cv)
    for r,(name,fl) in enumerate(rows):
        y = pad+r*(fw*Z+pad)
        dr.text((4,y+fw*Z//2), name, fill=(255,255,255,255) if bg[0]<128 else (0,0,0,255))
        for i,f in enumerate(fl):
            cv.alpha_composite(f.resize((fw*Z,)*2, Image.NEAREST),(70+i*(fw*Z+pad),y))
    cv.save(path)

def build(pid, write=False, only=None, outdir=None, sheets=True):
    cfg = CFG[pid]
    d = pet_dir(pid, cfg['species'])
    src = Image.open(os.path.join(d,'south.png')).convert('RGBA')
    P = Pal(src)
    tips = ear_tips(src) if not cfg.get('tail') else []
    made = {}
    for clip in CLIP_FRAMES:
        if only and clip not in only: continue
        if clip=='idle': fr = m_idle(src, cfg, P, tips)
        elif clip=='sit': fr = m_sit(src, cfg, P)
        elif clip=='belly': fr = m_belly(src, cfg, P)
        elif clip=='eat': fr = m_eat(src, cfg, P)
        elif clip=='drink': fr = m_drink(src, cfg, P)
        elif clip=='yawn': fr = m_yawn(src, cfg, P)
        elif clip=='angry': fr = m_angry(src, cfg, P)
        assert len(fr)==CLIP_FRAMES[clip], (pid, clip, len(fr))
        made[clip] = fr
    ok = verify(pid, cfg, made, src)
    if sheets and outdir:
        contact_sheet(pid, made, src, os.path.join(outdir, f'ms_{pid}_light.png'), (238,238,242,255))
        contact_sheet(pid, made, src, os.path.join(outdir, f'ms_{pid}_dark.png'), (26,28,34,255))
    if write:
        for clip,fr in made.items():
            strip(fr).save(os.path.join(d, clip+'.png'))
            print('wrote', os.path.join(d, clip+'.png'), 'frames=', len(fr))
    return made, ok

if __name__=='__main__':
    write = '--write' in sys.argv
    pets = [a.split('=',1)[1] for a in sys.argv if a.startswith('--pet=')]
    only = None
    for a in sys.argv:
        if a.startswith('--only='): only = a.split('=',1)[1].split(',')
    OUT = os.environ.get('MOTION_OUT') or os.path.join(ROOT, '_zips')
    os.makedirs(OUT, exist_ok=True)
    targets = pets or list(CFG.keys())
    allok = True
    for pid in targets:
        made, ok = build(pid, write=write, only=only, outdir=OUT)
        allok = allok and ok
        print(('OK ' if ok else 'WARN ')+pid)
    print('done', 'all-ok' if allok else 'with warnings')
