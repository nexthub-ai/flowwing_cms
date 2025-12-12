import { Navbar } from "@/components/layout/Navbar";
import { AuditForm } from "@/components/landing/AuditForm";

const Audit = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <div className="container px-6">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl font-bold mb-4">
              Social Media Audit
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a comprehensive analysis of your social media presence with actionable recommendations to grow your brand.
            </p>
          </div>
        </div>
        <AuditForm />
      </main>
    </div>
  );
};

export default Audit;
