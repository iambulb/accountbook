# -*- coding: utf-8 -*-
"""
펫 모션 클립 시트 제작 — 기존 스프라이트(walk 8f + 4방향 스틸)를 픽셀 서저리(cut/shift/redraw)로
재조립해 idle·sit·belly·eat·drink·run·jump·yawn·lick 클립 시트(가로 스트립 PNG)를 만든다.
규칙은 docs/pet-motion-guide.md. 표범(cat_leopard)이 첫 사례.

원칙(가이드 §3): 2프레임을 백지에서 그리지 말고 소스 프레임을 복사한 뒤 변하는 부위만 shift + 외곽선 재처리.
변형은 정수 shift + NEAREST + 픽셀 드로잉만 사용(회전·비정수 스케일 금지 → 팔레트·아웃라인 보존).

사용:
  python tools/pet_motion_build.py cat_leopard          # 시트 생성 + 검수 PNG(scratchpad)
  python tools/pet_motion_build.py cat_leopard --write   # public/assets/.../<clip>.png 로 저장
"""
import os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def pet_dir(pid, species='cat'): return os.path.join(ROOT, 'public', 'assets', 'pets', species, pid)

# ── 표범 팔레트(analyze 결과) — 변형 후 반투명 엣지를 근접 스냅할 때 사용 ──
PAL = [(249,179,36),(251,186,41),(180,119,11),(173,108,8),(218,148,29),(144,86,23),
       (103,59,26),(75,34,10),(64,30,10),(90,40,8),(82,17,3),(243,220,196),
       (242,209,170),(245,208,145),(107,172,9),(89,150,15),(62,60,9)]
OUTLINE=(75,34,10,255); OUTLINE2=(64,30,10,255); DARK=(82,17,3,255)
BODY=(249,179,36,255); CREAM=(243,220,196,255); CREAM_D=(245,208,145,255)

def load_frames(pid, species='cat'):
    d=pet_dir(pid,species)
    walk=Image.open(os.path.join(d,'walk.png')).convert('RGBA')
    fw=walk.size[1]; nf=walk.size[0]//fw
    frames=[walk.crop((i*fw,0,(i+1)*fw,fw)) for i in range(nf)]
    stills={f:Image.open(os.path.join(d,f+'.png')).convert('RGBA') for f in ['south','north','east','west']}
    return frames, stills, fw

def blank(sz): return Image.new('RGBA',(sz,sz),(0,0,0,0))

def region(im, box):
    return im.crop(box)

def erase(im, box):
    d=im.load()
    for y in range(box[1],box[3]):
        for x in range(box[0],box[2]):
            if 0<=x<im.size[0] and 0<=y<im.size[1]: d[x,y]=(0,0,0,0)

def paste_over(base, part, x, y):
    """part를 (x,y)에 알파 합성(위에 덮기)."""
    base.alpha_composite(part, (x,y))

def cut_shift(base, box, dx, dy, fill=False):
    """box 영역을 잘라 원위치 지우고 (dx,dy) 이동해 위에 덮는다.
    fill=True면 위로 올릴 때(dy<0) 몸통 최하단행을 아래로 복제해 다리와의 틈(배경 노출)을 메움."""
    part=base.crop(box)
    erase(base, box)
    paste_over(base, part, box[0]+dx, box[1]+dy)
    if fill and dy<0:
        h=box[3]-box[1]; boty=box[1]+dy+h-1   # 이동된 몸통 최하단행 y
        botrow=base.crop((box[0]+dx, boty, box[2]+dx, boty+1))
        for yy in range(box[3]+dy, box[3]):
            paste_over(base, botrow, box[0]+dx, yy)
    return part

def set_px(im, pts, color):
    d=im.load()
    for (x,y) in pts:
        if 0<=x<im.size[0] and 0<=y<im.size[1]: d[x,y]=color

