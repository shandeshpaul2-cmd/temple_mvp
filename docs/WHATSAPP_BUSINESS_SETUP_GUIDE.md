# 📱 WhatsApp Business Setup Guide for +918310408799

## ✅ **Current Status**
- [x] Business account created
- [x] Phone number: +918310408799
- [ ] WhatsApp Business verification
- [ ] Twilio integration
- [ ] Production deployment

---

## 🎯 **Step-by-Step Setup Process**

### **Step 1: Complete Meta Business Suite Setup** ⏱️ 15 minutes

#### 1.1 **Access Meta Business Suite**
```
Go to: https://business.facebook.com
Login with your business account credentials
```

#### 1.2 **Verify Your Business Details**
```
1. Click on Settings > Business Settings
2. Add your temple information:
   - Business Name: "Shri Raghavendra Swamy Brundavana Sannidhi"
   - Address: "9/2, Damodar Modaliar Road, Ulsoor, Bangalore - 560008"
   - Phone: +918310408799
   - Email: contact@temple.org
   - Website: (if you have one)
3. Upload required documents:
   - Temple registration certificate
   - Address proof
   - ID proof
```

#### 1.3 **Add WhatsApp Number**
```
1. In Meta Business Suite, go to "WhatsApp"
2. Click "Add Phone Number"
3. Select "Use existing number"
4. Enter: +918310408799
5. Verify via SMS/Call
```

### **Step 2: Apply for WhatsApp Business API** ⏱️ 20 minutes

#### 2.1 **Start WhatsApp API Application**
```
1. In Meta Business Suite > WhatsApp > API Setup
2. Select "Twilio" as your Business Solution Provider (BSP)
3. Fill in application details:
   - Business category: "Religious Organization"
   - Description: "Traditional temple services, pooja bookings, and spiritual guidance"
   - Website: https://your-temple-website.com (if available)
```

#### 2.2 **Submit Required Information**
```
Prepare these details:
- Temple registration certificate
- Address verification document
- Business description (50+ words)
- Sample message templates for approval
```

**Sample Message Templates for Approval:**
```
Template 1 - Donation Receipt:
"Dear {{1}}, thank you for your donation of ₹{{2}} to {{3}}. Receipt No: {{4}}. Your support helps us continue our spiritual services."

Template 2 - Pooja Booking:
"Dear {{1}}, your pooja booking for {{2}} has been confirmed. Date: {{3}}, Receipt No: {{4}}. We will contact you to confirm timing."

Template 3 - General Information:
"Thank you for contacting {{1}}. Our team will respond within 24 hours. For urgent matters, call +918310408799."
```

### **Step 3: Set Up Twilio WhatsApp Integration** ⏱️ 30 minutes

#### 3.1 **Configure Twilio Account**
```
1. Go to: https://www.twilio.com/console
2. Login to your Twilio account
3. Go to Messaging > Senders > WhatsApp Senders
4. Click "Learn more about the WhatsApp Business API"
```

#### 3.2 **Connect Your WhatsApp Number**
```
1. In Twilio, click "Add a WhatsApp Sender"
2. Select "Connect a WhatsApp Number"
3. Choose "India" as country
4. Enter your number: +918310408799
5. Follow Twilio's verification process
```

#### 3.3 **Get Twilio Credentials**
```
1. In Twilio Console > Settings > General
2. Note down:
   - Account SID: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   - Auth Token: your_auth_token_here
3. Your WhatsApp number will be: +918310408799
```

### **Step 4: Configure Webhook** ⏱️ 15 minutes

#### 4.1 **Set Up Webhook URL**
```
1. In Twilio Console > Messaging > Senders > WhatsApp Senders
2. Select your number: +918310408799
3. Set "Webhook URL" to: https://your-domain.com/api/whatsapp/webhook
4. For testing, use: https://your-ngrok-url.ngrok.io/api/whatsapp/webhook
```

