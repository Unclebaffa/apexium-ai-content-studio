"use client";

import React, { useState } from "react";
import { Copy, Check, RefreshCw, Download, Sparkles, Clock, FileText } from "lucide-react";

export interface GeneratedContentItem {
  id?: string;
  title?: string;
  topic?: string;
  tone?: string;
  model?: string;
  content?: string;
  wordCount?: number;
  readTime?: string;
  status?: string;
  saved?: boolean;
  createdAt?: string;
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
}: GeneratedContentCardProps) {
  const [copied, setCopied] = useState(false);

  const displayTone = contentItem?.tone || tone;
  const displayModel = contentItem?.model || model;
  const displayContent = contentItem?.content || "";
  const displayTitle = contentItem?.title || contentItem?.topic || "Generated Studio Content";
  const displayWordCount = contentItem?.wordCount || (displayContent ? displayContent.trim().split(/\s+/).length : 218);
  const displayReadTime = contentItem?.readTime || `~${Math.max(1, Math.ceil(displayWordCount / 200))} min read`;

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

  const renderFormattedContent = (rawText: string) => {
    if (!rawText) return null;

    const blocks = rawText.split("\n\n");
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", marginBottom: "12px", marginTop: idx > 0 ? "16px" : 0 }}>
            {trimmed.replace(/^##\s+/, "")}
          </h2>
        );
      } else if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} style={{ fontSize: "14px", fontWeight: 600, color: "#E2E8F0", marginBottom: "8px", marginTop: "12px" }}>
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").map(i => i.replace(/^[-*]\s+/, ""));
        return (
          <ul key={idx} style={{ paddingLeft: "20px", marginBottom: "16px", listStyleType: "disc" }}>
            {items.map((it, iIdx) => (
              <li key={iIdx} style={{ fontSize: "14px", fontWeight: 400, color: "#CBD5E1", lineHeight: 1.7, marginBottom: "4px" }} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(it) }} />
            ))}
          </ul>
        );
      } else {
        return (
          <p key={idx} style={{ fontSize: "14px", fontWeight: 400, color: "#CBD5E1", lineHeight: 1.7, marginBottom: "16px", wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
        );
      }
    });
  };

  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #FFFFFF; font-weight: 600;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background: #2D3748; padding: 2px 6px; borderRadius: 4px; font-family: monospace; font-size: 12px; color: #E2E8F0;">$1</code>');
  };

  return (
    <div
      style={{
        background: "#1A202C",
        border: "1px solid #2D3748",
        borderRadius: "8px",
        padding: "20px",
        width: "100%",
      }}
    >
      {/* Card Header: Title & Copy Icon button */}
      <div
        className="flex items-center justify-between"
        style={{
          borderBottom: "1px solid #2D3748",
          paddingBottom: "16px",
          marginBottom: "16px",
        }}
      >
        <div className="flex items-center gap-3">
          <h4
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#E2E8F0",
            }}
          >
            {displayTitle}
          </h4>

          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "#7C3AED",
              background: "rgba(124, 58, 237, 0.1)",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            {displayModel}
          </span>
        </div>

        {/* Copy button */}
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
            fontSize: "12px"
          }}
          onMouseEnter={(e) => { if (!copied) e.currentTarget.style.color = "#7C3AED"; }}
          onMouseLeave={(e) => { if (!copied) e.currentTarget.style.color = "#94A3B8"; }}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? "Copied" : ""}</span>
        </button>
      </div>

      {/* Content Metadata Bar */}
      <div 
        className="flex items-center gap-4 text-xs mb-4"
        style={{ color: "#94A3B8", fontSize: "12px" }}
      >
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

      {/* Generated Content Body */}
      <div
        className="custom-scrollbar"
        style={{
          maxHeight: "450px",
          overflowY: "auto",
          paddingRight: "8px",
        }}
      >
        {renderFormattedContent(displayContent)}
      </div>

      {/* Footer Buttons: Regenerate | Download | Copy All */}
      <div
        className="flex flex-wrap items-center gap-3"
        style={{
          marginTop: "16px",
          borderTop: "1px solid #2D3748",
          paddingTop: "16px",
        }}
      >
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn-secondary flex items-center justify-center gap-2 rounded-lg font-medium"
          style={{
            height: "40px",
            padding: "0 16px",
            fontSize: "13px",
            borderRadius: "8px",
          }}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Regenerate</span>
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className="btn-secondary flex items-center justify-center gap-2 rounded-lg font-medium"
          style={{
            height: "40px",
            padding: "0 16px",
            fontSize: "13px",
            borderRadius: "8px",
          }}
        >
          <Download className="h-4 w-4" />
          <span>Download</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="btn-secondary flex items-center justify-center gap-2 rounded-lg font-medium"
          style={{
            height: "40px",
            padding: "0 16px",
            fontSize: "13px",
            borderRadius: "8px",
          }}
        >
          {copied ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? "Copied All!" : "Copy All"}</span>
        </button>
      </div>
    </div>
  );
}
