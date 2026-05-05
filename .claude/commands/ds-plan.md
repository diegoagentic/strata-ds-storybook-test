---
description: Get a Strata DS blueprint for a UI element BEFORE writing code. Calls plan_ui on the MCP and surfaces the recommended component, tokens, rules, and anti-patterns. Use this whenever you're about to build any visual element.
---

You are about to build the UI described by the user. **Don't write code yet.**

First call the `ds-architect` agent (or run the steps below directly):

1. Construct a description like: "$ARGUMENTS"
2. Call `WebFetch http://localhost:3001/plan_ui?description=<URL-encoded description>`
3. Read the response: `primary_recommendation`, `alternatives`, `rules_that_apply`, `anti_patterns`, `next_steps`
4. For the primary, follow up with `WebFetch http://localhost:3001/components/<id>` for the full spec
5. Render a markdown blueprint with: component name, import, tokens, anti-patterns to avoid, starter snippet
6. List the open blueprint questions and ask the user to confirm before writing code

Hard rules:
- Never invent tokens — if not in `/foundations/colors` or the component's `tokens` map, don't recommend it
- For active/CTA patterns prefer `bg-primary text-primary-foreground` (semantic) over `bg-brand-300 dark:bg-brand-500` (raw)
- If the MCP server is unreachable, stop and ask the user to start it: `node src/mcp-server/index.mjs` from the DS repo

Original request: $ARGUMENTS
