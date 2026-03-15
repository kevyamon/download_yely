// src/components/FoundersView.jsx
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import FounderCard from './FounderCard';
import Loader from './Loader';

const FoundersView = ({ onBack }) => {
  const [founders, setFounders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();

  const fetchFounders = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/founders`);
      const dataList = res.data?.data || res.data;
      setFounders(Array.isArray(dataList) ? dataList : []);
    } catch (err) {
      console.error("Erreur recuperation fondateurs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFounders();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('founders_updated', fetchFounders);
    return () => socket.off('founders_updated');
  }, [socket]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>
          <ArrowLeft size={24} style={{ marginRight: '8px' }} />
          <span>Retour</span>
        </button>
      </div>

      <div style={styles.content}>
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.titleSection}
        >
          <h2 style={styles.title}>L'Equipe Yely</h2>
          <p style={styles.subtitle}>Decouvrez les visionnaires derriere la revolution du transport.</p>
        </motion.div>

        {isLoading ? (
          <div style={styles.loadingState}>
            <Loader message="Chargement des profils..." />
          </div>
        ) : founders.length === 0 ? (
          <div style={styles.loadingState}>
            <p style={{ color: COLORS.textSecondary }}>Les profils seront devoiles tres prochainement.</p>
          </div>
        ) : (
          <motion.div 
            style={styles.grid}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {founders.map((founder) => (
              <FounderCard 
                key={founder._id || founder.id} 
                founder={founder} 
                variants={itemVariants} 
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${SPACING.xl}px ${SPACING.lg}px`,
  },
  header: {
    width: '100%',
    maxWidth: '900px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: COLORS.primary,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.bold,
    cursor: 'pointer',
    padding: 0,
  },
  content: {
    width: '100%',
    maxWidth: '900px',
  },
  titleSection: {
    marginBottom: SPACING.xxl,
    textAlign: 'center',
  },
  title: {
    fontSize: FONTS.sizes.hero,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    lineHeight: FONTS.lineHeights.relaxed,
  },
  loadingState: {
    display: 'flex',
    justifyContent: 'center',
    padding: `${SPACING.giant}px 0`,
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: SPACING.xl,
    paddingBottom: SPACING.giant,
  }
};

export default FoundersView;