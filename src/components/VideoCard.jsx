// src/components/VideoCard.jsx
import { motion } from 'framer-motion';
import React from 'react';
import { COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../theme/theme';

const VideoCard = ({ video, variants }) => {
  // Vérification simple pour savoir si c'est un lien YouTube à intégrer
  const isYouTube = video.videoUrl?.includes('youtube.com') || video.videoUrl?.includes('youtu.be');
  
  // Transformation d'un lien classique YouTube en lien "embed" (si nécessaire)
  let embedUrl = video.videoUrl;
  if (isYouTube && !embedUrl.includes('embed')) {
    const videoId = embedUrl.split('v=')[1] || embedUrl.split('youtu.be/')[1];
    embedUrl = `https://www.youtube.com/embed/${videoId?.split('&')[0]}`;
  }

  return (
    <motion.div
      style={styles.card}
      variants={variants}
      whileHover={{ y: -5, boxShadow: SHADOWS.goldSoft.boxShadow }}
    >
      <div style={styles.videoContainer}>
        {isYouTube || embedUrl?.includes('embed') ? (
          <iframe
            style={styles.iframe}
            src={embedUrl}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video 
            style={styles.iframe} 
            src={embedUrl} 
            controls 
            preload="metadata"
          />
        )}
      </div>
      
      <div style={styles.infoContainer}>
        <h3 style={styles.title}>{video.title}</h3>
        {video.description && (
          <p style={styles.description}>{video.description}</p>
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
  },
  videoContainer: {
    width: '100%',
    aspectRatio: '16 / 9', // Format standard vidéo
    backgroundColor: COLORS.charcoal,
    position: 'relative',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
  infoContainer: {
    padding: SPACING.lg,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: FONTS.sizes.h3,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONTS.sizes.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: FONTS.lineHeights.relaxed,
  }
};

export default VideoCard;