// ===== 홈(달력/목록) =====
    // 💰 실수입 필터(수입 집계 공용) — '부채/자산 이동' 수입(대출 수령·원금회수: loanId + isActualExpense:false)만 제외한다.
    //  isActualExpense만으로 거르면 안 됨: 과거 buildTx가 ACTUAL_DEFAULT 미정의로 일반 수입도 전부 false로 저장하던 버그가 있어
    //  (2026-07-31 수정) 기존 데이터의 일반 수입까지 리포트에서 통째로 빠진다 — loanId 동반 여부로 판정해 과거 데이터도 복구.
    function realIncome(list){ return list.filter(t=>!(t.isActualExpense===false && t.loanId)); }
    function renderCalendar(){
      const m=state.month, allList=monthTx(m);
      const list = state.memberFilter ? allList.filter(t=>t.ownerUid===state.memberFilter) : allList;   // 멤버 칩 = '기록자(ownerUid)'별 필터(문서 features-ledger.md 기준) — 공동/수입 거래도 기록한 멤버 칩에 잡힘(예전 소비대상 t.user 기준이라 공동·수입이 어떤 칩에도 안 잡히던 버그 수정)
      const inc=sumBy(realIncome(list),'income');   // 원금회수 등 비실수입 제외(리포트와 동일)
      const actual=actualSpend(list);
      const refundTot=list.filter(t=>t.type==='refund').reduce((s,t)=>s+(Number(t.amount)||0),0);   // 💸 환불 — 합계에 반영(리포트 잔액과 동일 기준)
      const charge=sumBy(list,'prepaid_charge');
      const pspend=sumBy(list,'prepaid_spend')+sumBy(list,'point_spend');
      const [y,mo]=m.split('-').map(Number);
      let html='';

      html+=memberChipRow();
      // 시안 msum 형태 요약(연회색 박스, 수입/실제소비/합계 3칸)
      html+='<div class="msum">'+
        '<div><div class="k">수입</div><div class="v green">'+won(inc)+'</div></div>'+
        '<div class="sep"></div>'+
        '<div><div class="k">실제소비</div><div class="v red">'+won(actual)+'</div></div>'+
        '<div class="sep"></div>'+
        '<div><div class="k">합계</div><div class="v">'+won(inc-actual+refundTot)+'</div></div></div>';
      // 충전/선불 분리 보조행 + 예산 미니바 (우리 고유 정보 — 소비 착각 방지)
      html+='<div class="submeta"><span class="muted">충전 <b class="blue">'+won(charge)+'</b></span><span class="muted">선불·포인트 <b>'+won(pspend)+'</b></span><span class="muted">미사용잔액 <b class="blue">'+won(prepaidTotal())+'</b></span></div>';
      const tb=totalMonthlyBudget();
      if(tb && m===monthStr(new Date())){
        const u=budgetUsage(tb), c=budgetColor(u.pct);
        html+='<div class="budgetmini"><div class="row" style="font-size:12px;"><span class="muted">이번달 예산</span><span style="color:'+c+';font-weight:700;">'+u.pct+'%'+(u.pct>=100?' 초과':'')+'</span></div>'+
          '<div class="bar"><i style="width:'+Math.min(u.pct,100)+'%;background:'+c+'"></i></div>'+
          '<div class="tx-sub" style="margin-top:6px;">'+won(u.used)+' / '+won(u.amount)+'</div></div>';
      }

      html+='<div class="seg"><button class="'+(state.homeView==='calendar'?'on':'')+'" '+App.view.act('setHomeView','calendar')+'>달력</button>'+
        '<button class="'+(state.homeView==='list'?'on':'')+'" '+App.view.act('setHomeView','list')+'>목록</button></div>';

      if(state.homeView==='calendar'){
        html+='<div class="monthlbl"><button '+App.view.act('moveMonth',-1)+'>‹</button><b>'+y+'년 '+mo+'월</b><button '+App.view.act('moveMonth',1)+'>›</button></div>';
        html+=calendarGridHtml(y,mo,list);
        html+=selectedDayHtml(list);
      } else {
        html+=listHtml(list);
      }

      // 다가오는 반복결제
      const upcoming=upcomingRecurring();
      if(upcoming.length){
        html+='<div class="sec-title">🔁 다가오는 반복결제</div><div class="card">';
        html+=upcoming.map(u=>'<div class="row" style="padding:7px 4px;"><span>'+escapeHtml(u.rule.desc)+'<span class="pill">'+pad2(u.date.getMonth()+1)+'/'+pad2(u.date.getDate())+'</span></span><span class="red" style="font-weight:700;">'+won(u.rule.amount)+'</span></div>').join('');
        html+='</div>';
      }
      $('content').innerHTML=html;
    }
    function setHomeView(v){ state.homeView=v; renderCalendar(); }
    function moveMonth(d){ state.month=shiftMonth(state.month,d);
      // 인라인 선택일을 새 달에 맞춤(이번달이면 오늘, 아니면 1일)
      state.selectedDate = (state.month===monthStr(new Date())) ? todayStr() : (state.month+'-01');
      renderCalendar(); }
    function selectDay(ds){ state.selectedDate=ds; renderCalendar(); }
    function setFilter(k,v){ state.filter[k]=v; renderCalendar(); }
    // 달력 아래 선택일 거래 인라인(시안 sech + tx 행)
    function selectedDayHtml(list){
      const ds=state.selectedDate||todayStr(), dt=parseDate(ds);
      const rows=list.filter(t=>(t.date||'').startsWith(ds)).sort((a,b)=>new Date(b.date)-new Date(a.date));
      const gi=sumBy(rows,'income'), ge=sumBy(rows,'expense'), isToday=ds===todayStr();
      let h='<div class="sech"><span class="l">'+(isToday?'오늘 · ':'')+(dt.getMonth()+1)+'월 '+dt.getDate()+'일 ('+WEEK[dt.getDay()]+')</span>'+
        '<span class="s">'+(ge?'<span class="red">-'+ge.toLocaleString()+'</span>':'')+(gi?' <span class="green">+'+gi.toLocaleString()+'</span>':'')+'</span></div>';
      const _fp=txMetaFP();
      h+= rows.length ? '<div>'+rows.map(t=>txRowMemo(t,_fp)).join('')+'</div>' : '<div class="empty">이 날 거래가 없습니다</div>';
      return h;
    }

    // 달력 상단 멤버 칩(그룹 전용) — 기록자(t.user) 기준 필터
    function memberChipRow(){
      const ws=state.wsMeta||{};
      if(ws.type!=='group') return '';
      const members=ws.members||{}, uids=Object.keys(members);
      if(uids.length<2) return '';
      const cur=state.memberFilter;
      let h='<div class="mrow">';
      h+='<button class="mchip'+(cur===''?' on':'')+'" '+App.view.act('clearMemberFilter')+'><span class="avatar" style="width:24px;height:24px;background:'+avatarGrad('all')+';"></span>전체</button>';
      uids.forEach(uid=>{ const nm=members[uid].name||'멤버';
        h+='<button class="mchip'+(cur===uid&&cur?' on':'')+'" '+App.view.act('setMemberFilterByUid',uid)+'>'+avatarHtml(uid, nm, 24)+escapeHtml(nm)+'</button>'; });
      h+='</div>';
      return h;
    }
    function clearMemberFilter(){ state.memberFilter=''; renderCalendar(); }
    function setMemberFilterByUid(uid){ state.memberFilter=(state.memberFilter===uid&&uid)?'':uid; renderCalendar(); }   // 기록자 uid로 필터(토글) — uid 저장이라 개명·동명이인에 견고

    // 📅 달력 시작 요일(기기 설정, localStorage) — 기본 'mon'(월화수…일), 'sun'이면 일월화…토. 가계부·할일 캘린더 공용.
    function weekStartSun(){ try{ return localStorage.getItem('calWeekStart')==='sun'; }catch(e){ return false; } }
    function toggleWeekStart(){ try{ localStorage.setItem('calWeekStart', weekStartSun()?'mon':'sun'); }catch(e){} if(typeof rerender==='function') rerender(); }
    // 캘린더 요일 헤더 + 1일 오프셋 — 시작 요일 설정을 반영해 두 캘린더가 공유
    function calHeadHtml(){
      const sun=weekStartSun(); const HEAD=sun?['일','월','화','수','목','금','토']:['월','화','수','목','금','토','일'];
      return '<div class="cal-head">'+HEAD.map(function(w,i){ const wd=(i+(sun?0:1))%7; return '<div class="'+(wd===0?'sun':wd===6?'sat':'')+'">'+w+'</div>'; }).join('')+'</div>';
    }
    function calFirstOffset(y,mo){ return (new Date(y,mo-1,1).getDay()+(weekStartSun()?0:6))%7; }
    function calendarGridHtml(y,mo,list){
      // 일별 카테고리 색 점(시안풍) — 최대 3색
      const buckets={};
      list.forEach(t=>{ const day=(t.date||'').substring(0,10); const b=(buckets[day]=buckets[day]||{colors:[]});
        let col;
        if(['expense','prepaid_spend','point_spend'].includes(t.type)) col=t.category?catColor(t.category):'var(--expense)';
        else if(['income','refund','point_earn'].includes(t.type)) col=t.category?catColor(t.category):'var(--income)';
        else col='var(--transfer)';
        if(col && b.colors.indexOf(col)<0 && b.colors.length<3) b.colors.push(col);
      });
      // 시작 요일은 설정(달력 시작 요일)을 따름 — 기본 월요일 시작(시안 1:1). WEEK 상수(getDay 인덱스)는 그대로.
      const first=calFirstOffset(y,mo);
      const days=new Date(y,mo,0).getDate();
      const todayS=todayStr();
      let h='<div class="calwrap">'+calHeadHtml()+'<div class="cal-grid">';
      for(let i=0;i<first;i++) h+='<div class="cal-cell dim"></div>';
      for(let d=1;d<=days;d++){
        const ds=y+'-'+pad2(mo)+'-'+pad2(d);
        const wd=new Date(y,mo-1,d).getDay();   // 0=일..6=토
        const dcls='d'+(wd===0?' sun':(wd===6?' sat':''));
        const b=buckets[ds];
        const cls='cal-cell'+(ds===todayS?' today':'')+(ds===state.selectedDate?' sel':'');
        const dots=(b&&b.colors.length)?'<span class="dotrow">'+b.colors.map(c=>'<i style="background:'+c+'"></i>').join('')+'</span>':'';
        h+='<div class="'+cls+'" '+App.view.act('selectDay',ds)+'><div class="'+dcls+'">'+d+'</div>'+dots+'</div>';
      }
      h+='</div></div>';
      return h;
    }
    function shortNum(n){ if(n>=10000) return Math.round(n/10000*10)/10+'만'; if(n>=1000) return Math.round(n/1000)+'천'; return n; }

    function listHtml(list){
      // 필터 칩
      let h='<div class="chip-row">';
      const types=[['','전체'],['expense','지출'],['income','수입'],['transfer','이체']];
      h+=types.map(t=>'<button class="chip '+(state.filter.type===t[0]?'on':'')+'" '+App.view.act('setFilter','type',t[0])+'>'+t[1]+'</button>').join('');
      h+='<button class="chip srch" '+App.view.act('openTxSearch')+' aria-label="거래 검색"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>검색</button>';
      h+='</div>';
      const f=state.filter;
      let rows=list.filter(t=>{
        if(f.type&&t.type!==f.type) return false;
        if(f.keyword){ const k=f.keyword.toLowerCase(); if(!((t.desc||'').toLowerCase().includes(k)||(t.memo||'').toLowerCase().includes(k)||(t.category||'').toLowerCase().includes(k))) return false; }
        return true;
      }).sort((a,b)=>new Date(b.date)-new Date(a.date));
      if(!rows.length) return h+'<div class="empty">거래가 없습니다</div>';
      // 일자별 그룹
      const groups={}, _fp=txMetaFP();
      rows.forEach(t=>{ const d=(t.date||'').substring(0,10); (groups[d]=groups[d]||[]).push(t); });
      Object.keys(groups).sort().reverse().forEach(d=>{
        const dt=parseDate(d), gi=sumBy(groups[d],'income'), ge=sumBy(groups[d],'expense');
        h+='<div class="day-group"><div class="day-head"><span>'+pad2(dt.getMonth()+1)+'월 '+pad2(dt.getDate())+'일 ('+WEEK[dt.getDay()]+')</span><span>'+(ge?'<span class="red">-'+ge.toLocaleString()+'</span> ':'')+(gi?'<span class="green">+'+gi.toLocaleString()+'</span>':'')+'</span></div><div class="card" style="padding:6px 10px;">';
        h+=groups[d].map(t=>txRowMemo(t,_fp)).join('');
        h+='</div></div>';
      });
      return h;
    }

    // 🔍 거래 검색(키워드=내용·메모·카테고리 + 기간 + 금액 + 타입). 순수 txMatches로 필터, 폼은 정적·결과만 갱신(입력 포커스 유지).
    let _txSearchT=0;   // 🔋 검색 결과 렌더 디바운스 타이머
    function _txSearchRender(){ const r=$('txsResults'); if(r) r.innerHTML=txSearchResults(); }
    function txSearchResults(){
      const q=state._txSearch||{};
      const res=(state.transactions||[]).filter(t=>txMatches(t,q)).sort((a,b)=>new Date(b.date)-new Date(a.date));
      const _fp=txMetaFP();
      const rows=res.slice(0,200).map(t=>txRowMemo(t,_fp)).join('');
      return '<div class="sech"><span class="l">결과</span><span class="s">'+res.length+'건'+(res.length>200?' · 200 표시':'')+'</span></div>'+
        '<div class="card" style="padding:6px 10px;">'+(rows||'<div class="empty">검색 결과가 없어요</div>')+'</div>';
    }
    function txSearchSet(k,v){ (state._txSearch||(state._txSearch={}))[k]=v;
      if(k==='type'){ const seg=$('txsSeg'); if(seg) Array.prototype.forEach.call(seg.querySelectorAll('.chip'),b=>b.classList.toggle('on',(b.getAttribute('data-t')||'')===(v||''))); }
      if(k==='type'){ clearTimeout(_txSearchT); _txSearchRender(); }   // 칩 토글은 즉시
      else { clearTimeout(_txSearchT); _txSearchT=setTimeout(_txSearchRender, 180); } }   // 🔋 타이핑 디바운스 — 매 키 입력마다 전체 거래 필터·200행 재빌드 방지
    function openTxSearch(){
      const st=state._txSearch||(state._txSearch={});
      let h='<div class="field"><label for="txsKw">키워드(내용·메모·카테고리)</label><input class="input" id="txsKw" value="'+escapeHtml(st.keyword||'')+'" oninput="txSearchSet(\'keyword\',this.value)" placeholder="예: 커피, 회식"></div>'+
        '<div class="row" style="gap:8px;"><div class="field" style="flex:1;"><label>시작일</label><input class="input" type="date" value="'+(st.dateFrom||'')+'" onchange="txSearchSet(\'dateFrom\',this.value)"></div>'+
        '<div class="field" style="flex:1;"><label>종료일</label><input class="input" type="date" value="'+(st.dateTo||'')+'" onchange="txSearchSet(\'dateTo\',this.value)"></div></div>'+
        '<div class="row" style="gap:8px;"><div class="field" style="flex:1;"><label>최소 금액</label><input class="input" inputmode="numeric" value="'+(st.amountMin||'')+'" oninput="txSearchSet(\'amountMin\',this.value.replace(/[^0-9]/g,\'\'))"></div>'+
        '<div class="field" style="flex:1;"><label>최대 금액</label><input class="input" inputmode="numeric" value="'+(st.amountMax||'')+'" oninput="txSearchSet(\'amountMax\',this.value.replace(/[^0-9]/g,\'\'))"></div></div>'+
        '<div class="chip-row" id="txsSeg">'+[['','전체'],['expense','지출'],['income','수입'],['transfer','이체']].map(t=>'<button class="chip '+((st.type||'')===t[0]?'on':'')+'" data-t="'+t[0]+'" '+App.view.act('txSearchSet','type',t[0])+'>'+t[1]+'</button>').join('')+'</div>'+
        '<div id="txsResults">'+txSearchResults()+'</div>';
      openSheet('거래 검색', h);
    }
    const TX_SVG_KEY={ income:'wallet', expense:'card', transfer:'swap', prepaid_charge:'coin', prepaid_spend:'card', refund:'refund', point_earn:'coin', point_spend:'coin', balance_adjustment:'tag' };
    function txRowHtml(t){
      const e=TX_EFFECT[t.type]||{};
      let sign='', cls='muted';
      if(t.type==='expense'){ sign='-'; cls='red'; }
      else if(t.type==='prepaid_spend'||t.type==='point_spend'){ sign='-'; cls='red'; }
      else if(t.type==='income'||t.type==='refund'||t.type==='point_earn'){ sign='+'; cls='green'; }
      else if(t.type==='prepaid_charge'){ sign=''; cls='blue'; }
      else if(t.type==='balance_adjustment'){ const av=Number(t.amount)||0; sign=av<0?'-':'+'; cls=av<0?'red':'green'; }   // 잔액조정: 저장된 부호(감액=음수)를 표시 — 증액/감액 구분
      // 아이콘 타일: 카테고리 거래 → 옅은 tint 타일 + 카테고리 라인 아이콘 / 그 외 → 중립 회색 타일 + 유형 아이콘
      let tileStyle='', tileInner;
      if(t.category && (getCat(t.category)||CAT_META[t.category])){ tileStyle=catTileStyle(t.category); tileInner=catSvgIcon(t.category); }
      else { tileInner=svgWrap(CAT_SVG[TX_SVG_KEY[t.type]||'tag']); }
      let sub;
      const _cat=escapeHtml(t.category||''), _afrom=escapeHtml(acctName(t.from)), _ato=escapeHtml(acctName(t.to));   // 🔒 사용자 문자열(카테고리·계좌명)은 innerHTML 삽입 전 escape — 저장형 XSS 방지
      if(e.debit&&e.credit) sub=(t.category&&t.category!=='기타'?_cat+' · ':'')+_afrom+' → '+_ato;
      else if(t.type==='expense'||t.type==='income'){ const _a=(t.type==='expense'?_afrom:_ato); sub=(t.category?_cat:TYPE_LABEL[t.type])+(_a?' · '+_a:''); }   // 카테고리 · 결제/입금 수단 — 어떤 수단으로 냈는지 목록에서 바로 보이게(사용자 요청, 구 '계좌는 상세에서' 폐기)
      else if(e.credit&&!e.debit) sub=_ato;
      else sub=(t.category?_cat+' · ':'')+_afrom;
      if(!['expense','income','transfer'].includes(t.type)) sub=TYPE_LABEL[t.type]+' · '+sub;
      sub+=' · '+escapeHtml(ownerName(t.user||''));   // t.user(소비 대상)도 멤버 uid로 저장될 수 있어 ownerName으로 이름 해석
      const rec=t.recurringId?'<span class="pill">🔁</span>':'';
      const cardPill=(getCard(t.from)&&(t.type==='expense'||t.type==='prepaid_charge')&&t.cardPerformanceIncluded===false)?'<span class="pill">실적제외</span>':'';
      const pbPill=t.purposeBookId?'<span class="pill">'+escapeHtml(t.purposeBookName||'목적')+'</span>':'';
      const giftPill=t.giftEventId?'<span class="pill">🎁 경조사</span>':'';
      const loanPill=t.loanId?'<span class="pill">🏦 대출</span>':'';
      const coPill=(t.coPayTxId||t.coPayMainId)?'<span class="pill">✨ 함께결제</span>':'';   // 💳+✨ 포인트·선불과 나눠 낸 거래(양쪽 행 모두 표시)
      const schedPill=((t.date||'').slice(0,10) > todayStr())?'<span class="pill" style="color:var(--primary);border-color:var(--primary);">📅 예정</span>':'';   // 미래 날짜 = 예정(현재 잔액 미반영)
      const amtNum=Math.abs(Number(t.amount)||0).toLocaleString();
      return '<div class="tx'+(schedPill?' tx-sched':'')+'" '+App.view.act('openTxSheet',t.ownerUid,t.id)+'>'+
        '<div class="tx-ic" style="'+tileStyle+'">'+tileInner+'</div>'+
        '<div class="tx-main"><div class="tx-title">'+escapeHtml(t.desc||'')+schedPill+rec+cardPill+pbPill+giftPill+loanPill+coPill+'</div><div class="tx-sub">'+sub+'</div></div>'+
        '<div class="tx-amt '+cls+'">'+sign+'₩'+amtNum+((t.currency&&t.currency!=='KRW')?'<span class="tx-fx">'+escapeHtml(fmtForeign(t.foreignAmount,t.currency))+'</span>':'')+'</div></div>';
    }

    // ⚡ 거래 행 HTML 메모이제이션 — 렌더마다 수백 행 SVG/escape/포맷을 재생성하던 비용 제거.
    //  키 설계(안전 최우선): 외부 의존(계좌·카드·카테고리·워크스페이스 멤버 이름)을 렌더당 1회 '메타 지문'으로 만들어, 그게 바뀌면 캐시 전체를 버린다 → 카테고리/계좌/멤버 이름 변경 시 stale 방지.
    //  그 외엔 tx 객체 값 전체(JSON)를 서명으로 → tx의 어떤 필드가 바뀌어도 자동 무효화(누락 필드 걱정 없음). 안 바뀐 행은 캐시 HTML 재사용.
    let _txRowCache={}, _txCacheFP=null;
    function txMetaFP(){ return JSON.stringify(state.accounts||[])+'|'+JSON.stringify(state.creditCards||[])+'|'+JSON.stringify(state.categories||[])+'|'+JSON.stringify((state.wsMeta&&state.wsMeta.members)||{}); }
    function txRowMemo(t, fp){
      if(fp!==_txCacheFP){ _txRowCache={}; _txCacheFP=fp; }   // 외부 의존 변경 → 전체 무효화(계좌·카테고리·카드·멤버 편집은 드묾)
      const id=t.id, c=_txRowCache[id], sig=JSON.stringify(t);
      if(c && c.sig===sig) return c.html;
      const html=txRowHtml(t); _txRowCache[id]={sig, html}; return html;
    }
    function upcomingRecurring(){
      const out=[];
      state.recurring.filter(r=>ruleStatus(r)==='active' && canSee(r)).forEach(r=>{ const n=nextOccurrence(r); if(n){ const diff=(n-parseDate(todayStr()))/86400000; if(diff>=0&&diff<=7) out.push({rule:r,date:n}); } });
      return out.sort((a,b)=>a.date-b.date);
    }

    // ===== 일자 상세 시트 =====
    function openDaySheet(ds){
      state.selectedDate=ds;
      const dt=parseDate(ds);
      const rows=state.transactions.filter(t=>(t.date||'').startsWith(ds)).sort((a,b)=>new Date(b.date)-new Date(a.date));
      const gi=sumBy(rows,'income'), ge=sumBy(rows,'expense');
      let h='<div class="row" style="margin-bottom:14px;"><div class="muted">'+dt.getFullYear()+'.'+pad2(dt.getMonth()+1)+'.'+pad2(dt.getDate())+' ('+WEEK[dt.getDay()]+')</div>'+
        '<div>'+(ge?'<span class="red" style="font-weight:700;">-'+ge.toLocaleString()+'</span> ':'')+(gi?'<span class="green" style="font-weight:700;">+'+gi.toLocaleString()+'</span>':'')+'</div></div>';
      h+='<div class="card" style="padding:6px 10px;">'+(rows.length?rows.map(txRowHtml).join(''):'<div class="empty">이 날 거래가 없습니다</div>')+'</div>';
      h+='<button class="btn" '+App.view.act('openTxSheet',null,null,ds)+'>+ 이 날짜에 추가</button>';
      openSheet(pad2(dt.getMonth()+1)+'월 '+pad2(dt.getDate())+'일', h);
      state._sheetReopen=()=>openDaySheet(ds);   // ↩️ 거래 수정 시트 닫으면 이 일자 시트로 복귀
    }

    // ===== 거래 입력/수정 시트 =====
    // 🧠 최근 선택 기억 — 새 거래의 결제수단(from/to)·소비대상을 사용자·워크스페이스별로 기억해 기본값으로 채운다(변경은 기존처럼 셀렉트에서).
    //    저장소: localStorage 'txlast:{wsId}:{uid}' = { [거래유형]: {from,to,user} } — 이 기기·이 사용자 한정, 새 거래 저장 시 갱신(수정은 제외).
    function txLastKey(){ return 'txlast:'+(state.wsId||'')+':'+(state.uid||''); }
    function txLastOf(type){
      let v={}; try{ v=(JSON.parse(localStorage.getItem(txLastKey())||'{}')||{})[type]||{}; }catch(e){}
      const mem=(state.wsMeta&&state.wsMeta.members)||{};
      return { from:(v.from&&getAcct(v.from))?v.from:'', to:(v.to&&getAcct(v.to))?v.to:'',   // 삭제된 계좌 방어
        user:(v.user==='공동'||mem[v.user])?v.user:'' };                                      // 탈퇴 멤버 방어(uid 노출 방지)
    }
    function txLastRemember(tx){
      try{ const m=JSON.parse(localStorage.getItem(txLastKey())||'{}')||{};
        m[tx.type]={ from:tx.from||'', to:tx.to||'', user:tx.userUid||(tx.user==='공동'?'공동':'') };
        localStorage.setItem(txLastKey(), JSON.stringify(m)); }catch(e){}
    }
    // 유형 전환 시(새 거래만) 그 유형의 최근 선택을 '아직 손대지 않은' 필드에만 적용 — 사용자가 고른 값은 유지
    function applyTxLastFor(type){
      if(sheetTx) return; const sh=$('sheet'); if(!sh||!sh._touched) return;
      const l=txLastOf(type);
      if(!sh._touched.from && l.from) sh._from=l.from;
      if(!sh._touched.to && l.to) sh._to=l.to;
      if(!sh._touched.user && l.user) sh._consumer=l.user;
    }
    // ⚡ 자주 쓰는 거래 원탭 — openTxSheet(새 거래)가 채운 후보(_txTpl)를 탭하면 유형·금액·설명·카테고리 + 최근 같은 거래의 수단·소비대상까지 프리필
    let _txTpl=[];
    function applyTxTemplate(i){
      const s=_txTpl[Number(i)]; if(!s) return; const sh=$('sheet'); if(!sh) return;
      sheetType=s.type; if(s.category) sheetCat=s.category;
      // 🔒 결제수단·소비대상 우선순위: 직접 고른 값(touched) > 🧠 최근 기억(txlast) > 과거 거래 복원 —
      //  예전엔 과거 거래 값이 최근 기억을 덮어써, 옛날에 다른 계좌로 내던 가게를 탭하면 그 옛 계좌로 저장되던 버그(실사례: 구근 카드 대신 현경 계좌).
      const last=txLastOf(s.type);
      const src=state.transactions.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''))
        .find(t=>t.type===s.type && (t.desc||'').trim()===s.desc && (Number(t.amount)||0)===s.amount);
      if(!sh._touched.from){ if(last.from) sh._from=last.from; else if(src&&src.from&&getAcct(src.from)) sh._from=src.from; }
      if(!sh._touched.user){
        const mem=(state.wsMeta&&state.wsMeta.members)||{};
        const cu=src?(src.userUid||(src.user==='공동'?'공동':'')):'';
        if(last.user) sh._consumer=last.user; else if(cu&&(cu==='공동'||mem[cu])) sh._consumer=cu;
      }
      if(sh._cur==='KRW'){ const a=$('sAmount'); if(a) a.value=s.amount?Number(s.amount).toLocaleString():''; }
      const d=$('sDesc'); if(d) d.value=s.desc;
      const sug=$('sDescSug'); if(sug) sug.innerHTML='';
      highlightTypeSeg(); renderTxDyn(); updateCoPayNote();
    }
    // ✍️ 설명 자동완성(새 거래만) — 입력 중 과거 거래에서 같은 설명을 찾아 칩으로 제안, 탭하면 카테고리·수단·(빈 경우)금액까지 유추 채움
    let _descSugT=0;
    function onDescInput(){ clearTimeout(_descSugT); _descSugT=setTimeout(renderDescSug, 150); }
    function renderDescSug(){
      const box=$('sDescSug'); if(!box) return; const sh=$('sheet');
      const kw=(val('sDesc')||'').trim().toLowerCase();
      if(!kw){ box.innerHTML=''; sh._descSug=null; return; }
      const fam=catTypeFor(sheetType);
      const seen={}, out=[];
      const list=state.transactions.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
      for(let k=0;k<list.length && out.length<3;k++){ const t=list[k];
        if(catTypeFor(t.type)!==fam) continue;   // 같은 성격(지출/수입)만 제안
        const dd=(t.desc||'').trim(); if(!dd || seen[dd]) continue;
        if(dd.toLowerCase().indexOf(kw)<0) continue;
        seen[dd]=1;
        out.push({ desc:dd, type:t.type, category:t.category||'', from:t.from||'', to:t.to||'', amount:Number(t.amount)||0 });
      }
      sh._descSug=out;
      box.innerHTML=out.length?out.map((s,i)=>'<button class="chip" '+App.view.act('applyDescSug',i)+'>'+escapeHtml(s.desc)+(s.category?' <span class="tx-sub">'+escapeHtml(s.category)+'</span>':'')+'</button>').join(''):'';
    }
    function applyDescSug(i){
      const sh=$('sheet'); const s=sh._descSug&&sh._descSug[Number(i)]; if(!s) return;
      const el=$('sDesc'); if(el) el.value=s.desc;
      if(s.category) sheetCat=s.category;
      // 🔒 결제수단은 직접 고른 값 > 🧠 최근 기억 > 과거 거래 값 순 — 과거 값이 최근 기억을 덮지 않게(템플릿과 동일 수정)
      const last=txLastOf(sheetType);
      if(!sh._touched.from){ if(last.from) sh._from=last.from; else if(s.from&&getAcct(s.from)) sh._from=s.from; }
      if(!sh._touched.to){ if(last.to) sh._to=last.to; else if(s.to&&getAcct(s.to)) sh._to=s.to; }
      if(sh._cur==='KRW' && !parseAmount(val('sAmount')) && s.amount){ const a=$('sAmount'); if(a) a.value=Number(s.amount).toLocaleString(); }
      const box=$('sDescSug'); if(box) box.innerHTML=''; sh._descSug=null;
      renderTxDyn(); updateCoPayNote();
    }
    // 계좌/소비대상 셀렉트 변경 훅 — 선택을 sheet 상태에 동기화(유형 전환에도 유지)하고 '손댐' 표시
    function onTxAcctChange(){ const sh=$('sheet'); if(!sh) return;
      if($('sFrom')) sh._from=val('sFrom'); if($('sTo')) sh._to=val('sTo');
      if(this&&this.id==='sFrom') sh._touched.from=true; if(this&&this.id==='sTo') sh._touched.to=true;
      renderCardPerfBlock(); }
    function onTxConsumerChange(){ const sh=$('sheet'); if(!sh) return; sh._consumer=val('sConsumer'); sh._touched.user=true; }
    function onTxActualChange(){ const sh=$('sheet'); if(!sh) return; sh._actual=!!($('sActual')&&$('sActual').classList.contains('on')); }   // 📊 실소비 토글 → 시트 상태 동기화(유형 전환에도 유지)
    // 💐 경조사 카테고리 판정 — 기본 '경조사' 카테고리는 type이 'expense'(event 아님)라 이름으로도 본다(type 검사만으론 제안이 안 뜨던 버그).
    function isGiftCat(c){ return !!(c && (c.type==='event' || String(c.name||'').indexOf('경조사')>=0)); }
    // 💐 경조사 카테고리 지출 저장 → 경조사비 장부 기록 제안 — 금액·날짜 프리필, '가계부 거래로도 기록' 스위치는 꺼서 중복 방지(거래는 방금 저장됨)
    function maybeSuggestGiftEvent(tx){
      try{
        if(!tx || tx.giftEventId) return false;
        if(catTypeFor(tx.type)!=='expense') return false;
        const c=tx.category?getCat(tx.category):null; if(!isGiftCat(c)) return false;
        const amt=Number(tx.amount)||0, date=(tx.date||'').slice(0,10);
        const back=state._sheetReopen||null;
        confirmSheet('💐 경조사 지출을 저장했어요. 경조사비 장부에도 기록할까요? (상대·경조사 유형을 이어서 입력)', function(){
          openGiftEdit(null, { amount:amt, date:date });
          setTimeout(function(){ const sw=$('gTx'); if(sw&&sw.classList.contains('on')){ sw.classList.remove('on'); toggleGiftAcct(); } }, 60);
        }, { okLabel:'장부에 기록', danger:false, title:'💐 경조사비' });
        if(back) state._sheetBackFn=back;
        return true;
      }catch(e){ return false; }
    }
    function openTxSheet(ownerUid, id, presetDate, presetPb){
      // ↩️ 리스트 시트(일자·카드내역·드릴다운 등 _sheetReopen 등록 시트) 위에서 열리면, 닫을 때 그 리스트로 복귀하게 캡처(아래에서 arm).
      //    이미 arm된 상태에서 수정 시트가 다시 열려도(재렌더) 기존 복귀 대상을 유지한다.
      const _backSheet = document.body.classList.contains('sheet-open') ? (state._sheetReopen||state._sheetBackFn||null) : null;
      let t=null;
      if(ownerUid && id) t=state.transactions.find(x=>x.ownerUid===ownerUid&&x.id===id);
      sheetTx = t?{ownerUid:t.ownerUid,id:t.id}:null;
      sheetType = t?t.type:'expense';
      sheetCat = t?(t.category||''):'';
      const date = t?(t.date||'').substring(0,10):(presetDate||state.selectedDate||todayStr());
      // 💳+✨ 함께결제로 저장된 거래는 '총액'으로 되돌려 보여준다(본 거래 금액 + 짝 거래의 포인트 사용액).
      //  보조(포인트) 거래를 직접 열었다면 본 거래 쪽으로 안내만 하고 단독 편집(짝 정보는 아래 배너)으로 둔다.
      const coPart = t?coPayPartner(t):null;
      const amount = t?(Math.abs(Number(t.amount)||0)+(coPart?Math.abs(Number(coPart.amount)||0):0)):'';
      const desc = t?(t.desc||''):'';
      const memo = t?(t.memo||''):'';
      const pbId = t?(t.purposeBookId||''):(presetPb||'');
      const settleInc = t?(t.settlementIncluded===true):false;
      const activePbs = state.purposeBooks.filter(p=>canSee(p) && (p.status||'active')==='active');

      let h='';
      // 💳+✨ 함께결제의 '포인트 쪽' 거래를 열었을 때 — 이 거래만 고치면 총액이 어긋나므로 본 거래로 안내
      if(t && t.coPayMainId){ const _mn=state.transactions.find(x=>x.ownerUid===t.ownerUid && x.id===t.coPayMainId);
        h+='<div class="copay-banner">✨ 함께결제로 기록된 <b>포인트·선불 사용분</b>이에요.'+
          (_mn?(' 총액·나머지 결제분은 <b>본 거래</b>에서 함께 고칠 수 있어요.<button class="chip" style="margin-left:6px;" '+App.view.act('openTxSheet',_mn.ownerUid,_mn.id)+'>본 거래 열기</button>'):'')+'</div>'; }
      // ⚡ 자주 쓰는 거래 원탭(새 거래만) — (설명·카테고리·금액) 빈도 상위 후보 칩, 탭하면 폼 전체 프리필(frequentTxTemplates 재사용)
      _txTpl = t?[]:frequentTxTemplates(state.transactions, 3).filter(x=>x.count>=2);
      if(_txTpl.length) h+='<div class="chips" style="margin:0 0 8px;">'+_txTpl.map((s,i)=>'<button class="chip" '+App.view.act('applyTxTemplate',i)+' aria-label="빠른 입력: '+escapeHtml(s.desc)+'">⚡ '+escapeHtml(s.desc)+' <span class="tx-sub">'+won(s.amount)+'</span></button>').join('')+'</div>';
      h+='<div class="type-seg" id="sTypeSeg">'+
        '<button data-tp="expense" '+App.view.act('setSheetType','expense')+'>지출</button>'+
        '<button data-tp="income" '+App.view.act('setSheetType','income')+'>수입</button>'+
        '<button data-tp="transfer" '+App.view.act('setSheetType','transfer')+'>이체</button>'+
        '<button data-tp="__ext__" '+App.view.act('setSheetType','__ext__')+'>선불·포인트</button></div>';
      // 시안: 큰 금액 + 키패드 입력
      // 금액: 모바일은 화면 키패드(OS 키보드 안 뜨게 readonly+inputmode none), 데스크톱은 물리 키보드로 직접 입력(keydown 라우팅).
      h+='<div class="amtbig"><select id="sCur" class="amt-cur" '+App.view.chg('onCurChange')+'>'+curOptions(t&&t.currency?t.currency:'KRW')+'</select><input id="sAmount" class="amtbig-in" readonly inputmode="none" aria-label="금액" placeholder="0" onkeydown="kpKey(event)" onpaste="kpPaste(event)" value="'+((t&&t.currency&&t.currency!=='KRW')?fmtAmt(String(t.foreignAmount||'')):(amount?Number(amount).toLocaleString():''))+'"></div>';
      h+='<div id="sFx" class="fxrow" style="display:none;"></div>';
      h+='<div id="sCatChips"></div>';   // 카테고리 칩(유형별)
      h+='<div id="sDyn"></div>';        // 계좌/이체 행
      h+='<div class="txfield"><span class="k">날짜</span><input type="date" class="txin" id="sDate" value="'+date+'" '+App.view.chg('onDateChange')+'></div>';
      h+='<div class="txfield"><span class="k">설명</span><input type="text" class="txin" id="sDesc" placeholder="내용" value="'+escapeHtml(desc)+'"'+(t?'':' oninput="onDescInput()"')+'></div>';
      if(!t) h+='<div id="sDescSug" class="chips" style="margin:2px 0 6px;"></div>';   // ✍️ 설명 자동완성 제안 칩(새 거래만)
      // 숫자 키패드
      h+='<div class="kp">'+
        [1,2,3,4,5,6,7,8,9].map(n=>'<button '+App.view.act('kpPress',String(n))+'>'+n+'</button>').join('')+
        '<button '+App.view.act('kpPress','.')+' aria-label="소수점">.</button><button '+App.view.act('kpPress','0')+'>0</button><button '+App.view.act('kpDel')+' aria-label="지우기">⌫</button></div>';
      // 우리 고유 기능 → 상세 설정 접기
      h+='<details class="adv" id="sAdv"'+((pbId||settleInc)?' open':'')+'><summary>상세 설정</summary>';
      h+='<div class="txfield"><span class="k">목적별 가계부</span><select class="txsel" id="sPb" '+App.view.chg('onPbChange')+'>'+
        '<option value="">연결 안 함</option>'+
        activePbs.map(p=>'<option value="'+p.id+'"'+(p.id===pbId?' selected':'')+'>'+(p.icon||'📒')+' '+escapeHtml(p.name)+'</option>').join('')+
        ((pbId && !activePbs.some(p=>p.id===pbId))?('<option value="'+pbId+'" selected>'+escapeHtml((t&&t.purposeBookName)||pbId)+' (비활성)</option>'):'')+
        '</select></div>';
      h+='<div id="sSettleBlock"></div>';
      h+='<div id="sCardPerf"></div>';   // 카드 실적 포함
      h+='<div class="txfield"><span class="k">메모</span><input type="text" class="txin" id="sMemo" placeholder="메모" value="'+escapeHtml(memo)+'"></div>';
      h+='</details>';
      if(t){ h+='<button class="btn" '+App.view.act('saveTx')+'>수정</button>';
        h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deleteTx')+'>삭제</button>'; }
      else h+='<div class="form-2"><button class="btn" '+App.view.act('saveTx')+'>저장</button><button class="btn ghost" '+App.view.act('saveTxAgain')+'>저장 후 계속</button></div>';   // ➕ 연속 입력(여행 정산 등 몰아서 넣기)

      openSheet(t?'거래 수정':'거래 입력', h);
      state._sheetBackFn=_backSheet;   // ↩️ 닫을 때 이전 리스트 시트로 복귀(리스트 위에서 안 열렸으면 null=일반 닫기)
      const sh=$('sheet');
      sh._touched={from:false,to:false,user:false};   // 🧠 최근값 기본 채움 후 사용자가 직접 고른 필드 추적(유형 전환 시 그 값 유지)
      const _lastNew = t?null:txLastOf(sheetType);
      sh._from = t?(t.from||''):(_lastNew.from||(state.accounts[0]?state.accounts[0].id:''));
      sh._to   = t?(t.to||''):(_lastNew.to||(state.accounts[1]?state.accounts[1].id:(state.accounts[0]?state.accounts[0].id:'')));
      sh._copay = coPart ? { on:true, acct:coPart.from||'', amt:Math.abs(Number(coPart.amount)||0), txId:coPart.id } : { on:false, acct:'', amt:0, txId:'' };
      sh._cpi  = t?t.cardPerformanceIncluded:undefined;
      sh._cpa  = t?t.cardPerformanceAmount:undefined;
      sh._cpr  = t?(t.cardPerformanceExcludedReason||''):'';
      sh._adjSign = (t&&t.type==='balance_adjustment'&&Number(t.amount)<0)?'-':'+';
      sh._actual = t ? (t.isActualExpense!==false) : undefined;   // 📊 실소비 토글 상태(수정=저장값, 신규=기본값) — 유형 전환에도 유지
      sh._consumer = t?(t.userUid||t.user||'공동'):(_lastNew.user||defaultOwnerUid());
      sh._settle = t ? { inc:t.settlementIncluded===true, payer:t.payer||'', splitType:t.splitType||'equal',
        participants:Array.isArray(t.splitParticipants)?t.splitParticipants.slice():null, amounts:t.splitAmounts||null, memo:t.settlementMemo||'' } : null;
      highlightTypeSeg(); renderTxDyn(); renderSettleBlock();
      sh._cur=(t&&t.currency)?t.currency:'KRW'; sh._rate=(t&&t.fxRate)?t.fxRate:(sh._cur==='KRW'?1:''); sh._fxSource=(t&&t.fxSource)||'manual'; sh._curUserSet=false; renderFxRow(); if(!t) applyPbCurrency();
      if(t&&t.currency&&t.currency!=='KRW') setFxStat((t.fxSource==='live'?'실시간':'직접입력')+(t.fxDate?' · '+t.fxDate:''));
      // 데스크톱(마우스/물리키보드 환경)에선 금액칸에 포커스를 줘 바로 숫자를 타이핑할 수 있게(모바일은 화면 키패드 유지 위해 포커스 안 줌).
      try{ if(window.matchMedia && window.matchMedia('(pointer: fine)').matches){ setTimeout(function(){ const a=$('sAmount'); if(a){ a.focus(); const v=a.value||''; try{ a.setSelectionRange(v.length, v.length); }catch(_){} } }, 60); } }catch(_){ }
    }
    function setSheetType(tp){
      if(tp==='__ext__'){ if(!EXT_TYPES.includes(sheetType)) sheetType='prepaid_spend'; }
      else sheetType=tp;
      applyTxLastFor(sheetType);   // 🧠 새 거래면 그 유형의 최근 선택을 미변경 필드에 채움
      highlightTypeSeg(); renderTxDyn();
    }
    function setExtType(tp){ sheetType=tp; applyTxLastFor(sheetType); highlightTypeSeg(); renderTxDyn(); }
    function highlightTypeSeg(){
      const seg=$('sTypeSeg'); if(!seg) return;
      const ext=EXT_TYPES.includes(sheetType);
      [...seg.children].forEach(b=>{
        const tp=b.dataset.tp;
        const on = tp==='__ext__' ? ext : (tp===sheetType);
        b.className = on ? ('on '+(tp==='expense'?'exp':tp==='income'?'inc':tp==='transfer'?'trf':'ext')) : '';
      });
    }
    // 결제수단 옵션 — 유형군별 <optgroup>(입출금·현금/카드/선불·간편결제/포인트/기타)로 묶고 소유자를 함께 표기(전부 섞여 찾기 어렵던 문제 해소).
    //  types: 허용 유형 배열(선불결제=선불류만, 포인트사용=포인트만 등 필터) — 생략 시 전체. 모든 계좌 셀렉트(거래·정기·구독·적금·대출·경조사)가 공유.
    const ACCT_GROUPS=[['입출금 · 현금',['bank','cash']],['카드',['credit_card','debit_card']],['선불 · 간편결제',['prepaid','e_wallet','gift_card']],['포인트',['point']],['기타',['other']]];
    function acctOptsHtml(sel, types){
      const list=state.accounts.filter(a=>!types||types.includes(a.type));
      const opt=a=>{ const ow=a.owner?ownerName(a.owner):''; return '<option value="'+a.id+'"'+(a.id===sel?' selected':'')+'>'+escapeHtml(a.name)+(ow?(' · '+escapeHtml(ow)):'')+'</option>'; };
      let h=''; const seen={};
      ACCT_GROUPS.forEach(g=>{ const arr=list.filter(a=>g[1].includes(a.type)); if(!arr.length) return;
        arr.forEach(a=>{ seen[a.id]=1; });
        h+='<optgroup label="'+g[0]+'">'+arr.map(opt).join('')+'</optgroup>'; });
      const rest=list.filter(a=>!seen[a.id]);   // 미지정/신규 유형 방어
      if(rest.length) h+='<optgroup label="기타">'+rest.map(opt).join('')+'</optgroup>';
      return h;
    }
    function acctField(label,id,sel,types){ return '<div class="txfield"><span class="k">'+label+'</span><select class="txsel" id="'+id+'" '+App.view.chg('onTxAcctChange')+'>'+acctOptsHtml(sel,types)+'</select></div>'; }   // 변경 훅이 동기화+손댐 표시 후 renderCardPerfBlock 호출
    // 소비 대상(누구의 소비인가) — 출금 수단과 분리. 멤버 + '공동'(집세 등 공동 비용) 선택.
    function consumerField(sel){ return '<div class="txfield"><span class="k">소비 대상</span><select class="txsel" id="sConsumer" '+App.view.chg('onTxConsumerChange')+'>'+ownerOptions(sel||'공동')+'</select></div>'; }
    // 🔝 최근 90일 사용 빈도순 정렬(동률=기존 sortOrder 유지, stable sort) — 자주 쓰는 카테고리가 칩 앞줄로
    function catsByUsage(cats){
      const cut=addDays(todayStr(),-90);
      const cnt={}; state.transactions.forEach(t=>{ if(t.category && (t.date||'').slice(0,10)>=cut) cnt[t.category]=(cnt[t.category]||0)+1; });
      return cats.slice().sort((a,b)=>(cnt[b.name]||0)-(cnt[a.name]||0));
    }
    // 시안: 카테고리 가로 칩(이름 + 카테고리 색 점)
    function catChipsHtml(){
      let cats=catsByUsage(pickableCats(catTypeFor(sheetType)));
      if(sheetCat && !cats.some(c=>c.name===sheetCat)){ const cur=getCat(sheetCat)||{name:sheetCat,color:'#8b95a1'}; cats=[cur,...cats]; }
      else if(!sheetCat && cats[0]) sheetCat=cats[0].name;
      return '<div class="chips">'+cats.map(c=>'<button class="chip'+(c.name===sheetCat?' on':'')+'" '+App.view.act('pickCat',c.name)+'><span class="catdot" style="background:'+(c.color||'#8b95a1')+'"></span>'+escapeHtml(c.name)+'</button>').join('')+'</div>';
    }
    // ===== 💳+✨ 함께결제 — 한 번의 지출을 '포인트·선불 일부 + 나머지 카드/계좌'로 나눠 기록 =====
    //  금액칸엔 언제나 '총 결제 금액'을 넣고, 여기서 정한 포인트 사용액만큼을 떼어 보조 거래(point_spend/prepaid_spend)로 저장한다.
    //  상태는 시트에 보관: sheet._copay = { on, acct, amt, txId }(txId=수정 시 이미 저장된 짝 거래 키).
    function coPayCands(){ return state.accounts.filter(a=>PREPAID_TYPES.includes(a.type) && canSee(a) && a.isActive!==false); }
    function coPayState(){ const sh=$('sheet'); return (sh&&sh._copay)||{ on:false, acct:'', amt:0, txId:'' }; }
    function coPayBlockHtml(){
      if(sheetType!=='expense') return '';
      const cands=coPayCands(); if(!cands.length) return '';   // 포인트·선불 수단이 없으면 아예 숨김
      const co=coPayState(); const on=!!co.on;
      let h='<div class="txfield"><span class="k">포인트·선불 함께</span><div class="switch'+(on?' on':'')+'" id="sCoPay" '+App.view.act('toggleCoPay')+' aria-label="포인트·선불 함께 사용"><i></i></div></div>';
      if(on){
        const sel=(co.acct && cands.some(a=>a.id===co.acct))?co.acct:cands[0].id;
        h+='<div class="txfield"><span class="k">포인트 수단</span><select class="txsel" id="sCoAcct" '+App.view.chg('onCoPayChange')+'>'+
          cands.map(a=>'<option value="'+a.id+'"'+(a.id===sel?' selected':'')+'>'+escapeHtml(a.name)+' ('+(ACCT_TYPE_LABEL[a.type]||a.type)+')</option>').join('')+'</select></div>';
        h+='<div class="txfield"><span class="k">포인트 사용액</span><input type="text" inputmode="numeric" class="txin" id="sCoAmt" placeholder="0" value="'+(co.amt?fmtComma(co.amt):'')+'" oninput="onCoAmtInput(this)"></div>';
        h+='<div class="copay-note" id="sCoNote"></div>';
      }
      return h;
    }
    // 총액 대비 분배 안내(금액칸·포인트칸이 바뀔 때마다 갱신) — setAmt·onCoAmtInput 두 곳에서 호출
    function updateCoPayNote(){
      const box=$('sCoNote'); if(!box) return;
      if(sheetCur()!=='KRW'){ box.textContent='함께결제는 원화 거래에서만 쓸 수 있어요 — 스위치를 꺼주세요.'; box.classList.add('warn'); return; }
      const total=sheetKRWAmount(), co=parseAmount(val('sCoAmt'));
      if(!total){ box.textContent='총 결제 금액을 먼저 입력하세요.'; box.classList.remove('warn'); return; }
      if(co<=0){ box.textContent='포인트로 낸 금액을 입력하면 나머지가 위 결제 수단으로 기록돼요.'; box.classList.remove('warn'); return; }
      if(co>=total){ box.textContent='포인트 사용액이 총액보다 크거나 같아요 — 총액보다 작게 넣어주세요.'; box.classList.add('warn'); return; }
      box.classList.remove('warn');
      box.innerHTML='총 <b>'+fmtComma(total)+'원</b> = 포인트 <b>'+fmtComma(co)+'원</b> + 나머지 <b>'+fmtComma(total-co)+'원</b> (거래 2건으로 기록)';
    }
    function toggleCoPay(){ const sh=$('sheet'); const co=coPayState();
      if($('sFrom')) sh._from=val('sFrom'); if($('sTo')) sh._to=val('sTo');   // #sDyn 재생성 전 선택 보존(계좌가 첫 항목으로 튀지 않게)
      sh._copay={ on:!co.on, acct:($('sCoAcct')?val('sCoAcct'):co.acct), amt:($('sCoAmt')?parseAmount(val('sCoAmt')):co.amt), txId:co.txId };
      renderTxDyn(); }
    function onCoPayChange(){ const sh=$('sheet'); sh._copay=Object.assign({}, coPayState(), { acct:val('sCoAcct') }); }
    function onCoAmtInput(el){ const v=parseAmount(el.value); el.value=v?fmtComma(v):'';
      const sh=$('sheet'); sh._copay=Object.assign({}, coPayState(), { amt:v, acct:($('sCoAcct')?val('sCoAcct'):coPayState().acct) });
      updateCoPayNote(); }
    // 저장된 함께결제 짝 거래 찾기(본 거래 → 보조 거래)
    function coPayPartner(t){ if(!t||!t.coPayTxId) return null; return state.transactions.find(x=>x.ownerUid===t.ownerUid && x.id===t.coPayTxId)||null; }

    // ===== 금액 입력(통화 인식) — 외화 선택 시 소수점 허용·원화 환산 =====
    function curOptions(sel){ return CURRENCIES.map(c=>'<option value="'+c.code+'"'+(c.code===sel?' selected':'')+'>'+c.sym+' '+c.code+'</option>').join(''); }
    function sheetCur(){ const sh=$('sheet'); return (sh&&sh._cur)||'KRW'; }
    function curDec(){ return curInfo(sheetCur()).dec; }
    function amtRaw(){ const el=$('sAmount'); return el?el.value.replace(/,/g,''):''; }
    function sheetAmt(){ return parseFloat(amtRaw())||0; }
    function fmtAmt(raw){ raw=String(raw==null?'':raw); if(raw==='') return ''; const dot=raw.indexOf('.');
      if(dot<0){ const i=raw.replace(/[^0-9]/g,''); return i?Number(i).toLocaleString():''; }
      const ip=raw.slice(0,dot).replace(/[^0-9]/g,'')||'0', fp=raw.slice(dot+1).replace(/[^0-9]/g,'');
      return Number(ip).toLocaleString()+'.'+fp; }
    function setAmt(raw){ const el=$('sAmount'); if(el){ el.value=fmtAmt(raw); updateFxPreview(); updateCoPayNote(); } }
    function kpPress(d){ const dec=curDec(); let cur=amtRaw();
      if(d==='.'){ if(dec===0||cur.indexOf('.')>=0) return; cur=(cur||'0')+'.'; }
      else if(d==='00'){ if(!cur||cur==='0') return; cur+='00'; }
      else cur+=d;
      const dot=cur.indexOf('.');
      if(dot>=0){ if(dec===0) cur=cur.slice(0,dot); else cur=cur.slice(0,dot+1)+cur.slice(dot+1).replace(/[^0-9]/g,'').slice(0,dec); }
      if((cur.match(/[0-9]/g)||[]).length>13) return;
      setAmt(cur); }
    function kpDel(){ setAmt(amtRaw().slice(0,-1)); }
    function kpKey(e){ const k=e.key;
      if(k>='0'&&k<='9'){ e.preventDefault(); kpPress(k); }
      else if(k==='.'||k===','){ e.preventDefault(); kpPress('.'); }
      else if(k==='Backspace'||k==='Delete'){ e.preventDefault(); kpDel(); }
      else if(k==='Enter'){ e.preventDefault(); if(typeof saveTx==='function') saveTx(); } }
    function kpPaste(e){ e.preventDefault(); const dt=e.clipboardData||window.clipboardData; const txt=dt?dt.getData('text'):''; let m=String(txt||'').replace(/[^0-9.]/g,''); const p=m.split('.'); m=p.shift()+(p.length?'.'+p.join(''):''); setAmt(m); }
    function sheetRate(){ if(sheetCur()==='KRW') return 1; const el=$('sFxRate'); const sh=$('sheet'); const r=el?parseFloat(el.value.replace(/,/g,'')):(sh?parseFloat(sh._rate):0); return r>0?r:0; }
    function sheetKRWAmount(){ return sheetCur()==='KRW' ? Math.round(sheetAmt()) : Math.round(sheetAmt()*sheetRate()); }
    function onCurChange(){ const sh=$('sheet'); sh._curUserSet=true; const prev=sh._cur; sh._cur=val('sCur');
      if(sh._cur==='KRW'){ sh._rate=1; renderFxRow(); return; }
      if(curInfo(sh._cur).dec===0) setAmt(String(Math.floor(sheetAmt())||''));
      if(prev!==sh._cur){ sh._rate=''; sh._fxSource='live'; }
      renderFxRow(); autoFetchRate(); }
    function renderFxRow(){ const box=$('sFx'); if(!box) return; const c=sheetCur(), sh=$('sheet');
      if(c==='KRW'){ box.innerHTML=''; box.style.display='none'; return; }
      box.style.display=''; const rate=(sh&&sh._rate)?sh._rate:'';
      box.innerHTML=
        '<div class="fxrow-in">'
        +'<span class="fxk">1 '+c+' =</span>'
        +'<input class="fxrate" id="sFxRate" inputmode="decimal" value="'+(rate||'')+'" placeholder="환율" oninput="markManualRate();updateFxPreview()">'
        +'<span class="fxk">₩</span>'
        +'<button type="button" class="fxrefresh" id="sFxBtn" '+App.view.act('autoFetchRate')+' aria-label="실시간 환율 조회" title="실시간 환율 조회">'
          +'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3.5V9h-5.5"/></svg>'
        +'</button>'
        +'</div>'
        +'<div class="fxconv-row"><span class="fxk">원화 환산</span><span class="fxconv">₩<b id="sFxKrw">0</b></span></div>'
        +'<div class="tx-sub" id="sFxStat"></div>';
      updateFxPreview(); }
    function markManualRate(){ const sh=$('sheet'); if(sh){ sh._fxSource='manual'; sh._rate=sheetRate(); } }
    function updateFxPreview(){ const el=$('sFxKrw'); if(el) el.textContent=Math.round(sheetAmt()*sheetRate()).toLocaleString(); }
    // 실시간 환율 자동 조회(통화·날짜 변경 시). 성공 시 환율칸 채움(live), 실패 시 수동 입력 안내.
    function setFxStat(msg){ const el=$('sFxStat'); if(el) el.textContent=msg||''; }
    function autoFetchRate(){ const sh=$('sheet'); const cur=sheetCur(); if(!sh||cur==='KRW') return;
      const date=val('sDate')||''; const btn=$('sFxBtn'); if(btn) btn.classList.add('spin'); setFxStat('환율 불러오는 중…');
      fetchFxRate(cur, date).then(function(rate){ const b=$('sFxBtn'); if(b) b.classList.remove('spin'); if(!$('sheet')||sheetCur()!==cur) return; const el=$('sFxRate');
        if(rate&&el){ el.value=rate; sh._rate=rate; sh._fxSource='live'; setFxStat('실시간 환율 적용'+(date?' · '+date:'')); updateFxPreview(); }
        else setFxStat('자동 조회 실패 — 환율을 직접 입력하세요'); }); }
    function onDateChange(){ if(sheetCur()!=='KRW') autoFetchRate(); }
    // 목적별 가계부(여행 등) 선택 시, 그 PB의 기준 통화를 거래 통화 기본값으로 적용(사용자가 직접 고른 통화는 존중).
    function onPbChange(){ renderSettleBlock(); applyPbCurrency(); }
    function applyPbCurrency(){ const sh=$('sheet'); if(!sh||sh._curUserSet) return; const pbId=$('sPb')?val('sPb'):''; if(!pbId) return;
      const pb=state.purposeBooks.find(x=>x.id===pbId); if(!pb) return; const bc=pb.baseCurrency||'KRW';
      if(bc==='KRW'||sheetCur()===bc) return; const sel=$('sCur'); if(!sel) return;
      sel.value=bc; sh._cur=bc; sh._rate=''; sh._fxSource='live'; if(curInfo(bc).dec===0) setAmt(String(Math.floor(sheetAmt())||'')); renderFxRow(); autoFetchRate(); }
    function guideNote(actual, text){ return '<div class="install-banner guidenote" style="background:'+(actual?'rgba(240,68,82,.1)':'var(--primary-weak)')+';color:'+(actual?'var(--expense)':'var(--primary)')+';"><span class="gn-ic">'+(actual?cartSvg({fit:true}):infoSvg({fit:true}))+'</span><span>'+text+'</span></div>'; }
    function renderTxDyn(){
      const sh=$('sheet'); const fromV=sh._from, toV=sh._to;
      if($('sConsumer')) sh._consumer=val('sConsumer'); // 유형 전환 시 소비 대상 선택 보존
      // 카테고리 칩(해당 유형만) → 별도 영역
      const catBox=$('sCatChips');
      if(catBox) catBox.innerHTML = (catTypeFor(sheetType)!==null) ? catChipsHtml() : '';
      // 계좌/이체 행 + ext 서브칩 + 안내 → #sDyn
      let h='';
      if(EXT_TYPES.includes(sheetType)){
        h+='<div class="chips" style="margin:2px 0 6px;">'+EXT_TYPES.map(tp=>'<button class="chip '+(tp===sheetType?'on':'')+'" '+App.view.act('setExtType',tp)+'>'+TYPE_LABEL[tp]+'</button>').join('')+'</div>';
      }
      if(sheetType==='prepaid_charge') h+=guideNote(false,'충전은 자산 이동이라 실제 소비에 포함되지 않습니다.');
      else if(sheetType==='prepaid_spend'||sheetType==='point_spend') h+=guideNote(true,'이 거래는 실제 소비에 포함됩니다.');
      else if(sheetType==='refund') h+=guideNote(false,'환불은 잔액이 돌아오는 거래로 실제 소비에 포함되지 않습니다.');
      else if(sheetType==='point_earn') h+=guideNote(false,'포인트 적립은 실제 소비가 아닙니다.');
      else if(sheetType==='balance_adjustment') h+=guideNote(false,'실제 잔액에 맞추는 보정 거래입니다. 실제 소비에 포함되지 않습니다.');

      // 🎯 유형별 계좌 필터 — 선불결제=선불류만·포인트=포인트 계정만·충전 수단=비선불만(콤보에 무관한 계좌가 섞이지 않게)
      const PREPAY=['prepaid','e_wallet','gift_card'], NONPRE=['bank','cash','credit_card','debit_card','other'];
      if(sheetType==='expense'){ h+=acctField('출금/결제 수단','sFrom',fromV)+coPayBlockHtml()+consumerField(sh._consumer); }   // 💳+✨ 결제 수단 바로 아래에 '포인트·선불 함께' 블록
      else if(sheetType==='income'){ h+=acctField('입금 대상','sTo',toV); }
      else if(sheetType==='refund'){ h+=acctField('환불 받는 계정','sTo',toV); }
      else if(sheetType==='point_earn'){ h+=acctField('적립 포인트 계정','sTo',toV,['point']); }
      else if(sheetType==='transfer'||sheetType==='prepaid_charge'){
        const l1=sheetType==='prepaid_charge'?'충전 수단(카드/계좌)':'출금';
        const l2=sheetType==='prepaid_charge'?'충전 대상(선불/포인트)':'입금';
        h+=acctField(l1,'sFrom',fromV,sheetType==='prepaid_charge'?NONPRE:null)+acctField(l2,'sTo',toV,sheetType==='prepaid_charge'?PREPAY.concat(['point']):null);
      }
      else if(sheetType==='prepaid_spend'||sheetType==='point_spend'){
        h+=acctField(sheetType==='point_spend'?'사용 포인트 계정':'결제 선불수단','sFrom',fromV,sheetType==='point_spend'?['point']:PREPAY)+consumerField(sh._consumer);
      }
      else if(sheetType==='balance_adjustment'){
        h+=acctField('대상 계정','sTo',toV);
        h+='<div class="txfield"><span class="k">조정 방향</span><select class="txsel" id="sAdjSign"><option value="+"'+(sh._adjSign!=='-'?' selected':'')+'>증가(+)</option><option value="-"'+(sh._adjSign==='-'?' selected':'')+'>감소(-)</option></select></div>';
      }
      // 📊 실제 소비 포함 토글(소비성 유형만) — 카드 대금 이체·대납처럼 '돈은 나가지만 소비 아님' 기록을 통계·예산에서 뺄 수 있게(잔액엔 반영).
      if(ACTUAL_DEFAULT[sheetType]){
        const actOn=(sh._actual!==undefined&&sh._actual!==null)?!!sh._actual:true;
        h+='<div class="menu-item" style="padding:6px 2px;"><span>📊 실제 소비에 포함 <span class="muted" style="font-size:11px;">(끄면 통계·예산 제외, 잔액만 반영 — 카드 대금 등)</span></span><div class="switch'+(actOn?' on':'')+'" id="sActual" '+App.view.act('toggleSwitch','onTxActualChange')+'><i></i></div></div>';
      }
      // 💐 경조사 카테고리 안내 — 저장하면 경조사비 장부 기록으로 이어지게 제안(아래 maybeSuggestGiftEvent)
      { const _c=sheetCat?getCat(sheetCat):null;
        if(isGiftCat(_c)&&catTypeFor(sheetType)==='expense') h+='<div class="tx-sub" style="margin:4px 2px 8px;">💐 경조사 지출이네요 — 저장하면 <b>경조사비 장부</b> 기록을 이어서 도와드려요.</div>'; }
      $('sDyn').innerHTML=h;
      if(catBox) pickCat(sheetCat,true);
      renderCardPerfBlock(); updateCoPayNote();
    }
    function pickCat(name, silent){
      sheetCat=name;
      const box=$('sCatChips');
      if(box) [...box.querySelectorAll('.chip')].forEach(ch=>ch.classList.toggle('on', ch.textContent.trim()===name));
      if(!silent) renderCardPerfBlock();
    }
    function renderCardPerfBlock(){
      const box=$('sCardPerf'); if(!box) return;
      const fromId = $('sFrom')?$('sFrom').value:$('sheet')._from;
      const card = getCard(fromId);
      if(!(card && (sheetType==='expense'||sheetType==='prepaid_charge'))){ box.innerHTML=''; return; }
      const sh=$('sheet');
      const defInc = defaultCardIncluded(card, sheetType, sheetCat);
      const inc = sh._cpi!==undefined ? !!sh._cpi : defInc;
      const _coAmt=(sheetType==='expense' && $('sCoPay') && $('sCoPay').classList.contains('on') && $('sCoAmt')) ? parseAmount(val('sCoAmt')) : 0;
      const amt = sh._cpa!=null ? sh._cpa : Math.max(0, sheetKRWAmount()-_coAmt);   // 💳+✨ 함께결제면 카드로 실제 결제한 금액이 기본
      box.innerHTML='<div class="card" style="padding:14px;margin:4px 0 14px;">'+
        '<div class="menu-item" style="padding:4px 0;"><span>💳 '+escapeHtml(card.cardName||acctName(card.id))+' 실적 포함</span><div class="switch '+(inc?'on':'')+'" id="sCpi" '+App.view.act('toggleSwitch','toggleCpiFields')+'><i></i></div></div>'+
        '<div id="sCpiFields" style="'+(inc?'':'display:none;')+'"><div class="field" style="margin-top:8px;"><label>실적 인정 금액</label><input class="input" id="sCpa" inputmode="numeric" value="'+(amt?Number(amt).toLocaleString():'')+'" oninput="this.value=fmtComma(this.value)"></div></div>'+
        '<div id="sCprWrap" style="'+(inc?'display:none;':'')+'"><div class="field" style="margin-top:8px;"><label>실적 제외 사유</label><input class="input" id="sCpr" value="'+escapeHtml(sh._cpr||'')+'" placeholder="예: 선불충전 제외"></div></div>'+
        '<div class="tx-sub" style="margin-top:6px;">기본값: '+(defInc?'포함':'제외')+' · 직접 수정 가능</div></div>';
      sh._cpi=undefined; // 사용자가 토글하면 그 값 우선
      const adv=$('sAdv'); if(adv) adv.open=true;   // 카드 실적 있으면 상세 설정 펼쳐 노출
    }
    function toggleCpiFields(){ const on=$('sCpi').classList.contains('on'); $('sCpiFields').style.display=on?'':'none'; $('sCprWrap').style.display=on?'none':''; }

    // ===== 거래 시트 정산 입력 블록 (Step 9) — 선택 PB가 settlementEnabled일 때만 노출 =====
    function renderSettleBlock(){
      const box=$('sSettleBlock'); if(!box) return;
      const sh=$('sheet'); const pbId=$('sPb')?val('sPb'):'';
      const pb=state.purposeBooks.find(x=>x.id===pbId);
      if(!(pb && pb.settlementEnabled)){ box.innerHTML=''; sh._stReady=false; return; }
      const all=(pb.participants&&pb.participants.length)?pb.participants.slice():[state.userName];
      if(!sh._stReady){
        const init=sh._settle||{};
        sh._stOn = !!init.inc;
        sh._stPayer = init.payer || state.userName;
        sh._stType = (init.splitType && init.splitType!=='none') ? init.splitType : 'equal';
        sh._stParts = (init.participants&&init.participants.length)?init.participants.slice():all.slice();
        sh._stCustom = init.amounts||null;
        sh._stMemo = init.memo||'';
        sh._stReady = true;
      }
      sh._stAll = all;
      box.innerHTML='<div class="card" style="padding:14px;margin:4px 0 14px;">'+
        '<div class="menu-item" style="padding:4px 0;"><span>🤝 정산 포함</span><div class="switch '+(sh._stOn?'on':'')+'" id="sSettle" '+App.view.act('toggleSettleOn')+'><i></i></div></div>'+
        '<div id="sSettleFields" style="'+(sh._stOn?'':'display:none;')+'"></div></div>';
      renderSettleFields();
    }
    function toggleSettleOn(){ const sh=$('sheet'); sh._stOn=!sh._stOn; $('sSettle').classList.toggle('on',sh._stOn); $('sSettleFields').style.display=sh._stOn?'':'none'; if(sh._stOn) renderSettleFields(); }
    function renderSettleFields(){
      const box=$('sSettleFields'); if(!box) return;
      const sh=$('sheet'), all=sh._stAll||[], payer=sh._stPayer, type=sh._stType||'equal', parts=sh._stParts||[];
      let h='<div class="field" style="margin-top:8px;"><label>결제자</label><select class="input" id="sStPayer">'+
        all.map(n=>'<option'+(n===payer?' selected':'')+'>'+escapeHtml(n)+'</option>').join('')+
        (all.includes(payer)?'':'<option selected>'+escapeHtml(payer)+'</option>')+'</select></div>';
      h+='<label style="font-size:13px;font-weight:600;color:var(--sub);">분담 방식</label>'+
        '<div class="type-seg" id="sStType" style="margin:6px 0 10px;">'+
        [['equal','균등'],['custom','직접'],['payer_only','결제자부담']].map(o=>'<button class="'+(type===o[0]?'on':'')+'" '+App.view.act('setSplitType',o[0])+'>'+o[1]+'</button>').join('')+'</div>';
      if(type!=='payer_only'){
        h+='<label style="font-size:13px;font-weight:600;color:var(--sub);">참여자</label><div class="chip-row" style="margin:6px 0 8px;">'+
          all.map((n,i)=>'<button class="chip '+(parts.includes(n)?'on':'')+'" '+App.view.act('toggleSettleParticipant',i)+'>'+escapeHtml(n)+'</button>').join('')+'</div>';
        const amt=sheetKRWAmount();
        const split=computeSettleAmounts(type, parts, amt, sh._stCustom);
        h+='<div id="sStAmts">'+parts.map(n=>'<div class="field" style="margin-top:6px;"><label>'+escapeHtml(n)+' 부담</label>'+
          '<input class="input stamt" data-n="'+escapeHtml(n)+'" inputmode="numeric" value="'+(split[n]?Number(split[n]).toLocaleString():'0')+'"'+(type==='equal'?' readonly':' oninput="this.value=fmtComma(this.value)"')+'></div>').join('')+'</div>';
        h+='<div class="tx-sub" style="margin-top:4px;">'+(type==='equal'?'균등 분할(자동 계산)':'직접 입력 — 합계가 거래 금액과 다르면 남는 금액은 결제자가 부담해요')+'</div>';
      } else {
        h+='<div class="tx-sub" style="margin-top:6px;">결제자가 전액 부담합니다(정산 송금 없음).</div>';
      }
      h+='<div class="field" style="margin-top:8px;"><label>정산 메모</label><input class="input" id="sStMemo" value="'+escapeHtml(sh._stMemo||'')+'" placeholder="예: 점심"></div>';
      box.innerHTML=h;
    }
    function captureSettleCustom(){ const sh=$('sheet'); if(sh._stType!=='custom') return; const m={}; document.querySelectorAll('#sStAmts .stamt').forEach(el=>{ m[el.dataset.n]=parseAmount(el.value); }); sh._stCustom=m; }
    function captureSettleScalars(){ const sh=$('sheet'); if($('sStPayer')) sh._stPayer=val('sStPayer'); if($('sStMemo')) sh._stMemo=val('sStMemo'); }
    function setSplitType(type){ const sh=$('sheet'); captureSettleCustom(); captureSettleScalars(); sh._stType=type; renderSettleFields(); }
    function toggleSettleParticipant(i){ const sh=$('sheet'), n=(sh._stAll||[])[i]; if(n==null) return; captureSettleCustom(); captureSettleScalars();
      const set=new Set(sh._stParts||[]); if(set.has(n)) set.delete(n); else set.add(n);
      sh._stParts=(sh._stAll||[]).filter(x=>set.has(x)); renderSettleFields(); }
    // 분담 금액 계산(UI용): equal=균등+나머지 보정, custom=입력값(없으면 균등 시드), payer_only는 호출 안 함
    // computeSettleAmounts는 js/util.js로 이동(순수함수·단위 테스트).
    // 저장 시점 정산 데이터 수집. {inc:false} 또는 {inc:true, payer, splitType, participants, amounts, memo}
    function collectSettle(){
      const sh=$('sheet'); if(!sh._stReady || !sh._stOn) return { inc:false };
      captureSettleCustom(); captureSettleScalars();
      const type=sh._stType||'equal', amt=sheetKRWAmount();
      const payer = $('sStPayer')?val('sStPayer'):(sh._stPayer||state.userName);
      let parts, amounts={};
      if(type==='payer_only'){ parts=[payer]; amounts[payer]=amt; }
      else { parts=(sh._stParts||[]).slice(); amounts=computeSettleAmounts(type, parts, amt, sh._stCustom);
        // 직접 입력 합계가 거래 금액과 다르면 잔액을 결제자(참여 시)·아니면 마지막 참여자에 흡수 → 합계 불일치로 영원히 미정산되던 문제 방지(항상 정산 가능).
        if(type==='custom' && parts.length){ const sum=parts.reduce((s,n)=>s+(Number(amounts[n])||0),0), diff=amt-sum;
          if(diff){ const anchor=(parts.indexOf(payer)>=0?payer:parts[parts.length-1]); amounts[anchor]=(Number(amounts[anchor])||0)+diff; } } }
      return { inc:true, payer, splitType:type, participants:parts, amounts, memo: $('sStMemo')?val('sStMemo'):(sh._stMemo||'') };
    }
    // 거래 시트(폼) DOM·state 읽기 → 원시 입력 bag. 순수 조립·검증은 buildTx(ledger-calc.js), 쓰기·보상은 saveTx.
    function readTxForm(){
      const curCode=sheetCur(), foreign=sheetAmt(), rate=sheetRate(), rawAmount=sheetKRWAmount();
      const date=val('sDate')||todayStr();
      const e=TX_EFFECT[sheetType]||{};
      const hasCat=catTypeFor(sheetType)!==null;
      const cat=sheetCat;
      // 소비 대상(누구의 소비) — 지출/선불결제/포인트사용에서만 선택, 그 외엔 본인
      const _csel = $('sConsumer') ? (val('sConsumer')||defaultOwnerUid()) : defaultOwnerUid();
      const _cmem = (state.wsMeta&&state.wsMeta.members)||{};
      const from=val('sFrom'), to=val('sTo');
      const effFrom=(sheetType!=='balance_adjustment' && e.debit)?from:undefined;   // tx.from이 실제로 가질 값(카드 조회 기준과 일치)
      const card=getCard(effFrom);
      let cardIncluded=false, cardPerfAmount=0, cardPerfReason='';
      if(card && (sheetType==='expense'||sheetType==='prepaid_charge')){
        cardIncluded=$('sCpi')?$('sCpi').classList.contains('on'):defaultCardIncluded(card,sheetType,hasCat?(cat||'기타'):undefined);
        cardPerfAmount=parseAmount(val('sCpa'));
        cardPerfReason=val('sCpr')||'';
      }
      // 💳+✨ 함께결제(포인트·선불 일부) — 스위치가 켜진 지출에서만 수집. 계좌 종류로 보조 거래 유형을 정한다.
      const _co=(function(){ const on=$('sCoPay')?$('sCoPay').classList.contains('on'):false;
        if(!on || sheetType!=='expense') return { amt:0, acct:'', txType:'' };
        const acct=$('sCoAcct')?val('sCoAcct'):''; const a=acct?getAcct(acct):null;
        return { amt:parseAmount(val('sCoAmt')), acct:acct, txType:(a&&a.type==='point')?'point_spend':'prepaid_spend' }; })();
      // 목적별 가계부 연결 + 정산(Step 9). 정산 필드는 collectSettle()로 수집.
      const pb = $('sPb')?val('sPb'):'';
      let pbName='', settle=null;
      if(pb){
        const pbo=state.purposeBooks.find(x=>x.id===pb);
        pbName=pbo?pbo.name:((sheetTx&&state.transactions.find(x=>x.ownerUid===sheetTx.ownerUid&&x.id===sheetTx.id))||{}).purposeBookName||'';
        settle=(pbo&&pbo.settlementEnabled)?collectSettle():{inc:false};
      }
      const oldTx=sheetTx?(state.transactions.find(x=>x.ownerUid===sheetTx.ownerUid&&x.id===sheetTx.id)||null):null;
      return {
        type:sheetType, curCode:curCode, foreign:foreign, rate:rate, rawAmount:rawAmount,
        date:date, iso:isoAtNoon(date), desc:val('sDesc').trim(), memo:val('sMemo').trim(),
        effect:e, hasCat:hasCat, cat:cat, typeLabel:TYPE_LABEL[sheetType], isActualDefault:ACTUAL_DEFAULT[sheetType],
        isActualSet:(ACTUAL_DEFAULT[sheetType]&&$('sActual'))?$('sActual').classList.contains('on'):undefined,   // 📊 실소비 토글(소비성 유형만 노출) — undefined=기본값 사용
        consumer:resolveOwnerName(_csel), consumerUid:_csel, consumerIsMember:!!(_cmem[_csel]||_csel===state.uid),
        fxSource:($('sheet')._fxSource||'manual'),
        from:from, to:to, adjSign:val('sAdjSign'),
        hasCard:!!card, cardIncluded:cardIncluded, cardPerfAmount:cardPerfAmount, cardPerfReason:cardPerfReason,
        pb:pb, pbName:pbName, settle:settle, oldTx:oldTx,
        coAmount:_co.amt, coAcct:_co.acct, coTxType:_co.txType
      };
    }
    function saveTxAgain(){ saveTx(true); }   // ➕ 저장 후 계속(연속 입력) — 시트 유지, 금액·설명·메모만 비움
    function saveTx(keepOpen){
      const res=buildTx(readTxForm());   // 순수 조립·검증(ledger-calc.js)
      if(res.error){ toast(res.error, true); return; }
      const tx=res.tx, subTx=res.subTx;
      const ac=sheetTx?null:(autoChargeCheck(tx)||(subTx?autoChargeCheck(subTx):null));   // ⚡ 새 거래(함께결제면 포인트 쪽 포함)가 선불·포인트 잔액을 마이너스로 만들면 자동충전 흐름
      // 💳+✨ 함께결제: 본 거래 + 보조(포인트) 거래를 같은 사용자 노드에 다중경로 update로 함께 쓴다(한쪽만 저장되는 일 없게).
      const ownerUid=sheetTx?sheetTx.ownerUid:state.uid;
      const mainKey=sheetTx?sheetTx.id:String(Date.now());
      const prevTx=sheetTx?(state.transactions.find(x=>x.ownerUid===ownerUid && x.id===sheetTx.id)||{}):{};
      const prevCoId=prevTx.coPayTxId||'';
      const upd={};
      if(subTx){ const subKey=prevCoId||String(Date.now()+1);
        tx.coPayTxId=subKey; subTx.coPayMainId=mainKey;
        upd[mainKey]=tx; upd[subKey]=subTx;
      } else {
        upd[mainKey]=tx;
        if(prevCoId) upd[prevCoId]=null;   // 함께결제를 끈 경우 짝 거래 제거
      }
      db.ref(wp('transactions/'+ownerUid)).update(upd).catch(_saveErr);
      if(!sheetTx) txLastRemember(tx);   // 🧠 새 거래의 결제수단·소비대상을 다음 입력 기본값으로 기억(수정은 제외)
      if(sheetTx) toast(subTx?'수정되었습니다 (거래 2건)':'수정되었습니다');
      else {
        toast(subTx?'저장되었습니다 (거래 2건)':'저장되었습니다'); budgetPreWarn(tx);
        if(tx.category && tx.memo && typeof grantQualityBonus==='function') grantQualityBonus();   // ✍️ 카테고리+메모 채운 새 거래 → 성실 기록 보너스(하루 3건 캡)
      }
      // ➕ 연속 입력: 시트를 닫지 않고 금액·설명·메모만 비움(날짜·유형·수단·소비대상 유지 — 자동충전이 끼면 그 흐름 우선)
      if(keepOpen===true && !sheetTx && !ac){
        const _sh=$('sheet'); if(_sh) _sh._copay={ on:false, acct:'', amt:0, txId:'' };
        const a=$('sAmount'); if(a) a.value='';
        const d=$('sDesc'); if(d) d.value='';
        const mm=$('sMemo'); if(mm) mm.value='';
        const sug=$('sDescSug'); if(sug) sug.innerHTML='';
        renderTxDyn(); updateCoPayNote();
        return;
      }
      closeSheet();
      if(ac) handleAutoCharge(ac);
      else if(!sheetTx){ if(!maybeSuggestGiftEvent(tx)) maybeSuggestRecurring(tx); }   // 💐 경조사 카테고리면 장부 기록 제안(우선), 아니면 🔁 정기 제안
    }
    // 🔁 정기거래 자동 제안 — 같은 설명·유형·비슷한 금액이 3개월 연속(recurringCandidate, util.js)이면 매월 그 날짜 정기거래 등록을 1회 제안.
    //    같은 설명은 수락·거절 무관 다시 묻지 않음(localStorage recsug), 이미 같은 설명의 활성 규칙이 있으면 스킵.
    function maybeSuggestRecurring(tx){
      try{
        if(!tx || tx.recurringId || tx.coPayMainId || tx.autoCharge) return;
        if(!(tx.type==='expense'||tx.type==='income')) return;
        const cand=recurringCandidate(state.transactions.concat([tx]), tx); if(!cand) return;
        const dk=String(tx.desc).trim();
        const key='recsug:'+(state.wsId||'')+':'+(state.uid||'');
        let seen={}; try{ seen=JSON.parse(localStorage.getItem(key)||'{}')||{}; }catch(e){}
        if(seen[dk]) return;
        if(state.recurring.some(r=>r.ownerUid===state.uid && String(r.desc||'').trim()===dk && ruleStatus(r)!=='ended')) return;
        seen[dk]=1; try{ localStorage.setItem(key, JSON.stringify(seen)); }catch(e){}
        const d=parseDate(tx.date);
        const back=state._sheetReopen||null;   // 리스트 시트 위 흐름이었으면 제안 닫은 뒤에도 리스트로 복귀
        confirmSheet('\''+dk+'\' 거래가 '+cand.months+'개월 연속 기록됐어요.\n매월 '+d.getDate()+'일 정기거래로 등록해 자동 기록할까요?', function(){
          const e=TX_EFFECT[tx.type]||{};
          const rule={ type:tx.type, desc:dk, amount:Number(tx.amount)||0, freq:'monthly', interval:1,
            startDate:ymd(d), endDate:null, day:d.getDate(), weekday:0,
            user:tx.user||state.userName, autoCreate:true, status:'active', visibility:defaultVisibility(), memo:'',
            lastPosted:ymd(d), notifyBeforeCreate:false,   // 이번 회차는 방금 손으로 기록했으니 다음 달부터 생성
            createdAt:new Date().toISOString(), updatedAt:new Date().toISOString() };
          if(e.debit) rule.from=tx.from||''; if(e.credit) rule.to=tx.to||'';
          if(catTypeFor(tx.type)) rule.category=tx.category||'기타';
          const nr=nextRunOf(rule); rule.nextRunDate=nr?ymd(nr):null;
          db.ref(wp('recurring/'+state.uid+'/'+Date.now())).set(rule);
          toast('🔁 정기거래로 등록했어요 — 다음 달부터 자동 기록됩니다');
        }, { okLabel:'등록하기', danger:false, title:'🔁 정기거래 제안' });
        if(back) state._sheetBackFn=back;
      }catch(e){}
    }
    // ===== ⚡ 자동충전(선불·포인트) — 간편계좌(쿠팡·카카오페이·네이버페이 등) 잔액이 마이너스가 되면 충전 거래를 이어서 기록 =====
    //  ① 계좌·금액 모두 설정(자동충전 설정) → 부족분을 덮는 설정 금액의 배수로 충전 거래 자동 기록
    //  ② 계좌만 설정 → 충전 시트(출금 계좌 프리셋, 금액=부족분)  ③ 미설정 → 충전 시트(계좌·금액 입력, '설정으로 저장' 스위치)
    //  판정: 저장 전 잔액(accountBalance) − 이번 거래 금액 < 0. 예정(미래) 거래는 현재 잔액에 안 잡히므로 제외, 수정 거래도 제외(변경 전후 잔액 재계산 모호).
    function autoChargeCheck(tx){
      const e=TX_EFFECT[tx.type]||{}; if(!e.debit || tx.type==='prepaid_charge') return null;   // 충전 거래 자신은 트리거 안 함(연쇄 방지)
      const id=tx[e.debit], a=getAcct(id);
      if(!a || !PREPAID_TYPES.includes(a.type)) return null;
      if((tx.date||'').slice(0,10) > todayStr()) return null;
      const after=accountBalance(id)-(Number(tx.amount)||0);
      return after<0 ? { acctId:id, deficit:-after, date:(tx.date||'').slice(0,10) } : null;
    }
    function handleAutoCharge(ac){
      const a=getAcct(ac.acctId); if(!a) return;
      const from=(a.autoChargeFrom&&getAcct(a.autoChargeFrom))?a.autoChargeFrom:'';
      const unit=Number(a.autoChargeAmount)||0;
      if(from && unit>0) insertChargeTx(ac.acctId, from, Math.ceil(ac.deficit/unit)*unit, ac.date, true);   // 설정 금액의 배수로 부족분 커버(실서비스 자동충전 방식)
      else setTimeout(()=>openAutoChargeSheet(ac.acctId, ac.deficit, ac.date), 260);   // 거래 시트 닫힘 후 입력창
    }
    // 충전 거래 삽입 — buildTx의 prepaid_charge 결과와 같은 필드 구성(잔액·카드실적·표시 정합). autoCharge:true 마커.
    function insertChargeTx(toId, fromId, amt, date, auto){
      const uidSel=defaultOwnerUid(), mem=(state.wsMeta&&state.wsMeta.members)||{};
      const tx={ type:'prepaid_charge', date:isoAtNoon(date||todayStr()), amount:amt,
        user:resolveOwnerName(uidSel), desc:(auto?'자동충전':'충전')+' · '+acctName(toId),
        isActualExpense:false, from:fromId, to:toId, autoCharge:true };
      if(mem[uidSel]||uidSel===state.uid) tx.userUid=uidSel;
      const card=getCard(fromId);
      if(card){ const inc=defaultCardIncluded(card,'prepaid_charge'); tx.cardPerformanceIncluded=!!inc; tx.cardPerformanceAmount=inc?amt:0; tx.cardPerformanceExcludedReason=''; }
      db.ref(wp('transactions/'+state.uid+'/'+(Date.now()+1))).set(tx).catch(_saveErr);   // +1: 직전 거래(Date.now() 키)와 같은 ms 충돌 방지
      toast('⚡ '+acctName(toId)+' 충전 +'+fmtComma(amt)+'원 ('+acctName(fromId)+')');
    }
    function openAutoChargeSheet(acctId, deficit, date){
      const a=getAcct(acctId); if(!a) return;
      const from=(a.autoChargeFrom&&getAcct(a.autoChargeFrom))?a.autoChargeFrom:'';
      const unit=Number(a.autoChargeAmount)||0;
      const pre=unit>0?Math.ceil(deficit/unit)*unit:deficit;
      const srcs=state.accounts.filter(x=>x.id!==acctId&&!PREPAID_TYPES.includes(x.type));
      let h='<p class="muted" style="margin:2px 2px 14px;line-height:1.55;">'+escapeHtml(a.name)+' 잔액이 <b style="color:var(--expense)">'+fmtComma(deficit)+'원 부족</b>해요. 어느 계좌에서 얼마를 충전(이체)했는지 기록할까요?</p>';
      h+='<div class="field"><label>출금 계좌</label><select class="input" id="acFrom">'+(from?'':'<option value="" selected disabled>계좌 선택</option>')+srcs.map(x=>'<option value="'+x.id+'"'+(x.id===from?' selected':'')+'>'+escapeHtml(x.name)+' ('+(ACCT_TYPE_LABEL[x.type]||x.type)+')</option>').join('')+'</select></div>';
      h+='<div class="field"><label>충전 금액</label><input class="input" id="acAmt" inputmode="numeric" value="'+pre.toLocaleString()+'" oninput="this.value=fmtComma(this.value)"></div>';
      h+='<div class="menu-item" style="padding:6px 0 10px;"><span>이 계좌·금액을 자동충전 설정으로 저장</span><div class="switch" id="acSaveCfg" '+App.view.act('toggleSwitch')+'><i></i></div></div>';
      h+='<button class="btn" '+App.view.act('saveAutoCharge',acctId,date)+'>충전 기록</button>';
      h+='<button class="btn ghost" style="margin-top:8px;" '+App.view.act('closeSheet')+'>건너뛰기 (마이너스 유지)</button>';
      openSheet('⚡ '+a.name+' 충전', h);
    }
    function saveAutoCharge(acctId, date){
      const from=val('acFrom'), amt=parseAmount(val('acAmt'));
      if(!from){ toast('출금 계좌를 선택하세요', true); return; }
      if(!(amt>0)){ toast('충전 금액을 입력하세요', true); return; }
      if($('acSaveCfg')&&$('acSaveCfg').classList.contains('on')) db.ref(wp('accounts/'+acctId)).update({ autoChargeFrom:from, autoChargeAmount:amt }).catch(()=>{});   // 다음부터 전자동
      insertChargeTx(acctId, from, amt, date, false);
      closeSheet();
    }
    // 예산 사전 경고: 이 지출로 관련 예산이 임계(alertThreshold) 또는 100%를 처음 넘으면 비차단 토스트(저장은 그대로).
    function budgetPreWarn(tx){
      if(!tx || !['expense','prepaid_spend','point_spend'].includes(tx.type) || tx.isActualExpense===false) return;
      const amt=Math.abs(Number(tx.amount)||0); if(!amt || typeof budgetUsage!=='function') return;
      (typeof visibleBudgets==='function'?visibleBudgets():(state.budgets||[])).forEach(b=>{   // 비공개·타인 개인예산은 경고 대상에서 제외
        if(b.categoryName && b.categoryName!==tx.category) return;                 // 카테고리 예산=같은 카테고리만
        if(!budgetOwnerMatch(b, tx)) return;   // 개인예산=소유자 소비만(집계 budgetTxs와 동일 기준). 공동 지출은 개인예산 경고 안 뜸(허위 경보 제거)
        const u=budgetUsage(b); if(!u || !u.amount) return;
        const projPct=Math.round((u.used+amt)/u.amount*100), th=(b.alertEnabled!==false)?(b.alertThreshold||80):101;
        if(projPct>=100 && u.pct<100) setTimeout(()=>toast('⚠️ '+budgetTitle(b)+' 예산 초과 ('+projPct+'%)', true), 400);
        else if(projPct>=th && u.pct<th) setTimeout(()=>toast('⚠️ '+budgetTitle(b)+' 예산 '+projPct+'% 도달'), 400);
      });
    }
    function deleteTx(){
      if(!sheetTx) return;
      const ref=sheetTx;
      const cur=state.transactions.find(x=>x.ownerUid===ref.ownerUid && x.id===ref.id)||{};
      // 💳+✨ 함께결제 짝: 본 거래를 지우면 포인트 거래도 함께 삭제, 포인트 거래를 지우면 본 거래의 연결만 끊는다.
      const coId=cur.coPayTxId||'', mainId=cur.coPayMainId||'';
      const msg=coId?'이 거래를 삭제할까요? 함께결제로 기록된 포인트 거래도 같이 지워집니다.':'이 거래를 삭제할까요?';
      confirmSheet(msg, ()=>{
        const upd={}; upd[ref.id]=null; if(coId) upd[coId]=null;
        if(mainId) { upd[mainId+'/coPayTxId']=null; upd[mainId+'/coPayAmount']=null; upd[mainId+'/coPayAcct']=null; }
        db.ref(wp('transactions/'+ref.ownerUid)).update(upd).catch(_saveErr);
        if(typeof removeRecurringLog==='function'){ removeRecurringLog(ref.ownerUid, ref.id); if(coId) removeRecurringLog(ref.ownerUid, coId); }
        toast(coId?'삭제되었습니다 (거래 2건)':'삭제되었습니다');
      });
    }

    // ===== 🧭 온보딩(첫 사용자 1회) =====
    function maybeOnboard(){ if(!state.uid) return;
      db.ref('users/'+state.uid+'/onboarded').once('value').then(s=>{ if(!s.val() && $('app') && $('app').style.display!=='none') openOnboarding(); }).catch(()=>{}); }
    function finishOnboard(){ if(state.uid){ try{ db.ref('users/'+state.uid+'/onboarded').set(true); }catch(e){} } closeSheet(); }
    function openOnboarding(){
      // 아이콘은 픽셀아트(브랜드 자산 재사용): 은화·픽셀 사람들·픽셀 고양이 정면. (CLAUDE.md 픽셀아트 규칙)
      const coin=(typeof coinSvg==='function')?coinSvg({h:28}):'🪙';
      const ppl=(typeof peopleSvg==='function')?peopleSvg({h:28}):'🧑‍🤝‍🧑';
      const cat=(typeof catFace==='function' && typeof PET_CATALOG!=='undefined' && PET_CATALOG[0])?catFace(PET_CATALOG[0].id,{h:30}):'🐱';
      const step=(ic,t,d,btn,fn)=>'<div class="obcard"><span class="obic">'+ic+'</span><div class="obtxt"><b>'+t+'</b><span>'+d+'</span></div><button class="obbtn" onclick="'+fn+'">'+btn+'</button></div>';
      let h='<p class="muted" style="margin:2px 2px 14px;line-height:1.55;">알뜰에 오신 걸 환영해요! 아래를 한 번씩 해보면 금방 익숙해져요.</p>';
      h+=step(coin,'거래·할일 기록','가운데 ＋ 로 오늘 지출이나 할일을 기록해요.','기록','finishOnboard();fabAdd()');
      h+=step(ppl,'친구 추가','친구 코드로 친구를 맺고 서로의 집·할일을 구경해요.','친구','finishOnboard();openFriendsSheet()');
      h+=step(cat,'알뜰홈','활동으로 은화를 모아 고양이를 입양하고 방을 꾸며요.','알뜰홈','finishOnboard();openCatHouse(\'home\')');
      h+='<button class="btn" style="margin-top:10px;" '+App.view.act('finishOnboard')+'>시작하기</button>';
      openSheet('시작하기', h);
    }
    // ===== 통계 =====
    function statsMonth(d){ state.month=shiftMonth(state.month,d); renderStats(); }
    function shortAmt(v){ v=Math.round(Math.abs(v)); if(v>=1e8) return (v/1e8).toFixed(1).replace(/\.0$/,'')+'억'; if(v>=1e4) return Math.round(v/1e4).toLocaleString()+'만'; return v.toLocaleString(); }
    function signComma(v){ return (v<0?'−':'+')+fmtComma(Math.abs(v)); }
    // ===== 할일(투두) 모드 화면 =====
    let _todoFilter='all', _todoSel=null, _doneDay=null;   // _doneDay = 완료 탭에서 보고 있는 '하루'(YYYY-MM-DD·KST, null=오늘)
    let _todoGroup='cat';   // 할일 목록 보기: 'cat'=카테고리별 묶음(기본, 사용자 요청) | 'due'=마감순 한 목록
    function setTodoFilter(f){ _todoFilter=f; renderTodoList(); }
    function setTodoGroup(m){ _todoGroup=m; renderTodoList(); }
    function setDoneDay(ds){ _doneDay=ds||todayKst(); renderTodoDone(); }
    function moveDoneDay(d){ _doneDay=addDays(_doneDay||todayKst(), d); renderTodoDone(); }
    function onDoneDayChange(){ if(this && this.value) setDoneDay(this.value); }   // <input type=date> 직접 선택(data-change)
    // 🎨 할일 카테고리 — 워크스페이스별 '사용자 정의' 세트(ws/{wsId}/todoCats, 가계부 카테고리와 같은 패턴).
    //   · 첫 진입 시 TODO_CAT_DEFAULTS 로 시드되고(core.js attach), 이후엔 카테고리 관리에서 직접 추가·수정·삭제한다.
    //   · 개인 할일(user-global)·친구 할일은 내 목록과 스코프가 다르므로, 저장 시 이름·색 스냅샷(catName/catColor)을 할일에 함께 기록해 폴백한다.
    function todoCatList(all){
      const l=(state.todoCats||[]);
      const src=l.length?l:TODO_CAT_DEFAULTS.map(function(c,i){ return {id:c[0],name:c[1],color:c[2],sortOrder:i+1,isActive:true,isDefault:true}; });   // 로딩 전=기본 세트로 표시(빈 화면 방지)
      return (all?src.slice():src.filter(function(c){ return c.isActive!==false; })).sort(function(a,b){ return (a.sortOrder||0)-(b.sortOrder||0); });
    }
    function todoCat(id){ if(!id) return null;
      const l=todoCatList(true); for(let i=0;i<l.length;i++) if(l[i].id===id) return l[i];
      for(let i=0;i<TODO_CAT_DEFAULTS.length;i++) if(TODO_CAT_DEFAULTS[i][0]===id) return { id:id, name:TODO_CAT_DEFAULTS[i][1], color:TODO_CAT_DEFAULTS[i][2] };   // 구버전 고정 id 폴백
      return null; }
    // 할일 1건의 카테고리 해석 — 내 목록 우선, 없으면 저장 때 남긴 스냅샷(친구 열람·삭제된 카테고리)
    function todoCatOf(t){ if(!t||!t.category) return null;
      const c=todoCat(t.category); if(c) return c;
      return t.catName ? { id:t.category, name:t.catName, color:t.catColor||'#8B95A1' } : null; }
    function todoCatColor(t){ const c=todoCatOf(t); return c?(c.color||''):''; }
    // 완료한 날(KST) — 일반 완료=doneAt, 반복 완료=lastDoneAt(마지막 회차만 기록됨). todayKst와 같은 UTC+9 경계.
    function todoDoneDay(t){ const s=(t&&(t.doneAt||t.lastDoneAt))||''; if(!s) return '';
      const d=new Date(s); if(isNaN(d.getTime())) return String(s).slice(0,10);
      return new Date(d.getTime()+9*3600000).toISOString().slice(0,10); }
    // 할일 편집 시트의 카테고리 칩(같은 칩 다시 탭=해제 → 카테고리 없음)
    let _tdCat='';
    function pickTodoCat(id){ _tdCat=(_tdCat===id)?'':id;
      const w=$('tdCatChips'); if(w) Array.prototype.forEach.call(w.querySelectorAll('.chip[data-c]'),function(b){ b.classList.toggle('on',(b.getAttribute('data-c')||'')===_tdCat); }); }   // data-c 없는 칩(＋ 새 카테고리)은 제외
    // 편집 시트용 칩 목록 = 사용자 정의 카테고리 + '＋ 새 카테고리'(시트를 떠나지 않고 바로 만들어 선택 → 작성 중 내용 유실 없음)
    function todoCatChipsHtml(){
      return todoCatList().map(function(c){
        return '<button type="button" class="chip'+(_tdCat===c.id?' on':'')+'" data-c="'+escapeHtml(c.id)+'" '+App.view.act('pickTodoCat',c.id)+'><span class="catdot" style="background:'+escapeHtml(c.color||'#8B95A1')+'"></span>'+escapeHtml(c.name||'')+'</button>';
      }).join('')+'<button type="button" class="chip tdcat-add" '+App.view.act('toggleTodoCatNew')+' aria-label="새 카테고리 만들기">＋ 새 카테고리</button>';
    }
    function todoCatNewFormHtml(){
      window._tdCatColor=window._tdCatColor||TODO_CAT_PALETTE[0];
      return '<input class="input" id="tdCatNewName" maxlength="12" placeholder="새 카테고리 이름 (예: 운동)">'+
        '<div class="swatch-grid" id="tdCatNewColors" style="margin:8px 0 0;">'+TODO_CAT_PALETTE.map(function(p){ return '<button type="button" class="swatch'+(p===window._tdCatColor?' on':'')+'" data-color="'+p+'" style="background:'+p+';" '+App.view.act('pickTodoCatColor')+'></button>'; }).join('')+'</div>'+
        '<button type="button" class="btn ghost" style="margin-top:8px;" '+App.view.act('addTodoCatInline')+'>이 카테고리 만들기</button>';
    }
    function toggleTodoCatNew(){ const w=$('tdCatNew'); if(!w) return; const show=w.hasAttribute('hidden');
      if(show){ w.innerHTML=todoCatNewFormHtml(); w.removeAttribute('hidden'); const i=$('tdCatNewName'); if(i) i.focus(); } else w.setAttribute('hidden',''); }
    function pickTodoCatColor(el){ el=el||this; window._tdCatColor=el.getAttribute('data-color');
      const w=$('tdCatNewColors'); if(w) Array.prototype.forEach.call(w.querySelectorAll('.swatch'),function(b){ b.classList.toggle('on',b===el); }); }
    // 편집 시트 안에서 카테고리 즉시 생성 → 새 카테고리를 바로 선택 상태로(칩 줄만 다시 그림)
    function addTodoCatInline(){
      const name=(val('tdCatNewName')||'').trim(); if(!name){ toast('카테고리 이름을 입력하세요', true); return; }
      const id=createTodoCat(name, window._tdCatColor||TODO_CAT_PALETTE[0]); if(!id) return;
      _tdCat=id; const w=$('tdCatNew'); if(w){ w.setAttribute('hidden',''); w.innerHTML=''; }
      setTimeout(function(){ const c=$('tdCatChips'); if(c) c.innerHTML=todoCatChipsHtml(); }, 80);   // RTDB 로컬 반영 후 칩 재생성(선택 상태 유지)
      toast('카테고리를 추가했어요');
    }
    // ===== 할일 카테고리 관리(가계부 '카테고리 관리'와 같은 패턴) =====
    // 저장 위치 = ws/{wsId}/todoCats (개인 프로필도 자기 ws 노드) — 그룹에선 멤버가 함께 쓴다.
    function todoCatWritable(){ return !todoReadOnly(); }
    function createTodoCat(name, color){
      if(!todoCatWritable()){ toast('친구 할일은 수정할 수 없어요', true); return ''; }
      if(todoCatList(true).some(function(c){ return (c.name||'')===name; })){ toast('이미 있는 카테고리', true); return ''; }
      const id='tc_'+Date.now(); const now=new Date().toISOString();
      const order=Math.max(0, ...todoCatList(true).map(function(c){ return c.sortOrder||0; }))+1;
      db.ref(wp('todoCats/'+id)).set({ id:id, name:name, color:color||TODO_CAT_PALETTE[0], sortOrder:order, isActive:true, isDefault:false, createdAt:now, updatedAt:now }).catch(_saveErr);
      return id;
    }
    function openTodoCatSheet(){ renderTodoCatManage(); }
    function renderTodoCatManage(){
      const build=function(){
        const cats=todoCatList(true);
        let h='<button class="btn" '+App.view.act('openTodoCatEdit')+'>+ 카테고리 추가</button>';
        h+='<div class="card" style="margin-top:12px;padding:6px 8px;">'+(cats.length?cats.map(todoCatManageRow).join(''):'<div class="empty">카테고리가 없습니다</div>')+'</div>';
        h+='<p class="muted" style="font-size:11.5px;margin:10px 2px 0;">카테고리는 할일 목록·캘린더에서 색으로 구분돼요. 끄면(비활성) 새 할일에서 고를 수 없지만 기존 할일의 색은 유지됩니다.</p>';
        return h;
      };
      openSheet('할일 카테고리', build());
      state._sheetRefresh=function(){ const b=$('sheetBody'); if(!b) return; const st=b.scrollTop; b.innerHTML=build(); b.scrollTop=st; };
    }
    function todoCatManageRow(c){
      const inactive=c.isActive===false;
      const used=allTodos().filter(function(t){ return t.category===c.id; }).length;
      return '<div class="acct" style="opacity:'+(inactive?'.5':'1')+';">'+
        '<div class="acct-dot" style="background:'+escapeHtml(c.color||'#8B95A1')+';"></div>'+
        '<div style="flex:1;min-width:0;" '+App.view.act('openTodoCatEdit',c.id)+'><div class="acct-name">'+escapeHtml(c.name||'')+(used?'<span class="pill">'+used+'건</span>':'')+'</div></div>'+
        '<div style="display:flex;align-items:center;gap:2px;">'+
          '<button class="icon-btn" style="width:30px;height:30px;font-size:13px;box-shadow:none;background:var(--line-soft);" '+App.view.act('moveTodoCat',c.id,-1)+' aria-label="위로">▲</button>'+
          '<button class="icon-btn" style="width:30px;height:30px;font-size:13px;box-shadow:none;background:var(--line-soft);" '+App.view.act('moveTodoCat',c.id,1)+' aria-label="아래로">▼</button>'+
          '<div class="switch '+(inactive?'':'on')+'" '+App.view.act('toggleTodoCatActive',c.id)+'><i></i></div>'+
        '</div></div>';
    }
    function moveTodoCat(id, dir){
      if(!todoCatWritable()) return;
      const list=todoCatList(true); const idx=list.findIndex(function(c){ return c.id===id; }); const j=idx+dir;
      if(idx<0||j<0||j>=list.length) return;
      const a=list[idx], b=list[j], upd={};
      upd['todoCats/'+a.id+'/sortOrder']=(b.sortOrder||j+1);
      upd['todoCats/'+b.id+'/sortOrder']=(a.sortOrder||idx+1);
      db.ref(wsRoot()).update(upd).catch(_saveErr);
    }
    function toggleTodoCatActive(id){ if(!todoCatWritable()) return; const c=todoCat(id); if(!c) return;
      db.ref(wp('todoCats/'+id+'/isActive')).set(c.isActive===false).catch(_saveErr); }
    function openTodoCatEdit(id){
      const c=id?todoCat(id):null;
      window._tdCatColor=c?(c.color||TODO_CAT_PALETTE[0]):TODO_CAT_PALETTE[0];
      let h='<div class="field"><label>이름</label><input class="input" id="tdCatName" maxlength="12" value="'+escapeHtml(c?(c.name||''):'')+'" placeholder="예: 운동"></div>';
      h+='<label style="font-size:13px;font-weight:600;color:var(--sub);">색상</label><div class="swatch-grid" id="tdCatNewColors">'+TODO_CAT_PALETTE.map(function(p){ return '<button type="button" class="swatch'+(p===window._tdCatColor?' on':'')+'" data-color="'+p+'" style="background:'+p+';" '+App.view.act('pickTodoCatColor')+'></button>'; }).join('')+'</div>';
      h+='<button class="btn" style="margin-top:12px;" '+App.view.act('saveTodoCat', id?id:null)+'>'+(c?'수정':'추가')+'</button>';
      if(c) h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deleteTodoCat',id)+'>삭제</button>';
      openSheet(c?'카테고리 수정':'카테고리 추가', h);
    }
    function saveTodoCat(id){
      if(!todoCatWritable()){ toast('친구 할일은 수정할 수 없어요', true); return; }
      const name=(val('tdCatName')||'').trim(); if(!name){ toast('이름을 입력하세요', true); return; }
      if(todoCatList(true).some(function(c){ return c.id!==id && (c.name||'')===name; })){ toast('이미 있는 카테고리', true); return; }
      const color=window._tdCatColor||TODO_CAT_PALETTE[0]; const now=new Date().toISOString();
      if(id){ const cur=(state.todoCats||[]).find(function(c){ return c.id===id; });
        // 아직 RTDB에 없는(기본값 폴백) id면 부분 update 대신 전체 필드로 기록 — sortOrder·isActive 가 비는 것 방지
        if(cur) db.ref(wp('todoCats/'+id)).update({ name:name, color:color, updatedAt:now }).catch(_saveErr);
        else db.ref(wp('todoCats/'+id)).set({ id:id, name:name, color:color, sortOrder:(Math.max(0,...todoCatList(true).map(function(c){ return c.sortOrder||0; }))+1), isActive:true, isDefault:true, createdAt:now, updatedAt:now }).catch(_saveErr); }
      else { if(!createTodoCat(name, color)) return; }
      toast(id?'수정되었습니다':'추가되었습니다'); openTodoCatSheet();
    }
    function deleteTodoCat(id){
      if(!todoCatWritable()) return; const c=todoCat(id); if(!c) return;
      const used=allTodos().filter(function(t){ return t.category===id; }).length;
      const msg=used?('이 카테고리를 쓴 할일이 '+used+'건 있습니다. 삭제해도 그 할일의 색·이름은 남지만 비활성화를 권장합니다. 그래도 삭제할까요?'):'이 카테고리를 삭제할까요?';
      confirmSheet(msg, function(){ db.ref(wp('todoCats/'+id)).remove().catch(_saveErr); toast('삭제되었습니다'); openTodoCatSheet(); });
    }
    // 개인(user-global)+그룹(ws) 할일 합본 — 조회/편집 대상 찾기용
    function allTodos(){ return (state.myTodos||[]).concat(state.todos||[]); }
    // 할일 쓰기 경로: 개인=users/{uid}/todos, 그룹=ws/{wsId}/todos
    function todoDbRef(t){ return todoScope(t)==='personal' ? db.ref('users/'+state.uid+'/todos/'+t.id) : db.ref(wp('todos/'+t.id)); }
    // 현재 세그먼트(개인/그룹) + 보는 대상에 해당하는 할일만
    // 할일 스코프는 현재 컨텍스트(그룹전환)로 결정: 개인 프로필=내 할일(user-global), 그룹=그룹 할일.
    function scopedTodos(){
      if(!isPersonalWs()) return (state.todos||[]).filter(t=>todoScope(t)==='group');   // 그룹 컨텍스트=그룹 할일
      // 개인 프로필: 내 것(myTodos·user-global) 또는 친구 열람(friendTodos·읽기전용)
      return (state._todoFriend && state._todoFriend!==state.uid) ? (state.friendTodos||[]) : (state.myTodos||[]);
    }
    // 배지·오늘홈 등 '내 미처리' 판정용 — 친구 열람 중에도 항상 내 스코프(그룹=그룹할일, 개인=내 할일). 친구 피드를 보는 동안 배지가 친구 할일을 세던 버그 방지.
    function myScopedTodos(){ return isPersonalWs() ? (state.myTodos||[]) : (state.todos||[]).filter(t=>todoScope(t)==='group'); }
    // 개인 프로필 할일에서 '내 할일 ↔ 친구들 피드' 토글(그룹 컨텍스트엔 세그먼트 없음)
    function setTodoFeed(on){ state._todoFeed=!!on; if(!on) clearFriendView(); _todoFilter='all'; rerender(); }
    function isPersonalWs(){ return ((state.wsMeta&&state.wsMeta.type)||'')==='personal'; }
    function todoScopeSeg(){
      if(!isPersonalWs() || state.tab!=='todo') return '';   // 개인 프로필의 할일 리스트 탭에서만 [내 할일|친구들](친구 피드는 이 탭에서만 렌더). 그룹 컨텍스트·캘린더/완료엔 세그먼트 없음
      const f=!!state._todoFeed || (!!state._todoFriend && state._todoFriend!==state.uid);
      return '<div class="seg todoseg"><button class="'+(f?'':'on')+'" '+App.view.act('setTodoFeed',false)+'>내 할일</button><button class="'+(f?'on':'')+'" '+App.view.act('setTodoFeed',true)+'>친구들</button></div>'; }
    // 개인 프로필에서 친구를 보고 있는지 = 읽기전용
    function todoReadOnly(){ return isPersonalWs() && !!state._todoFriend && state._todoFriend!==state.uid; }
    // 현재 열람 중인 친구 할일 리스너 해제 + 내 목록 복귀
    function clearFriendView(){ if(state._friendTodosRef){ try{ state._friendTodosRef.off(); }catch(e){} state._friendTodosRef=null; } state._todoFriend=null; state._friendTodosUid=null; state.friendTodos=[]; }
    // 표시 이름: 나 → 내 이름, 친구 → friends[uid].name, 폴백 멤버명
    function friendDisplayName(uid){ if(uid===state.uid) return state.userName||'나'; const f=(state.friends&&state.friends[uid]); if(f&&f.name) return f.name; const m=(state.wsMeta&&state.wsMeta.members)||{}; return (m[uid]&&m[uid].name)||'친구'; }
    function todoMemberName(uid){ return friendDisplayName(uid); }
    // 내 개인 할일 공개 on/off(user-global) — 친구 스트립·열람 대상.
    function toggleTodoPublic(){ if(!state.uid) return; const on=!!state.todoPublic; db.ref('users/'+state.uid+'/todoPublic').set(!on); toast(!on?'할일 공유 기본값을 켰어요(친구별 스위치가 우선)':'할일 공유 기본값을 껐어요(친구별 스위치가 우선)'); }
    // 🔐 할일 공유 설정 시트 — 기본값 토글 + '친구별' ON/OFF 스위치(프라이버시: 골라서 공유). OFF면 그 친구와 서로의 할일이 안 보임(양방향 차단).
    function openTodoShareSheet(){
      const on=!!state.todoPublic;
      let h='<p class="muted" style="margin:2px 2px 14px;line-height:1.55;">할일을 공유할 친구를 <b>친구별로</b> 고를 수 있어요. <b>ON</b>이면 서로의 할일이 보이고(상대도 나를 ON했을 때), <b>OFF</b>면 그 친구와 <b>서로의 할일이 보이지 않아요</b>.</p>';
      h+='<div class="lst">'+lrow(MORE_ICON.share,'공유 기본값(스위치 안 만진 친구)','toggleTodoPublic();openTodoShareSheet()', on?'켜짐':'꺼짐')+'</div>';
      const fr=Object.keys(state.friends||{});
      h+='<div class="sech"><span class="l">친구별 공유</span><span class="s">'+fr.length+'</span></div><div class="card" style="padding:4px 12px;">'+
        (fr.length?fr.map(function(u){ const f=state.friends[u]||{};
          const shareOn=(typeof myShareTo==='function')?myShareTo(u):on;
          const back=(state.friendPub&&state.friendPub[u]===true);   // 상대→나 공유 여부(참고 표기)
          const sub=shareOn?(back?'서로 공유 중':'상대가 아직 공유 안 함'):'공유 꺼짐';
          return '<div class="tdrow"><span class="tdwho">'+avatarHtml(u,f.name||'',28)+'</span>'+
            '<b class="tdtitle">'+escapeHtml(f.name||'친구')+'<small style="display:block;font-weight:600;color:var(--sub);font-size:11px;">'+sub+'</small></b>'+
            '<span class="fshare" role="switch" aria-checked="'+(shareOn?'true':'false')+'" aria-label="'+escapeHtml(f.name||'친구')+'와 할일 공유" '+App.view.act('toggleTodoShare',u)+'><span class="switch'+(shareOn?' on':'')+'"><i></i></span></span></div>'; }).join('')
        :'<div class="empty" style="padding:22px 6px;">아직 친구가 없어요 · 더보기 → 친구에서 추가하세요</div>')+'</div>';
      openSheet('할일 공유', h);
    }
    // 🔐 친구별 할일 공유 토글 — users/{me}/todoShare/{fuid}=true|false(미설정=기본값 todoPublic). OFF=양방향 숨김.
    function toggleTodoShare(uid){ if(!state.uid||!uid) return; const cur=(typeof myShareTo==='function')?myShareTo(uid):!!state.todoPublic;
      db.ref('users/'+state.uid+'/todoShare/'+uid).set(!cur)
        .then(function(){ toast(!cur?'이 친구와 할일을 공유해요':'이 친구와 할일 공유를 껐어요 — 서로의 할일이 보이지 않아요'); if($('sheet')&&$('sheet').classList.contains('on')) openTodoShareSheet(); })
        .catch(function(){ toast('설정을 저장하지 못했어요', true); });
    }
    // ===== 친구(별도 추가) — 친구 코드로 요청→수락, 상호 친구(users/{uid}/friends·friendReqs) =====
    function copyFriendCode(){ const c=state.friendCode||''; if(!c) return; try{ navigator.clipboard.writeText(c); }catch(e){} toast('친구 코드: '+c+' (복사됨)'); }
    function addFriendByCode(){
      const raw=(val('friendCodeIn')||'').trim().toUpperCase(); if(!raw){ toast('친구 코드를 입력하세요', true); return; }
      if(raw===state.friendCode){ toast('내 코드는 추가할 수 없어요', true); return; }
      db.ref('friendCodes/'+raw).once('value').then(function(s){
        const uid=s.val(); if(!uid){ toast('존재하지 않는 코드예요', true); return; }
        if(state.friends&&state.friends[uid]){ toast('이미 친구예요'); return; }
        db.ref('users/'+uid+'/friendReqs/'+state.uid).set({ name:state.userName||'', at:new Date().toISOString() })
          .then(function(){ toast('친구 요청을 보냈어요'); if($('friendCodeIn')) $('friendCodeIn').value=''; })
          .catch(function(){ toast('요청 실패', true); });
      });
    }
    function acceptFriend(uid){ const now=new Date().toISOString(), r=(state.friendReqs&&state.friendReqs[uid])||{}; const upd={};
      upd['users/'+state.uid+'/friends/'+uid]={ name:r.name||'', at:now };
      upd['users/'+uid+'/friends/'+state.uid]={ name:state.userName||'', at:now };
      upd['users/'+state.uid+'/friendReqs/'+uid]=null;
      db.ref().update(upd).then(function(){ toast('친구가 되었어요 🎉'); }).catch(function(){ toast('수락 실패', true); }); }
    function declineFriend(uid){ db.ref('users/'+state.uid+'/friendReqs/'+uid).remove().then(function(){ toast('요청을 거절했어요'); }); }
    // 프로필(랭킹·그룹 등)에서 uid로 바로 친구 요청 — 즉시 친구 아님, 상대가 친구 탭에서 수락/거절.
    function sendFriendRequest(uid){ if(!uid||uid===state.uid) return;
      if(state.friends&&state.friends[uid]){ toast('이미 친구예요'); return; }
      db.ref('users/'+uid+'/friendReqs/'+state.uid).set({ name:state.userName||'', at:new Date().toISOString() })
        .then(function(){ toast('친구 요청을 보냈어요'); const el=$('fhAddBtn'); if(el) el.outerHTML='<button class="btn ghost" disabled style="margin-top:6px;width:100%;">친구 요청됨</button>'; })
        .catch(function(){ toast('요청 실패', true); }); }
    function removeFriend(uid){ confirmSheet('친구를 삭제할까요?', function(){ const upd={}; upd['users/'+state.uid+'/friends/'+uid]=null; upd['users/'+uid+'/friends/'+state.uid]=null;
      db.ref().update(upd).then(function(){ if(state._todoFriend===uid) clearFriendView(); toast('친구를 삭제했어요'); rerender(); }); }); }
    // 친구 관리 시트(더보기 공용) — 내 할일 공개 토글·친구 코드 복사/추가·받은 요청·친구 목록(삭제). 열람은 '친구들' 피드에서.
    function openFriendsSheet(){
      const build=function(){
        const on=!!state.todoPublic;
        let h='<div class="lst">'+lrow(MORE_ICON.share,'할일 공유 설정','openTodoShareSheet()', on?'기본 켜짐':'기본 꺼짐')+'</div>'+
          '<p class="muted" style="font-size:12px;margin:6px 2px 0;">할일을 공유할 친구를 <b>친구별로</b> 고를 수 있어요 — OFF하면 그 친구와 서로의 할일이 보이지 않아요.</p>';
        h+='<div class="card" style="padding:14px;margin-top:12px;"><div class="sec-title">내 친구 코드</div>'+
          '<div class="row" style="gap:8px;align-items:center;margin-top:6px;"><b style="font-size:20px;letter-spacing:3px;flex:1;">'+escapeHtml(state.friendCode||'—')+'</b>'+
          '<button class="btn sm" style="flex:none;" '+App.view.act('copyFriendCode')+'>복사</button></div>'+
          '<div class="row" style="gap:8px;margin-top:10px;"><input class="input" id="friendCodeIn" placeholder="친구 코드 입력" autocapitalize="characters" spellcheck="false" style="flex:1;text-transform:uppercase;"><button class="btn sm" style="flex:none;" '+App.view.act('addFriendByCode')+'>추가</button></div></div>';
        const reqs=Object.keys(state.friendReqs||{});
        if(reqs.length){ h+='<div class="sech"><span class="l">받은 요청</span><span class="s">'+reqs.length+'</span></div><div class="card" style="padding:4px 12px;">'+
          reqs.map(function(u){ const r=state.friendReqs[u]||{}; return '<div class="tdrow"><span class="tdwho">'+avatarHtml(u,r.name||'',28)+'</span><b class="tdtitle">'+escapeHtml(r.name||'사용자')+'</b><button class="buy" '+App.view.act('acceptFriend',u)+'>수락</button><button class="buy dis" '+App.view.act('declineFriend',u)+'>거절</button></div>'; }).join('')+'</div>'; }
        const fr=Object.keys(state.friends||{});
        h+='<div class="sech"><span class="l">친구</span><span class="s">'+fr.length+'</span></div><div class="card" style="padding:4px 12px;">'+
          (fr.length?fr.map(function(u){ const f=state.friends[u]||{};
            const likes=(state.friendLikes&&state.friendLikes[u])||0; const changed=friendChangedToday(u);
            const av='<span class="tdwho'+(changed?' avring':'')+'">'+avatarHtml(u,f.name||'',28)+'</span>';
            return '<div class="tdrow friendrow" role="button" tabindex="0" '+App.view.act('openFriendHome',u)+'>'+av+'<b class="tdtitle">'+escapeHtml(f.name||'친구')+'</b>'+
              '<span class="likemini">'+heartSvg({h:13})+' '+likes+'</span>'+
              '<button class="buy dis" '+App.view.act('removeFriend',u)+'>삭제</button></div>'; }).join(''):'<div class="empty" style="padding:22px 6px;">아직 친구가 없어요 · 위 코드로 추가하세요</div>')+'</div>';
        h+='<p class="muted" style="font-size:12px;margin-top:10px;">친구를 탭하면 <b>집(펫캠)</b>을 방문해 좋아요를 누를 수 있어요. 등록한 할일은 <b>할일 → 친구들</b>에서도 볼 수 있어요.</p>';
        return h;
      };
      openSheet('친구', build());
      state._sheetRefresh=function(){ const b=$('sheetBody'); if(b) b.innerHTML=build(); };
    }
    function friendChangedToday(uid){ const c=state.friendHomeChangedByUid&&state.friendHomeChangedByUid[uid]; return !!(c && String(c).slice(0,10)===todayKst()); }
    // ===== 친구 집(펫캠) 방문 — 캠 + 좋아요 + 오늘의 할일(공개 시) =====
    // 🎁 친구 집 선물 보내기 바(친구에게만). 펫알 선물(은화100)·무료 응원 선물(하루 제한, 랜덤). 아이콘은 픽셀(eggSvg/giftSvg).
    function friendGiftBarInner(uid){
      const eggLeft=(typeof mailCountLeft==='function')?mailCountLeft('egg'):0;
      const freeLeft=(typeof mailCountLeft==='function')?mailCountLeft('free'):0;
      const freeDone=(typeof freeSentToday==='function')&&freeSentToday(uid);
      const canAfford=(typeof coins==='function')?coins()>=100:true;
      const egg=(typeof eggSvg==='function')?eggSvg(0,{h:20}):'🥚';
      const gift=(typeof giftSvg==='function')?giftSvg({h:20}):'🎁';
      const freeHint=freeDone ? '오늘 이 친구에게 보냄 · 내일 또 보낼 수 있어요'
                              : '물·사료·은화 랜덤 · 이 친구 하루 1번 · 오늘 전체 '+freeLeft+'회 남음';
      return '<button class="giftsend" '+App.view.act('sendPetEggGift',uid)+''+((eggLeft<=0||!canAfford)?' disabled':'')+'><span class="gsic">'+egg+'</span><span class="gstx"><b>펫알 선물</b><small>은화 100 · 남은 '+eggLeft+'회'+(!canAfford?' · 은화 부족':'')+'</small></span></button>'+
             '<button class="giftsend free" '+App.view.act('sendFreeGift',uid)+''+((freeDone||freeLeft<=0)?' disabled':'')+'><span class="gsic">'+gift+'</span><span class="gstx"><b>무료 응원 선물</b><small>'+freeHint+'</small></span></button>';
    }
    function friendGiftBar(uid){ return '<div class="sech"><span class="l">선물 보내기</span></div><div id="fhGiftBar" class="fhgift">'+friendGiftBarInner(uid)+'</div>'; }
    function openFriendHome(uid){
      if(!uid || uid===state.uid){ if(typeof openCatHouse==='function') openCatHouse('home'); return; }   // 내 집이면 내 알뜰홈 홈
      const isFriend=!!(state.friends&&state.friends[uid]);
      openSheet('불러오는 중…', '<div class="empty" style="padding:40px 12px;">불러오는 중…</div>');
      Promise.all([
        db.ref('homeCam/'+uid).once('value'),   // 대표 방 공개 스냅샷만 읽음(내 다른 방은 규칙상 비공개)
        db.ref('users/'+uid+'/todoPublic').once('value'),
        db.ref('users/'+uid+'/homeLikes').once('value'),
        db.ref('users/'+uid+'/todos').once('value'),
        db.ref('users/'+uid+'/profilePublic').once('value'),
        db.ref('users/'+uid+'/friendReqs/'+state.uid).once('value'),
        db.ref('users/'+uid+'/todoShare/'+state.uid).once('value').catch(function(){ return { val:function(){ return null; } }; })   // 🔐 상대의 친구별 토글(규칙 미배포·미설정=null→todoPublic 폴백)
      ]).then(function(res){
        if(!($('sheet')&&$('sheet').classList.contains('on'))) return;   // 그새 닫혔으면 중단
        const fg={ home:(res[0].val()||{}) }, likes=res[2].val();
        const shv=res[6]&&res[6].val(); const pub=(shv!=null)?!!shv:!!res[1].val();   // 🔐 상대→나 공유: 친구별 토글 우선, 미설정=todoPublic 기본값   // homeCam 스냅샷을 flat home으로(friendRoom이 그대로 사용)
        const priv=(res[4].val()===false);
        const sentReq=!!res[5].val(), incomingReq=!!(state.friendReqs&&state.friendReqs[uid]);   // 내가 보낸 요청 / 상대가 나에게 보낸 요청
        const anon=priv && !isFriend;                       // 비공개 + 비친구 → 익명(은화+알뜰)
        const showName=anon?'알뜰':friendDisplayName(uid);
        if($('sheetTitle')) $('sheetTitle').textContent=showName+'의 집';
        state._friendCam={ uid:uid, name:showName, game:fg, placedList:friendPlacedList(fg), active:friendActiveCats(fg) };
        try{ markStorySeen(uid, new Date().toISOString()); }catch(e){}   // 방문 = 스토리 열람 → 무지개 링 해제
        const cnt=homeLikeCount(likes), liked=likedTodayBy(likes, state.uid);
        let h=friendRoomHtml(fg, showName);
        h+='<div class="likebar"><button class="likebtn'+(liked?' on':'')+'" '+App.view.act('likeFriendHome',uid)+''+(liked?' disabled':'')+' aria-label="좋아요">'+heartSvg({h:20,off:!liked})+'<b id="fhLikeN">'+cnt+'</b></button>'+
           '<span class="likehint">'+(liked?'오늘 좋아요 완료 · 내일 또 눌러주세요':'하루 한 번 좋아요를 눌러줄 수 있어요')+'</span></div>';
        if(isFriend) h+=friendGiftBar(uid);   // 🎁 선물 보내기(친구에게만)
        const todosObj=res[3].val()||{};
        if(isFriend && pub && ((typeof myShareTo!=='function')||myShareTo(uid))){   // 🔐 친구 + 상대가 나와 공유 + 나도 상대와 공유(양방향)일 때만
          const undone=Object.keys(todosObj).map(function(k){ return Object.assign({id:k}, todosObj[k]); }).filter(function(t){ return !t.done; })
            .sort(function(a,b){ const ad=a.dueDate||'9999-99', bd=b.dueDate||'9999-99'; return ad<bd?-1:(ad>bd?1:0); });
          h+='<div class="sech"><span class="l">오늘의 할일</span><span class="s">'+undone.length+'</span></div>';
          h+='<div class="card" style="padding:4px 12px;">'+(undone.length?undone.map(function(t){ return friendTodoRow(uid,t); }).join(''):'<div class="empty" style="padding:18px 6px;">등록한 할일이 없어요</div>')+'</div>';
        } else if(isFriend){
          h+='<p class="muted" style="font-size:12px;margin-top:14px;text-align:center;">이 친구는 할일을 공개하지 않았어요</p>';
        } else {
          h+='<p class="muted" style="font-size:12px;margin-top:14px;text-align:center;">친구가 되면 할일도 볼 수 있어요</p>';
          if(incomingReq) h+='<div class="row" style="gap:8px;margin-top:6px;"><button class="btn" style="flex:1;" onclick="acceptFriend(\''+uid+'\');closeSheet()">친구 수락</button><button class="btn ghost" style="flex:1;" onclick="declineFriend(\''+uid+'\');closeSheet()">거절</button></div>';
          else if(sentReq) h+='<button class="btn ghost" disabled style="margin-top:6px;width:100%;">친구 요청됨</button>';
          else h+='<button class="btn" id="fhAddBtn" style="margin-top:6px;width:100%;" '+App.view.act('sendFriendRequest',uid)+'>＋ 친구 추가</button>';
        }
        const b=$('sheetBody'); if(b) b.innerHTML=h;
        // 선물 후 남은 횟수만 갱신(전체 재조회 없이)
        state._sheetRefresh=function(){ const el=$('fhGiftBar'); if(el) el.innerHTML=friendGiftBarInner(uid); };
        setTimeout(function(){ mountFriendRoom(fg); }, 30);
      }).catch(function(){ const b=$('sheetBody'); if(b) b.innerHTML='<div class="empty" style="padding:40px 12px;">집을 불러오지 못했어요</div>'; });
    }
    function likeFriendHome(uid){
      likeHome(uid, function(ok, cnt, rew){
        if(!ok){ toast('오늘은 이미 좋아요를 눌렀어요'); return; }
        toast('좋아요'+(rew>0?' · +'+rew+' 은화':''), false, (typeof heartSvg==='function'?heartSvg({h:16}):''));   // 픽셀 하트 토스트(+방문 보상)
        if(cnt!=null){ state.friendLikes=state.friendLikes||{}; state.friendLikes[uid]=cnt; }   // 친구목록 하트 수 즉시 반영
        const n=$('fhLikeN'); if(n && cnt!=null) n.textContent=cnt;
        const btn=document.querySelector('.likebtn');
        if(btn){
          btn.classList.add('on'); btn.disabled=true;
          const heart=btn.querySelector('.px');   // 회색(미좋아요) 하트를 즉시 채워진 하트로 교체 + 두근(beat) 애니
          if(heart && typeof heartSvg==='function') heart.outerHTML=heartSvg({h:20,cls:'beat'});
          if(typeof likeBurst==='function'){ const r=btn.getBoundingClientRect(); likeBurst(r.left+24, r.top+r.height/2); }   // 작은 하트들 뿅
        }
        const hint=document.querySelector('.likehint'); if(hint) hint.textContent='오늘 좋아요 완료 · 내일 또 눌러주세요';
      });
    }
    // ===== 🏆 랭킹(집 좋아요 TOP10) — 공용. rankings=참가자 디렉터리, 실제 좋아요는 homeLikes에서 라이브 집계(즉시 반영) =====
    function rankAvatar(r, size){
      if(r.anon) return '<div class="avatar avatar-coin" style="width:'+size+'px;height:'+size+'px;">'+(typeof coinSvg==='function'?coinSvg({h:Math.round(size*0.72)}):'')+'</div>';
      return avatarHtml(r.uid, r.show, size);
    }
    function renderRankingBody(rows){
      const b=$('sheetBody'); if(!b) return;
      if(!rows.length){ b.innerHTML='<div class="empty" style="padding:40px 12px;line-height:1.6;">아직 랭킹이 없어요.<br>친구 집에 <b>좋아요 ❤️</b>를 눌러 순위를 만들어 보세요.</div>'; return; }
      const top=rows.slice(0,3), rest=rows.slice(3);
      const order=[top[1],top[0],top[2]], rankOf=[2,1,3];   // 시각 배치: 좌 2등·가운데 1등·우 3등
      let h='<div class="rk-podium">';
      order.forEach(function(r,i){ const rank=rankOf[i]; if(!r){ h+='<div class="rk-col"></div>'; return; }
        const medal=['','gold','silver','bronze'][rank], sz=(rank===1?90:72), me=(r.uid===state.uid);
        const rankn=(typeof numSvg==='function'?numSvg(rank,'currentColor',{h:12}):String(rank));
        const spk=(typeof sparkSvg==='function')?'<span class="rk-spk"><i class="tw t1">'+sparkSvg({h:11})+'</i><i class="tw t2">'+sparkSvg({h:8})+'</i><i class="tw t3">'+sparkSvg({h:6})+'</i></span>':'';
        h+='<button class="rk-col'+(rank===1?' rk-first':'')+(me?' me':'')+'" '+App.view.act('openFriendHome',r.uid)+'>'+
          '<span class="rk-av medal-'+medal+'"><span class="rk-rankn">'+rankn+'</span>'+rankAvatar(r,sz)+spk+'</span>'+
          '<span class="rk-nm">'+escapeHtml(r.show)+(me?'<span class="rk-me">나</span>':'')+'</span>'+
          '<span class="rk-likes">'+(typeof heartSvg==='function'?heartSvg({h:12}):'❤')+' '+r.likes+'</span></button>';
      });
      h+='</div>';
      if(rest.length){ h+='<div class="rk-list">'+rest.map(function(r,i){ const rank=i+4, me=(r.uid===state.uid);
        return '<button class="rk-row'+(me?' me':'')+'" '+App.view.act('openFriendHome',r.uid)+'><span class="rk-num">'+rank+'</span>'+rankAvatar(r,40)+
          '<b class="rk-rowname">'+escapeHtml(r.show)+(me?'<span class="rk-me">나</span>':'')+'</b>'+'<span class="likemini">'+(typeof heartSvg==='function'?heartSvg({h:13}):'❤')+' '+r.likes+'</span></button>'; }).join('')+'</div>'; }
      h+='<p class="muted" style="font-size:12px;margin-top:14px;text-align:center;">집(펫캠) <b>좋아요 수</b> 기준 · 눌러서 방문해 보세요</p>';
      b.innerHTML=h;
    }
    function openRanking(){
      openSheet('랭킹', '<div class="empty" style="padding:40px 12px;">불러오는 중…</div>');
      db.ref('rankings').once('value').then(function(s){
        if(!($('sheet')&&$('sheet').classList.contains('on'))) return;
        const o=s.val()||{};
        let rows=Object.keys(o).map(function(uid){ const e=o[uid]||{}; return { uid:uid, name:e.name||'', likes:Number(e.likes)||0, priv:!!e.private }; });
        // 후보 선정: 저장 좋아요 기준 상위 CAP명(라이브 읽기 수 제한)
        rows.sort(function(a,b){ return (b.likes-a.likes) || String(a.name).localeCompare(String(b.name)); });
        const CAP=80, cand=rows.slice(0,CAP);
        // 실제 좋아요는 users/{uid}/homeLikes에서 라이브 집계 → 집주인 접속 여부와 무관하게 즉시·정확 반영
        Promise.all(cand.map(function(r){ return db.ref('users/'+r.uid+'/homeLikes').once('value')
          .then(function(hs){ r.likes=(typeof homeLikeCount==='function')?homeLikeCount(hs.val()):r.likes; }).catch(function(){}); }))
          .then(function(){
            if(!($('sheet')&&$('sheet').classList.contains('on'))) return;
            cand.sort(function(a,b){ return (b.likes-a.likes) || String(a.name).localeCompare(String(b.name)); });
            const top=cand.slice(0,10);
            top.forEach(function(r){ const isFriend=!!(state.friends&&state.friends[r.uid]); r.anon=r.priv&&!isFriend; r.show=r.anon?'알뜰':(r.name||'사용자'); });
            const need=top.filter(function(r){ return !r.anon && !(state.userPhotos&&state.userPhotos[r.uid]); });
            return Promise.all(need.map(function(r){ return db.ref('users/'+r.uid+'/photo').once('value').then(function(ps){ state.userPhotos[r.uid]=ps.val()||''; }).catch(function(){}); }))
              .then(function(){ renderRankingBody(top); });
          });
      }).catch(function(){ const b=$('sheetBody'); if(b) b.innerHTML='<div class="empty" style="padding:40px 12px;">랭킹을 불러오지 못했어요</div>'; });
    }
    // ===== 친구들 피드('친구들' 탭) = 인스타그램 스토리 줄 + 아래 친구 할일 피드 =====
    // 친구 할일 한 줄(읽기전용) — 우측에 누구 것인지 아바타
    function friendTodoRow(uid, t){ const nm=friendDisplayName(uid);
      const chk='<span class="tdchk'+(t.done?' on':'')+'" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></span>';
      return '<div class="tdrow">'+chk+'<span class="tdtitle'+(t.done?' done':'')+'">'+escapeHtml(t.title||'')+(t.repeat&&t.repeat!=='none'?' <span class="pill">🔁</span>':'')+(t.purposeBookId?' <span class="pill">📍</span>':'')+'</span>'+todoDueBadge(t,true)+'<span class="tdwho">'+avatarHtml(uid,nm,20)+'</span></div>'; }   // 친구 행=읽기전용(ro) → 마감배지 탭 불가(오해 방지)
    // 스토리 열람 기록(localStorage) — {uid: 마지막 열람 시 그 사람 최신 createdAt}
    function storySeenMap(){ try{ return JSON.parse(localStorage.getItem('storySeen')||'{}')||{}; }catch(e){ return {}; } }
    function markStorySeen(uid, latestAt){ if(!uid||!latestAt) return; try{ const m=storySeenMap(); m[uid]=latestAt; localStorage.setItem('storySeen', JSON.stringify(m)); }catch(e){} }
    function latestCreatedAt(list){ var m=''; (list||[]).forEach(function(t){ const c=(t&&t.createdAt)||''; if(c>m) m=c; }); return m; }
    function storyItem(uid, nm, ring, opts){ opts=opts||{};
      return '<button class="tdfr story ring-'+ring+(opts.me?' me':'')+'" onclick="'+opts.onclick+'" aria-label="'+escapeHtml(nm)+' 스토리">'+
        '<span class="story-av">'+avatarHtml(uid,nm,52)+(opts.me?'<span class="story-add">＋</span>':'')+'</span>'+
        '<span class="tdfrnm">'+(opts.me?'내 스토리':escapeHtml(nm))+'</span></button>'; }
    function renderFriendsFeed(){
      let h=todoScopeSeg();
      const pubUids=Object.keys(state.friends||{}).filter(function(u){ return (typeof todoMutual==='function')?todoMutual(u):(state.friendPub&&state.friendPub[u]); });   // 🔐 양방향 공유만
      const today=todayKst(); const seen=storySeenMap();
      const order=friendFeedOrder(state.friendTodosByUid, pubUids, today);
      // 스토리 줄: 내 스토리(맨 왼쪽) + 공개 친구(최근 등록순)
      // 스토리 활동시각 = 할일 최신 + 집 변경(펫/가구) 중 더 최신 → 집만 바꿔도 무지개 링
      const myChg=(state.game&&state.game.home&&state.game.home.changedAt)||'';
      const myLatest=[latestCreatedAt(state.myTodos), myChg].sort().pop()||'', myToday=(myLatest.slice(0,10)===today);
      const myRing=storyRing(myLatest, seen[state.uid], myToday);
      let strip=storyItem(state.uid, state.userName||'나', myRing, {me:true, onclick:'openMyStory()'});
      strip+=order.map(function(r){ const uid=r.uid, nm=friendDisplayName(uid);
        const chg=(state.friendHomeChangedByUid&&state.friendHomeChangedByUid[uid])||'';
        const latest=[r.lastAt||'', chg].sort().pop()||''; const todayReg=(latest.slice(0,10)===today);
        const ring=storyRing(latest, seen[uid], todayReg);
        return storyItem(uid, nm, ring, {onclick:"openFriendHome('"+uid+"')"}); }).join('');
      h+='<div class="tdfriends"><div class="tdfr-scroll story-row">'+strip+'</div></div>';
      if(!pubUids.length){
        h+='<div class="card"><div class="empty" style="padding:22px 12px;line-height:1.6;">공개한 친구가 아직 없어요.<br>더보기 → <b>친구</b>에서 추가하거나, 친구가 <b>할일 공개</b>를 켜면 스토리에 떠요.</div></div>';
        $('content').innerHTML=h; return;
      }
      // 아래 피드: 모든 공개 친구 미완료 할일 합본(마감 임박순)
      let rows=[]; order.forEach(function(r){ (state.friendTodosByUid[r.uid]||[]).forEach(function(t){ if(!t.done) rows.push({uid:r.uid,t:t}); }); });
      rows.sort(function(a,b){ const ad=a.t.dueDate||'9999-99', bd=b.t.dueDate||'9999-99'; if(ad!==bd) return ad<bd?-1:1; return (b.t.createdAt||'').localeCompare(a.t.createdAt||''); });
      h+='<div class="sech"><span class="l">친구들 할일</span><span class="s">'+rows.length+'</span></div>';
      h+='<div class="card" style="padding:4px 12px;">'+(rows.length?rows.map(function(x){ return friendTodoRow(x.uid,x.t); }).join(''):'<div class="empty" style="padding:24px 6px;">아직 등록한 할일이 없어요</div>')+'</div>';
      $('content').innerHTML=h;
    }
    // ===== 풀스크린 스토리 뷰어 =====
    let _story=null, _storyTimer=0;
    function storyTodos(uid){ const list=(uid===state.uid?(state.myTodos||[]):(state.friendTodosByUid[uid]||[])).slice();
      list.sort(function(a,b){ return (a.createdAt||'').localeCompare(b.createdAt||''); }); return list; }   // 오래된→최신 순 재생
    function ensureStoryEl(){ let el=$('storyView'); if(!el){ el=document.createElement('div'); el.id='storyView'; el.className='storyview'; el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true'); document.body.appendChild(el); } return el; }
    function openMyStory(){ if(typeof openCatHouse==='function') openCatHouse('home'); }   // 내 스토리 = 내 알뜰홈 홈(라이브 캠)
    function openFriendStory(uid){
      const pub=Object.keys(state.friends||{}).filter(function(u){ return (typeof todoMutual==='function')?todoMutual(u):(state.friendPub&&state.friendPub[u]); });   // 🔐 양방향 공유만
      const order=friendFeedOrder(state.friendTodosByUid, pub, todayKst()).map(function(r){ return r.uid; }).filter(function(u){ return storyTodos(u).length; });
      const i=order.indexOf(uid); if(i<0){ toast('아직 등록한 할일이 없어요'); return; }
      _openStory(order, i); }
    function _openStory(uids, fi){ uids=(uids||[]).filter(function(u){ return storyTodos(u).length; }); if(!uids.length){ toast('아직 등록한 할일이 없어요'); return; }
      _story={ uids:uids, fi:Math.max(0,Math.min(fi,uids.length-1)), ti:0 };
      document.body.classList.add('story-open'); document.addEventListener('keydown', _storyKey); renderStory(); }
    function closeStory(){ if(_storyTimer){ clearTimeout(_storyTimer); _storyTimer=0; } _story=null;
      document.body.classList.remove('story-open'); document.removeEventListener('keydown', _storyKey);
      const el=$('storyView'); if(el) el.classList.remove('on'); rerender(); }   // rerender=열람 링 갱신
    function _storyKey(e){ if(!_story) return; if(e.key==='Escape') closeStory(); else if(e.key==='ArrowRight') storyNext(); else if(e.key==='ArrowLeft') storyPrev(); }
    function storyNext(){ if(!_story) return; const uid=_story.uids[_story.fi], n=storyTodos(uid).length;
      if(_story.ti<n-1){ _story.ti++; } else if(_story.fi<_story.uids.length-1){ _story.fi++; _story.ti=0; } else { closeStory(); return; } renderStory(); }
    function storyPrev(){ if(!_story) return; if(_story.ti>0){ _story.ti--; } else if(_story.fi>0){ _story.fi--; _story.ti=Math.max(0, storyTodos(_story.uids[_story.fi]).length-1); } renderStory(); }
    function renderStory(){
      if(!_story) return; const el=ensureStoryEl(); const uid=_story.uids[_story.fi], list=storyTodos(uid), t=list[_story.ti]||{}, nm=friendDisplayName(uid), me=(uid===state.uid);
      markStorySeen(uid, latestCreatedAt(list));
      const bars=list.map(function(_,i){ return '<span class="sv-bar'+(i<_story.ti?' done':'')+(i===_story.ti?' cur':'')+'"><i></i></span>'; }).join('');
      const rt=(typeof relTime==='function')?relTime(t.createdAt, Date.now()):'';
      let h='<div class="sv-top"><div class="sv-bars">'+bars+'</div>'+
        '<div class="sv-head">'+avatarHtml(uid,nm,32)+'<b>'+(me?'내 스토리':escapeHtml(nm))+'</b><span class="sv-time">'+rt+'</span><button class="sv-x" '+App.view.act('closeStory')+' aria-label="닫기">✕</button></div></div>';
      h+='<div class="sv-body"><div class="sv-card"><div class="sv-title'+(t.done?' done':'')+'">'+escapeHtml(t.title||'(제목 없음)')+'</div>'+
        (t.dueDate?'<div class="sv-due">'+todoDueBadge(t,true)+'</div>':'')+(t.note?'<div class="sv-note">'+escapeHtml(t.note)+'</div>':'')+(t.done?'<div class="sv-doneflag">✓ 완료</div>':'')+'</div>'+
        (me?'<button class="btn" style="margin-top:14px;" onclick="closeStory();openTodoEdit()">＋ 할일 추가</button>':'')+'</div>';
      h+='<button class="sv-zone left" '+App.view.act('storyPrev')+' aria-label="이전"></button><button class="sv-zone right" '+App.view.act('storyNext')+' aria-label="다음"></button>';
      el.innerHTML=h; el.classList.add('on');
      if(_storyTimer){ clearTimeout(_storyTimer); _storyTimer=0; }
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(!reduce) _storyTimer=setTimeout(storyNext, 4200);   // 자동 넘김(4.2s)
    }
    // nextDue/dueDiffDays는 js/util.js(순수함수·단위테스트)로 이관됨 — 전역으로 사용.
    function todoDueBadge(t, ro){ const editable=!ro && !t.done;   // 미완료·편집가능 행은 배지를 탭해 '날짜 옮기기'
      if(t.done){ const d=t.doneAt?ymd(new Date(t.doneAt)):'';   // 완료 항목=마감 경과("N일 지남") 대신 완료일(중립색) — doneAt(ISO)을 로컬 날짜로 변환
        return d?'<span class="tdue">'+(+d.slice(5,7))+'/'+(+d.slice(8,10))+' 완료</span>':''; }
      if(!t.dueDate){ return editable ? '<button class="tdue tap none" '+App.view.act('openTodoReschedule',t.id)+' aria-label="날짜 지정">날짜</button>' : ''; }
      const today=todayKst();
      const diff=dueDiffDays(t.dueDate, today);
      let txt,cls; if(diff<0){ txt=(-diff)+'일 지남'; cls='over'; } else if(diff===0){ txt='오늘'; cls='today'; } else if(diff===1){ txt='내일'; cls='soon'; } else { txt='D-'+diff; cls=diff<=3?'soon':''; }
      const tt=t.dueTime?'<span class="tdue ttime">'+escapeHtml(t.dueTime)+'</span>':'';   // ⏰ 마감 시간 태그 — '오늘' 배지 옆에 함께 표시
      return (editable
        ? '<button class="tdue tap '+cls+'" '+App.view.act('openTodoReschedule',t.id)+' aria-label="날짜 옮기기">'+txt+'</button>'
        : '<span class="tdue '+cls+'">'+txt+'</span>')+tt; }
    // ctxDay: 이 행이 '어느 날짜 화면'에서 그려졌는지(YYYY-MM-DD) — 캘린더 날짜 목록이 넘겨주며, 완료 시 그 날짜로 기록된다(toggleTodo 2번째 인자).
    function todoRow(t, ro, drag, ctxDay){
      // 담당자 표시: 현재 멤버면 최신 이름(개명 반영)+아바타, 탈퇴 등 미상이면 저장된 이름 텍스트(uid 노출 방지)
      const _tmem=(state.wsMeta&&state.wsMeta.members)||{}, _isMem=t.assignedUid&&_tmem[t.assignedUid];
      const _anm=_isMem?(_tmem[t.assignedUid].name||''):(t.assignedName||'');
      const who=_isMem?('<span class="tdwho">'+avatarHtml(t.assignedUid,_anm,20)+'</span>')
        :(_anm?('<span class="tdwho"><span class="tdname">'+escapeHtml(_anm)+'</span></span>'):'');
      const _rep=(t.repeat&&t.repeat!=='none')||!!t.repeatSrcId; const _dc=Number(t.doneCount)||0;   // repeatSrcId=반복 완료 스냅샷도 🔁 표시
      const repPill=_rep?(' <span class="pill">🔁'+(_dc>0?' '+_dc+'회':'')+'</span>'):'';   // 반복 완료 횟수(있으면) — 반복 완료 이력 가시화
      const prioDot=(t.priority==='high')?'<span class="tdprio high" title="높음" aria-label="우선순위 높음">●</span>':((t.priority==='low')?'<span class="tdprio low" title="낮음" aria-label="우선순위 낮음">●</span>':'');
      const _tc=todoCatOf(t); const catDot=_tc?'<span class="tdcat" style="background:'+escapeHtml(_tc.color||'')+'" title="'+escapeHtml(_tc.name||'')+'" aria-label="카테고리 '+escapeHtml(_tc.name||'')+'"></span>':'';   // 카테고리 색 점(todoCats)
      const tagHtml=(t.tags&&t.tags.length)?' '+t.tags.slice(0,3).map(function(g){ return '<span class="tdtag">'+escapeHtml(g)+'</span>'; }).join(''):'';
      const _sub=Array.isArray(t.subtasks)?t.subtasks:[], _sdone=_sub.filter(function(s){ return s.done; }).length;
      const subBadge=_sub.length?(ro?(' <span class="pill tdsub'+(_sdone>=_sub.length?' all':'')+'">☑ '+_sdone+'/'+_sub.length+'</span>')
        :(' <span class="pill tdsub'+(_sdone>=_sub.length?' all':'')+'" role="button" tabindex="0" '+App.view.act('openTodoSubtasks',t.id)+' aria-label="하위 작업">☑ '+_sdone+'/'+_sub.length+'</span>')):'';
      const chkSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>';
      const chk=ro
        ? '<span class="tdchk'+(t.done?' on':'')+'" aria-hidden="true">'+chkSvg+'</span>'
        : '<button class="tdchk'+(t.done?' on':'')+'" '+App.view.act('toggleTodo',t.id,ctxDay||'')+' aria-label="'+(t.done?'완료 취소':'완료 처리')+'">'+chkSvg+'</button>';
      const titleTag=ro
        ? '<span class="tdtitle'+(t.done?' done':'')+'">'
        : '<span class="tdtitle'+(t.done?' done':'')+'" '+App.view.act('openTodoEdit',t.id)+'>';
      const dragH=(drag&&!ro)?'<span class="tddrag" onpointerdown="tdDragDown(event,\''+escapeHtml(t.id)+'\')" title="끌어서 순서 변경" aria-label="순서 변경">≡</span>':'';   // ↕️ 수동 정렬 핸들(마감순 보기)
      return '<div class="tdrow" data-tdid="'+escapeHtml(t.id)+'">'+chk+prioDot+catDot+
        titleTag+escapeHtml(t.title||'')+repPill+subBadge+tagHtml+(t.purposeBookId?' <span class="pill">📍</span>':'')+'</span>'+
        todoDueBadge(t, ro)+who+dragH+'</div>';
    }
    // ↕️ 할일 수동 정렬(마감순 보기 전용) — ≡ 핸들을 끌어 놓으면 '같은 마감일·우선순위 묶음 안'에서 sortOrder를 바꾼다
    //  (목록 1차 정렬이 마감일·우선순위라 묶음 밖으로는 못 나감 — 밖에 놓으면 그 묶음의 끝으로 클램프됨).
    let _tdDrag=null;
    function tdDragDown(e, id){
      e.preventDefault(); e.stopPropagation();
      const row=e.target&&e.target.closest?e.target.closest('.tdrow'):null; if(!row||!row.parentElement) return;
      _tdDrag={ id:id, row:row, card:row.parentElement, startY:e.clientY, after:undefined };
      row.classList.add('dragging');
      document.addEventListener('pointermove', tdDragMove);
      document.addEventListener('pointerup', tdDragUp);
      document.addEventListener('pointercancel', tdDragUp);
    }
    function tdDragMove(e){ const d=_tdDrag; if(!d) return;
      d.row.style.transform='translateY('+(e.clientY-d.startY)+'px)';
      const sibs=Array.prototype.filter.call(d.card.children, function(el){ return el.classList&&el.classList.contains('tdrow')&&el!==d.row; });
      let after=null; sibs.forEach(function(s){ const r=s.getBoundingClientRect(); if(e.clientY > r.top + r.height/2) after=s; });
      d.after=after;
    }
    function tdDragUp(){ const d=_tdDrag; _tdDrag=null; if(!d) return;
      document.removeEventListener('pointermove', tdDragMove);
      document.removeEventListener('pointerup', tdDragUp);
      document.removeEventListener('pointercancel', tdDragUp);
      d.row.classList.remove('dragging'); d.row.style.transform='';
      if(d.after===undefined) return;   // 움직이지 않음
      const byId={}; scopedTodos().forEach(function(x){ byId[x.id]=x; });
      const t=byId[d.id]; if(!t) return;
      // 새 시각 순서(id 배열): 남은 행 순서에 드래그 행을 after 뒤(또는 맨 앞)로 삽입
      const others=Array.prototype.filter.call(d.card.children, function(el){ return el.classList&&el.classList.contains('tdrow')&&el!==d.row; })
        .map(function(el){ return el.getAttribute('data-tdid'); });
      const idx=d.after?(others.indexOf(d.after.getAttribute('data-tdid'))+1):0;
      others.splice(idx,0,d.id);
      // 같은 (마감일|우선순위) 묶음 안에서의 상대 순서만 반영 — sortOrder를 이웃 사이 값으로
      const keyOf=function(x){ return (x.dueDate||'')+'|'+(x.priority||'normal'); };
      const grp=others.filter(function(i2){ const x=byId[i2]; return x&&keyOf(x)===keyOf(t); });
      const pos=grp.indexOf(d.id);
      const so=function(i2){ const x=byId[i2]; return (x&&x.sortOrder!=null)?Number(x.sortOrder):0; };
      let ns;
      if(pos<0) return;
      else if(grp.length===1) return;   // 묶음에 혼자면 의미 없음
      else if(pos===0) ns=so(grp[1])-1000;
      else if(pos===grp.length-1) ns=so(grp[pos-1])+1000;
      else ns=(so(grp[pos-1])+so(grp[pos+1]))/2;
      todoDbRef(t).update({ sortOrder:ns, updatedAt:new Date().toISOString() }).catch(_saveErr);
      renderTodoList();
    }
    // ☑ 하위 작업 시트 — 항목별 완료 토글(추가·삭제·수정은 할일 편집에서). 토글 시 시트만 갱신(_sheetRefresh).
    function openTodoSubtasks(id){
      const chkSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>';
      const build=function(){
        const t=allTodos().find(function(x){ return x.id===id; }); if(!t) return '<div class="empty" style="padding:20px;">할일을 찾을 수 없어요</div>';
        const subs=Array.isArray(t.subtasks)?t.subtasks:[], ro=todoReadOnly(), done=subs.filter(function(s){ return s.done; }).length;
        let h='<div class="sech"><span class="l">하위 작업</span><span class="s">'+done+' / '+subs.length+'</span></div>';
        h+='<div class="card" style="padding:4px 12px;">'+(subs.length?subs.map(function(s,i){
          const chk=ro?('<span class="tdchk'+(s.done?' on':'')+'" aria-hidden="true">'+chkSvg+'</span>')
            :('<button class="tdchk'+(s.done?' on':'')+'" '+App.view.act('toggleSubtask',id,i)+' aria-label="'+(s.done?'완료 취소':'완료')+'">'+chkSvg+'</button>');
          return '<div class="tdrow">'+chk+'<span class="tdtitle'+(s.done?' done':'')+'">'+escapeHtml(s.text||'')+'</span></div>';
        }).join(''):'<div class="empty" style="padding:20px 6px;">하위 작업이 없어요 — 할일 수정에서 추가해요</div>')+'</div>';
        if(subs.length) h+='<p class="muted" style="font-size:11.5px;margin:8px 2px;">항목 추가·삭제·수정은 <b>할일 수정</b>에서 해요.</p>';
        return h;
      };
      const t0=allTodos().find(function(x){ return x.id===id; });
      openSheet(t0?(t0.title||'하위 작업'):'하위 작업', build());
      state._sheetRefresh=function(){ const b=$('sheetBody'); if(b) b.innerHTML=build(); };
    }
    function toggleSubtask(id, idx){
      const t=allTodos().find(function(x){ return x.id===id; }); if(!t) return;
      const subs=(Array.isArray(t.subtasks)?t.subtasks:[]).map(function(s){ return { text:s.text||'', done:!!s.done }; });
      if(!subs[idx]) return;
      subs[idx].done=!subs[idx].done;
      todoDbRef(t).update({ subtasks:subs, updatedAt:new Date().toISOString() }).catch(_saveErr);
      if(state._sheetRefresh) setTimeout(function(){ if(state._sheetRefresh) state._sheetRefresh(); }, 60);   // RTDB 로컬 반영 후 시트만 갱신
    }
    // 🔍 할일 검색 — 키워드(제목·메모·태그) + 우선순위 + 완료포함. scopedTodos에서 필터, 폼은 정적·결과만 갱신(입력 포커스 유지).
    let _todoSearchT=0;
    function _todoSearchRender(){ const r=$('tdsResults'); if(r) r.innerHTML=todoSearchResults(); }
    function todoSearchResults(){
      const q=state._todoSearch||{}; const kw=(q.keyword||'').trim().toLowerCase(); const prio=q.priority||'';
      let res=scopedTodos().filter(function(t){
        if(prio && (t.priority||'normal')!==prio) return false;
        if(!q.includeDone && t.done) return false;
        if(!kw) return true;
        return (((t.title||'')+' '+(t.note||'')+' '+((t.tags||[]).join(' '))).toLowerCase()).indexOf(kw)>=0;
      });
      res.sort(function(a,b){ const ad=a.dueDate||'9999-99', bd=b.dueDate||'9999-99'; return ad<bd?-1:ad>bd?1:0; });
      const ro=todoReadOnly(); const rows=res.slice(0,100).map(function(t){ return todoRow(t, ro); }).join('');
      return '<div class="sech"><span class="l">결과</span><span class="s">'+res.length+'건'+(res.length>100?' · 100 표시':'')+'</span></div>'+
        '<div class="card" style="padding:4px 12px;">'+(rows||'<div class="empty" style="padding:22px 6px;">검색 결과가 없어요</div>')+'</div>';
    }
    function todoSearchSet(k,v){ (state._todoSearch||(state._todoSearch={}))[k]=v;
      if(k==='keyword'){ clearTimeout(_todoSearchT); _todoSearchT=setTimeout(_todoSearchRender, 180); }   // 타이핑 디바운스
      else { if(k==='priority'){ const seg=$('tdsSeg'); if(seg) Array.prototype.forEach.call(seg.querySelectorAll('.chip'),function(b){ b.classList.toggle('on',(b.getAttribute('data-p')||'')===(v||'')); }); } _todoSearchRender(); } }
    function openTodoSearch(){
      const st=state._todoSearch||(state._todoSearch={});
      let h='<div class="field"><label for="tdsKw">키워드(제목·메모·태그)</label><input class="input" id="tdsKw" value="'+escapeHtml(st.keyword||'')+'" oninput="todoSearchSet(\'keyword\',this.value)" placeholder="예: 장보기, 급함"></div>'+
        '<div class="chip-row" id="tdsSeg">'+[['','전체'],['high','🔴 높음'],['normal','보통'],['low','🔵 낮음']].map(function(p){ return '<button class="chip '+((st.priority||'')===p[0]?'on':'')+'" data-p="'+p[0]+'" '+App.view.act('todoSearchSet','priority',p[0])+'>'+p[1]+'</button>'; }).join('')+'</div>'+
        '<label style="display:flex;align-items:center;gap:8px;margin:6px 2px 10px;font-size:13px;color:var(--sub);"><input type="checkbox" '+(st.includeDone?'checked':'')+' onchange="todoSearchSet(\'includeDone\',this.checked)"> 완료 포함</label>'+
        '<div id="tdsResults">'+todoSearchResults()+'</div>';
      openSheet('할일 검색', h);
    }
    function renderTodoList(){
      // 개인 프로필의 '친구들' = 친구 피드(아바타 정렬·오늘 무지개·친구 할일 목록). 단, 특정 친구를 열람 중이면 그 친구 목록을 보여줌(아래로 진행).
      if(isPersonalWs() && state._todoFeed && !(state._todoFriend && state._todoFriend!==state.uid)) return renderFriendsFeed();
      $('content').innerHTML=todoListHtml();
    }
    // 할일 목록 화면 프로듀서(순수 HTML) — App.view.components.todoList 로 등록(Phase 3 컴포넌트 계약)
    function todoListHtml(){
      const meUid=state.uid; const today=todayKst();   // 은화 일일상한(KST)과 같은 날 경계로 마감 판정
      const weekEnd=addDays(today,7);
      const isGroup=!isPersonalWs();
      if(!isGroup && _todoFilter==='mine') _todoFilter='all';   // 개인 탭엔 '내 담당' 필터 없음
      const base=scopedTodos();
      let open=base.filter(t=>!t.done);
      if(_todoFilter==='mine') open=open.filter(t=>t.assignedUid===meUid || (!t.assignedUid && t.assignedName && t.assignedName===state.userName));   // uid 없이 이름으로만 배정된 내 할일도 포함
      else if(_todoFilter==='today') open=open.filter(t=>!t.dueDate||t.dueDate===today);   // 오늘 마감 + 마감 없는(언제든) 할일만 — 지난 미완료를 자동으로 '오늘'에 끌어오지 않음(사용자 지침: 이월은 🕘 버튼으로 명시적으로)
      else if(_todoFilter==='week') open=open.filter(t=>!t.dueDate||t.dueDate<=weekEnd);
      const _pv=p=>(p==='high'?0:p==='low'?2:1);   // 우선순위 정렬키(높음 먼저)
      open.sort((a,b)=>{ const ad=(a.dueDate||'9999-99')+'T'+(a.dueTime||'23:59'), bd=(b.dueDate||'9999-99')+'T'+(b.dueTime||'23:59'); if(ad!==bd) return ad<bd?-1:1; const pa=_pv(a.priority),pb=_pv(b.priority); if(pa!==pb) return pa-pb; return (a.sortOrder||0)-(b.sortOrder||0); });   // 같은 날은 시간 지정이 먼저(미지정=23:59 취급)
      // ✅ 완료 섹션은 '하루치'만 — 오늘 완료한 것만(다른 날은 완료 탭에서 날짜를 골라서 본다). 예전엔 전 기간 완료가 목록 밑에 계속 쌓였다.
      //   날짜 판정은 완료일(doneAt·KST)=todoDoneDay 기준이라 캘린더의 완료 점과 같은 날 경계.
      let done=base.filter(t=>t.done && todoDoneDay(t)===today);
      if(_todoFilter==='mine') done=done.filter(t=>t.assignedUid===meUid || (!t.assignedUid && t.assignedName && t.assignedName===state.userName));
      done.sort((a,b)=>(b.doneAt||'').localeCompare(a.doneAt||''));
      const chips=isGroup?[['all','전체'],['mine','내 담당'],['today','오늘'],['week','이번주']]:[['all','전체'],['today','오늘'],['week','이번주']];
      let h=todoScopeSeg();   // 개인 탭 = 내 할일만(친구는 '친구들' 탭 피드로 일원화)
      h+='<div class="chip-row" style="margin:6px 0 12px;">'+chips.map(c=>'<button class="chip'+(_todoFilter===c[0]?' on':'')+'" '+App.view.act('setTodoFilter',c[0])+'>'+c[1]+'</button>').join('')+'<button class="chip srch" '+App.view.act('openTodoSearch')+' aria-label="할일 검색"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>검색</button>'+
        '<span class="repvalseg" style="margin-left:auto;"><button class="'+(_todoGroup==='cat'?'on':'')+'" '+App.view.act('setTodoGroup','cat')+' aria-label="카테고리별 묶어 보기">카테고리</button><button class="'+(_todoGroup==='cat'?'':'on')+'" '+App.view.act('setTodoGroup','due')+' aria-label="마감순으로 보기">마감순</button></span></div>';
      const roList=!!(state._todoFriend && state._todoFriend!==state.uid);   // 친구 열람=읽기전용(배지 탭·일괄 이동 숨김)
      if(!roList){ const odIds=overdueTodoIds(base, today); if(odIds.length) h+='<button class="td-carry" '+App.view.act('carryOverdueToToday')+'>🕘 지난 미완료 '+odIds.length+'개 → 오늘로</button>'; }
      const emptyMsg=isGroup?'그룹 할일이 없어요 — 아래 ＋ 로 담당을 나눠보세요':'개인 할일이 없어요 — 아래 ＋ 로 추가하세요';
      if(_todoGroup==='cat' && open.length){
        h+=todoGroupedHtml(open, roList);   // 📚 카테고리별 묶음(기본) — 캘린더 날짜 목록과 공용 렌더
      } else {
        h+='<div class="card" style="padding:4px 12px;">'+(open.length?open.map(t=>todoRow(t, roList, true)).join(''):'<div class="empty" style="padding:26px 6px;">'+emptyMsg+'</div>')+'</div>';   // 마감순 보기=수동 정렬 핸들(≡) 표시
      }
      if(done.length){ const _dc=done.slice(0,20); const _dl='오늘 '+done.length+'개'+(done.length>_dc.length?(' · '+_dc.length+' 표시'):'');
        h+='<div class="sech"><span class="l">완료</span><span class="s">'+_dl+'</span></div><div class="card" style="padding:4px 12px;">'+_dc.map(t=>todoRow(t, roList)).join('')+'</div>'; }
      return h;
    }
    // 📚 카테고리별 묶음 렌더 공용(할일 목록·캘린더 날짜 목록) — 색점+이름+개수 헤더 카드, 그룹 순서=카테고리 관리 정의 순(미분류 마지막).
    //  ctxDay=캘린더 완료 기준일(todoRow 4번째 인자로 전달 — 그 날짜로 완료 기록).
    function todoGroupedHtml(list, ro, ctxDay){
      const g={}, order=[];
      list.forEach(t=>{ const c=todoCatOf(t); const k=c?('c_'+c.id):'_none'; if(!g[k]){ g[k]={c:c,list:[]}; order.push(k); } g[k].list.push(t); });
      const catIdx={}; (state.todoCats||[]).forEach((c,i)=>{ catIdx['c_'+c.id]=i; });
      order.sort((a,b)=>(a==='_none'?9e9:(catIdx[a]!==undefined?catIdx[a]:8e8))-(b==='_none'?9e9:(catIdx[b]!==undefined?catIdx[b]:8e8)));
      return order.map(k=>{ const gr=g[k], nm=gr.c?(gr.c.name||''):'미분류', col=gr.c?(gr.c.color||'#8B95A1'):'var(--sub)';
        return '<div class="sech"><span class="l" style="display:flex;align-items:center;gap:7px;"><span class="catdot" style="background:'+escapeHtml(col)+'"></span>'+escapeHtml(nm)+'</span><span class="s">'+gr.list.length+'개</span></div>'+
          '<div class="card" style="padding:4px 12px;">'+gr.list.map(t=>todoRow(t, ro, false, ctxDay)).join('')+'</div>';
      }).join('');
    }
    function todoMoveMonth(d){ state.month=shiftMonth(state.month,d); renderTodoCalendar(); }
    function todoSelDay(ds){ _todoSel=ds; renderTodoCalendar(); }
    function renderTodoCalendar(){ $('content').innerHTML=todoCalendarHtml(); }
    // 할일 캘린더 화면 프로듀서 — App.view.components.todoCalendar
    function todoCalendarHtml(){
      const m=state.month, parts=m.split('-'), y=+parts[0], mo=+parts[1];
      const base=scopedTodos();
      // 일별 점 버킷 — 미완료·완료 모두 **그 할일의 날짜(마감일) 칸**에 표시(완료=같은 색·옅게). 옛날에 등록한 할일을 오늘 완료해도
      // 등록된 날짜 칸에 완료로 남는다(사용자 지침 — '언제 했나'가 아니라 '그 날의 일이었다'가 앵커). 마감일 없는 할일만 완료한 날로 폴백.
      const byDay={}; const _bk=function(ds){ return byDay[ds]=byDay[ds]||{o:[],dn:[]}; };
      base.forEach(t=>{ const col=todoCatColor(t)||'var(--primary)';
        if(!t.done && t.dueDate && t.dueDate.slice(0,7)===m){ const b=_bk(t.dueDate); if(b.o.indexOf(col)<0 && b.o.length<3) b.o.push(col); }
        if(t.done){ const anchor=t.dueDate||todoDoneDay(t); if(anchor && anchor.slice(0,7)===m){ const b=_bk(anchor); if(b.dn.indexOf(col)<0 && b.dn.length<3) b.dn.push(col); } } });
      const first=calFirstOffset(y,mo); const days=new Date(y,mo,0).getDate(); const todayS=todayKst(); const sel=_todoSel||todayS;   // 시작 요일은 설정 공용(calHeadHtml/calFirstOffset)
      let h=todoScopeSeg();
      h+='<div class="monthlbl"><button '+App.view.act('todoMoveMonth',-1)+' aria-label="이전 달">‹</button><b>'+y+'년 '+mo+'월</b><button '+App.view.act('todoMoveMonth',1)+' aria-label="다음 달">›</button></div>';
      h+='<div class="calwrap">'+calHeadHtml()+'<div class="cal-grid">';
      for(let i=0;i<first;i++) h+='<div class="cal-cell dim"></div>';
      for(let d=1;d<=days;d++){ const ds=y+'-'+pad2(mo)+'-'+pad2(d); const wd=new Date(y,mo-1,d).getDay(); const dcls='d'+(wd===0?' sun':(wd===6?' sat':''));
        const b=byDay[ds]; const od=!!(b&&b.o.length&&ds<todayS);   // ⏰ 기한 지난 미완료가 남은 날 — '!' 배지로 따로 표시(탭하면 '오늘로' 버튼)
        const cls='cal-cell'+(ds===todayS?' today':'')+(ds===sel?' sel':'')+(od?' od':'');
        let dot=''; if(b && (b.o.length||b.dn.length)){ const dn=b.dn.slice(0, Math.max(0,4-b.o.length));   // 한 칸 최대 4점(미완료 우선, 완료 점은 남는 자리에)
          dot='<span class="dotrow">'+b.o.map(c=>'<i style="background:'+c+'"></i>').join('')+dn.map(c=>'<i class="dn" style="background:'+c+'"></i>').join('')+'</span>'; }
        h+='<div class="'+cls+'" '+App.view.act('todoSelDay',ds)+'><div class="'+dcls+'">'+d+'</div>'+dot+'</div>';
      }
      h+='</div></div>';
      const ro=todoReadOnly();
      // 📌 날짜 목록 = '그 할일의 날짜(마감일)' 단일 앵커 — 미완료든 완료든 그 날짜 칸에만 표시(위 완료 점과 동일 기준).
      //  옛날 할일을 오늘 완료해도 등록된 날짜에 완료로 남고, 마감일을 옮기면 새 날짜 한 곳에만 보인다(30·31 중복 표시 버그의 최종 해법 — 사용자 지침).
      //  마감일 없는 할일만 완료한 날(todoDoneDay)로 폴백. '언제 완료했나'는 완료 탭(완료한 날 기준)에서 본다.
      const dayT=base.filter(t=> t.dueDate ? (t.dueDate===sel) : (t.done && todoDoneDay(t)===sel)).sort((a,b)=>(a.done?1:0)-(b.done?1:0));
      h+='<div class="sech"><span class="l">'+(+sel.split('-')[1])+'월 '+(+sel.split('-')[2])+'일</span><span class="s">'+dayT.length+'개</span></div>';
      // 🕘 이 날짜의 미완료만 오늘로 — 자동 이월 없이, 미완료가 남은 날짜에서 명시적으로 옮긴다(사용자 지침)
      { const selOpen=dayT.filter(t=>!t.done && t.dueDate===sel);
        if(!ro && sel!==todayS && selOpen.length) h+='<button class="td-carry" '+App.view.act('carryDayToToday',sel)+'>🕘 이 날 미완료 '+selOpen.length+'개 → 오늘로</button>'; }
      // ⬇️ 행에 '이 날짜'를 실어 보냄(todoRow 4번째 인자) → 완료 시 오늘이 아니라 이 날짜로 기록(toggleTodo ctxDay).
      //  📚 목록 탭의 [카테고리|마감순] 토글(_todoGroup)을 따라 카테고리 묶음으로도 표시(공용 todoGroupedHtml).
      if(!dayT.length) h+='<div class="card" style="padding:4px 12px;"><div class="empty" style="padding:22px 6px;">이 날 할일이 없어요</div></div>';
      else if(_todoGroup==='cat') h+=todoGroupedHtml(dayT, ro, sel);
      else h+='<div class="card" style="padding:4px 12px;">'+dayT.map(t=>todoRow(t,ro,false,sel)).join('')+'</div>';
      return h;
    }
    // ===== 📋 할일 템플릿(체크리스트 세트) — 여행 준비물·장보기 등 자주 쓰는 할일 묶음을 저장해 두고 원탭으로 통째로 추가 =====
    //  저장: users/{uid}/todoTpls/{id} = { name, lines:[제목…], createdAt } — 개인 전역(어느 그룹에서든 적용 가능, 쓰기=본인).
    function openTodoTpls(){
      openSheet('할일 템플릿', '<div class="empty" style="padding:30px;">불러오는 중…</div>');
      db.ref('users/'+state.uid+'/todoTpls').once('value').then(function(s){
        if(!($('sheet')&&$('sheet').classList.contains('on'))) return;
        const o=s.val()||{}; const list=Object.keys(o).map(function(k){ return Object.assign({id:k}, o[k]); }).sort(function(a,b){ return (b.createdAt||'').localeCompare(a.createdAt||''); });
        let h='<p class="muted" style="font-size:12.5px;margin:2px 2px 12px;line-height:1.55;">자주 쓰는 할일 묶음을 저장해 두고 <b>적용</b> 한 번으로 지금 목록('+(isPersonalWs()?'내 할일':'그룹 할일')+')에 통째로 추가해요.</p>';
        list.forEach(function(t){ const n=(t.lines||[]).length;
          h+='<div class="card" style="padding:12px 14px;"><div class="row"><b>'+escapeHtml(t.name||'템플릿')+' <span class="pill">'+n+'개</span></b>'+
            '<span style="display:flex;gap:6px;"><button class="chip" '+App.view.act('applyTodoTpl',t.id)+'>적용</button><button class="chip" '+App.view.act('deleteTodoTpl',t.id)+'>삭제</button></span></div>'+
            '<div class="tx-sub" style="margin-top:6px;">'+escapeHtml((t.lines||[]).slice(0,4).join(' · '))+(n>4?' …':'')+'</div></div>';
        });
        if(!list.length) h+='<div class="empty" style="padding:18px;">저장된 템플릿이 없어요</div>';
        h+='<div class="card" style="padding:14px;"><div class="sec-title" style="margin:0 0 8px;">＋ 새 템플릿</div>'+
          '<div class="field"><label>이름</label><input class="input" id="tplName" placeholder="예: 여행 준비물"></div>'+
          '<div class="field"><label>할일 목록 (한 줄에 하나)</label><textarea class="input" id="tplLines" rows="5" placeholder="여권 챙기기&#10;환전하기&#10;로밍 신청"></textarea></div>'+
          '<button class="btn" '+App.view.act('saveTodoTpl')+'>템플릿 저장</button></div>';
        const b=$('sheetBody'); if(b) b.innerHTML=h;
        state._sheetReopen=function(){ openTodoTpls(); };
      });
    }
    function saveTodoTpl(){
      const name=(val('tplName')||'').trim(); const lines=(val('tplLines')||'').split('\n').map(function(s){ return s.trim(); }).filter(Boolean).slice(0,30);
      if(!name||!lines.length){ toast('이름과 할일을 입력하세요', true); return; }
      db.ref('users/'+state.uid+'/todoTpls/'+Date.now()).set({ name:name, lines:lines, createdAt:new Date().toISOString() }).catch(_saveErr);
      toast('템플릿을 저장했어요'); setTimeout(openTodoTpls, 150);
    }
    function deleteTodoTpl(id){ confirmSheet('이 템플릿을 삭제할까요?', function(){ db.ref('users/'+state.uid+'/todoTpls/'+id).remove(); toast('삭제되었습니다'); setTimeout(openTodoTpls,150); }); }
    function applyTodoTpl(id){
      db.ref('users/'+state.uid+'/todoTpls/'+id).once('value').then(function(s){
        const t=s.val(); if(!t||!(t.lines||[]).length){ toast('템플릿이 비어 있어요', true); return; }
        const scope=isPersonalWs()?'personal':'group';
        const today=todayKst(), now=new Date().toISOString(), base=Date.now();
        const upd={};
        t.lines.forEach(function(title,i){ upd['todo_'+(base+i)]={ title:title, note:'', dueDate:today, dueTime:'', scope:scope,
          ownerUid:scope==='personal'?(state.uid||''):'', assignedUid:'', assignedName:'', repeat:'none', repeatDays:[], purposeBookId:'',
          priority:'normal', category:'', catName:'', catColor:'', tags:[], subtasks:[],
          done:false, doneAt:'', doneByUid:'', rewardClaimed:false,
          createdByUid:state.uid||'', createdAt:now, updatedAt:now, sortOrder:base+i }; });
        const ref=scope==='personal'?db.ref('users/'+state.uid+'/todos'):db.ref(wp('todos'));
        ref.update(upd).catch(_saveErr);
        toast('\''+(t.name||'템플릿')+'\' '+t.lines.length+'개를 오늘 할일로 추가했어요');
        closeSheet(); if(state.tab==='todo') renderTodoList();
      });
    }
    // 🕘 특정 날짜의 미완료 할일만 오늘로 이동(캘린더 날짜별 버튼) — carryOverdueToToday와 같은 fan-out update(원자), 그 날짜분만.
    function carryDayToToday(ds){
      const today=todayKst(); if(ds===today) return;
      if(state._todoFriend && state._todoFriend!==state.uid) return;   // 친구 열람(읽기전용)은 이동 불가
      const ids=scopedTodos().filter(t=>!t.done && t.dueDate===ds).map(t=>t.id); if(!ids.length) return;
      const p=ds.split('-');
      confirmSheet((+p[1])+'월 '+(+p[2])+'일 미완료 '+ids.length+'개를 오늘로 옮길까요?', function(){
        const base=isPersonalWs()?db.ref('users/'+state.uid+'/todos'):db.ref(wp('todos'));
        const now=new Date().toISOString(); const upd={};
        ids.forEach(function(x){ upd[x+'/dueDate']=today; upd[x+'/updatedAt']=now; });
        base.update(upd); closeSheet(); toast('오늘로 옮겼어요');
        _todoSel=today; renderTodoCalendar();   // 옮긴 결과가 보이게 오늘 날짜로 이동
      }, { okLabel:'오늘로 옮기기', danger:false });
    }
    // 🌱 완료 잔디 히트맵(최근 15주) — 비반복=완료일(todoDoneDay), 반복=doneLog 날짜키 합산. 열=주(과거→현재), 행=월~일.
    function todoHeatHtml(){
      const today=todayKst();
      const cnt={};
      scopedTodos().forEach(function(t){
        if(t.done){ const d=todoDoneDay(t); if(d) cnt[d]=(cnt[d]||0)+1; }
        const lg=t.doneLog||{}; Object.keys(lg).forEach(function(d){ if(lg[d]) cnt[d]=(cnt[d]||0)+1; });
      });
      const dow=(new Date(today+'T00:00:00').getDay()+6)%7;   // 월=0
      const start=addDays(today, -(dow+14*7));                // 이번 주 포함 15주
      let cells='', tot=0;
      for(let w=0; w<15; w++){ for(let d=0; d<7; d++){ const ds=addDays(start, w*7+d);
        if(ds>today){ cells+='<i class="hm x"></i>'; continue; }
        const n=cnt[ds]||0; tot+=n;
        const lv=n>=4?4:(n>=3?3:(n>=2?2:(n>=1?1:0)));
        cells+='<i class="hm l'+lv+'" title="'+ds+' · '+n+'개"></i>'; } }
      return '<div class="card" style="padding:12px 14px;"><div class="row" style="margin-bottom:8px;"><b>🌱 완료 잔디</b><span class="tx-sub">최근 15주 · '+tot+'개 완료</span></div>'+
        '<div class="hmgrid">'+cells+'</div>'+
        '<div class="tx-sub" style="margin-top:8px;">진할수록 그날 완료가 많아요 — 반복 할일 완료도 오늘부터 매일 쌓여요.</div></div>';
    }
    function renderTodoDone(){ $('content').innerHTML=todoDoneHtml(); }
    // 할일 완료 화면 프로듀서 — App.view.components.todoDone
    function todoDoneHtml(){ const ro=todoReadOnly(); const today=todayKst();
      // 📅 '특정 하루'만 — 선택한 날(KST 완료일)에 완료한 할일만 표시. 날짜는 ‹ › 로 하루씩 이동하거나 날짜 입력으로 직접 고른다.
      const sel=_doneDay||today; const p=sel.split('-');
      const done=scopedTodos().filter(function(t){ return t.done && todoDoneDay(t)===sel; }).sort((a,b)=>(b.doneAt||'').localeCompare(a.doneAt||''));
      let h=todoScopeSeg();
      h+='<div class="monthlbl"><button '+App.view.act('moveDoneDay',-1)+' aria-label="이전 날">‹</button><b>'+(+p[1])+'월 '+(+p[2])+'일'+(sel===today?' · 오늘':'')+'</b><button '+App.view.act('moveDoneDay',1)+' aria-label="다음 날">›</button></div>';
      h+='<div class="donepick"><input type="date" class="input" id="tdDoneDay" value="'+sel+'" '+App.view.chg('onDoneDayChange')+' aria-label="완료 날짜 선택">'+
        (sel!==today?('<button class="chip" '+App.view.act('setDoneDay',today)+'>오늘</button>'):'')+'</div>';
      h+=todoHeatHtml();   // 🌱 완료 잔디(최근 15주 히트맵)
      h+='<div class="sech"><span class="l">완료</span><span class="s">'+done.length+'개</span></div>';
      h+='<div class="card" style="padding:4px 12px;">'+(done.length?done.map(t=>todoRow(t,ro)).join(''):'<div class="empty" style="padding:26px 6px;">이 날 완료한 할일이 없어요</div>')+'</div>';
      return h; }
    // Phase 3: 할일 화면 컴포넌트 등록(레지스트리). render(props)→HTML. 프로듀서는 기존 클로저 헬퍼를 그대로 사용(닫힌 스코프 접근 유지).
    App.view.define('todoRow', { render:function(p){ return todoRow(p&&p.t, p&&p.ro); } });
    App.view.define('todoList', { render:function(){ return todoListHtml(); } });
    App.view.define('todoCalendar', { render:function(){ return todoCalendarHtml(); } });
    App.view.define('todoDone', { render:function(){ return todoDoneHtml(); } });
    // 📅 완료 처리 기준일 — 캘린더 날짜 목록에서 완료하면 '보고 있던 그 날짜'로 완료 기록(사용자 요청).
    //  ① 1차: 행이 직접 실어 보낸 ctxDay(todoRow 4번째 인자 → toggleTodo 2번째 인자) — 시트·재렌더 어디서 그려져도 확실.
    //  ② 2차(폴백): 캘린더 탭에서 고른 날짜(_todoSel). 미래 날짜는 오늘로 클램프(완료 시각이 미래일 수는 없음).
    //  완료 목록·완료 탭·캘린더 완료 점·완료 잔디가 모두 doneAt(=todoDoneDay)을 보므로 그 날짜에 그대로 남는다.
    function todoDoneCtxDay(arg){
      const td=todayKst();
      const d=(typeof arg==='string' && /^\d{4}-\d{2}-\d{2}$/.test(arg)) ? arg
        : ((state.tab==='todocal' && _todoSel) ? _todoSel : '');
      return doneDayFor(d, td);   // 순수 판정(util.js) — 지난 날짜만 채택, 오늘·미래·빈값은 ''(=오늘)
    }
    function toggleTodo(id, ctxDay){ const t=allTodos().find(x=>x.id===id); if(!t) return;
      const _ctx=todoDoneCtxDay(ctxDay), now=_ctx?isoAtNoon(_ctx):new Date().toISOString(), _upAt=new Date().toISOString();   // now=완료 시각(선택 날짜면 그날 정오), _upAt=실제 수정 시각
      const ref=todoDbRef(t);
      const firstReward=!t.rewardClaimed;   // 할일당 은화 1회(멱등)
      if(!t.done && t.repeat && t.repeat!=='none' && t.dueDate){
        let _nd=nextDue(t.dueDate,t.repeat,t.repeatDays); const _t=todayKst(); let _g=0; while(_nd<=_t && _g++<400) _nd=nextDue(_nd,t.repeat,t.repeatDays);   // 밀린 회차 catch-up: 다음 예정을 오늘(KST) 이후로 — 오래 밀려도 한 번 완료로 미래 회차가 됨(즉시 재-지남 방지). 매주 요일 지정(repeatDays)도 반영.
        const upd={ dueDate:_nd, doneByUid:(state.uid||''), lastDoneAt:now, doneCount:(Number(t.doneCount)||0)+1, updatedAt:_upAt };   // 반복 완료 횟수 누적(완료 이력·리포트 반영)
        if(firstReward) upd.rewardClaimed=true;
        ref.update(upd);
        // 🧾 완료 스냅샷(사용자 요청): 반복 원본은 위처럼 다음 회차로 굴리고, '이 회차 완료' 1회성 항목을 따로 남겨
        //    오늘 완료 목록·완료 탭·잔디에 완료된 것처럼 보이게 한다(🔁 표시, rewardClaimed=true라 은화 재지급 없음).
        //    (구 doneLog 날짜키 기록은 스냅샷이 이력 자체가 되므로 중단 — 잔디는 스냅샷 doneAt으로 집계, 기존 doneLog는 하위호환 합산 유지)
        { const _sc=todoScope(t), copyId='todo_'+Date.now();
          const copy={ title:t.title||'', note:t.note||'', dueDate:t.dueDate||_t, dueTime:t.dueTime||'', scope:_sc,
            ownerUid:_sc==='personal'?(t.ownerUid||state.uid||''):'',
            assignedUid:t.assignedUid||'', assignedName:t.assignedName||'',
            repeat:'none', repeatDays:[], repeatSrcId:t.id, purposeBookId:t.purposeBookId||'',
            priority:t.priority||'normal', category:t.category||'', catName:t.catName||'', catColor:t.catColor||'', tags:t.tags||[], subtasks:t.subtasks||[],
            done:true, doneAt:now, doneByUid:state.uid||'', rewardClaimed:true,   // doneAt=완료 기준일(캘린더에서 고른 날짜면 그날) → 그 날짜 완료 목록·잔디에 잡힘
            createdByUid:state.uid||'', createdAt:_upAt, updatedAt:_upAt, sortOrder:Date.now() };
          const base=_sc==='personal'?db.ref('users/'+state.uid+'/todos'):db.ref(wp('todos'));
          base.child(copyId).set(copy).catch(_saveErr);
        }
        const _np=_nd.split('-'); const nxt=(+_np[1])+'월 '+(+_np[2])+'일('+WEEK[new Date(_nd+'T00:00:00').getDay()]+')로 넘겼어요';   // 요일 지정 매주는 같은 주 다음 요일일 수 있어 실제 날짜로 안내
        const _dn=_ctx?((+_ctx.slice(5,7))+'월 '+(+_ctx.slice(8,10))+'일 완료 · '):'';   // 선택 날짜로 완료한 경우 명시
        if(firstReward && typeof grantTodoCoins==='function'){ grantTodoCoins(function(paid){ toast(paid>0?(_dn+'+'+paid+' 은화 · '+nxt):(_dn+'완료! '+nxt)); }); } else toast(_dn+'완료! '+nxt);
        maybeSuggestTxFromTodo(t);
      } else {
        const done=!t.done; const upd={ done:done, doneAt:done?now:'', doneByUid:done?(state.uid||''):'', updatedAt:_upAt };
        const _dn=(done&&_ctx)?((+_ctx.slice(5,7))+'월 '+(+_ctx.slice(8,10))+'일로 완료했어요'):'';
        if(done && firstReward){ upd.rewardClaimed=true; ref.update(upd); if(typeof grantTodoCoins==='function'){ grantTodoCoins(function(paid){ toast(_dn?(_dn+(paid>0?(' +'+paid+' 은화'):'')):(paid>0?('완료! +'+paid+' 은화 🐾'):'완료! 🐾')); }); } else toast(_dn||'완료! 🐾'); }
        else { ref.update(upd); if(done) toast(_dn||'다시 완료했어요'); }   // 이 분기의 done=재완료(이미 보상받음) → 첫 완료와 구분(허위 보상 문구 방지)
        if(done) maybeSuggestTxFromTodo(t);
      }
    }
    // 💸 구매성 할일 완료 → 지출 기록 제안 — 제목에 구매 키워드가 있거나 목적별 가계부에 연결된 할일만, 할일당 1회(localStorage).
    //    수락하면 거래 입력 시트가 열리고 설명=할일 제목·목적별 연결이 프리필된다(완료 토스트를 먼저 보여주고 잠깐 뒤 제안).
    const TODO_BUY_RE=/(사기|사오|구매|구입|결제|쇼핑|주문|예약|장보|납부|충전|택배|선물)/;
    function maybeSuggestTxFromTodo(t){
      try{
        if(!(TODO_BUY_RE.test(t.title||'') || t.purposeBookId)) return;
        const key='todotx:'+(state.uid||'');
        let seen={}; try{ seen=JSON.parse(localStorage.getItem(key)||'{}')||{}; }catch(e){}
        if(seen[t.id]) return; seen[t.id]=1; try{ localStorage.setItem(key, JSON.stringify(seen)); }catch(e){}
        const title=t.title||'', pb=t.purposeBookId||'';
        setTimeout(function(){
          confirmSheet('\''+title+'\' 완료! 관련 지출도 기록할까요?', function(){
            openTxSheet(null, null, null, pb||null);
            setTimeout(function(){ const d=$('sDesc'); if(d && !d.value) d.value=title; }, 60);
          }, { okLabel:'지출 기록', danger:false, title:'💸 지출 기록' });
        }, 400);
      }catch(e){}
    }
    // 📅 미완료 할일을 다른 날짜로 옮기기(리스케줄) — 마감일 배지 탭으로 진입. dueDate만 갱신(노드 경로·키 불변).
    function openTodoReschedule(id){ const t=allTodos().find(x=>x.id===id); if(!t) return;
      const today=todayKst();   // 오늘/내일 칩·기본값 KST 기준(리스트 마감 판정과 동일)
      const quick=[['오늘',0],['내일',1],['모레',2],['다음 주',7]];
      let h='';
      if(t.dueDate) h+='<p class="muted" style="font-size:12.5px;margin:2px 2px 12px;">현재 마감일 <b>'+t.dueDate+'</b></p>';
      else h+='<p class="muted" style="font-size:12.5px;margin:2px 2px 12px;">마감일이 없어요 — 날짜를 지정해 보세요.</p>';
      h+='<div class="chip-row" style="margin-bottom:14px;">'+quick.map(function(q){ const ds=addDays(today,q[1]); return '<button class="chip" '+App.view.act('rescheduleTodo',id,ds)+'>'+q[0]+'</button>'; }).join('')+'</div>';
      h+='<div class="field"><label>날짜 직접 선택</label><input type="date" class="input" id="tdMoveDate" value="'+(t.dueDate||today)+'"></div>';
      h+='<button class="btn" onclick="rescheduleTodo(\''+id+'\', val(\'tdMoveDate\'))">이 날짜로 옮기기</button>';
      openSheet('날짜 옮기기', h);
    }
    function rescheduleTodo(id, ds){ if(!ds) return; const t=allTodos().find(x=>x.id===id); if(!t) return;
      const now=new Date().toISOString();
      todoDbRef(t).update({ dueDate:ds, updatedAt:now });   // 반복(repeat)은 유지 — 수동 이동은 회차 넘김과 별개
      const diff=dueDiffDays(ds, todayKst());
      const label=diff===0?'오늘':diff===1?'내일':diff===2?'모레':ds;
      closeSheet(); toast('📅 '+label+'로 옮겼어요');
    }
    // 🕘 지난(마감 지남) 미완료 할일을 전부 오늘로 — 현재 스코프의 한 base에 다중경로 fan-out update(원자).
    function carryOverdueToToday(){ const today=todayKst(); const ids=overdueTodoIds(scopedTodos(), today); if(!ids.length) return;
      if(state._todoFriend && state._todoFriend!==state.uid) return;   // 친구 열람(읽기전용)은 일괄 이동 불가
      confirmSheet('지난 미완료 '+ids.length+'개를 오늘로 옮길까요?', function(){
        const base=isPersonalWs()?db.ref('users/'+state.uid+'/todos'):db.ref(wp('todos'));
        const now=new Date().toISOString(); const upd={};
        ids.forEach(function(x){ upd[x+'/dueDate']=today; upd[x+'/updatedAt']=now; });
        base.update(upd); closeSheet(); toast('지난 할일 '+ids.length+'개를 오늘로 옮겼어요');
      }, { okLabel:'오늘로 옮기기', danger:false });
    }
    // 📅 매주 반복 요일 선택(여러 개 가능) — _tdWd=선택된 요일(0=일~6=토). 미선택이면 마감일 요일 기준 +7일(종전 동작).
    let _tdWd=[];
    function tdWdChipsHtml(){ return [1,2,3,4,5,6,0].map(function(i){ return '<button type="button" class="chip'+(_tdWd.indexOf(i)>=0?' on':'')+'" '+App.view.act('toggleTdWd',i)+' aria-label="'+WEEK[i]+'요일 반복">'+WEEK[i]+'</button>'; }).join(''); }
    function toggleTdWd(i){ i=Number(i); const j=_tdWd.indexOf(i); if(j>=0) _tdWd.splice(j,1); else _tdWd.push(i);
      const w=$('tdWdChips'); if(w) w.innerHTML=tdWdChipsHtml(); }
    function onTdRepeatChange(){ const w=$('tdWdWrap'); if(w) w.style.display=(val('tdRepeat')==='weekly')?'':'none'; }
    function openTodoEdit(id, presetPb){
      if(!id) state._todoFriend=null;   // 새 할일은 항상 내 목록으로(친구 읽기전용 뷰였어도)
      const t=id?allTodos().find(x=>x.id===id):null;
      _tdWd=(t&&Array.isArray(t.repeatDays))?t.repeatDays.map(Number).filter(function(n){ return n>=0&&n<=6; }):[];
      const defDue=t?(t.dueDate||''):(_todoSel||todayKst());   // 신규 할일 마감일 기본값 = 달력에서 선택한 날(없으면 오늘=KST). 마감 판정과 같은 경계.
      // 스코프: 편집=기존 할일 값, 신규=현재 세그먼트. 개인은 담당자 없음(소유자=나), 그룹은 담당배정.
      const scope=t?todoScope(t):(isPersonalWs()?'personal':'group');
      const asel=t?(t.assignedUid||'공동'):(state.uid||'공동');
      const rep=t?(t.repeat||'none'):'none';
      const pbSel=t?(t.purposeBookId||''):(presetPb||'');
      const prio=t?(t.priority||'normal'):'normal';   // 우선순위: high/normal/low
      const tdtags=t?((t.tags||[]).join(', ')):'';     // 태그(쉼표 구분 표시)
      const subText=(t&&Array.isArray(t.subtasks))?t.subtasks.map(function(s){ return s.text||''; }).join('\n'):'';   // 하위작업(한 줄에 하나)
      const pbs=(state.purposeBooks||[]).filter(p=>(p.status||'active')!=='archived');
      let h='<input type="hidden" id="tdScope" value="'+scope+'">';
      h+='<div class="field"><label>할 일</label><input class="input" id="tdTitle" value="'+escapeHtml(t?(t.title||''):'')+'" placeholder="예: 장보기, 항공권 예약"></div>';
      if(scope==='group') h+='<div class="field"><label>담당자</label><select class="input" id="tdAssign">'+ownerOptions(asel, t?(t.assignedName||''):'')+'</select></div>';
      h+='<div class="form-2"><div class="field"><label>마감일</label><input type="date" class="input" id="tdDue" value="'+defDue+'"></div>'+
        '<div class="field"><label>마감 시간 (선택)</label><input type="time" class="input" id="tdTime" value="'+escapeHtml(t&&t.dueTime?t.dueTime:'')+'"></div></div>';
      var repOpts=[['none','반복 없음'],['weekly','매주'],['monthly','매월']]; if(rep==='daily') repOpts.splice(1,0,['daily','매일(기존)']);   // 매일은 신규 제외(습관=내 미션), 레거시 값은 보존
      h+='<div class="form-2"><div class="field"><label>반복</label><select class="input" id="tdRepeat" '+App.view.chg('onTdRepeatChange')+'>'+repOpts.map(function(o){ return '<option value="'+o[0]+'"'+(rep===o[0]?' selected':'')+'>'+o[1]+'</option>'; }).join('')+'</select></div>'+
        '<div class="field"><label>가계부 연결</label><select class="input" id="tdPb"><option value="">연결 안 함</option>'+pbs.map(function(p){ return '<option value="'+p.id+'"'+(pbSel===p.id?' selected':'')+'>'+(p.icon||'📒')+' '+escapeHtml(p.name)+'</option>'; }).join('')+'</select></div></div>';
      h+='<div class="field" id="tdWdWrap" style="'+(rep==='weekly'?'':'display:none;')+'"><label>반복 요일 (여러 개 선택 가능)</label><div class="chip-row" id="tdWdChips" style="margin:2px 0 0;">'+tdWdChipsHtml()+'</div>'+
        '<p class="muted" style="font-size:11.5px;margin:6px 2px 0;">선택하지 않으면 마감일 요일에 매주 반복돼요.</p></div>';
      h+='<p class="muted" style="font-size:11.5px;margin:-4px 2px 10px;">매일 하는 습관은 <b>미션 탭 · 내 미션</b>에서 스트릭으로 관리해요.</p>';
      h+='<div class="form-2"><div class="field"><label>우선순위</label><select class="input" id="tdPrio">'+[['high','🔴 높음'],['normal','보통'],['low','🔵 낮음']].map(function(o){ return '<option value="'+o[0]+'"'+(prio===o[0]?' selected':'')+'>'+o[1]+'</option>'; }).join('')+'</select></div>'+
        '<div class="field"><label>태그 (선택)</label><input class="input" id="tdTags" value="'+escapeHtml(tdtags)+'" placeholder="쉼표로 구분: 집안일, 급함"></div></div>';
      _tdCat=t?(todoCat(t.category)?t.category:''):'';   // 편집=기존 값, 신규=없음. 알 수 없는(삭제된) id는 없음 취급.
      h+='<div class="field"><label>카테고리 (선택 — 캘린더·목록에 색으로 구분)</label><div class="chip-row" id="tdCatChips" style="margin:2px 0 0;">'+todoCatChipsHtml()+'</div>'+
        '<div id="tdCatNew" class="tdcat-new" hidden></div></div>';
      h+='<div class="field"><label>메모 (선택)</label><input class="input" id="tdNote" value="'+escapeHtml(t?(t.note||''):'')+'" placeholder="메모"></div>';
      h+='<div class="field"><label>하위 작업 (선택, 한 줄에 하나)</label><textarea class="input" id="tdSub" rows="3" placeholder="예: 우유 사기">'+escapeHtml(subText)+'</textarea></div>';
      h+='<button class="btn" '+App.view.act('saveTodo', id?id:null)+'>'+(t?'수정':'추가')+'</button>';
      if(t) h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deleteTodo',id)+'>삭제</button>';
      openSheet(t?'할일 수정':'할일 추가', h);
    }
    function saveTodo(id){
      const title=val('tdTitle').trim(); if(!title){ toast('할 일을 입력하세요', true); return; }
      const _rep=($('tdRepeat')?val('tdRepeat'):'none')||'none';
      if(_rep!=='none' && !(val('tdDue')||'')){ toast('반복 할일은 마감일이 필요해요', true); return; }   // 마감일 없으면 반복이 안 돌던 버그 방지 — 반복 시 마감일 강제
      const t=id?allTodos().find(x=>x.id===id):null; const now=new Date().toISOString();
      const scope=($('tdScope')?val('tdScope'):(t?todoScope(t):'group'))==='personal'?'personal':'group';
      const asel=$('tdAssign')?val('tdAssign'):'공동'; const mem=(state.wsMeta&&state.wsMeta.members)||{};
      let assignedUid='', assignedName='';
      if(scope==='group' && asel!=='공동'){ if(mem[asel]){ assignedUid=asel; assignedName=mem[asel].name||''; } else if(asel===state.uid){ assignedUid=state.uid; assignedName=state.userName||''; } else { assignedName=asel; } }
      // 개인 할일 소유자: 기존 값 유지, 신규는 나. 그룹은 소유자 개념 없음(담당자로 표현).
      const ownerUid=scope==='personal'?(t?(t.ownerUid||t.createdByUid||state.uid||''):(state.uid||'')):'';
      const key=id||('todo_'+Date.now());
      const _prio=(function(){ const p=$('tdPrio')?val('tdPrio'):'normal'; return (p==='high'||p==='low')?p:'normal'; })();
      const _tags=(function(){ const raw=$('tdTags')?val('tdTags'):''; return raw.split(',').map(function(s){ return s.trim(); }).filter(Boolean).slice(0,8); })();   // 쉼표 구분·최대 8개
      const _subs=(function(){ const raw=$('tdSub')?val('tdSub'):''; const prev=(t&&Array.isArray(t.subtasks))?t.subtasks:[];   // 줄 단위 파싱, 기존 done 상태 보존
        const used=new Array(prev.length).fill(false);
        const lines=raw.split('\n').map(function(s){ return s.trim(); }).filter(Boolean).slice(0,20);
        const idxs=new Array(lines.length).fill(-1);
        // ① 텍스트 일치를 '먼저 전부' 소비(중복은 앞에서부터 1:1) — 줄 삽입/재정렬돼도 done이 텍스트를 따라감.
        lines.forEach(function(txt,i){ const j=prev.findIndex(function(x,k){ return !used[k] && x && x.text===txt; }); if(j>=0){ used[j]=true; idxs[i]=j; } });
        // ② 남은 라인만 같은 '위치' 폴백(문구 수정 시 완료상태 유지) — ①에서 매칭된 항목은 뺏기지 않아 done 오귀속 방지.
        lines.forEach(function(txt,i){ if(idxs[i]<0 && prev[i] && !used[i]){ used[i]=true; idxs[i]=i; } });
        return lines.map(function(txt,i){ return { text:txt, done: idxs[i]>=0 ? !!prev[idxs[i]].done : false }; });
      })();
      // 카테고리 + 이름·색 스냅샷(친구 열람·카테고리 삭제 후에도 색이 남게 — todoCatOf 폴백)
      const _catObj=todoCat(_tdCat), _catSel=_catObj?_tdCat:'';
      const _catSnap={ name:_catObj?(_catObj.name||''):'', color:_catObj?(_catObj.color||''):'' };
      // 📅 매주 요일 지정: 선택 요일 저장 + 마감일이 선택 요일이 아니면 가장 가까운 선택 요일로 스냅(첫 회차부터 요일 일치)
      const _repDays=(_rep==='weekly')?_tdWd.slice().sort(function(a,b){ return a-b; }):[];
      let _due=val('tdDue')||'';
      if(_rep==='weekly' && _repDays.length && _due){ let g=0; while(_repDays.indexOf(new Date(_due+'T00:00:00').getDay())<0 && g++<7) _due=addDays(_due,1); }
      const data={ title:title, note:val('tdNote').trim(), dueDate:_due,
        dueTime:_due?(($('tdTime')?val('tdTime'):'')||''):'',   // ⏰ 마감 시간(선택, HH:MM) — 마감일 없으면 비움
        scope:scope, ownerUid:ownerUid,
        assignedUid:assignedUid, assignedName:assignedName,
        repeat:($('tdRepeat')?val('tdRepeat'):'none')||'none', repeatDays:_repDays, purposeBookId:($('tdPb')?val('tdPb'):'')||'',
        priority:_prio, category:_catSel, catName:_catSnap.name, catColor:_catSnap.color, tags:_tags, subtasks:_subs,
        createdByUid:t?(t.createdByUid||state.uid||''):(state.uid||''), createdAt:t?(t.createdAt||now):now, updatedAt:now,
        sortOrder:t?(t.sortOrder!=null?t.sortOrder:Date.now()):Date.now() };
      const ref=scope==='personal'?db.ref('users/'+state.uid+'/todos/'+key):db.ref(wp('todos/'+key));
      if(t){ ref.update(data).catch(_saveErr); }   // ✏️ 편집=병합(.update): 완료상태(done/doneAt/doneByUid/rewardClaimed·lastDoneAt)를 건드리지 않아 다른 멤버의 동시 완료가 유실되지 않음
      else { data.done=false; data.doneAt=''; data.doneByUid=''; data.rewardClaimed=false; ref.set(data).catch(_saveErr); }   // 신규=완료필드 초기화 포함 set
      toast(t?'수정되었습니다':'추가되었습니다'); closeSheet();
    }
    function deleteTodo(id){ const t=allTodos().find(x=>x.id===id); if(!t) return; confirmSheet('이 할일을 삭제할까요?', ()=>{ todoDbRef(t).remove(); toast('삭제되었습니다'); closeSheet(); }); }
    // 목적별 가계부(여행 등) 상세에 붙이는 연결된 할일 요약 카드
    function pbTodoSummaryHtml(pbId){ const list=allTodos().filter(t=>t.purposeBookId===pbId); if(!list.length && true){ /* 없으면 추가 버튼만 */ }
      const doneN=list.filter(t=>t.done).length;
      let h='<div class="sech"><span class="l">할일</span><span class="s">'+(list.length?(doneN+' / '+list.length+' 완료'):'')+'</span></div>';
      h+='<div class="card" style="padding:4px 12px;">'+(list.length?list.slice().sort((a,b)=>(a.done?1:0)-(b.done?1:0)).map(todoRow).join(''):'<div class="empty" style="padding:18px 6px;">연결된 할일이 없어요</div>')+'</div>';
      h+='<button class="btn ghost" style="margin-top:8px;" '+App.view.act('openTodoEdit',null,pbId)+'>＋ 이 여행에 할일 추가</button>';
      return h; }
    // 완료 리포트(할일 모드 더보기) — 전체 완료율 + 스코프별 + 멤버별 완료 기여
    function openTodoReport(){
      // 스코프 인지: 개인 프로필=내 개인 할일(myTodos·user-global), 그룹=그룹 할일(ws). 개인 프로필의 ws 노드는 migratePersonalTodos로 비워져 있음.
      const all=(isPersonalWs()?(state.myTodos||[]):(state.todos||[])); const total=all.length, doneN=all.filter(t=>t.done).length; const rate=total?Math.round(doneN/total*100):0;
      const p=all.filter(t=>todoScope(t)==='personal'), g=all.filter(t=>todoScope(t)==='group');
      const mem=(state.wsMeta&&state.wsMeta.members)||{};
      let h='<div class="card" style="padding:16px;text-align:center;">'+
        '<div style="font-size:30px;font-weight:900;color:var(--primary);line-height:1;">'+rate+'%</div>'+
        '<div class="muted" style="font-size:12.5px;margin-top:5px;">완료 '+doneN+' / 전체 '+total+'</div>'+
        '<div style="height:8px;border-radius:6px;background:var(--soft);margin-top:12px;overflow:hidden;"><div style="height:100%;width:'+rate+'%;background:var(--primary);"></div></div></div>';
      h+='<div class="sech"><span class="l">구성</span></div><div class="card" style="padding:4px 12px;">'+
        '<div class="tdrow"><span class="tdtitle">개인</span>'+todoDoneChip(p)+'</div>'+
        (isPersonalWs()?'':'<div class="tdrow"><span class="tdtitle">그룹</span>'+todoDoneChip(g)+'</div>')+'</div>';   // 개인 프로필엔 그룹 행(0/0) 숨김
      const byMem={}; all.forEach(t=>{ if(t.done && t.doneByUid) byMem[t.doneByUid]=(byMem[t.doneByUid]||0)+1;
        else if((Number(t.doneCount)||0)>0 && t.doneByUid) byMem[t.doneByUid]=(byMem[t.doneByUid]||0)+(Number(t.doneCount)||0); });   // 반복 할일 완료도 집계(이전엔 done만 세어 반복은 리포트에 안 잡힘)
      const uids=Object.keys(byMem).sort((a,b)=>byMem[b]-byMem[a]);
      if(uids.length){ h+='<div class="sech"><span class="l">완료 기여</span></div><div class="card" style="padding:4px 12px;">'+
        uids.map(function(u){ const nm=(u===state.uid)?(state.userName||'나'):((mem[u]&&mem[u].name)||'멤버'); return '<div class="tdrow"><span class="tdwho">'+avatarHtml(u,nm,22)+'</span><span class="tdtitle">'+escapeHtml(nm)+'</span><span class="tdue">'+byMem[u]+'개</span></div>'; }).join('')+'</div>'; }
      openSheet('완료 리포트', h);
    }
    function todoDoneChip(list){ return '<span class="tdue">'+list.filter(t=>t.done).length+' / '+list.length+'</span>'; }
    // 반복 할일 관리(할일 모드 더보기)
    function openRepeatTodos(){
      const list=(isPersonalWs()?(state.myTodos||[]):(state.todos||[])).filter(t=>t.repeat && t.repeat!=='none').sort((a,b)=>(a.dueDate||'9999-99').localeCompare(b.dueDate||'9999-99'));   // 개인 프로필=내 개인 할일, 그룹=그룹 할일
      let h='<p class="muted" style="margin:2px 2px 12px;line-height:1.5;">매주·매월 반복 예정 할일이에요. 완료하면 다음 회차로 넘어가요. 매일 하는 습관은 <b>미션 탭 · 내 미션</b>에서 관리해요.</p>';
      h+='<div class="card" style="padding:4px 12px;">'+(list.length?list.map(function(t){ return todoRow(t,false); }).join(''):'<div class="empty" style="padding:22px 6px;">반복 할일이 없어요</div>')+'</div>';
      openSheet('반복 할일', h);
    }
    // 리포트 카테고리 범례 값 표시 토글(% ↔ 금액). 전체 재렌더 없이 DOM 클래스만 바꿔 즉시 반영 + state로 유지.
    function _saveErr(){ toast('저장 실패 — 네트워크·권한을 확인해 다시 시도하세요', true); }   // 낙관적 쓰기(오프라인 유지) + 서버 거부(규칙/검증) 시에만 뜸
    function setRepVal(amt){ state._repShowAmt=!!amt;
      document.querySelectorAll('.legend').forEach(el=>el.classList.toggle('amt', !!amt));
      document.querySelectorAll('.repvalseg').forEach(seg=>{ const b=seg.querySelectorAll('button'); if(b[0])b[0].classList.toggle('on', !amt); if(b[1])b[1].classList.toggle('on', !!amt); });
    }
    // 리포트 카테고리 내역 시트 — 범례 항목 탭 시 그 달·그 카테고리의 실지출 거래 목록. etc=1이면 도넛 '기타' 묶음(상위 5개 밖 전체) — 렌더와 같은 기준으로 재계산해 목록을 맞춘다.
    // ===== 💳 카드 내역(리포트 · 월 이동) =====
    // 📅 그 달의 기준일 — 이번 달이면 오늘, 지난/다음 달이면 그 달 15일(예산 기준일 budgetRef와 같은 관례).
    //   카드 실적 기간(cardPeriod)이 '매월 N일 시작' 커스텀일 수 있어 기준일을 넘겨 그 달의 기간을 잡는다.
    function monthRefDate(m){
      const cur=(typeof todayStr==='function'?todayStr():'').slice(0,7);
      if(m===cur) return new Date();
      const p=String(m||'').split('-'); return new Date(+p[0]||1970, (+p[1]||1)-1, 15);
    }
    // 카드(신용·체크) 결제수단 — 카드 설정(creditCards)이 없어도 계좌 유형만으로 잡는다(실적 목표만 없을 뿐 내역은 봐야 하므로)
    function cardAccounts(){ return state.accounts.filter(a=>CARD_TYPES.includes(a.type) && canSee(a)); }
    // 그 달(달력 월) 그 카드로 결제한 거래 — 리포트 월 네비와 같은 기준. 실적 '기간'은 별도로 카드별 표기.
    function cardMonthTx(cardId, m){
      return monthTx(m).filter(t=>t.from===cardId && (t.type==='expense'||t.type==='prepaid_charge'))
        .sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    }
    // 실적 기간(cardPeriod) 안의 그 카드 결제 거래 — 커스텀 시작일(N일~다음달 N-1일) 카드용
    function cardPeriodTx(cardId, per){
      return state.transactions.filter(t=>{
        if(t.from!==cardId || !(t.type==='expense'||t.type==='prepaid_charge')) return false;
        const d=parseDate(t.date); return d>=per.start && d<=per.end;
      }).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    }
    // 카드 내역 시트 — 시트 안에서 ‹ › 로 이동. [달력 월 | 실적 기간] 토글(mode) — 실적 기간 모드는 커스텀 실적 기간(예: 15일~다음달 14일) 단위로 내역·합계를 본다.
    function openCardTxSheet(cardId, m, mode){
      m=m||state.month;
      const acct=getAcct(cardId); if(!acct) return;
      const card=getCard(cardId);
      const byPeriod = mode==='period' && !!card;   // 카드 설정이 없으면 실적 기간 개념이 없어 달력 월만
      const per = card ? cardPeriod(card, monthRefDate(m)) : null;   // ‹ ›로 m을 옮기면 그 달 기준일의 실적 기간으로 함께 이동
      const rows = byPeriod ? cardPeriodTx(cardId, per) : cardMonthTx(cardId, m);
      const used=rows.reduce((s,t)=>s+(Number(t.amount)||0),0);
      const p=m.split('-');
      const fmtMD=d=>(d.getMonth()+1)+'.'+d.getDate();
      const title = byPeriod ? (per.start.getFullYear()===per.end.getFullYear()? per.start.getFullYear()+'년 '+fmtMD(per.start)+' ~ '+fmtMD(per.end) : ymd(per.start)+' ~ '+ymd(per.end)) : p[0]+'년 '+(+p[1])+'월';
      let h='<div class="monthlbl" style="padding-top:0;"><button '+App.view.act('openCardTxSheet',cardId,shiftMonth(m,-1),mode||'month')+' aria-label="이전">‹</button><b style="font-size:'+(byPeriod?'15px':'inherit')+'">'+title+'</b><button '+App.view.act('openCardTxSheet',cardId,shiftMonth(m,1),mode||'month')+' aria-label="다음">›</button></div>';
      if(card) h+='<div style="display:flex;justify-content:center;margin:0 0 10px;"><span class="repvalseg"><button class="'+(byPeriod?'':'on')+'" '+App.view.act('openCardTxSheet',cardId,m,'month')+' aria-label="달력 월 기준으로 보기">달력 월</button><button class="'+(byPeriod?'on':'')+'" '+App.view.act('openCardTxSheet',cardId,m,'period')+' aria-label="실적 기간 기준으로 보기">실적 기간</button></span></div>';
      h+='<div class="card" style="margin-bottom:12px;"><div class="row"><span class="muted">'+(byPeriod?'이 기간 결제':'이 달 결제')+'</span><b>'+won(used)+'</b></div>'+
        '<div class="row" style="margin-top:4px;"><span class="muted">건수</span><b>'+rows.length+'건</b></div>';
      { const sp=personSplit(rows);   // 👥 누가 얼마나 썼는지(소비 대상별 분담)
        if(sp.length) h+='<div style="margin-top:10px;border-top:1px solid var(--line);padding-top:8px;">'+sp.map(x=>'<div class="row" style="font-size:13px;padding:2px 0;"><span class="muted">'+escapeHtml(x.label)+'</span><b>'+won(x.amt)+'</b></div>').join('')+'</div>'; }
      if(card){
        const pf=cardPerformance(card, monthRefDate(m)), col=pf.pct>=100?'var(--income)':'var(--primary)';
        h+='<div style="margin-top:10px;border-top:1px solid var(--line);padding-top:10px;">'+
          '<div class="row" style="font-size:13px;"><span class="muted">실적</span><span style="color:'+col+';font-weight:800;">'+(pf.target?pf.pct+'%':'목표 미설정')+'</span></div>'+
          (pf.target?('<div class="bar"><i style="width:'+Math.min(pf.pct,100)+'%;background:'+col+'"></i></div>'+
            '<div class="tx-sub" style="margin-top:6px;">'+won(pf.sum)+' / '+won(pf.target)+(pf.remain>0?' · '+won(pf.remain)+' 남음':' · 달성 ✅')+'</div>'):'')+
          '<div class="tx-sub" style="margin-top:'+(pf.target?'2px':'6px')+';">실적 기간 '+ymd(pf.start)+' ~ '+ymd(pf.end)+(pf.excluded.length?(' · 제외 '+pf.excluded.length+'건'):'')+'</div></div>';
      }
      h+='</div>';
      h+='<div class="sech"><span class="l">결제 내역</span><span style="display:flex;align-items:center;gap:8px;">'+(rows.length?txListSegHtml():'')+'<span class="s">'+(byPeriod?'실적 기간':((+p[1])+'월'))+'</span></span></div>';
      h+=txListHtml(rows, (byPeriod?'이 기간':'이 달')+' 이 카드로 결제한 내역이 없어요');
      openSheet((card&&card.cardName)||acct.name||'카드 내역', h);
      state._sheetReopen=()=>openCardTxSheet(cardId,m,mode);   // ↩️ 거래 수정 시트 닫으면 이 카드 내역으로 복귀
    }
    // 🏦 리포트 카테고리 집계(도넛·범례·'기타' 묶음 공용) — 실지출 카테고리 합에 대출 원금 상환(실지출 통계 제외 거래)을 얹어
    // '대출·이자' 한 항목으로 병합해 보여준다. 총지출 카드·예산·인사이트는 종전대로 이자만(실지출) — 카테고리 그림에서만 합산.
    const LOAN_CAT_MERGED='대출·이자';
    function repCatSums(m){
      const list=monthTx(m);
      const cd={}; list.filter(t=>isActual(t)&&t.category).forEach(t=>{ cd[t.category]=(cd[t.category]||0)+(Number(t.amount)||0); });
      const loanPrin=list.filter(t=>t.type==='expense'&&t.category==='대출상환'&&!isActual(t)).reduce((s,t)=>s+(Number(t.amount)||0),0);
      if((cd['대출이자']||0)+(cd['대출상환']||0)+loanPrin>0){
        cd[LOAN_CAT_MERGED]=(cd['대출이자']||0)+(cd['대출상환']||0)+loanPrin;
        delete cd['대출이자']; delete cd['대출상환'];
      }
      return { cd, loanPrin };
    }
    function loanRepRows(m){ return monthTx(m).filter(t=>t.type==='expense'&&(t.category==='대출이자'||t.category==='대출상환')); }
    function openRepCatTx(m, name, etc){
      const list=monthTx(m).filter(t=>isActual(t)&&t.category);
      let rows, title=name;
      if(etc){
        const cd=repCatSums(m).cd;   // 도넛과 동일 집계(대출 병합 포함)로 '기타' 경계를 맞춤
        const cats=Object.keys(cd).sort((a,b)=>cd[b]-cd[a]);
        const etcSet=new Set(cats.length>6?cats.slice(5):[]);   // 도넛과 동일: 카테고리 7개↑일 때만 상위 5개 밖을 '기타'로 묶음
        rows=list.filter(t=>etcSet.has(t.category));
        if(etcSet.has(LOAN_CAT_MERGED)) rows=rows.concat(loanRepRows(m));
        title='기타 (묶음)';
      } else if(name===LOAN_CAT_MERGED){ rows=loanRepRows(m); }
      else rows=list.filter(t=>t.category===name);
      rows=rows.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
      const tot=rows.reduce((s,t)=>s+(Number(t.amount)||0),0);
      let sub=(+m.split('-')[1])+'월 · '+rows.length+'건'+(etc?' · 상위 5개 밖 카테고리 묶음':'');
      if(name===LOAN_CAT_MERGED && !etc){
        const it=rows.filter(t=>t.category==='대출이자').reduce((s,t)=>s+(Number(t.amount)||0),0);
        sub+=' · 이자 '+fmtComma(it)+' + 원금 '+fmtComma(tot-it);
      }
      let h='<div class="row" style="margin-bottom:14px;"><div class="muted">'+sub+'</div><div class="red" style="font-weight:700;">-'+fmtComma(tot)+'</div></div>';
      h+='<div class="card" style="padding:6px 10px;">'+(rows.length?rows.map(txRowHtml).join(''):'<div class="empty">이 달 해당 카테고리 지출이 없습니다</div>')+'</div>';
      openSheet((etc?'':(name===LOAN_CAT_MERGED?'🏦':catIcon(name))+' ')+title, h);   // 시트 제목은 textContent 삽입이라 escape 불필요
      state._sheetReopen=()=>openRepCatTx(m,name,etc);   // ↩️ 거래 수정 시트 닫으면 이 드릴다운으로 복귀
    }
    // 👤 소비 대상 정규화 키 — personKey는 userUid(있으면)·아니면 이름이라, 같은 사람이 uid 거래와 이름만 저장된 거래(정기 생성분 등)로
    //    두 막대로 갈라지던 버그 방지: 이름이 멤버 이름과 일치하면 그 멤버 uid로 합친다(멤버 아닌 레거시 이름은 그대로).
    function repPersonKey(t){
      const k=personKey(t);
      if(k==='공동') return k;
      const mem=(state.wsMeta&&state.wsMeta.members)||{};
      if(mem[k]) return k;   // 이미 멤버 uid
      for(const u in mem){ if((mem[u].name||'')===k) return u; }   // 이름 → 그 이름의 멤버 uid
      return k;
    }
    // 💳 거래 묶음의 소비 대상별(공동·멤버) 분담 합계 — 카드 내역·리포트 카드별에서 '공동 얼마 · 현경 얼마' 표시용(금액순)
    function personSplit(rows){
      const o={}; rows.forEach(t=>{ const k=repPersonKey(t); o[k]=(o[k]||0)+(Number(t.amount)||0); });
      const mem=(state.wsMeta&&state.wsMeta.members)||{};
      return Object.keys(o).sort((a,b)=>o[b]-o[a]).map(k=>({ k, label:(k==='공동')?'🤝 공동':((mem[k]&&mem[k].name)||k), amt:o[k] }));
    }
    // 📚 내역 시트 거래 목록 공용 — [카테고리 | 시간순] 토글. 카테고리 모드(기본)는 카테고리별 카드로 묶어 소계·건수를 보여주고(그룹=금액순, 그룹 안=최신순),
    //    시간순 모드는 기존 한 카드 목록. 토글 시 현재 시트를 다시 그린다(_sheetReopen 재사용 — 내역 시트들이 이미 등록).
    let _txListMode='cat';
    function setTxListMode(mode){ _txListMode=mode; if(state._sheetReopen) state._sheetReopen(); }
    function txListSegHtml(){
      return '<span class="repvalseg"><button class="'+(_txListMode==='cat'?'on':'')+'" '+App.view.act('setTxListMode','cat')+' aria-label="카테고리별 묶어 보기">카테고리</button>'+
        '<button class="'+(_txListMode==='cat'?'':'on')+'" '+App.view.act('setTxListMode','time')+' aria-label="시간순으로 보기">시간순</button></span>';
    }
    function txListHtml(rows, emptyMsg, forceMode){   // forceMode='cat'|'time' — 지정 시 전역 토글(_txListMode) 대신 그 모드로(계좌 통장 시트의 '카테고리' 탭 등)
      if(!rows.length) return '<div class="card" style="padding:6px 10px;"><div class="empty">'+emptyMsg+'</div></div>';
      if((forceMode||_txListMode)!=='cat') return '<div class="card" style="padding:6px 10px;">'+rows.map(txRowHtml).join('')+'</div>';
      const g={}; rows.forEach(t=>{ const k=t.category||TYPE_LABEL[t.type]||'기타'; (g[k]=g[k]||[]).push(t); });
      const sum=a=>a.reduce((s,t)=>s+(Number(t.amount)||0),0);
      return Object.keys(g).sort((a,b)=>sum(g[b])-sum(g[a])).map(k=>
        '<div class="card" style="padding:6px 10px;margin-bottom:10px;">'+
        '<div class="row" style="padding:8px 2px 6px;border-bottom:1px solid var(--line);"><span style="display:flex;align-items:center;gap:8px;font-weight:800;">'+catTileMini(k)+escapeHtml(k)+'<span class="tx-sub" style="font-weight:700;">'+g[k].length+'건</span></span><b>'+won(sum(g[k]))+'</b></div>'+
        g[k].map(txRowHtml).join('')+'</div>'
      ).join('');
    }
    // 👤 개인별/공동 지출 드릴다운 — 리포트 막대를 탭하면 그 달 그 소비 대상의 실지출 내역 시트(집계는 막대와 동일한 repPersonKey 기준)
    function openRepPersonTx(m, pk){
      const rows=monthTx(m).filter(t=>isActual(t)&&repPersonKey(t)===pk).slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
      const tot=rows.reduce((s,t)=>s+(Number(t.amount)||0),0);
      const _pm=(state.wsMeta&&state.wsMeta.members)||{};
      const nm=(pk==='공동')?'🤝 공동':((_pm[pk]&&_pm[pk].name)||ownerName(pk)||pk);   // uid 키면 멤버 이름으로 해석(uid 노출 방지)
      let h='<div class="row" style="margin-bottom:14px;"><div class="muted">'+(+m.split('-')[1])+'월 · '+rows.length+'건</div><div class="red" style="font-weight:700;">-'+fmtComma(tot)+'</div></div>';
      if(rows.length) h+='<div style="display:flex;justify-content:flex-end;margin:-6px 0 8px;">'+txListSegHtml()+'</div>';
      h+=txListHtml(rows, '이 달 지출이 없습니다');
      openSheet(nm+' 지출', h);   // 시트 제목은 textContent 삽입이라 escape 불필요
      state._sheetReopen=()=>openRepPersonTx(m,pk);   // ↩️ 거래 수정 시트 닫으면 이 드릴다운으로 복귀
    }
    // ===== 🔍 거래 검색 + ☑️ 일괄 편집 =====
    //  순수 매칭 txMatches(util.js)를 UI로 — 키워드(설명·메모·카테고리)·기간·금액범위·유형 필터, 결과 최신순(100건 표시).
    //  '선택' 모드: 행 탭=선택 토글 → 카테고리·소비대상 일괄 변경(즉시)·일괄 삭제(확인, coPay 짝·정기 멱등로그 정리 포함).
    let _txsT=0;
    function openTxSearch(){
      const q=state._txSearch||(state._txSearch={});
      state._txsSel=false; state._txsSet={};   // 열 때 선택 모드 초기화
      let h='<div class="field"><label for="txsKw">키워드(설명·메모·카테고리)</label><input class="input" id="txsKw" value="'+escapeHtml(q.keyword||'')+'" oninput="txsSet(\'keyword\',this.value)" placeholder="예: 병원, 스타벅스"></div>';
      h+='<div class="form-2"><div class="field"><label>시작일</label><input type="date" class="input" id="txsFrom" value="'+(q.dateFrom||'')+'" '+App.view.chg('txsChg')+'></div>'+
        '<div class="field"><label>종료일</label><input type="date" class="input" id="txsTo" value="'+(q.dateTo||'')+'" '+App.view.chg('txsChg')+'></div></div>';
      h+='<div class="form-2"><div class="field"><label>최소 금액</label><input class="input" id="txsMin" inputmode="numeric" value="'+(q.amountMin?Number(q.amountMin).toLocaleString():'')+'" oninput="this.value=fmtComma(this.value);txsChg()"></div>'+
        '<div class="field"><label>최대 금액</label><input class="input" id="txsMax" inputmode="numeric" value="'+(q.amountMax?Number(q.amountMax).toLocaleString():'')+'" oninput="this.value=fmtComma(this.value);txsChg()"></div></div>';
      h+='<div class="field"><label>유형</label><select class="input" id="txsType" '+App.view.chg('txsChg')+'><option value="">전체</option>'+Object.keys(TYPE_LABEL).map(tp=>'<option value="'+tp+'"'+(q.type===tp?' selected':'')+'>'+TYPE_LABEL[tp]+'</option>').join('')+'</select></div>';
      h+='<div id="txsResults"></div>';
      openSheet('거래 검색', h);
      state._sheetReopen=()=>openTxSearch();     // ↩️ 결과에서 거래 수정 후 검색으로 복귀(조건 유지)
      state._sheetRefresh=_txsRender;            // 데이터 갱신(일괄 변경 반영) 시 결과만 다시 그림(입력 포커스 유지)
      _txsRender();
    }
    function txsSet(k,v){ (state._txSearch||(state._txSearch={}))[k]=v; clearTimeout(_txsT); _txsT=setTimeout(_txsRender,180); }
    function txsChg(){ const q=state._txSearch||(state._txSearch={});
      q.dateFrom=$('txsFrom')?val('txsFrom'):''; q.dateTo=$('txsTo')?val('txsTo'):'';
      q.amountMin=$('txsMin')?(parseAmount(val('txsMin'))||''):''; q.amountMax=$('txsMax')?(parseAmount(val('txsMax'))||''):'';
      q.type=$('txsType')?val('txsType'):'';
      clearTimeout(_txsT); _txsT=setTimeout(_txsRender,120);
    }
    function _txsList(){
      const q=Object.assign({}, state._txSearch||{});
      if(q.dateTo) q.dateTo=q.dateTo+'~';   // tx.date는 ISO(날짜+시각)라 그날 끝까지 포함('~' > 'T')
      return state.transactions.filter(t=>txMatches(t,q)).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    }
    function _txsRender(){
      const r=$('txsResults'); if(!r) return;
      const rows=_txsList(), shown=rows.slice(0,100);
      const tot=rows.reduce((s,t)=>s+(Number(t.amount)||0),0);
      const selMode=!!state._txsSel, set=state._txsSet||{};
      const nSel=Object.keys(set).filter(k=>set[k]).length;
      let h='<div class="sech"><span class="l">결과</span><span style="display:flex;align-items:center;gap:8px;">'+
        (rows.length?'<button class="chip'+(selMode?' on':'')+'" '+App.view.act('txsToggleMode')+'>'+(selMode?'선택 끝':'선택')+'</button>':'')+
        '<span class="s">'+rows.length+'건 · '+won(tot)+(rows.length>100?' · 100 표시':'')+'</span></span></div>';
      if(selMode){
        const cats=state.categories.filter(c=>c.isActive!==false).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
        h+='<div class="card" style="padding:10px 12px;margin-bottom:10px;">'+
          '<div class="tx-sub" style="margin-bottom:8px;"><b>'+nSel+'건 선택</b> — 아래 목록의 행을 탭해 선택/해제</div>'+
          '<div class="form-2"><select class="input" id="txsCat">'+cats.map(c=>'<option value="'+escapeHtml(c.name)+'">'+escapeHtml(c.name)+'</option>').join('')+'</select><button class="btn ghost" '+App.view.act('txsBulkCat')+'>카테고리 변경</button></div>'+
          '<div class="form-2" style="margin-top:8px;"><select class="input" id="txsWho">'+ownerOptions(defaultOwnerUid())+'</select><button class="btn ghost" '+App.view.act('txsBulkWho')+'>소비대상 변경</button></div>'+
          '<button class="btn danger" style="margin-top:8px;" '+App.view.act('txsBulkDel')+'>선택 삭제</button></div>';
      }
      h+='<div class="card" style="padding:6px 10px;">'+(shown.length?shown.map(t=>{
        const key=t.ownerUid+'|'+t.id;
        let row=txRowHtml(t);
        if(selMode){ row=row.replace('data-action="openTxSheet"','');   // 선택 모드: 행의 수정 열림 비활성(래퍼가 토글 담당)
          row='<div class="txsel'+(set[key]?' on':'')+'" '+App.view.act('txsToggleSel',key)+'>'+row+'</div>'; }
        return row;
      }).join(''):'<div class="empty" style="padding:22px 6px;">검색 결과가 없어요</div>')+'</div>';
      r.innerHTML=h;
    }
    function txsToggleMode(){ state._txsSel=!state._txsSel; if(!state._txsSel) state._txsSet={}; _txsRender(); }
    function txsToggleSel(key){ const set=state._txsSet||(state._txsSet={}); set[key]=!set[key]; _txsRender(); }
    function _txsSelTx(){ const set=state._txsSet||{}; return state.transactions.filter(t=>set[t.ownerUid+'|'+t.id]); }
    function txsBulkCat(){
      const cat=$('txsCat')?val('txsCat'):''; const list=_txsSelTx();
      if(!cat){ toast('카테고리를 고르세요', true); return; } if(!list.length){ toast('행을 탭해 거래를 선택하세요', true); return; }
      const upd={}; list.forEach(t=>{ upd[t.ownerUid+'/'+t.id+'/category']=cat; });
      db.ref(wp('transactions')).update(upd).catch(_saveErr);
      toast(list.length+'건의 카테고리를 변경했습니다');
    }
    function txsBulkWho(){
      const sel=$('txsWho')?val('txsWho'):''; const list=_txsSelTx();
      if(!list.length){ toast('행을 탭해 거래를 선택하세요', true); return; }
      const name=resolveOwnerName(sel), mem=(state.wsMeta&&state.wsMeta.members)||{};
      const upd={}; list.forEach(t=>{ upd[t.ownerUid+'/'+t.id+'/user']=name; upd[t.ownerUid+'/'+t.id+'/userUid']=mem[sel]?sel:null; });
      db.ref(wp('transactions')).update(upd).catch(_saveErr);
      toast(list.length+'건의 소비대상을 \''+name+'\'(으)로 변경했습니다');
    }
    function txsBulkDel(){
      const list=_txsSelTx(); if(!list.length){ toast('행을 탭해 거래를 선택하세요', true); return; }
      const hasCo=list.some(t=>t.coPayTxId);
      confirmSheet('선택한 '+list.length+'건을 삭제할까요?'+(hasCo?' (함께결제 짝 거래도 함께 삭제)':''), ()=>{
        const upd={};
        list.forEach(t=>{ upd[t.ownerUid+'/'+t.id]=null;
          if(t.coPayTxId) upd[t.ownerUid+'/'+t.coPayTxId]=null;   // 본 거래 삭제 → 포인트 짝도 삭제
          if(t.coPayMainId){ upd[t.ownerUid+'/'+t.coPayMainId+'/coPayTxId']=null; upd[t.ownerUid+'/'+t.coPayMainId+'/coPayAmount']=null; upd[t.ownerUid+'/'+t.coPayMainId+'/coPayAcct']=null; }   // 포인트 쪽 삭제 → 본 거래 연결 해제
          if(typeof removeRecurringLog==='function'){ removeRecurringLog(t.ownerUid, t.id); if(t.coPayTxId) removeRecurringLog(t.ownerUid, t.coPayTxId); }
        });
        db.ref(wp('transactions')).update(upd).catch(_saveErr);
        state._txsSet={};
        toast(list.length+'건을 삭제했습니다');
      });
      state._sheetBackFn=()=>openTxSearch();   // ↩️ 확인/취소 후 검색 시트로 복귀
    }
    // 📅 리포트 [월간 | 연간] 토글 — 연간 뷰는 연 총계·12개월 막대·카테고리 연간 합(월 막대 탭=그 달 월간 뷰로)
    let _repRange='month';
    function setRepRange(r){ _repRange=r; renderStats(); }
    function repRangeSegHtml(){ return '<div style="display:flex;justify-content:center;padding:6px 0 0;"><span class="repvalseg"><button class="'+(_repRange==='year'?'':'on')+'" '+App.view.act('setRepRange','month')+'>월간</button><button class="'+(_repRange==='year'?'on':'')+'" '+App.view.act('setRepRange','year')+'>연간</button></span></div>'; }
    function statsYearMove(d){ state._repYear=(state._repYear||+todayStr().slice(0,4))+d; renderStats(); }
    function yearBarTap(mm){ _repRange='month'; state.month=mm; renderStats(); }
    function yearStatsHtml(){
      const y=state._repYear||(+todayStr().slice(0,4));
      const curY=+todayStr().slice(0,4), curM=+todayStr().slice(5,7);
      let h=repRangeSegHtml();
      h+='<div class="monthlbl"><button '+App.view.act('statsYearMove',-1)+' aria-label="이전 해">‹</button><b>'+y+'년</b><button '+App.view.act('statsYearMove',1)+' aria-label="다음 해">›</button></div>';
      const months=[]; for(let i=1;i<=12;i++) months.push(y+'-'+pad2(i));
      const perM=months.map(mm=>{ const l=monthTx(mm); return { m:mm, exp:actualSpend(l), inc:sumBy(realIncome(l),'income') }; });
      const totExp=perM.reduce((s,x)=>s+x.exp,0), totInc=perM.reduce((s,x)=>s+x.inc,0);
      const nMon=(y===curY)?Math.max(1,curM):12;   // 올해는 경과 개월 기준 월평균
      h+='<div class="card" style="margin-bottom:6px"><div style="font-size:12px;color:var(--sub);font-weight:700;margin-bottom:6px">'+y+'년 총지출</div>'+
        '<div class="bigexp">₩ '+fmtComma(totExp)+'</div>'+
        '<div class="statrow">'+
          '<div><div class="k">수입</div><div class="v" style="color:var(--income)">'+signComma(totInc)+'</div></div>'+
          '<div><div class="k">잔액</div><div class="v">'+signComma(totInc-totExp)+'</div></div>'+
          '<div style="margin-left:auto"><div class="k">월평균 지출</div><div class="v">'+won(Math.round(totExp/nMon))+'</div></div>'+
        '</div></div>';
      const mx=Math.max(1,...perM.map(x=>x.exp));
      h+='<div class="sech"><span class="l">월별 지출</span><span class="s">탭=그 달 리포트</span></div><div class="bars6">'+
        perM.map(x=>'<div class="b" '+App.view.act('yearBarTap',x.m)+' role="button" tabindex="0" aria-label="'+x.m+' 월간 리포트 보기"><div class="bar'+(x.m===todayStr().slice(0,7)?' on':'')+'" style="height:'+Math.round(x.exp/mx*100)+'%"></div><div class="bl">'+(+x.m.split('-')[1])+'</div></div>').join('')+'</div>';
      const cd={}; state.transactions.forEach(t=>{ if(!isActual(t)||!t.category) return; if((t.date||'').slice(0,4)!==String(y)) return; cd[t.category]=(cd[t.category]||0)+(Number(t.amount)||0); });
      const keys=Object.keys(cd).sort((a,b)=>cd[b]-cd[a]);
      if(keys.length){ const tot=keys.reduce((s,k)=>s+cd[k],0)||1;
        h+='<div class="sech"><span class="l">카테고리별 (연간)</span><span class="s">'+keys.length+'개</span></div><div class="card">'+
          keys.slice(0,12).map(k=>'<div style="margin:9px 0;"><div class="row" style="font-size:13px;"><span style="display:flex;align-items:center;gap:7px;"><span class="catdot" style="background:'+catColor(k)+'"></span>'+escapeHtml(k)+'</span><span><b>'+won(cd[k])+'</b> <span class="tx-sub">'+Math.round(cd[k]/tot*100)+'%</span></span></div><div class="bar"><i style="width:'+Math.round(cd[k]/tot*100)+'%;background:'+catColor(k)+'"></i></div></div>').join('')+
          (keys.length>12?'<div class="tx-sub" style="margin-top:6px;">외 '+(keys.length-12)+'개 카테고리</div>':'')+'</div>';
      } else h+='<div class="empty" style="padding:24px;">'+y+'년 지출 데이터가 없습니다</div>';
      return h;
    }
    function renderStats(){
      if(typeof markReportSeen==='function') markReportSeen();   // 🐱 주간 미션: 리포트 확인
      if(_repRange==='year'){ $('content').innerHTML=yearStatsHtml(); return; }   // 📅 연간 뷰
      const m=state.month, list=monthTx(m);
      const actual=actualSpend(list), inc=sumBy(realIncome(list),'income');   // 원금회수 등 isActualExpense:false 수입은 '실수입' 아님(부채·자산 이동) → 리포트 수입에서 제외(수입 부풀림 방지)
      const refundTot=list.filter(t=>t.type==='refund').reduce((s,t)=>s+(Number(t.amount)||0),0);   // 💸 환불 합계 — 잔액에 반영(이전엔 수입·지출 어디에도 안 잡혀 잔액이 실제와 어긋났음)
      const bal=inc-actual+refundTot;
      const [yy,mo]=m.split('-');
      const _curM=(typeof todayStr==='function'?todayStr():'').slice(0,7);
      const budgetRef=(m===_curM)?new Date():new Date(+yy,+mo-1,15);   // 📅 예산 기준일=보는 달(이번 달이면 오늘 → 주간예산=이번주 유지, 과거/미래 달이면 그 달)
      // 월 네비 (+ [월간|연간] 토글)
      let h=repRangeSegHtml()+'<div class="monthlbl"><button '+App.view.act('statsMonth',-1)+' aria-label="이전 달">‹</button><b>'+yy+'년 '+(+mo)+'월</b><button '+App.view.act('statsMonth',1)+' aria-label="다음 달">›</button></div>';
      // 총지출 카드 + 수입/잔액/전월 대비
      const pActual=actualSpend(monthTx(shiftMonth(m,-1)));
      let momHtml;
      if(pActual>0){ const diff=(actual-pActual)/pActual*100, up=diff>=0; momHtml='<span style="color:'+(up?'var(--expense)':'var(--income)')+'">'+(up?'▲':'▼')+' '+Math.abs(diff).toFixed(1)+'%</span>'; }
      else momHtml='<span style="color:var(--sub)">—</span>';
      h+='<div class="card" style="margin-bottom:6px"><div style="font-size:12px;color:var(--sub);font-weight:700;margin-bottom:6px">이번 달 총지출</div>'+
        '<div class="bigexp">₩ '+fmtComma(actual)+'</div>'+
        '<div class="statrow">'+
          '<div><div class="k">수입</div><div class="v" style="color:var(--income)">'+signComma(inc)+'</div></div>'+
          (refundTot>0?'<div><div class="k">환불</div><div class="v" style="color:var(--income)">+'+fmtComma(refundTot)+'</div></div>':'')+
          '<div><div class="k">잔액</div><div class="v">'+signComma(bal)+'</div></div>'+
          '<div style="margin-left:auto"><div class="k">전월 대비</div><div class="v">'+momHtml+'</div></div>'+
        '</div></div>';
      // 카테고리별 CSS 도넛 + 범례 — 🏦 대출은 이자+원금 상환을 '대출·이자' 한 항목으로 병합(repCatSums)
      const _rc=repCatSums(m), cd=_rc.cd, loanPrin=_rc.loanPrin;
      let cats=Object.keys(cd).map(k=>({name:k,val:cd[k]})).sort((a,b)=>b.val-a.val);
      const totCat=cats.reduce((s,c)=>s+c.val,0);
      h+='<div class="sech"><span class="l">카테고리별</span><span style="display:flex;align-items:center;gap:8px;">'+(totCat>0?'<span class="repvalseg"><button class="'+(!state._repShowAmt?'on':'')+'" '+App.view.act('setRepVal',0)+' aria-label="비율(%)로 보기">%</button><button class="'+(state._repShowAmt?'on':'')+'" '+App.view.act('setRepVal',1)+' aria-label="금액으로 보기">금액</button></span>':'')+'<span class="s">'+(+mo)+'월</span></span></div>';
      if(totCat>0){
        let segs = cats;   // 금액 작은 카테고리도 묶지 않고 전부 개별 표시(구 '기타(상위 5개 밖 묶음)' 폐기 — 사용자 요청)
        let acc=0; const stops=segs.map(s=>{ const p0=acc/totCat*100, p1=(acc+s.val)/totCat*100; const col=s.etc?'var(--soft2)':catColor(s.name); acc+=s.val; return col+' '+p0.toFixed(2)+'% '+p1.toFixed(2)+'%'; });
        h+='<div class="donut-wrap"><div class="donut" style="background:conic-gradient('+stops.join(',')+')"><div class="ic"><b>'+shortAmt(totCat)+'</b><span>총지출</span></div></div>'+
          '<div class="legend'+(state._repShowAmt?' amt':'')+'">'+segs.map(s=>'<div class="lgi" '+App.view.act('openRepCatTx',m,s.name,s.etc?1:0)+' aria-label="'+escapeHtml(s.name)+' 내역 보기"><i style="background:'+(s.etc?'var(--soft2)':catColor(s.name))+'"></i><span class="ln">'+escapeHtml(s.name)+'</span><span class="lp">'+Math.round(s.val/totCat*100)+'%</span><span class="lv">'+won(s.val)+'</span><span class="lgo">›</span></div>').join('')+'</div></div>';
      } else h+='<div class="empty" style="padding:24px;">이 달 지출 데이터가 없습니다</div>';
      if(totCat>0 && loanPrin>0) h+='<div class="tx-sub" style="margin:2px 2px 10px;">🏦 \''+LOAN_CAT_MERGED+'\'엔 원금 상환 '+won(loanPrin)+'이 포함돼 있어요 — 총지출·예산엔 이자만 잡혀요.</div>';
      // 💡 인사이트: 전월 대비 가장 크게 늘어난 카테고리(의미 있는 금액만)
      const pcd={}; monthTx(shiftMonth(m,-1)).filter(t=>isActual(t)&&t.category).forEach(t=>{ pcd[t.category]=(pcd[t.category]||0)+(Number(t.amount)||0); });
      let topInc=null; cats.forEach(c=>{ const prev=pcd[c.name]||0; if(prev>=10000){ const d=(c.val-prev)/prev; if(d>=0.3 && (!topInc||d>topInc.d)) topInc={name:c.name,d:d}; } });
      if(topInc) h+='<div class="tx-sub" style="margin:2px 2px 10px;">💡 이번 달 <b>'+escapeHtml(topInc.name)+'</b> 지출이 지난달보다 <b>'+Math.round(topInc.d*100)+'%</b> 늘었어요.</div>';
      // 📊 전월 비교 — 카테고리별 지난달 → 이번달 증감(상위 8, 대출 병합 등 도넛과 동일 집계 repCatSums)
      { const pm=shiftMonth(m,-1); const prevCd=repCatSums(pm).cd;
        if(totCat>0 && Object.keys(prevCd).length){
          const names={}; cats.forEach(c=>{ names[c.name]=1; }); Object.keys(prevCd).forEach(k=>{ names[k]=1; });
          const rows=Object.keys(names).map(k=>({ name:k, cur:cd[k]||0, prev:prevCd[k]||0 }))
            .sort((a,b)=>Math.max(b.cur,b.prev)-Math.max(a.cur,a.prev)).slice(0,8);
          h+='<div class="sech"><span class="l">전월 비교</span><span class="s">'+(+pm.split('-')[1])+'월 → '+(+mo)+'월</span></div>';
          h+='<div class="card">'+rows.map(r=>{ const d=r.cur-r.prev;
            const dTxt=d===0?'<span class="tx-sub">—</span>':('<span style="font-weight:700;font-size:12px;color:'+(d>0?'var(--expense)':'var(--income)')+'">'+(d>0?'▲':'▼')+fmtComma(Math.abs(d))+'</span>');
            return '<div class="row" style="padding:6px 0;font-size:13px;"><span style="display:flex;align-items:center;gap:7px;min-width:0;"><span class="catdot" style="background:'+catColor(r.name)+'"></span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+escapeHtml(r.name)+'</span></span>'+
              '<span style="display:flex;align-items:center;gap:8px;flex:none;"><span class="tx-sub">'+fmtComma(r.prev)+'</span><span class="tx-sub">→</span><b>'+fmtComma(r.cur)+'</b>'+dTxt+'</span></div>';
          }).join('')+'</div>';
        } }
      // 통화별(해외통화 있을 때만) — 이번 달 실지출을 통화로 그룹(sumByCurrency 재사용)
      const byCur=sumByCurrency(list.filter(isActual)); const curCodes=Object.keys(byCur);
      if(curCodes.some(c=>c!=='KRW')){
        const totCurKrw=curCodes.reduce((s2,c)=>s2+byCur[c].krw,0)||1;
        const curOrder=curCodes.sort((a,b)=>byCur[b].krw-byCur[a].krw);
        h+='<div class="sech"><span class="l">통화별</span><span class="s">'+(+mo)+'월</span></div>';
        h+='<div class="card">'+curOrder.map(c=>{ const pct=Math.round(byCur[c].krw/totCurKrw*100);
          return '<div style="margin:9px 0;"><div class="row" style="font-size:13px;"><span>'+escapeHtml(curInfo(c).name)+'</span><span><b>'+escapeHtml(fmtForeign(byCur[c].foreign,c))+'</b>'+(c!=='KRW'?' <span class="tx-sub">'+won(byCur[c].krw)+'</span>':'')+'</span></div><div class="bar"><i style="width:'+pct+'%;background:var(--primary)"></i></div></div>';
        }).join('')+'</div>';
      }
      // 💳 카드별 — 선택한 달 기준(월 네비를 따라감). 탭하면 그 달 카드 결제 내역 시트(시트 안에서도 달 이동 가능).
      { const cardAccts=cardAccounts();
        const cardRows=cardAccts.map(function(a){ const tl=cardMonthTx(a.id,m); return { a:a, tl:tl, used:tl.reduce((s,t)=>s+(Number(t.amount)||0),0), n:tl.length }; })
          .filter(r=>r.n>0).sort((x,y)=>y.used-x.used);
        if(cardRows.length){
          const mref=monthRefDate(m);
          h+='<div class="sech"><span class="l">카드별</span><span class="s">'+(+mo)+'월</span></div>';
          h+=cardRows.map(function(r){
            const cf=getCard(r.a.id); const pf=cf?cardPerformance(cf, mref):null;
            const col=(pf&&pf.pct>=100)?'var(--income)':'var(--primary)';
            const sp=personSplit(r.tl);   // 👥 이 카드 결제의 소비 대상별 분담(공동 X · 현경 Y …)
            return '<div class="perfrow" '+App.view.act('openCardTxSheet',r.a.id,m)+' aria-label="'+escapeHtml(r.a.name)+' 내역 보기"><div class="perftop"><b>'+escapeHtml((cf&&cf.cardName)||r.a.name)+'</b>'+
              '<span class="pct">'+won(r.used)+'<span class="pfgo">›</span></span></div>'+
              ((pf&&pf.target)?('<div class="prog"><div class="f" style="width:'+Math.min(pf.pct,100)+'%;background:'+col+'"></div></div>'+
                '<div class="perfsub">실적 '+won(pf.sum)+' / '+won(pf.target)+' · '+pf.pct+'%'+(pf.remain>0?(' · '+won(pf.remain)+' 남음'):' · 달성 ✅')+'</div>')
                :('<div class="perfsub">'+r.n+'건 결제'+(cf?' · 실적 목표 미설정':'')+'</div>'))+
              (sp.length?('<div class="perfsub" style="margin-top:2px;">'+sp.map(x=>escapeHtml(x.label)+' '+won(x.amt)).join(' · ')+'</div>'):'')+'</div>';
          }).join('');
        }
      }
      // 최근 6개월 추이 막대
      const md={}; state.transactions.filter(isActual).forEach(t=>{ const mm=(t.date||'').substring(0,7); if(mm) md[mm]=(md[mm]||0)+(Number(t.amount)||0); });
      const keys=[]; for(let i=5;i>=0;i--) keys.push(shiftMonth(m,-i));
      const mxB=Math.max(1,...keys.map(k=>md[k]||0));
      h+='<div class="sech"><span class="l">최근 6개월 추이</span></div><div class="bars6">'+
        keys.map(k=>'<div class="b"><div class="bar'+(k===m?' on':'')+'" style="height:'+Math.round((md[k]||0)/mxB*100)+'%"></div><div class="bl">'+(+k.split('-')[1])+'월</div></div>').join('')+'</div>';
      // 소비 대상별 지출 — 개인별(용돈 등)과 공동 지출(집세 등)을 분리해서 표시. 키는 repPersonKey(uid·이름 이중 저장 병합 — 같은 사람 두 막대 방지)
      const ue={}; list.filter(isActual).forEach(t=>{ const k=repPersonKey(t); ue[k]=(ue[k]||0)+(Number(t.amount)||0); });
      const shared=ue['공동']||0;
      const _pm=(state.wsMeta&&state.wsMeta.members)||{};
      const pKeys=Object.keys(ue).filter(k=>k!=='공동'&&(ue[k]||0)>0).sort((a,b)=>(ue[b]||0)-(ue[a]||0));
      const pLabel=(k)=>escapeHtml((_pm[k]&&_pm[k].name)||k);
      if(pKeys.length||shared>0){
        const mxM=Math.max(1,shared,...pKeys.map(k=>ue[k]||0)); const pal=['#f3b14e','#7fd1a6','#c8a6f0','#6a8dff','#ff9aa2','#5ad1e0'];
        // 막대를 탭하면 그 사람(소비 대상)의 그 달 지출 내역 시트(openRepPersonTx)
        const mbar=(label,amt,col,pk)=>'<div class="mbar" '+App.view.act('openRepPersonTx',m,pk)+' role="button" tabindex="0" aria-label="'+label+' 지출 내역 보기"><div class="top"><span>'+label+'</span><span>'+fmtComma(amt||0)+'<span class="mgo">›</span></span></div><div class="track"><div class="fill" style="width:'+Math.round((amt||0)/mxM*100)+'%;background:'+col+'"></div></div></div>';
        h+='<div class="sech"><span class="l">개인별 지출</span><span class="s">용돈 등</span></div>';
        h+= pKeys.length ? pKeys.map((k,i)=>mbar(pLabel(k),ue[k]||0,pal[i%pal.length],k)).join('') : '<div class="empty" style="padding:16px;">개인 지출이 없습니다</div>';
        if(shared>0) h+='<div class="sech"><span class="l">공동 지출</span><span class="s">집세 등</span></div>'+mbar('🤝 공동',shared,'var(--sub)','공동');
      }
      const bgs=visibleBudgets();
      if(bgs.length){
        h+='<div class="card"><div class="row" style="margin-bottom:4px;"><div class="sec-title" style="margin:0;">예산</div><button class="link" '+App.view.act('openBudgetSheet')+'>관리</button></div>'+
          bgs.map(b=>{ const u=budgetUsage(b, budgetRef), c=budgetColor(u.pct);
            // 📈 소진 속도(페이스) 예측 — 이번 달을 보는 중이고 기간이 15~95% 경과했을 때, 이 속도면 얼마나 쓸지 예측(초과 예상만 경고)
            let pace='';
            if(m===_curM && u.amount>0 && u.pct<100){
              const now=parseDate(todayStr());
              const span=(u.end-u.start)/86400000+1, gone=Math.min(span,(now-u.start)/86400000+1), frac=gone/span;
              if(frac>=0.15 && frac<=0.95){ const projPct=Math.round(u.pct/frac);
                if(projPct>=105) pace='<div class="tx-sub" style="margin-top:3px;color:#E0883C;">📈 이 속도면 예산의 ~'+projPct+'%까지 쓸 것 같아요</div>'; }
            }
            return '<div style="margin:10px 0;"><div class="row" style="font-size:13px;"><span>'+(b.categoryName?'<span class="catdot" style="background:'+catColor(b.categoryName)+'"></span>':'')+budgetTitle(b)+'</span><span style="color:'+c+';font-weight:700;">'+u.pct+'%'+(u.pct>=100?' 초과':(b.alertEnabled!==false&&u.pct>=(b.alertThreshold||80)?' ⚠️':''))+'</span></div><div class="bar"><i style="width:'+Math.min(u.pct,100)+'%;background:'+c+'"></i></div><div class="tx-sub" style="margin-top:4px;">'+won(u.used)+' / '+won(u.amount)+'</div>'+pace+'</div>'; }).join('')+'</div>';
      }
      const pbsR=visiblePBs().filter(p=>(p.status||'active')==='active');
      if(pbsR.length){
        const ranked=pbsR.map(p=>({p,u:pbUsage(p)})).sort((a,b)=>b.u.used-a.u.used).slice(0,3);
        h+='<div class="card"><div class="row" style="margin-bottom:4px;"><div class="sec-title" style="margin:0;">목적별 가계부</div><button class="link" '+App.view.act('openPurposeBooks')+'>전체</button></div>'+
          ranked.map(r=>{ const c=budgetColor(r.u.pct); return '<div style="margin:10px 0;"><div class="row" style="font-size:13px;"><span>'+(r.p.icon||'📒')+' '+escapeHtml(r.p.name)+'</span><span>'+won(r.u.used)+(r.p.budgetAmount?(' / '+won(r.u.amount)):'')+'</span></div>'+(r.p.budgetAmount?('<div class="bar"><i style="width:'+Math.min(r.u.pct,100)+'%;background:'+c+'"></i></div>'):'')+'</div>'; }).join('')+'</div>';
      }
      const pa=prepaidAccounts().filter(canSee);
      if(pa.length) h+='<div class="card" style="margin-top:34px;"><div class="sec-title" style="margin:0 0 8px;">선불·포인트 잔액</div>'+pa.map(a=>'<div class="row" style="padding:7px 2px;" '+App.view.act('openAcctDetail',a.id,m)+' role="button" tabindex="0" aria-label="'+escapeHtml(a.name)+' 거래내역 보기"><span>'+((a.provider&&a.provider!=='manual')?PROVIDER_LABEL[a.provider]+' · ':'')+escapeHtml(a.name)+'</span><b class="blue">'+won(accountBalance(a.id))+'<span class="pfgo">›</span></b></div>').join('')+'</div>';   // 탭=그 달 통장 내역
      $('content').innerHTML=h;
    }

    // ===== 자산 =====
    const PLUS_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
    function sechHtml(label, addAction, rightText){
      const right = rightText ? '<span class="s">'+rightText+'</span>'
        : (addAction ? '<button class="addbtn" aria-label="추가" onclick="'+addAction+'">'+PLUS_SVG+'</button>' : '');
      return '<div class="sech"><span class="l">'+label+'</span>'+right+'</div>';
    }
    function renderAssets(){
      const accs=visibleAccounts();
      const cashish=accs.filter(a=>a.type!=='credit_card' && !PREPAID_TYPES.includes(a.type) && a.type!=='other');
      const prepaid=accs.filter(a=>PREPAID_TYPES.includes(a.type));
      const others=accs.filter(a=>a.type==='other');
      const cardDebt=accs.filter(a=>a.type==='credit_card').reduce((s,a)=>s+accountBalance(a.id),0); // 보통 음수
      const net=totalAssets(), gross=net-cardDebt;

      // 순자산 hero
      let h='<div class="assethero"><div class="k">순자산</div><div class="v">'+won(net)+'</div>'+
        '<div class="sp"><div><div class="kk">총자산</div><div class="vv">'+won(gross)+'</div></div>'+
        '<div><div class="kk">카드대금</div><div class="vv'+(cardDebt<0?' red':'')+'">'+won(cardDebt)+'</div></div>'+
        '<div style="margin-left:auto;display:flex;align-items:flex-end"><span class="pill" style="margin-left:0;">계좌 '+accs.length+'개</span></div></div></div>';
      // 📅 예정(미래) 거래 안내 — 현재 잔액에 미반영
      { const _sc=(typeof scheduledTxs==='function')?scheduledTxs():[]; if(_sc.length) h+='<div class="tx-sub" style="margin:-4px 2px 10px;">📅 <b>예정 거래 '+_sc.length+'건</b> — 현재 잔액엔 아직 반영 안 됐어요(날짜가 되면 자동 반영).</div>'; }
      // 📌 이번 달 고정지출 미리보기(정기·구독·적금) — "월급 들어와도 이만큼은 나갈 돈"
      { const fc=monthFixedCosts();
        if(fc.total>0){
          h+='<div class="card" style="margin-bottom:10px;"><div class="row"><b>📌 이번 달 고정지출</b><b>'+won(fc.total)+'</b></div>'+
            (fc.rec.sum>0?('<div class="row" style="margin-top:6px;font-size:13px;" '+App.view.act('openRecurringList')+' role="button" tabindex="0"><span class="muted">정기결제 '+fc.rec.n+'건 ›</span><span>'+won(fc.rec.sum)+'</span></div>'):'')+
            (fc.sub.sum>0?('<div class="row" style="margin-top:4px;font-size:13px;" '+App.view.act('openSubscriptions')+' role="button" tabindex="0"><span class="muted">구독 '+fc.sub.n+'건 ›</span><span>'+won(fc.sub.sum)+'</span></div>'):'')+
            (fc.sav.sum>0?('<div class="row" style="margin-top:4px;font-size:13px;"><span class="muted">적금 납입 '+fc.sav.n+'건</span><span>'+won(fc.sav.sum)+'</span></div>'):'')+
            (fc.loan&&fc.loan.sum>0?('<div class="row" style="margin-top:4px;font-size:13px;" '+App.view.act('openLoanBook')+' role="button" tabindex="0"><span class="muted">대출 상환 '+fc.loan.n+'건 ›</span><span>'+won(fc.loan.sum)+'</span></div>'+
              '<div class="tx-sub" style="margin:2px 0 0 8px;">원금 '+won(fc.loan.prin)+' + 이자 '+won(fc.loan.int)+(fc.loan.prin===0?' · 원금만기 방식은 원금을 만기에 일시상환해요 — 매월 원금을 갚는 대출이면 대출 설정에서 <b>원리금균등·원금균등</b>으로 바꿔주세요':'')+'</div>'):'')+
            (fc.remain>0?('<div class="tx-sub" style="margin-top:8px;">오늘 이후 남은 예정 <b>'+won(fc.remain)+'</b></div>'):'<div class="tx-sub" style="margin-top:8px;">이번 달 예정분은 모두 지나갔어요</div>')+
          '</div>';
        } }
      // 💡 계좌별 이번 달 필요액 — 월급날 어느 계좌에 얼마 넣어둘지(자동 기록 출금 기준, 적금 이체 포함)
      { const needs=monthAcctNeeds();
        if(needs.length){
          h+='<div class="card" style="margin-bottom:10px;"><div class="row"><b>💡 계좌별 이번 달 필요액</b><span class="tx-sub">정기 · 구독 · 적금 · 대출</span></div>'+
            needs.map(n=>'<div class="row" style="margin-top:6px;font-size:13px;" '+App.view.act('openAcctDetail',n.id)+' role="button" tabindex="0" aria-label="'+escapeHtml(n.name)+' 거래내역 보기"><span class="muted">'+escapeHtml(n.name)+' ›</span><span><b>'+won(n.sum)+'</b>'+(n.remain>0&&n.remain!==n.sum?(' <span class="tx-sub">남은 '+won(n.remain)+'</span>'):'')+'</span></div>').join('')+
            '<div class="tx-sub" style="margin-top:8px;">월급이 들어오면 각 계좌에 이만큼 옮겨두세요 — 자동 기록이 부족 없이 돌아가요.</div></div>';
        } }

      // 입출금 · 현금
      h+=sechHtml('입출금 · 현금','openAcctSheet()');
      h+= cashish.length? cashish.map(acctRowHtml).join('') : '<div class="empty" style="padding:18px;">등록된 계좌가 없습니다</div>';

      // 카드 실적
      const cards=state.creditCards.filter(c=>canSee(getAcct(c.id)||{owner:''}));
      if(cards.length){
        h+=sechHtml('카드 실적', null, (new Date().getMonth()+1)+'월');
        cards.forEach(c=>{
          const pf=cardPerformance(c), col=pf.pct>=100?'var(--income)':'var(--primary)';
          h+='<div class="perfrow" '+App.view.act('openAcctDetail',c.id)+' aria-label="'+escapeHtml(c.cardName||acctName(c.id))+' 거래내역 보기"><div class="perftop"><b>'+escapeHtml(c.cardName||acctName(c.id))+'</b>'+
            '<span class="pct" style="color:'+col+'">'+(pf.target?pf.pct+'%':'목표 미설정')+'</span></div>'+
            (pf.target?'<div class="prog"><div class="f" style="width:'+Math.min(pf.pct,100)+'%;background:'+col+'"></div></div>'+
              '<div class="perfsub">'+won(pf.sum)+' / '+won(pf.target)+(pf.remain>0?' · '+won(pf.remain)+' 더 쓰면 실적 달성':' · 이번 달 실적 충족')+'</div>':'')+'</div>';
        });
      }

      // 선불 · 포인트
      if(prepaid.length){ h+=sechHtml('선불 · 포인트','openAcctSheet()'); h+=prepaid.map(acctRowHtml).join(''); }
      // 기타
      if(others.length){ h+=sechHtml('기타','openAcctSheet()'); h+=others.map(acctRowHtml).join(''); }

      // 적금 — 월 납입액·연이율·기간으로 만기일·예상이자 자동 계산(단리, savingsPlan). 구(목표형) 데이터는 기존 표시 유지.
      const SVC=['#22b8cf','#f04452','#3182f6','#1b9e5f','#7c3aed','#f5a623'];
      h+=sechHtml('적금','openSavingsSheet()');
      h+= state.savings.length? state.savings.map((sv,i)=>{
        const col=SVC[i%SVC.length], ch=escapeHtml((sv.name||'·').charAt(0));
        const plan=sv.monthly?savingsPlan(sv.monthly,sv.rate,sv.months,sv.startDate,sv.day):null;
        if(!plan){   // 구(목표형) 적금 — 열어서 저장하면 월 납입식으로 전환
          const p=sv.goal?Math.min(Math.round(sv.current/sv.goal*100),999):0;
          return '<div class="bgrow" '+App.view.act('openSavingsSheet',sv.ownerUid,sv.id)+'><div class="bgtop"><span class="ci" style="background:'+col+'">'+ch+'</span>'+
            '<span class="bn">'+escapeHtml(sv.name)+'</span><span class="ba">'+p+'%</span></div>'+
            '<div class="bgtrack"><div class="bgfill" style="width:'+Math.min(p,100)+'%;background:'+col+'"></div></div>'+
            '<div class="perfsub" style="margin-top:6px">'+won(sv.current)+' / '+won(sv.goal)+'</div></div>';
        }
        const paid=savingsPaid(sv,plan), p=Math.min(Math.round(paid.count/plan.count*100),100), done=paid.count>=plan.count;
        return '<div class="bgrow" '+App.view.act('openSavingsSheet',sv.ownerUid,sv.id)+'><div class="bgtop"><span class="ci" style="background:'+col+'">'+ch+'</span>'+
          '<span class="bn">'+escapeHtml(sv.name)+'</span><span class="ba">'+(done?'만기':p+'%')+'</span></div>'+
          '<div class="bgtrack"><div class="bgfill" style="width:'+p+'%;background:'+col+'"></div></div>'+
          '<div class="perfsub" style="margin-top:6px">월 '+won(sv.monthly)+' · 연 '+(Number(sv.rate)||0)+'% · '+paid.count+'/'+plan.count+'회 납입'+(sv.from?'':' (추정)')+'</div>'+
          '<div class="perfsub" style="margin-top:2px">만기 '+ymd(plan.maturity)+' · 예상 수령 '+won(plan.total)+' (세후이자 '+won(plan.afterTax)+')</div></div>';
      }).join(''):'<div class="empty" style="padding:20px;">등록된 적금이 없습니다</div>';

      $('content').innerHTML=h;
    }
    // 📌 이번 달 고정지출 집계(자산 카드) — 정기(지출성)·구독(정기 미연결만, 이중집계 방지)·적금 납입(savingsId 규칙)을 나눠 합산.
    //    remain=오늘 이후 남은 예정액. 이번 달 발생 회차는 occurrencesV2(정기 엔진과 동일 계산)로 센다.
    function monthFixedCosts(){
      const mm=todayStr().slice(0,7), today=parseDate(todayStr());
      const mStart=parseDate(mm+'-01'), mEnd=new Date(mStart.getFullYear(), mStart.getMonth()+1, 0);
      const EXPT={expense:1,prepaid_spend:1,point_spend:1};
      const rec={n:0,sum:0,remain:0}, sub={n:0,sum:0,remain:0}, sav={n:0,sum:0,remain:0};
      state.recurring.filter(r=>canSee(r)&&ruleStatus(r)==='active').forEach(r=>{
        const bucket=r.savingsId?sav:(EXPT[r.type]?rec:null); if(!bucket) return;
        let occ=occurrencesV2(r, mStart, mEnd);
        if(r.endDate){ const ed=parseDate(r.endDate); occ=occ.filter(o=>o<=ed); }
        const amt=Number(r.amount)||0;
        occ.forEach(o=>{ bucket.n++; bucket.sum+=amt; if(o>today) bucket.remain+=amt; });
      });
      (state.subscriptions||[]).filter(s=>(s.status||'active')==='active'&&!s.recurringId).forEach(s=>{
        const nb=subNextBilling(s); if(!nb||String(nb).slice(0,7)!==mm) return;
        const amt=Number(s.amount)||0; sub.n++; sub.sum+=amt; if(parseDate(nb)>today) sub.remain+=amt;
      });
      // 🏦 대출 상환(빌림·활성·잔액 있음) — 상환 방식 스케줄의 이번 달 회차 납입액(loanMonthPlan). pay=원금+이자(원금만기 방식은 정의상 매월 원금 0 — 만기 달엔 원금 포함)
      const loan={n:0,sum:0,remain:0,prin:0,int:0};
      visibleLoans().forEach(l=>{ if(l.direction==='lent') return; if(loanCalc(l).balance<=0) return;
        const mp=loanMonthPlan(l, mm); if(!mp||!mp.inst) return;
        loan.n++; loan.sum+=mp.inst.pay; loan.prin+=mp.inst.prin; loan.int+=mp.inst.int;
        if(mp.day>+todayStr().slice(8,10)) loan.remain+=mp.inst.pay; });
      return { rec, sub, sav, loan, total:rec.sum+sub.sum+sav.sum+loan.sum, remain:rec.remain+sub.remain+sav.remain+loan.remain };
    }
    // 💡 계좌별 이번 달 필요액 — 이 계좌에서 자동으로 '나갈' 돈(적금 이체(savingsId) + 지출성 정기 + 구독 결제수단 + 대출 상환계좌)을 계좌별 합산.
    //  "월급날 각 계좌에 얼마씩 넣어둘까"용 — 카드 라벨(정기·구독·적금·대출) 그대로, 일반 이체·충전(계좌 간 돈 옮기기·입금성 정기)은 제외한다
    //  (예전엔 debit측 정기 전부를 합산해 월급 이체·파킹 이체 같은 입금 내역까지 필요액에 섞이던 문제 — 사용자 보고로 한정).
    function monthAcctNeeds(){
      const mm=todayStr().slice(0,7), today=parseDate(todayStr());
      const mStart=parseDate(mm+'-01'), mEnd=new Date(mStart.getFullYear(), mStart.getMonth()+1, 0);
      const EXPT={expense:1,prepaid_spend:1,point_spend:1};   // 지출성 정기(monthFixedCosts와 동일 기준)
      const need={}; const add=(acct,amt,d)=>{ if(!acct||!getAcct(acct)||!(amt>0)) return; const e=need[acct]=need[acct]||{sum:0,remain:0}; e.sum+=amt; if(d>today) e.remain+=amt; };
      state.recurring.filter(r=>canSee(r)&&ruleStatus(r)==='active').forEach(r=>{
        const e=TX_EFFECT[r.type]||{}; if(!e.debit||!r.from) return;
        if(!r.savingsId && !EXPT[r.type]) return;   // 적금 이체 외 일반 이체·충전 정기는 필요액에서 제외
        let occ=occurrencesV2(r, mStart, mEnd);
        if(r.endDate){ const ed=parseDate(r.endDate); occ=occ.filter(o=>o<=ed); }
        occ.forEach(o=>add(r.from, Number(r.amount)||0, o));
      });
      (state.subscriptions||[]).filter(s=>(s.status||'active')==='active'&&!s.recurringId&&s.paymentAccountId).forEach(s=>{
        const nb=subNextBilling(s); if(nb&&String(nb).slice(0,7)===mm) add(s.paymentAccountId, Number(s.amount)||0, parseDate(nb));
      });
      visibleLoans().forEach(l=>{ if(l.direction==='lent'||!l.account) return; if(loanCalc(l).balance<=0) return;
        const mp=loanMonthPlan(l, mm); if(mp&&mp.inst) add(l.account, mp.inst.pay, parseDate(mm+'-'+pad2(mp.day)));
      });
      return Object.keys(need).map(id=>({ id, name:acctName(id), sum:need[id].sum, remain:need[id].remain })).sort((a,b)=>b.sum-a.sum);
    }
    // 계좌 유형별 라인 아이콘(시안) — 색은 a.color 유지
    function acctIcon(type){
      const P={
        bank:'<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/>',
        credit_card:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 9h18"/>',
        debit_card:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 9h18"/>',
        cash:'<path d="M3 8h18v9H3z"/><circle cx="12" cy="12.5" r="2"/>',
        prepaid:'<circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/>',
        point:'<circle cx="12" cy="12" r="9"/><path d="M9 8v8l6-8v8"/>',
        e_wallet:'<rect x="3" y="6" width="18" height="12" rx="3"/><path d="M16 12h.01"/>',
        gift_card:'<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M3 9h18M12 9v11M12 9c-2-3-6-3-6 0M12 9c2-3 6-3 6 0"/>',
        other:'<path d="M12 3l9 4v10l-9 4-9-4V7z"/><path d="M3 7l9 4 9-4"/>'
      };
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+(P[type]||P.bank)+'</svg>';
    }
    function acctRowHtml(a){
      const bal=accountBalance(a.id);
      const prov=(a.provider&&a.provider!=='manual')?'<span class="pill">'+(PROVIDER_LABEL[a.provider]||a.provider)+'</span>':'';
      const vis=(a.visibility&&a.visibility!=='full')?'<span class="pill">'+(a.visibility==='private'?'개인':'잔액만')+'</span>':'';
      const sub=(ACCT_TYPE_LABEL[a.type]||a.type)+(a.owner?' · '+escapeHtml(ownerName(a.owner)):'');   // owner는 멤버 uid로 저장될 수 있어 반드시 ownerName으로 이름 해석(uid 그대로 노출 방지)
      return '<div class="acct" '+App.view.act('openAcctDetail',a.id)+' aria-label="'+escapeHtml(a.name)+' 거래내역 보기"><div class="acct-dot">'+acctIcon(a.type)+'</div>'+
        '<div style="min-width:0;" class="acct-nm"><b>'+escapeHtml(a.name)+prov+vis+'</b><span>'+sub+'</span></div>'+
        '<div class="acct-bal '+(bal<0?'red':'')+'">'+won(bal)+'<span class="pfgo">›</span></div></div>';
    }

    // ===== 🏦 계좌 거래내역(통장) — 계좌·카드·선불·포인트 공통 =====
    //  계좌 '관점'의 증감: 그 계좌가 출금측(debit)이면 −, 입금측(credit)이면 + (이체·충전은 양쪽 계좌에 각각 반대 부호로 잡힘).
    //  잔액 계산(accountBalance)과 같은 TX_EFFECT 규칙을 쓰므로 잔액·내역이 항상 일치한다.
    function acctDelta(t, id){
      const e=TX_EFFECT[t.type]||{}; const amt=Number(t.amount)||0; let d=0;
      if(e.debit && t[e.debit]===id) d-=amt;
      if(e.credit && t[e.credit]===id) d+=amt;
      return d;
    }
    function txTouchesAcct(t, id){ const e=TX_EFFECT[t.type]||{}; return !!((e.debit && t[e.debit]===id) || (e.credit && t[e.credit]===id)); }
    // 그 달 이 계좌 거래 + 잔액 추이(통장 정리). 잔액은 '초기잔액 + 이전 모든 거래'에서 시작해 시간순으로 누적(미래=예정 거래도 포함해 예상 잔액을 보여줌).
    function acctMonthRows(id, m){
      const a=getAcct(id)||{};
      const all=state.transactions.filter(t=>txTouchesAcct(t,id)).sort((x,y)=>(x.date||'').localeCompare(y.date||''));
      let bal=Number(a.initialBalance||0); const rows=[]; let inSum=0, outSum=0;
      all.forEach(t=>{ const d=acctDelta(t,id); bal+=d;
        if((t.date||'').slice(0,7)===m){ rows.push({ t:t, d:d, bal:bal }); if(d>=0) inSum+=d; else outSum+=-d; } });
      const startBal=rows.length?(rows[0].bal-rows[0].d):bal;   // 이 달 첫 거래 직전 잔액(거래 없으면 현재까지 누적치)
      return { rows:rows.reverse(), inSum, outSum, startBal, endBal:rows.length?rows[0].bal:startBal };   // 표시는 최신순
    }
    // 통장식 거래 행 — 계좌 관점 부호(+입금/−출금)와 그 거래 직후 잔액을 함께. 탭=거래 수정(닫으면 이 시트로 복귀).
    function acctTxRowHtml(o, id){
      const t=o.t, d=o.d;
      let tileStyle='', tileInner;
      if(t.category && (getCat(t.category)||CAT_META[t.category])){ tileStyle=catTileStyle(t.category); tileInner=catSvgIcon(t.category); }
      else { tileInner=svgWrap(CAT_SVG[TX_SVG_KEY[t.type]||'tag']); }
      const e=TX_EFFECT[t.type]||{};
      const otherId=(e.debit&&t[e.debit]===id)?t.to:((e.credit&&t[e.credit]===id)?t.from:'');   // 이체·충전의 상대 계좌
      const dd=(t.date||'').slice(5,10).replace('-','/');
      const parts=[dd];
      if(t.category) parts.push(escapeHtml(t.category)); else parts.push(TYPE_LABEL[t.type]||'');
      if(otherId&&getAcct(otherId)) parts.push((d<0?'→ ':'← ')+escapeHtml(acctName(otherId)));
      if(t.user) parts.push(escapeHtml(ownerName(t.user)));
      const sched=((t.date||'').slice(0,10)>todayStr())?'<span class="pill" style="color:var(--primary);border-color:var(--primary);">📅 예정</span>':'';
      const rec=t.recurringId?'<span class="pill">🔁</span>':'';
      return '<div class="tx'+(sched?' tx-sched':'')+'" '+App.view.act('openTxSheet',t.ownerUid,t.id)+'>'+
        '<div class="tx-ic" style="'+tileStyle+'">'+tileInner+'</div>'+
        '<div class="tx-main"><div class="tx-title">'+escapeHtml(t.desc||TYPE_LABEL[t.type]||'')+sched+rec+'</div>'+
        '<div class="tx-sub">'+parts.join(' · ')+'</div></div>'+
        '<div class="tx-amt '+(d<0?'red':(d>0?'green':'muted'))+'" style="text-align:right;">'+(d>0?'+':(d<0?'-':''))+'₩'+Math.abs(d).toLocaleString()+
        '<span class="acct-run">'+won(o.bal)+'</span></div></div>';
    }
    // 계좌 상세(통장) 시트 — 월 네비 + 잔액 요약 + [통장 | 카테고리별] 보기 + 이 계좌로 거래 추가 + 설정 수정.
    function openAcctDetail(id, m, mode){
      const a=getAcct(id); if(!a) return;
      m=m||state.month; mode=mode||'book';
      const card=getCard(id);
      const R=acctMonthRows(id, m), p=m.split('-');
      const cur=accountBalance(id);
      let h='<div class="monthlbl" style="padding-top:0;"><button '+App.view.act('openAcctDetail',id,shiftMonth(m,-1),mode)+' aria-label="이전 달">‹</button><b>'+p[0]+'년 '+(+p[1])+'월</b><button '+App.view.act('openAcctDetail',id,shiftMonth(m,1),mode)+' aria-label="다음 달">›</button></div>';
      // 잔액 요약 — 현재 잔액(오늘까지·목록과 동일 기준) + 이 달 입금/출금/순변동 + 월말 잔액
      const net=R.inSum-R.outSum;
      h+='<div class="card" style="margin-bottom:12px;"><div class="row"><span class="muted">'+(ACCT_TYPE_LABEL[a.type]||a.type)+' 현재 잔액</span><b class="'+(cur<0?'red':'')+'" style="font-size:17px;">'+won(cur)+'</b></div>'+
        '<div class="statrow" style="margin-top:10px;">'+
          '<div><div class="k">입금</div><div class="v" style="color:var(--income)">+'+fmtComma(R.inSum)+'</div></div>'+
          '<div><div class="k">출금</div><div class="v" style="color:var(--expense)">-'+fmtComma(R.outSum)+'</div></div>'+
          '<div><div class="k">순변동</div><div class="v">'+signComma(net)+'</div></div>'+
          '<div style="margin-left:auto"><div class="k">'+(+p[1])+'월 말 잔액</div><div class="v">'+won(R.endBal)+'</div></div>'+
        '</div>';
      if(card){ const pf=cardPerformance(card, monthRefDate(m));
        h+='<div style="margin-top:10px;border-top:1px solid var(--line);padding-top:10px;"><div class="row" style="font-size:13px;"><span class="muted">💳 카드 실적</span><span>'+(pf.target?(won(pf.sum)+' / '+won(pf.target)+' · '+pf.pct+'%'):'목표 미설정')+'</span></div>'+
          '<button class="chip" style="margin-top:8px;" '+App.view.act('openCardTxSheet',id,m,'period')+'>실적 기간으로 보기 ›</button></div>'; }
      h+='</div>';
      h+='<div class="sech"><span class="l">거래내역</span><span style="display:flex;align-items:center;gap:8px;">'+
        (R.rows.length?('<span class="repvalseg"><button class="'+(mode==='book'?'on':'')+'" '+App.view.act('openAcctDetail',id,m,'book')+' aria-label="통장식으로 보기">통장</button><button class="'+(mode==='book'?'':'on')+'" '+App.view.act('openAcctDetail',id,m,'cat')+' aria-label="카테고리별로 보기">카테고리</button></span>'):'')+
        '<span class="s">'+R.rows.length+'건</span></span></div>';
      if(!R.rows.length) h+='<div class="card" style="padding:6px 10px;"><div class="empty" style="padding:22px 6px;">이 달 이 '+(card?'카드':'계좌')+'의 거래가 없어요</div></div>';
      else if(mode==='book') h+='<div class="card" style="padding:6px 10px;">'+R.rows.map(o=>acctTxRowHtml(o,id)).join('')+'</div>';
      else h+=txListHtml(R.rows.map(o=>o.t), '이 달 거래가 없어요', 'cat');   // 카테고리 묶음(소계·건수) — 내역 시트 공용
      h+='<button class="btn" style="margin-top:14px;" '+App.view.act('addTxForAcct',id)+'>+ 이 '+(card?'카드로':'계좌로')+' 거래 추가</button>';
      h+='<button class="btn ghost" style="margin-top:8px;" '+App.view.act('openAcctSheet',id)+'>설정 수정</button>';
      openSheet(a.name||'계좌', h);
      state._sheetReopen=()=>openAcctDetail(id,m,mode);   // ↩️ 거래 수정 시트 닫으면 이 통장으로 복귀
    }
    // 이 계좌를 결제·출금 수단으로 프리셋한 거래 입력 — 포인트·선불 계좌는 그에 맞는 유형으로 자동 전환
    function addTxForAcct(id){
      const a=getAcct(id); if(!a) return;
      openTxSheet();
      const sh=$('sheet'); if(!sh) return;
      if(a.type==='point') sheetType='point_spend';
      else if(PREPAID_TYPES.includes(a.type)) sheetType='prepaid_spend';
      else sheetType='expense';
      sh._from=id; if(sh._touched) sh._touched.from=true;
      highlightTypeSeg(); renderTxDyn();
    }

    function openAcctSheet(id, presetType){
      const a=id?getAcct(id):null;
      const card=id?getCard(id):null;
      const curType=a?a.type:(presetType||'bank');
      let h='<div class="field"><label>이름</label><input class="input" id="aName" value="'+escapeHtml(a?a.name:'')+'" placeholder="예: 쿠팡캐시, 신한카드"></div>';
      h+='<div class="form-2"><div class="field"><label>유형</label><select class="input" id="aType" '+App.view.chg('onAcctTypeChange')+'>'+ACCT_TYPES.map(p=>'<option value="'+p[0]+'"'+(curType===p[0]?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>제공처</label><select class="input" id="aProvider">'+PROVIDERS.map(p=>'<option value="'+p[0]+'"'+(((a&&a.provider===p[0])||(!a&&p[0]==='manual'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div></div>';
      h+='<div class="form-2"><div class="field"><label>소유자</label><select class="input" id="aOwner">'+ownerOptions(a?a.owner:defaultOwnerName())+'</select></div>'+
        '<div class="field"><label>공개 범위</label><select class="input" id="aVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((a&&a.visibility===p[0])||(!a&&p[0]===defaultVisibility()))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div></div>';
      h+='<div class="field"><label>현재(초기) 잔액</label><input class="input" id="aInit" inputmode="text" value="'+(a?Number(a.initialBalance||0).toLocaleString():'')+'" placeholder="0 (부채는 -100,000)" oninput="this.value=fmtCommaSigned(this.value)"></div>';
      h+='<div class="field"><label>메모 (선택)</label><input class="input" id="aMemo" value="'+escapeHtml(a?(a.memo||''):'')+'" placeholder="메모"></div>';
      h+='<div id="aCardCfg" style="'+(curType==='credit_card'?'':'display:none;')+'">'+(curType==='credit_card'?cardCfgHtml(card):'')+'</div>';
      h+='<div id="aPrepaidCfg" style="'+(PREPAID_TYPES.includes(curType)?'':'display:none;')+'">'+(PREPAID_TYPES.includes(curType)?prepaidCfgHtml(a):'')+'</div>';
      // 🧮 실제 잔액 맞추기(기존 계좌만) — 실잔액 입력 → 차액만큼 잔액조정 거래 자동 생성(직접 계산 불필요)
      if(a){ const _bal=accountBalance(id);
        h+='<div class="card" style="padding:14px;margin:4px 0 14px;"><div class="sec-title" style="margin:0 0 8px;">🧮 실제 잔액 맞추기</div>'+
          '<div class="tx-sub" style="margin-bottom:8px;">앱 잔액 <b>'+won(_bal)+'</b> — 실제 잔액을 입력하면 차액만큼 <b>잔액조정 거래</b>를 만들어 맞춰드려요(실소비 통계 미포함).</div>'+
          '<div class="form-2"><input class="input" id="aReal" inputmode="text" placeholder="실제 잔액" oninput="this.value=fmtCommaSigned(this.value)"><button class="btn ghost" '+App.view.act('adjustAcctBalance',id)+'>맞추기</button></div></div>';
      }
      h+='<button class="btn" '+App.view.act('saveAcct', id?id:null)+'>'+(a?'수정':'추가')+'</button>';
      if(a) h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deleteAcct',id)+'>삭제</button>';
      openSheet(a?'결제수단 수정':'결제수단 추가', h);
    }
    function cardCfgHtml(card){
      return '<div class="card" style="padding:14px;margin:4px 0 14px;"><div class="sec-title" style="margin:0 0 10px;">💳 카드 실적 설정</div>'+
        '<div class="field"><label>카드사</label><input class="input" id="cCompany" value="'+escapeHtml(card?(card.cardCompany||''):'')+'" placeholder="예: 신한"></div>'+
        '<div class="field"><label>월 실적 기준 금액</label><input class="input" id="cTarget" inputmode="numeric" value="'+(card&&card.monthlyPerformanceTarget?Number(card.monthlyPerformanceTarget).toLocaleString():'')+'" placeholder="예: 300,000" oninput="this.value=fmtComma(this.value)"></div>'+
        '<div class="form-2"><div class="field"><label>실적 기간</label><select class="input" id="cPeriod" '+App.view.chg('onCardPeriodChange')+'><option value="calendar_month"'+(!card||card.performancePeriodType!=='custom'?' selected':'')+'>매월 1일~말일</option><option value="custom"'+(card&&card.performancePeriodType==='custom'?' selected':'')+'>사용자 지정</option></select></div>'+
        '<div class="field" id="cStartWrap" style="'+(card&&card.performancePeriodType==='custom'?'':'display:none;')+'"><label>시작일</label><input class="input" id="cStartDay" inputmode="numeric" value="'+(card&&card.performanceStartDay?card.performanceStartDay:'')+'" placeholder="예: 15"></div></div>'+
        '<div class="menu-item" style="padding:6px 0;"><span>선불충전 실적 포함</span><div class="switch '+(card&&card.includePrepaidCharge?'on':'')+'" id="cIncPrepaid" '+App.view.act('toggleSwitch')+'><i></i></div></div>'+
        '<div class="field"><label>실적 제외 카테고리 (쉼표 구분)</label><input class="input" id="cExclCats" value="'+escapeHtml(card&&card.excludedCategories?card.excludedCategories.join(', '):'')+'" placeholder="예: 교통, 보험"></div></div>';
    }
    // ⚡ 선불·포인트 자동충전 설정 카드 — 간편계좌(쿠팡·네이버페이 등) 상세 설정. 잔액이 마이너스가 되면 이 설정대로 충전 거래를 자동/반자동 기록.
    function prepaidCfgHtml(a){
      const from=(a&&a.autoChargeFrom)||'', amt=(a&&Number(a.autoChargeAmount))||0;
      const srcs=state.accounts.filter(x=>(!a||x.id!==a.id)&&!PREPAID_TYPES.includes(x.type));   // 출금원은 비선불 계좌만(선불→선불 연쇄 충전 방지)
      return '<div class="card" style="padding:14px;margin:4px 0 14px;"><div class="sec-title" style="margin:0 0 10px;">⚡ 자동충전 설정</div>'+
        '<div class="field"><label>출금 계좌</label><select class="input" id="aAcFrom"><option value="">설정 안 함</option>'+srcs.map(x=>'<option value="'+x.id+'"'+(x.id===from?' selected':'')+'>'+escapeHtml(x.name)+' ('+(ACCT_TYPE_LABEL[x.type]||x.type)+')</option>').join('')+'</select></div>'+
        '<div class="field"><label>충전 금액 (선택)</label><input class="input" id="aAcAmt" inputmode="numeric" value="'+(amt?amt.toLocaleString():'')+'" placeholder="예: 10,000" oninput="this.value=fmtComma(this.value)"></div>'+
        '<p class="muted" style="margin:2px 0 0;font-size:12px;line-height:1.55;">잔액이 <b>마이너스</b>가 되면 — 계좌·금액이 모두 설정돼 있으면 <b>충전 거래를 자동 기록</b>(부족분을 덮을 때까지 설정 금액의 배수), 계좌만 있으면 금액만 물어보고, 둘 다 없으면 어디서 얼마 충전할지 입력창이 떠요.</p></div>';
    }
    function onAcctTypeChange(){ const t=val('aType');
      const box=$('aCardCfg'); if(box){ if(t==='credit_card'){ box.style.display=''; if(!box.innerHTML.trim()) box.innerHTML=cardCfgHtml(null); } else box.style.display='none'; }
      const pbox=$('aPrepaidCfg'); if(pbox){ if(PREPAID_TYPES.includes(t)){ pbox.style.display=''; if(!pbox.innerHTML.trim()) pbox.innerHTML=prepaidCfgHtml(null); } else pbox.style.display='none'; } }
    function onCardPeriodChange(){ const w=$('cStartWrap'); if(w) w.style.display=(val('cPeriod')==='custom')?'':'none'; }
    function saveAcct(id){
      const name=val('aName').trim(); if(!name){ toast('이름을 입력하세요', true); return; }
      const _osel=val('aOwner'), owner=resolveOwnerName(_osel), type=val('aType');   // owner는 이름으로 정규화 저장(uid 원문 저장 방지 — tx.user와 동일 패턴)
      const colorMap={'현경':'#f04452','구근':'#3182f6','공동':'#1b9e5f'};
      const key=id||('acc_'+Date.now());
      const _amem=(state.wsMeta&&state.wsMeta.members)||{};
      const data={ name, type, provider:val('aProvider'), owner, visibility:val('aVis'),
        initialBalance:parseAmountSigned(val('aInit')), memo:val('aMemo').trim(),   // 음수(부채 계좌) 허용
        color:(getAcct(id)||{}).color||colorMap[owner]||'#3182f6', order:(getAcct(id)||{}).order||state.accounts.length+1 };
      if(_amem[_osel]||_osel===state.uid) data.ownerUid=_osel;   // 멤버 소유자는 uid 병행 저장(동명이인·개명 견고)
      if(PREPAID_TYPES.includes(type)){   // ⚡ 자동충전 설정(선불류만) — set 전체 교체라 폼 미렌더 시 기존값 유지
        data.autoChargeFrom=$('aAcFrom')?val('aAcFrom'):(((getAcct(id)||{}).autoChargeFrom)||'');
        data.autoChargeAmount=$('aAcAmt')?parseAmount(val('aAcAmt')):(Number((getAcct(id)||{}).autoChargeAmount)||0);
      }
      const updates={}; updates['accounts/'+key]=data;
      if(type==='credit_card'){
        updates['creditCards/'+key]={ cardName:name, cardCompany:val('cCompany').trim(),
          monthlyPerformanceTarget:parseAmount(val('cTarget')),
          performancePeriodType:val('cPeriod'), performanceStartDay:Number(val('cStartDay'))||1,
          includePrepaidCharge:$('cIncPrepaid')?$('cIncPrepaid').classList.contains('on'):false,
          excludedCategories:val('cExclCats').split(',').map(s=>s.trim()).filter(Boolean),
          defaultIncluded:true, visibility:val('aVis'), memo:val('aMemo').trim() };
      } else if(getCard(key)){ updates['creditCards/'+key]=null; }
      db.ref(wsRoot()).update(updates); toast(id?'수정되었습니다':'추가되었습니다'); closeSheet();
    }
    // 🧮 실제 잔액 입력 → 차액만큼 잔액조정 거래 자동 생성 — 잔액 어긋남을 원클릭으로 보정
    function adjustAcctBalance(id){
      const a=getAcct(id); if(!a) return;
      const raw=($('aReal')?val('aReal'):'').trim(); if(!raw){ toast('실제 잔액을 입력하세요', true); return; }
      const target=parseAmountSigned(raw), cur=accountBalance(id), diff=target-cur;
      if(!diff){ toast('이미 잔액이 일치해요'); return; }
      const tx={ type:'balance_adjustment', date:new Date().toISOString(), user:state.userName||'', amount:diff,
        to:id, desc:(a.name||'계좌')+' 잔액 맞추기', isActualExpense:false, memo:'실제 잔액 '+won(target)+'에 맞춤' };
      db.ref(wp('transactions/'+state.uid+'/'+Date.now())).set(tx).catch(_saveErr);
      toast('잔액조정 '+signComma(diff)+' 기록 — '+won(target)+'으로 맞췄어요'); closeSheet();
    }
    function deleteAcct(id){
      const used=state.transactions.some(t=>t.from===id||t.to===id);
      confirmSheet(used?'이 결제수단을 쓰는 거래가 있습니다. 그래도 삭제할까요? (거래는 남습니다)':'이 결제수단을 삭제할까요?',
        ()=>{ const u={}; u['accounts/'+id]=null; if(getCard(id)) u['creditCards/'+id]=null; db.ref(wsRoot()).update(u); toast('삭제되었습니다'); });
    }
    // ===== 카드 실적 화면 =====
    function openCardList(){
      let h='<button class="btn" '+App.view.act('openAcctSheet',null,'credit_card')+'>+ 신용카드 추가</button>';
      const cards=state.creditCards.filter(c=>canSee(getAcct(c.id)||{owner:''}));
      if(!cards.length) h+='<div class="empty">등록된 신용카드가 없습니다.<br>결제수단을 \'신용카드\' 유형으로 추가하세요.</div>';
      cards.forEach(c=>{ const pf=cardPerformance(c), col=pf.pct>=100?'var(--income)':(pf.pct>=70?'var(--primary)':'#f5a623');
        h+='<div class="card"><div class="row" '+App.view.act('openAcctDetail',c.id)+' role="button" tabindex="0" aria-label="'+escapeHtml(c.cardName||acctName(c.id))+' 거래내역 보기"><b>'+escapeHtml(c.cardName||acctName(c.id))+(c.cardCompany?' <span class="pill">'+escapeHtml(c.cardCompany)+'</span>':'')+'</b><span style="color:'+col+';font-weight:800;">'+(pf.target?pf.pct+'%':'목표X')+'<span class="pfgo">›</span></span></div>';
        if(pf.target) h+='<div class="bar"><i style="width:'+Math.min(pf.pct,100)+'%;background:'+col+'"></i></div><div class="tx-sub" style="margin-top:8px;">'+won(pf.sum)+' / '+won(pf.target)+(pf.remain>0?' · 남은 실적 '+won(pf.remain):' · 달성 ✅')+'<br>기간 '+ymd(pf.start)+' ~ '+ymd(pf.end)+'</div>';
        if(pf.excluded.length) h+='<div class="tx-sub" style="margin-top:10px;font-weight:700;color:var(--sub);">🚫 실적 제외 '+pf.excluded.length+'건</div><div class="card" style="padding:2px 8px;margin-top:6px;box-shadow:none;border:1px solid var(--line);">'+pf.excluded.slice(0,8).map(txRowHtml).join('')+'</div>';
        h+='</div>';
      });
      openSheet('카드 실적', h);
      state._sheetReopen=()=>openCardList();   // ↩️ 거래 수정 시트(실적 제외 건) 닫으면 이 목록으로 복귀
    }

    // 적금 납입 실적 — 자동기록 연결이면 실제 생성된 거래(recurringId) 집계, 미연결이면 스케줄상 경과 회차로 추정.
    function savingsPaid(sv, plan){
      if(sv.recurringId){
        const txs=state.transactions.filter(t=>t.recurringId===sv.recurringId);
        return { count:Math.min(txs.length,plan.count), amount:txs.reduce((s,t)=>s+(Number(t.amount)||0),0) };
      }
      const today=parseDate(todayStr());
      if(today<plan.first) return { count:0, amount:0 };
      let c=(today.getFullYear()-plan.first.getFullYear())*12+(today.getMonth()-plan.first.getMonth());
      const lastDom=new Date(today.getFullYear(),today.getMonth()+1,0).getDate();
      if(today.getDate()>=Math.min(Number(sv.day)||plan.first.getDate(),lastDom)) c+=1;   // 이번 달 납입일이 지났으면 이번 회차 포함
      c=Math.max(0,Math.min(c,plan.count));
      return { count:c, amount:c*(Number(sv.monthly)||0) };
    }
    function openSavingsSheet(ownerUid,id){
      const sv=(ownerUid&&id)?state.savings.find(x=>x.ownerUid===ownerUid&&x.id===id):null;
      let h='<div class="field"><label>적금명</label><input class="input" id="vName" value="'+escapeHtml(sv?sv.name:'')+'" placeholder="예: 청년 적금"></div>';
      if(sv&&!sv.monthly&&sv.goal!=null) h+='<div class="install-banner">목표액 방식의 옛 적금이에요. 저장하면 월 납입 방식으로 전환됩니다.</div>';
      h+='<div class="form-2"><div class="field"><label>월 납입액</label><input class="input" id="vMonthly" inputmode="numeric" value="'+(sv&&sv.monthly?Number(sv.monthly).toLocaleString():'')+'" placeholder="예: 300,000" oninput="this.value=fmtComma(this.value);svPreview()"></div>'+
        '<div class="field"><label>연 이율(%)</label><input class="input" id="vRate" inputmode="decimal" value="'+(sv&&sv.rate!=null?sv.rate:'')+'" placeholder="예: 3.5" oninput="svPreview()"></div></div>';
      h+='<div class="form-2"><div class="field"><label>기간(개월)</label><input class="input" id="vMonths" inputmode="numeric" value="'+(sv&&sv.months?sv.months:'')+'" placeholder="예: 12" oninput="svPreview()"></div>'+
        '<div class="field"><label>매달 납입일</label><select class="input" id="vDay" '+App.view.chg('svPreview')+'>'+Array.from({length:31},(_,i)=>'<option value="'+(i+1)+'"'+(((sv&&Number(sv.day)===i+1)||(!sv&&i===0))?' selected':'')+'>'+(i+1)+'일</option>').join('')+'</select></div></div>';
      h+='<div class="field"><label>시작일</label><input type="date" class="input" id="vStart" value="'+(sv&&sv.startDate?sv.startDate:todayStr())+'" '+App.view.chg('svPreview')+'></div>';
      h+='<div id="svCalc"></div>';
      h+='<div class="card" style="padding:14px;margin:4px 0 14px;"><div class="sec-title" style="margin:0 0 10px;">🏦 매달 자동 기록</div>'+
        '<div class="field"><label>출금 계좌</label><select class="input" id="vFrom"><option value="">자동 기록 안 함</option>'+acctOptsHtml(sv?(sv.from||''):'')+'</select></div>'+
        '<div class="field"><label>입금(적금) 계좌</label><select class="input" id="vTo">'+
          '<option value="__auto__"'+(!(sv&&sv.to)?' selected':'')+'>✨ 자동 — 적금명으로 새 계좌 만들기</option>'+
          acctOptsHtml(sv?(sv.to||''):'')+
          '<option value="__none__">계좌 없이 (출금만 기록)</option>'+'</select></div>'+
        '<p class="muted" style="margin:2px 0 0;font-size:12px;line-height:1.55;">저장하면 <b>적금명으로 계좌가 자동 생성</b>돼 납입액이 그 잔액으로 쌓여요(이미 쓰는 적금 통장 계좌가 있으면 목록에서 선택). 출금 계좌를 고르면 매달 납입일에 <b>이체 거래가 자동 기록</b>됩니다(정기결제 목록에서도 관리·만기까지).</p></div>';
      h+='<button class="btn" '+App.view.act('saveSavings', sv?ownerUid:null, sv?id:null)+'>'+(sv?'수정':'추가')+'</button>';
      if(sv) h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deleteSavings',ownerUid,id)+'>삭제</button>';
      openSheet(sv?'적금 수정':'적금 추가', h);
      svPreview();
    }
    // 입력할 때마다 만기일·원금·이자(세전/세후 15.4%)를 즉시 계산해 보여주는 미리보기
    function svPreview(){
      const box=$('svCalc'); if(!box) return;
      const plan=savingsPlan(parseAmount(val('vMonthly')), parseFloat(val('vRate'))||0, Number(val('vMonths')), val('vStart'), Number(val('vDay')));
      if(!plan){ box.innerHTML=''; return; }
      const row=(k,v)=>'<div class="row" style="padding:3px 0;"><span class="muted">'+k+'</span><b>'+v+'</b></div>';
      box.innerHTML='<div class="card" style="padding:14px;margin:4px 0 14px;"><div class="sec-title" style="margin:0 0 10px;">📈 만기 예상 (단리)</div>'+
        row('만기일', ymd(plan.maturity)+' · '+plan.count+'회 납입')+
        row('총 납입 원금', won(plan.principal))+
        row('세전 이자', won(plan.interest))+
        row('이자소득세(15.4%)', '-'+won(plan.tax))+
        '<div class="row" style="border-top:1px solid var(--line);margin-top:8px;padding-top:10px;"><b>만기 수령액(세후)</b><b style="color:var(--primary)">'+won(plan.total)+'</b></div></div>';
    }
    function saveSavings(ownerUid,id){
      const name=val('vName').trim(), monthly=parseAmount(val('vMonthly')), rate=parseFloat(val('vRate'))||0, months=Math.floor(Number(val('vMonths')))||0;
      const day=Number(val('vDay'))||1, startDate=val('vStart')||todayStr(), fromV=val('vFrom');
      if(!name){ toast('적금명을 입력하세요', true); return; }
      const plan=savingsPlan(monthly, rate, months, startDate, day);
      if(!plan){ toast('월 납입액과 기간(개월)을 입력하세요', true); return; }
      const owner=ownerUid||state.uid, key=id||String(Date.now());
      // ✨ 입금(적금) 계좌 — '자동'이면 적금명으로 계좌를 만들어(acc_sv_{key}, 재저장 시 재사용·이름 동기화) 납입액이 잔액으로 쌓이게 한다(사용자 요청)
      let toV=val('vTo');
      if(toV==='__none__') toV='';
      else if(toV==='__auto__'){
        const acctId='acc_sv_'+key;
        if(getAcct(acctId)){ db.ref(wp('accounts/'+acctId+'/name')).set(name); }   // 적금명 변경 시 계좌 이름도 따라감
        else db.ref(wp('accounts/'+acctId)).set({ name:name, type:'bank', provider:'manual', owner:state.userName||'', ownerUid:state.uid||'',
          visibility:defaultVisibility(), initialBalance:0, memo:'적금 계좌 (자동 생성)', color:'#5C6BE0', order:state.accounts.length+1, savingsId:key });
        toV=acctId;
      }
      const prev=(ownerUid&&id)?state.savings.find(x=>x.ownerUid===ownerUid&&x.id===id):null;
      const rid=(prev&&prev.recurringId)||('sv_'+key);
      const data={ name, monthly, rate, months, startDate, day, from:fromV||'', to:toV||'',
        user:prev?(prev.user||state.userName):state.userName,
        recurringId: fromV?rid:null,
        createdAt:prev?(prev.createdAt||new Date().toISOString()):new Date().toISOString(), updatedAt:new Date().toISOString() };
      db.ref(wp('savings/'+owner+'/'+key)).set(data);
      // 출금 계좌가 있으면 정기거래(이체) 규칙을 만들어 매달 자동 기록 — 만기(마지막 회차)까지, 정기결제 목록과 엔진(runRecurring) 공용.
      const prevRule=state.recurring.find(r=>r.ownerUid===owner&&r.id===rid);
      if(fromV){
        const rule={ type:'transfer', desc:name+' 적금', amount:monthly, freq:'monthly', interval:1,
          startDate, endDate:ymd(plan.last), day, weekday:0,
          user:data.user, autoCreate:true, status:'active', visibility:defaultVisibility(), memo:'',
          from:fromV, to:toV||'', savingsId:key,
          lastPosted:prevRule?(prevRule.lastPosted||''):'', notifyBeforeCreate:false,
          createdAt:prevRule?(prevRule.createdAt||new Date().toISOString()):new Date().toISOString(), updatedAt:new Date().toISOString() };
        const nr=nextRunOf(rule); rule.nextRunDate=nr?ymd(nr):null;
        db.ref(wp('recurring/'+owner+'/'+rid)).set(rule);
        if(owner===state.uid) setTimeout(runRecurring,400);
        // 💰 시작일(가입일)의 '일'과 납입일이 다르면 — 첫 납입을 시작일에 바로 기록할지 제안(신규만).
        //  은행 적금처럼 가입 당일 1회 납입 후 매달 납입일에 이어가는 패턴. postOccurrence 재사용(멱등 로그·정기 생성분과 동일 형태 rec_sv_*).
        if(!prev && +startDate.slice(8,10)!==day){
          const _sd=startDate, _ruleRef=Object.assign({ ownerUid:owner, id:rid }, rule);
          setTimeout(function(){
            confirmSheet('시작일('+(+_sd.slice(5,7))+'월 '+(+_sd.slice(8,10))+'일)과 납입일('+day+'일)이 달라요.\n시작일에 첫 납입 '+won(monthly)+'을 바로 기록할까요? (다음부턴 매달 '+day+'일 자동 기록)', function(){
              if(postOccurrence(_ruleRef, parseDate(_sd))) toast('첫 납입을 기록했어요 — 다음은 매달 '+day+'일');
              else toast('이미 기록되어 있어요', true);
            }, { okLabel:'첫 납입 기록', danger:false, title:'💰 첫 납입' });
          }, 500);
        }
      } else if(prevRule){ db.ref(wp('recurring/'+owner+'/'+rid)).remove(); }   // 자동 기록 해제 시 연결 규칙 제거(기록된 거래는 유지)
      toast(prev?'수정되었습니다':'추가되었습니다'); closeSheet();
    }
    function deleteSavings(ownerUid,id){
      const sv=state.savings.find(x=>x.ownerUid===ownerUid&&x.id===id);
      const hasRule=sv&&sv.recurringId&&state.recurring.some(r=>r.ownerUid===ownerUid&&r.id===sv.recurringId);
      confirmSheet('이 적금을 삭제할까요?'+(hasRule?' (자동 기록 정기거래도 함께 삭제되고, 기록된 거래는 유지됩니다)':''), ()=>{
        if(hasRule) db.ref(wp('recurring/'+ownerUid+'/'+sv.recurringId)).remove();
        db.ref(wp('savings/'+ownerUid+'/'+id)).remove(); toast('삭제되었습니다'); });
    }

    // ===== 더보기 =====
    // ===== 오늘 홈(랜딩 대시보드) — 오늘 할 것(미션·할일·가계부 한 줄)을 한 화면에 =====
    function homeMissionRow(o){
      const chk='<button class="tdchk'+(o.done?' on':'')+'" onclick="'+o.onclick+'" aria-label="'+escapeHtml(o.name)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></button>';
      return '<div class="hmrow">'+chk+'<span class="hmname'+(o.done?' done':'')+'">'+escapeHtml(o.name)+'</span>'+
        (o.done?'<span class="hmok">완료</span>':(o.reward?'<span class="hmrw"><span class="ci">'+coinSvg({h:14})+'</span>+'+o.reward+'</span>':''))+'</div>';
    }
    // 오늘 남은 일(로고 배지·홈 완료카드 공용 단일 소스) — util.todayPending에 현재 브라우저 상태를 모아 넘김(새 조회 없음).
    function todayPendingNow(){
      var daily=(typeof dailyMissionsToday==='function')?dailyMissionsToday():((typeof DAILY_MISSIONS!=='undefined')?DAILY_MISSIONS:[]);
      var customs=(typeof customMissionList==='function')?customMissionList():[];
      var flags=daily.map(function(m){return missionClaimed(m);}).concat(customs.map(function(m){return customCheckedToday(m.id);}));
      var todos=(typeof myScopedTodos==='function')?myScopedTodos():[];   // 배지는 항상 '내' 할일(친구 열람 중에도 친구 것 안 셈)
      return todayPending(flags, todos, todayKst());   // 오늘 판정은 KST(할일 마감·은화상한과 동일 경계) — 기기 타임존 달라도 하루 안 밀림
    }
    // 완료 축하 연출은 하루 1회만(renderHome이 재렌더마다 재실행되므로 플래그로 반복 재생 차단). reduced-motion이면 정적.
    function shouldCelebrateOnce(){
      if(typeof reducedMotion==='function' && reducedMotion()) return false;
      var k=todayKst(); if(state._homeDoneCelebrated===k) return false; state._homeDoneCelebrated=k; return true;
    }
    // 🧾 월말 결산 카드(오늘 홈, 매월 1~7일) — 지난달 총지출·수입·전월비·최다 카테고리 요약. 닫으면 그 달은 다시 안 뜸(localStorage recap:{wsId}:{월}).
    function monthlyRecapHtml(){
      try{
        const today=todayKst(); if(+today.slice(8,10)>7) return '';
        const lastM=shiftMonth(today.slice(0,7),-1);
        if(localStorage.getItem('recap:'+(state.wsId||'')+':'+lastM)) return '';
        const list=monthTx(lastM); if(!list.length) return '';
        const actual=actualSpend(list); if(!actual) return '';
        const inc=sumBy(realIncome(list),'income');
        const cd={}; list.filter(t=>isActual(t)&&t.category).forEach(t=>{ cd[t.category]=(cd[t.category]||0)+(Number(t.amount)||0); });
        const top=Object.keys(cd).sort((a,b)=>cd[b]-cd[a])[0]||'';
        const prev=actualSpend(monthTx(shiftMonth(lastM,-1)));
        const mom=prev>0?Math.round((actual-prev)/prev*100):null;
        const p=lastM.split('-');
        return '<div class="card"><div class="row"><b>🧾 '+(+p[1])+'월 결산</b><button class="link" '+App.view.act('dismissRecap',lastM)+' aria-label="결산 카드 닫기">닫기</button></div>'+
          '<div class="statrow" style="margin-top:8px;">'+
            '<div><div class="k">총지출</div><div class="v" style="color:var(--expense)">'+won(actual)+'</div></div>'+
            '<div><div class="k">수입</div><div class="v" style="color:var(--income)">'+won(inc)+'</div></div>'+
            (mom!=null?('<div><div class="k">전월 대비</div><div class="v" style="color:'+(mom>=0?'var(--expense)':'var(--income)')+'">'+(mom>=0?'▲':'▼')+' '+Math.abs(mom)+'%</div></div>'):'')+
          '</div>'+
          (top?('<div class="tx-sub" style="margin-top:6px;">가장 많이 쓴 카테고리: <b>'+escapeHtml(top)+'</b> '+won(cd[top])+'</div>'):'')+
          '<button class="btn ghost" style="margin-top:10px;" '+App.view.act('openRecapReport',lastM)+'>리포트에서 자세히 보기</button></div>';
      }catch(e){ return ''; }
    }
    function dismissRecap(m){ try{ localStorage.setItem('recap:'+(state.wsId||'')+':'+m,'1'); }catch(e){} renderHome(); }
    function openRecapReport(m){ try{ localStorage.setItem('recap:'+(state.wsId||'')+':'+m,'1'); }catch(e){} state.month=m; goto('ledger','stats'); }
    function renderHome(){
      const c=$('content'); if(!c) return;
      const daily=(typeof dailyMissionsToday==='function')?dailyMissionsToday():((typeof DAILY_MISSIONS!=='undefined')?DAILY_MISSIONS:[]);
      const customs=(typeof customMissionList==='function')?customMissionList():[];
      const mrows=daily.map(function(m){ return { name:m.name, reward:m.reward, done:missionClaimed(m), onclick:"homeMissionTap('"+m.id+"')" }; })
        .concat(customs.map(function(m){ return { name:m.title, reward:0, done:customCheckedToday(m.id), onclick:"toggleCustomMissionToday('"+m.id+"')" }; }));
      const st=(typeof todayMissionState==='function')?todayMissionState(mrows.map(function(r){return r.done;})):{done:0,total:mrows.length,pct:0,allDone:false};
      const today=todayKst();
      const dueTop=((typeof myScopedTodos==='function')?myScopedTodos():[]).filter(function(t){ return !t.done && t.dueDate && t.dueDate<=today; })
        .sort(function(a,b){ return (a.dueDate||'').localeCompare(b.dueDate||''); }).slice(0,4);
      const p = todayPending(mrows.map(function(r){return r.done;}), (typeof scopedTodos==='function'?scopedTodos():[]), today);   // 배지·완료카드 공용 판정
      const kind = homeCardKind(p);   // 'sections' | 'done' | 'empty' (순수 결정, util)

      let h='<div class="homewrap">';
      h+=monthlyRecapHtml();   // 🧾 월초(1~7일)엔 지난달 결산 카드(닫기 가능)
      // 인사·미션 요약·지출 카드는 제거(미션은 더보기 '미션'으로 일원화, 지출은 캘린더/자산에서). 오늘 홈 랜딩 자체는 폐지(브랜드=소식).
      if(kind==='done'){
        const cid=(typeof activeCats==='function'&&activeCats()[0])||(typeof ownedCatList==='function'&&ownedCatList()[0])||null;
        const art=cid?('<div class="hd-cat">'+catFace(cid,{h:64})+'</div>'):'<div class="hd-emoji">🐱</div>';
        const celebrate=(typeof shouldCelebrateOnce==='function'&&shouldCelebrateOnce());
        h+='<div class="card homedone'+(celebrate?' celebrate':'')+'">'+art+'<div class="hd-tit">오늘도 알뜰한 하루 보내셨나요!</div>'+
          '<div class="hd-sub">고양이도 만족스러워해요. 내일 또 만나요!</div>'+
          '<button class="btn ghost" '+App.view.act('openCatHouse')+'>알뜰홈 둘러보기</button></div>';
      } else if(kind==='empty'){
        h+='<div class="card homedone empty"><div class="hd-emoji">🌙</div><div class="hd-tit">오늘은 예정된 게 없어요</div>'+
          '<div class="hd-sub">미션이나 할일을 추가해 은화를 모아보세요.</div></div>';
      } else {
        if(dueTop.length){
          h+='<div class="card"><div class="sech" style="margin-top:0;"><span class="l">오늘·임박 할일</span><button class="link" '+App.view.act('goto','todo')+'>전체 보기</button></div>'+
            dueTop.map(function(t){ return todoRow(t,false); }).join('')+'</div>';
        }
      }
      h+='</div>';
      c.innerHTML=h;
    }

    // ===== 워크스페이스(가계부/그룹) 관리 UI =====
    function openWorkspaceSheet(){
      const cur=state.wsId; const personalId='ws_'+state.uid;
      let h='<p class="muted" style="font-size:13px;margin:2px 2px 12px;">나만의 <b>개인 프로필</b>과 <b>그룹</b>을 오가며 써요. 가계부와 할일은 <b>각각 마지막에 쓴 곳</b>을 따로 기억해, 모드를 토글해도 그 그룹/개인 프로필로 바로 이어집니다.</p>';
      // 개인 프로필(항상 존재하는 예약 컨텍스트) — 내 아바타로 표시
      const onP=cur===personalId;
      h+='<div class="menu-group-title">개인</div>';
      h+='<div class="ws-item'+(onP?' on':'')+'">'+
          '<span class="ws-ic">'+avatarHtml(state.uid, state.userName||'', 44)+'</span>'+
          '<div style="flex:1;min-width:0;" '+App.view.act('chooseWorkspace',personalId)+'>'+
            '<div class="ws-name"><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">개인 프로필</span></div>'+
            '<div class="ws-meta">나만 보는 가계부 · 할일</div>'+
          '</div>'+
          (onP?'<span class="ws-ck">'+svgWrap(CAT_SVG.check)+'</span>':'')+
        '</div>';
      // 그룹(코드로 함께 쓰는 워크스페이스만)
      const groups=(state.memberships||[]).filter(w=>w.type==='group');
      h+='<div class="menu-group-title">내 그룹</div>';
      if(!groups.length) h+='<p class="muted" style="font-size:12.5px;margin:2px 2px 6px;">아직 그룹이 없어요. 그룹을 만들거나 코드로 참여해 보세요.</p>';
      groups.forEach(w=>{
        const on=w.id===cur, memCount=Object.keys(w.members||{}).length;
        h+='<div class="ws-item'+(on?' on':'')+'">'+
            '<span class="ws-ic">'+wsAvatarHtml(w.name, w.photo, 44)+'</span>'+
            '<div style="flex:1;min-width:0;" '+App.view.act('chooseWorkspace',w.id)+'>'+
              '<div class="ws-name" style="display:flex;align-items:center;gap:8px;"><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+escapeHtml(w.name||'가계부')+'</span>'+memberAvatarStack(w,20)+'</div>'+
              '<div class="ws-meta">그룹 · 멤버 '+memCount+'명</div>'+
            '</div>'+
            '<button class="btn sm ghost" '+App.view.act('openGroupManageSheet',w.id)+'>관리</button>'+
            (on?'<span class="ws-ck">'+svgWrap(CAT_SVG.check)+'</span>':'')+
          '</div>';
      });
      h+='<div class="form-2" style="margin-top:14px;">'+
          '<button class="btn" '+App.view.act('openCreateGroupSheet')+'>+ 그룹 만들기</button>'+
          '<button class="btn ghost" '+App.view.act('openJoinGroupSheet')+'>코드로 참여</button>'+
         '</div>';
      openSheet('그룹 전환', h);
    }
    function chooseWorkspace(id){ closeSheet(); if(id!==state.wsId) switchWorkspace(id); }
    function openCreateGroupSheet(){
      openSheet('그룹 만들기',
        '<div class="field"><label>그룹 이름</label><input class="input" id="grpName" placeholder="예: 우리집 가계부"></div>'+
        '<p class="muted" style="font-size:13px;margin:0 2px 12px;">만들면 6자리 초대 코드가 생겨요. 코드를 공유한 사람만 이 그룹에 들어올 수 있어요.</p>'+
        '<button class="btn" '+App.view.act('doCreateGroup')+'>만들기</button>');
    }
    async function doCreateGroup(){
      try{
        const name=val('grpName').trim()||'우리 가계부';
        const r=await createGroupWorkspace(name);
        await loadMyWorkspaces();
        openSheet('그룹 생성 완료',
          '<p style="font-size:14px;margin:2px 2px 8px;">"'+escapeHtml(name)+'" 그룹을 만들었어요. 아래 코드를 친구에게 공유하세요.</p>'+
          '<div class="code-box"><span>'+r.code+'</span><button class="btn sm" '+App.view.act('copyText',r.code)+'>복사</button></div>'+
          '<button class="btn" '+App.view.act('chooseWorkspace',r.wsId)+'>이 그룹으로 전환</button>');
      }catch(e){ toast(e.message||'그룹 생성 실패', true); }
    }
    function openJoinGroupSheet(){
      openSheet('코드로 그룹 참여',
        '<div class="field"><label>그룹 코드 6자리</label><input class="input" id="joinCode" placeholder="ABC123" maxlength="6" style="text-transform:uppercase;letter-spacing:3px;font-weight:800;"></div>'+
        '<button class="btn" '+App.view.act('doJoin')+'>참여하기</button>');
    }
    async function doJoin(){ try{ const ok=await joinByCode(val('joinCode')); if(ok) closeSheet(); }catch(e){ toast(e.message||'참여 실패', true); } }
    function openGroupManageSheet(wsId){
      const w=(state.memberships||[]).find(x=>x.id===wsId); if(!w) return;
      const members=w.members||{}, isOwner=w.ownerUid===state.uid;
      // 그룹 이름 (소유자는 수정 가능)
      let h = isOwner
        ? '<div class="field"><label>그룹 이름</label><div style="display:flex;gap:8px;"><input class="input" id="grpRename" value="'+escapeHtml(w.name||'')+'"><button class="btn sm" '+App.view.act('doRenameWs',wsId)+'>저장</button></div></div>'
        : '<div class="field"><label>그룹 이름</label><div style="font-weight:700;font-size:16px;padding:4px 2px;">'+escapeHtml(w.name||'')+'</div></div>';
      h+='<label style="font-size:13px;font-weight:700;color:var(--sub);">초대 코드</label>';
      h+='<div class="code-box"><span>'+(w.code||'------')+'</span><button class="btn sm" '+App.view.act('copyText',w.code||'')+'>복사</button></div>';
      h+='<label style="font-size:13px;font-weight:700;color:var(--sub);">멤버 '+Object.keys(members).length+'명</label>';
      h+='<div class="card" style="padding:6px 10px;margin:8px 0 4px;">';
      Object.keys(members).forEach(uid=>{
        const m=members[uid], self=uid===state.uid, isMemOwner=m.role==='owner';
        const crown=isMemOwner?' <span class="owncrown">'+(typeof crownSvg==='function'?crownSvg({h:12}):'👑')+'</span>':'';
        h+='<div class="tx" role="button" tabindex="0" style="cursor:pointer;" '+App.view.act('openFriendHome',uid)+'>'+avatarHtml(uid, m.name, 38)+
          '<div class="tx-main"><div class="tx-title">'+escapeHtml(m.name||'멤버')+crown+(self?' (나)':'')+'</div><div class="tx-sub">'+(isMemOwner?'소유자':'멤버')+' · 눌러서 방문</div></div>';
        if(isOwner && !self && !isMemOwner){
          h+='<span style="display:flex;gap:6px;" onclick="event.stopPropagation()"><button class="chip" onclick="event.stopPropagation();doTransferOwner(\''+wsId+'\',\''+uid+'\')">소유자 지정</button>'+
             '<button class="chip" onclick="event.stopPropagation();doRemoveMember(\''+wsId+'\',\''+uid+'\')">내보내기</button></span>';
        }
        h+='</div>';
      });
      h+='</div>';
      if(isOwner) h+='<div class="tx-sub" style="margin:2px 2px 8px;">소유자만 이름 변경·멤버 내보내기·소유자 지정을 할 수 있어요(앱 내 제한).</div>';
      h+='<button class="btn danger" style="margin-top:12px;" '+App.view.act('confirmLeave',wsId)+'>그룹 나가기</button>';
      openSheet('그룹 관리', h);
    }
    function memberName(wsId, uid){ const w=(state.memberships||[]).find(x=>x.id===wsId); return (w&&w.members&&w.members[uid]&&w.members[uid].name)||'멤버'; }
    function doRenameWs(wsId){ const n=val('grpRename').trim(); if(!n){ toast('이름을 입력하세요', true); return; } renameWorkspace(wsId, n).then(()=>openGroupManageSheet(wsId)); }
    function doTransferOwner(wsId, uid){ confirmSheet('"'+memberName(wsId,uid)+'"님에게 소유자를 넘길까요? 넘기면 나는 일반 멤버가 됩니다.', ()=>{ transferOwnership(wsId, uid).then(()=>openGroupManageSheet(wsId)); }, {title:'소유자 넘기기', okLabel:'넘기기'}); }
    function doRemoveMember(wsId, uid){ confirmSheet('"'+memberName(wsId,uid)+'"님을 그룹에서 내보낼까요? 이 그룹에 더 이상 접근할 수 없게 됩니다.', ()=>{ removeMember(wsId, uid).then(()=>openGroupManageSheet(wsId)); }, {title:'멤버 내보내기', okLabel:'내보내기', danger:true}); }
    function confirmLeave(wsId){
      const w=(state.memberships||[]).find(x=>x.id===wsId);
      const last=w && Object.keys(w.members||{}).length<=1;
      confirmSheet(last?'마지막 멤버예요. 나가면 이 그룹의 데이터가 모두 삭제됩니다. 계속할까요?':'이 그룹에서 나갈까요? (이 그룹 데이터에 더 이상 접근할 수 없어요)', ()=>leaveWorkspace(wsId), {title:'그룹 나가기', okLabel:'나가기', danger:true});
    }
    function copyText(t){ if(navigator.clipboard && t){ navigator.clipboard.writeText(t).then(()=>toast('복사했어요')).catch(()=>toast(t)); } else toast(t||''); }

    // ===== 프로필(사진/이름) =====
    // 아바타: 사진 있으면 <img>, 없으면 이니셜 폴백. photoOverride 주면 캐시 대신 그 값 사용(미리보기용)
    function avatarHtml(uid, name, size, photoOverride){
      size=size||38;
      const photo = photoOverride!==undefined ? photoOverride : (state.userPhotos&&state.userPhotos[uid]);
      if(photo) return '<img class="avatar" src="'+photo+'" alt="" style="width:'+size+'px;height:'+size+'px;">';
      // 기본(사진 없음) 아바타 = 은화 픽셀 아이콘(전역 통일)
      return '<div class="avatar avatar-coin" style="width:'+size+'px;height:'+size+'px;">'+(typeof coinSvg==='function'?coinSvg({h:Math.round(size*0.72)}):'')+'</div>';
    }
    // 파일 → 중앙 정사각 크롭 → size px JPEG data URL
    function resizeImageFile(file, size, cb){
      const r=new FileReader();
      r.onload=()=>{ const img=new Image();
        img.onload=()=>{ const c=document.createElement('canvas'); c.width=c.height=size; const ctx=c.getContext('2d');
          const s=Math.min(img.width,img.height), sx=(img.width-s)/2, sy=(img.height-s)/2;
          ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
          try{ cb(c.toDataURL('image/jpeg', 0.8)); }catch(e){ toast('이미지 처리 실패', true); } };
        img.onerror=()=>toast('이미지를 읽을 수 없어요', true); img.src=r.result; };
      r.onerror=()=>toast('파일을 읽을 수 없어요', true);
      r.readAsDataURL(file);
    }
    // 그룹 멤버 아바타 겹침 나열(최대 5, 초과 시 +N). 탭하면 멤버 목록 시트(→프로필 방문).
    function memberAvatarStack(ws, size){
      const m=(ws&&ws.members)||{}; const uids=Object.keys(m); if(!uids.length) return '';
      const wid=(ws&&ws.id)||''; const max=5;
      let h='<button type="button" class="mstack" onclick="event.stopPropagation();openWsMembersSheet(\''+wid+'\')" aria-label="멤버 보기">';
      uids.slice(0,max).forEach(uid=>{ h+='<span class="ms-av">'+avatarHtml(uid, m[uid]&&m[uid].name, size||26)+'</span>'; });
      if(uids.length>max) h+='<span class="ms-more">+'+(uids.length-max)+'</span>';
      return h+'</button>';
    }
    // 그룹 멤버 목록 시트 — 각 멤버 탭 시 그 사용자 집(펫캠) 방문(openFriendHome).
    function openWsMembersSheet(wsId){
      const w=(state.memberships||[]).find(x=>x.id===wsId) || ((state.wsMeta&&state.wsMeta.id===wsId)?state.wsMeta:null);
      if(!w){ toast('가계부를 찾을 수 없어요', true); return; }
      const members=w.members||{}, uids=Object.keys(members);
      let h='<p class="muted" style="font-size:12.5px;margin:2px 2px 10px;">멤버를 눌러 집(펫캠)을 방문할 수 있어요.</p><div class="card" style="padding:6px 10px;">';
      if(!uids.length) h+='<div class="empty" style="padding:20px 6px;">멤버가 없어요</div>';
      else h+=uids.map(function(uid){ const m=members[uid], self=uid===state.uid, isOwner=m.role==='owner';
        const crown=isOwner?' <span class="owncrown">'+(typeof crownSvg==='function'?crownSvg({h:12}):'👑')+'</span>':'';
        return '<div class="tx" role="button" tabindex="0" style="cursor:pointer;" '+App.view.act('openFriendHome',uid)+'>'+avatarHtml(uid, m.name, 38)+
          '<div class="tx-main"><div class="tx-title">'+escapeHtml(m.name||'멤버')+crown+(self?' (나)':'')+'</div><div class="tx-sub">'+(isOwner?'소유자':'멤버')+'</div></div>'+
          '<span class="chev">'+MORE_ICON.chev+'</span></div>'; }).join('');
      h+='</div>';
      openSheet((w.name||'그룹')+' 멤버', h);
    }
    function openProfileSheet(){
      window._profilePhoto=undefined;   // undefined=유지 / ''=삭제 / dataURL=신규
      let h='<div style="text-align:center;margin:6px 0 16px;">'+
        '<div id="profAvatar" style="display:inline-flex;">'+avatarHtml(state.uid, state.userName, 96)+'</div>'+
        '<div style="margin-top:12px;display:flex;gap:8px;justify-content:center;">'+
          '<button class="btn sm" '+App.view.act('pickProfilePhoto')+'>사진 변경</button>'+
          '<button class="btn sm ghost" '+App.view.act('removeProfilePhoto')+'>사진 삭제</button></div>'+
        '<div class="likemini" style="justify-content:center;margin-top:10px;font-size:14px;gap:6px;" title="친구들에게 받은 좋아요">'+(typeof heartSvg==='function'?heartSvg({h:16}):'❤')+(state.myLikeCount||0)+'</div></div>';
      h+='<div class="field"><label>별명(이름)</label><input class="input" id="profName" value="'+escapeHtml(state.userName)+'" placeholder="가계부에 표시될 이름"></div>';
      h+='<div class="field"><label>계정 이메일(아이디)</label><input class="input" value="'+escapeHtml(state.userEmail||'')+'" disabled></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>프로필 공개</span><div class="switch '+(state.profilePublic!==false?'on':'')+'" id="profPublic" '+App.view.act('toggleSwitch')+'><i></i></div></div>';
      h+='<div class="tx-sub" style="margin:2px 2px 14px;">사진은 256px로 줄여 저장돼요. <b>비공개</b>로 하면 랭킹·비친구에게 <b>은화 아이콘 + \'알뜰\'</b>로만 보여요(친구·좋아요·캠은 그대로).</div>';
      h+='<button class="btn" '+App.view.act('onSaveProfile')+'>저장</button>';
      h+='<button class="btn ghost" style="margin-top:8px;" '+App.view.act('openPasswordChangeSheet')+'>비밀번호 변경</button>';
      openSheet('내 프로필', h);
    }
    function pickProfilePhoto(){
      const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*';
      inp.onchange=()=>{ const f=inp.files&&inp.files[0]; if(!f) return;
        resizeImageFile(f, 256, durl=>{ window._profilePhoto=durl; const a=$('profAvatar'); if(a) a.innerHTML='<img class="avatar" src="'+durl+'" alt="" style="width:96px;height:96px;">'; }); };
      inp.click();
    }
    function removeProfilePhoto(){ window._profilePhoto=''; const a=$('profAvatar'); if(a) a.innerHTML=avatarHtml(state.uid, state.userName, 96, ''); }
    function onSaveProfile(){ const name=val('profName').trim(); if(!name){ toast('이름을 입력하세요', true); return; }
      const pub=$('profPublic')?$('profPublic').classList.contains('on'):true;
      saveProfile(name, window._profilePhoto, pub); toast('프로필을 저장했어요'); closeSheet(); }
    // 비밀번호 변경 시트(내 프로필 → 비밀번호 변경). 실제 변경 로직은 core.js changePassword().
    function openPasswordChangeSheet(){
      let h='<div class="field"><label>현재 비밀번호</label><input class="input" id="pwCur" type="password" autocomplete="current-password" placeholder="현재 비밀번호"></div>';
      h+='<div class="field"><label>새 비밀번호</label><input class="input" id="pwNew" type="password" autocomplete="new-password" placeholder="6자 이상"></div>';
      h+='<div class="field"><label>새 비밀번호 확인</label><input class="input" id="pwNew2" type="password" autocomplete="new-password" placeholder="다시 입력"></div>';
      h+='<button class="btn" '+App.view.act('changePassword')+'>변경</button>';
      openSheet('비밀번호 변경', h);
    }

    // ===== 가계부(워크스페이스) 프로필: 이름 + 사진 =====
    // 사진 있으면 <img>, 없으면 기본=금화 픽셀 아이콘(그룹/가계부). photoOverride: 미리보기용
    function wsAvatarHtml(name, photo, size, photoOverride){
      size=size||52;
      const p = photoOverride!==undefined ? photoOverride : photo;
      if(p) return '<img class="avatar" src="'+p+'" alt="" style="width:'+size+'px;height:'+size+'px;">';
      return '<div class="avatar avatar-gold" style="width:'+size+'px;height:'+size+'px;">'+(typeof goldSvg==='function'?goldSvg({h:Math.round(size*0.72)}):'')+'</div>';
    }
    function openWsProfileSheet(){
      const ws=state.wsMeta||{}, isGroup=ws.type==='group';
      if(isGroup && !isWsOwner()){ toast('그룹 이름·사진은 소유자만 변경할 수 있어요', true); return; }
      window._wsPhoto=undefined;   // undefined=유지 / ''=삭제 / dataURL=신규
      let h='<div style="text-align:center;margin:6px 0 16px;">'+
        '<div id="wsAvatar" style="display:inline-flex;">'+wsAvatarHtml(ws.name, ws.photo, 96)+'</div>'+
        '<div style="margin-top:12px;display:flex;gap:8px;justify-content:center;">'+
          '<button class="btn sm" '+App.view.act('pickWsPhoto')+'>사진 변경</button>'+
          '<button class="btn sm ghost" '+App.view.act('removeWsPhoto')+'>사진 삭제</button></div></div>';
      h+='<div class="field"><label>가계부 이름</label><input class="input" id="wsName" value="'+escapeHtml(ws.name||'')+'" placeholder="예: 우리집 가계부"></div>';
      h+='<div class="tx-sub" style="margin:2px 2px 14px;">사진은 256px로 줄여 저장돼요.'+(isGroup?' 그룹 멤버 모두에게 보입니다.':'')+'</div>';
      h+='<button class="btn" '+App.view.act('onSaveWsProfile')+'>저장</button>';
      openSheet('가계부 프로필', h);
    }
    function pickWsPhoto(){
      const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*';
      inp.onchange=()=>{ const f=inp.files&&inp.files[0]; if(!f) return;
        resizeImageFile(f, 256, durl=>{ window._wsPhoto=durl; const a=$('wsAvatar'); if(a) a.innerHTML='<img class="avatar" src="'+durl+'" alt="" style="width:96px;height:96px;">'; }); };
      inp.click();
    }
    function removeWsPhoto(){ window._wsPhoto=''; const a=$('wsAvatar'); if(a) a.innerHTML=wsAvatarHtml((state.wsMeta||{}).name, '', 96, ''); }
    function onSaveWsProfile(){ const name=val('wsName').trim(); if(!name){ toast('이름을 입력하세요', true); return; } saveWsProfile(name, window._wsPhoto); toast('가계부 프로필을 저장했어요'); closeSheet(); }

    // ===== 권한 / 공동 설정 =====
    // (제거됨) '권한 · 공동 설정' 화면 openSharedSettings/onDefVisChange/onDefOwnerChange/collectPrivateItems/makeItemPublic/makeAllPublic
    //  → 저가치·중복(멤버·권한 관리와 겹침)이라 삭제. 항목별 공개범위/소유자 선택과 기본값 폴백(core.js defaultVisibility 등)은 그대로 유지.

    // 더보기 화면 시안 SVG 아이콘(라인). 텍스트 라벨이 있어 장식용.
    const MORE_ICON={
      budget:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 13a9 9 0 1 1 18 0" stroke-linecap="round"/><path d="M12 13l4-3" stroke-linecap="round"/></svg>',
      sub:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2"/><path d="M18 4v5h-5M6 20v-5h5"/></svg>',
      recurring:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke-linecap="round"/></svg>',
      pb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16v13H4z"/><path d="M4 7l2-3h5l2 3"/></svg>',
      settle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7h8M9 12h8M9 17h5"/><circle cx="5" cy="7" r="1.4"/><circle cx="5" cy="12" r="1.4"/><circle cx="5" cy="17" r="1.4"/></svg>',
      gift:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M4 13h16M12 9v11M12 9C9 9 8 4 12 4s3 5 0 5z"/></svg>',
      loan:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-6 9 6M5 10v9h14v-9M3 19h18"/></svg>',
      category:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/></svg>',
      members:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11a3 3 0 1 0 6 0 3 3 0 0 0-6 0z"/><path d="M5 20c0-3 3-5 7-5s7 2 7 5"/><circle cx="18" cy="7" r="3"/></svg>',
      lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V8a5 5 0 0 1 10 0v3"/></svg>',
      list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
      download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 11l4 4 4-4M5 21h14"/></svg>',
      moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
      logout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 17l5-5-5-5M20 12H9M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3"/></svg>',
      gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
      chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>',
      cat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4l2 4M19 4l-2 4"/><path d="M5 8c-1 2-1 5 0 7 1.6 3 4 4 7 4s5.4-1 7-4c1-2 1-5 0-7"/><path d="M9.5 12h.01M14.5 12h.01M12 14l-1 1h2z"/></svg>',
      cam:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 10.5l6-3v9l-6-3z"/></svg>',
      share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.3M8.3 13.2l7.4 4.3"/></svg>',
      report:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M8 16v-4M12 16V8M16 16v-6"/></svg>',
      repeat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 14-5l2 2M20 12a8 8 0 0 1-14 5l-2-2"/><path d="M18 4v5h-5M6 20v-5h5"/></svg>'
    };
    function gcell(icon,label,fn,badge){ return '<button class="gcell" onclick="'+fn+'"><span class="gic">'+icon+(badge?'<span class="gbadge">'+badge+'</span>':'')+'</span><span class="glabel">'+escapeHtml(label)+'</span></button>'; }
    function lrow(icon,label,fn,val){ return '<button class="lrow" onclick="'+fn+'"><span class="li">'+icon+'</span><span class="lt">'+label+'</span><span class="lv">'+(val||'')+'</span><span class="chev">'+MORE_ICON.chev+'</span></button>'; }
    // 켜기/끄기 토글 행 — 오른쪽에 스위치(꺼짐/켜짐 텍스트 대신 직관적 on/off). 스위치 탭 시 fn 실행(토글+재렌더). val(선택)=스위치 옆 보조 텍스트(예: 알림 '차단됨').
    function lrowToggle(icon,label,fn,on,val){ return '<div class="lrow lrow-tog"><span class="li">'+icon+'</span><span class="lt">'+label+'</span>'+(val?'<span class="lv">'+val+'</span>':'')+'<div class="switch'+(on?' on':'')+'" onclick="'+fn+'"><i></i></div></div>'; }
    function renderMore(){
      const ws=state.wsMeta||{}; const isGroup=ws.type==='group'; const memCount=Object.keys(ws.members||{}).length;
      let h='<div class="more-wrap">';
      // 상단: 내 프로필 — 아바타 44 + 이름(flex) + 받은 좋아요 + (개인이면 전환 버튼) + 편집 chevron(우측)
      // 개인 사용자는 프로필=워크스페이스라 아래 컨텍스트 행이 얼굴 아바타를 중복 표시했다 → 전환 버튼만 이 행으로 올리고 둘째 줄은 생략(그룹만 별도 행). 버튼은 행 전체 openProfileSheet와 안 겹치게 stopPropagation.
      const switchBtn = isGroup ? '' : '<button class="cnt" '+App.view.act('openWorkspaceSheet')+'>전환</button>';
      h+='<div class="prow" '+App.view.act('openProfileSheet')+'>'+
         avatarHtml(state.uid, state.userName, 44)+
         '<div class="pnm"><b>'+escapeHtml(state.userName||'사용자')+'</b><span>내 프로필</span></div>'+
         '<span class="likemini" title="받은 좋아요">'+(typeof heartSvg==='function'?heartSvg({h:14}):'❤')+' '+(state.myLikeCount||0)+'</span>'+
         switchBtn+
         '<span class="editk">'+MORE_ICON.chev+'</span></div>';
      // 그 아래: 현재 컨텍스트 — 그룹일 때만(그룹 사진·이름·멤버, 소유자만 편집). 개인은 위 프로필 행에 전환 버튼만.
      if(isGroup){
        const canEditWs = isWsOwner();
        h+='<div class="grow"'+(canEditWs?' '+App.view.act('openWsProfileSheet'):'')+'>'+
           wsAvatarHtml(ws.name, ws.photo, 44)+
           '<div class="gnm"><b>'+escapeHtml(ws.name||'가계부')+'</b><span>'+('그룹 · 멤버 '+memCount+'명')+'</span></div>'+
           memberAvatarStack(ws, 26)+
           '<button class="cnt" '+App.view.act('openWorkspaceSheet')+'>전환</button></div>';
      }
      // 4열 기능 그리드 — 할일 모드면 할일 전용, 아니면 가계부 전용(알뜰홈·설정은 공용)
      h+='<div class="grid4">';
      // 기본 메뉴 아이콘은 라인 SVG(MORE_ICON) 유지. 알뜰홈=메인 앱아이콘·알뜰샵=상점(은화기반 픽셀)·선물함=선물상자·가방=갈색 가방(픽셀 아트).
      if(state.mode==='todo'){
        h+=gcell(MORE_ICON.share,'할일 공유','openTodoShareSheet()');
        h+=gcell(MORE_ICON.report,'완료 리포트','openTodoReport()');
        h+=gcell(MORE_ICON.repeat,'반복 할일','openRepeatTodos()');
        h+=gcell(MORE_ICON.category,'카테고리','openTodoCatSheet()');
        h+=gcell('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>','할일 템플릿','openTodoTpls()');
        // 목적별(가계부)은 할일 모드 더보기에서 숨김 — 가계부 모드에서만 노출
      } else {
        const activeSubs=(state.subscriptions||[]).filter(s=>s.status==='active').length;
        h+=gcell(MORE_ICON.budget,'예산','openBudgetSheet()');
        h+=gcell(MORE_ICON.sub,'구독','openSubscriptions()', activeSubs||0);
        h+=gcell(MORE_ICON.recurring,'정기결제','openRecurringList()');
        h+=gcell(MORE_ICON.pb,'목적별','openPurposeBooks()');
        h+=gcell(MORE_ICON.settle,'정산','openSettlementOverview()');
        h+=gcell(MORE_ICON.gift,'경조사비','openGiftBook()');
        h+=gcell(MORE_ICON.loan,'대출/이자','openLoanBook()');
        h+=gcell(MORE_ICON.category,'카테고리','openCategorySheet()');
        h+=gcell('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>','거래 검색','openTxSearch()');
      }
      h+='</div>';   // 모드 전용 그리드 닫기
      // 공통(모드 무관) 아이콘 — 가운데 '공통' 라벨 구분선으로 분리
      h+='<div class="gsep"><span>공통</span></div>';
      h+='<div class="grid4">';
      h+=gcell('<img class="gic-app" src="icons/icon.svg" alt="">','알뜰홈','openCatHouse()');
      h+=gcell((typeof shopSvg==='function'?shopSvg({h:26}):'🏪'),'알뜰샵','openShop()');
      h+=gcell((typeof bellSvg==='function'?bellSvg({h:26}):'🔔'),'소식','openNews()', (typeof newsMoreCount==='function'?newsMoreCount():0));   // 선물 제외: 안 쓴 쿠폰+안 본 공지만(선물은 선물함 셀에)
      h+=gcell((typeof missionSvg==='function'?missionSvg({h:26}):'📋'),'미션','openMissions()');
      h+=gcell((typeof dexSvg==='function'?dexSvg({h:26}):'📖'),'도감','openPetDex()');
      h+=gcell(giftSvg({h:26}),'선물함','openGiftbox()', (typeof giftUnread==='function'?giftUnread():0));
      h+=gcell((typeof bagSvg==='function'?bagSvg({h:26}):''),'가방','openBag()');
      h+=gcell((typeof peopleSvg==='function'?peopleSvg({h:26}):MORE_ICON.members),'친구','openFriendsSheet()', (typeof state.friendReqs==='object'?Object.keys(state.friendReqs||{}).length:0)||0);
      h+=gcell((typeof trophySvg==='function'?trophySvg({h:26}):'🏆'),'랭킹','openRanking()');
      h+=gcell((typeof gearSvg==='function'?gearSvg({h:26}):MORE_ICON.gear),'설정','openSettingsSheet()');
      if(typeof isDev==='function' && isDev()) h+=gcell((typeof rainbowEggSvg==='function'?rainbowEggSvg({h:26}):MORE_ICON.gear),'개발자','openDevModeSheet()');
      h+='</div>';
      // 하단 고정: 로그아웃(가운데) → 홈 화면 설치 링크 → 버전
      h+='<div class="more-foot">';
      h+='<button class="btn ghost sm" '+App.view.act('logout')+'>로그아웃</button>';
      // 설치 안 됐으면 항상 노출(iOS 사파리 포함) — 탭 시 크롬=네이티브 프롬프트, iOS/그외=수동 안내 시트
      if(canInstallApp()) h+='<button class="install-cta" '+App.view.act('installApp')+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 11l4 4 4-4"/><path d="M5 21h14"/></svg>홈 화면에 앱 설치</button>';
      h+='<p class="muted" style="font-size:12px;margin-top:10px;">알뜰 v3</p>';
      h+='</div></div>';   // .more-foot / .more-wrap
      $('content').innerHTML=h;
    }
    // 앱 설치 안내(수동) — iOS 사파리는 beforeinstallprompt가 없어 '홈 화면에 추가'를 직접 안내. 그 외 브라우저도 폴백.
    function openInstallGuide(){
      const ios=isIOS();
      const share='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M8.5 7.5 12 4l3.5 3.5"/><path d="M6 12v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-6"/></svg>';
      const plus='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/></svg>';
      const check='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>';
      let steps;
      if(ios){
        steps='<ol class="inst-steps">'+
          '<li><span class="inst-ic">'+share+'</span>사파리 메뉴의 <b>공유</b> 버튼을 탭</li>'+
          '<li><span class="inst-ic">'+plus+'</span>목록에서 <b>홈 화면에 추가</b> 선택</li>'+
          '<li><span class="inst-ic">'+check+'</span>오른쪽 위 <b>추가</b>를 탭하면 끝!</li>'+
          '</ol><div class="install-banner" style="margin-top:14px;">ℹ️ iPhone·iPad는 <b>사파리</b>에서만 홈 화면 추가가 가능해요(크롬 등 다른 앱은 지원 안 함).</div>';
      } else {
        steps='<ol class="inst-steps">'+
          '<li><span class="inst-ic">'+share+'</span>브라우저 <b>메뉴</b>(⋮ 또는 공유)를 열기</li>'+
          '<li><span class="inst-ic">'+plus+'</span><b>앱 설치</b> 또는 <b>홈 화면에 추가</b> 선택</li>'+
          '<li><span class="inst-ic">'+check+'</span>설치를 확인하면 끝!</li></ol>';
      }
      const h='<div class="inst-hero"><img src="icons/icon-192.png" alt="" width="60" height="60" class="inst-app-ic"><div><div class="inst-title">알뜰을 홈 화면에</div><div class="inst-sub">앱처럼 전체화면으로 더 빠르게 실행돼요</div></div></div>'+
        steps+'<button class="btn" '+App.view.act('closeSheet')+' style="margin-top:16px;">확인</button>';
      openSheet('앱 설치', h);
    }
    // 설정 시트 — 더보기 하단 설정 항목 모음 + 코드 입력
    function openSettingsSheet(){
      const ws=state.wsMeta||{}, isGroup=ws.type==='group', memCount=Object.keys(ws.members||{}).length;
      let h='<div class="lst">';
      if(isGroup) h+=lrow(MORE_ICON.members,'멤버 · 권한 관리',"openGroupManageSheet('"+state.wsId+"')", memCount+'명');
      h+=lrow(MORE_ICON.download,'CSV 내보내기','exportCSV()');
      h+=lrow(MORE_ICON.download,'데이터 백업(JSON)','exportBackup()','전체');
      h+=lrow('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17V6M8 10l4-4 4 4"/><path d="M5 21h14"/></svg>','백업 복원','importBackup()');
      h+=lrowToggle(MORE_ICON.moon,'다크 모드','toggleTheme();openSettingsSheet()', state.theme==='dark');
      // 📅 달력 시작 요일 — 월요일 시작(월화수…일) ↔ 일요일 시작(일월화…토). 가계부·할일 캘린더 공용(기기 설정).
      h+=lrow('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9h18M8 2.5v4M16 2.5v4"/></svg>','달력 시작 요일','toggleWeekStart();openSettingsSheet()', weekStartSun()?'일요일':'월요일');
      h+=lrowToggle(MORE_ICON.cam,'펫캠','toggleDockHidden();openSettingsSheet()', (typeof dockMode==='function'&&dockMode()!=='hidden'));
      // 🖥️ 펫캠 PiP 방식(비디오/창) — 지원 브라우저에서만 노출(iOS·미지원 환경엔 행 자체가 없음), 기본=비디오
      if(typeof pipSupported==='function' && pipSupported())
        h+=lrow((typeof pipSvg==='function'?pipSvg({h:22}):MORE_ICON.cam),'펫캠 PiP 방식','openPipModeSheet()', (typeof pipModeLabel==='function'?pipModeLabel():''));
      h+=lrowToggle('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="16" height="10" rx="2"/><path d="M18 10.5v3"/><path d="M22 10.5v3"/></svg>','가벼운 모드','setLiteMode(!(typeof liteMode===\'function\'&&liteMode()));openSettingsSheet()', (typeof liteMode==='function'&&liteMode()), '저사양 폰 · 애니메이션 최소화(배터리·발열 절약)');
      if(typeof pushState==='function' && pushState()!=='unsupported'){   // 🔔 알림(FCM 설정된 지원 기기에서만 노출)
        const _ps=pushState();   // 차단/미지원 상태는 스위치 옆에 사유 텍스트로 안내
        h+=lrowToggle((typeof bellSvg==='function'?bellSvg({h:22}):'🔔'),'알림','togglePush()', _ps==='on', _ps==='denied'?'차단됨(브라우저 설정)':''); }
      // 📊 확률 안내 — 모든 뽑기(펫알·랜덤박스·뜰알·무지개) 등급별 확률 고지(배너에선 미표기, 여기서 일괄 공시)
      h+=lrow('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>','확률 안내','closeSheet();openProbInfoSheet()');
      // 🔄 앱 업데이트 확인 — 자동 갱신이 어긋났을 때의 수동 탈출구(브라우저 캐시 삭제 대체). 새 버전 있으면 설치→자동 새로고침(main.js checkAppUpdate).
      if(typeof checkAppUpdate==='function')
        h+=lrow('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 3v6h-6"/></svg>','앱 업데이트 확인','checkAppUpdate()');
      h+='</div>';
      // 코드 입력(프로모/치트 코드)
      h+='<div class="sec-title" style="margin-top:22px;">코드 입력</div>';
      h+='<div class="card" style="padding:14px;"><div class="row" style="gap:8px;">'+
         '<input class="input" id="promoCode" placeholder="코드를 입력하세요" autocomplete="off" autocapitalize="off" spellcheck="false" style="flex:1;" onkeydown="if(event.key===\'Enter\'){event.preventDefault();submitPromoCode();}">'+
         '<button class="btn sm" style="flex:none;" '+App.view.act('submitPromoCode')+'>확인</button></div></div>';
      openSheet('설정', h);
    }
    function submitPromoCode(){ const el=$('promoCode'); if(!el) return; redeemCode(el.value); el.value=''; }
    // 🖥️ 펫캠 PiP 방식 선택 시트 — 🎬 비디오(기본·유튜브식 깔끔) / 🪟 창(DOM 완전 미러·상단바 표시). 미지원 방식은 흐리게 + 선택 시 setPipModeChoice가 토스트로 안내.
    function openPipModeSheet(){
      const cur=(typeof pipMode==='function')?pipMode():'video';
      const canVid=(typeof vpipSupported==='function')&&vpipSupported(), canDoc=(typeof docPipSupported==='function')&&docPipSupported();
      let h='<p class="muted" style="font-size:12.5px;margin:2px 2px 12px;">펫캠 미니 창(PiP)을 어떤 방식으로 띄울지 선택해요.</p>';
      h+='<div class="who-select" style="grid-template-columns:1fr;">';
      h+='<button class="who-btn'+(cur==='video'?' on':'')+'" style="text-align:left;'+(canVid?'':'opacity:.45;')+'" onclick="setPipModeChoice(\'video\');openPipModeSheet()">🎬 비디오 방식 <b style="font-weight:800;">'+(cur==='video'?'· 사용 중':'')+'</b>'+
        '<span class="muted" style="display:block;font-size:12px;font-weight:600;margin-top:4px;line-height:1.5;">유튜브처럼 깔끔 — 평소엔 화면만 보이고 마우스를 올려야 컨트롤이 나타나요'+(canVid?'':' · 이 브라우저 미지원')+'</span></button>';
      h+='<button class="who-btn'+(cur==='doc'?' on':'')+'" style="text-align:left;'+(canDoc?'':'opacity:.45;')+'" onclick="setPipModeChoice(\'doc\');openPipModeSheet()">🪟 창 방식 <b style="font-weight:800;">'+(cur==='doc'?'· 사용 중':'')+'</b>'+
        '<span class="muted" style="display:block;font-size:12px;font-weight:600;margin-top:4px;line-height:1.5;">방 화면을 그대로 미러(펫이 가구에 앉는 상호작용까지 100%) — 창 상단에 주소·닫기 바가 항상 보여요'+(canDoc?'':' · 이 브라우저 미지원')+'</span></button>';
      h+='</div><button class="btn ghost" '+App.view.act('openSettingsSheet')+' style="margin-top:14px;">설정으로 돌아가기</button>';
      openSheet('펫캠 PiP 방식', h);
    }
    // 개발자 모드 시트 — 더보기 그리드의 무지개알 타일에서 진입(개발자 이메일 전용). 토글 + 하위 기능.
    function openDevModeSheet(){
      if(!(typeof isDev==='function' && isDev())){ toast('개발자 전용'); return; }
      let h='<div class="lst">';
      h+=lrow(MORE_ICON.gear,'개발자 모드','toggleDevMode();openDevModeSheet()', devOn()?'켜짐':'꺼짐');
      if(devOn()){
        h+=lrow((typeof peopleSvg==='function'?peopleSvg({h:20}):MORE_ICON.gear),'사용자 현황','closeSheet();openDevUsers()');
        h+=lrow(MORE_ICON.gift,'재화관리','closeSheet();openDevGacha()');
        h+=lrow((typeof goldSvg==='function'?goldSvg({h:21}):MORE_ICON.cat),'펫 관리','closeSheet();openDevPetManager()');
        h+=lrow((typeof sparkSvg==='function'?sparkSvg({h:20}):MORE_ICON.cat),'모션 관리','closeSheet();openDevMotions()');
        h+=lrow((typeof furnSvg==='function'?furnSvg('tower',{h:22}):MORE_ICON.gear),'기구물 관리','closeSheet();openDevFurnManager()');
        h+=lrow((typeof ddeulEggSvg==='function'?ddeulEggSvg({h:20}):MORE_ICON.gift),'배너 관리','closeSheet();openDevBannerManager()');
        h+=lrow((typeof sparkSvg==='function'?sparkSvg({h:20}):MORE_ICON.gear),'이달의 펫 선정','closeSheet();openDevFeatured()');
        h+=lrow((typeof giftSvg==='function'?giftSvg({h:21}):MORE_ICON.gift),'전체 선물 보내기','closeSheet();openDevBroadcast()');
        h+=lrow((typeof megaSvg==='function'?megaSvg({h:20}):MORE_ICON.gear),'공지사항 관리','closeSheet();openDevAnnounce()');
        h+=lrow((typeof gearSvg==='function'?gearSvg({h:20}):MORE_ICON.gear),'데이터 정리','closeSheet();openDevDataTools()');
        h+=lrow((typeof gearSvg==='function'?gearSvg({h:20}):MORE_ICON.gear),'성능 HUD','togglePerfHud();openDevModeSheet()', (typeof perfHudOn==='function'&&perfHudOn())?'켜짐':'꺼짐');
      }
      h+='</div>';
      openSheet('개발자 모드', h);
    }
    // 개발자 · 사용자 현황: 전체 유저를 가입순으로 10명씩 페이지네이션. 프로필+계정번호(친구코드)만 표시(이메일 X), 접속중=무지개 테두리, 하단=접속중/총 인원.
    const DEV_USERS_PER=10;
    function openDevUsers(){
      if(!(typeof isDev==='function' && isDev())){ toast('개발자 전용'); return; }
      openSheet('사용자 현황', '<div class="note">불러오는 중…</div>');
      Promise.all([ db.ref('users').once('value'), db.ref('presence').once('value'), db.ref('rankings').once('value') ]).then(function(res){
        const usersSnap=res[0].val()||{}, pres=res[1].val()||{}, ranks=res[2].val()||{};   // 💗 rankings.aff = 각 유저 총 애정레벨 합(공개 읽기)
        const list=Object.keys(usersSnap).map(function(uid){ const u=usersSnap[uid]||{}; const rk=ranks[uid]||{};
          return { uid:uid, name:(u.name||''), code:(u.friendCode||''), photo:(u.photo||''), at:(u.createdAt||''), lastSeen:(u.lastSeen||0), aff:(Number(rk.aff)||0) }; });
        list.sort(function(a,b){ return String(a.at).localeCompare(String(b.at)); });   // 가입 순서(createdAt ISO 오름차순)
        state._devUsers={ list:list, online:pres||{}, page:0 };
        renderDevUsers();
      }).catch(function(e){
        openSheet('사용자 현황', '<div class="note">불러오기 실패: '+escapeHtml((e&&e.message)||String(e))+'</div>'+
          '<div class="note" style="margin-top:8px;">개발자 계정이어야 하고, <b>DB 규칙</b>(<code>users</code> 개발자 읽기 · <code>presence</code>)이 배포돼 있어야 해요 — <code>firebase deploy --only database</code>.</div>');
      });
    }
    function devUsersPage(d){ const s=state._devUsers; if(!s) return;
      const pages=Math.max(1, Math.ceil(s.list.length/DEV_USERS_PER));
      s.page=Math.max(0, Math.min(pages-1, s.page+d)); renderDevUsers(); }
    // 오늘(KST) 0시 이후 마지막 접속 기록이 있는 사용자 수 = 오늘 접속자 수. KST 자정의 실제 UTC ms 기준으로 비교.
    function _todayKstStartMs(){ const k=new Date(Date.now()+9*3600000); return Date.UTC(k.getUTCFullYear(), k.getUTCMonth(), k.getUTCDate()) - 9*3600000; }
    function renderDevUsers(){
      const s=state._devUsers; if(!s) return;
      const total=s.list.length, online=Object.keys(s.online||{}).length;
      const t0=_todayKstStartMs(), todayN=s.list.filter(function(u){ return (Number(u.lastSeen)||0) >= t0; }).length;
      const pages=Math.max(1, Math.ceil(total/DEV_USERS_PER)); const pg=Math.min(s.page||0, pages-1);
      const start=pg*DEV_USERS_PER, rows=s.list.slice(start, start+DEV_USERS_PER);
      let h='<div class="usrlist">';
      h+= rows.length ? rows.map(function(u, i){ const on=!!(s.online&&s.online[u.uid]); const num=start+i+1;
          const affN=Number(u.aff)||0;
          return '<div class="usrrow'+(on?' usr-online':'')+'">'+
            '<span class="usr-rank">'+num+'</span>'+
            // 🖼️ 프로필 사진 탭 → 그 사용자 프로필(친구집) 화면(openFriendHome — 내 uid면 내 홈으로 안전 처리)
            '<span class="usr-av" role="button" tabindex="0" '+App.view.act('openFriendHome',u.uid)+' aria-label="'+escapeHtml(u.name||'사용자')+' 프로필 보기" title="프로필 보기">'+avatarHtml(u.uid, u.name, 40, u.photo||'')+'</span>'+
            '<span class="usr-info"><span class="usr-nm">'+escapeHtml(u.name||'(이름없음)')+'</span>'+
              '<span class="usr-code">'+escapeHtml(u.code||'—')+'</span></span>'+
            '<span class="usr-aff" title="총 애정레벨 합">'+(typeof heartSvg==='function'?heartSvg({h:12}):'♥')+'<b>'+affN+'</b></span>'+
            (on?'<span class="usr-dot">접속중</span>':'')+'</div>'; }).join('')
        : '<div class="empty">사용자가 없어요</div>';
      h+='</div>';
      h+='<div class="usr-nav"><button class="btn ghost sm"'+(pg<=0?' disabled':'')+' '+App.view.act('devUsersPage',-1)+'>‹ 이전</button>'+
         '<span class="usr-pg">'+(pg+1)+' / '+pages+'</span>'+
         '<button class="btn ghost sm"'+(pg>=pages-1?' disabled':'')+' '+App.view.act('devUsersPage',1)+'>다음 ›</button></div>';
      h+='<div class="usr-sum"><b class="on">'+online+'</b>명 접속중 · 오늘 <b>'+todayN+'</b>명 접속 · 총 <b>'+total+'</b>명 가입</div>';
      openSheet('사용자 현황', h);
    }

    // ===== 예산 =====
    const PERIOD_LABEL={ weekly:'주간', monthly:'월간', yearly:'연간', custom:'사용자지정' };
    function budgetTitle(b){ return b.categoryName? escapeHtml(b.categoryName) : '총예산'; }
    // 예산용 작은 라인 아이콘 타일(카테고리=tint, 총예산=중립 지갑)
    function budgetTile(b){ return b.categoryName? catTileMini(b.categoryName) : '<span class="mtile" style="background:var(--soft);color:var(--text);">'+svgWrap(CAT_SVG.wallet)+'</span>'; }
    function openBudgetSheet(){
      const list=visibleBudgets().slice().sort((a,b)=>(a.categoryName?1:0)-(b.categoryName?1:0));
      let h='<button class="btn" '+App.view.act('openBudgetEdit')+'>+ 예산 추가</button><div style="margin-top:12px;">';
      if(!list.length) h+='<div class="empty">설정된 예산이 없습니다</div>';
      list.forEach(b=>{ const u=budgetUsage(b), c=budgetColor(u.pct);
        h+='<div class="card"><div class="row" '+App.view.act('openBudgetEdit',b.id)+'><div style="display:flex;align-items:center;gap:11px;flex:1;min-width:0;">'+budgetTile(b)+'<b style="min-width:0;">'+budgetTitle(b)+' <span class="pill">'+(PERIOD_LABEL[b.periodType]||b.periodType)+'</span>'+(b.scope==='personal'?'<span class="pill">개인</span>':'')+'</b></div><span style="color:'+c+';font-weight:800;flex:none;">'+u.pct+'%'+(u.pct>=100?' 초과':'')+'</span></div>'+
          '<div class="bar"><i style="width:'+Math.min(u.pct,100)+'%;background:'+c+'"></i></div>'+
          '<div class="row" style="margin-top:8px;"><span class="tx-sub">'+won(u.used)+' / '+won(u.amount)+(u.carry>0?' <span style="color:var(--income)">(이월 +'+won(u.carry)+')</span>':'')+'</span><span class="tx-sub">남음 '+won(u.remain)+'</span></div>'+
          '<div class="link" style="margin-top:8px;font-size:13px;" '+App.view.act('openBudgetDetail',b.id)+'>포함된 거래 보기 ›</div></div>';
      });
      h+='</div>';
      openSheet('예산', h);
    }
    function openBudgetDetail(id){
      const b=state.budgets.find(x=>x.id===id); if(!b) return;
      const u=budgetUsage(b), c=budgetColor(u.pct);
      const txs=budgetTxs(b).sort((a,b2)=>new Date(b2.date)-new Date(a.date));
      let h='<div class="card"><div class="row"><b>'+budgetTitle(b)+'</b><span style="color:'+c+';font-weight:800;">'+u.pct+'%</span></div>'+
        '<div class="bar"><i style="width:'+Math.min(u.pct,100)+'%;background:'+c+'"></i></div>'+
        '<div class="tx-sub" style="margin-top:8px;">'+won(u.used)+' / '+won(u.amount)+' · 기간 '+ymd(u.start)+' ~ '+ymd(u.end)+'</div></div>';
      h+='<div class="sec-title" style="margin-left:2px;">포함된 거래 ('+txs.length+'건)</div>';
      h+='<div class="card" style="padding:6px 10px;">'+(txs.length?txs.map(txRowHtml).join(''):'<div class="empty">거래 없음</div>')+'</div>';
      openSheet(budgetTitle(b)+' 상세', h);
      state._sheetReopen=()=>openBudgetDetail(id);   // ↩️ 거래 수정 시트 닫으면 이 예산 상세로 복귀
    }
    function openBudgetEdit(id){
      const b=id?state.budgets.find(x=>x.id===id):null;
      const expCats=state.categories.filter(c=>c.type==='expense'||c.type==='other').sort((a,b2)=>(a.sortOrder||0)-(b2.sortOrder||0));
      let h='<div class="field"><label>대상</label><select class="input" id="bgCat"><option value="">총예산(전체 지출)</option>'+
        expCats.map(c=>'<option value="'+escapeHtml(c.name)+'"'+((b&&b.categoryName===c.name)?' selected':'')+'>'+escapeHtml(c.name)+'</option>').join('')+'</select></div>';
      h+='<div class="field"><label>예산 금액</label><input class="input" id="bgAmount" inputmode="numeric" value="'+(b?Number(b.amount).toLocaleString():'')+'" placeholder="0" oninput="this.value=fmtComma(this.value)"></div>';
      h+='<div class="form-2"><div class="field"><label>기간</label><select class="input" id="bgPeriod" '+App.view.chg('onBudgetPeriodChange')+'>'+
        ['weekly','monthly','yearly','custom'].map(p=>'<option value="'+p+'"'+(((b&&b.periodType===p)||(!b&&p==='monthly'))?' selected':'')+'>'+PERIOD_LABEL[p]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>범위</label><select class="input" id="bgScope">'+
        [['group','그룹'],['personal','개인']].map(p=>'<option value="'+p[0]+'"'+(((b&&b.scope===p[0])||(!b&&p[0]==='group'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div></div>';
      h+='<div id="bgCustom" style="'+(b&&b.periodType==='custom'?'':'display:none;')+'"><div class="form-2"><div class="field"><label>시작일</label><input type="date" class="input" id="bgStart" value="'+(b&&b.startDate?b.startDate:todayStr())+'"></div>'+
        '<div class="field"><label>종료일</label><input type="date" class="input" id="bgEnd" value="'+(b&&b.endDate?b.endDate:todayStr())+'"></div></div></div>';
      h+='<div class="form-2"><div class="field"><label>경고 기준</label><select class="input" id="bgAlert">'+
        [80,90,100].map(n=>'<option value="'+n+'"'+(((b&&b.alertThreshold===n)||(!b&&n===80))?' selected':'')+'>'+n+'%</option>').join('')+'</select></div>'+
        '<div class="field"><label>공개 범위</label><select class="input" id="bgVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((b&&b.visibility===p[0])||(!b&&p[0]===defaultVisibility()))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div></div>';
      h+='<label style="display:flex;align-items:center;gap:8px;margin:2px 2px 12px;font-size:13px;color:var(--sub);"><input type="checkbox" id="bgRollover" '+(b&&b.rollover?'checked':'')+'> 남은 예산 <b>이월</b> — 지난 기간에 안 쓴 만큼 이번 예산에 더해요</label>';
      h+='<button class="btn" '+App.view.act('saveBudget', id?id:null)+'>'+(b?'수정':'추가')+'</button>';
      if(b) h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deleteBudget',id)+'>삭제</button>';
      openSheet(b?'예산 수정':'예산 추가', h);
    }
    function onBudgetPeriodChange(){ const w=$('bgCustom'); if(w) w.style.display=(val('bgPeriod')==='custom')?'':'none'; }
    function saveBudget(id){
      const amount=parseAmount(val('bgAmount'));
      if(!amount){ toast('예산 금액을 입력하세요', true); return; }
      const b=id?state.budgets.find(x=>x.id===id):null;
      const scope=val('bgScope'), vis=val('bgVis'), now=new Date().toISOString();
      const isMine=(scope==='personal'||vis==='private');   // 개인/비공개 = 본인 소유 예산
      const rollover = $('bgRollover')?!!$('bgRollover').checked:false;
      // 이월 기준일: 이월을 켠 시점(신규=지금). 이 날짜 이전 기간의 미사용분은 이월하지 않음 → 갓 만든 예산이 지난 기간을 공짜로 최대 2×이월하던 버그 방지.
      const rolloverSince = rollover ? ((b&&b.rolloverSince)||now) : null;
      const data={ categoryName: val('bgCat')||null, amount, periodType:val('bgPeriod'),
        startDate: val('bgPeriod')==='custom'?(val('bgStart')||todayStr()):null,
        endDate: val('bgPeriod')==='custom'?(val('bgEnd')||todayStr()):null,
        scope, alertEnabled:true, alertThreshold:Number(val('bgAlert'))||80, visibility:vis,
        rollover: rollover, rolloverSince: rolloverSince,
        owner: b?(b.owner||(isMine?state.userName:defaultOwnerName())):(isMine?state.userName:defaultOwnerName()),
        ownerUid: isMine?((b&&b.ownerUid)||state.uid||null):null,   // 개인/비공개 예산=본인 소비만 경고(budgetPreWarn 게이트) — uid 병행 저장
        purposeBookId: b?(b.purposeBookId||null):null,
        createdAt: b?(b.createdAt||now):now, updatedAt:now };
      const key=id||('bg_'+Date.now());
      db.ref(wp('budgets/'+key)).set(data).catch(_saveErr); toast(b?'수정되었습니다':'추가되었습니다'); openBudgetSheet();
    }
    function deleteBudget(id){ confirmSheet('이 예산을 삭제할까요?', ()=>{ db.ref(wp('budgets/'+id)).remove(); toast('삭제되었습니다'); openBudgetSheet(); }); }

    // ===== 카테고리 관리 =====
    let catFilter='all';
    const CAT_PALETTE=CAT_FALLBACK.concat(['#8B95A1']); // 핸드오프 차분한 톤(중복 없음) + 그레이
    function openCategorySheet(){ renderCatManage(); }
    function setCatFilter(t){ catFilter=t; renderCatManage(); }
    function renderCatManage(){
      const build=()=>{
        const filters=[['all','전체'],['expense','지출'],['income','수입'],['other','기타']];
        let h='<div class="chip-row" style="margin-bottom:12px;">'+filters.map(f=>'<button class="chip '+(catFilter===f[0]?'on':'')+'" '+App.view.act('setCatFilter',f[0])+'>'+f[1]+'</button>').join('')+'</div>';
        h+='<button class="btn" '+App.view.act('openCatEdit')+'>+ 카테고리 추가</button>';
        const cats=state.categories.filter(canSee).filter(c=> catFilter==='all'?true:(catFilter==='other'?!['expense','income'].includes(c.type):c.type===catFilter)).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
        h+='<div class="card" style="margin-top:12px;padding:6px 8px;">'+(cats.length?cats.map(catManageRow).join(''):'<div class="empty">카테고리가 없습니다</div>')+'</div>';
        return h;
      };
      openSheet('카테고리 관리', build());
      // 순서변경·토글 등 RTDB 변경 시 본문만 실시간 갱신(스크롤 보존)
      state._sheetRefresh=()=>{ const b=$('sheetBody'); if(!b) return; const st=b.scrollTop; b.innerHTML=build(); b.scrollTop=st; };
    }
    function catManageRow(c){
      const inactive=c.isActive===false;
      return '<div class="acct" style="opacity:'+(inactive?'.5':'1')+';">'+
        '<div class="acct-dot" style="'+catTileStyle(c.name)+'">'+catSvgIcon(c.name)+'</div>'+
        '<div style="flex:1;min-width:0;" '+App.view.act('openCatEdit',c.name)+'><div class="acct-name">'+escapeHtml(c.name)+'<span class="pill">'+(CAT_TYPE_LABEL[c.type]||c.type||'')+'</span>'+(c.isDefault?'<span class="pill">기본</span>':'')+(c.visibility==='private'?'<span class="pill">개인</span>':'')+'</div></div>'+
        '<div style="display:flex;align-items:center;gap:2px;">'+
          '<button class="icon-btn" style="width:30px;height:30px;font-size:13px;box-shadow:none;background:var(--line-soft);" '+App.view.act('moveCat',c.name,-1)+'>▲</button>'+
          '<button class="icon-btn" style="width:30px;height:30px;font-size:13px;box-shadow:none;background:var(--line-soft);" '+App.view.act('moveCat',c.name,1)+'>▼</button>'+
          '<div class="switch '+(inactive?'':'on')+'" '+App.view.act('toggleCatActive',c.name)+'><i></i></div>'+
        '</div></div>';
    }
    function moveCat(name,dir){
      const list=state.categories.slice().sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
      const idx=list.findIndex(c=>c.name===name), j=idx+dir;
      if(idx<0||j<0||j>=list.length) return;
      const a=list[idx], b=list[j], upd={};
      upd['categories/'+a.name+'/sortOrder']=(b.sortOrder||0);
      upd['categories/'+b.name+'/sortOrder']=(a.sortOrder||0);
      db.ref(wsRoot()).update(upd);
    }
    function toggleCatActive(name){ const c=getCat(name); if(!c) return; db.ref(wp('categories/'+name+'/isActive')).set(c.isActive===false); }
    function pickCatColor(el){ el=el||this; window._catColor=el.dataset.color; document.querySelectorAll('#catColors .swatch').forEach(b=>b.classList.remove('on')); el.classList.add('on'); }
    function pickCatIcon(el){ el=el||this; window._catIcon=el.dataset.key; document.querySelectorAll('#catIcons .icon-tile').forEach(b=>b.classList.remove('on')); el.classList.add('on'); }
    function openCatEdit(name){
      const c=name?getCat(name):null;
      const usedCount=name? state.transactions.filter(t=>t.category===name).length : 0;
      const canRename = !!c && usedCount===0;
      window._catColor = c?(c.color||CAT_PALETTE[0]):CAT_PALETTE[0];
      window._catIcon = (c && c.iconKey && (c.iconKey==='cheesecat' || CAT_SVG[c.iconKey])) ? c.iconKey : ((c && CAT_META[c.name]) ? CAT_META[c.name].i : 'tag');
      let h='';
      if(c && !canRename) h+='<div class="field"><label>이름</label><input class="input" value="'+escapeHtml(c.name)+'" disabled><div class="tx-sub" style="margin-top:4px;">거래에 사용 중이라 이름 변경 불가(비활성화 권장)</div></div>';
      else h+='<div class="field"><label>이름</label><input class="input" id="catName" value="'+escapeHtml(c?c.name:'')+'" placeholder="예: 반려동물"></div>';
      h+='<div class="field"><label>유형</label><select class="input" id="catType">'+CAT_TYPES.map(p=>'<option value="'+p[0]+'"'+(((c&&c.type===p[0])||(!c&&p[0]==='expense'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>';
      h+='<label style="font-size:13px;font-weight:600;color:var(--sub);">아이콘</label><div class="icon-grid" id="catIcons">'+Object.keys(CAT_SVG).concat(CAT_PIX_ICONS).map(k=>'<button type="button" class="icon-tile'+(k===window._catIcon?' on':'')+'" data-key="'+k+'" '+App.view.act('pickCatIcon')+'>'+catIconMarkup(k)+'</button>').join('')+'</div>';
      h+='<label style="font-size:13px;font-weight:600;color:var(--sub);">색상</label><div class="swatch-grid" id="catColors">'+CAT_PALETTE.map(p=>'<button type="button" class="swatch'+(p===window._catColor?' on':'')+'" data-color="'+p+'" style="background:'+p+';" '+App.view.act('pickCatColor')+'></button>').join('')+'</div>';
      h+='<div class="form-2"><div class="field"><label>공개 범위</label><select class="input" id="catVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((c&&c.visibility===p[0])||(!c&&p[0]===defaultVisibility()))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>활성</label><select class="input" id="catActive"><option value="1"'+((!c||c.isActive!==false)?' selected':'')+'>활성</option><option value="0"'+((c&&c.isActive===false)?' selected':'')+'>비활성</option></select></div></div>';
      h+='<div class="field"><label>메모 (선택)</label><input class="input" id="catMemo" value="'+escapeHtml(c?(c.memo||''):'')+'" placeholder="메모"></div>';
      h+='<button class="btn" '+App.view.act('saveCat', name?name:null, canRename)+'>'+(c?'수정':'추가')+'</button>';
      if(c) h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deleteCat',name)+'>삭제</button>';
      openSheet(c?'카테고리 수정':'카테고리 추가', h);
    }
    function saveCat(origName, canRename){
      const c=origName?getCat(origName):null;
      const name=(c && !canRename)?origName:val('catName').trim();
      if(!name){ toast('이름을 입력하세요', true); return; }
      if(/[/.#$\[\]]/.test(name)){ toast('이름에 / . # $ [ ] 사용 불가', true); return; }
      const renaming = !!c && canRename && name!==origName;
      if((!c||renaming) && getCat(name)){ toast('이미 있는 카테고리', true); return; }
      const vis=val('catVis');
      const nowISO=new Date().toISOString();
      const data={ name, type:val('catType'), iconKey:window._catIcon||'tag', icon:(c&&c.icon)||'', color:window._catColor||'#8b95a1',
        visibility:vis, isActive: val('catActive')==='1', memo:val('catMemo').trim(),
        isDefault: c?!!c.isDefault:false,
        owner: c?(c.owner||(vis==='private'?state.userName:defaultOwnerName())):(vis==='private'?state.userName:defaultOwnerName()),
        sortOrder: c?(c.sortOrder!=null?c.sortOrder:(state.categories.length+1)):(Math.max(0,...state.categories.map(x=>x.sortOrder||0))+1),
        createdAt: c?(c.createdAt||nowISO):nowISO, updatedAt: nowISO };
      const upd={}; upd['categories/'+name]=data; upd['catDeleted/'+name]=null; if(renaming){ upd['categories/'+origName]=null; upd['catDeleted/'+origName]=true; }
      db.ref(wsRoot()).update(upd); toast(c?'수정되었습니다':'추가되었습니다'); openCategorySheet();
    }
    function deleteCat(name){
      const c=getCat(name); if(!c) return;
      const used=state.transactions.filter(t=>t.category===name).length;
      const msg = used? ('이 카테고리를 쓴 거래가 '+used+'건 있습니다. 삭제해도 거래의 카테고리명은 남지만 비활성화를 권장합니다. 그래도 삭제할까요?') : '이 카테고리를 삭제할까요?';
      confirmSheet(msg, ()=>{ const upd={}; upd['categories/'+name]=null; if(c.isDefault) upd['catDeleted/'+name]=true; db.ref(wsRoot()).update(upd); toast('삭제되었습니다'); openCategorySheet(); });
    }

    // ===== 정기결제 =====
    function freqText(r){
      const iv=Math.max(1,Number(r.interval)||1), f=r.freq||'monthly';
      if(f==='daily') return iv>1?(iv+'일마다'):'매일';
      if(f==='weekly') return (iv>1?(iv+'주마다 '):'매주 ')+WEEK[r.weekday||0]+'요일';
      if(f==='monthly') return (iv>1?(iv+'개월마다 '):'매월 ')+(r.day||1)+'일';
      if(f==='yearly'){ const mo=r.startDate?Number(r.startDate.split('-')[1]):1, dd=r.day||(r.startDate?Number(r.startDate.split('-')[2]):1); return (iv>1?(iv+'년마다 '):'매년 ')+mo+'월 '+dd+'일'; }
      if(f==='custom') return iv+'일마다(사용자지정)';
      return f;
    }
    function openRecurringList(){
      let h='<button class="btn" '+App.view.act('openRecurringEdit')+'>+ 정기거래 추가</button>';
      const rules=state.recurring.filter(canSee).slice().sort((a,b)=>{ const na=nextRunOf(a),nb=nextRunOf(b); return (na?na.getTime():9e15)-(nb?nb.getTime():9e15); });
      if(!rules.length) h+='<div class="empty">등록된 정기거래가 없습니다</div>';
      rules.forEach(r=>{
        const st=ruleStatus(r), nr=nextRunOf(r);
        const stBadge = st==='active'?'':'<span class="pill">'+(st==='paused'?'일시정지':'종료')+'</span>';
        const cls = (r.type==='income'||r.type==='refund'||r.type==='point_earn')?'green':(r.type==='prepaid_charge'?'blue':'red');
        const rTile = r.category? catTileMini(r.category) : '<span class="mtile" style="background:var(--soft);color:var(--text);">'+svgWrap(CAT_SVG[TX_SVG_KEY[r.type]||'sub'])+'</span>';
        h+='<div class="card" style="opacity:'+(st==='active'?'1':'.6')+';"><div class="row" '+App.view.act('openRecurringEdit',r.ownerUid,r.id)+'><div style="display:flex;align-items:center;gap:11px;flex:1;min-width:0;">'+rTile+'<b style="min-width:0;">'+escapeHtml(r.desc||'정기')+stBadge+'</b></div><span class="'+cls+'" style="font-weight:800;flex:none;">'+won(r.amount)+'</span></div>'+
          '<div class="tx-sub" style="margin-top:6px;">'+TYPE_LABEL[r.type]+' · '+freqText(r)+(r.category?(' · '+escapeHtml(r.category)):'')+' · '+escapeHtml(acctName(r.from||r.to))+(nr&&st==='active'?(' · 다음 '+ymd(nr)):'')+'</div>';
        if(r.ownerUid===state.uid){
          h+='<div class="chip-row" style="margin-top:10px;">';
          if(st==='active') h+='<button class="chip" '+App.view.act('pauseRecurring',r.ownerUid,r.id)+'>일시정지</button>';
          else if(st==='paused') h+='<button class="chip" '+App.view.act('resumeRecurring',r.ownerUid,r.id)+'>재개</button>';
          if(st!=='ended') h+='<button class="chip" '+App.view.act('endRecurring',r.ownerUid,r.id)+'>종료</button>';
          h+='<button class="chip" '+App.view.act('generateRecurringNow',r.ownerUid,r.id)+'>즉시 생성</button>';
          h+='<button class="chip" '+App.view.act('viewRecurringTxs',r.id)+'>생성된 거래</button></div>';
        }
        h+='</div>';
      });
      openSheet('정기결제', h);
    }
    function viewRecurringTxs(ruleId){
      const txs=state.transactions.filter(t=>t.recurringId===ruleId).sort((a,b)=>new Date(b.date)-new Date(a.date));
      openSheet('생성된 거래 ('+txs.length+')', '<div class="card" style="padding:6px 10px;">'+(txs.length?txs.map(txRowHtml).join(''):'<div class="empty">생성된 거래가 없습니다</div>')+'</div>');
      state._sheetReopen=()=>viewRecurringTxs(ruleId);   // ↩️ 거래 수정 시트 닫으면 이 목록으로 복귀
    }
    function pauseRecurring(o,id){ db.ref(wp('recurring/'+o+'/'+id+'/status')).set('paused'); toast('일시정지'); openRecurringList(); }
    function resumeRecurring(o,id){ db.ref(wp('recurring/'+o+'/'+id)).update({status:'active'}); toast('재개'); setTimeout(runRecurring,400); openRecurringList(); }
    function endRecurring(o,id){ db.ref(wp('recurring/'+o+'/'+id+'/status')).set('ended'); toast('종료'); openRecurringList(); }
    function generateRecurringNow(o,id){
      const rule=state.recurring.find(x=>x.ownerUid===o&&x.id===id); if(!rule) return;
      const occ=parseDate(todayStr());
      if(postOccurrence(rule, occ)){ db.ref(wp('recurring/'+o+'/'+id+'/lastPosted')).set(ymd(occ)); toast('오늘 거래를 생성했습니다'); }
      else toast('오늘 이미 생성됨', true);
    }
    function openRecurringEdit(ownerUid,id){
      const r=(ownerUid&&id)?state.recurring.find(x=>x.ownerUid===ownerUid&&x.id===id):null;
      const isOwn = !r || r.ownerUid===state.uid;
      window._recEdit=r;
      const tp=r?r.type:'expense';
      let h='';
      if(r && !isOwn) h+='<div class="install-banner">다른 사용자의 정기거래라 보기만 가능합니다</div>';
      h+='<div class="field"><label>유형</label><select class="input" id="rType" '+App.view.chg('onRecTypeChange')+'>'+
        ['expense','income','transfer','prepaid_charge','prepaid_spend','refund','point_earn','point_spend','balance_adjustment'].map(t=>'<option value="'+t+'"'+(tp===t?' selected':'')+'>'+TYPE_LABEL[t]+'</option>').join('')+'</select></div>';
      h+='<div class="field"><label>제목</label><input class="input" id="rDesc" value="'+escapeHtml(r?(r.desc||''):'')+'" placeholder="예: 넷플릭스, 월세"></div>';
      h+='<div class="field"><label>금액</label><input class="input" id="rAmount" inputmode="numeric" value="'+(r?Number(r.amount).toLocaleString():'')+'" oninput="this.value=fmtComma(this.value)"></div>';
      h+='<div id="rAccts"></div>';
      h+='<div class="form-2"><div class="field"><label>주기</label><select class="input" id="rFreq" '+App.view.chg('toggleRFreq')+'>'+
        [['daily','매일'],['weekly','매주'],['monthly','매월'],['yearly','매년'],['custom','사용자지정']].map(f=>'<option value="'+f[0]+'"'+(((r&&r.freq===f[0])||(!r&&f[0]==='monthly'))?' selected':'')+'>'+f[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>간격</label><input class="input" id="rInterval" inputmode="numeric" value="'+(r&&r.interval?r.interval:1)+'"></div></div>';
      h+='<div class="field" id="rDayWrap"></div>';
      h+='<div class="form-2"><div class="field"><label>시작일</label><input type="date" class="input" id="rStart" value="'+(r&&r.startDate?r.startDate:todayStr())+'"></div>'+
        '<div class="field"><label>종료일(선택)</label><input type="date" class="input" id="rEnd" value="'+(r&&r.endDate?r.endDate:'')+'"></div></div>';
      h+='<div id="rCardPerf"></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>자동 생성</span><div class="switch '+((!r||r.autoCreate!==false)?'on':'')+'" id="rAuto" '+App.view.act('toggleSwitch')+'><i></i></div></div>';
      h+='<div class="field"><label>공개 범위</label><select class="input" id="rVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((r&&r.visibility===p[0])||(!r&&p[0]===defaultVisibility()))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>';
      h+='<div class="field"><label>메모(선택)</label><input class="input" id="rMemo" value="'+escapeHtml(r?(r.memo||''):'')+'" placeholder="메모"></div>';
      if(isOwn){
        h+='<button class="btn" '+App.view.act('saveRecurring', r?ownerUid:null, r?id:null)+'>'+(r?'수정':'추가')+'</button>';
        if(r) h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deleteRecurring',ownerUid,id)+'>삭제</button>';
      }
      openSheet(r?'정기거래 수정':'정기거래 추가', h);
      renderRecAccts(); toggleRFreq();
    }
    function onRecTypeChange(){ renderRecAccts(); }
    function recAcctField(label,id,sel,types){ return '<div class="field"><label>'+label+'</label><select class="input" id="'+id+'" '+App.view.chg('renderRecCardPerf')+'>'+acctOptsHtml(sel,types)+'</select></div>'; }
    function recConsumerField(sel){ return '<div class="field"><label>소비 대상</label><select class="input" id="rConsumer">'+ownerOptions(sel||'공동')+'</select></div>'; }
    function recCatField(wantType, sel){
      const cats=state.categories.filter(c=>c.isActive!==false && (c.type===wantType||c.type==='other')).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
      return '<div class="field"><label>카테고리</label><select class="input" id="rCat" '+App.view.chg('renderRecCardPerf')+'>'+cats.map(c=>'<option value="'+escapeHtml(c.name)+'"'+(c.name===sel?' selected':'')+'>'+escapeHtml(c.name)+'</option>').join('')+'</select></div>';
    }
    function renderRecAccts(){
      const r=window._recEdit, t=val('rType');
      const fromV=r?(r.from||''):(state.accounts[0]?state.accounts[0].id:''), toV=r?(r.to||''):(state.accounts[1]?state.accounts[1].id:(state.accounts[0]?state.accounts[0].id:'')), catV=r?(r.category||''):'';
      const consV=r?(r.user||state.userName||'공동'):(state.userName||'공동');
      let h='';
      const PREPAY=['prepaid','e_wallet','gift_card'], NONPRE=['bank','cash','credit_card','debit_card','other'];   // 거래 시트와 동일한 유형 필터
      if(t==='expense'){ h+=recAcctField('출금/결제 수단','rFrom',fromV)+recConsumerField(consV)+recCatField('expense',catV); }
      else if(t==='income'){ h+=recAcctField('입금 대상','rTo',toV)+recCatField('income',catV); }
      else if(t==='refund'){ h+=recAcctField('환불 받는 계정','rTo',toV)+recCatField('income',catV); }
      else if(t==='point_earn'){ h+=recAcctField('적립 포인트 계정','rTo',toV,['point']); }
      else if(t==='transfer'||t==='prepaid_charge'){ const l1=t==='prepaid_charge'?'충전 수단(카드/계좌)':'출금', l2=t==='prepaid_charge'?'충전 대상(선불/포인트)':'입금'; h+='<div class="form-2">'+recAcctField(l1,'rFrom',fromV,t==='prepaid_charge'?NONPRE:null)+recAcctField(l2,'rTo',toV,t==='prepaid_charge'?PREPAY.concat(['point']):null)+'</div>'; }
      else if(t==='prepaid_spend'||t==='point_spend'){ h+=recAcctField(t==='point_spend'?'사용 포인트 계정':'결제 선불수단','rFrom',fromV,t==='point_spend'?['point']:PREPAY)+recConsumerField(consV)+(catTypeFor(t)?recCatField('expense',catV):''); }
      else if(t==='balance_adjustment'){ h+=recAcctField('대상 계정','rTo',toV); }
      $('rAccts').innerHTML=h; renderRecCardPerf();
    }
    function renderRecCardPerf(){
      const box=$('rCardPerf'); if(!box) return; const r=window._recEdit, t=val('rType');
      const fromId=$('rFrom')?$('rFrom').value:(r?r.from:'');
      const card=getCard(fromId);
      if(!(card && (t==='expense'||t==='prepaid_charge'))){ box.innerHTML=''; return; }
      const cat=$('rCat')?$('rCat').value:(r?r.category:'');
      const defInc=defaultCardIncluded(card,t,cat);
      const inc=(r&&r.cardPerformanceIncluded!==undefined)?!!r.cardPerformanceIncluded:defInc;
      const amt=(r&&r.cardPerformanceAmount!=null)?r.cardPerformanceAmount:parseAmount(val('rAmount'));
      box.innerHTML='<div class="card" style="padding:14px;margin:4px 0 14px;"><div class="menu-item" style="padding:4px 0;"><span>💳 '+escapeHtml(card.cardName||acctName(card.id))+' 실적 포함</span><div class="switch '+(inc?'on':'')+'" id="rCpi" '+App.view.act('toggleSwitch','toggleRCpi')+'><i></i></div></div>'+
        '<div id="rCpiF" style="'+(inc?'':'display:none;')+'"><div class="field" style="margin-top:8px;"><label>실적 인정 금액</label><input class="input" id="rCpa" inputmode="numeric" value="'+(amt?Number(amt).toLocaleString():'')+'" oninput="this.value=fmtComma(this.value)"></div></div>'+
        '<div id="rCprW" style="'+(inc?'display:none;':'')+'"><div class="field" style="margin-top:8px;"><label>실적 제외 사유</label><input class="input" id="rCpr" value="'+escapeHtml(r?(r.cardPerformanceExcludedReason||''):'')+'" placeholder="예: 선불충전 제외"></div></div>'+
        '<div class="tx-sub" style="margin-top:6px;">기본값: '+(defInc?'포함':'제외')+'</div></div>';
    }
    function toggleRCpi(){ const on=$('rCpi').classList.contains('on'); $('rCpiF').style.display=on?'':'none'; $('rCprW').style.display=on?'none':''; }
    function toggleRFreq(){
      const r=window._recEdit, f=val('rFreq'); let h;
      if(f==='weekly') h='<label>요일</label><select class="input" id="rWeekday">'+WEEK.map((w,i)=>'<option value="'+i+'"'+((r&&r.weekday===i)?' selected':(!r&&i===1?' selected':''))+'>'+w+'요일</option>').join('')+'</select>';
      else if(f==='monthly') h='<label>날짜</label><select class="input" id="rDay">'+Array.from({length:31},(_,i)=>'<option value="'+(i+1)+'"'+(((r&&r.day===i+1)||(!r&&i===0))?' selected':'')+'>'+(i+1)+'일</option>').join('')+'</select>';
      else if(f==='yearly') h='<div class="tx-sub">시작일의 월·일에 매년(간격 N년) 반복됩니다.</div>';
      else h='<div class="tx-sub">시작일부터 '+(Math.max(1,Number(val('rInterval'))||1))+'일 간격으로 반복됩니다.</div>';
      $('rDayWrap').innerHTML=h;
    }
    function saveRecurring(ownerUid,id){
      const r=window._recEdit, type=val('rType'), desc=val('rDesc').trim(), amount=parseAmount(val('rAmount')), freq=val('rFreq');
      if(!desc||!amount){ toast('제목과 금액을 입력하세요', true); return; }
      const e=TX_EFFECT[type]||{};
      const data={ type, desc, amount, freq, interval:Math.max(1,Number(val('rInterval'))||1),
        startDate: val('rStart')||todayStr(), endDate: val('rEnd')||null,
        day: (freq==='monthly')?Number(val('rDay')||1):(freq==='yearly'?(parseDate(val('rStart')||todayStr()).getDate()):((r&&r.day)||1)),   // 연간=시작일의 '일'에 매년(예전 day=1 고정으로 매년 1일에 발생하던 버그 방지)
        weekday: (freq==='weekly')?Number(val('rWeekday')||0):((r&&r.weekday)||0),
        user: resolveOwnerName($('rConsumer')?(val('rConsumer')||state.userName):(r?(r.user||state.userName):state.userName)),   // 정기결제 소비대상도 이름으로 정규화 저장
        autoCreate: $('rAuto')?$('rAuto').classList.contains('on'):true,
        status: r?(ruleStatus(r)==='ended'?'active':ruleStatus(r)):'active',
        visibility: val('rVis'), memo: val('rMemo').trim(),
        lastPosted: r?(r.lastPosted||''):'',
        notifyBeforeCreate: r?(r.notifyBeforeCreate||false):false,
        createdAt: r?(r.createdAt||new Date().toISOString()):new Date().toISOString(),
        updatedAt: new Date().toISOString() };
      if(type==='balance_adjustment'){ data.to=val('rTo'); }
      else { if(e.debit) data.from=val('rFrom'); if(e.credit) data.to=val('rTo'); }
      if(catTypeFor(type) && $('rCat')) data.category=val('rCat');
      const card=getCard(data.from);
      if(card && (type==='expense'||type==='prepaid_charge')){
        const inc=$('rCpi')?$('rCpi').classList.contains('on'):defaultCardIncluded(card,type,data.category);
        data.cardPerformanceIncluded=inc;
        data.cardPerformanceAmount= inc ? (parseAmount(val('rCpa'))||amount) : 0;
        data.cardPerformanceExcludedReason= inc ? '' : (val('rCpr')||'');
      }
      const nr=nextRunOf(data); data.nextRunDate = nr?ymd(nr):null;
      const key=id||String(Date.now());
      db.ref(wp('recurring/'+(ownerUid||state.uid)+'/'+key)).set(data);
      toast(r?'수정되었습니다':'추가되었습니다'); closeSheet(); setTimeout(runRecurring,400);
    }
    function deleteRecurring(ownerUid,id){ confirmSheet('이 정기거래를 삭제할까요? (기록된 거래는 유지)', ()=>{ db.ref(wp('recurring/'+ownerUid+'/'+id)).remove(); toast('삭제되었습니다'); openRecurringList(); }); }

    // ===== 구독 화면 =====
    // 구독 다음 결제일 — 저장값이 과거면 주기만큼 굴려 다음 예정일로(표시·알림·필터·정렬 공통). 첫 주기 뒤 결제 알림이 정지하던 버그 방지.
    function subNextBilling(s){ return effNextBilling(s.nextBillingDate, s.billingCycle, s.billingInterval); }
    let subTab='all';
    function openSubscriptions(){ subTab='all'; renderSubs(); }
    function setSubTab(t){ subTab=t; renderSubs(); }
    function renderSubs(){
      const subs=visibleSubs(); const act=subs.filter(subActive);
      const totalM=act.reduce((s,x)=>s+(monthlyEquiv(x)||0),0);
      const totalY=act.reduce((s,x)=>s+(yearlyEquiv(x)||0),0);
      const cm=monthStr(new Date());
      const thisMonthDue=act.filter(x=>{ const nb=subNextBilling(x); return nb&&nb.startsWith(cm); }).reduce((s,x)=>s+(Number(x.amount)||0),0);
      const soon=act.filter(x=>{ const d=daysUntil(subNextBilling(x)); return d!=null&&d>=0&&d<=7; }).length;
      const expSoon=act.filter(x=>{ const d=daysUntil(x.expirationDate); return d!=null&&d>=0&&d<=7; }).length;
      let h='<div class="card"><div class="summary">'+
        '<div><div class="s-label">활성 구독</div><div class="s-val">'+act.length+'</div></div>'+
        '<div><div class="s-label">월 환산</div><div class="s-val">'+won(Math.round(totalM))+'</div></div>'+
        '<div><div class="s-label">연 환산</div><div class="s-val">'+won(Math.round(totalY))+'</div></div></div>'+
        '<div class="row" style="margin-top:12px;font-size:12px;border-top:1px solid var(--line-soft);padding-top:12px;">'+
          '<span class="muted">이번달 예정 <b>'+won(thisMonthDue)+'</b></span>'+
          '<span class="muted">결제임박 <b class="blue">'+soon+'</b></span>'+
          '<span class="muted">만료임박 <b class="red">'+expSoon+'</b></span></div></div>';
      const tabs=[['all','전체'],['month','이번달'],['soon','7일 이내'],['trial','무료체험'],['ended','취소/만료']];
      h+='<div class="chip-row">'+tabs.map(t=>'<button class="chip '+(subTab===t[0]?'on':'')+'" '+App.view.act('setSubTab',t[0])+'>'+t[1]+'</button>').join('')+'</div>';
      h+='<button class="btn" '+App.view.act('openSubEdit')+'>+ 구독 추가</button>';
      let list=subs.slice();
      if(subTab==='month') list=list.filter(x=>{ const nb=subNextBilling(x); return subActive(x)&&nb&&nb.startsWith(cm); });
      else if(subTab==='soon') list=list.filter(x=>{ const d=daysUntil(subNextBilling(x)); return subActive(x)&&d!=null&&d>=0&&d<=7; });
      else if(subTab==='trial') list=list.filter(x=>x.isTrial&&subActive(x));
      else if(subTab==='ended') list=list.filter(x=>['cancelled','expired'].includes(x.status));
      list.sort((a,b)=>(subNextBilling(a)||'9999').localeCompare(subNextBilling(b)||'9999'));
      h+='<div style="margin-top:12px;">'+(list.length?list.map(subCard).join(''):'<div class="empty">구독이 없습니다</div>')+'</div>';
      openSheet('구독', h);
    }
    function subCard(s){
      const badges=subBadges(s).map(b=>'<span class="pill" style="background:'+b[1]+'22;color:'+b[1]+'">'+b[0]+'</span>').join('');
      const linked=s.recurringId?'<span class="pill">정기연결</span>':'';
      return '<div class="card" '+App.view.act('openSubDetail',s.id)+'><div class="row"><b>'+escapeHtml(s.name||'구독')+' '+linked+'</b><span style="font-weight:800;">'+won(s.amount)+'</span></div>'+
        '<div class="tx-sub" style="margin-top:6px;">'+(BILLING_LABEL[s.billingCycle]||s.billingCycle)+(s.nextBillingDate?(' · 다음 '+subNextBilling(s)):'')+(s.paymentAccountId?(' · '+escapeHtml(acctName(s.paymentAccountId))):'')+'</div>'+
        (badges?('<div style="margin-top:8px;">'+badges+'</div>'):'')+'</div>';
    }
    function openSubDetail(id){
      const s=state.subscriptions.find(x=>x.id===id); if(!s) return;
      const txs=s.recurringId? state.transactions.filter(t=>t.recurringId===s.recurringId).sort((a,b)=>new Date(b.date)-new Date(a.date)) : [];
      const me=monthlyEquiv(s);
      let h='<div class="card"><div class="row"><b style="font-size:18px;">'+escapeHtml(s.name)+'</b><span style="font-weight:800;">'+won(s.amount)+'</span></div>'+
        '<div class="tx-sub" style="margin-top:6px;">'+(SUB_TYPE_LABEL[s.subscriptionType]||'')+' · '+(BILLING_LABEL[s.billingCycle]||'')+'</div>'+
        '<div style="margin-top:8px;">'+subBadges(s).map(b=>'<span class="pill" style="background:'+b[1]+'22;color:'+b[1]+'">'+b[0]+'</span>').join('')+'</div></div>';
      const row=(k,v)=>'<div class="row" style="padding:5px 0;"><span class="muted">'+k+'</span><b>'+v+'</b></div>';
      h+='<div class="card">'+row('다음 결제일',subNextBilling(s)||'-')+row('만료일',s.expirationDate||'-')+
        (s.isTrial?row('무료체험 종료',s.trialEndDate||'-'):'')+row('자동 갱신',s.autoRenew!==false?'예':'아니오')+
        row('결제수단',escapeHtml(acctName(s.paymentAccountId)))+row('카테고리',escapeHtml(s.categoryName||'-'))+
        row('월 환산',me!=null?won(Math.round(me)):'환산 불가')+(s.memo?('<div class="tx-sub" style="margin-top:6px;">'+escapeHtml(s.memo)+'</div>'):'')+'</div>';
      h+='<div class="chip-row">'+['active','paused','cancelled','expired'].map(st=>'<button class="chip '+((s.status||'active')===st?'on':'')+'" '+App.view.act('setSubStatus',s.id,st)+'>'+SUB_STATUS_LABEL[st]+'</button>').join('')+'</div>';
      h+='<div class="sec-title" style="margin-left:2px;">연결된 결제 내역 ('+txs.length+')</div>';
      h+='<div class="card" style="padding:6px 10px;">'+(txs.length?txs.map(txRowHtml).join(''):'<div class="empty">연결된 거래 없음</div>')+'</div>';
      h+='<button class="btn ghost" '+App.view.act('openSubEdit',s.id)+'>수정</button>';
      h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deleteSub',s.id)+'>삭제</button>';
      openSheet(s.name||'구독', h);
      state._sheetReopen=()=>openSubDetail(id);   // ↩️ 거래 수정 시트 닫으면 이 구독 상세로 복귀
    }
    function setSubStatus(id,st){ db.ref(wp('subscriptions/'+id)).update({status:st, updatedAt:new Date().toISOString()}); toast('상태: '+SUB_STATUS_LABEL[st]); openSubDetail(id); }
    function openSubEdit(id){
      const s=id?state.subscriptions.find(x=>x.id===id):null;
      const cats=state.categories.filter(c=>c.isActive!==false&&(c.type==='expense'||c.type==='other')).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
      const recRules=state.recurring.filter(r=>r.ownerUid===state.uid);
      let h='<div class="field"><label>구독명</label><input class="input" id="subName" value="'+escapeHtml(s?s.name:'')+'" placeholder="예: 넷플릭스"></div>';
      h+='<div class="field"><label>금액</label><input class="input" id="subAmount" inputmode="numeric" value="'+(s?Number(s.amount).toLocaleString():'')+'" oninput="this.value=fmtComma(this.value)"></div>';
      h+='<div class="form-2"><div class="field"><label>결제 주기</label><select class="input" id="subCycle">'+BILLING.map(b=>'<option value="'+b[0]+'"'+(((s&&s.billingCycle===b[0])||(!s&&b[0]==='monthly'))?' selected':'')+'>'+b[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>다음 결제일</label><input type="date" class="input" id="subNext" value="'+(s&&s.nextBillingDate?s.nextBillingDate:todayStr())+'"></div></div>';
      h+='<div class="form-2"><div class="field"><label>결제수단</label><select class="input" id="subAcct">'+acctOptsHtml(s?s.paymentAccountId:(state.accounts[0]?state.accounts[0].id:''))+'</select></div>'+
        '<div class="field"><label>카테고리</label><select class="input" id="subCat">'+cats.map(c=>'<option value="'+escapeHtml(c.name)+'"'+(((s&&s.categoryName===c.name)||(!s&&c.name==='구독'))?' selected':'')+'>'+escapeHtml(c.name)+'</option>').join('')+'</select></div></div>';
      h+='<details class="adv"><summary>상세 설정</summary>';
      h+='<div class="form-2"><div class="field"><label>서비스 유형</label><select class="input" id="subType">'+SUB_TYPES.map(t=>'<option value="'+t[0]+'"'+(((s&&s.subscriptionType===t[0])||(!s&&t[0]==='video'))?' selected':'')+'>'+t[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>결제 간격</label><input class="input" id="subInterval" inputmode="numeric" value="'+(s&&s.billingInterval?s.billingInterval:1)+'"></div></div>';
      h+='<div class="field"><label>만료일(선택)</label><input type="date" class="input" id="subExp" value="'+(s&&s.expirationDate?s.expirationDate:'')+'"></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>자동 갱신</span><div class="switch '+((!s||s.autoRenew!==false)?'on':'')+'" id="subRenew" '+App.view.act('toggleSwitch')+'><i></i></div></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>무료체험 중</span><div class="switch '+((s&&s.isTrial)?'on':'')+'" id="subTrial" onclick="this.classList.toggle(\'on\');document.getElementById(\'subTrialEndWrap\').style.display=this.classList.contains(\'on\')?\'\':\'none\';"><i></i></div></div>';
      h+='<div class="field" id="subTrialEndWrap" style="'+((s&&s.isTrial)?'':'display:none;')+'"><label>무료체험 종료일</label><input type="date" class="input" id="subTrialEnd" value="'+(s&&s.trialEndDate?s.trialEndDate:'')+'"></div>';
      h+='<div class="field"><label>정기결제 연결</label><select class="input" id="subRecMode" '+App.view.chg('onSubRecModeChange')+'>'+
         '<option value="auto"'+((!s||!s.recurringId)?' selected':'')+'>정기결제 자동 생성</option>'+
         '<option value="none"'+((s&&!s.recurringId&&s._noRec)?' ':'')+'>연결 안 함</option>'+
         '<option value="existing"'+((s&&s.recurringId)?' selected':'')+'>기존 정기거래 연결</option></select></div>';
      h+='<div class="field" id="subRecExistingWrap" style="'+((s&&s.recurringId)?'':'display:none;')+'"><label>정기거래 선택</label><select class="input" id="subRecExisting">'+(recRules.length?recRules.map(r=>'<option value="'+r.id+'"'+((s&&s.recurringId===r.id)?' selected':'')+'>'+escapeHtml(r.desc||r.id)+'</option>').join(''):'<option value="">정기거래 없음</option>')+'</select></div>';
      h+='<div class="field"><label>공개 범위</label><select class="input" id="subVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((s&&s.visibility===p[0])||(!s&&p[0]===defaultVisibility()))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>';
      h+='<div class="field"><label>메모</label><input class="input" id="subMemo" value="'+escapeHtml(s?(s.memo||''):'')+'" placeholder="메모"></div>';
      h+='</details>';
      h+='<button class="btn" '+App.view.act('saveSub', id?id:null)+'>'+(s?'수정':'추가')+'</button>';
      openSheet(s?'구독 수정':'구독 추가', h);
    }
    function onSubRecModeChange(){ const w=$('subRecExistingWrap'); if(w) w.style.display=(val('subRecMode')==='existing')?'':'none'; }
    function saveSub(id){
      const name=val('subName').trim(); if(!name){ toast('구독명을 입력하세요', true); return; }
      const amount=parseAmount(val('subAmount')); if(!amount){ toast('금액을 입력하세요', true); return; }
      const s=id?state.subscriptions.find(x=>x.id===id):null;
      const cycle=val('subCycle'), next=val('subNext')||todayStr(), acct=val('subAcct'), cat=val('subCat'), vis=val('subVis')||'full';
      const trialOn=$('subTrial')&&$('subTrial').classList.contains('on');
      const now=new Date().toISOString(); const key=id||('sub_'+Date.now());
      const recMode=val('subRecMode'); let recurringId = s?(s.recurringId||null):null;
      if(recMode==='none') recurringId=null;
      else if(recMode==='existing') recurringId=val('subRecExisting')||null;
      else if(recMode==='auto'){
        const freq = cycle==='yearly'?'yearly':(cycle==='weekly'?'weekly':'monthly');
        const nd=parseDate(next);
        const ruleId=(s&&s.recurringId)?s.recurringId:('subrec_'+Date.now());
        const prev=state.recurring.find(r=>r.id===ruleId);
        const rule={ type:'expense', desc:name, amount, category:cat, from:acct, freq, interval:Math.max(1,Number(val('subInterval'))||1),
          day:nd.getDate(), weekday:nd.getDay(), startDate:next, endDate:val('subExp')||null,
          lastPosted:prev?(prev.lastPosted||''):'', status:'active', autoCreate:true, visibility:vis, user:state.userName,
          createdAt:prev?(prev.createdAt||now):now, updatedAt:now };
        const card=getCard(acct); if(card){ const inc=defaultCardIncluded(card,'expense',cat); rule.cardPerformanceIncluded=inc; rule.cardPerformanceAmount=inc?amount:0; }
        const nr=nextRunOf(rule); rule.nextRunDate=nr?ymd(nr):null;
        db.ref(wp('recurring/'+state.uid+'/'+ruleId)).set(rule); recurringId=ruleId;
      }
      const data={ name, serviceName:name, subscriptionType:val('subType'), amount, billingCycle:cycle, billingInterval:Math.max(1,Number(val('subInterval'))||1),
        paymentAccountId:acct, categoryName:cat, nextBillingDate:next, expirationDate:val('subExp')||null,
        autoRenew: $('subRenew')?$('subRenew').classList.contains('on'):true, isTrial:!!trialOn, trialEndDate: trialOn?(val('subTrialEnd')||null):null,
        recurringId, status: s?(s.status||'active'):'active', visibility:vis,
        owner: s?(s.owner||(vis==='private'?state.userName:defaultOwnerName())):(vis==='private'?state.userName:defaultOwnerName()),
        memo:val('subMemo').trim(), createdAt: s?(s.createdAt||now):now, updatedAt:now };
      db.ref(wp('subscriptions/'+key)).set(data).catch(_saveErr); toast(s?'수정되었습니다':'추가되었습니다'); closeSheet();
      setTimeout(()=>{ if(recMode==='auto') runRecurring(); openSubscriptions(); }, 300);
    }
    function deleteSub(id){ confirmSheet('이 구독을 삭제할까요? (연결된 정기거래는 유지됩니다)', ()=>{ db.ref(wp('subscriptions/'+id)).remove(); toast('삭제되었습니다'); openSubscriptions(); }); }

    // ===== 목적별 가계부 (PurposeBook) =====
    let pbTab='all';
    function visiblePBs(){ return state.purposeBooks.filter(canSee); }
    function pbTypeText(p){ return p.type==='custom'?(p.customTypeName||'기타'):(PB_TYPE_LABEL[p.type]||p.type); }
    function pbTxs(p){ return state.transactions.filter(t=>t.purposeBookId===p.id); }
    // 목적별 사용액: purposeBookId 일치 + isActual + 기간(시작~종료) 이내 (충전/이체/조정 등은 isActual=false라 제외)
    // [확장 메모] 카테고리별 목적 예산이 필요하면 budgets 컬렉션에 purposeBookId 레코드(방식 B)로 확장 가능. 현재는 pb.budgetAmount(방식 A).
    function pbUsage(p){
      const txs=pbTxs(p).filter(isActual).filter(t=>{
        const d=(t.date||'').substring(0,10);
        if(p.startDate && d < p.startDate) return false;
        if(p.endDate && d > p.endDate) return false;
        return true;
      });
      const used=txs.reduce((s,t)=>s+(Number(t.amount)||0),0);
      const amt=Number(p.budgetAmount)||0;
      return { used, amount:amt, pct: amt?Math.round(used/amt*100):0, remain:amt-used, txs };
    }
    function openPurposeBooks(tab){ pbTab=tab||'all'; renderPBs(); }
    function setPbTab(t){ pbTab=t; renderPBs(); }
    // 정산 개요: 정산 사용 목적별 가계부들의 상태 요약
    function openSettlementOverview(){
      const pbs=visiblePBs().filter(p=>p.settlementEnabled);
      let h='';
      if(!pbs.length){ h='<div class="empty">정산을 사용하는 목적별 가계부가 없습니다.<br>목적별 가계부 설정에서 “정산 사용”을 켜세요.</div>'; openSheet('정산', h); return; }
      const rows=pbs.map(p=>({p, s:pbSettleSummary(p)}));
      const totalUnsettled=rows.reduce((s,r)=>s+r.s.unsettledAmount,0);
      h+='<div class="card"><div class="summary">'+
        '<div><div class="s-label">정산 가계부</div><div class="s-val">'+pbs.length+'</div></div>'+
        '<div><div class="s-label">미정산 합계</div><div class="s-val">'+won(totalUnsettled)+'</div></div></div></div>';
      h+=rows.map(({p,s})=>'<div class="card" '+App.view.act('openPbDetail',p.id,'settle')+'><div class="row"><b>'+(p.icon||'📒')+' '+escapeHtml(p.name)+'</b>'+pbSettleBadge(p)+'</div>'+
        '<div class="tx-sub" style="margin-top:6px;">대상 '+s.txCount+'건 · 완료율 '+s.settledPct+'%'+(s.unsettledAmount>0?(' · 미정산 '+won(s.unsettledAmount)):'')+'</div></div>').join('');
      openSheet('정산', h);
    }
    function renderPBs(){
      const pbs=visiblePBs(), act=pbs.filter(p=>(p.status||'active')==='active');
      const totalBudget=act.reduce((s,p)=>s+(Number(p.budgetAmount)||0),0);
      let totalUsed=0; act.forEach(p=>{ totalUsed+=pbUsage(p).used; });
      const settleCount=act.filter(p=>p.settlementEnabled).length;
      let h='<div class="card"><div class="summary">'+
        '<div><div class="s-label">진행중</div><div class="s-val">'+act.length+'</div></div>'+
        '<div><div class="s-label">예산 합계</div><div class="s-val">'+won(totalBudget)+'</div></div>'+
        '<div><div class="s-label">사용</div><div class="s-val">'+won(totalUsed)+'</div></div></div>'+
        '<div class="row" style="margin-top:12px;font-size:12px;border-top:1px solid var(--line-soft);padding-top:12px;"><span class="muted">남음 <b>'+won(totalBudget-totalUsed)+'</b></span><span class="muted">정산 사용 <b>'+settleCount+'</b></span></div></div>';
      const tabs=[['all','전체'],['active','진행중'],['completed','완료'],['archived','보관'],['travel','여행'],['gathering','모임/계'],['etc','기타']];
      h+='<div class="chip-row">'+tabs.map(t=>'<button class="chip '+(pbTab===t[0]?'on':'')+'" '+App.view.act('setPbTab',t[0])+'>'+t[1]+'</button>').join('')+'</div>';
      h+='<button class="btn" '+App.view.act('openPbEdit')+'>+ 목적별 가계부 추가</button>';
      let list=pbs.slice();
      if(['active','completed','archived'].includes(pbTab)) list=list.filter(p=>(p.status||'active')===pbTab);
      else if(pbTab==='travel') list=list.filter(p=>p.type==='travel');
      else if(pbTab==='gathering') list=list.filter(p=>p.type==='gathering'||p.type==='account_group');
      else if(pbTab==='etc') list=list.filter(p=>!['travel','gathering','account_group'].includes(p.type));
      h+='<div style="margin-top:12px;">'+(list.length?list.map(pbCard).join(''):'<div class="empty">목적별 가계부가 없습니다</div>')+'</div>';
      openSheet('목적별 가계부', h);
    }
    // 정산 상태 배지(목록/카드용). 정산 미사용이면 빈 문자열.
    function pbSettleBadge(p){
      if(!p.settlementEnabled) return '';
      const s=pbSettleSummary(p);
      if(s.txCount===0) return '<span class="pill">🤝 정산</span>';
      if(s.status==='settled') return '<span class="pill" style="background:var(--income-soft,#e6f9ef);color:var(--income);">정산 완료</span>';
      if(s.unsettledAmount>0) return '<span class="pill" style="background:var(--expense-soft,#fdeaec);color:var(--expense);">미정산 '+won(s.unsettledAmount)+'</span>';
      return '<span class="pill">🤝 정산</span>';
    }
    function pbCard(p){
      const u=pbUsage(p), c=budgetColor(u.pct), st=p.status||'active';
      const period=(p.startDate||'')+(p.endDate?(' ~ '+p.endDate):'');
      const stBadge=st!=='active'?'<span class="pill">'+PB_STATUS_LABEL[st]+'</span>':'';
      const setBadge=pbSettleBadge(p);
      return '<div class="card" '+App.view.act('openPbDetail',p.id)+'><div class="row"><b><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:'+(p.themeColor||'#3182f6')+';margin-right:6px;"></span>'+(p.icon||'📒')+' '+escapeHtml(p.name)+' '+stBadge+'</b><span class="pill">'+pbTypeText(p)+'</span></div>'+
        '<div class="tx-sub" style="margin-top:6px;">'+period+(p.participants&&p.participants.length?(' · 참여 '+p.participants.length+'명'):'')+(setBadge?(' '+setBadge):'')+'</div>'+
        (p.budgetAmount?('<div class="bar" style="margin-top:8px;"><i style="width:'+Math.min(u.pct,100)+'%;background:'+c+'"></i></div><div class="row" style="margin-top:6px;"><span class="tx-sub">'+won(u.used)+' / '+won(u.amount)+'</span><span class="tx-sub" style="color:'+c+'">'+u.pct+'%</span></div>'):('<div class="tx-sub" style="margin-top:8px;">사용 '+won(u.used)+'</div>'))+'</div>';
    }
    let pbDetailTab='tx';
    function openPbDetail(id, tab){
      const p=state.purposeBooks.find(x=>x.id===id); if(!p) return;
      const settleOn=!!p.settlementEnabled;
      if(tab) pbDetailTab=tab;
      if(!settleOn) pbDetailTab='tx';
      const u=pbUsage(p), c=budgetColor(u.pct);
      let h='<div class="card"><div class="row"><b style="font-size:18px;">'+(p.icon||'📒')+' '+escapeHtml(p.name)+'</b><span class="pill">'+pbTypeText(p)+'</span></div>'+
        '<div class="tx-sub" style="margin-top:6px;">'+((p.startDate||'')+(p.endDate?(' ~ '+p.endDate):''))+(p.participants&&p.participants.length?(' · '+escapeHtml(p.participants.join(', '))):'')+'</div>'+
        (p.budgetAmount?('<div class="bar" style="margin-top:10px;"><i style="width:'+Math.min(u.pct,100)+'%;background:'+c+'"></i></div><div class="row" style="margin-top:6px;"><span class="tx-sub">'+won(u.used)+' / '+won(u.amount)+'</span><span class="tx-sub" style="color:'+c+'">남음 '+won(u.remain)+'</span></div>'):('<div class="tx-sub" style="margin-top:8px;">사용 '+won(u.used)+'</div>'))+'</div>';
      if(settleOn){
        h+='<div class="chip-row">'+[['tx','거래'],['settle','정산']].map(o=>'<button class="chip '+(pbDetailTab===o[0]?'on':'')+'" '+App.view.act('setPbDetailTab',p.id,o[0])+'>'+o[1]+'</button>').join('')+'</div>';
      }
      h+= (settleOn && pbDetailTab==='settle') ? renderPbSettleTab(p) : renderPbTxTab(p,u);
      if(pbDetailTab!=='settle') h+=pbTodoSummaryHtml(p.id);   // 연결된 할일(여행 준비물 등)
      h+='<button class="btn ghost" '+App.view.act('openPbEdit',p.id)+'>설정 수정</button>';
      openSheet(p.name, h);
      state._sheetReopen=()=>openPbDetail(id);   // ↩️ 거래 수정 시트 닫으면 이 목적별 상세로 복귀(탭은 pbDetailTab 유지)
    }
    function setPbDetailTab(id,tab){ pbDetailTab=tab; openPbDetail(id,tab); }
    // 여행 PB: 통화별 지출 요약(외화가 있을 때만). 원통화 원금 + 원화 환산 병기.
    function currencySummaryHtml(txs){ const by=sumByCurrency(txs); const codes=Object.keys(by);
      if(!codes.some(c=>c!=='KRW')) return '';
      const order=codes.sort((a,b)=>by[b].krw-by[a].krw); const totalKrw=codes.reduce((s,c)=>s+by[c].krw,0);
      return '<div class="card"><div class="sec-title" style="margin:0 0 8px;">통화별</div>'+
        order.map(c=>'<div class="row" style="padding:5px 0;"><span>'+escapeHtml(curInfo(c).name)+'</span><span><b>'+escapeHtml(fmtForeign(by[c].foreign,c))+'</b>'+(c!=='KRW'?'<span class="tx-sub" style="margin-left:6px;">'+won(by[c].krw)+'</span>':'')+'</span></div>').join('')+
        '<div class="row" style="padding:6px 0 0;border-top:1px solid var(--line-soft);margin-top:4px;"><span class="tx-sub">원화 합계</span><b>'+won(totalKrw)+'</b></div></div>';
    }
    function renderPbTxTab(p,u){
      const allTx=pbTxs(p).sort((a,b)=>new Date(b.date)-new Date(a.date));
      const byCat={}; u.txs.forEach(t=>{ const k=t.category||'기타'; byCat[k]=(byCat[k]||0)+(Number(t.amount)||0); });
      const catKeys=Object.keys(byCat).sort((a,b)=>byCat[b]-byCat[a]);
      let h=currencySummaryHtml(u.txs);
      if(catKeys.length) h+='<div class="card"><div class="sec-title" style="margin:0 0 8px;">카테고리별</div>'+catKeys.map(k=>'<div class="row" style="padding:5px 0;"><span>'+catIcon(k)+' '+escapeHtml(k)+'</span><b>'+won(byCat[k])+'</b></div>').join('')+'</div>';
      h+='<div class="chip-row">'+['active','completed','archived'].map(st=>'<button class="chip '+((p.status||'active')===st?'on':'')+'" '+App.view.act('setPbStatus',p.id,st)+'>'+PB_STATUS_LABEL[st]+'</button>').join('')+'</div>';
      h+='<button class="btn" '+App.view.act('openTxSheet',null,null,null,p.id)+'>+ 이 가계부에 지출 추가</button>';
      h+='<div class="sec-title" style="margin-left:2px;">거래 ('+allTx.length+')</div>';
      h+='<div class="card" style="padding:6px 10px;">'+(allTx.length?allTx.map(txRowHtml).join(''):'<div class="empty">연결된 거래 없음</div>')+'</div>';
      return h;
    }
    function renderPbSettleTab(p){
      const s=pbSettleSummary(p);
      let h='<div class="card"><div class="summary">'+
        '<div><div class="s-label">총 공동지출</div><div class="s-val">'+won(s.totalSpend)+'</div></div>'+
        '<div><div class="s-label">정산대상</div><div class="s-val">'+s.txCount+'건</div></div>'+
        '<div><div class="s-label">완료율</div><div class="s-val">'+s.settledPct+'%</div></div></div>'+
        '<div class="bar" style="margin-top:10px;"><i style="width:'+s.settledPct+'%;background:var(--primary)"></i></div>'+
        '<div class="row" style="margin-top:6px;font-size:12px;"><span class="muted">미정산 <b style="color:var(--expense)">'+won(s.unsettledAmount)+'</b></span><span class="muted">완료 <b>'+won(s.settledAmount)+'</b></span></div></div>';
      if(s.perPerson.length){
        h+='<div class="card"><div class="sec-title" style="margin:0 0 8px;">참여자별</div>'+s.perPerson.map(pp=>{
          const bal=pp.balance, tag = bal>0?('<span style="color:var(--income)">'+won(bal)+' 받을 예정</span>'):(bal<0?('<span style="color:var(--expense)">'+won(-bal)+' 보낼 예정</span>'):'<span class="muted">정산 없음</span>');
          return '<div style="padding:6px 0;border-top:1px solid var(--line-soft);"><div class="row"><b>'+escapeHtml(pp.name)+'</b>'+tag+'</div><div class="tx-sub" style="margin-top:2px;">결제 '+won(pp.paid)+' · 부담 '+won(pp.owed)+'</div></div>';
        }).join('')+'</div>';
      }
      h+='<div class="sec-title" style="margin-left:2px;">정산 제안</div>';
      window._settleSug=s.suggestions;
      if(s.suggestions.length){
        h+='<div class="card" style="padding:6px 10px;">'+s.suggestions.map((g,i)=>
          '<div class="row" style="padding:8px 2px;"><span><b>'+escapeHtml(g.from)+'</b> → <b>'+escapeHtml(g.to)+'</b></span>'+
          '<span style="display:flex;align-items:center;gap:8px;"><b>'+won(g.amount)+'</b><button class="chip" '+App.view.act('openSettlePay',p.id,i)+'>완료</button></span></div>').join('')+'</div>';
      } else {
        h+='<div class="card"><div class="empty">'+(s.neededAmount>0?'모든 정산이 완료되었습니다 🎉':'정산할 송금이 없습니다')+'</div></div>';
      }
      if(s.payments.length){
        h+='<div class="sec-title" style="margin-left:2px;">완료 내역</div>';
        h+='<div class="card" style="padding:6px 10px;">'+s.payments.slice().sort((a,b)=>(b.paymentDate||'').localeCompare(a.paymentDate||'')).map(x=>
          '<div class="row" style="padding:8px 2px;"><span>'+escapeHtml(x.fromPerson)+' → '+escapeHtml(x.toPerson)+' <span class="tx-sub">'+(x.paymentDate||'')+(x.memo?(' · '+escapeHtml(x.memo)):'')+'</span></span>'+
          '<span style="display:flex;align-items:center;gap:8px;"><b>'+won(x.amount)+'</b><button class="chip" '+App.view.act('cancelSettlementPayment',x.ownerUid,x.id,p.id)+'>취소</button></span></div>').join('')+'</div>';
      }
      h+='<div class="sec-title" style="margin-left:2px;">정산 대상 거래 ('+s.txCount+')</div>';
      h+='<div class="card" style="padding:6px 10px;">'+(s.txs.length?s.txs.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map(txRowHtml).join(''):'<div class="empty">정산 포함 거래 없음</div>')+'</div>';
      h+='<button class="btn" '+App.view.act('openTxSheet',null,null,null,p.id)+'>+ 이 가계부에 지출 추가</button>';
      return h;
    }
    // 송금 완료 입력 시트
    function openSettlePay(pbId, idx){
      const g=(window._settleSug||[])[idx]; if(!g) return;
      window._pendingPay={ pbId, from:g.from, to:g.to, amount:g.amount };
      const accts=visibleAccounts();
      let h='<div class="card" style="padding:14px;"><div class="row"><b>'+escapeHtml(g.from)+' → '+escapeHtml(g.to)+'</b><b>'+won(g.amount)+'</b></div></div>';
      h+='<div class="field"><label>송금일</label><input type="date" class="input" id="sStpDate" value="'+todayStr()+'"></div>';
      h+='<div class="field"><label>메모(선택)</label><input class="input" id="sStpMemo" placeholder="예: 계좌이체 완료"></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>실제 이체 거래로도 기록</span><div class="switch" id="sStpTx" onclick="this.classList.toggle(\'on\');$(\'sStpAcct\').style.display=this.classList.contains(\'on\')?\'\':\'none\'"><i></i></div></div>';
      h+='<div id="sStpAcct" style="display:none;">'+(accts.length?(
        '<div class="form-2"><div class="field"><label>보내는 계좌</label><select class="input" id="sStpFrom">'+accts.map(a=>'<option value="'+a.id+'">'+escapeHtml(a.name)+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>받는 계좌</label><select class="input" id="sStpTo">'+accts.map(a=>'<option value="'+a.id+'">'+escapeHtml(a.name)+'</option>').join('')+'</select></div></div>'+
        '<div class="tx-sub">정산 송금을 이체 거래로 기록합니다(실제소비에는 미포함).</div>'
      ):'<div class="tx-sub">계좌가 없어 이체 거래를 만들 수 없습니다.</div>')+'</div>';
      h+='<button class="btn" '+App.view.act('saveSettlementPayment')+'>완료 처리</button>';
      openSheet('정산 송금 완료', h);
    }
    function saveSettlementPayment(){
      const pp=window._pendingPay; if(!pp){ closeSheet(); return; }
      const pb=state.purposeBooks.find(x=>x.id===pp.pbId);
      const now=new Date().toISOString(), date=val('sStpDate')||todayStr();
      const id='stp_'+Date.now();
      const rec={ id, owner:state.userName, purposeBookId:pp.pbId, fromPerson:pp.from, toPerson:pp.to,
        amount:pp.amount, paymentDate:date, status:'paid', memo:val('sStpMemo').trim(), createdAt:now, updatedAt:now };
      const makeTx = $('sStpTx')&&$('sStpTx').classList.contains('on');
      if(makeTx && $('sStpFrom') && $('sStpTo')){
        const fa=val('sStpFrom'), ta=val('sStpTo');
        if(fa && ta && fa!==ta){
          const txId=Date.now();
          db.ref(wp('transactions/'+state.uid+'/'+txId)).set({ type:'transfer', date:isoAtNoon(date), user:state.userName,   // 다른 거래와 동일한 정오 고정(정렬·날짜 밀림 방지)
            amount:pp.amount, desc:'정산 '+pp.from+'→'+pp.to, from:fa, to:ta, isActualExpense:false,
            purposeBookId:pp.pbId, purposeBookName:pb?pb.name:'', settlementIncluded:false, splitType:'none', settlementStatus:'none' });
          rec.linkedTransactionId=String(txId);
        }
      }
      db.ref(wp('settlementPayments/'+state.uid+'/'+id)).set(rec);
      window._pendingPay=null; toast('정산 완료 처리했어요'); openPbDetail(pp.pbId,'settle');
    }
    function cancelSettlementPayment(ownerUid, id, pbId){
      confirmSheet('이 정산 완료 기록을 취소할까요?', ()=>{ db.ref(wp('settlementPayments/'+ownerUid+'/'+id)).remove(); toast('취소했어요'); openPbDetail(pbId,'settle'); });
    }
    function setPbStatus(id,st){ db.ref(wp('purposeBooks/'+id)).update({status:st, updatedAt:new Date().toISOString()}); toast(PB_STATUS_LABEL[st]); openPbDetail(id); }
    function onPbTypeChange(){ const w=$('pbCustomWrap'); if(w) w.style.display=(val('pbType')==='custom')?'':'none'; }
    function pickPbColor(el){ el=el||this; window._pbColor=el.dataset.color; document.querySelectorAll('#pbColors button').forEach(b=>b.style.border='2px solid transparent'); el.style.border='2px solid var(--text)'; }
    function openPbEdit(id){
      const p=id?state.purposeBooks.find(x=>x.id===id):null;
      window._pbColor=p?(p.themeColor||'#3182f6'):'#3182f6';
      let h='<div class="field"><label>이름</label><input class="input" id="pbName" value="'+escapeHtml(p?p.name:'')+'" placeholder="예: 일본여행, 친구 계모임"></div>';
      h+='<div class="field"><label>유형</label><select class="input" id="pbType" '+App.view.chg('onPbTypeChange')+'>'+PB_TYPES.map(t=>'<option value="'+t[0]+'"'+(((p&&p.type===t[0])||(!p&&t[0]==='travel'))?' selected':'')+'>'+t[1]+'</option>').join('')+'</select></div>';
      h+='<div class="field" id="pbCustomWrap" style="'+((p&&p.type==='custom')?'':'display:none;')+'"><label>유형명 직접 입력</label><input class="input" id="pbCustomName" value="'+escapeHtml(p?(p.customTypeName||''):'')+'" placeholder="예: 제주살이"></div>';
      h+='<div class="field"><label>참여자 (쉼표로 구분)</label><input class="input" id="pbParticipants" value="'+escapeHtml(p&&p.participants?p.participants.join(', '):state.userName)+'" placeholder="예: 나, 친구1, 친구2"></div>';
      h+='<div class="form-2"><div class="field"><label>예산(선택)</label><input class="input" id="pbBudget" inputmode="numeric" value="'+(p&&p.budgetAmount?Number(p.budgetAmount).toLocaleString():'')+'" placeholder="0" oninput="this.value=fmtComma(this.value)"></div>'+
        '<div class="field"><label>아이콘</label><input class="input" id="pbIcon" maxlength="2" value="'+escapeHtml(p?(p.icon||''):'')+'" placeholder="📒"></div></div>';
      h+='<div class="form-2"><div class="field"><label>시작일</label><input type="date" class="input" id="pbStart" value="'+(p&&p.startDate?p.startDate:todayStr())+'"></div>'+
        '<div class="field"><label>종료일(선택)</label><input type="date" class="input" id="pbEnd" value="'+(p&&p.endDate?p.endDate:'')+'"></div></div>';
      h+='<details class="adv"><summary>상세 설정</summary>';
      h+='<label style="font-size:13px;font-weight:600;color:var(--sub);">테마 색상</label><div class="chip-row" id="pbColors" style="margin:8px 0 12px;">'+CAT_PALETTE.map(c=>'<button class="chip" style="background:'+c+';width:32px;height:32px;border-radius:50%;border:2px solid '+(c===window._pbColor?'var(--text)':'transparent')+';" data-color="'+c+'" '+App.view.act('pickPbColor')+'></button>').join('')+'</div>';
      h+='<div class="form-2"><div class="field"><label>기준 통화</label><select class="input" id="pbCurrency">'+curOptions(p?(p.baseCurrency||'KRW'):'KRW')+'</select></div>'+
        '<div class="field"><label>커버 이미지 URL</label><input class="input" id="pbCover" value="'+escapeHtml(p?(p.coverImageUrl||''):'')+'" placeholder="https://"></div></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>정산 사용</span><div class="switch '+((p&&p.settlementEnabled)?'on':'')+'" id="pbSettle" '+App.view.act('toggleSwitch')+'><i></i></div></div>';
      h+='<div class="field"><label>공개 범위</label><select class="input" id="pbVis">'+VISIBILITY.map(v=>'<option value="'+v[0]+'"'+(((p&&p.visibility===v[0])||(!p&&v[0]===defaultVisibility()))?' selected':'')+'>'+v[1]+'</option>').join('')+'</select></div>';
      h+='<div class="field"><label>메모</label><input class="input" id="pbMemo" value="'+escapeHtml(p?(p.memo||''):'')+'" placeholder="메모"></div>';
      h+='</details>';
      h+='<button class="btn" '+App.view.act('savePb', id?id:null)+'>'+(p?'수정':'추가')+'</button>';
      if(p) h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deletePb',id)+'>삭제</button>';
      openSheet(p?'목적별 가계부 수정':'목적별 가계부 추가', h);
    }
    function savePb(id){
      const name=val('pbName').trim(); if(!name){ toast('이름을 입력하세요', true); return; }
      const p=id?state.purposeBooks.find(x=>x.id===id):null;
      const vis=val('pbVis')||'full', now=new Date().toISOString();
      const participants=val('pbParticipants').split(',').map(s=>s.trim()).filter(Boolean);
      const data={ name, type:val('pbType'), customTypeName: val('pbType')==='custom'?(val('pbCustomName').trim()||'기타'):'',
        participants, budgetAmount:parseAmount(val('pbBudget')), baseCurrency:val('pbCurrency')||'KRW',
        themeColor:window._pbColor||'#3182f6', icon:val('pbIcon').trim()||'📒', coverImageUrl:val('pbCover').trim()||'',
        startDate:val('pbStart')||todayStr(), endDate:val('pbEnd')||null,
        settlementEnabled: $('pbSettle')?$('pbSettle').classList.contains('on'):false,
        visibility:vis, status: p?(p.status||'active'):'active',
        owner: p?(p.owner||(vis==='private'?state.userName:defaultOwnerName())):(vis==='private'?state.userName:defaultOwnerName()),
        memo:val('pbMemo').trim(), createdAt: p?(p.createdAt||now):now, updatedAt:now };
      const key=id||('pb_'+Date.now());
      db.ref(wp('purposeBooks/'+key)).set(data).catch(_saveErr); toast(p?'수정되었습니다':'추가되었습니다'); openPurposeBooks();
    }
    function deletePb(id){ confirmSheet('이 목적별 가계부를 삭제할까요? (연결된 거래는 유지됩니다)', ()=>{ db.ref(wp('purposeBooks/'+id)).remove(); toast('삭제되었습니다'); openPurposeBooks(); }); }

    // ===== 경조사비 (Gift / 경조사) =====
    // people: 인맥 명부 / giftEvents: 주고받은 기록 / plannedGiftEvents: 예정.
    // 경조사비 given=지출(경조사), received=수입(경조사비 수령). 옵션으로 실제 거래를 생성·연결(giftEventId).
    let giftTab='log';
    function visibleGifts(){ return state.giftEvents.filter(canSee); }
    function giftEventIcon(t){ return GIFT_EVENT_ICON[t]||'🎀'; }
    function giftSvgIcon(t){ return svgWrap(CAT_SVG[GIFT_SVG_KEY[t]||'gift']); }
    function giftSummary(){ let given=0,received=0; visibleGifts().forEach(g=>{ const a=Math.abs(Number(g.amount)||0); if(g.direction==='received') received+=a; else given+=a; }); return { given, received, count:visibleGifts().length }; }
    function personGiftTotals(pid, pname){ let given=0,received=0; visibleGifts().forEach(g=>{ if(g.personId===pid || (pname&&g.personName===pname)){ const a=Math.abs(Number(g.amount)||0); if(g.direction==='received') received+=a; else given+=a; } }); return { given, received }; }

    function openGiftBook(tab){ giftTab=tab||giftTab||'log'; renderGiftBook(); }
    function setGiftTab(t){ giftTab=t; renderGiftBook(); }
    function renderGiftBook(){
      const s=giftSummary();
      let h='<div class="card"><div class="summary">'+
        '<div><div class="s-label">보냄</div><div class="s-val red">'+won(s.given)+'</div></div>'+
        '<div><div class="s-label">받음</div><div class="s-val green">'+won(s.received)+'</div></div>'+
        '<div><div class="s-label">순</div><div class="s-val">'+won(s.received-s.given)+'</div></div></div></div>';
      h+='<div class="chip-row">'+[['log','기록'],['planned','예정'],['people','인맥']].map(o=>'<button class="chip '+(giftTab===o[0]?'on':'')+'" '+App.view.act('setGiftTab',o[0])+'>'+o[1]+'</button>').join('')+'</div>';
      h+= giftTab==='planned'?renderGiftPlanned() : (giftTab==='people'?renderGiftPeople() : renderGiftLog());
      openSheet('경조사비', h);
    }
    function giftRow(g){
      const given=g.direction!=='received', sign=given?'-':'+', cls=given?'red':'green';
      return '<div class="tx" '+App.view.act('openGiftEdit',g.id)+'>'+
        '<div class="tx-ic">'+giftSvgIcon(g.eventType)+'</div>'+
        '<div class="tx-main"><div class="tx-title">'+escapeHtml(g.personName||'')+' <span class="pill">'+(GIFT_EVENT_LABEL[g.eventType]||g.eventType||'')+'</span>'+(g.linkedTransactionId?'<span class="pill">🧾</span>':'')+'</div>'+
        '<div class="tx-sub">'+(g.date||'')+' · '+(GIFT_DIR_LABEL[g.direction]||'')+(g.relation?(' · '+(REL_LABEL[g.relation]||g.relation)):'')+'</div></div>'+
        '<div class="tx-amt '+cls+'">'+sign+'₩'+Math.abs(Number(g.amount)||0).toLocaleString()+'</div></div>';
    }
    function renderGiftLog(){
      const list=visibleGifts().slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
      let h='<button class="btn" '+App.view.act('openGiftEdit')+'>+ 경조사비 기록 추가</button>';
      h+='<div class="card" style="padding:6px 10px;">'+(list.length?list.map(giftRow).join(''):'<div class="empty">기록이 없습니다</div>')+'</div>';
      return h;
    }
    function renderGiftPlanned(){
      const list=state.plannedGiftEvents.filter(canSee).slice().sort((a,b)=>(a.date||'').localeCompare(b.date||''));
      let h='<button class="btn" '+App.view.act('openPlannedEdit')+'>+ 경조사 예정 추가</button>';
      if(!list.length) return h+'<div class="card"><div class="empty">예정된 경조사가 없습니다</div></div>';
      h+='<div class="card" style="padding:6px 10px;">'+list.map(pl=>{
        const st=pl.status||'planned';
        return '<div class="tx"><div class="tx-ic">'+giftSvgIcon(pl.eventType)+'</div>'+
          '<div class="tx-main" '+App.view.act('openPlannedEdit',pl.id)+'><div class="tx-title">'+escapeHtml(pl.personName||'')+' <span class="pill">'+(GIFT_EVENT_LABEL[pl.eventType]||pl.eventType||'')+'</span> <span class="pill">'+(PLANNED_STATUS_LABEL[st]||st)+'</span></div>'+
          '<div class="tx-sub">'+(pl.date||'')+(pl.expectedAmount?(' · 예상 '+won(pl.expectedAmount)):'')+'</div></div>'+
          (st==='planned'?'<button class="chip" '+App.view.act('completePlanned',pl.id)+'>완료</button>':'')+'</div>';
      }).join('')+'</div>';
      return h;
    }
    function renderGiftPeople(){
      const list=state.people.filter(canSee).slice().sort((a,b)=>(a.name||'').localeCompare(b.name||''));
      let h='<button class="btn" '+App.view.act('openPersonEdit')+'>+ 인맥 추가</button>';
      if(!list.length) return h+'<div class="card"><div class="empty">등록된 인맥이 없습니다</div></div>';
      h+='<div class="card" style="padding:6px 10px;">'+list.map(p=>{
        const t=personGiftTotals(p.id,p.name);
        return '<div class="tx" '+App.view.act('openPersonEdit',p.id)+'><div class="tx-ic">'+svgWrap(CAT_SVG.user)+'</div>'+
          '<div class="tx-main"><div class="tx-title">'+escapeHtml(p.name||'')+(p.relation?' <span class="pill">'+(REL_LABEL[p.relation]||p.relation)+'</span>':'')+'</div>'+
          '<div class="tx-sub">보냄 '+won(t.given)+' · 받음 '+won(t.received)+'</div></div></div>';
      }).join('')+'</div>';
      return h;
    }

    // 경조사비 기록 입력/수정 (pf: 예정→완료 시 프리필)
    function openGiftEdit(id, pf){
      const g=id?state.giftEvents.find(x=>x.id===id):null;
      const dir=g?(g.direction||'given'):'given';
      window._gDir=dir;
      const names=Array.from(new Set(state.people.map(p=>p.name).filter(Boolean)));
      const amount=g?g.amount:(pf&&pf.amount?pf.amount:'');
      const pname=g?g.personName:(pf?pf.personName:'');
      const etype=g?g.eventType:(pf?pf.eventType:'wedding');
      let h='<div class="type-seg" id="gDirSeg" style="margin-bottom:12px;">'+
        [['given','줌(지출)'],['received','받음(수입)']].map(o=>'<button class="'+(dir===o[0]?'on':'')+'" '+App.view.act('setGiftDir',o[0])+'>'+o[1]+'</button>').join('')+'</div>';
      h+='<div class="amount-wrap"><span class="cur">₩</span><input class="amount-input" id="gAmount" inputmode="numeric" placeholder="0" value="'+(amount?Number(amount).toLocaleString():'')+'" oninput="this.value=fmtComma(this.value)"></div>';
      h+='<div class="field"><label>상대(이름)</label><input class="input" id="gPerson" list="gPeopleList" value="'+escapeHtml(pname)+'" placeholder="예: 홍길동"><datalist id="gPeopleList">'+names.map(n=>'<option value="'+escapeHtml(n)+'"></option>').join('')+'</datalist></div>';
      h+='<div class="form-2"><div class="field"><label>관계</label><select class="input" id="gRel">'+REL_TYPES.map(r=>'<option value="'+r[0]+'"'+((g&&g.relation===r[0])?' selected':'')+'>'+r[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>경조사 유형</label><select class="input" id="gType">'+GIFT_EVENT_TYPES.map(e=>'<option value="'+e[0]+'"'+((etype===e[0])?' selected':'')+'>'+e[1]+'</option>').join('')+'</select></div></div>';
      h+='<div class="field"><label>날짜</label><input type="date" class="input" id="gDate" value="'+(g&&g.date?g.date:(pf&&pf.date?pf.date:todayStr()))+'"></div>';
      const txOn = g? !!g.linkedTransactionId : true;
      h+='<div class="menu-item" style="padding:8px 2px;"><span>🧾 가계부 거래로도 기록</span><div class="switch '+(txOn?'on':'')+'" id="gTx" '+App.view.act('toggleSwitch','toggleGiftAcct')+'><i></i></div></div>';
      h+='<div id="gAcctWrap" style="'+(txOn?'':'display:none;')+'"><div class="field"><label>계좌(거래 기록 시)</label><select class="input" id="gAcct">'+acctOptsHtml((g&&g.linkedAccount)||(state.accounts[0]?state.accounts[0].id:''))+'</select></div></div>';
      h+='<details class="adv"><summary>상세 설정</summary>';
      h+='<div class="field"><label>메모</label><input class="input" id="gMemo" value="'+escapeHtml(g?(g.memo||''):'')+'" placeholder="메모"></div>';
      h+='<div class="field"><label>공개 범위</label><select class="input" id="gVis">'+VISIBILITY.map(v=>'<option value="'+v[0]+'"'+(((g&&g.visibility===v[0])||(!g&&v[0]===defaultVisibility()))?' selected':'')+'>'+v[1]+'</option>').join('')+'</select></div>';
      h+='</details>';
      h+='<button class="btn" '+App.view.act('saveGiftEvent', id?id:null)+'>'+(g?'수정':'저장')+'</button>';
      if(g) h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deleteGiftEvent',id)+'>삭제</button>';
      openSheet(g?'경조사비 수정':'경조사비 기록', h);
    }
    function setGiftDir(d){ window._gDir=d; const seg=$('gDirSeg'); if(seg){ [...seg.children].forEach((b,i)=>b.classList.toggle('on', (d==='given'?0:1)===i)); } }
    function toggleGiftAcct(){ const on=$('gTx')&&$('gTx').classList.contains('on'); const w=$('gAcctWrap'); if(w) w.style.display=on?'':'none'; }
    function saveGiftEvent(id){
      const amount=parseAmount(val('gAmount'));
      if(!amount){ toast('금액을 입력하세요', true); return; }
      const personName=val('gPerson').trim();
      if(!personName){ toast('상대 이름을 입력하세요', true); return; }
      const dir=window._gDir||'given', relation=val('gRel'), eventType=val('gType'), date=val('gDate')||todayStr();
      const memo=val('gMemo').trim(), vis=val('gVis')||'full', now=new Date().toISOString();
      const g=id?state.giftEvents.find(x=>x.id===id):null;
      const key=id||('gift_'+Date.now());
      // 인맥 자동 등록/매칭
      let person=state.people.find(p=>p.name===personName);
      if(!person){ const pid='per_'+Date.now(); db.ref(wp('people/'+pid)).set({ name:personName, relation, memo:'', createdAt:now, updatedAt:now }); person={id:pid, name:personName}; }
      // 거래 기록(옵션)
      const txOn = $('gTx')&&$('gTx').classList.contains('on');
      let linkedTransactionId = g?(g.linkedTransactionId||null):null;
      let linkedAccount = $('gAcct')?val('gAcct'):(g?g.linkedAccount:'');
      if(txOn){
        const acct=linkedAccount||(state.accounts[0]&&state.accounts[0].id)||'';
        const given=dir!=='received', iso=isoAtNoon(date);
        const txObj={ type:given?'expense':'income', date:iso, user:state.userName, amount, category:given?'경조사':'경조사비 수령',
          desc:personName+' '+(GIFT_EVENT_LABEL[eventType]||eventType)+' '+(GIFT_DIR_LABEL[dir]||''), isActualExpense:given, giftEventId:key, memo };
        if(given) txObj.from=acct; else txObj.to=acct;
        const txId = linkedTransactionId || String(Date.now());
        db.ref(wp('transactions/'+state.uid+'/'+txId)).set(txObj);
        linkedTransactionId=txId; linkedAccount=acct;
      } else if(linkedTransactionId){
        db.ref(wp('transactions/'+state.uid+'/'+linkedTransactionId)).remove(); linkedTransactionId=null;
      }
      const data={ id:key, personId:person.id, personName, relation, eventType, direction:dir, amount, date, memo,
        linkedTransactionId, linkedAccount: linkedAccount||'', owner: g?(g.owner||state.userName):state.userName, visibility:vis,
        createdAt: g?(g.createdAt||now):now, updatedAt:now };
      db.ref(wp('giftEvents/'+key)).set(data);
      toast(g?'수정되었습니다':'저장되었습니다'); openGiftBook('log');
    }
    function deleteGiftEvent(id){
      const g=state.giftEvents.find(x=>x.id===id); if(!g) return;
      confirmSheet('이 경조사비 기록을 삭제할까요?'+(g.linkedTransactionId?' (연결된 거래도 삭제됩니다)':''), ()=>{
        if(g.linkedTransactionId) db.ref(wp('transactions/'+state.uid+'/'+g.linkedTransactionId)).remove();
        db.ref(wp('giftEvents/'+id)).remove(); toast('삭제되었습니다'); openGiftBook('log');
      });
    }

    // 경조사 예정
    function openPlannedEdit(id){
      const pl=id?state.plannedGiftEvents.find(x=>x.id===id):null;
      const names=Array.from(new Set(state.people.map(p=>p.name).filter(Boolean)));
      let h='<div class="field"><label>상대(이름)</label><input class="input" id="plPerson" list="plPeopleList" value="'+escapeHtml(pl?pl.personName:'')+'" placeholder="예: 홍길동"><datalist id="plPeopleList">'+names.map(n=>'<option value="'+escapeHtml(n)+'"></option>').join('')+'</datalist></div>';
      h+='<div class="form-2"><div class="field"><label>경조사 유형</label><select class="input" id="plType">'+GIFT_EVENT_TYPES.map(e=>'<option value="'+e[0]+'"'+(((pl&&pl.eventType===e[0])||(!pl&&e[0]==='wedding'))?' selected':'')+'>'+e[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>예상 금액</label><input class="input" id="plAmount" inputmode="numeric" value="'+(pl&&pl.expectedAmount?Number(pl.expectedAmount).toLocaleString():'')+'" placeholder="0" oninput="this.value=fmtComma(this.value)"></div></div>';
      h+='<div class="field"><label>날짜</label><input type="date" class="input" id="plDate" value="'+(pl&&pl.date?pl.date:todayStr())+'"></div>';
      h+='<div class="field"><label>메모</label><input class="input" id="plMemo" value="'+escapeHtml(pl?(pl.memo||''):'')+'" placeholder="메모"></div>';
      if(pl) h+='<div class="field"><label>상태</label><select class="input" id="plStatus">'+Object.keys(PLANNED_STATUS_LABEL).map(st=>'<option value="'+st+'"'+(((pl.status||'planned')===st)?' selected':'')+'>'+PLANNED_STATUS_LABEL[st]+'</option>').join('')+'</select></div>';
      h+='<button class="btn" '+App.view.act('savePlanned', id?id:null)+'>'+(pl?'수정':'추가')+'</button>';
      if(pl) h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deletePlanned',id)+'>삭제</button>';
      openSheet(pl?'경조사 예정 수정':'경조사 예정 추가', h);
    }
    function savePlanned(id){
      const personName=val('plPerson').trim(); if(!personName){ toast('상대 이름을 입력하세요', true); return; }
      const now=new Date().toISOString(), pl=id?state.plannedGiftEvents.find(x=>x.id===id):null;
      const data={ personName, eventType:val('plType'), expectedAmount:parseAmount(val('plAmount')), date:val('plDate')||todayStr(),
        memo:val('plMemo').trim(), status:($('plStatus')?val('plStatus'):(pl?(pl.status||'planned'):'planned')),
        createdAt: pl?(pl.createdAt||now):now, updatedAt:now };
      const key=id||('plan_'+Date.now());
      db.ref(wp('plannedGiftEvents/'+key)).set(data).catch(_saveErr); toast(pl?'수정되었습니다':'추가되었습니다'); openGiftBook('planned');
    }
    function deletePlanned(id){ confirmSheet('이 예정을 삭제할까요?', ()=>{ db.ref(wp('plannedGiftEvents/'+id)).remove(); toast('삭제되었습니다'); openGiftBook('planned'); }); }
    function completePlanned(id){
      const pl=state.plannedGiftEvents.find(x=>x.id===id); if(!pl) return;
      db.ref(wp('plannedGiftEvents/'+id)).update({ status:'completed', updatedAt:new Date().toISOString() });
      toast('완료 — 기록을 추가하세요');
      openGiftEdit(null, { personName:pl.personName, eventType:pl.eventType, amount:pl.expectedAmount, date:pl.date });
    }

    // 인맥
    function openPersonEdit(id){
      const p=id?state.people.find(x=>x.id===id):null;
      let h='<div class="field"><label>이름</label><input class="input" id="perName" value="'+escapeHtml(p?p.name:'')+'" placeholder="예: 홍길동"></div>';
      h+='<div class="field"><label>관계</label><select class="input" id="perRel">'+REL_TYPES.map(r=>'<option value="'+r[0]+'"'+((p&&p.relation===r[0])?' selected':'')+'>'+r[1]+'</option>').join('')+'</select></div>';
      h+='<div class="field"><label>메모</label><input class="input" id="perMemo" value="'+escapeHtml(p?(p.memo||''):'')+'" placeholder="메모"></div>';
      if(p){ const t=personGiftTotals(p.id,p.name); h+='<div class="card" style="margin:4px 0;"><div class="row" style="padding:4px 0;"><span class="tx-sub">보냄 합계</span><b class="red">'+won(t.given)+'</b></div><div class="row" style="padding:4px 0;"><span class="tx-sub">받음 합계</span><b class="green">'+won(t.received)+'</b></div></div>'; }
      h+='<button class="btn" '+App.view.act('savePerson', id?id:null)+'>'+(p?'수정':'추가')+'</button>';
      if(p) h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deletePerson',id)+'>삭제</button>';
      openSheet(p?'인맥 수정':'인맥 추가', h);
    }
    function savePerson(id){
      const name=val('perName').trim(); if(!name){ toast('이름을 입력하세요', true); return; }
      const now=new Date().toISOString(), p=id?state.people.find(x=>x.id===id):null;
      const data={ name, relation:val('perRel'), memo:val('perMemo').trim(), createdAt:p?(p.createdAt||now):now, updatedAt:now };
      const key=id||('per_'+Date.now());
      db.ref(wp('people/'+key)).set(data).catch(_saveErr); toast(p?'수정되었습니다':'추가되었습니다'); openGiftBook('people');
    }
    function deletePerson(id){ confirmSheet('이 인맥을 삭제할까요? (경조사비 기록은 유지됩니다)', ()=>{ db.ref(wp('people/'+id)).remove(); toast('삭제되었습니다'); openGiftBook('people'); }); }

    // ===== 대출 / 이자 =====
    // loans: 빌림(borrowed=내 빚)·빌려줌(lent=받을 돈) / loanPayments: 상환 기록(원금+이자).
    // 잔액·이자는 loanCalc()로 계산. 상환 기록 시 원금·이자 각각을 실제 거래로 연결(계좌 잔액 반영, 따로 입력 불필요):
    // 이자=실지출/실수입(대출 비용·이자 수입, isActualExpense=borrowed), 원금=부채 상환이라 잔액엔 반영하되 실지출 통계엔 제외(isActualExpense:false).
    // linkedTransactionId=이자 거래, linkedPrincipalTxId=원금 거래.
    function openLoanBook(){
      const s=loanSummary(), list=visibleLoans().slice().sort((a,b)=>(b.startDate||'').localeCompare(a.startDate||''));
      let h='<div class="card"><div class="summary">'+
        '<div><div class="s-label">빌린 잔액</div><div class="s-val red">'+won(s.borrowedBal)+'</div></div>'+
        '<div><div class="s-label">빌려준 잔액</div><div class="s-val green">'+won(s.lentBal)+'</div></div>'+
        '<div><div class="s-label">누적 이자</div><div class="s-val">'+won(s.interest)+'</div></div></div></div>';
      h+='<button class="btn" '+App.view.act('openLoanEdit')+'>+ 대출 추가</button>';
      h+='<div style="margin-top:12px;">'+(list.length?list.map(loanCard).join(''):'<div class="empty">등록된 대출이 없습니다</div>')+'</div>';
      openSheet('대출 / 이자', h);
    }
    function loanCard(l){
      const c=loanCalc(l), pct=c.principal?Math.min(100,Math.round(c.paidPrincipal/c.principal*100)):0;
      const dirBadge='<span class="pill">'+(LOAN_DIR_LABEL[l.direction]||l.direction)+'</span>';
      const stBadge=c.status!=='active'?'<span class="pill">'+(LOAN_STATUS_LABEL[c.status]||c.status)+'</span>':'';
      const col=l.direction==='lent'?'var(--income)':'var(--expense)';
      return '<div class="card" '+App.view.act('openLoanDetail',l.id)+'><div class="row"><b>🏦 '+escapeHtml(l.name||'대출')+' '+stBadge+'</b>'+dirBadge+'</div>'+
        '<div class="tx-sub" style="margin-top:6px;">'+escapeHtml(l.counterparty||'')+(l.interestRate?(' · 연 '+l.interestRate+'%'):'')+(l.dueDate?(' · 만기 '+l.dueDate):'')+'</div>'+
        '<div class="bar" style="margin-top:8px;"><i style="width:'+pct+'%;background:'+col+'"></i></div>'+
        '<div class="row" style="margin-top:6px;"><span class="tx-sub">잔액 '+won(c.balance)+' / '+won(c.principal)+'</span><span class="tx-sub" style="color:'+col+'">'+pct+'% 상환</span></div></div>';
    }
    // 🏦 이번 달 상환 예정(계획 스케줄) — 회차 k=시작월부터 경과 개월(시작 다음 달=1회차), n=시작~만기 개월, 상환일=시작일의 일자(말일 클램프).
    //  반환: { k, n, type, day, inst(loanInstallment) } | { none:'first'(아직 1회차 전)|'noterm'(만기 미설정)|'ended'(만기 지남) } | null(비활성·원금 없음).
    function loanMonthPlan(l, ym){
      if((l.status||'active')!=='active') return null;
      const P=Number(l.principal)||0, sd=l.startDate||''; if(!P||!sd) return null;
      const k=(+ym.slice(0,4)-+sd.slice(0,4))*12 + (+ym.slice(5,7)-+sd.slice(5,7));
      const n=l.dueDate?((+l.dueDate.slice(0,4)-+sd.slice(0,4))*12 + (+l.dueDate.slice(5,7)-+sd.slice(5,7))):0;
      if(k<1) return { none:'first' };
      const type=l.repayType||'bullet';
      const inst=loanInstallment(P, l.interestRate, n, type, k);
      if(!inst) return { none:(n>0&&k>n)?'ended':'noterm' };
      const day=Math.min(+sd.slice(8,10)||1, new Date(+ym.slice(0,4), +ym.slice(5,7), 0).getDate());
      return { k, n, type, day, inst };
    }
    function openLoanDetail(id){
      const l=state.loans.find(x=>x.id===id); if(!l) return;
      const c=loanCalc(l);
      let h='<div class="card"><div class="row"><b style="font-size:18px;">🏦 '+escapeHtml(l.name||'대출')+'</b><span class="pill">'+(LOAN_DIR_LABEL[l.direction]||l.direction)+'</span></div>'+
        '<div class="tx-sub" style="margin-top:6px;">'+escapeHtml(l.counterparty||'')+(l.startDate?(' · '+l.startDate):'')+(l.dueDate?(' ~ '+l.dueDate):'')+' · '+(LOAN_REPAY_LABEL[l.repayType||'bullet']||'')+'</div>'+
        '<div class="summary" style="margin-top:12px;">'+
          '<div><div class="s-label">잔액</div><div class="s-val">'+won(c.balance)+'</div></div>'+
          '<div><div class="s-label">원금</div><div class="s-val">'+won(c.principal)+'</div></div>'+
          '<div><div class="s-label">누적 이자</div><div class="s-val">'+won(c.paidInterest)+'</div></div></div>'+
        (l.interestRate?('<div class="tx-sub" style="margin-top:8px;">연 '+l.interestRate+'% · 월 예상 이자 약 '+won(c.monthlyInterest)+' (잔액 기준 단리)</div>'):'')+'</div>';
      // 📅 이번 달 상환 예정 — 상환 방식(repayType) 계획 스케줄 기준 원금·이자·납입액
      { const mp=(c.balance>0)?loanMonthPlan(l, todayStr().slice(0,7)):null;
        if(mp){
          let inner='';
          if(mp.inst){
            inner='<div class="row"><span class="muted">'+(mp.n?mp.k+'/'+mp.n+'회차':mp.k+'회차')+' · '+(LOAN_REPAY_LABEL[mp.type]||'')+'</span><b>'+won(mp.inst.pay)+'</b></div>'+
              '<div class="tx-sub" style="margin-top:6px;">원금 '+won(mp.inst.prin)+' + 이자 '+won(mp.inst.int)+' · 매월 '+mp.day+'일'+
              ((mp.type==='bullet'&&!mp.inst.prin)?(' · 원금은 만기'+(l.dueDate?'('+l.dueDate+')':'')+' 일시상환'):'')+'</div>'+
              ((mp.type==='amortized')?'<div class="tx-sub" style="margin-top:2px;">매월 납입액이 같아요(회차가 갈수록 원금↑·이자↓)</div>':'');
          }
          else if(mp.none==='noterm') inner='<div class="tx-sub">만기일을 설정하면 회차별 원금·이자가 자동 계산돼요 — 아래 <b>설정 수정</b>에서 만기일을 넣어주세요.</div>';
          else if(mp.none==='first') inner='<div class="tx-sub">상환은 시작 다음 달부터예요 — 이번 달 예정 없음.</div>';
          else inner='<div class="tx-sub">계획상 만기가 지났어요 — 남은 잔액 '+won(c.balance)+'을 정리해 주세요.</div>';
          h+='<div class="card" style="padding:12px 14px;"><div class="sec-title" style="margin:0 0 8px;">📅 이번 달 상환 예정</div>'+inner+'</div>';
        } }
      h+='<div class="chip-row">'+['active','paid','overdue'].map(st=>'<button class="chip '+((l.status||'active')===st?'on':'')+'" '+App.view.act('setLoanStatus',l.id,st)+'>'+LOAN_STATUS_LABEL[st]+'</button>').join('')+'</div>';
      h+='<button class="btn" '+App.view.act('openLoanPayment',l.id)+'>+ 상환 기록</button>';
      h+='<div class="sec-title" style="margin-left:2px;">상환 내역 ('+c.payments.length+')</div>';
      const ps=c.payments.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
      h+='<div class="card" style="padding:6px 10px;">'+(ps.length?ps.map(p=>loanPaymentRow(l,p)).join(''):'<div class="empty">상환 기록 없음</div>')+'</div>';
      h+='<button class="btn ghost" '+App.view.act('openLoanEdit',l.id)+'>설정 수정</button>';
      openSheet(l.name||'대출', h);
    }
    function loanPaymentRow(l,p){
      const tot=(Number(p.principalAmount)||0)+(Number(p.interestAmount)||0);
      return '<div class="tx" '+App.view.act('openLoanPayment',l.id,p.id)+'><div class="tx-ic">'+svgWrap(CAT_SVG.coin)+'</div>'+
        '<div class="tx-main"><div class="tx-title">'+(p.date||'')+(p.linkedTransactionId?' <span class="pill">🧾</span>':'')+'</div>'+
        '<div class="tx-sub">원금 '+won(Number(p.principalAmount)||0)+' · 이자 '+won(Number(p.interestAmount)||0)+'</div></div>'+
        '<div class="tx-amt">'+won(tot)+'</div></div>';
    }
    function setLoanStatus(id,st){ db.ref(wp('loans/'+id)).update({status:st, updatedAt:new Date().toISOString()}); toast(LOAN_STATUS_LABEL[st]); openLoanDetail(id); }
    function openLoanEdit(id){
      const l=id?state.loans.find(x=>x.id===id):null;
      const dir=l?(l.direction||'borrowed'):'borrowed';
      window._loanDir=dir;
      let h='<div class="type-seg" id="lDirSeg" style="margin-bottom:12px;">'+
        [['borrowed','빌림(대출)'],['lent','빌려줌']].map(o=>'<button class="'+(dir===o[0]?'on':'')+'" '+App.view.act('setLoanDir',o[0])+'>'+o[1]+'</button>').join('')+'</div>';
      h+='<div class="field"><label>이름</label><input class="input" id="lName" value="'+escapeHtml(l?l.name:'')+'" placeholder="예: 주택담보대출, 친구 빌려줌"></div>';
      h+='<div class="field"><label>상대/기관</label><input class="input" id="lParty" value="'+escapeHtml(l?(l.counterparty||''):'')+'" placeholder="예: ○○은행, 홍길동"></div>';
      h+='<div class="form-2"><div class="field"><label>원금</label><input class="input" id="lPrincipal" inputmode="numeric" value="'+(l&&l.principal?Number(l.principal).toLocaleString():'')+'" placeholder="0" oninput="this.value=fmtComma(this.value)"></div>'+
        '<div class="field"><label>연이율(%)</label><input class="input" id="lRate" inputmode="decimal" value="'+(l&&l.interestRate!=null?l.interestRate:'')+'" placeholder="예: 4.5"></div></div>';
      h+='<div class="form-2"><div class="field"><label>시작일</label><input type="date" class="input" id="lStart" value="'+(l&&l.startDate?l.startDate:todayStr())+'"></div>'+
        '<div class="field"><label>만기일(선택)</label><input type="date" class="input" id="lDue" value="'+(l&&l.dueDate?l.dueDate:'')+'"></div></div>';
      // 🏦 상환 방식 — 회차별 원금·이자 자동 계산(원리금균등·원금균등은 만기일 필요, 상환일=매월 시작일의 일자)
      { const rt=l?(l.repayType||'bullet'):'bullet';
        h+='<div class="field"><label>상환 방식</label><select class="input" id="lRepay">'+
          [['bullet','원금만기 — 매월 이자만, 만기에 원금 일시상환'],['amortized','원리금균등 — 매월 같은 금액(원금+이자)'],['equal_principal','원금균등 — 매월 같은 원금 + 줄어드는 이자']]
            .map(o=>'<option value="'+o[0]+'"'+(rt===o[0]?' selected':'')+'>'+o[1]+'</option>').join('')+'</select>'+
          '<p class="muted" style="font-size:11.5px;margin:6px 2px 0;">원리금균등·원금균등은 <b>만기일</b>을 넣어야 회차 금액이 계산돼요. 상환일은 매월 시작일의 일자.</p></div>'; }
      h+='<details class="adv"><summary>상세 설정</summary>';
      h+='<div class="field"><label>기본 상환 계좌</label><select class="input" id="lAcct">'+acctOptsHtml((l&&l.account)||(state.accounts[0]?state.accounts[0].id:''))+'</select></div>';
      // 원금을 계좌 잔액에 반영(신규 대출만) — 빌림=입금·빌려줌=출금 거래를 만들어 잔액이 실제와 맞게. 실소비 통계엔 제외(isActualExpense:false).
      if(!l) h+='<div class="menu-item" style="padding:6px 0;"><span>원금을 계좌 잔액에 반영 <span class="muted" style="font-size:11px">('+(dir==='lent'?'출금':'입금')+' 거래 생성)</span></span><div class="switch" id="lPrincipalTx" '+App.view.act('toggleSwitch')+'><i></i></div></div>';
      h+='<div class="field"><label>메모</label><input class="input" id="lMemo" value="'+escapeHtml(l?(l.memo||''):'')+'" placeholder="메모"></div>';
      h+='<div class="field"><label>공개 범위</label><select class="input" id="lVis">'+VISIBILITY.map(v=>'<option value="'+v[0]+'"'+(((l&&l.visibility===v[0])||(!l&&v[0]===defaultVisibility()))?' selected':'')+'>'+v[1]+'</option>').join('')+'</select></div>';
      h+='</details>';
      h+='<button class="btn" '+App.view.act('saveLoan', id?id:null)+'>'+(l?'수정':'추가')+'</button>';
      if(l) h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deleteLoan',id)+'>삭제</button>';
      openSheet(l?'대출 수정':'대출 추가', h);
    }
    function setLoanDir(d){ window._loanDir=d; const seg=$('lDirSeg'); if(seg){ [...seg.children].forEach((b,i)=>b.classList.toggle('on', (d==='borrowed'?0:1)===i)); } }
    function saveLoan(id){
      const name=val('lName').trim(); if(!name){ toast('이름을 입력하세요', true); return; }
      const principal=parseAmount(val('lPrincipal')); if(!principal){ toast('원금을 입력하세요', true); return; }
      const l=id?state.loans.find(x=>x.id===id):null, now=new Date().toISOString(), vis=val('lVis')||'full';
      const data={ name, direction:window._loanDir||'borrowed', counterparty:val('lParty').trim(),
        principal, interestRate:parseFloat(val('lRate'))||0, startDate:val('lStart')||todayStr(), dueDate:val('lDue')||null,
        repayType:($('lRepay')?val('lRepay'):(l&&l.repayType))||'bullet',
        account: $('lAcct')?val('lAcct'):'', memo:val('lMemo').trim(), status:l?(l.status||'active'):'active',
        visibility:vis, owner:l?(l.owner||state.userName):state.userName, createdAt:l?(l.createdAt||now):now, updatedAt:now };
      const key=id||('loan_'+Date.now());
      // 💰 원금 계좌 반영(신규 대출 + 토글 ON + 계좌 지정) — 빌림=입금(income to), 빌려줌=출금(expense from). 부채/자산 이동이라 실소비 통계 제외(isActualExpense:false), loanId로 연결.
      if(!l && $('lPrincipalTx') && $('lPrincipalTx').classList.contains('on') && data.account){
        const borrowed=data.direction!=='lent', txId='lprin_'+key;
        const o={ type:borrowed?'income':'expense', date:isoAtNoon(data.startDate), user:state.userName, amount:principal,
          category:'대출', desc:name+' 원금 '+(borrowed?'수령':'대여'), isActualExpense:false, loanId:key, memo:data.memo };
        if(borrowed) o.to=data.account; else o.from=data.account;
        db.ref(wp('transactions/'+state.uid+'/'+txId)).set(o).catch(_saveErr); data.principalTxId=txId;
      }
      db.ref(wp('loans/'+key)).set(data).catch(_saveErr); toast(l?'수정되었습니다':'추가되었습니다'); openLoanBook();
    }
    function deleteLoan(id){
      confirmSheet('이 대출을 삭제할까요? (상환 기록도 함께 삭제됩니다)', ()=>{
        const lo=state.loans.find(x=>x.id===id);
        if(lo&&lo.principalTxId) db.ref(wp('transactions/'+state.uid+'/'+lo.principalTxId)).remove();   // 원금 반영 거래도 함께 정리
        loanPaymentsOf({id}).forEach(p=>{ if(p.linkedTransactionId) db.ref(wp('transactions/'+state.uid+'/'+p.linkedTransactionId)).remove(); if(p.linkedPrincipalTxId) db.ref(wp('transactions/'+state.uid+'/'+p.linkedPrincipalTxId)).remove(); db.ref(wp('loanPayments/'+p.id)).remove(); });
        db.ref(wp('loans/'+id)).remove(); toast('삭제되었습니다'); openLoanBook();
      });
    }
    function openLoanPayment(loanId, id){
      const l=state.loans.find(x=>x.id===loanId); if(!l) return;
      const c=loanCalc(l);
      const p=id?state.loanPayments.find(x=>x.id===id):null;
      const txOn = p? !!p.linkedTransactionId : true;
      const interestLabel = l.direction==='lent'?'이자(수입)':'이자(지출)';
      let h='<div class="card" style="padding:12px;"><div class="row"><span class="tx-sub">'+escapeHtml(l.name||'')+' 잔액</span><b>'+won(c.balance)+'</b></div>'+
        (l.interestRate?('<div class="row" style="margin-top:4px;"><span class="tx-sub">월 예상 이자</span><b>'+won(c.monthlyInterest)+'</b></div>'):'')+'</div>';
      // 🏦 신규 기록엔 이번 달 계획 회차(상환 방식 스케줄)의 원금·이자를 프리필 — 없으면 종전대로 이자만(잔액 단리)
      const _mp=(!p)?loanMonthPlan(l, todayStr().slice(0,7)):null;
      const _preP=(_mp&&_mp.inst)?_mp.inst.prin:0, _preI=(_mp&&_mp.inst)?_mp.inst.int:(c.monthlyInterest||0);
      h+='<div class="form-2"><div class="field"><label>원금 상환</label><input class="input" id="lpPrincipal" inputmode="numeric" value="'+(p&&p.principalAmount?Number(p.principalAmount).toLocaleString():(_preP?_preP.toLocaleString():''))+'" placeholder="0" oninput="this.value=fmtComma(this.value)"></div>'+
        '<div class="field"><label>'+interestLabel+'</label><input class="input" id="lpInterest" inputmode="numeric" value="'+(p&&p.interestAmount?Number(p.interestAmount).toLocaleString():(_preI?_preI.toLocaleString():''))+'" placeholder="0" oninput="this.value=fmtComma(this.value)"></div></div>';
      if(_mp&&_mp.inst) h+='<p class="muted" style="font-size:11.5px;margin:-6px 2px 10px;">'+(_mp.n?_mp.k+'/'+_mp.n+'회차':_mp.k+'회차')+' 계획값('+(LOAN_REPAY_LABEL[_mp.type]||'')+')을 채워뒀어요 — 실제 낸 금액으로 고쳐도 돼요.</p>';
      h+='<div class="field"><label>날짜</label><input type="date" class="input" id="lpDate" value="'+(p&&p.date?p.date:todayStr())+'"></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>🧾 원금·이자를 가계부 거래로 기록</span><div class="switch '+(txOn?'on':'')+'" id="lpTx" '+App.view.act('toggleSwitch','toggleLoanPayAcct')+'><i></i></div></div>';
      h+='<div id="lpAcctWrap" style="'+(txOn?'':'display:none;')+'"><div class="field"><label>계좌</label><select class="input" id="lpAcct">'+acctOptsHtml((p&&p.account)||l.account||(state.accounts[0]?state.accounts[0].id:''))+'</select></div>'+
        '<div class="tx-sub" style="margin-bottom:6px;">'+(l.direction==='lent'?'원금·이자가 선택한 계좌로 함께 입금돼요':'원금·이자가 선택한 계좌에서 함께 차감돼요')+' (원금은 실지출 통계엔 포함되지 않아요).</div></div>';
      h+='<div class="field"><label>메모</label><input class="input" id="lpMemo" value="'+escapeHtml(p?(p.memo||''):'')+'" placeholder="메모"></div>';
      h+='<button class="btn" '+App.view.act('saveLoanPayment', loanId, id?id:null)+'>'+(p?'수정':'기록')+'</button>';
      if(p) h+='<button class="btn danger" style="margin-top:8px;" '+App.view.act('deleteLoanPayment',loanId,id)+'>삭제</button>';
      openSheet(p?'상환 수정':'상환 기록', h);
    }
    function toggleLoanPayAcct(){ const on=$('lpTx')&&$('lpTx').classList.contains('on'); const w=$('lpAcctWrap'); if(w) w.style.display=on?'':'none'; }
    function saveLoanPayment(loanId, id){
      const l=state.loans.find(x=>x.id===loanId); if(!l) return;
      const principalAmount=parseAmount(val('lpPrincipal')), interestAmount=parseAmount(val('lpInterest'));
      if(!principalAmount && !interestAmount){ toast('원금 또는 이자를 입력하세요', true); return; }
      const date=val('lpDate')||todayStr(), memo=val('lpMemo').trim(), now=new Date().toISOString();
      const p=id?state.loanPayments.find(x=>x.id===id):null;
      const key=id||('lpay_'+Date.now());
      const txOn=$('lpTx')&&$('lpTx').classList.contains('on');
      const acct=$('lpAcct')?val('lpAcct'):(p?p.account:'');
      const borrowed=l.direction!=='lent', iso=isoAtNoon(date);
      // 원금·이자 각각 실제 거래로 연결(borrowed=지출/차감, lent=수입/입금). 계좌 잔액에 반영돼 따로 입력할 필요 없음.
      // 이자는 실지출(대출 비용)로 통계 포함, 원금 상환은 부채 상환이라 실지출 통계엔 제외(isActualExpense:false).
      function upsertLoanTx(existingId, amt, cat, descSuffix, actual, fallbackId){
        if(txOn && amt>0){ const txId=existingId||fallbackId;
          const o={ type:borrowed?'expense':'income', date:iso, user:state.userName, amount:amt,
            category:cat, desc:(l.name||'대출')+' '+descSuffix, isActualExpense:actual, loanId:loanId, memo };
          if(borrowed) o.from=acct; else o.to=acct;
          db.ref(wp('transactions/'+state.uid+'/'+txId)).set(o); return txId; }
        if(existingId){ db.ref(wp('transactions/'+state.uid+'/'+existingId)).remove(); }
        return null;
      }
      const linkedTransactionId  = upsertLoanTx(p?(p.linkedTransactionId||null):null,  interestAmount,  borrowed?'대출이자':'이자',   '이자', borrowed, 'lpi_'+key);
      const linkedPrincipalTxId  = upsertLoanTx(p?(p.linkedPrincipalTxId||null):null, principalAmount, borrowed?'대출상환':'원금회수', '원금', false,    'lpp_'+key);
      const data={ id:key, loanId, date, principalAmount, interestAmount, account:acct||'', memo,
        linkedTransactionId, linkedPrincipalTxId, createdAt:p?(p.createdAt||now):now, updatedAt:now };
      db.ref(wp('loanPayments/'+key)).set(data).catch(_saveErr); toast(p?'수정되었습니다':'기록되었습니다'); openLoanDetail(loanId);
    }
    function deleteLoanPayment(loanId, id){
      const p=state.loanPayments.find(x=>x.id===id);
      const hasTx=p&&(p.linkedTransactionId||p.linkedPrincipalTxId);
      confirmSheet('이 상환 기록을 삭제할까요?'+(hasTx?' (연결된 원금·이자 거래도 삭제됩니다)':''), ()=>{
        if(p&&p.linkedTransactionId) db.ref(wp('transactions/'+state.uid+'/'+p.linkedTransactionId)).remove();
        if(p&&p.linkedPrincipalTxId) db.ref(wp('transactions/'+state.uid+'/'+p.linkedPrincipalTxId)).remove();
        db.ref(wp('loanPayments/'+id)).remove(); toast('삭제되었습니다'); openLoanDetail(loanId);
      });
    }

    // ===== 💾 데이터 백업(JSON) =====
    //  내보내기 = 현재 가계부(ws 전체 스냅샷) + 내 개인 할일을 JSON 파일로. 게임(users/{uid}/game)은 제외(재화 조작 방지 — 서버가 소스).
    //  복원 = 백업의 각 최상위 항목을 현재 가계부에 통째 교체(update — 백업에 없는 항목은 유지). 되돌릴 수 없어 확인 2중.
    function exportBackup(){
      toast('백업 만드는 중…');
      Promise.all([ db.ref(wsRoot()).once('value'), db.ref('users/'+state.uid+'/todos').once('value') ]).then(function(rs){
        const data={ app:'eggarden', ver:1, exportedAt:new Date().toISOString(), wsId:state.wsId, wsName:(state.wsMeta&&state.wsMeta.name)||'', ws:rs[0].val()||{}, myTodos:rs[1].val()||{} };
        const blob=new Blob([JSON.stringify(data)],{type:'application/json'});
        const url=URL.createObjectURL(blob); const a=document.createElement('a');
        a.href=url; a.download='알뜰백업_'+((state.wsMeta&&state.wsMeta.name)||'가계부')+'_'+todayStr()+'.json';
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        toast('백업 파일을 내려받았어요');
      }).catch(function(){ toast('백업에 실패했어요', true); });
    }
    function importBackup(){
      const inp=document.createElement('input'); inp.type='file'; inp.accept='application/json,.json';
      inp.onchange=function(){ const f=inp.files&&inp.files[0]; if(!f) return;
        const rd=new FileReader();
        rd.onload=function(){ let data=null; try{ data=JSON.parse(rd.result); }catch(e){}
          if(!data||data.app!=='eggarden'||!data.ws){ toast('알뜰 백업 파일이 아니에요', true); return; }
          const keys=Object.keys(data.ws);
          confirmSheet('백업 \''+(data.wsName||data.wsId||'')+'\' ('+String(data.exportedAt||'').slice(0,10)+')의 항목 '+keys.length+'개를 현재 가계부에 덮어쓸까요? 같은 항목의 현재 데이터는 백업 내용으로 교체되며 되돌릴 수 없어요.', function(){
            db.ref(wsRoot()).update(data.ws).then(function(){
              if(data.myTodos && Object.keys(data.myTodos).length) return db.ref('users/'+state.uid+'/todos').update(data.myTodos);
            }).then(function(){ toast('복원했습니다'); }).catch(function(){ toast('복원 중 오류가 났어요', true); });
          }, { okLabel:'덮어쓰기', danger:true, title:'💾 백업 복원' });
        };
        rd.readAsText(f);
      };
      inp.click();
    }
    // ===== CSV =====
    function exportCSV(){
      const rows=monthTx(state.month).sort((a,b)=>new Date(a.date)-new Date(b.date));
      if(!rows.length){ toast('이번달 거래가 없습니다', true); return; }
      const header=['날짜','유형','사용자','카테고리','출금','입금','금액','실제소비','카드실적금액','원통화','외화금액','환율','환율원본','환율일자','설명','메모'];
      const lines=rows.map(t=>[ (t.date||'').substring(0,10), TYPE_LABEL[t.type]||t.type, ownerName(t.user||''), t.category||'', acctName(t.from), acctName(t.to), t.amount||0, (isActual(t)?(Number(t.amount)||0):0), (t.cardPerformanceIncluded?(t.cardPerformanceAmount!=null?t.cardPerformanceAmount:t.amount):0), t.currency||'', (t.foreignAmount!=null?t.foreignAmount:''), (t.fxRate!=null?t.fxRate:''), t.fxSource||'', t.fxDate||'', t.desc||'', t.memo||'' ]
        .map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(','));
      const csv='﻿'+[header.join(','),...lines].join('\r\n');
      const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
      const url=URL.createObjectURL(blob); const a=document.createElement('a');
      a.href=url; a.download='가계부_'+state.month+'.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      toast(state.month+' 내역을 내보냈습니다');
    }
