// Redacao.js
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, increment, setDoc } from "firebase/firestore";
import { marked } from 'marked';
import '../styles/Redacao.css'; // Assumindo que você criará este arquivo CSS

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

const apiKey = process.env.API_KEYy;

const Redacao = () => {
  const [userId, setUserId] = useState(null);
  const [essay, setEssay] = useState('');
  const [topic, setTopic] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

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

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  useEffect(() => {
    const adjustTextareaHeight = () => {
      const textarea = document.getElementById('essayArea');
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(textarea.scrollHeight, 1200)}px`;
    };

    window.addEventListener('resize', adjustTextareaHeight);
    adjustTextareaHeight();

    return () => window.removeEventListener('resize', adjustTextareaHeight);
  }, [essay]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setTimer(0);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleEssayChange = (e) => {
    const text = e.target.value;
    setEssay(text);
    setWordCount(text.trim().split(/\s+/).length);
    
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(textarea.scrollHeight, 1200)}px`;

    const lineHeight = 24;
    const paddingTop = 24;
    const lines = text.split("\n");
    const lineCount = Math.max(lines.length, 50);
    textarea.style.backgroundSize = `100% ${lineHeight}px`;
    textarea.style.height = `${Math.max(lineCount * lineHeight + paddingTop, 1200)}px`;

    const cursorPosition = textarea.selectionStart;
    const cursorLine = text.substr(0, cursorPosition).split("\n").length;
    if (cursorLine > lineCount) {
      setEssay(text + "\n".repeat(cursorLine - lineCount));
    }
  };

  const checkSaldoRedacao = async (userId) => {
    try {
      const userRef = doc(db, "Users", userId);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        throw new Error("Documento do usuário não encontrado.");
      }

      const userData = userSnapshot.data();
      let saldoRedacao = userData.redacoesRest || 0;
      const lastUpdateDate = userData.lastDateRedacao || null;

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      if (lastUpdateDate) {
        const lastUpdate = new Date(lastUpdateDate);
        const lastUpdateMonth = lastUpdate.getMonth();
        const lastUpdateYear = lastUpdate.getFullYear();

        if (currentMonth !== lastUpdateMonth || currentYear !== lastUpdateYear) {
          saldoRedacao = 8;
          await updateDoc(userRef, {
            redacoesRest: saldoRedacao,
            lastDateRedacao: currentDate.toISOString(),
          });
        }
      } else {
        await updateDoc(userRef, {
          lastDateRedacao: currentDate.toISOString(),
        });
      }

      if (saldoRedacao > 0) {
        await updateDoc(userRef, {
          redacoesRest: increment(-1),
        });
        return true;
      } else {
        throw new Error("Você não tem saldo suficiente para continuar.");
      }
    } catch (error) {
      console.error("Erro ao verificar o saldo de redações:", error.message);
      return false;
    }
  };

  const evaluateEssay = async () => {
    if (!await checkSaldoRedacao(userId)) {
      setFeedback({ type: "noSaldo" });
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
              content: `Você é um professor experiente e altamente qualificado, especializado na correção de redações do ENEM. Sua tarefa é analisar a redação a seguir, considerando todos os critérios estabelecidos pelo edital do ENEM:

              Título: ${topic}
              Conteúdo: ${essay}
              
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

              Análise da Redação:`
            }
          ],
          max_tokens: 4000,
          temperature: 0.4
        })
      });

      if (!response.ok) {
        throw new Error("Ocorreu um erro ao avaliar sua redação");
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content.trim();

      if (!aiResponse) {
        throw new Error("O feedback retornado pelo ChatGPT está vazio.");
      }

      const scoreMatch = aiResponse.match(/Nota final: (\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
      const feedback = aiResponse.replace(/Nota final: \d+/, "").trim();

      setFeedback({ score, feedback, type: "success" });

      await saveEssayResult(userId, score, feedback, essay);

    } catch (error) {
      console.error("Ocorreu um erro ao avaliar sua redação:", error);
      setFeedback({ type: "error", feedback: error.message || "Ocorreu um erro ao avaliar sua redação. Por favor, tente novamente mais tarde." });
    }
  };

  const saveEssayResult = async (userId, nota, feedback, userText) => {
    try {
      const redacaoDocRef = doc(db, "Users", userId, "EnemData", "Redacoes");
      const redacaoData = {
        nota: nota,
        feedback: feedback,
        userText: userText,
        dataEnvio: new Date().toISOString(),
      };

      const docSnapshot = await getDoc(redacaoDocRef);

      if (docSnapshot.exists()) {
        await updateDoc(redacaoDocRef, {
          Redacao: increment([redacaoData])
        });
      } else {
        await setDoc(redacaoDocRef, {
          Redacao: [redacaoData]
        });
      }

      console.log("Redação salva com sucesso no Firestore.");
    } catch (error) {
      console.error("Erro ao salvar a redação no Firestore: ", error);
      throw new Error("Falha ao salvar a redação no Firestore. Por favor, tente novamente.");
    }
  };

  const displayFeedback = ({ score, feedback, type }) => {
    let title, message;

    if (type === "noSaldo") {
      title = "Saldo Insuficiente";
      message = "<p>Você não tem saldo suficiente para analisar a redação.</p>";
    } else if (type === "error") {
      title = "Erro";
      message = `<p>${feedback || "Ocorreu um erro ao avaliar sua redação. Por favor, tente novamente mais tarde."}</p>`;
    } else {
      title = "Avaliação da Redação";
      if (isMarkdownContent(feedback)) {
        message = `
          <p><strong>Nota:</strong> ${score}/1000</p>
          <div><strong>Feedback:</strong></div>
          <div>${marked.parse(feedback)}</div>
        `;
      } else {
        message = `
          <p><strong>Nota:</strong> ${score}/1000</p>
          <div><strong>Feedback:</strong></div>
          <div>${formatAsHTML(feedback)}</div>
        `;
      }
    }

    return (
      <div className="feedback-container">
        <h3>{title}</h3>
        <div className="feedback-content" dangerouslySetInnerHTML={{ __html: message }} />
      </div>
    );
  };

  const isMarkdownContent = (text) => {
    const tokens = marked.lexer(text);
    return tokens.some(token => token.type !== 'text');
  };

  const formatAsHTML = (text) => {
    if (typeof text !== 'string') {
      console.log('formatAsHTML received non-string value:', text);
      return '';
    }
    
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>');
  };

  return (
    <div className="container">
      <h1>Redação do ENEM</h1>
      <button id="toggleInstructions" onClick={() => setShowInstructions(!showInstructions)}>
        {showInstructions ? 'Ocultar Instruções' : 'Mostrar Instruções'}
      </button>
      <div className="instructions" style={{display: showInstructions ? 'block' : 'none'}}>
        <h3>Instruções para a Redação</h3>
        <ul>
          <li>Leia atentamente o tema e os textos motivadores.</li>
          <li>Elabore um texto dissertativo-argumentativo com no mínimo 7 e no máximo 30 linhas.</li>
          <li>Defenda claramente um ponto de vista sobre o tema, apresentando argumentos consistentes.</li>
          <li>Utilize informações de várias áreas de conhecimento.</li>
          <li>Elabore uma proposta de intervenção para o problema abordado.</li>
          <li>Respeite os direitos humanos em sua argumentação.</li>
          <li>Use linguagem clara e formal, evitando gírias ou coloquialismos.</li>
          <li>Faça um rascunho antes de passar a limpo.</li>
          <li>Revise seu texto ao final, corrigindo possíveis erros.</li>
        </ul>
      </div>
      <div className="form-group">
        <label htmlFor="essayTopic">Tópicos de Redação do ENEM:</label>
        <select id="essayTopic" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">Selecione um tópico</option>
          <option value="2023 - O desafio de aumentar a doação de órgãos no Brasil">2023 - O desafio de aumentar a doação de órgãos no Brasil</option>
          <option value="2022 - Desafios para a valorização de comunidades e povos tradicionais no Brasil">2022 - Desafios para a valorização de comunidades e povos tradicionais no Brasil</option>
          <option value="2021 - Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil">2021 - Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil</option>
          <option value="2020 - O estigma associado às doenças mentais na sociedade brasileira">2020 - O estigma associado às doenças mentais na sociedade brasileira</option>
          <option value="2019 - Democratização do acesso ao cinema no Brasil">2019 - Democratização do acesso ao cinema no Brasil</option>
          <option value="2018 - Manipulação do comportamento do usuário pelo controle de dados na internet">2018 - Manipulação do comportamento do usuário pelo controle de dados na internet</option>
          <option value="2017 - Desafios para a formação educacional de surdos no Brasil">2017 - Desafios para a formação educacional de surdos no Brasil</option>
          <option value="2016 - Caminhos para combater a intolerância religiosa no Brasil">2016 - Caminhos para combater a intolerância religiosa no Brasil</option>
          <option value="2015 - A persistência da violência contra a mulher na sociedade brasileira">2015 - A persistência da violência contra a mulher na sociedade brasileira</option>
          <option value="2014 - Publicidade infantil em questão no Brasil">2014 - Publicidade infantil em questão no Brasil</option>
          <option value="2013 - Efeitos da implantação da Lei Seca no Brasil">2013 - Efeitos da implantação da Lei Seca no Brasil</option>
          <option value="2012 - O movimento imigratório para o Brasil no século XXI">2012 - O movimento imigratório para o Brasil no século XXI</option>
          <option value="2011 - Viver em rede no século XXI: os limites entre o público e o privado">2011 - Viver em rede no século XXI: os limites entre o público e o privado</option>
          <option value="2010 - O trabalho na construção da dignidade humana">2010 - O trabalho na construção da dignidade humana</option>
          <option value="2009 - O indivíduo frente à ética nacional">2009 - O indivíduo frente à ética nacional</option>
        </select>
      </div>
      <div className="timer-container">
        <div id="timer">{formatTime(timer)}</div>
        <div className="timer-controls">
          <button onClick={startTimer}>Iniciar</button>
          <button onClick={pauseTimer}>Pausar</button>
          <button onClick={resetTimer}>Reiniciar</button>
        </div>
      </div>
      <div className="essay-container">
        <textarea
          id="essayArea"
          value={essay}
          onChange={handleEssayChange}
          placeholder="Escreva sua redação aqui..."
        ></textarea>
        <div id="wordCount">Palavras: {wordCount}</div>
      </div>
      <button id="submitEssay" onClick={evaluateEssay}>Enviar Redação</button>
      {feedback && displayFeedback(feedback)}
    </div>
  );
};

export default Redacao;
