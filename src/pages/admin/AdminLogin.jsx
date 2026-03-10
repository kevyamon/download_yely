// src/pages/admin/AdminLogin.jsx
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../../theme/theme';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      navigate('/admin'); // Redirection vers le dashboard si c'est bon
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

        <h1 style={styles.title}>Portail Administrateur</h1>
        <p style={styles.subtitle}>Accès sécurisé réservé au personnel Yely.</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <div style={styles.iconWrapper}><Mail size={20} color={COLORS.textSecondary} /></div>
            <input 
              type="email" 
              placeholder="Adresse email" 
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
              placeholder="Mot de passe" 
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
            {isLoading ? "Vérification..." : "Déverrouiller l'accès"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.richBlack,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundImage: `radial-gradient(circle at center, ${COLORS.primary}11 0%, ${COLORS.richBlack} 70%)`,
  },
  loginCard: {
    ...GLASS.modal,
    ...SHADOWS.strong,
    width: '100%',
    maxWidth: '420px',
    padding: SPACING.xxxl,
    borderRadius: BORDERS.radius.xl,
    border: `1px solid ${COLORS.borderActive}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoWrapper: {
    width: '80px', height: '80px',
    borderRadius: '50%',
    backgroundColor: COLORS.pureBlack,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.xl,
    boxShadow: `0 0 20px ${COLORS.primary}44`,
    overflow: 'hidden',
  },
  logoImage: { width: '100%', height: '100%', objectFit: 'cover' },
  title: {
    color: COLORS.textPrimary, fontSize: FONTS.sizes.h2, fontWeight: 'bold', marginBottom: SPACING.xs, textAlign: 'center'
  },
  subtitle: {
    color: COLORS.textSecondary, fontSize: FONTS.sizes.bodySmall, marginBottom: SPACING.xxl, textAlign: 'center'
  },
  form: { width: '100%', display: 'flex', flexDirection: 'column', gap: SPACING.lg },
  inputGroup: {
    position: 'relative', display: 'flex', alignItems: 'center', width: '100%'
  },
  iconWrapper: {
    position: 'absolute', left: SPACING.md, display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  input: {
    width: '100%', height: '52px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${COLORS.border}`,
    borderRadius: BORDERS.radius.lg,
    paddingLeft: '45px', paddingRight: SPACING.md,
    color: COLORS.textPrimary, fontSize: FONTS.sizes.body,
    outline: 'none', transition: 'border-color 0.3s ease',
  },
  submitBtn: {
    height: '52px', width: '100%',
    backgroundColor: COLORS.primary, color: COLORS.pureBlack,
    border: 'none', borderRadius: BORDERS.radius.lg,
    fontSize: FONTS.sizes.body, fontWeight: 'bold',
    cursor: 'pointer', marginTop: SPACING.md,
    boxShadow: `0 4px 15px ${COLORS.primary}44`,
  }
};

export default AdminLogin;