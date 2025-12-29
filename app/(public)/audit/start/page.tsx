'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  Instagram, Youtube, Music2, Globe, Mail, Building2, 
  ArrowRight, Loader2, CheckCircle2 
} from "lucide-react";

export default function AuditStartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    website: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate at least one social media account
    if (!formData.instagram && !formData.tiktok && !formData.youtube) {
      toast({
        title: "Social Media Required",
        description: "Please provide at least one social media account URL.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Call Next.js API route to create checkout and save audit data
      const response = await fetch('/api/audit-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          company_name: formData.company_name,
          social_handles: {
            instagram: formData.instagram,
            tiktok: formData.tiktok,
            youtube: formData.youtube,
            website: formData.website,
          },
        }),
      });

      const { url, error } = await response.json();

      if (error) throw new Error(error);

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error("Checkout URL not available");
      }
    } catch (error: any) {
      console.error("Error creating checkout:", error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Unable to process payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
    // Note: Don't set isLoading to false here as we're redirecting
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth={false} />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-6">
                <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Social Media Audit
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get a comprehensive analysis of your social media presence with actionable 
                recommendations to grow your brand.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 rounded-xl border border-border/50 bg-secondary/30">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold mb-1">Deep Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Content quality, engagement metrics, and audience insights
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border/50 bg-secondary/30">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold mb-1">Action Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Clear recommendations to improve reach and conversions
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border/50 bg-secondary/30">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold mb-1">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Receive your detailed report within 24-48 hours
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 rounded-2xl border border-border/50 bg-card shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Company or Brand Name *
                  </Label>
                  <Input
                    id="company_name"
                    required
                    placeholder="Your Brand Name"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({ ...formData, company_name: e.target.value })
                    }
                    className="bg-secondary/50"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-secondary/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll send your audit report to this email
                  </p>
                </div>

                <div className="border-t border-border/50 pt-6">
                  <h3 className="font-semibold mb-4">Social Media Accounts</h3>
                  <div className="grid gap-4">
                    {/* Instagram */}
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        placeholder="https://instagram.com/yourusername"
                        value={formData.instagram}
                        onChange={(e) =>
                          setFormData({ ...formData, instagram: e.target.value })
                        }
                        className="bg-secondary/50"
                      />
                    </div>

                    {/* TikTok */}
                    <div className="space-y-2">
                      <Label htmlFor="tiktok" className="flex items-center gap-2">
                        <Music2 className="h-4 w-4" />
                        TikTok
                      </Label>
                      <Input
                        id="tiktok"
                        placeholder="https://tiktok.com/@yourusername"
                        value={formData.tiktok}
                        onChange={(e) =>
                          setFormData({ ...formData, tiktok: e.target.value })
                        }
                        className="bg-secondary/50"
                      />
                    </div>

                    {/* YouTube */}
                    <div className="space-y-2">
                      <Label htmlFor="youtube" className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-red-500" />
                        YouTube
                      </Label>
                      <Input
                        id="youtube"
                        placeholder="https://youtube.com/@yourchannel"
                        value={formData.youtube}
                        onChange={(e) =>
                          setFormData({ ...formData, youtube: e.target.value })
                        }
                        className="bg-secondary/50"
                      />
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        Website (optional)
                      </Label>
                      <Input
                        id="website"
                        placeholder="https://yourbrand.com"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        className="bg-secondary/50"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-4">
                    * Provide at least one social media account for the audit
                  </p>
                </div>

                {/* Price Summary */}
                <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Social Media Audit</span>
                    <span className="font-display text-2xl font-bold">$100</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    One-time payment • Detailed report • 24-48 hour delivery
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Start My Audit
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you agree to receive your audit report via email.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
