import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, topic, tone, model, content } = body;

    if (!id && !topic) {
      return NextResponse.json(
        { success: false, error: "Content ID or topic is required to save." },
        { status: 400 }
      );
    }

    const savedItem = {
      id: id || `save-${Date.now()}`,
      topic: topic || "Untitled Content",
      tone: tone || "Professional",
      model: model || "Google Gemini 1.5 Pro",
      content: content || "",
      savedAt: new Date().toISOString(),
      status: "Saved"
    };

    return NextResponse.json({
      success: true,
      message: "Content successfully saved to workspace history.",
      item: savedItem
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to save content.";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
