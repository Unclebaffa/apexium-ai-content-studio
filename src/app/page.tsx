"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ContentGeneratorForm from "@/components/ContentGeneratorForm";
import ContentPreview from "@/components/ContentPreview";
import { GeneratedContentItem } from "@/components/GeneratedContentCard";
import { Sparkles, Play, AlertTriangle, RefreshCw } from "lucide-react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [hasOutput, setHasOutput] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedContent, setGeneratedContent] = useState<GeneratedContentItem | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [contentHistory, setContentHistory] = useState<any[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("playground");
  const [generationMeta, setGenerationMeta] = useState({
    tone: "Professional",
    model: "Gemini 1.5 Pro",
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
    setGenerationMeta({ tone: data.tone, model: data.model });

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

      // Refresh sidebar history from server
      await fetchHistory();
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
          title: generatedContent.title,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Failed to save content.");

      setGeneratedContent(prev => prev ? { ...prev, status: "Saved", saved: true } : null);
      await fetchHistory();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Save request failed.");
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
          title: generatedContent.title,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Approval request failed.");

      const appData = result.data;
      setGeneratedContent(prev => prev ? {
        ...prev,
        status: "Approved",
        automationMessage: appData?.automationMessage || "Content approved. Automation trigger sent.",
      } : null);
      await fetchHistory();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Approval request failed.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleSelectHistoryItem = (item: GeneratedContentItem) => {
    setSelectedHistoryId(item.id || null);
    setGeneratedContent(item);
    setTopic(item.topic || "");
    setGenerationMeta({ tone: item.tone || "Professional", model: item.model || "Gemini 1.5 Pro" });
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

  // Demo UX state triggers (dev tool bar)
  const setDemoSuccess = () => {
    setIsGenerating(false);
    setHasOutput(true);
    setErrorMessage("");
    if (!generatedContent) {
      setGeneratedContent({
        id: "demo-1",
        title: "Understanding Quantum Computing Basics",
        topic: "Understanding Quantum Computing Basics",
        tone: generationMeta.tone,
        model: generationMeta.model,
        status: "Draft",
        content: `## Understanding Quantum Computing Basics\n\nQuantum computing represents a fundamental shift in how we process information. Unlike classical computers that rely on binary bits (0 or 1), quantum computers leverage quantum bits or **qubits**.\n\n### Core Quantum Principles\n1. **Superposition:** Allows qubits to exist in multiple states simultaneously, exponentially scaling computational power.\n2. **Entanglement:** Interlinks qubits such that the state of one instantly influences another, enabling complex parallel logic.\n3. **Quantum Interference:** Amplifies correct analytical paths while canceling wrong solutions.`,
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
    setErrorMessage("Unable to connect to AI engine. Please check network connection.");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0F172A] text-[#CBD5E1]">
      {/* ── Navbar ── */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* ── Main Layout ── */}
      <div className="flex flex-1 relative min-h-[calc(100vh-64px)]">

        {/* ── Sidebar (Left Panel) ── */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          history={contentHistory}
          activeHistoryId={selectedHistoryId}
          onSelectHistoryItem={handleSelectHistoryItem}
          onNewSession={handleNewSession}
          onClearHistory={handleClearHistory}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* ── Center + Right Panels ── */}
        <div className="flex flex-1 flex-col lg:flex-row w-full">

          {/* ── Center Panel: Generator Form ── */}
          <main
            className="flex-1 w-full overflow-y-auto"
            style={{ background: "#0F172A", padding: "40px", maxWidth: "800px" }}
          >
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-[40px]">
              <div>
                <h1
                  style={{
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    letterSpacing: "-0.5px",
                    lineHeight: 1.2,
                    marginBottom: "12px",
                  }}
                >
                  AI Content Studio
                </h1>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "#CBD5E1",
                    lineHeight: 1.6,
                    maxWidth: "600px",
                  }}
                >
                  Draft and generate social media copies, press releases, blog drafts, and emails
                  with enterprise-grade models.
                </p>
              </div>

              {/* Dev UX state toolbar */}
              <div
                className="flex items-center gap-3 shrink-0 self-start sm:self-center"
                style={{ border: "1px solid #2D3748", padding: "6px 12px", borderRadius: "6px" }}
              >
                <button
                  type="button"
                  onClick={setDemoSuccess}
                  className="flex items-center gap-1.5 cursor-pointer"
                  style={{ fontSize: "11px", fontWeight: 500, color: "#10B981", background: "transparent", border: "none" }}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Success</span>
                </button>
                <span style={{ color: "#2D3748" }}>|</span>
                <button
                  type="button"
                  onClick={setDemoLoading}
                  className="flex items-center gap-1.5 cursor-pointer"
                  style={{ fontSize: "11px", fontWeight: 500, color: "#3B82F6", background: "transparent", border: "none" }}
                >
                  <Play className="h-3 w-3" />
                  <span>Loading</span>
                </button>
                <span style={{ color: "#2D3748" }}>|</span>
                <button
                  type="button"
                  onClick={setDemoError}
                  className="flex items-center gap-1.5 cursor-pointer"
                  style={{ fontSize: "11px", fontWeight: 500, color: "#EF4444", background: "transparent", border: "none" }}
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>Error</span>
                </button>
                <span style={{ color: "#2D3748" }}>|</span>
                <button
                  type="button"
                  onClick={handleNewSession}
                  className="flex items-center gap-1.5 cursor-pointer"
                  style={{ fontSize: "11px", fontWeight: 500, color: "#A0AEC0", background: "transparent", border: "none" }}
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <ContentGeneratorForm
              onSubmit={handleGenerate}
              isLoading={isGenerating}
              errorMessage={errorMessage}
              onDismissError={() => setErrorMessage("")}
              topicValue={topic}
              onTopicChange={setTopic}
            />
          </main>

          {/* ── Right Panel: Content Preview & Actions ── */}
          <div className="flex-1 lg:max-w-md xl:max-w-lg w-full">
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
              onCancel={() => setIsGenerating(false)}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
