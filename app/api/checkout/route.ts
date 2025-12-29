import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/supabase/server';
import { StripeService } from '@/services/stripeService';

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user?.email) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    console.log('[CREATE-CHECKOUT] User authenticated:', user.email);

    // Create checkout session using service
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL;
    const session = await StripeService.createSubscriptionCheckout(
      user.id,
      user.email,
      priceId,
      `${origin}/dashboard?success=true`,
      `${origin}/pricing?canceled=true`
    );

    console.log('[CREATE-CHECKOUT] Session created:', session.sessionId);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[CREATE-CHECKOUT] Error:', errorMessage);
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
