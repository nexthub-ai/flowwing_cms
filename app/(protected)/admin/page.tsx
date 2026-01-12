import { Sidebar } from '@/components/layout/Sidebar';
import { Shield } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="container py-8 px-6">
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
