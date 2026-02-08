import {
  GRID_SIZE,
  MAX_TOKENS_PER_TURN,
  STAGES,
  INSTITUTIONS,
  TOKEN_TYPES,
  POLICY_CARDS,
  SCENARIOS,
  createRng,
  createState,
  step,
  placeToken,
  maxPoliciesForStage,
  loadContent,
} from "./engine.js";

await loadContent();

const els = {
  grid: document.getElementById("grid"),
  policies: document.getElementById("policies"),
  nextTurn: document.getElementById("next-turn"),
  helpOpen: document.getElementById("help-open"),
  newsfeed: document.getElementById("newsfeed"),
  event: document.getElementById("event"),
  citySize: document.getElementById("city-size"),
  cityBudget: document.getElementById("city-budget"),
  publicSupport: document.getElementById("public-support"),
  funcMetrics: document.getElementById("func-metrics"),
  confMetrics: document.getElementById("conf-metrics"),
  stageChip: document.getElementById("stage-chip"),
  turnChip: document.getElementById("turn-chip"),
  budgetChip: document.getElementById("budget-chip"),
  seedChip: document.getElementById("seed-chip"),
  inspector: document.getElementById("inspector"),
  legend: document.getElementById("legend"),
  legendToggle: document.getElementById("legend-toggle"),
  viewButtons: document.querySelectorAll(".view-toggle button"),
  placementList: document.getElementById("placements"),
  placementInfo: document.getElementById("placement-info"),
  turnChecklist: document.getElementById("turn-checklist"),
  coachText: document.getElementById("coach-text"),
  runs: document.getElementById("runs"),
  replaySeed: document.getElementById("replay-seed"),
  summaryModal: document.getElementById("summary-modal"),
  summaryBody: document.getElementById("summary-body"),
  summaryClose: document.getElementById("summary-close"),
  summarySave: document.getElementById("summary-save"),
  seedInput: document.getElementById("seed-input"),
  scenarioSelect: document.getElementById("scenario-select"),
  startSim: document.getElementById("start-sim"),
  policyTags: document.getElementById("policy-tags"),
  policySort: document.getElementById("policy-sort"),
  policyLimitNote: document.getElementById("policy-limit-note"),
  exportJson: document.getElementById("export-json"),
  exportCsv: document.getElementById("export-csv"),
  drawer: document.getElementById("policy-drawer"),
  drawerClose: document.getElementById("drawer-close"),
  drawerBody: document.getElementById("drawer-body"),
  drawerTitle: document.getElementById("drawer-title"),
  stageBanner: document.getElementById("stage-banner"),
  toneSelect: document.getElementById("tone-select"),
  endgameModal: document.getElementById("endgame-modal"),
  endgameBody: document.getElementById("endgame-body"),
  endgameClose: document.getElementById("endgame-close"),
  adminTools: document.getElementById("admin-tools"),
  restartSim: document.getElementById("restart-sim"),
  tabLinks: document.querySelectorAll(".tab-link"),
  tabPanes: document.querySelectorAll(".tab-pane"),
  mobileButtons: document.querySelectorAll(".mobile-btn"),
  mapSection: document.getElementById("map-section"),
  officeSection: document.getElementById("office-section"),
  dilemmaModal: document.getElementById("dilemma-modal"),
  dilemmaTitle: document.getElementById("dilemma-title"),
  dilemmaBody: document.getElementById("dilemma-body"),
  dilemmaChoices: document.getElementById("dilemma-choices"),
  quizModal: document.getElementById("quiz-modal"),
  quizQuestion: document.getElementById("quiz-question"),
  quizChoices: document.getElementById("quiz-choices"),
  quizFeedback: document.getElementById("quiz-feedback"),
  snapshotCanvas: document.getElementById("snapshot-canvas"),
  snapshotDownload: document.getElementById("snapshot-download"),
  snapshotCopy: document.getElementById("snapshot-copy"),
  onboardingModal: document.getElementById("onboarding-modal"),
  onboardingClose: document.getElementById("onboarding-close"),
  onboardingDismiss: document.getElementById("onboarding-dismiss"),
};

const uiState = {
  viewMode: "income",
  selectedPolicies: new Set(),
  activeToken: null,
  hoveredDistrictId: null,
  selectedDistrictId: null,
  activeTags: new Set(),
  policySort: "default",
  stageBannerTurn: null,
  savedRuns: [],
  tone: loadTone(),
  endgameShown: false,
  activeTab: "briefing",
  mobileView: "map",
  pendingQuizPolicyId: null,
  quizUsed: false,
  quizDiscounts: {},
  lastPlacementMessage: null,
  coachMessage: null,
  onboardingOptOut: loadOnboardingOptOut(),
  legendCollapsed: loadLegendCollapsed(),
  legendPrimed: loadLegendPrimed(),
};

const session = {
  initialSeed: resolveSeed(),
  scenarioKey: resolveScenario(),
  adminMode: resolveAdminMode(),
};

let rng = createRng(session.initialSeed);
let state = createState({ seed: session.initialSeed, scenarioKey: session.scenarioKey, rng });

function resolveSeed() {
  const params = new URLSearchParams(window.location.search);
  const seedParam = Number.parseInt(params.get("seed"), 10);
  if (Number.isFinite(seedParam) && seedParam > 0) {
    return seedParam;
  }
  return Math.floor(Math.random() * 1000000) + 1;
}

function resolveScenario() {
  const params = new URLSearchParams(window.location.search);
  const scenarioParam = params.get("scenario");
  if (scenarioParam && SCENARIOS[scenarioParam]) {
    return scenarioParam;
  }
  return "default";
}

function resolveAdminMode() {
  const params = new URLSearchParams(window.location.search);
  const value = (params.get("admin") || "").toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}

function loadTone() {
  const stored = window.localStorage.getItem("fairview-tone");
  if (stored === "academic" || stored === "civic" || stored === "satirical") {
    return stored;
  }
  return "civic";
}

function saveTone(tone) {
  window.localStorage.setItem("fairview-tone", tone);
}

function loadOnboardingOptOut() {
  return window.localStorage.getItem("fairview-onboarding-optout") === "1";
}

function saveOnboardingOptOut(value) {
  window.localStorage.setItem("fairview-onboarding-optout", value ? "1" : "0");
}

function loadLegendCollapsed() {
  return window.localStorage.getItem("fairview-legend-collapsed") === "1";
}

function saveLegendCollapsed(value) {
  window.localStorage.setItem("fairview-legend-collapsed", value ? "1" : "0");
}

function loadLegendPrimed() {
  return window.localStorage.getItem("fairview-legend-primed") === "1";
}

function saveLegendPrimed(value) {
  window.localStorage.setItem("fairview-legend-primed", value ? "1" : "0");
}

