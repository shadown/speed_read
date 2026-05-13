# ReadForge — 3-Week MVP Roadmap

## Week 1: Foundation (Days 1–7)

### Day 1–2: Project Scaffolding
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install and configure Tailwind CSS v4
- [ ] Install shadcn/ui and configure `components.json`
- [ ] Install Zustand, React Flow, lucide-react
- [ ] Set up TypeScript strict mode
- [ ] Create folder structure
- [ ] Create `.gitignore`
- [ ] `npm run dev` works with a blank page

### Day 3–4: Type System + Stores
- [ ] Define all TypeScript types in `src/types/index.ts`
- [ ] Implement `documentStore` (Zustand)
- [ ] Implement `readerStore` (Zustand)
- [ ] Implement `settingsStore` (Zustand with persist middleware)
- [ ] Implement `aiStore` (Zustand)
- [ ] Verify stores work in isolation

### Day 5–7: Services
- [ ] Implement `TextParser` (detect type, extract text)
- [ ] Implement `ChunkingService` (paragraph → sentence → chunk)
- [ ] Implement `DiffParser` (unified diff → structured data)
- [ ] Implement `DeepSeekService` (streaming API calls)
- [ ] Write `summarize.ts` prompt
- [ ] Write `cluster.ts` prompt
- [ ] Write `heatmap.ts` prompt
- [ ] Write `diff.ts` prompt
- [ ] Unit test chunking with sample texts

## Week 2: Core UI (Days 8–14)

### Day 8–9: App Shell + Input
- [ ] `AppShell` layout (header + sidebar + main)
- [ ] `Header` component (logo + mode switcher + settings)
- [ ] `ModeSwitcher` (tab-style mode selection)
- [ ] `ThemeToggle` (dark/light)
- [ ] `PrivacyIndicator` (AI online/offline status)
- [ ] `TextPaste` component
- [ ] `FileUpload` component (with drag & drop)
- [ ] `DiffInput` component

### Day 10–11: Skim Mode
- [ ] `SkimPage` container
- [ ] `SummaryPanel` (streaming AI summary display)
- [ ] `Heatmap` (colored paragraph indicators)
- [ ] `ConceptMap` (React Flow with nodes + edges)
- [ ] Confidence meter display
- [ ] Wire up AI analysis flow

### Day 12–13: Guided Scan Mode
- [ ] `GuidedScanPage` container
- [ ] `RSVPDisplay` (center-fixed chunk flashing)
- [ ] `SpeedControl` (slider + keyboard shortcuts)
- [ ] `ProgressBar` (chunks + estimated time)
- [ ] `ComprehensionCheck` (modal overlay)
- [ ] Play/pause/skip controls
- [ ] Wire up keyboard shortcuts

### Day 14: Deep Review Mode
- [ ] `DeepReviewPage` container
- [ ] `ClusterNav` (semantic tabs)
- [ ] `DiffView` (side-by-side with syntax)
- [ ] Collapsible sections
- [ ] Wire up diff parsing
- [ ] Keyboard navigation (j/k)

## Week 3: Polish & Samples (Days 15–21)

### Day 15–16: Settings + UI Polish
- [ ] `Settings` dialog (API key, model, WPM, theme)
- [ ] API key test button
- [ ] Toast notifications for errors
- [ ] Keyboard shortcut help overlay
- [ ] Responsive layout (mobile-friendly minimum)

### Day 17–18: Sample Files
- [ ] `samples/sample-article.md` — 3K word technical article
- [ ] `samples/sample-diff.diff` — Realistic PR diff (5 files)
- [ ] `samples/sample-paper.md` — Research paper excerpt

### Day 19–20: README + Documentation
- [ ] `README.md` with full install and usage instructions
- [ ] Screenshots of each mode (ASCII or asciicast)
- [ ] Keyboard shortcuts reference table
- [ ] Build verification

### Day 21: Final Testing & Fixes
- [ ] Test all 3 modes with sample files
- [ ] Test dark/light mode
- [ ] Test keyboard shortcuts
- [ ] Test deepseek API integration
- [ ] Test error states (no API key, network failure, large files)
- [ ] Edge case: empty input
- [ ] Edge case: 100K+ word document
- [ ] Edge case: malformed diff

## Build & Run Instructions

```bash
# Clone and run
git clone <repo-url> readforge
cd readforge
npm install
npm run dev

# Build for production
npm run build
npm run preview
```

## Verification Checklist

| Check | Expected |
|---|---|
| `npm install` | No errors, all deps resolved |
| `npm run dev` | Opens on localhost:5173 |
| Paste text | Text appears in input area |
| Upload .md file | Text extracted and shown |
| Upload .diff file | Diff parsed and shown in Deep Review |
| Switch to Skim Mode | "Configure API key" message (no key) |
| Add API key in Settings | "Connected" confirmation |
| Skim Mode with key | Summary, heatmap, concept map appear |
| Guided Scan | Chunks flash, progress bar advances |
| Keyboard shortcuts | All shortcuts work |
| Dark/Light toggle | Theme switches immediately |
| `npm run build` | Production build succeeds |
