import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/**
 * ✅ EXPLICIT FRONTEND ORIGIN
 * (Do NOT rely on env for CORS — this avoids silent failure)
 */
const ALLOWED_ORIGIN = "https://orbit-ai-1.onrender.com";

/**
 * ✅ CORS CONFIG (PRODUCTION SAFE)
 */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server & same-origin requests
      if (!origin) return callback(null, true);

      if (origin === ALLOWED_ORIGIN) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Preflight requests
app.options("*", cors());

app.use(express.json());

/**
 * ✅ CHAT API
 */
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": ALLOWED_ORIGIN,
          "X-Title": "Orbit AI",
        },
        body: JSON.stringify({
          model: "google/gemma-3n-e2b-it:free",
          messages: [{ role: "user", content: message }],
        }),
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      console.error("OpenRouter response:", data);
      return res.status(500).json({ error: "Invalid AI response" });
    }

    res.json({
      reply: data.choices[0].message.content,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Server crashed" });
  }
});

/**
 * ✅ ROOT ROUTE (OPTIONAL BUT GOOD)
 */
app.get("/", (req, res) => {
  res.send("Orbit AI Backend is running 🚀");
});

/**
 * ✅ START SERVER (RENDER SAFE)
 */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
