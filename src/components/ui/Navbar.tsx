import React from 'react';
import Link from 'next/link';
import { styled } from '@/styles/stitches.config';

const NavContainer = styled('nav', {
  width: '100%',
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(18, 18, 18, 0.8)',
  borderBottom: '1px solid $border',
  position: 'sticky',
  top: 0,
  zIndex: 50,
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

const Logo = styled('div', {
  fontWeight: '$bold',
  fontSize: '$xl',
  fontFamily: '$mono',
  letterSpacing: '$tighter',
  position: 'relative',
  
  '&::after': {
    content: '',
    position: 'absolute',
    bottom: -2,
    left: 0,
    width: '40%',
    height: '2px',
    backgroundColor: '$primary',
  },
});

const NavLinks = styled('div', {
  display: 'flex',
  gap: '$6',
  
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
  color: '$gray11',
  textDecoration: 'none',
  position: 'relative',
  transition: '$fast',
  padding: '$2',
  
  '&:hover': {
    color: '$foreground',
    
    '&::after': {
      width: '100%',
    },
  },
  
  '&::after': {
    content: '',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 0,
    height: '1px',
    backgroundColor: '$primary',
    transition: 'width 0.3s ease',
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
        <Link href="/" passHref>
          <Logo>Konzernatlas</Logo>
        </Link>
        
        <NavLinks>
          <NavLink href="/">Startseite</NavLink>
          <NavLink href="/corporations">Top-Konzerne</NavLink>
          <NavLink href="/random">Zufälliger Konzern</NavLink>
          <NavLink href="/about">Info</NavLink>
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
