// src/context/AuthContext.jsx
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // On vérifie s'il y a déjà un token de connexion en mémoire
  const [token, setToken] = useState(localStorage.getItem('yely_admin_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const { showToast } = useToast();

  // A chaque fois que le token change, on met à jour Axios
  useEffect(() => {
    if (token) {
      // Injecte le token dans toutes les requêtes futures
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    } else {
      // Retire le token si on est déconnecté
      delete axios.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      
      const newToken = res.data.token;
      localStorage.setItem('yely_admin_token', newToken);
      setToken(newToken);
      
      showToast("Connexion autorisée. Bienvenue Administrateur.", "success");
      return true;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      showToast(error.response?.data?.message || "Identifiants incorrects ou accès refusé.", "error");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('yely_admin_token');
    setToken(null);
    showToast("Session sécurisée fermée.", "info");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};