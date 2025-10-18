// API route for creating donation orders
import { NextRequest, NextResponse } from 'next/server'
import { RazorpayService } from '@/lib/razorpay-service'

const razorpayService = new RazorpayService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'INR', receipt, notes } = body

    if (!amount || !receipt) {
      return NextResponse.json(
        { error: 'Amount and receipt are required' },
        { status: 400 }
      )
    }

    const order = await razorpayService.createOrder({
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
      notes
    })

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Donation create-order API endpoint' })
}