import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Picker, ScrollView } from 'react-native';
import axios from 'axios';

const Exercises = ({ navigation }) => {
  const [subject, setSubject] = useState('Ciências Humanas');
  const [numQuestions, setNumQuestions] = useState('15');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const generateQuestions = async () => {
    // Lógica para gerar questões usando ChatGPT
    const prompt = `Gerar ${numQuestions} questões de ${subject} com 4 opções cada e a resposta correta indicada.`;
    const generatedQuestions = await callGPTAssistant(prompt);
    setQuestions(generatedQuestions);
  };

  const submitAnswers = async () => {
    // Lógica para verificar respostas usando ChatGPT
    const prompt = `Verifique as respostas fornecidas: ${JSON.stringify(answers)} para as questões: ${JSON.stringify(questions)}. Retorne a pontuação total.`;
    const verificationResult = await callGPTAssistant(prompt);
    setResults(verificationResult);
  };

  const callGPTAssistant = async (prompt) => {
    const apiKey = 'sk-redacao-JqmO1mKUUN0tTRA6L1jqT3BlbkFJCN7vu2sC1EoP7AxqMGyG'; // Substitua pela sua chave de API OpenAI
    const endpoint = 'https://api.openai.com/v1/chat/completions';

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
        const generatedText = response.data.choices[0].message.content.trim();
        // Parse the generated text to extract questions and answers
        const parsedResult = parseResult(generatedText);
        return parsedResult;
      }

      return 'Resposta inesperada da API.';
    } catch (error) {
      console.error('Erro na requisição:', error);
      return 'Erro ao chamar o assistente GPT.';
    }
  };

  const parseResult = (text) => {
    // Lógica para parsear o texto gerado pelo ChatGPT em objetos de questões ou resultados de verificação
    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch (error) {
      console.error('Erro ao parsear resultado:', error);
      return text;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gerador de Questões</Text>
      <Picker
        selectedValue={subject}
        style={styles.picker}
        onValueChange={(itemValue) => setSubject(itemValue)}
      >
        <Picker.Item label="Ciências Humanas" value="Ciências Humanas" />
        <Picker.Item label="Ciências Naturais" value="Ciências Naturais" />
        <Picker.Item label="Linguagens" value="Linguagens" />
        <Picker.Item label="Matemática" value="Matemática" />
        <Picker.Item label="Língua Inglesa" value="Língua Inglesa" />
        <Picker.Item label="Língua Espanhola" value="Língua Espanhola" />
        <Picker.Item label="Redação" value="Redação" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Número de Questões"
        keyboardType="numeric"
        value={numQuestions}
        onChangeText={setNumQuestions}
      />
      <Button title="Gerar Questões" onPress={generateQuestions} color="#009739" />
      {questions.length > 0 && (
        <View>
          {questions.map(q => (
            <View key={q.id} style={styles.questionContainer}>
              <Text style={styles.questionText}>{q.question}</Text>
              {q.options.map(option => (
                <Button
                  key={option}
                  title={option}
                  onPress={() => setAnswers({ ...answers, [q.id]: option })}
                  color="#009739"
                />
              ))}
            </View>
          ))}
          <Button title="Enviar Respostas" onPress={submitAnswers} color="#009739" />
        </View>
      )}
      {results && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>{results}</Text>
        </View>
      )}
      <Button title="Voltar" onPress={() => navigation.goBack()} color="#009739" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Exercises;