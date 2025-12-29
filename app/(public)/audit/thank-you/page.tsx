'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, Clock, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

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

  // If no audit_id in URL, redirect to home
  if (!auditId) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth={false} />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          <div className="max-w-2xl mx-auto text-center"> 

            {/* Heading */}
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Your personal brand audit request has been received. We'll analyze your presence 
              and deliver a comprehensive report within 24-48 hours.
            </p>

            {/* CTA */}
            <div className="p-8 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center justify-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">
                Check Your Email
              </h3>
              <p className="text-muted-foreground mb-6">
                We've sent a confirmation to your email. Your detailed audit report with 
                actionable insights will be delivered to the same inbox within 24-48 hours.
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
 
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
