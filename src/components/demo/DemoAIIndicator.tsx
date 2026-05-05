import { useEffect, useState, useRef } from 'react';
import {
  Loader2,
  MousePointerClick,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useDemo } from '@/context/DemoContext';
import { useDemoProfile } from '@/context/useDemoProfile';

/**
 * Inline indicator that surfaces the current step's behavior to the user:
 * - For `auto` steps: progress bar + "Strata AI" label + rotating message.
 * - For `interactive` steps: amber "Action Required" hint with a static
 *   message describing what the user should click.
 *
 * Hidden when the active step is in `selfIndicatedSteps` (the page handles
 * its own UI). MBI marks all steps as self-indicated, so this component is
 * effectively dormant for MBI but kept for future tenants.
 */
export default function DemoAIIndicator() {
  const { currentStep, isDemoActive, isPaused } = useDemo();
  const { activeProfile } = useDemoProfile();
  const [elapsed, setElapsed] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const messageIntervalRef = useRef<
    ReturnType<typeof setInterval> | undefined
  >(undefined);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const stepId = currentStep?.id;
  const behavior = stepId ? activeProfile.stepBehavior[stepId] : undefined;
  const messages = stepId ? activeProfile.stepMessages[stepId] || [] : [];

  // Visibility with entrance delay
  useEffect(() => {
    if (!isDemoActive) {
      setVisible(false);
      return;
    }
    setElapsed(0);
    setMessageIndex(0);
    setCompleted(false);
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 500);
    return () => {
      clearTimeout(t);
      setVisible(false);
    };
  }, [isDemoActive, stepId]);

  // Progress timer for auto steps
  useEffect(() => {
    if (!isDemoActive || !behavior || behavior.mode !== 'auto' || !behavior.duration)
      return;
    setElapsed(0);
    setCompleted(false);

    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setElapsed((prev) => {
          const next = Math.min(prev + 0.1, behavior.duration!);
          if (next >= behavior.duration!) setCompleted(true);
          return next;
        });
      }
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isDemoActive, stepId, behavior]);

  // Rotate messages
  useEffect(() => {
    if (!isDemoActive || messages.length <= 1) return;
    setMessageIndex(0);

    const interval = behavior?.duration
      ? Math.max((behavior.duration * 1000) / messages.length, 2500)
      : 4000;

    messageIntervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setMessageIndex((prev) => Math.min(prev + 1, messages.length - 1));
      }
    }, interval);

    return () => {
      if (messageIntervalRef.current) clearInterval(messageIntervalRef.current);
    };
  }, [isDemoActive, stepId, messages.length, behavior]);

  // Don't render when inactive, hidden, or the page handles its own UI.
  if (
    !isDemoActive ||
    !behavior ||
    !visible ||
    !stepId ||
    activeProfile.selfIndicatedSteps.includes(stepId)
  )
    return null;

  const isAuto = behavior.mode === 'auto';
  const progress =
    isAuto && behavior.duration ? (elapsed / behavior.duration) * 100 : 0;
  const currentMessage =
    messages[messageIndex] ||
    (isAuto ? behavior.aiSummary : behavior.userAction) ||
    '';

  return (
    <div className="sticky top-0 z-50 px-4 sm:px-6 pt-2 pb-1">
      <div
        className={[
          'relative overflow-hidden rounded-xl backdrop-blur-sm border transition-all duration-500',
          isAuto
            ? completed
              ? 'bg-success/5 border-success/25'
              : 'bg-ai/5 border-ai/20'
            : 'bg-warning/5 border-warning/20',
        ].join(' ')}
      >
        <div className="flex items-center gap-3 px-4 py-2">
          {/* Icon container */}
          <div className="relative shrink-0">
            <div
              className={[
                'w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-500',
                isAuto
                  ? completed
                    ? 'bg-success/10 text-success'
                    : 'bg-ai/10 text-ai'
                  : 'bg-warning/10 text-warning',
              ].join(' ')}
            >
              {isAuto ? (
                completed ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Sparkles size={16} />
                )
              ) : (
                <MousePointerClick size={16} />
              )}
            </div>
            {isAuto && !completed && (
              <Loader2
                size={10}
                className="absolute -bottom-0.5 -right-0.5 animate-spin text-ai"
              />
            )}
          </div>

          {/* Label + rotating message */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={[
                  'text-[10px] font-bold uppercase tracking-wider transition-colors duration-500',
                  isAuto
                    ? completed
                      ? 'text-success'
                      : 'text-ai'
                    : 'text-warning',
                ].join(' ')}
              >
                {isAuto
                  ? completed
                    ? 'Complete'
                    : 'Strata AI'
                  : 'Action Required'}
              </span>
              {isAuto && behavior.duration && (
                <span className="text-[10px] text-muted-foreground tabular-nums font-medium">
                  {completed ? '100%' : `${Math.round(progress)}%`}
                </span>
              )}
            </div>
            <p
              key={messageIndex}
              className="text-[11px] text-muted-foreground truncate animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              {currentMessage}
            </p>
          </div>

          {/* Mode badge */}
          <div
            className={[
              'shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider',
              isAuto
                ? completed
                  ? 'bg-success/10 text-success'
                  : 'bg-ai/10 text-ai'
                : 'bg-warning/10 text-warning',
            ].join(' ')}
          >
            <div
              className={[
                'w-1.5 h-1.5 rounded-full',
                isAuto
                  ? completed
                    ? 'bg-success'
                    : 'bg-ai animate-pulse'
                  : 'bg-warning',
              ].join(' ')}
            />
            {isAuto ? (completed ? 'DONE' : 'AUTO') : 'CLICK'}
          </div>
        </div>

        {/* Progress bar (auto steps only) */}
        {isAuto && behavior.duration && (
          <div className="h-[2px] w-full bg-ai/10">
            <div
              className={[
                'h-full transition-all ease-linear',
                completed
                  ? 'bg-gradient-to-r from-success/70 to-success/60'
                  : 'bg-gradient-to-r from-ai/60 to-ai/40',
              ].join(' ')}
              style={{
                width: `${Math.min(progress, 100)}%`,
                transitionDuration: completed ? '500ms' : '100ms',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