function setActiveTab(tabName) {
  uiState.activeTab = tabName;
  els.tabLinks.forEach((link) => {
    const isActive = link.dataset.tab === tabName;
    link.classList.toggle("active", isActive);
    link.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  els.tabPanes.forEach((pane) => {
    const isActive = pane.dataset.tab === tabName;
    pane.classList.toggle("active", isActive);
  });
}

function setMobileView(view) {
  uiState.mobileView = view;
  els.mobileButtons.forEach((button) => {
    const isActive = button.dataset.mobile === view;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
  if (els.mapSection && els.officeSection) {
    els.mapSection.classList.toggle("mobile-hidden", view !== "map");
    els.officeSection.classList.toggle("mobile-hidden", view !== "office");
  }
}

function startSimulation(seed, scenarioKey) {
  rng = createRng(seed);
  state = createState({ seed, scenarioKey, rng });
  uiState.selectedPolicies.clear();
  uiState.activeToken = null;
  uiState.selectedDistrictId = null;
  uiState.hoveredDistrictId = null;
  uiState.stageBannerTurn = null;
  uiState.endgameShown = false;
  uiState.pendingQuizPolicyId = null;
  uiState.quizUsed = false;
  uiState.quizDiscounts = {};
  uiState.lastPlacementMessage = null;
  uiState.coachMessage = null;
  els.nextTurn.disabled = false;
  if (els.endgameModal) {
    els.endgameModal.classList.add("hidden");
  }
  if (els.dilemmaModal) {
    els.dilemmaModal.classList.add("hidden");
  }
  if (els.quizModal) {
    els.quizModal.classList.add("hidden");
  }
  if (els.adminTools) {
    els.adminTools.classList.toggle("hidden", !session.adminMode);
  }
  if (!session.adminMode) {
    uiState.tone = "civic";
  }
  els.seedInput.value = seed;
  els.scenarioSelect.value = scenarioKey;
  render(state);
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function blendColor(start, end, amount) {
  const startRgb = hexToRgb(start);
  const endRgb = hexToRgb(end);
  const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * amount);
  const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * amount);
  const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const bigint = Number.parseInt(value, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function initScenarioSelect() {
  els.scenarioSelect.innerHTML = Object.values(SCENARIOS)
    .map((scenario) => `<option value="${scenario.key}">${scenario.label}</option>`)
    .join("");
  els.scenarioSelect.value = session.scenarioKey;
}

function policyLimit(simState) {
  return maxPoliciesForStage(simState.stage);
}

function devLevelLabel(level) {
  if (level === 3) return "III";
  if (level === 2) return "II";
  if (level === 1) return "I";
  return "0";
}

function densityLabel(district) {
  if (district.devLevel === 0) return "Undeveloped";
  if (district.populationValue > 75) return "High";
  if (district.populationValue > 50) return "Medium";
  return "Low";
}

function incomeTierLabel(tier) {
  if (tier === 0) return "Low";
  if (tier === 1) return "Middle";
  if (tier === 2) return "High";
  return "Unclassified";
}

const NEIGHBORHOOD_CELL_ORDER = [4, 1, 3, 5, 7, 0, 2, 6, 8];
const TOKEN_CELL_ORDER = [0, 2, 6, 8, 4, 1, 3, 5, 7];

function populationCells(district) {
  if (district.devLevel === 0 || district.populationValue <= 0) return 0;
  return Math.max(1, Math.min(9, Math.round((district.populationValue / 100) * 9)));
}

function emptyLotCellSvg(x, y, size, undeveloped = false) {
  const stroke = undeveloped ? "#6f7884" : "#8d94a0";
  const fill = undeveloped ? "none" : "rgba(255,255,255,0.25)";
  const dash = undeveloped ? ' stroke-dasharray="1.6 1.3"' : "";
  return `<rect x="${x + 0.5}" y="${y + 0.5}" width="${size - 1}" height="${size - 1}" rx="1.2" fill="${fill}" stroke="${stroke}" stroke-width="0.8"${dash}></rect>`;
}

function tierPalette(tier) {
  if (tier === 2) {
    return {
      lotFill: "#f6dfda",
      lotStroke: "#9b4b3d",
      roof: "#9b4b3d",
      body: "#fff2ec",
      trim: "#5c2a21",
    };
  }
  if (tier === 1) {
    return {
      lotFill: "#f4e8d0",
      lotStroke: "#8f6a39",
      roof: "#8f6a39",
      body: "#fff8ec",
      trim: "#4f3a1f",
    };
  }
  return {
    lotFill: "#dcebf2",
    lotStroke: "#4f7f8f",
    roof: "#4f7f8f",
    body: "#f2fbff",
    trim: "#24424c",
  };
}

function miniHouseCellSvg(tier, x, y, size) {
  const palette = tierPalette(tier);
  const lot = `<rect x="${x + 0.5}" y="${y + 0.5}" width="${size - 1}" height="${size - 1}" rx="1.2" fill="${palette.lotFill}" stroke="${palette.lotStroke}" stroke-width="0.7"></rect>`;

  if (tier === 2) {
    return `
      ${lot}
      <path d="M${x + size * 0.14} ${y + size * 0.46} L${x + size * 0.5} ${y + size * 0.2} L${x + size * 0.86} ${y + size * 0.46}" fill="${palette.roof}" stroke="${palette.trim}" stroke-width="0.75"></path>
      <rect x="${x + size * 0.24}" y="${y + size * 0.46}" width="${size * 0.52}" height="${size * 0.34}" rx="0.5" fill="${palette.body}" stroke="${palette.trim}" stroke-width="0.75"></rect>
      <rect x="${x + size * 0.42}" y="${y + size * 0.56}" width="${size * 0.16}" height="${size * 0.24}" fill="${palette.trim}"></rect>
      <circle cx="${x + size * 0.68}" cy="${y + size * 0.58}" r="${size * 0.07}" fill="${palette.trim}"></circle>
      <rect x="${x + size * 0.72}" y="${y + size * 0.18}" width="${size * 0.08}" height="${size * 0.16}" fill="${palette.trim}"></rect>
    `;
  }
  if (tier === 1) {
    return `
      ${lot}
      <rect x="${x + size * 0.2}" y="${y + size * 0.28}" width="${size * 0.6}" height="${size * 0.12}" rx="0.4" fill="${palette.roof}"></rect>
      <rect x="${x + size * 0.2}" y="${y + size * 0.4}" width="${size * 0.6}" height="${size * 0.4}" rx="0.5" fill="${palette.body}" stroke="${palette.trim}" stroke-width="0.75"></rect>
      <path d="M${x + size * 0.5} ${y + size * 0.42} V${y + size * 0.78}" stroke="${palette.trim}" stroke-width="0.6"></path>
      <rect x="${x + size * 0.28}" y="${y + size * 0.52}" width="${size * 0.1}" height="${size * 0.1}" fill="${palette.trim}"></rect>
      <rect x="${x + size * 0.62}" y="${y + size * 0.52}" width="${size * 0.1}" height="${size * 0.1}" fill="${palette.trim}"></rect>
    `;
  }
  return `
    ${lot}
    <path d="M${x + size * 0.18} ${y + size * 0.48} L${x + size * 0.5} ${y + size * 0.24} L${x + size * 0.82} ${y + size * 0.48}" fill="${palette.roof}" stroke="${palette.trim}" stroke-width="0.75"></path>
    <rect x="${x + size * 0.24}" y="${y + size * 0.48}" width="${size * 0.52}" height="${size * 0.32}" rx="0.5" fill="${palette.body}" stroke="${palette.trim}" stroke-width="0.75"></rect>
    <rect x="${x + size * 0.44}" y="${y + size * 0.56}" width="${size * 0.12}" height="${size * 0.24}" fill="${palette.trim}"></rect>
  `;
}

function neighborhoodSvgFromCells(tier, occupiedCells, undeveloped = false) {
  const cell = 10;
  const gap = 2;
  const view = 34;
  if (undeveloped) {
    const lots = Array.from({ length: 9 }, (_, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const x = col * (cell + gap);
      const y = row * (cell + gap);
      return emptyLotCellSvg(x, y, cell, true);
    }).join("");
    return `<svg viewBox="0 0 ${view} ${view}" aria-hidden="true">${lots}</svg>`;
  }

  const occupied = Math.max(0, Math.min(9, occupiedCells));
  const occupiedSet = new Set(NEIGHBORHOOD_CELL_ORDER.slice(0, occupied));
  const cells = Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const x = col * (cell + gap);
    const y = row * (cell + gap);
    if (occupiedSet.has(index)) {
      return miniHouseCellSvg(tier, x, y, cell);
    }
    return emptyLotCellSvg(x, y, cell, false);
  }).join("");
  return `<svg viewBox="0 0 ${view} ${view}" aria-hidden="true">${cells}</svg>`;
}

function neighborhoodSvg(district) {
  if (district.devLevel === 0 || district.incomeTier === null) {
    return neighborhoodSvgFromCells(null, 0, true);
  }
  return neighborhoodSvgFromCells(district.incomeTier, populationCells(district), false);
}

function tokenIconSvg(type) {
  if (type === "school") {
    return `
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <rect x="2" y="6" width="12" height="7" rx="1" fill="#3f5e9f"></rect>
        <path d="M2 6 L8 2.2 L14 6" fill="#2a3f6f"></path>
        <rect x="7.1" y="8.5" width="1.8" height="4.5" fill="#dfe7f6"></rect>
      </svg>
    `;
  }
  if (type === "clinic") {
    return `
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="2" fill="#2f7f67"></rect>
        <rect x="7" y="4" width="2" height="8" fill="#ecfff7"></rect>
        <rect x="4" y="7" width="8" height="2" fill="#ecfff7"></rect>
      </svg>
    `;
  }
  if (type === "transit") {
    return `
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <rect x="2" y="3" width="12" height="8" rx="2" fill="#3a6672"></rect>
        <rect x="4" y="5" width="8" height="3" rx="0.8" fill="#d6ebef"></rect>
        <circle cx="5" cy="12.5" r="1.2" fill="#25343a"></circle>
        <circle cx="11" cy="12.5" r="1.2" fill="#25343a"></circle>
      </svg>
    `;
  }
  if (type === "police") {
    return `
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 1.8 L13.5 3.6 L13.5 8.2 C13.5 10.8 11.6 13.2 8 14.4 C4.4 13.2 2.5 10.8 2.5 8.2 L2.5 3.6 Z" fill="#42506a"></path>
        <path d="M8 4.4 L8.9 6.3 L11 6.6 L9.5 8 L9.9 10.1 L8 9.1 L6.1 10.1 L6.5 8 L5 6.6 L7.1 6.3 Z" fill="#eaf0ff"></path>
      </svg>
    `;
  }
  if (type === "community") {
    return `
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="5" cy="5" r="2" fill="#9c7241"></circle>
        <circle cx="11" cy="5.8" r="1.8" fill="#9c7241"></circle>
        <rect x="2.5" y="8" width="5.2" height="5" rx="2" fill="#d9bf96"></rect>
        <rect x="8.2" y="8.2" width="5.2" height="4.8" rx="2" fill="#d9bf96"></rect>
      </svg>
    `;
  }
  return `<span aria-hidden="true">?</span>`;
}

function districtAriaLabel(district) {
  const developed = district.devLevel > 0 ? "developed" : "undeveloped";
  const income = incomeTierLabel(district.incomeTier);
  const density = densityLabel(district);
  return `District ${district.x + 1}, ${district.y + 1}, ${developed}, ${density} population, ${income} income, access ${Math.round(district.access)}.`;
}

function formatCurrency(value) {
  return `$${Math.round(value)}`;
}

function citySize(simState) {
  return simState.districts.filter((district) => district.devLevel > 0).length;
}

function citySizeDelta(simState) {
  let delta = 0;
  simState.districts.forEach((district) => {
    const districtDelta = simState.lastDistrictDeltas[district.id];
    if (!districtDelta || !Number.isFinite(districtDelta.devLevel)) return;
    const beforeDev = district.devLevel - districtDelta.devLevel;
    const wasDeveloped = beforeDev > 0;
    const isDeveloped = district.devLevel > 0;
    if (!wasDeveloped && isDeveloped) delta += 1;
    if (wasDeveloped && !isDeveloped) delta -= 1;
  });
  return delta;
}

function signedNumber(value) {
  const rounded = Math.round(value);
  if (rounded > 0) return `+${rounded}`;
  return `${rounded}`;
}

function setCoachMessage(message) {
  uiState.coachMessage = message;
  renderCoach(state);
}

function clearCoachMessage() {
  uiState.coachMessage = null;
  renderCoach(state);
}

function renderChecklist(simState) {
  if (!els.turnChecklist) return;
  const maxPolicies = policyLimit(simState);
  const policyCount = uiState.selectedPolicies.size;
  const placements = simState.placementsThisTurn;
  const policyStatus = policyCount > 0 ? "done" : "todo";
  const tokenStatus = placements > 0 ? "done" : "optional";
  const nextStatus = policyCount > 0 || placements > 0 ? "ready" : "todo";
  els.turnChecklist.innerHTML = `
    <div class="checklist-item ${policyStatus}">
      <span class="check-state">${policyStatus === "done" ? "Done" : "To do"}</span>
      <span>Policy choice: ${policyCount}/${maxPolicies} selected</span>
    </div>
    <div class="checklist-item ${tokenStatus}">
      <span class="check-state">${tokenStatus === "done" ? "Done" : "Optional"}</span>
      <span>Institution placement: ${placements}/${MAX_TOKENS_PER_TURN}</span>
    </div>
    <div class="checklist-item ${nextStatus}">
      <span class="check-state">${nextStatus === "ready" ? "Ready" : "To do"}</span>
      <span>Press Next Turn to apply your choices</span>
    </div>
  `;
}

function defaultCoachMessage(simState) {
  if (simState.pendingDilemma) {
    return "A dilemma is waiting. Choose a response to continue.";
  }
  if (uiState.activeToken) {
    return "Token selected. Click a developed district (any lot with a colored outline) to place it.";
  }
  const selected = uiState.selectedPolicies.size;
  if (selected === 0) {
    return `Start by choosing up to ${policyLimit(simState)} policy ${policyLimit(simState) === 1 ? "card" : "cards"}, then press Next Turn.`;
  }
  if (simState.placementsThisTurn === 0) {
    return "Optional: place one institution token this turn, then press Next Turn.";
  }
  return "Choices set. Press Next Turn to see outcomes and updates.";
}

function renderCoach(simState) {
  if (!els.coachText) return;
  const message = uiState.coachMessage || defaultCoachMessage(simState);
  els.coachText.textContent = message;
}

function openOnboarding(force = false) {
  if (!els.onboardingModal) return;
  if (!uiState.legendPrimed || force) {
    setLegendCollapsed(false, { persist: false });
  }
  if (!force && uiState.onboardingOptOut) return;
  els.onboardingModal.classList.remove("hidden");
}

function closeOnboarding() {
  if (!els.onboardingModal) return;
  els.onboardingModal.classList.add("hidden");
  if (!uiState.legendPrimed) {
    uiState.legendPrimed = true;
    saveLegendPrimed(true);
    setLegendCollapsed(true);
  }
}

function setLegendCollapsed(value, options = {}) {
  const persist = options.persist ?? true;
  uiState.legendCollapsed = value;
  if (persist) {
    saveLegendCollapsed(value);
  }
  renderLegendVisibility();
}

function renderLegendVisibility() {
  if (els.legend) {
    els.legend.classList.toggle("hidden", uiState.legendCollapsed);
  }
  if (!els.legendToggle) return;
  const expanded = !uiState.legendCollapsed;
  els.legendToggle.textContent = expanded ? "Hide Legend" : "Legend";
  els.legendToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  els.legendToggle.setAttribute("aria-label", expanded ? "Hide legend" : "Show legend");
}

function renderLegend(simState) {
  let legendHtml = "";

  if (uiState.viewMode === "income") {
    legendHtml = `
      <span class="legend-icon">${neighborhoodSvgFromCells(0, 5, false)}</span> low-income neighborhood style
      <span class="legend-icon">${neighborhoodSvgFromCells(1, 5, false)}</span> middle-income neighborhood style
      <span class="legend-icon">${neighborhoodSvgFromCells(2, 5, false)}</span> high-income neighborhood style
      <span class="legend-icon">${neighborhoodSvgFromCells(1, 2, false)}</span> fewer houses = lower population
      <span class="legend-icon">${neighborhoodSvgFromCells(1, 8, false)}</span> more houses = higher population
      <span class="legend-icon">${neighborhoodSvgFromCells(null, 0, true)}</span> undeveloped lots (no class)
      <span class="legend-outline dev-0"></span> gray outline = undeveloped
      <span class="legend-outline dev-1"></span> amber outline = early development
      <span class="legend-outline dev-2"></span> teal outline = growing
      <span class="legend-outline dev-3"></span> blue outline = dense
      <span class="legend-token">${tokenIconSvg("school")}</span> school
      <span class="legend-token">${tokenIconSvg("clinic")}</span> clinic
      <span class="legend-token">${tokenIconSvg("transit")}</span> transit
      <span class="legend-token">${tokenIconSvg("police")}</span> police
      <span class="legend-token">${tokenIconSvg("community")}</span> community
    `;
  } else if (uiState.viewMode === "functionalism") {
    legendHtml = `
      <span class="dot" style="background:#d1e8d5"></span> Weaker city systems
      <span class="dot" style="background:#2f8f6a"></span> Stronger city systems
      <span class="dev-marker">Based on cohesion and disorder</span>
    `;
  } else {
    legendHtml = `
      <span class="dot" style="background:#b8d0c8"></span> Lower pressure
      <span class="dot" style="background:#a63d40"></span> Higher pressure
      <span class="dev-marker">Based on housing cost and risk</span>
    `;
  }

  if (els.legend) {
    els.legend.innerHTML = legendHtml;
  }
  renderLegendVisibility();
}

function tileBackground(simState, district) {
  if (district.devLevel === 0) {
    return "#cad1da";
  }
  if (uiState.viewMode === "functionalism") {
    const integration = clamp(50 + (district.cohesion - simState.metrics.disorder) * 0.5, 0, 100);
    return blendColor("#d1e8d5", "#2f8f6a", integration / 100);
  }
  if (uiState.viewMode === "conflict") {
    const burden = clamp((district.risk + district.housingCost) / 2);
    return blendColor("#b8d0c8", "#a63d40", burden / 100);
  }
  return "#f3ece0";
}

function renderGrid(simState) {
  els.grid.innerHTML = "";
  els.grid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
  simState.districts.forEach((district) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.dataset.id = district.id;
    tile.classList.add(`dev-${district.devLevel}`);
    const tierDelta = simState.lastDistrictDeltas[district.id]?.incomeTier ?? 0;
    if (tierDelta > 0) {
      tile.classList.add("tier-up");
    }
    if (uiState.selectedDistrictId === district.id) {
      tile.classList.add("selected");
    }
    if (district.devLevel === 0) {
      tile.classList.add("undeveloped");
    }
    tile.tabIndex = 0;
    tile.setAttribute("role", "button");
    tile.setAttribute("aria-label", districtAriaLabel(district));

    const density = densityLabel(district);
    const tier = incomeTierLabel(district.incomeTier);
    const devLabel = devLevelLabel(district.devLevel);
    const homes = populationCells(district);
    const nickname = district.nickname ? ` | ${district.nickname}` : "";
    tile.title = `${tier} income | ${homes}/9 homes | ${density} density | Dev ${devLabel}${nickname}`;

    const icons = district.tokens
      .slice(0, 3)
      .map((type, index) => {
        const token = TOKEN_TYPES[type];
        const summary = tokenEffectSummary(type);
        const cellIndex = TOKEN_CELL_ORDER[index] ?? index;
        const col = cellIndex % 3;
        const row = Math.floor(cellIndex / 3);
        return `<span class="token-icon" style="--slot-col:${col}; --slot-row:${row};" title="${token.label}: ${summary}">${tokenIconSvg(type)}</span>`;
      })
      .join(" ");

    tile.style.background = tileBackground(simState, district);
    tile.innerHTML = `
      <div class="symbols">
        <div class="neighborhood">${neighborhoodSvg(district)}</div>
        <div class="icons">${icons}</div>
      </div>
    `;

    tile.addEventListener("mouseenter", () => {
      uiState.hoveredDistrictId = district.id;
      renderInspector(simState);
    });

    tile.addEventListener("mouseleave", () => {
      uiState.hoveredDistrictId = null;
      renderInspector(simState);
    });

    tile.addEventListener("focus", () => {
      uiState.hoveredDistrictId = district.id;
      renderInspector(simState);
    });

    tile.addEventListener("blur", () => {
      uiState.hoveredDistrictId = null;
      renderInspector(simState);
    });

    tile.addEventListener("click", () => {
      handleTileAction(district);
    });

    tile.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleTileAction(district);
      }
    });

    els.grid.appendChild(tile);
  });
}

