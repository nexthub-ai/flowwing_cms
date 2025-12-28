import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ClientList } from "@/components/dashboard/ClientList";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { 
  FileText, 
  Users, 
  CheckCircle2, 
  Clock,
  Plus,
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container px-6">
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 text-destructive mb-8">
              Failed to load dashboard statistics. Please try again.
            </div>
          )}

          {/* Stats */}
          {stats && (
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
          )}

          {/* Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <RecentActivity />
            <ClientList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
