# ELIZA WebApp - Vercel Deployment Guide

Diese Anleitung beschreibt, wie Sie die ELIZA WebApp auf Vercel deployen können.

## Voraussetzungen

- Ein [Vercel](https://vercel.com)-Konto
- [Git](https://git-scm.com/) für die Versionskontrolle
- [Node.js](https://nodejs.org/) (Version 18 oder höher)
- [npm](https://www.npmjs.com/) (wird mit Node.js installiert)

## Deployment-Schritte

### Option 1: Direktes Deployment über die Vercel CLI

1. **Vercel CLI installieren**

   ```bash
   npm install -g vercel
   ```

2. **In das Projektverzeichnis wechseln**

   ```bash
   cd eliza-webapp
   ```

3. **Bei Vercel anmelden**

   ```bash
   vercel login
   ```

4. **Projekt deployen**

   ```bash
   vercel
   ```

   Folgen Sie den Anweisungen in der CLI. Vercel wird automatisch erkennen, dass es sich um ein Next.js-Projekt handelt und die entsprechenden Einstellungen vornehmen.

5. **Für Produktions-Deployment**

   ```bash
   vercel --prod
   ```

### Option 2: Deployment über GitHub

1. **Projekt auf GitHub pushen**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/IHR_USERNAME/eliza-webapp.git
   git push -u origin main
   ```

2. **Vercel mit GitHub verbinden**

   - Gehen Sie zu [Vercel](https://vercel.com) und melden Sie sich an
   - Klicken Sie auf "New Project"
   - Wählen Sie Ihr GitHub-Repository aus
   - Vercel erkennt automatisch, dass es sich um ein Next.js-Projekt handelt
   - Klicken Sie auf "Deploy"

## Umgebungsvariablen

Für die Verwendung des Gemini API-Keys müssen Sie eine Umgebungsvariable in Vercel einrichten:

1. Gehen Sie zu Ihrem Projekt in der Vercel-Dashboard
2. Navigieren Sie zu "Settings" > "Environment Variables"
3. Fügen Sie die folgende Variable hinzu:
   - Name: `NEXT_PUBLIC_GEMINI_API_KEY`
   - Value: `AIzaSyC21K8CzPtcbw36mKpqOM8pJKxgR7ZhR1Q`

## Anpassungen für die Produktion

Die folgenden Anpassungen wurden bereits vorgenommen, um die App für die Produktion zu optimieren:

1. **Optimierte Builds**
   - Die App verwendet Next.js App Router für optimierte Builds
   - Server-Komponenten werden für bessere Performance genutzt

2. **Caching-Strategien**
   - Next.js kümmert sich automatisch um Caching und Optimierung

3. **Fehlerbehandlung**
   - Robuste Fehlerbehandlung in allen API-Aufrufen
   - Benutzerfreundliche Fehlermeldungen

## Testen der Deployment-Umgebung

Nach dem Deployment können Sie die folgenden Tests durchführen:

1. **Funktionalitätstests**
   - Erstellen eines neuen Agents
   - Bearbeiten eines bestehenden Agents
   - Hinzufügen von Knowledge zu einem Agent
   - Testen der Chat-Funktionalität

2. **Performance-Tests**
   - Überprüfen der Ladezeiten
   - Testen auf verschiedenen Geräten und Browsern

## Fehlerbehebung

Häufige Probleme und deren Lösungen:

1. **Build-Fehler**
   - Überprüfen Sie die Build-Logs in Vercel
   - Stellen Sie sicher, dass alle Abhängigkeiten korrekt installiert sind

2. **API-Fehler**
   - Überprüfen Sie, ob die Umgebungsvariablen korrekt gesetzt sind
   - Testen Sie die API-Aufrufe lokal mit den gleichen Parametern

3. **Routing-Probleme**
   - Stellen Sie sicher, dass die Next.js-Routing-Konfiguration korrekt ist
   - Überprüfen Sie die Vercel-Routing-Einstellungen

## Nächste Schritte

Nach erfolgreichem Deployment können Sie:

1. Eine benutzerdefinierte Domain einrichten
2. Analytics-Tools integrieren
3. Die Bereiche "Rooms" und "LIVE" implementieren
