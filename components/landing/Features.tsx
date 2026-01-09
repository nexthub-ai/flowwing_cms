import { 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Lightbulb, 
  Users, 
  FileText 
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Brand Position Clarity",
    description: "Understand exactly where you stand and what makes your brand unique compared to competitors in your niche.",
  },
  {
    icon: TrendingUp,
    title: "Growth Blockers Identified",
    description: "Discover the specific issues preventing engagement and reach — from messaging gaps to platform misalignment.",
  },
  {
    icon: CheckCircle2,
    title: "Content Strengths & Weaknesses",
    description: "See what's working, what's not, and why — with clear examples from your actual content.",
  },
  {
    icon: Lightbulb,
    title: "Prioritized Action Plan",
    description: "Get a roadmap of improvements ranked by impact so you know exactly what to tackle first.",
  },
  {
    icon: Users,
    title: "Audience Alignment Check",
    description: "Learn whether your content resonates with your ideal audience or if you're attracting the wrong followers.",
  },
  {
    icon: FileText,
    title: "Platform-Specific Recommendations",
    description: "Tailored advice for each platform you're on — Instagram, LinkedIn, TikTok, YouTube, and more.",
  },
];

export function Features() {
  return (
    <section id="how-it-works" className="relative py-24 border-t border-border/50">
      <div className="container px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-white mb-6">
            <FileText className="h-4 w-4" />
            <span>What's Inside Your Audit</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Move Forward</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No fluff. No generic advice. Just clear insights and actions you can implement immediately.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
