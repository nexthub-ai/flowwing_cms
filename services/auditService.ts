import { SupabaseClient } from '@supabase/supabase-js';
import { AUDIT_STATUS, AuditStatus } from '@/constants/constants';

/**
 * Audit Signup interface
 */
export interface AuditSignup {
  id: string;
  user_id: string | null;
  email: string;
  company_name: string | null;
  social_handles: Record<string, string> | null;
  status: AuditStatus;
  assigned_to: string | null;
  notes: string | null;
  stripe_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Audit statistics by status
 */
export interface AuditStats {
  [AUDIT_STATUS.PENDING]: number;
  [AUDIT_STATUS.PLANNING]: number;
  [AUDIT_STATUS.IN_PROGRESS]: number;
  [AUDIT_STATUS.REVIEW]: number;
  [AUDIT_STATUS.COMPLETED]: number;
}

/**
 * Service for audit operations
 * Follows clean architecture: Component → Service → Database
 */
export class AuditService {
  /**
   * Fetch audit signups with optional status filter
   */
  static async getAuditSignups(
    supabase: SupabaseClient,
    status?: AuditStatus
  ): Promise<AuditSignup[]> {
    try {
      let query = supabase
        .from('audit_signups')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data as AuditSignup[]) || [];
    } catch (error) {
      console.error('Failed to fetch audit signups:', error);
      throw error;
    }
  }

  /**
   * Get count of audits by status
   */
  static async getAuditStats(supabase: SupabaseClient): Promise<AuditStats> {
    try {
      const { data, error } = await supabase
        .from('audit_signups')
        .select('status');

      if (error) throw error;

      // Initialize stats
      const stats: AuditStats = {
        [AUDIT_STATUS.PENDING]: 0,
        [AUDIT_STATUS.PLANNING]: 0,
        [AUDIT_STATUS.IN_PROGRESS]: 0,
        [AUDIT_STATUS.REVIEW]: 0,
        [AUDIT_STATUS.COMPLETED]: 0,
      };

      // Count by status
      data?.forEach((audit) => {
        if (audit.status in stats) {
          stats[audit.status as AuditStatus]++;
        }
      });

      return stats;
    } catch (error) {
      console.error('Failed to fetch audit stats:', error);
      throw error;
    }
  }

  /**
   * Update audit status
   */
  static async updateAuditStatus(
    supabase: SupabaseClient,
    id: string,
    status: AuditStatus
  ): Promise<AuditSignup> {
    try {
      const { data, error } = await supabase
        .from('audit_signups')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as AuditSignup;
    } catch (error) {
      console.error('Failed to update audit status:', error);
      throw error;
    }
  }

  /**
   * Get a single audit by ID
   */
  static async getAuditById(
    supabase: SupabaseClient,
    id: string
  ): Promise<AuditSignup | null> {
    try {
      const { data, error } = await supabase
        .from('audit_signups')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as AuditSignup;
    } catch (error) {
      console.error('Failed to fetch audit:', error);
      return null;
    }
  }
}
