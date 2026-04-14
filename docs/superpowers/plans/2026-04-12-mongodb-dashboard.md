# MongoDB Storage + Progress Skill Trends Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace localStorage with MongoDB and add a `/trends` page showing dimension score trends over time.

**Architecture:** Sessions are stored in a MongoDB `sessions` collection via four Next.js API routes. The existing `storage.ts` is rewritten to call these routes (same function signatures, now async). A new `/trends` page fetches all sessions and renders 6 Recharts ComposedCharts — one per dimension — showing raw score dots and a weekly average trend line.

**Tech Stack:** Next.js 16 App Router, TypeScript, MongoDB Node.js driver, Recharts

---

## File Map

| File                                 | Action  | Purpose                               |
| ------------------------------------ | ------- | ------------------------------------- |
| `src/lib/mongodb.ts`                 | Create  | MongoDB client singleton              |
| `src/app/api/sessions/route.ts`      | Create  | GET list + POST create session        |
| `src/app/api/sessions/[id]/route.ts` | Create  | PATCH rating + DELETE session         |
| `src/lib/storage.ts`                 | Rewrite | Async API-backed session functions    |
| `src/app/pre-send/page.tsx`          | Modify  | Await async saveSession/updateRating  |
| `src/app/reflect/page.tsx`           | Modify  | Await async saveSession/updateRating  |
| `src/app/real-time/page.tsx`         | Modify  | Await async saveSession (if added)    |
| `src/app/log/page.tsx`               | Modify  | Fetch sessions from API via useEffect |
| `src/app/trends/page.tsx`            | Create  | Progress Skill Trends with 6 charts   |
| `src/components/layout/Nav.tsx`      | Modify  | Add Skill Trends nav link             |
| `.env.local`                         | Modify  | Add MONGODB_URI                       |
| `package.json`                       | Modify  | Add mongodb + recharts deps           |

---

## Task 1: Install dependencies + add MONGODB_URI

**Files:**

- Modify: `package.json`
- Modify: `.env.local`

- [ ] **Step 1: Install packages**

```bash
cd /Users/max/Desktop/GitHub/workplace_wellbeing/.worktrees/v3-implementation
npm install mongodb recharts
```

Expected: both packages appear in `package.json` dependencies.

- [ ] **Step 2: Add MONGODB_URI to .env.local**

Open `.env.local` and add:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/CommCue?retryWrites=true&w=majority
```

Replace with your actual Atlas connection string. The database name `CommCue` will be created automatically on first write.

- [ ] **Step 3: Verify TypeScript still builds**

```bash
npm run build 2>&1 | tail -5
```

Expected: build passes, same routes as before.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add mongodb and recharts dependencies"
```

---

## Task 2: MongoDB client singleton

**Files:**

- Create: `src/lib/mongodb.ts`

- [ ] **Step 1: Create the file**

```typescript
// src/lib/mongodb.ts
import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not set in environment variables.');
}

const uri = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

async function createClient(): Promise<MongoClient> {
  const client = new MongoClient(uri);
  await client.connect();
  return client;
}

export async function getDb(): Promise<Db> {
  let client: MongoClient;

  if (process.env.NODE_ENV === 'development') {
    // Reuse connection across hot reloads in dev
    if (!global._mongoClient) {
      global._mongoClient = await createClient();
    }
    client = global._mongoClient;
  } else {
    client = await createClient();
  }

  return client.db('CommCue');
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "mongodb"
```

Expected: no errors for this file.

- [ ] **Step 3: Commit**

```bash
git add src/lib/mongodb.ts
git commit -m "feat: add MongoDB client singleton"
```

---

## Task 3: Sessions API routes

**Files:**

- Create: `src/app/api/sessions/route.ts`
- Create: `src/app/api/sessions/[id]/route.ts`

- [ ] **Step 1: Create GET + POST route**

