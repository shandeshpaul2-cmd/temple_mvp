// Final test for donation template with PDF certificate
const http = require('http');

const testData = {
  paymentType: 'donation',
  amount: 2100,
  items: [{
    name: 'Special Donation',
    description: 'Temple Renovation',
    price: 2100
  }],
  userInfo: {
    fullName: 'Final Test Devotee',
    phoneNumber: '+919945594845',
    email: 'final@test.com'
  }
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 8010,
  path: '/api/payments',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🎯 Final Donation Template Test');
console.log('=====================================');
console.log('📝 Test Data:');
console.log(JSON.stringify(testData, null, 2));
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
      console.log('\n🎉 Donation template test completed!');
      console.log('📱 Expected WhatsApp Messages:');
      console.log('  1. Admin Notification: "New Donation Received"');
      console.log('  2. Donor Receipt: "Donation Receipt" with PDF certificate');
      console.log('  3. Admin Copy: Copy of donor receipt');
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