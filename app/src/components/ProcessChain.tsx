'use client'

import { useState } from 'react'

const stations = [
  {
    id: 'erzeuger',
    name: 'Beim Erzeuger',
    icon: '🏭',
    inputStatus: 'leer, gereinigt',
    outputStatus: 'gefüllt',
    actions: ['Zugangsbuchung', 'Befüllbuchung', 'Abgangsbuchung'],
  },
  {
    id: 'fracht_kunde',
    name: 'Fracht → Kunde',
    icon: '🚛',
    inputStatus: 'gefüllt',
    outputStatus: 'gefüllt',
    actions: ['Zugangsbuchung', 'Abgangsbuchung'],
  },
  {
    id: 'kunde',
    name: 'Beim Kunden',
    icon: '🏢',
    inputStatus: 'gefüllt',
    outputStatus: 'leer, verschmutzt',
    actions: ['Zugangsbuchung', 'Pfandkonto', 'Abgangsbuchung'],
  },
  {
    id: 'fracht_waescher',
    name: 'Fracht → Wäscher',
    icon: '🚛',
    inputStatus: 'leer, verschmutzt',
    outputStatus: 'leer, verschmutzt',
    actions: ['Zugangsbuchung', 'Abgangsbuchung'],
  },
  {
    id: 'waescher',
    name: 'Beim Wäscher',
    icon: '🧼',
    inputStatus: 'leer, verschmutzt',
    outputStatus: 'leer, gereinigt',
    actions: ['Zugangsbuchung', 'Qualitätscheck', 'Waschprotokoll', 'Abgangsbuchung'],
  },
  {
    id: 'fracht_erzeuger',
    name: 'Fracht → Erzeuger',
    icon: '🚛',
    inputStatus: 'leer, gereinigt',
    outputStatus: 'leer, gereinigt',
    actions: ['Zugangsbuchung', 'Abgangsbuchung'],
  },
]

export default function ProcessChain() {
  const [selectedStation, setSelectedStation] = useState<string | null>(null)

  return (
    <div className="relative">
      {/* Chain visualization */}
      <div className="flex items-center justify-between relative">
        {/* Connection line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#3c7460]/20 -translate-y-1/2 z-0" />
        
        {stations.map((station, index) => {
          const isSelected = selectedStation === station.id
          const isEven = index % 2 === 0
          
          return (
            <div key={station.id} className="relative z-10 flex flex-col items-center">
              {/* Arrow between stations */}
              {index > 0 && (
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-[#3c7460]/40">
                  →
                </div>
              )}
              
              {/* Station node */}
              <button
                onClick={() => setSelectedStation(isSelected ? null : station.id)}
                className={`
                  w-20 h-20 rounded-2xl flex flex-col items-center justify-center
                  transition-all duration-200 cursor-pointer
                  ${isSelected 
                    ? 'bg-[#3c7460] text-white shadow-lg scale-110' 
                    : isEven 
                      ? 'bg-white border-2 border-[#3c7460] text-[#3c7460]'
                      : 'bg-white border-2 border-[#b3c43e] text-[#3c7460]'
                  }
                `}
              >
                <span className="text-2xl">{station.icon}</span>
                <span className="text-xs font-medium mt-1">
                  {index + 1}
                </span>
              </button>
              
              {/* Station name */}
              <div className="mt-2 text-center">
                <div className="text-xs font-medium text-[#4a4a49] max-w-[80px]">
                  {station.name}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Circular arrow indicating cycle */}
      <div className="flex justify-center mt-4">
        <div className="text-[#3c7460]/60 text-sm flex items-center gap-2">
          <span>↻</span>
          <span>Kreislauf</span>
        </div>
      </div>

      {/* Selected station details */}
      {selectedStation && (
        <div className="mt-6 p-4 bg-[#3c7460]/5 rounded-xl border border-[#3c7460]/10">
          {(() => {
            const station = stations.find(s => s.id === selectedStation)!
            return (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 bg-[#3c7460] rounded-lg flex items-center justify-center text-white text-xl">
                    {station.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#4a4a49]">{station.name}</h3>
                    <p className="text-sm text-[#4a4a49]/70">
                      Eingang: <span className="font-medium">{station.inputStatus}</span> → 
                      Ausgang: <span className="font-medium">{station.outputStatus}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {station.actions.map(action => (
                    <button
                      key={action}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[#b3c43e]/20 text-[#3c7460] hover:bg-[#b3c43e]/30 transition"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}
