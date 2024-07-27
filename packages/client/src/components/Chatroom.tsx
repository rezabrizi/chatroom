import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "../styles/Chat.css";

interface Message {
  user: string;
  message: string;
}

const Chat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = io("http://localhost:1337", { query: { token } });
    setSocket(newSocket);

    newSocket.on("message", (data: { user: string; message: string }) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      if (socket) {
        newSocket.off("message");
        socket.disconnect();
      }
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("sendMessage", { message });
      setMessage("");
    }
  };

  return (
    <div className='chat-container'>
      <div className='messages'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.user === "currentUser" ? "self-message" : "message"}
          >
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className='message-form'>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='message-input'
          placeholder='Type a message...'
        />
        <button type='submit' className='send-button'>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
