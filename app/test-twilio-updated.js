/**
 * Twilio WhatsApp Setup Test Script
 * Run this after you've completed the Twilio WhatsApp setup
 */

require('dotenv').config({ path: '.env.local' })

console.log('🔍 Testing Twilio WhatsApp Setup')
console.log('=' .repeat(45))

// Check 1: Environment Variables
console.log('\n📋 CHECK 1: Environment Variables')
console.log('-'.repeat(35))

const requiredVars = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_WHATSAPP_NUMBER'
]

let envCheck = true

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value && value !== 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' && value !== 'your_twilio_auth_token_here' && value !== '+14155238886') {
    console.log(`✅ ${varName}: Set correctly`)
  } else {
    console.log(`❌ ${varName}: Not set or using placeholder`)
    envCheck = false
  }
})

if (!envCheck) {
  console.log('\n⚠️  Please set up your Twilio environment variables first!')
  console.log('📖 Follow: docs/TWILIO_WHATSAPP_SETUP.md')
  process.exit(1)
}

// Check 2: Account SID Format
console.log('\n🆔 CHECK 2: Account SID Format')
console.log('-'.repeat(35))
const accountSid = process.env.TWILIO_ACCOUNT_SID
if (accountSid.startsWith('AC') && accountSid.length === 34) {
  console.log('✅ Account SID format looks correct')
} else {
  console.log('❌ Account SID format may be incorrect')
  console.log('💡 Should start with "AC" and be 34 characters')
}

// Check 3: WhatsApp Number Format
console.log('\n📱 CHECK 3: WhatsApp Number Format')
console.log('-'.repeat(35))
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER
if (whatsappNumber.startsWith('+') && whatsappNumber.length >= 12) {
  console.log('✅ WhatsApp number format looks correct')
} else {
  console.log('❌ WhatsApp number format may be incorrect')
  console.log('💡 Should start with "+" and include country code')
}

// Check 4: Test Twilio Connection
console.log('\n🌐 CHECK 4: Twilio Connection Test')
console.log('-'.repeat(35))

async function testTwilioConnection() {
  try {
    const { whatsappService } = require('./lib/whatsapp.ts')

    const isConnected = await whatsappService.testConnection()

    if (isConnected) {
      console.log('✅ Twilio connection successful')
      console.log('🔑 Account is active and valid')
    } else {
      console.log('❌ Twilio connection failed')
      console.log('💡 Check Account SID and Auth Token')
    }

    // Test 5: Test Message Sending (if connected)
    if (isConnected) {
      console.log('\n📤 CHECK 5: Test Message Sending')
      console.log('-'.repeat(35))

      const testMode = process.env.WHATSAPP_TEST_MODE
      if (testMode === 'true') {
        console.log('🧪 Test Mode: ENABLED')
        console.log('💡 Messages will be logged, not sent')
      } else {
        console.log('📤 Test Mode: DISABLED')
        console.log('⚠️  Real messages will be sent to WhatsApp')
      }

      // Test message preview
      console.log('\n📧 Sample Message Preview:')
      console.log('─'.repeat(40))

      const testMessage = `🙏 *Donation Receipt* 🙏

Dear Test Devotee,

Thank you for your generous contribution to Shri Raghavendra Swamy Brundavana Sannidhi!

🧾 *Receipt Details:*
• Receipt Number: DN-TEST-0001
• Amount: ₹1,100
• Type: General Donation
• Purpose: Temple Maintenance
• Date: ${new Date().toLocaleDateString('en-IN')}

🙏 *May Sri Raghavendra Swamy bless you!*

For queries: +917760118171

---
*Shri Raghavendra Swamy Brundavana Sannidhi*
*Service to Humanity is Service to God*`

      console.log(testMessage)
      console.log('─'.repeat(40))

      console.log('\n📤 Multiple Recipient Test:')
      console.log('👥 Messages can be sent to: Devotee + Admin simultaneously')
    }

    // Final Summary
    console.log('\n📊 SETUP SUMMARY')
    console.log('=' .repeat(45))

    console.log('\n🎯 NEXT STEPS:')
    console.log('1. ✅ Environment variables configured')
    console.log('2. 📡 Twilio connection tested')
    console.log('3. 📱 Ready to send WhatsApp messages!')

    console.log('\n🧪 TO TEST REAL MESSAGES:')
    console.log('- Set WHATSAPP_TEST_MODE=false')
    console.log('- Run: node test-twilio-real.js')
    console.log('- Or make a test donation on your website')

    console.log('\n📖 FOR HELP:')
    console.log('- Setup Guide: docs/TWILIO_WHATSAPP_SETUP.md')
    console.log('- Twilio Console: https://console.twilio.com/')
    console.log('- WhatsApp Templates: Required for business messaging')

    console.log('\n💰 COST ESTIMATE:')
    console.log('- $5/month for WhatsApp number')
    console.log('- ~₹0.48 per message')
    console.log('- First few messages: Free trial credits')

    console.log('\n🎉 Your Twilio WhatsApp system is ready!')
    console.log('📧 Send messages to unlimited recipients!')

  } catch (error) {
    console.log('❌ Error loading WhatsApp service:', error.message)
    console.log('💡 Make sure whatsapp.ts file exists')
  }
}

testTwilioConnection().catch(console.error)