# demo-2026-strata-v3 — AI assistant guidance

Greenfield port of `demo-2026-strata` to the new strata-design-system. MVP scope is the **MBI tenant only** (9 demo steps, 3 flows: Accounting AI / Collections AI / Quotes AI). Other tenants come after MBI proves the pattern.

## How this project uses the Strata DS

This project ships with **both layers** of the DS plugin:

| What | File | Purpose |
| --- | --- | --- |
| MCP config | `.cursor/mcp.json` | Gives any IDE the 10 MCP tools (`plan_ui`, `get_component`, `get_foundations`, etc.) |
| Subagent | `.claude/agents/ds-architect.md` | Auto-fires on "build/add/create a [UI]" prompts. Forces blueprint-before-code workflow. |
| Slash command | `.claude/commands/ds-plan.md` | Manual: `/ds-plan navbar with tabs` |

### Workflow for any new component port

The expected sequence on each new UI deliverable in v3:

1. **Receive task** — e.g. "port MBIAccountingPage from v1 to v3"
2. **Run `/ds-plan` or wait for ds-architect to auto-fire** with a description like:
   > "MBI accounting page with tabs (AP Exceptions / Collections), invoice queue table, detail panel, action buttons"
3. **Read the blueprint** the agent returns:
   - Primary component(s) to use
   - Required tokens (verbatim from MCP — never invented)
   - Anti-patterns to avoid (verbatim)
   - Starter snippet
4. **Cross-check with v1 source** — read `demo-2026-strata/src/components/mbi/MBIAccountingPage.tsx` for behavior + props that are MBI-specific
5. **Write code matching the blueprint** — exact component, exact tokens, no drift
6. **Verify**: `npm run typecheck` + visual check vs v1

### Concrete cautionary tale — the Navbar bug

When this project was first scaffolded (FASE 2), the implementer wrote a generic
full-width Navbar without consulting the MCP. The result didn't match the v1
demo (which uses a floating pill pattern with `bg-card/80 backdrop-blur-xl
rounded-full`).

**What `plan_ui` would have returned** (one curl call):
```bash
curl 'localhost:3001/plan_ui?description=floating+pill+navbar+for+a+product+app+with+logo+tabs+and+theme+toggle'
```
→ Primary: **NavbarFloating**
→ Tokens: `bg-card/80, backdrop-blur-xl, border-border, rounded-full, shadow-lg, dark:shadow-glow-md`
→ Alternatives: Navbar, ExperiencesNavbar

**Cost of skipping**: 30+ minutes of rework + visual inconsistency between v3 and the v1 demo.

**Rule going forward**: never write UI in this project without first running `/ds-plan` or letting the ds-architect agent fire. If the MCP returns 404 / no good match, that's a real DS gap — surface it via `report_error` (also an MCP tool).

## Source of truth

| Layer | Location | Status |
| --- | --- | --- |
| Design System (P1) | `../design system/strata-ds/` | Read/modify if a real DS gap surfaces |
| Storybook (P2) | `../design system/front-react-strata-storybook/` | **Read-only**. Reference for component behavior. Never modify during this MVP. |
| MCP server | `localhost:3001` (run from P1) | Live source of truth for components, tokens, rules |
| Original demo (v1) | `../demo-2026-strata/` | Read-only blueprint to port from |
| Failed first port (v2) | `../demo-2026-strata-v2/` | Read-only reference. **Don't build on top of it.** |

## ds-architect — blueprint before code

This project ships a Claude Code subagent at `.claude/agents/ds-architect.md` and a slash command at `.claude/commands/ds-plan.md`.

**Use them BEFORE writing any UI.** They consult the MCP, return the recommended component, exact tokens, applicable rules, anti-patterns to avoid, and a starter snippet — preventing inventions that drift from the DS.

Three ways to invoke:

1. **Slash command** (in any task that needs UI):
   ```
   /ds-plan floating pill navbar with logo, tabs, theme toggle, avatar
   ```
