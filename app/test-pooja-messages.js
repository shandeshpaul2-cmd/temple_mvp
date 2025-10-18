/**
 * Test Pooja Booking WhatsApp Messages
 * This will send real messages to test your templates
 */

const fs = require('fs')
const path = require('path')

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

console.log('🧪 Testing Pooja Booking WhatsApp Messages')
console.log('=' .repeat(55))

const env = loadEnv()

// Check if real messages are enabled
if (env.WHATSAPP_TEST_MODE === 'true') {
  console.log('⚠️  Test mode is enabled. Set WHATSAPP_TEST_MODE=false to send real messages')
  process.exit(1)
}

console.log('📱 Real messages will be sent to WhatsApp!')
console.log('⚠️  Make sure you want to receive these test messages\n')

// Import WhatsApp service
async function testPoojaMessages() {
  try {
    // Dynamically import the WhatsApp service
    const { whatsappService } = await import('./lib/whatsapp.ts')

    // Test 1: Pooja Booking Confirmation to Devotee
    console.log('📤 TEST 1: Pooja Booking Confirmation to Devotee')
    console.log('-'.repeat(50))

    const poojaDetails = {
      devoteeName: 'Test Devotee',
      devoteePhone: '+919945594845', // Temple phone number for testing
      poojaName: 'Nithya Pooja',
      amount: 500,
      receiptNumber: 'PB-161024-0001',
      paymentId: 'pay_test_123456',
      preferredDate: '2024-10-20',
      preferredTime: '9:00 AM',
      nakshatra: 'Rohini',
      gotra: 'Kashyapa',
      date: new Date().toISOString()
    }

    console.log(`Sending to: ${poojaDetails.devoteePhone}`)
    console.log(`Pooja: ${poojaDetails.poojaName}`)
    console.log(`Receipt: ${poojaDetails.receiptNumber}`)

    const devoteeResult = await whatsappService.sendPoojaBookingConfirmationToDevotee(poojaDetails, false) // false = don't send to admin

    if (devoteeResult) {
      console.log('✅ Devotee message sent successfully!')
    } else {
      console.log('❌ Failed to send devotee message')
    }

    // Wait a bit before sending admin message
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Test 2: Pooja Booking Notification to Admin
    console.log('\n📤 TEST 2: Pooja Booking Notification to Admin')
    console.log('-'.repeat(50))

    console.log('Sending admin notification...')
    console.log('Admin will receive devotee details and booking information')

    const adminResult = await whatsappService.sendPoojaBookingNotificationToAdmin(poojaDetails)

    if (adminResult) {
      console.log('✅ Admin notification sent successfully!')
    } else {
      console.log('❌ Failed to send admin notification')
    }

    // Wait a bit before sending to both
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Test 3: Send to Both Devotee and Admin Simultaneously
    console.log('\n📤 TEST 3: Send Confirmation to Both Devotee + Admin')
    console.log('-'.repeat(50))

    const bothResult = await whatsappService.sendPoojaBookingConfirmationToDevotee(poojaDetails, true) // true = also send to admin

    if (bothResult) {
      console.log('✅ Messages sent to both devotee and admin successfully!')
    } else {
      console.log('❌ Failed to send messages to both recipients')
    }

    // Test 4: Custom Message to Multiple People
    console.log('\n📤 TEST 4: Custom Message to Multiple Recipients')
    console.log('-'.repeat(50))

    const recipients = [
      '+919945594845', // Temple phone
      '+917760118171'  // Admin phone
    ]

    const customMessage = `🙏 *Special Temple Announcement* 🙏

Dear Devotees,

We are pleased to announce a special Maha Rudrabhisheka pooja coming up this Sunday.

📅 Date: Sunday, 20th October 2024
🕐 Time: 6:00 AM
📍 Venue: Shri Raghavendra Swamy Brundavana Sannidhi

All devotees are cordially invited to participate and receive blessings.

📞 For more details: 9945594845, 9902520105

🙏 May Sri Raghavendra Swamy bless everyone!

---
Shri Raghavendra Swamy Brundavana Sannidhi
Service to Humanity is Service to God`

    console.log(`Sending custom announcement to ${recipients.length} recipients...`)

    const customResults = await whatsappService.sendCustomMessage(recipients, customMessage)

    const successCount = customResults.filter(r => r.success).length
    console.log(`✅ Custom message sent to ${successCount}/${recipients.length} recipients`)

    // Summary
    console.log('\n📊 MESSAGE TESTING SUMMARY')
    console.log('=' .repeat(55))
    console.log('✅ Test 1: Devotee confirmation - ' + (devoteeResult ? 'SUCCESS' : 'FAILED'))
    console.log('✅ Test 2: Admin notification - ' + (adminResult ? 'SUCCESS' : 'FAILED'))
    console.log('✅ Test 3: Both recipients - ' + (bothResult ? 'SUCCESS' : 'FAILED'))
    console.log(`✅ Test 4: Custom message - ${successCount}/${recipients.length} successful`)

    if (devoteeResult && adminResult && bothResult && successCount === recipients.length) {
      console.log('\n🎉 ALL TESTS PASSED!')
      console.log('Your WhatsApp system is working perfectly!')
      console.log('💡 Check your WhatsApp for all test messages')
    } else {
      console.log('\n⚠️  Some tests failed')
      console.log('💡 Check the logs above for details')
    }

    console.log('\n💡 Note: If messages are not delivered, Twilio may require template approval')
    console.log('💡 For now, regular text messages should work for testing')

  } catch (error) {
    console.error('❌ Error during testing:', error.message)
    console.log('💡 Make sure your WhatsApp service is properly configured')
  }
}

// Ask for confirmation before sending real messages
console.log('⚠️  This will send REAL WhatsApp messages!')
console.log('💰 Cost: ~₹0.48 per message sent')
console.log('📱 Messages will be sent to: +919945594845 (Temple) and +917760118171 (Admin)')

// Simple confirmation (in production, you might want a better confirmation method)
console.log('\n🚀 Starting tests in 3 seconds...')
console.log('Press Ctrl+C to cancel\n')

setTimeout(() => {
  testPoojaMessages()
}, 3000)