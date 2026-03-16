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

  useEffect(() => {
    const fetchAppLinks = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/config`);
        if (res.data) {
          setAppConfig(res.data);
        }
      } catch (error) {
        console.error("Impossible de charger la configuration systeme:", error);
      }
    };
    fetchAppLinks();
  }, []);

  const handleAndroidDownload = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/stats/android`);
      const apkUrl = appConfig.apkUrl;
      if (apkUrl && apkUrl.startsWith('http')) {
        window.location.href = apkUrl;
      } else {
        showToast("La mise a jour des serveurs est en cours.", "info");
      }
    } catch (err) {
      showToast("Erreur de connexion au serveur.", "error");
    }
  };

  const handleIosInstall = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/stats/ios`);
      const pwaUrl = appConfig.pwaUrl;
      if (pwaUrl && pwaUrl.startsWith('http')) {
        window.location.href = pwaUrl;
      } else {
        showToast("La configuration PWA est en cours.", "info");
      }
    } catch (err) {
      showToast("Erreur de connexion au serveur.", "error");
    }
  };

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

  const viewStyle = { 
    display: 'flex', 
    flexDirection: 'column', 
    flex: 1, 
    minHeight: '100%', 
    width: '100%'
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
            style={viewStyle}
          >
            <Hero onAndroidClick={handleAndroidDownload} onIosClick={handleIosInstall} />
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
            style={viewStyle}
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
            style={viewStyle}
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
            style={viewStyle}
          >
            <VideosView onBack={() => setCurrentView(VIEWS.HOME)} />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default LandingPage;