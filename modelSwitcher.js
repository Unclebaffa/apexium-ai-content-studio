/**
 * Model Switcher
 * Central entry point for the Content Studio.
 *
 * Selects an AI provider, builds the correct prompt, generates content,
 * and returns a normalized response that can be passed to an automation
 * platform such as n8n, Zapier, or Make.
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

const FALLBACK_ORDER = ["claude", "openai", "gemini"];

/**
 * Generate AI content using the selected provider.
 *
 * @param {Object} options
 * @param {string} options.provider - "openai" | "gemini" | "claude"
 * @param {string} options.contentType - Example: "social_caption"
 * @param {string} options.tone - Example: "professional"
 * @param {string} options.topic - The subject of the content
 * @param {number} [options.maxTokens=800]
 * @param {string[]} [options._tried] - Internal list of attempted providers
 *
 * @returns {Promise<Object>}
 */
async function generateContent(options = {}) {
  const {
    provider,
    contentType,
    tone,
    topic,
    maxTokens = 800,
  } = options;

  if (!provider) {
    throw new Error(
      'A provider is required. Use "openai", "gemini", or "claude".'
    );
  }

  if (!contentType) {
    throw new Error("A contentType is required.");
  }

  if (!tone) {
    throw new Error("A tone is required.");
  }

  if (!topic) {
    throw new Error("A topic is required.");
  }

  const chosenProvider = PROVIDERS[provider];

  if (!chosenProvider) {
    throw new Error(
      `Unknown provider "${provider}". Valid options are: ${Object.keys(
        PROVIDERS
      ).join(", ")}`
    );
  }

  if (typeof chosenProvider.generate !== "function") {
    throw new Error(
      `The "${provider}" provider does not export a generate function.`
    );
  }

  const { systemPrompt, userPrompt } = buildPrompt({
    contentType,
    tone,
    topic,
  });

  try {
    const result = await chosenProvider.generate({
      prompt: userPrompt,
      systemPrompt,
      maxTokens,
    });

    return {
      ...result,
      provider,
      contentType,
      tone,
      topic,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return handleFallback({
      error,
      options: {
        ...options,
        maxTokens,
      },
    });
  }
}

/**
 * Try another provider when the selected provider fails.
 *
 * @param {Object} params
 * @param {Error} params.error
 * @param {Object} params.options
 *
 * @returns {Promise<Object>}
 */
async function handleFallback({ error, options }) {
  const triedProviders = options._tried || [options.provider];

  const nextProvider = FALLBACK_ORDER.find(
    (providerName) => !triedProviders.includes(providerName)
  );

  if (!nextProvider) {
    throw new Error(
      `All AI providers failed. Last error from "${options.provider}": ${
        error.message || "Unknown error"
      }`
    );
  }

  console.warn(
    `[modelSwitcher] "${options.provider}" failed: ${
      error.message || "Unknown error"
    }. Falling back to "${nextProvider}".`
  );

  return generateContent({
    ...options,
    provider: nextProvider,
    _tried: [...triedProviders, nextProvider],
  });
}

module.exports = {
  generateContent,
  PROVIDERS,
};