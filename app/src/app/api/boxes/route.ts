import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const boxes = await prisma.box.findMany({
    include: {
      bookings: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(boxes)
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: 'Kistencode erforderlich' }, { status: 400 })
    }

    // Check if code already exists
    const existing = await prisma.box.findUnique({ where: { code } })
    if (existing) {
      return NextResponse.json({ error: 'Kistencode existiert bereits' }, { status: 400 })
    }

    const box = await prisma.box.create({
      data: {
        code,
        status: 'leer_gereinigt',
        currentStation: 'erzeuger',
      },
    })

    return NextResponse.json(box, { status: 201 })
  } catch (error) {
    console.error('Error creating box:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
