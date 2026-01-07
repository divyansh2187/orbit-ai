import React, { useState, useEffect } from "react";
import Card from "./Card";
import { Orbit, SendHorizontal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "../context/ChatContext";
import Nav from "./Nav";

const Center = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [typedResponse, setTypedResponse] = useState("");
  const [usermess, setusermess] = useState("");

  const {
    messages,
    addMessage,
    activeChat,
    setActiveChat,
    loading,
    setLoading,
    theme,
  } = useChat();

  const sendPrompt = async (msg) => {
    const message = msg || prompt;
    if (!message.trim() || loading) return;

    setLoading(true);
    setusermess(message);
    setActiveChat(message); // ✅ FIX: sync active chat immediately

    try {
      const res = await fetch("https://orbit-ai-1s0s.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      addMessage("user", message);
      addMessage("ai", data.reply);
      setResponse(data.reply); // keep local state (no refactor)

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  // Typing effect
  useEffect(() => {
    if (!response) return;
    setTypedResponse("");
    let index = 0;
    const interval = setInterval(() => {
      setTypedResponse((prev) => prev + response[index]);
      index++;
      if (index >= response.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [response]);

  // ✅ FIXED: reliable sync with messages + activeChat
  useEffect(() => {
    if (!activeChat) {
      setResponse("");
      setTypedResponse("");
      setusermess("");
      return;
    }

    const userIndex = messages.findIndex(
      (msg) => msg.role === "user" && msg.content === activeChat
    );

    const aiMessage = messages[userIndex + 1];

    if (aiMessage?.role === "ai") {
      setResponse(aiMessage.content);
      setTypedResponse(aiMessage.content);
      setusermess(activeChat);
    }
  }, [messages, activeChat]);

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}
    >
      <Nav />

      <div className="py-5 sm:py-15 px-6 justify-center md:px-30 flex flex-col gap-10">
        {!usermess ? (
          <div>
            <h2 className="text-7xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Hello
            </h2>
            <p className={`text-3xl font-bold ${
              theme === "light" ? "text-gray-800" : "text-gray-300"
            }`}>
              How can I help you today?
            </p>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <Orbit
              className="size-10"
              color={theme === "light" ? "#3B82F6" : "#FACC15"}
            />
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-3xl font-bold">
              {usermess}
            </span>
          </div>
        )}

        {loading && (
          <div className="h-full w-full flex justify-center">
            <div className="loader"></div>
          </div>
        )}

        {!loading && !response && <Card />}

        {!loading && response && (
          <div
            className={`w-[88%] p-4 rounded-2xl text-base ${
              theme === "light" ? "bg-[#F4F6FA]" : "bg-gray-700"
            }`}
          >
            <ReactMarkdown>{typedResponse}</ReactMarkdown>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div
            className={`px-3 py-2 flex justify-between items-center rounded-2xl ${
              theme === "light"
                ? "bg-[#E3E7EC] text-black"
                : "bg-gray-700 text-white"
            }`}
          >
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-[95%] bg-transparent outline-none"
              placeholder="Enter a prompt here"
              onKeyDown={(e) => e.key === "Enter" && sendPrompt()}
            />
            <button onClick={() => sendPrompt()} disabled={loading}>
              <SendHorizontal />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Center;
