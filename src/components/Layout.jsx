// src/components/Layout.jsx
import React, { useState } from 'react';
import { COLORS } from '../theme/theme';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, onNavigate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={styles.container}>
      {/* 1. Le Header s'occupe juste d'ouvrir le menu */}
      <Header openSidebar={() => setIsSidebarOpen(true)} />

      {/* 2. Le Sidebar reçoit onNavigate pour pouvoir changer les pages */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setIsSidebarOpen(false)} 
        onNavigate={onNavigate}
      />

      {/* 3. LA CORRECTION EST ICI : On affiche {children} (le contenu de LandingPage) au lieu du texte en dur */}
      <main style={styles.mainContent}>
        {children}
      </main>

      {/* 4. Un footer minimaliste Bank Grade */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} Yely. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1, // Prend tout l'espace disponible entre le header et le footer
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
  },
  footer: {
    padding: '24px',
    textAlign: 'center',
    borderTop: `1px solid ${COLORS.border}`,
  },
  footerText: {
    color: COLORS.textTertiary,
    fontSize: '12px',
  }
};

export default Layout;