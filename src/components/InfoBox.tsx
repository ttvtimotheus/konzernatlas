"use client";

import { useState } from "react";

export default function InfoBox() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
        aria-expanded={isOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>Über das Projekt</span>
      </button>

      {isOpen && (
        <div className="mt-3 p-4 border border-border rounded-lg bg-background/30 text-sm max-w-2xl">
          <h3 className="font-semibold mb-2">Konzernatlas: Wer gehört wem?</h3>
          <p className="mb-2">
            Der Konzernatlas visualisiert die Besitzverhältnisse zwischen Unternehmen weltweit.
            Die Daten stammen aus der offenen Wikidata-Datenbank und werden in Echtzeit abgerufen.
          </p>

          <h4 className="font-medium mt-3 mb-1">Wie nutze ich den Konzernatlas?</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Geben Sie einen Unternehmensnamen in das Suchfeld ein</li>
            <li>Wählen Sie ein Unternehmen aus den Vorschlägen</li>
            <li>Der Netzwerkgraph zeigt die Besitzverhältnisse</li>
            <li>Fahren Sie mit der Maus über Knoten, um Details zu sehen</li>
            <li>Nutzen Sie das Mausrad oder die Steuerelemente, um zu zoomen</li>
            <li>Ziehen Sie Knoten, um den Graphen neu anzuordnen</li>
          </ol>

          <p className="mt-3 text-xs text-muted">
            Hinweis: Die Daten basieren auf Wikidata (Wikidata Property P127 - "owned by").
            Die Vollständigkeit und Aktualität der Daten hängt von den Einträgen in Wikidata ab.
          </p>
          
          <button
            onClick={() => setIsOpen(false)}
            className="mt-3 text-primary hover:underline text-xs"
          >
            Schließen
          </button>
        </div>
      )}
    </div>
  );
}
