import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-secondary/30">
      <div className="container px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Image 
                src="/logo.svg" 
                alt="FlowWing Logo" 
                width={48} 
                height={48} 
                className="transition-transform group-hover:scale-105"
              />
              <span className="font-display text-xl font-bold text-foreground">
                FlowWing
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              AI-powered personal brand audits to help you understand your online presence and grow your influence with data-driven insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/audit/start" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Get Audit
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:support@flowwing.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 FlowWing. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="mailto:support@flowwing.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                support@flowwing.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
