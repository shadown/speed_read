import { TextPaste } from '@/components/input/TextPaste';
import { FileUpload } from '@/components/input/FileUpload';
import { DiffInput } from '@/components/input/DiffInput';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useState } from 'react';

type InputTab = 'paste' | 'upload' | 'diff';

export function InputPage() {
  const [tab, setTab] = useState<InputTab>('paste');

  return (
    <div className="mx-auto max-w-3xl py-8 px-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome to <span className="text-primary">Read</span>Forge
        </h1>
        <p className="text-muted-foreground">
          Paste content, upload a file, or drop a diff to get started.
          Read complex material 2–4× faster with intelligent visualizations.
        </p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as InputTab)}>
        <TabsList className="w-full">
          <TabsTrigger value="paste" className="flex-1">Paste Text</TabsTrigger>
          <TabsTrigger value="upload" className="flex-1">Upload File</TabsTrigger>
          <TabsTrigger value="diff" className="flex-1">Code Diff</TabsTrigger>
        </TabsList>

        <TabsContent value="paste">
          <TextPaste />
        </TabsContent>

        <TabsContent value="upload">
          <FileUpload />
        </TabsContent>

        <TabsContent value="diff">
          <DiffInput />
        </TabsContent>
      </Tabs>

      <div className="text-center text-xs text-muted-foreground space-y-1 pt-4 border-t">
        <p>⏎ <kbd className="px-1 rounded bg-muted">⌘Enter</kbd> to load · <kbd className="px-1 rounded bg-muted">1-4</kbd> switch modes</p>
        <p>Configure a DeepSeek API key in Settings to enable AI features (Skim mode, heatmaps, concept maps)</p>
      </div>
    </div>
  );
}
