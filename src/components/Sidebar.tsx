"use client";

import React from "react";
import { 
  Plus, 
  Layout, 
  Database, 
  Settings, 
  History, 
  Trash2, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import HistoryItemCard from "./HistoryItemCard";
import { GeneratedContentItem } from "./GeneratedContentCard";

interface SidebarHistoryItem {
  id: string;
  title: string;
  topic?: string;
  tone: string;
  model: string;
  date: string;
  content?: string;
  wordCount?: number;
  readTime?: string;
  status?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history?: SidebarHistoryItem[];
  activeHistoryId?: string | null;
  onSelectHistoryItem?: (item: GeneratedContentItem) => void;
  onNewSession?: () => void;
  onClearHistory?: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function Sidebar({ 
  isOpen, 
  onClose,
  history = [],
  activeHistoryId = null,
  onSelectHistoryItem,
  onNewSession,
  onClearHistory,
  activeTab = "playground",
  setActiveTab
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Main Sidebar Shell: 260px fixed width, #1A202C background, 1px solid #2D3748 right border */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[#2D3748] bg-[#1A202C] transition-transform duration-300 ease-in-out md:sticky md:top-[64px] md:z-30 md:h-[calc(100vh-64px)] md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: "260px", background: "#1A202C", borderColor: "#2D3748" }}
      >
        {/* Mobile Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-[#2D3748] md:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#7C3AED]" />
            <span className="font-semibold text-white text-sm">Studio Navigation</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[#94A3B8] hover:bg-[#2D3748]"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">

          {/* ── TOP SECTION: New Studio Session Button ── */}
          <div style={{ padding: "16px", borderBottom: "1px solid #2D3748" }}>
            <button 
              type="button"
              onClick={onNewSession}
              className="group flex w-full items-center gap-3 rounded-lg text-sm font-semibold text-white shadow-md transition-all duration-200"
              style={{
                height: "44px",
                padding: "0 16px",
                background: "#7C3AED",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#6D28D9";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(124, 58, 237, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#7C3AED";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Plus className="h-4 w-4 text-white shrink-0" />
              <span>New Studio Session</span>
            </button>
          </div>

          {/* ── WORKSPACE SECTION ── */}
          <div style={{ borderBottom: "1px solid #2D3748" }}>
            {/* Header */}
            <div style={{ padding: "16px 16px 12px 16px" }}>
              <h3 
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#94A3B8",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase"
                }}
              >
                WORKSPACE
              </h3>
            </div>

            {/* Menu items */}
            <div className="space-y-1" style={{ padding: "0 8px 12px 8px" }}>
              {[
                { id: "playground", label: "AI Playground", icon: Layout },
                { id: "templates", label: "Prompt Templates", icon: Database },
                { id: "settings", label: "API Settings", icon: Settings }
              ].map((item) => {
                const isActive = activeTab === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab && setActiveTab(item.id)}
                    className="sidebar-nav-item w-full relative flex items-center justify-between text-left transition-all duration-150"
                    style={{
                      padding: "12px 16px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: isActive ? "#E2E8F0" : "#CBD5E1",
                      background: isActive ? "#2D3748" : "transparent"
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
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-[18px] w-[18px] shrink-0" style={{ color: isActive ? "#7C3AED" : "#94A3B8" }} />
                      <span>{item.label}</span>
                    </div>

                    {/* Active indicator dot */}
                    {isActive && (
                      <span 
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#7C3AED"
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── CONTENT HISTORY SECTION ── */}
          <div style={{ borderBottom: "1px solid #2D3748" }}>
            {/* Header flex: title and clear all */}
            <div 
              className="flex items-center justify-between"
              style={{ padding: "20px 16px 12px 16px" }}
            >
              <h3 
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#94A3B8",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase"
                }}
              >
                CONTENT HISTORY
              </h3>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="transition-colors duration-150 flex items-center gap-1 cursor-pointer"
                  style={{
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#7C3AED",
                    border: "none",
                    background: "transparent"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#9F7AEA"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#7C3AED"}
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear all</span>
                </button>
              )}
            </div>

            {/* History list */}
            <div style={{ padding: "0 16px 16px 16px" }} className="space-y-2">
              {history.length === 0 ? (
                <div 
                  className="rounded-lg text-center"
                  style={{
                    padding: "16px",
                    border: "1px dashed #2D3748",
                    color: "#64748B",
                    fontSize: "12px"
                  }}
                >
                  No session history yet.
                </div>
              ) : (
                history.map((item) => (
                  <HistoryItemCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    tone={item.tone}
                    model={item.model}
                    date={item.date}
                    isActive={activeHistoryId === item.id}
                    onClick={() => onSelectHistoryItem && onSelectHistoryItem({
                      id: item.id,
                      title: item.title,
                      topic: item.topic || item.title,
                      tone: item.tone,
                      model: item.model,
                      content: item.content,
                      wordCount: item.wordCount,
                      readTime: item.readTime,
                      status: item.status
                    })}
                  />
                ))
              )}
            </div>
          </div>

          {/* ── TOKEN USAGE SECTION ── */}
          <div style={{ padding: "20px 16px" }}>
            <h3 
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#94A3B8",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: "16px"
              }}
            >
              TOKEN USAGE
            </h3>

            {/* Large percentage display */}
            <div 
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#E2E8F0",
                lineHeight: 1.2
              }}
            >
              64%
            </div>

            {/* Subtitle count */}
            <p 
              style={{
                fontSize: "13px",
                fontWeight: 400,
                color: "#94A3B8",
                marginTop: "8px"
              }}
            >
              64,120 / 100,000 monthly
            </p>

            {/* Small caption */}
            <p 
              style={{
                fontSize: "11px",
                fontWeight: 400,
                color: "#64748B",
                marginTop: "4px"
              }}
            >
              tokens used
            </p>

            {/* Progress bar */}
            <div 
              className="w-full rounded-full overflow-hidden"
              style={{
                height: "6px",
                background: "#2D3748",
                borderRadius: "3px",
                marginTop: "12px"
              }}
            >
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: "64%",
                  background: "#7C3AED",
                  borderRadius: "3px"
                }}
              />
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}
