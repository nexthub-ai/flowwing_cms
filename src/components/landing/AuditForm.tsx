import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Youtube, Music2, Globe, Mail, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AuditForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    instagram: "",
    tiktok: "",
    youtube: "",
    website: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast({
      title: "Audit Request Submitted!",
      description: "We'll send your comprehensive audit within 24-48 hours.",
    });

    setIsLoading(false);
  };

  return (
    <section id="audit-form" className="relative py-24 border-t border-border/50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-accent/5 via-background to-background" />
      
      <div className="container relative z-10 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Start Your Audit
            </h2>
            <p className="text-lg text-muted-foreground">
              Enter your social media accounts and we'll analyze everything for you
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              {/* Instagram */}
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  Instagram URL
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
                  <Music2 className="h-4 w-4 text-foreground" />
                  TikTok URL
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
                  YouTube URL
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
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-secondary/50"
                />
              </div>
            </div>

            {/* Price Summary */}
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Social Media Audit</span>
                <span className="font-display text-xl font-bold">$100</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full group"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Payment
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
