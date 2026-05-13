import type { TextChunk, ChunkSize } from '@/types';
import { uid } from '@/utils';

/**
 * ChunkingService — Splits raw text into chunks suitable for RSVP display.
 * 
 * Process:
 *   1. Split text into paragraphs (by double newline)
 *   2. Split paragraphs into sentences
 *   3. Group sentences into chunks based on chunkSize
 */
export class ChunkingService {
  /**
   * Main entry: chunk text for RSVP reading
   */
  static chunkText(text: string, chunkSize: ChunkSize = '3word'): TextChunk[] {
    const paragraphs = ChunkingService.splitParagraphs(text);
    const chunks: TextChunk[] = [];
    let globalIndex = 0;
    let charOffset = 0;

    for (let pi = 0; pi < paragraphs.length; pi++) {
      const paraText = paragraphs[pi];
      const paraChunks = ChunkingService.chunkParagraph(paraText, chunkSize, pi, charOffset);

      for (const chunk of paraChunks) {
        chunks.push({
          ...chunk,
          id: uid(),
          index: globalIndex++,
          paragraphIndex: pi,
        });
      }

      charOffset += paraText.length + 1; // +1 for the newline
    }

    return chunks;
  }

  /** Split text into paragraphs */
  static splitParagraphs(text: string): string[] {
    return text
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
  }

  /** Split a single paragraph into chunks */
  private static chunkParagraph(
    text: string,
    chunkSize: ChunkSize,
    paragraphIndex: number,
    charOffset: number,
  ): Omit<TextChunk, 'id' | 'index'>[] {
    const sentences = ChunkingService.splitSentences(text);
    const chunks: Omit<TextChunk, 'id' | 'index'>[] = [];

    for (const sentence of sentences) {
      const sentenceChunks = ChunkingService.chunkBySize(sentence, chunkSize);
      for (const chunkText of sentenceChunks) {
        const words = chunkText.split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) continue;

        const startChar = text.indexOf(chunkText, charOffset);
        const endChar = startChar + chunkText.length;

        chunks.push({
          text: chunkText,
          paragraphIndex,
          wordCount: words.length,
          words,
          startChar: startChar >= 0 ? startChar : charOffset,
          endChar: endChar >= 0 ? endChar : charOffset + chunkText.length,
        });
      }
    }

    return chunks;
  }

  /** Split text into sentences */
  static splitSentences(text: string): string[] {
    // Basic sentence splitting — handles . ! ? followed by space or end
    const raw = text.match(/[^.!?\n]+[.!?]*(\s|$)/g) || [text];
    return raw.map(s => s.trim()).filter(s => s.length > 0);
  }

  /** Group words by chunk size */
  private static chunkBySize(text: string, size: ChunkSize): string[] {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return [];

    switch (size) {
      case 'word':
        return words;
      case '3word': {
        const chunks: string[] = [];
        for (let i = 0; i < words.length; i += 3) {
          chunks.push(words.slice(i, i + 3).join(' '));
        }
        return chunks;
      }
      case 'phrase': {
        const chunks: string[] = [];
        for (let i = 0; i < words.length; i += 6) {
          chunks.push(words.slice(i, i + 6).join(' '));
        }
        return chunks;
      }
      case 'sentence':
        return [text];
      default:
        return words;
    }
  }

  /** Get chunk duration in ms based on WPM */
  static getChunkDuration(chunk: TextChunk, wpm: number): number {
    // Base: (words / WPM) * 60000 ms
    // Add 50ms buffer per chunk for visual processing
    const baseMs = (chunk.wordCount / wpm) * 60000;
    return Math.max(baseMs + 50, 80); // minimum 80ms
  }
}
