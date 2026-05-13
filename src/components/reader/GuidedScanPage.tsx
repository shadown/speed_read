import { useDocumentStore } from '@/store/documentStore';
import { useReaderStore } from '@/store/readerStore';
import { RSVPDisplay } from '@/components/reader/RSVPDisplay';
import { SpeedControl } from '@/components/reader/SpeedControl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, ArrowLeft, ArrowRight } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { formatTime, estimateReadingTime } from '@/utils';

export function GuidedScanPage() {
  const chunks = useDocumentStore(s => s.chunks);
  const rawText = useDocumentStore(s => s.rawText);
  const setMode = useReaderStore(s => s.setMode);

  const {
    currentIndex, isPlaying, wpm, chunkSize,
    togglePlay, goBack, goForward, setWpm, setChunkSize,
  } = useReaderStore();

  const progress = useProgress();

  if (!rawText) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
        <p className="text-lg">No content loaded</p>
        <Button variant="outline" onClick={() => setMode('input')}>
          Load Content First
        </Button>
      </div>
    );
  }

  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  const isComplete = currentIndex >= chunks.length;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar: Stats */}
      <div className="flex items-center justify-between px-6 py-2 border-b text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>{chunks.length} chunks</span>
          <span>{chunkSize}</span>
          <span>~{formatTime(estimateReadingTime(wordCount, wpm))}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono">{Math.min(currentIndex + 1, chunks.length)}/{chunks.length}</span>
          <span className="text-primary font-medium">{wpm} WPM</span>
        </div>
      </div>

      {/* RSVP Display */}
      <div className="flex-1 flex items-center justify-center px-4">
        {isComplete ? (
          <div className="text-center space-y-4">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-bold">Reading Complete!</h2>
            <p className="text-muted-foreground">
              You read {chunks.length} chunks at ~{wpm} WPM
            </p>
            <p className="text-xs text-muted-foreground">
              Estimated effective reading speed: {Math.round(wpm * 0.85)} WPM (with comprehension)
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <Button variant="outline" size="sm" onClick={() => goBack(chunks.length)}>
                Start Over
              </Button>
              <Button variant="outline" size="sm" onClick={() => setMode('input')}>
                Load New Content
              </Button>
            </div>
          </div>
        ) : (
          <RSVPDisplay />
        )}
      </div>

      {/* Controls */}
      <div className="border-t px-6 py-4 space-y-3">
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progress.percentComplete}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <SpeedControl />

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => goBack(10)}
              title="Back 10 chunks"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => goBack(1)}
              title="Back 1 chunk"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-10 w-10"
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => goForward(1)}
              title="Forward 1 chunk"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => goForward(10)}
              title="Forward 10 chunks"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Time remaining */}
          <div className="text-xs text-muted-foreground text-right">
            <div>{formatTime(progress.estimatedSecondsRemaining)} remaining</div>
            <div className="text-[10px]">{progress.percentComplete}% complete</div>
          </div>
        </div>
      </div>
    </div>
  );
}
