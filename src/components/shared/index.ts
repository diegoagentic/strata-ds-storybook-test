// Barrel for shared components.
//
// StatusBadge here is a v1-API-compatible badge (label/tone/icon/size) that
// uses DS status tokens (bg-status-* etc.) internally. It coexists with the
// DS-shipped StatusBadge (status: string) — that one is available via
// `import { StatusBadge as DSStatusBadge } from 'strata-design-system'` if
// the predefined-status API is preferred.

export { default as StatusBadge } from './StatusBadge';
export type { StatusTone } from './StatusBadge';

export { default as PersonaBadge } from './PersonaBadge';
export type { PersonaMarker } from './PersonaBadge';

export { default as ReasonDialog } from './ReasonDialog';
export type { ReasonTone, ReasonPayload } from './ReasonDialog';
