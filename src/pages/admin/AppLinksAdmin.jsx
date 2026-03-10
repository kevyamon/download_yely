// src/pages/admin/AppLinksAdmin.jsx
import axios from 'axios';
import { motion } from 'framer-motion';
import { Apple, Link as LinkIcon, Smartphone } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../../theme/theme';

const AppLinksAdmin = () => {
  const [config, setConfig] = useState({ apkUrl: '', pwaUrl: '', androidVersion: '', iosVersion: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/config`);
        setConfig(res.data);
      } catch (error) {
        showToast("Impossible de charger la configuration.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, [showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/config`, config);
      showToast("Liens de téléchargement mis à jour !", "success");
    } catch (error) {
      showToast("Erreur lors de la sauvegarde.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div style={{ color: COLORS.textSecondary, padding: SPACING.xxl }}>Chargement du coffre-fort...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Versions & Téléchargements</h2>
        <p style={styles.subtitle}>Définissez les liens vers lesquels vos utilisateurs seront redirigés.</p>
      </div>

      <motion.form 
        onSubmit={handleSubmit}
        style={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* SECTION ANDROID */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Smartphone size={24} color={COLORS.primary} />
            <h3 style={styles.sectionTitle}>Application Android (APK)</h3>
          </div>
          
          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Lien de téléchargement (.apk)</label>
              <div style={styles.inputWrapper}>
                <LinkIcon size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                <input 
                  type="url" 
                  style={styles.input} 
                  value={config.apkUrl || ''}
                  onChange={(e) => setConfig({...config, apkUrl: e.target.value})}
                  placeholder="https://votre-serveur.com/yely-v1.apk"
                />
              </div>
            </div>
            
            <div style={styles.inputGroupSmall}>
              <label style={styles.label}>Version</label>
              <input 
                type="text" 
                style={styles.input} 
                value={config.androidVersion || ''}
                onChange={(e) => setConfig({...config, androidVersion: e.target.value})}
                placeholder="ex: 1.0.2"
              />
            </div>
          </div>
        </div>

        <div style={styles.divider} />

        {/* SECTION IOS */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Apple size={24} color={COLORS.textPrimary} />
            <h3 style={{...styles.sectionTitle, color: COLORS.textPrimary}}>Application iPhone (PWA)</h3>
          </div>
          
          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Lien de la Web App (PWA)</label>
              <div style={styles.inputWrapper}>
                <LinkIcon size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
                <input 
                  type="url" 
                  style={styles.input} 
                  value={config.pwaUrl || ''}
                  onChange={(e) => setConfig({...config, pwaUrl: e.target.value})}
                  placeholder="https://app.yely.com"
                />
              </div>
            </div>

            <div style={styles.inputGroupSmall}>
              <label style={styles.label}>Version</label>
              <input 
                type="text" 
                style={styles.input} 
                value={config.iosVersion || ''}
                onChange={(e) => setConfig({...config, iosVersion: e.target.value})}
                placeholder="ex: 1.0.2"
              />
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <motion.button 
            type="submit" 
            style={styles.submitBtn}
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSaving ? "Déploiement..." : "Déployer les nouveaux liens"}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

const styles = {
  container: { paddingBottom: SPACING.xxl, maxWidth: '800px' },
  header: { marginBottom: SPACING.xxl },
  title: { color: COLORS.textPrimary, fontSize: FONTS.sizes.h2, marginBottom: SPACING.xs },
  subtitle: { color: COLORS.textSecondary, fontSize: FONTS.sizes.body },
  card: { ...GLASS.card, padding: SPACING.xxl, backgroundColor: 'rgba(255,255,255,0.02)' },
  section: { display: 'flex', flexDirection: 'column', gap: SPACING.lg },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.sm },
  sectionTitle: { color: COLORS.primary, fontSize: FONTS.sizes.h3, fontWeight: 'bold' },
  inputRow: { display: 'flex', gap: SPACING.lg, flexWrap: 'wrap' },
  inputGroup: { flex: 3, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '250px' },
  inputGroupSmall: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '100px' },
  label: { color: COLORS.textSecondary, fontSize: FONTS.sizes.bodySmall },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: SPACING.md },
  input: { width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${COLORS.border}`, borderRadius: BORDERS.radius.lg, padding: SPACING.md, paddingLeft: '40px', color: COLORS.textPrimary, outline: 'none', fontSize: FONTS.sizes.body },
  divider: { height: '1px', backgroundColor: COLORS.border, margin: `${SPACING.xxl}px 0` },
  actions: { display: 'flex', justifyContent: 'flex-end', marginTop: SPACING.xxl },
  submitBtn: { backgroundColor: COLORS.primary, color: COLORS.pureBlack, border: 'none', borderRadius: BORDERS.radius.pill, padding: `${SPACING.md}px ${SPACING.xl}px`, fontSize: FONTS.sizes.body, fontWeight: 'bold', cursor: 'pointer', ...SHADOWS.goldSoft }
};

export default AppLinksAdmin;