2. **Auto-trigger** (the orchestrator should fire `ds-architect` automatically when the user says "build / add / create / make a [UI thing]" — see the agent file's `description` field).
3. **Direct MCP call** (any tool that's already MCP-aware):
   ```
   plan_ui("description")
   ```

The agent's hard rule: **if the MCP returns 404 or no good match, raise it as a DS gap. Do not approximate.**

Example: when this project's Navbar was first written, the implementer skipped this step and built a generic full-width navbar — but `plan_ui("floating pill navbar...")` returns `NavbarFloating` as the primary, with the exact tokens (`bg-card/80`, `backdrop-blur-xl`, `rounded-full`, `shadow-lg`, `dark:shadow-glow-md`). One-call lookup prevents the rework.

## MCP-driven workflow

The MCP server is the assistant's primary lookup tool. **Use it, don't guess.**

### Tools available

```
get_component(name)         → full component spec (variants, props, tokens, whenToUse, antiPatterns, example)
get_component_code(name)    → React/HTML/CSS/AI prompt blocks for the component
get_foundations(section)    → colors / typography / spacing / borders / shadows / branding
list_components()           → catalogue index
list_rules()                → governance rules (color tokens, brand colors, icons, typography, etc.)
list_anti_patterns()        → things to avoid
search(query)               → free text search across the catalogue
```

HTTP equivalents exposed at `localhost:3001`:
- `GET /health` — quick liveness
- `GET /components` — full catalogue JSON
- `GET /components/:id` — single spec
- `GET /foundations` and `GET /foundations/:section`

### Rules of engagement

1. **Bulk lookup at the start of each phase**. Before porting a flow, call `get_component` for every component the flow depends on (Card, Button, Dialog, Badge, etc.). Cache the responses in your context for the rest of the session.
2. **When you don't know a token's name, ask `get_foundations`** before guessing (e.g. is the warning surface `bg-warning` or `bg-status-warning`?).
3. **Before adding a new shared component, check `list_components`** — there's a 95-component catalogue, the answer is probably already there.
4. **If the MCP returns thin/empty data for a component you're using, that's a real gap** — note it, finish the port using your best judgement, then propose enriching the MCP entry as a separate task.

## Token rules (don't break)

These are non-negotiable. They come from P1's `RULES` and `ANTI_PATTERNS` in the MCP. Source of truth: `design system/strata-ds/src/styles/tokens/variables.css`.

- **Never use raw hex colors** (`#18181b`) or raw Tailwind primitive classes when a semantic token exists. Always reach for the semantic token first.
- **Surface tokens** (`bg-*`, `text-*`, `border-*`):
  - Page: `bg-background` / `text-foreground`
  - Containers: `bg-card` / `text-card-foreground`
  - Floating overlays: `bg-popover` / `text-popover-foreground`
  - Subtle / hover: `bg-muted` / `text-muted-foreground`
  - Hover-accent: `bg-accent` / `text-accent-foreground`
  - Form: `bg-input-background`, `border-input`, `focus:ring-ring`
  - Destructive: `bg-destructive` / `text-destructive-foreground` / `border-destructive`
- **Status tokens** (semantic intent — note the `status-` prefix):
  - Success: `bg-status-success` / `text-status-success` / `bg-status-success/10 text-status-success border-status-success/20` (soft pattern)
  - Warning: `bg-status-warning` / `text-status-warning` / `bg-status-warning/10` …
  - Error: `bg-status-error` / `text-status-error` / `bg-status-error/10` …
  - Info: `bg-status-info` / `text-status-info` / `bg-status-info/10` …
  - AI: `bg-status-ai` / `text-status-ai` / `bg-status-ai/10` …
- **Brand accent (Volt Lime)** — always paired light/dark:
  - `bg-brand-300 dark:bg-brand-500` for primary CTA fills
  - 11 shades available: `brand-50` to `brand-950` + `brand-lime` (#d6ff3c, special accent)
- **Sidebar (independent)**: `bg-sidebar`, `text-sidebar-foreground`, `bg-sidebar-accent`, `border-sidebar-border`, `bg-sidebar-primary`
- **Charts**: `bg-chart-1` … `bg-chart-5` (5 named tokens, same in light & dark)
- **Borders**: `border-border` for neutral separators
- **Extended palettes** when a status token doesn't fit (rare): `red-*`, `green-*`, `blue-*`, `amber-*`, `indigo-*`, `violet-*` — 11 shades each
- **Glow shadows** (DS provides 3 levels): use Tailwind arbitrary `shadow-[var(--shadow-glow-md)]` or the helper `shadow-glow-md`/`shadow-glow-sm`/`shadow-glow-lg` if the project exposes them
- **Glass surfaces**: `bg-glass-navbar` / `border-glass-navbar-border` + `backdrop-blur-glass-xl` (combo, never split)
- **Icons**: `lucide-react` only. Sizes via `size-4` / `size-5`. Color via `text-muted-foreground` or status tokens — never raw colors.

If the MCP returns a `tokens` map for a component, that's the canonical list of classes that component expects to be paired with.

### Verifying with the MCP before you write UI

```sh
# What surfaces are available?
curl localhost:3001/foundations/colors | jq '.surfaces | keys'

# Is glow-md a real token or did I imagine it?
curl localhost:3001/foundations/shadows | jq '.glow.md'

# What's the brand-lime hex?
curl localhost:3001/foundations/colors | jq '.brand.lime'

# Branding governance for Volt Lime?
curl localhost:3001/foundations/branding | jq '.voltLimeRule, .antiPatterns'
```

The MCP exposes 8 foundations sections: `colors`, `typography`, `spacing`, `borders`, `shadows`, `branding`, `transparency`, `grid-containers`. All are kebab-case in URLs.

## Component import rules

```ts
// PREFERRED: named imports from the package barrel
import { Button, Card, Dialog } from 'strata-design-system';

// AVOID: deep imports into the DS source tree (couples v3 to internal structure)
import { Button } from 'strata-design-system/src/components/application-ui/button';
```

The vite alias resolves `strata-design-system` to the DS source for live development. Once the DS publishes a built package, the alias can be removed and imports stay the same.

## Anti-patterns specific to this port

When porting v1 → v3, you will see these patterns in v1 code. Replace them.

| v1 pattern (raw) | v3 replacement |
| --- | --- |
| `<button className="px-4 py-2 bg-blue-500 text-white rounded">` | `<Button variant="default">` |
| `<div className="rounded-lg border border-zinc-200 bg-white p-4">` | `<Card>...</Card>` (or `<Card flat>`, `<Card glass>`) |
| `<span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Active</span>` | `<Badge variant="soft" color="green">Active</Badge>` or `<StatusBadge status="success" />` |
| `text-zinc-900` / `text-zinc-600` | `text-foreground` / `text-muted-foreground` |
| `bg-white dark:bg-zinc-900` | `bg-background` |
| `bg-zinc-50 dark:bg-zinc-800` | `bg-muted` |
| Custom modal w/ headlessui | `<Dialog>` from the DS |
| Custom dropdown w/ headlessui | `<DropdownMenu>` from the DS |

## v3 architecture

State-driven manual routing inherited from v1 — **don't add React Router**, don't add Zustand. The contexts are enough.

```
main.tsx
└── ThemeProvider (from strata-design-system)
    └── AuthProvider
        └── DemoProfileProvider
            └── DemoProvider
                └── TenantProvider
                    └── App
```

App.tsx switches on `currentStep.app` (when demo active) or `currentPage` (when not). MBI specifically uses the simulation apps `mbi-overview`, `mbi-accounting`, `mbi-quotes` (and `mbi-budget`, `mbi-design` are out of scope for the MVP).

## What MCP-served information powers each phase

| Phase | What to pull from MCP at the start |
| --- | --- |
| 1 — Providers | `get_component('Toaster')` for sonner setup, `get_foundations('colors')` for theme initialization |
| 2 — Shell (Navbar + DemoSidebar) | `get_component('Navbar')`, `get_component('Avatar')`, `get_component('Button')`, `get_component('Sidebar')` |
| 4 — Shared + MBI shells | `get_component('Dialog')` (for ReasonDialog), `get_component('StatusBadge')`, `get_component('Badge')`, `get_component('Heading')`, `get_component('Text')`, `get_component('Tabs')` |
| 5 — Accounting AI | `get_component('Table')`, `get_component('Sheet')`, `get_component('Card')`, `get_component('Banner')`, `get_component('InfoBanner')`, `get_component('Drawer')` |
| 6 — Collections AI | `get_component('Card')`, `get_component('Badge')`, `get_component('Dialog')`, `get_component('Textarea')` |
| 7 — Quotes AI | `get_component('Form')`, `get_component('Input')`, `get_component('Slider')`, `get_component('Select')`, `get_component('Progress')`, `get_component('StageProgress')` |

Cache the responses, don't re-query mid-phase.

## Verification before each commit

```
npm run typecheck         # 0 errors (the existing audit:tokens needs porting from v1)
# Manual: navigate the demo step-by-step at localhost:5180
# Manual: spot-check 3 random components against P2 storybook (localhost:6006)
```
