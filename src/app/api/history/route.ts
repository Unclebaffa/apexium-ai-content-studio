import { NextResponse } from "next/server";

// Initial seed history items for demonstration and immediate UI richness
const INITIAL_HISTORY = [
  {
    id: "hist-1",
    title: "Understanding Quantum Computing Basics",
    topic: "Understanding Quantum Computing Basics and key principles",
    tone: "Educational",
    model: "Google Gemini 1.5 Pro",
    date: "2 hours ago",
    status: "Draft",
    wordCount: 245,
    readTime: "~2 min read",
    content: `## Understanding Quantum Computing Basics

Quantum computing represents a fundamental shift in processing power, leveraging principles of quantum mechanics such as superposition and entanglement.

### Key Concepts
1. **Qubits:** Unlike classical bits (0 or 1), qubits can exist in superposition.
2. **Entanglement:** Interconnected quantum states enabling parallel processing capabilities.
3. **Quantum Supremacy:** Performing calculations beyond the capability of classical supercomputers.`
  },
  {
    id: "hist-2",
    title: "Top 5 Node.js Frameworks for 2026",
    topic: "Top 5 Node.js Frameworks for high performance web applications",
    tone: "Conversational",
    model: "OpenAI GPT-4",
    date: "Yesterday",
    status: "Saved",
    wordCount: 190,
    readTime: "~1 min read",
    content: `## Top 5 Node.js Frameworks for 2026

Node.js continues to dominate server-side JavaScript development. Here are the top frameworks you should know:

1. **Next.js / App Router:** Ideal for full-stack React applications.
2. **Fastify:** Ultra-low overhead framework focused on performance.
3. **NestJS:** Enterprise-grade TypeScript framework with structured architecture.
4. **Hono:** Lightweight edge-ready framework.
5. **Koa:** Minimalist and flexible web framework.`
  },
  {
    id: "hist-3",
    title: "Apexium Product Launch Press Release",
    topic: "Apexium Product Launch Press Release for enterprise AI Studio",
    tone: "Promotional",
    model: "Anthropic Claude",
    date: "3 days ago",
    status: "Approved",
    wordCount: 280,
    readTime: "~2 min read",
    content: `## FOR IMMEDIATE RELEASE: Apexium Unveils Enterprise AI Content Studio

**San Francisco, CA** — Apexium Technologies today announced the general availability of its AI Content Studio, an enterprise-grade platform designed to streamline AI-assisted content workflows.

### Key Highlights
- **Multi-Model Support:** Seamless switching between Google Gemini, OpenAI GPT-4, and Anthropic Claude.
- **Automated Workflows:** Single-click approval integration with downstream publishing networks.
- **Enterprise Controls:** Role-based access and centralized usage metrics.`
  },
  {
    id: "hist-4",
    title: "Introduction to Edge Computing for IoT",
    topic: "Introduction to Edge Computing for Industrial IoT telemetry",
    tone: "Professional",
    model: "Google Gemini 1.5 Pro",
    date: "1 week ago",
    status: "Saved",
    wordCount: 218,
    readTime: "~2 min read",
    content: `## Overcoming Latency: Edge Computing for Industrial IoT (IIoT)

In modern smart manufacturing, microseconds dictate success. As industrial plants deploy thousands of high-fidelity sensors measuring pressure, vibration, and temperature, transmitting this massive stream of telemetry to a centralized cloud introduces severe bottlenecks.

### Solution Principles
- **Anomaly Detection:** ML inference identifies machine wear locally within 5ms.
- **Data Aggregation:** Transmit critical state changes to reduce cloud bandwidth.`
  }
];

let inMemoryHistory = [...INITIAL_HISTORY];

export async function GET() {
  return NextResponse.json({
    success: true,
    history: inMemoryHistory
  });
}

export async function DELETE() {
  inMemoryHistory = [];
  return NextResponse.json({
    success: true,
    message: "History cleared successfully."
  });
}
