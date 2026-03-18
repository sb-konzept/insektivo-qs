import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import BoxList from './BoxList'
import BackButton from '@/components/BackButton'

async function getBoxes() {
  return prisma.box.findMany({
    include: {
      bookings: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          supplier: { select: { id: true, name: true } },
          customer: { select: { id: true, name: true } },
          carrier: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
}

export default async function BoxesPage() {
  const boxes = await getBoxes()

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
              <h1 className="text-lg font-bold text-[#3c7460]">Kisten-Übersicht</h1>
              <p className="text-xs text-[#4a4a49]/70">{boxes.length} Kisten im System</p>
            </div>
          </div>
          <Link
            href="/boxes/new"
            className="px-4 py-2 bg-[#3c7460] text-white rounded-lg hover:bg-[#2d5a4a] transition font-medium"
          >
            + Neue Kiste
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <BoxList initialBoxes={boxes} />
      </div>
    </main>
  )
}
