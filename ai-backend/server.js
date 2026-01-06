import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:5173",
          "X-Title": "AI Chat App",
        },
        body: JSON.stringify({
          model: "google/gemma-3n-e2b-it:free",
          messages: [{ role: "user", content: message }],
        }),
      }
    );

    const data = await response.json();

    if (!data.choices) {
      console.error("OpenRouter response:", data);
      return res.status(500).json({ error: "Invalid AI response" });
    }

    res.json({
      reply: data.choices[0].message.content,
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server crashed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
