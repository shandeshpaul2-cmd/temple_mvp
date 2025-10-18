// Test that customer receives WhatsApp messages
const http = require('http');

const testData = {
  paymentType: 'donation',
  amount: 251,
  items: [{
    name: 'Customer Test Donation',
    description: 'Testing Customer WhatsApp Receipt',
    price: 251
  }],
  userInfo: {
    fullName: 'Test Customer',
    phoneNumber: '9999999999', // Different from admin phone
    email: 'customer@test.com'
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

console.log('👤 Testing Customer WhatsApp Messages');
console.log('=====================================');
console.log('👤 Customer: Test Customer');
console.log('📱 Customer Phone: 9999999999 (+919999999999)');
console.log('📞 Admin Phone: +919902520105');
console.log('💰 Amount: ₹251');
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
        console.log('  1. Admin (+919902520105): "New Donation Received"');
        console.log('  2. Customer (+919999999999): "Donation Receipt"');
        console.log('  3. Admin (+919902520105): Copy of receipt');
        console.log('\n📋 Check WhatsApp on:');
        console.log('  • Admin: +919902520105');
        console.log('  • Customer: +919999999999');
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