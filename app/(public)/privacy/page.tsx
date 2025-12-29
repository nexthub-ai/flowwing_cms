'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth={false} />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          <div className="max-w-4xl">
          
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
           
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                FlowWing ("we", "our", or "us") operates the personal brand audit tool. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our audit services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Information We Collect</h2>
              <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you request a personal brand audit, we collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Email address</li>
                <li>Company or personal brand name</li>
                <li>Social media account URLs (Instagram, TikTok, YouTube, Website)</li>
                <li>Payment information (processed securely through Stripe)</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Conduct comprehensive personal brand audits</li>
                <li>Analyze your social media presence and engagement metrics</li>
                <li>Generate detailed audit reports with actionable recommendations</li>
                <li>Process payments for audit services</li>
                <li>Send audit reports and related communications via email</li>
                <li>Improve our audit methodology and services</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information. Payment processing is handled securely through Stripe, and we do not store your credit card information on our servers.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Stripe:</strong> For secure payment processing</li>
                <li><strong>Supabase:</strong> For data storage and management</li>
                <li><strong>Social Media Platforms:</strong> For publicly available profile analysis</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your audit data for up to 12 months to provide ongoing support and reference. You may request deletion of your data at any time by contacting us at support@flowwing.com.
              </p>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
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
