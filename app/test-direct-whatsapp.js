/**
 * Direct WhatsApp test using current configuration
 */

require('dotenv').config({ path: '.env.local' });

console.log('🧪 Direct WhatsApp Test');
console.log('======================');

// Load current configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const testMode = process.env.WHATSAPP_TEST_MODE;

console.log('📋 Configuration:');
console.log('Account SID:', accountSid ? accountSid.substring(0, 10) + '...' : 'MISSING');
console.log('Auth Token:', authToken ? 'Set (hidden)' : 'MISSING');
console.log('WhatsApp Number:', fromNumber || 'MISSING');
console.log('Test Mode:', testMode === 'true' ? 'ENABLED' : 'DISABLED');

if (!accountSid || !authToken || !fromNumber) {
  console.error('❌ Missing required configuration');
  process.exit(1);
}

const twilio = require('twilio');
const client = twilio(accountSid, authToken);

async function testWhatsAppSending() {
  try {
    console.log('\n📱 Testing WhatsApp message sending...');

    const testMessage = `🧪 Test Message from Temple Management System
This is a test to verify WhatsApp is working properly.
Timestamp: ${new Date().toLocaleString()}

If you receive this, WhatsApp is working! 🎉`;

    const toNumber = '+917760118171'; // Your admin number
    const fromWhatsApp = `whatsapp:${fromNumber}`;
    const toWhatsApp = `whatsapp:${toNumber}`;

    console.log('📤 Sending message...');
    console.log('From:', fromWhatsApp);
    console.log('To:', toWhatsApp);
    console.log('Message:', testMessage.substring(0, 50) + '...');

    const message = await client.messages.create({
      body: testMessage,
      from: fromWhatsApp,
      to: toWhatsApp
    });

    console.log('✅ Message sent successfully!');
    console.log('Message SID:', message.sid);
    console.log('Status:', message.status);
    console.log('To:', message.to);
    console.log('From:', message.from);

    // Check message status after a delay
    setTimeout(async () => {
      try {
        const updatedMessage = await client.messages(message.sid).fetch();
        console.log('Updated status:', updatedMessage.status);

        if (updatedMessage.status === 'delivered' || updatedMessage.status === 'read') {
          console.log('🎉 WhatsApp is working perfectly!');
        } else if (updatedMessage.status === 'failed') {
          console.log('❌ Message failed - check WhatsApp sandbox setup');
          console.log('Error details:', updatedMessage.errorMessage);
        } else {
          console.log('⏳ Message status:', updatedMessage.status);
        }
      } catch (statusError) {
        console.log('Could not check message status:', statusError.message);
      }
    }, 5000);

    return true;

  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error.message);
    console.error('Error Code:', error.code);
    console.error('Status:', error.status);

    if (error.status === 401) {
      console.error('\n🔧 Authentication failed:');
      console.error('1. Check if Account SID is correct');
      console.error('2. Check if Auth Token is correct');
      console.error('3. Verify Twilio account is active');
    } else if (error.code === 21614) {
      console.error('\n🔧 WhatsApp Sandbox Error:');
      console.error('1. The recipient number is not connected to the WhatsApp sandbox');
      console.error('2. Send "join <your-sandbox-keyword>" to the Twilio WhatsApp number');
      console.error('3. Or configure your own WhatsApp Business number');
    } else if (error.code === 21612) {
      console.error('\n🔧 WhatsApp Account Error:');
      console.error('1. WhatsApp is not enabled for this Twilio account');
      console.error('2. Upgrade to a paid Twilio account');
      console.error('3. Configure WhatsApp Business Profile');
    }

    return false;
  }
}

async function testAccountInfo() {
  try {
    console.log('\n🔍 Testing Twilio account access...');
    const account = await client.api.accounts(accountSid).fetch();
    console.log('✅ Account access successful');
    console.log('Account Name:', account.friendlyName);
    console.log('Account Status:', account.status);
    console.log('Account Type:', account.type);

    // Check if WhatsApp-capable numbers exist
    console.log('\n📱 Checking WhatsApp numbers...');
    const numbers = await client.incomingPhoneNumbers.list();

    const whatsappNumbers = numbers.filter(num =>
      num.capabilities && num.capabilities.whatsapp
    );

    if (whatsappNumbers.length > 0) {
      console.log('✅ Found WhatsApp-capable number:', whatsappNumbers[0].phoneNumber);
    } else {
      console.log('⚠️  No WhatsApp-capable numbers found');
      console.log('The sandbox number +14155238886 should still work for testing');
    }

    return true;
  } catch (error) {
    console.error('❌ Error accessing account:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting direct WhatsApp tests...\n');

  const accountTest = await testAccountInfo();
  if (!accountTest) {
    console.log('❌ Account test failed - stopping here');
    return;
  }

  const whatsappTest = await testWhatsAppSending();

  console.log('\n📊 Test Results:');
  console.log('Account Access:', accountTest ? '✅ Working' : '❌ Failed');
  console.log('WhatsApp Sending:', whatsappTest ? '✅ Working' : '❌ Failed');

  if (whatsappTest) {
    console.log('\n🎉 WhatsApp is configured and working!');
    console.log('You should receive a test message shortly.');
  } else {
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Verify your phone number is connected to WhatsApp sandbox');
    console.log('2. Send "join <keyword>" to +14155238886');
    console.log('3. Check Twilio Console for WhatsApp setup');
    console.log('4. Verify account has WhatsApp capabilities');
  }
}

runTests().catch(console.error);