"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ChevronDown, 
  Check, 
  Briefcase, 
  BookOpen, 
  Megaphone, 
  MessageSquare, 
  Loader2, 
  Zap, 
  Brain 
} from "lucide-react";

import ErrorBanner from "./ErrorBanner";

interface ContentGeneratorFormProps {
  onSubmit?: (data: { topic: string; tone: string; model: string }) => void;
  isLoading?: boolean;
  errorMessage?: string;
  onDismissError?: () => void;
  topicValue?: string;
  onTopicChange?: (val: string) => void;
}

const TONES = [
  {
    id: "professional",
    name: "Professional",
    description: "Polished, formal, and corporate communications",
    icon: Briefcase,
    color: "text-blue-600 dark:text-blue-400"
  },
  {
    id: "educational",
    name: "Educational",
    description: "Informative, explanatory, and detail-oriented",
    icon: BookOpen,
    color: "text-emerald-600 dark:text-emerald-400"
  },
  {
    id: "promotional",
    name: "Promotional",
    description: "Persuasive, engaging, and sales-focused",
    icon: Megaphone,
    color: "text-pink-600 dark:text-pink-400"
  },
  {
    id: "conversational",
    name: "Conversational",
    description: "Friendly, approachable, and casual tone",
    icon: MessageSquare,
    color: "text-amber-600 dark:text-amber-400"
  }
];

const MODELS = [
  {
    id: "gemini",
    name: "Google Gemini",
    version: "Gemini 1.5 Pro",
    description: "Highly analytical, excellent for research & reasoning",
    icon: Sparkles,
    accentColor: "border-blue-500/50 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/60",
    ringColor: "focus-within:ring-blue-500/20",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
  },
  {
    id: "openai",
    name: "OpenAI GPT-4",
    version: "GPT-4o",
    description: "Fast, creative, and strong general capability",
    icon: Zap,
    accentColor: "border-emerald-500/50 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/60",
    ringColor: "focus-within:ring-emerald-500/20",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    version: "Claude 3.5 Sonnet",
    description: "Nuanced, high-quality writing, very natural flow",
    icon: Brain,
    accentColor: "border-orange-500/50 bg-orange-50/50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-800/60",
    ringColor: "focus-within:ring-orange-500/20",
    badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300"
  }
];

