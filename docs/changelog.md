# Changelog

Phase-by-phase reconstruction of how the project was built. Each entry
maps to one or more commits; commit hashes are stable on the
`strata-ds-storybook-test` repo (`main` branch).

## FASE 0 — Skeleton (`f3f2361`)

Goal: an empty Vite + Tailwind v4 + DS-aware shell that boots and shows
"Hello v3" with no errors.

- `npm init` + copy v1's package.json deps (React 19, Vite 7, framer-motion,
  recharts, lucide-react, clsx, tailwind-merge)
- Add `strata-design-system` as a `file://` dep on the sibling DS folder
- `vite.config.ts` with `@/` → `./src` alias and React/DS dedupe
- `tailwind.config.js`, `tsconfig.json`, `postcss.config.js`, `index.html`
  copied from v1
- `.cursor/mcp.json` + `.claude/agents/ds-architect.md` +
  `.claude/commands/ds-plan.md` + `.claude/hooks/UserPromptSubmit.json`
  for AI-assisted workflow
- `CLAUDE.md` with the 5-layer DS-enforcement story
- Minimal `main.tsx` + `App.tsx` rendering "Hello v3"

## FASE 1 — Provider stack (`f3f2361`)

- Port `AuthContext`, `DemoContext`, `DemoProfileContext`, `TenantContext`
  from v1 (4 files, ~150 LoC each)
- Replace v1's custom ThemeProvider with the one shipped by the DS
- Stub `demoProfiles.ts` with an empty array — providers compile and
  hooks return their shapes correctly

## FASE 2 — Chrome (`f3f2361`)

Goal: dual-mode chrome (App mode + Demo mode) functional even before
pages exist.

- `Navbar.tsx` — DS-only navbar with logo, dealer experience subtitle,
  tab pills, bell, theme toggle, Sara Chen avatar
- `DemoSidebar.tsx` — three-state component: FAB (no demo) / collapsed
  tab / expanded panel
- `DemoStepBanner.tsx`, `DemoSpotlight.tsx`, `DemoAIIndicator.tsx` —
  three small overlay components
- `App.tsx` updated to mount everything; the `currentPage` state +
  `currentStep.app` step-driven router decides which page renders

## FASE 3 — MBI profile (`f3f2361`)

- Copy 18 mock-data files from v1 to `src/config/profiles/mbi-data/`:
  `tenant`, `types`, `stakeholders`, `manufacturers`, `contracts`,
  `pricingReference`, `typicals`, `budgetRequests`, `sifSamples`,
  `invoices`, `arRecords`, `billingForecast`, `proposals`, `specChecks`,
  `designProjects`, `painPoints`, `modulePhases`, `index`
- Copy `mbi.ts` profile (9 demo steps, behavior config, messages)
- Register MBI as the only profile in `demoProfiles.ts`
- DemoSidebar renders the 9 steps correctly; clicking a step updates
  `currentStepIndex`

## FASE 4 — Shells + landing (`f3f2361`)

- Port `ReasonDialog` (v1 headlessui Dialog → DS Dialog) and
  `StatusBadge` (v1 API kept; uses DS `bg-status-*` tokens internally
  because the DS-shipped `StatusBadge` has a different status-string API)
- Port the four MBI shells: `MBIPageShell`, `MBIWizardShell`,
  `MBIModuleHeader`, `MBIPersonaBadge` (rebuilt on top of DS Avatar +
  Badge so role tones land on DS tokens)
- `MBIOverviewPage` v1 — minimalist landing with 3 KPI cards + 2 flow
  cards + glass demo CTA
- Skeleton `MBIAccountingPage` and `MBIQuotesPage` (just headers and
  internal tabs) so the navbar tab clicks resolve to something

## Enforcement layers (`e877943`)

After completing F4, ran the full 5-layer DS-enforcement playbook to
prevent component drift in subsequent fases:

