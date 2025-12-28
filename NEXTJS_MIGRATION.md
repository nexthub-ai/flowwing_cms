# 🚀 Next.js Migration Guide
## FlowWing CMS: React + Vite → Next.js 15 (App Router)

---

## 📋 Migration Strategy

### Phase 1: Setup (30 mins)
1. Create new Next.js app alongside current app
2. Copy over configuration files
3. Setup TypeScript, Tailwind, shadcn/ui

### Phase 2: Core Infrastructure (1 hour)
1. Configure Supabase for Next.js (server + client)
2. Setup middleware for auth
3. Create layout structure

### Phase 3: Page Migration (2-3 hours)
1. Migrate public pages (landing, pricing)
2. Migrate auth pages
3. Migrate protected pages (dashboard, content, etc.)

### Phase 4: Components & Hooks (1-2 hours)
1. Copy components (most work as-is)
2. Add 'use client' where needed
3. Migrate custom hooks

### Phase 5: Testing & Cleanup (1 hour)
1. Test all routes
2. Fix any issues
3. Remove old Vite app
4. Deploy to Vercel

**Total Time: 5-7 hours**

---

## 🗂️ New Folder Structure

```
flowwing-cms/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth layout group
│   │   └── auth/
│   │       └── page.tsx          # /auth
│   ├── (public)/                 # Public layout group
│   │   ├── page.tsx              # / (landing)
│   │   ├── pricing/
│   │   │   └── page.tsx          # /pricing
│   │   └── audit/
│   │       ├── start/
│   │       │   └── page.tsx      # /audit/start
│   │       └── thank-you/
│   │           └── page.tsx      # /audit/thank-you
│   ├── (protected)/              # Protected layout group
│   │   ├── layout.tsx            # Protected layout wrapper
│   │   ├── dashboard/
│   │   │   └── page.tsx          # /dashboard
│   │   ├── content/
│   │   │   └── page.tsx          # /content
│   │   ├── audits/
│   │   │   └── page.tsx          # /audits
│   │   ├── clients/
│   │   │   └── page.tsx          # /clients
│   │   ├── tools/
│   │   │   └── page.tsx          # /tools
│   │   ├── workflow/
│   │   │   └── page.tsx          # /workflow
│   │   ├── admin/
│   │   │   └── page.tsx          # /admin
│   │   ├── audit-management/
│   │   │   └── page.tsx          # /audit-management
│   │   └── settings/
│   │       └── page.tsx          # /settings
│   ├── api/                      # API Routes
│   │   ├── checkout/
│   │   │   └── route.ts          # POST /api/checkout
│   │   └── webhook/
│   │       └── route.ts          # POST /api/webhook
│   ├── layout.tsx                # Root layout
│   ├── not-found.tsx             # 404 page
│   └── error.tsx                 # Error boundary
├── components/                   # Shared components (same as before)
│   ├── dashboard/
│   ├── landing/
│   ├── layout/
│   └── ui/
├── lib/                          # Utilities
│   ├── supabase/
│   │   ├── client.ts             # Client-side Supabase
│   │   ├── server.ts             # Server-side Supabase
│   │   └── middleware.ts         # Middleware helper
│   ├── utils.ts
│   └── stripe-config.ts
├── hooks/                        # Client-side hooks
├── constants/
├── middleware.ts                 # Next.js middleware (auth)
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔄 Key Changes

### 1. Routing
**Before (React Router):**
```tsx
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/dashboard" element={
    <ProtectedRoute><Dashboard /></ProtectedRoute>
  } />
</Routes>
```

**After (Next.js):**
```
app/
  page.tsx                    → /
  (protected)/
    dashboard/
      page.tsx                → /dashboard (auto-protected by middleware)
```

### 2. Data Fetching

**Before (Client-side with React Query):**
```tsx
// Client component
const Dashboard = () => {
  const { data, isLoading } = useQuery({ ... });
  return <div>{data}</div>;
};
```

**After (Server Component):**
```tsx
// Server component (default in Next.js)
import { createClient } from '@/lib/supabase/server';

export default async function Dashboard() {
  const supabase = createClient();
  const { data } = await supabase.from('audit_signups').select('*');
  
  return <div>{data}</div>;  // No loading state needed!
}
```

**For Interactive Components:**
```tsx
'use client';  // Mark as client component
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const { data, isLoading } = useQuery({ ... });
  return <div>{data}</div>;
}
```

### 3. Authentication

**Before (Context API):**
```tsx
<AuthProvider>
  <App />
</AuthProvider>
```

**After (Middleware):**
```tsx
// middleware.ts - Runs on every request
export async function middleware(request: NextRequest) {
  const { supabase, response } = createServerClient(request);
  const { data: { session } } = await supabase.auth.getSession();
  
  // Redirect if not authenticated
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  return response;
}
```

### 4. API Routes

**Before (Supabase Edge Functions):**
```tsx
const { data } = await supabase.functions.invoke('create-checkout');
```

**After (Next.js API Routes):**
```tsx
// app/api/checkout/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const session = await stripe.checkout.sessions.create({ ... });
  return Response.json({ url: session.url });
}

