'use client'

import { useState } from 'react'

type Booking = {
  id: string
  station: string
  bookingType: string
  createdAt: Date
  weight?: number | null
  batchNr?: string | null
}

type Box = {
  id: string
  code: string
  status: string
  currentStation: string
  createdAt: Date
  updatedAt: Date
  bookings: Booking[]
}

const statusLabels: Record<string, { label: string; color: string }> = {
  leer_gereinigt: { label: 'Leer (gereinigt)', color: 'bg-green-100 text-green-700' },
  gefuellt: { label: 'Gefüllt', color: 'bg-blue-100 text-blue-700' },
  leer_verschmutzt: { label: 'Leer (verschmutzt)', color: 'bg-orange-100 text-orange-700' },
}

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

export default function BoxList({ initialBoxes }: { initialBoxes: Box[] }) {
  const [boxes] = useState<Box[]>(initialBoxes)
  const [expandedBox, setExpandedBox] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filteredBoxes = filter === 'all' 
    ? boxes 
    : boxes.filter(box => box.status === filter || box.currentStation === filter)

  return (
    <div>
      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
            filter === 'all' ? 'bg-[#3c7460] text-white' : 'bg-white text-[#4a4a49] hover:bg-gray-100'
          }`}
        >
          Alle
        </button>
        {Object.entries(statusLabels).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === key ? 'bg-[#3c7460] text-white' : 'bg-white text-[#4a4a49] hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Box Grid */}
      {filteredBoxes.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <p className="text-[#4a4a49]/70">Keine Kisten gefunden</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBoxes.map(box => {
            const status = statusLabels[box.status] || { label: box.status, color: 'bg-gray-100 text-gray-700' }
            const isExpanded = expandedBox === box.id

            return (
              <div
                key={box.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setExpandedBox(isExpanded ? null : box.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#3c7460]/10 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                      <div>
                        <div className="font-mono font-bold text-[#3c7460]">{box.code}</div>
                        <div className="text-sm text-[#4a4a49]/70">
                          {stationLabels[box.currentStation] || box.currentStation}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-[#4a4a49]/40">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded History */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-[#3c7460]/5">
                    <h4 className="font-medium text-[#4a4a49] mb-3">Buchungshistorie</h4>
                    {box.bookings.length === 0 ? (
                      <p className="text-sm text-[#4a4a49]/70">Keine Buchungen vorhanden</p>
                    ) : (
                      <div className="space-y-2">
                        {box.bookings.map(booking => (
                          <div
                            key={booking.id}
                            className="flex items-center justify-between bg-white p-3 rounded-lg text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[#4a4a49]/50">
                                {new Date(booking.createdAt).toLocaleDateString('de-DE', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span className="font-medium text-[#3c7460]">
                                {stationLabels[booking.station] || booking.station}
                              </span>
                              <span className="text-[#4a4a49]/70">
                                {bookingTypeLabels[booking.bookingType] || booking.bookingType}
                              </span>
                            </div>
                            <div className="text-[#4a4a49]/70">
                              {booking.weight && `${booking.weight} kg`}
                              {booking.batchNr && ` | Charge: ${booking.batchNr}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
