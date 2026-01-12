import { Suspense } from 'react';
import { createClient } from '@/supabase/server';
import { DashboardService } from '@/services/dashboardService';
import { Sidebar } from '@/components/layout/Sidebar';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ClientList } from '@/components/dashboard/ClientList';
import { 
  FileText, 
  Users, 
  CheckCircle2, 
  Clock,
  Plus,
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Dashboard Page (Server Component)
 * Fetches data on the server for better performance and SEO
 */
export default async function DashboardPage() {
  // Fetch dashboard stats on server
  const supabase = await createClient();
  const stats = await DashboardService.getDashboardStats(supabase);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="container py-8 px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your agency.
              </p>
            </div>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              New Audit
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Leads Awaiting Audit"
              value={stats.pendingAudits}
              change={stats.pendingAudits > 0 ? "+3 this week" : "All caught up"}
              changeType={stats.pendingAudits > 5 ? "negative" : "positive"}
              icon={FileText}
            />
            <StatCard
              title="Audits In Progress"
              value={stats.auditsInProgress}
              change={stats.auditsInProgress > 0 ? "2 due today" : "None active"}
              changeType="neutral"
              icon={Clock}
            />
            <StatCard
              title="Active Clients"
              value={stats.activeClients}
              change="+2 this month"
              changeType="positive"
              icon={Users}
            />
            <StatCard
              title="Pending Approvals"
              value={stats.pendingApprovals}
              change={stats.pendingApprovals > 3 ? "3 urgent" : "On track"}
              changeType={stats.pendingApprovals > 5 ? "negative" : "positive"}
              icon={CheckCircle2}
            />
          </div>

          {/* Content Grid - Client Components with Suspense */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Suspense fallback={<LoadingCard />}>
              <RecentActivity />
            </Suspense>
            <Suspense fallback={<LoadingCard />}>
              <ClientList />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Loading state for async components
 */
function LoadingCard() {
  return (
    <div className="p-6 bg-card border rounded-lg flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
