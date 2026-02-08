import {
  GRID_SIZE,
  MAX_POLICIES_PER_TURN,
  MAX_TOKENS_PER_TURN,
  STAGES,
  INSTITUTIONS,
  TOKEN_TYPES,
  TOKEN_ICONS,
  POLICY_CARDS,
  SCENARIOS,
  createRng,
  createState,
  step,
  placeToken,
} from "./engine.js";

const els = {
  grid: document.getElementById("grid"),
  policies: document.getElementById("policies"),
  nextTurn: document.getElementById("next-turn"),
  newsfeed: document.getElementById("newsfeed"),
  event: document.getElementById("event"),
  growth: document.getElementById("growth"),
  strain: document.getElementById("strain"),
  legitimacy: document.getElementById("legitimacy"),
  funcMetrics: document.getElementById("func-metrics"),
  confMetrics: document.getElementById("conf-metrics"),
  stageChip: document.getElementById("stage-chip"),
  turnChip: document.getElementById("turn-chip"),
  yearChip: document.getElementById("year-chip"),
  budgetChip: document.getElementById("budget-chip"),
  seedChip: document.getElementById("seed-chip"),
  inspector: document.getElementById("inspector"),
  legend: document.getElementById("legend"),
  viewButtons: document.querySelectorAll(".view-toggle button"),
  placementList: document.getElementById("placements"),
  placementInfo: document.getElementById("placement-info"),
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
};

