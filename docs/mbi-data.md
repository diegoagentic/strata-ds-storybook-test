# MBI mock data inventory

All MBI demo data lives in `src/config/profiles/mbi-data/`. 18 files, all
typed against shapes in `types.ts`. Imports go through the barrel
(`src/config/profiles/mbi-data/index.ts`) so consumers write
`import { MBI_INVOICES } from '@/config/profiles/mbi-data'`.

## Files

| File | Exports | Used by |
|---|---|---|
| `tenant.ts` | `MBI_TENANT` | `MBIPageShell`, MBIOverviewPage Metrics tab |
| `types.ts` | type-only | every other data file |
| `stakeholders.ts` | `MBI_STAKEHOLDERS`, `getStakeholder` | `MBIPersonaBadge`, scene attribution |
| `manufacturers.ts` | `MBI_MANUFACTURERS`, `getManufacturer` | NonCatalogValidatorTable, vendor chips |
| `contracts.ts` | `MBI_CONTRACTS`, `getContract` | DataSourcesBar tooltips, contract checks |
| `pricingReference.ts` | `MBI_PRICING_REFERENCE`, `PRICING_BUFFER_PCT` | NonEDIReconciliationPanel |
| `typicals.ts` | `MBI_TYPICALS` | spec-check scenes |
| `budgetRequests.ts` | `MBI_BUDGET_REQUESTS`, `HERO_VALIDATION`, `HERO_VALIDATION_SECONDARY`, `HERO_SCENARIOS`, `getHeroBudget` | Quotes flow scenes |
| `sifSamples.ts` | `MBI_SIF_SAMPLES`, `getSIFSample` | SIFParserPreview, SIFToCOREPreview |
| `invoices.ts` | `MBI_INVOICES` | AccountingMorningQueue, InvoiceQueueTable, MBIOverviewPage Urgent + Activity, MBITransactionsPage POs tab |
| `arRecords.ts` | `MBI_AR_RECORDS` | ARStatusBoard, ARAgingReviewScene, AIEmailDraftsPanel, ARHoldReviewModal, MBIOverviewPage Urgent + Activity |
| `billingForecast.ts` | `MBI_BILLING_FORECAST`, `FORECAST_ACCURACY` | LiveBillingForecast (out of MVP scope) |
| `proposals.ts` | `MBI_PROPOSALS` | QuoteProposalReviewScene, MBIOverviewPage Urgent + Activity, MBITransactionsPage Quotes + ACKs tabs |
| `specChecks.ts` | `MBI_SPEC_CHECKS` | SpecCheckReport, AISpecCheckSimulation |
| `designProjects.ts` | `MBI_DESIGN_PROJECTS` | MBITransactionsPage Projects tab |
| `painPoints.ts` | `MBI_PAIN_POINTS`, `PAIN_POINTS_BY_MODULE`, `getPainPointsByModule`, `getPainPointsByPhase`, `getCriticalAndHighByModule`, `assertNoCETInAccounting` | (mostly out of MVP scope — kept for reference) |
| `modulePhases.ts` | `MBI_MODULE_PHASES`, `MODULE_PHASES_BY_MODULE`, `getPhasesForModule` | Roadmap rendering (out of MVP scope) |
| `index.ts` | barrel | all consumers |

## Notable shapes

### `Invoice`

```ts
{
  id: 'INV-0484',
  vendor: 'Apex Workspace',
  poNumber: 'PO-2026-0051',
  amount: 12900,
  invoiceDate: '2026-04-16',
  paymentTerms: 'Net 30',
  dueDate: '2026-05-16',
  received: '2026-04-19T07:04:00Z',
  isEDI: false,
  ocrConfidence: 92,
  hasException: true,
  exceptionReason: 'Quantity mismatch: PO 6, bill 5 · short-shipped Jarvis desks',
  status: 'pending'
}
```

12 invoices in `MBI_INVOICES`, distributed:

- **5 done** (auto-posted EDI bills) — Allsteel, HON, Gunlocke, Kimball
- **3 in-progress** (non-EDI being agent-reconciled) — Pinnacle,
  ErgoTech, Pacific Fabrics
- **4 pending** (need Kathy's review) — Apex Workspace, plus 3 with
  exceptions

The exception bill INV-0484 (Apex Workspace short-ship) is the demo's
canonical "bill review" hero — it's the one shown in the FASE 5 m2.3
scene.

### `ARRecord`

```ts
{
  id: 'AR-001',
  client: 'Enterprise Holdings',
  poNumber: 'PO-2025-0892',
  amount: 42500,
  daysPastDue: 12,
  status: 'pending-approval',
  salesperson: 'Amanda Renshaw',
  collectionsHold: true,
  holdReason: 'installation-pending',
  installationDate: '2026-05-15'
}
```

12 records in `MBI_AR_RECORDS`. Status taxonomy:

- `escalated` — past 30 days, manager involvement (red accent)
- `no-response` — past 15 days, no client reply (amber)
- `pending-approval` — under review (info blue)
- `committed-to-pay` — client confirmed pay date (success green)

`collectionsHold: true` means the AR cannot be chased (installation
pending or punch-list open). The ARHoldReviewModal lets Kathy review
and decide release.

### `Proposal`

```ts
{
  id: 'PROP-2026-001',
  budgetId: 'BDG-2026-006',
  coreStatus: 'approved' | 'pending-review',
  lineItemCount: 38,
  manufacturers: ['Allsteel', 'HON'],
  createdBy: 'amy-behl',
  updatedAt: '2026-04-16T15:00:00Z'
}
```

3 records. PROP-2026-001 + PROP-2026-002 are approved (used in
Recent Activity); PROP-2026-003 (42 lines, 4 manufacturers) is
pending-review (used as an Urgent Action).

### `DesignProject`

```ts
{
  id: 'DP-001',
  name: 'Lakeside ICU Expansion',
  client: 'Lakeside Health',
  vertical: 'corporate' | 'healthcare' | 'education' | 'government',
  designerId: 'beth-gianino',
  status: 'intake' | 'design' | 'review' | 'approved',
  hoursLogged: 28,
  budgetTracked?: { allocated: 425000, spent: 411750 }
}
```

5 records. Kanban columns map to `status`. Lindenwood is the
intake-stage one (also the escalated AR — connected datasets across
files).

## Why we kept v1's exact records

Two reasons:

1. **Demo continuity**. Mark approved the demo on April 23, 2026 with
   these specific records (INV-0484 Apex short-ship, Lindenwood
   escalated AR, the Allsteel auto-posts). Changing the data would
   re-cast the narrative beats.
2. **Cross-references**. Multiple files reference the same client
   names, PO numbers, and stakeholder ids. Re-generating one file
   without the others would break the consistency that gives the
   demo its credibility.

## What's missing vs v1

Files that exist in v1 but were *not* ported because they're out of
the MVP scope:

- `freightTariff.ts` (FreightTariffPanel scene)
- `installerSchedule.ts` (InstallerPanel scene)
- `escalationRules.ts` (EscalationRuleBuilder scene)
- `cetConfig.ts` (CETConfigHelperPanel scene)
- `glossary.ts` (GlossaryTooltip)

If a future fase needs any of them, the port is a `cp` from
`../demo-2026-strata/src/config/profiles/mbi-data/` plus a barrel
re-export.

## Convention: never write to data

Every file is a `const`. No data structure is mutated at runtime.
Stateful demo behavior (e.g. "user clicked Resolve on INV-0484") lives
in scene-local React state, not in the fixture. This keeps the demo
deterministic and means a hard refresh always returns to the canonical
narrative.
