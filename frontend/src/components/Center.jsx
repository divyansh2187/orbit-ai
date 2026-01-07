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
    setActiveChat(message);

    try {
      const res = await fetch("https://orbit-ai-1s0s.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

    
      addMessage("user", message);
      addMessage("ai", data.reply);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  
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
      setusermess(activeChat);
    }
  }, [messages, activeChat]);


  useEffect(() => {
    if (!response || response.length === 0) return;

    let index = 0;
    setTypedResponse("");

    const interval = setInterval(() => {
      setTypedResponse((prev) => {
        if (index >= response.length) {
          clearInterval(interval);
          return prev;
        }
        const nextChar = response.charAt(index);
        index++;
        return prev + nextChar;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [response]);

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}
    >
      <Nav />

      <div className="py-5 px-6 md:px-30 flex flex-col gap-10">
        {!usermess ? (
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
              {usermess}
            </span>
          </div>
        )}

        {loading && (
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
        )}

        {!loading && !response && <Card />}

        {!loading && response && (
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
              theme === "light"
                ? "bg-[#E3E7EC] text-black"
                : "bg-gray-700 text-white"
            }`}
          >
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-transparent outline-none"
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
