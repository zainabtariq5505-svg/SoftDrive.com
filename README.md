# Soft Drive — Premium Cloud Storage SaaS

> Secure. Fast. Professional Cloud Storage.

A production-ready, enterprise-grade cloud storage platform built with Next.js 16, Tailwind CSS v4, and Supabase.

## Features

- **Authentication** — Email/password + Google + GitHub OAuth with JWT sessions
- **File Management** — Upload, organize, rename, star, trash & restore files
- **Folder System** — Nested folders with breadcrumb navigation
- **Video Streaming** — High-quality video upload and in-browser streaming
- **Shareable Links** — Public/private links with passwords, permissions & expiry
- **Storage Quota** — 30 GB per user with real-time usage tracking
- **Admin Dashboard** — User management, analytics charts, activity logs
- **Dark Mode** — Seamless light/dark mode with system preference detection
- **Chunked Uploads** — Large file uploads up to 5 GB per file
- **Premium UI** — Glassmorphism, Framer Motion animations, skeleton loaders

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| UI Components | Radix UI primitives |
| Icons | Lucide React |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Deployment | Vercel + Cloudflare CDN |

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a project at [app.supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** and run the entire contents of `supabase/schema.sql`
3. Go to **Storage** → create a bucket named `files` (set to private)
4. Apply the storage policies from `supabase/schema.sql` comments

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configure Supabase Auth

In Supabase Dashboard → **Authentication**:
- **Providers**: Enable Google OAuth and GitHub OAuth
- **URL Configuration**: Add `http://localhost:3000` as Site URL
- **Redirect URLs**: `http://localhost:3000/auth/callback`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles, storage usage, roles |
| `files` | File metadata with soft-delete (trash) |
| `folders` | Nested folder structure |
| `shared_links` | Shareable links with permissions |
| `activity_logs` | User activity tracking |
| `subscriptions` | Plan management |

All tables use **Row Level Security (RLS)** policies.

## Pages

### Public Pages
| Page | Route |
|------|-------|
| Landing | `/` |
| Features | `/features` |
| Pricing | `/pricing` |
| About | `/about` |
| Contact | `/contact` |
| Login | `/login` |
| Signup | `/signup` |
| Shared File | `/share/[token]` |

### Private Pages (auth required)
| Page | Route |
|------|-------|
| My Drive | `/dashboard` |
| Shared Files | `/dashboard/shared` |
| Recent | `/dashboard/recent` |
| Favorites | `/dashboard/favorites` |
| Trash | `/dashboard/trash` |
| Settings | `/dashboard/settings` |
| Admin Panel | `/dashboard/admin` |

## Deployment

### Deploy to Vercel

```bash
vercel deploy
```

Set all environment variables in the Vercel dashboard. Update Supabase auth settings with your production domain.

## Making a User Admin

Run in Supabase SQL editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_APP_URL` | Your app URL |

## License

MIT
