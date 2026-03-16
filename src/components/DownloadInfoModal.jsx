// src/components/DownloadInfoModal.jsx
import { AnimatePresence, motion } from 'framer-motion';
import { Download, X } from 'lucide-react';
import React from 'react';
import { BORDERS, COLORS, FONTS, GLASS, SPACING } from '../theme/theme';

const DownloadInfoModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          style={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div 
            style={styles.modalContent}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <button style={styles.modalCloseBtn} onClick={onClose}>
              <X size={24} color={COLORS.textPrimary} />
            </button>
            
            <div style={styles.modalIconBox}>
              <Download size={32} color={COLORS.primary} />
            </div>
            
            <h2 style={styles.modalTitle}>Telechargement Android</h2>
            
            <div style={styles.modalTextContainer}>
              <p style={styles.modalText}>
                Le fichier d'installation (APK) va etre telecharge sur votre telephone.
              </p>
              <div style={styles.modalDivider} />
              <p style={styles.modalText}>
                <strong style={{ color: COLORS.textPrimary }}>Comment installer :</strong> Une fois termine, cliquez sur <strong>Ouvrir</strong> puis autorisez l'installation si votre navigateur vous le demande.
              </p>
            </div>

            <motion.button 
              style={styles.modalConfirmBtn} 
              onClick={onConfirm}
              whileHover={{ scale: 1.02, backgroundColor: COLORS.primaryLight }}
              whileTap={{ scale: 0.98 }}
            >
              Lancer le telechargement
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const styles = {
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: COLORS.overlayDark, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: SPACING.md, backdropFilter: 'blur(4px)' },
  modalContent: { ...GLASS.modal, width: '100%', maxWidth: '380px', maxHeight: '90vh', overflowY: 'auto', borderRadius: BORDERS.radius.xl, padding: SPACING.lg, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: `0 10px 30px rgba(0,0,0,0.2)` },
  modalCloseBtn: { position: 'absolute', top: SPACING.md, right: SPACING.md, background: 'none', border: 'none', cursor: 'pointer', padding: '8px' },
  modalIconBox: { width: '56px', height: '56px', borderRadius: '28px', backgroundColor: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  modalTitle: { fontSize: FONTS.sizes.h3, color: COLORS.textPrimary, fontWeight: 'bold', marginBottom: SPACING.md, textAlign: 'center' },
  modalTextContainer: { backgroundColor: COLORS.overlay, padding: SPACING.md, borderRadius: BORDERS.radius.lg, marginBottom: SPACING.lg, width: '100%' },
  modalText: { fontSize: FONTS.sizes.bodySmall, color: COLORS.textSecondary, lineHeight: 1.5, textAlign: 'left' },
  modalDivider: { height: '1px', backgroundColor: COLORS.border, margin: `${SPACING.sm}px 0` },
  modalConfirmBtn: { backgroundColor: COLORS.primary, color: COLORS.textInverse, border: 'none', borderRadius: BORDERS.radius.pill, height: '45px', width: '100%', fontSize: FONTS.sizes.body, fontWeight: 'bold', cursor: 'pointer' }
};

export default DownloadInfoModal;