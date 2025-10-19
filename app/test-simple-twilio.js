/**
 * Simple Twilio credentials test
 */

const twilio = require('twilio');

// Direct credential test
const accountSid = 'AC1ae8eed78b540e8b8a6e40809f3984cc';
const authToken = 'd81a51094078bfbdd2001bfcb61cf174';

console.log('🧪 Direct Twilio Credentials Test');
console.log('================================');
console.log('Account SID:', accountSid);
console.log('Auth Token:', authToken ? '[REDACTED]' : 'MISSING');

if (!accountSid || !authToken) {
  console.error('❌ Missing credentials');
  process.exit(1);
}

const client = twilio(accountSid, authToken);

async function testConnection() {
  try {
    console.log('\n🔍 Testing API connection...');
    const account = await client.api.accounts(accountSid).fetch();
    console.log('✅ Connection successful!');
    console.log('   Account:', account.friendlyName);
    console.log('   Status:', account.status);

    // Test WhatsApp sandbox status
    console.log('\n📱 Checking WhatsApp sandbox...');

    // Try to list services to see if WhatsApp is available
    try {
      const services = await client.messaging.services.list({ limit: 1 });
      console.log('✅ Messaging services available');
    } catch (msgError) {
      console.log('⚠️  Messaging services check failed:', msgError.message);
    }

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('   Code:', error.code);
    console.error('   Status:', error.status);

    if (error.status === 401) {
      console.error('\n🔧 Troubleshooting:');
      console.error('   1. Verify Account SID is correct');
      console.error('   2. Check Auth Token (no extra spaces)');
      console.error('   3. Ensure Twilio account is active');
    }
  }
}

testConnection();