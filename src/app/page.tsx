"use client";

import React from 'react';
import Link from 'next/link';
import { styled, keyframes, fadeIn, pulseNode } from '@/styles/stitches.config';
import Button from '@/components/ui/Button';

// Kraftvolle Animationen für einen radikalen Look
const glitchText = keyframes({
  '0%': { transform: 'translate(0)' },
  '2%': { transform: 'translate(-2px, 0)' },
  '4%': { transform: 'translate(2px, 0)' },
  '5%': { transform: 'translate(0, 0)' },
  '94%': { transform: 'translate(0, 0)' },
  '96%': { transform: 'translate(-5px, 0)', textShadow: '-2px 0 #ff3000' },
  '97%': { transform: 'translate(5px, 0)', textShadow: '2px 0 #00ff40' },
  '98%': { transform: 'translate(0, 0)' },
  '100%': { transform: 'translate(0)' },
});

const fadeInUp = keyframes({
  '0%': { transform: 'translateY(30px)', opacity: 0 },
  '100%': { transform: 'translateY(0)', opacity: 1 },
});

const scanlines = keyframes({
  '0%': { backgroundPosition: '0 0' },
  '100%': { backgroundPosition: '0 100%' },
});

// Styled Components für die kraftvolle Ästhetik
const PageWrapper = styled('div', {
  background: '#050505',  // Fast schwarzer Hintergrund
  minHeight: '100vh',
  color: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
});

const HeroContainer = styled('main', {
  position: 'relative',
  flex: '1 0 auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, transparent 50%, rgba(5,5,5,0.5) 100%)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'linear-gradient(0deg, rgba(255,0,0,.04) 1px, transparent 1px)',
    backgroundSize: '100% 2px',
    animation: `${scanlines} 8s linear infinite`,
    opacity: 0.12,
    pointerEvents: 'none',
    zIndex: 1,
  },
});

const ContentContainer = styled('div', {
  position: 'relative',
  zIndex: 10,
  width: '90%',
  maxWidth: '800px', // Maximale Breite für bessere Lesbarkeit
  margin: '0 auto',
  paddingTop: '10vh',
  paddingBottom: '10vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
});

const TitleBox = styled('div', {
  marginBottom: '4rem',
  position: 'relative',
  animation: `${fadeInUp} 800ms ease forwards`,
  opacity: 0,
});

const HeroTitle = styled('h1', {
  fontSize: 'clamp(2.5rem, 10vw, 5rem)',
  fontWeight: 900,
  lineHeight: 1, 
  letterSpacing: '0.05em', // Erhöhter Buchstabenabstand für monumentaleren Look
  margin: '0',
  padding: '0',
  fontFamily: '"Space Mono", monospace',
  color: '#ffffff',
  textTransform: 'uppercase',
  position: 'relative',
  display: 'inline-block',
  
  '&:hover': {
    animation: `${glitchText} 1s ease-in-out`,
  },
});

const TitleSecondLine = styled('span', {
  display: 'block',
  position: 'relative',
  marginTop: '0.5rem',
});

const SubTitle = styled('h2', {
  fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
  fontWeight: 400,
  lineHeight: 1.4,
  margin: '3rem 0 4rem',
  color: '#f0f0f0',
  animation: `${fadeInUp} 800ms ease forwards`,
  animationDelay: '200ms',
  opacity: 0,
});

const Description = styled('p', {
  fontSize: '1.1rem',
  lineHeight: 1.7,
  maxWidth: '650px',
  margin: '0 auto 4rem',
  color: '#aaaaaa',
  animation: `${fadeInUp} 800ms ease forwards`,
  animationDelay: '400ms',
  opacity: 0,
});

const ButtonGroup = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  width: '100%',
  maxWidth: '450px',
  margin: '2rem auto 5rem', // Mehr vertikaler Abstand
  animation: `${fadeInUp} 800ms ease forwards`,
  animationDelay: '600ms',
  opacity: 0,
  
  '@md': {
    flexDirection: 'row',
    maxWidth: '600px',
  },
});

const Quote = styled('blockquote', {
  position: 'relative',
  fontStyle: 'italic', // Bereits kursiv
  border: 'none',
  padding: '2rem 2rem 2rem 3rem',
  margin: '5rem auto',
  width: '85%',
  maxWidth: '700px', // Optimale Lesebreite
  fontSize: '1.05rem',
  lineHeight: 1.5,
  color: '#e0e0e0',
  textAlign: 'left',
  background: 'rgba(30, 30, 30, 0.7)',
  borderRadius: '4px',
  animation: `${fadeInUp} 800ms ease forwards`,
  animationDelay: '800ms',
  opacity: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '3px',
    backgroundColor: '#ff3030',
  },
});

const Attribution = styled('footer', {
  marginTop: '1.5rem',
  fontWeight: 400,
  fontSize: '0.9rem',
  textAlign: 'right',
  color: '#aaaaaa', // Hellere Farbe für bessere Lesbarkeit
});

const Footer = styled('footer', {
  backgroundColor: '#060606',
  borderTop: '1px solid #333',
  width: '100%',
  padding: '4rem 0 2rem',
  marginTop: 'auto',
});

const FooterContent = styled('div', {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '0 1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  animation: `${fadeInUp} 800ms ease forwards`,
  animationDelay: '1000ms',
  opacity: 0,
});

