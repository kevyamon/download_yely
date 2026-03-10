// src/theme/theme.js
// LE COEUR DE L'IDENTITÉ VISUELLE - YÉLY REBRANDING (OR / BLANC / NOIR)
// Version WEB (Traduite et optimisée depuis React Native)

// ═══════════════════════════════════════════════════════════════
// DÉTECTION DU MODE SYSTÈME ET DIMENSIONS SÉCURISÉES POUR LE WEB
// ═══════════════════════════════════════════════════════════════
const isBrowser = typeof window !== 'undefined';
const SCREEN_WIDTH = isBrowser ? window.innerWidth : 1200;
const SCREEN_HEIGHT = isBrowser ? window.innerHeight : 800;

const isDark = isBrowser 
  ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
  : false; // Par défaut clair si non détecté

// ═══════════════════════════════════════════════════════════════
// 1. PALETTE PRIMITIVE (Les ingrédients bruts)
// ═══════════════════════════════════════════════════════════════
const PALETTE = {
  gold: '#D4AF37',       // Vrai Or Classique
  goldLight: '#F3E5AB',  // Or Pâle (Champagne)
  goldDark: '#AA8C2C',   // Or Vieilli (Ombres)
  
  pureWhite: '#FFFFFF',
  offWhite: '#F8F9FA',   // Blanc cassé (Anti-éblouissement)
  softGray: '#E9ECEF',   // Gris très léger pour les séparateurs

  pureBlack: '#000000',
  richBlack: '#0A0A0A',  // Noir Premium (Pas gris, juste profond)
  charcoal: '#121212',   // Surface sombre standard

  success: '#27AE60',    // Vert Émeraude (Plus classe que le vert néon)
  danger: '#C0392B',     // Rouge Rubis (Plus profond)
  warning: '#F39C12',
  info: '#2980B9',
};

// ═══════════════════════════════════════════════════════════════
// 2. COULEURS SÉMANTIQUES (L'adaptation Jour/Nuit)
// ═══════════════════════════════════════════════════════════════
const COLORS = {
  background: isDark ? PALETTE.pureBlack : PALETTE.offWhite,
  
  primary: PALETTE.gold,
  primaryLight: PALETTE.goldLight,
  primaryDark: PALETTE.goldDark,

  secondary: isDark ? PALETTE.pureWhite : PALETTE.pureBlack,

  textPrimary: isDark ? '#F8F9FA' : '#1A1A1A',
  textSecondary: isDark ? 'rgba(248, 249, 250, 0.70)' : 'rgba(26, 26, 26, 0.70)', 
  textTertiary: isDark ? 'rgba(248, 249, 250, 0.45)' : 'rgba(26, 26, 26, 0.45)',
  textInverse: isDark ? '#1A1A1A' : '#FFFFFF', 

  glassSurface: isDark ? 'rgba(18, 18, 18, 0.85)' : 'rgba(255, 255, 255, 0.85)',
  glassModal: isDark ? 'rgba(10, 10, 10, 0.95)' : 'rgba(255, 255, 255, 0.95)',
  
  border: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.15)',
  borderActive: PALETTE.gold,

  success: PALETTE.success,
  danger: PALETTE.danger,
  warning: PALETTE.warning,
  info: PALETTE.info,
  
  transparent: 'transparent',
  overlay: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  shadow: isDark ? '#000000' : '#888888', 
};

// COMPATIBILITÉ RÉTROACTIVE
COLORS.deepAsphalt = COLORS.background; 
COLORS.champagneGold = COLORS.primary;
COLORS.moonlightWhite = COLORS.textPrimary;
COLORS.glassDark = COLORS.glassSurface;
COLORS.glassMedium = COLORS.glassSurface;
COLORS.glassLight = COLORS.glassSurface;
COLORS.glassUltraLight = COLORS.glassSurface;
COLORS.glassBorder = COLORS.border;
COLORS.glassBorderActive = COLORS.borderActive;
COLORS.textDisabled = 'rgba(128, 128, 128, 0.5)';
COLORS.overlayDark = 'rgba(0, 0, 0, 0.60)';
COLORS.overlayMedium = 'rgba(0, 0, 0, 0.40)';

