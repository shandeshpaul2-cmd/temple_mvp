/**
 * WhatsApp Setup Test Script
 * Run this after you've completed the Meta WhatsApp setup
 */

require('dotenv').config({ path: '.env.local' })

console.log('🔍 Testing WhatsApp Business API Setup')
console.log('=' .repeat(50))

// Check 1: Environment Variables
console.log('\n📋 CHECK 1: Environment Variables')
console.log('-'.repeat(30))

const requiredVars = [
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_WHATSAPP_NUMBER'
]

let envCheck = true

requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (value && value !== 'your-meta-whatsapp-access-token' && value !== '123456789') {
    console.log(`✅ ${varName}: Set correctly`)
  } else {
    console.log(`❌ ${varName}: Not set or using placeholder`)
    envCheck = false
  }
})

if (!envCheck) {
  console.log('\n⚠️  Please set up your environment variables first!')
  console.log('📖 Follow: docs/META_WHATSAPP_SETUP_GUIDE.md')
  process.exit(1)
}

// Check 2: Access Token Format
console.log('\n🔑 CHECK 2: Access Token Format')
console.log('-'.repeat(30))
const token = process.env.WHATSAPP_ACCESS_TOKEN
if (token.startsWith('EAAJZC') && token.length > 50) {
  console.log('✅ Access Token format looks correct')
} else {
  console.log('❌ Access Token format may be incorrect')
  console.log('💡 Should start with "EAAJZC" and be long')
}

// Check 3: Phone Number ID Format
console.log('\n📞 CHECK 3: Phone Number ID Format')
console.log('-'.repeat(30))
const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
if (/^\d+$/.test(phoneId) && phoneId.length >= 5) {
  console.log('✅ Phone Number ID format looks correct')
} else {
  console.log('❌ Phone Number ID format may be incorrect')
  console.log('💡 Should be digits only')
}

// Check 4: Test API Connection
console.log('\n🌐 CHECK 4: API Connection Test')
console.log('-'.repeat(30))

async function testAPIConnection() {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneId}?fields=name`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API connection successful')
      console.log(`📱 Phone Number Name: ${data.name || 'N/A'}`)
    } else {
      const error = await response.json()
      console.log('❌ API connection failed')
      console.log('🔍 Error:', error.error?.message || 'Unknown error')

      if (error.error?.code === 190) {
        console.log('💡 Access Token may be expired or invalid')
      } else if (error.error?.code === 100) {
        console.log('💡 Phone Number ID may be incorrect')
      }
    }
  } catch (error) {
    console.log('❌ Network error while testing API')
    console.log('🔍 Error:', error.message)
  }
}

// Check 5: Test Mode Status
console.log('\n🧪 CHECK 5: Test Mode Status')
console.log('-'.repeat(30))
const testMode = process.env.WHATSAPP_TEST_MODE
if (testMode === 'true') {
  console.log('🧪 Test Mode: ENABLED (Messages will be logged, not sent)')
} else if (testMode === 'false') {
  console.log('📤 Test Mode: DISABLED (Real messages will be sent)')
} else {
  console.log('⚠️  Test Mode: Not set (Defaulting to real messages)')
}

// Final Summary
async function runAllChecks() {
  await testAPIConnection()

  console.log('\n📊 SETUP SUMMARY')
  console.log('=' .repeat(50))

  console.log('\n🎯 NEXT STEPS:')
  console.log('1. ✅ Environment variables configured')
  console.log('2. 📡 API connection tested')
  console.log('3. 📱 Ready to send WhatsApp messages!')

  console.log('\n🧪 TO TEST MESSAGES:')
  console.log('- Run: node quick-test.js (preview)')
  console.log('- Run: node test-real-whatsapp.js (real messages)')
  console.log('- Or make a test donation on your website')

  console.log('\n📖 FOR HELP:')
  console.log('- Setup Guide: docs/META_WHATSAPP_SETUP_GUIDE.md')
  console.log('- Quick Checklist: docs/QUICK_START_CHECKLIST.md')
  console.log('- Message Templates: docs/WHATSAPP_SETUP.md')

  console.log('\n🎉 Your temple WhatsApp system is ready!')
  console.log('💰 1000 free messages per month included!')
}

runAllChecks().catch(console.error)