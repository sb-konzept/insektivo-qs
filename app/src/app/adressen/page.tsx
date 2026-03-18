import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import BackButton from '@/components/BackButton'
import AddressTabs from './AddressTabs'

async function getData() {
  const [suppliers, customers, carriers] = await Promise.all([
    prisma.supplier.findMany({ orderBy: { name: 'asc' } }),
    prisma.customer.findMany({ orderBy: { name: 'asc' } }),
    prisma.carrier.findMany({ orderBy: { name: 'asc' } }),
  ])
  return { suppliers, customers, carriers }
}

export default async function AdressenPage() {
  const data = await getData()

  return (
    <main className="min-h-screen bg-gradient-brand">
      <header className="bg-white shadow-sm border-b border-[#3c7460]/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton />
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
              <h1 className="text-lg font-bold text-[#3c7460]">📋 Adressverwaltung</h1>
              <p className="text-xs text-[#4a4a49]/70">Kunden, Lieferanten, Speditionen</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AddressTabs 
          suppliers={data.suppliers}
          customers={data.customers}
          carriers={data.carriers}
        />
      </div>
    </main>
  )
}
