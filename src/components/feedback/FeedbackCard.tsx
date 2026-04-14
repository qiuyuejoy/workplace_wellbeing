import type { FeedbackResult } from "@/types";
import SummaryBanner from "./SummaryBanner";
import DimensionScores from "./DimensionScores";
import StrengthsSection from "./StrengthsSection";
import IssuesSection from "./IssuesSection";
import SuggestionsSection from "./SuggestionsSection";
import RewritePanel from "./RewritePanel";
import NextTimeTips from "./NextTimeTips";
import ConfidenceNote from "./ConfidenceNote";

interface Props {
  result: FeedbackResult;
  originalMessage: string;
}

export default function FeedbackCard({ result, originalMessage }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">Feedback</h2>
      </div>

      <div className="px-5 py-4 space-y-5">
        <SummaryBanner summary={result.summary} />

        {result.dimension_scores && (
          <DimensionScores dimensionScores={result.dimension_scores} />
        )}

        {result.strengths.length > 0 && <StrengthsSection strengths={result.strengths} />}
        {result.issues.length > 0 && <IssuesSection issues={result.issues} />}
        {result.suggestions.length > 0 && <SuggestionsSection suggestions={result.suggestions} />}

        <RewritePanel original={originalMessage} rewrite={result.optional_rewrite} />

        {result.next_time_tips.length > 0 && <NextTimeTips tips={result.next_time_tips} />}
        <ConfidenceNote note={result.confidence_notes} />
      </div>
    </div>
  );
}
