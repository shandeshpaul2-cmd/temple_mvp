# Donation Certificate Generator Setup Guide

This guide explains how to set up and use the DONATION certificate generator for the temple MVP application.

**IMPORTANT**: This service is exclusively for DONATION certificates only. It does not support pooja bookings, parihara poojas, or astrology consultations.

## Overview

The donation certificate generator is a Python-based service that:
- Generates official DONATION certificates in PDF format ONLY
- Provides a REST API for donation certificate generation
- Integrates seamlessly with the Next.js temple application
- Supports professional A4 certificate layouts with temple branding
- Runs on port 5001 to avoid conflicts with the main Next.js app (port 3010)

## Architecture

```
┌─────────────────┐    HTTP API    ┌──────────────────────┐
│   Next.js App   │ ──────────────── │  Python Service      │
│ (Donation Only) │                 │  Donation Cert Gen    │
│   Port 3010     │                 │     Port 5001         │
└─────────────────┘                 └──────────────────────┘
                                              │
                                     PDF Engine (Playwright/WeasyPrint)
                                              │
                                     ┌──────────────────────┐
                                     │   Donation PDFs       │
                                     └──────────────────────┘
```

**Port Configuration**:
- Next.js app runs on port 3010
- Certificate service runs on port 5001 (to avoid conflicts)

## Quick Start

### 1. Set up the Python Service

```bash
cd app/certificates

# Copy environment configuration
cp .env.example .env

# Start the service (automated setup)
./start.sh
```

The service will start on `http://localhost:5001`

### 2. Test the Service

```bash
# Run the test client
python test_client.py
```

### 3. Start the Next.js Application

```bash
cd ../../
npm run dev
```

The application will be available on `http://localhost:3000` or `http://localhost:3010`

### 4. Test Certificate Generation

1. Make a test donation on the temple website
2. Complete the payment process
3. On the success page, click "Download Certificate"
4. The certificate PDF will be generated and downloaded

## Detailed Setup

### Python Service Setup

#### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

#### Manual Setup

```bash
# Navigate to certificate directory
cd app/certificates

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browser (for best PDF rendering)
python -m playwright install chromium

# Create output directory
mkdir -p output

# Set environment variables
export CERTIFICATE_PORT=5001
export PDF_ENGINE=playwright

# Start the service
python app.py
```

#### Docker Setup

```bash
cd app/certificates

# Build and run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop service
docker-compose down
```

### Next.js Integration

The certificate service integrates with the Next.js application through:

1. **API Endpoints**: `/app/app/api/certificates/`
2. **Service Layer**: `/app/lib/certificate-service.ts`
3. **UI Components**: Success page with download functionality

#### Environment Configuration

Add to your Next.js `.env.local`:

```env
# Certificate service URL
CERTIFICATE_SERVICE_URL=http://localhost:5001
```

## API Documentation

### Generate Certificate

**POST** `/generate`

```json
{
  "donor_name": "John Doe",
  "amount": "1500.00",
  "donation_id": "DN-171025-0001",
  "donation_date": "2025-10-17",
  "payment_mode": "Razorpay",
  "org_name": "Shri Raghavendra Swamy Brundavana Sannidhi, Halasuru",
  "org_subtitle": "Guru Seva Mandali (Regd.)",
  "show_80g_note": true
}
```

**Response:**
```json
{
  "success": true,
  "filename": "certificate_DN-171025-0001_20251017_143022.pdf",
  "message": "Certificate generated successfully"
}
```

### Download Certificate

**GET** `/download/<filename>`

Returns the PDF file for download.

### Health Check

**GET** `/health`

```json
{
  "status": "healthy",
  "service": "certificate-generator"
}
```

## Customization

### Certificate Template

Edit `app/certificates/templates/certificate_template.html` to customize:

- Temple information and branding
- Certificate layout and styling
- Logo and background images
- Additional fields or sections

#### Template Variables

