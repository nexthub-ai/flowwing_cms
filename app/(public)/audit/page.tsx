import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { ContentGallery } from "@/components/landing/ContentGallery";
import { Features } from "@/components/landing/Features";
import { TestimonialsEnhanced } from "@/components/landing/TestimonialsEnhanced";
import { PricingSection } from "@/components/landing/PricingSection";

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth={false} />
      <main>
        <Hero />
        <ContentGallery />
        <Features />
        <TestimonialsEnhanced />
        <PricingSection />
      </main>
      
      <Footer />
    </div>
  );
}
