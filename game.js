"use strict";

const roleRules = {
  planner: "每年首个公共空间或交通项目，建设费用－1。",
  engineer: "每年首个能源或基础设施项目落地后，系统韧性＋1。",
  port: "该玩家参与支持港口项目时，所需支持数－1。",
  budget: "每年首次建设项目，费用－1。"
};

const roles = [
  { id: "planner", code: "PL", name: "城市空间规划师", note: roleRules.planner },
  { id: "engineer", code: "EN", name: "能源与水务工程师", note: roleRules.engineer },
  { id: "port", code: "PO", name: "港口运营负责人", note: roleRules.port },
  { id: "budget", code: "CB", name: "气候预算官", note: roleRules.budget }
];

const projects = [
  { id:"blue-green", title:"蓝绿滨水空间", city:"哥本哈根", code:"CPH · SHORE · 01", cat:"公共空间", tone:"public", cost:3, actions:2, effect:{emissions:-1,resilience:2,support:1}, text:"让滨水空间同时承担公共活动与暴雨调蓄。", tags:["海岸线","韧性"] },
  { id:"walkway", title:"步行岸线连通", city:"哥本哈根", code:"CPH · SHORE · 02", cat:"公共空间", tone:"public", cost:2, actions:2, effect:{emissions:-1,support:2}, text:"用连续步行网络把城市生活重新引向海岸。", tags:["海岸线","慢行"] },
  { id:"floodscape", title:"城市防洪景观", city:"哥本哈根", code:"CPH · SHORE · 03", cat:"基础设施", tone:"public", cost:3, actions:2, effect:{resilience:3}, synergy:"blue-green", synergyText:"已建蓝绿滨水空间：公众支持＋1", text:"把极端降雨防护嵌入日常城市景观。", tags:["防洪","适应"] },
  { id:"arc", title:"残余垃圾能源回收", city:"哥本哈根", code:"CPH · ENERGY · 04", cat:"能源", tone:"energy", cost:3, actions:2, effect:{emissions:-1,resilience:1}, synergy:"district-heat", synergyText:"与区域供热联动：排放再−1", text:"回收残余垃圾中的能量，但必须警惕对焚烧能力的路径依赖。", tags:["ARC","循环"] },
  { id:"district-heat", title:"区域供热网络", city:"哥本哈根", code:"CPH · ENERGY · 05", cat:"能源", tone:"energy", cost:4, actions:3, effect:{emissions:-2,resilience:1}, synergy:"arc", synergyText:"接入能源回收：韧性再＋1", text:"把分散余热组织成覆盖城市的系统能力。", tags:["HOFOR","供热"] },
  { id:"water-monitor", title:"智慧供水监测", city:"哥本哈根", code:"CPH · WATER · 06", cat:"基础设施", tone:"energy", cost:2, actions:2, effect:{resilience:2}, text:"用实时监测减少漏损，并提前发现系统风险。", tags:["HOFOR","水务"] },
  { id:"bike", title:"自行车主干网络", city:"哥本哈根", code:"CPH · STREET · 07", cat:"交通", tone:"public", cost:2, actions:2, effect:{emissions:-2,support:1}, text:"让低碳交通成为日常便利，而不是额外牺牲。", tags:["街道","出行"] },
  { id:"harbor-bus", title:"电动港口巴士", city:"哥本哈根", code:"CPH · STREET · 08", cat:"交通", tone:"port", cost:3, actions:2, effect:{emissions:-2,support:1}, prerequisite:"grid", penalty:{resilience:-1}, text:"连接两岸公共空间，但新增电力需求必须被系统接住。", tags:["水上交通","电动化"] },
  { id:"slow-street", title:"社区慢行街区", city:"哥本哈根", code:"CPH · STREET · 09", cat:"公共空间", tone:"public", cost:2, actions:2, effect:{emissions:-1,support:2}, text:"以街道尺度改善步行体验与邻里交往。", tags:["街道","社区"] },
  { id:"climate-budget", title:"年度气候预算", city:"奥斯陆", code:"OSL · GOVERN · 10", cat:"治理", tone:"governance", cost:3, actions:2, effect:{support:1}, special:"audit", text:"把减排责任写入年度财政过程；从下一年起，每年额外获得 1 点预算。", tags:["CONCITO","治理"] },
  { id:"dashboard", title:"城市排放信息平台", city:"奥斯陆", code:"OSL · GOVERN · 11", cat:"治理", tone:"governance", cost:1, actions:2, effect:{support:1}, special:"insight", text:"公开进度、暴露缺口，让下一步决策有迹可循。", tags:["透明度","数据"] },
  { id:"hearing", title:"公众参与听证", city:"奥斯陆", code:"OSL · GOVERN · 12", cat:"治理", tone:"governance", cost:2, actions:2, effect:{support:2}, text:"让转型成本与收益在方案落地前得到讨论。", tags:["协商","公平"] },
  { id:"shore-power", title:"港口岸电系统", city:"奥斯陆", code:"OSL · PORT · 13", cat:"港口", tone:"port", cost:4, actions:3, effect:{emissions:-3}, prerequisite:"grid", penalty:{resilience:-2}, text:"船舶靠港时关闭辅机，但岸上电力系统必须先做好准备。", tags:["奥斯陆港","岸电"] },
  { id:"grid", title:"电网容量升级", city:"奥斯陆", code:"OSL · GRID · 14", cat:"基础设施", tone:"port", cost:3, actions:3, effect:{resilience:2}, text:"为岸电、电动交通与新设施留出可靠容量。", tags:["电网","配套"] },
  { id:"green-logistics", title:"绿色物流走廊", city:"奥斯陆", code:"OSL · PORT · 15", cat:"港口", tone:"port", cost:3, actions:2, effect:{emissions:-2,resilience:1}, text:"把港内设备、道路运输和仓储协同纳入转型。", tags:["物流","协同"] },
  { id:"co2-chain", title:"CO₂运输链试点", city:"奥斯陆", code:"OSL · PORT · 16", cat:"港口", tone:"port", cost:4, actions:3, effect:{emissions:-2,resilience:1}, prerequisite:"green-logistics", penalty:{support:-1}, text:"连接捕集、运输与封存环节，检验新型基础设施链条。", tags:["港口","试点"] },
  { id:"campus-energy", title:"校园能源监测", city:"带回校园", code:"THU · CAMPUS · 17", cat:"校园", tone:"campus", cost:2, actions:2, effect:{emissions:-1,support:1}, special:"campus", text:"把系统观念带回校园，从可见数据开始行动。", tags:["校园","监测"] },
  { id:"campus-network", title:"校园低碳行动网络", city:"带回校园", code:"THU · CAMPUS · 18", cat:"校园", tone:"campus", cost:2, actions:2, effect:{support:2,resilience:1}, text:"让技术方案、学生参与和制度安排形成长期协作。", tags:["校园","共建"] }
];

