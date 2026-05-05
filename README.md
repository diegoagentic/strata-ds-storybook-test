# demo-2026-strata-v3

Standalone consumer of the Strata Design System carrying the MBI tenant
demo (3 flows, 9 demo steps, full App-mode browse). Greenfield port of
[`demo-2026-strata`](../demo-2026-strata).

## Run locally

```bash
npm install
npm run dev
```

Vite picks the next free port from 5180. The DS ships as a vendored
tarball at `vendor/strata-design-system-X.Y.Z.tgz` so no sibling DS
folder is required.

## Documentation

Full docs live in [`docs/`](./docs/):

- [`docs/README.md`](./docs/README.md) — what this project is + repo map
- [`docs/architecture.md`](./docs/architecture.md) — two-mode chrome,
  contexts, routing, DS contract, theme system
- [`docs/changelog.md`](./docs/changelog.md) — phase-by-phase build log
  with commit hashes (FASE 0–7, DemoSidebar fix, standalone migration,
  App-mode richness rounds 1–3)
- [`docs/development.md`](./docs/development.md) — how to add scenes /
  pages, the 5-layer DS-enforcement story, how to bump the vendored DS,
  troubleshooting
- [`docs/mbi-data.md`](./docs/mbi-data.md) — fixture inventory, shapes,
  cross-references

For AI-assistant operating rules, see [`CLAUDE.md`](./CLAUDE.md).

## What's done

| Phase | State |
| --- | --- |
| 0 — Skeleton (vite + Tailwind v4 + vendored DS + MCP config) | ✅ |
| 1 — Provider stack | ✅ |
| 2 — Navbar + DemoSidebar (theme-inverted vs. app) | ✅ |
| 3 — MBI profile + 18 mock data files | ✅ |
| 4 — Shared components + MBI shells | ✅ |
| 5 — Accounting AI flow (m2.1, m2.3) | ✅ |
| 6 — Collections AI flow (m2.4, m2.5) | ✅ |
| 7 — Quotes AI flow (m3.3, m3.5, m3.2, m3.6, m3.4) | ✅ |
| App-mode richness — Overview / Transactions / GenUI bar | ✅ |

## Working on this project — the rule

**Before writing any UI**, run the DS Architect:

```
/ds-plan <description of what you need>
```

Or just write a UI prompt and the `ds-architect` subagent will auto-fire.
It returns a blueprint (component, tokens, anti-patterns, starter
snippet) sourced from the live MCP. See
[`docs/development.md`](./docs/development.md) for the full workflow.
