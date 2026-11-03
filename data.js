/* ============================================================
   إجادة للابتكار والمعرفة المؤسسية — DEMO DATA (بيانات تجريبية)
   All figures, names, entities and results in this file are
   fictional demonstration data created only to illustrate the
   concept. Nothing here represents real government data.
   ============================================================ */

const DEMO_TAG = { ar: "بيانات تجريبية", en: "Demo Data" };

/* ---------------- Employee / Ejada-style Goal ---------------- */
const GOAL = {
  id: "goal-1",
  domain: { ar: "كفاءة تقديم الخدمات", en: "Service Delivery Efficiency" },
  title: { ar: "تحسين كفاءة تقديم الخدمات", en: "Improve Service Delivery Efficiency" },
  keyResult: {
    ar: "تقليل متوسط زمن إنجاز الخدمة بنسبة 20%",
    en: "Reduce average service completion time by 20%",
  },
  kpi: { ar: "متوسط زمن إنجاز الخدمة", en: "Average Service Completion Time" },
  progress: 65,
  owner: { ar: "موظف تجريبي — الوحدة الحكومية (أ)", en: "Demo Employee — Government Unit (A)" },
  period: { ar: "العام 2026", en: "Year 2026" },
  knowledgeSupport: {
    approvedInitiatives: 6,
    adaptablePractices: 3,
    otherEntityExperiences: 2,
  },
};

/* ---------------- Knowledge Sharing Levels ---------------- */
const KNOWLEDGE_LEVELS = [
  {
    id: 1,
    ar: { name: "المستوى الأول: داخل الوحدة الحكومية", desc: "معرفة متاحة للاطلاع والاستخدام داخل نفس الوحدة الحكومية فقط، ولا تُشارك تلقائيًا مع جهات أخرى." },
    en: { name: "Level 1: Within the Government Unit", desc: "Knowledge visible and usable only within the same government unit; not automatically shared externally." },
  },
  {
    id: 2,
    ar: { name: "المستوى الثاني: قابلة للمشاركة بين الوحدات الحكومية", desc: "معرفة تمت مراجعتها وأُتيحت للمشاركة مع وحدات حكومية أخرى بناءً على موافقة الجهة المختصة." },
    en: { name: "Level 2: Shareable Across Government Units", desc: "Knowledge reviewed and approved for sharing with other government units, subject to owning-entity approval." },
  },
  {
    id: 3,
    ar: { name: "المستوى الثالث: ممارسة حكومية قابلة للتعميم", desc: "ممارسة أثبتت قيمتها عبر أكثر من جهة وتم اعتمادها لتكون قابلة للتعميم على نطاق أوسع." },
    en: { name: "Level 3: Generalizable Government Practice", desc: "A practice proven valuable across multiple entities and approved for broader generalization." },
  },
];

/* ---------------- Access / Governance classes ---------------- */
const ACCESS_LEVELS = [
  { id: "internal", ar: "داخلي", en: "Internal" },
  { id: "restricted", ar: "مقيد", en: "Restricted" },
  { id: "shareable", ar: "قابل للمشاركة", en: "Shareable" },
  { id: "generalizable", ar: "قابل للتعميم", en: "Generalizable" },
];

