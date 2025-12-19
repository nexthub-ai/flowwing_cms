import { useState } from "react";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Co-Pilot",
    description: "Perfect for getting started",
    price: 747,
    priceId: "price_1RvyUnHUoeVfz3nsmRUYmMBd",
    productId: "prod_SrhuDMExvsYHjG",
    features: [
      "10 posts/month",
      "2 platforms",
      "Smart scheduling",
      "Basic analytics",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Auto-Pilot",
    description: "Everything you need to grow",
    price: 997,
    priceId: "price_1RvyVRHUoeVfz3nsN1YdDrXC",
    productId: "prod_Srhv5p8U1pdeM4",
    features: [
      "Unlimited posts",
      "All platforms",
      "Advanced scheduling",
      "AI content generation",
      "Team collaboration",
      "Priority support",
      "Custom workflows",
    ],
    popular: true,
  },
];

export function PricingSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, planName: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoadingPlan(planName);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="relative py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background to-background" />

      <div className="container relative z-10 px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm text-accent mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Simple Pricing</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Choose Your <span className="gradient-text">Growth Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you're ready. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border ${
                plan.popular
                  ? "border-primary bg-gradient-to-b from-primary/10 to-transparent"
                  : "border-border/50 bg-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-display font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success/20">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "hero" : "outline"}
                size="lg"
                className="w-full"
                onClick={() => handleCheckout(plan.priceId, plan.name)}
                disabled={loadingPlan === plan.name}
              >
                {loadingPlan === plan.name ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Get Started"
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
