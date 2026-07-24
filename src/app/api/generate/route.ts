import { NextResponse } from "next/server";
import path from "path";

// Helper to determine AI provider key based on model string
function mapModelToProvider(modelName: string): "openai" | "gemini" | "claude" {
  const lower = modelName.toLowerCase();
  if (lower.includes("openai") || lower.includes("gpt")) return "openai";
  if (lower.includes("claude") || lower.includes("anthropic")) return "claude";
  return "gemini";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, tone, model } = body;

    // Validation
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json(
        { success: false, error: "Content topic or prompt is required." },
        { status: 400 }
      );
    }

    const selectedTone = tone || "Professional";
    const selectedModel = model || "Google Gemini 1.5 Pro";

    const title = topic.length > 50 ? `${topic.slice(0, 47)}...` : topic;
    const timestamp = new Date().toISOString();
    const id = `gen-${Date.now()}`;

    let generatedText = "";
    let providerUsed = mapModelToProvider(selectedModel);
    let isLiveAiGenerated = false;

    // Attempt live AI provider generation if API key exists in environment
    const hasAiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (hasAiKey) {
      try {
        const modelSwitcherPath = path.resolve(process.cwd(), "modelSwitcher.js");
        // Dynamically require modelSwitcher module
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { generateContent } = require(modelSwitcherPath);
        const aiResponse = await generateContent({
          provider: providerUsed,
          contentType: "blog_intro",
          tone: selectedTone.toLowerCase(),
          topic: topic.trim(),
        });
        if (aiResponse && aiResponse.text) {
          generatedText = aiResponse.text;
          isLiveAiGenerated = true;
        }
      } catch (aiErr) {
        console.warn("AI Provider call failed, utilizing domain content fallback:", aiErr);
      }
    }

    // Fallback structured content generator (if no live API key or provider fails)
    if (!generatedText) {
      if (selectedTone.toLowerCase() === "educational") {
        generatedText = `## Comprehensive Guide: ${title}

Understanding the core mechanics of **${topic}** requires breaking down key structural components and technical methodologies.

### 1. Architectural Foundations
When dealing with ${topic.toLowerCase()}, engineering teams must establish robust baseline parameters. Standard industry approaches highlight:
- **System Modularity:** Decoupling underlying execution logic from client interface layers.
- **Resource Optimization:** Allocating dynamic computing resources to minimize runtime latency.
- **Observability & Analytics:** Monitoring telemetry and real-time state metrics continuously.

### 2. Implementation Methodology (${selectedModel})
By leveraging advanced capabilities of **${selectedModel}**, teams achieve high accuracy and deterministic throughput:
1. **Input Normalization:** Pre-processing telemetry vectors before execution.
2. **Context Enrichment:** Injecting relevant domain knowledge dynamically.
3. **Output Validation:** Ensuring structural integrity before final deployment.

### 3. Summary & Best Practices
Adopting this structured approach ensures scalability, maintainability, and high reliability across production environments.`;
      } else if (selectedTone.toLowerCase() === "promotional") {
        generatedText = `## Launching the Next Generation of ${title}! 🚀

We are thrilled to announce a major breakthrough in **${topic}**! Designed for forward-thinking organizations, this solution redefines efficiency, speed, and intelligence.

### Why ${topic} Matters Now
In today's fast-moving market, static tools can no longer keep up. Key features include:
- ⚡ **Blazing Fast Performance:** Process complex requests in milliseconds.
- 🎯 **Tailored Precision:** Engineered using state-of-the-art ${selectedModel} intelligence.
- 🛡️ **Enterprise Security:** Built with bank-grade encryption and compliance standards.

### Real Impact & Results
Teams adopting this platform report up to **45% increase in operational output** and a **60% reduction in workflow bottlenecks**.

**Ready to transform your content workflow?** Experience the power of Apexium AI Content Studio today!`;
      } else if (selectedTone.toLowerCase() === "conversational") {
        generatedText = `## Let's Talk About: ${title} 👋

Ever wondered how **${topic}** is changing the way we build modern digital products? Let's dive into what's actually happening behind the scenes.

### The Big Picture
Whether you are a developer, designer, or product manager, dealing with ${topic.toLowerCase()} can sometimes feel overwhelming. But here's the good news:
- It doesn't have to be complicated!
- Break it down into small, digestible steps.
- Focus on practical, real-world utility over hype.

### What We Learned using ${selectedModel}
Working with **${selectedModel}**, we noticed how natural and fluent responses become when you match the right prompt tone with the right AI engine.

> *"Simplicity is the ultimate sophistication when crafting content for modern audiences."*

Give it a try and share your feedback with our team!`;
      } else {
        // Default: Professional
        generatedText = `## Strategic Analysis: ${title}

In modern enterprise operations, implementing robust strategies for **${topic}** has become a critical operational imperative. This report analyzes key considerations, deployment models, and expected business outcomes.

### Executive Overview & Bottlenecks
Organizations evaluating ${topic.toLowerCase()} typically encounter three distinct operational challenges:
1. **Integration Latency:** Aligning legacy API interfaces with modern asynchronous execution pipelines.
2. **Data Governance:** Enforcing strict access controls and compliance parameters.
3. **Scalability Constraints:** Managing dynamic workloads during peak transaction volumes.

### Recommended Strategy (${selectedModel})
Utilizing **${selectedModel}** with a **${selectedTone}** tone framework enables seamless content automation:
- **Pre-processing:** Validate and format incoming telemetry data.
- **Automated Workflow:** Trigger downstream business workflows upon verified content approval.
- **Audit Traceability:** Maintain complete history logs of generated assets.

### Expected Business Outcomes
Deploying this architecture at Apexium Technologies delivers measurable improvements:
- **Operational Cost Reduction:** Up to 40% bandwidth and processing efficiency.
- **Workflow Velocity:** Accelerating content turnaround from days to seconds.`;
      }
    }

    // Calculate word count & reading time
    const words = generatedText.trim().split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    const resultData = {
      id,
      topic,
      tone: selectedTone,
      model: selectedModel,
      provider: providerUsed,
      title,
      content: generatedText,
      wordCount: words,
      readTime: `~${readTimeMinutes} min read`,
      createdAt: timestamp,
      status: "Draft",
      saved: false,
      isLiveAiGenerated
    };

    return NextResponse.json({
      success: true,
      data: resultData
    });

  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "An unexpected server error occurred.";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
