// src/pages/LandingPage.jsx
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
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
  const [appConfig, setAppConfig] = useState({ apkUrl: '', pwaUrl: '' });
  const { showToast } = useToast();

  // 1. RÉCUPÉRATION DES LIENS DYNAMIQUES DEPUIS LA BASE DE DONNÉES
  useEffect(() => {
    const fetchAppLinks = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/config`);
        if (res.data) {
          setAppConfig(res.data);
        }
      } catch (error) {
        console.error("Impossible de charger la configuration système:", error);
      }
    };
    fetchAppLinks();
  }, []);

  // 2. LOGIQUE DE TÉLÉCHARGEMENT ANDROID
  const handleAndroidDownload = async () => {
    try {
      // On compte le clic en BDD pour tes stats
      await axios.post(`${import.meta.env.VITE_API_URL}/stats/android`);
      
      // On utilise le lien dynamique ! Fini le .env !
      const apkUrl = appConfig.apkUrl;
      
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

  // 3. LOGIQUE INSTALLATION IPHONE
  const handleIosInstall = async () => {
    try {
      // On compte le clic iOS
      await axios.post(`${import.meta.env.VITE_API_URL}/stats/ios`);
      
      // On utilise le lien PWA dynamique
      const pwaUrl = appConfig.pwaUrl;
      
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
    <Layout onNavigate={setCurrentView} currentView={currentView}>
      
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