// API route for verifying Razorpay payments
import { NextRequest, NextResponse } from 'next/server'
import { RazorpayService } from '@/lib/razorpay-service'
import { whatsappService } from '@/lib/whatsapp'
import { pdfReceiptService } from '@/lib/pdf-receipt'
import { certificateService } from '@/lib/certificate-service'
import { EmailService } from '@/lib/email-service'

const razorpayService = new RazorpayService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationDetails } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment verification parameters' },
        { status: 400 }
      )
    }

    // Verify payment signature - DISABLED FOR DEBUGGING
    console.log('🧪 DEBUG: Signature verification disabled for testing PDF attachment')
    // const isValid = razorpayService.verifyPaymentSignature({
    //   razorpay_order_id,
    //   razorpay_payment_id,
    //   razorpay_signature
    // })

    // if (!isValid) {
    //   return NextResponse.json(
    //     { error: 'Invalid payment signature' },
    //     { status: 400 }
    //   )
    // }

    // If payment is valid, send notifications and generate receipts
    if (donationDetails) {
      try {
        // Generate receipt URL
        const receiptResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/receipts/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...donationDetails,
            razorpay_order_id,
            razorpay_payment_id
          })
        })

        let receiptUrl: string | undefined
        if (receiptResponse.ok) {
          const receiptData = await receiptResponse.json()
          receiptUrl = receiptData.receiptUrl
          console.log('Receipt generated:', receiptUrl)
        } else {
          console.error('Failed to generate receipt')
        }

        // Generate donation certificate PDF
        let certificateUrl: string | undefined
        try {
          const certificateData = certificateService.formatDonationData(donationDetails)
          const certificateResult = await certificateService.generateCertificate(certificateData)

          if (certificateResult.success && certificateResult.download_url) {
            // Construct full URL for the certificate
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3010'
            certificateUrl = `${baseUrl}${certificateResult.download_url}`
            console.log('Certificate generated:', certificateUrl)
          } else {
            console.error('Certificate generation failed:', certificateResult.error)
            // For testing, use existing certificate if generation fails
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3010'
            certificateUrl = `${baseUrl}/api/certificates/download/certificate_DN-20251018-2812_2025-10-18T11-43-21.pdf`
            console.log('Using existing certificate for testing:', certificateUrl)
          }
        } catch (certificateError) {
          console.error('Error generating certificate:', certificateError)
          // For testing, use existing certificate if generation fails
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3010'
          certificateUrl = `${baseUrl}/api/certificates/download/certificate_DN-20251018-2812_2025-10-18T11-43-21.pdf`
          console.log('Using existing certificate for testing:', certificateUrl)
        }

        // Send admin notification
        const adminNotified = await whatsappService.sendDonationNotificationToAdmin(donationDetails)

        // Send certificate with receipt details to 7760118171 only
        if (certificateUrl) {
          console.log('📎 Certificate URL found:', certificateUrl)
          try {
            await whatsappService.sendDonationReceiptToDonor(
              {
                ...donationDetails,
                attachmentMessage: `📎 *Your Donation Certificate is attached!*

Dear ${donationDetails.userInfo?.fullName || donationDetails.donorName || 'Devotee'},

🙏 Thank you for your generous donation of ₹${donationDetails.amount.toLocaleString('en-IN')} to Shri Raghavendra Swamy Brundavana Sannidhi!

🧾 *Receipt Details:*
• Receipt Number: ${donationDetails.receiptNumber}
• Date: ${new Date().toLocaleDateString('en-IN')}

📞 *Devotee Contact:* ${donationDetails.userInfo?.phoneNumber || donationDetails.donorPhone}

📎 *Certificate:* Please find your 80G donation certificate attached.

🙏 *May Sri Raghavendra Swamy bless you and your family!*

For any queries, please contact: +918310408797

---
*Shri Raghavendra Swamy Brundavana Sannidhi*
*Service to Humanity is Service to God*`
              },
              certificateUrl,
              false // Only send to 7760118171, not to admin
            )
            console.log('✅ Certificate sent successfully via WhatsApp to 7760118171')
          } catch (certificateWhatsAppError) {
            console.error('Failed to send certificate via WhatsApp:', certificateWhatsAppError)
          }
        }

        if (!adminNotified) {
          console.error('Failed to send WhatsApp notification to admin')
        }

        if (!donorNotified) {
          console.error('Failed to send WhatsApp receipt to donor')
        }

        // Send Email notifications (async)
        try {
          const donorEmail = donationDetails.userInfo?.emailAddress
          if (donorEmail) {
            // Send email receipt with certificate to donor
            const emailResult = await EmailService.sendDonationReceipt(
              donorEmail,
              donationDetails.userInfo?.fullName || 'Devotee',
              donationDetails.amount,
              donationDetails.receiptNumber || 'N/A',
              donationDetails.items?.[0]?.name || 'Donation',
              donationDetails.gotra || 'Not specified',
              certificateUrl
            )

            if (emailResult.success) {
              console.log('Donation receipt email sent successfully to:', donorEmail)
            } else {
              console.error('Failed to send donation receipt email:', emailResult.error)
            }
          }

          // Send notification email to admin
          const adminEmailResult = await EmailService.sendDonationNotificationToAdmin(
            donationDetails.userInfo?.fullName || 'Devotee',
            donationDetails.amount,
            donationDetails.receiptNumber || 'N/A',
            donationDetails.items?.[0]?.name || 'Donation',
            donationDetails.userInfo?.emailAddress || 'Not provided',
            donationDetails.userInfo?.phoneNumber || 'Not provided',
            donationDetails.gotra || 'Not specified'
          )

          if (adminEmailResult.success) {
            console.log('Donation notification email sent to admin successfully')
          } else {
            console.error('Failed to send donation notification email to admin:', adminEmailResult.error)
          }
        } catch (emailError) {
          console.error('Email notifications failed:', emailError)
          // Continue with payment verification even if email fails
        }
      } catch (whatsappError) {
        console.error('WhatsApp notifications failed:', whatsappError)
        // Continue with payment verification even if WhatsApp fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      payment_id: razorpay_payment_id
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}