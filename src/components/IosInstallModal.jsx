// src/components/IosInstallModal.jsx
import { motion } from 'framer-motion';
import { PlusSquare, Share, X } from 'lucide-react';
import React from 'react';
import { BORDERS, COLORS, FONTS, GLASS, SPACING } from '../theme/theme';

const IosInstallModal = ({ onClose }) => {
  return (
    <motion.div 
      style={styles.overlay}
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
    >
      <motion.div 
        style={styles.modal}
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
      >
        <button style={styles.closeBtn} onClick={onClose}>
          <X size={24} color={COLORS.textPrimary} />
        </button>
        
        <h2 style={styles.title}>Installer sur iPhone</h2>
        
        <p style={styles.subtitle}>
          L'application Yely est ultra-rapide. Ajoutez-la directement a votre ecran d'accueil pour une experience optimale.
        </p>

        <div style={styles.stepsContainer}>
          <div style={styles.step}>
            <div style={styles.stepIcon}>
              <Share size={24} color={COLORS.primary} />
            </div>
            <div style={styles.stepText}>
              <strong style={{ color: COLORS.textPrimary }}>1. Appuyez sur le bouton Partager</strong>
              <span>Situe dans la barre de navigation de Safari (en bas ou en haut de l'ecran).</span>
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.step}>
            <div style={styles.stepIcon}>
              <PlusSquare size={24} color={COLORS.textPrimary} />
            </div>
            <div style={styles.stepText}>
              <strong style={{ color: COLORS.textPrimary }}>2. Choisissez "Sur l'ecran d'accueil"</strong>
              <span>Faites defiler le menu vers le bas pour trouver cette option.</span>
            </div>
          </div>
        </div>

        <motion.button 
          style={styles.confirmBtn} 
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          J'ai compris
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: SPACING.md },
  modal: { ...GLASS.modal, width: '100%', maxWidth: '400px', borderRadius: BORDERS.radius.xl, padding: SPACING.lg, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', border: `1px solid ${COLORS.border}`, boxShadow: `0 20px 40px rgba(0,0,0,0.5)` },
  closeBtn: { position: 'absolute', top: SPACING.md, right: SPACING.md, background: 'none', border: 'none', cursor: 'pointer', padding: '8px' },
  title: { fontSize: FONTS.sizes.h3, color: COLORS.textPrimary, fontWeight: 'bold', marginBottom: SPACING.sm, textAlign: 'center', marginTop: SPACING.sm },
  subtitle: { fontSize: FONTS.sizes.bodySmall, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.lg, lineHeight: 1.5 },
  stepsContainer: { backgroundColor: 'rgba(0,0,0,0.3)', padding: SPACING.md, borderRadius: BORDERS.radius.lg, width: '100%', marginBottom: SPACING.lg },
  step: { display: 'flex', alignItems: 'center', gap: SPACING.md },
  stepIcon: { width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepText: { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: COLORS.textSecondary, textAlign: 'left' },
  divider: { height: '1px', backgroundColor: COLORS.border, margin: `${SPACING.md}px 0` },
  confirmBtn: { backgroundColor: COLORS.primary, color: '#000', border: 'none', borderRadius: BORDERS.radius.pill, height: '45px', width: '100%', fontSize: FONTS.sizes.body, fontWeight: 'bold', cursor: 'pointer' }
};

export default IosInstallModal;