/**
 * Manual test script — not a full test suite, just a quick way to sanity-check
 * each provider and the fallback logic before demoing to the group.
 * Run: node test/manualTest.js
 */

require("dotenv").config();
const { generateContent } = require("./modelSwitcher");

async function run() {
  const cases = [
    { provider: "openai", contentType: "social_caption", tone: "casual", topic: "back to school sale" },
    { provider: "gemini", contentType: "ad_copy", tone: "persuasive", topic: "fitness app launch" },
    { provider: "claude", contentType: "blog_intro", tone: "professional", topic: "career readiness tips" },
  ];

  for (const testCase of cases) {
    console.log(`\n--- Testing provider: ${testCase.provider} ---`);
    try {
      const result = await generateContent(testCase);
      console.log("Output:", result.text);
    } catch (err) {
      console.error("Failed:", err.message);
    }
  }
}

run();
