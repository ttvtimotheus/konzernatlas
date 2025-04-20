import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { globalStyles } from '@/styles/stitches.config';
import Navbar from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: 'Konzernatlas – Wem gehört die Welt?',
  description: 'Interaktive Visualisierung von globalen Konzernverflechtungen. Entdecke, wem die Welt wirklich gehört.',
  keywords: ['Konzernatlas', 'Corporate Ownership', 'Kapitalismuskritik', 'Wikidata', 'Network Visualization', 'Open Data'],
  authors: [{ name: 'Konzernatlas' }],
  openGraph: {
    title: 'Konzernatlas – Wem gehört die Welt?',
    description: 'Interaktive Visualisierung von globalen Konzernverflechtungen',
    url: 'https://konzernatlas.de',
    siteName: 'Konzernatlas',
    images: [
      {
        url: 'https://konzernatlas.de/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Konzernatlas – Wem gehört die Welt?',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Konzernatlas – Wem gehört die Welt?',
    description: 'Interaktive Visualisierung von globalen Konzernverflechtungen',
    images: ['https://konzernatlas.de/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Globale Styles initialisieren
  globalStyles();
  
  return (
    <html lang="de" style={{ margin: 0, padding: 0, width: '100%', height: '100%' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        {/* Zusätzliches Sicherstellen, dass kein weißer Rand erscheint */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            background-color: #050505;
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            width: 100%;
            min-height: 100vh;
          }
          body > div {
            width: 100%;
            min-height: 100vh;
          }
          /* Scanline-Effekt für kapitalismuskritisches Design */
          .scanlines {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.03));
            background-size: 100% 2px, 3px 100%;
            opacity: 0.15;
          }
        `}} />
      </head>
      <body>
        {/* Konsistente Navigation */}
        <Navbar />
        
        {/* Scanline-Effekt für kapitalismuskritisches Design */}
        <div className="scanlines" />
        
        {/* Hauptinhalt */}
        <main>
          {children}
        </main>
        
        {/* Minimal Footer */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', textAlign: 'center', fontSize: '0.8rem', opacity: 0.7, marginTop: '2rem' }}>
          <div className="attribution">
            Daten via <a href="https://www.wikidata.org" target="_blank" rel="noopener noreferrer" style={{ color: '#ff3030', textDecoration: 'none' }}>Wikidata</a> (CC0) • 
            © {new Date().getFullYear()} Konzernatlas
          </div>
        </footer>
      </body>
    </html>
  );
}
