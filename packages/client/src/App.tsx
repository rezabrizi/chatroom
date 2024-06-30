import React from "react";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import LoggedIn from "./components/ChatroomRoute";
import Chat from "./components/Chatroom";
import Anonymous from "./components/ProtectedRoute";

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Anonymous />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<LoggedIn />}>
            <Route path="/chatroom" element={<Chat />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
