// src/components/ThemeWatcher.jsx
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { BORDERS, COLORS, FONTS, GLASS, SPACING } from '../theme/theme';

const ThemeWatcher = () => {
  const [themeChanged, setThemeChanged] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event) => {
      console.log("Thème système modifié détecté. Nouveau mode sombre :", event.matches);
      setThemeChanged(true);
    };

    // Implémentation ultra-robuste pour compatibilité croisée (Modernes + Anciens Safari/iOS)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      // Fallback pour les anciens navigateurs
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {themeChanged && (
        <motion.div
          style={styles.overlay}
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        >
          <motion.div
            style={styles.modal}
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
          >
            <h2 style={styles.title}>Mise à jour de l'affichage</h2>
            
            <p style={styles.text}>
              Nous avons détecté un changement de thème sur votre appareil (Mode Clair / Sombre). 
              Veuillez rafraîchir l'application pour appliquer les nouvelles couleurs de manière optimale.
            </p>

            <motion.button
              style={styles.button}
              onClick={handleRestart}
              whileHover={{ scale: 1.02, backgroundColor: COLORS.primaryLight }}
              whileTap={{ scale: 0.98 }}
            >
              Rafraîchir maintenant
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: SPACING.md
  },
  modal: {
    ...GLASS.modal,
    width: '100%',
    maxWidth: '400px',
    borderRadius: BORDERS.radius.xl,
    padding: SPACING.xl,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: `1px solid ${COLORS.border}`,
    boxShadow: `0 20px 40px rgba(0,0,0,0.5)`
  },
  title: {
    fontSize: FONTS.sizes.h3,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginBottom: SPACING.md
  },
  text: {
    fontSize: FONTS.sizes.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 1.5
  },
  button: {
    backgroundColor: COLORS.primary,
    color: '#000',
    border: 'none',
    borderRadius: BORDERS.radius.pill,
    height: '48px',
    width: '100%',
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default ThemeWatcher;