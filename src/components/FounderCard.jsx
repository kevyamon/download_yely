// src/components/FounderCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../theme/theme';

const FounderCard = ({ founder, variants }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Correction profonde : utilisation de imageUrl au lieu de imageFilename selon la BDD
  const imageUrl = founder.imageUrl?.startsWith('http') 
    ? founder.imageUrl 
    : `${import.meta.env.VITE_API_URL}/uploads/${founder.imageUrl}`;

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      style={styles.card}
      variants={variants}
      whileHover={{ y: -5, boxShadow: SHADOWS.gold.boxShadow }}
    >
      <div style={styles.headerBackground}>
        <div style={styles.imageWrapper}>
          {founder.imageUrl ? (
            <img 
              src={imageUrl} 
              alt={founder.name} 
              style={styles.image}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=YELY'; }}
            />
          ) : (
            <div style={styles.placeholderImage}>
              <span style={styles.placeholderText}>{founder.name ? founder.name.charAt(0) : 'Y'}</span>
            </div>
          )}
        </div>
      </div>
      
      <div style={styles.infoContainer}>
        <h3 style={styles.name}>{founder.name}</h3>
        <p style={styles.role}>{founder.role}</p>
        <div style={styles.divider} />
        
        <div style={isExpanded ? styles.storyExpanded : styles.storyCollapsed}>
          {/* Correction profonde : utilisation de description au lieu de story selon la BDD */}
          <p style={styles.story}>{founder.description}</p>
        </div>
        
        {founder.description && founder.description.length > 100 && (
          <button onClick={toggleReadMore} style={styles.readMoreButton}>
            {isExpanded ? "Voir moins" : "Lire plus"}
          </button>
        )}
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
    position: 'relative',
    marginTop: '50px',
  },
  headerBackground: {
    width: '100%',
    height: '80px',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  imageWrapper: {
    position: 'absolute',
    top: '-50px',
    width: '100px',
    height: '100px',
    borderRadius: BORDERS.radius.circle,
    padding: '4px',
    backgroundColor: COLORS.background,
    ...SHADOWS.medium,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: BORDERS.radius.circle,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.charcoal,
    borderRadius: BORDERS.radius.circle,
  },
  placeholderText: {
    fontSize: '40px',
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: SPACING.xl,
    paddingTop: '60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
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
  storyCollapsed: {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  storyExpanded: {
    display: 'block',
  },
  story: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    lineHeight: FONTS.lineHeights.relaxed,
  },
  readMoreButton: {
    marginTop: SPACING.md,
    backgroundColor: 'transparent',
    border: 'none',
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
    cursor: 'pointer',
    fontSize: FONTS.sizes.bodySmall,
    padding: '5px 10px',
  }
};

export default FounderCard;