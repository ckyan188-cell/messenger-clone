import PusherServer from "pusher";
import PusherClient from "pusher-js";

// 1. 建立後端用的實例 (Pusher Server)
// 用於 API Routes，權限最大，可以觸發事件
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// 2. 建立前端用的實例 (Pusher Client)
// 用於 React 组件，監聽訊息
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!, 
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  }
);