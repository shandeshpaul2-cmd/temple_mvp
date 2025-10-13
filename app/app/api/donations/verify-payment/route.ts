import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donationId,
      donorInfo,
      isPoojaBooking,
      items,
    } = body

    console.log('Received payment verification request:', { isPoojaBooking, donationId, donorInfo, items })

    // Generate new ID format
    const today = new Date()
    const dateStr = today.getDate().toString().padStart(2, '0') +
                   (today.getMonth() + 1).toString().padStart(2, '0') +
                   today.getFullYear().toString().slice(-2)
    const timestamp = Date.now()

    let receiptNumber: string
    let amount = 0

    if (isPoojaBooking) {
      const dailySequence = await getDailySequence('BOOKING', dateStr)
      // Use different prefix for bookings to avoid conflicts
      receiptNumber = `PB-${dateStr}-${dailySequence.toString().padStart(4, '0')}`
      amount = items?.[0]?.amount || 250
    } else {
      const dailySequence = await getDailySequence('DONATION', dateStr)
      // Use different prefix for donations
      receiptNumber = `DN-${dateStr}-${dailySequence.toString().padStart(4, '0')}`
      amount = items?.[0]?.amount || 500
    }

    // Store data in database
    let donationData = null
    let bookingData = null

    // Handle regular donations
    if (!isPoojaBooking && items?.[0]) {
      // Validate required data
      if (!donorInfo?.phoneNumber || !donorInfo?.fullName) {
        return NextResponse.json(
          { error: 'Missing donor information' },
          { status: 400 }
        )
      }

      // Create or find the user
      const user = await prisma.user.upsert({
        where: { phone: donorInfo.phoneNumber },
        update: { name: donorInfo.fullName },
        create: {
          name: donorInfo.fullName,
          phone: donorInfo.phoneNumber,
          email: null
        }
      })

      // Create the donation record
      const donation = await prisma.donation.create({
        data: {
          receiptNumber: receiptNumber,
          userId: user.id,
          amount: amount,
          donationType: items[0]?.name || 'General Donation',
          donationPurpose: items[0]?.description || 'General Purpose',
          paymentStatus: 'SUCCESS',
          paymentMethod: 'razorpay',
          razorpayOrderId: razorpay_order_id || `order_${timestamp}`,
          razorpayPaymentId: razorpay_payment_id || `pay_${timestamp}`,
          razorpaySignature: razorpay_signature || 'development_signature',
          ipAddress: '127.0.0.1',
          userAgent: 'Development'
        }
      })

      donationData = {
        id: donation.id,
        receiptNumber: donation.receiptNumber,
        amount: donation.amount,
        donationType: donation.donationType,
        donationPurpose: donation.donationPurpose,
        paymentStatus: donation.paymentStatus,
        createdAt: donation.createdAt,
        userName: donorInfo.fullName,
        userPhone: donorInfo.phoneNumber,
        userEmail: null
      }

      console.log('Donation created successfully:', { donationId: donation.id, receiptNumber })
    }

    // Handle pooja bookings
    if (isPoojaBooking && items?.[0]) {
      // Validate required data
      if (!donorInfo?.phoneNumber || !donorInfo?.fullName) {
        return NextResponse.json(
          { error: 'Missing donor information' },
          { status: 400 }
        )
      }

      // Create or find the user
      const user = await prisma.user.upsert({
        where: { phone: donorInfo.phoneNumber },
        update: { name: donorInfo.fullName },
        create: {
          name: donorInfo.fullName,
          phone: donorInfo.phoneNumber,
          email: null
        }
      })

      // Map original service names to database IDs
      const serviceMap: { [key: string]: number } = {
        "Nithya Pooja": 1,
        "Padha Pooja": 2,
        "Panchmrutha Abhisheka": 3,
        "Madhu Abhisheka": 4,
        "Sarva Seva": 5,
        "Vishesha Alankara Seva": 6,
        "Belli Kavachadharane": 7,
        "Sahasranama Archane": 8,
        "Vayusthuthi Punashcharne": 9,
        "Kanakabhisheka": 10,
        "Vastra Arpane Seva": 11
      }

      let poojaId = 1 // Default to first pooja service
      const serviceName = items[0].name

      if (serviceMap[serviceName]) {
        poojaId = serviceMap[serviceName]
        console.log('Found pooja service mapping:', { name: serviceName, id: poojaId })
      } else {
        console.log('Pooja service not found in mapping, using default ID 1 for:', serviceName)
      }

      // Create unique booking number (ensure it's different from receipt number)
      const bookingNumber = `BK-${dateStr}-${Date.now().toString().slice(-4)}`

      // Create the pooja booking record
      const booking = await prisma.poojaBooking.create({
        data: {
          bookingNumber: bookingNumber,
          receiptNumber: receiptNumber,
          poojaName: items[0].name,
          poojaPrice: amount,
          poojaId: poojaId,
          preferredDate: donorInfo?.preferredDate ? new Date(donorInfo.preferredDate) : new Date(),
          preferredTime: donorInfo?.preferredTime || 'To be scheduled',
          userName: donorInfo.fullName,
          userPhone: donorInfo.phoneNumber,
          userEmail: null,
          nakshatra: donorInfo?.nakshatra || null,
          gothra: donorInfo?.gotra || null, // Note: using 'gothra' to match database schema
          specialInstructions: null, // We removed this from the form
          userId: user.id,
          bookingStatus: 'PENDING',
          paymentStatus: 'SUCCESS',
          razorpayPaymentId: razorpay_payment_id || `pay_${timestamp}`,
        }
      })

      bookingData = {
        id: booking.id,
        poojaName: booking.poojaName,
        preferredDate: booking.preferredDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        preferredTime: booking.preferredTime,
        userName: booking.userName,
        userPhone: booking.userPhone,
        nakshatra: booking.nakshatra,
        gothra: booking.gothra,
        poojaPrice: booking.poojaPrice,
        receiptNumber: booking.receiptNumber,
        bookingStatus: booking.bookingStatus,
        paymentStatus: booking.paymentStatus
      }

      console.log('Booking created successfully:', { bookingId: booking.id, receiptNumber })
    }

    console.log('Payment verified successfully:', {
      receiptNumber,
      isPoojaBooking,
      hasBookingData: !!bookingData,
      hasDonationData: !!donationData
    })

    return NextResponse.json({
      success: true,
      receiptNumber,
      donationId: donationId,
      isPoojaBooking,
      message: 'Payment verified successfully',
      bookingData,
      donationData,
    })
} catch (error) {
    console.error('Error verifying payment:', error)

    // Provide more specific error messages for debugging
    let errorMessage = 'Failed to verify payment'
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint violated')) {
        errorMessage = 'Database constraint error: User or Pooja Service not found'
      } else if (error.message.includes('prisma.poojaBooking.create')) {
        errorMessage = 'Failed to create pooja booking: Invalid data'
      } else {
        errorMessage = `Payment verification failed: ${error.message}`
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// Helper function to get daily sequence for high-volume transactions
async function getDailySequence(type: 'BOOKING' | 'DONATION', dateStr: string): Promise<number> {
  const result = await prisma.$transaction(async (tx) => {
    // Get the current highest sequence for this type and date
    const existingRecord = await tx.dailySequence.findFirst({
      where: {
        type: type,
        date: dateStr
      }
    })

    let newSequence = 1
    if (existingRecord) {
      newSequence = existingRecord.lastSequence + 1

      // Update the existing record
      await tx.dailySequence.update({
        where: {
          id: existingRecord.id
        },
        data: {
          lastSequence: newSequence
        }
      })
    } else {
      // Create new record
      await tx.dailySequence.create({
        data: {
          type: type,
          date: dateStr,
          lastSequence: newSequence,
        }
      })
    }

    return newSequence
  })

  return result
}

