/**
 * OpenAI Provider
 * Wraps the OpenAI Chat Completions API into the shared interface
 * used by modelSwitcher.js: generate({ prompt, tone, maxTokens }) -> { text, provider, raw }
 */

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_MODEL = "gpt-4o-mini";

async function generate({ prompt, systemPrompt = "", maxTokens = 800, temperature = 0.7 }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY in environment");

  const messages = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? "";

  return { text, provider: "openai", raw: data };
}

module.exports = { generate, name: "openai" };
