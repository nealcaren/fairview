export const GRID_SIZE = 6;
export const EVENT_CHANCE = 0.35;
export const MAX_POLICIES_PER_TURN = 2;
export const MAX_TOKENS_PER_TURN = 1;
export const EXOGENOUS_EVENT_CHANCE = 0.2;
export const WHIMSY_EVENT_CHANCE = 0.08;
export const ENDGAME_TURN = 20;

export const STAGES = [
  {
    id: 1,
    name: "Foundational City",
    growthMin: 0,
    readinessMin: 0,
    institutions: ["economy", "family", "education", "polity"],
  },
  {
    id: 2,
    name: "Expansion City",
    growthMin: 35,
    readinessMin: 45,
    institutions: [
      "economy",
      "family",
      "education",
      "polity",
      "health",
      "justice",
      "media",
    ],
  },
  {
    id: 3,
    name: "Stratified Metropolis",
    growthMin: 55,
    readinessMin: 55,
    institutions: [
      "economy",
      "family",
      "education",
      "polity",
      "health",
      "justice",
      "media",
      "welfare",
      "housing",
      "finance",
    ],
  },
  {
    id: 4,
    name: "Globalized City",
    growthMin: 75,
    readinessMin: 65,
    institutions: [
      "economy",
      "family",
      "education",
      "polity",
      "health",
      "justice",
      "media",
      "welfare",
      "housing",
      "finance",
    ],
  },
];

export const INSTITUTIONS = {
  economy: {
    label: "Economy",
    levers: { wage: 50, tax: 50 },
  },
  polity: {
    label: "Polity",
    levers: { voting: 50, antiCorruption: 50 },
  },
  education: {
    label: "Education",
    levers: { funding: 50, tracking: 50 },
  },
  family: {
    label: "Family/Community",
    levers: { childcare: 50, housingSupport: 50 },
  },
  health: {
    label: "Health",
    levers: { publicHealth: 50, mentalHealth: 50 },
  },
  justice: {
    label: "Criminal Justice",
    levers: { policing: 50, diversion: 50 },
  },
  media: {
    label: "Media",
    levers: { publicInfo: 50, platformReg: 50 },
  },
  welfare: {
    label: "Welfare",
    levers: { generosity: 50, eligibility: 50 },
  },
  housing: {
    label: "Housing",
    levers: { zoning: 50, publicHousing: 50 },
  },
  finance: {
    label: "Finance",
    levers: { regulation: 50, deregulation: 50 },
  },
};

export const TOKEN_TYPES = {
  school: {
    label: "School",
    cost: 18,
    radius: 1,
    effects: { access: 8, cohesion: 4 },
  },
  clinic: {
    label: "Clinic",
    cost: 20,
    radius: 1,
    effects: { risk: -6 },
  },
  transit: {
    label: "Transit Hub",
    cost: 20,
    radius: 1,
    effects: { access: 6, housingCost: 3 },
  },
  police: {
    label: "Police Station",
    cost: 18,
    radius: 1,
    effects: { risk: -5, cohesion: -2 },
  },
  community: {
    label: "Community Center",
    cost: 16,
    radius: 1,
    effects: { cohesion: 6, risk: -2 },
  },
};

export const TOKEN_ICONS = {
  school: "SC",
  clinic: "CL",
  transit: "TR",
  police: "PO",
  community: "CC",
};

const NEWS_TEMPLATES = {
  housing: {
    academic: [
      "Housing demand rose alongside displacement pressure.",
      "Housing costs climbed, tightening local affordability.",
    ],
    civic: [
      "Housing demand surged, followed closely by housing anxiety.",
      "New towers reshaped the skyline and reshuffled the neighborhood.",
    ],
    satirical: [
      "Luxury developments broke ground; affordable housing broke hearts.",
      "City leaders celebrated a 'vibrant housing market' as long-time residents celebrated moving in with relatives.",
    ],
  },
  inequality: {
    academic: [
      "Inequality widened as gains concentrated at the top.",
      "Economic growth continued, unevenly distributed across groups.",
    ],
    civic: [
      "Economic growth continued, though not everyone seemed invited.",
      "Prosperity rose citywide, though it stopped at certain zip codes.",
    ],
    satirical: [
      "The wealth gap widened, providing excellent views for those at the top.",
      "Middle-income families reported feeling 'statistically stable.'",
    ],
  },
  order: {
    academic: [
      "Disorder declined while legitimacy remained contested.",
      "Order improved as public trust held steady.",
    ],
    civic: [
      "Disorder declined, trust remained under review.",
      "Safety metrics improved; legitimacy metrics filed an appeal.",
    ],
    satirical: [
      "Officials reported improved order downtown. Residents reported improved anxiety.",
      "Police presence increased, along with debates about presence itself.",
    ],
  },
  education: {
    academic: [
      "Education capacity increased with delayed mobility gains.",
      "Learning investments rose as costs followed.",
    ],
    civic: [
      "School funding rose, inspiring hope and construction delays.",
      "Students gained opportunity and student loan obligations.",
    ],
    satirical: [
      "Graduation rates climbed; tuition followed.",
      "Class sizes shrank, expectations expanded.",
    ],
  },
  bureaucracy: {
    academic: [
      "Administrative activity increased with modest public impact.",
      "New processes were added to evaluate existing processes.",
    ],
    civic: [
      "A committee was formed to study the recommendations of a previous committee.",
      "City council approved a task force to explore future approvals.",
    ],
    satirical: [
      "Public hearings were scheduled to discuss scheduling future hearings.",
      "Officials praised the efficiency of a new efficiency initiative.",
    ],
  },
  whimsy: {
    academic: [
      "A cultural trend briefly shifted attention from productivity.",
      "Public attention moved toward a civic novelty.",
    ],
    civic: [
      "Citywide enthusiasm boosted cohesion more than output.",
      "A playful moment softened civic tension.",
    ],
    satirical: [
      "Productivity paused while the city went viral.",
      "Residents asked whether vibes count as infrastructure.",
    ],
  },
};

const MEDIA_HEADLINES = {
  growth: {
    proGrowth: "City Economy Surges to Record Heights",
    equityCritical: "Growth Leaves Many Residents Behind",
  },
  order: {
    proGrowth: "Crime Down After Police Investment",
    equityCritical: "Surveillance Expansion Sparks Concern",
  },
  housing: {
    proGrowth: "Downtown Revitalization Continues",
    equityCritical: "Displacement Fears Mount",
  },
};

const CIVIC_CHARACTERS = [
  {
    id: "mayor",
    name: "Elena Cruz",
    role: "Mayor",
    ideology: "legitimacy",
    quotes: [
      "Growth must serve everyone, or it serves no one.",
      "Order and opportunity must advance together.",
      "Our challenge is not expansion, it is inclusion.",
    ],
  },
  {
    id: "developer",
    name: "Lionel Price",
    role: "Real estate developer",
    ideology: "growth",
    quotes: [
      "Rising rents signal confidence in our city.",
      "Investment goes where vision leads.",
      "Growth requires bold redevelopment.",
    ],
  },
  {
    id: "labor",
    name: "Rosa Alvarez",
    role: "Labor organizer",
    ideology: "equity",
    quotes: [
      "Productivity is rising. Wages are thinking about it.",
      "Workers built this city; they deserve to live in it.",
      "Prosperity without equity is extraction.",
    ],
  },
  {
    id: "community",
    name: "Rev. Thomas Hale",
    role: "Community leader",
    ideology: "cohesion",
    quotes: [
      "Neighborhoods thrive on trust, not just investment.",
      "Cohesion cannot be rezoned.",
      "We are losing familiarity faster than we are gaining prosperity.",
    ],
  },
  {
    id: "health",
    name: "Dr. Mira Banerjee",
    role: "Public health director",
    ideology: "health",
    quotes: [
      "Infrastructure is health policy.",
      "Housing instability is a medical risk factor.",
      "Strain shows up in clinics before it shows up in reports.",
    ],
  },
  {
    id: "tech",
    name: "Jax Mercer",
    role: "Tech entrepreneur",
    ideology: "growth",
    quotes: [
      "Innovation is our greatest civic asset.",
      "Talent follows opportunity.",
      "Disruption is uncomfortable but necessary.",
    ],
  },
];

