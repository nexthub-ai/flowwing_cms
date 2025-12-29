import { Navbar } from "@/components/layout/Navbar";
import { PricingSection } from "@/components/landing/PricingSection";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuth={false} />
      <main className="pt-16">
        <PricingSection />
      </main>
    </div>
  );
}
