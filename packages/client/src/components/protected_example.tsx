import axios from "axios";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import "../styles/Chat.css";

interface Message {
  user: string;
  message: string;
}

const Protected_Example: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className='chat-container'>
      <div className='messages'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.user === "currentUser" ? "self-message" : "message"}
          >
            <strong>{msg.user}</strong> {msg.message}
          </div>
        ))}
      </div>
      <form className='message-form'>
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
