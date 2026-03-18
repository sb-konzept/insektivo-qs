import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import BackButton from '@/components/BackButton'
import EditAddressForm from './EditAddressForm'

type AddressType = 'lieferanten' | 'kunden' | 'speditionen'

async function getAddress(typ: AddressType, id: string) {
  if (typ === 'lieferanten') {
    return prisma.supplier.findUnique({ where: { id } })
  } else if (typ === 'kunden') {
    return prisma.customer.findUnique({ where: { id } })
  } else if (typ === 'speditionen') {
    return prisma.carrier.findUnique({ where: { id } })
  }
  return null
}

const typeLabels: Record<AddressType, string> = {
  lieferanten: 'Lieferant',
  kunden: 'Kunde',
  speditionen: 'Spedition',
}

export default async function EditAddressPage({ 
  params 
}: { 
  params: Promise<{ typ: string; id: string }> 
}) {
  const { typ, id } = await params
  
  if (!['lieferanten', 'kunden', 'speditionen'].includes(typ)) {
    notFound()
  }

  const addressType = typ as AddressType
  const address = await getAddress(addressType, id)

  if (!address) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-brand">
      <header className="bg-white shadow-sm border-b border-[#3c7460]/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
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
            <h1 className="text-lg font-bold text-[#3c7460]">✏️ {typeLabels[addressType]} bearbeiten</h1>
            <p className="text-xs text-[#4a4a49]/70">{address.name}</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <EditAddressForm 
          addressType={addressType} 
          address={address} 
        />
      </div>
    </main>
  )
}
