import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  body: { type: String }, // 文字內容
  image: { type: String }, // 圖片網址 (如果有傳圖)
  createdAt: { type: Date, default: Date.now },

  senderName: { type: String },

  // 關聯：誰看過這條訊息 (已讀功能)
  seenIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // 關聯：屬於哪個聊天室
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  
  // 關聯：發送者是誰
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;