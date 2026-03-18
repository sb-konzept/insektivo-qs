import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import IncidentSteps from './IncidentSteps'
import BackButton from '@/components/BackButton'

async function getIncident(id: string) {
  const incident = await prisma.incident.findUnique({
    where: { id },
    include: {
      steps: { orderBy: { stepNr: 'asc' } },
    },
  })

  if (!incident) return null

  // Betroffene Kisten laden
  let affectedBoxes: { id: string; code: string }[] = []
  if (incident.affectedBatchNr) {
    const bookings = await prisma.booking.findMany({
      where: { batchNr: incident.affectedBatchNr },
      include: { box: { select: { id: true, code: true } } },
      distinct: ['boxId'],
    })
    affectedBoxes = bookings.map(b => b.box)
  }

  return { ...incident, affectedBoxes }
}

export default async function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const incident = await getIncident(id)

  if (!incident) {
    notFound()
  }

  const completedSteps = incident.steps.filter(s => s.completedAt).length
  const totalSteps = incident.steps.length
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <header className="bg-white shadow-sm border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton />
            <Link href="/incidents">
              <Image 
                src="/logo.jpg" 
                alt="INSEKTIVO" 
                width={140} 
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <div className="border-l border-red-300 pl-4">
              <h1 className="text-lg font-bold text-red-700">⚠️ Krisenmanagement</h1>
              <p className="text-xs text-[#4a4a49]/70">Vorfall bearbeiten</p>
            </div>
          </div>
          <Link
            href={`/incidents/${incident.id}/export`}
            className="px-4 py-2 bg-[#3c7460] text-white rounded-lg hover:bg-[#2d5a4a] transition font-medium"
          >
            📥 QS-Export
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Incident Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  incident.status === 'offen' ? 'bg-red-100 text-red-700' :
                  incident.status === 'in_bearbeitung' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {incident.status === 'offen' ? '🔴 Offen' :
                   incident.status === 'in_bearbeitung' ? '🟡 In Bearbeitung' :
                   '🟢 Geschlossen'}
                </span>
                <span className="text-sm text-[#4a4a49]/70">
                  {incident.incidentType === 'lieferanten_rueckruf' ? 'Lieferanten-Rückruf' : 'Kunden-Reklamation'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[#4a4a49]">{incident.title}</h2>
              {incident.description && (
                <p className="text-[#4a4a49]/80 mt-2">{incident.description}</p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-[#4a4a49]/70 mb-1">
              <span>Fortschritt</span>
              <span>{completedSteps} von {totalSteps} Schritten</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all ${
                  progress === 100 ? 'bg-green-500' : 'bg-[#b3c43e]'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <span className="text-sm text-[#4a4a49]/70">Gemeldet am</span>
              <p className="font-medium text-[#4a4a49]">
                {new Date(incident.reportedAt).toLocaleDateString('de-DE')}
              </p>
            </div>
            {incident.affectedBatchNr && (
              <div>
                <span className="text-sm text-[#4a4a49]/70">Betroffene Charge</span>
                <p>
                  <Link
                    href={`/batches/${incident.affectedBatchNr}`}
                    className="font-mono font-medium text-[#3c7460] hover:underline"
                  >
                    {incident.affectedBatchNr}
                  </Link>
                </p>
              </div>
            )}
            <div>
              <span className="text-sm text-[#4a4a49]/70">Betroffene Kisten</span>
              <p className="font-medium text-[#4a4a49]">{incident.affectedBoxes.length}</p>
            </div>
          </div>

          {/* Betroffene Kisten */}
          {incident.affectedBoxes.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-[#4a4a49]/70 block mb-2">Betroffene Kisten:</span>
              <div className="flex flex-wrap gap-2">
                {incident.affectedBoxes.map(box => (
                  <Link
                    key={box.id}
                    href={`/boxes/${box.id}`}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#3c7460]/10 hover:bg-[#3c7460]/20 text-[#3c7460] rounded text-sm font-mono font-medium transition"
                  >
                    📦 {box.code}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Krisenmanagement Schritte */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-[#4a4a49] mb-4 flex items-center gap-2">
            <span className="text-xl">📋</span>
            Krisenmanagement-Schritte
          </h3>
          <p className="text-sm text-[#4a4a49]/70 mb-6">
            Arbeiten Sie jeden Schritt ab und dokumentieren Sie das Ergebnis. Klicken Sie auf einen Schritt um ihn zu bearbeiten.
          </p>
          
          <IncidentSteps incidentId={incident.id} initialSteps={incident.steps} />
        </div>

        <div className="mt-6 text-center">
          <Link href="/incidents" className="text-[#3c7460] hover:underline">
            ← Zurück zur Übersicht
          </Link>
        </div>
      </div>
    </main>
  )
}
