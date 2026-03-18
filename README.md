# 🦗 INSEKTIVO QS

**Qualitätssicherung & Rückverfolgbarkeit für Insektenlarven-Produktion**

Ein MVP für das QS-Verfahren der INSEKTIVO Erzeugergemeinschaft.

## 🚀 Setup (neuer PC)

```bash
# 1. Repo klonen
git clone https://github.com/sb-konzept/insektivo-qs.git
cd insektivo-qs/app

# 2. Dependencies installieren
npm install

# 3. Environment-Datei erstellen
cp .env.example .env

# 4. Datenbank erstellen + migrieren
npx prisma migrate dev

# 5. Demo-Daten laden
npm run db:seed

# 6. Starten
npm run dev
```

Öffne http://localhost:3000

## 📦 Features

### Prozesskette
Visuelle Darstellung des Kisten-Kreislaufs:
1. **Erzeuger** – Befüllung mit Larven
2. **Fracht → Kunde** – Transport
3. **Kunde** – Empfang & Verarbeitung
4. **Fracht → Wäscher** – Rücktransport
5. **Wäscher** – Reinigung & Qualitätscheck
6. **Fracht → Erzeuger** – Zurück in den Kreislauf

### Kisten-Verwaltung
- Übersicht aller Kisten im System
- Status-Tracking (leer/gereinigt, gefüllt, leer/verschmutzt)
- Komplette Buchungshistorie pro Kiste
- Filter nach Status/Station

### Buchungen
- Zugangsbuchungen
- Abgangsbuchungen
- Befüllungen mit Chargen-/Gewichtsdokumentation
- Qualitätschecks

### QS-Vorfälle & Rückverfolgbarkeit
- Krisenmanagement-Workflow
- Automatische Ermittlung betroffener Lieferanten/Kunden
- QS-Export als druckbares PDF

## 🗄️ Datenbank

SQLite mit Prisma ORM.

### Modelle
- `Box` – Kisten/Behälter
- `Booking` – Buchungen/Bewegungen
- `Supplier` – Lieferanten/Erzeuger
- `Customer` – Kunden/Abnehmer
- `Carrier` – Speditionen
- `Incident` – QS-Vorfälle
- `IncidentStep` – Krisenmanagement-Schritte

### Commands
```bash
npm run db:seed     # Demo-Daten laden
npm run db:studio   # Prisma Studio (DB Browser)
npm run db:migrate  # Neue Migration erstellen
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Database:** SQLite + Prisma
- **Language:** TypeScript

## 📁 Struktur

```
app/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Hauptseite mit Prozesskette
│   │   ├── boxes/            # Kisten-Übersicht
│   │   ├── booking/          # Buchung erfassen
│   │   ├── incidents/        # QS-Vorfälle
│   │   └── api/              # API Routes
│   ├── components/
│   │   └── ProcessChain.tsx  # Visuelle Prozesskette
│   └── lib/
│       └── db.ts             # Prisma Client
└── prisma/
    ├── schema.prisma         # Datenbank-Schema
    └── seed.ts               # Demo-Daten
```

## 📄 Referenz-Dokumente

Die Excel-Vorlagen für das QS-Verfahren:
- `insektivo-prozesskette-erp.xlsx` – Prozessablauf
- `ereignis-krisenmanagement.xlsx` – Krisenmanagement-Vorlage
- `rueckverfolgbarkeit.xlsx` – Export-Format für QS

---

Erstellt für den Workshop am 18.03.2026 ✨
