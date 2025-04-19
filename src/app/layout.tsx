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
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Konsistente Navigation */}
        <Navbar />
        
        {/* Hauptinhalt */}
        <main>
          {children}
        </main>
        
        {/* Minimal Footer */}
        <footer>
          <div className="attribution">
            Daten via <a href="https://www.wikidata.org" target="_blank" rel="noopener noreferrer">Wikidata</a> (CC0) • 
            © {new Date().getFullYear()} Konzernatlas
          </div>
        </footer>
      </body>
    </html>
  );
}
