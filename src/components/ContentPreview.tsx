"use client";

import React from "react";
import { Wand2 } from "lucide-react";
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
  onCancel?: () => void;
}

export default function ContentPreview({ 
  isLoading = false, 
  hasOutput = false,
  contentItem,
  tone = "Professional", 
  model = "Gemini 1.5 Pro",
  isSaving = false,
  isApproving = false,
  onSave,
  onApprove,
  onCancel
}: ContentPreviewProps) {
  return (
    <div
      className="flex h-full min-h-[500px] flex-col w-full"
      style={{
        background: "#0F172A",
        borderLeft: "1px solid #1E293B",
        padding: "40px",
      }}
    >
      {isLoading ? (
        /* ── LOADING STATE ── */
        <div className="flex flex-col h-full justify-between">
          <SkeletonLoader />
          {onCancel && (
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary rounded-lg text-sm font-medium"
                style={{
                  height: "40px",
                  padding: "0 24px",
                  fontSize: "13px"
                }}
              >
                Cancel Generation
              </button>
            </div>
          )}
        </div>
      ) : hasOutput && (contentItem || tone) ? (
        /* ── SUCCESS STATE ── */
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
        /* ── DEFAULT EMPTY STATE (Section 4 Spec) ── */
        <div className="flex h-full flex-col items-center justify-center text-center my-auto py-12">
          {/* 80x80px Wand magic icon with purple opacity 0.3 */}
          <div
            className="flex items-center justify-center rounded-2xl mb-6"
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(124, 58, 237, 0.1)",
              borderRadius: "16px",
            }}
          >
            <Wand2 
              style={{
                width: "40px",
                height: "40px",
                color: "#7C3AED",
                opacity: 0.8
              }} 
            />
          </div>

          {/* Heading */}
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#E2E8F0",
              textAlign: "center",
              marginBottom: "12px"
            }}
          >
            Studio Workspace Empty
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#94A3B8",
              lineHeight: "1.6",
              textAlign: "center",
              maxWidth: "280px"
            }}
          >
            Enter your topic description on the left panel, select your tone, choose an AI engine, and click 'Generate Content' to draft content here.
          </p>
        </div>
      )}
    </div>
  );
}
