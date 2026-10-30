"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  RefreshCw,
  Download,
  Sparkles,
  Clock,
  FileText,
  Bookmark,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export interface GeneratedContentItem {
  id?: string;
  title?: string;
  topic?: string;
  tone?: string;
  model?: string;
  provider?: string;
  content?: string;
  wordCount?: number;
  readTime?: string;
  status?: string;
  saved?: boolean;
  createdAt?: string;
  automationMessage?: string;
}

interface GeneratedContentCardProps {
  contentItem?: GeneratedContentItem | null;
  topic?: string;
  tone?: string;
  model?: string;
  isSaving?: boolean;
  isApproving?: boolean;
  onSave?: () => void;
  onApprove?: () => void;
}

export default function GeneratedContentCard({
  contentItem,
  tone = "Professional",
  model = "Gemini 1.5 Pro",
  isSaving = false,
  isApproving = false,
  onSave,
  onApprove,
}: GeneratedContentCardProps) {
  const [copied, setCopied] = useState(false);

  const displayTone = contentItem?.tone || tone;
  const displayModel = contentItem?.model || model;
  const rawContent = contentItem?.content || "";
  // Ensure no raw ** bold markers are ever present in display
  const displayContent = rawContent.replace(/\*\*/g, "");
  const displayTitle = contentItem?.title || contentItem?.topic || "Generated Studio Content";
  const displayWordCount =
    contentItem?.wordCount ||
    (displayContent ? displayContent.trim().split(/\s+/).filter(Boolean).length : 218);
  const displayReadTime =
    contentItem?.readTime || `~${Math.max(1, Math.ceil(displayWordCount / 200))} min read`;
  const currentStatus = contentItem?.status || "Draft";
  const isApproved = currentStatus === "Approved";
  const isSaved = currentStatus === "Saved" || contentItem?.saved;

  const handleCopy = () => {
    if (!displayContent) return;
    navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!displayContent) return;
    const element = document.createElement("a");
    const file = new Blob([displayContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${displayTitle.toLowerCase().replace(/[^a-z0-9]/g, "_")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatInlineMarkdown = (text: string) =>
    text
      .replace(/\*\*/g, "")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /`([^`]+)`/g,
        '<code style="background: #2D3748; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #E2E8F0;">$1</code>'
      );

  const renderFormattedContent = (rawText: string) => {
    if (!rawText) return null;
    const cleaned = rawText.replace(/\*\*/g, "");
    return cleaned.split("\n\n").map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("## ")) {
        return (
          <h2
            key={idx}
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#FFFFFF",
              marginBottom: "12px",
              marginTop: idx > 0 ? "16px" : 0,
            }}
          >
            {trimmed.replace(/^##\s+/, "")}
          </h2>
        );
      } else if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={idx}
            style={{ fontSize: "14px", fontWeight: 600, color: "#E2E8F0", marginBottom: "8px", marginTop: "12px" }}
          >
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").map((i) => i.replace(/^[-*]\s+/, ""));
        return (
          <ul key={idx} style={{ paddingLeft: "20px", marginBottom: "16px", listStyleType: "disc" }}>
            {items.map((it, iIdx) => (
              <li
                key={iIdx}
                style={{ fontSize: "14px", fontWeight: 400, color: "#CBD5E1", lineHeight: 1.7, marginBottom: "4px" }}
                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(it) }}
              />
            ))}
          </ul>
        );
      } else {
        return (
          <p
            key={idx}
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#CBD5E1",
              lineHeight: 1.7,
              marginBottom: "16px",
              wordBreak: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
          />
        );
      }
    });
  };

  const getStatusBadgeStyle = () => {
    if (isApproved) return { bg: "rgba(16,185,129,0.15)", text: "#10B981", border: "rgba(16,185,129,0.3)" };
    if (isSaved) return { bg: "rgba(59,130,246,0.15)", text: "#3B82F6", border: "rgba(59,130,246,0.3)" };
    return { bg: "rgba(245,158,11,0.15)", text: "#F59E0B", border: "rgba(245,158,11,0.3)" };
  };

  const statusStyle = getStatusBadgeStyle();

  return (
    <div
      style={{
        background: "#1A202C",
        border: "1px solid #2D3748",
        borderRadius: "12px",
        padding: "24px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ borderBottom: "1px solid #2D3748", paddingBottom: "16px" }}
      >
        <div className="flex items-center gap-3">
          <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#E2E8F0" }}>{displayTitle}</h4>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "#7C3AED",
              background: "rgba(124,58,237,0.12)",
              padding: "3px 10px",
              borderRadius: "6px",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            {displayModel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: statusStyle.text,
              background: statusStyle.bg,
              border: `1px solid ${statusStyle.border}`,
              padding: "3px 10px",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {isApproved && <CheckCircle2 className="h-3 w-3" />}
            {currentStatus}
          </span>

          {/* Copy icon button */}
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy output"
            className="transition-colors duration-150 cursor-pointer"
            style={{
              background: "transparent",
              border: "none",
              color: copied ? "#10B981" : "#94A3B8",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              padding: "4px 8px",
              borderRadius: "6px",
            }}
            onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = "#7C3AED"; }}
            onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = "#94A3B8"; }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? "Copied" : ""}</span>
          </button>
        </div>
      </div>

      {/* Metadata bar */}
      <div className="flex flex-wrap items-center gap-4" style={{ color: "#94A3B8", fontSize: "12px" }}>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{displayReadTime}</span>
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" />
          <span>{displayWordCount} words</span>
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-[#7C3AED]" />
          <span>Tone: {displayTone}</span>
        </span>
      </div>

      {/* Content body */}
      <div
        className="custom-scrollbar"
        style={{ maxHeight: "420px", overflowY: "auto", paddingRight: "8px" }}
      >
        {renderFormattedContent(displayContent)}
      </div>

      {/* Approval automation banner */}
      {isApproved && (
        <div
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "12px",
            color: "#6EE7B7",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
          <div>
            <div style={{ fontWeight: 600, color: "#FFFFFF", marginBottom: "2px" }}>
              Content Approved &amp; Automation Workflow Triggered!
            </div>
            <div>
              {contentItem?.automationMessage ||
                "Content has been dispatched to downstream publishing engines (Make / n8n / Zapier / Google Sheets)."}
            </div>
          </div>
        </div>
      )}

      {/* Primary action buttons */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        style={{ paddingTop: "12px", borderTop: "1px solid #2D3748" }}
      >
        {/* Save */}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !!isSaved}
          className="flex items-center justify-center gap-2 rounded-lg font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            height: "44px",
            background: isSaved ? "rgba(59,130,246,0.15)" : "#2563EB",
            border: isSaved ? "1px solid rgba(59,130,246,0.4)" : "none",
            color: isSaved ? "#60A5FA" : "#FFFFFF",
            fontSize: "13px",
          }}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving to Workspace...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="h-4 w-4" />
              <span>Saved in Workspace</span>
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" />
              <span>Save Content</span>
            </>
          )}
        </button>

        {/* Approve & Trigger Automation */}
        <button
          type="button"
          onClick={onApprove}
          disabled={isApproving || isApproved}
          className="flex items-center justify-center gap-2 rounded-lg font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            height: "44px",
            background: isApproved ? "rgba(16,185,129,0.15)" : "#7C3AED",
            border: isApproved ? "1px solid rgba(16,185,129,0.4)" : "none",
            color: isApproved ? "#34D399" : "#FFFFFF",
            fontSize: "13px",
            padding: "0 20px",
          }}
        >
          {isApproving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Triggering Automation...</span>
            </>
          ) : isApproved ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>Automation Triggered</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Approve &amp; Trigger Automation</span>
            </>
          )}
        </button>
      </div>

      {/* Utility toolbar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3"
        style={{ borderTop: "1px solid #2D3748", paddingTop: "12px" }}
      >
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-secondary flex items-center justify-center gap-2 rounded-lg font-medium"
          style={{ height: "36px", padding: "0 14px", fontSize: "12px" }}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Regenerate</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="btn-secondary flex items-center justify-center gap-2 rounded-lg font-medium"
            style={{ height: "36px", padding: "0 14px", fontSize: "12px" }}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download .md</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary flex items-center justify-center gap-2 rounded-lg font-medium"
            style={{ height: "36px", padding: "0 14px", fontSize: "12px" }}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[#10B981]" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied All!" : "Copy All"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
