// src/components/DownloadCard.jsx
import { motion } from 'framer-motion';
import React from 'react';
import { COLORS, FONTS, GLASS } from '../theme/theme';

const AndroidIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.6 9.48l1.84-3.18c.16-.29.06-.66-.23-.82-.29-.16-.65-.06-.81.23l-1.9 3.28C14.96 8.32 13.52 8 12 8s-2.96.32-4.5.99L5.6 5.71c-.16-.29-.52-.39-.81-.23-.29.16-.39.53-.23.82l1.84 3.18C3.82 11.23 2 14.4 2 18h20c0-3.6-1.82-6.77-4.4-8.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
  </svg>
);

const AppleIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 384 512" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
);

const DownloadCard = ({ platform, clicks, onClick, pulseVariants }) => {
  const isAndroid = platform === 'android';
  
  const borderColor = isAndroid ? COLORS.borderActive : COLORS.border;
  const iconColor = isAndroid ? COLORS.primary : COLORS.textPrimary;
  const subtitleColor = isAndroid ? COLORS.primary : COLORS.textSecondary;
  const title = isAndroid ? "Télécharger" : "Installer";
  const subtitle = isAndroid ? "pour Android" : "pour iPhone";
  const statLabel = isAndroid ? "téléchargements" : "installations";

  return (
    <div style={styles.btnWrapper}>
      <motion.button 
        onClick={onClick} 
        style={{ ...styles.downloadBtn, borderColor: borderColor }}
        animate="pulse"
        variants={pulseVariants}
        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.95 }}
      >
        <div style={styles.btnContent}>
          <div style={{ ...styles.btnIconWrapper, color: iconColor }}>
            {isAndroid ? <AndroidIcon size={32} /> : <AppleIcon size={32} />}
          </div>
          <div style={styles.btnTextWrapper}>
            <span style={styles.btnTitle}>{title}</span>
            <span style={{ ...styles.btnSub, color: subtitleColor }}>{subtitle}</span>
          </div>
        </div>
      </motion.button>
      
      {/* Nouveau design des statistiques Glassmorphism */}
      <div style={styles.statsBadge}>
        <span style={styles.statsNumber}>{clicks}</span>
        <span style={styles.statsLabel}>{statLabel}</span>
      </div>
    </div>
  );
};

const styles = {
  btnWrapper: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    gap: '12px', 
    flex: 1, 
    position: 'relative' 
  },
  downloadBtn: {
    ...GLASS.card, 
    position: 'relative', 
    height: '110px', 
    width: '100%',
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: '10px', 
    cursor: 'pointer', 
    borderRadius: '16px' 
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
    justifyContent: 'center'
  },
  btnTextWrapper: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    textAlign: 'center'
  },
  btnTitle: { 
    color: COLORS.textPrimary, 
    fontSize: FONTS.sizes.body, 
    fontWeight: 'bold' 
  },
  btnSub: { 
    fontSize: '11px', 
    marginTop: '2px' 
  },
  statsBadge: {
    ...GLASS.subtle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '20px',
    border: `1px solid rgba(212, 175, 55, 0.3)`
  },
  statsNumber: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.bodySmall,
  },
  statsLabel: {
    color: COLORS.textSecondary,
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: FONTS.weights.semiBold
  }
};

export default DownloadCard;