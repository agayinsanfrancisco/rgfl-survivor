import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io("/", {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: true,
    });
    socket.on("connect", () => console.info("[socket] connected", socket?.id));
    socket.on("disconnect", (r) => console.info("[socket] disconnected:", r));
  }
  return socket;
}