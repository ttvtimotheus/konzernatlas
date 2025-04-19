# Konzernatlas - Wer gehört wem?

Eine moderne, minimalistische Web-App zur Visualisierung globaler Konzernverflechtungen, die auf Wikidata-Daten basiert.

## Beschreibung

Konzernatlas ermöglicht es Nutzern, Unternehmen zu suchen und deren Verbindungen zu anderen Unternehmen in Form eines interaktiven Netzwerkgraphen zu visualisieren. Die Daten werden in Echtzeit von Wikidata über SPARQL-Abfragen abgerufen.

## Hauptfunktionen

- **Unternehmenssuche** mit Autovervollständigung
- **Visualisierung von Besitzverhältnissen** in Form eines interaktiven Netzwerkgraphen
- **Anzeige von Details** zu Unternehmen (Name, Branche, Land, Gründungsjahr)
- **Responsive Design** für Desktop und Mobile

## Technologie-Stack

- **Frontend:** Next.js, React
- **Styling:** Tailwind CSS
- **UI-Komponenten:** Radix UI
- **Visualisierung:** D3.js
- **Datenquelle:** Wikidata SPARQL-Endpoint

## Installation

```bash
# Repository klonen
git clone https://github.com/ttvtimotheus/konzernatlas.git
cd konzernatlas

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

## Verwendung

1. Geben Sie den Namen eines Unternehmens in das Suchfeld ein
2. Wählen Sie ein Unternehmen aus den Vorschlägen
3. Der Netzwerkgraph wird automatisch generiert und zeigt die Besitzverhältnisse
4. Fahren Sie mit der Maus über Knoten, um Details zu sehen
5. Ziehen Sie Knoten, um den Graphen neu anzuordnen
6. Zoomen Sie mit dem Mausrad, um die Ansicht anzupassen

## SPARQL Beispiel-Abfrage

```sparql
SELECT ?childCompanyLabel ?parentCompanyLabel
WHERE {
  ?childCompany wdt:P31 wd:Q783794.  # instance of company
  ?childCompany wdt:P127+ ?parentCompany. # 'owned by', beliebig viele Ebenen
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
LIMIT 1000
```

## Mitwirkende

- Timotheus Haseloff

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die LICENSE-Datei für Details.

## Danksagung

- Wikidata für die Bereitstellung der offenen Daten
- D3.js für die Visualisierungs-Bibliothek
- Next.js für das React-Framework


