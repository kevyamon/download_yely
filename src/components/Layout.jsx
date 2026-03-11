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
        currentView={currentView}
      />

      <main style={styles.mainContent}>
        {children}
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} Yely. Tous droits reserves.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    height: '100dvh',
    overflow: 'hidden', // On garde hidden ici pour fixer le Header/Footer
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
    overflowY: 'auto', // Autorise le scroll vertical uniquement ici
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch', // Scroll fluide sur iOS
  },
  footer: {
    padding: '12px 24px',
    textAlign: 'center',
    borderTop: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.background, // Assure que le footer est opaque pendant le scroll
  },
  footerText: {
    color: COLORS.textTertiary,
    fontSize: '12px',
    margin: 0,
  }
};

export default Layout;