# AI Receptionist SaaS

A comprehensive AI-powered receptionist system that handles incoming phone calls, books appointments, answers questions, and manages customer interactions for businesses.

## 🎯 Current Status: Phase 2 Complete

✅ **Phase 1**: Professional dashboard UI with mock data  
✅ **Phase 2**: Supabase database, authentication, and business onboarding

### Phase 2 Features
- **Authentication**: Sign up, login, logout with Supabase Auth
- **Protected Routes**: Middleware-based route protection
- **Business Onboarding**: Multi-step wizard for business setup
- **Multi-tenant Database**: RLS policies for data isolation
- **Profile Management**: Automatic profile creation
- **Business Hours**: Configurable operating hours
- **Session Management**: Secure server-side session handling

## 📋 Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth
- **Validation**: Zod
- **AI Provider**: OpenAI-compatible API (Phase 4)
- **Telephony**: Twilio Voice & Media Streams (Phase 6)
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Supabase account (free tier)

### Installation

1. **Clone and install dependencies**
```bash
cd ai-receptionist
npm install
```

2. **Set up Supabase** (see [SETUP.md](./SETUP.md) for detailed instructions)
   - Create a Supabase project
   - Run the database migration
   - Copy environment variables

3. **Configure environment**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

See [SETUP.md](./SETUP.md) for complete setup instructions.

## 📊 Database Schema

### Tables
- **profiles**: User profiles (linked to auth.users)
- **businesses**: Business information
- **business_members**: User-business relationships with roles
- **business_settings**: AI and business configuration
- **business_hours**: Operating hours by day

### Row Level Security
- Users can only access businesses they belong to
- Role-based permissions (owner, admin, member)
- Automatic profile creation on signup

## 🔒 Security

- Row Level Security (RLS) on all tables
- Server-side session validation
- Protected API routes
- Middleware-based authentication
- Service role key never exposed to browser

## 🗺️ Completed Phases

### ✅ Phase 1: Project Setup & Dashboard UI
- Professional SaaS dashboard
- Mock data and UI components
- All main pages and navigation

### ✅ Phase 2: Database & Authentication
- Supabase integration
- User authentication (signup, login, logout)
- Business onboarding flow
- Multi-tenant database with RLS
- Automatic profile and business creation

## 📅 Next Phases

### Phase 3: Core Business Logic (Next)
- Replace mock data with real database queries
- Appointment CRUD operations
- Contact management
- Knowledge base management
- Business settings management

### Phase 4: AI Integration
- LLM provider integration
- Tool calling system
- Knowledge base retrieval
- Conversation management

### Phase 5: Browser Voice Testing
- Web-based voice interface
- Speech-to-text
- Text-to-speech

### Phase 6: Twilio Integration
- Phone call handling
- Real-time audio streaming
- Call recording and transcription

### Phase 7: Production Ready
- Notifications
- Analytics
- Testing
- Deployment

## 💰 Budget: $0 (Free Tier)

All services use free tiers:
- **Vercel**: Free deployment
- **Supabase**: 500MB database, no credit card required
- **Twilio**: Trial credits for Phase 6 testing

## 📖 Documentation

- [SETUP.md](./SETUP.md) - Complete setup instructions for Phase 2
- [.env.example](./.env.example) - Environment variables template
- [supabase/migrations/](./supabase/migrations/) - Database schema

## 🧪 Testing Authentication

1. Sign up at http://localhost:3000/auth/signup
2. Complete business onboarding
3. View your dashboard
4. Sign out and sign back in

## 📝 Environment Variables

See `.env.example` for all required variables. Key variables:

```env
# Supabase (Required for Phase 2+)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Provider (Phase 4)
AI_API_KEY=
AI_MODEL=

# Twilio (Phase 6)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

## 🏗️ Project Structure

```
ai-receptionist/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   ├── auth/                 # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── callback/
│   └── onboarding/           # Business setup wizard
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── sidebar.tsx
│   └── header.tsx
├── lib/
│   ├── supabase/            # Supabase client utilities
│   ├── actions/             # Server actions
│   ├── database.types.ts    # TypeScript types
│   ├── mock-data.ts         # Development mock data
│   └── utils.ts
├── supabase/
│   └── migrations/          # SQL migration files
└── middleware.ts            # Route protection
```

## 🔧 Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## ⚠️ Important Notes

- Never commit `.env.local` - it contains secrets
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS - keep it server-side only
- Mock data still used for calls, appointments, contacts (will be replaced in Phase 3)
- Email confirmation is disabled for development (configure in Supabase dashboard)

## 📄 License

This project is for educational and development purposes.
