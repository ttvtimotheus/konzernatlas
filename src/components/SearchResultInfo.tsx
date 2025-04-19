"use client";

import { CompanyNode, CompanyRelationship } from "@/types/company";

interface SearchResultInfoProps {
  companies: CompanyNode[];
  relationships: CompanyRelationship[];
  selectedCompany: string | null;
}

export default function SearchResultInfo({
  companies,
  relationships,
  selectedCompany
}: SearchResultInfoProps) {
  if (!companies.length || !relationships.length) return null;
  
  // Count direct subsidiaries and parent companies
  const parents = new Set<string>();
  const subsidiaries = new Set<string>();
  
  // Find the selected company ID
  const selectedCompanyNode = companies.find(c => c.label === selectedCompany);
  const selectedId = selectedCompanyNode?.id;
  
  if (selectedId) {
    relationships.forEach(rel => {
      if (rel.source === selectedId) {
        parents.add(rel.target);
      }
      if (rel.target === selectedId) {
        subsidiaries.add(rel.source);
      }
    });
  }
  
  return (
    <div className="mb-6 p-4 border border-border rounded-lg bg-background/30">
      <h3 className="text-lg font-medium mb-2">Netzwerk-Übersicht</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-muted">Unternehmen</p>
          <p className="text-2xl font-semibold text-primary">{companies.length}</p>
        </div>
        <div>
          <p className="text-muted">Verbindungen</p>
          <p className="text-2xl font-semibold text-secondary">{relationships.length}</p>
        </div>
        <div>
          <p className="text-muted">Beziehungen</p>
          <div className="flex items-center gap-4 mt-1">
            <div>
              <span className="text-xs text-muted">Eigentümer</span>
              <p className="text-xl font-semibold text-accent">{parents.size}</p>
            </div>
            <div>
              <span className="text-xs text-muted">Tochtergesellschaften</span>
              <p className="text-xl font-semibold text-accent">{subsidiaries.size}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
