// src/App.jsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { SocketProvider } from './context/SocketContext';
import { COLORS } from './theme/theme';

// Pages temporaires
const LandingPage = () => (
  <Layout>
    <div style={{ padding: 50, color: COLORS.textPrimary, textAlign: 'center' }}>
      <h1>Centre Yely</h1>
      <p>Boutons de telechargement a venir ici...</p>
    </div>
  </Layout>
);

const AdminDashboard = () => (
  <div style={{ color: COLORS.primary, padding: 50 }}>
    Dashboard Admin en construction... (Pas de Layout public ici)
  </div>
);

const App = () => {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
};

export default App;