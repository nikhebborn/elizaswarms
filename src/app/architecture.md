# ELIZA WebApp Architektur

## Übersicht

Die ELIZA WebApp ist eine Next.js-Anwendung, die es Benutzern ermöglicht, KI-Agenten zu erstellen, zu verwalten und zu testen. Die Anwendung wird in drei Hauptbereiche unterteilt:

1. **Agents**: Erstellung, Verwaltung und Testen von KI-Agenten
2. **Rooms**: Konfiguration von Räumen für Agenten-Interaktionen (zukünftige Erweiterung)
3. **LIVE**: Echtzeit-Beobachtung und Interaktion mit Agenten (zukünftige Erweiterung)

Wir beginnen mit der Implementierung des Agents-Bereichs als eigenständiges Modul.

## Technologie-Stack

- **Frontend**: Next.js mit TypeScript, React, Tailwind CSS
- **Formulare**: React Hook Form mit Zod für Validierung
- **HTTP-Anfragen**: Axios
- **Icons**: React Icons
- **API-Integration**: ELIZA API über HTTP-Anfragen

## Ordnerstruktur

```
eliza-webapp/
├── src/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── manage/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── test/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── rooms/
│   │   │   └── page.tsx (Platzhalter für zukünftige Erweiterung)
│   │   ├── live/
│   │   │   └── page.tsx (Platzhalter für zukünftige Erweiterung)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   └── ... (weitere UI-Komponenten)
│   │   ├── agents/
│   │   │   ├── agent-form.tsx
│   │   │   ├── agent-list.tsx
│   │   │   ├── agent-card.tsx
│   │   │   ├── knowledge-uploader.tsx
│   │   │   └── chat-interface.tsx
│   │   ├── layout/
│   │   │   ├── navbar.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── footer.tsx
│   │   └── shared/
│   │       ├── search-bar.tsx
│   │       └── loading-spinner.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── agent.ts
│   │   │   ├── knowledge.ts
│   │   │   └── chat.ts
│   │   ├── utils/
│   │   │   ├── helpers.ts
│   │   │   └── validators.ts
│   │   └── types/
│   │       ├── agent.ts
│   │       ├── knowledge.ts
│   │       └── chat.ts
│   └── hooks/
│       ├── use-agents.ts
│       ├── use-knowledge.ts
│       └── use-chat.ts
├── public/
│   └── ... (statische Assets)
└── ... (Konfigurationsdateien)
```

## Datenmodelle

### Agent

```typescript
interface Agent {
  id: string;
  name: string;
  description: string;
  character: {
    persona: string;
    goals: string[];
    constraints: string[];
  };
  llm: {
    provider: string;
    model: string;
    temperature: number;
  };
  knowledge: Knowledge[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Knowledge

```typescript
interface Knowledge {
  id: string;
  agentId: string;
  type: 'text' | 'file' | 'url';
  content: string;
  filename?: string;
  fileType?: string;
  createdAt: Date;
}
```

### Message

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

## Routing-Struktur

- `/`: Startseite mit Übersicht und Navigation zu den drei Hauptbereichen
- `/agents`: Liste aller erstellten Agenten mit Suchfunktion
- `/agents/create`: Formular zur Erstellung eines neuen Agenten
- `/agents/[id]`: Detailansicht eines Agenten
- `/agents/[id]/manage`: Verwaltung und Aktualisierung eines Agenten
- `/agents/[id]/test`: Chat-Interface zum Testen eines Agenten
- `/rooms`: Platzhalter für zukünftige Erweiterung
- `/live`: Platzhalter für zukünftige Erweiterung

## API-Integration

Da wir die ELIZA-Pakete nicht direkt installieren konnten, werden wir einen alternativen Ansatz verwenden:

1. **Direkte API-Aufrufe**: Verwendung von Axios für HTTP-Anfragen an die ELIZA API
2. **Mock-Implementierung**: Für die Entwicklung erstellen wir eine lokale Mock-Implementierung der ELIZA-Funktionalität
3. **Gemini-Integration**: Direkte Integration mit der Gemini API für die LLM-Funktionalität

### API-Endpunkte

- `POST /api/agents`: Erstellen eines neuen Agenten
- `GET /api/agents`: Abrufen aller Agenten
- `GET /api/agents/:id`: Abrufen eines bestimmten Agenten
- `PUT /api/agents/:id`: Aktualisieren eines Agenten
- `DELETE /api/agents/:id`: Löschen eines Agenten
- `POST /api/agents/:id/knowledge`: Hinzufügen von Wissen zu einem Agenten
- `GET /api/agents/:id/knowledge`: Abrufen des Wissens eines Agenten
- `DELETE /api/agents/:id/knowledge/:knowledgeId`: Löschen von Wissen
- `POST /api/agents/:id/chat`: Senden einer Nachricht an einen Agenten

## Zustandsmanagement

- **Server-Komponenten**: Verwendung von Next.js Server-Komponenten für datenintensive Operationen
- **Client-Komponenten**: Verwendung von React-Hooks für clientseitigen Zustand
- **Formulare**: Verwendung von React Hook Form für Formularzustand und -validierung

## UI/UX-Design

- **Layout**: Responsive Design mit Sidebar-Navigation und Hauptbereich
- **Farbschema**: Modernes, professionelles Farbschema mit Akzentfarben für wichtige Aktionen
- **Komponenten**: Wiederverwendbare UI-Komponenten für Konsistenz
- **Feedback**: Ladezustände und Benachrichtigungen für Benutzeraktionen

## Nächste Schritte

1. Implementierung der grundlegenden Layout-Komponenten
2. Erstellung der Agents-Liste und Detailansicht
3. Implementierung des Agent-Erstellungsformulars
4. Entwicklung der Knowledge-Management-Funktionalität
5. Implementierung des Chat-Interfaces für Agent-Tests
