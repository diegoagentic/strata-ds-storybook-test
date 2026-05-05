/**
 * ARAgingReviewScene — FASE 6 stub.
 * Real port lands in FASE 6 (m2.4).
 */

import { Card, CardContent, Heading, Text } from 'strata-design-system';

interface ARAgingReviewSceneProps {
  /** Wired by MBIAccountingPage to advance the wizard step. The stub
   *  ignores it, but keeping the prop so the parent's call site doesn't
   *  need to be touched until FASE 6 ports the real scene. */
  onContinue?: () => void;
}

export default function ARAgingReviewScene(_props: ARAgingReviewSceneProps) {
  return (
    <Card className="my-6">
      <CardContent className="p-12 text-center">
        <Heading level={3} className="mb-2">
          AR aging review · coming in FASE 6
        </Heading>
        <Text className="text-muted-foreground max-w-xl mx-auto">
          Live AR kanban (escalated · no-response · pending · committed) with
          $240K sample data. Click into any account to see hold reason +
          context. Wires up the real m2.4 step in the demo flow.
        </Text>
      </CardContent>
    </Card>
  );
}
