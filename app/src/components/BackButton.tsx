'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
  variant?: 'light' | 'dark'
}

export default function BackButton({ variant = 'light' }: BackButtonProps) {
  const router = useRouter()

  const styles = variant === 'dark' 
    ? 'text-white/80 hover:text-white hover:bg-white/10'
    : 'text-[#3c7460] hover:bg-[#3c7460]/10'

  return (
    <button
      onClick={() => router.back()}
      className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition ${styles}`}
    >
      <svg 
        className="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
      Zurück
    </button>
  )
}