#### 4.2 **Test Webhook**
```
Use ngrok for local testing:
1. Install ngrok: npm install -g ngrok
2. Run: ngrok http 3010
3. Copy the https URL from ngrok
4. Use this URL in Twilio webhook settings
```

---

## 🛠️ **Implementation Steps**

### **Step 5: Update Environment Variables**
```bash
# Create .env.production file
cp .env.production.example .env.production

# Update with your credentials:
TWILIO_ACCOUNT_SID="AC_your_actual_account_sid"
TWILIO_AUTH_TOKEN="your_actual_auth_token"
TWILIO_WHATSAPP_NUMBER="+918310408799"
WHATSAPP_TEST_MODE="false"
WHATSAPP_WEBHOOK_URL="https://your-domain.com/api/whatsapp/webhook"
```

### **Step 6: Test Local Setup**
```bash
# 1. Start your development server
DATABASE_URL="file:./dev.db" npm run dev

# 2. Run production tests
node test-production-whatsapp.js

# 3. Test WhatsApp messaging
curl -X POST http://localhost:3010/api/donations/verify-payment-production \
  -H "Content-Type: application/json" \
  -d '{
    "razorpay_order_id": "test_order",
    "razorpay_payment_id": "test_payment",
    "razorpay_signature": "test_signature",
    "donationDetails": {
      "donorName": "Test User",
      "donorPhone": "+919876543210",
      "amount": 1080,
      "donationType": "General Donation",
      "receiptNumber": "TEST-123",
      "paymentId": "pay_test_123",
      "date": "2025-10-18"
    }
  }'
```

---

## 📋 **Timeline & Expectations**

### **Application Processing Times:**
- **Meta Business Verification**: 1-3 business days
- **WhatsApp API Approval**: 2-5 business days
- **Twilio Activation**: 1-2 business days (after Meta approval)

### **Total Timeline: 4-10 business days**

---

## ⚠️ **Common Issues & Solutions**

### **Issue 1: Business Verification Rejection**
**Solution**:
- Ensure all documents are clear and valid
- Use temple's official registration certificate
- Double-check business address matches documents

### **Issue 2: WhatsApp API Rejection**
**Solution**:
- Make sure message templates follow WhatsApp guidelines
- Avoid promotional language in templates
- Ensure business category is appropriate

### **Issue 3: Twilio Integration Problems**
**Solution**:
- Verify your Twilio account is upgraded (not trial)
- Check that your number can receive SMS/calls
- Ensure webhook URL is accessible (use ngrok for testing)

---

## 🎯 **Quick Action Checklist**

### **Do Today (30 minutes):**
- [ ] Complete Meta Business Suite information
- [ ] Upload business verification documents
- [ ] Submit WhatsApp API application
- [ ] Start Twilio integration setup

### **Do This Week:**
- [ ] Follow up on application status
- [ ] Set up webhook with ngrok for testing
- [ ] Prepare environment variables
- [ ] Test local implementation

### **When Approved:**
- [ ] Deploy to production
- [ ] Update webhook URL to production domain
- [ ] Run full test suite
- [ ] Launch to users

---

## 📞 **Help & Support**

### **For Business Verification Issues:**
- Meta Business Help: https://www.facebook.com/business/help
- Contact: +918310408799

### **For WhatsApp API Issues:**
- WhatsApp Business API Support: https://developers.facebook.com/docs/whatsapp
- Twilio Support: https://support.twilio.com

### **For Technical Implementation:**
- Check: `/docs/PRODUCTION_WHATSAPP_SETUP.md`
- Test: `node test-production-whatsapp.js`
- Review: `/NEXT_STEPS.md`

---

## 🚀 **Ready to Launch!**

Once you complete these steps, your temple will have:
- ✅ Professional WhatsApp number (+918310408799)
- ✅ Automated donation receipts
- ✅ Certificate PDF attachments
- ✅ Interactive customer support
- ✅ Pooja booking confirmations
- ✅ Analytics and monitoring

**Next Action**: Complete Step 1 (Meta Business Suite setup) today! 🎯