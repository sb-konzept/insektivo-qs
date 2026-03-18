import Link from 'next/link'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import PrintButton from './PrintButton'

async function getExportData(incidentId: string) {
  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
    include: {
      steps: { orderBy: { stepNr: 'asc' } },
    },
  })

  if (!incident) return null

  // Get affected bookings by batch number
  const affectedBookings = incident.affectedBatchNr 
    ? await prisma.booking.findMany({
        where: { batchNr: incident.affectedBatchNr },
        include: {
          box: true,
          supplier: true,
          customer: true,
          carrier: true,
        },
        orderBy: { createdAt: 'asc' },
      })
    : []

  // Get all suppliers and customers involved
  const supplierIds = [...new Set(affectedBookings.filter(b => b.supplierId).map(b => b.supplierId!))]
  const customerIds = [...new Set(affectedBookings.filter(b => b.customerId).map(b => b.customerId!))]

  const suppliers = await prisma.supplier.findMany({ where: { id: { in: supplierIds } } })
  const customers = await prisma.customer.findMany({ where: { id: { in: customerIds } } })

  return { incident, affectedBookings, suppliers, customers }
}

export default async function ExportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getExportData(id)

  if (!data) {
    notFound()
  }

  const { incident, affectedBookings, suppliers, customers } = data

  return (
    <main className="min-h-screen bg-white">
      {/* Header - not printed */}
      <header className="bg-[#3c7460] text-white print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/incidents" className="text-white/70 hover:text-white">
              ← Zurück
            </Link>
            <h1 className="text-xl font-bold">QS-Export</h1>
          </div>
          <PrintButton />
        </div>
      </header>

      {/* Printable content */}
      <div className="max-w-4xl mx-auto p-8">
        {/* Company Header */}
        <div className="border-b-2 border-[#3c7460] pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#3c7460]">INSEKTIVO</h1>
              <p className="text-[#4a4a49]/70">Erzeugergemeinschaft eG</p>
            </div>
            <div className="text-right text-sm text-[#4a4a49]/70">
              <p>Datum: {new Date().toLocaleDateString('de-DE')}</p>
              <p>QS-ID: [QS-ID]</p>
              <p>Standort-Nr: [Standort]</p>
            </div>
          </div>
        </div>

        {/* Incident Details */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 bg-[#3c7460]/10 text-[#3c7460] px-3 py-2">
            Rückverfolgbarkeit: {incident.incidentType === 'lieferanten_rueckruf' ? 'Rückruf durch Lieferanten' : 'Reklamation vom Kunden'}
          </h2>
          
          <table className="w-full text-sm border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium text-[#4a4a49] w-40">Vorfall:</td>
                <td className="py-2 text-[#4a4a49]">{incident.title}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-[#4a4a49]">Beschreibung:</td>
                <td className="py-2 text-[#4a4a49]">{incident.description}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-[#4a4a49]">Betroffene Charge:</td>
                <td className="py-2 font-mono text-[#3c7460]">{incident.affectedBatchNr || '-'}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-[#4a4a49]">Status:</td>
                <td className="py-2 text-[#4a4a49]">{incident.status}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium text-[#4a4a49]">Gemeldet am:</td>
                <td className="py-2 text-[#4a4a49]">{new Date(incident.reportedAt).toLocaleDateString('de-DE')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Affected Suppliers */}
        {suppliers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 bg-[#b3c43e]/20 text-[#3c7460] px-3 py-2">
              Informationen zu Lieferanten der betroffenen Ware
            </h2>
            
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Name</th>
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Adresse</th>
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Kontakt</th>
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">QS-ID</th>
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Zertifizierung</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(s => (
                  <tr key={s.id}>
                    <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]">{s.name}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]">{s.street}, {s.zipCode} {s.city}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]">{s.phone}<br/>{s.email}</td>
                    <td className="border border-gray-300 px-2 py-1 font-mono text-xs text-[#3c7460]">{s.qsId}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]">{s.certificationSystem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Affected Customers */}
        {customers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 bg-[#3c7460]/10 text-[#3c7460] px-3 py-2">
              Informationen zu Kunden der betroffenen Ware
            </h2>
            
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Name</th>
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Adresse</th>
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Kontakt</th>
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">QS-ID</th>
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Produktionsart</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]">{c.name}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]">{c.street}, {c.zipCode} {c.city}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]">{c.phone}<br/>{c.email}</td>
                    <td className="border border-gray-300 px-2 py-1 font-mono text-xs text-[#3c7460]">{c.qsId}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]">{c.productionType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Booking Trail */}
        {affectedBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4 bg-[#b3c43e]/20 text-[#3c7460] px-3 py-2">
              Rückverfolgbarkeit: Buchungskette
            </h2>
            
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Datum/Zeit</th>
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Kiste</th>
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Station</th>
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Buchungsart</th>
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Lieferschein</th>
                  <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Charge</th>
                </tr>
              </thead>
              <tbody>
                {affectedBookings.map(b => (
                  <tr key={b.id}>
                    <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]">
                      {new Date(b.createdAt).toLocaleString('de-DE')}
                    </td>
                    <td className="border border-gray-300 px-2 py-1 font-mono text-[#3c7460]">{b.box.code}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]">{b.station}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]">{b.bookingType}</td>
                    <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]">{b.deliveryNoteNr || '-'}</td>
                    <td className="border border-gray-300 px-2 py-1 font-mono text-[#3c7460]">{b.batchNr || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Crisis Management Steps */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 bg-[#3c7460]/10 text-[#3c7460] px-3 py-2">
            Krisenmanagement: Durchgeführte Schritte
          </h2>
          
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-2 py-1 text-center w-12 text-[#4a4a49]">Nr.</th>
                <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Schritt</th>
                <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Beschreibung</th>
                <th className="border border-gray-300 px-2 py-1 text-left text-[#4a4a49]">Ergebnis</th>
                <th className="border border-gray-300 px-2 py-1 text-center w-20 text-[#4a4a49]">Status</th>
              </tr>
            </thead>
            <tbody>
              {incident.steps.map(step => (
                <tr key={step.id}>
                  <td className="border border-gray-300 px-2 py-1 text-center text-[#4a4a49]">{step.stepNr}</td>
                  <td className="border border-gray-300 px-2 py-1 font-medium text-[#4a4a49]">{step.title}</td>
                  <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]/70">{step.description}</td>
                  <td className="border border-gray-300 px-2 py-1 text-[#4a4a49]">{step.result || '-'}</td>
                  <td className="border border-gray-300 px-2 py-1 text-center">
                    {step.completedAt ? '✓' : '○'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signature */}
        <div className="mt-12 pt-8 border-t-2 border-[#3c7460]/30">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-[#4a4a49]/70 mb-8">Krisenmanager:</p>
              <div className="border-b border-[#4a4a49] w-48"></div>
              <p className="text-sm text-[#4a4a49]/50 mt-1">Unterschrift</p>
            </div>
            <div>
              <p className="text-sm text-[#4a4a49]/70 mb-8">Gesetzlicher Vertreter:</p>
              <div className="border-b border-[#4a4a49] w-48"></div>
              <p className="text-sm text-[#4a4a49]/50 mt-1">Unterschrift</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