/* ---------------- The ONE rich, complete demo initiative ---------------- */
const MAIN_INITIATIVE = {
  id: "init-main",
  isDemo: true,
  status: { ar: "معتمدة", en: "Approved" },
  sharingLevel: 2,
  accessLevel: "shareable",
  adaptability: { ar: "مرتفعة", en: "High" },
  domain: { ar: "الكفاءة التشغيلية", en: "Operational Efficiency" },
  challengeType: { ar: "بطء الإجراءات الداخلية", en: "Slow Internal Procedures" },
  kpi: { ar: "متوسط زمن إنجاز الخدمة", en: "Average Service Completion Time" },
  relatedGoal: { ar: "تحسين كفاءة تقديم الخدمات", en: "Improve Service Delivery Efficiency" },
  title: { ar: "مبادرة تحسين زمن إنجاز المعاملات الداخلية", en: "Internal Transaction Turnaround Improvement Initiative" },
  originalInnovator: { ar: "موظف تجريبي", en: "Demo Innovator" },
  originalEntity: { ar: "وحدة حكومية (أ)", en: "Government Unit (A)" },
  approvalDate: { ar: "١٥ فبراير ٢٠٢٦", en: "15 Feb 2026" },
  adaptationsCount: 2,
  beneficiaryEntities: 3,
  reuseCount: 2,

  fields: {
    f1_title: { ar: "مبادرة تحسين زمن إنجاز المعاملات الداخلية", en: "Internal Transaction Turnaround Improvement Initiative" },
    f2_owner: { ar: "موظف تجريبي", en: "Demo Innovator" },
    f3_entity: { ar: "وحدة حكومية (أ)", en: "Government Unit (A)" },
    f4_date: { ar: "١٥ فبراير ٢٠٢٦", en: "15 February 2026" },
    f5_problem: {
      ar: "كانت المعاملات الداخلية بين الأقسام تمر بعدة موافقات ورقية متسلسلة، ما أدى إلى تأخر متوسط زمن الإنجاز وتراكم الطلبات.",
      en: "Internal transactions between departments passed through several sequential paper approvals, causing delays in average completion time and request backlogs.",
    },
    f6_goal: {
      ar: "تحسين كفاءة تقديم الخدمات — تقليل متوسط زمن إنجاز الخدمة بنسبة 20%.",
      en: "Improve Service Delivery Efficiency — reduce average service completion time by 20%.",
    },
    f7_kpis: {
      ar: "متوسط زمن إنجاز الخدمة، نسبة المعاملات المنجزة ضمن المدة المستهدفة.",
      en: "Average service completion time; percentage of transactions completed within target time.",
    },
    f8_solution: {
      ar: "استبدال سلسلة الموافقات الورقية بمسار تتابعي إلكتروني مبسّط مع تحديد مهلة زمنية قصوى لكل مرحلة وتنبيهات آلية للمسؤول عند تجاوزها.",
      en: "Replacing the sequential paper approval chain with a simplified digital workflow, a maximum time limit per stage, and automatic alerts to the responsible officer when exceeded.",
    },
    f9_whyChosen: {
      ar: "تم اختيار هذا الحل لأنه لا يتطلب نظامًا جديدًا معقدًا، ويمكن تطبيقه بالموارد المتاحة، ويعالج نقطة الاختناق الرئيسية دون تغيير الهيكل التنظيمي.",
      en: "Chosen because it required no complex new system, could be implemented with existing resources, and addressed the main bottleneck without changing the organizational structure.",
    },
    f10_steps: {
      ar: [
        "حصر مراحل الموافقة الحالية وتحديد نقاط التأخير",
        "تصميم مسار إلكتروني مبسّط بعدد مراحل أقل",
        "تحديد مهلة زمنية قصوى لكل مرحلة",
        "بناء تنبيهات آلية عند تجاوز المهلة",
        "تجربة المسار على عينة من المعاملات",
        "تعميم المسار الجديد بعد التقييم",
      ],
      en: [
        "Mapping current approval stages and identifying delay points",
        "Designing a simplified digital workflow with fewer stages",
        "Setting a maximum time limit per stage",
        "Building automatic alerts when limits are exceeded",
        "Piloting the workflow on a sample of transactions",
        "Rolling out the new workflow after evaluation",
      ],
    },
    f11_resources: {
      ar: "فريق عمل من 3 موظفين، أداة سير عمل إلكترونية متاحة داخليًا، فترة تجريب مدتها 6 أسابيع.",
      en: "A team of 3 staff, an internally available digital workflow tool, and a 6-week pilot period.",
    },
    f12_results: {
      ar: "انخفاض متوسط زمن إنجاز المعاملة من 5 أيام إلى 4 أيام تقريبًا (بيانات تجريبية).",
      en: "Average transaction completion time decreased from approximately 5 days to 4 days (demo data).",
    },
    f13_evidence: {
      ar: "تقرير مقارنة زمن الإنجاز قبل وبعد التطبيق على عينة من 40 معاملة تجريبية.",
      en: "A before/after comparison report on average completion time across a sample of 40 demo transactions.",
    },
    f14_whatWorked: {
      ar: "تقليل عدد مراحل الموافقة، والتنبيهات الآلية عند تجاوز المهلة.",
      en: "Reducing the number of approval stages, and automatic alerts when time limits were exceeded.",
    },
    f15_whatDidntWork: {
      ar: "المحاولة الأولى لدمج مرحلتين معًا سببت التباسًا في المسؤولية، فتم التراجع عنها وإبقاء المراحل منفصلة مع تقصير مهلها فقط.",
      en: "An initial attempt to merge two stages caused confusion over responsibility; it was reversed, keeping stages separate but shortening their time limits.",
    },
    f16_challenges: {
      ar: "مقاومة أولية من بعض الموظفين للتحول عن النموذج الورقي، وحاجة لتدريب قصير على الأداة الإلكترونية.",
      en: "Initial resistance from some staff to moving away from paper, and a need for brief training on the digital tool.",
    },
    f17_lessons: {
      ar: "تبسيط عدد المراحل أكثر أثرًا من تسريع كل مرحلة على حدة؛ التنبيهات الآلية ترفع الالتزام بالمهل الزمنية.",
      en: "Simplifying the number of stages has more impact than speeding up each stage individually; automatic alerts improve adherence to time limits.",
    },
    f18_adaptationNotes: {
      ar: "يناسب الجهات ذات مسارات موافقة متسلسلة مشابهة؛ يحتاج تعديل عدد المراحل والمهل حسب طبيعة كل جهة.",
      en: "Suitable for entities with similar sequential approval paths; the number of stages and time limits should be adjusted to each entity's context.",
    },
    f19_guide: {
      ar: "دليل تطبيق مختصر: (١) حصر المراحل الحالية (٢) تحديد الاختناقات (٣) تصميم مسار مبسّط (٤) تحديد مهل زمنية (٥) تجربة على عينة (٦) تقييم وتعميم.",
      en: "Short application guide: (1) Map current stages (2) Identify bottlenecks (3) Design a simplified workflow (4) Set time limits (5) Pilot on a sample (6) Evaluate and roll out.",
    },
  },

  supportingEvidenceLabel: DEMO_TAG,
};

