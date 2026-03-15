// src/components/FounderCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../theme/theme';

const FounderCard = ({ founder, variants }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
      layout // Permet a Framer Motion d'animer l'agrandissement de la carte automatiquement
    >
      <div style={styles.imageSection}>
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
        
        <motion.div 
          style={isExpanded ? styles.storyExpanded : styles.storyCollapsed}
          layout // Anime le texte qui se deroule
        >
          <p style={styles.story}>{founder.description}</p>
        </motion.div>
        
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
    alignItems: 'center', // Centre tout le contenu de la carte
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    marginTop: '20px', // Plus besoin d'une grosse marge vu que l'image ne depasse plus
    minHeight: '350px', 
  },
  imageSection: {
    width: '100%',
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.05)', // Fond legerement dore pour separer l'image du texte
  },
  imageWrapper: {
    width: '140px',
    height: '140px',
    borderRadius: BORDERS.radius.circle,
    padding: '6px',
    backgroundColor: COLORS.background,
    ...SHADOWS.strong,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top', 
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
    fontSize: '50px',
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: SPACING.xl,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
    width: '100%'
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
    WebkitLineClamp: 3, // Bloque a 3 lignes precisement
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis', // Ajoute les "..." a la fin
  },
  storyExpanded: {
    display: 'block',
  },
  story: {
    fontSize: FONTS.sizes.body,
    color: COLORS.textSecondary,
    lineHeight: FONTS.lineHeights.relaxed,
    margin: 0,
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