const NICKNAME_RULES = [
  {
    category: "inequality",
    names: ["Two-Tier Terrace", "Splitview", "Dividend Heights"],
    condition: (district) => district.housingCost > 70 && district.incomeTier === 0,
    retain: (district) => district.housingCost > 60,
  },
  {
    category: "gentrifying",
    names: ["Rent Harbor", "Startup Gulch", "Artisan Alley"],
    condition: (district) => district.housingCost > 65 && district.access > 60,
    retain: (district) => district.housingCost > 55 && district.access > 50,
  },
  {
    category: "cohesion",
    names: ["Block Party Row", "Neighborly Square", "Union Commons"],
    condition: (district) => district.cohesion > 70,
    retain: (district) => district.cohesion > 62,
  },
  {
    category: "policing",
    names: ["Sirenside", "Patrol Point", "Bluewatch"],
    condition: (district) => district.risk > 70,
    retain: (district) => district.risk > 60,
  },
];

export const GROUPS = {
  Elite: {
    size: "Small",
    power: "High",
    income: 75,
    wellbeing: 70,
    influence: 80,
    grievance: 20,
  },
  Middle: {
    size: "Medium",
    power: "Medium",
    income: 55,
    wellbeing: 60,
    influence: 55,
    grievance: 30,
  },
  Working: {
    size: "Large",
    power: "Low",
    income: 40,
    wellbeing: 50,
    influence: 30,
    grievance: 45,
  },
  Marginalized: {
    size: "Large",
    power: "Very low",
    income: 30,
    wellbeing: 45,
    influence: 20,
    grievance: 55,
  },
};

export const POLICY_CARDS = [
  {
    id: "expand-policing",
    name: "Expand Policing",
    minStage: 2,
    cost: 20,
    tags: ["Order", "Legitimacy"],
    summary: "Disorder down, but marginalized grievance rises with a lag.",
    effects: [
      { target: "city", key: "disorder", delta: -8 },
      {
        target: "group",
        group: "Marginalized",
        key: "grievance",
        delta: 8,
        delay: 1,
      },
      { target: "institution", inst: "justice", lever: "policing", delta: 6 },
      { target: "district", where: "income_low", key: "risk", delta: 6 },
    ],
  },
  {
    id: "community-health",
    name: "Community Health Clinics",
    minStage: 2,
    cost: 25,
    tags: ["Equity", "Capacity"],
    summary: "Health capacity rises; risk exposure eases.",
    effects: [
      { target: "institution", inst: "health", lever: "publicHealth", delta: 6 },
      { target: "group", group: "Working", key: "wellbeing", delta: 5 },
      { target: "group", group: "Marginalized", key: "wellbeing", delta: 6 },
      { target: "district", where: "access_low", key: "risk", delta: -4 },
    ],
  },
  {
    id: "rent-stabilization",
    name: "Rent Stabilization",
    minStage: 3,
    cost: 30,
    tags: ["Equity", "Legitimacy"],
    summary: "Housing costs drop in low-income districts, growth cools.",
    effects: [
      { target: "district", where: "income_low", key: "housingCost", delta: -8 },
      { target: "city", key: "growth", delta: -3 },
      { target: "institution", inst: "housing", lever: "publicHousing", delta: 4 },
    ],
  },
  {
    id: "wage-standards",
    name: "Wage Standards",
    minStage: 1,
    cost: 25,
    tags: ["Equity", "Legitimacy"],
    summary: "Working income rises; elite income softens.",
    effects: [
      { target: "institution", inst: "economy", lever: "wage", delta: 6 },
      { target: "group", group: "Working", key: "income", delta: 6 },
      { target: "group", group: "Marginalized", key: "income", delta: 5 },
      { target: "group", group: "Elite", key: "income", delta: -4 },
    ],
  },
  {
    id: "tax-cut",
    name: "Corporate Tax Cut",
    minStage: 1,
    cost: 20,
    tags: ["Growth"],
    summary: "Growth bump, but inequality accelerates.",
    effects: [
      { target: "institution", inst: "economy", lever: "tax", delta: -6 },
      { target: "city", key: "growth", delta: 5 },
      { target: "city", key: "inequality", delta: 4 },
    ],
  },
  {
    id: "education-boost",
    name: "Public Education Boost",
    minStage: 1,
    cost: 30,
    tags: ["Equity", "Capacity"],
    summary: "Cohesion improves now; mobility rises later.",
    effects: [
      { target: "institution", inst: "education", lever: "funding", delta: 8 },
      { target: "city", key: "cohesion", delta: 4 },
      { target: "city", key: "mobility", delta: 6, delay: 1 },
    ],
  },
  {
    id: "anti-corruption",
    name: "Anti-Corruption Drive",
    minStage: 1,
    cost: 20,
    tags: ["Legitimacy"],
    summary: "Political capture drops; legitimacy rises.",
    effects: [
      { target: "institution", inst: "polity", lever: "antiCorruption", delta: 6 },
      { target: "city", key: "capture", delta: -8 },
      { target: "city", key: "legitimacy", delta: 5 },
    ],
  },
  {
    id: "media-transparency",
    name: "Media Transparency Charter",
    minStage: 2,
    cost: 15,
    tags: ["Legitimacy"],
    summary: "Legitimacy and public information improve.",
    effects: [
      { target: "institution", inst: "media", lever: "publicInfo", delta: 6 },
      { target: "city", key: "legitimacy", delta: 4 },
      { target: "city", key: "cohesion", delta: 2 },
    ],
  },
  {
    id: "welfare-expansion",
    name: "Welfare Expansion",
    minStage: 3,
    cost: 35,
    tags: ["Equity", "Capacity"],
    summary: "Group burden falls; strain eases.",
    effects: [
      { target: "institution", inst: "welfare", lever: "generosity", delta: 8 },
      { target: "city", key: "burden", delta: -6 },
      { target: "city", key: "strain", delta: -3 },
      { target: "group", group: "Working", key: "wellbeing", delta: 4 },
      { target: "group", group: "Marginalized", key: "wellbeing", delta: 5 },
    ],
  },
  {
    id: "zoning-reform",
    name: "Zoning Reform",
    minStage: 3,
    cost: 25,
    tags: ["Growth", "Equity"],
    summary: "Housing supply expands; growth nudges up.",
    effects: [
      { target: "institution", inst: "housing", lever: "zoning", delta: 7 },
      { target: "district", where: "access_high", key: "housingCost", delta: -5 },
      { target: "city", key: "growth", delta: 2 },
    ],
  },
  {
    id: "financial-dereg",
    name: "Financial Deregulation",
    minStage: 3,
    cost: 20,
    tags: ["Growth"],
    summary: "Growth surges, inequality rises.",
    effects: [
      { target: "institution", inst: "finance", lever: "deregulation", delta: 7 },
      { target: "city", key: "growth", delta: 6 },
      { target: "city", key: "inequality", delta: 6 },
    ],
  },
  {
    id: "childcare",
    name: "Community Childcare",
    minStage: 1,
    cost: 20,
    tags: ["Equity", "Capacity"],
    summary: "Cohesion rises, working wellbeing improves.",
    effects: [
      { target: "institution", inst: "family", lever: "childcare", delta: 7 },
      { target: "city", key: "cohesion", delta: 5 },
      { target: "group", group: "Working", key: "wellbeing", delta: 4 },
    ],
  },
  {
    id: "transit-expansion",
    name: "Transit Expansion",
    minStage: 2,
    cost: 25,
    tags: ["Growth", "Equity"],
    summary: "Access improves, but nearby housing costs climb.",
    effects: [
      { target: "district", where: "access_low", key: "access", delta: 6 },
      { target: "district", where: "access_high", key: "housingCost", delta: 4 },
      { target: "city", key: "growth", delta: 3 },
    ],
  },
  {
    id: "housing-vouchers",
    name: "Housing Voucher Pilot",
    minStage: 2,
    cost: 22,
    tags: ["Equity"],
    summary: "Burden falls for low-income districts, but budget tightens.",
    effects: [
      { target: "city", key: "burden", delta: -4 },
      { target: "district", where: "income_low", key: "housingCost", delta: -5 },
      { target: "city", key: "budget", delta: -10 },
    ],
  },
  {
    id: "union-protections",
    name: "Union Protections",
    minStage: 2,
    cost: 24,
    tags: ["Equity", "Order"],
    summary: "Working incomes rise; elite gains soften.",
    effects: [
      { target: "group", group: "Working", key: "income", delta: 5 },
      { target: "group", group: "Middle", key: "income", delta: 2 },
      { target: "group", group: "Elite", key: "income", delta: -3 },
      { target: "city", key: "legitimacy", delta: 2 },
    ],
  },
  {
    id: "charter-expansion",
    name: "Charter School Expansion",
    minStage: 2,
    cost: 18,
    tags: ["Growth", "Order"],
    summary: "Tracking rises; mobility slips with a delay.",
    effects: [
      { target: "institution", inst: "education", lever: "tracking", delta: 6 },
      { target: "city", key: "mobility", delta: -5, delay: 1 },
      { target: "city", key: "cohesion", delta: -2 },
    ],
  },
  {
    id: "tuition-subsidy",
    name: "Tuition Subsidy",
    minStage: 3,
    cost: 26,
    tags: ["Equity", "Capacity"],
    summary: "Mobility rises later; budget tightens now.",
    effects: [
      { target: "city", key: "mobility", delta: 6, delay: 1 },
      { target: "city", key: "budget", delta: -12 },
      { target: "city", key: "legitimacy", delta: 2 },
    ],
  },
  {
    id: "public-housing",
    name: "Public Housing Build",
    minStage: 3,
    cost: 34,
    tags: ["Equity", "Legitimacy"],
    summary: "Housing costs drop in low-income areas; growth slows slightly.",
    effects: [
      { target: "district", where: "income_low", key: "housingCost", delta: -7 },
      { target: "city", key: "growth", delta: -2 },
      { target: "city", key: "burden", delta: -4 },
    ],
  },
  {
    id: "security-crackdown",
    name: "Security Crackdown",
    minStage: 3,
    cost: 26,
    tags: ["Order"],
    summary: "Disorder drops, but legitimacy erodes with a delay.",
    effects: [
      { target: "city", key: "disorder", delta: -6 },
      { target: "city", key: "legitimacy", delta: -4, delay: 1 },
      { target: "group", group: "Marginalized", key: "grievance", delta: 6, delay: 1 },
    ],
  },
  {
    id: "green-infrastructure",
    name: "Green Infrastructure",
    minStage: 4,
    cost: 28,
    tags: ["Capacity", "Legitimacy"],
    summary: "Risk drops in low-access areas; growth cools slightly.",
    effects: [
      { target: "district", where: "access_low", key: "risk", delta: -6 },
      { target: "city", key: "strain", delta: -4 },
      { target: "city", key: "growth", delta: -2 },
    ],
  },
  {
    id: "surveillance-upgrade",
    name: "Surveillance Upgrade",
    minStage: 4,
    cost: 30,
    tags: ["Order"],
    summary: "Disorder drops, but grievance rises later.",
    effects: [
      { target: "city", key: "disorder", delta: -5 },
      { target: "group", group: "Marginalized", key: "grievance", delta: 8, delay: 1 },
      { target: "city", key: "legitimacy", delta: -3 },
    ],
  },
  {
    id: "universal-basic-income",
    name: "Universal Basic Income",
    minStage: 4,
    cost: 40,
    tags: ["Equity", "Legitimacy"],
    summary: "Wellbeing rises across groups; growth slows slightly.",
    effects: [
      { target: "group", group: "Working", key: "wellbeing", delta: 6 },
      { target: "group", group: "Marginalized", key: "wellbeing", delta: 7 },
      { target: "group", group: "Middle", key: "wellbeing", delta: 3 },
      { target: "city", key: "growth", delta: -3 },
    ],
  },
  {
    id: "public-transit-fare",
    name: "Transit Fare Cut",
    minStage: 2,
    cost: 16,
    tags: ["Equity", "Legitimacy"],
    summary: "Access rises in low-income areas; legitimacy improves.",
    effects: [
      { target: "district", where: "income_low", key: "access", delta: 4 },
      { target: "city", key: "legitimacy", delta: 3 },
      { target: "city", key: "cohesion", delta: 2 },
    ],
  },
  {
    id: "zoning-rollback",
    name: "Zoning Rollback",
    minStage: 2,
    cost: 18,
    tags: ["Growth"],
    summary: "Supply expands, but inequality rises.",
    effects: [
      { target: "city", key: "growth", delta: 3 },
      { target: "district", where: "access_high", key: "housingCost", delta: -4 },
      { target: "city", key: "inequality", delta: 3 },
    ],
  },
];

