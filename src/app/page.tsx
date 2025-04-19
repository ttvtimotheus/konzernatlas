"use client";

import { useState } from "react";
import CompanySearch from "@/components/CompanySearch";
import NetworkGraph from "@/components/NetworkGraph";
import { CompanyNode, CompanyRelationship } from "@/types/company";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<CompanyNode[]>([]);
  const [relationships, setRelationships] = useState<CompanyRelationship[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const handleCompanySelect = async (companyId: string, companyName: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedCompany(companyName);
    
    try {
      const response = await fetch(`/api/companyRelationships?id=${encodeURIComponent(companyId)}`);
      
      if (!response.ok) {
        throw new Error(`API-Fehler: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.companies.length === 0) {
        setError("Keine Unternehmensverbindungen gefunden.");
        setCompanies([]);
        setRelationships([]);
      } else {
        setCompanies(data.companies);
        setRelationships(data.relationships);
      }
    } catch (err) {
      setError(`Fehler beim Laden der Daten: ${err instanceof Error ? err.message : String(err)}`);
      setCompanies([]);
      setRelationships([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto fade-in">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Konzernatlas</h1>
        <p className="text-lg mb-6">Wer gehört wem? Eine Visualisierung globaler Konzernverflechtungen</p>
        
        <div className="max-w-lg mx-auto">
          <CompanySearch onCompanySelect={handleCompanySelect} />
        </div>
      </header>

      {selectedCompany && (
        <h2 className="text-xl font-semibold mb-4 text-center">
          Verbindungen für: <span className="text-primary">{selectedCompany}</span>
        </h2>
      )}

      {isLoading ? (
        <div className="loading-container">
          <p>Lade Unternehmensdaten...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <h3 className="text-xl font-semibold mb-2">Fehler</h3>
          <p>{error}</p>
        </div>
      ) : companies.length > 0 && relationships.length > 0 ? (
        <div className="network-container">
          <NetworkGraph 
            companies={companies} 
            relationships={relationships} 
          />
        </div>
      ) : selectedCompany ? (
        <div className="text-center py-10">
          <p>Keine Verbindungen gefunden für {selectedCompany}.</p>
        </div>
      ) : (
        <div className="text-center py-10">
          <p>Suchen Sie nach einem Unternehmen, um dessen Besitzstrukturen zu visualisieren.</p>
        </div>
      )}
    </div>
  );
}
