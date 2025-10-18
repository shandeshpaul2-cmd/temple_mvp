// Test with new admin phone number
const http = require('http');

const testData = {
  paymentType: 'donation',
  amount: 999,
  items: [{
    name: 'Test with New Admin Number',
    description: 'Testing Admin Notification',
    price: 999
  }],
  userInfo: {
    fullName: 'Test Customer',
    phoneNumber: '9876543210', // Customer phone
    email: 'test@customer.com'
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

console.log('📞 Testing New Admin Number: 8310408797');
console.log('=====================================');
console.log('👤 Customer: Test Customer');
console.log('📱 Customer Phone: 9876543210 (+919876543210)');
console.log('📞 Admin Phone: +918310408797 (NEW)');
console.log('💰 Amount: ₹999');
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
        console.log('  1. Admin (+918310408797): "New Donation Received"');
        console.log('  2. Customer (+919876543210): "Donation Receipt"');
        console.log('  3. Admin (+918310408797): Copy of receipt');
        console.log('\n📋 Check WhatsApp on:');
        console.log('  • Admin: +918310408797');
        console.log('  • Customer: +919876543210');
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