function handleTileAction(district) {
  if (uiState.activeToken) {
    const result = placeToken(state, uiState.activeToken, district.id);
    if (result.ok) {
      uiState.activeToken = null;
      uiState.lastPlacementMessage = null;
      clearCoachMessage();
      render(state);
      if (result.synergies && result.synergies.length) {
        window.requestAnimationFrame(() => playSynergyEffect(result.synergies));
      }
    } else {
      uiState.lastPlacementMessage = result.message;
      setCoachMessage(result.message);
      renderPlacementPanel(state);
    }
    return;
  }
  uiState.selectedDistrictId = district.id;
  renderGrid(state);
  renderInspector(state);
}

function playSynergyEffect(synergies) {
  if (!els.grid) return;
  const gridRect = els.grid.getBoundingClientRect();
  synergies.forEach((synergy) => {
    const fromTile = els.grid.querySelector(`.tile[data-id="${synergy.fromId}"]`);
    const toTile = els.grid.querySelector(`.tile[data-id="${synergy.toId}"]`);
    if (!fromTile || !toTile) return;
    fromTile.classList.add("synergy");
    toTile.classList.add("synergy");

    const fromRect = fromTile.getBoundingClientRect();
    const toRect = toTile.getBoundingClientRect();
    const x1 = fromRect.left + fromRect.width / 2 - gridRect.left;
    const y1 = fromRect.top + fromRect.height / 2 - gridRect.top;
    const x2 = toRect.left + toRect.width / 2 - gridRect.left;
    const y2 = toRect.top + toRect.height / 2 - gridRect.top;
    const length = Math.hypot(x2 - x1, y2 - y1);
    const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

    const link = document.createElement("div");
    link.className = "synergy-link";
    link.style.width = `${length}px`;
    link.style.left = `${x1}px`;
    link.style.top = `${y1}px`;
    link.style.transform = `rotate(${angle}deg)`;
    els.grid.appendChild(link);

    window.setTimeout(() => {
      link.remove();
      fromTile.classList.remove("synergy");
      toTile.classList.remove("synergy");
    }, 900);
  });
}

