# Temple MVP - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Login to Vercel
```bash
vercel login
```
Visit the URL shown in your terminal to authenticate.

### 2. Deploy Your Application
```bash
cd app
vercel --prod
```
This will deploy your temple MVP to Vercel.

### 3. Set Up Vercel Postgres Database
1. Go to your Vercel project dashboard
2. Click on "Storage" tab
3. Click "Create Database"
4. Select "Postgres" (free tier available)
5. Give it a name like "temple-db"
6. Click "Create"

### 4. Configure Environment Variables
In your Vercel project dashboard, go to Settings > Environment Variables and add:

**Required Variables:**
```
DATABASE_URL=your-postgres-connection-string
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
```

**Optional Variables:**
```
WHATSAPP_API_URL=your-whatsapp-api-url
WHATSAPP_API_KEY=your-whatsapp-api-key
WHATSAPP_PHONE_NUMBER=your-whatsapp-phone-number
TEMPLE_NAME=Shri Raghavendra Swamy Brundavana Sannidhi
TEMPLE_PHONE_1=9945594845
TEMPLE_PHONE_2=9902520105
TEMPLE_EMAIL=contact@temple.org
TEMPLE_ADDRESS=9/2, Damodar Modaliar Road, Ulsoor, Bangalore - 560008
```

### 5. Run Database Migration
After setting up the database, run:
```bash
node migrate-to-vercel-postgres.js
```

### 6. Redeploy (if needed)
```bash
vercel --prod
```

## 📱 Your Live Temple App
Once deployed, your temple will be available at:
`https://your-project-name.vercel.app`

## 🔧 Features Available on Vercel Free Tier
- ✅ Unlimited static pages
- ✅ Serverless functions (API routes)
- ✅ 100GB bandwidth/month
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ GitHub auto-deploys
- ✅ Custom domains

## 🛠 Troubleshooting

### Database Connection Issues
- Make sure your DATABASE_URL is correct
- Check if the database is created in Vercel dashboard
- Run the migration script

### Build Errors
- Check that all environment variables are set
- Make sure `npm run build` works locally
- Check Vercel function logs

### Payment Issues
- Verify Razorpay keys are correct
- Make sure webhook URL is configured in Razorpay dashboard
- Check environment variables match Razorpay dashboard

## 📞 Support
If you need help:
1. Check Vercel deployment logs
2. Verify all environment variables
3. Ensure database is properly configured
4. Test locally with Vercel environment: `vercel env pull .env.local`