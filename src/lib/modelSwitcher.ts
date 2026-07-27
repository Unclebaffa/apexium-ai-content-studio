/**
 * Model Switcher Library
 * Central entry point for AI Content Studio providers.
 */

export interface BuildPromptOptions {
  contentType: string;
  tone: string;
  topic: string;
}

export function buildPrompt({ contentType, tone, topic }: BuildPromptOptions) {
  const selectedTone = tone || "Professional";

  const systemPrompt = `You are the AI Content Assistant for Apexium Technologies Ltd.

Your job is to respond directly and intelligently to the user's request.

The user's request is the primary instruction. First understand what the user wants, then generate the appropriate content.

The user has selected a content tone. You MUST follow the selected tone and make it clearly visible in the writing style.

Selected Tone: ${selectedTone}

Tone rules:

PROFESSIONAL:
Write in a polished, formal, business-appropriate style. Use precise language, credible phrasing, and a structured presentation. Avoid slang and unnecessary casual expressions.

EDUCATIONAL:
Write in a clear, informative, explanatory style. Focus on helping the reader understand the subject. Explain concepts clearly and use examples when useful.

PROMOTIONAL:
Write in a persuasive, engaging, benefit-focused style. Highlight value, outcomes, and reasons to take action. Use a suitable call to action when appropriate.

CONVERSATIONAL:
Write in a friendly, natural, approachable style. Use human-sounding language that feels like a knowledgeable person speaking directly to the reader. Avoid unnecessarily formal corporate language.

IMPORTANT:
The selected tone must meaningfully change the vocabulary, sentence structure, level of formality, emotional style, and presentation of the response.

Do not treat the tone as metadata only.

Do not generate the same response and simply change a few words.

Do not use a fixed response template for all tones.

The user's requested topic, question, or content format must remain unchanged.

The tone controls HOW the response is written, while the user's request controls WHAT the response is about.

Always generate a fresh response based on the user's exact request and selected tone.

Do not use Markdown bold markers such as **text** in the generated output.`;

  const userPrompt = topic;

  return { systemPrompt, userPrompt };
}

export async function generateOpenAI({
  prompt,
  systemPrompt = "",
  maxTokens = 800,
  temperature = 0.7,
}: {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY in environment");

  const messages: { role: string; content: string }[] = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
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

export async function generateGemini({
  prompt,
  systemPrompt = "",
  maxTokens = 800,
  temperature = 0.7,
}: {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing GEMINI_API_KEY in environment");

  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
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

export async function generateClaude({
  prompt,
  systemPrompt = "",
  maxTokens = 800,
  temperature = 0.7,
}: {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY in environment");

  const body: Record<string, unknown> = {
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    temperature,
    messages: [{ role: "user", content: prompt }],
  };
  if (systemPrompt) body.system = systemPrompt;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const text = data.content?.find((c: { type: string; text?: string }) => c.type === "text")?.text ?? "";

  return { text, provider: "claude", raw: data };
}

const PROVIDERS = {
  openai: { generate: generateOpenAI, name: "openai" },
  gemini: { generate: generateGemini, name: "gemini" },
  claude: { generate: generateClaude, name: "claude" },
};

const FALLBACK_ORDER: Array<keyof typeof PROVIDERS> = ["claude", "openai", "gemini"];

export interface GenerateContentOptions {
  provider: "openai" | "gemini" | "claude" | string;
  contentType: string;
  tone: string;
  topic: string;
  maxTokens?: number;
  _tried?: string[];
}

export async function generateContent(options: GenerateContentOptions) {
  const { provider, contentType, tone, topic, maxTokens = 800 } = options;

  if (!provider) throw new Error('A provider is required. Use "openai", "gemini", or "claude".');
  if (!contentType) throw new Error("A contentType is required.");
  if (!tone) throw new Error("A tone is required.");
  if (!topic) throw new Error("A topic is required.");

  const providerKey = provider as keyof typeof PROVIDERS;
  const chosenProvider = PROVIDERS[providerKey];

  if (!chosenProvider) {
    throw new Error(
      `Unknown provider "${provider}". Valid options are: ${Object.keys(PROVIDERS).join(", ")}`
    );
  }

  const { systemPrompt, userPrompt } = buildPrompt({ contentType, tone, topic });

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
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    const triedProviders = options._tried || [provider];
    const nextProvider = FALLBACK_ORDER.find((p) => !triedProviders.includes(p));

    if (!nextProvider) {
      throw new Error(`All AI providers failed. Last error from "${provider}": ${err.message}`);
    }

    console.warn(`[modelSwitcher] "${provider}" failed: ${err.message}. Falling back to "${nextProvider}".`);

    return generateContent({
      ...options,
      provider: nextProvider,
      _tried: [...triedProviders, nextProvider],
    });
  }
}
