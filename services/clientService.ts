/**
 * Client Service
 * CRUD operations for clients and brand profiles
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { BaseService } from './baseService';
import {
  Client,
  ClientFull,
  ClientFormData,
  ClientFilters,
  PaginationParams,
  PaginatedResponse,
  BrandProfile,
  BrandProfileFormData,
} from '@/types';

export class ClientService extends BaseService {
  // ============================================================================
  // CLIENT CRUD
  // ============================================================================

  /**
   * Get all clients with filters and pagination
   */
  static async getClients(
    supabase: SupabaseClient,
    filters?: ClientFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<ClientFull>> {
    try {
      let query = supabase
        .from('clients_full')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters) {
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`);
        }
        if (typeof filters.is_active === 'boolean') {
          query = query.eq('is_active', filters.is_active);
        }
      }

      // Apply sorting and pagination
      query = this.applySorting(query, pagination || {}, 'name', 'asc');
      query = this.applyPagination(query, pagination || {});

      const { data, error, count } = await query;

      if (error) throw error;

      return this.paginate(
        (data as ClientFull[]) || [],
        count || 0,
        pagination || {}
      );
    } catch (error) {
      this.handleError(error, 'ClientService.getClients');
    }
  }

  /**
   * Get client by ID
   */
  static async getClientById(
    supabase: SupabaseClient,
    id: string
  ): Promise<ClientFull | null> {
    try {
      const { data, error } = await supabase
        .from('clients_full')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as ClientFull;
    } catch (error) {
      console.error('Failed to fetch client:', error);
      return null;
    }
  }

  /**
   * Get client by user ID (for logged-in clients)
   */
  static async getClientByUserId(
    supabase: SupabaseClient,
    userId: string
  ): Promise<ClientFull | null> {
    try {
      const { data, error } = await supabase
        .from('clients_full')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data as ClientFull;
    } catch (error) {
      console.error('Failed to fetch client by user ID:', error);
      return null;
    }
  }

  /**
   * Create new client
   */
  static async createClient(
    supabase: SupabaseClient,
    data: ClientFormData
  ): Promise<Client> {
    try {
      const { data: client, error } = await supabase
        .from('clients')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return client as Client;
    } catch (error) {
      this.handleError(error, 'ClientService.createClient');
    }
  }

  /**
   * Update client
   */
  static async updateClient(
    supabase: SupabaseClient,
    id: string,
    updates: Partial<ClientFormData>
  ): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Client;
    } catch (error) {
      this.handleError(error, 'ClientService.updateClient');
    }
  }

  /**
   * Delete client
   */
  static async deleteClient(
    supabase: SupabaseClient,
    id: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'ClientService.deleteClient');
    }
  }

  /**
   * Link client to user account
   */
  static async linkUserToClient(
    supabase: SupabaseClient,
    clientId: string,
    userId: string
  ): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({ user_id: userId })
        .eq('id', clientId)
        .select()
        .single();

      if (error) throw error;
      return data as Client;
    } catch (error) {
      this.handleError(error, 'ClientService.linkUserToClient');
    }
  }

  // ============================================================================
  // BRAND PROFILE CRUD
  // ============================================================================

  /**
   * Get brand profile by client ID
   */
  static async getBrandProfile(
    supabase: SupabaseClient,
    clientId: string
  ): Promise<BrandProfile | null> {
    try {
      const { data, error } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      return data as BrandProfile | null;
    } catch (error) {
      console.error('Failed to fetch brand profile:', error);
      return null;
    }
  }

  /**
   * Create brand profile
   */
  static async createBrandProfile(
    supabase: SupabaseClient,
    clientId: string,
    data: BrandProfileFormData
  ): Promise<BrandProfile> {
    try {
      const { data: profile, error } = await supabase
        .from('brand_profiles')
        .insert({
          client_id: clientId,
          ...data,
        })
        .select()
        .single();

      if (error) throw error;
      return profile as BrandProfile;
    } catch (error) {
      this.handleError(error, 'ClientService.createBrandProfile');
    }
  }

  /**
   * Update brand profile
   */
  static async updateBrandProfile(
    supabase: SupabaseClient,
    id: string,
    updates: Partial<BrandProfileFormData>
  ): Promise<BrandProfile> {
    try {
      const { data, error } = await supabase
        .from('brand_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as BrandProfile;
    } catch (error) {
      this.handleError(error, 'ClientService.updateBrandProfile');
    }
  }

  /**
   * Create brand profile from audit
   */
  static async createBrandProfileFromAudit(
    supabase: SupabaseClient,
    clientId: string,
    auditSignupId: string,
    auditData: {
      brand_name: string;
      brand_voice?: any;
      target_audience?: any;
      keywords?: string[];
      content_pillars?: string[];
    }
  ): Promise<BrandProfile> {
    try {
      const { data: profile, error } = await supabase
        .from('brand_profiles')
        .insert({
          client_id: clientId,
          audit_signup_id: auditSignupId,
          brand_name: auditData.brand_name,
          brand_voice: auditData.brand_voice || {},
          target_audience: auditData.target_audience || [],
          keywords: auditData.keywords || [],
          content_pillars: auditData.content_pillars || [],
        })
        .select()
        .single();

      if (error) throw error;
      return profile as BrandProfile;
    } catch (error) {
      this.handleError(error, 'ClientService.createBrandProfileFromAudit');
    }
  }

  // ============================================================================
  // AUDIT CONVERSION
  // ============================================================================

  /**
   * Convert audit signup to client
   */
  static async convertAuditToClient(
    supabase: SupabaseClient,
    auditSignupId: string
  ): Promise<{ client: Client; brandProfile: BrandProfile }> {
    try {
      // Get audit signup data
      const { data: auditSignup, error: auditError } = await supabase
        .from('audit_signups')
        .select('*')
        .eq('id', auditSignupId)
        .single();

      if (auditError) throw auditError;

      // Create client
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({
          name: auditSignup.company_name || auditSignup.email.split('@')[0],
          email: auditSignup.email,
          company_name: auditSignup.company_name,
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Get audit brand review if exists
      const { data: auditRun } = await supabase
        .from('audit_runs')
        .select('id')
        .eq('audit_signup_id', auditSignupId)
        .single();

      let brandReviewData = {};
      if (auditRun) {
        const { data: brandReview } = await supabase
          .from('audit_brand_reviews')
          .select('*')
          .eq('audit_run_id', auditRun.id)
          .single();

        if (brandReview) {
          brandReviewData = {
            brand_voice: {
              tone: brandReview.brand_clarity?.tone || [],
              personality: [],
              dos: [],
              donts: [],
              example_phrases: [],
            },
            keywords: brandReview.content_patterns || [],
            content_pillars: brandReview.strategic_focus_areas || [],
          };
        }
      }

      // Create brand profile
      const { data: brandProfile, error: brandError } = await supabase
        .from('brand_profiles')
        .insert({
          client_id: client.id,
          audit_signup_id: auditSignupId,
          brand_name: auditSignup.company_name || 'Brand',
          ...brandReviewData,
        })
        .select()
        .single();

      if (brandError) throw brandError;

      // Update audit signup with client reference
      await supabase
        .from('audit_signups')
        .update({ converted_to_client_id: client.id })
        .eq('id', auditSignupId);

      return {
        client: client as Client,
        brandProfile: brandProfile as BrandProfile,
      };
    } catch (error) {
      this.handleError(error, 'ClientService.convertAuditToClient');
    }
  }

  // ============================================================================
  // STATS
  // ============================================================================

  /**
   * Get client stats
   */
  static async getStats(
    supabase: SupabaseClient
  ): Promise<{ total: number; active: number; withContent: number }> {
    try {
      const { data, error } = await supabase
        .from('clients_full')
        .select('is_active, total_content');

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        active: data?.filter((c: any) => c.is_active).length || 0,
        withContent: data?.filter((c: any) => c.total_content > 0).length || 0,
      };

      return stats;
    } catch (error) {
      this.handleError(error, 'ClientService.getStats');
    }
  }
}
