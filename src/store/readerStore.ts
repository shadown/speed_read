import { create } from 'zustand';
import type { ReaderMode, ChunkSize, TextChunk, ReadingProgress } from '@/types';

interface ReaderStore {
  // Mode
  mode: ReaderMode;

  // RSVP state
  wpm: number;
  chunkSize: ChunkSize;
  currentIndex: number;
  isPlaying: boolean;
  showComprehensionChecks: boolean;

  // Computed
  progress: ReadingProgress;

  // Actions
  setMode: (mode: ReaderMode) => void;
  setWpm: (wpm: number) => void;
  setChunkSize: (size: ChunkSize) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  advance: () => void;
  goBack: (steps?: number) => void;
  goForward: (steps?: number) => void;
  jumpTo: (index: number) => void;
  setShowComprehensionChecks: (show: boolean) => void;
  reset: () => void;
}

const DEFAULT_WPM = 300;

export const useReaderStore = create<ReaderStore>((set, get) => ({
  mode: 'input',
  wpm: DEFAULT_WPM,
  chunkSize: '3word',
  currentIndex: 0,
  isPlaying: false,
  showComprehensionChecks: false,
  progress: {
    chunksTotal: 0,
    chunksRead: 0,
    percentComplete: 0,
    estimatedSecondsRemaining: 0,
    effectiveWpm: DEFAULT_WPM,
  },

  setMode: (mode: ReaderMode) => {
    set({ mode, isPlaying: false, currentIndex: 0 });
  },

  setWpm: (wpm: number) => {
    const clamped = Math.max(50, Math.min(1500, wpm));
    set({ wpm: clamped });
  },

  setChunkSize: (chunkSize: ChunkSize) => {
    set({ chunkSize, currentIndex: 0, isPlaying: false });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set(state => ({ isPlaying: !state.isPlaying })),

  advance: () => {
    const state = get();
    set({ currentIndex: state.currentIndex + 1 });
  },

  goBack: (steps = 1) => {
    set(state => ({ currentIndex: Math.max(0, state.currentIndex - steps) }));
  },

  goForward: (steps = 1) => {
    set(state => ({ currentIndex: state.currentIndex + steps }));
  },

  jumpTo: (index: number) => {
    set({ currentIndex: Math.max(0, index) });
  },

  setShowComprehensionChecks: (show: boolean) => {
    set({ showComprehensionChecks: show });
  },

  reset: () => {
    set({
      mode: 'input',
      wpm: DEFAULT_WPM,
      chunkSize: '3word',
      currentIndex: 0,
      isPlaying: false,
      showComprehensionChecks: false,
    });
  },
}));
