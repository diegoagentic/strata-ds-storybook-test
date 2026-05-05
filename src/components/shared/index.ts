// Barrel for shared components.
//
// `StatusBadge` is re-exported from the DS — same API as v1's local one
// (props: `status: string`). This keeps existing v1 imports of
// `from '../shared'` working with zero source change.
//
// `PersonaBadge` lives locally because it's a demo-specific composition
// (avatar + role + tone marker) that the DS doesn't ship as a single
// component yet.

export { StatusBadge } from 'strata-design-system';
export { default as PersonaBadge } from './PersonaBadge';
export type { PersonaMarker } from './PersonaBadge';