1. **Cursor rules** at `.cursor/rules/strata-ds.md` (copied from DS templates)
2. **Session briefing** — MCP `get_session_briefing` tool baked rules
   into every new session
3. **Tool descriptions** — MCP tools self-describe DS rules
4. **Pre-prompt hook** at `.claude/hooks/UserPromptSubmit.json` — every
   user prompt routes through the hook for DS-rule injection
5. **ds-architect subagent** — autonomous agent that runs `plan_ui` →
   `get_component` → blueprint before any UI code

## FASE 5 — Accounting AI flow (`dbebd0d`)

Steps m2.1 (AP queue) + m2.3 (Bill Review). 8 files, ~2.5K insertions.

- `AccountingMorningQueue.tsx` (270 LoC) + `InvoiceQueueTable.tsx` (240) +
  `InvoiceDetailPanel.tsx` (550)
- `NonEDIReconcilerScene.tsx` (608) + `NonEDIReconciliationPanel.tsx` (250)
- `DataSourcesBar.tsx` (280) — converted radix-ui tooltip → DS Tooltip
- `MBIDetailSheet.tsx` — wraps DS Sheet but keeps v1 props (isOpen, onClose,
  width) so v1 callers work unchanged
- Stubs for `ARAgingReviewScene` and `ARAgingWrapScene` so the
  Collections tab in `MBIAccountingPage` doesn't 404 before FASE 6

Token migration applied: `bg-success` → `bg-status-success`,
`bg-danger` → `bg-destructive`, etc. Done via batched `sed` for
consistency.

`MBIAccountingPage` reaches its full v1 form: 2 internal tabs
(Accounting / Collections), demo step sync, escalate-all flow with
`ReasonDialog`.

## FASE 6 — Collections AI flow (`cee747a`)

Steps m2.4 (AR aging) + m2.5 (Wrap). 5 files, ~1.4K insertions.

- `ARAgingReviewScene.tsx` (208) — replaces FASE 5 stub
- `ARStatusBoard.tsx` (363) — status taxonomy kanban
- `ARHoldReviewModal.tsx` (227) — converted from `@headlessui` Dialog →
  DS Dialog. The header's `<DialogTitle>` + `<DialogDescription>`
  composes the v1 layout into the DS API.
- `ARAgingWrapScene.tsx` (200)
- `AIEmailDraftsPanel.tsx` (478) — reuses MBIDetailSheet from FASE 5
  for the email-edit drawer

The Collections tab in `MBIAccountingPage` now renders a real AR aging
board + email drafts panel.

## FASE 7 — Quotes AI flow (`d548374`)

5 steps (m3.3 → m3.5 → m3.2 → m3.6 → m3.4). 16 files, ~3.5K insertions.

Page orchestrator:
- `MBIQuotesPage.tsx` — 5-step wizard

Scene components:
- m3.3 Validation: `QuoteValidationScene`, `SpecCheckReport`,
  `AISpecCheckSimulation`
- m3.5 Vendor Upload: `QuoteVendorUploadScene`, `NonCatalogValidatorTable`,
  `NonCatalogVendorQuoteDemo`
- m3.2 GP Review: `QuoteGPReviewScene`
- m3.6 Proposal Review: `QuoteProposalReviewScene`, `SIFToCOREPreview`,
  `SIFParserPreview`
- m3.4 Send Proposal: `QuoteSendProposalScene`, `FlowHandoff`
- `AuditLoopDiagram` (4→1+1 visualization), `QuoteReadinessGate`

Transitive dep: `usePauseAware` hook copied from v1 to `src/context/`
so the three scenes (NonCatalogVendorQuoteDemo, QuoteGPReviewScene,
SIFParserPreview) that gate animation pacing on the demo's
`isPaused` state still work.

## DemoSidebar theme inversion (`a3dae04`)

Bug visual: the user noticed the v3 DemoSidebar followed the document
theme (light app → light sidebar, dark app → dark sidebar) instead of
inverting like v1.

