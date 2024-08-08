import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './components/firebase';
import Login from './components/login';
import SignUp from './components/register';
import Profile from './components/profile';
import Dashboard from './screens/Dashboard';
import lessons from './screens/Lessons';
import Redacao from './screens/redacao';
import chatbot from './components/Chatbot';
import exercises from './screens/Exercises';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faPencilAlt, faEdit, faComments, faUser } from '@fortawesome/free-solid-svg-icons';
import './styles/custom-tailwind.css';
import './styles/globals.css';

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
              <Route
                path="/"
                element={user ? <Navigate to="/profile" /> : <Login />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
               <Route path="/Dashboard" element={<dashboard />} />
              <Route path="/Lessons" element={<lessons />} />
              <Route path="/Exercises" element={<exercises />} />
                <Route path="/redacao" element={<redacao />} />
              <Route path="/chatbot" element={<chatbot />} />    
            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
