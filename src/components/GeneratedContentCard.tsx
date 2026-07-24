"use client";

import React, { useState } from "react";
import { Copy, Check, CheckCircle2, Clock, FileText, Send, Sparkles, Bookmark, Loader2 } from "lucide-react";

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
  model = "Google Gemini 1.5 Pro",
  isSaving = false,
  isApproving = false,
  onSave,
  onApprove 
}: GeneratedContentCardProps) {
  const [copied, setCopied] = useState(false);

  const displayTone = contentItem?.tone || tone;
  const displayModel = contentItem?.model || model;
  const displayContent = contentItem?.content || "";
  const displayTitle = contentItem?.title || contentItem?.topic || "Generated Studio Content";
  const displayWordCount = contentItem?.wordCount || (displayContent ? displayContent.trim().split(/\s+/).length : 218);
  const displayReadTime = contentItem?.readTime || `~${Math.max(1, Math.ceil(displayWordCount / 200))} min read`;
  const isApproved = contentItem?.status === "Approved";
  const isSaved = contentItem?.saved || contentItem?.status === "Saved" || contentItem?.status === "Approved";

  const handleCopy = () => {
    if (!displayContent) return;
    navigator.clipboard.writeText(displayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert markdown headers and paragraphs for clean presentation
  const renderFormattedContent = (rawText: string) => {
    if (!rawText) return null;

    const blocks = rawText.split("\n\n");
    return blocks.map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-base font-bold text-slate-950 dark:text-white leading-tight mb-3">
            {trimmed.replace(/^##\s+/, "")}
          </h2>
        );
      } else if (trimmed.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2">
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split("\n").map(i => i.replace(/^[-*]\s+/, ""));
        return (
          <ul key={idx} className="list-disc pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-350 mb-4">
            {items.map((it, iIdx) => (
              <li key={iIdx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(it) }} />
            ))}
          </ul>
        );
      } else if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split("\n").map(i => i.replace(/^\d+\.\s+/, ""));
        return (
          <ol key={idx} className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-350 mb-4">
            {items.map((it, iIdx) => (
              <li key={iIdx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(it) }} />
            ))}
          </ol>
        );
      } else {
        return (
          <p key={idx} className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
        );
      }
    });
  };

  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-950 dark:text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 dark:bg-slate-800 px-1 py-0.5 font-mono text-3xs">$1</code>');
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 transition-all duration-300">
      
      {/* Visual background accents for high-end feel */}
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Card Header metadata */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800/80 mb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-3xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Sparkles className="h-2.5 w-2.5 animate-pulse" />
            <span>{displayModel}</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-1 text-3xs font-semibold text-slate-600 dark:bg-slate-850 dark:text-slate-400">
            Tone: <span className="text-slate-900 dark:text-slate-300 font-bold">{displayTone}</span>
          </span>
          {contentItem?.status && (
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-3xs font-bold uppercase tracking-wider
              ${isApproved 
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" 
                : isSaved 
                ? "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              }
            `}>
              {contentItem.status}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-3xs text-slate-400 dark:text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{displayReadTime}</span>
          </span>
          <span className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
          <span className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>{displayWordCount} words</span>
          </span>
        </div>
      </div>

      {/* Card Typography Content */}
      <article className="prose prose-slate dark:prose-invert prose-xs max-w-none mb-6">
        {renderFormattedContent(displayContent)}
      </article>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800/80">
        
        {/* Copy utility */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-97 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-500 animate-bounce" />
              <span className="text-emerald-600 dark:text-emerald-450 font-bold">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Response</span>
            </>
          )}
        </button>

        <div className="flex w-full sm:w-auto items-center gap-2">
          {/* Save Action Button */}
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving || isSaved}
              className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-100 hover:text-slate-900 disabled:opacity-70 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isSaved ? (
                <>
                  <Check className="h-3.5 w-3.5 text-blue-500" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-3.5 w-3.5 text-slate-500" />
                  <span>Save Draft</span>
                </>
              )}
            </button>
          )}

          {/* Approve & Automate action */}
          <button
            type="button"
            onClick={onApprove}
            disabled={isApproving || isApproved}
            className="flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/10 transition-all hover:bg-emerald-500 hover:scale-[1.01] hover:shadow-emerald-600/20 active:scale-98 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isApproving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Approving...</span>
              </>
            ) : isApproved ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-white" />
                <span>Approved & Automation Ready</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Approve & Automate</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Success Automation Slide Banner */}
      {isApproved && (
        <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-center transition-all duration-300 dark:bg-emerald-950/80 dark:border-emerald-900/60 animate-slide-up">
          <p className="text-2xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Content approved. Automated campaign trigger queued for downstream AI workflow.
          </p>
        </div>
      )}

    </div>
  );
}
