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
import AdminRegister from './pages/admin/AdminRegister';
import AppLinksAdmin from './pages/admin/AppLinksAdmin';
import ContactsAdmin from './pages/admin/ContactsAdmin';
import DashboardHome from './pages/admin/DashboardHome';
import FoundersAdmin from './pages/admin/FoundersAdmin';
import VideosAdmin from './pages/admin/VideosAdmin';

// 🛡️ GARDE DU CORPS DES ROUTES ADMIN
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Si un inconnu essaie d'aller sur /admin/dashboard, on le jette vers la route secrète 
    // (S'il ne la connaît pas, il ne saura pas ce qui se passe)
    return <Navigate to="/darkkevythecto42" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Côté Public */}
      <Route path="/" element={<LandingPage />} />
      
      {/* 🚨 LA NOUVELLE PORTE SECRÈTE INVISIBLE 🚨 */}
      <Route path="/darkkevythecto42" element={<AdminLogin />} />
      
      {/* Route temporaire d'installation */}
      <Route path="/admin/setup" element={<AdminRegister />} />
      
      {/* Tableau de bord sécurisé (Sous-Routes) */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardHome />} />
                <Route path="app-links" element={<AppLinksAdmin />} />
                <Route path="contacts" element={<ContactsAdmin />} />
                <Route path="founders" element={<FoundersAdmin />} />
                <Route path="videos" element={<VideosAdmin />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        } 
      />

      {/* 🚨 SOLUTION ANTI ÉCRAN NOIR ET ANTI CURIEUX 🚨 */}
      {/* Si quelqu'un tape /admin/login ou n'importe quoi d'autre, il retourne à l'accueil */}
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