import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const Chatbot = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const flatListRef = useRef();
  const route = useRoute();
  const { topic, type } = route.params;

  useEffect(() => {
    if (type === 'lesson' && lessons[topic]) {
      setMessages([{ text: `Bem-vindo ao curso de ${lessons[topic].title}! Por favor, selecione uma aula para começar:\n${lessons[topic].details}`, sender: 'bot' }]);
    } else if (type === 'exercise' && exercises[topic]) {
      setMessages([{ text: `Bem-vindo aos exercícios de ${exercises[topic].title}! Por favor, selecione um exercício para começar:\n${exercises[topic].details}`, sender: 'bot' }]);
    } else {
      setMessages([{ text: 'Erro: Tópico ou tipo selecionado inválido.', sender: 'bot' }]);
    }
  }, [topic, type]);

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
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={item.sender === 'bot' ? styles.botMessage : styles.userMessage}>
            <Text>{item.text}</Text>
          </View>
        )}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Digite uma mensagem..."
        />
        <Button title="Enviar" onPress={sendMessage} color="#009739" />
      </View>
      <Button title="Voltar" onPress={() => navigation.goBack()} color="#009739" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d0e0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default Chatbot;