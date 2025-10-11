import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.poojaService.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        poojaName: true,
        description: true,
        price: true,
        durationMinutes: true,
        displayOrder: true,
      },
    })

    // Convert Decimal to number for JSON serialization
    const servicesWithNumberPrice = services.map(service => ({
      ...service,
      price: parseFloat(service.price.toString()),
    }))

    return NextResponse.json(servicesWithNumberPrice)
  } catch (error) {
    console.error('Error fetching pooja services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}
