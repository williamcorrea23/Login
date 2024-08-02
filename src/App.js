import React, { useEffect } from "react";
//import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import Dashboard from './screens/Dashboard';
import Lessons from './screens/Lessons';
import Exercises from './screens/Exercises';
import Chatbot from './components/Chatbot';
import Profile from './screens/Profile';
import redacao from './screens/redacao';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/login";
import SignUp from "./components/register";
import { FaFontAwesome } from 'react-icons/fa';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useState } from "react";
import { auth } from "./components/firebase";

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });

  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
            
                 <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Lessons" element={<Lessons />} />
              <Route path="/Exercises" element={<Exercises />} />
              <Route path="/Chatbot" element={<Chatbot />} />
              <Route path="/Profile" element={<Profile />} />
             
              <Route path="/redacao" element={<redacao />} />
              </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>

       
  );
}

export default App;
