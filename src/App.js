import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './components/firebase';
import Login from './components/login';
import SignUp from './components/register';
import Profile from './components/profile';
//import './styles/custom-tailwind.css';
import './styles/globals.css';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

const MobileENEMApp = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [chatHistory, setChatHistory] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
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
        <main className="flex-grow overflow-y-auto p-4">
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

const Header = () => <header className="bg-blue-600 text-white p-4">Header</header>;

const BottomNavigation = ({ activeSection, setActiveSection }) => (
  <nav className="bg-gray-200 p-4">
    <button onClick={() => setActiveSection('dashboard')}>Dashboard</button>
    <button onClick={() => setActiveSection('lessons')}>Aulas</button>
    <button onClick={() => setActiveSection('exercises')}>Exercícios</button>
    <button onClick={() => setActiveSection('redacao')}>Redação</button>
    <button onClick={() => setActiveSection('chatbot')}>Chatbot</button>
    <button onClick={() => setActiveSection('profile')}>Perfil</button>
  </nav>
);

const Dashboard = () => (
  <div className="mt-16">
    <h2 className="text-2xl font-bold mb-4 text-center">Painel de Controle</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <h3 className="font-bold">Aulas Concluídas</h3>
        <p className="text-2xl">0</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <h3 className="font-bold">Exercícios Realizados</h3>
        <p className="text-2xl">0</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow text-center">
        <h3 className="font-bold">Pontuação Total</h3>
        <p className="text-2xl">0%</p>
      </div>
    </div>
  </div>
);

const Lessons = ({ setCurrentLesson }) => {
  const subjects = ['Matemática', 'Linguagens', 'Ciências Humanas', 'Ciências da Natureza', 'Redação'];

  const handleLessonClick = async (subject) => {
    setCurrentLesson(subject);
    try {
      const response = await axios.post('/api/start-lesson', { subject });
      console.log(`Aula de ${subject} iniciada:`, response.data);
    } catch (error) {
      console.error(`Erro ao iniciar aula de ${subject}:`, error);
    }
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-4 text-center">Aulas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <div 
            key={subject} 
            className="bg-white p-4 rounded-lg shadow cursor-pointer"
            onClick={() => handleLessonClick(subject)}
          >
            <h3 className="font-bold">{subject}</h3>
            <p>Aulas de {subject}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Exercises = ({ exercises, setExercises }) => {
  const [subject, setSubject] = useState('');
  const [numQuestions, setNumQuestions] = useState('');

  const generateQuestions = async () => {
    if (!subject || !numQuestions) {
      alert('Por favor, selecione uma matéria e o número de questões.');
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: `Generate ${numQuestions} multiple-choice questions about ${subject} for ENEM exam preparation. Format each question with 4 options (A, B, C, D) and indicate the correct answer.`
        }],
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const generatedQuestions = parseQuestions(response.data.choices[0].message.content);
      setExercises(generatedQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Erro ao gerar questões. Por favor, tente novamente.');
    }
  };

  const parseQuestions = (content) => {
    const questions = content.split('\n\n');
    return questions.map((q, index) => {
      const lines = q.split('\n');
      return {
        id: index + 1,
        question: lines[0],
        options: lines.slice(1, 5).map(l => l.slice(3)),
        correctAnswer: lines[5].slice(-1)
      };
    });
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-4 text-center">Exercícios</h2>
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="font-bold mb-2">Gerador de Questões</h3>
        <select 
          className="w-full p-2 mb-2 border rounded"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">Selecione a matéria</option>
          <option value="Ciências Humanas">Ciências Humanas</option>
          <option value="Ciências Naturais">Ciências Naturais</option>
          <option value="Linguagens">Linguagens</option>
          <option value="Matemática">Matemática</option>
          <option value="Língua Inglesa">Língua Inglesa</option>
          <option value="Língua Espanhola">Língua Espanhola</option>
          <option value="Redação">Redação</option>
        </select>
        <input 
          type="number" 
          placeholder="Número de Questões" 
          className="w-full p-2 mb-2 border rounded"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
        />
        <button 
          className="w-full bg-green-700 text-white p-2 rounded"
          onClick={generateQuestions}
        >
          Gerar Questões
        </button>
      </div>
      {exercises.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-2">Questões Geradas</h3>
          {exercises.map((exercise) => (
            <div key={exercise.id} className="mb-4">
              <p className="font-bold">{exercise.question}</p>
              {exercise.options.map((option, index) => (
                <div key={index}>
                  <input type="radio" id={`q${exercise.id}o${index}`} name={`question${exercise.id}`} />
                  <label htmlFor={`q${exercise.id}o${index}`}>{option}</label>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Redacao = () => {
  const [tema, setTema] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [timer, setTimer] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/submit-redacao', { tema, conteudo });
      alert('Redação enviada para análise!');
    } catch (error) {
      console.error('Erro ao enviar redação:', error);
      alert('Erro ao enviar redação. Por favor, tente novamente.');
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-4 text-center">Redação do ENEM</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
        <div className="mb-4">
          <label className="block mb-2">Tema:</label>
          <input
            type="text"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Conteúdo:</label>
          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            className="w-full p-2 border rounded"
            rows="10"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Timer (minutos):</label>
          <input
            type="number"
            value={timer / 60}
            onChange={(e) => setTimer(parseInt(e.target.value) * 60)}
            className="w-full p-2 border rounded"
          />
          <button type="button" onClick={startTimer} className="mt-2 bg-blue-500 text-white p-2 rounded">
            Iniciar Timer
          </button>
        </div>
        <button type="submit" className="w-full bg-green-700 text-white p-2 rounded">
          Enviar para Análise
        </button>
      </form>
    </div>
  );
};

const Chatbot = ({ chatHistory, setChatHistory }) => {
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setChatHistory([...chatHistory, userMessage]);

    try {
      const response = await axios.post(API_URL, {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant for ENEM exam preparation." },
          ...chatHistory,
          userMessage
        ],
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const botResponse = { role: 'assistant', content: response.data.choices[0].message.content };
      setChatHistory([...chatHistory, userMessage, botResponse]);
    } catch (error) {
      console.error('Error in chat response:', error);
      const errorMessage = { role: 'assistant', content: 'Desculpe, ocorreu um erro. Por favor, tente novamente.' };
      setChatHistory([...chatHistory, userMessage, errorMessage]);
    }

    setInput('');
  };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-4 text-center">Assistência por Chatbot</h2>
      <div className="bg-white p-4 rounded-lg shadow h-64 overflow-y-auto mb-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.role}-message mb-2`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input 
          type="text" 
          placeholder="Digite sua mensagem..." 
          className="flex-grow p-2 border rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button 
          className="bg-green-700 text-white p-2 rounded-r"
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default MobileENEMApp;
