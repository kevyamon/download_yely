// src/components/FounderCard.jsx
import { motion } from 'framer-motion';
import React from 'react';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../theme/theme';

const FounderCard = ({ founder, variants }) => {
  // Construction de l'URL de l'image (À adapter si tu utilises Cloudinary ou un dossier static)
  const imageUrl = founder.imageFilename?.startsWith('http') 
    ? founder.imageFilename 
    : `${import.meta.env.VITE_API_URL}/uploads/${founder.imageFilename}`;

  return (
    <motion.div
      style={styles.card}
      variants={variants}
      whileHover={{ y: -5, boxShadow: SHADOWS.gold.boxShadow }}
    >
      <div style={styles.imageContainer}>
        {founder.imageFilename ? (
          <img 
            src={imageUrl} 
            alt={founder.name} 
            style={styles.image}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=YELY'; }}
          />
        ) : (
          <div style={styles.placeholderImage}>
            <span style={styles.placeholderText}>{founder.name.charAt(0)}</span>
          </div>
        )}
      </div>
      
      <div style={styles.infoContainer}>
        <h3 style={styles.name}>{founder.name}</h3>
        <p style={styles.role}>{founder.role}</p>
        <div style={styles.divider} />
        <p style={styles.story}>{founder.story}</p>
      </div>
    </motion.div>
  );
};

const styles = {
  card: {
    ...GLASS.card,
    ...SHADOWS.soft,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  imageContainer: {
    width: '100%',
    height: '250px',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.charcoal,
  },
  placeholderText: {
    fontSize: '64px',
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: SPACING.xl,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  name: {
    fontSize: FONTS.sizes.h3,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
  role: {
    fontSize: FONTS.sizes.bodySmall,
    color: COLORS.primary,
    fontWeight: FONTS.weights.semiBold,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: SPACING.md,
  },
  divider: {
    height: '2px',
    width: '40px',
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.md,
  },
  story: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    lineHeight: FONTS.lineHeights.relaxed,
  }
};

export default FounderCard;