# Phase 2 Setup Instructions

## Supabase Setup (Required)

### 1. Create a Supabase Project (Free Tier)

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: ai-receptionist (or your choice)
   - **Database Password**: Save this securely
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is selected by default
5. Click "Create new project" (takes ~2 minutes)

**⚠️ Note**: Free tier includes 500MB database, 2GB bandwidth, 50,000 monthly active users. No credit card required.

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - click "Reveal" to see it)

### 3. Configure Environment Variables

1. In the project root, create a `.env.local` file:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**⚠️ IMPORTANT**: 
- Never commit `.env.local` to git
- The `SUPABASE_SERVICE_ROLE_KEY` has admin access - keep it secret
- Only `NEXT_PUBLIC_*` variables are exposed to the browser

### 4. Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

This creates all tables, RLS policies, and triggers.

### 5. Verify Database Setup

Go to **Table Editor** in Supabase dashboard. You should see these tables:
- ✅ profiles
- ✅ businesses
- ✅ business_members
- ✅ business_settings
- ✅ business_hours

## Running the Application

1. Stop the current dev server if running (Ctrl+C)
2. Restart the dev server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)
4. You'll be redirected to `/auth/login`

## Testing Authentication

### Sign Up Flow
1. Go to http://localhost:3000
2. Click "Sign up"
3. Enter:
   - Full Name
   - Email
   - Password (min 6 characters)
4. Click "Create account"
5. You'll be redirected to onboarding

### Onboarding Flow
1. **Step 1 - Business Information**:
   - Business Name (required)
   - Business Type (optional)
   - Timezone (required)
2. **Step 2 - Contact Details**:
   - Phone, Email, Address (all optional)
3. **Step 3 - Business Hours**:
   - Toggle days open/closed
   - Set hours for each day
4. Click "Complete Setup"
5. You'll be redirected to the dashboard

### Login Flow
1. Go to http://localhost:3000
2. Enter email and password
3. You'll see your dashboard with business data

### Logout
1. Click your name in the top-right header
2. Click "Sign out"
3. You'll be redirected to login page

## Verify Row Level Security

To test that RLS policies work:

1. Create two accounts with different emails
2. Create a business with Account A
3. Log out and log in with Account B
4. Account B should NOT see Account A's business
5. Create a business with Account B
6. Both accounts should only see their own business

## Troubleshooting

### "Invalid API key" error
- Check that your `.env.local` file exists
- Verify the Supabase URL and keys are correct
- Restart the dev server after changing env vars

### "Failed to fetch" or CORS errors
- Check your Supabase project URL is correct
- Ensure the project is not paused (Supabase pauses inactive projects)

### Database errors during migration
- Make sure you copied the ENTIRE SQL file
- Run the query again (it's safe to run multiple times)
- Check the Supabase logs for specific errors

### Redirected to login after signup
- Check Supabase → Authentication → Users to see if user was created
- Check browser console for errors
- Verify email confirmation is disabled: 
  - Go to Authentication → Settings
  - Disable "Enable email confirmations" for development

### "Row Level Security Policy Violation"
- This means RLS is working correctly
- Make sure you're logged in
- Try logging out and back in

## Email Configuration (Optional)

By default, Supabase requires email confirmation. For development:

1. Go to **Authentication** → **Settings** → **Auth Providers**
2. Scroll to **Email Auth**
3. Uncheck "Enable email confirmations"
4. Click **Save**

This allows immediate login after signup during development.

## Database Browser

To view/edit data directly:
1. Go to **Table Editor** in Supabase
2. Select a table to view/edit rows
3. Useful for debugging

## What's Next?

Phase 2 is complete when:
- ✅ User can sign up, login, logout
- ✅ Unauthenticated users redirected to login
- ✅ New users complete onboarding
- ✅ Dashboard displays user's business
- ✅ RLS prevents cross-business data access

Move to Phase 3: Implement real appointment and contact management with database integration.
