'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

type AddressType = 'lieferanten' | 'kunden' | 'speditionen'

const typeLabels: Record<AddressType, string> = {
  lieferanten: 'Lieferant / Erzeuger / Wäscher',
  kunden: 'Kunde',
  speditionen: 'Spedition',
}

const productionTypes = {
  lieferanten: ['Erzeuger', 'Wäscher', 'Kleinsterzeuger', 'Großerzeuger'],
  kunden: ['Landwirtschaft', 'Futtermittelwerk', 'Zoofachhandel', 'Industrie'],
}

function FormContent({ initialType }: { initialType: AddressType }) {
  const router = useRouter()
  const [addressType, setAddressType] = useState<AddressType>(initialType)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    street: '',
    zipCode: '',
    city: '',
    phone: '',
    email: '',
    productionType: '',
    certificationSystem: '',
    qsId: '',
    locationNr: '',
    vehicleNr: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = addressType === 'lieferanten' 
        ? '/api/suppliers' 
        : addressType === 'kunden' 
        ? '/api/customers' 
        : '/api/carriers'

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Fehler beim Speichern')
      }

      router.push('/adressen')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
      {/* Typ-Auswahl */}
      <div>
        <label className="block text-sm font-medium text-[#4a4a49] mb-2">
          Adresstyp
        </label>
        <div className="flex gap-2">
          {(Object.keys(typeLabels) as AddressType[]).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setAddressType(type)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                addressType === type
                  ? 'bg-[#3c7460] text-white'
                  : 'bg-gray-100 text-[#4a4a49] hover:bg-gray-200'
              }`}
            >
              {type === 'lieferanten' && '🏭'}
              {type === 'kunden' && '🏢'}
              {type === 'speditionen' && '🚛'}
              {' '}
              {typeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Basis-Daten */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#4a4a49] mb-1">
            Firmenname *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] focus:border-transparent"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#4a4a49] mb-1">
            Ansprechpartner
          </label>
          <input
            type="text"
            value={formData.contactPerson}
            onChange={(e) => updateField('contactPerson', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] focus:border-transparent"
          />
        </div>
      </div>

      {/* Adresse */}
      <div>
        <h3 className="text-sm font-semibold text-[#4a4a49] mb-3">📍 Adresse</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Straße & Hausnummer"
              value={formData.street}
              onChange={(e) => updateField('street', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="PLZ"
              value={formData.zipCode}
              onChange={(e) => updateField('zipCode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Ort"
              value={formData.city}
              onChange={(e) => updateField('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Kontakt */}
      <div>
        <h3 className="text-sm font-semibold text-[#4a4a49] mb-3">📞 Kontakt</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="tel"
              placeholder="Telefon"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="E-Mail"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Typ-spezifische Felder */}
      {(addressType === 'lieferanten' || addressType === 'kunden') && (
        <div>
          <h3 className="text-sm font-semibold text-[#4a4a49] mb-3">🏷️ Klassifizierung</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#4a4a49]/70 mb-1">Betriebsart</label>
              <select
                value={formData.productionType}
                onChange={(e) => updateField('productionType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] focus:border-transparent"
              >
                <option value="">Bitte wählen...</option>
                {productionTypes[addressType].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-[#4a4a49]/70 mb-1">Zertifizierungssystem</label>
              <select
                value={formData.certificationSystem}
                onChange={(e) => updateField('certificationSystem', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] focus:border-transparent"
              >
                <option value="">Bitte wählen...</option>
                <option value="QS">QS</option>
                <option value="GMP+">GMP+</option>
                <option value="Bio">Bio</option>
                <option value="Ohne">Ohne Zertifizierung</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {addressType === 'speditionen' && (
        <div>
          <h3 className="text-sm font-semibold text-[#4a4a49] mb-3">🚛 Fahrzeug</h3>
          <div>
            <label className="block text-xs text-[#4a4a49]/70 mb-1">Kennzeichen</label>
            <input
              type="text"
              placeholder="z.B. B-AB 1234"
              value={formData.vehicleNr}
              onChange={(e) => updateField('vehicleNr', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* QS-Daten */}
      <div>
        <h3 className="text-sm font-semibold text-[#4a4a49] mb-3">🆔 QS-Daten</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#4a4a49]/70 mb-1">QS-ID</label>
            <input
              type="text"
              placeholder="4076xxxxx..."
              value={formData.qsId}
              onChange={(e) => updateField('qsId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] focus:border-transparent font-mono"
            />
          </div>
          {addressType !== 'speditionen' && (
            <div>
              <label className="block text-xs text-[#4a4a49]/70 mb-1">
                {addressType === 'kunden' ? 'VVVO-Nr.' : 'Standort-Nr.'}
              </label>
              <input
                type="text"
                value={formData.locationNr}
                onChange={(e) => updateField('locationNr', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c7460] focus:border-transparent font-mono"
              />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Link
          href="/adressen"
          className="flex-1 px-4 py-2 text-center border border-gray-300 text-[#4a4a49] rounded-lg hover:bg-gray-50 transition"
        >
          Abbrechen
        </Link>
        <button
          type="submit"
          disabled={loading || !formData.name}
          className="flex-1 px-4 py-2 bg-[#3c7460] text-white rounded-lg hover:bg-[#2d5a4a] transition disabled:opacity-50"
        >
          {loading ? 'Speichern...' : 'Speichern'}
        </button>
      </div>
    </form>
  )
}

function FormWithParams() {
  const searchParams = useSearchParams()
  const initialType = (searchParams.get('typ') as AddressType) || 'lieferanten'
  return <FormContent initialType={initialType} />
}

export default function NewAddressForm() {
  return (
    <Suspense fallback={<div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse h-96" />}>
      <FormWithParams />
    </Suspense>
  )
}
