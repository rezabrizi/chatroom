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
  const { token, name } = useAuth();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:1337/api/chat/history"
        );
        const fetchedMessages: Message[] = response.data.map((msg: any) => ({
          sender: msg.sender,
          text: msg.text,
          timeStamp: new Date(msg.timeStamp),
        }));
        setMessages(fetchedMessages);
      } catch (err) {
        console.error("Error fetching chat history: ", err);
      }
    };
    fetchChatHistory();
  }, []);

  useEffect(() => {
    if (token) {
      const socketConnection = io("http://localhost:1337", {
        query: { token },
      });

      setSocket(socketConnection);

      socketConnection.on("message", (data) => {
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
      setMessage("");
    }
  };

  return (
    <div className='chat-container'>
      <div className='messages'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === name ? "self-message" : "message"}
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
