'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Props = {
  batches: string[]
}

export default function NewIncidentForm({ batches }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    incidentType: '',
    affectedBatchNr: '',
    customBatchNr: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const batchNr = form.affectedBatchNr === 'custom' ? form.customBatchNr : form.affectedBatchNr

      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          incidentType: form.incidentType,
          affectedBatchNr: batchNr || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Fehler beim Erstellen')
      }

      router.push('/incidents')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      <div className="text-center pb-4 border-b border-gray-100">
        <div className="text-4xl mb-2">🚨</div>
        <h2 className="text-xl font-bold text-[#4a4a49]">QS-Vorfall melden</h2>
        <p className="text-sm text-[#4a4a49]/70">Starten Sie das Krisenmanagement-Protokoll</p>
      </div>

      {/* Vorfallsart */}
      <div>
        <label className="block text-sm font-medium text-[#4a4a49] mb-3">Art des Vorfalls *</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, incidentType: 'lieferanten_rueckruf' })}
            className={`p-4 rounded-xl border-2 transition text-left ${
              form.incidentType === 'lieferanten_rueckruf'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div className="text-2xl mb-2">📥</div>
            <div className="font-medium text-[#4a4a49]">Lieferanten-Rückruf</div>
            <div className="text-xs text-[#4a4a49]/70 mt-1">
              Lieferant meldet Problem mit Ausgangsstoff
            </div>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, incidentType: 'kunden_reklamation' })}
            className={`p-4 rounded-xl border-2 transition text-left ${
              form.incidentType === 'kunden_reklamation'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-red-300'
            }`}
          >
            <div className="text-2xl mb-2">📤</div>
            <div className="font-medium text-[#4a4a49]">Kunden-Reklamation</div>
            <div className="text-xs text-[#4a4a49]/70 mt-1">
              Kunde meldet Problem mit Produkt
            </div>
          </button>
        </div>
      </div>

      {/* Titel */}
      <div>
        <label className="block text-sm font-medium text-[#4a4a49] mb-2">Titel des Vorfalls *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="z.B. Kontamination Charge CH-20240003"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-[#4a4a49]"
          required
        />
      </div>

      {/* Beschreibung */}
      <div>
        <label className="block text-sm font-medium text-[#4a4a49] mb-2">Beschreibung</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Detaillierte Beschreibung des Vorfalls..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-[#4a4a49]"
        />
      </div>

      {/* Betroffene Charge */}
      <div>
        <label className="block text-sm font-medium text-[#4a4a49] mb-2">Betroffene Charge</label>
        <select
          value={form.affectedBatchNr}
          onChange={(e) => setForm({ ...form, affectedBatchNr: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-[#4a4a49] mb-2"
        >
          <option value="">Charge auswählen (optional)...</option>
          {batches.map(batch => (
            <option key={batch} value={batch}>{batch}</option>
          ))}
          <option value="custom">— Andere Charge eingeben —</option>
        </select>
        
        {form.affectedBatchNr === 'custom' && (
          <input
            type="text"
            value={form.customBatchNr}
            onChange={(e) => setForm({ ...form, customBatchNr: e.target.value })}
            placeholder="Chargennummer eingeben..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-[#4a4a49] font-mono"
          />
        )}
        <p className="text-xs text-[#4a4a49]/60 mt-1">
          Falls bekannt, ermöglicht die automatische Rückverfolgung
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex gap-3">
          <span className="text-xl">💡</span>
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Was passiert nach dem Erstellen?</p>
            <p>Das System erstellt automatisch einen Krisenmanagement-Workflow mit allen erforderlichen Schritten gemäß QS-Richtlinien. Sie können jeden Schritt dokumentieren und am Ende einen vollständigen Bericht exportieren.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Link
          href="/incidents"
          className="flex-1 px-4 py-3 text-center border border-gray-300 text-[#4a4a49] rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Abbrechen
        </Link>
        <button
          type="submit"
          disabled={loading || !form.title || !form.incidentType}
          className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 font-medium"
        >
          {loading ? 'Wird erstellt...' : '🚨 Vorfall melden'}
        </button>
      </div>
    </form>
  )
}
