/**
 * MBITransactionsPage — App-mode browse for the MBI tenant.
 *
 * Layout follows the v1 Acme Corp Transactions screenshot:
 *   - Top tabs: Quotes · Purchase Orders · Acknowledgements · Projects
 *   - Each tab renders a Kanban-style horizontal scroller with cards
 *     grouped by the tab-specific status column.
 *
 * Data comes 100% from MBI mock files — no Acme content:
 *   - Quotes  → MBI_PROPOSALS grouped by coreStatus
 *   - POs     → MBI_INVOICES grouped by status (pending / in-progress / done)
 *   - ACKs    → derived from approved proposals (one ACK per approved PROP)
 *   - Projects → MBI_DESIGN_PROJECTS grouped by status
 */

import { useMemo, useState } from 'react';
import {
  FileSearch,
  ShoppingCart,
  ClipboardCheck,
  FolderKanban,
  Search,
  ArrowRight,
  Plus,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'strata-design-system';
import MBIPageShell from './MBIPageShell';
import {
  MBI_PROPOSALS,
  MBI_INVOICES,
  MBI_DESIGN_PROJECTS,
} from '@/config/profiles/mbi-data';

export default function MBITransactionsPage() {
  return (
    <MBIPageShell
      title="MBI · Transactions"
      subtitle="Quotes, purchase orders, acknowledgements and active projects — live across the MBI book of business."
    >
      <Tabs defaultValue="quotes" className="mt-6">
        <TabsList>
          <TabsTrigger value="quotes">
            <FileSearch className="size-4" />
            Quotes
          </TabsTrigger>
          <TabsTrigger value="pos">
            <ShoppingCart className="size-4" />
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="acks">
            <ClipboardCheck className="size-4" />
            Acknowledgements
          </TabsTrigger>
          <TabsTrigger value="projects">
            <FolderKanban className="size-4" />
            Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="mt-6">
          <QuotesBoard />
        </TabsContent>

        <TabsContent value="pos" className="mt-6">
          <PurchaseOrdersBoard />
        </TabsContent>

        <TabsContent value="acks" className="mt-6">
          <AcknowledgementsBoard />
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <ProjectsBoard />
        </TabsContent>
      </Tabs>
    </MBIPageShell>
  );
}

// ─── Generic kanban shell ───────────────────────────────────────────────────

interface KanbanColumn<T> {
  id: string;
  title: string;
  count: number;
  tone: 'success' | 'info' | 'warning' | 'ai' | 'neutral';
  records: T[];
}

const COLUMN_TONE: Record<KanbanColumn<unknown>['tone'], string> = {
  success: 'bg-status-success/15 text-status-success',
  info: 'bg-status-info/15 text-status-info',
  warning: 'bg-status-warning/15 text-status-warning',
  ai: 'bg-status-ai/15 text-status-ai',
  neutral: 'bg-muted text-muted-foreground',
};

function KanbanShell({
  totalLabel,
  totalCount,
  searchPlaceholder,
  primaryAction,
  columns,
  renderCard,
  emptyState,
}: {
  totalLabel: string;
  totalCount: number;
  searchPlaceholder: string;
  primaryAction?: { label: string; onClick: () => void };
  columns: KanbanColumn<unknown>[];
  renderCard: (record: unknown, columnTone: KanbanColumn<unknown>['tone']) => React.ReactNode;
  emptyState: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-foreground">{totalLabel}</h3>
          <Badge variant="soft" color="zinc">{totalCount}</Badge>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
          {primaryAction && (
            <Button onClick={primaryAction.onClick} size="sm">
              <Plus className="size-3.5" />
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-micro">
        {columns.map((col) => (
          <div key={col.id} className="min-w-[280px] flex-1 max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-bold text-foreground">{col.title}</h4>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${COLUMN_TONE[col.tone]}`}
              >
                {col.count}
              </span>
            </div>
            <div className="space-y-2">
              {col.records.length === 0 ? (
                <div className="text-xs text-muted-foreground italic px-3 py-4 border border-dashed border-border rounded-xl">
                  {emptyState}
                </div>
              ) : (
                col.records.map((rec, i) => (
                  <div key={i}>{renderCard(rec, col.tone)}</div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── Generic record card ────────────────────────────────────────────────────

function RecordCard({
  initials,
  title,
  reference,
  fields,
  status,
  statusTone,
}: {
  initials: string;
  title: string;
  reference: string;
  fields: { label: string; value: string }[];
  status: string;
  statusTone: KanbanColumn<unknown>['tone'];
}) {
  return (
    <div className="border border-border rounded-xl bg-card p-3 hover:border-status-ai/40 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <span className="size-8 rounded-full bg-status-ai/15 text-status-ai flex items-center justify-center text-[10px] font-bold shrink-0">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-foreground truncate">{title}</div>
          <div className="text-[10px] text-muted-foreground font-mono">{reference}</div>
        </div>
      </div>
      <div className="space-y-1.5 mb-3">
        {fields.map((f) => (
          <div key={f.label} className="flex items-center justify-between gap-2 text-xs">
            <span className="text-muted-foreground">{f.label}</span>
            <span className="text-foreground font-medium truncate">{f.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${COLUMN_TONE[statusTone]}`}
        >
          {status}
        </span>
        <Button size="sm" variant="outline" className="text-xs h-7">
          Details
          <ArrowRight className="size-3" />
        </Button>
      </div>
    </div>
  );
}

// ─── Quotes board ──────────────────────────────────────────────────────────

function QuotesBoard() {
  const [search, setSearch] = useState('');
  void search;

  const columns = useMemo(() => {
    const pending = MBI_PROPOSALS.filter((p) => p.coreStatus === 'pending-review');
    const approved = MBI_PROPOSALS.filter((p) => p.coreStatus === 'approved');
    return [
      { id: 'pending', title: 'Pending Review', tone: 'warning' as const, records: pending, count: pending.length },
      { id: 'approved', title: 'Approved', tone: 'success' as const, records: approved, count: approved.length },
      { id: 'sent', title: 'Sent to Client', tone: 'info' as const, records: [], count: 0 },
      { id: 'archived', title: 'Archived', tone: 'neutral' as const, records: [], count: 0 },
    ];
  }, []);

  return (
    <KanbanShell
      totalLabel="Active Quotes"
      totalCount={MBI_PROPOSALS.length}
      searchPlaceholder="Search quotes..."
      columns={columns}
      emptyState="No quotes in this column yet."
      renderCard={(rec, tone) => {
        const p = rec as (typeof MBI_PROPOSALS)[number];
        const initials = p.id.split('-').slice(-1)[0].slice(-2);
        return (
          <RecordCard
            initials={initials}
            title={`${p.lineItemCount} line items`}
            reference={`#${p.id}`}
            fields={[
              { label: 'Manufacturers', value: p.manufacturers.slice(0, 2).join(' · ') },
              { label: 'Budget', value: p.budgetId },
              { label: 'Updated', value: new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) },
            ]}
            status={p.coreStatus === 'pending-review' ? 'Pending Review' : 'Approved'}
            statusTone={tone}
          />
        );
      }}
    />
  );
}

// ─── Purchase Orders board ─────────────────────────────────────────────────

function PurchaseOrdersBoard() {
  const columns = useMemo(() => {
    const pending = MBI_INVOICES.filter((b) => b.status === 'pending');
    const inProgress = MBI_INVOICES.filter((b) => b.status === 'in-progress');
    const done = MBI_INVOICES.filter((b) => b.status === 'done');
    return [
      { id: 'pending', title: 'Pending Review', tone: 'warning' as const, records: pending, count: pending.length },
      { id: 'in-progress', title: 'In Progress', tone: 'info' as const, records: inProgress, count: inProgress.length },
      { id: 'done', title: 'Auto-Posted', tone: 'success' as const, records: done.slice(0, 4), count: done.length },
      { id: 'archived', title: 'Archived', tone: 'neutral' as const, records: [], count: 0 },
    ];
  }, []);

  return (
    <KanbanShell
      totalLabel="Recent POs"
      totalCount={MBI_INVOICES.length}
      searchPlaceholder="Search POs..."
      primaryAction={{ label: 'Create PO', onClick: () => {} }}
      columns={columns}
      emptyState="No POs in this column."
      renderCard={(rec, tone) => {
        const inv = rec as (typeof MBI_INVOICES)[number];
        const statusLabel =
          inv.status === 'done' ? 'Auto-Posted' : inv.status === 'in-progress' ? 'In Progress' : 'Pending Review';
        return (
          <RecordCard
            initials={inv.vendor.slice(0, 2).toUpperCase()}
            title={inv.vendor}
            reference={`#${inv.poNumber}`}
            fields={[
              { label: 'Amount', value: `$${inv.amount.toLocaleString()}` },
              { label: 'Due', value: inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—' },
              { label: 'OCR conf.', value: `${inv.ocrConfidence}%` },
            ]}
            status={statusLabel}
            statusTone={tone}
          />
        );
      }}
    />
  );
}

// ─── Acknowledgements board ───────────────────────────────────────────────

function AcknowledgementsBoard() {
  const approvedQuotes = MBI_PROPOSALS.filter((p) => p.coreStatus === 'approved');
  const columns = useMemo(() => {
    return [
      { id: 'awaiting', title: 'Awaiting ACK', tone: 'warning' as const, records: approvedQuotes.slice(0, 1), count: 1 },
      { id: 'received', title: 'ACK Received', tone: 'info' as const, records: approvedQuotes.slice(1), count: approvedQuotes.length - 1 },
      { id: 'cleared', title: 'Cleared', tone: 'success' as const, records: [], count: 0 },
      { id: 'flagged', title: 'Flagged', tone: 'neutral' as const, records: [], count: 0 },
    ];
  }, [approvedQuotes]);

  return (
    <KanbanShell
      totalLabel="Active Acknowledgements"
      totalCount={approvedQuotes.length}
      searchPlaceholder="Search acknowledgements..."
      columns={columns}
      emptyState="No ACKs in this column."
      renderCard={(rec, tone) => {
        const p = rec as (typeof MBI_PROPOSALS)[number];
        return (
          <RecordCard
            initials={p.manufacturers[0].slice(0, 2).toUpperCase()}
            title={p.manufacturers.join(' + ')}
            reference={`#ACK-${p.id.split('-').slice(-1)[0]}`}
            fields={[
              { label: 'Lines', value: `${p.lineItemCount}` },
              { label: 'Budget', value: p.budgetId },
              { label: 'Created by', value: p.createdBy },
            ]}
            status={tone === 'warning' ? 'Awaiting' : 'Received'}
            statusTone={tone}
          />
        );
      }}
    />
  );
}

// ─── Projects board ────────────────────────────────────────────────────────

function ProjectsBoard() {
  const columns = useMemo(() => {
    const intake = MBI_DESIGN_PROJECTS.filter((p) => p.status === 'intake');
    const design = MBI_DESIGN_PROJECTS.filter((p) => p.status === 'design');
    const review = MBI_DESIGN_PROJECTS.filter((p) => p.status === 'review');
    const approved = MBI_DESIGN_PROJECTS.filter((p) => p.status === 'approved');
    return [
      { id: 'intake', title: 'Intake', tone: 'neutral' as const, records: intake, count: intake.length },
      { id: 'design', title: 'In Design', tone: 'ai' as const, records: design, count: design.length },
      { id: 'review', title: 'Review', tone: 'warning' as const, records: review, count: review.length },
      { id: 'approved', title: 'Approved', tone: 'success' as const, records: approved, count: approved.length },
    ];
  }, []);

  return (
    <KanbanShell
      totalLabel="Active Projects"
      totalCount={MBI_DESIGN_PROJECTS.length}
      searchPlaceholder="Search projects..."
      columns={columns}
      emptyState="No projects in this stage."
      renderCard={(rec, tone) => {
        const p = rec as (typeof MBI_DESIGN_PROJECTS)[number];
        const budgetPct =
          p.budgetTracked && p.budgetTracked.allocated > 0
            ? Math.round((p.budgetTracked.spent / p.budgetTracked.allocated) * 100)
            : null;
        return (
          <RecordCard
            initials={p.client.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            title={p.name}
            reference={`#${p.id}`}
            fields={[
              { label: 'Client', value: p.client },
              { label: 'Vertical', value: p.vertical },
              { label: 'Hours', value: `${p.hoursLogged}h` },
              ...(budgetPct !== null ? [{ label: 'Budget used', value: `${budgetPct}%` }] : []),
            ]}
            status={p.status[0].toUpperCase() + p.status.slice(1)}
            statusTone={tone}
          />
        );
      }}
    />
  );
}
