// ===== 상수 =====
    const TYPE_LABEL = { income:'수입', expense:'지출', transfer:'이체', prepaid_charge:'충전', prepaid_spend:'선불결제', refund:'환불', point_earn:'포인트적립', point_spend:'포인트사용', balance_adjustment:'잔액조정' };
    const TYPE_ICON = { income:'💰', expense:'💳', transfer:'🔄', prepaid_charge:'⤴️', prepaid_spend:'🛒', refund:'↩️', point_earn:'⭐', point_spend:'✨', balance_adjustment:'🛠️' };
    // 잔액 효과: debit=from에서 차감, credit=to에 가산 (balance_adjustment는 음수 amount 허용)
    const TX_EFFECT = {
      income:{credit:'to'}, expense:{debit:'from'}, transfer:{debit:'from',credit:'to'},
      prepaid_charge:{debit:'from',credit:'to'}, prepaid_spend:{debit:'from'},
      refund:{credit:'to'}, point_earn:{credit:'to'}, point_spend:{debit:'from'},
      balance_adjustment:{credit:'to'}
    };
    // 실제 소비(통계 포함) 기본값 — 거래별로 override 가능
    const ACTUAL_DEFAULT = { expense:true, prepaid_spend:true, point_spend:true };
    const EXT_TYPES = ['prepaid_charge','prepaid_spend','refund','point_earn','point_spend','balance_adjustment'];
    const ACCT_TYPES = [['cash','현금'],['bank','은행계좌'],['credit_card','신용카드'],['debit_card','체크카드'],['prepaid','선불충전금'],['point','포인트'],['e_wallet','간편결제'],['gift_card','상품권'],['other','기타']];
    const ACCT_TYPE_LABEL = Object.assign({}, ...ACCT_TYPES.map(p=>({[p[0]]:p[1]})));
    const PROVIDERS = [['manual','직접'],['naverpay','네이버페이'],['coupang','쿠팡'],['kakaopay','카카오페이'],['toss','토스'],['other','기타']];
    const PROVIDER_LABEL = Object.assign({}, ...PROVIDERS.map(p=>({[p[0]]:p[1]})));
    const PREPAID_TYPES = ['prepaid','point','e_wallet','gift_card'];
    const CARD_TYPES = ['credit_card','debit_card'];
    const VISIBILITY = [['full','전체 공개'],['balance_only','잔액만 공개'],['private','개인만 보기']];
    const VIS_LABEL = Object.assign({}, ...VISIBILITY.map(p=>({[p[0]]:p[1]})));
    const SUB_TYPES = [['video','영상'],['music','음악'],['shopping','쇼핑'],['cloud','클라우드'],['productivity','생산성'],['app','앱'],['membership','멤버십'],['domain_hosting','도메인/호스팅'],['finance','금융'],['insurance','보험'],['other','기타']];
    const SUB_TYPE_LABEL = Object.assign({}, ...SUB_TYPES.map(p=>({[p[0]]:p[1]})));
    const BILLING = [['weekly','매주'],['monthly','매월'],['yearly','매년'],['custom','사용자지정']];
    const BILLING_LABEL = Object.assign({}, ...BILLING.map(p=>({[p[0]]:p[1]})));
    const SUB_STATUS_LABEL = { active:'구독중', paused:'일시정지', cancelled:'취소', expired:'만료' };
    const PB_TYPES = [['travel','여행'],['gathering','모임/계'],['couple','데이트/부부'],['family','가족'],['project','프로젝트'],['club','동아리'],['event','이벤트'],['account_group','공동지출'],['custom','기타']];
    const PB_TYPE_LABEL = Object.assign({}, ...PB_TYPES.map(p=>({[p[0]]:p[1]})));
    const PB_STATUS_LABEL = { active:'진행중', completed:'완료', archived:'보관' };
    const REL_TYPES = [['family','가족'],['relative','친척'],['friend','친구'],['company','직장'],['acquaintance','지인'],['neighbor','이웃'],['other','기타']];
    const REL_LABEL = Object.assign({}, ...REL_TYPES.map(p=>({[p[0]]:p[1]})));
    const GIFT_EVENT_TYPES = [['wedding','결혼'],['funeral','장례'],['first_birthday','돌'],['birthday','생일'],['holiday','명절'],['graduation','졸업/입학'],['birth','출산'],['hospital_visit','병문안'],['housewarming','집들이'],['exam','시험'],['other','기타']];
    const GIFT_EVENT_LABEL = Object.assign({}, ...GIFT_EVENT_TYPES.map(p=>({[p[0]]:p[1]})));
    const GIFT_DIR_LABEL = { given:'줌', received:'받음' };
    const GIFT_EVENT_ICON = { wedding:'💍', funeral:'🕯️', first_birthday:'🎂', birthday:'🎈', holiday:'🎁', graduation:'🎓', birth:'👶', hospital_visit:'🏥', housewarming:'🏠', exam:'✏️', other:'🎀' };
    // 대출: 방향(빌림=내 빚 / 빌려줌=받을 돈) · 상태
    const LOAN_DIR_LABEL = { borrowed:'빌림(대출)', lent:'빌려줌' };
    const LOAN_STATUS_LABEL = { active:'상환중', paid:'완료', overdue:'연체' };
    const PLANNED_STATUS_LABEL = { planned:'예정', completed:'완료', cancelled:'취소' };
    // 정산(Step 9): 분담 방식 / 거래 정산 상태 / 송금 기록 상태
    const SPLIT_TYPE_LABEL = { none:'정산 안 함', equal:'균등 분할', custom:'직접 입력', payer_only:'결제자 부담' };
    const SETTLE_STATUS_LABEL = { none:'-', unsettled:'미정산', partially_settled:'일부 정산', settled:'정산 완료' };
    const PAYMENT_STATUS_LABEL = { pending:'대기', paid:'완료', cancelled:'취소' };
    const WEEK = ['일','월','화','수','목','금','토'];
    const CAT_TYPES = [['expense','지출'],['income','수입'],['transfer','이체'],['event','경조사'],['travel','여행'],['loan','대출'],['subscription','구독'],['other','기타']];
    const CAT_TYPE_LABEL = Object.assign({}, ...CAT_TYPES.map(p=>({[p[0]]:p[1]})));
    const OLD_DEFAULT_CAT_NAMES = ['식사','교통','쇼핑','엔터','생활','의료','카페','기타']; // 구버전 기본 카테고리(삭제불가 판정용)
    const DEFAULT_CATEGORY_DEFS = {
      '식비':{type:'expense',icon:'🍚',color:'#ff8a3d'}, '배달':{type:'expense',icon:'🛵',color:'#ff6b3d'},
      '카페':{type:'expense',icon:'☕',color:'#a1734b'}, '교통':{type:'expense',icon:'🚌',color:'#3182f6'},
      '쇼핑':{type:'expense',icon:'🛍️',color:'#f04452'}, '생활용품':{type:'expense',icon:'🧴',color:'#1b9e5f'},
      '주거':{type:'expense',icon:'🏠',color:'#7b68ee'}, '통신':{type:'expense',icon:'📱',color:'#00b8d4'},
      '보험':{type:'expense',icon:'🛡️',color:'#868e96'}, '의료':{type:'expense',icon:'💊',color:'#00b8a3'},
      '교육':{type:'expense',icon:'📚',color:'#5c7cfa'}, '문화생활':{type:'expense',icon:'🎬',color:'#9b59b6'},
      '구독':{type:'expense',icon:'🔄',color:'#e84393'}, '경조사':{type:'expense',icon:'💐',color:'#f783ac'},
      '여행':{type:'expense',icon:'✈️',color:'#22b8cf'},
      '월급':{type:'income',icon:'💰',color:'#1b9e5f'}, '부수입':{type:'income',icon:'💵',color:'#37b24d'},
      '용돈':{type:'income',icon:'🪙',color:'#f59f00'}, '환급':{type:'income',icon:'↩️',color:'#74c0fc'},
      '이자':{type:'income',icon:'🏦',color:'#4263eb'}, '경조사비 수령':{type:'income',icon:'🎁',color:'#f06595'},
      '기타':{type:'other',icon:'📦',color:'#8b95a1'}
    };
    function buildDefaultCategories(){ const o={}; let i=0; for(const n of Object.keys(DEFAULT_CATEGORY_DEFS)){ const d=DEFAULT_CATEGORY_DEFS[n]; o[n]={ name:n, type:d.type, icon:d.icon, color:d.color, sortOrder:++i, isDefault:true, isActive:true, visibility:'full', owner:'공동' }; } return o; }
