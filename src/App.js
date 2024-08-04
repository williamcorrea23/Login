import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './components/firebase';
import Login from './components/login';
import SignUp from './components/register';
import Profile from './components/profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBook, faPencilAlt, faEdit, faComments, faUser } from '@fortawesome/free-solid-svg-icons';
import './styles/custom-tailwind.css';
import './styles/globals.css';

const API_KEY = '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'
//process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

const MobileENEMApp = () => {
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
        <main className="flex-grow overflow-y-auto p-4 pt-16 pb-20">
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
  <header className="bg-green-700 p-4 shadow-md fixed top-0 w-full z-50">
    <div className="container mx-auto text-center">
      <h1 className="text-xl font-bold text-white">ENEM Wise E-Learning Brasil</h1>
    </div>
  </header>
);

const BottomNavigation = ({ activeSection, setActiveSection }) => (
  <nav className="bg-white fixed bottom-0 w-full border-t border-gray-200 z-50">
    <div className="container mx-auto flex justify-around">
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
  <Link to={`/${section}`} className={`nav-item ${activeSection === section ? 'active' : ''}`} onClick={() => setActiveSection(section)}>
    <FontAwesomeIcon icon={icon} />
    <span>{label}</span>
  </Link>
);

const Dashboard = () => (
  <div className="mt-4">
    <h2 className="text-2xl font-bold mb-4 text-center">Painel de Controle</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard title="Aulas Concluídas" value="0" />
      <StatCard title="Exercícios Realizados" value="0" />
      <StatCard title="Pontuação Total" value="0%" />
    </div>
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center">
    <h3 className="font-bold">{title}</h3>
    <p className="text-2xl">{value}</p>
  </div>
);