function renderInspector(simState) {
  const id = uiState.hoveredDistrictId ?? uiState.selectedDistrictId;
  if (id === null || id === undefined) {
    els.inspector.textContent = "Tap a district to inspect.";
    return;
  }
  const district = simState.districts.find((d) => d.id === id);
  if (!district) return;
  const tier = incomeTierLabel(district.incomeTier);
  const density = densityLabel(district);
  const deltas = simState.lastDistrictDeltas[district.id] || {};
  const drivers = simState.lastDistrictDrivers[district.id] || [];
  const devLabel = devLevelLabel(district.devLevel);

  els.inspector.innerHTML = `
    <div class="inspector-section">
      <div class="inspector-line"><strong>District</strong> (${district.x + 1}, ${district.y + 1})</div>
      <div class="inspector-line">Income tier: ${tier}</div>
      <div class="inspector-line">Density: ${density}</div>
      <div class="inspector-line">Dev level: ${devLabel}</div>
      ${district.nickname ? `<div class="inspector-line">Nickname: ${district.nickname}</div>` : ""}
    </div>
    <div class="inspector-section">
      <div class="inspector-line">Access: ${formatValue(district.access, deltas.access)}</div>
      <div class="inspector-line">Housing cost: ${formatValue(district.housingCost, deltas.housingCost)}</div>
      <div class="inspector-line">Cohesion: ${formatValue(district.cohesion, deltas.cohesion)}</div>
      <div class="inspector-line">Risk: ${formatValue(district.risk, deltas.risk)}</div>
      <div class="inspector-line">Population: ${formatValue(district.populationValue, deltas.populationValue)}</div>
    </div>
    <div class="inspector-section">
      <div class="inspector-line"><strong>Why this changed</strong></div>
      ${drivers.map((driver) => `<div class="inspector-line">${driver}</div>`).join("")}
    </div>
  `;
}

function formatValue(value, delta) {
  const rounded = Math.round(value);
  if (delta === undefined) return `${rounded}`;
  const diff = Math.round(delta);
  if (diff === 0) return `${rounded} (0)`;
  return `${rounded} (${diff > 0 ? "+" : ""}${diff})`;
}

