import { AlertTriangle, Loader2 } from 'lucide-react';

import { Sheet, SheetContent } from '@/components/ui/sheet.tsx';
import { cn } from '@/lib/utils/utils.ts';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'default';
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'default',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const isDestructive = variant === 'destructive';
  const accent = 'linear-gradient(135deg, #60AFFF, #9b7fe1)';

  return (
    <Sheet
      open={open}
      onOpenChange={(o) => {
        if (!o && !isPending) onCancel();
      }}
    >
      <SheetContent
        side="right"
        overlayClassName="z-[70] bg-black/60 backdrop-blur-sm"
        className="z-[70] !inset-0 !left-1/2 !top-1/2 !right-auto !bottom-auto h-auto w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-grey-150 dark:border-gray-600 bg-white dark:bg-gray-800 p-0 shadow-card-lg data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
      >
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                isDestructive ? 'bg-red/10 text-red' : 'bg-blue/10 text-blue',
              )}
            >
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="font-maxwell text-base font-bold text-grey-800 dark:text-grey-200 tracking-wide">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-grey-500 dark:text-grey-400 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-grey-500 dark:text-grey-400 border border-grey-200 dark:border-gray-600 hover:border-grey-300 dark:hover:border-gray-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isPending}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer',
                isDestructive && 'bg-red',
              )}
              style={isDestructive ? undefined : { background: accent }}
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
