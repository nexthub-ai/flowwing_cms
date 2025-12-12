import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Send,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";

const audits = [
  {
    id: 1,
    client: "Fashion Brand Co",
    email: "contact@fashionbrand.com",
    platforms: ["Instagram", "TikTok"],
    status: "in_progress",
    createdAt: "2024-01-15",
    dueDate: "2024-01-20",
  },
  {
    id: 2,
    client: "Tech Startup Inc",
    email: "hello@techstartup.io",
    platforms: ["LinkedIn", "Twitter"],
    status: "completed",
    createdAt: "2024-01-10",
    dueDate: "2024-01-15",
  },
  {
    id: 3,
    client: "Fitness Studio",
    email: "info@fitnessstudio.com",
    platforms: ["Instagram", "YouTube"],
    status: "pending",
    createdAt: "2024-01-18",
    dueDate: "2024-01-23",
  },
  {
    id: 4,
    client: "Local Restaurant",
    email: "contact@localfood.com",
    platforms: ["Instagram", "Facebook"],
    status: "sent",
    createdAt: "2024-01-08",
    dueDate: "2024-01-13",
  },
];

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const },
  in_progress: { label: "In Progress", variant: "default" as const },
  completed: { label: "Completed", variant: "outline" as const },
  sent: { label: "Sent", variant: "outline" as const },
};

const Audits = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">Audits</h1>
              <p className="text-muted-foreground">
                Manage and track all social media audits
              </p>
            </div>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Audit
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audits..."
                className="pl-10 bg-secondary/50"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                      Client
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                      Platforms
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                      Status
                    </th>
                    <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                      Due Date
                    </th>
                    <th className="text-right text-sm font-medium text-muted-foreground px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {audits.map((audit) => {
                    const status = statusConfig[audit.status as keyof typeof statusConfig];
                    return (
                      <tr
                        key={audit.id}
                        className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{audit.client}</p>
                            <p className="text-sm text-muted-foreground">
                              {audit.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {audit.platforms.map((platform) => (
                              <Badge
                                key={platform}
                                variant="secondary"
                                className="text-xs"
                              >
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {audit.dueDate}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Audits;
