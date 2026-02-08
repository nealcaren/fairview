# Project Title (working)

**Fairview**
*A sociological city-growth simulation of institutions, inequality, and legitimacy*

(Tagline for students: *Can you grow a city without tearing it apart?*)

---

# 1. Core Design Goals (Non-Negotiables)

### Pedagogical

* Teach **functionalism** as system integration and equilibrium
* Teach **conflict theory** as stratification, power, and unequal burden
* Make theory emerge from **play**, not exposition
* Allow comparison of outcomes under different evaluative lenses

### Design

* Feel “SimCity-like” in **growth and development**
* Avoid full infrastructure or agent simulation
* Keep all mechanics **formula-driven and explainable**
* Support short classroom play sessions (20–40 minutes)

### Technical

* Web-based (no installs)
* Buildable by a **small team**
* Expandable without rewrites

---

# 2. High-Level Game Structure

## Core Components

1. **City Grid (District-level)**
2. **Institutional System**
3. **Population Groups**
4. **Growth & Development Stages (4 stages)**
5. **Policy Cards**
6. **Event Deck**
7. **Dual Dashboards (Functionalism & Conflict)**

All systems update once per **turn** (≈ 1 year).

---

# 3. City Grid System

## Grid Design

* Initial size: **6×6 grid** (expandable to 8×8 later)
* Each tile = **Neighborhood District**
* No roads, no zoning, no traffic simulation

## District State Variables (per tile)

Each district stores:

| Variable             | Description                       |
| -------------------- | --------------------------------- |
| Population           | Low / Medium / High               |
| Income Tier          | Low / Middle / High               |
| Housing Cost         | Numeric index                     |
| Cohesion             | Social integration proxy          |
| Institutional Access | Computed from nearby institutions |
| Risk Exposure        | Pollution, policing, displacement |
| Development Level    | Visual upgrade tier               |

Districts update via formulas, not agents.

---

## District Growth Mechanics

### Population Growth

* Driven by city-wide growth + local access
* Can be blocked by high housing cost or displacement

### Density Upgrades

* Low → Medium → High
* Higher density boosts productivity, raises strain

### Class Shifts

* Districts can:

  * Upgrade (gentrification)
  * Stabilize
  * Decline (disinvestment)

These are *outcomes*, not player commands.

---

# 4. Development Stages (Locked Backbone)

The city progresses through **4 stages**, unlocked by growth thresholds *and* institutional readiness.

## Stage 1 — Foundational City

* Sparse grid
* High cohesion, low capacity
* Institutions: Economy, Family, Education, Polity

## Stage 2 — Expansion City

* Rapid grid filling
* Infrastructure lag appears
* Unlock: Health, Criminal Justice, Media

## Stage 3 — Stratified Metropolis

* Clear spatial inequality
* Credential stratification
* Unlock: Welfare, Higher Ed, Housing Policy, Finance

## Stage 4 — Globalized City

* Extreme density and polarization
* Legitimacy volatility
* Unlock: Surveillance, Global Capital, Climate Infrastructure

Stage transitions can trigger **crisis events** if inequality or capacity is mismanaged.

---

# 5. Institutions System

## Institutions (Final Set)

Each institution has **2 player levers** and **radius-based grid effects**.

| Institution      | Levers                                |
| ---------------- | ------------------------------------- |
| Economy          | Wage standards; Corporate taxes       |
| Polity           | Voting access; Anti-corruption        |
| Education        | Public funding; Discipline/tracking   |
| Family/Community | Childcare; Housing support            |
| Health           | Public health spending; Mental health |
| Criminal Justice | Policing level; Diversion             |
| Media            | Public info; Platform regulation      |
| Welfare          | Benefit generosity; Eligibility       |
| Housing          | Zoning reform; Public housing         |
| Finance          | Regulation; Deregulation              |

Institutions affect:

* Local districts (radius)
* City-wide dashboards
* Group-specific outcomes

---

# 6. Population Groups (Conflict Layer)

## Groups (City-wide, not spatial agents)

| Group        | Size   | Power    | Sensitivity      |
| ------------ | ------ | -------- | ---------------- |
| Elite        | Small  | High     | Tax, regulation  |
| Middle       | Medium | Medium   | Stability, costs |
| Working      | Large  | Low      | Wages, housing   |
| Marginalized | Large  | Very low | Policing, health |

