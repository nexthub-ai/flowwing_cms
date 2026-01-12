import { SupabaseClient } from '@supabase/supabase-js';
import { AuditService, AuditRun, AuditBrandReview } from './auditService';

export interface CombinedAuditData {
  signup_id: string;
  run_id: string | null;
  review_id: string | null;
  brand_name: string | null;
  email: string;
  social_handles: Record<string, string> | null;
  run_status: 'in_progress' | 'review' | 'delivered' | null;
  report_url: string | null;
  review_url: string | null;
  brand_review: AuditBrandReview | null;
  created_at: string;
}

/**
 * Service for fetching combined audit data
 */
export class CombinedAuditService {
  /**
   * Fetch all audit data combined (signups + runs + reviews)
   */
  static async getAllCombinedAuditData(
    supabase: SupabaseClient
  ): Promise<CombinedAuditData[]> {
    try {
      // Fetch all data in parallel
      const [signupsResult, runs, reviews] = await Promise.all([
        supabase.from('audit_signups').select('*').order('created_at', { ascending: false }),
        AuditService.getAllAuditRuns(supabase),
        AuditService.getAllBrandReviews(supabase)
      ]);

      if (signupsResult.error) throw signupsResult.error;

      // Combine data
      const combined: CombinedAuditData[] = signupsResult.data.map(signup => {
        const run = runs.find(r => r.audit_signup_id === signup.id);
        const review = run ? reviews.find(r => r.audit_run_id === run.id) : null;

        return {
          signup_id: signup.id,
          run_id: run?.id || null,
          review_id: review?.id || null,
          brand_name: signup.company_name,
          email: signup.email,
          social_handles: signup.social_handles || null,
          run_status: (run?.status as 'in_progress' | 'review' | 'delivered') || null,
          report_url: run?.report_url || null,
          review_url: run?.review_url || null,
          brand_review: review || null,
          created_at: signup.created_at
        };
      });

      return combined;
    } catch (error) {
      console.error('Failed to fetch combined audit data:', error);
      throw error;
    }
  }

  /**
   * Update audit run status
   */
  static async updateRunStatus(
    supabase: SupabaseClient,
    runId: string,
    status: 'in_progress' | 'review' | 'delivered'
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('audit_runs')
        .update({ status })
        .eq('id', runId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to update run status:', error);
      throw error;
    }
  }
}
