# ReadForge — Tech Stack & Folder Structure

## Exact Tech Stack

| Layer | Choice | Version | Rationale |
|---|---|---|---|
| Build tool | Vite | 6.x | Fastest DX, native ESM, HMR |
| UI framework | React | 19.x | Latest stable, concurrent features |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 4.x (beta) or 3.4 | Utility-first, dark mode, small bundle |
| UI primitives | shadcn/ui | latest | Copy-paste components, no dependency, tree-shakable |
| State management | Zustand | 5.x | Minimal boilerplate, slices pattern, persist middleware |
| Visualization | React Flow | 12.x | Production-grade node graph |
| Diff parser | diff (npm) | 7.x | Unified diff parsing |
| PDF parser | pdfjs-dist | latest | Mozilla's PDF.js for client-side extraction |
| Icons | lucide-react | latest | Tree-shakable, consistent icons |
| AI API | DeepSeek | REST | OpenAI-compatible, streaming, affordable |

### Why Not...
- **Next.js** — Overkill for a single-page local-first app. No SSR needed.
- **Redux** — Zustand is simpler and faster for this scope.
- **D3** — React Flow handles graph visualization; raw D3 only if custom viz needed later.
- **React Router** — Mode-based rendering (no URL routing needed).
- **Electron** — Would add complexity; `npm run dev` is the intended UX.
- **tRPC** — No backend.

## Folder Structure

```
readforge/
├── README.md
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── components.json              # shadcn/ui config
├── index.html
├── .gitignore
│
├── docs/                        # Documentation
│   ├── PRD.md
│   ├── UserJourneys.md
│   ├── Architecture.md
│   ├── DataFlow.md
│   ├── ComponentBreakdown.md
│   ├── NonFunctional.md
│   ├── TechStack.md
│   └── Roadmap.md
│
├── samples/                     # Sample input files
│   ├── sample-article.md
│   ├── sample-diff.diff
│   └── sample-paper.md
│
└── src/
    ├── main.tsx                  # Entry point
    ├── App.tsx                   # Root component
    ├── index.css                 # Tailwind base + global styles
    ├── vite-env.d.ts
    │
    ├── components/
    │   ├── ui/                   # shadcn/ui generated components
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── dialog.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── slider.tsx
    │   │   ├── select.tsx
    │   │   ├── switch.tsx
    │   │   ├── tabs.tsx
    │   │   ├── toast.tsx
    │   │   ├── toaster.tsx
    │   │   └── tooltip.tsx
    │   │
    │   ├── layout/
    │   │   ├── AppShell.tsx
    │   │   ├── Header.tsx
    │   │   ├── Sidebar.tsx
    │   │   └── ModeSwitcher.tsx
    │   │
    │   ├── reader/
    │   │   ├── modes/
    │   │   │   ├── InputPage.tsx
    │   │   │   ├── SkimPage.tsx
    │   │   │   ├── GuidedScanPage.tsx
    │   │   │   └── DeepReviewPage.tsx
    │   │   ├── SummaryPanel.tsx
    │   │   ├── RSVPDisplay.tsx
    │   │   ├── SpeedControl.tsx
    │   │   ├── ComprehensionCheck.tsx
    │   │   └── ClusterNav.tsx
    │   │
    │   ├── visualizations/
    │   │   ├── ConceptMap.tsx
    │   │   ├── Heatmap.tsx
    │   │   ├── ProgressBar.tsx
    │   │   └── DiffView.tsx
    │   │
    │   ├── input/
    │   │   ├── TextPaste.tsx
    │   │   ├── FileUpload.tsx
    │   │   └── DiffInput.tsx
    │   │
    │   ├── Settings.tsx
    │   └── PrivacyIndicator.tsx
    │
    ├── hooks/
    │   ├── useKeyboardShortcuts.ts
    │   ├── useReadForgeAI.ts
    │   ├── useTheme.ts
    │   └── useProgress.ts
    │
    ├── lib/
    │   └── utils.ts               # cn() helper for shadcn
    │
    ├── services/
    │   ├── DeepSeekService.ts
    │   ├── ChunkingService.ts
    │   ├── TextParser.ts
    │   └── DiffParser.ts
    │
    ├── prompts/
    │   ├── summarize.ts
    │   ├── cluster.ts
    │   ├── heatmap.ts
    │   └── diff.ts
    │
    ├── store/
    │   ├── documentStore.ts
    │   ├── readerStore.ts
    │   ├── settingsStore.ts
    │   └── aiStore.ts
    │
    ├── types/
    │   └── index.ts
    │
    └── utils/
        └── index.ts
```

## Dependencies (package.json)

### Production
```
react, react-dom               — Core UI
zustand                        — State management
@xyflow/react                  — React Flow (concept map)
lucide-react                   — Icons
pdfjs-dist                     — PDF text extraction
diff                           — Unified diff parsing
clsx, tailwind-merge           — cn() utility
```

### Development
```
typescript, @types/react, @types/react-dom
vite, @vitejs/plugin-react
tailwindcss, postcss, autoprefixer
@tailwindcss/typography        — Prose styling for article text
```
