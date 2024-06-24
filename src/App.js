import Navbar from "./navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Dashboard from "./dashboard/Dashboard";
import Register from "./Register";
import NomatchPage from "./NomatchPage";
import { UserContext } from "./UserContext";
import React, { useState } from "react";
import Store from "./Store";

function App() {
  let [user, setUser] = useState({
    isLoggedin: false,
    currentUserId: null,
    currentUserName: null,
  });

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <div className="div">
            <Navbar />
          </div>

          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/store" element={<Store />} />

            <Route path="*" element={<NomatchPage />} />
          </Routes>
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