const RadicalMessage = styled('p', {
  fontSize: '1.1rem',
  lineHeight: 1.5,
  maxWidth: '700px',
  margin: '0 auto',
  fontWeight: 500,
  color: '#bbb',
  textAlign: 'center',
  '& strong': {
    color: '#fff',
    fontWeight: 700,
  }
});

const SourceInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  marginTop: '2rem',
  fontSize: '0.85rem',
  color: '#777',
  textAlign: 'center',
});

const InfoText = styled('p', {
  maxWidth: '650px',
  margin: '0 auto',
  lineHeight: 1.6, // Erhöhter Zeilenabstand im Footer
});

const StyledLink = styled('a', {
  color: '#ff4040',
  textDecoration: 'none',
  position: 'relative',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '100%',
    transform: 'scaleX(0)',
    height: '1px',
    bottom: 0,
    left: 0,
    backgroundColor: '#ff4040',
    transformOrigin: 'bottom right',
    transition: 'transform 0.3s ease-out',
  },
  '&:hover': {
    color: '#ff6060',
    '&::after': {
      transform: 'scaleX(1)',
      transformOrigin: 'bottom left',
    }
  },
});

export default function HomePage() {
  return (
    <PageWrapper>
      <HeroContainer>
        <ContentContainer>
          <TitleBox>
            <HeroTitle>WEM GEHÖRT <TitleSecondLine>DIE WELT?</TitleSecondLine></HeroTitle>
          </TitleBox>
          
          <SubTitle>
            Enthülle die globalen Konzernstrukturen. Wissen ist Widerstand.
          </SubTitle>
          
          <Description>
            Der Konzernatlas visualisiert die Verflechtungen zwischen Unternehmen und zeigt die wahren Machtstrukturen hinter globalen Konzernen. Ein digitales Werkzeug gegen die Intransparenz ökonomischer Macht.
          </Description>
          
          <ButtonGroup>
            <Button 
              as={Link} 
              href="/corporations" 
              variant="primary" 
              size="lg"
              css={{ 
                backgroundColor: '#ff3030',
                textTransform: 'uppercase', 
                borderRadius: '3px',
                letterSpacing: '0.08em',
                fontWeight: 700,
                fontSize: '0.95rem',
                padding: '0.8rem 1.5rem',
                boxShadow: '0 2px 12px rgba(255, 48, 48, 0.25)',
                transition: 'all 0.2s ease-in-out', // Sanfte Transition
                '&:hover': { 
                  backgroundColor: '#e60000', // Dunkleres Rot beim Hover
                  transform: 'translateY(-2px) scale(1.02)', // Leichte Vergrößerung
                  boxShadow: '0 4px 20px rgba(255, 48, 48, 0.4)',
                },  
                '&:active': {
                  transform: 'translateY(1px)',
                }
              }}
            >
              TOP-KONZERNE ERKUNDEN
            </Button>
            
            <Button 
              as={Link} 
              href="/random" 
              variant="secondary" 
              size="lg"
              css={{ 
                backgroundColor: '#222',
                textTransform: 'uppercase',
                borderRadius: '3px',
                letterSpacing: '0.08em',
                fontWeight: 500,
                fontSize: '0.95rem',
                padding: '0.8rem 1.5rem',
                border: '1px solid #444',
                transition: 'all 0.2s ease-in-out', // Sanfte Transition
                '&:hover': { 
                  backgroundColor: '#333', // Leicht aufgehellter Hintergrund
                  borderColor: '#555',
                  transform: 'translateY(-2px) scale(1.02)', // Gleiche Vergrößerung wie beim roten Button
                }  
              }}
            >
              ZUFÄLLIGER KONZERN
            </Button>
          </ButtonGroup>
          
          <Quote>
            "Die Konzentration von Eigentum ist kein Zufall, sondern systembedingte Notwendigkeit. Was als freier Markt begann, endet in Monopolen und Oligopolen. Kapitalismus schafft nicht Vielfalt, sondern Hegemonie."
            <Attribution>— Kritische Ökonomie</Attribution>
          </Quote>
        </ContentContainer>
      </HeroContainer>
      
      <Footer>
        <FooterContent>
          <RadicalMessage>
            Diese Plattform ist ein Versuch, das <strong>Unsichtbare sichtbar</strong> zu machen.<br/>
            Wissen ist Widerstand. Teilen ist Revolution.
          </RadicalMessage>
          
          {/* Neue radikale Abschlusszeile */}
          <p style={{
            fontSize: '0.8rem',
            color: '#cccccc',
            textAlign: 'center',
            marginTop: '2rem',
            fontStyle: 'italic'
          }}>
            Märkte sind nicht frei. Sie werden gemacht.
          </p>
          
          <SourceInfo>
            <InfoText>
              Daten von <StyledLink href="https://www.wikidata.org" target="_blank" rel="noopener noreferrer">Wikidata</StyledLink> • Frei und Open Source
            </InfoText>
            
            <InfoText>
              Die hier dargestellten Netzwerke zeigen nur die offiziellen Verbindungen. Die wahren Machtstrukturen bleiben oft im Verborgenen — durch Lobbyismus, personelle Verflechtungen und informelle Einflussnahme.
            </InfoText>
          </SourceInfo>
        </FooterContent>
      </Footer>
    </PageWrapper>
  );
}
