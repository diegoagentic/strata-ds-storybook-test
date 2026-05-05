/**
 * MBIDetailSheet — generic right-side detail panel using the DS Sheet.
 * Used by InvoiceDetailPanel for the m2.1 invoice deep-dive flow.
 */

import { type ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from 'strata-design-system';

interface MBIDetailSheetProps {
  /** v1 API: open state */
  isOpen: boolean;
  /** v1 API: close callback */
  onClose: () => void;
  title: string;
  /** v1 API: shown under the title */
  subtitle?: string;
  /** v1 API: icon shown next to the title (decorative) */
  icon?: ReactNode;
  /** v1 API: 'sm' | 'md' | 'lg' | 'xl' — maps to max-width */
  width?: 'sm' | 'md' | 'lg' | 'xl';
  side?: 'left' | 'right' | 'top' | 'bottom';
  children: ReactNode;
  footer?: ReactNode;
}

const WIDTH_CLASS: Record<NonNullable<MBIDetailSheetProps['width']>, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-xl',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
};

export default function MBIDetailSheet({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  width = 'lg',
  side = 'right',
  children,
  footer,
}: MBIDetailSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side={side}
        className={`w-full ${WIDTH_CLASS[width]} flex flex-col p-0`}
      >
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-start gap-2">
            {icon && (
              <span className="size-8 rounded-md bg-muted text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                {icon}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <SheetTitle>{title}</SheetTitle>
              {subtitle && <SheetDescription>{subtitle}</SheetDescription>}
            </div>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer ? (
          <div className="border-t border-border px-6 py-3 bg-muted/30">
            {footer}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
