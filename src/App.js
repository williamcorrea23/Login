import React, { useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import Dashboard from './screens/Dashboard';
import Lessons from './screens/Lessons';
import Exercises from './screens/Exercises';
import Chatbot from './components/Chatbot';
import Profile from './screens/Profile';
import Redacao from './screens/redacao';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/login";
import SignUp from "./components/register";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/profile";
import { useState } from "react";
import { auth } from "./components/firebase";

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ header: () => <Header title="ENEM Wise E-Learning Brasil" /> }}
        />
        <Stack.Screen
          name="Lessons"
          component={Lessons}
          options={{ header: () => <Header title="Aulas" /> }}
        />
        <Stack.Screen
          name="Exercises"
          component={Exercises}
          options={{ header: () => <Header title="Exercícios" /> }}
        />
        <Stack.Screen
          name="Chatbot"
          component={Chatbot}
          options={{ header: () => <Header title="Chatbot" /> }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ header: () => <Header title="Perfil" /> }}
        />
        <Stack.Screen
          name="Redacao"
          component={Redacao}
          options={{ header: () => <Header title="Redação" /> }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
    <Router>
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/Header" /> : <Header />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <ToastContainer />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