/* ---------------- Reuse / Adaptation history (seed, grows via app) --- */
const EVOLUTION_SEED = [
  {
    id: "eh-0",
    entity: { ar: "وحدة حكومية (أ)", en: "Government Unit (A)" },
    stageLabel: { ar: "المبادرة الأصلية", en: "Original Initiative" },
    year: "2026",
    changes: { ar: "التطبيق الأول للمسار الإلكتروني المبسّط.", en: "First implementation of the simplified digital workflow." },
    kpiResult: { ar: "خفض الزمن من 5 إلى 4 أيام تقريبًا", en: "Time reduced from ~5 to ~4 days" },
    lesson: { ar: "تبسيط المراحل أكثر أثرًا من تسريعها فرديًا.", en: "Simplifying stages beats speeding each one up individually." },
    innovator: { ar: "موظف تجريبي", en: "Demo Innovator" },
    seeded: true,
  },
  {
    id: "eh-1",
    entity: { ar: "وحدة حكومية (ب)", en: "Government Unit (B)" },
    stageLabel: { ar: "تكييف أول", en: "First Adaptation" },
    year: "2027",
    changes: { ar: "تقليل مهلة إحدى المراحل من يومين إلى يوم واحد نظرًا لصغر حجم المعاملات لديها.", en: "Shortened one stage's limit from 2 days to 1 day due to smaller transaction volume." },
    kpiResult: { ar: "خفض إضافي بنسبة تقريبية 10%", en: "An additional ~10% reduction" },
    lesson: { ar: "المهل الزمنية يجب أن تُكيّف حسب حجم المعاملات لدى كل جهة.", en: "Time limits should be tailored to each entity's transaction volume." },
    innovator: { ar: "موظف تجريبي (المبادرة الأصلية)", en: "Demo Innovator (original initiative)" },
    seeded: true,
  },
  {
    id: "eh-2",
    entity: { ar: "وحدة حكومية (ج)", en: "Government Unit (C)" },
    stageLabel: { ar: "تطبيق معدّل", en: "Modified Implementation" },
    year: "2027",
    changes: { ar: "دمج التنبيهات الآلية مع البريد الإلكتروني الرسمي بدلاً من نظام مستقل.", en: "Integrated automatic alerts with official email instead of a standalone system." },
    kpiResult: { ar: "تحسّن نسبة الالتزام بالمهل إلى ما يقارب 85%", en: "Compliance with time limits improved to ~85%" },
    lesson: { ar: "الاستفادة من أدوات موجودة تسرّع تبني المسار الجديد.", en: "Leveraging existing tools speeds adoption of the new workflow." },
    innovator: { ar: "موظف تجريبي (المبادرة الأصلية)", en: "Demo Innovator (original initiative)" },
    seeded: true,
  },
];

