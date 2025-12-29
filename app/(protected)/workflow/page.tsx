import { Navbar } from '@/components/layout/Navbar';
import { GitBranch } from 'lucide-react';

/**
 * Workflow Page
 * Placeholder - to be implemented with WorkflowService
 */
export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-1">Workflow</h1>
            <p className="text-muted-foreground">
              Manage your content approval workflow
            </p>
          </div>

          <div className="flex items-center justify-center h-64 bg-card border border-border/50 rounded-xl">
            <div className="text-center">
              <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Workflow management coming soon
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
