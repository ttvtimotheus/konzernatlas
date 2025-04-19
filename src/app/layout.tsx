import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Konzernatlas - Unternehmensbeziehungen visualisiert",
  description: "Visualisiere Unternehmensbeziehungen und Eigentumsverhältnisse auf Basis von Wikidata",
  keywords: ["Unternehmensbeziehungen", "Konzernstruktur", "Datenvisualisierung", "Wikidata"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-gray-950 text-white antialiased`}
      >
        <header className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-cyan-400">Konzernatlas</div>
            <nav className="text-sm">
              <a href="https://github.com/ttvtimotheus/konzernatlas" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                GitHub
              </a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
          <p>
            Daten via <a href="https://www.wikidata.org" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:text-cyan-500 transition-colors">Wikidata</a> (CC0) • 
            © {new Date().getFullYear()} Konzernatlas
          </p>
        </footer>
      </body>
    </html>
  );
}
