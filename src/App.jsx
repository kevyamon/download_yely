// src/App.jsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './context/ToastContext'; // <-- NOUVEAU
import { COLORS } from './theme/theme';

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
      {/* On englobe l'application avec le ToastProvider */}
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </SocketProvider>
  );
};

export default App;