import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Krisenmanagement-Schritte je nach Typ
const lieferantenSteps = [
  { stepNr: 1, title: 'Eingang des Rückrufes', description: 'Dokumentation des Rückrufes: Grund, betroffene Rohstoffe, Chargennummer, Lieferdatum, gelieferte Menge' },
  { stepNr: 2, title: 'Wurde die betroffene Ware eingesetzt?', description: 'Prüfung ob die betroffenen Chargen bereits angebrochen wurden' },
  { stepNr: 3, title: 'Meldung an QS', description: 'QS unverzüglich informieren wenn Ware eingesetzt wurde' },
  { stepNr: 4, title: 'Ermittlung Produktionsdatum/Chargennummer', description: 'Alle Chargennummern der betroffenen Insektenlarven ermitteln' },
  { stepNr: 5, title: 'Betroffene Ware bereits verkauft?', description: 'Prüfung ob Larven bereits verkauft wurden' },
  { stepNr: 6, title: 'Ermittlung betroffener Kunden', description: 'Kontaktdaten der Kunden ermitteln die betroffene Ware erhalten haben' },
  { stepNr: 7, title: 'Information der Kunden', description: 'Betroffene Kunden unverzüglich informieren' },
  { stepNr: 8, title: 'Weiterleitung an QS', description: 'Aufbereitete Daten an QS übermitteln' },
]

const kundenSteps = [
  { stepNr: 1, title: 'Eingang der Reklamation', description: 'Dokumentation der eingehenden Reklamation' },
  { stepNr: 2, title: 'Sind wir Verursacher?', description: 'Prüfung ob unser Produkt für die Probleme verantwortlich sein kann' },
  { stepNr: 3, title: 'Meldung an QS', description: 'Problem unverzüglich an QS melden' },
  { stepNr: 4, title: 'Ermittlung Produktionsdatum/Chargennummer', description: 'Chargennummer der betroffenen Ware beim Kunden abfragen' },
  { stepNr: 5, title: 'Ermittlung weiterer betroffener Kunden', description: 'Alle Kunden ermitteln die Larven mit gleicher Charge erhalten haben' },
  { stepNr: 6, title: 'Ermittlung der Futterrezeptur', description: 'Genaue Rezeptur und eingesetzte Futtermittel der Charge ermitteln' },
  { stepNr: 7, title: 'Festlegung der Futtermittel-Chargen', description: 'Betroffene Chargen der eingesetzten Futtermittel bestimmen' },
  { stepNr: 8, title: 'Bestimmung der Lieferanten', description: 'Daten zu Lieferanten der betroffenen Futtermittel aufbereiten' },
  { stepNr: 9, title: 'Weiterleitung an QS', description: 'Aufbereitete Daten an QS übermitteln' },
]

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { title, description, incidentType, affectedBatchNr } = data

    if (!title || !incidentType) {
      return NextResponse.json({ error: 'Titel und Vorfallsart erforderlich' }, { status: 400 })
    }

    // Incident erstellen
    const incident = await prisma.incident.create({
      data: {
        title,
        description: description || '',
        incidentType,
        affectedBatchNr,
        status: 'offen',
      },
    })

    // Krisenmanagement-Schritte hinzufügen
    const steps = incidentType === 'lieferanten_rueckruf' ? lieferantenSteps : kundenSteps
    
    for (const step of steps) {
      await prisma.incidentStep.create({
        data: {
          incidentId: incident.id,
          ...step,
        },
      })
    }

    return NextResponse.json(incident, { status: 201 })
  } catch (error) {
    console.error('Error creating incident:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
