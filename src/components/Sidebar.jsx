// src/components/Sidebar.jsx
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';
import { COLORS, FONTS } from '../theme/theme';

const Sidebar = ({ isOpen, closeSidebar, onNavigate }) => {
  
  const handleNavigation = (viewName) => {
    if (onNavigate) {
      onNavigate(viewName);
    }
    closeSidebar();
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, bounce: 0.4 }}
      style={styles.sidebarContainer}
    >
      <div style={styles.header}>
        <button onClick={closeSidebar} style={styles.closeButton}>
          <X size={28} color={COLORS.textPrimary} />
        </button>
      </div>

      <nav style={styles.nav}>
        <button onClick={() => handleNavigation('HOME')} style={styles.link}>
          Accueil Téléchargement
        </button>
        <button onClick={() => handleNavigation('VIDEOS')} style={styles.link}>
          Découvrir Yely (Tutoriels)
        </button>
        <button onClick={() => handleNavigation('FOUNDERS')} style={styles.link}>
          Fondateurs
        </button>
        <button onClick={() => handleNavigation('CONTACTS')} style={styles.link}>
          Contacts
        </button>
      </nav>
    </motion.div>
  );
};

const styles = {
  sidebarContainer: {
    position: 'fixed', top: 0, right: 0, bottom: 0, width: '80%', maxWidth: '400px',
    backgroundColor: COLORS.glassSurface, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
    borderLeft: `1px solid ${COLORS.border}`, zIndex: 50, padding: '24px',
    display: 'flex', flexDirection: 'column',
  },
  header: {
    display: 'flex', justifyContent: 'flex-end', marginBottom: '40px',
  },
  closeButton: {
    background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
  },
  nav: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '24px',
  },
  link: {
    background: 'none', border: 'none', color: COLORS.textPrimary,
    fontSize: FONTS.sizes.h3, fontWeight: FONTS.weights.semiBold,
    textDecoration: 'none', paddingBottom: '12px', borderBottom: `1px solid ${COLORS.border}`,
    width: '100%', textAlign: 'left', cursor: 'pointer',
  }
};

export default Sidebar;