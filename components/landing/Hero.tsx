'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, Target, Star, Users, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Hero() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (theme === 'dark' || resolvedTheme === 'dark');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      
      <div className="container relative z-10 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[0.6fr_1.8fr_0.6fr] gap-8 items-center">
            
            {/* Left Image */}
            <div className="relative hidden lg:block">
              <div className="relative h-[400px] overflow-hidden">
                <Image
                  src={isDark ? "/banner.png" : "/banner1-light.png"}
                  alt="Brand Analysis"
                  fill
                  className="object-cover object-left"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background" />
              </div>
            </div>

            {/* Center Column - Content */}
            <div className="space-y-8 text-center">
              {/* Badge - More Subtle */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                <Shield className="h-3 w-3" />
                <span>Professional Brand Audit</span>
              </div>

              {/* Heading - Better Typography */}
              <div className="space-y-4">
                <h1 className="font-display text-5xl sm:text-6xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                  Get Clear Content
                  <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    Diagnosis
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Understand what's blocking growth, what works, and what needs fixing —
                  <span className="text-foreground/90"> with actionable insights delivered in 48 hours.</span>
                </p>
              </div>

              {/* CTA Section - Redesigned */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/audit/start" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base font-medium group"
                  >
                    Start Your Audit — $100
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              {/* Human Credibility Anchor */}
              <p className="text-sm text-muted-foreground/80 italic">
                Each audit is reviewed and refined before delivery.
              </p>

              {/* Trust Indicators - Cleaner */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">2,500+ audits completed</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-primary/80 text-primary/80" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">4.9 rating</span>
                </div>
              </div> 
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="relative h-[400px] overflow-hidden">
                <Image
                  src={isDark ? "/heroImage2.jpg" : "/banner2-light.png"}
                  alt="Brand Analysis"
                  fill
                  className="object-cover object-right"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background" />
              </div>
            </div>

          </div> 
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
