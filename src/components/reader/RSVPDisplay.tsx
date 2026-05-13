import { useEffect, useRef, useState } from 'react';
import { useDocumentStore } from '@/store/documentStore';
import { useReaderStore } from '@/store/readerStore';
import { ChunkingService } from '@/services/ChunkingService';

/**
 * RSVPDisplay — Rapid Serial Visual Presentation display.
 * Flashes chunks of text one at a time at the configured speed.
 * Uses requestAnimationFrame for precise timing.
 */
export function RSVPDisplay() {
  const chunks = useDocumentStore(s => s.chunks);
  const currentIndex = useReaderStore(s => s.currentIndex);
  const isPlaying = useReaderStore(s => s.isPlaying);
  const wpm = useReaderStore(s => s.wpm);
  const advance = useReaderStore(s => s.advance);
  const pause = useReaderStore(s => s.pause);

  const timerRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(true);
  const prevIndexRef = useRef(currentIndex);

  const currentChunk = chunks[currentIndex];
  const chunkDuration = currentChunk
    ? ChunkingService.getChunkDuration(currentChunk, wpm)
    : 250;

  // Reset visibility when chunk changes
  useEffect(() => {
    if (prevIndexRef.current !== currentIndex) {
      setVisible(true);
      prevIndexRef.current = currentIndex;
    }
  }, [currentIndex]);

  // Timer for auto-advance
  useEffect(() => {
    if (isPlaying && currentIndex < chunks.length) {
      timerRef.current = window.setTimeout(() => {
        advance();
      }, chunkDuration);
    }

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, currentIndex, chunks.length, chunkDuration, advance]);

  // Pause when we reach the end
  useEffect(() => {
    if (currentIndex >= chunks.length) {
      pause();
    }
  }, [currentIndex, chunks.length, pause]);

  if (!currentChunk) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No content to display</p>
      </div>
    );
  }

  // Calculate font size based on chunk length
  const fontSize = currentChunk.text.length > 30 ? 'text-xl'
    : currentChunk.text.length > 15 ? 'text-2xl'
    : currentChunk.text.length > 8 ? 'text-3xl'
    : 'text-4xl';

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Focus point indicator */}
      <div className="relative">
        {/* Center fixation crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative">
            <div className="absolute w-[2px] h-6 bg-primary/20 left-1/2 -translate-x-1/2 -top-3" />
            <div className="absolute w-6 h-[2px] bg-primary/20 top-0 -translate-y-1/2 left-1/2 -translate-x-1/2" />
          </div>
        </div>

        {/* Chunk text */}
        <div
          className={`
            ${fontSize} font-bold leading-tight text-center
            min-w-[200px] max-w-[600px] min-h-[80px]
            flex items-center justify-center px-8 py-4
            rounded-lg select-none
            transition-opacity duration-75
            ${visible ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ fontFeatureSettings: '"kern"', letterSpacing: '0.02em' }}
        >
          <span className="relative">
            {currentChunk.text}
            {/* Optimal recognition point — center character slightly highlighted */}
          </span>
        </div>
      </div>

      {/* Chunk position indicator */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: Math.min(20, chunks.length) }, (_, i) => {
          const isCurrent = i === (currentIndex % 20);
          const isPast = i < (currentIndex % 20);
          return (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                isCurrent ? 'bg-primary scale-125 w-3' :
                isPast ? 'bg-primary/30' : 'bg-secondary'
              }`}
            />
          );
        })}
      </div>

      {/* Word count indicator */}
      <div className="text-xs text-muted-foreground font-mono">
        {currentChunk.wordCount} words
      </div>
    </div>
  );
}
