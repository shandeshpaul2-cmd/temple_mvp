// Test with your actual Twilio number
const twilio = require('twilio');

const accountSid = 'AC1ae8eed78b540e8b8a6e40809f3984cc';
const authToken = 'd81a51094078bfbdd2001bfcb61cf174';
const client = twilio(accountSid, authToken);

async function testActualNumber() {
  console.log('🔍 Testing Your Actual Twilio Number');
  console.log('=====================================');
  console.log('📞 From: +12764962591 (Your Twilio Number)');
  console.log('📱 To: +919945594845 (Admin)');
  console.log('=====================================');

  try {
    const message = await client.messages.create({
      body: '🧪 Test from Your Twilio Number\n\nThis is a test message using your actual Twilio number +12764962591.\n\nIf you receive this, your number is working for WhatsApp!',
      from: 'whatsapp:+12764962591',
      to: 'whatsapp:+919945594845'
    });

    console.log('✅ Message sent successfully!');
    console.log('📋 Message SID:', message.sid);
    console.log('📊 Status:', message.status);
    console.log('📱 To:', message.to);
    console.log('📞 From:', message.from);

    console.log('\n📝 Next Steps:');
    console.log('1. If you received this message, your number works!');
    console.log('2. Try making a donation at: http://localhost:3010/donate');
    console.log('3. Use your phone number in the form');
    console.log('4. You should receive WhatsApp messages');

  } catch (error) {
    console.error('❌ Error sending message:', error.message);
    console.error('📋 Full error:', error);

    if (error.code === 63007) {
      console.log('\n🔍 Error 63007: WhatsApp Channel not found');
      console.log('💡 Solution: You need to set up WhatsApp Business Profile');
      console.log('📱 Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn');
      console.log('📋 Follow the steps to activate WhatsApp for your number');
    }
  }
}

testActualNumber();