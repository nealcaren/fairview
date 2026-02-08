## EPIC 0 — Project hygiene and conventions

### TICKET 0.1 — Add README + run instructions

**Type:** Task
**Goal:** Make the prototype runnable and hackable by the whole team.
**Acceptance criteria**

* `README.md` includes: local run instructions, file overview, where to add policies/events, how stages progress
* Includes “how to test” (even if manual checklist)
* Links to core constants: grid size, stages, event chance

---

### TICKET 0.2 — Define a stable “GameState” schema doc

**Type:** Task
**Goal:** Prevent ad-hoc state growth as features expand.
**Acceptance criteria**

* A `docs/state-schema.md` describing: `state.metrics`, `state.districts[]`, `state.groups`, `state.institutions`, `pendingEffects`
* Explicit definitions of each metric’s meaning and bounds (0–100)
* Notes where each field is computed (e.g., `computeMetrics`, `computeDistricts`)

---

## EPIC 1 — Core simulation correctness and extensibility

### TICKET 1.1 — Separate simulation engine from rendering

**Type:** Refactor
**Goal:** Make it safe to add features without breaking UI.
**Details**

* Create `engine/` module (or `engine.js`) exporting pure functions:

  * `step(state, rng)` (one turn)
  * `applyEffects(state, effects)`
  * `computeMetrics(state)`, `computeDistricts(state)`, `computeGroupOutcomes(state)`
* UI layer only calls `render(state)` and dispatches actions (select policy, next turn)
  **Acceptance criteria**
* `nextTurn()` becomes a thin wrapper that calls `step()`
* No DOM access inside engine functions
* Render functions take `state` as parameter, no hidden globals

---

### TICKET 1.2 — Deterministic seeded RNG mode

**Type:** Feature
**Goal:** Classroom reproducibility (“everyone plays the same shock sequence”).
**Acceptance criteria**

* Add `seed` param (query string or UI input)
* All randomness uses seeded RNG (district init, events)
* With same seed: identical turn-by-turn outcomes

---

### TICKET 1.3 — Fix “budget shock” clamping bug

**Type:** Bug
**Why:** You currently clamp shocks with 0–100 in a way that can prevent negative budget shocks (depending on how you’re storing them).
**Acceptance criteria**

* `shocks.budget` can represent negative and positive adjustments (e.g., range -50..50)
* `resetBudget()` uses it correctly
* Add a small unit test or console assertion for negative shock case

---

## EPIC 2 — “SimCity feel” through visible development and district inspection

### TICKET 2.1 — District hover/click inspector panel

**Type:** Feature
**Goal:** Let students *see* spatial inequality and diagnose outcomes.
**UI changes**

* Clicking a tile opens a right-side mini-panel (or modal) showing:

  * Income tier, population (value + label), access, risk, cohesion, housing cost, dev level
* Add “Why this changed?” section listing top 2–3 drivers (explainability)
  **Acceptance criteria**
* Tile click highlights tile
* Inspector shows live values
* Shows last-turn deltas (e.g., housing cost +4)
* No performance issues on 6×6 grid
  (Your grid is rendered inside `#grid`  and tiles are styled by `.tile` .)

---

### TICKET 2.2 — Visual development upgrades per district

**Type:** Feature
**Goal:** Make growth visible without adding infrastructure simulation.
**Implementation**

* Add a skyline “tier” indicator per tile based on `devLevel`
* Use simple CSS markers (e.g., ▂ ▅ █) or small building icons
  **Acceptance criteria**
* Each tile displays a consistent dev marker
* Marker changes as `devLevel` changes
* Legend updated to explain dev markers

---

### TICKET 2.3 — Stage transition cinematic + unlock announcement

**Type:** Feature
**Goal:** Make stage progression feel like “the city developed.”
**Acceptance criteria**

* On stage change, show a banner/overlay for 2 seconds:

  * “Stage 2: Expansion City — New institutions unlocked: Health, Justice, Media”
* Add a newsfeed entry with the same info

---

## EPIC 3 — Theory lenses (Functionalism vs Conflict) as real overlays

### TICKET 3.1 — Dashboard toggle affects grid coloring

**Type:** Feature
**Goal:** Same city, different theory lens.
**UI**

* Add toggle buttons: “Income” (default), “Functionalism,” “Conflict”
* Grid color mapping:

  * Income: existing tier colors
  * Functionalism: color by cohesion or (cohesion - disorder)
  * Conflict: color by burden/risk or (housingCost + risk)
    **Acceptance criteria**
* Toggle persists across turns
* Legend updates dynamically
* Uses the existing legend area in the Grid panel header 

