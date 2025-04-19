"use client";

import { useState } from "react";
import CompanySearch from "@/components/CompanySearch";
import NetworkGraph from "@/components/NetworkGraph";
import InfoBox from "@/components/InfoBox";
import { CompanyNode, CompanyRelationship } from "@/types/company";

export default function Home() {
  const [companies, setCompanies] = useState<CompanyNode[]>([]);
  const [relationships, setRelationships] = useState<CompanyRelationship[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompanySelect = async (companyId: string, companyName: string) => {
    setIsLoading(true);
    setError(null);
    setSelectedCompany(companyName);
    
    try {
      const response = await fetch(`/api/companyRelationships?id=${encodeURIComponent(companyId)}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setCompanies(data.companies);
      setRelationships(data.relationships);
    } catch (error) {
      console.error('Failed to fetch company data:', error);
      setError('Failed to fetch company data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-8 min-h-[calc(100vh-200px)]">
      <section className="max-w-2xl mx-auto w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
          Unternehmensbeziehungen visualisiert
        </h1>
        <p className="text-gray-300 mb-6">
          Entdecken Sie Eigentumsverhältnisse und Verflechtungen von Unternehmen auf Basis von Wikidata.
        </p>
        
        <CompanySearch onCompanySelect={handleCompanySelect} />
      </section>
      
      <section className="flex-1 w-full">
        {isLoading && (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="w-12 h-12 border-t-4 border-cyan-500 border-solid rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-400">Lade Daten...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-200 rounded-lg p-4 max-w-lg mx-auto text-center">
            <p className="font-medium mb-2">Fehler</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {!isLoading && !error && companies.length === 0 && (
          <div className="text-center py-16 px-4 bg-gray-900/50 rounded-lg border border-gray-800 max-w-2xl mx-auto">
            <h2 className="text-xl font-medium mb-3 text-gray-200">Unternehmen suchen</h2>
            <p className="text-gray-400 mb-6">Suchen Sie nach einem Unternehmen, um dessen Eigentumsstruktur zu visualisieren.</p>
            <div className="max-w-md mx-auto text-sm text-left text-gray-400 bg-gray-800/50 p-4 rounded-md border border-gray-700">
              <p className="font-medium mb-1">Beispiele:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Volkswagen</li>
                <li>Deutsche Telekom</li>
                <li>Nestlé</li>
                <li>Meta Platforms</li>
              </ul>
            </div>
          </div>
        )}
        
        {!isLoading && !error && companies.length > 0 && (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium text-gray-200">
                Netzwerkgraph: <span className="text-cyan-400">{selectedCompany}</span>
              </h2>
              <div className="text-sm text-gray-400">
                {companies.length} Unternehmen · {relationships.length} Verbindungen
              </div>
            </div>
            
            <div className="h-[60vh] bg-gray-900/20 rounded-lg border border-gray-800 overflow-hidden">
              <NetworkGraph companies={companies} relationships={relationships} />
            </div>
            
            <div className="text-xs text-gray-500 text-center italic">
              Hinweis: Ziehen Sie Knoten, um das Diagramm neu zu arrangieren. Scrollen Sie zum Zoomen.
            </div>
          </div>
        )}
      </section>
      
      <InfoBox />
    </div>
  );
}
