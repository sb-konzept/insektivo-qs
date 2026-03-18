import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import BackButton from '@/components/BackButton'

async function getCustomer(id: string) {
  const customer = await prisma.customer.findUnique({
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
  return customer
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = await getCustomer(id)

  if (!customer) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-brand">
      <header className="bg-white shadow-sm border-b border-[#3c7460]/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <BackButton />
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
            <h1 className="text-lg font-bold text-[#3c7460]">🏢 Kunde</h1>
            <p className="text-xs text-[#4a4a49]/70">{customer.name}</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#3c7460]">{customer.name}</h2>
              <p className="text-[#4a4a49]/70">{customer.productionType}</p>
            </div>
            {customer.certificationSystem && (
              <span className="px-3 py-1 bg-[#b3c43e]/20 text-[#3c7460] rounded-full text-sm font-medium">
                {customer.certificationSystem}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[#4a4a49] mb-3">📍 Adresse</h3>
              <p className="text-[#4a4a49]/80">
                {customer.street}<br/>
                {customer.zipCode} {customer.city}
                {customer.state && <><br/>{customer.state}</>}
                {customer.country && <>, {customer.country}</>}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-[#4a4a49] mb-3">📞 Kontakt</h3>
              <p className="text-[#4a4a49]/80">
                {customer.contactPerson && <>{customer.contactPerson}<br/></>}
                {customer.phone && <>{customer.phone}<br/></>}
                {customer.email && <a href={`mailto:${customer.email}`} className="text-[#3c7460] hover:underline">{customer.email}</a>}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-[#4a4a49] mb-3">🆔 QS-Daten</h3>
              <p className="text-[#4a4a49]/80">
                {customer.qsId && <>QS-ID: <span className="font-mono">{customer.qsId}</span><br/></>}
                {customer.locationNr && <>VVVO-Nr: <span className="font-mono">{customer.locationNr}</span></>}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-[#4a4a49] mb-3">📊 Statistik</h3>
              <p className="text-[#4a4a49]/80">
                {customer.bookings.length} Buchungen
              </p>
            </div>
          </div>
        </div>

        {/* Buchungshistorie */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-[#4a4a49] mb-4">Letzte Buchungen</h3>
          {customer.bookings.length === 0 ? (
            <p className="text-[#4a4a49]/70">Keine Buchungen vorhanden</p>
          ) : (
            <div className="space-y-2">
              {customer.bookings.map(booking => (
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
                    <span className="text-[#4a4a49]/70 text-sm">{booking.bookingType}</span>
                  </div>
                  {booking.batchNr && (
                    <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">{booking.batchNr}</span>
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
