/**
 * Simple WhatsApp test using Twilio API directly
 */

require('dotenv').config({ path: '.env.local' });

const twilio = require('twilio');

console.log('🧪 Simple WhatsApp Test');
console.log('=======================');

// Test configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const testMode = process.env.WHATSAPP_TEST_MODE;

console.log('Account SID:', accountSid ? '✅ Set' : '❌ Missing');
console.log('Auth Token:', authToken ? '✅ Set' : '❌ Missing');
console.log('WhatsApp Number:', fromNumber ? '✅ Set' : '❌ Missing');
console.log('Test Mode:', testMode === 'true' ? '✅ Enabled' : '❌ Disabled');

// Test message template
function generateCertificateMessage(donorName, amount, receiptNumber) {
  return `📎 *Your 80G Donation Certificate is ready!*

Dear ${donorName},

🙏 Thank you for your generous donation of ₹${amount.toLocaleString('en-IN')} to Shri Raghavendra Swamy Brundavana Sannidhi!

📱 *Tap to Download Certificate:*
👇 *One-Tap Link:* http://192.168.0.175:3010/certificate/${receiptNumber}

📱 *Important:* Make sure your phone is connected to the same WiFi network as the computer for instant access!

🧾 *Receipt Details:*
• Receipt Number: ${receiptNumber}
• Date: ${new Date().toLocaleDateString('en-IN')}

🙏 *May Sri Raghavendra Swamy bless you and your family!*

For any queries, please contact: +918310408797

---
*Shri Raghavendra Swamy Brundavana Sannidhi*
*Service to Humanity is Service to God*`;
}

async function testWhatsAppMessage() {
  try {
    console.log('\n📱 Testing WhatsApp message generation...');

    const testDonation = {
      donorName: 'Test Devotee',
      amount: 1000,
      receiptNumber: 'DN-TEST-123'
    };

    const message = generateCertificateMessage(
      testDonation.donorName,
      testDonation.amount,
      testDonation.receiptNumber
    );

    console.log('✅ Message generated successfully');
    console.log('Message length:', message.length, 'characters');
    console.log('\n📄 Message preview:');
    console.log('─'.repeat(50));
    console.log(message.substring(0, 200) + '...');
    console.log('─'.repeat(50));

    if (testMode === 'true') {
      console.log('\n🧪 TEST MODE - Message would be sent to: +917760118171');
      console.log('✅ Test mode working - no actual message sent');
      return true;
    }

    // Try to send actual message if not in test mode
    if (accountSid && authToken && fromNumber) {
      console.log('\n📤 Attempting to send actual WhatsApp message...');

      const client = twilio(accountSid, authToken);
      const toNumber = 'whatsapp:+917760118171';
      const fromWhatsApp = `whatsapp:${fromNumber}`;

      const twilioMessage = await client.messages.create({
        body: message,
        from: fromWhatsApp,
        to: toNumber
      });

      console.log('✅ Message sent successfully!');
      console.log('Message SID:', twilioMessage.sid);
      console.log('Status:', twilioMessage.status);
      return true;
    }

  } catch (error) {
    console.error('❌ Error testing WhatsApp:', error.message);

    if (error.status === 401) {
      console.error('🔧 Authentication failed - check Twilio credentials');
    } else if (error.code === 21614) {
      console.error('🔧 WhatsApp number not configured - check Twilio WhatsApp sandbox');
    }

    return false;
  }
}

async function testCertificateUrl() {
  try {
    console.log('\n🌐 Testing certificate URL generation...');

    const receiptNumber = 'DN-20251018-1854';
    const certificateUrl = `http://192.168.0.175:3010/certificate/${receiptNumber}`;

    console.log('✅ Certificate URL:', certificateUrl);
    console.log('✅ URL format: http://IP:PORT/certificate/RECEIPT_NUMBER');

    // Test URL accessibility
    const http = require('http');
    const { URL } = require('url');

    return new Promise((resolve) => {
      const req = http.request(certificateUrl, (res) => {
        console.log('✅ Certificate URL is accessible (HTTP status:', res.statusCode, ')');
        resolve(true);
      });

      req.on('error', () => {
        console.log('⚠️  Certificate URL not accessible (server may not be running)');
        resolve(false);
      });

      req.setTimeout(5000, () => {
        console.log('⚠️  Certificate URL test timed out');
        req.abort();
        resolve(false);
      });

      req.end();
    });

  } catch (error) {
    console.error('❌ Error testing certificate URL:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting WhatsApp functionality tests...\n');

  const messageTest = await testWhatsAppMessage();
  const urlTest = await testCertificateUrl();

  console.log('\n✅ Tests completed!');
  console.log('\n📊 Results Summary:');
  console.log('Message Generation:', messageTest ? '✅ Working' : '❌ Failed');
  console.log('Certificate URL:', urlTest ? '✅ Working' : '❌ Failed');

  if (testMode === 'true') {
    console.log('\n📋 Current Configuration:');
    console.log('- WhatsApp Test Mode: ✅ ENABLED');
    console.log('- No actual messages will be sent');
    console.log('- Message formatting and links are tested');

    console.log('\n🔧 To enable live WhatsApp sending:');
    console.log('1. Verify Twilio credentials are correct and active');
    console.log('2. Configure WhatsApp sandbox in Twilio Console');
    console.log('3. Set WHATSAPP_TEST_MODE="false" in .env.local');
  }

  console.log('\n📱 Phone-Friendly Features:');
  console.log('- ✅ One-tap certificate links');
  console.log('- ✅ Local network IP for WiFi access');
  console.log('- ✅ Mobile-optimized message formatting');
  console.log('- ✅ Clear instructions for users');
}

runTests().catch(console.error);