function tokenEffectSummary(type) {
  const token = TOKEN_TYPES[type];
  const parts = Object.entries(token.effects).map(([key, value]) => {
    const label = key.replace(/([A-Z])/g, " $1");
    return `${label} ${value > 0 ? "+" : ""}${value}`;
  });
  return parts.join(", ");
}
function renderPolicies(simState) {
  els.policies.innerHTML = "";
  const maxPolicies = policyLimit(simState);
  if (els.policyLimitNote) {
    els.policyLimitNote.textContent = `Select up to ${maxPolicies}. Budget resets each turn.`;
  }
  const policies = filteredPolicies(simState);
  policies.forEach((card) => {
    const wrapper = document.createElement("div");
    wrapper.className = "policy-card";
    const checked = uiState.selectedPolicies.has(card.id);
    const cost = policyCost(card);
    const costLabel = cost !== card.cost ? `${cost} (discounted)` : `${cost}`;
    const tags = card.tags.map((tag) => `<span class="badge">${tag}</span>`).join(" ");
    wrapper.innerHTML = `
      <h4>${card.name}</h4>
      <p>${card.summary}</p>
      <div class="policy-meta">
        <span>Cost: ${costLabel}</span>
        <span>Stage: ${card.minStage}</span>
      </div>
      <div class="policy-meta">${tags}</div>
      <div class="policy-actions">
        <label>
          <input type="checkbox" data-card="${card.id}" ${checked ? "checked" : ""} /> Select
        </label>
        <button class="secondary" data-detail="${card.id}">Details</button>
      </div>
    `;
    els.policies.appendChild(wrapper);
  });

  const checkboxes = els.policies.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      const id = event.target.dataset.card;
      if (!id) return;
      const card = POLICY_CARDS.find((c) => c.id === id);
      if (!card) return;

      if (event.target.checked) {
        if (card.quiz && !uiState.quizUsed && !uiState.quizDiscounts[card.id]) {
          event.target.checked = false;
          openQuizModal(card);
          return;
        }
        const currentCost = selectedCost();
        const cardCost = policyCost(card);
        if (uiState.selectedPolicies.size >= maxPolicies || currentCost + cardCost > simState.budget) {
          event.target.checked = false;
          if (uiState.selectedPolicies.size >= maxPolicies) {
            setCoachMessage(`Stage ${simState.stage} allows up to ${maxPolicies} policy ${maxPolicies === 1 ? "card" : "cards"} this turn.`);
          } else {
            setCoachMessage("That selection is over budget for this turn.");
          }
          return;
        }
        uiState.selectedPolicies.add(id);
        clearCoachMessage();
        showPolicyFloaters(card);
      } else {
        uiState.selectedPolicies.delete(id);
      }
      updatePolicyUI(simState);
    });
  });

  const detailButtons = els.policies.querySelectorAll("button[data-detail]");
  detailButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.detail;
      const card = POLICY_CARDS.find((c) => c.id === id);
      if (!card) return;
      openPolicyDrawer(card);
    });
  });

  updatePolicyUI(simState);
}

function updatePolicyUI(simState) {
  const checkboxes = els.policies.querySelectorAll("input[type=checkbox]");
  const currentCost = selectedCost();
  const maxPolicies = policyLimit(simState);
  checkboxes.forEach((checkbox) => {
    const id = checkbox.dataset.card;
    const card = POLICY_CARDS.find((c) => c.id === id);
    if (!card) return;
    if (checkbox.checked) {
      checkbox.disabled = false;
    } else if (uiState.selectedPolicies.size >= maxPolicies) {
      checkbox.disabled = true;
    } else if (currentCost + policyCost(card) > simState.budget) {
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
    }
  });
  els.budgetChip.textContent = `Budget ${simState.budget} (Selected ${currentCost})`;
  renderChecklist(simState);
  renderCoach(simState);
}

function policyCost(card) {
  const discount = uiState.quizDiscounts[card.id] || 0;
  return Math.max(0, Math.round(card.cost * (1 - discount)));
}

function selectedCost() {
  return POLICY_CARDS.filter((card) => uiState.selectedPolicies.has(card.id)).reduce((sum, card) => sum + policyCost(card), 0);
}

function openQuizModal(card) {
  if (!els.quizModal || !card.quiz) return;
  uiState.pendingQuizPolicyId = card.id;
  els.quizQuestion.textContent = card.quiz.question;
  els.quizFeedback.textContent = "";
  els.quizChoices.innerHTML = card.quiz.options
    .map(
      (option) => `
      <button class="secondary" data-choice="${option.id}">
        ${option.label}
      </button>`
    )
    .join("");
  const buttons = els.quizChoices.querySelectorAll("button[data-choice]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      resolveQuizChoice(card, button.dataset.choice);
    });
  });
  els.quizModal.classList.remove("hidden");
}

function closeQuizModal() {
  if (!els.quizModal) return;
  els.quizModal.classList.add("hidden");
  uiState.pendingQuizPolicyId = null;
}

function resolveQuizChoice(card, choiceId) {
  const isCorrect = card.quiz.correctId === choiceId;
  uiState.quizUsed = true;
  if (isCorrect) {
    uiState.quizDiscounts[card.id] = card.quiz.discount ?? 0.1;
    els.quizFeedback.textContent = "Correct! Policy cost reduced.";
  } else {
    els.quizFeedback.textContent = "Not quite. No discount this time.";
  }

  closeQuizModal();
  attemptSelectPolicy(card);
}

function attemptSelectPolicy(card) {
  const currentCost = selectedCost();
  const cardCost = policyCost(card);
  if (uiState.selectedPolicies.size >= policyLimit(state) || currentCost + cardCost > state.budget) {
    if (uiState.selectedPolicies.size >= policyLimit(state)) {
      setCoachMessage(`Stage ${state.stage} allows up to ${policyLimit(state)} policy ${policyLimit(state) === 1 ? "card" : "cards"} this turn.`);
    } else {
      setCoachMessage("That selection is over budget for this turn.");
    }
    renderPolicies(state);
    return;
  }
  uiState.selectedPolicies.add(card.id);
  clearCoachMessage();
  showPolicyFloaters(card);
  renderPolicies(state);
}

function showPolicyFloaters(card) {
  if (!card || !card.effects) return;
  showMetricFloaters(card.effects);
  showDistrictFloaters(card.effects);
}

function showMetricFloaters(effects) {
  effects.forEach((effect) => {
    if (effect.target !== "city" || typeof effect.delta !== "number" || (effect.delay && effect.delay > 0)) return;
    const targetEl = metricTarget(effect.key);
    if (!targetEl) return;
    const text = `${effect.delta > 0 ? "+" : ""}${effect.delta}`;
    const type = effect.delta > 0 ? "positive" : effect.delta < 0 ? "negative" : "neutral";
    spawnFloater(targetEl, text, type);
  });
}

function showDistrictFloaters(effects) {
  const housingEffects = effects.filter(
    (effect) =>
      effect.target === "district" &&
      effect.key === "housingCost" &&
      typeof effect.delta === "number" &&
      !(effect.delay && effect.delay > 0)
  );
  if (!housingEffects.length) return;
  const districts = state.districts;
  housingEffects.forEach((effect) => {
    const affected = districts.filter((district) => districtMatchesFilter(district, effect.where));
    affected.slice(0, 8).forEach((district) => {
      const tile = els.grid.querySelector(`.tile[data-id="${district.id}"]`);
      if (!tile) return;
      const text = effect.delta < 0 ? "-$$" : "+$$";
      spawnGridFloater(tile, text, effect.delta < 0 ? "negative" : "positive");
    });
  });
}

function metricTarget(key) {
  if (key === "budget") return els.cityBudget || els.budgetChip;
  if (key === "growth") return els.citySize;
  if (key === "legitimacy") return els.publicSupport;
  const direct = document.getElementById(key);
  if (direct) return direct;
  return document.querySelector(`.metric-line[data-metric="${key}"]`);
}

function spawnFloater(target, text, type) {
  const rect = target.getBoundingClientRect();
  const floater = document.createElement("div");
  floater.className = `floater ${type}`;
  floater.textContent = text;
  floater.style.left = `${rect.left + rect.width / 2}px`;
  floater.style.top = `${rect.top}px`;
  document.body.appendChild(floater);
  window.setTimeout(() => {
    floater.remove();
  }, 1100);
}

function spawnGridFloater(tile, text, type) {
  const gridRect = els.grid.getBoundingClientRect();
  const rect = tile.getBoundingClientRect();
  const floater = document.createElement("div");
  floater.className = `grid-floater ${type}`;
  floater.textContent = text;
  floater.style.left = `${rect.left + rect.width / 2 - gridRect.left}px`;
  floater.style.top = `${rect.top + rect.height / 2 - gridRect.top}px`;
  els.grid.appendChild(floater);
  window.setTimeout(() => {
    floater.remove();
  }, 1000);
}