export default function ContentGeneratorForm({ 
  onSubmit, 
  isLoading: propIsLoading,
  errorMessage,
  onDismissError,
  topicValue,
  onTopicChange
}: ContentGeneratorFormProps) {
  const [topic, setTopic] = useState(topicValue || "");
  const [selectedTone, setSelectedTone] = useState(TONES[0]);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isToneDropdownOpen, setIsToneDropdownOpen] = useState(false);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const [validationError, setValidationError] = useState("");

  const isLoading = propIsLoading !== undefined ? propIsLoading : localIsLoading;

  useEffect(() => {
    if (topicValue !== undefined) {
      setTopic(topicValue);
    }
  }, [topicValue]);

  const handleTextareaChange = (val: string) => {
    const sliced = val.slice(0, 500);
    setTopic(sliced);
    if (onTopicChange) onTopicChange(sliced);
    if (validationError && sliced.trim()) {
      setValidationError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim()) {
      setValidationError("Please enter a content topic or prompt before generating.");
      return;
    }

    setValidationError("");

    if (onSubmit) {
      onSubmit({
        topic: topic.trim(),
        tone: selectedTone.name,
        model: selectedModel.name
      });
    } else {
      setLocalIsLoading(true);
      setTimeout(() => {
        setLocalIsLoading(false);
      }, 1800);
    }
  };

  const selectTone = (tone: typeof TONES[0]) => {
    setSelectedTone(tone);
    setIsToneDropdownOpen(false);
  };

  const quickTopicSuggestions = [
    "Write a newsletter about the benefits of serverless databases.",
    "Explain edge computing in simple terms for a non-technical manager.",
    "Create a social thread launching a new AI code assistant called Antigravity."
  ];

  const activeErrorMessage = errorMessage || validationError;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/40 backdrop-blur-sm">
      {activeErrorMessage && (
        <div className="mb-5">
          <ErrorBanner 
            message={activeErrorMessage} 
            onDismiss={() => {
              setValidationError("");
              if (onDismissError) onDismissError();
            }} 
          />
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Topic Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="topic" className="text-sm font-semibold text-slate-950 dark:text-slate-200">
              Content Topic or Prompt
            </label>
            <span className="text-2xs text-slate-400">
              {topic.length} / 500 chars
            </span>
          </div>
          <div className="relative">
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => handleTextareaChange(e.target.value)}
              placeholder="E.g., Write a comprehensive explanation of Cloud databases, including advantages, security compliance, and vendor comparison..."
              disabled={isLoading}
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-800 placeholder-slate-400 outline-hidden transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
            />
          </div>
          
          {/* Quick Suggestions for UI interaction */}
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {quickTopicSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleTextareaChange(suggestion)}
                className="rounded-lg bg-slate-50 border border-slate-200/80 px-2.5 py-1 text-2xs text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:bg-slate-900/40 dark:border-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-800/80"
              >
                {suggestion.slice(0, 36)}...
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Custom Tone Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-950 dark:text-slate-200">
            Content Tone
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsToneDropdownOpen(!isToneDropdownOpen)}
              disabled={isLoading}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-left text-sm text-slate-800 shadow-3xs transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-950"
            >
              <span className="flex items-center gap-2.5">
                <selectedTone.icon className={`h-4.5 w-4.5 ${selectedTone.color}`} />
                <span className="font-medium">{selectedTone.name}</span>
              </span>
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isToneDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isToneDropdownOpen && (
              <div className="absolute z-20 mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-950">
                {TONES.map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => selectTone(tone)}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-all hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  >
                    <tone.icon className={`h-4.5 w-4.5 mt-0.5 shrink-0 ${tone.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white">{tone.name}</span>
                        {selectedTone.id === tone.id && (
                          <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        )}
                      </div>
                      <p className="text-slate-400 dark:text-slate-500 mt-0.5">{tone.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 3: AI Model Cards */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-950 dark:text-slate-200">
            Select AI Model
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {MODELS.map((model) => {
              const isSelected = selectedModel.id === model.id;
              return (
                <div
                  key={model.id}
                  onClick={() => !isLoading && setSelectedModel(model)}
                  className={`group relative flex flex-col justify-between rounded-xl border p-4 shadow-3xs transition-all duration-200 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700
                    ${isSelected 
                      ? model.accentColor + " border-2 border-solid ring-3 ring-indigo-500/5 dark:ring-indigo-400/5 scale-[1.02]" 
                      : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40"
                    }
                    ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/40">
                        <model.icon className="h-4 w-4" />
                      </div>
                      <span className={`rounded-md px-1.5 py-0.5 text-3xs font-semibold ${model.badgeColor}`}>
                        {model.version}
                      </span>
                    </div>
                    
                    <h4 className="mt-3 text-xs font-bold text-slate-900 dark:text-white">
                      {model.name}
                    </h4>
                    <p className="text-3xs text-slate-400 dark:text-slate-500 mt-1 leading-relaxed">
                      {model.description}
                    </p>
                  </div>

                  {/* Active Radio Dot */}
                  <div className="absolute bottom-3 right-3">
                    <div className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all
                      ${isSelected 
                        ? "border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500" 
                        : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950"
                      }
                    `}>
                      {isSelected && <Check className="h-2.5 w-2.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 transition-all hover:scale-[1.01] hover:shadow-indigo-600/20 active:scale-99 disabled:scale-100 disabled:cursor-not-allowed disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:shadow-none dark:disabled:from-slate-800 dark:disabled:to-slate-800/80 dark:disabled:text-slate-500"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                <span>Running generation pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                <span>Generate Content</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
