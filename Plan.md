You are an expert full-stack prototyping engineer helping me build a research prototype for an interview and possible pilot study.

I want you to build a lightweight, local-first prototype of a human-centered AI communication coach for workplace messaging. This is a research prototype, not a production system. Prioritize clarity, modularity, and feasibility over enterprise complexity.

## Project Goal

Build a prototype called “CommCoach” that helps users improve workplace communication in text-based messaging contexts.

The system should support two modes:

1. Pre-send review
   - User drafts a workplace message
   - The system analyzes it before sending
   - It gives concise suggestions to improve communication along selected dimensions

2. Post-hoc reflection
   - User pastes a sent message or short conversation
   - The system provides reflective feedback:
     - what worked well
     - what could be improved
     - alternative phrasing suggestions
     - what to try next time

This should be framed as communication augmentation, not automation. The system should help users improve their own communication rather than replace them.

---

## Research Framing

This prototype is intended for workplace communication and collaboration support. It should emphasize:
- supportiveness
- precision / specificity
- clarity of expectations
- empathy
- constructive feedback

The design should support:
- personalization
- user autonomy
- adaptive feedback
- low-friction interaction

Users should be able to choose which communication dimensions they want help with instead of receiving generic advice.

---

## Primary Use Case

A user wants help drafting or reflecting on workplace communication with a colleague, manager, or direct report.

Examples:
- asking for a task update
- giving feedback
- clarifying expectations
- responding to a tense message
- writing a supportive check-in
- giving a deadline or action items more clearly

---

## Scope Constraints

This is a 3-month-style research prototype, so keep scope intentionally narrow and feasible.

Do NOT build:
- actual Slack/Teams OAuth integrations
- production authentication
- multi-tenant backend infrastructure
- enterprise security systems
- heavy analytics infrastructure
- real-time socket collaboration
- polished production deployment setup

Instead, build a local prototype that simulates a communication assistant.

---

## Recommended Stack

Use a simple and robust stack:
- Frontend: Next.js + TypeScript + React
- Styling: Tailwind CSS
- UI: clean research-demo style, minimal but polished
- Backend: Next.js API routes or simple server actions
- LLM: OpenAI API
- State: local React state or lightweight persistence
- Storage: local JSON or SQLite if needed
- Charts/logging: keep simple

Please choose the simplest architecture that is easy to run locally.

---

## Core Product Requirements

### 1. Main App Structure

Create an app with 4 main sections:

1. Home / Overview
   - Brief explanation of the tool
   - Explain the two modes:
     - Pre-send review
     - Post-hoc reflection
   - Explain selected communication goals

2. Pre-send Review
   - Text area for drafting a message
   - Controls to select:
     - communication goal(s)
     - audience type
     - message context
   - Button: “Review Message”
   - Output:
     - overall summary
     - strengths
     - improvement suggestions
     - revised version (optional, collapsible)
     - short rationale tied to selected goals

3. Post-hoc Reflection
   - Input for either:
     - a single sent message
     - a short back-and-forth conversation
   - Same controls for goals / audience / context
   - Button: “Reflect on Communication”
   - Output:
     - what went well
     - what may have reduced clarity or supportiveness
     - possible alternatives
     - next-time suggestions

4. Session Log / Research View
   - Show saved reviews and reflections
   - Display:
     - timestamp
     - mode
     - selected goals
     - input preview
     - summary of feedback
   - Allow export as JSON

---

## 2. Communication Dimensions

Implement these 5 communication dimensions as selectable options:

- Supportiveness
- Precision / Specificity
- Clarity of Expectations
- Empathy
- Constructive Feedback

Each should have:
- a display name
- a short description
- a prompt instruction used for analysis

---

## 3. Context Controls

Include the following user controls:

### Audience Type
- peer / colleague
- manager
- direct report
- cross-functional collaborator
- client / external partner
- custom

### Message Intent
- request
- update
- feedback
- clarification
- check-in
- conflict repair
- other

### Feedback Style
- concise
- balanced
- detailed

### Intervention Mode
- gentle suggestions
- direct coaching

These controls should influence the prompt sent to the LLM.

---

## 4. LLM Behavior

Use the OpenAI API to analyze messages.