Each group tracks:

* Income
* Well-being
* Political influence
* Grievance

Grievance feeds protest, legitimacy loss, and reform pressure.

---

# 7. Growth System (SimCity Feel)

## City Growth Index

A single visible meter driven by:

* Economic productivity
* Population
* Institutional capacity

Growth provides:

* Budget expansion
* New districts
* Institutional unlocks

But growth also **automatically increases strain**:

* Housing pressure
* Inequality slope
* Institutional lag

Growth is never neutral.

---

# 8. Policy Card System

Each turn, player selects **1–2 policy cards** (budget constrained).

Each card defines:

* Manifest function
* Latent effects
* Distributional effects
* Lag time (immediate vs delayed)

### Example Card

**“Expand Policing”**

* Disorder ↓
* Legitimacy ↓ (marginalized districts)
* Elite satisfaction ↑
* Protest risk ↑ (lagged)

Policy cards are how theory becomes mechanics.

---

# 9. Event Deck

## Event Types

* Economic
* Social
* Political
* Environmental
* Media/Legitimacy

Events target:

* Specific districts
* Specific groups
* Specific institutions

### Example

**“Housing Bubble”**

* Housing costs spike in high-access districts
* Gentrification accelerates
* Working-class displacement risk ↑

Events force players to confront tradeoffs.

---

# 10. Dual Dashboards (Theoretical Lenses)

## Functionalism Dashboard

* Social cohesion
* Institutional capacity
* System legitimacy
* Disorder
* Resilience

## Conflict Dashboard

* Inequality index
* Mobility
* Political capture
* Group burden
* Contestation risk

Same actions → different evaluations.

---

# 11. Turn Loop (Core Gameplay)

Each turn:

1. Event triggers (or not)
2. Player selects policies
3. Growth + institutional updates
4. District updates
5. Group outcomes computed
6. Dashboards update
7. Newsfeed narrates interpretation

Target turn length: **2–3 minutes**

---

# 12. Visual & UX (Low Cost, High Effect)

## City Map

* 2D grid
* Color-coded districts
* Density via building silhouettes
* Icons for institutions

## Growth Feedback

* Skyline evolution
* District upgrading
* Visible segregation patterns

## Theory UI

* Toggle between Functionalist / Conflict overlays
* Tooltips explain why metrics change

---

# 13. Win / Endgame States

No “win screen.” Instead, **societal outcomes**:

* Stable Welfare Metropolis
* Corporate Oligarchy
* Fragmented Megacity
* Democratic Renewal
* Crisis Collapse

Students compare trajectories.

---

# 14. Development Roadmap (Realistic)

## Phase 1 — Prototype (4–6 weeks)

* 6×6 grid
* 4 institutions
* Growth meter
* One dashboard
* No events

## Phase 2 — Core Game (8–10 weeks)

* All institutions
* Population groups
* Dual dashboards
* Policy cards
* Basic events

## Phase 3 — Polish + Pedagogy (6–8 weeks)

* Visual upgrades
* Event diversity
* Theory tooltips
* Classroom mode (short scenarios)

---

# 15. Team Roles

Minimum viable team:

* **Lead Designer** (you / sociology)
* **Gameplay Engineer**
* **Front-end/UI dev**
* **Art/UI support** (icons, tiles)
* **Pedagogy advisor** (rubrics, assignments)

---

# 16. Classroom Integration (Important)

Planned uses:

* Single-class simulation
* Homework replay with reflection
* Comparative theory write-ups
* “Optimize stability vs equity” challenges

Assessment focuses on:

* Diagnosis, not “winning”
* Theory-mechanic explanation
* Tradeoff reasoning

---

# 17. What This Is *Not*

Explicitly excluded:

* Traffic simulation
* Individual agent AI
* Freeform city building
* Realistic economics

This is **sociological simulation**, not urban engineering.

---

## Final Note to Your Team

This project succeeds if:

* Growth feels real
* Inequality becomes visible
* Stability feels morally ambiguous
* Students argue about outcomes

If those things happen, the theory landed.

