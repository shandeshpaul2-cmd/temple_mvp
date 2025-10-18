/**
 * Final test script for WhatsApp certificate attachment functionality
 * Uses the existing WhatsApp test infrastructure
 */

const testWhatsAppCertificate = async () => {
  const baseUrl = 'http://localhost:3010';

  // Test data for donation with certificate
  const donationWithCertificate = {
    donorName: 'Test Donor',
    donorPhone: '+919876543210', // Replace with your test number
    amount: 500,
    donationType: 'General Donation',
    donationPurpose: 'Temple Maintenance',
    receiptNumber: 'TEST-2024-001',
    paymentId: 'pay_test123456',
    date: new Date().toISOString(),
    certificateUrl: 'http://localhost:3010/api/certificates/download/certificate_TEST-2024-001_2025-10-18T09-21-40.pdf'
  };

  try {
    console.log('🧪 Testing WhatsApp donation receipt with certificate attachment...');

    const response = await fetch(`${baseUrl}/api/test/whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testType: 'donation',
        testData: {
          ...donationWithCertificate,
          attachmentMessage: '📎 *Your Donation Certificate is attached!* 🙏\n\nThank you for your generous contribution to Shri Raghavendra Swamy Brundavana Sannidhi!'
        }
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ WhatsApp test with certificate completed successfully!');
      console.log('Test Result:', result);
      console.log('\n📱 Certificate attachment test preview:');
      console.log('- Message: Donation receipt with certificate attachment');
      console.log('- Media URL:', donationWithCertificate.certificateUrl);
      console.log('- Recipient:', donationWithCertificate.donorPhone);

      console.log('\n💡 In production, this will:');
      console.log('1. Generate certificate PDF automatically');
      console.log('2. Send WhatsApp message with PDF attachment');
      console.log('3. Include receipt details and blessings');

    } else {
      console.error('❌ WhatsApp test failed:', result);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Test the actual certificate generation as well
const testCertificateGeneration = async () => {
  const baseUrl = 'http://localhost:3010';

  console.log('\n🧪 Testing certificate generation separately...');

  const certificateResponse = await fetch(`${baseUrl}/api/certificates/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      donor_name: 'Test Donor',
      amount: 500,
      donation_id: 'TEST-2024-001',
      donation_date: new Date().toISOString().split('T')[0],
      reason_text: 'for their valued contribution to the temple'
    })
  });

  const certificateResult = await certificateResponse.json();

  if (certificateResponse.ok && certificateResult.success) {
    console.log('✅ Certificate generation working!');
    console.log('📄 Certificate URL:', `${baseUrl}${certificateResult.download_url}`);
  } else {
    console.error('❌ Certificate generation failed:', certificateResult);
  }
};

// Run both tests
(async () => {
  await testCertificateGeneration();
  await testWhatsAppCertificate();
})();