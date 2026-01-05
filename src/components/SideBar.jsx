import { MenuIcon, MessageCircle, Sun, Moon } from "lucide-react";
import React, { useState } from "react";
import { useChat } from "../context/ChatContext";

const limitWords = (text, limit = 4) => {
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "..." : text;
};

const SideBar = () => {
  const [extended, setExtended] = useState(true);
  const { messages, setActiveChat, activeChat, theme, toggleTheme } = useChat();

  const recentPrompts = messages.filter((msg) => msg.role === "user").slice(-10).reverse();

  return (
    <div className={` min-h-screen flex flex-col gap-5 px-3  py-5 transition-colors duration-300 ${
        theme === "light" ? "bg-[#F0F4F9] text-black" : "bg-gray-800 text-white"
      }`}>
      <div className="flex flex-col gap-3">
        <h5 onClick={() => setExtended(!extended)} className="cursor-pointer">
          <MenuIcon />
        </h5>
      </div>

      {extended && (
        <div className="flex flex-col gap-5">
          <div className="h-[70vh] overflow-y-auto flex gap-1 flex-col">
            <h5 className="text-sl mb-2 text-gray-500 dark:text-gray-400">Recent</h5>
            {recentPrompts.length === 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500">No chats yet</p>
            )}
            {recentPrompts.map((item, index) => (
              <div
                key={index}
                onClick={() => setActiveChat(item.content)}
                className={`flex items-center gap-2 text-sm cursor-pointer px-2 py-1 rounded-lg hover:scale-95 ${theme === "dark" ? "text-white bg-gray-900" : "text-black bg-[#ced1d6]"} ${
                  activeChat === item.content ? "bg-[#DDE8FF] dark:bg-blue-200 text-blue-700" : ""
                }`}
              >
                <MessageCircle size={14} className={`${theme === "dark" ? "text-white" : "text-black"}`} />
                <span>{limitWords(item.content)}</span>
              </div>
            ))}
          </div>

          <button
            className={`flex items-center relative bottom-0 gap-2 px-3 py-2 whitespace-nowrap rounded-2xl ${theme === "dark" ? "text-white bg-gray-900" : "text-[#585858] bg-[#E6EAF1]"} `}
            onClick={toggleTheme}
          >
            {theme === "light" ? <Moon /> : <Sun />}
            {extended && <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default SideBar;
