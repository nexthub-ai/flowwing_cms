/**
 * Custom hook for fetching audit signups
 * Senior pattern: Centralize data fetching logic
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AUDIT_STATUS, QUERY_KEYS, AuditStatus } from '@/constants';

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
 * Fetch audit signups with optional status filter
 */
export function useAuditSignups(status?: AuditStatus) {
  return useQuery({
    queryKey: [QUERY_KEYS.AUDIT_SIGNUPS, status],
    queryFn: async () => {
      let query = supabase
        .from('audit_signups')
        .select('*')
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AuditSignup[];
    },
  });
}

/**
 * Get count of audits by status
 */
export function useAuditStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.AUDIT_SIGNUPS, 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_signups')
        .select('status');

      if (error) throw error;

      // Count by status
      const stats = {
        [AUDIT_STATUS.PENDING]: 0,
        [AUDIT_STATUS.PLANNING]: 0,
        [AUDIT_STATUS.IN_PROGRESS]: 0,
        [AUDIT_STATUS.REVIEW]: 0,
        [AUDIT_STATUS.COMPLETED]: 0,
      };

      data.forEach((audit) => {
        if (audit.status in stats) {
          stats[audit.status as AuditStatus]++;
        }
      });

      return stats;
    },
  });
}

/**
 * Update audit status
 */
export function useUpdateAuditStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AuditStatus }) => {
      const { data, error } = await supabase
        .from('audit_signups')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all audit queries to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUDIT_SIGNUPS] });
    },
  });
}
