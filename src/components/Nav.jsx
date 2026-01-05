import { User } from "lucide-react";
import { useChat } from "../context/ChatContext";

const Nav = () => {
  const { theme } = useChat();

  return (
    <div className={`flex justify-between px-3 py-4 relative text-black dark:text-white  transition-colors duration-300   ${
        theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}>
      <h1 className={`text-3xl font-thin ${theme === "dark" ? "text-white" : "text-[#585858]"}`}>
        Orbit AI
      </h1>
      <User size={30} fill={theme === "dark" ? "white" : "black"} color={theme === "dark" ? "white" : "black"} />
    </div>
  );
};

export default Nav;
