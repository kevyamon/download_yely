// src/App.jsx
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './context/ToastContext';

// Composants globaux
import ThemeWatcher from './components/ThemeWatcher';

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

// GARDE DU CORPS DES ROUTES ADMIN
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/darkkevythecto42" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/darkkevythecto42" element={<AdminLogin />} />
      <Route path="/admin/setup" element={<AdminRegister />} />
      
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <SocketProvider>
      <ToastProvider>
        <AuthProvider>
          <ThemeWatcher />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </SocketProvider>
  );
};

export default App;