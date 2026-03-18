import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(customers)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    if (!body.name) {
      return NextResponse.json({ error: 'Name ist erforderlich' }, { status: 400 })
    }

    const customer = await prisma.customer.create({
      data: {
        name: body.name,
        contactPerson: body.contactPerson || null,
        street: body.street || null,
        zipCode: body.zipCode || null,
        city: body.city || null,
        phone: body.phone || null,
        email: body.email || null,
        productionType: body.productionType || null,
        certificationSystem: body.certificationSystem || null,
        qsId: body.qsId || null,
        locationNr: body.locationNr || null,
      },
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Fehler beim Erstellen' }, { status: 500 })
  }
}
