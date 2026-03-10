// src/components/Hero.jsx
import { motion } from 'framer-motion';
import { Apple, Download } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { BORDERS, COLORS, FONTS, PALETTE } from '../theme/theme';

const Hero = ({ onAndroidClick, onIosClick }) => {
  const socket = useSocket();
  const [stats, setStats] = useState({ androidClicks: 0, iosClicks: 0 });

  // RECUPERATION INITIALE DES COMPTEURS
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/stats`);
        setStats(res.data);
      } catch (err) {
        console.error("Erreur stats:", err);
      }
    };
    fetchStats();
  }, []);

  // ECOUTE DU TEMPS REEL (SOCKET)
  useEffect(() => {
    if (!socket) return;
    socket.on('stats_updated', (newStats) => {
      setStats(newStats);
    });
    return () => socket.off('stats_updated');
  }, [socket]);

  return (
    <div style={styles.container}>
      {/* LOGO CENTRAL */}
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={styles.logoWrapper}
      >
        <div style={styles.logoCircle}>
          <span style={styles.logoY}>Y</span>
        </div>
      </motion.div>

      <h1 style={styles.title}>Deplacez-vous avec elegance.</h1>
      <p style={styles.subtitle}>Telechargez l'application officielle Yely.</p>

      {/* BOUTONS DE TELECHARGEMENT */}
      <div style={styles.buttonContainer}>
        
        {/* BOUTON ANDROID */}
        <div style={styles.btnWrapper}>
          <button onClick={onAndroidClick} style={styles.androidBtn}>
            <Download size={24} style={{ marginRight: 10 }} />
            <span>Android APK</span>
          </button>
          <span style={styles.counter}>{stats.androidClicks} telechargements</span>
        </div>

        {/* BOUTON IPHONE */}
        <div style={styles.btnWrapper}>
          <button onClick={onIosClick} style={styles.iosBtn}>
            <Apple size={24} style={{ marginRight: 10 }} />
            <span>iPhone (PWA)</span>
          </button>
          <span style={styles.counter}>{stats.iosClicks} installations</span>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
  },
  logoWrapper: {
    marginBottom: '30px',
  },
  logoCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: COLORS.background,
    border: `4px solid ${COLORS.primary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 0 30px ${COLORS.primary}44`,
  },
  logoY: {
    fontSize: '60px',
    fontWeight: '900',
    color: COLORS.primary,
  },
  title: {
    fontSize: FONTS.sizes.h1,
    color: COLORS.textPrimary,
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    marginBottom: '40px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    width: '100%',
    maxWidth: '320px',
  },
  btnWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  androidBtn: {
    height: '60px',
    backgroundColor: COLORS.primary,
    color: COLORS.textInverse,
    border: 'none',
    borderRadius: BORDERS.radius.pill,
    fontSize: FONTS.sizes.body,
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: `0 4px 15px ${COLORS.primary}66`,
  },
  iosBtn: {
    height: '60px',
    backgroundColor: 'transparent',
    color: COLORS.textPrimary,
    border: `2px solid ${COLORS.textPrimary}`,
    borderRadius: BORDERS.radius.pill,
    fontSize: FONTS.sizes.body,
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  counter: {
    fontSize: '12px',
    color: COLORS.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  }
};

export default Hero;