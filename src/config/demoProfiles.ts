// Profile registry — MVP only registers MBI.
// Future tenants (Acme, Dupler, WRG, etc.) will be added here as their
// profile configs are ported from `demo-2026-strata/src/config/profiles/`.

import type { DemoProfile } from '@/types/demo';
import {
  MBI_STEPS,
  MBI_STEP_BEHAVIOR,
  MBI_STEP_MESSAGES,
  MBI_SELF_INDICATED,
} from './profiles/mbi';

const MBI: DemoProfile = {
  id: 'mbi',
  name: 'Modern Business Interiors',
  companyName: 'MBI',
  description:
    'Furniture dealer that runs Accounting AI, Collections AI, and Quotes AI on the Strata stack.',
  icon: '📐',
  steps: MBI_STEPS,
  stepBehavior: MBI_STEP_BEHAVIOR,
  stepMessages: MBI_STEP_MESSAGES,
  selfIndicatedSteps: MBI_SELF_INDICATED,
};

export const DEMO_PROFILES: DemoProfile[] = [MBI];

export const DEFAULT_PROFILE_ID = MBI.id;
