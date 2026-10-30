"use client";

import React from "react";
import { Clock } from "lucide-react";

interface HistoryItemCardProps {
  id?: string;
  title: string;
  tone: string;
  model: string;
  date: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function HistoryItemCard({ 
  title, 
  tone, 
  date, 
  isActive = false,
  onClick 
}: HistoryItemCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col rounded-lg transition-all duration-150 cursor-pointer"
      style={{
        padding: "12px 16px",
        borderRadius: "6px",
        background: isActive ? "#2D3748" : "transparent",
        color: isActive ? "#E2E8F0" : "#CBD5E1",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "#2D3748";
          e.currentTarget.style.color = "#E2E8F0";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#CBD5E1";
        }
      }}
    >
      {/* Title */}
      <p
        className="line-clamp-2"
        style={{
          fontSize: "13px",
          fontWeight: 400,
          lineHeight: "1.4",
          maxWidth: "228px",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </p>

      {/* Timestamp */}
      <div 
        className="flex items-center gap-1"
        style={{
          fontSize: "12px",
          fontWeight: 400,
          color: "#94A3B8",
          marginTop: "4px"
        }}
      >
        <Clock className="h-3 w-3" />
        <span>{date}</span>
      </div>

      {/* Tag badge */}
      <div style={{ marginTop: "8px" }}>
        <span
          style={{
            display: "inline-block",
            background: "rgba(59, 130, 246, 0.1)",
            color: "#3B82F6",
            fontSize: "11px",
            fontWeight: 500,
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          {tone}
        </span>
      </div>
    </div>
  );
}
