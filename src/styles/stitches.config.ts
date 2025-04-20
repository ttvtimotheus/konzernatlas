import { createStitches } from '@stitches/react';
import { red, amber, gray, blackA } from '@radix-ui/colors';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      // Kapitalismuskritische Farbpalette
      background: '#050505',
      foreground: '#f0f0f0',
      primary: '#ff3030', // Full Ownership - Intensives Rot
      secondary: amber.amber9, // Partial Ownership - Orange
      tertiary: gray.gray9, // Holdings - Grau
      muted: gray.gray8,
      border: gray.gray7,
      overlay: blackA.blackA9,
      
      // Radix UI Farben für Konsistenz
      ...red,
      ...amber,
      ...gray,
      ...blackA,
    },
    space: {
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
      40: '10rem',
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    },
    fonts: {
      mono: '"Space Mono", monospace',
      system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    },
    fontWeights: {
      normal: 400,
      bold: 700,
    },
    lineHeights: {
      tight: 1.1,
      normal: 1.5,
      loose: 1.8,
    },
    letterSpacings: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
    radii: {
      none: '0',
      sm: '0.125rem',
      default: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '1rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      default: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    transitions: {
      fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      normal: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    zIndices: {
      0: '0',
      10: '10',
      20: '20',
      30: '30',
      40: '40',
      50: '50',
      auto: 'auto',
    },
  },
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
    motion: '(prefers-reduced-motion: no-preference)',
    dark: '(prefers-color-scheme: dark)',
  },
  utils: {
    p: (value: any) => ({
      padding: value,
    }),
    pt: (value: any) => ({
      paddingTop: value,
    }),
    pr: (value: any) => ({
      paddingRight: value,
    }),
    pb: (value: any) => ({
      paddingBottom: value,
    }),
    pl: (value: any) => ({
      paddingLeft: value,
    }),
    px: (value: any) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: any) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    m: (value: any) => ({
      margin: value,
    }),
    mt: (value: any) => ({
      marginTop: value,
    }),
    mr: (value: any) => ({
      marginRight: value,
    }),
    mb: (value: any) => ({
      marginBottom: value,
    }),
    ml: (value: any) => ({
      marginLeft: value,
    }),
    mx: (value: any) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value: any) => ({
      marginTop: value,
      marginBottom: value,
    }),
    size: (value: any) => ({
      width: value,
      height: value,
    }),
  },
});

// Globale Styles für die Anwendung
export const globalStyles = globalCss({
  '@import': [
    "url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap')"
  ],
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },
  'html, body': {
    backgroundColor: '$background',
    color: '$foreground',
    fontFamily: '$mono',
    minHeight: '100vh',
    width: '100%',
    maxWidth: '100%',
    overflowX: 'hidden',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    // Entfernen von potenziellen weißen Rändern durch Browser-Defaults
    border: 'none',
    outline: 'none',
  },
  body: {
    lineHeight: 1.5,
    textRendering: 'optimizeSpeed',
  },
  'h1, h2, h3, h4, h5, h6': {
    fontFamily: '$mono',
    fontWeight: '$bold',
    lineHeight: '$tight',
    letterSpacing: '$tighter',
  },
  'a': {
    color: 'inherit',
    textDecoration: 'none',
  },
  'img': {
    maxWidth: '100%',
    display: 'block',
  },
  'button': {
    fontFamily: 'inherit',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  'code': {
    fontFamily: '$mono',
  },
});

// Animation-Keyframes
export const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

export const pulseNode = keyframes({
  '0%, 100%': { transform: 'scale(1)', opacity: 0.7 },
  '50%': { transform: 'scale(1.05)', opacity: 1 },
});

export const glitch = keyframes({
  '0%': { transform: 'translate(0)' },
  '20%': { transform: 'translate(-2px, 2px)' },
  '40%': { transform: 'translate(-2px, -2px)' },
  '60%': { transform: 'translate(2px, 2px)' },
  '80%': { transform: 'translate(2px, -2px)' },
  '100%': { transform: 'translate(0)' },
});

export const scanline = keyframes({
  '0%': { transform: 'translateY(0)' },
  '100%': { transform: 'translateY(100vh)' },
});

export const flicker = keyframes({
  '0%': { opacity: 1.0 },
  '4%': { opacity: 0.9 },
  '6%': { opacity: 1.0 },
  '8%': { opacity: 0.9 },
  '10%': { opacity: 1.0 },
  '72%': { opacity: 1.0 },
  '74%': { opacity: 0.9 },
  '75%': { opacity: 1.0 },
  '100%': { opacity: 1.0 },
});

// Kapitalismuskritische Komponenten-Styles
export const buttonStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: '$mono',
  fontWeight: '$bold',
  borderRadius: '3px', // Schärfere Kanten für industrielleren Look
  letterSpacing: '0.5px', // Bessere Lesbarkeit
  textTransform: 'uppercase', // Kapitalistischer Imperativ
  transition: '$fast',
  
  // Varianten
  variants: {
    variant: {
      primary: {
        backgroundColor: '#ff3030',
        color: 'white',
        border: '1px solid #ff3030',
        boxShadow: '0 3px 0 rgba(200, 0, 0, 0.5)',
        position: 'relative',
        
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 6px 0 rgba(200, 0, 0, 0.5)',
        },
        
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: '0 0 0 rgba(200, 0, 0, 0.5)',
        },
        
        // Subtiler Glitch-Effekt beim Hover
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.1)',
          opacity: 0,
          transition: 'opacity 0.2s ease-in-out',
        },
        
        '&:hover::before': {
          opacity: 0.2,
        },
      },
      secondary: {
        backgroundColor: 'transparent',
        color: '$foreground',
        border: '1px solid $foreground',
        boxShadow: '2px 2px 0 rgba(255, 255, 255, 0.1)',
        transform: 'skew(-2deg)',
        
        '&:hover': {
          transform: 'translateY(-2px) skew(-2deg)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          boxShadow: '4px 4px 0 rgba(255, 255, 255, 0.1)',
        },
      },
    },
    size: {
      sm: {
        fontSize: '$sm',
        px: '$3',
        py: '$2',
      },
      md: {
        fontSize: '$base',
        px: '$6',
        py: '$3',
      },
      lg: {
        fontSize: '$lg',
        px: '$8',
        py: '$4',
      },
    },
  },
  
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
};
