// src/components/admin/AdminLayout.jsx
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Menu, UserSquare2, Users, Video, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';
import { BORDERS, COLORS, FONTS, GLASS, SHADOWS, SPACING } from '../../theme/theme';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const SidebarContent = () => (
    <>
      <div style={styles.logoSection}>
        {isMobile && (
          <button onClick={() => setIsSidebarOpen(false)} style={styles.closeMobileBtn}>
            <X size={24} color={COLORS.textPrimary} />
          </button>
        )}
        <h2 style={styles.brandName}>Admin</h2>
        <img src={logoImg} alt="Yely" style={styles.logo} />
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          const Icon = item.icon;
          
          return (
            <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }} onClick={() => isMobile && setIsSidebarOpen(false)}>
              <motion.div 
                style={{
                  ...styles.navItem,
                  backgroundColor: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                  borderLeft: `3px solid ${isActive ? COLORS.primary : 'transparent'}`
                }}
                whileHover={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
              >
                {/* Conteneur d'icône pour assurer le centrage */}
                <div style={styles.iconContainer}>
                  <Icon size={20} color={isActive ? COLORS.primary : COLORS.textSecondary} />
                </div>
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
        <motion.button onClick={handleLogout} style={styles.logoutBtn} whileHover={{ scale: 1.02 }}>
          <div style={styles.iconContainer}>
            <LogOut size={20} color={COLORS.danger} />
          </div>
          <span style={{ ...styles.navText, color: COLORS.danger }}>Déconnexion</span>
        </motion.button>
      </div>
    </>
  );

  return (
    <div style={styles.container}>
      {!isMobile && (
        <aside style={styles.sidebar}>
          <SidebarContent />
        </aside>
      )}

      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={styles.mobileOverlay} onClick={() => setIsSidebarOpen(false)} 
            />
            <motion.aside 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={styles.mobileSidebar}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main style={{ ...styles.mainContent, marginRight: isMobile ? 0 : '280px' }}>
        <header style={styles.topbar}>
          <div style={styles.statusBadge}>System Live</div>
          <div style={styles.topbarRight}>
            <h1 style={styles.pageTitle}>Centre de Contrôle</h1>
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(true)} style={styles.hamburgerBtn}>
                <Menu size={28} color={COLORS.primary} />
              </button>
            )}
          </div>
        </header>
        
        <div style={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: COLORS.richBlack, flexDirection: 'row' },
  sidebar: {
    width: '280px', backgroundColor: COLORS.pureBlack, borderLeft: `1px solid ${COLORS.border}`,
    display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, right: 0, zIndex: 10,
  },
  mobileSidebar: {
    width: '280px', backgroundColor: COLORS.pureBlack, borderLeft: `1px solid ${COLORS.border}`,
    display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, right: 0, zIndex: 100,
  },
  mobileOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 90,
  },
  logoSection: {
    height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${SPACING.xl}px`, borderBottom: `1px solid ${COLORS.border}`,
  },
  logo: { width: '40px', height: '40px', objectFit: 'contain' },
  brandName: { color: COLORS.textPrimary, fontSize: FONTS.sizes.h3, fontWeight: 'bold' },
  closeMobileBtn: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  nav: { flex: 1, padding: `${SPACING.xl}px 0`, display: 'flex', flexDirection: 'column', gap: SPACING.xs },
  navItem: { 
    display: 'flex', 
    alignItems: 'center', 
    padding: `${SPACING.md}px ${SPACING.xl}px`, 
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  iconContainer: {
    width: '32px', // Largeur fixe pour centrer l'icône
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm
  },
  navText: { fontSize: FONTS.sizes.body },
  logoutSection: { padding: SPACING.xl, borderTop: `1px solid ${COLORS.border}` },
  logoutBtn: {
    display: 'flex', alignItems: 'center', width: '100%', padding: `${SPACING.md}px ${SPACING.lg}px`,
    backgroundColor: 'transparent', border: `1px solid ${COLORS.danger}`, borderRadius: BORDERS.radius.lg, cursor: 'pointer',
  },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', width: '100%', minWidth: 0 },
  topbar: {
    height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${SPACING.lg}px`,
    borderBottom: `1px solid ${COLORS.border}`, backgroundColor: 'rgba(10,10,10,0.8)',
    backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 5,
  },
  topbarRight: { display: 'flex', alignItems: 'center', gap: SPACING.md },
  hamburgerBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
  pageTitle: { color: COLORS.textPrimary, fontSize: FONTS.sizes.h3, fontWeight: 'bold' },
  statusBadge: { 
    fontSize: '10px', color: COLORS.primary, border: `1px solid ${COLORS.primary}`, 
    padding: '4px 12px', borderRadius: '20px', textTransform: 'uppercase', fontWeight: 'bold' 
  },
  contentArea: { flex: 1, padding: SPACING.lg, overflowX: 'hidden' }
};

export default AdminLayout;