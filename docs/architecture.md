# Architecture

## Two modes, one chrome

The single most important property of the app is that it has two distinct
runtime modes that share most chrome but differ in what drives navigation:

### App mode (free navigation)

Active when `isDemoActive === false`. The Demo button has not been
pressed yet, or the user clicked Exit during a tour.

- The Navbar is the source of truth for which page renders. Clicking
  `Accounting AI` updates `currentPage`, the App router re-renders.
- `MBIOverviewPage` is the home (default `currentPage`).
- The DemoSidebar self-renders only as the bottom-right floating
  ▶ Demo FAB — the panel and step list stay hidden.
- The `GenUIInputBar` mounts at bottom-center with a free-form prompt
  input.
- All page chrome (KPIs, kanbans, tabs, tables) is fully populated with
  MBI mock data. The user can browse like a real product.

### Demo mode (guided)

Active when `isDemoActive === true`. The user clicked the FAB or jumped
in via a deep link.

- The DemoSidebar opens as a 320px panel on the left edge with the
  9-step MBI tour. Each step has an `app` attribute that the App router
  uses to pick which page to render.
- The Navbar's tab pill mirrors `currentStep.app`, so clicking
  manually on a tab during a tour is locked out (`handleNavigate` is
  a no-op while `isDemoActive`).
- Spotlight, StepBanner, and AIIndicator overlay the page with
  pulse-highlight + narration, all wired via `highlightId` strings on
  the demo step.
- The `GenUIInputBar` auto-hides — the demo is the source of intent.

### What lives where

The decision rule is: **chrome that adapts to mode = App.tsx; chrome that
ignores mode = its own component, always-mounted, renders nothing when
inactive.**

| Component | Always mounted? | Visible when |
|---|---|---|
| `Navbar` | yes | always |
| `DemoSidebar` (FAB) | yes | App mode |
| `DemoSidebar` (panel) | yes | Demo mode + not collapsed |
| `DemoSpotlight` | yes | Demo mode + step has `highlightId` |
| `DemoStepBanner` | yes | Demo mode |
| `DemoAIIndicator` | yes | Demo mode + step is `auto` |
| `GenUIInputBar` | yes | App mode |

This means the App router only chooses *which page component to
render* — it never has to think about which chrome to mount. That
keeps `App.tsx` thin (`renderPage(activePage)` switch + main wrapper).

## Provider stack

`main.tsx` wraps the tree with these providers, top-down:

```
ThemeProvider          (DS — sets html.dark / .light)
  AuthContext          (mock user — Sara Chen as Account Manager)
    TenantContext      (active tenant — locked to MBI in the MVP)
      DemoProfileContext (active demo profile — locked to mbi)
        DemoContext    (currentStepIndex, isDemoActive, isPaused, ...)
          <App />
```

The TenantContext + DemoProfileContext distinction is preserved from v1
so future ports can swap the active profile and the active tenant
independently. For MBI MVP they're both pinned to `mbi`.

## DemoContext

The single most-used context. Exposes:

| Field | Purpose |
|---|---|
| `currentStepIndex` | which step in the active profile's `steps` is current |
| `currentStep` | `steps[currentStepIndex]` — has `id`, `app`, `title`, `description`, `highlightId`, `role`, `groupId`, `groupTitle` |
| `steps` | flat array of the active profile's tour |
| `nextStep` / `prevStep` / `goToStep(idx)` | navigation |
| `isDemoActive` / `setIsDemoActive` | toggles tour mode |
| `isSidebarCollapsed` / `setIsSidebarCollapsed` | controls Sidebar expanded vs collapsed tab |
| `isPaused` / `togglePause` | pauses any auto-progressing simulation steps |

Pages use `currentStep.id` to know which scene to render internally
(e.g. `MBIAccountingPage` looks at the step id to switch between AP
and Bill Review wizard panels).

## Routing — state-driven, not URL-driven

There is no React Router or URL routing. `App.tsx` keeps a `currentPage`
state string and switches on it inside `renderPage()`. Reasons:

- A demo is a single-session, single-tab experience; we never need
  back-button or shareable URLs.
- v1 used the same model — the state-driven shape made it trivial to
  port the page tree.
- During Demo mode, the URL would be misleading because navigation is
  step-driven, not page-driven.

The `SimulationApp` union in `types/demo.ts` is the canonical list of
page ids: `mbi-overview`, `mbi-accounting`, `mbi-quotes`,
`mbi-transactions`, `mbi-budget`, `mbi-design`. Adding a page = add to
the union, add a case in `renderPage()`, optionally add to
`MBI_NAV_TABS`.

