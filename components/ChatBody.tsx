'use client';

import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";

interface ChatBodyProps {
  conversationId: string;
  initialMessages?: any[];
}

export default function ChatBody({ conversationId, initialMessages = [] }: ChatBodyProps) {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: 'ap3' // 你的 cluster
    });

    const channel = pusher.subscribe(conversationId);

    channel.bind('new-message', (newMessage: any) => {
      setMessages((current) => {
        if (current.find(m => m._id === newMessage._id)) return current;
        return [...current, newMessage];
      });
    });

    return () => {
      pusher.unsubscribe(conversationId);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50 h-full">
      {messages.map((msg, i) => (
        <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* 1. 這裡就是你要的大頭貼！ */}
          <div className="flex-shrink-0 cursor-pointer hover:opacity-75 transition">
            <img 
              src={msg.senderImage || "/placeholder.png"} // 如果沒有圖就用預設的
              alt="Avatar"
              className="w-10 h-10 rounded-full bg-gray-300 object-cover border border-gray-200"
              onError={(e) => {
                // 如果圖片載入失敗，變回預設圖 (避免破圖)
                (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
              }}
            />
          </div>

          <div className="flex flex-col items-start max-w-[80%]">
            {/* 名字和時間 */}
            <div className="flex items-center gap-2 mb-1">
               <span className="text-sm font-bold text-gray-700">
                 {msg.senderName || "Unknown"}
               </span>
               <span className="text-[10px] text-gray-400">
                 {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
               </span>
            </div>

            {/* 訊息內容 (圖片或文字) */}
            {msg.image ? (
              <img 
                src={msg.image} 
                alt="Image" 
                className="rounded-xl max-w-full sm:max-w-[300px] max-h-[300px] object-cover border-2 border-blue-100 shadow-sm hover:scale-105 transition cursor-pointer"
              />
            ) : (
              <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm text-gray-800 break-words">
                {msg.body}
              </div>
            )}
          </div>

        </div>
      ))}
      <div ref={bottomRef} className="pt-2" />
    </div>
  );
}