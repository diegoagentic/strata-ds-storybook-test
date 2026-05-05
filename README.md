# demo-2026-strata-v3

Greenfield port of [`demo-2026-strata`](../demo-2026-strata) to the new strata-design-system. MVP scope is the **MBI tenant** only.

For AI assistants and contributor onboarding, read [`CLAUDE.md`](./CLAUDE.md) — it covers the MCP-driven workflow, token rules, and porting anti-patterns.

## Run locally (standalone)

```bash
# 1. Install deps — strata-design-system is bundled as a vendored tarball
#    in vendor/, so no separate setup is needed.
npm install

# 2. Start the dev server (Vite picks the next free port from 5180)
npm run dev
```

The DS ships as `./vendor/strata-design-system-X.Y.Z.tgz`. To upgrade,
re-run `npm pack` in the strata-ds repo, drop the new tarball into
`vendor/`, bump the path in `package.json`, and `npm install` again.

## Status

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
| 8 — Audit + docs + screenshots | ⏳ |

## Working on this project — the rule

**Before writing any UI**, run the DS Architect:

```
/ds-plan <description of what you need>
```

Or just write a UI prompt and the `ds-architect` subagent will auto-fire.
It returns a blueprint (component, tokens, anti-patterns, starter snippet)
sourced from the live MCP. Skipping this caused the Navbar bug in FASE 2 —
see [`CLAUDE.md`](./CLAUDE.md) for the full story.

## Architecture (short version)

- **Tailwind v4** via `@tailwindcss/vite` plugin (aligned with P1).
- **Tokens** imported from `strata-design-system` source via vite alias — same source as P1.
- **State**: 5 React contexts (Auth, DemoProfile, Demo, Tenant, Theme) — no router, no Zustand.
- **Demo flow**: `currentStep.app` from `DemoContext` selects which simulation component to render.

See [`CLAUDE.md`](./CLAUDE.md) for the full architecture and token rules.
