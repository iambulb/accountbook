// ===== 홈(달력/목록) =====
    function renderCalendar(){
      $('screenTitle').textContent='달력';
      const m=state.month, list=monthTx(m);
      const inc=sumBy(list,'income');
      const actual=actualSpend(list);
      const charge=sumBy(list,'prepaid_charge');
      const pspend=sumBy(list,'prepaid_spend')+sumBy(list,'point_spend');
      const [y,mo]=m.split('-').map(Number);
      let html='';

      html+='<div class="card">';
      html+='<div class="month-nav"><button onclick="moveMonth(-1)">‹</button><span class="m">'+y+'.'+pad2(mo)+'</span><button onclick="moveMonth(1)">›</button></div>';
      html+='<div class="summary">'+
        '<div><div class="s-label">수입</div><div class="s-val green">'+won(inc)+'</div></div>'+
        '<div><div class="s-label">실제소비</div><div class="s-val red">'+won(actual)+'</div></div>'+
        '<div><div class="s-label">합계</div><div class="s-val">'+won(inc-actual)+'</div></div>'+
      '</div>';
      // 충전/선불사용 분리 안내 (소비로 착각 방지)
      html+='<div class="row" style="margin-top:12px;font-size:12px;border-top:1px solid var(--line-soft);padding-top:12px;">'+
        '<span class="muted">충전 <b class="blue">'+won(charge)+'</b></span>'+
        '<span class="muted">선불·포인트 사용 <b>'+won(pspend)+'</b></span>'+
        '<span class="muted">미사용 충전잔액 <b class="blue">'+won(prepaidTotal())+'</b></span></div>';
      // 예산 미니바 (총예산, 실제소비 기준)
      const tb=totalMonthlyBudget();
      if(tb && m===monthStr(new Date())){
        const u=budgetUsage(tb), c=budgetColor(u.pct);
        html+='<div style="margin-top:14px;"><div class="row" style="font-size:12px;"><span class="muted">이번달 예산</span><span style="color:'+c+';font-weight:700;">'+u.pct+'%'+(u.pct>=100?' 초과':'')+'</span></div>'+
          '<div class="bar"><i style="width:'+Math.min(u.pct,100)+'%;background:'+c+'"></i></div>'+
          '<div class="tx-sub" style="margin-top:6px;">'+won(u.used)+' / '+won(u.amount)+'</div></div>';
      }
      html+='</div>';

      html+='<div class="seg"><button class="'+(state.homeView==='calendar'?'on':'')+'" onclick="setHomeView(\'calendar\')">달력</button>'+
        '<button class="'+(state.homeView==='list'?'on':'')+'" onclick="setHomeView(\'list\')">목록</button></div>';

      if(state.homeView==='calendar') html+=calendarGridHtml(y,mo,list);
      else html+=listHtml(list);

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
    function moveMonth(d){ state.month=shiftMonth(state.month,d); renderCalendar(); }
    function setFilter(k,v){ state.filter[k]=v; renderCalendar(); }

    function calendarGridHtml(y,mo,list){
      const buckets={};
      list.forEach(t=>{ const day=(t.date||'').substring(0,10); (buckets[day]=buckets[day]||{inc:0,exp:0}); if(t.type==='income')buckets[day].inc+=t.amount; else if(t.type==='expense')buckets[day].exp+=t.amount; });
      const first=new Date(y,mo-1,1).getDay();
      const days=new Date(y,mo,0).getDate();
      const todayS=todayStr();
      let h='<div class="card"><div class="cal-head">'+WEEK.map(w=>'<div>'+w+'</div>').join('')+'</div><div class="cal-grid">';
      for(let i=0;i<first;i++) h+='<div class="cal-cell dim"></div>';
      for(let d=1;d<=days;d++){
        const ds=y+'-'+pad2(mo)+'-'+pad2(d);
        const b=buckets[ds];
        const cls='cal-cell'+(ds===todayS?' today':'')+(ds===state.selectedDate?' sel':'');
        h+='<div class="'+cls+'" onclick="openDaySheet(\''+ds+'\')"><div class="d">'+d+'</div>'+
          (b&&b.inc?'<div class="ci">+'+shortNum(b.inc)+'</div>':'')+
          (b&&b.exp?'<div class="ce">-'+shortNum(b.exp)+'</div>':'')+'</div>';
      }
      h+='</div></div>';
      return h;
    }
    function shortNum(n){ if(n>=10000) return Math.round(n/10000*10)/10+'만'; if(n>=1000) return Math.round(n/1000)+'천'; return n; }

    function listHtml(list){
      // 필터 칩
      let h='<div class="chip-row">';
      const types=[['','전체'],['expense','지출'],['income','수입'],['transfer','이체']];
      h+=types.map(t=>'<button class="chip '+(state.filter.type===t[0]?'on':'')+'" onclick="setFilter(\'type\',\''+t[0]+'\')">'+t[1]+'</button>').join('');
      h+='</div>';
      const f=state.filter;
      let rows=list.filter(t=>{
        if(f.type&&t.type!==f.type) return false;
        if(f.keyword){ const k=f.keyword.toLowerCase(); if(!((t.desc||'').toLowerCase().includes(k)||(t.category||'').toLowerCase().includes(k))) return false; }
        return true;
      }).sort((a,b)=>new Date(b.date)-new Date(a.date));
      if(!rows.length) return h+'<div class="empty">거래가 없습니다</div>';
      // 일자별 그룹
      const groups={};
      rows.forEach(t=>{ const d=(t.date||'').substring(0,10); (groups[d]=groups[d]||[]).push(t); });
      Object.keys(groups).sort().reverse().forEach(d=>{
        const dt=parseDate(d), gi=sumBy(groups[d],'income'), ge=sumBy(groups[d],'expense');
        h+='<div class="day-group"><div class="day-head"><span>'+pad2(dt.getMonth()+1)+'월 '+pad2(dt.getDate())+'일 ('+WEEK[dt.getDay()]+')</span><span>'+(ge?'<span class="red">-'+ge.toLocaleString()+'</span> ':'')+(gi?'<span class="green">+'+gi.toLocaleString()+'</span>':'')+'</span></div><div class="card" style="padding:6px 10px;">';
        h+=groups[d].map(txRowHtml).join('');
        h+='</div></div>';
      });
      return h;
    }

    function txRowHtml(t){
      const e=TX_EFFECT[t.type]||{};
      let sign='', cls='muted', ic=TYPE_ICON[t.type]||'•', icbg='var(--transfer)';
      if(t.type==='expense'){ sign='-'; cls='red'; ic=catIcon(t.category); icbg=catColor(t.category); }
      else if(t.type==='prepaid_spend'||t.type==='point_spend'){ sign='-'; cls='red'; }
      else if(t.type==='income'||t.type==='refund'||t.type==='point_earn'){ sign='+'; cls='green'; icbg='var(--income)'; }
      else if(t.type==='prepaid_charge'){ sign=''; cls='blue'; icbg='var(--primary)'; }
      let sub;
      if(e.debit&&e.credit) sub=acctName(t.from)+' → '+acctName(t.to);
      else if(e.credit&&!e.debit) sub=acctName(t.to);
      else sub=(t.category?t.category+' · ':'')+acctName(t.from);
      if(!['expense','income','transfer'].includes(t.type)) sub=TYPE_LABEL[t.type]+' · '+sub;
      sub+=' · '+escapeHtml(t.user||'');
      const rec=t.recurringId?'<span class="pill">🔁</span>':'';
      const cardPill=(getCard(t.from)&&(t.type==='expense'||t.type==='prepaid_charge')&&t.cardPerformanceIncluded===false)?'<span class="pill">실적제외</span>':'';
      const pbPill=t.purposeBookId?'<span class="pill">'+escapeHtml(t.purposeBookName||'목적')+'</span>':'';
      const amtNum=Math.abs(Number(t.amount)||0).toLocaleString();
      return '<div class="tx" onclick="openTxSheet(\''+t.ownerUid+'\',\''+t.id+'\')">'+
        '<div class="tx-ic" style="background:'+icbg+';color:#fff;">'+ic+'</div>'+
        '<div class="tx-main"><div class="tx-title">'+escapeHtml(t.desc||'')+rec+cardPill+pbPill+'</div><div class="tx-sub">'+sub+'</div></div>'+
        '<div class="tx-amt '+cls+'">'+sign+'₩'+amtNum+'</div></div>';
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
      h+='<button class="btn" onclick="openTxSheet(null,null,\''+ds+'\')">+ 이 날짜에 추가</button>';
      openSheet(pad2(dt.getMonth()+1)+'월 '+pad2(dt.getDate())+'일', h);
    }

    // ===== 거래 입력/수정 시트 =====
    function openTxSheet(ownerUid, id, presetDate, presetPb){
      let t=null;
      if(ownerUid && id) t=state.transactions.find(x=>x.ownerUid===ownerUid&&x.id===id);
      sheetTx = t?{ownerUid:t.ownerUid,id:t.id}:null;
      sheetType = t?t.type:'expense';
      sheetCat = t?(t.category||''):'';
      const date = t?(t.date||'').substring(0,10):(presetDate||state.selectedDate||todayStr());
      const amount = t?Math.abs(Number(t.amount)||0):'';
      const desc = t?(t.desc||''):'';
      const memo = t?(t.memo||''):'';
      const pbId = t?(t.purposeBookId||''):(presetPb||'');
      const settleInc = t?(t.settlementIncluded===true):false;
      const activePbs = state.purposeBooks.filter(p=>canSee(p) && (p.status||'active')==='active');

      let h='';
      h+='<div class="type-seg" id="sTypeSeg">'+
        '<button data-tp="expense" onclick="setSheetType(\'expense\')">지출</button>'+
        '<button data-tp="income" onclick="setSheetType(\'income\')">수입</button>'+
        '<button data-tp="transfer" onclick="setSheetType(\'transfer\')">이체</button>'+
        '<button data-tp="__ext__" onclick="setSheetType(\'__ext__\')">선불·포인트</button></div>';
      h+='<div class="amount-wrap"><span class="cur">₩</span><input class="amount-input" id="sAmount" inputmode="numeric" placeholder="0" value="'+(amount?Number(amount).toLocaleString():'')+'" oninput="this.value=fmtComma(this.value)"></div>';
      h+='<div class="field"><label>날짜</label><input type="date" class="input" id="sDate" value="'+date+'"></div>';
      h+='<div id="sDyn"></div>';
      h+='<div id="sCardPerf"></div>';
      h+='<div class="field"><label>설명</label><input type="text" class="input" id="sDesc" placeholder="내용" value="'+escapeHtml(desc)+'"></div>';
      h+='<details class="adv"'+(pbId?' open':'')+'><summary>상세 설정</summary>';
      h+='<div class="field"><label>목적별 가계부</label><select class="input" id="sPb">'+
        '<option value="">연결 안 함</option>'+
        activePbs.map(p=>'<option value="'+p.id+'"'+(p.id===pbId?' selected':'')+'>'+(p.icon||'📒')+' '+escapeHtml(p.name)+'</option>').join('')+
        ((pbId && !activePbs.some(p=>p.id===pbId))?('<option value="'+pbId+'" selected>'+escapeHtml((t&&t.purposeBookName)||pbId)+' (비활성)</option>'):'')+
        '</select></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>정산 포함</span><div class="switch '+(settleInc?'on':'')+'" id="sSettle" onclick="this.classList.toggle(\'on\')"><i></i></div></div>';
      h+='<div class="field"><label>메모</label><textarea class="input" id="sMemo" placeholder="메모">'+escapeHtml(memo)+'</textarea></div>';
      h+='</details>';
      h+='<button class="btn" onclick="saveTx()">'+(t?'수정':'저장')+'</button>';
      if(t) h+='<button class="btn danger" style="margin-top:8px;" onclick="deleteTx()">삭제</button>';

      openSheet(t?'거래 수정':'거래 입력', h);
      const sh=$('sheet');
      sh._from = t?(t.from||''):(state.accounts[0]?state.accounts[0].id:'');
      sh._to   = t?(t.to||''):(state.accounts[1]?state.accounts[1].id:(state.accounts[0]?state.accounts[0].id:''));
      sh._cpi  = t?t.cardPerformanceIncluded:undefined;
      sh._cpa  = t?t.cardPerformanceAmount:undefined;
      sh._cpr  = t?(t.cardPerformanceExcludedReason||''):'';
      sh._adjSign = (t&&t.type==='balance_adjustment'&&Number(t.amount)<0)?'-':'+';
      highlightTypeSeg(); renderTxDyn();
    }
    function setSheetType(tp){
      if(tp==='__ext__'){ if(!EXT_TYPES.includes(sheetType)) sheetType='prepaid_spend'; }
      else sheetType=tp;
      highlightTypeSeg(); renderTxDyn();
    }
    function setExtType(tp){ sheetType=tp; highlightTypeSeg(); renderTxDyn(); }
    function highlightTypeSeg(){
      const seg=$('sTypeSeg'); if(!seg) return;
      const ext=EXT_TYPES.includes(sheetType);
      [...seg.children].forEach(b=>{
        const tp=b.dataset.tp;
        const on = tp==='__ext__' ? ext : (tp===sheetType);
        b.className = on ? ('on '+(tp==='expense'?'exp':tp==='income'?'inc':tp==='transfer'?'trf':'ext')) : '';
      });
    }
    function acctOptsHtml(sel){ return state.accounts.map(a=>'<option value="'+a.id+'"'+(a.id===sel?' selected':'')+'>'+escapeHtml(a.name)+' ('+(ACCT_TYPE_LABEL[a.type]||a.type)+')</option>').join(''); }
    function acctField(label,id,sel){ return '<div class="field"><label>'+label+'</label><select class="input" id="'+id+'" onchange="renderCardPerfBlock()">'+acctOptsHtml(sel)+'</select></div>'; }
    function catGridHtml(){
      let cats=pickableCats(catTypeFor(sheetType));
      if(sheetCat && !cats.some(c=>c.name===sheetCat)){ // 편집 중 비활성/타유형 카테고리도 현재값은 표시
        const cur=getCat(sheetCat)||{name:sheetCat,icon:'🏷️',color:'#8b95a1'}; cats=[cur,...cats];
      } else if(!sheetCat && cats[0]) sheetCat=cats[0].name;
      return '<div class="field"><label>카테고리</label><div class="cat-grid" id="sCatGrid">'+
        cats.map(c=>'<div class="cat-pick '+(c.name===sheetCat?'on':'')+'" onclick="pickCat(\''+escapeHtml(c.name)+'\')"><div class="ce" style="background:'+(c.color||'#8b95a1')+'">'+(c.icon||'🏷️')+'</div>'+escapeHtml(c.name)+'</div>').join('')+
        '</div></div>';
    }
    function guideNote(actual, text){ return '<div class="install-banner" style="background:'+(actual?'rgba(240,68,82,.1)':'var(--primary-weak)')+';color:'+(actual?'var(--expense)':'var(--primary)')+';">'+(actual?'🛒':'ℹ️')+' '+text+'</div>'; }
    function renderTxDyn(){
      const sh=$('sheet'); const fromV=sh._from, toV=sh._to;
      let h='';
      if(EXT_TYPES.includes(sheetType)){
        h+='<div class="chip-row" style="margin-bottom:14px;">'+EXT_TYPES.map(tp=>'<button class="chip '+(tp===sheetType?'on':'')+'" onclick="setExtType(\''+tp+'\')">'+TYPE_LABEL[tp]+'</button>').join('')+'</div>';
      }
      if(sheetType==='prepaid_charge') h+=guideNote(false,'충전은 자산 이동이라 실제 소비에 포함되지 않습니다.');
      else if(sheetType==='prepaid_spend'||sheetType==='point_spend') h+=guideNote(true,'이 거래는 실제 소비에 포함됩니다.');
      else if(sheetType==='refund') h+=guideNote(false,'환불은 잔액이 돌아오는 거래로 실제 소비에 포함되지 않습니다.');
      else if(sheetType==='point_earn') h+=guideNote(false,'포인트 적립은 실제 소비가 아닙니다.');
      else if(sheetType==='balance_adjustment') h+=guideNote(false,'실제 잔액에 맞추는 보정 거래입니다. 실제 소비에 포함되지 않습니다.');

      if(sheetType==='expense'){ h+=acctField('출금/결제 수단','sFrom',fromV)+catGridHtml(); }
      else if(sheetType==='income'){ h+=acctField('입금 대상','sTo',toV)+catGridHtml(); }
      else if(sheetType==='refund'){ h+=acctField('환불 받는 계정','sTo',toV)+catGridHtml(); }
      else if(sheetType==='point_earn'){ h+=acctField('적립 포인트 계정','sTo',toV); }
      else if(sheetType==='transfer'||sheetType==='prepaid_charge'){
        const l1=sheetType==='prepaid_charge'?'충전 수단(카드/계좌)':'출금';
        const l2=sheetType==='prepaid_charge'?'충전 대상(선불/포인트)':'입금';
        h+='<div class="form-2">'+acctField(l1,'sFrom',fromV)+acctField(l2,'sTo',toV)+'</div>';
      }
      else if(sheetType==='prepaid_spend'||sheetType==='point_spend'){
        h+=acctField(sheetType==='point_spend'?'사용 포인트 계정':'결제 선불수단','sFrom',fromV)+catGridHtml();
      }
      else if(sheetType==='balance_adjustment'){
        h+=acctField('대상 계정','sTo',toV);
        h+='<div class="field"><label>조정 방향</label><select class="input" id="sAdjSign"><option value="+"'+(sh._adjSign!=='-'?' selected':'')+'>증가(+)</option><option value="-"'+(sh._adjSign==='-'?' selected':'')+'>감소(-)</option></select></div>';
      }
      $('sDyn').innerHTML=h;
      if($('sCatGrid')) pickCat(sheetCat,true);
      renderCardPerfBlock();
    }
    function pickCat(name, silent){
      sheetCat=name;
      const grid=$('sCatGrid');
      if(grid) [...grid.children].forEach(ch=>ch.classList.toggle('on', ch.textContent.trim().endsWith(name)));
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
      const amt = sh._cpa!=null ? sh._cpa : parseAmount(val('sAmount'));
      box.innerHTML='<div class="card" style="padding:14px;margin:4px 0 14px;">'+
        '<div class="menu-item" style="padding:4px 0;"><span>💳 '+escapeHtml(card.cardName||acctName(card.id))+' 실적 포함</span><div class="switch '+(inc?'on':'')+'" id="sCpi" onclick="this.classList.toggle(\'on\');toggleCpiFields()"><i></i></div></div>'+
        '<div id="sCpiFields" style="'+(inc?'':'display:none;')+'"><div class="field" style="margin-top:8px;"><label>실적 인정 금액</label><input class="input" id="sCpa" inputmode="numeric" value="'+(amt?Number(amt).toLocaleString():'')+'" oninput="this.value=fmtComma(this.value)"></div></div>'+
        '<div id="sCprWrap" style="'+(inc?'display:none;':'')+'"><div class="field" style="margin-top:8px;"><label>실적 제외 사유</label><input class="input" id="sCpr" value="'+escapeHtml(sh._cpr||'')+'" placeholder="예: 선불충전 제외"></div></div>'+
        '<div class="tx-sub" style="margin-top:6px;">기본값: '+(defInc?'포함':'제외')+' · 직접 수정 가능</div></div>';
      sh._cpi=undefined; // 사용자가 토글하면 그 값 우선
    }
    function toggleCpiFields(){ const on=$('sCpi').classList.contains('on'); $('sCpiFields').style.display=on?'':'none'; $('sCprWrap').style.display=on?'none':''; }
    function saveTx(){
      const rawAmount=parseAmount(val('sAmount'));
      if(!rawAmount){ toast('금액을 입력하세요', true); return; }
      const date=val('sDate')||todayStr();
      const desc=val('sDesc').trim();
      const memo=val('sMemo').trim();
      const iso=new Date(date+'T'+new Date().toTimeString().slice(0,8)).toISOString();
      const e=TX_EFFECT[sheetType]||{};
      const hasCat=catTypeFor(sheetType)!==null;
      const tx={ type:sheetType, date:iso, user:state.userName, amount:rawAmount,
        desc: desc||(hasCat?(sheetCat||TYPE_LABEL[sheetType]):TYPE_LABEL[sheetType]),
        isActualExpense: !!ACTUAL_DEFAULT[sheetType] };
      if(memo) tx.memo=memo;
      if(sheetType==='balance_adjustment'){ tx.to=val('sTo'); if(val('sAdjSign')==='-') tx.amount=-rawAmount; }
      else { if(e.debit) tx.from=val('sFrom'); if(e.credit) tx.to=val('sTo'); }
      if(hasCat) tx.category=sheetCat||'기타';
      if((sheetType==='transfer'||sheetType==='prepaid_charge') && tx.from===tx.to){ toast('출금/입금 계정이 같습니다', true); return; }
      // 카드 실적
      const card=getCard(tx.from);
      if(card && (sheetType==='expense'||sheetType==='prepaid_charge')){
        const inc=$('sCpi')?$('sCpi').classList.contains('on'):defaultCardIncluded(card,sheetType,tx.category);
        tx.cardPerformanceIncluded=inc;
        tx.cardPerformanceAmount= inc ? (parseAmount(val('sCpa'))||rawAmount) : 0;
        tx.cardPerformanceExcludedReason= inc ? '' : (val('sCpr')||'');
      }
      // 목적별 가계부 연결 (정산 필드는 예약만 — 실제 정산 계산은 Step 9)
      const pbSel = $('sPb')?val('sPb'):'';
      if(pbSel){
        const pbo=state.purposeBooks.find(x=>x.id===pbSel);
        tx.purposeBookId=pbSel;
        tx.purposeBookName=pbo?pbo.name:(sheetTx&&state.transactions.find(x=>x.ownerUid===sheetTx.ownerUid&&x.id===sheetTx.id)||{}).purposeBookName||'';
        tx.settlementIncluded = $('sSettle')?$('sSettle').classList.contains('on'):false;
        tx.payer = tx.user;
        tx.splitType = 'none';
        tx.settlementStatus = 'none';
      }
      if(sheetTx){
        const old=state.transactions.find(x=>x.ownerUid===sheetTx.ownerUid&&x.id===sheetTx.id);
        if(old&&old.recurringId) tx.recurringId=old.recurringId;
        db.ref(wp('transactions/'+sheetTx.ownerUid+'/'+sheetTx.id)).set(tx); toast('수정되었습니다');
      } else { db.ref(wp('transactions/'+state.uid+'/'+Date.now())).set(tx); toast('저장되었습니다'); }
      closeSheet();
    }
    function deleteTx(){
      if(!sheetTx) return;
      const ref=sheetTx;
      confirmSheet('이 거래를 삭제할까요?', ()=>{ db.ref(wp('transactions/'+ref.ownerUid+'/'+ref.id)).remove(); toast('삭제되었습니다'); });
    }

    // ===== 통계 =====
    function renderStats(){
      $('screenTitle').textContent='리포트';
      const cm=monthStr(new Date()), list=monthTx(cm);
      const actual=actualSpend(list), charge=sumBy(list,'prepaid_charge'), pspend=sumBy(list,'prepaid_spend')+sumBy(list,'point_spend'), inc=sumBy(list,'income');
      let h='<div class="card"><div class="sec-title" style="margin:0 0 12px;">이번달 요약</div>'+
        '<div class="summary"><div><div class="s-label">수입</div><div class="s-val green">'+won(inc)+'</div></div>'+
        '<div><div class="s-label">실제소비</div><div class="s-val red">'+won(actual)+'</div></div>'+
        '<div><div class="s-label">충전</div><div class="s-val blue">'+won(charge)+'</div></div></div>'+
        '<div class="tx-sub" style="margin-top:10px;text-align:center;">선불·포인트 사용 '+won(pspend)+' · 미사용 충전잔액 '+won(prepaidTotal())+'</div></div>';
      const bgs=visibleBudgets();
      if(bgs.length){
        h+='<div class="card"><div class="row" style="margin-bottom:4px;"><div class="sec-title" style="margin:0;">예산</div><button class="link" onclick="openBudgetSheet()">관리</button></div>'+
          bgs.map(b=>{ const u=budgetUsage(b), c=budgetColor(u.pct); return '<div style="margin:10px 0;"><div class="row" style="font-size:13px;"><span>'+budgetTitle(b)+'</span><span style="color:'+c+';font-weight:700;">'+u.pct+'%'+(u.pct>=100?' 초과':'')+'</span></div><div class="bar"><i style="width:'+Math.min(u.pct,100)+'%;background:'+c+'"></i></div><div class="tx-sub" style="margin-top:4px;">'+won(u.used)+' / '+won(u.amount)+'</div></div>'; }).join('')+'</div>';
      }
      const pbsR=visiblePBs().filter(p=>(p.status||'active')==='active');
      if(pbsR.length){
        const ranked=pbsR.map(p=>({p,u:pbUsage(p)})).sort((a,b)=>b.u.used-a.u.used).slice(0,3);
        h+='<div class="card"><div class="row" style="margin-bottom:4px;"><div class="sec-title" style="margin:0;">목적별 가계부</div><button class="link" onclick="openPurposeBooks()">전체</button></div>'+
          ranked.map(r=>{ const c=budgetColor(r.u.pct); return '<div style="margin:10px 0;"><div class="row" style="font-size:13px;"><span>'+(r.p.icon||'📒')+' '+escapeHtml(r.p.name)+'</span><span>'+won(r.u.used)+(r.p.budgetAmount?(' / '+won(r.u.amount)):'')+'</span></div>'+(r.p.budgetAmount?('<div class="bar"><i style="width:'+Math.min(r.u.pct,100)+'%;background:'+c+'"></i></div>'):'')+'</div>'; }).join('')+'</div>';
      }
      const pa=prepaidAccounts().filter(canSee);
      if(pa.length) h+='<div class="card"><div class="sec-title" style="margin:0 0 8px;">선불·포인트 잔액</div>'+pa.map(a=>'<div class="row" style="padding:7px 2px;"><span>'+((a.provider&&a.provider!=='manual')?PROVIDER_LABEL[a.provider]+' · ':'')+escapeHtml(a.name)+'</span><b class="blue">'+won(accountBalance(a.id))+'</b></div>').join('')+'</div>';
      h+='<div class="card"><div class="sec-title" style="margin:0 0 10px;">월별 실제소비 추세</div><div style="position:relative;height:240px;"><canvas id="cM"></canvas></div></div>'+
        '<div class="card"><div class="sec-title" style="margin:0 0 10px;">이번달 카테고리</div><div style="position:relative;height:240px;"><canvas id="cC"></canvas></div></div>'+
        '<div class="card"><div class="sec-title" style="margin:0 0 12px;">사용자별 실제소비 (이번달)</div><div id="cmpBox"></div></div>';
      $('content').innerHTML=h;
      setTimeout(drawCharts, 60);
    }
    function drawCharts(){
      if(!$('cM')||!$('cC')||!$('cmpBox')) return; // 타이머 실행 시점에 리포트 탭을 떠났으면 중단
      const dark=state.theme==='dark'; const grid=dark?'rgba(255,255,255,.08)':'rgba(0,0,0,.06)'; const tick=dark?'#9aa0a6':'#8b95a1';
      const md={}; state.transactions.filter(isActual).forEach(t=>{ const m=(t.date||'').substring(0,7); if(m) md[m]=(md[m]||0)+(Number(t.amount)||0); });
      const mk=Object.keys(md).sort().slice(-6);
      if(monthlyChart) monthlyChart.destroy();
      monthlyChart=new Chart($('cM'),{ type:'bar', data:{ labels:mk, datasets:[{ data:mk.map(k=>md[k]), backgroundColor:'#3182f6', borderRadius:6 }] },
        options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{ x:{grid:{display:false},ticks:{color:tick}}, y:{grid:{color:grid},ticks:{color:tick}} } } });
      const cd={}; monthTx(monthStr(new Date())).filter(t=>isActual(t)&&t.category).forEach(t=>{ cd[t.category]=(cd[t.category]||0)+(Number(t.amount)||0); });
      const ck=Object.keys(cd);
      if(categoryChart) categoryChart.destroy();
      categoryChart=new Chart($('cC'),{ type:'doughnut', data:{ labels:ck, datasets:[{ data:ck.map(k=>cd[k]), backgroundColor:ck.map(catColor) }] },
        options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom',labels:{color:tick,boxWidth:12}}} } });
      const ue={}; monthTx(monthStr(new Date())).filter(isActual).forEach(t=>{ const u=t.user||'미지정'; ue[u]=(ue[u]||0)+(Number(t.amount)||0); });
      const names=Array.from(new Set([...wsMemberNames(), ...Object.keys(ue)]));
      const mx=Math.max(1,...names.map(n=>ue[n]||0));
      const palette=['#f04452','#3182f6','#1b9e5f','#f59f00','#9b59b6','#00b8d4'];
      $('cmpBox').innerHTML = names.length ? names.map((n,i)=>'<div style="margin-bottom:12px;"><div class="row" style="font-size:13px;margin-bottom:6px;"><b>'+escapeHtml(n)+'</b><span>'+won(ue[n]||0)+'</span></div><div class="bar"><i style="width:'+((ue[n]||0)/mx*100)+'%;background:'+palette[i%palette.length]+'"></i></div></div>').join('') : '<div class="empty">데이터 없음</div>';
    }

    // ===== 자산 =====
    function renderAssets(){
      $('screenTitle').textContent='자산';
      const accs=visibleAccounts();
      let h='<div class="card" style="text-align:center;padding:22px;"><div class="muted" style="font-size:13px;">총 자산</div>'+
        '<div style="font-size:30px;font-weight:800;margin:6px 0;">'+won(totalAssets())+'</div>'+
        '<div style="font-size:12px;" class="muted">선불·포인트 미사용 잔액 <b class="blue">'+won(prepaidTotal())+'</b></div></div>';

      const groups=[['cash','계좌·현금','💵'],['card','카드','💳'],['prepaid','선불·포인트','🔵'],['other','기타','📦']];
      groups.forEach(g=>{
        const list=accs.filter(a=>acctGroup(a)===g[0]);
        if(!list.length && g[0]!=='cash') return;
        h+='<div class="row"><div class="sec-title">'+g[2]+' '+g[1]+'</div></div><div class="card">';
        h+= list.length? list.map(acctRowHtml).join('') : '<div class="empty" style="padding:18px;">없음</div>';
        h+='</div>';
      });
      h+='<div style="text-align:center;margin:2px 0 16px;"><button class="btn ghost sm" onclick="openAcctSheet()">+ 결제수단 추가</button></div>';

      if(state.creditCards.length){
        h+='<div class="row"><div class="sec-title">💳 카드 실적</div><button class="link" onclick="openCardList()">전체</button></div>';
        state.creditCards.filter(c=>canSee(getAcct(c.id)||{owner:''})).forEach(c=>{
          const pf=cardPerformance(c), col=pf.pct>=100?'var(--income)':'var(--primary)';
          h+='<div class="card" onclick="openCardList()"><div class="row"><b>'+escapeHtml(c.cardName||acctName(c.id))+'</b><span style="color:'+col+';font-weight:700;">'+(pf.target?pf.pct+'%':'목표 미설정')+'</span></div>'+
            (pf.target?'<div class="bar"><i style="width:'+Math.min(pf.pct,100)+'%;background:'+col+'"></i></div><div class="tx-sub" style="margin-top:8px;">'+won(pf.sum)+' / '+won(pf.target)+(pf.remain>0?' · 남은 실적 '+won(pf.remain):' · 달성 ✅')+'</div>':'')+'</div>';
        });
      }

      h+='<div class="row"><div class="sec-title">🎯 적금 목표</div><button class="link" onclick="openSavingsSheet()">+ 추가</button></div>';
      h+= state.savings.length? state.savings.map(sv=>{ const p=sv.goal?Math.min(Math.round(sv.current/sv.goal*100),999):0;
        return '<div class="card" onclick="openSavingsSheet(\''+sv.ownerUid+'\',\''+sv.id+'\')"><div class="row"><b>'+escapeHtml(sv.name)+'</b><span style="font-weight:700;">'+p+'%</span></div><div class="bar"><i style="width:'+Math.min(p,100)+'%"></i></div><div class="tx-sub" style="margin-top:8px;">'+won(sv.current)+' / '+won(sv.goal)+'</div></div>';
      }).join(''):'<div class="empty" style="padding:20px;">적금 목표가 없습니다</div>';

      $('content').innerHTML=h;
    }
    function acctRowHtml(a){
      const bal=accountBalance(a.id);
      const prov=(a.provider&&a.provider!=='manual')?'<span class="pill">'+(PROVIDER_LABEL[a.provider]||a.provider)+'</span>':'';
      const vis=(a.visibility&&a.visibility!=='full')?'<span class="pill">'+(a.visibility==='private'?'개인':'잔액만')+'</span>':'';
      const initial=(a.owner==='공동'?'👥':((a.owner||'').charAt(0)||'₩'));
      return '<div class="acct" onclick="openAcctSheet(\''+a.id+'\')"><div class="acct-dot" style="background:'+(a.color||'#3182f6')+'">'+initial+'</div>'+
        '<div style="min-width:0;"><div class="acct-name">'+escapeHtml(a.name)+'<span class="pill">'+(ACCT_TYPE_LABEL[a.type]||a.type)+'</span>'+prov+vis+'</div><div class="tx-sub">'+escapeHtml(a.owner||'')+'</div></div>'+
        '<div class="acct-bal '+(bal<0?'red':'')+'">'+won(bal)+'</div></div>';
    }

    function openAcctSheet(id, presetType){
      const a=id?getAcct(id):null;
      const card=id?getCard(id):null;
      const curType=a?a.type:(presetType||'bank');
      let h='<div class="field"><label>이름</label><input class="input" id="aName" value="'+escapeHtml(a?a.name:'')+'" placeholder="예: 쿠팡캐시, 신한카드"></div>';
      h+='<div class="form-2"><div class="field"><label>유형</label><select class="input" id="aType" onchange="onAcctTypeChange()">'+ACCT_TYPES.map(p=>'<option value="'+p[0]+'"'+(curType===p[0]?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>제공처</label><select class="input" id="aProvider">'+PROVIDERS.map(p=>'<option value="'+p[0]+'"'+(((a&&a.provider===p[0])||(!a&&p[0]==='manual'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div></div>';
      h+='<div class="form-2"><div class="field"><label>소유자</label><select class="input" id="aOwner">'+ownerOptions(a?a.owner:(isGroupWs()?'공동':state.userName))+'</select></div>'+
        '<div class="field"><label>공개 범위</label><select class="input" id="aVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((a&&a.visibility===p[0])||(!a&&p[0]==='full'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div></div>';
      h+='<div class="field"><label>현재(초기) 잔액</label><input class="input" id="aInit" inputmode="numeric" value="'+(a?Number(a.initialBalance||0).toLocaleString():'')+'" placeholder="0" oninput="this.value=fmtComma(this.value)"></div>';
      h+='<div class="field"><label>메모 (선택)</label><input class="input" id="aMemo" value="'+escapeHtml(a?(a.memo||''):'')+'" placeholder="메모"></div>';
      h+='<div id="aCardCfg" style="'+(curType==='credit_card'?'':'display:none;')+'">'+(curType==='credit_card'?cardCfgHtml(card):'')+'</div>';
      h+='<button class="btn" onclick="saveAcct('+(id?'\''+id+'\'':'null')+')">'+(a?'수정':'추가')+'</button>';
      if(a) h+='<button class="btn danger" style="margin-top:8px;" onclick="deleteAcct(\''+id+'\')">삭제</button>';
      openSheet(a?'결제수단 수정':'결제수단 추가', h);
    }
    function cardCfgHtml(card){
      return '<div class="card" style="padding:14px;margin:4px 0 14px;"><div class="sec-title" style="margin:0 0 10px;">💳 카드 실적 설정</div>'+
        '<div class="field"><label>카드사</label><input class="input" id="cCompany" value="'+escapeHtml(card?(card.cardCompany||''):'')+'" placeholder="예: 신한"></div>'+
        '<div class="field"><label>월 실적 기준 금액</label><input class="input" id="cTarget" inputmode="numeric" value="'+(card&&card.monthlyPerformanceTarget?Number(card.monthlyPerformanceTarget).toLocaleString():'')+'" placeholder="예: 300,000" oninput="this.value=fmtComma(this.value)"></div>'+
        '<div class="form-2"><div class="field"><label>실적 기간</label><select class="input" id="cPeriod" onchange="onCardPeriodChange()"><option value="calendar_month"'+(!card||card.performancePeriodType!=='custom'?' selected':'')+'>매월 1일~말일</option><option value="custom"'+(card&&card.performancePeriodType==='custom'?' selected':'')+'>사용자 지정</option></select></div>'+
        '<div class="field" id="cStartWrap" style="'+(card&&card.performancePeriodType==='custom'?'':'display:none;')+'"><label>시작일</label><input class="input" id="cStartDay" inputmode="numeric" value="'+(card&&card.performanceStartDay?card.performanceStartDay:'')+'" placeholder="예: 15"></div></div>'+
        '<div class="menu-item" style="padding:6px 0;"><span>선불충전 실적 포함</span><div class="switch '+(card&&card.includePrepaidCharge?'on':'')+'" id="cIncPrepaid" onclick="this.classList.toggle(\'on\')"><i></i></div></div>'+
        '<div class="field"><label>실적 제외 카테고리 (쉼표 구분)</label><input class="input" id="cExclCats" value="'+escapeHtml(card&&card.excludedCategories?card.excludedCategories.join(', '):'')+'" placeholder="예: 교통, 보험"></div></div>';
    }
    function onAcctTypeChange(){ const t=val('aType'); const box=$('aCardCfg'); if(!box) return; if(t==='credit_card'){ box.style.display=''; if(!box.innerHTML.trim()) box.innerHTML=cardCfgHtml(null); } else box.style.display='none'; }
    function onCardPeriodChange(){ const w=$('cStartWrap'); if(w) w.style.display=(val('cPeriod')==='custom')?'':'none'; }
    function saveAcct(id){
      const name=val('aName').trim(); if(!name){ toast('이름을 입력하세요', true); return; }
      const owner=val('aOwner'), type=val('aType');
      const colorMap={'현경':'#f04452','구근':'#3182f6','공동':'#1b9e5f'};
      const key=id||('acc_'+Date.now());
      const data={ name, type, provider:val('aProvider'), owner, visibility:val('aVis'),
        initialBalance:parseAmount(val('aInit')), memo:val('aMemo').trim(),
        color:(getAcct(id)||{}).color||colorMap[owner]||'#3182f6', order:(getAcct(id)||{}).order||state.accounts.length+1 };
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
    function deleteAcct(id){
      const used=state.transactions.some(t=>t.from===id||t.to===id);
      confirmSheet(used?'이 결제수단을 쓰는 거래가 있습니다. 그래도 삭제할까요? (거래는 남습니다)':'이 결제수단을 삭제할까요?',
        ()=>{ const u={}; u['accounts/'+id]=null; if(getCard(id)) u['creditCards/'+id]=null; db.ref(wsRoot()).update(u); toast('삭제되었습니다'); });
    }
    // ===== 카드 실적 화면 =====
    function openCardList(){
      let h='<button class="btn" onclick="openAcctSheet(null,\'credit_card\')">+ 신용카드 추가</button>';
      const cards=state.creditCards.filter(c=>canSee(getAcct(c.id)||{owner:''}));
      if(!cards.length) h+='<div class="empty">등록된 신용카드가 없습니다.<br>결제수단을 \'신용카드\' 유형으로 추가하세요.</div>';
      cards.forEach(c=>{ const pf=cardPerformance(c), col=pf.pct>=100?'var(--income)':(pf.pct>=70?'var(--primary)':'#f5a623');
        h+='<div class="card"><div class="row" onclick="openAcctSheet(\''+c.id+'\')"><b>'+escapeHtml(c.cardName||acctName(c.id))+(c.cardCompany?' <span class="pill">'+escapeHtml(c.cardCompany)+'</span>':'')+'</b><span style="color:'+col+';font-weight:800;">'+(pf.target?pf.pct+'%':'목표X')+'</span></div>';
        if(pf.target) h+='<div class="bar"><i style="width:'+Math.min(pf.pct,100)+'%;background:'+col+'"></i></div><div class="tx-sub" style="margin-top:8px;">'+won(pf.sum)+' / '+won(pf.target)+(pf.remain>0?' · 남은 실적 '+won(pf.remain):' · 달성 ✅')+'<br>기간 '+ymd(pf.start)+' ~ '+ymd(pf.end)+'</div>';
        if(pf.excluded.length) h+='<div class="tx-sub" style="margin-top:10px;font-weight:700;color:var(--sub);">🚫 실적 제외 '+pf.excluded.length+'건</div><div class="card" style="padding:2px 8px;margin-top:6px;box-shadow:none;border:1px solid var(--line);">'+pf.excluded.slice(0,8).map(txRowHtml).join('')+'</div>';
        h+='</div>';
      });
      openSheet('카드 실적', h);
    }

    function openSavingsSheet(ownerUid,id){
      const sv=(ownerUid&&id)?state.savings.find(x=>x.ownerUid===ownerUid&&x.id===id):null;
      let h='<div class="field"><label>목표명</label><input class="input" id="vName" value="'+escapeHtml(sv?sv.name:'')+'" placeholder="예: 여행 자금"></div>';
      h+='<div class="form-2"><div class="field"><label>목표액</label><input class="input" id="vGoal" inputmode="numeric" value="'+(sv?Number(sv.goal).toLocaleString():'')+'" oninput="this.value=fmtComma(this.value)"></div>'+
        '<div class="field"><label>현재액</label><input class="input" id="vCur" inputmode="numeric" value="'+(sv?Number(sv.current).toLocaleString():'')+'" oninput="this.value=fmtComma(this.value)"></div></div>';
      h+='<button class="btn" onclick="saveSavings('+(sv?'\''+ownerUid+'\',\''+id+'\'':'null,null')+')">'+(sv?'수정':'추가')+'</button>';
      if(sv) h+='<button class="btn danger" style="margin-top:8px;" onclick="deleteSavings(\''+ownerUid+'\',\''+id+'\')">삭제</button>';
      openSheet(sv?'적금 수정':'적금 추가', h);
    }
    function saveSavings(ownerUid,id){
      const name=val('vName').trim(), goal=parseAmount(val('vGoal')), cur=parseAmount(val('vCur'));
      if(!name||!goal){ toast('목표명과 목표액을 입력하세요', true); return; }
      const data={ name, goal, current:cur, user:state.userName };
      if(ownerUid&&id) db.ref(wp('savings/'+ownerUid+'/'+id)).set(data); else db.ref(wp('savings/'+state.uid+'/'+Date.now())).set(data);
      toast('저장되었습니다'); closeSheet();
    }
    function deleteSavings(ownerUid,id){ confirmSheet('이 적금 목표를 삭제할까요?', ()=>{ db.ref(wp('savings/'+ownerUid+'/'+id)).remove(); toast('삭제되었습니다'); }); }

    // ===== 더보기 =====
    // ===== 워크스페이스(가계부/그룹) 관리 UI =====
    function openWorkspaceSheet(){
      const cur=state.wsId;
      let h='<p class="muted" style="font-size:13px;margin:2px 2px 12px;">개인 가계부와 그룹 가계부를 분리해서 쓸 수 있어요. 그룹은 코드로 친구와 함께 사용합니다.</p>';
      h+='<div class="menu-group-title">내 가계부</div>';
      (state.memberships||[]).forEach(w=>{
        const on=w.id===cur, isGroup=w.type==='group', memCount=Object.keys(w.members||{}).length;
        h+='<div class="ws-item'+(on?' on':'')+'">'+
            '<span class="ws-ic">'+(isGroup?'👥':'🏠')+'</span>'+
            '<div style="flex:1;min-width:0;" onclick="chooseWorkspace(\''+w.id+'\')">'+
              '<div class="ws-name">'+escapeHtml(w.name||'가계부')+(on?' <span class="pill">사용중</span>':'')+'</div>'+
              '<div class="ws-meta">'+(isGroup?('그룹 · 멤버 '+memCount+'명'):'개인 전용')+'</div>'+
            '</div>'+
            (isGroup?'<button class="btn sm ghost" onclick="openGroupManageSheet(\''+w.id+'\')">관리</button>':'')+
          '</div>';
      });
      h+='<div class="form-2" style="margin-top:14px;">'+
          '<button class="btn" onclick="openCreateGroupSheet()">+ 그룹 만들기</button>'+
          '<button class="btn ghost" onclick="openJoinGroupSheet()">코드로 참여</button>'+
         '</div>';
      if(!(state.memberships||[]).some(w=>w.type==='personal'))
        h+='<button class="btn ghost" style="margin-top:10px;" onclick="addPersonalWorkspace()">+ 개인 가계부 만들기</button>';
      openSheet('가계부 전환', h);
    }
    function chooseWorkspace(id){ closeSheet(); if(id!==state.wsId) switchWorkspace(id); }
    async function addPersonalWorkspace(){ closeSheet(); await createPersonalWorkspace(); await loadMyWorkspaces(); const p=state.memberships.find(w=>w.type==='personal'); if(p) switchWorkspace(p.id); }
    function openCreateGroupSheet(){
      openSheet('그룹 만들기',
        '<div class="field"><label>그룹 이름</label><input class="input" id="grpName" placeholder="예: 우리집 가계부"></div>'+
        '<p class="muted" style="font-size:13px;margin:0 2px 12px;">만들면 6자리 초대 코드가 생겨요. 코드를 공유한 사람만 이 그룹에 들어올 수 있어요.</p>'+
        '<button class="btn" onclick="doCreateGroup()">만들기</button>');
    }
    async function doCreateGroup(){
      try{
        const name=val('grpName').trim()||'우리 가계부';
        const r=await createGroupWorkspace(name);
        await loadMyWorkspaces();
        openSheet('그룹 생성 완료',
          '<p style="font-size:14px;margin:2px 2px 8px;">"'+escapeHtml(name)+'" 그룹을 만들었어요. 아래 코드를 친구에게 공유하세요.</p>'+
          '<div class="code-box"><span>'+r.code+'</span><button class="btn sm" onclick="copyText(\''+r.code+'\')">복사</button></div>'+
          '<button class="btn" onclick="chooseWorkspace(\''+r.wsId+'\')">이 그룹으로 전환</button>');
      }catch(e){ toast(e.message||'그룹 생성 실패', true); }
    }
    function openJoinGroupSheet(){
      openSheet('코드로 그룹 참여',
        '<div class="field"><label>그룹 코드 6자리</label><input class="input" id="joinCode" placeholder="ABC123" maxlength="6" style="text-transform:uppercase;letter-spacing:3px;font-weight:800;"></div>'+
        '<button class="btn" onclick="doJoin()">참여하기</button>');
    }
    async function doJoin(){ try{ const ok=await joinByCode(val('joinCode')); if(ok) closeSheet(); }catch(e){ toast(e.message||'참여 실패', true); } }
    function openGroupManageSheet(wsId){
      const w=(state.memberships||[]).find(x=>x.id===wsId); if(!w) return;
      const members=w.members||{}, isOwner=w.ownerUid===state.uid;
      let h='<div class="field"><label>그룹 이름</label><div style="font-weight:700;font-size:16px;padding:4px 2px;">'+escapeHtml(w.name||'')+'</div></div>';
      h+='<label style="font-size:13px;font-weight:700;color:var(--sub);">초대 코드</label>';
      h+='<div class="code-box"><span>'+(w.code||'------')+'</span><button class="btn sm" onclick="copyText(\''+(w.code||'')+'\')">복사</button></div>';
      h+='<label style="font-size:13px;font-weight:700;color:var(--sub);">멤버 '+Object.keys(members).length+'명</label><div style="margin:8px 0 4px;">';
      Object.keys(members).forEach(uid=>{ const m=members[uid]; h+='<span class="member-pill">'+(m.role==='owner'?'👑':'👤')+' '+escapeHtml(m.name||'멤버')+(uid===state.uid?' (나)':'')+'</span>'; });
      h+='</div>';
      h+='<button class="btn danger" style="margin-top:16px;" onclick="confirmLeave(\''+wsId+'\')">그룹 나가기</button>';
      openSheet('그룹 관리', h);
    }
    function confirmLeave(wsId){
      const w=(state.memberships||[]).find(x=>x.id===wsId);
      const last=w && Object.keys(w.members||{}).length<=1;
      confirmSheet(last?'마지막 멤버예요. 나가면 이 그룹의 데이터가 모두 삭제됩니다. 계속할까요?':'이 그룹에서 나갈까요? (이 그룹 데이터에 더 이상 접근할 수 없어요)', ()=>leaveWorkspace(wsId));
    }
    function copyText(t){ if(navigator.clipboard && t){ navigator.clipboard.writeText(t).then(()=>toast('복사했어요')).catch(()=>toast(t)); } else toast(t||''); }

    function renderMore(){
      $('screenTitle').textContent='더보기';
      let h='';
      if(deferredPrompt) h+='<div class="install-banner" onclick="installApp()">📲 홈 화면에 앱으로 설치하기</div>';
      const ws=state.wsMeta||{}; const isGroup=ws.type==='group'; const memCount=Object.keys(ws.members||{}).length;
      h+='<div class="menu-group-title">현재 가계부</div><div class="card" style="padding:8px 10px;">';
      h+='<div class="menu-item" onclick="openWorkspaceSheet()"><span class="mi-ic">'+(isGroup?'👥':'🏠')+'</span>'+escapeHtml(ws.name||'가계부')+
         '<span class="pill">'+(isGroup?('그룹 '+memCount+'명'):'개인')+'</span><span class="chevron">전환 ›</span></div>';
      if(isGroup) h+=menuItem('🔑','초대 코드 / 멤버 관리',"openGroupManageSheet('"+state.wsId+"')");
      h+=menuItem('➕','그룹 만들기 / 참여','openWorkspaceSheet()');
      h+='</div>';
      h+='<div class="menu-group-title">거래 관리</div><div class="card" style="padding:8px 10px;">';
      h+=menuItem('🧾','거래내역',"goHome('list')");
      h+=menuItem('🔁','정기결제','openRecurringList()');
      h+=menuItem('🏷️','카테고리','openCategorySheet()');
      h+='</div>';
      h+='<div class="menu-group-title">계획</div><div class="card" style="padding:8px 10px;">';
      h+=menuItem('💵','예산','openBudgetSheet()');
      h+=menuItem('🔔','구독','openSubscriptions()');
      h+='</div>';
      h+='<div class="menu-group-title">자산 / 결제</div><div class="card" style="padding:8px 10px;">';
      h+=menuItem('🏦','결제수단',"go('assets')");
      h+=menuItem('🔵','선불·포인트',"go('assets')");
      h+=menuItem('💳','카드 실적','openCardList()');
      h+=menuItemSoon('🏧','대출');
      h+='</div>';
      h+='<div class="menu-group-title">목적별</div><div class="card" style="padding:8px 10px;">';
      h+=menuItem('📒','목적별 가계부','openPurposeBooks()')+menuItem('✈️','여행',"openPurposeBooks('travel')")+menuItem('👥','계모임',"openPurposeBooks('gathering')")+menuItemSoon('💐','경조사비')+menuItemSoon('🤝','정산');
      h+='</div>';
      h+='<div class="menu-group-title">데이터 / 설정</div><div class="card" style="padding:8px 10px;">';
      h+=menuItem('📤','CSV 내보내기','exportCSV()');
      h+='<div class="menu-item"><span class="mi-ic">🌙</span>다크모드<div class="switch '+(state.theme==='dark'?'on':'')+'" onclick="toggleTheme()"><i></i></div></div>';
      h+=menuItemSoon('🔒','권한 / 공동 설정');
      h+='</div>';
      h+='<div class="card" style="padding:8px 10px;">';
      h+='<div class="menu-item"><span class="mi-ic">👤</span>'+escapeHtml(state.userName)+' 님<span class="chevron"></span></div>';
      h+=menuItem('🚪','로그아웃','logout()');
      h+='</div>';
      h+='<p class="muted" style="text-align:center;font-size:12px;margin-top:18px;">가계부 v3 · '+escapeHtml(state.userName)+' 님</p>';
      $('content').innerHTML=h;
    }
    function menuItem(ic,label,fn){ return '<div class="menu-item" onclick="'+fn+'"><span class="mi-ic">'+ic+'</span>'+label+'<span class="chevron">›</span></div>'; }
    function menuItemSoon(ic,label){ return '<div class="menu-item disabled" onclick="toast(\'곧 추가될 기능입니다\')"><span class="mi-ic">'+ic+'</span>'+label+'<span class="pill">예정</span></div>'; }
    function goHome(view){ state.homeView=view||'list'; go('calendar'); }

    // ===== 예산 =====
    const PERIOD_LABEL={ weekly:'주간', monthly:'월간', yearly:'연간', custom:'사용자지정' };
    function budgetTitle(b){ return b.categoryName? (catIcon(b.categoryName)+' '+b.categoryName) : '🧮 총예산'; }
    function openBudgetSheet(){
      const list=visibleBudgets().slice().sort((a,b)=>(a.categoryName?1:0)-(b.categoryName?1:0));
      let h='<button class="btn" onclick="openBudgetEdit()">+ 예산 추가</button><div style="margin-top:12px;">';
      if(!list.length) h+='<div class="empty">설정된 예산이 없습니다</div>';
      list.forEach(b=>{ const u=budgetUsage(b), c=budgetColor(u.pct);
        h+='<div class="card"><div class="row" onclick="openBudgetEdit(\''+b.id+'\')"><b>'+budgetTitle(b)+' <span class="pill">'+(PERIOD_LABEL[b.periodType]||b.periodType)+'</span>'+(b.scope==='personal'?'<span class="pill">개인</span>':'')+'</b><span style="color:'+c+';font-weight:800;">'+u.pct+'%'+(u.pct>=100?' 초과':'')+'</span></div>'+
          '<div class="bar"><i style="width:'+Math.min(u.pct,100)+'%;background:'+c+'"></i></div>'+
          '<div class="row" style="margin-top:8px;"><span class="tx-sub">'+won(u.used)+' / '+won(u.amount)+'</span><span class="tx-sub">남음 '+won(u.remain)+'</span></div>'+
          '<div class="link" style="margin-top:8px;font-size:13px;" onclick="openBudgetDetail(\''+b.id+'\')">포함된 거래 보기 ›</div></div>';
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
    }
    function openBudgetEdit(id){
      const b=id?state.budgets.find(x=>x.id===id):null;
      const expCats=state.categories.filter(c=>c.type==='expense'||c.type==='other').sort((a,b2)=>(a.sortOrder||0)-(b2.sortOrder||0));
      let h='<div class="field"><label>대상</label><select class="input" id="bgCat"><option value="">총예산(전체 지출)</option>'+
        expCats.map(c=>'<option value="'+escapeHtml(c.name)+'"'+((b&&b.categoryName===c.name)?' selected':'')+'>'+c.icon+' '+escapeHtml(c.name)+'</option>').join('')+'</select></div>';
      h+='<div class="field"><label>예산 금액</label><input class="input" id="bgAmount" inputmode="numeric" value="'+(b?Number(b.amount).toLocaleString():'')+'" placeholder="0" oninput="this.value=fmtComma(this.value)"></div>';
      h+='<div class="form-2"><div class="field"><label>기간</label><select class="input" id="bgPeriod" onchange="onBudgetPeriodChange()">'+
        ['weekly','monthly','yearly','custom'].map(p=>'<option value="'+p+'"'+(((b&&b.periodType===p)||(!b&&p==='monthly'))?' selected':'')+'>'+PERIOD_LABEL[p]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>범위</label><select class="input" id="bgScope">'+
        [['group','그룹'],['personal','개인']].map(p=>'<option value="'+p[0]+'"'+(((b&&b.scope===p[0])||(!b&&p[0]==='group'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div></div>';
      h+='<div id="bgCustom" style="'+(b&&b.periodType==='custom'?'':'display:none;')+'"><div class="form-2"><div class="field"><label>시작일</label><input type="date" class="input" id="bgStart" value="'+(b&&b.startDate?b.startDate:todayStr())+'"></div>'+
        '<div class="field"><label>종료일</label><input type="date" class="input" id="bgEnd" value="'+(b&&b.endDate?b.endDate:todayStr())+'"></div></div></div>';
      h+='<div class="form-2"><div class="field"><label>경고 기준</label><select class="input" id="bgAlert">'+
        [80,90,100].map(n=>'<option value="'+n+'"'+(((b&&b.alertThreshold===n)||(!b&&n===80))?' selected':'')+'>'+n+'%</option>').join('')+'</select></div>'+
        '<div class="field"><label>공개 범위</label><select class="input" id="bgVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((b&&b.visibility===p[0])||(!b&&p[0]==='full'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div></div>';
      h+='<button class="btn" onclick="saveBudget('+(id?'\''+id+'\'':'null')+')">'+(b?'수정':'추가')+'</button>';
      if(b) h+='<button class="btn danger" style="margin-top:8px;" onclick="deleteBudget(\''+id+'\')">삭제</button>';
      openSheet(b?'예산 수정':'예산 추가', h);
    }
    function onBudgetPeriodChange(){ const w=$('bgCustom'); if(w) w.style.display=(val('bgPeriod')==='custom')?'':'none'; }
    function saveBudget(id){
      const amount=parseAmount(val('bgAmount'));
      if(!amount){ toast('예산 금액을 입력하세요', true); return; }
      const b=id?state.budgets.find(x=>x.id===id):null;
      const scope=val('bgScope'), vis=val('bgVis'), now=new Date().toISOString();
      const data={ categoryName: val('bgCat')||null, amount, periodType:val('bgPeriod'),
        startDate: val('bgPeriod')==='custom'?(val('bgStart')||todayStr()):null,
        endDate: val('bgPeriod')==='custom'?(val('bgEnd')||todayStr()):null,
        scope, alertEnabled:true, alertThreshold:Number(val('bgAlert'))||80, visibility:vis,
        owner: b?(b.owner||(scope==='personal'||vis==='private'?state.userName:'공동')):(scope==='personal'||vis==='private'?state.userName:'공동'),
        purposeBookId: b?(b.purposeBookId||null):null,
        createdAt: b?(b.createdAt||now):now, updatedAt:now };
      const key=id||('bg_'+Date.now());
      db.ref(wp('budgets/'+key)).set(data); toast(b?'수정되었습니다':'추가되었습니다'); openBudgetSheet();
    }
    function deleteBudget(id){ confirmSheet('이 예산을 삭제할까요?', ()=>{ db.ref(wp('budgets/'+id)).remove(); toast('삭제되었습니다'); openBudgetSheet(); }); }

    // ===== 카테고리 관리 =====
    let catFilter='all';
    const CAT_PALETTE=['#ff8a3d','#3182f6','#f04452','#9b59b6','#1b9e5f','#00b8d4','#a1734b','#868e96','#f59f00','#e84393','#7b68ee','#22b8cf'];
    function openCategorySheet(){ renderCatManage(); }
    function setCatFilter(t){ catFilter=t; renderCatManage(); }
    function renderCatManage(){
      const filters=[['all','전체'],['expense','지출'],['income','수입'],['other','기타']];
      let h='<div class="chip-row" style="margin-bottom:12px;">'+filters.map(f=>'<button class="chip '+(catFilter===f[0]?'on':'')+'" onclick="setCatFilter(\''+f[0]+'\')">'+f[1]+'</button>').join('')+'</div>';
      h+='<button class="btn" onclick="openCatEdit()">+ 카테고리 추가</button>';
      const cats=state.categories.filter(canSee).filter(c=> catFilter==='all'?true:(catFilter==='other'?!['expense','income'].includes(c.type):c.type===catFilter)).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
      h+='<div class="card" style="margin-top:12px;padding:6px 8px;">'+(cats.length?cats.map(catManageRow).join(''):'<div class="empty">카테고리가 없습니다</div>')+'</div>';
      openSheet('카테고리 관리', h);
    }
    function catManageRow(c){
      const inactive=c.isActive===false;
      return '<div class="acct" style="opacity:'+(inactive?'.5':'1')+';">'+
        '<div class="acct-dot" style="background:'+(c.color||'#8b95a1')+'">'+(c.icon||'🏷️')+'</div>'+
        '<div style="flex:1;min-width:0;" onclick="openCatEdit(\''+escapeHtml(c.name)+'\')"><div class="acct-name">'+escapeHtml(c.name)+'<span class="pill">'+(CAT_TYPE_LABEL[c.type]||c.type||'')+'</span>'+(c.isDefault?'<span class="pill">기본</span>':'')+(c.visibility==='private'?'<span class="pill">개인</span>':'')+'</div></div>'+
        '<div style="display:flex;align-items:center;gap:2px;">'+
          '<button class="icon-btn" style="width:30px;height:30px;font-size:13px;box-shadow:none;background:var(--line-soft);" onclick="moveCat(\''+escapeHtml(c.name)+'\',-1)">▲</button>'+
          '<button class="icon-btn" style="width:30px;height:30px;font-size:13px;box-shadow:none;background:var(--line-soft);" onclick="moveCat(\''+escapeHtml(c.name)+'\',1)">▼</button>'+
          '<div class="switch '+(inactive?'':'on')+'" onclick="toggleCatActive(\''+escapeHtml(c.name)+'\')"><i></i></div>'+
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
    function pickCatColor(el){ window._catColor=el.dataset.color; document.querySelectorAll('#catColors button').forEach(b=>b.style.border='2px solid transparent'); el.style.border='2px solid var(--text)'; }
    function openCatEdit(name){
      const c=name?getCat(name):null;
      const usedCount=name? state.transactions.filter(t=>t.category===name).length : 0;
      const canRename = !!c && !c.isDefault && usedCount===0;
      window._catColor = c?(c.color||CAT_PALETTE[0]):CAT_PALETTE[0];
      let h='';
      if(c && !canRename) h+='<div class="field"><label>이름</label><input class="input" value="'+escapeHtml(c.name)+'" disabled><div class="tx-sub" style="margin-top:4px;">'+(c.isDefault?'기본 카테고리는 이름 변경 불가':'거래에 사용 중이라 이름 변경 불가(비활성화 권장)')+'</div></div>';
      else h+='<div class="field"><label>이름</label><input class="input" id="catName" value="'+escapeHtml(c?c.name:'')+'" placeholder="예: 반려동물"></div>';
      h+='<div class="form-2"><div class="field"><label>유형</label><select class="input" id="catType">'+CAT_TYPES.map(p=>'<option value="'+p[0]+'"'+(((c&&c.type===p[0])||(!c&&p[0]==='expense'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>아이콘</label><input class="input" id="catIcon" maxlength="2" value="'+escapeHtml(c?(c.icon||''):'')+'" placeholder="🏷️"></div></div>';
      h+='<label style="font-size:13px;font-weight:600;color:var(--sub);">색상</label><div class="chip-row" id="catColors" style="margin:8px 0 14px;">'+CAT_PALETTE.map(p=>'<button class="chip" style="background:'+p+';width:32px;height:32px;border-radius:50%;border:2px solid '+(p===window._catColor?'var(--text)':'transparent')+';" data-color="'+p+'" onclick="pickCatColor(this)"></button>').join('')+'</div>';
      h+='<div class="form-2"><div class="field"><label>공개 범위</label><select class="input" id="catVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((c&&c.visibility===p[0])||(!c&&p[0]==='full'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>활성</label><select class="input" id="catActive"><option value="1"'+((!c||c.isActive!==false)?' selected':'')+'>활성</option><option value="0"'+((c&&c.isActive===false)?' selected':'')+'>비활성</option></select></div></div>';
      h+='<div class="field"><label>메모 (선택)</label><input class="input" id="catMemo" value="'+escapeHtml(c?(c.memo||''):'')+'" placeholder="메모"></div>';
      h+='<button class="btn" onclick="saveCat('+(name?'\''+escapeHtml(name)+'\'':'null')+','+canRename+')">'+(c?'수정':'추가')+'</button>';
      if(c && !c.isDefault) h+='<button class="btn danger" style="margin-top:8px;" onclick="deleteCat(\''+escapeHtml(name)+'\')">삭제</button>';
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
      const data={ name, type:val('catType'), icon:val('catIcon').trim()||'🏷️', color:window._catColor||'#8b95a1',
        visibility:vis, isActive: val('catActive')==='1', memo:val('catMemo').trim(),
        isDefault: c?!!c.isDefault:false,
        owner: c?(c.owner||(vis==='private'?state.userName:'공동')):(vis==='private'?state.userName:'공동'),
        sortOrder: c?(c.sortOrder!=null?c.sortOrder:(state.categories.length+1)):(Math.max(0,...state.categories.map(x=>x.sortOrder||0))+1),
        createdAt: c?(c.createdAt||nowISO):nowISO, updatedAt: nowISO };
      const upd={}; upd['categories/'+name]=data; if(renaming) upd['categories/'+origName]=null;
      db.ref(wsRoot()).update(upd); toast(c?'수정되었습니다':'추가되었습니다'); openCategorySheet();
    }
    function deleteCat(name){
      const c=getCat(name); if(!c) return;
      if(c.isDefault){ toast('기본 카테고리는 삭제 불가(비활성화만 가능)', true); return; }
      const used=state.transactions.filter(t=>t.category===name).length;
      const msg = used? ('이 카테고리를 쓴 거래가 '+used+'건 있습니다. 삭제해도 거래의 카테고리명은 남지만 비활성화를 권장합니다. 그래도 삭제할까요?') : '이 카테고리를 삭제할까요?';
      confirmSheet(msg, ()=>{ db.ref(wp('categories/'+name)).remove(); toast('삭제되었습니다'); openCategorySheet(); });
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
      let h='<button class="btn" onclick="openRecurringEdit()">+ 정기거래 추가</button>';
      const rules=state.recurring.filter(canSee).slice().sort((a,b)=>{ const na=nextRunOf(a),nb=nextRunOf(b); return (na?na.getTime():9e15)-(nb?nb.getTime():9e15); });
      if(!rules.length) h+='<div class="empty">등록된 정기거래가 없습니다</div>';
      rules.forEach(r=>{
        const st=ruleStatus(r), nr=nextRunOf(r);
        const stBadge = st==='active'?'':'<span class="pill">'+(st==='paused'?'일시정지':'종료')+'</span>';
        const cls = (r.type==='income'||r.type==='refund'||r.type==='point_earn')?'green':(r.type==='prepaid_charge'?'blue':'red');
        h+='<div class="card" style="opacity:'+(st==='active'?'1':'.6')+';"><div class="row" onclick="openRecurringEdit(\''+r.ownerUid+'\',\''+r.id+'\')"><b>'+escapeHtml(r.desc||'정기')+stBadge+'</b><span class="'+cls+'" style="font-weight:800;">'+won(r.amount)+'</span></div>'+
          '<div class="tx-sub" style="margin-top:6px;">'+TYPE_LABEL[r.type]+' · '+freqText(r)+(r.category?(' · '+escapeHtml(r.category)):'')+' · '+escapeHtml(acctName(r.from||r.to))+(nr&&st==='active'?(' · 다음 '+ymd(nr)):'')+'</div>';
        if(r.ownerUid===state.uid){
          h+='<div class="chip-row" style="margin-top:10px;">';
          if(st==='active') h+='<button class="chip" onclick="pauseRecurring(\''+r.ownerUid+'\',\''+r.id+'\')">일시정지</button>';
          else if(st==='paused') h+='<button class="chip" onclick="resumeRecurring(\''+r.ownerUid+'\',\''+r.id+'\')">재개</button>';
          if(st!=='ended') h+='<button class="chip" onclick="endRecurring(\''+r.ownerUid+'\',\''+r.id+'\')">종료</button>';
          h+='<button class="chip" onclick="generateRecurringNow(\''+r.ownerUid+'\',\''+r.id+'\')">즉시 생성</button>';
          h+='<button class="chip" onclick="viewRecurringTxs(\''+r.id+'\')">생성된 거래</button></div>';
        }
        h+='</div>';
      });
      openSheet('정기결제', h);
    }
    function viewRecurringTxs(ruleId){
      const txs=state.transactions.filter(t=>t.recurringId===ruleId).sort((a,b)=>new Date(b.date)-new Date(a.date));
      openSheet('생성된 거래 ('+txs.length+')', '<div class="card" style="padding:6px 10px;">'+(txs.length?txs.map(txRowHtml).join(''):'<div class="empty">생성된 거래가 없습니다</div>')+'</div>');
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
      h+='<div class="field"><label>유형</label><select class="input" id="rType" onchange="onRecTypeChange()">'+
        ['expense','income','transfer','prepaid_charge','prepaid_spend','refund','point_earn','point_spend','balance_adjustment'].map(t=>'<option value="'+t+'"'+(tp===t?' selected':'')+'>'+TYPE_LABEL[t]+'</option>').join('')+'</select></div>';
      h+='<div class="field"><label>제목</label><input class="input" id="rDesc" value="'+escapeHtml(r?(r.desc||''):'')+'" placeholder="예: 넷플릭스, 월세"></div>';
      h+='<div class="field"><label>금액</label><input class="input" id="rAmount" inputmode="numeric" value="'+(r?Number(r.amount).toLocaleString():'')+'" oninput="this.value=fmtComma(this.value)"></div>';
      h+='<div id="rAccts"></div>';
      h+='<div class="form-2"><div class="field"><label>주기</label><select class="input" id="rFreq" onchange="toggleRFreq()">'+
        [['daily','매일'],['weekly','매주'],['monthly','매월'],['yearly','매년'],['custom','사용자지정']].map(f=>'<option value="'+f[0]+'"'+(((r&&r.freq===f[0])||(!r&&f[0]==='monthly'))?' selected':'')+'>'+f[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>간격</label><input class="input" id="rInterval" inputmode="numeric" value="'+(r&&r.interval?r.interval:1)+'"></div></div>';
      h+='<div class="field" id="rDayWrap"></div>';
      h+='<div class="form-2"><div class="field"><label>시작일</label><input type="date" class="input" id="rStart" value="'+(r&&r.startDate?r.startDate:todayStr())+'"></div>'+
        '<div class="field"><label>종료일(선택)</label><input type="date" class="input" id="rEnd" value="'+(r&&r.endDate?r.endDate:'')+'"></div></div>';
      h+='<div id="rCardPerf"></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>자동 생성</span><div class="switch '+((!r||r.autoCreate!==false)?'on':'')+'" id="rAuto" onclick="this.classList.toggle(\'on\')"><i></i></div></div>';
      h+='<div class="field"><label>공개 범위</label><select class="input" id="rVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((r&&r.visibility===p[0])||(!r&&p[0]==='full'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>';
      h+='<div class="field"><label>메모(선택)</label><input class="input" id="rMemo" value="'+escapeHtml(r?(r.memo||''):'')+'" placeholder="메모"></div>';
      if(isOwn){
        h+='<button class="btn" onclick="saveRecurring('+(r?'\''+ownerUid+'\',\''+id+'\'':'null,null')+')">'+(r?'수정':'추가')+'</button>';
        if(r) h+='<button class="btn danger" style="margin-top:8px;" onclick="deleteRecurring(\''+ownerUid+'\',\''+id+'\')">삭제</button>';
      }
      openSheet(r?'정기거래 수정':'정기거래 추가', h);
      renderRecAccts(); toggleRFreq();
    }
    function onRecTypeChange(){ renderRecAccts(); }
    function recAcctField(label,id,sel){ return '<div class="field"><label>'+label+'</label><select class="input" id="'+id+'" onchange="renderRecCardPerf()">'+acctOptsHtml(sel)+'</select></div>'; }
    function recCatField(wantType, sel){
      const cats=state.categories.filter(c=>c.isActive!==false && (c.type===wantType||c.type==='other')).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
      return '<div class="field"><label>카테고리</label><select class="input" id="rCat" onchange="renderRecCardPerf()">'+cats.map(c=>'<option value="'+escapeHtml(c.name)+'"'+(c.name===sel?' selected':'')+'>'+c.icon+' '+escapeHtml(c.name)+'</option>').join('')+'</select></div>';
    }
    function renderRecAccts(){
      const r=window._recEdit, t=val('rType');
      const fromV=r?(r.from||''):(state.accounts[0]?state.accounts[0].id:''), toV=r?(r.to||''):(state.accounts[1]?state.accounts[1].id:(state.accounts[0]?state.accounts[0].id:'')), catV=r?(r.category||''):'';
      let h='';
      if(t==='expense'){ h+=recAcctField('출금/결제 수단','rFrom',fromV)+recCatField('expense',catV); }
      else if(t==='income'){ h+=recAcctField('입금 대상','rTo',toV)+recCatField('income',catV); }
      else if(t==='refund'){ h+=recAcctField('환불 받는 계정','rTo',toV)+recCatField('income',catV); }
      else if(t==='point_earn'){ h+=recAcctField('적립 포인트 계정','rTo',toV); }
      else if(t==='transfer'||t==='prepaid_charge'){ const l1=t==='prepaid_charge'?'충전 수단(카드/계좌)':'출금', l2=t==='prepaid_charge'?'충전 대상(선불/포인트)':'입금'; h+='<div class="form-2">'+recAcctField(l1,'rFrom',fromV)+recAcctField(l2,'rTo',toV)+'</div>'; }
      else if(t==='prepaid_spend'||t==='point_spend'){ h+=recAcctField(t==='point_spend'?'사용 포인트 계정':'결제 선불수단','rFrom',fromV)+(catTypeFor(t)?recCatField('expense',catV):''); }
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
      box.innerHTML='<div class="card" style="padding:14px;margin:4px 0 14px;"><div class="menu-item" style="padding:4px 0;"><span>💳 '+escapeHtml(card.cardName||acctName(card.id))+' 실적 포함</span><div class="switch '+(inc?'on':'')+'" id="rCpi" onclick="this.classList.toggle(\'on\');toggleRCpi()"><i></i></div></div>'+
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
        day: (freq==='monthly')?Number(val('rDay')||1):((r&&r.day)||1),
        weekday: (freq==='weekly')?Number(val('rWeekday')||0):((r&&r.weekday)||0),
        user: r?(r.user||state.userName):state.userName,
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
    let subTab='all';
    function openSubscriptions(){ subTab='all'; renderSubs(); }
    function setSubTab(t){ subTab=t; renderSubs(); }
    function renderSubs(){
      const subs=visibleSubs(); const act=subs.filter(subActive);
      const totalM=act.reduce((s,x)=>s+(monthlyEquiv(x)||0),0);
      const totalY=act.reduce((s,x)=>s+(yearlyEquiv(x)||0),0);
      const cm=monthStr(new Date());
      const thisMonthDue=act.filter(x=>x.nextBillingDate&&x.nextBillingDate.startsWith(cm)).reduce((s,x)=>s+(Number(x.amount)||0),0);
      const soon=act.filter(x=>{ const d=daysUntil(x.nextBillingDate); return d!=null&&d>=0&&d<=7; }).length;
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
      h+='<div class="chip-row">'+tabs.map(t=>'<button class="chip '+(subTab===t[0]?'on':'')+'" onclick="setSubTab(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div>';
      h+='<button class="btn" onclick="openSubEdit()">+ 구독 추가</button>';
      let list=subs.slice();
      if(subTab==='month') list=list.filter(x=>subActive(x)&&x.nextBillingDate&&x.nextBillingDate.startsWith(cm));
      else if(subTab==='soon') list=list.filter(x=>{ const d=daysUntil(x.nextBillingDate); return subActive(x)&&d!=null&&d>=0&&d<=7; });
      else if(subTab==='trial') list=list.filter(x=>x.isTrial&&subActive(x));
      else if(subTab==='ended') list=list.filter(x=>['cancelled','expired'].includes(x.status));
      list.sort((a,b)=>(a.nextBillingDate||'9999').localeCompare(b.nextBillingDate||'9999'));
      h+='<div style="margin-top:12px;">'+(list.length?list.map(subCard).join(''):'<div class="empty">구독이 없습니다</div>')+'</div>';
      openSheet('구독', h);
    }
    function subCard(s){
      const badges=subBadges(s).map(b=>'<span class="pill" style="background:'+b[1]+'22;color:'+b[1]+'">'+b[0]+'</span>').join('');
      const linked=s.recurringId?'<span class="pill">정기연결</span>':'';
      return '<div class="card" onclick="openSubDetail(\''+s.id+'\')"><div class="row"><b>'+escapeHtml(s.name||'구독')+' '+linked+'</b><span style="font-weight:800;">'+won(s.amount)+'</span></div>'+
        '<div class="tx-sub" style="margin-top:6px;">'+(BILLING_LABEL[s.billingCycle]||s.billingCycle)+(s.nextBillingDate?(' · 다음 '+s.nextBillingDate):'')+(s.paymentAccountId?(' · '+escapeHtml(acctName(s.paymentAccountId))):'')+'</div>'+
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
      h+='<div class="card">'+row('다음 결제일',s.nextBillingDate||'-')+row('만료일',s.expirationDate||'-')+
        (s.isTrial?row('무료체험 종료',s.trialEndDate||'-'):'')+row('자동 갱신',s.autoRenew!==false?'예':'아니오')+
        row('결제수단',escapeHtml(acctName(s.paymentAccountId)))+row('카테고리',escapeHtml(s.categoryName||'-'))+
        row('월 환산',me!=null?won(Math.round(me)):'환산 불가')+(s.memo?('<div class="tx-sub" style="margin-top:6px;">'+escapeHtml(s.memo)+'</div>'):'')+'</div>';
      h+='<div class="chip-row">'+['active','paused','cancelled','expired'].map(st=>'<button class="chip '+((s.status||'active')===st?'on':'')+'" onclick="setSubStatus(\''+s.id+'\',\''+st+'\')">'+SUB_STATUS_LABEL[st]+'</button>').join('')+'</div>';
      h+='<div class="sec-title" style="margin-left:2px;">연결된 결제 내역 ('+txs.length+')</div>';
      h+='<div class="card" style="padding:6px 10px;">'+(txs.length?txs.map(txRowHtml).join(''):'<div class="empty">연결된 거래 없음</div>')+'</div>';
      h+='<button class="btn ghost" onclick="openSubEdit(\''+s.id+'\')">수정</button>';
      h+='<button class="btn danger" style="margin-top:8px;" onclick="deleteSub(\''+s.id+'\')">삭제</button>';
      openSheet(s.name||'구독', h);
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
        '<div class="field"><label>카테고리</label><select class="input" id="subCat">'+cats.map(c=>'<option value="'+escapeHtml(c.name)+'"'+(((s&&s.categoryName===c.name)||(!s&&c.name==='구독'))?' selected':'')+'>'+c.icon+' '+escapeHtml(c.name)+'</option>').join('')+'</select></div></div>';
      h+='<details class="adv"><summary>상세 설정</summary>';
      h+='<div class="form-2"><div class="field"><label>서비스 유형</label><select class="input" id="subType">'+SUB_TYPES.map(t=>'<option value="'+t[0]+'"'+(((s&&s.subscriptionType===t[0])||(!s&&t[0]==='video'))?' selected':'')+'>'+t[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>결제 간격</label><input class="input" id="subInterval" inputmode="numeric" value="'+(s&&s.billingInterval?s.billingInterval:1)+'"></div></div>';
      h+='<div class="field"><label>만료일(선택)</label><input type="date" class="input" id="subExp" value="'+(s&&s.expirationDate?s.expirationDate:'')+'"></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>자동 갱신</span><div class="switch '+((!s||s.autoRenew!==false)?'on':'')+'" id="subRenew" onclick="this.classList.toggle(\'on\')"><i></i></div></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>무료체험 중</span><div class="switch '+((s&&s.isTrial)?'on':'')+'" id="subTrial" onclick="this.classList.toggle(\'on\');document.getElementById(\'subTrialEndWrap\').style.display=this.classList.contains(\'on\')?\'\':\'none\';"><i></i></div></div>';
      h+='<div class="field" id="subTrialEndWrap" style="'+((s&&s.isTrial)?'':'display:none;')+'"><label>무료체험 종료일</label><input type="date" class="input" id="subTrialEnd" value="'+(s&&s.trialEndDate?s.trialEndDate:'')+'"></div>';
      h+='<div class="field"><label>정기결제 연결</label><select class="input" id="subRecMode" onchange="onSubRecModeChange()">'+
         '<option value="auto"'+((!s||!s.recurringId)?' selected':'')+'>정기결제 자동 생성</option>'+
         '<option value="none"'+((s&&!s.recurringId&&s._noRec)?' ':'')+'>연결 안 함</option>'+
         '<option value="existing"'+((s&&s.recurringId)?' selected':'')+'>기존 정기거래 연결</option></select></div>';
      h+='<div class="field" id="subRecExistingWrap" style="'+((s&&s.recurringId)?'':'display:none;')+'"><label>정기거래 선택</label><select class="input" id="subRecExisting">'+(recRules.length?recRules.map(r=>'<option value="'+r.id+'"'+((s&&s.recurringId===r.id)?' selected':'')+'>'+escapeHtml(r.desc||r.id)+'</option>').join(''):'<option value="">정기거래 없음</option>')+'</select></div>';
      h+='<div class="field"><label>공개 범위</label><select class="input" id="subVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((s&&s.visibility===p[0])||(!s&&p[0]==='full'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>';
      h+='<div class="field"><label>메모</label><input class="input" id="subMemo" value="'+escapeHtml(s?(s.memo||''):'')+'" placeholder="메모"></div>';
      h+='</details>';
      h+='<button class="btn" onclick="saveSub('+(id?'\''+id+'\'':'null')+')">'+(s?'수정':'추가')+'</button>';
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
        owner: s?(s.owner||(vis==='private'?state.userName:'공동')):(vis==='private'?state.userName:'공동'),
        memo:val('subMemo').trim(), createdAt: s?(s.createdAt||now):now, updatedAt:now };
      db.ref(wp('subscriptions/'+key)).set(data); toast(s?'수정되었습니다':'추가되었습니다'); closeSheet();
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
      h+='<div class="chip-row">'+tabs.map(t=>'<button class="chip '+(pbTab===t[0]?'on':'')+'" onclick="setPbTab(\''+t[0]+'\')">'+t[1]+'</button>').join('')+'</div>';
      h+='<button class="btn" onclick="openPbEdit()">+ 목적별 가계부 추가</button>';
      let list=pbs.slice();
      if(['active','completed','archived'].includes(pbTab)) list=list.filter(p=>(p.status||'active')===pbTab);
      else if(pbTab==='travel') list=list.filter(p=>p.type==='travel');
      else if(pbTab==='gathering') list=list.filter(p=>p.type==='gathering'||p.type==='account_group');
      else if(pbTab==='etc') list=list.filter(p=>!['travel','gathering','account_group'].includes(p.type));
      h+='<div style="margin-top:12px;">'+(list.length?list.map(pbCard).join(''):'<div class="empty">목적별 가계부가 없습니다</div>')+'</div>';
      openSheet('목적별 가계부', h);
    }
    function pbCard(p){
      const u=pbUsage(p), c=budgetColor(u.pct), st=p.status||'active';
      const period=(p.startDate||'')+(p.endDate?(' ~ '+p.endDate):'');
      const stBadge=st!=='active'?'<span class="pill">'+PB_STATUS_LABEL[st]+'</span>':'';
      return '<div class="card" onclick="openPbDetail(\''+p.id+'\')"><div class="row"><b><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:'+(p.themeColor||'#3182f6')+';margin-right:6px;"></span>'+(p.icon||'📒')+' '+escapeHtml(p.name)+' '+stBadge+'</b><span class="pill">'+pbTypeText(p)+'</span></div>'+
        '<div class="tx-sub" style="margin-top:6px;">'+period+(p.participants&&p.participants.length?(' · 참여 '+p.participants.length+'명'):'')+'</div>'+
        (p.budgetAmount?('<div class="bar" style="margin-top:8px;"><i style="width:'+Math.min(u.pct,100)+'%;background:'+c+'"></i></div><div class="row" style="margin-top:6px;"><span class="tx-sub">'+won(u.used)+' / '+won(u.amount)+'</span><span class="tx-sub" style="color:'+c+'">'+u.pct+'%</span></div>'):('<div class="tx-sub" style="margin-top:8px;">사용 '+won(u.used)+'</div>'))+'</div>';
    }
    function openPbDetail(id){
      const p=state.purposeBooks.find(x=>x.id===id); if(!p) return;
      const u=pbUsage(p), c=budgetColor(u.pct);
      const allTx=pbTxs(p).sort((a,b)=>new Date(b.date)-new Date(a.date));
      const byCat={}; u.txs.forEach(t=>{ const k=t.category||'기타'; byCat[k]=(byCat[k]||0)+(Number(t.amount)||0); });
      let h='<div class="card"><div class="row"><b style="font-size:18px;">'+(p.icon||'📒')+' '+escapeHtml(p.name)+'</b><span class="pill">'+pbTypeText(p)+'</span></div>'+
        '<div class="tx-sub" style="margin-top:6px;">'+((p.startDate||'')+(p.endDate?(' ~ '+p.endDate):''))+(p.participants&&p.participants.length?(' · '+escapeHtml(p.participants.join(', '))):'')+'</div>'+
        (p.budgetAmount?('<div class="bar" style="margin-top:10px;"><i style="width:'+Math.min(u.pct,100)+'%;background:'+c+'"></i></div><div class="row" style="margin-top:6px;"><span class="tx-sub">'+won(u.used)+' / '+won(u.amount)+'</span><span class="tx-sub" style="color:'+c+'">남음 '+won(u.remain)+'</span></div>'):('<div class="tx-sub" style="margin-top:8px;">사용 '+won(u.used)+'</div>'))+'</div>';
      const catKeys=Object.keys(byCat).sort((a,b)=>byCat[b]-byCat[a]);
      if(catKeys.length) h+='<div class="card"><div class="sec-title" style="margin:0 0 8px;">카테고리별</div>'+catKeys.map(k=>'<div class="row" style="padding:5px 0;"><span>'+catIcon(k)+' '+escapeHtml(k)+'</span><b>'+won(byCat[k])+'</b></div>').join('')+'</div>';
      h+='<div class="chip-row">'+['active','completed','archived'].map(st=>'<button class="chip '+((p.status||'active')===st?'on':'')+'" onclick="setPbStatus(\''+p.id+'\',\''+st+'\')">'+PB_STATUS_LABEL[st]+'</button>').join('')+'</div>';
      h+='<button class="btn" onclick="openTxSheet(null,null,null,\''+p.id+'\')">+ 이 가계부에 지출 추가</button>';
      h+='<div class="sec-title" style="margin-left:2px;">거래 ('+allTx.length+')</div>';
      h+='<div class="card" style="padding:6px 10px;">'+(allTx.length?allTx.map(txRowHtml).join(''):'<div class="empty">연결된 거래 없음</div>')+'</div>';
      h+='<button class="btn ghost" onclick="openPbEdit(\''+p.id+'\')">설정 수정</button>';
      openSheet(p.name, h);
    }
    function setPbStatus(id,st){ db.ref(wp('purposeBooks/'+id)).update({status:st, updatedAt:new Date().toISOString()}); toast(PB_STATUS_LABEL[st]); openPbDetail(id); }
    function onPbTypeChange(){ const w=$('pbCustomWrap'); if(w) w.style.display=(val('pbType')==='custom')?'':'none'; }
    function pickPbColor(el){ window._pbColor=el.dataset.color; document.querySelectorAll('#pbColors button').forEach(b=>b.style.border='2px solid transparent'); el.style.border='2px solid var(--text)'; }
    function openPbEdit(id){
      const p=id?state.purposeBooks.find(x=>x.id===id):null;
      window._pbColor=p?(p.themeColor||'#3182f6'):'#3182f6';
      let h='<div class="field"><label>이름</label><input class="input" id="pbName" value="'+escapeHtml(p?p.name:'')+'" placeholder="예: 일본여행, 친구 계모임"></div>';
      h+='<div class="field"><label>유형</label><select class="input" id="pbType" onchange="onPbTypeChange()">'+PB_TYPES.map(t=>'<option value="'+t[0]+'"'+(((p&&p.type===t[0])||(!p&&t[0]==='travel'))?' selected':'')+'>'+t[1]+'</option>').join('')+'</select></div>';
      h+='<div class="field" id="pbCustomWrap" style="'+((p&&p.type==='custom')?'':'display:none;')+'"><label>유형명 직접 입력</label><input class="input" id="pbCustomName" value="'+escapeHtml(p?(p.customTypeName||''):'')+'" placeholder="예: 제주살이"></div>';
      h+='<div class="field"><label>참여자 (쉼표로 구분)</label><input class="input" id="pbParticipants" value="'+escapeHtml(p&&p.participants?p.participants.join(', '):state.userName)+'" placeholder="예: 나, 친구1, 친구2"></div>';
      h+='<div class="form-2"><div class="field"><label>예산(선택)</label><input class="input" id="pbBudget" inputmode="numeric" value="'+(p&&p.budgetAmount?Number(p.budgetAmount).toLocaleString():'')+'" placeholder="0" oninput="this.value=fmtComma(this.value)"></div>'+
        '<div class="field"><label>아이콘</label><input class="input" id="pbIcon" maxlength="2" value="'+escapeHtml(p?(p.icon||''):'')+'" placeholder="📒"></div></div>';
      h+='<div class="form-2"><div class="field"><label>시작일</label><input type="date" class="input" id="pbStart" value="'+(p&&p.startDate?p.startDate:todayStr())+'"></div>'+
        '<div class="field"><label>종료일(선택)</label><input type="date" class="input" id="pbEnd" value="'+(p&&p.endDate?p.endDate:'')+'"></div></div>';
      h+='<details class="adv"><summary>상세 설정</summary>';
      h+='<label style="font-size:13px;font-weight:600;color:var(--sub);">테마 색상</label><div class="chip-row" id="pbColors" style="margin:8px 0 12px;">'+CAT_PALETTE.map(c=>'<button class="chip" style="background:'+c+';width:32px;height:32px;border-radius:50%;border:2px solid '+(c===window._pbColor?'var(--text)':'transparent')+';" data-color="'+c+'" onclick="pickPbColor(this)"></button>').join('')+'</div>';
      h+='<div class="form-2"><div class="field"><label>기준 통화</label><input class="input" id="pbCurrency" value="'+escapeHtml(p?(p.baseCurrency||'KRW'):'KRW')+'" placeholder="KRW"></div>'+
        '<div class="field"><label>커버 이미지 URL</label><input class="input" id="pbCover" value="'+escapeHtml(p?(p.coverImageUrl||''):'')+'" placeholder="https://"></div></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>정산 사용</span><div class="switch '+((p&&p.settlementEnabled)?'on':'')+'" id="pbSettle" onclick="this.classList.toggle(\'on\')"><i></i></div></div>';
      h+='<div class="field"><label>공개 범위</label><select class="input" id="pbVis">'+VISIBILITY.map(v=>'<option value="'+v[0]+'"'+(((p&&p.visibility===v[0])||(!p&&v[0]==='full'))?' selected':'')+'>'+v[1]+'</option>').join('')+'</select></div>';
      h+='<div class="field"><label>메모</label><input class="input" id="pbMemo" value="'+escapeHtml(p?(p.memo||''):'')+'" placeholder="메모"></div>';
      h+='</details>';
      h+='<button class="btn" onclick="savePb('+(id?'\''+id+'\'':'null')+')">'+(p?'수정':'추가')+'</button>';
      if(p) h+='<button class="btn danger" style="margin-top:8px;" onclick="deletePb(\''+id+'\')">삭제</button>';
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
        owner: p?(p.owner||(vis==='private'?state.userName:'공동')):(vis==='private'?state.userName:'공동'),
        memo:val('pbMemo').trim(), createdAt: p?(p.createdAt||now):now, updatedAt:now };
      const key=id||('pb_'+Date.now());
      db.ref(wp('purposeBooks/'+key)).set(data); toast(p?'수정되었습니다':'추가되었습니다'); openPurposeBooks();
    }
    function deletePb(id){ confirmSheet('이 목적별 가계부를 삭제할까요? (연결된 거래는 유지됩니다)', ()=>{ db.ref(wp('purposeBooks/'+id)).remove(); toast('삭제되었습니다'); openPurposeBooks(); }); }

    // ===== CSV =====
    function exportCSV(){
      const rows=monthTx(state.month).sort((a,b)=>new Date(a.date)-new Date(b.date));
      if(!rows.length){ toast('이번달 거래가 없습니다', true); return; }
      const header=['날짜','유형','사용자','카테고리','출금','입금','금액','실제소비','카드실적금액','설명','메모'];
      const lines=rows.map(t=>[ (t.date||'').substring(0,10), TYPE_LABEL[t.type]||t.type, t.user||'', t.category||'', acctName(t.from), acctName(t.to), t.amount||0, (isActual(t)?(Number(t.amount)||0):0), (t.cardPerformanceIncluded?(t.cardPerformanceAmount!=null?t.cardPerformanceAmount:t.amount):0), t.desc||'', t.memo||'' ]
        .map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(','));
      const csv='﻿'+[header.join(','),...lines].join('\r\n');
      const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
      const url=URL.createObjectURL(blob); const a=document.createElement('a');
      a.href=url; a.download='가계부_'+state.month+'.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      toast(state.month+' 내역을 내보냈습니다');
    }