Fix: port v1's DemoSidebar verbatim with two hardcoded color maps
(zinc/emerald/blue/teal/amber/sky/rose/indigo/purple) keyed off
`useTheme()`. Reasons documented in
[`architecture.md`](./architecture.md#design-system-contract).

## Standalone migration (`f12fe1d`)

Goal: make the repo a self-contained consumer of the DS, ready to
ship to a separate GitHub repo without the rest of the workspace
present.

- DS rebuilt with `npm run build:lib` and packed with `npm pack` →
  `strata-design-system-0.0.1.tgz` (3.7 MB, 149 files)
- DS `package.json` updated to add `./styles/theme-v4` export plus
  `./styles/tokens/*` glob so v3's globals.css can import all three
  CSS files via the package name
- Tarball moved to `demo-2026-strata-v3/vendor/`
- `package.json`: dep `strata-design-system` →
  `file:./vendor/strata-design-system-0.0.1.tgz`
- `vite.config.ts`: drop dedupe + 7 alias rules pinning React and DS
  source via `@/` namespaces; keep only `@/` → `./src` catch-all
- `globals.css`: rewrite `@import` and `@source` paths from
  `../../../design system/strata-ds/src/...` → `strata-design-system/...`
  (resolved through the installed package)
- README updated to standalone quickstart
- Verified: `rm -rf node_modules + npm install` pulls 461 packages,
  typecheck 0 errors, dev server HTTP 200 with the DS bundle resolved
  via `/node_modules/.vite/deps/strata-design-system.js`

## DemoSidebar minimalist scrollbar (`abda1fb`)

User noticed the default browser scrollbar was visually loud against
the inverted-theme sidebar. Added a `.scrollbar-micro` utility
(2px thumb, transparent track, zinc-300 / zinc-700 with hover bump)
to `globals.css` and applied it to the step list.

## App-mode richness round 1 — Overview enrichment (`16c5b08`)

User pointed out the App-mode landing didn't match v1's Acme reference
(Follow Up tab + Urgent Actions + Recent Activity). Redesigned
`MBIOverviewPage` to mirror that structure, but with all data sourced
from MBI fixtures:

- DS Tabs: Follow Up / Your tools / Metrics
- Follow Up (default): two-column layout
  - **Urgent Actions** — pulls a real exception bill (INV-0484
    short-ship), an escalated AR record (Lindenwood University 32d
    past due), a pending-review proposal (PROP-2026-003). Each row
    collapsible with a `PriorityBadge` (medium/critical/high) and a
    "Resolve in Accounting AI" deep link.
  - **Recent Activity** — five-row audit feed (auto-posted bill,
    collection email, reconciliation in progress, proposal sent, hold
    indicator) sourced from `MBI_INVOICES` / `MBI_AR_RECORDS` /
    `MBI_PROPOSALS`.
- Your tools: existing flow cards
- Metrics: existing tenant KPIs

## App-mode richness round 2 — Transactions page (`97c484c`)

New `MBITransactionsPage` modeled on the v1 Acme Transactions
screenshot but bound to MBI data:

- Tabs: Quotes · Purchase Orders · Acknowledgements · Projects
- Each tab: 4-column horizontal-scroll Kanban with search input,
  per-column count chip, and `RecordCard` rows
- Wired into navbar as a third tab, into `SimulationApp` union, and
  into the App router

Generic `KanbanShell` + `RecordCard` subcomponents kept inline; using
DS `Tabs`, `Card`, `Input`, `Button`, `Badge`.

## App-mode richness round 3 — GenUI input bar (`f6b1378`)

`GenUIInputBar.tsx` — bottom-anchored glass pill with History,
Sparkles, "Describe what you need..." input, and Send button. Mounts
globally, auto-hides while the demo is active. Submitting surfaces a
small confirmation panel that quotes the prompt back; generation is
explicitly out of scope (this is intent scaffolding for a future LLM
endpoint).

## Documentation (this folder)

Documentation set added — index, architecture, changelog (this file),
development guide, MBI-data inventory.
