import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Point at OpenRouter’s base URL
  baseURL: "https://openrouter.ai/api/v1",
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

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
