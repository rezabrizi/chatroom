import React from "react";
import { useState, FormEvent } from "react";
import "../styles/Form.css";

const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function registerUser(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("http://localhost:1337/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();
  }

  return (
    <>
      <h1>Register</h1>
      <div className='form-container'>
        <form onSubmit={registerUser} className='login-form'>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type='text'
            placeholder='Username'
            className='form-input'
          />
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
          <input type='submit' value='Register' className='form-input' />
        </form>
      </div>
    </>
  );
};

export default Register;
