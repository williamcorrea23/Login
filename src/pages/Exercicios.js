// Exercicios.js
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwNC4QWaBQYqvayl98oMArcGdYV0JuqSk",
  authDomain: "elearning-568mbq.firebaseapp.com",
  projectId: "elearning-568mbq",
  storageBucket: "elearning-568mbq.appspot.com",
  messagingSenderId: "956581108104",
  appId: "1:956581108104:web:2be9a9b0c5978cd4b3823d",
  measurementId: "G-WLB4FBXE9R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const apiKey = process.env.API_KEY;

const subjects = [
  "Ciências Naturais",
  "Ciências Humanas",
  "Língua Portuguesa",
  "Matemática",
  "Linguagens"
];

const Exercicios = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [timerDuration, setTimerDuration] = useState(30);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkAuthState = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          console.log("Usuário não está logado. Redirecionando para a página de login.");
          window.location.href = '/index.html';
        }
      });
    };

    checkAuthState();
  }, []);

  const checkSaldoMensagens = async (userId) => {
    try {
      const docRef = doc(db, "Users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const saldoMensagens = userData.saldo_mens || 0;
        const lastMessageDateStr = userData.lastMessageDate;

        const today = new Date();
        let lastMessageDate = lastMessageDateStr ? new Date(lastMessageDateStr) : null;

        const isNewDay = lastMessageDate ? (today.getDate() !== lastMessageDate.getDate() || today.getMonth() !== lastMessageDate.getMonth() || today.getFullYear() !== lastMessageDate.getFullYear()) : true;

        if (isNewDay) {
          const updatedSaldo = 50;
          await updateDoc(docRef, {
            saldo_mens: updatedSaldo,
            lastMessageDate: today.toISOString()
          });
          return true;
        } else if (saldoMensagens <= 0) {
          alert('Você atingiu o limite diário de mensagens.');
          return false;
        } else {
          await updateDoc(docRef, {
            saldo_mens: increment(-1)
          });
          return true;
        }
      } else {
        alert('Usuário não encontrado.');
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar o saldo de mensagens: " + error.message);
      return false;
    }
  };

  const startTimer = () => {
    setTimeLeft(timerDuration * 60);
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimer(timerId);
  };

  const stopTimer = () => {
    if (timer) clearInterval(timer);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateExercises = async () => {
    if (!await checkSaldoMensagens(userId)) {
      alert("Você não tem saldo suficiente para gerar exercícios.");
      return;
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `Gere ${questionCount} questões de múltipla escolha sobre ${selectedSubject} no estilo do ENEM. Cada questão deve ter um enunciado e 5 alternativas (A, B, C, D, E). Indique a resposta correta para cada questão no formato 'Resposta: X', onde X é a letra da alternativa correta. Não dê saudações, traga apenas as questões.`
            }
          ],
          max_tokens: 1500,
          temperature: 0.6
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar exercícios");
      }

      const data = await response.json();
      const parsedQuestions = parseQuestionsFromResponse(data.choices[0].message.content);
      setQuestions(parsedQuestions);
      setUserAnswers({});
      setShowResults(false);
      startTimer();
    } catch (error) {
      console.error("Erro ao gerar exercícios:", error);
      alert("Ocorreu um erro ao gerar os exercícios. Por favor, tente novamente.");
    }
  };

  const parseQuestionsFromResponse = (content) => {
    const questions = [];
    const questionBlocks = content.split(/\d+\.\s/).filter(Boolean);

    questionBlocks.forEach((block, index) => {
      const lines = block.split("\n").filter(Boolean);
      const enunciado = lines[0].trim();
      const alternativas = {};
      let resposta_correta = "";

      lines.slice(1).forEach((line) => {
        if (
          line.toLowerCase().startsWith("resposta:") ||
          line.toLowerCase().startsWith("resposta correta:")
        ) {
          resposta_correta = line.split(":")[1].trim();
        } else {
          const [letter, text] = line.split(") ");
          if (letter && text) {
            alternativas[letter.trim()] = text.trim();
          }
        }
      });

      questions.push({
        enunciado,
        alternativas,
        resposta_correta
      });
    });

    return questions;
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleSubmit = async () => {
    stopTimer();
    let correctAnswers = 0;
    let wrongAnswers = 0;

    questions.forEach((question, index) => {
      if (userAnswers[index] === question.resposta_correta) {
        correctAnswers++;
      } else {
        wrongAnswers++;
      }
    });

    setScore(correctAnswers);
    setShowResults(true);

    await saveSimuladoResult(userId, selectedSubject, questions, correctAnswers, wrongAnswers);
  };

  const saveSimuladoResult = async (userId, subject, questions, correctAnswers, wrongAnswers) => {
    try {
      const subjectMap = {
        "Ciências Naturais": "cienciasDaNatureza",
        "Inglês": "Ingles",
        "Ciências Humanas": "cienciasHumanas",
        "Espanhol": "espanhol",
        "Língua Portuguesa": "ling",
        "Matemática": "matematica"
      };

      const subjectId = subjectMap[subject];

      if (!subjectId) {
        console.error(`Subject não encontrado no mapeamento: ${subject}`);
        return;
      }

      const subjectDocRef = doc(db, "Users", userId, "EnemData", subjectId);
      const docSnapshot = await getDoc(subjectDocRef);

      let updatedQuestoes;

      if (docSnapshot.exists()) {
        const currentData = docSnapshot.data();
        const previousQuestoes = currentData.questoes || [];
        updatedQuestoes = previousQuestoes.concat(questions);

        await updateDoc(subjectDocRef, {
          questoes: updatedQuestoes,
          totalCorretas: (currentData.totalCorretas || 0) + correctAnswers,
          totalErradas: (currentData.totalErradas || 0) + wrongAnswers
        });

        console.log(`Resultado atualizado para a matéria: ${subjectId}`);
      } else {
        updatedQuestoes = questions;
        await setDoc(subjectDocRef, {
          questoes: updatedQuestoes,
          totalCorretas: correctAnswers,
          totalErradas: wrongAnswers
        });

        console.log(`Documento criado e resultado salvo para a matéria: ${subjectId}`);
      }
    } catch (error) {
      console.error("Erro ao salvar o resultado: ", error);
    }
  };

  return (
    <div className="container">
      <h1>Exercícios do ENEM</h1>
      <div className="subject-selector">
        {subjects.map(subject => (
          <button
            key={subject}
            className={`subject-button ${selectedSubject === subject ? 'active' : ''}`}
            onClick={() => setSelectedSubject(subject)}
          >
            {subject}
          </button>
        ))}
      </div>
      <div className="options-container">
        <div className="question-count">
          <label htmlFor="questionCount">Número de questões:</label>
          <input
            type="number"
            id="questionCount"
            min="5"
            max="45"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
          />
        </div>
        <div className="timer-container">
          <label htmlFor="timerDuration">Tempo (minutos):</label>
          <input
            type="number"
            id="timerDuration"
            min="1"
            max="180"
            value={timerDuration}
            onChange={(e) => setTimerDuration(parseInt(e.target.value))}
          />
        </div>
        <div className="timer">
          <span id="time">{formatTime(timeLeft)}</span>
        </div>
      </div>
      <button className="generate-button" onClick={generateExercises}>Gerar Exercícios</button>
      <div className="questions-container">
        {questions.map((question, index) => (
          <div key={index} className="question">
            <h3>Questão {index + 1}</h3>
            <p>{question.enunciado}</p>
            <ul className="options">
              {Object.entries(question.alternativas).map(([letter, text]) => (
                <li key={letter} className="option">
                  <label>
                    <input
                      type="radio"
                      name={`question${index}`}
                      value={letter}
                      onChange={() => handleAnswerChange(index, letter)}
                      checked={userAnswers[index] === letter}
                    />
                    {letter}) {text}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {questions.length > 0 && (
          <button className="submit-button" onClick={handleSubmit}>Enviar Respostas</button>
        )}
      </div>
      {showResults && (
        <div className="result-summary">
          <h3>Resultado Final</h3>
          <p>Você acertou {score} de {questions.length} questões!</p>
          <p>Tempo total: {formatTime(timerDuration * 60 - timeLeft)}</p>
        </div>
      )}
    </div>
  );
};

export default Exercicios;
