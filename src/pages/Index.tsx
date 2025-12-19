import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { AuditForm } from "@/components/landing/AuditForm";
import { forwardRef } from "react";

const FeaturesSection = forwardRef<HTMLElement>((props, ref) => (
  <section ref={ref}>
    <Features />
  </section>
));
FeaturesSection.displayName = "FeaturesSection";

const AuditFormSection = forwardRef<HTMLElement>((props, ref) => (
  <section ref={ref}>
    <AuditForm />
  </section>
));
AuditFormSection.displayName = "AuditFormSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <AuditForm />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 AuditFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
