// src/App.jsx
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './context/ToastContext';

// Pages Publiques
import LandingPage from './pages/LandingPage';

// Pages Admin
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister'; // <-- IMPORT DE LA PAGE D'INITIALISATION
import ContactsAdmin from './pages/admin/ContactsAdmin';
import DashboardHome from './pages/admin/DashboardHome';

// 🛡️ GARDE DU CORPS DES ROUTES ADMIN
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Côté Public */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Connexion et Initialisation Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/setup" element={<AdminRegister />} /> {/* <-- ROUTE TEMPORAIRE SÉCURISÉE */}
      
      {/* Tableau de bord sécurisé (Sous-Routes) */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                {/* Redirection automatique de /admin vers /admin/dashboard */}
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                
                {/* La vraie page des statistiques */}
                <Route path="dashboard" element={<DashboardHome />} />
                
                {/* La vraie page de gestion des contacts */}
                <Route path="contacts" element={<ContactsAdmin />} />
                
                {/* Les autres vues (Founders, Videos...) viendront s'ajouter ici ! */}
                <Route path="founders" element={<h2 style={{color: 'white'}}>Gestion de l'équipe à venir...</h2>} />
                <Route path="videos" element={<h2 style={{color: 'white'}}>Gestion des vidéos à venir...</h2>} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } 
      />

      {/* 🚨 SOLUTION ANTI ÉCRAN NOIR 🚨 */}
      {/* Si l'utilisateur tape une adresse qui n'existe pas, on le renvoie à l'accueil */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <SocketProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </SocketProvider>
  );
};

export default App;