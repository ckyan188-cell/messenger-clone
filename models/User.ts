import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  emailVerified: { type: Date },
  image: { type: String }, // 存 Cloudinary 的頭像網址
  hashedPassword: { type: String }, // 如果有做帳號密碼登入才需要
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // 關聯：這個使用者參與了哪些對話
  conversationIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Conversation" }],
  
  // 關聯：這個使用者看過了哪些訊息 (已讀功能)
  seenMessageIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  
  // 為了 NextAuth (Google/GitHub 登入) 綁定帳號用
  accounts: [{ type: Object }], 
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;