def snap(im):
    """변형 잔재(반투명·비팔레트) 정리: a>=128는 근접 팔레트로 스냅·불투명, a<128은 투명."""
    d=im.load(); w,h=im.size
    for y in range(h):
        for x in range(w):
            r,g,b,a=d[x,y]
            if a<128: d[x,y]=(0,0,0,0)
            else:
                best=min(PAL,key=lambda c:(c[0]-r)**2+(c[1]-g)**2+(c[2]-b)**2)
                d[x,y]=(best[0],best[1],best[2],255)
    return im

def strip(frames):
    fw=frames[0].size[0]; cv=Image.new('RGBA',(fw*len(frames),fw),(0,0,0,0))
    for i,f in enumerate(frames): cv.alpha_composite(f,(i*fw,0))
    return cv

# ─────────────────────────────────────────────────────────────────────────────
# 모션별 제작 (표범 앵커: south 눈 y41·발 baseline y77·머리 y30~48·입 중앙 x53~58 y46~50 /
#                        east 머리우측 x66~82·몸통 x25~65·다리 y60~78·꼬리 좌측)
# ─────────────────────────────────────────────────────────────────────────────
HEAD_S=(43,29,68,50)   # south 머리+귀 박스
MOUTH_CX=(52,59)       # south 입 중앙 x범위
BODY_TOP_E=(4,29,90,63) # east 몸통(다리 위) 박스

def m_idle(frames, stills, fw):
    s=stills['south']; out=[]
    tail=(64,60,76,74)  # south 꼬리끝(오른쪽 아래로 말림)
    for k in range(4):
        f=s.copy()
        if k==1: cut_shift(f, tail, 1, -1)        # 꼬리 살짝 위로
        elif k==3: cut_shift(f, tail, -1, 1)      # 꼬리 아래로
        # 미세 호흡: 머리를 k에 따라 ±1 (csprBreath와 겹쳐 이중효과 방지 위해 아주 작게)
        if k==1: cut_shift(f, HEAD_S, 0, 1)
        elif k==3: cut_shift(f, HEAD_S, 0, -1)
        out.append(snap(f))
    return out

def m_sit(frames, stills, fw):
    s=stills['south']; out=[]
    # 앉음 정착: 처음 살짝 높음 → 엉덩이 내려앉음 → 완성(=idle f0). once+hold라 마지막 유지.
    seq=[(-2,'up'),(-1,'mid'),(0,'set'),(0,'hold')]
    for dy,_ in seq:
        f=s.copy()
        if dy!=0: cut_shift(f, (41,29,77,60), 0, dy)  # 상체를 위로 살짝(막 멈춘 느낌)→내려앉음
        out.append(snap(f))
    return out

def m_belly(frames, stills, fw):
    s=stills['south']; out=[]
    # 엎드림(식빵): 상체를 아래로 눌러 낮춤(아래 이동이라 다리와 겹쳐 틈 없음). 이후 느린 호흡.
    base=s.copy()
    cut_shift(base, (41,29,77,57), 0, 3)          # 상체 3px 낮춤(웅크림) — 다리 위에 겹침
    base=snap(base)
    for k in range(4):
        f=base.copy()
        if k==1: cut_shift(f,(43,32,68,52),0,1)          # 등 날숨(아래)
        elif k==3: cut_shift(f,(43,32,68,52),0,-1,fill=True)  # 들숨(위) — 틈 메움
        out.append(snap(f))
    return out

