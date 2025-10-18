# Resend Email Service Setup Guide

This guide explains how to set up the Resend email service for the Temple Management System.

## Overview

The temple application now includes automated email notifications for:
- **Donations**: Receipt + certificate to devotees, notification to admin
- **Pooja Bookings**: Confirmation to devotees, reference to admin
- **Astrology Consultations**: Confirmation to clients, complete details to admin
- **Parihara Poojas**: Confirmation to devotees, reference to admin

## Setup Instructions

### 1. Create Resend Account

1. Visit [https://resend.com](https://resend.com) and sign up
2. Verify your email address
3. Complete the sender verification process

### 2. Configure Sending Domain

1. Go to the Resend dashboard → Domains
2. Add your domain (e.g., `temple.org`)
3. Add the required DNS records to your domain:
   - TXT record for verification
   - TXT record for SPF
   - CNAME record for DKIM
4. Wait for domain verification (usually takes a few minutes)

### 3. Create API Key

1. Go to Settings → API Keys
2. Click "Create API Key"
3. Give it a descriptive name (e.g., "Temple App Production")
4. Select appropriate permissions (typically "Send")
5. Copy the API key (starts with `re_`)

### 4. Update Environment Variables

Add the following to your `.env.local` file:

```env
# Email Service (Resend)
RESEND_API_KEY="re_your_actual_api_key_here"
RESEND_FROM_EMAIL="noreply@your-temple-domain.org"
```

**Important**: Also update the temple email in environment:

```env
TEMPLE_EMAIL="your-admin-email@your-temple-domain.org"
```

### 5. Test the Configuration

#### Option A: Using the Test API Endpoint

```bash
curl -X POST http://localhost:3000/api/test/email \
  -H "Content-Type: application/json" \
  -d '{
    "testType": "donation",
    "email": "your-email@example.com"
  }'
```

#### Option B: Using the Test Script

```bash
cd app
node test-email-service.js
```

## Email Templates

### Donation Emails

**Devotee receives:**
- Professional receipt with temple branding
- Amount and donation details
- Link to download certificate
- Spiritual message

**Admin receives:**
- Notification of new donation
- Donor details (name, email, phone, gotra)
- Receipt number for reference

### Pooja Booking Emails

**Devotee receives:**
- Booking confirmation with receipt
- Pooja details and scheduled date
- Amount paid
- Divine message and arrival instructions

**Admin receives:**
- New booking notification
- Devotee contact details
- Pooja scheduling information

### Astrology Consultation Emails

**Client receives:**
- Consultation confirmation
- Appointment details
- Payment receipt
- Preparation instructions

**Admin receives:**
- New consultation notification
- Complete client details including birth information
- Consultation type and schedule

## Features

### ✅ What's Included

- **Professional Email Templates**: Beautiful, temple-themed designs
- **Automatic Sending**: Triggers after successful payments
- **Dual Notifications**: Both user and admin receive emails
- **Error Handling**: Graceful fallback if email sending fails
- **Logging**: Detailed logs for troubleshooting
- **Certificate Integration**: Automatic certificate links for donations

### 🔧 Configuration Options

- **Custom Domain**: Use your verified domain for sending
- **Template Customization**: Easy to modify email templates
- **Admin Email**: Configure where admin notifications go
- **Test Mode**: Test emails without affecting production

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check if `RESEND_API_KEY` is correct
   - Verify domain is properly configured
   - Check console logs for error messages

2. **Domain verification failed**
   - Ensure all DNS records are added correctly
   - Wait for DNS propagation (up to 48 hours)
   - Use a DNS lookup tool to verify records

3. **Rate limiting**
   - Resend has rate limits (typically 3 emails/second for free tier)
   - Emails are queued automatically if rate limit is reached

### Debug Mode

To enable detailed email logging, set the following in your environment:

```env
NODE_ENV="development"
```

This will provide detailed console logs for:
- Email sending attempts
- Success/failure status
- Error messages
- Template rendering

## Production Checklist

- [ ] Resend domain is verified
- [ ] API key is set and valid
- [ ] Admin email is configured
- [ ] Test emails are working
- [ ] Error monitoring is set up
- [ ] Email templates are reviewed

## Cost

Resend offers:
- **Free tier**: 3,000 emails per month
- **Paid plans**: Starting at $20/month for 50,000 emails

For most temples, the free tier should be sufficient for daily operations.

## Support

If you encounter issues:

1. Check the Resend dashboard for delivery status
2. Review the application logs
3. Verify DNS configuration
4. Contact Resend support at [support@resend.com](mailto:support@resend.com)

## Next Steps

1. Set up your Resend account
2. Configure your domain
3. Add API keys to environment
4. Test the email functionality
5. Monitor the first few live transactions