const events = [
  { id:"rain", title:"极端降雨", text:"短时强降雨逼近城市滨水区。", effectText:"若缺少适应项目，需要在预算和公众信任之间选择。", choice:[
    { label:"紧急加固", detail:"预算 −2，韧性 ＋1", effect:{budget:-2,resilience:1} },
    { label:"承担损失", detail:"韧性 −1，公众支持 −1", effect:{resilience:-1,support:-1} }
  ]},
  { id:"energy-price", title:"能源价格上涨", text:"进口能源价格快速波动，城市运行成本承压。", effectText:"区域供热系统可以缓冲冲击。", conditional:{project:"district-heat", success:{budget:1}, failure:{budget:-2}}, resultText:"区域供热已建成，城市获得系统红利。" },
  { id:"construction", title:"施工扰民争议", text:"多项基础设施同时开工，居民对噪声和绕行表达不满。", effectText:"选择放慢建设，或投入额外沟通。", choice:[
    { label:"增加沟通", detail:"预算 −1，公众支持 ＋1", effect:{budget:-1,support:1} },
    { label:"维持工期", detail:"公众支持 −1", effect:{support:-1} }
  ]},
  { id:"cruise", title:"邮轮旺季", text:"港口迎来客流与收入，也迎来靠港排放。", effectText:"岸电将改变这笔收益的代价。", conditional:{project:"shore-power", success:{budget:2}, failure:{budget:2,emissions:1}}, resultText:"岸电投入运行，港口收入不再附带额外靠港排放。" },
  { id:"sorting", title:"垃圾分类率提升", text:"源头分类改善，进入焚烧系统的残余垃圾减少。", effectText:"循环体系进步，也要求能源设施调整运行逻辑。", conditional:{project:"arc", success:{support:1,budget:-1}, failure:{support:1}}, resultText:"能源回收设施需要追加调整预算，但公众认可度上升。" },
  { id:"grid-peak", title:"港口用电高峰", text:"岸电、车辆与仓储设备同时提高用电需求。", effectText:"若已完成电网容量升级，系统韧性＋1；若尚未完成，系统韧性－1。", conditional:{project:"grid", success:{resilience:1}, failure:{resilience:-1}}, resultText:"已完成电网容量升级，系统韧性＋1。", failureText:"尚未完成电网容量升级，系统韧性－1。" },
  { id:"budget-cut", title:"财政预算削减", text:"经济放缓，年度可用资金减少。", effectText:"你们可以守住重点项目，或分散风险。", choice:[
    { label:"集中重点", detail:"预算 −1，公众支持 −1", effect:{budget:-1,support:-1} },
    { label:"延后维护", detail:"预算不变，韧性 −1", effect:{resilience:-1} }
  ]},
  { id:"civic", title:"青年气候倡议", text:"学生与社区联合要求城市公开转型进展。", effectText:"公开数据与气候预算会提高回应能力。", conditional:{project:"dashboard", success:{support:2}, failure:{support:-1}}, resultText:"公开平台使讨论建立在共同事实之上。" },
  { id:"cold", title:"冬季寒潮", text:"连续低温考验供热与电力保障。", effectText:"能源系统联动比单项设施更重要。", conditional:{project:"district-heat", success:{resilience:1}, failure:{resilience:-2}}, resultText:"区域供热网络稳定运行，城市经受住了寒潮。" },
  { id:"target", title:"减排目标提前", text:"议会要求将关键节点提前一个年度。", effectText:"立即承诺会提高信心，但也压缩财政空间。", choice:[
    { label:"接受提前", detail:"公众支持 ＋2，预算 −2", effect:{support:2,budget:-2} },
    { label:"坚持节奏", detail:"公众支持 −1，韧性 ＋1", effect:{support:-1,resilience:1} }
  ]}
];

