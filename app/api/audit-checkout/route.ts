import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { StripeService } from '@/services/stripeService';

// Use service role client for unauthenticated audit signups
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(req: NextRequest) {
  try {
    const { email, company_name, social_handles } = await req.json();

    if (!email || !company_name) {
      return NextResponse.json(
        { error: 'Email and company name are required' },
        { status: 400 }
      );
    }

    console.log('[AUDIT-CHECKOUT] Audit data received:', { email, company_name });

    // Create audit signup record in pending payment state
    const { data: auditSignup, error: insertError } = await supabase
      .from('audit_signups')
      .insert([
        {
          email,
          company_name,
          social_handles,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('[AUDIT-CHECKOUT] Database insert error:', insertError);
      throw insertError;
    }

    console.log('[AUDIT-CHECKOUT] Audit signup created:', auditSignup.id);

    // Create checkout session using service
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL;
    const session = await StripeService.createAuditCheckout(
      auditSignup.id,
      email,
      company_name,
      `${origin}/audit/thank-you?audit_id=${auditSignup.id}&session_id={CHECKOUT_SESSION_ID}`,
      `${origin}/audit/start?canceled=true`
    );

    console.log('[AUDIT-CHECKOUT] Checkout session created:', session.sessionId);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AUDIT-CHECKOUT] Error:', errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
