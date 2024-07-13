import { Request, Response } from "express";
import Chat from "../models/chat.models";

interface PopulatedChat {
  userId: {
    name: string;
  };
  message: string;
  createdAt: Date;
}

async function chatHistory(req: Request, res: Response) {
  try {
    const chats = await Chat.find().populate("userId", "name").exec();

    const messages = chats.map((chat) => {
      const populatedChat = chat.toObject() as PopulatedChat;

      return {
        text: populatedChat.message,
        sender: populatedChat.userId.name,
        timeStamp: populatedChat.createdAt,
      };
    });

    res.json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
}

export default chatHistory;
