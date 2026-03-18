import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const customer = await prisma.customer.findUnique({ where: { id } })
  
  if (!customer) {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  }
  
  return NextResponse.json(customer)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    if (!body.name) {
      return NextResponse.json({ error: 'Name ist erforderlich' }, { status: 400 })
    }

    const customer = await prisma.customer.update({
      where: { id },
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
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Prüfen ob noch Buchungen existieren
    const bookings = await prisma.booking.count({ where: { customerId: id } })
    if (bookings > 0) {
      return NextResponse.json({ 
        error: `Kann nicht gelöscht werden: ${bookings} Buchungen vorhanden` 
      }, { status: 400 })
    }

    await prisma.customer.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 })
  }
}
