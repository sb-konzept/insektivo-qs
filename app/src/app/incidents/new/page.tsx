import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import NewIncidentForm from './NewIncidentForm'
import BackButton from '@/components/BackButton'

async function getBatches() {
  // Alle einzigartigen Chargennummern holen
  const bookings = await prisma.booking.findMany({
    where: { batchNr: { not: null } },
    select: { batchNr: true },
    distinct: ['batchNr'],
    orderBy: { batchNr: 'desc' },
  })
  return bookings.map(b => b.batchNr!).filter(Boolean)
}

export default async function NewIncidentPage() {
  const batches = await getBatches()

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <header className="bg-white shadow-sm border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
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
            <h1 className="text-lg font-bold text-red-700">⚠️ Neuer QS-Vorfall</h1>
            <p className="text-xs text-[#4a4a49]/70">Krisenfall melden</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <NewIncidentForm batches={batches} />
      </div>
    </main>
  )
}
