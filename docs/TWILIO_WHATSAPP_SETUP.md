# Twilio WhatsApp API Setup Guide (No Meta Account Required)

This guide helps you set up WhatsApp messaging using Twilio instead of Meta. You can send automated messages to multiple recipients (devotees + admins) without any Meta account.

## Benefits of Twilio WhatsApp

✅ **No Meta account required**
✅ **Setup in 10 minutes**
✅ **Send to unlimited recipients**
✅ **Automated messaging**
✅ **PDF attachment support**
✅ **Reliable delivery tracking**

## Pricing

- **$5/month** for Twilio WhatsApp number
- **~$0.0058 per message** (about ₹0.48)
- **Free trial credits** available
- **Pay-as-you-go** billing

## Step 1: Create Twilio Account (2 minutes)

1. **Go to Twilio**: https://www.twilio.com/try-twilio
2. **Sign up** with your email
3. **Verify your email** (check inbox)
4. **Verify your phone number** (+919945594845)

## Step 2: Get WhatsApp Number (3 minutes)

1. **Login to Twilio Console**: https://console.twilio.com/
2. **Go to Messaging → Try it out → Send a WhatsApp message**
3. **Get a WhatsApp number**:
   - Click "Get Started"
   - Choose a number (or use suggested one)
   - Complete the setup

## Step 3: Get API Credentials (1 minute)

In Twilio Console, find:

1. **Account SID**: Console → Dashboard → Account SID
2. **Auth Token**: Console → Dashboard → Auth Token (click "show")
3. **WhatsApp Number**: The number you just got (starts with +1415...)

## Step 4: Configure Environment (2 minutes)

Create/update `.env.local` file:

```bash
# Twilio WhatsApp API
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_WHATSAPP_NUMBER="+14155238886"

# Test Mode (set to "false" for real messages)
WHATSAPP_TEST_MODE="false"
```

## Step 5: Test Your Setup (2 minutes)

Create a test script:

```javascript
// test-twilio.js
require('dotenv').config({ path: '.env.local' })
const { twilioWhatsAppService } = require('./lib/whatsapp-twilio.ts')

async function testTwilioWhatsApp() {
  console.log('🧪 Testing Twilio WhatsApp...')

  // Test 1: Send to yourself
  const result1 = await twilioWhatsAppService.sendDonationReceiptToDonor({
    donorName: "Your Name",
    donorPhone: "+91xxxxxxxxxx", // Your WhatsApp number
    amount: 1100,
    donationType: "General Donation",
    donationPurpose: "Temple Maintenance",
    receiptNumber: "DN-TEST-0001",
    paymentId: "pay_test_123",
    date: new Date().toISOString()
  })

  console.log('✅ Test 1 result:', result1)

  // Test 2: Send to multiple recipients (you + admin)
  const result2 = await twilioWhatsAppService.sendCustomMessage(
    ["+91xxxxxxxxxx", "+917760118171"], // Your number + admin
    "🙏 Test message from temple WhatsApp system!"
  )

  console.log('✅ Test 2 results:', result2)
}

testTwilioWhatsApp().catch(console.error)
```

Run the test:
```bash
node test-twilio.js
```

## Step 6: Update Your Application

Update your donation and booking flows to use Twilio:

```javascript
// In your API routes, replace the WhatsApp service import
import { twilioWhatsAppService } from '@/lib/whatsapp-twilio'

// Then use it the same way:
await twilioWhatsAppService.sendDonationReceiptToDonor(details, pdfUrl, true) // true = also send to admin
await twilioWhatsAppService.sendDonationNotificationToAdmin(details)
```

## Key Features for Multiple Recipients

### 1. **Simultaneous Messaging**
```javascript
// Send to both devotee and admin simultaneously
await twilioWhatsAppService.sendDonationReceiptToDonor(details, pdfUrl, true)
```

### 2. **Custom Recipient Lists**
```javascript
// Send to multiple people
const recipients = ["+919876543210", "+919876543211", "+917760118171"]
await twilioWhatsAppService.sendCustomMessage(recipients, "Your message")
```

### 3. **Media Attachments**
```javascript
// Send PDF receipts
await twilioWhatsAppService.sendDonationReceiptToDonor(details, "https://your-domain.com/receipt.pdf")
```

### 4. **Admin Notifications**
```javascript
// Always notify admin
await twilioWhatsAppService.sendDonationNotificationToAdmin(details)
await twilioWhatsAppService.sendPoojaBookingNotificationToAdmin(details)
```

## WhatsApp Template Requirements

Twilio also requires message templates for business messaging:

### Required Templates:

1. **Donation Receipt**
   ```
   Dear {{1}},

   Thank you for your donation to {{2}}!

   Receipt Details:
   • Number: {{3}}
   • Amount: {{4}}
   • Type: {{5}}

   Your receipt is attached.
   ```

2. **Pooja Booking Confirmation**
   ```
   Dear {{1}},

   Your pooja booking at {{2}} is confirmed!

   Details:
   • Pooja: {{3}}
   • Amount: {{4}}
   • Date: {{5}}

   We'll contact you to confirm timing.
   ```

**Template Approval Process:**
1. Submit templates in Twilio Console
2. Wait 1-2 hours for approval
3. Start sending messages

## Comparison: Twilio vs Meta WhatsApp

| Feature | Twilio | Meta WhatsApp |
|---------|--------|---------------|
| **Account Required** | Twilio only | Meta Business |
| **Setup Time** | 10 minutes | 30 minutes |
| **Cost** | $5/mo + $0.0058/msg | 1000 free/mo, then ~$0.02/msg |
| **Multiple Recipients** | ✅ Unlimited | ✅ Unlimited |
| **Template Approval** | Required | Required |
| **Media Support** | ✅ PDF, images | ✅ PDF, images |
| **Test Mode** | ✅ Built-in | ✅ Built-in |

## Troubleshooting

### Common Issues:

1. **"Authentication failed"**
   - Check Account SID and Auth Token
   - Ensure no extra spaces in credentials

2. **"Number not enabled for WhatsApp"**
   - Complete WhatsApp number setup in Twilio Console
   - Wait 5-10 minutes after activation

3. **"Template not approved"**
   - Submit message templates in Twilio Console
   - Use regular text messages for testing

4. **"Message not delivered"**
   - Check recipient phone format (+91xxxxxxxxxx)
   - Verify recipient has WhatsApp

### Debug Mode:

Enable debug logging:
```bash
DEBUG=twilio node your-script.js
```

## Production Checklist

Before going live:

- [ ] Twilio account created and verified
- [ ] WhatsApp number enabled
- [ ] Message templates approved
- [ ] Test messages sent successfully
- [ ] Production environment variables set
- [ ] Error handling implemented
- [ ] Monitoring/logging set up

## Quick Start Summary

1. **Sign up**: https://www.twilio.com/try-twilio (2 min)
2. **Get WhatsApp number**: In Twilio Console (3 min)
3. **Copy credentials**: Account SID, Auth Token, WhatsApp number (1 min)
4. **Configure environment**: Update .env.local (2 min)
5. **Test**: Run test script (2 min)
6. **Go live**: Update your application to use Twilio service

**Total Time**: 10 minutes
**Total Cost**: $5/month + message charges
**No Meta Account Required!** 🎉

## Support

- **Twilio Docs**: https://www.twilio.com/docs/whatsapp
- **Twilio Support**: help@twilio.com
- **Your Implementation**: Check console logs for errors

You're all set to send automated WhatsApp messages to multiple recipients using Twilio!