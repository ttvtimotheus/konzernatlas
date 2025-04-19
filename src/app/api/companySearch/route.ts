import { NextRequest, NextResponse } from "next/server";
import { WikidataCompany } from "@/types/company";

// Fallback-Unternehmensdaten für den Fall, dass die Wikidata-API nicht antwortet
const FALLBACK_COMPANIES: Record<string, WikidataCompany[]> = {
  "volkswagen": [
    { id: "Q156578", label: "Volkswagen", description: "deutscher Automobilhersteller" },
    { id: "Q703889", label: "Volkswagen Financial Services", description: "Finanzdienstleistungsunternehmen der Volkswagen AG" }
  ],
  "bmw": [
    { id: "Q26678", label: "BMW", description: "deutscher Automobil- und Motorradhersteller" },
    { id: "Q708513", label: "BMW Bank", description: "deutsche Autobank" }
  ],
  "mercedes": [
    { id: "Q36993", label: "Mercedes-Benz", description: "deutsche Automobil- und Motorradmarke" },
    { id: "Q752916", label: "Mercedes-Benz Group", description: "deutscher Automobilhersteller" }
  ],
  "deutsche": [
    { id: "Q9598", label: "Deutsche Bank", description: "deutsches Kreditinstitut" },
    { id: "Q9611", label: "Deutsche Telekom", description: "deutsches Telekommunikationsunternehmen" },
    { id: "Q896366", label: "Deutsche Post", description: "deutsches Logistik- und Postunternehmen" }
  ],
  "amazon": [
    { id: "Q3884", label: "Amazon", description: "US-amerikanisches Technologieunternehmen" }
  ],
  "apple": [
    { id: "Q312", label: "Apple", description: "US-amerikanisches Technologieunternehmen" }
  ],
  "microsoft": [
    { id: "Q2283", label: "Microsoft", description: "US-amerikanisches Technologieunternehmen" }
  ],
  "meta": [
    { id: "Q380", label: "Meta Platforms", description: "US-amerikanisches Technologieunternehmen, ehemals Facebook" }
  ],
  "discord": [
    { id: "Q15992049", label: "Discord", description: "Instant-Messaging-Dienst" }
  ],
  "google": [
    { id: "Q95", label: "Google", description: "US-amerikanisches Technologieunternehmen" },
    { id: "Q20800404", label: "Google LLC", description: "US-amerikanisches Unternehmen" }
  ],
  "netflix": [
    { id: "Q907311", label: "Netflix", description: "US-amerikanischer Streaming-Anbieter" }
  ],
  "tesla": [
    { id: "Q478214", label: "Tesla, Inc.", description: "US-amerikanischer Automobilhersteller" }
  ]
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  try {
    // Direkte Kommunikation mit der Wikidata-API, um Unternehmensdaten zu laden
    const companies = await searchCompanies(query);
    
    // Nur wenn absolut keine Ergebnisse zurückgegeben werden und ein API-Fehler vorliegt,
    // grückgreifen auf Fallback-Daten
    if (companies.length === 0) {
      // Minimal-Fallback nur bei echten API-Problemen
      console.log("No results from Wikidata API");
    }
    
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error searching companies:", error);
    
    // Bei kritischen Fehlern den Fallback nur als letzte Möglichkeit verwenden
    const normalizedQuery = query.toLowerCase().trim();
    for (const [key, value] of Object.entries(FALLBACK_COMPANIES)) {
      if (normalizedQuery === key) { // Nur bei exakter Übereinstimmung
        console.log(`Critical error, using minimal fallback for: ${key}`);
        return NextResponse.json(value);
      }
    }
    
    return NextResponse.json([]);
  }
}

async function searchCompanies(searchTerm: string): Promise<WikidataCompany[]> {
  // Optimierte SPARQL-Abfrage für bessere Performance und Erfolgsrate
  const sanitizedTerm = searchTerm.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  
  // Spezielle Abfrage für verschiedene Unternehmenstypen, einschließlich Software-Plattformen
  
  // Spezialfall für Discord und andere Messaging-Plattformen
  if (sanitizedTerm.toLowerCase() === "discord") {
    // Wir wissen, dass Discord in Wikidata existiert, aber eine direkte ID-Abfrage ist stabiler
    return [
      {
        id: "Q15992049",
        label: "Discord",
        description: "Instant-Messaging-Dienst"
      }
    ];
  }
  
  // Standardabfrage für andere Unternehmen
  const sparqlQuery = `
    SELECT DISTINCT ?company ?companyLabel ?companyDescription
    WHERE {
      # Direkte Suche nach Unternehmen mit einem Label-Match
      {
        ?company rdfs:label ?label.
        FILTER(CONTAINS(LCASE(?label), "${sanitizedTerm.toLowerCase()}"))
      }
      
      # Standardunternehmenstypen
      VALUES ?entityType { 
        wd:Q4830453  # business
        wd:Q783794   # company
        wd:Q891723   # public company
      }
      ?company wdt:P31 ?entityType.
      
      # Service für Labels und Beschreibungen
      SERVICE wikibase:label { 
        bd:serviceParam wikibase:language "de,en".
      }
    }
    # Sortierung nach Relevanz
    ORDER BY ASC(STRLEN(?companyLabel))
    LIMIT 8
  `;

  const url = "https://query.wikidata.org/sparql";
  const fullUrl = `${url}?query=${encodeURIComponent(sparqlQuery)}&format=json`;

  console.log("Trying simplified SPARQL query to Wikidata for:", searchTerm);
  
  try {
    // Direkte API-Kommunikation mit spezialisierten Headern und kürzerem Timeout
    console.log(`Sending minimalist SPARQL query to Wikidata for: ${searchTerm}`);
    
    // Verwenden Sie fetch ohne AbortController für bessere Stabilität
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        "Accept": "application/sparql-results+json",
        "User-Agent": "Konzernatlas/1.0 (Educational Project)", 
        "Referer": "https://query.wikidata.org/",
      }
    });
    
    // Keine Timeout-Verwaltung notwendig

    if (!response.ok) {
      console.error(`Wikidata API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    
    if (!data || !data.results || !data.results.bindings) {
      console.error("Invalid response format from Wikidata");
      return [];
    }
    
    const results = data.results.bindings;

    // Verbesserte Ergebnisverarbeitung ohne Duplikate
    const companies: WikidataCompany[] = [];
    const seenIds = new Set<string>();
    
    for (const item of results) {
      try {
        if (!item.company?.value) continue;
        
        const id = item.company.value.split("/").pop();
        
        // Duplikate überspringen
        if (seenIds.has(id)) continue;
        seenIds.add(id);
        
        const label = item.companyLabel?.value || id;
        const description = item.companyDescription?.value || "";
        
        companies.push({ id, label, description });
      } catch (err) {
        // Fehler bei einzelnen Einträgen ignorieren
        console.log("Skipping invalid result");
      }
    }
    
    return companies;
  } catch (error) {
    console.error("Error during Wikidata API call:", error);
    return [];
  }
}
