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
import lessons from './screens/lessons';
import Redacao from './screens/redacao';
import chatbot from './screens/chatbot';
import exercises from './screens/exercises';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faPencilAlt, faEdit, faComments, faUser } from '@fortawesome/free-solid-svg-icons';
import './styles/custom-tailwind.css';
import './styles/globals.css';

const API_KEY = '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';
const API_URL = 'https://api.openai.com/v1/chat/completions';

const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'lessons':
        return <Lessons setCurrentLesson={setCurrentLesson} />;
      case 'exercises':
        return <Exercises exercises={exercises} setExercises={setExercises} />;
      case 'redacao':
        return <Redacao />;
      case 'chatbot':
        return <Chatbot chatHistory={chatHistory} setChatHistory={setChatHistory} />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

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
};

const Header = () => (
  <header className="bg-green-600 p-2 text-white text-center">

    <h1 className="text-xl font-bold text-white">ENEM Wise E-Learning Brasil</h1>

  </header>
);

const BottomNavigation = ({ activeSection, setActiveSection }) => (
  <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full">
    <div className="flex justify-around">
      <NavItem icon={faHome} label="Dashboard" section="dashboard" activeSection={activeSection} setActiveSection={setActiveSection} />
      <NavItem icon={faBook} label="Aulas" section="lessons" activeSection={activeSection} setActiveSection={setActiveSection} />
      <NavItem icon={faPencilAlt} label="Exercícios" section="exercises" activeSection={activeSection} setActiveSection={setActiveSection} />
      <NavItem icon={faEdit} label="Redação" section="redacao" activeSection={activeSection} setActiveSection={setActiveSection} />
      <NavItem icon={faComments} label="Chatbot" section="chatbot" activeSection={activeSection} setActiveSection={setActiveSection} />
      <NavItem icon={faUser} label="Perfil" section="profile" activeSection={activeSection} setActiveSection={setActiveSection} />
    </div>
  </nav>
);

const NavItem = ({ icon, label, section, activeSection, setActiveSection }) => (
  <Link to={`/${section}`} className={`flex flex-col items-center py-2 ${activeSection === section ? 'text-green-600' : 'text-gray-600'}`} onClick={() => setActiveSection(section)}>
    <FontAwesomeIcon icon={icon} className="text-xl mb-1" />
    <span className="text-xs">{label}</span>
  </Link>
);


export default App;
