"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ChevronDown, 
  Check, 
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
  },
  {
    id: "educational",
    name: "Educational",
    description: "Informative, explanatory, and detail-oriented",
  },
  {
    id: "promotional",
    name: "Promotional",
    description: "Persuasive, engaging, and sales-focused",
  },
  {
    id: "conversational",
    name: "Conversational",
    description: "Friendly, approachable, and casual tone",
  }
];

const MODELS = [
  {
    id: "gemini",
    name: "Gemini 1.5 Pro",
    provider: "Google Gemini",
    description: "Highly analytical, creative, and capable of complex reasoning tasks.",
    icon: Sparkles,
  },
  {
    id: "openai",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Fast, creative, and versatile general-purpose intelligence model.",
    icon: Zap,
  },
  {
    id: "claude",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic Claude",
    description: "Balanced, accurate, and comprehensive writing with natural flow.",
    icon: Brain,
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
    "Write a newsletter about the benefit...",
    "Explain edge computing in simple ter...",
    "Create a social thread launching a n..."
  ];

  const fullTopicSuggestions = [
    "Write a newsletter about the benefits of serverless databases.",
    "Explain edge computing in simple terms for a non-technical manager.",
    "Create a social thread launching a new AI code assistant called Antigravity."
  ];

  const activeErrorMessage = errorMessage || validationError;

  return (
    <div className="w-full">
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

      <form onSubmit={handleSubmit}>
        
        {/* ── FORM SECTION 1: Content Topic or Prompt ── */}
        <div style={{ marginBottom: "32px", marginTop: "32px" }}>
          {/* Label + Char counter header */}
          <div 
            className="flex items-center justify-between"
            style={{ marginBottom: "8px" }}
          >
            <label
              htmlFor="topic-input" 
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#94A3B8",
                letterSpacing: "0.4px",
                textTransform: "uppercase"
                
              }}
            >
              CONTENT TOPIC OR PROMPT
            </label>

            <span
              style={{
                fontSize: "12px",
                fontWeight: 400,
                color: "#64748B"
              }}
            >
              {topic.length} / 500 chars
            </span>
          </div>

          {/* Textarea */}
          <textarea
            id="topic-input"
            value={topic}
            onChange={(e) => handleTextareaChange(e.target.value)}
            placeholder="E.g., Write a comprehensive explanation of Cloud databases, including advantages, security compliance, and vendor comparison..."
            disabled={isLoading}
            className="field-input w-full resize-y text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              minHeight: "140px",
              padding: "14px",
              background: "#1A202C",
              border: "1px solid #2D3748",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 400,
              color: "#E2E8F0",
              lineHeight: "1.6",
              resize: "none"
            }}
          />

          {/* Quick Prompt Suggestions */}
          <div 
            className="flex flex-wrap items-center gap-3"
            style={{ marginTop: "12px", marginBottom: "28px" }}
          >
            {quickTopicSuggestions.map((suggestionText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTextareaChange(fullTopicSuggestions[idx])}
                disabled={isLoading}
                className="transition-colors duration-150 cursor-pointer disabled:opacity-50"
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "#94A3B8",
                  background: "transparent",
                  border: "none",
                  padding: 0
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#7C3AED"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#94A3B8"}
              >
                "{suggestionText}"
              </button>
            ))}
          </div>
        </div>

        {/* ── FORM SECTION 2: Content Tone ── */}
        <div style={{ marginBottom: "40px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "#94A3B8",
              letterSpacing: "0.4px",
              textTransform: "uppercase",
              marginBottom: "12px"
            }}
          >
            CONTENT TONE
          </label>

          <div className="relative">
            {/* Dropdown Select Trigger Button */}
            <button
              type="button"
              onClick={() => setIsToneDropdownOpen(!isToneDropdownOpen)}
              disabled={isLoading}
              className="field-input flex w-full items-center justify-between transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                height: "44px",
                padding: "12px 14px",
                background: "#1A202C",
                border: "1px solid #2D3748",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 400,
                color: "#E2E8F0",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                if (!isToneDropdownOpen) {
                  e.currentTarget.style.background = "#252F3F";
                }
              }}
              onMouseLeave={(e) => {
                if (!isToneDropdownOpen) {
                  e.currentTarget.style.background = "#1A202C";
                }
              }}
            >
              <span>{selectedTone.name}</span>
              <ChevronDown 
                className={`transition-transform duration-200 ${isToneDropdownOpen ? "rotate-180" : ""}`}
                style={{ width: "18px", height: "18px", color: "#94A3B8" }} 
              />
            </button>

            {/* Dropdown Menu */}
            {isToneDropdownOpen && (
              <div
                className="absolute z-20 mt-1 w-full rounded-lg border shadow-xl animate-fade-in"
                style={{
                  background: "#1A202C",
                  border: "1px solid #2D3748",
                  borderRadius: "8px",
                  padding: "4px",
                }}
              >
                {TONES.map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => selectTone(tone)}
                    className="flex w-full items-center justify-between text-left transition-colors duration-150"
                    style={{
                      padding: "10px 14px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      color: selectedTone.id === tone.id ? "#FFFFFF" : "#CBD5E1",
                      background: selectedTone.id === tone.id ? "rgba(124,58,237,0.15)" : "transparent"
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTone.id !== tone.id) {
                        e.currentTarget.style.background = "#252F3F";
                        e.currentTarget.style.color = "#FFFFFF";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTone.id !== tone.id) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#CBD5E1";
                      }
                    }}
                  >
                    <div>
                      <div className="font-medium">{tone.name}</div>
                      <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>{tone.description}</div>
                    </div>
                    {selectedTone.id === tone.id && (
                      <Check className="h-4 w-4" style={{ color: "#7C3AED" }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── FORM SECTION 3: Select AI Model ── */}
        <div style={{ marginBottom: "40px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "#94A3B8",
              letterSpacing: "0.4px",
              textTransform: "uppercase",
              marginBottom: "16px"
            }}
          >
            SELECT AI MODEL
          </label>

          {/* Model Cards 3-Column Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {MODELS.map((model) => {
              const isSelected = selectedModel.id === model.id;
              const ModelIcon = model.icon;
              return (
                <div
                  key={model.id}
                  onClick={() => !isLoading && setSelectedModel(model)}
                  className={`model-card relative flex flex-col justify-between rounded-lg transition-all duration-200 cursor-pointer ${
                    isLoading ? "model-card--disabled opacity-60 cursor-not-allowed" : ""
                  } ${isSelected ? "model-card--selected" : ""}`}
                  style={{
                    minHeight: "150px",
                    padding: "16px",
                    background: isSelected ? "rgba(124, 58, 237, 0.05)" : "#1A202C",
                    border: isSelected ? "2px solid #7C3AED" : "2px solid #2D3748",
                    borderRadius: "8px",
                    boxShadow: isSelected ? "0 0 0 3px rgba(124, 58, 237, 0.1)" : "none"
                  }}
                >
                  <div>
                    {/* Icon Top-Left */}
                    <div className="flex items-center justify-between">
                      <ModelIcon style={{ width: "24px", height: "24px", color: "#7C3AED" }} />
                      {isSelected && (
                        <div 
                          className="flex items-center justify-center rounded-full"
                          style={{ width: "16px", height: "16px", background: "#7C3AED" }}
                        >
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Model Name */}
                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        marginTop: "12px"
                      }}
                    >
                      {model.name}
                    </h4>

                    {/* Provider Name */}
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 400,
                        color: "#94A3B8",
                        marginTop: "4px"
                      }}
                    >
                      {model.provider}
                    </p>
                  </div>

                  {/* Description */}
                  <p
                    className="line-clamp-2"
                    style={{
                      fontSize: "12px",
                      fontWeight: 400,
                      color: "#CBD5E1",
                      lineHeight: 1.4,
                      marginTop: "12px"
                    }}
                  >
                    {model.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ACTION BUTTON: Generate Content ── */}
        <div style={{ marginTop: "40px" }}>
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="btn-primary flex items-center justify-center gap-2 rounded-lg font-semibold text-white shadow-md transition-all duration-200"
            style={{
              height: "48px",
              padding: "0 32px",
              maxWidth: "280px",
              width: "100%",
              background: isLoading || !topic.trim() ? "#4B5563" : "#7C3AED",
              fontSize: "15px",
              fontWeight: 600,
              borderRadius: "8px",
              border: "none",
              cursor: isLoading || !topic.trim() ? "not-allowed" : "pointer",
              boxShadow: isLoading || !topic.trim() ? "none" : "0 2px 8px rgba(124, 58, 237, 0.25)"
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 spinner" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Content</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
