import { NextRequest, NextResponse } from "next/server";
import { CompanyNode, CompanyRelationship, CompanyGraphData } from "@/types/company";

// Konstanten für API-Anfragen
const API_TIMEOUT = 15000; // 15 Sekunden
const MAX_RESULTS = 30;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const companyId = searchParams.get("id");

  if (!companyId) {
    return NextResponse.json({ error: "Company ID parameter is required" }, { status: 400 });
  }

  try {
    // Direkter Aufruf der Wikidata-API ohne Fallback-Daten
    const data = await getCompanyRelationships(companyId);
      
    // Gültige Daten zurückgeben (leeres Array wenn nichts gefunden wurde)
    return NextResponse.json(data);
  } catch (error: any) {
    // Detaillierte Fehlermeldung mit Stack-Trace
    console.error(`Error fetching data for ${companyId}:`, error);
    
    // Fehlermeldung an den Client zurückgeben
    return NextResponse.json({ 
      error: `Error fetching company data: ${error.message || 'Unknown error'}`,
      companies: [], 
      relationships: [] 
    }, { status: 500 });
  }
}

async function getCompanyRelationships(companyId: string): Promise<CompanyGraphData> {
  // Verbesserte SPARQL-Abfrage für tiefere Unternehmensbeziehungen
  const sparqlQuery = buildSparqlQuery(companyId);

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
    
    return processWikidataResponse(data, companyId);
  } catch (error) {
    console.error("Error processing company relationships:", error);
    throw error;
  }
}

// Funktion zum Erstellen der SPARQL-Abfrage
const buildSparqlQuery = (companyId: string) => {
  return `
    SELECT ?company ?companyLabel ?parent ?parentLabel ?percentage ?industry ?industryLabel ?country ?countryLabel ?inception
    WHERE {
      {
        # Unternehmen besitzt Tochterunternehmen - REKURSIV bis zu 3 Ebenen tief
        wd:${companyId} wdt:P127+ ?company.
        ?company wdt:P31 ?type.
        
        # Nur Organisationen und Unternehmen einbeziehen
        VALUES ?type { wd:Q4830453 wd:Q783794 wd:Q6881511 wd:Q891723 wd:Q43229 }
        
        # Besitzanteil, falls verfügbar
        OPTIONAL {
          wd:${companyId} p:P127 ?ownership.
          ?ownership ps:P127 ?company;
                    pq:P1107 ?percentage.
        }
      } UNION {
        # Unternehmen wird besessen von (eingehende Beziehungen)
        ?parent wdt:P127+ wd:${companyId}.
        ?parent wdt:P31 ?parentType.
        
        # Nur Organisationen und Unternehmen einbeziehen
        VALUES ?parentType { wd:Q4830453 wd:Q783794 wd:Q6881511 wd:Q891723 wd:Q43229 }
      } UNION {
        # Direktbesitz von Unternehmen (nicht rekursiv, um wichtige Partner zu erfassen)
        wd:${companyId} wdt:P127 ?company.
      } UNION {
        # Direktbesitz durch Elternunternehmen
        ?parent wdt:P127 wd:${companyId}.
      }
      
      # Zusätzliche Metadaten für jedes Unternehmen
      OPTIONAL { ?company wdt:P452 ?industry. }  # Branche
      OPTIONAL { ?company wdt:P17 ?country. }    # Land
      OPTIONAL { ?company wdt:P571 ?inception. } # Gründungsdatum
      
      # Label-Service für lesbare Namen
      SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
    }
    LIMIT 50
  `;
};

