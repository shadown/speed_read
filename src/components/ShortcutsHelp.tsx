import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogCloseButton } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ShortcutsHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GROUPS = [
  {
    title: 'Mode Switching',
    shortcuts: [
      { keys: '1', desc: 'Input mode' },
      { keys: '2', desc: 'Skim mode' },
      { keys: '3', desc: 'Guided Scan mode' },
      { keys: '4', desc: 'Deep Review mode' },
    ],
  },
  {
    title: 'Guided Scan',
    shortcuts: [
      { keys: 'Space', desc: 'Play / Pause' },
      { keys: '←', desc: 'Previous chunk' },
      { keys: '→', desc: 'Next chunk' },
      { keys: '[', desc: 'Back 10 chunks' },
      { keys: ']', desc: 'Forward 10 chunks' },
      { keys: '-', desc: 'Decrease speed (−50 WPM)' },
      { keys: '=', desc: 'Increase speed (+50 WPM)' },
    ],
  },
  {
    title: 'Deep Review',
    shortcuts: [
      { keys: 'j', desc: 'Next change' },
      { keys: 'k', desc: 'Previous change' },
      { keys: 'Enter', desc: 'Expand / collapse hunk' },
    ],
  },
  {
    title: 'Global',
    shortcuts: [
      { keys: 't', desc: 'Toggle dark / light theme' },
      { keys: 's', desc: 'Open Settings' },
      { keys: '?', desc: 'Show this help' },
      { keys: 'Esc', desc: 'Close modal' },
    ],
  },
];

export function ShortcutsHelp({ open, onOpenChange }: ShortcutsHelpProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogCloseButton onClick={() => onOpenChange(false)} />
      <DialogHeader>
        <DialogTitle>Keyboard Shortcuts</DialogTitle>
        <DialogDescription>All shortcuts are available globally.</DialogDescription>
      </DialogHeader>

      <div className="space-y-5">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {group.title}
            </h4>
            <div className="space-y-1.5">
              {group.shortcuts.map((s) => (
                <div key={s.keys} className="flex items-center justify-between">
                  <span className="text-sm text-foreground/80">{s.desc}</span>
                  <kbd
                    className={cn(
                      'inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded bg-muted text-xs font-mono tabular-nums border',
                    )}
                  >
                    {s.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Dialog>
  );
}
