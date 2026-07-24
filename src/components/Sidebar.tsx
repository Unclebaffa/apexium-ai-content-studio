"use client";

import React from "react";
import { 
  PlusCircle, 
  History, 
  Layout, 
  Settings, 
  ChevronRight, 
  Sparkles, 
  Database,
  Trash2
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
}

export default function Sidebar({ 
  isOpen, 
  onClose,
  history = [],
  activeHistoryId = null,
  onSelectHistoryItem,
  onNewSession,
  onClearHistory
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-45 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200/80 bg-slate-50/90 backdrop-blur-md transition-transform duration-300 ease-in-out md:sticky md:top-16 md:z-30 md:h-[calc(100vh-4rem)] md:translate-x-0 dark:border-slate-800/80 dark:bg-slate-950/90
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header (for mobile view close trigger) */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-800/50 md:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <span className="font-bold text-slate-900 dark:text-white">Studio Menu</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <ChevronRight className="h-5 w-5 text-slate-500 rotate-180" />
          </button>
        </div>

        {/* Sidebar Content Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7 custom-scrollbar">
          
          {/* Main Action */}
          <div>
            <button 
              type="button"
              onClick={onNewSession}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 transition-all hover:from-indigo-500 hover:to-violet-500 hover:shadow-indigo-600/20 active:scale-98"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Studio Session</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1.5">
            <h3 className="px-3 text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Workspace
            </h3>
            <a
              href="#"
              className="flex items-center justify-between rounded-xl bg-indigo-50 px-3.5 py-2.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
            >
              <div className="flex items-center gap-2.5">
                <Layout className="h-4.5 w-4.5 opacity-90" />
                <span>AI Playground</span>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200"
            >
              <Database className="h-4.5 w-4.5 opacity-70" />
              <span>Prompt Templates</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900/60 dark:hover:text-slate-200"
            >
              <Settings className="h-4.5 w-4.5 opacity-70" />
              <span>API Settings</span>
            </a>
          </div>

          {/* Content History Module */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3">
              <h3 className="text-2xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" />
                <span>Content History</span>
              </h3>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="text-2xs text-slate-400 hover:text-rose-500 cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear all</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {history.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center dark:border-slate-800">
                  <p className="text-3xs text-slate-400">No session history yet.</p>
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

        </div>

        {/* Footer Area / User Info summary */}
        <div className="border-t border-slate-200/60 p-4 dark:border-slate-800/60">
          <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-900/40">
            <div className="flex justify-between text-3xs font-semibold text-slate-400 uppercase mb-1">
              <span>Token Usage</span>
              <span className="text-indigo-600 dark:text-indigo-400">64%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"></div>
            </div>
            <p className="mt-1.5 text-3xs text-slate-400 dark:text-slate-500">
              64,120 / 100,000 monthly tokens used
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
