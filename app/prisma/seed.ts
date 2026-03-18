import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.incidentStep.deleteMany()
  await prisma.incident.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.box.deleteMany()
  await prisma.carrier.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.supplier.deleteMany()

  // Create Suppliers (Erzeuger)
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Aue Manfred',
      contactPerson: 'Manfred Aue',
      street: 'Spitzöd 1',
      zipCode: '94081',
      city: 'Fürstenzell',
      phone: '08502/782',
      mobile: '0170/3349867',
      email: 'info@aue-spitzoed.de',
      productionType: 'Kleinsterzeuger',
      certificationSystem: 'QS',
      qsId: '4953113280718',
      locationNr: 'KE00001086 (73)',
    },
  })

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Insektenhof Bayern GmbH',
      contactPerson: 'Thomas Müller',
      street: 'Industriestr. 15',
      zipCode: '84032',
      city: 'Landshut',
      phone: '0871/12345',
      email: 'info@insektenhof-bayern.de',
      productionType: 'Erzeuger',
      certificationSystem: 'QS',
      qsId: '4953113280725',
      locationNr: 'KE00001087',
    },
  })

  console.log('✓ Suppliers created')

  // Create Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Fam. Manfred Aue',
      contactPerson: 'Manfred Aue',
      street: 'Spitzöd 1',
      zipCode: '94081',
      city: 'Spitzöd',
      phone: '08502/782',
      email: 'info@aue-spitzoed.de',
      productionType: 'Landwirtschaft',
      certificationSystem: 'QS',
      qsId: '4031735448580',
      locationNr: '092751220010',
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Biohof Sonnenschein',
      contactPerson: 'Maria Huber',
      street: 'Sonnenweg 8',
      zipCode: '94078',
      city: 'Freyung',
      phone: '08551/9876',
      email: 'maria@biohof-sonnenschein.de',
      productionType: 'Landwirtschaft',
      certificationSystem: 'QS',
      qsId: '4031735448599',
    },
  })

  console.log('✓ Customers created')

  // Create Carriers (Speditionen)
  const carrier1 = await prisma.carrier.create({
    data: {
      name: 'Spedition Hoffmann GmbH',
      contactPerson: 'Klaus Hoffmann',
      street: 'Logistikstr. 5',
      zipCode: '94032',
      city: 'Passau',
      phone: '0851/54321',
      email: 'transport@hoffmann-spedition.de',
      certificationSystem: 'GMP+',
      vehicleNr: 'PA-HO 123',
    },
  })

  console.log('✓ Carriers created')

  // Create Boxes with Bookings
  const boxCodes = ['K-2024-001', 'K-2024-002', 'K-2024-003', 'K-2024-004', 'K-2024-005', 
                    'K-2024-006', 'K-2024-007', 'K-2024-008', 'K-2024-009', 'K-2024-010']
  
  const statuses = ['leer_gereinigt', 'gefuellt', 'leer_verschmutzt', 'gefuellt', 'leer_gereinigt',
                    'gefuellt', 'leer_verschmutzt', 'leer_gereinigt', 'gefuellt', 'leer_verschmutzt']
  
  const currentStations = ['erzeuger', 'fracht_kunde', 'kunde', 'kunde', 'waescher',
                           'erzeuger', 'fracht_waescher', 'fracht_erzeuger', 'erzeuger', 'kunde']

  for (let i = 0; i < boxCodes.length; i++) {
    const box = await prisma.box.create({
      data: {
        code: boxCodes[i],
        status: statuses[i],
        currentStation: currentStations[i],
      },
    })

    // Add some booking history
    const baseDate = new Date()
    baseDate.setDate(baseDate.getDate() - Math.floor(Math.random() * 30))

    // Zugang beim Erzeuger
    await prisma.booking.create({
      data: {
        boxId: box.id,
        station: 'erzeuger',
        bookingType: 'zugang',
        supplierId: Math.random() > 0.5 ? supplier1.id : supplier2.id,
        deliveryNoteNr: `LS-${2024}-${1000 + i}`,
        createdAt: new Date(baseDate.getTime()),
      },
    })

    // Befüllung beim Erzeuger
    if (statuses[i] !== 'leer_gereinigt' || currentStations[i] !== 'erzeuger') {
      await prisma.booking.create({
        data: {
          boxId: box.id,
          station: 'erzeuger',
          bookingType: 'befuellung',
          weight: 15 + Math.random() * 10,
          batchNr: `CH-${2024}${String(i + 1).padStart(4, '0')}`,
          createdAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 2),
        },
      })
    }

    // Abgang vom Erzeuger
    if (!['erzeuger'].includes(currentStations[i]) || statuses[i] === 'gefuellt') {
      await prisma.booking.create({
        data: {
          boxId: box.id,
          station: 'erzeuger',
          bookingType: 'abgang',
          carrierId: carrier1.id,
          deliveryNoteNr: `LS-${2024}-${1000 + i}`,
          createdAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 24),
        },
      })
    }

    // Weitere Buchungen je nach aktuellem Status
    if (['kunde', 'fracht_waescher', 'waescher', 'fracht_erzeuger'].includes(currentStations[i])) {
      await prisma.booking.create({
        data: {
          boxId: box.id,
          station: 'kunde',
          bookingType: 'zugang',
          customerId: Math.random() > 0.5 ? customer1.id : customer2.id,
          createdAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 48),
        },
      })
    }

    if (['waescher', 'fracht_erzeuger'].includes(currentStations[i])) {
      await prisma.booking.create({
        data: {
          boxId: box.id,
          station: 'waescher',
          bookingType: 'qualitaetscheck',
          qualityOk: Math.random() > 0.1,
          qualityNotes: Math.random() > 0.8 ? 'Leichte Verschmutzung festgestellt' : null,
          createdAt: new Date(baseDate.getTime() + 1000 * 60 * 60 * 72),
        },
      })
    }
  }

  console.log('✓ Boxes and Bookings created')

  // Create a sample Incident
  const incident = await prisma.incident.create({
    data: {
      title: 'Futtermittel-Rückruf Charge CH-20240003',
      description: 'Lieferant meldet mögliche Kontamination bei Charge CH-20240003',
      incidentType: 'lieferanten_rueckruf',
      status: 'offen',
      affectedBatchNr: 'CH-20240003',
    },
  })

  // Add incident steps
  const steps = [
    { stepNr: 1, title: 'Eingang des Rückrufes', description: 'Dokumentation des Rückrufes' },
    { stepNr: 2, title: 'Wurde die betroffene Ware eingesetzt?', description: 'Prüfung ob Charge bereits verwendet' },
    { stepNr: 3, title: 'Meldung an QS', description: 'QS unverzüglich informieren' },
    { stepNr: 4, title: 'Ermittlung Produktionsdatum/Chargennummer', description: 'Alle betroffenen Chargen ermitteln' },
    { stepNr: 5, title: 'Betroffene Ware bereits verkauft?', description: 'Prüfung Verkaufsstatus' },
    { stepNr: 6, title: 'Ermittlung betroffener Kunden', description: 'Kontaktdaten der Kunden ermitteln' },
    { stepNr: 7, title: 'Information der Kunden', description: 'Kunden unverzüglich informieren' },
    { stepNr: 8, title: 'Weiterleitung an QS', description: 'Aufbereitete Daten an QS übermitteln' },
  ]

  for (const step of steps) {
    await prisma.incidentStep.create({
      data: {
        incidentId: incident.id,
        ...step,
      },
    })
  }

  console.log('✓ Incident created')

  console.log('✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
