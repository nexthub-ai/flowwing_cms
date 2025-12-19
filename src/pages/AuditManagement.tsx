import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  ClipboardCheck, Loader2, Building2, Globe, 
  Clock, CheckCircle2, PlayCircle, Eye, CircleDot
} from "lucide-react";

type AuditStatus = "pending" | "planning" | "in_progress" | "review" | "completed";

const statusConfig: Record<AuditStatus, {
  label: string;
  icon: React.ElementType;
  color: string;
}> = {
  pending: { label: "Pending", icon: CircleDot, color: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
  planning: { label: "Planning", icon: Clock, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  in_progress: { label: "In Progress", icon: PlayCircle, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  review: { label: "Review", icon: Eye, color: "bg-violet-500/10 text-violet-500 border-violet-500/20" },
  completed: { label: "Completed", icon: CheckCircle2, color: "bg-green-500/10 text-green-500 border-green-500/20" }
};

interface AuditSignup {
  id: string;
  user_id: string | null;
  email: string;
  company_name: string | null;
  social_handles: any;
  status: AuditStatus;
  assigned_to: string | null;
  notes: string | null;
  stripe_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export default function AuditManagement() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const canManage = hasRole("admin") || hasRole("pms");

  const { data: audits, isLoading } = useQuery({
    queryKey: ["audit-signups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_signups")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as AuditSignup[];
    },
    enabled: canManage
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ auditId, newStatus }: { auditId: string; newStatus: AuditStatus }) => {
      const { error } = await supabase
        .from("audit_signups")
        .update({ status: newStatus })
        .eq("id", auditId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit-signups"] });
      toast({ title: "Audit status updated" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error updating status", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  const filteredAudits = audits?.filter(audit => 
    statusFilter === "all" || audit.status === statusFilter
  );

  // Stats
  const stats = audits?.reduce((acc, audit) => {
    acc[audit.status] = (acc[audit.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  if (!canManage) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8 px-6">
          <div className="flex flex-col items-center justify-center py-24">
            <ClipboardCheck className="h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">You need admin or PMS privileges to access this page.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold">Audit Management</h1>
          </div>
          <p className="text-muted-foreground">
            Manage audit signups and track their progress
          </p>
        </div>

        {/* Status Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {(Object.keys(statusConfig) as AuditStatus[]).map((status) => {
            const config = statusConfig[status];
            const Icon = config.icon;
            return (
              <Card 
                key={status}
                className={`cursor-pointer transition-all ${
                  statusFilter === status ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setStatusFilter(status === statusFilter ? "all" : status)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.color} border`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats[status] || 0}</p>
                      <p className="text-xs text-muted-foreground">{config.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Audit Signups</CardTitle>
                <CardDescription>
                  {statusFilter === "all" 
                    ? "All audit requests" 
                    : `Showing ${statusConfig[statusFilter as AuditStatus]?.label} audits`
                  }
                </CardDescription>
              </div>
              {statusFilter !== "all" && (
                <Button variant="outline" size="sm" onClick={() => setStatusFilter("all")}>
                  Show All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredAudits?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No audit signups found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAudits?.map((audit) => {
                    const config = statusConfig[audit.status];
                    const Icon = config.icon;
                    
                    return (
                      <TableRow key={audit.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium">{audit.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {audit.company_name || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={config.color}>
                            <Icon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(audit.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={audit.status}
                            onValueChange={(value) => 
                              updateStatusMutation.mutate({ 
                                auditId: audit.id, 
                                newStatus: value as AuditStatus 
                              })
                            }
                            disabled={updateStatusMutation.isPending}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="planning">Planning</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="review">Review</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
