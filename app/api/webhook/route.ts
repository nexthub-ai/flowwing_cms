import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Disable Next.js body parsing - Stripe needs raw body for signature verification
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // Use service role client for webhook
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Get raw body as text for Stripe signature verification
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('[STRIPE-WEBHOOK] No signature found');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  if (!webhookSecret) {
    console.error('[STRIPE-WEBHOOK] Webhook secret not configured');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature and construct event
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('[STRIPE-WEBHOOK] Event verified:', event.type);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[STRIPE-WEBHOOK] Signature verification failed:', errorMessage);
    return NextResponse.json({ 
      error: `Webhook signature verification failed: ${errorMessage}` 
    }, { status: 400 });
  }

  try {

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('[STRIPE-WEBHOOK] Checkout completed:', session.id);
        console.log('[STRIPE-WEBHOOK] Session metadata:', session.metadata);
        console.log('[STRIPE-WEBHOOK] Payment intent:', session.payment_intent);

        // Check if this is an audit payment
        if (
          session.metadata?.type === 'audit_payment' &&
          session.metadata?.audit_id
        ) {
          const auditId = session.metadata.audit_id;
          const paymentIntentId = typeof session.payment_intent === 'string' 
            ? session.payment_intent 
            : session.payment_intent?.id;

          console.log('[STRIPE-WEBHOOK] Processing audit payment:', { auditId, paymentIntentId });

          // Update audit signup with payment info
          const { data: updateData, error: updateError } = await supabase
            .from('audit_signups')
            .update({
              status: 'payment_received',
              stripe_payment_id: paymentIntentId,
              updated_at: new Date().toISOString(),
            })
            .eq('id', auditId)
            .select();

          if (updateError) {
            console.error('[STRIPE-WEBHOOK] Error updating audit:', updateError);
            throw updateError;
          }

          console.log('[STRIPE-WEBHOOK] Audit updated successfully:', updateData);
        } else {
          console.warn('[STRIPE-WEBHOOK] Missing metadata for audit payment:', {
            hasType: !!session.metadata?.type,
            hasAuditId: !!session.metadata?.audit_id,
            metadata: session.metadata,
          });
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
          '[STRIPE-WEBHOOK] Payment succeeded:',
          paymentIntent.id
        );

        // Additional handling if needed
        if (paymentIntent.metadata?.audit_id) {
          const auditId = paymentIntent.metadata.audit_id;

          // Ensure status is updated
          const { error: updateError } = await supabase
            .from('audit_signups')
            .update({
              status: 'payment_received',
              stripe_payment_id: paymentIntent.id,
              updated_at: new Date().toISOString(),
            })
            .eq('id', auditId);

          if (updateError) {
            console.error(
              '[STRIPE-WEBHOOK] Error updating audit on payment success:',
              updateError
            );
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(
          '[STRIPE-WEBHOOK] Payment failed:',
          paymentIntent.id
        );

        if (paymentIntent.metadata?.audit_id) {
          const auditId = paymentIntent.metadata.audit_id;

          // Update status to failed
          await supabase
            .from('audit_signups')
            .update({
              status: 'payment_failed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', auditId);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(
          `[STRIPE-WEBHOOK] Subscription ${event.type}:`,
          subscription.id
        );
        
        // Handle subscription events if needed
        // You can add logic here to update user subscription status in your database
        break;
      }

      default:
        console.log('[STRIPE-WEBHOOK] Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[STRIPE-WEBHOOK] Error:', errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
