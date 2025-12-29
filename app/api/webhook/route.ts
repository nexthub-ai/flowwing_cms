import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Use service role client for webhook
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('[STRIPE-WEBHOOK] No signature found');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log('[STRIPE-WEBHOOK] Event received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('[STRIPE-WEBHOOK] Checkout completed:', session.id);

        // Check if this is an audit payment
        if (
          session.metadata?.type === 'audit_payment' &&
          session.metadata?.audit_id
        ) {
          const auditId = session.metadata.audit_id;

          // Update audit signup with payment info
          const { error: updateError } = await supabase
            .from('audit_signups')
            .update({
              status: 'payment_received',
              stripe_payment_id: session.payment_intent as string,
              updated_at: new Date().toISOString(),
            })
            .eq('id', auditId);

          if (updateError) {
            console.error('[STRIPE-WEBHOOK] Error updating audit:', updateError);
            throw updateError;
          }

          console.log('[STRIPE-WEBHOOK] Audit updated with payment:', {
            auditId,
            paymentIntent: session.payment_intent,
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