// Funktion zur Verarbeitung der Wikidata-API-Antwort
const processWikidataResponse = (data: any, companyId: string) => {
  const companies: CompanyNode[] = [];
  const relationships: CompanyRelationship[] = [];
  const processedCompanies = new Set<string>();
  
  // Zuerst das Ausgangsunternehmen als zentralen Knoten hinzufügen
  companies.push({
    id: companyId,
    label: '',  // Wird später aktualisiert
    level: 0,
    nodeType: 'main',
    country: undefined,
    industry: undefined,
    inception: undefined
  });
  processedCompanies.add(companyId);
  
  // Beziehungen verarbeiten mit erweiterten Metadaten
  data.results.bindings.forEach((item: any) => {
    // Elternunternehmen verarbeiten (falls vorhanden)
    if (item.parent?.value) {
      const parentId = item.parent.value.split('/').pop();
      const parentLabel = item.parentLabel?.value || parentId;
      
      if (!processedCompanies.has(parentId)) {
        companies.push({
          id: parentId,
          label: parentLabel,
          level: -1,  // Elternunternehmen haben Level -1
          // Bestimme Knotentyp basierend auf Label-Hinweisen
          nodeType: parentLabel.toLowerCase().includes('holding') || 
                    parentLabel.toLowerCase().includes('group') || 
                    parentLabel.toLowerCase().includes('capital') ? 
                    'holding' : 'parent',
          country: item.countryLabel?.value || undefined,
          industry: item.industryLabel?.value || undefined,
          inception: item.inception?.value ? new Date(item.inception.value).getFullYear().toString() : undefined
        });
        processedCompanies.add(parentId);
      }
      
      // Beziehung mit Besitztyp
      relationships.push({
        source: parentId,
        target: companyId,
        percentage: null,
        type: 'owner' // Elternunternehmen besitzt
      });
    }
    
    // Tochterunternehmen verarbeiten (falls vorhanden)
    if (item.company?.value) {
      const childId = item.company.value.split('/').pop();
      const childLabel = item.companyLabel?.value || childId;
      const percentage = item.percentage?.value ? parseFloat(item.percentage.value) : null;
      
      if (!processedCompanies.has(childId)) {
        companies.push({
          id: childId,
          label: childLabel,
          level: 1,  // Tochterunternehmen haben Level 1
          // Klassifizierung des Knotentyps basierend auf Besitzanteil
          nodeType: percentage && percentage > 50 ? 'full-ownership' : 'partial-ownership',
          country: item.countryLabel?.value || undefined,
          industry: item.industryLabel?.value || undefined,
          inception: item.inception?.value ? new Date(item.inception.value).getFullYear().toString() : undefined
        });
        processedCompanies.add(childId);
      }
      
      // Beziehung mit Besitzanteil
      relationships.push({
        source: companyId,
        target: childId,
        percentage: percentage,
        type: percentage && percentage > 50 ? 'full' : 'partial'
      });
    }
  });
  
  // Update the label for the main company if we found it in the data
  const mainCompanyData = data.results.bindings.find(
    (item: any) => 
      (item.parent?.value && item.parent.value.endsWith(companyId)) || 
      (item.company?.value && item.company.value.endsWith(companyId))
  );
  
  if (mainCompanyData) {
    if (mainCompanyData.parent?.value && mainCompanyData.parent.value.endsWith(companyId)) {
      companies[0].label = mainCompanyData.parentLabel?.value || companies[0].label;
      companies[0].country = mainCompanyData.countryLabel?.value || undefined;
      companies[0].industry = mainCompanyData.industryLabel?.value || undefined;
      companies[0].inception = mainCompanyData.inception?.value ? 
        new Date(mainCompanyData.inception.value).getFullYear().toString() : undefined;
    } else if (mainCompanyData.company?.value && mainCompanyData.company.value.endsWith(companyId)) {
      companies[0].label = mainCompanyData.companyLabel?.value || companies[0].label;
      companies[0].country = mainCompanyData.countryLabel?.value || undefined;
      companies[0].industry = mainCompanyData.industryLabel?.value || undefined;
      companies[0].inception = mainCompanyData.inception?.value ? 
        new Date(mainCompanyData.inception.value).getFullYear().toString() : undefined;
    }
  }
  
  return { companies, relationships };
};
