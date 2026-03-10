// src/components/admin/AdminLayout.jsx
import { motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Users, UserSquare2, Video } from 'lucide-react';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../../theme/theme';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Permet de savoir sur quelle page on est

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', name: 'Statistiques', icon: LayoutDashboard },
    { path: '/admin/contacts', name: 'Contacts & Liens', icon: Users },
    { path: '/admin/founders', name: 'Équipe', icon: UserSquare2 },
    { path: '/admin/videos', name: 'Vidéos', icon: Video },
  ];

  return (
    <div style={styles.container}>
      {/* BARRE LATÉRALE GAUCHE (FIXE) */}
      <aside style={styles.sidebar}>
        <div style={styles.logoSection}>
          <img src={logoImg} alt="Yely" style={styles.logo} />
          <h2 style={styles.brandName}>Admin</h2>
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            
            return (
              <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                <motion.div 
                  style={{
                    ...styles.navItem,
                    backgroundColor: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                    borderRight: `3px solid ${isActive ? COLORS.primary : 'transparent'}`
                  }}
                  whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon size={20} color={isActive ? COLORS.primary : COLORS.textSecondary} />
                  <span style={{
                    ...styles.navText,
                    color: isActive ? COLORS.primary : COLORS.textSecondary,
                    fontWeight: isActive ? 'bold' : 'normal'
                  }}>
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div style={styles.logoutSection}>
          <motion.button 
            onClick={handleLogout} 
            style={styles.logoutBtn}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(192, 57, 43, 0.15)' }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={20} color={COLORS.danger} />
            <span style={{ ...styles.navText, color: COLORS.danger }}>Déconnexion</span>
          </motion.button>
        </div>
      </aside>

      {/* ZONE DE CONTENU PRINCIPALE (DYNAMIQUE) */}
      <main style={styles.mainContent}>
        <div style={styles.topbar}>
          <h1 style={styles.pageTitle}>Centre de Contrôle</h1>
        </div>
        <div style={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex', minHeight: '100vh', backgroundColor: COLORS.richBlack,
  },
  sidebar: {
    width: '280px', backgroundColor: COLORS.pureBlack, borderRight: `1px solid ${COLORS.border}`,
    display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 10,
  },
  logoSection: {
    height: '100px', display: 'flex', alignItems: 'center', padding: `0 ${SPACING.xl}px`, borderBottom: `1px solid ${COLORS.border}`,
  },
  logo: { width: '45px', height: '45px', objectFit: 'contain', marginRight: SPACING.md },
  brandName: { color: COLORS.textPrimary, fontSize: FONTS.sizes.h3, fontWeight: 'bold', letterSpacing: '1px' },
  nav: { flex: 1, padding: `${SPACING.xl}px 0`, display: 'flex', flexDirection: 'column', gap: SPACING.xs },
  navItem: {
    display: 'flex', alignItems: 'center', padding: `${SPACING.md}px ${SPACING.xl}px`, cursor: 'pointer', transition: 'all 0.3s ease',
  },
  navText: { fontSize: FONTS.sizes.body, marginLeft: SPACING.md },
  logoutSection: { padding: SPACING.xl, borderTop: `1px solid ${COLORS.border}` },
  logoutBtn: {
    display: 'flex', alignItems: 'center', width: '100%', padding: `${SPACING.md}px ${SPACING.lg}px`,
    backgroundColor: 'transparent', border: `1px solid ${COLORS.danger}`, borderRadius: BORDERS.radius.lg, cursor: 'pointer',
  },
  mainContent: {
    flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column',
  },
  topbar: {
    height: '80px', display: 'flex', alignItems: 'center', padding: `0 ${SPACING.xxl}px`,
    borderBottom: `1px solid ${COLORS.border}`, backgroundColor: 'rgba(10,10,10,0.8)',
    backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 5,
  },
  pageTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.h2, fontWeight: 'bold' },
  contentArea: { flex: 1, padding: SPACING.xxl, overflowY: 'auto' }
};

export default AdminLayout;