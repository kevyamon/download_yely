// src/App.jsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';

// Pages temporaires pour valider l'architecture
const LandingPage = () => <div style={{ color: 'white', padding: 50 }}>Landing Page Yely en construction...</div>;
const AdminDashboard = () => <div style={{ color: '#D4AF37', padding: 50 }}>Dashboard Admin en construction...</div>;

const App = () => {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          {/* Route publique : La Download Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Route privee : Ton tableau de bord de gestion */}
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
};

export default App;