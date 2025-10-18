# Running Temple MVP with Donation Certificates

This guide shows how to run the temple application with donation certificate generation enabled.

## Port Configuration

- **Next.js App**: Port 3010
- **Certificate Service**: Port 5001

## Quick Start

### 1. Start Certificate Service (DONATIONS ONLY)

```bash
cd app/certificates

# First time setup
cp .env.example .env

# Start the service
./start.sh
```

The certificate service will start on `http://localhost:5001`

### 2. Start Next.js Application

```bash
# From the app directory
npm run dev:3010

# Or
DATABASE_URL="file:./dev.db" HOST=0.0.0.0 PORT=3010 npm run dev
```

The temple app will start on `http://localhost:3010`

### 3. Test Certificate Generation

1. Visit `http://localhost:3010`
2. Make a donation
3. After successful payment, click "Download Certificate" on the success page
4. Certificate PDF will be generated and downloaded

## Important Notes

- **DONATIONS ONLY**: The certificate generator works exclusively for donations, not pooja bookings
- **Port Separation**: Services run on different ports to avoid conflicts
- **Health Check**: Verify certificate service is running at `http://localhost:5001/health`

## Troubleshooting

If certificates don't generate:

1. **Check Certificate Service**: `curl http://localhost:5001/health`
2. **Check Logs**: Look at the certificate service terminal output
3. **Verify CORS**: Ensure the service allows requests from `http://localhost:3010`
4. **Test API**: Run `python app/certificates/test_client.py`

## Production Considerations

For production deployment:
- Configure HTTPS for both services
- Update CORS origins accordingly
- Set up proper environment variables
- Consider Docker deployment with `docker-compose up`