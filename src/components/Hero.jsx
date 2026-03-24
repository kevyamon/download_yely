// src/components/Hero.jsx
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, ChevronDown, ShieldCheck } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { COLORS, FONTS } from '../theme/theme';
import AppScreenshots from './AppScreenshots';
import DownloadCard from './DownloadCard';
import DownloadInfoModal from './DownloadInfoModal';
import TypingTitle from './TypingTitle';

import logoImg from '../assets/logo.png';

// Composant SVG pour l'icône Apple
const AppleIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 384 512" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
);

const Hero = ({ onAndroidClick, onIosClick }) => {
  const socket = useSocket();
  const { showToast } = useToast();
  
  const [stats, setStats] = useState({ androidClicks: null, iosClicks: null });
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPlatform, setPendingPlatform] = useState(null);

  const screenshotsRef = useRef(null);

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
    if (platform === 'ios') {
      setStats(prev => ({ ...prev, iosClicks: (prev.iosClicks || 0) + 1 }));
      showToast("Ouverture de l'application...", "info");
      onIosClick();
    } else {
      setPendingPlatform(platform);
      setIsModalOpen(true);
    }
  };

  const confirmDownload = () => {
    setIsModalOpen(false);
    
    setStats(prev => ({
      ...prev,
      androidClicks: (prev.androidClicks || 0) + 1
    }));

    showToast("Le telechargement a demarre", "success");
    setTimeout(() => onAndroidClick(), 300);
  };

  const scrollToScreenshots = () => {
    if (screenshotsRef.current) {
      screenshotsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

        <TypingTitle fullTitle="L'ELITE DU TRANSPORT." variants={itemVariants} />
        
        <motion.p variants={itemVariants} style={styles.subtitle}>
          Telechargez l'application officielle Yely.
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

        {/* BADGE DE CONFIANCE AVEC ICÔNE REACT */}
        <motion.div variants={itemVariants} style={styles.trustBadge}>
          <CheckCircle size={16} color="#2ecc71" />
          <span style={styles.trustText}>Vérifié par l'équipe Yély : Garanti sans virus et sécurisé.</span>
        </motion.div>

        {/* GUIDE DE SÉCURITÉ AVEC ICÔNES REACT */}
        <motion.div variants={itemVariants} style={styles.securityBox}>
          <div style={styles.securityHeader}>
            <ShieldCheck size={22} color={COLORS.primary} style={{ marginRight: '8px' }} />
            <h3 style={styles.securityTitle}>Installation 100% Sécurisée</h3>
          </div>
          
          <div style={styles.securityContent}>
            <p style={styles.securityText}>
              <strong>Pourquoi un message d'alerte ?</strong><br/>
              Yély est une application locale de Maféré. N'étant pas encore sur le "Play Store" (pour éviter les taxes et rester gratuit pour vous), Google peut afficher un avertissement. <span style={{color: COLORS.primary, fontWeight: 'bold'}}>C'est normal et sans danger.</span>
            </p>
            <p style={styles.securityText}>
              <strong>Comment faire sur Android ?</strong><br/>
              1. Cliquez sur <b>Télécharger pour Android</b>.<br/>
              2. Ouvrez le fichier. Si Google bloque : cliquez sur <b>"Plus de détails"</b>.<br/>
              3. Cliquez ensuite sur <b>"Installer quand même"</b>.
            </p>
            
            <div style={styles.iosGuideWrapper}>
              <div style={styles.iosHeader}>
                <AppleIcon size={16} color={COLORS.textPrimary} />
                <strong style={{ marginLeft: '6px' }}>Utilisateur iPhone ?</strong>
              </div>
              <p style={styles.securityTextiOS}>
                Cliquez sur l'icône <b>Partager</b> (le carré avec la flèche en bas) puis sur <b>"Sur l'écran d'accueil"</b> pour installer Yély.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          style={styles.scrollIndicator}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          onClick={scrollToScreenshots}
        >
          <span style={styles.scrollText}>Decouvrir l'application</span>
          <ChevronDown color={COLORS.primary} size={24} />
        </motion.div>

        <motion.div variants={itemVariants} style={{ width: '100%' }} ref={screenshotsRef}>
          <AppScreenshots />
        </motion.div>

      </motion.div>

      <DownloadInfoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDownload}
      />
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
  
  subtitle: { fontSize: FONTS.sizes.bodySmall, color: COLORS.textSecondary, marginBottom: '10px' }, 

  buttonContainer: { 
    display: 'flex', 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '15px', 
    width: '100%', 
    maxWidth: '450px',
    marginTop: '20px',
    marginBottom: '15px'
  },

  trustBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'rgba(46, 204, 113, 0.08)',
    border: '1px solid rgba(46, 204, 113, 0.3)',
    borderRadius: '20px',
    marginBottom: '25px',
    width: '100%',
    maxWidth: '450px',
  },
  trustText: {
    color: '#2ecc71',
    fontSize: '11px',
    fontWeight: 'bold',
  },

  securityBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '16px',
    padding: '20px',
    maxWidth: '450px',
    width: '100%',
    marginBottom: '30px',
    textAlign: 'left',
  },
  securityHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  securityTitle: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
    margin: 0,
  },
  securityContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  securityText: {
    color: COLORS.textSecondary,
    fontSize: '13px',
    lineHeight: '1.5',
    margin: 0,
  },
  iosGuideWrapper: {
    paddingTop: '12px',
    borderTop: `1px solid ${COLORS.border}`,
    marginTop: '4px',
  },
  iosHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '4px',
    color: COLORS.textPrimary,
  },
  securityTextiOS: {
    color: COLORS.textSecondary,
    fontSize: '13px',
    lineHeight: '1.5',
    margin: 0,
  },

  scrollIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    margin: '10px 0 30px 0', 
    opacity: 0.85
  },
  scrollText: {
    fontSize: '12px',
    color: COLORS.primary, 
    fontWeight: 'bold',
    marginBottom: '5px'
  }
};

export default Hero;