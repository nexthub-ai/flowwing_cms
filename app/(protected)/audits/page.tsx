'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Loader2, Eye, FileText } from 'lucide-react';
import { createClient } from '@/supabase/client';
import { AuditService, AuditSignup } from '@/services/auditService';
import { STATUS_COLORS } from '@/constants/constants';
import { useToast } from '@/hooks/use-toast';

/**
 * Audits Page (Client Component)
 * Manages audit signups with service layer architecture
 */
export default function AuditsPage() {
  const { toast } = useToast();
  const [audits, setAudits] = useState<AuditSignup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      const data = await AuditService.getAuditSignups(supabase);
      setAudits(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load audits',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAudits = audits.filter(
    (audit) =>
      audit.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold mb-1">Audits</h1>
              <p className="text-muted-foreground">
                Manage and track all social media audits
              </p>
            </div>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Audit
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audits..."
                className="pl-10 bg-secondary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Table */}
          {!isLoading && (
            <div className="rounded-xl bg-card border border-border/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Client
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Company
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Status
                      </th>
                      <th className="text-left text-sm font-medium text-muted-foreground px-6 py-4">
                        Created
                      </th>
                      <th className="text-right text-sm font-medium text-muted-foreground px-6 py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAudits.map((audit) => (
                      <tr
                        key={audit.id}
                        className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{audit.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm">
                            {audit.company_name || 'N/A'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={STATUS_COLORS[audit.status]}>
                            {audit.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-muted-foreground">
                            {new Date(audit.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredAudits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No audits found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
