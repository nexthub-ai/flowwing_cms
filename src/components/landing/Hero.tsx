import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "AI-Powered Insights",
  "Actionable Recommendations",
  "Complete Brand Analysis",
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container relative z-10 px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground mb-8 animate-fade-up opacity-0">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Limited Time Offer</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up opacity-0 stagger-1">
            Transform Your{" "}
            <span className="gradient-text">Social Presence</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up opacity-0 stagger-2">
            Get a comprehensive AI-powered audit of your social media accounts with actionable insights to grow your brand.
          </p>

          {/* Price */}
          <div className="flex items-center justify-center gap-3 mb-8 animate-fade-up opacity-0 stagger-3">
            <span className="text-4xl md:text-5xl font-display font-bold text-foreground">$100</span>
            <span className="text-muted-foreground">one-time</span>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10 animate-fade-up opacity-0 stagger-4">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up opacity-0 stagger-5">
            <Link to="/audit">
              <Button variant="hero" size="xl" className="group">
                Start Your Audit
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="glass" size="xl">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
