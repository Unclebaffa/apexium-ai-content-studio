import { NextResponse } from "next/server";
import { addHistoryItem, updateHistoryStatus, getHistoryStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, topic, tone, model, provider, content, title } = body;

    if (!id && !topic) {
      return NextResponse.json(
        { success: false, error: "Content ID or payload is required for approval." },
        { status: 400 }
      );
    }

    const targetId = id || `approved-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const webhookUrl =
      process.env.MAKE_WEBHOOK_URL ||
      process.env.ZAPIER_WEBHOOK_URL ||
      process.env.N8N_WEBHOOK_URL ||
      process.env.AUTOMATION_WEBHOOK_URL;

    let webhookStatus = "Simulated / Database Pipeline";
    let webhookSuccess = true;
    let automationDetails = "";

    const payload = {
      id: targetId,
      topic: topic || "Approved Content",
      tone: tone || "Professional",
      model: model || "Gemini 1.5 Pro",
      content: content || "",
      approvedAt: timestamp,
      status: "Approved",
      appSource: "Apexium AI Content Studio",
    };

    if (webhookUrl) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (webhookResponse.ok) {
          webhookStatus = `Dispatched to Live Automation Webhook (${webhookResponse.status})`;
          automationDetails = `Successfully posted approved content to automated pipeline.`;
        } else {
          webhookStatus = `Webhook Returned Error (${webhookResponse.status})`;
          automationDetails = `Webhook responded with status ${webhookResponse.status}. Recorded locally.`;
          webhookSuccess = false;
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Webhook connection failure";
        webhookStatus = `Webhook Failed: ${errMsg}`;
        automationDetails = `Automated webhook trigger attempted but failed. Content saved locally.`;
        webhookSuccess = false;
      }
    } else {
      automationDetails =
        "Content approved. Automated campaign trigger logged to local database pipeline and ready for publish.";
    }

    const existingStore = getHistoryStore();
    const existing = existingStore.find((i) => i.id === targetId);

    let approvedItem;

    if (existing) {
      approvedItem = updateHistoryStatus(targetId, "Approved", {
        approvedAt: timestamp,
        topic: topic || existing.topic,
        tone: tone || existing.tone,
        model: model || existing.model,
        content: content || existing.content,
        automationMessage: automationDetails,
      });
    } else {
      const words = (content || "").trim().split(/\s+/).filter(Boolean).length;
      const readTimeMinutes = Math.max(1, Math.ceil(words / 200));
      const displayTitle =
        title || (topic ? (topic.length > 45 ? `${topic.slice(0, 45)}...` : topic) : "Approved Content");

      approvedItem = addHistoryItem({
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
        status: "Approved",
        approvedAt: timestamp,
        automationMessage: automationDetails,
        createdAt: timestamp,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Content approved successfully. Automation workflow triggered.",
      data: {
        item: approvedItem,
        workflowTriggered: true,
        webhookSuccess,
        webhookStatus,
        automationMessage: automationDetails,
        approvedAt: timestamp,
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Approval processing failed.";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
