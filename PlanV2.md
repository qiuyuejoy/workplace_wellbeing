# CommCoach — PlanV2: What Was Built

This document summarizes the implementation decisions and updates made relative to the original `Plan.md` spec.

---

## Stack Changes vs. Original Spec

| Area | Plan.md | Implemented |
|---|---|---|
| LLM | OpenAI API | **Claude API** (`claude-opus-4-6`, Anthropic SDK) |
| Framework | Next.js + TypeScript | Next.js 16.2.3 (App Router) + TypeScript ✓ |
| Styling | Tailwind CSS | Tailwind CSS v4 ✓ |
| Storage | Local JSON or SQLite | `localStorage` (SSR-safe helpers) ✓ |

---

## What Was Built

### Core App (Phases 1–4 complete)

**4 pages, all functional:**
- `/` — Home/Overview: explains the tool, two modes, and five communication dimensions
- `/pre-send` — Pre-send Review: draft a message, configure context, get structured feedback
- `/reflect` — Post-hoc Reflection: paste a sent message or conversation, get reflective coaching
- `/log` — Session Log: view saved sessions, expand details, export all data as JSON

**Single API endpoint:** `POST /api/analyze` — serves both modes. The `mode` field selects the system prompt; the output schema is identical for both.

---

### Communication Dimensions (`src/lib/dimensions.ts`)

Five dimensions, each with a label, description, Tailwind color, and `promptInstruction` used to build the Claude prompt:

1. Supportiveness
2. Precision / Specificity
3. Clarity of Expectations
4. Empathy
5. Constructive Feedback

---

### Context Controls

All four controls from the spec are implemented and wired into the prompt:

- **Audience**: peer, manager, direct report, cross-functional, client, custom (free text)
- **Message Intent**: request, update, feedback, clarification, check-in, conflict repair, other
- **Feedback Style**: concise / balanced / detailed (controls verbosity of Claude output)
- **Intervention Mode**: gentle / direct (controls coaching tone)

---

### LLM Integration (`src/lib/prompts.ts`, `src/app/api/analyze/route.ts`)

- Model: `claude-opus-4-6`
- Two system prompt builders: `buildPreSendPrompt` and `buildReflectPrompt`
- Output: structured JSON enforced via prompt instructions — no additional parsing library needed
- JSON extraction: tries markdown fence first, falls back to `{…}` slice for robustness
- Structured output schema:

```json
{
  "summary": "string",
  "strengths": [{ "text": "string", "dimensions": ["..."] }],
  "issues": [{ "text": "string", "dimensions": ["..."] }],
  "suggestions": [{ "text": "string", "dimensions": ["..."] }],
  "optional_rewrite": "string | null",
  "next_time_tips": ["string"],
  "confidence_notes": "string | null"
}
```

Each `FeedbackPoint` carries a `dimensions` array so UI badges render without inference.

---

### Research Features

- **Auto-save**: every successful analysis is saved to `localStorage` as a `Session` object
- **Self-rating**: appears below each result — usefulness (1–5), relevance (1–5), would apply (yes/no)
- **Session Log**: table view with expandable detail rows showing full feedback and rating
- **JSON Export**: downloads `commcoach-sessions.json` for offline analysis
- **Seed Scenarios**: 5 clickable example chips on each mode page to pre-populate input

---

### Nice-to-Haves from Spec (all implemented)

- Toggle to show/hide optional rewrite panel
- Dimension badges on each feedback bullet linking it to the relevant dimension(s)
- Copy button on rewrite panel with "Copied!" toast
- Forward-looking "Next Time Tips" chip section

---

## Update: Image Upload / Screenshot OCR (added after initial build)

Users can now upload screenshots (e.g., Slack, Teams, email) instead of typing or pasting text.

**How it works:**
- An "Upload screenshot" button appears in the message input header on both Pre-send and Reflect pages
- Selected images are shown as thumbnail previews with individual remove buttons
- On submit, images are converted to base64 data URLs in the browser
- The API route passes them as vision content blocks to Claude (`type: "image"`, `source.type: "base64"`)
- Claude reads the text from the screenshot and performs the same structured analysis
- Text input remains optional — users can submit with image only, or combine image + typed context

**Files changed:**
- `src/types/index.ts` — added `images?: string[]` to `AnalyzeRequest`
- `src/components/input/MessageInput.tsx` — added file input, thumbnails, remove buttons
- `src/app/pre-send/page.tsx` — added `File[]` state, base64 conversion, updated validation
- `src/app/reflect/page.tsx` — same as pre-send
- `src/app/api/analyze/route.ts` — builds multimodal content array; accepts image-only submissions

**Supported formats:** JPEG, PNG, GIF, WEBP (Claude vision limits apply: 5 MB/image)

---

## Intentionally Left Out (prototype scope)

- Authentication / multi-user support
- Database backend (uses browser localStorage)
- Slack / Teams integrations
- Analytics infrastructure
- Production deployment setup
- Rate limiting or API key management UI
