import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ✅ AI CONFIG (keep this)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// ✅ ROUTE (example)
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const completion = await openai.chat.completions.create({
    model: "openai/gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  });

  res.json({ reply: completion.choices[0].message.content });
});

// ✅ PORT (add this for Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* Character system prompts */
function getSystemPrompt(character) {
  switch (character) {
    case "guard":
      return "You are a strict medieval guard. You are skeptical and short in responses.";
    case "thief":
      return "You are a witty thief. Speak playfully.";
    case "king":
      return "You are a proud king. Use authoritative language.";
    default:
      return "You are a helpful character.";
  }
}

app.post("/chat", async (req, res) => {
  try {
    const { message, character } = req.body;

    const response = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct", // free model on OpenRouter
      messages: [
        { role: "system", content: getSystemPrompt(character) },
        { role: "user", content: message }
      ],
      max_tokens: 150,
    });

    return res.json({
      reply: response.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "AI request failed",
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
