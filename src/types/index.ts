export type DimensionId =
  | "clarity"
  | "accuracy"
  | "conciseness"
  | "professionalism"
  | "compassion"
  | "supportiveness";

export interface Dimension {
  id: DimensionId;
  label: string;
  description: string;
  color: string; // tailwind color name e.g. "blue"
  promptInstruction: string;
}

export type AudienceType =
  | "peer"
  | "manager"
  | "direct_report"
  | "cross_functional"
  | "client"
  | "custom";

export type MessageIntent =
  | "request"
  | "update"
  | "feedback"
  | "clarification"
  | "check_in"
  | "conflict_repair"
  | "other";

export type FeedbackStyle = "concise" | "balanced" | "detailed";

export type InterventionMode = "gentle" | "direct";

export interface AnalyzeRequest {
  mode: "pre-send" | "reflect";
  message: string;
  images?: string[]; // base64 data URLs — message OR images (or both) must be present
  dimensions: DimensionId[];
  audience: AudienceType;
  customAudience?: string;
  intent: MessageIntent;
  feedbackStyle: FeedbackStyle;
  interventionMode: InterventionMode;
}

export interface FeedbackPoint {
  text: string;
  dimensions: DimensionId[];
}

export interface FeedbackResult {
  summary: string;
  strengths: FeedbackPoint[];
  issues: FeedbackPoint[];
  suggestions: FeedbackPoint[];
  optional_rewrite: string | null;
  next_time_tips: string[];
  confidence_notes: string | null;
  dimension_scores?: Partial<Record<DimensionId, number>>;
}

export interface SessionRating {
  usefulness: number; // 1–5
  relevance: number;  // 1–5
  wouldApply: boolean;
  ratedAt: string;    // ISO timestamp
}

export interface Session {
  id: string;
  createdAt: string;
  mode: "pre-send" | "reflect";
  message: string;
  dimensions: DimensionId[];
  audience: AudienceType;
  customAudience?: string;
  intent: MessageIntent;
  feedbackStyle: FeedbackStyle;
  interventionMode: InterventionMode;
  result: FeedbackResult;
  rating?: SessionRating;
}

export interface SeedScenario {
  id: string;
  label: string;
  mode: "pre-send" | "reflect";
  message: string;
  dimensions: DimensionId[];
  audience: AudienceType;
  intent: MessageIntent;
}
