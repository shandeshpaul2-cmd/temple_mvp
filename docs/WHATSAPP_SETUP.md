# WhatsApp Business API Setup Guide

This guide will help you set up Meta's official WhatsApp Business API for sending automated receipts and notifications to devotees and temple administrators.

## Prerequisites

- Meta Business Account
- WhatsApp Business App (for verification)
- Facebook Business Manager access
- Web server with HTTPS (for webhooks)
- Domain name for your temple application

## Step 1: Create Meta Business Account

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Click "Create Account" or login to existing account
3. Add your business details:
   - Business Name: "Shri Raghavendra Swamy Brundavana Sannidhi"
   - Business Category: "Religious Organization"
   - Address: "9/2, Damodar Modaliar Road, Ulsoor, Bangalore - 560008"
   - Phone: "9945594845"

## Step 2: Set Up WhatsApp Business API

### 2.1 Create WhatsApp Business Account

1. In Meta Business Suite, go to "WhatsApp" section
2. Click "Get Started" or "Add WhatsApp"
3. Follow the verification process:
   - Verify your phone number (+919945594845)
   - Upload business documents if required
   - Wait for approval (usually 1-3 business days)

### 2.2 Get API Credentials

Once approved, you'll get:

1. **Phone Number ID**: Found in WhatsApp Business Settings
2. **Access Token**: Generate in WhatsApp Business API settings
3. **Webhook Verify Token**: Create a custom token for webhook verification

## Step 3: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# WhatsApp Business API (Meta)
WHATSAPP_ACCESS_TOKEN="EAAJZC..."
WHATSAPP_PHONE_NUMBER_ID="123456789"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="your_custom_verify_token_123"
```

### Getting the Values:

1. **Access Token**:
   - Go to Meta Business Suite → WhatsApp → Settings
   - Click "Generate New Token"
   - Copy the token (starts with "EAAJZC...")

2. **Phone Number ID**:
   - In WhatsApp Settings, find your phone number
   - The ID will be displayed (usually a 9-10 digit number)

3. **Webhook Verify Token**:
   - Create your own secure token
   - Example: "temple_whatsapp_2024_secure"
   - This will be used to verify webhook requests

## Step 4: Set Up Webhook

### 4.1 Deploy Webhook Endpoint

Your webhook is already implemented at:
```
https://your-domain.com/api/whatsapp/webhook
```

### 4.2 Configure Webhook in Meta

1. Go to WhatsApp Business Settings → Webhooks
2. Add webhook URL: `https://your-domain.com/api/whatsapp/webhook`
3. Add verify token (same as WHATSAPP_WEBHOOK_VERIFY_TOKEN)
4. Subscribe to these fields:
   - `messages`
   - `message_delivery`

### 4.3 Test Webhook

1. Click "Verify" in Meta Business settings
2. Check console logs for successful verification
3. Send a test message to your WhatsApp number

## Step 5: Create Message Templates

WhatsApp requires pre-approved templates for sending notifications:

### 5.1 Donation Receipt Template

**Template Name**: `donation_receipt`
**Category**: `UTILITY`

```text
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

### 5.2 Pooja Booking Confirmation Template

**Template Name**: `pooja_booking_confirmation`
**Category**: `UTILITY`

```text
Dear {{1}},

Your pooja booking has been confirmed!

Booking Details:
• Receipt Number: {{2}}
• Pooja: {{3}}
• Amount: {{4}}
{{5}}
{{6}}

Our staff will contact you within 24 hours to confirm timing.

For queries: {{7}}
```

### 5.3 Submit Templates for Approval

1. Go to WhatsApp Business Manager → Message Templates
2. Create each template with the exact format above
3. Submit for approval (usually takes 1-2 hours)

## Step 6: Test Integration

### 6.1 Send Test Messages

```javascript
// Test sending a donation receipt
const testDonation = {
  donorName: "Test Devotee",
  donorPhone: "+919876543210",
  amount: 1100,
  donationType: "General Donation",
  donationPurpose: "Temple Maintenance",
  receiptNumber: "DN-161024-0001",
  paymentId: "pay_test_123",
  date: new Date().toISOString()
}

// This will be called automatically when you test a donation
await whatsappService.sendDonationReceiptToDonor(testDonation)
```

### 6.2 Check Logs

Monitor your application logs for:
```
Sending WhatsApp Message - To: 919876543210
WhatsApp message sent successfully: {...}
```

## Step 7: Production Deployment

### 7.1 Domain and SSL

- Ensure your domain has valid SSL certificate
- HTTPS is required for WhatsApp webhooks
- Update NEXT_PUBLIC_BASE_URL in environment

### 7.2 Rate Limits

WhatsApp Business API has rate limits:
- 1000 messages per day for new accounts
- Increases with account age and quality
- Monitor message sending to avoid limits

### 7.3 Error Handling

The integration includes automatic fallback:
- Template failures → Regular text messages
- API failures → Console logging + continue processing
- Network issues → Retry logic

## Cost Structure

WhatsApp Business API pricing:
- **Free tier**: 1000 conversations/month
- **Paid**: ~$0.005-0.02 per message after free tier
- **Categories**:
  - Utility (receipts, confirmations): Lower cost
  - Marketing: Higher cost

## Troubleshooting

### Common Issues

1. **Webhook Verification Failed**
   - Check WHATSAPP_WEBHOOK_VERIFY_TOKEN matches
   - Ensure webhook URL is accessible
   - Check HTTPS certificate

2. **Template Not Approved**
   - Wait for approval (1-2 hours)
   - Check template format matches exactly
   - Avoid promotional language

3. **Messages Not Sending**
   - Check access token is valid
   - Verify phone number ID
   - Check account limits

4. **Receiving Error 401**
   - Access token expired
   - Regenerate new token
   - Update environment variables

### Monitoring

Check these logs regularly:
- WhatsApp API responses
- Webhook verification status
- Template delivery status
- Rate limit warnings

## Support Resources

- [Meta WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [Template Guidelines](https://developers.facebook.com/docs/whatsapp/message-templates)
- [Rate Limits](https://developers.facebook.com/docs/whatsapp/limits)

## Security Best Practices

1. **Access Token Security**
   - Never commit tokens to git
   - Use environment variables
   - Rotate tokens regularly

2. **Webhook Security**
   - Use strong verify tokens
   - Implement IP restrictions if possible
   - Monitor webhook requests

3. **Data Privacy**
   - Don't store sensitive data in logs
   - Follow GDPR/Privacy laws
   - Get user consent for communications

## Next Steps

1. Complete Meta Business setup
2. Configure environment variables
3. Deploy webhook endpoint
4. Submit message templates
5. Test with small amounts
6. Monitor and scale as needed

For technical support with this integration, please check the application logs and Meta Business documentation.