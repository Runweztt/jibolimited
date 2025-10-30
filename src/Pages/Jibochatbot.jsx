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
    // wrapper does not capture pointer events to avoid blocking touches when closed
    <div
      className="fixed right-5 sm:bottom-5 bottom-0 z-[200] flex flex-col items-end pointer-events-none"
      aria-live="polite"
    >
      {/* Toggle Button - always accepts pointer events */}
      <button
        onClick={() => setShowBot((prev) => !prev)}
        className="pointer-events-auto bg-[#3b82f6] text-white p-4 rounded-full shadow-2xl hover:bg-[#2563eb] active:scale-95 transition-all duration-200 flex items-center justify-center"
        aria-label={showBot ? "Close chat" : "Open chat"}
      >
        {showBot ? (
          <IoClose className="text-2xl" />
        ) : (
          <IoChatbubbleEllipsesOutline className="text-2xl" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`mt-3 w-[95vw] sm:w-[420px] max-w-[420px] rounded-2xl shadow-2xl border border-[#142235] transform transition-all duration-300 ease-in-out overflow-hidden ${
          showBot
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-5 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="fixed right-5 bottom-4 sm:bottom-6 top-auto z-[200] flex flex-col items-end pointer-events-none sm:translate-y-0 translate-y-20"
>
          <div className="flex items-center gap-2">
            <Chatboticon />
            <h2 className="text-lg font-semibold tracking-wide">Jibo Ai</h2>
          </div>
          <IoChevronDown className="text-2xl opacity-80 hover:opacity-100 cursor-pointer transition-opacity" />
        </div>

        {/* Chat Body */}
        <div
          ref={chatbodymove}
          className="flex flex-col gap-3 h-[420px] sm:h-[460px] overflow-y-auto p-4"
          style={{ background: "#0b1020" }}
        >
          {/* Initial Greeting */}
          <div className="flex items-start gap-3 bg-[#071224] border border-[#142235] p-3 rounded-xl">
            <Chatboticon />
            <p className="text-gray-200 text-sm leading-relaxed">
              Hey there 👋 <br /> How can I help you today?
            </p>
          </div>

          {/* Chat Messages */}
          {ChatHistory.map((chat, i) => (
            <div key={i} className="flex items-start gap-3 bg-[#071224] border border-[#142235] p-3 rounded-xl">
              <Chatmessage chat={chat} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-[#0b1020] border-t border-[#142235] px-4 py-3">
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
