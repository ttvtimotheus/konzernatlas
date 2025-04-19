import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 py-20 overflow-hidden">
      {/* Animierter Hintergrund */}
      <div className="glitch-background" aria-hidden="true"></div>
      
      <div className="container mx-auto text-center z-10 max-w-4xl fade-in">
        <h1 className="hero-title mb-4">
          Wem gehört die Welt?
        </h1>
        
        <p className="hero-subtitle">
          Enthülle die globalen Konzernstrukturen. Wissen ist Widerstand.
        </p>
        
        <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
          <Link href="/corporations" className="btn-primary">
            Top-Konzerne entdecken
          </Link>
          
          <Link href="/random" className="btn-secondary">
            Zufälligen Konzern aufdecken
          </Link>
        </div>
        
        <div className="mt-16 opacity-60 max-w-xl mx-auto text-sm">
          <p className="critique-message">
            "Die Konzentration von Eigentum ist kein Zufall, sondern systembedingte Notwendigkeit. 
            Was als freier Markt begann, endet in Monopolen und Oligopolen."
          </p>
        </div>
      </div>
      
      {/* Dekorativer Footer mit kleinen Verweisen auf Datenquellen */}
      <div className="absolute bottom-5 left-0 right-0 text-center text-xs opacity-40">
        <p>Basierend auf Wikidata • Open Source • Daten freigeben</p>
      </div>
    </div>
  );
}
