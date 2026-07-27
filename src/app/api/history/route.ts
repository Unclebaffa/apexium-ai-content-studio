import { NextResponse } from "next/server";
import { getHistoryStore, clearHistoryStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const history = getHistoryStore();
    return NextResponse.json({ success: true, history });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to load history.";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    clearHistoryStore();
    return NextResponse.json({ success: true, message: "History cleared successfully." });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to clear history.";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
