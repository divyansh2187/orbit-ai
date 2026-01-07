import React, { createContext, useContext, useState, useEffect } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]); // recent chats
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  // Apply theme
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Add a new chat
  const addChat = (chat) => {
    setMessages((prev) => [chat, ...prev]);
  };

  // Update chat response
  const updateChat = (id, response) => {
    setMessages((prev) =>
      prev.map((chat) =>
        chat.id === id
          ? { ...chat, response, loading: false }
          : chat
      )
    );

    setActiveChat((prev) =>
      prev && prev.id === id
        ? { ...prev, response, loading: false }
        : prev
    );
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        activeChat,
        setActiveChat,
        addChat,
        updateChat,
        loading,
        setLoading,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
