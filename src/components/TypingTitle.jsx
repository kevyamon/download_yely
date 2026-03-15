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

    const typeCharacter = () => {
      setIsTyping(true);
      if (currentIndex < fullTitle.length) {
        setDisplayedTitle(fullTitle.substring(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeCharacter, 100);
      } else {
        setIsTyping(false);
        timeoutId = setTimeout(() => {
          currentIndex = 0;
          setDisplayedTitle("");
          typeCharacter();
        }, 30000);
      }
    };

    typeCharacter();
    return () => clearTimeout(timeoutId);
  }, [fullTitle]);

  return (
    <motion.h1 variants={variants} style={styles.title}>
      {displayedTitle}
      {isTyping && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut", repeatType: "reverse" }}
          style={{ color: COLORS.primary, marginLeft: '4px' }}
        >
          |
        </motion.span>
      )}
    </motion.h1>
  );
};

const styles = {
  title: { 
    fontSize: FONTS.sizes.h2, 
    color: COLORS.textPrimary, 
    marginBottom: '10px', 
    fontWeight: '800',
    minHeight: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default TypingTitle;