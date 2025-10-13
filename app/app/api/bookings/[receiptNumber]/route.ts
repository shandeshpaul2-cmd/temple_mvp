import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ receiptNumber: string }> }
) {
  try {
    const { receiptNumber } = await params

    console.log('Received booking request for receipt:', receiptNumber)

    if (!receiptNumber) {
      return NextResponse.json(
        { error: 'Receipt number is required' },
        { status: 400 }
      )
    }

    // Find booking in database
    const booking = await prisma.poojaBooking.findUnique({
      where: { receiptNumber },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Return booking details from database
    return NextResponse.json({
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      receiptNumber: booking.receiptNumber,
      poojaName: booking.poojaName,
      poojaPrice: booking.poojaPrice,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      userName: booking.userName,
      userPhone: booking.userPhone,
      userEmail: booking.userEmail,
      specialInstructions: booking.specialInstructions,
      nakshatra: booking.nakshatra,
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
    })
  } catch (error) {
    console.error('Error fetching booking details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking details' },
      { status: 500 }
    )
  }
}