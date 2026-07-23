/**
 * Prompt Templates
 * Tone-specific and content-type-specific prompt construction for the
 * Content Studio. Add new content types or tones here — modelSwitcher.js
 * and the providers never need to change.
 */

const TONE_GUIDES = {
  professional: "Use clear, polished, business-appropriate language. Avoid slang.",
  casual: "Use a relaxed, conversational tone, like talking to a friend.",
  persuasive: "Use confident, benefit-focused language that drives action.",
  friendly: "Use warm, approachable language that feels personal.",
  witty: "Use light humor and clever phrasing without being unprofessional.",
};

const CONTENT_TYPE_GUIDES = {
  social_caption: "Write a short social media caption (under 280 characters) with 2-3 relevant hashtags.",
  blog_intro: "Write a 3-4 sentence blog post introduction that hooks the reader.",
  ad_copy: "Write short ad copy with a clear headline and one-line call to action.",
  email_subject: "Write 3 alternative email subject lines, each under 60 characters.",
  product_description: "Write a concise product description (50-80 words) highlighting key benefits.",
};

function buildPrompt({ contentType, tone, topic }) {
  const toneGuide = TONE_GUIDES[tone] || TONE_GUIDES.professional;
  const contentGuide = CONTENT_TYPE_GUIDES[contentType] || "Write clear, engaging marketing content.";

  const systemPrompt = [
    "You are a content generation assistant for Apexium's AI Content Studio.",
    `Tone: ${tone}. ${toneGuide}`,
    "Only output the requested content — no preamble, no explanations, no markdown formatting unless explicitly requested.",
  ].join(" ");

  const userPrompt = [
    contentGuide,
    `Topic: ${topic}`,
  ].join("\n");

  return { systemPrompt, userPrompt };
}

module.exports = { buildPrompt, TONE_GUIDES, CONTENT_TYPE_GUIDES };
