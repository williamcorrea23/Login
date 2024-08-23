import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";

ChartJS.register(ArcElement, Tooltip, Legend);

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

const apiKey = env.apikey;

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [essays, setEssays] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          console.log(user);
          const docRef = doc(db, "Users", user.uid);
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const userData = docSnap.data();
              console.log(userData);
              setUserData(userData);
              
              // Fetch and set chart data
              const enemDataRef = collection(db, "Users", user.uid, "EnemData");
              const enemDataSnapshot = await getDocs(enemDataRef);
              let totalCorretas = 0;
              let totalErradas = 0;
              enemDataSnapshot.forEach((doc) => {
                const data = doc.data();
                totalCorretas += data.totalCorretas || 0;
                totalErradas += data.totalErradas || 0;
              });
              setChartData({
                labels: ['Acertos', 'Erros'],
                datasets: [{
                  data: [totalCorretas, totalErradas],
                  backgroundColor: ['#4CAF50', '#FF5252'],
                }],
              });

              // Fetch essays
              const redacoesRef = doc(db, "Users", user.uid, "EnemData", "Redacoes");
              const redacoesSnap = await getDoc(redacoesRef);
              if (redacoesSnap.exists()) {
                setEssays(redacoesSnap.data().Redacao || []);
              }
            } else {
              console.log("No document found matching user ID");
            }
          } catch (error) {
            console.error("Error getting document:", error);
          }
        } else {
          console.log("User is not logged in");
          window.location.href = 'index.html';
        }
      });
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('loggedInUserId');
        window.location.href = 'index.html';
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  const analyzePerformance = async () => {
    try {
      const subjectMap = {
        "Linguagens": "ling",
        "Matemática": "matematica",
        "C. Humanas": "cienciasHumanas",
        "C. Natureza": "cienciasDaNatureza",
        "Redação": "redacao"
      };

      let questionsText = "";

      for (const [subjectName, firestoreField] of Object.entries(subjectMap)) {
        const subjectDocRef = doc(db, "Users", auth.currentUser.uid, "EnemData", firestoreField);
        const subjectDocSnap = await getDoc(subjectDocRef);

        if (subjectDocSnap.exists()) {
          const data = subjectDocSnap.data();
          const questoes = data.questoes || [];

          questoes.forEach(questao => {
            const { enunciado, alternativas, correta, errada } = questao;
            questionsText += `Questão: ${enunciado}\n`;
            questionsText += `Alternativas: ${Object.entries(alternativas).map(([key, value]) => `${key}: ${value}`).join(", ")}\n`;
            questionsText += `Resposta correta: ${correta}, Resposta errada: ${errada}\n\n`;
          });

          const totalCorretas = data.totalCorretas || 0;
          const totalErradas = data.totalErradas || 0;
          questionsText += `Total de Respostas Corretas: ${totalCorretas}\n`;
          questionsText += `Total de Respostas Erradas: ${totalErradas}\n\n`;
        } else {
          console.log(`Documento para ${subjectName} não encontrado. Pulando essa matéria.`);
        }
      }

      if (questionsText.trim() === "") {
        console.log("Nenhuma questão encontrada para análise.");
        alert("Nenhuma questão disponível para análise.");
        return;
      }

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `Analise o desempenho nas seguintes questões: ${questionsText}`
            }
          ],
          max_tokens: 1500,
          temperature: 0.6
        })
      });

      if (!response.ok) {
        throw new Error("Falha ao gerar a análise de desempenho");
      }

      const analysis = await response.json();
      const analysisText = analysis.choices[0].message.content;

      const analysisContainer = document.getElementById('errorAnalysis');
      if (analysisContainer) {
        analysisContainer.innerHTML = `
          <h3>Análise de Desempenho</h3>
          <p>${analysisText.replace(/\n/g, "<br>")}</p>
        `;
      } else {
        console.error("Elemento para exibir a análise de desempenho não encontrado.");
        alert("Erro interno: elemento para exibir a análise não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao gerar a análise de desempenho:", error);
      alert("Ocorreu um erro ao gerar a análise de desempenho. Por favor, tente novamente.");
    }
  };

  const toggleFeedbackDetails = (index) => {
    const feedbackElement = document.getElementById(`feedback-${index}`);
    const fullFeedback = essays[index].feedback;
    const isTruncated = feedbackElement.textContent.endsWith('...');

    if (isTruncated) {
      feedbackElement.textContent = fullFeedback;
    } else {
      feedbackElement.textContent = `${fullFeedback.substring(0, 100)}...`;
    }
  };

  const viewEssay = (index) => {
    const essayDisplay = document.getElementById(`essayDisplay-${index}`);
    const essay = essays[index];
    if (essayDisplay) {
      essayDisplay.style.display = 'block';
      essayDisplay.innerHTML = `
        <h3>Redação Completa</h3>
        <p>${essay.userText || "Texto não disponível."}</p>
      `;
    }
  };

  if (!userData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard">
        <div className="card">
          <div className="card-header">
            <h2>Perfil</h2>
          </div>
          <div className="card-body">
            <div className="profile-info">
              <div id="profileAvatar" className="profile-avatar">
                {userData.photo ? (
                  <img src={userData.photo} width="40%" style={{ borderRadius: "50%" }} alt="Avatar" />
                ) : (
                  <FontAwesomeIcon icon={faUserCircle} />
                )}
              </div>
              <h3>{userData.firstName} {userData.lastName}</h3>
              <p>{userData.email}</p>
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <p>Mensagens Diárias</p>
                <p id="loggedUserMens">{userData.saldo_mens}</p>
              </div>
              <div className="stat-item">
                <p>Redações Mês</p>
                <p id="loggedUserRed">{userData.redacoesRest}</p>
              </div>
            </div>
            <button id="logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Pontuação por Área</h2>
          </div>
          <div className="card-body">
            <div className="score-chart-container">
              {chartData && <Pie data={chartData} />}
            </div>
            <div id="errorAnalysis"></div>
            <button id="analyzeBtn" className="analyze-btn" onClick={analyzePerformance}>
              Analisar Performance
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Redações Recentes</h2>
          </div>
          <div className="card-body">
            <ul id="essayList" className="essay-list">
              {essays.map((essay, index) => (
                <li key={index} className="essay-item">
                  <div className="essay-header">
                    <h3>Parte {index + 1}</h3>
                  </div>
                  <div className="essay-body">
                    <p><strong>Nota:</strong> {essay.nota || 'N/A'}</p>
                    <p><strong>Feedback:</strong> <span id={`feedback-${index}`}>
                      {essay.feedback && essay.feedback.length > 100
                        ? `${essay.feedback.substring(0, 100)}...`
                        : essay.feedback || 'Sem feedback disponível.'}
                    </span></p>
                  </div>
                  <div className="essay-footer">
                    <button className="show-essay" onClick={() => viewEssay(index)}>Ver Redação</button>
                    <button className="show-details" onClick={() => toggleFeedbackDetails(index)}>Mostrar Detalhes</button>
                    <div className="essay-display" id={`essayDisplay-${index}`} style={{display: 'none'}}></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="gpt-study-proposal">
        <h3>Estude com IA para o ENEM</h3>
        <p>
          Descubra uma nova maneira de se preparar para o ENEM com nosso
          assistente de estudos baseado em IA. Receba planos de estudo
          personalizados, tire dúvidas em tempo real e aprimore suas habilidades
          com feedback inteligente.
        </p>
      </div>
    </div>
  );
};

export default Home;
