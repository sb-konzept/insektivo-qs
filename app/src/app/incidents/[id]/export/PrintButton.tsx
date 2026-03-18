'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 bg-white text-[#3c7460] rounded-lg hover:bg-[#b3c43e]/20 transition font-medium"
    >
      🖨️ Drucken / PDF
    </button>
  )
}
