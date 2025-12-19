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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, Shield, UserCog, Loader2, Crown, 
  Briefcase, PenTool, User as UserIcon
} from "lucide-react";

type AppRole = "admin" | "pms" | "creator" | "client";

const roleLabels: Record<AppRole, string> = {
  admin: "Admin",
  pms: "PMS",
  creator: "Creator",
  client: "Client"
};

const roleIcons: Record<AppRole, React.ElementType> = {
  admin: Crown,
  pms: Briefcase,
  creator: PenTool,
  client: UserIcon
};

const roleColors: Record<AppRole, string> = {
  admin: "bg-red-500/10 text-red-500 border-red-500/20",
  pms: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  creator: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  client: "bg-green-500/10 text-green-500 border-green-500/20"
};

interface UserWithRole {
  user_id: string;
  role: AppRole;
  created_at: string;
  profile?: {
    full_name: string | null;
    company_name: string | null;
  };
}

export default function Admin() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("users");

  const isAdmin = hasRole("admin");

  const { data: userRoles, isLoading } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          role,
          created_at
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Fetch profiles separately
      const userIds = data.map(r => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, company_name")
        .in("user_id", userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]));
      
      return data.map(r => ({
        ...r,
        profile: profileMap.get(r.user_id)
      })) as UserWithRole[];
    },
    enabled: isAdmin
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast({ title: "Role updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error updating role", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  // Group users by role for stats
  const roleStats = userRoles?.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8 px-6">
          <div className="flex flex-col items-center justify-center py-24">
            <Shield className="h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">You need admin privileges to access this page.</p>
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
              <UserCog className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Manage users, roles, and system settings
          </p>
        </div>

        {/* Role Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {(["admin", "pms", "creator", "client"] as AppRole[]).map((role) => {
            const Icon = roleIcons[role];
            return (
              <Card key={role}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{roleLabels[role]}s</p>
                      <p className="text-3xl font-bold">{roleStats[role] || 0}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${roleColors[role]} border`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Manage user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Current Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userRoles?.map((user) => {
                        const Icon = roleIcons[user.role];
                        return (
                          <TableRow key={user.user_id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
                                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="font-medium">
                                  {user.profile?.full_name || "Unnamed User"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {user.profile?.company_name || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={roleColors[user.role]}>
                                <Icon className="h-3 w-3 mr-1" />
                                {roleLabels[user.role]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={user.role}
                                onValueChange={(value) => 
                                  updateRoleMutation.mutate({ 
                                    userId: user.user_id, 
                                    newRole: value as AppRole 
                                  })
                                }
                                disabled={updateRoleMutation.isPending}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="pms">PMS</SelectItem>
                                  <SelectItem value="creator">Creator</SelectItem>
                                  <SelectItem value="client">Client</SelectItem>
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
