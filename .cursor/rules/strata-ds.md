---
description: Strata Design System — mandatory rules for any UI task in projects that consume the DS.
alwaysApply: true
---

# Strata DS rules — always active

This project consumes the **Strata Design System**. The DS exposes a live MCP server on `localhost:3001` (configured in `.cursor/mcp.json`) with 11 tools. Follow these rules **without exception** in every conversation.

## At session start

The first time you do anything substantive in this project, call:

```
get_session_briefing()
```

It returns the active rules dump. Acknowledge it once, then keep its contents in mind for the rest of the session.

## Before any UI work

Whenever the user asks you to **build / add / create / make / show / render / display** any UI element — component, layout, navbar, sidebar, form, table, button, modal, dialog, drawer, sheet, popover, tooltip, badge, alert, banner, toast, accordion, tabs, breadcrumb, pagination, card, panel, hero, footer, page, screen, dashboard, view, anything visual — you **MUST** call:

```
plan_ui("<concrete description of what they need>")
```

**before writing any code.** The response gives you:

- The recommended DS component with import statement
- Required tokens (verbatim — never invent)
- Applicable rules to follow
- Anti-patterns to avoid
- Starter snippet
- Alternatives ranked by relevance

If the prompt is implicit ("design a sign-in screen", "I need a place to show notifications"), still call `plan_ui` with your interpretation — it returns the right component plus blueprint questions to clarify with the user.

## Hard rules — zero drift

- **Never invent tokens.** Only use what `get_foundations` or the component's `tokens` map confirms exists.
- **Never use raw colors** (`bg-blue-500`, `bg-zinc-900`, `text-purple-700`, hex like `#84cc16`). Always use semantic tokens (`bg-primary`, `bg-card`, `text-foreground`, `text-status-success`).
- **Never hand-roll components** when the DS provides them. Raw `<table>`, custom `<dialog>`, hand-rolled dropdowns are forbidden.
- **Brand CTA pattern**: `bg-primary text-primary-foreground` (semantic, auto light/dark). Or explicitly `bg-brand-300 dark:bg-brand-500`. Never hardcode `bg-yellow-300` or `bg-lime-500`.
- **Status indicators**: `bg-status-{success|warning|error|info|ai}` with `/10` for soft fills + `text-status-*` for icons.
- **Icons**: `lucide-react` only. Sizes via `size-4` / `size-5`. Color via `text-muted-foreground` or status tokens.

## When `plan_ui` returns no good match

That's a real DS gap. Don't fall back to raw HTML. Instead:

1. Tell the user explicitly: "The DS doesn't cover this directly."
2. Call `report_error({ component, error, context })` to log the gap for the DS team.
3. Ask the user whether to use the closest DS primitive (acknowledge the trade-off) or pause until the DS adds it.

## Quick reference — most-used tools

```
get_session_briefing()              # ONCE per session
plan_ui("<description>")            # BEFORE any UI
get_component("Button")             # full spec
get_foundations("colors")           # token verification
get_rules("brand-colors")           # governance
search_governance("query")          # fuzzy lookup
report_error({ ... })               # log a gap
```

## When in doubt

> If you wouldn't bet $100 that the token/component you're about to use exists in the DS — call `get_foundations` or `get_component` first. The MCP is online, the answer takes 200ms.
