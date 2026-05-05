/**
 * MBIOverviewPage — landing rich for the MBI tenant when no demo is active.
 *
 * Layout follows the v1 Acme Corp Overview screenshot:
 *   - Tabs: Follow Up · Your tools · Metrics
 *   - Follow Up (default): 2-column with Urgent Actions + Recent Activity
 *   - Your tools: cards linking to Accounting AI / Quotes AI flows
 *   - Metrics: tenant KPIs
 *
 * All data is derived from MBI mock files (no Acme content) — the v1
 * structure is reused but every record is MBI:
 *   - Urgent Actions: real exception bill + escalated AR + pending proposal
 *   - Recent Activity: simulated audit feed referencing MBI invoices/AR/proposals
 */

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Clock,
  FileSearch,
  Receipt,
  Sparkles,
  Play,
  ListChecks,
  Wrench,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Mail,
  PauseCircle,
  TrendingUp,
  Building2,
  Users,
  ChevronDown,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  KPICard,
  PriorityBadge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'strata-design-system';
import MBIPageShell from './MBIPageShell';
import {
  MBI_INVOICES,
  MBI_AR_RECORDS,
  MBI_PROPOSALS,
} from '@/config/profiles/mbi-data';

interface MBIOverviewPageProps {
  onNavigate?: (page: string) => void;
}

export default function MBIOverviewPage({ onNavigate }: MBIOverviewPageProps) {
  return (
    <MBIPageShell
      title="MBI · Strata AI on the floor"
      subtitle="Modern Business Interiors — a furniture dealer running Accounting AI and Quotes AI on the Strata stack."
    >
      <Tabs defaultValue="follow-up" className="mt-6">
        <TabsList>
          <TabsTrigger value="follow-up">
            <ListChecks className="size-4" />
            Follow Up
          </TabsTrigger>
          <TabsTrigger value="tools">
            <Wrench className="size-4" />
            Your tools
          </TabsTrigger>
          <TabsTrigger value="metrics">
            <BarChart3 className="size-4" />
            Metrics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="follow-up" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UrgentActionsPanel onOpenAccounting={() => onNavigate?.('mbi-accounting')} />
            <RecentActivityPanel />
          </div>

          {/* Demo CTA stays on Follow Up since it's the entry point */}
          <DemoCallout className="mt-6" />
        </TabsContent>

        <TabsContent value="tools" className="mt-6">
          <ToolsTab onNavigate={onNavigate} />
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <MetricsTab />
        </TabsContent>
      </Tabs>
    </MBIPageShell>
  );
}

// ─── Follow Up · Urgent Actions ─────────────────────────────────────────────

function UrgentActionsPanel({ onOpenAccounting }: { onOpenAccounting: () => void }) {
  const items = useMemo(() => buildUrgentActions(), []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="size-4 text-status-warning" />
            Urgent Actions
          </CardTitle>
          <Badge variant="soft" color="amber">
            {items.length} Pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <UrgentActionRow key={item.id} item={item} onOpen={onOpenAccounting} />
        ))}
      </CardContent>
    </Card>
  );
}

interface UrgentAction {
  id: string;
  icon: React.ReactNode;
  iconTone: 'warning' | 'destructive' | 'info';
  title: string;
  description: string;
  badgeLabel: string;
  badgePriority: 'medium' | 'high' | 'critical';
}

function buildUrgentActions(): UrgentAction[] {
  const exceptionBill = MBI_INVOICES.find((b) => b.hasException && b.status === 'pending');
  const escalatedAR = MBI_AR_RECORDS.find((a) => a.status === 'escalated');
  const pendingProposal = MBI_PROPOSALS.find((p) => p.coreStatus === 'pending-review');

  const actions: UrgentAction[] = [];

  if (exceptionBill) {
    actions.push({
      id: exceptionBill.id,
      icon: <Clock className="size-4" />,
      iconTone: 'warning',
      title: `Bill ${exceptionBill.id} · ${exceptionBill.vendor}`,
      description: exceptionBill.exceptionReason ?? 'Exception flagged by reconciler.',
      badgeLabel: '2h remaining',
      badgePriority: 'medium',
    });
  }

  if (escalatedAR) {
    actions.push({
      id: escalatedAR.id,
      icon: <AlertTriangle className="size-4" />,
      iconTone: 'destructive',
      title: `AR escalated · ${escalatedAR.client}`,
      description: `$${escalatedAR.amount.toLocaleString()} · ${escalatedAR.daysPastDue} days past due · last contact ${escalatedAR.lastContact ?? 'unknown'}`,
      badgeLabel: 'Urgent',
      badgePriority: 'critical',
    });
  }

  if (pendingProposal) {
    actions.push({
      id: pendingProposal.id,
      icon: <CheckCircle2 className="size-4" />,
      iconTone: 'info',
      title: `Proposal ${pendingProposal.id}`,
      description: `${pendingProposal.lineItemCount} line items · ${pendingProposal.manufacturers.join(', ')} · awaiting GP review`,
      badgeLabel: '14m ago',
      badgePriority: 'high',
    });
  }

  return actions;
}