```typescript
// src/app/api/sessions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import type { Session } from '@/types';

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection('sessions')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Strip MongoDB _id before returning
    const sessions = docs.map(({ _id, ...s }) => s) as Session[];
    return NextResponse.json({ sessions });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to fetch sessions.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<Session, 'id' | 'createdAt'>;
    const session: Session = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const db = await getDb();
    await db.collection('sessions').insertOne(session);
    return NextResponse.json({ id: session.id });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to save session.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create PATCH + DELETE route**

```typescript
// src/app/api/sessions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import type { SessionRating } from '@/types';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { rating } = (await req.json()) as { rating: SessionRating };
    const db = await getDb();
    await db.collection('sessions').updateOne({ id }, { $set: { rating } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to update rating.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const db = await getDb();
    await db.collection('sessions').deleteOne({ id });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to delete session.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep -E "sessions|mongodb" | head -10
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/sessions/
git commit -m "feat: add sessions API routes (GET, POST, PATCH, DELETE)"
```

---

## Task 4: Rewrite storage.ts

**Files:**

- Rewrite: `src/lib/storage.ts`

- [ ] **Step 1: Replace entire file**

```typescript
// src/lib/storage.ts
import type { Session, SessionRating } from '@/types';

export async function getSessions(): Promise<Session[]> {
  try {
    const res = await fetch('/api/sessions');
    if (!res.ok) return [];
    const data = await res.json();
    return (data.sessions ?? []) as Session[];
  } catch {
    return [];
  }
}

export async function saveSession(
  session: Omit<Session, 'id' | 'createdAt'>,
): Promise<string> {
  try {
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
    if (!res.ok) return '';
    const data = await res.json();
    return (data.id as string) ?? '';
  } catch {
    return '';
  }
}

export async function updateRating(
  sessionId: string,
  rating: SessionRating,
): Promise<void> {
  try {
    await fetch(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    });
  } catch {
    // fail silently
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  try {
    await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
  } catch {
    // fail silently
  }
}

export async function exportJSON(): Promise<string> {
  const sessions = await getSessions();
  return JSON.stringify(sessions, null, 2);
}
```

Note: the `"use client"` directive is removed — these are plain async fetch calls, usable anywhere.

- [ ] **Step 2: Verify build catches callers that need updating**

```bash
npx tsc --noEmit 2>&1 | grep -v "node_modules" | head -20
```

Expected: type errors in page components where `saveSession` / `getSessions` are called without `await`. Note which files need updating — Task 5 fixes them.

- [ ] **Step 3: Commit**

```bash
git add src/lib/storage.ts
git commit -m "feat: replace localStorage storage with async MongoDB API calls"
```

---

## Task 5: Update page components to await async storage

**Files:**

- Modify: `src/app/pre-send/page.tsx`
- Modify: `src/app/reflect/page.tsx`
- Modify: `src/app/log/page.tsx`

- [ ] **Step 1: Update pre-send page**

In `src/app/pre-send/page.tsx`:

1. Remove the dynamic import of `updateRating` — import it at the top:

```typescript
import { saveSession, updateRating } from '@/lib/storage';
```

2. In `handleSubmit`, `saveSession` is already called inside an `async` function — add `await`:

```typescript
// before:
const id = saveSession({ mode: "pre-send", message, ... });

// after:
const id = await saveSession({ mode: "pre-send", message, ... });
```

3. Update the `SelfRatingForm` onSubmit to use the top-level import:

```typescript
<SelfRatingForm
  onSubmit={(rating) => {
    updateRating(sessionId, rating);
  }}
/>
```

- [ ] **Step 2: Update reflect page**

In `src/app/reflect/page.tsx`, apply the same two changes:

1. Import `updateRating` at top (it's already imported from `@/lib/storage` — just ensure it's there):

```typescript
import { saveSession, updateRating } from '@/lib/storage';
```

2. Add `await` to `saveSession` call in `handleSubmit`:

```typescript
const id = await saveSession({ mode: "reflect", message, ... });
```

3. `SelfRatingForm` onSubmit — already calls `updateRating(sessionId, rating)` directly, no dynamic import needed since it's now a top-level import.

- [ ] **Step 3: Update log page to fetch from API**

Read the current `src/app/log/page.tsx` first, then rewrite the session-loading logic to use `useEffect`:

```typescript
// At top of component, replace any getSessions() call:
const [sessions, setSessions] = useState<Session[]>([]);
const [loadingLog, setLoadingLog] = useState(true);

useEffect(() => {
  getSessions().then((data) => {
    setSessions(data);
    setLoadingLog(false);
  });
}, []);
```

Also update the export button handler to await `exportJSON()`:

```typescript
async function handleExport() {
  const json = await exportJSON();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'CommCue-sessions.json';
  a.click();
  URL.revokeObjectURL(url);
}
```

And update `deleteSession` calls to await:

```typescript
await deleteSession(id);
setSessions((prev) => prev.filter((s) => s.id !== id));
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -10
```

Expected: clean build, all 6 routes present including `/api/sessions` and `/api/sessions/[id]`.

- [ ] **Step 5: Commit**

```bash
git add src/app/pre-send/page.tsx src/app/reflect/page.tsx src/app/log/page.tsx
git commit -m "feat: update pages to use async MongoDB-backed storage"
```

---

## Task 6: Skill Trends page

**Files:**

- Create: `src/app/trends/page.tsx`

- [ ] **Step 1: Create the Skill Trends page**

```typescript
// src/app/trends/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getSessions } from "@/lib/storage";
import { DIMENSIONS } from "@/lib/dimensions";
import type { Session, DimensionId } from "@/types";
import PageHeader from "@/components/layout/PageHeader";

// Dimension color map (matches DimensionScores component)
const CHART_COLOR: Record<DimensionId, string> = {
  clarity: "#ec4899",
  accuracy: "#ec4899",
  conciseness: "#3b82f6",
  professionalism: "#3b82f6",
  compassion: "#f97316",
  supportiveness: "#f97316",
};

/** Returns Monday of the ISO week containing `date` as a timestamp */
function weekStart(date: Date): number {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

interface RawPoint { date: number; score: number }
interface WeeklyPoint { date: number; avg: number }

function buildChartData(
  sessions: Session[],
  dimId: DimensionId
): { raw: RawPoint[]; weekly: WeeklyPoint[] } {
  const scored = sessions
    .filter((s) => s.result.dimension_scores?.[dimId] !== undefined)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const raw: RawPoint[] = scored.map((s) => ({
    date: new Date(s.createdAt).getTime(),
    score: s.result.dimension_scores![dimId],
  }));

  // Group by week start
  const weekMap = new Map<number, number[]>();
  scored.forEach((s) => {
    const wk = weekStart(new Date(s.createdAt));
    if (!weekMap.has(wk)) weekMap.set(wk, []);
    weekMap.get(wk)!.push(s.result.dimension_scores![dimId]);
  });

  const weekly: WeeklyPoint[] = Array.from(weekMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([date, scores]) => ({
      date,
      avg: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
    }));

  return { raw, weekly };
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface DimChartProps {
  sessions: Session[];
  dimId: DimensionId;
  label: string;
  color: string;
}

function DimChart({ sessions, dimId, label, color }: DimChartProps) {
  const { raw, weekly } = buildChartData(sessions, dimId);

  if (raw.length < 2) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-5 py-6">
        <p className="text-xs font-semibold text-gray-600 mb-3">{label}</p>
        <p className="text-xs text-gray-400">Not enough data yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-5 py-4">
      <p className="text-xs font-semibold text-gray-600 mb-3">{label}</p>
      <ResponsiveContainer width="100%" height={160}>
        <ComposedChart margin={{ top: 4, right: 8, bottom: 4, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatDate}
            tick={{ fontSize: 10 }}
            tickCount={4}
          />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10 }} />
          <Tooltip
            formatter={(val: number) => [val, ""]}
            labelFormatter={(ts: number) => formatDate(ts)}
          />
          {/* Individual session dots */}
          <Scatter data={raw} dataKey="score" fill={color} opacity={0.6} />
          {/* Weekly average trend line */}
          <Line
            data={weekly}
            dataKey="avg"
            stroke={color}
            strokeWidth={2}
            dot={false}
            type="monotone"
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Skill TrendsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessions().then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  const scoredCount = sessions.filter((s) => s.result.dimension_scores).length;
  const thisWeek = sessions.filter((s) => {
    const wk = weekStart(new Date(s.createdAt));
    return wk === weekStart(new Date());
  }).length;

  const modeCounts = sessions.reduce<Record<string, number>>((acc, s) => {
    acc[s.mode] = (acc[s.mode] ?? 0) + 1;
    return acc;
  }, {});
  const topMode = Object.entries(modeCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "—";
  const topModeLabel: Record<string, string> = {
    "pre-send": "Pre-send",
    "real-time": "Real-time",
    reflect: "Reflect",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress Skill Trends"
        subtitle="Track how your communication quality improves over time across all six dimensions."
      />

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total sessions", value: sessions.length },
          { label: "This week", value: thisWeek },
          { label: "Most-used mode", value: topModeLabel[topMode] ?? topMode },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-200 bg-white px-5 py-4 text-center">
            <p className="text-2xl font-semibold text-gray-900">{loading ? "—" : stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && scoredCount < 2 && (
        <div className="rounded-lg border border-gray-200 bg-white px-5 py-8 text-center">
          <p className="text-sm text-gray-500">
            Complete at least 2 <strong>Post-reflection</strong> sessions to start tracking your dimension scores.
          </p>
        </div>
      )}

      {/* Charts grid */}
      {scoredCount >= 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DIMENSIONS.map((dim) => (
            <DimChart
              key={dim.id}
              sessions={sessions}
              dimId={dim.id}
              label={dim.label}
              color={CHART_COLOR[dim.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "Skill Trends" | head -10
```

Expected: no errors for this file.

- [ ] **Step 3: Commit**

```bash
git add src/app/trends/page.tsx
git commit -m "feat: add progress Skill Trends with dimension score charts"
```

---

## Task 7: Add Skill Trends to navigation

**Files:**

- Modify: `src/components/layout/Nav.tsx`

- [ ] **Step 1: Add Skill Trends link**

In `src/components/layout/Nav.tsx`, update `NAV_LINKS`:

```typescript
const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/pre-send', label: 'Pre-send' },
  { href: '/real-time', label: 'Real-time' },
  { href: '/reflect', label: 'Reflect' },
  { href: '/log', label: 'Session Log' },
  { href: '/trends', label: 'Skill Trends' },
];
```

- [ ] **Step 2: Final build verification**

```bash
npm run build 2>&1 | tail -15
```

Expected: all 7 routes present: `/`, `/pre-send`, `/real-time`, `/reflect`, `/log`, `/trends`, `/api/analyze`, `/api/sessions`, `/api/sessions/[id]`. Zero TypeScript errors.

- [ ] **Step 3: Final commit**

```bash
git add src/components/layout/Nav.tsx
git commit -m "feat: add Skill Trends link to navigation"
```

---

## Verification Checklist

1. `MONGODB_URI` configured → dev server starts without "MONGODB_URI is not set" error
2. Submit a pre-send analysis → session appears in `/log` after refresh (from MongoDB)
3. Submit a post-reflection analysis → session has dimension scores (1–5)
4. Rate a session → rating persists after page refresh
5. `/trends` loads with summary row (total sessions, this week, top mode)
6. After 2+ reflect sessions → all 6 dimension charts show dots + trend line
7. Fewer than 2 scored sessions → empty state message shown
8. Export from `/log` → downloads valid JSON from MongoDB data
9. `npm run build` passes with zero TypeScript errors
