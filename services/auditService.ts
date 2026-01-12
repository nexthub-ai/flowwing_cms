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
 * Audit Run interface
 */
export interface AuditRun {
  id: string;
  audit_signup_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  report_url: string | null;
  review_url: string | null;
  delivered_at: string | null;
  created_at: string;
}

/**
 * Audit Brand Review interface
 */
export interface AuditBrandReview {
  id: string;
  audit_run_id: string;
  executive_summary: any;
  overall_score: number | null;
  brand_clarity: any;
  strategic_focus_areas: any;
  solutions: any;
  inspiration_guidance: any;
  next_30_day_focus: any;
  platforms: any;
  content_patterns: any;
  platform_priority_order: any;
  created_at: string;
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

  /**
   * Get all audit runs
   */
  static async getAllAuditRuns(
    supabase: SupabaseClient
  ): Promise<AuditRun[]> {
    try {
      const { data, error } = await supabase
        .from('audit_runs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as AuditRun[]) || [];
    } catch (error) {
      console.error('Failed to fetch audit runs:', error);
      throw error;
    }
  }

  /**
   * Get audit runs for a specific signup
   */
  static async getAuditRunsBySignupId(
    supabase: SupabaseClient,
    signupId: string
  ): Promise<AuditRun[]> {
    try {
      const { data, error } = await supabase
        .from('audit_runs')
        .select('*')
        .eq('audit_signup_id', signupId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as AuditRun[]) || [];
    } catch (error) {
      console.error('Failed to fetch audit runs:', error);
      throw error;
    }
  }

  /**
   * Get all brand reviews with audit run details
   */
  static async getAllBrandReviews(
    supabase: SupabaseClient
  ): Promise<AuditBrandReview[]> {
    try {
      const { data, error } = await supabase
        .from('audit_brand_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data as AuditBrandReview[]) || [];
    } catch (error) {
      console.error('Failed to fetch brand reviews:', error);
      throw error;
    }
  }

  /**
   * Get brand review for a specific audit run
   */
  static async getBrandReviewByRunId(
    supabase: SupabaseClient,
    runId: string
  ): Promise<AuditBrandReview | null> {
    try {
      const { data, error } = await supabase
        .from('audit_brand_reviews')
        .select('*')
        .eq('audit_run_id', runId)
        .single();

      if (error) throw error;
      return data as AuditBrandReview;
    } catch (error) {
      console.error('Failed to fetch brand review:', error);
      return null;
    }
  }
}
