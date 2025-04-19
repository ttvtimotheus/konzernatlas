"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TOP_CORPORATIONS } from '@/data/topCorporations';

export default function RandomPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Zufällige Unternehmens-ID auswählen
    const getRandomCompany = () => {
      // 75% Wahrscheinlichkeit für ein bekanntes Top-Unternehmen
      if (Math.random() < 0.75) {
        const randomIndex = Math.floor(Math.random() * TOP_CORPORATIONS.length);
        return TOP_CORPORATIONS[randomIndex].id;
      } else {
        // 25% Wahrscheinlichkeit für ein Wikidata-Unternehmen
        // Diese IDs sollten zu interessanten Großunternehmen gehören
        const randomWikidataCompanies = [
          "Q380", // Meta
          "Q312", // Apple
          "Q95", // Alphabet Inc.
          "Q2283", // Microsoft
          "Q3884", // Amazon
          "Q483407", // TikTok
          "Q37156", // ExxonMobil
          "Q81965", // Walmart
          "Q38088", // Vanguard Group
          "Q156578", // Volkswagen AG
          "Q260", // Coca-Cola
          "Q18974", // Nestlé
          "Q207387", // Unilever
          "Q162845", // Boeing
          "Q38109", // Bayer
          "Q181658", // Warner Bros
          "Q483815", // Walt Disney Company
          "Q243027", // Credit Suisse
          "Q806754", // Deutsche Bank
          "Q737008", // JPMorgan Chase
          "Q162844", // Lockheed Martin
        ];
        const randomIndex = Math.floor(Math.random() * randomWikidataCompanies.length);
        return randomWikidataCompanies[randomIndex];
      }
    };
    
    // Zufälliges Unternehmen auswählen und Weiterleitung vornehmen
    const randomCompanyId = getRandomCompany();
    
    // Kurz warten, damit Ladeanimation sichtbar ist
    const timer = setTimeout(() => {
      router.push(`/graph/${randomCompanyId}`);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {/* Animierter Hintergrund */}
      <div className="glitch-background" aria-hidden="true"></div>
      
      <div className="text-center max-w-xl px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Enthülle einen zufälligen Konzern</h1>
        
        <div className="relative w-16 h-16 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-[var(--primary)] animate-spin"></div>
          <div className="absolute inset-1 rounded-full border-b-4 border-l-4 border-[var(--secondary)] animate-spin-slow reverse"></div>
        </div>
        
        <p className="text-gray-400 mb-6">
          Wir enthüllen die Verflechtungen eines zufällig ausgewählten Konzerns...
        </p>
        
        <div className="text-sm text-gray-500 italic">
          Wer die Welt besitzt, bestimmt ihren Lauf. Die Konzentration von Kapital führt zur Konzentration von Macht.
        </div>
      </div>
    </div>
  );
}
