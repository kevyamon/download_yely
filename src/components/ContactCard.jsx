// src/components/ContactCard.jsx
import { motion } from 'framer-motion';
import { Facebook, Globe, Instagram, Linkedin, Link as LinkIcon, Mail, MessageCircle, Phone, Twitter, Youtube } from 'lucide-react';
import React from 'react';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../theme/theme';

// Détection intelligente de l'icône ET de la couleur de la marque
const getPlatformDetails = (platformName) => {
  const name = (platformName || '').toLowerCase();
  
  if (name.includes('whatsapp')) return { icon: MessageCircle, color: '#25D366' };
  if (name.includes('facebook')) return { icon: Facebook, color: '#1877F2' };
  if (name.includes('instagram') || name.includes('insta')) return { icon: Instagram, color: '#E1306C' };
  if (name.includes('linkedin')) return { icon: Linkedin, color: '#0A66C2' };
  if (name.includes('twitter') || name === 'x') return { icon: Twitter, color: '#1DA1F2' };
  if (name.includes('youtube')) return { icon: Youtube, color: '#FF0000' };
  
  if (name.includes('mail') || name.includes('email')) return { icon: Mail, color: COLORS.primary };
  if (name.includes('tel') || name.includes('phone') || name.includes('appel')) return { icon: Phone, color: COLORS.primary };
  if (name.includes('site') || name.includes('web')) return { icon: Globe, color: COLORS.primary };
  
  return { icon: LinkIcon, color: COLORS.primary };
};

const ContactCard = ({ contact, variants }) => {
  const { icon: IconComponent, color } = getPlatformDetails(contact.platform);

  return (
    <motion.a
      href={contact.url}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.card}
      variants={variants}
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      whileTap={{ scale: 0.98 }}
    >
      {/* On utilise la couleur de la marque avec une opacité de ~10% (1A en hexa) pour le fond */}
      <div style={{ ...styles.iconWrapper, backgroundColor: `${color}1A` }}>
        <IconComponent size={28} color={color} />
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