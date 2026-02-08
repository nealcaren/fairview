# EPIC W1 — Satirical Newsfeed System

## TICKET W1.1 — Add “Interpretive Newsfeed Templates” Layer

**Type:** Feature
**Goal:** Replace neutral event logs with sociologically interpretive narration.

### Description

Currently the newsfeed displays descriptive updates (e.g., growth change, strain change). Add a template system that renders events using interpretive or satirical text.

Each event should have:

```
{
  id: "housing_cost_spike",
  templates: {
    neutral: "...",
    civic: "...",
    satirical: "..."
  }
}
```

Mode selected via UI toggle.

---

### Acceptance Criteria

* Newsfeed renders at least one interpretive line per turn
* Text reflects actual metric changes
* Tone toggle switches output text
* Newsfeed remains scrollable and chronological

---

### CONTENT — Initial Newsfeed Line Library

#### Housing & Growth

* “City leaders celebrated a ‘vibrant housing market’ as long-time residents celebrated moving in with relatives.”
* “Luxury developments broke ground; affordable housing broke hearts.”
* “Housing demand surged, followed closely by housing anxiety.”
* “New towers reshaped the skyline and reshuffled the neighborhood.”

#### Inequality

* “Economic growth continued, though not everyone seemed invited.”
* “The wealth gap widened, providing excellent views for those at the top.”
* “Prosperity rose citywide, though it stopped at certain zip codes.”
* “Middle-income families reported feeling ‘statistically stable.’”

#### Policing & Order

* “Officials reported improved order downtown. Residents reported improved anxiety.”
* “Police presence increased, along with debates about presence itself.”
* “Disorder declined, trust remained under review.”
* “Safety metrics improved; legitimacy metrics filed an appeal.”

#### Education

* “School funding rose, inspiring hope and construction delays.”
* “Graduation rates climbed; tuition followed.”
* “Students gained opportunity and student loan obligations.”
* “Class sizes shrank, expectations expanded.”

#### Bureaucracy

* “A committee was formed to study the recommendations of a previous committee.”
* “City council approved a task force to explore future approvals.”
* “Public hearings were scheduled to discuss scheduling future hearings.”
* “Officials praised the efficiency of a new efficiency initiative.”

---

# EPIC W2 — Civic Characters & Commentary

## TICKET W2.1 — Add “Civic Voices” Commentary System

**Type:** Feature
**Goal:** Introduce recurring figures who interpret city developments.

### Description

Add a system where major events trigger quotes from civic figures.

Each character has:

```
{
  name:
  role:
  ideology:
  quoteTemplates: []
}
```

Quotes selected based on event type + character ideology.

---

### Acceptance Criteria

* At least 1 character quote appears every 2–3 turns
* Quotes align with event context
* Character name + role displayed in newsfeed
* Characters recur across playthrough

---

### CONTENT — Civic Character Roster

**Mayor Elena Cruz — Political legitimacy**

* “Growth must serve everyone, or it serves no one.”
* “Order and opportunity must advance together.”
* “Our challenge isn’t expansion — it’s inclusion.”

**Lionel Price — Real estate developer**

* “Rising rents signal confidence in our city.”
* “Investment goes where vision leads.”
* “Growth requires bold redevelopment.”

**Rosa Alvarez — Labor organizer**

* “Productivity is rising. Wages are thinking about it.”
* “Workers built this city — they deserve to live in it.”
* “Prosperity without equity is extraction.”

**Rev. Thomas Hale — Community leader**

* “Neighborhoods thrive on trust, not just investment.”
* “Cohesion cannot be rezoned.”
* “We are losing familiarity faster than we are gaining prosperity.”

**Dr. Mira Banerjee — Public health director**

* “Infrastructure is health policy.”
* “Housing instability is a medical risk factor.”
* “Strain shows up in clinics before it shows up in reports.”

**Jax Mercer — Tech entrepreneur**

* “Innovation is our greatest civic asset.”
* “Talent follows opportunity.”
* “Disruption is uncomfortable but necessary.”

