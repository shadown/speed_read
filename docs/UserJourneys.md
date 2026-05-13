# ReadForge — User Journeys

## Journey 1: First-time User — Onboarding & Skim

```mermaid
sequenceDiagram
    actor U as User
    participant UI as ReadForge UI
    participant S as Store (Zustand)
    participant AI as DeepSeek API

    U->>UI: Opens readforge.app (npm run dev)
    UI->>UI: Loads dark/light theme from localStorage
    UI->>S: Initialize stores
    S-->>UI: Default state (Skim Mode, dark theme)

    U->>UI: Pastes technical RFC text (~10K words)
    UI->>S: documentStore.setRawText(text)
    S->>S: Chunk text into paragraphs
    UI-->>U: Shows text preview + "Analyze with AI" button

    U->>UI: Clicks "Skim with AI"
    UI->>S: settingsStore.hasApiKey() → true (user configured earlier)
    S->>AI: POST /v1/chat/completions (summarize prompt + text)
    AI-->>S: Streaming response (summary chunks)
    S-->>UI: Update summary panel progressively
    UI-->>U: Summary appears word-by-word (streaming)

    S->>AI: POST /v1/chat/completions (heatmap analysis)
    AI-->>S: Paragraph categories array
    S->>S: Map categories to colors
    UI-->>U: Text paragraphs highlighted by category

    S->>AI: POST /v1/chat/completions (concept clustering)
    AI-->>S: Topic clusters + relationships
    S->>S: Build React Flow nodes + edges
    UI-->>U: Interactive concept map appears

    U->>U: "I can see this is about distributed databases. Key claims about CAP theorem tradeoffs. Skim done in 30s."
```

## Journey 2: Daily Reading — Guided Scan Mode

```mermaid
sequenceDiagram
    actor U as User
    participant UI as ReadForge UI
    participant S as Store
    participant RSVP as Guided Scan Engine

    U->>UI: Uploads research paper PDF
    UI->>S: documentStore.setFile(file)
    S->>S: Extract text via pdf.js
    S->>S: Chunk text into 3-word groups
    S-->>UI: "Ready: 2,340 chunks, ~8 min at 300 WPM"

    U->>UI: Switches to Guided Scan Mode
    U->>UI: Sets speed to 400 WPM
    U->>UI: Clicks Play

    loop Every 150ms (at 400 WPM)
        RSVP->>UI: Flash current chunk (center screen)
        UI-->>U: Sees "the CAP theorem" → flash → "fundamentally changes" → flash
        RSVP->>S: readerStore.advanceChunk()
        S->>UI: Update progress bar
    end

    U->>UI: Presses Space → Pause
    U->>UI: Presses '[' → back 10 chunks
    U->>UI: Presses Space → Resume

    Note over U: 5 minutes later — finished entire paper
    UI-->>U: "Comprehension: 85% | Speed: 420 WPM effective"
```

## Journey 3: Code Review — Deep Review Mode

```mermaid
sequenceDiagram
    actor U as User
    participant UI as ReadForge UI
    participant S as Store
    participant D as Diff Parser

    U->>UI: Drops patch.diff file
    UI->>S: documentStore.setFile(file)
    S->>D: Parse diff → files, hunks, line changes
    D-->>S: Structured diff data
    S->>S: Cluster changes by semantic type
    S-->>UI: "12 files changed | 3 business logic | 2 UI | 4 tests | 3 config"

    U->>UI: Clicks "Business Logic" cluster
    UI-->>U: Shows 3 files side-by-side diff
    U->>U: Scans red/green lines
    U->>UI: Presses 'j' → next hunk
    U->>UI: Presses 'k' → previous hunk
    U->>UI: Clicks line 42 → expands context
    U->>UI: Clicks "Reviewed" checkbox

    U->>UI: Switches to heatmap view
    UI-->>U: Diff lines colored by impact (red=high, yellow=medium, green=low)
    U->>U: "The payment validation logic has high impact — must review carefully"
```

## Journey 4: Settings Configuration

```mermaid
sequenceDiagram
    actor U as User
    participant UI as ReadForge UI
    participant S as Store (localStorage)

    U->>UI: Opens Settings panel
    UI-->>U: Shows API Key input (masked), Model selector, WPM slider, Theme toggle

    U->>UI: Pastes DeepSeek API key
    UI->>U: Key stored in localStorage (encrypted at rest not needed — local only)
    U->>UI: Clicks "Test Connection"
    UI->>S: aiStore.testApiKey(key)
    S->>AI: GET /v1/models (simple auth test)
    AI-->>S: 200 OK
    S-->>UI: "✅ Connected — DeepSeek-V3 available"
    UI-->>U: Green checkmark

    U->>UI: Adjusts WPM to 500
    U->>UI: Switches theme to Dark
    U->>UI: Clicks "Save & Close"
    S->>localStorage: Persist all settings
    UI-->>U: Theme switches, WPM defaults changed
```

## Journey 5: Offline / No-AI Mode

```mermaid
sequenceDiagram
    actor U as User
    participant UI as ReadForge UI

    U->>UI: Opens ReadForge (no API key configured)
    UI-->>U: "AI Features: Offline — enter API key in Settings to enable"

    U->>UI: Pastes markdown article
    UI->>UI: Chunks text client-side
    UI-->>U: Shows "Guided Scan" and "Deep Review" modes available

    U->>UI: Guided Scan Mode
    UI->>UI: RSVP engine runs locally
    UI-->>U: Full speed reading without any network calls

    U->>UI: Deep Review Mode
    UI->>UI: Syntax highlights, collapsible sections
    UI-->>U: Manual navigation works without AI

    U->>UI: Tries Skim Mode
    UI-->>U: "Skim Mode requires AI — configure API key in Settings"
    UI->>UI: Disables but grays out with tooltip
```
