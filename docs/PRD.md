# ReadForge — Product Requirements Document

## Executive Summary

**ReadForge** is a local-first, visualization-first speed-reading platform that helps users comprehend complex text-based content 2–4× faster while maintaining or improving comprehension. It combines evidence-based speed-reading techniques (chunked RSVP, guided scanning, semantic clustering, heatmaps) with beautiful interactive visualizations.

Unlike cloud-dependent speed-reading tools, ReadForge runs entirely in the browser (`npm run dev`), works offline after load, and never sends raw content anywhere unless the user configures an AI API key.

### Target Users
- Engineers reviewing technical documentation, code diffs, PR descriptions
- Researchers reading academic papers and reports
- Students studying dense textbook or lecture content
- Anyone who needs to consume long-form text efficiently

### Core Value Proposition

> ReadForge transforms reading from a linear, passive activity into an interactive, visual exploration. Instead of scrolling, you scan. Instead of guessing importance, you see it. Instead of losing context, you navigate semantically.

## Detailed User Stories

### Story 1: Skim Mode — The 10,000-Foot View

**As a** senior engineer reviewing a 40-page technical RFC,
**I want to** get an AI-generated summary with a visual heatmap of the document,
**So that** I can decide in 60 seconds whether to read it in full.

**Acceptance Criteria:**
- Paste or upload text → system generates summary within 5 seconds (or as fast as DeepSeek responds)
- Summary includes: main topic, key claims, methodology, conclusions, action items
- Heatmap colors paragraphs by category (logic, architecture, security, performance, etc.)
- Semantic concept map shows relationships between topics
- "Confidence meter" indicates summary reliability

### Story 2: Guided Scan Mode — RSVP at Your Pace

**As a** student with a 20-page paper to read before tomorrow,
**I want to** flash chunks of text at an adjustable speed in the center of my screen,
**So that** I can process content faster than normal reading without moving my eyes.

**Acceptance Criteria:**
- Text is chunked into configurable units (1 word, 3 words, 1 phrase, 1 sentence)
- Speed adjustable from 100–1000 WPM via slider or keyboard shortcuts
- Pause/play, skip forward/backward by chunk or paragraph
- Progress bar shows "chunks remaining" and estimated time
- Optional comprehension checks every N chunks (toggleable)
- Dark mode with high-contrast focus point

### Story 3: Deep Review Mode — Navigate with Intent

**As a** tech lead reviewing a PR with 30+ files changed,
**I want to** see the diff color-coded and semantically organized,
**So that** I can focus on the highest-impact changes first.

**Acceptance Criteria:**
- Code diff parsed and displayed side-by-side with syntax highlighting
- Changes clustered by semantic category (business logic, UI, tests, config)
- Collapsible sections for each file/change cluster
- Click to jump to specific code locations
- Heatmap overlay on diff showing impact severity
- Keyboard shortcuts: `j`/`k` to navigate changes, `Enter` to expand

### Story 4: Input Flexibility

**As a** power user who reads content from many sources,
**I want to** paste text, upload files, or drop diffs,
**So that** I can use ReadForge with any content without switching tools.

**Acceptance Criteria:**
- Paste plain text or markdown directly
- Upload `.md`, `.txt`, `.pdf` (text extraction), `.patch`, `.diff` files
- Drag-and-drop support on the input area
- Sample files bundled in the repo for testing

### Story 5: Local-First + Privacy

**As a** security-conscious developer,
**I want to** control exactly where my data goes,
**So that** I can use ReadForge with confidential content safely.

**Acceptance Criteria:**
- No data sent anywhere unless user provides an API key
- API key stored only in localStorage (never in code or logs)
- All text processing (chunking, parsing) done client-side
- AI analysis only sent to DeepSeek (or configured endpoint)
- Clear privacy indicator showing "AI: Offline" or "AI: DeepSeek"

### Story 6: Settings & Configuration

**As a** user who wants to optimize my reading,
**I want to** configure API key, model, WPM, chunk size, and theme,
**So that** the experience matches my preferences.

**Acceptance Criteria:**
- Settings panel with: API key input (masked), model selector (V3/R1), WPM slider, chunk size selector, theme toggle
- Settings persisted in localStorage
- "Test API Key" button with success/failure feedback
- Reset to defaults option

## Modes Overview

| Mode | Best For | AI Required? | Reading Speed | Visual Feature |
|---|---|---|---|---|
| Skim | Overview / triage | Yes (recommended) | Instant | Heatmap + Concept Map |
| Guided Scan | Deep reading | Optional | 100–1000 WPM | RSVP flash + Progress |
| Deep Review | Analysis / review | Optional | User-controlled | Diff view + Semantic clusters |

## Scope

### MVP (v1.0)
- All 3 reading modes functional
- Text paste, file upload (.md, .txt, .pdf, .diff)
- DeepSeek integration with streaming
- Heatmap + concept map visualizations
- Settings page
- Dark/light mode
- Keyboard shortcuts
- Sample files in repo
- Comprehensive README

### v2.0 (Future)
- Multiple documents / tab management
- Reading history & progress tracking
- Export summaries
- Local RAG (embedding search within documents)
- Plugin system for custom chunkers