/* ---------------- Cross-government demo cards (discovery/list) ------- */
const INITIATIVE_CARDS = [
  {
    id: "card-main",
    linkToMain: true,
    title: { ar: "مبادرة تحسين زمن إنجاز المعاملات الداخلية", en: "Internal Transaction Turnaround Improvement" },
    entity: { ar: "وحدة حكومية (أ)", en: "Government Unit (A)" },
    problem: { ar: "بطء الموافقات الداخلية المتسلسلة", en: "Slow sequential internal approvals" },
    result: { ar: "خفض زمن الإنجاز من 5 إلى 4 أيام تقريبًا", en: "Turnaround cut from ~5 to ~4 days" },
    kpi: { ar: "متوسط زمن إنجاز الخدمة", en: "Average Service Completion Time" },
    domain: { ar: "الكفاءة التشغيلية", en: "Operational Efficiency" },
    challengeType: { ar: "بطء الإجراءات الداخلية", en: "Slow Internal Procedures" },
    adaptations: 2,
    sharingLevel: 2,
    adaptability: { ar: "مرتفعة", en: "High" },
    status: { ar: "معتمدة", en: "Approved" },
    relatedness: 98, reuse: 2, recency: 2026, impact: 90,
  },
  {
    id: "card-2",
    linkToMain: false,
    title: { ar: "تحسين تجربة المستفيد في نقاط الخدمة", en: "Improving Beneficiary Experience at Service Points" },
    entity: { ar: "وحدة حكومية (ب)", en: "Government Unit (B)" },
    problem: { ar: "ضعف وضوح خطوات تقديم الطلب للمستفيدين", en: "Unclear application steps for beneficiaries" },
    result: { ar: "ارتفاع رضا المستفيدين بنسبة تقريبية 15%", en: "Beneficiary satisfaction up ~15%" },
    kpi: { ar: "مؤشر رضا المستفيدين", en: "Beneficiary Satisfaction Index" },
    domain: { ar: "تجربة المستفيد", en: "Beneficiary Experience" },
    challengeType: { ar: "ضعف وضوح الإجراءات", en: "Unclear Procedures" },
    adaptations: 1,
    sharingLevel: 2,
    adaptability: { ar: "متوسطة", en: "Medium" },
    status: { ar: "معتمدة", en: "Approved" },
    relatedness: 72, reuse: 1, recency: 2025, impact: 70,
  },
  {
    id: "card-3",
    linkToMain: false,
    title: { ar: "أتمتة إجراء داخلي متكرر", en: "Automating a Recurring Internal Procedure" },
    entity: { ar: "وحدة حكومية (ج)", en: "Government Unit (C)" },
    problem: { ar: "تكرار إدخال نفس البيانات يدويًا في أكثر من نظام", en: "Repeated manual data entry across multiple systems" },
    result: { ar: "توفير ما يقارب 3 ساعات عمل أسبوعيًا لكل موظف", en: "Saved ~3 staff-hours per employee weekly" },
    kpi: { ar: "زمن إنجاز الإجراء الإداري", en: "Administrative Procedure Time" },
    domain: { ar: "الكفاءة التشغيلية", en: "Operational Efficiency" },
    challengeType: { ar: "تكرار الأعمال الإدارية", en: "Duplicate Administrative Work" },
    adaptations: 0,
    sharingLevel: 1,
    adaptability: { ar: "متوسطة", en: "Medium" },
    status: { ar: "معتمدة", en: "Approved" },
    relatedness: 65, reuse: 0, recency: 2026, impact: 60,
  },
  {
    id: "card-4",
    linkToMain: false,
    title: { ar: "تحسين إدارة المعرفة الداخلية بين الفرق", en: "Improving Internal Knowledge Management Across Teams" },
    entity: { ar: "وحدة حكومية (أ)", en: "Government Unit (A)" },
    problem: { ar: "فقدان المعرفة عند تنقل الموظفين بين الأقسام", en: "Knowledge loss when staff move between departments" },
    result: { ar: "خفض زمن تهيئة الموظف الجديد بنسبة تقريبية 25%", en: "New-employee onboarding time cut ~25%" },
    kpi: { ar: "زمن تهيئة الموظف الجديد", en: "New Employee Onboarding Time" },
    domain: { ar: "إدارة المعرفة", en: "Knowledge Management" },
    challengeType: { ar: "فقدان المعرفة المؤسسية", en: "Loss of Institutional Knowledge" },
    adaptations: 1,
    sharingLevel: 3,
    adaptability: { ar: "مرتفعة", en: "High" },
    status: { ar: "معتمدة", en: "Approved" },
    relatedness: 58, reuse: 1, recency: 2025, impact: 75,
  },
  {
    id: "card-5",
    linkToMain: false,
    title: { ar: "تقليل تكرار الأعمال الإدارية بين الأقسام", en: "Reducing Duplicate Administrative Work Between Departments" },
    entity: { ar: "وحدة حكومية (ب)", en: "Government Unit (B)" },
    problem: { ar: "إعداد نفس التقرير من قبل أكثر من قسم", en: "The same report prepared independently by more than one department" },
    result: { ar: "توحيد إعداد التقرير وخفض الجهد المكرر بنسبة تقريبية 30%", en: "Unified reporting cut duplicated effort ~30%" },
    kpi: { ar: "ساعات العمل المكررة", en: "Duplicated Work Hours" },
    domain: { ar: "الكفاءة التشغيلية", en: "Operational Efficiency" },
    challengeType: { ar: "تكرار الأعمال الإدارية", en: "Duplicate Administrative Work" },
    adaptations: 0,
    sharingLevel: 2,
    adaptability: { ar: "مرتفعة", en: "High" },
    status: { ar: "معتمدة", en: "Approved" },
    relatedness: 55, reuse: 0, recency: 2024, impact: 55,
  },
  {
    id: "card-6",
    linkToMain: false,
    title: { ar: "تحسين كفاءة استخدام الموارد المشتركة", en: "Improving Efficient Use of Shared Resources" },
    entity: { ar: "وحدة حكومية (ج)", en: "Government Unit (C)" },
    problem: { ar: "ضعف جدولة استخدام القاعات والموارد المشتركة", en: "Poor scheduling of shared rooms and resources" },
    result: { ar: "رفع معدل استغلال الموارد بنسبة تقريبية 20%", en: "Resource utilization rate up ~20%" },
    kpi: { ar: "معدل استغلال الموارد المشتركة", en: "Shared Resource Utilization Rate" },
    domain: { ar: "كفاءة الموارد", en: "Resource Efficiency" },
    challengeType: { ar: "ضعف تنظيم الموارد", en: "Poor Resource Organization" },
    adaptations: 0,
    sharingLevel: 1,
    adaptability: { ar: "منخفضة", en: "Low" },
    status: { ar: "معتمدة", en: "Approved" },
    relatedness: 40, reuse: 0, recency: 2024, impact: 45,
  },
];

