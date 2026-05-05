/**
 * MBIOverviewPage — landing rich for the MBI tenant when no demo is active.
 *
 * Composes:
 *   - MBIPageShell (header + breadcrumbs + tenant context)
 *   - 3 KPICards for tenant stats (manufacturers, employees, revenue)
 *   - 2 flow cards (Accounting AI, Quotes AI) — clickable, set currentPage
 *   - Demo CTA highlighting the floating ▶ Demo button
 *
 * DS-only:
 *   - <KPICard>, <Card>, <Badge>, <Button> from strata-design-system
 *   - tokens: bg-card, bg-muted, text-foreground, text-muted-foreground,
 *     bg-primary, border-border, bg-status-ai/* (per get_foundations)
 */

import { Building2, Users, TrendingUp, Receipt, FileSearch, ArrowRight, Sparkles, Play } from 'lucide-react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, KPICard } from 'strata-design-system';
import MBIPageShell from './MBIPageShell';

interface MBIOverviewPageProps {
  onNavigate?: (page: string) => void;
}

export default function MBIOverviewPage({ onNavigate }: MBIOverviewPageProps) {
  return (
    <MBIPageShell
      title="MBI · Strata AI on the floor"
      subtitle="Modern Business Interiors — a furniture dealer running Accounting AI and Quotes AI on the Strata stack."
    >
      {/* Tenant stats */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Tenant snapshot
        </h2>
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
      </section>

      {/* Available AI flows */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Available AI flows
        </h2>
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
      </section>

      {/* Try the guided demo */}
      <section className="mt-10">
        <Card variant="glass" className="border-status-ai/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-status-ai" />
              Try the guided demo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
              Click the floating <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-full bg-card border border-border text-xs font-semibold"><Play className="size-3 fill-current" /> Demo</span>
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
      </section>
    </MBIPageShell>
  );
}

// ─── Flow card subcomponent ──────────────────────────────────────

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
