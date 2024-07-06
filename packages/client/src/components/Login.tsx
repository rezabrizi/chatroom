import React from "react";
import { useAuth } from "../context/authContext";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Form.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { token, login } = useAuth();
  const navigate = useNavigate();

  async function loginUser(event: FormEvent) {
    event.preventDefault();
    try {
      await login(email, password);
      navigate("/protected_example");
    } catch (err) {
      console.error("Login Failed");
    }
  }

  return (
    <>
      <h1>Login</h1>
      <div className='form-container'>
        <form onSubmit={loginUser} className='login-form'>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            placeholder='Email'
            className='form-input'
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            placeholder='Password'
            className='form-input'
          />
          <input type='submit' value='Login' className='form-input' />
        </form>
      </div>
    </>
  );
};

export default Login;