const TONE_BG: Record<UrgentAction['iconTone'], string> = {
  warning: 'bg-status-warning/15 text-status-warning',
  destructive: 'bg-destructive/15 text-destructive',
  info: 'bg-status-info/15 text-status-info',
};

function UrgentActionRow({ item, onOpen }: { item: UrgentAction; onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl bg-card transition-colors hover:bg-muted/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 p-3 text-left"
      >
        <span
          className={`mt-0.5 size-7 rounded-lg flex items-center justify-center shrink-0 ${TONE_BG[item.iconTone]}`}
        >
          {item.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-foreground truncate">{item.title}</h4>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {item.description}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <PriorityBadge priority={item.badgePriority} size="nano" shape="pill">
            {item.badgeLabel}
          </PriorityBadge>
          <ChevronDown
            className={`size-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 border-t border-border/60">
          <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
          <Button size="sm" variant="outline" onClick={onOpen}>
            Resolve in Accounting AI
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Follow Up · Recent Activity ────────────────────────────────────────────

function RecentActivityPanel() {
  const [filter, setFilter] = useState<'related' | 'all'>('related');
  const items = useMemo(() => buildRecentActivity(), []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="size-4 text-muted-foreground" />
            Recent Activity
          </CardTitle>
          <button
            type="button"
            onClick={() => setFilter((f) => (f === 'related' ? 'all' : 'related'))}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {filter === 'related' ? 'Related to You' : 'All activity'}
            <ChevronDown className="size-3.5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <ActivityRow key={item.id} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  iconTone: 'success' | 'info' | 'warning' | 'ai';
  title: string;
  ref: string;
  ago: string;
  detail: string;
}

function buildRecentActivity(): ActivityItem[] {
  const postedBill = MBI_INVOICES.find((b) => b.status === 'done' && b.isEDI);
  const committedAR = MBI_AR_RECORDS.find((a) => a.status === 'committed-to-pay');
  const sentProposal = MBI_PROPOSALS.find((p) => p.coreStatus === 'approved');
  const heldAR = MBI_AR_RECORDS.find((a) => a.collectionsHold);
  const inProgressBill = MBI_INVOICES.find((b) => b.status === 'in-progress');

  const items: ActivityItem[] = [];

  if (postedBill) {
    items.push({
      id: `act-${postedBill.id}`,
      icon: <CheckCircle2 className="size-4" />,
      iconTone: 'success',
      title: 'Bill auto-posted to GL',
      ref: postedBill.id,
      ago: '2 hours ago',
      detail: `${postedBill.vendor} · $${postedBill.amount.toLocaleString()} · ${postedBill.ocrConfidence}% OCR confidence`,
    });
  }

  if (committedAR) {
    items.push({
      id: `act-${committedAR.id}`,
      icon: <Mail className="size-4" />,
      iconTone: 'info',
      title: 'Collection email sent',
      ref: committedAR.poNumber,
      ago: '3 hours ago',
      detail: `${committedAR.client} · $${committedAR.amount.toLocaleString()} · committed-to-pay`,
    });
  }

  if (inProgressBill) {
    items.push({
      id: `act-${inProgressBill.id}`,
      icon: <AlertTriangle className="size-4" />,
      iconTone: 'warning',
      title: 'Reconciliation in progress',
      ref: inProgressBill.id,
      ago: '4 hours ago',
      detail: inProgressBill.inProgressReason ?? `${inProgressBill.vendor} · $${inProgressBill.amount.toLocaleString()}`,
    });
  }

  if (sentProposal) {
    items.push({
      id: `act-${sentProposal.id}`,
      icon: <Sparkles className="size-4" />,
      iconTone: 'ai',
      title: 'Proposal approved + sent',
      ref: sentProposal.id,
      ago: '5 hours ago',
      detail: `${sentProposal.lineItemCount} lines · ${sentProposal.manufacturers.join(', ')} · approved by GP`,
    });
  }

  if (heldAR) {
    items.push({
      id: `act-hold-${heldAR.id}`,
      icon: <PauseCircle className="size-4" />,
      iconTone: 'warning',
      title: 'AR collections hold',
      ref: heldAR.poNumber,
      ago: 'Yesterday',
      detail: `${heldAR.client} · ${heldAR.holdReason === 'punch-list-open' ? `${heldAR.punchListOpen} punch items open` : 'installation pending'}`,
    });
  }

  return items;
}

const ACT_TONE_BG: Record<ActivityItem['iconTone'], string> = {
  success: 'bg-status-success/15 text-status-success',
  info: 'bg-status-info/15 text-status-info',
  warning: 'bg-status-warning/15 text-status-warning',
  ai: 'bg-status-ai/15 text-status-ai',
};

function ActivityRow({ item }: { item: ActivityItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl bg-card transition-colors hover:bg-muted/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 p-3 text-left"
      >
        <span
          className={`mt-0.5 size-7 rounded-lg flex items-center justify-center shrink-0 ${ACT_TONE_BG[item.iconTone]}`}
        >
          {item.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-foreground truncate">{item.title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {item.ago}
            <span className="mx-1.5 text-muted-foreground/60">·</span>
            <span className="font-mono">{item.ref}</span>
          </p>
        </div>
        <ChevronDown
          className={`size-4 text-muted-foreground shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1 border-t border-border/60">
          <p className="text-xs text-muted-foreground">{item.detail}</p>
        </div>
      )}
    </div>
  );
}

