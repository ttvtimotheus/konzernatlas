import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Logo from "@/components/Logo";
import { getMetadata } from "./metadata";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = getMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="/custom-icon.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <header className="border-b border-border py-3 mb-6">
          <div className="container mx-auto flex justify-between items-center px-4">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-xl font-bold">Konzernatlas</span>
            </div>
            <a 
              href="https://github.com/ttvtimotheus/konzernatlas" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </header>
        <main className="min-h-screen p-4 md:p-8">
          {children}
        </main>
        <footer className="attribution border-t border-border py-4 mt-8">
          <div className="container mx-auto text-center">
            <p>Data from <a href="https://www.wikidata.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Wikidata</a></p>
            <p className="text-xs text-muted mt-1">© {new Date().getFullYear()} Konzernatlas</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
