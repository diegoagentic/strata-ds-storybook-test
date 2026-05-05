/**
 * COMPONENT: PersonaBadge
 * PURPOSE: Shared identity chip for the protagonist of a flow/step. Circular
 *          initials avatar + name + role, with an optional pilot/marker
 *          badge for surfacing sequenced rollout personas (e.g. MBI's
 *          'Phase 1 Pilot' champions).
 *
 *          Extracted from MBIPersonaBadge so it can be reused across all
 *          demos + the main app (previously MBI-only).
 *
 * PROPS:
 *   - name: string                — 'Kathy Belleville'
 *   - role: string                — 'Controller · Accounting'
 *   - marker?: { label, icon? }   — optional chip (e.g. 'Phase 1 Pilot')
 *   - size?: 'sm' | 'md'
 *   - tone?: 'neutral' | 'success' | 'ai' | 'info' | 'warning'
 *
 * DS TOKENS: primary · success · ai · info · warning (all semantic)
 */

import { Award, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export interface PersonaMarker {
    label: string
    icon?: ReactNode | LucideIcon
}

interface PersonaBadgeProps {
    name: string
    role: string
    marker?: PersonaMarker
    size?: 'sm' | 'md'
    tone?: 'neutral' | 'success' | 'ai' | 'info' | 'warning'
}

const TONE_MAP = {
    neutral: 'bg-primary/10 text-zinc-900 dark:text-primary ring-primary/20',
    success: 'bg-status-success/15 text-status-success ring-status-success/30',
    ai: 'bg-status-ai/15 text-status-ai ring-status-ai/30',
    info: 'bg-status-info/15 text-status-info ring-status-info/30',
    warning: 'bg-status-warning/15 text-status-warning ring-status-warning/30',
} as const

export default function PersonaBadge({
    name,
    role,
    marker,
    size = 'sm',
    tone = 'neutral',
}: PersonaBadgeProps) {
    const initials = name
        .split(' ')
        .map(n => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()

    const avatarSize = size === 'md' ? 'h-10 w-10 text-sm' : 'h-8 w-8 text-[11px]'
    const nameSize = size === 'md' ? 'text-sm' : 'text-xs'

    return (
        <div className="flex items-center gap-2 min-w-0">
            <div
                className={`
                    ${avatarSize} ${TONE_MAP[tone]} rounded-full ring-2 flex items-center justify-center font-bold shrink-0
                `}
            >
                {initials}
            </div>
            <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`${nameSize} font-bold text-foreground truncate`}>{name}</span>
                    {marker && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-status-ai/15 text-status-ai">
                            {marker.icon ?? <Award className="h-2.5 w-2.5" />}
                            {marker.label}
                        </span>
                    )}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">{role}</div>
            </div>
        </div>
    )
}
