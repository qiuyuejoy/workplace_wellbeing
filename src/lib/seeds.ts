import type { SeedScenario } from "@/types";

export const SEED_SCENARIOS: SeedScenario[] = [
  {
    id: "delayed-update",
    label: "Ask for delayed update",
    mode: "pre-send",
    message:
      "Hey, just wanted to check in on the status of the API integration. It was supposed to be done by end of last week and I haven't heard anything. Can you give me an update on where things stand and when we can expect it to be finished?",
    dimensions: ["accuracy", "clarity", "compassion"],
    audience: "peer",
    intent: "request",
  },
  {
    id: "direct-report-feedback",
    label: "Feedback to direct report",
    mode: "pre-send",
    message:
      "I wanted to share some feedback about the presentation you gave yesterday. I thought the data section was really strong and showed a lot of preparation. One area to work on is the structure — the flow between sections felt a bit disjointed, which made it harder to follow the narrative. For next time, try mapping out the key takeaways first and building each section toward them. Happy to work through it together before your next one.",
    dimensions: ["supportiveness", "compassion", "professionalism"],
    audience: "direct_report",
    intent: "feedback",
  },
  {
    id: "vague-ownership",
    label: "Clarify task ownership",
    mode: "pre-send",
    message:
      "Following up on yesterday's meeting — I want to make sure we're on the same page about who's handling the client onboarding documentation. I thought it was assigned to the product team but it sounds like it might be on our side. Can we clarify who owns this and set a deadline? We need it done before the launch next month.",
    dimensions: ["clarity", "accuracy"],
    audience: "cross_functional",
    intent: "clarification",
  },
  {
    id: "frustrated-coworker",
    label: "Respond to frustrated colleague",
    mode: "reflect",
    message:
      "Alex: I've been waiting two weeks for that data export and nothing. Every time I ask I get 'it's being processed.' This is blocking my whole quarter.\n\nMe: I hear you, that's frustrating. The data team has been slammed but I'll escalate this today and get you a concrete date by EOD.",
    dimensions: ["compassion", "supportiveness", "clarity"],
    audience: "peer",
    intent: "conflict_repair",
  },
  {
    id: "check-in",
    label: "Supportive check-in",
    mode: "pre-send",
    message:
      "Hi Jamie, just wanted to check in. I know the past few weeks have been a lot with the reorg and the new project hitting at the same time. How are you doing with the workload? If anything needs to shift or you need support, I want to make sure we figure that out together. No pressure to have it all sorted — just wanted to open the door.",
    dimensions: ["supportiveness", "compassion"],
    audience: "direct_report",
    intent: "check_in",
  },
];
