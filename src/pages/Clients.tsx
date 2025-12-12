import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  MessageSquare,
  FileText,
  BarChart3
} from "lucide-react";
import { Input } from "@/components/ui/input";

const clients = [
  {
    id: 1,
    name: "Fashion Brand Co",
    email: "contact@fashionbrand.com",
    status: "active",
    pendingTasks: 3,
    pendingApprovals: 2,
    lastActivity: "2 hours ago",
    initials: "FB",
  },
  {
    id: 2,
    name: "Tech Startup Inc",
    email: "hello@techstartup.io",
    status: "active",
    pendingTasks: 1,
    pendingApprovals: 0,
    lastActivity: "1 day ago",
    initials: "TS",
  },
  {
    id: 3,
    name: "Fitness Studio",
    email: "info@fitnessstudio.com",
    status: "pending",
    pendingTasks: 5,
    pendingApprovals: 4,
    lastActivity: "3 hours ago",
    initials: "FS",
  },
  {
    id: 4,
    name: "Local Restaurant",
    email: "contact@localfood.com",
    status: "active",
    pendingTasks: 0,
    pendingApprovals: 1,
    lastActivity: "5 days ago",
    initials: "LR",
  },
  {
    id: 5,
    name: "Wellness Spa",
    email: "hello@wellnessspa.com",
    status: "active",
    pendingTasks: 2,
    pendingApprovals: 0,
    lastActivity: "6 hours ago",
    initials: "WS",
  },
];

const Clients = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">Clients</h1>
              <p className="text-muted-foreground">
                Manage your client relationships and projects
              </p>
            </div>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-10 bg-secondary/50"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Client Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="group p-6 rounded-xl bg-card border border-border/50 card-hover cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-12 w-12 bg-primary/10 text-primary">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {client.initials}
                    </AvatarFallback>
                  </Avatar>
                  <Badge
                    variant={client.status === "active" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {client.status}
                  </Badge>
                </div>

                <h3 className="font-display text-lg font-semibold mb-1">
                  {client.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {client.email}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{client.pendingTasks} tasks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span>{client.pendingApprovals} approvals</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
                    Last activity: {client.lastActivity}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Clients;
