import Link from 'next/link'
import Image from 'next/image'
import BackButton from '@/components/BackButton'
import NewAddressForm from './NewAddressForm'

export default function NewAddressPage() {
  return (
    <main className="min-h-screen bg-gradient-brand">
      <header className="bg-white shadow-sm border-b border-[#3c7460]/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <BackButton />
          <Link href="/">
            <Image 
              src="/logo.jpg" 
              alt="INSEKTIVO" 
              width={140} 
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <div className="border-l border-[#3c7460]/30 pl-4">
            <h1 className="text-lg font-bold text-[#3c7460]">➕ Neue Adresse</h1>
            <p className="text-xs text-[#4a4a49]/70">Stammdaten erfassen</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <NewAddressForm />
      </div>
    </main>
  )
}
