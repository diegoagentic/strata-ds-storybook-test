/**
 * StatusBadge — v3 port with DS tokens.
 *
 * Same API as the v1 demo-2026-strata local StatusBadge:
 *   <StatusBadge label="Critical" tone="danger" icon={<AlertCircle />} />
 *   <StatusBadge label="Phase 1 Pilot" tone="ai" size="xs" />
 *   <StatusBadge label="HealthTrust" tone="warning" />
 *
 * Note: this is INTENTIONALLY different from the DS-shipped StatusBadge
 * (which takes a `status: string` prop and maps to predefined visual states).
 * MBI components compose richer chips with explicit tone+icon+label, so we
 * keep the v1 API but route all tones through `bg-status-*` semantic tokens.
 *
 * Tones map to DS status tokens:
 *   success → bg-status-success
 *   warning → bg-status-warning
 *   danger  → bg-destructive (not status-error — destructive is the surface
 *             token; status-error is the indicator. For badges we use
 *             destructive's foreground pair which is already AA-contrast.)
 *   info    → bg-status-info
 *   ai      → bg-status-ai
 *   neutral → bg-muted
 *   primary → bg-primary (Volt Lime)
 */

import type { ReactNode } from 'react';

export type StatusTone =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'ai'
  | 'neutral'
  | 'primary';

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
  icon?: ReactNode;
  size?: 'xs' | 'sm' | 'md';
  uppercase?: boolean;
  className?: string;
}

const TONE_MAP: Record<StatusTone, string> = {
  success: 'bg-status-success/15 text-status-success',
  warning: 'bg-status-warning/15 text-status-warning',
  danger: 'bg-destructive/15 text-destructive',
  info: 'bg-status-info/15 text-status-info',
  ai: 'bg-status-ai/15 text-status-ai',
  neutral: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/15 text-foreground dark:text-primary',
};

const SIZE_MAP = {
  xs: { text: 'text-[9px]', pad: 'px-1.5 py-0.5' },
  sm: { text: 'text-[10px]', pad: 'px-1.5 py-0.5' },
  md: { text: 'text-[11px]', pad: 'px-2 py-0.5' },
};

export default function StatusBadge({
  label,
  tone = 'neutral',
  icon,
  size = 'sm',
  uppercase = true,
  className = '',
}: StatusBadgeProps) {
  const sizeCfg = SIZE_MAP[size];
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-md shrink-0 ${sizeCfg.text} ${sizeCfg.pad} ${TONE_MAP[tone]} ${uppercase ? 'uppercase tracking-wider' : ''} ${className}`}
    >
      {icon && (
        <span className="inline-flex items-center shrink-0">{icon}</span>
      )}
      {label}
    </span>
  );
}
