import { useState } from 'react';
import {
  Dialog, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogCloseButton,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectItem } from '@/components/ui/select';
import { useSettingsStore } from '@/store/settingsStore';
import { useAiStore } from '@/store/aiStore';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import type { DeepSeekModel } from '@/types';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const {
    apiKey, setApiKey,
    model, setModel,
    theme, setTheme,
    showComprehensionChecks, setShowComprehensionChecks,
    resetToDefaults,
  } = useSettingsStore();

  const testApiKey = useAiStore((s) => s.testApiKey);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [showKey, setShowKey] = useState(false);

  const handleTest = async () => {
    if (!apiKey) return;
    setTestStatus('testing');
    const ok = await testApiKey(apiKey);
    setTestStatus(ok ? 'success' : 'error');
    setTimeout(() => setTestStatus('idle'), 3000);
  };

  const handleReset = () => {
    resetToDefaults();
    setTestStatus('idle');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogCloseButton onClick={() => onOpenChange(false)} />
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>
          Configure AI provider, reading preferences, and appearance.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        {/* API Key */}
        <section className="space-y-3">
          <Label className="text-sm font-medium">AI Provider — DeepSeek</Label>
          <p className="text-xs text-muted-foreground/70 leading-relaxed">
            Your API key is stored locally in your browser. It is only sent to{' '}
            <code className="text-[10px] font-mono bg-muted px-1 rounded">api.deepseek.com</code>.
          </p>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-8 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTest}
              disabled={!apiKey || testStatus === 'testing'}
              className={cn('gap-1.5 min-w-[90px]', {
                'border-green-500/30 text-green-600 dark:text-green-400': testStatus === 'success',
                'border-red-500/30 text-red-600 dark:text-red-400': testStatus === 'error',
              })}
            >
              {testStatus === 'testing' && <Loader2 className="h-3 w-3 animate-spin" />}
              {testStatus === 'success' && <CheckCircle2 className="h-3 w-3" />}
              {testStatus === 'error' && <AlertCircle className="h-3 w-3" />}
              {testStatus === 'idle' && 'Test'}
              {testStatus === 'testing'
                ? '…'
                : testStatus === 'success'
                  ? 'OK'
                  : testStatus === 'error'
                    ? 'Failed'
                    : 'Connect'}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Label className="text-xs text-muted-foreground shrink-0">Model</Label>
            <Select
              value={model}
              onValueChange={(v) => setModel(v as DeepSeekModel)}
              className="flex-1"
            >
              <SelectItem value="deepseek-chat">DeepSeek-V3 (fast)</SelectItem>
              <SelectItem value="deepseek-reasoner">DeepSeek-R1 (deep analysis)</SelectItem>
            </Select>
          </div>
        </section>

        <hr className="border-border/50" />

        {/* Reading preferences */}
        <section className="space-y-3">
          <Label className="text-sm font-medium">Reading</Label>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs">Comprehension checks</Label>
              <p className="text-[10px] text-muted-foreground/60">
                Pause periodically to confirm understanding
              </p>
            </div>
            <Switch checked={showComprehensionChecks} onCheckedChange={setShowComprehensionChecks} />
          </div>
        </section>

        <hr className="border-border/50" />

        {/* Appearance */}
        <section className="space-y-3">
          <Label className="text-sm font-medium">Appearance</Label>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Theme</Label>
            <div className="flex gap-1">
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                Dark
              </Button>
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                Light
              </Button>
            </div>
          </div>
        </section>
      </div>

      <DialogFooter>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          Reset defaults
        </Button>
        <Button size="sm" onClick={() => onOpenChange(false)}>
          Done
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
