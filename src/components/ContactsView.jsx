// src/components/ContactsView.jsx
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import ContactCard from './ContactCard';

const ContactsView = ({ onBack }) => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/contacts`);
      const dataList = res.data?.data || res.data;
      setContacts(Array.isArray(dataList) ? dataList : []);
    } catch (err) {
      console.error("Erreur récupération contacts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // MISE A JOUR TEMPS REEL (SOCKET)
  useEffect(() => {
    if (!socket) return;
    socket.on('contacts_updated', fetchContacts);
    return () => socket.off('contacts_updated');
  }, [socket]);

  // Animation de conteneur en cascade (Stagger)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
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
          <h2 style={styles.title}>Assistance 24/7</h2>
          <p style={styles.subtitle}>Notre équipe est à votre disposition sur les plateformes suivantes.</p>
        </motion.div>

        {isLoading ? (
          <div style={styles.loadingState}>
            <p style={{ color: COLORS.textSecondary }}>Connexion sécurisée en cours...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div style={styles.loadingState}>
            <p style={{ color: COLORS.textSecondary }}>Aucun canal de contact disponible pour le moment.</p>
          </div>
        ) : (
          <motion.div 
            style={styles.list}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {contacts.map((c) => (
              <ContactCard 
                key={c._id || c.id} 
                contact={c} 
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
    maxWidth: '500px',
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
    maxWidth: '500px',
  },
  titleSection: {
    marginBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONTS.sizes.h1,
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
    padding: `${SPACING.xxl}px 0`,
    textAlign: 'center',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.md,
  }
};

export default ContactsView;