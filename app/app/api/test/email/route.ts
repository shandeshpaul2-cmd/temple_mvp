import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/lib/email-service'
import { certificateService } from '@/lib/certificate-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testType, email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    let result

    switch (testType) {
      case 'donation':
        // Generate actual certificate first
        let certificateUrl = null

        try {
          const certificateData = {
            donor_name: 'Test Devotee',
            amount: 1000,
            donation_id: 'TEST-1234',
            donation_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            payment_mode: 'Online',
            org_name: 'Shri Raghavendra Swamy Brundavana Sannidhi',
            org_subtitle: 'Service to Humanity is Service to God',
            show_80g_note: true
          }

          // Create certificate service with correct base URL for server-side
          const CertificateServiceClass = (await import('@/lib/certificate-service')).default
          const certificateServiceInstance = new CertificateServiceClass({
            baseUrl: `http://localhost:8010/api/certificates`
          })

          const certificateResult = await certificateServiceInstance.generateCertificate(certificateData)

          if (certificateResult.success && certificateResult.download_url) {
            // Construct full URL for the certificate
            certificateUrl = `http://localhost:8010${certificateResult.download_url}`
            console.log('📄 Actual certificate generated:', certificateUrl)
          } else {
            console.warn('⚠️ Certificate generation failed:', certificateResult.error)
          }
        } catch (certificateError) {
          console.error('❌ Error generating certificate:', certificateError)
        }

        result = await EmailService.sendDonationReceipt(
          email,
          'Test Devotee',
          1000,
          'TEST-1234',
          'General Donation',
          'Test Gotra',
          certificateUrl // Use actual certificate URL
        )
        break

      case 'pooja':
        result = await EmailService.sendPoojaBookingConfirmation(
          email,
          'Test Devotee',
          'Test Pooja',
          'PB-1234',
          new Date().toISOString(),
          500
        )
        break

      case 'astrology':
        result = await EmailService.sendAstrologyConsultationConfirmation(
          email,
          'Test Client',
          'General Astrology Consultation',
          'AC-1234',
          new Date().toISOString(),
          1500
        )
        break

      default:
        return NextResponse.json(
          { error: 'Invalid test type. Use: donation, pooja, or astrology' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully for ${testType}`,
      result
    })

  } catch (error) {
    console.error('Error testing email:', error)
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email test endpoint. Send a POST request with { testType: "donation|pooja|astrology", email: "your@email.com" }'
  })
}