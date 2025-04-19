"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { styled, keyframes } from '@/styles/stitches.config';
import StyledNetworkGraph from '@/components/NetworkGraph/StyledNetworkGraph';
import { CompanyNode, CompanyRelationship } from '@/types/company';
import { CRITIQUE_MESSAGES } from '@/data/topCorporations';

// Animationen
const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const pulse = keyframes({
  '0%, 100%': { transform: 'scale(1)', opacity: 0.8 },
  '50%': { transform: 'scale(1.05)', opacity: 1 },
});

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
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
  paddingTop: '$6',
  paddingBottom: '$12',
  
  '@md': {
    padding: '$6',
  },
});

const NavigationBar = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: '$8',
  
  '@md': {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const NavLink = styled(Link, {
  display: 'inline-flex',
  alignItems: 'center',
  color: '$gray11',
  fontSize: '$sm',
  marginBottom: '$4',
  transition: '$fast',
  
  '&:hover': {
    color: '$foreground',
  },
  
  '& svg': {
    marginRight: '$2',
  },
  
  '@md': {
    marginBottom: 0,
  },
});

const GraphHeader = styled('div', {
  marginBottom: '$5',
  animation: `${fadeIn} 0.6s ease-out forwards`,
});

const CompanyTitle = styled('h1', {
  fontSize: '$3xl',
  fontWeight: '$bold',
  marginBottom: '$2',
  letterSpacing: '$tight',
  fontFamily: '$mono',
  
  '@md': {
    fontSize: '$4xl',
  },
});

const MetaContainer = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '$2',
  marginBottom: '$4',
});

const MetaBadge = styled('span', {
  display: 'inline-block',
  padding: '0 $3',
  height: '24px',
  lineHeight: '24px',
  fontSize: '$xs',
  backgroundColor: '$tertiary',
  border: '1px solid $gray8',
  borderRadius: '$full',
  color: '$gray11',
});

const CritiqueMessage = styled('p', {
  fontSize: '$sm',
  color: '$gray11',
  marginBottom: '$2',
  maxWidth: '800px',
  fontStyle: 'italic',
  borderLeft: '2px solid $primary',
  paddingLeft: '$3',
});

const LoadingContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$20 0',
});

const Spinner = styled('div', {
  width: '40px',
  height: '40px',
  borderRadius: '$full',
  borderTop: '3px solid $primary',
  borderRight: '3px solid transparent',
  animation: `${rotate} 1s linear infinite`,
  marginBottom: '$4',
});

const LoadingText = styled('p', {
  color: '$gray11',
  fontSize: '$base',
});

const ErrorContainer = styled('div', {
  backgroundColor: 'rgba(44, 18, 21, 0.8)',
  border: '1px solid $primary',
  borderRadius: '$lg',
  padding: '$6',
  textAlign: 'center',
  maxWidth: '500px',
  margin: '0 auto',
});

const ErrorIcon = styled('div', {
  color: '$primary',
  fontSize: '$4xl',
  marginBottom: '$4',
});

const ErrorTitle = styled('h2', {
  fontSize: '$xl',
  fontWeight: '$bold',
  marginBottom: '$2',
});

const ErrorMessage = styled('p', {
  color: '$gray12',
  marginBottom: '$4',
});

const ErrorHint = styled('p', {
  fontSize: '$sm',
  color: '$gray10',
  fontStyle: 'italic',
});

const FooterNote = styled('div', {
  textAlign: 'center',
  maxWidth: '800px',
  margin: '0 auto $8 auto',
  fontSize: '$sm',
  color: '$gray9',
  fontStyle: 'italic',
  padding: '$4',
});

const AttributionNote = styled('div', {
  textAlign: 'center',
  padding: '$6',
  fontSize: '$sm',
  color: '$gray9',
  fontStyle: 'italic',
  maxWidth: '800px',
  margin: '0 auto',
  borderTop: '1px solid $gray8',
});

