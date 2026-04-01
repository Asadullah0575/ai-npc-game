import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ✅ AI CONFIG
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-pro"
});

// ✅ Character system prompts
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

// ✅ SINGLE chat route (clean)
app.post("/chat", async (req, res) => {
  try {
    const { message, character } = req.body;

    const prompt = `
${getSystemPrompt(character)}

User: ${message}
`;

const result = await model.generateContent(prompt);
const response = await result.response;

const text = response.text();

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (err) {
    console.error("FULL ERROR:", err);

    res.status(500).json({
      error: "AI request failed",
      details: err.message,
      stack: err.stack
    });
  }
});

// ✅ Root route (helps Render detect server)
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ PORT (ONLY ONCE)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