const tutorialSlides = [
  {
    kicker:"第 1 步 / 处理年度事件",
    title:"先一起读事件，再选择城市如何回应。",
    text:"每年从事件开始。事件选择会立刻改变预算、公众支持或韧性；所有人共同讨论，由当前设备操作者点击答案。",
    visual:`<div class="tutorial-example"><span>事件出现</span><i>→</i><span>团队讨论</span><i>→</i><b>选择并结算</b></div>`
  },
  {
    kicker:"第 2 步 / 决定石油分红",
    title:"预算会增加，但收益逐次递减。",
    text:"本局第 1 次接受获得 3 预算，第 2 次获得 2 预算，第 3 次起只获得 1 预算；每次都增加 1 悖论。有效排放＝账面排放＋悖论。",
    visual:`<div class="tutorial-equation"><span>账面排放</span><b>＋</b><span>悖论</span><b>＝</b><strong>有效排放 ≤ 6</strong></div>`
  },
  {
    kicker:"第 3 步 / 当前玩家使用行动",
    title:"每人每年有 2 点行动。",
    text:"行动可以用于支持项目、公众沟通、应急维护，或每年一次刷新市场。对同一项目，同一玩家本年度只能支持一次，必须由不同玩家合作。",
    visual:`<div class="tutorial-metrics"><span>项目支持 <b>1 行动</b></span><span>公众沟通 <b>1行动＋1预算</b></span><span>应急维护 <b>1行动＋1预算</b></span></div>`
  },
  {
    kicker:"第 4 步 / 支付预算并落地",
    title:"支持填满后，落地项目不消耗行动。",
    text:"橙色支持格达到要求后，点击“支付并落地”即可结算。角色能力按团队每年触发，不取决于谁点击落地；港口负责人仍需亲自参与支持。",
    visual:`<div class="tutorial-role-rules"><span>${roleRules.planner}</span><span>${roleRules.engineer}</span><span>${roleRules.port}</span><span>${roleRules.budget}</span></div><div class="tutorial-example system"><span>不同玩家支持 ■■</span><i>→</i><span>支付预算</span><i>→</i><b>立即落地 · 0行动</b></div>`
  },
  {
    kicker:"第 5 步 / 传递设备与审计",
    title:"完成行动后交给下一位。",
    text:"最后一名玩家结束行动后，点击“年度审计”。五年后共同检查：有效排放不超过 6、支持至少 4、韧性至少 5、悖论不超过 2。",
    visual:`<div class="tutorial-metrics"><span class="carbon">有效排放 <b>≤6</b></span><span>支持 <b>≥4</b></span><span>韧性 <b>≥5</b></span></div>`
  }
];

const state = {
  playerCount: 3,
  players: [],
  activePlayer: 0,
  round: 1,
  emissions: 14,
  budget: 8,
  support: 5,
  resilience: 3,
  paradox: 0,
  oilAccepted: 0,
  deck: [],
  eventDeck: [],
  market: [],
  built: [],
  contributions: {},
  phase: "setup",
  logs: [],
  roleUsed: {},
  currentEvent: null,
  lastOutcome: "",
  marketRefreshed: false,
  refreshMode: false,
  lastPassAt: 0
};

let tutorialIndex = 0;
let tutorialLaunchesRound = false;

const $ = (id) => document.getElementById(id);
const clamp = (n,min=0,max=20) => Math.max(min,Math.min(max,n));
const clampMetric = (key,n) => clamp(n,0,["support","resilience"].includes(key) ? 10 : 20);
const shuffle = (array) => [...array].sort(() => Math.random() - .5);
const hasBuilt = (id) => state.built.some(p => p.id === id);

function renderRolePreview() {
  $("rolePreview").innerHTML = roles.slice(0,state.playerCount).map((r,i) => `
    <div class="role-preview-item"><b>${r.code}</b><strong>玩家 ${i+1} · ${r.name}</strong><span>${r.note}</span></div>
  `).join("");
}

function initPlayers() {
  state.players = roles.slice(0,state.playerCount).map((r,i) => ({...r, name:`玩家 ${i+1}`, actions:2}));
}

function resetState() {
  state.activePlayer = 0; state.round = 1; state.emissions = 14; state.budget = 8;
  state.support = 5; state.resilience = 3; state.paradox = 0; state.oilAccepted = 0; state.built = [];
  state.contributions = {}; state.logs = []; state.roleUsed = {};
  state.deck = shuffle(projects); state.eventDeck = shuffle(events);
  state.market = state.deck.splice(0,3); state.phase = "briefing"; state.currentEvent = null; state.lastOutcome = "";
  state.marketRefreshed = false; state.refreshMode = false; state.lastPassAt = 0;
  initPlayers();
}

function startGame({teach=true}={}) {
  resetState();
  $("setupScreen").classList.add("hidden");
  $("gameScreen").classList.remove("hidden");
  $("restartButton").classList.remove("hidden");
  addLog("城市简报", `${state.playerCount}名委员进入转型委员会。`);
  renderAll();
  if (teach) openTutorial(true);
  else beginRound();
}

function beginRound() {
  state.players.forEach(p => p.actions = 2);
  state.activePlayer = 0;
  state.roleUsed = {};
  state.contributions = {};
  state.marketRefreshed = false;
  state.refreshMode = false;
  if (state.round > 1) {
    state.budget = clampMetric("budget",state.budget + 3);
    const climateBudget = state.built.find(p=>p.id === "climate-budget");
    if (climateBudget && climateBudget.builtRound < state.round) {
      state.budget = clampMetric("budget",state.budget + 1);
      addLog("气候预算", "治理项目带来 1 点年度执行预算。 ");
    }
  }
  state.currentEvent = state.eventDeck.shift() || shuffle(events)[0];
  state.lastOutcome = "";
  state.phase = "event";
  renderAll();
  processEvent(state.currentEvent);
}

