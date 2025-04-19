export interface CompanyNode {
  id: string;
  label: string;
  nodeType?: 'main' | 'parent' | 'holding' | 'full-ownership' | 'partial-ownership';
  level?: number;
  industry?: string;
  country?: string;
  inception?: string;
  foundingYear?: number;
  url?: string;
  // Erweiterte Eigenschaften für die StyledNetworkGraph-Komponente
  description?: string;
  founded?: string;
  headquarters?: string;
  wikidata?: string;
  x?: number; // Für D3.js Positionierung
  y?: number; // Für D3.js Positionierung
}

export interface CompanyRelationship {
  source: string;
  target: string;
  type: 'owned_by' | 'owner' | 'full' | 'partial';
  percentage?: number | null;
  value?: number; // Für D3.js Liniendicke
}

export interface WikidataCompany {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  category?: string;
}

export interface CompanyGraphData {
  companies: CompanyNode[];
  relationships: CompanyRelationship[];
}
