// src/components/Layout.jsx
import React, { useState } from 'react';
import { COLORS } from '../theme/theme';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div style={styles.wrapper}>
      <Header toggleSidebar={toggleSidebar} />
      
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {isSidebarOpen && (
        <div style={styles.overlay} onClick={closeSidebar} />
      )}

      <main style={{
        ...styles.mainContent,
        filter: isSidebarOpen ? 'blur(8px)' : 'none',
        transition: 'filter 0.3s ease-in-out',
      }}>
        {children}
      </main>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: COLORS.background,
    position: 'relative',
    overflowX: 'hidden',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 45,
  },
  mainContent: {
    paddingTop: '70px',
    minHeight: 'calc(100vh - 70px)',
  }
};

export default Layout;