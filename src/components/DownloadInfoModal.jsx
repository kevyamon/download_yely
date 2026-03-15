// src/components/DownloadInfoModal.jsx
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import React from 'react';
import { BORDERS, COLORS, FONTS, GLASS, SPACING } from '../theme/theme';

const DownloadInfoModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
            <button style={styles.modalCloseBtn} onClick={onClose}>
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
              onClick={onConfirm}
              whileHover={{ scale: 1.02, backgroundColor: COLORS.primaryLight }}
              whileTap={{ scale: 0.98 }}
            >
              J'ai compris, continuer
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const styles = {
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

export default DownloadInfoModal;