def _bow_head(f, dy, mouth=None, tongue=False, eyeclose=False):
    """south 얼굴: 머리를 dy 숙이고(입 열기·혀·눈감기 옵션). 숙이면 정수리(y29~30)는 배경 노출."""
    cut_shift(f, HEAD_S, 0, dy)
    cx0,cx1=MOUTH_CX
    if eyeclose:
        # 눈(y41 초록) 위치를 살색으로 덮고 감은 눈 가로선(K)
        for ex in [(51,52),(59,60)]:
            set_px(f,[(ex[0],41+dy),(ex[1],41+dy),(ex[0],42+dy),(ex[1],42+dy)],BODY)
            set_px(f,[(ex[0],42+dy),(ex[1],42+dy)],OUTLINE)
    if mouth:  # mouth=개구 크기 px(세로)
        my=48+dy
        for i in range(mouth):
            set_px(f,[(x,my+i) for x in range(cx0,cx1)], DARK)
        # 아래턱 크림 라인
        set_px(f,[(x,my+mouth) for x in range(cx0-1,cx1+1)], CREAM_D)
    if tongue:
        set_px(f,[(x,49+dy) for x in range(cx0+1,cx1-1)], CREAM_D)
        set_px(f,[(x,50+dy) for x in range(cx0+1,cx1-1)], CREAM)

def m_eat(frames, stills, fw):
    s=stills['south']; out=[]
    # 머리 숙임 + 씹기(턱 1px 토글). 6프레임 루프.
    plan=[(1,0),(2,0),(2,1),(2,0),(2,1),(1,0)]
    for dy,chew in plan:
        f=s.copy(); _bow_head(f, dy, mouth=(1+chew))
        out.append(snap(f))
    return out

def m_drink(frames, stills, fw):
    s=stills['south']; out=[]
    plan=[(3,False),(4,True),(4,True),(3,False)]
    for dy,tg in plan:
        f=s.copy(); _bow_head(f, dy, mouth=1, tongue=tg)
        out.append(snap(f))
    return out

def m_yawn(frames, stills, fw):
    s=stills['south']; out=[]
    # 입 개구 단계 + 정점 hold(눈감김·머리 뒤로) + 닫힘
    plan=[(0,0,False),( -0,2,False),(-0,4,False),(-1,6,True),(0,3,False),(0,0,False)]
    for dy,mo,ec in plan:
        f=s.copy()
        if dy!=0: cut_shift(f, HEAD_S, 0, dy)  # 머리 뒤로(위로) 젖힘
        if mo>0:
            cx0,cx1=MOUTH_CX; my=46+dy
            for i in range(mo): set_px(f,[(x,my+i) for x in range(cx0,cx1)], DARK)
            set_px(f,[(x,my+mo) for x in range(cx0-1,cx1+1)], CREAM_D)
        if ec:
            for ex in [(51,52),(59,60)]:
                set_px(f,[(ex[0],41+dy),(ex[1],41+dy)],BODY)
                set_px(f,[(ex[0],42+dy),(ex[1],42+dy)],OUTLINE)
        out.append(snap(f))
    return out

def m_lick(frames, stills, fw):
    s=stills['south']; out=[]
    # 앞발(오른쪽, 표범 기준 화면 왼쪽 x44~54 y70~78)을 얼굴(입 y49) 쪽으로 들어 핥기.
    paw=(44,71,55,78)
    plan=[(0,0,0),(0,3,-6),(1,4,-9),(1,4,-9),(0,3,-7),(0,0,0)]  # (혀, dx, dy)
    for tongue,pdx,pdy in plan:
        f=s.copy()
        if pdy!=0: cut_shift(f, paw, pdx, pdy)          # 앞발 위+안쪽으로(얼굴로)
        if tongue: set_px(f,[(x,50) for x in range(52,56)], CREAM_D)  # 혀 살짝
        out.append(snap(f))
    return out

def m_run(frames, stills, fw):
    # walk 8프레임 기반 rotary gallop 근사(가이드 §2 run): 몸통(다리 위 y29~60)을 프레임별 세로 bob해
    # bounding 느낌을 준다. 신전공중(f2)·수축공중(f6)에서 크게 올림. 다리는 walk 것 유지(발 baseline 고정),
    # 위로 올릴 때 생기는 몸통-다리 틈은 fill(경계행 복제)로 메움. 머리(우측)만 살짝 앞으로 기울여 질주감.
    # 몸통 전체(다리 위)를 세로 bob → bounding. 가로 lean은 세로 틈을 만들어 제거(§3 아웃라인 유지).
    # 다리는 walk 것을 유지하되 fps 12로 빠르게 재생돼 질주로 읽힌다.
    bob=[0,-1,-2,-1,0,-1,-2,-1]     # 음수=위. gallop 공중 국면(f2·f6)에서 최고
    out=[]
    for i,f0 in enumerate(frames):
        f=f0.copy()
        if bob[i]!=0:
            cut_shift(f, (0,29,fw,60), 0, bob[i], fill=True)
        out.append(snap(f))
    return out

