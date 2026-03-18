import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'

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

async function getBatchData(batchNr: string) {
  // Alle Buchungen mit dieser Charge
  const bookings = await prisma.booking.findMany({
    where: { batchNr },
    orderBy: { createdAt: 'asc' },
    include: {
      box: true,
      supplier: { select: { id: true, name: true } },
      customer: { select: { id: true, name: true } },
      carrier: { select: { id: true, name: true } },
    },
  })

  // Betroffene Kisten (unique)
  const boxIds = [...new Set(bookings.map(b => b.boxId))]
  const boxes = await prisma.box.findMany({
    where: { id: { in: boxIds } },
  })

  // Gibt es einen QS-Vorfall für diese Charge?
  const incident = await prisma.incident.findFirst({
    where: { affectedBatchNr: batchNr },
  })

  return { bookings, boxes, incident, batchNr }
}

export default async function BatchDetailPage({ params }: { params: Promise<{ batchNr: string }> }) {
  const { batchNr } = await params
  const decodedBatchNr = decodeURIComponent(batchNr)
  const { bookings, boxes, incident } = await getBatchData(decodedBatchNr)

  return (
    <main className="min-h-screen bg-gradient-brand">
      <header className="bg-white shadow-sm border-b border-[#3c7460]/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Image 
              src="/logo.jpg" 
              alt="INSEKTIVO" 
              width={140} 
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <div className="border-l border-[#3c7460]/30 pl-4">
            <h1 className="text-lg font-bold text-[#3c7460]">🏷️ Charge</h1>
            <p className="text-xs font-mono text-[#4a4a49]/70">{decodedBatchNr}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold font-mono text-[#3c7460]">{decodedBatchNr}</h2>
              <p className="text-[#4a4a49]/70">Chargen-Rückverfolgung</p>
            </div>
            {incident && (
              <Link
                href={`/incidents/${incident.id}/export`}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
              >
                ⚠️ QS-Vorfall aktiv
              </Link>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-[#4a4a49] mb-2">📦 Betroffene Kisten</h3>
              <p className="text-2xl font-bold text-[#3c7460]">{boxes.length}</p>
            </div>
            <div>
              <h3 className="font-medium text-[#4a4a49] mb-2">📊 Buchungen</h3>
              <p className="text-2xl font-bold text-[#b3c43e]">{bookings.length}</p>
            </div>
            <div>
              <h3 className="font-medium text-[#4a4a49] mb-2">📅 Zeitraum</h3>
              <p className="text-sm text-[#4a4a49]/80">
                {bookings.length > 0 ? (
                  <>
                    {new Date(bookings[0].createdAt).toLocaleDateString('de-DE')} - 
                    {new Date(bookings[bookings.length - 1].createdAt).toLocaleDateString('de-DE')}
                  </>
                ) : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Betroffene Kisten */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-[#4a4a49] mb-4">Betroffene Kisten</h3>
          <div className="flex flex-wrap gap-2">
            {boxes.map(box => (
              <Link
                key={box.id}
                href={`/boxes/${box.id}`}
                className="inline-flex items-center gap-2 px-3 py-2 bg-[#3c7460]/10 hover:bg-[#3c7460]/20 text-[#3c7460] rounded-lg text-sm font-mono font-medium transition"
              >
                📦 {box.code}
                <span className={`px-2 py-0.5 rounded text-xs ${
                  box.status === 'gefuellt' ? 'bg-blue-100 text-blue-700' :
                  box.status === 'leer_gereinigt' ? 'bg-green-100 text-green-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {box.status}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Buchungskette */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-[#4a4a49] mb-4">Buchungskette (chronologisch)</h3>
          {bookings.length === 0 ? (
            <p className="text-[#4a4a49]/70">Keine Buchungen für diese Charge</p>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking, index) => (
                <div key={booking.id} className="relative">
                  {/* Timeline connector */}
                  {index < bookings.length - 1 && (
                    <div className="absolute left-4 top-12 w-0.5 h-6 bg-[#3c7460]/20"></div>
                  )}
                  
                  <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-[#3c7460] text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-[#3c7460]">
                            {stationLabels[booking.station] || booking.station}
                          </span>
                          <span className="px-2 py-0.5 bg-[#b3c43e]/20 text-[#3c7460] rounded text-xs font-medium">
                            {bookingTypeLabels[booking.bookingType] || booking.bookingType}
                          </span>
                        </div>
                        <span className="text-sm text-[#4a4a49]/50">
                          {new Date(booking.createdAt).toLocaleString('de-DE')}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/boxes/${booking.box.id}`}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-[#3c7460]/10 hover:bg-[#3c7460]/20 text-[#3c7460] rounded text-xs font-mono font-medium transition"
                        >
                          📦 {booking.box.code}
                        </Link>
                        {booking.weight && (
                          <span className="px-2 py-1 bg-gray-100 text-[#4a4a49] rounded text-xs">
                            {booking.weight.toFixed(1)} kg
                          </span>
                        )}
                        {booking.deliveryNoteNr && (
                          <span className="px-2 py-1 bg-gray-100 text-[#4a4a49] rounded text-xs font-mono">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/boxes" className="text-[#3c7460] hover:underline mr-4">
            ← Kisten-Übersicht
          </Link>
          <Link href="/incidents" className="text-[#3c7460] hover:underline">
            QS-Vorfälle →
          </Link>
        </div>
      </div>
    </main>
  )
}
