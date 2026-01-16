'use client';

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const plan = {
  name: "Brand Audit",
  price: 100,
  description: "Discover what's holding you back.",
  features: [
    "Comprehensive content analysis",
    "Platform performance review",
    "Actionable recommendations",
    "48-hour delivery"
  ],
  cta: "Start Your Audit — $100",
  href: "/audit/start"
};

export function PricingHome() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Professional Brand Audit
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get actionable insights delivered in 48 hours
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative bg-card rounded-xl p-8 border border-primary shadow-xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-bold">${plan.price}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="block">
                <Button
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
