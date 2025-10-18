// Quick test with Twilio Sandbox number
const http = require('http');

const testData = {
  paymentType: 'donation',
  amount: 511,
  items: [{
    name: 'Test Donation',
    description: 'Sandbox Testing',
    price: 511
  }],
  userInfo: {
    fullName: 'Sandbox Test User',
    phoneNumber: '+919945594845',
    email: 'sandbox@test.com'
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

console.log('🧪 Testing Twilio Sandbox Number');
console.log('=====================================');
console.log('📞 Sandbox Number: +14155238886');
console.log('📱 Test Phone: +919945594845');
console.log('💰 Amount: ₹511 (special number for testing)');
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
        console.log('\n🎉 Sandbox test successful!');
        console.log('📱 Check WhatsApp for messages:');
        console.log('  • Join Twilio Sandbox: send "join <keyword>"');
        console.log('  • Then you should receive donation messages');
        console.log('\n📝 Instructions:');
        console.log('1. Open WhatsApp');
        console.log('2. Send "join temple-mvp" to +14155238886');
        console.log('3. Wait for confirmation message');
        console.log('4. You should then receive test messages');
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