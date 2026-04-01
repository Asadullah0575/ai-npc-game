import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ✅ Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig: {
    maxOutputTokens: 150,
  },
});

// ✅ Character system prompts
function getSystemPrompt(character) {
  switch (character) {
    case "guard":
      return "You are a strict medieval guard. You are skeptical and give short responses.";
    case "thief":
      return "You are a witty thief. Speak playfully and cleverly.";
    case "king":
      return "You are a proud king. Use authoritative and regal language.";
    default:
      return "You are a helpful character.";
  }
}

// ✅ Chat route
app.post("/chat", async (req, res) => {
  try {
    const { message, character } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Build prompt
    const prompt = `
${getSystemPrompt(character)}

User: ${message}
`;

    // Call Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = response.text();

    // Send response
    res.json({
      reply: text
    });

  } catch (err) {
    console.error("FULL ERROR:", err);

    res.status(500).json({
      error: "AI request failed",
      details: err.message
    });
  }
});

// ✅ Root route (Render needs this)
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
