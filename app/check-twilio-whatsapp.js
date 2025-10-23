/**
 * Check Twilio WhatsApp configuration
 */

require('dotenv').config({ path: '.env.local' });

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

async function checkWhatsAppConfig() {
  try {
    console.log('🔍 Checking Twilio WhatsApp Configuration...\n');

    // Check account details
    const accountResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}.json`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`
        }
      }
    );

    if (!accountResponse.ok) {
      console.error('❌ Failed to authenticate with new token');
      const error = await accountResponse.json();
      console.error('Error:', error);
      return;
    }

    const accountData = await accountResponse.json();
    console.log('✅ Authentication successful with new token');
    console.log(`   Account Status: ${accountData.status}`);
    console.log(`   Account Type: ${accountData.type}\n`);

    // Check incoming phone numbers
    const numbersResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/IncomingPhoneNumbers.json`,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`
        }
      }
    );

    const numbersData = await numbersResponse.json();
    console.log('📱 Incoming Phone Numbers:');
    if (numbersData.incoming_phone_numbers.length > 0) {
      numbersData.incoming_phone_numbers.forEach((phone, i) => {
        console.log(`   ${i + 1}. ${phone.phone_number}`);
        console.log(`      Friendly Name: ${phone.friendly_name}`);
        console.log(`      Capabilities: ${JSON.stringify(phone.capabilities)}`);
      });
    } else {
      console.log('   No phone numbers found');
    }

    // Check if WhatsApp sandbox is available
    console.log('\n💡 Recommendation:');
    console.log('   For Twilio trial accounts, use the WhatsApp Sandbox:');
    console.log('   - Sandbox Number: whatsapp:+14155238886');
    console.log('   - You need to join the sandbox by sending a code from your WhatsApp');
    console.log('   - Visit: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkWhatsAppConfig();
