import http from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import { verifyToken } from "./utils/jwtUtils";
import app from "./app";
import CustomSocket from "./Types/socket.type";
// this file has has all the socket controllers
// controller - handles the logic
import { socketHandlers } from "./socketHandlers";

// create an http server on the express application
const server = http.createServer(app);
// support io from websockets
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
// auth middleware for the websocket
io.use((socket: CustomSocket, next) => {
  const token = socket.handshake.query.token as string;
  if (!token) {
    next(new Error("Auth error"));
  }
  // verify token is the function that verifies the JWT access token
  const decoded = verifyToken(token, { type: "access" });
  if (decoded === null) {
    return next(new Error("Auth error"));
  }
  socket.decoded = decoded;

  // proceed to the rest of the request
  next();
});

io.on("connection", (socket) => {
  // pass the socket object (io) and the socket itself to the the controller
  socketHandlers(io, socket);
});

const PORT = 1337;
server.listen(PORT, () => {
  console.log(`SERVER LISTENING ON ${PORT}`);
});
