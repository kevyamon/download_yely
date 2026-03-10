// src/pages/LandingPage.jsx
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import ContactsView from '../components/ContactsView';
import FoundersView from '../components/FoundersView';
import Hero from '../components/Hero';
import Layout from '../components/Layout';
import VideosView from '../components/VideosView';
import { useToast } from '../context/ToastContext';

// Constantes pour la navigation
const VIEWS = {
  HOME: 'HOME',
  CONTACTS: 'CONTACTS',
  VIDEOS: 'VIDEOS',
  FOUNDERS: 'FOUNDERS'
};

const LandingPage = () => {
  const [currentView, setCurrentView] = useState(VIEWS.HOME);
  const { showToast } = useToast();

  // LOGIQUE DE TELECHARGEMENT ANDROID
  const handleAndroidDownload = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/stats/android`);
      
      const apkUrl = import.meta.env.VITE_APK_URL;
      if (apkUrl && apkUrl.startsWith('http')) {
        window.location.href = apkUrl;
      } else {
        showToast("La mise à jour des serveurs est en cours. Le lien sera disponible dans quelques minutes !", "info");
      }
    } catch (err) {
      console.error("Erreur download:", err);
      showToast("Erreur de connexion au serveur.", "error");
    }
  };

  // LOGIQUE INSTALLATION IPHONE
  const handleIosInstall = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/stats/ios`);
      
      const pwaUrl = import.meta.env.VITE_PWA_URL;
      if (pwaUrl && pwaUrl.startsWith('http')) {
        window.location.href = pwaUrl;
      } else {
        showToast("Le tutoriel d'installation iPhone arrive bientôt !", "info");
      }
    } catch (err) {
      console.error("Erreur click iOS:", err);
      showToast("Erreur de connexion au serveur.", "error");
    }
  };

  // Variants pour l'animation de transition entre les pages
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3
  };

  return (
    // On passe setCurrentView au Layout (qui le passera au Header et au Sidebar)
    <Layout onNavigate={setCurrentView}>
      
      {/* AnimatePresence permet d'animer la sortie d'un composant avant l'entrée du nouveau */}
      <AnimatePresence mode="wait">
        
        {currentView === VIEWS.HOME && (
          <motion.div
            key="home"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Hero 
              onAndroidClick={handleAndroidDownload} 
              onIosClick={handleIosInstall} 
            />
          </motion.div>
        )}

        {currentView === VIEWS.CONTACTS && (
          <motion.div
            key="contacts"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ContactsView onBack={() => setCurrentView(VIEWS.HOME)} />
          </motion.div>
        )}

        {currentView === VIEWS.FOUNDERS && (
          <motion.div
            key="founders"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <FoundersView onBack={() => setCurrentView(VIEWS.HOME)} />
          </motion.div>
        )}

        {currentView === VIEWS.VIDEOS && (
          <motion.div
            key="videos"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <VideosView onBack={() => setCurrentView(VIEWS.HOME)} />
          </motion.div>
        )}

      </AnimatePresence>
    </Layout>
  );
};

export default LandingPage;