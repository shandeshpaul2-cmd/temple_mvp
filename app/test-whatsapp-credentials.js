/**
 * Test Twilio WhatsApp credentials
 */

const twilio = require('twilio');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

console.log('🧪 Testing Twilio WhatsApp Credentials...');
console.log('=====================================');

// Check if credentials are set
if (!accountSid || !authToken || !fromNumber) {
  console.error('❌ Missing credentials in .env.local:');
  console.log('   TWILIO_ACCOUNT_SID:', accountSid ? '✅ Set' : '❌ Missing');
  console.log('   TWILIO_AUTH_TOKEN:', authToken ? '✅ Set' : '❌ Missing');
  console.log('   TWILIO_WHATSAPP_NUMBER:', fromNumber ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

console.log('✅ All credentials found in environment variables');
console.log('   Account SID:', accountSid);
console.log('   From Number:', fromNumber);

// Initialize Twilio client
const client = twilio(accountSid, authToken);

async function testCredentials() {
  try {
    console.log('\n🔍 Testing Twilio API connection...');

    // Test API access by fetching account info
    const account = await client.api.accounts(accountSid).fetch();
    console.log('✅ Twilio API connection successful');
    console.log('   Account Status:', account.status);
    console.log('   Account Friendly Name:', account.friendlyName);

    // Check WhatsApp capability
    console.log('\n📱 Checking WhatsApp configuration...');

    // Try to fetch available phone numbers to verify WhatsApp capability
    const incomingPhoneNumbers = await client.incomingPhoneNumbers.list({ limit: 1 });

    if (incomingPhoneNumbers.length > 0) {
      const phone = incomingPhoneNumbers[0];
      console.log('✅ Phone number found:', phone.phoneNumber);
      console.log('   Capabilities:', phone.capabilities);

      if (phone.capabilities && phone.capabilities.whatsapp) {
        console.log('✅ WhatsApp capability confirmed');
      } else {
        console.log('⚠️  WhatsApp capability not found - check Twilio Console setup');
      }
    } else {
      console.log('⚠️  No phone numbers found - make sure WhatsApp is configured in Twilio Console');
    }

    console.log('\n🎉 Credentials test completed successfully!');

  } catch (error) {
    console.error('❌ Error testing Twilio credentials:', error.message);

    if (error.status === 401) {
      console.error('   Authentication failed - check Account SID and Auth Token');
    } else if (error.status === 404) {
      console.error('   Account not found - verify Account SID');
    } else {
      console.error('   Status Code:', error.status);
      console.error('   More Info:', error.moreInfo);
    }

    process.exit(1);
  }
}

// Test sending a test message (optional - requires actual WhatsApp setup)
async function testWhatsAppMessage() {
  try {
    console.log('\n📤 Testing WhatsApp message send...');

    const testToNumber = '+917760118171'; // Admin number
    const testMessage = '🧪 Test message from Temple Management System - Twilio credentials working! 🎉';

    const message = await client.messages.create({
      body: testMessage,
      from: `whatsapp:${fromNumber}`,
      to: `whatsapp:${testToNumber}`
    });

    console.log('✅ Test WhatsApp message sent successfully!');
    console.log('   Message SID:', message.sid);
    console.log('   Status:', message.status);
    console.log('   To:', testToNumber);

  } catch (error) {
    console.error('❌ Error sending test WhatsApp message:', error.message);
    console.error('   Note: This may fail if WhatsApp is not fully configured in Twilio Console');
    console.error('   or if the recipient number is not connected to the sandbox');
  }
}

// Run the tests
async function runTests() {
  await testCredentials();

  // Uncomment the line below to test sending an actual WhatsApp message
  // await testWhatsAppMessage();

  console.log('\n✅ All tests completed!');
}

runTests().catch(console.error);