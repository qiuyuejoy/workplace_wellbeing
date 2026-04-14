"use client";

import { useState } from "react";
import type {
  AudienceType,
  DimensionId,
  FeedbackResult,
  FeedbackStyle,
  InterventionMode,
  MessageIntent,
  SeedScenario,
} from "@/types";
import { saveSession, updateRating } from "@/lib/storage";
import PageHeader from "@/components/layout/PageHeader";
import ContextPanel from "@/components/controls/ContextPanel";
import MessageInput from "@/components/input/MessageInput";
import SeedScenarios from "@/components/input/SeedScenarios";
import FeedbackCard from "@/components/feedback/FeedbackCard";
import SelfRatingForm from "@/components/rating/SelfRatingForm";

export default function ReflectPage() {
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [dimensions, setDimensions] = useState<DimensionId[]>(["compassion", "sincerity"]);
  const [audience, setAudience] = useState<AudienceType>("peer");
  const [customAudience, setCustomAudience] = useState("");
  const [intent, setIntent] = useState<MessageIntent>("check_in");
  const [feedbackStyle, setFeedbackStyle] = useState<FeedbackStyle>("balanced");
  const [interventionMode, setInterventionMode] = useState<InterventionMode>("gentle");

  const [result, setResult] = useState<FeedbackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  function handleSeedSelect(scenario: SeedScenario) {
    setMessage(scenario.message);
    setDimensions(scenario.dimensions);
    setAudience(scenario.audience);
    setIntent(scenario.intent);
    setResult(null);
    setError(null);
    setSessionId(null);
  }

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  async function handleSubmit() {
    if (!message.trim() && images.length === 0) {
      setError("Please paste a message or upload a screenshot to reflect on.");
      return;
    }
    if (dimensions.length === 0) {
      setError("Please select at least one communication dimension.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSessionId(null);

    try {
      const base64Images = await Promise.all(images.map(toBase64));

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "reflect",
          message,
          images: base64Images.length > 0 ? base64Images : undefined,
          dimensions,
          audience,
          customAudience: audience === "custom" ? customAudience : undefined,
          intent,
          feedbackStyle,
          interventionMode,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setResult(data.result);

      const id = await saveSession({
        mode: "reflect",
        message,
        dimensions,
        audience,
        customAudience: audience === "custom" ? customAudience : undefined,
        intent,
        feedbackStyle,
        interventionMode,
        result: data.result,
      });
      setSessionId(id);
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Post-hoc Reflection"
        subtitle="Paste a message or short conversation you already sent. Get reflective feedback on what worked and what to try next time."
      />

      <SeedScenarios mode="reflect" onSelect={handleSeedSelect} />

      <MessageInput
        value={message}
        onChange={setMessage}
        placeholder={"Paste your sent message here, or a short conversation:\n\nYou: ...\nThem: ...\nYou: ..."}
        label="Sent Message or Conversation"
        minRows={10}
        images={images}
        onImagesChange={setImages}
      />

      <ContextPanel
        dimensions={dimensions}
        onDimensionsChange={setDimensions}
        audience={audience}
        onAudienceChange={setAudience}
        customAudience={customAudience}
        onCustomAudienceChange={setCustomAudience}
        intent={intent}
        onIntentChange={setIntent}
        feedbackStyle={feedbackStyle}
        onFeedbackStyleChange={setFeedbackStyle}
        interventionMode={interventionMode}
        onInterventionModeChange={setInterventionMode}
      />

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
          loading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-900 text-white hover:bg-gray-700"
        }`}
      >
        {loading ? "Reflecting..." : "Reflect on Communication"}
      </button>

      {loading && (
        <div className="rounded-lg border border-gray-200 bg-white px-5 py-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Reflecting on your communication...
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-4">
          <FeedbackCard result={result} originalMessage={message} />
          {sessionId && (
            <SelfRatingForm
              onSubmit={(rating) => {
                updateRating(sessionId, rating);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
