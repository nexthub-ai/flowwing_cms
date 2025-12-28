# Stripe Integration Setup Guide

## Overview
The audit tool now integrates Stripe for payment processing. Users submit their information, get redirected to Stripe Checkout, and upon successful payment, their audit request is saved to the database.

## Architecture Flow

```
User Form Submission
    ↓
Frontend: /audit/start
    ↓
Supabase Edge Function: create-audit-checkout
    ↓ (Creates Stripe Customer + Checkout Session + DB Record)
Stripe Checkout Page
    ↓ (User Pays $100)
Stripe Webhook: stripe-webhook
    ↓ (Updates audit_signups.status = "payment_received")
Thank You Page: /audit/thank-you
```

## Files Created/Modified

### New Files:
1. `supabase/functions/create-audit-checkout/index.ts` - Creates Stripe checkout session
2. `supabase/functions/stripe-webhook/index.ts` - Handles Stripe webhook events
3. `supabase/migrations/20251219_add_payment_status.sql` - Adds payment status values

### Modified Files:
1. `src/pages/AuditStart.tsx` - Integrated Stripe checkout
2. `src/pages/AuditThankYou.tsx` - Added payment verification
3. `supabase/config.toml` - Added new edge functions
4. `supabase/main.sql` - Updated status constraint

## Setup Instructions

### 1. Stripe Dashboard Setup

1. **Get Stripe Keys**
   - Login to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Get your `STRIPE_SECRET_KEY` (starts with `sk_test_` or `sk_live_`)
   
2. **Create Webhook**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://[YOUR-PROJECT-ID].supabase.co/functions/v1/stripe-webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the `Webhook Signing Secret` (starts with `whsec_`)

### 2. Supabase Setup

1. **Set Environment Variables**
   ```bash
   # In Supabase Dashboard → Project Settings → Edge Functions
   # Or via CLI:
   
   supabase secrets set STRIPE_SECRET_KEY=sk_test_your_key_here
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
   ```

2. **Deploy Edge Functions**
   ```bash
   cd /Users/myomyokhant/Documents/flowwing_cms
   
   # Deploy the audit checkout function
   supabase functions deploy create-audit-checkout
   
   # Deploy the webhook handler
   supabase functions deploy stripe-webhook
   ```

3. **Run Migration**
   ```bash
   # Apply the new status values migration
   supabase db push
   
   # Or manually via Supabase Dashboard → SQL Editor:
   # Run the contents of supabase/migrations/20251219_add_payment_status.sql
   ```

### 3. Testing

#### Test Mode (Recommended First)
1. Use Stripe test keys (starts with `sk_test_`)
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date (e.g., 12/34)
4. Any 3-digit CVC

#### Test the Flow:
1. Navigate to `http://localhost:8080/audit/start`
2. Fill in the form with test data
3. Click "Start My Audit"
4. Complete payment on Stripe Checkout (use test card)
5. Verify redirect to `/audit/thank-you`
6. Check Supabase Dashboard → Table Editor → audit_signups
7. Confirm status changed to "payment_received"

### 4. Webhook Testing (Local Development)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local Supabase function
stripe listen --forward-to https://[YOUR-PROJECT-ID].supabase.co/functions/v1/stripe-webhook
```

## Database Schema

### audit_signups Table Status Values:

| Status | Description |
|--------|-------------|
| `pending` | Created, awaiting payment |
| `payment_received` | Payment successful, ready for processing |
| `payment_failed` | Payment failed or declined |
| `planning` | Team is planning the audit |
| `in_progress` | Audit analysis in progress |
| `review` | Internal review stage |
| `completed` | Audit delivered to customer |

### Key Fields:
- `stripe_payment_id`: Stores the Stripe PaymentIntent ID
- `status`: Tracks workflow stage
- `email`: Customer email
- `company_name`: Business name
- `social_handles`: JSON object with social media URLs

## Troubleshooting

### Payment Not Confirming
- Check Stripe webhook is active and endpoint URL is correct
- Verify webhook secret is set correctly in Supabase secrets
- Check Supabase Edge Function logs
- Ensure webhook events are enabled: `checkout.session.completed`

### Edge Function Errors
```bash
# View function logs
supabase functions logs create-audit-checkout
supabase functions logs stripe-webhook
```

### Database Not Updating
- Verify service role key has proper permissions
- Check RLS policies on audit_signups table
- Ensure migration was applied successfully

## Production Checklist

- [ ] Replace Stripe test keys with live keys
- [ ] Update webhook endpoint to production URL
- [ ] Test complete flow in production
- [ ] Set up monitoring/alerts for failed payments
- [ ] Configure email notifications (via n8n)
- [ ] Set up revenue reporting

## Price Configuration

Current price: **$100 USD** (10000 cents)

To change the price, edit:
```typescript
// supabase/functions/create-audit-checkout/index.ts
unit_amount: 10000, // Change this value (in cents)
```

## Security Notes

- ✅ Edge functions use JWT verification disabled (public access needed)
- ✅ Service role key used for database writes (webhook doesn't have user session)
- ✅ Webhook signature verification prevents unauthorized requests
- ✅ Customer data encrypted at rest in Supabase
- ✅ PCI compliance handled by Stripe

## Next Steps

After payment is confirmed, you'll want to:
1. Set up n8n workflow to process paid audits
2. Send confirmation email to customer
3. Notify team via Slack
4. Generate and deliver audit report

## Support

For issues:
- Check Supabase logs: Project Dashboard → Logs
- Check Stripe logs: Dashboard → Developers → Logs
- Review webhook attempts: Dashboard → Webhooks → [Your endpoint]