// ─── Tools tab ──────────────────────────────────────────────────────────────

function ToolsTab({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FlowCard
        icon={<Receipt className="size-5" />}
        title="Accounting AI"
        persona="Kathy Belleville · Controller"
        description="Bill queue + non-EDI reconciliation + AR aging + collection drafts. Phase 1 Pilot — Mark approved this scope April 23."
        sceneCount={4}
        onOpen={() => onNavigate?.('mbi-accounting')}
      />
      <FlowCard
        icon={<FileSearch className="size-5" />}
        title="Quotes AI"
        persona="Marcia Ludwig · Director of PM"
        description="BOM completeness check, vendor PDF upload, GP review, proposal review and send. Phase 4 — 4-loop audit collapsed to 1 AI + 1 human review."
        sceneCount={5}
        onOpen={() => onNavigate?.('mbi-quotes')}
      />
    </div>
  );
}

function FlowCard({
  icon,
  title,
  persona,
  description,
  sceneCount,
  onOpen,
}: {
  icon: React.ReactNode;
  title: string;
  persona: string;
  description: string;
  sceneCount: number;
  onOpen: () => void;
}) {
  return (
    <Card className="hover:border-status-ai/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-status-ai/10 text-status-ai flex items-center justify-center">
              {icon}
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{persona}</p>
            </div>
          </div>
          <Badge variant="soft" color="zinc" className="text-[10px]">
            {sceneCount} scenes
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button variant="outline" size="sm" onClick={onOpen} className="w-full sm:w-auto">
          Open {title}
          <ArrowRight className="size-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Metrics tab ────────────────────────────────────────────────────────────

function MetricsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KPICard
        label="Manufacturer partners"
        value={30}
        subValue="Allsteel · Steelcase · HNI · 27 more"
        icon={<Building2 className="size-5" />}
      />
      <KPICard
        label="Team"
        value={42}
        subValue="Controllers · PMs · Designers"
        icon={<Users className="size-5" />}
      />
      <KPICard
        label="Annual revenue"
        value={17000000}
        valueFormat="currency"
        currency="USD"
        subValue="St. Charles, MO + Lenexa, KS"
        icon={<TrendingUp className="size-5" />}
        tone="success"
      />
    </div>
  );
}

// ─── Demo CTA ───────────────────────────────────────────────────────────────

function DemoCallout({ className = '' }: { className?: string }) {
  return (
    <Card variant="glass" className={`border-status-ai/30 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-status-ai" />
          Try the guided demo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          Click the floating
          <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-full bg-card border border-border text-xs font-semibold">
            <Play className="size-3 fill-current" /> Demo
          </span>
          button bottom-right to start a 9-step walkthrough across all three flows
          (Accounting AI · Collections AI · Quotes AI). Each step is interactive —
          click "Review", "Resolve", "Send" to advance.
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="soft" color="blue">9 steps</Badge>
          <Badge variant="soft" color="purple">3 flows</Badge>
          <Badge variant="soft" color="zinc">~15 min walkthrough</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