export const EVENTS = [
  {
    id: "housing-bubble",
    name: "Housing Bubble",
    text: "Housing costs spike in high-access districts. Displacement pressures rise.",
    category: "housing",
    templates: NEWS_TEMPLATES.housing,
    effects: [
      { target: "district", where: "access_high", key: "housingCost", delta: 10 },
      { target: "city", key: "inequality", delta: 6 },
    ],
  },
  {
    id: "plant-closure",
    name: "Plant Closure",
    text: "A major employer shuts down. Working incomes fall and strain rises.",
    category: "growth",
    templates: NEWS_TEMPLATES.inequality,
    effects: [
      { target: "city", key: "growth", delta: -8 },
      { target: "group", group: "Working", key: "income", delta: -8 },
      { target: "city", key: "strain", delta: 6 },
    ],
  },
  {
    id: "teacher-strike",
    name: "Teacher Strike",
    text: "Schools close for a week. Cohesion dips and tracking worsens.",
    category: "education",
    templates: NEWS_TEMPLATES.education,
    effects: [
      { target: "city", key: "cohesion", delta: -4 },
      { target: "institution", inst: "education", lever: "tracking", delta: 4 },
    ],
  },
  {
    id: "viral-scandal",
    name: "Viral Scandal",
    text: "Corruption scandal shakes trust in local government.",
    category: "bureaucracy",
    templates: NEWS_TEMPLATES.bureaucracy,
    effects: [
      { target: "city", key: "legitimacy", delta: -8 },
      { target: "group", group: "Middle", key: "grievance", delta: 6 },
    ],
  },
  {
    id: "wildfire",
    name: "Wildfire Season",
    text: "Environmental shock hits low-access districts hardest.",
    category: "health",
    templates: NEWS_TEMPLATES.order,
    effects: [
      { target: "district", where: "access_low", key: "risk", delta: 10 },
      { target: "city", key: "strain", delta: 6 },
      { target: "institution", inst: "health", lever: "publicHealth", delta: -4 },
    ],
  },
  {
    id: "tech-boom",
    name: "Tech Boom",
    text: "Tech investment surges, raising growth and inequality.",
    category: "growth",
    templates: NEWS_TEMPLATES.inequality,
    effects: [
      { target: "city", key: "growth", delta: 10 },
      { target: "city", key: "inequality", delta: 8 },
      { target: "group", group: "Elite", key: "income", delta: 6 },
    ],
  },
  {
    id: "protest-wave",
    name: "Protest Wave",
    text: "Mass demonstrations raise contestation and pressure for reform.",
    category: "inequality",
    templates: NEWS_TEMPLATES.inequality,
    effects: [
      { target: "city", key: "contestation", delta: 8 },
      { target: "city", key: "legitimacy", delta: -6 },
      { target: "institution", inst: "polity", lever: "voting", delta: 4 },
    ],
  },
  {
    id: "crime-spike",
    name: "Crime Spike",
    text: "Public fear rises; disorder spikes in low-income districts.",
    category: "order",
    templates: NEWS_TEMPLATES.order,
    effects: [
      { target: "city", key: "disorder", delta: 10 },
      { target: "district", where: "income_low", key: "risk", delta: 6 },
      { target: "institution", inst: "justice", lever: "policing", delta: 4 },
    ],
  },
  {
    id: "federal-grant",
    name: "Federal Grant",
    text: "A grant boosts capacity and gives breathing room in the budget.",
    category: "bureaucracy",
    templates: NEWS_TEMPLATES.bureaucracy,
    effects: [
      { target: "city", key: "capacity", delta: 6 },
      { target: "city", key: "budget", delta: 20 },
    ],
  },
  {
    id: "platform-shakeup",
    name: "Platform Shakeup",
    text: "A media platform faces scrutiny. Legitimacy rebounds slightly.",
    category: "bureaucracy",
    templates: NEWS_TEMPLATES.bureaucracy,
    effects: [
      { target: "institution", inst: "media", lever: "platformReg", delta: 5 },
      { target: "city", key: "legitimacy", delta: 4 },
    ],
  },
  {
    id: "housing-rights",
    name: "Housing Rights Ruling",
    text: "Courts mandate housing protections for vulnerable residents.",
    category: "housing",
    templates: NEWS_TEMPLATES.housing,
    effects: [
      { target: "institution", inst: "housing", lever: "publicHousing", delta: 5 },
      { target: "city", key: "legitimacy", delta: 3 },
      { target: "city", key: "burden", delta: -4 },
    ],
  },
  {
    id: "hospital-overload",
    name: "Hospital Overload",
    text: "Hospitals are strained; wellbeing slips.",
    category: "health",
    templates: NEWS_TEMPLATES.order,
    effects: [
      { target: "institution", inst: "health", lever: "publicHealth", delta: -6 },
      { target: "group", group: "Working", key: "wellbeing", delta: -6 },
      { target: "group", group: "Marginalized", key: "wellbeing", delta: -6 },
    ],
  },
  {
    id: "committee-loop",
    name: "Committee Loop",
    text: "A task force forms to evaluate the last task force.",
    category: "bureaucracy",
    templates: NEWS_TEMPLATES.bureaucracy,
    effects: [
      { target: "city", key: "capacity", delta: 2 },
      { target: "city", key: "legitimacy", delta: -2 },
    ],
  },
];

