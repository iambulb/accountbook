// ===== 홈(달력/목록) =====
    function renderCalendar(){
      const m=state.month, allList=monthTx(m);
      const list = state.memberFilter ? allList.filter(t=>(t.user||'')===state.memberFilter) : allList;
      const inc=sumBy(list,'income');
      const actual=actualSpend(list);
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
        '<div><div class="k">합계</div><div class="v">'+won(inc-actual)+'</div></div></div>';
      // 충전/선불 분리 보조행 + 예산 미니바 (우리 고유 정보 — 소비 착각 방지)
      html+='<div class="submeta"><span class="muted">충전 <b class="blue">'+won(charge)+'</b></span><span class="muted">선불·포인트 <b>'+won(pspend)+'</b></span><span class="muted">미사용잔액 <b class="blue">'+won(prepaidTotal())+'</b></span></div>';
      const tb=totalMonthlyBudget();
      if(tb && m===monthStr(new Date())){
        const u=budgetUsage(tb), c=budgetColor(u.pct);
        html+='<div class="budgetmini"><div class="row" style="font-size:12px;"><span class="muted">이번달 예산</span><span style="color:'+c+';font-weight:700;">'+u.pct+'%'+(u.pct>=100?' 초과':'')+'</span></div>'+
          '<div class="bar"><i style="width:'+Math.min(u.pct,100)+'%;background:'+c+'"></i></div>'+
          '<div class="tx-sub" style="margin-top:6px;">'+won(u.used)+' / '+won(u.amount)+'</div></div>';
      }

      html+='<div class="seg"><button class="'+(state.homeView==='calendar'?'on':'')+'" onclick="setHomeView(\'calendar\')">달력</button>'+
        '<button class="'+(state.homeView==='list'?'on':'')+'" onclick="setHomeView(\'list\')">목록</button></div>';

      if(state.homeView==='calendar'){
        html+='<div class="monthlbl"><button onclick="moveMonth(-1)">‹</button><b>'+y+'년 '+mo+'월</b><button onclick="moveMonth(1)">›</button></div>';
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
      h+= rows.length ? '<div>'+rows.map(txRowHtml).join('')+'</div>' : '<div class="empty">이 날 거래가 없습니다</div>';
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
      h+='<button class="mchip'+(cur===''?' on':'')+'" onclick="clearMemberFilter()"><span class="avatar" style="width:24px;height:24px;background:'+avatarGrad('all')+';"></span>전체</button>';
      uids.forEach(uid=>{ const nm=members[uid].name||'멤버';
        h+='<button class="mchip'+(cur===nm&&cur?' on':'')+'" onclick="setMemberFilterByUid(\''+uid+'\')">'+avatarHtml(uid, nm, 24)+escapeHtml(nm)+'</button>'; });
      h+='</div>';
      return h;
    }
    function clearMemberFilter(){ state.memberFilter=''; renderCalendar(); }
    function setMemberFilterByUid(uid){ const mm=(state.wsMeta&&state.wsMeta.members)||{}; const name=(mm[uid]&&mm[uid].name)||''; state.memberFilter=(state.memberFilter===name&&name)?'':name; renderCalendar(); }

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
      // 월요일 시작(시안 1:1). WEEK 상수(getDay 인덱스)는 그대로 두고 헤더만 월~일로.
      const HEAD=['월','화','수','목','금','토','일'];
      const first=(new Date(y,mo-1,1).getDay()+6)%7;   // 월=0 오프셋
      const days=new Date(y,mo,0).getDate();
      const todayS=todayStr();
      let h='<div class="calwrap"><div class="cal-head">'+HEAD.map((w,i)=>'<div class="'+(i===5?'sat':i===6?'sun':'')+'">'+w+'</div>').join('')+'</div><div class="cal-grid">';
      for(let i=0;i<first;i++) h+='<div class="cal-cell dim"></div>';
      for(let d=1;d<=days;d++){
        const ds=y+'-'+pad2(mo)+'-'+pad2(d);
        const wd=new Date(y,mo-1,d).getDay();   // 0=일..6=토
        const dcls='d'+(wd===0?' sun':(wd===6?' sat':''));
        const b=buckets[ds];
        const cls='cal-cell'+(ds===todayS?' today':'')+(ds===state.selectedDate?' sel':'');
        const dots=(b&&b.colors.length)?'<span class="dotrow">'+b.colors.map(c=>'<i style="background:'+c+'"></i>').join('')+'</span>':'';
        h+='<div class="'+cls+'" onclick="selectDay(\''+ds+'\')"><div class="'+dcls+'">'+d+'</div>'+dots+'</div>';
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

    const TX_SVG_KEY={ income:'wallet', expense:'card', transfer:'swap', prepaid_charge:'coin', prepaid_spend:'card', refund:'refund', point_earn:'coin', point_spend:'coin', balance_adjustment:'tag' };
    function txRowHtml(t){
      const e=TX_EFFECT[t.type]||{};
      let sign='', cls='muted';
      if(t.type==='expense'){ sign='-'; cls='red'; }
      else if(t.type==='prepaid_spend'||t.type==='point_spend'){ sign='-'; cls='red'; }
      else if(t.type==='income'||t.type==='refund'||t.type==='point_earn'){ sign='+'; cls='green'; }
      else if(t.type==='prepaid_charge'){ sign=''; cls='blue'; }
      // 아이콘 타일: 카테고리 거래 → 옅은 tint 타일 + 카테고리 라인 아이콘 / 그 외 → 중립 회색 타일 + 유형 아이콘
      let tileStyle='', tileInner;
      if(t.category && (getCat(t.category)||CAT_META[t.category])){ tileStyle=catTileStyle(t.category); tileInner=catSvgIcon(t.category); }
      else { tileInner=svgWrap(CAT_SVG[TX_SVG_KEY[t.type]||'tag']); }
      let sub;
      if(e.debit&&e.credit) sub=(t.category&&t.category!=='기타'?t.category+' · ':'')+acctName(t.from)+' → '+acctName(t.to);
      else if(t.type==='expense'||t.type==='income') sub=(t.category||TYPE_LABEL[t.type]);   // 시안: 카테고리 · 기록자 (계좌는 상세에서)
      else if(e.credit&&!e.debit) sub=acctName(t.to);
      else sub=(t.category?t.category+' · ':'')+acctName(t.from);
      if(!['expense','income','transfer'].includes(t.type)) sub=TYPE_LABEL[t.type]+' · '+sub;
      sub+=' · '+escapeHtml(t.user||'');
      const rec=t.recurringId?'<span class="pill">🔁</span>':'';
      const cardPill=(getCard(t.from)&&(t.type==='expense'||t.type==='prepaid_charge')&&t.cardPerformanceIncluded===false)?'<span class="pill">실적제외</span>':'';
      const pbPill=t.purposeBookId?'<span class="pill">'+escapeHtml(t.purposeBookName||'목적')+'</span>':'';
      const giftPill=t.giftEventId?'<span class="pill">🎁 경조사</span>':'';
      const loanPill=t.loanId?'<span class="pill">🏦 대출</span>':'';
      const amtNum=Math.abs(Number(t.amount)||0).toLocaleString();
      return '<div class="tx" onclick="openTxSheet(\''+t.ownerUid+'\',\''+t.id+'\')">'+
        '<div class="tx-ic" style="'+tileStyle+'">'+tileInner+'</div>'+
        '<div class="tx-main"><div class="tx-title">'+escapeHtml(t.desc||'')+rec+cardPill+pbPill+giftPill+loanPill+'</div><div class="tx-sub">'+sub+'</div></div>'+
        '<div class="tx-amt '+cls+'">'+sign+'₩'+amtNum+((t.currency&&t.currency!=='KRW')?'<span class="tx-fx">'+escapeHtml(fmtForeign(t.foreignAmount,t.currency))+'</span>':'')+'</div></div>';
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
      // 시안: 큰 금액 + 키패드 입력
      // 금액: 모바일은 화면 키패드(OS 키보드 안 뜨게 readonly+inputmode none), 데스크톱은 물리 키보드로 직접 입력(keydown 라우팅).
      h+='<div class="amtbig"><select id="sCur" class="amt-cur" onchange="onCurChange()">'+curOptions(t&&t.currency?t.currency:'KRW')+'</select><input id="sAmount" class="amtbig-in" readonly inputmode="none" aria-label="금액" placeholder="0" onkeydown="kpKey(event)" onpaste="kpPaste(event)" value="'+((t&&t.currency&&t.currency!=='KRW')?fmtAmt(String(t.foreignAmount||'')):(amount?Number(amount).toLocaleString():''))+'"></div>';
      h+='<div id="sFx" class="fxrow" style="display:none;"></div>';
      h+='<div id="sCatChips"></div>';   // 카테고리 칩(유형별)
      h+='<div id="sDyn"></div>';        // 계좌/이체 행
      h+='<div class="txfield"><span class="k">날짜</span><input type="date" class="txin" id="sDate" value="'+date+'" onchange="onDateChange()"></div>';
      h+='<div class="txfield"><span class="k">설명</span><input type="text" class="txin" id="sDesc" placeholder="내용" value="'+escapeHtml(desc)+'"></div>';
      // 숫자 키패드
      h+='<div class="kp">'+
        [1,2,3,4,5,6,7,8,9].map(n=>'<button onclick="kpPress(\''+n+'\')">'+n+'</button>').join('')+
        '<button onclick="kpPress(\'.\')" aria-label="소수점">.</button><button onclick="kpPress(\'0\')">0</button><button onclick="kpDel()" aria-label="지우기">⌫</button></div>';
      // 우리 고유 기능 → 상세 설정 접기
      h+='<details class="adv" id="sAdv"'+((pbId||settleInc)?' open':'')+'><summary>상세 설정</summary>';
      h+='<div class="txfield"><span class="k">목적별 가계부</span><select class="txsel" id="sPb" onchange="onPbChange()">'+
        '<option value="">연결 안 함</option>'+
        activePbs.map(p=>'<option value="'+p.id+'"'+(p.id===pbId?' selected':'')+'>'+(p.icon||'📒')+' '+escapeHtml(p.name)+'</option>').join('')+
        ((pbId && !activePbs.some(p=>p.id===pbId))?('<option value="'+pbId+'" selected>'+escapeHtml((t&&t.purposeBookName)||pbId)+' (비활성)</option>'):'')+
        '</select></div>';
      h+='<div id="sSettleBlock"></div>';
      h+='<div id="sCardPerf"></div>';   // 카드 실적 포함
      h+='<div class="txfield"><span class="k">메모</span><input type="text" class="txin" id="sMemo" placeholder="메모" value="'+escapeHtml(memo)+'"></div>';
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
      sh._consumer = t?(t.userUid||t.user||'공동'):defaultOwnerUid();
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
    function acctField(label,id,sel){ return '<div class="txfield"><span class="k">'+label+'</span><select class="txsel" id="'+id+'" onchange="renderCardPerfBlock()">'+acctOptsHtml(sel)+'</select></div>'; }
    // 소비 대상(누구의 소비인가) — 출금 수단과 분리. 멤버 + '공동'(집세 등 공동 비용) 선택.
    function consumerField(sel){ return '<div class="txfield"><span class="k">소비 대상</span><select class="txsel" id="sConsumer">'+ownerOptions(sel||'공동')+'</select></div>'; }
    // 시안: 카테고리 가로 칩(이름 + 카테고리 색 점)
    function catChipsHtml(){
      let cats=pickableCats(catTypeFor(sheetType));
      if(sheetCat && !cats.some(c=>c.name===sheetCat)){ const cur=getCat(sheetCat)||{name:sheetCat,color:'#8b95a1'}; cats=[cur,...cats]; }
      else if(!sheetCat && cats[0]) sheetCat=cats[0].name;
      return '<div class="chips">'+cats.map(c=>'<button class="chip'+(c.name===sheetCat?' on':'')+'" onclick="pickCat(\''+escapeHtml(c.name)+'\')"><span class="catdot" style="background:'+(c.color||'#8b95a1')+'"></span>'+escapeHtml(c.name)+'</button>').join('')+'</div>';
    }
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
    function setAmt(raw){ const el=$('sAmount'); if(el){ el.value=fmtAmt(raw); updateFxPreview(); } }
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
        +'<button type="button" class="fxrefresh" id="sFxBtn" onclick="autoFetchRate()" aria-label="실시간 환율 조회" title="실시간 환율 조회">'
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
    function guideNote(actual, text){ return '<div class="install-banner" style="background:'+(actual?'rgba(240,68,82,.1)':'var(--primary-weak)')+';color:'+(actual?'var(--expense)':'var(--primary)')+';">'+(actual?'🛒':'ℹ️')+' '+text+'</div>'; }
    function renderTxDyn(){
      const sh=$('sheet'); const fromV=sh._from, toV=sh._to;
      if($('sConsumer')) sh._consumer=val('sConsumer'); // 유형 전환 시 소비 대상 선택 보존
      // 카테고리 칩(해당 유형만) → 별도 영역
      const catBox=$('sCatChips');
      if(catBox) catBox.innerHTML = (catTypeFor(sheetType)!==null) ? catChipsHtml() : '';
      // 계좌/이체 행 + ext 서브칩 + 안내 → #sDyn
      let h='';
      if(EXT_TYPES.includes(sheetType)){
        h+='<div class="chips" style="margin:2px 0 6px;">'+EXT_TYPES.map(tp=>'<button class="chip '+(tp===sheetType?'on':'')+'" onclick="setExtType(\''+tp+'\')">'+TYPE_LABEL[tp]+'</button>').join('')+'</div>';
      }
      if(sheetType==='prepaid_charge') h+=guideNote(false,'충전은 자산 이동이라 실제 소비에 포함되지 않습니다.');
      else if(sheetType==='prepaid_spend'||sheetType==='point_spend') h+=guideNote(true,'이 거래는 실제 소비에 포함됩니다.');
      else if(sheetType==='refund') h+=guideNote(false,'환불은 잔액이 돌아오는 거래로 실제 소비에 포함되지 않습니다.');
      else if(sheetType==='point_earn') h+=guideNote(false,'포인트 적립은 실제 소비가 아닙니다.');
      else if(sheetType==='balance_adjustment') h+=guideNote(false,'실제 잔액에 맞추는 보정 거래입니다. 실제 소비에 포함되지 않습니다.');

      if(sheetType==='expense'){ h+=acctField('출금/결제 수단','sFrom',fromV)+consumerField(sh._consumer); }
      else if(sheetType==='income'){ h+=acctField('입금 대상','sTo',toV); }
      else if(sheetType==='refund'){ h+=acctField('환불 받는 계정','sTo',toV); }
      else if(sheetType==='point_earn'){ h+=acctField('적립 포인트 계정','sTo',toV); }
      else if(sheetType==='transfer'||sheetType==='prepaid_charge'){
        const l1=sheetType==='prepaid_charge'?'충전 수단(카드/계좌)':'출금';
        const l2=sheetType==='prepaid_charge'?'충전 대상(선불/포인트)':'입금';
        h+=acctField(l1,'sFrom',fromV)+acctField(l2,'sTo',toV);
      }
      else if(sheetType==='prepaid_spend'||sheetType==='point_spend'){
        h+=acctField(sheetType==='point_spend'?'사용 포인트 계정':'결제 선불수단','sFrom',fromV)+consumerField(sh._consumer);
      }
      else if(sheetType==='balance_adjustment'){
        h+=acctField('대상 계정','sTo',toV);
        h+='<div class="txfield"><span class="k">조정 방향</span><select class="txsel" id="sAdjSign"><option value="+"'+(sh._adjSign!=='-'?' selected':'')+'>증가(+)</option><option value="-"'+(sh._adjSign==='-'?' selected':'')+'>감소(-)</option></select></div>';
      }
      $('sDyn').innerHTML=h;
      if(catBox) pickCat(sheetCat,true);
      renderCardPerfBlock();
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
      const amt = sh._cpa!=null ? sh._cpa : sheetKRWAmount();
      box.innerHTML='<div class="card" style="padding:14px;margin:4px 0 14px;">'+
        '<div class="menu-item" style="padding:4px 0;"><span>💳 '+escapeHtml(card.cardName||acctName(card.id))+' 실적 포함</span><div class="switch '+(inc?'on':'')+'" id="sCpi" onclick="this.classList.toggle(\'on\');toggleCpiFields()"><i></i></div></div>'+
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
        '<div class="menu-item" style="padding:4px 0;"><span>🤝 정산 포함</span><div class="switch '+(sh._stOn?'on':'')+'" id="sSettle" onclick="toggleSettleOn()"><i></i></div></div>'+
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
        [['equal','균등'],['custom','직접'],['payer_only','결제자부담']].map(o=>'<button class="'+(type===o[0]?'on':'')+'" onclick="setSplitType(\''+o[0]+'\')">'+o[1]+'</button>').join('')+'</div>';
      if(type!=='payer_only'){
        h+='<label style="font-size:13px;font-weight:600;color:var(--sub);">참여자</label><div class="chip-row" style="margin:6px 0 8px;">'+
          all.map((n,i)=>'<button class="chip '+(parts.includes(n)?'on':'')+'" onclick="toggleSettleParticipant('+i+')">'+escapeHtml(n)+'</button>').join('')+'</div>';
        const amt=sheetKRWAmount();
        const split=computeSettleAmounts(type, parts, amt, sh._stCustom);
        h+='<div id="sStAmts">'+parts.map(n=>'<div class="field" style="margin-top:6px;"><label>'+escapeHtml(n)+' 부담</label>'+
          '<input class="input stamt" data-n="'+escapeHtml(n)+'" inputmode="numeric" value="'+(split[n]?Number(split[n]).toLocaleString():'0')+'"'+(type==='equal'?' readonly':' oninput="this.value=fmtComma(this.value)"')+'></div>').join('')+'</div>';
        h+='<div class="tx-sub" style="margin-top:4px;">'+(type==='equal'?'균등 분할(자동 계산)':'직접 입력 — 합계가 거래 금액과 같아야 정확합니다')+'</div>';
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
      else { parts=(sh._stParts||[]).slice(); amounts=computeSettleAmounts(type, parts, amt, sh._stCustom); }
      return { inc:true, payer, splitType:type, participants:parts, amounts, memo: $('sStMemo')?val('sStMemo'):(sh._stMemo||'') };
    }
    function saveTx(){
      const curCode=sheetCur(), foreign=sheetAmt();
      if(!foreign){ toast('금액을 입력하세요', true); return; }
      if(curCode!=='KRW' && !(sheetRate()>0)){ toast('환율을 입력하세요', true); return; }
      const rawAmount=sheetKRWAmount();
      if(!rawAmount){ toast('환산 금액이 0이에요', true); return; }
      const date=val('sDate')||todayStr();
      const desc=val('sDesc').trim();
      const memo=val('sMemo').trim();
      const iso=new Date(date+'T'+new Date().toTimeString().slice(0,8)).toISOString();
      const e=TX_EFFECT[sheetType]||{};
      const hasCat=catTypeFor(sheetType)!==null;
      // 소비 대상(누구의 소비) — 지출/선불결제/포인트사용에서만 선택, 그 외엔 본인
      const _csel = $('sConsumer') ? (val('sConsumer')||defaultOwnerUid()) : defaultOwnerUid();
      const _cmem = (state.wsMeta&&state.wsMeta.members)||{};
      const consumer = _csel==='공동' ? '공동' : (_cmem[_csel] ? (_cmem[_csel].name||state.userName) : (_csel===state.uid?(state.userName||'공동'):_csel));
      const tx={ type:sheetType, date:iso, user:consumer, amount:rawAmount,
        desc: desc||(hasCat?(sheetCat||TYPE_LABEL[sheetType]):TYPE_LABEL[sheetType]),
        isActualExpense: !!ACTUAL_DEFAULT[sheetType] };
      if(_cmem[_csel] || _csel===state.uid) tx.userUid=_csel;   // 멤버 소비대상은 uid 병행 저장(동명이인/개명 견고)
      if(curCode!=='KRW'){ tx.currency=curCode; tx.foreignAmount=foreign; tx.fxRate=sheetRate(); tx.fxSource=($('sheet')._fxSource||'manual'); tx.fxDate=date; }
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
      // 목적별 가계부 연결 + 정산(Step 9). 정산 필드는 collectSettle()로 수집.
      const pbSel = $('sPb')?val('sPb'):'';
      if(pbSel){
        const pbo=state.purposeBooks.find(x=>x.id===pbSel);
        tx.purposeBookId=pbSel;
        tx.purposeBookName=pbo?pbo.name:(sheetTx&&state.transactions.find(x=>x.ownerUid===sheetTx.ownerUid&&x.id===sheetTx.id)||{}).purposeBookName||'';
        const stl=(pbo&&pbo.settlementEnabled)?collectSettle():{inc:false};
        if(stl.inc){
          tx.settlementIncluded=true;
          tx.payer=stl.payer||tx.user;
          tx.splitType=stl.splitType;
          tx.splitParticipants=stl.participants;
          tx.splitAmounts=stl.amounts;
          tx.settlementStatus='unsettled';
          if(stl.memo) tx.settlementMemo=stl.memo;
        } else {
          tx.settlementIncluded=false;
          tx.payer=tx.user;
          tx.splitType='none';
          tx.settlementStatus='none';
        }
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
    function statsMonth(d){ state.month=shiftMonth(state.month,d); renderStats(); }
    function shortAmt(v){ v=Math.round(Math.abs(v)); if(v>=1e8) return (v/1e8).toFixed(1).replace(/\.0$/,'')+'억'; if(v>=1e4) return Math.round(v/1e4).toLocaleString()+'만'; return v.toLocaleString(); }
    function signComma(v){ return (v<0?'−':'+')+fmtComma(Math.abs(v)); }
    // ===== 할일(투두) 모드 화면 =====
    let _todoFilter='all', _todoSel=null;
    function setTodoFilter(f){ _todoFilter=f; renderTodoList(); }
    // 개인 탭에서 보고 있는 대상(친구 uid 또는 나)
    function todoViewUid(){ return state._todoFriend || state.uid; }
    // 개인(user-global)+그룹(ws) 할일 합본 — 조회/편집 대상 찾기용
    function allTodos(){ return (state.myTodos||[]).concat(state.todos||[]); }
    // 할일 쓰기 경로: 개인=users/{uid}/todos, 그룹=ws/{wsId}/todos
    function todoDbRef(t){ return todoScope(t)==='personal' ? db.ref('users/'+state.uid+'/todos/'+t.id) : db.ref(wp('todos/'+t.id)); }
    // 현재 세그먼트(개인/그룹) + 보는 대상에 해당하는 할일만
    function scopedTodos(){
      if(state._todoScope==='group') return (state.todos||[]).filter(t=>todoScope(t)==='group');
      // 개인: 내 것(myTodos·user-global) 또는 친구 열람(friendTodos·읽기전용)
      return (state._todoFriend && state._todoFriend!==state.uid) ? (state.friendTodos||[]) : (state.myTodos||[]);
    }
    function setTodoScope(s){ state._todoScope=(s==='group'?'group':'personal'); clearFriendView(); _todoFilter='all'; try{localStorage.setItem('todoScope',state._todoScope);}catch(e){} rerender(); }
    function isPersonalWs(){ return ((state.wsMeta&&state.wsMeta.type)||'')==='personal'; }
    function todoScopeSeg(){ const g=state._todoScope==='group'; const second=isPersonalWs()?'친구들':'그룹';
      return '<div class="seg todoseg"><button class="'+(g?'':'on')+'" onclick="setTodoScope(\'personal\')">개인</button><button class="'+(g?'on':'')+'" onclick="setTodoScope(\'group\')">'+second+'</button></div>'; }
    // 개인 탭에서 친구를 보고 있는지 = 읽기전용
    function todoReadOnly(){ return state._todoScope==='personal' && !!state._todoFriend && state._todoFriend!==state.uid; }
    function setTodoFriend(uid){ if(!uid||uid===state.uid){ clearFriendView(); renderTodoList(); } else { viewFriendTodos(uid); } }
    // 현재 열람 중인 친구 할일 리스너 해제 + 내 목록 복귀
    function clearFriendView(){ if(state._friendTodosRef){ try{ state._friendTodosRef.off(); }catch(e){} state._friendTodosRef=null; } state._todoFriend=null; state._friendTodosUid=null; state.friendTodos=[]; }
    // 표시 이름: 나 → 내 이름, 친구 → friends[uid].name, 폴백 멤버명
    function friendDisplayName(uid){ if(uid===state.uid) return state.userName||'나'; const f=(state.friends&&state.friends[uid]); if(f&&f.name) return f.name; const m=(state.wsMeta&&state.wsMeta.members)||{}; return (m[uid]&&m[uid].name)||'친구'; }
    function todoMemberName(uid){ return friendDisplayName(uid); }
    // 개인 탭 상단 친구 스트립: 나 + '할일 공개(todoPublic)'한 친구들(이름순). 우측에 내 공개 토글.
    function todoFriendStrip(){
      const meUid=state.uid; const view=todoViewUid();
      const friends=Object.keys(state.friends||{}).filter(function(u){ return state.friendPub && state.friendPub[u]; })
        .sort(function(a,b){ return String(friendDisplayName(a)).localeCompare(friendDisplayName(b)); });
      const order=[meUid].concat(friends);
      const shareOn=!!state.todoPublic;
      const av=order.map(function(uid){ const nm=friendDisplayName(uid); const sel=(uid===view)?' sel':'';
        const label=(uid===meUid)?'나':escapeHtml(nm);
        return '<button class="tdfr'+sel+'" onclick="setTodoFriend(\''+uid+'\')" aria-label="'+escapeHtml(nm)+' 할일 보기">'+avatarHtml(uid,nm,40)+'<span class="tdfrnm">'+label+'</span></button>'; }).join('');
      return '<div class="tdfriends"><div class="tdfr-scroll">'+av+'</div>'+
        '<button class="tdshare'+(shareOn?' on':'')+'" onclick="toggleTodoPublic()" aria-label="내 할일 공개 토글" aria-pressed="'+shareOn+'">'+
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+(shareOn?'<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.3M8.3 13.2l7.4 4.3"/>':'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0"/>')+'</svg>'+
        '<span>'+(shareOn?'공개중':'비공개')+'</span></button></div>';
    }
    // 내 개인 할일 공개 on/off(user-global) — 친구 스트립·열람 대상.
    function toggleTodoPublic(){ if(!state.uid) return; const on=!!state.todoPublic; db.ref('users/'+state.uid+'/todoPublic').set(!on); toast(!on?'개인 할일을 친구에게 공개합니다':'공개를 껐습니다'); }
    function openTodoShareSheet(){
      const on=!!state.todoPublic;
      let h='<p class="muted" style="margin:2px 2px 14px;line-height:1.55;">개인 할일을 <b>친구</b>에게 공개할지 정해요. 켜면 친구의 <b>할일 · 개인</b> 화면 상단 스트립에 내 프로필이 뜨고, 친구가 내 개인 할일을 읽기전용으로 볼 수 있어요.</p>';
      h+='<div class="lst">'+lrow(MORE_ICON.share,'내 할일 공개','toggleTodoPublic();openTodoShareSheet()', on?'켜짐':'꺼짐')+'</div>';
      openSheet('할일 공유', h);
    }
    function toggleTodoShare(){ const uid=state.uid; if(!uid) return; const on=!!(state.todoShare&&state.todoShare[uid]);
      db.ref(wp('todoShare/'+uid)).set(!on); toast(!on?'할일을 공유합니다':'공유를 껐습니다'); openTodoShareSheet(); }
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
    function removeFriend(uid){ confirmSheet('친구를 삭제할까요?', function(){ const upd={}; upd['users/'+state.uid+'/friends/'+uid]=null; upd['users/'+uid+'/friends/'+state.uid]=null;
      db.ref().update(upd).then(function(){ if(state._todoFriend===uid) clearFriendView(); toast('친구를 삭제했어요'); rerender(); }); }); }
    // 친구 개인 할일 열람(공개한 친구만) — 임시 리스너로 state.friendTodos 채우고 개인 화면 읽기전용
    function viewFriendTodos(uid){
      db.ref('users/'+uid+'/todoPublic').once('value').then(function(s){
        if(!s.val()){ toast('아직 할일을 공개하지 않은 친구예요', true); return; }
        clearFriendView(); state._todoScope='personal'; state._todoFriend=uid; state._friendTodosUid=uid;
        const ref=db.ref('users/'+uid+'/todos'); state._friendTodosRef=ref;
        ref.on('value', function(s2){ const o=s2.val()||{}; state.friendTodos=Object.keys(o).map(function(k){ return Object.assign({id:k,scope:'personal',ownerUid:uid},o[k]); }); rerender(); });
        try{ localStorage.setItem('todoScope','personal'); }catch(e){}
        if(typeof go==='function') go('todo'); else rerender();
      });
    }
    // 친구 관리 시트(더보기 공용) — 내 할일 공개 토글·친구 코드 복사/추가·받은 요청·친구 목록(삭제). 열람은 '친구들' 피드에서.
    function openFriendsSheet(){
      const build=function(){
        const on=!!state.todoPublic;
        let h='<div class="lst">'+lrow(MORE_ICON.share,'내 할일 공개','toggleTodoPublic()', on?'켜짐':'꺼짐')+'</div>';
        h+='<div class="card" style="padding:14px;margin-top:12px;"><div class="sec-title">내 친구 코드</div>'+
          '<div class="row" style="gap:8px;align-items:center;margin-top:6px;"><b style="font-size:20px;letter-spacing:3px;flex:1;">'+escapeHtml(state.friendCode||'—')+'</b>'+
          '<button class="btn sm" style="flex:none;" onclick="copyFriendCode()">복사</button></div>'+
          '<div class="row" style="gap:8px;margin-top:10px;"><input class="input" id="friendCodeIn" placeholder="친구 코드 입력" autocapitalize="characters" spellcheck="false" style="flex:1;text-transform:uppercase;"><button class="btn sm" style="flex:none;" onclick="addFriendByCode()">추가</button></div></div>';
        const reqs=Object.keys(state.friendReqs||{});
        if(reqs.length){ h+='<div class="sech"><span class="l">받은 요청</span><span class="s">'+reqs.length+'</span></div><div class="card" style="padding:4px 12px;">'+
          reqs.map(function(u){ const r=state.friendReqs[u]||{}; return '<div class="tdrow"><span class="tdwho">'+avatarHtml(u,r.name||'',28)+'</span><b class="tdtitle">'+escapeHtml(r.name||'사용자')+'</b><button class="buy" onclick="acceptFriend(\''+u+'\')">수락</button><button class="buy dis" onclick="declineFriend(\''+u+'\')">거절</button></div>'; }).join('')+'</div>'; }
        const fr=Object.keys(state.friends||{});
        h+='<div class="sech"><span class="l">친구</span><span class="s">'+fr.length+'</span></div><div class="card" style="padding:4px 12px;">'+
          (fr.length?fr.map(function(u){ const f=state.friends[u]||{};
            const likes=(state.friendLikes&&state.friendLikes[u])||0; const changed=friendChangedToday(u);
            const av='<span class="tdwho'+(changed?' avring':'')+'">'+avatarHtml(u,f.name||'',28)+'</span>';
            return '<div class="tdrow friendrow" role="button" tabindex="0" onclick="openFriendHome(\''+u+'\')">'+av+'<b class="tdtitle">'+escapeHtml(f.name||'친구')+'</b>'+
              '<span class="likemini">'+heartSvg({h:13})+' '+likes+'</span>'+
              '<button class="buy dis" onclick="event.stopPropagation();removeFriend(\''+u+'\')">삭제</button></div>'; }).join(''):'<div class="empty" style="padding:22px 6px;">아직 친구가 없어요 · 위 코드로 추가하세요</div>')+'</div>';
        h+='<p class="muted" style="font-size:12px;margin-top:10px;">친구를 탭하면 <b>집(펫캠)</b>을 방문해 좋아요를 누를 수 있어요. 등록한 할일은 <b>할일 → 친구들</b>에서도 볼 수 있어요.</p>';
        return h;
      };
      openSheet('친구', build());
      state._sheetRefresh=function(){ const b=$('sheetBody'); if(b) b.innerHTML=build(); };
    }
    function friendChangedToday(uid){ const c=state.friendHomeChangedByUid&&state.friendHomeChangedByUid[uid]; return !!(c && String(c).slice(0,10)===ymd(new Date())); }
    // ===== 친구 집(펫캠) 방문 — 캠 + 좋아요 + 오늘의 할일(공개 시) =====
    function openFriendHome(uid){
      if(!uid || uid===state.uid){ if(typeof openCatHouse==='function') openCatHouse('home'); return; }   // 내 집이면 내 알뜰샵 홈
      const isFriend=!!(state.friends&&state.friends[uid]);
      openSheet('불러오는 중…', '<div class="empty" style="padding:40px 12px;">불러오는 중…</div>');
      Promise.all([
        db.ref('users/'+uid+'/game').once('value'),
        db.ref('users/'+uid+'/todoPublic').once('value'),
        db.ref('users/'+uid+'/homeLikes').once('value'),
        db.ref('users/'+uid+'/todos').once('value'),
        db.ref('users/'+uid+'/profilePublic').once('value')
      ]).then(function(res){
        if(!($('sheet')&&$('sheet').classList.contains('on'))) return;   // 그새 닫혔으면 중단
        const fg=normalizeGame(res[0].val()), pub=!!res[1].val(), likes=res[2].val();
        const priv=(res[4].val()===false);
        const anon=priv && !isFriend;                       // 비공개 + 비친구 → 익명(은화+알뜰)
        const showName=anon?'알뜰':friendDisplayName(uid);
        if($('sheetTitle')) $('sheetTitle').textContent=showName+'의 집';
        state._friendCam={ uid:uid, name:showName, game:fg, placedList:friendPlacedList(fg), active:friendActiveCats(fg) };
        try{ markStorySeen(uid, new Date().toISOString()); }catch(e){}   // 방문 = 스토리 열람 → 무지개 링 해제
        const cnt=homeLikeCount(likes), liked=likedTodayBy(likes, state.uid);
        let h=friendRoomHtml(fg, showName);
        h+='<div class="likebar"><button class="likebtn'+(liked?' on':'')+'" onclick="likeFriendHome(\''+uid+'\')"'+(liked?' disabled':'')+' aria-label="좋아요">'+heartSvg({h:20,off:!liked})+'<b id="fhLikeN">'+cnt+'</b></button>'+
           '<span class="likehint">'+(liked?'오늘 좋아요 완료 · 내일 또 눌러주세요':'하루 한 번 좋아요를 눌러줄 수 있어요')+'</span></div>';
        const todosObj=res[3].val()||{};
        if(isFriend && pub){   // 할일은 친구 사이 + 상대가 공개했을 때만
          const undone=Object.keys(todosObj).map(function(k){ return Object.assign({id:k}, todosObj[k]); }).filter(function(t){ return !t.done; })
            .sort(function(a,b){ const ad=a.dueDate||'9999-99', bd=b.dueDate||'9999-99'; return ad<bd?-1:(ad>bd?1:0); });
          h+='<div class="sech"><span class="l">오늘의 할일</span><span class="s">'+undone.length+'</span></div>';
          h+='<div class="card" style="padding:4px 12px;">'+(undone.length?undone.map(function(t){ return friendTodoRow(uid,t); }).join(''):'<div class="empty" style="padding:18px 6px;">등록한 할일이 없어요</div>')+'</div>';
        } else if(isFriend){
          h+='<p class="muted" style="font-size:12px;margin-top:14px;text-align:center;">이 친구는 할일을 공개하지 않았어요</p>';
        } else {
          h+='<p class="muted" style="font-size:12px;margin-top:14px;text-align:center;">친구가 되면 할일도 볼 수 있어요</p>';
        }
        const b=$('sheetBody'); if(b) b.innerHTML=h;
        setTimeout(function(){ mountFriendRoom(fg); }, 30);
      }).catch(function(){ const b=$('sheetBody'); if(b) b.innerHTML='<div class="empty" style="padding:40px 12px;">집을 불러오지 못했어요</div>'; });
    }
    function likeFriendHome(uid){
      likeHome(uid, function(ok, cnt){
        if(!ok){ toast('오늘은 이미 좋아요를 눌렀어요'); return; }
        toast('좋아요 ❤️');
        const n=$('fhLikeN'); if(n && cnt!=null) n.textContent=cnt;
        const btn=document.querySelector('.likebtn'); if(btn){ btn.classList.add('on'); btn.disabled=true; }
        const hint=document.querySelector('.likehint'); if(hint) hint.textContent='오늘 좋아요 완료 · 내일 또 눌러주세요';
      });
    }
    // ===== 친구들 피드('친구들' 탭) = 인스타그램 스토리 줄 + 아래 친구 할일 피드 =====
    // 친구 할일 한 줄(읽기전용) — 우측에 누구 것인지 아바타
    function friendTodoRow(uid, t){ const nm=friendDisplayName(uid);
      const chk='<span class="tdchk'+(t.done?' on':'')+'" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></span>';
      return '<div class="tdrow">'+chk+'<span class="tdtitle'+(t.done?' done':'')+'">'+escapeHtml(t.title||'')+(t.repeat&&t.repeat!=='none'?' <span class="pill">🔁</span>':'')+(t.purposeBookId?' <span class="pill">📍</span>':'')+'</span>'+todoDueBadge(t)+'<span class="tdwho">'+avatarHtml(uid,nm,20)+'</span></div>'; }
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
      const pubUids=Object.keys(state.friends||{}).filter(function(u){ return state.friendPub && state.friendPub[u]; });
      const today=ymd(new Date()); const seen=storySeenMap();
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
    function openMyStory(){ if(typeof openCatHouse==='function') openCatHouse('home'); }   // 내 스토리 = 내 알뜰샵 홈(라이브 캠)
    function openMyStoryTodos(){ if(!storyTodos(state.uid).length){ openTodoEdit(); return; } _openStory([state.uid], 0); }   // (레거시 풀스크린 페이저)
    function openFriendStory(uid){
      const pub=Object.keys(state.friends||{}).filter(function(u){ return state.friendPub && state.friendPub[u]; });
      const order=friendFeedOrder(state.friendTodosByUid, pub, ymd(new Date())).map(function(r){ return r.uid; }).filter(function(u){ return storyTodos(u).length; });
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
        '<div class="sv-head">'+avatarHtml(uid,nm,32)+'<b>'+(me?'내 스토리':escapeHtml(nm))+'</b><span class="sv-time">'+rt+'</span><button class="sv-x" onclick="closeStory()" aria-label="닫기">✕</button></div></div>';
      h+='<div class="sv-body"><div class="sv-card"><div class="sv-title'+(t.done?' done':'')+'">'+escapeHtml(t.title||'(제목 없음)')+'</div>'+
        (t.dueDate?'<div class="sv-due">'+todoDueBadge(t)+'</div>':'')+(t.note?'<div class="sv-note">'+escapeHtml(t.note)+'</div>':'')+(t.done?'<div class="sv-doneflag">✓ 완료</div>':'')+'</div>'+
        (me?'<button class="btn" style="margin-top:14px;" onclick="closeStory();openTodoEdit()">＋ 할일 추가</button>':'')+'</div>';
      h+='<button class="sv-zone left" onclick="storyPrev()" aria-label="이전"></button><button class="sv-zone right" onclick="storyNext()" aria-label="다음"></button>';
      el.innerHTML=h; el.classList.add('on');
      if(_storyTimer){ clearTimeout(_storyTimer); _storyTimer=0; }
      const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(!reduce) _storyTimer=setTimeout(storyNext, 4200);   // 자동 넘김(4.2s)
    }
    // nextDue/dueDiffDays는 js/util.js(순수함수·단위테스트)로 이관됨 — 전역으로 사용.
    function todoDueBadge(t){ if(!t.dueDate) return ''; const today=ymd(new Date());
      const diff=dueDiffDays(t.dueDate, today);
      let txt,cls; if(diff<0){ txt=(-diff)+'일 지남'; cls='over'; } else if(diff===0){ txt='오늘'; cls='today'; } else if(diff===1){ txt='내일'; cls='soon'; } else { txt='D-'+diff; cls=diff<=3?'soon':''; }
      return '<span class="tdue '+cls+'">'+txt+'</span>'; }
    function todoRow(t, ro){
      const who=(t.assignedUid||t.assignedName)?'<span class="tdwho">'+(t.assignedUid?avatarHtml(t.assignedUid,t.assignedName||'',20):'<span class="tdname">'+escapeHtml(t.assignedName)+'</span>')+'</span>':'';
      const chkSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg>';
      const chk=ro
        ? '<span class="tdchk'+(t.done?' on':'')+'" aria-hidden="true">'+chkSvg+'</span>'
        : '<button class="tdchk'+(t.done?' on':'')+'" onclick="event.stopPropagation();toggleTodo(\''+t.id+'\')" aria-label="'+(t.done?'완료 취소':'완료 처리')+'">'+chkSvg+'</button>';
      const titleTag=ro
        ? '<span class="tdtitle'+(t.done?' done':'')+'">'
        : '<span class="tdtitle'+(t.done?' done':'')+'" onclick="openTodoEdit(\''+t.id+'\')">';
      return '<div class="tdrow">'+chk+
        titleTag+escapeHtml(t.title||'')+(t.repeat&&t.repeat!=='none'?' <span class="pill">🔁</span>':'')+(t.purposeBookId?' <span class="pill">📍</span>':'')+'</span>'+
        todoDueBadge(t)+who+'</div>';
    }
    function renderTodoList(){
      // 개인 워크스페이스의 둘째 탭(친구들) = 친구 피드(아바타 정렬·오늘 무지개·친구 할일 목록)
      if(state._todoScope==='group' && isPersonalWs()) return renderFriendsFeed();
      const meUid=state.uid; const today=ymd(new Date());
      const we=new Date(); we.setDate(we.getDate()+7); const weekEnd=ymd(we);
      const isGroup=state._todoScope==='group';
      if(!isGroup && _todoFilter==='mine') _todoFilter='all';   // 개인 탭엔 '내 담당' 필터 없음
      const base=scopedTodos();
      let open=base.filter(t=>!t.done);
      if(_todoFilter==='mine') open=open.filter(t=>t.assignedUid===meUid);
      else if(_todoFilter==='today') open=open.filter(t=>t.dueDate&&t.dueDate<=today);
      else if(_todoFilter==='week') open=open.filter(t=>t.dueDate&&t.dueDate<=weekEnd);
      open.sort((a,b)=>{ const ad=a.dueDate||'9999-99', bd=b.dueDate||'9999-99'; if(ad!==bd) return ad<bd?-1:1; return (a.sortOrder||0)-(b.sortOrder||0); });
      const done=base.filter(t=>t.done).sort((a,b)=>(b.doneAt||'').localeCompare(a.doneAt||''));
      const chips=isGroup?[['all','전체'],['mine','내 담당'],['today','오늘'],['week','이번주']]:[['all','전체'],['today','오늘'],['week','이번주']];
      let h=todoScopeSeg();   // 개인 탭 = 내 할일만(친구는 '친구들' 탭 피드로 일원화)
      h+='<div class="chip-row" style="margin:6px 0 12px;">'+chips.map(c=>'<button class="chip'+(_todoFilter===c[0]?' on':'')+'" onclick="setTodoFilter(\''+c[0]+'\')">'+c[1]+'</button>').join('')+'</div>';
      const emptyMsg=isGroup?'그룹 할일이 없어요 — 아래 ＋ 로 담당을 나눠보세요':'개인 할일이 없어요 — 아래 ＋ 로 추가하세요';
      h+='<div class="card" style="padding:4px 12px;">'+(open.length?open.map(t=>todoRow(t)).join(''):'<div class="empty" style="padding:26px 6px;">'+emptyMsg+'</div>')+'</div>';
      if(done.length){ h+='<div class="sech"><span class="l">완료</span><span class="s">'+done.length+'개</span></div><div class="card" style="padding:4px 12px;">'+done.slice(0,20).map(t=>todoRow(t)).join('')+'</div>'; }
      $('content').innerHTML=h;
    }
    function todoMoveMonth(d){ state.month=shiftMonth(state.month,d); renderTodoCalendar(); }
    function todoSelDay(ds){ _todoSel=ds; renderTodoCalendar(); }
    function renderTodoCalendar(){
      const m=state.month, parts=m.split('-'), y=+parts[0], mo=+parts[1];
      const base=scopedTodos();
      const byDay={}; base.forEach(t=>{ if(!t.done && t.dueDate && t.dueDate.slice(0,7)===m) byDay[t.dueDate]=(byDay[t.dueDate]||0)+1; });
      const HEAD=['월','화','수','목','금','토','일']; const first=(new Date(y,mo-1,1).getDay()+6)%7; const days=new Date(y,mo,0).getDate(); const todayS=todayStr(); const sel=_todoSel||todayS;
      let h=todoScopeSeg();
      h+='<div class="monthlbl"><button onclick="todoMoveMonth(-1)" aria-label="이전 달">‹</button><b>'+y+'년 '+mo+'월</b><button onclick="todoMoveMonth(1)" aria-label="다음 달">›</button></div>';
      h+='<div class="calwrap"><div class="cal-head">'+HEAD.map(function(w,i){ return '<div class="'+(i===5?'sat':i===6?'sun':'')+'">'+w+'</div>'; }).join('')+'</div><div class="cal-grid">';
      for(let i=0;i<first;i++) h+='<div class="cal-cell dim"></div>';
      for(let d=1;d<=days;d++){ const ds=y+'-'+pad2(mo)+'-'+pad2(d); const wd=new Date(y,mo-1,d).getDay(); const dcls='d'+(wd===0?' sun':(wd===6?' sat':''));
        const n=byDay[ds]||0; const cls='cal-cell'+(ds===todayS?' today':'')+(ds===sel?' sel':'');
        const dot=n?'<span class="dotrow"><i style="background:var(--primary)"></i>'+(n>1?'<span style="font-size:9px;font-weight:800;color:var(--primary);margin-left:2px;">'+n+'</span>':'')+'</span>':'';
        h+='<div class="'+cls+'" onclick="todoSelDay(\''+ds+'\')"><div class="'+dcls+'">'+d+'</div>'+dot+'</div>';
      }
      h+='</div></div>';
      const ro=todoReadOnly();
      const dayT=base.filter(t=>t.dueDate===sel).sort((a,b)=>(a.done?1:0)-(b.done?1:0));
      h+='<div class="sech"><span class="l">'+(+sel.split('-')[1])+'월 '+(+sel.split('-')[2])+'일</span><span class="s">'+dayT.length+'개</span></div>';
      h+='<div class="card" style="padding:4px 12px;">'+(dayT.length?dayT.map(t=>todoRow(t,ro)).join(''):'<div class="empty" style="padding:22px 6px;">이 날 할일이 없어요</div>')+'</div>';
      $('content').innerHTML=h;
    }
    function renderTodoDone(){ const ro=todoReadOnly(); const done=scopedTodos().filter(t=>t.done).sort((a,b)=>(b.doneAt||'').localeCompare(a.doneAt||''));
      let h=todoScopeSeg();
      h+='<div class="sech"><span class="l">완료</span><span class="s">'+done.length+'개</span></div>';
      h+='<div class="card" style="padding:4px 12px;">'+(done.length?done.map(t=>todoRow(t,ro)).join(''):'<div class="empty" style="padding:26px 6px;">완료한 할일이 아직 없어요</div>')+'</div>';
      $('content').innerHTML=h; }
    function toggleTodo(id){ const t=allTodos().find(x=>x.id===id); if(!t) return; const now=new Date().toISOString();
      const ref=todoDbRef(t);
      const firstReward=!t.rewardClaimed;   // 할일당 은화 1회(멱등)
      if(!t.done && t.repeat && t.repeat!=='none' && t.dueDate){
        const upd={ dueDate:nextDue(t.dueDate,t.repeat), doneByUid:(state.uid||''), lastDoneAt:now, updatedAt:now };
        if(firstReward) upd.rewardClaimed=true;
        ref.update(upd);
        const nxt='다음 '+(t.repeat==='weekly'?'주':'일')+'로 넘겼어요';
        if(firstReward && typeof grantTodoCoins==='function'){ grantTodoCoins(); toast('완료! +2 은화 · '+nxt); } else toast('완료! '+nxt);
      } else {
        const done=!t.done; const upd={ done:done, doneAt:done?now:'', doneByUid:done?(state.uid||''):'', updatedAt:now };
        if(done && firstReward){ upd.rewardClaimed=true; ref.update(upd); if(typeof grantTodoCoins==='function'){ grantTodoCoins(); toast('완료! +2 은화 🐾'); } }
        else ref.update(upd);
      }
    }
    function openTodoEdit(id, presetPb){
      if(!id) state._todoFriend=null;   // 새 할일은 항상 내 목록으로(친구 읽기전용 뷰였어도)
      const t=id?allTodos().find(x=>x.id===id):null;
      // 스코프: 편집=기존 할일 값, 신규=현재 세그먼트. 개인은 담당자 없음(소유자=나), 그룹은 담당배정.
      const scope=t?todoScope(t):(state._todoScope==='group'?'group':'personal');
      const asel=t?(t.assignedUid||'공동'):(state.uid||'공동');
      const rep=t?(t.repeat||'none'):'none';
      const pbSel=t?(t.purposeBookId||''):(presetPb||'');
      const pbs=(state.purposeBooks||[]).filter(p=>(p.status||'active')!=='archived');
      let h='<input type="hidden" id="tdScope" value="'+scope+'">';
      h+='<div class="field"><label>할 일</label><input class="input" id="tdTitle" value="'+escapeHtml(t?(t.title||''):'')+'" placeholder="예: 장보기, 항공권 예약"></div>';
      if(scope==='group') h+='<div class="form-2"><div class="field"><label>담당자</label><select class="input" id="tdAssign">'+ownerOptions(asel)+'</select></div>'+
        '<div class="field"><label>마감일</label><input type="date" class="input" id="tdDue" value="'+(t&&t.dueDate?t.dueDate:'')+'"></div></div>';
      else h+='<div class="field"><label>마감일</label><input type="date" class="input" id="tdDue" value="'+(t&&t.dueDate?t.dueDate:'')+'"></div>';
      var repOpts=[['none','반복 없음'],['weekly','매주'],['monthly','매월']]; if(rep==='daily') repOpts.splice(1,0,['daily','매일(기존)']);   // 매일은 신규 제외(습관=내 미션), 레거시 값은 보존
      h+='<div class="form-2"><div class="field"><label>반복</label><select class="input" id="tdRepeat">'+repOpts.map(function(o){ return '<option value="'+o[0]+'"'+(rep===o[0]?' selected':'')+'>'+o[1]+'</option>'; }).join('')+'</select></div>'+
        '<div class="field"><label>가계부 연결</label><select class="input" id="tdPb"><option value="">연결 안 함</option>'+pbs.map(function(p){ return '<option value="'+p.id+'"'+(pbSel===p.id?' selected':'')+'>'+(p.icon||'📒')+' '+escapeHtml(p.name)+'</option>'; }).join('')+'</select></div></div>';
      h+='<p class="muted" style="font-size:11.5px;margin:-4px 2px 10px;">매일 하는 습관은 <b>미션 탭 · 내 미션</b>에서 스트릭으로 관리해요.</p>';
      h+='<div class="field"><label>메모 (선택)</label><input class="input" id="tdNote" value="'+escapeHtml(t?(t.note||''):'')+'" placeholder="메모"></div>';
      h+='<button class="btn" onclick="saveTodo('+(id?'\''+id+'\'':'null')+')">'+(t?'수정':'추가')+'</button>';
      if(t) h+='<button class="btn danger" style="margin-top:8px;" onclick="deleteTodo(\''+id+'\')">삭제</button>';
      openSheet(t?'할일 수정':'할일 추가', h);
    }
    function saveTodo(id){
      const title=val('tdTitle').trim(); if(!title){ toast('할 일을 입력하세요', true); return; }
      const t=id?allTodos().find(x=>x.id===id):null; const now=new Date().toISOString();
      const scope=($('tdScope')?val('tdScope'):(t?todoScope(t):'group'))==='personal'?'personal':'group';
      const asel=$('tdAssign')?val('tdAssign'):'공동'; const mem=(state.wsMeta&&state.wsMeta.members)||{};
      let assignedUid='', assignedName='';
      if(scope==='group' && asel!=='공동'){ if(mem[asel]){ assignedUid=asel; assignedName=mem[asel].name||''; } else if(asel===state.uid){ assignedUid=state.uid; assignedName=state.userName||''; } else { assignedName=asel; } }
      // 개인 할일 소유자: 기존 값 유지, 신규는 나. 그룹은 소유자 개념 없음(담당자로 표현).
      const ownerUid=scope==='personal'?(t?(t.ownerUid||t.createdByUid||state.uid||''):(state.uid||'')):'';
      const key=id||('todo_'+Date.now());
      const data={ title:title, note:val('tdNote').trim(), dueDate:val('tdDue')||'',
        scope:scope, ownerUid:ownerUid,
        assignedUid:assignedUid, assignedName:assignedName,
        repeat:($('tdRepeat')?val('tdRepeat'):'none')||'none', purposeBookId:($('tdPb')?val('tdPb'):'')||'',
        done:t?!!t.done:false, doneAt:t?(t.doneAt||''):'', doneByUid:t?(t.doneByUid||''):'', rewardClaimed:t?!!t.rewardClaimed:false,
        createdByUid:t?(t.createdByUid||state.uid||''):(state.uid||''), createdAt:t?(t.createdAt||now):now, updatedAt:now,
        sortOrder:t?(t.sortOrder!=null?t.sortOrder:Date.now()):Date.now() };
      const ref=scope==='personal'?db.ref('users/'+state.uid+'/todos/'+key):db.ref(wp('todos/'+key));
      ref.set(data); toast(t?'수정되었습니다':'추가되었습니다'); closeSheet();
    }
    function deleteTodo(id){ const t=allTodos().find(x=>x.id===id); if(!t) return; confirmSheet('이 할일을 삭제할까요?', ()=>{ todoDbRef(t).remove(); toast('삭제되었습니다'); closeSheet(); }); }
    // 목적별 가계부(여행 등) 상세에 붙이는 연결된 할일 요약 카드
    function pbTodoSummaryHtml(pbId){ const list=allTodos().filter(t=>t.purposeBookId===pbId); if(!list.length && true){ /* 없으면 추가 버튼만 */ }
      const doneN=list.filter(t=>t.done).length;
      let h='<div class="sech"><span class="l">할일</span><span class="s">'+(list.length?(doneN+' / '+list.length+' 완료'):'')+'</span></div>';
      h+='<div class="card" style="padding:4px 12px;">'+(list.length?list.slice().sort((a,b)=>(a.done?1:0)-(b.done?1:0)).map(todoRow).join(''):'<div class="empty" style="padding:18px 6px;">연결된 할일이 없어요</div>')+'</div>';
      h+='<button class="btn ghost" style="margin-top:8px;" onclick="openTodoEdit(null,\''+pbId+'\')">＋ 이 여행에 할일 추가</button>';
      return h; }
    // 완료 리포트(할일 모드 더보기) — 전체 완료율 + 스코프별 + 멤버별 완료 기여
    function openTodoReport(){
      const all=state.todos||[]; const total=all.length, doneN=all.filter(t=>t.done).length; const rate=total?Math.round(doneN/total*100):0;
      const p=all.filter(t=>todoScope(t)==='personal'), g=all.filter(t=>todoScope(t)==='group');
      const mem=(state.wsMeta&&state.wsMeta.members)||{};
      let h='<div class="card" style="padding:16px;text-align:center;">'+
        '<div style="font-size:30px;font-weight:900;color:var(--primary);line-height:1;">'+rate+'%</div>'+
        '<div class="muted" style="font-size:12.5px;margin-top:5px;">완료 '+doneN+' / 전체 '+total+'</div>'+
        '<div style="height:8px;border-radius:6px;background:var(--soft);margin-top:12px;overflow:hidden;"><div style="height:100%;width:'+rate+'%;background:var(--primary);"></div></div></div>';
      h+='<div class="sech"><span class="l">구성</span></div><div class="card" style="padding:4px 12px;">'+
        '<div class="tdrow"><span class="tdtitle">개인</span>'+todoDoneChip(p)+'</div>'+
        '<div class="tdrow"><span class="tdtitle">그룹</span>'+todoDoneChip(g)+'</div></div>';
      const byMem={}; all.forEach(t=>{ if(t.done && t.doneByUid) byMem[t.doneByUid]=(byMem[t.doneByUid]||0)+1; });
      const uids=Object.keys(byMem).sort((a,b)=>byMem[b]-byMem[a]);
      if(uids.length){ h+='<div class="sech"><span class="l">완료 기여</span></div><div class="card" style="padding:4px 12px;">'+
        uids.map(function(u){ const nm=(u===state.uid)?(state.userName||'나'):((mem[u]&&mem[u].name)||'멤버'); return '<div class="tdrow"><span class="tdwho">'+avatarHtml(u,nm,22)+'</span><span class="tdtitle">'+escapeHtml(nm)+'</span><span class="tdue">'+byMem[u]+'개</span></div>'; }).join('')+'</div>'; }
      openSheet('완료 리포트', h);
    }
    function todoDoneChip(list){ return '<span class="tdue">'+list.filter(t=>t.done).length+' / '+list.length+'</span>'; }
    // 반복 할일 관리(할일 모드 더보기)
    function openRepeatTodos(){
      const list=(state.todos||[]).filter(t=>t.repeat && t.repeat!=='none').sort((a,b)=>(a.dueDate||'9999-99').localeCompare(b.dueDate||'9999-99'));
      let h='<p class="muted" style="margin:2px 2px 12px;line-height:1.5;">매주·매월 반복 예정 할일이에요. 완료하면 다음 회차로 넘어가요. 매일 하는 습관은 <b>미션 탭 · 내 미션</b>에서 관리해요.</p>';
      h+='<div class="card" style="padding:4px 12px;">'+(list.length?list.map(function(t){ return todoRow(t,false); }).join(''):'<div class="empty" style="padding:22px 6px;">반복 할일이 없어요</div>')+'</div>';
      openSheet('반복 할일', h);
    }
    function renderStats(){
      if(typeof markReportSeen==='function') markReportSeen();   // 🐱 주간 미션: 리포트 확인
      const m=state.month, list=monthTx(m);
      const actual=actualSpend(list), inc=sumBy(list,'income'), bal=inc-actual;
      const [yy,mo]=m.split('-');
      // 월 네비
      let h='<div class="monthlbl" style="padding-top:6px"><button onclick="statsMonth(-1)" aria-label="이전 달">‹</button><b>'+yy+'년 '+(+mo)+'월</b><button onclick="statsMonth(1)" aria-label="다음 달">›</button></div>';
      // 총지출 카드 + 수입/잔액/전월 대비
      const pActual=actualSpend(monthTx(shiftMonth(m,-1)));
      let momHtml;
      if(pActual>0){ const diff=(actual-pActual)/pActual*100, up=diff>=0; momHtml='<span style="color:'+(up?'var(--expense)':'var(--income)')+'">'+(up?'▲':'▼')+' '+Math.abs(diff).toFixed(1)+'%</span>'; }
      else momHtml='<span style="color:var(--sub)">—</span>';
      h+='<div class="card" style="margin-bottom:6px"><div style="font-size:12px;color:var(--sub);font-weight:700;margin-bottom:6px">이번 달 총지출</div>'+
        '<div class="bigexp">₩ '+fmtComma(actual)+'</div>'+
        '<div class="statrow">'+
          '<div><div class="k">수입</div><div class="v" style="color:var(--income)">'+signComma(inc)+'</div></div>'+
          '<div><div class="k">잔액</div><div class="v">'+signComma(bal)+'</div></div>'+
          '<div style="margin-left:auto"><div class="k">전월 대비</div><div class="v">'+momHtml+'</div></div>'+
        '</div></div>';
      // 카테고리별 CSS 도넛 + 범례
      const cd={}; list.filter(t=>isActual(t)&&t.category).forEach(t=>{ cd[t.category]=(cd[t.category]||0)+(Number(t.amount)||0); });
      let cats=Object.keys(cd).map(k=>({name:k,val:cd[k]})).sort((a,b)=>b.val-a.val);
      const totCat=cats.reduce((s,c)=>s+c.val,0);
      h+='<div class="sech"><span class="l">카테고리별</span><span class="s">'+(+mo)+'월</span></div>';
      if(totCat>0){
        let segs = cats.length>6 ? cats.slice(0,5).concat([{name:'기타',val:cats.slice(5).reduce((s,c)=>s+c.val,0),etc:true}]) : cats;
        let acc=0; const stops=segs.map(s=>{ const p0=acc/totCat*100, p1=(acc+s.val)/totCat*100; const col=s.etc?'var(--soft2)':catColor(s.name); acc+=s.val; return col+' '+p0.toFixed(2)+'% '+p1.toFixed(2)+'%'; });
        h+='<div class="donut-wrap"><div class="donut" style="background:conic-gradient('+stops.join(',')+')"><div class="ic"><b>'+shortAmt(totCat)+'</b><span>총지출</span></div></div>'+
          '<div class="legend">'+segs.map(s=>'<div class="lgi"><i style="background:'+(s.etc?'var(--soft2)':catColor(s.name))+'"></i><span class="ln">'+escapeHtml(s.name)+'</span><span class="lp">'+Math.round(s.val/totCat*100)+'%</span></div>').join('')+'</div></div>';
      } else h+='<div class="empty" style="padding:24px;">이 달 지출 데이터가 없습니다</div>';
      // 💡 인사이트: 전월 대비 가장 크게 늘어난 카테고리(의미 있는 금액만)
      const pcd={}; monthTx(shiftMonth(m,-1)).filter(t=>isActual(t)&&t.category).forEach(t=>{ pcd[t.category]=(pcd[t.category]||0)+(Number(t.amount)||0); });
      let topInc=null; cats.forEach(c=>{ const prev=pcd[c.name]||0; if(prev>=10000){ const d=(c.val-prev)/prev; if(d>=0.3 && (!topInc||d>topInc.d)) topInc={name:c.name,d:d}; } });
      if(topInc) h+='<div class="tx-sub" style="margin:2px 2px 10px;">💡 이번 달 <b>'+escapeHtml(topInc.name)+'</b> 지출이 지난달보다 <b>'+Math.round(topInc.d*100)+'%</b> 늘었어요.</div>';
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
      // 최근 6개월 추이 막대
      const md={}; state.transactions.filter(isActual).forEach(t=>{ const mm=(t.date||'').substring(0,7); if(mm) md[mm]=(md[mm]||0)+(Number(t.amount)||0); });
      const keys=[]; for(let i=5;i>=0;i--) keys.push(shiftMonth(m,-i));
      const mxB=Math.max(1,...keys.map(k=>md[k]||0));
      h+='<div class="sech"><span class="l">최근 6개월 추이</span></div><div class="bars6">'+
        keys.map(k=>'<div class="b"><div class="bar'+(k===m?' on':'')+'" style="height:'+Math.round((md[k]||0)/mxB*100)+'%"></div><div class="bl">'+(+k.split('-')[1])+'월</div></div>').join('')+'</div>';
      // 소비 대상별 지출 — 개인별(용돈 등)과 공동 지출(집세 등)을 분리해서 표시
      const ue={}; list.filter(isActual).forEach(t=>{ const k=personKey(t); ue[k]=(ue[k]||0)+(Number(t.amount)||0); });
      const shared=ue['공동']||0;
      const _pm=(state.wsMeta&&state.wsMeta.members)||{};
      const pKeys=Object.keys(ue).filter(k=>k!=='공동'&&(ue[k]||0)>0).sort((a,b)=>(ue[b]||0)-(ue[a]||0));
      const pLabel=(k)=>escapeHtml((_pm[k]&&_pm[k].name)||k);
      if(pKeys.length||shared>0){
        const mxM=Math.max(1,shared,...pKeys.map(k=>ue[k]||0)); const pal=['#f3b14e','#7fd1a6','#c8a6f0','#6a8dff','#ff9aa2','#5ad1e0'];
        const mbar=(label,amt,col)=>'<div class="mbar"><div class="top"><span>'+label+'</span><span>'+fmtComma(amt||0)+'</span></div><div class="track"><div class="fill" style="width:'+Math.round((amt||0)/mxM*100)+'%;background:'+col+'"></div></div></div>';
        h+='<div class="sech"><span class="l">개인별 지출</span><span class="s">용돈 등</span></div>';
        h+= pKeys.length ? pKeys.map((k,i)=>mbar(pLabel(k),ue[k]||0,pal[i%pal.length])).join('') : '<div class="empty" style="padding:16px;">개인 지출이 없습니다</div>';
        if(shared>0) h+='<div class="sech"><span class="l">공동 지출</span><span class="s">집세 등</span></div>'+mbar('🤝 공동',shared,'var(--sub)');
      }
      const bgs=visibleBudgets();
      if(bgs.length){
        h+='<div class="card"><div class="row" style="margin-bottom:4px;"><div class="sec-title" style="margin:0;">예산</div><button class="link" onclick="openBudgetSheet()">관리</button></div>'+
          bgs.map(b=>{ const u=budgetUsage(b), c=budgetColor(u.pct); return '<div style="margin:10px 0;"><div class="row" style="font-size:13px;"><span>'+(b.categoryName?'<span class="catdot" style="background:'+catColor(b.categoryName)+'"></span>':'')+budgetTitle(b)+'</span><span style="color:'+c+';font-weight:700;">'+u.pct+'%'+(u.pct>=100?' 초과':(b.alertEnabled!==false&&u.pct>=(b.alertThreshold||80)?' ⚠️':''))+'</span></div><div class="bar"><i style="width:'+Math.min(u.pct,100)+'%;background:'+c+'"></i></div><div class="tx-sub" style="margin-top:4px;">'+won(u.used)+' / '+won(u.amount)+'</div></div>'; }).join('')+'</div>';
      }
      const pbsR=visiblePBs().filter(p=>(p.status||'active')==='active');
      if(pbsR.length){
        const ranked=pbsR.map(p=>({p,u:pbUsage(p)})).sort((a,b)=>b.u.used-a.u.used).slice(0,3);
        h+='<div class="card"><div class="row" style="margin-bottom:4px;"><div class="sec-title" style="margin:0;">목적별 가계부</div><button class="link" onclick="openPurposeBooks()">전체</button></div>'+
          ranked.map(r=>{ const c=budgetColor(r.u.pct); return '<div style="margin:10px 0;"><div class="row" style="font-size:13px;"><span>'+(r.p.icon||'📒')+' '+escapeHtml(r.p.name)+'</span><span>'+won(r.u.used)+(r.p.budgetAmount?(' / '+won(r.u.amount)):'')+'</span></div>'+(r.p.budgetAmount?('<div class="bar"><i style="width:'+Math.min(r.u.pct,100)+'%;background:'+c+'"></i></div>'):'')+'</div>'; }).join('')+'</div>';
      }
      const pa=prepaidAccounts().filter(canSee);
      if(pa.length) h+='<div class="card" style="margin-top:34px;"><div class="sec-title" style="margin:0 0 8px;">선불·포인트 잔액</div>'+pa.map(a=>'<div class="row" style="padding:7px 2px;"><span>'+((a.provider&&a.provider!=='manual')?PROVIDER_LABEL[a.provider]+' · ':'')+escapeHtml(a.name)+'</span><b class="blue">'+won(accountBalance(a.id))+'</b></div>').join('')+'</div>';
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

      // 입출금 · 현금
      h+=sechHtml('입출금 · 현금','openAcctSheet()');
      h+= cashish.length? cashish.map(acctRowHtml).join('') : '<div class="empty" style="padding:18px;">등록된 계좌가 없습니다</div>';

      // 카드 실적
      const cards=state.creditCards.filter(c=>canSee(getAcct(c.id)||{owner:''}));
      if(cards.length){
        h+=sechHtml('카드 실적', null, (new Date().getMonth()+1)+'월');
        cards.forEach(c=>{
          const pf=cardPerformance(c), col=pf.pct>=100?'var(--income)':'var(--primary)';
          h+='<div class="perfrow" onclick="openAcctSheet(\''+c.id+'\')"><div class="perftop"><b>'+escapeHtml(c.cardName||acctName(c.id))+'</b>'+
            '<span class="pct" style="color:'+col+'">'+(pf.target?pf.pct+'%':'목표 미설정')+'</span></div>'+
            (pf.target?'<div class="prog"><div class="f" style="width:'+Math.min(pf.pct,100)+'%;background:'+col+'"></div></div>'+
              '<div class="perfsub">'+won(pf.sum)+' / '+won(pf.target)+(pf.remain>0?' · '+won(pf.remain)+' 더 쓰면 실적 달성':' · 이번 달 실적 충족')+'</div>':'')+'</div>';
        });
      }

      // 선불 · 포인트
      if(prepaid.length){ h+=sechHtml('선불 · 포인트','openAcctSheet()'); h+=prepaid.map(acctRowHtml).join(''); }
      // 기타
      if(others.length){ h+=sechHtml('기타','openAcctSheet()'); h+=others.map(acctRowHtml).join(''); }

      // 적금 목표
      const SVC=['#22b8cf','#f04452','#3182f6','#1b9e5f','#7c3aed','#f5a623'];
      h+=sechHtml('적금 목표','openSavingsSheet()');
      h+= state.savings.length? state.savings.map((sv,i)=>{
        const p=sv.goal?Math.min(Math.round(sv.current/sv.goal*100),999):0, col=SVC[i%SVC.length];
        const ch=escapeHtml((sv.name||'·').charAt(0));
        return '<div class="bgrow" onclick="openSavingsSheet(\''+sv.ownerUid+'\',\''+sv.id+'\')"><div class="bgtop"><span class="ci" style="background:'+col+'">'+ch+'</span>'+
          '<span class="bn">'+escapeHtml(sv.name)+'</span><span class="ba">'+p+'%</span></div>'+
          '<div class="bgtrack"><div class="bgfill" style="width:'+Math.min(p,100)+'%;background:'+col+'"></div></div>'+
          '<div class="perfsub" style="margin-top:6px">'+won(sv.current)+' / '+won(sv.goal)+'</div></div>';
      }).join(''):'<div class="empty" style="padding:20px;">적금 목표가 없습니다</div>';

      $('content').innerHTML=h;
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
      const sub=(ACCT_TYPE_LABEL[a.type]||a.type)+(a.owner?' · '+escapeHtml(a.owner):'');
      return '<div class="acct" onclick="openAcctSheet(\''+a.id+'\')"><div class="acct-dot">'+acctIcon(a.type)+'</div>'+
        '<div style="min-width:0;" class="acct-nm"><b>'+escapeHtml(a.name)+prov+vis+'</b><span>'+sub+'</span></div>'+
        '<div class="acct-bal '+(bal<0?'red':'')+'">'+won(bal)+'</div></div>';
    }

    function openAcctSheet(id, presetType){
      const a=id?getAcct(id):null;
      const card=id?getCard(id):null;
      const curType=a?a.type:(presetType||'bank');
      let h='<div class="field"><label>이름</label><input class="input" id="aName" value="'+escapeHtml(a?a.name:'')+'" placeholder="예: 쿠팡캐시, 신한카드"></div>';
      h+='<div class="form-2"><div class="field"><label>유형</label><select class="input" id="aType" onchange="onAcctTypeChange()">'+ACCT_TYPES.map(p=>'<option value="'+p[0]+'"'+(curType===p[0]?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>제공처</label><select class="input" id="aProvider">'+PROVIDERS.map(p=>'<option value="'+p[0]+'"'+(((a&&a.provider===p[0])||(!a&&p[0]==='manual'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div></div>';
      h+='<div class="form-2"><div class="field"><label>소유자</label><select class="input" id="aOwner">'+ownerOptions(a?a.owner:defaultOwnerName())+'</select></div>'+
        '<div class="field"><label>공개 범위</label><select class="input" id="aVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((a&&a.visibility===p[0])||(!a&&p[0]===defaultVisibility()))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div></div>';
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
    // ===== 오늘 홈(랜딩 대시보드) — 오늘 할 것(미션·할일·가계부 한 줄)을 한 화면에 =====
    function homeMissionRow(o){
      const chk='<button class="tdchk'+(o.done?' on':'')+'" onclick="'+o.onclick+'" aria-label="'+escapeHtml(o.name)+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 6"/></svg></button>';
      return '<div class="hmrow">'+chk+'<span class="hmname'+(o.done?' done':'')+'">'+escapeHtml(o.name)+'</span>'+
        (o.done?'<span class="hmok">완료</span>':(o.reward?'<span class="hmrw"><span class="ci">'+coinSvg({h:14})+'</span>+'+o.reward+'</span>':''))+'</div>';
    }
    // 오늘 남은 일(로고 배지·홈 완료카드 공용 단일 소스) — util.todayPending에 현재 브라우저 상태를 모아 넘김(새 조회 없음).
    function todayPendingNow(){
      var daily=(typeof DAILY_MISSIONS!=='undefined')?DAILY_MISSIONS:[];
      var customs=(typeof customMissionList==='function')?customMissionList():[];
      var flags=daily.map(function(m){return missionClaimed(m);}).concat(customs.map(function(m){return customCheckedToday(m.id);}));
      var todos=(typeof scopedTodos==='function')?scopedTodos():[];
      return todayPending(flags, todos, ymd(new Date()));
    }
    // 완료 축하 연출은 하루 1회만(renderHome이 재렌더마다 재실행되므로 플래그로 반복 재생 차단). reduced-motion이면 정적.
    function shouldCelebrateOnce(){
      if(typeof reducedMotion==='function' && reducedMotion()) return false;
      var k=ymd(new Date()); if(state._homeDoneCelebrated===k) return false; state._homeDoneCelebrated=k; return true;
    }
    function renderHome(){
      const c=$('content'); if(!c) return;
      const hh=new Date().getHours(); const greet=hh<11?'좋은 아침이에요':(hh<18?'오늘도 알뜰하게':'오늘 하루 마무리해요');
      const daily=(typeof DAILY_MISSIONS!=='undefined')?DAILY_MISSIONS:[];
      const customs=(typeof customMissionList==='function')?customMissionList():[];
      const mrows=daily.map(function(m){ return { name:m.name, reward:m.reward, done:missionClaimed(m), onclick:"homeMissionTap('"+m.id+"')" }; })
        .concat(customs.map(function(m){ return { name:m.title, reward:0, done:customCheckedToday(m.id), onclick:"toggleCustomMissionToday('"+m.id+"')" }; }));
      const st=(typeof todayMissionState==='function')?todayMissionState(mrows.map(function(r){return r.done;})):{done:0,total:mrows.length,pct:0,allDone:false};
      const today=ymd(new Date());
      const dueTop=((typeof scopedTodos==='function')?scopedTodos():[]).filter(function(t){ return !t.done && t.dueDate && t.dueDate<=today; })
        .sort(function(a,b){ return (a.dueDate||'').localeCompare(b.dueDate||''); }).slice(0,4);
      const todaySpend=(typeof actualSpend==='function')?actualSpend((state.transactions||[]).filter(function(t){return (t.date||'').slice(0,10)===today;})):0;
      const monthSpend=(typeof actualSpend==='function'&&typeof monthTx==='function')?actualSpend(monthTx(state.month)):0;
      const p = todayPending(mrows.map(function(r){return r.done;}), (typeof scopedTodos==='function'?scopedTodos():[]), today);   // 배지·완료카드 공용 판정
      const kind = homeCardKind(p);   // 'sections' | 'done' | 'empty' (순수 결정, util)

      let h='<div class="homewrap">';
      h+='<div class="card homehero"><div class="hh-l"><div class="hh-greet">'+greet+', '+escapeHtml(state.userName||'')+'님</div>'+
        '<div class="hh-sub">오늘 미션 '+st.done+'/'+st.total+'</div></div>'+
        '<div class="hh-coin"><span class="ci">'+coinSvg({h:20})+'</span><b>'+coins().toLocaleString()+'</b></div></div>';
      if(kind==='done'){
        const cid=(typeof activeCats==='function'&&activeCats()[0])||(typeof ownedCatList==='function'&&ownedCatList()[0])||null;
        const art=cid?('<div class="hd-cat">'+catFace(cid,{h:64})+'</div>'):'<div class="hd-emoji">🐱</div>';
        const celebrate=(typeof shouldCelebrateOnce==='function'&&shouldCelebrateOnce());
        h+='<div class="card homedone'+(celebrate?' celebrate':'')+'">'+art+'<div class="hd-tit">오늘 할 거 다 했어요 🐱</div>'+
          '<div class="hd-sub">고양이도 만족스러워해요. 내일 또 만나요!</div>'+
          '<button class="btn ghost" onclick="openCatHouse()">알뜰샵 둘러보기</button></div>';
      } else if(kind==='empty'){
        h+='<div class="card homedone empty"><div class="hd-emoji">🌙</div><div class="hd-tit">오늘은 예정된 게 없어요</div>'+
          '<div class="hd-sub">미션이나 할일을 추가해 은화를 모아보세요.</div></div>';
      } else {
        if(mrows.length){
          const col=(typeof budgetColor==='function')?(st.allDone?'var(--income)':budgetColor(100-st.pct)):'var(--income)';
          h+='<div class="card"><div class="sech" style="margin-top:0;"><span class="l">오늘 미션</span><button class="link" onclick="openCatHouse(\'mission\')">미션 전체</button></div>'+
            '<div class="hbar"><i style="width:'+st.pct+'%;background:'+col+'"></i></div>'+mrows.map(homeMissionRow).join('')+'</div>';
        }
        if(dueTop.length){
          h+='<div class="card"><div class="sech" style="margin-top:0;"><span class="l">오늘·임박 할일</span><button class="link" onclick="goto(\'todo\')">전체 보기</button></div>'+
            dueTop.map(function(t){ return todoRow(t,false); }).join('')+'</div>';
        }
        h+='<div class="card homeledger" role="button" tabindex="0" onclick="goto(\'ledger\')"><div class="hl-row"><span class="hl-k">오늘 지출</span><span class="hl-v">₩'+todaySpend.toLocaleString()+'</span></div>'+
          '<div class="hl-row sub"><span class="hl-k">이번달 지출</span><span class="hl-v">₩'+monthSpend.toLocaleString()+'</span></div></div>';
      }
      h+='</div>';
      c.innerHTML=h;
    }

    // ===== 워크스페이스(가계부/그룹) 관리 UI =====
    function openWorkspaceSheet(){
      const cur=state.wsId;
      let h='<p class="muted" style="font-size:13px;margin:2px 2px 12px;">개인 가계부와 그룹을 분리해서 쓸 수 있어요. 그룹은 코드로 친구와 함께 사용합니다.</p>';
      h+='<div class="menu-group-title">내 그룹</div>';
      (state.memberships||[]).forEach(w=>{
        const on=w.id===cur, isGroup=w.type==='group', memCount=Object.keys(w.members||{}).length;
        h+='<div class="ws-item'+(on?' on':'')+'">'+
            '<span class="ws-ic">'+wsAvatarHtml(w.name, w.photo, 44)+'</span>'+
            '<div style="flex:1;min-width:0;" onclick="chooseWorkspace(\''+w.id+'\')">'+
              '<div class="ws-name" style="display:flex;align-items:center;gap:8px;"><span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+escapeHtml(w.name||'가계부')+'</span>'+(isGroup?memberAvatarStack(w,20):'')+'</div>'+
              '<div class="ws-meta">'+(isGroup?('그룹 · 멤버 '+memCount+'명'):'개인 전용')+'</div>'+
            '</div>'+
            (isGroup?'<button class="btn sm ghost" onclick="openGroupManageSheet(\''+w.id+'\')">관리</button>':'')+
            (on?'<span class="ws-ck">'+svgWrap(CAT_SVG.check)+'</span>':'')+
          '</div>';
      });
      h+='<div class="form-2" style="margin-top:14px;">'+
          '<button class="btn" onclick="openCreateGroupSheet()">+ 그룹 만들기</button>'+
          '<button class="btn ghost" onclick="openJoinGroupSheet()">코드로 참여</button>'+
         '</div>';
      if(!(state.memberships||[]).some(w=>w.type==='personal'))
        h+='<button class="btn ghost" style="margin-top:10px;" onclick="addPersonalWorkspace()">+ 개인 가계부 만들기</button>';
      openSheet('그룹 전환', h);
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
      // 그룹 이름 (소유자는 수정 가능)
      let h = isOwner
        ? '<div class="field"><label>그룹 이름</label><div style="display:flex;gap:8px;"><input class="input" id="grpRename" value="'+escapeHtml(w.name||'')+'"><button class="btn sm" onclick="doRenameWs(\''+wsId+'\')">저장</button></div></div>'
        : '<div class="field"><label>그룹 이름</label><div style="font-weight:700;font-size:16px;padding:4px 2px;">'+escapeHtml(w.name||'')+'</div></div>';
      h+='<label style="font-size:13px;font-weight:700;color:var(--sub);">초대 코드</label>';
      h+='<div class="code-box"><span>'+(w.code||'------')+'</span><button class="btn sm" onclick="copyText(\''+(w.code||'')+'\')">복사</button></div>';
      h+='<label style="font-size:13px;font-weight:700;color:var(--sub);">멤버 '+Object.keys(members).length+'명</label>';
      h+='<div class="card" style="padding:6px 10px;margin:8px 0 4px;">';
      Object.keys(members).forEach(uid=>{
        const m=members[uid], self=uid===state.uid, isMemOwner=m.role==='owner';
        h+='<div class="tx">'+avatarHtml(uid, m.name, 38)+
          '<div class="tx-main"><div class="tx-title">'+escapeHtml(m.name||'멤버')+(isMemOwner?' 👑':'')+(self?' (나)':'')+'</div><div class="tx-sub">'+(isMemOwner?'소유자':'멤버')+'</div></div>';
        if(isOwner && !self && !isMemOwner){
          h+='<span style="display:flex;gap:6px;"><button class="chip" onclick="doTransferOwner(\''+wsId+'\',\''+uid+'\')">소유자 지정</button>'+
             '<button class="chip" onclick="doRemoveMember(\''+wsId+'\',\''+uid+'\')">내보내기</button></span>';
        }
        h+='</div>';
      });
      h+='</div>';
      if(isOwner) h+='<div class="tx-sub" style="margin:2px 2px 8px;">소유자만 이름 변경·멤버 내보내기·소유자 지정을 할 수 있어요(앱 내 제한).</div>';
      h+='<button class="btn danger" style="margin-top:12px;" onclick="confirmLeave(\''+wsId+'\')">그룹 나가기</button>';
      openSheet('그룹 관리', h);
    }
    function memberName(wsId, uid){ const w=(state.memberships||[]).find(x=>x.id===wsId); return (w&&w.members&&w.members[uid]&&w.members[uid].name)||'멤버'; }
    function doRenameWs(wsId){ const n=val('grpRename').trim(); if(!n){ toast('이름을 입력하세요', true); return; } renameWorkspace(wsId, n).then(()=>openGroupManageSheet(wsId)); }
    function doTransferOwner(wsId, uid){ confirmSheet('"'+memberName(wsId,uid)+'"님에게 소유자를 넘길까요? 넘기면 나는 일반 멤버가 됩니다.', ()=>{ transferOwnership(wsId, uid).then(()=>openGroupManageSheet(wsId)); }); }
    function doRemoveMember(wsId, uid){ confirmSheet('"'+memberName(wsId,uid)+'"님을 그룹에서 내보낼까요? 이 그룹에 더 이상 접근할 수 없게 됩니다.', ()=>{ removeMember(wsId, uid).then(()=>openGroupManageSheet(wsId)); }); }
    function confirmLeave(wsId){
      const w=(state.memberships||[]).find(x=>x.id===wsId);
      const last=w && Object.keys(w.members||{}).length<=1;
      confirmSheet(last?'마지막 멤버예요. 나가면 이 그룹의 데이터가 모두 삭제됩니다. 계속할까요?':'이 그룹에서 나갈까요? (이 그룹 데이터에 더 이상 접근할 수 없어요)', ()=>leaveWorkspace(wsId));
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
    // 그룹 멤버 아바타 겹침 나열(최대 5, 초과 시 +N)
    function memberAvatarStack(ws, size){
      const m=(ws&&ws.members)||{}; const uids=Object.keys(m); if(!uids.length) return '';
      const max=5; let h='<div class="mstack">';
      uids.slice(0,max).forEach(uid=>{ h+='<span class="ms-av">'+avatarHtml(uid, m[uid]&&m[uid].name, size||26)+'</span>'; });
      if(uids.length>max) h+='<span class="ms-more">+'+(uids.length-max)+'</span>';
      return h+'</div>';
    }
    function openProfileSheet(){
      window._profilePhoto=undefined;   // undefined=유지 / ''=삭제 / dataURL=신규
      let h='<div style="text-align:center;margin:6px 0 16px;">'+
        '<div id="profAvatar" style="display:inline-flex;">'+avatarHtml(state.uid, state.userName, 96)+'</div>'+
        '<div style="margin-top:12px;display:flex;gap:8px;justify-content:center;">'+
          '<button class="btn sm" onclick="pickProfilePhoto()">사진 변경</button>'+
          '<button class="btn sm ghost" onclick="removeProfilePhoto()">사진 삭제</button></div>'+
        '<div class="likemini" style="justify-content:center;margin-top:10px;font-size:14px;gap:6px;" title="친구들에게 받은 좋아요">'+(typeof heartSvg==='function'?heartSvg({h:16}):'❤')+(state.myLikeCount||0)+'</div></div>';
      h+='<div class="field"><label>별명(이름)</label><input class="input" id="profName" value="'+escapeHtml(state.userName)+'" placeholder="가계부에 표시될 이름"></div>';
      h+='<div class="field"><label>계정 이메일(아이디)</label><input class="input" value="'+escapeHtml(state.userEmail||'')+'" disabled></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>프로필 공개</span><div class="switch '+(state.profilePublic!==false?'on':'')+'" id="profPublic" onclick="this.classList.toggle(\'on\')"><i></i></div></div>';
      h+='<div class="tx-sub" style="margin:2px 2px 14px;">사진은 256px로 줄여 저장돼요. <b>비공개</b>로 하면 랭킹·비친구에게 <b>은화 아이콘 + \'알뜰\'</b>로만 보여요(친구·좋아요·캠은 그대로).</div>';
      h+='<button class="btn" onclick="onSaveProfile()">저장</button>';
      h+='<button class="btn ghost" style="margin-top:8px;" onclick="openPasswordChangeSheet()">비밀번호 변경</button>';
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
      h+='<button class="btn" onclick="changePassword()">변경</button>';
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
          '<button class="btn sm" onclick="pickWsPhoto()">사진 변경</button>'+
          '<button class="btn sm ghost" onclick="removeWsPhoto()">사진 삭제</button></div></div>';
      h+='<div class="field"><label>가계부 이름</label><input class="input" id="wsName" value="'+escapeHtml(ws.name||'')+'" placeholder="예: 우리집 가계부"></div>';
      h+='<div class="tx-sub" style="margin:2px 2px 14px;">사진은 256px로 줄여 저장돼요.'+(isGroup?' 그룹 멤버 모두에게 보입니다.':'')+'</div>';
      h+='<button class="btn" onclick="onSaveWsProfile()">저장</button>';
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
    function renderMore(){
      const ws=state.wsMeta||{}; const isGroup=ws.type==='group'; const memCount=Object.keys(ws.members||{}).length;
      let h='<div class="more-wrap">';
      // 상단: 내 프로필 — 아바타 44 + 이름(flex) + 편집 chevron(우측)
      h+='<div class="prow" onclick="openProfileSheet()">'+
         avatarHtml(state.uid, state.userName, 44)+
         '<div class="pnm"><b>'+escapeHtml(state.userName||'사용자')+'</b><span>내 프로필</span></div>'+
         '<span class="likemini" title="받은 좋아요">'+(typeof heartSvg==='function'?heartSvg({h:14}):'❤')+' '+(state.myLikeCount||0)+'</span>'+
         '<span class="editk">'+MORE_ICON.chev+'</span></div>';
      // 그 아래: 현재 가계부/그룹 — 아바타 44 + 이름(flex) + 멤버 아바타 + 전환(우측)
      const wsSub = isGroup ? ('그룹 · 멤버 '+memCount+'명') : '개인 가계부';
      const canEditWs = !isGroup || isWsOwner();
      h+='<div class="grow"'+(canEditWs?' onclick="openWsProfileSheet()"':'')+'>'+
         wsAvatarHtml(ws.name, ws.photo, 44)+
         '<div class="gnm"><b>'+escapeHtml(ws.name||'가계부')+'</b><span>'+wsSub+'</span></div>'+
         (isGroup?memberAvatarStack(ws, 26):'')+
         '<button class="cnt" onclick="event.stopPropagation();openWorkspaceSheet()">전환</button></div>';
      // 4열 기능 그리드 — 할일 모드면 할일 전용, 아니면 가계부 전용(알뜰샵·설정은 공용)
      h+='<div class="grid4">';
      // 기본 메뉴 아이콘은 라인 SVG(MORE_ICON) 유지. 알뜰샵=코인·선물함=선물상자·가방=갈색 가방(픽셀 아트).
      if(state.mode==='todo'){
        h+=gcell(MORE_ICON.share,'할일 공유','openTodoShareSheet()');
        h+=gcell(MORE_ICON.report,'완료 리포트','openTodoReport()');
        h+=gcell(MORE_ICON.repeat,'반복 할일','openRepeatTodos()');
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
      }
      h+='</div>';   // 모드 전용 그리드 닫기
      // 공통(모드 무관) 아이콘 — 가운데 '공통' 라벨 구분선으로 분리
      h+='<div class="gsep"><span>공통</span></div>';
      h+='<div class="grid4">';
      h+=gcell(coinSvg({h:26}),'알뜰샵','openCatHouse()');
      h+=gcell(giftSvg({h:26}),'선물함','openGiftbox()', (typeof giftCount==='function'?giftCount():0));
      h+=gcell((typeof bagSvg==='function'?bagSvg({h:26}):''),'가방','openBag()');
      h+=gcell((typeof peopleSvg==='function'?peopleSvg({h:26}):MORE_ICON.members),'친구','openFriendsSheet()', (typeof state.friendReqs==='object'?Object.keys(state.friendReqs||{}).length:0)||0);
      h+=gcell(MORE_ICON.gear,'설정','openSettingsSheet()');
      if(typeof isDev==='function' && isDev()) h+=gcell((typeof rainbowEggSvg==='function'?rainbowEggSvg({h:26}):MORE_ICON.gear),'개발자','openDevModeSheet()');
      h+='</div>';
      // 하단 고정: 로그아웃(가운데) → 홈 화면 설치 링크 → 버전
      h+='<div class="more-foot">';
      h+='<button class="btn ghost sm" onclick="logout()">로그아웃</button>';
      // 설치 안 됐으면 항상 노출(iOS 사파리 포함) — 탭 시 크롬=네이티브 프롬프트, iOS/그외=수동 안내 시트
      if(canInstallApp()) h+='<button class="install-cta" onclick="installApp()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 11l4 4 4-4"/><path d="M5 21h14"/></svg>홈 화면에 앱 설치</button>';
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
        steps+'<button class="btn" onclick="closeSheet()" style="margin-top:16px;">확인</button>';
      openSheet('앱 설치', h);
    }
    // 설정 시트 — 더보기 하단 설정 항목 모음 + 코드 입력
    function openSettingsSheet(){
      const ws=state.wsMeta||{}, isGroup=ws.type==='group', memCount=Object.keys(ws.members||{}).length;
      let h='<div class="lst">';
      if(isGroup) h+=lrow(MORE_ICON.members,'멤버 · 권한 관리',"openGroupManageSheet('"+state.wsId+"')", memCount+'명');
      h+=lrow(MORE_ICON.download,'CSV 내보내기','exportCSV()');
      h+=lrow(MORE_ICON.moon,'다크 모드','toggleTheme();openSettingsSheet()', state.theme==='dark'?'켜짐':'꺼짐');
      h+=lrow(MORE_ICON.cam,'펫캠','toggleDockHidden();openSettingsSheet()', (typeof dockHiddenLabel==='function'?dockHiddenLabel():''));
      h+='</div>';
      // 코드 입력(프로모/치트 코드)
      h+='<div class="sec-title" style="margin-top:22px;">코드 입력</div>';
      h+='<div class="card" style="padding:14px;"><div class="row" style="gap:8px;">'+
         '<input class="input" id="promoCode" placeholder="코드를 입력하세요" autocomplete="off" autocapitalize="off" spellcheck="false" style="flex:1;" onkeydown="if(event.key===\'Enter\'){event.preventDefault();submitPromoCode();}">'+
         '<button class="btn sm" style="flex:none;" onclick="submitPromoCode()">확인</button></div></div>';
      openSheet('설정', h);
    }
    function submitPromoCode(){ const el=$('promoCode'); if(!el) return; redeemCode(el.value); el.value=''; }
    // 개발자 모드 시트 — 더보기 그리드의 무지개알 타일에서 진입(개발자 이메일 전용). 토글 + 하위 기능.
    function openDevModeSheet(){
      if(!(typeof isDev==='function' && isDev())){ toast('개발자 전용'); return; }
      let h='<div class="lst">';
      h+=lrow(MORE_ICON.gear,'개발자 모드','toggleDevMode();openDevModeSheet()', devOn()?'켜짐':'꺼짐');
      if(devOn()){
        h+=lrow(MORE_ICON.gift,'펫알 · 박스 설정','closeSheet();openDevGacha()');
        h+=lrow((typeof goldSvg==='function'?goldSvg({h:21}):MORE_ICON.cat),'펫 (추가 · 수정 · 삭제)','closeSheet();openDevPetManager()');
      }
      h+='</div>';
      openSheet('개발자 모드', h);
    }

    // ===== 예산 =====
    const PERIOD_LABEL={ weekly:'주간', monthly:'월간', yearly:'연간', custom:'사용자지정' };
    function budgetTitle(b){ return b.categoryName? escapeHtml(b.categoryName) : '총예산'; }
    // 예산용 작은 라인 아이콘 타일(카테고리=tint, 총예산=중립 지갑)
    function budgetTile(b){ return b.categoryName? catTileMini(b.categoryName) : '<span class="mtile" style="background:var(--soft);color:var(--text);">'+svgWrap(CAT_SVG.wallet)+'</span>'; }
    function openBudgetSheet(){
      const list=visibleBudgets().slice().sort((a,b)=>(a.categoryName?1:0)-(b.categoryName?1:0));
      let h='<button class="btn" onclick="openBudgetEdit()">+ 예산 추가</button><div style="margin-top:12px;">';
      if(!list.length) h+='<div class="empty">설정된 예산이 없습니다</div>';
      list.forEach(b=>{ const u=budgetUsage(b), c=budgetColor(u.pct);
        h+='<div class="card"><div class="row" onclick="openBudgetEdit(\''+b.id+'\')"><div style="display:flex;align-items:center;gap:11px;flex:1;min-width:0;">'+budgetTile(b)+'<b style="min-width:0;">'+budgetTitle(b)+' <span class="pill">'+(PERIOD_LABEL[b.periodType]||b.periodType)+'</span>'+(b.scope==='personal'?'<span class="pill">개인</span>':'')+'</b></div><span style="color:'+c+';font-weight:800;flex:none;">'+u.pct+'%'+(u.pct>=100?' 초과':'')+'</span></div>'+
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
        expCats.map(c=>'<option value="'+escapeHtml(c.name)+'"'+((b&&b.categoryName===c.name)?' selected':'')+'>'+escapeHtml(c.name)+'</option>').join('')+'</select></div>';
      h+='<div class="field"><label>예산 금액</label><input class="input" id="bgAmount" inputmode="numeric" value="'+(b?Number(b.amount).toLocaleString():'')+'" placeholder="0" oninput="this.value=fmtComma(this.value)"></div>';
      h+='<div class="form-2"><div class="field"><label>기간</label><select class="input" id="bgPeriod" onchange="onBudgetPeriodChange()">'+
        ['weekly','monthly','yearly','custom'].map(p=>'<option value="'+p+'"'+(((b&&b.periodType===p)||(!b&&p==='monthly'))?' selected':'')+'>'+PERIOD_LABEL[p]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>범위</label><select class="input" id="bgScope">'+
        [['group','그룹'],['personal','개인']].map(p=>'<option value="'+p[0]+'"'+(((b&&b.scope===p[0])||(!b&&p[0]==='group'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div></div>';
      h+='<div id="bgCustom" style="'+(b&&b.periodType==='custom'?'':'display:none;')+'"><div class="form-2"><div class="field"><label>시작일</label><input type="date" class="input" id="bgStart" value="'+(b&&b.startDate?b.startDate:todayStr())+'"></div>'+
        '<div class="field"><label>종료일</label><input type="date" class="input" id="bgEnd" value="'+(b&&b.endDate?b.endDate:todayStr())+'"></div></div></div>';
      h+='<div class="form-2"><div class="field"><label>경고 기준</label><select class="input" id="bgAlert">'+
        [80,90,100].map(n=>'<option value="'+n+'"'+(((b&&b.alertThreshold===n)||(!b&&n===80))?' selected':'')+'>'+n+'%</option>').join('')+'</select></div>'+
        '<div class="field"><label>공개 범위</label><select class="input" id="bgVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((b&&b.visibility===p[0])||(!b&&p[0]===defaultVisibility()))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div></div>';
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
        owner: b?(b.owner||(scope==='personal'||vis==='private'?state.userName:defaultOwnerName())):(scope==='personal'||vis==='private'?state.userName:defaultOwnerName()),
        purposeBookId: b?(b.purposeBookId||null):null,
        createdAt: b?(b.createdAt||now):now, updatedAt:now };
      const key=id||('bg_'+Date.now());
      db.ref(wp('budgets/'+key)).set(data); toast(b?'수정되었습니다':'추가되었습니다'); openBudgetSheet();
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
        let h='<div class="chip-row" style="margin-bottom:12px;">'+filters.map(f=>'<button class="chip '+(catFilter===f[0]?'on':'')+'" onclick="setCatFilter(\''+f[0]+'\')">'+f[1]+'</button>').join('')+'</div>';
        h+='<button class="btn" onclick="openCatEdit()">+ 카테고리 추가</button>';
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
    function pickCatColor(el){ window._catColor=el.dataset.color; document.querySelectorAll('#catColors .swatch').forEach(b=>b.classList.remove('on')); el.classList.add('on'); }
    function pickCatIcon(el){ window._catIcon=el.dataset.key; document.querySelectorAll('#catIcons .icon-tile').forEach(b=>b.classList.remove('on')); el.classList.add('on'); }
    function openCatEdit(name){
      const c=name?getCat(name):null;
      const usedCount=name? state.transactions.filter(t=>t.category===name).length : 0;
      const canRename = !!c && usedCount===0;
      window._catColor = c?(c.color||CAT_PALETTE[0]):CAT_PALETTE[0];
      window._catIcon = (c && c.iconKey && CAT_SVG[c.iconKey]) ? c.iconKey : ((c && CAT_META[c.name]) ? CAT_META[c.name].i : 'tag');
      let h='';
      if(c && !canRename) h+='<div class="field"><label>이름</label><input class="input" value="'+escapeHtml(c.name)+'" disabled><div class="tx-sub" style="margin-top:4px;">거래에 사용 중이라 이름 변경 불가(비활성화 권장)</div></div>';
      else h+='<div class="field"><label>이름</label><input class="input" id="catName" value="'+escapeHtml(c?c.name:'')+'" placeholder="예: 반려동물"></div>';
      h+='<div class="field"><label>유형</label><select class="input" id="catType">'+CAT_TYPES.map(p=>'<option value="'+p[0]+'"'+(((c&&c.type===p[0])||(!c&&p[0]==='expense'))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>';
      h+='<label style="font-size:13px;font-weight:600;color:var(--sub);">아이콘</label><div class="icon-grid" id="catIcons">'+Object.keys(CAT_SVG).map(k=>'<button type="button" class="icon-tile'+(k===window._catIcon?' on':'')+'" data-key="'+k+'" onclick="pickCatIcon(this)">'+svgWrap(CAT_SVG[k])+'</button>').join('')+'</div>';
      h+='<label style="font-size:13px;font-weight:600;color:var(--sub);">색상</label><div class="swatch-grid" id="catColors">'+CAT_PALETTE.map(p=>'<button type="button" class="swatch'+(p===window._catColor?' on':'')+'" data-color="'+p+'" style="background:'+p+';" onclick="pickCatColor(this)"></button>').join('')+'</div>';
      h+='<div class="form-2"><div class="field"><label>공개 범위</label><select class="input" id="catVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((c&&c.visibility===p[0])||(!c&&p[0]===defaultVisibility()))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>활성</label><select class="input" id="catActive"><option value="1"'+((!c||c.isActive!==false)?' selected':'')+'>활성</option><option value="0"'+((c&&c.isActive===false)?' selected':'')+'>비활성</option></select></div></div>';
      h+='<div class="field"><label>메모 (선택)</label><input class="input" id="catMemo" value="'+escapeHtml(c?(c.memo||''):'')+'" placeholder="메모"></div>';
      h+='<button class="btn" onclick="saveCat('+(name?'\''+escapeHtml(name)+'\'':'null')+','+canRename+')">'+(c?'수정':'추가')+'</button>';
      if(c) h+='<button class="btn danger" style="margin-top:8px;" onclick="deleteCat(\''+escapeHtml(name)+'\')">삭제</button>';
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
      let h='<button class="btn" onclick="openRecurringEdit()">+ 정기거래 추가</button>';
      const rules=state.recurring.filter(canSee).slice().sort((a,b)=>{ const na=nextRunOf(a),nb=nextRunOf(b); return (na?na.getTime():9e15)-(nb?nb.getTime():9e15); });
      if(!rules.length) h+='<div class="empty">등록된 정기거래가 없습니다</div>';
      rules.forEach(r=>{
        const st=ruleStatus(r), nr=nextRunOf(r);
        const stBadge = st==='active'?'':'<span class="pill">'+(st==='paused'?'일시정지':'종료')+'</span>';
        const cls = (r.type==='income'||r.type==='refund'||r.type==='point_earn')?'green':(r.type==='prepaid_charge'?'blue':'red');
        const rTile = r.category? catTileMini(r.category) : '<span class="mtile" style="background:var(--soft);color:var(--text);">'+svgWrap(CAT_SVG[TX_SVG_KEY[r.type]||'sub'])+'</span>';
        h+='<div class="card" style="opacity:'+(st==='active'?'1':'.6')+';"><div class="row" onclick="openRecurringEdit(\''+r.ownerUid+'\',\''+r.id+'\')"><div style="display:flex;align-items:center;gap:11px;flex:1;min-width:0;">'+rTile+'<b style="min-width:0;">'+escapeHtml(r.desc||'정기')+stBadge+'</b></div><span class="'+cls+'" style="font-weight:800;flex:none;">'+won(r.amount)+'</span></div>'+
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
      h+='<div class="field"><label>공개 범위</label><select class="input" id="rVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((r&&r.visibility===p[0])||(!r&&p[0]===defaultVisibility()))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>';
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
    function recConsumerField(sel){ return '<div class="field"><label>소비 대상</label><select class="input" id="rConsumer">'+ownerOptions(sel||'공동')+'</select></div>'; }
    function recCatField(wantType, sel){
      const cats=state.categories.filter(c=>c.isActive!==false && (c.type===wantType||c.type==='other')).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
      return '<div class="field"><label>카테고리</label><select class="input" id="rCat" onchange="renderRecCardPerf()">'+cats.map(c=>'<option value="'+escapeHtml(c.name)+'"'+(c.name===sel?' selected':'')+'>'+escapeHtml(c.name)+'</option>').join('')+'</select></div>';
    }
    function renderRecAccts(){
      const r=window._recEdit, t=val('rType');
      const fromV=r?(r.from||''):(state.accounts[0]?state.accounts[0].id:''), toV=r?(r.to||''):(state.accounts[1]?state.accounts[1].id:(state.accounts[0]?state.accounts[0].id:'')), catV=r?(r.category||''):'';
      const consV=r?(r.user||state.userName||'공동'):(state.userName||'공동');
      let h='';
      if(t==='expense'){ h+=recAcctField('출금/결제 수단','rFrom',fromV)+recConsumerField(consV)+recCatField('expense',catV); }
      else if(t==='income'){ h+=recAcctField('입금 대상','rTo',toV)+recCatField('income',catV); }
      else if(t==='refund'){ h+=recAcctField('환불 받는 계정','rTo',toV)+recCatField('income',catV); }
      else if(t==='point_earn'){ h+=recAcctField('적립 포인트 계정','rTo',toV); }
      else if(t==='transfer'||t==='prepaid_charge'){ const l1=t==='prepaid_charge'?'충전 수단(카드/계좌)':'출금', l2=t==='prepaid_charge'?'충전 대상(선불/포인트)':'입금'; h+='<div class="form-2">'+recAcctField(l1,'rFrom',fromV)+recAcctField(l2,'rTo',toV)+'</div>'; }
      else if(t==='prepaid_spend'||t==='point_spend'){ h+=recAcctField(t==='point_spend'?'사용 포인트 계정':'결제 선불수단','rFrom',fromV)+recConsumerField(consV)+(catTypeFor(t)?recCatField('expense',catV):''); }
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
        user: $('rConsumer')?(val('rConsumer')||state.userName):(r?(r.user||state.userName):state.userName),
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
        '<div class="field"><label>카테고리</label><select class="input" id="subCat">'+cats.map(c=>'<option value="'+escapeHtml(c.name)+'"'+(((s&&s.categoryName===c.name)||(!s&&c.name==='구독'))?' selected':'')+'>'+escapeHtml(c.name)+'</option>').join('')+'</select></div></div>';
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
      h+='<div class="field"><label>공개 범위</label><select class="input" id="subVis">'+VISIBILITY.map(p=>'<option value="'+p[0]+'"'+(((s&&s.visibility===p[0])||(!s&&p[0]===defaultVisibility()))?' selected':'')+'>'+p[1]+'</option>').join('')+'</select></div>';
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
        owner: s?(s.owner||(vis==='private'?state.userName:defaultOwnerName())):(vis==='private'?state.userName:defaultOwnerName()),
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
      h+=rows.map(({p,s})=>'<div class="card" onclick="openPbDetail(\''+p.id+'\',\'settle\')"><div class="row"><b>'+(p.icon||'📒')+' '+escapeHtml(p.name)+'</b>'+pbSettleBadge(p)+'</div>'+
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
      return '<div class="card" onclick="openPbDetail(\''+p.id+'\')"><div class="row"><b><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:'+(p.themeColor||'#3182f6')+';margin-right:6px;"></span>'+(p.icon||'📒')+' '+escapeHtml(p.name)+' '+stBadge+'</b><span class="pill">'+pbTypeText(p)+'</span></div>'+
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
        h+='<div class="chip-row">'+[['tx','거래'],['settle','정산']].map(o=>'<button class="chip '+(pbDetailTab===o[0]?'on':'')+'" onclick="setPbDetailTab(\''+p.id+'\',\''+o[0]+'\')">'+o[1]+'</button>').join('')+'</div>';
      }
      h+= (settleOn && pbDetailTab==='settle') ? renderPbSettleTab(p) : renderPbTxTab(p,u);
      if(pbDetailTab!=='settle') h+=pbTodoSummaryHtml(p.id);   // 연결된 할일(여행 준비물 등)
      h+='<button class="btn ghost" onclick="openPbEdit(\''+p.id+'\')">설정 수정</button>';
      openSheet(p.name, h);
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
      h+='<div class="chip-row">'+['active','completed','archived'].map(st=>'<button class="chip '+((p.status||'active')===st?'on':'')+'" onclick="setPbStatus(\''+p.id+'\',\''+st+'\')">'+PB_STATUS_LABEL[st]+'</button>').join('')+'</div>';
      h+='<button class="btn" onclick="openTxSheet(null,null,null,\''+p.id+'\')">+ 이 가계부에 지출 추가</button>';
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
          '<span style="display:flex;align-items:center;gap:8px;"><b>'+won(g.amount)+'</b><button class="chip" onclick="openSettlePay(\''+p.id+'\','+i+')">완료</button></span></div>').join('')+'</div>';
      } else {
        h+='<div class="card"><div class="empty">'+(s.neededAmount>0?'모든 정산이 완료되었습니다 🎉':'정산할 송금이 없습니다')+'</div></div>';
      }
      if(s.payments.length){
        h+='<div class="sec-title" style="margin-left:2px;">완료 내역</div>';
        h+='<div class="card" style="padding:6px 10px;">'+s.payments.slice().sort((a,b)=>(b.paymentDate||'').localeCompare(a.paymentDate||'')).map(x=>
          '<div class="row" style="padding:8px 2px;"><span>'+escapeHtml(x.fromPerson)+' → '+escapeHtml(x.toPerson)+' <span class="tx-sub">'+(x.paymentDate||'')+(x.memo?(' · '+escapeHtml(x.memo)):'')+'</span></span>'+
          '<span style="display:flex;align-items:center;gap:8px;"><b>'+won(x.amount)+'</b><button class="chip" onclick="cancelSettlementPayment(\''+x.ownerUid+'\',\''+x.id+'\',\''+p.id+'\')">취소</button></span></div>').join('')+'</div>';
      }
      h+='<div class="sec-title" style="margin-left:2px;">정산 대상 거래 ('+s.txCount+')</div>';
      h+='<div class="card" style="padding:6px 10px;">'+(s.txs.length?s.txs.slice().sort((a,b)=>new Date(b.date)-new Date(a.date)).map(txRowHtml).join(''):'<div class="empty">정산 포함 거래 없음</div>')+'</div>';
      h+='<button class="btn" onclick="openTxSheet(null,null,null,\''+p.id+'\')">+ 이 가계부에 지출 추가</button>';
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
      h+='<button class="btn" onclick="saveSettlementPayment()">완료 처리</button>';
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
          db.ref(wp('transactions/'+state.uid+'/'+txId)).set({ type:'transfer', date:date+'T00:00:00.000Z', user:state.userName,
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
      h+='<div class="form-2"><div class="field"><label>기준 통화</label><select class="input" id="pbCurrency">'+curOptions(p?(p.baseCurrency||'KRW'):'KRW')+'</select></div>'+
        '<div class="field"><label>커버 이미지 URL</label><input class="input" id="pbCover" value="'+escapeHtml(p?(p.coverImageUrl||''):'')+'" placeholder="https://"></div></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>정산 사용</span><div class="switch '+((p&&p.settlementEnabled)?'on':'')+'" id="pbSettle" onclick="this.classList.toggle(\'on\')"><i></i></div></div>';
      h+='<div class="field"><label>공개 범위</label><select class="input" id="pbVis">'+VISIBILITY.map(v=>'<option value="'+v[0]+'"'+(((p&&p.visibility===v[0])||(!p&&v[0]===defaultVisibility()))?' selected':'')+'>'+v[1]+'</option>').join('')+'</select></div>';
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
        owner: p?(p.owner||(vis==='private'?state.userName:defaultOwnerName())):(vis==='private'?state.userName:defaultOwnerName()),
        memo:val('pbMemo').trim(), createdAt: p?(p.createdAt||now):now, updatedAt:now };
      const key=id||('pb_'+Date.now());
      db.ref(wp('purposeBooks/'+key)).set(data); toast(p?'수정되었습니다':'추가되었습니다'); openPurposeBooks();
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
      h+='<div class="chip-row">'+[['log','기록'],['planned','예정'],['people','인맥']].map(o=>'<button class="chip '+(giftTab===o[0]?'on':'')+'" onclick="setGiftTab(\''+o[0]+'\')">'+o[1]+'</button>').join('')+'</div>';
      h+= giftTab==='planned'?renderGiftPlanned() : (giftTab==='people'?renderGiftPeople() : renderGiftLog());
      openSheet('경조사비', h);
    }
    function giftRow(g){
      const given=g.direction!=='received', sign=given?'-':'+', cls=given?'red':'green';
      return '<div class="tx" onclick="openGiftEdit(\''+g.id+'\')">'+
        '<div class="tx-ic">'+giftSvgIcon(g.eventType)+'</div>'+
        '<div class="tx-main"><div class="tx-title">'+escapeHtml(g.personName||'')+' <span class="pill">'+(GIFT_EVENT_LABEL[g.eventType]||g.eventType||'')+'</span>'+(g.linkedTransactionId?'<span class="pill">🧾</span>':'')+'</div>'+
        '<div class="tx-sub">'+(g.date||'')+' · '+(GIFT_DIR_LABEL[g.direction]||'')+(g.relation?(' · '+(REL_LABEL[g.relation]||g.relation)):'')+'</div></div>'+
        '<div class="tx-amt '+cls+'">'+sign+'₩'+Math.abs(Number(g.amount)||0).toLocaleString()+'</div></div>';
    }
    function renderGiftLog(){
      const list=visibleGifts().slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
      let h='<button class="btn" onclick="openGiftEdit()">+ 경조사비 기록 추가</button>';
      h+='<div class="card" style="padding:6px 10px;">'+(list.length?list.map(giftRow).join(''):'<div class="empty">기록이 없습니다</div>')+'</div>';
      return h;
    }
    function renderGiftPlanned(){
      const list=state.plannedGiftEvents.filter(canSee).slice().sort((a,b)=>(a.date||'').localeCompare(b.date||''));
      let h='<button class="btn" onclick="openPlannedEdit()">+ 경조사 예정 추가</button>';
      if(!list.length) return h+'<div class="card"><div class="empty">예정된 경조사가 없습니다</div></div>';
      h+='<div class="card" style="padding:6px 10px;">'+list.map(pl=>{
        const st=pl.status||'planned';
        return '<div class="tx"><div class="tx-ic">'+giftSvgIcon(pl.eventType)+'</div>'+
          '<div class="tx-main" onclick="openPlannedEdit(\''+pl.id+'\')"><div class="tx-title">'+escapeHtml(pl.personName||'')+' <span class="pill">'+(GIFT_EVENT_LABEL[pl.eventType]||pl.eventType||'')+'</span> <span class="pill">'+(PLANNED_STATUS_LABEL[st]||st)+'</span></div>'+
          '<div class="tx-sub">'+(pl.date||'')+(pl.expectedAmount?(' · 예상 '+won(pl.expectedAmount)):'')+'</div></div>'+
          (st==='planned'?'<button class="chip" onclick="completePlanned(\''+pl.id+'\')">완료</button>':'')+'</div>';
      }).join('')+'</div>';
      return h;
    }
    function renderGiftPeople(){
      const list=state.people.filter(canSee).slice().sort((a,b)=>(a.name||'').localeCompare(b.name||''));
      let h='<button class="btn" onclick="openPersonEdit()">+ 인맥 추가</button>';
      if(!list.length) return h+'<div class="card"><div class="empty">등록된 인맥이 없습니다</div></div>';
      h+='<div class="card" style="padding:6px 10px;">'+list.map(p=>{
        const t=personGiftTotals(p.id,p.name);
        return '<div class="tx" onclick="openPersonEdit(\''+p.id+'\')"><div class="tx-ic">'+svgWrap(CAT_SVG.user)+'</div>'+
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
        [['given','줌(지출)'],['received','받음(수입)']].map(o=>'<button class="'+(dir===o[0]?'on':'')+'" onclick="setGiftDir(\''+o[0]+'\')">'+o[1]+'</button>').join('')+'</div>';
      h+='<div class="amount-wrap"><span class="cur">₩</span><input class="amount-input" id="gAmount" inputmode="numeric" placeholder="0" value="'+(amount?Number(amount).toLocaleString():'')+'" oninput="this.value=fmtComma(this.value)"></div>';
      h+='<div class="field"><label>상대(이름)</label><input class="input" id="gPerson" list="gPeopleList" value="'+escapeHtml(pname)+'" placeholder="예: 홍길동"><datalist id="gPeopleList">'+names.map(n=>'<option value="'+escapeHtml(n)+'"></option>').join('')+'</datalist></div>';
      h+='<div class="form-2"><div class="field"><label>관계</label><select class="input" id="gRel">'+REL_TYPES.map(r=>'<option value="'+r[0]+'"'+((g&&g.relation===r[0])?' selected':'')+'>'+r[1]+'</option>').join('')+'</select></div>'+
        '<div class="field"><label>경조사 유형</label><select class="input" id="gType">'+GIFT_EVENT_TYPES.map(e=>'<option value="'+e[0]+'"'+((etype===e[0])?' selected':'')+'>'+e[1]+'</option>').join('')+'</select></div></div>';
      h+='<div class="field"><label>날짜</label><input type="date" class="input" id="gDate" value="'+(g&&g.date?g.date:(pf&&pf.date?pf.date:todayStr()))+'"></div>';
      const txOn = g? !!g.linkedTransactionId : true;
      h+='<div class="menu-item" style="padding:8px 2px;"><span>🧾 가계부 거래로도 기록</span><div class="switch '+(txOn?'on':'')+'" id="gTx" onclick="this.classList.toggle(\'on\');toggleGiftAcct()"><i></i></div></div>';
      h+='<div id="gAcctWrap" style="'+(txOn?'':'display:none;')+'"><div class="field"><label>계좌(거래 기록 시)</label><select class="input" id="gAcct">'+acctOptsHtml((g&&g.linkedAccount)||(state.accounts[0]?state.accounts[0].id:''))+'</select></div></div>';
      h+='<details class="adv"><summary>상세 설정</summary>';
      h+='<div class="field"><label>메모</label><input class="input" id="gMemo" value="'+escapeHtml(g?(g.memo||''):'')+'" placeholder="메모"></div>';
      h+='<div class="field"><label>공개 범위</label><select class="input" id="gVis">'+VISIBILITY.map(v=>'<option value="'+v[0]+'"'+(((g&&g.visibility===v[0])||(!g&&v[0]===defaultVisibility()))?' selected':'')+'>'+v[1]+'</option>').join('')+'</select></div>';
      h+='</details>';
      h+='<button class="btn" onclick="saveGiftEvent('+(id?'\''+id+'\'':'null')+')">'+(g?'수정':'저장')+'</button>';
      if(g) h+='<button class="btn danger" style="margin-top:8px;" onclick="deleteGiftEvent(\''+id+'\')">삭제</button>';
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
        const given=dir!=='received', iso=new Date(date+'T'+new Date().toTimeString().slice(0,8)).toISOString();
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
      h+='<button class="btn" onclick="savePlanned('+(id?'\''+id+'\'':'null')+')">'+(pl?'수정':'추가')+'</button>';
      if(pl) h+='<button class="btn danger" style="margin-top:8px;" onclick="deletePlanned(\''+id+'\')">삭제</button>';
      openSheet(pl?'경조사 예정 수정':'경조사 예정 추가', h);
    }
    function savePlanned(id){
      const personName=val('plPerson').trim(); if(!personName){ toast('상대 이름을 입력하세요', true); return; }
      const now=new Date().toISOString(), pl=id?state.plannedGiftEvents.find(x=>x.id===id):null;
      const data={ personName, eventType:val('plType'), expectedAmount:parseAmount(val('plAmount')), date:val('plDate')||todayStr(),
        memo:val('plMemo').trim(), status:($('plStatus')?val('plStatus'):(pl?(pl.status||'planned'):'planned')),
        createdAt: pl?(pl.createdAt||now):now, updatedAt:now };
      const key=id||('plan_'+Date.now());
      db.ref(wp('plannedGiftEvents/'+key)).set(data); toast(pl?'수정되었습니다':'추가되었습니다'); openGiftBook('planned');
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
      h+='<button class="btn" onclick="savePerson('+(id?'\''+id+'\'':'null')+')">'+(p?'수정':'추가')+'</button>';
      if(p) h+='<button class="btn danger" style="margin-top:8px;" onclick="deletePerson(\''+id+'\')">삭제</button>';
      openSheet(p?'인맥 수정':'인맥 추가', h);
    }
    function savePerson(id){
      const name=val('perName').trim(); if(!name){ toast('이름을 입력하세요', true); return; }
      const now=new Date().toISOString(), p=id?state.people.find(x=>x.id===id):null;
      const data={ name, relation:val('perRel'), memo:val('perMemo').trim(), createdAt:p?(p.createdAt||now):now, updatedAt:now };
      const key=id||('per_'+Date.now());
      db.ref(wp('people/'+key)).set(data); toast(p?'수정되었습니다':'추가되었습니다'); openGiftBook('people');
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
      h+='<button class="btn" onclick="openLoanEdit()">+ 대출 추가</button>';
      h+='<div style="margin-top:12px;">'+(list.length?list.map(loanCard).join(''):'<div class="empty">등록된 대출이 없습니다</div>')+'</div>';
      openSheet('대출 / 이자', h);
    }
    function loanCard(l){
      const c=loanCalc(l), pct=c.principal?Math.min(100,Math.round(c.paidPrincipal/c.principal*100)):0;
      const dirBadge='<span class="pill">'+(LOAN_DIR_LABEL[l.direction]||l.direction)+'</span>';
      const stBadge=c.status!=='active'?'<span class="pill">'+(LOAN_STATUS_LABEL[c.status]||c.status)+'</span>':'';
      const col=l.direction==='lent'?'var(--income)':'var(--expense)';
      return '<div class="card" onclick="openLoanDetail(\''+l.id+'\')"><div class="row"><b>🏦 '+escapeHtml(l.name||'대출')+' '+stBadge+'</b>'+dirBadge+'</div>'+
        '<div class="tx-sub" style="margin-top:6px;">'+escapeHtml(l.counterparty||'')+(l.interestRate?(' · 연 '+l.interestRate+'%'):'')+(l.dueDate?(' · 만기 '+l.dueDate):'')+'</div>'+
        '<div class="bar" style="margin-top:8px;"><i style="width:'+pct+'%;background:'+col+'"></i></div>'+
        '<div class="row" style="margin-top:6px;"><span class="tx-sub">잔액 '+won(c.balance)+' / '+won(c.principal)+'</span><span class="tx-sub" style="color:'+col+'">'+pct+'% 상환</span></div></div>';
    }
    function openLoanDetail(id){
      const l=state.loans.find(x=>x.id===id); if(!l) return;
      const c=loanCalc(l);
      let h='<div class="card"><div class="row"><b style="font-size:18px;">🏦 '+escapeHtml(l.name||'대출')+'</b><span class="pill">'+(LOAN_DIR_LABEL[l.direction]||l.direction)+'</span></div>'+
        '<div class="tx-sub" style="margin-top:6px;">'+escapeHtml(l.counterparty||'')+(l.startDate?(' · '+l.startDate):'')+(l.dueDate?(' ~ '+l.dueDate):'')+'</div>'+
        '<div class="summary" style="margin-top:12px;">'+
          '<div><div class="s-label">잔액</div><div class="s-val">'+won(c.balance)+'</div></div>'+
          '<div><div class="s-label">원금</div><div class="s-val">'+won(c.principal)+'</div></div>'+
          '<div><div class="s-label">누적 이자</div><div class="s-val">'+won(c.paidInterest)+'</div></div></div>'+
        (l.interestRate?('<div class="tx-sub" style="margin-top:8px;">연 '+l.interestRate+'% · 월 예상 이자 약 '+won(c.monthlyInterest)+' (잔액 기준 단리)</div>'):'')+'</div>';
      h+='<div class="chip-row">'+['active','paid','overdue'].map(st=>'<button class="chip '+((l.status||'active')===st?'on':'')+'" onclick="setLoanStatus(\''+l.id+'\',\''+st+'\')">'+LOAN_STATUS_LABEL[st]+'</button>').join('')+'</div>';
      h+='<button class="btn" onclick="openLoanPayment(\''+l.id+'\')">+ 상환 기록</button>';
      h+='<div class="sec-title" style="margin-left:2px;">상환 내역 ('+c.payments.length+')</div>';
      const ps=c.payments.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''));
      h+='<div class="card" style="padding:6px 10px;">'+(ps.length?ps.map(p=>loanPaymentRow(l,p)).join(''):'<div class="empty">상환 기록 없음</div>')+'</div>';
      h+='<button class="btn ghost" onclick="openLoanEdit(\''+l.id+'\')">설정 수정</button>';
      openSheet(l.name||'대출', h);
    }
    function loanPaymentRow(l,p){
      const tot=(Number(p.principalAmount)||0)+(Number(p.interestAmount)||0);
      return '<div class="tx" onclick="openLoanPayment(\''+l.id+'\',\''+p.id+'\')"><div class="tx-ic">'+svgWrap(CAT_SVG.coin)+'</div>'+
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
        [['borrowed','빌림(대출)'],['lent','빌려줌']].map(o=>'<button class="'+(dir===o[0]?'on':'')+'" onclick="setLoanDir(\''+o[0]+'\')">'+o[1]+'</button>').join('')+'</div>';
      h+='<div class="field"><label>이름</label><input class="input" id="lName" value="'+escapeHtml(l?l.name:'')+'" placeholder="예: 주택담보대출, 친구 빌려줌"></div>';
      h+='<div class="field"><label>상대/기관</label><input class="input" id="lParty" value="'+escapeHtml(l?(l.counterparty||''):'')+'" placeholder="예: ○○은행, 홍길동"></div>';
      h+='<div class="form-2"><div class="field"><label>원금</label><input class="input" id="lPrincipal" inputmode="numeric" value="'+(l&&l.principal?Number(l.principal).toLocaleString():'')+'" placeholder="0" oninput="this.value=fmtComma(this.value)"></div>'+
        '<div class="field"><label>연이율(%)</label><input class="input" id="lRate" inputmode="decimal" value="'+(l&&l.interestRate!=null?l.interestRate:'')+'" placeholder="예: 4.5"></div></div>';
      h+='<div class="form-2"><div class="field"><label>시작일</label><input type="date" class="input" id="lStart" value="'+(l&&l.startDate?l.startDate:todayStr())+'"></div>'+
        '<div class="field"><label>만기일(선택)</label><input type="date" class="input" id="lDue" value="'+(l&&l.dueDate?l.dueDate:'')+'"></div></div>';
      h+='<details class="adv"><summary>상세 설정</summary>';
      h+='<div class="field"><label>기본 상환 계좌</label><select class="input" id="lAcct">'+acctOptsHtml((l&&l.account)||(state.accounts[0]?state.accounts[0].id:''))+'</select></div>';
      h+='<div class="field"><label>메모</label><input class="input" id="lMemo" value="'+escapeHtml(l?(l.memo||''):'')+'" placeholder="메모"></div>';
      h+='<div class="field"><label>공개 범위</label><select class="input" id="lVis">'+VISIBILITY.map(v=>'<option value="'+v[0]+'"'+(((l&&l.visibility===v[0])||(!l&&v[0]===defaultVisibility()))?' selected':'')+'>'+v[1]+'</option>').join('')+'</select></div>';
      h+='</details>';
      h+='<button class="btn" onclick="saveLoan('+(id?'\''+id+'\'':'null')+')">'+(l?'수정':'추가')+'</button>';
      if(l) h+='<button class="btn danger" style="margin-top:8px;" onclick="deleteLoan(\''+id+'\')">삭제</button>';
      openSheet(l?'대출 수정':'대출 추가', h);
    }
    function setLoanDir(d){ window._loanDir=d; const seg=$('lDirSeg'); if(seg){ [...seg.children].forEach((b,i)=>b.classList.toggle('on', (d==='borrowed'?0:1)===i)); } }
    function saveLoan(id){
      const name=val('lName').trim(); if(!name){ toast('이름을 입력하세요', true); return; }
      const principal=parseAmount(val('lPrincipal')); if(!principal){ toast('원금을 입력하세요', true); return; }
      const l=id?state.loans.find(x=>x.id===id):null, now=new Date().toISOString(), vis=val('lVis')||'full';
      const data={ name, direction:window._loanDir||'borrowed', counterparty:val('lParty').trim(),
        principal, interestRate:parseFloat(val('lRate'))||0, startDate:val('lStart')||todayStr(), dueDate:val('lDue')||null,
        account: $('lAcct')?val('lAcct'):'', memo:val('lMemo').trim(), status:l?(l.status||'active'):'active',
        visibility:vis, owner:l?(l.owner||state.userName):state.userName, createdAt:l?(l.createdAt||now):now, updatedAt:now };
      const key=id||('loan_'+Date.now());
      db.ref(wp('loans/'+key)).set(data); toast(l?'수정되었습니다':'추가되었습니다'); openLoanBook();
    }
    function deleteLoan(id){
      confirmSheet('이 대출을 삭제할까요? (상환 기록도 함께 삭제됩니다)', ()=>{
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
      h+='<div class="form-2"><div class="field"><label>원금 상환</label><input class="input" id="lpPrincipal" inputmode="numeric" value="'+(p&&p.principalAmount?Number(p.principalAmount).toLocaleString():'')+'" placeholder="0" oninput="this.value=fmtComma(this.value)"></div>'+
        '<div class="field"><label>'+interestLabel+'</label><input class="input" id="lpInterest" inputmode="numeric" value="'+(p&&p.interestAmount?Number(p.interestAmount).toLocaleString():(c.monthlyInterest?c.monthlyInterest.toLocaleString():''))+'" placeholder="0" oninput="this.value=fmtComma(this.value)"></div></div>';
      h+='<div class="field"><label>날짜</label><input type="date" class="input" id="lpDate" value="'+(p&&p.date?p.date:todayStr())+'"></div>';
      h+='<div class="menu-item" style="padding:8px 2px;"><span>🧾 원금·이자를 가계부 거래로 기록</span><div class="switch '+(txOn?'on':'')+'" id="lpTx" onclick="this.classList.toggle(\'on\');toggleLoanPayAcct()"><i></i></div></div>';
      h+='<div id="lpAcctWrap" style="'+(txOn?'':'display:none;')+'"><div class="field"><label>계좌</label><select class="input" id="lpAcct">'+acctOptsHtml((p&&p.account)||l.account||(state.accounts[0]?state.accounts[0].id:''))+'</select></div>'+
        '<div class="tx-sub" style="margin-bottom:6px;">'+(l.direction==='lent'?'원금·이자가 선택한 계좌로 함께 입금돼요':'원금·이자가 선택한 계좌에서 함께 차감돼요')+' (원금은 실지출 통계엔 포함되지 않아요).</div></div>';
      h+='<div class="field"><label>메모</label><input class="input" id="lpMemo" value="'+escapeHtml(p?(p.memo||''):'')+'" placeholder="메모"></div>';
      h+='<button class="btn" onclick="saveLoanPayment(\''+loanId+'\','+(id?'\''+id+'\'':'null')+')">'+(p?'수정':'기록')+'</button>';
      if(p) h+='<button class="btn danger" style="margin-top:8px;" onclick="deleteLoanPayment(\''+loanId+'\',\''+id+'\')">삭제</button>';
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
      const borrowed=l.direction!=='lent', iso=new Date(date+'T'+new Date().toTimeString().slice(0,8)).toISOString();
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
      db.ref(wp('loanPayments/'+key)).set(data); toast(p?'수정되었습니다':'기록되었습니다'); openLoanDetail(loanId);
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

    // ===== CSV =====
    function exportCSV(){
      const rows=monthTx(state.month).sort((a,b)=>new Date(a.date)-new Date(b.date));
      if(!rows.length){ toast('이번달 거래가 없습니다', true); return; }
      const header=['날짜','유형','사용자','카테고리','출금','입금','금액','실제소비','카드실적금액','원통화','외화금액','환율','환율원본','환율일자','설명','메모'];
      const lines=rows.map(t=>[ (t.date||'').substring(0,10), TYPE_LABEL[t.type]||t.type, t.user||'', t.category||'', acctName(t.from), acctName(t.to), t.amount||0, (isActual(t)?(Number(t.amount)||0):0), (t.cardPerformanceIncluded?(t.cardPerformanceAmount!=null?t.cardPerformanceAmount:t.amount):0), t.currency||'', (t.foreignAmount!=null?t.foreignAmount:''), (t.fxRate!=null?t.fxRate:''), t.fxSource||'', t.fxDate||'', t.desc||'', t.memo||'' ]
        .map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(','));
      const csv='﻿'+[header.join(','),...lines].join('\r\n');
      const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
      const url=URL.createObjectURL(blob); const a=document.createElement('a');
      a.href=url; a.download='가계부_'+state.month+'.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      toast(state.month+' 내역을 내보냈습니다');
    }
