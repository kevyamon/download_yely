// src/pages/LandingPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import ContactsView from '../components/ContactsView';

const VIEWS = {
  HOME: 'HOME',
  CONTACTS: 'CONTACTS',
  ABOUT: 'ABOUT',
  FOUNDERS: 'FOUNDERS'
};

const LandingPage = () => {
  const [currentView, setCurrentView] = useState(VIEWS.HOME);

  // LOGIQUE DE TELECHARGEMENT ANDROID
  const handleAndroidDownload = async () => {
    try {
      // 1. On previent le backend pour le compteur
      await axios.post(`${import.meta.env.VITE_API_URL}/stats/android`);
      
      // 2. On lance le telechargement de l'APK 
      // Remplace par ton lien reel plus tard
      window.location.href = "https://ton-stockage-cloud.com/yely.apk"; 
    } catch (err) {
      console.error("Erreur download:", err);
    }
  };

  // LOGIQUE INSTALLATION IPHONE
  const handleIosInstall = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/stats/ios`);
      // Ici on ouvrira ton tuto PWA a la Vague 3
      alert("Le tutoriel d'installation iPhone arrive bientot !");
    } catch (err) {
      console.error("Erreur click iOS:", err);
    }
  };

  return (
    <Layout onNavigate={(view) => setCurrentView(view)}>
      {currentView === VIEWS.HOME && (
        <Hero 
          onAndroidClick={handleAndroidDownload} 
          onIosClick={handleIosInstall} 
        />
      )}

      {currentView === VIEWS.CONTACTS && (
        <ContactsView onBack={() => setCurrentView(VIEWS.HOME)} />
      )}

      {/* Les autres vues (About, Founders) seront ajoutees ensuite */}
    </Layout>
  );
};

export default LandingPage;