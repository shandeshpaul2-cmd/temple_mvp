// Test with different user phone number
const http = require('http');

const testData = {
  paymentType: 'donation',
  amount: 1001,
  items: [{
    name: 'Test Donation for User',
    description: 'Testing User Phone Number',
    price: 1001
  }],
  userInfo: {
    fullName: 'Test User Different',
    phoneNumber: '9999999999', // Different phone number
    email: 'user@test.com'
  }
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3010,
  path: '/api/payments',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing User Phone Number Fix');
console.log('=====================================');
console.log('👤 User: Test User Different');
console.log('📞 User Phone: 9999999999 (+919999999999)');
console.log('📱 Admin Phone: +919945594845 (updated)');
console.log('💰 Amount: ₹1001');
console.log('=====================================');

const req = http.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);

  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(responseData);
      console.log('✅ Response:', JSON.stringify(response, null, 2));

      if (response.success) {
        console.log('\n🎉 Test completed!');
        console.log('📱 Expected WhatsApp Messages:');
        console.log('  1. Admin (+919945594845): "New Donation Received"');
        console.log('  2. User (+919999999999): "Donation Receipt"');
        console.log('  3. Admin (+919945594845): Copy of receipt');
        console.log('\n📝 Check WhatsApp on both numbers:');
        console.log('  • Admin: +919945594845');
        console.log('  • User: +919999999999');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error);
});

req.write(postData);
req.end();