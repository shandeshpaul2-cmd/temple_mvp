// Test WhatsApp templates in simulation mode
const http = require('http');

const testCases = [
  {
    name: 'Donation Template Test',
    paymentType: 'donation',
    amount: 501,
    items: [{
      name: 'General Donation',
      description: 'Temple Maintenance',
      price: 501
    }],
    userInfo: {
      fullName: 'Test Devotee',
      phoneNumber: '9945594845',
      email: 'devotee@temple.org'
    }
  },
  {
    name: 'Pooja Booking Template Test',
    paymentType: 'pooja',
    amount: 500,
    items: [{
      name: 'Nithya Pooja',
      description: 'Daily Pooja Seva',
      price: 500
    }],
    userInfo: {
      fullName: 'Test Devotee Pooja',
      phoneNumber: '9945594845',
      email: 'pooja@temple.org'
    },
    serviceDetails: {
      preferredDate: '2025-11-01',
      preferredTime: '10:00 AM'
    }
  }
];

async function testAllTemplates() {
  console.log('🎭 WhatsApp Template Simulation Mode');
  console.log('=====================================');
  console.log('📞 Test Mode: ENABLED (Messages logged to console)');
  console.log('📱 Recipient: +919945594845 (Admin)');
  console.log('📱 Recipient: +919945594845 (User)');
  console.log('=====================================');

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n🧪 Test ${i + 1}: ${testCase.name}`);
    console.log('─'.repeat(50));

    const postData = JSON.stringify(testCase);

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

    await new Promise((resolve) => {
      const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(responseData);
            if (response.success) {
              console.log(`✅ Success! Receipt: ${response.receiptNumber}`);
            } else {
              console.log(`❌ Error: ${response.error}`);
            }
          } catch (error) {
            console.error('❌ Parse Error:', error);
          }
          resolve();
        });
      });

      req.on('error', (error) => {
        console.error('❌ Request Error:', error);
        resolve();
      });

      req.write(postData);
      req.end();
    });

    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(50));
  console.log('🎯 Simulation Complete!');
  console.log('='.repeat(50));
  console.log('📱 Check server console above for WhatsApp message previews');
  console.log('🔧 To enable real messages: Set WHATSAPP_TEST_MODE="false"');
  console.log('📋 After sandbox setup, all templates will work automatically');
}

testAllTemplates();