export const WHIMSY_EVENTS = [
  {
    id: "viral-dance",
    name: "Viral Dance Craze",
    text: "City productivity dipped as synchronized dancing peaked.",
    category: "whimsy",
    templates: NEWS_TEMPLATES.whimsy,
    effects: [
      { target: "city", key: "cohesion", delta: 5 },
      { target: "city", key: "growth", delta: -2 },
    ],
  },
  {
    id: "celebrity-downtown",
    name: "Celebrity Moves Downtown",
    text: "Star power illuminated downtown and property values.",
    category: "whimsy",
    templates: NEWS_TEMPLATES.whimsy,
    effects: [
      { target: "city", key: "growth", delta: 4 },
      { target: "district", where: "access_high", key: "housingCost", delta: 6 },
    ],
  },
  {
    id: "innovation-hub",
    name: "Innovation Hub Rebrand",
    text: "Residents asked whether branding counts as infrastructure.",
    category: "whimsy",
    templates: NEWS_TEMPLATES.whimsy,
    effects: [
      { target: "city", key: "growth", delta: 6 },
      { target: "city", key: "legitimacy", delta: -2 },
    ],
  },
  {
    id: "police-tiktok",
    name: "Police Department Launches TikTok",
    text: "Community engagement rose, along with secondhand embarrassment.",
    category: "whimsy",
    templates: NEWS_TEMPLATES.whimsy,
    effects: [
      { target: "city", key: "legitimacy", randomDelta: [-4, 4] },
      { target: "city", key: "cohesion", delta: 2 },
    ],
  },
  {
    id: "climbing-wall",
    name: "University Builds Climbing Wall",
    text: "Students gained recreation access and continued housing insecurity.",
    category: "whimsy",
    templates: NEWS_TEMPLATES.whimsy,
    effects: [
      { target: "city", key: "capacity", delta: 2 },
      { target: "city", key: "strain", delta: 4 },
    ],
  },
];

