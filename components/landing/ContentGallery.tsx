'use client';

import { useEffect, useRef } from "react";
import { Sparkles, Calendar, Users, BarChart3, Zap } from "lucide-react";

const contentExamples = [
  {
    type: "quote",
    gradient: "from-slate-900 via-slate-800 to-slate-900",
    author: "Sarah Chen",
    handle: "@sarahchen",
    quote: "The audit revealed blind spots I never knew existed. My brand clarity improved overnight.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    type: "stats",
    gradient: "from-blue-500 via-indigo-500 to-purple-600",
    title: "85/100",
    subtitle: "Avg. Brand Score",
    bgImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop",
  },
  {
    type: "stats",
    gradient: "from-orange-500 via-red-500 to-rose-600",
    title: "2,500+",
    subtitle: "Audits Completed",
    bgImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop",
  },
  {
    type: "quote",
    gradient: "from-emerald-600 via-green-600 to-teal-700",
    author: "Marcus J.",
    handle: "@marcusj",
    quote: "This audit gave me a clear roadmap to strengthen my personal brand across all platforms.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    type: "stats",
    gradient: "from-pink-500 via-rose-500 to-fuchsia-600",
    title: "12+",
    subtitle: "Actionable Insights",
    bgImage: "https://images.unsplash.com/photo-1557838923-2985c318be48?w=400&h=600&fit=crop",
  },
  {
    type: "stats",
    gradient: "from-violet-600 via-purple-600 to-indigo-700",
    title: "48hrs",
    subtitle: "Audit Delivery",
    bgImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=600&fit=crop",
  },
  {
    type: "quote",
    gradient: "from-cyan-600 via-blue-600 to-indigo-700",
    author: "Alex T.",
    handle: "@alext",
    quote: "Finally got the honest feedback I needed. The comprehensive analysis was worth every penny.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    type: "stats",
    gradient: "from-amber-500 via-yellow-500 to-orange-600",
    title: "98%",
    subtitle: "Would Recommend",
    bgImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=600&fit=crop",
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-white mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Personal Brand Insights</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Uncover Your Brand <span className="gradient-text">Potential</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of creators and professionals who've elevated their personal brand with our comprehensive audit tool
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
              className={`flex-shrink-0 w-72 h-96 rounded-3xl bg-gradient-to-br ${item.gradient} p-8 flex flex-col justify-end cursor-pointer relative overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-2xl`}
            >
              {/* Background image for stats cards */}
              {item.type === "stats" && item.bgImage && (
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{ 
                    backgroundImage: `url(${item.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              )}
              
              {/* Overlay pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.3),_transparent_70%)]" />
              
              {item.type === "stats" ? (
                <div className="relative z-10">
                  <p className="text-7xl font-display font-bold text-white mb-3 tracking-tight">{item.title}</p>
                  <p className="text-white/90 text-base font-medium">{item.subtitle}</p>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    {item.avatar ? (
                      <img 
                        src={item.avatar} 
                        alt={item.author}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-base font-bold">
                        {item.author?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold text-base">{item.author}</p>
                      <p className="text-white/70 text-sm">{item.handle}</p>
                    </div>
                  </div>
                  <p className="text-white text-xl leading-relaxed font-medium">"{item.quote}"</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {[
            { icon: BarChart3, label: "Brand Analysis" },
            { icon: Zap, label: "AI-Powered Insights" },
            { icon: Users, label: "Competitor Benchmarking" },
            { icon: Calendar, label: "48-Hour Delivery" },
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
