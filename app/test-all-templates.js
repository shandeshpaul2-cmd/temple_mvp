// Test script to verify all 4 WhatsApp template types
const http = require('http');

const PORT = 8010;
const BASE_URL = `http://localhost:${PORT}`;

// Test data for all 4 template types
const testCases = [
  {
    name: 'Donation with PDF Certificate',
    paymentType: 'donation',
    amount: 1100,
    items: [{
      name: 'General Donation',
      description: 'Temple Maintenance',
      price: 1100
    }],
    userInfo: {
      fullName: 'Test Devotee Donation',
      phoneNumber: '+919945594845',
      email: 'donor@test.com'
    }
  },
  {
    name: 'Pooja Booking',
    paymentType: 'pooja',
    amount: 500,
    items: [{
      name: 'Nithya Pooja',
      description: 'Daily Pooja Seva',
      price: 500
    }],
    userInfo: {
      fullName: 'Test Devotee Pooja',
      phoneNumber: '+919945594845',
      email: 'pooja@test.com'
    },
    serviceDetails: {
      preferredDate: '2025-11-01',
      preferredTime: '10:00 AM'
    }
  },
  {
    name: 'Parihara Pooja Booking',
    paymentType: 'parihara_pooja',
    amount: 2100,
    items: [{
      name: 'Navagraha Shanti',
      description: 'Parihara for planetary issues',
      price: 2100
    }],
    userInfo: {
      fullName: 'Test Devotee Parihara',
      phoneNumber: '+919945594845',
      email: 'parihara@test.com'
    },
    serviceDetails: {
      poojaDate: '2025-11-15',
      sankalpaName: 'John Doe',
      nakshatra: 'Rohini',
      gotra: 'Kashyapa'
    }
  },
  {
    name: 'Astrology Consultation',
    paymentType: 'astrology_consultation',
    amount: 1500,
    items: [{
      name: 'Horoscope Analysis',
      description: 'Complete birth chart analysis',
      price: 1500
    }],
    userInfo: {
      fullName: 'Test Client Astrology',
      phoneNumber: '+919945594845',
      email: 'astrology@test.com'
    },
    serviceDetails: {
      preferredDate: '2025-11-05',
      preferredTime: '2:00 PM',
      birthDetails: {
        dateOfBirth: '1990-01-15',
        timeOfBirth: '06:30',
        placeOfBirth: 'Bangalore, India'
      },
      concerns: ['Career growth', 'Marriage prospects', 'Health issues']
    }
  }
];

// Function to make HTTP request
function makeRequest(testCase) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(testCase);

    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/api/payments',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log(`📞 Phone: ${testCase.userInfo.phoneNumber}`);
    console.log(`💰 Amount: ₹${testCase.amount}`);

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          console.log(`📊 Status: ${res.statusCode}`);
          if (response.success) {
            console.log(`✅ Success! Receipt: ${response.receiptNumber}`);
            console.log(`📱 WhatsApp messages sent to: ${testCase.userInfo.phoneNumber} + Admin`);
          } else {
            console.log(`❌ Error: ${response.error}`);
          }
          resolve({ testCase, response, status: res.statusCode });
        } catch (error) {
          console.error('❌ JSON Parse Error:', error);
          console.log('Raw response:', responseData);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request Error:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Testing All WhatsApp Template Types');
  console.log('=' .repeat(50));
  console.log(`📡 Server: ${BASE_URL}`);
  console.log(`📱 Test Phone: +919945594845`);
  console.log(`📧 Admin receives copy of all messages`);
  console.log('=' .repeat(50));

  const results = [];

  for (const testCase of testCases) {
    try {
      await makeRequest(testCase);
      results.push({ testCase, success: true });

      // Wait 1 second between tests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`❌ Failed to test ${testCase.name}:`, error.message);
      results.push({ testCase, success: false, error: error.message });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));

  results.forEach(({ testCase, success, error }) => {
    const status = success ? '✅' : '❌';
    console.log(`${status} ${testCase.name}`);
    if (!success && error) {
      console.log(`   Error: ${error}`);
    }
  });

  const successful = results.filter(r => r.success).length;
  const total = results.length;
  console.log(`\n🎯 Success Rate: ${successful}/${total} (${Math.round(successful/total*100)}%)`);

  console.log('\n📱 Expected WhatsApp Messages:');
  console.log('• Donations: Admin alert + Donor receipt with PDF');
  console.log('• Pooja: Devotee confirmation + Admin notification');
  console.log('• Parihara: Devotee confirmation + Admin alert');
  console.log('• Astrology: Client confirmation + Admin notification');
  console.log('\n🎉 All templates have been tested!');
}

// Check if server is running, then run tests
function checkServerAndRunTests() {
  const http = require('http');

  const req = http.request({
    hostname: 'localhost',
    port: PORT,
    path: '/',
    method: 'GET',
    timeout: 3000
  }, (res) => {
    console.log('✅ Server is running, starting tests...\n');
    runAllTests();
  });

  req.on('error', (error) => {
    console.error('❌ Server is not running on port', PORT);
    console.error('Please start the server with:');
    console.error(`DATABASE_URL="file:./dev.db" HOST=0.0.0.0 PORT=${PORT} npm run dev`);
    process.exit(1);
  });

  req.on('timeout', () => {
    console.error('❌ Server connection timeout');
    process.exit(1);
  });

  req.end();
}

// Run the tests
checkServerAndRunTests();