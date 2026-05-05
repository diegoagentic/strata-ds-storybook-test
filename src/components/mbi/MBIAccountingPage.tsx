/**
 * MBIAccountingPage — skeleton for FASE 4. The real Accounting AI flow
 * (m2.1: bill queue, m2.3: line-by-line reconciliation, m2.4: AR aging,
 * m2.5: collection drafts) lands in FASE 5/6.
 *
 * For now this gives the user a "first look" of what Accounting AI does
 * even before they trigger the demo: tabs (AP Exceptions / Collections),
 * empty-state placeholders, stub data.
 */

import { useState } from 'react';
import { Receipt, Banknote } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  CardContent,
  Heading,
  Text,
} from 'strata-design-system';
import MBIPageShell from './MBIPageShell';

export default function MBIAccountingPage() {
  const [tab, setTab] = useState<'ap' | 'collections'>('ap');

  return (
    <MBIPageShell
      title="Accounting AI"
      subtitle="Bill queue exceptions and AR aging — Kathy Belleville's daily flow."
    >
      <div className="mt-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as 'ap' | 'collections')}>
          <TabsList variant="muted">
            <TabsTrigger value="ap" className="gap-2">
              <Receipt className="size-4" />
              AP Exceptions
            </TabsTrigger>
            <TabsTrigger value="collections" className="gap-2">
              <Banknote className="size-4" />
              Collections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ap" className="mt-6">
            <PlaceholderPanel
              tab="AP Exceptions"
              upcoming="Bill queue table, invoice detail panel, line-by-line reconciliation"
              fase="FASE 5 (m2.1, m2.3)"
            />
          </TabsContent>

          <TabsContent value="collections" className="mt-6">
            <PlaceholderPanel
              tab="Collections"
              upcoming="AR aging board, hold-review modal, AI-drafted email previews"
              fase="FASE 6 (m2.4, m2.5)"
            />
          </TabsContent>
        </Tabs>
      </div>
    </MBIPageShell>
  );
}

function PlaceholderPanel({
  tab,
  upcoming,
  fase,
}: {
  tab: string;
  upcoming: string;
  fase: string;
}) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Heading level={3} className="mb-2">
          {tab} — coming in {fase}
        </Heading>
        <Text className="text-muted-foreground max-w-xl mx-auto">
          {upcoming}
        </Text>
        <Text className="text-xs text-muted-foreground mt-4 italic">
          Click the floating ▶ Demo button bottom-right to run the guided tour
          while the real components are being ported.
        </Text>
      </CardContent>
    </Card>
  );
}
