# Development guide

## Prerequisites

- Node ≥ 20 (Vite 7 requirement)
- npm ≥ 10
- A modern browser (Chrome / Edge / Firefox); the app uses
  `rgb(from var(--color) r g b / 0.4)` syntax which needs Chrome 119+
  or Firefox 113+

## Quickstart

```bash
# Standalone (after cloning the public repo):
npm install
npm run dev
```

Vite picks the next free port from 5180. Open the printed URL.
Typecheck on demand:

```bash
npx tsc -b --force --noEmit
```

(The plain `npm run typecheck` script is `tsc --noEmit` without `-b`,
which doesn't enter project references — use the `-b --force` form to
catch real errors.)

## DS-enforcement layers (5)

The repo carries five overlapping mechanisms to stop AI assistants and
human contributors from re-introducing raw Tailwind palette colors,
hand-rolled buttons, or one-off chrome that drifts from the DS:

1. **`.cursor/rules/strata-ds.md`** — read by Cursor on every prompt
2. **MCP `get_session_briefing`** — at session boot, returns the
   "before you write any UI" preface
3. **MCP tool descriptions** — each DS tool re-states the rule
4. **`.claude/hooks/UserPromptSubmit.json`** — every prompt the user
   submits goes through this hook, which injects the DS-rules tag
5. **`.claude/agents/ds-architect.md`** — auto-fires on UI-keyword
   prompts. Workflow: `plan_ui(description)` → `get_component(name)` →
   blueprint with components, tokens, anti-patterns, starter code →
   THEN the implementer agent writes code

To trigger the agent manually: `/ds-plan <description>`.

## DS Architect blueprint flow

```
1. /ds-plan "follow up tab with urgent actions and recent activity"
2. Agent calls plan_ui — receives recommended DS components and tokens
3. Agent calls get_component for each one — receives full API surface
4. Agent returns a blueprint:
   - Imports needed
   - Component composition tree
   - Tokens to use (with ✗ examples of what NOT to use)
   - Starter snippet to copy
5. Implementer agent writes the actual file using only the blueprint
```

The blueprint approach has caught two real drifts during the build:

- A Navbar bug where I freehanded a full-width navbar; `plan_ui` would
  have recommended `NavbarFloating` with `bg-card/80 backdrop-blur-xl
  rounded-full`. Reverted and re-implemented from blueprint.
- A status badge attempt to use `bg-green-100 text-green-700`;
  blueprint flagged the rule "use `bg-status-success/15
  text-status-success` per governance".

## Bumping the vendored DS

The DS lives at `vendor/strata-design-system-0.0.1.tgz`. To upgrade:

```bash
# 1. Bump version in DS package.json (semver)
cd "../design system/strata-ds"
# edit package.json: "version": "0.0.2"

# 2. Build the lib + pack
npm run build:lib
npm pack
# produces strata-design-system-0.0.2.tgz

# 3. Move into v3 vendor/
mv strata-design-system-0.0.2.tgz "../../demo-2026-strata-v3/vendor/"

# 4. Update v3 package.json to point at the new tarball
cd "../../demo-2026-strata-v3"
# edit package.json:
#   "strata-design-system": "file:./vendor/strata-design-system-0.0.2.tgz"

# 5. Optionally remove the old tarball
rm vendor/strata-design-system-0.0.1.tgz

# 6. Reinstall + verify
rm -rf node_modules package-lock.json
npm install
npx tsc -b --force --noEmit
npm run dev
```

Why npm pack and not a git URL? The DS gitignores `dist/`, so a `git+`
dep would pull source without the built lib. Vendoring the tarball
keeps the v3 repo working on a fresh clone.

## Adding a new MBI scene

Pattern:

```
1. /ds-plan "scene description (what tokens, what layout, what data)"
2. Read receive blueprint
3. Create file in src/components/mbi/
4. Read the corresponding v1 file (../demo-2026-strata/src/components/mbi/...)
   if it exists; copy and migrate tokens via sed:
     sed -i \
       -e 's/bg-success\b/bg-status-success/g' \
       -e 's/bg-warning\b/bg-status-warning/g' \
       -e 's/bg-info\b/bg-status-info/g' \
       -e 's/bg-ai\b/bg-status-ai/g' \
       -e 's/bg-danger\b/bg-destructive/g' \
       -e 's/text-success\b/text-status-success/g' \
       -e 's/text-warning\b/text-status-warning/g' \
       -e 's/text-info\b/text-status-info/g' \
       -e 's/text-ai\b/text-status-ai/g' \
       -e 's/text-danger\b/text-destructive/g' \
       -e 's/border-success\b/border-status-success/g' \
       -e 's/border-warning\b/border-status-warning/g' \
       -e 's/border-info\b/border-status-info/g' \
       -e 's/border-ai\b/border-status-ai/g' \
       -e 's/border-danger\b/border-destructive/g' \
       newfile.tsx
5. Replace any @headlessui/react Dialog with DS Dialog
6. Replace any @radix-ui/react-tooltip with DS Tooltip
7. Wire into MBIAccountingPage / MBIQuotesPage step switch
8. npx tsc -b --force --noEmit → 0 errors
9. npm run dev → click through manually
10. git commit + push
```

## Adding a new page

```
1. Create src/components/mbi/MBIYourPage.tsx using MBIPageShell
2. Add 'mbi-yourpage' to SimulationApp union in src/types/demo.ts
3. Add a case in renderPage() in src/App.tsx
4. (Optional) Add to MBI_NAV_TABS in src/App.tsx for navbar visibility
5. (Optional) Add steps with app: 'mbi-yourpage' to mbi.ts profile
6. Typecheck → dev → commit
```

## Pushing to the public repo

The repo is at https://github.com/diegoagentic/strata-ds-storybook-test
and tracks `main`.

```bash
cd demo-2026-strata-v3
git add <files>
git commit -m "..."
git push
```

If the remote is missing on a fresh clone:

```bash
git remote add origin https://github.com/diegoagentic/strata-ds-storybook-test.git
git push -u origin main
```

## Common issues

### `Cannot find module 'strata-design-system'` after pulling main

```bash
npm install
```

The vendored tarball at `vendor/` is committed; npm install just
re-extracts it into `node_modules/`.

### `Module not found: react/jsx-runtime`

Stale node_modules from before the standalone migration. Nuke and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Theme toggle doesn't change page colors

The DS uses class-based dark mode (`html.dark`). Confirm the
`ThemeProvider` is wrapping `<App />` in `main.tsx` and that no
`<html>`-level class is being overwritten.

### Demo sidebar doesn't invert theme

`useTheme()` from the DS must be reading the same provider that
`main.tsx` mounts. If you wrapped a child tree in another
`ThemeProvider` by mistake, the sidebar will read the wrong theme.

### Typecheck reports 0 errors but the page is blank

Check the browser console — runtime errors don't block typecheck.
Common culprits: missing barrel re-export in `src/components/shared/
index.ts`, a `useState` in a non-component (e.g. inside `useMemo`'s
return), or an `import` from a v1 path that didn't migrate.
