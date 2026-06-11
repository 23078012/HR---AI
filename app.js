const $ = (id)=>document.getElementById(id);
const state = { profile: JSON.parse(localStorage.getItem('fg_profile')||'null'), chat: JSON.parse(localStorage.getItem('fg_chat')||'[]') };

const stageMap = {
  '大一':'行业认知期','大二':'岗位探索期','大三':'实习准备期','大四':'求职冲刺期','研一/研二':'实习准备期','研三':'求职冲刺期'
};
const roleSkills = {
  '技术研发':['编程基础','数据结构与算法','工程项目','代码协作','系统设计入门'],
  '产品经理':['用户洞察','需求分析','原型设计','数据意识','跨团队沟通'],
  '运营/市场':['内容策划','用户增长','活动复盘','数据分析','热点敏感度'],
  '设计':['作品集','视觉表达','交互体验','设计规范','用户研究'],
  '职能/HR/财务':['结构化表达','业务理解','数据处理','沟通协作','专业证书/案例']
};
const roleProjects = {
  '技术研发':'做一个可上线的小工具：如课程表助手/简历解析器/校园二手平台，沉淀 GitHub 和技术复盘。',
  '产品经理':'选择一个校园高频场景，完成用户访谈、竞品分析、PRD、原型和指标设计。',
  '运营/市场':'策划一次社群增长或内容活动，记录目标、动作、数据和复盘。',
  '设计':'围绕一个 App 功能做体验改版，输出调研、流程、线框图、高保真和设计说明。',
  '职能/HR/财务':'做一个组织/财务/招聘分析案例，用数据和业务逻辑说明你的判断。'
};