/* ---------------- Governance ---------------- */
const GOVERNANCE = {
  roles: [
    { ar: "صاحب المبادرة", en: "Initiative Owner" },
    { ar: "الجهة المختصة داخل الوحدة الحكومية", en: "Competent Authority within the Government Unit" },
    { ar: "الجهة المستفيدة", en: "Beneficiary Entity" },
    { ar: "المستوى الإشرافي المختص", en: "Relevant Supervisory Level" },
    { ar: "الإدارة الفنية للمنظومة", en: "System Technical Administration" },
  ],
  criteria: [
    { ar: "قابلية النقل", en: "Transferability" },
    { ar: "حساسية المعلومات", en: "Information Sensitivity" },
    { ar: "قوة الدليل", en: "Strength of Evidence" },
    { ar: "متطلبات التطبيق", en: "Implementation Requirements" },
    { ar: "نطاق المشاركة", en: "Sharing Scope" },
  ],
};

/* ---------------- Dashboard base (demo) figures ---------------- */
const DASHBOARD_BASE = {
  approvedKnowledgeInitiatives: 24,
  reusedInitiatives: 9,
  adoptionRequestsBase: 14,
  beneficiaryEntitiesBase: 11,
  newLessonsBase: 21,
  initiativesLinkedToGoals: 17,
  generalizablePractices: 5,
  duplicationAvoidedCases: 8,
  extendedImpact: {
    beneficiaryEntitiesBase: 11,
    reuseTimesBase: 13,
    goalsSupportedBase: 9,
    newLessonsBase: 21,
  },
};

