# 🚀 Quick Start Checklist for WhatsApp Business API

## 🔗 Direct Links You Need

1. **Meta Business Suite**: https://business.facebook.com/
2. **WhatsApp Business App**:
   - Android: https://play.google.com/store/apps/details?id=com.whatsapp.w4b
   - iPhone: https://apps.apple.com/us/app/whatsapp-business/id1386723228
3. **Developer Portal**: https://developers.facebook.com/apps

## ✅ Step-by-Step Checklist

### Step 1: Create Meta Business Account (5 minutes)
- [ ] Go to https://business.facebook.com/
- [ ] Click "Create Account"
- [ ] Fill details:
  ```
  Business Name: Shri Raghavendra Swamy Brundavana Sannidhi
  Category: Religious Organization
  Email: your-email@gmail.com
  Phone: +919945594845
  ```
- [ ] Verify email (check inbox)
- [ ] Verify phone (enter 6-digit code)

### Step 2: Add WhatsApp (5 minutes)
- [ ] In Meta Business, click "WhatsApp" on left
- [ ] Click "Get Started"
- [ ] Choose "Use existing number": +919945594845
- [ ] Download WhatsApp Business App
- [ ] Verify number in the app
- [ ] Complete business profile setup

### Step 3: Get API Credentials (5 minutes)
- [ ] Go to WhatsApp → Settings in Meta Business
- [ ] Click "API Setup" or "Advanced"
- [ ] Generate Access Token (copy it immediately)
- [ ] Copy Phone Number ID
- [ ] Create webhook verify token: `temple_whatsapp_2024_secure`

### Step 4: Configure Your App (2 minutes)
- [ ] Create `.env.local` file:
  ```bash
  WHATSAPP_ACCESS_TOKEN="EAAJZC...paste_token_here"
  WHATSAPP_PHONE_NUMBER_ID="123456789"
  WHATSAPP_WEBHOOK_VERIFY_TOKEN="temple_whatsapp_2024_secure"
  WHATSAPP_TEST_MODE="false"
  ```
- [ ] Restart your application

### Step 5: Setup Webhook (5 minutes)
- [ ] Deploy app or use ngrok for testing:
  ```bash
  # Install ngrok
  npm install -g ngrok

  # Start your app
  npm run dev

  # In another terminal, expose port 3000
  ngrok http 3000
  ```
- [ ] Copy ngrok URL (https://xxxx.ngrok.io)
- [ ] In Meta WhatsApp settings, add webhook:
  ```
  Webhook URL: https://xxxx.ngrok.io/api/whatsapp/webhook
  Verify Token: temple_whatsapp_2024_secure
  ```
- [ ] Subscribe to: `messages`, `message_delivery`
- [ ] Click "Verify"

### Step 6: Test Messages (2 minutes)
- [ ] Run test command:
  ```bash
  node quick-test.js
  ```
- [ ] Check console for message previews
- [ ] Now test real message (send to your own number)

## 🎯 Quick Test (1 Minute)

Copy this code and run it:

```javascript
// test-real-whatsapp.js
const { whatsappService } = require('./lib/whatsapp.ts')

async function testRealMessage() {
  const result = await whatsappService.sendDonationReceiptToDonor({
    donorName: "Your Name",
    donorPhone: "+91xxxxxxxxxx", // Your WhatsApp number
    amount: 1100,
    donationType: "General Donation",
    donationPurpose: "Temple Maintenance",
    receiptNumber: "DN-TEST-0001",
    paymentId: "pay_test_123",
    date: new Date().toISOString()
  })

  console.log('Message sent:', result)
}

testRealMessage()
```

## 💰 Your Free Benefits

✅ **1000 messages/month** (completely free)
✅ **No setup cost**
✅ **No credit card required**
✅ **Professional temple communication**
✅ **Automated receipts**
✅ **Admin notifications**
✅ **Message delivery tracking**

## 🆘 Quick Help

**If you get stuck at any step:**

1. **Can't find WhatsApp in Meta Business?**
   - Try: Business Settings → WhatsApp → Get Started
   - Or: https://business.facebook.com/whatsapp/

2. **Access Token not working?**
   - Regenerate new token
   - Make sure there are no extra spaces
   - Check token starts with "EAAJZC..."

3. **Webhook verification failing?**
   - Check ngrok is running and accessible
   - Verify token matches exactly
   - Check your app is running on port 3000

4. **Messages not sending?**
   - Check templates are approved
   - Verify phone number format (+91xxxxxxxxxx)
   - Check you haven't exceeded 1000 message limit

## 📞 Need Human Help?

If you need help with any specific step:

1. **Screenshot the error**
2. **Note which step you're on**
3. **Contact:**
   - Email: temple-tech-support@gmail.com
   - Phone: 9945594845

## 🚀 After Setup

Once you complete the checklist:

1. ✅ Your temple will send automatic WhatsApp receipts
2. ✅ Admins get instant notifications
3. ✅ Devotees get professional confirmations
4. ✅ You can track all message delivery
5. ✅ Scale to 1000 messages/month free

**Time Required:** 20-30 minutes total
**Cost:** ₹0 (completely free)
**Skills Needed:** Basic computer skills

You're all set! 🎉