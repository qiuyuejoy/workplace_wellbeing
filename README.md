# CommCue

A human-centered AI Communication Cue for workplace messaging. Research prototype built with Next.js + Claude API + MongoDB.

## Setup

```bash
npm install
cp .env.example .env.local
# Add your keys to .env.local (see Environment Variables below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable            | Required | Description                                              |
| ------------------- | -------- | -------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | Yes      | Claude API key for message analysis                      |
| `MONGODB_URI`       | No       | MongoDB connection string for persistent session storage |

Without `MONGODB_URI`, sessions fall back to browser `localStorage` only.

## Features

- **Pre-send review** — paste a draft message and get structured feedback before sending
- **Reflect** — analyze a sent message or conversation after the fact
- **Skill Trends** — analytics across all sessions (scores, trends, dimension breakdown)
- **Session log** — full history with expandable detail, user ratings, and JSON export
- Configurable feedback style (concise / balanced / detailed) and intervention mode (gentle / direct)
- 6 communication dimensions scored per analysis

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home / overview
│   ├── pre-send/page.tsx   # Pre-send review mode
│   ├── reflect/page.tsx    # Post-hoc reflection mode
│   ├── log/page.tsx        # Session log + export
│   ├── Skill Trends/page.tsx  # Analytics Skill Trends
│   └── api/
│       ├── analyze/        # POST — calls Claude API, saves session
│       └── sessions/       # GET / POST / PATCH session records
├── components/
│   ├── controls/           # Dimension selector, audience/intent dropdowns, toggles
│   ├── feedback/           # FeedbackCard and all sub-sections
│   ├── input/              # Textareas, seed scenario chips
│   ├── layout/             # Nav, PageHeader
│   ├── log/                # Session table, row, detail, export button
│   └── rating/             # Self-rating form (usefulness/relevance/apply)
├── lib/
│   ├── anthropic.ts        # Anthropic client singleton
│   ├── mongodb.ts          # MongoDB client singleton
│   ├── dimensions.ts       # Communication dimension definitions
│   ├── prompts.ts          # System prompt builders for both modes
│   ├── seeds.ts            # Example workplace scenarios
│   └── storage.ts          # localStorage helpers (client-side fallback)
└── types/index.ts          # All TypeScript interfaces
```

## Tech Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript 5**
- **Tailwind CSS 4**
- **Claude API** (`claude-opus-4-6`) via `@anthropic-ai/sdk`
- **MongoDB** for persistent session storage
- **Recharts** for Skill Trends visualizations

## Customization

**Edit prompts:** `src/lib/prompts.ts` — `buildPreSendPrompt` and `buildReflectPrompt` control what Claude is instructed to do. Tone, verbosity, and output schema are all in here.

**Add a communication dimension:** Edit `src/lib/dimensions.ts` — add an entry to `DIMENSIONS`, then add the new id to the `DimensionId` union in `src/types/index.ts`.

**Add seed scenarios:** Edit `src/lib/seeds.ts`.

**Change the Claude model:** Edit `src/app/api/analyze/route.ts` — the `model` field in the `messages.create` call.

## Research Features

- Sessions are saved to MongoDB (with localStorage fallback when `MONGODB_URI` is not set)
- Users can rate feedback (usefulness 1–5, relevance 1–5, would apply yes/no)
- Skill Trends shows aggregate trends and per-dimension breakdowns across all sessions
- Session Log shows full history with expandable detail
- Export all sessions as `CommCue-sessions.json` for offline analysis
