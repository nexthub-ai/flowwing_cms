'use client';

import { Zap, Rocket, MenuIcon, Menu } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Identify Issues Fast",
    description: "Get a clear picture of what's blocking your growth and engagement across all platforms."
  },
  {
    icon: Rocket,
    title: "Actionable Insights",
    description: "Receive specific recommendations you can implement immediately to improve performance."
  },
  {
    icon: MenuIcon,
    title: "Expert Analysis",
    description: "Each audit is reviewed by professionals who understand content strategy and audience engagement."
  }
];

const coreFeatures = [
  {
    title: "AI-Powered Content Creation",
    description: "Stop staring at a blank page. Instantly generate high-quality, platform-optimized posts from ideas, links, or past messages—tailored to your brand voice."
  },
  {
    title: "Automated Multi-Platform Publishing",
    description: "Create once, publish everywhere. Schedule and post content across Instagram, Facebook, LinkedIn, and WhatsApp—no need to copy-paste."
  },
  {
    title: "DM & Chat Automation",
    description: "Offers comprehensive support with detailed FAQs and troubleshooting guides. Find user manuals, how-to articles, and solutions to common issues. For personalised assistance, access live chat and contact support options."
  }
];

export function FeaturesHome() {
  return (
    <>
      {/* Key Benefits Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Why Get an Audit?
              </h2>
              <p className="text-xl text-muted-foreground">
                Discover what's working and what needs to change
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-card rounded-xl p-8 border border-border hover:border-primary/50 transition-all">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Benefits Section */}
      <section className="py-24">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Coming Soon: Content Creation Tools
              </h2>
              <p className="text-xl text-muted-foreground">
                Request a demo to see our AI-powered content platform
              </p>
            </div>

            <div className="space-y-8">
              {coreFeatures.map((feature, index) => (
                <div key={index} className="bg-card rounded-xl p-8 border border-border hover:shadow-lg transition-all">
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
