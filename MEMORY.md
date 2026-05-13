# ReadForge — Project Memory

## Task Overview
Build a complete, production-ready, local-first speed-reading platform called **ReadForge**.
- Frontend: Vite + React 19 + TypeScript + Tailwind CSS + shadcn/ui
- State: Zustand
- Viz: React Flow + custom SVG/Canvas
- AI: DeepSeek API (modular prompts, streaming)
- Local-first: `npm run dev`, no backend, no vendor lock-in

## Original Request
Build "ReadForge" — an intelligent, visualization-first speed-reading platform with 3 modes (Skim, Guided Scan, Deep Review), heatmaps, concept maps, diff support. Fully local React app with DeepSeek integration.

## Naming Decision
**ReadForge** — chosen over "SpeedRead", "TextVision", "QuickRead" because:
- "Forge" = crafting/transforming raw text into insight
- Distinctive, memorable, no trademark conflicts
- Domain: readforge.app (if ever needed)

## Architecture Decisions
- Single-page React app, no router needed (mode-based rendering)
- Zustand with 4 slices: document, reader, settings, ai
- DeepSeek client wraps fetch with streaming via ReadableStream
- PDF extraction via pdf.js (pdfjs-dist) on client side
- No auth, no backend, no DB — pure local-first
- Dark/light via Tailwind `dark` class + localStorage
- All prompts stored as modular TypeScript files exporting template strings

## Key Design Patterns
- Chunk-based text processing: text → sentences → chunks (3-5 words / configurable)
- RSVP rendering: center-fixed single word/chunk display
- Heatmap categories: logic, UI, tests, security, performance, docs, config
- Semantic clusters: LLM extracts topic clusters, rendered as React Flow nodes

## State Management
```
store/
  documentStore.ts   — raw text, parsed chunks, file metadata, diff state
  readerStore.ts     — current mode, speed (WPM), progress, active chunk
  settingsStore.ts   — API key, model name, theme, UI preferences
  aiStore.ts         — loading states, streaming responses, cached results
```

## File Structure
```
readforge/
├── docs/              # All documentation (.md with Mermaid)
├── samples/           # Sample input files
├── src/
│   ├── components/
│   │   ├── ui/        # shadcn/ui primitives
│   │   ├── layout/    # AppShell, Header, Sidebar, ModeSwitcher
│   │   ├── reader/    # SkimMode, GuidedScanMode, DeepReviewMode
│   │   ├── visualizations/  # ConceptMap, Heatmap, ProgressMeter, DiffView
│   │   └── input/     # TextPaste, FileUpload, DiffInput
│   ├── hooks/         # Custom hooks (useKeyboard, useStreamingAI)
│   ├── lib/           # shadcn/ui utilities (cn)
│   ├── services/      # DeepSeekService, ChunkingService, TextParser
│   ├── prompts/       # Modular system prompt templates
│   ├── store/         # Zustand stores
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Pure utility functions
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── components.json    # shadcn/ui config
└── README.md
```

## DeepSeek API
- Base URL: https://api.deepseek.com/v1
- Models: deepseek-chat (V3) or deepseek-reasoner (R1)
- Streaming: SSE via ReadableStream
- API key stored in localStorage (never committed)
- Prompt files modular: summarization, clustering, heatmap, diff
