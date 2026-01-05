import { Code, Compass, Lightbulb, MessageCircle } from "lucide-react";
import React from "react";
import { useChat } from "../context/ChatContext";

const Card = () => {
  const { addMessage, setActiveChat, setLoading , theme } = useChat();

  const array = [
    { question: "What are the main causes of climate change?", icons: <Compass /> },
    { question: "How does inflation affect an economy?", icons: <Lightbulb /> },
    { question: "What is the significance of the United Nations?", icons: <MessageCircle /> },
    { question: "How does the internet function at a basic level?", icons: <Code /> },
  ];

  const handleCardClick = async (question) => {
    setActiveChat(question);
    addMessage("user", question);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();
      addMessage("ai", data.reply);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-start">
      {array.map(({ question, icons }, idx) => (
        <div
          key={idx}
          onClick={() => handleCardClick(question)}
          className={`w-full sm:w-50 sm:h-40 hover:scale-110 transition-transform duration-300 rounded-2xl px-4 flex flex-col justify-between py-2 cursor-pointer   ${theme === "dark" ? "text-white bg-gray-700" : "text-[#585858] bg-[#F0F4F9]"}  `}
        >
          <p>{question}</p>
          <span className="bg-transparent self-end w-8 h-8 rounded-full flex justify-center items-center">
            {icons}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Card;
