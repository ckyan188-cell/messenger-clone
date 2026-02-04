import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  lastMessageAt: { type: Date, default: Date.now }, // 用來排序，最新的聊天室排上面
  name: { type: String }, // 群組聊天才有名稱
  isGroup: { type: Boolean, default: false }, // 判斷是否為群組
  
  // 關聯：這個聊天室的訊息 (通常只存 ID)
  messagesIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  
  // 關聯：參與者 (User IDs)
  userIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
export default Conversation;