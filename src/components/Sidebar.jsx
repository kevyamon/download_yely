// src/components/Sidebar.jsx
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';
import { BORDERS, COLORS, FONTS } from '../theme/theme';

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20, 
        bounce: 0.4 
      }}
      style={styles.sidebarContainer}
    >
      <div style={styles.header}>
        <button onClick={closeSidebar} style={styles.closeButton}>
          <X size={28} color={COLORS.textPrimary} />
        </button>
      </div>

      <nav style={styles.nav}>
        <a href="#about" onClick={closeSidebar} style={styles.link}>C'est quoi Yely ?</a>
        <a href="#contacts" onClick={closeSidebar} style={styles.link}>Contacts</a>
        <a href="#founders" onClick={closeSidebar} style={styles.link}>Fondateurs</a>
        <a href="#tutorial" onClick={closeSidebar} style={styles.link}>Comment ca marche</a>
      </nav>
    </motion.div>
  );
};

const styles = {
  sidebarContainer: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '80%',
    maxWidth: '400px',
    backgroundColor: COLORS.glassSurface,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderLeft: `1px solid ${COLORS.border}`,
    zIndex: 50,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '40px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  link: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.semiBold,
    textDecoration: 'none',
    paddingBottom: '12px',
    borderBottom: `1px solid ${COLORS.border}`,
  }
};

export default Sidebar;