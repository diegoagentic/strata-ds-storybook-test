/**
 * MBIQuotesPage — skeleton for FASE 4. The real Quotes AI flow
 * (m3.3 BOM check → m3.5 vendor upload → m3.2 GP review → m3.6 proposal
 * review → m3.4 send) lands in FASE 7.
 *
 * For now this surfaces the 5-step wizard chips so the user understands
 * the flow shape even before they trigger the demo.
 */

import { Card, CardContent, Heading, Text } from 'strata-design-system';
import MBIPageShell from './MBIPageShell';

const QUOTES_STEPS = [
  { id: 'm3.3', label: 'BOM Check', detail: 'Validate completeness, duplicates, non-catalog pricing' },
  { id: 'm3.5', label: 'Vendor PDF', detail: 'Upload + extract SKU/price/lead-time, resolve NC items' },
  { id: 'm3.2', label: 'GP Review', detail: 'Set GP per vendor, contract-locked auto-applied' },
  { id: 'm3.6', label: 'Proposal Review', detail: 'CORE Quote line items, adjust GP if needed' },
  { id: 'm3.4', label: 'Send Proposal', detail: 'Approve and dispatch, EDI + non-EDI POs' },
];

export default function MBIQuotesPage() {
  return (
    <MBIPageShell
      title="Quotes AI"
      subtitle="5-step BOM-to-proposal workflow — Marcia Ludwig's PM bottleneck collapsed to 1 AI + 1 human review."
    >
      <div className="mt-6">
        {/* Step chips */}
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {QUOTES_STEPS.map((step, idx) => (
            <li
              key={step.id}
              className="bg-card border border-border rounded-lg p-4 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="size-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs font-bold tabular-nums">
                  {idx + 1}
                </span>
                <span className="text-xs font-mono text-muted-foreground">{step.id}</span>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">{step.label}</p>
              <p className="text-xs text-muted-foreground flex-1">{step.detail}</p>
            </li>
          ))}
        </ol>

        <Card>
          <CardContent className="p-12 text-center">
            <Heading level={3} className="mb-2">
              Quotes AI — coming in FASE 7
            </Heading>
            <Text className="text-muted-foreground max-w-xl mx-auto">
              All 5 scene components (QuoteValidationScene, QuoteVendorUploadScene,
              QuoteGPReviewScene, QuoteProposalReviewScene, QuoteSendProposalScene)
              port in the next session. ~3,300 LoC total.
            </Text>
            <Text className="text-xs text-muted-foreground mt-4 italic">
              Click the floating ▶ Demo button bottom-right to run the guided tour now.
            </Text>
          </CardContent>
        </Card>
      </div>
    </MBIPageShell>
  );
}
