import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    logStep("No signature found");
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    logStep("Event received", { type: event.type });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout completed", { sessionId: session.id });

        // Check if this is an audit payment
        if (session.metadata?.type === 'audit_payment' && session.metadata?.audit_id) {
          const auditId = session.metadata.audit_id;
          
          // Update audit signup with payment info
          const { error: updateError } = await supabaseClient
            .from("audit_signups")
            .update({
              status: "payment_received",
              stripe_payment_id: session.payment_intent as string,
              updated_at: new Date().toISOString(),
            })
            .eq("id", auditId);

          if (updateError) {
            logStep("Error updating audit", { error: updateError });
            throw updateError;
          }

          logStep("Audit updated with payment", { auditId, paymentIntent: session.payment_intent });
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logStep("Payment succeeded", { paymentIntentId: paymentIntent.id });

        // Additional handling if needed
        if (paymentIntent.metadata?.audit_id) {
          const auditId = paymentIntent.metadata.audit_id;
          
          // Ensure status is updated
          const { error: updateError } = await supabaseClient
            .from("audit_signups")
            .update({
              status: "payment_received",
              stripe_payment_id: paymentIntent.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", auditId);

          if (updateError) {
            logStep("Error updating audit on payment success", { error: updateError });
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logStep("Payment failed", { paymentIntentId: paymentIntent.id });
        
        if (paymentIntent.metadata?.audit_id) {
          const auditId = paymentIntent.metadata.audit_id;
          
          // Update status to failed
          await supabaseClient
            .from("audit_signups")
            .update({
              status: "payment_failed",
              notes: "Payment failed",
              updated_at: new Date().toISOString(),
            })
            .eq("id", auditId);
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