## Design System contract

Every visible surface uses one of:

1. A DS component imported from `strata-design-system` — Card, Button,
   Badge, Tabs, KPICard, PriorityBadge, StatusBadge, Sheet, Dialog,
   Tooltip, Input, etc.
2. Plain Tailwind utility classes that resolve to **semantic DS tokens**
   — `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`,
   `bg-status-success/15`, `bg-destructive/15`, `bg-status-ai`,
   `border-border`.

Two narrow exceptions to the "no raw palette" rule:

- **`DemoSidebar`** intentionally inverts theme vs. the app document
  using two hardcoded zinc/emerald/blue/teal/amber/sky/rose/indigo/purple
  maps. The whole point is to look different from the page being
  narrated, so semantic tokens (which adapt to the page's theme) would
  defeat the design.
- **MBI scenes ported wholesale from v1** (e.g. NonCatalogVendorQuoteDemo,
  InvoiceDetailPanel) carry some `text-red-700`, `bg-amber-50`-style
  classes. These are inherited from the v1 source and the audit
  flagged them as "allowed palette" (red/amber/indigo/etc. are in the
  Strata DS allowed-color list — only lime/yellow/purple/orange/cyan
  are forbidden).

The DS itself is consumed via a vendored tarball at
`vendor/strata-design-system-0.0.1.tgz` (committed). `package.json`
references it via `"strata-design-system": "file:./vendor/strata-design-system-0.0.1.tgz"`.
This makes the repo self-contained: a fresh clone + `npm install`
works, no sibling DS folder needed. To upgrade the DS, see
[`development.md`](./development.md).

## Theme system (Tailwind v4)

`globals.css` imports three CSS files in order:

```css
@import 'strata-design-system/styles/tokens/variables.css';      /* :root light tokens */
@import 'strata-design-system/styles/tokens/variables-dark.css'; /* .dark overrides */
@import 'strata-design-system/styles/tokens/theme-v4.css';       /* Tailwind @theme map */
```

`@source` directives tell Tailwind where to scan for class names —
both v3's own `src/**/*.{ts,tsx}` and the consumed DS bundle at
`node_modules/strata-design-system/dist/**/*.{js,mjs,cjs}`.

Dark mode is class-based (`.dark` on `html`). The `ThemeProvider` from
the DS toggles it.

## File ownership conventions

Within `src/components/mbi/`, every scene file is allowed to grow up to
~600 LoC because porting v1 scenes wholesale is the cheapest path. The
only refactor we did during the port was:

- Replace `@headlessui/react` Dialog → DS Dialog
- Replace `@radix-ui/react-tooltip` → DS Tooltip
- Replace v1 token aliases (`bg-success`, `bg-warning`, `bg-ai`,
  `bg-info`, `bg-danger`) → DS canonical names (`bg-status-success`,
  `bg-status-warning`, `bg-status-ai`, `bg-status-info`, `bg-destructive`)

Anything beyond that — restructuring scene state, splitting helpers,
extracting reusable pieces — was deferred. The plan was explicit:
**ship the demo first, refactor if and when something breaks.**

## Page structure

Every MBI page follows the same composition:

```
MBIPageShell                  ← header + tenant context
  ├── (optional) Tabs          ← internal page tabs (Overview, Accounting, Transactions)
  ├── MBIModuleHeader          ← section title + AI tint + outcome blurb
  ├── MBIWizardShell           ← step chips + Back/Next navigation (only in Demo mode)
  │     └── scene component    ← AccountingMorningQueue / QuoteValidationScene / etc.
  └── DataSourcesBar           ← footer chip strip showing connected systems
```

`MBIPageShell` is the chrome; everything inside is interchangeable.
The wizard shell is only shown when there's a multi-step flow (Accounting,
Quotes); single-page surfaces (Overview, Transactions) skip it.

## What we deliberately did *not* build

- A real backend or API layer. All data is in-process imports from
  `@/config/profiles/mbi-data/`.
- Persistent storage. Reloading the page resets demo state.
- Real authentication. `AuthContext` returns a fixed Sara Chen.
- A genuine LLM endpoint behind `GenUIInputBar`. Submission shows the
  prompt back as a confirmation panel — clearly documented as
  scaffolding for a future intent layer.
- Other 7 tenants (Acme, Continua, Dupler, Leland, OPS, COI, WRG).
  The DemoSidebar role-label helper still has dead branches for
  Continua/Dupler/WRG/Leland because porting them later requires only
  swapping the profile, not changing the chrome.
