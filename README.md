# ⚡ ReadForge — Speed-Reading Platform

**Visualization-first speed reading. Read complex content 2–4× faster with intelligent visualizations.**

ReadForge combines evidence-based speed-reading techniques (chunked RSVP, guided scanning, heatmaps, semantic clustering) with beautiful interactive visualizations. It runs entirely in your browser — local-first, no backend, no vendor lock-in.

![ReadForge Skim Mode](https://img.shields.io/badge/Status-MVP-brightgreen)
![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Tailwind](https://img.shields.io/badge/Tailwind-3-06b6d4)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

### Three Progressive Reading Modes

| Mode | Description | AI Required? |
|---|---|---|
| **🔍 Skim Mode** | AI-generated summary + visual heatmap + interactive concept map. Get the gist of any document in under 60 seconds. | Yes (DeepSeek) |
| **👁️ Guided Scan** | RSVP-style chunk flashing at adjustable speed (50–1500 WPM). Center-fixed focus with minimalist display. Pause, skip, and comprehension checks. | No |
| **🔎 Deep Review** | Side-by-side diff view, collapsible semantic clusters, heatmap overlay. Perfect for code reviews and document analysis. | Optional |

### Visual Features
- **Interactive Concept Map** — React Flow-powered semantic graph showing topic relationships
- **Content Heatmap** — Color-coded paragraphs by category (logic, UI, tests, security, performance, docs, config)
- **Category Filters** — Click to filter paragraphs by semantic type
- **Progress Tracking** — Chunks read, time remaining, effective WPM
- **Side-by-Side Diff** — Unified diff with file navigation and hunk expansion
- **Dark/Light Mode** — Toggle with a click or keyboard shortcut
- **Keyboard Shortcuts** — Full keyboard navigation for power users

### Input Methods
- ✏️ Paste any text or markdown
- 📁 Upload `.md`, `.txt`, `.pdf` (text extraction), `.diff`, `.patch`
- 🎯 Drag and drop files
- 🔄 Auto-detects markdown, diff, and plain text

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repo-url> readforge
cd readforge

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## ⚙️ Configuration

ReadForge is fully functional without any configuration. For AI features (Skim Mode), you need a DeepSeek API key:

1. Get a DeepSeek API key from [platform.deepseek.com](https://platform.deepseek.com)
2. In ReadForge, press `s` or click the Settings gear icon
3. Paste your API key and click "Test Connection"
4. Select model: `deepseek-chat` (V3, faster) or `deepseek-reasoner` (R1, deeper analysis)

> 🔒 **Privacy**: Your API key is stored in `localStorage` only. It's never sent anywhere except to `api.deepseek.com`. No data leaves your machine unless you explicitly trigger an AI analysis.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `1` | Switch to Input mode |
| `2` | Switch to Skim mode |
| `3` | Switch to Guided Scan mode |
| `4` | Switch to Deep Review mode |
| `Space` | Play/Pause RSVP (Guided Scan) |
| `←` / `→` | Back/Forward 1 chunk (Guided Scan) |
| `[` / `]` | Back/Forward 10 chunks (Guided Scan) |
| `-` / `=` | Decrease/Increase WPM by 50 (Guided Scan) |
| `j` / `k` | Next/Previous (Deep Review) |
| `t` | Toggle dark/light theme |
| `s` | Open Settings |
| `⌘Enter` | Load content (Input mode) |

---

## 🧭 How to Use

### 1. Load Content
Paste text, upload a file, or drop a diff. ReadForge automatically detects the content type.

### 2. Choose Your Mode
- **Skim** (key `2`) — Get the big picture with AI summary + visual maps
- **Guided Scan** (key `3`) — Read with RSVP chunk flashing at your pace
- **Deep Review** (key `4`) — Analyze diffs or review full text

### 3. Navigate & Understand
Use keyboard shortcuts to control playback, adjust speed, and explore semantic relationships. The heatmap shows you what kind of content each section contains at a glance.

---

## 📂 Project Structure

```
readforge/
├── docs/                  # Documentation with Mermaid diagrams
│   ├── PRD.md
│   ├── Architecture.md
│   ├── ComponentBreakdown.md
│   ├── DataFlow.md
│   ├── UserJourneys.md
│   ├── NonFunctional.md
│   ├── TechStack.md
│   └── Roadmap.md
├── samples/               # Sample input files
│   ├── sample-article.md  # Technical article (~1.5K words)
│   ├── sample-diff.diff   # Code diff (5 files, JWT auth)
│   └── sample-paper.md    # Research paper excerpt (Transformer)
├── src/
│   ├── components/        # React components
│   │   ├── ui/            # shadcn/ui primitives
│   │   ├── layout/        # App shell, header
│   │   ├── reader/        # Mode pages + RSVP + controls
│   │   ├── visualizations/# ConceptMap, Heatmap, DiffView
│   │   └── input/         # Paste, upload, diff input
│   ├── hooks/             # useKeyboardShortcuts, useProgress, useTheme
│   ├── store/             # Zustand stores (document, reader, settings, ai)
│   ├── services/          # DeepSeekService, ChunkingService, TextParser, DiffParser
│   ├── prompts/           # Modular AI prompts (summarize, cluster, heatmap, diff)
│   └── types/             # TypeScript type definitions
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

---

## 🔧 Tech Stack

| Technology | Purpose |
|---|---|
| **Vite 6** | Build tool |
| **React 19** | UI framework |
| **TypeScript 5** | Type safety |
| **Tailwind CSS 3** | Styling |
| **shadcn/ui** | UI primitives (custom, no npx dependency) |
| **Zustand 5** | State management |
| **React Flow (@xyflow/react)** | Concept map graphs |
| **pdfjs-dist** | PDF text extraction |
| **diff** (npm) | Unified diff parsing |
| **Lucide React** | Icons |
| **DeepSeek API** | AI analysis (OpenAI-compatible) |

### Why this stack?
- **No backend needed** — everything runs in the browser
- **No React Router** — mode-based rendering is simpler for single-page apps
- **No Redux** — Zustand is minimal and fast
- **No D3** — React Flow handles graph visualization with less code

---

## 🧪 Sample Files

The `samples/` directory includes three files for testing:

1. **`sample-article.md`** — "Distributed Systems: From CAP to the New SQL Renaissance" (~1,500 words, 8 sections)
2. **`sample-diff.diff`** — JWT authentication middleware PR (5 files, 189 insertions)
3. **`sample-paper.md`** — "Attention Is All You Need" Transformer paper excerpt

Open any sample by pasting its content or loading the file in Input mode.

---

## 📘 Documentation

All documentation is in `docs/` and uses Mermaid diagrams:

- **[PRD.md](docs/PRD.md)** — Product requirements and user stories
- **[Architecture.md](docs/Architecture.md)** — Technical architecture with diagrams
- **[ComponentBreakdown.md](docs/ComponentBreakdown.md)** — React component tree and state
- **[DataFlow.md](docs/DataFlow.md)** — Text processing pipeline and AI flow
- **[UserJourneys.md](docs/UserJourneys.md)** — User flows with sequence diagrams
- **[NonFunctional.md](docs/NonFunctional.md)** — Performance, accessibility, security
- **[TechStack.md](docs/TechStack.md)** — Exact dependencies and folder structure
- **[Roadmap.md](docs/Roadmap.md)** — 3-week development roadmap

---

## 🧠 AI Prompts

All AI prompts are modular and swappable:

| File | Purpose |
|---|---|
| `src/prompts/summarize.ts` | General summarization with JSON structure |
| `src/prompts/heatmap.ts` | Paragraph-level category classification |
| `src/prompts/cluster.ts` | Semantic concept clustering with relationships |
| `src/prompts/diff.ts` | Code diff impact analysis |

Each prompt outputs structured JSON, making it easy to parse and render. Prompts are designed for DeepSeek but work with any OpenAI-compatible API.

---

## 🤝 Contributing

ReadForge is local-first and dependency-light by design. Contributions are welcome!

### Development Guidelines
- Keep dependencies minimal — prefer implementing over importing
- All AI prompts must be modular and swappable
- Maintain local-first — no feature should require a backend
- Use Mermaid for all diagrams in documentation

---

## 📄 License

MIT — free for any use.

---

## 🙏 Acknowledgments

- Inspired by Spritz, BeeLine Reader, and decades of speed-reading research
- Built with React, Zustand, and a deep appreciation for well-designed developer tools
- Uses Mozilla's PDF.js for client-side PDF extraction
