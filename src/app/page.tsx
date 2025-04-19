"use client";

import React from 'react';
import Link from 'next/link';
import { styled, keyframes, fadeIn, pulseNode } from '@/styles/stitches.config';
import Button from '@/components/ui/Button';

// Animationen für die Homepage
const glitchText = keyframes({
  '0%': { textShadow: '0.05em 0 0 rgba(255,59,48,0.75), -0.05em -0.025em 0 rgba(255,149,0,0.75)' },
  '14%': { textShadow: '0.05em 0 0 rgba(255,59,48,0.75), -0.05em -0.025em 0 rgba(255,149,0,0.75)' },
  '15%': { textShadow: '-0.05em -0.025em 0 rgba(255,59,48,0.75), 0.025em 0.025em 0 rgba(255,149,0,0.75)' },
  '49%': { textShadow: '-0.05em -0.025em 0 rgba(255,59,48,0.75), 0.025em 0.025em 0 rgba(255,149,0,0.75)' },
  '50%': { textShadow: '0.025em 0.05em 0 rgba(255,59,48,0.75), 0.05em 0 0 rgba(255,149,0,0.75)' },
  '99%': { textShadow: '0.025em 0.05em 0 rgba(255,59,48,0.75), 0.05em 0 0 rgba(255,149,0,0.75)' },
  '100%': { textShadow: '-0.025em 0 0 rgba(255,59,48,0.75), -0.025em -0.025em 0 rgba(255,149,0,0.75)' },
});

const slideUp = keyframes({
  '0%': { transform: 'translateY(10px)', opacity: 0 },
  '100%': { transform: 'translateY(0)', opacity: 1 },
});

// Styled Components für die Homepage
const HeroContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  paddingTop: '$12',
  paddingBottom: '$20',
  overflow: 'hidden',
});

const ContentContainer = styled('div', {
  position: 'relative',
  zIndex: 10,
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '$4',
  display: 'flex',
  flexDirection: 'column',
  gap: '$8',
  
  '@md': {
    padding: '$8',
  },
});

const HeroTitle = styled('h1', {
  fontSize: '$5xl',
  fontWeight: '$bold',
  lineHeight: '$tight',
  letterSpacing: '$tighter',
  marginBottom: '$4',
  fontFamily: '$mono',
  color: '$foreground',
  position: 'relative',
  display: 'inline-block',
  animation: `${glitchText} 3s infinite alternate`,
  
  '@md': {
    fontSize: '$7xl',
  },
});

const SubTitle = styled('h2', {
  fontSize: '$xl',
  fontWeight: '$normal',
  lineHeight: '$normal',
  maxWidth: '800px',
  marginBottom: '$8',
  animation: `${slideUp} 0.8s ease-out forwards`,
  animationDelay: '0.3s',
  opacity: 0,
  
  '@md': {
    fontSize: '$2xl',
    maxWidth: '900px',
  },
});

const Description = styled('p', {
  fontSize: '$base',
  lineHeight: '$normal',
  maxWidth: '600px',
  marginBottom: '$8',
  color: '$gray11',
  animation: `${slideUp} 0.8s ease-out forwards`,
  animationDelay: '0.5s',
  opacity: 0,
});

const ButtonGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$4',
  animation: `${slideUp} 0.8s ease-out forwards`,
  animationDelay: '0.7s',
  opacity: 0,
  
  '@md': {
    flexDirection: 'row',
  },
});

const Quote = styled('blockquote', {
  fontStyle: 'italic',
  borderLeft: '2px solid $primary',
  paddingLeft: '$4',
  marginTop: '$12',
  fontSize: '$sm',
  color: '$gray10',
  maxWidth: '800px',
  animation: `${slideUp} 0.8s ease-out forwards`,
  animationDelay: '0.9s',
  opacity: 0,
});

const Attribution = styled('div', {
  fontSize: '$xs',
  color: '$gray9',
  marginTop: '$2',
});

const SourceInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  marginTop: '$12',
  fontSize: '$sm',
  color: '$gray11',
  animation: `${slideUp} 0.8s ease-out forwards`,
  animationDelay: '1.1s',
  opacity: 0,
  
  '@md': {
    marginTop: '$16',
  },
});

const InfoText = styled('p', {
  maxWidth: '800px',
  lineHeight: '$loose',
});

const StyledLink = styled('a', {
  color: '$primary',
  textDecoration: 'none',
  position: 'relative',
  
  '&:hover': {
    textDecoration: 'underline',
  },
});

export default function HomePage() {
  return (
    <HeroContainer>
      {/* Animierter Hintergrund */}
      <div className="glitch-background" aria-hidden="true"></div>
      
      <ContentContainer>
        <HeroTitle>Wem gehört die Welt?</HeroTitle>
        
        <SubTitle>
          Enthülle die globalen Konzernstrukturen. Wissen ist Widerstand.
        </SubTitle>
        
        <Description>
          Der Konzernatlas visualisiert die Verflechtungen zwischen Unternehmen und zeigt die wahren Machtstrukturen hinter globalen Konzernen.
        </Description>
        
        <ButtonGroup>
          <Button as={Link} href="/corporations" variant="primary" size="lg">
            Top-Konzerne erkunden
          </Button>
          
          <Button as={Link} href="/random" variant="secondary" size="lg">
            Zufälliger Konzern
          </Button>
        </ButtonGroup>
        
        <Quote>
          "Die Konzentration von Eigentum ist kein Zufall, sondern systembedingte Notwendigkeit. Was als freier Markt begann, endet in Monopolen und Oligopolen."
          <Attribution>- Kritische Ökonomietheorie</Attribution>
        </Quote>
        
        <SourceInfo>
          <InfoText>
            Basierend auf <StyledLink href="https://www.wikidata.org" target="_blank" rel="noopener noreferrer">Wikidata</StyledLink> • Open Source • Daten freigegeben
          </InfoText>
          
          <InfoText>
            Dieser Graph zeigt nur das Sichtbare. Die wahre Macht bleibt verborgen. Die Kontrolle über Ressourcen, Märkte und Menschen konzentriert sich immer weiter.
          </InfoText>
          
          <InfoText>
            Daten von <StyledLink href="https://www.wikidata.org" target="_blank" rel="noopener noreferrer">Wikidata</StyledLink> • Frei und Open Source
          </InfoText>
        </SourceInfo>
      </ContentContainer>
    </HeroContainer>
  );
}
