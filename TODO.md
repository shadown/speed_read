# ReadForge — Build Checklist

## Phase 1: Documentation

- [ ] `docs/PRD.md` — Product Requirements Document
- [ ] `docs/UserJourneys.md` — User flows with Mermaid diagrams
- [ ] `docs/Architecture.md` — Technical architecture with Mermaid
- [ ] `docs/DataFlow.md` — Data processing pipeline
- [ ] `docs/ComponentBreakdown.md` — React component tree + state
- [ ] `docs/NonFunctional.md` — Performance, accessibility, security

## Phase 2: Implementation Plan

- [ ] `docs/TechStack.md` — Exact tech stack and folder structure
- [ ] `docs/Roadmap.md` — 3-week MVP roadmap

## Phase 3: Build — Scaffold & Config

- [ ] `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`
- [ ] `index.html`, `src/main.tsx`, `src/App.tsx`
- [ ] `src/index.css` — Tailwind base + global styles
- [ ] `components.json` — shadcn/ui config

## Phase 3: Build — UI Components

- [ ] `src/components/ui/` — shadcn/ui base components (button, card, dialog, input, etc.)
- [ ] `src/components/layout/` — App shell, sidebar, header, mode switcher
- [ ] `src/components/reader/` — SkimMode, GuidedScanMode, DeepReviewMode
- [ ] `src/components/visualizations/` — ConceptMap, Heatmap, ProgressMeter, DiffView
- [ ] `src/components/input/` — TextPaste, FileUpload, DiffInput
- [ ] `src/components/Settings.tsx` — API key, model config, WPM settings

## Phase 3: Build — State & Services

- [ ] `src/store/` — Zustand stores (document, reader, settings, ai)
- [ ] `src/services/` — DeepSeekService, ChunkingService, TextParser
- [ ] `src/prompts/` — Modular system prompts (summarize, cluster, heatmap, diff)

## Phase 3: Build — Sample Data & README

- [ ] `samples/sample-article.md` — Technical article sample
- [ ] `samples/sample-diff.diff` — Code diff sample
- [ ] `samples/sample-paper.md` — Research paper excerpt
- [ ] `README.md` — Complete with install, usage, keyboard shortcuts
