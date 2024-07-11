import axios from "axios";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import "../styles/Chat.css";

interface Message {
  sender: string;
  text: string;
  timeStamp: Date;
}

const Protected_Example: React.FC = () => {
  const { token } = useAuth();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    if (token) {
      const socketConnection = io("http://localhost:1337", {
        query: { token },
      });

      setSocket(socketConnection);

      socketConnection.on("message", (data) => {
        console.log(data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        socketConnection.disconnect();
      };
    }
  }, [token]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  const sendMessage = () => {
    if (socket && message.trim() !== "") {
      socket.emit("message", { text: message });
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: "currentUser", timeStamp: new Date() },
      ]);
      setMessage("");
    }
  };

  return (
    <div className='chat-container'>
      <div className='messages'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "currentUser" ? "self-message" : "message"
            }
          >
            <strong>{msg.sender}</strong> {msg.text}
          </div>
        ))}
      </div>
      <form className='message-form' onSubmit={handleSubmit}>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='message-input'
          placeholder='message...'
        />
        <button type='submit' className='send-button'>
          Send
        </button>
      </form>
    </div>
  );
};

export default Protected_Example;
