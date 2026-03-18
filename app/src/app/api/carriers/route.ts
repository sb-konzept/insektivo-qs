import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const carriers = await prisma.carrier.findMany({
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(carriers)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.name) {
      return NextResponse.json({ error: 'Name ist erforderlich' }, { status: 400 })
    }

    const carrier = await prisma.carrier.create({
      data: {
        name: body.name,
        contactPerson: body.contactPerson || null,
        street: body.street || null,
        zipCode: body.zipCode || null,
        city: body.city || null,
        phone: body.phone || null,
        email: body.email || null,
        certificationSystem: body.certificationSystem || null,
        qsId: body.qsId || null,
        vehicleNr: body.vehicleNr || null,
      },
    })

    return NextResponse.json(carrier)
  } catch (error) {
    console.error('Error creating carrier:', error)
    return NextResponse.json({ error: 'Fehler beim Erstellen' }, { status: 500 })
  }
}
