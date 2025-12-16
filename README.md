# 🎯 Zuordnungen Übungshomepage - Klasse 7 Gymnasium

Wissenschaftlich fundierte, interaktive Übungsplattform für proportionale und antiproportionale Zuordnungen.

## ✨ Features

- **Adaptive Eingangsdiagnose**: Erkennt Vorwissen und Fehlermuster
- **4 Lernmodule**: Tabellen, Graphen, Rechenstrategien, Kontext
- **60+ Aufgaben**: Wissenschaftlich fundiert, progressiv aufgebaut
- **3-Stufen-Hilfesystem**: Strategische, inhaltliche und Rechenhilfen
- **Fehler-spezifisches Feedback**: Erkennt typische Fehlvorstellungen
- **Badge-System**: Mastery-basiert (nicht zeitbasiert)
- **Responsive Design**: Funktioniert auf Desktop, Tablet und Smartphone

## 🚀 Schnellstart (Lokale Entwicklung)

### Voraussetzungen

- Node.js 18+ installiert ([Download](https://nodejs.org/))

### Installation und Start

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die App läuft dann auf http://localhost:5173

## 📦 Produktions-Build erstellen

```bash
# Build erstellen
npm run build

# Build testen
npm run preview
```

Der fertige Build befindet sich im Ordner `dist/`

## 🌐 Deployment-Optionen

### Option 1: Netlify (Empfohlen - Kostenlos & Einfach)

1. Erstelle ein kostenloses Konto auf [Netlify](https://www.netlify.com/)
2. Verbinde dein Git-Repository ODER
3. Drag & Drop den `dist/` Ordner direkt auf Netlify

**Manuelle Deployment-Schritte:**
```bash
npm run build
# Dann den dist/ Ordner auf Netlify.com hochladen
```

### Option 2: Vercel (Auch kostenlos)

1. Konto auf [Vercel](https://vercel.com/) erstellen
2. Repository importieren oder CLI verwenden:

```bash
npm install -g vercel
vercel --prod
```

### Option 3: GitHub Pages

```bash
# vite.config.js anpassen: base: '/repository-name/'
npm run build

# dist/ Ordner in gh-pages branch pushen
```

### Option 4: Eigener Server

```bash
npm run build

# Kopiere den dist/ Ordner auf deinen Server
# Konfiguriere den Webserver (Apache/Nginx) auf den dist/ Ordner
```

**Nginx Beispiel-Konfiguration:**
```nginx
server {
    listen 80;
    server_name deine-domain.de;
    root /var/www/zuordnungen-app/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📂 Projektstruktur

```
zuordnungen-app/
├── src/
│   ├── App.jsx           # Hauptkomponente mit State Management
│   ├── main.jsx          # Einstiegspunkt
│   ├── index.css         # Globales Styling
│   └── data.json         # Alle Aufgaben und Content
├── index.html            # HTML Template
├── vite.config.js        # Build-Konfiguration
├── package.json          # Dependencies
└── README.md             # Diese Datei
```

## 🎓 Didaktisches Konzept

Die App basiert auf aktueller mathematikdidaktischer Forschung:

- **Grundvorstellungen-Konzept** (vom Hofe)
- **DZLM-Forschung** zu flexiblen Rechenstrategien
- **Cognitive Load Theory** (Sweller)
- **Überlinearisierungs-Forschung** (De Bock et al.)
- **Graph-als-Bild-Fehler** (Hofmann & Roth)

### Lernphasen (90 Minuten)

1. **Diagnose** (5 Min): Vorwissen erfassen
2. **Erkunden** (25 Min): Konzepte entdecken
3. **Vertiefen** (45 Min): Verschiedene Repräsentationen üben
4. **Anwenden** (15 Min): Transfer in Kontexte

## 🔧 Anpassungen

### Content ändern

Alle Aufgaben sind in `src/data.json` gespeichert. Struktur:

```json
{
  "diagnostic": { ... },
  "tables": { ... },
  "graphs": { ... },
  "strategies": { ... },
  "context": { ... },
  "finalChallenge": { ... }
}
```

### Styling anpassen

Farben in `src/index.css` unter `:root` ändern:

```css
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --success: #10b981;
  /* ... */
}
```

### Neue Aufgaben hinzufügen

1. Füge Aufgabe in `data.json` zum entsprechenden Modul hinzu
2. Stelle sicher, dass der `type` korrekt gesetzt ist
3. Build neu erstellen

## 📊 Aufgabentypen

- **table-recognition**: Zuordnungstyp erkennen
- **table-completion**: Tabelle vervollständigen
- **error-detection**: Fehler finden
- **strategy-choice**: Rechenstrategie wählen
- **strategy-mixed**: Gemischte Aufgaben
- **simple-problem**: Textaufgaben
- **situation-assessment**: Situationen einschätzen
- **overlinearization-trap**: Überlinearisierungs-Fallen

## 🐛 Troubleshooting

### "npm: command not found"
- Node.js installieren: https://nodejs.org/

### Build funktioniert nicht
```bash
# Lösche node_modules und installiere neu
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Seite lädt nicht richtig
- Browser-Cache leeren (Ctrl+Shift+R / Cmd+Shift+R)
- Im Incognito-Modus testen

## 📝 Lizenz & Credits

Diese App wurde entwickelt basierend auf:
- Aktueller mathematikdidaktischer Forschung
- Cognitive Load Theory
- Universal Design for Learning (UDL)

**Entwickelt für:** Gymnasium Klasse 7
**Dauer:** ~90 Minuten
**Fokus:** Verstehen vor Verfahren

## 🤝 Support

Bei Fragen oder Problemen:
1. README nochmal durchlesen
2. Issue auf GitHub erstellen
3. Entwickler kontaktieren

---

**Viel Erfolg beim Lernen! 🎓**
