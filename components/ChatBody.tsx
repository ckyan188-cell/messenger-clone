'use client';

import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher'; // 前端用 client 實例

interface ChatBodyProps {
  initialMessages?: any[];
  conversationId: string;
}

const ChatBody = ({ initialMessages = [], conversationId }: ChatBodyProps) => {
  const [messages, setMessages] = useState<any[]>(initialMessages);

  useEffect(() => {
    // 訂閱 Pusher 頻道
    const channel = pusherClient.subscribe(conversationId);

    // 定義當收到 'messages:new' 事件時要做什麼
    const messageHandler = (newMessage: any) => {
      // 把新訊息加到現有的陣列後面
      setMessages((current) => [...current, newMessage]);
    };

    // 綁定事件
    channel.bind('messages:new', messageHandler);

    // 清理函數 (很重要！避免重複訂閱)
    return () => {
      pusherClient.unsubscribe(conversationId);
      channel.unbind('messages:new', messageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 h-[400px]">
        {messages.map((message, i) => (
            <div key={i} className="mb-4">
                {/* 1. 顯示名字 (小小的灰色字) */}
                <div className="text-xs text-gray-500 mb-1 ml-1">
                  {message.senderName || "Unknown"}
                </div>
                
                {/* 訊息本體 */}
                <div className="p-2 bg-white rounded shadow w-fit">
                    {message.body}
                </div>
            </div>
        ))}
        {/* 自動捲動到底部的元素 */}
        <div /> 
    </div>
  );
};

export default ChatBody;