// Zufällige kapitalismuskritische Nachricht auswählen
const getRandomCritique = () => {
  return CRITIQUE_MESSAGES[Math.floor(Math.random() * CRITIQUE_MESSAGES.length)];
};

export default function GraphPage({ params }: { params: { id: string } }) {
  const [companies, setCompanies] = useState<CompanyNode[]>([]);
  const [relationships, setRelationships] = useState<CompanyRelationship[]>([]);
  const [mainCompany, setMainCompany] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [critiqueMessage, setCritiqueMessage] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      setCritiqueMessage(getRandomCritique());
      
      try {
        const response = await fetch(`/api/companyRelationships?id=${encodeURIComponent(params.id)}`);
        
        if (!response.ok) {
          throw new Error(`Netzwerkfehler: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.companies || !data.relationships || data.companies.length === 0) {
          throw new Error('Keine Daten für diesen Konzern gefunden.');
        }
        
        // Hauptunternehmen identifizieren und Namen setzen
        const main = data.companies.find((c: CompanyNode) => c.nodeType === 'main');
        setMainCompany(main?.label || 'Unbekanntes Unternehmen');
        
        setCompanies(data.companies);
        setRelationships(data.relationships);
      } catch (err: any) {
        console.error('Fehler beim Laden der Konzerndaten:', err);
        setError(err.message || 'Unbekannter Fehler beim Laden der Daten');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [params.id]);
  
  // Funktion zum Navigieren zu einem anderen Unternehmen im Graph
  const handleNodeClick = (companyId: string) => {
    // Nur navigieren, wenn es ein anderes Unternehmen ist
    if (companyId !== params.id) {
      window.location.href = `/graph/${companyId}`;
    }
  };
  
  return (
    <PageContainer>
      {/* Animierter Hintergrund */}
      <div className="glitch-background" aria-hidden="true"></div>
      
      <ContentContainer>
        {/* Navigation */}
        <NavigationBar>
          <NavLink href="/corporations">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Zurück zur Übersicht
          </NavLink>
          
          <NavLink href="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Startseite
          </NavLink>
        </NavigationBar>
        
        {/* Inhaltsbereich */}
        {isLoading ? (
          <LoadingContainer>
            <Spinner />
            <LoadingText>Enthülle Konzernverflechtungen...</LoadingText>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorIcon>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </ErrorIcon>
            <ErrorTitle>Fehler beim Laden</ErrorTitle>
            <ErrorMessage>{error}</ErrorMessage>
            <ErrorHint>Versuche es mit einem anderen Konzern oder später erneut.</ErrorHint>
          </ErrorContainer>
        ) : (
          <>
            {/* Graph-Hauptbereich */}
            <GraphHeader>
              <CompanyTitle>{mainCompany}</CompanyTitle>
              <MetaContainer>
                <MetaBadge>{companies.length} Unternehmen</MetaBadge>
                <MetaBadge>{relationships.length} Verbindungen</MetaBadge>
              </MetaContainer>
              <CritiqueMessage>{critiqueMessage}</CritiqueMessage>
            </GraphHeader>
            
            {/* Netzwerkgraph */}
            <StyledNetworkGraph 
              companies={companies} 
              relationships={relationships}
              onNodeClick={handleNodeClick}
            />
            
            {/* Kapitalismuskritischer Hinweis */}
            <FooterNote>
              Die Machtkonzentration der größten Konzerne erzeugt wirtschaftliche Monopole, 
              die demokratische Prozesse unterwandern und gesellschaftliche Ungleichheit vertiefen.
            </FooterNote>
          </>
        )}
      </ContentContainer>
      
      <AttributionNote>
        Die Daten zeigen nur die offiziellen Verbindungen. Inoffizielle Netzwerke, 
        persönliche Verflechtungen und Lobbyismus bleiben im Verborgenen.
      </AttributionNote>
    </PageContainer>
  );
}
