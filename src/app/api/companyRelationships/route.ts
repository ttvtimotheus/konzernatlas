import { NextRequest, NextResponse } from "next/server";
import { CompanyNode, CompanyRelationship, CompanyGraphData } from "@/types/company";

// Fallback-Daten für Unternehmensbeziehungen
const FALLBACK_RELATIONSHIPS: Record<string, CompanyGraphData> = {
  // Volkswagen
  "Q156578": {
    companies: [
      { id: "Q156578", label: "Volkswagen", country: "Deutschland", industry: "Automobilindustrie", url: "https://www.wikidata.org/wiki/Q156578" },
      { id: "Q703889", label: "Volkswagen Financial Services", country: "Deutschland", url: "https://www.wikidata.org/wiki/Q703889" },
      { id: "Q165284", label: "Audi", country: "Deutschland", industry: "Automobilindustrie", url: "https://www.wikidata.org/wiki/Q165284" },
      { id: "Q40", label: "Porsche", country: "Deutschland", industry: "Automobilindustrie", url: "https://www.wikidata.org/wiki/Q40" },
      { id: "Q41318", label: "SEAT", country: "Spanien", industry: "Automobilindustrie", url: "https://www.wikidata.org/wiki/Q41318" },
      { id: "Q25169", label: "Škoda Auto", country: "Tschechien", industry: "Automobilindustrie", url: "https://www.wikidata.org/wiki/Q25169" },
      { id: "Q38495", label: "Lamborghini", country: "Italien", industry: "Automobilindustrie", url: "https://www.wikidata.org/wiki/Q38495" },
      { id: "Q152175", label: "Bentley", country: "Vereinigtes Königreich", industry: "Automobilindustrie", url: "https://www.wikidata.org/wiki/Q152175" },
      { id: "Q36993", label: "Mercedes-Benz", country: "Deutschland", industry: "Automobilindustrie", url: "https://www.wikidata.org/wiki/Q36993" }
    ],
    relationships: [
      { source: "Q703889", target: "Q156578", type: "owned_by" },
      { source: "Q165284", target: "Q156578", type: "owned_by" },
      { source: "Q41318", target: "Q156578", type: "owned_by" },
      { source: "Q25169", target: "Q156578", type: "owned_by" },
      { source: "Q38495", target: "Q165284", type: "owned_by" },
      { source: "Q152175", target: "Q156578", type: "owned_by" }
    ]
  },
  
  // BMW
  "Q26678": {
    companies: [
      { id: "Q26678", label: "BMW", country: "Deutschland", industry: "Automobilindustrie", url: "https://www.wikidata.org/wiki/Q26678" },
      { id: "Q708513", label: "BMW Bank", country: "Deutschland", industry: "Finanzdienstleistungen", url: "https://www.wikidata.org/wiki/Q708513" },
      { id: "Q152982", label: "Mini", country: "Vereinigtes Königreich", industry: "Automobilindustrie", url: "https://www.wikidata.org/wiki/Q152982" },
      { id: "Q30304", label: "Rolls-Royce Motor Cars", country: "Vereinigtes Königreich", industry: "Automobilindustrie", url: "https://www.wikidata.org/wiki/Q30304" }
    ],
    relationships: [
      { source: "Q708513", target: "Q26678", type: "owned_by" },
      { source: "Q152982", target: "Q26678", type: "owned_by" },
      { source: "Q30304", target: "Q26678", type: "owned_by" }
    ]
  },
  
  // Deutsche Telekom
  "Q9611": {
    companies: [
      { id: "Q9611", label: "Deutsche Telekom", country: "Deutschland", industry: "Telekommunikation", url: "https://www.wikidata.org/wiki/Q9611" },
      { id: "Q1137652", label: "T-Mobile US", country: "Vereinigte Staaten", industry: "Telekommunikation", url: "https://www.wikidata.org/wiki/Q1137652" },
      { id: "Q705229", label: "Telekom Deutschland", country: "Deutschland", industry: "Telekommunikation", url: "https://www.wikidata.org/wiki/Q705229" }
    ],
    relationships: [
      { source: "Q1137652", target: "Q9611", type: "owned_by" },
      { source: "Q705229", target: "Q9611", type: "owned_by" }
    ]
  },
  
  // Meta Platforms
  "Q380": {
    companies: [
      { id: "Q380", label: "Meta Platforms", country: "Vereinigte Staaten", industry: "Technologie", url: "https://www.wikidata.org/wiki/Q380" },
      { id: "Q355", label: "Facebook", country: "Vereinigte Staaten", industry: "Soziale Medien", url: "https://www.wikidata.org/wiki/Q355" },
      { id: "Q209330", label: "Instagram", country: "Vereinigte Staaten", industry: "Soziale Medien", url: "https://www.wikidata.org/wiki/Q209330" },
      { id: "Q1029", label: "WhatsApp", country: "Vereinigte Staaten", industry: "Messaging", url: "https://www.wikidata.org/wiki/Q1029" },
      { id: "Q2301597", label: "Oculus VR", country: "Vereinigte Staaten", industry: "Virtual Reality", url: "https://www.wikidata.org/wiki/Q2301597" }
    ],
    relationships: [
      { source: "Q355", target: "Q380", type: "owned_by" },
      { source: "Q209330", target: "Q380", type: "owned_by" },
      { source: "Q1029", target: "Q380", type: "owned_by" },
      { source: "Q2301597", target: "Q380", type: "owned_by" }
    ]
  }
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const companyId = searchParams.get("id");

  if (!companyId) {
    return NextResponse.json({ error: "Company ID parameter is required" }, { status: 400 });
  }

  try {
    // Prüfe zuerst, ob wir Fallback-Daten für dieses Unternehmen haben
    if (FALLBACK_RELATIONSHIPS[companyId]) {
      console.log(`Using curated fallback data for ${companyId}`);
      return NextResponse.json(FALLBACK_RELATIONSHIPS[companyId]);
    }
    
    // Wenn keine Fallback-Daten vorhanden sind, versuche die Wikidata-API
    let data: CompanyGraphData;
    
    try {
      data = await getCompanyRelationships(companyId);
      
      // Wenn keine Daten zurückgegeben wurden, leere Struktur zurückgeben
      if (!data.companies.length) {
        console.log(`No companies found for ${companyId}`);
        data = { companies: [], relationships: [] };
      }
    } catch (apiError) {
      console.error("Wikidata API error:", apiError);
      // Leere Datenstruktur zurückgeben bei API-Fehler
      data = { companies: [], relationships: [] };
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected error:", error);
    // Im Fehlerfall leere Datenstruktur zurückgeben
    return NextResponse.json({ companies: [], relationships: [] });
  }
}

async function getCompanyRelationships(companyId: string): Promise<CompanyGraphData> {
  // Vereinfachte SPARQL-Abfrage mit weniger Komplexität
  const sparqlQuery = `
    SELECT ?company ?companyLabel ?parentCompany ?parentCompanyLabel ?industry ?industryLabel ?country ?countryLabel ?inception
    WHERE {
      # Zielunternehmen definieren
      VALUES ?targetCompany { wd:${companyId} }
      
      # Verbundene Unternehmen finden (direktere Abfrage)
      {
        # Unternehmen im Besitz des Zielunternehmens (nur direkte Beziehung)
        ?targetCompany wdt:P127 ?company.
      } UNION {
        # Unternehmen, die das Zielunternehmen besitzen (nur direkte Beziehung)
        ?company wdt:P127 ?targetCompany.
      } UNION {
        # Das Zielunternehmen selbst einbeziehen
        FILTER(?company = ?targetCompany)
      }
      
      # Eltern-Kind-Beziehungen
      OPTIONAL { ?company wdt:P127 ?parentCompany. }
      
      # Zusätzliche Informationen über Unternehmen
      OPTIONAL { ?company wdt:P452 ?industry. }
      OPTIONAL { ?company wdt:P17 ?country. }
      OPTIONAL { ?company wdt:P571 ?inception. }
      
      # Labels für alle Entitäten
      SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
    }
    LIMIT 50
  `;

  const url = "https://query.wikidata.org/sparql";
  const fullUrl = `${url}?query=${encodeURIComponent(sparqlQuery)}&format=json`;

  console.log(`Fetching company relationships for: ${companyId}`);
  
  try {
    const response = await fetch(fullUrl, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "KonzernatlasDemo/1.0"
      },
      // Timeout hinzufügen
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) {
      console.error(`Wikidata API error: ${response.status} ${response.statusText}`);
      throw new Error(`Wikidata API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || !data.results || !data.results.bindings) {
      console.error("Invalid response format from Wikidata");
      throw new Error("Invalid response format");
    }
    
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
  } catch (error) {
    console.error("Error processing company relationships:", error);
    throw error;
  }
}
