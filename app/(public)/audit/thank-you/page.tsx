'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, Clock, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function AuditThankYouPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  
  const auditId = searchParams.get("audit_id");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      // Redirect to home if accessed directly without audit ID
      if (!auditId) {
        router.push("/");
        return;
      }

      try {
        const supabase = createClient();
        
        // Verify the audit exists and payment was successful
        const { data, error } = await supabase
          .from("audit_signups")
          .select("*")
          .eq("id", auditId)
          .single();

        if (error) throw error;

        if (data && (data.status === "payment_received" || data.stripe_payment_id)) {
          setPaymentVerified(true);
        } else {
          // Payment not yet confirmed, wait a moment and check again
          setTimeout(async () => {
            const { data: retryData } = await supabase
              .from("audit_signups")
              .select("*")
              .eq("id", auditId)
              .single();
            
            if (retryData && (retryData.status === "payment_received" || retryData.stripe_payment_id)) {
              setPaymentVerified(true);
            } else {
              toast({
                title: "Payment Verification",
                description: "Your payment is being processed. You'll receive confirmation via email shortly.",
              });
              setPaymentVerified(true); // Allow them to see the thank you page
            }
          }, 2000);
        }
      } catch (error: any) {
        console.error("Error verifying payment:", error);
        toast({
          title: "Verification Error",
          description: "Unable to verify payment. Please check your email for confirmation.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [auditId, router, toast]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!paymentVerified) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth={false} />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-8 shadow-lg">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>

            {/* Heading */}
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Audit Request Received!
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              We're analyzing your personal brand presence and will send you a comprehensive 
              report within the next 24-48 hours.
            </p>

            {/* What's Next */}
            <div className="space-y-6 mb-12">
              <div className="p-6 rounded-xl border border-border/50 bg-card text-left">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Check Your Email</h3>
                    <p className="text-muted-foreground">
                      We've sent a confirmation to your email. Your detailed audit report 
                      will be delivered to the same inbox.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-border/50 bg-card text-left">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Our Analysis Process</h3>
                    <p className="text-muted-foreground mb-3">
                      Our team will analyze:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Content quality and engagement metrics</li>
                      <li>• Audience demographics and behavior</li>
                      <li>• Posting frequency and timing</li>
                      <li>• Competitor benchmarking</li>
                      <li>• Growth opportunities and recommendations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="p-8 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <h3 className="font-display text-2xl font-bold mb-3">
                Want to Supercharge Your Growth?
              </h3>
              <p className="text-muted-foreground mb-6">
                After receiving your audit, consider our services to implement the recommendations 
                and scale your personal brand presence.
              </p>
              <Button 
                variant="hero" 
                size="lg" 
                className="gap-2"
                onClick={() => router.push("/")}
              >
                Back to Home
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Back to Home */}
            <div className="mt-12">
              <Button 
                variant="ghost" 
                onClick={() => router.push("/")}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
