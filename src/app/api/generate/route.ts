import { NextResponse } from "next/server";
import { addHistoryItem } from "@/lib/store";
import { generateContent } from "@/lib/modelSwitcher";

export const dynamic = "force-dynamic";

function mapModelToProvider(modelName: string): "openai" | "gemini" | "claude" {
  const lower = modelName.toLowerCase();
  if (lower.includes("openai") || lower.includes("gpt")) return "openai";
  if (lower.includes("claude") || lower.includes("anthropic")) return "claude";
  return "gemini";
}

function cleanMarkdownBold(text: string): string {
  if (!text) return "";
  return text.replace(/\*\*/g, "");
}

function generateContextAwareFallback(topic: string, tone: string, model: string): string {
  const lowerInput = topic.toLowerCase();
  const lowerTone = (tone || "professional").toLowerCase();

  // 1. Specific Request: LinkedIn Posts
  if (lowerInput.includes("linkedin")) {
    if (lowerTone === "conversational") {
      return cleanMarkdownBold(`🚀 Web development is evolving faster than ever!

If you are building modern websites or web apps, AI is changing the game. From writing boilerplate code to catching hidden bugs before they reach production, intelligent tools are giving developers super-powers.

Here is what we are seeing across the industry:
1. Faster Prototyping: Turn ideas into functional UI components in minutes instead of days.
2. Smarter Debugging: Identify performance bottlenecks and logic flaws instantly.
3. Automated Content & Workflows: Integrate AI assistants directly into user experiences.

What AI tool has made the biggest difference in your daily workflow? Let us know in the comments!

#WebDevelopment #ArtificialIntelligence #SoftwareEngineering #Apexium #TechTrends`);
    }

    if (lowerTone === "promotional") {
      return cleanMarkdownBold(`🔥 Supercharge your digital transformation with Apexium AI Content Studio!

Web development teams leveraging AI automation are delivering applications up to 5x faster while drastically improving code quality and user engagement.

Key Advantages:
- Accelerated Scaffolding: Turn complex UI mockups into production-ready React code instantly.
- Intelligent Test Automation: Catch critical logic errors before they impact clients.
- Multi-Model Intelligence: Harness Gemini, OpenAI GPT-4, and Claude within one unified workflow.

Ready to elevate your engineering output? Partner with Apexium Technologies today! 🚀

#WebDevelopment #AITechnologies #Apexium #DigitalTransformation #SoftwareArchitecture`);
    }

    if (lowerTone === "educational") {
      return cleanMarkdownBold(`Understanding how Artificial Intelligence is transforming modern web development.

As digital applications grow in complexity, AI tools are helping developers build faster, cleaner, and more secure software. Here is a breakdown of key developments:

1. Code Assistance and Scaffolding
AI tools analyze project context to suggest optimized code patterns, reducing manual repetitive typing.

2. Automated Quality Assurance
Intelligent test runners identify edge cases and performance bugs during continuous integration pipelines.

3. Context-Aware Content Delivery
Modern web applications integrate generative AI APIs directly to serve personalized user experiences.

Understanding these shifts helps software teams stay competitive in an evolving tech landscape.

#WebDevelopment #SoftwareEngineering #TechEducation #Apexium`);
    }

    // Default Professional LinkedIn
    return cleanMarkdownBold(`Artificial Intelligence is fundamentally reshaping the landscape of modern web development.

As enterprise digital experiences become increasingly dynamic, development teams leveraging AI automation are achieving superior operational efficiency, elevated code quality, and accelerated release velocity.

Core Strategic Drivers:
- Automated Code Generation: Streamlining legacy boilerplate setup and component architecture.
- Accelerated Quality Assurance: Identifying edge-case vulnerabilities prior to deployment.
- Context-Aware User Interfaces: Delivering dynamic intelligence directly within client applications.

At Apexium Technologies, we build enterprise-grade web solutions powered by state-of-the-art AI infrastructure.

How is your organization integrating AI into your technology roadmap?

#WebDevelopment #AITechnologies #EnterpriseSoftware #Apexium #SoftwareArchitecture`);
  }

  // 2. Specific Request: Instagram Captions
  if (lowerInput.includes("instagram") || lowerInput.includes("caption")) {
    if (lowerTone === "professional") {
      return cleanMarkdownBold(`Apexium Technologies unveils the enterprise AI Content Studio. Streamline internal content drafting, multi-model execution, and automated publishing pipelines seamlessly.

Learn more about our enterprise platform at apexium.com

#Apexium #AIContentStudio #EnterpriseSoftware #Technology`);
    }

    if (lowerTone === "educational") {
      return cleanMarkdownBold(`Did you know you can manage Google Gemini, OpenAI, and Claude inside a single platform? 🧠💡

Apexium AI Content Studio breaks down content creation into simple steps:
1. Select your topic
2. Choose your tone
3. Pick your AI engine
4. Save and automate!

Swipe up or check the link in our bio to see how it works! 📲

#TechTips #AIContentStudio #Apexium #SoftwareGuide`);
    }

    if (lowerTone === "conversational") {
      return cleanMarkdownBold(`Hey everyone! 👋 We're super excited to share what we've been building at Apexium!

Our new AI Content Studio makes drafting social posts, emails, and articles feel totally effortless. No more staring at a blank screen!

Have you tried using AI for your daily content yet? Let us know in the comments! 👇

#Apexium #AIStudio #ContentCreator #TechCommunity`);
    }

    // Default Promotional Instagram
    return cleanMarkdownBold(`✨ Elevate your digital content with Apexium's new AI services! 🚀

Say goodbye to manual content bottlenecks. Our AI Content Studio empowers teams to draft, refine, and automate high-performing social posts, blog content, and emails in seconds.

Targeted Tone Options
Multi-Model Intelligence (Gemini, OpenAI, Claude)
Automated Publishing Pipelines

Ready to transform how your brand creates content? Tap the link in our bio to learn more! 💡

#Apexium #AIContentStudio #ContentAutomation #WebDev #MarketingTech #TechInnovation`);
  }

  // 3. General Prompt Handling across all 4 Tones (e.g. "Explain why businesses should adopt AI automation", "Why use AI", etc.)

  if (lowerTone === "professional") {
    return cleanMarkdownBold(`Executive Summary: The Strategic Imperative of AI Automation

In today's competitive enterprise landscape, adopting AI automation is a key driver of operational excellence and sustainable growth. Organizations implementing intelligent workflow automation experience measurable improvements across performance, consistency, and resource efficiency.

Strategic Business Drivers:
1. Operational Velocity and Throughput: Automating routine data processing and content generation accelerates cycle times from hours to seconds, allowing business units to execute with unprecedented agility.
2. Optimizing Human Capital: By delegating repetitive, manual processes to intelligent automation layers, high-value personnel can focus on strategic initiatives, innovation, and client relationships.
3. Enterprise Scalability and Consistency: Automated workflows execute with deterministic accuracy, reducing compliance risk and maintaining quality standards during periods of rapid transaction growth.

Conclusion:
Incorporating AI automation into enterprise operations establishes a resilient foundation for long-term operational advantage at Apexium Technologies.`);
  }

  if (lowerTone === "educational") {
    return cleanMarkdownBold(`A Simple Guide to AI Automation for Businesses

Imagine having an intelligent assistant that works alongside your team 24/7—handling data entry, drafting communications, and organizing workflows automatically. That is the core idea behind AI automation.

How AI Automation Helps Businesses:
- Step 1: Handling Routine Tasks
Instead of team members manually typing reports or sorting records every day, smart software handles these repetitive steps instantly.

- Step 2: Learning and Adapting
Unlike basic tools that only follow simple rule-based commands, modern AI understands context—meaning it can draft tailored emails, summarize documents, and catch errors automatically.

- Step 3: Freeing Up Brainpower
When routine work is automated, your team can focus on creative problem solving, strategic planning, and building genuine customer relationships.

Key Takeaway:
AI automation is not about replacing human ingenuity; it is about providing software tools that make your work faster, easier, and much more impactful.`);
  }

  if (lowerTone === "promotional") {
    return cleanMarkdownBold(`Supercharge Your Business Output with AI Automation 🚀

Ready to gain a game-changing competitive edge in today's fast-moving market? Businesses that embrace AI automation are scaling up to 5x faster while cutting operational overhead in half!

Why Modern Businesses Cannot Afford to Wait:
⚡ Unmatched Speed: Deliver projects, campaigns, and reports in minutes instead of days.
🎯 Maximize Revenue Potential: Empower your team to focus on closing deals and delighting customers while AI handles the heavy lifting.
🛡️ Zero Friction Scaling: Expand your service offerings effortlessly without exploding operational costs.

Don't let manual bottlenecks slow your brand down. Experience the future of intelligent workflow automation with Apexium Technologies today!`);
  }

  // Default: Conversational
  return cleanMarkdownBold(`Let's talk about why so many businesses are making the leap to AI automation 👋

If you've ever felt like your workday gets swallowed up by tedious paperwork, copy-pasting data, or drafting the same emails over and over, you're not alone. That's exactly where AI automation steps in to save the day.

Here's what it actually feels like when a team starts using AI automation:
- You get hours of your week back: Suddenly, routine tasks just happen smoothly in the background.
- Fewer head-scratching mistakes: Smart tools catch the little typos and data glitches before they turn into headache problems.
- Your team stays energized: Everyone gets to focus on what they actually enjoy doing—creative work, big ideas, and connecting with real people.

At the end of the day, AI automation is really just about giving you and your team room to breathe and innovate. Have you tried using AI tools in your daily routine yet?`);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, tone, model } = body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json(
        { success: false, error: "Content topic or prompt is required." },
        { status: 400 }
      );
    }

    const selectedTone = tone || "Professional";
    const selectedModel = model || "Gemini 1.5 Pro";
    const title = topic.length > 50 ? `${topic.slice(0, 47)}...` : topic;
    const timestamp = new Date().toISOString();
    const id = `gen-${Date.now()}`;

    let generatedText = "";
    const providerUsed = mapModelToProvider(selectedModel);
    let isLiveAiGenerated = false;

    const hasAiKey =
      process.env.OPENAI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.ANTHROPIC_API_KEY;

    if (hasAiKey) {
      try {
        const aiResponse = await generateContent({
          provider: providerUsed,
          contentType: "general",
          tone: selectedTone,
          topic: topic.trim(),
        });
        if (aiResponse && aiResponse.text) {
          generatedText = cleanMarkdownBold(aiResponse.text);
          isLiveAiGenerated = true;
        }
      } catch (aiErr) {
        console.warn("AI Provider call failed, using context-aware fallback:", aiErr);
      }
    }

    if (!generatedText) {
      generatedText = generateContextAwareFallback(topic.trim(), selectedTone, selectedModel);
    }

    // Ensure final text is completely stripped of any ** bold markers
    generatedText = cleanMarkdownBold(generatedText);

    const words = generatedText.trim().split(/\s+/).filter(Boolean).length;
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
      status: "Draft" as const,
      saved: false,
      isLiveAiGenerated,
    };

    addHistoryItem({
      id,
      title,
      topic,
      tone: selectedTone,
      model: selectedModel,
      provider: providerUsed,
      date: "Just now",
      content: generatedText,
      wordCount: words,
      readTime: `~${readTimeMinutes} min read`,
      status: "Draft",
      createdAt: timestamp,
    });

    return NextResponse.json({ success: true, data: resultData });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "An unexpected server error occurred.";
    return NextResponse.json({ success: false, error: errMessage }, { status: 500 });
  }
}
