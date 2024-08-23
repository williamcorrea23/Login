import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './components/firebase';
import Login from './components/login';
import SignUp from './components/register';
import Profile from './components/profile';
import Home from './pages/Home;'
import Aulas from './pages/Aulas';
import Redacao from './pages/Redacao';
import Exercicios from './pages/Exercicios';
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
                element={user ? <Navigate to="/Home" /> : <Login />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/Aulas" element={<Aulas />} />
              <Route path="/Exercicios" element={<Exercicios />} />
              <Route path="/Redacao" element={<Redacao />} />
               </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
