import { useState, useEffect } from "react";
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

  const { messages, addMessage, activeChat, loading, setLoading, theme } = useChat();

  const sendPrompt = async (msg) => {
    const message = msg || prompt;
    if (!message.trim() || loading) return;

    setLoading(true);
    setusermess(message);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setResponse(data.reply);
      addMessage("user", message);
      addMessage("ai", data.reply);
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

  // Show recent clicked chat
  useEffect(() => {
    if (!activeChat) {
      setResponse("");
      setTypedResponse("");
      setusermess("");
      return;
    }

    const index = messages.findIndex(
      (msg) => msg.role === "user" && msg.content === activeChat
    );

    if (index !== -1 && messages[index + 1]?.role === "ai") {
      setResponse(messages[index + 1].content);
      setTypedResponse(messages[index + 1].content);
      setusermess(activeChat);
    }
  }, [activeChat, messages]);

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}
    >
      <Nav/>
      <div className="py-5 sm:py-15 px-6 justify-center md:px-30 flex flex-col gap-10">
        {!usermess ? (
          <div>
            <h2 className="text-7xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Hello
            </h2>
            <p className={`text-3xl font-bold ${theme === "light" ? "text-gray-800" : "text-gray-300"}`}>
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
            <div className="loader" ></div>
          </div>
        )}

        {!loading && !response && <Card />}

        {!loading && response && (
          <div
            className={`w-[88%] p-4 rounded-2xl text-base overflow-hidden transition-colors duration-300 ${
              theme === "light" ? "bg-[#F4F6FA]" : "bg-gray-700"
            }`}
          >
            <ReactMarkdown>{typedResponse}</ReactMarkdown>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div
            className={`w-[100%] md:[88%] px-3 py-2 flex justify-between items-center rounded-2xl transition-colors duration-300 ${
              theme === "light" ? "bg-[#E3E7EC] text-black" : "bg-gray-700 text-white"
            }`}
          >
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              type="text"
              className={`w-[95%] h-full border-none outline-none focus:ring-0 bg-transparent ${theme === "dark" ? "text-white" : "text-black"}`}
              placeholder="Enter a prompt here"
              onKeyDown={(e) => e.key === "Enter" && sendPrompt()}
            />
            <button onClick={() => sendPrompt()} disabled={loading}>
              <SendHorizontal className={loading ? "opacity-50" : ""} />
            </button>
          </div>

          <div className={`text-center w-[90%] font-thin text-[2vw] md:text-[1.5vw] transition-colors duration-300 ${
            theme === "light" ? "text-gray-500" : "text-gray-400"
          }`}>
            Orbit may display inaccurate info, including about people, so double-check its responses.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Center;
