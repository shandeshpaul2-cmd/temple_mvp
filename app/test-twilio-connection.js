/**
 * Simple Twilio Connection Test Script
 * Tests if Twilio service is working correctly
 */

require('dotenv').config({ path: '.env.local' });

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

console.log('🔍 Testing Twilio Service Connection...\n');
console.log('━'.repeat(50));

// Check if credentials are configured
console.log('📋 Checking Twilio Configuration:');
console.log(`   Account SID: ${TWILIO_ACCOUNT_SID ? '✓ Configured' : '✗ Missing'}`);
console.log(`   Auth Token: ${TWILIO_AUTH_TOKEN ? '✓ Configured' : '✗ Missing'}`);
console.log(`   WhatsApp Number: ${TWILIO_WHATSAPP_NUMBER || '✗ Missing'}`);
console.log('━'.repeat(50));

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
  console.error('\n❌ Error: Twilio credentials are not configured properly');
  process.exit(1);
}

async function testTwilioConnection() {
  try {
    console.log('\n🔄 Testing Twilio API Connection...');

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}.json`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Twilio API Connection: SUCCESS');
      console.log('\n📊 Account Information:');
      console.log(`   Account SID: ${data.sid}`);
      console.log(`   Account Status: ${data.status}`);
      console.log(`   Account Type: ${data.type}`);
      console.log(`   Date Created: ${new Date(data.date_created).toLocaleDateString()}`);

      return true;
    } else {
      const errorData = await response.json();
      console.error('❌ Twilio API Connection: FAILED');
      console.error('Error:', errorData);
      return false;
    }
  } catch (error) {
    console.error('❌ Twilio API Connection: FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

async function checkWhatsAppService() {
  try {
    console.log('\n🔄 Checking WhatsApp Messaging Service...');

    // Check incoming phone numbers
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/IncomingPhoneNumbers.json`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ WhatsApp Service Check: SUCCESS');
      console.log(`   Total Phone Numbers: ${data.incoming_phone_numbers.length}`);

      if (data.incoming_phone_numbers.length > 0) {
        console.log('\n📱 Phone Numbers:');
        data.incoming_phone_numbers.forEach((phone, index) => {
          console.log(`   ${index + 1}. ${phone.phone_number} - ${phone.friendly_name}`);
        });
      }

      return true;
    } else {
      console.error('❌ WhatsApp Service Check: FAILED');
      return false;
    }
  } catch (error) {
    console.error('❌ WhatsApp Service Check: FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('\n🚀 Starting Twilio Service Tests...\n');

  const connectionSuccess = await testTwilioConnection();

  if (connectionSuccess) {
    await checkWhatsAppService();
  }

  console.log('\n' + '━'.repeat(50));
  console.log('\n✨ Test completed!\n');
}

main().catch(console.error);
