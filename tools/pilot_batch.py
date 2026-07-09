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

def auto_cfg(pid, species, src):
    bb = src.getbbox(); x0,y0,x1,y1 = bb
    h = y1 - y0
    cx = round((x0 + x1 - 1) / 2)
    R = lambda f: int(round(y0 + f*h))
    return dict(species=species, cls='XS',
        style=('dog' if species=='dog' else 'cat'),
        foot=y1-1, mcx=cx, small_y=R(0.42), wide_y=R(0.42),
        # 눈 박스는 easy-5(idle/sit/belly/eat/drink)에서 미사용 — yawn/angry 확장 시 실측 교체
        eyeL=(cx-3,R(0.27),cx-2,R(0.32)), eyeR=(cx+2,R(0.27),cx+3,R(0.32)),
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
