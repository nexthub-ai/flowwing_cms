/**
 * STRIPE PAYMENT FLOW - QUICK REFERENCE
 * =====================================
 * 
 * USER JOURNEY:
 * 1. User fills audit form at /audit/start
 * 2. Clicks "Start My Audit" button
 * 3. Frontend calls: supabase.functions.invoke("create-audit-checkout")
 * 4. Edge function creates:
 *    - Stripe Customer (or finds existing)
 *    - Audit record in DB (status: "pending")
 *    - Stripe Checkout Session
 * 5. User redirected to Stripe hosted checkout page
 * 6. User completes payment ($100)
 * 7. Stripe fires webhook to: /functions/v1/stripe-webhook
 * 8. Webhook updates audit record (status: "payment_received", adds stripe_payment_id)
 * 9. User redirected to: /audit/thank-you?audit_id=xxx&session_id=xxx
 * 10. Thank you page verifies payment status from DB
 * 
 * DATABASE FLOW:
 * pending (created) → payment_received (paid) → planning → in_progress → review → completed
 *                  ↘ payment_failed (if payment declined)
 * 
 * KEY ENDPOINTS:
 * - POST /functions/v1/create-audit-checkout
 *   Body: { email, company_name, social_handles }
 *   Returns: { url, auditId, sessionId }
 * 
 * - POST /functions/v1/stripe-webhook
 *   Stripe sends: checkout.session.completed
 *   Action: Updates audit_signups.status = "payment_received"
 * 
 * REQUIRED ENV VARS:
 * - STRIPE_SECRET_KEY (sk_test_xxx or sk_live_xxx)
 * - STRIPE_WEBHOOK_SECRET (whsec_xxx)
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY (for webhook writes)
 * 
 * TEST CARD:
 * - Number: 4242 4242 4242 4242
 * - Expiry: Any future date
 * - CVC: Any 3 digits
 * 
 * DEPLOYMENT COMMANDS:
 * supabase secrets set STRIPE_SECRET_KEY=sk_test_xxx
 * supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
 * supabase functions deploy create-audit-checkout
 * supabase functions deploy stripe-webhook
 * supabase db push
 * 
 * MONITORING:
 * - Supabase logs: Dashboard → Logs → Edge Functions
 * - Stripe logs: Dashboard → Developers → Logs
 * - Database: audit_signups table (watch status changes)
 * 
 * COMMON ISSUES:
 * 1. Payment not confirming
 *    → Check webhook is receiving events in Stripe dashboard
 *    → Verify webhook secret matches
 *    → Check edge function logs
 * 
 * 2. Database not updating
 *    → Verify service role key permissions
 *    → Check RLS policies on audit_signups
 *    → Review webhook logs
 * 
 * 3. Checkout not opening
 *    → Verify STRIPE_SECRET_KEY is set
 *    → Check network tab for function errors
 *    → Ensure function is deployed
 */

export const STRIPE_CONFIG = {
  PRICE_CENTS: 10000, // $100.00
  CURRENCY: "usd",
  PRODUCT_NAME: "Social Media Audit",
  SUCCESS_URL_TEMPLATE: "/audit/thank-you?session_id={CHECKOUT_SESSION_ID}&audit_id=",
  CANCEL_URL: "/audit/start?canceled=true",
} as const;

export type AuditStatus = 
  | "pending" 
  | "payment_received" 
  | "payment_failed" 
  | "planning" 
  | "in_progress" 
  | "review" 
  | "completed";
