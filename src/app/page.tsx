"use client";

import { useState } from "react";
import CompanySearch from "@/components/CompanySearch";
import NetworkGraph from "@/components/NetworkGraph";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import SearchResultInfo from "@/components/SearchResultInfo";
import EmptyState from "@/components/EmptyState";
import { CompanyNode, CompanyRelationship } from "@/types/company";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<CompanyNode[]>([]);
  const [relationships, setRelationships] = useState<CompanyRelationship[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [lastSearchId, setLastSearchId] = useState<string>("");

  const handleCompanySelect = async (companyId: string, companyName: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedCompany(companyName);
    setLastSearchId(companyId);
    
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
          <LoadingSpinner />
          <p className="text-center mt-4">Lade Unternehmensdaten...</p>
        </div>
      ) : error ? (
        <ErrorMessage 
          message={error} 
          retry={() => lastSearchId && selectedCompany ? handleCompanySelect(lastSearchId, selectedCompany) : undefined} 
        />

      ) : companies.length > 0 && relationships.length > 0 ? (
        <>
          <SearchResultInfo 
            companies={companies} 
            relationships={relationships} 
            selectedCompany={selectedCompany} 
          />
          <div className="network-container">
            <NetworkGraph 
              companies={companies} 
              relationships={relationships} 
            />
          </div>
        </>
      ) : selectedCompany ? (
        <EmptyState
          title="Keine Verbindungen gefunden"
          description={`Für das Unternehmen "${selectedCompany}" konnten keine Besitzverhältnisse in der Wikidata-Datenbank gefunden werden.`}
        />
      ) : (
        <EmptyState
          title="Unternehmen entdecken"
          description="Suchen Sie nach einem Unternehmen, um dessen Besitzstrukturen und globale Verflechtungen zu visualisieren. Die Daten werden in Echtzeit von Wikidata abgerufen."
          action={
            <div className="max-w-sm mx-auto mt-4 border border-border rounded-lg p-3">
              <p className="text-sm text-muted mb-2">Beispiele: Siemens, Amazon, Volkswagen</p>
            </div>
          }
        />
      )}
    </div>
  );
}
