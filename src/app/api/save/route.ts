import { NextResponse } from "next/server";
import { addHistoryItem, updateHistoryStatus, getHistoryStore } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, topic, tone, model, provider, content, title } = body;

    if (!id && !topic) {
      return NextResponse.json(
        { success: false, error: "Content ID or topic is required to save." },
        { status: 400 }
      );
    }

    const targetId = id || `save-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const existingStore = getHistoryStore();
    const existing = existingStore.find((i) => i.id === targetId);

    let savedItem;

    if (existing) {
      savedItem = updateHistoryStatus(targetId, "Saved", {
        savedAt: timestamp,
        topic: topic || existing.topic,
        tone: tone || existing.tone,
        model: model || existing.model,
        content: content || existing.content,
      });
    } else {
      const words = (content || "").trim().split(/\s+/).filter(Boolean).length;
      const readTimeMinutes = Math.max(1, Math.ceil(words / 200));
      const displayTitle =
        title || (topic ? (topic.length > 45 ? `${topic.slice(0, 45)}...` : topic) : "Saved Content");

      savedItem = addHistoryItem({
        id: targetId,
        title: displayTitle,
        topic: topic || "Untitled Topic",
        tone: tone || "Professional",
        model: model || "Gemini 1.5 Pro",
        provider: provider || "gemini",
        date: "Just now",
        content: content || "",
        wordCount: words,
        readTime: `~${readTimeMinutes} min read`,
        status: "Saved",
        savedAt: timestamp,
        createdAt: timestamp,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Content successfully saved to workspace history.",
      item: savedItem,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to save content.";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
