// src/components/Sidebar.jsx
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import React from 'react';
import { COLORS, FONTS } from '../theme/theme';

// 1. L'Overlay avec le flou dramatique
const overlayVariant = {
  closed: { 
    opacity: 0, 
    pointerEvents: 'none',
    transition: { duration: 0.4, ease: 'easeInOut', delay: 0.2 } 
  },
  open: { 
    opacity: 1, 
    pointerEvents: 'auto',
    transition: { duration: 0.4, ease: 'easeInOut' }
  }
};

// 2. L'effet Vague
const waveVariant = {
  closed: {
    clipPath: 'circle(0px at calc(100% - 40px) 40px)',
    transition: { duration: 0.5, ease: [0.4, 0.0, 0.2, 1] } 
  },
  open: {
    clipPath: 'circle(150vh at calc(100% - 40px) 40px)',
    transition: { duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }
  }
};

// 3. Le Stagger des liens
const listContainerVariant = {
  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  open: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
};

// 4. L'animation individuelle
const listItemVariant = {
  closed: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const Sidebar = ({ isOpen, closeSidebar, onNavigate, currentView }) => {
  
  const handleNavigation = (viewName) => {
    if (onNavigate) {
      onNavigate(viewName);
    }
    closeSidebar();
  };

  // Le style dynamique qui applique la couleur OR et un léger décalage au bouton actif
  const getLinkStyle = (viewName) => {
    const isActive = currentView === viewName;
    return {
      ...styles.link,
      color: isActive ? COLORS.primary : COLORS.textPrimary,
      borderBottom: `1px solid ${isActive ? COLORS.primary : COLORS.border}`,
      paddingLeft: isActive ? '12px' : '0px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  return (
    <>
      <motion.div
        variants={overlayVariant}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        style={styles.overlay}
        onClick={closeSidebar}
      />

      <motion.div
        variants={waveVariant}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        style={styles.sidebarContainer}
      >
        <div style={styles.header}>
          <button onClick={closeSidebar} style={styles.closeButton}>
            <X size={28} color={COLORS.textPrimary} />
          </button>
        </div>

        <motion.nav 
          variants={listContainerVariant}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          style={styles.nav}
        >
          <motion.button variants={listItemVariant} onClick={() => handleNavigation('HOME')} style={getLinkStyle('HOME')}>
            Accueil Téléchargement
          </motion.button>
          
          <motion.button variants={listItemVariant} onClick={() => handleNavigation('VIDEOS')} style={getLinkStyle('VIDEOS')}>
            Découvrir Yely (Tutoriels)
          </motion.button>
          
          <motion.button variants={listItemVariant} onClick={() => handleNavigation('FOUNDERS')} style={getLinkStyle('FOUNDERS')}>
            Fondateurs
          </motion.button>
          
          <motion.button variants={listItemVariant} onClick={() => handleNavigation('CONTACTS')} style={getLinkStyle('CONTACTS')}>
            Contacts
          </motion.button>
        </motion.nav>
      </motion.div>
    </>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Très sombre pour faire ressortir le flou
    backdropFilter: 'blur(24px)', // Flou massif
    WebkitBackdropFilter: 'blur(24px)',
    zIndex: 40,
  },
  sidebarContainer: {
    position: 'fixed',
    top: 0, right: 0, bottom: 0,
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
    clipPath: 'circle(0px at calc(100% - 40px) 40px)', 
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
    alignItems: 'flex-start',
    gap: '24px',
  },
  link: {
    background: 'none',
    border: 'none',
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.semiBold,
    textDecoration: 'none',
    paddingBottom: '12px',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
  }
};

export default Sidebar;