def m_jump(frames, stills, fw):
    e=stills['east']; out=[]
    # east 스틸 1장 → 제자리 hop 6f: 웅크림(몸통 낮춤) → 도약 → 체공(전체 위) → 착지 → 회복. once.
    body=(4,29,90,62)
    def crouch(dy):
        f=e.copy(); cut_shift(f, body, 0, dy, fill=True); return snap(f)
    def airborne(dy):
        f=e.copy()
        # 전체를 위로(발도 뜸) + 다리 살짝 모음(하단을 위로 당김)
        whole=f.crop((0,0,fw,fw)); g=blank(fw); paste_over(g, whole, 0, dy); return snap(g)
    out=[crouch(3), crouch(4), crouch(-1), airborne(-9), crouch(3), crouch(1)]
    return out

BUILDERS={'idle':m_idle,'sit':m_sit,'belly':m_belly,'eat':m_eat,'drink':m_drink,
          'run':m_run,'jump':m_jump,'yawn':m_yawn,'lick':m_lick}
CLIP_FRAMES={'idle':4,'sit':4,'belly':4,'eat':6,'drink':4,'run':8,'jump':6,'yawn':6,'lick':6}

def build(pid, species='cat', write=False, only=None):
    frames, stills, fw = load_frames(pid, species)
    d=pet_dir(pid,species)
    made={}
    for clip,fn in BUILDERS.items():
        if only and clip not in only: continue
        fr=fn(frames, stills, fw)
        made[clip]=fr
        if write:
            strip(fr).save(os.path.join(d, clip+'.png'))
            print('wrote', os.path.join(d, clip+'.png'), 'frames=', len(fr))
    return made, frames, stills, fw

def contact_sheet(made, frames, stills, fw, path, bg):
    Z=4; pad=6; lab=14
    rows=[('walk',frames)]+[(k,made[k]) for k in ['idle','sit','belly','eat','drink','run','jump','yawn','lick'] if k in made]
    maxn=max(len(r[1]) for r in rows)
    W=pad+ (fw*Z+pad)*maxn + 60
    H=pad+ (fw*Z+pad+lab)*len(rows)
    cv=Image.new('RGBA',(W,H),bg)
    from PIL import ImageDraw
    dr=ImageDraw.Draw(cv)
    for r,(name,fl) in enumerate(rows):
        y=pad+r*(fw*Z+pad+lab)
        dr.text((2,y+fw*Z//2), name, fill=(255,255,255,255) if bg[0]<128 else (0,0,0,255))
        for i,f in enumerate(fl):
            cv.alpha_composite(f.resize((fw*Z,fw*Z),Image.NEAREST),(60+i*(fw*Z+pad),y))
    cv.save(path); print('saved', path)

if __name__=='__main__':
    pid=sys.argv[1] if len(sys.argv)>1 else 'cat_leopard'
    write='--write' in sys.argv
    only=None
    for a in sys.argv:
        if a.startswith('--only='): only=a.split('=',1)[1].split(',')
    made, frames, stills, fw = build(pid, 'cat', write=write, only=only)
    OUT=r"C:\Users\user\AppData\Local\Temp\claude\C--gglee-gglee-eggarden\eab3a37a-bdbf-49dc-afd6-8d874aa35951\scratchpad"
    contact_sheet(made, frames, stills, fw, os.path.join(OUT,'motion_light.png'), (238,238,242,255))
    contact_sheet(made, frames, stills, fw, os.path.join(OUT,'motion_dark.png'), (26,28,34,255))
