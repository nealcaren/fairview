# Fairview Prototype

A sociological city-growth simulation built for SOCI 101 theory instruction.

## Run

No install needed.

1. Open `index.html` in a browser.
2. Optional: run a local server for module imports.

```bash
python3 -m http.server
```

Then visit `http://localhost:8000`.

## File Overview

- `index.html`: UI layout and containers.
- `styles.css`: visual styling.
- `app.js`: UI state, rendering, interactions.
- `engine.js`: simulation engine, constants, and state updates.
- `docs/state-schema.md`: formal schema for simulation state.

## Where To Add Content

- Policies: `POLICY_CARDS` in `engine.js`.
- Events: `EVENTS` in `engine.js`.
- Tokens: `TOKEN_TYPES` in `engine.js`.
- Scenarios: `SCENARIOS` in `engine.js`.

## Stage Progression

Stages are defined in `STAGES` in `engine.js`. A stage advances when:

- `growth >= growthMin`
- `capacity >= readinessMin`

When a stage changes, the engine logs a news entry and exposes the unlocked institutions.

## Core Constants

- `GRID_SIZE` in `engine.js`
- `STAGES` in `engine.js`
- `EVENT_CHANCE` in `engine.js`

## How To Test (Manual Checklist)

- Select 0, 1, and 2 policies and advance a turn.
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
