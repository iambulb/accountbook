#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
펫 추가 파이프라인 — 단일 소스 tools/pets.json → 에셋·코드·문서 자동 생성.

사용법:
  python tools/build_pets.py            # 새 zip 인제스트 + 에셋 생성 + 코드/문서 재생성
  python tools/build_pets.py --force    # 에셋(walk.png+4방향) 강제 재생성
  python tools/build_pets.py --check    # 생성 결과가 현재 파일과 다르면 종료코드 1(수정 안 함)

흐름(펫 추가):
  1) public/assets/pets/_zips/ 에 zip 넣기
  2) python tools/build_pets.py  → 에셋 생성 + tools/pets.json 에 stub 추가, "확정 필요" 출력
  3) tools/pets.json 에서 그 항목 name·tier(·desc) 확정
  4) python tools/build_pets.py  → cats.js·sw.js·문서 자동 갱신
  5) 커밋

코드젠은 파일 안의 @gen 마커 사이만 교체한다(그 밖은 손대지 않음).
"""
import io, json, os, re, sys, zipfile
try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")   # Windows cp949 콘솔에서 이모지 print 크래시 방지
except Exception: pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def P(*a): return os.path.join(ROOT, *a)

REG_PATH   = P("tools", "pets.json")
ZIP_DIR    = P("public", "assets", "pets", "_zips")
PETS_DIR   = P("public", "assets", "pets")
CATS_JS    = P("public", "js", "cats.js")
CATS_GACHA_JS = P("public", "js", "cats.gacha.js")   # @gen:pet-tier 마커(cats.js 6분할 Phase 5 후 이 파일로 이동). catalog·sprites 는 cats.js.
SW_JS      = P("public", "sw.js")
DOC_PIPE   = P("docs", "pet-asset-pipeline.md")
DOC_FEAT   = P("docs", "features.md")
DOC_LIST   = P("docs", "pet-list.md")
DOC_CHANGE = P("docs", "CHANGELOG.md")

FORCE = "--force" in sys.argv
CHECK = "--check" in sys.argv

TIER_KO = {"normal":"일반","uncommon":"고급","rare":"희귀","epic":"특별","legend":"전설","limited":"한정"}

# ---------- 유틸 ----------
def read(path):
    with open(path, "r", encoding="utf-8") as f: return f.read()
def write(path, text):
    with open(path, "w", encoding="utf-8", newline="\n") as f: f.write(text)

def load_reg():
    reg = json.loads(read(REG_PATH))
    reg.setdefault("pets", []); reg.setdefault("ignoreZips", [])
    reg.setdefault("tierPrice", {"normal":50,"uncommon":100,"rare":200,"epic":400,"legend":800,"limited":1500})
    reg.setdefault("speciesLabel", {"cat":"고양이","dog":"강아지","rabbit":"토끼"})
    return reg

def save_reg(reg):
    # pets 배열은 한 항목 한 줄로 보기 좋게 직렬화
    def petline(p):
        keys = ["id","species","name","tier","scale","desc","zip","frontWalk","frames","clips","clipDirs"]
        parts = [f'"{k}": {json.dumps(p.get(k), ensure_ascii=False)}' for k in keys if k in p]
        return "    { " + ", ".join(parts) + " }"
    body = ",\n".join(petline(p) for p in reg["pets"])
    out = {k:v for k,v in reg.items() if k not in ("pets",)}
    head = json.dumps(out, ensure_ascii=False, indent=2)
    head = head[:-2] + ',\n  "pets": [\n' + body + "\n  ]\n}\n"  # 마지막 } 앞에 pets 삽입
    write(REG_PATH, head)

def price_of(reg, pet): return reg["tierPrice"].get(pet["tier"], 50)

# ---------- zip → 에셋 ----------
def _frame_no(n):
    m = re.search(r"frame_(\d+)", n)
    return int(m.group(1)) if m else 0
def zip_frames(zf, subpath):
    ns = [n for n in zf.namelist() if n.endswith(".png") and subpath in n]
    return sorted(ns, key=_frame_no)   # 프레임 번호 자연 정렬(frame_10<frame_2 어긋남 방지 — 8장↑ 대비)

def has_east(zf):
    return len(zip_frames(zf, "/Walk/east/frame_")) >= 6

# ---------- 🎞️ 가변 모션 인제스트(2026-07-10) — zip의 animations/<모션>/<방향>/frame_*.png 를 클립 시트로 ----------
# 펫마다 담겨 오는 모션이 제각각(개과=idle·walk·bark, 고양이과=idle·jump·run·belly_idle·walk …)이라
# 폴더명을 정규화해 앱 클립 키로 매핑하고, 방향은 PET_CLIPS 기대 방향(CLIP_DIR_DEFAULT) 우선·없으면 있는 방향을 쓰되
# 기본과 다르면 pets.json clipDirs 에 오버라이드를 기록한다(엔진 clipDir(id,k)가 읽음).
# Walk 는 기존 걷기 시트 경로(gen_assets)로 처리하므로 여기서 제외.
MOTION_MAP = {  # 정규화된 폴더명(소문자, 공백/하이픈→_) → 클립 키
    "idle":"idle", "sit":"sit", "seated_idle":"sit", "sitting":"sit",
    "seated_on_belly_idle":"belly", "belly_idle":"belly", "lying":"belly", "lie_down":"belly", "loaf":"belly",
    "run":"run", "running":"run", "jump":"jump", "hop":"jump",
    "bark":"bark", "barking":"bark", "howl":"bark",
    "sleep":"sleep", "sleeping":"sleep",
    "eat":"eat", "eating":"eat", "drink":"drink", "drinking":"drink",
    "yawn":"yawn", "angry":"angry", "hiss":"angry", "growl":"angry",
    "stretch":"stretch", "scratch":"scratch", "wiggle":"wiggle",
    "knead":"knead", "paw":"paw", "attack":"paw",
}
CLIP_DIR_DEFAULT = {  # cats.js PET_CLIPS 의 dir 과 반드시 일치(단일 소스는 코드 — 어긋나면 furn-assets류 정합 깨짐)
    "idle":"south","sit":"south","belly":"south","eat":"south","drink":"south","yawn":"south","angry":"south",
    "knead":"south","paw":"south","eyetrack":"south","bark":"south",
    "run":"east","jump":"east","sleep":"east","stretch":"east","scratch":"east","wiggle":"east",
}
def _norm_motion(name):
    return re.sub(r"[^a-z_]", "", name.strip().lower().replace(" ", "_").replace("-", "_"))
def _sprite_outlined_img(im):
    """실루엣 경계 픽셀의 45%+가 어두우면 외곽선 스타일 — 모션과 rotations 의 스타일 일치 검사용(불일치=혼입 방지)."""
    px = im.load(); w, h = im.size; edge = 0; dark = 0
    for y in range(h):
        for x in range(w):
            c = px[x, y]
            if c[3] < 128: continue
            if any(not (0 <= x+dx < w and 0 <= y+dy < h) or px[x+dx, y+dy][3] < 128 for dx, dy in ((1,0),(-1,0),(0,1),(0,-1))):
                edge += 1
                if sum(c[:3]) < 230: dark += 1
    return edge > 0 and dark / edge >= 0.45
def gen_motion_clips(pet, zf, out):
    """zip animations/* → <clip>.png 가로 스트립 + pet['clips'/'clipDirs'] 기록. 반환: 채택/스킵 로그."""
    from PIL import Image
    # zip 안 모션 인벤토리: {정규화모션: {방향: [프레임…]}}
    inv = {}
    for n in zf.namelist():
        m = re.search(r"animations/([^/]+)/([a-z]+)/frame_\d+\.png$", n)
        if not m: continue
        mot, d = _norm_motion(m.group(1)), m.group(2)
        inv.setdefault(mot, {}).setdefault(d, []).append(n)
    if not inv: return
    # 기준 스타일 = rotations/south(정면 스틸)
    base_out = None
    try:
        south = [n for n in zf.namelist() if n.endswith("/rotations/south.png")]
        if south: base_out = _sprite_outlined_img(Image.open(io.BytesIO(zf.read(south[0]))).convert("RGBA"))
    except Exception: pass
    pet.setdefault("clips", {}); pet.setdefault("clipDirs", {})
    for mot, dirs in sorted(inv.items()):
        if mot in ("walk", "walking"): continue   # 걷기는 gen_assets 가 처리(필수 시트)
        clip = MOTION_MAP.get(mot)
        if not clip:
            print(f"  ⚠ {pet['id']}: 미지의 모션 '{mot}' — MOTION_MAP 에 매핑 추가 필요(이번엔 스킵)"); continue
        want = CLIP_DIR_DEFAULT.get(clip, "south")
        d = want if want in dirs else (sorted(dirs)[0])
        frames = sorted(dirs[d], key=_frame_no)[:12]
        if len(frames) < 2:
            print(f"  ⚠ {pet['id']}: {mot}/{d} 프레임 부족({len(frames)}) — 스킵"); continue
        f0 = Image.open(io.BytesIO(zf.read(frames[0]))).convert("RGBA")
        if base_out is not None and _sprite_outlined_img(f0) != base_out:
            print(f"  ⚠ {pet['id']}: '{mot}' 스타일 불일치(외곽선 {'있음' if base_out is False else '없음'}쪽과 다름) — 스킵(규칙 생성으로 대체 권장)"); continue
        W, H = f0.size
        sheet = Image.new("RGBA", (W*len(frames), H), (0,0,0,0))
        for i, n in enumerate(frames):
            sheet.paste(Image.open(io.BytesIO(zf.read(n))).convert("RGBA"), (i*W, 0))
        sheet.save(os.path.join(out, clip + ".png"))
        pet["clips"][clip] = len(frames)
        if d != want: pet["clipDirs"][clip] = d
        else: pet["clipDirs"].pop(clip, None)
        print(f"  🎞️ {pet['id']}: {mot}/{d} → {clip}.png ({len(frames)}f{'' if d==want else ' · dir오버라이드 '+d})")
    if not pet["clipDirs"]: pet.pop("clipDirs", None)
    if not pet["clips"]: pet.pop("clips", None)

def gen_assets(pet):
    """zip에서 walk.png(288×48)+4방향 생성. east 없으면 south로 walk 구성 후 frontWalk 표시."""
    if not pet.get("zip"):
        # 정적 승격 항목: 에셋(PNG)이 이미 배치돼 있어 zip 없이 코드젠만 함(--force여도 생성 건너뜀).
        print(f"  · {pet['id']}: zip 없음(정적 승격) → 에셋 생성 건너뜀"); return False
    try:
        from PIL import Image
    except ImportError:
        sys.exit("PIL(Pillow) 필요: pip install pillow")
    zpath = os.path.join(ZIP_DIR, pet["zip"])
    if not os.path.exists(zpath):
        print(f"  ! zip 없음: {pet['zip']} (에셋 생성 건너뜀)"); return False
    out = os.path.join(PETS_DIR, pet["species"], pet["id"]); os.makedirs(out, exist_ok=True)   # 종별 하위폴더
    zf = zipfile.ZipFile(zpath); frontwalk = False
    east = zip_frames(zf, "/Walk/east/frame_")
    if len(east) < 6:
        south = zip_frames(zf, "/Walk/south/frame_") or zip_frames(zf, "/south/frame_")
        if len(south) >= 6:
            east = south; frontwalk = True
            print(f"  ⚠ {pet['id']}: Walk/east 없음 → south로 walk 구성, frontWalk:true")
        else:
            print(f"  ! {pet['id']}: 걷기 프레임 부족(east/south 6장 없음)"); return False
    nf = min(len(east), 12)   # 걷기 장수를 zip 그대로(6·8 등, 최대 12) — 고등급 8프레임 등 부드러운 모션
    f0 = Image.open(io.BytesIO(zf.read(east[0]))).convert("RGBA"); W, H = f0.size
    sheet = Image.new("RGBA", (W*nf, H), (0,0,0,0))
    for i, n in enumerate(east[:nf]):
        sheet.paste(Image.open(io.BytesIO(zf.read(n))).convert("RGBA"), (i*W, 0))
    sheet.save(os.path.join(out, "walk.png"))
    rot = [n for n in zf.namelist() if "/rotations/" in n and n.endswith(".png")]
    for d in ("south","north","east","west"):
        m = [n for n in rot if n.endswith("/"+d+".png")]
        if m: Image.open(io.BytesIO(zf.read(m[0]))).convert("RGBA").save(os.path.join(out, d+".png"))
        else: print(f"  ! {pet['id']}: rotations/{d}.png 없음")
    pet["frontWalk"] = frontwalk
    pet["frames"] = nf   # 걷기 프레임 수 기록(gen_sprites·pets.json 반영). 없으면 코드젠에서 6 기본.
    gen_motion_clips(pet, zf, out)   # 🎞️ 가변 모션 인제스트 — zip animations/* → <clip>.png + clips/clipDirs
    return True

def slugify(zipname):
    s = zipname.lower().replace(".zip","")
    for pre in ("simple_pixel_art_","chibi_pixel_art_","hibi_pixel_art_","pixel_art_"):
        if s.startswith(pre): s = s[len(pre):]
    s = s.replace("cat_","").replace("_cat","")
    tok = re.findall(r"[a-z]+", s)
    base = "cat_" + (tok[0] if tok else "new")
    return base

# 새끼(아기)면 기본 크기 배율 0.5. zip 파일명에서 아기 키워드 감지(이후 개발자가 pets.json에서 직접 수정하면 그 값이 우선).
_BABY_KW = ("kitten","baby","cub","puppy","pup","chick","calf","foal","joey","kit","fawn","piglet","duckling")
def is_baby(zipname):
    toks = re.findall(r"[a-z]+", zipname.lower())
    return any(k in toks for k in _BABY_KW)

# ---------- 코드젠 ----------
def replace_between(text, name, new_block):
    """마커 사이만 교체. HTML주석형(<!--@gen:NAME-->…<!--@gen:end-->, 인라인/블록 공용)과
    JS //형(// @gen:NAME … // @gen:end) 둘 다 지원. new_block은 호출자가 개행 포함해 넘김."""
    # 1) HTML 주석 마커(가장 가까운 @gen:end까지, non-greedy)
    h = re.compile(r"(<!--\s*@gen:"+re.escape(name)+r"\b[^>]*-->)(.*?)(<!--\s*@gen:end\s*-->)", re.DOTALL)
    m = h.search(text)
    if m:
        return text[:m.start()] + m.group(1) + new_block + m.group(3) + text[m.end():]
    # 2) JS // 마커(블록)
    j = re.compile(r"(^[ \t]*//\s*@gen:"+re.escape(name)+r"\b[^\n]*\n)(.*?)(^[ \t]*//\s*@gen:end\b[^\n]*$)",
                   re.DOTALL|re.MULTILINE)
    m = j.search(text)
    if m:
        return text[:m.start()] + m.group(1) + new_block + "\n" + m.group(3) + text[m.end():]
    raise SystemExit(f"마커 @gen:{name} 를 찾지 못함")