function districtMatchesFilter(district, where) {
  if (!where) return true;
  if (where === "income_low") return district.incomeTier === 0;
  if (where === "income_mid") return district.incomeTier === 1;
  if (where === "income_high") return district.incomeTier === 2;
  if (where === "access_high") return district.access >= 60;
  if (where === "access_low") return district.access <= 40;
  return true;
}

function filteredPolicies(simState) {
  let list = POLICY_CARDS.filter((card) => simState.stage >= card.minStage);
  if (uiState.activeTags.size > 0) {
    list = list.filter((card) => card.tags.some((tag) => uiState.activeTags.has(tag)));
  }
  if (uiState.policySort === "cost") {
    list = [...list].sort((a, b) => a.cost - b.cost);
  } else if (uiState.policySort === "impact") {
    list = [...list].sort((a, b) => policyImpact(b) - policyImpact(a));
  }
  return list;
}

function policyImpact(card) {
  return card.effects.reduce((sum, effect) => sum + Math.abs(effect.delta || 0), 0);
}

function renderPlacementPanel(simState) {
  els.placementList.innerHTML = "";
  Object.entries(TOKEN_TYPES).forEach(([key, token]) => {
    const unlocked = simState.stage >= (token.minStage ?? 1);
    const button = document.createElement("button");
    button.className = "placement-btn";
    const isActive = uiState.activeToken === key;
    button.dataset.token = key;
    button.innerHTML = `
      <span>${token.label}</span>
      <span class="badge">${unlocked ? token.cost : `S${token.minStage}`}</span>
    `;
    if (!unlocked) {
      button.classList.add("locked");
      button.title = `Unlocks at Stage ${token.minStage}`;
    }
    if (isActive) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      if (!unlocked) {
        setCoachMessage(`${token.label} unlocks at Stage ${token.minStage}.`);
        return;
      }
      uiState.activeToken = isActive ? null : key;
      uiState.lastPlacementMessage = null;
      clearCoachMessage();
      renderPlacementPanel(state);
      renderCoach(state);
    });
    els.placementList.appendChild(button);
  });

  const remaining = MAX_TOKENS_PER_TURN - simState.placementsThisTurn;
  const message = uiState.activeToken
    ? `Placement mode: ${TOKEN_TYPES[uiState.activeToken].label}. Click a district to place.`
    : "Select a token to place on the grid.";
  const warning = uiState.lastPlacementMessage ? ` ${uiState.lastPlacementMessage}` : "";
  els.placementInfo.textContent = `${message} Remaining placements: ${remaining}.${warning}`;
}

function renderDashboards(simState) {
  const func = [
    ["cohesion", "Community Trust", simState.metrics.cohesion],
    ["capacity", "Service Capacity", simState.metrics.capacity],
    ["legitimacy", "Public Support", simState.metrics.legitimacy],
    ["disorder", "Disorder", simState.metrics.disorder],
    ["resilience", "Recovery Strength", simState.metrics.resilience],
  ];
  const conf = [
    ["strain", "Strain", simState.metrics.strain],
    ["inequality", "Inequality", simState.metrics.inequality],
    ["mobility", "Mobility", simState.metrics.mobility],
    ["capture", "Insider Control", simState.metrics.capture],
    ["burden", "Uneven Burden", simState.metrics.burden],
    ["contestation", "Pushback", simState.metrics.contestation],
  ];

  els.funcMetrics.innerHTML = func
    .map(([key, label, value]) => `<div class="metric-line" data-metric="${key}"><span>${label}</span><span>${Math.round(value)}</span></div>`)
    .join("");

  els.confMetrics.innerHTML = conf
    .map(([key, label, value]) => `<div class="metric-line" data-metric="${key}"><span>${label}</span><span>${Math.round(value)}</span></div>`)
    .join("");
}

function renderNews(simState) {
  els.newsfeed.innerHTML = simState.news
    .map((item) => formatNewsItem(item))
    .join("");
}

function formatNewsItem(item) {
  const entry = typeof item === "string" ? { kind: "text", text: item } : item;
  const kind = entry.kind || "text";
  const turnLabel = entry.turn ? `Round ${entry.turn}: ` : "";

  if (kind === "headlines") {
    const left = entry.headlines?.proGrowth || "";
    const right = entry.headlines?.equityCritical || "";
    return `
      <div class="news-item headlines">
        <div class="news-turn">${turnLabel}Media split</div>
        <div class="headline-grid">
          <div class="headline">${left}</div>
          <div class="headline">${right}</div>
        </div>
      </div>
    `;
  }

  let content = entry.text || entry.fallback || "";
  if (kind === "event" || kind === "interpretive") {
    if (entry.text) {
      content = entry.text;
    } else {
      content = `${entry.label ? `${entry.label}: ` : ""}${pickTemplateLine(entry)}`;
    }
  }
  if (kind === "quote") {
    content = formatQuoteLine(entry);
  }
  if (kind === "achievement") {
    const list = entry.achievements?.length ? entry.achievements.join(", ") : "No achievements unlocked.";
    content = `Achievements: ${list}`;
  }

  return `<div class="news-item ${kind}">${turnLabel}${content}</div>`;
}

function pickTemplateLine(entry) {
  const templates = entry.templates || {};
  const options = templates[uiState.tone] || templates.academic || templates.civic || [];
  if (!options.length) return entry.fallback || entry.text || "";
  const index = (entry.pick ?? 0) % options.length;
  return options[index];
}

function formatQuoteLine(entry) {
  const character = entry.character || { name: "Unknown", role: "Civic voice" };
  const quote = entry.quote || "";
  if (uiState.tone === "academic") {
    return `${character.name} (${character.role}) stated, "${quote}"`;
  }
  if (uiState.tone === "civic") {
    return `${character.name}, ${character.role}: "${quote}"`;
  }
  return `${character.name}, ${character.role}, offered: "${quote}"`;
}

function renderEvent(simState) {
  if (simState.pendingDilemma) {
    els.event.textContent = `Dilemma pending: ${simState.pendingDilemma.name}.`;
    return;
  }
  if (simState.activeCrisis) {
    els.event.textContent = `Crisis cascade active (${simState.activeCrisis.turnsLeft} turns left).`;
    return;
  }
  if (!simState.lastEvent) {
    els.event.textContent = "No major event this turn.";
    return;
  }
  els.event.textContent = `${simState.lastEvent.name}: ${simState.lastEvent.text}`;
}

function renderMeta(simState) {
  const stage = STAGES.find((s) => s.id === simState.stage);
  els.stageChip.textContent = `Stage ${simState.stage}: ${stage ? stage.name : ""}`;
  els.turnChip.textContent = `Round ${simState.turn}`;
  const size = citySize(simState);
  const sizeDelta = citySizeDelta(simState);
  els.citySize.textContent = `${size} (${signedNumber(sizeDelta)})`;
  els.cityBudget.textContent = formatCurrency(simState.budget);
  els.publicSupport.textContent = `${Math.round(simState.metrics.legitimacy)}%`;
  els.budgetChip.textContent = `Budget ${formatCurrency(simState.budget)} (Selected ${selectedCost()})`;
  if (els.seedChip) {
    els.seedChip.textContent = `Seed ${simState.seed}`;
  }
  els.nextTurn.disabled = Boolean(simState.pendingDilemma || simState.endgame);
}

