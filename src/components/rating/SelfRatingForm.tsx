"use client";

import { useState } from "react";
import type { SessionRating } from "@/types";

interface Props {
  onSubmit: (rating: SessionRating) => void;
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-xl transition-colors ${
            star <= value ? "text-amber-400" : "text-gray-200 hover:text-amber-200"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function SelfRatingForm({ onSubmit }: Props) {
  const [usefulness, setUsefulness] = useState(0);
  const [relevance, setRelevance] = useState(0);
  const [wouldApply, setWouldApply] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (usefulness === 0 || relevance === 0 || wouldApply === null) return;
    onSubmit({
      usefulness,
      relevance,
      wouldApply,
      ratedAt: new Date().toISOString(),
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <p className="text-sm text-gray-500 text-center">Thanks for your rating.</p>
      </div>
    );
  }

  const canSubmit = usefulness > 0 && relevance > 0 && wouldApply !== null;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Rate this feedback
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Usefulness</span>
          <StarRating value={usefulness} onChange={setUsefulness} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Relevance</span>
          <StarRating value={relevance} onChange={setRelevance} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Would apply this advice?</span>
          <div className="flex gap-2">
            {[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ].map(({ label, value }) => (
              <button
                key={label}
                type="button"
                onClick={() => setWouldApply(value)}
                className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                  wouldApply === value
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-2 rounded-md text-xs font-medium transition-colors ${
            canSubmit
              ? "bg-gray-900 text-white hover:bg-gray-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Save rating
        </button>
      </div>
    </div>
  );
}
