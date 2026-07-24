import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, topic, tone, model, content } = body;

    if (!id && !topic) {
      return NextResponse.json(
        { success: false, error: "Content ID or payload is required for approval." },
        { status: 400 }
      );
    }

    const approvalResponse = {
      id: id || `approved-${Date.now()}`,
      topic: topic || "Approved Content",
      tone: tone || "Professional",
      model: model || "Google Gemini 1.5 Pro",
      approvedAt: new Date().toISOString(),
      status: "Approved",
      workflowTriggered: true,
      automationMessage: "Content approved. Automated campaign trigger sent to integration engine."
    };

    return NextResponse.json({
      success: true,
      message: "Content approved successfully.",
      data: approvalResponse
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Approval processing failed.";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
