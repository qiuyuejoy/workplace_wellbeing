import type { Dimension, DimensionId } from "@/types";

export const DIMENSIONS: Dimension[] = [
  {
    id: "clarity",
    label: "Clarity",
    description: "Is the message easy to understand with no ambiguity?",
    color: "pink",
    promptInstruction:
      "Assess whether the message is clear and unambiguous. Flag vague language, unclear references, or anything that could be misread.",
  },
  {
    id: "accuracy",
    label: "Accuracy",
    description: "Are facts, details, and references correct and specific?",
    color: "pink",
    promptInstruction:
      "Check for vague quantifiers, unverified claims, undefined timelines, or missing specifics that affect accuracy.",
  },
  {
    id: "conciseness",
    label: "Conciseness",
    description: "Is the message appropriately brief without losing meaning?",
    color: "blue",
    promptInstruction:
      "Identify unnecessary repetition, filler phrases, or over-explanation. Flag only what genuinely reduces impact.",
  },
  {
    id: "professionalism",
    label: "Professionalism",
    description: "Does the tone suit the context and relationship?",
    color: "blue",
    promptInstruction:
      "Evaluate whether the tone, word choice, and framing are appropriate for the audience and workplace context.",
  },
  {
    id: "compassion",
    label: "Compassion",
    description: "Does the message consider the recipient's perspective or emotional state?",
    color: "orange",
    promptInstruction:
      "Consider whether the message acknowledges the recipient's perspective or emotional state. Note tone that may land poorly given the audience.",
  },
  {
    id: "supportiveness",
    label: "Supportiveness",
    description: "Does the message acknowledge the recipient's situation and convey care?",
    color: "orange",
    promptInstruction:
      "Look for whether the message acknowledges the recipient's situation, offers help, or conveys care without being patronizing.",
  },
];

export const DIMENSION_MAP: Record<DimensionId, Dimension> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.id, d])
) as Record<DimensionId, Dimension>;

export function getDimension(id: DimensionId): Dimension {
  return DIMENSION_MAP[id];
}
