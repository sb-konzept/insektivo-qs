'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  boxes: { id: string; code: string; status: string; currentStation: string }[]
  suppliers: { id: string; name: string }[]
  customers: { id: string; name: string }[]
  carriers: { id: string; name: string }[]
}

const stations = [
  { id: 'erzeuger', name: '🏭 Beim Erzeuger' },
  { id: 'fracht_kunde', name: '🚛 Fracht zum Kunden' },
  { id: 'kunde', name: '🏢 Beim Kunden' },
  { id: 'fracht_waescher', name: '🚛 Fracht zum Wäscher' },
  { id: 'waescher', name: '🧼 Beim Wäscher' },
  { id: 'fracht_erzeuger', name: '🚛 Fracht zum Erzeuger' },
]

const bookingTypes = [
  { id: 'zugang', name: 'Zugang' },
  { id: 'abgang', name: 'Abgang' },
  { id: 'befuellung', name: 'Befüllung' },
  { id: 'qualitaetscheck', name: 'Qualitätscheck' },
]

export default function BookingForm({ boxes, suppliers, customers, carriers }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    boxId: '',
    station: '',
    bookingType: '',
    weight: '',
    batchNr: '',
    deliveryNoteNr: '',
    supplierId: '',
    customerId: '',
    carrierId: '',
    qualityOk: true,
    qualityNotes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Fehler beim Speichern')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/boxes')
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  const showSupplier = form.station === 'erzeuger' && form.bookingType === 'zugang'
  const showCustomer = form.station === 'kunde'
  const showCarrier = form.station.startsWith('fracht')
  const showWeight = form.bookingType === 'befuellung'
  const showBatch = form.bookingType === 'befuellung'
  const showDeliveryNote = ['zugang', 'abgang'].includes(form.bookingType)
  const showQuality = form.bookingType === 'qualitaetscheck'

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-[#4a4a49] mb-2">Buchung erfasst!</h2>
        <p className="text-[#4a4a49]/70">Weiterleitung zur Kisten-Übersicht...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Kiste auswählen */}
      <div>
        <label className="block text-sm font-medium text-[#4a4a49] mb-2">Kiste *</label>
        <select
          value={form.boxId}
          onChange={(e) => setForm({ ...form, boxId: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] text-[#4a4a49]"
          required
        >
          <option value="">Kiste auswählen...</option>
          {boxes.map((box) => (
            <option key={box.id} value={box.id}>
              {box.code} ({box.status} @ {box.currentStation})
            </option>
          ))}
        </select>
      </div>

      {/* Station */}
      <div>
        <label className="block text-sm font-medium text-[#4a4a49] mb-2">Station *</label>
        <div className="grid grid-cols-2 gap-2">
          {stations.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setForm({ ...form, station: s.id })}
              className={`px-3 py-2 text-sm rounded-lg border transition ${
                form.station === s.id
                  ? 'bg-[#3c7460] text-white border-[#3c7460]'
                  : 'bg-white text-[#4a4a49] border-gray-300 hover:border-[#3c7460]'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Buchungsart */}
      <div>
        <label className="block text-sm font-medium text-[#4a4a49] mb-2">Buchungsart *</label>
        <div className="flex gap-2">
          {bookingTypes.map((bt) => (
            <button
              key={bt.id}
              type="button"
              onClick={() => setForm({ ...form, bookingType: bt.id })}
              className={`flex-1 px-3 py-2 text-sm rounded-lg border transition ${
                form.bookingType === bt.id
                  ? 'bg-[#b3c43e] text-white border-[#b3c43e]'
                  : 'bg-white text-[#4a4a49] border-gray-300 hover:border-[#b3c43e]'
              }`}
            >
              {bt.name}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional fields */}
      {showWeight && (
        <div>
          <label className="block text-sm font-medium text-[#4a4a49] mb-2">Gewicht (kg)</label>
          <input
            type="number"
            step="0.1"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            placeholder="z.B. 18.5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] text-[#4a4a49]"
          />
        </div>
      )}

      {showBatch && (
        <div>
          <label className="block text-sm font-medium text-[#4a4a49] mb-2">Chargennummer</label>
          <input
            type="text"
            value={form.batchNr}
            onChange={(e) => setForm({ ...form, batchNr: e.target.value })}
            placeholder="z.B. CH-20240001"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] text-[#4a4a49]"
          />
        </div>
      )}

      {showDeliveryNote && (
        <div>
          <label className="block text-sm font-medium text-[#4a4a49] mb-2">Lieferschein-Nr.</label>
          <input
            type="text"
            value={form.deliveryNoteNr}
            onChange={(e) => setForm({ ...form, deliveryNoteNr: e.target.value })}
            placeholder="z.B. LS-2024-1234"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] text-[#4a4a49]"
          />
        </div>
      )}

      {showSupplier && (
        <div>
          <label className="block text-sm font-medium text-[#4a4a49] mb-2">Lieferant</label>
          <select
            value={form.supplierId}
            onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] text-[#4a4a49]"
          >
            <option value="">Lieferant auswählen...</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      {showCustomer && (
        <div>
          <label className="block text-sm font-medium text-[#4a4a49] mb-2">Kunde</label>
          <select
            value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] text-[#4a4a49]"
          >
            <option value="">Kunde auswählen...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {showCarrier && (
        <div>
          <label className="block text-sm font-medium text-[#4a4a49] mb-2">Spedition</label>
          <select
            value={form.carrierId}
            onChange={(e) => setForm({ ...form, carrierId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] text-[#4a4a49]"
          >
            <option value="">Spedition auswählen...</option>
            {carriers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {showQuality && (
        <>
          <div>
            <label className="block text-sm font-medium text-[#4a4a49] mb-2">Qualität OK?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={form.qualityOk}
                  onChange={() => setForm({ ...form, qualityOk: true })}
                  className="text-green-600"
                />
                <span className="text-green-600">✓ Bestanden</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!form.qualityOk}
                  onChange={() => setForm({ ...form, qualityOk: false })}
                  className="text-red-600"
                />
                <span className="text-red-600">✗ Ausschuss</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4a4a49] mb-2">Notizen</label>
            <textarea
              value={form.qualityNotes}
              onChange={(e) => setForm({ ...form, qualityNotes: e.target.value })}
              placeholder="Qualitätsnotizen..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] text-[#4a4a49]"
            />
          </div>
        </>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !form.boxId || !form.station || !form.bookingType}
        className="w-full px-4 py-3 bg-[#3c7460] text-white rounded-lg hover:bg-[#2d5a4a] transition disabled:opacity-50 font-medium"
      >
        {loading ? 'Speichern...' : 'Buchung erfassen'}
      </button>
    </form>
  )
}
