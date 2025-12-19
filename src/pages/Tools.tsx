import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, Hash, RefreshCw, User, TrendingUp, Clock, 
  Target, Users, ImageIcon, Scissors, Film, Eraser,
  Loader2, Wand2
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Hash, RefreshCw, User, TrendingUp, Clock,
  Target, Users, ImageIcon, Scissors, Film, Eraser
};

const categoryLabels: Record<string, string> = {
  ai_writing: "AI Writing",
  analytics: "Analytics",
  media: "Media"
};

const categoryColors: Record<string, string> = {
  ai_writing: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  analytics: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  media: "bg-amber-500/10 text-amber-500 border-amber-500/20"
};

interface Tool {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string | null;
  is_active: boolean;
}

export default function Tools() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data: tools, isLoading } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("is_active", true)
        .order("category", { ascending: true });
      
      if (error) throw error;
      return data as Tool[];
    }
  });

  const filteredTools = tools?.filter(tool => 
    activeCategory === "all" || tool.category === activeCategory
  );

  const categories = ["all", "ai_writing", "analytics", "media"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 px-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wand2 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold">Tools Gallery</h1>
          </div>
          <p className="text-muted-foreground">
            Powerful tools to supercharge your content creation workflow
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="ai_writing">AI Writing</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools?.map((tool) => {
              const IconComponent = iconMap[tool.icon || "Sparkles"] || Sparkles;
              
              return (
                <Card 
                  key={tool.id} 
                  className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${categoryColors[tool.category]} border`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {categoryLabels[tool.category]}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-4">{tool.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Launch Tool
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filteredTools?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tools found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
}
