// src/components/Hero.jsx
import axios from 'axios';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { COLORS, FONTS } from '../theme/theme';
import AppScreenshots from './AppScreenshots';
import DownloadCard from './DownloadCard';
import DownloadInfoModal from './DownloadInfoModal';
import TypingTitle from './TypingTitle';

import logoImg from '../assets/logo.png';

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
    marginBottom: '20px'
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