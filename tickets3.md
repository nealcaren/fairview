## EPIC 1 — UI Simplification & Workflow Focus

### TICKET 1.1 — Embed Inspector & Restructure Grid Layout

**Type:** Task
**Goal:** Reduce eye movement by placing context (inspector) directly next to the focus (grid), and clean up the left panel.
**Acceptance criteria**

* Move the `<div id="inspector">` inside the `div class="panel"` containing the City Grid.
* Update Inspector CSS to look like an embedded HUD rather than a standalone panel.
* Update `renderInspector` logic to handle the "empty state" (when no district is selected) with a placeholder message like "Tap a district to inspect".
* **Result:** Users no longer have to look at a separate panel to see what a tile represents.

---

### TICKET 1.2 — Implement "Game Loop" Tabs (Briefing/Actions/Data)

**Type:** Feature
**Goal:** Break the overwhelming "dashboard" into a focused game loop: See Status -> Take Action -> Analyze Data.
**Acceptance criteria**

* Refactor `index.html` "Right Section" into three tabbed containers:
1. **Briefing:** Metrics, Event, Newsfeed.
2. **Actions:** Policy Cards, Token Placement, and the "Next Turn" button.
3. **Data:** Detailed dashboards (Functionalism/Conflict) and Admin/Run controls.


* Create CSS for `.tabs`, `.tab-link`, and `.tab-pane` to handle switching.
* Add JS logic to switch active tabs when clicked.

---

### TICKET 1.3 — Progressive Disclosure for Admin Tools

**Type:** Task
**Goal:** Hide setup and debug tools once the game starts to reduce cognitive load.
**Acceptance criteria**

* Move "Simulation Setup" and "Runs" (Export/Replay) into the **Data** tab or a collapsible `<details>` block.
* Add logic to `startSimulation` in `app.js` that adds a `.hidden` class to the setup/admin container once the game begins.
* Ensure "Restart" button remains accessible in the Data tab if the user gets stuck.

---

## EPIC 2 — Mobile Responsiveness

### TICKET 2.1 — Implement Mobile View Switcher (Map vs. Office)

**Type:** Feature
**Goal:** Allow the game to work on narrow screens where the 2-column layout fails.
**Acceptance criteria**

* Create a fixed bottom navigation bar (`.mobile-nav`) visible only on screens < 900px.
* Define two distinct mobile views:
1. **City Map:** Shows Left Section (Grid + Legend + Inspector).
2. **City Hall:** Shows Right Section (The Tabs: Briefing/Actions/Data).


* Add CSS Media Queries to hide the non-active section on mobile.
* Add JS logic to toggle visibility between Map and Office sections.

---

### TICKET 2.2 — Touch Optimization & styling

**Type:** Task
**Goal:** Ensure the game is playable with thumbs.
**Acceptance criteria**

* Increase padding on all `<button>` elements (Primary, Secondary, Policy Cards) to minimum 44px height.
* Update Grid Tiles on mobile: Hide tiny text (Tier/Density) and show only Icons to prevent clutter; keep full details in the Inspector.
* Disable double-tap zoom with viewport meta tag adjustments.
* Ensure the "Next Turn" button is prominent and easily clickable in the "Actions" tab.



## EPIC 9 — Strategic Depth & Institutional Interdependence

### TICKET 9.1 — Institutional "Synergy" Bonuses

**Type:** Feature / Mechanic
**Goal:** Gamify the "Functionalist" concept that institutions work better when integrated.
**Concept:**
If a player places specific tokens adjacent to each other on the grid, they trigger a "Synergy" effect that boosts their output.

**Acceptance Criteria:**

* **Logic:**
* **School + Community Center:** "Extended Learning" (Cohesion +2, Mobility +2)
* **Transit + Clinic:** "Accessible Care" (Health access radius increases by 1)
* **Police + Housing Policy:** "Community Policing" (Mitigates the negative cohesion hit from policing)


* **UI:** When placing a token, if it creates a synergy, show a "Link" icon or particle effect connecting the two tiles.
* **Feedback:** Newsfeed log: "Synergy active: Transit integration improved clinic access."

---

### TICKET 9.2 — "Dilemma" Events (Active Choices)

**Type:** Feature
**Goal:** Move events from passive "shocks" to active "governance choices."
**Concept:**
Instead of an event just applying stats (e.g., "Strike happens, Economy -10"), present a modal with two choices representing sociological trade-offs.

**Example: "The Rent Strike"**

* **Option A (Conflict Theory):** *Enforce Evictions.*
* Cost: 20 Legitimacy.
* Effect: Growth is saved, but Marginalized Grievance spikes.


* **Option B (Functionalism):** *Mediated Settlement.*
* Cost: 15 Budget.
* Effect: Cohesion holds, but Growth stagnates.



**Acceptance Criteria:**

* Create a `Dilemma` event type in `engine.js`.
* UI renders a modal forcing a choice before the turn proceeds.
* The choice directly impacts the "Interpretation" text in the newsfeed.

---

## EPIC 10 — "Game Juice" and Visual Feedback

### TICKET 10.1 — Floating Text and Tile Animations

**Type:** UX / Polish
**Goal:** Make the simulation feel alive and responsive (immediate reinforcement of cause-and-effect).
**Concept:**
When a metric changes significantly, visually represent it on the grid or dashboard.

**Acceptance Criteria:**

* **Tile Changes:** If a district upgrades its Tier (Low->Mid), the tile should flash white or "pop" (scale up/down).
* **Floating Integers:** When a policy is clicked, float text over the relevant Dashboard metric (e.g., green "+5" over Legitimacy, red "-10" over Budget).
* **Grid Floaters:** If "Rent Control" is clicked, float "-$$" over the specific Low Income districts affected on the map.

---

### TICKET 10.2 — The "Sociological Snapshot" Share Card

**Type:** Social / Pedagogy
**Goal:** Give students a "trophy" they can submit for homework or share, summarizing their city's sociological profile.
**Concept:**
At Game Over (Turn 20), generate a visually distinct "Card" summarizing their run.

**Acceptance Criteria:**

* **Visuals:** A generated HTML canvas or stylized div containing:
* The City Name (Seed).
* The Final Skyline (a mini-visual of the grid).
* **The Archetype Label:** (e.g., "The Benevolent Surveillance State" or "The Fractured Utopia").
* **Key Stat:** "Gini Coefficient: 0.45 (High Inequality)".


* **Action:** A "Download Image" or "Copy to Clipboard" button.
* **Pedagogy:** The Archetype Label is derived from the final balance of Conflict vs. Functionalist metrics.

---

### TICKET 10.3 — "Predict the Outcome" Mini-Game (Optional)

**Type:** Pedagogy / Mechanic
**Goal:** Force students to read and understand the theory *before* acting.
**Concept:**
Once per game (or on specific high-stakes turns), when a player selects a complex policy, ask a "Advisor Question."

**Example:**

* *Player selects "Gentrifcation Zoning"*
* *Advisor Pop-up:* "Sociologically, who will bear the burden of this policy?"
* A) The Elite
* B) The Marginalized (Correct)
* C) The Middle Class


* **Reward:** If they answer correctly, the Policy costs 10% less Budget (representing "Political Competence").
* **Failure:** Policy costs normal amount.

**Acceptance Criteria:**

* Add a `quiz` field to `POLICY_CARDS`.
* UI to handle the interruption modal.
* Integration with Budget logic.