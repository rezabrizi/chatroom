import CustomSocket from "./Types/socket.type";
import { Server, Socket } from "socket.io";
import User from "./models/user.models";
import Chat from "./models/chat.models";

// this is nothing but a function to handle the logic of our app
export const socketHandlers = (io: Server, socket: CustomSocket) => {
  // when a message is received
  socket.on("message", async (data) => {
    const timestamp_now = new Date();
    // create a message object
    const message = {
      text: data.text,
      sender: socket.decoded?.name,
      timeStamp: timestamp_now,
    };
    // find the user with the name of the person who registered
    const message_sender = await User.findOne({ name: socket.decoded?.name });
    // if the message sender is valid
    if (message_sender) {
      // create a new chat
      const chat = new Chat({
        userId: message_sender._id,
        message: data.text,
        createdAt: timestamp_now,
      });
      // save the chat
      await chat.save();
    }
    // send the chat to everyone
    io.emit("message", message);
  });
};
