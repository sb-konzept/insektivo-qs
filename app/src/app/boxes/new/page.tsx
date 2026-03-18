'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewBoxPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateCode = () => {
    const year = new Date().getFullYear()
    const num = Math.floor(Math.random() * 9000) + 1000
    setCode(`K-${year}-${num}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/boxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Fehler beim Erstellen')
      }

      router.push('/boxes')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-brand">
      <header className="bg-white shadow-sm border-b border-[#3c7460]/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/boxes" className="text-[#4a4a49]/70 hover:text-[#3c7460]">
            ← Zurück
          </Link>
          <div className="w-10 h-10 bg-[#3c7460] rounded-lg flex items-center justify-center">
            <span className="text-white text-xl">📦</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#3c7460]">Neue Kiste anlegen</h1>
          </div>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#4a4a49] mb-2">
              Kistencode
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="z.B. K-2024-0001"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] focus:border-transparent text-[#4a4a49]"
                required
              />
              <button
                type="button"
                onClick={generateCode}
                className="px-4 py-2 bg-[#b3c43e]/20 text-[#3c7460] rounded-lg hover:bg-[#b3c43e]/30 transition"
              >
                Generieren
              </button>
            </div>
            <p className="mt-2 text-sm text-[#4a4a49]/70">
              Der Code sollte eindeutig sein (z.B. für QR-/Barcode)
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Link
              href="/boxes"
              className="flex-1 px-4 py-2 text-center border border-gray-300 text-[#4a4a49] rounded-lg hover:bg-gray-50 transition"
            >
              Abbrechen
            </Link>
            <button
              type="submit"
              disabled={loading || !code}
              className="flex-1 px-4 py-2 bg-[#3c7460] text-white rounded-lg hover:bg-[#2d5a4a] transition disabled:opacity-50"
            >
              {loading ? 'Speichern...' : 'Kiste anlegen'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
