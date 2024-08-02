import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch, Alert } from 'react-native';
import axios from 'axios';

const Redacao = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [temas, setTemas] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    // Simulação de carregamento de temas anteriores do ENEM
    const mockTemas = [
      'Tema 1: Tecnologia e Sociedade',
      'Tema 2: Meio Ambiente e Sustentabilidade',
      'Tema 3: Educação e Desenvolvimento',
    ];
    setTemas(mockTemas);
  }, []);

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            alert('Tempo esgotado!');
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 60000); // 60000 milissegundos = 1 minuto
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleSubmit = async () => {
    const lines = conteudo.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 7) {
      Alert.alert('Erro', 'A redação deve ter pelo menos 7 linhas.');
      return;
    }
    if (lines.length > 30) {
      Alert.alert('Erro', 'A redação deve ter no máximo 30 linhas.');
      return;
    }

    // Lógica para enviar a redação para análise usando ChatGPT
    const analysis = await analyzeRedacao(conteudo);
    setAnalysisResult(analysis);
    Alert.alert('Sucesso', 'Redação enviada para análise!');
  };

  const analyzeRedacao = async (conteudo) => {
    const apiKey = 'sk-redacao-JqmO1mKUUN0tTRA6L1jqT3BlbkFJCN7vu2sC1EoP7AxqMGyG'; // Substitua pela sua chave de API OpenAI
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    const prompt = `Analise a seguinte redação do ENEM: "${conteudo}"`;

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

  const startTimer = () => {
    setTimerActive(true);
  };

  return (
    <View style={[styles.container, darkMode && styles.darkMode]}>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Alternar Tema Escuro</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      <Text style={styles.title}>Redação do ENEM</Text>
      <View style={styles.instructions}>
        <Text><strong>Instruções:</strong></Text>
        <Text>1. Escreva seu rascunho no espaço abaixo.</Text>
        <Text>2. O texto final deve ter até 30 linhas.</Text>
        <Text>3. Cópias de textos serão desconsideradas.</Text>
        <Text>4. Receberá nota zero se:</Text>
        <Text>- Tiver menos de 7 linhas.</Text>
        <Text>- Fugir do tema ou não for dissertativo-argumentativo.</Text>
        <Text>- Tiver partes desconectadas do tema.</Text>
      </View>
      <View style={styles.formGroup}>
        <Text>Temas Anteriores do ENEM:</Text>
        {temas.map((tema, index) => (
          <Text key={index}>{tema}</Text>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.textarea}
        placeholder="Conteúdo"
        multiline
        numberOfLines={10}
        value={conteudo}
        onChangeText={setConteudo}
      />
      <Button title="Enviar para Análise" onPress={handleSubmit} color="#009739" />
      {analysisResult && (
        <View style={styles.analysisResult}>
          <Text style={styles.analysisTitle}>Análise da Redação:</Text>
          <Text>{analysisResult}</Text>
        </View>
      )}
      <View style={styles.timer}>
        <Text>Definir contagem regressiva (minutos):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={countdown.toString()}
          onChangeText={text => setCountdown(parseInt(text, 10))}
        />
        <Button title="Iniciar" onPress={startTimer} color="#009739" />
        <Text>{countdown} minutos restantes</Text>
      </View>
      <Button title="Voltar" onPress={() => navigation.goBack()} color="#009739" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  darkMode: {
    backgroundColor: '#181818',
    color: '#f8f8f8',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  toggleText: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructions: {
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textarea: {
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlignVertical: 'top',
  },
  timer: {
    marginTop: 20,
  },
  analysisResult: {
    marginTop: 20,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default redacao;