function applyEffect(effect={}) {
  for (const [key,value] of Object.entries(effect)) {
    if (["emissions","budget","support","resilience"].includes(key)) state[key] = clampMetric(key,state[key] + value);
  }
  renderAll();
}

function processEvent(event) {
  if (event.choice) {
    $("eventDialogContent").innerHTML = `
      <div class="event-modal"><p class="section-index">YEAR ${String(state.round).padStart(2,"0")} / 城市事件</p><h2>${event.title}</h2><p>${event.text}</p>
      <div class="choice-grid">${event.choice.map((c,i)=>`<button type="button" data-event-choice="${i}">${c.label}<small>${c.detail}</small></button>`).join("")}</div></div>`;
    $("eventDialog").showModal();
    document.querySelectorAll("[data-event-choice]").forEach(btn => btn.addEventListener("click", () => {
      if (state.phase !== "event") return;
      state.phase = "resolving";
      const choice = event.choice[Number(btn.dataset.eventChoice)];
      applyEffect(choice.effect); addLog(event.title, `${choice.label}：${choice.detail}`);
      state.lastOutcome = `事件结果：${choice.detail}`;
      $("eventDialog").close(); openOilDecision();
    }));
  } else if (event.conditional) {
    const success = hasBuilt(event.conditional.project);
    const effect = success ? event.conditional.success : event.conditional.failure;
    applyEffect(effect);
    const outcome = success ? event.resultText : (event.failureText || "缺少配套项目，城市承受了额外压力。");
    addLog(event.title, outcome);
    state.lastOutcome = `事件结果：${outcome}`;
    window.setTimeout(openOilDecision, 450);
  } else {
    openOilDecision();
  }
}

function openOilDecision() {
  state.phase = "oil";
  $("oilDecision").classList.remove("hidden");
  renderAll();
}

function resolveOil(accept) {
  if (state.phase !== "oil") return;
  if (accept) {
    const reward = Math.max(1,3-state.oilAccepted);
    state.budget = clampMetric("budget",state.budget + reward); state.paradox += 1; state.oilAccepted += 1;
    addLog("石油红利", `团队第${state.oilAccepted}次接受红利：预算＋${reward}，悖论标记＋1。`);
  } else addLog("石油红利", "团队拒绝本年度红利。 ");
  state.phase = "actions";
  $("oilDecision").classList.add("hidden");
  renderAll();
}

function contributionCount(id) { return new Set(state.contributions[id] || []).size; }
function hasRole(id) { return state.players.some(player => player.id === id); }
function requiredActions(project) {
  const supporters = state.contributions[project.id] || [];
  const portIndex = state.players.findIndex(p => p.id === "port");
  const base = project.actions + (state.playerCount === 4 ? 1 : 0);
  return project.cat === "港口" && supporters.includes(portIndex) ? Math.max(1,base-1) : base;
}

function roleDiscount(project) {
  if (hasRole("planner") && !state.roleUsed.planner && ["公共空间","交通"].includes(project.cat)) {
    return { amount:1, role:"planner" };
  }
  if (hasRole("budget") && !state.roleUsed.budget) return { amount:1, role:"budget" };
  return { amount:0, role:null };
}

function effectiveCost(project) {
  return Math.max(0,project.cost - roleDiscount(project).amount);
}

function supportProject(id) {
  if (state.phase !== "actions") return;
  const player = state.players[state.activePlayer];
  const project = state.market.find(p=>p.id===id);
  if (!project || player.actions < 1 || contributionCount(id) >= requiredActions(project)) return;
  state.contributions[id] ||= [];
  if (state.contributions[id].includes(state.activePlayer)) return;
  state.contributions[id].push(state.activePlayer);
  player.actions -= 1;
  addLog(player.name, `为“${project.title}”投入1点行动支持。`);
  renderAll();
}

function buildProject(id) {
  if (state.phase !== "actions" || state.refreshMode) return;
  const project = state.market.find(p=>p.id===id);
  if (!project) return;
  const need = requiredActions(project);
  const count = contributionCount(id);
  const discount = roleDiscount(project);
  const cost = Math.max(0,project.cost - discount.amount);
  if (count < need || state.budget < cost) return;

  if (discount.role) state.roleUsed[discount.role] = true;

  state.budget = clampMetric("budget",state.budget - cost);
  applyEffect(project.effect);
  let extra = "";
  if (project.prerequisite && !hasBuilt(project.prerequisite)) {
    applyEffect(project.penalty); extra = "；因缺少配套，承担额外代价";
  }
  if (project.synergy && hasBuilt(project.synergy)) {
    if (project.id === "arc") state.emissions = clampMetric("emissions",state.emissions - 1);
    if (project.id === "district-heat") state.resilience = clampMetric("resilience",state.resilience + 1);
    if (project.id === "floodscape") state.support = clampMetric("support",state.support + 1);
    extra += "；触发系统联动";
  }
  if (project.id === "co2-chain" && hasBuilt("green-logistics")) {
    state.emissions = clampMetric("emissions",state.emissions - 1);
    extra += "；绿色物流联动使减排再−1";
  }
  if (hasRole("engineer") && ["能源","基础设施"].includes(project.cat) && !state.roleUsed.engineer) {
    state.resilience = clampMetric("resilience",state.resilience + 1); state.roleUsed.engineer = true; extra += "；工程师能力使韧性＋1";
  }
  state.built.push({...project,builtRound:state.round});
  delete state.contributions[id];
  state.market = state.market.filter(p=>p.id!==id);
  if (state.deck.length) state.market.push(state.deck.shift());
  addLog("项目落地", `${project.title}，支付${cost}点预算${extra}。`);
  renderAll();
}

