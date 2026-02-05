'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import ChatBody from "@/components/ChatBody"; 
import { CldUploadButton } from 'next-cloudinary';

interface ChatInterfaceProps {
  currentUser: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export default function ChatInterface({ currentUser }: ChatInterfaceProps) {
  const conversationId = "660d5ecb8b5c9c62b3c7b4b5"; 
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);

  // 🛡️ 新增：專門管理頭像的狀態
  // 預設先用 Google 的圖，如果沒有就用預設圖
  const [avatarSrc, setAvatarSrc] = useState(currentUser.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png");

  // 當 currentUser 改變時 (例如重新登入)，更新頭像
  useEffect(() => {
    setAvatarSrc(currentUser.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png");
  }, [currentUser]);

  const handleUpload = (result: any) => {
    const imageUrl = result?.info?.secure_url;
    if (imageUrl) {
        setTempImage(imageUrl); 
    }
  }

  const sendMessage = async () => {
    if (!inputMessage && !tempImage) return;
    
    setIsLoading(true);

    try {
      await axios.post('/api/messages', {
        message: inputMessage,
        image: tempImage, 
        conversationId: conversationId,
        userName: currentUser.name,
        userImage: currentUser.image
      });
      
      setInputMessage(""); 
      setTempImage(null); 

    } catch (error) {
      console.error("發送失敗", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col max-w-2xl mx-auto border bg-white text-black shadow-xl">
      <div className="p-4 border-b bg-blue-600 text-white font-bold flex justify-between items-center">
        <div className="flex items-center gap-3">
          
          {/* 🛡️ 這裡改用了 avatarSrc 狀態，並加上 onError */}
          <img 
            src={avatarSrc} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full border-2 border-white object-cover bg-gray-200"
            onError={() => {
              // 一旦發生錯誤，立刻換成這張圖
              setAvatarSrc("https://cdn-icons-png.flaticon.com/512/149/149071.png");
            }}
          />
          
          <span>{currentUser.name}</span>
        </div>
        <a href="/api/auth/signout" className="text-xs bg-blue-700 px-3 py-1 rounded hover:bg-blue-800 transition">
            登出
        </a>
      </div>

      <ChatBody conversationId={conversationId} initialMessages={[]} />

      {tempImage && (
        <div className="px-4 pt-2 bg-gray-50 border-t flex items-center gap-2">
            <div className="relative">
                <img 
                    src={tempImage} 
                    alt="Preview" 
                    className="h-20 w-auto rounded-md border border-gray-300 object-cover"
                />
                <button 
                    onClick={() => setTempImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                    ✕
                </button>
            </div>
            <span className="text-xs text-gray-500">準備發送圖片...</span>
        </div>
      )}

      <div className="p-4 border-t flex gap-2 bg-gray-100 items-center">
        <CldUploadButton 
          options={{ maxFiles: 1 }} 
          onSuccess={handleUpload} 
          uploadPreset="messenger-clone" 
        >
          <div className="text-blue-500 hover:text-blue-700 cursor-pointer p-2 hover:bg-blue-50 rounded-full transition">
            📷
          </div>
        </CldUploadButton>

        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 border p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={tempImage ? "新增說明文字..." : `以 ${currentUser.name} 的身份發言...`}
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isLoading) sendMessage();
          }}
        />
        <button 
          onClick={sendMessage}
          disabled={isLoading || (!inputMessage && !tempImage)} 
          className={`px-6 py-2 rounded text-white font-semibold transition
            ${(isLoading || (!inputMessage && !tempImage)) ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
          `}
        >
          送出
        </button>
      </div>
    </div>
  );
}