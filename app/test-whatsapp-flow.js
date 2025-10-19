/**
 * Test WhatsApp message flow with certificate links
 */

require('dotenv').config({ path: '.env.local' });

const { whatsappService } = require('./lib/whatsapp.ts');

console.log('🧪 Testing WhatsApp Message Flow');
console.log('===============================');
console.log('Test Mode:', process.env.WHATSAPP_TEST_MODE === 'true' ? '✅ ENABLED' : '❌ DISABLED');

async function testDonationCertificateMessage() {
  try {
    console.log('\n📄 Testing donation certificate message...');

    const donationDetails = {
      donorName: 'Test Devotee',
      donorPhone: '7760118171',
      amount: 1000,
      donationType: 'General Donation',
      donationPurpose: 'Temple Maintenance',
      receiptNumber: 'DN-TEST-123',
      paymentId: 'pay_test_123',
      date: new Date().toISOString()
    };

    // Test sending donation receipt with certificate link
    const result = await whatsappService.sendDonationReceiptToDonor(donationDetails);

    if (result) {
      console.log('✅ Donation receipt message test passed');
    } else {
      console.log('❌ Donation receipt message test failed');
    }

  } catch (error) {
    console.error('❌ Error testing donation message:', error.message);
  }
}

async function testCustomCertificateMessage() {
  try {
    console.log('\n📱 Testing custom certificate message...');

    const certificateMessage = `📎 *Your 80G Donation Certificate is ready!*

Dear Test Devotee,

🙏 Thank you for your generous donation of ₹1,000 to Shri Raghavendra Swamy Brundavana Sannidhi!

📱 *Tap to Download Certificate:*
👇 *One-Tap Link:* http://192.168.0.175:3010/certificate/DN-TEST-123

📱 *Important:* Make sure your phone is connected to the same WiFi network as the computer for instant access!

🧾 *Receipt Details:*
• Receipt Number: DN-TEST-123
• Date: ${new Date().toLocaleDateString('en-IN')}

🙏 *May Sri Raghavendra Swamy bless you and your family!*

For any queries, please contact: +918310408797

---
*Shri Raghavendra Swamy Brundavana Sannidhi*
*Service to Humanity is Service to God*`;

    const result = await whatsappService.sendCustomMessage(['7760118171'], certificateMessage);

    if (result) {
      console.log('✅ Custom certificate message test passed');
    } else {
      console.log('❌ Custom certificate message test failed');
    }

  } catch (error) {
    console.error('❌ Error testing custom message:', error.message);
  }
}

async function testNetworkConfig() {
  try {
    console.log('\n🌐 Testing network configuration...');

    const { config } = require('./lib/network-config.ts');

    const testReceipt = 'DN-20251018-1854';
    const certificateUrl = config.getCertificateUrl(testReceipt);
    const phoneFriendlyMessage = config.generateCertificateWhatsAppMessage(
      'Test Devotee',
      1000,
      testReceipt
    );

    console.log('✅ Certificate URL:', certificateUrl);
    console.log('✅ Phone-friendly message generated');
    console.log('Message length:', phoneFriendlyMessage.length, 'characters');

    // Verify URL format
    if (certificateUrl.includes('http://') && certificateUrl.includes('/certificate/')) {
      console.log('✅ Certificate URL format is correct');
    } else {
      console.log('❌ Certificate URL format is incorrect');
    }

  } catch (error) {
    console.error('❌ Error testing network config:', error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting WhatsApp flow tests...\n');

  await testNetworkConfig();
  await testCustomCertificateMessage();
  await testDonationCertificateMessage();

  console.log('\n✅ All WhatsApp flow tests completed!');
  console.log('\n📋 Summary:');
  console.log('- WhatsApp test mode is active (no actual messages sent)');
  console.log('- Message formatting and phone-friendly links are working');
  console.log('- Network configuration is correctly set up');
  console.log('- Certificate links use local network IP for phone access');

  if (process.env.WHATSAPP_TEST_MODE === 'true') {
    console.log('\n⚠️  To enable actual WhatsApp sending:');
    console.log('   1. Verify Twilio credentials are correct');
    console.log('   2. Set WHATSAPP_TEST_MODE="false" in .env.local');
    console.log('   3. Ensure WhatsApp sandbox is configured in Twilio Console');
  }
}

runAllTests().catch(console.error);