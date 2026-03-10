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

      {/* Le conteneur principal agit comme un ressort grâce à flex: 1 */}
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
    // LE SECRET DU ZERO SCROLL EST ICI :
    height: '100dvh', // Hauteur stricte à 100% de l'écran (dvh gère la barre URL mobile)
    overflow: 'hidden', // Empêche tout défilement vertical
    backgroundColor: COLORS.background,
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1, // Prend tout l'espace disponible entre le Header et le Footer
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden', // Sécurité supplémentaire si jamais un élément interne tente de déborder
  },
  footer: {
    padding: '12px 24px', // Padding vertical réduit pour optimiser l'espace à l'écran
    textAlign: 'center',
    borderTop: `1px solid ${COLORS.border}`,
  },
  footerText: {
    color: COLORS.textTertiary,
    fontSize: '12px',
    margin: 0, // Supprime la marge par défaut des balises <p>
  }
};

export default Layout;