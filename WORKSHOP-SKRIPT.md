# 🦗 INSEKTIVO QS – Workshop-Präsentation

**Dauer:** ca. 20-30 Minuten  
**Ziel:** MVP vorstellen, Feedback sammeln, nächste Schritte definieren

---

## 1. EINSTIEG (2 Min)

> *"Stellt euch vor: Ein Kunde meldet ein Problem mit einer Charge Larven. Wir haben 4 Stunden Zeit, um herauszufinden: Woher kam die Ware? Wer ist betroffen? Wen müssen wir informieren?"*

> *"Genau dafür haben wir heute einen digitalen Prototyp – unser QS-System für lückenlose Rückverfolgbarkeit."*

**→ Browser öffnen: http://localhost:3000**

---

## 2. DAS PROBLEM (3 Min)

> *"Aktuell arbeiten wir mit Excel-Listen. Das funktioniert – aber im Krisenfall kostet es wertvolle Zeit."*

**Pain Points ansprechen:**
- Manuelle Suche in verschiedenen Tabellen
- Keine Echtzeit-Übersicht wo welche Kiste gerade ist
- Fehleranfällig bei der Dokumentation
- Export für QS muss händisch zusammengestellt werden

> *"Unser Ziel: Ein System, das diese Arbeit automatisiert und uns im Ernstfall sofort die richtigen Daten liefert."*

---

## 3. DIE LÖSUNG – LIVE-DEMO (15 Min)

### 3.1 Prozesskette zeigen (Startseite)

> *"Hier seht ihr unseren kompletten Kisten-Kreislauf auf einen Blick."*

**Durchklicken:**
1. Auf Station "Erzeuger" klicken → zeigt Aktionen
2. Durchgehen: Befüllung → Fracht → Kunde → Wäscher → zurück

> *"Jede Station hat definierte Buchungsarten. Das System weiß immer, in welchem Zustand eine Kiste ist."*

### 3.2 Kisten-Übersicht (/boxes)

> *"Hier sehen wir alle Kisten im System."*

**Zeigen:**
- Filter nutzen (z.B. "Gefüllt")
- Eine Kiste aufklappen → Buchungshistorie
- "Das ist der digitale Lebenslauf jeder Kiste."

### 3.3 Buchung erfassen (/booking)

> *"So einfach geht eine Buchung."*

**Live demonstrieren:**
1. Kiste auswählen
2. Station wählen (z.B. "Beim Erzeuger")
3. Buchungsart (z.B. "Befüllung")
4. Gewicht + Chargennummer eingeben
5. → "Buchung erfassen"

> *"Das ersetzt den Handscanner-Prozess – oder ergänzt ihn. Die Daten landen sofort im System."*

### 3.4 QS-Vorfall & Export (/incidents)

> *"Jetzt der wichtigste Teil: Was passiert im Krisenfall?"*

**Zeigen:**
1. Offenen Vorfall anklicken
2. Krisenmanagement-Schritte erklären
3. **"QS-Export"** klicken

> *"Mit einem Klick haben wir alles, was QS braucht:"*
- Betroffene Lieferanten mit Kontaktdaten
- Betroffene Kunden  
- Komplette Buchungskette
- Krisenmanagement-Protokoll

**→ "Drucken/PDF" zeigen**

> *"Das ist das Format, das wir bisher mühsam aus Excel zusammenstellen mussten."*

---

## 4. TECHNISCHE BASIS (2 Min)

> *"Kurz zur Technik – für die, die's interessiert:"*

- **Next.js** – modernes Web-Framework
- **SQLite** – einfache Datenbank, später skalierbar
- **Alles lokal** – keine Cloud-Abhängigkeit erstmal

> *"Das ist ein MVP – Minimum Viable Product. Es zeigt, was möglich ist. Die Basis steht, jetzt können wir erweitern."*

---

## 5. AUSBLICK & DISKUSSION (5 Min)

> *"Was fehlt noch für den Echtbetrieb?"*

**Mögliche nächste Schritte:**
- [ ] Handscanner-Integration (Barcode/QR)
- [ ] Benutzer-Authentifizierung
- [ ] Paletten-Verwaltung
- [ ] Automatische Benachrichtigungen
- [ ] Mobile App für Fahrer
- [ ] Anbindung an bestehendes ERP

**Fragen an die Runde:**
1. *"Was ist euer wichtigstes Feature, das noch fehlt?"*
2. *"Wo seht ihr die größten Zeitfresser im aktuellen Prozess?"*
3. *"Wer würde mit dem System arbeiten – und was braucht er/sie?"*

---

## 6. ABSCHLUSS (1 Min)

> *"Das war ein erster Prototyp – gebaut in einem Vormittag. Er zeigt, dass digitale Rückverfolgbarkeit kein Hexenwerk ist."*

> *"Die Frage ist nicht ob, sondern wie schnell wir das umsetzen wollen. Ich freue mich auf euer Feedback!"*

---

## 💡 TIPPS FÜR DIE PRÄSENTATION

**Do's:**
- Langsam durch die UI klicken, Zeit zum Schauen lassen
- Bei Fragen: "Guter Punkt, notieren wir für V2"
- Demo-Daten sind realistisch – darauf hinweisen

**Don'ts:**
- Nicht zu technisch werden
- Nicht jedes Feature erklären – Fokus auf Workflow
- Bei Bugs: "Das ist ein Prototyp" 😉

**Backup:**
- Falls Server nicht läuft: `cd ~/clawd/projects/insektivo-qs/app && npm run dev`
- Screenshots als Fallback in `/public` ablegen

---

*Viel Erfolg! 🚀*
