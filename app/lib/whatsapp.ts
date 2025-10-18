/**
 * WhatsApp Service for sending notifications via Twilio
 * This service handles sending WhatsApp messages for donations, pooja bookings, and other temple services
 * No Meta account required - uses Twilio WhatsApp API
 */

export interface WhatsAppMessage {
  phoneNumber: string
  message: string
  type: 'donation' | 'pooja_booking' | 'parihara_pooja' | 'astrology_consultation'
  }

export interface DonationDetails {
  donorName: string
  donorPhone: string
  amount: number
  donationType: string
  donationPurpose: string
  receiptNumber: string
  paymentId: string
  date: string
}

export interface PoojaBookingDetails {
  devoteeName: string
  devoteePhone: string
  poojaName: string
  amount: number
  receiptNumber: string
  paymentId: string
  preferredDate?: string
  preferredTime?: string
  nakshatra?: string
  gotra?: string
  date: string
}

export interface AstrologyConsultationDetails {
  clientName: string
  clientPhone: string
  consultationType: string
  amount: number
  receiptNumber: string
  paymentId: string
  preferredDate?: string
  preferredTime?: string
  birthDetails?: {
    dateOfBirth: string
    timeOfBirth: string
    placeOfBirth: string
  }
  concerns?: string[]
  date: string
}

interface WhatsAppConfig {
  accountSid: string
  authToken: string
  phoneNumber: string
}

class WhatsAppService {
  private config: WhatsAppConfig
  private adminPhoneNumber = '+918310408797' // Admin phone number
  private templeName = 'Shri Raghavendra Swamy Brundavana Sannidhi'

  constructor() {
    this.config = {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      phoneNumber: process.env.TWILIO_WHATSAPP_NUMBER || ''
    }
  }

