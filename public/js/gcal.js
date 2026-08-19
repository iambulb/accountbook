/* 알뜰 구글캘린더 단방향 동기화 — 할일(마감일 있는 내 할일) → 구글 "알뜰 할일" 보조 캘린더.
   GIS 토큰클라이언트(https://accounts.google.com/gsi/client 지연 주입) + Calendar REST를 fetch로 직접 호출(무빌드·서버 없음).
   활성 조건: firebase.js GCAL_CLIENT_ID 채움(비면 UI·동기화 전부 자동 비활성 — push.js VAPID_KEY와 같은 관례).
   스코프: calendar.app.created — 앱이 만든 보조 캘린더만 접근(주 캘린더 오염 없음, 해제 시 캘린더 1건 삭제로 정리).
   상태 저장: users/{uid}/gcal (RTDB 기본 규칙상 본인 전용 — 공개 하위노드 아님) = { meta:{calendarId,connectedAt,lastSyncAt}, map:{키:{e,s,w}}, lock }.
   ⚠️ 단방향: 구글 쪽에서 일정 수정·삭제해도 앱엔 반영 안 되며 다음 동기화 때 앱 내용으로 되돌아간다(시트·문서에 명시).
   반복 할일은 RRULE 없이 "현재 회차 1건=이벤트 1건" — 완료 시 dueDate가 다음 회차로 굴러가면(nextDue) 같은 이벤트를 patch(날짜 이동). */
