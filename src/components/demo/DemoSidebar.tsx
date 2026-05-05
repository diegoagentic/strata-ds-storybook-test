import { Fragment } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Loader2,
} from 'lucide-react';
import { Badge } from 'strata-design-system';
import { useDemo } from '@/context/DemoContext';
import { useDemoProfile } from '@/context/useDemoProfile';
import type { DemoRole } from '@/types/demo';

/**
 * Three-mode demo control. Always mounted so the FAB renders even when
 * the demo isn't active. Lives at the left side of the viewport in z-300.
 *
 *   1. !isDemoActive          → bottom-right FAB "Demo"
 *   2. active + collapsed     → vertical tab on the left edge
 *   3. active + expanded      → full panel (w-80) with step list + controls
 */

const ROLE_BADGE_COLOR: Record<
  DemoRole,
  // Badge color names from strata-design-system
  'blue' | 'purple' | 'indigo' | 'zinc' | 'rose'
> = {
  Dealer: 'blue',
  'Project Manager': 'purple',
  Expert: 'indigo',
  System: 'zinc',
  'End User': 'rose',
};

export default function DemoSidebar() {
  const {
    currentStepIndex,
    steps,
    nextStep,
    prevStep,
    goToStep,
    isDemoActive,
    setIsDemoActive,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isPaused,
    togglePause,
  } = useDemo();
  const { activeProfile } = useDemoProfile();
  const stepBehavior = activeProfile.stepBehavior;

  // ── 1. FAB (demo not started) ───────────────────────────────────────────
  if (!isDemoActive) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsDemoActive(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full shadow-lg border border-border bg-card text-foreground transition-all font-semibold hover:bg-muted"
        >
          <Play size={20} className="fill-current" />
          <span>Demo</span>
        </button>
      </div>
    );
  }

  // ── 2. Collapsed sidebar (active + collapsed) ───────────────────────────
  if (isSidebarCollapsed) {
    return (
      <div className="fixed left-0 top-32 z-[300]">
        <button
          onClick={() => setIsSidebarCollapsed(false)}
          className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-r-xl border border-l-0 border-border bg-card text-muted-foreground shadow-2xl transition-all group w-12 hover:bg-muted"
        >
          <ChevronRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            Demo
          </span>
        </button>
      </div>
    );
  }

  // ── 3. Full panel ───────────────────────────────────────────────────────
  return (
    <aside className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border z-[300] flex flex-col shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-border bg-muted/40">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-foreground">Demo Flow</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              title="Collapse"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setIsDemoActive(false)}
              className="text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider font-semibold ml-1 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Guided Experience Simulation
        </p>
      </div>

      {/* Empty state — until FASE 3 fills steps */}
      {steps.length === 0 && (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No steps configured yet.
            <br />
            <span className="text-xs">FASE 3 will populate the 9 MBI steps.</span>
          </p>
        </div>
      )}

      {/* Steps List */}
      {steps.length > 0 && (
        <div className="flex-1 overflow-y-auto p-3 space-y-1 pt-6">
          {steps.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const showGroupHeader =
              index === 0 || steps[index - 1].groupId !== step.groupId;
            const groupSteps = steps.filter((s) => s.groupId === step.groupId);
            const posInGroup = groupSteps.findIndex((s) => s.id === step.id);
            const displayNumber = `${step.groupId + 1}.${posInGroup + 1}`;
            const isAutoBehavior = stepBehavior[step.id]?.mode === 'auto';

            return (
              <Fragment key={step.id}>
                {showGroupHeader && (
                  <div className="pt-4 pb-2 first:pt-0">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {step.groupTitle}
                    </h3>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => goToStep(index)}
                  className={[
                    'relative w-full text-left flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-all',
                    isActive
                      ? 'bg-muted border-l-2 border-l-foreground'
                      : 'hover:bg-muted/60',
                  ].join(' ')}
                >
                  {/* Connector line */}
                  {index < steps.length - 1 &&
                    steps[index + 1].groupId === step.groupId && (
                      <div
                        className={[
                          'absolute left-[22px] top-11 w-0.5 h-8',
                          isCompleted ? 'bg-success/40' : 'bg-border',
                        ].join(' ')}
                      />
                    )}

                  {/* Status icon */}
                  <div className="z-10 mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2
                        size={20}
                        className="text-success fill-success/10"
                      />
                    ) : isActive ? (
                      <div className="w-5 h-5 rounded-full border-2 border-foreground bg-card flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                      </div>
                    ) : (
                      <Circle size={20} className="text-muted-foreground/50" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground tabular-nums">
                        STEP {displayNumber}
                      </span>
                      <Badge
                        variant="soft"
                        color={ROLE_BADGE_COLOR[step.role] ?? 'zinc'}
                        className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5"
                      >
                        {step.role}
                      </Badge>
                      {isAutoBehavior && (
                        <span className="text-[9px] px-1 py-0.5 rounded flex items-center gap-0.5 bg-ai/10 text-ai">
                          <Loader2
                            size={8}
                            className={isActive ? 'animate-spin' : ''}
                          />
                          AUTO
                        </span>
                      )}
                    </div>
                    <h3
                      className={[
                        'font-semibold text-sm leading-tight',
                        isActive ? 'text-foreground' : 'text-muted-foreground',
                      ].join(' ')}
                    >
                      {step.title}
                    </h3>
                    {isActive && (
                      <p className="text-[11px] text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-1 duration-300">
                        {step.description}
                      </p>
                    )}
                  </div>
                </button>
              </Fragment>
            );
          })}
        </div>
      )}

      {/* Paused indicator */}
      {isPaused && (
        <div className="mx-4 mb-2 flex items-center justify-center gap-2 py-2 rounded-lg border border-warning/30 bg-warning/10 text-warning animate-pulse">
          <Pause size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">
            Paused
          </span>
        </div>
      )}

      {/* Navigation controls */}
      <div className="p-4 border-t border-border bg-muted/40">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStepIndex === 0 || steps.length === 0}
            className="flex-1 flex items-center justify-center gap-1.5 bg-muted text-foreground py-2 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-muted/70 transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <button
            type="button"
            onClick={togglePause}
            disabled={steps.length === 0}
            className={[
              'flex items-center justify-center w-10 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40',
              isPaused
                ? 'bg-warning/15 text-warning hover:bg-warning/25'
                : 'bg-muted text-foreground hover:bg-muted/70',
            ].join(' ')}
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={
              currentStepIndex === steps.length - 1 || steps.length === 0
            }
            className="flex-[1.5] flex items-center justify-center gap-1.5 bg-foreground text-background py-2 rounded-lg text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity shadow-sm"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
