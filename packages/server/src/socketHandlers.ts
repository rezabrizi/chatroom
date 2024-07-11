import { timeStamp } from "console";
import { JwtPayload } from "jsonwebtoken";
import { Server, Socket } from "socket.io";

interface CustomSocket extends Socket {
  decoded?: JwtPayload; // Add the `decoded` property
}

export const socketHandlers = (io: Server, socket: CustomSocket) => {
  socket.on("message", (data) => {
    const message = {
      text: data.text,
      sender: socket.decoded?.name,
      timeStamp: new Date(),
    };

    console.log(message);

    io.emit("message", message);
  });
};
