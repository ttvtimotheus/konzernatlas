import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Konzernatlas - Wer gehört wem?",
  description: "Eine Visualisierung globaler Konzernverflechtungen basierend auf Wikidata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <main className="min-h-screen p-4 md:p-8">
          {children}
        </main>
        <footer className="attribution">
          Data from <a href="https://www.wikidata.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Wikidata</a>
        </footer>
      </body>
    </html>
  );
}
