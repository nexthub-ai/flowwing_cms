import { Navbar } from '@/components/layout/Navbar';
import { Shield } from 'lucide-react';

/**
 * Admin Page
 * Placeholder - to be implemented with admin features
 * Should check for admin role before allowing access
 */
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-1">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage users, roles, and system settings
            </p>
          </div>

          <div className="flex items-center justify-center h-64 bg-card border border-border/50 rounded-xl">
            <div className="text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Admin panel coming soon
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
