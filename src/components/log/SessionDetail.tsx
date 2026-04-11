import type { Session } from "@/types";
import FeedbackCard from "@/components/feedback/FeedbackCard";

interface Props {
  session: Session;
}

export default function SessionDetail({ session }: Props) {
  return (
    <div className="px-4 py-4 space-y-4">
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
          Original Message
        </p>
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded px-3 py-2 border border-gray-100">
          {session.message}
        </p>
      </div>

      <FeedbackCard result={session.result} originalMessage={session.message} />

      {session.rating && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Your Rating
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <span>Usefulness: {"★".repeat(session.rating.usefulness)}{"☆".repeat(5 - session.rating.usefulness)}</span>
            <span>Relevance: {"★".repeat(session.rating.relevance)}{"☆".repeat(5 - session.rating.relevance)}</span>
            <span>Would apply: {session.rating.wouldApply ? "Yes" : "No"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
