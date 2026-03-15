// src/components/Loader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { COLORS } from '../theme/theme';

const Loader = ({ message = "Chargement en cours..." }) => {
  return (
    <div style={styles.container}>
      <motion.div
        style={styles.spinner}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
      <motion.p
        style={styles.text}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        {message}
      </motion.p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    width: '100%',
    padding: '20px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: `4px solid ${COLORS.border}`,
    borderTop: `4px solid ${COLORS.primary}`,
    borderRadius: '50%',
    marginBottom: '16px',
  },
  text: {
    color: COLORS.primary,
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '1px',
    margin: 0,
  }
};

export default Loader;