def gen_catalog(reg):
    lines = []
    for i,p in enumerate(reg["pets"]):
        comma = "" if i==len(reg["pets"])-1 else ","
        lines.append(f"      {{ id:'{p['id']}', species:'{p['species']}', name:'{p['name']}', "
                     f"price:{price_of(reg,p)}, desc:'{p['desc']}' }}{comma}")
    return "    const PET_CATALOG = [\n" + "\n".join(lines) + "\n    ];"

def gen_sprites(reg):
    lines = []
    for i,p in enumerate(reg["pets"]):
        comma = "" if i==len(reg["pets"])-1 else ","
        fw = ", frontWalk:true" if p.get("frontWalk") else ""
        sc = p.get("scale")
        scStr = f", scale:{sc}" if (sc and float(sc)!=1) else ""
        # 🎞️ 다중 모션 클립(선택) — pets.json 의 clips:{클립키:프레임수}. 정적 펫은 같은 폴더의 <클립키>.png 재생.
        clips = p.get("clips")
        clipsStr = ""
        if clips:
            inner = ", ".join(f"{k}:{int(v)}" for k,v in clips.items())
            clipsStr = f", clips:{{ {inner} }}"
        # 🧭 펫별 클립 방향 오버라이드(선택) — zip 이 기본 방향(CLIP_DIR_DEFAULT)과 다른 방향으로 준 모션(예: 구미호 belly=east).
        #   엔진 clipDir(id,k) = PET_SPRITES[id].clipDirs?.[k] || PET_CLIPS[k].dir.
        cds = p.get("clipDirs")
        cdStr = ""
        if cds:
            inner = ", ".join(f"{k}:'{v}'" for k,v in cds.items())
            cdStr = f", clipDirs:{{ {inner} }}"
        lines.append(f"      {p['id']}:{{ walk:'assets/pets/{p['species']}/{p['id']}/walk.png', frames:{p.get('frames',6)}, stills:true{scStr}{fw}{clipsStr}{cdStr} }}{comma}")
    return "    const PET_SPRITES = {\n" + "\n".join(lines) + "\n    };"

