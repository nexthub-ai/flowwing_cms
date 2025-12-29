import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';

/**
 * Clients Page
 * Placeholder - to be implemented with ClientsService
 */
export default function ClientsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">Clients</h1>
              <p className="text-muted-foreground">
                Manage your client relationships
              </p>
            </div>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </div>

          <div className="flex items-center justify-center h-64 bg-card border border-border/50 rounded-xl">
            <div className="text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Client management coming soon
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
