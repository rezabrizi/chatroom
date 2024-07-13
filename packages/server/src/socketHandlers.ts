import { timeStamp } from "console";
import { JwtPayload } from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import User from "./models/user.models";
import Chat from "./models/chat.models";

interface CustomSocket extends Socket {
  decoded?: JwtPayload; // Add the `decoded` property
}

export const socketHandlers = (io: Server, socket: CustomSocket) => {
  socket.on("message", async (data) => {
    const timestamp_now = new Date();
    const message = {
      text: data.text,
      sender: socket.decoded?.name,
      timeStamp: timestamp_now,
    };

    const message_sender = await User.findOne({ name: socket.decoded?.name });
    if (message_sender) {
      const chat = new Chat({
        userId: message_sender._id,
        message: data.text,
        createdAt: timestamp_now,
      });
      await chat.save();
    }
    io.emit("message", message);
  });
};
