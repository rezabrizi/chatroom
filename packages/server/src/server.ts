import http from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { verifyToken } from "./utils/jwtUtils";
import app from "./app";
import { JwtPayload } from "jsonwebtoken";
import { socketHandlers } from "./socketHandlers";

interface CustomSocket extends Socket {
  decoded?: JwtPayload;
}

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.use((socket: CustomSocket, next) => {
  const token = socket.handshake.query.token as string;
  if (!token) {
    next(new Error("Auth error"));
  }
  const decoded = verifyToken(token, { type: "access" });
  console.log(decoded);
  if (decoded === null) {
    return next(new Error("Auth error"));
  }
  socket.decoded = decoded;
  next();
});

io.on("connection", (socket) => {
  socketHandlers(io, socket);
});

const PORT = 1337;
server.listen(PORT, () => {
  console.log(`SERVER LISTENING ON ${PORT}`);
});
