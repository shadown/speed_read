import { useEffect, useState } from 'react';
import { useDocumentStore } from '@/store/documentStore';
import { useAiStore } from '@/store/aiStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useReaderStore } from '@/store/readerStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConceptMap } from '@/components/visualizations/ConceptMap';
import { Heatmap } from '@/components/visualizations/Heatmap';
import { cn } from '@/lib/utils';
import {
  Sparkles, Loader2, AlertCircle, FileText, BrainCircuit, Maximize2, Minimize2,
} from 'lucide-react';

export function SkimPage() {
  const rawText = useDocumentStore((s) => s.rawText);
  const chunks = useDocumentStore((s) => s.chunks);
  const paragraphs = useDocumentStore((s) => s.paragraphs);
  const aiSummary = useDocumentStore((s) => s.aiSummary);
  const aiHeatmap = useDocumentStore((s) => s.aiHeatmap);
  const aiClusters = useDocumentStore((s) => s.aiClusters);
  const aiConfidence = useDocumentStore((s) => s.aiConfidence);
  const apiKey = useSettingsStore((s) => s.apiKey);
  const isProcessing = useAiStore((s) => s.isProcessing);
  const error = useAiStore((s) => s.error);
  const startSkimAnalysis = useAiStore((s) => s.startSkimAnalysis);
  const setMode = useReaderStore((s) => s.setMode);
  const [conceptMapFullscreen, setConceptMapFullscreen] = useState(false);

  const hasContent = rawText.length > 0;
  const hasAi = !!(aiSummary || aiHeatmap || aiClusters);

  // Auto-start
  useEffect(() => {
    if (hasContent && apiKey && !isProcessing && !hasAi) {
      startSkimAnalysis(rawText);
    }
  }, [hasContent, apiKey]);

  // Dismiss fullscreen on Escape
  useEffect(() => {
    if (!conceptMapFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setConceptMapFullscreen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [conceptMapFullscreen]);

  // Input/Settings/Error states
  if (!hasContent) return <EmptyState onInput={() => setMode('input')} />;
  if (!apiKey) return <NoKeyState />;
  if (isProcessing) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={() => startSkimAnalysis(rawText)} />;

  return (
    <div className="mx-auto max-w-6xl py-6 px-4 space-y-5 animate-slide-up">
      {/* Summary + Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-card-foreground/90">
              {aiSummary || 'Generating...'}
            </p>
          </CardContent>
        </Card>

        {/* Confidence + Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div
                className="text-3xl font-bold tabular-nums"
                style={{
                  color:
                    aiConfidence > 0.7
                      ? 'hsl(var(--success))'
                      : aiConfidence > 0.4
                        ? 'hsl(var(--warning))'
                        : 'hsl(var(--destructive))',
                }}
              >
                {Math.round(aiConfidence * 100)}%
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Confidence</p>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground/70 border-t pt-3">
              <div className="flex justify-between">
                <span>Words</span>
                <span className="font-mono tabular-nums">{rawText.split(/\s+/).filter(Boolean).length}</span>
              </div>
              <div className="flex justify-between">
                <span>Chunks</span>
                <span className="font-mono tabular-nums">{chunks.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Paragraphs</span>
                <span className="font-mono tabular-nums">{paragraphs.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Heatmap</CardTitle>
            <CardDescription>Categories by paragraph</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[420px] overflow-y-auto scrollbar-none">
            <Heatmap />
          </CardContent>
        </Card>

        <Card className={cn(
          conceptMapFullscreen && 'fixed inset-0 z-50 rounded-none m-0 flex flex-col',
        )}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium">Concept Map</CardTitle>
                <CardDescription>Semantic topic relationships</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setConceptMapFullscreen(v => !v)}
                title={conceptMapFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {conceptMapFullscreen
                  ? <Minimize2 className="h-4 w-4" />
                  : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className={cn(
            conceptMapFullscreen ? 'flex-1 min-h-0' : 'h-[420px]',
          )}>
            <ConceptMap />
          </CardContent>
        </Card>
      </div>

      {/* Full text overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Full Text</CardTitle>
          <CardDescription>Color-coded by category</CardDescription>
        </CardHeader>
        <CardContent className="max-h-[480px] overflow-y-auto scrollbar-none">
          <div className="space-y-2">
            {paragraphs.map((p) => (
              <p
                key={p.id}
                className="text-xs leading-relaxed text-muted-foreground/80 border-l-[3px] pl-3 transition-colors hover:text-foreground/80"
                style={{
                  borderLeftColor: aiHeatmap
                    ? `hsl(var(--heatmap-${p.category}))`
                    : 'transparent',
                  opacity: aiHeatmap ? 0.5 + p.aiImpact * 0.5 : 0.7,
                }}
              >
                {p.text.slice(0, 280)}
                {p.text.length > 280 ? '…' : ''}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────── */

function EmptyState({ onInput }: { onInput: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center text-3xl">
        <FileText className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <p className="text-sm text-muted-foreground">No content loaded</p>
      <Button variant="outline" size="sm" onClick={onInput}>
        Load content
      </Button>
    </div>
  );
}

function NoKeyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 max-w-md mx-auto text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
        <BrainCircuit className="h-8 w-8 text-muted-foreground/40" />
      </div>
      <h2 className="text-base font-semibold">AI Features Disabled</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Skim mode requires an AI provider. Configure your DeepSeek API key in Settings to enable
        summaries, heatmaps, and concept maps.
      </p>
      <p className="text-xs text-muted-foreground/60 mt-1">
        Guided Scan and Deep Review modes work without AI.
      </p>
      <div className="flex gap-2 mt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => useReaderStore.getState().setMode('guided')}
        >
          Try Guided Scan
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => useReaderStore.getState().setMode('deep')}
        >
          Try Deep Review
        </Button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-primary animate-dot-pulse" />
        <div className="w-2 h-2 rounded-full bg-primary animate-dot-pulse" />
        <div className="w-2 h-2 rounded-full bg-primary animate-dot-pulse" />
      </div>
      <p className="text-sm text-muted-foreground animate-pulse-soft">
        Analyzing content with AI...
      </p>
      <div className="grid grid-cols-3 gap-3 w-full max-w-lg mt-4">
        <SkeletonBlock className="h-24 rounded-lg" />
        <SkeletonBlock className="h-24 rounded-lg col-span-2" />
        <SkeletonBlock className="h-48 rounded-lg col-span-2" />
        <SkeletonBlock className="h-48 rounded-lg" />
        <SkeletonBlock className="h-32 rounded-lg col-span-3" />
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 max-w-md mx-auto text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-base font-semibold">Analysis Failed</h2>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button size="sm" onClick={onRetry}>
        Retry Analysis
      </Button>
    </div>
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn('bg-muted animate-skeleton rounded-lg', className)}
      aria-hidden="true"
    />
  );
}
