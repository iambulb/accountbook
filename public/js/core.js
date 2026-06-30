// ===== 상태 =====
    const state = {
      uid:null, userName:'', userEmail:'',
      wsId:null, wsMeta:null, memberships:[],   // 현재 워크스페이스, 메타, 내 워크스페이스 목록
      transactions:[], accounts:[], categories:[], savings:[], recurring:[], creditCards:[], subscriptions:[], purposeBooks:[],
      people:[], giftEvents:[], plannedGiftEvents:[],
      settlementPayments:[],   // 정산 송금 완료/취소 기록(Step 9) — per-uid
      loans:[], loanPayments:[],   // 대출/이자 관리 — flat
      wsSettings:{},   // 워크스페이스 공동 설정(기본 공개범위/소유자) — ws/{wsId}/settings
      userPhotos:{},   // uid → 프로필 사진 data URL 캐시(users/{uid}/photo)
      budgets:[],
      month: monthStr(new Date()),
      selectedDate: ymd(new Date()),
      homeView:'calendar',
      memberFilter:'',   // 달력 멤버 칩 필터(기록자 이름) — 그룹 전용
      filter:{ type:'', category:'', account:'', keyword:'' },
      theme: localStorage.getItem('theme') || 'light',
      tab:'calendar'
    };
    let listenersAttached = false;
    let seededAcc = false, seededCat = false, booted = false, migratedAcc = false, migratedCat = false, migratedBudget = false, migratedRec = false;
    let recurringLogKeys = new Set();
    const recv = { tx:false, acc:false, cat:false, rec:false, log:false };
    let deferredPrompt=null;
    // 시트 임시 상태
    let sheetTx = null;     // 편집중 {ownerUid,id} or null
    let sheetType = 'expense';
    let sheetCat = '';

    // ===== 헬퍼 =====
    function won(n){ const v=Number(n||0); return (v<0?'-':'')+'₩'+Math.abs(v).toLocaleString(); }
    function fmtComma(n){ const d=String(n==null?'':n).replace(/[^0-9]/g,''); return d?Number(d).toLocaleString():''; }
    function parseAmount(s){ return Number(String(s==null?'':s).replace(/[^0-9]/g,''))||0; }
    function escapeHtml(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
    function pad2(n){ return String(n).padStart(2,'0'); }
    function monthStr(d){ return d.getFullYear()+'-'+pad2(d.getMonth()+1); }
    function ymd(d){ return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate()); }
    function todayStr(){ return ymd(new Date()); }
    function shiftMonth(m,delta){ const [y,mo]=m.split('-').map(Number); return monthStr(new Date(y,mo-1+delta,1)); }
    function parseDate(s){ const [y,m,d]=String(s).split('T')[0].split('-').map(Number); return new Date(y,(m||1)-1,d||1); }
    function val(id){ const el=document.getElementById(id); return el?el.value:''; }
    function $(id){ return document.getElementById(id); }
    // ===== 워크스페이스 경로 =====
    // 모든 가계부 데이터는 ws/{wsId}/ 아래에 네임스페이스로 분리된다.
    function wsRoot(){ return 'ws/'+state.wsId; }
    function wp(path){ return 'ws/'+state.wsId+'/'+path; }
    function randCode(n){ const ch='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s=''; for(let i=0;i<(n||6);i++) s+=ch[Math.floor(Math.random()*ch.length)]; return s; }
    function budgetColor(p){ return p>=100?'var(--expense)':(p>=90?'#f76707':(p>=80?'#f5a623':'var(--primary)')); }
    function getCat(name){ return state.categories.find(c=>c.name===name); }
    function getAcct(id){ return state.accounts.find(a=>a.id===id); }
    function getCard(id){ return state.creditCards.find(c=>c.id===id); }
    function acctName(id){ const a=getAcct(id); return a?a.name:(id||''); }
    function catIcon(name){ const c=getCat(name); return c?c.icon:'🏷️'; }
    function catColor(name){ const c=getCat(name); return c?c.color:'#8b95a1'; }
    // 거래유형 → 카테고리 그룹(expense/income/null). 'other'(기타)는 양쪽 모두 노출
    function catTypeFor(txType){ if(['expense','prepaid_spend','point_spend'].includes(txType)) return 'expense'; if(['income','refund'].includes(txType)) return 'income'; return null; }
    function pickableCats(wantType){ return state.categories.filter(c=>canSee(c) && c.isActive!==false && (c.type===wantType||c.type==='other')).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0)); }

    function toast(msg, err){
      const t=$('toast'); t.textContent=msg; t.className='toast on'+(err?' err':'');
      clearTimeout(t._t); t._t=setTimeout(()=>{ t.className='toast'; }, 2200);
    }

    // ===== 시트 =====
    function openSheet(title, html){
      const sh=$('sheet');
      if(!sh.classList.contains('on')) sh._returnFocus=document.activeElement;  // 닫을 때 돌아갈 포커스
      $('sheetTitle').textContent=title;
      $('sheetBody').innerHTML=html;
      $('overlay').classList.add('on');
      sh.classList.add('on');
      // 다이얼로그로 포커스 이동(모바일 키보드 안 뜨도록 입력칸이 아닌 시트 컨테이너로)
      setTimeout(()=>{ try{ sh.focus(); }catch(e){} }, 30);
    }
    function closeSheet(){
      const sh=$('sheet');
      $('overlay').classList.remove('on');
      sh.classList.remove('on');
      const rf=sh._returnFocus; sh._returnFocus=null;
      if(rf && rf.focus){ try{ rf.focus(); }catch(e){} }
    }
    function confirmSheet(msg, onYes){
      openSheet('확인',
        '<p style="padding:6px 2px 22px;font-size:15px;">'+escapeHtml(msg)+'</p>'+
        '<div class="form-2"><button class="btn ghost" onclick="closeSheet()">취소</button>'+
        '<button class="btn danger" id="confirmYes">삭제</button></div>');
      $('confirmYes').onclick=()=>{ closeSheet(); onYes(); };
    }

    // ===== 테마 =====
    function applyTheme(){
      document.documentElement.setAttribute('data-theme', state.theme);
      const b=$('themeBtn'); if(b) b.textContent = state.theme==='dark'?'☀️':'🌙';
      const meta=document.querySelector('meta[name=theme-color]'); if(meta) meta.content = state.theme==='dark'?'#16181d':'#3182f6';
    }
    function toggleTheme(){ state.theme = state.theme==='dark'?'light':'dark'; localStorage.setItem('theme', state.theme); applyTheme(); if(state.tab==='stats') renderStats(); }

    // ===== 인증 =====
    let authMode='login';
    let pendingSignupName='';
    function setAuthMode(m){
      authMode=m;
      $('modeLogin').classList.toggle('on', m==='login');
      $('modeSignup').classList.toggle('on', m==='signup');
      $('nameField').style.display = m==='signup'?'block':'none';
      $('authSubmit').textContent = m==='signup'?'회원가입':'로그인';
      $('authDesc').textContent = m==='signup'?'계정을 만들고 나만의 가계부를 시작하세요':'로그인하고 내 가계부를 시작하세요';
    }
    function submitAuth(){ authMode==='signup'?signup():login(); }
    function signup(){
      const name=val('authName').trim(), email=val('authEmail').trim(), pw=val('authPassword');
      if(!name||!email||!pw){ toast('이름·이메일·비밀번호를 모두 입력하세요', true); return; }
      if(pw.length<6){ toast('비밀번호는 6자 이상이어야 합니다', true); return; }
      pendingSignupName=name;
      auth.createUserWithEmailAndPassword(email,pw)
        .then(()=>db.ref('users/'+auth.currentUser.uid).update({ name, email, createdAt:new Date().toISOString() }))
        .catch(e=>toast(e.message, true));
    }
    function login(){
      const email=val('authEmail').trim(), pw=val('authPassword');
      if(!email||!pw){ toast('이메일과 비밀번호를 입력하세요', true); return; }
      auth.signInWithEmailAndPassword(email,pw).catch(e=>toast(e.message, true));
    }
    function logout(){ confirmSheet('로그아웃하시겠습니까?', ()=>auth.signOut()); }

    auth.onAuthStateChanged(user=>{
      if(user){ enterApp(user); }
      else {
        detachListeners();
        state.uid=null; state.userName=''; state.userEmail='';
        state.wsId=null; state.wsMeta=null; state.memberships=[];
        $('authScreen').style.display='flex';
        $('app').style.display='none';
      }
    });

    // ===== 워크스페이스 부트스트랩 =====
    async function enterApp(user){
      state.uid=user.uid; state.userEmail=user.email||'';
      try{
        const s=await db.ref('users/'+user.uid).once('value');
        let u=s.val()||{};
        if(!u.name){
          u.name = pendingSignupName || (user.email||'사용자').split('@')[0];
          await db.ref('users/'+user.uid).update({ name:u.name, email:user.email||'', createdAt:u.createdAt||new Date().toISOString() });
        }
        state.userName=u.name;
        state.userPhotos[state.uid]=u.photo||'';
        $('authScreen').style.display='none';
        $('app').style.display='flex';
        await migrateLegacyIfNeeded();
        await loadMyWorkspaces();
        if(!state.memberships.length){ await createPersonalWorkspace(true); await loadMyWorkspaces(); }
        let active=u.activeWs;
        if(!active || !state.memberships.some(w=>w.id===active)) active=state.memberships[0].id;
        await switchWorkspace(active, true);
      }catch(e){ toast(e.message||'로그인 처리 중 오류', true); }
    }

    // 구버전(전역 단일 트리) 데이터를 1회 그룹 워크스페이스로 이전. 멱등(migrationV3 플래그).
    async function migrateLegacyIfNeeded(){
      const flag=await db.ref('migrationV3').once('value');
      if(flag.exists()) return;
      const accSnap=await db.ref('accounts').once('value');     // 루트 전역 계좌 = 레거시 데이터 신호
      if(!accSnap.exists()) return;                              // 신규 환경 → 이전 불필요
      const claim=await db.ref('migrationV3').transaction(cur=> cur? undefined : { by:state.uid, at:new Date().toISOString() });
      if(!claim.committed) return;                               // 다른 클라이언트가 이미 처리 중/완료

      const users=(await db.ref('users').once('value')).val()||{};
      const memberUids=Object.keys(users);
      if(!memberUids.includes(state.uid)) memberUids.push(state.uid);
      const wsId='legacy_'+(memberUids[0]||state.uid).slice(0,10);
      const code=randCode(6);
      const now=new Date().toISOString();
      const members={};
      memberUids.forEach(uid=>{ members[uid]={ name:(users[uid]&&users[uid].name)||'멤버', role: uid===state.uid?'owner':'member', joinedAt:now }; });
      members[state.uid].role='owner';

      // 1단계: 멤버십/코드/인덱스 먼저 커밋(이후 ws 쓰기 권한 통과)
      const upd1={};
      upd1['workspaces/'+wsId]={ name:'공유 가계부', type:'group', code, ownerUid:state.uid, createdAt:now, members };
      upd1['codes/'+code]=wsId;
      memberUids.forEach(uid=>{ upd1['users/'+uid+'/ws/'+wsId]=true; });
      await db.ref().update(upd1);

      // 2단계: 기존 노드들을 ws/{wsId} 아래로 복사
      const NODES=['accounts','creditCards','categories','budgets','subscriptions','purposeBooks',
        'people','giftEvents','plannedGiftEvents','transactions','savings','recurring','recurringLogs','fixedExpenses'];
      const upd2={};
      for(const node of NODES){
        const s=await db.ref(node).once('value');
        if(s.exists()) upd2['ws/'+wsId+'/'+node]=s.val();
      }
      if(Object.keys(upd2).length) await db.ref().update(upd2);
      toast('기존 데이터를 "공유 가계부" 그룹으로 옮겼어요');
    }

    async function loadMyWorkspaces(){
      const s=await db.ref('users/'+state.uid+'/ws').once('value');
      const ids=Object.keys(s.val()||{});
      const metas=await Promise.all(ids.map(id=>
        db.ref('workspaces/'+id).once('value').then(ms=>{ const m=ms.val(); return m?Object.assign({id},m):null; })));
      state.memberships=metas.filter(Boolean).sort((a,b)=>
        (a.type===b.type? (a.createdAt||'').localeCompare(b.createdAt||'') : (a.type==='personal'?-1:1)));
    }

    async function createPersonalWorkspace(silent){
      const wsId='ws_'+state.uid;
      const now=new Date().toISOString();
      const upd={};
      upd['workspaces/'+wsId]={ name:'내 가계부', type:'personal', ownerUid:state.uid, createdAt:now,
        members:{ [state.uid]:{ name:state.userName, role:'owner', joinedAt:now } } };
      upd['users/'+state.uid+'/ws/'+wsId]=true;
      await db.ref().update(upd);
      if(!silent) toast('개인 가계부를 만들었어요');
      return wsId;
    }

    async function createGroupWorkspace(name){
      const wsId='grp_'+state.uid.slice(0,6)+'_'+randCode(5).toLowerCase();
      const code=randCode(6);
      const now=new Date().toISOString();
      const upd={};
      upd['workspaces/'+wsId]={ name:name||'우리 가계부', type:'group', code, ownerUid:state.uid, createdAt:now,
        members:{ [state.uid]:{ name:state.userName, role:'owner', joinedAt:now } } };
      upd['codes/'+code]=wsId;
      upd['users/'+state.uid+'/ws/'+wsId]=true;
      await db.ref().update(upd);
      return { wsId, code };
    }

    async function joinByCode(code){
      code=(code||'').trim().toUpperCase();
      if(!code){ toast('그룹 코드를 입력하세요', true); return; }
      const cs=await db.ref('codes/'+code).once('value');
      const wsId=cs.val();
      if(!wsId){ toast('존재하지 않는 코드예요', true); return; }
      const ws=(await db.ref('workspaces/'+wsId).once('value')).val();
      if(!ws){ toast('그룹을 찾을 수 없어요', true); return; }
      if(ws.members && ws.members[state.uid]){ toast('이미 참여 중인 그룹이에요'); await loadMyWorkspaces(); await switchWorkspace(wsId); return true; }
      const now=new Date().toISOString();
      const upd={};
      upd['workspaces/'+wsId+'/members/'+state.uid]={ name:state.userName, role:'member', joinedAt:now };
      upd['users/'+state.uid+'/ws/'+wsId]=true;
      await db.ref().update(upd);
      toast('"'+(ws.name||'그룹')+'"에 참여했어요');
      await loadMyWorkspaces();
      await switchWorkspace(wsId);
      return true;
    }

    async function leaveWorkspace(wsId){
      const ws=state.memberships.find(w=>w.id===wsId); if(!ws) return;
      const isOwner = ws.ownerUid===state.uid;
      const memberCount = Object.keys(ws.members||{}).length;
      const upd={};
      upd['users/'+state.uid+'/ws/'+wsId]=null;
      // 마지막 멤버면 워크스페이스/코드까지 정리, 아니면 멤버에서만 제거
      if(memberCount<=1){ upd['workspaces/'+wsId]=null; if(ws.code) upd['codes/'+ws.code]=null; }
      else { upd['workspaces/'+wsId+'/members/'+state.uid]=null; }
      await db.ref().update(upd);
      await loadMyWorkspaces();
      if(!state.memberships.length){ await createPersonalWorkspace(true); await loadMyWorkspaces(); }
      await switchWorkspace(state.memberships[0].id);
      toast('그룹에서 나갔어요');
    }

    async function switchWorkspace(wsId, initial){
      if(!wsId) return;
      let meta=state.memberships.find(w=>w.id===wsId);
      if(!meta){ const m=(await db.ref('workspaces/'+wsId).once('value')).val(); meta=m?Object.assign({id:wsId},m):{id:wsId,name:'가계부',type:'personal'}; }
      detachListeners();
      resetWorkspaceState();
      state.wsId=wsId; state.wsMeta=meta;
      await db.ref('users/'+state.uid+'/activeWs').set(wsId);
      setupListeners();
      updateWorkspaceChip();
      go('calendar');
      loadMemberPhotos();   // 멤버 프로필 사진 캐시 채우기(비동기, 끝나면 rerender)
      if(!initial) toast((meta.name||'가계부')+'(으)로 전환했어요');
    }
    // 현재 워크스페이스 멤버들의 프로필 사진을 users/{uid}/photo 에서 읽어 캐시
    async function loadMemberPhotos(){
      const m=(state.wsMeta&&state.wsMeta.members)||{};
      const uids=Object.keys(m); if(!uids.length) return;
      try{
        await Promise.all(uids.map(uid=>db.ref('users/'+uid+'/photo').once('value').then(s=>{ state.userPhotos[uid]=s.val()||''; }).catch(()=>{})));
        rerender();
      }catch(e){}
    }
    // 프로필 저장: 사진(photoChange: undefined=유지 / ''=삭제 / dataURL=교체) + 이름(별명)
    async function saveProfile(name, photoChange){
      name=(name||'').trim()||state.userName;
      const upd={ name };
      if(photoChange!==undefined) upd.photo=photoChange||null;   // ''/null → 삭제
      await db.ref('users/'+state.uid).update(upd);
      // 이름 비정규화: 내가 속한 모든 워크스페이스의 멤버 이름 갱신
      (state.memberships||[]).forEach(w=>{
        db.ref('workspaces/'+w.id+'/members/'+state.uid+'/name').set(name).catch(()=>{});
        if(w.members&&w.members[state.uid]) w.members[state.uid].name=name;
      });
      if(state.wsMeta&&state.wsMeta.members&&state.wsMeta.members[state.uid]) state.wsMeta.members[state.uid].name=name;
      state.userName=name;
      if(photoChange!==undefined) state.userPhotos[state.uid]=photoChange||'';
      rerender();
    }
    // 이름/uid 해시 → 폴백 아바타 배경색
    function avatarColor(s){ s=String(s||'?'); let h=0; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0;
      const p=['#3182f6','#1b9e5f','#f04452','#f59f00','#9b59b6','#00b8d4','#e84393','#7b68ee']; return p[h%p.length]; }
    // 이름/uid 해시 → 컬러 그라데이션(시안풍 아바타 배경)
    function avatarGrad(s){ s=String(s||'?'); let h=0; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0;
      const g=[['#6a8dff','#3f5bd6'],['#f3b14e','#e8862f'],['#7fd1a6','#3aa876'],['#c8a6f0','#9b6fe0'],['#ff9aa2','#f0606b'],['#5ad1e0','#26a7bd'],['#ffb86b','#f0883a'],['#a0c4ff','#5a8de0']];
      const c=g[h%g.length]; return 'linear-gradient(135deg,'+c[0]+','+c[1]+')'; }

    function resetWorkspaceState(){
      Object.assign(state, { transactions:[], accounts:[], categories:[], savings:[], recurring:[],
        creditCards:[], subscriptions:[], purposeBooks:[], people:[], giftEvents:[], plannedGiftEvents:[], settlementPayments:[], loans:[], loanPayments:[], wsSettings:{}, budgets:[] });
      state.memberFilter='';
      seededAcc=seededCat=booted=migratedAcc=migratedCat=migratedBudget=migratedRec=false;
      recurringLogKeys=new Set();
      recv.tx=recv.acc=recv.cat=recv.rec=recv.log=false;
    }

    function updateWorkspaceChip(){
      const el=$('wsChip'); if(!el||!state.wsMeta) return;
      el.textContent = (state.wsMeta.type==='group'?'👥 ':'🏠 ')+(state.wsMeta.name||'가계부');
    }

    function isGroupWs(){ return state.wsMeta && state.wsMeta.type==='group'; }
    function wsMemberNames(){ const m=(state.wsMeta&&state.wsMeta.members)||{}; return Object.keys(m).map(k=>m[k].name).filter(Boolean); }
    // 소유자 선택 옵션: 현재 워크스페이스 멤버 + 공동 (+ 기존 값 보존)
    function ownerOptions(selected){
      const opts=Array.from(new Set([...wsMemberNames(), '공동', selected].filter(Boolean)));
      return opts.map(o=>'<option'+(o===selected?' selected':'')+'>'+escapeHtml(o)+'</option>').join('');
    }
    // ===== 공동 설정(권한/기본값) =====
    function isWsOwner(){ return state.wsMeta && state.wsMeta.ownerUid===state.uid; }
    function defaultVisibility(){ return state.wsSettings && state.wsSettings.defaultVisibility==='private' ? 'private' : 'full'; }
    function defaultOwnerName(){ const s=state.wsSettings&&state.wsSettings.defaultOwner; if(s==='me') return state.userName||'공동'; if(s==='common') return '공동'; return isGroupWs()?'공동':(state.userName||'공동'); }
    function saveWsSettings(patch){ db.ref(wp('settings')).update(Object.assign({ updatedAt:new Date().toISOString() }, patch)); }
    // 소유자 전용 워크스페이스 관리 (UI에서 권한 게이팅). workspaces/{wsId} 노드 직접 갱신.
    async function renameWorkspace(wsId, name){
      name=(name||'').trim(); if(!name) return;
      await db.ref('workspaces/'+wsId+'/name').set(name);
      const m=state.memberships.find(w=>w.id===wsId); if(m) m.name=name;
      if(state.wsId===wsId && state.wsMeta){ state.wsMeta.name=name; updateWorkspaceChip(); }
      toast('그룹 이름을 바꿨어요');
    }
    async function transferOwnership(wsId, uid){
      const w=state.memberships.find(x=>x.id===wsId); if(!w) return;
      const old=w.ownerUid;
      const upd={};
      upd['workspaces/'+wsId+'/ownerUid']=uid;
      if(old) upd['workspaces/'+wsId+'/members/'+old+'/role']='member';
      upd['workspaces/'+wsId+'/members/'+uid+'/role']='owner';
      await db.ref().update(upd);
      await loadMyWorkspaces();
      if(state.wsId===wsId){ const m=state.memberships.find(x=>x.id===wsId); if(m) state.wsMeta=m; }
      toast('소유자를 넘겼어요'); rerender();
    }
    async function removeMember(wsId, uid){
      // 멤버에서 제거 → 해당 사용자는 ws/{wsId} 접근 차단. (상대 users/{uid}/ws 인덱스는 본인만 삭제 가능해 잔존하나 접근은 불가)
      await db.ref('workspaces/'+wsId+'/members/'+uid).remove();
      await loadMyWorkspaces();
      if(state.wsId===wsId){ const m=state.memberships.find(x=>x.id===wsId); if(m) state.wsMeta=m; }
      toast('멤버를 내보냈어요'); rerender();
    }

    // 새 워크스페이스 기본 계좌 (개인=내 계좌 1개 / 그룹=공동 자산)
    function buildDefaultAccounts(){
      const now=Date.now();
      if(isGroupWs()){
        return { ['acc_'+now]:{ name:'공동 자산', type:'bank', provider:'manual', owner:'공동', initialBalance:0, color:'#1b9e5f', order:1, visibility:'full', memo:'' } };
      }
      return { ['acc_'+now]:{ name:(state.userName||'내')+' 자산', type:'bank', provider:'manual', owner:state.userName||'공동', initialBalance:0, color:'#3182f6', order:1, visibility:'full', memo:'' } };
    }

    // ===== 데이터 리스너 (현재 워크스페이스 ws/{wsId} 기준) =====
    let attachedRefs=[];
    function attach(path, cb){ const r=db.ref(wp(path)); r.on('value', cb); attachedRefs.push(r); }
    function detachListeners(){ attachedRefs.forEach(r=>r.off()); attachedRefs=[]; listenersAttached=false; }
    function setupListeners(){
      if(listenersAttached) return;
      listenersAttached=true;

      attach('accounts', s=>{
        if(!s.exists() && !seededAcc){ seededAcc=true; db.ref(wp('accounts')).set(buildDefaultAccounts()); return; }
        const o=s.val()||{}; state.accounts=Object.keys(o).map(k=>Object.assign({id:k},o[k])).sort((a,b)=>(a.order||0)-(b.order||0));
        migrateAccounts();
        recv.acc=true; rerender(); maybeBoot();
      });
      attach('creditCards', s=>{
        const o=s.val()||{}; state.creditCards=Object.keys(o).map(k=>Object.assign({id:k},o[k])); rerender();
      });
      attach('categories', s=>{
        if(!s.exists() && !seededCat){ seededCat=true; db.ref(wp('categories')).set(buildDefaultCategories()); return; }
        const o=s.val()||{};
        migrateCategories(o);
        state.categories=Object.keys(o).map(k=>Object.assign({name:k},o[k])).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
        recv.cat=true; rerender();
      });
      attach('budgets', s=>{
        const v=s.val();
        if(v && (v.monthlyTotal!==undefined || v.byCategory!==undefined)){ migrateBudgets(v); return; } // 구버전 단일 객체
        const o=v||{}; state.budgets=Object.keys(o).filter(k=>o[k] && typeof o[k]==='object').map(k=>Object.assign({id:k},o[k]));
        rerender();
      });
      attach('transactions', s=>{
        const arr=[]; s.forEach(us=>{ us.forEach(ts=>{ arr.push(Object.assign({ownerUid:us.key,id:ts.key},ts.val())); }); });
        state.transactions=arr; recv.tx=true; rerender(); maybeBoot();
      });
      attach('savings', s=>{
        const arr=[]; s.forEach(us=>{ us.forEach(vs=>{ arr.push(Object.assign({ownerUid:us.key,id:vs.key},vs.val())); }); });
        state.savings=arr; rerender();
      });
      attach('recurring', s=>{
        const arr=[]; s.forEach(us=>{ us.forEach(rs=>{ arr.push(Object.assign({ownerUid:us.key,id:rs.key},rs.val())); }); });
        state.recurring=arr; migrateRecurring(); recv.rec=true; rerender(); maybeBoot();
      });
      attach('recurringLogs', s=>{
        const set=new Set(); s.forEach(us=>{ us.forEach(ls=>{ set.add(ls.key); }); });
        recurringLogKeys=set; recv.log=true; maybeBoot();
      });
      attach('subscriptions', s=>{
        const o=s.val()||{}; state.subscriptions=Object.keys(o).map(k=>Object.assign({id:k},o[k])); rerender();
      });
      attach('purposeBooks', s=>{
        const o=s.val()||{}; state.purposeBooks=Object.keys(o).map(k=>Object.assign({id:k},o[k])); rerender();
      });
      attach('people', s=>{
        const o=s.val()||{}; state.people=Object.keys(o).map(k=>Object.assign({id:k},o[k])); rerender();
      });
      attach('giftEvents', s=>{
        const o=s.val()||{}; state.giftEvents=Object.keys(o).map(k=>Object.assign({id:k},o[k])); rerender();
      });
      attach('plannedGiftEvents', s=>{
        const o=s.val()||{}; state.plannedGiftEvents=Object.keys(o).map(k=>Object.assign({id:k},o[k])); rerender();
      });
      attach('settlementPayments', s=>{   // 정산 송금 기록(per-uid: {uid}/{id})
        const arr=[]; s.forEach(us=>{ us.forEach(ps=>{ arr.push(Object.assign({ownerUid:us.key,id:ps.key},ps.val())); }); });
        state.settlementPayments=arr; rerender();
      });
      attach('loans', s=>{
        const o=s.val()||{}; state.loans=Object.keys(o).map(k=>Object.assign({id:k},o[k])); rerender();
      });
      attach('loanPayments', s=>{
        const o=s.val()||{}; state.loanPayments=Object.keys(o).map(k=>Object.assign({id:k},o[k])); rerender();
      });
      attach('settings', s=>{ state.wsSettings=s.val()||{}; rerender(); });

      migrateFixed();
    }

    function migrateFixed(){
      db.ref(wp('fixedExpenses/'+state.uid)).once('value', snap=>{
        if(!snap.exists()) return;
        const first=state.accounts[0];
        snap.forEach(ch=>{
          const f=ch.val();
          db.ref(wp('recurring/'+state.uid+'/'+ch.key)).set({
            type:'expense', amount:f.amount||0, desc:f.name||'고정지출', from:f.account||(first&&first.id)||'',
            category:'기타', freq:(f.period==='weekly'?'weekly':'monthly'), day:1, weekday:1,
            startDate: todayStr(), lastPosted:'', active:true, user:f.user||state.userName
          });
        });
        db.ref(wp('fixedExpenses/'+state.uid)).remove();
        toast('고정지출을 반복거래로 옮겼어요');
      });
    }

    // 기존 계좌 한글 type → 영문 enum + provider/visibility 보강 (1회)
    function migrateAccounts(){
      if(migratedAcc) return; migratedAcc=true;
      const map={'계좌':'bank','현금':'cash','카드':'credit_card'};
      const upd={};
      state.accounts.forEach(a=>{
        if(map[a.type]) upd['accounts/'+a.id+'/type']=map[a.type];
        if(a.provider===undefined) upd['accounts/'+a.id+'/provider']='manual';
        if(a.visibility===undefined) upd['accounts/'+a.id+'/visibility']='full';
      });
      if(Object.keys(upd).length) db.ref(wsRoot()).update(upd);
    }

    // 카테고리 확장 마이그레이션: 기존(이름만/일부필드) → 풀 필드, 누락 기본 카테고리 시드 (1회, 멱등)
    function migrateCategories(o){
      if(migratedCat) return; migratedCat=true;
      const upd={}; const names=Object.keys(o);
      let maxOrder=0; names.forEach(n=>{ maxOrder=Math.max(maxOrder, Number(o[n].sortOrder)||0); });
      // 1) 기존 카테고리 필드 보강 (type 없는 것 = 미마이그레이션)
      names.forEach((n,i)=>{ const c=o[n]||{};
        if(c.type===undefined){
          upd['categories/'+n+'/type']= (n==='기타'?'other':'expense');
          upd['categories/'+n+'/isDefault']= OLD_DEFAULT_CAT_NAMES.includes(n);
          upd['categories/'+n+'/isActive']= (c.isActive!==false);
          upd['categories/'+n+'/sortOrder']= (c.sortOrder!=null?c.sortOrder:i);
          upd['categories/'+n+'/visibility']= c.visibility||'full';
          upd['categories/'+n+'/owner']= c.owner||'공동';
        }
      });
      // 2) 신규 기본 카테고리 시드 (없는 이름만)
      const defs=buildDefaultCategories(); let order=maxOrder;
      Object.keys(defs).forEach(n=>{ if(!(n in o)){ const d=Object.assign({},defs[n]); d.sortOrder=++order; upd['categories/'+n]=d; } });
      if(Object.keys(upd).length) db.ref(wsRoot()).update(upd);
    }

    // 구버전 단일 budgets({monthlyTotal,byCategory}) → budgets/{id} 레코드 컬렉션 (1회, 멱등)
    function migrateBudgets(old){
      if(migratedBudget) return; migratedBudget=true;
      const now=new Date().toISOString(); const upd={}; let i=0;
      const mk=(categoryName,amount)=>({ categoryName:categoryName||null, amount, periodType:'monthly', scope:'group', owner:'공동', alertEnabled:true, alertThreshold:80, visibility:'full', purposeBookId:null, createdAt:now, updatedAt:now });
      if(Number(old.monthlyTotal)>0) upd['budgets/bg_total']=mk(null, Number(old.monthlyTotal));
      const bc=old.byCategory||{};
      Object.keys(bc).forEach(name=>{ if(Number(bc[name])>0) upd['budgets/bg_'+(++i)]=mk(name, Number(bc[name])); });
      upd['budgets/monthlyTotal']=null; upd['budgets/byCategory']=null; // 구 키 제거
      db.ref(wsRoot()).update(upd);
    }

    function maybeBoot(){
      if(booted) return;
      if(recv.tx && recv.acc && recv.rec && recv.log){ booted=true; setTimeout(runRecurring, 300); }
    }

    // 기존 recurring 규칙에 신규 필드 보강(status/interval/autoCreate/visibility) — 1회, 본인 uid만
    function migrateRecurring(){
      if(migratedRec) return; migratedRec=true;
      const upd={};
      state.recurring.filter(r=>r.ownerUid===state.uid).forEach(r=>{
        const b='recurring/'+state.uid+'/'+r.id+'/';
        if(r.status===undefined) upd[b+'status']=(r.active===false?'paused':'active');
        if(r.interval===undefined) upd[b+'interval']=1;
        if(r.autoCreate===undefined) upd[b+'autoCreate']=true;
        if(r.visibility===undefined) upd[b+'visibility']='full';
      });
      if(Object.keys(upd).length) db.ref(wsRoot()).update(upd);
    }

    // ===== 정기거래 자동기록 (멱등) =====
    // [누락 회차 정책] 여러 달 미접속 시 누락분을 모두 생성하되, 앱 1회 실행당 규칙별 최대 12회차까지만 생성.
    // 남은 회차는 다음 실행 때 이어서 생성(한 번에 폭주 방지).
    const MAX_RECUR_PER_RUN = 12;
    function clampDay(y, m0, day){ const last=new Date(y,m0+1,0).getDate(); return Math.min(day, last); }
    function firstOccurrence(rule){
      const start=parseDate(rule.startDate||todayStr()); const f=rule.freq||'monthly';
      if(f==='daily'||f==='custom') return start;
      if(f==='weekly'){ const wd=(rule.weekday!=null?Number(rule.weekday):start.getDay()); const d=new Date(start); d.setDate(d.getDate()+((wd-d.getDay()+7)%7)); return d; }
      if(f==='yearly'){ const mo=start.getMonth(), dom=Number(rule.day)||start.getDate(); let y=start.getFullYear(); let occ=new Date(y,mo,clampDay(y,mo,dom)); if(occ<start) occ=new Date(++y,mo,clampDay(y,mo,dom)); return occ; }
      const dom=Number(rule.day)||start.getDate(); let y=start.getFullYear(), m=start.getMonth(); let occ=new Date(y,m,clampDay(y,m,dom)); if(occ<start){ m++; if(m>11){m=0;y++;} occ=new Date(y,m,clampDay(y,m,dom)); } return occ;
    }
    function nextAfter(occ, rule){
      const iv=Math.max(1,Number(rule.interval)||1), f=rule.freq||'monthly', d=new Date(occ);
      if(f==='daily'||f==='custom'){ d.setDate(d.getDate()+iv); return d; }
      if(f==='weekly'){ d.setDate(d.getDate()+7*iv); return d; }
      if(f==='yearly'){ const dom=Number(rule.day)||d.getDate(); const y=d.getFullYear()+iv, m=d.getMonth(); return new Date(y,m,clampDay(y,m,dom)); }
      const dom=Number(rule.day)||d.getDate(); let y=d.getFullYear(), m=d.getMonth()+iv; y+=Math.floor(m/12); m=((m%12)+12)%12; return new Date(y,m,clampDay(y,m,dom));
    }
    function occurrencesV2(rule, fromD, toD){
      const out=[]; let occ=firstOccurrence(rule), g=0;
      while(occ<fromD && g++<6000) occ=nextAfter(occ,rule);
      g=0; while(occ<=toD && g++<600){ out.push(new Date(occ)); occ=nextAfter(occ,rule); }
      return out;
    }
    function ruleStatus(rule){ return rule.status || (rule.active===false?'paused':'active'); }
    function nextRunOf(rule){
      let nr=firstOccurrence(rule), g=0; const anchor=rule.lastPosted?parseDate(rule.lastPosted):null;
      while(anchor && nr<=anchor && g++<6000) nr=nextAfter(nr,rule);
      const endD=rule.endDate?parseDate(rule.endDate):null;
      return (endD && nr>endD)?null:nr;
    }
    function nextOccurrence(rule){ return nextRunOf(rule); } // 호환: 홈 '다가오는 반복결제'

    // 정기거래 → Transaction (기존 TX_EFFECT/실제소비/카드실적 규칙 그대로 재사용)
    function buildRecurringTx(rule, occ){
      const type=rule.type;
      const tx={ type, date:new Date(occ.getFullYear(),occ.getMonth(),occ.getDate(),12,0,0).toISOString(),
        user:rule.user||state.userName, amount:Number(rule.amount)||0,
        desc: rule.desc||TYPE_LABEL[type]||'정기',
        isActualExpense: !!ACTUAL_DEFAULT[type],
        recurringId:rule.id, recurringTitle:rule.desc||'', scheduledDate:ymd(occ), generatedBy:'recurring' };
      if(rule.memo) tx.memo=rule.memo;
      const e=TX_EFFECT[type]||{};
      if(type==='balance_adjustment'){ tx.to=rule.to||rule.from; }
      else { if(e.debit) tx.from=rule.from; if(e.credit) tx.to=rule.to; }
      if(catTypeFor(type)) tx.category=rule.category||'기타';
      const card=getCard(tx.from);
      if(card && (type==='expense'||type==='prepaid_charge')){
        const inc = rule.cardPerformanceIncluded!==undefined ? !!rule.cardPerformanceIncluded : defaultCardIncluded(card,type,tx.category);
        tx.cardPerformanceIncluded=inc;
        tx.cardPerformanceAmount= inc ? (rule.cardPerformanceAmount!=null?Number(rule.cardPerformanceAmount):tx.amount) : 0;
        tx.cardPerformanceExcludedReason= inc ? '' : (rule.cardPerformanceExcludedReason||'');
      }
      return tx;
    }
    // 멱등: 같은 recurringId+scheduledDate 로그가 있으면 스킵. 생성 시 거래+로그 동시 기록.
    function postOccurrence(rule, occ){
      const sd=ymd(occ), logKey=rule.id+'_'+sd;
      if(recurringLogKeys.has(logKey)) return false;
      const txKey='rec_'+rule.id+'_'+sd;
      db.ref(wp('transactions/'+rule.ownerUid+'/'+txKey)).set(buildRecurringTx(rule, occ));
      db.ref(wp('recurringLogs/'+rule.ownerUid+'/'+logKey)).set({ recurringId:rule.id, scheduledDate:sd, generatedTransactionId:txKey, status:'created', createdAt:new Date().toISOString() });
      recurringLogKeys.add(logKey);
      return true;
    }
    function runRecurring(){
      const today=parseDate(todayStr());
      state.recurring.filter(r=>r.ownerUid===state.uid).forEach(rule=>{
        if(ruleStatus(rule)!=='active' || rule.autoCreate===false) return;
        const endD=rule.endDate?parseDate(rule.endDate):null;
        const fromD = rule.lastPosted ? new Date(parseDate(rule.lastPosted).getTime()+86400000) : parseDate(rule.startDate||todayStr());
        let occs = occurrencesV2(rule, fromD, today);
        if(endD) occs=occs.filter(o=>o<=endD);
        if(occs.length>MAX_RECUR_PER_RUN) occs=occs.slice(0,MAX_RECUR_PER_RUN);
        let last=rule.lastPosted;
        occs.forEach(occ=>{ postOccurrence(rule, occ); last=ymd(occ); });
        const upd={};
        if(last && last!==rule.lastPosted) upd.lastPosted=last;
        const nr=nextRunOf(Object.assign({}, rule, { lastPosted: last||rule.lastPosted }));
        if(nr) upd.nextRunDate=ymd(nr); else { upd.nextRunDate=null; if(endD) upd.status='ended'; }
        if(Object.keys(upd).length) db.ref(wp('recurring/'+state.uid+'/'+rule.id)).update(upd);
      });
    }

    // ===== 파생 계산 =====
    function accountBalance(id){
      const a=getAcct(id); let bal=a?Number(a.initialBalance||0):0;
      state.transactions.forEach(t=>{
        const e=TX_EFFECT[t.type]; if(!e) return;
        const amt=Number(t.amount)||0;
        if(e.debit && t[e.debit]===id) bal-=amt;
        if(e.credit && t[e.credit]===id) bal+=amt;
      });
      return bal;
    }
    function totalAssets(){ return visibleAccounts().reduce((s,a)=>s+accountBalance(a.id),0); }
    function monthTx(m){ return state.transactions.filter(t=>(t.date||'').startsWith(m)); }
    function sumBy(list,type){ return list.filter(t=>t.type===type).reduce((s,t)=>s+(Number(t.amount)||0),0); }

    // 실제 소비 / 선불·포인트 / 권한
    function isActual(t){ return t.isActualExpense!==undefined ? !!t.isActualExpense : !!ACTUAL_DEFAULT[t.type]; }
    function actualSpend(list){ return list.filter(isActual).reduce((s,t)=>s+(Number(t.amount)||0),0); }

    // ===== 정산 계산 (Step 9) — 순수 함수, RTDB/DOM 미접근 =====
    // 거래 1건의 분담 결과: { payer, participants:[이름], amounts:{이름:금액} }. 합계 = |amount| 보정.
    function settlementSplit(t){
      const amount=Math.abs(Number(t.amount)||0);
      const payer=t.payer||t.user||'';
      let parts=Array.isArray(t.splitParticipants)&&t.splitParticipants.length?t.splitParticipants.slice():[];
      const type=t.splitType||'none';
      if(type==='payer_only'){
        const amounts={}; if(payer) amounts[payer]=amount; if(!parts.length&&payer) parts=[payer];
        return { payer, participants:parts.length?parts:(payer?[payer]:[]), amounts };
      }
      if(type==='custom' && t.splitAmounts && typeof t.splitAmounts==='object'){
        const amounts={}; let names=parts.length?parts:Object.keys(t.splitAmounts);
        names.forEach(n=>{ amounts[n]=Math.round(Number(t.splitAmounts[n])||0); });
        return { payer, participants:names, amounts };
      }
      // equal(기본): 균등 분배 후 나머지를 마지막 사람에게 더해 합계 보정
      if(!parts.length) parts = payer?[payer]:[];
      const n=parts.length||1, base=Math.floor(amount/n), amounts={};
      parts.forEach((nm,i)=>{ amounts[nm]=base; });
      if(parts.length){ amounts[parts[parts.length-1]] += amount - base*n; }
      return { payer, participants:parts, amounts };
    }
    // balance>0 = 받을 사람, balance<0 = 보낼 사람. 단순 최소 송금 매칭(0 될 때까지 순차).
    function greedySettle(balanceMap){
      const cred=[], debt=[];
      Object.keys(balanceMap).forEach(n=>{ const v=Math.round(balanceMap[n]); if(v>0) cred.push({n,v}); else if(v<0) debt.push({n,v:-v}); });
      cred.sort((a,b)=>b.v-a.v); debt.sort((a,b)=>b.v-a.v);
      const out=[]; let i=0,j=0;
      while(i<debt.length && j<cred.length){
        const pay=Math.min(debt[i].v, cred[j].v);
        if(pay>0) out.push({ from:debt[i].n, to:cred[j].n, amount:pay });
        debt[i].v-=pay; cred[j].v-=pay;
        if(debt[i].v<=0) i++; if(cred[j].v<=0) j++;
      }
      return out;
    }
    // 목적별 가계부 정산 요약. settlementIncluded 거래 + 기록된 송금(paid)을 반영.
    // 상태 기준: neededAmount=정산에 필요한 총 송금액(=greedy 제안 합), settledAmount=완료(paid)된 송금 합.
    //   needed==0 → none / settled>=needed → settled / 0<settled<needed → partially_settled / settled==0 → unsettled
    function pbSettleSummary(p){
      const txs=state.transactions.filter(t=>t.purposeBookId===p.id && t.settlementIncluded===true);
      const paid={}, owed={}, names=new Set((p.participants||[]));
      txs.forEach(t=>{
        const s=settlementSplit(t);
        if(s.payer){ paid[s.payer]=(paid[s.payer]||0)+Math.abs(Number(t.amount)||0); names.add(s.payer); }
        s.participants.forEach(nm=>{ owed[nm]=(owed[nm]||0)+(Number(s.amounts[nm])||0); names.add(nm); });
      });
      // 순수 잔액(송금 반영 전): paid - owed
      const baseBalance={}; names.forEach(n=>{ baseBalance[n]=(paid[n]||0)-(owed[n]||0); });
      const neededTransfers=greedySettle(baseBalance);
      const neededAmount=neededTransfers.reduce((s,x)=>s+x.amount,0);
      // 완료된 송금 반영 → 남은 잔액
      const payments=state.settlementPayments.filter(x=>x.purposeBookId===p.id && x.status==='paid');
      const settledAmount=payments.reduce((s,x)=>s+(Number(x.amount)||0),0);
      const balance=Object.assign({}, baseBalance);
      payments.forEach(x=>{ balance[x.fromPerson]=(balance[x.fromPerson]||0)+(Number(x.amount)||0); balance[x.toPerson]=(balance[x.toPerson]||0)-(Number(x.amount)||0); });
      const suggestions=greedySettle(balance);
      const perPerson=Array.from(names).map(n=>({ name:n, paid:Math.round(paid[n]||0), owed:Math.round(owed[n]||0), balance:Math.round(baseBalance[n]||0) }))
        .sort((a,b)=>b.balance-a.balance);
      const totalSpend=txs.reduce((s,t)=>s+Math.abs(Number(t.amount)||0),0);
      const unsettledAmount=Math.max(0, neededAmount-settledAmount);
      const status = neededAmount<=0 ? 'none' : (settledAmount>=neededAmount ? 'settled' : (settledAmount>0 ? 'partially_settled' : 'unsettled'));
      const settledPct = neededAmount>0 ? Math.min(100, Math.round(settledAmount/neededAmount*100)) : 0;
      return { perPerson, suggestions, payments, totalSpend, txCount:txs.length, neededAmount, settledAmount, unsettledAmount, settledPct, status, txs };
    }
    // ===== 대출/이자 계산 — 순수 함수 =====
    function loanPaymentsOf(loan){ return state.loanPayments.filter(p=>p.loanId===loan.id); }
    // 잔액 = 원금 - 상환한 원금 합 / 이자합 / 상환원금합
    function loanCalc(loan){
      const ps=loanPaymentsOf(loan);
      const paidPrincipal=ps.reduce((s,p)=>s+(Number(p.principalAmount)||0),0);
      const paidInterest=ps.reduce((s,p)=>s+(Number(p.interestAmount)||0),0);
      const principal=Number(loan.principal)||0;
      const balance=Math.max(0, principal-paidPrincipal);
      // 월 예상 이자(단리, 참고용): 잔액 * 연이율% / 12
      const monthlyInterest=Math.round(balance*((Number(loan.interestRate)||0)/100)/12);
      const status = loan.status==='overdue' ? 'overdue' : (balance<=0 ? 'paid' : 'active');
      return { principal, paidPrincipal, paidInterest, balance, monthlyInterest, status, payments:ps, totalPaid:paidPrincipal+paidInterest };
    }
    function visibleLoans(){ return state.loans.filter(canSee); }
    function loanSummary(){
      let borrowedBal=0, lentBal=0, interest=0;
      visibleLoans().forEach(l=>{ const c=loanCalc(l); interest+=c.paidInterest; if(l.direction==='lent') lentBal+=c.balance; else borrowedBal+=c.balance; });
      return { borrowedBal, lentBal, interest, count:visibleLoans().length };
    }

    function prepaidAccounts(){ return state.accounts.filter(a=>PREPAID_TYPES.includes(a.type)); }
    function prepaidTotal(){ return prepaidAccounts().filter(canSee).reduce((s,a)=>s+accountBalance(a.id),0); }
    function canSee(item){ if((item.visibility||'full')!=='private') return true; return item.owner===state.userName || item.owner==='공동'; }
    function visibleAccounts(){ return state.accounts.filter(canSee); }
    function acctGroup(a){ if(CARD_TYPES.includes(a.type)) return 'card'; if(PREPAID_TYPES.includes(a.type)) return 'prepaid'; if(a.type==='other') return 'other'; return 'cash'; }

    // 카드 실적
    function defaultCardIncluded(card, type, category){
      if(!card) return false;
      if(type==='prepaid_charge') return !!card.includePrepaidCharge;
      if(category && (card.excludedCategories||[]).includes(category)) return false;
      return card.defaultIncluded!==false;
    }
    function cardPeriod(card, ref){
      ref = ref || new Date();
      if(card.performancePeriodType!=='custom'){
        return { start:new Date(ref.getFullYear(),ref.getMonth(),1), end:new Date(ref.getFullYear(),ref.getMonth()+1,0) };
      }
      const S=Number(card.performanceStartDay)||1;
      let start=new Date(ref.getFullYear(),ref.getMonth(),S);
      if(ref<start) start=new Date(ref.getFullYear(),ref.getMonth()-1,S);
      const end=new Date(start.getFullYear(),start.getMonth()+1,S-1);
      return { start, end };
    }
    function cardPerformance(card){
      const acctId=card.id; const p=cardPeriod(card);
      let sum=0; const excluded=[];
      state.transactions.forEach(t=>{
        if(t.from!==acctId) return;
        if(!(t.type==='expense'||t.type==='prepaid_charge')) return;
        const d=parseDate(t.date); if(d<p.start||d>p.end) return;
        const inc = t.cardPerformanceIncluded!==undefined ? !!t.cardPerformanceIncluded : defaultCardIncluded(card,t.type,t.category);
        if(inc) sum += (t.cardPerformanceAmount!=null ? Number(t.cardPerformanceAmount) : (Number(t.amount)||0));
        else excluded.push(t);
      });
      const target=Number(card.monthlyPerformanceTarget)||0;
      return { sum, target, pct: target?Math.round(sum/target*100):0, remain:Math.max(0,target-sum), start:p.start, end:p.end, excluded };
    }

    // ===== 예산 =====
    function visibleBudgets(){ return state.budgets.filter(canSee); }
    function budgetPeriod(b, ref){
      ref = ref || new Date();
      if(b.periodType==='custom'){ return { start:parseDate(b.startDate||todayStr()), end:parseDate(b.endDate||b.startDate||todayStr()) }; }
      if(b.periodType==='weekly'){ const d=new Date(ref); d.setHours(0,0,0,0); d.setDate(d.getDate()-d.getDay()); const e=new Date(d); e.setDate(d.getDate()+6); return {start:d,end:e}; }
      if(b.periodType==='yearly'){ return { start:new Date(ref.getFullYear(),0,1), end:new Date(ref.getFullYear(),11,31) }; }
      return { start:new Date(ref.getFullYear(),ref.getMonth(),1), end:new Date(ref.getFullYear(),ref.getMonth()+1,0) };
    }
    function budgetTxs(b){
      const p=budgetPeriod(b);
      return state.transactions.filter(t=>{
        if(!isActual(t)) return false;                              // 실제소비만 (충전·이체·조정·환불·대출상환 제외)
        if(b.categoryName && t.category!==b.categoryName) return false;
        if(b.scope==='personal' && b.owner && b.owner!=='공동' && t.user!==b.owner) return false;
        const d=parseDate(t.date); return !(d<p.start||d>p.end);
      });
    }
    function budgetUsage(b){
      const p=budgetPeriod(b);
      const used=budgetTxs(b).reduce((s,t)=>s+(Number(t.amount)||0),0);
      const amt=Number(b.amount)||0;
      return { used, amount:amt, pct: amt?Math.round(used/amt*100):0, remain:amt-used, start:p.start, end:p.end };
    }
    function totalMonthlyBudget(){ return visibleBudgets().find(b=>!b.categoryName && b.periodType==='monthly') || null; }

    // ===== 구독 =====
    function visibleSubs(){ return state.subscriptions.filter(canSee); }
    function subActive(s){ return (s.status||'active')==='active'; }
    function daysUntil(ds){ if(!ds) return null; return Math.round((parseDate(ds)-parseDate(todayStr()))/86400000); }
    function monthlyEquiv(s){ const a=Number(s.amount)||0, iv=Math.max(1,Number(s.billingInterval)||1);
      if(s.billingCycle==='monthly') return a/iv;
      if(s.billingCycle==='yearly') return a/(12*iv);
      if(s.billingCycle==='weekly') return a*4.345/iv;
      return null; // custom: 환산 불가
    }
    function yearlyEquiv(s){ const m=monthlyEquiv(s); return m==null?null:m*12; }
    function subBadges(s){
      const out=[]; const st=s.status||'active';
      if(st==='cancelled'){ out.push(['취소','#8b95a1']); return out; }
      if(st==='expired'){ out.push(['만료','#8b95a1']); return out; }
      if(st==='paused'){ out.push(['일시정지','#f5a623']); return out; }
      const nb=daysUntil(s.nextBillingDate); if(nb!=null&&nb>=0&&nb<=7) out.push(['결제 D-'+nb,'#3182f6']);
      const ex=daysUntil(s.expirationDate); if(ex!=null&&ex>=0&&ex<=7) out.push(['만료 D-'+ex,'#f04452']);
      if(s.isTrial){ const tr=daysUntil(s.trialEndDate); if(tr!=null&&tr>=0&&tr<=7) out.push(['체험종료 D-'+tr,'#f76707']); }
      if(s.expirationDate && s.autoRenew===false && daysUntil(s.expirationDate)<0) out.push(['만료 추정','#8b95a1']);
      return out;
    }

    // ===== 렌더 라우팅 =====
    function go(tab){
      state.tab=tab;
      document.querySelectorAll('.tabbar .tab').forEach(b=>b.classList.toggle('on', b.dataset.tab===tab));
      rerender();
      const c=$('content'); if(c) c.scrollTop=0;   // 탭 전환 시 내용 스크롤 맨 위로
    }
    function rerender(){
      if(state.tab==='calendar') renderCalendar();
      else if(state.tab==='stats') renderStats();
      else if(state.tab==='assets') renderAssets();
      else if(state.tab==='more') renderMore();
    }
