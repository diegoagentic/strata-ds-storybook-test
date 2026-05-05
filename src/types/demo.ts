// Demo flow type definitions for demo-2026-strata-v3.
// MVP scope is MBI only — the SimulationApp and DemoProfileId unions are
// trimmed accordingly. Add other tenants when their flows are ported.

export type SimulationApp =
  | 'mbi-overview'
  | 'mbi-accounting'
  | 'mbi-quotes'
  | 'mbi-budget'
  | 'mbi-design';

export type DemoRole =
  | 'Dealer'
  | 'Project Manager'
  | 'Expert'
  | 'System'
  | 'End User';

export interface DemoStep {
  id: string;
  groupId: number;
  groupTitle: string;
  title: string;
  description: string;
  app: SimulationApp;
  role: DemoRole;
  highlightId?: string;
}

export interface StepBehavior {
  mode: 'auto' | 'interactive';
  duration?: number;
  aiSummary?: string;
  userAction?: string;
}

export type DemoProfileId = 'mbi';

export interface DemoProfile {
  id: DemoProfileId;
  name: string;
  companyName: string;
  description: string;
  icon: string;
  steps: DemoStep[];
  stepBehavior: Record<string, StepBehavior>;
  stepMessages: Record<string, string[]>;
  selfIndicatedSteps: string[];
}