---

### TICKET 3.2 — Add “Interpretation blurbs” per turn

**Type:** Feature
**Goal:** Make theory explicit without lecturing.
**Acceptance criteria**

* At end of each turn, append two short lines:

  * Functionalist read: “Integration improved as cohesion rose, lowering disorder.”
  * Conflict read: “Capture increased as elite influence outpaced others.”
* These are auto-generated based on metric deltas (top 1–2 movers)

---

## EPIC 4 — Institutions as place-based effects (without roads)

### TICKET 4.1 — Place institutions on districts (limited slots)

**Type:** Feature
**Goal:** Give the player spatial choices that create unequal development.
**Mechanic**

* Each turn, if budget allows, player may “place” one institution token (School/Clinic/Transit/Police/Community Center)
* Each token has radius effect on nearby districts (Manhattan distance ≤ 1)
  **Acceptance criteria**
* UI to select a token and click a tile to place it
* District state includes `tokens: []`
* `computeDistricts()` accounts for nearby tokens (access, risk, cohesion effects)

---

### TICKET 4.2 — Add token rendering on tiles

**Type:** UI
**Goal:** Make placements visible.
**Acceptance criteria**

* Tile shows 1–3 small icons for tokens
* Hovering icon shows tooltip of effect

---

## EPIC 5 — Policies and effects system upgrades

### TICKET 5.1 — Policy card detail drawer (“effects preview”)

**Type:** Feature
**Goal:** Let students reason causally before choosing.
**Acceptance criteria**

* Clicking a policy opens a drawer showing:

  * cost, stage requirement
  * immediate effects (city/group/district/institution)
  * delayed effects (with “turn +1”)
* Also show “Who benefits / who bears burden” summary derived from effects

---

### TICKET 5.2 — Add policy tags and sorting

**Type:** Feature
**Goal:** Make it usable once you have 30–60 cards.
**Acceptance criteria**

* Policies have tags: `Growth`, `Equity`, `Legitimacy`, `Order`, `Capacity`
* UI filter chips above policy list
* Sorting by cost / impact (optional)

---

### TICKET 5.3 — Add 12 more policy cards (content sprint)

**Type:** Content
**Goal:** Increase strategic variety early.
**Acceptance criteria**

* Add 12 cards spanning stages 1–4
* Ensure at least 3 cards have delayed effects
* Ensure at least 4 have clear distributional tradeoffs

---

## EPIC 6 — Events and crisis dynamics

### TICKET 6.1 — Weighted event selection based on city conditions

**Type:** Feature
**Goal:** Events should feel endogenous, not random.
**Acceptance criteria**

* If housingCostAvg high → Housing Bubble more likely
* If legitimacy low + grievance high → Protest Wave more likely
* If strain high → Crime Spike more likely
* Keep a small chance of “exogenous” events

---

### TICKET 6.2 — Crisis cascade system

**Type:** Feature
**Goal:** “Growth without capacity” produces spirals.
**Acceptance criteria**

* If (growth > threshold AND capacity < threshold) for 2 turns:

  * automatically triggers a crisis event
  * applies multi-turn debuff to legitimacy/strain
* Crisis is clearly labeled in UI and newsfeed

---

## EPIC 7 — Classroom mode and assessment hooks

### TICKET 7.1 — Scenario presets (“Stability run” vs “Equity run”)

**Type:** Feature
**Goal:** Structured assignments.
**Acceptance criteria**

* Presets change starting metrics and initial district distribution
* Presets selectable at start:

  * “Industrial takeoff”
  * “Segregated growth”
  * “Post-crisis recovery”
* Presets are seed-compatible

---

### TICKET 7.2 — Export run summary JSON (and CSV)

**Type:** Feature
**Goal:** Students submit runs + you can analyze outcomes.
**Acceptance criteria**

* Export button outputs:

  * seed, policies chosen per turn
  * metrics per turn
  * group outcomes per turn
  * stage transitions
* Downloads JSON; optional CSV of metrics over time

---

## EPIC 8 — QA, usability, and accessibility

### TICKET 8.1 — Add basic keyboard and screen-reader affordances

**Type:** Accessibility
**Acceptance criteria**

* Buttons are reachable and labeled
* Policy selection works via keyboard
* Tile inspector usable without mouse

---

### TICKET 8.2 — Add “manual test checklist” for releases

**Type:** QA
**Acceptance criteria**

* Checklist covers:

  * selecting 0/1/2 policies
  * budget constraints
  * event triggers
  * stage transition
  * overlay toggle
  * export
