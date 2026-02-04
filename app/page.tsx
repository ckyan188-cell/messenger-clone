'use client';

import { useState } from "react";
import axios from "axios";
import ChatBody from "@/components/ChatBody"; 

export default function Home() {
  // 記得用你之前改過的那個 24字元 ID
  const conversationId = "660d5ecb8b5c9c62b3c7b4b5"; 
  const [inputMessage, setInputMessage] = useState("");
  
  // 1. 新增名字狀態，預設叫 "User A"
  const [userName, setUserName] = useState("User A"); 
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage) return;
    setIsLoading(true);

    try {
      await axios.post('/api/messages', {
        message: inputMessage,
        conversationId: conversationId,
        userName: userName // 2. 把名字一起傳給後端
      });
      setInputMessage(""); 
    } catch (error) {
      console.error("發送失敗", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col max-w-2xl mx-auto border bg-white text-black shadow-xl">
      <div className="p-4 border-b bg-blue-600 text-white font-bold flex justify-between items-center">
        <span>Messenger Clone</span>
        
        {/* 3. 右上角加一個輸入名字的地方 */}
        <input 
          type="text" 
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="text-black px-2 py-1 rounded text-sm w-24 focus:outline-none"
          placeholder="你的名字"
        />
      </div>

      <ChatBody 
        conversationId={conversationId}
        initialMessages={[]} 
      />

      <div className="p-4 border-t flex gap-2 bg-gray-100">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 border p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="輸入訊息..."
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading) sendMessage();
          }}
        />
        <button 
          onClick={sendMessage}
          disabled={isLoading}
          className={`px-6 py-2 rounded text-white font-semibold transition
            ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
          `}
        >
          送出
        </button>
      </div>
    </div>
  );
}