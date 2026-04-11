"use client";

import { useState } from "react";
import type { AudienceType, DimensionId, FeedbackStyle, InterventionMode, MessageIntent } from "@/types";
import AudienceSelect from "./AudienceSelect";
import IntentSelect from "./IntentSelect";
import FeedbackStyleToggle from "./FeedbackStyleToggle";
import InterventionToggle from "./InterventionToggle";
import DimensionSelector from "./DimensionSelector";

interface Props {
  dimensions: DimensionId[];
  onDimensionsChange: (v: DimensionId[]) => void;
  audience: AudienceType;
  onAudienceChange: (v: AudienceType) => void;
  customAudience: string;
  onCustomAudienceChange: (v: string) => void;
  intent: MessageIntent;
  onIntentChange: (v: MessageIntent) => void;
  feedbackStyle: FeedbackStyle;
  onFeedbackStyleChange: (v: FeedbackStyle) => void;
  interventionMode: InterventionMode;
  onInterventionModeChange: (v: InterventionMode) => void;
}

export default function ContextPanel(props: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <span>Context & Preferences</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-200">
          <div className="pt-4">
            <DimensionSelector
              selected={props.dimensions}
              onChange={props.onDimensionsChange}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AudienceSelect
              value={props.audience}
              customValue={props.customAudience}
              onChange={props.onAudienceChange}
              onCustomChange={props.onCustomAudienceChange}
            />
            <IntentSelect value={props.intent} onChange={props.onIntentChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeedbackStyleToggle
              value={props.feedbackStyle}
              onChange={props.onFeedbackStyleChange}
            />
            <InterventionToggle
              value={props.interventionMode}
              onChange={props.onInterventionModeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
