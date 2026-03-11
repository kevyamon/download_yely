// src/components/Hero.jsx
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { BORDERS, COLORS, FONTS, GLASS, SPACING } from '../theme/theme';
import DownloadCard from './DownloadCard';

import logoImg from '../assets/logo.png';

const Hero = ({ onAndroidClick, onIosClick }) => {
  const socket = useSocket();
  const { showToast } = useToast();
  
  const [stats, setStats] = useState(() => {
    const cachedStats = localStorage.getItem('yely_stats');
    return cachedStats ? JSON.parse(cachedStats) : { androidClicks: 0, iosClicks: 0 };
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPlatform, setPendingPlatform] = useState(null);
  
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const fullTitle = "L'ELITE DU TRANSPORT.";

  // Animation Typewriter avec gestion du curseur
  useEffect(() => {
    let timeoutId;
    let currentIndex = 0;

    const typeCharacter = () => {
      setIsTyping(true);
      if (currentIndex < fullTitle.length) {
        setDisplayedTitle(fullTitle.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeCharacter, 100); // 100ms par lettre
      } else {
        setIsTyping(false); // Masque le curseur à la fin de la phrase
        timeoutId = setTimeout(() => {
          currentIndex = 0;
          setDisplayedTitle("");
          typeCharacter();
        }, 30000); // Pause de 30 secondes
      }
    };

    typeCharacter();

    return () => clearTimeout(timeoutId); // Nettoyage
  }, []);

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
          {displayedTitle}
          <AnimatePresence>
            {isTyping && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ color: COLORS.primary, marginLeft: '4px' }}
              >
                |
              </motion.span>
            )}
          </AnimatePresence>
        </motion.h1>
        
        <motion.p variants={itemVariants} style={styles.subtitle}>
          Téléchargez l'application officielle Yely.
        </motion.p>

        <motion.div variants={itemVariants} style={styles.buttonContainer}>
          <DownloadCard 
            platform="android"
            clicks={stats.androidClicks}
            onClick={() => handleInterceptClick('android')}
            pulseVariants={pulseAndroidVariants}
          />
          <DownloadCard 
            platform="ios"
            clicks={stats.iosClicks}
            onClick={() => handleInterceptClick('ios')}
            pulseVariants={pulseIosVariants}
          />
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
  container: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1, 
    padding: '2vh 20px', 
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box'
  },
  logoWrapper: { 
    marginBottom: '2vh', 
    borderRadius: '50%', 
    overflow: 'hidden', 
    width: '80px', 
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
  
  title: { 
    fontSize: FONTS.sizes.h2, 
    color: COLORS.textPrimary, 
    marginBottom: '4px', 
    fontWeight: '800',
    minHeight: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: { fontSize: FONTS.sizes.bodySmall, color: COLORS.textSecondary, marginBottom: '3vh' }, 

  buttonContainer: { 
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'center',
    gap: '15px', 
    width: '100%', 
    maxWidth: '400px' 
  }, 
  
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