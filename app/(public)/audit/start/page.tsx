'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import Link from "next/link";
import { 
  Instagram, Youtube, Music2, Globe, Mail, Building2, 
  ArrowRight, Loader2, Linkedin, Twitter
} from "lucide-react";

export default function AuditStartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    linkedin: "",
    twitter: "",
    website: "",
  });

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'tiktok', name: 'TikTok', icon: Music2, color: 'text-foreground' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-600' },
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'text-sky-500' },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  // Validate URL format
  const validateUrl = (url: string, type: string) => {
    if (!url) return true; // Empty is valid (optional fields)
    const patterns = {
      instagram: /^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\/.+$/i,
      tiktok: /^https?:\/\/(www\.)?tiktok\.com\/.+$/i,
      youtube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/i,
      linkedin: /^https?:\/\/(www\.)?linkedin\.com\/in\/.+$/i,
      twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+$/i,
      website: /^https?:\/\/.+$/i,
    };
    return patterns[type as keyof typeof patterns]?.test(url) ?? true;
  };

  // Check if at least one social account is provided
  const hasAtLeastOneSocial = selectedPlatforms.length > 0;

  // Check if all selected platform URLs are valid and filled
  const allSelectedUrlsValid = selectedPlatforms.every(platform => {
    const url = formData[platform as keyof typeof formData];
    return url && validateUrl(url as string, platform);
  });

  // Check if form is valid
  const isFormValid = 
    formData.company_name.trim() !== "" &&
    formData.email.trim() !== "" &&
    hasAtLeastOneSocial &&
    allSelectedUrlsValid &&
    agreedToTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
            linkedin: formData.linkedin,
            twitter: formData.twitter,
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
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth={false} />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center align-middle justify-center gap-1 mb-6">
                <Image 
                  src="/logo.svg" 
                  alt="FlowWing Audit" 
                  width={60} 
                  height={60}
                  className="drop-shadow-lg"
                />
             
              <h1 className="font-display text-4xl md:text-5xl font-bold ">
                Personal Brand Audit
              </h1> 
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get a comprehensive analysis of your personal brand across all platforms with actionable 
                recommendations to grow your influence.
              </p>
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

                {/* Email and Website */}
                <div className="grid sm:grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      Website <span className="text-xs text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      id="website"
                      placeholder="https://yourbrand.com"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className={`bg-secondary/50 ${formData.website && !validateUrl(formData.website, 'website') ? 'border-destructive' : ''}`}
                    />
                    {formData.website && !validateUrl(formData.website, 'website') ? (
                      <p className="text-xs text-destructive">Please enter a valid website URL</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">&nbsp;</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-border/50 pt-6">
                  <h3 className="font-semibold mb-2">Which platforms do you want to focus on?</h3>
                  <p className="text-sm text-muted-foreground mb-4">Select at least one platform for your audit</p>
                  
                  {/* Platform Selection */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {platforms.map((platform) => {
                      const Icon = platform.icon;
                      const isSelected = selectedPlatforms.includes(platform.id);
                      return (
                        <button
                          key={platform.id}
                          type="button"
                          onClick={() => togglePlatform(platform.id)}
                          className={`flex-1 min-w-[100px] p-4 rounded-lg border-2 transition-all ${
                            isSelected 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border/50 hover:border-primary/50 bg-secondary/30'
                          }`}
                        >
                          <Icon className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-primary' : platform.color}`} />
                          <div className="text-sm font-medium">{platform.name}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic Input Fields */}
                  {selectedPlatforms.length > 0 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      <h3 className="font-semibold text-sm text-muted-foreground">Enter your profile URLs</h3>
                      
                      {selectedPlatforms.map((platformId) => {
                        const platform = platforms.find(p => p.id === platformId);
                        if (!platform) return null;
                        const Icon = platform.icon;
                        const value = formData[platformId as keyof typeof formData] as string;
                        const isValid = !value || validateUrl(value, platformId);
                        
                        const placeholders = {
                          instagram: 'https://instagram.com/yourusername',
                          tiktok: 'https://tiktok.com/@yourusername',
                          youtube: 'https://youtube.com/@yourchannel',
                          linkedin: 'https://linkedin.com/in/yourprofile',
                          twitter: 'https://twitter.com/yourusername',
                        };

                        return (
                          <div key={platformId} className="space-y-2">
                            <Label htmlFor={platformId} className="flex items-center gap-2">
                              <Icon className={`h-4 w-4 ${platform.color}`} />
                              {platform.name}
                            </Label>
                            <Input
                              id={platformId}
                              placeholder={placeholders[platformId as keyof typeof placeholders]}
                              value={value}
                              onChange={(e) =>
                                setFormData({ ...formData, [platformId]: e.target.value })
                              }
                              className={`bg-secondary/50 ${!isValid ? 'border-destructive' : ''}`}
                            />
                            {!isValid && (
                              <p className="text-xs text-destructive">Please enter a valid {platform.name} URL</p>
                            )}
                          </div>
                        );
                      })}


                    </div>
                  )}

                  {/* Status Indicator */}
                  {selectedPlatforms.length > 0 && (
                    <div className={`text-sm mt-4 p-3 rounded-lg ${allSelectedUrlsValid ? 'bg-success/10 text-success border border-success/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
                      {allSelectedUrlsValid ? (
                        <span className="flex items-center gap-2">
                          ✓ {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''} configured
                        </span>
                      ) : (
                        <span>Please add URLs for all selected platforms</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start gap-3 p-4 rounded-lg border border-border/50 bg-secondary/30">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-normal cursor-pointer leading-relaxed"
                    >
                      I agree to the{" "}
                      <Link 
                        href="/terms" 
                        target="_blank"
                        className="text-primary hover:underline font-medium"
                      >
                        Terms and Conditions
                      </Link>
                      {" "}and{" "}
                      <Link 
                        href="/privacy" 
                        target="_blank"
                        className="text-primary hover:underline font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Start My Audit — $100
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
                
                {!isFormValid && !isLoading && (
                  <div className="text-sm text-center text-muted-foreground">
                    {!formData.company_name.trim() || !formData.email.trim() ? (
                      <span>Please fill in all required fields</span>
                    ) : !hasAtLeastOneSocial ? (
                      <span>Please select at least one platform</span>
                    ) : !allSelectedUrlsValid ? (
                      <span>Please add URLs for all selected platforms</span>
                    ) : !agreedToTerms ? (
                      <span>Please accept the terms and conditions</span>
                    ) : null}
                  </div>
                )}

                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you agree to receive your audit report via email.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 