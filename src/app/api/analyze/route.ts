import { NextRequest, NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropicClient } from "@/lib/anthropic";
import { buildSystemPrompt } from "@/lib/prompts";
import type { AnalyzeRequest, FeedbackResult } from "@/types";

export async function POST(req: NextRequest) {
  let body: AnalyzeRequest;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { mode, message, images, dimensions, audience, intent, feedbackStyle, interventionMode } = body;

  const hasText = message && message.trim().length > 0;
  const hasImages = Array.isArray(images) && images.length > 0;
  if (!hasText && !hasImages) {
    return NextResponse.json({ error: "Provide a message or upload at least one screenshot." }, { status: 400 });
  }
  if (!dimensions || dimensions.length === 0) {
    return NextResponse.json({ error: "Select at least one communication dimension." }, { status: 400 });
  }
  if (!mode || !["pre-send", "reflect"].includes(mode)) {
    return NextResponse.json({ error: "Invalid mode." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured. Add it to .env.local." },
      { status: 500 }
    );
  }

  const systemPrompt = buildSystemPrompt(body);

  try {
    const client = getAnthropicClient();

    const userContent: Anthropic.MessageParam["content"] = [];

    // Add image blocks first so Claude sees them before the text prompt
    for (const dataUrl of images ?? []) {
      const commaIdx = dataUrl.indexOf(",");
      const header = dataUrl.slice(0, commaIdx);
      const data = dataUrl.slice(commaIdx + 1);
      const mediaType = (header.match(/:(.*?);/)?.[1] ?? "image/jpeg") as
        | "image/jpeg"
        | "image/png"
        | "image/gif"
        | "image/webp";
      userContent.push({ type: "image", source: { type: "base64", media_type: mediaType, data } });
    }

    const modeLabel = mode === "pre-send" ? "draft message" : "sent message / conversation";
    const textPrompt = hasImages
      ? `Please extract the message text from the image(s) above and analyze it as the ${modeLabel}.${hasText ? ` Additional context from the user:\n\n${message.trim()}` : ""}`
      : `Please analyze the following ${modeLabel}:\n\n${message.trim()}`;
    userContent.push({ type: "text", text: textPrompt });

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No text response from model." }, { status: 500 });
    }

    let result: FeedbackResult;
    try {
      const text = textBlock.text;
      // Try extracting from a code fence first, then fall back to first { ... last }
      const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
      const raw = fenceMatch
        ? fenceMatch[1].trim()
        : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1).trim();
      result = JSON.parse(raw) as FeedbackResult;
    } catch {
      console.error("[analyze] Raw model output:", textBlock.text.slice(0, 500));
      return NextResponse.json(
        { error: "Model returned malformed JSON. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ result });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("[analyze] API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