def gen_tier(reg):
    inner = ", ".join(f"{p['id']}:'{p['tier']}'" for p in reg["pets"])
    return "    const CAT_TIER = { " + inner + " };"

def gen_sw_shell(reg):
    out = []
    for p in reg["pets"]:
        for f in ("walk","south","north","east","west"):
            out.append(f"  './assets/pets/{p['species']}/{p['id']}/{f}.png',")
        for k in (p.get("clips") or {}):   # 🎞️ 다중 모션 클립 시트도 앱 셸에 프리캐시
            out.append(f"  './assets/pets/{p['species']}/{p['id']}/{k}.png',")
    return "\n".join(out)

def gen_names(reg): return "·".join(p["name"] for p in reg["pets"])

def gen_pet_list_table(reg):
    rows = []
    for i,p in enumerate(reg["pets"],1):
        sc = float(p.get("scale") or 1)
        rows.append(f"| {i} | {p['name']} | `{p['id']}` | {reg['speciesLabel'].get(p['species'],p['species'])} | "
                    f"{sc:g}× | {TIER_KO.get(p['tier'],p['tier'])} | {price_of(reg,p)} | `public/assets/pets/{p['species']}/{p['id']}/` | "
                    f"PNG 스프라이트 {p.get('frames',6)}프레임{'(정면걷기)' if p.get('frontWalk') else ''} | {p['desc']} |")
    return "\n".join(rows)

