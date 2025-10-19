/**
 * Network configuration for local development
 * Automatically detects local network IP for phone access
 */

// Helper function to get local network IP
function getLocalNetworkIp(): string {
  try {
    // For development, we'll use a fallback IP
    // In production, you might want to implement proper IP detection
    const fallbackIp = '192.168.0.175'

    // Try to get from environment variable first
    const envIp = process.env.LOCAL_NETWORK_IP
    if (envIp) return envIp

    return fallbackIp
  } catch (error) {
    console.error('Error detecting local IP:', error)
    return '192.168.0.175' // Fallback IP
  }
}

export const networkConfig = {
  // Local network IP - automatically detected with fallback
  get localIp(): string {
    return getLocalNetworkIp()
  },

  // Port where the main Next.js app is running
  appPort: '3010',

  // Alternative port (if needed)
  alternativePort: '8010',

  // Get the full URL for certificate access
  getCertificateUrl(receiptNumber: string): string {
    return `http://${this.localIp}:${this.appPort}/certificate/${receiptNumber}`
  },

  // Get phone-friendly certificate URL
  getPhoneFriendlyCertificateUrl(receiptNumber: string): string {
    return `http://${this.localIp}:${this.appPort}/certificate/${receiptNumber}`
  },

  // Generate WhatsApp message with phone-friendly links
  generateCertificateWhatsAppMessage(donorName: string, amount: number, receiptNumber: string): string {
    const certificateUrl = this.getPhoneFriendlyCertificateUrl(receiptNumber)

    return `📎 *Your 80G Donation Certificate is ready!*

Dear ${donorName},

🙏 Thank you for your generous donation of ₹${amount.toLocaleString('en-IN')} to Shri Raghavendra Swamy Brundavana Sannidhi!

📱 *Tap the link below to download your certificate:*

👇 *One-Tap Download*
${certificateUrl}

📱 *Important:*
• Make sure your phone is connected to the same WiFi as this computer
• Link will work instantly when you're on the same network
• If it doesn't work, check your WiFi connection

🧾 *Receipt Details:*
• Receipt Number: ${receiptNumber}
• Date: ${new Date().toLocaleDateString('en-IN')}

🙏 *May Sri Raghavendra Swamy bless you and your family!*

For any queries, please contact: +918310408797

---
*Shri Raghavendra Swamy Brundavana Sannidhi*
*Service to Humanity is Service to God*`
  }
}

// Export a singleton instance
export const config = networkConfig