---

# EPIC W3 — Absurd-but-Sociological Event Pack

## TICKET W3.1 — Add “Whimsy Event” Category

**Type:** Feature + Content
**Goal:** Introduce rare humorous but theory-grounded events.

### Implementation

* 5–10% chance event category
* Lower severity than crises
* Can influence cohesion, legitimacy, or growth

---

### CONTENT — Whimsy Event Deck

**“Viral Dance Craze”**

* Cohesion +5
* Productivity −2
* News: “City productivity dipped as synchronized dancing peaked.”

---

**“Celebrity Moves Downtown”**

* Growth +4
* Housing cost +6 (adjacent districts)
* News: “Star power illuminated downtown — and property values.”

---

**“City Rebrands as ‘Innovation Hub’”**

* Growth +6
* Legitimacy −2
* News: “Residents asked whether branding counts as infrastructure.”

---

**“Police Department Launches TikTok”**

* Legitimacy ± random
* Cohesion +2
* News: “Community engagement rose, along with secondhand embarrassment.”

---

**“University Builds Climbing Wall Instead of Dorms”**

* Education capacity +2
* Housing strain +4
* News: “Students gained recreation access and continued housing insecurity.”

---

# EPIC W4 — District Nicknames & Cultural Identity

## TICKET W4.1 — Add Dynamic District Nicknaming

**Type:** Feature
**Goal:** Reflect sociological identity formation spatially.

### Description

Districts acquire nicknames based on metrics.

Example rule:

```
if housingCost > threshold AND incomeHigh:
  nickname = "Rent Harbor"
```

---

### Acceptance Criteria

* Each district may gain 1 nickname
* Nickname displayed on hover
* Nickname persists unless conditions radically change

---

### CONTENT — Nickname Pool

**High inequality districts**

* “Two-Tier Terrace”
* “Splitview”
* “Dividend Heights”

**Gentrifying districts**

* “Rent Harbor”
* “Startup Gulch”
* “Artisan Alley”

**High cohesion districts**

* “Block Party Row”
* “Neighborly Square”
* “Union Commons”

**High policing districts**

* “Sirenside”
* “Patrol Point”
* “Bluewatch”

---

# EPIC W5 — Media Framing System

## TICKET W5.1 — Dual Media Headlines

**Type:** Feature
**Goal:** Show ideological framing differences.

### Description

When media fragmentation is high, events produce 2 headlines:

```
{
  proGrowth:
  equityCritical:
}
```

Displayed side-by-side in newsfeed.

---

### CONTENT — Headline Examples

**Economic boom**

* “City Economy Surges to Record Heights”
* “Growth Leaves Many Residents Behind”

**Policing expansion**

* “Crime Down After Police Investment”
* “Surveillance Expansion Sparks Concern”

**Housing development**

* “Downtown Revitalization Continues”
* “Displacement Fears Mount”

---

# EPIC W6 — Civic Achievements & Awards

## TICKET W6.1 — Add Achievement System

**Type:** Feature
**Goal:** Reward exploration of theoretical extremes.

---

### CONTENT — Achievement List

**“Growth at All Costs”**

* Max growth + max inequality

**“Well-Ordered but Watched”**

* Low disorder + low legitimacy

**“Equity Champion”**

* Inequality below threshold

**“Committee of Committees”**

* Trigger 5 bureaucracy events

**“Golden Skyline, Fractured Streets”**

* High growth + low cohesion

Displayed at endgame screen.

---

# EPIC W7 — Tone Control for Classroom Use

## TICKET W7.1 — Add “Tone Mode” Toggle

**Type:** Feature
**Goal:** Let instructors control whimsy level.

---

### Modes

| Mode      | Description          |
| --------- | -------------------- |
| Academic  | Neutral language     |
| Civic     | Light interpretation |
| Satirical | Full humor           |

---

### Acceptance Criteria

* Toggle persists session-wide
* Affects newsfeed + character quotes
* Does not change mechanics