(function(){
  'use strict';
  const SCOPE='https://www.googleapis.com/auth/calendar.app.created';
  const API='https://www.googleapis.com/calendar/v3';
  let _tok=null, _tokExp=0, _tc=null;                 // 액세스 토큰은 메모리 전용(~1h) — 저장하지 않음(유출면 축소)
  let _busy=false, _again=false, _kickT=null;
  let _needReconnect=false, _silentBlocked=false;     // silent 재발급 실패 후엔 사용자 제스처(시트) 전까지 자동 재시도 억제
  let _bootKicked=false;
  const _devId=Math.random().toString(36).slice(2,10);   // 다중 기기 락 식별(세션 한정이면 충분)

  function gcalConfigured(){ return typeof GCAL_CLIENT_ID==='string' && GCAL_CLIENT_ID.length>20; }
  function gcalConnected(){ return !!(typeof state!=='undefined' && state && state.gcal && state.gcal.meta && state.gcal.meta.calendarId); }
  function _gref(path){ return db.ref('users/'+state.uid+'/gcal'+(path?'/'+path:'')); }

  // ---- GIS 스크립트 지연 주입(미사용자에겐 0바이트) ----
  let _gsiLoading=false, _gsiCbs=[];
  function _gsiLoad(cb){
    if(window.google && google.accounts && google.accounts.oauth2) return cb(true);
    _gsiCbs.push(cb);
    if(_gsiLoading) return;
    _gsiLoading=true;
    const s=document.createElement('script'); s.src='https://accounts.google.com/gsi/client'; s.async=true;
    s.onload=function(){ _gsiCbs.splice(0).forEach(f=>f(!!(window.google&&google.accounts&&google.accounts.oauth2))); };
    s.onerror=function(){ _gsiLoading=false; _gsiCbs.splice(0).forEach(f=>f(false)); };
    document.head.appendChild(s);
  }
  // 액세스 토큰 확보. interactive=사용자 제스처(연결/수동 동기화 버튼) — 최초엔 동의창, 이후엔 대개 즉시 재발급.
  // 자동(백그라운드) 호출은 팝업 차단으로 실패할 수 있어 실패 시 조용히 null(+재연결 표시), lastSyncAt은 유지.
  function _token(interactive){
    return new Promise(function(res){
      if(_tok && Date.now()<_tokExp-60000) return res(_tok);
      if(!interactive && _silentBlocked) return res(null);   // 실패 이력 있으면 제스처 전까지 재시도 안 함(팝업 스팸 방지)
      _gsiLoad(function(ok){
        if(!ok){ _needReconnect=true; return res(null); }
        try{
          if(!_tc) _tc=google.accounts.oauth2.initTokenClient({ client_id:GCAL_CLIENT_ID, scope:SCOPE, callback:function(){} });
          let done=false; const fin=v=>{ if(!done){ done=true; res(v); } };
          _tc.callback=function(resp){
            if(resp && resp.access_token){ _tok=resp.access_token; _tokExp=Date.now()+(Number(resp.expires_in)||3600)*1000; _needReconnect=false; _silentBlocked=false; fin(_tok); }
            else { _needReconnect=true; if(!interactive) _silentBlocked=true; fin(null); }
          };
          _tc.error_callback=function(){ _needReconnect=true; if(!interactive) _silentBlocked=true; fin(null); };
          _tc.requestAccessToken({ prompt:'' });
        }catch(e){ _needReconnect=true; res(null); }
      });
    });
  }

  // ---- Calendar REST(fetch, 순차 호출) ----
  async function _api(method, path, body){
    const r=await fetch(API+path, { method:method,
      headers: body ? { 'Authorization':'Bearer '+_tok, 'Content-Type':'application/json' } : { 'Authorization':'Bearer '+_tok },
      body: body?JSON.stringify(body):undefined });
    if(r.status===204) return null;
    if(!r.ok){ const e=new Error('구글캘린더 오류('+r.status+')'); e.code=r.status; throw e; }
    return r.json();
  }

  // ---- 동기화 대상: 마감일 있는 "내 할일"(개인 전체 + 현재 그룹 중 담당자=나), 완료·반복스냅샷 제외 ----
  //  키는 스코프 태그 합성(mk) — 개인·그룹 할일 id가 우연히 겹쳐도 매핑이 안 섞이게. w=''(개인)|wsId(그룹).
  function _targets(){
    const out={};
    (state.myTodos||[]).forEach(function(t){ if(!t||!t.id||t.done||t.repeatSrcId||!t.dueDate) return; out[t.id]={t:t,w:''}; });
    const w=state.wsId||'';
    (state.todos||[]).forEach(function(t){
      if(!t||!t.id||t.done||t.repeatSrcId||!t.dueDate) return;
      if(todoScope(t)==='personal') return;              // 레거시 개인 스코프 문서 방어(이관 전 잔재)
      if(t.assignedUid!==state.uid) return;              // 그룹은 담당자=나만
      out[w+'_'+t.id]={t:t,w:w};
    });
    return out;
  }
  function _hash(s){ let h=5381; for(let i=0;i<s.length;i++){ h=((h*33)^s.charCodeAt(i))>>>0; } return h.toString(36); }
  function _sig(t){ return _hash([t.title||'',t.note||'',t.dueDate||'',t.dueTime||'',t.catName||''].join('|')); }
  // 이벤트 본문 — dueTime 있으면 1시간짜리 시간 일정(Asia/Seoul), 없으면 종일. 리마인더 없음(앱 FCM과 중복 방지).
  function _eventBody(t){
    const body={ summary:(t.catName?'['+t.catName+'] ':'')+(t.title||'할일'),
      description:(t.note?t.note+'\n\n':'')+'알뜰 할일',
      reminders:{useDefault:false},
      extendedProperties:{private:{atodoId:String(t.id)}} };
    if(t.dueTime){
      const st=new Date(t.dueDate+'T'+t.dueTime+':00+09:00');
      const en=new Date(st.getTime()+3600000);
      const kst=d=>new Date(d.getTime()+9*3600000).toISOString().slice(0,19);   // KST 벽시계 문자열(타임존은 필드로 명시)
      body.start={dateTime:kst(st), timeZone:'Asia/Seoul'};
      body.end={dateTime:kst(en), timeZone:'Asia/Seoul'};
    } else {
      body.start={date:t.dueDate};
      body.end={date:addDays(t.dueDate,1)};   // 구글 종일 일정 end는 배타(다음 날)
    }
    return body;
  }

  // "알뜰 할일" 보조 캘린더 확보 — 저장된 id가 구글에서 지워졌으면(404) 새로 만들고 map을 초기화(전량 재생성).
  async function _ensureCalendar(g){
    let calId=g.meta && g.meta.calendarId;
    if(calId){
      try{ await _api('GET','/calendars/'+encodeURIComponent(calId)); return calId; }
      catch(e){ if(e.code!==404 && e.code!==410) throw e; calId=null; await _gref('map').remove(); }
    }
    const cal=await _api('POST','/calendars',{ summary:'알뜰 할일', timeZone:'Asia/Seoul' });
    await _gref('meta').update({ calendarId:cal.id, connectedAt:(g.meta&&g.meta.connectedAt)||new Date().toISOString() });
    return cal.id;
  }
  // 다중 기기 경합 완화 — lock 트랜잭션(60초 스테일이면 탈취). 실패=다른 기기가 동기화 중 → 스킵.
  function _lock(){
    return _gref('lock').transaction(function(cur){
      if(cur && cur.at && Date.now()-cur.at<60000 && cur.by!==_devId) return;   // undefined 반환=abort
      return { at:Date.now(), by:_devId };
    }).then(r=>!!(r&&r.committed)).catch(()=>false);
  }

  // ---- 동기화 본체: 대상 ↔ 매핑 diff → insert/patch/delete(순차) ----
  async function gcalSyncNow(manual){
    if(!gcalConfigured() || !state || !state.uid) return;
    if(!gcalConnected()){ if(manual) toast('먼저 구글 계정을 연결해 주세요', true); return; }
    if(_busy){ _again=true; return; }
    _busy=true; _refreshSheet();
    let holdsLock=false;   // 🔒 내가 락을 실제로 잡았을 때만 finally에서 해제 — 안 그러면 획득 실패 시 다른 기기가 잡은 락을 지워 동시 동기화·중복 이벤트가 생김
    try{
      if(!await _token(!!manual)){ if(manual) toast('구글 재연결이 필요해요 — 다시 연결을 눌러 주세요', true); return; }
      holdsLock=await _lock(); if(!holdsLock) return;   // 다른 기기가 동기화 중
      const g=(await _gref().once('value')).val()||{};   // 리스너 지연과 무관하게 서버 값 기준으로 diff(경합 축소)
      const cal=await _ensureCalendar(g);
      const map=g.map||{}, tg=_targets();
      for(const mk in tg){
        const t=tg[mk].t, w=tg[mk].w, s=_sig(t), m=map[mk];
        if(!m){
          const ev=await _api('POST','/calendars/'+encodeURIComponent(cal)+'/events', _eventBody(t));
          await _gref('map/'+mk).set({ e:ev.id, s:s, w:w });
        } else if(m.s!==s){
          try{ await _api('PATCH','/calendars/'+encodeURIComponent(cal)+'/events/'+encodeURIComponent(m.e), _eventBody(t)); await _gref('map/'+mk+'/s').set(s); }
          catch(e){
            if(e.code===404||e.code===410){   // 구글에서 지워짐 → 단방향(앱이 소스)이라 재생성
              const ev=await _api('POST','/calendars/'+encodeURIComponent(cal)+'/events', _eventBody(t));
              await _gref('map/'+mk).set({ e:ev.id, s:s, w:w });
            } else throw e;
          }
        }
      }
      for(const mk in map){
        if(tg[mk]) continue;
        const m=map[mk]||{};
        if(m.w && m.w!==state.wsId) continue;   // 다른 그룹 ws 매핑은 지금 판단 불가(state.todos에 없음) — 그 ws 접속 시 반영(오삭제 방지)
        if(m.e){ try{ await _api('DELETE','/calendars/'+encodeURIComponent(cal)+'/events/'+encodeURIComponent(m.e)); }catch(e){ if(e.code!==404&&e.code!==410) throw e; } }
        await _gref('map/'+mk).remove();
      }
      await _gref('meta/lastSyncAt').set(new Date().toISOString());
      _needReconnect=false;
      if(manual) toast('구글캘린더와 동기화했어요');
    }catch(e){
      if(e && e.code===401){ _tok=null; _needReconnect=true; if(manual) toast('구글 로그인이 만료됐어요 — 다시 연결해 주세요', true); }
      else if(e && e.code===403){ if(manual) toast('구글캘린더 권한이 없어요 — 연동을 해제하고 다시 연결해 주세요', true); }
      else if(manual) toast('동기화 실패: '+((e&&e.message)||e), true);
    }finally{
      if(holdsLock){ try{ _gref('lock').remove(); }catch(e){} }   // 내가 잡은 락만 해제(남의 락 삭제 금지)
      _busy=false;
      if(_again){ _again=false; gcalKick(); }
      _refreshSheet();
    }
  }
  // 리스너 훅용 디바운스 킥(개인/그룹 todos 리스너·저장 직후 연쇄 호출을 2.5초로 합침)
  function gcalKick(){
    if(!gcalConfigured() || !gcalConnected()) return;
    clearTimeout(_kickT); _kickT=setTimeout(function(){ gcalSyncNow(false); }, 2500);
  }
  function initGcal(){ if(gcalConfigured() && gcalConnected()){ _bootKicked=true; gcalKick(); } }   // 로그인 후 1회(core.js)
  // users/{uid}/gcal 리스너 콜백 — 부팅 시 리스너가 initGcal보다 늦게 도착해도 최초 1회 킥 보장 + 열려 있는 시트 갱신
  function onGcalData(){ if(!_bootKicked && gcalConfigured() && gcalConnected()){ _bootKicked=true; gcalKick(); } _refreshSheet(); }

  // ---- 연결 / 해제 ----
  async function gcalConnect(){
    if(!gcalConfigured()){ toast('구글캘린더 연동이 설정되지 않았어요', true); return; }
    if(!await _token(true)){ toast('구글 연결에 실패했어요 — 팝업 차단을 확인해 주세요(안 되면 크롬 브라우저에서 시도)', true); return; }
    try{
      const g=(await _gref().once('value')).val()||{};
      await _ensureCalendar(g);
      if(!g.meta || !g.meta.connectedAt) await _gref('meta/connectedAt').set(new Date().toISOString());
      toast('구글 계정을 연결했어요 — 첫 동기화를 시작해요');
      _bootKicked=true;
      gcalSyncNow(true);
    }catch(e){ toast('연결 실패: '+((e&&e.message)||e), true); }
  }
  function gcalDisconnect(){
    const h='<p class="muted" style="margin:2px 2px 14px;line-height:1.6;">연동을 해제하면 자동 동기화가 멈춰요.<br>구글의 <b>\'알뜰 할일\' 캘린더</b>는 어떻게 할까요?</p>'+
      '<button class="btn danger" onclick="gcalDisconnectDo(1)">캘린더까지 삭제 (일정 모두 제거)</button>'+
      '<button class="btn ghost" style="margin-top:8px;" onclick="gcalDisconnectDo(0)">연결만 해제 (일정은 구글에 유지)</button>';
    openSheet('구글캘린더 연동 해제', h);
  }
  async function gcalDisconnectDo(delCal){
    try{
      if(delCal){
        const calId=state.gcal && state.gcal.meta && state.gcal.meta.calendarId;
        if(calId && await _token(true)){
          try{ await _api('DELETE','/calendars/'+encodeURIComponent(calId)); }catch(e){ if(e.code!==404&&e.code!==410) toast('캘린더 삭제 실패 — 연결만 해제할게요', true); }
        } else if(calId){ toast('구글 인증이 안 돼 캘린더는 남겨두고 연결만 해제해요', true); }
      }
      try{ if(_tok && window.google && google.accounts && google.accounts.oauth2 && google.accounts.oauth2.revoke) google.accounts.oauth2.revoke(_tok, function(){}); }catch(e){}
      _tok=null; _tokExp=0; _needReconnect=false; _silentBlocked=false;
      await _gref().remove();
      toast('구글캘린더 연동을 해제했어요'); closeSheet();
    }catch(e){ toast('해제 실패: '+((e&&e.message)||e), true); }
  }

  // ---- 연동 관리 시트 ----
  function _relTimeSafe(iso){ try{ return (typeof relTime==='function' && iso)?relTime(new Date(iso).getTime()):(iso?String(iso).slice(0,16).replace('T',' '):'-'); }catch(e){ return '-'; } }
  function openGcalSheet(){
    if(!gcalConfigured()){ toast('구글캘린더 연동이 설정되지 않았어요', true); return; }
    const icon=(typeof gcalSvg==='function')?gcalSvg({h:44}):'📅';
    const n=Object.keys(_targets()).length;
    let h='<span id="gcalSheetMark" style="display:none"></span>';
    h+='<div style="display:flex;justify-content:center;margin:6px 0 12px;">'+icon+'</div>';
    if(!gcalConnected()){
      h+='<p class="muted" style="text-align:center;margin:0 2px 6px;line-height:1.65;">구글 계정을 연결하면 <b>마감일 있는 내 할일</b>(개인 + 그룹에서 나에게 배정된 것)이<br>구글캘린더의 <b>\'알뜰 할일\'</b> 캘린더로 자동 동기화돼요.</p>';
      h+='<p class="muted" style="text-align:center;font-size:12px;margin:0 2px 14px;">지금 동기화 대상: <b>'+n+'개</b> · 완료·삭제하면 일정도 정리돼요</p>';
      h+='<button class="btn" onclick="gcalConnect()">구글 계정 연결</button>';
      h+='<p class="muted" style="font-size:11.5px;margin:12px 2px 0;line-height:1.6;">단방향 동기화예요 — 구글캘린더에서 일정을 고쳐도 앱엔 반영되지 않고, 다음 동기화 때 앱 내용으로 돌아가요. 연결 팝업이 안 뜨면 크롬 브라우저에서 열어 연결해 주세요.</p>';
    } else {
      const meta=state.gcal.meta||{};
      h+='<div class="card" style="padding:14px;">'+
        '<div class="row" style="padding:5px 0;"><span class="muted">상태</span><b>'+(_busy?'동기화 중…':(_needReconnect?'<span style="color:var(--expense)">재연결 필요</span>':'연결됨 ✓'))+'</b></div>'+
        '<div class="row" style="padding:5px 0;"><span class="muted">동기화 대상</span><b>'+n+'개</b></div>'+
        '<div class="row" style="padding:5px 0;"><span class="muted">마지막 동기화</span><b>'+_relTimeSafe(meta.lastSyncAt)+'</b></div></div>';
      if(_needReconnect) h+='<div class="tx-sub" style="margin:2px 2px 10px;">⚠️ 구글 로그인이 만료됐어요 — 아래 버튼을 누르면 다시 연결돼요.</div>';
      h+='<button class="btn"'+(_busy?' disabled':'')+' onclick="gcalSyncNow(true)">'+(_busy?'동기화 중…':(_needReconnect?'다시 연결하고 동기화':'지금 동기화'))+'</button>';
      h+='<button class="btn ghost" style="margin-top:8px;" onclick="gcalDisconnect()">연동 해제</button>';
      h+='<p class="muted" style="font-size:11.5px;margin:12px 2px 0;line-height:1.6;">할일을 저장·완료·삭제하면 잠시 후 자동 반영돼요(앱→구글 단방향). 반복 할일은 완료할 때마다 다음 회차 날짜로 일정이 이동해요. 다른 그룹의 할일은 그 그룹에 접속했을 때 반영돼요.</p>';
    }
    openSheet('구글캘린더 연동', h);
  }
  function _refreshSheet(){ try{ const sh=document.getElementById('sheet'); if(sh && sh.classList.contains('on') && document.getElementById('gcalSheetMark')) openGcalSheet(); }catch(e){} }

  // 전역 노출(HTML onclick·core 훅에서 호출)
  window.gcalConfigured=gcalConfigured; window.gcalConnected=gcalConnected;
  window.initGcal=initGcal; window.gcalKick=gcalKick; window.gcalSyncNow=gcalSyncNow; window.onGcalData=onGcalData;
  window.gcalConnect=gcalConnect; window.gcalDisconnect=gcalDisconnect; window.gcalDisconnectDo=gcalDisconnectDo;
  window.openGcalSheet=openGcalSheet;
})();