function quickAction(type) {
  if (state.phase !== "actions") return;
  const p = state.players[state.activePlayer];
  if (p.actions < 1 || state.budget < 1) return;
  p.actions -= 1; state.budget -= 1;
  if (type === "dialogue") { state.support = clampMetric("support",state.support+1); addLog(p.name,"开展公众沟通：支持＋1，预算−1。"); }
  else { state.resilience = clampMetric("resilience",state.resilience+1); addLog(p.name,"开展紧急维护：韧性＋1，预算−1。"); }
  renderAll();
}

function toggleRefreshMode() {
  const p = state.players[state.activePlayer];
  if (state.phase !== "actions" || state.marketRefreshed || !p || p.actions < 1 || state.deck.length < 1) return;
  state.refreshMode = !state.refreshMode;
  renderAll();
}

function refreshProject(id) {
  const p = state.players[state.activePlayer];
  const index = state.market.findIndex(card=>card.id===id);
  if (state.phase !== "actions" || state.marketRefreshed || !state.refreshMode || !p || p.actions < 1 || index < 0 || state.deck.length < 1) return;
  const removed = state.market[index];
  p.actions -= 1;
  delete state.contributions[id];
  state.market[index] = state.deck.shift();
  state.marketRefreshed = true;
  state.refreshMode = false;
  addLog(p.name, `花费1点行动，将“${removed.title}”移出市场。`);
  renderAll();
}

function nextPlayer() {
  if (state.phase !== "actions") return;
  const now = Date.now();
  if (now - state.lastPassAt < 350) return;
  state.lastPassAt = now;
  state.refreshMode = false;
  if (state.activePlayer < state.players.length - 1) {
    state.activePlayer += 1;
  } else {
    state.phase = "audit";
    addLog("年度待审计", "所有委员已完成本年度行动。未落地项目的支持将在审计后清空。 ");
  }
  renderAll();
}

function auditRound() {
  if (state.phase !== "audit") return;
  if (state.emissions >= 13) { state.support = clampMetric("support",state.support-1); addLog("年度审计","高排放压力持续，公众支持−1。 "); }
  state.contributions = {};
  if (state.support <= 0 || state.resilience <= 0 || state.round >= 5) return finishGame();
  state.round += 1;
  beginRound();
}

function finishGame() {
  state.phase = "result";
  const effective = state.emissions + state.paradox;
  let level, title, copy;
  if (effective <= 6 && state.support >= 4 && state.resilience >= 5 && state.paradox <= 2) {
    level="success"; title="深度转型"; copy="你们没有把绿色未来押在单一地标上，而是让预算、基础设施与公众参与形成了真正的系统。";
  } else if (effective <= 7 && state.support > 0 && state.resilience > 0) {
    level="limited"; title="有限转型"; copy="城市接近了减排目标，但部分成本被转移到城市之外，或系统与公众尚未完全跟上。转型仍需继续。";
  } else {
    level="failed"; title="转型受阻"; copy="目标、预算与运行现实未能形成闭环。失败并不意味着没有行动，而是提醒城市：零散项目无法替代系统转型。";
  }
  const unmet = [];
  if (effective > 6) unmet.push(`有效排放还高 ${effective-6}`);
  if (state.support < 4) unmet.push(`公众支持还差 ${4-state.support}`);
  if (state.resilience < 5) unmet.push(`系统韧性还差 ${5-state.resilience}`);
  if (state.paradox > 2) unmet.push(`悖论超过上限 ${state.paradox-2}`);
  $("resultContent").innerHTML = `
    <div class="result-wrap ${level}"><div class="result-band"></div><p class="result-kicker">FINAL AUDIT / 最终审计</p><h2>${title}</h2><p class="result-copy">${copy}</p>
    <div class="result-metrics"><div><span>有效排放</span><b>${effective}</b></div><div><span>公众支持</span><b>${state.support}</b></div><div><span>系统韧性</span><b>${state.resilience}</b></div><div><span>悖论标记</span><b>${state.paradox}</b></div></div>
    <div class="decision-summary"><b>本局关键决策</b><span>石油分红 ${state.oilAccepted} 次</span><span>落地项目 ${state.built.length} 个</span><span>有效排放 ${state.emissions}＋${state.paradox}＝${effective}</span><span>${unmet.length ? `未达成：${unmet.join("；")}` : "全部深度转型条件均已达成"}</span></div>
    <p class="result-copy"><b>留给下一组的问题：</b>如果绿色转型依赖化石能源收入，它是否仍然是真正的绿色转型？</p>
    <div class="result-actions"><button class="primary-button" id="resultRestart" type="button"><span>再进行一局</span><b>↻</b></button><button class="secondary-button" id="resultConcept" type="button">查看实体卡概念</button></div></div>`;
  $("resultDialog").showModal();
  $("resultRestart").addEventListener("click",()=>{ $("resultDialog").close(); startGame({teach:false}); });
  $("resultConcept").addEventListener("click",()=>{ $("resultDialog").close(); $("conceptDialog").showModal(); });
}

