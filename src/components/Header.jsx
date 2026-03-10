// src/components/Header.jsx
import { Menu } from 'lucide-react';
import React from 'react';
import { COLORS, FONTS } from '../theme/theme';

const Header = ({ toggleSidebar }) => {
  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <span style={styles.logoY}>Y</span>
        <span style={styles.logoText}>ely</span>
      </div>
      
      <button onClick={toggleSidebar} style={styles.hamburgerButton}>
        <Menu size={28} color={COLORS.textPrimary} />
      </button>
    </header>
  );
};

const styles = {
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '70px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    backgroundColor: COLORS.background,
    zIndex: 40,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: FONTS.sizes.h1,
    fontWeight: FONTS.weights.bold,
  },
  logoY: {
    color: COLORS.primary,
  },
  logoText: {
    color: COLORS.textPrimary,
  },
  hamburgerButton: {
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