function inferDirection(major, direction, skills=''){
  const text = `${major} ${direction} ${skills}`.toLowerCase();
  if(direction !== '还不确定') return direction;
  if(/计算机|软件|ai|人工智能|数据|python|java|算法|前端|后端/.test(text)) return '技术研发';
  if(/设计|视觉|交互|figma|ui|ux/.test(text)) return '设计';
  if(/新闻|传播|广告|市场|运营|社群|短视频|内容/.test(text)) return '运营/市场';
  if(/金融|财务|会计|人力|管理|法学/.test(text)) return '职能/HR/财务';
  return '产品经理';
}
function weaknesses(stage, role){
  const base = {
    '行业认知期':['行业地图不清晰','还没有可展示项目','对岗位日常理解偏抽象'],
    '岗位探索期':['专业能力与岗位要求尚未对齐','缺少一段完整项目复盘','信息来源分散'],
    '实习准备期':['简历亮点需要量化','面试表达需要结构化','投递策略需要更聚焦'],
    '求职冲刺期':['岗位优先级需要排序','面试复盘不够系统','焦虑容易影响行动节奏']
  }[stage];
  return base.map((x,i)=> i===1 ? `${x}（建议围绕${role}补齐）` : x);
}
function buildPlan(stage, role){
  const common = [
    `Day1：画出${role}岗位能力树，标出自己已有证据。`,
    `Day2：阅读 2 个真实 JD，提取 5 个高频关键词。`,
    `Day3：完成一个小项目/经历的 STAR 复盘。`,
    `Day4：把简历中 1 段经历改成“动作+结果+数据”。`,
    `Day5：做一次 20 分钟模拟面试并记录卡点。`,
    `Day6：找 1 位学长/同学做信息访谈，问清岗位日常。`,
    `Day7：确定下周 3 个行动：学习、项目、投递/交流。`
  ];
  if(stage==='行业认知期') common[0]=`Day1：了解互联网 5 类岗位：技术、产品、设计、运营、职能。`;
  if(stage==='求职冲刺期') common[1]=`Day2：建立投递看板：岗位、进度、面试题、复盘结论。`;
  return common;
}
function renderProfile(p){
  const html = `<div><span class="tag">${p.stage}</span><span class="tag green">推荐方向：${p.role}</span><span class="tag orange">成长任务：7 天</span></div>
  <h3>为什么这样匹配？</h3><p class="muted">结合你的年级、专业、目标方向与经历，当前最重要的不是“马上完美”，而是把模糊兴趣变成可验证的项目和表达证据。</p>
  <h3>三个待补齐短板</h3><ul>${p.gaps.map(x=>`<li>${x}</li>`).join('')}</ul>
  <h3>7 天鹅蛋任务</h3><div class="plan">${p.plan.map(x=>`<div class="plan-item">${x}</div>`).join('')}</div>`;
  $('profileResult').innerHTML = html;
}
$('profileForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const grade=$('grade').value, major=$('major').value||'未填写专业', direction=$('direction').value, pain=$('pain').value, experience=$('experience').value;
  const stage=stageMap[grade]||'岗位探索期';
  const role=inferDirection(major,direction,experience+pain);
  const p={grade,major,direction,pain,experience,stage,role,gaps:weaknesses(stage,role),plan:buildPlan(stage,role)};
  state.profile=p; localStorage.setItem('fg_profile',JSON.stringify(p)); renderProfile(p);
});
function addMsg(type, text){ state.chat.push({type,text}); localStorage.setItem('fg_chat',JSON.stringify(state.chat)); renderChat(); }
function renderChat(){ const box=$('chatBox'); box.innerHTML=state.chat.map(m=>`<div class="msg ${m.type}">${m.text}</div>`).join(''); box.scrollTop=box.scrollHeight; }
function answer(q){
  const p=state.profile||{}; const role=p.role||inferDirection('', '还不确定', q); const stage=p.stage||'岗位探索期';
  let pre = `我是未来鹅，先帮你把问题拆小一点：\n`;
  if(/焦虑|来不及|没回应|压力|害怕/.test(q)) return `先抱抱你。求职焦虑通常不是能力不行，而是“信息不确定 + 行动不可见”。\n\n建议你今天只做 3 件事：\n1. 把投递表补齐：公司/岗位/状态/下一步；\n2. 复盘最近一次没回应的岗位，检查 JD 关键词是否出现在简历里；\n3. 约一次模拟面试或找同学互看简历。\n\n鹅蛋任务：把一个岗位 JD 复制出来，圈出 5 个关键词，再改简历中的 1 段经历。`;
  if(/简历|经历|没有大厂/.test(q)) return `${pre}没有大厂实习也可以写出可信度，关键是把“职责”改成“证据”。\n\n模板：我在【场景】中，为了【目标】，采取【动作】，带来【结果/数据/反馈】。\n\n可写素材：课程项目、比赛、社团活动、志愿项目、个人作品、开源贡献、调研报告。\n\n鹅蛋任务：选一段经历，用 STAR 写 120 字，并至少加入 1 个数字。`;
  if(/产品|pm|需求|项目/.test(q)) return `${pre}产品经理准备重点不是“会画原型”，而是能证明你理解用户、业务和优先级。\n\n建议项目：${roleProjects['产品经理']}\n\n产出物：10 份用户访谈、竞品表、用户旅程、PRD、低保真原型、指标看板。\n\n鹅蛋任务：今晚选一个校园场景，写出 3 类用户痛点和 1 个 MVP 功能。`;
  if(/技术|开发|算法|计算机|代码/.test(q)) return `${pre}计算机同学除了开发，也可以探索测试开发、算法/数据、技术产品、安全、运维开发、游戏客户端等方向。\n\n建议你先用“能力证据”判断：算法强→技术研究/算法；工程项目强→后台/前端/客户端；沟通和业务理解强→技术产品。\n\n鹅蛋任务：整理一个项目的技术难点、你的贡献和性能/效果指标。`;
  if(/腾讯|鹅厂|实习|校招|投递/.test(q)) return `${pre}建议把“了解公司”拆成三层：业务理解、岗位要求、个人证据。实习阶段重点看潜力和匹配度，校招阶段更看稳定的能力证据。\n\n准备顺序：岗位 JD → 能力关键词 → 简历证据 → 面试故事 → 投递节奏。\n\n鹅蛋任务：选择 2 个目标岗位，做一张“JD关键词—我的证据”对照表。`;
  return `${pre}你现在处于「${stage}」，建议先围绕「${role}」做一个最小验证。\n\n1. 看 2 个 JD，找高频能力词；\n2. 做一个小项目或复盘已有经历；\n3. 用 STAR 形成可面试表达；\n4. 每周更新一次成长看板。\n\n鹅蛋任务：今天写下你最想验证的 1 个岗位假设：我是否适合____，我将通过____来验证。`;
}
function sendChat(){ const input=$('chatInput'); const q=input.value.trim(); if(!q) return; addMsg('user',q); input.value=''; setTimeout(()=>addMsg('bot',answer(q)),250); }
function askQuick(q){ $('chatInput').value=q; sendChat(); }
function clearChat(){ state.chat=[]; localStorage.removeItem('fg_chat'); renderChat(); }
function runRadar(){ const skills=$('skills').value; const p=state.profile||{}; const role=inferDirection(p.major||'', p.direction||'还不确定', skills); const skillsNeed=roleSkills[role]; $('radarResult').innerHTML=`<span class="tag green">最高匹配：${role}</span><h3>适配理由</h3><p class="muted">你的输入中出现了与 ${role} 相关的技能/兴趣信号。建议不要只看岗位名称，而要补齐可展示证据。</p><h3>能力差距</h3><ul>${skillsNeed.map(s=>`<li>${s}</li>`).join('')}</ul><h3>推荐项目</h3><p>${roleProjects[role]}</p><h3>面试高频问题</h3><ol><li>你为什么选择${role}？</li><li>讲一个最能体现你能力的项目。</li><li>如果资源有限，你如何做优先级判断？</li></ol>`; }
const qs={
  '产品经理':['请讲一个你发现用户痛点并提出解决方案的经历。','如果微信读书要提升大学生留存，你会怎么分析？','你如何判断一个需求是否值得做？'],
  '技术研发':['请介绍一个你最熟悉的项目架构和技术难点。','如何优化一个接口响应慢的问题？','你如何保证代码质量和协作效率？'],
  '运营/市场':['请复盘一次活动/内容运营经历。','如果要做校园用户增长，你会设计哪些动作？','你如何判断一场活动是否成功？'],
  '设计':['请介绍作品集中最满意的一个项目。','你如何处理业务目标与用户体验的冲突？','如何验证你的设计方案有效？']
};
function newQuestion(){ const role=$('interviewRole').value; const arr=qs[role]; $('question').textContent=arr[Math.floor(Math.random()*arr.length)]; $('interviewResult').className='empty'; $('interviewResult').textContent='回答后可评分。'; }
function scoreInterview(){ const ans=$('answer').value.trim(); if(!ans){$('interviewResult').textContent='请先输入回答。';return;} let score=60; if(ans.length>120) score+=10; if(/背景|任务|行动|结果|目标|数据|复盘|用户|指标/.test(ans)) score+=15; if(/\d+|%|人|次|天|周/.test(ans)) score+=10; score=Math.min(score,95); $('interviewResult').innerHTML=`<span class="tag">表达评分：${score}/100</span><h3>亮点</h3><p class="muted">你已经给出了基本经历，具备继续追问的空间。</p><h3>优化建议</h3><ul><li>开头先用一句话说明项目目标和你的角色。</li><li>补充可量化结果，如用户数、效率、转化率或反馈。</li><li>结尾加入复盘：如果重来一次，你会如何优化。</li></ul><h3>追问</h3><p>这段经历里，最关键的取舍是什么？如果资源减半，你会保留哪个动作？</p>`; }
function seedDemo(){ $('grade').value='大三'; $('major').value='新闻传播'; $('direction').value='产品经理'; $('pain').value='想投腾讯产品实习，但没有大厂经历，不知道项目怎么准备。'; $('experience').value='做过校园公众号运营、一次用户调研课程项目，会用 Figma 和 Excel。'; $('skills').value='用户访谈、公众号运营、Figma、竞品分析、Excel 数据分析、校园活动策划'; document.querySelector('#profileForm button').click(); window.location.hash='#diagnosis'; }
function callRealAI(message){
  // 可选：接入 Dify/元器等真实智能体 API。
  // 1. 在平台发布应用并获取 API Endpoint / Key。
  // 2. 用 fetch 调用接口，并将返回内容替换 answer(message)。
  // 注意：正式上线不要把 Key 写在前端，应通过 Serverless Function 转发。
  return Promise.resolve(answer(message));
}
if(state.profile) renderProfile(state.profile); renderChat();
if(!state.chat.length){ addMsg('bot','你好，我是未来鹅 FutureGoose。你可以问我岗位、简历、实习、面试或求职焦虑问题。建议先完成上方 30 秒诊断，我会给你更个性化的建议。'); }
