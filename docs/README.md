# demo-2026-strata-v3 · documentation

This folder is the durable record of how `demo-2026-strata-v3` was built,
why it looks the way it does, and how to keep extending it without
breaking the contract with the rest of the Strata stack (the design
system, the original v1 demo, and the MCP server that backs both).

## Documents

| Document | What it covers |
|---|---|
| [`architecture.md`](./architecture.md) | The two-mode app shape (App vs. Demo), the contexts that drive it, where data lives, where DS components live, how chrome composes. |
| [`changelog.md`](./changelog.md) | Phase-by-phase reconstruction of what was built and why, mapped to commit hashes. |
| [`development.md`](./development.md) | How to run, typecheck, build, ship; the 5-layer DS-enforcement story; how to bump the vendored DS tarball; how to push to the standalone repo. |
| [`mbi-data.md`](./mbi-data.md) | The MBI mock fixtures — what's in each file, which scene consumes which records, and why we kept the names from the v1 demo even though the format changed. |

## What this project actually is

`demo-2026-strata-v3` is a **standalone consumer** of the Strata Design
System. It exists for one purpose: to demonstrate, end-to-end, that the
new DS can carry a real interactive sales demo (originally the
9-step MBI tour Mark approved on April 23, 2026) without falling back to
raw Tailwind palettes or one-off chrome. Every visible surface — except
the intentionally theme-inverted DemoSidebar — is built from DS
components and DS semantic tokens.

The demo is MBI-only by design. The plan-of-record (in
`~/.claude/plans/gracias-ya-tenemos-toda-snappy-minsky.md`) declared
this scope on day zero so we wouldn't trickle into the other 7 tenants
prematurely. Once MBI is solid, the same shell can carry Acme, COI,
OPS, Dupler, Continua, WRG, and Leland by swapping the profile.

## Quick map of the codebase

```
demo-2026-strata-v3/
├── docs/                      ← you are here
├── src/
│   ├── App.tsx                ← state-driven router, two-mode renderer
│   ├── main.tsx               ← provider stack
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── GenUIInputBar.tsx  ← floating "describe what you need"
│   │   ├── demo/              ← DemoSidebar, Spotlight, StepBanner, AIIndicator
│   │   ├── shared/            ← StatusBadge, PersonaBadge, ReasonDialog
│   │   └── mbi/               ← all MBI scenes + page shells (~30 files)
│   ├── context/               ← Demo, DemoProfile, Tenant, Auth
│   ├── config/profiles/
│   │   └── mbi-data/          ← 18 fixture files
│   ├── styles/globals.css     ← Tailwind v4 + DS token imports
│   └── types/demo.ts
├── vendor/
│   └── strata-design-system-0.0.1.tgz  ← vendored DS lib (tracked)
├── package.json               ← DS dep points at file:./vendor/...tgz
├── vite.config.ts             ← single @/ alias, no DS source aliases
├── CLAUDE.md                  ← AI-assistant operating rules
└── README.md                  ← user-facing quickstart
```

## Repo it ships from

- Source: this folder, integrated under the broader Strata workspace
- Public mirror: https://github.com/diegoagentic/strata-ds-storybook-test
  (auto-pushed from this folder; the standalone build configuration in
  `package.json` + `vite.config.ts` is what makes the public repo work
  on a fresh clone without the rest of the workspace)
