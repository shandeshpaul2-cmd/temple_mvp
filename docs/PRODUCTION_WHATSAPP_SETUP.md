# Production WhatsApp Twilio Setup Guide

## 🚀 Moving from Sandbox to Production

This guide will help you upgrade your WhatsApp integration from Twilio Sandbox to a fully production-ready system.

## 📋 Prerequisites

### 1. Twilio Account Setup
- ✅ Active Twilio account (beyond trial)
- ✅ Verified phone number for your business
- ✅ WhatsApp Business Profile approval

### 2. WhatsApp Business Account
- ✅ Meta Business Account
- ✅ WhatsApp Business API approval
- ✅ Verified business phone number

## 🔧 Step-by-Step Production Setup

### Step 1: Upgrade Twilio Account

1. **Log into your Twilio Console**
2. **Upgrade your account** if still in trial
3. **Add payment method** and verify billing
4. **Purchase a Twilio phone number** (recommended for production)

### Step 2: Enable WhatsApp Business API

1. In Twilio Console, go to **Messaging > Senders > WhatsApp Senders**
2. Click **"Learn more about the WhatsApp Business API"**
3. Follow Meta's WhatsApp Business verification process:
   - Submit business verification documents
   - Verify your phone number
   - Wait for approval (typically 1-3 business days)

### Step 3: Configure WhatsApp Business Profile

Once approved, configure your business profile:

```json
{
  "business_profile": {
    "about": "Shri Raghavendra Swamy Brundavana Sannidhi - Spiritual services and temple management",
    "address": "9/2, Damodar Modaliar Road, Ulsoor, Bangalore - 560008",
    "description": "Traditional temple services, pooja bookings, and spiritual consultations",
    "vertical": "PROFESSIONAL_SERVICES",
    "email": "contact@temple.org",
    "websites": ["https://your-temple-website.com"],
    "profile_picture_url": "https://your-temple-website.com/logo.png"
  }
}
```

### Step 4: Get Production Credentials

Replace sandbox credentials with production ones:

```bash
# Production Environment Variables
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # Your production Account SID
TWILIO_AUTH_TOKEN="your_production_auth_token"       # Your production Auth Token
TWILIO_WHATSAPP_NUMBER="+91XXXXXXXXXX"               # Your verified business WhatsApp number
WHATSAPP_TEST_MODE="false"                           # Disable test mode for production
```

### Step 5: Update Webhook Configuration

Configure your webhook URL for receiving WhatsApp messages:

```
https://your-domain.com/api/whatsapp/webhook
```

## 🛡️ Production Best Practices

### 1. Security & Compliance

**Message Templates**
- Pre-register message templates for templated messages
- Use session messages for user-initiated conversations
- Follow WhatsApp's 24-hour customer service window

**Data Privacy**
- Store user consent for WhatsApp communications
- Implement opt-out/opt-in functionality
- Follow GDPR and local data protection laws

### 2. Rate Limiting & Performance

**Message Limits**
- WhatsApp API: 50 messages per second per phone number
- Implement queue system for bulk messages
- Use exponential backoff for failed messages

**Error Handling**
- Implement proper error handling for API failures
- Log message delivery status
- Monitor for 429 Too Many Requests errors

### 3. Monitoring & Analytics

**Key Metrics to Track**
- Message delivery rate
- Response time
- Error rates
- Customer engagement

**Alerting**
- Set up alerts for API failures
- Monitor webhook health
- Track unusual message patterns

## 📱 Production Message Templates

### Pre-approved Templates Required

1. **Donation Receipt Template**
   ```
   Dear {{1}}, thank you for your donation of ₹{{2}} to {{3}}. Receipt No: {{4}}. Your support helps us continue our spiritual services.
   ```

2. **Pooja Booking Confirmation Template**
   ```
   Dear {{1}}, your pooja booking for {{2}} has been confirmed. Date: {{3}}, Receipt No: {{4}}. We will contact you to confirm the timing.
   ```

3. **Payment Request Template**
   ```
   Dear {{1}}, please complete your payment for {{2}}. Amount: ₹{{3}}. Link: {{4}}. Valid for 24 hours.
   ```

## 🔧 Production Configuration

### Environment Variables

```bash
# Production WhatsApp Configuration
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_production_auth_token"
TWILIO_WHATSAPP_NUMBER="+91XXXXXXXXXX"
WHATSAPP_TEST_MODE="false"

# WhatsApp Business Configuration
WHATSAPP_BUSINESS_PROFILE_ID="your_business_profile_id"
WHATSAPP_WEBHOOK_URL="https://your-domain.com/api/whatsapp/webhook"
WHATSAPP_WEBHOOK_TOKEN="your_webhook_verification_token"

# Rate Limiting
WHATSAPP_RATE_LIMIT_PER_SECOND="50"
WHATSAPP_RATE_LIMIT_PER_MINUTE="1000"

# Monitoring
WHATSAPP_LOG_LEVEL="info"
WHATSAPP_ENABLE_DELIVERY_REPORTS="true"
```

### Production WhatsApp Service

```typescript
interface ProductionWhatsAppConfig extends WhatsAppConfig {
  webhookUrl: string;
  webhookToken: string;
  rateLimitPerSecond: number;
  rateLimitPerMinute: number;
  businessProfileId: string;
  enableDeliveryReports: boolean;
}
```

## 🚨 Common Production Issues & Solutions

### Issue 1: Template Rejection
**Solution**: Ensure templates follow WhatsApp's format guidelines and avoid promotional content

### Issue 2: 24-Hour Window Exceeded
**Solution**: Use template messages for re-engagement after 24 hours

### Issue 3: High Volume Delivery Failures
**Solution**: Implement proper rate limiting and message queuing

### Issue 4: Webhook Delivery Issues
**Solution**: Use ngrok for testing, then deploy with proper SSL certificates

## 📊 Monitoring Dashboard

Track these metrics in your admin dashboard:

- Daily message volume
- Delivery success rate
- Response time
- Error breakdown
- Cost per message

## 🧪 Testing Production Setup

### Pre-launch Checklist

- [ ] WhatsApp Business API approved
- [ ] Production credentials configured
- [ ] Message templates approved
- [ ] Webhook endpoint live and tested
- [ ] Rate limiting implemented
- [ ] Error handling tested
- [ ] Monitoring set up
- [ ] Legal compliance verified

### Testing Process

1. **Send test messages** to verified numbers
2. **Verify template delivery**
3. **Test webhook events**
4. **Load testing** with multiple concurrent messages
5. **Failover testing** for API failures

## 💰 Cost Optimization

**Pricing Structure**:
- WhatsApp Business API: ~$0.05 per message (varies by country)
- Twilio phone number: ~$1-3/month
- Additional costs for media messages

**Optimization Tips**:
- Use text messages instead of media when possible
- Batch non-urgent communications
- Implement smart retry logic
- Monitor usage patterns

## 🆘 Support & Resources

- **Twilio WhatsApp Documentation**: https://www.twilio.com/docs/whatsapp
- **WhatsApp Business API**: https://developers.facebook.com/docs/whatsapp
- **Twilio Support**: Available 24/7 for production accounts
- **Meta Business Support**: For WhatsApp Business API issues

---

## 🎯 Quick Start for Production

1. **Complete WhatsApp Business verification**
2. **Update environment variables** with production credentials
3. **Deploy the updated WhatsApp service** (see next sections)
4. **Test with a small group** of users
5. **Monitor performance** and scale gradually

Ready to upgrade your system to production-grade WhatsApp! 🚀