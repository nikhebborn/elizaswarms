# ELIZA WebApp - README

Eine WebApp zur Konfiguration und Erstellung von KI-Agenten mit dem ELIZA Framework.

## Übersicht

Die ELIZA WebApp ermöglicht es Benutzern, KI-Agenten zu erstellen, zu verwalten und zu testen. Die Anwendung ist in drei Hauptbereiche unterteilt:

1. **Agents**: Erstellung, Verwaltung und Testen von KI-Agenten
2. **Rooms**: Konfiguration von Räumen für Agenten-Interaktionen (zukünftige Erweiterung)
3. **LIVE**: Echtzeit-Beobachtung und Interaktion mit Agenten (zukünftige Erweiterung)

## Funktionen

### Agents-Bereich

- **Agents-Liste**: Übersicht aller erstellten Agents mit Suchfunktion
- **Agent erstellen**: Formular zur Erstellung neuer Agents mit:
  - Individueller Charaktergestaltung (Name, Beschreibung, Persona, Ziele, Einschränkungen)
  - LLM-Auswahl (aktuell Gemini)
  - Knowledge-Management zum Hinzufügen von Wissen durch Text, Dateien oder URLs
- **Agent verwalten**: Bearbeitung bestehender Agents und Aktualisierung ihres Wissens
- **Agent testen**: Chat-Interface zur Interaktion mit den erstellten Agents

## Technologie-Stack

- **Frontend**: Next.js mit TypeScript, React, Tailwind CSS
- **Formulare**: React Hook Form mit Zod für Validierung
- **HTTP-Anfragen**: Axios
- **Icons**: React Icons
- **API-Integration**: ELIZA API über HTTP-Anfragen (Mock-Implementierung für Entwicklung)

## Installation

1. Repository klonen:
   ```bash
   git clone https://github.com/your-username/eliza-webapp.git
   cd eliza-webapp
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

4. Öffnen Sie [http://localhost:3000](http://localhost:3000) in Ihrem Browser.

## Deployment

Für Deployment-Anweisungen siehe [DEPLOYMENT.md](./DEPLOYMENT.md).

## Umgebungsvariablen

Erstellen Sie eine `.env.local`-Datei im Hauptverzeichnis mit folgenden Variablen:

```
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyC21K8CzPtcbw36mKpqOM8pJKxgR7ZhR1Q
```

## Projektstruktur

```
eliza-webapp/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── agents/           # Agents-Bereich
│   │   ├── rooms/            # Rooms-Bereich (Platzhalter)
│   │   ├── live/             # LIVE-Bereich (Platzhalter)
│   │   ├── layout.tsx        # Haupt-Layout
│   │   └── page.tsx          # Startseite
│   ├── components/           # React-Komponenten
│   │   ├── ui/               # UI-Komponenten
│   │   ├── agents/           # Agent-spezifische Komponenten
│   │   ├── layout/           # Layout-Komponenten
│   │   └── shared/           # Gemeinsam genutzte Komponenten
│   ├── lib/                  # Bibliotheken und Hilfsfunktionen
│   │   ├── api/              # API-Funktionen
│   │   ├── utils/            # Hilfsfunktionen
│   │   └── types/            # TypeScript-Typdefinitionen
│   └── hooks/                # React-Hooks
├── public/                   # Statische Assets
└── ...                       # Konfigurationsdateien
```

## Zukünftige Erweiterungen

- **Rooms-Bereich**: Konfiguration von Räumen für Agenten-Interaktionen
- **LIVE-Bereich**: Echtzeit-Beobachtung und Interaktion mit Agenten
- **Verbesserte LLM-Integration**: Unterstützung für weitere LLM-Provider
- **Erweiterte Knowledge-Verarbeitung**: Verbesserte Verarbeitung von Dokumenten und Medien

## Lizenz

MIT
