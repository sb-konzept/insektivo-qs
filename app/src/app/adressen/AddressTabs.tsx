'use client'

import { useState } from 'react'
import Link from 'next/link'

type Supplier = {
  id: string
  name: string
  contactPerson: string | null
  street: string | null
  zipCode: string | null
  city: string | null
  phone: string | null
  email: string | null
  productionType: string | null
  qsId: string | null
}

type Customer = {
  id: string
  name: string
  contactPerson: string | null
  street: string | null
  zipCode: string | null
  city: string | null
  phone: string | null
  email: string | null
  productionType: string | null
  qsId: string | null
}

type Carrier = {
  id: string
  name: string
  contactPerson: string | null
  street: string | null
  zipCode: string | null
  city: string | null
  phone: string | null
  email: string | null
  vehicleNr: string | null
  qsId: string | null
}

interface Props {
  suppliers: Supplier[]
  customers: Customer[]
  carriers: Carrier[]
}

type Tab = 'kunden' | 'lieferanten' | 'speditionen'

export default function AddressTabs({ suppliers, customers, carriers }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('lieferanten')

  const tabs: { key: Tab; label: string; icon: string; count: number }[] = [
    { key: 'lieferanten', label: 'Lieferanten & Wäscher', icon: '🏭', count: suppliers.length },
    { key: 'kunden', label: 'Kunden', icon: '🏢', count: customers.length },
    { key: 'speditionen', label: 'Speditionen', icon: '🚛', count: carriers.length },
  ]

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab.key
                ? 'bg-[#3c7460] text-white'
                : 'bg-white text-[#4a4a49] hover:bg-[#3c7460]/10'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.key ? 'bg-white/20' : 'bg-[#3c7460]/10'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header with Add Button */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-[#4a4a49]">
            {tabs.find(t => t.key === activeTab)?.icon} {tabs.find(t => t.key === activeTab)?.label}
          </h2>
          <Link
            href={`/adressen/neu?typ=${activeTab}`}
            className="px-4 py-2 bg-[#3c7460] text-white rounded-lg hover:bg-[#2d5a4a] transition font-medium text-sm"
          >
            + Neu anlegen
          </Link>
        </div>

        {/* Table */}
        {activeTab === 'lieferanten' && (
          <SupplierTable suppliers={suppliers} />
        )}
        {activeTab === 'kunden' && (
          <CustomerTable customers={customers} />
        )}
        {activeTab === 'speditionen' && (
          <CarrierTable carriers={carriers} />
        )}
      </div>
    </div>
  )
}

