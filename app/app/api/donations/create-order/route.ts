import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { prisma } from '@/lib/prisma'

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, donorInfo } = body

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        donor_name: donorInfo.fullName,
        donor_phone: donorInfo.phoneNumber,
      },
    })

    // Generate receipt number (will be finalized after successful payment)
    const fiscalYear = getFiscalYear()
    const tempReceiptNumber = `TEMP/${fiscalYear}/${Date.now()}`

    // Create pending donation record
    const donation = await prisma.donation.create({
      data: {
        receiptNumber: tempReceiptNumber,
        amount: parseFloat(amount),
        donationType: 'General',
        donationPurpose: donorInfo.donationPurpose || null,
        paymentStatus: 'PENDING',
        paymentMethod: 'razorpay',
        razorpayOrderId: order.id,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      donationId: donation.id,
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
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
