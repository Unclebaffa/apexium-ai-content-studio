"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ContentGeneratorForm from "@/components/ContentGeneratorForm";
import ContentPreview from "@/components/ContentPreview";
import { GeneratedContentItem } from "@/components/GeneratedContentCard";
import { Play, Sparkles, RefreshCw, AlertTriangle } from "lucide-react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [hasOutput, setHasOutput] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentItem | null>(null);
  const [contentHistory, setContentHistory] = useState<any[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [generationMeta, setGenerationMeta] = useState({
    tone: "Professional",
    model: "Google Gemini 1.5 Pro",
  });

  // Fetch initial content history on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.history)) {
          setContentHistory(data.history);
        }
      }
    } catch (err) {
      console.error("Failed to load content history:", err);
    }
  };

  const handleGenerate = async (data: { topic: string; tone: string; model: string }) => {
    setIsGenerating(true);
    setHasOutput(false);
    setErrorMessage("");
    setSelectedHistoryId(null);
    setGenerationMeta({
      tone: data.tone,
      model: data.model,
    });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to generate content. Please try again.");
      }

      const newItem: GeneratedContentItem = result.data;
      setGeneratedContent(newItem);
      setHasOutput(true);

      // Prepend to history list in frontend state
      const historyItem = {
        id: newItem.id || `hist-${Date.now()}`,
        title: newItem.topic ? (newItem.topic.length > 45 ? `${newItem.topic.slice(0, 45)}...` : newItem.topic) : "Generated Content",
        topic: newItem.topic,
        tone: newItem.tone || data.tone,
        model: newItem.model || data.model,
        date: "Just now",
        content: newItem.content,
        wordCount: newItem.wordCount,
        readTime: newItem.readTime,
        status: newItem.status || "Draft"
      };

      setContentHistory(prev => [historyItem, ...prev]);
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "Failed to connect to AI engine.";
      setErrorMessage(errorText);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveContent = async () => {
    if (!generatedContent) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: generatedContent.id,
          topic: generatedContent.topic,
          tone: generatedContent.tone,
          model: generatedContent.model,
          content: generatedContent.content,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save content.");
      }

      // Update generated content status
      setGeneratedContent(prev => prev ? { ...prev, status: "Saved", saved: true } : null);

      // Update history entry status
      if (generatedContent.id) {
        setContentHistory(prev =>
          prev.map(item => item.id === generatedContent.id ? { ...item, status: "Saved" } : item)
        );
      }
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "Save request failed.";
      setErrorMessage(errorText);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApproveContent = async () => {
    if (!generatedContent) return;

    setIsApproving(true);
    try {
      const response = await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: generatedContent.id,
          topic: generatedContent.topic,
          tone: generatedContent.tone,
          model: generatedContent.model,
          content: generatedContent.content,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Approval request failed.");
      }

      // Update generated content status
      setGeneratedContent(prev => prev ? { ...prev, status: "Approved" } : null);

      // Update history entry status
      if (generatedContent.id) {
        setContentHistory(prev =>
          prev.map(item => item.id === generatedContent.id ? { ...item, status: "Approved" } : item)
        );
      }
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "Approval request failed.";
      setErrorMessage(errorText);
    } finally {
      setIsApproving(false);
    }
  };

  const handleSelectHistoryItem = (item: GeneratedContentItem) => {
    setSelectedHistoryId(item.id || null);
    setGeneratedContent(item);
    setTopic(item.topic || "");
    setGenerationMeta({
      tone: item.tone || "Professional",
      model: item.model || "Google Gemini 1.5 Pro"
    });
    setHasOutput(true);
    setErrorMessage("");
  };

  const handleNewSession = () => {
    setTopic("");
    setGeneratedContent(null);
    setHasOutput(false);
    setSelectedHistoryId(null);
    setErrorMessage("");
  };

  const handleClearHistory = async () => {
    try {
      await fetch("/api/history", { method: "DELETE" });
      setContentHistory([]);
      setSelectedHistoryId(null);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  // State-toggle helpers for design review demonstrations
  const setDemoSuccess = () => {
    setIsGenerating(false);
    setHasOutput(true);
    setErrorMessage("");
    if (!generatedContent) {
      setGeneratedContent({
        id: "demo-1",
        title: "Overcoming Latency: Edge Computing for Industrial IoT (IIoT)",
        topic: "Overcoming Latency: Edge Computing for Industrial IoT (IIoT)",
        tone: generationMeta.tone,
        model: generationMeta.model,
        status: "Draft",
        content: `## Overcoming Latency: Edge Computing for Industrial IoT (IIoT)\n\nIn modern smart manufacturing, microseconds dictate success. As industrial plants deploy thousands of high-fidelity sensors measuring pressure, vibration, and temperature, transmitting this massive stream of telemetry to a centralized cloud introduces severe bottlenecks. This is where **Edge Computing** shifts the paradigm.\n\n### The Problem: Cloud Backhaul Overload\nHistorically, IoT architectures pushed all telemetry to central databases. Under this model, operators encounter:\n1. **Network Congestion:** High bandwidth consumption choking local gateways.\n2. **Jitter & Latency:** Multi-second roundtrips preventing real-time control loops.\n3. **Connectivity Dependency:** If connection drops, safety critical shutdown metrics fail.\n\n### The Solution: Deploying Intelligence at the Edge\nBy positioning edge gateways (powered by lightweight runtimes) directly on the factory floor, companies preprocess telemetry locally:\n- **Anomaly Detection:** Machine learning inference identifies machine wear within 5ms.\n- **Data Aggregation:** Filter out normal telemetry, transmitting only critical state changes.\n- **Fail-safe Autonomy:** Local controllers maintain operations even during internet blackouts.\n\n### Key Business Outcomes\nImplementing this edge architecture at **Apexium Technologies** resulted in a **45% reduction** in network operational costs and improved hardware failure response times by **82%**.`
      });
    }
  };

  const setDemoLoading = () => {
    setIsGenerating(true);
    setHasOutput(false);
    setErrorMessage("");
  };

  const setDemoError = () => {
    setIsGenerating(false);
    setHasOutput(false);
    setErrorMessage("Unable to connect to AI service. Please check your network connection and try again.");
  };

  const resetWorkspace = () => {
    handleNewSession();
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-slate-100">
      <Navbar 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
      />
      
      <div className="flex flex-1 relative">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          history={contentHistory}
          activeHistoryId={selectedHistoryId}
          onSelectHistoryItem={handleSelectHistoryItem}
          onNewSession={handleNewSession}
          onClearHistory={handleClearHistory}
        />
        
        {/* Main Content Area Container */}
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full overflow-y-auto">
          
          {/* Header section with page title & State controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                AI Content Studio
              </h1>
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Draft and generate social media copies, press releases, blog drafts, and emails with enterprise-grade models.
              </p>
            </div>

            {/* Premium UX Design Review State Panel */}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-2xs dark:border-slate-800 dark:bg-slate-950">
              <span className="px-2 text-3xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                UX States:
              </span>
              
              <button
                type="button"
                onClick={setDemoSuccess}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-3xs font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
              >
                <Sparkles className="h-3 w-3 text-indigo-500" />
                <span>Success</span>
              </button>

              <button
                type="button"
                onClick={setDemoLoading}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-3xs font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
              >
                <Play className="h-3 w-3 text-amber-500" />
                <span>Loading</span>
              </button>

              <button
                type="button"
                onClick={setDemoError}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-3xs font-bold text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
              >
                <AlertTriangle className="h-3 w-3 text-rose-500" />
                <span>Error</span>
              </button>

              <button
                type="button"
                onClick={resetWorkspace}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-3xs font-bold text-slate-600 hover:bg-slate-55 dark:text-slate-400 dark:hover:bg-slate-900 border-l border-slate-100 dark:border-slate-850 pl-2"
              >
                <RefreshCw className="h-3 w-3 text-slate-400" />
                <span>Reset</span>
              </button>
            </div>
          </div>
          
          {/* Main workspace layout: Form on left/top, preview on right/bottom */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-6 xl:col-span-5">
              <ContentGeneratorForm 
                onSubmit={handleGenerate} 
                isLoading={isGenerating} 
                errorMessage={errorMessage}
                onDismissError={() => setErrorMessage("")}
                topicValue={topic}
                onTopicChange={setTopic}
              />
            </div>
            
            <div className="lg:col-span-6 xl:col-span-7 h-full">
              <ContentPreview 
                isLoading={isGenerating} 
                hasOutput={hasOutput}
                contentItem={generatedContent}
                tone={generationMeta.tone}
                model={generationMeta.model}
                isSaving={isSaving}
                isApproving={isApproving}
                onSave={handleSaveContent}
                onApprove={handleApproveContent}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
