'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Step = {
  id: string
  stepNr: number
  title: string
  description: string | null
  result: string | null
  completedAt: Date | null
}

type Props = {
  incidentId: string
  initialSteps: Step[]
}

export default function IncidentSteps({ incidentId, initialSteps }: Props) {
  const router = useRouter()
  const [steps, setSteps] = useState<Step[]>(initialSteps)
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const [editResult, setEditResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleToggleComplete = async (step: Step) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/incidents/${incidentId}/steps/${step.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedAt: step.completedAt ? null : new Date().toISOString(),
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setSteps(steps.map(s => s.id === step.id ? updated : s))
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating step:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveResult = async (stepId: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/incidents/${incidentId}/steps/${stepId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          result: editResult,
          completedAt: new Date().toISOString(),
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        setSteps(steps.map(s => s.id === stepId ? updated : s))
        setEditingStep(null)
        setEditResult('')
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating step:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (step: Step) => {
    setEditingStep(step.id)
    setEditResult(step.result || '')
  }

  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isEditing = editingStep === step.id
        const isCompleted = !!step.completedAt
        const isPrevCompleted = index === 0 || !!steps[index - 1].completedAt

        return (
          <div
            key={step.id}
            className={`relative border rounded-xl transition ${
              isCompleted 
                ? 'bg-green-50 border-green-200' 
                : isPrevCompleted 
                  ? 'bg-white border-[#b3c43e] border-2' 
                  : 'bg-gray-50 border-gray-200'
            }`}
          >
            {/* Timeline connector */}
            {index < steps.length - 1 && (
              <div className={`absolute left-7 top-full w-0.5 h-3 ${
                isCompleted ? 'bg-green-300' : 'bg-gray-200'
              }`}></div>
            )}

            <div className="p-4">
              <div className="flex items-start gap-4">
                {/* Step Number / Checkbox */}
                <button
                  onClick={() => handleToggleComplete(step)}
                  disabled={loading || (!isPrevCompleted && !isCompleted)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isPrevCompleted
                        ? 'bg-[#b3c43e] text-white hover:bg-[#9ab032] cursor-pointer'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? '✓' : step.stepNr}
                </button>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-medium ${isCompleted ? 'text-green-700' : 'text-[#4a4a49]'}`}>
                        {step.title}
                      </h4>
                      {step.description && (
                        <p className={`text-sm mt-1 ${isCompleted ? 'text-green-600/70' : 'text-[#4a4a49]/70'}`}>
                          {step.description}
                        </p>
                      )}
                    </div>

                    {!isEditing && isPrevCompleted && (
                      <button
                        onClick={() => startEditing(step)}
                        className="text-sm text-[#3c7460] hover:underline"
                      >
                        {step.result ? 'Bearbeiten' : 'Ergebnis eintragen'}
                      </button>
                    )}
                  </div>

                  {/* Result Display */}
                  {step.result && !isEditing && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                      <span className="text-xs text-green-600 font-medium">Ergebnis:</span>
                      <p className="text-sm text-[#4a4a49] mt-1">{step.result}</p>
                      {step.completedAt && (
                        <p className="text-xs text-[#4a4a49]/50 mt-2">
                          Abgeschlossen am {new Date(step.completedAt).toLocaleString('de-DE')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Edit Form */}
                  {isEditing && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <label className="text-xs text-yellow-700 font-medium block mb-2">
                        Ergebnis dokumentieren:
                      </label>
                      <textarea
                        value={editResult}
                        onChange={(e) => setEditResult(e.target.value)}
                        placeholder="Was wurde festgestellt/durchgeführt?"
                        rows={3}
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            setEditingStep(null)
                            setEditResult('')
                          }}
                          className="px-3 py-1.5 text-sm text-[#4a4a49] hover:bg-gray-100 rounded-lg transition"
                        >
                          Abbrechen
                        </button>
                        <button
                          onClick={() => handleSaveResult(step.id)}
                          disabled={loading}
                          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                          {loading ? 'Speichern...' : '✓ Als erledigt markieren'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {/* Completion Message */}
      {steps.every(s => s.completedAt) && (
        <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-xl text-center">
          <div className="text-3xl mb-2">🎉</div>
          <p className="font-medium text-green-700">Alle Schritte abgeschlossen!</p>
          <p className="text-sm text-green-600 mt-1">
            Der Vorfall kann jetzt als QS-Export dokumentiert werden.
          </p>
        </div>
      )}
    </div>
  )
}
