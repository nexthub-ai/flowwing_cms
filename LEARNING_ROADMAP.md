# 🚀 Senior Developer Learning Roadmap
## 4-Hour Intensive Recap for Your FlowWing CMS Project

## 📋 Table of Contents
1. **HOUR 1** - [React Fundamentals in Your Project](#hour-1-react-fundamentals)
2. **HOUR 2** - [TypeScript Deep Dive with Your Code](#hour-2-typescript-deep-dive)
3. **HOUR 3** - [Advanced React Patterns Used](#hour-3-advanced-react-patterns)
4. **HOUR 4** - [Next.js Concepts & When to Migrate](#hour-4-nextjs-concepts)
5. [Redux Migration Guide](#redux-migration)
6. [Code Review & Refactoring](#code-review)
7. [Action Plan](#action-plan)

---

## ⏰ HOUR 1: React Fundamentals in Your Project

### 1.1 Component Architecture (15 mins)

Your project uses **composition pattern** - understand this hierarchy:

```
App.tsx (Root)
  ├── BrowserRouter (Routing)
  ├── QueryClientProvider (Data)
  └── AuthProvider (Auth Context)
      ├── Public Routes
      │   ├── Index (Landing)
      │   ├── AuditStart
      │   └── Pricing
      └── Protected Routes (wrapped in ProtectedRoute)
          ├── Dashboard
          ├── Content
          ├── Audits
          └── Settings
```

**Your Actual Code:**
```tsx
// App.tsx - This is YOUR current structure
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            
            {/* Protected */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
```

### 1.2 Component Types You're Using (20 mins)

#### A. Page Components (Smart/Container)
```tsx
// src/pages/Dashboard.tsx - YOUR CODE
// These handle data fetching and business logic
const Dashboard = () => {
  const { data: stats } = useDashboardStats(); // Custom hook
  
  return (
    <div>
      <Navbar />
      <StatCard title="Audits" value={stats.pendingAudits} />
    </div>
  );
};
```

#### B. Presentational Components (Dumb)
```tsx
// src/components/dashboard/StatCard.tsx - YOUR CODE
// These just render props, no logic
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
}

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="card">
      <Icon />
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
```

#### C. Layout Components
```tsx
// src/components/layout/Navbar.tsx - YOUR CODE
// Reusable UI structure
export function Navbar({ showAuth = true }: { showAuth?: boolean }) {
  const { user } = useAuth();
  
  return (
    <nav>
      <Logo />
      {showAuth && user && <UserMenu />}
    </nav>
  );
}
```

### 1.3 React Router Patterns (15 mins)

**Your routing setup:**
```tsx
// Protected Route HOC (Higher Order Component)
export function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, isLoading, hasRole } = useAuth();
  
  // Loading state
  if (isLoading) return <Loader />;
  
  // Not authenticated
  if (!user) return <Navigate to="/auth" replace />;
  
  // Not authorized
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // All good
  return <>{children}</>;
}
```

**Navigation in your app:**
```tsx
// Declarative (Component)
import { Link } from 'react-router-dom';
<Link to="/audit/start">Start Audit</Link>

// Programmatic (Hook)
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/dashboard');

// With state
navigate('/audit/thank-you', { state: { auditId: '123' } });
```

### 1.4 Props & State Management (10 mins)

**Props flow in your app:**
```tsx
// Parent passes data down
<ContentPost 
  post={post}                    // data
  onDelete={handleDelete}        // callback
  isEditing={editMode}          // state
/>

// Child receives
function ContentPost({ post, onDelete, isEditing }: Props) {
  return (
    <div>
      <h3>{post.title}</h3>
      {isEditing && <Button onClick={() => onDelete(post.id)} />}
    </div>
  );
}
```

**State patterns you use:**
```tsx
// 1. Local UI state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ email: '', name: '' });

// 2. Derived state (don't store this!)
const filteredPosts = posts.filter(p => p.status === 'published'); // ✅
// const [filteredPosts, setFilteredPosts] = useState([]); // ❌ Don't do this

// 3. Server state (managed by React Query)
const { data: audits } = useQuery({ ... }); // ✅ This is server state

// 4. Global state (Context API)
const { user, roles } = useAuth(); // ✅ Auth context
```

---

## ⏰ HOUR 2: TypeScript Deep Dive with Your Code

### 2.1 Your Database Types (10 mins)

**Auto-generated from Supabase:**
```tsx
// src/integrations/supabase/types.ts - YOUR ACTUAL TYPES
export interface Database {
  public: {
    Tables: {
      audit_signups: {
        Row: {
          id: string;
          email: string;
          company_name: string | null;  // Nullable
          status: string;
          created_at: string;
        };
        Insert: {  // For creating new records
          id?: string;  // Optional (auto-generated)
          email: string;
          company_name?: string | null;
        };
        Update: {  // For updating records
          email?: string;
          company_name?: string | null;
        };
      };
    };
  };
}
```

**How you use them:**
```tsx
// hooks/useAuditSignups.ts - YOUR CODE
export interface AuditSignup {
  id: string;
  email: string;
  company_name: string | null;
  status: AuditStatus;  // Custom type
}

// Type-safe query
const { data } = await supabase
  .from('audit_signups')  // TypeScript knows this table
  .select('*')
  .returns<AuditSignup[]>();  // Enforce return type
```

### 2.2 Type Safety in Your Hooks (15 mins)

**Generic Hook Pattern:**
```tsx
// Your custom hook with generics
export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : initialValue;
  });
  
  const updateValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };
  
  return [value, updateValue];
}

// Usage - TypeScript infers the type!
const [theme, setTheme] = useLocalStorage('theme', 'dark'); // theme: string
const [user, setUser] = useLocalStorage('user', null as User | null); // user: User | null
```

**React Query with TypeScript:**
```tsx
// Your useDashboardStats hook
interface DashboardStats {
  pendingAudits: number;
  activeClients: number;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({  // Generic type parameter
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {  // Return type
      // TypeScript ensures you return the right shape
      return {
        pendingAudits: 0,
        activeClients: 0,
      };
    },
  });
}

// Usage - TypeScript knows data type
const { data } = useDashboardStats();
data?.pendingAudits; // ✅ TypeScript knows this exists
data?.wrongField;    // ❌ TypeScript error!
```

### 2.3 Union Types & Discriminated Unions (15 mins)

**Your constant types:**
```tsx
// constants/index.ts - YOUR CODE
export const AUDIT_STATUS = {
  PENDING: 'pending',
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;  // 👈 Makes it readonly

// Extract union type
export type AuditStatus = typeof AUDIT_STATUS[keyof typeof AUDIT_STATUS];
// Result: 'pending' | 'planning' | 'in_progress' | 'completed'

// Now you can use it:
function updateStatus(status: AuditStatus) {
  // TypeScript only allows these 4 values
  console.log(status);
}

updateStatus('pending');     // ✅
updateStatus('invalid');     // ❌ TypeScript error!
```

**Discriminated Union Pattern:**
```tsx
// API Response types
type SuccessResponse = {
  success: true;        // Discriminant
  data: AuditSignup[];
};

type ErrorResponse = {
  success: false;       // Discriminant
  error: string;
};

type ApiResponse = SuccessResponse | ErrorResponse;

// TypeScript narrows the type!
function handleResponse(response: ApiResponse) {
  if (response.success) {
    // TypeScript knows: response is SuccessResponse
    console.log(response.data);    // ✅ data exists
  } else {
    // TypeScript knows: response is ErrorResponse
    console.log(response.error);   // ✅ error exists
  }
}
```

### 2.4 Advanced Type Utilities (20 mins)

**Making types from existing types:**
```tsx
// Your AuditSignup interface
interface AuditSignup {
  id: string;
  email: string;
  company_name: string | null;
  status: AuditStatus;
  created_at: string;
}

// 1. Partial - all optional (for updates)
type AuditUpdate = Partial<AuditSignup>;
// { id?: string; email?: string; company_name?: string | null; ... }

// 2. Pick - select specific fields
type AuditPreview = Pick<AuditSignup, 'id' | 'email' | 'company_name'>;
// { id: string; email: string; company_name: string | null; }

// 3. Omit - exclude fields
type AuditWithoutDates = Omit<AuditSignup, 'created_at' | 'updated_at'>;
// No created_at or updated_at fields

// 4. Required - make all required
type RequiredAudit = Required<AuditSignup>;
// company_name becomes string (not nullable)

// 5. Record - create object type
type StatusColors = Record<AuditStatus, string>;
// { pending: string; planning: string; in_progress: string; completed: string; }

const colors: StatusColors = {
  pending: 'yellow',
  planning: 'blue',
  in_progress: 'purple',
  completed: 'green',
};
```

**Function type patterns:**
```tsx
// Event handler types
type ClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
type ChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
type SubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void;

// Component with typed handlers
interface FormProps {
  onSubmit: SubmitHandler;
  onChange: ChangeHandler;
}

// Async function types
type FetchAudits = () => Promise<AuditSignup[]>;
type UpdateAudit = (id: string, data: Partial<AuditSignup>) => Promise<void>;
```

---

## ⏰ HOUR 3: Advanced React Patterns Used in Your Project

### 3.1 Custom Hooks You've Built (20 mins)

**Your authentication hook:**
```tsx
// hooks/useAuth.tsx - DISSECTING YOUR CODE
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // 1. Set up listener (runs once on mount)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRoles(session.user.id);
        }
      }
    );
    
    // 2. Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });
    
    // 3. Cleanup (runs when component unmounts)
    return () => subscription.unsubscribe();
  }, []); // Empty deps = run once
  
  const hasRole = (role: AppRole) => roles.includes(role);
  
  return { user, roles, isLoading, hasRole };
}
```

**Your data fetching hooks:**
```tsx
// hooks/useContentPosts.ts - YOUR PATTERN
export function useContentPosts(filters?: { status?: ContentStatus }) {
  return useQuery({
    // 1. Cache key (with filters for different queries)
    queryKey: [QUERY_KEYS.CONTENT_POSTS, filters],
    
    // 2. Async fetch function
    queryFn: async () => {
      let query = supabase.from('content_posts').select('*');
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as ContentPost[];
    },
    
    // 3. Options
    refetchInterval: 30000,  // Refetch every 30s
    staleTime: 5000,         // Data fresh for 5s
  });
}

// Usage in component
const { data: posts, isLoading, error, refetch } = useContentPosts({ 
  status: 'published' 
});
```

### 3.2 React Query Patterns (15 mins)

**Mutations (Create/Update/Delete):**
```tsx
// hooks/useContentPosts.ts - YOUR MUTATION PATTERN
export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    // Function that performs the mutation
    mutationFn: async (postData: CreatePostData) => {
      const { data, error } = await supabase
        .from('content_posts')
        .insert(postData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    // After success, invalidate cache to refetch
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.CONTENT_POSTS] 
      });
    },
    
    // Handle errors
    onError: (error) => {
      console.error('Failed to create post:', error);
    },
  });
}

// Usage in component
const createPost = useCreatePost();

const handleSubmit = async () => {
  try {
    await createPost.mutateAsync({
      title: 'New Post',
      content: 'Content here',
    });
    toast({ title: 'Post created!' });
  } catch (error) {
    toast({ title: 'Error!', variant: 'destructive' });
  }
};
```

### 3.3 Context API Pattern (15 mins)

**Your Auth Context pattern:**
```tsx
// Step 1: Create context with type
interface AuthContextType {
  user: User | null;
  roles: AppRole[];
  hasRole: (role: AppRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Step 2: Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  
  const value = { user, roles, hasRole };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Step 3: Custom hook to consume
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}

// Step 4: Usage in App
<AuthProvider>
  <App />
</AuthProvider>

// Step 5: Usage in components
const { user, hasRole } = useAuth();
```

### 3.4 Performance Optimization (10 mins)

**When to use React.memo:**
```tsx
// Expensive component that re-renders often
export const StatCard = React.memo<StatCardProps>(({ 
  title, 
  value, 
  icon 
}) => {
  return <div>...</div>;
});

// Only re-renders if props change
```

**useCallback for stable functions:**
```tsx
const handleDelete = useCallback((id: string) => {
  deletePost.mutate(id);
}, [deletePost]);  // Only recreate if deletePost changes

// Pass to child - child won't re-render unnecessarily
<PostList onDelete={handleDelete} />
```

**useMemo for expensive calculations:**
```tsx
const filteredAndSortedPosts = useMemo(() => {
  return posts
    .filter(p => p.status === 'published')
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}, [posts]);  // Only recalculate when posts change
```

---

## ⏰ HOUR 4: Next.js Concepts & When to Migrate

### 4.1 React (Your Current Setup) vs Next.js

**What you have now (React + Vite):**
```tsx
// Everything runs in browser
// src/pages/Dashboard.tsx
const Dashboard = () => {
  const { data } = useQuery(...);  // Fetches on client
  return <div>{data}</div>;
};

// Pros:
// ✅ Simple mental model
// ✅ Fast dev server
// ✅ Easy deployment
// ✅ Perfect for internal tools

// Cons:
// ❌ No SEO (search engines don't see content)
// ❌ Slow initial load (everything loads in browser)
// ❌ No server-side logic
```

**Next.js equivalent:**
```tsx
// Server component (runs on server)
async function Dashboard() {
  const audits = await db.query('SELECT * FROM audits');  // Runs on server!
  return <div>{audits}</div>;  // HTML sent to browser
}

// Pros:
// ✅ Better SEO
// ✅ Faster initial load
// ✅ Can access database directly
// ✅ Less JavaScript sent to browser

// Cons:
// ❌ More complex
// ❌ Different mental model
// ❌ More expensive hosting
```

### 4.2 Next.js Key Concepts (20 mins)

#### A. File-based Routing
```
// Next.js                    // Your Current (React Router)
app/                          <Route path="/" />
  page.tsx         →  "/"     <Route path="/dashboard" />
  dashboard/                  <Route path="/audit/:id" />
    page.tsx       →  "/dashboard"
  audit/
    [id]/
      page.tsx     →  "/audit/:id"
```

#### B. Server vs Client Components
```tsx
// SERVER COMPONENT (default in Next.js)
// Runs on server, can access database
async function AuditList() {
  const audits = await prisma.audit.findMany();  // Direct DB access!
  return <div>{audits.map(...)}</div>;
}

// CLIENT COMPONENT (like your current React)
'use client';  // 👈 Need this directive
import { useState } from 'react';

function InteractiveButton() {
  const [count, setCount] = useState(0);  // useState only works on client
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

#### C. Data Fetching Patterns
```tsx
// 1. Server Component (SSR - Server Side Rendering)
async function Page() {
  const data = await fetch('https://api.com/data');  // Runs on server
  return <div>{data}</div>;
}

// 2. Client Component (CSR - Client Side Rendering) - YOUR CURRENT WAY
'use client';
function Page() {
  const { data } = useQuery({ ... });  // Runs in browser (like you do now)
  return <div>{data}</div>;
}

// 3. Static (SSG - Static Site Generation)
// Page built at build time, served as static HTML
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}
```

### 4.3 When Should YOU Migrate? (15 mins)

**Stay with React + Vite IF:**
- ✅ Building internal tools (your CMS is internal)
- ✅ Don't need SEO
- ✅ Want simplicity
- ✅ Team is learning React
- ✅ Quick iterations needed

**Migrate to Next.js WHEN:**
- You need public landing pages with SEO
- Want to build API routes (instead of Supabase Edge Functions)
- Need server-side authentication
- Building e-commerce or content-heavy site
- Want to use React Server Components

**Hybrid Approach (BEST FOR YOU):**
```
Keep React + Vite for CMS (private app)
+
Add Next.js for marketing site (public)

flowwing-cms/         ← Your current app (internal)
flowwing-marketing/   ← New Next.js site (public)
```

### 4.4 Next.js Migration Preview (10 mins)

**If you were to migrate your audit page:**

**Current (React + Vite):**
```tsx
// src/pages/AuditStart.tsx
export default function AuditStart() {
  const [formData, setFormData] = useState({ ... });
  
  const handleSubmit = async () => {
    const { data } = await supabase.functions.invoke('create-audit-checkout');
    window.location.href = data.url;  // Redirect to Stripe
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

**Next.js version:**
```tsx
// app/audit/start/page.tsx
'use client';  // This stays client-side (has form state)
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuditStart() {
  const [formData, setFormData] = useState({ ... });
  const router = useRouter();
  
  const handleSubmit = async () => {
    // Call Next.js API route instead of Supabase function
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    const { url } = await res.json();
    router.push(url);
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

// app/api/checkout/route.ts (Server-side API)
export async function POST(req: Request) {
  const body = await req.json();
  const session = await stripe.checkout.sessions.create({ ... });
  return Response.json({ url: session.url });
}
```

### 4.5 Quick Comparison Table

| Feature | React + Vite (You) | Next.js |
|---------|-------------------|---------|
| Rendering | Client-side | Server + Client |
| SEO | ❌ Poor | ✅ Excellent |
| Initial Load | Slow | Fast |
| Development | ✅ Simple | Complex |
| Routing | React Router | File-based |
| API Routes | Supabase Edge Fn | Built-in |
| Hosting | Any static host | Vercel/Node server |
| Learning Curve | ✅ Easy | Steep |
| Your Use Case | ✅ Perfect | Overkill |

---

## 🔍 Code Review & Refactoring Opportunities

### Current Code Quality: **7/10**

### Issues Found:

#### 1. **Hardcoded Data in Dashboard** ❌
```tsx
// Bad - Current Code
<StatCard title="Leads Awaiting Audit" value={8} />
```

**Senior Fix:**
```tsx
// Good - Fetch real data
const { data: stats } = useQuery({
  queryKey: ['dashboard-stats'],
  queryFn: async () => {
    const { data } = await supabase
      .from('audit_signups')
      .select('status', { count: 'exact' })
      .eq('status', 'pending');
    return { pendingAudits: data?.length || 0 };
  }
});
```

#### 2. **No Custom Hooks for Data Fetching** ❌
```tsx
// Bad - Inline queries everywhere
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: async () => { /* ... */ }
});
```

**Senior Fix:** Create custom hooks
```tsx
// hooks/useContentPosts.ts
export function useContentPosts() {
  return useQuery({
    queryKey: ['content-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
}

// Usage
const { data: posts, isLoading, error } = useContentPosts();
```

#### 3. **No Error Boundaries** ❌
Your app will crash on any error. Need error boundaries.

#### 4. **setTimeout Hack in Auth** ⚠️
```tsx
setTimeout(() => {
  fetchUserRoles(session.user.id);
}, 0);
```
This is a code smell. Better to use proper async/await patterns.

#### 5. **Magic Strings & No Constants** ❌
```tsx
// Bad
.eq('status', 'pending')
```

**Senior Fix:**
```tsx
// constants/auditStatus.ts
export const AUDIT_STATUS = {
  PENDING: 'pending',
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed'
} as const;

// Usage
.eq('status', AUDIT_STATUS.PENDING)
```

---

## 🎣 React Hooks Deep Dive

### Hook Rules (CRITICAL)
1. ✅ Only call hooks at top level
2. ✅ Only call hooks in React functions
3. ✅ Custom hooks must start with "use"

### Essential Hooks You Must Master:

#### 1. **useState** - Local State
```tsx
// Basic
const [count, setCount] = useState(0);

// With function (lazy initialization)
const [user, setUser] = useState(() => {
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
});

// Update with previous state
setCount(prev => prev + 1);
```

#### 2. **useEffect** - Side Effects
```tsx
// Run once on mount
useEffect(() => {
  fetchData();
}, []); // Empty deps = mount only

// Run when userId changes
useEffect(() => {
  fetchUserData(userId);
}, [userId]);

// Cleanup function
useEffect(() => {
  const subscription = subscribeToData();
  return () => subscription.unsubscribe(); // Cleanup
}, []);
```

#### 3. **useCallback** - Memoize Functions
```tsx
// Bad - Creates new function on every render
const handleClick = () => {
  console.log('clicked');
};

// Good - Memoized function
const handleClick = useCallback(() => {
  console.log('clicked');
}, []); // Only recreate if deps change
```

#### 4. **useMemo** - Memoize Values
```tsx
// Expensive calculation
const expensiveValue = useMemo(() => {
  return posts.filter(p => p.status === 'published')
    .map(p => ({ ...p, formatted: formatPost(p) }));
}, [posts]); // Only recalculate when posts change
```

#### 5. **useRef** - Persist Values
```tsx
// DOM reference
const inputRef = useRef<HTMLInputElement>(null);
const focusInput = () => inputRef.current?.focus();

// Persist value without re-render
const countRef = useRef(0);
countRef.current++; // No re-render
```

#### 6. **Custom Hooks Pattern** (IMPORTANT)
```tsx
// hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const updateValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, updateValue] as const;
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'dark');
```

---

## 🔄 Redux Migration Guide

### Phase 1: Setup Redux Toolkit

```bash
npm install @reduxjs/toolkit react-redux
```

### Phase 2: Create Store Structure

```
src/
  store/
    index.ts              # Configure store
    slices/
      authSlice.ts        # Auth state
      uiSlice.ts          # UI state (modals, theme)
      auditSlice.ts       # Audit workflow
    hooks.ts              # Typed hooks
```

### Phase 3: Implementation

#### A. Configure Store
```tsx
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For Supabase objects
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### B. Create Auth Slice
```tsx
// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'admin' | 'pms' | 'creator' | 'client';

interface AuthState {
  user: User | null;
  roles: AppRole[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  roles: [],
  isLoading: true,
  error: null,
};

// Async thunk for fetching roles
export const fetchUserRoles = createAsyncThunk(
  'auth/fetchRoles',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data.map(r => r.role as AppRole);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setRoles: (state, action: PayloadAction<AppRole[]>) => {
      state.roles = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.roles = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserRoles.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch roles';
        state.isLoading = false;
      });
  },
});

export const { setUser, setRoles, clearAuth } = authSlice.actions;
export default authSlice.reducer;
```

#### C. Typed Hooks
```tsx
// store/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

#### D. Provider Setup
```tsx
// App.tsx
import { Provider } from 'react-redux';
import { store } from './store';

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      {/* ... */}
    </QueryClientProvider>
  </Provider>
);
```

#### E. Usage in Components
```tsx
// Before (Context)
const { user, roles, hasRole } = useAuth();

// After (Redux)
import { useAppSelector, useAppDispatch } from '@/store/hooks';

const user = useAppSelector((state) => state.auth.user);
const roles = useAppSelector((state) => state.auth.roles);
const dispatch = useAppDispatch();
```

---

## 📘 TypeScript Fundamentals

### 1. Basic Types
```tsx
// Primitives
const name: string = "John";
const age: number = 25;
const isActive: boolean = true;
const nothing: null = null;
const notDefined: undefined = undefined;

// Arrays
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ["John", "Jane"];

// Objects
const user: { name: string; age: number } = {
  name: "John",
  age: 25
};
```

### 2. Interfaces vs Types
```tsx
// Interface (for objects, can extend)
interface User {
  id: string;
  name: string;
  email: string;
}

interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Type (more flexible, can be union/intersection)
type Status = 'pending' | 'approved' | 'rejected';
type ID = string | number;
type UserOrAdmin = User | Admin;
```

### 3. Generics (POWERFUL)
```tsx
// Generic function
function getFirstItem<T>(array: T[]): T | undefined {
  return array[0];
}

const firstNumber = getFirstItem([1, 2, 3]); // number
const firstName = getFirstItem(['a', 'b']); // string

// Generic component
interface Props<T> {
  items: T[];
  onSelect: (item: T) => void;
}

function List<T>({ items, onSelect }: Props<T>) {
  return (
    <ul>
      {items.map((item, i) => (
        <li key={i} onClick={() => onSelect(item)}>
          {JSON.stringify(item)}
        </li>
      ))}
    </ul>
  );
}
```

### 4. Utility Types
```tsx
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Partial - all optional
type PartialUser = Partial<User>;

// Pick - select specific fields
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

// Omit - exclude fields
type UserWithoutPassword = Omit<User, 'password'>;

// Required - all required
type RequiredUser = Required<Partial<User>>;

// Record - key-value pairs
type StatusMap = Record<string, { color: string; icon: string }>;
```

### 5. Type Guards
```tsx
// Type predicate
function isAdmin(user: User | Admin): user is Admin {
  return 'permissions' in user;
}

// Usage
if (isAdmin(user)) {
  console.log(user.permissions); // TypeScript knows it's Admin
}
```

### 6. React + TypeScript
```tsx
// Function Component
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={variant}
    >
      {label}
    </button>
  );
};

// With children
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

// Event handlers
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

---

## ⚡ Next.js vs React (Your Current Setup)

### Current: React + Vite
```
✅ Client-side rendering (CSR)
✅ Fast dev server
✅ Simple deployment
❌ No SEO optimization
❌ No server-side rendering
❌ Manual routing setup
```

### Next.js Benefits:
```
✅ Server-side rendering (SSR)
✅ Static site generation (SSG)
✅ API routes built-in
✅ File-based routing
✅ Image optimization
✅ Better SEO
✅ Automatic code splitting
```

### When to Use Next.js:
1. **SEO matters** (marketing sites, blogs)
2. **Need server-side logic** (APIs, auth)
3. **Large apps** (better performance)
4. **E-commerce** (dynamic content)

### Your Current Setup is FINE for:
1. **Internal tools** (like your CMS)
2. **SPAs** (single page apps)
3. **Learning React** (less complexity)
4. **Dashboard apps** (no SEO needed)

### Migration Complexity: **HIGH**
- Need to rewrite routing
- Different data fetching patterns
- Server vs client components
- More complex deployment

**Recommendation:** Stay with React + Vite for now. Focus on mastering React, TypeScript, and state management first.

---

## 📝 Action Plan

### Week 1-2: Code Quality & Refactoring
- [ ] Create constants file for status strings
- [ ] Extract custom hooks for data fetching
- [ ] Add error boundaries
- [ ] Implement loading states everywhere
- [ ] Fix setTimeout hack in auth

### Week 3-4: Advanced Hooks
- [ ] Create useLocalStorage hook
- [ ] Create useDebounce hook
- [ ] Create useAsync hook
- [ ] Implement proper useCallback/useMemo
- [ ] Build useInfiniteScroll hook

### Week 5-6: TypeScript Mastery
- [ ] Add strict type checking
- [ ] Create proper type definitions
- [ ] Use generics in custom hooks
- [ ] Implement type guards
- [ ] Remove all 'any' types

### Week 7-8: Redux Migration
- [ ] Setup Redux Toolkit
- [ ] Migrate auth from Context to Redux
- [ ] Create UI slice for modals/theme
- [ ] Add Redux DevTools
- [ ] Keep React Query for server state

### Week 9-10: Testing & Performance
- [ ] Add unit tests (Vitest)
- [ ] Add integration tests
- [ ] Implement code splitting
- [ ] Add React.memo where needed
- [ ] Performance profiling

### Week 11-12: Advanced Features
- [ ] Add real-time subscriptions (Supabase)
- [ ] Implement offline support
- [ ] Add analytics
- [ ] Improve error handling
- [ ] Documentation

---

## 🎯 Priority Refactoring Tasks (Start Here)

### Task 1: Create Custom Hooks
```tsx
// hooks/useAuditSignups.ts
export function useAuditSignups(status?: string) {
  return useQuery({
    queryKey: ['audit-signups', status],
    queryFn: async () => {
      let query = supabase
        .from('audit_signups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });
}
```

### Task 2: Create Constants
```tsx
// constants/index.ts
export const AUDIT_STATUS = {
  PENDING: 'pending',
  PLANNING: 'planning',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed'
} as const;

export const CONTENT_STATUS = {
  DRAFT: 'draft',
  REVIEW: 'review',
  APPROVED: 'approved',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  REJECTED: 'rejected'
} as const;

export const PLATFORMS = {
  INSTAGRAM: 'instagram',
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  FACEBOOK: 'facebook'
} as const;
```

### Task 3: Fix Dashboard Data
```tsx
// hooks/useDashboardStats.ts
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [audits, clients] = await Promise.all([
        supabase.from('audit_signups').select('status', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' })
      ]);
      
      return {
        pendingAudits: audits.count || 0,
        totalClients: clients.count || 0
      };
    }
  });
}
```

---

## 📚 Resources

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### React Hooks
- [React Docs - Hooks](https://react.dev/reference/react)
- [useHooks.com](https://usehooks.com/)

### Redux
- [Redux Toolkit Tutorial](https://redux-toolkit.js.org/tutorials/quick-start)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

### Next.js
- [Next.js Learn](https://nextjs.org/learn)
- When you're ready to migrate (6+ months from now)

---

## 🎓 Learning Philosophy

1. **Master one thing at a time** - Don't try to learn everything at once
2. **Build features, not tutorials** - Apply learning to your actual project
3. **Read other people's code** - Study open source projects
4. **Refactor ruthlessly** - Your first implementation is never perfect
5. **Test everything** - Tests prevent regressions

**Your current stack is EXCELLENT for learning. Stay focused!**
