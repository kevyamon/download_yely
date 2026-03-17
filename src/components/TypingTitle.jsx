// src/components/TypingTitle.jsx
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { COLORS, FONTS } from '../theme/theme';

const TypingTitle = ({ fullTitle, variants }) => {
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeoutId;
    let currentIndex = 0;
    let isMounted = true; // Securite contre les fuites de memoire si le composant est detruit

    const typeCharacter = () => {
      if (!isMounted) return;

      setIsTyping(true);
      if (currentIndex < fullTitle.length) {
        setDisplayedTitle(fullTitle.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeCharacter, 100);
      } else {
        setIsTyping(false);
        timeoutId = setTimeout(() => {
          if (!isMounted) return;
          currentIndex = 0;
          setDisplayedTitle("");
          typeCharacter();
        }, 30000);
      }
    };

    typeCharacter();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fullTitle]);

  return (
    <motion.div variants={variants} style={styles.container}>
      {/* Calque invisible pour forcer la dimension exacte et pre-calculer les sauts de ligne */}
      <h1 style={styles.placeholder}>
        {fullTitle}
      </h1>
      
      {/* Calque visible avec position absolue par dessus pour l'animation */}
      <h1 style={styles.typingOverlay}>
        {displayedTitle}
        {isTyping && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", repeatType: "reverse" }}
            style={styles.cursor}
          >
            |
          </motion.span>
        )}
      </h1>
    </motion.div>
  );
};

const styles = {
  container: {
    position: 'relative',
    marginBottom: '10px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  placeholder: {
    fontSize: FONTS.sizes.h2, 
    fontWeight: '800',
    visibility: 'hidden',
    margin: 0,
    textAlign: 'center',
    pointerEvents: 'none'
  },
  typingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    fontSize: FONTS.sizes.h2, 
    color: COLORS.textPrimary, 
    fontWeight: '800',
    margin: 0,
    textAlign: 'center'
  },
  cursor: {
    color: COLORS.primary,
    position: 'absolute', 
    marginLeft: '4px'
  }
};

export default TypingTitle;