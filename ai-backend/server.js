import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const ALLOWED_ORIGIN = "https://orbit-ai-1.onrender.com";

/* ✅ SINGLE CORS CONFIG (used everywhere) */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // server-to-server
    if (origin === ALLOWED_ORIGIN) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

/* ✅ Apply SAME config */
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

/* ✅ API */
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

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

    res.json({
      reply: data.choices?.[0]?.message?.content || "No response",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server crashed" });
  }
});

/* ✅ Health check */
app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
