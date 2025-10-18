// Test script to trigger a donation and verify WhatsApp messages
const http = require('http');

// Test donation data
const testData = {
  paymentType: 'donation', // This was missing
  amount: 1100,
  items: [{
    name: 'General Donation',
    description: 'Temple Maintenance',
    price: 1100
  }],
  userInfo: {
    fullName: 'Test Devotee',
    phoneNumber: '+919945594845', // Temple phone for testing
    email: 'test@example.com'
  }
};

// Make HTTP request to payment API
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

console.log('🧪 Making test donation to trigger WhatsApp messages...');
console.log('📱 Test Data:', JSON.stringify(testData, null, 2));

const req = http.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);

  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(responseData);
      console.log('✅ Donation Response:', JSON.stringify(response, null, 2));
      console.log('\n📱 WhatsApp messages should be sent to:');
      console.log('📞 +919945594845 (Test Devotee)');
      console.log('📞 +917760118171 (Admin)');
      console.log('\n🎉 Check WhatsApp for messages!');
    } catch (error) {
      console.error('❌ Error parsing response:', error);
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error making test donation:', error);
});

req.write(postData);
req.end();

console.log('⏳ Waiting for response...');