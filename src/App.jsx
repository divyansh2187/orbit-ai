import { ChatProvider } from "./context/ChatContext";
import SideBar from "./components/SideBar";
import Center from "./components/Center";
import Nav from "./components/Nav";

function App() {
  return (
    <ChatProvider>
      <div className="flex">
        <SideBar />
        <Center />
      </div>
    </ChatProvider>
  );
}

export default App;
