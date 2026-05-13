import { useState } from 'react';
import {
  Dialog, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectItem } from '@/components/ui/select';
import { useSettingsStore } from '@/store/settingsStore';
import { useAiStore } from '@/store/aiStore';
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

  const testApiKey = useAiStore(s => s.testApiKey);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [showKey, setShowKey] = useState(false);

  const handleTestConnection = async () => {
    if (!apiKey) return;
    setTestStatus('testing');
    const ok = await testApiKey(apiKey);
    setTestStatus(ok ? 'success' : 'error');
    setTimeout(() => {
      if (testStatus !== 'testing') setTestStatus('idle');
    }, 3000);
  };

  const handleReset = () => {
    resetToDefaults();
    setTestStatus('idle');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>
          Configure your AI provider, reading preferences, and appearance.
        </DialogDescription>
      </DialogHeader>
      <DialogClose onClick={() => onOpenChange(false)} />

      <div className="space-y-6">
        {/* API Key Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">AI Provider — DeepSeek API</Label>
          <p className="text-xs text-muted-foreground">
            Your API key is stored locally in your browser and never sent anywhere except to api.deepseek.com.
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
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={!apiKey || testStatus === 'testing'}
              className="gap-1.5"
            >
              {testStatus === 'testing' && <Loader2 className="h-3 w-3 animate-spin" />}
              {testStatus === 'success' && <CheckCircle2 className="h-3 w-3 text-green-500" />}
              {testStatus === 'error' && <AlertCircle className="h-3 w-3 text-red-500" />}
              {testStatus === 'idle' && 'Test'}
              {testStatus === 'testing' ? 'Testing...' :
               testStatus === 'success' ? 'Connected' :
               testStatus === 'error' ? 'Failed' : 'Connection'}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-xs">Model</Label>
            <Select
              value={model}
              onValueChange={(v) => setModel(v as DeepSeekModel)}
              className="flex-1"
            >
              <SelectItem value="deepseek-chat">DeepSeek-V3 (Chat, fast)</SelectItem>
              <SelectItem value="deepseek-reasoner">DeepSeek-R1 (Reasoner, deep)</SelectItem>
            </Select>
          </div>
        </div>

        <hr className="border-border" />

        {/* Reading Preferences */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Reading Preferences</Label>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-xs">Comprehension Checks</Label>
              <p className="text-[10px] text-muted-foreground">
                Pause periodically to confirm understanding
              </p>
            </div>
            <Switch
              checked={showComprehensionChecks}
              onCheckedChange={setShowComprehensionChecks}
            />
          </div>
        </div>

        <hr className="border-border" />

        {/* Appearance */}
        <div className="space-y-3">
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
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset to Defaults
        </Button>
        <Button size="sm" onClick={() => onOpenChange(false)}>
          Save & Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