// ═══════════════════════════════════════════════════════════════
// 3. TYPOGRAPHIE (Adaptée aux polices système Web)
// ═══════════════════════════════════════════════════════════════
const FONTS = {
  family: {
    bold: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    semiBold: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    medium: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    regular: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    light: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  sizes: {
    hero: 34, h1: 28, h2: 24, h3: 20, h4: 18,
    body: 16, bodySmall: 14, caption: 12, micro: 10,
  },
  weights: {
    bold: '700', semiBold: '600', medium: '500', regular: '400', light: '300',
  },
  lineHeights: {
    tight: 1.2, normal: 1.5, relaxed: 1.8,
  },
};

// ═══════════════════════════════════════════════════════════════
// 4. ESPACEMENTS & BORDURES
// ═══════════════════════════════════════════════════════════════
const SPACING = {
  xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 40, massive: 48, giant: 64,
};

const BORDERS = {
  radius: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, pill: 9999, circle: '50%',
  },
  width: {
    thin: 1, normal: 1, medium: 2, thick: 3,
  },
};

// ═══════════════════════════════════════════════════════════════
// 5. OMBRES (Traduites en CSS boxShadow)
// ═══════════════════════════════════════════════════════════════
const SHADOWS = {
  none: { boxShadow: 'none' },
  soft: {
    boxShadow: isDark 
      ? '0px 2px 4px rgba(0, 0, 0, 0.3)' 
      : '0px 2px 4px rgba(136, 136, 136, 0.08)'
  },
  medium: {
    boxShadow: isDark 
      ? '0px 4px 8px rgba(0, 0, 0, 0.4)' 
      : '0px 4px 8px rgba(136, 136, 136, 0.12)'
  },
  strong: {
    boxShadow: isDark 
      ? '0px 8px 16px rgba(0, 0, 0, 0.45)' 
      : '0px 8px 16px rgba(136, 136, 136, 0.20)'
  },
  gold: {
    boxShadow: '0px 4px 12px rgba(212, 175, 55, 0.30)'
  },
  goldSoft: {
    boxShadow: '0px 2px 8px rgba(212, 175, 55, 0.15)'
  },
};

// ═══════════════════════════════════════════════════════════════
// 6. ANIMATIONS ET ICÔNES
// ═══════════════════════════════════════════════════════════════
const ANIMATIONS = {
  duration: { instant: 100, fast: 200, normal: 300, slow: 450, verySlow: 600, dramatic: 800 },
  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', // Transition standard Web
};

const ICONS = {
  sizes: { xs: 16, sm: 20, md: 24, lg: 28, xl: 32, xxl: 40, hero: 64 },
  colors: {
    default: COLORS.textSecondary,
    active: COLORS.primary,
    inactive: COLORS.textTertiary,
  },
};

// ═══════════════════════════════════════════════════════════════
// 7. STYLES GLASSMORPHISM (ADAPTATIF WEB AVEC BACKDROP-FILTER)
// ═══════════════════════════════════════════════════════════════
const GLASS = {
  card: {
    backgroundColor: COLORS.glassSurface,
    borderRadius: BORDERS.radius.xl,
    borderWidth: BORDERS.width.thin,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    overflow: 'hidden',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)', // Safari support
  },
  surface: {
    backgroundColor: COLORS.glassSurface,
    borderWidth: BORDERS.width.thin,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  subtle: {
    backgroundColor: COLORS.glassSurface,
    borderRadius: BORDERS.radius.lg,
    borderWidth: BORDERS.width.thin,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
  },
  goldHighlight: {
    backgroundColor: 'rgba(212, 175, 55, 0.08)',
    borderRadius: BORDERS.radius.xl,
    borderWidth: BORDERS.width.thin,
    borderStyle: 'solid',
    borderColor: COLORS.borderActive,
  },
};

