# -*- coding: utf-8 -*-
"""
펫 모션 클립 시트 제작 v2 — 기존 스프라이트(walk 8f + 4방향 스틸)에서
idle·sit·belly·eat·drink·run·jump·yawn·angry·sleep 클립 시트(가로 스트립 PNG)를 만든다.
규칙은 docs/pet-motion-guide.md. 표범(cat_leopard)이 첫 사례.
(lick 그루밍은 정면 기반 림 재드로잉이 무리라 폐기 — 2026-07.)

v1(사각 박스 cut/shift)의 구멍·흰 띠 버그를 폐기하고 v2 기법으로 전면 교체:
  1) 아코디언(행 삽입/삭제) — 몸통 밴드에서 행을 균등 삽입/제거해 스쿼시&스트레치.
     실루엣·외곽선이 절대 끊기지 않는다(발 baseline 고정, 위쪽만 오르내림).
  2) 형태 변화(입 벌림·눈 감김·혀·발 들기)는 픽셀 패치로 "재드로잉" — 외곽선·명암 포함.
  3) 부위 이동(꼬리끝)은 실루엣 마스크만 옮기고 이음새 외곽선을 재처리.
  4) 모든 변형은 정수 좌표 + 팔레트 색만 사용(회전·비정수 스케일·안티에일리어싱 금지).
  5) 확정 전 PIL 컨택트시트(라이트/다크·확대)로 눈 검수.

사용:
  python tools/pet_motion_build.py cat_leopard             # 검수 시트만(scratchpad)
  python tools/pet_motion_build.py cat_leopard --write     # public/assets/.../<clip>.png 저장
  python tools/pet_motion_build.py cat_leopard --only=yawn,sleep
"""
import os, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def pet_dir(pid, species='cat'): return os.path.join(ROOT, 'public', 'assets', 'pets', species, pid)

# ── 표범 팔레트(스프라이트 실측) + 혀 핑크 ──────────────────────────────
C = {
  'B':(249,179,36), 'b':(251,186,41), 'm':(218,148,29), 's':(180,119,11), 'S':(173,108,8),
  't':(144,86,23),  'T':(103,59,26),  'O':(75,34,10),   'K':(64,30,10),   'D':(90,40,8),
  'd':(82,17,3),    'C':(243,220,196),'c':(242,209,170),'v':(245,208,145),
  'G':(89,150,15),  'g':(62,60,9),    'P':(224,112,102),   # P=혀(무광 살몬핑크, 신규 1색)
}
PAL = list(C.values())
DARKS = {C['O'],C['K'],C['D'],C['d'],C['T'],C['t']}   # 외곽선/암부 계열

def load_frames(pid, species='cat'):
    d = pet_dir(pid, species)
    walk = Image.open(os.path.join(d,'walk.png')).convert('RGBA')
    fw = walk.size[1]; nf = walk.size[0]//fw
    frames = [walk.crop((i*fw,0,(i+1)*fw,fw)) for i in range(nf)]
    stills = {f:Image.open(os.path.join(d,f+'.png')).convert('RGBA') for f in ['south','north','east','west']}
    return frames, stills, fw

# ── 공용 픽셀 연산 ────────────────────────────────────────────────────────

def snap(im):
    """반투명·비팔레트 잔재 정리: a>=128 → 근접 팔레트 스냅, a<128 → 투명."""
    d = im.load(); w,h = im.size
    for y in range(h):
        for x in range(w):
            r,g,b,a = d[x,y]
            if a < 128: d[x,y] = (0,0,0,0)
            elif (r,g,b) not in C.values():
                best = min(PAL, key=lambda c:(c[0]-r)**2+(c[1]-g)**2+(c[2]-b)**2)
                d[x,y] = (best[0],best[1],best[2],255)
            elif a != 255:
                d[x,y] = (r,g,b,255)
    return im

