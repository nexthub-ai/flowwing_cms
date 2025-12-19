import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Calendar,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Edit2,
  Trash2,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";

type ContentPost = {
  id: string;
  title: string;
  content: string | null;
  status: string;
  platform: string | null;
  scheduled_at: string | null;
  created_at: string;
};

const platformIcons: Record<string, any> = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  tiktok: FileText,
};

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  review: "bg-warning/20 text-warning",
  approved: "bg-success/20 text-success",
  scheduled: "bg-primary/20 text-primary",
  published: "bg-success text-success-foreground",
  rejected: "bg-destructive/20 text-destructive",
};

const statusIcons: Record<string, any> = {
  draft: FileText,
  review: Clock,
  approved: CheckCircle2,
  scheduled: Calendar,
  published: Send,
  rejected: XCircle,
};

const Content = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    platform: "",
    status: "draft",
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["content-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ContentPost[];
    },
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (post: typeof newPost) => {
      const { error } = await supabase.from("content_posts").insert({
        ...post,
        user_id: user?.id,
        platform: post.platform || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-posts"] });
      setIsCreateOpen(false);
      setNewPost({ title: "", content: "", platform: "", status: "draft" });
      toast({ title: "Post created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("content_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-posts"] });
      toast({ title: "Post deleted" });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("content_posts")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content-posts"] });
      toast({ title: "Status updated" });
    },
  });

  const filteredPosts = posts?.filter(
    (post) => selectedStatus === "all" || post.status === selectedStatus
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container px-6 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Content Manager</h1>
            <p className="text-muted-foreground">
              Create, schedule, and manage your social media content
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="h-4 w-4" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Post title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Write your content..."
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select
                    value={newPost.platform}
                    onValueChange={(value) => setNewPost({ ...newPost, platform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full"
                  onClick={() => createMutation.mutate(newPost)}
                  disabled={!newPost.title || createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create Post"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["all", "draft", "review", "approved", "scheduled", "published", "rejected"].map(
            (status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className="capitalize"
              >
                {status}
              </Button>
            )
          )}
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : filteredPosts?.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No posts yet. Create your first post!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts?.map((post) => {
              const PlatformIcon = post.platform ? platformIcons[post.platform] : FileText;
              const StatusIcon = statusIcons[post.status];
              
              return (
                <div
                  key={post.id}
                  className="group p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {post.platform && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                          <PlatformIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <Badge className={statusColors[post.status]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {post.status}
                      </Badge>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteMutation.mutate(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-semibold mb-2 line-clamp-1">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {post.content || "No content yet..."}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    {post.status === "draft" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateStatusMutation.mutate({ id: post.id, status: "review" })
                        }
                      >
                        Submit for Review
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Content;
