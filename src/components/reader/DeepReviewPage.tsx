import { useDocumentStore } from '@/store/documentStore';
import { useReaderStore } from '@/store/readerStore';
import { useAiStore } from '@/store/aiStore';
import { useSettingsStore } from '@/store/settingsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DiffView } from '@/components/visualizations/DiffView';
import { Heatmap } from '@/components/visualizations/Heatmap';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, Sparkles, Loader2, GitCompare, FileCode } from 'lucide-react';
import { useState } from 'react';

export function DeepReviewPage() {
  const rawText = useDocumentStore(s => s.rawText);
  const diffData = useDocumentStore(s => s.diffData);
  const paragraphs = useDocumentStore(s => s.paragraphs);
  const aiSummary = useDocumentStore(s => s.aiSummary);
  const apiKey = useSettingsStore(s => s.apiKey);
  const isProcessing = useAiStore(s => s.isProcessing);
  const error = useAiStore(s => s.error);
  const startDiffAnalysis = useAiStore(s => s.startDiffAnalysis);
  const setMode = useReaderStore(s => s.setMode);

  const [tab, setTab] = useState<string>('content');
  const isDiff = diffData !== null && diffData.files.length > 0;

  if (!rawText) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
        <FileCode className="h-12 w-12" />
        <p className="text-lg">No content loaded</p>
        <Button variant="outline" onClick={() => setMode('input')}>
          Load Content
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl py-6 px-4 space-y-6">
      {/* Mode indicator */}
      <div className="flex items-center gap-2">
        <GitCompare className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">
          {isDiff ? `Diff Review — ${diffData!.files.length} files changed` : 'Deep Review — Full Text'}
        </span>
        <span className="text-xs text-muted-foreground">
          ({rawText.split(/\s+/).filter(Boolean).length} words, {paragraphs.length} paragraphs)
        </span>
      </div>

      {/* AI Analysis Section (for diffs) */}
      {isDiff && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Diff Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!apiKey ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                Configure an API key in Settings for AI-powered diff analysis
              </div>
            ) : isProcessing ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing diff...
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            ) : aiSummary ? (
              <p className="text-sm leading-relaxed">{aiSummary}</p>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startDiffAnalysis(rawText)}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Analyze with AI
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cluster navigation (for diffs) */}
      {isDiff && diffData!.clusters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {diffData!.clusters.map((cluster) => (
            <div
              key={cluster.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
              style={{
                borderColor: `var(--heatmap-${cluster.category})`,
                color: `var(--heatmap-${cluster.category})`,
              }}
            >
              <span>{cluster.label}</span>
              <span className="text-muted-foreground">
                +{cluster.additions}/-{cluster.deletions}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Content tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="content">
            {isDiff ? 'Diff View' : 'Full Text'}
          </TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          {isDiff ? (
            <DiffView diffData={diffData!} />
          ) : (
            <Card>
              <CardContent className="pt-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-4">
                  {paragraphs.map((p) => (
                    <p key={p.id} className="text-sm leading-relaxed">
                      {p.text}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="heatmap">
          <Card>
            <CardContent className="pt-6 max-h-[600px] overflow-y-auto">
              <Heatmap />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stats */}
      {isDiff && (
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-green-500">+{diffData!.totalAdditions}</div>
            <div className="text-xs text-muted-foreground">Additions</div>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <div className="text-2xl font-bold text-red-500">-{diffData!.totalDeletions}</div>
            <div className="text-xs text-muted-foreground">Deletions</div>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <div className="text-2xl font-bold">{diffData!.files.length}</div>
            <div className="text-xs text-muted-foreground">Files Changed</div>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <div className="text-2xl font-bold">{diffData!.clusters.length}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </div>
        </div>
      )}
    </div>
  );
}
