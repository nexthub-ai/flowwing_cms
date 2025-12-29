import { 
  BarChart3, 
  MessageSquare, 
  FileCheck, 
  Calendar, 
  Users, 
  Zap 
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Comprehensive analysis of your engagement rates, audience demographics, and content performance.",
  },
  {
    icon: MessageSquare,
    title: "Brand Voice Analysis",
    description: "AI-powered assessment of your brand messaging consistency and tone across platforms.",
  },
  {
    icon: FileCheck,
    title: "Content Audit",
    description: "Review of your top-performing content with recommendations for improvement.",
  },
  {
    icon: Calendar,
    title: "Posting Strategy",
    description: "Optimal posting times and frequency recommendations based on your audience behavior.",
  },
  {
    icon: Users,
    title: "Audience Insights",
    description: "Detailed breakdown of who your followers are and what content they engage with.",
  },
  {
    icon: Zap,
    title: "Quick Wins",
    description: "Immediate actionable steps to boost your social media presence within days.",
  },
];

export function Features() {
  return (
    <section className="relative py-24 border-t border-border/50">
      <div className="container px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            What You'll Get
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete breakdown of your social media presence with actionable insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-xl bg-card border border-border/50 card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