function metricHTML(name,key,max=20,override=null) {
  const value = override ?? state[key];
  return `<div class="metric ${key}"><div class="metric-name"><span>${name}</span><b>${value}</b></div><div class="metric-track"><div class="metric-fill" style="width:${clamp(value/max*100,0,100)}%"></div></div></div>`;
}

function renderMetrics() {
  const effective = state.emissions + state.paradox;
  $("metrics").innerHTML = metricHTML("账面排放","emissions")+metricHTML("有效排放","effective",20,effective)+metricHTML("公共预算","budget")+metricHTML("公众支持","support",10)+metricHTML("系统韧性","resilience",10);
  $("paradoxTokens").innerHTML = Array.from({length:state.paradox},()=>'<i class="token"></i>').join("") || '<small>尚未使用</small>';
}

function renderEvent() {
  const e = state.currentEvent;
  $("eventCard").innerHTML = e ? `<span class="event-meta">YEAR ${String(state.round).padStart(2,"0")} · CITY EVENT</span><h3>${e.title}</h3><p>${e.text}</p><span class="event-effect">${e.effectText}</span>` : "";
}

function renderMarket() {
  $("market").innerHTML = state.market.map(p => {
    const count = contributionCount(p.id); const need = requiredActions(p); const cost = effectiveCost(p);
    const ready = state.phase === "actions" && !state.refreshMode && count >= need && state.budget >= cost;
    const alreadySupported = (state.contributions[p.id] || []).includes(state.activePlayer);
    const canSupport = state.phase === "actions" && state.players[state.activePlayer]?.actions > 0 && count < need && !alreadySupported && !state.refreshMode;
    const prereq = p.prerequisite ? (hasBuilt(p.prerequisite) ? "配套已就绪" : "缺少配套将受罚") : (p.synergyText || "可独立落地");
    const imageMap = {public:"waterfront.webp",campus:"campus.webp",energy:"energy.webp",port:"port.webp",governance:"governance.webp"};
    const altMap = {public:"北欧滨水公园与韧性景观",campus:"校园低碳能源监测场景",energy:"哥本哈根冬季区域能源设施",port:"奥斯陆港电动渡轮岸电设施",governance:"奥斯陆气候治理协作会议"};
    let supportReason = "";
    if (state.phase !== "actions") supportReason = "当前还未进入玩家行动阶段";
    else if (state.refreshMode) supportReason = "请先选择要替换的市场卡";
    else if (alreadySupported) supportReason = "本项目本年度你已支持过";
    else if (count >= need) supportReason = "所需支持已经满足";
    else if ((state.players[state.activePlayer]?.actions || 0) < 1) supportReason = "当前玩家没有剩余行动";
    const stateText = ready ? `支持已满，可以支付 ${cost} 预算落地（不耗行动）` : alreadySupported ? "本项目本年度你已支持过，请换一个项目" : count < need ? `已有 ${count} 名不同玩家支持，还差 ${need-count} 名` : `支持已满，还缺 ${Math.max(0,cost-state.budget)} 点预算`;
    return `<article class="project-card">
      <div class="project-photo tone-${p.tone}" data-code="${p.code}"><img src="./assets/${imageMap[p.tone] || imageMap.public}" alt="${altMap[p.tone] || altMap.public}" loading="lazy">${state.refreshMode ? `<button class="refresh-card" type="button" data-refresh="${p.id}">替换这张卡</button>` : ""}</div>
      <div class="project-content"><div class="project-tags"><span>${p.city}</span>${p.tags.map(t=>`<span>${t}</span>`).join("")}</div><h3>${p.title}</h3><p>${p.text}</p>
      <div class="project-numbers"><div><span>预算</span><b>${cost}${cost<p.cost?"↓":""}</b></div><div><span>所需支持</span><b>${need}</b></div></div>
      <p class="support-line">${prereq}</p><div class="support-track">${Array.from({length:need},(_,i)=>`<i class="support-dot ${i<count?"filled":""}"></i>`).join("")}</div><p class="project-state ${ready?"ready":""}">${stateText}</p></div>
      <div class="project-actions"><button type="button" data-support="${p.id}" title="${canSupport?"花费当前玩家1点行动":supportReason}" ${canSupport?"":"disabled"}>投入 1 行动</button><button class="build-button" type="button" data-build="${p.id}" title="${ready?`支付${cost}预算并立即结算效果，不消耗行动`:stateText}" ${ready?"":"disabled"}>支付并落地</button></div>
    </article>`;
  }).join("");
  document.querySelectorAll("[data-support]").forEach(b=>b.addEventListener("click",()=>supportProject(b.dataset.support)));
  document.querySelectorAll("[data-build]").forEach(b=>b.addEventListener("click",()=>buildProject(b.dataset.build)));
  document.querySelectorAll("[data-refresh]").forEach(b=>b.addEventListener("click",()=>refreshProject(b.dataset.refresh)));
}

