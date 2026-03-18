import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { boxId, station, bookingType, weight, batchNr, deliveryNoteNr, supplierId, customerId, carrierId, qualityOk, qualityNotes } = data

    if (!boxId || !station || !bookingType) {
      return NextResponse.json({ error: 'boxId, station und bookingType erforderlich' }, { status: 400 })
    }

    // Create booking (convert empty strings to null for foreign keys)
    const booking = await prisma.booking.create({
      data: {
        boxId,
        station,
        bookingType,
        weight: weight ? parseFloat(weight) : null,
        batchNr: batchNr || null,
        deliveryNoteNr: deliveryNoteNr || null,
        supplierId: supplierId || null,
        customerId: customerId || null,
        carrierId: carrierId || null,
        qualityOk,
        qualityNotes: qualityNotes || null,
      },
    })

    // Update box status and station
    let newStatus = undefined
    if (bookingType === 'befuellung') {
      newStatus = 'gefuellt'
    } else if (bookingType === 'qualitaetscheck' && qualityOk) {
      newStatus = 'leer_gereinigt'
    } else if (station === 'kunde' && bookingType === 'abgang') {
      newStatus = 'leer_verschmutzt'
    }

    await prisma.box.update({
      where: { id: boxId },
      data: {
        currentStation: station,
        ...(newStatus && { status: newStatus }),
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
