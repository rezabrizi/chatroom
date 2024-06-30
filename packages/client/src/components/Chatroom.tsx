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

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const newSocket = io("http://localhost:1337", { query: { token } });
    setSocket(newSocket);

    newSocket.on("message", (data: { user: string; message: string }) => {
      console.log(data.message);
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

  const signOut = async (e: React.FormEvent) => {
    console.log("Trying to log out ");
    e.preventDefault();
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:1337/api/logout", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error logging out ", errorData.message);
    } else {
      console.log("Logout Successful!");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.user === "currentUser" ? "self-message" : "message"}
          >
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input"
          placeholder="Type a message..."
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
      <form onSubmit={signOut} className="sign-out-form">
        <button type="submit" className="sign-out-button">
          Sign Out
        </button>
      </form>
    </div>
  );
};

export default Chat;
