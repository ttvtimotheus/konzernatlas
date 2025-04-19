import { NextRequest, NextResponse } from "next/server";
import { WikidataCompany } from "@/types/company";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
  }

  try {
    const companies = await searchCompanies(query);
    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error searching companies:", error);
    return NextResponse.json({ error: "Failed to fetch company data" }, { status: 500 });
  }
}

async function searchCompanies(searchTerm: string): Promise<WikidataCompany[]> {
  // SPARQL query to find companies by name
  const sparqlQuery = `
    SELECT DISTINCT ?company ?companyLabel ?companyDescription WHERE {
      ?company wdt:P31/wdt:P279* wd:Q783794.  # instance of company or subclass of company
      ?company rdfs:label ?label.
      FILTER(CONTAINS(LCASE(?label), LCASE("${searchTerm}"))).
      SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en,de". }
    }
    LIMIT 15
  `;

  const url = "https://query.wikidata.org/sparql";
  const fullUrl = `${url}?query=${encodeURIComponent(sparqlQuery)}&format=json`;

  const response = await fetch(fullUrl, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "KonzernatlasApp/1.0 (https://github.com/ttvtimotheus/konzernatlas/)"
    }
  });

  if (!response.ok) {
    throw new Error(`Wikidata API error: ${response.status}`);
  }

  const data = await response.json();
  const results = data.results.bindings;

  return results.map((item: any) => {
    const id = item.company.value.split("/").pop();
    return {
      id,
      label: item.companyLabel?.value || id,
      description: item.companyDescription?.value || ""
    };
  });
}
