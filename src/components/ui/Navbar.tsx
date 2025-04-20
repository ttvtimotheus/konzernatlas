import React from 'react';
import Link from 'next/link';
import { styled } from '@/styles/stitches.config';

const NavContainer = styled('nav', {
  width: '100%',
  backdropFilter: 'blur(12px)',
  backgroundColor: 'rgba(5, 5, 5, 0.95)',
  borderBottom: '1px solid rgba(255, 48, 48, 0.15)', // Subtile rote Linie
  position: 'sticky',
  top: 0,
  zIndex: 50,
  boxShadow: '0 1px 15px rgba(0, 0, 0, 0.5)', // Leichter Schatten für Tiefe
  padding: '0.75rem 0',
  
  // Überschreiben der standard-Link-Farben in allen Zuständen
  'a': {
    color: 'rgba(255, 255, 255, 0.7) !important',
    textDecoration: 'none !important',
  },
  'a:visited': {
    color: 'rgba(255, 255, 255, 0.7) !important',
  },
  'a:hover': {
    color: '#ffffff !important',
  },
  'a:active': {
    color: '#ffffff !important',
  },
});

const NavInner = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '$4',
  maxWidth: '1200px',
  margin: '0 auto',
  
  '@md': {
    padding: '$4 $6',
  },
});

const Logo = styled('span', {
  fontWeight: '$bold',
  fontSize: '$xl',
  fontFamily: '$mono',
  letterSpacing: '$tighter',
  position: 'relative',
  color: '#ffffff',
  textTransform: 'uppercase',
  transition: 'all 0.3s ease',
  display: 'inline-block',
  cursor: 'pointer',
  
  '&:hover': {
    textShadow: '0 0 5px rgba(255, 48, 48, 0.8)', // Rotes Glühen bei Hover
  },
  
  '&::after': {
    content: '',
    position: 'absolute',
    bottom: -2,
    left: 0,
    width: '50%',
    height: '2px',
    background: 'linear-gradient(90deg, #ff3030, transparent)', // Gradient statt solide
  },
});

const NavLinks = styled('div', {
  display: 'flex',
  gap: '$6',
  alignItems: 'center',
  
  '@media (max-width: 640px)': {
    display: 'none',
  },
});

const MobileMenuButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  background: 'transparent',
  color: '$foreground',
  padding: '$2',
  cursor: 'pointer',
  
  '@md': {
    display: 'none',
  },
});

const NavLink = styled(Link, {
  position: 'relative',
  transition: 'all 0.2s ease-out',
  margin: '0 0.5rem',
  fontFamily: '$mono',
  fontSize: '0.9rem',
  letterSpacing: '0.5px',
  display: 'inline-block',
  
  'a': {
    color: 'rgba(255, 255, 255, 0.7) !important', // Wichtig, um die Browserstandards zu überschreiben
    textDecoration: 'none !important',
    display: 'inline-block',
    position: 'relative',
    padding: '0.5rem 0',
    
    '&:hover': {
      color: '#ffffff !important',
      transform: 'translateY(-2px)',
    }
  },
  
  '&:hover a': {
    color: '#ffffff !important',
  },
  
  '&:hover': {
    '&::after': {
      width: '100%',
      opacity: 0.8,
    },
  },
  
  '&::after': {
    content: '',
    position: 'absolute',
    bottom: -2,
    left: 0,
    width: 0,
    height: '2px',
    backgroundColor: '#ff3030',
    transition: 'width 0.3s ease, opacity 0.3s ease',
    opacity: 0.5,
  },
  
  variants: {
    active: {
      true: {
        color: '$foreground',
        
        '&::after': {
          width: '100%',
        },
      },
    },
  },
});

export const Navbar = () => {
  return (
    <NavContainer>
      <NavInner>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" passHref legacyBehavior>
            <a style={{ textDecoration: 'none' }}>
              <Logo>
                <span style={{ 
                  display: 'inline-block', 
                  position: 'relative',
                  color: '#ffffff'
                }}>
                  Konzern
                </span>
                <span style={{ color: '#ff3030', marginLeft: '3px' }}>atlas</span>
              </Logo>
            </a>
          </Link>
        </div>
        
        <NavLinks>
          <NavLink href="/" legacyBehavior>
            <a style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '0 1rem' }}>Startseite</a>
          </NavLink>
          <NavLink href="/corporations" legacyBehavior>
            <a style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '0 1rem' }}>Top-Konzerne</a>
          </NavLink>
          <NavLink href="/random" legacyBehavior>
            <a style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '0 1rem' }}>Zufälliger Konzern</a>
          </NavLink>
          <NavLink href="/about" legacyBehavior>
            <a style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', padding: '0 1rem' }}>Info</a>
          </NavLink>
        </NavLinks>
        
        <MobileMenuButton aria-label="Menü öffnen">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </MobileMenuButton>
      </NavInner>
    </NavContainer>
  );
};

export default Navbar;
