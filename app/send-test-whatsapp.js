async function sendTestMessage() {
  const accountSid = 'AC1ae8eed78b540e8b8a6e40809f3984cc';
  const authToken = '7803e3cb76fe87f343f4d0d8a7cf692f';
  const whatsappNumber = '+14155238886';
  const recipientPhone = '+917760118171';

  const message = `Test Message from Temple Management System

Hello! This is a test message from the Temple Management System.

- WhatsApp integration is working correctly
- Certificate generation is active
- Server running on external IP

Shri Raghavendra Swamy Brundavana Sannidhi

Sent at: ${new Date().toLocaleString('en-IN')}`;

  try {
    console.log('Sending WhatsApp message to:', recipientPhone);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'To': `whatsapp:${recipientPhone}`,
          'From': `whatsapp:${whatsappNumber}`,
          'Body': message
        })
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ WhatsApp message sent successfully!');
      console.log('Message SID:', data.sid);
      console.log('Status:', data.status);
      console.log('\nCheck your WhatsApp at', recipientPhone);
    } else {
      const errorData = await response.json();
      console.error('\n❌ Failed to send message:');
      console.error('Error code:', errorData.code);
      console.error('Error message:', errorData.message);
    }
  } catch (error) {
    console.error('\n❌ Error sending message:', error.message);
  }
}

sendTestMessage();
