'use client';

import { useEffect, useState } from 'react';
// 如果 @/lib/pusher 還有紅線，請試著改成相對路徑: ../../../lib/pusher
import { pusherClient } from '@/lib/pusher'; 

// 1. 定義這元件會收到什麼資料 (解決 props 的紅線)
interface ChatBodyProps {
  initialMessages: any[]; // 先用 any[] (任意陣列) 讓紅線消失
  conversationId: string;
}

const ChatBody = ({ initialMessages = [], conversationId }: ChatBodyProps) => {
  // 2. 定義 useState 的類型
  const [messages, setMessages] = useState<any[]>(initialMessages);

  useEffect(() => {
    // 訂閱這個聊天室的 channel
    const channel = pusherClient.subscribe(conversationId);

    // 3. 定義收到的新訊息是什麼類型 (解決 newMessage 的紅線)
    const messageHandler = (newMessage: any) => {
      setMessages((current) => [...current, newMessage]); 
    };

    channel.bind('messages:new', messageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      channel.unbind('messages:new', messageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
        {/* 簡單把訊息印出來測試 */}
        {messages.map((message, i) => (
            <div key={i} className="mb-2">
                {message.body || "New Message"}
            </div>
        ))}
    </div>
  );
};

export default ChatBody;