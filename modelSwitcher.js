/**
 * Model Switcher
 * Central entry point for the Content Studio. Picks a provider (OpenAI, Gemini,
 * or Claude), applies the right tone-specific prompt template, and returns a
 * normalized response ready to hand off to the automation layer (n8n/Zapier/Make).
 */

const openai = require("./openai");
const gemini = require("./gemini");
const claude = require("./claude");
const { buildPrompt } = require("./templates");

const PROVIDERS = {
  openai,
  gemini,
  claude,
};

/**
 * @param {Object} options
 * @param {string} options.provider - "openai" | "gemini" | "claude"
 * @param {string} options.contentType - e.g. "social_caption", "blog_intro", "ad_copy"
 * @param {string} options.tone - e.g. "professional", "casual", "persuasive"
 * @param {string} options.topic - what the content should be about
 * @param {number} [options.maxTokens]
 * @param {number} [options.attempt] - internal, used for fallback retries
 */
async function generateContent(options) {
  const { provider, contentType, tone, topic, maxTokens = 800 } = options;

  const chosen = PROVIDERS[provider];
  if (!chosen) {
    throw new Error(
      `Unknown provider "${provider}". Valid options: ${Object.keys(PROVIDERS).join(", ")}`
    );
  }

  const { systemPrompt, userPrompt } = buildPrompt({ contentType, tone, topic });

  try {
    const result = await chosen.generate({
      prompt: userPrompt,
      systemPrompt,
      maxTokens,
    });

    return {
      ...result,
      contentType,
      tone,
      topic,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    return handleFallback({ err, options, systemPrompt, userPrompt });
  }
}

/**
 * If the chosen provider fails (rate limit, outage, bad key), automatically
 * fall back to the next available provider in FALLBACK_ORDER instead of
 * failing the whole automation run.
 */
const FALLBACK_ORDER = ["claude", "openai", "gemini"];

async function handleFallback({ err, options, systemPrompt, userPrompt }) {
  const tried = options._tried || [options.provider];
  const next = FALLBACK_ORDER.find((p) => !tried.includes(p));

  if (!next) {
    throw new Error(
      `All providers failed. Last error from "${options.provider}": ${err.message}`
    );
  }

  console.warn(
    `[modelSwitcher] "${options.provider}" failed (${err.message}). Falling back to "${next}"...`
  );

  return generateContent({
    ...options,
    provider: next,
    _tried: [...tried, next],
  });
}

module.exports = { generateContent, PROVIDERS };
