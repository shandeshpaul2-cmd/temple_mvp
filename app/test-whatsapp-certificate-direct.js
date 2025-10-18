/**
 * Direct test script for WhatsApp certificate attachment functionality
 * This tests the certificate generation and WhatsApp sending directly
 */

const testCertificateAndWhatsApp = async () => {
  const baseUrl = 'http://localhost:3010'; // Adjust port as needed

  const donationDetails = {
    donorName: 'Test Donor',
    donorPhone: '+919876543210', // Replace with your test number
    amount: 500,
    donationType: 'General Donation',
    donationPurpose: 'Temple Maintenance',
    receiptNumber: 'TEST-2024-001',
    paymentId: 'pay_test123456',
    date: new Date().toISOString()
  };

  try {
    console.log('🧪 Testing certificate generation...');

    // Step 1: Generate certificate
    const certificateResponse = await fetch(`${baseUrl}/api/certificates/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        donor_name: donationDetails.donorName,
        amount: donationDetails.amount,
        donation_id: donationDetails.receiptNumber,
        donation_date: new Date().toISOString().split('T')[0],
        reason_text: 'for their valued contribution to the temple'
      })
    });

    const certificateResult = await certificateResponse.json();

    if (certificateResponse.ok && certificateResult.success) {
      console.log('✅ Certificate generated successfully!');
      console.log('Filename:', certificateResult.filename);
      console.log('Download URL:', certificateResult.download_url);

      const certificateUrl = `${baseUrl}${certificateResult.download_url}`;
      console.log('Full certificate URL:', certificateUrl);

      console.log('\n📱 Testing WhatsApp with certificate attachment...');

      // Step 2: Test WhatsApp with certificate attachment
      const whatsappResponse = await fetch(`${baseUrl}/api/test/whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: donationDetails.donorPhone,
          message: '📎 *Your Donation Certificate is attached!* 🙏\n\nThank you for your generous donation to Shri Raghavendra Swamy Brundavana Sannidhi!',
          mediaUrl: certificateUrl
        })
      });

      const whatsappResult = await whatsappResponse.json();

      if (whatsappResponse.ok) {
        console.log('✅ WhatsApp message with certificate sent successfully!');
        console.log('WhatsApp Response:', whatsappResult);
      } else {
        console.error('❌ WhatsApp test failed:', whatsappResult);
      }

    } else {
      console.error('❌ Certificate generation failed:', certificateResult);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Run the test
testCertificateAndWhatsApp();