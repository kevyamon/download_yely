// src/pages/admin/AdminRegister.jsx
import axios from 'axios';
import { motion } from 'framer-motion';
import { Key, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import { useToast } from '../../context/ToastContext';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../../theme/theme';

const AdminRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [setupKey, setSetupKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !setupKey) return;

    setIsLoading(true);
    
    try {
      // Appel de ta route One-Shot sécurisée
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/setup`, 
        { email, password },
        { headers: { 'x-setup-key': setupKey } } // Le fameux cadenas !
      );
      
      showToast("Compte Administrateur créé. Le système est désormais scellé.", "success");
      navigate('/admin/login'); // On t'envoie direct vers la page de connexion
      
    } catch (error) {
      console.error("Erreur d'initialisation:", error);
      // On affiche l'erreur exacte du backend (ex: "Installation déjà terminée")
      showToast(error.response?.data?.message || "Erreur de création. Vérifiez la clé d'amorçage.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <motion.div 
        style={styles.loginCard}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div style={styles.logoWrapper}>
          <img src={logoImg} alt="Yely Admin" style={styles.logoImage} />
        </div>

        <h1 style={styles.title}>Initialisation Système</h1>
        <p style={styles.subtitle}>Création du compte Maître. Cette action est unique.</p>

        <form onSubmit={handleRegister} style={styles.form}>
          
          {/* CHAMP CLÉ D'AMORÇAGE */}
          <div style={styles.inputGroup}>
            <div style={styles.iconWrapper}><Key size={20} color={COLORS.primary} /></div>
            <input 
              type="password" 
              placeholder="Clé d'amorçage système" 
              style={{...styles.input, borderColor: COLORS.primary}}
              value={setupKey}
              onChange={(e) => setSetupKey(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.iconWrapper}><Mail size={20} color={COLORS.textSecondary} /></div>
            <input 
              type="email" 
              placeholder="Adresse email administrateur" 
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.iconWrapper}><Lock size={20} color={COLORS.textSecondary} /></div>
            <input 
              type="password" 
              placeholder="Mot de passe sécurisé" 
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button 
            type="submit" 
            style={styles.submitBtn}
            disabled={isLoading}
            whileHover={!isLoading ? { scale: 1.02, backgroundColor: COLORS.primaryLight } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? "Forgeage de la clé..." : "Sceller et Créer le compte"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh', backgroundColor: COLORS.richBlack, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: SPACING.lg,
    backgroundImage: `radial-gradient(circle at center, ${COLORS.primary}11 0%, ${COLORS.richBlack} 70%)`,
  },
  loginCard: {
    ...GLASS.modal, ...SHADOWS.strong, width: '100%', maxWidth: '420px', padding: SPACING.xxxl, borderRadius: BORDERS.radius.xl,
    border: `1px solid ${COLORS.primary}66`, display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  logoWrapper: {
    width: '80px', height: '80px', borderRadius: '50%', backgroundColor: COLORS.pureBlack, display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.xl, boxShadow: `0 0 20px ${COLORS.primary}88`, overflow: 'hidden',
  },
  logoImage: { width: '100%', height: '100%', objectFit: 'cover' },
  title: { color: COLORS.textPrimary, fontSize: FONTS.sizes.h2, fontWeight: 'bold', marginBottom: SPACING.xs, textAlign: 'center' },
  subtitle: { color: COLORS.danger, fontSize: FONTS.sizes.bodySmall, marginBottom: SPACING.xxl, textAlign: 'center', fontWeight: 'bold' },
  form: { width: '100%', display: 'flex', flexDirection: 'column', gap: SPACING.lg },
  inputGroup: { position: 'relative', display: 'flex', alignItems: 'center', width: '100%' },
  iconWrapper: { position: 'absolute', left: SPACING.md, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  input: {
    width: '100%', height: '52px', backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${COLORS.border}`,
    borderRadius: BORDERS.radius.lg, paddingLeft: '45px', paddingRight: SPACING.md, color: COLORS.textPrimary,
    fontSize: FONTS.sizes.body, outline: 'none', transition: 'border-color 0.3s ease',
  },
  submitBtn: {
    height: '52px', width: '100%', backgroundColor: COLORS.primary, color: COLORS.pureBlack, border: 'none',
    borderRadius: BORDERS.radius.lg, fontSize: FONTS.sizes.body, fontWeight: 'bold', cursor: 'pointer', marginTop: SPACING.md,
    boxShadow: `0 4px 15px ${COLORS.primary}44`,
  }
};

export default AdminRegister;