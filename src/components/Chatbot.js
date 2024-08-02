import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css'; // Importe o arquivo CSS
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import lessons from './Lessons'; // Importe o arquivo lessons.js
import exercises from './Exercises'; // Importe o arquivo exercises.js

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, type } = location.state;



  useEffect(() => {
    if (type === 'lesson' && lessons[topic]) {
      setMessages([{ text: `Bem-vindo ao curso de ${lessons[topic].title}! Por favor, selecione uma aula para começar:\n${lessons[topic].details}`, sender: 'bot' }]);
    } else if (type === 'exercise' && exercises[topic]) {
      setMessages([{ text: `Bem-vindo aos exercícios de ${exercises[topic].title}! Por favor, selecione um exercício para começar:\n${exercises[topic].details}`, sender: 'bot' }]);
    } else {
      setMessages([{ text: 'Erro: Tópico ou tipo selecionado inválido.', sender: 'bot' }]);
    }
  }, [topic, type]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    const newMessages = [...messages, { text: userInput, sender: 'user' }];
    setMessages(newMessages);
    setUserInput('');

    const response = await callGPTAssistant(userInput);
    setMessages([...newMessages, { text: response, sender: 'bot' }]);
  };

  const callGPTAssistant = async (userInput) => {
    const apiKey = 'sk-redacao-JqmO1mKUUN0tTRA6L1jqT3BlbkFJCN7vu2sC1EoP7AxqMGyG'; // Substitua pela sua chave de API OpenAI
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    const prompt = `${userInput}`;

    try {
      const response = await axios.post(
        endpoint,
        {
          model: "gpt-3.5-turbo-0613",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 850,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content.trim();
      }

      return 'Resposta inesperada da API.';
    } catch (error) {
      console.error('Erro na requisição:', error);
      return 'Erro ao chamar o assistente GPT.';
    }
  };

  return (
    <div className="container">
      <div className="messagesContainer">
        {messages.map((message, index) => (
          <div key={index} className={message.sender === 'bot' ? 'botMessage' : 'userMessage'}>
            <p>{message.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="inputContainer">
        <input
          className="input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Digite uma mensagem..."
        />
        <button className="button" onClick={sendMessage}>Enviar</button>
      </div>
      <button className="button" onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
};

export default Chatbot;
