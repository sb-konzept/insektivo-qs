import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'

async function getBox(id: string) {
  const box = await prisma.box.findUnique({
    where: { id },
    include: {
      bookings: {
        orderBy: { createdAt: 'desc' },
        include: {
          supplier: { select: { id: true, name: true } },
          customer: { select: { id: true, name: true } },
          carrier: { select: { id: true, name: true } },
        },
      },
    },
  })
  return box
}

const statusLabels: Record<string, { label: string; color: string }> = {
  leer_gereinigt: { label: 'Leer (gereinigt)', color: 'bg-green-100 text-green-700' },
  gefuellt: { label: 'Gefüllt', color: 'bg-blue-100 text-blue-700' },
  leer_verschmutzt: { label: 'Leer (verschmutzt)', color: 'bg-orange-100 text-orange-700' },
}

const stationLabels: Record<string, string> = {
  erzeuger: '🏭 Erzeuger',
  fracht_kunde: '🚛 Fracht → Kunde',
  kunde: '🏢 Kunde',
  fracht_waescher: '🚛 Fracht → Wäscher',
  waescher: '🧼 Wäscher',
  fracht_erzeuger: '🚛 Fracht → Erzeuger',
}

const bookingTypeLabels: Record<string, string> = {
  zugang: 'Zugang',
  abgang: 'Abgang',
  befuellung: 'Befüllung',
  qualitaetscheck: 'Qualitätscheck',
}

export default async function BoxDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const box = await getBox(id)

  if (!box) {
    notFound()
  }

  const status = statusLabels[box.status] || { label: box.status, color: 'bg-gray-100 text-gray-700' }

  return (
    <main className="min-h-screen bg-gradient-brand">
      <header className="bg-white shadow-sm border-b border-[#3c7460]/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/boxes">
            <Image 
              src="/logo.jpg" 
              alt="INSEKTIVO" 
              width={140} 
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <div className="border-l border-[#3c7460]/30 pl-4">
            <h1 className="text-lg font-bold text-[#3c7460]">📦 Kiste</h1>
            <p className="text-xs text-[#4a4a49]/70">{box.code}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold font-mono text-[#3c7460]">{box.code}</h2>
              <p className="text-[#4a4a49]/70">{stationLabels[box.currentStation] || box.currentStation}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${status.color}`}>
              {status.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[#4a4a49] mb-2">📍 Aktuelle Station</h3>
              <p className="text-lg text-[#3c7460]">{stationLabels[box.currentStation] || box.currentStation}</p>
            </div>
            <div>
              <h3 className="font-medium text-[#4a4a49] mb-2">📊 Buchungen</h3>
              <p className="text-lg text-[#3c7460]">{box.bookings.length} Einträge</p>
            </div>
            <div>
              <h3 className="font-medium text-[#4a4a49] mb-2">📅 Erstellt</h3>
              <p className="text-[#4a4a49]/80">{new Date(box.createdAt).toLocaleDateString('de-DE')}</p>
            </div>
            <div>
              <h3 className="font-medium text-[#4a4a49] mb-2">🔄 Letzte Änderung</h3>
              <p className="text-[#4a4a49]/80">{new Date(box.updatedAt).toLocaleDateString('de-DE')}</p>
            </div>
          </div>
        </div>

        {/* Komplette Buchungshistorie */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-[#4a4a49] mb-4">Komplette Buchungshistorie</h3>
          {box.bookings.length === 0 ? (
            <p className="text-[#4a4a49]/70">Keine Buchungen vorhanden</p>
          ) : (
            <div className="space-y-3">
              {box.bookings.map(booking => (
                <div key={booking.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[#4a4a49]/50 text-sm">
                        {new Date(booking.createdAt).toLocaleString('de-DE')}
                      </span>
                      <span className="font-medium text-[#3c7460]">
                        {stationLabels[booking.station] || booking.station}
                      </span>
                      <span className="px-2 py-0.5 bg-[#b3c43e]/20 text-[#3c7460] rounded text-xs font-medium">
                        {bookingTypeLabels[booking.bookingType] || booking.bookingType}
                      </span>
                    </div>
                    <div className="text-right text-sm">
                      {booking.weight && <span className="text-[#4a4a49]">{booking.weight.toFixed(1)} kg</span>}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {booking.batchNr && (
                      <Link
                        href={`/batches/${booking.batchNr}`}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded text-xs font-mono font-medium transition"
                      >
                        🏷️ {booking.batchNr}
                      </Link>
                    )}
                    {booking.deliveryNoteNr && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-[#4a4a49] rounded text-xs font-mono">
                        📄 {booking.deliveryNoteNr}
                      </span>
                    )}
                    {booking.supplier && (
                      <Link
                        href={`/suppliers/${booking.supplier.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#3c7460]/10 hover:bg-[#3c7460]/20 text-[#3c7460] rounded text-xs font-medium transition"
                      >
                        🏭 {booking.supplier.name}
                      </Link>
                    )}
                    {booking.customer && (
                      <Link
                        href={`/customers/${booking.customer.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-[#b3c43e]/20 hover:bg-[#b3c43e]/30 text-[#3c7460] rounded text-xs font-medium transition"
                      >
                        🏢 {booking.customer.name}
                      </Link>
                    )}
                    {booking.carrier && (
                      <Link
                        href={`/carriers/${booking.carrier.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 text-[#4a4a49] rounded text-xs font-medium transition"
                      >
                        🚛 {booking.carrier.name}
                      </Link>
                    )}
                  </div>

                  {booking.qualityNotes && (
                    <p className="mt-2 text-sm text-orange-600">⚠️ {booking.qualityNotes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/boxes" className="text-[#3c7460] hover:underline">
            ← Zurück zur Übersicht
          </Link>
        </div>
      </div>
    </main>
  )
}
