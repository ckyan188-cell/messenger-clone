import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher"; // 使用 @ 代表根目錄
import Message from "@/models/Message";      // 引入你剛剛建立的 Model
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 1. 從 body 裡拿出 userName
    const { message, conversationId, userName } = body; 

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.DATABASE_URL!);
    }

    const newMessage = await Message.create({
      body: message,
      conversationId: conversationId,
      senderName: userName || "Anonymous", // 2. 存入資料庫 (如果沒填就叫 Anonymous)
    });

    await pusherServer.trigger(conversationId, 'messages:new', newMessage);

    return NextResponse.json(newMessage);

  } catch (error) {
    // ... (錯誤處理不變)
    console.log("ERROR_MESSAGES", error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}