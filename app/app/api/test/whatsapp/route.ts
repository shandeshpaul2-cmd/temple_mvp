import { NextRequest, NextResponse } from 'next/server'
import { whatsappTestService } from '@/lib/whatsapp-test'

/**
 * Test endpoint for WhatsApp messages
 * Use this to preview messages before setting up the actual WhatsApp API
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testType, testData } = body

    console.log('🧪 WhatsApp Test Request:', { testType, testData })

    let result = false

    switch (testType) {
      case 'donation':
        result = await whatsappTestService.testDonationReceipt(testData)
        break

      case 'pooja':
        result = await whatsappTestService.testPoojaBookingConfirmation(testData)
        break

      case 'admin_notification':
        result = await whatsappTestService.testAdminNotification(testData, testData.type || 'donation')
        break

      case 'all_tests':
        await whatsappTestService.runQuickTests()
        result = true
        break

      default:
        return NextResponse.json(
          { error: 'Invalid test type. Use: donation, pooja, admin_notification, or all_tests' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: `Test completed for ${testType}`,
      result,
      testMode: process.env.NODE_ENV === 'development'
    })

  } catch (error) {
    console.error('Error in WhatsApp test:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Quick test with GET request
export async function GET() {
  try {
    await whatsappTestService.runQuickTests()

    return NextResponse.json({
      success: true,
      message: 'Quick WhatsApp tests completed. Check console for message previews.',
      testMode: true,
      note: 'This is test mode - no actual WhatsApp messages were sent.'
    })

  } catch (error) {
    console.error('Error in quick WhatsApp test:', error)
    return NextResponse.json(
      { error: 'Quick test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}