    // ================= 뽑기 오픈 연출(#catFx 풀스크린) =================
    let _fx=null, _fxTimers=[];
    function _fxT(fn,ms){ const id=setTimeout(fn,ms); _fxTimers.push(id); return id; }   // 가챠 FX 타이머 추적 → 닫기/재시작 시 일괄 취소(빠른 닫기→재오픈 교차 방지)
    function _fxClear(){ _fxTimers.forEach(clearTimeout); _fxTimers=[]; }
    // 🔒 뽑기 진행 잠금(원인/조치) — 구매→RTDB 트랜잭션 '커밋'은 비동기라 그 사이 화면이 비어 '안 눌렸나?' 하고 버튼을 또 눌러 여러 개가 구매되고(각 커밋마다 runGachaFx가 #catFx를 덮어써) 연출은 하나만 남았다.
    //   → 모든 뽑기 진입점을 _pullBusy로 잠그고, 커밋 전에 즉시 '준비' 오버레이(알/상자)를 띄운다. 커밋되면 runGachaFx가 교체, 종료(closeFx)·중단·타임아웃 시 해제.
    let _pullBusy=false, _pullBusyT=null;
    function pullBegin(kind, rainbow){ _pullBusy=true; try{ document.body.classList.add('fx-open'); }catch(e){}   // 🎬 연출 중 뒤 배너 씬 애니 정지(styles.css body.fx-open)
      if(_pullBusyT) clearTimeout(_pullBusyT);
      _pullBusyT=setTimeout(function(){ _pullBusy=false; if(!_fx){ const f=$('catFx'); if(f&&f.classList.contains('on')){ closeFx(); toast('네트워크가 느려요 — 다시 시도해 주세요', true); } } }, 12000);   // 안전장치: 커밋이 끝내 안 오면 잠금·오버레이 해제
      gachaPending(kind, rainbow); }
    function pullEnd(){ _pullBusy=false; if(_pullBusyT){ clearTimeout(_pullBusyT); _pullBusyT=null; } }
    // 커밋 전 즉시 뜨는 '준비' 오버레이 — 탭 즉시 알/상자가 보여 지연 동안의 중복 구매를 막는다. 커밋되면 runGachaFx가 같은 알을 '탭 가능' 상태로 교체(끊김 없음).
    function gachaPending(kind, rainbow){ const fx=$('catFx'); if(!fx) return; _fxClear();
      const egg=isEggKind(kind), v2e=(kind==='egg');   // 라이브 펫알/무지개알=v2 뜰알식 알(runGachaFx의 v2egg와 동일 판정 — 대기→본연출 제자리 승격 정합)
      const art = rainbow ? (egg?(v2e?rbEgg2FxHtml():rainbowEggSvg({h:150})):rainbowBoxSvg({h:150}))
                          : (kind==='ddeul'?ddeulFxHtml():(egg?(v2e?egg2FxHtml():eggSvg(0,{h:150})):boxSvg({h:150})));
      fx.innerHTML='<div class="fx-scrim"></div>'+fxSceneBg(kind, rainbow)+'<div class="fx-stage'+(rainbow?' fx-rb':'')+(kind==='ddeul'?' fx-ddeul':'')+'">'+
        '<div class="fx-item pop '+(egg?'fx-egg':'fx-box')+((kind==='ddeul'||v2e)?' fx-ddeulegg':'')+(rainbow?' fx-rainbow':'')+'">'+art+'</div>'+
        '<div class="fx-hint fx-hint-wait">뽑는 중…</div></div>';
      fx.className='fx on'; }
    function itemName(kind,id){ return kind==='egg'?catName(id):((ITEM_CATALOG.find(x=>x.id===id)||{}).name||id); }
    function fxParticles(n,cls){ n=fxCount(n||14); let s=''; for(let i=0;i<n;i++){ const a=(i/n)*360+Math.random()*30, d=60+Math.random()*90; const dx=Math.round(Math.cos(a*Math.PI/180)*d), dy=Math.round(Math.sin(a*Math.PI/180)*d); const del=(Math.random()*0.12).toFixed(2); s+='<span class="'+(cls||'fx-particle')+'" style="--dx:'+dx+'px;--dy:'+dy+'px;animation-delay:'+del+'s"></span>'; } return s; }
    // 픽셀 컨페티(도트) — 둥근 조각 대신 각진 픽셀 블록이 흔들리며 떨어짐. n=개수(등급↑ 많이), 3가지 픽셀 모양(s0~s2).
    function fxConfetti(n){ const cols=['#F04452','#F0883C','#F2C84B','#2FAE7A','#3182F6','#9B6FC8']; n=fxCount(n||24); let s='';
      for(let i=0;i<n;i++){ const x=Math.round(Math.random()*100), r=(Math.round(Math.random()*4)*90), del=(Math.random()*0.7).toFixed(2), dur=(1.1+Math.random()*0.9).toFixed(2), sw=(Math.random()*50-25).toFixed(0), sh=i%3;
        s+='<span class="fx-conf s'+sh+'" style="left:'+x+'%;color:'+cols[i%6]+';--r:'+r+'deg;--sw:'+sw+'px;animation-delay:'+del+'s;animation-duration:'+dur+'s"></span>'; }
      return s; }
    // 🌆 1뽑 탭 단계 배너 기반 배경(2026-07) — 메인 화면이 비치지 않게 kind별 배너 씬을 불투명 레이어로 깐다(펫 배회 없는 씬만).
    //    egg=노을 · box=보물 금고 · ddeul=픽업 낮 · 무지개(rainbow)=밤. 절전(lite)·reduced-motion은 씬 내부 규칙이 처리.
    // 🎬 1뽑 배경 씬 '모드' 단일 판정 — 무지개=밤 · 뜰알=픽업 · 랜덤박스=보석 · 그 외 펫알=노을. **모든 등급에 씬 표시**(2026-07 사용자 지침).
    //    등급별 차이는 씬 유무가 아니라 '센터피스'(특별↑만 노을 해가 스르르 떠오르고·랜덤박스 커다란 보석이 스르르 등장 — fxReveal의 tenSkyRiseSun/Dia).
    function fxSceneMode(kind, rainbow){
      if(rainbow) return 'night';
      if(kind==='ddeul') return 'pickup';   // 🌱 뜰알=무지개 픽업씬(항상, 배너와 동일 정체성)
      return kind==='box' ? 'treasure' : 'sunset';   // 랜덤박스=보석 · 펫알=노을(등급 무관)
    }
    // 씬 HTML은 '센터피스 미표시'(reveal 모드 — 노을 해·보석 다이아 숨김)로 깐다. 특별↑ 센터피스는 fxReveal이 tenSkyRiseSun/Dia로 얹는다(모든 등급 공통 배경 + 특별↑만 연출 추가).
    function fxSceneBg(kind, rainbow){ try{
        const mode=fxSceneMode(kind, rainbow); let sc='', full=false;
        if(mode==='night') sc=nightSceneHtml();                                                                                    // 밤(무지개)=배너 하늘 배경
        else if(mode==='pickup'){ sc=pickupSceneHtml('reveal'); full=true; }                                                       // 뜰알·신화/한정 펫알=픽업(전체화면)
        else if(mode==='treasure'){ sc=(typeof treasureSceneHtml==='function')?treasureSceneHtml('reveal'):sunsetSceneHtml('reveal','box'); full=true; }   // 랜덤박스=보석(센터 다이아 미표시)
        else if(mode==='sunset'){ sc=sunsetSceneHtml('reveal'); full=true; }                                                       // 펫알=노을(해 미표시)
        return sc?'<div class="fx-scenebg'+(full?' fx-scene-full':'')+'" data-mode="'+mode+'" aria-hidden="true">'+sc+'</div>':'<div class="fx-scenebg fx-plainbg" data-mode="plain" aria-hidden="true"></div>';   // full=pk-reveal 전체화면 씬(자체 어둡기 오버레이 있어 scenebg::after 중복 방지)
      }catch(e){ return ''; } }
    // 🎬 배경 씬을 현재 _fx 상태(등급 확정·무지개 승급)에 맞게 다시 깐다 — 대기(등급 미상) 후 커밋이나 탭 도중 무지개 승급으로 씬이 바뀔 때
    //    '.fx-scenebg' 레이어만 교체(알·상자·hint DOM은 그대로 유지 → 등장 팝 애니 재생 없음). 같은 모드면 유지해 불필요한 재렌더·깜빡임 방지.
    function fxSwapSceneBg(){ const fx=$('catFx'); if(!fx||!_fx) return;
      const old=fx.querySelector('.fx-scenebg'); if(!old) return;
      const mode=fxSceneMode(_fx.kind, _fx.rainbow); if(old.dataset.mode===mode) return;
      const tmp=document.createElement('div'); tmp.innerHTML=fxSceneBg(_fx.kind, _fx.rainbow);
      const neo=tmp.firstElementChild; if(neo) old.replaceWith(neo);
    }
    // 💗 가챠 중복 펫 애정 레벨업 연출 — 리빌 펫 위로 픽셀 하트 6개가 부채꼴로 '뿅뿅' + UP! 배지(affLevelFx 톤).
    function fxAffLvUpHtml(){
      let hearts='';
      for(let i=0;i<6;i++){ const ang=(-90+(i-2.5)*26)*Math.PI/180, d=42+((i*37)%22);
        hearts+='<span class="fx-hpop" style="--tx:'+(Math.cos(ang)*d).toFixed(0)+'px;--ty:'+(Math.sin(ang)*d).toFixed(0)+'px;animation-delay:'+(i*0.09).toFixed(2)+'s">'+heartSvg({h:13})+'</span>'; }
      return '<span class="fx-lvup-wrap">'+hearts+'<span class="fx-lvup-up">'+upSvg({h:20})+'</span></span>';
    }
    function runGachaFx(kind, res, dup, refund, rainbow, isNew, dupAff){
      const fx=$('catFx'); if(!fx){ toast((kind==='egg'?'펫알':'랜덤박스')+' 획득!'); pullEnd(); return; }
      _fxClear();   // 이전 FX 잔여 타이머 취소(빠른 재오픈 교차 방지)
      _fx={ kind, res, dup, refund:refund||0, stage:0, rainbow:!!rainbow, gold: (rainbow||kind==='ddeul')?0:1, isNew:!!isNew, v2egg:(kind==='egg'), dupAff:(dupAff&&!dupAff.max)?dupAff:null, dupRbc:(dupAff&&dupAff.max&&dupAff.rbc)?dupAff.rbc:((dup&&res&&!isEggKind(kind))?dupRbcOf(res.tier):0) };   // 무지개·뜰알은 금화 보상 없음(뜰알은 금화 소모). isNew=NEW 배지. dupAff=💗 중복 펫 애정 표기. dupRbc=🌈 신화↑ 중복 무지개동전 표기(한정+2·신화+1, 만렙 신화↑ 펫·신화↑ 아이템 중복).
      // v2egg=신규 펫알/무지개알 아트(뜰알식 연출, 라이브 정식) — 무지개알 '아이템 사용(1뽑)'도 v2 연출(큰 무지개꽃 흔들림·전설↑ 꽃 뚝+무지개 꽃 흩날림)로 통일(2026-07-09 사용자 지침).
      if(isEggKind(kind) && typeof hasSprite==='function' && hasSprite(res.id)){ try{ const _pi=new Image(); _pi.src=sprStill(res.id,'south'); if(_pi.decode) _pi.decode().catch(function(){}); }catch(e){} }   // 등장 스프라이트 미리 로드·디코드(펫알·뜰알 공통) → 마지막에 바로 표시
      if(typeof prewarmGachaFxPads==='function') prewarmGachaFxPads();   // 연출 고양이 발끝 여백 미리 측정(탭하는 동안 캐시 완료 → 첫 등장 세로 점프 방지)
      if(reducedMotion()){ fxReveal(); return; }   // 모션 최소화만 즉시 결과(옛 '빠른 연출' 스킵은 폐기 — fxFast 잔재로 1뽑이 스킵되던 버그)
      const isDdeul = kind==='ddeul';
      const hint = isDdeul? '뜰알을 탭해서 깨보세요! (3번)' : (isEggKind(kind)? '알을 탭해서 깨보세요! (3번)' : '상자를 탭해서 흔들어 열어요! (3번)');
      // 🔧 '뽑는 중…' 대기 오버레이(gachaPending)가 이미 같은 알/상자를 띄워놨으면 DOM을 재생성하지 않고 "제자리 승격"만 한다
      //    — innerHTML로 다시 그리면 .fx-item.pop 등장 애니(fxpop, scale .2→1)가 처음부터 또 재생돼 알/상자가 '두 번 튀어' 보이던 버그(스크림 페이드도 재점멸).
      //    같은 종류(알/상자·뜰알·무지개)일 때만 승격, 아니면 아래 전체 재렌더 폴백.
      const st0=fx.querySelector('.fx-stage'), it0=fx.querySelector('.fx-item'), h0=fx.querySelector('.fx-hint');
      const pendingMatch = fx.classList.contains('on') && st0 && it0 && h0 && h0.classList.contains('fx-hint-wait')
        && it0.classList.contains(isEggKind(kind)?'fx-egg':'fx-box')
        && it0.classList.contains('fx-ddeulegg')===(isDdeul||_fx.v2egg)
        && it0.classList.contains('fx-rainbow')===!!rainbow;
      if(pendingMatch){
        it0.id='fxItem'; it0.setAttribute('role','button'); it0.setAttribute('aria-label',hint); it0.setAttribute('onclick','fxTap()');
        h0.id='fxHint'; h0.classList.remove('fx-hint-wait'); h0.textContent=hint;
        if(rainbow && !st0.querySelector('.fx-spark')) st0.insertAdjacentHTML('afterbegin', fxSparkles(16));
        fxSwapSceneBg();   // 🎬 등급 확정 → 대기 때 보류했던 배경 씬을 지금 등급에 맞게 승격(특별↑=노을/보석). pendingMatch로 씬이 기본으로 굳던 버그 수정.
        return;
      }
      const v2e=_fx.v2egg;   // 🎨 v2 펫알: 뜰알식 분리 렌더(새싹+몸통) — 크기·흔들림 CSS는 .fx-ddeulegg 공유. 무지개알/무지개박스 '사용'은 기존(v1) 아트.
      const art = rainbow ? (isEggKind(kind)? (v2e?rbEgg2FxHtml():rainbowEggSvg({h:150})) : rainbowBoxSvg({h:150}))
                          : (isDdeul? ddeulFxHtml() : (isEggKind(kind)? (v2e?egg2FxHtml():eggSvg(0,{h:150})) : boxSvg({h:150})));
      fx.innerHTML='<div class="fx-scrim"></div>'+fxSceneBg(kind, rainbow)+'<div class="fx-stage'+(rainbow?' fx-rb':'')+(isDdeul?' fx-ddeul':'')+'">'+
        (rainbow?fxSparkles(16):'')+
        '<div class="fx-item pop '+(isEggKind(kind)?'fx-egg':'fx-box')+((isDdeul||v2e)?' fx-ddeulegg':'')+(rainbow?' fx-rainbow':'')+'" id="fxItem" role="button" aria-label="'+hint+'" '+App.view.act('fxTap')+'>'+art+'</div>'+
        '<div class="fx-hint" id="fxHint">'+hint+'</div></div>';
      fx.className='fx on';
    }
    // 🌈🦋 뜰알 전용 연출 — 알 위쪽에 픽업 배너의 무지개가 '스르르'(천천히) 크게 뜨고, 배너의 나비 5마리가 알 주변을 팔랑팔랑 날아다닌다.
    //   펫알의 무지개알 승급(maybeRainbowUpgrade)과 '같은 타이밍'(2번째 탭)에 등장 — 처음부터 보이지 않게. 중복 생성 방지.
    function ddeulPickupFx(st){ if(!st || st.querySelector('.fx-ddrainbow')) return;
      // ☁️ 흐르는 구름 몇 개(위쪽 하늘)
      const CL=[{t:8,w:2,tn:'w',h:32,d:34,dl:-6},{t:18,w:1,tn:'b',h:22,d:47,dl:-27},{t:4,w:0,tn:'w',h:40,d:28,dl:-15},{t:25,w:1,tn:'w',h:18,d:56,dl:-41}];
      let c=''; CL.forEach(function(o){ c+='<span class="fx-ddcloud" style="top:'+o.t+'%;--d:'+o.d+'s;animation-delay:'+o.dl+'s">'+cloudSvg(o.w,o.tn,{h:o.h})+'</span>'; });
      st.insertAdjacentHTML('afterbegin','<div class="fx-ddclouds" aria-hidden="true">'+c+'</div>');
      // 🌈 무지개 — 화면 안에서 양옆까지 감싸는 둥근(반원) 아치가 왼→오로 펼쳐진다
      st.insertAdjacentHTML('afterbegin','<div class="fx-ddrainbow" aria-hidden="true">'+authRainbowSvg()+'</div>');
      // 🦋/🍁/🌸 알 주변 — 뜰알=나비, 🌈 무지개알·무지개박스(승급 포함, rainbow)=**찬란한 무지개 색바퀴 꽃 6개**(사용자 지침 — 낙엽 대체), 그 외 펫알·랜덤박스=낙엽(단풍잎). '섹터'로 고르게 + 매 연출 랜덤 위치·경로.
      const useCoin = !!(_fx && _fx.kind==='box');         // 🌈🪙 랜덤박스=무지개 동전 6개(사용자 지침)
      const useRbFlw = !!(_fx && _fx.kind!=='ddeul' && !useCoin);   // 🌈 펫알·무지개알=무지개꽃 6개. 뜰알=나비.
      const T=['o','b','p','y','o','p','b']; let b=''; const N=(useCoin||useRbFlw)?6:7, SH=-28;   // SH=전체 왼쪽 시프트
      for(let i=0;i<N;i++){
        const ang=((i+Math.random()*0.7)/N)*Math.PI*2, rx=118+Math.random()*72, ry=142+Math.random()*72;
        const mx=Math.round(Math.cos(ang)*rx)+SH, my=Math.round(Math.sin(ang)*ry);
        const hh=useCoin?(16+Math.round(Math.random()*7)):useRbFlw?(16+Math.round(Math.random()*6)):Math.round((13+Math.round(Math.random()*4))*1.5), dur=(6+Math.random()*5).toFixed(1), fd=(0.32+Math.random()*0.28).toFixed(2), del=(-Math.random()*8).toFixed(2);
        const inner = useCoin ? ('<span class="fx-rbcoin" style="--fd:'+(1.5+Math.random()*1.1).toFixed(2)+'s;animation-delay:'+(-Math.random()*2).toFixed(2)+'s">'+rainbowCoinSvg({h:hh})+'</span>')
          : useRbFlw ? ('<span class="fx-rbflwig" style="--fd:'+(2.0+Math.random()*1.4).toFixed(2)+'s;animation-delay:'+(-Math.random()*2.4).toFixed(2)+'s">'+ddeulFlwRbSvg({h:hh})+'</span>')
          : ('<span class="bf-wing">'+butterflySvg(T[i%T.length],{h:hh})+'</span>');
        b+='<span class="fx-ddbfly" style="margin:'+my+'px 0 0 '+mx+'px;--d:'+dur+'s;--fd:'+fd+'s;animation-delay:'+del+'s;'+bflyDriftVars(Math.random)+'">'+inner+'</span>'; }
      st.insertAdjacentHTML('beforeend','<div class="fx-ddbflies" aria-hidden="true">'+b+'</div>');
      // 🌅 (제외) 무지개알·무지개박스 오픈의 '해 떠오름'(ten-skysun)은 넣지 않는다(사용자 지침) — 무지개 아치·무지개꽃만 유지. (펫알·랜덤박스는 10연차 노을에서만 해가 뜨며 그건 유지.)
      // 🌈 뜰알이면 꽃을 무지개색으로(오픈까지 유지 플래그). 펫알이면 꽃이 없어 no-op.
      if(ddeulFlowerRb(st) && _fx) _fx._flwRb=true;
      const hint=$('fxHint'); if(hint) hint.textContent='🌈 무지개가 펼쳐져요! 한 번 더 탭!'; }
    // ✨ 반짝이는 도트 스파클(무지개알/박스 대기 연출) — 흰 픽셀 점이 제각기 깜빡이며 흩뿌려짐
    function fxSparkles(n){ n=fxCount(n||12); let s=''; for(let i=0;i<n;i++){ const x=Math.round(Math.random()*100), y=Math.round(Math.random()*100), del=(Math.random()*1.4).toFixed(2), sc=(0.7+Math.random()*1.2).toFixed(2), du=(0.9+Math.random()*0.9).toFixed(2); s+='<span class="fx-spark" style="left:'+x+'%;top:'+y+'%;--sc:'+sc+';animation-delay:'+del+'s;animation-duration:'+du+'s"></span>'; } return s; }
    // 탭할 때마다 껍질 조각이 사방으로 튀는 연출(단계가 오를수록 더 많이) — 알이 점점 더 깨지는 느낌.
    function fxCrackChips(stage){ const fx=$('catFx'), st=fx&&fx.querySelector('.fx-stage'); if(!st) return;
      const n=fxCount(5+stage*5); const rb=_fx&&_fx.rainbow; let s='';   // 단계↑ 더 많은 조각이 튐
      for(let i=0;i<n;i++){ const a=-90+(i/n)*300+(Math.random()*24-12), d=48+Math.random()*84;
        const dx=Math.round(Math.cos(a*Math.PI/180)*d), dy=Math.round(Math.sin(a*Math.PI/180)*d)+8;
        const rot=Math.round(Math.random()*360-180), sc=(0.5+Math.random()*0.7).toFixed(2), del=(Math.random()*0.05).toFixed(2), h=7+Math.round(Math.random()*4);
        s+='<span class="fx-chip" style="--dx:'+dx+'px;--dy:'+dy+'px;--r:'+rot+'deg;--s:'+sc+';animation-delay:'+del+'s">'+shellSvg(2,rb,{h:h})+'</span>'; }
      const w=document.createElement('div'); w.innerHTML=s; const nodes=[].slice.call(w.children);
      nodes.forEach(function(nd){ st.appendChild(nd); }); setTimeout(function(){ nodes.forEach(function(nd){ nd.remove(); }); }, 720);
    }
    function fxTap(){
      if(!_fx||_fx.busy) return; const it=$('fxItem'); if(!it) return;
      _fx.stage++;
      if(_fx.stage>=3){ _fx.busy=true; fxClimax(); return; }   // 알·박스 모두 3번 탭에 오픈
      if(isEggKind(_fx.kind)){
        const ddLike=_fx.kind==='ddeul'||_fx.v2egg;   // 🎨 v2 펫알(배너관리 미리보기)도 뜰알식(균열 없음·새싹 팔랑·무지개=새싹 커짐+무지개색)
        if(_fx.stage===2 && !_fx.rainbow && !ddLike) maybeRainbowUpgrade();   // 2번째 탭 직후: 특별↑이면 확률로 무지개알 승급(뜰알·v2 펫알은 제외 — 꽃/새싹 무지개 전용 연출)
        if(_fx.stage===2 && _fx.kind==='ddeul' && (_fx.res.tier==='exclusive' || Math.random()<rbUpgradeChance(_fx.res.tier))) ddeulPickupFx(it.closest('.fx-stage'));   // 🌈 뜰알 무지개+나비 = 조건부(한정=항상·특별50%·전설/신화100% — 2026-07-10 사용자 재확정, 배경 무지개 픽업씬은 유지)
        if(_fx.stage===2 && _fx.v2egg && !_fx.rainbow && Math.random()<rbUpgradeChance(_fx.res.tier)) ddeulPickupFx(it.closest('.fx-stage'));   // 🌱 v2 펫알: 뜰알 꽃과 같은 조건 — 새싹이 커지며 무지개색(ddeulFlowerRb가 fx-ddspr 감지)
        if(_fx.stage===2 && _fx.kind!=='ddeul' && _fx.rainbow) ddeulPickupFx(it.closest('.fx-stage'));   // 펫알(무지개알로 승급) · 무지개알(원래부터)도 뜰알과 동일한 무지개+나비 연출 — 승급 조건과 같은 타이밍/조건
        it.innerHTML = _fx.kind==='ddeul' ? ddeulFxHtml(_fx._flwRb?DDEUL_FLW_RB:undefined)
          : _fx.v2egg ? (_fx.rainbow?rbEgg2FxHtml():egg2FxHtml(_fx._flwRb))
          : (_fx.rainbow?rainbowEggStage(_fx.stage,{h:150}):eggSvg(_fx.stage,{h:150}));   // 나비 연출(무지개) 시 꽃/새싹 무지개 유지
        it.classList.remove('shake'); void it.offsetWidth; it.classList.add('shake');   // 탭마다 알이 좌우로 크게 흔들림
        if(ddLike){ const fl=it.querySelector('.fx-ddflower'); if(fl) fl.classList.add('flswing'); }   // 뜰알·v2 펫알: 탭 흔들림에 맞춰 꽃/새싹도 줄기에서 팔랑(갓 렌더된 요소라 클래스 추가만으로 재생)
        fxCrackChips(_fx.stage);   // 탭마다 껍질 조각이 튀어 깨짐을 강조
      } else {
        if(_fx.stage===2 && !_fx.rainbow) maybeRainbowUpgrade();   // 🎁 박스도 특별↑이면 무지개박스로 승급(펫알 무지개알과 동일 조건)
        if(_fx.stage===2 && _fx.rainbow) ddeulPickupFx(it.closest('.fx-stage'));   // 🌈🦋 무지개박스도 무지개알과 '같은 조건·타이밍'(2번째 탭·rainbow)으로 무지개+나비 연출
        if(_fx.rainbow) it.innerHTML=rainbowBoxSvg({h:150});   // 승급·아이템 사용 모두 새 무지개 나무상자(v2 통일)
        it.classList.remove('boxshake'); void it.offsetWidth; it.classList.add('boxshake');   // 박스: 양옆으로 들고 흔드는 느낌
      }
    }
    // 🌈 무지개 발동 확률(단일 소스) — 특별50%·전설/신화100%·그 외 0%. 펫알 무지개알 승급과 뜰알 무지개+나비 연출이 '같은 조건'을 공유한다.
    function rbUpgradeChance(tier){ return (tier==='epic')?0.5:((tier==='legend'||tier==='limited')?1:0); }
    // ✨ 무지개 승급: 결과 등급이 특별↑이면 확률로 알을 무지개알로 변신(특별 50% · 전설/한정 100%).
    //    시각·연출만 무지개로 바뀌고 결과 펫·보상(_fx.gold)은 그대로. 3번째 탭에서 무지개 오픈 연출로 열린다.
    function maybeRainbowUpgrade(){
      const tier=_fx.res.tier; const chance=rbUpgradeChance(tier);   // 신화 텍스트색은 핑크지만 알 열 때 무지개알 승급 유지
      if(chance<=0 || Math.random()>=chance) return;
      _fx.rainbow=true; _fx.rbUpgrade=true;
      fxSwapSceneBg();   // 🌈 무지개 승급 → 배경 씬도 밤 씬으로 승격(탭 도중 노을→밤). 안 하면 리빌 전까지 씬이 안 바뀜.
      const it=$('fxItem'), st=$('catFx')&&$('catFx').querySelector('.fx-stage');
      if(it) it.classList.add('fx-rainbow');
      if(st){ st.classList.add('fx-rb'); st.insertAdjacentHTML('beforeend', fxSparkles(14));
        st.insertAdjacentHTML('beforeend','<div class="fx-upgrade">'+raysSvg('#ffffff',{h:220})+'</div>');
        const u=st.querySelector('.fx-upgrade'); if(u) setTimeout(function(){ u.remove(); }, 720); }
      const hint=$('fxHint'); if(hint) hint.textContent='✨ '+((_fx.kind==='box')?'무지개박스':'무지개알')+'로 변했어요! 한 번 더 탭!';
      toast('✨ '+((_fx.kind==='box')?'무지개박스':'무지개알')+'로 변신!');
    }
    // 깨진 껍질 조각(알 전용): 좌우로 튀어나가 아래·옆에 흩어져 놓인다. 큰 조각 2개 + 잔조각.
    function fxShells(){
      let s=''; const n=fxCount(11); const rb=_fx&&_fx.rainbow;   // 조각을 더 많이 + 더 멀리 튕겨나가게(껍질이 확 깨져 날아가는 게 보이게)
      for(let i=0;i<n;i++){
        const side=(i%2)?1:-1;
        const sx=(side*(62+Math.random()*132)).toFixed(0);   // 좌우로 더 멀리 흩어짐
        const sy=(18+Math.random()*108).toFixed(0);          // 위로 튀었다 아래로 떨어져 옆에 놓임
        const sr=(side*(140+Math.random()*400)).toFixed(0);  // 빙글빙글 더 많이 회전
        const big=i<3;                                        // 큰 곡면 조각 3개 + 잔조각
        const which=big?(i%2):2;                              // A/B(큰), C(작은)
        const h=big?(15+Math.round(Math.random()*7)):(8+Math.round(Math.random()*4));
        const del=(Math.random()*0.12).toFixed(2);
        s+='<span class="fx-shell'+(big?' big':'')+'" style="--sx:'+sx+'px;--sy:'+sy+'px;--sr:'+sr+'deg;--ss:1;animation-delay:'+del+'s">'+shellSvg(which,rb,{h:h})+'</span>';
      }
      return s;
    }
    // 오픈 직전 연출: (흔들림·흰빛) → [확률로: 검은 고양이 앞발로 톡] → (열리는 순간부터 등급색) 빛 새어나옴 → 버스트(알=껍질 조각 튐) → 등장
    // 가챠 오픈 연출 고양이 1마리 생성. side='l'(왼쪽 등장·오른쪽 봄)/'r'(오른쪽 등장·왼쪽 봄). id=지정 펫(스프라이트 자립 걷기·크기=배율) 또는 null(기본 검은고양이 배경 스프라이트 480).
    function fxSpawnCat(st, side, id){
      const isPet=!!(id && typeof hasSprite==='function' && hasSprite(id));
      const size=isPet ? Math.max(140, Math.min(560, Math.round(200*effPetScale(id)))) : 480;   // 🐘 등장 크기도 압축·등급차등 반영(캠과 동일 표시 크기)
      const el=document.createElement('div');
      el.className='fx-cat walkin fxc-'+side+(isPet?' fxc-pet':' fxc-gc');
      el.style.setProperty('--cat', size+'px');
      // 발끝 기준선(--floor) = 알의 실제 바닥. 알(#fxItem)의 레이아웃 위치(offsetTop+offsetHeight, transform 영향 없음)로 측정 → 고양이가 알 옆 같은 바닥에 서게. 실전엔 힌트가 제거돼 알이 무대 중앙, 미리보기엔 힌트가 있어 알이 위쪽 — 둘 다 실측이라 자동 정합.
      const eggEl=(typeof $==='function'&&$('fxItem'))|| (st.querySelector&&st.querySelector('.fx-item'));
      const floor = eggEl ? (eggEl.offsetTop + eggEl.offsetHeight) : Math.round((st.offsetHeight||st.clientHeight||480)*0.62);
      el.style.setProperty('--floor', floor+'px');
      // --foot=스프라이트 하단 투명여백 비율(발끝을 --floor=알 바닥에 정확히 맞추는 보정). 펫·기본 고양이 모두 걷는 walk 시트를 실측(measureFxFoot)해 크기·종류 무관하게 동일 정합. 하드코딩 금지.
      const fpKey=isPet?(id+':fxwalk'):'_gc', fpDef=isPet?PET_FOOT_PAD:GACHACAT_FOOT_DEFAULT;
      el.style.setProperty('--foot', (typeof _footPad!=='undefined'&&_footPad[fpKey]!=null?_footPad[fpKey]:fpDef).toFixed(3));   // 측정 전 즉시 기본값(prewarm됐으면 캐시 적중 → 점프 없음)
      if(isPet){ ensurePetArt(id); el.innerHTML='<div class="fxc-in">'+catActorHTML(id, size)+'</div>'; }
      else { el.innerHTML='<div class="fxc-in"></div>'; }
      if(typeof measureFxFoot==='function') measureFxFoot(isPet?id:null, function(fp){ el.style.setProperty('--foot', fp.toFixed(3)); });
      st.appendChild(el);
    }
    // 가챠 연출 고양이 시퀀스를 _fxT 타이머로 예약(1번 왼쪽 → 끝나면 2번 오른쪽, 순차). 알 무대(st)·아이템(it)에 동작하고 '마지막 고양이가 톡 치는 시각(=알 오픈 타이밍)'을 ms로 반환. fxClimax(실전)·devPreviewGachaFx(미리보기) 공용.
    // 🌈 무지개 연출 카메오 풀 = 한정(exclusive) 펫 전체(스프라이트 보유) — 무지개알/무지개박스 연출(승급 포함)엔 무조건 한정 펫이 랜덤으로 걸어나와 툭 친다(사용자 지침).
    function exCameoPool(){ const tm=(typeof effCatTier==='function')?effCatTier():CAT_TIER;
      return PET_CATALOG.filter(function(c){ return (tm[c.id]||CAT_TIER[c.id]||'normal')==='exclusive' && typeof hasSprite==='function' && hasSprite(c.id); }).map(function(c){ return c.id; }); }
    // 가챠 연출에 걸어나올 펫 2마리 선정. 🌈 무지개(알/박스·승급) → 한정 펫 랜덤 2마리(무조건). 한정(뜰알) 뽑기 → 개발자 지정(config/gachaFx a/b). 그 외 → 전설·신화 등급 펫 중 랜덤 2마리(스프라이트 보유).
    function fxCatPickIds(){
      if(_fx && _fx.rainbow){ const ex=exCameoPool(); if(ex.length){ const a=ex[Math.floor(Math.random()*ex.length)]; let b=ex[Math.floor(Math.random()*ex.length)];
        if(ex.length>1){ let g=0; while(b===a && g<6){ b=ex[Math.floor(Math.random()*ex.length)]; g++; } } return { a:a, b:b }; } }
      if(_fx && _fx.res && _fx.res.tier==='exclusive') return { a:(_gachaFx&&_gachaFx.a)||null, b:(_gachaFx&&_gachaFx.b)||null };
      const pool=PET_CATALOG.filter(function(c){ const t=CAT_TIER[c.id]; return (t==='legend'||t==='limited') && typeof hasSprite==='function' && hasSprite(c.id); }).map(function(c){ return c.id; });
      if(!pool.length) return { a:null, b:null };
      const a=pool[Math.floor(Math.random()*pool.length)];
      let b=pool[Math.floor(Math.random()*pool.length)];
      if(pool.length>1){ let g=0; while(b===a && g<6){ b=pool[Math.floor(Math.random()*pool.length)]; g++; } }
      return { a:a, b:b };
    }
    function fxCatSeqSchedule(st, it){
      const pick=fxCatPickIds(); const a=pick.a, b=pick.b, any=a||b;
      const seq=[]; if(a || !any) seq.push({side:'l', id:any?a:null}); if(b) seq.push({side:'r', id:b});
      const WALK=1800, TAP=160, HIT=180, STEP=2760;   // 한 마리 구간: 등장(WALK)→톡(TAP 뒤 HIT 충격)→퇴장(STEP에서 제거)
      const catAt=side=>st.querySelector('.fx-cat.fxc-'+side);
      seq.forEach((c, i)=>{ const base=i*STEP, isLast=i===seq.length-1;
        _fxT(()=>{ fxSpawnCat(st, c.side, c.id); }, base);   // 등장(walkin)
        _fxT(()=>{ const el=catAt(c.side); if(el){ el.classList.remove('walkin'); el.classList.add('arr','tap'); } }, base+WALK);   // 도착 → 앞발 톡(펫 .cspr은 계속 걷고, 기본 고양이는 CSS로 정지 스틸)
        _fxT(()=>{ it.classList.remove('fx-preshake'); void it.offsetWidth; it.classList.add('fx-hit');   // 앞발이 닿는 순간 알/상자가 톡 튕김
          const fl=it.querySelector('.fx-ddflower'); if(fl){ fl.classList.remove('flswing'); void fl.offsetWidth; fl.classList.add('flswing'); } }, base+WALK+TAP);   // 뜰알: 펫이 톡 칠 때도 탭처럼 꽃이 팔랑
        _fxT(()=>{ const el=catAt(c.side); if(el){ el.classList.remove('tap'); el.classList.add('leave'); } it.classList.remove('fx-hit'); if(!isLast){ void it.offsetWidth; it.classList.add('fx-preshake'); } }, base+WALK+TAP+HIT);   // 톡 후 물러나며 흐려짐, 다음 고양이 있으면 알은 다시 들썩이며 대기
        _fxT(()=>{ const el=catAt(c.side); if(el) el.remove(); }, base+STEP);
      });
      return (seq.length-1)*STEP+2120;   // 마지막 고양이가 톡 친 직후(=알 오픈 타이밍)
    }
    function fxClimax(){
      const fx=$('catFx'), st=fx&&fx.querySelector('.fx-stage'), it=$('fxItem'); if(!st||!it) return;
      const t=tierInfo(_fx.res.tier), epic=['epic','legend','limited'].indexOf(_fx.res.tier)>=0, lim=_fx.res.tier==='limited', exL=_fx.res.tier==='exclusive';   // exL=한정 → 빛을 무지개로
      // 검은 고양이 앞발 연출 = 고등급 티저. 등급별 확률: 특별(epic) 10%·전설 90%·한정 100% (그 미만 0%). 등장 자체가 '뭔가 좋은 게 나온다'는 힌트.
      const catShow = !!_fx.rainbow || Math.random() < (({ epic:0.10, legend:0.90, limited:1.0, exclusive:1.0 })[_fx.res.tier] || 0);   // 🌈 무지개(알/박스·승급)=무조건 한정 펫 등장 · 그 외 등급별 확률(뜰알 한정 100%=개발자 지정 펫)
      const rank=Math.max(0, TIER_ORDER.indexOf(_fx.res.tier));   // 0(일반)~5(신화)~6(한정)
      const lk=(1+rank*0.15).toFixed(2);                          // 등급 높을수록 빛이 크고 밝게
      const isEgg=isEggKind(_fx.kind);
      st.style.color='#ffffff';   // 오픈 전(흔들림·고양이)엔 흰빛 — 등급색을 미리 깔면 열기 전에 등급이 새므로, 실제 열리는 순간(t0)부터 등급색으로 바꾼다
      const hint=$('fxHint'); if(hint) hint.remove();
      it.classList.add('fx-preshake');
      let t0=680;
      // 개발자가 지정한 펫(config/gachaFx)이 도도하게 걸어나와 앞발로 알을 톡 → 그 자리서 알 오픈. 1번(왼쪽) 끝난 뒤 2번(오른쪽) 순차. 미지정이면 기본 검은고양이(왼쪽 1마리).
      if(catShow) t0=fxCatSeqSchedule(st, it);   // 마지막 고양이가 톡 친 직후 알 오픈
      _fxT(()=>{
        st.style.color=t.color;   // 열리는 순간부터 등급색 — 빛·픽셀 파티클·버스트·등장이 currentColor로 등급색을 따른다(그 전엔 흰빛이라 등급 스포일러 방지)
        it.classList.remove('fx-preshake','fx-hit','shake','boxshake'); void it.offsetWidth; it.classList.add('fx-tremble');
        if(_fx.kind==='ddeul'){ it.innerHTML=ddeulFxHtml(_fx._flwRb?DDEUL_FLW_RB:undefined); fxCrackChips(4); }   // 뜰알: 고양이 얼굴 알이 크게 들썩(꽃도 크게 흔들림)+껍질 조각 튐 후 버스트. 무지개 연출이면 꽃 무지개 유지.
        else if(_fx.v2egg){ it.innerHTML=(_fx.rainbow?rbEgg2FxHtml():egg2FxHtml(_fx._flwRb)); fxCrackChips(4);   // 🎨 v2 펫알/무지개알: 뜰알과 동일 — 균열 없이 크게 들썩(새싹/꽃 큰 흔들림)+껍질 조각
          if(_fx.rainbow && tierRank(_fx.res.tier)>=tierRank('legend')) rbFlowerDropFx(it, st); }   // 🌈🌸 무지개알 전설↑: 꽃이 뚝 떨어지고 무지개 꽃 6개가 알 주변에 흩날림
        else if(isEgg){ it.innerHTML=eggCrackSvg(t.color, _fx.rainbow, {h:150}); fxCrackChips(4); }   // 알이 크게 갈라지고 틈새로 등급색 빛
        else { it.innerHTML=boxOpenSvg(t.color, _fx.rainbow, {h:150}); it.classList.add('fx-ajar'); }   // 박스: 열린 나무 보물상자 + 틈새 등급색 빛(무지개박스 사용도 v2 통일)
        // 갈라진 틈으로 새어나오는 등급색 픽셀 빛 — 은은한 오오라 + 역회전 광선 2겹(둥근 글로우 금지, 도트). 등급↑ 크고 밝게(--lk)
        st.insertAdjacentHTML('afterbegin','<div class="fx-cracklight" style="color:'+t.color+';--lk:'+lk+'">'+lightLayers({aura:170, rays:220, rainbow:exL})+'</div>');   // 한정=틈새로 새는 빛도 무지개
      }, t0);
      _fxT(()=>{ fxBurst(epic, isEgg, rank); }, t0+700);
      _fxT(fxReveal, t0+700+(isEgg?560:320));   // 알은 껍질 조각이 옆으로 흩어져 앉을 시간을 조금 더 준다
    }
    function fxBurst(big, isEgg, rank){
      const st=$('catFx').querySelector('.fx-stage'); if(!st) return;
      const it=$('fxItem'); if(it) it.style.visibility='hidden';
      rank=rank||0;
      const bc=(_fx&&_fx.res&&_fx.res.tier==='exclusive')?'RAINBOW':'currentColor';   // 한정 버스트 광선=무지개
      const parts=12+rank*7;                          // 등급 높을수록 픽셀 파티클 더 많이(화려하게)
      const rays=(rank>=3)?'<div class="fx-pixrays">'+raysSvg(bc,{h:360})+'</div>':'';       // 특별↑ 등급색(한정=무지개) 픽셀 광선(선버스트)
      const sparks=(rank>=3)?fxSparkles(6+rank*3):'';             // 특별↑ 추가 반짝임(등급색)
      st.insertAdjacentHTML('beforeend','<div class="fx-pixflash">'+raysSvg(bc,{h:150})+'</div>'+rays+sparks+(isEgg?fxShells():'')+fxParticles(parts));
      const h=$('fxHint'); if(h) h.remove();
    }
    // 🔤 픽셀(도트) 텍스트 — 저해상도 캔버스에 굵게 그린 뒤 알파를 1비트로 하드엣지 처리하고, 표시 시 확대(image-rendering:pixelated)해 '도트 폰트'처럼 블록지게. fill=색 문자열 또는 'RAINBOW'(가로 무지개). 한글 임의 텍스트(펫 이름 포함)도 커버. 캔버스 미지원/에러 시 일반 텍스트로 안전 폴백.
    // 🔤 결과 텍스트(등급·아이템 이름) 렌더 — 예전엔 저해상도+1비트 알파로 '도트 폰트'를 흉내냈지만 한글이 뭉개져(획 손실) 가독성이 나빴다.
    //  → 이제 표시 크기의 레티나(devicePixelRatio) 해상도로 안티에일리어싱해 그려 '선명하게'(fill=색/RAINBOW 유지, 무대 그림자·굵기는 CSS). 캔버스 미지원 시 일반 텍스트 폴백.
    function pixelTextHtml(text, fill, opt){
      opt=opt||{}; text=String(text==null?'':text);
      try{
        if(typeof document==='undefined' || !document.createElement) throw 0;
        const dh=opt.h||Math.round((opt.base||14)*2);   // 표시 높이(px)
        const dpr=Math.max(2, Math.min(3, (typeof window!=='undefined' && window.devicePixelRatio) || 2));   // 최소 2배 슈퍼샘플 → 확대해도 선명
        const H=Math.max(8, Math.round(dh*dpr));         // 캔버스(고해상) 높이
        const fpx=Math.max(6, Math.round(H*0.70));       // 폰트 크기(높이의 ~70%, 한글 여백 확보)
        const font='900 '+fpx+'px system-ui,-apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif';
        let cv=document.createElement('canvas'), g=cv.getContext('2d'); if(!g) throw 0;
        g.font=font; const tw=Math.max(1, Math.ceil(g.measureText(text).width));
        const pad=Math.round(H*0.09)+2, W=tw+pad*2;
        cv.width=W; cv.height=H; g=cv.getContext('2d'); g.font=font; g.textBaseline='middle';
        if(fill==='RAINBOW'){ const grd=g.createLinearGradient(0,0,W,0); const RB=['#F04452','#F0883C','#F2C84B','#2FAE7A','#3182F6','#9B6FC8']; RB.forEach(function(c,i){ grd.addColorStop(i/(RB.length-1), c); }); g.fillStyle=grd; }
        else g.fillStyle=fill||'#ffffff';
        g.fillText(text, pad, H/2+Math.round(H*0.02));
        const url=cv.toDataURL('image/png');
        return '<img class="pxtext'+(opt.cls?' '+opt.cls:'')+'" src="'+url+'" alt="'+escapeHtml(text)+'" style="height:'+dh+'px;width:auto;image-rendering:auto;">';
      }catch(e){ const rb=(fill==='RAINBOW'), cls=[opt.cls, rb?'tier-rainbow':''].filter(Boolean).join(' '); return '<span'+(cls?' class="'+cls+'"':'')+((!rb&&fill)?' style="color:'+fill+'"':'')+'>'+escapeHtml(text)+'</span>'; }   // 폴백: 무지개는 tier-rainbow로(부모 .fx-tier가 color:transparent라 안 보이는 것 방지)
    }
    // 등장 연출 — 등급마다 화려함이 다르게 (CSS .fx-reveal.rank-N/.rev-rb로 계단식 확대):
    //  낮은 등급=작은 오오라+약간의 반짝임, 특별↑=발산 광선 등장, 전설↑=픽셀 링 충격파+컨페티 폭발, 무지개=무지개 프레임·컨페티.
    function fxReveal(){
      if(!_fx) return; const fx=$('catFx'); const t=tierInfo(_fx.res.tier);
      const rank=Math.max(0, TIER_ORDER.indexOf(_fx.res.tier));
      const rb=!!_fx.rainbow;                                             // 무지개(승급 또는 무지개알 구매)
      const ex=_fx.res.tier==='exclusive';                               // 🌈 한정 펫 → 빛·프레임(박스)을 무지개로
      const conf=rb?32:(rank<=0?0:rank<=1?10:rank<=2?16:20+(rank-2)*8);   // 등급↑ 컨페티 더 많이(일반=없음)
      const tw=5+rank*3;                                                  // 트윙클 수(등급↑ 많이)
      const art=isEggKind(_fx.kind)?catFace(_fx.res.id,{h:118,eager:true}):rewardBoxArt(_fx.res);   // eager: 등장 즉시 표시(lazy면 ~1초 늦게 뜸)
      // 🎬 씬은 모든 1뽑에 표시(2026-07 사용자 지침): 판정은 fxSceneMode 단일 소스(대기·탭·리빌 동일) — 무지개=밤·뜰알/신화/한정 펫알=픽업·랜덤박스=보석·그 외 펫알=노을.
      //   ⭐ 특별(epic)↑에서만 '센터피스'가 스르르 등장: 노을=지는 해가 서서히 떠오름 · 보석=커다란 무지개 다이아가 제자리 스르르(아래 tenSkyRiseSun/Dia).
      const isDd=_fx.kind==='ddeul';
      const sceneGate = rank >= Math.max(0, TIER_ORDER.indexOf('epic'));   // 특별(epic)↑ = 센터피스 등장 조건(씬 유무 아님)
      const pickupCase = isDd || (isEggKind(_fx.kind) && (_fx.res.tier==='limited' || _fx.res.tier==='exclusive'));   // 뜰알 항상 · 펫알 신화/한정 = 픽업 씬(해/다이아 없음)
      const usesPkReveal = !rb;   // 무지개(밤)만 배너 하늘 배경, 그 외(픽업/보석/노을)는 pk-reveal 전체화면 → 펫·텍스트를 rev-scene으로 그 위에
      const skyLayer = fxSceneBg(_fx.kind, _fx.rainbow);   // 씬 HTML 단일 소스(대기/탭 배경과 동일 — 모든 등급 표시, 센터피스 미포함)
      fx.innerHTML='<div class="fx-scrim"></div>'+skyLayer+'<div class="fx-reveal tier-'+t.id+' rank-'+rank+((rb||ex)?' rev-rb':'')+(usesPkReveal?' rev-scene':'')+'">'+   // 한정도 rev-rb(무지개 프레임=박스)
        '<div class="fx-art pop">'+
          '<span class="fx-aurawrap">'+lightLayers({aura:210, rays:250, rainbow:ex})+'</span>'+   // 펫 뒤 픽셀 오오라(한정=무지개 빛). 특별↑은 발산 광선까지 CSS로 표시
          '<span class="fx-ring"></span>'+                                            // 전설↑/무지개: 픽셀 링 충격파(CSS)
          '<span class="fx-twinkles">'+fxAuraTwinkles(tw, ex)+'</span>'+                // 펫 둘레 트윙클 도트(한정=무지개)
          '<span class="fx-frame"></span>'+
          '<span class="fx-artimg">'+art+'</span>'+
          ((_fx.dupAff&&_fx.dupAff.lvTo>_fx.dupAff.lvFrom)?fxAffLvUpHtml():'')+        // 💗 중복 펫 애정 레벨업 — 하트 뿅뿅 + UP!
          (_fx.isNew?newBadgeSvg({h:30}):'')+                                          // 🌈 처음 획득: 무지개 픽셀 "NEW" 배지(펫/아이템 위에서 물결)
        '</div>'+
        '<div class="fx-tier">'+pixelTextHtml(t.name, (t.id==='exclusive'?'RAINBOW':(t.color||'#ffffff')), {h:40, base:13, cls:'fx-pxtier'})+'</div>'+
        '<div class="fx-name">'+pixelTextHtml((isEggKind(_fx.kind)?catName(_fx.res.id):rewardName(_fx.res)), (_fx.res.tier==='exclusive'?'RAINBOW':(t.color||'#ffffff')), {h:30, base:14, cls:'fx-pxname'})+'</div>'+
        '<div class="fx-reward">'+(_fx.gold?'<span class="rw"><span class="ci">'+goldSvg({h:18})+'</span>+1 금화</span>':'')+
          (_fx.dup?(_fx.dupAff
            ?'<span class="rw"><span class="ci">'+heartSvg({h:18})+'</span>+'+_fx.dupAff.aff+' 애정 (중복)'+(_fx.dupAff.silver?' · '+coinSvg({h:14})+'+'+_fx.dupAff.silver+' Lv'+_fx.dupAff.lvTo+'!':'')+(_fx.dupAff.gold?' · +'+_fx.dupAff.gold+' 금화':'')+(_fx.dupAff.rbc?' · '+rainbowCoinSvg({h:14})+'+'+_fx.dupAff.rbc:'')+'</span>'
            :(_fx.dupRbc
              ?'<span class="rw"><span class="ci">'+rainbowCoinSvg({h:18})+'</span>+'+_fx.dupRbc+' 무지개동전 (중복)</span>'
              :'<span class="rw"><span class="ci">'+coinSvg({h:18})+'</span>+'+_fx.refund+' 은화 (중복)</span>')):'')+'</div>'+
        '<button class="btn" '+App.view.act('closeFx')+'>확인</button>'+
        '<div class="fx-confetti">'+(conf?fxConfetti(conf):'')+'</div></div>';
      // 🎬 특별↑ 센터피스 스르르 등장(사용자 지침): 펫알=노을 해가 서서히 떠오름 · 랜덤박스=커다란 보석이 제자리 스르르. 무지개(밤)는 기존대로 박스만 다이아.
      const _scEl=fx.querySelector('.pkscene');
      if(_scEl){
        if(_fx.kind==='box'){ if(rb || sceneGate) tenSkyRiseDia(_scEl); }                              // 💎 랜덤박스: 특별↑ 또는 무지개=커다란 보석
        else if(isEggKind(_fx.kind) && !isDd && !pickupCase && sceneGate) tenSkyRiseSun(_scEl);        // 🌅 펫알(노을): 특별↑=해 떠오름(신화/한정=픽업·무지개=밤이라 제외)
      }
      fx.className='fx on reveal';
    }
    function closeFx(){ _fxClear(); const fx=$('catFx'); if(fx){ fx.className='fx'; fx.innerHTML=''; } _fx=null; _devPickupOverride=null; try{ document.body.classList.remove('fx-open'); }catch(e){} pullEnd(); }   // (_pkV2는 이제 상시 true — 리셋 안 함)

    // ================= 🥚×10 10연차 뽑기 연출 (개발자 미리보기 전용 · 인벤토리 무소모) =================
    // 단일 뽑기(_fx)와 완전 분리된 _fx10 상태로 구동. 타이머는 전부 _fxT/_fxClear 경유. 배경은 pickupSceneHtml('reveal')(캐시) 재사용.
    // 흐름: 둥지 하강 → 탭1 흔들 → 탭2 무지개알/나비+하늘무지개 → 탭3 카메오 툭치기·오픈 → 결과 10장(무작위) → 둥지에 펫 10마리 정면.
    let _fx10=null;
    const TEN_N=10, TEN_COLS=2;
    const TEN_DROP=900, TEN_WALK=1800, TEN_TAP=160, TEN_HIT=180, TEN_STEP=1600;   // 길이감 튜닝 손잡이
    const TEN_CARD_LOCK=1000;   // 🆕 NEW·신화·한정 카드 최소 표시 잠금(ms) — 연타로 지나침 방지
    function tenShuffle(n){ const a=Array.from({length:n},(_,i)=>i); for(let i=n-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
    function tenScaleFor(id){ return petActorPx(id, 44, 110); }   // 실제 설정 크기(petScale 비례, 룸/dock·배회와 동일 표기) — 반감 없음
    function tenEggSvg(it, stage){
      if(it.kind==='box') return '<span class="ten-boxegg">'+((it.rainbow&&it._rbShown)?rainbowBoxSvg({h:54}):boxSvg({h:54}))+'</span>';   // 랜덤박스(무지개박스 승급 시 무지개)
      if(it.kind==='ddeul'){ if(!it._flw) it._flw=randDdeulFlower(); return '<span class="ten-ddeulegg">'+ddeulFxHtml(it._flw)+'</span>'; }   // 뜰알: 꽃+몸통 분리(탭 시 꽃 팔랑) + 알마다 꽃 색 랜덤
      if(_fx10 && _fx10.v2 && it.kind==='egg'){   // 🎨 v2(배너관리 미리보기): 밤(무지개 배너)=신규 무지개알·그 외=신규 펫알(새싹) — 뜰알처럼 꽃/새싹+몸통 분리
        return '<span class="ten-ddeulegg ten-egg2">'+(_fx10.theme==='night'?rbEgg2FxHtml():egg2FxHtml(it._sprRb))+'</span>'; }
      if(it.rainbow && it._rbShown) return rainbowEggStage(Math.min(stage,2),{h:52});   // h 속성으로 크기 확정(오픈 알과 동일) — width:100%/height:auto 는 WebView서 작게 뭉개짐
      return eggSvg(stage,{h:52}); }
    // 둥지(뒤판+앞테두리) + 알 10개 흩뿌림(TEN_POS, 비겹침) / 피날레 펫. 알·펫 위치 동일(같은 좌표·z).
    function tenNestHtml(items, mode){
      const cells=items.map(function(it){ let inner;
        if(mode==='finale'){ const t=tierInfo(it.tier), ex=it.tier==='exclusive';
          if(it.kind==='box'){ const ph=62;   // 박스: 펫 대신 획득한 가구/바닥/벽지 썸네일이 둥지에 떠 있음(로밍 없음)
            inner='<span class="ten-petaura">'+auraSvg(ex?'RAINBOW':(t.color||'#ffffff'),{h:Math.round(ph*1.05)})+'</span>'+
              '<span class="ten-bob ten-boxitem" style="animation-delay:'+(it.i*0.07).toFixed(2)+'s">'+rewardBoxArtH(it, ph)+'</span>'; }
          else { const ph=tenScaleFor(it.id);
            inner='<span class="ten-petaura">'+auraSvg(ex?'RAINBOW':(t.color||'#ffffff'),{h:Math.round(ph*0.95)})+'</span>'+   // 뒤에 등급색 은은한 오오라(펫 크기 비례, 한정=무지개)
              '<span class="ten-bob" style="animation-delay:'+(it.i*0.07).toFixed(2)+'s">'+catFace(it.id,{h:ph,eager:true})+'</span>'; } }
        else { inner=tenEggSvg(it, 0); }
        const p=TEN_POS[it.i]||[50,50];   // [left%, top%] — 위→아래(뒤→앞), z=it.i로 앞줄 알이 위로
        return '<div class="ten-egg" id="tenEgg'+it.i+'" data-i="'+it.i+'" style="left:'+p[0]+'%;top:'+p[1]+'%;z-index:'+(it.i+1)+';">'+inner+'</div>'; }).join('');
      if(mode==='finale')   // 피날레: 둥지 없이 펫만(등급색 실루엣 뒤배경). 알 위치와 동일한 흩뿌림 좌표 유지.
        return '<div class="ten-nest finale"><div class="ten-scatter">'+cells+'</div></div>';
      return '<div class="ten-nest">'+
        '<div class="ten-nestback">'+nestSvg({})+'</div>'+
        '<div class="ten-scatter">'+cells+'</div>'+
        '<div class="ten-nestfront">'+nestFrontSvg({})+'</div></div>';
    }
    // 하늘 무지개(탭2 조건 충족 시 스르르) — 픽업 배너 기본 무지개(.pk-rainbow)는 숨기고 전용 요소로 낸다
    function tenSkyRainbow(wrap){ if(!wrap || wrap.querySelector('.ten-skyrb')) return;
      const el=document.createElement('span'); el.className='ten-skyrb'; el.innerHTML=authRainbowSvg({h:74}); wrap.appendChild(el); }
    // 🌅 노을(펫알) 하늘 연출 — 해가 아래에서 위로 스르르 떠오름(도트 해 M_SUN 재사용).
    function tenSkyRiseSun(wrap){ if(!wrap || wrap.querySelector('.ten-skysun')) return;
      const el=document.createElement('span'); el.className='ten-skysun'; el.innerHTML=sunSvg({h:96}); wrap.appendChild(el); }
    // 💎 보물(랜덤박스) 하늘 연출 — 거대 무지개 다이아가 하늘 높은 곳에서 '제자리 스르르' 페이드 등장(이동 없음).
    //    노을 해(tenSkyRiseSun)와 동일 조건·동일 시점(무지개 승급 아이템이 있을 때만, 1뽑=fxReveal·10뽑=tenTap2)에서 호출.
    function tenSkyRiseDia(wrap){ if(!wrap || wrap.querySelector('.ten-skydia')) return;
      const el=document.createElement('span'); el.className='ten-skydia'; el.innerHTML=tDiaLayersHtml(1.55); wrap.appendChild(el); }
    // 🌠 밤(무지개) 하늘 연출 — 큰 무지개 별똥별이 좌측상단→우측하단으로 무지개빛 내며 떨어짐.
    function tenSkyShoot(wrap){ if(!wrap || wrap.querySelector('.ten-skyshoot')) return;
      const el=document.createElement('span'); el.className='ten-skyshoot'; el.innerHTML=shootStarSvg({h:82}); wrap.appendChild(el); }
    // 하늘 연출 라우터(테마별): sunset=해 떠오름 · night=무지개 별똥별 · 그 외(뜰알 meadow)=무지개.
    function tenSkyFx(wrap){ if(!_fx10) return; const th=_fx10.theme;
      // 🌇 sunset·🌙 night 은 이제 씬(sunsetSceneHtml/nightSceneHtml reveal)에 pk-risesun·pk-shoot이 상시 들어가므로 탭 연출은 무지개(뜰알)만.
      if(th!=='sunset' && th!=='night' && th!=='treasure') tenSkyRainbow(wrap); }
    // 🌿 하단 초원 채우기 — 세로 긴 화면의 빈 초록을 꽃·풀·나무·나비로. pkRand로 결정적 배치.
    function tenMeadowHtml(){
      const lite=liteMode(); const FT=['r','y','p'], BT=['o','b','p','y']; let h='';   // 초록 공백 채우기 — 필드(bottom 0~56%, sky seam 60% 밑) 전반에 촘촘히(꽃·풀·돌·흙)
      // 🌸 꽃 — 필드 전반 + 전경(0~24%, 배회 바닥 아래) 포함
      for(let i=0;i<(lite?12:30);i++){ const l=(3+pkRand(i,11)*94).toFixed(1), b=(1+pkRand(i,12)*55).toFixed(1), s=Math.round(10+pkRand(i,13)*9);
        h+='<span class="ten-md" style="left:'+l+'%;bottom:'+b+'%">'+flowerSvg(FT[i%3],{h:s})+'</span>'; }
      // 🌱 풀(포기) — 더 촘촘히
      for(let i=0;i<(lite?12:28);i++){ const l=(2+pkRand(i,21)*95).toFixed(1), b=(0+pkRand(i,22)*56).toFixed(1), s=Math.round(12+pkRand(i,23)*11);
        h+='<span class="ten-md" style="left:'+l+'%;bottom:'+b+'%">'+tuftSvg({h:s})+'</span>'; }
      // 🌿 전경 프레이밍 — 화면 하단 좌우 큰 풀·꽃(빈 하단 채움)
      if(!lite){ h+='<span class="ten-md" style="left:4%;bottom:1%">'+tuftSvg({h:30})+'</span><span class="ten-md" style="left:96%;bottom:1%">'+flowerSvg('p',{h:26})+'</span>'+
        '<span class="ten-md" style="left:14%;bottom:0%">'+tuftSvg({h:24})+'</span><span class="ten-md" style="left:87%;bottom:0%">'+tuftSvg({h:26})+'</span>'; }
      // 🪨 돌 — 낮게(전경~중경) 흩뿌려 빈땅 채움
      for(let i=0;i<(lite?4:9);i++){ const l=(5+pkRand(i,51)*90).toFixed(1), b=(1+pkRand(i,52)*30).toFixed(1), s=Math.round(9+pkRand(i,53)*7);
        h+='<span class="ten-md" style="left:'+l+'%;bottom:'+b+'%;z-index:0;">'+(pkRand(i,54)<0.35?rockSvg({h:s+4}):stoneSvg({h:s}))+'</span>'; }
      // 🟫 흙 — 군데군데 맨땅 패치(pk-soil 재사용)
      for(let i=0;i<(lite?4:10);i++){ const l=(4+pkRand(i,61)*90).toFixed(1), b=(1+pkRand(i,62)*40).toFixed(1), w=Math.round(12+pkRand(i,63)*18);
        h+='<span class="pk-soil" style="left:'+l+'%;bottom:'+b+'%;width:'+w+'px;transform:translateX(-50%);"></span>'; }
      // 🌳 나무(키 큼) — 윗머리가 하늘(60%) 안 넘게
      for(let i=0;i<4;i++){ const l=(8+i*28+pkRand(i,31)*8).toFixed(1), b=(36+pkRand(i,32)*14).toFixed(1), s=Math.round(30+pkRand(i,33)*14);
        h+='<span class="ten-md ten-md-tr" style="left:'+l+'%;bottom:'+b+'%">'+treeTopSvg({h:s})+'</span>'; }
      // 🦋 나비
      if(!lite) for(let i=0;i<6;i++){ const l=(10+pkRand(i,41)*80).toFixed(1), b=(24+pkRand(i,42)*31).toFixed(1), s=Math.round(11+pkRand(i,43)*4);
        h+='<span class="ten-md ten-md-bf" style="left:'+l+'%;bottom:'+b+'%"><span class="bf-wing">'+butterflySvg(BT[i%4],{h:s})+'</span></span>'; }
      return '<div class="ten-meadow" aria-hidden="true">'+h+'</div>';
    }
    // 피날레 1초 후 — 정지 펫을 로밍 액터로 전환(#pkRevStage → 엔진 activeStages가 자동 배회)
    function tenStartRoam(){ const wrap=$('tenWrap'); if(!wrap || !_fx10 || _fx10.phase!=='finale') return;
      const nest=wrap.querySelector('.ten-nest'); if(nest) nest.classList.add('hatched');   // 둥지 속 정지 펫 페이드아웃(둥지만 남김)
      if(wrap.querySelector('#pkRevStage')) return;
      const st=document.createElement('div'); st.className='cd-room pkstage ten-roam'; st.id='pkRevStage'; st.setAttribute('data-noprops','1'); st.setAttribute('aria-hidden','true');
      Object.keys(_petX).forEach(function(k){ if(k.indexOf('pkRevStage:')===0){ delete _petX[k]; delete _petDepth[k]; delete _petVz[k]; delete _petPose[k]; } });   // 이전 배회 잔여 위치·포즈 제거 → 매 10연차 새 랜덤 흩뿌림
      const N=_fx10.items.length, order=tenShuffle(N);   // 슬롯 무작위 배정(간격 보장) + 지터 → 서로 간격 둔 랜덤 시작 위치
      st.innerHTML=_fx10.items.map(function(it,i){ const hh=petActorPx(it.id,44,110);
        let f=(order[i]+0.5)/N + (Math.random()-0.5)*(0.7/N); f=Math.max(0.02, Math.min(0.98, f));   // data-spawnf: 폭 대비 시작 프래션(buildActors가 사용)
        return '<div class="cd-actor" data-cat="'+it.id+'" data-hh="'+hh+'" data-spawnf="'+f.toFixed(3)+'"><span class="cd-shadow"></span>'+catActorHTML(it.id,hh)+'</div>'; }).join('');
      wrap.appendChild(st);
      if(typeof markCatDirty==='function') markCatDirty();
    }
    // 알 주변 나비(뜰알 승급) — ddeulPickupFx 나비 루프를 알 셀 기준 소반경으로 스코프
    function tenEggButterflies(eggEl, it, count){
      const th=_fx10&&_fx10.theme, N=count||(liteMode()?3:6), T=['o','b','p','y','o','b']; let b='';
      for(let i=0;i<N;i++){ const ang=((i+Math.random()*0.7)/N)*Math.PI*2, rx=20+Math.random()*16, ry=16+Math.random()*16;
        const mx=Math.round(Math.cos(ang)*rx), my=Math.round(Math.sin(ang)*ry);
        const hh=9+Math.round(Math.random()*3), dur=(5+Math.random()*4).toFixed(1), del=(-Math.random()*6).toFixed(2);
        let inner; if(th==='night') inner='<span class="ff-core ten-ffcore">'+fireflySvg({h:hh})+'</span>'; else if(th==='sunset') inner='<span class="fx-rbflwig" style="--fd:'+(2.0+Math.random()*1.2).toFixed(2)+'s;animation-delay:'+(-Math.random()*2).toFixed(2)+'s">'+ddeulFlwRbSvg({h:hh+2})+'</span>'; else if(th==='treasure') inner='<span class="fx-rbcoin" style="--fd:'+(1.5+Math.random()*1.0).toFixed(2)+'s;animation-delay:'+(-Math.random()*2).toFixed(2)+'s">'+rainbowCoinSvg({h:hh+2})+'</span>'; else inner='<span class="bf-wing">'+butterflySvg(T[i%T.length],{h:hh})+'</span>';   // 🌇 sunset(펫알)=무지개꽃 · 💎 treasure(랜덤박스)=무지개 동전(사용자 지침) · 그 외=나비
        b+='<span class="fx-ddbfly ten-bfly" style="margin:'+my+'px 0 0 '+mx+'px;--d:'+dur+'s;animation-delay:'+del+'s;'+bflyDriftVars(Math.random)+'">'+inner+'</span>'; }
      const wrap=document.createElement('span'); wrap.className='ten-bflies'; wrap.innerHTML=b; eggEl.appendChild(wrap);
      if(it && it.kind==='ddeul'){ it._flw=DDEUL_FLW_RB; ddeulFlowerRb(eggEl); const fl=eggEl.querySelector('.fx-ddflower'); if(fl) fl.classList.add('ddflw-big'); }   // 🌈 뜰알: 이 알 꽃을 무지개색으로(오픈까지 it._flw로 유지) + 좀 더 크게(ddflw-big)
      else if(it && _fx10 && _fx10.v2 && it.kind==='egg' && _fx10.theme!=='night'){ it._sprRb=true;   // 🌱 v2 펫알: 새싹이 커지며 무지개색(뜰알 꽃과 동일 조건·타이밍, 오픈까지 it._sprRb로 유지). 밤(무지개알)은 이미 무지개 꽃이라 제외.
        const fl=eggEl.querySelector('.fx-ddflower'); if(fl){ fl.innerHTML=egg2SprRbSvg(); fl.classList.add('ddflw-rb','ddflw-big'); } }
    }
    // 카메오 펫 선정: 🌈 무지개 10연(rb·미리보기 night 테마)=한정 펫 랜덤(무조건), 한정(뜰알)=픽업 펫(흑표범·퓨마), 그 외 전설↑=전설/신화 스프라이트 랜덤
    function tenCameoPet(it){
      if(_fx10 && (_fx10.rb || _fx10.theme==='night')){ const ex=exCameoPool(); if(ex.length) return ex[Math.floor(Math.random()*ex.length)]; }
      if(it.tier==='exclusive'){ const pk=pickupMember(); if(pk) return pk; }
      const pool=PET_CATALOG.filter(function(c){ const t=CAT_TIER[c.id]; return (t==='legend'||t==='limited') && hasSprite(c.id); }).map(function(c){ return c.id; });
      return pool.length?pool[Math.floor(Math.random()*pool.length)]:it.id; }
    // 카메오 1마리 생성 — fxSpawnCat 클론이되 '그 알'의 가로중심(left%)·바닥(--floor)에 정합
    function tenSpawnCameo(wrap, it, side, id){
      const eggEl=$('tenEgg'+it.i); if(!eggEl||!wrap) return;
      const isPet=!!(id && hasSprite(id));
      const size=isPet?Math.max(90, Math.min(230, Math.round(120*effPetScale(id)))):150;   // 🐘 10연 등장도 압축·등급차등 반영
      const el=document.createElement('div');
      el.className='fx-cat ten-cat walkin fxc-'+side+(isPet?' fxc-pet':' fxc-gc');
      el.setAttribute('data-i', it.i); el.style.setProperty('--cat', size+'px');
      const wr=wrap.getBoundingClientRect(), er=eggEl.getBoundingClientRect();
      const cx=wr.width?((er.left+er.width/2 - wr.left)/wr.width*100):50;
      el.style.left=Math.max(4,Math.min(96,cx)).toFixed(2)+'%';
      el.style.setProperty('--floor', Math.round(er.bottom - wr.top)+'px');   // 알 바닥의 wrap 기준 절대 Y(offsetParent 불일치 방지)
      const fpKey=isPet?(id+':fxwalk'):'_gc', fpDef=(isPet&&typeof PET_FOOT_PAD!=='undefined')?PET_FOOT_PAD:(typeof GACHACAT_FOOT_DEFAULT!=='undefined'?GACHACAT_FOOT_DEFAULT:0.1);
      el.style.setProperty('--foot', (typeof _footPad!=='undefined'&&_footPad[fpKey]!=null?_footPad[fpKey]:fpDef).toFixed(3));
      if(isPet){ ensurePetArt(id); el.innerHTML='<div class="fxc-in">'+catActorHTML(id, size)+'</div>'; }
      else { el.innerHTML='<div class="fxc-in"></div>'; }
      if(typeof measureFxFoot==='function') measureFxFoot(isPet?id:null, function(fp){ el.style.setProperty('--foot', fp.toFixed(3)); });
      wrap.appendChild(el);
    }
    // 알 오픈(크랙+틈새빛)
    function tenOpenEgg(it){ const el=$('tenEgg'+it.i); if(!el||it._open) return; it._open=true;
      const t=tierInfo(it.tier), ex=it.tier==='exclusive';
      const v2e=_fx10 && _fx10.v2 && it.kind==='egg', v2rb=v2e && _fx10.theme==='night';   // 🎨 v2 신규 펫알/무지개알(균열 없음 — 뜰알처럼 그대로 빛남)
      el.classList.add('open'); el.style.color=ex?'':(t.color||'#fff');
      el.innerHTML=(it.kind==='box'?'<span class="ten-boxegg">'+boxOpenSvg(t.color, !!(it.rainbow&&it._rbShown), {h:54})+'</span>'
        :it.kind==='ddeul'?ddeulEggSvg({h:52}, it._flw)
        :v2e?'<span class="ten-ddeulegg ten-egg2">'+(v2rb?rbEgg2FxHtml():egg2FxHtml(it._sprRb))+'</span>'
        :eggCrackSvg(t.color, !!(it.rainbow&&it._rbShown), {h:52}))+
        '<span class="ten-crlight">'+lightLayers({aura:64, rays:82, rainbow:ex})+'</span>';
      el.classList.remove('shake','tremble'); void el.offsetWidth; el.classList.add('hit');
      if(v2rb && tierRank(it.tier)>=tierRank('legend')) rbFlowerDropFx(el, el, true);   // 🌈🌸 v2 무지개알 전설↑: 꽃 뚝 + 무지개 꽃 6개 흩날림(알 스케일)
      if(!liteMode()){ const s=document.createElement('span'); s.className='ten-eggfx'; s.innerHTML=fxSparkles(5); el.appendChild(s); }
    }
    // 진입점 — items=[{id,tier,kind,rainbow,dup,refund,isNew}]×10
    // 10뽑 배경 씬(테마별) — sunset(펫알)=노을·night(무지개)=밤 리빌 씬, 그 외=픽업 리빌 씬. sunset/night은 자체 데코라 초록 meadow 생략.
    function tenSceneBg(){ const th=_fx10&&_fx10.theme; return th==='treasure'?treasureSceneHtml('reveal'):th==='sunset'?sunsetSceneHtml('reveal'):th==='night'?nightSceneHtml('reveal'):pickupSceneHtml('reveal'); }
    // 🌇🌙 테마별 채움 메도(노을/밤) — 리빌 배경 씬 위·펫 뒤에 꽃·풀·나무·돌·날아다니는 요소를 촘촘히 얹어 '펫 배회구역~벽지' 빈 공간을 컨셉에 맞게 메운다.
    function tenMeadowThemed(theme){
      const lite=liteMode(), night=(theme==='night'); let h='';
      const NF=['a','b','c'], SF=['su','sg','sw'];
      const flower=function(i,sp){ return night?nightFlowerSvg(NF[i%3],{h:sp}):flowerSvg(SF[i%3],{h:sp}); };
      const tuftf=function(sp){ return night?nightTuftSvg({h:sp}):tuftSvg({h:sp}); };
      const stonef=function(sp){ return night?nightStoneSvg({h:sp}):stoneSvg({h:sp}); };
      // 🌸 꽃 — 필드 전반(전경~벽지 밑까지)
      for(let i=0;i<(lite?12:28);i++){ const l=(3+pkRand(i,11)*94).toFixed(1), b=(1+pkRand(i,12)*56).toFixed(1), sp=Math.round(9+pkRand(i,13)*8);
        h+='<span class="ten-md" style="left:'+l+'%;bottom:'+b+'%">'+flower(i,sp)+'</span>'; }
      // 🌱 풀 — 촘촘히
      for(let i=0;i<(lite?12:26);i++){ const l=(2+pkRand(i,21)*95).toFixed(1), b=(0+pkRand(i,22)*57).toFixed(1), sp=Math.round(11+pkRand(i,23)*10);
        h+='<span class="ten-md" style="left:'+l+'%;bottom:'+b+'%">'+tuftf(sp)+'</span>'; }
      // 🌿 전경 프레이밍(하단 좌우)
      if(!lite){ h+='<span class="ten-md" style="left:4%;bottom:1%">'+tuftf(30)+'</span><span class="ten-md" style="left:96%;bottom:1%">'+flower(1,26)+'</span>'; }
      // 🪨 돌·🟫 흙(낮게)
      for(let i=0;i<(lite?4:8);i++){ const l=(5+pkRand(i,51)*90).toFixed(1), b=(1+pkRand(i,52)*30).toFixed(1), sp=Math.round(9+pkRand(i,53)*6);
        h+='<span class="ten-md" style="left:'+l+'%;bottom:'+b+'%;z-index:0;">'+stonef(sp)+'</span>'; }
      for(let i=0;i<(lite?4:9);i++){ const l=(4+pkRand(i,61)*90).toFixed(1), b=(1+pkRand(i,62)*42).toFixed(1), w=Math.round(12+pkRand(i,63)*16);
        h+='<span class="pk-soil" style="left:'+l+'%;bottom:'+b+'%;width:'+w+'px;transform:translateX(-50%);"></span>'; }
      // 🌳 나무 — 중경(펫 뒤·벽지 앞)에 배치해 빈 중간을 채움
      for(let i=0;i<5;i++){ const l=(6+i*22+pkRand(i,31)*8).toFixed(1), b=(34+pkRand(i,32)*18).toFixed(1), sp=Math.round(28+pkRand(i,33)*16);
        const tr=night?(i%2?nightPineSvg({h:sp}):nightTreeSvg({h:sp})):mapleSvg({h:sp});
        h+='<span class="ten-md ten-md-tr" style="left:'+l+'%;bottom:'+b+'%">'+tr+'</span>'; }
      // ✨ 날아다니는 요소 — 밤=반딧불·가을=고추잠자리 (중경 공중 채움, 드리프트)
      if(!lite){ const P=pkSlots(7,470); for(let i=0;i<7;i++){ const o=P[i], l=o.x, b=(22+(1-o.yy)*36).toFixed(1), sp=Math.round((9+pkRand(i,43)*3)*(0.72+o.yy*0.5)),   // ✨ 반딧불/잠자리 — 그리드 균일+원근
        dur=(6+pkRand(i,44)*5).toFixed(1), del=(-pkRand(i,46)*7).toFixed(2); let _s=70; const rnd=function(){ return pkRand(i,_s++); };
        if(night) h+='<span class="pk-fire" style="left:'+l+'%;bottom:'+b+'%;--d:'+dur+'s;--bd:'+(1+pkRand(i,45)*1.4).toFixed(2)+'s;animation-delay:'+del+'s;'+bflyDriftVars(rnd)+'"><span class="ff-core">'+fireflySvg({h:sp})+'</span></span>';
        else h+='<span class="pk-dfly" style="left:'+l+'%;bottom:'+b+'%;--d:'+dur+'s;animation-delay:'+del+'s;'+bflyDriftVars(rnd)+'"><span class="df-body">'+dragonflySvg({h:sp})+'</span></span>'; } }
      // 🍁 가을: 살랑 내려오는 단풍잎 몇 장 더
      if(!lite && !night) for(let i=0;i<6;i++){ const l=((i+0.5)/6*88+6+(pkRand(i,81)-0.5)*(80/6)).toFixed(1), d=pkRand(i,88), dur=(7+d*5).toFixed(1), del=(-pkRand(i,83)*9).toFixed(2), sw=(2.4+pkRand(i,84)*1.5).toFixed(1), sp=Math.round((9+pkRand(i,85)*4)*(0.72+(1-d)*0.5)), dir=(pkRand(i,86)<0.5?-1:1);
        h+='<span class="pk-fallleaf" style="left:'+l+'%;--d:'+dur+'s;--sw:'+sw+'s;--dir:'+dir+';animation-delay:'+del+'s;"><span class="fl-in">'+mapleLeafSvg({h:sp}, LEAF_COLS[Math.floor(pkRand(i,87)*LEAF_COLS.length)])+'</span></span>'; }
      return '<div class="ten-meadow'+(night?' ten-mnight':'')+'" aria-hidden="true">'+h+'</div>';
    }
    function tenMeadowBg(){ const th=_fx10&&_fx10.theme; if(th==='treasure') return ''; return (th==='sunset'||th==='night')?tenMeadowThemed(th):tenMeadowHtml(); }
    function runTenGachaFx(list, opts){ opts=opts||{}; _fxClear(); _fx=null; try{ document.body.classList.add('fx-open'); }catch(e){}   // 미리보기 경로(pullBegin 안 거침)도 커버
      // side = 알의 '실제 화면 위치'(TEN_POS 흩뿌림 x) 기준 좌/우 → 카메오가 가까운 쪽에서 걸어와 알을 지나치지 않게(격자 i%2는 흩뿌림과 안 맞아 반대편서 걸어와 다른 알을 지나쳐 치던 버그).
      const items=(list||[]).slice(0,TEN_N).map(function(it,i){ return Object.assign({ kind:'egg' }, it, { i:i, col:i%TEN_COLS, row:(i/TEN_COLS|0), side:((TEN_POS[i]&&TEN_POS[i][0]<50)?'l':'r'), _rbShown:!!(opts.rb && it.rainbow) }); });   // 🌈 무지개 10연=둥지에 처음부터 무지개알/박스 10개 배치(탭 전에도 rainbow 표시)
      const isBox = opts.kind==='box' || (items[0]&&items[0].kind==='box');   // 🎁 랜덤박스 10연차: 카메오·로밍 없음(가구는 못 걸어다님) → 정적 리빌/피날레
      _fx10={ items:items, order:tenShuffle(items.length), stage:0, busy:true, phase:'nest', ridx:0, preview:!!opts.preview, isBox:isBox, rb:!!opts.rb, v2:_pkV2,   // rb=무지개 10연(한정 카메오 무조건) · v2=배너관리 미리보기(신규 펫알/무지개알 아트·뜰알식 연출)
        theme: opts.theme||(isBox?'':'rainbow'),   // 🌇 sunset=노을(펫알): 배경 노을 씬 + 무지개 하늘 연출 생략. 박스=기본 초원.
        skyRainbow: !isBox && items.some(function(x){ return x.tier==='limited'||x.tier==='exclusive'; }) };
      items.forEach(function(x){ if(hasSprite(x.id)) ensurePetArt(x.id); });
      if(typeof prewarmGachaFxPads==='function') prewarmGachaFxPads();
      const fx=$('catFx'); if(!fx) return;
      if(!fx._tenTapBound){ fx._tenTapBound=true; fx.addEventListener('pointerup', tenTapDelegate); }   // 🍏 iOS: div 인라인 onclick(자식→부모 위임)이 안 먹는 문제 → 포인터업으로 위임(한 번만 바인딩)
      const rm=reducedMotion();   // 모션 최소화만 즉시 결과(옛 '빠른 연출' 스킵 폐기)
      fx.innerHTML='<div class="fx-scrim"></div><div class="ten-wrap" id="tenWrap" role="button" tabindex="0">'+
        tenSceneBg()+tenMeadowBg()+tenNestHtml(items, 'eggs')+
        '<div class="ten-hint" id="tenHint">'+pixelTextHtml(rm?'탭하여 결과 보기':'둥지를 탭하세요', '#ffffff', {h:16})+'</div></div>';
      fx.className='fx on ten';
      if(rm){ _fx10.busy=false; return; }
      const nest=fx.querySelector('.ten-nest'); if(nest) nest.classList.add('drop');
      _fxT(function(){ _fx10.busy=false; }, TEN_DROP+120);
    }
    // 🍏 iOS Safari 대응: div의 인라인 onclick(자식→부모 위임)은 cursor:pointer가 있어도 SVG/자식 탭에서 click이 안 생기는 경우가 있다.
    //  → #catFx에 pointerup 하나만 위임 바인딩(포인터 이벤트는 iOS서도 자식 탭에서 정상 발생·버블). 현재 단계에 맞는 핸들러로 라우팅. 버튼(SKIP·입양)은 자체 onclick으로 처리하므로 무시.
    function tenTapDelegate(e){ if(!_fx10) return;
      if(e && e.target && e.target.closest && e.target.closest('button,.ten-skip,.ten-takebtn')) return;
      if(_fx10.phase==='finale') tenFinaleTap(); else tenTap(); }
    function tenTap(){ if(!_fx10||_fx10.busy) return;
      if(_fx10.phase==='reveal'){ tenRevealNext(); return; }
      if(_fx10.phase==='opened'){ tenBeginReveal(); return; }   // 3탭 후 알 빛나는 상태 → 1초 뒤 활성화된 탭으로 결과 진입
      if(_fx10.phase!=='nest') return;
      if(reducedMotion()){ _fx10.busy=true; tenBeginReveal(); return; }
      _fx10.stage++;
      if(_fx10.stage>=3){ _fx10.busy=true; tenClimax(); return; }
      if(_fx10.stage===1) tenTapShake(1);
      else if(_fx10.stage===2) tenTap2();
    }
    function tenTapShake(stage){ const nest=document.querySelector('.ten-nest'); if(nest){ nest.classList.remove('drop','shake'); void nest.offsetWidth; nest.classList.add('shake'); }
      const shakers=[];   // 🔋 알마다 void offsetWidth(강제 리플로우 N회) 하던 것을 배치: remove 전부 → 리플로우 1회 → add 전부
      _fx10.items.forEach(function(it){ const el=$('tenEgg'+it.i); if(!el) return;
        if(it.kind==='ddeul' || (_fx10.v2 && it.kind==='egg')){ const fl=el.querySelector('.fx-ddflower'); if(fl){ fl.classList.remove('flswing'); shakers.push([fl,'flswing']); } }   // 뜰알·v2 펫알: 꽃/새싹이 팔랑(스윙만 — 균열 재렌더 없음)
        else { el.innerHTML=tenEggSvg(it, stage); }
        el.classList.remove('shake'); shakers.push([el,'shake']); });
      void document.body.offsetWidth;   // 강제 리플로우 1회(애니 재시작용)
      shakers.forEach(function(pr){ pr[0].classList.add(pr[1]); });
      if(stage<2) setTenHint('한 번 더!'); }
    function tenTap2(){ _fx10.items.forEach(function(it){ if((it.kind==='egg'||it.kind==='box') && it.rainbow) it._rbShown=true; });
      tenTapShake(2);
      if(_fx10.skyRainbow) tenSkyFx($('tenWrap'));
      // 🌅 노을(펫알·박스) 하늘 해는 '기본 미표시'(사용자 지침) — 무지개 조건(rbUpgradeChance→it.rainbow) 펫이 하나라도 있으면 그때만 위로 스르르 떠올라 유지.
      if(_fx10.theme==='sunset' && _fx10.items.some(function(it){ return (it.kind==='egg'||it.kind==='box') && it.rainbow; })) tenSkyRiseSun($('tenWrap'));
      // 💎 보물(랜덤박스) 테마: 노을 해와 동일 조건(무지개 승급 있을 때만) → 거대 다이아가 제자리 스르르 등장
      if(_fx10.theme==='treasure' && _fx10.items.some(function(it){ return (it.kind==='egg'||it.kind==='box') && it.rainbow; })) tenSkyRiseDia($('tenWrap'));
      // 알 주변: 뜰알=나비, 펫알·박스=낙엽(단풍잎). 조건 동일(무지개 승급 시). tenEggButterflies가 sunset 테마면 단풍잎을 그린다.
      _fx10.items.forEach(function(it){ const el=$('tenEgg'+it.i); if(!el) return;
        if((it.kind==='egg'||it.kind==='box') && it.rainbow && !liteMode()){ const s=document.createElement('span'); s.className='ten-eggfx'; s.innerHTML=fxSparkles(6); el.appendChild(s); tenEggButterflies(el, it); }   // 무지개 승급 반짝임 + 낙엽(sunset 테마)
        if(it.kind==='ddeul' && (it.tier==='exclusive' || Math.random()<rbUpgradeChance(it.tier))) tenEggButterflies(el, it); });
      setTenHint('마지막 탭!'); }
    function tenClimax(){ const wrap=$('tenWrap'); if(!wrap) return; setTenHint('');
      // 🌸 뜰알·v2 펫알: 알이 빛나기 전에 꽃/새싹이 엄청 흔들리는 연출(단일 climax와 동일 — 알 톡톡 떨림 + 큰 스윙). 각 알이 열릴 때 tenOpenEgg가 해제.
      _fx10.items.forEach(function(it){ if(it.kind==='ddeul' || (_fx10.v2 && it.kind==='egg')){ const el=$('tenEgg'+it.i); if(el){ el.classList.remove('shake'); void el.offsetWidth; el.classList.add('tremble'); } } });
      const legend=tierRank('legend'), lanes={ l:[], r:[] };
      _fx10.items.forEach(function(it){ if(tierRank(it.tier)>=legend) lanes[it.side].push(it); });   // 🐾 전설↑ 아이템엔 펫 카메오가 걸어나와 톡(펫알·박스 동일 조건). 박스=가구지만 걸어오는 건 펫이라 무방.
      let maxEnd=0;
      ['l','r'].forEach(function(side){ lanes[side].forEach(function(it, k){ const base=k*TEN_STEP, id=tenCameoPet(it);
        _fxT(function(){ tenSpawnCameo(wrap, it, side, id); }, base);
        _fxT(function(){ const el=wrap.querySelector('.ten-cat[data-i="'+it.i+'"]'); if(el){ el.classList.remove('walkin'); el.classList.add('arr','tap'); } }, base+TEN_WALK);
        _fxT(function(){ tenOpenEgg(it); }, base+TEN_WALK+TEN_TAP);
        _fxT(function(){ const el=wrap.querySelector('.ten-cat[data-i="'+it.i+'"]'); if(el){ el.classList.remove('tap'); el.classList.add('leave'); } }, base+TEN_WALK+TEN_TAP+TEN_HIT);
        _fxT(function(){ const el=wrap.querySelector('.ten-cat[data-i="'+it.i+'"]'); if(el) el.remove(); }, base+TEN_WALK+TEN_TAP+TEN_HIT+900);
        maxEnd=Math.max(maxEnd, base+TEN_WALK+TEN_TAP+TEN_HIT+900); }); });
      const openAt=Math.max(600, maxEnd?maxEnd-700:600);
      _fxT(function(){ _fx10.items.forEach(function(it){ if(tierRank(it.tier)<legend) tenOpenEgg(it); }); }, openAt);
      const doneAt=Math.max(maxEnd, openAt)+300;
      _fxT(function(){ _fx10.phase='opened'; }, doneAt);   // 알 빛나는 상태 유지
      _fxT(function(){ _fx10.busy=false; setTenHint('탭하여 결과 보기'); }, doneAt+1000);   // 1초 후 탭 활성 → 한 번 더 탭해야 결과로
    }
    function tenBeginReveal(){ _fx10.phase='reveal'; _fx10.ridx=0; _fx10.busy=false; tenShowCard(0); }
    function tenRevealNext(){ if(_fx10.busy) return; _fx10.ridx++;
      if(_fx10.ridx>=_fx10.items.length){ tenFinale(); return; } tenShowCard(_fx10.ridx); }
    // ⏭️ SKIP — 신화(limited)·한정(exclusive) 이외 등급 카드는 한 번에 건너뛰고 다음 신화/한정에서 멈춤(없으면 피날레로).
    function tenSkip(){ if(!_fx10 || _fx10.busy || _fx10.phase!=='reveal') return; const order=_fx10.order, items=_fx10.items;   // busy=NEW·신화·한정 잠금 중(SKIP도 대기)
      let next=_fx10.ridx+1;
      while(next<items.length){ const it=items[order[next]]; if(it && (it.tier==='limited'||it.tier==='exclusive'||it.isNew)) break; next++; }   // 신화·한정 + 🆕 처음 얻는 펫/아이템은 스킵 안 함(멈춰서 보여줌)
      if(next>=items.length){ tenFinale(); return; }
      _fx10.ridx=next; _fx10.busy=false; tenShowCard(next); }
    // 10연차 힌트(둥지 위) — 결과 텍스트와 동일한 픽셀(선명) 렌더로 표시. 빈 문자열이면 지움.
    function setTenHint(txt){ const h=$('tenHint'); if(!h) return; h.innerHTML = txt ? pixelTextHtml(txt, '#ffffff', {h:16}) : ''; }
    function tenShowCard(n){ const it=_fx10.items[_fx10.order[n]]; const fx=$('catFx'); if(!fx) return;
      // 배경(픽업 씬)은 '최초 진입에서 한 번만' 만들고, 이후 카드 전환은 카드 홀더만 교체한다.
      // (매 카드마다 fx.innerHTML을 통째로 다시 만들면 씬이 안 칠해진 한 프레임 동안 반투명 스크림 뒤로 메인화면이 비쳐 '깜빡임'이 생겼다.)
      let holder=fx.querySelector('.ten-cardholder');
      if(!holder){
        fx.innerHTML='<div class="fx-scrim"></div>'+tenSceneBg()+'<div class="ten-cardholder"></div>';
        fx.className='fx on reveal ten-reveal';
        holder=fx.querySelector('.ten-cardholder');
      }
      holder.innerHTML=tenRevealCardHtml(it, n+1, _fx10.items.length);
      // 🆕 NEW·신화·한정 카드는 잠깐 탭 잠금 — 연타로 지나치지 않게 최소 표시 시간을 강제(SKIP 정지 기준과 동일 대상).
      //  잠금 중엔 .ten-lock 이 '탭하여 다음' 힌트·SKIP을 숨기고(CSS), 해제되면 힌트가 나타나 넘길 수 있다는 신호가 된다.
      if(it && (it.isNew || it.tier==='limited' || it.tier==='exclusive')){
        _fx10.busy=true; holder.classList.add('ten-lock');
        _fxT(function(){ if(!_fx10) return; _fx10.busy=false; holder.classList.remove('ten-lock'); }, TEN_CARD_LOCK);
      } else { _fx10.busy=false; holder.classList.remove('ten-lock'); } }
    function tenRevealCardHtml(it, n, total){ const t=tierInfo(it.tier), rank=tierRank(it.tier), ex=it.tier==='exclusive', rb=!!it.rainbow;
      const conf=rb?28:(rank<=0?0:rank<=2?12:20+(rank-2)*8), tw=5+rank*3;
      return '<div class="fx-reveal ten-card rev-scene tier-'+t.id+' rank-'+rank+((rb||ex)?' rev-rb':'')+'">'+
        '<button class="ten-skip" onclick="event.stopPropagation();tenSkip()" aria-label="건너뛰기(신화·한정·처음 얻는 펫 제외 한 번에)">'+pixelTextHtml('SKIP', '#ffffff', {h:16})+'</button>'+
        '<div class="ten-count">'+pixelTextHtml(n+' / '+total, '#ffffff', {h:15})+'</div>'+
        '<div class="fx-art pop"><span class="fx-aurawrap">'+lightLayers({aura:210, rays:250, rainbow:ex})+'</span>'+
          '<span class="fx-ring"></span><span class="fx-twinkles">'+fxAuraTwinkles(tw, ex)+'</span><span class="fx-frame"></span>'+
          '<span class="fx-artimg'+(it.kind==='box'?' ten-boxart':'')+'">'+(it.kind==='box'?rewardBoxArtH(it,118):catFace(it.id,{h:118,eager:true}))+'</span>'+(it.isNew?newBadgeSvg({h:28}):'')+'</div>'+
        '<div class="fx-tier">'+pixelTextHtml(t.name, (ex?'RAINBOW':(t.color||'#ffffff')), {h:38, base:11})+'</div>'+
        '<div class="fx-name">'+pixelTextHtml((it.kind==='box'?rewardName(it):catName(it.id)), (ex?'RAINBOW':(t.color||'#ffffff')), {h:28, base:12})+'</div>'+
        '<div class="fx-reward">'+(it.dup?(it.dupAff
          ?'<span class="rw"><span class="ci">'+heartSvg({h:18})+'</span>'+pixelTextHtml('+'+it.dupAff+' 애정'+(it.lvUp?' ♥LvUP!':'')+(it.rbc?' ·🌈+'+it.rbc:'')+' (중복)', '#ffffff', {h:16})+'</span>'
          :(it.rbc
            ?'<span class="rw"><span class="ci">'+rainbowCoinSvg({h:18})+'</span>'+pixelTextHtml('+'+it.rbc+' 무지개동전 (중복)', '#ffffff', {h:16})+'</span>'
            :'<span class="rw"><span class="ci">'+coinSvg({h:18})+'</span>'+pixelTextHtml('+'+it.refund+' 은화 (중복)', '#ffffff', {h:16})+'</span>')):'')+'</div>'+
        '<div class="ten-nexthint">'+pixelTextHtml(n<total?'탭하여 다음 ('+n+'/'+total+')':'탭하여 마무리', '#ffffff', {h:15})+'</div>'+
        '<div class="fx-confetti">'+(conf?fxConfetti(conf):'')+'</div></div>'; }
    function tenFinale(){ _fx10.phase='finale'; _fx10.busy=false; _fx10._roaming=false; const fx=$('catFx'); if(!fx) return;
      const rm=reducedMotion(), noRoam=rm||_fx10.isBox, takeLbl=_fx10.isBox?'받기':'입양하기';   // 박스=가구라 배회 없음 → 정적 피날레(버튼 바로 노출)
      fx.innerHTML='<div class="fx-scrim"></div><div class="ten-wrap ten-final" id="tenWrap">'+
        tenSceneBg()+tenMeadowBg()+tenNestHtml(_fx10.items, 'finale')+
        '<div class="ten-fintitle">'+pixelTextHtml('10연차 완료!', '#ffffff', {h:28, base:12})+'</div>'+
        '<div class="ten-hint" id="tenHint">'+(noRoam?'':pixelTextHtml('탭해주세요', '#ffffff', {h:16}))+'</div>'+   // 탭 전까지 펫 정지 유지, 탭하면 배회 시작(자동 1초 배회 제거)
        '<button class="btn ten-takebtn'+(noRoam?'':' pending')+'" onclick="event.stopPropagation();closeTenFx()" aria-label="'+takeLbl+'">'+pixelTextHtml(takeLbl, '#ffffff', {h:22})+'</button></div>';   // 버튼은 탭해 펫이 배회 시작할 때 나타남(pending→해제). 박스는 바로 노출.
      fx.className='fx on reveal ten-finale';
      if(_fx10.skyRainbow) tenSkyFx($('tenWrap'));
    }
    // 피날레에서 화면을 탭하면 그때 펫들이 배회 시작(그 전까지는 정지 유지). 1회만. 박스는 배회 없음.
    function tenFinaleTap(){ if(!_fx10 || _fx10.phase!=='finale' || _fx10._roaming) return; _fx10._roaming=true; setTenHint(''); const rm=reducedMotion(); if(!rm && !_fx10.isBox) tenStartRoam();
      const b=document.querySelector('.ten-takebtn'); if(b) _fxT(function(){ b.classList.remove('pending'); }, (rm||_fx10.isBox)?0:520); }   // 펫이 배회 시작한 뒤(≈0.5s) 입양하기 버튼 페이드인
    function closeTenFx(){ _fxClear(); const fx=$('catFx'); if(fx){ fx.className='fx'; fx.innerHTML=''; } _fx10=null; _devPickupOverride=null; try{ document.body.classList.remove('fx-open'); }catch(e){} if(typeof markCatDirty==='function') markCatDirty(); }   // 로밍 무대(#pkRevStage) 제거 → 엔진 그룹 정리. (_pkV2는 상시 true)
    // 개발자 미리보기: 시나리오별 강제 결과 10개 → 연출만 재생(인벤토리 무소모)
    function devPreview10(scenario, kind, theme){ if(!isDev()) return; kind=kind||'egg';
      if(kind==='box'){ devPreview10Box(scenario, theme); return; }   // 🎁 랜덤박스 10연차(가구/바닥/벽지)
      const map=gachaCatTierMap(), fullMap=effCatTier();
      function rollOne(){ const r=(kind==='ddeul')?rollFromPool(fullMap, DDEUL_TIERS):rollFromPool(map); return r||{ id:(Object.keys(fullMap)[0]||'cat_mackerel'), tier:'normal' }; }
      function memberOf(tier){ if(tier==='exclusive'){ const pk=pickupMember(); if(pk) return pk; } const r=pickTierMember(fullMap, tier); return r?r.id:(Object.keys(fullMap)[0]||'cat_mackerel'); }
      let raw=[];
      if(scenario==='legendUp'){ const tiers=(kind==='ddeul')?['legend','limited','exclusive']:['legend','limited']; for(let i=0;i<10;i++){ const t=tiers[Math.floor(Math.random()*tiers.length)]; raw.push({ id:memberOf(t), tier:t }); } }
      else { for(let i=0;i<10;i++) raw.push(rollOne());
        if(scenario==='oneLimited') raw[Math.floor(Math.random()*10)]={ id:memberOf('limited'), tier:'limited' };
        else if(scenario==='oneExclusive') raw[Math.floor(Math.random()*10)]={ id:memberOf('exclusive'), tier:'exclusive' }; }
      const list=raw.map(function(r){ const dup=ownsCat(r.id);   // 💗 미리보기도 실지급 정책 미러: 중복 펫=애정(만렙만 은화 폴백)
        const dpv=dup?petDupPreview(r.id):null;
        return { id:r.id, tier:r.tier, kind:kind, rainbow:(kind==='egg' && Math.random()<rbUpgradeChance(r.tier)), dup:dup, refund:(dpv&&dpv.max)?dpv.refund:0, dupAff:(dpv&&!dpv.max)?dpv.aff:0, isNew:!dup }; });
      closeSheet(); _fx=null; runTenGachaFx(list, { preview:true, theme:(theme||(kind==='egg'?'sunset':'rainbow')) });   // 🌇 펫알=노을·무지개=밤 배경·연출(theme 명시 우선)
    }
    // 🎁 랜덤박스 10연차 미리보기 — 박스풀에서 10개 롤(가구/바닥/벽지). 시나리오: random·legendUp(전부 전설↑)·oneLimited(신화 1). 한정(exclusive)은 박스풀에 없음.
    function boxOwned(res){ if(res.type==='floor') return ownsFloor(res.id); if(res.type==='wall') return ownsWall(res.id); if(res.type==='bgfx') return ownsBgfx(res.id); if(res.type==='petfx') return ownsPetfx(res.id); if(res.type==='hat') return ownsHat(res.id);
      return !!(state.game&&state.game.owned&&state.game.owned.items&&state.game.owned.items[res.id]&&(Number(state.game.owned.items[res.id].qty)||0)>0); }
    function devPreview10Box(scenario, theme){
      const fb={ id:'cushion', tier:'normal', type:'item' };
      function rollB(forced){ return (forced?rollBoxReward(null, forced):rollBoxReward()) || rollBoxReward() || fb; }
      let raw=[];
      if(scenario==='legendUp'){ const tiers=['legend','limited']; for(let i=0;i<10;i++) raw.push(rollB(tiers[Math.floor(Math.random()*tiers.length)])); }
      else { for(let i=0;i<10;i++) raw.push(rollB()); if(scenario==='oneLimited') raw[Math.floor(Math.random()*10)]=rollB('limited'); }
      const list=raw.map(function(r){ const isSkin=(r.type==='floor'||r.type==='wall'||r.type==='bgfx'||r.type==='petfx'||r.type==='hat'), dup=(isSkin&&boxOwned(r))||(r.type==='item'&&itemQty(r.id)>=itemCapOf(r.id)); const rbc=dup?dupRbcOf(r.tier):0; return { id:r.id, tier:r.tier, type:r.type, kind:'box', rainbow:(Math.random()<rbUpgradeChance(r.tier)), dup:dup, refund:(dup&&!rbc)?dupRefundOf(r.tier):0, rbc:rbc, isNew:!boxOwned(r) }; });   // 실지급 정책 미러: 스킨(펫효과·모자 포함) 중복·가구 캡(케어5·기타1)=10% 환급 · 신화↑ 중복=무지개동전(신화+1·한정+2)
      closeSheet(); _fx=null; runTenGachaFx(list, { preview:true, kind:'box', theme:theme||'' });
    }

    // ================= 개발자 패널: 재화관리(연출/다마고치 테스트 · 재화 지급) =================
    function openDevGacha(){
      if(!isDev()) return;
      let h='<div class="note"><span class="pill">이 기기만</span> 개발자 전용 · 이 설정(연출/다마고치 테스트)은 <b>이 기기(브라우저)에만</b> 적용됩니다(재화 지급은 내 계정에 반영).</div>';
      h+='<div class="sec-title">연출 테스트(무료)</div>';
      // 한정(exclusive)은 기본 펫알/박스엔 없고 '뜰알'에서만 나옴 → 펫알·박스 행에선 제외하고, 아래 뜰알 행에서 한정 연출을 미리본다.
      const previewTiers=TIERS.filter(t=>t.id!=='exclusive');
      h+='<div class="tx-sub" style="margin:0 2px 6px;">펫알</div><div class="chip-row">'+previewTiers.map(t=>'<button class="chip" '+App.view.act('devPreview','egg',t.id)+'><b class="tier-'+t.id+'">'+t.name+'</b></button>').join('')+'</div>';
      h+='<div class="tx-sub" style="margin:8px 2px 6px;">랜덤박스</div><div class="chip-row">'+previewTiers.map(t=>'<button class="chip" '+App.view.act('devPreview','box',t.id)+'><b class="tier-'+t.id+'">'+t.name+'</b></button>').join('')+'</div>';
      // 🌱 뜰알(한정 픽업) — 뜰알 기준 연출 미리보기. 한정은 뜰알에서만 나오므로 '한정' 연출은 여기서 확인(뜰+하늘+무지개, 픽업 펫=흑표범·퓨마).
      h+='<div class="tx-sub" style="margin:8px 2px 6px;">🌱 뜰알(한정 픽업)</div><div class="chip-row">'+TIERS.map(t=>'<button class="chip" '+App.view.act('devPreview','ddeul',t.id)+'><b class="tier-'+t.id+'">'+t.name+'</b></button>').join('')+'</div>';
      // 🥚×10 10연차 연출 확인(개발자 미리보기 전용) — 시나리오별 강제 결과로 연출만 재생. 한정(exclusive)은 뜰알에서만.
      h+='<div class="tx-sub" style="margin:12px 2px 6px;">🥚×10 10연차(펫알)</div><div class="chip-row">'+
        '<button class="chip" '+App.view.act('devPreview10','random','egg')+'>랜덤</button>'+
        '<button class="chip" '+App.view.act('devPreview10','legendUp','egg')+'>전부 전설↑</button>'+
        '<button class="chip" '+App.view.act('devPreview10','oneLimited','egg')+'>신화 1개</button></div>';
      h+='<div class="tx-sub" style="margin:8px 2px 6px;">🌱×10 10연차(뜰알)</div><div class="chip-row">'+
        '<button class="chip" '+App.view.act('devPreview10','random','ddeul')+'>랜덤</button>'+
        '<button class="chip" '+App.view.act('devPreview10','legendUp','ddeul')+'>전부 전설↑</button>'+
        '<button class="chip" '+App.view.act('devPreview10','oneLimited','ddeul')+'>신화 1개</button>'+
        '<button class="chip" '+App.view.act('devPreview10','oneExclusive','ddeul')+'>한정 포함</button></div>';
      h+='<div class="tx-sub" style="margin:8px 2px 6px;">🎁×10 10연차(랜덤박스)</div><div class="chip-row">'+
        '<button class="chip" '+App.view.act('devPreview10','random','box')+'>랜덤</button>'+
        '<button class="chip" '+App.view.act('devPreview10','legendUp','box')+'>전부 전설↑</button>'+
        '<button class="chip" '+App.view.act('devPreview10','oneLimited','box')+'>신화 1개</button></div>';
      h+='<div class="sec-title" style="margin-top:18px;">다마고치 테스트(즉시)</div>';
      h+='<div class="note" style="margin-bottom:8px;">6시간을 기다리지 않고 급여·배변·수거를 바로 확인. 순서: <b>사료·물 +10</b> → 홈에서 그릇 채우기(또는 <b>그릇 다 채우기</b>) → <b>그릇 만료→똥</b> → 똥 탭/일괄 돌보기.</div>';
      h+='<div class="chip-row"><button class="chip" '+App.view.act('devGiveConsum')+'>사료·물 +10</button><button class="chip" '+App.view.act('devFillAll')+'>그릇 다 채우기</button><button class="chip" '+App.view.act('devExpireBowls')+'>그릇 만료→똥</button><button class="chip" '+App.view.act('devAddPoop')+'>똥 +3</button></div>';
      // 재화 추가(지급) — 은화·금화·펫알·랜덤박스·무지개알·무지개박스를 입력 수량만큼 내 계정에 지급
      h+='<div class="sec-title" style="margin-top:18px;">재화 추가(지급)</div>';
      h+='<div class="note" style="margin-bottom:8px;">입력한 수량만큼 <b>내 계정</b>에 지급해요(비우면 건너뜀, 음수면 차감·0 미만은 안 됨).</div>';
      { const cur6=[['coins','은화',coinSvg({h:18})],['gold','금화',goldSvg({h:18})],['egg','펫알',eggSvg(0,{h:18})],['box','랜덤박스',boxSvg({h:18})],['ddeul','뜰알',ddeulEggSvg({h:18})],['dye','염색약',consumSvg('dye',{h:18})],['dye_remover','염색 리무버',consumSvg('dye_remover',{h:18})],['rbcoin','무지개동전',rainbowCoinSvg({h:18})]];
        h+=cur6.map(function(c){ return '<div class="row" style="padding:5px 2px;align-items:center;"><span style="display:flex;align-items:center;gap:8px;min-width:0;"><span style="display:inline-flex;flex:none;">'+c[2]+'</span>'+c[1]+'</span><input class="input" style="width:120px;text-align:right;" inputmode="numeric" id="dv_'+c[0]+'" placeholder="0"></div>'; }).join(''); }
      h+='<button class="btn" style="margin-top:12px;" '+App.view.act('devGrantCurrency')+'>지급</button>';
      // 🧢✨ 코스메틱(own-once·전부 한정) 보유 토글 — 모자 3종·펫효과 3종(나비·반딧불·무지개꽃)
      h+='<div class="note" style="margin-top:14px;">코스메틱 보유 토글(누르면 지급↔회수 · 전부 한정 등급)</div><div style="display:flex;flex-wrap:wrap;gap:6px;">';
      Object.keys(HAT_CATALOG).forEach(k=>{ h+='<button class="chip'+(ownsHat(k)?' on':'')+'" '+App.view.act('devGrantCosm','hat',k)+'>'+hatSvg(k,{h:13})+' '+HAT_CATALOG[k]+'</button>'; });
      Object.keys(BUDDY_CATALOG).forEach(k=>{ h+='<button class="chip'+(ownsPetfx(k)?' on':'')+'" '+App.view.act('devGrantCosm','petfx',k)+'>'+buddySvgOf(k,{h:12})+' '+BUDDY_CATALOG[k]+'</button>'; });
      h+='</div>';
      // 🏅 신화·한정 지급 — 펫(보유 토글)·기구물/벽지/바닥/배경효과(가구=+1개, 스킨=보유 토글)를 리스트에서 골라 지급
      { const tm=(typeof effCatTier==='function')?effCatTier():CAT_TIER;
        const hi=PET_CATALOG.filter(c=>{ const t=tm[c.id]||'normal'; return t==='limited'||t==='exclusive'; });
        h+='<div class="note" style="margin-top:14px;">신화·한정 지급 — 펫(토글) / 기구물·스킨(가구 +1개·스킨 토글)</div>';
        h+='<div class="row" style="gap:6px;align-items:center;padding:4px 0;"><select class="input" id="dv_hipet" style="flex:1;min-width:0;">'
          +hi.map(c=>'<option value="'+c.id+'">'+escapeHtml(c.name)+' · '+tierInfo(tm[c.id]||'normal').name+(ownsCat(c.id)?' (보유)':'')+'</option>').join('')
          +'</select><button class="buy sm" '+App.view.act('devGrantPet')+'>토글</button></div>';
        const opts=[]; const it=effItemTier(), wl=effWallTier(), fl=effFloorTier(), bg=bgfxTierMap();
        const add=(pfx,id,nm,t,has)=>{ if(t==='limited'||t==='exclusive') opts.push('<option value="'+pfx+':'+id+'">'+escapeHtml(nm)+' · '+tierInfo(t).name+(has?' (보유)':'')+'</option>'); };
        ITEM_CATALOG.forEach(x=>add('it',x.id,'[가구] '+x.name, it[x.id]||'normal', (typeof itemQty==='function'?itemQty(x.id):0)>0));
        WALLPAPER_CATALOG.forEach(x=>{ if(x.id!=='default') add('wl',x.id,'[벽지] '+x.name, wl[x.id]||'normal', ownsWall(x.id)); });
        FLOOR_CATALOG.forEach(x=>{ if(x.id!=='default') add('fl',x.id,'[바닥] '+x.name, fl[x.id]||'normal', ownsFloor(x.id)); });
        (typeof BGFX_CATALOG!=='undefined'?BGFX_CATALOG:[]).forEach(x=>add('bg',x.id,'[배경효과] '+x.name, bg[x.id]||'exclusive', ownsBgfx(x.id)));
        h+='<div class="row" style="gap:6px;align-items:center;padding:4px 0;"><select class="input" id="dv_hiasset" style="flex:1;min-width:0;">'+opts.join('')+'</select><button class="buy sm" '+App.view.act('devGrantHiAsset')+'>지급</button></div>'; }
      openSheet('개발자 · 재화관리', h);
    }
    function saveDevGacha(){
      const c={ tiers:{}, catTier:{}, itemTier:{} };
      TIERS.forEach(t=>{ const v=parseFloat(val('dp_'+t.id)); if(!isNaN(v)) c.tiers[t.id]=v; });
      PET_CATALOG.forEach(x=>{ c.catTier[x.id]=val('dc_'+x.id); });
      ITEM_CATALOG.forEach(x=>{ c.itemTier[x.id]=val('di_'+x.id); });
      saveDevCfg(c); toast('개발자 설정을 저장했어요'); closeSheet();
    }
    function resetDevGacha(){ localStorage.removeItem('catDevCfg'); toast('기본값으로 초기화'); openDevGacha(); }
    // 연출만 미리보기(은화 소모·지급 없음). rainbow=true면 무지개알(구매) 오픈으로 연출(무지개 배너 미리보기용).
    function devPreview(kind, tierId, forceId, rainbow){
      const map = isEggKind(kind)? effCatTier() : effItemTier();   // 뜰알(ddeul)도 펫알과 동일하게 펫 등급 맵 사용
      let id = forceId || Object.keys(map).find(k=>map[k]===tierId);
      if(kind==='ddeul' && tierId==='exclusive'){ const pk=(typeof LIMITED_PICKUP!=='undefined') && pickupMember(); if(pk) id=pk; }   // 한정 = 픽업 펫(흑표범·퓨마)으로 연출
      if(!id) id = isEggKind(kind) ? (Object.keys(map)[0]||'cat_mackerel') : (Object.keys(map)[0]||'cushion');
      closeSheet(); _fx=null; runGachaFx(kind, { id, tier:tierId }, false, 0, !!rainbow, true);   // 미리보기는 NEW 배지도 함께 표시
    }
    // ---- 다마고치 테스트(개발자 전용, 즉시) ----
    function devGiveConsum(){ if(!isDev())return; gameRef().transaction(g=>{ g=normalizeGame(g); g.consum.food+=10; g.consum.water+=10; return g; }).then(r=>{ if(r&&r.committed) toast('사료·물 +10'); }); }
    function devFillAll(){ if(!isDev())return; const rid=curRoomId(); gameRef().transaction(g=>{ g=normalizeGame(g); const now=Date.now(); const R=gRoomById(g, rid); Object.keys(R.placed||{}).forEach(k=>{ const e=R.placed[k]; if(e&&(e.itemId==='bowl'||e.itemId==='waterbowl')) e.filledAt=now; }); return g; }).then(r=>{ if(r&&r.committed) toast('모든 그릇 채움 🍚💧'); }); }
    function devExpireBowls(){ if(!isDev())return; const rid=curRoomId(); gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoomById(g, rid); const pl=R.placed||{}; let poop=0; Object.keys(pl).forEach(k=>{ const e=pl[k]; if(e&&e.filledAt&&(e.itemId==='bowl'||e.itemId==='waterbowl')){ e.filledAt=null; poop++; } }); if(poop) R.poops=(Number(R.poops)||0)+poop; return g; }).then(r=>{ if(r&&r.committed) toast('채워진 그릇 만료 → 똥 생성'); }); }
    function devAddPoop(){ if(!isDev())return; const rid=curRoomId(); gameRef().transaction(g=>{ g=normalizeGame(g); const R=gRoomById(g, rid); R.poops=(Number(R.poops)||0)+3; return g; }).then(r=>{ if(r&&r.committed) toast('똥 +3'); }); }
    function devAddCoins(){ if(!isDev())return; gameRef().transaction(g=>{ g=normalizeGame(g); g.coins+=100; return g; }).then(r=>{ if(r&&r.committed) toast('은화 +100'); }); }
    // 재화 지급(개발자): dv_* 입력값을 읽어 은화·금화·소비템(펫알/박스/무지개알/무지개박스)을 한 트랜잭션에 지급.
    function devGrantCurrency(){ if(!isDev())return;
      const rd=id=>{ const v=parseInt(val('dv_'+id),10); return isNaN(v)?0:v; };
      const c=rd('coins'), gd=rd('gold'), eg=rd('egg'), bx=rd('box'), dd=rd('ddeul'), dy=rd('dye'), dr=rd('dye_remover'), rc=rd('rbcoin');
      if(!(c||gd||eg||bx||dd||dy||dr||rc)){ toast('수량을 입력하세요', true); return; }
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if(c)  g.coins=clampCoins((g.coins||0)+c);
        if(gd) g.gold=clampGold((g.gold||0)+gd);
        if(eg) g.consum.egg=clampConsum((g.consum.egg||0)+eg);
        if(bx) g.consum.box=clampConsum((g.consum.box||0)+bx);
        if(dd) g.consum.ddeul=clampConsum((g.consum.ddeul||0)+dd);
        if(dy) g.consum.dye=clampConsum((g.consum.dye||0)+dy);
        if(dr) g.consum.dye_remover=clampConsum((g.consum.dye_remover||0)+dr);
        if(rc) grantRbcoin(g, rc);   // 🌈 무지개동전
        return g; }).then(r=>{ if(r&&r.committed){ toast('재화 지급 완료 🎁'); if(state._sheetRefresh) state._sheetRefresh(); } });
    }
    // 🏅 개발자: 신화·한정 펫 보유 토글(지급↔회수) — dv_hipet 선택값. 회수해도 방 active 잔여는 activeCats의 ownsCat 필터가 걸러 유령 없음.
    function devGrantPet(){ if(!isDev())return;
      const el=$('dv_hipet'); const id=el&&el.value; if(!id||!PET_CATALOG.some(c=>c.id===id)) return;
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if(g.owned.cats[id]) delete g.owned.cats[id]; else g.owned.cats[id]={boughtAt:new Date().toISOString()};
        return g; }).then(r=>{ if(r&&r.committed){ toast(catName(id)+' 보유 토글'); if(state._sheetRefresh) state._sheetRefresh(); } });
    }
    // 🏅 개발자: 신화·한정 기구물·스킨 지급 — dv_hiasset 값 'it|wl|fl|bg:id'. 가구=+1개(캡 내), 벽지/바닥/배경효과=보유 토글.
    function devGrantHiAsset(){ if(!isDev())return;
      const el=$('dv_hiasset'); const v=el&&el.value; if(!v) return;
      const p=v.split(':'), kind=p[0], id=p.slice(1).join(':');
      gameRef().transaction(g=>{ g=normalizeGame(g);
        if(kind==='it'){ const cur=g.owned.items[id]; const q=Math.min(itemCapOf(id),(Number(cur&&cur.qty)||0)+1); g.owned.items[id]=Object.assign({boughtAt:new Date().toISOString()}, cur||{}, {qty:q}); }
        else if(kind==='wl'){ if(g.owned.wallpapers[id]) delete g.owned.wallpapers[id]; else g.owned.wallpapers[id]={boughtAt:new Date().toISOString()}; }
        else if(kind==='fl'){ g.owned.floors=g.owned.floors||{}; if(g.owned.floors[id]) delete g.owned.floors[id]; else g.owned.floors[id]={boughtAt:new Date().toISOString()}; }
        else if(kind==='bg'){ g.owned.bgfx=g.owned.bgfx||{}; if(g.owned.bgfx[id]) delete g.owned.bgfx[id]; else g.owned.bgfx[id]={boughtAt:new Date().toISOString()}; }
        else return;
        return g; }).then(r=>{ if(r&&r.committed){ toast('지급/토글 완료'); if(state._sheetRefresh) state._sheetRefresh(); } });
    }
    // 🧢✨ 개발자: 코스메틱(모자·펫효과) own-once 지급/회수 토글 — 이벤트 배포 전 착용 테스트용.
    function devGrantCosm(kind, id){ if(!isDev())return;
      const ok=(kind==='hat'&&HAT_CATALOG[id])||(kind==='petfx'&&BUDDY_CATALOG[id]); if(!ok) return;
      const node=kind==='hat'?'hats':'petfx';
      gameRef().transaction(g=>{ g=normalizeGame(g); g.owned[node]=g.owned[node]||{};
        if(g.owned[node][id]) delete g.owned[node][id]; else g.owned[node][id]={boughtAt:new Date().toISOString()};
        return g; }).then(r=>{ if(r&&r.committed){ toast((kind==='hat'?HAT_CATALOG[id]:BUDDY_CATALOG[id])+' 보유 토글'); if(state._sheetRefresh) state._sheetRefresh(); } });
    }
