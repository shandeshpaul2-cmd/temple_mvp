import { NextRequest, NextResponse } from 'next/server'
import { EmailService } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { donorEmail } = body

    if (!donorEmail) {
      return NextResponse.json(
        { error: 'Donor email is required' },
        { status: 400 }
      )
    }

    // Simulate the real donation flow data from the logs
    const donationDetails = {
      donorName: 'Shandesh Paul',
      amount: 5100,
      receiptNumber: 'DN-20251018-4922',
      poojaName: 'General Donation',
      email: donorEmail,
      phone: '+917760118171',
      gotra: 'Not specified'
    }

    // Generate actual certificate
    let certificateUrl = null
    try {
      // Create certificate service instance with correct base URL
      const CertificateServiceClass = (await import('@/lib/certificate-service')).default
      const certificateServiceInstance = new CertificateServiceClass({
        baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8010'}/api/certificates`
      })

      const certificateData = {
        donor_name: donationDetails.donorName,
        amount: donationDetails.amount,
        donation_id: donationDetails.receiptNumber,
        donation_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        payment_mode: 'Online',
        org_name: 'Shri Raghavendra Swamy Brundavana Sannidhi',
        org_subtitle: 'Service to Humanity is Service to God',
        show_80g_note: true
      }

      const certificateResult = await certificateServiceInstance.generateCertificate(certificateData)

      if (certificateResult.success && certificateResult.download_url) {
        certificateUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8010'}${certificateResult.download_url}`
        console.log('📄 Actual certificate generated for test flow:', certificateUrl)
      } else {
        console.warn('⚠️ Certificate generation failed:', certificateResult.error)
      }
    } catch (certificateError) {
      console.error('❌ Error generating certificate:', certificateError)
    }

    // Send email receipt with actual certificate
    const emailResult = await EmailService.sendDonationReceipt(
      donorEmail,
      donationDetails.donorName,
      donationDetails.amount,
      donationDetails.receiptNumber,
      donationDetails.poojaName,
      donationDetails.gotra,
      certificateUrl
    )

    if (emailResult.success) {
      console.log('✅ Real donation flow email sent successfully to:', donorEmail)
    } else {
      console.error('❌ Failed to send donation flow email:', emailResult.error)
    }

    // Send notification to admin
    const adminEmailResult = await EmailService.sendDonationNotificationToAdmin(
      donationDetails.donorName,
      donationDetails.amount,
      donationDetails.receiptNumber,
      donationDetails.poojaName,
      donationDetails.email,
      donationDetails.phone,
      donationDetails.gotra
    )

    if (adminEmailResult.success) {
      console.log('✅ Admin notification sent successfully')
    } else {
      console.error('❌ Failed to send admin notification:', adminEmailResult.error)
    }

    return NextResponse.json({
      success: true,
      message: `Complete donation flow test completed`,
      donorEmail,
      receiptNumber: donationDetails.receiptNumber,
      certificateGenerated: !!certificateUrl,
      emailSent: emailResult.success,
      adminNotified: adminEmailResult.success,
      donationDetails
    })

  } catch (error) {
    console.error('Error in donation flow test:', error)
    return NextResponse.json(
      { error: 'Failed to complete donation flow test' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Donation Flow Test Endpoint. Send a POST request with { donorEmail: "your@email.com" } to test the complete donation email flow with real certificate generation.'
  })
}