function renderRuns() {
  if (!uiState.savedRuns.length) {
    els.runs.innerHTML = "No saved runs yet.";
    return;
  }
  els.runs.innerHTML = uiState.savedRuns
    .map((run) => {
      return `
          <div class="run-card">
            <div class="run-title">${run.label}</div>
            <div class="run-line">Seed ${run.seed} | Stage ${run.stage} | Round ${run.turn}</div>
          <div class="run-line">Cohesion ${Math.round(run.metrics.cohesion)} | Inequality ${Math.round(run.metrics.inequality)} | Public Support ${Math.round(run.metrics.legitimacy)}%</div>
          </div>
      `;
    })
    .join("");
}
function showSummary(simState) {
  const summary = simState.lastSummary;
  if (!summary) return;
  const topGroups = summary.groupScores.slice(0, 1);
  const bottomGroups = summary.groupScores.slice(-1);
  const groupLine = `Top gainer: ${topGroups[0].group}. Biggest loss: ${bottomGroups[0].group}.`;
  const metricLines = summary.metricChanges
    .slice(0, 3)
    .map((change) => `${capitalize(change.key)} ${change.delta > 1 ? "up" : change.delta < -1 ? "down" : "flat"}`)
    .join(" | ");

  els.summaryBody.innerHTML = `
    <div class="summary-line">${summary.headline}</div>
    <div class="summary-line">${metricLines}</div>
    <div class="summary-line">${groupLine}</div>
    <div class="summary-line">City systems: ${summary.funcLine}</div>
    <div class="summary-line">Equity pressure: ${summary.confLine}</div>
    ${summary.prompt ? `<div class="summary-prompt">${summary.prompt}</div>` : ""}
  `;

  els.summaryModal.classList.remove("hidden");
}

function hideSummary() {
  els.summaryModal.classList.add("hidden");
}

function openPolicyDrawer(card) {
  els.drawerTitle.textContent = card.name;
  const immediate = card.effects.filter((effect) => !effect.delay || effect.delay === 0);
  const delayed = card.effects.filter((effect) => effect.delay && effect.delay > 0);
  const distribution = policyDistribution(card);

  els.drawerBody.innerHTML = `
    <div class="drawer-section">Cost: ${card.cost} | Stage ${card.minStage}</div>
    <div class="drawer-section">
      <strong>Immediate effects</strong>
      ${immediate.length ? immediate.map(effectLine).join("") : "<div>No immediate effects.</div>"}
    </div>
    <div class="drawer-section">
      <strong>Delayed effects</strong>
      ${delayed.length ? delayed.map(effectLine).join("") : "<div>No delayed effects.</div>"}
    </div>
    <div class="drawer-section">
      <strong>Who benefits</strong>
      <div>${distribution.benefits.join(", ") || "None"}</div>
      <strong>Who bears burden</strong>
      <div>${distribution.burdens.join(", ") || "None"}</div>
    </div>
  `;
  els.drawer.classList.remove("hidden");
}

function closePolicyDrawer() {
  els.drawer.classList.add("hidden");
}

function effectLine(effect) {
  const target = effect.target === "city" ? "City" : effect.target === "group" ? `Group (${effect.group})` : effect.target === "district" ? "District" : `Institution (${INSTITUTIONS[effect.inst]?.label || effect.inst})`;
  const key = effect.target === "institution" ? effect.lever : effect.key;
  const delta = `${effect.delta > 0 ? "+" : ""}${effect.delta}`;
  const delay = effect.delay ? ` (turn +${effect.delay})` : "";
  return `<div>${target}: ${key} ${delta}${delay}</div>`;
}

function policyDistribution(card) {
  const scores = {
    Elite: 0,
    Middle: 0,
    Working: 0,
    Marginalized: 0,
  };

  card.effects.forEach((effect) => {
    if (effect.target === "group") {
      const weight = effect.key === "grievance" ? -1 : 1;
      scores[effect.group] += weight * effect.delta;
    }
    if (effect.target === "district" && effect.where === "income_low") {
      scores.Working += effect.delta * 0.3;
      scores.Marginalized += effect.delta * 0.3;
    }
  });

  const benefits = Object.entries(scores)
    .filter(([, score]) => score > 1)
    .map(([group]) => group);
  const burdens = Object.entries(scores)
    .filter(([, score]) => score < -1)
    .map(([group]) => group);

  return { benefits, burdens };
}

function showStageBanner(simState) {
  if (!simState.lastStageChange) return;
  if (uiState.stageBannerTurn === simState.lastStageChange.turn) return;
  const unlockedInstitutions = simState.lastStageChange.unlocked
    .map((key) => INSTITUTIONS[key]?.label || key)
    .join(", ");
  const unlockedResources = (simState.lastStageChange.unlockedTokens || [])
    .map((key) => TOKEN_TYPES[key]?.label || key)
    .join(", ");
  const unlockBits = [];
  if (unlockedInstitutions) unlockBits.push(`Institutions: ${unlockedInstitutions}`);
  if (unlockedResources) unlockBits.push(`Resources: ${unlockedResources}`);
  const unlockText = unlockBits.length ? ` Unlocked ${unlockBits.join(" | ")}.` : "";
  els.stageBanner.textContent = `Stage ${simState.lastStageChange.to}: ${simState.lastStageChange.name}.${unlockText}`;
  els.stageBanner.classList.remove("hidden");
  uiState.stageBannerTurn = simState.lastStageChange.turn;
  window.setTimeout(() => {
    els.stageBanner.classList.add("hidden");
  }, 2000);
}

function showEndgame(simState) {
  if (!simState.endgame || uiState.endgameShown) return;
  const achievements = simState.endgame.achievements || [];
  els.endgameBody.innerHTML = achievements.length
    ? `<ul>${achievements.map((item) => `<li>${item}</li>`).join("")}</ul>`
    : "<div>No achievements unlocked.</div>";
  drawSnapshotCard(simState);
  if (els.snapshotDownload) {
    els.snapshotDownload.onclick = () => downloadSnapshot();
  }
  if (els.snapshotCopy) {
    els.snapshotCopy.onclick = () => copySnapshot();
  }
  els.endgameModal.classList.remove("hidden");
  uiState.endgameShown = true;
  els.nextTurn.disabled = true;
}

function drawSnapshotCard(simState) {
  if (!els.snapshotCanvas) return;
  const canvas = els.snapshotCanvas;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdf9";
  ctx.fillRect(0, 0, width, height);

  const title = `Fairview — Seed ${simState.seed}`;
  const archetype = archetypeLabel(simState.metrics);
  const gini = computeGini(Object.values(simState.groups).map((group) => group.income));
  const giniLabel = gini >= 0.45 ? "High Inequality" : gini >= 0.3 ? "Moderate Inequality" : "Low Inequality";

  ctx.fillStyle = "#1b1f1e";
  ctx.font = "700 24px 'Syne', sans-serif";
  ctx.fillText(title, 24, 36);
  ctx.font = "italic 19px 'Fraunces', serif";
  ctx.fillText(archetype, 24, 64);
  ctx.fillStyle = "#5f625f";
  ctx.font = "13px 'Archivo Narrow', sans-serif";
  ctx.fillText(`Gini Coefficient: ${gini.toFixed(2)} (${giniLabel})`, 24, 90);

  const cell = 16;
  const gridSize = GRID_SIZE;
  const gridWidth = cell * gridSize;
  const gridX = width - gridWidth - 32;
  const gridY = 60;

  ctx.fillStyle = "#f1e2cf";
  ctx.fillRect(gridX - 8, gridY - 8, gridWidth + 16, gridWidth + 16);
  ctx.fillStyle = "#5f625f";
  ctx.font = "12px 'Archivo Narrow', sans-serif";
  ctx.fillText("Final Skyline", gridX, gridY - 14);

  simState.districts.forEach((district) => {
    const color = district.devLevel === 0 || district.incomeTier === null
      ? "#c8d0da"
      : district.incomeTier === 0
        ? "#6aaed6"
        : district.incomeTier === 1
          ? "#f0c36d"
          : "#d17b88";
    const x = gridX + district.x * cell;
    const y = gridY + district.y * cell;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cell - 2, cell - 2);
  });
}

function archetypeLabel(metrics) {
  const funcScore = (metrics.cohesion + metrics.capacity + metrics.legitimacy + metrics.resilience) / 4;
  const confScore = (metrics.inequality + metrics.burden + metrics.capture + metrics.contestation) / 4;
  if (funcScore - confScore > 12 && metrics.inequality > 55) return "The Benevolent Surveillance State";
  if (funcScore - confScore > 12) return "The Integrated Commons";
  if (confScore - funcScore > 12 && metrics.growth >= 60) return "The Fractured Utopia";
  if (confScore - funcScore > 12) return "The Divided City";
  return "The Tense Compromise";
}

