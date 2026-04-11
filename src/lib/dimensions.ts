import type { Dimension, DimensionId } from "@/types";

export const DIMENSIONS: Dimension[] = [
  {
    id: "supportiveness",
    label: "Supportiveness",
    description: "Does the message acknowledge the recipient's situation and convey care?",
    color: "green",
    promptInstruction:
      "Look for whether the message acknowledges the recipient's situation, offers help, or conveys care without being patronizing.",
  },
  {
    id: "precision",
    label: "Precision / Specificity",
    description: "Are details, timelines, and references clear and unambiguous?",
    color: "blue",
    promptInstruction:
      "Look for vague quantifiers, unclear timelines, undefined pronouns, or missing specifics. Flag only what makes the message ambiguous.",
  },
  {
    id: "clarity_of_expectations",
    label: "Clarity of Expectations",
    description: "Is it clear what is being asked, who owns it, and what success looks like?",
    color: "purple",
    promptInstruction:
      "Identify whether any requests, deadlines, or action items are clear, who owns what, and what success looks like.",
  },
  {
    id: "empathy",
    label: "Empathy",
    description: "Does the message consider the recipient's perspective or emotional state?",
    color: "rose",
    promptInstruction:
      "Consider whether the message acknowledges the recipient's perspective or emotional state. Note tone that may land poorly given the audience.",
  },
  {
    id: "constructive_feedback",
    label: "Constructive Feedback",
    description: "Is criticism specific, behavior-focused, and paired with a path forward?",
    color: "amber",
    promptInstruction:
      "When the message contains feedback or criticism, assess whether it is specific, separates behavior from identity, and offers a path forward.",
  },
];

export const DIMENSION_MAP: Record<DimensionId, Dimension> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.id, d])
) as Record<DimensionId, Dimension>;

export function getDimension(id: DimensionId): Dimension {
  return DIMENSION_MAP[id];
}
