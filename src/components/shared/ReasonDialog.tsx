/**
 * ReasonDialog — v3 port using DS Dialog (replaces v1's headlessui-based
 * implementation). Same external API as v1 so MBI callers don't change.
 *
 * v1 had richer styling via headlessui Transition; v3 relies on the DS
 * Dialog's built-in animations. Tone-aware accents come through DS tokens
 * (bg-destructive, bg-status-info, bg-status-warning, bg-primary).
 */

import { useEffect, useState, type ReactNode } from 'react';
import { Brain, Check, AlertTriangle, Pencil, Ban, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
} from 'strata-design-system';

export type ReasonTone = 'danger' | 'info' | 'warning' | 'neutral';

export interface ReasonPayload {
  categoryId: string;
  notes: string;
  notifyAI: boolean;
}

interface ReasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ReasonPayload) => void;
  tone: ReasonTone;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  contextBanner?: {
    icon?: ReactNode;
    title: string;
    body: ReactNode;
    tone?: ReasonTone;
  };
  categories: { id: string; label: string }[];
  defaultCategoryId?: string;
  categoryPrompt?: string;
  notesPlaceholder?: string;
  notesLabel?: string;
  notesRequiredForCategoryId?: string;
  notifyToggle?: {
    defaultOn?: boolean;
    title: string;
    description: string;
  };
  confirmLabel: string;
  confirmLabelWhenNotifying?: string;
  cancelLabel?: string;
}

const TONE_CONFIG: Record<
  ReasonTone,
  {
    headerIconBg: string;
    headerIconColor: string;
    defaultIcon: ReactNode;
    activeBg: string;
    activeBorder: string;
    activeText: string;
    activeDot: string;
    confirmVariant: 'default' | 'destructive';
  }
> = {
  danger: {
    headerIconBg: 'bg-destructive/15',
    headerIconColor: 'text-destructive',
    defaultIcon: <Ban className="size-5" />,
    activeBg: 'bg-destructive/10',
    activeBorder: 'border-destructive/40',
    activeText: 'text-destructive',
    activeDot: 'bg-destructive',
    confirmVariant: 'destructive',
  },
  info: {
    headerIconBg: 'bg-status-info/15',
    headerIconColor: 'text-status-info',
    defaultIcon: <Pencil className="size-5" />,
    activeBg: 'bg-status-info/10',
    activeBorder: 'border-status-info/40',
    activeText: 'text-status-info',
    activeDot: 'bg-status-info',
    confirmVariant: 'default',
  },
  warning: {
    headerIconBg: 'bg-status-warning/15',
    headerIconColor: 'text-status-warning',
    defaultIcon: <AlertTriangle className="size-5" />,
    activeBg: 'bg-status-warning/10',
    activeBorder: 'border-status-warning/40',
    activeText: 'text-status-warning',
    activeDot: 'bg-status-warning',
    confirmVariant: 'default',
  },
  neutral: {
    headerIconBg: 'bg-muted',
    headerIconColor: 'text-muted-foreground',
    defaultIcon: <X className="size-5" />,
    activeBg: 'bg-muted',
    activeBorder: 'border-muted-foreground/40',
    activeText: 'text-foreground',
    activeDot: 'bg-muted-foreground',
    confirmVariant: 'default',
  },
};

export default function ReasonDialog({
  isOpen,
  onClose,
  onSubmit,
  tone,
  title,
  subtitle,
  icon,
  contextBanner,
  categories,
  defaultCategoryId,
  categoryPrompt = 'Reason',
  notesPlaceholder,
  notesLabel = 'Notes',
  notesRequiredForCategoryId,
  notifyToggle,
  confirmLabel,
  confirmLabelWhenNotifying,
  cancelLabel = 'Cancel',
}: ReasonDialogProps) {
  const toneCfg = TONE_CONFIG[tone];
  const initialCategory = defaultCategoryId ?? categories[0]?.id ?? '';

  const [categoryId, setCategoryId] = useState(initialCategory);
  const [notes, setNotes] = useState('');
  const [notifyAI, setNotifyAI] = useState(notifyToggle?.defaultOn ?? true);

  useEffect(() => {
    if (isOpen) {
      setCategoryId(initialCategory);
      setNotes('');
      setNotifyAI(notifyToggle?.defaultOn ?? true);
    }
  }, [isOpen, initialCategory, notifyToggle?.defaultOn]);

  const notesRequired =
    notesRequiredForCategoryId && categoryId === notesRequiredForCategoryId;
  const canSubmit = !notesRequired || notes.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      categoryId,
      notes: notes.trim(),
      notifyAI: notifyToggle ? notifyAI : false,
    });
  };

  const bannerToneCfg = contextBanner?.tone
    ? TONE_CONFIG[contextBanner.tone]
    : toneCfg;
  const bannerBg =
    contextBanner?.tone === 'info'
      ? 'bg-status-info/10 border-status-info/30'
      : contextBanner?.tone === 'warning'
        ? 'bg-status-warning/10 border-status-warning/30'
        : contextBanner?.tone === 'danger'
          ? 'bg-destructive/10 border-destructive/30'
          : 'bg-status-ai/10 border-status-ai/30';

  const resolvedConfirmLabel =
    notifyToggle && notifyAI && confirmLabelWhenNotifying
      ? confirmLabelWhenNotifying
      : confirmLabel;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className={`size-10 rounded-xl ${toneCfg.headerIconBg} ${toneCfg.headerIconColor} flex items-center justify-center shrink-0`}
            >
              {icon ?? toneCfg.defaultIcon}
            </div>
            <div className="flex-1">
              <DialogTitle>{title}</DialogTitle>
              {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {contextBanner && (
            <div
              className={`border rounded-xl p-3 flex items-start gap-2.5 ${bannerBg}`}
            >
              <span
                className={`shrink-0 mt-0.5 ${bannerToneCfg.headerIconColor}`}
              >
                {contextBanner.icon ?? bannerToneCfg.defaultIcon}
              </span>
              <div className="text-xs">
                <div className="font-bold text-foreground">
                  {contextBanner.title}
                </div>
                <div className="text-muted-foreground mt-0.5">
                  {contextBanner.body}
                </div>
              </div>
            </div>
          )}

          {/* Category picker */}
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              {categoryPrompt}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {categories.map((c) => {
                const active = categoryId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategoryId(c.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold text-left transition-colors ${
                      active
                        ? `${toneCfg.activeBg} ${toneCfg.activeBorder} ${toneCfg.activeText}`
                        : 'bg-background border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    <span
                      className={`size-2 rounded-full shrink-0 ${active ? toneCfg.activeDot : 'bg-muted-foreground/30'}`}
                    />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              {notesLabel}
              {notesRequired && (
                <span className={`ml-1 ${toneCfg.activeText}`}>· required</span>
              )}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={notesPlaceholder}
              className="w-full bg-input-background border border-input rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Notify AI toggle */}
          {notifyToggle && (
            <label className="flex items-start gap-3 bg-muted/30 border border-border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <input
                type="checkbox"
                checked={notifyAI}
                onChange={(e) => setNotifyAI(e.target.checked)}
                className="size-4 mt-0.5 accent-primary"
              />
              <div className="flex-1">
                <div className="text-xs font-bold text-foreground">
                  {notifyToggle.title}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {notifyToggle.description}
                </div>
              </div>
            </label>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={toneCfg.confirmVariant}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {notifyToggle && notifyAI ? (
              <Brain className="size-4" />
            ) : (
              <Check className="size-4" />
            )}
            {resolvedConfirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
