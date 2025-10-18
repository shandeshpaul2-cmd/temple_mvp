# Meta WhatsApp Business API Setup - Step by Step Guide

This guide will help you get all the requirements for WhatsApp Business API **completely free**.

## Prerequisites
- Gmail/Email account
- Smartphone with WhatsApp
- 15-20 minutes of time
- No credit card required

## Step 1: Create Meta Business Account (Free)

### 1.1 Go to Meta Business Suite
1. Open browser and go to: https://business.facebook.com/
2. Click **"Create Account"** or login with existing Facebook account

### 1.2 Fill Business Details
Fill these details exactly:

```
Business Name: Shri Raghavendra Swamy Brundavana Sannidhi
Business Category: Religious Organization
Business Email: your-email@gmail.com
Business Phone: +919945594845
Address: 9/2, Damodar Modaliar Road, Ulsoor, Bangalore - 560008
Website: Skip for now (optional)
```

### 1.3 Verify Business
1. **Phone Verification:** You'll receive a 6-digit code on +919945594845
2. **Email Verification:** Click the verification link in your email
3. **Business Details:** Upload temple registration if available (optional)

## Step 2: Add WhatsApp to Business Account (Free)

### 2.1 Navigate to WhatsApp
1. In Meta Business Suite, find **"WhatsApp"** in the left menu
2. Click **"Get Started"** or **"Add WhatsApp"**

### 2.2 Phone Number Setup
You have 3 options for phone number:

**Option A: Use Existing Number (Recommended for testing)**
- Use your current number: +919945594845
- You can still use it for personal WhatsApp
- Business messages will be separate

**Option B: Get New Business Number**
- Request a new number from Meta (may have cost)
- Better for business separation

**Option C: Use Test Number**
- Meta sometimes provides test numbers
- Limited functionality but good for testing

### 2.3 Phone Number Verification
1. **Download WhatsApp Business App** from Play Store/App Store
2. **Verify your number** with the 6-digit code
3. **Set up business profile** in the app

## Step 3: Get API Credentials (Free)

### 3.1 Access WhatsApp Business API
1. In Meta Business Suite, go to **WhatsApp → Settings**
2. Click on **"API Setup"** or **"WhatsApp Business API"**

### 3.2 Generate Access Token
1. Look for **"Access Tokens"** section
2. Click **"Generate New Token"**
3. Choose **"App"** type
4. Copy the token (starts with "EAAJZC...")

⚠️ **Important:** Copy and save this token immediately. You won't see it again!

### 3.3 Get Phone Number ID
1. In the same WhatsApp settings page
2. Look for your phone number
3. Copy the **Phone Number ID** (usually 9-10 digits)

### 3.4 Create Webhook Verify Token
1. In webhook settings, you'll need a verify token
2. Create a simple token like: `temple_whatsapp_2024_secure`
3. Save this for later

## Step 4: Configure in Your Application

### 4.1 Update Environment Variables
Create/update `.env.local` file:

```bash
# WhatsApp Business API Credentials
WHATSAPP_ACCESS_TOKEN="EAAJZC...your_token_here"
WHATSAPP_PHONE_NUMBER_ID="123456789"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="temple_whatsapp_2024_secure"

# Test Mode (optional - set to false for real messages)
WHATSAPP_TEST_MODE="false"
```

### 4.2 Test Your Setup
Run the test script to verify everything works:

```bash
node quick-test.js
```

## Step 5: Setup Webhook (Free)

### 5.1 Deploy Your Application
Your application needs to be accessible from the internet:
- **Development:** Use ngrok (free) or localtunnel
- **Production:** Use your domain (temple website)

### 5.2 Configure Webhook in Meta
1. Go to WhatsApp Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/whatsapp/webhook`
3. Add verify token: `temple_whatsapp_2024_secure`
4. Subscribe to: `messages` and `message_delivery`

### 5.3 Verify Webhook
1. Click **"Verify"** in Meta settings
2. Check your server logs for successful verification

## Step 6: Create Message Templates (Free)

### 6.1 Required Templates for Your Temple

**Template 1: Donation Receipt**
```
Name: donation_receipt
Category: UTILITY
Language: English

