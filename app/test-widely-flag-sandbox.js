// Test Twilio Sandbox with correct keyword
const twilio = require('twilio');

const accountSid = 'AC1ae8eed78b540e8b8a6e40809f3984cc';
const authToken = 'd81a51094078bfbdd2001bfcb61cf174';
const client = twilio(accountSid, authToken);

async function testWidelyFlagSandbox() {
  console.log('🏴‍☠️ Testing "join widely-flag" Sandbox Keyword');
  console.log('============================================');
  console.log('📞 From: +14155238886 (Twilio Sandbox)');
  console.log('📱 To: +919945594845 (Test Number)');
  console.log('🔑 Keyword: join widely-flag');
  console.log('============================================');

  try {
    const message = await client.messages.create({
      body: '🏴‍☠️ Testing Twilio Sandbox\n\nThis message is being sent using the "widely-flag" keyword.\n\nIf you receive this, the sandbox is working perfectly!\n\nYou can now test your temple app for real WhatsApp messages!',
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+919945594845'
    });

    console.log('✅ Message sent successfully!');
    console.log('📋 Message SID:', message.sid);
    console.log('📊 Status:', message.status);
    console.log('📱 To:', message.to);
    console.log('📞 From:', message.from);

    console.log('\n🎯 Success! Sandbox is working with "widely-flag"');
    console.log('📝 Next Steps:');
    console.log('1. You should receive this WhatsApp message');
    console.log('2. Then test your temple app at http://localhost:3010');
    console.log('3. Customers will receive WhatsApp receipts');

  } catch (error) {
    console.error('❌ Error sending message:', error.message);
    console.error('📋 Full error:', error);

    if (error.code === 21612) {
      console.log('\n🔍 Phone not in sandbox');
      console.log('💡 Solution: Send "join widely-flag" to +14155238886 first');
    } else if (error.code === 63007) {
      console.log('\n🔍 WhatsApp Channel not active');
      console.log('💡 Solution: The sandbox keyword might be different');
      console.log('📱 Try sending "join widely-flag" now');
    }
  }
}

testWidelyFlagSandbox();