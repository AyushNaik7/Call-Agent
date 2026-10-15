# Phase 4 Setup Guide - AI Integration

## Quick Start

### 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy the generated API key

### 2. Configure Environment Variables

Add your API key to `.env.local`:

```bash
# Google Gemini API Configuration
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```

**⚠️ Important**: Never commit `.env.local` to git (it's already in `.gitignore`)

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Test the AI Receptionist

1. Navigate to **Dashboard → AI Configuration**
2. Scroll to the bottom to find the **Chat Interface**
3. Try asking questions like:
   - "What services do you offer?"
   - "I'd like to book an appointment"
   - "What are your business hours?"

## Testing the AI

### Add Knowledge Base Entries

Before the AI can answer business questions, add some knowledge:

1. Go to **Dashboard → Knowledge Base**
2. Click **"Add Knowledge"**
3. Add entries like:

**Example Entry 1:**
- Question: "What are your business hours?"
- Answer: "We're open Monday-Friday 9am-6pm, and Saturday 10am-5pm. Closed Sundays."
- Category: Hours

**Example Entry 2:**
- Question: "What services do you offer?"
- Answer: "We offer haircuts ($45-85), color treatment ($120-200), styling ($80-150), and highlights ($150-250)."
- Category: Services

### Test Appointment Booking

1. Open the chat interface
2. Say: "I'd like to book a haircut"
3. The AI will ask for:
   - Your name
   - Phone number
   - Preferred date and time
4. It will check availability and confirm

### Test Appointment Management

**Reschedule:**
1. Say: "I need to reschedule my appointment"
2. Provide your phone number
3. Provide new date/time

**Cancel:**
1. Say: "I need to cancel my appointment"
2. Provide your phone number

## Free Tier Information

### What's Included (Free)

- ✅ Unlimited text generation on gemini-3.8-flash
- ✅ Function calling support
- ✅ Up to 1 million token context window
- ✅ No billing account required
- ✅ No credit card needed

### Rate Limits

Free tier has per-project limits:
- **RPM** (Requests Per Minute)
- **TPM** (Tokens Per Minute)
- **RPD** (Requests Per Day)

Exact limits vary and are visible in [Google AI Studio](https://aistudio.google.com).

### When You Might Hit Limits

- Heavy testing (many rapid requests)
- Multiple concurrent users
- Very large context (long conversations)

**If you hit a limit:**
- Error message will say "rate limit exceeded"
- Wait a moment and try again
- Or enable billing for higher limits

### Data Privacy (Free Tier)

⚠️ **Important**: On the free tier, Google may use your prompts and responses to improve their models.

**Do NOT use the free tier for:**
- Sensitive customer data
- Confidential business information
- Personal health information
- Financial records

**For production with real customer data:**
- Enable billing in Google AI Studio
- Paid tier has different data terms
- Your data won't be used for model training

## Troubleshooting

### "AI service configuration error"

**Cause**: GEMINI_API_KEY not set or invalid

**Solution**:
1. Check `.env.local` exists
2. Verify API key is correct
3. Restart dev server (`npm run dev`)

### "AI service rate limit exceeded"

**Cause**: Too many requests too quickly

**Solution**:
1. Wait a minute and try again
2. Check limits in Google AI Studio
3. Consider enabling billing for higher limits

### "AI service quota exhausted"

**Cause**: Daily quota reached

**Solution**:
1. Wait until midnight Pacific Time (quota resets)
2. Enable billing for larger quotas

### Chat Interface Not Showing

**Cause**: TypeScript or build errors

**Solution**:
```bash
npm run build
```

Check for errors in the output.

### AI Not Finding Knowledge Base Entries

**Cause**: Entries may not be enabled or query doesn't match

**Solution**:
1. Go to Knowledge Base page
2. Verify entries are enabled (not disabled)
3. Try rephrasing your question
4. Check that keywords match

### Appointment Creation Fails

**Possible Causes**:
- Appointment conflicts with existing booking
- Missing required information
- Invalid date/time format

**Solution**: AI should explain the issue. Provide correct information.

## API Limits Reference

### Current Free Tier Models (October 2026)

**Available for new projects:**
- ✅ `gemini-3.8-flash` (recommended)
- ✅ `gemini-3.6-flash`
- ✅ `gemini-3.5-flash-lite`
- ✅ `gemini-3.1-flash-lite`

**NOT available on free tier:**
- ❌ `gemini-3.1-pro-preview` (Pro model)
- ❌ Image generation models
- ❌ Video generation models

### Switching Models

To use a different model, update `.env.local`:

```bash
# For lightweight, high-volume tasks
GEMINI_MODEL=gemini-3.5-flash-lite

# For standard usage (recommended)
GEMINI_MODEL=gemini-3.8-flash

# For previous generation
GEMINI_MODEL=gemini-3.6-flash
```

## Monitoring Usage

### Check Your Usage

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Go to your project
3. Check rate limit quotas
4. Monitor requests per day

### Common Usage Patterns

**Light Testing**: ~10-50 requests/day
**Active Development**: ~100-500 requests/day
**Small Production**: ~1,000-5,000 requests/day

If you exceed free tier limits consistently, consider enabling billing.

## Best Practices

### 1. Add Comprehensive Knowledge Base

The AI can only answer questions from your knowledge base:
- Add FAQs about services
- Document pricing
- Explain policies
- Include contact information

### 2. Test All Tools

Verify each capability:
- ✅ Knowledge search
- ✅ Availability checking
- ✅ Appointment booking
- ✅ Rescheduling
- ✅ Cancellation
- ✅ Customer lookup
- ✅ Callback requests

### 3. Set Realistic Expectations

The AI will:
- ✅ Answer questions from knowledge base
- ✅ Book/manage appointments
- ✅ Escalate complex issues

The AI won't:
- ❌ Make up information
- ❌ Handle refunds (escalates)
- ❌ Make exceptions to policies (escalates)
- ❌ Access information not in knowledge base

### 4. Monitor Callback Requests

Check **Messages** page regularly for:
- Issues AI couldn't handle
- Customer complaints
- Special requests

### 5. Keep Knowledge Base Updated

Update knowledge entries when:
- Hours change
- Prices change
- Services added/removed
- Policies updated

## Security Notes

### Environment Variables

✅ **Correct**:
```
GEMINI_API_KEY=AIza... (in .env.local)
```

❌ **NEVER**:
```javascript
// Don't put API key in frontend code
const apiKey = "AIza...";
```

### Data Security

- All AI operations require authentication
- Business data isolated by RLS policies
- Tools validate business context
- API key never exposed to browser
- All database operations authorized

## Need Help?

### Resources

- [Google Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Google AI Studio](https://aistudio.google.com)
- [Rate Limits Info](https://ai.google.dev/gemini-api/docs/rate-limits)

### Common Questions

**Q: Can I use this in production?**
A: Yes, but enable billing for proper data handling and higher limits.

**Q: How much does billing cost?**
A: gemini-3.8-flash is $0.75 per 1M input tokens, $3.75 per 1M output tokens (as of Oct 2026). Check current pricing at Google AI Studio.

**Q: Will my free tier expire?**
A: Free tier doesn't expire, but rate limits may change. Monitor Google's announcements.

**Q: Can I upgrade later?**
A: Yes, enable billing in Google AI Studio anytime. Your code doesn't need changes.

**Q: What happens if I hit rate limits?**
A: Requests will fail with clear error messages. Users can retry after waiting.

## Next Steps

Now that Phase 4 is working:

1. ✅ Add business-specific knowledge entries
2. ✅ Test all AI capabilities thoroughly
3. ✅ Monitor callback requests
4. ✅ Prepare for Phase 5 (Dashboard Enhancements)

Good luck testing your AI receptionist! 🤖
