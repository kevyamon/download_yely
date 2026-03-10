// src/pages/admin/VideosAdmin.jsx
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Edit2, PlayCircle, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../../theme/theme';

const VideosAdmin = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Gestion de la modale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    videoUrl: '',
    displayOrder: 0 
  });

  const { showToast } = useToast();

  // 1. LIRE LES VIDÉOS
  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/videos`);
      const dataList = res.data?.data || res.data;
      setVideos(Array.isArray(dataList) ? dataList : []);
    } catch (error) {
      console.error("Erreur lecture vidéos:", error);
      showToast("Impossible de charger les vidéos.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // 2. OUVRIR LA MODALE
  const openModal = (video = null) => {
    if (video) {
      setEditingId(video._id);
      setFormData({ 
        title: video.title || '', 
        description: video.description || '', 
        videoUrl: video.videoUrl || '',
        displayOrder: video.displayOrder || 0 
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', description: '', videoUrl: '', displayOrder: 0 });
    }
    setIsModalOpen(true);
  };

  // 3. SAUVEGARDER
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/videos/${editingId}`, formData);
        showToast("Vidéo mise à jour avec succès !", "success");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/videos`, formData);
        showToast("Nouvelle vidéo ajoutée !", "success");
      }
      setIsModalOpen(false);
      fetchVideos(); 
    } catch (error) {
      showToast("Erreur lors de la sauvegarde.", "error");
    }
  };

  // 4. SUPPRIMER
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ?")) return;
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/videos/${id}`);
      showToast("Vidéo supprimée.", "success");
      fetchVideos();
    } catch (error) {
      showToast("Erreur lors de la suppression.", "error");
    }
  };

  // Petit Helper pour extraire la miniature YouTube si c'est un lien YouTube
  const getYoutubeThumbnail = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg` 
      : null;
  };

  return (
    <div style={styles.container}>
      {/* EN-TÊTE */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Médiathèque Yely</h2>
          <p style={styles.subtitle}>Gérez les vidéos tutoriels et promotionnelles.</p>
        </div>
        <motion.button 
          style={styles.addBtn}
          onClick={() => openModal()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} style={{ marginRight: '8px' }} />
          Nouvelle Vidéo
        </motion.button>
      </div>

      {/* LISTE DES VIDÉOS */}
      {isLoading ? (
        <p style={{ color: COLORS.textSecondary }}>Chargement des médias...</p>
      ) : videos.length === 0 ? (
        <div style={styles.emptyState}>Aucune vidéo pour le moment. Cliquez sur "Nouvelle Vidéo" pour commencer.</div>
      ) : (
        <div style={styles.grid}>
          {videos.map((video) => {
            const thumbnailUrl = getYoutubeThumbnail(video.videoUrl);
            
            return (
              <motion.div 
                key={video._id} 
                style={styles.card}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Section Image / Miniature */}
                <div style={styles.videoThumbnail}>
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt="Miniature" style={styles.thumbnailImg} />
                  ) : (
                    <div style={styles.placeholderThumbnail}>
                      <PlayCircle size={40} color={COLORS.primary} />
                    </div>
                  )}
                </div>

                {/* Section Contenu */}
                <div style={styles.cardContent}>
                  <h3 style={styles.videoTitle}>{video.title}</h3>
                  <p style={styles.videoDesc}>
                    {video.description?.length > 70 ? video.description.substring(0, 70) + '...' : video.description}
                  </p>
                </div>

                {/* Actions */}
                <div style={styles.cardActions}>
                  <button onClick={() => openModal(video)} style={styles.iconBtn}>
                    <Edit2 size={18} color={COLORS.primary} />
                  </button>
                  <button onClick={() => handleDelete(video._id)} style={styles.iconBtnDanger}>
                    <Trash2 size={18} color={COLORS.danger} />
                  </button>
                </div>
              </motion.div>
            );
          })}
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
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
            >
              <button style={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} color={COLORS.textPrimary} />
              </button>
              
              <h2 style={styles.modalTitle}>{editingId ? "Modifier la vidéo" : "Ajouter une vidéo"}</h2>
              
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Titre de la vidéo</label>
                  <input 
                    type="text" 
                    style={styles.input} 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required 
                    placeholder="Ex: Tutoriel Chauffeur Yely"
                  />
                </div>
                
                <div style={styles.inputGroup}>
                  <label style={styles.label}>URL de la vidéo (YouTube, MP4...)</label>
                  <input 
                    type="url" 
                    style={styles.input} 
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                    required 
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea 
                    style={{...styles.input, minHeight: '80px', resize: 'vertical'}} 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description courte affichée sous la vidéo..."
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
                  {editingId ? "Mettre à jour" : "Publier la vidéo"}
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: SPACING.xl },
  card: { 
    ...GLASS.card, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.02)',
    overflow: 'hidden', padding: 0 
  },
  videoThumbnail: { width: '100%', aspectRatio: '16/9', backgroundColor: 'rgba(0,0,0,0.4)', position: 'relative' },
  thumbnailImg: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholderThumbnail: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardContent: { padding: SPACING.lg, flex: 1 },
  videoTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.h4, fontWeight: 'bold', marginBottom: '8px' },
  videoDesc: { color: COLORS.textSecondary, fontSize: FONTS.sizes.caption, lineHeight: 1.5 },
  cardActions: { display: 'flex', justifyContent: 'flex-end', padding: `0 ${SPACING.lg}px ${SPACING.lg}px`, gap: SPACING.sm },
  iconBtn: { background: 'rgba(212, 175, 55, 0.1)', border: 'none', borderRadius: BORDERS.radius.sm, padding: '8px', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' },
  iconBtnDanger: { background: 'rgba(192, 57, 43, 0.1)', border: 'none', borderRadius: BORDERS.radius.sm, padding: '8px', cursor: 'pointer', display: 'flex', transition: 'all 0.2s' },
  
  // Modale
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

export default VideosAdmin;