const Lessons = ({ setCurrentLesson }) => {
  const lessons = {
    'Matemática': {
      id: 'matematica',
      title: "Matemática",
      details: "Selecione uma aula para saber mais:\n1. Álgebra\n2. Geometria\n3. Trigonometria\n4. Cálculo\n5. Estatística\n6. Probabilidade\n7. Álgebra Linear\n8. Equações Diferenciais\n9. Números Complexos\n10. Teoria dos Números",
      subtopics: {
        '1': "+Conteúdo Enem de Álgebra.",
        '2': "+Conteúdo Enem de Geometria.",
        '3': "+Conteúdo Enem de Trigonometria.",
        '4': "+Conteúdo Enem de Cálculo.",
        '5': "+Conteúdo Enem de Estatística.",
        '6': "+Conteúdo Enem de Probabilidade.",
        '7': "+Conteúdo Enem de Álgebra Linear.",
        '8': "+Conteúdo Enem de Equações Diferenciais.",
        '9': "+Conteúdo Enem de Números Complexos.",
        '10': "+Conteúdo Enem de Teoria dos Números."
      }
    },
    // Adicione os outros tópicos de forma semelhante
    // ...
  };

  const handleLessonClick = async (subject) => {
    setCurrentLesson(subject);
    try {
      const lesson = lessons[subject];
      displayLessonDetails(lesson);
      
      // Inicie uma conversa com o ChatGPT sobre o tópico selecionado
      const response = await callGPTAssistant(`Olá! Gostaria de começar uma aula sobre ${subject}. Pode me fornecer uma visão geral e alguns detalhes sobre os sub-tópicos?`);
      displayMessage(response);
      
    } catch (error) {
      toast.error(`Erro ao iniciar aula de ${subject}`);
      console.error(`Erro ao iniciar aula de ${subject}:`, error);
    }
  };

  const displayLessonDetails = (lesson) => {
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
      const message = `Bem-vindo ao curso de ${lesson.title}! Por favor, selecione uma aula para começar:\n${lesson.details}`;
      displayMessage(message);
    }
  };

  const displayMessage = (message) => {
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', 'bot-message');
      messageDiv.innerText = message;
      chatBox.appendChild(messageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  };

  // Função para chamar o assistente GPT
  async function callGPTAssistant(prompt) {
    const apiKey = 'YOUR_API_KEY'; // Substitua pela sua chave de API OpenAI
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4-turbo", // Use o modelo mais recente
          messages: [{
            role: "user",
            content: prompt
          }],
          max_tokens: 850,
          temperature: 0.4,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta:', errorText);
        return `Erro de resposta da API: ${response.status} - ${response.statusText}`;
      }

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
      }

      return 'Resposta inesperada da API.';
    } catch (error) {
      console.error('Erro na requisição:', error);
      return 'Erro ao chamar o assistente GPT.';
    }
  }

  // Renderiza a lista de assuntos como botões
  return (
    <div>
      {Object.keys(lessons).map(subject => (
        <button key={subject} onClick={() => handleLessonClick(subject)}>
          {subject}
        </button>
      ))}
    </div>
  );
};

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Aulas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <div 
            key={subject} 
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50 transition-colors"
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
      toast.error('Por favor, selecione uma matéria e o número de questões.');
      return;
    }

    try {
      const response = await axios.post(API_URL, {
         model: "gpt-4-turbo", // Modelo atualizado
    messages: [{
      role: "system",
      content: `Generate ${numQuestions} multiple-choice questions about ${subject} for ENEM exam preparation. Format each question with 4 options (A, B, C, D) and indicate the correct answer.`
    }],
    temperature: 0.4, // Ajuste a criatividade conforme necessário
    max_tokens: 1500, // Ajuste conforme o comprimento esperado da resposta
    top_p: 1, // Controle de probabilidade acumulada
    frequency_penalty: 0, // Penalidade de frequência
    presence_penalty: 0, // Penalidade de presença
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const generatedQuestions = parseQuestions(response.data.choices[0].message.content);
      setExercises(generatedQuestions);
      toast.success('Questões geradas com sucesso!');
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Erro ao gerar questões. Por favor, tente novamente.');
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
    <div className="mt-4">
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
          className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-600 transition-colors"
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
                <div key={index} className="flex items-center">
                  <input type="radio" id={`q${exercise.id}o${index}`} name={`question${exercise.id}`} className="mr-2" />
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
  const [isPaused, setIsPaused] = useState(false);
  const [resultado, setResultado] = useState('');
  const [temasRecentes, setTemasRecentes] = useState([]);
  const intervalRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    loadRedacaoStyles();
    setTemasRecentes(getTemasRecentes());
    return () => {
      removeRedacaoStyles();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = () => {
    if (!isPaused) {
      timeRef.current = timer * 60;
    }
    setIsPaused(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const minutes = Math.floor(timeRef.current / 60);
      const seconds = timeRef.current % 60;

      setTimer(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      timeRef.current--;

      if (timeRef.current < 0) {
        clearInterval(intervalRef.current);
        toast.info('Tempo esgotado!');
      }
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsPaused(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultado = await analisarRedacaoComGPT(tema, conteudo);
      setResultado(resultado);
      toast.success('Redação analisada com sucesso!');
    } catch (error) {
      console.error('Erro ao analisar redação:', error);
      toast.error('Erro ao analisar redação. Por favor, tente novamente.');
    }
  };

  const analisarRedacaoComGPT = async (titulo, conteudo) => {

    const prompt = `Você é um professor experiente e altamente qualificado, especializado na correção de redações do ENEM. Sua tarefa é analisar a redação a seguir, considerando todos os critérios estabelecidos pelo edital do ENEM:

    Título: ${titulo}
    Conteúdo: ${conteudo}
    
    **Instruções para a análise:**
    - Forneça uma análise detalhada considerando os seguintes aspectos:
      1. **Aderência ao tema**: Avalie se o estudante abordou o tema proposto de maneira completa e aprofundada, sem fugir do assunto.
      2. **Estrutura argumentativa**: Verifique a construção da argumentação, a clareza na exposição das ideias e a organização lógica dos parágrafos (introdução, desenvolvimento e conclusão).
      3. **Coesão e coerência**: Analise o uso adequado de conectivos, a fluidez entre as partes do texto e a consistência das ideias apresentadas.
      4. **Proposta de intervenção**: Avalie a presença de uma proposta de intervenção clara, detalhada e viável para o problema discutido, conforme exigido pelo ENEM.
      5. **Respeito aos direitos humanos**: Certifique-se de que a redação respeita os direitos humanos, sem apresentar preconceitos ou estereótipos.
    - Atribua uma nota de 0 a 1000 com base nos critérios acima.
    - Justifique a nota atribuída com uma análise detalhada.
    - Ofereça recomendações específicas e construtivas sobre como o estudante pode melhorar em cada aspecto avaliado.

    **Modelo de resposta:**
    - Introdução da análise
    - Aderência ao tema: [Análise detalhada]
    - Estrutura argumentativa: [Análise detalhada]
    - Coesão e coerência: [Análise detalhada]
    - Proposta de intervenção: [Análise detalhada]
    - Respeito aos direitos humanos: [Análise detalhada]
    - Nota final: [0 a 1000]
    - Justificativa da nota: [Análise detalhada]
    - Recomendações de melhoria: [Sugestões específicas para cada aspecto]

    Análise da Redação:`;

    const response = await axios.post(url, {
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
      temperature: 0.5
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return response.data.choices[0].message.content;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Redação do ENEM</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="temas" className="block text-sm font-medium text-gray-700 mb-1">Temas Recentes:</label>
          <select
            id="temas"
            className="w-full p-2 border rounded"
            onChange={(e) => setTema(e.target.value)}
          >
            <option value="">Selecione um tema</option>
            {temasRecentes.map((tema) => (
              <option key={tema.id} value={tema.nome}>
                {tema.ano} - {tema.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">Título:</label>
          <input
            id="titulo"
            type="text"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700 mb-1">Conteúdo:</label>
          <textarea
            id="conteudo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            className="w-full p-2 border rounded"
            rows="10"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="countdown" className="block text-sm font-medium text-gray-700 mb-1">Timer (minutos):</label>
          <div className="flex">
            <input
              id="countdown"
              type="number"
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
              className="w-1/3 p-2 border rounded-l"
            />
            <button type="button" onClick={startTimer} className="w-1/3 bg-blue-500 text-white p-2">
              {isPaused ? 'Retomar' : 'Iniciar'} Timer
            </button>
            <button type="button" onClick={pauseTimer} className="w-1/3 bg-yellow-500 text-white p-2 rounded-r">
              Pausar Timer
            </button>
          </div>
        </div>
        <div id="time" className="text-center text-2xl font-bold mb-4">{timer}</div>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Enviar para Análise
        </button>
      </form>
      {resultado && (
        <div id="resultado" className="mt-4">
          <h3 className="text-lg font-bold mb-2">Análise da Redação</h3>
          <p className="whitespace-pre-wrap">{resultado}</p>
        </div>
      )}
    </div>
  );
};
}

export default Redacao;

function loadRedacaoStyles() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'styles/redacao.css';
  link.id = 'redacao-css';
  document.head.appendChild(link);
}

function removeRedacaoStyles() {
  const link = document.getElementById('redacao-css');
  if (link) {
    document.head.removeChild(link);
  }
}

function getTemasRecentes() {
  return [
    { id: 1, ano: 2023, nome: "Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil" },
    { id: 2, ano: 2022, nome: "Desafios para a valorização de comunidades e povos tradicionais no Brasil" },
    { id: 3, ano: 2021, nome: "Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil" },
    { id: 4, ano: 2020, nome: "O estigma associado às doenças mentais na sociedade brasileira" },
    { id: 5, ano: 2019, nome: "Democratização do acesso ao cinema no Brasil" },
    // ... (outros temas)
  ];
}
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          toast.info('Tempo esgotado!');
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  return (
    <div className="mt-4">
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
          <button type="button" onClick={startTimer} className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-400 transition-colors">
            Iniciar Timer
          </button>
        </div>
        <button type="submit" className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-600 transition-colors">
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
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Assistência por Chatbot</h2>
      <div className="bg-white p-4 rounded-lg shadow h-64 overflow-y-auto mb-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.role}-message mb-2 p-2 rounded ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
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
          className="bg-green-700 text-white p-2 rounded-r hover:bg-green-600 transition-colors"
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

// Assuming you have a Profile component, if not, you can create a basic one like this:
const Profilepage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout. Por favor, tente novamente.');
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Perfil</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <p><strong>Nome:</strong> {user.displayName || 'N/A'}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <button 
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-400 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default MobileENEMApp;
                    
