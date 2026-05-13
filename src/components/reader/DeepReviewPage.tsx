import { useState } from 'react';
import { useDocumentStore } from '@/store/documentStore';
import { useReaderStore } from '@/store/readerStore';
import { useAiStore } from '@/store/aiStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DiffView } from '@/components/visualizations/DiffView';
import { Heatmap } from '@/components/visualizations/Heatmap';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  AlertCircle, Sparkles, Loader2, GitCompare, FileCode,
  Plus, Minus,
} from 'lucide-react';
import { HEATMAP_COLORS, HEATMAP_LABELS } from '@/types';

export function DeepReviewPage() {
  const rawText = useDocumentStore((s) => s.rawText);
  const diffData = useDocumentStore((s) => s.diffData);
  const paragraphs = useDocumentStore((s) => s.paragraphs);
  const aiSummary = useDocumentStore((s) => s.aiSummary);
  const apiKey = useSettingsStore((s) => s.apiKey);
  const isProcessing = useAiStore((s) => s.isProcessing);
  const error = useAiStore((s) => s.error);
  const startDiffAnalysis = useAiStore((s) => s.startDiffAnalysis);
  const setMode = useReaderStore((s) => s.setMode);

  const [tab, setTab] = useState('content');
  const isDiff = !!(diffData && diffData.files.length > 0);

  if (!rawText) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
          <FileCode className="h-7 w-7 text-muted-foreground/40" />
        </div>
        <p className="text-sm text-muted-foreground">No content loaded</p>
        <Button variant="outline" size="sm" onClick={() => setMode('input')}>Load content</Button>
      </div>
    );
  }

  const wordCount = rawText.split(/\s+/).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-6xl py-6 px-4 space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitCompare className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-sm font-semibold">
              {isDiff ? 'Diff Review' : 'Deep Review'}
            </h2>
            <p className="text-xs text-muted-foreground/60">
              {isDiff
                ? `${diffData!.files.length} files · ${diffData!.totalAdditions + diffData!.totalDeletions} changes`
                : `${wordCount} words · ${paragraphs.length} paragraphs`}
            </p>
          </div>
        </div>

        {isDiff && !aiSummary && apiKey && !isProcessing && (
          <Button size="sm" variant="outline" onClick={() => startDiffAnalysis(rawText)}>
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Analyze with AI
          </Button>
        )}
      </div>

      {/* AI analysis banner (for diffs) */}
      {isDiff && (
        <AIBanner
          hasKey={!!apiKey}
          isProcessing={isProcessing}
          error={error}
          summary={aiSummary}
          onAnalyze={() => startDiffAnalysis(rawText)}
        />
      )}

      {/* Cluster pills (for diffs) */}
      {isDiff && diffData!.clusters.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {diffData!.clusters.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{
                backgroundColor: (HEATMAP_COLORS as any)[c.category] + '14',
                color: (HEATMAP_COLORS as any)[c.category],
                border: `1px solid ${(HEATMAP_COLORS as any)[c.category]}30`,
              }}
            >
              <span className="tabular-nums">
                +{c.additions}/-{c.deletions}
              </span>
              <span className="opacity-60">·</span>
              {c.label}
            </span>
          ))}
        </div>
      )}

      {/* Stats bar */}
      {isDiff && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Additions', value: diffData!.totalAdditions, color: 'text-green-500', icon: Plus },
            { label: 'Deletions', value: diffData!.totalDeletions, color: 'text-red-500', icon: Minus },
            { label: 'Files', value: diffData!.files.length, color: 'text-blue-500', icon: FileCode },
            { label: 'Categories', value: diffData!.clusters.length, color: 'text-purple-500', icon: Sparkles },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border bg-card p-3 text-center">
              <s.icon className={cn('h-4 w-4 mx-auto mb-1', s.color)} />
              <div className={cn('text-xl font-bold tabular-nums', s.color)}>{s.value}</div>
              <div className="text-[10px] text-muted-foreground/60">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Content / Heatmap tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="content">{isDiff ? 'Diff View' : 'Full Text'}</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="animate-slide-up">
          {isDiff ? (
            <DiffView diffData={diffData!} />
          ) : (
            <Card>
              <CardContent className="pt-5 max-h-[600px] overflow-y-auto scrollbar-none">
                <div className="space-y-4 text-sm leading-relaxed text-card-foreground/85">
                  {paragraphs.map((p) => (
                    <p key={p.id}>{p.text}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="heatmap" className="animate-slide-up">
          <Card>
            <CardContent className="pt-5 max-h-[600px] overflow-y-auto scrollbar-none">
              <Heatmap />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── AI Banner ───────────────────────────────────────────────────────────── */
function AIBanner({
  hasKey,
  isProcessing,
  error,
  summary,
  onAnalyze,
}: {
  hasKey: boolean;
  isProcessing: boolean;
  error: string | null;
  summary: string | null;
  onAnalyze: () => void;
}) {
  if (!hasKey) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground/60 px-4 py-2 rounded-lg bg-muted/30">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        Add an API key in Settings for AI-powered diff analysis
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground/60 px-4 py-2 rounded-lg bg-muted/30">
        <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
        Analyzing diff...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-xs text-destructive/80 px-4 py-2 rounded-lg bg-destructive/5">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        {error}
      </div>
    );
  }

  if (summary) {
    return (
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed text-card-foreground/80">{summary}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