The model should NOT produce vague writing advice. It should act like a workplace communication coach and generate feedback tied to the selected communication dimensions.

For each analysis, generate structured JSON with fields like:

- summary
- strengths
- issues
- suggestions
- optional_rewrite
- next_time_tips
- confidence_notes

Make the output easy to parse and render.

Use a strong system prompt that instructs the model to:
- prioritize actionable feedback
- avoid over-policing tone
- avoid excessive rewriting
- preserve the user’s intent
- support authentic communication
- explain tradeoffs when relevant
- adapt to the audience and message intent

Also ensure it does NOT force every message to sound overly cheerful or overly corporate.

---

## 5. UX Requirements

Design a clean, minimal interface suitable for a research demo.

Requirements:
- polished but lightweight
- good spacing and typography
- easy to understand in under 1 minute
- all main flows visible without confusion
- loading states
- error handling
- empty states
- copy buttons for generated feedback / rewrites
- collapsible sections where helpful

Please make the UI feel credible for an HCI research prototype, not like a generic SaaS dashboard.

---

## 6. Research Prototype Features

Add lightweight features that support a future user study:

### A. Save interaction history
Each review/reflection should be stored locally with:
- timestamp
- input text
- selected goals
- selected audience
- selected intent
- feedback result

### B. Self-rating after feedback
After each result, let the user rate:
- usefulness (1–5)
- relevance (1–5)
- whether they would apply the advice (yes/no)

### C. Export data
Allow exporting all saved sessions as JSON for later analysis.

### D. Demo seed examples
Add 5 example workplace scenarios users can click to populate the input.

Examples:
- asking a teammate for a delayed update
- giving constructive feedback to a direct report
- clarifying vague ownership on a task
- responding to a frustrated coworker
- writing a supportive but specific check-in

---

## 7. Prompt Design

Please create prompt templates for both:
- pre-send review
- post-hoc reflection

The prompts should include:
- selected communication dimensions
- audience type
- message intent
- desired coaching style
- instruction to return structured JSON only

Also create a small prompt-config module so I can easily edit:
- dimension descriptions
- tone of coaching
- output verbosity

---

## 8. Architecture and Code Quality

Please build the codebase so it is easy for one researcher to understand and modify.

Requirements:
- TypeScript throughout
- clear folder structure
- reusable components
- comments only where helpful
- no unnecessary abstraction
- no overengineering
- robust error handling around API calls
- environment variable setup for OpenAI key
- README with setup instructions

Please include:
- a clear project structure
- installation steps
- how to run locally
- where to modify prompts
- where to add new communication dimensions

---

## 9. Implementation Plan

Implement in this order:

Phase 1:
- set up app shell
- build navigation and layout
- create dimension + context controls
- create input forms for both modes

Phase 2:
- implement OpenAI integration
- implement structured prompting
- render parsed results cleanly

Phase 3:
- add local session logging
- add self-ratings
- add JSON export
- add seed scenarios

Phase 4:
- improve UI polish
- improve error handling
- finalize README

Please work step by step and keep the app runnable throughout.

---

## 10. Deliverables I want from you

1. A working local prototype
2. Clean code for all pages/components
3. Prompt templates for the two modes
4. A README with setup and run instructions
5. A short note explaining:
   - system architecture
   - key design choices
   - what is intentionally left out due to prototype scope

---

## 11. Important Product Philosophy

This is not an AI auto-writer.
This is not an employee surveillance tool.
This is not a productivity scoring system.

It is a human-centered communication support tool that:
- helps people reflect
- helps people communicate more clearly and supportively
- respects user intent
- preserves autonomy
- supports workplace collaboration

Please reflect that philosophy in the copy, prompt design, and interaction design.

---

## 12. Nice-to-Have Features (only if simple)

If these are easy to add without much complexity, include them:
- toggle to show/hide rewrite
- side-by-side original vs suggested version
- badge labels showing which feedback maps to which dimension
- simple “before/after clarity” summary
- downloadable sample dataset of sessions

But do not let these delay the core build.

---

## 13. Start Now

Please:
1. propose a clean folder structure
2. scaffold the app
3. implement the first runnable version
4. then iterate to add LLM analysis and local logging

When making decisions, prefer the simplest approach that produces a convincing research prototype.