def gen_pipe_idtable(reg):
    rows = []
    for p in reg["pets"]:
        note = "Walk/east 옆걷기" + (" 없음→정면(frontWalk)" if p.get("frontWalk") else " 정상")
        zipname = p.get("zip") or "(정적 승격)"
        rows.append(f"| {zipname} | `{p['id']}` | {p['name']} | {note} |")
    return "\n".join(rows)

# ---------- 메인 ----------
def main():
    reg = load_reg()
    known_zips = {p.get("zip") for p in reg["pets"]} | set(reg["ignoreZips"])
    existing_ids = {p["id"] for p in reg["pets"]}
    newly, created = [], []

    if not CHECK:
        # 1) 새 zip 인제스트
        for z in sorted(os.listdir(ZIP_DIR)) if os.path.isdir(ZIP_DIR) else []:
            if not z.endswith(".zip") or z in known_zips: continue
            sid = slugify(z); n=sid; k=2
            while n in existing_ids: n=f"{sid}{k}"; k+=1
            baby = is_baby(z); sc = 0.5 if baby else 1
            stub = {"id":n,"species":"cat","name":"(미정)","tier":"normal","scale":sc,"desc":"","zip":z,"frontWalk":False}
            reg["pets"].append(stub); existing_ids.add(n); newly.append(stub)
            print(f"＋ 새 zip 인제스트: {z} → id 제안 '{n}'"+(" · 새끼 감지 → scale 0.5" if baby else "")+" (name/tier 확정 필요)")

        # 2) 에셋 생성(없으면; --force면 전부)
        for p in reg["pets"]:
            walk = os.path.join(PETS_DIR, p["species"], p["id"], "walk.png")   # 종별 하위폴더
            missing = not os.path.exists(walk)
            if FORCE or missing:
                if gen_assets(p):
                    if missing or p in newly: created.append(p)
                    print(f"✓ 에셋 생성: {p['id']}")
        save_reg(reg)  # frontWalk 자동값·stub 반영

        # 확정 필요 안내
        todo = [p for p in reg["pets"] if p["name"]=="(미정)" or not p["desc"]]
        if todo:
            print("\n⚠ 확정 필요 — tools/pets.json 에서 아래 항목의 name·tier·desc 를 채우고 다시 실행:")
            for p in todo: print(f"    {p['id']}  (zip: {p['zip']})")
    else:
        todo = []

    # 3) 코드/문서 생성
    targets = {}
    cats = read(CATS_JS)
    cats = replace_between(cats, "pet-catalog", gen_catalog(reg))
    cats = replace_between(cats, "pet-sprites", gen_sprites(reg))
    targets[CATS_JS] = cats
    # @gen:pet-tier 는 cats.js 6분할(Phase 5) 후 cats.gacha.js 로 이동
    gacha = read(CATS_GACHA_JS)
    gacha = replace_between(gacha, "pet-tier", gen_tier(reg))
    targets[CATS_GACHA_JS] = gacha

    sw = read(SW_JS)
    sw = replace_between(sw, "pet-shell", gen_sw_shell(reg))
    targets[SW_JS] = sw  # 버전은 아래에서 처리

    N = len(reg["pets"]); names = gen_names(reg)
    pipe = read(DOC_PIPE)
    pipe = replace_between(pipe, "pet-idtable", "\n"+gen_pipe_idtable(reg)+"\n")
    pipe = replace_between(pipe, "cats-count", str(N))
    targets[DOC_PIPE] = pipe

    feat = read(DOC_FEAT)
    feat = replace_between(feat, "cats-full",  f"{N}종 전부({names})")
    feat = replace_between(feat, "cats-short", f"{N}종({names})")
    targets[DOC_FEAT] = feat

    lst = read(DOC_LIST)
    lst = replace_between(lst, "count", str(N))
    lst = replace_between(lst, "count2", str(N))
    lst = replace_between(lst, "pet-list-table", "\n"+gen_pet_list_table(reg)+"\n")
    targets[DOC_LIST] = lst

    # 버전 상향: sw/cats/문서 중 하나라도 바뀌면(버전줄 제외) bump
    def strip_ver(s): return re.sub(r"eggarden-v[\d.]+", "eggarden-vX", s)
    changed = any(read(f) != t for f,t in targets.items() if f!=SW_JS)
    changed = changed or (strip_ver(read(SW_JS)) != strip_ver(sw)) or bool(created)
    m = re.search(r"eggarden-v(\d+)\.(\d+)\.(\d+)", read(SW_JS))
    cur = m.group(0); newver = cur
    if changed:
        M,mi,pa = int(m.group(1)),int(m.group(2)),int(m.group(3))
        newver = f"eggarden-v{M}.{mi}.{pa+1}"
        sw = sw.replace(cur, newver); targets[SW_JS]=sw

    # CHANGELOG: 이번에 새로 에셋 생성된 펫만 [Unreleased]에 한 줄(중복 방지)
    if created:
        ch = read(DOC_CHANGE)
        fresh = [p for p in created if f"`{p['id']}`" not in ch]
        if fresh:
            names_new = ", ".join(f"{p['name']}(`{p['id']}`)" for p in fresh)
            entry = (f"### 추가 — 🐱 고양이 {names_new} 추가 (총 {N}종)\n"
                     f"- `tools/build_pets.py` 파이프라인으로 스프라이트·카탈로그·문서 자동 생성. `sw.js` `{newver}`.\n\n")
            ch = ch.replace("> 새 변경 사항은 여기에 추가하세요. 릴리스할 때 버전 번호와 날짜를 붙여 아래로 내립니다.\n\n",
                            "> 새 변경 사항은 여기에 추가하세요. 릴리스할 때 버전 번호와 날짜를 붙여 아래로 내립니다.\n\n"+entry, 1)
            targets[DOC_CHANGE] = ch

    # --check: diff만 보고 종료
    diffs = [os.path.relpath(f,ROOT) for f,t in targets.items() if read(f)!=t]
    if CHECK:
        if diffs: print("✗ 최신 아님 — 재생성 필요:", ", ".join(diffs)); sys.exit(1)
        print("✓ 최신(생성 결과 == 현재)"); return

    # 쓰기
    for f,t in targets.items():
        if read(f)!=t: write(f,t); print("· 갱신:", os.path.relpath(f,ROOT))
    if changed: print(f"· CACHE_VERSION → {newver}")
    print(f"\n완료: {N}종. " + ("확정 필요 항목 처리 후 재실행하세요." if todo else "커밋하면 됩니다."))

if __name__ == "__main__":
    main()
