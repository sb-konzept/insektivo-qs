import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'

async function getIncidents() {
  return prisma.incident.findMany({
    include: {
      steps: {
        orderBy: { stepNr: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function IncidentsPage() {
  const incidents = await getIncidents()

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <header className="bg-white shadow-sm border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image 
                src="/logo.jpg" 
                alt="INSEKTIVO" 
                width={140} 
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <div className="border-l border-red-300 pl-4">
              <h1 className="text-lg font-bold text-red-700">⚠️ QS-Vorfälle</h1>
              <p className="text-xs text-[#4a4a49]/70">Krisenmanagement & Rückverfolgbarkeit</p>
            </div>
          </div>
          <Link
            href="/incidents/new"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            + Neuer Vorfall
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {incidents.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-[#4a4a49]/70">Keine offenen QS-Vorfälle</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between">
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
                      <h3 className="text-lg font-semibold text-[#4a4a49]">{incident.title}</h3>
                      <p className="text-[#4a4a49]/80 mt-1">{incident.description}</p>
                      {incident.affectedBatchNr && (
                        <p className="text-sm text-[#4a4a49]/70 mt-2">
                          Betroffene Charge: <span className="font-mono font-medium text-[#3c7460]">{incident.affectedBatchNr}</span>
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/incidents/${incident.id}/export`}
                      className="px-4 py-2 bg-[#3c7460]/10 text-[#3c7460] rounded-lg hover:bg-[#3c7460]/20 transition text-sm font-medium"
                    >
                      📥 QS-Export
                    </Link>
                  </div>

                  {/* Steps */}
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium text-[#4a4a49] mb-3">Krisenmanagement-Schritte:</h4>
                    <div className="space-y-2">
                      {incident.steps.map((step) => (
                        <div key={step.id} className="flex items-center gap-3 text-sm">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            step.completedAt ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-[#4a4a49]/70'
                          }`}>
                            {step.completedAt ? '✓' : step.stepNr}
                          </span>
                          <span className={step.completedAt ? 'text-[#4a4a49]/50 line-through' : 'text-[#4a4a49]'}>
                            {step.title}
                          </span>
                          {step.result && (
                            <span className="text-[#4a4a49]/50">→ {step.result}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