function renderPlayers() {
  const p = state.phase === "audit" || state.phase === "result" ? null : state.players[state.activePlayer];
  $("activePlayerName").textContent = p ? p.name : "年度审计";
  $("activePlayerRole").textContent = p ? (roles.find(r=>r.id===p.id)?.name || "") : "等待结算";
  $("actionPips").innerHTML = p ? Array.from({length:2},(_,i)=>`<i class="action-pip ${i<p.actions?"":"used"}"></i>`).join("") : "";
  const enabled = state.phase === "actions" && p?.actions > 0 && state.budget > 0 && !state.refreshMode;
  $("dialogueAction").disabled = !enabled; $("maintenanceAction").disabled = !enabled;
  $("dialogueAction").title = enabled ? "花费1行动和1预算，公众支持＋1" : "需要处于行动阶段，且有剩余行动与预算";
  $("maintenanceAction").title = enabled ? "花费1行动和1预算，系统韧性＋1" : "需要处于行动阶段，且有剩余行动与预算";
  $("nextPlayerButton").disabled = state.phase !== "actions" || state.refreshMode;
  $("nextPlayerButton").textContent = state.activePlayer === state.players.length-1 ? "结束年度行动" : "交给下一位";
  const refreshEnabled = state.phase === "actions" && !state.marketRefreshed && p?.actions > 0 && state.deck.length > 0;
  $("refreshButton").disabled = !refreshEnabled && !state.refreshMode;
  $("refreshButton").textContent = state.refreshMode ? "取消刷新" : state.marketRefreshed ? "本年已刷新" : "刷新 1 张 · 1行动";
  $("refreshButton").title = state.marketRefreshed ? "每年只能刷新一次" : refreshEnabled ? "进入选择模式，再点击要替换的项目卡" : "需要行动阶段与至少1点行动";
}

function renderBuilt() {
  $("builtCount").textContent = state.built.length;
  $("builtProjects").innerHTML = state.built.length ? state.built.map(p=>`<span class="built-chip">${p.title}</span>`).join("") : '<p class="empty-copy">城市仍在等待第一个改变。</p>';
}

function addLog(title,text) {
  state.logs.unshift({round:state.round,title,text});
  renderLog();
}

function renderLog() {
  $("logCount").textContent = state.logs.length;
  $("gameLog").innerHTML = state.logs.map(l=>`<div class="log-item"><b>Y${l.round} · ${l.title}</b>　${l.text}</div>`).join("");
}

function renderAll() {
  $("roundLabel").textContent = `${String(state.round).padStart(2,"0")} / 05`;
  const phaseNames = {briefing:"新手简报",event:"事件阶段",oil:"资金选择",actions:"轮流行动",audit:"年度审计",result:"结局"};
  $("phaseBadge").textContent = phaseNames[state.phase] || "城市简报";
  $("auditButton").disabled = state.phase !== "audit";
  $("auditButton").title = state.phase === "audit" ? "结算本年度并进入下一年" : "所有玩家结束行动后才可审计";
  const reward = Math.max(1,3-state.oilAccepted);
  $("acceptOil").textContent = `接受：＋${reward}预算 / ＋1悖论`;
  $("oilPreview").textContent = `这是本局第 ${state.oilAccepted+1} 次机会：接受可得 ${reward} 点预算，同时增加 1 枚悖论标记。`;
  renderMetrics(); renderEvent(); renderMarket(); renderPlayers(); renderBuilt(); renderLog(); renderGuide();
}

function renderGuide() {
  const readyProject = state.market.find(card => contributionCount(card.id) >= requiredActions(card) && state.budget >= effectiveCost(card));
  const steps = ["1 事件","2 资金","3 行动","4 落地","5 审计"];
  let current = -1;
  if (state.phase === "event") current = 0;
  if (state.phase === "oil") current = 1;
  if (state.phase === "actions") current = readyProject ? 3 : 2;
  if (state.phase === "audit") current = 4;
  if (state.phase === "result") current = 5;
  $("phaseRail").innerHTML = steps.map((label,i)=>`<span class="${i===current?"active":""} ${i<current?"done":""}">${label}</span>`).join("");

  let kicker="现在该做什么", title="阅读城市局面", copy="跟随高亮步骤完成本年度流程。";
  if (state.phase === "briefing") {
    title="先完成 5 步新手教学"; copy="教学按真实回合顺序展开，结束后会直接弹出第一个年度事件。";
  } else if (state.phase === "event") {
    title="第 1 步：处理年度事件"; copy="阅读弹窗，与同伴讨论后选择一种回应；结果只会结算一次。";
  } else if (state.phase === "oil") {
    title="第 2 步：决定是否接受石油分红"; copy=`${state.lastOutcome ? state.lastOutcome+"　" : ""}本次接受可得 ${Math.max(1,3-state.oilAccepted)} 预算，并增加 1 悖论。`;
  } else if (state.phase === "actions") {
    const p = state.players[state.activePlayer];
    kicker=`现在该做什么 · ${p?.name || "当前玩家"}还剩 ${p?.actions ?? 0} 行动`;
    if (state.refreshMode) { title="选择 1 张市场卡替换"; copy="点击卡片图片上的“替换这张卡”；此操作每年一次，消耗当前玩家 1 行动。"; }
    else if (readyProject) { title=`第 4 步：“${readyProject.title}”可以落地`; copy="点击“支付并落地”。只支付预算，不消耗行动；落地后仍可继续使用剩余行动。"; }
    else if ((p?.actions ?? 0) > 0) { title="第 3 步：使用 2 个行动"; copy="支持项目、公众沟通或应急维护。同一项目本年度只能由你支持一次，需要不同玩家合作。"; }
    else { title="第 5 步：把设备交给下一位"; copy="当前玩家行动已用完。点击右侧按钮；最后一位结束后会进入年度审计。"; }
  } else if (state.phase === "audit") {
    title="第 5 步：完成年度审计"; copy="点击项目市场右上方“年度审计”，结算本年并进入下一年；未落地支持会清空。";
  }
  $("guideKicker").textContent = kicker;
  $("guideTitle").textContent = title;
  $("guideText").textContent = copy;
  const effective = state.emissions + state.paradox;
  $("winCheckText").textContent = `有效排放 ${effective}/6 · 支持 ${state.support}/4 · 韧性 ${state.resilience}/5 · 悖论 ${state.paradox}/2`;
  $("paradoxWarning").classList.toggle("hidden",state.paradox <= 2);

  const firstYear = state.round === 1;
  $("oilDecision").classList.toggle("coach-focus",firstYear && state.phase === "oil");
  $("market").classList.toggle("coach-focus",firstYear && state.phase === "actions");
  $("actionBar").classList.toggle("coach-focus",firstYear && state.phase === "actions");
  $("auditButton").classList.toggle("coach-focus",firstYear && state.phase === "audit");
}