- `{{ donor_name }}` - Donor's full name
- `{{ amount|inr }}` - Amount formatted with Indian numbering
- `{{ donation_id }}` - Receipt number
- `{{ donation_date|date_dmy }}` - Date formatted as "17 Oct 2025"
- `{{ payment_mode }}` - Payment method
- `{{ org_name }}` - Temple organization name
- `{{ org_subtitle }}` - Organization subtitle
- `{{ show_80g_note }}` - Boolean for 80G tax benefit note

### Layout Locking (Optional)

To prevent accidental template changes:

1. Generate hash of your approved template:
```bash
python -c "
import hashlib, pathlib
p = pathlib.Path('templates/certificate_template.html')
print(hashlib.sha256(p.read_bytes()).hexdigest())
"
```

2. Add hash to `.env`:
```env
TEMPLATE_LAYOUT_HASH=your_sha256_hash_here
```

The service will refuse to generate certificates if the template is modified.

## Production Deployment

### Environment Variables

```env
# Service Configuration
CERTIFICATE_PORT=5001
PDF_ENGINE=playwright
LOG_LEVEL=INFO

# Security
TEMPLATE_LAYOUT_HASH=your_hash_here

# CORS (adjust for your domain)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Docker Production

```yaml
version: '3.8'
services:
  certificate-generator:
    build: .
    ports:
      - "5001:5001"
    environment:
      - CERTIFICATE_PORT=5001
      - PDF_ENGINE=playwright
      - LOG_LEVEL=INFO
      - CORS_ORIGINS=https://yourdomain.com
    volumes:
      - ./output:/app/output
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### SSL/TLS Configuration

For production, use HTTPS:

1. Set up reverse proxy (nginx/Apache) with SSL
2. Update CORS origins to HTTPS URLs
3. Configure Next.js environment variables accordingly

## Troubleshooting

### Common Issues

1. **Service Not Responding**
   - Check if Python service is running: `curl http://localhost:5001/health`
   - Verify port is not in use
   - Check logs for errors

2. **Certificate Generation Fails**
   - Verify Playwright browser is installed: `python -m playwright install chromium`
   - Check template file exists and is valid HTML
   - Review service logs for detailed error messages

3. **Download Issues**
   - Ensure certificate was generated successfully
   - Check filename is valid (no special characters)
   - Verify browser allows downloads

4. **CORS Errors**
   - Check CORS origins configuration
   - Verify Next.js domain is whitelisted
   - Ensure API endpoints are correctly configured

### Logs and Debugging

```bash
# View service logs
./start.sh 2>&1 | tee service.log

# Test with curl
curl -X POST http://localhost:5001/generate \
  -H "Content-Type: application/json" \
  -d '{"donor_name":"Test","amount":"100","donation_id":"TEST-001","donation_date":"2025-10-17"}'

# Check Next.js integration
curl http://localhost:3000/api/certificates/generate
```

## Performance Considerations

- **PDF Generation**: Playwright is slower but more accurate than WeasyPrint
- **Memory Usage**: Each certificate generation uses ~50-100MB RAM
- **Storage**: Consider automatic cleanup of old certificates
- **Caching**: Implement Redis caching for frequently requested certificates

## Security Notes

- All user inputs are validated and sanitized
- HTML injection prevented via Jinja2 auto-escaping
- File access restricted to output directory
- Template layout can be locked via SHA-256 hash
- CORS properly configured for allowed origins

## Integration with WhatsApp

The certificate generator can be integrated with the existing WhatsApp service:

1. Generate certificate after successful donation
2. Store certificate URL in database
3. Include certificate link in WhatsApp message
4. Optionally attach certificate as media file

## Support

For issues and questions:

1. Check this documentation
2. Review service logs
3. Test with the provided test client
4. Verify environment configuration
5. Check API integration with Next.js

The certificate generator is designed to be robust, secure, and easy to maintain for production use in the temple application.