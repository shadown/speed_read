# ReadForge — Component Breakdown

## Component Tree

```
<App>
  <ThemeProvider>
    <AppShell>
      ├── <Header>
      │   ├── <Logo />
      │   ├── <ModeSwitcher />
      │   ├── <PrivacyIndicator />
      │   ├── <ThemeToggle />
      │   └── <SettingsButton /> → opens <SettingsDialog>
      │
      ├── <Sidebar>
      │   ├── <DocumentSummary />  (filename, word count, chunks)
      │   ├── <ProgressPanel />    (when reading)
      │   └── <KeyboardShortcutHelp /> (collapsible)
      │
      └── <MainContent>
          ├── [mode === 'input'] → <InputPage>
          │   ├── <TextPaste />
          │   ├── <FileUpload />  (drag & drop zone)
          │   └── <DiffInput />
          │
          ├── [mode === 'skim'] → <SkimPage>
          │   ├── <SummaryPanel />           (AI summary, streaming)
          │   ├── <Heatmap />                (paragraph-colored overview)
          │   ├── <ConceptMap />             (React Flow)
          │   └── <ConfidenceMeter />
          │
          ├── [mode === 'guided'] → <GuidedScanPage>
          │   ├── <RSVPDisplay />            (center-fixed flash area)
          │   ├── <SpeedControl />           (slider + preset buttons)
          │   ├── <ProgressBar />            (chunks / time remaining)
          │   └── <ComprehensionCheck />     (optional toggle)
          │
          └── [mode === 'deep'] → <DeepReviewPage>
              ├── <ClusterNav />             (semantic cluster tabs)
              ├── <DiffView />               (side-by-side diff)
              │   ├── <DiffFileHeader />
              │   └── <DiffHunk />           (collapsible hunks)
              ├── <Heatmap />                (diff line heatmap)
              └── <CollapsibleSections />
    </AppShell>
  </ThemeProvider>

  <KeyboardShortcuts />  (global hook, no DOM)
  <SettingsDialog />     (modal overlay)
  <Toaster />            (shadcn/ui toast notifications)
```

## State Management Detail

### documentStore (Zustand)

```typescript
interface DocumentStore {
  // Raw data
  rawText: string;
  fileName: string | null;
  fileType: 'text' | 'markdown' | 'diff' | 'pdf' | null;

  // Processed data
  paragraphs: Paragraph[];
  chunks: TextChunk[];
  diffData: DiffData | null;

  // AI results
  aiSummary: string | null;
  aiHeatmap: HeatmapItem[] | null;
  aiClusters: Cluster[] | null;

  // Actions
  setRawText: (text: string) => void;
  setFile: (file: File) => Promise<void>;
  processText: () => void;
  setAiSummary: (summary: string) => void;
  setAiHeatmap: (heatmap: HeatmapItem[]) => void;
  setAiClusters: (clusters: Cluster[]) => void;
  reset: () => void;
}
```

### readerStore (Zustand)

```typescript
interface ReaderStore {
  // Mode
  mode: 'input' | 'skim' | 'guided' | 'deep';

  // RSVP state
  wpm: number;
  chunkSize: 'word' | '3word' | 'phrase' | 'sentence';
  currentIndex: number;
  isPlaying: boolean;
  showComprehensionChecks: boolean;

  // Computed
  progress: number; // 0–100
  estimatedTimeRemaining: number; // seconds
  currentChunk: TextChunk | null;

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
}
```

### settingsStore (Zustand)

```typescript
interface SettingsStore {
  apiKey: string;
  model: 'deepseek-chat' | 'deepseek-reasoner';
  theme: 'dark' | 'light';
  showComprehensionChecks: boolean;

  // Actions
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setShowComprehensionChecks: (show: boolean) => void;
  resetToDefaults: () => void;
  loadFromStorage: () => void;
  persistToStorage: () => void;
}
```

### aiStore (Zustand)

```typescript
interface AiStore {
  isProcessing: boolean;
  streamingText: string;
  error: string | null;

  // Actions
  startAnalysis: (text: string, mode: 'skim' | 'deep') => Promise<void>;
  cancelAnalysis: () => void;
  testApiKey: (key: string) => Promise<boolean>;
  reset: () => void;
}
```

## Key Component Specifications

### RSVPDisplay
- Purpose: Flash chunks one at a time in the center of the screen
- Position: Fixed center, 40% viewport width max, 200px height
- Typography: 2rem–4rem font size (adjusts by chunk length)
- Animation: CSS opacity transition (150ms fade-out, 50ms gap)
- Focus point: Small crosshair or dot at optimal fixation point
- Keyboard: Space = pause, ← = back, → = forward, +/- = speed

### ConceptMap (React Flow)
- Purpose: Show semantic relationships between topics
- Nodes: Topic clusters from AI (rounded rects, color-coded)
- Edges: "is-a", "leads-to", "contradicts", "supports" relationships
- Layout: Dagre tree layout (auto)
- Interaction: Pan, zoom, click node → jump to section

### Heatmap
- Purpose: Color overlay on text showing category distribution
- Implementation: Absolute-positioned colored bars in left gutter
- Legend: Category → color mapping (filterable by click)
- Interaction: Click paragraph → scroll to it in the text

### DiffView
- Purpose: Side-by-side unified diff with color coding
- Lines: Green = additions, Red = deletions, Gray = context
- Hunks: Collapsible by file or semantic cluster
- Gutter: Line numbers + change indicators (+/-)
- Interaction: Click line → show full context

## Custom Hooks

| Hook | Purpose |
|---|---|
| `useKeyboardShortcuts` | Global keyboard shortcut listener |
| `useReadForgeAI` | AI analysis with streaming + cancellation |
| `useChunking` | Text → chunk conversion logic |
| `useTheme` | Dark/light mode toggle + persistence |
| `useProgress` | Computed reading progress + estimated time |
| `useDiffParser` | Unified diff → structured data |
