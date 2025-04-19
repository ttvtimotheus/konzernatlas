"use client";

import React from 'react';
import Link from 'next/link';
import { styled, keyframes } from '@/styles/stitches.config';
import { TOP_CORPORATIONS, CRITIQUE_MESSAGES } from '@/data/topCorporations';

// Animationen
const fadeInUp = keyframes({
  '0%': { opacity: 0, transform: 'translateY(20px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const staggeredAppear = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.9)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

const floatAnimation = keyframes({
  '0%': { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-5px)' },
  '100%': { transform: 'translateY(0)' },
});

// Styled Components
const PageContainer = styled('div', {
  position: 'relative',
  minHeight: '100vh',
  paddingBottom: '$16',
});

const ContentContainer = styled('div', {
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '$4',
  paddingTop: '$8',
  paddingBottom: '$16',
  
  '@md': {
    padding: '$6',
    paddingTop: '$10',
  },
});

const BackLink = styled(Link, {
  display: 'inline-flex',
  alignItems: 'center',
  color: '$gray11',
  fontSize: '$sm',
  marginBottom: '$8',
  transition: '$fast',
  
  '&:hover': {
    color: '$foreground',
    transform: 'translateX(-3px)',
  },
  
  '& svg': {
    marginRight: '$2',
  },
});

const HeaderSection = styled('div', {
  marginBottom: '$12',
  textAlign: 'center',
  animation: `${fadeInUp} 0.6s ease-out forwards`,
});

const PageTitle = styled('h1', {
  fontSize: '$4xl',
  fontWeight: '$bold',
  lineHeight: '$tight',
  marginBottom: '$4',
  fontFamily: '$mono',
  letterSpacing: '$tighter',
  
  '@md': {
    fontSize: '$5xl',
  },
});

const PageDescription = styled('p', {
  fontSize: '$lg',
  lineHeight: '$normal',
  maxWidth: '42rem',
  margin: '0 auto',
  marginBottom: '$6',
  color: '$gray12',
  
  '@md': {
    fontSize: '$xl',
  },
});

const QuoteBox = styled('div', {
  borderLeft: '4px solid $primary',
  padding: '$4',
  marginTop: '$4',
  maxWidth: '42rem',
  margin: '0 auto',
  fontStyle: 'italic',
  fontSize: '$sm',
  color: '$gray10',
});

const GridContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '$6',
  marginTop: '$8',
});

const CorporationCard = styled('a', {
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '$tertiary',
  borderRadius: '$md',
  overflow: 'hidden',
  padding: '$6',
  transition: '$normal',
  position: 'relative',
  textDecoration: 'none',
  border: '1px solid $gray8',
  height: '100%',
  animation: `${staggeredAppear} 0.5s ease-out forwards`,
  opacity: 0,
  
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    borderColor: '$gray7',
    
    '& .icon': {
      animation: `${floatAnimation} 2s ease-in-out infinite`,
    },
  },
  
  '&:before': {
    content: '',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, $primary, $secondary)',
    opacity: 0.7,
  },
});

const CardTop = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '$4',
});

const CardIcon = styled('div', {
  fontSize: '2.5rem',
  lineHeight: 1,
});

const CardCategory = styled('span', {
  fontSize: '$xs',
  color: '$gray10',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const CardTitle = styled('h3', {
  fontSize: '$2xl',
  fontWeight: '$bold',
  marginBottom: '$2',
  lineHeight: '$tight',
  color: '$foreground',
});

const CardDescription = styled('p', {
  fontSize: '$sm',
  color: '$gray11',
  marginBottom: '$4',
  lineHeight: '$normal',
  flex: 1,
});

const FooterNote = styled('div', {
  textAlign: 'center',
  padding: '$6',
  fontSize: '$sm',
  color: '$gray9',
  fontStyle: 'italic',
  maxWidth: '800px',
  margin: '0 auto',
  marginTop: '$12',
  borderTop: '1px solid $gray8',
  animation: `${fadeInUp} 0.8s ease-out forwards`,
  animationDelay: '0.5s',
  opacity: 0,
});

export default function CorporationsPage() {
  // Zufällige kapitalismuskritische Nachricht für die Seite
  const randomIndex = Math.floor(Math.random() * CRITIQUE_MESSAGES.length);
  const randomMessage = CRITIQUE_MESSAGES[randomIndex];
  
  return (
    <PageContainer>
      {/* Animierter Hintergrund */}
      <div className="glitch-background" aria-hidden="true"></div>
      
      <ContentContainer>
        <BackLink href="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Zurück zur Startseite
        </BackLink>
        
        <HeaderSection>
          <PageTitle>Die globalen Machtzentren</PageTitle>
          <PageDescription>
            Konzerne prägen unser Leben, beeinflussen Politik und kontrollieren ganze Märkte. 
            Wähle einen Konzern, um dessen Netzwerk zu enthüllen.
          </PageDescription>
          <QuoteBox>
            {randomMessage}
          </QuoteBox>
        </HeaderSection>
        
        <GridContainer>
          {TOP_CORPORATIONS.map((corporation, index) => (
            <CorporationCard 
              key={corporation.id} 
              href={`/graph/${corporation.id}`}
              css={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <CardTop>
                <CardCategory>{corporation.category}</CardCategory>
                <CardIcon className="icon">{corporation.icon}</CardIcon>
              </CardTop>
              <CardTitle>{corporation.label}</CardTitle>
              <CardDescription>{corporation.description}</CardDescription>
            </CorporationCard>
          ))}
        </GridContainer>
      </ContentContainer>
      
      <FooterNote>
        Dieses Projekt visualisiert nur die offiziellen Verbindungen. Die inoffiziellen Netzwerke aus Lobbyismus, 
        politischen Abhängigkeiten und Kartellbildung bleiben weitgehend unsichtbar.
      </FooterNote>
    </PageContainer>
  );
}
