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
    } = body

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(sign.toString())
      .digest('hex')

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Generate proper receipt number
    const fiscalYear = getFiscalYear()
    const receiptNumber = await generateReceiptNumber(fiscalYear)

    // Check if user exists or create new user
    let userId = null
    if (donorInfo.phoneNumber) {
      const user = await prisma.user.upsert({
        where: { phoneNumber: donorInfo.phoneNumber },
        update: {
          fullName: donorInfo.fullName,
          email: donorInfo.email || null,
          city: donorInfo.city || null,
          state: donorInfo.state || null,
          pincode: donorInfo.pincode || null,
          lastActivityDate: new Date(),
        },
        create: {
          phoneNumber: donorInfo.phoneNumber,
          fullName: donorInfo.fullName,
          email: donorInfo.email || null,
          city: donorInfo.city || null,
          state: donorInfo.state || null,
          pincode: donorInfo.pincode || null,
          firstActivityDate: new Date(),
          lastActivityDate: new Date(),
        },
      })
      userId = user.id
    }

    // Update donation record
    const donation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        receiptNumber,
        userId,
        paymentStatus: 'SUCCESS',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    })

    // Update user statistics if user exists
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalDonations: { increment: donation.amount },
          donationCount: { increment: 1 },
        },
      })
    }

    return NextResponse.json({
      success: true,
      receiptNumber,
      donationId: donation.id,
      message: 'Payment verified successfully',
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}

// Helper function to get fiscal year
function getFiscalYear(): string {
  const now = new Date()
  const month = now.getMonth() + 1 // 1-12
  const year = now.getFullYear()

  if (month >= 4) {
    // April onwards - current year to next year
    return `${year}-${(year + 1) % 100}`
  } else {
    // Jan-Mar - previous year to current year
    return `${year - 1}-${year % 100}`
  }
}

// Helper function to generate receipt number
async function generateReceiptNumber(fiscalYear: string): Promise<string> {
  // Use transaction to ensure atomic increment
  const result = await prisma.$transaction(async (tx) => {
    // Get or create fiscal year sequence
    const sequence = await tx.receiptSequence.upsert({
      where: { fiscalYear },
      update: {
        lastSequence: { increment: 1 },
      },
      create: {
        fiscalYear,
        lastSequence: 1,
      },
    })

    // Format: TMPL/FY/2024-25/00001
    const paddedSequence = sequence.lastSequence.toString().padStart(5, '0')
    return `TMPL/FY/${fiscalYear}/${paddedSequence}`
  })

  return result
}
