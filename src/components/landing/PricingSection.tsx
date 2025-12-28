import { useState } from "react";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const auditPlan = {
  name: "Social Media Audit",
  description: "Comprehensive analysis of your brand's online presence",
  price: 100,
  priceId: "price_1SfyJSHUoeVfz3ns8g2wiPbH",
  productId: "prod_TdEnG2HqLyNSdz",
  features: [
    "Full social media audit",
    "Competitor analysis",
    "Content performance review",
    "Audience insights report",
    "Platform-specific recommendations",
    "30-page detailed report",
    "1-hour strategy call",
  ],
};

export function PricingSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: auditPlan.priceId },
      });

      if (error) throw error;

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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm text-accent mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Get Started</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Social Media <span className="gradient-text">Audit</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get a comprehensive analysis of your brand's social media presence and actionable recommendations
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
