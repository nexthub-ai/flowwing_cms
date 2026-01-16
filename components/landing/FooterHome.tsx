'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const footerLinks = {
  quickLinks: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "License", href: "/license" },
    { label: "Contact Us", href: "#demo" }
  ]
};

export function FooterHome() {
  return (
    <footer className="bg-secondary/30 py-12 border-t border-border">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <Image
                  src="/flowwing-home-logo.png"
                  alt="Flow Wing Logo"
                  width={150}
                  height={50}
                  className="h-12 w-auto"
                />
              </div>
              <p className="text-muted-foreground mb-4">
                Your Content on Cruise Control
              </p>
              <p className="text-sm text-muted-foreground">
                Flow Wing is a AI-Driven Social Media Automation Service.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-muted-foreground mb-2">Email:</p>
              <a
                href="mailto:sully@flowwing.ai"
                className="text-primary hover:underline"
              >
                sully@flowwing.ai
              </a>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Flow Wing
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
