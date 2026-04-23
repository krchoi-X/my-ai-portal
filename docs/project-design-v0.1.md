# Personal Investing Portal v0.1 – Project Design

## 1. Product definition

### One-line definition
A local-first personal portal for portfolio design, review, and linked AI work history.

### What this product is
- A portfolio design and review dashboard
- A local-first workspace that keeps structured records
- A hub for related GPT tools and prior work history

### What this product is not
- Not a trading assistant
- Not an auto-trading tool
- Not a short-term signal product
- Not an external market API product in v0.1

---

## 2. Scope of v0.1

### Included in v0.1
- Local Next.js web app running on the user's Mac
- Dashboard page
- Investing page
- Targets page
- Asset input page
- Asset classification page
- Simple hub pages for content / travel / education / health
- Local file-based storage under `app-data/`
- Mock data loading from JSON and CSV
- Git-based iteration workflow

### Excluded from v0.1
- Authentication
- Database
- External APIs
- LLM API integration
- Auto-sync with ChatGPT history
- Charts and chart explanations
- Agent systems
- Trading / execution workflows

---

## 3. Core product principle

The product helps the user review and maintain a portfolio structure.

It is designed around:
- target allocation
- current allocation
- deviation by axis
- historical records
- linked external GPT workflows

The product does not focus on:
- market timing
- trade recommendations
- order execution

---

## 4. Information architecture

### Left sidebar = single global navigation
The left sidebar is the only primary navigation for page switching.

Sidebar items:
- Dashboard
- Investing
- Content
- Travel
- Education
- Health
- Memory
- Settings

### Right content area = page content only
The right content area should not contain secondary tab-like navigation for page switching.

It may contain:
- page title
- short description
- optional action buttons

### Important rule
Left = navigation  
Right header = title / description / actions  
Right body = page content

There should be no inconsistent top-right tab-like controls that appear/disappear across pages.

---

## 5. Dashboard definition

The dashboard is a review screen, not a landing page.

### Priority order
1. Market signal
2. Macro overview
3. Portfolio target vs current vs deviation
4. AI / GPT link hub
5. Recent records (future-friendly area)

### Dashboard goals
- Show whether the current portfolio needs review
- Show the current market state
- Show macro values
- Show the largest portfolio drift
- Provide quick entry into related GPT tools

---

## 6. Investing module

### Purpose
The investing module helps the user:
- define target structure
- input assets
- classify assets
- compare current vs target
- review drift by axis

### Classification model
Each asset must have exactly one bucket per axis.

Initial axes:
- geography
- theme
- role

No multi-classification per axis.

If classification feels ambiguous, add another axis later instead of allowing multiple buckets per axis.

---

## 7. Portfolio workflow

### Step 1
Define targets

### Step 2
Input assets

### Step 3
Classify assets by axis

### Step 4
Generate current summaries

### Step 5
Review drift

---

## 8. File-based storage model

### Config
Stored under `app-data/config/`

Examples:
- `portfolio_axes.json`
- `portfolio_buckets.json`
- `portfolio_targets.json`
- `portfolio_assets.json`
- `macro_definitions.json`
- `links.json`

### Current summaries
Stored under `app-data/current/`

Examples:
- `market_signal.json`
- `macro_latest.json`
- `portfolio_latest.json`

### Raw history
Stored under `app-data/raw/`

Examples:
- `macro_history.csv`
- `portfolio_holdings.csv`

### Future notes / records
Stored under:
- `app-data/notes/`
- `app-data/records/` (planned future scope)

---

## 9. Hub pages beyond investing

### Current principle
Content / Travel / Education / Health are not fully developed workspaces in v0.1.

They are lightweight hub pages.

### What they should contain in v0.1
- related GPT links
- basic description
- placeholders for recent records
- future expansion path

### What they should NOT contain in v0.1
- full project workspace logic
- rich editing flows
- complex state management
- deep project boards

---

## 10. Record hub concept

The hub pages should evolve into:
- GPT entry points
- past work history hubs

This means a page like Travel should later contain:
- GPT links
- saved trip records
- links to prior ChatGPT work
- summaries and tags

Examples:
- Sapporo trip planning
- hotel comparison
- flight selection
- generated images
- final notes

The same principle applies to:
- content work
- education sessions
- health journeys

---

## 11. Future feature: External chat import

### Problem
If future LLM/API workflows happen inside the portal, those records can be saved automatically.

But work done outside the portal:
- on another device
- in the ChatGPT app
- in a separate GPT
will not automatically appear inside the portal.

### Planned solution
Add an external chat import workflow.

### Future workflow
1. Register external ChatGPT/GPT link
2. Create a record card
3. Summarize the imported work
4. Optionally promote reusable preferences into memory

### Examples of imported records
- travel planning thread
- education discussion session
- content drafting session

### Long-term value
The portal should become:
- a workspace
- a record hub
- a memory curation layer

not just a launcher of GPT links

---

## 12. UI consistency rules

### Keep
- dark theme
- clean layout
- clear sidebar
- data-first investing UI

### Remove
- inconsistent page-level tab-like UI in the right content area
- duplicated navigation patterns

### Use instead
- page title
- page description
- optional action buttons only when truly needed

### Investing page action buttons
Recommended:
- 목표 편집
- 자산 입력
- 분류 연결

These should be styled as actions, not tabs.

---

## 13. Immediate next goals after current checkpoint

### UI refinement
- remove right-side tab-like controls
- keep sidebar as the only page navigation
- improve Korean-first copy
- keep hub pages lightweight

### Functional phase after that
- target editing persistence
- asset input persistence
- asset classification persistence

---

## 14. v0.1 success criteria

The product is successful at v0.1 if:
- it runs locally
- it has a usable dashboard
- the investing pages are accessible
- the layout feels coherent
- the user can understand the portfolio review structure
- hub pages leave room for future record-based expansion
