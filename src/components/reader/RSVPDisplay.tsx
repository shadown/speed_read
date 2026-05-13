import { useEffect, useRef, useMemo } from 'react';
import { useDocumentStore } from '@/store/documentStore';
import { useReaderStore } from '@/store/readerStore';
import { ChunkingService } from '@/services/ChunkingService';

/**
 * RSVPDisplay — Rapid Serial Visual Presentation with Optimal Recognition Point.
 *
 * Flashes text chunks one at a time at the configured WPM, with:
 * - A faint ORP (Optimal Recognition Point) crosshair for eye anchoring
 * - Adaptive font sizing based on chunk length
 * - Smooth opacity transitions via CSS animation
 * - Word count indicator
 * - Chunk position dots for spatial awareness
 */
export function RSVPDisplay() {
  const chunks = useDocumentStore((s) => s.chunks);
  const currentIndex = useReaderStore((s) => s.currentIndex);
  const isPlaying = useReaderStore((s) => s.isPlaying);
  const wpm = useReaderStore((s) => s.wpm);
  const advance = useReaderStore((s) => s.advance);
  const pause = useReaderStore((s) => s.pause);

  const animRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const indexRef = useRef(currentIndex);

  // Sync index ref for animation callback
  indexRef.current = currentIndex;

  const chunk = chunks[currentIndex];
  const duration = chunk ? ChunkingService.getChunkDuration(chunk, wpm) : 250;

  // RSVP timing engine — uses requestAnimationFrame for smooth display
  useEffect(() => {
    if (!isPlaying || currentIndex >= chunks.length) return;

    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      if (elapsed >= duration) {
        advance();
        return;
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, currentIndex, chunks.length, duration, advance]);

  // Pause at end
  useEffect(() => {
    if (currentIndex >= chunks.length && chunks.length > 0) {
      pause();
    }
  }, [currentIndex, chunks.length, pause]);

  // Empty state
  if (!chunk) {
    return (
      <div className="flex flex-col items-center gap-3 text-muted-foreground/50">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center text-lg">
          ∅
        </div>
        <p className="text-sm">No content loaded</p>
      </div>
    );
  }

  // Adaptive font size
  const textLen = chunk.text.length;
  const fontSize =
    textLen > 35 ? 'text-xl' : textLen > 20 ? 'text-2xl' : textLen > 10 ? 'text-3xl' : 'text-4xl';
  const lineHeight = textLen > 35 ? 'leading-relaxed' : 'leading-tight';

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Visual container */}
      <div className="relative flex items-center justify-center">
        {/* ORP crosshair — the key to speed reading eye anchoring */}
        <div className="orp-marker" aria-hidden="true" />

        {/* Chunk */}
        <div
          key={currentIndex}
          className={`
            ${fontSize} ${lineHeight} font-semibold tracking-wide text-center
            min-w-[240px] max-w-[650px] min-h-[100px]
            flex items-center justify-center px-10 py-6
            rounded-xl animate-rsvp
          `}
          style={{ '--chunk-duration': `${duration}ms` } as React.CSSProperties}
          aria-live="polite"
          role="status"
        >
          {chunk.text}
        </div>
      </div>

      {/* Position indicator dots */}
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: Math.min(24, chunks.length) }, (_, i) => {
          const rel = i - (currentIndex % 24);
          const dist = Math.abs(rel);
          const isCurrent = rel === 0;
          return (
            <div
              key={i}
              className="rounded-full transition-all duration-150"
              style={{
                width: isCurrent ? 10 : Math.max(3, 8 - dist * 0.5),
                height: isCurrent ? 10 : Math.max(3, 8 - dist * 0.5),
                backgroundColor: isCurrent
                  ? 'hsl(var(--primary))'
                  : rel < 0
                    ? 'hsl(var(--muted-foreground) / 0.2)'
                    : 'hsl(var(--muted-foreground) / 0.08)',
                transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
              }}
            />
          );
        })}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground/60 font-mono tabular-nums">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          {chunk.wordCount}w
        </span>
        <span className="opacity-40">·</span>
        <span>{Math.round(duration)}ms</span>
        <span className="opacity-40">·</span>
        <span>
          {Math.round(wpm * (chunk.wordCount / 3))} eff. WPM
        </span>
      </div>
    </div>
  );
}
