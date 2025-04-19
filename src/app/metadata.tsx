import { Metadata } from "next";

const defaultTitle = "Konzernatlas - Wer gehört wem?";
const defaultDescription = "Eine Visualisierung globaler Konzernverflechtungen basierend auf Wikidata-Daten. Entdecken Sie, wem welche Unternehmen gehören.";

export const getMetadata = (
  title?: string,
  description: string = defaultDescription
): Metadata => {
  const metaTitle = title ? `${title} | Konzernatlas` : defaultTitle;
  
  return {
    title: metaTitle,
    description,
    keywords: ["Konzernatlas", "Unternehmensverflechtungen", "Konzernverflechtungen", "Corporate ownership", "Corporate networks", "Unternehmensnetzwerke", "Global corporate structures", "Firmenbesitz", "Corporate transparency", "Konzerntransparenz", "Wirtschaftsmacht", "Capitalism criticism", "Kapitalismuskritik", "Graph visualization", "Netzwerkvisualisierung", "D3.js network", "SPARQL query", "Open data visualization", "Next.js web app", "Wikidata API"],
    authors: [{ name: "Timo Haseloff" }],
    creator: "Timo Haseloff",
    openGraph: {
      title: metaTitle,
      description,
      type: "website",
      locale: "de_DE",
      siteName: "Konzernatlas",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description,
    },
    metadataBase: new URL("https://konzernatlas.netlify.app")
  };
};
