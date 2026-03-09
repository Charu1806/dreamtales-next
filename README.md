# DreamTales

An AI-powered personalized bedtime story generator for children, built with Next.js 16 and Supabase.

## What it does

Parents create a **child persona** (name, age, interests, language, fears) and the app generates a custom 5-page bedtime story tailored to that child. Stories are saved and can be re-read anytime.

## Tech Stack

- **Next.js 16** — App Router, file-based routing, proxy middleware
- **TypeScript** — Full type safety with generated Supabase types
- **Supabase** — Auth (magic link OTP), PostgreSQL database, file storage
- **Tailwind CSS v4** — Custom DreamTales design system (lavender/cream/yellow palette)
- **shadcn/ui** — Button, Input, Select, Toast components

## Features

- Passwordless email magic link authentication
- Child persona creation with photo upload
- AI story generation (mock — plug in your AI provider)
- Multi-page story reader with navigation
- Story history per child
- Protected routes via proxy middleware

## Project Structure

```
app/
  page.tsx                          # Welcome / landing
  login/page.tsx                    # Magic link login
  dashboard/page.tsx                # Persona overview
  persona/new/page.tsx              # Create child profile
  story/generate/[personaId]/       # Generate a story
  story/[storyId]/                  # Read a story
  stories/[personaId]/              # Story history
  auth/callback/                    # Supabase OAuth callback
proxy.ts                            # Auth route protection
lib/supabase/                       # Supabase client (browser + server)
components/                         # UI components
hooks/                              # useAuth, use-toast
```

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Charu1806/dreamtales-next.git
cd dreamtales-next
npm install
```

### 2. Set up environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Configure Supabase

In your Supabase project dashboard:
- **Authentication → URL Configuration**
  - Site URL: `http://localhost:3000`
  - Redirect URLs: `http://localhost:3000/auth/callback`

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deploy to Vercel with one click — set the environment variables in the Vercel dashboard and update the Supabase redirect URLs to your production domain.