Body:
Dear {{1}},

Thank you for your donation to Shri Raghavendra Swamy Brundavana Sannidhi!

Receipt Details:
• Receipt Number: {{2}}
• Amount: {{3}}
• Type: {{4}}
• Purpose: {{5}}
• Date: {{6}}

Your donation certificate is attached.

For queries: {{7}}

Service to Humanity is Service to God
```

**Template 2: Pooja Booking Confirmation**
```
Name: pooja_booking_confirmation
Category: UTILITY
Language: English

Body:
Dear {{1}},

Your pooja booking has been confirmed!

Booking Details:
• Receipt Number: {{2}}
• Pooja: {{3}}
• Amount: {{4}}
{{5}}
{{6}}

Our staff will contact you within 24 hours.

For queries: {{7}}
```

### 6.2 Submit Templates for Approval
1. Go to WhatsApp Business Manager → Message Templates
2. Click **"Create Template"**
3. Fill in the exact details from above
4. Submit for approval (usually 1-2 hours)

## Step 7: Test Real Messages (Free Tier)

### 7.1 Your Free Quota
- **1000 conversations per month** (completely free)
- 1 conversation = all messages to 1 user in 24 hours
- Perfect for temple with moderate activity

### 7.2 Send Test Messages
You can now test real messages:

1. **Test via API call:**
```javascript
// This will now send real WhatsApp messages
const result = await whatsappService.sendDonationReceiptToDonor({
  donorName: "Your Name",
  donorPhone: "+91xxxxxxxxxx", // Your phone number
  amount: 1100,
  donationType: "General Donation",
  donationPurpose: "Temple Maintenance",
  receiptNumber: "DN-TEST-0001",
  paymentId: "pay_test_123",
  date: new Date().toISOString()
})
```

2. **Test via donation process:**
   - Make a small donation (₹10-₹50) on your website
   - Check WhatsApp for the receipt

## Step 8: Monitor and Maintain

### 8.1 Check Message Status
1. In Meta Business Suite, go to **WhatsApp → Messaging**
2. See sent messages, delivery status, and errors
3. Monitor your free tier usage

### 8.2 Common Issues and Solutions

**Issue: "Template not approved"**
- Solution: Wait 1-2 hours, templates need manual review
- Alternative: Send regular text messages for testing

**Issue: "Phone number not verified"**
- Solution: Complete phone verification in WhatsApp Business App

**Issue: "Rate limit exceeded"**
- Solution: You've hit the 1000 message limit, wait for next month

**Issue: "Webhook not working"**
- Solution: Check ngrok/domain is accessible and token matches

## What You Get (Free)

✅ **1000 WhatsApp messages per month**
✅ **Automated receipt delivery**
✅ **Admin notifications**
✅ **Message delivery tracking**
✅ **Professional temple communication**
✅ **No setup cost**
✅ **No monthly fee**

## Next Steps After Setup

1. **Test thoroughly** with small amounts
2. **Monitor message delivery** in Meta Business Suite
3. **Customize message templates** if needed
4. **Set up email backup** for users not on WhatsApp
5. **Scale up** when you exceed 1000 messages/month

## Support Resources

- **Meta WhatsApp Documentation:** https://developers.facebook.com/docs/whatsapp
- **Message Template Guide:** https://developers.facebook.com/docs/whatsapp/message-templates
- **Rate Limits:** https://developers.facebook.com/docs/whatsapp/limits

## Troubleshooting Checklist

If messages aren't working:

1. ✅ Meta Business Account created and verified
2. ✅ WhatsApp added to business account
3. ✅ Phone number verified in WhatsApp Business App
4. ✅ Access token generated and saved
5. ✅ Phone Number ID copied
6. ✅ Webhook URL configured and verified
7. ✅ Message templates submitted and approved
8. ✅ Environment variables set correctly
9. ✅ Application deployed and accessible
10. ✅ Test with your own phone number first

Once you complete these steps, you'll have a fully functional WhatsApp Business API integration for your temple - completely free up to 1000 messages per month!