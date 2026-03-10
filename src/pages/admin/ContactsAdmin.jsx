// src/pages/admin/ContactsAdmin.jsx
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../../theme/theme';

const ContactsAdmin = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Gestion de la modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ platform: '', url: '', displayOrder: 0 });

  const { showToast } = useToast();

  // 1. LIRE LES CONTACTS
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/contacts`);
      const dataList = res.data?.data || res.data;
      setContacts(Array.isArray(dataList) ? dataList : []);
    } catch (error) {
      console.error("Erreur lecture contacts:", error);
      showToast("Impossible de charger les contacts.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // 2. OUVRIR LA MODALE
  const openModal = (contact = null) => {
    if (contact) {
      setEditingId(contact._id);
      setFormData({ platform: contact.platform, url: contact.url, displayOrder: contact.displayOrder || 0 });
    } else {
      setEditingId(null);
      setFormData({ platform: '', url: '', displayOrder: 0 });
    }
    setIsModalOpen(true);
  };

  // 3. SAUVEGARDER
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/contacts/${editingId}`, formData);
        showToast("Lien mis à jour avec succès !", "success");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/contacts`, formData);
        showToast("Nouveau lien ajouté !", "success");
      }
      setIsModalOpen(false);
      fetchContacts(); 
    } catch (error) {
      showToast("Erreur lors de la sauvegarde.", "error");
    }
  };

  // 4. SUPPRIMER
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce lien ?")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/contacts/${id}`);
      showToast("Lien supprimé.", "success");
      fetchContacts();
    } catch (error) {
      showToast("Erreur lors de la suppression.", "error");
    }
  };

  // Composant Skeleton pour le chargement
  const ContactSkeleton = () => (
    <div style={{ ...styles.card, border: 'none' }}>
      <div style={{ flex: 1 }}>
        <div className="skeleton-shimmer" style={{ width: '150px', height: '20px', marginBottom: '10px', borderRadius: '4px' }} />
        <div className="skeleton-shimmer" style={{ width: '220px', height: '14px', borderRadius: '4px' }} />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <div className="skeleton-shimmer" style={{ width: '34px', height: '34px', borderRadius: '4px' }} />
        <div className="skeleton-shimmer" style={{ width: '34px', height: '34px', borderRadius: '4px' }} />
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* EN-TÊTE DE LA SECTION */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Canaux de communication</h2>
          <p style={styles.subtitle}>Gérez les liens d'assistance affichés sur l'application.</p>
        </div>
        <motion.button 
          style={styles.addBtn}
          onClick={() => openModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} style={{ marginRight: '8px' }} />
          Nouveau Lien
        </motion.button>
      </div>

      {/* LISTE DES CONTACTS AVEC SKELETONS */}
      {isLoading ? (
        <div style={styles.grid}>
          {[1, 2, 3, 4].map((n) => <ContactSkeleton key={n} />)}
        </div>
      ) : contacts.length === 0 ? (
        <div style={styles.emptyState}>Aucun contact configuré. Cliquez sur "Nouveau Lien" pour commencer.</div>
      ) : (
        <div style={styles.grid}>
          {contacts.map((contact) => (
            <motion.div 
              key={contact._id} 
              style={styles.card}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={styles.cardContent}>
                <h3 style={styles.platformName}>{contact.platform}</h3>
                <p style={styles.platformUrl}>{contact.url}</p>
              </div>
              <div style={styles.cardActions}>
                <button onClick={() => openModal(contact)} style={styles.iconBtn}>
                  <Edit2 size={18} color={COLORS.primary} />
                </button>
                <button onClick={() => handleDelete(contact._id)} style={styles.iconBtnDanger}>
                  <Trash2 size={18} color={COLORS.danger} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODALE D'AJOUT / ÉDITION */}
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button style={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} color={COLORS.textPrimary} />
              </button>
              
              <h2 style={styles.modalTitle}>{editingId ? "Modifier le lien" : "Ajouter un lien"}</h2>
              
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Plateforme (ex: WhatsApp, Email)</label>
                  <input 
                    type="text" 
                    style={styles.input} 
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    required 
                    placeholder="Nom affiché"
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>URL de redirection</label>
                  <input 
                    type="url" 
                    style={styles.input} 
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    required 
                    placeholder="https://..."
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
                  {editingId ? "Mettre à jour" : "Créer le lien"}
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: SPACING.lg },
  card: { ...GLASS.card, padding: SPACING.lg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)' },
  cardContent: { flex: 1, overflow: 'hidden' },
  platformName: { color: COLORS.primary, fontSize: FONTS.sizes.h4, fontWeight: 'bold', marginBottom: '4px' },
  platformUrl: { color: COLORS.textSecondary, fontSize: FONTS.sizes.caption, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  cardActions: { display: 'flex', gap: SPACING.sm, marginLeft: SPACING.md },
  iconBtn: { background: 'rgba(212, 175, 55, 0.1)', border: 'none', borderRadius: BORDERS.radius.sm, padding: '8px', cursor: 'pointer', display: 'flex' },
  iconBtnDanger: { background: 'rgba(192, 57, 43, 0.1)', border: 'none', borderRadius: BORDERS.radius.sm, padding: '8px', cursor: 'pointer', display: 'flex' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modalContent: { ...GLASS.modal, width: '100%', maxWidth: '450px', padding: SPACING.xxl, borderRadius: BORDERS.radius.xl, position: 'relative' },
  closeBtn: { position: 'absolute', top: SPACING.lg, right: SPACING.lg, background: 'none', border: 'none', cursor: 'pointer' },
  modalTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.h3, marginBottom: SPACING.xl },
  form: { display: 'flex', flexDirection: 'column', gap: SPACING.lg },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: COLORS.textSecondary, fontSize: FONTS.sizes.bodySmall },
  input: { backgroundColor: 'rgba(255,255,255,0.05)', border: `1px solid ${COLORS.border}`, borderRadius: BORDERS.radius.lg, padding: SPACING.md, color: COLORS.textPrimary, outline: 'none' },
  submitBtn: { backgroundColor: COLORS.primary, color: COLORS.pureBlack, border: 'none', borderRadius: BORDERS.radius.pill, padding: SPACING.md, fontWeight: 'bold', cursor: 'pointer', marginTop: SPACING.md }
};

export default ContactsAdmin;