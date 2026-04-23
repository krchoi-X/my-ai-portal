# AGENTS.md

## Project
This is a local-first personal investing portal MVP (version 0.1).

The app is not a trading assistant.
The app is not an auto-trading tool.
The app is a portfolio design and review dashboard.

## Tech stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Local file storage only
- No database in v0.1

## Core pages
- `/` dashboard
- `/investing`
- `/investing/targets`
- `/investing/assets/input`
- `/investing/assets/classify`
- `/memory`
- `/settings`
- `/content`
- `/travel`
- `/education`
- `/health`

## Data rules
- Raw history is stored in CSV under `app-data/raw/`
- Config and latest summary are stored in JSON under `app-data/config/` and `app-data/current/`
- Notes can be stored later as markdown under `app-data/notes/`
- Do not introduce a database
- Do not introduce external APIs yet
- Do not add auth
- Do not add charts in v0.1

## Portfolio model
Each asset must have exactly one bucket per axis.
Axes for v0.1:
- geography
- theme
- role

No multi-classification per axis.
If classification feels ambiguous, create a new axis later instead of allowing multiple buckets.

## UX rules
- Dashboard must prioritize portfolio review
- Portfolio card must show target vs current vs deviation
- Asset input and asset classification must be separate flows
- Classification UI should support drag-and-drop
- Other sections like content/travel/education/health are simple link hubs in v0.1

## Implementation priorities
1. App shell and sidebar/header layout
2. Read local JSON/CSV mock data
3. Render dashboard cards
4. Build investing targets page
5. Build asset input page
6. Build asset classify page
7. Keep components simple and editable

## Constraints
- Keep styling clean and minimal
- Favor modular components
- Avoid overengineering
- Avoid introducing agent systems
- Avoid market prediction logic
- Avoid transaction/order features

## Done criteria for v0.1
- Local app runs successfully
- Dashboard reads mock data from files
- Portfolio card shows axis-based target/current/deviation
- Targets page can display/edit target structure
- Asset input page can add holdings
- Asset classify page can assign assets to buckets
