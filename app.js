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
  loadContent,
} from "./engine.js";

await loadContent();

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
    els.adminTools.classList.add("hidden");
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
    const tierDelta = simState.lastDistrictDeltas[district.id]?.incomeTier ?? 0;
    if (tierDelta > 0) {
      tile.classList.add("tier-up");
    }
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
      if (result.synergies && result.synergies.length) {
        window.requestAnimationFrame(() => playSynergyEffect(result.synergies));
      }
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
        if (uiState.selectedPolicies.size >= MAX_POLICIES_PER_TURN || currentCost + cardCost > simState.budget) {
          event.target.checked = false;
          return;
        }
        uiState.selectedPolicies.add(id);
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
  checkboxes.forEach((checkbox) => {
    const id = checkbox.dataset.card;
    const card = POLICY_CARDS.find((c) => c.id === id);
    if (!card) return;
    if (checkbox.checked) {
      checkbox.disabled = false;
    } else if (uiState.selectedPolicies.size >= MAX_POLICIES_PER_TURN) {
      checkbox.disabled = true;
    } else if (currentCost + policyCost(card) > simState.budget) {
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
    }
  });
  els.budgetChip.textContent = `Budget ${simState.budget} (Selected ${currentCost})`;
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
  if (uiState.selectedPolicies.size >= MAX_POLICIES_PER_TURN || currentCost + cardCost > state.budget) {
    renderPolicies(state);
    return;
  }
  uiState.selectedPolicies.add(card.id);
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
  if (key === "budget") return els.budgetChip;
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
    ["cohesion", "Cohesion", simState.metrics.cohesion],
    ["capacity", "Capacity", simState.metrics.capacity],
    ["legitimacy", "Legitimacy", simState.metrics.legitimacy],
    ["disorder", "Disorder", simState.metrics.disorder],
    ["resilience", "Resilience", simState.metrics.resilience],
  ];
  const conf = [
    ["inequality", "Inequality", simState.metrics.inequality],
    ["mobility", "Mobility", simState.metrics.mobility],
    ["capture", "Political Capture", simState.metrics.capture],
    ["burden", "Group Burden", simState.metrics.burden],
    ["contestation", "Contestation", simState.metrics.contestation],
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
  els.turnChip.textContent = `Turn ${simState.turn}`;
  els.yearChip.textContent = `Year ${simState.year}`;
  els.growth.textContent = Math.round(simState.metrics.growth);
  els.strain.textContent = Math.round(simState.metrics.strain);
  els.legitimacy.textContent = Math.round(simState.metrics.legitimacy);
  els.budgetChip.textContent = `Budget ${simState.budget} (Selected ${selectedCost()})`;
  els.seedChip.textContent = `Seed ${simState.seed}`;
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
  ctx.font = "600 22px 'Space Grotesk', sans-serif";
  ctx.fillText(title, 24, 36);
  ctx.font = "italic 18px 'DM Serif Text', serif";
  ctx.fillText(archetype, 24, 64);
  ctx.fillStyle = "#5f625f";
  ctx.font = "14px 'Space Grotesk', sans-serif";
  ctx.fillText(`Gini Coefficient: ${gini.toFixed(2)} (${giniLabel})`, 24, 90);

  const cell = 16;
  const gridSize = GRID_SIZE;
  const gridWidth = cell * gridSize;
  const gridX = width - gridWidth - 32;
  const gridY = 60;

  ctx.fillStyle = "#f1e2cf";
  ctx.fillRect(gridX - 8, gridY - 8, gridWidth + 16, gridWidth + 16);
  ctx.fillStyle = "#5f625f";
  ctx.font = "12px 'Space Grotesk', sans-serif";
  ctx.fillText("Final Skyline", gridX, gridY - 14);

  simState.districts.forEach((district) => {
    const color = district.incomeTier === 0 ? "#6aaed6" : district.incomeTier === 1 ? "#f0c36d" : "#d17b88";
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
    if (state.pendingDilemma) {
      showDilemmaModal(state);
      return;
    }
    advanceTurn();
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
  initScenarioSelect();
  els.seedInput.value = state.seed;
  els.policySort.value = uiState.policySort;
  if (els.toneSelect) {
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
}

init();
