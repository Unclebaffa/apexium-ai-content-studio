"use client";

import React from "react";
import { Eye, Sparkles } from "lucide-react";
import SkeletonLoader from "./SkeletonLoader";
import GeneratedContentCard, { GeneratedContentItem } from "./GeneratedContentCard";

interface ContentPreviewProps {
  isLoading?: boolean;
  hasOutput?: boolean;
  contentItem?: GeneratedContentItem | null;
  topic?: string;
  tone?: string;
  model?: string;
  isSaving?: boolean;
  isApproving?: boolean;
  onSave?: () => void;
  onApprove?: () => void;
}

export default function ContentPreview({ 
  isLoading = false, 
  hasOutput = false,
  contentItem,
  tone = "Professional", 
  model = "Google Gemini 1.5 Pro",
  isSaving = false,
  isApproving = false,
  onSave,
  onApprove
}: ContentPreviewProps) {
  return (
    <div className="flex h-full min-h-[500px] flex-col rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/40 backdrop-blur-sm overflow-hidden">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Eye className="h-4.5 w-4.5 text-slate-500" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Studio Preview
          </span>
        </div>

        {hasOutput && !isLoading && (
          <div className="flex items-center gap-1.5 text-3xs font-semibold text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Draft Ready</span>
          </div>
        )}
      </div>

      {/* Panel Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          /* SKELETON LOADING STATE */
          <SkeletonLoader />
        ) : hasOutput && (contentItem || tone) ? (
          /* RENDERED CONTENT STATE (Module 3) */
          <GeneratedContentCard 
            contentItem={contentItem}
            tone={tone} 
            model={model} 
            isSaving={isSaving}
            isApproving={isApproving}
            onSave={onSave}
            onApprove={onApprove}
          />
        ) : (
          /* EMPTY STATE (Before Generation) */
          <div className="flex h-full flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-250 rounded-xl dark:border-slate-800/80">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/50 dark:bg-slate-900 dark:border-slate-800">
              <Sparkles className="h-6 w-6 text-indigo-500 animate-pulse" />
            </div>
            <h3 className="mt-4 text-xs font-bold text-slate-900 dark:text-white">
              Studio Workspace Empty
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-3xs text-slate-400 leading-normal">
              Enter your topic description on the left panel, select your tone, choice of AI engine, and click "Generate Content" to draft content here.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
