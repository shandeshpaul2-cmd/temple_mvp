# WhatsApp Integration for Temple Management

This temple application uses **Twilio WhatsApp API** for sending automated messages to devotees and administrators. No Meta account required!

## Features

✅ **Automated Donation Receipts** - Send detailed receipts with PDF attachments
✅ **Pooja Booking Confirmations** - Instant confirmations to devotees
✅ **Admin Notifications** - Real-time alerts for temple administrators
✅ **Multiple Recipients** - Send to both devotee and admin simultaneously
✅ **PDF Receipt Attachments** - Professional receipts with certificates
✅ **Error Handling** - Robust error handling with fallbacks

## Quick Setup (10 minutes)

### 1. Create Twilio Account
```bash
# Go to https://www.twilio.com/try-twilio
# Sign up and verify email/phone
```

### 2. Get WhatsApp Number
```bash
# In Twilio Console → Messaging → WhatsApp
# Get a WhatsApp number (free trial available)
```

### 3. Copy Credentials
From Twilio Console, copy:
- **Account SID** (starts with "AC")
- **Auth Token** (click "show" to reveal)
- **WhatsApp Number** (starts with "+")

### 4. Configure Environment
Create `.env.local` file:
```bash
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_WHATSAPP_NUMBER="+14155238886"
WHATSAPP_TEST_MODE="false"
```

### 5. Test Setup
```bash
node test-twilio-updated.js
```

## Message Types

### Donation Receipts
When someone donates:
1. **Devotee receives**: Detailed receipt with PDF certificate
2. **Admin receives**: "New donation received" notification

### Pooja Bookings
When someone books a pooja:
1. **Devotee receives**: Booking confirmation with details
2. **Admin receives**: "New pooja booking" notification

### Parihara Poojas
When someone books a parihara pooja:
1. **Devotee receives**: Special confirmation with next steps
2. **Admin receives**: "New parihara pooja booking" notification

## Usage Examples

### Send Donation Receipt
```javascript
await whatsappService.sendDonationReceiptToDonor({
  donorName: "Ramesh Kumar",
  donorPhone: "+919876543210",
  amount: 1100,
  donationType: "General Donation",
  donationPurpose: "Temple Maintenance",
  receiptNumber: "DN-161024-0001",
  paymentId: "pay_123456",
  date: new Date().toISOString()
}, pdfUrl, true) // true = also send to admin
```

### Send Pooja Booking Confirmation
```javascript
await whatsappService.sendPoojaBookingConfirmationToDevotee({
  devoteeName: "Sita Devi",
  devoteePhone: "+919876543210",
  poojaName: "Nithya Pooja",
  amount: 500,
  receiptNumber: "PB-161024-0001",
  paymentId: "pay_789012",
  preferredDate: "2024-10-20",
  preferredTime: "9:00 AM",
  nakshatra: "Rohini",
  gotra: "Kashyapa",
  date: new Date().toISOString()
}, true) // true = also send to admin
```

### Send Custom Message to Multiple People
```javascript
await whatsappService.sendCustomMessage(
  ["+919876543210", "+919876543211", "+917760118171"],
  "🙏 Special announcement: Maha Rudrabhisheka this Sunday at 6 AM",
  "https://temple.com/poster.jpg"
)
```

## Cost

- **$5/month** for Twilio WhatsApp number
- **~₹0.48 per message** sent
- **Free trial credits** available for testing
- **No setup cost** or hidden fees

## Test Mode

Enable test mode to preview messages without sending:
```bash
WHATSAPP_TEST_MODE="true"
```

In test mode, messages are logged to console instead of being sent.

## Troubleshooting

### Common Issues

**"Authentication failed"**
- Check Account SID and Auth Token
- Ensure no extra spaces in credentials

**"Number not enabled for WhatsApp"**
- Complete WhatsApp number setup in Twilio Console
- Wait 5-10 minutes after activation

**"Template not approved"**
- Submit message templates in Twilio Console
- Use regular text messages for testing

**"Message not delivered"**
- Check recipient phone format (+91xxxxxxxxxx)
- Verify recipient has WhatsApp

### Debug Mode

Enable debug logging:
```bash
DEBUG=twilio node your-script.js
```

## File Structure

```
lib/
├── whatsapp.ts          # Main WhatsApp service (Twilio)
api/
├── donations/
│   └── verify-payment/  # Donation receipt sending
├── payments/            # Payment processing with WhatsApp
└── receipts/
    └── generate/        # PDF receipt generation
docs/
├── TWILIO_WHATSAPP_SETUP.md  # Detailed setup guide
└── WHATSAPP_SETUP.md          # Template requirements
```

## Support

- **Twilio Documentation**: https://www.twilio.com/docs/whatsapp
- **Setup Guide**: `docs/TWILIO_WHATSAPP_SETUP.md`
- **Test Your Setup**: Run `node test-twilio-updated.js`

## Security

- Credentials stored in environment variables
- No sensitive data in logs
- Phone numbers automatically formatted
- Error handling prevents data exposure

---

**Your temple WhatsApp system is ready to use!** 🎉

Send automated, professional messages to unlimited devotees and administrators using Twilio WhatsApp API.