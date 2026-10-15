# OpenRouter Setup Guide

## Why OpenRouter?

We've switched from Google Gemini direct API to OpenRouter because:
- ✅ **Better rate limits** on free tier
- ✅ **More reliable** - no persistent 503 errors
- ✅ **Access to multiple models** including free Gemini models
- ✅ **OpenAI-compatible API** - easier to work with
- ✅ **Still 100% free** for our use case

## Setup Steps

### 1. Get Your OpenRouter API Key

1. Go to https://openrouter.ai/
2. Sign up for a free account (you can use Google/GitHub login)
3. Go to **Keys** section: https://openrouter.ai/keys
4. Click **Create Key**
5. Give it a name like "AI Receptionist"
6. Copy the API key (starts with `sk-or-...`)

### 2. Add API Key to .env.local

Open your `.env.local` file and add your OpenRouter API key:

```env
# AI Provider Configuration (Phase 4 - OpenRouter)
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
```

**Important**: Replace `your_openrouter_api_key_here` with your actual API key!

### 3. Restart Your Dev Server

```bash
npm run dev
```

### 4. Test the AI Chat

1. Go to http://localhost:3000/ai-config
2. Try asking:
   - "Hi"
   - "What are your business hours?"
   - "Check availability for tomorrow"

The AI should now respond without 503 errors!

## Available Free Models

OpenRouter provides several free models you can use:

### Recommended (Best for our use case):
- `google/gemini-2.0-flash-exp:free` - Latest Gemini, fast and capable **(DEFAULT)**
- `google/gemini-flash-1.5:free` - Stable Gemini 1.5 Flash

### Alternative Free Models:
- `meta-llama/llama-3.1-8b-instruct:free` - Good open-source alternative
- `mistralai/mistral-7b-instruct:free` - Fast and efficient
- `openchat/openchat-7b:free` - Good for conversational tasks

To change models, update `OPENROUTER_MODEL` in `.env.local`.

## Rate Limits (Free Tier)

OpenRouter free tier limits:
- **20 requests per minute** (much better than Gemini direct)
- **200 requests per day**
- No credit card required

For higher limits, you can add credits ($5 minimum), but free tier should be plenty for development and testing.

## Troubleshooting

### "API key is invalid"
- Make sure you copied the full API key from OpenRouter
- API keys start with `sk-or-v1-`
- Check for extra spaces or line breaks

### "Rate limit exceeded"
- Wait 1 minute and try again
- Free tier allows 20 requests/minute
- Our retry logic will handle temporary rate limits automatically

### "Model not found"
- Check the model name is correct (case-sensitive)
- Free models must end with `:free`
- See available models at: https://openrouter.ai/models?order=newest&supported_parameters=tools

### Still getting errors?
- Check your API key is correctly set in `.env.local`
- Restart the dev server after changing env variables
- Check OpenRouter status: https://status.openrouter.ai/

## Cost

**100% FREE** for development and testing:
- No credit card required
- Free tier is generous for our needs
- Function calling (tools) works perfectly on free models

## Benefits Over Direct Gemini

1. **No persistent 503 errors** - OpenRouter has better infrastructure
2. **Native function calling support** - Works out of the box
3. **Better error messages** - Easier to debug
4. **Fallback options** - Can switch models easily if one has issues
5. **Rate limit retry** - Built-in handling works better

---

**Status**: ✅ Ready to use once you add your API key
**Cost**: $0
**Setup Time**: ~2 minutes
