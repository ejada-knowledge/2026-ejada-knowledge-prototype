/* ============================================================
   إجادة للابتكار والمعرفة المؤسسية — App logic (demo prototype)
   Single-page, hash-routed, bilingual (AR default / EN secondary).
   All data is local/demo only — no backend, no real auth.
   ============================================================ */

(function(){

  /* ---------------- Persistent demo state ---------------- */
  const STATE_KEY = "ejada_demo_state_v1";
  const LANG_KEY = "ejada_demo_lang";

  function loadState(){
    try{
      const raw = localStorage.getItem(STATE_KEY);
      if(raw) return JSON.parse(raw);
    }catch(e){}
    return { adoptionRequests: [], postImplEntries: [], evolutionExtra: [] };
  }
  function saveState(){ localStorage.setItem(STATE_KEY, JSON.stringify(appState)); }

  let appState = loadState();
  appState.importedInitiatives = appState.importedInitiatives || [];
  function allCards(){ return INITIATIVE_CARDS.concat(appState.importedInitiatives); }
  let lang = localStorage.getItem(LANG_KEY) || "ar";

  let discoverState = {
    q: "", domain: "all", entity: "all", challengeType: "all",
    kpi: "all", sharingLevel: "all", adaptability: "all", status: "all",
    sort: "relatedness", fromGoal: false,
  };

  /* ---------------- Helpers ---------------- */
  function t(key){
    const parts = key.split(".");
    let node = STR[lang];
    for(const p of parts){ node = node && node[p]; }
    return node === undefined ? key : node;
  }
  function L(obj){ return obj ? obj[lang] : ""; }
  function esc(str){
    if(str === undefined || str === null) return "";
    return String(str)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function uid(prefix){ return prefix + "-" + Math.random().toString(36).slice(2,9); }
  function demoBadge(){
    return `<span class="badge badge-demo">⚠ ${t("demoDataLabel")}</span>`;
  }
  function exampleBadge(){
    return `<span class="badge badge-demo">${t("exampleBadge")}</span>`;
  }
  function levelBadge(n){
    return `<span class="badge badge-accent">${lang==="ar" ? "مستوى "+["الأول","الثاني","الثالث"][n-1] : "Level "+n}</span>`;
  }
  function accessBadge(id){
    const a = ACCESS_LEVELS.find(x=>x.id===id);
    if(!a) return "";
    return `<span class="badge badge-neutral">${esc(L(a))}</span>`;
  }

  function getInitiativeById(id){
    if(!id) return null;
    if(id === MAIN_INITIATIVE.id) return { kind:"main", data: MAIN_INITIATIVE };
    const card = allCards().find(c=>c.id===id);
    if(card) return { kind:"card", data: card };
    return null;
  }

  /* synthesize a full 20-field style detail object for lightweight cards */
  /* Unified-form import schema: JSON key / CSV header (EN or AR aliases) → card field */
  const IMPORT_FIELDS = [
    { key:"title", fkey:"f1_title", required:true, aliases:["title","initiativeTitle","عنوان المبادرة","اسم المبادرة"] },
    { key:"innovator", fkey:"f2_owner", aliases:["innovator","owner","initiativeOwner","صاحب المبادرة","صاحب المبادرة الأصلي"] },
    { key:"entity", fkey:"f3_entity", aliases:["entity","organization","الجهة","الجهة الأصلية"] },
    { key:"approvalDate", fkey:"f4_date", aliases:["approvalDate","date","تاريخ الاعتماد"] },
    { key:"problem", fkey:"f5_problem", aliases:["problem","challenge","المشكلة"] },
    { key:"goal", fkey:"f6_goal", aliases:["goal","relatedGoal","الهدف","الهدف المرتبط"] },
    { key:"kpis", fkey:"f7_kpis", aliases:["kpis","kpi","مؤشرات الأداء","مؤشر الأداء","مؤشرات الأداء المرتبطة"] },
    { key:"solution", fkey:"f8_solution", aliases:["solution","الحل"] },
    { key:"whyChosen", fkey:"f9_whyChosen", aliases:["whyChosen","rationale","لماذا تم اختيار هذا الحل","مبررات اختيار الحل"] },
    { key:"steps", fkey:"f10_steps", aliases:["steps","implementationSteps","خطوات التنفيذ"] },
    { key:"resources", fkey:"f11_resources", aliases:["resources","requirements","الموارد","الموارد والمتطلبات"] },
    { key:"results", fkey:"f12_results", aliases:["results","outcome","النتائج"] },
    { key:"evidence", fkey:"f13_evidence", aliases:["evidence","الأدلة","الأدلة الداعمة"] },
    { key:"whatWorked", fkey:"f14_whatWorked", aliases:["whatWorked","ما الذي نجح","ما نجح"] },
    { key:"whatDidntWork", fkey:"f15_whatDidntWork", aliases:["whatDidntWork","ما الذي لم ينجح","ما لم ينجح"] },
    { key:"challenges", fkey:"f16_challenges", aliases:["challenges","obstacles","التحديات"] },
    { key:"lessons", fkey:"f17_lessons", aliases:["lessons","lessonsLearned","الدروس المستفادة","الدروس"] },
    { key:"adaptationNotes", fkey:"f18_adaptationNotes", aliases:["adaptationNotes","adaptation","اعتبارات التكييف"] },
    { key:"guide", fkey:"f19_guide", aliases:["guide","implementationGuide","دليل التطبيق"] },
    { key:"domain", fkey:null, aliases:["domain","المجال"] },
    { key:"challengeType", fkey:null, aliases:["challengeType","نوع التحدي"] },
  ];

  const IMPORT_SAMPLE = {
    title: "مبادرة تحسين تجربة التسجيل الإلكتروني (مثال تجريبي)",
    innovator: "موظف تجريبي",
    entity: "وحدة حكومية (د)",
    approvalDate: "١ مارس ٢٠٢٦",
    problem: "تعدد خطوات التسجيل وتكرار إدخال البيانات يرفعان نسبة الطلبات غير المكتملة.",
    goal: "تحسين كفاءة تقديم الخدمات",
    kpis: "نسبة الطلبات المكتملة من أول محاولة",
    solution: "دمج خطوات التسجيل في نموذج واحد مع تعبئة تلقائية للبيانات المتاحة.",
    whyChosen: "حل منخفض التكلفة لا يتطلب نظامًا جديدًا.",
    steps: ["حصر خطوات التسجيل الحالية", "دمج الخطوات المتشابهة", "تجربة النموذج الجديد", "تعميم الحل بعد التقييم"],
    resources: "فريق من موظفين وأداة نماذج داخلية متاحة.",
    results: "ارتفاع نسبة الطلبات المكتملة من أول محاولة (بيانات تجريبية).",
    evidence: "تقرير مقارنة قبل وبعد التطبيق (بيانات تجريبية).",
    whatWorked: "تقليل عدد الحقول المطلوبة.",
    whatDidntWork: "التعبئة التلقائية الكاملة سببت أخطاء في بعض الحالات.",
    challenges: "مقاومة أولية للتغيير.",
    lessons: "تقليل الحقول أكثر أثرًا من تحسين تصميمها.",
    adaptationNotes: "يلزم تعديل الحقول حسب نوع الخدمة.",
    guide: "حصر ← دمج ← تجربة ← تقييم وتعميم.",
    domain: "تجربة المستفيد",
    challengeType: "ضعف وضوح الإجراءات",
  };

  function importNorm(s){ return String(s).toLowerCase().replace(/[\s_\-:]/g,""); }
  const IMPORT_LOOKUP = {};
  IMPORT_FIELDS.forEach(def=>def.aliases.forEach(a=>{ IMPORT_LOOKUP[importNorm(a)] = def.key; }));

  function parseCSV(text){
    const rows = []; let row = [], cur = "", q = false;
    for(let i=0;i<text.length;i++){
      const c = text[i];
      if(q){
        if(c === '"'){ if(text[i+1] === '"'){ cur += '"'; i++; } else q = false; }
        else cur += c;
      } else if(c === '"'){ q = true; }
      else if(c === ","){ row.push(cur); cur = ""; }
      else if(c === "\n" || c === "\r"){
        if(c === "\r" && text[i+1] === "\n") i++;
        row.push(cur); cur = ""; rows.push(row); row = [];
      } else cur += c;
    }
    if(cur !== "" || row.length){ row.push(cur); rows.push(row); }
    return rows.filter(r=>r.some(x=>x.trim() !== ""));
  }

  function parseImportText(text){
    text = text.replace(/^﻿/, "").trim();
    if(!text) throw new Error("empty");
    if(text[0] === "{" || text[0] === "["){
      const data = JSON.parse(text);
      return Array.isArray(data) ? data : [data];
    }
    const rows = parseCSV(text);
    if(rows.length < 2) throw new Error("csv");
    const header = rows[0].map(h=>h.trim());
    return rows.slice(1).map(r=>{
      const o = {}; header.forEach((h,i)=>{ o[h] = (r[i] || "").trim(); }); return o;
    });
  }

  function mapImportRecord(raw){
    const mapped = {}, unknown = [];
    Object.keys(raw).forEach(k=>{
      const key = IMPORT_LOOKUP[importNorm(k)];
      let v = raw[k];
      if(key){
        if(key === "steps"){
          if(!Array.isArray(v)) v = String(v || "").split(/\r?\n|;|؛/).map(s=>s.trim()).filter(Boolean);
          else v = v.map(s=>String(s).trim()).filter(Boolean);
        } else if(v !== null && typeof v === "object"){ v = JSON.stringify(v); }
        else v = String(v === null || v === undefined ? "" : v).trim();
        mapped[key] = v;
      } else unknown.push(k);
    });
    return { mapped, unknown };
  }

  function buildImportedCard(m){
    const bi = v => ({ ar:v, en:v });
    const yr = new Date().getFullYear();
    return {
      id: uid("imp"), imported: true, linkToMain: false,
      importedFields: m,
      title: bi(m.title),
      entity: m.entity ? bi(m.entity) : { ar:"وحدة حكومية (مستوردة)", en:"Imported government unit" },
      problem: bi(m.problem || "—"),
      result: bi(m.results || "—"),
      kpi: bi(m.kpis || "—"),
      domain: m.domain ? bi(m.domain) : { ar:"غير مصنّف", en:"Unclassified" },
      challengeType: m.challengeType ? bi(m.challengeType) : { ar:"غير مصنّف", en:"Unclassified" },
      adaptations: 0, sharingLevel: 1,
      adaptability: { ar:"قيد التقييم", en:"Under assessment" },
      status: { ar:"مستوردة (بانتظار المراجعة)", en:"Imported (pending review)" },
      relatedness: 50, reuse: 0, recency: yr, impact: 50,
    };
  }

  function synthesizeFields(card){
    const f = synthesizeBase(card);
    if(card.importedFields){
      IMPORT_FIELDS.forEach(def=>{
        const v = card.importedFields[def.key];
        if(!def.fkey || v === undefined || v === "" || (Array.isArray(v) && !v.length)) return;
        f[def.fkey] = { ar:v, en:v };
      });
    }
    return f;
  }

  function synthesizeBase(card){
    const genericSteps = {
      ar: ["تحديد المشكلة وحجمها الفعلي", "تصميم حل مبسّط بالموارد المتاحة", "تجربة الحل على نطاق محدود", "تقييم النتائج وتعميم الحل عند نجاحه"],
      en: ["Identify the problem and its real scale", "Design a simplified solution with available resources", "Pilot the solution on a limited scale", "Evaluate results and scale up if successful"],
    };
    return {
      f1_title: card.title,
      f2_owner: { ar: "موظف تجريبي", en: "Demo Employee" },
      f3_entity: card.entity,
      f4_date: { ar: `منتصف عام ${card.recency}`, en: `Mid-${card.recency}` },
      f5_problem: card.problem,
      f6_goal: { ar: `يرتبط بهدف تحسين ${card.domain.ar}`, en: `Linked to a goal of improving ${card.domain.en}` },
      f7_kpis: card.kpi,
      f8_solution: { ar: "حل عملي منخفض التكلفة عالج جوهر المشكلة ضمن الموارد المتاحة لدى الجهة دون الحاجة لنظام جديد.", en: "A low-cost, practical solution that addressed the core problem using the entity's existing resources without needing a new system." },
      f9_whyChosen: { ar: "تم اختياره لسهولة تطبيقه وسرعة ظهور نتائجه مقارنة ببدائل أكثر تعقيدًا.", en: "Chosen for its ease of implementation and faster results compared to more complex alternatives." },
      f10_steps: genericSteps,
      f11_resources: { ar: "فريق عمل صغير وأدوات متاحة داخليًا دون الحاجة لموازنة إضافية.", en: "A small team and internally available tools, with no need for additional budget." },
      f12_results: card.result,
      f13_evidence: { ar: "تقرير قياس داخلي قبل وبعد التطبيق (بيانات تجريبية).", en: "An internal before/after measurement report (demo data)." },
      f14_whatWorked: { ar: "التركيز على أبسط تغيير ممكن ذي الأثر الأكبر.", en: "Focusing on the simplest change with the largest impact." },
      f15_whatDidntWork: { ar: "محاولات التوسع السريع قبل استقرار الحل أدت لمشاكل بسيطة تم تداركها.", en: "Attempts to scale quickly before the solution stabilized caused minor issues that were corrected." },
      f16_challenges: { ar: "الحاجة لتنسيق مبدئي بين أكثر من قسم داخل الجهة.", en: "The need for initial coordination between more than one department within the entity." },
      f17_lessons: { ar: `في مجال ${card.domain.ar}، الحلول التدريجية البسيطة غالبًا أسرع أثرًا من المشاريع الكبيرة.`, en: `In ${card.domain.en}, small incremental fixes often show impact faster than large projects.` },
      f18_adaptationNotes: { ar: "يحتاج تعديل تفاصيل التنفيذ حسب حجم الجهة المستفيدة وطبيعة عملها.", en: "Implementation details should be adjusted to the beneficiary entity's size and nature of work." },
      f19_guide: { ar: "دليل مختصر: تحديد المشكلة ← تصميم حل مبسّط ← تجربة محدودة ← تقييم وتعميم.", en: "Short guide: Identify problem → Design simplified solution → Limited pilot → Evaluate & scale." },
    };
  }

  /* ---------------- Router ---------------- */
  function parseRoute(){
    let hash = location.hash || "#/";
    hash = hash.replace(/^#\/?/, "");
    const [path, queryStr] = hash.split("?");
    const parts = path.split("/").filter(Boolean);
    const query = {};
    if(queryStr){
      queryStr.split("&").forEach(pair=>{
        const [k,v] = pair.split("=");
        if(k) query[decodeURIComponent(k)] = decodeURIComponent(v||"");
      });
    }
    return { parts, query };
  }

  function navigate(hash){ location.hash = hash; }

  const ROUTES = {
    "": renderHome,
    "home": renderHome,
    "goal": renderGoal,
    "discover": renderDiscover,
    "initiatives": renderInitiativesList,
    "initiative": renderInitiativeDetail,
    "adopt": renderAdopt,
    "postimpl": renderPostImpl,
    "evolution": renderEvolution,
    "lessons": renderLessons,
    "governance": renderGovernance,
    "dashboard": renderDashboard,
    "about": renderAbout,
    "import": renderImport,
  };

  function router(){
    const { parts, query } = parseRoute();
    const key = parts[0] || "";
    const fn = ROUTES[key] || renderHome;
    document.getElementById("app").innerHTML = "";
    fn(parts, query);
    highlightNav(key);
    window.scrollTo({top:0, behavior:"instant"});
  }

  /* ---------------- Chrome: header / footer / nav ---------------- */
  function renderChrome(){
    document.documentElement.lang = lang;
    document.documentElement.dir = STR[lang].dir;
    document.getElementById("topDisclaimer").textContent = "⚠ " + t("disclaimer");
    document.getElementById("brandTitle").textContent = t("projectNameShort");
    document.getElementById("brandSub").textContent = t("tagline");
    document.getElementById("langToggle").textContent = "🌐 " + t("langSwitch");

    const navItems = [
      ["", "nav.home"], ["goal","nav.goal"], ["discover","nav.discover"],
      ["initiatives","nav.initiatives"], ["adopt","nav.adopt"], ["lessons","nav.lessons"],
      ["dashboard","nav.dashboard"], ["governance","nav.governance"], ["about","nav.about"],
    ];
    document.getElementById("mainNav").innerHTML = navItems.map(([r,k])=>
      `<a href="#/${r}" data-route="${r}">${t(k)}</a>`).join("");

    document.getElementById("footerBrand").textContent = t("projectName");
    document.getElementById("footerDisclaimer").textContent = t("disclaimer");
    document.getElementById("footerNavTitle").textContent = lang==="ar" ? "روابط" : "Links";
    document.getElementById("footerNavList").innerHTML = navItems.slice(0,6).map(([r,k])=>
      `<li><a href="#/${r}">${t(k)}</a></li>`).join("");
    document.getElementById("footerMoreTitle").textContent = lang==="ar" ? "المزيد" : "More";
    document.getElementById("footerMoreList").innerHTML = navItems.slice(6).map(([r,k])=>
      `<li><a href="#/${r}">${t(k)}</a></li>`).join("");
    const authorLine = lang==="ar" ? "إعداد: عتاب بنت سعيد الحبسية" : "Prepared by: Atab bint Saeed Al-Habsiyah";
    document.getElementById("footerBottom").textContent = "© " + new Date().getFullYear() + " " + authorLine + " — " + t("footerRights");
  }

  function highlightNav(key){
    document.querySelectorAll("#mainNav a").forEach(a=>{
      a.classList.toggle("active", a.dataset.route === (key === "import" ? "initiatives" : key));
    });
  }

  /* ---------------- Modal ---------------- */
  function openModal(html){
    document.getElementById("modalBox").innerHTML = html;
    document.getElementById("modalOverlay").classList.add("open");
  }
  function closeModal(){ document.getElementById("modalOverlay").classList.remove("open"); }

  /* ============================================================
     PAGE: HOME
     ============================================================ */
  function renderHome(){
    const app = document.getElementById("app");
    app.innerHTML = `
    <div class="container page">
      <section class="hero">
        <div class="hero-eyebrow">${esc(t("projectName"))}</div>
        <h1 class="hero-title">${esc(t("projectName"))}</h1>
        <p class="hero-tagline">${esc(t("tagline"))}</p>
        <p class="hero-statement">${esc(t("conceptStatement"))}</p>
        <div class="hero-actions">
          <a href="#/goal" class="btn btn-accent">${esc(t("cta_explore"))}</a>
          <a href="#/about" class="btn btn-outline" style="background:transparent;border-color:#fff;color:#fff;">${esc(t("nav.about"))}</a>
        </div>
      </section>

      <section class="section" style="margin-block-start:36px;">
        <div class="concept-grid">
          ${t("conceptCards").map((c,i)=>`
            <div class="concept-card">
              <div class="num">${i+1}</div>
              <h3>${esc(c.title)}</h3>
              <p>${esc(c.desc)}</p>
            </div>`).join("")}
        </div>
      </section>

      <section class="section">
        <h2 class="section-title">${esc(t("journeyTitle"))}</h2>
        <div class="card">
          ${cycleDiagramHTML()}
        </div>
      </section>

      <section class="section">
        <div class="closing-panel">
          <p>${esc(t("homeClosing1"))}</p>
          <p>${esc(t("homeClosing2"))}</p>
        </div>
      </section>
    </div>`;
  }

  function cycleDiagramHTML(){
    return `<div class="cycle-wrap"><div class="cycle">
      ${KNOWLEDGE_CYCLE.map((step,i)=>`
        <div class="cycle-step"><div class="dot">${i+1}</div><span>${esc(L(step))}</span></div>
        ${i < KNOWLEDGE_CYCLE.length-1 ? `<div class="cycle-arrow">${lang==="ar" ? "←" : "→"}</div>` : ""}
      `).join("")}
    </div></div>`;
  }

  /* ============================================================
     PAGE: GOAL (Ejada-style)
     ============================================================ */
  function renderGoal(){
    const app = document.getElementById("app");
    app.innerHTML = `
    <div class="container page">
      <div class="page-header">
        <div class="eyebrow">${esc(exampleBadge())}</div>
        <h1 class="page-title">${esc(t("goalScreenTitle"))}</h1>
        <p class="page-subtitle">${esc(t("goalScreenSubtitle"))}</p>
      </div>

      <div class="goal-layout">
        <div class="card goal-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
            <div class="eyebrow">${esc(L(GOAL.domain))}</div>
            ${exampleBadge()}
          </div>
          <div class="goal-field mt-16">
            <div class="label">${esc(t("theGoal"))}</div>
            <div class="value">${esc(L(GOAL.title))}</div>
          </div>
          <div class="goal-field">
            <div class="label">${esc(t("keyResult"))}</div>
            <div class="value">${esc(L(GOAL.keyResult))}</div>
          </div>
          <div class="goal-field">
            <div class="label">${esc(t("kpiLabel"))}</div>
            <div class="value">${esc(L(GOAL.kpi))}</div>
          </div>
          <div class="goal-field">
            <div class="label">${esc(t("progressLabel"))}</div>
            <div class="value">${GOAL.progress}%</div>
            <div class="progress-bar"><div style="width:${GOAL.progress}%"></div></div>
          </div>
          <div class="small text-muted mt-16">${esc(L(GOAL.owner))} · ${esc(L(GOAL.period))}</div>
        </div>

        <div class="card knowledge-panel">
          <h3 class="section-title" style="margin-block-end:6px;">${esc(t("supportingKnowledge"))}</h3>
          <p class="small text-muted">${esc(t("matchingFound"))}</p>
          <div class="kp-stats">
            <div class="kp-stat"><div class="n">${GOAL.knowledgeSupport.approvedInitiatives}</div><div class="l">${esc(t("approvedInitiativesCount"))}</div></div>
            <div class="kp-stat"><div class="n">${GOAL.knowledgeSupport.adaptablePractices}</div><div class="l">${esc(t("adaptablePracticesCount"))}</div></div>
            <div class="kp-stat"><div class="n">${GOAL.knowledgeSupport.otherEntityExperiences}</div><div class="l">${esc(t("otherEntityExperiencesCount"))}</div></div>
          </div>
          <a href="#/discover?from=goal" class="btn btn-primary btn-block">${esc(t("exploreGoalKnowledge"))}</a>

          <div class="matching-note">
            <span>🔎</span>
            <div>
              <b>${esc(t("smartMatchingTitle"))}:</b> ${esc(t("smartMatchingNote"))}
            </div>
          </div>
        </div>
      </div>

      <div class="why-box mt-24">
        <h3 class="section-title" style="margin-block-end:8px;">${esc(t("whyBelongs"))}</h3>
        <p class="text-muted">${esc(t("whyBelongsText"))}</p>
      </div>
    </div>`;
  }

  /* ============================================================
     PAGE: DISCOVER
     ============================================================ */
  function uniqueOptions(field){
    const seen = new Map();
    allCards().forEach(c=>{
      const key = c[field].ar;
      if(!seen.has(key)) seen.set(key, c[field]);
    });
    return Array.from(seen.values());
  }

  function matchesDiscoverFilters(c){
    if(discoverState.q){
      const q = discoverState.q.toLowerCase();
      const hay = [c.title.ar, c.title.en, c.problem.ar, c.problem.en, c.entity.ar, c.entity.en].join(" ").toLowerCase();
      if(!hay.includes(q)) return false;
    }
    if(discoverState.domain !== "all" && c.domain.ar !== discoverState.domain) return false;
    if(discoverState.entity !== "all" && c.entity.ar !== discoverState.entity) return false;
    if(discoverState.challengeType !== "all" && c.challengeType.ar !== discoverState.challengeType) return false;
    if(discoverState.kpi !== "all" && c.kpi.ar !== discoverState.kpi) return false;
    if(discoverState.sharingLevel !== "all" && String(c.sharingLevel) !== discoverState.sharingLevel) return false;
    if(discoverState.adaptability !== "all" && c.adaptability.ar !== discoverState.adaptability) return false;
    if(discoverState.status !== "all" && c.status.ar !== discoverState.status) return false;
    return true;
  }

  function sortCards(list){
    const key = { relatedness:"relatedness", reuse:"reuse", recent:"recency", impact:"impact" }[discoverState.sort];
    return [...list].sort((a,b)=> b[key]-a[key]);
  }

  function renderDiscover(parts, query){
    if(query && query.from === "goal"){ discoverState.fromGoal = true; discoverState.sort = "relatedness"; }
    const app = document.getElementById("app");
    app.innerHTML = `
    <div class="container page">
      <div class="breadcrumb"><a href="#/">${esc(t("breadcrumbHome"))}</a> / ${esc(t("nav.discover"))}</div>
      <div class="page-header">
        <h1 class="page-title">${esc(t("discoverTitle"))}</h1>
        ${discoverState.fromGoal ? `<p class="page-subtitle">✅ ${esc(t("matchingFound"))} — «${esc(L(GOAL.title))}»</p>` : `<p class="page-subtitle">${esc(t("initiativesSubtitle"))}</p>`}
      </div>

      <div class="search-row">
        <input type="text" class="search-input" id="searchInput" placeholder="${esc(t("searchPlaceholder"))}" value="${esc(discoverState.q)}">
      </div>

      <div class="discover-layout">
        <aside class="card filters-panel">
          <h3 class="section-title" style="font-size:1rem;">${esc(t("filters"))}</h3>
          ${filterSelectHTML("domain", t("f_domain"), uniqueOptions("domain"))}
          ${filterSelectHTML("entity", t("f_entity"), uniqueOptions("entity"))}
          ${filterSelectHTML("challengeType", t("f_challengeType"), uniqueOptions("challengeType"))}
          ${filterSelectHTML("kpi", t("f_kpi"), uniqueOptions("kpi"))}
          <div class="filter-group">
            <label>${esc(t("f_sharingLevel"))}</label>
            <select data-filter="sharingLevel">
              <option value="all">${esc(t("all"))}</option>
              ${KNOWLEDGE_LEVELS.map(l=>`<option value="${l.id}" ${discoverState.sharingLevel===String(l.id)?"selected":""}>${esc(L(l).name)}</option>`).join("")}
            </select>
          </div>
          ${filterSelectHTML("adaptability", t("f_adaptability"), uniqueOptions("adaptability"))}
          ${filterSelectHTML("status", t("f_status"), uniqueOptions("status"))}
        </aside>

        <div>
          <div class="results-toolbar">
            <div class="small text-muted" id="resultsCount"></div>
            <div class="filter-group" style="margin:0;min-inline-size:220px;">
              <select id="sortSelect">
                <option value="relatedness" ${discoverState.sort==="relatedness"?"selected":""}>${esc(t("sort_relatedness"))}</option>
                <option value="reuse" ${discoverState.sort==="reuse"?"selected":""}>${esc(t("sort_reuse"))}</option>
                <option value="recent" ${discoverState.sort==="recent"?"selected":""}>${esc(t("sort_recent"))}</option>
                <option value="impact" ${discoverState.sort==="impact"?"selected":""}>${esc(t("sort_impact"))}</option>
              </select>
            </div>
          </div>
          <div class="result-grid" id="resultsGrid"></div>
        </div>
      </div>
    </div>`;

    document.getElementById("searchInput").addEventListener("input", e=>{
      discoverState.q = e.target.value; updateResults();
    });
    document.getElementById("sortSelect").addEventListener("change", e=>{
      discoverState.sort = e.target.value; updateResults();
    });
    document.querySelectorAll("[data-filter]").forEach(sel=>{
      sel.addEventListener("change", e=>{
        discoverState[e.target.dataset.filter] = e.target.value; updateResults();
      });
    });
    updateResults();
  }

  function filterSelectHTML(field, label, options){
    return `<div class="filter-group">
      <label>${esc(label)}</label>
      <select data-filter="${field}">
        <option value="all">${esc(t("all"))}</option>
        ${options.map(o=>`<option value="${esc(o.ar)}" ${discoverState[field]===o.ar?"selected":""}>${esc(L(o))}</option>`).join("")}
      </select>
    </div>`;
  }

  function updateResults(){
    const filtered = sortCards(allCards().filter(matchesDiscoverFilters));
    document.getElementById("resultsCount").textContent = filtered.length + " " + t("resultsCount");
    document.getElementById("resultsGrid").innerHTML = filtered.length
      ? filtered.map(resultCardHTML).join("")
      : `<div class="empty-state" style="grid-column:1/-1;">${esc(t("noResults"))}</div>`;
  }

  function resultCardHTML(c){
    return `<div class="card result-card">
      <div class="rc-top">
        <div>
          <h3>${esc(L(c.title))}</h3>
          <div class="entity">${esc(L(c.entity))}</div>
        </div>
        ${levelBadge(c.sharingLevel)}
      </div>
      <div class="result-kv">${esc(t("fieldLabels.f5_problem") || "")}: ${esc(L(c.problem))}</div>
      <div class="result-kv">${esc(t("fieldLabels.f12_results") || "")}: <b>${esc(L(c.result))}</b></div>
      <div class="result-kv">${esc(t("f_kpi"))}: ${esc(L(c.kpi))}</div>
      <div class="result-meta">
        <span class="badge badge-neutral">${esc(t("adaptationsLabel"))}: ${c.adaptations}</span>
        <span class="badge badge-accent">${esc(L(c.adaptability))}</span>
        <span class="badge badge-success">${esc(L(c.status))}</span>
        ${c.imported ? `<span class="badge badge-demo">⬆ ${esc(t("importedBadge"))}</span>` : ""}
      </div>
      <a href="#/initiative/${c.id}" class="btn btn-outline btn-sm mt-8">${esc(t("viewCard"))}</a>
    </div>`;
  }

  /* ============================================================
     PAGE: INITIATIVES LIST
     ============================================================ */
  function renderInitiativesList(){
    const app = document.getElementById("app");
    app.innerHTML = `
    <div class="container page">
      <div class="breadcrumb"><a href="#/">${esc(t("breadcrumbHome"))}</a> / ${esc(t("nav.initiatives"))}</div>
      <div class="page-header">
        <h1 class="page-title">${esc(t("initiativesTitle"))}</h1>
        <p class="page-subtitle">${esc(t("initiativesSubtitle"))}</p>
        <a href="#/import" class="btn btn-accent mt-16">⬆ ${esc(t("importBtn"))}</a>
      </div>
      <div class="result-grid">
        ${allCards().map(resultCardHTML).join("")}
      </div>
    </div>`;
  }

  /* ============================================================
     PAGE: INITIATIVE DETAIL (rich knowledge asset)
     ============================================================ */
  function renderInitiativeDetail(parts){
    const id = parts[1];
    const found = getInitiativeById(id);
    const app = document.getElementById("app");
    if(!found){
      app.innerHTML = `<div class="container page"><div class="empty-state">${esc(t("noResults"))} <br><a href="#/initiatives" class="btn btn-outline btn-sm mt-16">${esc(t("backToList"))}</a></div></div>`;
      return;
    }
    const isMain = found.kind === "main";
    const data = found.data;
    const fields = isMain ? data.fields : synthesizeFields(data);
    const title = isMain ? data.title : data.title;
    const entity = isMain ? data.originalEntity : data.entity;
    const owner = isMain ? data.originalInnovator : fields.f2_owner;
    const approvalDate = isMain ? data.approvalDate : fields.f4_date;
    const sharingLevel = isMain ? data.sharingLevel : data.sharingLevel;
    const accessLevel = isMain ? data.accessLevel : (data.imported ? "internal" : "shareable");
    const status = isMain ? data.status : data.status;
    const beneficiaries = isMain ? (data.beneficiaryEntities + appState.evolutionExtra.length) : Math.max(1, data.adaptations);
    const adaptations = isMain ? (data.adaptationsCount + appState.evolutionExtra.length) : data.adaptations;

    const fieldOrder = ["f1_title","f2_owner","f3_entity","f4_date","f5_problem","f6_goal","f7_kpis","f8_solution","f9_whyChosen","f10_steps","f11_resources","f12_results","f13_evidence","f14_whatWorked","f15_whatDidntWork","f16_challenges","f17_lessons","f18_adaptationNotes","f19_guide"];

    app.innerHTML = `
    <div class="container page">
      <div class="breadcrumb"><a href="#/">${esc(t("breadcrumbHome"))}</a> / <a href="#/initiatives">${esc(t("nav.initiatives"))}</a> / ${esc(L(title))}</div>

      <div class="detail-header page-header">
        <div>
          <div class="eyebrow">${exampleBadge()} ${demoBadge()}</div>
          <h1 class="page-title mt-8">${esc(L(title))}</h1>
          <p class="page-subtitle">${esc(t("knowledgeAssetNote"))}</p>
          <div class="result-meta mt-8">
            ${levelBadge(sharingLevel)}
            ${accessBadge(accessLevel)}
            ${data.imported ? `<span class="badge badge-demo">⬆ ${esc(t("importedBadge"))}</span>` : ""}
            <span class="badge badge-success">${esc(L(status))}</span>
          </div>
        </div>
      </div>

      <div class="two-col">
        <div>
          ${fieldOrder.map(fk=>{
            const label = t("fieldLabels." + fk);
            const val = fields[fk];
            let inner;
            if(Array.isArray(val ? val.ar : null) || Array.isArray(val && val[lang])){
              inner = `<ol>${val[lang].map(s=>`<li>${esc(s)}</li>`).join("")}</ol>`;
            } else {
              inner = `<p>${esc(L(val))}</p>`;
            }
            return `<div class="field-block"><div class="flabel">${esc(label)}</div><div class="fvalue">${inner}</div></div>`;
          }).join("")}

          ${isMain ? `
          <div class="section">
            <h3 class="section-title">${esc(t("reuseLogTitle"))}</h3>
            <div class="card">
              ${EVOLUTION_SEED.concat(appState.evolutionExtra).map(ev=>`
                <div class="reuse-log-item">
                  <div class="dot"></div>
                  <div>
                    <b>${esc(L(ev.entity))}</b> — ${esc(L(ev.stageLabel))} (${esc(ev.year)})<br>
                    <span class="text-muted small">${esc(L(ev.changes))}</span>
                  </div>
                </div>`).join("")}
              <a href="#/evolution" class="btn btn-ghost btn-sm mt-16">${esc(t("viewEvolution"))} ←</a>
            </div>
          </div>` : ""}
        </div>

        <div class="sticky-actions">
          <div class="card credit-box">
            <h3 class="section-title" style="font-size:1rem;">${esc(t("creditTitle"))}</h3>
            <div class="credit-row"><span>${esc(t("fieldLabels.f2_owner"))}</span><b>${esc(L(owner))}</b></div>
            <div class="credit-row"><span>${esc(t("fieldLabels.f3_entity"))}</span><b>${esc(L(entity))}</b></div>
            <div class="credit-row"><span>${esc(t("fieldLabels.f4_date"))}</span><b>${esc(L(approvalDate))}</b></div>
            <div class="credit-row"><span>${esc(t("beneficiaryEntitiesLabel"))}</span><b>${beneficiaries}</b></div>
            <div class="credit-row"><span>${esc(t("extendedImpactLabel"))}</span><b>${adaptations} ${lang==="ar"?"تكييفات":"adaptations"}</b></div>
          </div>

          <div class="card">
            <h3 class="section-title" style="font-size:1rem;">${esc(t("sharingLevelsTitle"))}</h3>
            ${KNOWLEDGE_LEVELS.map(l=>`
              <div class="info-tip mt-8" style="display:block;">
                <span class="badge ${l.id===sharingLevel?"badge-accent":"badge-neutral"}">${esc(L(l).name)}</span>
                <div class="tip-bubble">${esc(L(l).desc)}</div>
              </div>`).join("")}
          </div>

          <a href="#/adopt?initiative=${data.id}" class="btn btn-primary btn-block">${esc(t("requestAdoption"))}</a>
          <a href="#/initiatives" class="btn btn-ghost btn-block">${esc(t("backToList"))}</a>
        </div>
      </div>
    </div>`;
  }

  /* ============================================================
     PAGE: ADOPT / ADAPT
     ============================================================ */
  function renderAdopt(parts, query){
    const app = document.getElementById("app");
    const preselect = query && query.initiative ? query.initiative : "";
    const options = [MAIN_INITIATIVE].concat(allCards().filter(c=>!c.linkToMain)).map(x=>{
      const id = x.id === MAIN_INITIATIVE.id ? MAIN_INITIATIVE.id : x.id;
      const title = x.id === MAIN_INITIATIVE.id ? MAIN_INITIATIVE.title : x.title;
      return {id, title};
    });
    // ensure preselect from a card that links to main resolves correctly
    const initiativeIdOptions = [MAIN_INITIATIVE.id, ...INITIATIVE_CARDS.filter(c=>!c.linkToMain).map(c=>c.id)];

    app.innerHTML = `
    <div class="container page">
      <div class="breadcrumb"><a href="#/">${esc(t("breadcrumbHome"))}</a> / ${esc(t("nav.adopt"))}</div>
      <div class="page-header">
        <h1 class="page-title">${esc(t("adoptTitle"))}</h1>
        <p class="page-subtitle">${esc(t("adoptSubtitle"))}</p>
      </div>

      <div class="card">
        <form id="adoptForm">
          <div class="form-grid">
            <div class="form-field full">
              <label>${esc(t("fieldLabels.f1_title"))} *</label>
              <select id="f_initiative" required>
                ${options.map(o=>`<option value="${o.id}" ${o.id===preselect?"selected":""}>${esc(L(o.title))}</option>`).join("")}
              </select>
            </div>
            ${formFieldHTML("requestingEntity","text",true)}
            ${formFieldHTML("relatedGoal","text",true, L(GOAL.title))}
            ${formFieldHTML("benefitReason","textarea",true, "", true)}
            ${formFieldHTML("localChallenge","textarea",true, "", true)}
            ${formFieldHTML("contextDiff","textarea",false, "", true)}
            ${formFieldHTML("proposedMods","textarea",false, "", true)}
            ${formFieldHTML("implementationOwner","text",true)}
            ${formFieldHTML("expectedPeriod","text",true, lang==="ar" ? "٦ أسابيع" : "6 weeks")}
            ${formFieldHTML("kpisToMeasure","text",true, L(MAIN_INITIATIVE.kpi))}
          </div>
          <button type="submit" class="btn btn-primary mt-16">${esc(t("submitRequest"))}</button>
        </form>
      </div>

      <div id="submitBanner"></div>

      <div class="section mt-24">
        <h2 class="section-title">${esc(t("myRequests"))}</h2>
        <div id="requestsList"></div>
      </div>
    </div>`;

    document.getElementById("adoptForm").addEventListener("submit", function(e){
      e.preventDefault();
      const form = e.target;
      let valid = true;
      form.querySelectorAll("[data-required]").forEach(f=>{
        const wrap = f.closest(".form-field");
        if(!f.value.trim()){ wrap.classList.add("invalid"); valid = false; }
        else wrap.classList.remove("invalid");
      });
      if(!valid) return;

      const initId = document.getElementById("f_initiative").value;
      const req = {
        id: uid("req"),
        initiativeId: initId,
        requestingEntity: form.requestingEntity.value.trim(),
        relatedGoal: form.relatedGoal.value.trim(),
        benefitReason: form.benefitReason.value.trim(),
        localChallenge: form.localChallenge.value.trim(),
        contextDiff: form.contextDiff.value.trim(),
        proposedMods: form.proposedMods.value.trim(),
        implementationOwner: form.implementationOwner.value.trim(),
        expectedPeriod: form.expectedPeriod.value.trim(),
        kpisToMeasure: form.kpisToMeasure.value.trim(),
        stageIndex: 0,
        postImplRecorded: false,
        createdAt: new Date().toISOString(),
      };
      appState.adoptionRequests.unshift(req);
      saveState();
      document.getElementById("submitBanner").innerHTML = `<div class="banner-success">✅ ${esc(t("requestSubmitted"))}</div>`;
      form.reset();
      renderRequestsList();
      window.scrollTo({top:0, behavior:"smooth"});
    });

    renderRequestsList();
  }

  function formFieldHTML(key, type, required, placeholder, full){
    const label = t("f_" + key);
    return `<div class="form-field ${full?"full":""}">
      <label>${esc(label)} ${required?'<span class="req">*</span>':""}</label>
      ${type==="textarea"
        ? `<textarea name="${key}" ${required?'data-required="1"':""} placeholder="${esc(placeholder||"")}"></textarea>`
        : `<input type="text" name="${key}" ${required?'data-required="1"':""} placeholder="${esc(placeholder||"")}">`}
      <span class="field-error">${esc(t("requiredField"))}</span>
    </div>`;
  }

  function renderRequestsList(){
    const wrap = document.getElementById("requestsList");
    if(!wrap) return;
    if(!appState.adoptionRequests.length){
      wrap.innerHTML = `<div class="empty-state">${esc(t("noRequestsYet"))}</div>`;
      return;
    }
    wrap.innerHTML = appState.adoptionRequests.map(reqCardHTML).join("");
    wrap.querySelectorAll("[data-advance]").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const req = appState.adoptionRequests.find(r=>r.id===btn.dataset.advance);
        if(req && req.stageIndex < WORKFLOW_STAGES.length-1){
          req.stageIndex++;
          saveState();
          renderRequestsList();
        }
      });
    });
  }

  function reqCardHTML(req){
    const found = getInitiativeById(req.initiativeId);
    const title = found ? (found.kind==="main" ? found.data.title : found.data.title) : {ar:req.initiativeId,en:req.initiativeId};
    const atImplementation = req.stageIndex >= 4;
    const done = req.stageIndex >= WORKFLOW_STAGES.length - 1;
    return `<div class="request-item">
      <div class="request-item-top">
        <div>
          <b>${esc(L(title))}</b>
          <div class="small text-muted">${esc(req.requestingEntity)} · ${esc(req.expectedPeriod)}</div>
        </div>
        ${req.postImplRecorded ? `<span class="badge badge-success">${lang==="ar"?"مكتمل":"Complete"}</span>` : ""}
      </div>
      <div class="workflow-track mt-8">
        ${WORKFLOW_STAGES.map((s,i)=>`
          <div class="wf-step ${i<req.stageIndex?"done":""} ${i===req.stageIndex?"current":""}">
            <span class="idx">${i+1}</span>${esc(L(s))}
          </div>`).join("")}
      </div>
      <div class="flex gap-8 mt-8" style="flex-wrap:wrap;">
        ${!done ? `<button class="btn btn-outline btn-sm" data-advance="${req.id}">${esc(t("advanceStage"))} ←</button>` : `<span class="small text-muted">${esc(t("stageComplete"))}</span>`}
        ${atImplementation && !req.postImplRecorded ? `<a href="#/postimpl?request=${req.id}" class="btn btn-accent btn-sm">${esc(t("goRecordResults"))}</a>` : ""}
        ${req.postImplRecorded ? `<a href="#/evolution" class="btn btn-ghost btn-sm">${esc(t("viewEvolution"))}</a>` : ""}
      </div>
    </div>`;
  }

  /* ============================================================
     PAGE: POST-IMPLEMENTATION LEARNING
     ============================================================ */
  function renderPostImpl(parts, query){
    const app = document.getElementById("app");
    const reqId = query && query.request;
    const req = reqId ? appState.adoptionRequests.find(r=>r.id===reqId) : null;
    const eligible = appState.adoptionRequests.filter(r=>r.stageIndex>=4 && !r.postImplRecorded);

    if(!req){
      app.innerHTML = `
      <div class="container page">
        <div class="page-header">
          <h1 class="page-title">${esc(t("postImplTitle"))}</h1>
          <p class="page-subtitle">${esc(t("postImplSubtitle"))}</p>
        </div>
        ${eligible.length ? `
          <div class="card">
            <h3 class="section-title" style="font-size:1rem;">${lang==="ar" ? "اختر طلبًا لتسجيل نتائجه" : "Choose a request to record its results"}</h3>
            ${eligible.map(r=>{
              const f = getInitiativeById(r.initiativeId);
              const title = f ? (f.kind==="main" ? f.data.title : f.data.title) : {ar:"",en:""};
              return `<div class="request-item"><div class="request-item-top"><b>${esc(L(title))} — ${esc(r.requestingEntity)}</b>
                <a href="#/postimpl?request=${r.id}" class="btn btn-primary btn-sm">${esc(t("goRecordResults"))}</a></div></div>`;
            }).join("")}
          </div>
        ` : `<div class="empty-state">${esc(t("selectRequestFirst"))} <br><a href="#/adopt" class="btn btn-outline btn-sm mt-16">${esc(t("nav.adopt"))}</a></div>`}
      </div>`;
      return;
    }

    const found = getInitiativeById(req.initiativeId);
    const initTitle = found ? found.data.title : {ar:"",en:""};

    app.innerHTML = `
    <div class="container page">
      <div class="breadcrumb"><a href="#/">${esc(t("breadcrumbHome"))}</a> / ${esc(t("nav.adopt"))} / ${esc(t("postImplTitle"))}</div>
      <div class="page-header">
        <h1 class="page-title">${esc(t("postImplTitle"))}</h1>
        <p class="page-subtitle">${esc(L(initTitle))} — ${esc(req.requestingEntity)}</p>
      </div>
      <div class="card">
        <form id="postImplForm">
          <div class="form-grid">
            ${formFieldHTML("resultsAchieved","textarea",true,"",true)}
            ${formFieldHTML("kpiBefore","text",true, lang==="ar"?"مثال: 5 أيام":"e.g. 5 days")}
            ${formFieldHTML("kpiAfter","text",true, lang==="ar"?"مثال: 4 أيام":"e.g. 4 days")}
            ${formFieldHTML("whatWorked","textarea",true,"",true)}
            ${formFieldHTML("whatDidntWork","textarea",false,"",true)}
            ${formFieldHTML("modsImplemented","textarea",false,"",true)}
            ${formFieldHTML("newChallenges","textarea",false,"",true)}
            ${formFieldHTML("lessonsLearned","textarea",true,"",true)}
            ${formFieldHTML("recommendations","textarea",false,"",true)}
          </div>
          <button type="submit" class="btn btn-primary mt-16">${esc(t("saveLearning"))}</button>
        </form>
      </div>
    </div>`;

    document.getElementById("postImplForm").addEventListener("submit", function(e){
      e.preventDefault();
      const form = e.target;
      let valid = true;
      form.querySelectorAll("[data-required]").forEach(f=>{
        const wrap = f.closest(".form-field");
        if(!f.value.trim()){ wrap.classList.add("invalid"); valid = false; }
        else wrap.classList.remove("invalid");
      });
      if(!valid) return;

      const entry = {
        id: uid("pi"),
        requestId: req.id,
        initiativeId: req.initiativeId,
        entity: req.requestingEntity,
        resultsAchieved: form.resultsAchieved.value.trim(),
        kpiBefore: form.kpiBefore.value.trim(),
        kpiAfter: form.kpiAfter.value.trim(),
        whatWorked: form.whatWorked.value.trim(),
        whatDidntWork: form.whatDidntWork.value.trim(),
        modsImplemented: form.modsImplemented.value.trim(),
        newChallenges: form.newChallenges.value.trim(),
        lessonsLearned: form.lessonsLearned.value.trim(),
        recommendations: form.recommendations.value.trim(),
        createdAt: new Date().toISOString(),
      };
      appState.postImplEntries.unshift(entry);
      req.postImplRecorded = true;
      req.stageIndex = WORKFLOW_STAGES.length - 1;

      if(req.initiativeId === MAIN_INITIATIVE.id){
        appState.evolutionExtra.push({
          id: uid("eh"),
          entity: { ar: entry.entity, en: entry.entity },
          stageLabel: { ar: "تطبيق جديد", en: "New Implementation" },
          year: String(new Date().getFullYear()),
          changes: { ar: entry.modsImplemented || (lang==="ar"?"تطبيق دون تعديلات جوهرية":"Implemented without major changes"), en: entry.modsImplemented || "Implemented without major changes" },
          kpiResult: { ar: `${entry.kpiBefore} ← ${entry.kpiAfter}`, en: `${entry.kpiBefore} → ${entry.kpiAfter}` },
          lesson: { ar: entry.lessonsLearned, en: entry.lessonsLearned },
          innovator: { ar: `${L(MAIN_INITIATIVE.originalInnovator)} (${lang==="ar"?"المبادرة الأصلية":"original initiative"})`, en: `${MAIN_INITIATIVE.originalInnovator.en} (original initiative)` },
        });
      }
      saveState();

      openModal(`
        <button class="modal-close" onclick="EjadaApp.closeModal()">✕</button>
        <div class="badge badge-success mt-8">✅</div>
        <h3 class="section-title mt-16">${esc(t("savedBanner"))}</h3>
        <p class="text-muted mt-8">${esc(L(initTitle))} — ${esc(req.requestingEntity)}</p>
        <div class="flex gap-8 mt-24" style="flex-wrap:wrap;">
          <a href="#/evolution" class="btn btn-primary btn-sm" onclick="EjadaApp.closeModal()">${esc(t("viewEvolution"))}</a>
          <a href="#/lessons" class="btn btn-outline btn-sm" onclick="EjadaApp.closeModal()">${esc(t("nav.lessons"))}</a>
          <a href="#/dashboard" class="btn btn-outline btn-sm" onclick="EjadaApp.closeModal()">${esc(t("nav.dashboard"))}</a>
        </div>
      `);
    });
  }

  /* ============================================================
     PAGE: EVOLUTION TIMELINE
     ============================================================ */
  function renderEvolution(){
    const app = document.getElementById("app");
    const items = EVOLUTION_SEED.concat(appState.evolutionExtra);
    app.innerHTML = `
    <div class="container page">
      <div class="breadcrumb"><a href="#/">${esc(t("breadcrumbHome"))}</a> / ${esc(t("evolutionTitle"))}</div>
      <div class="page-header">
        <div class="eyebrow">${demoBadge()}</div>
        <h1 class="page-title mt-8">${esc(t("evolutionTitle"))}</h1>
        <p class="page-subtitle">${esc(t("evolutionSubtitle"))} — «${esc(L(MAIN_INITIATIVE.title))}»</p>
      </div>
      <div class="card" style="margin-block-end:20px;">
        <span class="badge badge-accent">★ ${esc(L(MAIN_INITIATIVE.originalInnovator))} · ${esc(L(MAIN_INITIATIVE.originalEntity))}</span>
        <p class="small text-muted mt-8">${esc(t("innovatorAlwaysVisible"))}</p>
      </div>
      <div class="timeline">
        ${items.map(it=>`
          <div class="tl-item">
            <div class="card tl-card">
              <div class="tl-meta">
                <span class="tl-year">${esc(it.year)}</span>
                <b>${esc(L(it.entity))}</b>
                <span class="badge badge-neutral">${esc(L(it.stageLabel))}</span>
              </div>
              <div class="tl-grid">
                <div><b>${esc(t("changesLabel"))}</b>${esc(L(it.changes))}</div>
                <div><b>${esc(t("kpiResultLabel"))}</b>${esc(L(it.kpiResult))}</div>
                <div><b>${esc(t("lessonLabel"))}</b>${esc(L(it.lesson))}</div>
              </div>
              <div class="small text-muted mt-8">👤 ${esc(L(it.innovator))}</div>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
  }

  /* ============================================================
     PAGE: LESSONS LEARNED
     ============================================================ */
  function renderLessons(){
    const app = document.getElementById("app");
    const seedLesson = {
      lesson: MAIN_INITIATIVE.fields.f17_lessons,
      entity: MAIN_INITIATIVE.originalEntity,
      initiative: MAIN_INITIATIVE.title,
    };
    const evoLessons = EVOLUTION_SEED.concat(appState.evolutionExtra).map(ev=>({
      lesson: ev.lesson, entity: ev.entity, initiative: MAIN_INITIATIVE.title,
    }));
    const dynLessons = appState.postImplEntries.filter(e=>e.lessonsLearned).map(e=>{
      const f = getInitiativeById(e.initiativeId);
      return { lesson: {ar:e.lessonsLearned, en:e.lessonsLearned}, entity: {ar:e.entity, en:e.entity}, initiative: f ? f.data.title : {ar:"",en:""} };
    });
    const all = [seedLesson, ...evoLessons, ...dynLessons];

    app.innerHTML = `
    <div class="container page">
      <div class="breadcrumb"><a href="#/">${esc(t("breadcrumbHome"))}</a> / ${esc(t("nav.lessons"))}</div>
      <div class="page-header">
        <div class="eyebrow">${demoBadge()}</div>
        <h1 class="page-title mt-8">${esc(t("lessonsTitle"))}</h1>
        <p class="page-subtitle">${esc(t("lessonsSubtitle"))}</p>
      </div>
      <div class="result-grid">
        ${all.map(l=>`
          <div class="card lesson-card">
            <p>💡 ${esc(L(l.lesson))}</p>
            <div class="lesson-meta">
              <span>${esc(t("fromInitiative"))}: ${esc(L(l.initiative))}</span>
              <span>${esc(t("fromEntity"))}: ${esc(L(l.entity))}</span>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
  }

  /* ============================================================
     PAGE: GOVERNANCE
     ============================================================ */
  function renderGovernance(){
    const app = document.getElementById("app");
    app.innerHTML = `
    <div class="container page">
      <div class="breadcrumb"><a href="#/">${esc(t("breadcrumbHome"))}</a> / ${esc(t("nav.governance"))}</div>
      <div class="page-header">
        <h1 class="page-title">${esc(t("governanceTitle"))}</h1>
        <p class="page-subtitle">${esc(t("governanceSubtitle"))}</p>
      </div>

      <div class="gov-grid">
        <div class="card">
          <h3 class="section-title" style="font-size:1rem;">${esc(t("rolesTitle"))}</h3>
          <ul class="role-list">${GOVERNANCE.roles.map(r=>`<li>👤 ${esc(L(r))}</li>`).join("")}</ul>
        </div>
        <div class="card">
          <h3 class="section-title" style="font-size:1rem;">${esc(t("criteriaTitle"))}</h3>
          <ul class="criteria-list">${GOVERNANCE.criteria.map(c=>`<li>◆ ${esc(L(c))}</li>`).join("")}</ul>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">${esc(t("accessControlTitle"))}</h3>
        <div class="access-grid">
          ${ACCESS_LEVELS.map(a=>`<div class="access-chip ${a.id}">${esc(L(a))}</div>`).join("")}
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">${esc(t("sharingLevelsTitle"))}</h3>
        <div class="two-col">
          ${KNOWLEDGE_LEVELS.map(l=>`
            <div class="card level-card">
              <div class="lv-num">${l.id}</div>
              <h4 style="font-weight:800;margin-block-end:8px;">${esc(L(l).name)}</h4>
              <p class="text-muted small">${esc(L(l).desc)}</p>
            </div>`).join("")}
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">${esc(t("exampleClassification"))} — «${esc(L(MAIN_INITIATIVE.title))}»</h3>
        <div class="card flex gap-12" style="flex-wrap:wrap;">
          ${levelBadge(MAIN_INITIATIVE.sharingLevel)}
          ${accessBadge(MAIN_INITIATIVE.accessLevel)}
          <span class="badge badge-neutral">${esc(t("f_adaptability"))}: ${esc(L(MAIN_INITIATIVE.adaptability))}</span>
        </div>
      </div>
    </div>`;
  }

  /* ============================================================
     PAGE: DASHBOARD
     ============================================================ */
  function renderDashboard(){
    const app = document.getElementById("app");
    const reqCount = DASHBOARD_BASE.adoptionRequestsBase + appState.adoptionRequests.length;
    const reused = DASHBOARD_BASE.reusedInitiatives + appState.postImplEntries.length;
    const lessonsCount = DASHBOARD_BASE.newLessonsBase + appState.postImplEntries.length;
    const beneficiaries = DASHBOARD_BASE.beneficiaryEntitiesBase + new Set(appState.adoptionRequests.map(r=>r.requestingEntity)).size;

    const kpis = [
      ["kpi_approvedKnowledgeInitiatives", DASHBOARD_BASE.approvedKnowledgeInitiatives + appState.importedInitiatives.length],
      ["kpi_reusedInitiatives", reused],
      ["kpi_adoptionRequests", reqCount],
      ["kpi_beneficiaryEntities", beneficiaries],
      ["kpi_newLessons", lessonsCount],
      ["kpi_initiativesLinkedToGoals", DASHBOARD_BASE.initiativesLinkedToGoals],
      ["kpi_generalizablePractices", DASHBOARD_BASE.generalizablePractices],
      ["kpi_duplicationAvoided", DASHBOARD_BASE.duplicationAvoidedCases],
    ];

    const ei = [
      ["ei_beneficiaryEntities", DASHBOARD_BASE.extendedImpact.beneficiaryEntitiesBase + new Set(appState.adoptionRequests.map(r=>r.requestingEntity)).size],
      ["ei_reuseTimes", DASHBOARD_BASE.extendedImpact.reuseTimesBase + appState.postImplEntries.length],
      ["ei_goalsSupported", DASHBOARD_BASE.extendedImpact.goalsSupportedBase],
      ["ei_newLessons", DASHBOARD_BASE.extendedImpact.newLessonsBase + appState.postImplEntries.length],
    ];

    app.innerHTML = `
    <div class="container page">
      <div class="breadcrumb"><a href="#/">${esc(t("breadcrumbHome"))}</a> / ${esc(t("nav.dashboard"))}</div>
      <div class="page-header">
        <div class="eyebrow">${demoBadge()}</div>
        <h1 class="page-title mt-8">${esc(t("dashboardTitle"))}</h1>
        <p class="page-subtitle">${esc(t("dashboardSubtitle"))}</p>
      </div>

      <div class="kpi-grid">
        ${kpis.map(([k,v])=>`<div class="card kpi-card"><div class="n">${v}</div><div class="l">${esc(t(k))}</div></div>`).join("")}
      </div>

      <div class="section">
        <h3 class="section-title">${esc(t("extendedImpactTitle"))}</h3>
        <div class="ei-grid">
          ${ei.map(([k,v])=>`<div class="card kpi-card"><div class="n">${v}</div><div class="l">${esc(t(k))}</div></div>`).join("")}
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">${esc(t("resourceValueTitle"))}</h3>
        <div class="card">
          <div class="formula-box">${esc(t("resourceValueFormula"))}</div>
          <p class="small text-muted text-center">${esc(t("resourceValueNote"))}</p>
          <h4 class="mt-16" style="font-weight:800;">${esc(t("possibleResourcesTitle"))}</h4>
          <ul class="resource-list">
            ${RESOURCE_VALUE_ITEMS.map(r=>`<li>◆ ${esc(L(r))} <span class="badge badge-demo" style="margin-inline-start:auto;">${esc(t("demoDataLabel"))}</span></li>`).join("")}
          </ul>
        </div>
      </div>
    </div>`;
  }

  /* ============================================================
     PAGE: ABOUT
     ============================================================ */
  function renderAbout(){
    const app = document.getElementById("app");
    app.innerHTML = `
    <div class="container page">
      <div class="breadcrumb"><a href="#/">${esc(t("breadcrumbHome"))}</a> / ${esc(t("nav.about"))}</div>
      <div class="page-header">
        <h1 class="page-title">${esc(t("aboutTitle"))}</h1>
        <p class="page-subtitle">${esc(t("aboutIntro"))}</p>
      </div>

      <div class="about-grid">
        <div class="card">
          <h3 class="section-title" style="font-size:1rem;">${esc(t("aboutFocusTitle"))}</h3>
          <ul class="check-list yes">${t("aboutFocus").map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
        </div>
        <div class="card">
          <h3 class="section-title" style="font-size:1rem;">${esc(t("aboutNotTitle"))}</h3>
          <ul class="check-list no">${t("aboutNotList").map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
        </div>
      </div>

      <div class="why-box mt-24">
        <p>${esc(t("aboutNotReplace"))}</p>
      </div>

      <div class="card mt-24" style="border-inline-start:4px solid var(--color-gold);">
        <p class="small text-muted">⚠ ${esc(t("disclaimer"))}</p>
      </div>
    </div>`;
  }

  /* ============================================================
     PAGE: IMPORT INITIATIVE (from the unified form)
     ============================================================ */
  function renderImport(){
    const app = document.getElementById("app");
    let importRecords = [];
    const recent = appState.importedInitiatives;

    app.innerHTML = `
    <div class="container page">
      <div class="breadcrumb"><a href="#/">${esc(t("breadcrumbHome"))}</a> / <a href="#/initiatives">${esc(t("nav.initiatives"))}</a> / ${esc(t("importBtn"))}</div>
      <div class="page-header">
        <div class="eyebrow">${demoBadge()}</div>
        <h1 class="page-title mt-8">${esc(t("importTitle"))}</h1>
        <p class="page-subtitle">${esc(t("importSubtitle"))}</p>
      </div>

      <div class="card">
        <h3 class="section-title" style="font-size:1rem;">${esc(t("importStep1"))}</h3>
        <div class="flex gap-8" style="flex-wrap:wrap;">
          <button type="button" class="btn btn-outline btn-sm" id="importTemplateBtn">⬇ ${esc(t("importDownloadTemplate"))}</button>
          <button type="button" class="btn btn-outline btn-sm" id="importSampleBtn">${esc(t("importLoadSample"))}</button>
        </div>
        <div class="form-grid mt-16">
          <div class="form-field full">
            <label>${esc(t("importUploadLabel"))}</label>
            <input type="file" id="importFile" accept=".json,.csv,.txt">
          </div>
          <div class="form-field full">
            <label>${esc(t("importPasteLabel"))}</label>
            <textarea id="importText" rows="6" dir="ltr" style="font-family:monospace;text-align:left;"></textarea>
          </div>
        </div>
        <button type="button" class="btn btn-primary mt-16" id="importParseBtn">${esc(t("importParse"))}</button>
        <p class="small text-muted mt-8">${esc(t("importNoteDemo"))}</p>
      </div>

      <div id="importMsg" class="mt-16"></div>
      <div id="importPreview"></div>

      ${recent.length ? `
      <div class="section mt-24">
        <h3 class="section-title">${esc(t("importedListTitle"))}</h3>
        <div class="result-grid">${recent.map(resultCardHTML).join("")}</div>
      </div>` : ""}
    </div>`;

    const msg = document.getElementById("importMsg");
    const preview = document.getElementById("importPreview");
    const textArea = document.getElementById("importText");

    function showError(text){ msg.innerHTML = `<div class="banner-error">⚠ ${esc(text)}</div>`; preview.innerHTML = ""; }

    function renderPreview(){
      msg.innerHTML = "";
      const items = importRecords.map(mapImportRecord);
      const allHaveTitle = items.every(it=>it.mapped.title);
      preview.innerHTML = `
      <div class="section mt-24">
        <h3 class="section-title">${esc(t("importPreviewTitle"))} (${items.length})</h3>
        ${items.map(it=>{
          let count = 0;
          const rows = IMPORT_FIELDS.map(def=>{
            const v = it.mapped[def.key];
            const has = v !== undefined && v !== "" && !(Array.isArray(v) && !v.length);
            if(has) count++;
            const label = def.fkey ? t("fieldLabels." + def.fkey) : (def.key === "domain" ? t("f_domain") : t("f_challengeType"));
            const val = has ? esc((Array.isArray(v) ? v.join(" ‖ ") : String(v)).slice(0,160)) : `<span class="badge badge-neutral">—</span>`;
            return `<tr><td class="it-label">${esc(label)}${def.required ? " *" : ""}</td><td>${val}</td></tr>`;
          }).join("");
          return `<div class="card" style="margin-block-end:14px;">
            <div class="small text-muted" style="margin-block-end:8px;">✔ ${count}/${IMPORT_FIELDS.length} ${esc(t("importMapped"))}${it.unknown.length ? ` · ${esc(t("importUnknown"))}: ${esc(it.unknown.join("، "))}` : ""}</div>
            <div style="overflow-x:auto;"><table class="import-table"><tbody>${rows}</tbody></table></div>
          </div>`;
        }).join("")}
        <p class="small text-muted">${esc(t("importGovNote"))}</p>
        ${allHaveTitle ? "" : `<div class="banner-error">⚠ ${esc(t("importNeedTitle"))}</div>`}
        <button type="button" class="btn btn-accent mt-8" id="importConfirmBtn" ${allHaveTitle ? "" : "disabled"}>${esc(t("importConfirm"))}</button>
      </div>`;

      const confirmBtn = document.getElementById("importConfirmBtn");
      confirmBtn.addEventListener("click", ()=>{
        const cards = items.filter(it=>it.mapped.title).map(it=>buildImportedCard(it.mapped));
        appState.importedInitiatives.push(...cards);
        saveState();
        preview.innerHTML = "";
        msg.innerHTML = `<div class="banner-success">✅ ${esc(t("importSuccess"))} (${cards.length})</div>
          <div class="flex gap-8" style="flex-wrap:wrap;margin-block-end:16px;">
            ${cards.map(c=>`<a href="#/initiative/${c.id}" class="btn btn-primary btn-sm">${esc(t("viewCard"))} — ${esc(L(c.title))}</a>`).join("")}
            <button type="button" class="btn btn-outline btn-sm" id="importAnotherBtn">${esc(t("importAnother"))}</button>
          </div>`;
        document.getElementById("importAnotherBtn").addEventListener("click", renderImport);
      });
    }

    function doParse(text){
      try{
        importRecords = parseImportText(text);
        if(!importRecords.length || importRecords.some(r=>r === null || typeof r !== "object")) throw new Error("shape");
        renderPreview();
      }catch(e){ showError(t("importParseError")); }
    }

    document.getElementById("importParseBtn").addEventListener("click", ()=>doParse(textArea.value));
    document.getElementById("importSampleBtn").addEventListener("click", ()=>{
      textArea.value = JSON.stringify(IMPORT_SAMPLE, null, 2);
      doParse(textArea.value);
    });
    document.getElementById("importTemplateBtn").addEventListener("click", ()=>{
      const blob = new Blob([JSON.stringify(IMPORT_SAMPLE, null, 2)], { type:"application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "unified-initiative-form-sample.json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
    });
    document.getElementById("importFile").addEventListener("change", e=>{
      const file = e.target.files && e.target.files[0];
      if(!file) return;
      const reader = new FileReader();
      reader.onload = ()=>{ textArea.value = String(reader.result); doParse(textArea.value); };
      reader.onerror = ()=>showError(t("importParseError"));
      reader.readAsText(file, "UTF-8");
    });
  }

  /* ============================================================
     Global wiring
     ============================================================ */
  function setLang(newLang){
    lang = newLang;
    localStorage.setItem(LANG_KEY, lang);
    renderChrome();
    router();
  }

  document.getElementById("langToggle").addEventListener("click", ()=>{
    setLang(lang === "ar" ? "en" : "ar");
  });
  document.getElementById("navToggleBtn").addEventListener("click", ()=>{
    document.getElementById("mainNav").classList.toggle("open");
  });
  document.getElementById("modalOverlay").addEventListener("click", (e)=>{
    if(e.target.id === "modalOverlay") closeModal();
  });
  document.addEventListener("click", (e)=>{
    if(e.target.matches("#mainNav a")){
      document.getElementById("mainNav").classList.remove("open");
    }
  });

  window.addEventListener("hashchange", router);
  window.addEventListener("DOMContentLoaded", ()=>{
    renderChrome();
    router();
  });

  // expose minimal API for inline modal handlers
  window.EjadaApp = { closeModal, navigate };

  // in case DOMContentLoaded already fired
  if(document.readyState !== "loading"){
    renderChrome();
    router();
  }

})();
