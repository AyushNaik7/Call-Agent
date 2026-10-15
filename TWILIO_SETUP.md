# Twilio Setup Guide - Phase 6

## Overview

This guide will help you set up Twilio to handle real phone calls for your AI Receptionist.

## Prerequisites

- ✅ Phase 4 complete (AI integration working)
- ✅ Phase 5 complete (Voice testing done)
- ✅ Credit card (for Twilio account - **$0 to start, pay-as-you-go**)

## Step 1: Create Twilio Account

### 1.1 Sign Up
1. Go to https://www.twilio.com/try-twilio
2. Click "Sign up for free"
3. Fill in your details:
   - Email address
   - Password
   - First/Last name
4. Verify your email
5. Verify your phone number (SMS verification)

### 1.2 Get Trial Credits
- ✅ **$15.50 free trial credit** included
- ✅ No credit card required for trial
- ⚠️ Trial can only call/text verified numbers

## Step 2: Get Your Twilio Credentials

### 2.1 Account SID & Auth Token
1. Go to Twilio Console: https://console.twilio.com/
2. On the dashboard, you'll see:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click "Show" to reveal)
3. Copy both - you'll need them for `.env.local`

### 2.2 Get a Phone Number

#### Option A: Trial Number (Free during trial)
1. Go to https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
2. Click "Buy a number"
3. Select your country
4. Check "Voice" capability
5. Click "Search"
6. Select a number (free during trial)
7. Click "Buy"

#### Option B: Upgrade for Production
- **Cost**: ~$1/month per number
- **Benefits**: Call anyone, not just verified numbers
- Add credit card in Console → Billing

## Step 3: Configure Environment Variables

Add to your `.env.local`:

```env
# Twilio Configuration (Phase 6)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

**Important**: Replace with your actual values!

## Step 4: Apply Database Migration

Run the migration to add call logs table:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL from:
# supabase/migrations/003_add_call_logs.sql
```

Go to your Supabase SQL Editor and run the migration file.

## Step 5: Configure Twilio Webhook

### 5.1 For Local Development (using ngrok)

1. **Install ngrok** (if not already):
   ```bash
   # Download from https://ngrok.com/download
   # Or use: choco install ngrok (Windows)
   ```

2. **Start your Next.js dev server**:
   ```bash
   npm run dev
   ```

3. **Start ngrok tunnel**:
   ```bash
   ngrok http 3000
   ```

4. **Copy the HTTPS URL** from ngrok (e.g., `https://abc123.ngrok.io`)

5. **Configure Twilio**:
   - Go to https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
   - Click on your phone number
   - Scroll to "Voice Configuration"
   - Under "A CALL COMES IN":
     - Select "Webhook"
     - Enter: `https://your-ngrok-url.ngrok.io/api/twilio/voice`
     - Method: `HTTP POST`
   - Click "Save"

### 5.2 For Production (using your domain)

1. Deploy to Vercel/production
2. Configure webhook:
   - URL: `https://yourdomain.com/api/twilio/voice`
   - Method: `HTTP POST`

## Step 6: Test Your Setup

### 6.1 Make a Test Call
1. Call your Twilio number from your phone
2. You should hear: "Hello! Thank you for calling..."
3. The call should connect to AI

### 6.2 Check Call Logs
1. Go to http://localhost:3000/calls
2. You should see the call logged
3. Check the status and details

### 6.3 Verify Database
1. Open Supabase dashboard
2. Go to Table Editor → `call_logs`
3. Verify the call was recorded

## Costs Breakdown

### Trial Account (Free $15.50 credit)
- ✅ **Phone number**: $0 during trial
- ✅ **Incoming calls**: $0.0085/min
- ✅ **Outgoing calls**: $0.0085/min
- ✅ **SMS**: $0.0075/message
- ✅ **~1,800 minutes** of calls with trial credit

### After Trial (Pay-as-you-go)
- 📞 **Phone number**: ~$1/month
- 📞 **Incoming calls**: $0.0085/min (~$0.51/hour)
- 📞 **Recording**: $0.0005/min
- 📞 **Transcription**: $0.05/min

### Example Monthly Costs
- **Light use** (100 calls, 5 min avg): ~$5-10/month
- **Medium use** (500 calls, 5 min avg): ~$25-40/month
- **Heavy use** (1000+ calls): ~$50-100/month

## Troubleshooting

### "Webhook Error" when calling
- **Check ngrok is running** and URL is correct
- **Check dev server is running** (`npm run dev`)
- **Check webhook URL** in Twilio console matches ngrok URL

### "Invalid credentials" error
- **Verify TWILIO_ACCOUNT_SID** starts with `AC`
- **Verify TWILIO_AUTH_TOKEN** is correct (no spaces)
- **Restart dev server** after adding env variables

### Call connects but AI doesn't respond
- **Check OpenRouter API key** is configured
- **Check console logs** for errors
- **Verify call log** was created in database

### "Access denied" when viewing calls
- **Run migration** `003_add_call_logs.sql`
- **Check RLS policies** are created
- **Verify you're logged in** to the app

## Next Steps

Once Twilio is configured:

1. ✅ Test inbound calls work
2. ✅ Verify call logs are saved
3. ✅ Test AI responses during calls
4. ✅ Test appointment booking via phone
5. ✅ Set up call recording (optional)
6. ✅ Configure business hours routing

## Security Notes

⚠️ **Never commit credentials**:
- Keep `.env.local` in `.gitignore`
- Don't share Auth Token publicly
- Rotate tokens if accidentally exposed

🔒 **Webhook validation**:
- Production: Validates Twilio signatures
- Development: Validation disabled for ngrok

---

**Status**: Ready for Phase 6 implementation
**Cost**: $0 to start (trial) → Pay-as-you-go
**Setup Time**: ~15 minutes
