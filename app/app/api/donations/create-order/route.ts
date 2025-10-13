import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, donorInfo, donationType, donationPurpose, isPoojaBooking: explicitIsPoojaBooking } = body

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Validate donor info
    if (!donorInfo || !donorInfo.fullName || !donorInfo.phoneNumber) {
      return NextResponse.json(
        { error: 'Invalid donor information - fullName and phoneNumber are required' },
        { status: 400 }
      )
    }

    console.log('Received donation request:', { amount, donationType, donorInfo: { fullName: donorInfo.fullName, phoneNumber: donorInfo.phoneNumber } })

    // Simple mock response - no database operations
    const orderId = `mock_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const mockId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Check if this is a pooja booking - use explicit flag if provided, otherwise fallback to keyword detection
    const isPoojaBooking = explicitIsPoojaBooking ||
                           donationType?.toLowerCase().includes('pooja') ||
                           donationPurpose?.toLowerCase().includes('pooja') ||
                           donationType?.toLowerCase().includes('homam') ||
                           donationType?.toLowerCase().includes('archana')

    return NextResponse.json({
      orderId: orderId,
      amount: Math.round(amount * 100),
      currency: 'INR',
      donationId: mockId,
      isMock: true,
      isPoojaBooking,
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