export const SCENARIOS = {
  default: {
    key: "default",
    label: "Baseline",
    description: "Balanced starting point.",
    metricAdjust: {},
    incomeWeights: [0.33, 0.45, 0.22],
    districtAdjust: { housingCost: 0, cohesion: 0, risk: 0 },
  },
  industrial: {
    key: "industrial",
    label: "Industrial takeoff",
    description: "Growth-first city with early strain.",
    metricAdjust: { growth: 10, cohesion: -6, strain: 8 },
    incomeWeights: [0.45, 0.4, 0.15],
    districtAdjust: { housingCost: 5, cohesion: -4, risk: 5 },
  },
  segregated: {
    key: "segregated",
    label: "Segregated growth",
    description: "High inequality and uneven access.",
    metricAdjust: { inequality: 12, cohesion: -8, legitimacy: -5 },
    incomeWeights: [0.5, 0.3, 0.2],
    districtAdjust: { housingCost: 6, cohesion: -6, risk: 4 },
  },
  recovery: {
    key: "recovery",
    label: "Post-crisis recovery",
    description: "Low growth, high strain, but rebuilding cohesion.",
    metricAdjust: { growth: -8, strain: 10, cohesion: 6 },
    incomeWeights: [0.4, 0.45, 0.15],
    districtAdjust: { housingCost: -4, cohesion: 4, risk: 2 },
  },
};
export function createRng(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function createState({ seed, scenarioKey, rng }) {
  const scenario = SCENARIOS[scenarioKey] ?? SCENARIOS.default;
  const state = {
    seed,
    scenarioKey: scenario.key,
    turn: 1,
    year: 1,
    stage: 1,
    baseBudget: 100,
    budget: 100,
    districts: [],
    groups: structuredClone(GROUPS),
    institutions: structuredClone(INSTITUTIONS),
    tokens: [],
    tokenId: 1,
    placementsThisTurn: 0,
    shocks: makeShockMap(),
    pendingEffects: [],
    lastEvent: null,
    lastEventCategory: null,
    metrics: {
      growth: 30,
      strain: 20,
      legitimacy: 60,
      cohesion: 60,
      capacity: 50,
      inequality: 40,
      disorder: 30,
      resilience: 50,
      mobility: 50,
      capture: 40,
      burden: 40,
      contestation: 40,
    },
    news: [],
    history: [],
    stageTransitions: [],
    lastMetricDeltas: {},
    lastGroupDeltas: {},
    lastDistrictDeltas: {},
    lastDistrictDrivers: {},
    lastHousingDelta: 0,
    lastSummary: null,
    lastStageChange: null,
    lastQuoteTurn: 0,
    bureaucracyCount: 0,
    endgame: null,
    achievements: [],
    crisisStreak: 0,
    activeCrisis: null,
  };

  initDistricts(state, rng, scenario);
  applyScenario(state, scenario, rng);
  computeMetrics(state);
  resetBudget(state);
  addNews(state, "Simulation begins. Shape growth without tearing the city apart.");
  return state;
}

export function step(state, rng, actions) {
  const policyIds = actions?.policyIds ?? [];
  const before = captureSnapshot(state);
  const beforeDistricts = snapshotDistricts(state.districts);

  applyPolicies(state, policyIds, rng);
  processPendingEffects(state);
  maybeTriggerEvent(state, rng);
  computeMetrics(state);
  computeDistricts(state);
  computeGroupOutcomes(state);
  computeMetrics(state);
  handleCrisisCascade(state);
  checkStageProgression(state);
  decayShocks(state);
  resetBudget(state);
  state.placementsThisTurn = 0;

  const after = captureSnapshot(state);
  computeDeltas(state, before, after, beforeDistricts);
  const summary = summarizeTurn(state);
  state.lastSummary = summary;
  addNews(state, { kind: "summary", text: `Turn summary: ${summary.funcLine} ${summary.confLine}` });
  addInterpretations(state);
  addInterpretiveLine(state, rng);
  maybeAddCivicQuote(state, rng);
  checkEndgame(state);

  state.history.push({
    turn: state.turn,
    year: state.year,
    stage: state.stage,
    policies: policyIds,
    event: state.lastEvent ? state.lastEvent.id : null,
    eventCategory: state.lastEventCategory,
    metrics: { ...state.metrics },
    groups: structuredClone(state.groups),
  });

  state.turn += 1;
  state.year += 1;
  return state;
}

export function placeToken(state, tokenType, districtId) {
  const token = TOKEN_TYPES[tokenType];
  if (!token) {
    return { ok: false, message: "Unknown token." };
  }
  if (state.placementsThisTurn >= MAX_TOKENS_PER_TURN) {
    return { ok: false, message: "Placement limit reached." };
  }
  if (state.budget < token.cost) {
    return { ok: false, message: "Insufficient budget." };
  }
  const district = state.districts.find((d) => d.id === districtId);
  if (!district) {
    return { ok: false, message: "District not found." };
  }

  const placement = {
    id: state.tokenId++,
    type: tokenType,
    x: district.x,
    y: district.y,
  };
  state.tokens.push(placement);
  district.tokens.push(tokenType);
  state.budget = Math.max(0, state.budget - token.cost);
  state.placementsThisTurn += 1;
  addNews(state, `Placement: ${token.label} opened in district (${district.x + 1}, ${district.y + 1}).`);
  return { ok: true, message: "Placed." };
}

export function applyEffects(state, effects, rng) {
  effects.forEach((effect) => applyEffect(state, effect, rng));
}

export function computeMetrics(state) {
  const stage = STAGES.find((s) => s.id === state.stage);
  const active = activeInstitutions(state);
  const capacityValues = active.map((key) => institutionCapacity(state.institutions[key]));
  const capacityBase = average(capacityValues);
  const stageBoost = stage.id * 3;
  state.metrics.capacity = clamp(capacityBase + stageBoost + state.shocks.capacity);

  const economy = state.institutions.economy.levers;
  const education = state.institutions.education.levers;
  const finance = state.institutions.finance?.levers.deregulation ?? 50;
  const productivity = (economy.wage + education.funding + finance) / 3;

  const inequalityBase = computeInequality(state);
  state.metrics.inequality = clamp(inequalityBase + state.shocks.inequality);

  const cohesionBase = average(state.districts.map((d) => d.cohesion));
  state.metrics.cohesion = clamp(cohesionBase + state.shocks.cohesion);

  const growthBase = 25 + productivity * 0.4 + state.metrics.capacity * 0.2 - state.metrics.inequality * 0.1;
  const stagePressure = state.stage === 4 ? 6 : 0;
  state.metrics.growth = clamp(growthBase + stagePressure + state.shocks.growth);

  const strainBase = state.metrics.growth * 0.5 + state.metrics.inequality * 0.4 - state.metrics.cohesion * 0.3;
  state.metrics.strain = clamp(strainBase + state.shocks.strain);

  const avgGrievance = average(Object.values(state.groups).map((g) => g.grievance));
  state.metrics.legitimacy = clamp(50 + state.metrics.cohesion * 0.4 + state.metrics.capacity * 0.2 - avgGrievance * 0.4 + state.shocks.legitimacy);

  state.metrics.disorder = clamp(state.metrics.strain + avgGrievance * 0.3 - state.metrics.cohesion * 0.3 + state.shocks.disorder);
  state.metrics.resilience = clamp((state.metrics.capacity + state.metrics.cohesion) * 0.5 - state.metrics.inequality * 0.2 + state.shocks.resilience);

  const housingCostAvg = average(state.districts.map((d) => d.housingCost));
  const educationFunding = state.institutions.education.levers.funding;
  state.metrics.mobility = clamp(50 + educationFunding * 0.2 - housingCostAvg * 0.3 - state.metrics.inequality * 0.2 + state.shocks.mobility);

  const eliteInfluence = state.groups.Elite.influence;
  const othersInfluence = average([state.groups.Middle.influence, state.groups.Working.influence, state.groups.Marginalized.influence]);
  state.metrics.capture = clamp((eliteInfluence - othersInfluence) + (50 - state.institutions.polity.levers.antiCorruption) * 0.4 + state.shocks.capture);

  const workingRisk = average(
    state.districts.filter((d) => d.incomeTier === 0).map((d) => d.risk)
  );
  const marginalizedRisk = average(
    state.districts.filter((d) => d.incomeTier === 0).map((d) => d.risk)
  );
  const welfare = state.institutions.welfare?.levers.generosity ?? 50;
  state.metrics.burden = clamp((workingRisk + marginalizedRisk) * 0.3 + housingCostAvg * 0.3 - welfare * 0.2 + state.shocks.burden);

  state.metrics.contestation = clamp(state.metrics.inequality * 0.4 + avgGrievance * 0.4 - state.metrics.legitimacy * 0.2 + state.shocks.contestation);
}

export function computeDistricts(state) {
  const inst = state.institutions;
  const capacity = state.metrics.capacity;
  const education = inst.education?.levers.funding ?? 50;
  const health = inst.health?.levers.publicHealth ?? 50;
  const housing = inst.housing?.levers.zoning ?? 50;
  const family = inst.family?.levers.childcare ?? 50;
  const welfare = inst.welfare?.levers.generosity ?? 50;
  const policing = inst.justice?.levers.policing ?? 50;

  state.districts.forEach((district) => {
    const placementBoost = computeTokenInfluence(state, district);
    district.access = clamp(capacity + district.accessBias + (education - 50) * 0.3 + placementBoost.access);
    district.housingCost = clamp(
      district.housingCost + state.metrics.growth * 0.05 + district.access * 0.03 - (housing - 50) * 0.2 + placementBoost.housingCost
    );
    district.risk = clamp(
      district.risk + state.metrics.strain * 0.05 + (policing - 50) * 0.08 - (welfare - 50) * 0.15 + district.riskBias * 0.1 + placementBoost.risk
    );
    district.cohesion = clamp(
      district.cohesion + (family - 50) * 0.15 + (education - 50) * 0.1 - state.metrics.inequality * 0.05 - district.risk * 0.03 + placementBoost.cohesion
    );
    const populationChange = state.metrics.growth * 0.1 + district.access * 0.05 - district.housingCost * 0.08;
    district.populationValue = clamp(district.populationValue + populationChange, 0, 100);

    if (district.housingCost > 70 && district.access > 60) {
      district.incomeTier = 2;
    } else if (district.housingCost < 40) {
      district.incomeTier = 0;
    } else {
      district.incomeTier = 1;
    }

    if (district.populationValue > 75) {
      district.devLevel = 3;
    } else if (district.populationValue > 50) {
      district.devLevel = 2;
    } else {
      district.devLevel = 1;
    }

    updateNickname(state, district);

    district.lastDrivers = explainDistrictDrivers(state, district, placementBoost, {
      education,
      housing,
      welfare,
      policing,
      family,
      health,
    });
  });
}

export function computeGroupOutcomes(state) {
  const inst = state.institutions;
  const economy = inst.economy.levers;
  const polity = inst.polity.levers;
  const health = inst.health?.levers.publicHealth ?? 50;
  const welfare = inst.welfare?.levers.generosity ?? 50;
  const housingCostAvg = average(state.districts.map((d) => d.housingCost));
  const riskAvg = average(state.districts.map((d) => d.risk));

  const elite = state.groups.Elite;
  const middle = state.groups.Middle;
  const working = state.groups.Working;
  const marginalized = state.groups.Marginalized;

  elite.income = clamp(elite.income + (50 - economy.tax) * 0.1 + (economy.wage - 50) * -0.05);
  working.income = clamp(working.income + (economy.wage - 50) * 0.2 - (economy.tax - 50) * 0.05);
  marginalized.income = clamp(marginalized.income + (economy.wage - 50) * 0.15 - (economy.tax - 50) * 0.04);
  middle.income = clamp(middle.income + (economy.wage - 50) * 0.1 - (economy.tax - 50) * 0.02);

  const wellbeingShock = (health - 50) * 0.2 + (welfare - 50) * 0.15 - (housingCostAvg - 50) * 0.15 - (riskAvg - 50) * 0.2;
  working.wellbeing = clamp(working.wellbeing + wellbeingShock * 0.9);
  marginalized.wellbeing = clamp(marginalized.wellbeing + wellbeingShock);
  middle.wellbeing = clamp(middle.wellbeing + wellbeingShock * 0.6);
  elite.wellbeing = clamp(elite.wellbeing + wellbeingShock * 0.3);

  elite.influence = clamp(elite.influence + (polity.antiCorruption - 50) * -0.1 + (polity.voting - 50) * -0.05);
  middle.influence = clamp(middle.influence + (polity.voting - 50) * 0.2);
  working.influence = clamp(working.influence + (polity.voting - 50) * 0.15);
  marginalized.influence = clamp(marginalized.influence + (polity.voting - 50) * 0.1);

  const grievanceBase = (state.metrics.inequality - 50) * 0.2 + (state.metrics.disorder - 50) * 0.1;
  working.grievance = clamp(working.grievance + grievanceBase - wellbeingShock * 0.2);
  marginalized.grievance = clamp(marginalized.grievance + grievanceBase * 1.2 - wellbeingShock * 0.15);
  middle.grievance = clamp(middle.grievance + grievanceBase * 0.6 - wellbeingShock * 0.2);
  elite.grievance = clamp(elite.grievance + (economy.tax - 50) * 0.1 - (polity.antiCorruption - 50) * 0.05);
}
function makeShockMap() {
  return {
    growth: 0,
    strain: 0,
    legitimacy: 0,
    cohesion: 0,
    capacity: 0,
    inequality: 0,
    disorder: 0,
    resilience: 0,
    mobility: 0,
    capture: 0,
    burden: 0,
    contestation: 0,
    budget: 0,
  };
}

function initDistricts(state, rng, scenario) {
  state.districts = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i += 1) {
    const accessBias = randBetween(rng, -15, 15);
    const riskBias = randBetween(rng, -10, 20);
    const populationValue = randBetween(rng, 30, 60);
    const housingCost = randBetween(rng, 30, 60);
    const cohesion = randBetween(rng, 45, 70);
    const incomeTier = pickWeighted(rng, scenario.incomeWeights);
    const x = i % GRID_SIZE;
    const y = Math.floor(i / GRID_SIZE);
    state.districts.push({
      id: i,
      x,
      y,
      accessBias,
      riskBias,
      populationValue,
      housingCost,
      cohesion,
      incomeTier,
      access: 50,
      risk: 40,
      devLevel: 1,
      tokens: [],
      nickname: null,
      nicknameCategory: null,
      lastDrivers: [],
    });
  }
}

