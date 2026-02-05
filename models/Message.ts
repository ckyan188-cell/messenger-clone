import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  body: { type: String, default: "" },
  image: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  senderName: { type: String },
  senderImage: { type: String },
  conversationId: { type: String }, // 先改用 String 避免 ObjectId 錯誤
  seenIds: [{ type: String }],
  senderId: { type: String }
}, {
  timestamps: true 
});

// 檢查是否已經編譯過，如果是就刪除快取 (這行是救命關鍵)
if (mongoose.models.Message) {
  delete mongoose.models.Message;
}

const Message = mongoose.model("Message", messageSchema);

export default Message;