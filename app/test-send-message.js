/**
 * Test script to send a WhatsApp message via Twilio
 */

require('dotenv').config({ path: '.env.local' });

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

async function sendTestMessage() {
  try {
    console.log('🔄 Sending test WhatsApp message...\n');

    // Format phone number to E.164 format
    const phoneNumber = '+917760118171';

    const message = `🙏 Namaste! 🙏

This is a test message from Shri Raghavendra Swamy Brundavana Sannidhi Temple Management System.

✅ Your Twilio WhatsApp service is working correctly!

📱 Sent at: ${new Date().toLocaleString('en-IN', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

May Sri Raghavendra Swamy bless you! 🙏`;

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'To': `whatsapp:${phoneNumber}`,
          'From': `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
          'Body': message
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Message sent successfully!');
      console.log(`   Message SID: ${data.sid}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   To: ${data.to}`);
      console.log(`   From: ${data.from}`);
      console.log('\n📱 Check your WhatsApp at +917760118171\n');
    } else {
      console.error('❌ Failed to send message');
      console.error('Error:', data);

      if (data.code === 21211) {
        console.log('\n⚠️  Note: The phone number might not be verified in your Twilio trial account.');
        console.log('   To send messages, you need to verify the recipient number in Twilio console.');
      }
    }
  } catch (error) {
    console.error('❌ Error sending message:', error.message);
  }
}

sendTestMessage();
