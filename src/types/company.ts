export interface CompanyNode {
  id: string;
  label: string;
  industry?: string;
  country?: string;
  foundingYear?: number;
  url?: string;
}

export interface CompanyRelationship {
  source: string;
  target: string;
  type: "owned_by";
}

export interface WikidataCompany {
  id: string;
  label: string;
  description?: string;
}

export interface CompanyGraphData {
  companies: CompanyNode[];
  relationships: CompanyRelationship[];
}