function renderTutorial() {
  const slide = tutorialSlides[tutorialIndex];
  $("tutorialProgress").textContent = `${tutorialIndex+1} / ${tutorialSlides.length}`;
  $("tutorialContent").innerHTML = `<p class="tutorial-kicker">${slide.kicker}</p><h2>${slide.title}</h2><p class="tutorial-copy">${slide.text}</p>${slide.visual}`;
  $("tutorialBack").disabled = tutorialIndex === 0;
  $("tutorialNext").querySelector("span").textContent = tutorialIndex === tutorialSlides.length-1 ? (tutorialLaunchesRound ? "开始处理事件" : "完成") : "下一步";
}

function openTutorial(launchRound=false) {
  tutorialIndex = 0;
  tutorialLaunchesRound = launchRound;
  renderTutorial();
  if (!$("tutorialDialog").open) $("tutorialDialog").showModal();
}

function closeTutorial() {
  $("tutorialDialog").close();
}

document.querySelectorAll(".count-option").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".count-option").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active"); state.playerCount = Number(btn.dataset.count); renderRolePreview();
}));
$("startButton").addEventListener("click",()=>startGame({teach:true}));
$("tutorialButton").addEventListener("click",()=>openTutorial(false));
$("tutorialBack").addEventListener("click",()=>{ if (tutorialIndex>0) { tutorialIndex-=1; renderTutorial(); } });
$("tutorialNext").addEventListener("click",()=>{ if (tutorialIndex<tutorialSlides.length-1) { tutorialIndex+=1; renderTutorial(); } else closeTutorial(); });
$("tutorialDialog").addEventListener("close",()=>{ if (tutorialLaunchesRound && state.phase === "briefing") { tutorialLaunchesRound=false; beginRound(); } });
$("acceptOil").addEventListener("click",()=>resolveOil(true));
$("declineOil").addEventListener("click",()=>resolveOil(false));
$("nextPlayerButton").addEventListener("click",nextPlayer);
$("auditButton").addEventListener("click",auditRound);
$("refreshButton").addEventListener("click",toggleRefreshMode);
$("dialogueAction").addEventListener("click",()=>quickAction("dialogue"));
$("maintenanceAction").addEventListener("click",()=>quickAction("maintenance"));
$("rulesButton").addEventListener("click",()=>$("rulesDialog").showModal());
$("conceptButton").addEventListener("click",()=>$("conceptDialog").showModal());
function currentShareUrl() {
  if (!["http:","https:"].includes(location.protocol)) return "";
  return new URL("./",location.href).href;
}

function updateSharePanel() {
  const url=currentShareUrl();
  const qrImage=$("shareQrImage");
  if (!url) {
    $("shareUrlText").textContent="本地文件模式（部署后自动显示网址）";
    $("shareStatus").textContent="游戏可直接游玩；二维码和网址复制功能会在静态服务器部署后启用。";
    qrImage.src="./assets/app-icon.svg";
    qrImage.alt="冷海筑新北境转型应用图标";
    return;
  }
  $("shareUrlText").textContent=url;
  $("shareStatus").textContent="二维码已按当前部署地址生成，可扫码打开。";
  if (window.LengHaiQR?.createSvgDataUrl) {
    qrImage.src=window.LengHaiQR.createSvgDataUrl(url);
    qrImage.alt=`冷海筑新北境转型网站二维码，指向 ${url}`;
  }
}

$("shareButton").addEventListener("click",()=>{ updateSharePanel(); $("shareDialog").showModal(); });
$("copySiteLink").addEventListener("click",async()=>{
  const url=currentShareUrl();
  if (!url) {
    $("shareStatus").textContent="当前为本地文件；部署到静态服务器后即可复制网址并生成二维码。";
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    $("shareStatus").textContent="在线网址已复制。";
  } catch {
    const area=document.createElement("textarea");
    area.value=url; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove();
    $("shareStatus").textContent="在线网址已复制。";
  }
});
$("restartButton").addEventListener("click",()=>{ if (confirm("重新开始会清除本局进度，确定吗？")) startGame({teach:false}); });
$("printConcept").addEventListener("click",()=>window.print());
$("logToggle").addEventListener("click",()=>{ const log=$("gameLog"); log.classList.toggle("hidden"); $("logToggle").setAttribute("aria-expanded",String(!log.classList.contains("hidden"))); });
document.querySelectorAll("[data-close]").forEach(btn=>btn.addEventListener("click",()=>$(btn.dataset.close).close()));
document.querySelectorAll("dialog").forEach(d=>d.addEventListener("click",e=>{ if (e.target===d && d.id!=="eventDialog" && d.id!=="resultDialog") d.close(); }));

renderRolePreview();

if (typeof navigator !== "undefined" && "serviceWorker" in navigator && ["http:","https:"].includes(location.protocol)) {
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
