# CommCue — PlanV3: Research Framing and Mode Redesign

This document defines the V3 upgrade to CommCue. It supersedes the original `Plan.md` spec and builds on what was delivered in `PlanV2.md`.

---

## What Changes in V3

| Area                     | V2                                                                                     | V3                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Communication Dimensions | 5 (Supportiveness, Precision, Clarity of Expectations, Empathy, Constructive Feedback) | 6 (Clarity, Accuracy, Conciseness, Professionalism, Compassion, Supportiveness) |
| Modes                    | 2 (Pre-send, Post-hoc Reflection)                                                      | 3 (Pre-send, Real-time Support, Post-reflection)                                |
| Post-reflection output   | Qualitative feedback only                                                              | Adds dimension scores 1–5                                                       |
| Real-time Support        | Not present                                                                            | New lightweight mode for live conversations                                     |

---

## Research Framing

This prototype is intended for workplace communication and collaboration support. It should emphasize:

### Communication Dimensions

**[1] Clarity**

- Ensure the message is easy to understand and unambiguous
- Check:
  - Are there vague references (e.g., "this", "that")?
  - Are actors, actions, and timing clearly specified?
  - Is the structure logical?
- Improve by:
  - Replacing vague terms with explicit nouns
  - Adding missing context (who/what/when)
  - Structuring content into clear units

**[2] Accuracy**

- Ensure information is correct and reliable
- Check:
  - Any speculation or unsupported claims?
  - Any internal inconsistencies?
- Improve by:
  - Removing uncertain claims unless necessary
  - Aligning statements with known facts
  - Avoiding exaggeration

**[3] Conciseness**

- Ensure efficient expression without redundancy
- Check:
  - Are there repeated ideas?
  - Is there unnecessary filler?
- Improve by:
  - Removing redundant phrases
  - Compressing sentences
  - Keeping only essential information

**[4] Professionalism**

- Ensure workplace-appropriate tone
- Check:
  - Is the tone respectful and neutral?
  - Is formality level appropriate?
- Improve by:
  - Removing slang or overly casual phrasing
  - Using polite, neutral wording
  - Maintaining professional tone

**[5] Compassion**

- Ensure emotional awareness and empathy
- Check:
  - Does the message acknowledge the recipient's situation?
  - Does it show understanding of feelings?
- Improve by:
  - Adding empathetic statements when appropriate
  - Avoiding cold or purely transactional tone
  - Using phrases like "I understand…" or "I appreciate…"

**[6] Supportiveness**

- Ensure encouragement and psychological safety
- Check:
  - Is the message overly critical or blaming?
  - Does it encourage collaboration?
- Improve by:
  - Reframing criticism constructively
  - Avoiding blame language
  - Adding collaborative phrasing:
    - "Let's work through this together"
    - "We can improve this by…"

---

## Mode-Specific Behavior

### [Pre-send Mode]

**Goal:** Optimize a written reply before sending

**User Flow:**

1. System provides an input field containing the original message (the message the user is replying to)
2. User drafts a reply
3. System analyzes the drafted reply across all communication quality dimensions:
   - Clarity
   - Accuracy
   - Conciseness
   - Professionalism
   - Compassion
   - Supportiveness
4. System generates improvement suggestions and a revised version

**System Behavior:**

- Identify specific issues (not generic feedback)
- Prioritize high-impact improvements
- Preserve user intent and voice

**Output Format:**

1. Revised Message (clean, ready to send)
2. Inline Suggestions (highlighted edits with explanations)
   - e.g., [Clarity] Replace "this" → "the onboarding document"
   - e.g., [Tone] Soften phrasing to reduce harshness
3. Summary of Improvements (by dimension, bullet points)

---

### [Real-time Support Mode]

**Goal:** Provide lightweight, non-intrusive, real-time support during live conversation (e.g., Zoom meeting)

**User Flow:**

1. User activates real-time support (e.g., clicks "Assist" button)
2. System captures and transcribes ongoing conversation (speaker-aware if possible)
3. System analyzes conversation context in real time
4. System provides suggested response points

**System Behavior:**

- Focus ONLY on high-impact, time-sensitive guidance
- Do NOT generate full sentences unless explicitly needed
- Prioritize:
  - Clarity (what to say)
  - Compassion (how to say it)
  - Supportiveness (how to maintain collaboration)