const session = {
  initialSeed: resolveSeed(),
  scenarioKey: resolveScenario(),
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

function loadTone() {
  const stored = window.localStorage.getItem("fairview-tone");
  return stored || "academic";
}

function saveTone(tone) {
  window.localStorage.setItem("fairview-tone", tone);
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
  els.nextTurn.disabled = false;
  if (els.endgameModal) {
    els.endgameModal.classList.add("hidden");
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
function renderLegend(simState) {
  if (uiState.viewMode === "income") {
    els.legend.innerHTML = `
      <span class="dot low"></span> Low income
      <span class="dot mid"></span> Middle income
      <span class="dot high"></span> High income
      <span class="dev-marker">Dev I/II/III</span>
    `;
    return;
  }

  if (uiState.viewMode === "functionalism") {
    els.legend.innerHTML = `
      <span class="dot" style="background:#d1e8d5"></span> Low integration
      <span class="dot" style="background:#2f8f6a"></span> High integration
      <span class="dev-marker">Metric: cohesion minus disorder</span>
    `;
    return;
  }

  els.legend.innerHTML = `
    <span class="dot" style="background:#b8d0c8"></span> Low burden
    <span class="dot" style="background:#a63d40"></span> High burden
    <span class="dev-marker">Metric: housing + risk</span>
  `;
}

function tileBackground(simState, district) {
  if (uiState.viewMode === "functionalism") {
    const integration = clamp(50 + (district.cohesion - simState.metrics.disorder) * 0.5, 0, 100);
    const color = blendColor("#d1e8d5", "#2f8f6a", integration / 100);
    return `linear-gradient(135deg, ${color} 0%, rgba(255,255,255,0.9) 100%)`;
  }
  if (uiState.viewMode === "conflict") {
    const burden = clamp((district.risk + district.housingCost) / 2);
    const color = blendColor("#b8d0c8", "#a63d40", burden / 100);
    return `linear-gradient(135deg, ${color} 0%, rgba(255,255,255,0.9) 100%)`;
  }
  const tierClass = district.incomeTier === 0 ? "low" : district.incomeTier === 1 ? "mid" : "high";
  return `linear-gradient(135deg, var(--${tierClass}) 0%, rgba(255,255,255,0.85) 100%)`;
}

function renderGrid(simState) {
  els.grid.innerHTML = "";
  els.grid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
  simState.districts.forEach((district) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.dataset.id = district.id;
    if (uiState.selectedDistrictId === district.id) {
      tile.classList.add("selected");
    }
    tile.tabIndex = 0;
    tile.setAttribute("role", "button");
    tile.setAttribute("aria-label", `District ${district.x + 1}, ${district.y + 1}`);
    if (district.nickname) {
      tile.title = `Nickname: ${district.nickname}`;
    }

    const density = district.populationValue > 75 ? "High" : district.populationValue > 50 ? "Medium" : "Low";
    const tier = district.incomeTier === 0 ? "Low" : district.incomeTier === 1 ? "Middle" : "High";
    const devLabel = district.devLevel === 3 ? "III" : district.devLevel === 2 ? "II" : "I";

    const icons = district.tokens
      .slice(0, 3)
      .map((type) => {
        const token = TOKEN_TYPES[type];
        const icon = TOKEN_ICONS[type];
        const summary = tokenEffectSummary(type);
        return `<span class="token-icon" title="${token.label}: ${summary}">${icon}</span>`;
      })
      .join(" ");

    tile.style.background = tileBackground(simState, district);
    tile.innerHTML = `
      <div class="tier">${uiState.viewMode === "income" ? tier : ""}</div>
      <div class="density">Pop: ${density}</div>
      <div class="density">Access: ${Math.round(district.access)}</div>
      <div class="dev-marker">Dev ${devLabel}</div>
      <div class="icons">${icons}</div>
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
      render(state);
    }
    return;
  }
  uiState.selectedDistrictId = district.id;
  renderGrid(state);
  renderInspector(state);
}

function renderInspector(simState) {
  const id = uiState.hoveredDistrictId ?? uiState.selectedDistrictId;
  if (id === null || id === undefined) {
    els.inspector.textContent = "Hover or focus a district to see details.";
    return;
  }
  const district = simState.districts.find((d) => d.id === id);
  if (!district) return;
  const tier = district.incomeTier === 0 ? "Low" : district.incomeTier === 1 ? "Middle" : "High";
  const density = district.populationValue > 75 ? "High" : district.populationValue > 50 ? "Medium" : "Low";
  const deltas = simState.lastDistrictDeltas[district.id] || {};
  const drivers = simState.lastDistrictDrivers[district.id] || [];
  const devLabel = district.devLevel === 3 ? "III" : district.devLevel === 2 ? "II" : "I";

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
  const policies = filteredPolicies(simState);
  policies.forEach((card) => {
    const wrapper = document.createElement("div");
    wrapper.className = "policy-card";
    const checked = uiState.selectedPolicies.has(card.id);
    const tags = card.tags.map((tag) => `<span class="badge">${tag}</span>`).join(" ");
    wrapper.innerHTML = `
      <h4>${card.name}</h4>
      <p>${card.summary}</p>
      <div class="policy-meta">
        <span>Cost: ${card.cost}</span>
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
        const currentCost = selectedCost();
        if (uiState.selectedPolicies.size >= MAX_POLICIES_PER_TURN || currentCost + card.cost > simState.budget) {
          event.target.checked = false;
          return;
        }
        uiState.selectedPolicies.add(id);
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
  checkboxes.forEach((checkbox) => {
    const id = checkbox.dataset.card;
    const card = POLICY_CARDS.find((c) => c.id === id);
    if (!card) return;
    if (checkbox.checked) {
      checkbox.disabled = false;
    } else if (uiState.selectedPolicies.size >= MAX_POLICIES_PER_TURN) {
      checkbox.disabled = true;
    } else if (currentCost + card.cost > simState.budget) {
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
    }
  });
  els.budgetChip.textContent = `Budget ${simState.budget} (Selected ${currentCost})`;
}

function selectedCost() {
  return POLICY_CARDS.filter((card) => uiState.selectedPolicies.has(card.id)).reduce((sum, card) => sum + card.cost, 0);
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
    const button = document.createElement("button");
    button.className = "placement-btn";
    const isActive = uiState.activeToken === key;
    button.dataset.token = key;
    button.innerHTML = `
      <span>${token.label}</span>
      <span class="badge">${token.cost}</span>
    `;
    if (isActive) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => {
      uiState.activeToken = isActive ? null : key;
      renderPlacementPanel();
    });
    els.placementList.appendChild(button);
  });

  const remaining = MAX_TOKENS_PER_TURN - simState.placementsThisTurn;
  const message = uiState.activeToken
    ? `Placement mode: ${TOKEN_TYPES[uiState.activeToken].label}. Click a district to place.`
    : "Select a token to place on the grid.";
  els.placementInfo.textContent = `${message} Remaining placements: ${remaining}.`;
}

function renderDashboards(simState) {
  const func = [
    ["Cohesion", simState.metrics.cohesion],
    ["Capacity", simState.metrics.capacity],
    ["Legitimacy", simState.metrics.legitimacy],
    ["Disorder", simState.metrics.disorder],
    ["Resilience", simState.metrics.resilience],
  ];
  const conf = [
    ["Inequality", simState.metrics.inequality],
    ["Mobility", simState.metrics.mobility],
    ["Political Capture", simState.metrics.capture],
    ["Group Burden", simState.metrics.burden],
    ["Contestation", simState.metrics.contestation],
  ];

  els.funcMetrics.innerHTML = func
    .map(([label, value]) => `<div class="metric-line"><span>${label}</span><span>${Math.round(value)}</span></div>`)
    .join("");

  els.confMetrics.innerHTML = conf
    .map(([label, value]) => `<div class="metric-line"><span>${label}</span><span>${Math.round(value)}</span></div>`)
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
  const turnLabel = entry.turn ? `Turn ${entry.turn}: ` : "";

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
    content = `${entry.label ? `${entry.label}: ` : ""}${pickTemplateLine(entry)}`;
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
  els.turnChip.textContent = `Turn ${simState.turn}`;
  els.yearChip.textContent = `Year ${simState.year}`;
  els.growth.textContent = Math.round(simState.metrics.growth);
  els.strain.textContent = Math.round(simState.metrics.strain);
  els.legitimacy.textContent = Math.round(simState.metrics.legitimacy);
  els.budgetChip.textContent = `Budget ${simState.budget} (Selected ${selectedCost()})`;
  els.seedChip.textContent = `Seed ${simState.seed}`;
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
          <div class="run-line">Seed ${run.seed} | Stage ${run.stage} | Turn ${run.turn}</div>
          <div class="run-line">Cohesion ${Math.round(run.metrics.cohesion)} | Inequality ${Math.round(run.metrics.inequality)} | Legitimacy ${Math.round(run.metrics.legitimacy)}</div>
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
    <div class="summary-line">Functionalist lens: ${summary.funcLine}</div>
    <div class="summary-line">Conflict lens: ${summary.confLine}</div>
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
  const unlocked = simState.lastStageChange.unlocked
    .map((key) => INSTITUTIONS[key]?.label || key)
    .join(", ");
  els.stageBanner.textContent = `Stage ${simState.lastStageChange.to}: ${simState.lastStageChange.name}. Unlocked: ${unlocked}`;
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
  els.endgameModal.classList.remove("hidden");
  uiState.endgameShown = true;
  els.nextTurn.disabled = true;
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
  renderDashboards(simState);
  renderNews(simState);
  renderEvent(simState);
  renderMeta(simState);
  renderRuns();
  showStageBanner(simState);
  showEndgame(simState);
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
  const headers = ["turn", "year", "stage", ...Object.keys(state.metrics)];
  const rows = state.history.map((entry) => {
    const values = [entry.turn, entry.year, entry.stage];
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
    state = step(state, rng, { policyIds: Array.from(uiState.selectedPolicies) });
    uiState.selectedPolicies.clear();
    render(state);
    showSummary(state);
  });

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
}

function init() {
  initScenarioSelect();
  els.seedInput.value = state.seed;
  els.policySort.value = uiState.policySort;
  if (els.toneSelect) {
    els.toneSelect.value = uiState.tone;
  }
  renderTags();
  bindEvents();
  render(state);
}

init();