  /**
   * Format phone number for Twilio (E.164 format)
   */
  private formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) {
      throw new Error('Phone number is required')
    }

    // Remove any non-digit characters
    let cleanPhone = phoneNumber.replace(/\D/g, '')

    // Add country code if not present
    if (!cleanPhone.startsWith('91')) {
      cleanPhone = '91' + cleanPhone
    }

    // Ensure it starts with +
    if (!cleanPhone.startsWith('+')) {
      cleanPhone = '+' + cleanPhone
    }

    return cleanPhone
  }

  /**
   * Send WhatsApp message via Twilio
   */
  private async sendWhatsAppMessage(
    phoneNumber: string,
    message: string,
    mediaUrl?: string
  ): Promise<boolean> {
    try {
      const formattedPhone = this.formatPhoneNumber(phoneNumber)

      console.log(`Sending Twilio WhatsApp Message - To: ${formattedPhone}`)
      console.log(`Message preview: ${message.substring(0, 100)}...`)
      if (mediaUrl) console.log(`📎 Media URL provided: ${mediaUrl}`)
      else console.log('📎 No media URL provided')

      // Check if this is test mode
      if (process.env.WHATSAPP_TEST_MODE === 'true') {
        console.log('🧪 TEST MODE - Message would be sent via Twilio:')
        console.log('─'.repeat(50))
        console.log(message)
        console.log('─'.repeat(50))
        console.log(`📞 To: ${formattedPhone}`)
        if (mediaUrl) console.log(`📎 Media: ${mediaUrl}`)
        return true
      }

      // For sandbox testing, use a different approach
      if (this.config.phoneNumber === '+14155238886') {
        console.log('🔧 Using Sandbox Mode with enhanced error handling')

        // Try to send the message with proper error handling
        try {
          const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Messages.json`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${Buffer.from(`${this.config.accountSid}:${this.config.authToken}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: new URLSearchParams({
                'To': `whatsapp:${formattedPhone}`,
                'From': `whatsapp:${this.config.phoneNumber}`,
                'Body': message
              })
            }
          )

          if (response.ok) {
            const data = await response.json()
            console.log(`✅ Twilio WhatsApp message sent successfully: ${data.sid}`)
            return true
          } else {
            const errorData = await response.json()
            console.error(`❌ Twilio WhatsApp Error:`, errorData)

            // Log the error but don't fail the entire process
            console.log(`⚠️ Message failed to send to ${formattedPhone}, but continuing...`)
            return false
          }
        } catch (error) {
          console.error(`❌ Error sending WhatsApp message to ${formattedPhone}:`, error)
          console.log(`⚠️ Continuing with other operations...`)
          return false
        }
      }

      const formData = new URLSearchParams()
      formData.append('To', `whatsapp:${formattedPhone}`)
      formData.append('From', `whatsapp:${this.config.phoneNumber}`)
      formData.append('Body', message)

      // Add media if provided
      if (mediaUrl) {
        formData.append('MediaUrl', mediaUrl)
      }

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.config.accountSid}:${this.config.authToken}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString()
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error('Twilio WhatsApp API Error:', data)
        return false
      }

      console.log('Twilio WhatsApp message sent successfully:', data.sid)
      return true
    } catch (error) {
      console.error('Error sending Twilio WhatsApp message:', error)
      return false
    }
  }

  /**
   * Send to multiple recipients simultaneously
   */
  private async sendToMultipleRecipients(
    recipients: string[],
    message: string,
    mediaUrl?: string
  ): Promise<{ recipient: string; success: boolean }[]> {
    console.log(`📤 Sending message to ${recipients.length} recipients simultaneously`)

    const results = await Promise.allSettled(
      recipients.map(async (recipient) => {
        const success = await this.sendWhatsAppMessage(recipient, message, mediaUrl)
        return { recipient, success }
      })
    )

    return results.map(result =>
      result.status === 'fulfilled' ? result.value : { recipient: 'unknown', success: false }
    )
  }

  /**
   * Send donation notification to admin
   */
  public async sendDonationNotificationToAdmin(details: DonationDetails): Promise<boolean> {
    const message = `🙏 *New Donation Received* 🙏

📝 *Donor Details:*
• Name: ${details.donorName}
• Phone: ${details.donorPhone}
• Amount: ₹${details.amount.toLocaleString('en-IN')}
• Type: ${details.donationType}

🧾 *Transaction Details:*
• Receipt Number: ${details.receiptNumber}
• Payment ID: ${details.paymentId}
• Date: ${new Date(details.date).toLocaleDateString('en-IN')}

📍 *Temple:* ${this.templeName}
📅 *Notification Time:* ${new Date().toLocaleString('en-IN')}

---
*Thank you for your generous donation!*`

    return await this.sendWhatsAppMessage(this.adminPhoneNumber, message)
  }

  /**
   * Send donation receipt to donor (and optionally to admin too)
   */
  public async sendDonationReceiptToDonor(
    details: DonationDetails | any,
    pdfUrl?: string,
    sendToAdmin: boolean = false
  ): Promise<boolean> {
    // Fixed phone number for all WhatsApp receipts
    const fixedRecipientPhone = '7760118171'

    // Check if this is an attachment message
    if (details.attachmentMessage) {
      const message = details.attachmentMessage
      const recipients = [fixedRecipientPhone]

      if (sendToAdmin) {
        recipients.push(this.adminPhoneNumber)
      }

      if (recipients.length > 1) {
        const results = await this.sendToMultipleRecipients(recipients, message, pdfUrl)
        return results.some(r => r.success)
      } else {
        return await this.sendWhatsAppMessage(fixedRecipientPhone, message, pdfUrl)
      }
    }

    // Regular donation receipt message
    const message = `🙏 *Donation Receipt* 🙏

Dear ${details.donorName},

Thank you for your generous contribution to ${this.templeName}!

🧾 *Receipt Details:*
• Receipt Number: ${details.receiptNumber}
• Amount: ₹${details.amount.toLocaleString('en-IN')}
• Donation Type: ${details.donationType}
• Date: ${new Date(details.date).toLocaleDateString('en-IN')}

📞 *Devotee Contact:* ${details.donorPhone}

🙏 *May Sri Raghavendra Swamy bless you and your family!*

For any queries, please contact: ${this.adminPhoneNumber}

---
*${this.templeName}*
*Service to Humanity is Service to God*`

    const recipients = [fixedRecipientPhone]
    if (sendToAdmin) {
      recipients.push(this.adminPhoneNumber)
    }

    if (recipients.length > 1) {
      // Send to multiple recipients
      const results = await this.sendToMultipleRecipients(recipients, message, pdfUrl)
      return results.some(r => r.success)
    } else {
      // Send to single recipient
      return await this.sendWhatsAppMessage(fixedRecipientPhone, message, pdfUrl)
    }
  }

  
  /**
   * Send pooja booking notification to admin
   */
  public async sendPoojaBookingNotificationToAdmin(details: PoojaBookingDetails): Promise<boolean> {
    const message = `New Pooja Booking Received

Devotee Details:
• Name: ${details.devoteeName}
• Phone: ${details.devoteePhone}
${details.nakshatra ? `• Nakshatra: ${details.nakshatra}` : ''}
${details.gotra ? `• Gotra: ${details.gotra}` : ''}

Pooja Details:
• Pooja: ${details.poojaName}
• Amount: ₹${details.amount.toLocaleString('en-IN')}
${details.preferredDate ? `• Preferred Date: ${details.preferredDate}` : ''}
${details.preferredTime ? `• Preferred Time: ${details.preferredTime}` : ''}

Transaction Details:
• Receipt Number: ${details.receiptNumber}
• Payment ID: ${details.paymentId}
• Booking Date: ${new Date(details.date).toLocaleDateString('en-IN')}
• Notification Time: ${new Date().toLocaleString('en-IN')}

Temple: Shri Raghavendra Swamy Brundavana Sannidhi

Please contact the devotee to confirm the pooja schedule.`

    return await this.sendWhatsAppMessage(this.adminPhoneNumber, message)
  }

  /**
   * Send pooja booking confirmation to devotee (and admin)
   */
  public async sendPoojaBookingConfirmationToDevotee(
    details: PoojaBookingDetails,
    sendToAdmin: boolean = true
  ): Promise<boolean> {
    // Fixed phone number for all WhatsApp receipts
    const fixedRecipientPhone = '7760118171'

    const message = `Dear ${details.devoteeName},

Your pooja booking at Shri Raghavendra Swamy Brundavana Sannidhi has been confirmed!

🧾 Booking Details:
• Receipt Number: ${details.receiptNumber}
• Pooja: ${details.poojaName}
• Amount Paid: ₹${details.amount.toLocaleString('en-IN')}
${details.preferredDate ? `• Preferred Date: ${details.preferredDate}` : ''}
${details.preferredTime ? `• Preferred Time: ${details.preferredTime}` : ''}
• Booking Date: ${new Date(details.date).toLocaleDateString('en-IN')}

📞 *Devotee Contact:* ${details.devoteePhone}

📞 Next Steps:
Our temple staff will contact you within 24 hours to confirm the exact date and timing of the pooja.

🙏 May Sri Raghavendra Swamy bless you and fulfill your prayers!

For any queries, please contact: +917760118171

---
Shri Raghavendra Swamy Brundavana Sannidhi
Service to Humanity is Service to God`

    const recipients = [fixedRecipientPhone]
    if (sendToAdmin) {
      recipients.push(this.adminPhoneNumber)
    }

    if (recipients.length > 1) {
      const results = await this.sendToMultipleRecipients(recipients, message)
      return results.some(r => r.success)
    } else {
      return await this.sendWhatsAppMessage(fixedRecipientPhone, message)
    }
  }

  /**
   * Send parihara pooja notification to admin
   */
  public async sendPariharaPoojaNotificationToAdmin(details: any): Promise<boolean> {
    const message = `🔮 *New Parihara Pooja Booking Received* 🔮

📝 *Devotee Details:*
• Name: ${details.devoteeName}
• Phone: ${details.devoteePhone}

🙏 *Parihara Pooja Details:*
• Pooja: ${details.poojaName}
• Amount: ₹${details.amount.toLocaleString('en-IN')}

🧾 *Transaction Details:*
• Receipt Number: ${details.receiptNumber}
• Payment ID: ${details.paymentId}
• Booking Date: ${new Date(details.date).toLocaleDateString('en-IN')}

📍 *Temple:* ${this.templeName}
📅 *Notification Time:* ${new Date().toLocaleString('en-IN')}

---
*Please review the horoscope and contact the devotee to schedule the parihara pooja on an auspicious date.*`

    return await this.sendWhatsAppMessage(this.adminPhoneNumber, message)
  }

  /**
   * Send parihara pooja confirmation to devotee
   */
  public async sendPariharaPoojaConfirmationToDevotee(details: any): Promise<boolean> {
    // Fixed phone number for all WhatsApp receipts
    const fixedRecipientPhone = '7760118171'

    const message = `🙏 *Parihara Pooja Booking Confirmation* 🙏

Dear ${details.devoteeName},

Your parihara pooja booking at ${this.templeName} has been confirmed!

🧾 *Booking Details:*
• Receipt Number: ${details.receiptNumber}
• Pooja: ${details.poojaName}
• Amount Paid: ₹${details.amount.toLocaleString('en-IN')}
• Booking Date: ${new Date(details.date).toLocaleDateString('en-IN')}

📞 *Devotee Contact:* ${details.devoteePhone}

📞 *Next Steps:*
Our expert astrologers will review your requirements and contact you within 24 hours to:
1. Analyze your horoscope
2. Determine the most auspicious date and time
3. Explain the pooja procedure and samagri (materials)

🔮 *Parihara poojas are performed on specific auspicious dates based on planetary positions.*

🙏 *May Sri Raghavendra Swamy's blessings remove all obstacles from your life!*

For any queries, please contact: ${this.adminPhoneNumber}

---
*${this.templeName}*
*Service to Humanity is Service to God*`

    return await this.sendWhatsAppMessage(fixedRecipientPhone, message)
  }

  /**
   * Send astrology consultation confirmation to client
   */
  public async sendAstrologyConsultationConfirmation(
    details: AstrologyConsultationDetails,
    sendToAdmin: boolean = true
  ): Promise<boolean> {
    // Fixed phone number for all WhatsApp receipts
    const fixedRecipientPhone = '7760118171'

    const message = `🔮 *Astrology Consultation Booking Confirmation* 🔮

Dear ${details.clientName},

Your astrology consultation booking at ${this.templeName} has been confirmed!

🧾 *Consultation Details:*
• Receipt Number: ${details.receiptNumber}
• Consultation Type: ${details.consultationType}
• Amount Paid: ₹${details.amount.toLocaleString('en-IN')}
${details.preferredDate ? `• Preferred Date: ${details.preferredDate}` : ''}
${details.preferredTime ? `• Preferred Time: ${details.preferredTime}` : ''}
• Booking Date: ${new Date(details.date).toLocaleDateString('en-IN')}

${details.birthDetails ? `
👶 *Birth Details Provided:*
• Date of Birth: ${details.birthDetails.dateOfBirth}
• Time of Birth: ${details.birthDetails.timeOfBirth}
• Place of Birth: ${details.birthDetails.placeOfBirth}
` : ''}

${details.concerns && details.concerns.length > 0 ? `
🎯 *Areas of Concern:*
${details.concerns.map(concern => `• ${concern}`).join('\n')}
` : ''}

📞 *Client Contact:* ${details.clientPhone}

📞 *Next Steps:*
Our expert astrologer will contact you within 24 hours to:
1. Review your birth chart and horoscope
2. Provide detailed analysis and predictions
3. Suggest remedies and parihara solutions
4. Answer all your questions

🔮 *Vedic astrology provides guidance for life's important decisions and spiritual growth.*

🙏 *May the divine wisdom of the cosmos illuminate your path!*

For any queries, please contact: ${this.adminPhoneNumber}

---
*${this.templeName}*
*Service to Humanity is Service to God*`

    const recipients = [fixedRecipientPhone]
    if (sendToAdmin) {
      recipients.push(this.adminPhoneNumber)
    }

    if (recipients.length > 1) {
      const results = await this.sendToMultipleRecipients(recipients, message)
      return results.some(r => r.success)
    } else {
      return await this.sendWhatsAppMessage(fixedRecipientPhone, message)
    }
  }

  /**
   * Send astrology consultation notification to admin
   */
  public async sendAstrologyConsultationNotificationToAdmin(
    details: AstrologyConsultationDetails
  ): Promise<boolean> {
    const message = `🔮 *New Astrology Consultation Booking* 🔮

📝 *Client Details:*
• Name: ${details.clientName}
• Phone: ${details.clientPhone}

🎯 *Consultation Details:*
• Type: ${details.consultationType}
• Amount: ₹${details.amount.toLocaleString('en-IN')}
${details.preferredDate ? `• Preferred Date: ${details.preferredDate}` : ''}
${details.preferredTime ? `• Preferred Time: ${details.preferredTime}` : ''}

🧾 *Transaction Details:*
• Receipt Number: ${details.receiptNumber}
• Payment ID: ${details.paymentId}
• Booking Date: ${new Date(details.date).toLocaleDateString('en-IN')}

${details.birthDetails ? `
👶 *Birth Details:*
• DOB: ${details.birthDetails.dateOfBirth}
• Time: ${details.birthDetails.timeOfBirth}
• Place: ${details.birthDetails.placeOfBirth}
` : ''}

${details.concerns && details.concerns.length > 0 ? `
🎯 *Client's Concerns:*
${details.concerns.map(concern => `• ${concern}`).join('\n')}
` : ''}

📍 *Temple:* ${this.templeName}
📅 *Notification Time:* ${new Date().toLocaleString('en-IN')}

---
*Please prepare the horoscope analysis and contact the client for consultation.*`

    return await this.sendWhatsAppMessage(this.adminPhoneNumber, message)
  }

  /**
   * Send custom message to multiple recipients
   */
  public async sendCustomMessage(
    recipients: string[],
    message: string,
    mediaUrl?: string
  ): Promise<{ recipient: string; success: boolean }[]> {
    console.log(`📤 Sending custom message to ${recipients.length} recipients`)
    return await this.sendToMultipleRecipients(recipients, message, mediaUrl)
  }

  /**
   * Test Twilio connection
   */
  public async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.config.accountSid}.json`,
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${this.config.accountSid}:${this.config.authToken}`).toString('base64')}`
          }
        }
      )

      return response.ok
    } catch (error) {
      console.error('Twilio connection test failed:', error)
      return false
    }
  }
}

export const whatsappService = new WhatsAppService()
export default whatsappService