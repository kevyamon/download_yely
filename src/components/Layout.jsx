// src/components/Layout.jsx
import React, { useState } from 'react';
import { COLORS } from '../theme/theme';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, onNavigate, currentView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div style={styles.container}>
      <Header openSidebar={() => setIsSidebarOpen(true)} />

      <Sidebar 
        isOpen={isSidebarOpen} 
        closeSidebar={() => setIsSidebarOpen(false)} 
        onNavigate={onNavigate}
        currentView={currentView} // On transmet la vue active au menu
      />

      <main style={styles.mainContent}>
        {children}
      </main>

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
    flex: 1,
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