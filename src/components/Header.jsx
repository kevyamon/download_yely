// src/components/Header.jsx
import { Menu } from 'lucide-react';
import React from 'react';
import { COLORS, FONTS } from '../theme/theme';

const Header = ({ openSidebar }) => {
  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        {/* Le texte Yely stylisé en or */}
        <span style={styles.logoText}>Yely</span>
      </div>
      
      {/* Le bouton Hamburger qui déclenche openSidebar */}
      <button onClick={openSidebar} style={styles.menuButton}>
        <Menu size={28} color={COLORS.textPrimary} />
      </button>
    </header>
  );
};

const styles = {
  header: {
    height: '80px',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    position: 'relative',
    zIndex: 10,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logoText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.h2,
    fontWeight: FONTS.weights.bold,
    letterSpacing: '1px',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default Header;