import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AUDIT-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", // Use service role for unauthenticated access
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    logStep("Function started");
    
    const { email, company_name, social_handles } = await req.json();
    
    if (!email || !company_name) {
      throw new Error("Email and company name are required");
    }
    
    logStep("Audit data received", { email, company_name });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check for existing customer or create new one
    let customer;
    const customers = await stripe.customers.list({ email, limit: 1 });
    
    if (customers.data.length > 0) {
      customer = customers.data[0];
      logStep("Found existing customer", { customerId: customer.id });
    } else {
      customer = await stripe.customers.create({
        email,
        name: company_name,
        metadata: {
          source: 'audit_tool',
        }
      });
      logStep("Created new customer", { customerId: customer.id });
    }

    // Create audit signup record in pending payment state
    const { data: auditSignup, error: insertError } = await supabaseClient
      .from("audit_signups")
      .insert([
        {
          email,
          company_name,
          social_handles,
          status: "pending", // Will be updated to "payment_received" after successful payment
        },
      ])
      .select()
      .single();

    if (insertError) {
      logStep("Database insert error", { error: insertError });
      throw insertError;
    }

    logStep("Audit signup created", { auditId: auditSignup.id });

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Social Media Audit",
              description: "Comprehensive analysis of your social media presence with actionable recommendations",
            },
            unit_amount: 10000, // $100.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment", // One-time payment
      success_url: `${req.headers.get("origin")}/audit/thank-you?session_id={CHECKOUT_SESSION_ID}&audit_id=${auditSignup.id}`,
      cancel_url: `${req.headers.get("origin")}/audit/start?canceled=true`,
      metadata: {
        audit_id: auditSignup.id,
        type: 'audit_payment',
      },
      payment_intent_data: {
        metadata: {
          audit_id: auditSignup.id,
        }
      }
    });

    logStep("Checkout session created", { sessionId: session.id });

    return new Response(
      JSON.stringify({ 
        url: session.url,
        auditId: auditSignup.id,
        sessionId: session.id 
      }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
