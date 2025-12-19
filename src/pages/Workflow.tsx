import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Lightbulb, Palette, Eye, Send, 
  ArrowRight, Loader2, FileText, Clock
} from "lucide-react";

type WorkflowStage = "planning" | "creation" | "review" | "publish";

const stageConfig: Record<WorkflowStage, {
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  nextStage?: WorkflowStage;
  dbStatus: string;
}> = {
  planning: {
    label: "Planning",
    icon: Lightbulb,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 border-amber-500/20",
    nextStage: "creation",
    dbStatus: "draft"
  },
  creation: {
    label: "Creation",
    icon: Palette,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10 border-violet-500/20",
    nextStage: "review",
    dbStatus: "draft"
  },
  review: {
    label: "Review",
    icon: Eye,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 border-blue-500/20",
    nextStage: "publish",
    dbStatus: "review"
  },
  publish: {
    label: "Publish",
    icon: Send,
    color: "text-green-500",
    bgColor: "bg-green-500/10 border-green-500/20",
    dbStatus: "approved"
  }
};

// Map database status to workflow stage
const statusToStage: Record<string, WorkflowStage> = {
  draft: "planning",
  review: "review",
  approved: "publish",
  scheduled: "publish",
  published: "publish",
  rejected: "review"
};

interface ContentPost {
  id: string;
  title: string;
  content: string | null;
  status: string;
  platform: string | null;
  created_at: string;
  updated_at: string;
}

export default function Workflow() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeStage, setActiveStage] = useState<WorkflowStage>("planning");

  const canManage = hasRole("admin") || hasRole("pms") || hasRole("creator");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["workflow-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ContentPost[];
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ postId, newStatus }: { postId: string; newStatus: string }) => {
      const { error } = await supabase
        .from("content_posts")
        .update({ status: newStatus })
        .eq("id", postId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflow-posts"] });
      toast({ title: "Post moved to next stage" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error updating post", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  const moveToNextStage = (post: ContentPost) => {
    const currentStage = statusToStage[post.status] || "planning";
    const config = stageConfig[currentStage];
    
    if (config.nextStage) {
      const nextConfig = stageConfig[config.nextStage];
      updateStatusMutation.mutate({ 
        postId: post.id, 
        newStatus: nextConfig.dbStatus 
      });
    }
  };

  // Group posts by stage
  const postsByStage = posts?.reduce((acc, post) => {
    const stage = statusToStage[post.status] || "planning";
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(post);
    return acc;
  }, {} as Record<WorkflowStage, ContentPost[]>) || {};

  const stages: WorkflowStage[] = ["planning", "creation", "review", "publish"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold">Content Workflow</h1>
          </div>
          <p className="text-muted-foreground">
            Track content through planning, creation, review, and publishing
          </p>
        </div>

        {/* Workflow Stage Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto py-4">
          {stages.map((stage, index) => {
            const config = stageConfig[stage];
            const Icon = config.icon;
            const count = postsByStage[stage]?.length || 0;
            const isActive = activeStage === stage;
            
            return (
              <div key={stage} className="flex items-center">
                <button
                  onClick={() => setActiveStage(stage)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    isActive 
                      ? `${config.bgColor} border-2` 
                      : "bg-card border-border/50 hover:border-border"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{config.label}</p>
                    <p className="text-sm text-muted-foreground">{count} items</p>
                  </div>
                </button>
                {index < stages.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground mx-2 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Posts in Active Stage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const config = stageConfig[activeStage];
                const Icon = config.icon;
                return (
                  <>
                    <Icon className={`h-5 w-5 ${config.color}`} />
                    {config.label} Stage
                  </>
                );
              })()}
            </CardTitle>
            <CardDescription>
              Content items currently in the {stageConfig[activeStage].label.toLowerCase()} phase
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {(postsByStage[activeStage] || []).length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No content in this stage</p>
                  </div>
                ) : (
                  (postsByStage[activeStage] || []).map((post) => {
                    const config = stageConfig[activeStage];
                    
                    return (
                      <div 
                        key={post.id} 
                        className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:border-border transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium truncate">{post.title}</h3>
                            {post.platform && (
                              <Badge variant="outline" className="text-xs">
                                {post.platform}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {post.content || "No content yet"}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Updated {new Date(post.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {canManage && config.nextStage && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveToNextStage(post)}
                            disabled={updateStatusMutation.isPending}
                            className="ml-4 flex-shrink-0"
                          >
                            Move to {stageConfig[config.nextStage].label}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        )}
                        
                        {!config.nextStage && (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                            Ready to Publish
                          </Badge>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
