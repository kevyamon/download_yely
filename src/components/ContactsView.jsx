// src/components/ContactsView.jsx
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { BORDERS, COLORS, FONTS } from '../theme/theme';

const ContactsView = ({ onBack }) => {
  const [contacts, setContacts] = useState([]);
  const socket = useSocket();

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/contacts`);
      setContacts(res.data);
    } catch (err) {
      console.error("Erreur contacts:", err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // MISE A JOUR TEMPS REEL SI L'ADMIN CHANGE UN LIEN
  useEffect(() => {
    if (!socket) return;
    socket.on('contacts_updated', fetchContacts);
    return () => socket.off('contacts_updated');
  }, [socket]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backBtn}>← Retour</button>
        <h2 style={styles.title}>Nous contacter</h2>
      </div>

      <div style={styles.grid}>
        {contacts.map((c, index) => (
          <motion.a
            key={c._id}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.card}
            whileHover={{ scale: 1.05 }}
            animate={{ 
              boxShadow: [
                `0 0 0px ${COLORS.primary}00`,
                `0 0 15px ${COLORS.primary}44`,
                `0 0 0px ${COLORS.primary}00`
              ] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              delay: index * 0.2 
            }}
          >
            <span style={styles.platformName}>{c.platform}</span>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: COLORS.background,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '40px',
    paddingTop: '20px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: COLORS.primary,
    fontSize: '16px',
    cursor: 'pointer',
    marginRight: '20px',
  },
  title: {
    fontSize: FONTS.sizes.h2,
    color: COLORS.textPrimary,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  card: {
    aspectRatio: '1 / 1',
    backgroundColor: COLORS.glassSurface,
    borderRadius: BORDERS.radius.lg,
    border: `1px solid ${COLORS.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    fontSize: '14px',
    textAlign: 'center',
    padding: '10px',
  },
  platformName: {
    textTransform: 'uppercase',
    letterSpacing: '1px',
  }
};

export default ContactsView;