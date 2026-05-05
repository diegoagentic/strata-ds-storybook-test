import { useEffect, useRef } from 'react';
import { useDemo } from '@/context/DemoContext';

/**
 * Side-effect component that auto-scrolls to the highlighted element
 * on each demo step change and applies a pulsing spotlight glow.
 * Renders nothing — purely drives scroll + CSS class toggling.
 *
 * Highlight target is selected via either:
 *   - data-demo-target="<id>"  attribute, or
 *   - id="<id>"                fallback.
 *
 * The CSS classes `.demo-spotlight-active` and `.demo-spotlight-steady`
 * are defined in `src/styles/globals.css`.
 */
export default function DemoSpotlight() {
  const { isDemoActive, currentStep } = useDemo();
  const prevElementRef = useRef<Element | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Clean up any previous spotlight before applying a new one.
    if (prevElementRef.current) {
      prevElementRef.current.classList.remove(
        'demo-spotlight-active',
        'demo-spotlight-steady',
      );
      prevElementRef.current = null;
    }
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!isDemoActive || !currentStep?.highlightId) return;

    // Delay so the page transition / render completes first.
    const findTimer = setTimeout(() => {
      const el =
        document.querySelector(
          `[data-demo-target="${currentStep.highlightId}"]`,
        ) || document.getElementById(currentStep.highlightId!);

      if (!el) return;

      prevElementRef.current = el;

      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('demo-spotlight-active');

      // After 3 pulses (~3s), switch to a steady subtle glow.
      timerRef.current = setTimeout(() => {
        el.classList.remove('demo-spotlight-active');
        el.classList.add('demo-spotlight-steady');
      }, 3000);
    }, 600);

    return () => {
      clearTimeout(findTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (prevElementRef.current) {
        prevElementRef.current.classList.remove(
          'demo-spotlight-active',
          'demo-spotlight-steady',
        );
        prevElementRef.current = null;
      }
    };
  }, [isDemoActive, currentStep?.id, currentStep?.highlightId]);

  return null;
}
