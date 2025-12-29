import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export interface CheckoutSession {
  url: string | null;
  sessionId: string;
}

export interface AuditCheckoutData {
  email: string;
  company_name: string;
  social_handles: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    website?: string;
  };
}

export class StripeService {
  static async createSubscriptionCheckout(
    userId: string,
    userEmail: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    // Check for existing customer
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
      },
    });

    return {
      url: session.url,
      sessionId: session.id,
    };
  }

  /**
   * Create audit payment checkout session
   */
  static async createAuditCheckout(
    auditId: string,
    email: string,
    companyName: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    // Check for existing customer or create new one
    let customer: Stripe.Customer;
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        name: companyName,
        metadata: {
          source: 'audit_tool',
        },
      });
    }

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Social Media Audit',
              description:
                'Comprehensive analysis of your social media presence with actionable recommendations',
            },
            unit_amount: 10000, // $100.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        type: 'audit_payment',
        audit_id: auditId,
      },
    });

    return {
      url: session.url,
      sessionId: session.id,
    };
  }

  static constructWebhookEvent(
    body: string,
    signature: string,
    secret: string
  ): Stripe.Event {
    return stripe.webhooks.constructEvent(body, signature, secret);
  }


  static async getSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return await stripe.checkout.sessions.retrieve(sessionId);
  }

  static async getCustomer(customerId: string): Promise<Stripe.Customer> {
    return await stripe.customers.retrieve(customerId) as Stripe.Customer;
  }
}