function SupplierTable({ suppliers }: { suppliers: Supplier[] }) {
  if (suppliers.length === 0) {
    return (
      <div className="p-8 text-center text-[#4a4a49]/70">
        Keine Lieferanten vorhanden
      </div>
    )
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50 text-left text-sm text-[#4a4a49]/70">
        <tr>
          <th className="px-4 py-3 font-medium">Name</th>
          <th className="px-4 py-3 font-medium">Typ</th>
          <th className="px-4 py-3 font-medium">Adresse</th>
          <th className="px-4 py-3 font-medium">Kontakt</th>
          <th className="px-4 py-3 font-medium">QS-ID</th>
          <th className="px-4 py-3 font-medium"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {suppliers.map(s => (
          <tr key={s.id} className="hover:bg-gray-50">
            <td className="px-4 py-3">
              <span className="font-medium text-[#3c7460]">{s.name}</span>
              {s.contactPerson && (
                <span className="block text-sm text-[#4a4a49]/70">{s.contactPerson}</span>
              )}
            </td>
            <td className="px-4 py-3">
              {s.productionType && (
                <span className="px-2 py-1 bg-[#b3c43e]/20 text-[#3c7460] rounded text-xs font-medium">
                  {s.productionType}
                </span>
              )}
            </td>
            <td className="px-4 py-3 text-sm text-[#4a4a49]/80">
              {s.street && <>{s.street}<br/></>}
              {s.zipCode} {s.city}
            </td>
            <td className="px-4 py-3 text-sm text-[#4a4a49]/80">
              {s.phone && <>{s.phone}<br/></>}
              {s.email && <span className="text-[#3c7460]">{s.email}</span>}
            </td>
            <td className="px-4 py-3">
              {s.qsId && (
                <span className="font-mono text-xs text-[#4a4a49]">{s.qsId}</span>
              )}
            </td>
            <td className="px-4 py-3 flex gap-2">
              <Link
                href={`/adressen/bearbeiten/lieferanten/${s.id}`}
                className="px-3 py-1 text-sm text-[#3c7460] hover:bg-[#3c7460]/10 rounded transition"
              >
                ✏️ Bearbeiten
              </Link>
              <Link
                href={`/suppliers/${s.id}`}
                className="px-3 py-1 text-sm text-[#4a4a49]/70 hover:bg-gray-100 rounded transition"
              >
                Details
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CustomerTable({ customers }: { customers: Customer[] }) {
  if (customers.length === 0) {
    return (
      <div className="p-8 text-center text-[#4a4a49]/70">
        Keine Kunden vorhanden
      </div>
    )
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50 text-left text-sm text-[#4a4a49]/70">
        <tr>
          <th className="px-4 py-3 font-medium">Name</th>
          <th className="px-4 py-3 font-medium">Typ</th>
          <th className="px-4 py-3 font-medium">Adresse</th>
          <th className="px-4 py-3 font-medium">Kontakt</th>
          <th className="px-4 py-3 font-medium">QS-ID</th>
          <th className="px-4 py-3 font-medium"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {customers.map(c => (
          <tr key={c.id} className="hover:bg-gray-50">
            <td className="px-4 py-3">
              <span className="font-medium text-[#3c7460]">{c.name}</span>
              {c.contactPerson && (
                <span className="block text-sm text-[#4a4a49]/70">{c.contactPerson}</span>
              )}
            </td>
            <td className="px-4 py-3">
              {c.productionType && (
                <span className="px-2 py-1 bg-[#b3c43e]/20 text-[#3c7460] rounded text-xs font-medium">
                  {c.productionType}
                </span>
              )}
            </td>
            <td className="px-4 py-3 text-sm text-[#4a4a49]/80">
              {c.street && <>{c.street}<br/></>}
              {c.zipCode} {c.city}
            </td>
            <td className="px-4 py-3 text-sm text-[#4a4a49]/80">
              {c.phone && <>{c.phone}<br/></>}
              {c.email && <span className="text-[#3c7460]">{c.email}</span>}
            </td>
            <td className="px-4 py-3">
              {c.qsId && (
                <span className="font-mono text-xs text-[#4a4a49]">{c.qsId}</span>
              )}
            </td>
            <td className="px-4 py-3 flex gap-2">
              <Link
                href={`/adressen/bearbeiten/kunden/${c.id}`}
                className="px-3 py-1 text-sm text-[#3c7460] hover:bg-[#3c7460]/10 rounded transition"
              >
                ✏️ Bearbeiten
              </Link>
              <Link
                href={`/customers/${c.id}`}
                className="px-3 py-1 text-sm text-[#4a4a49]/70 hover:bg-gray-100 rounded transition"
              >
                Details
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CarrierTable({ carriers }: { carriers: Carrier[] }) {
  if (carriers.length === 0) {
    return (
      <div className="p-8 text-center text-[#4a4a49]/70">
        Keine Speditionen vorhanden
      </div>
    )
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50 text-left text-sm text-[#4a4a49]/70">
        <tr>
          <th className="px-4 py-3 font-medium">Name</th>
          <th className="px-4 py-3 font-medium">Kennzeichen</th>
          <th className="px-4 py-3 font-medium">Adresse</th>
          <th className="px-4 py-3 font-medium">Kontakt</th>
          <th className="px-4 py-3 font-medium">QS-ID</th>
          <th className="px-4 py-3 font-medium"></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {carriers.map(c => (
          <tr key={c.id} className="hover:bg-gray-50">
            <td className="px-4 py-3">
              <span className="font-medium text-[#3c7460]">{c.name}</span>
              {c.contactPerson && (
                <span className="block text-sm text-[#4a4a49]/70">{c.contactPerson}</span>
              )}
            </td>
            <td className="px-4 py-3">
              {c.vehicleNr && (
                <span className="font-mono text-sm text-[#4a4a49]">{c.vehicleNr}</span>
              )}
            </td>
            <td className="px-4 py-3 text-sm text-[#4a4a49]/80">
              {c.street && <>{c.street}<br/></>}
              {c.zipCode} {c.city}
            </td>
            <td className="px-4 py-3 text-sm text-[#4a4a49]/80">
              {c.phone && <>{c.phone}<br/></>}
              {c.email && <span className="text-[#3c7460]">{c.email}</span>}
            </td>
            <td className="px-4 py-3">
              {c.qsId && (
                <span className="font-mono text-xs text-[#4a4a49]">{c.qsId}</span>
              )}
            </td>
            <td className="px-4 py-3 flex gap-2">
              <Link
                href={`/adressen/bearbeiten/speditionen/${c.id}`}
                className="px-3 py-1 text-sm text-[#3c7460] hover:bg-[#3c7460]/10 rounded transition"
              >
                ✏️ Bearbeiten
              </Link>
              <Link
                href={`/carriers/${c.id}`}
                className="px-3 py-1 text-sm text-[#4a4a49]/70 hover:bg-gray-100 rounded transition"
              >
                Details
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
