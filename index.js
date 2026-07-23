/**
 * Entry point for the AI & Automation partition.
 * Exposes a single HTTP endpoint that Zapier / n8n / Make can call as a
 * webhook step: send { provider, contentType, tone, topic } and get back
 * generated content ready to push to Google Sheets / Notion.
 *
 * Run: node index.js
 * Test: curl -X POST http://localhost:3000/generate \
 *   -H "Content-Type: application/json" \
 *   -d '{"provider":"claude","contentType":"social_caption","tone":"witty","topic":"new sneaker drop"}'
 */

require("dotenv").config();
const express = require("express");
const { generateContent } = require("./modelSwitcher");

const app = express();
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { provider, contentType, tone, topic, maxTokens } = req.body;

  if (!provider || !contentType || !tone || !topic) {
    return res.status(400).json({
      error: "Missing required fields: provider, contentType, tone, topic",
    });
  }

  try {
    const result = await generateContent({ provider, contentType, tone, topic, maxTokens });
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("[/generate] error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Content Studio API integration running on port ${PORT}`);
});

module.exports = app;
