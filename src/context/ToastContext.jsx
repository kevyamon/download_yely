// src/context/ToastContext.jsx
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import React, { createContext, useContext, useState } from 'react';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../theme/theme';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Fonction pour déclencher un toast depuis n'importe où
  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-suppression après X secondes
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Conteneur des Toasts (Fixé en haut, centré) */}
      <div style={styles.toastContainer}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              layout
              style={{
                ...styles.toast,
                borderLeft: `4px solid ${getToastColor(toast.type)}`
              }}
            >
              <div style={styles.iconBox}>
                {getToastIcon(toast.type)}
              </div>
              <span style={styles.message}>{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} style={styles.closeBtn}>
                <X size={16} color={COLORS.textSecondary} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Helpers pour les couleurs et icônes
const getToastColor = (type) => {
  if (type === 'success') return COLORS.success;
  if (type === 'error') return COLORS.danger;
  return COLORS.primary; // Info par défaut
};

const getToastIcon = (type) => {
  if (type === 'success') return <CheckCircle size={20} color={COLORS.success} />;
  if (type === 'error') return <AlertCircle size={20} color={COLORS.danger} />;
  return <Info size={20} color={COLORS.primary} />;
};

const styles = {
  toastContainer: {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'none', // Laisse passer les clics au travers du conteneur
  },
  toast: {
    ...GLASS.modal,
    ...SHADOWS.strong,
    pointerEvents: 'auto',
    display: 'flex',
    alignItems: 'center',
    padding: `${SPACING.md}px ${SPACING.lg}px`,
    borderRadius: BORDERS.radius.lg,
    minWidth: '300px',
    maxWidth: '90vw',
  },
  iconBox: {
    marginRight: SPACING.md,
    display: 'flex',
  },
  message: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.bodySmall,
    fontWeight: FONTS.weights.medium,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    marginLeft: SPACING.md,
    display: 'flex',
  }
};