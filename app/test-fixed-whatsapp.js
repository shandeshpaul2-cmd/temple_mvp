// Test the improved WhatsApp integration
const http = require('http');

const testData = {
  paymentType: 'donation',
  amount: 777,
  items: [{
    name: 'Fixed Test Donation',
    description: 'Testing Improved WhatsApp Integration',
    price: 777
  }],
  userInfo: {
    fullName: 'Fixed Test User',
    phoneNumber: '9945594845',
    email: 'fixed@temple.org'
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

console.log('🔧 Testing Improved WhatsApp Integration');
console.log('=====================================');
console.log('📱 Mode: Real WhatsApp messages');
console.log('📞 From: +14155238886 (Twilio Sandbox)');
console.log('📱 To: +919945594845 (Admin + User)');
console.log('💰 Amount: ₹777');
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
        console.log('📱 Check server console for WhatsApp status');
        console.log('📋 Expected behavior:');
        console.log('  • Messages will attempt to send');
        console.log('  • Errors will be logged but won\'t crash');
        console.log('  • Donation process completes regardless');
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