// Usage
const res = await fetch('/api/checkout', {
  method: 'POST',
  body: JSON.stringify(data),
});
```

---

## 📦 Installation Commands

```bash
# 1. Create new Next.js app in same directory
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false

# 2. Install dependencies
npm install @supabase/ssr @supabase/supabase-js
npm install @tanstack/react-query
npm install stripe
npm install zod react-hook-form @hookform/resolvers
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install date-fns
npm install sonner

# 3. Install shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button input label card badge dialog select
npx shadcn@latest add toast dropdown-menu avatar tabs table
```

---

## 🔐 Supabase Setup for Next.js

### 1. Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Supabase Client (Client-side)
```tsx
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### 3. Supabase Client (Server-side)
```tsx
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
```

### 4. Middleware
```tsx
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.delete({ name, ...options });
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  // Protected routes
  const protectedPaths = [
    '/dashboard',
    '/content',
    '/audits',
    '/clients',
    '/tools',
    '/workflow',
    '/admin',
    '/audit-management',
    '/settings',
  ];

  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (request.nextUrl.pathname === '/auth' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

## 📄 Example Page Migrations

### Landing Page (Server Component)
```tsx
// app/page.tsx
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { PricingSection } from '@/components/landing/PricingSection';

export default function HomePage() {
  return (
    <>
      <Navbar showAuth={false} />
      <Hero />
      <Features />
      <PricingSection />
    </>
  );
}
```

### Dashboard (Server Component with Data Fetching)
```tsx
// app/(protected)/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { StatCard } from '@/components/dashboard/StatCard';

export default async function DashboardPage() {
  const supabase = createClient();
  
  // Fetch data on server
  const [auditsResult, clientsResult] = await Promise.all([
    supabase.from('audit_signups').select('status'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
  ]);

  const stats = {
    pendingAudits: auditsResult.data?.filter(a => a.status === 'pending').length || 0,
    activeClients: clientsResult.count || 0,
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          <h1>Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-4">
            <StatCard 
              title="Pending Audits" 
              value={stats.pendingAudits}
            />
            <StatCard 
              title="Active Clients" 
              value={stats.activeClients}
            />
          </div>
        </div>
      </main>
    </>
  );
}
```

### Content Page (Client Component for Interactivity)
```tsx
// app/(protected)/content/page.tsx
'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export default function ContentPage() {
  const supabase = createClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['content-posts'],
    queryFn: async () => {
      const { data } = await supabase.from('content_posts').select('*');
      return data;
    },
  });

  return (
    <div>
      {/* Your existing Content page code */}
    </div>
  );
}
```

---

## 🎯 Migration Checklist

### Setup
- [ ] Run `npx create-next-app@latest`
- [ ] Install dependencies
- [ ] Setup shadcn/ui
- [ ] Configure environment variables
- [ ] Copy constants, types, utils

### Supabase
- [ ] Create `lib/supabase/client.ts`
- [ ] Create `lib/supabase/server.ts`
- [ ] Create `middleware.ts`
- [ ] Test authentication flow

### Pages (in order)
- [ ] Landing page (`app/page.tsx`)
- [ ] Auth page (`app/(auth)/auth/page.tsx`)
- [ ] Pricing (`app/(public)/pricing/page.tsx`)
- [ ] Audit Start (`app/(public)/audit/start/page.tsx`)
- [ ] Dashboard (`app/(protected)/dashboard/page.tsx`)
- [ ] Content (`app/(protected)/content/page.tsx`)
- [ ] Audits (`app/(protected)/audits/page.tsx`)
- [ ] Clients (`app/(protected)/clients/page.tsx`)
- [ ] Tools (`app/(protected)/tools/page.tsx`)
- [ ] Workflow (`app/(protected)/workflow/page.tsx`)
- [ ] Admin (`app/(protected)/admin/page.tsx`)
- [ ] Audit Management (`app/(protected)/audit-management/page.tsx`)
- [ ] Settings (`app/(protected)/settings/page.tsx`)

### Components
- [ ] Copy all components from `src/components`
- [ ] Add 'use client' to interactive components
- [ ] Test each component

### Layouts
- [ ] Root layout (`app/layout.tsx`)
- [ ] Protected layout (`app/(protected)/layout.tsx`)
- [ ] Auth layout (`app/(auth)/layout.tsx`)

### API Routes
- [ ] Checkout API (`app/api/checkout/route.ts`)
- [ ] Webhook API (`app/api/webhook/route.ts`)

### Testing
- [ ] Test all routes
- [ ] Test authentication
- [ ] Test data fetching
- [ ] Test forms and mutations
- [ ] Test protected routes
- [ ] Test API routes

### Cleanup
- [ ] Remove old Vite config
- [ ] Remove React Router code
- [ ] Remove old build files
- [ ] Update package.json scripts

### Deployment
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Configure environment variables on Vercel
- [ ] Test production build

---

## 🚀 Next Steps

After reviewing this plan, we'll:
1. Backup your current code
2. Start with Next.js setup
3. Migrate pages one by one
4. Test thoroughly
5. Deploy

Ready to start? Say "let's begin" and I'll create the Next.js setup!
