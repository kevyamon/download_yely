// src/components/Hero.jsx
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ChevronDown, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { BORDERS, COLORS, FONTS, GLASS, SPACING } from '../theme/theme';
import AppScreenshots from './AppScreenshots';
import DownloadCard from './DownloadCard';

import logoImg from '../assets/logo.png';

const Hero = ({ onAndroidClick, onIosClick }) => {
  const socket = useSocket();
  const { showToast } = useToast();
  
  // On initialise à null pour que le composant enfant sache qu'on charge
  const [stats, setStats] = useState({ androidClicks: null, iosClicks: null });
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPlatform, setPendingPlatform] = useState(null);
  
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const fullTitle = "L'ELITE DU TRANSPORT.";

  useEffect(() => {
    let timeoutId;
    let currentIndex = 0;

    const typeCharacter = () => {
      setIsTyping(true);
      if (currentIndex < fullTitle.length) {
        setDisplayedTitle(fullTitle.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeCharacter, 100);
      } else {
        setIsTyping(false);
        timeoutId = setTimeout(() => {
          currentIndex = 0;
          setDisplayedTitle("");
          typeCharacter();
        }, 30000);
      }
    };

    typeCharacter();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/stats`);
        if (res.data) {
          setStats({
            androidClicks: res.data.androidClicks || 0,
            iosClicks: res.data.iosClicks || 0
          });
        }
      } catch (err) {
        console.error("Erreur de recuperation des statistiques", err);
        // Si erreur, on met 0 pour arreter le chargement infini
        setStats({ androidClicks: 0, iosClicks: 0 });
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('stats_updated', (newStats) => {
      setStats({
        androidClicks: newStats.androidClicks || 0,
        iosClicks: newStats.iosClicks || 0
      });
    });
    return () => socket.off('stats_updated');
  }, [socket]);

  const handleInterceptClick = (platform) => {
    setPendingPlatform(platform);
    setIsModalOpen(true);
  };

  const confirmDownload = () => {
    setIsModalOpen(false);
    
    setStats(prev => ({
      ...prev,
      androidClicks: pendingPlatform === 'android' ? (prev.androidClicks || 0) + 1 : prev.androidClicks,
      iosClicks: pendingPlatform === 'ios' ? (prev.iosClicks || 0) + 1 : prev.iosClicks
    }));

    if (pendingPlatform === 'android') {
      showToast("Preparation du telechargement Android...", "info");
      setTimeout(() => onAndroidClick(), 300);
    } else if (pendingPlatform === 'ios') {
      setTimeout(() => onIosClick(), 300);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } }
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
          {!isLogoLoaded && (
            <motion.div 
              style={styles.logoSkeleton}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          )}
          <motion.img 
            src={logoImg} 
            alt="Yely Logo" 
            style={{ ...styles.logoImage, opacity: isLogoLoaded ? 1 : 0 }} 
            onLoad={() => setIsLogoLoaded(true)}
            onError={(e) => { e.target.style.display = 'none'; setIsLogoLoaded(true); }}
            animate={{ opacity: isLogoLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        <motion.h1 variants={itemVariants} style={styles.title}>
          {displayedTitle}
          {isTyping && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", repeatType: "reverse" }}
              style={{ color: COLORS.primary, marginLeft: '4px' }}
            >
              |
            </motion.span>
          )}
        </motion.h1>
        
        <motion.p variants={itemVariants} style={styles.subtitle}>
          Telechargez l'application officielle Yely.
        </motion.p>

        {/* Integration du Carousel ici */}
        <motion.div variants={itemVariants} style={{ width: '100%' }}>
          <AppScreenshots />
        </motion.div>

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

        {/* Indicateur pour scroller vers le bas */}
        <motion.div 
          style={styles.scrollIndicator}
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <span style={styles.scrollText}>Decouvrir plus</span>
          <ChevronDown color={COLORS.primary} size={24} />
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
                  <strong style={{ color: COLORS.textPrimary }}>Pour les Chauffeurs :</strong> Afin de garantir une precision GPS absolue en arriere-plan, l'application Chauffeur est <strong style={{color: COLORS.danger}}>temporairement reservee aux telephones Android</strong>.
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
    minHeight: '100%',
    padding: '40px 20px',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative' // Ajoute pour l'indicateur de scroll
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
    boxShadow: `0 0 30px ${COLORS.primary}66`,
    flexShrink: 0,
    position: 'relative'
  },
  logoSkeleton: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: COLORS.border,
    borderRadius: '50%'
  },
  logoImage: { width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 2 },
  
  title: { 
    fontSize: FONTS.sizes.h2, 
    color: COLORS.textPrimary, 
    marginBottom: '10px', 
    fontWeight: '800',
    minHeight: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subtitle: { fontSize: FONTS.sizes.bodySmall, color: COLORS.textSecondary, marginBottom: '20px' }, 

  buttonContainer: { 
    display: 'flex', 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '15px', 
    width: '100%', 
    maxWidth: '450px',
    marginTop: '20px',
    marginBottom: '80px' // Laisse de l'espace pour l'indicateur
  }, 

  scrollIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    bottom: '20px',
    opacity: 0.7
  },
  scrollText: {
    fontSize: '12px',
    color: COLORS.textSecondary,
    marginBottom: '5px'
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