def accordion(im, y0, y1, dd):
    """밴드 [y0,y1) 안에서 행을 균등하게 복제(dd>0, 위쪽이 dd만큼 상승)
    또는 제거(dd<0, 위쪽이 하강). 밴드 아래(발)는 고정 — 실루엣이 끊기지 않는
    스쿼시&스트레치. 모든 열에 같은 행을 적용해 가로 정합 유지."""
    if dd == 0: return im.copy()
    w,h = im.size; out = Image.new('RGBA',(w,h),(0,0,0,0))
    src = im.load(); dst = out.load()
    n = abs(dd)
    marks = [y0 + (k+1)*(y1-y0)//(n+1) for k in range(n)]   # 균등 분산 행
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

def shear_up(im, x0, x1, total):
    """픽셀 시어(정수 열 시프트) = 회전 근사 기울기: x0→x1로 갈수록 열을 위로
    (total<0이면 아래로) 옮긴다. 도약(앞몸 들림)·착지(앞몸 낮춤) 기울기용 —
    열 전체가 통째로 움직여 구멍이 생기지 않는다."""
    if total == 0: return im.copy()
    w,h = im.size; out = Image.new('RGBA',(w,h),(0,0,0,0))
    src = im.load(); dst = out.load()
    for x in range(w):
        t = 0 if x <= x0 else (total if x >= x1 else round(total*(x-x0)/(x1-x0)))
        for y in range(h):
            c = src[x,y]
            if c[3]==0: continue
            ny = y - t
            if 0 <= ny < h: dst[x,ny] = c
    return out

def move_mask(im, box, dx, dy):
    """box 안 불투명 픽셀(실루엣 마스크)만 (dx,dy) 이동. 빈 자리는 투명
    (부위가 '움직인' 것) — 이음새는 outline_repair로 재처리."""
    d = im.load()
    pts = [(x,y,d[x,y]) for y in range(box[1],box[3]) for x in range(box[0],box[2]) if d[x,y][3]>0]
    for (x,y,_) in pts: d[x,y] = (0,0,0,0)
    for (x,y,c) in pts:
        nx,ny = x+dx, y+dy
        if 0<=nx<im.size[0] and 0<=ny<im.size[1]: d[nx,ny] = c
    return im

def outline_repair(im, box):
    """box(+1) 안에서 투명과 맞닿은 밝은 픽셀을 외곽선 색으로 — 이동·패치 후
    실루엣 외곽선 두께 1px 유지."""
    d = im.load(); w,h = im.size
    fix = []
    for y in range(max(0,box[1]-1), min(h,box[3]+1)):
        for x in range(max(0,box[0]-1), min(w,box[2]+1)):
            c = d[x,y]
            if c[3]==0 or (c[0],c[1],c[2]) in DARKS: continue
            for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
                if not (0<=nx<w and 0<=ny<h) or d[nx,ny][3]==0:
                    fix.append((x,y)); break
    for (x,y) in fix: d[x,y] = C['O']+(255,)
    return im

def stamp(im, x0, y0, rows, dy=0):
    """문자 매트릭스 패치. '.'=유지, 'X'=투명 지우기, 그 외=팔레트 색."""
    d = im.load()
    for j,row in enumerate(rows):
        for i,ch in enumerate(row):
            if ch=='.': continue
            x,y = x0+i, y0+j+dy
            if not (0<=x<im.size[0] and 0<=y<im.size[1]): continue
            d[x,y] = (0,0,0,0) if ch=='X' else C[ch]+(255,)
    return im

# ─────────────────────────────────────────────────────────────────────────
# 표범 앵커(south 실측): 발끝 y77 · 귀끝 y30 · 눈(초록) y41~42 x50~52/x59~60 ·
# 코 x54~57 y45~46 · 인중 x55~56 y47 · 턱선 x54~57 y51 · 가슴 크림 y52~ ·
# 앞다리(왼) x49~55 y64~78 · 꼬리끝 뭉치 x69~77 y61~73
# 밴드: 목/가슴 (52,58) · 가슴 위 (53,60) · 다리(east) (60,76)
# ─────────────────────────────────────────────────────────────────────────
NECK = (52,58)     # south 머리 숙임/젖힘용
CHEST = (53,60)    # south 호흡/정착용
CHEST_HI = (54,61) # south 엎드림용(꼬리 x66+ 비간섭)
LEGS_E = (60,76)   # east 다리 밴드(웅크림/도약)
TAIL_BOX = (69,60,78,74)

def eyes_closed(f, dy=0):
    """눈 감김: 초록 눈 픽셀 → 눈꺼풀(몸색), 아래줄에 속눈썹 라인."""
    for x in (50,51,52,59,60): stamp(f, x,41, ['B'], dy)
    for x in (51,52,59,60):    stamp(f, x,42, ['K'], dy)
    return f

# 입 패치(문자 매트릭스) — 코(y45~46)는 유지, 그 아래를 재드로잉
M_MOUTH_SMALL = [   # x53, y48  살짝 벌림(씹기/랩핑 기본)
 'ODDDDO',
 'ODDDDO',
 '.KKKK.',
]
M_MOUTH_MID = [     # x53, y47  중간 개구(하품 진행) — 개구 폭≤머즐 2/3 규칙
 '.OddO.',
 'OdDDdO',
 'OdPPdO',
 '.OddO.',
 '..KK..',
]
M_MOUTH_WIDE = [    # x52, y47  최대 개구(하품 정점) — 혀 내밈. 코(y45~46)는 유지
 '.OOddOO.',
 'OddddddO',
 'OdDDDDdO',
 'OdPPPPdO',
 '.OPPPPO.',
 '..KKKK..',
]
M_TONGUE_DOWN = [   # x54, y50  혀 내려 수면 터치(drink)
 'PPP',
 '.PP',
]
M_TONGUE_CURL = [   # x54, y49  혀 말아 올림(drink)
 'PP.',
 'PPP',
]

# ── angry: 하악질 — 귀 눕힘(플랫) + 눈 가늘게 + 송곳니 보이는 개구 + 몸 낮춤 ──
# 귀 눕힘: 뾰족 귀 끝(y30~32)을 지우고 옆으로 접힌 귀(음영 처리)로 재드로잉. x0=42, y0=30.
M_EARS_FLAT = [
 'XXXXXXX..............XXXXXX.',   # y30  귀 끝 소거
 'XXXXXXXXX...........XXXXXXX.',   # y31  (머리 위 외곽선 x53~58 유지)
 'XXXXXXXXX...........XXXXXXX.',   # y32  돔 중앙(x51~60)만 유지
 '....XXOsb............sOXXX..',   # y33  접힌 귀 시작(음영 폴드)
 '...XOssB............BssOXX..',   # y34  옆으로 눕힌 귀(어두운 뒷면)
 '....OsB..............sOX....',   # y35
 '....KsB..............s......',   # y36  폴드 밑단
]
M_MOUTH_HISS = [    # x53, y48  하악 개구 — 윗니 송곳니(크림) 2점
 'OddddO',
 'OCddCO',
 '.KKKK.',
]

# ── sleep: 옆모습(east) 엎드려 눈 감고 잠 — 다리 접힘(아코디언 대압축) +
#    머리 숙임(시어) + 눈 감김 + 느린 호흡. east 눈(초록) 좌표: (74~76,y41)·(75~76,y42).
def eyes_closed_east(f):
    """east 스틸 눈 감김: 초록 → 눈꺼풀(몸색), 아랫줄에 감은 속눈썹 라인."""
    for x in (74,75,76): stamp(f, x,41, ['B'])
    for x in (75,76):    stamp(f, x,42, ['K'])
    return f

# ─────────────────────────────────────────────────────────────────────────
# 클립 빌더 (south 계열)
# ─────────────────────────────────────────────────────────────────────────

def m_idle(frames, stills, fw):
    """앉은 정면 숨쉬기(가슴 밴드 ±1) + 꼬리끝 마스크 스윙 ±1."""
    s = stills['south']; out=[]
    for k,(dd,tail) in enumerate([(0,0),(-1,1),(0,0),(1,-1)]):
        f = accordion(s, CHEST[0], CHEST[1], dd)
        if tail:
            move_mask(f, TAIL_BOX, 0, tail)
            outline_repair(f, (TAIL_BOX[0]-2,TAIL_BOX[1]-2,TAIL_BOX[2]+1,TAIL_BOX[3]+2))
        out.append(snap(f))
    return out

def m_sit(frames, stills, fw):
    """앉음 정착(once+hold): 높음(+2)→(+1)→오버슛(-1)→기준."""
    s = stills['south']
    return [snap(accordion(s, CHEST[0], CHEST[1], dd)) for dd in (2,1,-1,0)]

def m_belly(frames, stills, fw):
    """엎드림: 가슴 밴드 4행 압축(머리·어깨 하강, 다리·꼬리 불변) + 느린 호흡 ±1."""
    s = stills['south']
    return [snap(accordion(s, CHEST_HI[0], CHEST_HI[1], dd)) for dd in (-4,-5,-4,-3)]

def m_eat(frames, stills, fw):
    """머리 숙여 씹기: 목 밴드 압축(숙임) + 입 소개구 패치 토글."""
    s = stills['south']; out=[]
    for dd,mouth in [(-1,0),(-2,1),(-2,0),(-2,1),(-2,0),(-1,0)]:
        f = accordion(s, NECK[0], NECK[1], dd)
        if mouth: stamp(f, 53,48, M_MOUTH_SMALL, dy=-dd)
        out.append(snap(f))
    return out

def m_drink(frames, stills, fw):
    """머리 깊이 숙여 lapping: 혀 내림→말아올림→삼킴."""
    s = stills['south']; out=[]
    plan = [(-2,None),(-3,'down'),(-3,'curl'),(-3,None)]
    for dd,tg in plan:
        f = accordion(s, NECK[0], NECK[1], dd)
        if tg:
            stamp(f, 53,48, M_MOUTH_SMALL, dy=-dd)
            if tg=='down': stamp(f, 54,50, M_TONGUE_DOWN, dy=-dd)
            else:          stamp(f, 54,49, M_TONGUE_CURL, dy=-dd)
        out.append(snap(f))
    return out

def m_yawn(frames, stills, fw):
    """하품(once): 소→대(정점 2f, 눈감김·머리 젖힘)→중→기준. 마지막=중립(hold 대상)."""
    s = stills['south']; out=[]
    plan = [(0,None,False),(0,'small',False),(1,'wide',False),(1,'wide',True),(0,'mid',False),(0,None,False)]
    for dd,mo,ec in plan:
        f = accordion(s, NECK[0], NECK[1], dd)   # dd>0 = 머리 젖힘(위로)
        if mo=='small': stamp(f, 53,48, M_MOUTH_SMALL, dy=-dd)
        elif mo=='mid': stamp(f, 53,47, M_MOUTH_MID, dy=-dd)
        elif mo=='wide': stamp(f, 52,47, M_MOUTH_WIDE, dy=-dd)
        if ec: eyes_closed(f, dy=-dd)
        out.append(snap(f))
    return out

def m_angry(frames, stills, fw):
    """하악질(once): 귀 눕힘·눈 가늘게(전조) → 하악(개구+송곳니·몸 낮춤, 2f hold) → 중립.
    once라 마지막 프레임=중립(hold 대상)."""
    s = stills['south']; out=[]
    def base_angry(f):
        stamp(f, 42,30, M_EARS_FLAT)
        outline_repair(f, (42,29,70,39))
        for x in (50,51,52,59,60): stamp(f, x,41, ['B'])   # 눈 가늘게(윗줄 감김)
        return f
    f0 = base_angry(s.copy())                              # 전조: 귀 눕힘+눈 가늘게
    def hiss():
        f = base_angry(accordion(s, CHEST[0], CHEST[1], -1))   # 몸 1px 낮춤(웅크림)
        stamp(f, 53,48, M_MOUTH_HISS, dy=1)
        return f
    out=[snap(f0), snap(hiss()), snap(hiss()), snap(s.copy())]
    return out

def m_sleep(frames, stills, fw):
    """잠(east, loop): 다리 접어 엎드림(대압축) + 머리 숙임(시어) + 눈 감김 + 느린 호흡 ±1.
    발 접지선 유지(다리가 몸 밑에 접힘)."""
    e = eyes_closed_east(stills['east'].copy())
    out=[]
    for dd in (-11,-12,-11,-10):                            # 호흡: 등이 1px씩 오르내림
        f = shear_up(accordion(e, LEGS_E[0], LEGS_E[1], dd), 70,84, -2)   # 코끝만 살짝 떨굼(꾸벅) — 램프가 머리를 가로지르면 턱이 벌어져 보임
        out.append(snap(f))
    return out

# ─────────────────────────────────────────────────────────────────────────
# 클립 빌더 (east 계열)
# ─────────────────────────────────────────────────────────────────────────

def m_run(frames, stills, fw):
    """rotary gallop 근사: walk 8f에 다리 밴드 아코디언 bob(접지 −1·공중 +2).
    fps12 재생으로 질주감 — 실루엣 끊김 없음(발 baseline 고정)."""
    bob = [-1,1,2,1,-1,1,2,1]
    return [snap(accordion(f, LEGS_E[0], LEGS_E[1], bob[i])) for i,f in enumerate(frames)]

def m_jump(frames, stills, fw):
    """제자리 점프(once) — 포물선 아크 + 몸 기울기(픽셀 시어)로 도약 디테일:
    웅크림 → 앞몸 들어 도약(뒷발 접지·코 위로) → 체공 최고점(다리 모음·코 위)
    → 하강(코 아래로) → 착지(앞발 먼저 닿고 엉덩이 들림+스쿼시) → 기준.
    east 머리=오른쪽: shear_up(20,80,+n)=앞몸 n px 상승."""
    e = stills['east']
    def lift(im, dy):
        g = Image.new('RGBA', im.size, (0,0,0,0))
        g.alpha_composite(im, (0,dy))
        return g
    f0 = accordion(e, LEGS_E[0], LEGS_E[1], -5)                    # 웅크림(anticipation)
    f1 = shear_up(accordion(e, LEGS_E[0], LEGS_E[1], 2), 40,80, 5)  # 도약: 뒷발 접지(x≤40 고정), 앞몸 5px 들림
    f2 = shear_up(lift(accordion(e, LEGS_E[0], LEGS_E[1], -4), -9), 20,80, 2)   # 체공 최고점: 다리 모음·코 위
    f3 = shear_up(lift(accordion(e, LEGS_E[0], LEGS_E[1], -4), -6), 20,80, -2)  # 하강: 코 아래로
    f4 = shear_up(lift(accordion(e, LEGS_E[0], LEGS_E[1], -3), -3), 30,66, -3)  # 착지: 앞발 접지(x≥66 풀시프트)·엉덩이 들림
    f5 = e.copy()                                                   # 기준(hold 대상)
    return [snap(f) for f in (f0,f1,f2,f3,f4,f5)]

BUILDERS = {'idle':m_idle,'sit':m_sit,'belly':m_belly,'eat':m_eat,'drink':m_drink,
            'run':m_run,'jump':m_jump,'yawn':m_yawn,'angry':m_angry,'sleep':m_sleep}
CLIP_FRAMES = {'idle':4,'sit':4,'belly':4,'eat':6,'drink':4,'run':8,'jump':6,'yawn':6,'angry':4,'sleep':4}

def strip(frames):
    fw = frames[0].size[0]
    cv = Image.new('RGBA', (fw*len(frames), fw), (0,0,0,0))
    for i,f in enumerate(frames): cv.alpha_composite(f, (i*fw,0))
    return cv

def build(pid, species='cat', write=False, only=None):
    frames, stills, fw = load_frames(pid, species)
    d = pet_dir(pid, species)
    made = {}
    for clip,fn in BUILDERS.items():
        if only and clip not in only: continue
        fr = fn(frames, stills, fw)
        assert len(fr)==CLIP_FRAMES[clip], (clip, len(fr))
        made[clip] = fr
        if write:
            strip(fr).save(os.path.join(d, clip+'.png'))
            print('wrote', os.path.join(d, clip+'.png'), 'frames=', len(fr))
    return made, frames, stills, fw

def contact_sheet(made, frames, stills, fw, path, bg, Z=3):
    pad=6; rows=[('walk',frames)]+[(k,made[k]) for k in CLIP_FRAMES if k in made]
    maxn=max(len(r[1]) for r in rows)
    W=70+(fw*Z+pad)*maxn; H=pad+(fw*Z+pad)*len(rows)
    cv=Image.new('RGBA',(W,H),bg); dr=ImageDraw.Draw(cv)
    for r,(name,fl) in enumerate(rows):
        y=pad+r*(fw*Z+pad)
        dr.text((4,y+fw*Z//2), name, fill=(255,255,255,255) if bg[0]<128 else (0,0,0,255))
        for i,f in enumerate(fl):
            cv.alpha_composite(f.resize((fw*Z,)*2, Image.NEAREST),(70+i*(fw*Z+pad),y))
    cv.save(path); print('saved', path)

if __name__=='__main__':
    pid = sys.argv[1] if len(sys.argv)>1 and not sys.argv[1].startswith('--') else 'cat_leopard'
    write = '--write' in sys.argv
    only = None
    for a in sys.argv:
        if a.startswith('--only='): only = a.split('=',1)[1].split(',')
    made, frames, stills, fw = build(pid, 'cat', write=write, only=only)
    OUT = os.environ.get('MOTION_OUT') or os.path.join(ROOT, '_zips')
    os.makedirs(OUT, exist_ok=True)
    contact_sheet(made, frames, stills, fw, os.path.join(OUT,'motion_light.png'), (238,238,242,255))
    contact_sheet(made, frames, stills, fw, os.path.join(OUT,'motion_dark.png'), (26,28,34,255))
