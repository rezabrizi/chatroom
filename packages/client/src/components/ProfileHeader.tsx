import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";

const Header: React.FC = () => {
  const { token, name } = useAuth();

  return (
    <header className='header'>
      <div className='container'>
        <h1 className='logo'>Takem</h1>
        <h2 className='Profile'>Welcome {name ? name : "to the Chat App"}</h2>
        <nav>
          <ul className='nav-links'>
            {token ? (
              <li>
                <a href='/logout'>Logout</a>
              </li>
            ) : (
              <>
                <li>
                  <a href='/login'>Login</a>
                </li>
                <li>
                  <a href='/register'>Register</a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
