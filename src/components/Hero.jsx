// src/components/Hero.jsx
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Apple, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../theme/theme';

// Import de ton vrai logo
import logoImg from '../assets/logo.png';

// Le vrai logo Android en SVG pur
const AndroidIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.244 13.8533 7.85 12 7.85c-1.8533 0-3.5902.394-5.1367 1.1005L4.841 5.4475a.416.416 0 00-.5676-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
  </svg>
);

const Hero = ({ onAndroidClick, onIosClick }) => {
  const socket = useSocket();
  const [stats, setStats] = useState({ androidClicks: 0, iosClicks: 0 });
  
  // Gestion de la Modale d'avertissement
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPlatform, setPendingPlatform] = useState(null);

  // RECUPERATION INITIALE DES COMPTEURS
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/stats`);
        setStats({
          androidClicks: res.data?.androidClicks || 0,
          iosClicks: res.data?.iosClicks || 0
        });
      } catch (err) {
        console.error("Erreur stats:", err);
      }
    };
    fetchStats();
  }, []);

  // ECOUTE DU TEMPS REEL (SOCKET)
  useEffect(() => {
    if (!socket) return;
    socket.on('stats_updated', setStats);
    return () => socket.off('stats_updated');
  }, [socket]);

  // INTERCEPTION DU CLIC POUR AFFICHER LA MODALE
  const handleInterceptClick = (platform) => {
    setPendingPlatform(platform);
    setIsModalOpen(true);
  };

  // CONFIRMATION DEPUIS LA MODALE
  const confirmDownload = () => {
    setIsModalOpen(false);
    if (pendingPlatform === 'android') {
      onAndroidClick();
    } else if (pendingPlatform === 'ios') {
      onIosClick();
    }
  };

  return (
    <>
      <div style={styles.container}>
        {/* LOGO CENTRAL (VRAI LOGO) */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={styles.logoWrapper}
        >
          <img 
            src={logoImg} 
            alt="Yely Logo" 
            style={styles.logoImage} 
            onError={(e) => {
              // Fallback au cas où l'image n'est pas trouvée
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback de secours si pas de logo */}
          <div style={{...styles.logoCircle, display: 'none'}}>
            <span style={styles.logoY}>Y</span>
          </div>
        </motion.div>

        <h1 style={styles.title}>Déplacez-vous avec élégance.</h1>
        <p style={styles.subtitle}>Téléchargez l'application officielle Yely.</p>

        {/* BOUTONS DE TELECHARGEMENT (MÊME IMPACT VISUEL) */}
        <div style={styles.buttonContainer}>
          
          <div style={styles.btnWrapper}>
            <button onClick={() => handleInterceptClick('android')} style={styles.downloadBtn}>
              <div style={styles.btnIconWrapper}><AndroidIcon size={28} /></div>
              <div style={styles.btnTextWrapper}>
                <span style={styles.btnTitle}>Télécharger</span>
                <span style={styles.btnSub}>pour Android</span>
              </div>
            </button>
            <span style={styles.counter}>{stats.androidClicks} téléchargements</span>
          </div>

          <div style={styles.btnWrapper}>
            <button onClick={() => handleInterceptClick('ios')} style={styles.downloadBtn}>
              <div style={styles.btnIconWrapper}><Apple size={28} /></div>
              <div style={styles.btnTextWrapper}>
                <span style={styles.btnTitle}>Installer la PWA</span>
                <span style={styles.btnSub}>pour iPhone</span>
              </div>
            </button>
            <span style={styles.counter}>{stats.iosClicks} installations</span>
          </div>

        </div>
      </div>

      {/* MODALE D'AVERTISSEMENT CHAUFFEUR / CLIENT */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              style={styles.modalContent}
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <button style={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} color={COLORS.textPrimary} />
              </button>
              
              <div style={styles.modalIconBox}>
                <AlertCircle size={40} color={COLORS.primary} />
              </div>
              
              <h2 style={styles.modalTitle}>Information Importante</h2>
              
              <div style={styles.modalTextContainer}>
                <p style={styles.modalText}>
                  <strong style={{ color: COLORS.primary }}>Pour les Clients :</strong> L'application fonctionne parfaitement sur Android et iPhone (iOS).
                </p>
                <div style={styles.modalDivider} />
                <p style={styles.modalText}>
                  <strong style={{ color: COLORS.textPrimary }}>Pour les Chauffeurs :</strong> Pour des raisons techniques de tracking GPS premium, l'application Chauffeur est <strong style={{color: COLORS.danger}}>temporairement disponible uniquement sur Android</strong>. La version App Store iOS arrivera très prochainement.
                </p>
              </div>

              <button style={styles.modalConfirmBtn} onClick={confirmDownload}>
                J'ai compris, continuer
              </button>
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
    padding: '40px 20px',
    textAlign: 'center',
  },
  logoWrapper: {
    marginBottom: '30px',
  },
  logoImage: {
    width: '140px',
    height: 'auto',
    objectFit: 'contain',
    filter: `drop-shadow(0 0 20px ${COLORS.primary}66)`,
  },
  logoCircle: {
    width: '120px', height: '120px', borderRadius: '50%',
    backgroundColor: COLORS.background, border: `4px solid ${COLORS.primary}`,
    alignItems: 'center', justifyContent: 'center',
  },
  logoY: { fontSize: '60px', fontWeight: '900', color: COLORS.primary },
  title: {
    fontSize: FONTS.sizes.h1, color: COLORS.textPrimary, marginBottom: '10px', fontWeight: '800'
  },
  subtitle: {
    fontSize: FONTS.sizes.body, color: COLORS.textSecondary, marginBottom: '40px',
  },
  buttonContainer: {
    display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', maxWidth: '340px',
  },
  btnWrapper: {
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  // Boutons équilibrés et Premium
  downloadBtn: {
    ...GLASS.card,
    height: '75px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    cursor: 'pointer',
    border: `1.5px solid ${COLORS.borderActive}`,
    transition: 'all 0.3s ease',
  },
  btnIconWrapper: {
    width: '45px', display: 'flex', justifyContent: 'center', color: COLORS.primary,
  },
  btnTextWrapper: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderLeft: `1px solid ${COLORS.border}`, paddingLeft: '15px', marginLeft: '5px'
  },
  btnTitle: {
    color: COLORS.textPrimary, fontSize: FONTS.sizes.h4, fontWeight: 'bold',
  },
  btnSub: {
    color: COLORS.textSecondary, fontSize: FONTS.sizes.caption,
  },
  counter: {
    fontSize: '12px', color: COLORS.primary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px',
  },
  
  // Styles de la Modale Bank Grade
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, padding: SPACING.lg,
  },
  modalContent: {
    ...GLASS.modal,
    width: '100%', maxWidth: '400px',
    borderRadius: BORDERS.radius.xl,
    padding: SPACING.xxl, position: 'relative',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    border: `1px solid ${COLORS.border}`,
  },
  modalCloseBtn: {
    position: 'absolute', top: SPACING.lg, right: SPACING.lg,
    background: 'none', border: 'none', cursor: 'pointer',
  },
  modalIconBox: {
    width: '70px', height: '70px', borderRadius: '35px',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: FONTS.sizes.h3, color: COLORS.textPrimary, fontWeight: 'bold', marginBottom: SPACING.lg, textAlign: 'center',
  },
  modalTextContainer: {
    backgroundColor: isDarkTheme() ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
    padding: SPACING.lg, borderRadius: BORDERS.radius.lg, marginBottom: SPACING.xxl, width: '100%',
  },
  modalText: {
    fontSize: FONTS.sizes.bodySmall, color: COLORS.textSecondary, lineHeight: 1.6, textAlign: 'left',
  },
  modalDivider: {
    height: '1px', backgroundColor: COLORS.border, margin: `${SPACING.md}px 0`,
  },
  modalConfirmBtn: {
    backgroundColor: COLORS.primary, color: '#000',
    border: 'none', borderRadius: BORDERS.radius.pill,
    height: '50px', width: '100%',
    fontSize: FONTS.sizes.body, fontWeight: 'bold', cursor: 'pointer',
  }
};

// Helper pour le style de la modale
function isDarkTheme() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default Hero;