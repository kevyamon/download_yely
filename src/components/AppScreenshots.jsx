// src/components/AppScreenshots.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { COLORS, BORDERS, GLASS } from '../theme/theme';

// Tu pourras remplacer ces liens par tes vrais liens Cloudinary
const SCREENSHOTS = [
  "https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604249/photo_9_2026-03-15_19-47-52_luvzjn.jpg",
 "https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604248/photo_8_2026-03-15_19-47-52_crtazk.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604238/photo_7_2026-03-15_19-47-52_jeqoir.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604238/photo_5_2026-03-15_19-47-52_p5unxn.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604238/photo_6_2026-03-15_19-47-52_he3bap.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604237/photo_4_2026-03-15_19-47-52_edgpmg.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604202/photo_16_2026-03-15_19-47-52_hia1fy.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604202/photo_15_2026-03-15_19-47-52_ts6xde.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604202/photo_1_2026-03-15_19-47-52_addjwk.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604201/photo_11_2026-03-15_19-47-52_y6bkml.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604202/photo_3_2026-03-15_19-47-52_h9tlla.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604202/photo_2_2026-03-15_19-47-52_ztbjtt.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604202/photo_14_2026-03-15_19-47-52_i8mvyn.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604202/photo_1_2026-03-15_19-47-52_addjwk.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604201/photo_13_2026-03-15_19-47-52_rn3xoy.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604201/photo_10_2026-03-15_19-47-52_uz1ef3.jpg",
"https://res.cloudinary.com/dcrdkr4nw/image/upload/v1773604201/photo_12_2026-03-15_19-47-52_cip071.jpg"
];

const AppScreenshots = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  // Animation qui simule le défilement continu
  const marqueeVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.carouselWrapper}>
        <motion.div
          style={styles.carouselTrack}
          variants={marqueeVariants}
          animate="animate"
          // Pause l'animation quand on survole avec la souris
          whileHover={{ animationPlayState: "paused" }} 
        >
          {/* On double la liste pour créer l'effet infini */}
          {[...SCREENSHOTS, ...SCREENSHOTS].map((src, index) => (
            <motion.div 
              key={index} 
              style={styles.imageCard}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedImg(src)}
            >
              <img src={src} alt={`Capture Yely ${index}`} style={styles.image} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            style={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
          >
            <motion.div 
              style={styles.modalContent}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button style={styles.closeBtn} onClick={() => setSelectedImg(null)}>
                <X size={24} color={COLORS.textInverse} />
              </button>
              <img src={selectedImg} alt="Vue en grand" style={styles.modalImage} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    overflow: 'hidden',
    margin: '30px 0',
    display: 'flex',
    justifyContent: 'center'
  },
  carouselWrapper: {
    width: '100%',
    maxWidth: '600px',
    overflow: 'hidden',
    position: 'relative',
    // Masques dégradés sur les côtés pour faire fondre les images
    WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
    maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
  },
  carouselTrack: {
    display: 'flex',
    gap: '15px',
    width: 'max-content',
    cursor: 'grab'
  },
  imageCard: {
    width: '120px',
    height: '240px',
    borderRadius: BORDERS.radius.lg,
    overflow: 'hidden',
    border: `2px solid ${COLORS.primary}`,
    boxShadow: `0 4px 10px rgba(0,0,0,0.3)`,
    flexShrink: 0,
    cursor: 'pointer'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  },
  modalContent: {
    position: 'relative',
    maxWidth: '90%',
    maxHeight: '90vh',
    borderRadius: BORDERS.radius.xl,
    overflow: 'hidden',
    border: `1px solid ${COLORS.primary}`
  },
  modalImage: {
    width: '100%',
    height: '100%',
    maxHeight: '85vh',
    objectFit: 'contain'
  },
  closeBtn: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    backgroundColor: COLORS.danger,
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 10
  }
};

export default AppScreenshots;