// Test different Twilio sandbox keywords and numbers
const twilio = require('twilio');

const accountSid = 'AC1ae8eed78b540e8b8a6e40809f3984cc';
const authToken = 'd81a51094078bfbdd2001bfcb61cf174';
const client = twilio(accountSid, authToken);

// Different sandbox numbers and keywords to try
const testConfigs = [
  { number: '+14155238886', keyword: 'join two' },
  { number: '+14155238886', keyword: 'join hello' },
  { number: '+14155238886', keyword: 'join demo' },
  { number: '+14155238886', keyword: 'join test' },
  { number: '+14155238886', keyword: 'join quick' }
];

async function testSandboxConfigs() {
  console.log('🔍 Testing Different Sandbox Configurations');
  console.log('=====================================');

  for (let i = 0; i < testConfigs.length; i++) {
    const config = testConfigs[i];
    console.log(`\n🧪 Test ${i + 1}: "${config.keyword}" to ${config.number}`);

    try {
      const message = await client.messages.create({
        body: `🧪 Test ${i + 1}: Testing with keyword "${config.keyword}"\n\nIf you receive this, the sandbox is working with this keyword!`,
        from: `whatsapp:${config.number}`,
        to: 'whatsapp:+919945594845'
      });

      console.log('✅ Message sent!');
      console.log('📋 SID:', message.sid);
      console.log('📊 Status:', message.status);

      // Wait 2 seconds between tests
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.log('❌ Error:', error.message);
      if (error.code === 21612) {
        console.log('🔍 Phone not in sandbox - needs to join first');
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📝 Instructions:');
  console.log('1. If any message succeeded, use that keyword');
  console.log('2. Send the successful keyword to the sandbox number');
  console.log('3. Wait for confirmation from Twilio');
  console.log('4. Then test the temple app');
  console.log('='.repeat(50));
}

testSandboxConfigs();