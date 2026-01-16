import { SupabaseClient } from '@supabase/supabase-js';
import { AUDIT_STATUS, CONTENT_STATUS } from '@/constants/constants';

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  pendingAudits: number;
  auditsInProgress: number;
  activeClients: number;
  pendingApprovals: number;
  totalPosts: number;
  publishedPosts: number;
}

/**
 * Service for dashboard operations
 * Follows clean architecture: Component → Service → Database
 */
export class DashboardService {
  /**
   * Get aggregated dashboard statistics
   * Fetches data from multiple tables in parallel
   */
  static async getDashboardStats(supabase: SupabaseClient): Promise<DashboardStats> {
    try {
      // Fetch data in parallel for performance
      const [auditsResult, clientsResult, contentResult, approvalsResult] = await Promise.all([
        supabase.from('audit_signups').select('status'),
        supabase.from('clients').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('content').select('status'),
        supabase
          .from('content')
          .select('status')
          .eq('status', CONTENT_STATUS.REVIEW),
      ]);

      // Handle errors
      if (auditsResult.error) throw auditsResult.error;
      if (clientsResult.error) throw clientsResult.error;
      if (contentResult.error) throw contentResult.error;
      if (approvalsResult.error) throw approvalsResult.error;

      // Calculate stats
      const audits = auditsResult.data || [];
      const content = contentResult.data || [];

      const stats: DashboardStats = {
        pendingAudits: audits.filter((a) => a.status === AUDIT_STATUS.PENDING).length,
        auditsInProgress: audits.filter((a) => a.status === AUDIT_STATUS.IN_PROGRESS).length,
        activeClients: clientsResult.count || 0,
        pendingApprovals: approvalsResult.data?.length || 0,
        totalPosts: content.length,
        publishedPosts: content.filter((c) => c.status === CONTENT_STATUS.PUBLISHED).length,
      };

      return stats;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }
}
