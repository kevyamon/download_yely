// src/components/ContactCard.jsx
import { motion } from 'framer-motion';
import { Globe, Link as LinkIcon, Mail, MessageCircle, Phone } from 'lucide-react';
import React from 'react';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../theme/theme';

// Détection intelligente de l'icône
const getPlatformIcon = (platformName) => {
  const name = (platformName || '').toLowerCase();
  if (name.includes('whatsapp') || name.includes('message')) return <MessageCircle size={28} color={COLORS.primary} />;
  if (name.includes('mail') || name.includes('email')) return <Mail size={28} color={COLORS.primary} />;
  if (name.includes('tel') || name.includes('phone') || name.includes('appel')) return <Phone size={28} color={COLORS.primary} />;
  if (name.includes('site') || name.includes('web')) return <Globe size={28} color={COLORS.primary} />;
  return <LinkIcon size={28} color={COLORS.primary} />;
};

const ContactCard = ({ contact, variants }) => {
  return (
    <motion.a
      href={contact.url}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.card}
      variants={variants}
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 175, 55, 0.05)' }}
      whileTap={{ scale: 0.98 }}
    >
      <div style={styles.iconWrapper}>
        {getPlatformIcon(contact.platform)}
      </div>
      <div style={styles.cardInfo}>
        <span style={styles.platformName}>{contact.platform}</span>
        <span style={styles.actionText}>Ouvrir le lien ↗</span>
      </div>
    </motion.a>
  );
};

const styles = {
  card: {
    ...GLASS.card,
    ...SHADOWS.soft,
    display: 'flex',
    alignItems: 'center',
    padding: SPACING.lg,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  iconWrapper: {
    width: '50px',
    height: '50px',
    borderRadius: BORDERS.radius.circle,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  cardInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  platformName: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.h4,
    fontWeight: FONTS.weights.bold,
    marginBottom: '4px',
  },
  actionText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.caption,
    fontWeight: FONTS.weights.medium,
  }
};

export default ContactCard;