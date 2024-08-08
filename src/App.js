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
      <div className="flex flex-col h-screen bg-gray-100">
        <Header />
        <main className="flex-grow overflow-y-auto">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={renderContent()} />
            <Route path="/lessons" element={renderContent()} />
            <Route path="/exercises" element={renderContent()} />
            <Route path="/redacao" element={renderContent()} />
            <Route path="/chatbot" element={renderContent()} />
          </Routes>
          <ToastContainer />
        </main>
        <BottomNavigation activeSection={activeSection} setActiveSection={setActiveSection} />
      </div>
    </Router>
  );
}



export default App;