**Output Format:**

1. Suggested Talking Points (short bullet points)
   - e.g., "Acknowledge their concern about timeline"
   - e.g., "Clarify deliverables for next week"
2. Optional Quick Phrases (1–2 short sentence options)
3. Tone Guidance Tag (e.g., "empathetic", "direct but supportive")

**Constraint:** Keep output minimal and glanceable (low cognitive load)

---

### [Post-reflection Mode]

**Goal:** Support learning and long-term improvement after communication

**User Flow:**

1. User inputs a past message or conversation transcript
2. System evaluates communication quality across all dimensions
3. System provides structured feedback and learning insights

**System Behavior:**

- Balance critique with positive reinforcement
- Focus on patterns, not just one-off corrections
- Provide actionable, reusable advice

**Output Format:**

1. Dimension Scores (1–5):
   - Clarity
   - Accuracy
   - Conciseness
   - Professionalism
   - Compassion
   - Supportiveness
2. Strengths — what was done well (specific and concrete)
3. Key Issues — high-impact problems with explanation
4. Improved Version — rewritten message
5. Learning Insights — generalizable advice
   - e.g., "When giving feedback, pair critique with a constructive suggestion"

---

## Global Design Principles

- Preserve user intent; do not overwrite meaning
- Improve, do not overcorrect
- Balance clarity, efficiency, and empathy
- Adapt tone to context (e.g., peer vs manager, conflict vs coordination)
- Prefer actionable suggestions over abstract advice
- Ensure outputs are concise and easy to scan

---

## Implementation Delta (V2 → V3)

### 1. Update Communication Dimensions (`src/lib/dimensions.ts`)

Replace the 5 existing dimensions with these 6:

| ID                | Label           | Color  |
| ----------------- | --------------- | ------ |
| `clarity`         | Clarity         | blue   |
| `accuracy`        | Accuracy        | indigo |
| `conciseness`     | Conciseness     | cyan   |
| `professionalism` | Professionalism | slate  |
| `compassion`      | Compassion      | rose   |
| `supportiveness`  | Supportiveness  | green  |

### 2. Update Types (`src/types/index.ts`)

- `DimensionId`: new union `clarity | accuracy | conciseness | professionalism | compassion | supportiveness`
- `AnalysisMode`: extend to `pre-send | real-time | reflect`
- `FeedbackResult`: add `dimension_scores?: Record<DimensionId, number>` (1–5, for post-reflection)
- Add `RealTimeSupportResult` type with: `talking_points: string[]`, `quick_phrases: string[]`, `tone_tag: string`

### 3. Update Prompts (`src/lib/prompts.ts`)

- Update all dimension reference maps to use the new 6 dimensions
- Add `buildRealTimePrompt(req)` — minimal output, bullet-point focused
- Update `buildReflectPrompt` — add dimension score output (1–5 per dimension)
- Update `buildPreSendPrompt` — add inline suggestion format (`[DimensionLabel] change description`)

### 4. Update API Route (`src/app/api/analyze/route.ts`)

- Accept `real-time` as a valid mode value
- Route to `buildRealTimePrompt` when mode is `real-time`
- Return `RealTimeSupportResult` shape for real-time mode

### 5. Add Real-time Support Page (`src/app/real-time/page.tsx`)

- New route at `/real-time`
- Minimal UI: text area for live conversation transcript, "Assist" button
- Output panel: talking points list, optional quick phrases, tone tag chip
- Keep UI deliberately lightweight (glanceable, low cognitive load)

### 6. Update Navigation

- Add "Real-time Support" link to nav alongside Pre-send and Reflect
- Update home page overview to describe all 3 modes

### 7. Seed Scenarios

- Update seed scenarios to include real-time meeting situations
- Keep 5 examples per mode

---

## Verification

1. Run `npm run dev` — all 5 routes load without error (`/`, `/pre-send`, `/real-time`, `/reflect`, `/log`)
2. Pre-send: submit a message, verify inline suggestions appear with dimension labels
3. Real-time: submit a meeting transcript, verify output is bullet-point talking points only (no full paragraphs)
4. Post-reflection: submit a message, verify dimension scores (1–5) appear in output
5. Session log handles both old (V2) and new (V3) dimension IDs gracefully
6. TypeScript: `npm run build` passes with no type errors
