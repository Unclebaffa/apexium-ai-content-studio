import fs from "fs";
import path from "path";

export interface ContentHistoryItem {
  id: string;
  title: string;
  topic: string;
  tone: string;
  model: string;
  provider?: string;
  date: string;
  content: string;
  wordCount: number;
  readTime: string;
  status: "Draft" | "Saved" | "Approved";
  savedAt?: string;
  approvedAt?: string;
  automationMessage?: string;
  createdAt: string;
}

const INITIAL_HISTORY: ContentHistoryItem[] = [
  {
    id: "hist-1",
    title: "Understanding Quantum Computing Basics",
    topic: "Understanding Quantum Computing Basics and key principles",
    tone: "Educational",
    model: "Gemini 1.5 Pro",
    provider: "gemini",
    date: "2 hours ago",
    status: "Draft",
    wordCount: 245,
    readTime: "~2 min read",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    content: `## Understanding Quantum Computing Basics\n\nQuantum computing represents a fundamental shift in processing power, leveraging principles of quantum mechanics such as superposition and entanglement.\n\n### Key Concepts\n1. **Qubits:** Unlike classical bits (0 or 1), qubits can exist in superposition.\n2. **Entanglement:** Interconnected quantum states enabling parallel processing capabilities.\n3. **Quantum Supremacy:** Performing calculations beyond the capability of classical supercomputers.`,
  },
  {
    id: "hist-2",
    title: "Top 5 Node.js Frameworks for 2026",
    topic: "Top 5 Node.js Frameworks for high performance web applications",
    tone: "Conversational",
    model: "GPT-4o",
    provider: "openai",
    date: "Yesterday",
    status: "Saved",
    wordCount: 190,
    readTime: "~1 min read",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    content: `## Top 5 Node.js Frameworks for 2026\n\nNode.js continues to dominate server-side JavaScript development. Here are the top frameworks you should know:\n\n1. **Next.js / App Router:** Ideal for full-stack React applications.\n2. **Fastify:** Ultra-low overhead framework focused on performance.\n3. **NestJS:** Enterprise-grade TypeScript framework with structured architecture.\n4. **Hono:** Lightweight edge-ready framework.\n5. **Koa:** Minimalist and flexible web framework.`,
  },
  {
    id: "hist-3",
    title: "Apexium Product Launch Press Release",
    topic: "Apexium Product Launch Press Release for enterprise AI Studio",
    tone: "Promotional",
    model: "Claude 3.5 Sonnet",
    provider: "claude",
    date: "3 days ago",
    status: "Approved",
    wordCount: 280,
    readTime: "~2 min read",
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    content: `## FOR IMMEDIATE RELEASE: Apexium Unveils Enterprise AI Content Studio\n\n**San Francisco, CA** — Apexium Technologies today announced the general availability of its AI Content Studio, an enterprise-grade platform designed to streamline AI-assisted content workflows.\n\n### Key Highlights\n- **Multi-Model Support:** Seamless switching between Google Gemini, OpenAI GPT-4, and Anthropic Claude.\n- **Automated Workflows:** Single-click approval integration with downstream publishing networks.\n- **Enterprise Controls:** Role-based access and centralized usage metrics.`,
  },
];

const STORE_FILE = path.resolve(process.cwd(), ".content_history.json");

function loadStore(): ContentHistoryItem[] {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const data = fs.readFileSync(STORE_FILE, "utf8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fall through to initial data
  }
  return [...INITIAL_HISTORY];
}

function saveStore(items: ContentHistoryItem[]): void {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(items, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to persist history store:", err);
  }
}

let memoryStore: ContentHistoryItem[] = loadStore();

export function getHistoryStore(): ContentHistoryItem[] {
  return memoryStore;
}

export function addHistoryItem(newItem: ContentHistoryItem): ContentHistoryItem {
  const existingIdx = memoryStore.findIndex((i) => i.id === newItem.id);
  if (existingIdx >= 0) {
    memoryStore[existingIdx] = { ...memoryStore[existingIdx], ...newItem };
  } else {
    memoryStore = [newItem, ...memoryStore];
  }
  saveStore(memoryStore);
  return newItem;
}

export function updateHistoryStatus(
  id: string,
  status: "Draft" | "Saved" | "Approved",
  extraData?: Partial<ContentHistoryItem>
): ContentHistoryItem | null {
  const idx = memoryStore.findIndex((i) => i.id === id);
  if (idx >= 0) {
    memoryStore[idx] = { ...memoryStore[idx], status, ...extraData };
    saveStore(memoryStore);
    return memoryStore[idx];
  }
  return null;
}

export function clearHistoryStore(): void {
  memoryStore = [];
  saveStore([]);
}
