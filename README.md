# Fairview Prototype

A sociological city-growth simulation built for SOCI 101 theory instruction.

## Run

No install needed.

1. Start a local server (required for loading content packs).

```bash
python3 -m http.server
```

Then visit `http://localhost:8000`.

## Automated E2E Tests

Playwright tests are included for onboarding, progressive complexity, endgame state, and exports.

1. Install dev dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

3. Run end-to-end tests:

```bash
npm run test:e2e
```

## File Overview

- `index.html`: UI layout and containers.
- `styles.css`: visual styling.
- `app.js`: UI state, rendering, interactions.
- `engine.js`: simulation engine, constants, and state updates.
- `docs/state-schema.md`: formal schema for simulation state.

## Where To Add Content

- Newsfeed text: `content/newsfeed.json`.
- Civic characters: `content/characters.json`.
- Whimsy events: `content/events_whimsy.json`.
- District nicknames: `content/nicknames.json`.
- Media headlines: `content/headlines.json`.
- Citizen micro-voices: `content/citizen_quotes.json`.
- Achievement labels: `content/achievements.json`.
- Policies: `POLICY_CARDS` in `engine.js`.
- Events: `EVENTS` in `engine.js`.
- Tokens: `TOKEN_TYPES` in `engine.js`.
- Scenarios: `SCENARIOS` in `engine.js`.

## Stage Progression

Stages are defined in `STAGES` in `engine.js`. A stage advances when:

- `growth >= growthMin`
- `capacity >= readinessMin`

Progressive complexity now ramps by stage:

- Stage 1 starts simpler: many districts are undeveloped (`Dev 0`), only a subset of token resources is unlocked, event intensity is lower, and policy selection is capped at 1.
- Later stages unlock more institutions, more token types, more complex events (including dilemmas), and full policy capacity.

When a stage changes, the engine logs news and exposes newly unlocked institutions/resources.

## Core Constants

- `GRID_SIZE` in `engine.js`
- `STAGES` in `engine.js`
- `EVENT_CHANCE` in `engine.js`

## How To Test (Manual Checklist)

- In Stage 1, select 0 and 1 policy and advance a turn; verify selecting a second policy is blocked.
- Reach Stage 2+, then verify selecting up to 2 policies is available.
- Confirm some districts begin as `Dev 0` and can’t receive token placements until they develop.
- Confirm budget constraints disable over-budget policies.
- Confirm events appear at least once across 5 turns.
- Trigger a stage transition and observe banner + news entry.
- Toggle Income / Functionalism / Conflict overlays and confirm grid recolors.
- Place a token and confirm nearby districts change next turn.
- Switch tone modes and confirm newsfeed text updates.
- Confirm a civic quote appears every 2-3 turns.
- Confirm district nicknames appear after a few turns.
- Reach endgame (turn 20) and confirm achievements modal.
- Export JSON and CSV and confirm downloads contain turn history.
