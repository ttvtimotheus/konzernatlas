import { NextRequest, NextResponse } from "next/server";
import { CompanyNode, CompanyRelationship, CompanyGraphData } from "@/types/company";

// Konstanten für API-Anfragen
const API_TIMEOUT = 60000; // 60 Sekunden Timeout für komplexe Abfragen
const MAX_RESULTS = 100; // Erweiterte Ergebnismenge für vollständige Darstellung aller Verflechtungen

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
  // Umfassende SPARQL-Abfrage für vollständige Unternehmensverflechtungen
  const sparqlQuery = buildSparqlQuery(companyId);

  const url = "https://query.wikidata.org/sparql";
  const fullUrl = `${url}?query=${encodeURIComponent(sparqlQuery)}&format=json`;

  console.log(`Fetching complete company relationships for: ${companyId}`);
  
  try {
    // Langer Timeout für vollständige Abfrage aller Verflechtungen
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    try {
      const response = await fetch(fullUrl, {
        headers: {
          "Accept": "application/json",
          "User-Agent": "KonzernatlasDemo/1.0",
          "Cache-Control": "no-cache"
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Wikidata API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || !data.results || !data.results.bindings) {
        throw new Error("Invalid response format from Wikidata");
      }
      
      return processWikidataResponse(data, companyId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // Bei Fehler klare Meldung zurückgeben - KEIN Fallback
      if (fetchError.name === 'AbortError') {
        throw new Error(`Die Wikidata-Abfrage für ${companyId} hat ${API_TIMEOUT/1000} Sekunden überschritten. Die Unternehmensstruktur ist zu komplex für eine direkte Abfrage.`);
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error(`Error in getCompanyRelationships for ${companyId}:`, error);
    throw error;
  }
}

// Umfassende SPARQL-Abfrage für ALLE Unternehmensverflechtungen 
// Diese Abfrage ist komplex und kann längere Ladezeiten verursachen
const buildSparqlQuery = (companyId: string) => {
  return `
    SELECT ?company ?companyLabel ?parent ?parentLabel ?percentage ?industry ?industryLabel ?country ?countryLabel ?inception ?description ?headquarters ?headquartersLabel ?logo ?revenue ?revenueLabel ?employees ?employeesNumber ?ceo ?ceoLabel
    WHERE {
      # Grundlegende Informationen über das Hauptunternehmen
      {
        BIND(wd:${companyId} AS ?mainCompany)
        ?mainCompany rdfs:label ?mainCompanyLabel.
        FILTER(LANG(?mainCompanyLabel) = "de" || LANG(?mainCompanyLabel) = "en")
        
        # Umfangreiche Metadaten für das Hauptunternehmen
        OPTIONAL { wd:${companyId} schema:description ?mainDescription. FILTER(LANG(?mainDescription) = "de" || LANG(?mainDescription) = "en") }
        OPTIONAL { wd:${companyId} wdt:P17 ?mainCountry. }    # Land
        OPTIONAL { wd:${companyId} wdt:P452 ?mainIndustry. }  # Branche
        OPTIONAL { wd:${companyId} wdt:P571 ?mainInception. } # Gründungsdatum
        OPTIONAL { wd:${companyId} wdt:P159 ?mainHeadquarters. } # Hauptsitz
        OPTIONAL { wd:${companyId} wdt:P154 ?mainLogo. } # Logo  
        OPTIONAL { wd:${companyId} wdt:P2139 ?mainRevenue. } # Jahresumsatz
        OPTIONAL { wd:${companyId} wdt:P1128 ?mainEmployees. } # Mitarbeiterzahl
        OPTIONAL { wd:${companyId} wdt:P169 ?mainCeo. } # CEO
      }
      
      # REKURSIVE TOCHTERUNTERNEHMEN (bis zu 3 Ebenen tief)
      {
        # Besitz von Unternehmen (rekursiv)
        wd:${companyId} wdt:P127+ ?company.
        ?company wdt:P31 ?type.
        
        # Unternehmen und Organisationen aller Art
        VALUES ?type { 
          wd:Q4830453  # business
          wd:Q783794   # company 
          wd:Q6881511  # enterprise
          wd:Q891723   # public company
          wd:Q43229    # organization
          wd:Q167037   # corporation
          wd:Q7210356  # subsidiary
          wd:Q2221906  # holding
        }
        
        # Besitzanteil, falls verfügbar (für direkte Beziehungen)
        OPTIONAL {
          wd:${companyId} p:P127 ?ownership.
          ?ownership ps:P127 ?company;
                    pq:P1107 ?percentage.
        }
      }
      
      # REKURSIVE ELTERNUNTERNEHMEN (bis zu 3 Ebenen)
      UNION {
        ?parent wdt:P127+ wd:${companyId}.
        ?parent wdt:P31 ?parentType.
        VALUES ?parentType { 
          wd:Q4830453  # business
          wd:Q783794   # company 
          wd:Q6881511  # enterprise
          wd:Q891723   # public company
          wd:Q43229    # organization
          wd:Q167037   # corporation
          wd:Q2221906  # holding
        }
      }
      
      # ERWEITERTE METADATEN für jedes gefundene Unternehmen
      OPTIONAL { ?company wdt:P452 ?industry. }  # Branche
      OPTIONAL { ?company wdt:P17 ?country. }    # Land
      OPTIONAL { ?company wdt:P571 ?inception. } # Gründungsdatum
      OPTIONAL { ?company schema:description ?description. FILTER(LANG(?description) = "de" || LANG(?description) = "en") }
      OPTIONAL { ?company wdt:P159 ?headquarters. } # Hauptsitz
      OPTIONAL { ?company wdt:P154 ?logo. } # Logo
      OPTIONAL { ?company wdt:P2139 ?revenue. } # Jahresumsatz
      OPTIONAL { ?company wdt:P1128 ?employees. } # Mitarbeiterzahl
      OPTIONAL { ?parent wdt:P452 ?parentIndustry. }  # Branche der Elternunternehmen
      OPTIONAL { ?parent wdt:P17 ?parentCountry. }    # Land der Elternunternehmen
      
      # Ausführlicher Label-Service für Namen
      SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
    }
    LIMIT ${MAX_RESULTS}
  `;
};

// Funktion zur Verarbeitung der Wikidata-API-Antwort mit erweiterten Metadaten
const processWikidataResponse = (data: any, companyId: string): CompanyGraphData => {
  const companies: CompanyNode[] = [];
  const relationships: CompanyRelationship[] = [];
  const processedCompanies = new Set<string>();
  
  // Hauptunternehmen hinzufügen (wird mit Daten aus der Abfrage aktualisiert)
  companies.push({
    id: companyId,
    label: 'Unbekanntes Unternehmen', // Fallback-Label
    level: 0,
    nodeType: 'main',
    description: undefined,
    country: undefined,
    industry: undefined,
    inception: undefined,
    founded: undefined,
    headquarters: undefined,
    wikidata: `https://www.wikidata.org/wiki/${companyId}`
  });
  processedCompanies.add(companyId);
  
  try {
    // Suche nach dem Hauptunternehmen in den Ergebnissen
    const mainCompanyEntry = data.results.bindings.find((item: any) => 
      (item.mainCompany?.value && item.mainCompany.value.includes(companyId))
    );
    
    // Falls gefunden, aktualisiere die Hauptunternehmensinformationen
    if (mainCompanyEntry) {
      companies[0].label = mainCompanyEntry.mainCompanyLabel?.value || companies[0].label;
    }
    
    // Alle Einträge verarbeiten
    data.results.bindings.forEach((item: any) => {
      try {
        // Elternunternehmen verarbeiten (falls vorhanden)
        if (item.parent?.value) {
          const parentId = item.parent.value.split('/').pop();
          const parentLabel = item.parentLabel?.value || `Unternehmen ${parentId}`;
          
          if (!processedCompanies.has(parentId)) {
            // Bestimme den Knotentyp basierend auf Label-Hinweisen
            const nodeType = parentLabel.toLowerCase().includes('holding') || 
                          parentLabel.toLowerCase().includes('group') || 
                          parentLabel.toLowerCase().includes('capital') ? 
                          'holding' : 'parent';
            
            // Erstellung einer Elternunternehmensnode mit erweiterten Informationen
            companies.push({
              id: parentId,
              label: parentLabel,
              level: -1,  // Elternunternehmen haben Level -1
              nodeType,
              country: item.countryLabel?.value || undefined,
              industry: item.industryLabel?.value || undefined,
              inception: item.inception?.value ? new Date(item.inception.value).getFullYear().toString() : undefined,
              founded: item.inception?.value ? new Date(item.inception.value).toLocaleDateString() : undefined,
              description: item.description?.value || undefined,
              headquarters: item.headquartersLabel?.value || undefined,
              wikidata: `https://www.wikidata.org/wiki/${parentId}`
            });
            processedCompanies.add(parentId);
          }
          
          // Beziehung mit Besitztyp
          relationships.push({
            source: parentId,
            target: companyId,
            percentage: null,
            type: 'owner', // Elternunternehmen besitzt
            value: 3 // Für D3.js-Visualisierung (Stärke der Verbindung)
          });
        }
        
        // Tochterunternehmen verarbeiten (falls vorhanden)
        if (item.company?.value) {
          const childId = item.company.value.split('/').pop();
          
          // Sicherstellen, dass es sich nicht um das Hauptunternehmen handelt
          if (childId !== companyId) {
            const childLabel = item.companyLabel?.value || `Unternehmen ${childId}`;
            const percentage = item.percentage?.value ? parseFloat(item.percentage.value) : null;
            
            if (!processedCompanies.has(childId)) {
              // Klassifizierung des Knotentyps basierend auf Besitzanteil
              const nodeType = percentage && percentage > 50 ? 'full-ownership' : 'partial-ownership';
              
              // Erstellung einer Tochterunternehmensnode mit erweiterten Informationen
              companies.push({
                id: childId,
                label: childLabel,
                level: 1,  // Tochterunternehmen haben Level 1
                nodeType,
                country: item.countryLabel?.value || undefined,
                industry: item.industryLabel?.value || undefined,
                inception: item.inception?.value ? new Date(item.inception.value).getFullYear().toString() : undefined,
                founded: item.inception?.value ? new Date(item.inception.value).toLocaleDateString() : undefined,
                description: item.description?.value || undefined,
                headquarters: item.headquartersLabel?.value || undefined,
                wikidata: `https://www.wikidata.org/wiki/${childId}`
              });
              processedCompanies.add(childId);
            }
            
            // Beziehung mit Besitzanteil
            relationships.push({
              source: companyId,
              target: childId,
              percentage,
              type: percentage && percentage > 50 ? 'full' : 'partial',
              value: percentage ? Math.max(1, Math.min(5, percentage / 20)) : 2 // Für D3.js-Visualisierung (1-5 basierend auf Prozentsatz)
            });
          }
        }
      } catch (itemError) {
        console.warn('Error processing relationship item:', itemError);
        // Einzelne Fehler beim Verarbeiten von Items ignorieren, um Robustheit zu gewährleisten
      }
    });
    
    // Aktualisiere das Hauptunternehmen mit Metadaten aus allen Einträgen
    const mainCompanyMetadata = data.results.bindings.find((item: any) => {
      return (item.parent?.value && item.parent.value.includes(companyId)) || 
             (item.company?.value && item.company.value.includes(companyId));
    });
    
    if (mainCompanyMetadata) {
      // Vorhandene Felder aktualisieren, wenn verfügbar
      companies[0].country = companies[0].country || mainCompanyMetadata.countryLabel?.value;
      companies[0].industry = companies[0].industry || mainCompanyMetadata.industryLabel?.value;
      companies[0].description = companies[0].description || mainCompanyMetadata.description?.value;
      companies[0].headquarters = companies[0].headquarters || mainCompanyMetadata.headquartersLabel?.value;
      
      if (mainCompanyMetadata.inception?.value) {
        const inceptionDate = new Date(mainCompanyMetadata.inception.value);
        companies[0].inception = companies[0].inception || inceptionDate.getFullYear().toString();
        companies[0].founded = companies[0].founded || inceptionDate.toLocaleDateString();
      }
    }
    
    // Wenn keine Beziehungen gefunden wurden, aber Unternehmensdaten vorhanden sind, Log-Eintrag erstellen
    if (companies.length > 1 && relationships.length === 0) {
      console.warn(`Companies found for ${companyId}, but no relationships could be established`);
    }
    
  } catch (processingError) {
    console.error('Error during response processing:', processingError);
    // Bei Verarbeitungsfehlern zumindest das Hauptunternehmen zurückgeben
  }
  
  return { companies, relationships };
};
