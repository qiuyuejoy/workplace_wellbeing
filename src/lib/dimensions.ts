import type { Dimension, DimensionId } from "@/types";

export const DIMENSIONS: Dimension[] = [
  {
    id: "clarity",
    label: "Clarity",
    description: "Is the message easy to understand with no ambiguity?",
    color: "rose",
    promptInstruction:
      "Assess whether the message is clear and unambiguous. Flag vague language, unclear references, or anything that could be misread.",
  },
  {
    id: "accuracy",
    label: "Accuracy",
    description: "Are facts, details, and references correct and specific?",
    color: "rose",
    promptInstruction:
      "Check for vague quantifiers, unverified claims, undefined timelines, or missing specifics that affect accuracy.",
  },
  {
    id: "professionalism",
    label: "Professionalism",
    description: "Does the tone suit the context and relationship?",
    color: "blue",
    promptInstruction:
      "Evaluate whether the tone, word choice, and framing are appropriate for the audience and workplace context. Flag slang, sarcasm, or formality mismatches.",
  },

  {
    id: "responsibility",
    label: "Responsibility",
    description: "Does the message convey clear ownership, accountability, and next steps?",
    color: "blue",
    promptInstruction:
      "Evaluate whether ownership is explicitly stated, next steps are concrete, and commitments are specific rather than passive or vague.",
  },
  {
    id: "compassion",
    label: "Compassion",
    description: "Does the message acknowledge the recipient's perspective or emotional state?",
    color: "amber",
    promptInstruction:
      "Consider whether the message recognizes the recipient's feelings or situation and demonstrates perspective-taking rather than being purely transactional.",
  },
    {
    id: "sincerity",
    label: "Sincerity",
    description: "Does the message feel genuine rather than scripted or performative?",
    color: "amber",
    promptInstruction:
      "Assess whether the message feels authentic and aligned with its stated intent. Flag manipulation, performative politeness, or hollow phrases.",
  },
];

export const DIMENSION_MAP: Record<DimensionId, Dimension> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.id, d])
) as Record<DimensionId, Dimension>;

export function getDimension(id: DimensionId): Dimension {
  return DIMENSION_MAP[id];
}
