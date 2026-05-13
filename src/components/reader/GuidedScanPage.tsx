import { useMemo } from 'react';
import { useDocumentStore } from '@/store/documentStore';
import { useReaderStore } from '@/store/readerStore';
import { RSVPDisplay } from './RSVPDisplay';
import { SpeedControl } from './SpeedControl';
import { Button } from '@/components/ui/button';
import {
  Play, Pause,
  SkipBack, SkipForward,
  ChevronLeft, ChevronRight,
  RotateCcw, PartyPopper,
} from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { fmtDuration } from '@/lib/utils';

export function GuidedScanPage() {
  const rawText = useDocumentStore((s) => s.rawText);
  const chunks = useDocumentStore((s) => s.chunks);
  const setMode = useReaderStore((s) => s.setMode);

  const {
    currentIndex, isPlaying, wpm,
    togglePlay, goBack, goForward,
  } = useReaderStore();

  const progress = useProgress();
  const isComplete = currentIndex >= chunks.length && chunks.length > 0;

  // Stats
  const stats = useMemo(() => {
    if (!rawText) return null;
    const words = rawText.trim().split(/\s+/).filter(Boolean).length;
    return { words, chunks: chunks.length };
  }, [rawText, chunks.length]);

  if (!rawText) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center text-2xl">
          📖
        </div>
        <p className="text-sm text-muted-foreground">No content loaded</p>
        <Button variant="outline" size="sm" onClick={() => setMode('input')}>
          Load content
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b text-xs text-muted-foreground/70">
        <div className="flex items-center gap-4">
          {stats && (
              <>
                <span className="tabular-nums">{stats.words} words</span>
                <span className="opacity-40">·</span>
                <span className="tabular-nums">{stats.chunks} chunks</span>
              </>
            )}
        </div>
        <div className="flex items-center gap-3 tabular-nums">
          <span className="text-[11px]">
            <span className="font-medium text-foreground/80">{Math.min(currentIndex + 1, chunks.length)}</span>
            <span className="opacity-40">/{chunks.length}</span>
          </span>
          <span className="opacity-40">·</span>
          <span className="text-primary font-semibold text-sm">{wpm}</span>
          <span className="text-[10px] opacity-60">WPM</span>
        </div>
      </div>

      {/* RSVP area */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        {isComplete ? (
          <CompleteScreen chunks={chunks.length} wpm={wpm} onRestart={() => goBack(chunks.length)} />
        ) : (
          <RSVPDisplay />
        )}
      </div>

      {/* Controls */}
      <div className="border-t px-5 py-3 space-y-3">
        {/* Progress */}
        <div className="relative w-full h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress.percentComplete}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <SpeedControl />

          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" onClick={() => goBack(10)} title="Back 10">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => goBack(1)} title="Back 1">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-10 w-10 rounded-full shadow-md hover:shadow-lg transition-shadow"
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => goForward(1)} title="Forward 1">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => goForward(10)} title="Forward 10">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-xs text-muted-foreground/60 text-right tabular-nums min-w-[80px]">
            <div>{fmtDuration(progress.estimatedSecondsRemaining)}</div>
            <div className="text-[10px] opacity-60">{progress.percentComplete}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Complete Screen ─────────────────────────────────────────────────────── */
function CompleteScreen({
  chunks,
  wpm,
  onRestart,
}: {
  chunks: number;
  wpm: number;
  onRestart: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center animate-slide-up">
      <div className="text-5xl mb-2">🎉</div>
      <h2 className="text-xl font-bold tracking-tight">Reading Complete</h2>
      <p className="text-sm text-muted-foreground max-w-sm">
        You read <span className="font-semibold text-foreground">{chunks} chunks</span> at{' '}
        <span className="font-semibold text-foreground">{wpm} WPM</span>.
        Effective speed: <span className="font-semibold text-primary">{Math.round(wpm * 0.85)} WPM</span>
      </p>
      <div className="flex gap-2 mt-2">
        <Button variant="outline" size="sm" onClick={onRestart}>
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Start over
        </Button>
        <Button variant="outline" size="sm" onClick={() => useReaderStore.getState().setMode('input')}>
          New document
        </Button>
      </div>
    </div>
  );
}
