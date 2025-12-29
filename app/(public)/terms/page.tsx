'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth={false} />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          <div className="max-w-4xl">
          
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8">Terms and Conditions</h1>
           
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By purchasing a personal brand audit from FlowWing, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Service Description</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                FlowWing provides personal brand audit services that include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Analysis of public social media profiles</li>
                <li>Content performance evaluation</li>
                <li>Audience insights and demographics</li>
                <li>Actionable recommendations for brand improvement</li>
                <li>Detailed 30-page audit report</li>
                <li>One-hour strategy consultation call</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                The personal brand audit is a one-time payment of $100 USD. Payment is processed securely through Stripe. All sales are final, and we do not offer refunds once the audit has been initiated. Delivery of the audit report is expected within 24-48 hours of payment confirmation.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Account Requirements</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To receive a personal brand audit, you must provide:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Valid email address for report delivery</li>
                <li>At least one public social media account URL</li>
                <li>Accurate brand or company name</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                All provided social media accounts must be publicly accessible. We cannot audit private or restricted accounts.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The audit report and all analysis provided remain the intellectual property of FlowWing. Upon payment, you receive a non-transferable license to use the audit findings for your personal or business brand improvement. You may not resell, redistribute, or republish the audit report.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Data Usage</h2>
              <p className="text-muted-foreground leading-relaxed">
                We analyze publicly available information from your social media profiles. Our audit is based on data accessible at the time of analysis. Social media metrics and engagement rates may change over time, and our recommendations are based on current best practices and platform algorithms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                FlowWing provides audit services and recommendations based on industry best practices. We cannot guarantee specific results or outcomes from implementing our recommendations. Your use of the audit findings is at your own discretion and risk.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Delivery Timeline</h2>
              <p className="text-muted-foreground leading-relaxed">
                We aim to deliver your audit report within 24-48 hours of payment confirmation. Delays may occur due to high demand or complexity of analysis. We will notify you via email if there are any expected delays beyond the standard timeframe.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Confidentiality</h2>
              <p className="text-muted-foreground leading-relaxed">
                We treat all audit reports as confidential. Your audit findings will not be shared with third parties or used for marketing purposes without your explicit consent. We may use anonymized, aggregated data for improving our services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Modifications to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms and Conditions, please contact us at:
                <br />
                <a href="mailto:support@flowwing.com" className="text-primary hover:underline">
                  support@flowwing.com
                </a>
              </p>
            </section>
          </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