// ═══════════════════════════════════════════════════════════════
// 8. LAYOUT & DIMENSIONS
// ═══════════════════════════════════════════════════════════════
const DIMENSIONS = {
  screen: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  sidebar: { width: SCREEN_WIDTH * 0.78, maxWidth: 320 },
  header: { height: 72, paddingTop: 24 },
  button: { height: 52, heightSmall: 40, heightLarge: 58 },
  input: { height: 52 },
  forfaitCard: { width: 280, height: 160 }, // Valeurs fixes préférables sur le web
  badge: { size: 20, sizeLarge: 28 },
};

const LAYOUT = {
  window: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  isSmallDevice: SCREEN_WIDTH < 375,
  spacing: SPACING,
  radius: BORDERS.radius,
  HEADER_HEIGHT: 60,
  HEADER_MAX_HEIGHT: 180,
};

// ═══════════════════════════════════════════════════════════════
// 9. STYLES DE COMPOSANTS UNIFIÉS (Adaptés React DOM)
// ═══════════════════════════════════════════════════════════════
const COMPONENT_STYLES = {
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDERS.radius.pill,
    height: DIMENSIONS.button.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `0 ${SPACING.xxl}px`,
    ...SHADOWS.gold,
    cursor: 'pointer',
    border: 'none',
  },
  buttonPrimaryText: {
    color: COLORS.textInverse,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.bold,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderRadius: BORDERS.radius.pill,
    height: DIMENSIONS.button.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `0 ${SPACING.xxl}px`,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: COLORS.textPrimary,
    cursor: 'pointer',
  },
  buttonSecondaryText: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.semiBold,
  },
  buttonDanger: {
    backgroundColor: COLORS.danger,
    borderRadius: BORDERS.radius.pill,
    height: DIMENSIONS.button.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `0 ${SPACING.xxl}px`,
    cursor: 'pointer',
    border: 'none',
  },
  buttonDangerText: {
    color: '#FFFFFF',
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.bold,
  },
  inputField: {
    height: DIMENSIONS.input.height,
    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
    borderRadius: BORDERS.radius.lg,
    borderWidth: BORDERS.width.thin,
    borderStyle: 'solid',
    borderColor: COLORS.border,
    padding: `0 ${SPACING.lg}px`,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.body,
    outline: 'none',
  },
  sectionContainer: {
    padding: `${SPACING.lg}px ${SPACING.xl}px`,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    margin: `${SPACING.md}px 0`,
  },
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: COLORS.background,
  },
};

// ═══════════════════════════════════════════════════════════════
// 10. THÈME PAPER (Désactivé pour le web pur, renvoie un objet vide pour compatibilité)
// ═══════════════════════════════════════════════════════════════
const YelyTheme = {
  colors: {
    primary: COLORS.primary,
    background: COLORS.background,
    surface: COLORS.glassSurface,
    error: COLORS.danger,
    textSecondary: COLORS.textSecondary,
    success: COLORS.success,
  },
};

// ═══════════════════════════════════════════════════════════════
// EXPORT UNIFIÉ & SÉCURISÉ
// ═══════════════════════════════════════════════════════════════
const THEME = {
  COLORS,
  FONTS,
  SPACING,
  BORDERS,
  SHADOWS,
  ANIMATIONS,
  GLASS,
  DIMENSIONS,
  LAYOUT,
  COMPONENT_STYLES,
  ICONS,
};

export {
  ANIMATIONS,
  BORDERS,
  COLORS,
  COMPONENT_STYLES,
  DIMENSIONS,
  FONTS,
  GLASS,
  ICONS,
  LAYOUT,
  SHADOWS,
  SPACING,
  YelyTheme
};

export default THEME;