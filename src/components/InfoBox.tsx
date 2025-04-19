"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

export default function InfoBox() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button 
          className="fixed bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-cyan-600 text-white shadow-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          aria-label="Projekt Information"
        >
          <span className="text-xl font-bold">i</span>
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fadeIn" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-[90vw] max-h-[85vh] overflow-auto bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-700 focus:outline-none">
          <Dialog.Title className="text-xl font-bold mb-4 text-white">Über Konzernatlas</Dialog.Title>
          <Dialog.Description className="text-gray-300 mt-2 text-sm leading-relaxed">
            Konzernatlas visualisiert Unternehmensbeziehungen und -verflechtungen auf Basis öffentlich verfügbarer Daten aus Wikidata.
          </Dialog.Description>
          
          <div className="mt-4 space-y-4">
            <section>
              <h3 className="text-lg font-medium text-white">Datenquelle</h3>
              <p className="mt-2 text-sm text-gray-300">
                Die Daten werden direkt von Wikidata über deren SPARQL-Endpoint abgefragt. Die Visualisierung zeigt dabei die Eigenschaft "Gehört zu" (P127), die Eigentumsverhältnisse zwischen Unternehmen abbildet.
              </p>
            </section>
            
            <section>
              <h3 className="text-lg font-medium text-white">Nutzung</h3>
              <p className="mt-2 text-sm text-gray-300">
                Suchen Sie nach einem Unternehmen und wählen Sie einen Eintrag aus den Vorschlägen. Das Netzwerkdiagramm zeigt dann die Eigentumsverhältnisse des ausgewählten Unternehmens.
              </p>
              <ul className="list-disc list-inside mt-2 text-sm text-gray-300 space-y-1">
                <li>Ziehen Sie Knoten, um das Diagramm neu zu arrangieren</li>
                <li>Zoomen Sie mit dem Mausrad oder Pinch-Geste</li>
                <li>Klicken Sie auf ein Unternehmen für mehr Details</li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-medium text-white">Einschränkungen</h3>
              <p className="mt-2 text-sm text-gray-300">
                Die Datenqualität und -vollständigkeit hängt von Wikidata ab. Nicht alle Unternehmensbeziehungen sind dort vollständig oder aktuell erfasst.
              </p>
            </section>
          </div>
          
          <div className="mt-6 border-t border-gray-700 pt-4 text-xs text-gray-400">
            <p>
              Dieses Projekt ist Open Source und wurde mit Next.js, D3.js und Tailwind CSS entwickelt.
            </p>
            <p className="mt-1">
              Daten: <a href="https://www.wikidata.org" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Wikidata</a> (CC0)
            </p>
          </div>
          
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full w-6 h-6 text-gray-400 hover:text-white focus:outline-none"
              aria-label="Schließen"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
