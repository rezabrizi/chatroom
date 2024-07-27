import { Schema, model, Document } from "mongoose";

interface IChat extends Document {
  userId: Schema.Types.ObjectId;
  message: string;
  createdAt: Date;
}

const chatSchema = new Schema<IChat>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Chat = model<IChat>("Chat", chatSchema);
export default Chat;
