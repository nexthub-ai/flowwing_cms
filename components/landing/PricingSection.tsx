'use client';

import { useState } from "react";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/slices/authSlice";

const auditPlan = {
  name: "Brand Clarity Audit",
  description: "Get clarity on what's working and what to fix — delivered in 48 hours",
  price: 100,
  priceId: "price_1SfyJSHUoeVfz3ns8g2wiPbH",
  productId: "prod_TdEnG2HqLyNSdz",
  features: [
    "Comprehensive brand positioning analysis",
    "Content strengths & weaknesses breakdown",
    "Growth blocker identification",
    "Competitor benchmarking insights",
    "Platform-specific recommendations",
    "Prioritized action plan",
    "Delivered in 48 hours",
    "Expert review + analysis",
  ],
};

export function PricingSection() {
  const user = useAppSelector(selectUser);
  const { toast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    router.push("/audit/start");
    return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId: auditPlan.priceId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Checkout link not available");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to start checkout";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="pricing" className="relative py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background to-background" />

      <div className="container relative z-10 px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-white mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Simple, One-Time Investment</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Start With <span className="gradient-text">Clarity</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One comprehensive audit. Clear insights. Actionable next steps. No subscriptions.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative p-8 rounded-2xl border border-primary bg-gradient-to-b from-primary/10 to-transparent">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
              One-Time Purchase
            </div>

            <div className="mb-6 text-center">
              <h3 className="font-display text-2xl font-bold mb-2">{auditPlan.name}</h3>
              <p className="text-muted-foreground">{auditPlan.description}</p>
            </div>

            <div className="mb-6 text-center">
              <span className="text-5xl font-display font-bold">${auditPlan.price}</span>
              <span className="text-muted-foreground"> one-time</span>
            </div>

            <ul className="space-y-3 mb-8">
              {auditPlan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/20">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Get Your Audit"
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
