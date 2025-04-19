import { NextRequest, NextResponse } from "next/server";
import { CompanyNode, CompanyRelationship, CompanyGraphData } from "@/types/company";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const companyId = searchParams.get("id");

  if (!companyId) {
    return NextResponse.json({ error: "Company ID parameter is required" }, { status: 400 });
  }

  try {
    const data = await getCompanyRelationships(companyId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching company relationships:", error);
    return NextResponse.json({ error: "Failed to fetch company relationship data" }, { status: 500 });
  }
}

async function getCompanyRelationships(companyId: string): Promise<CompanyGraphData> {
  // SPARQL query to find ownership relationships between companies
  const sparqlQuery = `
    SELECT ?company ?companyLabel ?parentCompany ?parentCompanyLabel ?industry ?industryLabel ?country ?countryLabel ?inception
    WHERE {
      # Starting from our target company
      VALUES ?targetCompany { wd:${companyId} }
      
      # Get all connected companies (child or parent)
      {
        # Companies owned by target
        ?targetCompany wdt:P127+ ?company.
      } UNION {
        # Parent companies that own target
        ?company wdt:P127+ ?targetCompany.
      } UNION {
        # Include the target company itself
        ?company wdt:P31 wd:Q783794.
        FILTER(?company = ?targetCompany)
      }
      
      # All parent-child relationships
      OPTIONAL { ?company wdt:P127 ?parentCompany. }
      
      # Additional information about companies
      OPTIONAL { ?company wdt:P452 ?industry. }
      OPTIONAL { ?company wdt:P17 ?country. }
      OPTIONAL { ?company wdt:P571 ?inception. }
      
      # Get labels for all entities
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en,de". }
    }
    LIMIT 100
  `;

  const url = "https://query.wikidata.org/sparql";
  const fullUrl = `${url}?query=${encodeURIComponent(sparqlQuery)}&format=json`;

  const response = await fetch(fullUrl, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "KonzernatlasApp/1.0 (https://github.com/ttvtimotheus/konzernatlas/)"
    },
  });

  if (!response.ok) {
    throw new Error(`Wikidata API error: ${response.status}`);
  }

  const data = await response.json();
  const results = data.results.bindings;

  // Process the data
  const companies = new Map<string, CompanyNode>();
  const relationships: CompanyRelationship[] = [];
  const relationshipSet = new Set<string>(); // To prevent duplicate relationships

  results.forEach((item: any) => {
    if (!item.company?.value) return;
    
    // Extract company ID from URI
    const companyUri = item.company.value;
    const companyId = companyUri.split("/").pop();
    
    // Add company to map if not already added
    if (!companies.has(companyId)) {
      const foundingYear = item.inception?.value 
        ? new Date(item.inception.value).getFullYear() 
        : undefined;
      
      companies.set(companyId, {
        id: companyId,
        label: item.companyLabel?.value || companyId,
        industry: item.industryLabel?.value,
        country: item.countryLabel?.value,
        foundingYear: foundingYear,
        url: `https://www.wikidata.org/wiki/${companyId}`
      });
    }
    
    // Process relationship if parent company exists
    if (item.parentCompany?.value) {
      const parentUri = item.parentCompany.value;
      const parentId = parentUri.split("/").pop();
      
      // Add parent company to map if not already added
      if (!companies.has(parentId)) {
        companies.set(parentId, {
          id: parentId,
          label: item.parentCompanyLabel?.value || parentId,
          url: `https://www.wikidata.org/wiki/${parentId}`
        });
      }
      
      // Add relationship (avoiding duplicates)
      const relationshipKey = `${companyId}-${parentId}`;
      if (!relationshipSet.has(relationshipKey)) {
        relationships.push({
          source: companyId,
          target: parentId,
          type: "owned_by"
        });
        relationshipSet.add(relationshipKey);
      }
    }
  });
  
  return {
    companies: Array.from(companies.values()),
    relationships
  };
}
