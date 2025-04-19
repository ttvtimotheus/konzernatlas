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
    keywords: ["Konzernatlas", "Unternehmen", "Konzernverflechtungen", "Wikidata", "Visualisierung", "Unternehmensbesitz"],
    authors: [{ name: "Timotheus Haseloff" }],
    creator: "Timotheus Haseloff",
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
