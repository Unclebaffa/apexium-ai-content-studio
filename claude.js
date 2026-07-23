/**
 * Claude Provider
 * Wraps the Anthropic Messages API into the shared interface
 * used by modelSwitcher.js: generate({ prompt, tone, maxTokens }) -> { text, provider, raw }
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-4-6";
const ANTHROPIC_VERSION = "2023-06-01";

async function generate({ prompt, systemPrompt = "", maxTokens = 800, temperature = 0.7 }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY in environment");

  const body = {
    model: DEFAULT_MODEL,
    max_tokens: maxTokens,
    temperature,
    messages: [{ role: "user", content: prompt }],
  };
  if (systemPrompt) body.system = systemPrompt;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.content?.find((c) => c.type === "text")?.text ?? "";

  return { text, provider: "claude", raw: data };
}

module.exports = { generate, name: "claude" };
