// src/pages/admin/DashboardHome.jsx
import axios from 'axios';
import { motion } from 'framer-motion';
import { Apple, Smartphone, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../../theme/theme';

const DashboardHome = () => {
  const [stats, setStats] = useState({ androidClicks: 0, iosClicks: 0, visitorsCount: 0 });
  const [isLoading, setIsLoading] = useState(true); // Ajout de l'état de chargement
  const socket = useSocket();

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/stats`);
      setStats(res.data);
    } catch (err) {
      console.error("Erreur récupération stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('stats_updated', setStats);
    return () => socket.off('stats_updated');
  }, [socket]);

  // Définition des cartes de statistiques
  const statCards = [
    { title: "Téléchargements Android", value: stats.androidClicks || 0, icon: Smartphone, color: COLORS.primary },
    { title: "Installations iPhone", value: stats.iosClicks || 0, icon: Apple, color: COLORS.textPrimary },
    { title: "Visiteurs (Optionnel)", value: stats.visitorsCount || 0, icon: Users, color: COLORS.info },
  ];

  // Composant Skeleton pour les Stats
  const StatSkeleton = () => (
    <div style={{ ...styles.card, border: 'none' }}>
      <div style={styles.cardHeader}>
        <div className="skeleton-shimmer" style={{ width: '150px', height: '20px', borderRadius: '4px' }} />
        <div className="skeleton-shimmer" style={{ width: '48px', height: '48px', borderRadius: BORDERS.radius.lg }} />
      </div>
      <div style={styles.valueContainer}>
        <div className="skeleton-shimmer" style={{ width: '80px', height: '48px', borderRadius: '4px' }} />
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={styles.header}>
        <h2 style={styles.title}>Aperçu des performances</h2>
        <p style={styles.subtitle}>Statistiques en temps réel de votre page d'acquisition.</p>
      </div>

      {isLoading ? (
        <div style={styles.grid}>
          {[1, 2, 3].map((n) => <StatSkeleton key={n} />)}
        </div>
      ) : (
        <div style={styles.grid}>
          {statCards.map((card, index) => (
            <motion.div 
              key={index}
              style={styles.card}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
            >
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{card.title}</h3>
                <div style={{...styles.iconWrapper, backgroundColor: `${card.color}22`}}>
                  <card.icon size={24} color={card.color} />
                </div>
              </div>
              <div style={styles.valueContainer}>
                <span style={styles.value}>{card.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const styles = {
  header: { marginBottom: SPACING.xxl },
  title: { color: COLORS.textPrimary, fontSize: FONTS.sizes.h3, marginBottom: SPACING.xs },
  subtitle: { color: COLORS.textSecondary, fontSize: FONTS.sizes.body },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
    gap: SPACING.lg 
  },
  card: {
    ...GLASS.card, padding: SPACING.xl, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(255,255,255,0.03)'
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  cardTitle: { color: COLORS.textSecondary, fontSize: FONTS.sizes.body, fontWeight: 'bold' },
  iconWrapper: { width: '48px', height: '48px', borderRadius: BORDERS.radius.lg, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  valueContainer: { display: 'flex', alignItems: 'baseline' },
  value: { color: COLORS.textPrimary, fontSize: '48px', fontWeight: '900' }
};

export default DashboardHome;