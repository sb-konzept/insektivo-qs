import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'

async function getCarrier(id: string) {
  const carrier = await prisma.carrier.findUnique({
    where: { id },
    include: {
      bookings: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          box: true,
        },
      },
    },
  })
  return carrier
}

export default async function CarrierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const carrier = await getCarrier(id)

  if (!carrier) {
    notFound()
  }

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
            <h1 className="text-lg font-bold text-[#3c7460]">🚛 Spedition</h1>
            <p className="text-xs text-[#4a4a49]/70">{carrier.name}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#3c7460]">{carrier.name}</h2>
              {carrier.vehicleNr && (
                <p className="text-[#4a4a49]/70">Kennzeichen: {carrier.vehicleNr}</p>
              )}
            </div>
            {carrier.certificationSystem && (
              <span className="px-3 py-1 bg-[#b3c43e]/20 text-[#3c7460] rounded-full text-sm font-medium">
                {carrier.certificationSystem}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[#4a4a49] mb-3">📍 Adresse</h3>
              <p className="text-[#4a4a49]/80">
                {carrier.street}<br/>
                {carrier.zipCode} {carrier.city}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-[#4a4a49] mb-3">📞 Kontakt</h3>
              <p className="text-[#4a4a49]/80">
                {carrier.contactPerson && <>{carrier.contactPerson}<br/></>}
                {carrier.phone && <>{carrier.phone}<br/></>}
                {carrier.email && <a href={`mailto:${carrier.email}`} className="text-[#3c7460] hover:underline">{carrier.email}</a>}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-[#4a4a49] mb-3">🆔 QS-Daten</h3>
              <p className="text-[#4a4a49]/80">
                {carrier.qsId && <>QS-ID: <span className="font-mono">{carrier.qsId}</span></>}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-[#4a4a49] mb-3">📊 Statistik</h3>
              <p className="text-[#4a4a49]/80">
                {carrier.bookings.length} Transporte
              </p>
            </div>
          </div>
        </div>

        {/* Buchungshistorie */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-[#4a4a49] mb-4">Letzte Transporte</h3>
          {carrier.bookings.length === 0 ? (
            <p className="text-[#4a4a49]/70">Keine Transporte vorhanden</p>
          ) : (
            <div className="space-y-2">
              {carrier.bookings.map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-[#4a4a49]/50 text-sm">
                      {new Date(booking.createdAt).toLocaleDateString('de-DE')}
                    </span>
                    <Link 
                      href={`/boxes`}
                      className="font-mono text-[#3c7460] hover:underline"
                    >
                      📦 {booking.box.code}
                    </Link>
                    <span className="text-[#4a4a49]/70 text-sm">{booking.station}</span>
                  </div>
                  {booking.deliveryNoteNr && (
                    <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{booking.deliveryNoteNr}</span>
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
