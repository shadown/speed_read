# ReadForge — Data Flow

## End-to-End Text Processing Pipeline

```mermaid
flowchart TB
    subgraph "1. Ingestion"
        A["User Input"] --> B{Input Type}
        B -->|"Paste"| C["Plain Text / Markdown"]
        B -->|"File Upload"| D{File Type}
        D -->|".md / .txt"| E["Read as text"]
        D -->|".pdf"| F["Extract text with pdf.js"]
        D -->|".diff / .patch"| G["Parse unified diff format"]
        C --> H["Raw text buffer"]
        E --> H
        F --> H
        G --> I["Structured diff data"]
        I --> J["documentStore.diffData"]
        H --> J
    end

    subgraph "2. Chunking"
        J --> K["Detect language / format"]
        K --> L["Split into paragraphs (by double newline)"]
        L --> M["For each paragraph:"]
        M --> N["Split into sentences (by . ! ?)"]
        N --> O["Group into chunks"]
        O --> P{"Chunk Size"}
        P -->|"word"| Q["Single words"]
        P -->|"3word"| R["3 words per chunk"]
        P -->|"phrase"| S["Phrases (5-8 words)"]
        P -->|"sentence"| T["Full sentences"]
        Q --> U["Array of TextChunk[]"]
        R --> U
        S --> U
        T --> U
        U --> V["documentStore.chunks"]
    end

    subgraph "3. AI Analysis (conditional)"
        V --> W{"API Key configured?"}
        W -->|"No"| X["Skip AI — local-only modes"]
        W -->|"Yes"| Y["Select prompt template"]
        Y --> Z{Mode}
        Z -->|"Skim"| AA["summarize.ts prompt"]
        Z -->|"Skim"| AB["heatmap.ts prompt"]
        Z -->|"Skim"| AC["cluster.ts prompt"]
        Z -->|"Deep Review (diff)"| AD["diff.ts prompt"]
        AA --> AE["Call DeepSeek API (streaming)"]
        AB --> AE
        AC --> AE
        AD --> AE
        AE --> AF["Parse streaming response"]
        AF --> AG["documentStore.aiSummary"]
        AF --> AH["documentStore.aiHeatmap"]
        AF --> AI["documentStore.aiClusters"]
    end

    subgraph "4. Rendering"
        AG --> AJ["SkimMode: SummaryPanel + ConceptMap + Heatmap"]
        AH --> AJ
        AI --> AJ
        U --> AK["GuidedScanMode: RSVP display"]
        U --> AL["DeepReviewMode: Collapsible diff + clusters"]
        I --> AL
        AG --> AL
    end

    subgraph "5. User Interaction"
        AJ --> AM["User navigates concept map"]
        AJ --> AN["User toggles heatmap categories"]
        AK --> AO["User adjusts WPM"]
        AK --> AP["User pauses / skips"]
        AL --> AQ["User expands collapsible sections"]
        AL --> AR["User navigates by 'j'/'k'"]
        AM --> AS["readerStore updates"]
        AO --> AS
        AP --> AS
        AQ --> AS
        AR --> AS
    end
```

## DeepSeek API Call Flow (Streaming)

```mermaid
sequenceDiagram
    participant UI as UI Component
    participant Store as aiStore
    participant Service as DeepSeekService
    participant API as DeepSeek API
    participant Target as documentStore

    UI->>Store: startAnalysis(text, mode)
    Store->>Store: set isProcessing = true
    Store->>Service: analyze(text, promptTemplate, settings)

    Service->>Service: Build request body
    Service->>Service: Select system prompt from prompts/{type}.ts
    Service->>Service: Build user message (text context)

    Service->>API: POST /v1/chat/completions
    Note over Service,API: stream: true, model: deepseek-chat

    API-->>Service: SSE: data: {"choices":[{"delta":{"content":"..."}}]}

    loop For each chunk
        Service-->>Store: onChunk(text)
        Store-->>UI: Update streamingText
        UI-->>UI: Progressive render
    end

    API-->>Service: SSE: [DONE]
    Service->>Service: Parse complete response
    Service-->>Store: onComplete(fullResult)
    Store->>Store: set isProcessing = false
    Store->>Target: Update documentStore with result

    alt On Error
        API-->>Service: Error response
        Service-->>Store: onError(error)
        Store->>Store: set error
        Store->>Store: set isProcessing = false
    end
```

## Chunk Data Structure

```mermaid
classDiagram
    class TextChunk {
        +string id
        +string text
        +number index
        +number paragraphIndex
        +number wordCount
        +string[] words
        +number startChar
        +number endChar
    }

    class Paragraph {
        +string id
        +string text
        +number index
        +number charStart
        +number charEnd
        +HeatmapCategory category
        +number aiImpact
    }

    class HeatmapItem {
        +number paragraphIndex
        +HeatmapCategory category
        +number confidence
        +string reasoning
    }

    class DiffData {
        +DiffFile[] files
        +number totalAdditions
        +number totalDeletions
        +SemanticCluster[] clusters
    }

    class DiffFile {
        +string fileName
        +string status ("added"|"modified"|"deleted")
        +Hunk[] hunks
        +SemanticCluster cluster
    }

    class Cluster {
        +string id
        +string label
        +string[] fileIndices
        +number changeCount
        +number severity
    }

    TextChunk "*" --> "1" Paragraph
    Paragraph "1" --> "0..1" HeatmapItem
    DiffData "1" --> "*" DiffFile
    DiffFile "*" --> "1" Cluster
```

## Heatmap Categories

| Category | Color (Dark) | Color (Light) | Description |
|---|---|---|---|
| `logic` | `#ef4444` (red) | `#dc2626` | Core business logic, algorithms |
| `ui` | `#3b82f6` (blue) | `#2563eb` | UI components, styling |
| `tests` | `#22c55e` (green) | `#16a34a` | Tests, assertions |
| `security` | `#f59e0b` (amber) | `#d97706` | Auth, permissions, data safety |
| `performance` | `#a855f7` (purple) | `#9333ea` | Performance, optimization |
| `docs` | `#06b6d4` (cyan) | `#0891b2` | Documentation, comments |
| `config` | `#78716c` (stone) | `#57534e` | Configuration, env, setup |
| `other` | `#6b7280` (gray) | `#4b5563` | Uncategorized |
