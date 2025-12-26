import { useEffect, useRef, useState } from "react";
import {
  IoChatbubbleEllipsesOutline,
  IoClose,
} from "react-icons/io5";
import Chatboticon from "../chat/Chatboticon";
import Chatform from "../chat/Chatform";
import Chatmessage from "../chat/Chatmessage";
import { companyInfo } from "../Companyinfo";

const Jibochatbot = () => {
  const [ChatHistory, setChatHistory] = useState([
    { hideInChat: true, role: "model", text: companyInfo },
  ]);
  const [showBot, setShowBot] = useState(false);
  const chatbodymove = useRef();

  const generateBot = async (history) => {
    const updateHistory = (text) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "thinking..."),
        { role: "model", text },
      ]);
    };

    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

    const requestData = {
      method: "post",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestData);
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error.message || "Something went wrong");
      const apiResponse = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      updateHistory(apiResponse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    chatbodymove.current?.scrollTo({
      top: chatbodymove.current.scrollHeight,
      behavior: "smooth",
    });
  }, [ChatHistory]);

  return (
    <div
      className="fixed left-4 right-4 sm:left-5 sm:right-auto bottom-4 sm:bottom-5 z-[150] flex flex-col items-stretch sm:items-start pointer-events-none"
      aria-live="polite"
    >
      {/* Chat Window - Mobile Full Width */}
      <div
        className={`mb-3 w-full sm:w-[420px] sm:max-w-[420px] rounded-2xl shadow-2xl border border-gray-800 transform transition-all duration-300 ease-in-out overflow-hidden ${
          showBot
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-5 pointer-events-none"
        }`}
        style={{ 
          background: "linear-gradient(135deg, #0b1020 0%, #1a1f2e 100%)",
          backdropFilter: "blur(10px)",
          maxHeight: "calc(100vh - 120px)"
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002B5C] to-[#003d7a] px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <Chatboticon />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Jibo AI</h2>
              <p className="text-xs text-blue-100">Online</p>
            </div>
          </div>
          <button
            onClick={() => setShowBot(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close chat"
          >
            <IoClose className="text-xl sm:text-2xl text-white" />
          </button>
        </div>

        {/* Chat Body - Responsive Height */}
        <div
          ref={chatbodymove}
          className="flex flex-col gap-2 sm:gap-3 h-[50vh] sm:h-[420px] overflow-y-auto p-3 sm:p-4 bg-gradient-to-b from-[#0b1020] to-[#1a1f2e]"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#374151 #1a1f2e"
          }}
        >
          {/* Initial Greeting */}
          <div className="flex items-start gap-2 sm:gap-3 bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-3 sm:p-4 rounded-2xl rounded-tl-none shadow-lg">
            <div className="flex-shrink-0">
              <Chatboticon />
            </div>
            <p className="text-gray-200 text-sm leading-relaxed">
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>

          {/* Chat Messages */}
          {ChatHistory.map((chat, i) => (
            !chat.hideInChat && (
              <div 
                key={i} 
                className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl shadow-lg ${
                  chat.role === "user" 
                    ? "bg-blue-600/20 border border-blue-500/30 rounded-tr-none ml-4 sm:ml-8" 
                    : "bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-tl-none"
                }`}
              >
                <Chatmessage chat={chat} />
              </div>
            )
          ))}
        </div>

        {/* Footer - Touch Friendly */}
        <div className="bg-[#0b1020] border-t border-gray-800 px-3 sm:px-4 py-3 sm:py-4">
          <Chatform
            ChatHistory={ChatHistory}
            setChatHistory={setChatHistory}
            generateBot={generateBot}
          />
        </div>
      </div>

      {/* Toggle Button - Bottom Right, Touch Friendly */}
      <button
        onClick={() => setShowBot((prev) => !prev)}
        className="pointer-events-auto self-end bg-gradient-to-r from-[#002B5C] to-[#003d7a] text-white p-4 sm:p-4 rounded-full shadow-2xl hover:shadow-[#002B5C]/50 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center min-w-[56px] min-h-[56px]"
        aria-label={showBot ? "Close chat" : "Open chat"}
      >
        {showBot ? (
          <IoClose className="text-2xl" />
        ) : (
          <IoChatbubbleEllipsesOutline className="text-2xl" />
        )}
      </button>
    </div>
  );
};

export default Jibochatbot;
