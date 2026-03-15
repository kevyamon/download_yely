// src/pages/admin/FoundersAdmin.jsx
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../../theme/theme';

const FoundersAdmin = () => {
  const [founders, setFounders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    role: '', 
    description: '',
    imageUrl: '', 
    displayOrder: 0 
  });

  const { showToast } = useToast();

  const fetchFounders = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/founders`);
      const dataList = res.data?.data || res.data;
      setFounders(Array.isArray(dataList) ? dataList : []);
    } catch (error) {
      console.error("Erreur lecture fondateurs:", error);
      showToast("Impossible de charger l'équipe.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFounders();
  }, []);

  const openModal = (founder = null) => {
    if (founder) {
      setEditingId(founder._id || founder.id);
      // Rétrocompatibilité : on récupère description/imageUrl OU story/imageFilename si ce sont de vieilles données
      setFormData({ 
        name: founder.name || '', 
        role: founder.role || '', 
        description: founder.description || founder.story || '',
        imageUrl: founder.imageUrl || founder.imageFilename || '',
        displayOrder: founder.displayOrder || 0 
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', role: '', description: '', imageUrl: '', displayOrder: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/founders/${editingId}`, formData);
        showToast("Profil mis à jour avec succès !", "success");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/founders`, formData);
        showToast("Nouveau membre ajouté à l'équipe !", "success");
      }
      setIsModalOpen(false);
      fetchFounders(); 
    } catch (error) {
      showToast("Erreur lors de la sauvegarde du profil.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir retirer ce membre de l'équipe ?")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/founders/${id}`);
      showToast("Membre retiré.", "success");
      fetchFounders();
    } catch (error) {
      showToast("Erreur lors de la suppression.", "error");
    }
  };

  const getValidImageUrl = (urlOrFilename) => {
    if (!urlOrFilename) return null;
    if (urlOrFilename.startsWith('http')) return urlOrFilename;
    return `${import.meta.env.VITE_API_URL}/uploads/${urlOrFilename}`;
  };

  const FounderSkeleton = () => (
    <div style={{ ...styles.card, border: 'none' }}>
      <div className="skeleton-shimmer" style={{ width: '100%', height: '160px' }} />
      <div style={{ padding: '16px' }}>
        <div className="skeleton-shimmer" style={{ width: '70%', height: '24px', marginBottom: '10px', borderRadius: '4px' }} />
        <div className="skeleton-shimmer" style={{ width: '40%', height: '16px', marginBottom: '15px', borderRadius: '4px' }} />
        <div className="skeleton-shimmer" style={{ width: '100%', height: '40px', borderRadius: '4px' }} />
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>L'Équipe Yely</h2>
          <p style={styles.subtitle}>Gérez les profils des fondateurs affichés sur l'application.</p>
        </div>
        <motion.button 
          style={styles.addBtn}
          onClick={() => openModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} style={{ marginRight: '8px' }} />
          Nouveau Profil
        </motion.button>
      </div>

      {isLoading ? (
        <div style={styles.grid}>
          {[1, 2, 3].map((n) => <FounderSkeleton key={n} />)}
        </div>
      ) : founders.length === 0 ? (
        <div style={styles.emptyState}>L'équipe est vide. Cliquez sur "Nouveau Profil" pour présenter un fondateur.</div>
      ) : (
        <div style={styles.grid}>
          {founders.map((founder) => {
            // Utilisation de la fonction sécurisée pour l'image
            const validImage = getValidImageUrl(founder.imageUrl || founder.imageFilename);
            // Sécurité pour la description
            const validDesc = founder.description || founder.story || '';

            return (
              <motion.div 
                key={founder._id || founder.id} 
                style={styles.card}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div style={styles.imageContainer}>
                  {validImage ? (
                    <img 
                      src={validImage} 
                      alt={founder.name} 
                      style={styles.profileImage} 
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=YELY'; }}
                    />
                  ) : (
                    <div style={styles.placeholderImage}>{founder.name?.charAt(0) || 'Y'}</div>
                  )}
                </div>
                
                <div style={styles.cardContent}>
                  <h3 style={styles.name}>{founder.name}</h3>
                  <p style={styles.role}>{founder.role}</p>
                  <p style={styles.description}>
                    {validDesc.length > 80 ? validDesc.substring(0, 80) + '...' : validDesc}
                  </p>
                </div>

                <div style={styles.cardActions}>
                  <button onClick={() => openModal(founder)} style={styles.iconBtn}>
                    <Edit2 size={18} color={COLORS.primary} />
                  </button>
                  <button onClick={() => handleDelete(founder._id || founder.id)} style={styles.iconBtnDanger}>
                    <Trash2 size={18} color={COLORS.danger} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

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
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
            >
              <button style={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} color={COLORS.textPrimary} />
              </button>
              
              <h2 style={styles.modalTitle}>{editingId ? "Modifier le profil" : "Ajouter un membre"}</h2>
              
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nom complet</label>
                  <input 
                    type="text" 
                    style={styles.input} 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                    placeholder="Ex: Jean Dupont"
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Rôle / Titre</label>
                  <input 
                    type="text" 
                    style={styles.input} 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    required 
                    placeholder="Ex: CEO & Co-fondateur"
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>URL de la photo (Optionnel)</label>
                  <input 
                    type="url" 
                    style={styles.input} 
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Petite biographie / Description</label>
                  <textarea 
                    style={{...styles.input, minHeight: '100px', resize: 'vertical'}} 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Présentation rapide du parcours..."
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Ordre d'affichage (0 = en premier)</label>
                  <input 
                    type="number" 
                    style={styles.input} 
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: e.target.value})}
                  />
                </div>

                <button type="submit" style={styles.submitBtn}>
                  {editingId ? "Mettre à jour" : "Sauvegarder le profil"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles = {
  container: { paddingBottom: SPACING.xxl },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xxl, flexWrap: 'wrap', gap: SPACING.md },
  title: { color: COLORS.textPrimary, fontSize: FONTS.sizes.h2, marginBottom: SPACING.xs },
  subtitle: { color: COLORS.textSecondary, fontSize: FONTS.sizes.body },
  addBtn: {
    backgroundColor: COLORS.primary, color: COLORS.pureBlack, border: 'none', borderRadius: BORDERS.radius.pill,
    padding: `${SPACING.sm}px ${SPACING.lg}px`, display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer',
    ...SHADOWS.goldSoft
  },
  emptyState: { ...GLASS.card, padding: SPACING.xxl, textAlign: 'center', color: COLORS.textSecondary },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: SPACING.xl },
  card: { 
    ...GLASS.card, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.02)',
    overflow: 'hidden', padding: 0 
  },
  imageContainer: { width: '100%', height: '160px', backgroundColor: 'rgba(0,0,0,0.3)', position: 'relative' },
  profileImage: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholderImage: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', color: COLORS.primary, fontWeight: 'bold' },
  cardContent: { padding: SPACING.lg, flex: 1 },
  name: { color: COLORS.textPrimary, fontSize: FONTS.sizes.h3, fontWeight: 'bold', marginBottom: '4px' },
  role: { color: COLORS.primary, fontSize: FONTS.sizes.bodySmall, fontWeight: '600', marginBottom: SPACING.md },
  description: { color: COLORS.textSecondary, fontSize: FONTS.sizes.caption, lineHeight: 1.5 },
  cardActions: { display: 'flex', justifyContent: 'flex-end', padding: `0 ${SPACING.lg}px ${SPACING.lg}px`, gap: SPACING.sm },
  iconBtn: { background: 'rgba(212, 175, 55, 0.1)', border: 'none', borderRadius: BORDERS.radius.sm, padding: '8px', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' },
  iconBtnDanger: { background: 'rgba(192, 57, 43, 0.1)', border: 'none', borderRadius: BORDERS.radius.sm, padding: '8px', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, overflowY: 'auto', padding: SPACING.lg },
  modalContent: { ...GLASS.modal, width: '100%', maxWidth: '500px', padding: SPACING.xxl, borderRadius: BORDERS.radius.xl, position: 'relative', margin: 'auto' },
  closeBtn: { position: 'absolute', top: SPACING.lg, right: SPACING.lg, background: 'none', border: 'none', cursor: 'pointer' },
  modalTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.h3, marginBottom: SPACING.xl },
  form: { display: 'flex', flexDirection: 'column', gap: SPACING.md },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: COLORS.textSecondary, fontSize: FONTS.sizes.bodySmall },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${COLORS.border}`, borderRadius: BORDERS.radius.lg, padding: SPACING.md, color: COLORS.textPrimary, outline: 'none', fontSize: FONTS.sizes.body },
  submitBtn: { backgroundColor: COLORS.primary, color: COLORS.pureBlack, border: 'none', borderRadius: BORDERS.radius.pill, padding: SPACING.md, fontWeight: 'bold', cursor: 'pointer', marginTop: SPACING.lg }
};

export default FoundersAdmin;