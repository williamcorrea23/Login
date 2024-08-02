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
import Redacao from './screens/redacao';
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

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);
  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/redacao" /> : <redacao />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/redacao" element={<Redacao />} />
              </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>

       
  );
}

export default App;
