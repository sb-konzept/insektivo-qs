import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; stepId: string }> }
) {
  try {
    const { id: incidentId, stepId } = await params
    const data = await request.json()

    // Verify step belongs to incident
    const step = await prisma.incidentStep.findFirst({
      where: {
        id: stepId,
        incidentId: incidentId,
      },
    })

    if (!step) {
      return NextResponse.json({ error: 'Schritt nicht gefunden' }, { status: 404 })
    }

    // Update step
    const updated = await prisma.incidentStep.update({
      where: { id: stepId },
      data: {
        result: data.result !== undefined ? data.result : step.result,
        completedAt: data.completedAt !== undefined 
          ? (data.completedAt ? new Date(data.completedAt) : null)
          : step.completedAt,
      },
    })

    // Update incident status based on steps
    const allSteps = await prisma.incidentStep.findMany({
      where: { incidentId },
    })

    const completedCount = allSteps.filter(s => s.completedAt).length
    let newStatus = 'offen'
    
    if (completedCount === allSteps.length) {
      newStatus = 'geschlossen'
    } else if (completedCount > 0) {
      newStatus = 'in_bearbeitung'
    }

    await prisma.incident.update({
      where: { id: incidentId },
      data: { 
        status: newStatus,
        resolvedAt: newStatus === 'geschlossen' ? new Date() : null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating step:', error)
    return NextResponse.json({ error: 'Interner Serverfehler' }, { status: 500 })
  }
}
