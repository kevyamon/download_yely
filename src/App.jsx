// src/App.jsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { COLORS } from './theme/theme';

// 1. ON IMPORTE LA VRAIE PAGE QU'ON A CODÉE
import LandingPage from './pages/LandingPage';

// Page Admin temporaire
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
          {/* 2. ON UTILISE LA VRAIE PAGE ICI */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
};

export default App;