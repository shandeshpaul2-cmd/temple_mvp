import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ receiptNumber: string }> }
) {
  try {
    const { receiptNumber } = await params

    console.log('Received donation request for receipt:', receiptNumber)

    if (!receiptNumber) {
      return NextResponse.json(
        { error: 'Receipt number is required' },
        { status: 400 }
      )
    }

    // Find donation in database
    const donation = await prisma.donation.findUnique({
      where: { receiptNumber },
      include: {
        user: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        }
      }
    })

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    // Return donation details from database
    return NextResponse.json({
      id: donation.id,
      receiptNumber: donation.receiptNumber,
      amount: donation.amount,
      donationType: donation.donationType,
      donationPurpose: donation.donationPurpose,
      paymentStatus: donation.paymentStatus,
      paymentMethod: donation.paymentMethod,
      createdAt: donation.createdAt,
      userName: donation.user?.name || 'Anonymous',
      userPhone: donation.user?.phone || 'N/A',
      userEmail: donation.user?.email || null,
    })
  } catch (error) {
    console.error('Error fetching donation details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch donation details' },
      { status: 500 }
    )
  }
}