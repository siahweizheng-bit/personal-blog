// ╔══════════════════════════════════════════════════════════════╗
// ║  网站内容配置 —— 改名字、简介、头像、社媒、订阅，都在这一个文件里改  ║
// ╚══════════════════════════════════════════════════════════════╝

export const site = {
  // 网站名（显示在左上角和浏览器标题）
  name: '公民白话文',
  // 英文名（切换到 EN 时显示）
  nameEn: 'Plain Civil',

  // 大标题下的一句话标语（中 / 英）
  tagline: '认识你的权利与责任，做更有意识的公民',
  taglineEn: 'Know your rights and responsibilities — become a more conscious citizen.',

  // 首页头像/logo 区的介绍（可以写长一点）
  intro:
    '我们致力于在马来西亚推广公民教育，帮助每一个人认识自己的权利、责任与参与公共事务的方式。' +
    '从选举制度、政府运作，到社区参与和公民权益，我们用易懂的方式让公民教育走进日常生活。' +
    '订阅我们，一起成为更有意识、更有力量的公民。',
  introEn:
    'We promote civic education across Malaysia, helping everyone understand their rights, ' +
    'responsibilities, and how to take part in public life — from elections and how government ' +
    'works, to community participation and civil rights. Subscribe and grow with us into more ' +
    'conscious, empowered citizens.',

  // 头像 / Logo
  avatar: '/plain-civil.png',

  // 联系邮箱
  email: 'plaincivil101@gmail.com',

  // ── 社交媒体（把下面的网址换成你们的真实主页；留空的不会显示） ──
  social: {
    instagram: 'https://www.instagram.com/plaincivil101/',
    facebook: 'https://www.facebook.com/profile.php?id=61591353122334',
    x: 'https://x.com/plaincivil101',
    threads:'https://www.threads.com/@plaincivil101',
  },

  // ── 文章主题分类 ──
  categories: [
    { name: '公民教育基础', nameEn: 'General Civic Education', slug: 'general', desc: '公民教育的核心概念，帮助每个人建立公民意识', descEn: 'Core civic education concepts to build awareness in everyone', icon: '📚' },
    { name: '政治制度', nameEn: 'Political System', slug: 'system', desc: '政府如何运作、三权如何分立', descEn: 'How government works and powers are separated', icon: '🏛️' },
    { name: '选举与投票', nameEn: 'Elections & Voting', slug: 'elections', desc: '从选民登记到投票的完整指南', descEn: 'A full guide from registration to voting', icon: '🗳️' },
    { name: '公民权益', nameEn: 'Civil Rights', slug: 'rights', desc: '法律保障的自由与权益', descEn: 'The freedoms and rights protected by law', icon: '⚖️' },
    { name: '社区参与', nameEn: 'Community Action', slug: 'community', desc: '如何参与并改变身边的社会', descEn: 'How to take part and change the society around you', icon: '🤝' },
    { name: '会员专享', nameEn: 'Member Exclusive', slug: 'member', desc: '会员专属的深度解析——数据、推演与结论，看懂政策背后的钱与权', descEn: 'Members-only deep dives — the data, reasoning and conclusions behind the money and power in policy', icon: '🔒', memberOnly: true },
  ],

  // ── 邮件订阅（写入 Google 表格） ──
  subscribe: {
    endpoint: 'https://script.google.com/macros/s/AKfycbw0zE4vh4iuHWG2auB-eBcjQop6kXJUECGzuHgYosKPvzYeYyCBJOO3yTiCc9P6tds/exec',
  },

  // ── 支持我们 / 捐款（/support 页面）。任一项留空就不会显示 ──
  support: {
    duitnowQr: '',
    kofi: '',
    bankNote: '',
  },

  // ── 资源 / 数字产品（/resources 页面） ──
  // status: 'free' 填邮箱后免费下载（需填 files）；'available' 显示购买按钮（需填 buyUrl）；
  //         'coming' 显示「即将上架·订阅优先」。
  products: [
    {
      slug: 'first-voter-guide',
      status: 'free',
      title: '首投族投票指南',
      titleEn: "First-Time Voter's Guide",
      price: 'RM 19',
      summary: '从选民登记到投票当天，一份图文清单带你走完全程——专为第一次投票的马来西亚人写。',
      summaryEn: 'From voter registration to polling day — a clear, illustrated checklist for Malaysians voting for the first time.',
      cover: '/covers/first-voter-guide.svg',
      buyUrl: '',
      files: { zh: '/products/first-voter-guide-zh.pdf', en: '/products/first-voter-guide-en.pdf' },
      includes: [
        { zh: '选民登记资格与流程（含 SPR 查询）', en: 'Eligibility & how to register (incl. SPR check)' },
        { zh: '投票当天该带什么、流程怎么走', en: 'What to bring and what happens on polling day' },
        { zh: '常见迷思与骗局澄清', en: 'Common myths and scams, debunked' },
        { zh: '中英双语 PDF，可打印', en: 'Bilingual printable PDF' },
      ],
    },
    {
      slug: 'know-your-rights',
      status: 'free',
      title: '你的权利速查表',
      titleEn: 'Know Your Rights — Quick Guide',
      price: 'RM 19',
      summary: '被警察拦下、被查问、被逮捕时，你有哪些基本权利？一页速查，关键时刻不慌。',
      summaryEn: 'Stopped, questioned or arrested by police — what are your basic rights? A one-page quick reference for the moments that matter.',
      cover: '/covers/know-your-rights.svg',
      buyUrl: '',
      files: { zh: '/products/know-your-rights-zh.pdf', en: '/products/know-your-rights-en.pdf' },
      includes: [
        { zh: '被拦查时该做与不该做的事', en: 'What to do (and not do) when stopped' },
        { zh: '被逮捕时的关键权利（律师、通知家人）', en: 'Key rights on arrest (lawyer, informing family)' },
        { zh: '常见误区与冷静应对', en: 'Common myths and how to stay calm' },
        { zh: '中英双语 PDF，可打印随身带', en: 'Bilingual printable PDF' },
      ],
    },

    // ── 付费产品（深度手册）。上架步骤见下方注释 ──
    // ① 在 Gumroad / Lemon Squeezy 上传 PDF、设价格、拿购买链接；
    // ② 把链接填到 buyUrl；③ 把 status 改成 'available'。价格(price)为建议值，可改。
    {
      slug: 'understand-government',
      status: 'available',
      title: '看懂大马政府',
      titleEn: "How Malaysia's Government Works",
      originalPrice: 'RM 12.99',
      price: 'RM 8.99',
      summary: '30 分钟搞懂：谁在做决定、钱从哪来、一条法律怎么诞生。把课本没讲清的制度，用图解一次说明白。',
      summaryEn: 'In 30 minutes: who decides, where the money comes from, how a law is born. The system school never made clear — in plain diagrams.',
      cover: '/covers/understand-government.svg',
      buyUrl: '',
      includes: [
        { zh: '三权分立 + 联邦vs州分权图解', en: 'Separation of powers + federal vs state, illustrated' },
        { zh: '一条法案如何变成法律（完整流程）', en: 'How a bill becomes law (full process)' },
        { zh: '你的税去了哪：公共财政速懂', en: 'Where your taxes go: public finance made simple' },
        { zh: '遇事该找谁速查 + 中马英名词对照', en: 'Who-to-contact reference + trilingual glossary' },
        { zh: '中英双版 PDF，事实经官方来源核实', en: 'Bilingual PDF, facts verified against official sources' },
      ],
    },
    {
      slug: 'think-clearly',
      status: 'available',
      title: '不被带风向：批判性思考工具包',
      titleEn: "Don't Get Swept Along — Critical Thinking Toolkit",
      originalPrice: 'RM 14.99',
      price: 'RM 10.99',
      summary: '一套可练习的思考方法：分辨假消息、查证来源、看穿带风向的套路、管住自己的偏见。含可填写练习。',
      summaryEn: 'A practisable thinking method: spot fake news, check sources, see through spin, keep your biases in check. With fill-in exercises.',
      cover: '/covers/think-clearly.svg',
      buyUrl: '',
      includes: [
        { zh: '分享前先 STOP（SIFT 四步法）', en: 'STOP before you share (the SIFT method)' },
        { zh: '假消息 8 大危险信号 + 逻辑谬误图鉴', en: '8 fake-news red flags + a guide to fallacies' },
        { zh: '五步「想清楚一件事」框架', en: 'The 5-step "think it through" framework' },
        { zh: '5 个动手练习，越练越难被带', en: '5 hands-on exercises — practice builds the muscle' },
        { zh: '中英双版 PDF · 衔接未来的批判性思考课程', en: 'Bilingual PDF · pairs with our upcoming course' },
      ],
    },
    {
      slug: 'citizen-action',
      status: 'available',
      title: '公民行动手册',
      titleEn: 'The Citizen Action Handbook',
      originalPrice: 'RM 12.99',
      price: 'RM 8.99',
      summary: '投完票之后，普通人还能怎么合法、有效地影响公共决策？怎么找到议员、写出会被认真对待的诉求、走官方投诉与联署。含可套用模板。',
      summaryEn: 'After voting, how can an ordinary person legally and effectively influence public decisions? Find your reps, write requests that get taken seriously, use official complaint & petition channels. With ready-to-use templates.',
      cover: '/covers/citizen-action.svg',
      buyUrl: '',
      includes: [
        { zh: '行动阶梯：从一封电邮到集体发声', en: 'The ladder of action: from one email to collective voice' },
        { zh: '怎么找到并联系你的 MP 与 ADUN', en: 'How to find & contact your MP and ADUN' },
        { zh: '官方投诉渠道（BPA·SISPAA·地方议会）', en: 'Official complaint channels (BPA·SISPAA·local council)' },
        { zh: '3 个可直接套用的信件/投诉模板', en: '3 ready-to-use letter/complaint templates' },
        { zh: '中英双版 PDF，渠道经官方来源核实', en: 'Bilingual PDF, channels verified against official sources' },
      ],
    },
    {
      slug: 'govt-aid',
      status: 'available',
      title: '政府补助与津贴速查手册',
      titleEn: 'Government Aid & Subsidies',
      originalPrice: 'RM 13.99',
      price: 'RM 9.99',
      summary: '每年数以亿计的援助没人领——不是你不符合，而是没人告诉你在哪、怎么申请。用图表带你把「本来就该拿的钱」拿回来：收入档速判、六大类援助地图、四步申请法，还教你避开假冒骗局。',
      summaryEn: "Hundreds of millions in aid goes unclaimed each year — not because people don't qualify, but because nobody showed them where or how. Visual guide: income-band check, a six-category aid map, a four-step apply method, and how to dodge scams.",
      cover: '/covers/govt-aid.svg',
      buyUrl: '',
      includes: [
        { zh: '收入档速判图：你符合哪些援助', en: 'Income-band ladder: which aid you qualify for' },
        { zh: '援助地图：现金/教育/医疗/房屋/职退/生活', en: 'Aid map: cash / education / health / housing / work / living' },
        { zh: '四步申请流程图 + 文件清单', en: 'A four-step apply flow + document checklist' },
        { zh: '真援助 vs 假骗局对照 + 真实情境示范', en: 'Real-aid vs scam comparison + a real scenario' },
        { zh: '常见问答 + 一页速查表（中英双版 PDF）', en: 'FAQ + one-page cheat sheet (bilingual PDF)' },
      ],
    },
    {
      slug: 'budget-decoder',
      status: 'available',
      title: '读懂大马预算案',
      titleEn: 'The Budget Decoder',
      originalPrice: 'RM 12.99',
      price: 'RM 8.99',
      summary: '预算案一公布，数字吓死人，但真正牵动你钱包的只有几件事。用时间线、图表与流程图教你像内行一样：10 分钟抓重点、看穿角度、用两个官方入口查证真假。',
      summaryEn: 'When the Budget drops the numbers look terrifying — yet only a few lines touch your wallet. With timelines, charts and flows, read it like an insider: essentials in 10 minutes, spin spotted, facts checked against two official portals.',
      cover: '/covers/budget-decoder.svg',
      buyUrl: '',
      includes: [
        { zh: '从提呈到生效：预算案时间线', en: 'From tabling to law: a Budget timeline' },
        { zh: '三大块图解：钱从哪来、往哪去', en: 'Three blocks, illustrated: where money comes and goes' },
        { zh: '10 分钟读懂的 5 个问题（流程图）', en: 'The 5 questions to read it in 10 minutes (flow)' },
        { zh: '实战：拆解一条预算标题 + 名词对照', en: 'In practice: dissect a headline + glossary' },
        { zh: '常见问答（中英双版 PDF，官方核实）', en: 'FAQ (bilingual PDF, officially verified)' },
      ],
    },
    {
      slug: 'digital-safety',
      status: 'available',
      title: '数码公民安全手册',
      titleEn: 'Digital Citizen Safety',
      originalPrice: 'RM 14.99',
      price: 'RM 10.99',
      summary: '网络诈骗每年从大马人手中卷走数十亿。用图鉴、流程图与时间线教你三件事：一眼识破套路、被骗后「黄金一小时」正确止损、以及主张法律给你的数据权利。一次读懂，可能省下你半生积蓄。',
      summaryEn: 'Online scams drain billions from Malaysians yearly. With field-guide cards, flows and a timeline, learn three things: spot the playbook, act right in the "golden hour", and claim your data rights. It could save your savings.',
      cover: '/covers/digital-safety.svg',
      buyUrl: '',
      includes: [
        { zh: '骗局图鉴（6 类）+ 8 大危险信号', en: 'Scam field guide (6 types) + 8 red flags' },
        { zh: '被骗了怎么办：997 黄金一小时时间线', en: 'If you’re hit: the 997 golden-hour timeline' },
        { zh: '真实情境：一通「银行来电」该怎么应对', en: 'Real scenario: how to handle a “bank call”' },
        { zh: '你的数据权利（PDPA + 2024 修正案）', en: 'Your data rights (PDPA + the 2024 amendment)' },
        { zh: '防护清单 + 紧急速查（中英双版 PDF）', en: 'Protection checklist + emergency card (bilingual PDF)' },
      ],
    },
    {
      slug: 'govt-offices',
      status: 'available',
      title: '搞定政府部门手册',
      titleEn: 'Getting Things Done at Government Offices',
      originalPrice: 'RM 12.99',
      price: 'RM 8.99',
      summary: '跑错柜台、缺一份文件、排两小时才发现能网上办——政府部门的痛苦大多能提前避免。用速查表与流程图，按部门告诉你「带什么、怎么办、能不能线上」，还有办不动时的正式投诉渠道。',
      summaryEn: 'Wrong counter, one missing document, two hours in line only to learn it’s online — most of it is avoidable. Cheat sheets and flows tell you per department what to bring, how it works, what’s online — plus how to complain when it stalls.',
      cover: '/covers/govt-offices.svg',
      buyUrl: '',
      includes: [
        { zh: '出门前黄金三问 + 三条通用原则', en: 'Three golden questions + three universal rules' },
        { zh: '八大部门速查表：带什么 / 能否线上', en: 'Cheat sheet for 8 departments: bring / online' },
        { zh: '三个常见错事的正确走法（图卡）', en: 'Three common errands done right (cards)' },
        { zh: '办不动怎么办：SISPAA / BPA 投诉流程', en: 'When stuck: the SISPAA / BPA complaint flow' },
        { zh: '有效投诉骨架 + 常见问答（中英双版 PDF）', en: 'Complaint skeleton + FAQ (bilingual PDF)' },
      ],
    },
    {
      slug: 'civic-bundle',
      status: 'available',
      title: '公民三件套（优惠包）',
      titleEn: 'Civic Bundle (3-in-1)',
      originalPrice: 'RM 28.97',
      price: 'RM 18.00',
      summary: '三册一起：《看懂大马政府》+《不被带风向》+《公民行动手册》。理解 → 想清楚 → 行动，一条完整的公民能力阶梯，合购更划算。',
      summaryEn: 'All three: Government + Critical Thinking + Citizen Action. Understand then think clearly then act — the full civic-skills ladder, cheaper together.',
      cover: '/covers/civic-bundle.svg',
      buyUrl: '',
      includes: [
        { zh: '三册完整 PDF（中英双版）', en: 'All three full PDFs (bilingual)' },
        { zh: '比单买省 RM 11', en: 'Save RM 11 vs buying separately' },
        { zh: '订阅者享优惠价', en: 'Subscribers get discounted pricing' },
      ],
    },
    {
      slug: '5in1-civic-bundle',
      status: 'available',
      title: '公民五件套（超值包）',
      titleEn: 'Civic Bundle (5-in-1)',
      originalPrice: 'RM 69.95',
      price: 'RM 28.00',
      summary: '在三件套的基础上，加入最实用的两册：《政府补助与津贴》与《数码公民安全》。从看懂制度、理清思路、有效行动，一路延伸到「顾好钱包、守住安全」——五册合购，省下最多。',
      summaryEn: "The foundation trio plus the two most practical add-ons: Government Aid & Subsidies and Digital Citizen Safety. From understanding the system to protecting your wallet and staying safe online — five guides, biggest saving.",
      cover: '/covers/civic-bundle-5in1.svg',
      buyUrl: '',
      includes: [
        { zh: '看懂大马政府 + 不被带风向 + 公民行动手册', en: 'Government + Critical Thinking + Citizen Action' },
        { zh: '政府补助与津贴速查手册', en: 'Government Aid & Subsidies' },
        { zh: '数码公民安全手册', en: 'Digital Citizen Safety' },
        { zh: '五册完整 PDF（中英双版，图文并茂）', en: 'All five full PDFs (bilingual, richly illustrated)' },
        { zh: '比原价省 RM 41 以上', en: 'Save over RM 41 vs original prices' },
      ],
    },
    {
      slug: '7in1-civic-bundle',
      status: 'available',
      title: '公民全套（完整图书馆）',
      titleEn: 'Civic Bundle (7-in-1)',
      originalPrice: 'RM 95.93',
      price: 'RM 38.00',
      summary: '一次拥有全部七册深度手册：从看懂政府与预算、到批判思考、公民行动、政府援助、数码安全、搞定政府部门——理解、想清楚、行动、顾好生活，一整套公民能力图书馆，合购最划算。',
      summaryEn: "Own all seven in-depth guides at once: understanding government and the Budget, critical thinking, citizen action, government aid, digital safety and dealing with government offices — a complete civic-skills library, at the best value.",
      cover: '/covers/civic-bundle-7in1.svg',
      buyUrl: '',
      includes: [
        { zh: '全部 7 册深度手册（中英双版）', en: 'All 7 in-depth guides (bilingual)' },
        { zh: '看懂大马政府 · 读懂大马预算案 · 不被带风向', en: 'Government · Budget Decoder · Critical Thinking' },
        { zh: '公民行动 · 政府补助 · 数码安全 · 搞定政府部门', en: 'Citizen Action · Aid · Digital Safety · Gov Offices' },
        { zh: '图文并茂、事实经官方来源核实', en: 'Richly illustrated, officially sourced' },
        { zh: '比原价省 RM 60 以上——最超值', en: 'Save over RM 60 vs original prices — best value' },
      ],
    },
  ],

  // ── 会员 / 付费订阅（/membership 页面） ──
  membership: {
    platform: 'manual', // 手动：DuitNow 收款 + Google 表格名单（见 google-apps-script.gs）
    joinUrl: '',
    priceMonthly: 'RM 15',
    priceNote: '可随时取消',
    priceNoteEn: 'Cancel anytime',
    perks: [
      { zh: '每周两篇会员专属深度文章 (国会解析&时事解析)', en: 'Two in-depth members-only articles every week (Parliamentary Analysis & Current Events Analysis)' },
      { zh: '每周5分钟便能知晓国家大小事', en: 'Stay informed about national affairs in just 5 minutes per week' },
      { zh: '新文章直接 email 送到你信箱', en: 'New articles delivered straight to your inbox' },
    ],
  },

  // ── 州选仪表板（/news/<slug> 页面） ──
  // 易变数据（席位、得票、投票率、逐席成绩）放在 Google 表格里管理：
  //   ① 每个仪表板建一个 Google 表格，做两个工作表：
  //      coalitions 阵营汇总：coalition(阵营) · party(政党,可选) · color(颜色,可选,如 #cc1438) · seats(席位) · votes(得票) · votePct(得票率,可选)
  //      seats 逐席成绩：seatCode(编号) · seat(选区) · seatEn(选区EN,可选) · coalition(胜出阵营) · party(政党) · candidate(候选人) · majority(多数票,可选) · status(状态)
  //   ② 文件 → 共享 → 发布到网页 → 两个工作表分别发布成 CSV，把网址填到 coalitionsCsv / seatsCsv。
  //   ③ pollingDate 改成正式投票日；投票前留空成绩，页面会显示倒计时与「成绩待公布」。
  coalitionColors: {
    PH: '#d7172a', BN: '#002d80', PN: '#0081a1', GPS: '#c0392b',
    GRS: '#1f6f3c', PAS: '#1f8a4c', MUDA: '#000000',
    BERSAMA: '#fff34d', PSM: '#a01212', ASLI: '#0d8f8f', BEBAS: '#888888',
  },
  dashboards: [
    {
      slug: 'johor',
      state: '柔佛', stateEn: 'Johor',
      title: '柔佛州选举仪表板', titleEn: 'Johor State Election Dashboard',
      pollingDate: '2026-07-11',
      totalSeats: 56,
      registeredVoters: '2,727,926',
      coalitionsCsv: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSDxWkSJapFLCqfNZgI10R6Eyu-MU47f4uXgytXL7m929cr8qL9_blXj-Nxnh71H2kEgUb8dWRmYPJn/pub?gid=1424052938&single=true&output=csv',
      seatsCsv: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSDxWkSJapFLCqfNZgI10R6Eyu-MU47f4uXgytXL7m929cr8qL9_blXj-Nxnh71H2kEgUb8dWRmYPJn/pub?gid=336478860&single=true&output=csv',
    },
    {
      slug: 'negeri-sembilan',
      state: '森美兰', stateEn: 'Negeri Sembilan',
      title: '森美兰州选举仪表板', titleEn: 'Negeri Sembilan State Election Dashboard',
      pollingDate: '2026-08-01',
      totalSeats: 36,
      registeredVoters: '889,490',
      coalitionsCsv: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4bDmPCwvcck6hDMD9tBQtOnlF4WL3gm65zvzh1Nksl5W8jedgFiWrdsvxgEUqtRJNSBSB1QvoIow7/pub?gid=46443980&single=true&output=csv',
      seatsCsv: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT4bDmPCwvcck6hDMD9tBQtOnlF4WL3gm65zvzh1Nksl5W8jedgFiWrdsvxgEUqtRJNSBSB1QvoIow7/pub?gid=940855089&single=true&output=csv',
    },
  ],

  // ── 网站分析（可选，隐私友好） ──
  analytics: { plausibleDomain: '' },
};
