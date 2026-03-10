// src/components/Hero.jsx
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../theme/theme';

import logoImg from '../assets/logo.png';

// Le VRAI logo Android (complet)
const AndroidIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 448 512" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2h-40.1v47.4c0 13.6-11.1 24.6-24.6 24.6-13.6 0-24.6-11.1-24.6-24.6V146.3H151v47.4c0 13.6-11.1 24.6-24.6 24.6-13.6 0-24.6-11.1-24.6-24.6v-47.4H61.6c-31.1 0-45.7 23.3-53.4 54.2C3.3 218.4 0 240 0 240v132.8c0 23.2 18.8 42 42 42h364c23.2 0 42-18.8 42-42V240c0 0-3.3-21.6-8.2-39.5zM122.5 284.1c-14.2 0-25.8-11.6-25.8-25.8s11.6-25.8 25.8-25.8 25.8 11.6 25.8 25.8-11.6 25.8-25.8 25.8zm203 0c-14.2 0-25.8-11.6-25.8-25.8s11.6-25.8 25.8-25.8 25.8 11.6 25.8 25.8-11.6 25.8-25.8 25.8zM224 86.8c-28.9 0-55.8 8.6-78.5 23.5L111.8 76.5c-4.3-4.3-11.4-4.3-15.7 0-4.3 4.3-4.3 11.4 0 15.7l35 35c-37.4 28.5-62.7 73.1-66.7 123.6h203.4V251h116.4c-4-50.5-29.3-95.1-66.7-123.6l35-35c4.3-4.3 4.3-11.4 0-15.7-4.3-4.3-11.4-4.3-15.7 0l-33.7 33.8C279.8 95.4 252.9 86.8 224 86.8z"/>
  </svg>
);

// Le VRAI logo Apple
const AppleIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 384 512" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
);

const Hero = ({ onAndroidClick, onIosClick }) => {
  const socket = useSocket();
  const { showToast } = useToast();
  
  const [stats, setStats] = useState(() => {
    const cachedStats = localStorage.getItem('yely_stats');
    return cachedStats ? JSON.parse(cachedStats) : { androidClicks: 0, iosClicks: 0 };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPlatform, setPendingPlatform] = useState(null);

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

        {/* NOUVEAU LAYOUT : BOUTONS CARTES (CARRÉS) CÔTE À CÔTE */}
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
                <div style={styles.btnIconWrapper}><AndroidIcon size={32} /></div>
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
                <div style={styles.btnIconWrapper}><AppleIcon size={32} color={COLORS.textPrimary} /></div>
                <div style={styles.btnTextWrapper}>
                  <span style={styles.btnTitle}>Installer</span>
                  <span style={{...styles.btnSub, color: COLORS.textSecondary}}>pour iPhone</span>
                </div>
              </div>
            </motion.button>
            <span style={styles.counter}>{stats.iosClicks} installations</span>
          </div>

        </motion.div>
      </motion.div>

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

const styles = {
  // AJUSTEMENTS 100% ECRAN ZÉRO SCROLL
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', // Centre tout le contenu verticalement dans l'espace restant
    flex: 1, // Permet au Hero de remplir l'espace vide entre le Header et le Footer
    padding: '2vh 20px', // Des marges relatives à l'écran plutôt que fixes
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box'
  },
  
  // LOGO ET TEXTES LÉGÈREMENT OPTIMISÉS POUR NE PAS PRENDRE TROP DE PLACE
  logoWrapper: { 
    marginBottom: '2vh', 
    borderRadius: '50%', 
    overflow: 'hidden', 
    width: '80px', // Un poil plus petit pour faire de la place aux boutons
    height: '80px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: COLORS.richBlack,
    border: `3px solid ${COLORS.primary}`,
    boxShadow: `0 0 30px ${COLORS.primary}66`
  },
  logoImage: { width: '100%', height: '100%', objectFit: 'cover' },
  logoCircle: { width: '100%', height: '100%', borderRadius: '50%', backgroundColor: COLORS.background, border: `4px solid ${COLORS.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoY: { fontSize: '32px', fontWeight: '900', color: COLORS.primary },
  
  title: { fontSize: FONTS.sizes.h2, color: COLORS.textPrimary, marginBottom: '4px', fontWeight: '800' },
  subtitle: { fontSize: FONTS.sizes.bodySmall, color: COLORS.textSecondary, marginBottom: '3vh' }, 

  // NOUVEAUX BOUTONS "CARTES CARRÉES" CÔTE À CÔTE
  buttonContainer: { 
    display: 'flex', 
    flexDirection: 'row', // Les place côte à côte
    justifyContent: 'center',
    gap: '15px', 
    width: '100%', 
    maxWidth: '400px' 
  }, 
  btnWrapper: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '8px', 
    flex: 1, // Chaque bouton prend exactement 50% de l'espace
    position: 'relative' 
  },
  downloadBtn: {
    ...GLASS.card, 
    position: 'relative', 
    height: '110px', // Hauteur fixe pour faire un effet "carte"
    width: '100%',
    display: 'flex', 
    flexDirection: 'column', // Empile l'icône et le texte verticalement
    alignItems: 'center', 
    justifyContent: 'center',
    padding: '10px', 
    cursor: 'pointer', 
    background: COLORS.glassSurface,
    borderRadius: '16px' // Un bon arrondi pour l'effet carte
  },
  btnContent: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    width: '100%', 
    zIndex: 2, 
    position: 'relative',
    gap: '8px'
  },
  btnIconWrapper: { 
    display: 'flex', 
    justifyContent: 'center', 
    color: COLORS.primary 
  },
  btnTextWrapper: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', // Centre le texte
    textAlign: 'center'
  },
  btnTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.body, fontWeight: 'bold' }, // Un peu plus petit pour rentrer dans la carte
  btnSub: { color: COLORS.primary, fontSize: '11px', marginTop: '2px' },
  counter: { fontSize: '10px', color: COLORS.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  
  // MODALE (inchangée, juste le visuel)
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