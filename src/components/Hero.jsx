// src/components/Hero.jsx
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Apple, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../theme/theme';

import logoImg from '../assets/logo.png';

// Le logo Android SVG Pur
const AndroidIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.244 13.8533 7.85 12 7.85c-1.8533 0-3.5902.394-5.1367 1.1005L4.841 5.4475a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
  </svg>
);

const Hero = ({ onAndroidClick, onIosClick }) => {
  const socket = useSocket();
  const { showToast } = useToast();
  
  // STRATÉGIE BANK GRADE : On initialise avec le cache du navigateur pour éviter le "0" au F5
  const [stats, setStats] = useState(() => {
    const cachedStats = localStorage.getItem('yely_stats');
    return cachedStats ? JSON.parse(cachedStats) : { androidClicks: 0, iosClicks: 0 };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPlatform, setPendingPlatform] = useState(null);

  // Synchronisation avec le backend et mise à jour du cache
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/stats`);
        const newStats = {
          androidClicks: res.data?.androidClicks || 0,
          iosClicks: res.data?.iosClicks || 0
        };
        setStats(newStats);
        localStorage.setItem('yely_stats', JSON.stringify(newStats));
      } catch (err) {
        console.error("Erreur stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Écoute du temps réel via Socket
  useEffect(() => {
    if (!socket) return;
    socket.on('stats_updated', (newStats) => {
      setStats(newStats);
      localStorage.setItem('yely_stats', JSON.stringify(newStats));
    });
    return () => socket.off('stats_updated');
  }, [socket]);

  const handleInterceptClick = (platform) => {
    setPendingPlatform(platform);
    setIsModalOpen(true);
  };

  const confirmDownload = () => {
    setIsModalOpen(false);
    showToast(`Préparation de l'installation pour ${pendingPlatform === 'android' ? 'Android' : 'iPhone'}...`, 'info');
    setTimeout(() => {
      if (pendingPlatform === 'android') onAndroidClick();
      else if (pendingPlatform === 'ios') onIosClick();
    }, 800);
  };

  // --- ANIMATIONS IMMERSIVES (FRAMER MOTION) --- //

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, y: 0, scale: 1, 
      transition: { type: 'spring', stiffness: 120, damping: 14 } 
    }
  };

  const pulseAndroidVariants = {
    pulse: {
      scale: [1, 1.025, 1],
      boxShadow: [
        `0px 0px 0px 0px ${COLORS.primary}40`,
        `0px 0px 20px 4px ${COLORS.primary}60`,
        `0px 0px 0px 0px ${COLORS.primary}00`
      ],
      transition: { duration: 2.5, ease: "easeInOut", repeat: Infinity }
    }
  };

  const pulseIosVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      boxShadow: [
        `0px 0px 0px 0px ${COLORS.textPrimary}40`,
        `0px 0px 15px 3px ${COLORS.textPrimary}40`,
        `0px 0px 0px 0px ${COLORS.textPrimary}00`
      ],
      transition: { duration: 2.5, ease: "easeInOut", repeat: Infinity, delay: 1.25 }
    }
  };

  return (
    <>
      <motion.div 
        style={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* LOGO ARRONDI AVEC ANIMATION D'ENTRÉE */}
        <motion.div variants={itemVariants} style={styles.logoWrapper}>
          <img 
            src={logoImg} 
            alt="Yely Logo" 
            style={styles.logoImage} 
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
          <div style={{...styles.logoCircle, display: 'none'}}>
            <span style={styles.logoY}>Y</span>
          </div>
        </motion.div>

        <motion.h1 variants={itemVariants} style={styles.title}>
          L'ELITE DU TRANSPORT.
        </motion.h1>
        
        <motion.p variants={itemVariants} style={styles.subtitle}>
          Téléchargez l'application officielle Yely.
        </motion.p>

        {/* BOUTONS AVEC LE VRAI HEARTBEAT CONTINU */}
        <motion.div variants={itemVariants} style={styles.buttonContainer}>
          
          <div style={styles.btnWrapper}>
            <motion.button 
              onClick={() => handleInterceptClick('android')} 
              style={{ ...styles.downloadBtn, borderColor: COLORS.borderActive }}
              animate="pulse"
              variants={pulseAndroidVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
            >
              <div style={styles.btnContent}>
                <div style={styles.btnIconWrapper}><AndroidIcon size={26} /></div>
                <div style={styles.btnTextWrapper}>
                  <span style={styles.btnTitle}>Télécharger</span>
                  <span style={styles.btnSub}>pour Android</span>
                </div>
              </div>
            </motion.button>
            <span style={styles.counter}>{stats.androidClicks} téléchargements</span>
          </div>

          <div style={styles.btnWrapper}>
            <motion.button 
              onClick={() => handleInterceptClick('ios')} 
              style={{ ...styles.downloadBtn, borderColor: COLORS.border }}
              animate="pulse"
              variants={pulseIosVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
            >
              <div style={styles.btnContent}>
                <div style={styles.btnIconWrapper}><Apple size={26} color={COLORS.textPrimary} /></div>
                <div style={styles.btnTextWrapper}>
                  <span style={styles.btnTitle}>Installer la PWA</span>
                  <span style={{...styles.btnSub, color: COLORS.textSecondary}}>pour iPhone</span>
                </div>
              </div>
            </motion.button>
            <span style={styles.counter}>{stats.iosClicks} installations</span>
          </div>

        </motion.div>
      </motion.div>

      {/* MODALE D'AVERTISSEMENT IMMERSIVE */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            style={styles.modalOverlay}
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          >
            <motion.div 
              style={styles.modalContent}
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 250, damping: 20 }}
            >
              <button style={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} color={COLORS.textPrimary} />
              </button>
              
              <div style={styles.modalIconBox}>
                <AlertCircle size={36} color={COLORS.primary} />
              </div>
              
              <h2 style={styles.modalTitle}>Information Importante</h2>
              
              <div style={styles.modalTextContainer}>
                <p style={styles.modalText}>
                  <strong style={{ color: COLORS.primary }}>Pour les Clients :</strong> L'application fonctionne parfaitement sur Android et iPhone (iOS).
                </p>
                <div style={styles.modalDivider} />
                <p style={styles.modalText}>
                  <strong style={{ color: COLORS.textPrimary }}>Pour les Chauffeurs :</strong> Afin de garantir une précision GPS absolue en arrière-plan, l'application Chauffeur est <strong style={{color: COLORS.danger}}>temporairement réservée aux téléphones Android</strong>.
                </p>
              </div>

              <motion.button 
                style={styles.modalConfirmBtn} 
                onClick={confirmDownload}
                whileHover={{ scale: 1.02, backgroundColor: COLORS.primaryLight }}
                whileTap={{ scale: 0.98 }}
              >
                J'ai compris, continuer
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// COMPACTAGE DES STYLES POUR LE SANS-SCROLL
const styles = {
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '15px 20px', 
    textAlign: 'center',
    minHeight: '85dvh', // Laisse de l'espace pour le header/copyright
    boxSizing: 'border-box'
  },
  logoWrapper: { 
    marginBottom: '15px', 
    borderRadius: '50%', 
    overflow: 'hidden', 
    width: '100px', 
    height: '100px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: COLORS.richBlack, 
    boxShadow: `0 0 40px ${COLORS.primary}44` 
  },
  logoImage: { width: '100%', height: '100%', objectFit: 'cover' },
  logoCircle: { width: '100%', height: '100%', borderRadius: '50%', backgroundColor: COLORS.background, border: `4px solid ${COLORS.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoY: { fontSize: '40px', fontWeight: '900', color: COLORS.primary },
  title: { fontSize: FONTS.sizes.h1, color: COLORS.textPrimary, marginBottom: '5px', fontWeight: '800' },
  subtitle: { fontSize: FONTS.sizes.body, color: COLORS.textSecondary, marginBottom: '25px' },
  buttonContainer: { display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '340px' },
  btnWrapper: { display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' },
  
  downloadBtn: {
    ...GLASS.card, position: 'relative', height: '60px', display: 'flex', alignItems: 'center', padding: 0, cursor: 'pointer', background: COLORS.glassSurface
  },
  btnContent: { display: 'flex', alignItems: 'center', width: '100%', padding: '0 15px', zIndex: 2, position: 'relative' },
  btnIconWrapper: { width: '40px', display: 'flex', justifyContent: 'center', color: COLORS.primary },
  btnTextWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderLeft: `1px solid ${COLORS.border}`, paddingLeft: '12px', marginLeft: '5px' },
  btnTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.h4, fontWeight: 'bold' },
  btnSub: { color: COLORS.primary, fontSize: FONTS.sizes.caption },
  counter: { fontSize: '11px', color: COLORS.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: SPACING.md },
  modalContent: { ...GLASS.modal, width: '100%', maxWidth: '380px', maxHeight: '90vh', overflowY: 'auto', borderRadius: BORDERS.radius.xl, padding: SPACING.lg, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', border: `1px solid ${COLORS.border}`, boxShadow: `0 20px 40px rgba(0,0,0,0.5)` },
  modalCloseBtn: { position: 'absolute', top: SPACING.md, right: SPACING.md, background: 'none', border: 'none', cursor: 'pointer', padding: '8px' },
  modalIconBox: { width: '60px', height: '60px', borderRadius: '30px', backgroundColor: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  modalTitle: { fontSize: FONTS.sizes.h3, color: COLORS.textPrimary, fontWeight: 'bold', marginBottom: SPACING.md, textAlign: 'center' },
  modalTextContainer: { backgroundColor: 'rgba(0,0,0,0.2)', padding: SPACING.md, borderRadius: BORDERS.radius.lg, marginBottom: SPACING.lg, width: '100%' },
  modalText: { fontSize: FONTS.sizes.bodySmall, color: COLORS.textSecondary, lineHeight: 1.5, textAlign: 'left' },
  modalDivider: { height: '1px', backgroundColor: COLORS.border, margin: `${SPACING.sm}px 0` },
  modalConfirmBtn: { backgroundColor: COLORS.primary, color: '#000', border: 'none', borderRadius: BORDERS.radius.pill, height: '45px', width: '100%', fontSize: FONTS.sizes.body, fontWeight: 'bold', cursor: 'pointer' }
};

export default Hero;