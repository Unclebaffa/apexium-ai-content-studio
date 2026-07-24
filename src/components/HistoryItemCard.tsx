"use client";

import React from "react";
import { Clock, Sparkles, Zap, Brain, Briefcase, BookOpen, Megaphone, MessageSquare, LucideIcon } from "lucide-react";

interface HistoryItemCardProps {
  id?: string;
  title: string;
  tone: "Professional" | "Educational" | "Promotional" | "Conversational" | string;
  model: "Gemini 1.5 Pro" | "GPT-4o" | "Claude 3.5 Sonnet" | string;
  date: string;
  isActive?: boolean;
  onClick?: () => void;
}

// Helper to determine model-specific branding colors and icons
const getModelStyles = (model: string) => {
  const normalized = model.toLowerCase();
  if (normalized.includes("gemini")) {
    return {
      icon: Sparkles,
      colorClass: "text-blue-600 bg-blue-50/50 border-blue-200/60 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40"
    };
  } else if (normalized.includes("gpt")) {
    return {
      icon: Zap,
      colorClass: "text-emerald-600 bg-emerald-50/50 border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40"
    };
  } else {
    return {
      icon: Brain,
      colorClass: "text-orange-600 bg-orange-50/50 border-orange-200/60 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40"
    };
  }
};

// Helper to get tone-specific icons and colors
const getToneStyles = (tone: string): { icon: LucideIcon; color: string } => {
  switch (tone.toLowerCase()) {
    case "professional":
      return { icon: Briefcase, color: "text-blue-500 dark:text-blue-400" };
    case "educational":
      return { icon: BookOpen, color: "text-emerald-500 dark:text-emerald-400" };
    case "promotional":
      return { icon: Megaphone, color: "text-pink-500 dark:text-pink-400" };
    case "conversational":
      return { icon: MessageSquare, color: "text-amber-500 dark:text-amber-400" };
    default:
      return { icon: Sparkles, color: "text-slate-500 dark:text-slate-400" };
  }
};

export default function HistoryItemCard({ 
  title, 
  tone, 
  model, 
  date, 
  isActive = false,
  onClick 
}: HistoryItemCardProps) {
  const modelStyle = getModelStyles(model);
  const toneStyle = getToneStyles(tone);
  const ModelIcon = modelStyle.icon;
  const ToneIcon = toneStyle.icon;

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col gap-2 rounded-xl border p-3.5 shadow-2xs transition-all duration-200 hover:scale-[1.01] hover:shadow-xs cursor-pointer active:scale-99
        ${isActive 
          ? "border-indigo-500 bg-indigo-50/40 dark:border-indigo-700 dark:bg-indigo-950/30 ring-2 ring-indigo-500/10" 
          : "border-slate-200/50 bg-white hover:border-indigo-200 dark:border-slate-800/40 dark:bg-slate-900/40 dark:hover:border-indigo-900/40"
        }
      `}
    >
      {/* Truncated Title Topic */}
      <p className={`line-clamp-2 text-xs font-semibold leading-normal transition-colors
        ${isActive ? "text-indigo-700 dark:text-indigo-300" : "text-slate-700 group-hover:text-indigo-600 dark:text-slate-300 dark:group-hover:text-indigo-400"}
      `}>
        {title}
      </p>

      {/* Badges and meta information footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
        
        {/* Badges list */}
        <div className="flex items-center gap-1.5">
          {/* AI Model Tag */}
          <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-4xs font-medium ${modelStyle.colorClass}`}>
            <ModelIcon className="h-2 w-2" />
            <span>{model}</span>
          </span>

          {/* Tone Tag */}
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-100 bg-slate-50/50 px-1.5 py-0.5 text-4xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-400">
            <ToneIcon className={`h-2 w-2 ${toneStyle.color}`} />
            <span>{tone}</span>
          </span>
        </div>

        {/* Timestamp */}
        <span className="inline-flex items-center gap-1 text-4xs font-medium text-slate-400 dark:text-slate-500">
          <Clock className="h-2.5 w-2.5" />
          <span>{date}</span>
        </span>
      </div>

    </div>
  );
}
