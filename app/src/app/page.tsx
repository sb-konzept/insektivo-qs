import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import ProcessChain from '@/components/ProcessChain'

async function getStats() {
  const [boxes, bookings, suppliers, customers, incidents] = await Promise.all([
    prisma.box.count(),
    prisma.booking.count(),
    prisma.supplier.count(),
    prisma.customer.count(),
    prisma.incident.count({ where: { status: 'offen' } }),
  ])
  return { boxes, bookings, suppliers, customers, incidents }
}

export default async function Home() {
  const stats = await getStats()

  return (
    <main className="min-h-screen bg-gradient-brand">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#3c7460]/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image 
              src="/logo.jpg" 
              alt="INSEKTIVO" 
              width={180} 
              height={50}
              className="h-10 w-auto"
            />
            <div className="border-l border-[#3c7460]/30 pl-4">
              <p className="text-sm font-medium text-[#3c7460]">QS-System</p>
              <p className="text-xs text-[#4a4a49]/70">Qualitätssicherung & Rückverfolgbarkeit</p>
            </div>
          </div>
          <nav className="flex gap-4">
            <Link href="/boxes" className="px-4 py-2 text-sm font-medium text-[#4a4a49] hover:text-[#3c7460] transition">
              Kisten
            </Link>
            <Link href="/adressen" className="px-4 py-2 text-sm font-medium text-[#4a4a49] hover:text-[#3c7460] transition">
              📋 Adressen
            </Link>
            <Link href="/booking" className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-lg hover:bg-secondary-dark transition">
              + Buchung
            </Link>
            <Link href="/incidents" className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">
              QS-Vorfälle {stats.incidents > 0 && `(${stats.incidents})`}
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="text-3xl font-bold text-[#3c7460]">{stats.boxes}</div>
            <div className="text-sm text-[#4a4a49]/70">Kisten im System</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="text-3xl font-bold text-[#b3c43e]">{stats.bookings}</div>
            <div className="text-sm text-[#4a4a49]/70">Buchungen</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="text-3xl font-bold text-[#3c7460]">{stats.suppliers}</div>
            <div className="text-sm text-[#4a4a49]/70">Lieferanten</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="text-3xl font-bold text-[#b3c43e]">{stats.customers}</div>
            <div className="text-sm text-[#4a4a49]/70">Kunden</div>
          </div>
        </div>

        {/* Process Chain */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#4a4a49] mb-6">Prozesskette</h2>
          <ProcessChain />
        </div>

        {/* Station Descriptions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h3 className="font-semibold text-[#4a4a49] mb-2 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#3c7460]/10 rounded-full flex items-center justify-center text-[#3c7460]">①</span>
              Beim Erzeuger
            </h3>
            <p className="text-sm text-[#4a4a49]/80">
              Leere, gereinigte Kisten werden mit Larven befüllt. Jede Befüllung wird mit Datum, Uhrzeit und Gewicht dokumentiert. 
              Anschließend erfolgt die Abgangsbuchung mit Lieferschein und Handscannererfassung.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h3 className="font-semibold text-[#4a4a49] mb-2 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#b3c43e]/20 rounded-full flex items-center justify-center text-[#3c7460]">②</span>
              Fracht zum Kunden
            </h3>
            <p className="text-sm text-[#4a4a49]/80">
              Transport der gefüllten Kisten durch zertifizierte Speditionen. Zugangsbuchung mit Lieferscheinbestätigung per Scanner beim Fahrer.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h3 className="font-semibold text-[#4a4a49] mb-2 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#3c7460]/10 rounded-full flex items-center justify-center text-[#3c7460]">③</span>
              Beim Kunden
            </h3>
            <p className="text-sm text-[#4a4a49]/80">
              Empfang und Buchung auf Pfandkonto. Nach Bestätigung wird die Ware zur Rechnung freigegeben. 
              Leere, verschmutzte Kisten werden zur Abholung angemeldet (Kundenportal).
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h3 className="font-semibold text-[#4a4a49] mb-2 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#b3c43e]/20 rounded-full flex items-center justify-center text-[#3c7460]">④</span>
              Fracht zum Wäscher
            </h3>
            <p className="text-sm text-[#4a4a49]/80">
              Transport der verschmutzten Kisten zur Waschstation. Abholschein mit Handscannererfassung.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h3 className="font-semibold text-[#4a4a49] mb-2 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#3c7460]/10 rounded-full flex items-center justify-center text-[#3c7460]">⑤</span>
              Beim Wäscher
            </h3>
            <p className="text-sm text-[#4a4a49]/80">
              Einzelidentifikation an der Waschstation (100%). Qualitätscheck der Kisten und Paletten mit Ausschussmeldungen. 
              Digitales Waschprotokoll wird erstellt.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h3 className="font-semibold text-[#4a4a49] mb-2 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#b3c43e]/20 rounded-full flex items-center justify-center text-[#3c7460]">⑥</span>
              Fracht zum Erzeuger
            </h3>
            <p className="text-sm text-[#4a4a49]/80">
              Rücktransport der gereinigten Kisten zum Erzeuger. Zugangsbuchung mit Lieferschein des Wäschers. 
              Der Kreislauf beginnt von vorne.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
