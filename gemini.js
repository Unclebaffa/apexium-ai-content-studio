/**
 * Gemini Provider
 * Wraps the Google Gemini generateContent API into the shared interface
 * used by modelSwitcher.js: generate({ prompt, tone, maxTokens }) -> { text, provider, raw }
 */

const DEFAULT_MODEL = "gemini-2.0-flash";

function buildUrl(apiKey) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`;
}

async function generate({ prompt, systemPrompt = "", maxTokens = 800, temperature = 0.7 }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY in environment");

  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

  const response = await fetch(buildUrl(apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  return { text, provider: "gemini", raw: data };
}

module.exports = { generate, name: "gemini" };