function applyScenario(state, scenario, rng) {
  Object.entries(scenario.metricAdjust).forEach(([key, value]) => {
    state.metrics[key] = clamp(state.metrics[key] + value);
  });

  state.districts.forEach((district) => {
    district.housingCost = clamp(district.housingCost + scenario.districtAdjust.housingCost);
    district.cohesion = clamp(district.cohesion + scenario.districtAdjust.cohesion);
    district.risk = clamp(district.risk + scenario.districtAdjust.risk);
    district.incomeTier = pickWeighted(rng, scenario.incomeWeights);
  });
}

function activeInstitutions(state) {
  const stage = STAGES.find((s) => s.id === state.stage);
  return stage ? stage.institutions : STAGES[0].institutions;
}

function institutionCapacity(inst) {
  const values = Object.values(inst.levers);
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function computeTokenInfluence(state, district) {
  const influence = { access: 0, risk: 0, cohesion: 0, housingCost: 0 };
  state.tokens.forEach((placement) => {
    const config = TOKEN_TYPES[placement.type];
    if (!config) return;
    const dist = Math.abs(district.x - placement.x) + Math.abs(district.y - placement.y);
    if (dist > config.radius) return;
    const weight = 1 - dist / (config.radius + 1);
    Object.entries(config.effects).forEach(([key, value]) => {
      influence[key] += value * weight;
    });
  });
  return influence;
}

function explainDistrictDrivers(state, district, placementBoost, context) {
  const drivers = [];
  if (Math.abs(placementBoost.access) > 1 || Math.abs(placementBoost.cohesion) > 1 || Math.abs(placementBoost.risk) > 1) {
    drivers.push("Nearby institutions shifted access, cohesion, or risk.");
  }
  if (state.metrics.growth > 60) {
    drivers.push("High growth increased housing pressure.");
  }
  if (state.metrics.strain > 60) {
    drivers.push("High strain elevated local risk.");
  }
  if (context.housing > 55) {
    drivers.push("Housing policy eased cost growth.");
  }
  if (context.welfare > 55) {
    drivers.push("Welfare investment reduced exposure.");
  }
  if (context.education > 55) {
    drivers.push("Education investment raised access and cohesion.");
  }
  if (drivers.length === 0) {
    drivers.push("Gradual shifts from growth, strain, and policy settings.");
  }
  return drivers.slice(0, 3);
}

function updateNickname(state, district) {
  if (district.nickname && district.nicknameCategory) {
    const rule = NICKNAME_RULES.find((entry) => entry.category === district.nicknameCategory);
    if (rule && !rule.retain(district, state)) {
      district.nickname = null;
      district.nicknameCategory = null;
    } else {
      return;
    }
  }

  if (district.nickname) return;
  for (const rule of NICKNAME_RULES) {
    if (rule.condition(district, state)) {
      const index = (state.seed + district.id) % rule.names.length;
      district.nickname = rule.names[index];
      district.nicknameCategory = rule.category;
      break;
    }
  }
}

function applyPolicies(state, policyIds, rng) {
  const selected = POLICY_CARDS.filter((card) => policyIds.includes(card.id));
  selected.forEach((card) => {
    card.effects.forEach((effect) => applyEffect(state, effect, rng));
    addNews(state, { kind: "policy", cardId: card.id, text: `Policy enacted: ${card.name}.` });
  });
}

function applyEffect(state, effect, rng) {
  let resolved = effect;
  if (effect.randomDelta) {
    const deltaValue = rng ? randBetween(rng, effect.randomDelta[0], effect.randomDelta[1]) : 0;
    resolved = { ...effect, delta: deltaValue, randomDelta: null };
  }
  if (resolved.delay && resolved.delay > 0) {
    state.pendingEffects.push({ turns: resolved.delay, effect: resolved });
    return;
  }

  if (resolved.target === "city") {
    state.shocks[resolved.key] = clamp(state.shocks[resolved.key] + resolved.delta, -50, 50);
    return;
  }

  if (resolved.target === "institution") {
    const inst = state.institutions[resolved.inst];
    if (!inst) return;
    inst.levers[resolved.lever] = clamp(inst.levers[resolved.lever] + resolved.delta, 0, 100);
    return;
  }

  if (resolved.target === "group") {
    const group = state.groups[resolved.group];
    if (!group) return;
    group[resolved.key] = clamp(group[resolved.key] + resolved.delta, 0, 100);
    return;
  }

  if (resolved.target === "district") {
    state.districts.forEach((district) => {
      if (!districtMatches(district, resolved.where)) return;
      district[resolved.key] = clamp(district[resolved.key] + resolved.delta, 0, 100);
    });
  }
}

function districtMatches(district, where) {
  if (!where) return true;
  if (where === "income_low") return district.incomeTier === 0;
  if (where === "income_mid") return district.incomeTier === 1;
  if (where === "income_high") return district.incomeTier === 2;
  if (where === "access_high") return district.access >= 60;
  if (where === "access_low") return district.access <= 40;
  return true;
}

function processPendingEffects(state) {
  const remaining = [];
  state.pendingEffects.forEach((item) => {
    const nextTurns = item.turns - 1;
    if (nextTurns <= 0) {
      applyEffect(state, { ...item.effect, delay: 0 });
    } else {
      remaining.push({ turns: nextTurns, effect: item.effect });
    }
  });
  state.pendingEffects = remaining;
}
function maybeTriggerEvent(state, rng) {
  if (rng() > EVENT_CHANCE) {
    state.lastEvent = null;
    state.lastEventCategory = null;
    return;
  }

  let event = null;
  if (rng() < WHIMSY_EVENT_CHANCE) {
    event = pickRandom(rng, WHIMSY_EVENTS);
  } else if (rng() < EXOGENOUS_EVENT_CHANCE) {
    event = pickRandom(rng, EVENTS);
  } else {
    event = selectWeightedEvent(state, rng);
  }

  state.lastEvent = event;
  state.lastEventCategory = event ? event.category : null;
  if (!event) return;
  event.effects.forEach((effect) => applyEffect(state, effect, rng));
  if (event.category === "bureaucracy") {
    state.bureaucracyCount += 1;
  }
  addNews(state, {
    kind: "event",
    eventId: event.id,
    category: event.category,
    templates: event.templates,
    label: event.name,
    fallback: `Event: ${event.name}. ${event.text}`,
    pick: Math.floor(rng() * 1000),
  });
  maybeAddMediaHeadlines(state, rng);
}

function selectWeightedEvent(state, rng) {
  const weights = EVENTS.map((event) => ({
    event,
    weight: computeEventWeight(state, event.id),
  })).filter((item) => item.weight > 0);

  if (!weights.length) return pickRandom(rng, EVENTS);
  const total = weights.reduce((sum, item) => sum + item.weight, 0);
  let roll = rng() * total;
  for (const item of weights) {
    roll -= item.weight;
    if (roll <= 0) return item.event;
  }
  return weights[weights.length - 1].event;
}

function computeEventWeight(state, eventId) {
  const housingCostAvg = average(state.districts.map((d) => d.housingCost));
  const avgGrievance = average(Object.values(state.groups).map((g) => g.grievance));
  const base = 1.0;

  switch (eventId) {
    case "housing-bubble":
      return base + (housingCostAvg > 60 ? 3 : 0);
    case "protest-wave":
      return base + (state.metrics.legitimacy < 45 && avgGrievance > 55 ? 4 : 0);
    case "crime-spike":
      return base + (state.metrics.strain > 60 ? 3 : 0);
    case "plant-closure":
      return base + (state.metrics.growth > 60 ? 2 : 0);
    case "teacher-strike":
      return base + (state.metrics.cohesion < 50 ? 2 : 0);
    case "wildfire":
      return base + (state.metrics.strain > 55 ? 2 : 0);
    case "viral-scandal":
      return base + (state.metrics.capture > 55 ? 2 : 0);
    case "tech-boom":
      return base + (state.metrics.growth < 50 ? 1 : 0);
    default:
      return base;
  }
}

function maybeAddMediaHeadlines(state) {
  const mediaPublicInfo = state.institutions.media?.levers.publicInfo ?? 50;
  const fragmentation = clamp(50 + (state.metrics.capture - 50) * 0.5 + (50 - mediaPublicInfo) * 0.6);
  if (fragmentation < 60) return;
  const headlines = MEDIA_HEADLINES[state.lastEventCategory];
  if (!headlines) return;
  addNews(state, { kind: "headlines", headlines, category: state.lastEventCategory });
}
function handleCrisisCascade(state) {
  const crisisCondition = state.metrics.growth > 65 && state.metrics.capacity < 45;
  state.crisisStreak = crisisCondition ? state.crisisStreak + 1 : 0;

  if (state.crisisStreak >= 2 && !state.activeCrisis) {
    state.activeCrisis = { turnsLeft: 3 };
    addNews(state, "Crisis cascade: rapid growth outpaced institutional capacity.");
    state.shocks.legitimacy -= 6;
    state.shocks.strain += 6;
  }

  if (state.activeCrisis) {
    state.shocks.legitimacy -= 4;
    state.shocks.strain += 4;
    state.activeCrisis.turnsLeft -= 1;
    if (state.activeCrisis.turnsLeft <= 0) {
      state.activeCrisis = null;
    }
  }
}

function checkStageProgression(state) {
  const current = STAGES.find((s) => s.id === state.stage);
  if (!current) return;
  const next = STAGES.find((s) => s.id === state.stage + 1);
  if (!next) return;
  const ready = state.metrics.growth >= next.growthMin && state.metrics.capacity >= next.readinessMin;
  if (!ready) return;

  state.stage += 1;
  const unlocked = next.institutions.filter((inst) => !current.institutions.includes(inst));
  state.lastStageChange = {
    from: current.id,
    to: next.id,
    name: next.name,
    unlocked,
    turn: state.turn,
  };
  state.stageTransitions.push({ turn: state.turn, stage: next.id, unlocked });
  addNews(state, `Stage shift: ${next.name}. New institutions: ${unlocked.map((i) => INSTITUTIONS[i].label).join(", ")}.`);

  if (state.metrics.inequality > 65 || state.metrics.capacity < 50) {
    addNews(state, "Crisis triggered: the city advances but institutions lag.");
    state.shocks.strain += 8;
    state.shocks.legitimacy -= 6;
  }
}

function computeInequality(state) {
  const incomes = Object.values(state.groups).map((g) => g.income);
  const diff = Math.max(...incomes) - Math.min(...incomes);
  const tiers = state.districts.map((d) => d.incomeTier);
  const tierAvg = average(tiers);
  const tierVariance = average(tiers.map((t) => (t - tierAvg) ** 2));
  return clamp(diff * 0.7 + tierVariance * 30);
}

function resetBudget(state) {
  const tax = state.institutions.economy.levers.tax;
  const growth = state.metrics.growth;
  const baseNoShock = state.baseBudget + (tax - 50) * 0.4 + growth * 0.3;
  const base = baseNoShock + state.shocks.budget;
  if (state.shocks.budget < 0) {
    console.assert(base <= baseNoShock, "Negative budget shock should reduce budget.");
  }
  state.budget = clamp(Math.round(base), 40, 200);
  state.shocks.budget = 0;
}

function decayShocks(state) {
  Object.keys(state.shocks).forEach((key) => {
    state.shocks[key] = state.shocks[key] * 0.6;
  });
}
function captureSnapshot(state) {
  return {
    metrics: { ...state.metrics },
    groups: structuredClone(state.groups),
  };
}

function snapshotDistricts(districts) {
  return districts.map((d) => ({
    id: d.id,
    access: d.access,
    housingCost: d.housingCost,
    risk: d.risk,
    cohesion: d.cohesion,
    populationValue: d.populationValue,
    devLevel: d.devLevel,
  }));
}

function computeDeltas(state, before, after, beforeDistricts) {
  const metricDeltas = {};
  Object.keys(before.metrics).forEach((key) => {
    metricDeltas[key] = (after.metrics[key] ?? 0) - (before.metrics[key] ?? 0);
  });
  state.lastMetricDeltas = metricDeltas;

  const groupDeltas = {};
  Object.keys(before.groups).forEach((key) => {
    const beforeGroup = before.groups[key];
    const afterGroup = after.groups[key];
    groupDeltas[key] = {
      income: afterGroup.income - beforeGroup.income,
      wellbeing: afterGroup.wellbeing - beforeGroup.wellbeing,
      influence: afterGroup.influence - beforeGroup.influence,
      grievance: afterGroup.grievance - beforeGroup.grievance,
    };
  });
  state.lastGroupDeltas = groupDeltas;

  const districtDeltas = {};
  const districtDrivers = {};
  let housingSum = 0;
  let housingBeforeSum = 0;
  state.districts.forEach((district) => {
    const beforeDistrict = beforeDistricts.find((d) => d.id === district.id);
    if (!beforeDistrict) return;
    housingSum += district.housingCost;
    housingBeforeSum += beforeDistrict.housingCost;
    districtDeltas[district.id] = {
      access: district.access - beforeDistrict.access,
      housingCost: district.housingCost - beforeDistrict.housingCost,
      risk: district.risk - beforeDistrict.risk,
      cohesion: district.cohesion - beforeDistrict.cohesion,
      populationValue: district.populationValue - beforeDistrict.populationValue,
      devLevel: district.devLevel - beforeDistrict.devLevel,
    };
    districtDrivers[district.id] = district.lastDrivers || [];
  });
  state.lastDistrictDeltas = districtDeltas;
  state.lastDistrictDrivers = districtDrivers;
  if (state.districts.length > 0) {
    state.lastHousingDelta = (housingSum - housingBeforeSum) / state.districts.length;
  }
}
function summarizeTurn(state) {
  const metricDeltas = state.lastMetricDeltas;
  const groupDeltas = state.lastGroupDeltas;
  const metricFocus = ["cohesion", "inequality", "legitimacy", "strain", "burden", "growth"];
  const metricChanges = metricFocus.map((key) => ({ key, delta: metricDeltas[key] ?? 0 }));
  metricChanges.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

  const groupScores = Object.entries(groupDeltas).map(([group, deltas]) => {
    const score = deltas.income * 0.4 + deltas.wellbeing * 0.6 - deltas.grievance * 0.5;
    return { group, score, deltas };
  });
  groupScores.sort((a, b) => b.score - a.score);

  const topMetric = metricChanges[0];
  const secondMetric = metricChanges[1];

  const funcLine = `Cohesion ${signWord(metricDeltas.cohesion)} and legitimacy ${signWord(metricDeltas.legitimacy)}.`;
  const confLine = `Inequality ${signWord(metricDeltas.inequality)} and group burden ${signWord(metricDeltas.burden)}.`;

  const prompt = diagnosticPrompt(state.metrics);

  return {
    metricChanges,
    groupScores,
    funcLine,
    confLine,
    headline: `Biggest shift: ${formatMetricChange(topMetric)}; next: ${formatMetricChange(secondMetric)}.`,
    prompt,
  };
}

function addInterpretations(state) {
  const metricDeltas = state.lastMetricDeltas;
  const funcFocus = pickTopChanges(metricDeltas, ["cohesion", "disorder", "capacity", "legitimacy"]);
  const confFocus = pickTopChanges(metricDeltas, ["inequality", "burden", "capture", "contestation"]);

  const funcLine = `Functionalist read: ${formatInterpretation(funcFocus)}.`;
  const confLine = `Conflict read: ${formatInterpretation(confFocus)}.`;
  addNews(state, funcLine);
  addNews(state, confLine);
}

function addInterpretiveLine(state, rng) {
  const metricDeltas = state.lastMetricDeltas;
  const candidates = [
    { category: "housing", score: Math.abs(state.lastHousingDelta) },
    { category: "inequality", score: Math.abs(metricDeltas.inequality ?? 0) },
    { category: "order", score: Math.abs(metricDeltas.disorder ?? 0) },
    { category: "education", score: Math.abs(metricDeltas.mobility ?? 0) },
  ];

  if (state.lastEventCategory === "bureaucracy") {
    candidates.push({ category: "bureaucracy", score: 6 });
  }

  candidates.sort((a, b) => b.score - a.score);
  const choice = candidates[0] && candidates[0].score > 0.5 ? candidates[0].category : "bureaucracy";
  const templates = NEWS_TEMPLATES[choice] ?? NEWS_TEMPLATES.inequality;
  addNews(state, {
    kind: "interpretive",
    category: choice,
    templates,
    pick: Math.floor(rng() * 1000),
  });
}

function maybeAddCivicQuote(state, rng) {
  const turnsSince = state.turn - state.lastQuoteTurn;
  if (turnsSince < 2 && rng() < 0.6) return;
  if (turnsSince < 1) return;

  const ideology = pickQuoteIdeology(state);
  const candidates = CIVIC_CHARACTERS.filter((char) => char.ideology === ideology);
  const roster = candidates.length ? candidates : CIVIC_CHARACTERS;
  const character = pickRandom(rng, roster);
  const quote = pickRandom(rng, character.quotes);

  addNews(state, {
    kind: "quote",
    character: {
      id: character.id,
      name: character.name,
      role: character.role,
      ideology: character.ideology,
    },
    quote,
  });
  state.lastQuoteTurn = state.turn;
}

function pickQuoteIdeology(state) {
  if (state.lastEventCategory === "housing") return "growth";
  if (state.lastEventCategory === "inequality") return "equity";
  if (state.lastEventCategory === "order") return "legitimacy";
  if (state.lastEventCategory === "education") return "cohesion";
  if (state.lastEventCategory === "health") return "health";
  if (state.lastEventCategory === "growth") return "growth";
  if (state.metrics.inequality > 60) return "equity";
  if (state.metrics.growth > 65) return "growth";
  if (state.metrics.cohesion < 45) return "cohesion";
  if (state.metrics.strain > 60) return "health";
  return "legitimacy";
}

function checkEndgame(state) {
  if (state.endgame) return;
  if (state.turn < ENDGAME_TURN) return;
  const achievements = evaluateAchievements(state);
  state.achievements = achievements;
  state.endgame = { turn: state.turn, achievements };
  addNews(state, { kind: "achievement", achievements });
}

function evaluateAchievements(state) {
  const achievements = [];
  if (state.metrics.growth >= 80 && state.metrics.inequality >= 70) {
    achievements.push("Growth at All Costs");
  }
  if (state.metrics.disorder <= 30 && state.metrics.legitimacy <= 40) {
    achievements.push("Well-Ordered but Watched");
  }
  if (state.metrics.inequality <= 35) {
    achievements.push("Equity Champion");
  }
  if (state.bureaucracyCount >= 5) {
    achievements.push("Committee of Committees");
  }
  if (state.metrics.growth >= 75 && state.metrics.cohesion <= 40) {
    achievements.push("Golden Skyline, Fractured Streets");
  }
  return achievements;
}

function pickTopChanges(metricDeltas, keys) {
  const items = keys.map((key) => ({ key, delta: metricDeltas[key] ?? 0 }));
  items.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  return items.slice(0, 2);
}

function formatInterpretation(items) {
  return items
    .map((item) => `${capitalize(item.key)} ${directionWord(item.delta)}`)
    .join(" and ");
}

function directionWord(delta) {
  if (delta > 1) return "rose";
  if (delta < -1) return "fell";
  return "held";
}

function signWord(value) {
  if (value > 1) return "rose";
  if (value < -1) return "fell";
  return "held";
}

function formatMetricChange(change) {
  const direction = change.delta > 1 ? "up" : change.delta < -1 ? "down" : "flat";
  return `${capitalize(change.key)} ${direction}`;
}

function diagnosticPrompt(metrics) {
  if (metrics.legitimacy < 40 && metrics.contestation > 60) {
    return "Diagnostic prompt: Is this a failure of integration or a failure of distribution?";
  }
  if (metrics.strain > 65) {
    return "Diagnostic prompt: Which institutions are absorbing strain, and which groups pay the cost?";
  }
  if (metrics.inequality > 65) {
    return "Diagnostic prompt: Are gains concentrated, or is mobility still plausible?";
  }
  return null;
}
function addNews(state, item) {
  const entry = typeof item === "string" ? { kind: "text", text: item } : item;
  const turn = entry.turn ?? state.turn;
  state.news.push({ ...entry, turn });
  if (state.news.length > 60) {
    state.news.shift();
  }
}

function pickRandom(rng, list) {
  return list[Math.floor(rng() * list.length)];
}

function randBetween(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function pickWeighted(rng, weights) {
  const total = weights.reduce((sum, value) => sum + value, 0);
  let roll = rng() * total;
  for (let i = 0; i < weights.length; i += 1) {
    roll -= weights[i];
    if (roll <= 0) return i;
  }
  return weights.length - 1;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function average(values) {
  return values.length === 0 ? 0 : values.reduce((sum, v) => sum + v, 0) / values.length;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
