import { useEffect } from 'react';
import { useDocumentStore } from '@/store/documentStore';
import { useAiStore } from '@/store/aiStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useReaderStore } from '@/store/readerStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConceptMap } from '@/components/visualizations/ConceptMap';
import { Heatmap } from '@/components/visualizations/Heatmap';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

export function SkimPage() {
  const rawText = useDocumentStore(s => s.rawText);
  const chunks = useDocumentStore(s => s.chunks);
  const aiSummary = useDocumentStore(s => s.aiSummary);
  const aiHeatmap = useDocumentStore(s => s.aiHeatmap);
  const aiClusters = useDocumentStore(s => s.aiClusters);
  const aiConfidence = useDocumentStore(s => s.aiConfidence);
  const apiKey = useSettingsStore(s => s.apiKey);
  const isProcessing = useAiStore(s => s.isProcessing);
  const error = useAiStore(s => s.error);
  const startSkimAnalysis = useAiStore(s => s.startSkimAnalysis);
  const setMode = useReaderStore(s => s.setMode);

  const hasContent = rawText.length > 0;
  const hasAiContent = aiSummary || aiHeatmap || aiClusters;

  // Auto-start analysis if content is loaded and API key exists
  useEffect(() => {
    if (hasContent && apiKey && !isProcessing && !hasAiContent) {
      startSkimAnalysis(rawText);
    }
  }, [hasContent, apiKey]);

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
        <Sparkles className="h-12 w-12" />
        <p className="text-lg">No content loaded</p>
        <Button variant="outline" onClick={() => setMode('input')}>
          Load Content
        </Button>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
        <AlertCircle className="h-12 w-12" />
        <p className="text-lg">AI features require an API key</p>
        <p className="text-sm">Configure your DeepSeek API key in Settings to enable Skim Mode</p>
        <p className="text-sm">You can still use <Button variant="link" className="p-0 h-auto" onClick={() => setMode('guided')}>Guided Scan</Button> or <Button variant="link" className="p-0 h-auto" onClick={() => setMode('deep')}>Deep Review</Button></p>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Analyzing content...</p>
        <p className="text-xs text-muted-foreground animate-pulse">
          Generating summary, heatmap, and concept map
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-destructive font-medium">Analysis failed</p>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => startSkimAnalysis(rawText)}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl py-6 px-4 space-y-6">
      {/* Summary + Confidence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              {aiSummary || 'Generating summary...'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold" style={{
                color: aiConfidence > 0.7 ? '#22c55e' : aiConfidence > 0.4 ? '#f59e0b' : '#ef4444'
              }}>
                {Math.round(aiConfidence * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">Summary reliability</p>
            </div>
          </CardContent>
          <CardContent className="pt-0">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>{chunks.length} chunks</p>
              <p>{rawText.split(/\s+/).filter(Boolean).length} words</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content area: Heatmap + Concept Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Heatmap</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            <Heatmap />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Concept Map</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ConceptMap />
          </CardContent>
        </Card>
      </div>

      {/* Raw paragraphs — skim view */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Full Text Overview</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[500px] overflow-y-auto space-y-3">
          {useDocumentStore.getState().paragraphs.map((p, i) => (
            <p key={p.id} className="text-sm leading-relaxed text-muted-foreground border-l-2 pl-3"
              style={{
                borderLeftColor: aiHeatmap
                  ? (p.category !== 'other'
                    ? `var(--heatmap-${p.category})`
                    : 'transparent')
                  : 'transparent',
                opacity: aiHeatmap ? 0.6 + (p.aiImpact * 0.4) : 0.7,
              }}
            >
              {p.text.slice(0, 300)}{p.text.length > 300 ? '...' : ''}
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
