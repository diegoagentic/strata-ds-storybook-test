/**
 * GenUIInputBar — bottom-anchored AI prompt bar shown in App mode (no demo).
 *
 * Mirrors the v1 Acme Overview reference: a floating glass pill with a
 * history button, an AI sparkle indicator, a prompt input, and a send
 * action. The actual generation is out of scope for v3 — submitting just
 * surfaces a "preview" panel below acknowledging the prompt.
 *
 * Visibility: hidden when isDemoActive is true (the demo flow drives the
 * page, no need for free-form prompts) and when the FAB demo button would
 * otherwise overlap. Lives on top of all chrome at z-50, but vertically
 * offset above the FAB so they stack rather than collide.
 */

import { useState } from 'react';
import { History, Sparkles, Send, X } from 'lucide-react';
import { useDemo } from '@/context/DemoContext';

export default function GenUIInputBar() {
  const { isDemoActive } = useDemo();
  const [value, setValue] = useState('');
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);

  if (isDemoActive) return null;

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setLastPrompt(trimmed);
    setValue('');
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 pointer-events-none">
      {lastPrompt && (
        <div className="pointer-events-auto mb-2 mx-auto max-w-xl rounded-2xl border border-status-ai/30 bg-status-ai/5 backdrop-blur-md px-4 py-3 shadow-lg">
          <div className="flex items-start gap-2">
            <Sparkles className="size-4 text-status-ai shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-status-ai mb-1">
                Prompt received
              </div>
              <p className="text-sm text-foreground line-clamp-2">{lastPrompt}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Generation is not implemented in the MVP — this surfaces real prompts so demos can show intent.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLastPrompt(null)}
              className="size-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
              aria-label="Dismiss"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="pointer-events-auto flex items-center gap-2 w-full bg-card/85 backdrop-blur-xl border border-border rounded-full pl-3 pr-2 py-1.5 shadow-2xl"
      >
        <button
          type="button"
          className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          aria-label="History"
          title="History"
        >
          <History className="size-4" />
        </button>
        <Sparkles className="size-4 text-status-ai shrink-0" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe what you need..."
          className="flex-1 bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground py-1.5"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="size-9 rounded-full flex items-center justify-center bg-status-ai text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shrink-0"
          aria-label="Send"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
