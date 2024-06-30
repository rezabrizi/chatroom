import React from "react";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  async function loginUser(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("http://localhost:1337/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      console.log("Token stored");
      navigate("/chatroom");
    } else {
      console.error("Login Failed: ", data.message);
    }
  }

  return (
    <>
      <h1>Login</h1>
      <div className="form-container">
        <form onSubmit={loginUser} className="login-form">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="form-input"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="form-input"
          />
          <input type="submit" value="Register" className="form-input" />
        </form>
      </div>
    </>
  );
};

export default Login;
