import { NavbarHome } from "@/components/landing/NavbarHome";
import { FooterHome } from "@/components/landing/FooterHome";
import { HeroHome } from "@/components/landing/HeroHome";
import { FeaturesHome } from "@/components/landing/FeaturesHome";
import { PricingHome } from "@/components/landing/PricingHome";
import { IntegrationsHome } from "@/components/landing/IntegrationsHome";
import { TestimonialsHome } from "@/components/landing/TestimonialsHome";
import { FAQHome } from "@/components/landing/FAQHome";
import { SignupHome } from "@/components/landing/SignupHome";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavbarHome />
      <main>
        <HeroHome />
        <div id="features">
          <FeaturesHome />
        </div>
        <div id="pricing">
          <PricingHome />
        </div>
        <div id="integrations">
          <IntegrationsHome />
        </div>
        <TestimonialsHome />
        <FAQHome />
        <SignupHome />
      </main>
      
      <FooterHome />
    </div>
  );
}