import { Navbar } from "@/components/layout/Navbar";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { ClientList } from "@/components/dashboard/ClientList";
import { 
  FileText, 
  Users, 
  CheckCircle2, 
  Clock,
  Plus 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
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

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Leads Awaiting Audit"
              value={8}
              change="+3 this week"
              changeType="positive"
              icon={FileText}
            />
            <StatCard
              title="Audits In Progress"
              value={4}
              change="2 due today"
              changeType="neutral"
              icon={Clock}
            />
            <StatCard
              title="Active Clients"
              value={12}
              change="+2 this month"
              changeType="positive"
              icon={Users}
            />
            <StatCard
              title="Pending Approvals"
              value={6}
              change="3 urgent"
              changeType="negative"
              icon={CheckCircle2}
            />
          </div>

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
