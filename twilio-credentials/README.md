# Twilio Credentials

This folder contains the Twilio API credentials for WhatsApp Business API integration.

## Files

- `.env` - Contains the Twilio credentials and configuration
- `README.md` - This documentation file

## Credentials

### Twilio Account
- **Account SID**: AC1ae8eed78b540e8b8a6e40809f3984cc
- **Auth Token**: 116a68f7a29aa308c1c537ab89ec4ee8 (updated: 2025-10-19)
- **WhatsApp Number**: +14155238886 (Twilio Sandbox)

### Configuration
- **Test Mode**: false (set to true for testing without sending messages)
- **Admin Number**: +917760118171 (Temple admin phone)
- **Temple Name**: Shri Raghavendra Swamy Brundavana Sannidhi

## Usage

These credentials are used by:
- Main application: `../app/.env.local`
- WhatsApp service: `../app/lib/whatsapp.ts`
- Production service: `../app/lib/whatsapp-production.ts`

## Security Notes

⚠️ **Important**: Keep these credentials secure!
- Never commit this file to version control
- Only share with authorized team members
- Regenerate tokens if compromised

## Setup Instructions

1. Copy credentials to main application:
   ```bash
   cp twilio-credentials/.env ../app/.env.local
   ```

2. Update WHATSAPP_TEST_MODE to "true" for testing
3. Set WHATSAPP_TEST_MODE to "false" for live messaging

## WhatsApp Sandbox Setup

1. Send "join <keyword>" to +14155238886
2. Wait for confirmation message
3. Your number is now connected to the sandbox
4. Test messaging with the application

## Support

For issues with WhatsApp messaging:
- Check Twilio Console: https://twilio.com/console
- Verify WhatsApp sandbox setup
- Check account status and billing
- Review message logs in Twilio Console