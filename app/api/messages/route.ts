import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher"; 
import Message from "@/models/Message";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    console.log("👉 [1] 收到請求");
    const body = await request.json();
    const { message, image, conversationId, userName, userImage } = body; 
    console.log("👉 [2] 資料解構:", { message, hasImage: !!image, userName });

    // 連線資料庫
    if (mongoose.connection.readyState === 0) {
      console.log("👉 [3] 正在連線 MongoDB...");
      await mongoose.connect(process.env.DATABASE_URL!);
      console.log("👉 [3] MongoDB 連線成功");
    }

    // 建立訊息
    console.log("👉 [4] 正在寫入資料庫...");
    const newMessage = await Message.create({
      body: message || "",
      image: image || null,
      conversationId: conversationId,
      senderName: userName || "Anonymous",
      senderImage: userImage || null
    });
    console.log("👉 [5] 資料庫寫入成功:", newMessage._id);

    // Pusher 推播
    console.log("👉 [6] 正在觸發 Pusher...");
    await pusherServer.trigger(conversationId, 'new-message', newMessage);
    console.log("👉 [7] Pusher 觸發成功");

    return NextResponse.json(newMessage);

  } catch (error: any) {
    console.error("❌ [CRITICAL ERROR] 發生錯誤:", error);
    // 這裡會把錯誤具體回傳給瀏覽器，讓你按 F12 也能看到
    return NextResponse.json({ 
      error: 'Internal Error', 
      details: error.message 
    }, { status: 500 });
  }
}