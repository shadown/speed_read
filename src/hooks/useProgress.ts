import { useEffect, useState } from 'react';
import { useReaderStore } from '@/store/readerStore';
import { useDocumentStore } from '@/store/documentStore';
import type { ReadingProgress } from '@/types';

/**
 * useProgress — Computes reading progress for Guided Scan Mode.
 * Updates whenever currentIndex or chunk count changes.
 */
export function useProgress(): ReadingProgress {
  const currentIndex = useReaderStore(s => s.currentIndex);
  const wpm = useReaderStore(s => s.wpm);
  const chunks = useDocumentStore(s => s.chunks);

  const [progress, setProgress] = useState<ReadingProgress>({
    chunksTotal: 0,
    chunksRead: 0,
    percentComplete: 0,
    estimatedSecondsRemaining: 0,
    effectiveWpm: wpm,
  });

  useEffect(() => {
    const total = chunks.length;
    const read = Math.min(currentIndex, total);
    const pct = total > 0 ? Math.round((read / total) * 100) : 0;

    // Estimate remaining time
    // Average word count per chunk * (remaining chunks / (WPM / 60))
    const avgWordsPerChunk = total > 0
      ? chunks.reduce((sum, c) => sum + c.wordCount, 0) / total
      : 3;
    const remainingChunks = total - read;
    const wordsPerSecond = wpm / 60;
    const estimatedSec = Math.round((remainingChunks * avgWordsPerChunk) / wordsPerSecond);

    setProgress({
      chunksTotal: total,
      chunksRead: read,
      percentComplete: pct,
      estimatedSecondsRemaining: estimatedSec,
      effectiveWpm: wpm,
    });
  }, [currentIndex, chunks, wpm]);

  return progress;
}
