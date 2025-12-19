import { useEffect, useRef } from "react";
import { Sparkles, Calendar, Users, BarChart3, Zap } from "lucide-react";

const contentExamples = [
  {
    type: "stats",
    gradient: "from-violet-600 via-purple-600 to-indigo-800",
    title: "2500+",
    subtitle: "Posts Created",
  },
  {
    type: "quote",
    gradient: "from-gray-900 to-black",
    author: "Sarah Chen",
    handle: "@sarahchen",
    quote: "Take advice from people who have receipts, not just opinions.",
  },
  {
    type: "stats",
    gradient: "from-cyan-500 via-blue-600 to-purple-700",
    title: "340%",
    subtitle: "Engagement Increase",
  },
  {
    type: "stats",
    gradient: "from-amber-500 via-orange-600 to-rose-600",
    title: "10x",
    subtitle: "Faster Content",
  },
  {
    type: "quote",
    gradient: "from-emerald-600 to-teal-800",
    author: "Marcus J.",
    handle: "@marcusj",
    quote: "The best CMS for social media teams. Period.",
  },
  {
    type: "stats",
    gradient: "from-pink-500 via-rose-500 to-red-600",
    title: "50M+",
    subtitle: "Impressions",
  },
  {
    type: "quote",
    gradient: "from-blue-600 to-cyan-700",
    author: "Alex T.",
    handle: "@alext",
    quote: "Finally, a tool that understands content creators.",
  },
];

// Duplicate for seamless loop
const duplicatedContent = [...contentExamples, ...contentExamples];

export function ContentGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const speed = 0.5;

    const animate = () => {
      scrollPosition += speed;
      
      // Reset position when we've scrolled through first set
      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= halfWidth) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };

    scrollContainer.addEventListener("mouseenter", handleMouseEnter);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      
      <div className="container relative z-10 px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Content Creation</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Create Content That <span className="gradient-text">Converts</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of brands using our platform to create, schedule, and publish viral content
          </p>
        </div>

        {/* Auto-scrolling Content Cards */}
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-hidden pb-8"
        >
          {duplicatedContent.map((item, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-64 h-96 rounded-2xl bg-gradient-to-br ${item.gradient} p-6 flex flex-col justify-end cursor-pointer relative overflow-hidden hover:scale-105 transition-transform duration-300`}
            >
              {/* Overlay pattern */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.2),_transparent_70%)]" />
              
              {item.type === "stats" ? (
                <div className="relative z-10">
                  <p className="text-5xl font-display font-bold text-white mb-2">{item.title}</p>
                  <p className="text-white/80 text-sm">{item.subtitle}</p>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                      {item.author?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{item.author}</p>
                      <p className="text-white/60 text-xs">{item.handle}</p>
                    </div>
                  </div>
                  <p className="text-white text-lg leading-relaxed">"{item.quote}"</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {[
            { icon: Calendar, label: "Smart Scheduling" },
            { icon: Users, label: "Team Collaboration" },
            { icon: BarChart3, label: "Analytics" },
            { icon: Zap, label: "AI Generation" },
          ].map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm"
            >
              <feature.icon className="h-4 w-4 text-primary" />
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
