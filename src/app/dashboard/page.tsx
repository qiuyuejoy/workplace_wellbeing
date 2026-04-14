"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ComposedChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PageHeader from "@/components/layout/PageHeader";
import { getLocalSessions, getSessions } from "@/lib/storage";
import { DIMENSIONS } from "@/lib/dimensions";
import type { Session, DimensionId } from "@/types";

// ── helpers ────────────────────────────────────────────────────────────────

function getISOWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function currentISOWeek(): string {
  return getISOWeek(new Date());
}

// ── stat card ──────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-4">
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

// ── dimension color map (tailwind → hex for recharts) ──────────────────────

const COLOR_HEX: Record<string, string> = {
  green: "#22c55e",
  blue: "#3b82f6",
  purple: "#a855f7",
  rose: "#f43f5e",
  amber: "#f59e0b",
  pink: "#ec4899",
  orange: "#f97316",
};

// ── types ──────────────────────────────────────────────────────────────────

interface ChartPoint {
  x: number;    // timestamp ms
  y: number;    // score 1–5
  label: string; // display date for tooltip
}

interface WeekAvgPoint {
  x: number;   // midpoint timestamp of the week's sessions
  avg: number;
}

// ── custom tooltip ─────────────────────────────────────────────────────────

function ScoreTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const pt = payload[0].payload;
  return (
    <div className="rounded border border-gray-200 bg-white px-2 py-1.5 text-xs shadow">
      <p className="font-medium text-gray-800">{pt.label}</p>
      <p className="text-gray-600">Score: {pt.y}</p>
    </div>
  );
}

// ── dimension chart ────────────────────────────────────────────────────────

function DimensionChart({
  label,
  color,
  dots,
  weeklyAvg,
}: {
  label: string;
  color: string;
  dots: ChartPoint[];
  weeklyAvg: WeekAvgPoint[];
}) {
  const hex = COLOR_HEX[color] ?? "#6b7280";

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 pt-4 pb-2">
      <p className="mb-2 text-sm font-semibold text-gray-800">{label}</p>
      <ResponsiveContainer width="100%" height={140}>
        <ComposedChart>
          <XAxis
            dataKey="x"
            type="number"
            scale="time"
            domain={["auto", "auto"]}
            tickFormatter={(v: number) =>
              new Date(v).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            }
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={20}
          />
          <Tooltip content={<ScoreTooltip />} />
          <Scatter data={dots} dataKey="y" fill={hex} opacity={0.75} />
          <Line
            data={weeklyAvg}
            type="monotone"
            dataKey="avg"
            stroke={hex}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── main page ──────────────────────────────────────────────────────────────

export default function SkillTrendsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Show localStorage data immediately, then update when API responds
    setSessions(getLocalSessions());
    getSessions().then(setSessions);
  }, []);

  // summary stats
  const stats = useMemo(() => {
    const total = sessions.length;
    const thisWeek = sessions.filter(
      (s) => getISOWeek(new Date(s.createdAt)) === currentISOWeek()
    ).length;

    const modeCounts: Record<string, number> = {};
    for (const s of sessions) {
      modeCounts[s.mode] = (modeCounts[s.mode] ?? 0) + 1;
    }
    let topMode = "—";
    if (total > 0) {
      const top = Object.entries(modeCounts).sort((a, b) => b[1] - a[1])[0][0];
      topMode = top === "pre-send" ? "Pre-send" : "Reflect";
    }

    return { total, thisWeek, topMode };
  }, [sessions]);

  // sessions with dimension_scores (both modes return scores)
  const scoredSessions = useMemo(
    () => sessions.filter((s) => s.result.dimension_scores),
    [sessions]
  );

  // per-dimension chart data
  const chartDataMap = useMemo(() => {
    const result = {} as Record<DimensionId, { dots: ChartPoint[]; weeklyAvg: WeekAvgPoint[] }>;

    for (const dim of DIMENSIONS) {
      // collect dots
      const dots: ChartPoint[] = [];
      for (const s of scoredSessions) {
        const entry = s.result.dimension_scores?.[dim.id];
        if (entry == null) continue;
        const score = typeof entry === "object" ? entry.score : entry;
        const ts = new Date(s.createdAt).getTime();
        dots.push({
          x: ts,
          y: score,
          label: new Date(s.createdAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        });
      }

      // group by ISO week → compute average + midpoint timestamp
      const weekData = new Map<string, { ts: number[]; scores: number[] }>();
      for (const dot of dots) {
        const wk = getISOWeek(new Date(dot.x));
        const entry = weekData.get(wk) ?? { ts: [], scores: [] };
        entry.ts.push(dot.x);
        entry.scores.push(dot.y);
        weekData.set(wk, entry);
      }

      const weeklyAvg: WeekAvgPoint[] = Array.from(weekData.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, { ts, scores }]) => ({
          x: Math.round(ts.reduce((s, v) => s + v, 0) / ts.length),
          avg: Math.round((scores.reduce((s, v) => s + v, 0) / scores.length) * 10) / 10,
        }));

      result[dim.id] = { dots, weeklyAvg };
    }

    return result;
  }, [scoredSessions]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Trends"
        subtitle="Track your communication skill development over time."
      />

      {/* summary row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Total sessions" value={String(stats.total)} />
        <StatCard label="This week" value={String(stats.thisWeek)} />
        <StatCard label="Most-used mode" value={stats.topMode} />
      </div>

      {/* dimension score charts */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-800">Dimension Score Trends</h2>

        {scoredSessions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
            <p className="text-sm text-gray-500">
              Complete a session to start tracking your dimension scores.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {DIMENSIONS.map((dim) => {
              const { dots, weeklyAvg } = chartDataMap[dim.id] ?? {
                dots: [],
                weeklyAvg: [],
              };
              return (
                <DimensionChart
                  key={dim.id}
                  label={dim.label}
                  color={dim.color}
                  dots={dots}
                  weeklyAvg={weeklyAvg}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
