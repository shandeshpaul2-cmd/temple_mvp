/**
 * Test script to verify WhatsApp certificate attachment functionality for donations
 */

const testDonationWithCertificate = async () => {
  const baseUrl = 'http://localhost:3010'; // Adjust port as needed

  const donationDetails = {
    donorName: 'Test Donor',
    donorPhone: '+919876543210', // Replace with your test number
    amount: 500,
    donationType: 'General Donation',
    donationPurpose: 'Temple Maintenance',
    receiptNumber: 'TEST-2024-001',
    paymentId: 'pay_test123456',
    date: new Date().toISOString(),
    razorpay_order_id: 'order_test123456',
    razorpay_payment_id: 'pay_test123456',
    razorpay_signature: 'test_signature'
  };

  try {
    console.log('🧪 Testing donation payment verification with certificate attachment...');

    const response = await fetch(`${baseUrl}/api/donations/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id: donationDetails.razorpay_order_id,
        razorpay_payment_id: donationDetails.razorpay_payment_id,
        razorpay_signature: donationDetails.razorpay_signature,
        donationDetails
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Test completed successfully!');
      console.log('Response:', result);
      console.log('\n📱 Check WhatsApp for:');
      console.log('1. Admin notification about the donation');
      console.log('2. Donation receipt message');
      console.log('3. Certificate attachment message');
    } else {
      console.error('❌ Test failed:', result);
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Run the test
testDonationWithCertificate();