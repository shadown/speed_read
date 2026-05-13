import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-scale-in"
        onClick={() => onOpenChange(false)}
      />
      <div
        className="relative z-50 w-full max-w-lg max-h-[85vh] overflow-y-auto glass rounded-xl shadow-2xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-5 space-y-1', className)} {...props} />;
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold leading-tight tracking-tight', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center justify-end gap-2 mt-6 pt-4 border-t', className)} {...props} />;
}

export function DialogCloseButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </button>
  );
}
