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
      const [auditsResult, clientsResult, postsResult, approvalsResult] = await Promise.all([
        supabase.from('audit_signups').select('status'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('content_posts').select('status'),
        supabase
          .from('content_posts')
          .select('status')
          .eq('status', CONTENT_STATUS.REVIEW),
      ]);

      // Handle errors
      if (auditsResult.error) throw auditsResult.error;
      if (clientsResult.error) throw clientsResult.error;
      if (postsResult.error) throw postsResult.error;
      if (approvalsResult.error) throw approvalsResult.error;

      // Calculate stats
      const audits = auditsResult.data || [];
      const posts = postsResult.data || [];

      const stats: DashboardStats = {
        pendingAudits: audits.filter((a) => a.status === AUDIT_STATUS.PENDING).length,
        auditsInProgress: audits.filter((a) => a.status === AUDIT_STATUS.IN_PROGRESS).length,
        activeClients: clientsResult.count || 0,
        pendingApprovals: approvalsResult.data?.length || 0,
        totalPosts: posts.length,
        publishedPosts: posts.filter((p) => p.status === CONTENT_STATUS.PUBLISHED).length,
      };

      return stats;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }
}
