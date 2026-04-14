# CommCue — PlanV4: MongoDB Storage + Progress Dashboard

This document defines the V4 upgrade to CommCue. It builds on V3 (6 dimensions, 3 modes) and adds persistent storage via MongoDB and a visualization dashboard for tracking communication skill development over time.

---

## Motivation

Session data currently lives in `localStorage` — it is lost on browser clears and inaccessible across devices. The user wants to track improvement in communication quality over time using dimension scores (1–5) returned by post-reflection mode. A dashboard showing score trends per dimension, with individual data points and weekly averages, makes that progress visible.

---

## What Changes in V4

| Area                | V3                              | V4                                       |
| ------------------- | ------------------------------- | ---------------------------------------- |
| Storage             | `localStorage` via `storage.ts` | MongoDB via API routes                   |
| Session persistence | Browser-only                    | Server-side, durable                     |
| Dashboard           | Session log (table only)        | `/dashboard` with dimension score charts |
| Dependencies        | None added                      | `mongodb`, `recharts`                    |

---

## Data Layer

### MongoDB Connection (`src/lib/mongodb.ts`)

A singleton client that reuses the connection across hot reloads in development.

```typescript
// Reads MONGODB_URI from process.env
// Exports: getDb() → Db
```

Add to `.env.local`:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/CommCue
```

### Collection: `sessions`

Documents use the existing `Session` type from `src/types/index.ts` — no schema changes needed. MongoDB `_id` is ignored; the app uses the `id` field (UUID) already present.

### API Routes

**`POST /api/sessions`** — Save a new session after analysis completes.

- Body: `Omit<Session, "id" | "createdAt">`
- Generates `id` (UUID) and `createdAt` (ISO timestamp) server-side
- Returns `{ id }`

**`GET /api/sessions`** — Fetch all sessions, sorted by `createdAt` descending.

- Returns `{ sessions: Session[] }`

**`PATCH /api/sessions/[id]`** — Save self-rating after user rates a session.

- Body: `{ rating: SessionRating }`
- Returns `{ ok: true }`

**`DELETE /api/sessions/[id]`** — Delete a session from the log.

- Returns `{ ok: true }`

### Replace `src/lib/storage.ts`

The current client-side `storage.ts` is replaced with a new version that calls the API routes above. The function signatures stay the same so page components require minimal changes:

```typescript
// saveSession()   → POST /api/sessions
// getSessions()   → GET /api/sessions
// updateRating()  → PATCH /api/sessions/[id]
// deleteSession() → DELETE /api/sessions/[id]
// exportJSON()    → stringify result of getSessions()
```

All functions become `async`. Callers (page components) are updated to `await` them.

---

## Dashboard (`/dashboard`)

### Route

New page at `src/app/dashboard/page.tsx`. Added to navigation between "Session Log" and the existing links.

### Layout

```
┌─────────────────────────────────────────────────────┐
│  Summary row: total sessions · this week · top mode │
├─────────────────────────────────────────────────────┤
│  Dimension Score Trends                             │
│                                                     │
│  [Clarity]        [Accuracy]                        │
│  [Conciseness]    [Professionalism]                 │
│  [Compassion]     [Supportiveness]                  │
│                                                     │
│  Each chart: dots (individual sessions) +           │
│              line (weekly average trend)            │
└─────────────────────────────────────────────────────┘
```

### Data Source

Only sessions where `result.dimension_scores` is present are used for score charts (post-reflection mode only). All sessions contribute to the summary row counts.

### Charts (Recharts `ComposedChart`)

Each of the 6 dimension charts uses:

- `ScatterChart` dots — one per reflect session, X = `createdAt` date, Y = score (1–5)
- `Line` overlay — weekly average of scores (grouped by ISO week)
- Y-axis fixed 1–5
- X-axis: date labels
- Color matches dimension (pink for clarity/accuracy, blue for conciseness/professionalism, orange for compassion/supportiveness)
- Tooltip shows date + score on hover

### Empty State

If fewer than 2 scored sessions exist, show a friendly message:

> "Complete a Post-reflection session to start tracking your progress."

### Summary Row

| Stat           | Source                                        |
| -------------- | --------------------------------------------- |
| Total sessions | All sessions in DB                            |
| This week      | Sessions with `createdAt` in current ISO week |
| Most-used mode | Mode with highest session count               |

---

## Page Component Updates

Pages that call `saveSession` and `updateRating` need minor updates since these become async:

- `src/app/pre-send/page.tsx`
- `src/app/reflect/page.tsx`
- `src/app/real-time/page.tsx`
- `src/app/log/page.tsx` — switch from `getSessions()` to `fetch("/api/sessions")`

---

## Navigation

Add "Dashboard" link to `src/components/layout/Nav.tsx`:

```typescript
{ href: "/dashboard", label: "Dashboard" }
```

Position: between "Session Log" and end of nav.

---

## Dependencies

```bash
npm install mongodb recharts
npm install --save-dev @types/recharts  # if needed
```

`recharts` is React-native and works with Next.js App Router client components without additional configuration.

---

## Verification

1. `MONGODB_URI` set in `.env.local` → app connects without error on startup
2. Submit a pre-send analysis → session appears in `/log` (fetched from MongoDB, not localStorage)
3. Submit a post-reflection analysis → session appears with dimension scores
4. Rate a session → rating persists after page refresh (proves DB write)
5. `/dashboard` loads with summary row and 6 charts
6. After 2+ reflect sessions → charts show dots and trend line
7. Fewer than 2 scored sessions → empty state message shown
8. `npm run build` passes with no TypeScript errors
