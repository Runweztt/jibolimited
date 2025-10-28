import { useEffect, useRef, useState } from "react";
import {
  IoChatbubbleEllipsesOutline,
  IoClose,
  IoChevronDown,
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
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Toggle Button */}
      <button
        onClick={() => setShowBot((prev) => !prev)}
        className="bg-[#3b82f6] text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 active:scale-95 transition-all duration-200 flex items-center justify-center"
      >
        {showBot ? (
          <IoClose className="text-2xl" />
        ) : (
          <IoChatbubbleEllipsesOutline className="text-2xl" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`mt-3 w-[95vw] sm:w-[420px] max-w-[420px] rounded-2xl shadow-2xl border border-gray-800 transform transition-all duration-300 ease-in-out overflow-hidden ${
          showBot
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-5 pointer-events-none"
        }`}
        style={{
          background:
            "linear-gradient(160deg, #0d1117 0%, #111827 70%, #000000 100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#3b82f6] text-white shadow-md">
          <div className="flex items-center gap-2">
            <Chatboticon  />
            <h2 className="text-lg font-semibold tracking-wide">
              Jibo Ai
            </h2>
          </div>
          <IoChevronDown className="text-2xl opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
        </div>

        {/* Chat Body */}
        <div
          ref={chatbodymove}
          className="flex flex-col gap-3 h-[420px] sm:h-[460px] overflow-y-auto p-4 bg-gradient-to-b from-gray-900 to-black scroll-smooth"
        >
          {/* Initial Greeting */}
          <div className="flex items-start gap-3 bg-white/5 backdrop-blur-md border border-gray-700 p-3 rounded-xl">
            <Chatboticon />
            <p className="text-gray-200 text-sm leading-relaxed">
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>

          {/* Chat Messages */}
          {ChatHistory.map((chat, i) => (
            <div className=" flex items-start gap-3 bg-white/5 backdrop-blur-md border border-gray-700 p-3 rounded-xl">
            <Chatmessage key={i} chat={chat} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-black/80 backdrop-blur-md border-t border-gray-700 px-4 py-3">
          <Chatform
            ChatHistory={ChatHistory}
            setChatHistory={setChatHistory}
            generateBot={generateBot}
          />
        </div>
      </div>
    </div>
  );
};

export default Jibochatbot;
