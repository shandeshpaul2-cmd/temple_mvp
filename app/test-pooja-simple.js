/**
 * Simple Pooja Booking WhatsApp Test
 * Direct Twilio API call without TypeScript imports
 */

const fs = require('fs')

// Load environment variables
function loadEnv() {
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8')
    const lines = envFile.split('\n')
    const env = {}

    lines.forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        env[match[1]] = match[2].replace(/^"|"$/g, '')
      }
    })

    return env
  } catch (error) {
    console.error('❌ Could not read .env.local file')
    return {}
  }
}

console.log('🧪 Testing Pooja Booking WhatsApp Messages (Simple)')
console.log('=' .repeat(60))

const env = loadEnv()

// Check if real messages are enabled
if (env.WHATSAPP_TEST_MODE === 'true') {
  console.log('⚠️  Test mode is enabled. Set WHATSAPP_TEST_MODE=false to send real messages')
  process.exit(1)
}

// Twilio credentials
const accountSid = env.TWILIO_ACCOUNT_SID
const authToken = env.TWILIO_AUTH_TOKEN
const twilioNumber = env.TWILIO_WHATSAPP_NUMBER

if (!accountSid || !authToken || !twilioNumber) {
  console.log('❌ Twilio credentials not found in .env.local')
  process.exit(1)
}

console.log('📱 Using Twilio Account:', accountSid.substring(0, 8) + '...')
console.log('📞 From Number:', twilioNumber)

// Format phone number
function formatPhoneNumber(phoneNumber) {
  let cleanPhone = phoneNumber.replace(/\D/g, '')
  if (!cleanPhone.startsWith('91')) {
    cleanPhone = '91' + cleanPhone
  }
  if (!cleanPhone.startsWith('+')) {
    cleanPhone = '+' + cleanPhone
  }
  return cleanPhone
}

// Send WhatsApp message
async function sendWhatsAppMessage(to, message) {
  try {
    const formattedPhone = formatPhoneNumber(to)

    const formData = new URLSearchParams()
    formData.append('To', `whatsapp:${formattedPhone}`)
    formData.append('From', `whatsapp:${twilioNumber}`)
    formData.append('Body', message)

    console.log(`📤 Sending to: ${formattedPhone}`)
    console.log(`📝 Message preview: ${message.substring(0, 100)}...`)

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      }
    )

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Message sent successfully! SID:', data.sid)
      return true
    } else {
      console.log('❌ Failed to send message:', data.message)
      if (data.code) {
        console.log('🔍 Error Code:', data.code)
        if (data.code === 21610) {
          console.log('💡 This may require template approval for business messaging')
        }
      }
      return false
    }
  } catch (error) {
    console.log('❌ Error sending message:', error.message)
    return false
  }
}

// Test messages
async function runTests() {
  console.log('\n🚀 Starting WhatsApp message tests...\n')

  // Test 1: Devotee Confirmation
  console.log('📤 TEST 1: Pooja Booking Confirmation to Devotee')
  console.log('-'.repeat(50))

  const devoteeMessage = `Dear Test Devotee,

Your pooja booking at Shri Raghavendra Swamy Brundavana Sannidhi has been confirmed!

🧾 Booking Details:
• Receipt Number: PB-161024-0001
• Pooja: Nithya Pooja
• Amount Paid: ₹500
• Preferred Date: 2024-10-20
• Preferred Time: 9:00 AM
• Booking Date: 16/10/2025

📞 Next Steps:
Our temple staff will contact you within 24 hours to confirm the exact date and timing of the pooja.

🙏 May Sri Raghavendra Swamy bless you and fulfill your prayers!

For any queries, please contact: +917760118171

---
Shri Raghavendra Swamy Brundavana Sannidhi
Service to Humanity is Service to God`

  const result1 = await sendWhatsAppMessage('+919945594845', devoteeMessage)

  // Wait between messages
  await new Promise(resolve => setTimeout(resolve, 3000))

  // Test 2: Admin Notification
  console.log('\n📤 TEST 2: Admin Notification')
  console.log('-'.repeat(50))

  const adminMessage = `New Pooja Booking Received

Devotee Details:
• Name: Test Devotee
• Phone: +919945594845
• Nakshatra: Rohini
• Gotra: Kashyapa

Pooja Details:
• Pooja: Nithya Pooja
• Amount: ₹500
• Preferred Date: 2024-10-20
• Preferred Time: 9:00 AM

Transaction Details:
• Receipt Number: PB-161024-0001
• Payment ID: pay_test_123456
• Booking Date: 16/10/2025
• Notification Time: ${new Date().toLocaleString('en-IN')}

Temple: Shri Raghavendra Swamy Brundavana Sannidhi

Please contact the devotee to confirm the pooja schedule.`

  const result2 = await sendWhatsAppMessage('+917760118171', adminMessage)

  // Summary
  console.log('\n📊 TEST RESULTS')
  console.log('=' .repeat(50))
  console.log('✅ Devotee Confirmation:', result1 ? 'SUCCESS' : 'FAILED')
  console.log('✅ Admin Notification:', result2 ? 'SUCCESS' : 'FAILED')

  if (result1 && result2) {
    console.log('\n🎉 ALL TESTS PASSED!')
    console.log('Your WhatsApp templates are working perfectly!')
    console.log('💡 Check WhatsApp on both phones for the messages')
  } else {
    console.log('\n⚠️  Some tests failed')
    console.log('💡 This might be due to Twilio template requirements')
    console.log('💡 For testing, you may need to upgrade your Twilio account')
  }

  console.log('\n💰 Cost for this test: ~₹0.96 (2 messages × ~₹0.48)')
}

// Confirmation
console.log('⚠️  This will send REAL WhatsApp messages!')
console.log('💰 Cost: ~₹0.48 per message')
console.log('📱 Messages will be sent to:')
console.log('   • +919945594845 (Temple phone)')
console.log('   • +917760118171 (Admin phone)')

console.log('\n🚀 Starting tests in 3 seconds...')
console.log('Press Ctrl+C to cancel\n')

setTimeout(() => {
  runTests().catch(console.error)
}, 3000)