/* ---------------- Resource value / cost avoidance (conceptual) ------- */
const RESOURCE_VALUE_ITEMS = [
  { ar: "ساعات العمل التي تم تجنب تكرارها", en: "Work hours saved from avoided duplication" },
  { ar: "إعادة تطوير أدوات مشابهة", en: "Redevelopment of similar tools" },
  { ar: "إعادة تصميم مواد تدريبية", en: "Redesign of training materials" },
  { ar: "زمن الوصول إلى الحل", en: "Time to reach a solution" },
  { ar: "الموارد القابلة لإعادة الاستخدام", en: "Reusable resources" },
];

/* ---------------- Adoption workflow stages ---------------- */
const WORKFLOW_STAGES = [
  { ar: "تم استلام الطلب", en: "Request Received" },
  { ar: "مراجعة", en: "Review" },
  { ar: "تواصل مع صاحب المبادرة", en: "Contacting the Initiative Owner" },
  { ar: "إعداد خطة التكييف", en: "Preparing the Adaptation Plan" },
  { ar: "تطبيق", en: "Implementation" },
  { ar: "قياس النتائج", en: "Measuring Results" },
  { ar: "إضافة الدروس الجديدة", en: "Adding New Lessons" },
];

/* ---------------- Knowledge journey cycle (for visuals) ---------------- */
const KNOWLEDGE_CYCLE = [
  { ar: "هدف / تحدٍ", en: "Goal / Challenge" },
  { ar: "مبادرة ناجحة", en: "Successful Initiative" },
  { ar: "نتائج ومؤشرات أداء", en: "Results / KPIs" },
  { ar: "اعتماد", en: "Approval" },
  { ar: "توثيق المعرفة", en: "Knowledge Capture" },
  { ar: "ربطها بالأهداف والتحديات", en: "Linking to Goals & Challenges" },
  { ar: "اكتشافها", en: "Discovery" },
  { ar: "تبني أو تكييف", en: "Adoption / Adaptation" },
  { ar: "تطبيق جديد", en: "New Implementation" },
  { ar: "قياس النتائج الجديدة", en: "Measuring New Results" },
  { ar: "إضافة الدروس المستفادة", en: "Adding Lessons Learned" },
  { ar: "تعلم مؤسسي مستمر", en: "Continuous Institutional Learning" },
];
