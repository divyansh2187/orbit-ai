
import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";

const Center = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleAsk = async () => {
    try {
      // ⚠️ API key is exposed here
      const ai = new GoogleGenAI({
        apiKey: "YOUR_GEMINI_API_KEY_HERE",
      });

      const res = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      setResponse(res.text);
    } catch (err) {
      console.error(err);
      setResponse("Error fetching response");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">Gemini AI Chat</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask something..."
        className="border p-2 mr-2"
      />
      <button onClick={handleAsk} className="bg-blue-500 text-white p-2 rounded">
        Send
      </button>

      <div className="mt-4 p-3 border rounded bg-gray-100">
        <strong>Response:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default Center;

