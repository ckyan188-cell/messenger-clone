import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import ChatInterface from "@/components/ChatInterface";

export default async function Home() {
  // 1. 在伺服器端獲取使用者資料
  const session = await getServerSession(authOptions);

  // 2. 如果沒登入，顯示登入按鈕
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Messenger</h1>
          <p className="text-gray-500 mb-8">請登入以開始與朋友聊天</p>
          
          <a 
            href="/api/auth/signin" 
            className="block w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            使用 Google 帳號登入
          </a>
        </div>
      </div>
    );
  }

  // 3. 如果登入了，把使用者資料傳給聊天介面
  return (
    <main>
      <ChatInterface currentUser={session.user!} />
    </main>
  );
}