function computeGini(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((sum, v) => sum + v, 0) / n;
  if (mean === 0) return 0;
  let sumDiff = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      sumDiff += Math.abs(sorted[i] - sorted[j]);
    }
  }
  return sumDiff / (2 * n * n * mean);
}

function downloadSnapshot() {
  if (!els.snapshotCanvas) return;
  const link = document.createElement("a");
  link.href = els.snapshotCanvas.toDataURL("image/png");
  link.download = `fairview-snapshot-${state.seed}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function copySnapshot() {
  if (!els.snapshotCanvas || !navigator.clipboard || !navigator.clipboard.write || typeof ClipboardItem === "undefined") {
    return;
  }
  els.snapshotCanvas.toBlob((blob) => {
    if (!blob) return;
    const item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]);
  });
}

function showDilemmaModal(simState) {
  if (!els.dilemmaModal) return;
  if (!simState.pendingDilemma) {
    els.dilemmaModal.classList.add("hidden");
    return;
  }
  const event = simState.pendingDilemma;
  els.dilemmaTitle.textContent = event.name;
  els.dilemmaBody.textContent = event.prompt || event.text || "A dilemma requires a decision.";
  els.dilemmaChoices.innerHTML = event.choices
    .map(
      (choice) => `
      <div class="dilemma-choice">
        <div class="dilemma-choice-title">${choice.label}</div>
        <div class="dilemma-choice-meta">${choice.theory} • Cost: ${choice.cost}</div>
        <div class="dilemma-choice-desc">${choice.description}</div>
        <button class="primary" data-choice="${choice.id}">Choose</button>
      </div>
    `
    )
    .join("");

  const buttons = els.dilemmaChoices.querySelectorAll("button[data-choice]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      resolveDilemmaChoice(button.dataset.choice);
    });
  });

  els.dilemmaModal.classList.remove("hidden");
}

function resolveDilemmaChoice(choiceId) {
  advanceTurn({ dilemmaChoice: choiceId });
}

function advanceTurn(options = {}) {
  const policyIds = Array.from(uiState.selectedPolicies);
  state = step(state, rng, { policyIds, ...options });
  if (state.pendingDilemma) {
    render(state);
    showDilemmaModal(state);
    return false;
  }
  uiState.selectedPolicies.clear();
  uiState.lastPlacementMessage = null;
  render(state);
  showSummary(state);
  return true;
}

function renderTags() {
  const tags = Array.from(new Set(POLICY_CARDS.flatMap((card) => card.tags)));
  els.policyTags.innerHTML = tags
    .map((tag) => `<button class="tag ${uiState.activeTags.has(tag) ? "active" : ""}" data-tag="${tag}">${tag}</button>`)
    .join("");

  const tagButtons = els.policyTags.querySelectorAll("button");
  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tag = button.dataset.tag;
      if (!tag) return;
      if (uiState.activeTags.has(tag)) {
        uiState.activeTags.delete(tag);
      } else {
        uiState.activeTags.add(tag);
      }
      renderTags();
      renderPolicies(state);
    });
  });
}

function render(simState) {
  renderLegend(simState);
  renderGrid(simState);
  renderInspector(simState);
  renderPlacementPanel(simState);
  renderPolicies(simState);
  renderChecklist(simState);
  renderCoach(simState);
  renderDashboards(simState);
  renderNews(simState);
  renderEvent(simState);
  renderMeta(simState);
  renderRuns();
  showStageBanner(simState);
  showEndgame(simState);
  showDilemmaModal(simState);
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function exportJson() {
  const payload = {
    seed: state.seed,
    scenario: state.scenarioKey,
    history: state.history,
    stageTransitions: state.stageTransitions,
  };
  downloadFile(`fairview-${state.seed}.json`, JSON.stringify(payload, null, 2));
}

function exportCsv() {
  const headers = ["round", "stage", ...Object.keys(state.metrics)];
  const rows = state.history.map((entry) => {
    const values = [entry.turn, entry.stage];
    Object.keys(state.metrics).forEach((key) => {
      values.push(Math.round(entry.metrics[key]));
    });
    return values.join(",");
  });
  downloadFile(`fairview-${state.seed}.csv`, [headers.join(","), ...rows].join("\n"));
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function bindEvents() {
  els.nextTurn.addEventListener("click", () => {
    if (state.pendingDilemma) {
      setCoachMessage("Choose a dilemma response before advancing.");
      showDilemmaModal(state);
      return;
    }
    clearCoachMessage();
    advanceTurn();
  });

  if (els.helpOpen) {
    els.helpOpen.addEventListener("click", () => {
      openOnboarding(true);
    });
  }

  if (els.legendToggle) {
    els.legendToggle.addEventListener("click", () => {
      setLegendCollapsed(!uiState.legendCollapsed);
    });
  }

  if (els.onboardingClose) {
    els.onboardingClose.addEventListener("click", () => {
      closeOnboarding();
    });
  }

  if (els.onboardingDismiss) {
    els.onboardingDismiss.addEventListener("click", () => {
      uiState.onboardingOptOut = true;
      saveOnboardingOptOut(true);
      closeOnboarding();
    });
  }

  els.summaryClose.addEventListener("click", () => {
    hideSummary();
  });

  els.summarySave.addEventListener("click", () => {
    const label = `Run ${uiState.savedRuns.length + 1}`;
    uiState.savedRuns.unshift({
      label,
      seed: state.seed,
      turn: state.turn - 1,
      stage: state.stage,
      metrics: { ...state.metrics },
    });
    uiState.savedRuns = uiState.savedRuns.slice(0, 6);
    renderRuns();
  });

  els.replaySeed.addEventListener("click", () => {
    startSimulation(state.seed, state.scenarioKey);
  });

  els.viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      els.viewButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      uiState.viewMode = button.dataset.view;
      renderLegend(state);
      renderGrid(state);
    });
  });

  els.startSim.addEventListener("click", () => {
    const seedValue = Number.parseInt(els.seedInput.value, 10);
    const seed = Number.isFinite(seedValue) && seedValue > 0 ? seedValue : state.seed;
    const scenarioKey = els.scenarioSelect.value;
    startSimulation(seed, scenarioKey);
  });

  els.policySort.addEventListener("change", () => {
    uiState.policySort = els.policySort.value;
    renderPolicies(state);
  });

  els.exportJson.addEventListener("click", exportJson);
  els.exportCsv.addEventListener("click", exportCsv);

  els.drawerClose.addEventListener("click", closePolicyDrawer);

  if (els.toneSelect) {
    els.toneSelect.addEventListener("change", () => {
      if (!session.adminMode) return;
      uiState.tone = els.toneSelect.value;
      saveTone(uiState.tone);
      renderNews(state);
    });
  }

  if (els.endgameClose) {
    els.endgameClose.addEventListener("click", () => {
      els.endgameModal.classList.add("hidden");
    });
  }

  if (els.restartSim) {
    els.restartSim.addEventListener("click", () => {
      startSimulation(state.seed, state.scenarioKey);
    });
  }

  if (els.tabLinks.length) {
    els.tabLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setActiveTab(link.dataset.tab);
      });
    });
  }

  if (els.mobileButtons.length) {
    els.mobileButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setMobileView(button.dataset.mobile);
      });
    });
  }
}

function init() {
  if (!uiState.legendPrimed) {
    uiState.legendCollapsed = false;
  }
  if (els.adminTools) {
    els.adminTools.classList.toggle("hidden", !session.adminMode);
  }
  if (els.seedChip) {
    els.seedChip.classList.add("hidden");
  }
  if (!session.adminMode) {
    uiState.tone = "civic";
  }
  initScenarioSelect();
  els.seedInput.value = state.seed;
  els.policySort.value = uiState.policySort;
  if (els.toneSelect) {
    els.toneSelect.classList.toggle("hidden", !session.adminMode);
    els.toneSelect.value = uiState.tone;
  }
  renderTags();
  bindEvents();
  if (els.tabLinks.length) {
    setActiveTab(uiState.activeTab);
  }
  if (els.mobileButtons.length) {
    setMobileView(uiState.mobileView);
  }
  render(state);
  openOnboarding();
}

init();
