import React, { useEffect, useState } from "react";
import { Orbit, SendHorizontal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "../context/ChatContext";
import Card from "./Card";
import Nav from "./Nav";

const Center = () => {
  const [prompt, setPrompt] = useState("");
  const [typedResponse, setTypedResponse] = useState("");

  const {
    messages,
    activeChat,
    setActiveChat,
    addChat,
    updateChat,
    loading,
    setLoading,
    theme,
  } = useChat();

  const sendPrompt = async (msg) => {
    const message = msg || prompt;
    if (!message.trim() || loading) return;

    const newChat = {
      id: Date.now(),
      prompt: message,
      response: "",
      loading: true,
    };

    setActiveChat(newChat);
    addChat(newChat);
    setLoading(true);
    setPrompt("");

    try {
      const res = await fetch(
        "https://orbit-ai-1s0s.onrender.com/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        }
      );

      const data = await res.json();
      updateChat(newChat.id, data.reply);
    } catch (err) {
      console.error(err);
      updateChat(newChat.id, "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Typing effect (driven by activeChat)
  useEffect(() => {
    if (!activeChat?.response) return;

    setTypedResponse("");
    let index = 0;

    const interval = setInterval(() => {
      setTypedResponse((prev) => prev + activeChat.response[index]);
      index++;
      if (index >= activeChat.response.length) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [activeChat]);

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}
    >
      <Nav />

      <div className="py-5 px-6 md:px-30 flex flex-col gap-10">
        {!activeChat ? (
          <div>
            <h2 className="text-7xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Hello
            </h2>
            <p className="text-3xl font-bold text-gray-400">
              How can I help you today?
            </p>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <Orbit className="size-10" />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {activeChat.prompt}
            </span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
        )}

        {!loading && !activeChat && <Card />}

        {!loading && activeChat?.response && (
          <div
            className={`w-[88%] p-4 rounded-2xl ${
              theme === "light" ? "bg-[#F4F6FA]" : "bg-gray-700"
            }`}
          >
            <ReactMarkdown>{typedResponse}</ReactMarkdown>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div
            className={`px-3 py-2 flex items-center rounded-2xl ${
              theme === "light" ? "bg-[#E3E7EC]" : "bg-gray-700"
            }`}
          >
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendPrompt()}
              className="w-full bg-transparent outline-none"
              placeholder="Enter a prompt"
            />
            <button onClick={() => sendPrompt()} disabled={loading}>
              <SendHorizontal />
            </button>
          </div>

          <p className="text-center text-sm text-gray-400">
            Orbit may display inaccurate info. Double-check responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Center;
