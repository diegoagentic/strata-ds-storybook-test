/**
 * ARAgingWrapScene — FASE 6 stub.
 * Real port lands in FASE 6 (m2.5).
 */

import { Card, CardContent, Heading, Text } from 'strata-design-system';

export default function ARAgingWrapScene() {
  return (
    <Card className="my-6">
      <CardContent className="p-12 text-center">
        <Heading level={3} className="mb-2">
          Collection drafts + wrap · coming in FASE 6
        </Heading>
        <Text className="text-muted-foreground max-w-xl mx-auto">
          AI-drafted collection emails with tone matched per account history.
          Click to expand each draft, optionally edit, send, and hand off to
          Quotes AI. Wires up the real m2.5 step.
        </Text>
      </CardContent>
    </Card>
  );
}
