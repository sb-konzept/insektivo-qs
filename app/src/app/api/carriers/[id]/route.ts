import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const carrier = await prisma.carrier.findUnique({ where: { id } })
  
  if (!carrier) {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  }
  
  return NextResponse.json(carrier)
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

    const carrier = await prisma.carrier.update({
      where: { id },
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
    console.error('Error updating carrier:', error)
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
    const bookings = await prisma.booking.count({ where: { carrierId: id } })
    if (bookings > 0) {
      return NextResponse.json({ 
        error: `Kann nicht gelöscht werden: ${bookings} Buchungen vorhanden` 
      }, { status: 400 })
    }

    await prisma.carrier.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting carrier:', error)
    return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 })
  }
}
