import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { whatsappService } from '@/lib/whatsapp'
import { EmailService } from '@/lib/email-service'
import { certificateService } from '@/lib/certificate-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      paymentType, // 'donation' | 'pooja' | 'parihara_pooja'
      amount,
      userInfo,
      items,
      serviceDetails,
      receiptNumber: providedReceiptNumber,
      paymentId: providedPaymentId,
      status = 'completed'
    } = body

    console.log('Payment request received:', { paymentType, amount, userInfo, items })

    // Generate new ID format
    const today = new Date()
    const dateStr = today.getDate().toString().padStart(2, '0') +
                   (today.getMonth() + 1).toString().padStart(2, '0') +
                   today.getFullYear().toString().slice(-2)
    const timestamp = Date.now()

    let receiptNumber: string
    let prefix = ''

    switch (paymentType) {
      case 'parihara_pooja':
        prefix = 'PARI'
        break
      case 'pooja':
        prefix = 'PB'
        break
      case 'astrology_consultation':
        prefix = 'AC'
        break
      case 'donation':
      default:
        prefix = 'DN'
        break
    }

    // Use provided receipt number or generate new one
    if (providedReceiptNumber) {
      receiptNumber = providedReceiptNumber
    } else {
      const dailySequence = await getDailySequence(paymentType.toUpperCase(), dateStr)
      receiptNumber = `${prefix}-${dateStr}-${dailySequence.toString().padStart(4, '0')}`
    }

    // Create or find the user
    let user;
    try {
      user = await prisma.user.upsert({
        where: { phone: userInfo.phoneNumber },
        update: {
          name: userInfo.fullName,
          // Only update email if it's provided and doesn't conflict
          ...(userInfo.emailAddress && { email: userInfo.emailAddress })
        },
        create: {
          name: userInfo.fullName,
          phone: userInfo.phoneNumber,
          email: userInfo.emailAddress || null
        }
      })
    } catch (error: any) {
      // Handle unique constraint violation on email
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        console.log('Email already exists, using phone number only for user lookup')
        // Try to find user by phone number only
        user = await prisma.user.findUnique({
          where: { phone: userInfo.phoneNumber }
        })

        // If still not found, create without email
        if (!user) {
          user = await prisma.user.create({
            data: {
              name: userInfo.fullName,
              phone: userInfo.phoneNumber,
              email: null // Don't set email to avoid conflict
            }
          })
        }
      } else {
        throw error; // Re-throw other errors
      }
    }

    let responseData = {}

    switch (paymentType) {
      case 'parihara_pooja':
        // Handle parihara pooja bookings
        const bookingNumber = `BK-${dateStr}-${Date.now().toString().slice(-4)}`

        const pariharaBooking = await prisma.poojaBooking.create({
          data: {
            bookingNumber: bookingNumber,
            receiptNumber: receiptNumber,
            poojaName: serviceDetails?.poojaName || items[0]?.name || 'Parihara Pooja',
            poojaPrice: amount,
            poojaId: 99, // Special ID for parihara poojas
            preferredDate: new Date(), // Will be scheduled later
            preferredTime: 'To be scheduled based on horoscope',
            userName: userInfo.fullName,
            userPhone: userInfo.phoneNumber,
            userEmail: userInfo.emailAddress || null,
            nakshatra: null,
            gothra: null,
            specialInstructions: 'Parihara pooja - requires horoscope analysis',
            userId: user.id,
            bookingStatus: 'PENDING',
            paymentStatus: 'SUCCESS',
            razorpayPaymentId: providedPaymentId || `pay_${timestamp}`,
          }
        })

        responseData = {
          type: 'parihara_pooja',
          bookingId: pariharaBooking.id,
          bookingNumber: pariharaBooking.bookingNumber,
          receiptNumber: pariharaBooking.receiptNumber,
          poojaName: pariharaBooking.poojaName,
          amount: pariharaBooking.poojaPrice,
          userName: pariharaBooking.userName,
          userPhone: pariharaBooking.userPhone,
          createdAt: pariharaBooking.createdAt
        }

        // Send WhatsApp notifications for parihara pooja
        try {
          await whatsappService.sendPariharaPoojaNotificationToAdmin({
            receiptNumber: pariharaBooking.receiptNumber,
            devoteeName: pariharaBooking.userName,
            phone: pariharaBooking.userPhone,
            poojaDate: pariharaBooking.poojaDate,
            sankalpaName: pariharaBooking.sankalpaName,
            amount: pariharaBooking.poojaPrice
          })
          console.log('Parihara pooja WhatsApp notifications sent')
        } catch (error) {
          console.error('Failed to send parihara pooja WhatsApp notifications:', error)
        }

        // Send Email notifications for parihara pooja
        try {
          const devoteeEmail = userInfo.emailAddress
          if (devoteeEmail) {
            // Send email confirmation to devotee
            const emailResult = await EmailService.sendPoojaBookingConfirmation(
              devoteeEmail,
              pariharaBooking.userName,
              pariharaBooking.poojaName,
              pariharaBooking.receiptNumber,
              pariharaBooking.preferredDate?.toISOString() || new Date().toISOString(),
              pariharaBooking.poojaPrice
            )

            if (emailResult.success) {
              console.log('Parihara pooja confirmation email sent successfully to:', devoteeEmail)
            } else {
              console.error('Failed to send parihara pooja confirmation email:', emailResult.error)
            }
          }

          // Send notification email to admin
          const adminEmailResult = await EmailService.sendPoojaBookingNotificationToAdmin(
            pariharaBooking.userName,
            pariharaBooking.poojaName,
            pariharaBooking.receiptNumber,
            pariharaBooking.preferredDate?.toISOString() || new Date().toISOString(),
            userInfo.emailAddress || 'Not provided',
            pariharaBooking.userPhone
          )

          if (adminEmailResult.success) {
            console.log('Parihara pooja notification email sent to admin successfully')
          } else {
            console.error('Failed to send parihara pooja notification email to admin:', adminEmailResult.error)
          }
        } catch (emailError) {
          console.error('Email notifications failed for parihara pooja:', emailError)
        }
        break

      case 'pooja':
        // Handle regular pooja bookings
        const poojaServiceMap: { [key: string]: number } = {
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

        let poojaId = 1
        const serviceName = items[0]?.name
        if (poojaServiceMap[serviceName]) {
          poojaId = poojaServiceMap[serviceName]
        }

        const poojaBooking = await prisma.poojaBooking.create({
          data: {
            bookingNumber: `BK-${dateStr}-${Date.now().toString().slice(-4)}`,
            receiptNumber: receiptNumber,
            poojaName: serviceName,
            poojaPrice: amount,
            poojaId: poojaId,
            preferredDate: serviceDetails?.preferredDate ? new Date(serviceDetails.preferredDate) : new Date(),
            preferredTime: serviceDetails?.preferredTime || 'To be scheduled',
            userName: userInfo.fullName,
            userPhone: userInfo.phoneNumber,
            userEmail: userInfo.emailAddress || null,
            nakshatra: serviceDetails?.nakshatra || null,
            gothra: serviceDetails?.gotra || null,
            specialInstructions: null,
            userId: user.id,
            bookingStatus: 'PENDING',
            paymentStatus: 'SUCCESS',
            razorpayPaymentId: providedPaymentId || `pay_${timestamp}`,
          }
        })

        responseData = {
          type: 'pooja',
          bookingId: poojaBooking.id,
          receiptNumber: poojaBooking.receiptNumber,
          poojaName: poojaBooking.poojaName,
          amount: poojaBooking.poojaPrice,
          userName: poojaBooking.userName,
          userPhone: poojaBooking.userPhone,
          createdAt: poojaBooking.createdAt
        }

        // Send WhatsApp notifications for pooja booking
        try {
          await whatsappService.sendPoojaBookingConfirmationToDevotee({
            receiptNumber: poojaBooking.receiptNumber,
            devoteeName: poojaBooking.userName,
            phone: poojaBooking.userPhone,
            poojaName: poojaBooking.poojaName,
            poojaDate: poojaBooking.poojaDate,
            amount: poojaBooking.poojaPrice
          })
          console.log('Pooja booking WhatsApp notifications sent')
        } catch (error) {
          console.error('Failed to send pooja booking WhatsApp notifications:', error)
        }

        // Send Email notifications for pooja booking
        try {
          const devoteeEmail = userInfo.emailAddress
          if (devoteeEmail) {
            // Send email confirmation to devotee
            const emailResult = await EmailService.sendPoojaBookingConfirmation(
              devoteeEmail,
              poojaBooking.userName,
              poojaBooking.poojaName,
              poojaBooking.receiptNumber,
              poojaBooking.preferredDate?.toISOString() || new Date().toISOString(),
              poojaBooking.poojaPrice
            )

            if (emailResult.success) {
              console.log('Pooja booking confirmation email sent successfully to:', devoteeEmail)
            } else {
              console.error('Failed to send pooja booking confirmation email:', emailResult.error)
            }
          }

          // Send notification email to admin
          const adminEmailResult = await EmailService.sendPoojaBookingNotificationToAdmin(
            poojaBooking.userName,
            poojaBooking.poojaName,
            poojaBooking.receiptNumber,
            poojaBooking.preferredDate?.toISOString() || new Date().toISOString(),
            userInfo.emailAddress || 'Not provided',
            poojaBooking.userPhone
          )

          if (adminEmailResult.success) {
            console.log('Pooja booking notification email sent to admin successfully')
          } else {
            console.error('Failed to send pooja booking notification email to admin:', adminEmailResult.error)
          }
        } catch (emailError) {
          console.error('Email notifications failed for pooja booking:', emailError)
        }
        break

      case 'astrology_consultation':
        // Handle astrology consultation bookings
        const consultationNumber = `AC-${dateStr}-${Date.now().toString().slice(-4)}`

        // For now, create a simple record (you might want to add a database table for consultations)
        responseData = {
          type: 'astrology_consultation',
          consultationId: `consultation_${timestamp}`,
          receiptNumber: consultationNumber,
          consultationType: items[0]?.name || 'General Astrology Consultation',
          amount: amount,
          clientName: userInfo.fullName,
          clientPhone: userInfo.phoneNumber,
          createdAt: new Date().toISOString()
        }

        // Send WhatsApp notifications for astrology consultation
        try {
          const consultationDetails = {
            clientName: userInfo.fullName,
            clientPhone: userInfo.phoneNumber,
            consultationType: items[0]?.name || 'General Astrology Consultation',
            amount: amount,
            receiptNumber: consultationNumber,
            paymentId: `pay_${timestamp}`,
            preferredDate: serviceDetails?.preferredDate,
            preferredTime: serviceDetails?.preferredTime,
            birthDetails: serviceDetails?.birthDetails,
            concerns: serviceDetails?.concerns,
            date: new Date().toLocaleDateString()
          }

          // Send to admin and client
          const [adminNotified, clientNotified] = await Promise.all([
            whatsappService.sendAstrologyConsultationNotificationToAdmin(consultationDetails),
            whatsappService.sendAstrologyConsultationConfirmation(consultationDetails, true) // true = also send to admin
          ])

          if (adminNotified && clientNotified) {
            console.log('✅ Astrology consultation WhatsApp notifications sent successfully')
          } else {
            console.error('❌ Some WhatsApp notifications failed')
          }
        } catch (error) {
          console.error('❌ Failed to send astrology consultation WhatsApp notifications:', error)
        }

        // Send Email notifications for astrology consultation
        try {
          const clientEmail = userInfo.emailAddress
          if (clientEmail) {
            // Send email confirmation to client
            const emailResult = await EmailService.sendAstrologyConsultationConfirmation(
              clientEmail,
              userInfo.fullName,
              items[0]?.name || 'General Astrology Consultation',
              consultationNumber,
              serviceDetails?.preferredDate || new Date().toISOString(),
              amount
            )

            if (emailResult.success) {
              console.log('Astrology consultation confirmation email sent successfully to:', clientEmail)
            } else {
              console.error('Failed to send astrology consultation confirmation email:', emailResult.error)
            }
          }

          // Send notification email to admin with complete client details
          const adminEmailResult = await EmailService.sendAstrologyConsultationNotificationToAdmin(
            userInfo.fullName,
            items[0]?.name || 'General Astrology Consultation',
            consultationNumber,
            serviceDetails?.preferredDate || new Date().toISOString(),
            userInfo.emailAddress || 'Not provided',
            userInfo.phoneNumber,
            serviceDetails?.birthDetails
          )

          if (adminEmailResult.success) {
            console.log('Astrology consultation notification email sent to admin successfully')
          } else {
            console.error('Failed to send astrology consultation notification email to admin:', adminEmailResult.error)
          }
        } catch (emailError) {
          console.error('Email notifications failed for astrology consultation:', emailError)
        }
        break

      case 'donation':
      default:
        // Handle donations
        const donation = await prisma.donation.create({
          data: {
            receiptNumber: receiptNumber,
            userId: user.id,
            amount: amount,
            donationType: items[0]?.name || 'General Donation',
            donationPurpose: items[0]?.description || 'General Purpose',
            paymentStatus: 'SUCCESS',
            paymentMethod: 'razorpay',
            razorpayOrderId: `order_${timestamp}`,
            razorpayPaymentId: providedPaymentId || `pay_${timestamp}`,
            razorpaySignature: 'development_signature',
            ipAddress: '127.0.0.1',
            userAgent: 'Development'
          }
        })

        responseData = {
          type: 'donation',
          donationId: donation.id,
          receiptNumber: donation.receiptNumber,
          amount: donation.amount,
          donationType: donation.donationType,
          donationPurpose: donation.donationPurpose,
          userName: userInfo.fullName,
          userPhone: userInfo.phoneNumber,
          createdAt: donation.createdAt
        }

        // Send WhatsApp notifications for donation with PDF certificate and prioritized emails
        try {
          const donationDetails = {
            donorName: userInfo.fullName,
            donorPhone: userInfo.phoneNumber.startsWith('+') ? userInfo.phoneNumber : `+91${userInfo.phoneNumber}`,
            amount: donation.amount,
            donationType: donation.donationType,
            donationPurpose: donation.donationPurpose,
            receiptNumber: donation.receiptNumber,
            paymentId: `pay_${timestamp}`,
            date: donation.createdAt.toLocaleDateString()
          }

          // Generate PDF certificate for donation
          let certificateUrl = null
          try {
            // Create certificate service instance with correct base URL
            const CertificateServiceClass = (await import('@/lib/certificate-service')).default
            const certificateServiceInstance = new CertificateServiceClass({
              baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8010'}/api/certificates`
            })

            const certificateData = {
              donor_name: userInfo.fullName,
              amount: donation.amount,
              donation_id: donation.receiptNumber,
              donation_date: donation.createdAt.toISOString().split('T')[0], // YYYY-MM-DD format
              payment_mode: 'Online',
              org_name: 'Shri Raghavendra Swamy Brundavana Sannidhi',
              org_subtitle: 'Service to Humanity is Service to God',
              show_80g_note: true
            }

            const certificateResponse = await certificateServiceInstance.generateCertificate(certificateData)
            if (certificateResponse.success && certificateResponse.download_url) {
              certificateUrl = certificateResponse.download_url
              console.log('📄 Donation certificate generated:', certificateUrl)
            } else {
              console.warn('⚠️ Certificate generation failed:', certificateResponse.error)
            }
          } catch (certificateError) {
            console.error('❌ Error generating certificate:', certificateError)
            // Continue without certificate - don't fail the whole process
          }

          // Send WhatsApp notifications
          const [adminNotified, donorNotified] = await Promise.all([
            whatsappService.sendDonationNotificationToAdmin(donationDetails),
            whatsappService.sendDonationReceiptToDonor(donationDetails, certificateUrl, true) // true = also send to admin
          ])

          if (adminNotified && donorNotified) {
            console.log('✅ Donation WhatsApp notifications sent successfully with certificate')
          } else {
            console.error('❌ Some WhatsApp notifications failed')
          }

          // Send Email notifications
          try {
            const donorEmail = userInfo.emailAddress
            if (donorEmail) {
              // Send email receipt with certificate to donor
              const emailResult = await EmailService.sendDonationReceipt(
                donorEmail,
                userInfo.fullName,
                donation.amount,
                donation.receiptNumber,
                donation.donationType,
                '', // gotra not available in donation data
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
              userInfo.fullName,
              donation.amount,
              donation.receiptNumber,
              donation.donationType,
              userInfo.emailAddress || 'Not provided',
              userInfo.phoneNumber,
              '' // gotra not available in donation data
            )

            if (adminEmailResult.success) {
              console.log('Donation notification email sent to admin successfully')
            } else {
              console.error('Failed to send donation notification email to admin:', adminEmailResult.error)
            }
          } catch (emailError) {
            console.error('Email notifications failed:', emailError)
          }
        } catch (error) {
          console.error('❌ Failed to send donation notifications:', error)
        }
        break
    }

    console.log('Payment processed successfully:', { receiptNumber, paymentType })

    return NextResponse.json({
      success: true,
      receiptNumber,
      paymentType,
      data: responseData
    })

  } catch (error) {
    console.error('Error processing payment:', error)

    let errorMessage = 'Failed to process payment'
    if (error instanceof Error) {
      errorMessage = `Payment processing failed: ${error.message}`
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// Helper function to get daily sequence
async function getDailySequence(type: string, dateStr: string): Promise<number> {
  const result = await prisma.$transaction(async (tx) => {
    const existingRecord = await tx.dailySequence.findFirst({
      where: {
        type: type,
        date: dateStr
      }
    })

    let newSequence = 1
    if (existingRecord) {
      newSequence = existingRecord.lastSequence + 1
      await tx.dailySequence.update({
        where: { id: existingRecord.id },
        data: { lastSequence: newSequence }
      })
    } else {
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