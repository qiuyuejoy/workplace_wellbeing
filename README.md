# CommCoach

A human-centered AI communication coach for workplace messaging. Research prototype built with Next.js + Claude API.

## Setup

```bash
npm install
cp .env.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home / overview
│   ├── pre-send/page.tsx   # Pre-send review mode
│   ├── reflect/page.tsx    # Post-hoc reflection mode
│   ├── log/page.tsx        # Session log + export
│   └── api/analyze/        # POST endpoint — calls Claude API
├── components/
│   ├── controls/           # Dimension selector, audience/intent dropdowns, toggles
│   ├── feedback/           # FeedbackCard and all sub-sections
│   ├── input/              # Textareas, seed scenario chips
│   ├── layout/             # Nav, PageHeader
│   ├── log/                # Session table, row, detail, export button
│   └── rating/             # Self-rating form (usefulness/relevance/apply)
├── lib/
│   ├── anthropic.ts        # Anthropic client singleton
│   ├── dimensions.ts       # Communication dimension definitions
│   ├── prompts.ts          # System prompt builders for both modes
│   ├── seeds.ts            # 5 example workplace scenarios
│   └── storage.ts          # localStorage helpers for session persistence
└── types/index.ts          # All TypeScript interfaces
```

## Customization

**Edit prompts:** `src/lib/prompts.ts` — `buildPreSendPrompt` and `buildReflectPrompt` control what Claude is instructed to do. Tone, verbosity, and output schema are all in here.

**Add a communication dimension:** Edit `src/lib/dimensions.ts` — add an entry to `DIMENSIONS`, then add the new id to the `DimensionId` union in `src/types/index.ts`.

**Add seed scenarios:** Edit `src/lib/seeds.ts`.

**Change the Claude model:** Edit `src/app/api/analyze/route.ts` — the `model` field in the `messages.create` call.

## Research Features

- Sessions are auto-saved to `localStorage` after each analysis
- Users can rate feedback (usefulness 1–5, relevance 1–5, would apply yes/no)
- Session Log page shows all saved sessions with expandable detail
- Export all sessions as `commcoach-sessions.json` for offline analysis

## Design Notes

This is a **research prototype**, not a production system. Intentionally omitted:
- Authentication / multi-user support
- Database backend (uses browser localStorage)
- Slack/Teams integrations
- Analytics infrastructure
- Production deployment setup

The single `/api/analyze` endpoint serves both modes — the `mode` parameter determines which system prompt is built. All state lives in React `useState` + localStorage. No global state manager needed.
