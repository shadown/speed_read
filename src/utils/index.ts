// ─── General Utility Functions ──────────────────────────────────────────────

/** Generate unique ID */
export function uid(): string {
  return Math.random().toString(36).substring(2, 11);
}

/** Clamp number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Estimate reading time in seconds */
export function estimateReadingTime(wordCount: number, wpm: number): number {
  return Math.ceil((wordCount / wpm) * 60);
}

/** Format seconds into display string */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/** Debounce function */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Detect if text contains diff/patch format */
export function isDiffText(text: string): boolean {
  return /^diff --git /m.test(text) || /^--- .+?\n\+\+\+ .+?$/m.test(text);
}

/** Count words in text */
export function countWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/** Count lines in text */
export function countLines(text: string): number {
  return text.split('\n').length;
}

/** Extract filename from path */
export function fileNameFromPath(path: string): string {
  return path.split('/').pop() || path.split('\\').pop() || path;
}
